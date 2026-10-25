import { randomBytes, timingSafeEqual, createHash } from 'node:crypto';

export const cookieName = '__Host-aarav-cms-oauth';
export const random = () => randomBytes(32).toString('base64url');
export const challenge = value => createHash('sha256').update(value).digest('base64url');
export function configuration() {
  const { GITHUB_CLIENT_ID: clientId, GITHUB_CLIENT_SECRET: clientSecret, CMS_SITE_URL: siteUrl } = process.env;
  if (!clientId || !clientSecret || !siteUrl) throw new Error('Complete the GitHub sign-in setup in CMS-SETUP.md: configure CMS_SITE_URL, GITHUB_CLIENT_ID, and GITHUB_CLIENT_SECRET in Vercel, then redeploy.');
  const site = new URL(siteUrl);
  if (site.protocol !== 'https:' || site.username || site.password || site.pathname !== '/' || site.search || site.hash) throw new Error('CMS_SITE_URL must be the HTTPS website origin, without a path.');
  return { clientId, clientSecret, origin: site.origin, callback: `${site.origin}/api/callback` };
}
export function headers(res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
}
export function cookie(value, maxAge = 600) {
  return `${cookieName}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}
export function readSession(req) {
  const value = (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  try { return JSON.parse(Buffer.from(value || '', 'base64url').toString()); } catch { return null; }
}
export function validState(session, state) {
  if (!session || typeof session.state !== 'string' || typeof state !== 'string' || typeof session.verifier !== 'string' || !Number.isFinite(session.created)) return false;
  if (!/^[A-Za-z0-9_-]{43}$/.test(session.verifier) || Date.now() - session.created > 600000 || session.created > Date.now()) return false;
  const expected = Buffer.from(session.state), actual = Buffer.from(state);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
export function sameHost(req, origin) {
  // Do not trust forwarded host headers when selecting where tokens are sent.
  return req.headers.host === new URL(origin).host;
}
export function textError(res, status, message) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(message);
}
export function popup(res, origin, status, payload) {
  const nonce = random();
  const js = value => JSON.stringify(value).replace(/</g, '\\u003c');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Security-Policy', `default-src 'none'; script-src 'nonce-${nonce}'; base-uri 'none'; frame-ancestors 'none'`);
  res.end(`<!doctype html><html lang="en"><meta charset="utf-8"><title>GitHub sign-in</title><p id="status">Completing sign-in…</p><script nonce="${nonce}">
    const origin = ${js(origin)};
    const result = ${js(`authorization:github:${status}:${JSON.stringify(payload)}`)};
    if (!window.opener) { document.querySelector('#status').textContent = 'Return to the content manager and sign in again.'; }
    else {
      window.addEventListener('message', function receive(event) {
        if (event.origin !== origin || event.source !== window.opener || event.data !== 'authorizing:github') return;
        window.removeEventListener('message', receive);
        window.opener.postMessage(result, origin);
        window.close();
      });
      window.opener.postMessage('authorizing:github', origin);
    }
  </script></html>`);
}
