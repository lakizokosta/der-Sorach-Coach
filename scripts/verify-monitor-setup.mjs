#!/usr/bin/env node
/**
 * Pre-flight check before enabling production monitor e-mails.
 * Does not call external APIs or print secrets.
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDeployLog, assessOAuthDeployStatus } from '../src/site/utils/gasDeployLog.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let errors = 0;
let warnings = 0;

function fail(msg) {
  errors += 1;
  console.error(`✘ ${msg}`);
}

function warn(msg) {
  warnings += 1;
  console.warn(`⚠ ${msg}`);
}

function ok(msg) {
  console.log(`✓ ${msg}`);
}

/** @param {string} rel */
function mustExist(rel, label) {
  const path = join(ROOT, rel);
  if (!existsSync(path)) {
    fail(`${label || rel} missing`);
    return false;
  }
  ok(label || rel);
  return true;
}

console.log('\nMonitor e-mail — production pre-flight\n');

mustExist('scripts/monitor-gas-backend.mjs', 'Monitor script');
mustExist('scripts/notify-monitor.mjs', 'Notify script');
mustExist('src/site/utils/gasDeployLog.js', 'gasDeployLog utils');
mustExist('src/site/utils/monitorNotify.js', 'monitorNotify utils');
mustExist('.github/workflows/backend-health.yml', 'Hourly health workflow');
mustExist('.github/workflows/gas-redeploy-email.yml', 'Daily redeploy reminder workflow');
mustExist('docs/ops/gas-deploy-log.json', 'Deploy log');

const codeGs = readFileSync(join(ROOT, 'apps-script/Code.gs'), 'utf8');
if (!codeGs.includes("case 'monitorNotify'")) {
  fail('apps-script/Code.gs — monitorNotify action not found (redeploy GAS required)');
} else {
  ok('Code.gs contains monitorNotify handler');
}

if (!codeGs.includes('handleMonitorNotify_')) {
  fail('Code.gs — handleMonitorNotify_ missing');
} else {
  ok('Code.gs contains handleMonitorNotify_');
}

const paymentJs = readFileSync(join(ROOT, 'src/site/data/payment.js'), 'utf8');
const scriptUrl = paymentJs.match(/export const SCRIPT_URL\s*=\s*'([^']+)'/)?.[1] || '';
if (!scriptUrl || !scriptUrl.includes('script.google.com')) {
  fail('src/site/data/payment.js — SCRIPT_URL not configured');
} else {
  ok(`SCRIPT_URL configured (${scriptUrl.slice(0, 48)}…)`);
}

try {
  const deployRaw = JSON.parse(readFileSync(join(ROOT, 'docs/ops/gas-deploy-log.json'), 'utf8'));
  const log = parseDeployLog(deployRaw);
  const oauth = assessOAuthDeployStatus(log);

  if (!log.lastDeployAt) {
    warn('gas-deploy-log.json — lastDeployAt empty (proactive e-mail timing unknown)');
  } else {
    ok(`lastDeployAt = ${log.lastDeployAt} (day ${log.daysSinceDeploy}, ${log.daysUntilExpiry}d until expiry)`);
  }

  if (log.oauthMode === 'production' && !log.oauthTokenLifetimeDays) {
    ok('oauthMode=production — proactive redeploy e-mails disabled (expected)');
  } else if (oauth.redeployEmailDue) {
    warn('Proactive redeploy e-mail would fire on next scheduled run (~24h before expiry)');
  }
} catch (err) {
  fail(`gas-deploy-log.json invalid: ${err.message}`);
}

if (!process.env.WEBHOOK_SECRET) {
  warn('WEBHOOK_SECRET not set in env — required for GitHub Actions + test e-mail');
} else {
  ok('WEBHOOK_SECRET set in env (for local test send)');
}

console.log('\n--- Production steps (manual) ---');
console.log('1. Merge workflows to main (cron runs only from default branch)');
console.log('2. script.google.com → paste Code.gs → New version → Deploy');
console.log('3. GitHub → Settings → Secrets → WEBHOOK_SECRET (= Code.gs WEBHOOK_SECRET)');
console.log('4. Optional: NOTIFY_EMAIL_TO, RESEND_API_KEY (fallback when GAS is 403)');
console.log('5. Actions → "GAS redeploy email reminder" → Run workflow (smoke test)');
console.log('6. npm run ops:monitor:test-email  (after step 2–3)\n');

if (errors > 0) {
  console.error(`\n✘ ${errors} error(s), ${warnings} warning(s) — fix before production\n`);
  process.exit(1);
}

console.log(`\n✓ Ready (${warnings} warning(s)). Complete manual steps above.\n`);
