import { raw, h } from './cms-content.mjs';

// Plain content objects keep slides independent of the CMS and slider library.
export function renderHero() {
  const home = raw.home;
  const picture = (slide, index) => `<picture>${slide.mobileImage ? `<source media="(max-width: 760px)" srcset="${h(slide.mobileImage)}">` : ''}<img src="${h(slide.image)}" alt="${h(slide.alt)}" width="1600" height="1200" ${index === 0 ? 'fetchpriority="high" loading="eager"' : 'loading="lazy" decoding="async"'} style="--image-focus:${h(slide.imageFocus)};--mobile-image-focus:${h(slide.mobileImageFocus)}"></picture>`;
  return `<section id="home" class="hero-track hero-slider splide" aria-label="Aarav Yoga highlights" data-transition="${h(home.heroSlider.transition)}" data-interval="${home.heroSlider.interval}" data-speed="${home.heroSlider.speed}" data-autoplay="${home.heroSlider.autoplay}">
    <div class="editorial-hero">
      <h1 id="hero-heading" class="hero-sr-only">${h(home.heroTitle.replace(/\r?\n/g, ' '))}</h1>
      <p class="studio-tagline">${h(home.tagline)}</p>
      <div class="splide__track"><ul class="splide__list">${home.heroSlides.map((slide, index) => `<li class="splide__slide hero-slide">
        ${picture(slide, index)}<div class="hero-slide-shade"></div>
        <div class="hero-slide-layout" data-position="${h(slide.position)}" data-mobile-position="${h(slide.mobilePosition)}" data-alignment="${h(slide.alignment)}">
          <div class="hero-slide-copy"><h2 class="hero-slide-title">${(slide.title || home.heroTitle).split(/\r?\n/).map(text => `<span>${h(text)}</span>`).join('')}</h2>
            <div class="hero-actions"><a class="pill" href="${h(slide.buttonPage)}">${h(slide.buttonLabel || home.heroButton)}</a>${slide.secondaryLabel ? `<a class="quiet-action" href="${h(slide.secondaryPage)}">${h(slide.secondaryLabel)}</a>` : ''}</div>
          </div>
        </div>
      </li>`).join('')}</ul></div>
      <span class="hero-bottom-note">${h(home.heroNote)}</span>
      <div class="hero-slider-controls" hidden>
        <div class="splide__arrows"><button class="splide__arrow splide__arrow--prev" type="button" aria-label="Previous slide">←</button><button class="splide__arrow splide__arrow--next" type="button" aria-label="Next slide">→</button></div>
        <ul class="splide__pagination"></ul>
        <button class="splide__toggle" type="button"><span class="splide__toggle__play">Play</span><span class="splide__toggle__pause">Pause</span></button>
      </div>
    </div>
  </section>`;
}
