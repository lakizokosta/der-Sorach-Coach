/**
 * @fileoverview Magic-Link user session (server-issued, 7-day HMAC).
 *
 * The Apps Script backend hands the SPA an opaque session token plus
 * an ISO-8601 expiry whenever the user consumes a magic-link token
 * (`?mltoken=…`). We persist that bundle in localStorage and expose a
 * tiny reactive surface so any view can show login state.
 *
 * Mirrors the `lzd_user` session contract from the original page but
 * uses a versioned key so old payloads don't conflict.
 */

import { reactive, computed } from 'vue';
import { loadJSON, saveJSON, removeKey } from '@/composables/useStorage.js';

const SESSION_KEY = 'lzd_user_v1';

const DEFAULT_SESSION = {
  email: '',
  sessionToken: '',
  sessionExpires: '',
  isPremium: false,
  premiumExpires: '',
  isBasis: false,
};

const state = reactive({ ...DEFAULT_SESSION, ...loadJSON(SESSION_KEY, {}) });

const isLoggedIn = computed(() => {
  if (!state.email || !state.sessionToken || !state.sessionExpires) return false;
  return new Date().toISOString() < state.sessionExpires;
});

/**
 * Persists the current session to localStorage. Called automatically
 * by every mutation in this module.
 */
function persist() {
  saveJSON(SESSION_KEY, {
    email: state.email,
    sessionToken: state.sessionToken,
    sessionExpires: state.sessionExpires,
    isPremium: state.isPremium,
    premiumExpires: state.premiumExpires,
    isBasis: state.isBasis,
  });
}

/**
 * Stores the session payload returned by the backend after a
 * successful `validateMagicToken` round-trip.
 *
 * @param {{email:string, sessionToken:string, sessionExpires:string,
 *   isPremium?:boolean, premiumExpires?:string, isBasis?:boolean}} payload
 */
function setSession(payload) {
  state.email = String(payload.email || '').trim().toLowerCase();
  state.sessionToken = payload.sessionToken || '';
  state.sessionExpires = payload.sessionExpires || '';
  state.isPremium = !!payload.isPremium;
  state.premiumExpires = payload.premiumExpires || '';
  state.isBasis = !!payload.isBasis;
  persist();
}

/**
 * Clears the session and removes it from storage. Use on explicit
 * logout or when the server reports an expired token.
 */
function logout() {
  Object.assign(state, DEFAULT_SESSION);
  removeKey(SESSION_KEY);
}

/**
 * Returns the singleton auth composable surface.
 *
 * @return {{state: typeof state, isLoggedIn: typeof isLoggedIn,
 *   setSession: typeof setSession, logout: typeof logout}}
 */
export function useAuth() {
  return { state, isLoggedIn, setSession, logout };
}
