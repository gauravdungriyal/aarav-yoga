import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import auth from '../api/auth.js';
import callback from '../api/callback.js';
import { cookie, cookieName, challenge, validState } from '../lib/cms-oauth.js';

function response() { return { statusCode: 200, headers: {}, setHeader(k,v) { this.headers[k] = v; }, end(body='') { this.body=body; } }; }
const request = (url, extra={}) => ({ method: 'GET', url, headers: { host: 'yoga.example' }, ...extra });
test('GitHub OAuth is bound to the configured origin, PKCE and a short-lived state cookie', async () => {
  const previous = {...process.env};
  const previousFetch = globalThis.fetch;
  Object.assign(process.env, { CMS_SITE_URL: 'https://yoga.example', GITHUB_CLIENT_ID: 'test-id', GITHUB_CLIENT_SECRET: 'test-secret' });
  try {
    let res=response(); auth(request('/api/auth?provider=github'),res);
    assert.equal(res.statusCode,302);
    const target=new URL(res.headers.Location);
    assert.equal(target.origin,'https://github.com');
    assert.equal(target.searchParams.get('redirect_uri'),'https://yoga.example/api/callback');
    const cookieHeader=res.headers['Set-Cookie'].split(';')[0];
    const session=JSON.parse(Buffer.from(cookieHeader.slice(cookieName.length+1),'base64url').toString());
    assert.equal(target.searchParams.get('code_challenge'),challenge(session.verifier));
    assert(res.headers['Set-Cookie'].includes('HttpOnly; Secure; SameSite=Lax'));
    assert(!validState({...session,created:Date.now()-610000},session.state));
    assert(!validState(session,'wrong'));
    let calls=0;
    globalThis.fetch=async (url, options) => {
      calls++;
      if (url.includes('access_token')) { assert.equal(JSON.parse(options.body).code_verifier,session.verifier); return {ok:true,json:async()=>({access_token:'test-token'})}; }
      return {ok:true,json:async()=>({permissions:{push:true}})};
    };
    const req=request(`/api/callback?code=test&state=${session.state}`,{headers:{host:'yoga.example',cookie:cookieHeader}});
    res=response(); await callback(req,res);
    assert.equal(calls,2);
    assert(res.headers['Set-Cookie'].includes('Max-Age=0'));
    assert.equal(res.headers['Cache-Control'],'no-store');
    assert(res.headers['Content-Security-Policy'].includes("default-src 'none'"));
    assert(!res.body.includes('test-secret'));
    // Execute the popup handshake: a different window or origin must never receive the token.
    let listener, closed=false;
    const sent=[];
    const opener={postMessage:(message,origin)=>sent.push({message,origin})};
    const window={opener,addEventListener:(_,fn)=>{listener=fn;},removeEventListener(){},close(){closed=true;}};
    vm.runInNewContext(res.body.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1], {window,document:{querySelector:()=>({})}});
    assert.equal(sent.length,1);
    listener({origin:'https://attacker.example',source:opener,data:'authorizing:github'});
    listener({origin:'https://yoga.example',source:{},data:'authorizing:github'});
    assert.equal(sent.length,1);
    listener({origin:'https://yoga.example',source:opener,data:'authorizing:github'});
    assert.equal(sent[1].origin,'https://yoga.example');
    assert(sent[1].message.includes('authorization:github:success:'));
    assert(closed);
    calls=0; res=response(); await callback({...req,url:'/api/callback?code=test&state=wrong'},res);
    assert.equal(res.statusCode,400); assert.equal(calls,0);
    res=response(); auth(request('/api/auth?provider=github',{headers:{host:'attacker.example'}}),res); assert.equal(res.statusCode,403);
    res=response(); auth(request('/api/auth?provider=other'),res); assert.equal(res.statusCode,400);
    res=response(); auth(request('/api/auth',{method:'POST'}),res); assert.equal(res.statusCode,405);
    globalThis.fetch=async url=>({ok:true,json:async()=>url.includes('access_token')?{access_token:'test-token'}:{permissions:{push:false}}});
    res=response(); await callback(req,res); assert(res.body.includes('authorization:github:error:')); assert(!res.body.includes('test-token'));
    delete process.env.GITHUB_CLIENT_SECRET;
    res=response(); auth(request('/api/auth?check=1'),res); assert.equal(res.statusCode,503); assert.equal(JSON.parse(res.body).configured,false);
  } finally {
    globalThis.fetch=previousFetch;
    for(const key of ['CMS_SITE_URL','GITHUB_CLIENT_ID','GITHUB_CLIENT_SECRET']) { if(previous[key]===undefined) delete process.env[key]; else process.env[key]=previous[key]; }
  }
});
