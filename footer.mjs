import { pageLinks } from './navigation.mjs';
import { renderContactDetails, renderSocialLinks } from './contact.mjs';

export function renderFooter() {
  return `<footer id="footer-nav" class="site-footer"><div class="container footer-main"><div><a class="brand logo-brand footer-brand" href="index.html"><span class="logo-frame"><img src="assets/logo.png" alt="Aarav Yoga — Health, Harmony & Happiness" width="2000" height="2000"></span></a><p>A little movement.<br>A little stillness.<br>A little more you.</p>${renderContactDetails()}${renderSocialLinks()}</div><div class="footer-links"><p class="footer-label">EXPLORE</p>${pageLinks.slice(1,5).map(([s,t])=>`<a href="${s}.html">${t}</a>`).join('')}</div><div class="footer-links"><p class="footer-label">CONNECT</p>${pageLinks.slice(5).map(([s,t])=>`<a href="${s}.html">${t}</a>`).join('')}</div><div class="footer-message"><span class="sun-symbol" aria-hidden="true">✺</span><p>Make space<br>for what matters.</p></div></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} Aarav Yoga. All rights reserved.</span><span>Move mindfully. Live gently.</span></div></footer>`;
}
