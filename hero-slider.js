(() => {
  const hero = document.querySelector('.hero-slider');
  if (!hero || typeof Splide === 'undefined') return;
  const count = hero.querySelectorAll('.hero-slide').length;
  if (count < 2) return;
  const controls = hero.querySelector('.hero-slider-controls');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const autoplay = hero.dataset.autoplay === 'true';
  const slider = new Splide(hero, {
    type: hero.dataset.transition,
    rewind: true,
    speed: Number(hero.dataset.speed),
    interval: Number(hero.dataset.interval),
    autoplay: autoplay ? true : 'pause',
    pauseOnHover: true,
    pauseOnFocus: true,
    resetProgress: false,
    keyboard: 'focused',
    drag: true,
    arrows: true,
    pagination: true,
    reducedMotion: { speed: 0, rewindSpeed: 0, autoplay: 'pause' },
    i18n: { carousel: 'slideshow', slide: 'slide', play: 'Play slideshow', pause: 'Pause slideshow' },
  });
  slider.mount();
  controls.hidden = false;

  // Suspend offscreen/background playback without overriding the visitor's pause.
  const player = slider.Components.Autoplay;
  let visible = true;
  let requested = autoplay && !motion.matches;
  function syncPlayback() {
    const suspended = !visible || document.hidden || document.body.classList.contains('menu-open');
    if (!requested || suspended || motion.matches) player.pause();
    else if (hero.matches(':hover') || hero.contains(document.activeElement)) player.pause(false);
    else player.play();
  }
  hero.querySelector('.splide__toggle').addEventListener('click', event => {
    requested = event.currentTarget.classList.contains('is-active');
  });
  for (const event of ['mouseenter', 'mouseleave', 'focusin', 'focusout']) {
    hero.addEventListener(event, () => setTimeout(syncPlayback, 0));
  }
  motion.addEventListener('change', () => {
    if (motion.matches) requested = false;
    syncPlayback();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      syncPlayback();
    }, { threshold: .1 }).observe(hero);
  }
  document.addEventListener('visibilitychange', syncPlayback);
  new MutationObserver(syncPlayback).observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();
