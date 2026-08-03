import { describe, it, expect } from 'vitest';
import {
  parseDeployLog,
  assessOAuthDeployStatus,
  classifyGasPingResponse,
  assessGasLatency,
} from '@/utils/gasDeployLog.js';

const DEPLOY_MS = new Date('2026-08-01T12:00:00Z').getTime();

describe('parseDeployLog', () => {
  it('computes days since deploy in testing mode (7d lifetime)', () => {
    const log = parseDeployLog(
      { lastDeployAt: '2026-08-01', oauthMode: 'testing', oauthTokenLifetimeDays: 7 },
      { now: DEPLOY_MS + 5 * 86400000 },
    );
    expect(log.daysSinceDeploy).toBe(5);
    expect(log.daysUntilExpiry).toBe(2);
  });

  it('uses default 7d lifetime when oauthMode is testing and lifetime omitted', () => {
    const log = parseDeployLog(
      { lastDeployAt: '2026-08-01', oauthMode: 'testing' },
      { now: DEPLOY_MS },
    );
    expect(log.oauthTokenLifetimeDays).toBe(7);
    expect(log.daysUntilExpiry).toBe(7);
  });

  it('skips expiry tracking in production mode without explicit lifetime', () => {
    const log = parseDeployLog(
      { lastDeployAt: '2026-08-01', oauthMode: 'production' },
      { now: DEPLOY_MS + 30 * 86400000 },
    );
    expect(log.oauthTokenLifetimeDays).toBe(0);
    expect(log.daysUntilExpiry).toBeNull();
  });

  it('returns null days when lastDeployAt missing', () => {
    const log = parseDeployLog({ oauthMode: 'testing' });
    expect(log.daysSinceDeploy).toBeNull();
  });
});

describe('assessOAuthDeployStatus', () => {
  it('flags redeployEmailDue exactly 1 day before expiry', () => {
    const log = parseDeployLog(
      { lastDeployAt: '2026-08-01', oauthMode: 'testing', oauthTokenLifetimeDays: 7 },
      { now: DEPLOY_MS + 6 * 86400000 },
    );
    const result = assessOAuthDeployStatus(log);
    expect(result.redeployEmailDue).toBe(true);
    expect(result.level).toBe('warn');
  });

  it('fails when token expired (daysUntilExpiry <= 0)', () => {
    const log = parseDeployLog(
      { lastDeployAt: '2026-08-01', oauthMode: 'testing', oauthTokenLifetimeDays: 7 },
      { now: DEPLOY_MS + 8 * 86400000 },
    );
    const result = assessOAuthDeployStatus(log);
    expect(result.level).toBe('fail');
    expect(result.redeployEmailDue).toBe(false);
  });

  it('warns when deploy log missing', () => {
    const result = assessOAuthDeployStatus(parseDeployLog({}));
    expect(result.level).toBe('warn');
    expect(result.messages[0]).toMatch(/Deploy log missing/);
  });
});

describe('classifyGasPingResponse', () => {
  it('detects OAuth 403', () => {
    expect(classifyGasPingResponse({ status: 403, body: '', isJson: false, data: null })).toBe('oauth403');
  });

  it('accepts live German script (Code nicht gefunden)', () => {
    expect(classifyGasPingResponse({
      status: 200,
      body: '{}',
      isJson: true,
      data: { ok: false, error: 'Code nicht gefunden' },
    })).toBe('ok');
  });

  it('detects old Russian script', () => {
    expect(classifyGasPingResponse({
      status: 200,
      isJson: true,
      data: { ok: false, error: 'Код не найден' },
      body: '',
    })).toBe('old_script');
  });

  it('detects HTML login page instead of JSON', () => {
    expect(classifyGasPingResponse({
      status: 200,
      isJson: false,
      body: '<html><body>Sign in</body></html>',
      data: null,
    })).toBe('html');
  });
});

describe('assessGasLatency', () => {
  it('warns above 6s, fails above 12s', () => {
    expect(assessGasLatency(5000)).toBe('ok');
    expect(assessGasLatency(7000)).toBe('warn');
    expect(assessGasLatency(13000)).toBe('fail');
  });
});
