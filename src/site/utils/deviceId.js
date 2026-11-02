/**
 * @fileoverview Stable per-browser device identifier.
 *
 * Mirrors `getDeviceId()` from the original `blogspot.html`:
 *   1. Builds a browser fingerprint (screen, locale, canvas hash, …).
 *   2. Looks up an existing ID across three storage layers
 *      (localStorage → cookie → sessionStorage) so the ID survives
 *      `localStorage.clear()` and incognito browser quirks.
 *   3. Generates a fresh ID prefixed with the fingerprint when
 *      nothing is found, then writes it to all three layers.
 *   4. Returns the ID concatenated with the fingerprint so the
 *      server can independently verify both halves.
 *
 * No PII is collected — the canvas fingerprint is a one-way hash of
 * a single tiny glyph the canvas renders at startup.
 */

const STORAGE_KEY = 'deviceId';
const COOKIE_NAME = 'lzd_did';
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 365;

/**
 * Builds a short, stable browser fingerprint string.
 *
 * @return {string} Hash of the form `fp_<hex>`.
 */
function buildBrowserFingerprint() {
  const parts = [
    screen.width,
    screen.height,
    screen.colorDepth,
    navigator.language || navigator.userLanguage || '',
    navigator.hardwareConcurrency || 0,
    navigator.platform || '',
    safeTimezone(),
    safeCanvasFingerprint(),
  ];
  const str = parts.join('|');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return `fp_${(hash >>> 0).toString(16)}`;
}

/**
 * Returns the IANA timezone name, or an empty string if unavailable.
 * @return {string}
 */
function safeTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    return '';
  }
}

/**
 * Tiny canvas fingerprint — encodes GPU + driver + font stack into a
 * short suffix of the rendered data URL.
 *
 * @return {string}
 */
function safeCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#AB4DBB';
    ctx.fillText('LZD🔥', 2, 2);
    return canvas.toDataURL().slice(-20);
  } catch {
    return 'nc';
  }
}

/**
 * Reads the device-ID cookie (if any).
 * @return {string}
 */
function readCookie() {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : '';
}

/**
 * Writes the device-ID cookie with a one-year max-age.
 * @param {string} value
 */
function writeCookie(value) {
  try {
    document.cookie = `${COOKIE_NAME}=${value};max-age=${COOKIE_MAX_AGE_SEC};path=/;SameSite=Lax`;
  } catch {
    /* cookies disabled — silently ignore */
  }
}

/**
 * Reads a key from a Storage object, swallowing access errors thrown
 * by browsers that disable storage in third-party contexts.
 *
 * @param {Storage} store
 * @param {string}  key
 * @return {string}
 */
function safeGet(store, key) {
  try {
    return store.getItem(key) || '';
  } catch {
    return '';
  }
}

/**
 * Writes a key to a Storage object, swallowing quota / disabled errors.
 *
 * @param {Storage} store
 * @param {string}  key
 * @param {string}  value
 */
function safeSet(store, key, value) {
  try {
    store.setItem(key, value);
  } catch {
    /* ignored */
  }
}

/**
 * Returns a stable, opaque device identifier suitable for sending to
 * the server alongside an activation code.
 *
 * The returned value has the format `<storedId>__<fingerprint>` —
 * the server may verify the fingerprint independently to catch a
 * trivially-cloned localStorage payload.
 *
 * @return {string}
 */
export function getDeviceId() {
  const fp = buildBrowserFingerprint();

  const lsId = safeGet(localStorage, STORAGE_KEY);
  const cookieId = readCookie();
  const ssId = safeGet(sessionStorage, STORAGE_KEY);

  const existing = lsId || cookieId || ssId;

  if (existing) {
    if (!lsId) safeSet(localStorage, STORAGE_KEY, existing);
    if (!cookieId) writeCookie(existing);
    if (!ssId) safeSet(sessionStorage, STORAGE_KEY, existing);
    return `${existing}__${fp}`;
  }

  const randomSuffix = Math.random().toString(36).slice(2, 9);
  const newId = `dev_${fp}_${randomSuffix}`;
  safeSet(localStorage, STORAGE_KEY, newId);
  writeCookie(newId);
  safeSet(sessionStorage, STORAGE_KEY, newId);
  return `${newId}__${fp}`;
}
