#!/usr/bin/env node
/**
 * Sends redeploy alert e-mails when shouldSendMonitorEmail(report) is true.
 * Decision logic: src/utils/monitorNotify.js (unit-tested).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  isGasMonitorDown,
  shouldSendMonitorEmail,
} from '../src/utils/monitorNotify.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const reportPath = process.argv[2];
if (!reportPath) {
  console.error('Usage: node scripts/notify-monitor.mjs <report.json>');
  process.exit(1);
}

/** @type {{level:string, checkedAt:string, messages:string[], checks:object}} */
const report = JSON.parse(readFileSync(reportPath, 'utf8'));

if (!shouldSendMonitorEmail(report)) {
  console.log('No redeploy e-mail needed (OK or non-redeploy WARN)');
  process.exit(0);
}

const level = String(report.level || 'ok').toLowerCase();
const redeployEmailDue = report.checks?.redeployEmailDue === true;
const deployDate = String(report.checks?.deployLog?.lastDeployAt || 'unknown');

const paymentJs = readFileSync(join(ROOT, 'src/data/payment.js'), 'utf8');
const defaultScriptUrl = paymentJs.match(/export const SCRIPT_URL\s*=\s*'([^']+)'/)?.[1] || '';

const SCRIPT_URL = process.env.SCRIPT_URL || defaultScriptUrl;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
const NOTIFY_EMAIL_TO = process.env.NOTIFY_EMAIL_TO || 'lakizo.kosta@gmail.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_FROM = process.env.RESEND_FROM || 'Der SprachCoach Monitor <onboarding@resend.dev>';

const emoji = level === 'fail' ? '🚨' : '⏰';
const subject = redeployEmailDue && level !== 'fail'
  ? '[SprachCoach Monitor] OAuth läuft in ~24h ab — GAS redeploy'
  : `[SprachCoach Monitor] ${level.toUpperCase()} — GAS redeploy`;

const body = [
  `${emoji} Der SprachCoach — Backend Monitor`,
  '',
  redeployEmailDue && level !== 'fail'
    ? 'Proactive alert: OAuth token expires in approximately 24 hours.'
    : `Level: ${level.toUpperCase()}`,
  `Time:        ${report.checkedAt}`,
  `Deploy date: ${deployDate}`,
  '',
  ...(report.messages || []).map((m) => `• ${m}`),
  '',
  'Nächste Schritte:',
  '1. script.google.com (als lakizo.kosta@gmail.com)',
  '2. Code.gs + appsscript.json synchronisieren',
  '3. Deploy → Manage deployments → New version → Deploy',
  '4. docs/ops/gas-deploy-log.json → lastDeployAt aktualisieren',
  '',
  'Guide: docs/runbooks/gas-monitoring.md',
].join('\n');

writeFileSync(join(ROOT, 'monitor-email-body.txt'), body, 'utf8');

/** @type {string[]} */
const sentVia = [];

async function sendViaGas() {
  if (!SCRIPT_URL || !WEBHOOK_SECRET || isGasMonitorDown(report.checks?.gas)) {
    if (isGasMonitorDown(report.checks?.gas)) {
      console.log('Email via GAS: skipped (GAS returns 403/down)');
    }
    return false;
  }

  const qs = new URLSearchParams({
    action: 'monitorNotify',
    secret: WEBHOOK_SECRET,
    level: redeployEmailDue ? 'warn' : level,
    deployDate,
    message: body.slice(0, 4500),
  });

  try {
    const res = await fetch(`${SCRIPT_URL}?${qs.toString()}`, { redirect: 'follow' });
    const text = await res.text();
    let data = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }

    if (data?.ok) {
      if (data.skipped) {
        console.log(`Email via GAS: skipped (${data.reason || 'dedup'})`);
        sentVia.push('gas-dedup');
      } else {
        console.log(`Email via GAS: sent to ${data.sentTo || NOTIFY_EMAIL_TO}`);
        sentVia.push('gas');
      }
      return true;
    }

    console.error('Email via GAS failed:', data || text.slice(0, 200));
    return false;
  } catch (err) {
    console.error('Email via GAS error:', err?.message || err);
    return false;
  }
}

async function sendViaResend() {
  if (!RESEND_API_KEY) return false;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [NOTIFY_EMAIL_TO],
        subject,
        text: body,
      }),
    });

    if (!res.ok) {
      console.error('Email via Resend failed:', await res.text());
      return false;
    }

    console.log(`Email via Resend: sent to ${NOTIFY_EMAIL_TO}`);
    sentVia.push('resend');
    return true;
  } catch (err) {
    console.error('Email via Resend error:', err?.message || err);
    return false;
  }
}

await sendViaGas();
await sendViaResend();

const emailSent = sentVia.some((c) => c === 'gas' || c === 'gas-dedup' || c === 'resend');

if (process.env.GITHUB_OUTPUT) {
  const line = (k, v) => {
    writeFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`, { flag: 'a' });
  };
  line('email_sent', emailSent ? 'true' : 'false');
  line('channels', sentVia.join(',') || 'none');
}

if (!emailSent) {
  console.warn('No e-mail channel succeeded — configure WEBHOOK_SECRET or RESEND_API_KEY');
  process.exit(2);
}

process.exit(0);
