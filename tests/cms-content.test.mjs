import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
import { h, json, renderMarkdown } from '../cms-content.mjs';

test('CMS text and Markdown cannot inject HTML or unsafe links', () => {
  assert.equal(h('<img src=x onerror="alert(1)"> &'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp;');
  assert(!json({ text: '</script><script>alert(1)</script>' }).includes('</script>'));
  const rendered = renderMarkdown('**Bold**\n\n<script>alert(1)</script>\n\n[link](javascript:alert(1))');
  assert(rendered.includes('<strong>Bold</strong>'));
  assert(!rendered.includes('<script>'));
  assert(!rendered.includes('href="javascript:'));
  assert.throws(() => renderMarkdown('![test](https://example.org/external.png)'), /choose an image/);
});

test('content edits, additions, removals, Markdown, dates and shared settings reach the built pages', () => {
  const temp = mkdtempSync(join(tmpdir(), 'aarav-cms-test-'));
  const content = join(temp, 'content'), output = join(temp, 'output');
  cpSync('content', content, { recursive: true });
  const edit = (name, fn) => { const path=join(content, `${name}.json`); const value=JSON.parse(readFileSync(path,'utf8')); fn(value); writeFileSync(path, JSON.stringify(value)); };
  const build = () => execFileSync(process.execPath, ['build.mjs'], { env: { ...process.env, CMS_CONTENT_DIR: content, CMS_OUTPUT_DIR: output }, stdio: 'pipe' });
  const html = name => readFileSync(join(output, `${name}.html`), 'utf8');
  const payload = (name,id) => JSON.parse(html(name).match(new RegExp(`<script type="application/json" id="${id}">([\\s\\S]*?)</script>`))[1]);
  try {
    edit('home', v => {
      v.heroTitle = 'A new beginning\nMove & breathe';
      Object.assign(v.heroSlides[1], {
        title: 'Practise <together>', mobileImage: '/assets/uploads/hero.webp',
        buttonLabel: 'Meet & learn', buttonPage: 'instructors.html',
        secondaryLabel: '', position: 'top-right', mobilePosition: 'middle-center', alignment: 'center',
      });
      v.heroSlider = { autoplay: false, interval: 7000, transition: 'slide', speed: 400 };
    });
    edit('classes', v => { v.items.push({...v.items[0], name: 'Test & Restore', timings: 'Monday 7 AM', price: '₹500', instructor: 'New Teacher', studio: 'New Studio'}); });
    edit('events', v => { Object.assign(v.items[0], { title: 'A & B </script>', date: '2026-11-01T07:00:00+05:30', location: 'Studio A', registrationUrl: 'https://example.org/register?event=1&source=site' }); });
    edit('blogs', v => { v.items[0].body = '## New article\n\n**Bold text** and [a safe link](https://example.org).'; });
    edit('instructors', v => { v.items[0].biography = 'A new teacher biography'; });
    edit('settings', v => { v.whatsapp = '919999999999'; v.email = 'studio@example.org'; v.phone = '+919999999999'; v.phoneDisplay = '+91 99999 99999'; });
    edit('seo', v => { v.classes.title = 'Yoga & classes'; });
    edit('gallery', v => { v.items.pop(); });
    edit('testimonials', v => { v.items = []; });
    mkdirSync(join(output,'assets','uploads'), {recursive:true});
    writeFileSync(join(output,'assets','uploads','deleted-image.png'),'old upload');
    build();
    assert(html('index').includes('<span>A new beginning</span><span>Move &amp; breathe</span>'));
    assert(html('index').includes('Practise &lt;together&gt;'));
    assert(html('index').includes('href="instructors.html">Meet &amp; learn</a>'));
    assert(html('index').includes('data-position="top-right" data-mobile-position="middle-center" data-alignment="center"'));
    assert(html('index').includes('<source media="(max-width: 760px)" srcset="/assets/uploads/hero.webp">'));
    assert(html('index').includes('data-transition="slide" data-interval="7000" data-speed="400" data-autoplay="false"'));
    assert(existsSync(join(output, 'vendor', 'splide.min.js')));
    assert(existsSync(join(output, 'vendor', 'splide-LICENSE.txt')));
    assert(html('classes').includes('Test &amp; Restore'));
    assert(html('classes').includes('Monday 7 AM'));
    assert(html('classes').includes('<title>Yoga &amp; classes</title>'));
    assert(html('instructors').includes('A new teacher biography'));
    assert.equal((html('gallery').match(/data-image=/g) || []).length, 2);
    for (const page of ['index','classes','events','contacts']) {
      assert(html(page).includes('studio@example.org'));
      assert(html(page).includes('https://wa.me/919999999999'));
      assert(!html(page).includes('https://wa.me/919958834005'));
    }
    const event = payload('events','event-data')[0];
    assert.equal(event.title, 'A & B </script>');
    assert.equal(event.registrationUrl, 'https://example.org/register?event=1&source=site');
    assert(event.dateLabel.includes('2026'));
    assert(payload('blogs','article-data')[0].html.includes('<strong>Bold text</strong>'));
    assert(existsSync(join(output,'admin','index.html')));
    assert(existsSync(join(output,'assets','uploads')));
    assert(!existsSync(join(output,'assets','uploads','deleted-image.png')));
    edit('home', v => { v.heroSlides = [v.heroSlides[1]]; });
    build();
    assert.equal((html('index').match(/class="splide__slide hero-slide"/g) || []).length, 1);
    assert(!html('index').includes('class="quiet-action"'));
    edit('home', v => { v.heroSlider.interval = 1; });
    assert.throws(build, /heroSlider.interval: invalid number/);
    edit('home', v => { v.heroSlider.interval = 6000; v.heroSlider.autoplay = 'true'; });
    assert.throws(build, /expected true or false/);
    edit('home', v => { v.heroSlider.autoplay = true; v.heroSlides[0].buttonPage = 'javascript:alert(1)'; });
    assert.throws(build, /invalid option/);
    edit('home', v => { v.heroSlides[0].buttonPage = 'classes.html'; v.heroSlides[0].position = 'invalid-position'; });
    assert.throws(build, /invalid option/);
    edit('home', v => { v.heroSlides[0].position = 'bottom-left'; v.heroSlides = []; });
    assert.throws(build, /invalid list length/);
    edit('home', v => { v.heroSlides = [JSON.parse(readFileSync('content/home.json', 'utf8')).heroSlides[0]]; });
    edit('settings', v => { v.instagram = 'javascript:alert(1)'; });
    assert.throws(build, /Use a complete https/);
  } finally {
    const path = resolve(temp);
    assert(path.startsWith(resolve(tmpdir()) + sep) && path.includes('aarav-cms-test-'));
    rmSync(path, { recursive: true, force: true });
  }
});
