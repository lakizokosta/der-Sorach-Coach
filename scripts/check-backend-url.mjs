#!/usr/bin/env node
/**
 * Read-only check: is the Apps Script Web App URL reachable?
 * Run: node scripts/check-backend-url.mjs
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const paymentJs = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../src/site/data/payment.js'),
  'utf8',
);
const url = paymentJs.match(/export const SCRIPT_URL\s*=\s*'([^']+)'/)?.[1] || '';

if (!url) {
  console.error('SCRIPT_URL is empty in src/site/data/payment.js');
  process.exit(1);
}

console.log(`Checking: ${url}\n`);

const res = await fetch(`${url}?action=validateCode&code=PING`, { redirect: 'follow' });
const text = await res.text();

if (res.status === 403) {
  console.error('❌ HTTP 403 — Access Denied');
  console.error('   The Web App is not public. Redeploy on script.google.com:');
  console.error('   Deploy → New deployment → Web app');
  console.error('   Execute as: Me  |  Who has access: Anyone');
  console.error('   Then paste the new /exec URL into src/site/data/payment.js');
  process.exit(1);
}

let data;
try {
  data = JSON.parse(text);
} catch {
  console.error(`❌ HTTP ${res.status} — response is not JSON`);
  console.error(text.slice(0, 200));
  process.exit(1);
}

if (data.error === 'Code nicht gefunden' || data.ok === false) {
  console.log(`✅ Backend OK (HTTP ${res.status})`);
  console.log(`   Response: ${JSON.stringify(data)}`);
  process.exit(0);
}

console.log(`⚠️  Unexpected response (HTTP ${res.status}):`, data);
