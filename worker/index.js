/**
 * Cloudflare Worker — serves the SPA assets and premium question API.
 *
 * `/api/questions` validates Premium via a short-lived training JWT
 * (HMAC, issued by GAS) or falls back to GAS `verifyTrainingAccess`.
 * Question JSON is bundled in `server-questions/` — not in public assets.
 */

/** @type {Record<string, () => Promise<{ default: !Array<!Object> }>>} */
const LEVEL_IMPORTS = {
  A1: () => import('../server-questions/A1.json'),
  A2: () => import('../server-questions/A2.json'),
  B1: () => import('../server-questions/B1.json'),
  B2: () => import('../server-questions/B2.json'),
};

/** @type {Record<string, !Array<!Object>>} */
const levelCache = {};

/** @type {Map<string, {start:number, count:number}>} */
const rateBuckets = new Map();

const ALLOWED_ORIGINS = [
  'https://lernziel-deutsch.de',
  'http://localhost',
  'http://127.0.0.1',
];

const RATE_LIMIT_MAX = 120;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

/** @type {Promise<CryptoKey>|null} */
let jwtKeyPromise = null;

/** @type {string} */
let jwtKeyPromiseSecret = '';

/**
 * @param {string} topicKey
 * @return {string}
 */
function normalizeTopicKey(topicKey) {
  return String(topicKey || '').toUpperCase().replace(/(A1|A2|B1|B2)$/, '');
}

/**
 * @param {!Array<!Object>} arr
 * @return {!Array<!Object>}
 */
function shuffle(arr) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * @param {unknown} payload
 * @param {number} [status=200]
 * @return {Response}
 */
function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

/**
 * @param {Request} request
 * @return {boolean}
 */
function isAllowedOrigin(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  return ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
}

/**
 * @param {Request} request
 * @param {URLSearchParams} params
 * @return {boolean}
 */
function rateLimitOk(request, params) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const deviceId = String(params.get('deviceId') || '').trim() || 'nodevice';
  const key = `${ip}:${deviceId}`;
  const now = Date.now();

  if (rateBuckets.size > 5000) {
    for (const [bucketKey, bucket] of rateBuckets.entries()) {
      if (now - bucket.start > RATE_LIMIT_WINDOW_MS) rateBuckets.delete(bucketKey);
    }
  }

  let bucket = rateBuckets.get(key);
  if (!bucket || now - bucket.start > RATE_LIMIT_WINDOW_MS) {
    bucket = { start: now, count: 0 };
    rateBuckets.set(key, bucket);
  }
  bucket.count += 1;
  return bucket.count <= RATE_LIMIT_MAX;
}

/**
 * @param {string} segment
 * @return {Uint8Array}
 */
function base64UrlToBytes(segment) {
  const padded = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (padded.length % 4)) % 4;
  const bin = atob(padded + '='.repeat(padLen));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

/**
 * @param {string} secret
 * @return {Promise<CryptoKey>}
 */
function importJwtKey(secret) {
  if (!jwtKeyPromise || jwtKeyPromiseSecret !== secret) {
    jwtKeyPromiseSecret = secret;
    jwtKeyPromise = crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    );
  }
  return jwtKeyPromise;
}

/**
 * @param {string} token
 * @param {string} secret
 * @return {Promise<{ok:boolean, isPremium?:boolean, error?:string}>}
 */
async function verifyTrainingJwt(token, secret) {
  const raw = String(token || '').trim();
  if (!raw || !secret) return { ok: false, error: 'Missing training token' };

  const parts = raw.split('.');
  if (parts.length !== 3) return { ok: false, error: 'Invalid training token' };

  let claims;
  try {
    claims = JSON.parse(new TextDecoder().decode(base64UrlToBytes(parts[1])));
  } catch {
    return { ok: false, error: 'Invalid training token' };
  }

  if (!claims || !claims.premium) {
    return { ok: false, error: 'Premium required' };
  }
  const exp = Number(claims.exp);
  if (!Number.isFinite(exp) || exp * 1000 <= Date.now()) {
    return { ok: false, error: 'Training token expired' };
  }

  try {
    const key = await importJwtKey(secret);
    const data = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    const signature = base64UrlToBytes(parts[2]);
    const valid = await crypto.subtle.verify('HMAC', key, signature, data);
    if (!valid) return { ok: false, error: 'Invalid training token' };
  } catch {
    return { ok: false, error: 'Invalid training token' };
  }

  return { ok: true, isPremium: true };
}

/**
 * @param {Request} request
 * @param {{ SCRIPT_URL?: string, TRAINING_JWT_SECRET?: string }} env
 * @param {URLSearchParams} params
 * @return {Promise<{ok:boolean, isPremium?:boolean, trainingJwt?:string, error?:string}>}
 */
async function verifyTrainingAccess(request, env, params) {
  const jwtSecret = String(env.TRAINING_JWT_SECRET || '').trim();
  const trainingJwt = String(params.get('trainingJwt') || '').trim();
  if (trainingJwt && jwtSecret) {
    const jwtAccess = await verifyTrainingJwt(trainingJwt, jwtSecret);
    if (jwtAccess.ok) return jwtAccess;
  }

  const scriptUrl = String(env.SCRIPT_URL || '').trim();
  if (!scriptUrl) return { ok: false, error: 'Backend not configured' };

  const body = {
    action: 'verifyTrainingAccess',
    email: String(params.get('email') || '').trim().toLowerCase(),
    sessionToken: String(params.get('sessionToken') || '').trim(),
    code: String(params.get('code') || '').trim().toUpperCase(),
    deviceId: String(params.get('deviceId') || '').trim(),
  };

  try {
    const res = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!text) return { ok: false, error: 'Empty backend response' };
    const data = JSON.parse(text);
    return data && typeof data === 'object'
      ? data
      : { ok: false, error: 'Invalid backend response' };
  } catch {
    return { ok: false, error: 'Backend unreachable' };
  }
}

/**
 * @param {string} level
 * @return {Promise<!Array<!Object>>}
 */
async function loadLevelPool(level) {
  const upper = String(level || '').toUpperCase();
  if (levelCache[upper]) return levelCache[upper];
  const loader = LEVEL_IMPORTS[upper];
  if (!loader) return [];
  const mod = await loader();
  levelCache[upper] = mod.default || [];
  return levelCache[upper];
}

/**
 * @param {string} level
 * @param {string} topicKey
 * @return {Promise<!Array<!Object>>}
 */
async function filterPool(level, topicKey) {
  const all = await loadLevelPool(level);
  if (!topicKey) return all;
  const target = normalizeTopicKey(topicKey);
  return all.filter((q) => {
    if (String(q.level || '').toUpperCase() !== String(level || '').toUpperCase()) {
      return false;
    }
    return normalizeTopicKey(q.topic || q.topicKey) === target;
  });
}

/**
 * @param {Request} request
 * @param {{ SCRIPT_URL?: string, TRAINING_JWT_SECRET?: string }} env
 * @return {Promise<Response>}
 */
async function handleQuestions(request, env) {
  if (request.method !== 'GET') {
    return jsonResponse({ ok: false, error: 'Method not allowed' }, 405);
  }
  if (!isAllowedOrigin(request)) {
    return jsonResponse({ ok: false, error: 'Forbidden origin' }, 403);
  }

  const url = new URL(request.url);
  const params = url.searchParams;

  if (!rateLimitOk(request, params)) {
    return jsonResponse({ ok: false, error: 'Rate limit exceeded' }, 429);
  }

  const level = String(params.get('level') || '').toUpperCase();
  const topic = String(params.get('topic') || '').trim();
  const limitRaw = Number(params.get('limit') || 500);
  const limit = Number.isFinite(limitRaw)
    ? Math.max(1, Math.min(500, Math.floor(limitRaw)))
    : 500;

  if (!LEVEL_IMPORTS[level]) {
    return jsonResponse({ ok: false, error: 'Invalid level' }, 400);
  }

  const access = await verifyTrainingAccess(request, env, params);
  if (!access.ok || !access.isPremium) {
    return jsonResponse(
      { ok: false, error: access.error || 'Premium required' },
      403,
    );
  }

  const pool = await filterPool(level, topic);
  if (!pool.length) {
    return jsonResponse({ ok: false, error: 'No questions found' }, 404);
  }

  const payload = {
    ok: true,
    level,
    topic: topic || null,
    questions: shuffle(pool).slice(0, limit),
  };
  if (access.trainingJwt) payload.trainingJwt = access.trainingJwt;

  return jsonResponse(payload);
}

export default {
  /**
   * @param {Request} request
   * @param {{ ASSETS: { fetch: (req: Request) => Promise<Response> },
   *   SCRIPT_URL?: string, TRAINING_JWT_SECRET?: string }} env
   * @return {Promise<Response>}
   */
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/questions') {
      return handleQuestions(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
