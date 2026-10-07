export const studios = [
  { name: 'Yoga Studio – 1', address: 'Flat No -703, 1, Moon Ct St, Block B, Jaypee Greens, Greater Noida, Uttar Pradesh 201310' },
  { name: 'Yoga Studio – 2', address: 'Ats Pristine Sector – 150, Noida' },
  { name: 'Yoga Studio – 3', address: 'Aanad Ashray Society P-4 , Phi -II Greater Noida' },
  { name: 'Yoga Studio – 4', address: 'Purvanchal Royal City Sector-Chi-V, Grater Noida' }
];

export function renderStudios() {
  return `<section id="our-studios" class="section container about-studios" aria-labelledby="studios-heading"><div class="section-title"><div><h2 id="studios-heading">Our Yoga Studios</h2></div><p>Four spaces to practise in Noida and Greater Noida.</p></div><div class="studio-grid">${studios.map(({ name, address }) => {
    const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    return `<article class="studio-card"><img src="assets/editorial-studio.jpg" alt="Illustrative yoga studio interior" width="1000" height="650" loading="lazy" decoding="async"><div class="studio-copy"><h3>${name}</h3><address><a href="${maps}" target="_blank" rel="noopener noreferrer" aria-label="${name}: ${address} (opens Google Maps in a new tab)">${address}</a></address><a class="studio-phone" href="tel:+919958834005">+91 99588 34005</a><a class="text-link studio-map" href="${maps}" target="_blank" rel="noopener noreferrer" aria-label="View ${name} on Google Maps (opens in a new tab)">View on Google Maps <span aria-hidden="true">↗</span></a></div></article>`;
  }).join('')}</div></section>`;
}
