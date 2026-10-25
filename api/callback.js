import { configuration, headers, sameHost, cookie, readSession, validState, textError, popup } from '../lib/cms-oauth.js';

export default async function handler(req, res) {
  headers(res);
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return textError(res, 405, 'Method not allowed'); }
  let config;
  try { config = configuration(); } catch { return textError(res, 503, 'GitHub sign-in has not been configured.'); }
  if (!sameHost(req, config.origin)) return textError(res, 403, 'Use the production website address to sign in.');
  const query = new URL(req.url, config.origin).searchParams;
  const session = readSession(req);
  res.setHeader('Set-Cookie', cookie('', 0));
  if (!validState(session, query.get('state'))) return textError(res, 400, 'Sign-in expired or could not be verified. Close this window and try again.');
  if (query.has('error')) return popup(res, config.origin, 'error', { message: 'GitHub authorization was cancelled. Please try again.' });
  const code = query.get('code');
  if (!code || code.length > 512) return textError(res, 400, 'Missing authorization code');
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: config.clientId, client_secret: config.clientSecret, code, redirect_uri: config.callback, code_verifier: session.verifier }),
      signal: AbortSignal.timeout(15000)
    });
    const token = await response.json();
    if (!response.ok || !token.access_token || token.error) throw new Error('Token exchange failed');
    // Only repository contributors can receive a token through this CMS login.
    const repo = await fetch('https://api.github.com/repos/gauravdungriyal/aarav-yoga', {
      headers: { Authorization: `Bearer ${token.access_token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'aarav-yoga-cms' },
      signal: AbortSignal.timeout(15000)
    });
    if (!repo.ok || !(await repo.json()).permissions?.push) return popup(res, config.origin, 'error', { message: 'Your GitHub account needs write access to the Aarav Yoga repository.' });
    return popup(res, config.origin, 'success', { token: token.access_token, provider: 'github' });
  } catch {
    return popup(res, config.origin, 'error', { message: 'GitHub sign-in could not be completed. Please close this window and try again.' });
  }
}
