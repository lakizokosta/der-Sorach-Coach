import { describe, it, expect } from 'vitest';
import {
  shouldSendMonitorEmail,
  isMonitorOutageDetected,
  isGasMonitorDown,
  monitorExitCode,
} from '@/utils/monitorNotify.js';

describe('isMonitorOutageDetected', () => {
  it('detects GAS OAuth 403', () => {
    expect(isMonitorOutageDetected({
      checks: { gas: { kind: 'oauth403', httpStatus: 403 } },
    })).toBe(true);
  });

  it('detects worker health failure', () => {
    expect(isMonitorOutageDetected({
      messages: ['Worker /api/health failed: timeout'],
      checks: { gas: { kind: 'ok', ok: true } },
    })).toBe(true);
  });

  it('detects worker reporting GAS unreachable', () => {
    expect(isMonitorOutageDetected({
      checks: { gas: { kind: 'ok', ok: true }, worker: { gasReachable: false } },
    })).toBe(true);
  });

  it('ignores stale deploy log OAuth expiry when GAS is up', () => {
    expect(isMonitorOutageDetected({
      level: 'fail',
      messages: ['OAuth token expired (deploy 35d ago, lifetime 7d, mode=testing)'],
      checks: {
        redeployEmailDue: false,
        gas: { kind: 'ok', ok: true, httpStatus: 200 },
        worker: { gasReachable: true },
      },
    })).toBe(false);
  });

  it('ignores proactive redeploy reminder', () => {
    expect(isMonitorOutageDetected({
      level: 'warn',
      messages: ['OAuth token expires in ~24 hours (deploy day 6/7, mode=testing)'],
      checks: { redeployEmailDue: true, gas: { kind: 'ok', ok: true } },
    })).toBe(false);
  });

  it('ignores latency-only warn', () => {
    expect(isMonitorOutageDetected({
      level: 'warn',
      messages: ['GAS latency 9000ms — cold start or sheet bloat'],
      checks: { gas: { kind: 'ok', ok: true } },
    })).toBe(false);
  });
});

describe('shouldSendMonitorEmail', () => {
  it('sends only on detected outage', () => {
    expect(shouldSendMonitorEmail({
      checks: { gas: { kind: 'html' } },
    })).toBe(true);
  });

  it('does not send for log-only fail', () => {
    expect(shouldSendMonitorEmail({
      level: 'fail',
      messages: ['OAuth token expired (deploy 35d ago, lifetime 7d, mode=testing)'],
      checks: { gas: { kind: 'ok', ok: true } },
    })).toBe(false);
  });

  it('does not send when all OK', () => {
    expect(shouldSendMonitorEmail({ level: 'ok', checks: { gas: { kind: 'ok', ok: true } } })).toBe(false);
  });
});

describe('isGasMonitorDown', () => {
  it('true on HTTP 403', () => {
    expect(isGasMonitorDown({ httpStatus: 403 })).toBe(true);
  });

  it('true when ok=false and status >= 400', () => {
    expect(isGasMonitorDown({ ok: false, httpStatus: 500 })).toBe(true);
  });

  it('false when GAS responds OK', () => {
    expect(isGasMonitorDown({ ok: true, httpStatus: 200 })).toBe(false);
  });
});

describe('monitorExitCode', () => {
  it('returns 1 only when outage detected', () => {
    expect(monitorExitCode({
      checks: { gas: { kind: 'oauth403' } },
    })).toBe(1);
    expect(monitorExitCode({
      level: 'fail',
      messages: ['OAuth token expired (deploy 35d ago, lifetime 7d, mode=testing)'],
      checks: { gas: { kind: 'ok', ok: true } },
    })).toBe(0);
    expect(monitorExitCode({ level: 'ok', checks: { gas: { kind: 'ok', ok: true } } })).toBe(0);
  });
});
