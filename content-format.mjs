import MarkdownIt from 'markdown-it';

export const h = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const lines = value => h(value).replace(/\r?\n/g, '<br>');
export const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
export const escapeTree = value => Array.isArray(value) ? value.map(escapeTree) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k,v]) => [k, escapeTree(v)])) : typeof value === 'string' ? h(value) : value;
export function createMarkdown(validateImage) {
  const markdown = new MarkdownIt({ html: false, linkify: false, breaks: false });
  markdown.renderer.rules.image = (tokens, idx, options, env, self) => {
    validateImage(tokens[idx].attrGet('src'), 'Blog image');
    return self.renderToken(tokens, idx, options);
  };
  return value => markdown.render(value || '');
}
export const dateLabel = value => value ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(value)) : 'Coming soon';
export function renderSeo(raw, page, siteUrl) {
  const seo = raw.seo[page];
  return `<title>${h(seo.title)}</title><meta name="description" content="${h(seo.description)}"><meta property="og:title" content="${h(seo.title)}"><meta property="og:description" content="${h(seo.description)}">${seo.image ? `<meta property="og:image" content="${h(new URL(seo.image, siteUrl).href)}">` : ''}`;
}
