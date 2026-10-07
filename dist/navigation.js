(()=>{
const root=document.documentElement;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
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
menu.querySelectorAll('a[href]').forEach(link=>link.addEventListener('click',finishClose));
trigger.hidden=false;root.classList.add('js-ready');

})();
