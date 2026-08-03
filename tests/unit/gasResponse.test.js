import { describe, it, expect } from 'vitest';
import {
  classifyGasHttpResponse,
  gasHttpFailure,
  classifyGasHttpFailure,
  GAS_RESPONSE_KIND,
} from '@/utils/gasResponse.js';

describe('classifyGasHttpResponse', () => {
  it('detects OAuth 403', () => {
    expect(classifyGasHttpResponse(403, '')).toBe(GAS_RESPONSE_KIND.OAUTH403);
  });

  it('detects HTML login page on 200', () => {
    const html = '<!DOCTYPE html><html><body>Sign in - Google Accounts</body></html>';
    expect(classifyGasHttpResponse(200, html)).toBe(GAS_RESPONSE_KIND.HTML_LOGIN);
  });

  it('detects accounts.google.com redirect body', () => {
    const body = '{"redirect": "https://accounts.google.com/ServiceLogin"}';
    expect(classifyGasHttpResponse(302, body)).toBe(GAS_RESPONSE_KIND.HTML_LOGIN);
  });

  it('returns null for valid JSON body', () => {
    expect(classifyGasHttpResponse(200, '{"ok":false,"error":"Code nicht gefunden"}')).toBeNull();
  });

  it('detects empty body', () => {
    expect(classifyGasHttpResponse(200, '')).toBe(GAS_RESPONSE_KIND.EMPTY);
  });
});

describe('gasHttpFailure', () => {
  it('returns OAuth 403 message matching api.js / backendGrace', () => {
    const fail = gasHttpFailure(GAS_RESPONSE_KIND.OAUTH403);
    expect(fail?.error).toMatch(/Backend-Zugriff verweigert \(403\)/);
  });

  it('returns HTML login message (P1-9)', () => {
    const fail = gasHttpFailure(GAS_RESPONSE_KIND.HTML_LOGIN);
    expect(fail?.error).toMatch(/Google-Anmeldeseite/);
  });
});

describe('classifyGasHttpFailure', () => {
  it('flags HTML login even when HTTP 200', () => {
    const html = '<html><head></head><body>Login</body></html>';
    const res = { ok: true, status: 200 };
    const fail = classifyGasHttpFailure(res, html);
    expect(fail?.error).toMatch(/Google-Anmeldeseite/);
  });

  it('returns null for valid JSON 200', () => {
    const res = { ok: true, status: 200 };
    expect(classifyGasHttpFailure(res, '{"ok":false}')).toBeNull();
  });
});
