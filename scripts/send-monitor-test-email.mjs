#!/usr/bin/env node
/**
 * Sends one test monitor e-mail via live GAS monitorNotify.
 * Uses a unique deployDate so dedup does not block the test.
 *
 * Usage:
 *   WEBHOOK_SECRET=… npm run ops:monitor:test-email
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
if (!WEBHOOK_SECRET) {
  console.error('Set WEBHOOK_SECRET (same value as in apps-script/Code.gs)');
  process.exit(1);
}

const paymentJs = readFileSync(join(ROOT, 'src/site/data/payment.js'), 'utf8');
const SCRIPT_URL = process.env.SCRIPT_URL
  || paymentJs.match(/export const SCRIPT_URL\s*=\s*'([^']+)'/)?.[1]
  || '';

if (!SCRIPT_URL) {
  console.error('SCRIPT_URL not found in src/site/data/payment.js');
  process.exit(1);
}

const deployDate = `test-${new Date().toISOString().slice(0, 19)}`;
const message = [
  '✅ Test — Der SprachCoach Monitor',
  '',
  'This is a setup test e-mail. If you receive it, monitorNotify is live on GAS.',
  '',
  'Proactive reminders fire ~24h before OAuth token expiry (Testing mode ≈ 7 days).',
  'See docs/runbooks/gas-monitoring.md',
].join('\n');

const qs = new URLSearchParams({
  action: 'monitorNotify',
  secret: WEBHOOK_SECRET,
  level: 'warn',
  deployDate,
  message,
});

console.log(`Sending test e-mail via GAS (${SCRIPT_URL.slice(0, 52)}…)…`);

const res = await fetch(`${SCRIPT_URL}?${qs.toString()}`, { redirect: 'follow' });
const text = await res.text();

let data = null;
try {
  data = JSON.parse(text);
} catch {
  data = null;
}

if (data?.ok && !data.skipped) {
  console.log(`✓ Sent to ${data.sentTo || 'SUPPORT_EMAIL in Code.gs'}`);
  process.exit(0);
}

if (data?.ok && data.skipped) {
  console.error('✘ Dedup skipped (unexpected for test deployDate):', data.reason);
  process.exit(1);
}

if (data?.error === 'Forbidden') {
  console.error('✘ Forbidden — WEBHOOK_SECRET does not match Code.gs, or monitorNotify not deployed');
  process.exit(1);
}

if (data?.error === 'Unknown action' || String(text).includes('Unknown action')) {
  console.error('✘ monitorNotify not found on live GAS — redeploy Code.gs first');
  process.exit(1);
}

console.error('✘ Unexpected response:', data || text.slice(0, 300));
process.exit(1);
