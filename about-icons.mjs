const icons = {
  Mission: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  Vision: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  Philosophy: '<path d="M20 4C10 3 3 7 4 14c1 6 8 7 12 3 4-4 4-10 4-13Z"/><path d="M3 21 15 9M9 15v-4M9 15h5"/>',
  'Special Courses': '<path d="M12 5c-3-2-7-2-10-1v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1ZM12 5v15M5 8h4M15 8h4M5 12h4M15 12h4"/>',
  'Experienced Trainers': '<circle cx="12" cy="9" r="6"/><path d="m8 14-2 8 6-3 6 3-2-8M10 9l1.5 1.5L14 8"/>',
  'Affordable Price': '<path d="M20 8V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15a1 1 0 0 1 1 1v10H5a3 3 0 0 1-3-3V6M21 12h-5a2 2 0 0 0 0 4h5"/><circle cx="16.5" cy="14" r=".5" fill="currentColor" stroke="none"/>'
};

export function renderAboutIcon(title) {
  return `<span class="about-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[title]}</svg></span>`;
}
