import { describe, it, expect, beforeEach } from 'vitest';
import {
  isTransientBackendError,
  isOAuthBackendError,
  readGraceSnapshot,
  writeGraceSnapshot,
  clearGraceSnapshot,
  GRACE_MAX_MS,
} from '@/utils/backendGrace.js';

describe('isOAuthBackendError', () => {
  it('detects GAS OAuth 403 message from api.js', () => {
    expect(isOAuthBackendError({
      ok: false,
      error: 'Backend-Zugriff verweigert (403). Apps Script neu deployen: „Execute as: Me“, „Who has access: Anyone“.',
    })).toBe(true);
  });

  it('detects HTML login redirect message (P1-9)', () => {
    expect(isOAuthBackendError({
      ok: false,
      error: 'Backend leitet zur Google-Anmeldeseite um — Web App nicht öffentlich oder OAuth abgelaufen.',
    })).toBe(true);
  });

  it('returns false for device limit and invalid code errors', () => {
    expect(isOAuthBackendError({ ok: false, error: 'Gerätelimit erreicht' })).toBe(false);
    expect(isOAuthBackendError({ ok: false, error: 'Ungültig' })).toBe(false);
  });
});

describe('isTransientBackendError', () => {
  it('returns false for ok responses', () => {
    expect(isTransientBackendError({ ok: true })).toBe(false);
  });

  it('detects network/timeout errors as transient', () => {
    expect(isTransientBackendError({ ok: false, error: 'Keine Verbindung' })).toBe(true);
    expect(isTransientBackendError({ ok: false, timedOut: true })).toBe(true);
    expect(isTransientBackendError({ ok: false, error: 'Serverfehler (502)' })).toBe(true);
  });

  it('treats OAuth 403 as transient (grace applies — P1-8)', () => {
    expect(isTransientBackendError({
      ok: false,
      error: 'Backend-Zugriff verweigert (403). Apps Script neu deployen.',
    })).toBe(true);
  });

  it('treats non-OAuth auth errors as permanent', () => {
    expect(isTransientBackendError({ ok: false, error: '403 verweigert' })).toBe(false);
    expect(isTransientBackendError({ ok: false, error: 'Ungültig' })).toBe(false);
    expect(isTransientBackendError({ ok: false, error: 'Gerätelimit erreicht' })).toBe(false);
  });
});

describe('grace snapshot', () => {
  beforeEach(() => {
    localStorage.clear();
    clearGraceSnapshot();
  });

  it('writes and reads snapshot within grace period', () => {
    writeGraceSnapshot({
      isPremium: true,
      isBasis: false,
      premiumExpires: '2099-01-01',
      premiumCode: 'PREMIUM-TEST',
      basisCode: '',
    });
    const snap = readGraceSnapshot();
    expect(snap).not.toBeNull();
    expect(snap.isPremium).toBe(true);
    expect(snap.premiumCode).toBe('PREMIUM-TEST');
  });

  it('expires snapshot after GRACE_MAX_MS', () => {
    writeGraceSnapshot({ isPremium: true, isBasis: false, premiumExpires: '', premiumCode: '', basisCode: '' });
    const key = 'lzd_entitlement_grace';
    const row = JSON.parse(localStorage.getItem(key));
    row.savedAt = Date.now() - GRACE_MAX_MS - 1000;
    localStorage.setItem(key, JSON.stringify(row));
    expect(readGraceSnapshot()).toBeNull();
  });

  it('clearGraceSnapshot removes data', () => {
    writeGraceSnapshot({ isPremium: false, isBasis: true, premiumExpires: '', premiumCode: '', basisCode: 'BASIS-X' });
    clearGraceSnapshot();
    expect(readGraceSnapshot()).toBeNull();
  });
});
