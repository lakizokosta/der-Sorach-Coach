import { describe, it, expect } from 'vitest';
import {
  shouldSendMonitorEmail,
  isGasMonitorDown,
  monitorExitCode,
} from '@/utils/monitorNotify.js';

describe('shouldSendMonitorEmail', () => {
  it('sends on fail level', () => {
    expect(shouldSendMonitorEmail({ level: 'fail' })).toBe(true);
  });

  it('sends on proactive redeployEmailDue even when level is warn', () => {
    expect(shouldSendMonitorEmail({ level: 'warn', checks: { redeployEmailDue: true } })).toBe(true);
  });

  it('does not send for latency-only warn', () => {
    expect(shouldSendMonitorEmail({ level: 'warn', checks: { redeployEmailDue: false } })).toBe(false);
  });

  it('does not send when all OK', () => {
    expect(shouldSendMonitorEmail({ level: 'ok' })).toBe(false);
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
  it('returns 1 on fail, 2 on proactive warn, 0 on ok', () => {
    expect(monitorExitCode('fail', false)).toBe(1);
    expect(monitorExitCode('warn', true)).toBe(2);
    expect(monitorExitCode('ok', false)).toBe(0);
    expect(monitorExitCode('warn', false)).toBe(0);
  });
});
