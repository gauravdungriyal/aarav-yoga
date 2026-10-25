import { data, raw, lines } from './cms-content.mjs';
import { pageLinks } from './navigation.mjs';
import { renderContactDetails, renderSocialLinks } from './contact.mjs';

export function renderFooter() {
  return `<footer id="footer-nav" class="site-footer"><div class="container footer-main"><div><a class="brand logo-brand footer-brand" href="index.html"><span class="logo-frame"><img src="${data.settings.logo}" alt="${data.settings.siteName}" width="2000" height="2000"></span></a><p>${lines(raw.settings.footerText)}</p>${renderContactDetails()}${renderSocialLinks()}</div><div class="footer-links"><p class="footer-label">EXPLORE</p>${pageLinks.slice(1,5).map(([s,t])=>`<a href="${s}.html">${t}</a>`).join('')}</div><div class="footer-links"><p class="footer-label">CONNECT</p>${pageLinks.slice(5).map(([s,t])=>`<a href="${s}.html">${t}</a>`).join('')}</div><div class="footer-message"><span class="sun-symbol" aria-hidden="true">✺</span><p>${lines(raw.settings.footerMessage)}</p></div></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} ${data.settings.siteName}. All rights reserved.</span><span>${data.settings.footerTagline}</span></div></footer>`;
}
