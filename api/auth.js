import { configuration, headers, sameHost, random, challenge, cookie, textError } from '../lib/cms-oauth.js';

export default function handler(req, res) {
  headers(res);
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return textError(res, 405, 'Method not allowed'); }
  try {
    const config = configuration();
    if (!sameHost(req, config.origin)) return textError(res, 403, 'Use the production website address to sign in.');
    const query = new URL(req.url, config.origin).searchParams;
    if (query.get('check') === '1') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ configured: true }));
    }
    if (query.get('provider') !== 'github') return textError(res, 400, 'Unsupported sign-in provider');
    const state = random(), verifier = random();
    res.setHeader('Set-Cookie', cookie(Buffer.from(JSON.stringify({ state, verifier, created: Date.now() })).toString('base64url')));
    const target = new URL('https://github.com/login/oauth/authorize');
    target.search = new URLSearchParams({ client_id: config.clientId, redirect_uri: config.callback, scope: 'repo', state, code_challenge: challenge(verifier), code_challenge_method: 'S256' }).toString();
    res.statusCode = 302;
    res.setHeader('Location', target.href);
    res.end();
  } catch (error) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ configured: false, message: error.message }));
  }
}
