#!/usr/bin/env node
/**
 * GAS backend monitor — proactive + reactive alerts.
 *
 * Logic lives in src/site/utils/gasDeployLog.js (unit-tested).
 * Proactive e-mail: exactly when OAuth token expires in ~24h.
 *
 * Exit codes: 0 OK | 1 outage detected (e-mail due)
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  assessGasLatency,
  assessOAuthDeployStatus,
  classifyGasPingResponse,
  DEFAULT_OAUTH_TOKEN_LIFETIME_DAYS,
  parseDeployLog,
} from '../src/site/utils/gasDeployLog.js';
import { monitorExitCode, shouldSendMonitorEmail } from '../src/site/utils/monitorNotify.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const paymentJs = readFileSync(join(ROOT, 'src/site/data/payment.js'), 'utf8');
const defaultScriptUrl = paymentJs.match(/export const SCRIPT_URL\s*=\s*'([^']+)'/)?.[1] || '';

const SCRIPT_URL = process.env.SCRIPT_URL || defaultScriptUrl;
const WORKER_URL = (process.env.WORKER_URL || 'https://lernziel-deutsch.de').replace(/\/$/, '');
const DEPLOY_LOG_PATH = process.env.GAS_DEPLOY_LOG
  || join(ROOT, 'docs/ops/gas-deploy-log.json');

const LATENCY_WARN_MS = Number(process.env.GAS_LATENCY_WARN_MS || 6000);
const LATENCY_FAIL_MS = Number(process.env.GAS_LATENCY_FAIL_MS || 12000);
const TOKEN_LIFETIME = Number(process.env.GAS_OAUTH_TOKEN_LIFETIME_DAYS || DEFAULT_OAUTH_TOKEN_LIFETIME_DAYS);

const asJson = process.argv.includes('--json');

/** @type {'ok'|'warn'|'fail'} */
let level = 'ok';
/** @type {string[]} */
const messages = [];
let redeployEmailDue = false;

/** @type {Record<string, unknown>} */
const report = {
  checkedAt: new Date().toISOString(),
  level: 'ok',
  scriptUrl: SCRIPT_URL,
  workerUrl: WORKER_URL,
  checks: { redeployEmailDue: false },
  messages: [],
};

/**
 * @param {'ok'|'warn'|'fail'} next
 * @param {string} msg
 */
function note(next, msg) {
  messages.push(msg);
  if (next === 'fail') level = 'fail';
  else if (next === 'warn' && level !== 'fail') level = 'warn';
}

function readDeployLogFromFile() {
  try {
    const raw = JSON.parse(readFileSync(DEPLOY_LOG_PATH, 'utf8'));
    return parseDeployLog(raw, { defaultTokenLifetimeDays: TOKEN_LIFETIME });
  } catch {
    return parseDeployLog(null, { defaultTokenLifetimeDays: TOKEN_LIFETIME });
  }
}

function checkDeployAge() {
  const log = readDeployLogFromFile();
  report.checks.deployLog = log;

  const oauth = assessOAuthDeployStatus(log);
  redeployEmailDue = oauth.redeployEmailDue;
  report.checks.redeployEmailDue = oauth.redeployEmailDue;

  for (const msg of oauth.messages) {
    note(oauth.level === 'fail' ? 'fail' : oauth.level === 'warn' ? 'warn' : 'ok', msg);
  }
  if (oauth.level === 'fail') level = 'fail';
  else if (oauth.level === 'warn' && level !== 'fail') level = 'warn';
}

/**
 * @param {string} action
 * @param {Record<string, string>} [extra]
 */
async function fetchGas(action, extra = {}) {
  const qs = new URLSearchParams({ action, ...extra }).toString();
  const res = await fetch(`${SCRIPT_URL}?${qs}`, { redirect: 'follow' });
  const body = await res.text();
  let data = null;
  let isJson = false;
  try {
    data = JSON.parse(body);
    isJson = true;
  } catch {
    isJson = false;
  }
  return { status: res.status, body, isJson, data };
}

async function checkGasReachable() {
  if (!SCRIPT_URL) {
    note('fail', 'SCRIPT_URL not configured');
    report.checks.gas = { ok: false, error: 'no SCRIPT_URL' };
    return;
  }

  const res = await fetchGas('validateCode', { code: 'MONITOR-PING' });
  const kind = classifyGasPingResponse(res);

  report.checks.gas = {
    httpStatus: res.status,
    isJson: res.isJson,
    error: res.data?.error || null,
    kind,
  };

  if (kind === 'oauth403') {
    note('fail', 'GAS HTTP 403 — OAuth revoked. Redeploy Web App as lakizo.kosta@gmail.com');
    return;
  }
  if (kind === 'html') {
    note('fail', `GAS returned HTML instead of JSON (status ${res.status})`);
    return;
  }
  if (kind === 'old_script') {
    note('fail', 'OLD GAS script still live — redeploy apps-script/Code.gs from repo');
    return;
  }
  if (kind === 'unexpected') {
    note('fail', `Unexpected GAS response: ${res.body.slice(0, 100)}`);
    return;
  }

  report.checks.gas.ok = true;
}

async function checkWorkerHealth() {
  try {
    const started = Date.now();
    const res = await fetch(`${WORKER_URL}/api/health`, { redirect: 'follow' });
    const text = await res.text();
    const latencyMs = Date.now() - started;
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    report.checks.worker = {
      httpStatus: res.status,
      latencyMs,
      gasReachable: data?.gas?.reachable ?? null,
      gasLatencyMs: data?.latencyMs ?? null,
    };

    const gasLatency = Number(data?.latencyMs ?? latencyMs);

    if (!data || !res.ok || !data.ok) {
      note('fail', `Worker /api/health failed: ${data?.error || data?.gas?.error || res.status}`);
      return;
    }

    const latencyLevel = assessGasLatency(gasLatency, {
      warnMs: LATENCY_WARN_MS,
      failMs: LATENCY_FAIL_MS,
    });
    if (latencyLevel === 'fail') {
      note('fail', `GAS latency ${gasLatency}ms (>= ${LATENCY_FAIL_MS}ms)`);
    } else if (latencyLevel === 'warn') {
      note('warn', `GAS latency ${gasLatency}ms — cold start or sheet bloat`);
    }
  } catch (err) {
    note('fail', `Worker health unreachable: ${err?.message || err}`);
    report.checks.worker = { ok: false, error: String(err?.message || err) };
  }
}

async function main() {
  checkDeployAge();
  await checkGasReachable();
  await checkWorkerHealth();

  report.level = level;
  report.messages = messages;
  report.checks.redeployEmailDue = redeployEmailDue;
  report.checks.outageDetected = shouldSendMonitorEmail(report);

  if (asJson) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`\nGAS monitor — ${report.checkedAt}\n`);
    for (const msg of messages) {
      console.log(`• ${msg}`);
    }
    if (messages.length === 0) console.log('✅ All checks passed');
    if (redeployEmailDue) {
      console.log('\n⏰ OAuth redeploy due in ~24h (no e-mail — outage-only alerts)\n');
    }
    if (report.checks.outageDetected) {
      console.log('\n📧 Outage detected — e-mail will be sent\n');
    }
    console.log(`Level: ${level.toUpperCase()}\n`);
  }

  process.exit(monitorExitCode(report));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
