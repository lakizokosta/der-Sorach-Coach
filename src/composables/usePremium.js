/**
 * @fileoverview Premium / Basis status composable.
 *
 * Activation uses the Apps Script backend (`src/utils/api.js`) when a
 * `SCRIPT_URL` is configured in `src/data/payment.js`. The server is
 * the single source of truth — codes (`STRIPE_*`, `PREMIUM_*`,
 * `BASIS_*`, `TEST1-*`, `TEST2024`) are validated against the `Codes`
 * sheet which also binds them to the buyer's e-mail and device.
 *
 * When `SCRIPT_URL` is empty (e.g. local development without a
 * deployed backend) `activateCode` falls back to a permissive demo
 * activator that recognises the `PREMIUM_*` and `BASIS_*` prefixes
 * locally. This keeps the SPA usable offline without ever silently
 * accepting unknown codes against a real backend.
 *
 * The server-issued 2-hour `sessionToken` is cached in
 * `sessionStorage`; while it is valid we skip re-validation on page
 * load. Once it expires we re-validate against the server (silently
 * clearing premium if the server now rejects the code).
 */

import { reactive, computed } from 'vue';
import { loadJSON, saveJSON, removeKey } from './useStorage.js';
import { validateCode as validateOnServer, hasBackend } from '@/utils/api.js';

const KEY = 'lzd_premium';
const SESSION_TOKEN_KEY = 'lzd_premium_session_token';
const SESSION_EXPIRES_KEY = 'lzd_premium_session_expires';

/** Default empty premium status. */
function defaults() {
  return { premiumCode: '', premiumExpires: '', basisCode: '' };
}

const state = reactive(loadJSON(KEY, defaults()));

/** Persist the current reactive state to localStorage. */
function persist() {
  saveJSON(KEY, { ...state });
}

/**
 * Reads the cached server session token from sessionStorage.
 *
 * @return {{token:string, expires:string} | null}
 */
function readSessionToken() {
  try {
    const token = sessionStorage.getItem(SESSION_TOKEN_KEY) || '';
    const expires = sessionStorage.getItem(SESSION_EXPIRES_KEY) || '';
    if (!token || !expires) return null;
    if (new Date().toISOString() >= expires) return null;
    return { token, expires };
  } catch {
    return null;
  }
}

/**
 * Caches a server-issued session token in sessionStorage.
 *
 * @param {string} token
 * @param {string} expires  ISO-8601 expiry timestamp.
 */
function writeSessionToken(token, expires) {
  try {
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    sessionStorage.setItem(SESSION_EXPIRES_KEY, expires);
  } catch {
    /* ignored */
  }
}

/** Clears any cached session token. */
function clearSessionToken() {
  try {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_EXPIRES_KEY);
  } catch {
    /* ignored */
  }
}

/**
 * Whether Premium is currently active (code present and not expired).
 *
 * @return {boolean}
 */
function isPremiumActive() {
  if (!state.premiumCode) return false;
  if (!state.premiumExpires) return true;
  return new Date().toISOString().split('T')[0] <= state.premiumExpires;
}

/**
 * Whether the Basis plan (no time limit) is active.
 *
 * @return {boolean}
 */
function isBasisActive() {
  return Boolean(state.basisCode) && state.basisCode.toUpperCase().startsWith('BASIS');
}

/**
 * Demo-only fallback activator used when no Apps Script backend is
 * configured (`SCRIPT_URL` is empty). Recognises `PREMIUM_*` and
 * `BASIS_*` prefixes and unlocks the corresponding plan locally.
 *
 * @param {string} code  Already trimmed + uppercased.
 * @return {{ok:boolean, type:?string, error:?string}}
 */
function activateLocally(code) {
  if (code.startsWith('PREMIUM')) {
    const expiresDate = new Date(Date.now() + 30 * 86400000);
    state.premiumCode = code;
    state.premiumExpires = expiresDate.toISOString().split('T')[0];
    persist();
    return { ok: true, type: 'premium', error: null };
  }
  if (code.startsWith('BASIS')) {
    state.basisCode = code;
    persist();
    return { ok: true, type: 'basis', error: null };
  }
  return {
    ok: false,
    type: null,
    error: 'Ungültiger Code. Tipp: starte mit PREMIUM… oder BASIS… (Demo-Modus).',
  };
}

/**
 * Validates and activates an activation code.
 *
 * In production the SPA delegates to the Apps Script `validateCode`
 * endpoint, which atomically checks expiry, binding, and the e-mail
 * tied to the code. In demo mode (`SCRIPT_URL` empty) the function
 * falls back to a local prefix-check.
 *
 * @param {string} rawCode  Code as typed by the user.
 * @param {string} [email]  Optional buyer e-mail for server-side binding.
 * @return {Promise<{ok:boolean, type:?string, error:?string,
 *   expires?:string}>}
 */
export async function activateCode(rawCode, email = '') {
  const code = String(rawCode || '').trim().toUpperCase();
  if (!code) return { ok: false, type: null, error: 'Bitte Code eingeben.' };

  if (!hasBackend()) return activateLocally(code);

  const res = await validateOnServer(code, email);
  if (!res || !res.ok) {
    return {
      ok: false,
      type: null,
      error: (res && res.error) || 'Ungültiger Code.',
    };
  }

  const isBasis = code.startsWith('BASIS') || res.type === 'basis';
  if (isBasis) {
    state.basisCode = code;
    persist();
  } else {
    state.premiumCode = code;
    state.premiumExpires = res.expires || '';
    persist();
    if (res.sessionToken && res.sessionExpires) {
      writeSessionToken(res.sessionToken, res.sessionExpires);
    }
  }

  return {
    ok: true,
    type: isBasis ? 'basis' : 'premium',
    error: null,
    expires: res.expires || '',
  };
}

/**
 * Re-validates the stored Premium code on app boot. If the cached
 * server session token is still valid we skip the round-trip. If the
 * server rejects the code we silently clear premium so the UI cannot
 * lie about the user's status.
 *
 * Safe to call on every page load — no-op when no backend or no code.
 *
 * @return {Promise<void>}
 */
export async function revalidateOnLoad() {
  if (!hasBackend()) return;
  if (!state.premiumCode) return;
  if (readSessionToken()) return;

  const res = await validateOnServer(state.premiumCode, '');
  if (res && res.ok) {
    state.premiumExpires = res.expires || state.premiumExpires;
    persist();
    if (res.sessionToken && res.sessionExpires) {
      writeSessionToken(res.sessionToken, res.sessionExpires);
    }
    return;
  }
  if (res && res.error) {
    state.premiumCode = '';
    state.premiumExpires = '';
    persist();
    clearSessionToken();
  }
}

/** Removes the Premium activation from storage. */
export function clearPremium() {
  state.premiumCode = '';
  state.premiumExpires = '';
  persist();
  clearSessionToken();
}

/** Removes the Basis activation from storage. */
export function clearBasis() {
  state.basisCode = '';
  persist();
}

/** Clears every activation and the storage key entirely. */
export function clearAll() {
  state.premiumCode = '';
  state.premiumExpires = '';
  state.basisCode = '';
  removeKey(KEY);
  clearSessionToken();
}

/**
 * Public hook exposing reactive premium state plus helpers.
 *
 * @return {{state:object, isPremium:object, isBasis:object,
 *           activateCode:Function, clearPremium:Function,
 *           clearBasis:Function, clearAll:Function,
 *           revalidateOnLoad:Function}}
 */
export function usePremium() {
  const isPremium = computed(isPremiumActive);
  const isBasis = computed(isBasisActive);
  return {
    state,
    isPremium,
    isBasis,
    activateCode,
    clearPremium,
    clearBasis,
    clearAll,
    revalidateOnLoad,
  };
}
