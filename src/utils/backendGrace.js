/**
 * @fileoverview Offline grace for paid entitlements when GAS is temporarily down.
 *
 * Premium/Basis must not disappear because of a cold start, timeout, or blip.
 * A recent server-confirmed snapshot is kept for up to GRACE_MAX_MS.
 */

import { loadJSON, saveJSON, removeKey } from '@/composables/useStorage.js';

const GRACE_KEY = 'lzd_entitlement_grace';

/** 72 h — long enough for GAS outages, short enough to limit abuse. */
export const GRACE_MAX_MS = 72 * 60 * 60 * 1000;

/**
 * @param {unknown} res
 * @return {boolean}
 */
export function isOAuthBackendError(res) {
  if (!res || typeof res !== 'object' || res.ok) return false;
  const err = String(res.error || '');
  return /Backend-Zugriff verweigert|Apps Script neu deployen|Google-Anmeldeseite|OAuth abgelaufen|Access Denied/i.test(err);
}

/**
 * @param {unknown} res
 * @return {boolean}
 */
export function isTransientBackendError(res) {
  if (!res || typeof res !== 'object') return true;
  if (res.ok) return false;

  const err = String(res.error || '');
  if (res.timedOut) return true;
  if (isOAuthBackendError(res)) return true;
  if (/Keine Verbindung|Zeitüberschreitung|timeout|network|unreachable|Backend unreachable|Empty backend|Serverfehler \(5/i.test(err)) {
    return true;
  }
  if (/Leere Backend-Antwort|Ungültige Backend-Antwort|Invalid backend|Empty backend response/i.test(err)) {
    return true;
  }
  if (/403|verweigert|Forbidden|Ungültig|nicht gefunden|Unknown action|Unknown request|Gerätelimit|Invalid training/i.test(err)) {
    return false;
  }
  return false;
}

/**
 * @typedef {{
 *   savedAt: number,
 *   isPremium: boolean,
 *   isBasis: boolean,
 *   premiumExpires: string,
 *   premiumCode: string,
 *   basisCode: string,
 * }} GraceSnapshot
 */

/**
 * @return {?GraceSnapshot}
 */
export function readGraceSnapshot() {
  const row = loadJSON(GRACE_KEY, null);
  if (!row || typeof row !== 'object') return null;
  const savedAt = Number(row.savedAt) || 0;
  if (!savedAt || Date.now() - savedAt > GRACE_MAX_MS) {
    removeKey(GRACE_KEY);
    return null;
  }
  return {
    savedAt,
    isPremium: !!row.isPremium,
    isBasis: !!row.isBasis,
    premiumExpires: String(row.premiumExpires || ''),
    premiumCode: String(row.premiumCode || ''),
    basisCode: String(row.basisCode || ''),
  };
}

/**
 * @param {GraceSnapshot} snapshot
 */
export function writeGraceSnapshot(snapshot) {
  saveJSON(GRACE_KEY, {
    savedAt: Date.now(),
    isPremium: !!snapshot.isPremium,
    isBasis: !!snapshot.isBasis,
    premiumExpires: String(snapshot.premiumExpires || ''),
    premiumCode: String(snapshot.premiumCode || ''),
    basisCode: String(snapshot.basisCode || ''),
  });
}

export function clearGraceSnapshot() {
  removeKey(GRACE_KEY);
}
