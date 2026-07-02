/**
 * Cloudflare Worker — serves the SPA assets and premium question API.
 *
 * `/api/questions` validates Premium access against Google Apps Script
 * (server-side fetch — not hookable from the browser console) and
 * returns question JSON from bundled `server-questions/` data.
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

const ALLOWED_ORIGINS = [
  'https://lernziel-deutsch.de',
  'http://localhost',
  'http://127.0.0.1',
];

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
 * @param {{ SCRIPT_URL?: string }} env
 * @param {URLSearchParams} params
 * @return {Promise<{ok:boolean, isPremium?:boolean, error?:string}>}
 */
async function verifyTrainingAccess(request, env, params) {
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
 * @param {{ SCRIPT_URL?: string }} env
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

  return jsonResponse({
    ok: true,
    level,
    topic: topic || null,
    questions: shuffle(pool).slice(0, limit),
  });
}

export default {
  /**
   * @param {Request} request
   * @param {{ ASSETS: { fetch: (req: Request) => Promise<Response> }, SCRIPT_URL?: string }} env
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
