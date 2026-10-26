/* The GitHub secret is kept in Vercel environment variables, never in this file. */
window.CMS_MANUAL_INIT = true;
(async () => {
  const status = document.querySelector('#cms-status');
  try {
    const response = await fetch('/admin/config.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('The editor configuration could not be loaded.');
    const config = await response.json();
    const local = ['localhost', '127.0.0.1'].includes(location.hostname);
    config.load_config_file = false;
    config.backend.base_url = location.origin;
    config.site_url = location.origin;
    config.display_url = location.origin;
    if (local) {
      config.local_backend = { url: 'http://127.0.0.1:8081/api/v1' };
      config.publish_mode = 'simple';
      config.show_preview_links = false;
    } else {
      const auth = await fetch('/api/auth?check=1', { cache: 'no-store' });
      const result = await auth.json().catch(() => ({}));
      if (!auth.ok || !result.configured) throw new Error(result.message || 'GitHub sign-in has not been configured for this address. Follow CMS-SETUP.md in the website repository.');
    }
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/decap-cms@3.17.1/dist/decap-cms.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('The editor could not be downloaded. Check your connection and reload.'));
      document.head.append(script);
    });
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/admin/previews.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('The live preview could not be loaded. Rebuild the site and reload the editor.'));
      document.head.append(script);
    });
    await window.AaravPreviews.register(window.CMS, config);
    window.CMS.init({ config });
    status.remove();
  } catch (error) {
    status.querySelector('p').textContent = error.message;
  }
})();
