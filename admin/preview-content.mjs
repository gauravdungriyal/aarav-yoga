import { h, lines, json, escapeTree, createMarkdown, dateLabel, renderSeo } from '../content-format.mjs';

export { h, lines, json, dateLabel };
export let raw = {};
export let data = {};
export function setPreviewContent(value) {
  raw = value;
  data = escapeTree(value);
}
export const renderMarkdown = createMarkdown(value => {
  if (typeof value !== 'string' || !/^(?:\/?assets\/|blob:|data:image\/)/i.test(value) || value.includes('..')) throw Error('Choose a local blog image.');
});
export const seoHead = page => renderSeo(raw, page, location.origin);
