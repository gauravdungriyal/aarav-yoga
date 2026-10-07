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
<section id="home" class="hero-track" aria-labelledby="hero-heading"><div class="editorial-hero"><p class="studio-tagline">Health, Harmony & Happiness</p><div class="hero-image-shell">${photo('hero.webp','A man meditating on a tropical beach','hero-scene',true)}<div class="hero-image-tone"></div></div><div class="hero-ink"><h1 id="hero-heading"><span>Start Your Journey</span><span>to Inner Peace</span></h1><div class="hero-actions">${pill('Get started','#classes')}<a class="quiet-action" href="#classes">View classes</a></div></div><span class="hero-bottom-note">A practice for every season of you.</span><span class="hero-scroll-note" aria-hidden="true">SCROLL TO FIND YOUR FLOW</span></div></section>

<section id="about" class="about-editorial section-space"><div class="about-tall reveal-image" data-reveal>${photo('editorial-studio.jpg','Warm light entering a quiet studio')}</div><div class="about-copy">${heading('Move. Breathe.<br>Transform.')}<p data-reveal>More than a sequence of postures. A space to slow down, move with intention, and reconnect with the person you are.</p><p data-reveal>At Aarav Yoga, we believe a meaningful practice begins with curiosity. Come as you are. Find your own rhythm.</p>${pill('Meet our instructors','instructors.html',true)}</div><figure class="about-still-life reveal-image" data-reveal>${photo('editorial-vases.jpg','Neutral ceramic vases in a softly lit interior')}<figcaption>Less noise. More room to simply be.</figcaption></figure></section>



<section id="classes" class="classes-editorial section-space"><div class="classes-intro">${label('Classes')}${heading('Your Yoga Journey Starts Here With Classes for Every Level')}${pill('Explore our classes','#yoga-classes',true)}<p class="small-note">Explore the starting collection.<br>Our timetable will be shared soon.</p></div><div class="class-stories">${[
 ['group.jpg','A shared beginner yoga practice','Beginner','Rooted Foundations','Start with the essentials. Explore gentle postures, an easy connection to your breath, and the confidence to make your practice your own.'],
 ['studio-hero.png','An illustrative standing yoga practice','Advanced','Skyward Flow','Bring intention to flowing movement. Explore a more dynamic practice with thoughtful transitions and room to keep discovering.'],
 ['hero.webp','A quiet outdoor meditation practice','Meditation','Silent Depths','Let the pace soften. Make room for stillness, a comfortable breath, and a little more awareness of the present moment.']
 ].map(([asset,alt,kind,title,copy],i)=>`<article class="class-story"><div class="class-photo reveal-image" data-reveal>${photo(asset,alt)}</div><div class="class-story-heading">${label(kind)}<span class="entry-number">0${i+1}</span></div>${heading(title,'h3')}<p data-reveal>${copy}</p><a class="understated-link" href="classes.html">Discover the class collection</a></article>`).join('')}</div></section>

<section id="benefits" class="benefits-track" aria-label="The possibilities of your practice"><div class="benefits-stage">${[
 ['studio-hero.png','A strong standing yoga posture','01','Strength &<br>Flexibility','Explore steady movement, strength, and a comfortable range of motion.'],
 ['group.jpg','People practising gentle yoga together','02','Stress Relief &<br>Mental Clarity','Pause the rush. Bring your attention to movement and the rhythm of your breath.'],
 ['hero.webp','A peaceful moment of meditation outdoors','03','Inner Peace &<br>Emotional Well-being','A little more presence. A little more kindness toward yourself.']
 ].map(([asset,alt,number,title,copy],i)=>`<article class="benefit-panel benefit-${i}" style="--panel-index:${i}">${photo(asset,alt,'benefit-image')}<div class="benefit-shade"></div><p class="benefit-label">A little space for you <span>${number} / 03</span></p><div class="benefit-copy"><h2>${title}</h2><p>${copy}</p></div></article>`).join('')}</div></section>

<section class="mat-banner photo-banner" aria-labelledby="mat-heading"><div class="parallax-photo" data-parallax="0.04">${photo('editorial-mat.jpg','A warm orange yoga mat being rolled after practice')}</div><div class="banner-shade mat-shade"></div><div class="banner-copy">${lotus}<p>Your journey begins with a single breath.</p>${heading('Let’s take it together','h2','banner-heading')}${pill('Get started','#classes')}</div></section>

<section id="testimonials" class="testimonials-editorial section-space"><div class="testimonials-heading">${heading('What Our Students Say')}</div><p class="sample-notice">Sample reflections for this first edition. These are illustrative words, not verified customer reviews.</p><div class="testimonials-grid">${[
 ['A gentler beginning','“I imagined yoga had to look a certain way. This sample story is about finding a comfortable pace and beginning with curiosity.”','editorial-teacher-woman.jpg','Sample beginner reflection'],
 ['A pause in the everyday','“This sample story imagines the value of making a little time to notice the breath and step away from the rush.”','editorial-teacher-man.jpg','Sample mindfulness reflection'],
 ['Room to be yourself','“This sample story is about a welcoming practice, without the pressure to perform or compare yourself with anyone else.”','hero.webp','Sample community reflection']
 ].map(([title,text,portrait,kind])=>`<article class="testimonial" data-reveal><h3>${title}</h3><p>${text}</p><div class="testimonial-person">${photo(portrait,'Illustrative portrait accompanying sample content')}<div><span>${kind}</span><small>Illustrative content</small></div></div></article>`).join('')}</div></section>



<section class="quiet-statement section-space"><div class="statement-copy"><span class="quotation" aria-hidden="true">“</span>${heading('There is no perfect way to arrive. Just a breath, a little attention, and the willingness to begin.')}<p>A thought from Aarav Yoga</p></div><div class="statement-photo reveal-image" data-reveal>${photo('hero.webp','A man sitting in meditation on a sandy beach')}</div></section>

<section id="yoga-classes" class="yoga-offerings section-space" aria-labelledby="yoga-offerings-title"><div class="offerings-heading"><h2 id="yoga-offerings-title">Our Yoga Classes</h2></div><div class="offerings-grid">${[
 ['Private Yoga Classes','editorial-pair.jpg','Individual guidance during a shared yoga practice','Personal guidance shaped around your body, abilities, and goals. Practise at your own pace with focused attention and options that work for you.'],
 ['Group Yoga Classes','group.jpg','People practising yoga together in a studio','Move, breathe, and learn together in a welcoming group. Enjoy shared motivation, thoughtful instruction, and space to build your practice.'],
 ['Reiki Healing','hero.webp','A peaceful meditation setting','A gentle complementary practice in a calm setting, with time to pause, rest, and reconnect with yourself. Contact us to learn more about the sessions.']
 ].map(([name,asset,alt,description])=>`<article class="offering-card">${photo(asset,alt)}<div class="offering-copy"><h3>${name}</h3><p>${description}</p>${pill('Enquire now',`contacts.html?class=${encodeURIComponent(name)}`,true)}</div></article>`).join('')}</div></section>



</main>
${renderFooter()}${renderWhatsApp()}</body></html>`;
}
