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
 * hide server-only features (Magic Link, trial code, …) in pure demo
 * mode.
 *
 * @return {boolean}
 */
export function hasBackend() {
  return typeof SCRIPT_URL === 'string' && SCRIPT_URL.length > 0;
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
    return await res.json();
  } catch (err) {
    return { ok: false, error: 'Keine Verbindung' };
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
    if (!text) return { ok: true };
    try {
      return JSON.parse(text);
    } catch {
      return { ok: true, raw: text };
    }
  } catch (err) {
    return { ok: false, error: 'Keine Verbindung' };
  }
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
export function validateCode(code, email = '') {
  return getJson({
    action: 'validateCode',
    code: String(code || '').trim().toUpperCase(),
    email: String(email || '').trim().toLowerCase(),
    deviceId: getDeviceId(),
  });
}

/**
 * Consumes a magic-link token from an `?mltoken=…` URL parameter.
 * On success the server returns the resolved e-mail, a 7-day user
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
 * Requests a one-time 1-day trial activation code by e-mail. Only one
 * trial is issued per (e-mail, device) pair.
 *
 * @param {string} email  Destination address.
 * @return {Promise<{ok:boolean, error?:string}>}
 */
export function requestTrial(email) {
  return postJson({
    requestTrial: true,
    email: String(email || '').trim().toLowerCase(),
    deviceId: getDeviceId(),
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
