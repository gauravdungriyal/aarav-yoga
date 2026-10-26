import { renderPage, pageSlugs } from './pages.mjs';
import { raw } from './cms-content.mjs';
import { build } from 'esbuild';
import { mkdirSync, writeFileSync, copyFileSync, cpSync, readdirSync, existsSync, unlinkSync, readFileSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
const out = process.env.CMS_OUTPUT_DIR || 'dist';
mkdirSync(`${out}/assets`, { recursive: true });
for (const name of ['styles.css', 'hero.css', 'app.js', 'homepage.css', 'homepage.js', 'hero-slider.css', 'hero-slider.js', 'navigation.css', 'navigation.js', 'contact.css', 'contact.js', 'footer.css']) copyFileSync(name, `${out}/${name}`);
mkdirSync(`${out}/vendor`, { recursive: true });
copyFileSync('node_modules/@splidejs/splide/dist/js/splide.min.js', `${out}/vendor/splide.min.js`);
copyFileSync('node_modules/@splidejs/splide/dist/css/splide-core.min.css', `${out}/vendor/splide-core.min.css`);
copyFileSync('node_modules/@splidejs/splide/LICENSE', `${out}/vendor/splide-LICENSE.txt`);
copyFileSync('logo/logo.png', `${out}/assets/logo.png`);
mkdirSync(`${out}/assets/instructors`, { recursive: true });
for (let i = 1; i <= 8; i++) copyFileSync(`assets/instructors/teacher-${i}.jpg`, `${out}/assets/instructors/teacher-${i}.jpg`);
cpSync('admin', `${out}/admin`, { recursive: true, filter: source => !source.endsWith('.mjs') });
writeFileSync(`${out}/admin/preview-data.json`, JSON.stringify({ content: raw, schema: JSON.parse(readFileSync('admin/config.json', 'utf8')) }));
await build({
  entryPoints: ['admin/previews.mjs'], outfile: `${out}/admin/previews.js`,
  bundle: true, minify: true, platform: 'browser', format: 'iife',
  globalName: 'AaravPreviews', target: 'es2022',
  plugins: [{ name: 'preview-content', setup(builder) {
    builder.onResolve({ filter: /cms-content\.mjs$/ }, () => ({ path: resolve('admin/preview-content.mjs') }));
  } }],
});
const previewPackages = ['markdown-it','argparse','entities','linkify-it','mdurl','punycode.js','uc.micro'];
writeFileSync(`${out}/admin/preview-LICENSES.txt`, previewPackages.map(name => {
  const directory = `node_modules/${name}`;
  const license = readdirSync(directory).find(file => /^LICENSE(?:-MIT)?(?:\.txt)?$/i.test(file));
  if (!license) throw Error(`Missing preview dependency license: ${name}`);
  return `${name}\n\n${readFileSync(`${directory}/${license}`, 'utf8')}`;
}).join('\n\n----------------------------------------\n\n'));
// Remove deleted uploads from generated output, including images tracked in an older build.
const uploadOutput = resolve(out, 'assets/uploads');
const uploadSource = resolve('assets/uploads');
if (!uploadOutput.startsWith(resolve(out) + sep) || uploadOutput === uploadSource) throw Error('Unsafe upload output path');
function pruneUploads(directory) {
  if (!existsSync(directory)) return;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (!path.startsWith(uploadOutput + sep)) throw Error('Unsafe generated upload path');
    if (entry.isDirectory()) pruneUploads(path);
    else if (!existsSync(resolve(uploadSource, relative(uploadOutput, path)))) unlinkSync(path);
  }
}
pruneUploads(uploadOutput);
cpSync('assets/uploads', `${out}/assets/uploads`, { recursive: true });
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#174D2B"/><path d="M32 13c-12 13-12 24 0 35 12-11 12-22 0-35Z" fill="none" stroke="#FAF8F2" stroke-width="3"/><path d="M14 28c0 14 6 21 18 21M50 28c0 14-6 21-18 21" fill="none" stroke="#F2A51A" stroke-width="3" stroke-linecap="round"/></svg>`;
writeFileSync(`${out}/assets/favicon.svg`,icon);
for (const slug of pageSlugs) writeFileSync(`${out}/${slug}.html`, renderPage(slug));
console.log(`Created ${pageSlugs.length} Aarav Yoga pages.`);
