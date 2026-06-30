#!/usr/bin/env node
/**
 * P0 backend smoke test for the Apps Script Web App.
 *
 * Mimics the SPA: POST with text/plain JSON (no CORS preflight).
 * fetch() follows the 302 redirect to script.googleusercontent.com.
 *
 * Usage:
 *   node scripts/verify-backend.mjs
 *   SCRIPT_URL=https://.../exec node scripts/verify-backend.mjs
 *
 * Optional (Stripe webhook URL check — reads secret from env only):
 *   WEBHOOK_SECRET=your_secret node scripts/verify-backend.mjs --webhook
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const paymentJs = readFileSync(join(__dirname, '../src/data/payment.js'), 'utf8');
const defaultUrl = paymentJs.match(/export const SCRIPT_URL\s*=\s*'([^']+)'/)?.[1] || '';

const SCRIPT_URL = process.env.SCRIPT_URL || defaultUrl;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
const withWebhook = process.argv.includes('--webhook');

if (!SCRIPT_URL) {
  console.error('No SCRIPT_URL — set env or configure src/data/payment.js');
  process.exit(1);
}

const results = [];

function pass(label, detail = '') {
  results.push({ label, ok: true, detail });
  console.log(`✅ ${label}${detail ? ` — ${detail}` : ''}`);
}

function fail(label, detail = '') {
  results.push({ label, ok: false, detail });
  console.log(`❌ ${label}${detail ? ` — ${detail}` : ''}`);
}

function warn(label, detail = '') {
  results.push({ label, ok: null, detail });
  console.log(`⚠️  ${label}${detail ? ` — ${detail}` : ''}`);
}

async function getJson(params) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${SCRIPT_URL}?${qs}`);
  const text = await res.text();
  try {
    return { status: res.status, data: JSON.parse(text), raw: text };
  } catch {
    return { status: res.status, data: null, raw: text.slice(0, 200) };
  }
}

async function postJson(body) {
  const res = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
    redirect: 'follow',
  });
  const text = await res.text();
  try {
    return { status: res.status, data: JSON.parse(text), raw: text };
  } catch {
    return { status: res.status, data: null, raw: text.slice(0, 200) };
  }
}

console.log(`\nP0 Backend smoke test\nSCRIPT_URL: ${SCRIPT_URL}\n`);

// 1. GET validateCode — German error = new Code.gs from repo
const validate = await getJson({ action: 'validateCode', code: 'P0-SMOKE-TEST' });
if (validate.data?.error === 'Code nicht gefunden') {
  pass('GET validateCode', 'new script (German error message)');
} else if (validate.data?.error?.includes('не найден') || validate.data?.error?.includes('Код')) {
  fail('GET validateCode', 'OLD Blogger script still live — redeploy apps-script/Code.gs');
} else if (validate.data) {
  warn('GET validateCode', JSON.stringify(validate.data));
} else {
  fail('GET validateCode', `non-JSON: ${validate.raw}`);
}

// 2. GET unknown action
const unknown = await getJson({ action: 'p0_unknown' });
if (unknown.data?.error === 'Unknown action') {
  pass('GET unknown action');
} else {
  fail('GET unknown action', unknown.raw || JSON.stringify(unknown.data));
}

// 3. POST requestMagicLink
const magic = await postJson({
  requestMagicLink: true,
  email: 'p0-smoke+test@example.com',
  deviceId: 'p0-smoke-device',
});
if (magic.data?.ok === true) {
  pass('POST requestMagicLink', magic.data.message || 'ok');
} else {
  fail('POST requestMagicLink', magic.data?.error || magic.raw);
}

// 5. POST contactForm (sends real e-mail — use audit address)
const contact = await postJson({
  contactForm: true,
  name: 'P0 Smoke Test',
  email: 'audit@example.com',
  message: `Automated P0 smoke test ${new Date().toISOString()}`,
  page: 'https://lernziel-deutsch.de',
});
if (contact.data?.ok === true) {
  pass('POST contactForm', 'check inbox for [SprachCoach Kontakt]');
} else {
  fail('POST contactForm', contact.data?.error || contact.raw);
}

// 6. POST unknown
const postUnknown = await postJson({ p0Smoke: true });
if (postUnknown.data?.error === 'Unknown request') {
  pass('POST unknown body');
} else {
  fail('POST unknown body', postUnknown.raw || JSON.stringify(postUnknown.data));
}

// 7. Optional Stripe webhook probe
if (withWebhook) {
  if (!WEBHOOK_SECRET) {
    warn('Stripe webhook', 'Set WEBHOOK_SECRET env to test');
  } else {
    const bad = await fetch(
      `${SCRIPT_URL}?action=stripeWebhook&secret=WRONG`,
      { method: 'POST', body: '{}', redirect: 'follow' },
    ).then((r) => r.json());
    if (bad?.error === 'Forbidden') {
      pass('Stripe webhook rejects bad secret');
    } else {
      fail('Stripe webhook bad secret', JSON.stringify(bad));
    }

    const good = await fetch(
      `${SCRIPT_URL}?action=stripeWebhook&secret=${WEBHOOK_SECRET}`,
      { method: 'POST', body: '{}', redirect: 'follow' },
    ).then((r) => r.json());
    if (good?.error === 'Invalid JSON' || good?.error === 'Empty body' || good?.ignored) {
      pass('Stripe webhook accepts good secret');
    } else {
      warn('Stripe webhook good secret', JSON.stringify(good));
    }
  }
} else {
  warn('Stripe webhook', 'skipped — run with --webhook and WEBHOOK_SECRET=…');
}

const failed = results.filter((r) => r.ok === false).length;
console.log(`\nDone: ${results.filter((r) => r.ok === true).length} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
