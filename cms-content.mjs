import { readFileSync, existsSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import MarkdownIt from 'markdown-it';

export const h = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const lines = value => h(value).replace(/\r?\n/g, '<br>');
export const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
const markdown = new MarkdownIt({ html: false, linkify: false, breaks: false });
// CMS articles may embed only local site images; external links still use markdown-it's safe URL rules.
markdown.renderer.rules.image = (tokens, idx, options, env, self) => {
  validateImage(tokens[idx].attrGet('src'), 'Blog image');
  return self.renderToken(tokens, idx, options);
};
export const renderMarkdown = value => markdown.render(value || '');

function validateImage(value, path) {
  if (!/^\/?assets\/[a-zA-Z0-9_./ -]+\.(?:png|jpe?g|webp|gif|avif|svg)$/i.test(value) || value.includes('..')) throw Error(`${path}: choose an image in assets/`);
  const relative = value.replace(/^\//, '');
  if (!existsSync(relative) && !existsSync(`dist/${relative}`)) throw Error(`${path}: image does not exist: ${value}`);
}
function validate(fields, data, path) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw Error(`${path}: expected an object`);
  for (const f of fields) {
    let v = data[f.name];
    const p = `${path}.${f.name}`;
    if ((v === undefined || v === null || v === '') && f.required === false) { data[f.name] = ''; continue; }
    if (f.widget === 'object') { validate(f.fields, v, p); continue; }
    if (f.widget === 'list' || f.multiple) {
      if (!Array.isArray(v) || v.length < (f.min || 0) || (f.max && v.length > f.max)) throw Error(`${p}: invalid list length`);
      v.forEach((item,i) => f.fields ? validate(f.fields, item, `${p}[${i}]`) : !f.options.includes(item) && fail(`${p}: invalid option`));
      continue;
    }
    if (typeof v !== 'string' || !v.trim()) throw Error(`${p}: text is required`);
    if (f.pattern && !new RegExp(f.pattern[0]).test(v)) throw Error(`${p}: ${f.pattern[1]}`);
    if (f.widget === 'image') validateImage(v, p);
    if (f.widget === 'select' && !f.options.includes(v)) throw Error(`${p}: invalid option`);
    if (f.widget === 'datetime' && !Number.isFinite(Date.parse(v))) throw Error(`${p}: invalid date`);
    if (['instagram','x','facebook','registrationUrl'].includes(f.name)) {
      const url = new URL(v);
      if (url.protocol !== 'https:' || url.username || url.password) throw Error(`${p}: use an HTTPS URL without credentials`);
    }
  }
}
const fail = message => { throw Error(message); };
const schema = JSON.parse(readFileSync(new URL('./admin/config.json', import.meta.url), 'utf8'));
const contentRoot = resolve(process.env.CMS_CONTENT_DIR || 'content');
export const raw = Object.fromEntries(schema.collections.map(collection => {
  const file = collection.files[0];
  const path = resolve(contentRoot, `${file.name}.json`);
  if (!path.startsWith(contentRoot + sep)) throw Error('Invalid content path');
  const value = JSON.parse(readFileSync(path, 'utf8'));
  validate(file.fields, value, file.name);
  return [file.name, value];
}));
const escapeTree = value => Array.isArray(value) ? value.map(escapeTree) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k,v]) => [k, escapeTree(v)])) : typeof value === 'string' ? h(value) : value;
// For template text and attributes only. Use raw when building URLs or JSON payloads.
export const data = escapeTree(raw);
export const dateLabel = value => value ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(value)) : 'Coming soon';
export const seoHead = page => `<title>${data.seo[page].title}</title><meta name="description" content="${data.seo[page].description}"><meta property="og:title" content="${data.seo[page].title}"><meta property="og:description" content="${data.seo[page].description}">${data.seo[page].image ? `<meta property="og:image" content="${h(new URL(raw.seo[page].image, schema.site_url).href)}">` : ''}`;
