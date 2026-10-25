import { data, raw, lines, json, renderMarkdown, seoHead } from './cms-content.mjs';
import { renderAboutIcon } from './about-icons.mjs';
import { renderClasses } from './classes.mjs';
import { renderEvents } from './events.mjs';
import { renderFooter } from './footer.mjs';
import { studios, renderStudios } from './studios.mjs';
import { chatLink, renderWhatsApp } from './contact.mjs';
import { renderHeader, renderMenu } from './navigation.mjs';
import { renderHomepage } from './homepage.mjs';
import { mkdirSync, writeFileSync, copyFileSync, cpSync, readdirSync, existsSync, unlinkSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
const out = process.env.CMS_OUTPUT_DIR || 'dist';
mkdirSync(`${out}/assets`, { recursive: true });
for (const name of ['styles.css', 'hero.css', 'app.js', 'homepage.css', 'homepage.js', 'navigation.css', 'navigation.js', 'contact.css', 'contact.js', 'footer.css']) copyFileSync(name, `${out}/${name}`);
copyFileSync('logo/logo.png', `${out}/assets/logo.png`);
mkdirSync(`${out}/assets/instructors`, { recursive: true });
for (let i = 1; i <= 8; i++) copyFileSync(`assets/instructors/teacher-${i}.jpg`, `${out}/assets/instructors/teacher-${i}.jpg`);
cpSync('admin', `${out}/admin`, { recursive: true });
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
const pages = [['index','Home'],['about','About Us'],['classes','Classes'],['events','Events'],['instructors','Instructors'],['gallery','Gallery'],['blogs','Blogs'],['contacts','Contacts']];
const link = (page) => `${page}.html`;
const button = (text, page, secondary = false) => `<a class="button ${secondary ? 'secondary' : ''}" href="${link(page)}">${text}</a>`;
const eyebrow = (text) => `<p class="eyebrow"><span></span>${text}</p>`;
const heading = (title) => `<section class="page-heading container"><h1>${title}</h1><div class="heading-divider" aria-hidden="true"><span></span></div></section>`;
const invitation = `<section class="invitation container"><div><h2>${lines(raw.settings.invitationTitle)}</h2></div><div><p>${data.settings.invitationText}</p>${button('Explore our classes','classes')}</div></section>`;
const content = {};
content.about = `${heading(data.seo.about.heading)}
<section class="section container" aria-labelledby="about-purpose"><div class="section-title"><div><h2 id="about-purpose">${data.about.purposeTitle} <em>${data.about.purposeEmphasis}</em></h2></div></div><div class="card-grid three">${data.about.purpose.map(({title:t,text:p,icon})=>`<article class="value-card about-value-card">${renderAboutIcon(icon)}<h3>${t}</h3><p>${p}</p></article>`).join('')}</div></section>
<section class="about-reasons section" aria-labelledby="about-why"><div class="container"><div class="section-title"><div><h2 id="about-why">${data.about.reasonsTitle}</h2></div></div><div class="card-grid three">${data.about.reasons.map(({title:t,text:p,icon})=>`<article class="value-card about-value-card">${renderAboutIcon(icon)}<h3>${t}</h3><p>${p}</p></article>`).join('')}</div></div></section>
${renderStudios()}<section class="section container about-testimonials" aria-labelledby="about-feedback"><h2 id="about-feedback">What People Say About Us</h2><div class="about-testimonials-placeholder"><span class="sun-symbol" aria-hidden="true">✺</span><p>Read what our students say about their practice.</p><a class="text-link" href="index.html#testimonials">Read student reviews ↗</a></div></section>${invitation}`;
content.classes = `${heading(data.seo.classes.heading)}${renderClasses()}`;
content.events = `${heading(data.seo.events.heading)}${renderEvents()}`;
// Sample portraits and names until the studio supplies its teacher profiles.
const instructors = data.instructors.items;
content.instructors = `${heading(data.seo.instructors.heading)}<section class="teacher-grid" aria-label="Yoga instructors">${instructors.map(({name,image,alt,speciality,biography}, i) => `<article class="teacher-card"><img src="${image}" alt="${alt}" loading="${i < 4 ? 'eager' : 'lazy'}" decoding="async" width="720" height="1040"><h2>${name}</h2>${speciality ? `<p>${speciality}</p>` : ''}${biography ? `<p>${biography}</p>` : ''}</article>`).join('')}</section>`;
content.gallery = `${heading(data.seo.gallery.heading)}<section class="container gallery-grid">${data.gallery.items.map(({image:asset,title,label},i)=>`<button class="gallery-item gallery-item-${i % 3}" data-image="${asset}" data-caption="${title}" aria-label="View photo: ${title}"><img src="${asset}" alt="${title}" loading="lazy" width="1200" height="900"><span class="gallery-caption"><small>${label}</small><strong>${title}</strong><span class="expand-icon" aria-hidden="true">+</span></span></button>`).join('')}</section><p class="container gallery-note">${data.gallery.note}</p><dialog class="lightbox" aria-labelledby="lightbox-caption"><button class="dialog-close" aria-label="Close photo">×</button><img id="lightbox-image" alt=""><p id="lightbox-caption"></p></dialog>`;
const articles = data.blogs.items;
content.blogs = `${heading(data.seo.blogs.heading)}<section class="container journal-grid">${articles.map(({category,title,summary,image:cover,alt,artwork},i)=>`<article class="journal-card">${cover?`<img src="${cover}" alt="${alt}" loading="lazy" width="1200" height="900">`: `<div class="journal-art art-${i % 2 || 2}" aria-hidden="true"><span>${artwork}</span><div class="art-ring"></div></div>`}<div class="journal-copy"><p class="eyebrow">${category}</p><h2>${title}</h2><p>${summary}</p><button class="text-link" data-article="${i}">Read the story</button></div></article>`).join('')}</section><dialog class="article-dialog" aria-labelledby="article-title"><button class="dialog-close" aria-label="Close article">×</button><p id="article-category" class="eyebrow"></p><h2 id="article-title"></h2><div id="article-body"></div></dialog><script type="application/json" id="article-data">${json(raw.blogs.items.map(article => ({ category: article.category, title: article.title, html: renderMarkdown(article.body) })))}</script>`;
content.contacts = `${heading(data.seo.contacts.heading)}<section class="container contact-grid"><div class="contact-panel"><p class="eyebrow">Visit Aarav Yoga</p><h2>A space for<br>your practice.</h2><dl><div><dt>Our studios</dt><dd>${data.settings.contactLocations} <a href="#contact-studios">See addresses and directions below.</a></dd></div><div><dt>Email</dt><dd><a href="mailto:${data.settings.email}">${data.settings.email}</a></dd></div><div><dt>Phone</dt><dd><a href="tel:${data.settings.phone}">${data.settings.phoneDisplay}</a></dd></div><div><dt>Class timings</dt><dd>${data.settings.contactTimings}</dd></div></dl><p class="contact-note">${data.settings.contactNote}</p></div><div class="contact-options"><div id="enquiry-context" hidden></div><a class="button" href="${chatLink('Hello Aarav Yoga! I would like to book a class. Please help me choose a class and studio, and share the available timings.')}" target="_blank" rel="noopener noreferrer">Book on WhatsApp ↗</a>${eyebrow('Find what you’re looking for')}<h2>Let us point you<br><em>in the right direction.</em></h2><a class="contact-link" href="classes.html"><span>Class enquiries</span><small>Explore styles and find your starting point</small></a><a class="contact-link" href="events.html"><span>Events & workshops</span><small>See what’s being planned</small></a><a class="contact-link" href="about.html"><span>About Aarav Yoga</span><small>Get to know our approach</small></a></div></section><section id="contact-studios" class="container contact-studios" aria-labelledby="contact-studios-heading"><h2 id="contact-studios-heading">Find your studio</h2><div class="contact-studio-grid">${studios.map(({name,address},i) => `<article class="contact-studio-card"><h3>${name}</h3><address>${address}</address><a class="text-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raw.studios.items[i].address)}" target="_blank" rel="noopener noreferrer" aria-label="View ${name} on Google Maps (opens in a new tab)">Get directions ↗</a></article>`).join('')}</div></section>`;
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#174D2B"/><path d="M32 13c-12 13-12 24 0 35 12-11 12-22 0-35Z" fill="none" stroke="#FAF8F2" stroke-width="3"/><path d="M14 28c0 14 6 21 18 21M50 28c0 14-6 21-18 21" fill="none" stroke="#F2A51A" stroke-width="3" stroke-linecap="round"/></svg>`;
writeFileSync(`${out}/assets/favicon.svg`,icon);
for(const [slug,title] of pages){
  if(slug === 'index'){writeFileSync(`${out}/index.html`, renderHomepage());continue;}
  writeFileSync(`${out}/${slug}.html`, `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#174D2B">${seoHead(slug)}<link rel="icon" type="image/png" href="${data.settings.logo}"><link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="hero.css"><link rel="stylesheet" href="navigation.css"><link rel="stylesheet" href="contact.css"><link rel="stylesheet" href="footer.css"><script src="contact.js" defer></script><script src="navigation.js" defer></script><script src="app.js" defer></script></head><body data-page="${slug}"><a href="#main" class="skip-link">Skip to content</a>${renderHeader(slug)}${renderMenu(slug)}<main id="main">${content[slug]}</main>${renderFooter()}${renderWhatsApp()}</body></html>`);
}
console.log(`Created ${pages.length} Aarav Yoga pages.`);
