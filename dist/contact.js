(() => {
  const toggle = document.querySelector('.whatsapp-toggle');
  const panel = document.querySelector('#whatsapp-panel');
  if (!toggle || !panel) return;
  const close = panel.querySelector('.whatsapp-close');
  function hide(returnFocus = false) {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus({ preventScroll: true });
  }
  toggle.setAttribute('role', 'button');
  toggle.addEventListener('click', event => {
    event.preventDefault();
    if (!panel.hidden) return hide(true);
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    close.focus({ preventScroll: true });
  });
  toggle.addEventListener('keydown', event => {
    if (event.key === ' ') { event.preventDefault(); toggle.click(); }
  });
  close.addEventListener('click', () => hide(true));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) { event.preventDefault(); hide(true); }
  });
  document.addEventListener('click', event => {
    if (!panel.hidden && !event.target.closest('.whatsapp-widget')) hide(panel.contains(document.activeElement));
  });
})();
