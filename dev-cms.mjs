import { spawn, execFileSync } from 'node:child_process';
import { watch } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
execFileSync(process.execPath, ['build.mjs'], { stdio: 'inherit' });
const children = [
  spawn(process.execPath, ['serve.mjs'], { stdio: 'inherit', windowsHide: true }),
  spawn(process.execPath, [require.resolve('decap-server')], { stdio: 'inherit', windowsHide: true, env: { ...process.env, BIND_HOST: '127.0.0.1' } })
];
let timer, closing = false;
const watchers = ['content', 'assets/uploads'].map(path => watch(path, { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    try { execFileSync(process.execPath, ['build.mjs'], { stdio: 'inherit' }); console.log('Content rebuilt. Refresh the website preview.'); }
    catch { console.error('Content could not be rebuilt. Correct the reported field and save again.'); }
  }, 350);
}));
function stop(code = 0) {
  if (closing) return;
  closing = true;
  clearTimeout(timer);
  watchers.forEach(w => w.close());
  children.forEach(child => child.kill());
  process.exitCode = code;
}
children.forEach(child => { child.on('error', () => stop(1)); child.on('exit', code => stop(code || 0)); });
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
console.log('Local CMS: http://127.0.0.1:4173/admin/ — saves edit local files only.');
