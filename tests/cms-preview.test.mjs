import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { build } from 'esbuild';
import { resolve } from 'node:path';
import { raw } from '../cms-content.mjs';
import { preparePreview, resolvePreviewAssets } from '../admin/preview-model.mjs';

const schema = JSON.parse(readFileSync('admin/config.json', 'utf8'));
const seed = { schema, content: raw };

test('unsaved previews normalize incomplete fields and uploaded assets without changing published content', () => {
  const home = structuredClone(raw.home);
  home.heroTitle = 'A draft heading';
  home.heroSlides[0].position = 'unsafe-position';
  const preview = preparePreview(seed, 'home', home, () => 'blob:https://yoga.example/new-image');
  assert.equal(preview.home.heroTitle, 'A draft heading');
  assert.equal(preview.home.heroSlides[0].image, 'blob:https://yoga.example/new-image');
  assert.equal(preview.home.heroSlides[0].position, 'bottom-left');
  assert.equal(preview.home.heroSlider.autoplay, false);
  assert.notEqual(raw.home.heroTitle, 'A draft heading');
  const settings = preparePreview(seed, 'settings', {...raw.settings, instagram:'javascript:alert(1)'}, () => 'javascript:alert(1)');
  assert.equal(settings.settings.instagram, '');
  assert.equal(settings.settings.logo, raw.settings.logo);
  assert.throws(() => preparePreview(seed, 'unknown', {}), /Unknown/);
});

test('pending uploads are converted to cached image data for the isolated preview', async () => {
  const previousFetch=globalThis.fetch, previousReader=globalThis.FileReader;
  let reads=0;
  globalThis.fetch=async () => { reads++; return {ok:true,blob:async()=>new Blob(['test image'],{type:'image/png'})}; };
  globalThis.FileReader=class {
    readAsDataURL(blob) { blob.arrayBuffer().then(bytes=>{this.result=`data:${blob.type};base64,${Buffer.from(bytes).toString('base64')}`;this.onload();}); }
  };
  try {
    const path=raw.home.heroSlides[0].image;
    const getAsset=value=>value===path?'blob:https://yoga.example/pending-image':value;
    const cache=new Map();
    const resolved=await resolvePreviewAssets(seed,'home',raw.home,getAsset,cache);
    assert(resolved(path).startsWith('data:image/png;base64,'));
    const again=await resolvePreviewAssets(seed,'home',raw.home,getAsset,cache);
    assert.equal(again(path),resolved(path));
    assert.equal(reads,1);
    assert(preparePreview(seed,'home',raw.home,resolved).home.heroSlides[0].image.startsWith('data:image/png'));
  } finally {
    globalThis.fetch=previousFetch;
    if(previousReader===undefined) delete globalThis.FileReader; else globalThis.FileReader=previousReader;
  }
});

test('the browser preview renders all sections through the shared website templates', async () => {
  const result = await build({
    entryPoints:['admin/previews.mjs'], bundle:true, platform:'browser', format:'iife', globalName:'AaravPreviews', write:false,
    plugins:[{name:'preview-content', setup(builder) { builder.onResolve({filter:/cms-content\.mjs$/}, () => ({path:resolve('admin/preview-content.mjs')})); }}],
  });
  const context = { location:{origin:'https://yoga.example'}, URL, Intl, structuredClone, console, setTimeout, clearTimeout };
  vm.createContext(context);
  vm.runInContext(result.outputFiles[0].text, context);
  const render = (name, draft, page) => context.AaravPreviews.previewDocument(seed, name, draft, page, path => path);
  const cases = [
    ['home','index', value=>{value.heroTitle='Draft & home';}, 'Draft &amp; home'],
    ['about','about', value=>{value.purposeTitle='Draft purpose';}, 'Draft purpose'],
    ['classes','classes', value=>{value.items[0].name='Draft class';}, 'Draft class'],
    ['events','events', value=>{value.items[0].title='Draft event';}, 'Draft event'],
    ['instructors','instructors', value=>{value.items[0].name='Draft instructor';}, 'Draft instructor'],
    ['blogs','blogs', value=>{value.items[0].title='Draft article';value.items[0].body='**Draft body**';}, 'Draft article'],
    ['gallery','gallery', value=>{value.items[0].title='Draft photo';}, 'Draft photo'],
    ['studios','contacts', value=>{value.items[0].name='Draft studio';}, 'Draft studio'],
    ['testimonials','index', value=>{value.items[0].name='Draft reviewer';}, 'Draft reviewer'],
    ['settings','about', value=>{value.siteName='Draft studio name';}, 'Draft studio name'],
    ['seo','classes', value=>{value.classes.heading='Draft page heading';}, 'Draft page heading'],
  ];
  for (const [name, page, edit, expected] of cases) {
    const draft=structuredClone(raw[name]); edit(draft);
    const html=render(name,draft,page);
    assert(html.includes(expected), `Missing ${name} live edit`);
    assert(html.includes('<base href="https://yoga.example/">'));
    assert(html.includes('aarav-preview-scroll'));
    const original=render(name,raw[name],page);
    assert(!original.includes(expected), `${name} draft leaked into another preview`);
  }
  const draft=structuredClone(raw.home);
  draft.heroTitle='<script>window.pwned=true</script>';
  const html=render('home',draft,'index');
  assert(html.includes('&lt;script&gt;window.pwned=true&lt;/script&gt;'));
  assert(!html.includes('<script>window.pwned=true'));
  for (const collection of schema.collections) {
    assert.equal(collection.editor.preview,true);
    assert(collection.files[0].preview_path);
  }
  assert.equal(schema.publish_mode,'editorial_workflow');
  assert.equal(schema.show_preview_links,true);
});

test('Vercel draft link workflow accepts only this project and uses the actual website URL', async () => {
  const workflow=readFileSync('.github/workflows/cms-preview.yml','utf8');
  const script=workflow.split('script: |\n')[1].split('\n').map(line=>line.replace(/^ {12}/,'')).join('\n');
  const run=new (Object.getPrototypeOf(async function(){}).constructor)('context','github',script);
  const calls=[];
  const github={rest:{repos:{createCommitStatus:async value=>calls.push(value)}}};
  const payload={deployment:{environment:'Preview – aarav-yoga-x9f9',sha:'a'.repeat(40)},deployment_status:{state:'success',environment_url:'https://aarav-yoga-x9f9-abc-team.vercel.app/'}};
  const context={payload,repo:{owner:'gauravdungriyal',repo:'aarav-yoga'}};
  await run(context,github);
  assert.equal(calls.length,1);
  assert.equal(calls[0].target_url,'https://aarav-yoga-x9f9-abc-team.vercel.app');
  assert.equal(calls[0].context,schema.backend.preview_context);
  for (const url of ['https://attacker.example','https://aarav-yoga-other.vercel.app','http://aarav-yoga-x9f9-abc.vercel.app','https://user:password@aarav-yoga-x9f9-abc.vercel.app']) {
    payload.deployment_status.environment_url=url;
    await run(context,github);
  }
  payload.deployment.environment='Production – aarav-yoga-x9f9';
  await run(context,github);
  assert.equal(calls.length,1);
});
