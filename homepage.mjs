import { renderFooter } from './footer.mjs';
import { renderWhatsApp } from './contact.mjs';
import { pageLinks, renderHeader, renderMenu } from './navigation.mjs';
const lotus = `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 7c-9 10-9 18 0 27 9-9 9-17 0-27Z"/><path d="M24 35C13 35 6 28 6 18c10 0 16 5 18 17Zm0 0c11 0 18-7 18-17-10 0-16 5-18 17ZM10 39h28"/></svg>`;
const photo = (name, alt, className='', eager=false) => `<img src="assets/${name}" alt="${alt}" class="${className}" width="1600" height="1200" ${eager?'fetchpriority="high"':'loading="lazy" decoding="async"'}>`;
const label = (text) => `<p class="section-label">${text}</p>`;
const heading = (text, tag='h2', className='') => `<${tag} class="reveal-heading ${className}" data-reveal><span>${text}</span></${tag}>`;
const pill = (text, href, outline=false) => `<a href="${href}" class="pill ${outline?'pill-outline':''}">${text}</a>`;
const logo = `<span class="editorial-logo"><img src="assets/logo.png" alt="Aarav Yoga" width="2000" height="2000"></span>`;

export function renderHomepage() {
return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#F2F0E7"><title>Aarav Yoga · Start Your Journey to Inner Peace</title><meta name="description" content="Find your own rhythm at Aarav Yoga. Explore thoughtful yoga classes, mindful movement, and space to reconnect with yourself."><link rel="icon" href="assets/logo.png" type="image/png"><link rel="stylesheet" href="homepage.css"><link rel="stylesheet" href="navigation.css"><link rel="stylesheet" href="contact.css"><link rel="stylesheet" href="footer.css"><script src="contact.js" defer></script><script src="navigation.js" defer></script><script src="homepage.js" defer></script></head><body data-page="index" class="editorial-home"><a class="skip-link" href="#main">Skip to content</a>
${renderHeader('index')}
${renderMenu('index')}
<main id="main">
<section id="home" class="hero-track" aria-labelledby="hero-heading"><div class="editorial-hero"><p class="studio-tagline">Health, Harmony & Happiness</p><div class="hero-image-shell">${photo('hero.webp','A man meditating on a tropical beach','hero-scene',true)}<div class="hero-image-tone"></div></div><div class="hero-ink"><h1 id="hero-heading"><span>Start Your Journey</span><span>to Inner Peace</span></h1><div class="hero-actions">${pill('Get started','classes.html')}<a class="quiet-action" href="classes.html">View classes</a></div></div><span class="hero-bottom-note">A practice for every season of you.</span><span class="hero-scroll-note" aria-hidden="true">SCROLL TO FIND YOUR FLOW</span></div></section>

<section id="about" class="about-editorial section-space"><div class="about-tall reveal-image" data-reveal>${photo('editorial-studio.jpg','Warm light entering a quiet studio')}</div><div class="about-copy">${heading('Move. Breathe.<br>Transform.')}<p data-reveal>More than a sequence of postures. A space to slow down, move with intention, and reconnect with the person you are.</p><p data-reveal>At Aarav Yoga, we believe a meaningful practice begins with curiosity. Come as you are. Find your own rhythm.</p>${pill('Meet our instructors','instructors.html',true)}</div><figure class="about-still-life reveal-image" data-reveal>${photo('editorial-vases.jpg','Neutral ceramic vases in a softly lit interior')}<figcaption>Less noise. More room to simply be.</figcaption></figure></section>



<section id="core-values" class="core-values section-space" aria-labelledby="core-values-title"><h2 id="core-values-title">Our Core Values</h2><div class="core-values-grid"><article class="core-value-card"><span class="core-value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2M5 5a3 3 0 0 0 0 6M19 5a3 3 0 0 1 0 6M2 19v-1a4 4 0 0 1 3-4M22 19v-1a4 4 0 0 0-3-4"/></svg></span><p class="core-value-label">Inclusivity</p><h3>A place for every body</h3><p>We welcome people of every age, ability, and experience. Come as you are, explore at your own pace, and find a practice that feels right for you.</p></article><article class="core-value-card"><span class="core-value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 4C10 3 3 7 4 14c1 6 8 7 12 3 4-4 4-10 4-13Z"/><path d="M3 21 15 9M9 15v-4M9 15h5"/></svg></span><p class="core-value-label">Mindful Practice</p><h3>Move with intention</h3><p>We encourage thoughtful movement, steady attention, and a comfortable rhythm. Each practice is a chance to pause, listen, and reconnect with yourself.</p></article><article class="core-value-card"><span class="core-value-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg></span><p class="core-value-label">Community & Care</p><h3>Grow together</h3><p>We believe in clear guidance, shared encouragement, and kindness. Our studios bring people together in a supportive space to learn and grow.</p></article></div></section>

<section id="benefits" class="benefits-track" aria-label="The possibilities of your practice"><div class="benefits-stage">${[
 ['studio-hero.png','A strong standing yoga posture','01','Strength &<br>Flexibility','Explore steady movement, strength, and a comfortable range of motion.'],
 ['group.jpg','People practising gentle yoga together','02','Stress Relief &<br>Mental Clarity','Pause the rush. Bring your attention to movement and the rhythm of your breath.'],
 ['hero.webp','A peaceful moment of meditation outdoors','03','Inner Peace &<br>Emotional Well-being','A little more presence. A little more kindness toward yourself.']
 ].map(([asset,alt,number,title,copy],i)=>`<article class="benefit-panel benefit-${i}" style="--panel-index:${i}">${photo(asset,alt,'benefit-image')}<div class="benefit-shade"></div><p class="benefit-label">A little space for you <span>${number} / 03</span></p><div class="benefit-copy"><h2>${title}</h2><p>${copy}</p></div></article>`).join('')}</div></section>

<section class="mat-banner photo-banner" aria-labelledby="mat-heading"><div class="parallax-photo" data-parallax="0.04">${photo('editorial-mat.jpg','A warm orange yoga mat being rolled after practice')}</div><div class="banner-shade mat-shade"></div><div class="banner-copy">${lotus}<p>Your journey begins with a single breath.</p>${heading('Let’s take it together','h2','banner-heading')}${pill('Get started','classes.html')}</div></section>

<section id="testimonials" class="testimonials-editorial section-space"><div class="testimonials-heading">${heading('What Our Students Say')}</div><div class="testimonials-grid">${[
 ['A gentler beginning','“I imagined yoga had to look a certain way. This sample story is about finding a comfortable pace and beginning with curiosity.”','editorial-teacher-woman.jpg','Sample beginner reflection'],
 ['A pause in the everyday','“This sample story imagines the value of making a little time to notice the breath and step away from the rush.”','editorial-teacher-man.jpg','Sample mindfulness reflection'],
 ['Room to be yourself','“This sample story is about a welcoming practice, without the pressure to perform or compare yourself with anyone else.”','hero.webp','Sample community reflection']
 ].map(([title,text,portrait,kind])=>`<article class="testimonial" data-reveal><h3>${title}</h3><p>${text}</p><div class="testimonial-person">${photo(portrait,'Illustrative portrait accompanying sample content')}<div><span>${kind}</span><small>Illustrative content</small></div></div></article>`).join('')}</div></section>



<section class="quiet-statement section-space"><div class="statement-copy"><span class="quotation" aria-hidden="true">“</span>${heading('There is no perfect way to arrive. Just a breath, a little attention, and the willingness to begin.')}<p>A thought from Aarav Yoga</p></div><div class="statement-photo reveal-image" data-reveal>${photo('hero.webp','A man sitting in meditation on a sandy beach')}</div></section>





</main>
${renderFooter()}${renderWhatsApp()}</body></html>`;
}
