const root=document.documentElement;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const desktop=window.matchMedia('(min-width: 761px)');
const menu=document.querySelector('#site-menu');
const trigger=document.querySelector('.menu-trigger');
const closeButton=menu.querySelector('.menu-close');
let closeTimer,previousFocus;
function openMenu(){if(menu.open)return;clearTimeout(closeTimer);previousFocus=document.activeElement===document.body?trigger:document.activeElement;menu.classList.remove('is-closing');menu.showModal();document.body.classList.add('menu-open');trigger.setAttribute('aria-expanded','true');closeButton.focus({preventScroll:true});}
function finishClose(){clearTimeout(closeTimer);menu.classList.remove('is-closing');if(menu.open)menu.close();document.body.classList.remove('menu-open');trigger.setAttribute('aria-expanded','false');previousFocus?.focus({preventScroll:true});}
function closeMenu(){if(!menu.open||menu.classList.contains('is-closing'))return;if(reduced.matches){finishClose();return;}menu.classList.add('is-closing');closeTimer=setTimeout(finishClose,280);}
trigger.addEventListener('click',openMenu);closeButton.addEventListener('click',closeMenu);
menu.addEventListener('cancel',event=>{event.preventDefault();closeMenu();});
menu.addEventListener('close',()=>{document.body.classList.remove('menu-open');trigger.setAttribute('aria-expanded','false');});
menu.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const focusable=[...menu.querySelectorAll('a[href],button:not([disabled])')].filter(el=>el.getClientRects().length);const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
menu.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const section=document.querySelector(link.getAttribute('href'));if(!section)return;event.preventDefault();finishClose();history.pushState(null,'',link.getAttribute('href'));section.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});section.setAttribute('tabindex','-1');section.focus({preventScroll:true});}));
trigger.hidden=false;root.classList.add('js-ready');

const revealElements=[...document.querySelectorAll('[data-reveal]')];
let revealObserver;
function setupReveals(){revealObserver?.disconnect();revealElements.forEach(el=>el.classList.remove('reveal-pending'));if(reduced.matches||!('IntersectionObserver'in window))return;revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.remove('reveal-pending');entry.target.classList.add('is-revealed');revealObserver.unobserve(entry.target);});},{threshold:.08,rootMargin:'0px 0px -35px 0px'});revealElements.forEach((el,i)=>{if(el.getBoundingClientRect().top>innerHeight){el.style.setProperty('--stagger',`${(i%3)*65}ms`);el.classList.add('reveal-pending');revealObserver.observe(el);}});}
const heroTrack=document.querySelector('.hero-track');
const benefitTrack=document.querySelector('.benefits-track');
const parallax=[...document.querySelectorAll('[data-parallax]')];
let queued=false,activeMotion=false;
const clamp=(value)=>Math.max(0,Math.min(1,value));
function updateScroll(){queued=false;if(!activeMotion)return;const vh=innerHeight;const hero=heroTrack.getBoundingClientRect();const pinTop=document.querySelector(".editorial-header").offsetHeight;const progress=clamp((pinTop-hero.top)/Math.max(1,hero.height-heroTrack.querySelector(".editorial-hero").offsetHeight));heroTrack.style.setProperty('--hero-progress',progress.toFixed(4));const benefit=benefitTrack.getBoundingClientRect();const bp=clamp((pinTop-benefit.top)/Math.max(1,benefit.height-benefitTrack.querySelector(".benefits-stage").offsetHeight));benefitTrack.style.setProperty('--panel-two',`${(1-clamp((bp-.05)/.43))*100}%`);benefitTrack.style.setProperty('--panel-three',`${(1-clamp((bp-.52)/.43))*100}%`);for(const image of parallax){const r=image.parentElement.getBoundingClientRect();if(r.top<vh&&r.bottom>0){const move=((vh-r.height)/2-r.top)*Number(image.dataset.parallax);image.style.transform=`translate3d(0,${move.toFixed(2)}px,0)`;}}}
function queueScroll(){if(queued||!activeMotion)return;queued=true;requestAnimationFrame(updateScroll);}
function configureMotion(){activeMotion=!reduced.matches&&desktop.matches;root.classList.toggle('motion-enabled',activeMotion);if(!activeMotion){heroTrack.style.removeProperty('--hero-progress');benefitTrack.style.removeProperty('--panel-two');benefitTrack.style.removeProperty('--panel-three');parallax.forEach(el=>el.style.removeProperty('transform'));}setupReveals();queueScroll();}
window.addEventListener('scroll',queueScroll,{passive:true});window.addEventListener('resize',queueScroll,{passive:true});reduced.addEventListener('change',configureMotion);desktop.addEventListener('change',configureMotion);configureMotion();
if('IntersectionObserver'in window){const links=[...menu.querySelectorAll('.menu-item')];const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;links.forEach(link=>{if(link.getAttribute('href')===`#${entry.target.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});});},{rootMargin:'-10% 0px -65% 0px',threshold:0});document.querySelectorAll('main section[id]').forEach(section=>observer.observe(section));}
