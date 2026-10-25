import { data, raw } from './cms-content.mjs';
const icons = {
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none"/>',
  x: '<path d="m4 3 16 18h-4L4 3h4l12 18M20 3 4 21"/>',
  facebook: '<path d="M14 21v-8h3l.5-4H14V7c0-1.1.4-2 2-2h2V1.5A23 23 0 0 0 15 1c-3 0-5 1.8-5 5v3H7v4h3v8"/>',
  whatsapp: '<path d="M21 11.5a9 9 0 0 1-13.4 7.9L3 21l1.5-4.5A9 9 0 1 1 21 11.5Z"/><path d="M8 7c-.8 0-1 1.3-.6 2.5 1 3 3.6 5.5 6.6 6 .9.2 2-.5 2-1.3l-2.5-1.4-1 1c-1.5-.7-2.7-1.9-3.4-3.4l1-1L8.8 7Z"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
export const chatLink = message => `https://wa.me/${raw.settings.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
export function renderContactDetails() {
  return `<div class="contact-details"><a href="mailto:${data.settings.email}">${data.settings.email}</a><a href="tel:${data.settings.phone}">${data.settings.phoneDisplay}</a></div>`;
}
export function renderSocialLinks() {
  return `<nav class="social-links" aria-label="Aarav Yoga social media">${[
    ['instagram', 'Instagram', data.settings.instagram],
    ['x', 'X', data.settings.x],
    ['facebook', 'Facebook', data.settings.facebook]
  ].filter(([, ,url]) => url).map(([name, label, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Aarav Yoga on ${label} (opens in a new tab)" title="${label}">${icon(name)}</a>`).join('')}</nav>`;
}
export function renderWhatsApp() {
  const faqs = data.settings.faqs;
  return `<aside class="whatsapp-widget" aria-label="WhatsApp help"><section id="whatsapp-panel" class="whatsapp-panel" aria-labelledby="whatsapp-title" hidden><div class="whatsapp-header"><div><h2 id="whatsapp-title">Hello from ${data.settings.siteName}</h2><p>How can we help you?</p></div><button type="button" class="whatsapp-close" aria-label="Close WhatsApp help">×</button></div><div class="whatsapp-body"><p class="whatsapp-intro">Choose a question to get started.</p><div class="whatsapp-faqs">${faqs.map(({question, answer}, i) => `<details><summary>${question}</summary><p>${answer}${question === 'Where is the studio?' ? ' <a href="contacts.html#contact-studios">View studio addresses</a>' : ''}</p><a href="${chatLink(raw.settings.faqs[i].message)}" target="_blank" rel="noopener noreferrer">Ask on WhatsApp <span aria-hidden="true">↗</span></a></details>`).join('')}</div><a class="whatsapp-chat" href="${chatLink('Hello Aarav Yoga! I would like to know more about your yoga classes.')}" target="_blank" rel="noopener noreferrer">${icon('whatsapp')}Chat on WhatsApp</a></div></section><a class="whatsapp-toggle" href="${chatLink()}" target="_blank" rel="noopener noreferrer" aria-label="Open WhatsApp help" aria-controls="whatsapp-panel" aria-expanded="false">${icon('whatsapp')}</a></aside>`;
}
