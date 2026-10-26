import { data, raw, lines, seoHead } from './cms-content.mjs';
import { renderHero } from './hero-slider.mjs';
import { renderTestimonials } from './testimonials.mjs';
import { renderFooter } from './footer.mjs';
import { renderWhatsApp } from './contact.mjs';
import { renderHeader, renderMenu } from './navigation.mjs';
const lotus = `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 7c-9 10-9 18 0 27 9-9 9-17 0-27Z"/><path d="M24 35C13 35 6 28 6 18c10 0 16 5 18 17Zm0 0c11 0 18-7 18-17-10 0-16 5-18 17ZM10 39h28"/></svg>`;
const photo = (name, alt, className='', eager=false) => `<img src="${name}" alt="${alt}" class="${className}" width="1600" height="1200" ${eager?'fetchpriority="high"':'loading="lazy" decoding="async"'}>`;
const heading = (text, tag='h2', className='') => `<${tag} class="reveal-heading ${className}" data-reveal><span>${text}</span></${tag}>`;
const pill = (text, href, outline=false) => `<a href="${href}" class="pill ${outline?'pill-outline':''}">${text}</a>`;

export function renderHomepage() {
return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#F2F0E7">${seoHead('index')}<link rel="icon" href="${data.settings.logo}" type="image/png"><link rel="stylesheet" href="vendor/splide-core.min.css"><link rel="stylesheet" href="homepage.css"><link rel="stylesheet" href="navigation.css"><link rel="stylesheet" href="hero-slider.css"><link rel="stylesheet" href="contact.css"><link rel="stylesheet" href="footer.css"><script src="contact.js" defer></script><script src="navigation.js" defer></script><script src="vendor/splide.min.js" defer></script><script src="hero-slider.js" defer></script><script src="homepage.js" defer></script></head><body data-page="index" class="editorial-home"><a class="skip-link" href="#main">Skip to content</a>
${renderHeader('index')}
${renderMenu('index')}
<main id="main">
${renderHero()}

<section id="about" class="about-editorial section-space"><div class="about-tall reveal-image" data-reveal>${photo(data.home.aboutImage,data.home.aboutAlt)}</div><div class="about-copy">${heading(data.home.aboutTitle)}<p data-reveal>${data.home.aboutText}</p><p data-reveal>${data.home.aboutTextSecond}</p>${pill('Meet our instructors','instructors.html',true)}</div><figure class="about-still-life reveal-image" data-reveal>${photo(data.home.stillImage,data.home.stillAlt)}<figcaption>${lines(raw.home.stillCaption)}</figcaption></figure></section>



<section id="core-values" class="core-values section-space" aria-labelledby="core-values-title"><h2 id="core-values-title">${data.home.valuesTitle}</h2><div class="core-values-grid"><article class="core-value-card"><span class="core-value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2M5 5a3 3 0 0 0 0 6M19 5a3 3 0 0 1 0 6M2 19v-1a4 4 0 0 1 3-4M22 19v-1a4 4 0 0 0-3-4"/></svg></span><p class="core-value-label">${data.home.values[0].label}</p><h3>${data.home.values[0].title}</h3><p>${data.home.values[0].text}</p></article><article class="core-value-card"><span class="core-value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 4C10 3 3 7 4 14c1 6 8 7 12 3 4-4 4-10 4-13Z"/><path d="M3 21 15 9M9 15v-4M9 15h5"/></svg></span><p class="core-value-label">${data.home.values[1].label}</p><h3>${data.home.values[1].title}</h3><p>${data.home.values[1].text}</p></article><article class="core-value-card"><span class="core-value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg></span><p class="core-value-label">${data.home.values[2].label}</p><h3>${data.home.values[2].title}</h3><p>${data.home.values[2].text}</p></article></div></section>

<section id="benefits" class="benefits-track" aria-label="The possibilities of your practice"><div class="benefits-stage">${data.home.benefits.map(({image:asset,alt,text:copy},i)=>`<article class="benefit-panel benefit-${i}" style="--panel-index:${i}">${photo(asset,alt,'benefit-image')}<div class="benefit-shade"></div><p class="benefit-label">A little space for you <span>${String(i + 1).padStart(2, '0')} / 03</span></p><div class="benefit-copy"><h2>${lines(raw.home.benefits[i].title)}</h2><p>${copy}</p></div></article>`).join('')}</div></section>

<section class="mat-banner photo-banner" aria-labelledby="mat-heading"><div class="parallax-photo" data-parallax="0.04">${photo(data.home.bannerImage,data.home.bannerAlt)}</div><div class="banner-shade mat-shade"></div><div class="banner-copy">${lotus}<p>${data.home.bannerText}</p>${heading(data.home.bannerTitle,'h2','banner-heading')}${pill('Get started','classes.html')}</div></section>

${renderTestimonials()}



<section class="quiet-statement section-space"><div class="statement-copy"><span class="quotation" aria-hidden="true">“</span>${heading(data.home.quote)}<p>${data.home.quoteAttribution}</p></div><div class="statement-photo reveal-image" data-reveal>${photo(data.home.quoteImage,data.home.quoteAlt)}</div></section>





</main>
${renderFooter()}${renderWhatsApp()}</body></html>`;
}
