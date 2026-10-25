import { data, raw } from './cms-content.mjs';
export const studios = data.studios.items;

export function renderStudios() {
  return `<section id="our-studios" class="section container about-studios" aria-labelledby="studios-heading"><div class="section-title"><div><h2 id="studios-heading">Our Yoga Studios</h2></div><p>${data.studios.introduction}</p></div><div class="studio-grid">${studios.map(({ name, address, image, alt }, i) => {
    const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raw.studios.items[i].address)}`;
    return `<article class="studio-card"><img src="${image}" alt="${alt}" width="1000" height="650" loading="lazy" decoding="async"><div class="studio-copy"><h3>${name}</h3><address><a href="${maps}" target="_blank" rel="noopener noreferrer" aria-label="${name}: ${address} (opens Google Maps in a new tab)">${address}</a></address><a class="studio-phone" href="tel:${data.settings.phone}">${data.settings.phoneDisplay}</a><a class="text-link studio-map" href="${maps}" target="_blank" rel="noopener noreferrer" aria-label="View ${name} on Google Maps (opens in a new tab)">View on Google Maps <span aria-hidden="true">↗</span></a></div></article>`;
  }).join('')}</div></section>`;
}
