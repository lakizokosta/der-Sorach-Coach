/**
 * @fileoverview Der SprachCoach — backend (Google Apps Script).
 *
 * Single-file backend that:
 *
 *   1. Accepts Stripe and PayPal payment webhooks → generates a
 *      one-off activation code → saves it to the `Codes` sheet →
 *      e-mails the buyer the code + a one-click activation link.
 *   2. Validates activation codes posted by the SPA, returning a
 *      2-hour session token bound to the buyer's device.
 *   3. Issues magic-link login e-mails (7-day passwordless sessions).
 *   4. Issues one-shot 1-day trial codes.
 *   5. Relays the contact form to the support inbox.
 *
 * Deploy as a Web App (Execute as: Me, Access: Anyone) and put the
 * resulting `/exec` URL into:
 *
 *   - `src/data/payment.js` → `SCRIPT_URL`
 *   - Stripe Dashboard → Developers → Webhooks → Endpoint URL
 *     (append `?secret=…&action=stripeWebhook`)
 *   - PayPal account → Profile → My selling tools → IPN
 *     (append `?secret=…&action=paypalIpn`)
 *
 * See `apps-script/README.md` for the step-by-step setup guide.
 */

/* ────────────────────────────────────────────────────────────────
   Configuration — edit these to match your deployment.
   ──────────────────────────────────────────────────────────────── */

/**
 * Spreadsheet ID — migrated from the live `Код.gs` (v7.8) constant
 * `SHEET_ID`. Verify against the Sheets URL if anything breaks.
 */
const SHEET_ID = '1vqKJV1jV9Rq_Owb5gDA4LlJ2GgcQvYkurVnBUfUp8WU';

/**
 * Public URL of the deployed SPA — migrated from live `BASE_URL`.
 * E-mail links use `/?activate=CODE` (query before any hash).
 */
const APP_BASE_URL = 'https://lernziel-deutsch.de';

/**
 * Inline logo bytes for HTML e-mails (auto-generated from public/logo-email.png).
 * Regenerate: node scripts/embed-logo.mjs
 */
const LOGO_PNG_BASE64 = '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';

/** "From" address shown in outgoing e-mails (must be the script owner). */
const FROM_NAME = 'Der SprachCoach';

/** Inbox for contact-form submissions (confirm matches your live script). */
const SUPPORT_EMAIL = 'lakizo.kosta@gmail.com';

/**
 * Shared secret for Stripe / PayPal webhook URLs (`?secret=…`).
 * Migrated from the live `TOKEN_SECRET` — keep in sync with Stripe
 * Dashboard webhook URL.
 */
const WEBHOOK_SECRET = 'LZD_S3cr3t_T0k3n_K3y_2024_xQ9mR7';

/**
 * PayPal primary e-mail for IPN receiver check.
 * TODO: replace with the exact address from your PayPal account if IPN
 * verification fails (paypal.me handle is `lehrermann`).
 */
const PAYPAL_MERCHANT_EMAIL = 'lehrermann@example.com';

/** Whether IPN verification calls the live PayPal endpoint or sandbox. */
const PAYPAL_USE_SANDBOX = false;

/**
 * Stripe amount (cents) → plan map. MUST mirror `STRIPE_AMOUNT_MAP`
 * in `src/data/payment.js`. When a webhook arrives we look up the
 * paid amount and generate a code of the matching plan.
 */
const STRIPE_AMOUNT_MAP = {
  499:  { months: 0,  plan: 'basis',    label: 'Zeitlimit aufheben'        },
  1900: { months: 1,  plan: '1month',   label: '1 Monat Premium'           },
  4900: { months: 3,  plan: '3months',  label: '3 Monate Premium'          },
  9900: { months: 12, plan: '12months', label: '12 Monate Premium'         },
  9000: { months: 12, plan: '12months', label: '12 Monate Premium'         },
};

/**
 * TEMPORARY trial QA flag — set to `false` before production.
 *
 * When `true`, addresses whose local part contains `+test`
 * (e.g. `you+test@gmail.com`) may request unlimited trial codes:
 * the Trial-sheet deduplication (one per e-mail / device) is skipped.
 */
const TRIAL_TEST_MODE = true;

/** Magic-link rate limit per e-mail address (sliding window). */
const MAGIC_LINK_RATE = { count: 3, windowMs: 10 * 60 * 1000 };

/** Session lifetime once a code is validated. */
const SESSION_LIFETIME_MS = 2 * 60 * 60 * 1000;            // 2 h
const MAGIC_SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000; // 7 d
const MAGIC_TOKEN_LIFETIME_MS = 30 * 60 * 1000;            // 30 min

/* ────────────────────────────────────────────────────────────────
   HTTP entry points.
   ──────────────────────────────────────────────────────────────── */

/**
 * GET handler — used by the SPA for code / token validation and as
 * the redirect URL for Stripe success page.
 *
 * @param {!Object} e  Apps Script event.
 * @return {!ContentService.TextOutput} JSON response.
 */
function doGet(e) {
  const action = (e.parameter && e.parameter.action) || '';
  try {
    switch (action) {
      case 'validateCode':       return json(validateCode(e.parameter));
      case 'validateMagicToken': return json(validateMagicToken(e.parameter));
      default:                   return json({ ok: false, error: 'Unknown action' });
    }
  } catch (err) {
    log('doGet', String(err && err.stack || err));
    return json(serverError_(err));
  }
}

/**
 * POST handler — receives the SPA's JSON requests and the Stripe /
 * PayPal webhooks. The shape of the body distinguishes between them.
 *
 * @param {!Object} e  Apps Script event.
 * @return {!ContentService.TextOutput} JSON response.
 */
function doPost(e) {
  const action = (e.parameter && e.parameter.action) || '';
  const raw = (e.postData && e.postData.contents) || '';

  try {
    // Webhook dispatch (URL-based identification).
    if (action === 'stripeWebhook') {
      if (!checkWebhookSecret_(e)) return json({ ok: false, error: 'Forbidden' });
      return json(handleStripeWebhook_(raw));
    }
    if (action === 'paypalIpn') {
      if (!checkWebhookSecret_(e)) return json({ ok: false, error: 'Forbidden' });
      return json(handlePaypalIpn_(raw));
    }

    // SPA → backend JSON body.
    const body = raw ? JSON.parse(raw) : {};
    if (body.requestMagicLink) return json(requestMagicLink(body));
    if (body.requestTrial)     return json(requestTrial(body));
    if (body.contactForm)      return json(sendContactForm(body));

    return json({ ok: false, error: 'Unknown request' });
  } catch (err) {
    log('doPost', String(err && err.stack || err));
    return json(serverError_(err));
  }
}

/* ────────────────────────────────────────────────────────────────
   Stripe webhook → generate code → send activation e-mail.
   ──────────────────────────────────────────────────────────────── */

/**
 * Processes a `checkout.session.completed` Stripe webhook event.
 *
 * @param {string} rawBody  JSON body of the webhook.
 * @return {!Object}        `{ok, code?, plan?, error?}`.
 */
function handleStripeWebhook_(rawBody) {
  if (!rawBody) return { ok: false, error: 'Empty body' };

  let event;
  try { event = JSON.parse(rawBody); }
  catch (err) { return { ok: false, error: 'Invalid JSON' }; }

  if (event.type !== 'checkout.session.completed') {
    return { ok: true, ignored: event.type };
  }

  const session = (event.data && event.data.object) || {};
  const email = ((session.customer_details && session.customer_details.email)
    || session.customer_email || '').toLowerCase().trim();
  const amount = Number(session.amount_total || 0);
  const planInfo = STRIPE_AMOUNT_MAP[amount];

  if (!email)    return { ok: false, error: 'No customer e-mail' };
  if (!planInfo) return { ok: false, error: `Unknown amount: ${amount}` };

  // Idempotency: skip if we already processed this Stripe event.
  if (eventAlreadyProcessed_(event.id)) {
    return { ok: true, duplicate: event.id };
  }

  const code = generateActivationCode_(planInfo.plan);
  saveActivationCode_(code, email, planInfo, 'stripe', event.id);
  sendActivationEmail_(email, code, planInfo);

  return { ok: true, code, plan: planInfo.plan, email };
}

/* ────────────────────────────────────────────────────────────────
   PayPal IPN → generate code → send activation e-mail.
   ──────────────────────────────────────────────────────────────── */

/**
 * Processes a PayPal Instant Payment Notification.
 *
 * @param {string} rawBody  url-encoded body posted by PayPal.
 * @return {!Object}
 */
function handlePaypalIpn_(rawBody) {
  if (!rawBody) return { ok: false, error: 'Empty IPN body' };
  if (!verifyPaypalIpn_(rawBody)) return { ok: false, error: 'IPN not verified' };

  const params = parseFormBody_(rawBody);
  if (params.payment_status !== 'Completed') {
    return { ok: true, ignored: params.payment_status };
  }
  if ((params.receiver_email || '').toLowerCase() !== PAYPAL_MERCHANT_EMAIL.toLowerCase()) {
    return { ok: false, error: 'Wrong receiver' };
  }

  const email = (params.payer_email || '').toLowerCase().trim();
  const cents = Math.round(parseFloat(params.mc_gross || '0') * 100);
  const planInfo = STRIPE_AMOUNT_MAP[cents];
  if (!email)    return { ok: false, error: 'No buyer e-mail' };
  if (!planInfo) return { ok: false, error: `Unknown amount: ${cents}` };

  if (eventAlreadyProcessed_(params.txn_id)) {
    return { ok: true, duplicate: params.txn_id };
  }

  const code = generateActivationCode_(planInfo.plan);
  saveActivationCode_(code, email, planInfo, 'paypal', params.txn_id);
  sendActivationEmail_(email, code, planInfo);

  return { ok: true, code, plan: planInfo.plan, email };
}

/**
 * Verifies a PayPal IPN by re-posting it to PayPal as required by
 * the spec. Returns true iff PayPal answers with `VERIFIED`.
 *
 * @param {string} rawBody
 * @return {boolean}
 */
function verifyPaypalIpn_(rawBody) {
  const url = PAYPAL_USE_SANDBOX
    ? 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr'
    : 'https://ipnpb.paypal.com/cgi-bin/webscr';
  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    payload: 'cmd=_notify-validate&' + rawBody,
    muteHttpExceptions: true,
  });
  return res.getContentText().trim() === 'VERIFIED';
}

/* ────────────────────────────────────────────────────────────────
   Activation code lifecycle.
   ──────────────────────────────────────────────────────────────── */

/**
 * Generates a unique, human-readable activation code such as
 * `PREMIUM-7K4A-9XQ2-MN5P`.
 *
 * @param {string} plan  'basis' or one of the Premium plan keys.
 * @return {string}
 */
function generateActivationCode_(plan) {
  const prefix = plan === 'basis' ? 'BASIS' : 'PREMIUM';
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const group = () => Array.from(
    { length: 4 },
    () => alphabet[Math.floor(Math.random() * alphabet.length)],
  ).join('');
  return `${prefix}-${group()}-${group()}-${group()}`;
}

/**
 * Writes a freshly issued code into the `Codes` sheet.
 *
 * @param {string} code
 * @param {string} email
 * @param {!Object} planInfo  Entry from STRIPE_AMOUNT_MAP.
 * @param {('stripe'|'paypal'|'manual'|'trial')} source
 * @param {string} transactionId
 */
function saveActivationCode_(code, email, planInfo, source, transactionId) {
  const sheet = sheet_('Codes', [
    'code', 'email', 'plan', 'months', 'createdAt',
    'usedAt', 'usedByDeviceId', 'source', 'txId',
  ]);
  sheet.appendRow([
    code,
    email,
    planInfo.plan,
    planInfo.months,
    new Date(),
    '',
    '',
    source,
    transactionId || '',
  ]);
}

/**
 * Server-side validation of an activation code submitted by the SPA.
 *
 * @param {!Object} p  Query parameters: code, email, deviceId.
 * @return {!Object}
 */
function validateCode(p) {
  const code = String(p.code || '').toUpperCase().trim();
  const email = String(p.email || '').toLowerCase().trim();
  const deviceId = String(p.deviceId || '').trim();
  if (!code) return { ok: false, error: 'Kein Code übermittelt' };

  const sheet = sheet_('Codes');
  const data = sheet.getDataRange().getValues();
  for (let r = 1; r < data.length; r++) {
    const row = data[r];
    if (String(row[0]).toUpperCase().trim() !== code) continue;

    const usedAt = row[5];
    const usedBy = String(row[6] || '').trim();

    if (usedAt && usedBy && deviceId && usedBy !== deviceId) {
      return { ok: false, error: 'Code wurde auf einem anderen Gerät verwendet.' };
    }
    if (!usedAt) {
      sheet.getRange(r + 1, 6).setValue(new Date());
      sheet.getRange(r + 1, 7).setValue(deviceId);
    }

    const months = Number(row[3]) || 0;
    const expires = months > 0
      ? new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000)
      : null;
    return {
      ok: true,
      type: row[2],
      months,
      expires: expires ? expires.toISOString() : null,
      sessionToken: issueSessionToken_(code, deviceId),
      sessionExpires: new Date(Date.now() + SESSION_LIFETIME_MS).toISOString(),
    };
  }
  return { ok: false, error: 'Code nicht gefunden' };
}

/**
 * Lazy session token issuance — stored in a sheet so we can revoke
 * later. Returns the opaque token.
 *
 * @param {string} code
 * @param {string} deviceId
 * @return {string}
 */
function issueSessionToken_(code, deviceId) {
  const token = Utilities.getUuid().replace(/-/g, '');
  const sheet = sheet_('Sessions', ['token', 'code', 'deviceId', 'createdAt', 'expiresAt']);
  sheet.appendRow([
    token,
    code,
    deviceId,
    new Date(),
    new Date(Date.now() + SESSION_LIFETIME_MS),
  ]);
  return token;
}

/* ────────────────────────────────────────────────────────────────
   Magic-link login (7-day session via e-mailed token).
   ──────────────────────────────────────────────────────────────── */

/**
 * Generates a one-shot magic-link token, stores it, and e-mails the
 * resulting URL to the user.
 *
 * @param {!Object} body  {email, deviceId}.
 * @return {!Object}
 */
function requestMagicLink(body) {
  const email = String(body.email || '').toLowerCase().trim();
  if (!isValidEmail_(email)) return { ok: false, error: 'Ungültige E-Mail' };
  if (!rateLimitOk_(email))  return { ok: false, error: 'Zu viele Anfragen. Bitte später versuchen.' };

  const token = Utilities.getUuid().replace(/-/g, '');
  const sheet = sheet_('Magic', ['token', 'email', 'createdAt', 'expiresAt', 'usedAt']);
  sheet.appendRow([
    token,
    email,
    new Date(),
    new Date(Date.now() + MAGIC_TOKEN_LIFETIME_MS),
    '',
  ]);
  sendMagicLinkEmail_(email, token);
  return { ok: true, message: 'E-Mail mit Login-Link versendet.' };
}

/**
 * Consumes a magic-link token. Returns the resolved e-mail + session.
 *
 * @param {!Object} p  Query parameters: token, deviceId.
 * @return {!Object}
 */
function validateMagicToken(p) {
  const token = String(p.token || '').trim();
  const deviceId = String(p.deviceId || '').trim();
  if (!token) return { ok: false, error: 'Kein Token' };

  const sheet = sheet_('Magic');
  const data = sheet.getDataRange().getValues();
  for (let r = 1; r < data.length; r++) {
    const row = data[r];
    if (String(row[0]).trim() !== token) continue;

    const usedAt = row[4];
    const expiresAt = row[3];
    if (usedAt) return { ok: false, error: 'Link bereits verwendet' };
    if (expiresAt && new Date() > new Date(expiresAt)) {
      return { ok: false, error: 'Link abgelaufen' };
    }

    sheet.getRange(r + 1, 5).setValue(new Date());
    const email = row[1];
    return {
      ok: true,
      email,
      sessionToken: issueMagicSessionToken_(email, deviceId),
      sessionExpires: new Date(Date.now() + MAGIC_SESSION_LIFETIME_MS).toISOString(),
      isPremium: hasActivePremium_(email),
    };
  }
  return { ok: false, error: 'Link ungültig' };
}

/**
 * Issues a 7-day session token for a magic-link login.
 *
 * @param {string} email
 * @param {string} deviceId
 * @return {string}
 */
function issueMagicSessionToken_(email, deviceId) {
  const token = Utilities.getUuid().replace(/-/g, '');
  const sheet = sheet_('MagicSessions', ['token', 'email', 'deviceId', 'createdAt', 'expiresAt']);
  sheet.appendRow([
    token,
    email,
    deviceId,
    new Date(),
    new Date(Date.now() + MAGIC_SESSION_LIFETIME_MS),
  ]);
  return token;
}

/* ────────────────────────────────────────────────────────────────
   Trial codes (1 day, one per buyer).
   ──────────────────────────────────────────────────────────────── */

/**
 * Returns true when `TRIAL_TEST_MODE` is on and the address is a QA
 * inbox (`+test` in the local part, e.g. `user+test@gmail.com`).
 *
 * @param {string} email  Normalised lower-case e-mail.
 * @return {boolean}
 */
function isTrialTestBypassEmail_(email) {
  if (!TRIAL_TEST_MODE) return false;
  return String(email || '').toLowerCase().includes('+test');
}

/**
 * Issues one 1-day trial code per (e-mail, device) pair.
 *
 * QA bypass: when `TRIAL_TEST_MODE` is true and the e-mail contains
 * `+test`, deduplication is skipped so the same device can be tested
 * repeatedly (each request still creates a fresh code + e-mail).
 *
 * @param {!Object} body  {email, deviceId}.
 * @return {!Object}
 */
function requestTrial(body) {
  const email = String(body.email || '').toLowerCase().trim();
  const deviceId = String(body.deviceId || '').trim();
  if (!isValidEmail_(email)) return { ok: false, error: 'Ungültige E-Mail' };

  const testBypass = isTrialTestBypassEmail_(email);

  if (!testBypass) {
    const trialSheet = sheet_('Trial', ['email', 'deviceId', 'code', 'issuedAt']);
    const data = trialSheet.getDataRange().getValues();
    for (let r = 1; r < data.length; r++) {
      if (String(data[r][0]).toLowerCase() === email
          || String(data[r][1]) === deviceId) {
        return { ok: false, error: 'Du hast bereits einen Trial-Code erhalten.' };
      }
    }
  }

  const planInfo = { plan: 'trial', months: 0, label: '1 Tag Trial' };
  const code = `TRIAL-${Utilities.getUuid().split('-')[0].toUpperCase()}`;
  saveActivationCode_(code, email, planInfo, 'trial', '');
  if (!testBypass) {
    const trialSheet = sheet_('Trial', ['email', 'deviceId', 'code', 'issuedAt']);
    trialSheet.appendRow([email, deviceId, code, new Date()]);
  }
  sendTrialCodeEmail_(email, code);
  return { ok: true, testMode: testBypass };
}

/* ────────────────────────────────────────────────────────────────
   Contact form relay.
   ──────────────────────────────────────────────────────────────── */

/**
 * Forwards a contact-form submission to SUPPORT_EMAIL.
 *
 * @param {!Object} body
 * @return {!Object}
 */
function sendContactForm(body) {
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();
  if (!name || !message) return { ok: false, error: 'Name und Nachricht sind erforderlich.' };

  MailApp.sendEmail({
    to: SUPPORT_EMAIL,
    replyTo: email || SUPPORT_EMAIL,
    subject: `[SprachCoach Kontakt] ${name}${body.isPremium ? ' [Premium]' : ''}`,
    body:
      `Von: ${name} <${email}>\n` +
      `Premium: ${body.isPremium ? 'Ja' : 'Nein'}\n` +
      `Seite:   ${body.page || '-'}\n\n` +
      `${message}`,
  });
  return { ok: true };
}

/* ────────────────────────────────────────────────────────────────
   E-mail templates.
   ──────────────────────────────────────────────────────────────── */

/**
 * Builds a branded HTML e-mail shell shared by trial, activation, and
 * magic-link messages. Uses table layout for broad client support.
 *
 * @param {!Object} opts
 * @param {string} opts.headline     Main H1 text.
 * @param {string} opts.introHtml    One or more HTML paragraphs.
 * @param {string} [opts.codeLabel]  Label above the monospace code.
 * @param {string} [opts.code]       Activation / trial code.
 * @param {string} [opts.ctaLabel]   Button label.
 * @param {string} [opts.ctaLink]    Button href.
 * @param {string} [opts.footerNote] Small print below the card.
 * @param {boolean} [opts.showManualHint] Show “enter code manually” hint.
 * @return {string} Complete HTML body.
 */
function buildEmailHtml_(opts) {
  const headline = escapeHtml_(opts.headline || '');
  const introHtml = opts.introHtml || '';
  const codeLabel = escapeHtml_(opts.codeLabel || '');
  const code = escapeHtml_(opts.code || '');
  const ctaLabel = escapeHtml_(opts.ctaLabel || '');
  const ctaLink = opts.ctaLink || '';
  const footerNote = escapeHtml_(opts.footerNote || '');
  const showManualHint = opts.showManualHint !== undefined
    ? opts.showManualHint
    : Boolean(opts.code);
  const appUrl = escapeHtml_(APP_BASE_URL);

  const codeBlock = (code && codeLabel) ? `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
            <tr>
              <td style="background:#fffef5;border:2px dashed #AB4DBB;border-radius:16px;padding:24px 20px;text-align:center;">
                <div style="font-size:11px;color:#7b2d8b;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;font-weight:700;">
                  ${codeLabel}
                </div>
                <div style="font-family:'Courier New',Consolas,monospace;font-size:26px;font-weight:900;letter-spacing:3px;color:#AB4DBB;line-height:1.2;">
                  ${code}
                </div>
              </td>
            </tr>
          </table>` : '';

  const ctaBlock = (ctaLabel && ctaLink) ? `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">
            <tr>
              <td align="center">
                <a href="${ctaLink}"
                   style="background:linear-gradient(135deg,#AB4DBB 0%,#8f3ea3 100%);color:#ffffff;text-decoration:none;padding:16px 36px;border-radius:999px;font-weight:900;font-size:16px;display:inline-block;box-shadow:0 8px 20px rgba(171,77,187,0.35);">
                  ${ctaLabel}
                </a>
              </td>
            </tr>
          </table>
          <p style="font-size:13px;color:#666;line-height:1.6;margin:0 0 8px;text-align:center;">
            Funktioniert der Button nicht? Kopiere diese Adresse in deinen Browser:
          </p>
          <p style="font-size:12px;color:#888;word-break:break-all;margin:0 0 20px;text-align:center;line-height:1.5;">
            <a href="${ctaLink}" style="color:#AB4DBB;">${escapeHtml_(ctaLink)}</a>
          </p>` : '';

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f6cf;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6cf;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#f5f6cf;border-radius:20px;overflow:hidden;">
          <tr>
            <td style="background:#f5f6cf;padding:28px 24px 16px;text-align:center;">
              <a href="${appUrl}" style="text-decoration:none;">
                <img src="cid:logo" width="88" height="88" alt="Der SprachCoach" style="display:block;margin:0 auto 14px;border:0;border-radius:50%;">
              </a>
              <div style="color:#AB4DBB;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">
                Der SprachCoach
              </div>
              <div style="font-size:12px;margin-top:6px;">
                <a href="${appUrl}" style="color:#AB4DBB;font-weight:700;text-decoration:underline;">lernziel-deutsch.de</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 12px;color:#1a1a1a;background:#f5f6cf;text-align:center;">
              <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;color:#AB4DBB;font-weight:900;text-align:center;">
                ${headline}
              </h1>
              ${introHtml}
              ${codeBlock}
              ${ctaBlock}
              ${showManualHint ? `
              <p style="font-size:13px;color:#555;line-height:1.6;margin:0 0 6px;">
                Oder öffne die App und gib den Code manuell ein:
              </p>
              <p style="font-size:13px;margin:0 0 8px;">
                <a href="${appUrl}" style="color:#AB4DBB;font-weight:700;text-decoration:underline;">${appUrl}</a>
              </p>` : `
              <p style="font-size:13px;margin:0 0 8px;text-align:center;">
                <a href="${appUrl}" style="color:#AB4DBB;font-weight:700;text-decoration:underline;">${appUrl}</a>
              </p>`}
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;background:#f5f6cf;">
              <hr style="border:none;border-top:1px solid #d8d4a0;margin:16px 0 14px;">
              <p style="font-size:11px;color:#777;text-align:center;margin:0;line-height:1.5;">
                ${footerNote || 'Bei Fragen antworte einfach auf diese E-Mail.'}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Sends the activation e-mail after a successful Stripe / PayPal
 * payment. Contains: the code, a 1-click activation link, an
 * "open the app" button, and plain-text instructions.
 *
 * @param {string} email
 * @param {string} code
 * @param {!Object} planInfo
 */
function sendActivationEmail_(email, code, planInfo) {
  const link = `${APP_BASE_URL}/?activate=${encodeURIComponent(code)}`;
  const subject = `🎉 Dein SprachCoach Code: ${planInfo.label}`;

  const html = buildEmailHtml_({
    headline: 'Willkommen beim SprachCoach!',
    introHtml:
      `<p style="margin:0 0 12px;line-height:1.6;font-size:15px;color:#444;">` +
      `Vielen Dank für deinen Kauf — <strong>${escapeHtml_(planInfo.label)}</strong> ` +
      `ist freigeschaltet. Dein persönlicher Code ist bereit.</p>`,
    codeLabel: 'Dein Aktivierungscode',
    code,
    ctaLabel: '→ Jetzt aktivieren',
    ctaLink: link,
    footerNote: 'Bei Problemen antworte einfach auf diese E-Mail — wir helfen dir gerne.',
  });

  const text =
    `Willkommen beim SprachCoach!\n\n` +
    `${planInfo.label} ist freigeschaltet.\n\n` +
    `Aktivierungscode: ${code}\n\n` +
    `Direkt aktivieren:\n${link}\n\n` +
    `Oder gib den Code manuell in der App ein: ${APP_BASE_URL}\n`;

  sendBrandedEmail_(email, subject, html, text);
}

/**
 * Sends the magic-link login e-mail.
 *
 * @param {string} email
 * @param {string} token
 */
function sendMagicLinkEmail_(email, token) {
  const link = `${APP_BASE_URL}/?mltoken=${encodeURIComponent(token)}`;
  const subject = '🔑 Dein SprachCoach Login-Link';

  const html = buildEmailHtml_({
    headline: 'Dein Login-Link',
    introHtml:
      '<p style="margin:0;line-height:1.6;font-size:15px;color:#444;">' +
      'Klicke auf den Button, um dich beim SprachCoach anzumelden. ' +
      'Der Link ist <strong>30 Minuten</strong> gültig und kann nur einmal benutzt werden.</p>',
    ctaLabel: '→ Jetzt anmelden',
    ctaLink: link,
    showManualHint: false,
    footerNote: 'Du hast diesen Link nicht angefordert? Ignoriere diese E-Mail einfach.',
  });

  sendBrandedEmail_(email, subject, html, `Login-Link (30 Min. gültig):\n${link}\n`);
}

/**
 * Sends the 1-day trial code. The e-mail contains a one-click
 * activation link, the bare URL as a fallback (in case the styled
 * button is stripped by the mail client), and a bare link to the
 * app's landing page.
 *
 * @param {string} email
 * @param {string} code
 */
function sendTrialCodeEmail_(email, code) {
  const link = `${APP_BASE_URL}/?activate=${encodeURIComponent(code)}`;
  const subject = '🎁 Dein 1-Tag SprachCoach Trial';

  const html = buildEmailHtml_({
    headline: '🎁 Dein Gratis-Trial ist da!',
    introHtml:
      '<p style="margin:0 0 12px;line-height:1.6;font-size:15px;color:#444;text-align:center;">' +
      'Du kannst <strong>Der SprachCoach</strong> 24 Stunden lang kostenlos testen — ' +
      'mit <strong>allen Premium-Funktionen</strong>.</p>' +
      '<p style="margin:0;line-height:1.6;font-size:14px;color:#69c43b;font-weight:700;text-align:center;">' +
      '✓ Themen-Training · ✓ Grammatik · ✓ Wörterbuch</p>',
    codeLabel: 'Dein Trial-Code (24 h gültig)',
    code,
    ctaLabel: '→ Jetzt aktivieren',
    ctaLink: link,
    footerNote: 'Der Trial-Code ist 24 Stunden ab Aktivierung gültig. Bei Fragen antworte auf diese E-Mail.',
  });

  const text =
    `Dein 1-Tag SprachCoach Trial\n\n` +
    `Trial-Code: ${code}\n` +
    `Gültig: 24 Stunden ab Aktivierung\n\n` +
    `Direkt aktivieren:\n${link}\n\n` +
    `Oder gib den Code manuell in der App ein: ${APP_BASE_URL}\n`;

  sendBrandedEmail_(email, subject, html, text);
}

/* ────────────────────────────────────────────────────────────────
   Helpers.
   ──────────────────────────────────────────────────────────────── */

/**
 * Returns the logo as a PNG blob for `MailApp` inline embedding.
 * Requires `logoData.gs` (generated by `node scripts/embed-logo.mjs`).
 *
 * @return {!Blob}
 */
function emailLogoBlob_() {
  return Utilities.newBlob(
    Utilities.base64Decode(LOGO_PNG_BASE64),
    'image/png',
    'logo.png',
  );
}

/**
 * Sends a branded HTML e-mail with the logo embedded via `cid:logo`.
 *
 * @param {string} to
 * @param {string} subject
 * @param {string} htmlBody
 * @param {string} textBody
 */
function sendBrandedEmail_(to, subject, htmlBody, textBody) {
  MailApp.sendEmail({
    to,
    replyTo: SUPPORT_EMAIL,
    name: FROM_NAME,
    subject,
    htmlBody,
    body: textBody,
    inlineImages: { logo: emailLogoBlob_() },
  });
}

/**
 * Returns a sheet by name, creating it (with the given header row)
 * if it does not exist yet.
 *
 * @param {string} name
 * @param {Array<string>} [headers]
 * @return {!Sheet}
 */
function sheet_(name, headers) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let s = ss.getSheetByName(name);
  if (!s) {
    s = ss.insertSheet(name);
    if (headers && headers.length) s.appendRow(headers);
  }
  return s;
}

/**
 * @param {!Object} e
 * @return {boolean}
 */
function checkWebhookSecret_(e) {
  return e && e.parameter && e.parameter.secret === WEBHOOK_SECRET;
}

/**
 * Returns true if the given external event id has already been
 * recorded (idempotency for Stripe / PayPal redeliveries).
 *
 * @param {string} txId
 * @return {boolean}
 */
function eventAlreadyProcessed_(txId) {
  if (!txId) return false;
  const sheet = sheet_('Codes');
  const data = sheet.getDataRange().getValues();
  for (let r = 1; r < data.length; r++) {
    if (String(data[r][8]) === String(txId)) return true;
  }
  return false;
}

/**
 * Looks up whether the buyer has an unexpired Premium code on file.
 *
 * @param {string} email
 * @return {boolean}
 */
function hasActivePremium_(email) {
  const sheet = sheet_('Codes');
  const data = sheet.getDataRange().getValues();
  const now = Date.now();
  for (let r = 1; r < data.length; r++) {
    const row = data[r];
    if (String(row[1]).toLowerCase() !== email) continue;
    if (row[2] !== 'basis' && row[3] > 0) {
      const issued = new Date(row[4]).getTime();
      const expires = issued + Number(row[3]) * 30 * 24 * 60 * 60 * 1000;
      if (expires > now) return true;
    }
  }
  return false;
}

/**
 * @param {string} email
 * @return {boolean}
 */
function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * @param {string} email
 * @return {boolean}
 */
function rateLimitOk_(email) {
  const sheet = sheet_('Magic');
  const data = sheet.getDataRange().getValues();
  const now = Date.now();
  let count = 0;
  for (let r = 1; r < data.length; r++) {
    if (String(data[r][1]).toLowerCase() === email) {
      const ageMs = now - new Date(data[r][2]).getTime();
      if (ageMs < MAGIC_LINK_RATE.windowMs) count += 1;
    }
  }
  return count < MAGIC_LINK_RATE.count;
}

/**
 * Parses a URL-encoded form body into a plain object.
 *
 * @param {string} body
 * @return {!Object<string, string>}
 */
function parseFormBody_(body) {
  const out = {};
  body.split('&').forEach((pair) => {
    const [k, v] = pair.split('=').map(decodeURIComponent);
    if (k) out[k.replace(/\+/g, ' ')] = (v || '').replace(/\+/g, ' ');
  });
  return out;
}

/**
 * @param {string} s
 * @return {string}
 */
function escapeHtml_(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * @param {!Object} payload
 * @return {!ContentService.TextOutput}
 */
function json(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Builds a safe API error payload. While `TRIAL_TEST_MODE` is on the
 * underlying exception message is included to speed up QA; otherwise
 * only the generic label is returned.
 *
 * @param {*} err
 * @return {!Object}
 */
function serverError_(err) {
  const detail = String((err && err.message) || err || '');
  if (TRIAL_TEST_MODE && detail) {
    return { ok: false, error: `Serverfehler: ${detail}` };
  }
  return { ok: false, error: 'Serverfehler' };
}

/**
 * @param {string} tag
 * @param {string} msg
 */
function log(tag, msg) {
  try { Logger.log(`[${tag}] ${msg}`); } catch (_) { /* noop */ }
}
