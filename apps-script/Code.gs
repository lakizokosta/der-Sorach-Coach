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

/** Spreadsheet ID that stores the Codes / Sessions / Magic / Trial tabs. */
const SHEET_ID = 'REPLACE_WITH_YOUR_SPREADSHEET_ID';

/** Public URL of the deployed SPA — used in every e-mail link. */
const APP_BASE_URL = 'https://der-sprachcoach.workers.dev';

/** "From" address shown in outgoing e-mails (must be the script owner). */
const FROM_NAME = 'Der SprachCoach';

/** Where the contact form is forwarded. */
const SUPPORT_EMAIL = 'support@der-sprachcoach.de';

/**
 * Shared secret appended to webhook URLs as `?secret=…`.
 *
 * Apps Script does not give us access to HTTP request headers, so we
 * cannot verify the Stripe HMAC signature the canonical way. Instead
 * the deployment URLs include an unguessable shared secret; Stripe
 * and PayPal include it because the URL is configured once in their
 * dashboards. Rotate it by editing this constant + the webhook URLs.
 */
const WEBHOOK_SECRET = 'REPLACE_WITH_A_LONG_RANDOM_STRING';

/** PayPal merchant e-mail for IPN sanity check. */
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
    return json({ ok: false, error: 'Serverfehler' });
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
    return json({ ok: false, error: 'Serverfehler' });
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
 * Issues one 1-day trial code per (e-mail, device) pair.
 *
 * @param {!Object} body  {email, deviceId}.
 * @return {!Object}
 */
function requestTrial(body) {
  const email = String(body.email || '').toLowerCase().trim();
  const deviceId = String(body.deviceId || '').trim();
  if (!isValidEmail_(email)) return { ok: false, error: 'Ungültige E-Mail' };

  const sheet = sheet_('Trial', ['email', 'deviceId', 'code', 'issuedAt']);
  const data = sheet.getDataRange().getValues();
  for (let r = 1; r < data.length; r++) {
    if (String(data[r][0]).toLowerCase() === email
        || String(data[r][1]) === deviceId) {
      return { ok: false, error: 'Du hast bereits einen Trial-Code erhalten.' };
    }
  }

  const planInfo = { plan: 'trial', months: 0, label: '1 Tag Trial' };
  const code = `TRIAL-${Utilities.getUuid().split('-')[0].toUpperCase()}`;
  const codeSheet = sheet_('Codes');
  // Trial expires in 24h, so we record months as 0 but stamp custom expiry.
  codeSheet.appendRow([
    code, email, 'trial', 0, new Date(), '', '', 'trial',
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  ]);
  sheet.appendRow([email, deviceId, code, new Date()]);
  sendTrialCodeEmail_(email, code);
  return { ok: true };
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

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:14px;padding:28px;color:#222;">
  <h1 style="color:#AB4DBB;margin:0 0 8px 0;font-size:22px;">Willkommen beim SprachCoach!</h1>
  <p style="margin:0 0 18px 0;line-height:1.5;">
    Vielen Dank für deinen Kauf — <strong>${escapeHtml_(planInfo.label)}</strong> ist freigeschaltet.
  </p>

  <div style="background:#f6f1ff;border:2px dashed #AB4DBB;border-radius:12px;padding:20px;text-align:center;margin:18px 0;">
    <div style="font-size:12px;color:#7a3b86;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px;">
      Dein Aktivierungscode
    </div>
    <div style="font-family:'Courier New',monospace;font-size:22px;font-weight:900;letter-spacing:2px;color:#4a148c;">
      ${escapeHtml_(code)}
    </div>
  </div>

  <p style="text-align:center;margin:24px 0;">
    <a href="${link}"
       style="background:#AB4DBB;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:900;display:inline-block;">
      → Jetzt aktivieren
    </a>
  </p>

  <p style="font-size:13px;color:#666;line-height:1.5;margin:18px 0 6px 0;">
    Funktioniert der Button nicht? Kopiere diese Adresse in deinen Browser:
  </p>
  <p style="font-size:12px;color:#888;word-break:break-all;margin:0 0 18px 0;">
    ${escapeHtml_(link)}
  </p>

  <p style="font-size:13px;color:#666;line-height:1.5;margin:0 0 6px 0;">
    Oder öffne die App und gib den Code manuell ein:
  </p>
  <p style="font-size:13px;margin:0 0 18px 0;">
    <a href="${APP_BASE_URL}" style="color:#AB4DBB;">${escapeHtml_(APP_BASE_URL)}</a>
  </p>

  <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
  <p style="font-size:11px;color:#aaa;text-align:center;margin:0;">
    Bei Problemen antworte einfach auf diese E-Mail —
    wir helfen dir gerne.
  </p>
</div>`;

  const text =
    `Willkommen beim SprachCoach!\n\n` +
    `${planInfo.label} ist freigeschaltet.\n\n` +
    `Aktivierungscode: ${code}\n\n` +
    `Direkt aktivieren:\n${link}\n\n` +
    `Oder gib den Code manuell in der App ein: ${APP_BASE_URL}\n`;

  MailApp.sendEmail({
    to: email,
    replyTo: SUPPORT_EMAIL,
    name: FROM_NAME,
    subject,
    htmlBody: html,
    body: text,
  });
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

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#222;">
  <h1 style="color:#AB4DBB;font-size:20px;margin:0 0 12px 0;">Dein Login-Link</h1>
  <p style="line-height:1.5;">
    Klicke auf den Button, um dich beim SprachCoach anzumelden.
    Der Link ist 30 Minuten gültig und kann nur einmal benutzt werden.
  </p>
  <p style="text-align:center;margin:24px 0;">
    <a href="${link}" style="background:#AB4DBB;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:900;display:inline-block;">
      → Jetzt anmelden
    </a>
  </p>
  <p style="font-size:12px;color:#888;word-break:break-all;">${escapeHtml_(link)}</p>
</div>`;

  MailApp.sendEmail({
    to: email,
    replyTo: SUPPORT_EMAIL,
    name: FROM_NAME,
    subject,
    htmlBody: html,
    body: `Login-Link (30 Min. gültig):\n${link}\n`,
  });
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

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:14px;padding:28px;color:#222;">
  <h1 style="color:#AB4DBB;margin:0 0 8px 0;font-size:22px;">🎁 Dein Gratis-Trial ist da!</h1>
  <p style="margin:0 0 18px 0;line-height:1.5;">
    Du kannst <strong>Der SprachCoach</strong> 24 Stunden lang kostenlos testen — mit allen Premium-Funktionen.
  </p>

  <div style="background:#f6f1ff;border:2px dashed #AB4DBB;border-radius:12px;padding:20px;text-align:center;margin:18px 0;">
    <div style="font-size:12px;color:#7a3b86;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px;">
      Dein Trial-Code (24 h gültig)
    </div>
    <div style="font-family:'Courier New',monospace;font-size:22px;font-weight:900;letter-spacing:2px;color:#4a148c;">
      ${escapeHtml_(code)}
    </div>
  </div>

  <p style="text-align:center;margin:24px 0;">
    <a href="${link}"
       style="background:#AB4DBB;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:900;display:inline-block;">
      → Jetzt aktivieren
    </a>
  </p>

  <p style="font-size:13px;color:#666;line-height:1.5;margin:18px 0 6px 0;">
    Funktioniert der Button nicht? Kopiere diese Adresse in deinen Browser:
  </p>
  <p style="font-size:12px;color:#888;word-break:break-all;margin:0 0 18px 0;">
    ${escapeHtml_(link)}
  </p>

  <p style="font-size:13px;color:#666;line-height:1.5;margin:0 0 6px 0;">
    Oder öffne die App und gib den Code manuell ein:
  </p>
  <p style="font-size:13px;margin:0 0 18px 0;">
    <a href="${APP_BASE_URL}" style="color:#AB4DBB;">${escapeHtml_(APP_BASE_URL)}</a>
  </p>

  <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
  <p style="font-size:11px;color:#aaa;text-align:center;margin:0;">
    Der Trial-Code ist 24 Stunden ab Aktivierung gültig.
    Bei Fragen antworte einfach auf diese E-Mail.
  </p>
</div>`;

  const text =
    `Dein 1-Tag SprachCoach Trial\n\n` +
    `Trial-Code: ${code}\n` +
    `Gültig: 24 Stunden ab Aktivierung\n\n` +
    `Direkt aktivieren:\n${link}\n\n` +
    `Oder gib den Code manuell in der App ein: ${APP_BASE_URL}\n`;

  MailApp.sendEmail({
    to: email,
    replyTo: SUPPORT_EMAIL,
    name: FROM_NAME,
    subject,
    htmlBody: html,
    body: text,
  });
}

/* ────────────────────────────────────────────────────────────────
   Helpers.
   ──────────────────────────────────────────────────────────────── */

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
 * @param {string} tag
 * @param {string} msg
 */
function log(tag, msg) {
  try { Logger.log(`[${tag}] ${msg}`); } catch (_) { /* noop */ }
}
