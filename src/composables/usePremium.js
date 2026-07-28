/**
 * @fileoverview Premium / Basis entitlements composable.
 *
 * With a configured backend, `isPremium` / `isBasis` are true only after
 * a successful server round-trip in `bootstrapEntitlements()`. Activation
 * codes in localStorage are identifiers for re-validation — not proof
 * of access. Transient GAS outages use a cached grace snapshot instead of
 * stripping paid access immediately.
 *
 * Demo mode (`SCRIPT_URL` empty, dev only) falls back to local prefix activation.
 * Stripped from production builds via `import.meta.env.DEV`.
 */

import { reactive, computed } from 'vue';
import { loadJSON, saveJSON, removeKey } from './useStorage.js';
import {
  validateCode as validateOnServer,
  refreshMagicSession,
  revokeMagicSession,
  hasBackend,
} from '@/utils/api.js';
import {
  clearGraceSnapshot,
  isTransientBackendError,
  readGraceSnapshot,
  writeGraceSnapshot,
} from '@/utils/backendGrace.js';
import { isPlausibleTrainingJwt } from '@/utils/trainingJwt.js';
import { useAuth } from './useAuth.js';

const KEY = 'lzd_premium';
const SESSION_TOKEN_KEY = 'lzd_premium_session_token';
const SESSION_EXPIRES_KEY = 'lzd_premium_session_expires';

/** Default empty activation-code storage (codes only — no entitlements). */
function defaults() {
  return { premiumCode: '', basisCode: '' };
}

/**
 * @param {object} raw
 * @return {{premiumCode:string, basisCode:string}}
 */
function normalizeStoredCodes(raw) {
  return {
    premiumCode: String(raw?.premiumCode || ''),
    basisCode: String(raw?.basisCode || ''),
  };
}

const state = reactive(normalizeStoredCodes(loadJSON(KEY, defaults())));

/** Short-lived Premium training JWT — memory only (never persisted). */
let trainingJwt = '';

/** Server-confirmed entitlements (memory only). */
const entitlements = reactive({
  ready: false,
  isPremium: false,
  isBasis: false,
  premiumExpires: '',
});

/** True when the server could not be reached but grace keeps access active. */
export const backendDegraded = reactive({
  active: false,
  message: '',
});

function persistEntitlementGrace() {
  if (!entitlements.isPremium && !entitlements.isBasis) {
    clearGraceSnapshot();
    return;
  }
  writeGraceSnapshot({
    savedAt: Date.now(),
    isPremium: entitlements.isPremium,
    isBasis: entitlements.isBasis,
    premiumExpires: entitlements.premiumExpires,
    premiumCode: state.premiumCode,
    basisCode: state.basisCode,
  });
  backendDegraded.active = false;
  backendDegraded.message = '';
}

/**
 * @param {import('@/utils/backendGrace.js').GraceSnapshot} grace
 */
function applyGraceSnapshot(grace) {
  entitlements.isPremium = !!grace.isPremium;
  entitlements.isBasis = !!grace.isBasis;
  entitlements.premiumExpires = grace.premiumExpires || '';
  if (grace.premiumCode) state.premiumCode = grace.premiumCode;
  if (grace.basisCode) state.basisCode = grace.basisCode;
  persist();
  backendDegraded.active = true;
  backendDegraded.message =
    'Server vorübergehend nicht erreichbar — dein Zugang bleibt vorerst aktiv.';
}

/** Persist activation codes only. */
function persist() {
  saveJSON(KEY, { premiumCode: state.premiumCode, basisCode: state.basisCode });
}

/**
 * @param {string} value
 * @return {string}
 */
function normalizeExpiryDate(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  return raw.includes('T') ? raw.split('T')[0] : raw.slice(0, 10);
}

function clearEntitlements() {
  entitlements.isPremium = false;
  entitlements.isBasis = false;
  entitlements.premiumExpires = '';
  trainingJwt = '';
}

/**
 * @param {unknown} token
 * @return {boolean}
 */
function storeTrainingJwtFromServer(token) {
  if (!isPlausibleTrainingJwt(token)) return false;
  trainingJwt = String(token);
  return true;
}

/**
 * @param {{trainingJwt?:string, isPremium?:boolean, isBasis?:boolean, type?:string}} res
 * @param {string} [code]
 * @return {boolean}
 */
function isPremiumEntitlementResponse(res, code = '') {
  if (String(code || '').startsWith('BASIS') || res.type === 'basis' || res.isBasis) {
    return false;
  }
  if (res.isPremium === true) return true;
  return !!code && !String(code).startsWith('BASIS');
}

/**
 * @param {{trainingJwt?:string, isPremium?:boolean, type?:string}} res
 * @param {string} [code]
 * @return {boolean}
 */
function requirePremiumTrainingJwt(res, code = '') {
  if (!isPremiumEntitlementResponse(res, code)) return true;
  if (!res.trainingJwt) return true;
  return storeTrainingJwtFromServer(res.trainingJwt);
}

/**
 * @param {{isPremium?:boolean, isBasis?:boolean, premiumExpires?:string}} res
 */
function applyEntitlementsFromServer(res) {
  if (res.isPremium) entitlements.isPremium = true;
  if (res.isBasis) entitlements.isBasis = true;
  const exp = normalizeExpiryDate(res.premiumExpires);
  if (exp) entitlements.premiumExpires = exp;
}

/**
 * Persists activation codes returned with a magic-link session so
 * bootstrap can re-validate via validateCode on the next app load.
 *
 * @param {{isPremium?:boolean, isBasis?:boolean, premiumCode?:string, basisCode?:string}} res
 */
function persistCodesFromMagicSession(res) {
  const premiumCode = String(res.premiumCode || '').trim().toUpperCase();
  const basisCode = String(res.basisCode || '').trim().toUpperCase();
  if (res.isPremium && premiumCode) {
    state.premiumCode = premiumCode;
    state.basisCode = '';
    persist();
    return;
  }
  if (res.isBasis && basisCode) {
    state.basisCode = basisCode;
    state.premiumCode = '';
    persist();
  }
}

/**
 * Applies entitlements from validateMagicToken / refreshMagicSession.
 *
 * @param {{isPremium?:boolean, isBasis?:boolean, premiumExpires?:string,
 *   trainingJwt?:string, premiumCode?:string, basisCode?:string}} res
 */
export function applyMagicSessionEntitlements(res) {
  if (!res) return;
  applyEntitlementsFromServer(res);
  if (res.trainingJwt) storeTrainingJwtFromServer(res.trainingJwt);
  persistCodesFromMagicSession(res);
  persistEntitlementGrace();
}

/**
 * @param {{expires?:string, type?:string}} res
 * @param {string} code
 */
function applyEntitlementsFromCode(res, code) {
  const isBasis = code.startsWith('BASIS') || res.type === 'basis';
  if (isBasis) {
    entitlements.isBasis = true;
    return;
  }
  entitlements.isPremium = true;
  entitlements.premiumExpires = normalizeExpiryDate(res.expires);
}

function writeSessionToken(token, expires) {
  try {
    sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    sessionStorage.setItem(SESSION_EXPIRES_KEY, expires);
  } catch {
    /* ignored */
  }
}

function clearSessionToken() {
  try {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_EXPIRES_KEY);
  } catch {
    /* ignored */
  }
}

/**
 * @return {string}  Cached code-session token for server re-validation, or ''.
 */
function readSessionToken() {
  try {
    const token = sessionStorage.getItem(SESSION_TOKEN_KEY) || '';
    const expires = sessionStorage.getItem(SESSION_EXPIRES_KEY) || '';
    if (!token || !expires) return '';
    if (new Date().toISOString() >= expires) return '';
    return token;
  } catch {
    return '';
  }
}

/** Demo-only: derive entitlements from stored codes when offline / no backend. */
function applyDemoEntitlementsFromLocal() {
  clearEntitlements();
  if (state.basisCode && state.basisCode.toUpperCase().startsWith('BASIS')) {
    entitlements.isBasis = true;
  }
  if (state.premiumCode) {
    entitlements.isPremium = true;
  }
}

/**
 * @param {string} code
 * @return {{ok:boolean, type:?string, error:?string}}
 */
function activateLocally(code) {
  if (code.startsWith('PREMIUM')) {
    state.premiumCode = code;
    persist();
    entitlements.isPremium = true;
    entitlements.premiumExpires = new Date(Date.now() + 30 * 86400000)
      .toISOString()
      .split('T')[0];
    return { ok: true, type: 'premium', error: null };
  }
  if (code.startsWith('BASIS')) {
    state.basisCode = code;
    persist();
    entitlements.isBasis = true;
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
 * @param {string} rawCode
 * @param {string} [email]
 * @return {Promise<{ok:boolean, type:?string, error:?string, expires?:string}>}
 */
export async function activateCode(rawCode, email = '') {
  const code = String(rawCode || '').trim().toUpperCase();
  if (!code) return { ok: false, type: null, error: 'Bitte Code eingeben.' };

  if (!hasBackend()) {
    if (!import.meta.env.DEV) {
      return { ok: false, type: null, error: 'Kein Backend konfiguriert.' };
    }
    const local = activateLocally(code);
    if (local.ok) entitlements.ready = true;
    return local;
  }

  // Fresh activation attempt — drop expired code-session so GAS can re-issue.
  clearSessionToken();

  const res = await validateOnServer(code, email, '');
  if (!res || !res.ok) {
    return {
      ok: false,
      type: null,
      error: (res && res.error) || 'Ungültiger Code.',
    };
  }

  if (!res.sessionToken || !res.sessionExpires) {
    return {
      ok: false,
      type: null,
      error: 'Ungültige Server-Antwort.',
    };
  }

  const isBasis = code.startsWith('BASIS') || res.type === 'basis';
  if (!isBasis && res.trainingJwt && !storeTrainingJwtFromServer(res.trainingJwt)) {
    return {
      ok: false,
      type: null,
      error: 'Ungültige Server-Antwort.',
    };
  }

  if (isBasis) {
    state.basisCode = code;
    state.premiumCode = '';
  } else {
    state.premiumCode = code;
    state.basisCode = '';
  }
  persist();

  if (res.sessionToken && res.sessionExpires) {
    writeSessionToken(res.sessionToken, res.sessionExpires);
  }

  applyEntitlementsFromCode(res, code);
  entitlements.ready = true;
  persistEntitlementGrace();

  return {
    ok: true,
    type: isBasis ? 'basis' : 'premium',
    error: null,
    expires: normalizeExpiryDate(res.expires),
  };
}

/**
 * Shared server round-trip for bootstrap and live session checks.
 * Definitive invalid codes/sessions clear local state; transient outages
 * fall back to the last grace snapshot.
 *
 * @return {Promise<{ok:boolean, degraded?:boolean}>}
 */
async function refreshEntitlementsFromServer() {
  backendDegraded.active = false;
  backendDegraded.message = '';
  clearEntitlements();

  if (!hasBackend()) {
    if (import.meta.env.DEV) {
      applyDemoEntitlementsFromLocal();
    }
    return { ok: true };
  }

  const { state: auth, logout, setSession } = useAuth();
  let magicVerified = false;
  let codeVerified = false;
  let transientFailure = false;

  if (auth.email && auth.sessionToken && auth.sessionExpires) {
    if (new Date().toISOString() >= auth.sessionExpires) {
      logout();
    } else {
      const magicRes = await refreshMagicSession(auth.email, auth.sessionToken);
      if (magicRes && magicRes.ok) {
        if (magicRes.isPremium && magicRes.trainingJwt) {
          requirePremiumTrainingJwt(magicRes);
        }
        setSession({
          email: auth.email,
          sessionToken: auth.sessionToken,
          sessionExpires: magicRes.sessionExpires,
        });
        applyEntitlementsFromServer(magicRes);
        persistCodesFromMagicSession(magicRes);
        if (magicRes.trainingJwt) storeTrainingJwtFromServer(magicRes.trainingJwt);
        magicVerified = true;
      } else if (isTransientBackendError(magicRes)) {
        transientFailure = true;
      } else {
        logout();
      }
    }
  }

  const code = state.premiumCode || state.basisCode;
  if (code) {
    const codeRes = await validateOnServer(code, auth.email || '', readSessionToken());
    if (codeRes && codeRes.ok) {
      if (!codeRes.sessionToken || !codeRes.sessionExpires) {
        state.premiumCode = '';
        state.basisCode = '';
        persist();
        clearSessionToken();
      } else if (!requirePremiumTrainingJwt(codeRes, code)) {
        state.premiumCode = '';
        state.basisCode = '';
        persist();
        clearSessionToken();
      } else {
        applyEntitlementsFromCode(codeRes, code);
        if (codeRes.trainingJwt) storeTrainingJwtFromServer(codeRes.trainingJwt);
        if (codeRes.sessionToken && codeRes.sessionExpires) {
          writeSessionToken(codeRes.sessionToken, codeRes.sessionExpires);
        }
        codeVerified = true;
      }
    } else if (isTransientBackendError(codeRes)) {
      transientFailure = true;
    } else {
      state.premiumCode = '';
      state.basisCode = '';
      persist();
      clearSessionToken();
    }
  }

  if (magicVerified || codeVerified) {
    persistEntitlementGrace();
    return { ok: true };
  }

  if (transientFailure) {
    const grace = readGraceSnapshot();
    if (grace && (grace.isPremium || grace.isBasis)) {
      applyGraceSnapshot(grace);
      return { ok: true, degraded: true };
    }
  }

  if (!magicVerified && !codeVerified) {
    clearEntitlements();
  }

  return { ok: true };
}

/**
 * Re-validates entitlements on every app load. Always hits the server when
 * credentials or activation codes exist. Transient outages restore the last
 * grace snapshot instead of stripping paid access.
 *
 * @return {Promise<void>}
 */
export async function bootstrapEntitlements() {
  entitlements.ready = false;
  await refreshEntitlementsFromServer();
  entitlements.ready = true;
}

/**
 * Live entitlement check during training — does not flip `entitlements.ready`
 * (avoids bootstrap overlay flash).
 *
 * @return {Promise<{ok:boolean, isPremium:boolean, isBasis:boolean}>}
 */
export async function verifyEntitlementsLive() {
  const result = await refreshEntitlementsFromServer();
  return {
    ok: result.ok,
    isPremium: entitlements.isPremium,
    isBasis: entitlements.isBasis,
    degraded: !!result.degraded || backendDegraded.active,
  };
}

/** @deprecated Use bootstrapEntitlements */
export async function revalidateOnLoad() {
  return bootstrapEntitlements();
}

/**
 * Credentials for premium API requests (activation code + code session).
 *
 * @return {{premiumCode:string, basisCode:string, email:string, sessionToken:string, trainingJwt:string}}
 */
export function getPremiumRequestContext() {
  const { state: auth } = useAuth();
  return {
    premiumCode: state.premiumCode,
    basisCode: state.basisCode,
    email: auth.email || '',
    sessionToken: readSessionToken(),
    trainingJwt,
  };
}

/** Updates the in-memory training JWT after a verified Worker response. */
export function refreshTrainingJwt(token) {
  storeTrainingJwtFromServer(token);
}

export function clearPremium() {
  state.premiumCode = '';
  persist();
  clearSessionToken();
  entitlements.isPremium = false;
  entitlements.premiumExpires = '';
}

export function clearBasis() {
  state.basisCode = '';
  persist();
  entitlements.isBasis = false;
}

export function clearAll() {
  state.premiumCode = '';
  state.basisCode = '';
  removeKey(KEY);
  clearSessionToken();
  clearEntitlements();
}

/**
 * Ends the magic-link session and clears server-side premium session
 * tokens. Activation codes stay on the device; entitlements reset until
 * the next bootstrap.
 *
 * @return {Promise<void>}
 */
export async function signOutUser() {
  const { state: auth, logout } = useAuth();
  if (hasBackend() && auth.email && auth.sessionToken) {
    try {
      await revokeMagicSession(auth.email, auth.sessionToken);
    } catch {
      /* offline — still clear local state */
    }
  }
  logout();
  clearSessionToken();
  clearGraceSnapshot();
  clearEntitlements();
  entitlements.ready = true;
  backendDegraded.active = false;
  backendDegraded.message = '';
  removeKey('userEmail');
}

const isPremium = computed(() => {
  if (hasBackend()) {
    if (!entitlements.ready) return false;
    return entitlements.isPremium;
  }
  return import.meta.env.DEV && entitlements.isPremium;
});

const isBasis = computed(() => {
  if (hasBackend()) {
    if (!entitlements.ready) return false;
    return entitlements.isBasis;
  }
  return import.meta.env.DEV && entitlements.isBasis;
});

const entitlementsReady = computed(() => entitlements.ready);

export function usePremium() {
  return {
    state,
    isPremium,
    isBasis,
    entitlementsReady,
    backendDegraded,
    activateCode,
    clearPremium,
    clearBasis,
    clearAll,
    signOutUser,
    bootstrapEntitlements,
    verifyEntitlementsLive,
    revalidateOnLoad,
    applyMagicSessionEntitlements,
  };
}
