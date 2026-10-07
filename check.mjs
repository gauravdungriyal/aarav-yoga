import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const pages=['index','about','classes','events','instructors','gallery','blogs','contacts'];
for(const page of pages){const html=readFileSync(`dist/${page}.html`,'utf8');assert(html.includes('<main id="main">'));assert(html.includes('aria-current="page"'));for(const [,url]of html.matchAll(/(?:href|src)="([^"]+)"/g)){if(url.startsWith('data:')||url.startsWith('#')||url.startsWith('http'))continue;assert(existsSync('dist/'+url.split('?')[0]),`Missing ${url} on ${page}`);}for(const navPage of pages)assert(html.includes(`href="${navPage}.html"`),`Missing navigation ${navPage}`);}
execFileSync(process.execPath,['--check','dist/app.js']);
execFileSync(process.execPath,['--check','dist/homepage.js']);
execFileSync(process.execPath,['--check','dist/navigation.js']);
const home=readFileSync('dist/index.html','utf8');
for(const [,anchor]of home.matchAll(/href="#([^\"]+)"/g))assert(home.includes(`id="${anchor}"`),`Missing homepage anchor ${anchor}`);
for(const section of ['home','about','classes','benefits','testimonials','instructors','pricing','contact'])assert(home.includes(`id="${section}"`),`Missing section ${section}`);
for(const color of ['#F2F0E7','#E7E0D5','#20211E','#64645D','#EC8350','#D9D6CC'])assert(readFileSync('dist/homepage.css','utf8').includes(color),`Missing editorial palette ${color}`);
assert(home.includes('not verified customer reviews')&&home.includes('Price coming soon')&&home.includes('Illustrative portrait · profile to be added'),'Missing sample content labels');
for(const color of ['#174D2B','#FAF8F2','#E8EFE4','#F2A51A','#202820','#647064','#FFFFFF','#DCE4D8'])assert(readFileSync('dist/styles.css','utf8').includes(color),`Missing palette ${color}`);
console.log('Verified all 8 pages, navigation, local assets, homepage sections/anchors, both palettes, sample labels, and JavaScript syntax.');
