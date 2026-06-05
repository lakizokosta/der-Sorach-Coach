/**
 * @fileoverview Premium / Basis status composable.
 *
 * The original trainer integrated with Stripe, PayPal, magic-link login
 * and a Google Apps Script backend. This rebuild keeps the functional
 * surface (Premium / Basis flags, activation flow) but the activation
 * runs entirely client-side in *demo* mode:
 *
 *   - Any code starting with `PREMIUM` unlocks Premium for 30 days.
 *   - Any code starting with `BASIS`   unlocks the Basis plan (no expiry).
 *   - Activation is purely cosmetic — no payment, no network call.
 *
 * This is the right place to swap in a real Stripe/Backend integration
 * later: only the `activateCode` and `clearPremium` helpers need to change.
 */

import { reactive, computed } from 'vue';
import { loadJSON, saveJSON, removeKey } from './useStorage.js';

const KEY = 'lzd_premium';

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
 * Validates and activates a Premium/Basis code in demo mode.
 *
 * @param {string} rawCode  Code entered by the user.
 * @return {{ok:boolean, type:?string, error:?string}}
 */
export function activateCode(rawCode) {
  const code = String(rawCode || '').trim().toUpperCase();
  if (!code) return { ok: false, type: null, error: 'Bitte Code eingeben.' };

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
  return { ok: false, type: null, error: 'Ungültiger Code. Tipp: starte mit PREMIUM... oder BASIS...' };
}

/** Removes the Premium activation from storage. */
export function clearPremium() {
  state.premiumCode = '';
  state.premiumExpires = '';
  persist();
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
}

/**
 * Public hook exposing reactive premium state plus helpers.
 *
 * @return {{state:object, isPremium:object, isBasis:object,
 *           activateCode:Function, clearPremium:Function,
 *           clearBasis:Function, clearAll:Function}}
 */
export function usePremium() {
  const isPremium = computed(isPremiumActive);
  const isBasis = computed(isBasisActive);
  return { state, isPremium, isBasis, activateCode, clearPremium, clearBasis, clearAll };
}
