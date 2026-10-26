export const previewPages = {
  home: 'index', about: 'about', classes: 'classes', events: 'events',
  instructors: 'instructors', blogs: 'blogs', gallery: 'gallery',
  studios: 'about', testimonials: 'index', settings: 'contacts', seo: 'index',
};

function imageUrl(value, getAsset) {
  if (typeof value !== 'string' || !value) return '';
  if (!/^\/?assets\//.test(value) || value.includes('..')) return '';
  let asset;
  try { asset = getAsset?.(value)?.toString(); } catch { /* A partially uploaded image may not be ready yet. */ }
  return asset && /^(?:\/?assets\/|blob:|data:image\/)/i.test(asset) ? asset : value;
}

// Incomplete fields are normal while typing. Keep the preview renderable without
// bypassing the stricter validation that still runs when the site is built.
function normalize(fields, draft = {}, defaults = {}, getAsset) {
  const result = {};
  for (const field of fields) {
    const value = draft?.[field.name] ?? defaults?.[field.name] ?? field.default;
    let next;
    if (field.widget === 'object') next = normalize(field.fields, value, defaults?.[field.name], getAsset);
    else if (field.widget === 'list' || field.multiple) {
      const values = Array.isArray(value) ? value : [];
      next = field.fields
        ? values.map((item, i) => normalize(field.fields, item, defaults?.[field.name]?.[i], getAsset))
        : values.filter(item => field.options.includes(item));
    } else if (field.widget === 'image') next = imageUrl(value, getAsset);
    else if (field.widget === 'boolean') next = typeof value === 'boolean' ? value : Boolean(field.default);
    else if (field.widget === 'number') next = Number.isFinite(value) ? Math.max(field.min ?? -Infinity, Math.min(field.max ?? Infinity, value)) : field.default;
    else if (field.widget === 'select') next = field.options.includes(value) ? value : field.default || field.options[0];
    else {
      next = typeof value === 'string' ? value : '';
      if (field.widget === 'datetime' && !Number.isFinite(Date.parse(next))) next = '';
      if (field.pattern && !new RegExp(field.pattern[0]).test(next)) next = '';
      if (['instagram', 'facebook', 'x', 'registrationUrl'].includes(field.name) && next) {
        try { const url = new URL(next); if (url.protocol !== 'https:' || url.username || url.password) next = ''; } catch { next = ''; }
      }
      if (field.widget === 'markdown') next = next.replace(/(!\[[^\]]*\]\()(\/?assets\/[^\s)]+)(\))/g, (_, open, path, close) => `${open}${imageUrl(path, getAsset)}${close}`);
    }
    result[field.name] = next;
  }
  return result;
}

export function preparePreview(seed, name, draft, getAsset) {
  const collection = seed.schema.collections.find(item => item.files[0].name === name);
  if (!collection) throw Error('Unknown content section');
  const content = structuredClone(seed.content);
  content[name] = normalize(collection.files[0].fields, draft, content[name], getAsset);
  // Editor previews stay on the slide being edited rather than changing on a timer.
  content.home.heroSlider.autoplay = false;
  return content;
}

export async function resolvePreviewAssets(seed, name, draft, getAsset, cache = new Map()) {
  const fields = seed.schema.collections.find(item => item.files[0].name === name)?.files[0].fields;
  const paths = new Set();
  function collect(fields, value) {
    for (const field of fields) {
      const item = value?.[field.name];
      if (field.widget === 'image' && typeof item === 'string') paths.add(item);
      if (field.widget === 'object') collect(field.fields, item);
      if (field.widget === 'list' && field.fields && Array.isArray(item)) item.forEach(entry => collect(field.fields, entry));
      if (field.widget === 'markdown' && typeof item === 'string') {
        for (const match of item.matchAll(/!\[[^\]]*\]\((\/?assets\/[^\s)]+)\)/g)) paths.add(match[1]);
      }
    }
  }
  collect(fields, draft);
  const assets = new Map();
  await Promise.all([...paths].map(async path => {
    let asset;
    try { asset = getAsset?.(path)?.toString(); } catch { return; }
    if (!asset?.startsWith('blob:')) return;
    // Opaque sandbox frames cannot load CMS-owned blob URLs. Convert pending
    // uploads in the editor's origin, then pass only image bytes to the preview.
    if (!cache.has(asset)) cache.set(asset, (async () => {
      const response = await fetch(asset);
      if (!response.ok) throw Error('Image is not ready');
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) throw Error('Choose an image');
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(Error('Image could not be previewed'));
        reader.readAsDataURL(blob);
      });
    })());
    try { assets.set(path, await cache.get(asset)); }
    catch (error) { cache.delete(asset); throw error; }
  }));
  return path => assets.get(path) || getAsset?.(path);
}
