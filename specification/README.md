# Der SprachCoach — Website Specification

Functional and UI specification of every page of the Der SprachCoach SPA,
reverse-engineered from the source (`src/site/`, `worker/`, `apps-script/`) and
from the running dev build (`npm run dev` → `http://localhost:5173`).

Snapshot date: 2026-10-13 · commit `193ba144`.

## Contents

| # | Page | Route | File |
|---|------|-------|------|
| 1 | Landing (home) + app shell | `/#/` | [pages/01-landing.md](pages/01-landing.md) |
| 2 | Trainer (question flow) | `/#/trainer?level=…` | [pages/02-trainer.md](pages/02-trainer.md) |
| 3 | Premium (checkout / activation) | `/#/premium` | [pages/03-premium.md](pages/03-premium.md) |
| 4 | Profile (learner dashboard) | `/#/profile` | [pages/04-profile.md](pages/04-profile.md) |
| 5 | Legal (AGB / Datenschutz / Impressum) | `/#/legal/:slug` | [pages/05-legal.md](pages/05-legal.md) |

Screenshots (desktop 1280 px and mobile 390 px, free/anonymous user, DE locale)
are in [screenshots/](screenshots/). They were taken with headless Chrome
`--window-size`. On macOS headless Chrome may not lay out narrower than about 500 px,
so the right edge of the `*-mobile.png` shots can be cropped. Check mobile layout
on a real device or with DevTools device emulation before treating it as a bug.

## Product summary

A German grammar and vocabulary trainer for levels A1–B2 ("10 Minuten täglich").
Free users train without registration, with a daily question limit. Premium
(paid via Stripe or PayPal) unlocks topic training, vocabulary sets, the
placement test (Einstufungstest), the full profile dashboard and cross-device
progress sync via a magic-link login.

## Architecture overview

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Vue 3.5 (`<script setup>`), Vue Router 4 **hash mode**, Vite 6 | Pure JS, one stylesheet `src/site/styles/main.css` |
| i18n | Custom (`src/site/i18n/index.js`) | UI in **DE** (default) / RU / EN, stored in `localStorage.uiLocale`; questions stay German |
| Backend A | Google Apps Script web app (`apps-script/Code.gs`) | URL in `src/site/data/payment.js:32`; codes, magic link, progress, contact form, payment webhooks |
| Backend B | Cloudflare Worker (`worker/index.js`) | Serves `dist/` and `/api/questions` (premium question bank), `/api/health` |
| Persistence | `localStorage` | See keys below |

### Routing (`src/site/router/index.js`)

| Route | Name | Component |
|-------|------|-----------|
| `/` | `landing` | `Landing.vue` |
| `/trainer` | `trainer` | `Trainer.vue` |
| `/premium` | `premium` | `Premium.vue` |
| `/profile` | `profile` | `Profile.vue` |
| `/legal/:slug(agb\|datenschutz\|impressum)` | `legal` | `Legal.vue` |
| anything else | — | redirect → `landing` |

Global guards:
- `/premium` redirects to `/` when the user is already Premium (unless `?focus=basis`).
- `/trainer` redirects to `/premium?hub=1` when the backend is configured, entitlements
  are loaded, the query requires Premium (`trainerRequiresPremium`) and the user is not Premium.
- Every navigation scrolls to top.

### App shell (`src/site/App.vue`) — present on every page
- **Bootstrap overlay** "🔒 Zugriff wird geprüft…" while entitlements load (backend mode).
- **Backend-degraded banner** (⚠️) when the backend is unreachable / in grace mode.
- **Locale switcher** DE · RU · EN (top centre).
- **FAB stack** (bottom right): "🔑 Anmelden" (only for not-logged-in users on landing
  when not Basis-premium, or on `/premium?hub=1`; never on trainer) and "📧 Support / Kontakt"
  (always) → opens `ContactModal`.
- `BootstrapHandler` processes incoming query params (magic-link tokens, payment returns).

### Backend API surface

Apps Script (`src/site/utils/api.js`): `validateCode`, `validateMagicToken`,
`requestMagicLink`, `refreshMagicSession`, `revokeMagicSession`, contact form,
`loadProgressByEmail`, `saveProgressByEmail`, streak save, `verifyTrainingAccess`,
`monitorNotify`, plus `stripeWebhook` / `paypalIpn`.

Worker: `GET /api/questions?…` (Premium question bank, authorised via a training JWT),
`GET /api/health`.

### localStorage keys

`uiLocale`, `lzd_xp`, `lzd_streak`, `lzd_daily_goal`, `lzd_daily_bonus`,
`lzd_free_daily`, `lzd_topic_correct`, `lzd_topic_wrong`, `lzd_cefr_level`,
`lzd_nickname`, `lzd_did` (device id), `lzd_user_v1`, `lzd_premium`,
`lzd_premium_session_token`, `lzd_premium_session_expires`, `lzd_entitlement_grace`.

### Content volume
Vocabulary questions as Markdown in `src/site/questions-vocab/<LEVEL>/<TOPIC>/*.md`:
A1 560 (6 topics), A2 650 (5), B1 780 (6), B2 780 (6). Grammar questions live in
`src/site/data/questions.js` and the Premium bank is served by the Worker.

## Cross-cutting observations

1. **Local dev uses the production backend.** `SCRIPT_URL` is hard-coded
   (`src/site/data/payment.js:32`), so `npm run dev` talks to the live Apps Script.
   The README's "demo mode, no backend secrets" description no longer matches.
2. **Secret committed to the repo.** `TRAINING_JWT_SECRET` sits in plaintext in
   `wrangler.toml` `[vars]`. It should be a Wrangler secret (`wrangler secret put`), and the value should be rotated.
3. Hash routing (`/#/…`) means deep links and SEO only see `/`.

Page-specific findings are listed under **Open questions / observations** in each page file.
