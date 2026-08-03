/**
 * @fileoverview Magic-Link user session (server-issued, 365-day sliding).
 *
 * Only login credentials are persisted (email + opaque session token +
 * expiry). Premium / Basis flags are never stored — they come from the
 * server on each bootstrap via `bootstrapEntitlements()` in usePremium.js.
 */

import { reactive, computed } from 'vue';
import { loadJSON, saveJSON, removeKey } from '@/composables/useStorage.js';

const SESSION_KEY = 'lzd_user_v1';

const DEFAULT_SESSION = {
  email: '',
  sessionToken: '',
  sessionExpires: '',
};

/**
 * @return {{email:string, sessionToken:string, sessionExpires:string}}
 */
function loadSession() {
  const stored = loadJSON(SESSION_KEY, {});
  return {
    email: String(stored.email || '').trim().toLowerCase(),
    sessionToken: String(stored.sessionToken || ''),
    sessionExpires: String(stored.sessionExpires || ''),
  };
}

const state = reactive(loadSession());

const isLoggedIn = computed(() => {
  if (!state.email || !state.sessionToken || !state.sessionExpires) return false;
  return new Date().toISOString() < state.sessionExpires;
});

/** Persists login credentials only (no entitlements). */
function persist() {
  saveJSON(SESSION_KEY, {
    email: state.email,
    sessionToken: state.sessionToken,
    sessionExpires: state.sessionExpires,
  });
}

/**
 * Stores credentials returned by the backend after magic-link login.
 *
 * @param {{email:string, sessionToken:string, sessionExpires:string}} payload
 */
function setSession(payload) {
  state.email = String(payload.email || '').trim().toLowerCase();
  state.sessionToken = payload.sessionToken || '';
  state.sessionExpires = payload.sessionExpires || '';
  persist();
}

/** Clears the session and removes it from storage. */
function logout() {
  Object.assign(state, DEFAULT_SESSION);
  removeKey(SESSION_KEY);
}

/**
 * @return {{state: typeof state, isLoggedIn: typeof isLoggedIn,
 *   setSession: typeof setSession, logout: typeof logout}}
 */
export function useAuth() {
  return { state, isLoggedIn, setSession, logout };
}
