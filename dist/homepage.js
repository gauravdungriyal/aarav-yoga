const root=document.documentElement;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const desktop=window.matchMedia('(min-width: 761px)');
const revealElements=[...document.querySelectorAll('[data-reveal]')];
let revealObserver;
function setupReveals(){revealObserver?.disconnect();revealElements.forEach(el=>el.classList.remove('reveal-pending'));if(reduced.matches||!('IntersectionObserver'in window))return;revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.remove('reveal-pending');entry.target.classList.add('is-revealed');revealObserver.unobserve(entry.target);});},{threshold:.08,rootMargin:'0px 0px -35px 0px'});revealElements.forEach((el,i)=>{if(el.getBoundingClientRect().top>innerHeight){el.style.setProperty('--stagger',`${(i%3)*65}ms`);el.classList.add('reveal-pending');revealObserver.observe(el);}});}
const heroTrack=document.querySelector('.hero-track');
const benefitTrack=document.querySelector('.benefits-track');
const parallax=[...document.querySelectorAll('[data-parallax]')];
let queued=false,activeMotion=false;
const clamp=(value)=>Math.max(0,Math.min(1,value));
function updateScroll(){queued=false;if(!activeMotion)return;const vh=innerHeight;const hero=heroTrack.getBoundingClientRect();const header=document.querySelector(".editorial-header");const pinTop=getComputedStyle(header).position==="sticky"?header.offsetHeight:0;const progress=clamp((pinTop-hero.top)/Math.max(1,hero.height-heroTrack.querySelector(".editorial-hero").offsetHeight));heroTrack.style.setProperty('--hero-progress',progress.toFixed(4));const benefit=benefitTrack.getBoundingClientRect();const bp=clamp((pinTop-benefit.top)/Math.max(1,benefit.height-benefitTrack.querySelector(".benefits-stage").offsetHeight));benefitTrack.style.setProperty('--panel-two',`${(1-clamp((bp-.05)/.43))*100}%`);benefitTrack.style.setProperty('--panel-three',`${(1-clamp((bp-.52)/.43))*100}%`);for(const image of parallax){const r=image.parentElement.getBoundingClientRect();if(r.top<vh&&r.bottom>0){const move=((vh-r.height)/2-r.top)*Number(image.dataset.parallax);image.style.transform=`translate3d(0,${move.toFixed(2)}px,0)`;}}}
function queueScroll(){if(queued||!activeMotion)return;queued=true;requestAnimationFrame(updateScroll);}
function configureMotion(){activeMotion=!reduced.matches&&desktop.matches;root.classList.toggle('motion-enabled',activeMotion);if(!activeMotion){heroTrack.style.removeProperty('--hero-progress');benefitTrack.style.removeProperty('--panel-two');benefitTrack.style.removeProperty('--panel-three');parallax.forEach(el=>el.style.removeProperty('transform'));}setupReveals();queueScroll();}
window.addEventListener('scroll',queueScroll,{passive:true});window.addEventListener('resize',queueScroll,{passive:true});reduced.addEventListener('change',configureMotion);desktop.addEventListener('change',configureMotion);configureMotion();



(() => {
  const track = document.querySelector('.reviews-track');
  if (!track) return;
  const cards = [...track.querySelectorAll('.review-card')];
  const controls = document.querySelector('.reviews-controls');
  const previous = controls.querySelector('.reviews-prev');
  const next = controls.querySelector('.reviews-next');
  const status = controls.querySelector('.reviews-status');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  const position = card => card.offsetLeft - cards[0].offsetLeft;
  function update() {
    const max = track.scrollWidth - track.clientWidth;
    current = cards.reduce((best, card, i) => Math.abs(position(card) - track.scrollLeft) < Math.abs(position(cards[best]) - track.scrollLeft) ? i : best, 0);
    previous.disabled = track.scrollLeft <= 3;
    next.disabled = track.scrollLeft >= max - 2;
    const visible = cards.map((card, i) => ({i, left: position(card)})).filter(({left}) => left + cards[0].offsetWidth > track.scrollLeft + 2 && left < track.scrollLeft + track.clientWidth - 2);
    const first = visible[0].i + 1, last = visible.at(-1).i + 1;
    status.textContent = `${first === last ? first : `${first}–${last}`} of ${cards.length}`;
  }
  function move(direction) {
    const index = Math.max(0, Math.min(cards.length - 1, current + direction));
    track.scrollTo({left: position(cards[index]), behavior: motion.matches ? 'instant' : 'smooth'});
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  });
  track.addEventListener('scroll', update, {passive: true});
  new ResizeObserver(update).observe(track);
  controls.hidden = false;
  update();
})();
