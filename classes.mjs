import { data, raw } from './cms-content.mjs';
import { chatLink } from './contact.mjs';

const categories = [['all', 'View All'], ['advanced', 'Advanced'], ['basic', 'Basic'], ['meditation', 'Meditation'], ['pranayam', 'Pranayam']];
const labels = Object.fromEntries(categories);

export function renderClasses() {
  const classes = data.classes.items;
  return `<section class="container course-directory" aria-label="Yoga classes"><div class="filter-row course-filters" role="group" aria-label="Filter classes by category">${categories.map(([id, label]) => `<button type="button" class="filter${id === 'all' ? ' active' : ''}" aria-pressed="${id === 'all'}" data-filter="${id}">${label}</button>`).join('')}</div><p class="filter-summary" role="status" aria-live="polite">Showing ${classes.length} classes</p><div class="course-grid">${classes.map(({name, tags, image, alt, text, timings, price, instructor, studio}, i) => `<article class="course-card" data-class-tags="${tags.join(' ')}"><div class="course-photo"><img src="${image}" alt="${alt}" width="800" height="520" loading="lazy" decoding="async"></div><div class="course-copy"><div class="course-categories">${tags.map(tag => `<span>${labels[tag]}</span>`).join('')}</div><h2>${name}</h2><p>${text}</p>${[timings, price, instructor, studio].filter(Boolean).map(value => `<p class="course-detail">${value}</p>`).join('')}<a class="course-enquire" href="${chatLink(`Hello Aarav Yoga! I would like to book ${raw.classes.items[i].name}. Please share available timings, studio locations, and how to confirm my booking.`)}" target="_blank" rel="noopener noreferrer" aria-label="Book ${name} on WhatsApp (opens in a new tab)">Book now <span aria-hidden="true">↗</span></a></div></article>`).join('')}</div></section>`;
}
