/**
 * @fileoverview Payment configuration for Stripe and PayPal.
 *
 * The trainer never holds card data: both providers run hosted
 * checkout pages and the user is sent back with a magic-link
 * activation code via e-mail. Everything below is plain URL config
 * that can be swapped without touching component code.
 *
 * IMPORTANT — for production, swap these values for the LIVE links
 * generated in your Stripe Dashboard (Payment Links → Create link)
 * and your PayPal.me handle. The Stripe success URL must match the
 * redirect URL configured on each Payment Link.
 *
 * The `SCRIPT_URL` constant points to the Google Apps Script Web App
 * that handles code validation, magic-link login, trial requests, and
 * the Stripe / PayPal IPN webhooks. Leave it empty to run the SPA in
 * pure demo mode (no network calls, demo activator only).
 */

/**
 * Apps Script Web App endpoint.
 *
 * Deploy `apps-script/Code.gs` (see `apps-script/README.md`) as a
 * Google Apps Script Web App (Deploy → New deployment → Web app,
 * "Execute as: Me", "Who has access: Anyone"). Replace the URL below
 * with the resulting `https://script.google.com/macros/s/.../exec`.
 *
 * Setting this to an empty string disables ALL network calls and
 * makes the SPA fall back to the local demo activator
 * (`PREMIUM_*` / `BASIS_*` prefix codes only).
 */
export const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbw0oSHhowmjag6KMvsSd8C7nBkTduQ93L25Vv1yn6mY_7y6D_XEMxDRg5UuAvN36nkuRA/exec';

/**
 * Public base URL of the deployed SPA. Used to:
 *   - Build the activation link embedded in payment confirmation /
 *     magic-link e-mails sent by the Apps Script backend (which
 *     reads the same constant from its own config).
 *   - Build the Stripe success redirect URL (`?stripe_success=1`).
 *
 * IMPORTANT: NO trailing `/#/` — query parameters
 * (`?activate=…`, `?stripe_success=…`, `?mltoken=…`) must sit BEFORE
 * the hash so `window.location.search` is non-empty when
 * `BootstrapHandler.vue` reads them on page load. The Vue Router
 * (hash mode) takes over after BootstrapHandler runs.
 *
 * Keep this in sync with the `BASE_URL` / `APP_BASE_URL` constant in
 * the deployed Apps Script.
 */
export const APP_BASE_URL = 'https://lernziel-deutsch.de';

/**
 * Stripe price (in cents) → plan mapping. Mirrors `STRIPE_AMOUNT_MAP`
 * in the Apps Script and is used only for client-side display logic.
 */
export const STRIPE_AMOUNT_MAP = {
  499:  { months: 0,  plan: 'basis',    label: 'Zeitlimit aufheben' },
  1900: { months: 1,  plan: '1month',   label: '1 Monat'   },
  4900: { months: 3,  plan: '3months',  label: '3 Monate'  },
  9900: { months: 12, plan: '12months', label: '12 Monate' },
  9000: { months: 12, plan: '12months', label: '12 Monate' },
};

/** Stripe Payment Link per Premium plan. */
export const STRIPE_LINKS = {
  '1month':   'https://buy.stripe.com/00w7sF80EaP70ih8PsbII00',
  '3months':  'https://buy.stripe.com/bJedR35SwaP76GFaXAbII01',
  '12months': 'https://buy.stripe.com/eVq9ANdkYe1j2qp1n0bII02',
};

/** Stripe Payment Link for the one-off Basis (Zeitlimit aufheben) plan. */
export const STRIPE_BASIS_LINK = 'https://buy.stripe.com/6oUfZbft60ate973v8bII03';

/**
 * Query parameter Stripe appends to the success URL.
 * App startup checks for this and shows the success banner.
 */
export const STRIPE_SUCCESS_PARAM = 'stripe_success';

/** PayPal.me handle used by the fallback PayPal button. */
export const PAYPAL_HANDLE = 'lehrermann';

/** PayPal.me amount slug per Premium plan (price + currency, no decimal). */
export const PAYPAL_AMOUNTS = {
  '1month':   '19EUR',
  '3months':  '49EUR',
  '12months': '99EUR',
};

/** Numeric prices for display, in EUR. */
export const PRICES_EUR = {
  '1month':   19,
  '3months':  49,
  '12months': 99,
  basis:      4.99,
};

/**
 * Builds the Stripe checkout URL for a plan, optionally pre-filling
 * the customer's e-mail address on the Stripe-hosted page.
 *
 * @param {('1month'|'3months'|'12months')} plan
 * @param {string} [email]
 * @return {string}
 */
export function buildStripePremiumUrl(plan, email) {
  const base = STRIPE_LINKS[plan] || STRIPE_LINKS['1month'];
  return email ? `${base}?prefilled_email=${encodeURIComponent(email)}` : base;
}

/**
 * Builds the Stripe checkout URL for the Basis upgrade.
 *
 * @param {string} [email]
 * @return {string}
 */
export function buildStripeBasisUrl(email) {
  return email
    ? `${STRIPE_BASIS_LINK}?prefilled_email=${encodeURIComponent(email)}`
    : STRIPE_BASIS_LINK;
}

/**
 * Builds the PayPal.me URL for a Premium plan.
 *
 * @param {('1month'|'3months'|'12months')} plan
 * @return {string}
 */
export function buildPaypalUrl(plan) {
  const amount = PAYPAL_AMOUNTS[plan] || PAYPAL_AMOUNTS['1month'];
  return `https://paypal.me/${PAYPAL_HANDLE}/${amount}`;
}
