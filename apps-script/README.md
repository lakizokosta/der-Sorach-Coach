# Apps Script backend — deployment guide

`Code.gs` is the entire backend that powers the SPA:

| Trigger | Effect |
| --- | --- |
| Stripe webhook (`checkout.session.completed`) | Generates an activation code, saves it to the `Codes` sheet, **e-mails the buyer the code + a one-click activation link**. |
| PayPal IPN (`payment_status=Completed`) | Same as Stripe, but verified by re-posting to PayPal. |
| `POST {requestMagicLink, email}` from the SPA | Issues a 30-min magic-link token, e-mails the link. |
| `POST {requestTrial, email}` from the SPA | One-shot 24-hour trial code, e-mailed to the buyer. |
| `POST {contactForm, …}` from the SPA | Forwarded to `SUPPORT_EMAIL`. |
| `GET ?action=validateCode&code=…` | Server-side code check, returns a 2-hour session token. |
| `GET ?action=validateMagicToken&token=…` | Consumes a magic-link token, returns a 7-day session. |

Every outgoing e-mail uses the script owner's Gmail (free tier limit: **100 e-mails / day**; Workspace: 1,500 / day).

---

## 1. Create the Google Sheet

1. Create a new Google Sheet — name doesn't matter.
2. Copy its ID from the URL  
   `https://docs.google.com/spreadsheets/d/`**`<SHEET_ID>`**`/edit`.
3. Tabs (`Codes`, `Sessions`, `Magic`, `MagicSessions`, `Trial`) are created automatically the first time the script runs.

---

## 2. Create the Apps Script project

1. Go to <https://script.google.com> → **New project**.
2. Replace the default `Code.gs` with the contents of `apps-script/Code.gs`.
3. Open the manifest (gear ▸ **Project Settings** ▸ check "Show appsscript.json"), then replace it with the contents of `apps-script/appsscript.json`.
4. At the top of `Code.gs`, edit the constants:

   | Constant | Value |
   | --- | --- |
   | `SHEET_ID` | The ID from step 1. |
   | `APP_BASE_URL` | Public URL of the deployed SPA (e.g. `https://der-sprachcoach.workers.dev`). MUST match `APP_BASE_URL` in `src/data/payment.js`. |
   | `SUPPORT_EMAIL` | Address that receives contact-form mails. |
   | `WEBHOOK_SECRET` | Generate a long random string (e.g. `openssl rand -hex 24`). |
   | `PAYPAL_MERCHANT_EMAIL` | Your PayPal account's primary e-mail. |

5. Save the project, give it a name (e.g. *SprachCoach Backend*).

---

## 3. Deploy as a Web App

1. **Deploy → New deployment → ⚙ → Web app**.
2. **Description**: `prod`
3. **Execute as**: `Me (your-google-account)`
4. **Who has access**: `Anyone`
5. Click **Deploy**, authorise the requested scopes (`Sheets`, `Send mail`, `Fetch external URLs`).
6. Copy the resulting URL — it looks like  
   `https://script.google.com/macros/s/AKfy.../exec`.

Paste this URL into:

```js
// src/data/payment.js
export const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfy.../exec';
```

Re-build and re-deploy the SPA so the new URL is bundled.

---

## 4. Wire up Stripe webhooks (this is what e-mails the codes)

1. <https://dashboard.stripe.com/webhooks> → **Add endpoint**.
2. **Endpoint URL**:

   ```
   https://script.google.com/macros/s/AKfy.../exec?action=stripeWebhook&secret=YOUR_WEBHOOK_SECRET
   ```

   Replace `YOUR_WEBHOOK_SECRET` with the value you put in `Code.gs`.

3. **Listen to**: `checkout.session.completed` (only that — keeps quota usage low).
4. Save the endpoint.
5. Click **Send test webhook → checkout.session.completed** to verify — within a few seconds an e-mail should arrive at the address Stripe puts in `customer_details.email` of the test event.

> **Why the secret-in-URL instead of HMAC?**  
> Apps Script `doPost(e)` does not expose request headers, so we cannot verify Stripe's `Stripe-Signature` HMAC the canonical way. Putting a long random secret in the URL gives equivalent unguessability — the URL itself never leaves Stripe's database.

For each Stripe Payment Link, set the **After payment** redirect to:

```
https://der-sprachcoach.workers.dev/?stripe_success=1
```

The SPA's `BootstrapHandler` then shows the *"Prüfe deine E-Mail"* banner.

---

## 5. Wire up PayPal IPN (optional)

If you accept PayPal:

1. PayPal account → **Profile → My selling tools → Instant payment notifications**.
2. Notification URL:

   ```
   https://script.google.com/macros/s/AKfy.../exec?action=paypalIpn&secret=YOUR_WEBHOOK_SECRET
   ```

3. **Receive IPN messages** = enabled.
4. The script verifies every IPN by POSTing it back to `ipnpb.paypal.com`; flip `PAYPAL_USE_SANDBOX = true` while testing.

> If you're using **PayPal.me** (personal pay-link), IPN won't fire. For that case process payments manually: create a code by running `generateActivationCode_('1month')` from the Apps Script editor and call `sendActivationEmail_('buyer@example.com', code, STRIPE_AMOUNT_MAP[1900])`.

---

## 6. Sanity test

In the Apps Script editor:

1. Click **Run → handleStripeWebhook_** the first time to grant the OAuth scopes (it will fail because there's no body — that's fine).
2. Use the **Executions** panel to follow webhook deliveries.
3. Check the spreadsheet — each completed payment appends one row to `Codes`.

---

## 7. Updating the backend

1. Edit `apps-script/Code.gs` in this repo.
2. Paste the changes into the Apps Script editor.
3. **Deploy → Manage deployments → ⚙ Edit → New version → Deploy**.  
   The `/exec` URL stays the same, so the SPA does not need to be rebuilt.

---

## Local dev tip

Setting `SCRIPT_URL` to an empty string in `src/data/payment.js` puts the SPA in **pure demo mode** — no network calls, no e-mails, no Stripe redirect, but every `PREMIUM_*` / `BASIS_*` prefix code activates instantly. Use this while iterating on UI work.
