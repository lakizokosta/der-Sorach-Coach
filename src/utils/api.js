/**
 * @fileoverview Thin client for the Google Apps Script backend
 * (see `payments-old.js` in git history for the deployed source).
 *
 * The SPA talks to the script through three POST shapes and two GET
 * actions. POSTs are sent as `text/plain` JSON bodies so the browser
 * does NOT trigger a CORS preflight — Apps Script reads the raw body
 * via `e.postData.contents` regardless of the declared content-type.
 *
 * All calls are network-resilient: any thrown error is normalised to
 * `{ok: false, error}` so callers never need a try/catch.
 */

import { SCRIPT_URL } from '@/data/payment.js';
import { getDeviceId } from '@/utils/deviceId.js';

/**
 * Returns true when a backend URL is configured. UI can use this to
 * hide server-only features (Magic Link, …) in pure demo
 * mode.
 *
 * @return {boolean}
 */
export function hasBackend() {
  return typeof SCRIPT_URL === 'string' && SCRIPT_URL.length > 0;
}

/**
 * @param {Response} res
 * @param {string} text
 * @return {{ ok: false, error: string }|null}
 */
function httpFailure(res, text) {
  if (res.ok) return null;
  if (res.status === 403) {
    return {
      ok: false,
      error:
        'Backend-Zugriff verweigert (403). Apps Script neu deployen: „Execute as: Me“, „Who has access: Anyone“.',
    };
  }
  if (res.status >= 500) {
    return { ok: false, error: `Backend-Serverfehler (${res.status})` };
  }
  const snippet = text.replace(/\s+/g, ' ').trim().slice(0, 80);
  return {
    ok: false,
    error: snippet
      ? `Backend-Fehler (${res.status}): ${snippet}`
      : `Backend-Fehler (${res.status})`,
  };
}

/**
 * @param {unknown} err
 * @return {{ ok: false, error: string }}
 */
function networkFailure(err) {
  const msg = err && typeof err === 'object' && 'message' in err
    ? String(err.message)
    : '';
  if (/failed to fetch|networkerror|load failed|cors/i.test(msg)) {
    return {
      ok: false,
      error:
        'Keine Verbindung zum Backend. Prüfe Internet — oder Apps Script ist nicht öffentlich erreichbar (403).',
    };
  }
  return { ok: false, error: 'Keine Verbindung' };
}

/**
 * Performs a GET against the Apps Script Web App.
 *
 * @param {Object<string, string>} params  Query-string parameters.
 * @return {Promise<Object>} The JSON response or `{ok:false,error}`.
 */
async function getJson(params) {
  if (!hasBackend()) return { ok: false, error: 'Kein Backend konfiguriert' };
  const qs = new URLSearchParams(params).toString();
  try {
    const res = await fetch(`${SCRIPT_URL}?${qs}`, { method: 'GET' });
    const text = await res.text();
    const fail = httpFailure(res, text);
    if (fail) return fail;
    if (!text) return { ok: false, error: 'Leere Backend-Antwort' };
    try {
      return JSON.parse(text);
    } catch {
      return { ok: false, error: 'Ungültige Backend-Antwort (kein JSON)' };
    }
  } catch (err) {
    return networkFailure(err);
  }
}

/**
 * Performs a POST against the Apps Script Web App.
 *
 * @param {Object} body  Will be JSON-stringified and sent as the body.
 * @return {Promise<Object>} The JSON response or `{ok:false,error}`.
 */
async function postJson(body) {
  if (!hasBackend()) return { ok: false, error: 'Kein Backend konfiguriert' };
  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    const fail = httpFailure(res, text);
    if (fail) return fail;
    if (!text) return { ok: true };
    try {
      return JSON.parse(text);
    } catch {
      return { ok: false, error: 'Ungültige Backend-Antwort (kein JSON)' };
    }
  } catch (err) {
    return networkFailure(err);
  }
}

/**
 * Read-only ping — validates that the Web App URL responds with JSON.
 *
 * @return {Promise<{ok:boolean, error?:string}>}
 */
export function pingBackend() {
  return getJson({ action: 'validateCode', code: 'PING' });
}

/**
 * Validates an activation code against the `Codes` sheet. On success
 * the server returns `expires`, `sessionToken` and `sessionExpires`.
 *
 * @param {string} code   Activation code (case-insensitive).
 * @param {string} email  Optional buyer e-mail used for binding.
 * @return {Promise<{ok:boolean, expires?:string, sessionToken?:string,
 *   sessionExpires?:string, type?:string, error?:string}>}
 */
export function validateCode(code, email = '', sessionToken = '') {
  return getJson({
    action: 'validateCode',
    code: String(code || '').trim().toUpperCase(),
    email: String(email || '').trim().toLowerCase(),
    deviceId: getDeviceId(),
    sessionToken: String(sessionToken || '').trim(),
  });
}

/**
 * Consumes a magic-link token from an `?mltoken=…` URL parameter.
 * On success the server returns the resolved e-mail, a 365-day sliding
 * session token, and the current Premium status.
 *
 * @param {string} token  Raw token value from the URL.
 * @return {Promise<{ok:boolean, email?:string, sessionToken?:string,
 *   sessionExpires?:string, isPremium?:boolean, premiumExpires?:string,
 *   error?:string}>}
 */
export function validateMagicToken(token) {
  return getJson({
    action: 'validateMagicToken',
    token: String(token || '').trim(),
    deviceId: getDeviceId(),
  });
}

/**
 * Requests a magic-link login email. Rate-limited server-side to 3
 * requests per 10 minutes per e-mail.
 *
 * @param {string} email  Destination address.
 * @return {Promise<{ok:boolean, message?:string, error?:string}>}
 */
export function requestMagicLink(email) {
  return postJson({
    requestMagicLink: true,
    email: String(email || '').trim().toLowerCase(),
    deviceId: getDeviceId(),
  });
}

/**
 * Extends a magic-link session (sliding expiry). Called on each app load
 * while the user is still logged in.
 *
 * @param {string} email
 * @param {string} sessionToken
 * @return {Promise<{ok:boolean, sessionExpires?:string, isPremium?:boolean,
 *   premiumExpires?:string, isBasis?:boolean, error?:string}>}
 */
export function refreshMagicSession(email, sessionToken) {
  return postJson({
    action: 'refreshMagicSession',
    email: String(email || '').trim().toLowerCase(),
    sessionToken: String(sessionToken || '').trim(),
  });
}

/**
 * Submits the contact form. The script forwards it to the support
 * inbox via `MailApp.sendEmail`.
 *
 * @param {{name:string, email:string, message:string, isPremium:boolean,
 *   page?:string}} data
 * @return {Promise<{ok:boolean, error?:string}>}
 */
export function sendContactForm(data) {
  return postJson({
    contactForm: true,
    name: data.name || '',
    email: data.email || '',
    message: data.message || '',
    isPremium: !!data.isPremium,
    page: data.page || (typeof location !== 'undefined' ? location.href : ''),
  });
}

/**
 * Loads XP + streak for a logged-in user (requires magic session).
 *
 * @param {string} email
 * @param {string} sessionToken
 * @return {Promise<{ok:boolean, streakData?:string, xpData?:string, error?:string}>}
 */
export function loadProgress(email, sessionToken) {
  return postJson({
    action: 'loadProgressByEmail',
    email: String(email || '').trim().toLowerCase(),
    sessionToken: String(sessionToken || '').trim(),
  });
}

/**
 * Saves XP + streak for a logged-in user (requires magic session).
 *
 * @param {{email:string, sessionToken:string, streakData:string, xpData:string,
 *   dailyGoalData?:string}} data
 * @return {Promise<{ok:boolean, error?:string}>}
 */
export function saveProgress(data) {
  return postJson({
    action: 'saveProgressByEmail',
    email: String(data.email || '').trim().toLowerCase(),
    sessionToken: String(data.sessionToken || '').trim(),
    streakData: data.streakData || '',
    xpData: data.xpData || '',
    dailyGoalData: data.dailyGoalData || '',
  });
}

/**
 * Legacy: saves streak JSON keyed by a Premium activation code.
 *
 * @param {string} code
 * @param {string} streakData  Serialised streak object.
 * @return {Promise<object>}
 */
export function saveStreakByCode(code, streakData) {
  return postJson({
    saveStreak: true,
    code: String(code || '').trim().toUpperCase(),
    streakData: streakData || '',
  });
}
