import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const pages=['index','about','classes','events','instructors','gallery','blogs','contacts'];
for(const page of pages){const html=readFileSync(`dist/${page}.html`,'utf8');assert(html.includes('<main id="main">'));assert(html.includes('aria-current="page"'));for(const [,url]of html.matchAll(/(?:href|src)="([^"]+)"/g)){if(url.startsWith('data:')||url.startsWith('#')||url.startsWith('http'))continue;assert(existsSync('dist/'+url.split('?')[0]),`Missing ${url} on ${page}`);}for(const navPage of pages)assert(html.includes(`href="${navPage}.html"`),`Missing navigation ${navPage}`);}
execFileSync(process.execPath,['--check','dist/app.js']);
for(const color of ['#174D2B','#FAF8F2','#E8EFE4','#F2A51A','#202820','#647064','#FFFFFF','#DCE4D8'])assert(readFileSync('dist/styles.css','utf8').includes(color),`Missing palette ${color}`);
console.log('Verified all 8 pages, navigation, local assets, exact palette, and JavaScript syntax.');
