# Der SprachCoach — Vue 3 Rebuild

A complete rebuild of the original monolithic `blogspot.html` German-language
trainer as a small, modern Vue 3 single-page application. The original page
mixed HTML, CSS and ~2,800 lines of inline JavaScript; this project breaks
that down into clearly scoped components, composables, data files and
utilities while preserving the entire learner-facing experience.

The rebuild deliberately follows the **KISS principle**:

- **Pure JavaScript** (no TypeScript) and modern ES modules.
- **Composition API** with `<script setup>` for every component.
- **One stylesheet** (`src/styles/main.css`) — no CSS frameworks, no Sass,
  no per-component CSS Modules.
- **No third-party state library** — local component state, a couple of
  small composables, and `localStorage` for persistence are enough.
- **Demo-mode integrations** for payments, contact form and Blogger feeds
  so the app runs offline-first without any backend secrets.

> The original `blogspot.html` is left untouched as the reference spec.

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Quick start](#quick-start)
3. [Project layout](#project-layout)
4. [Features](#features)
5. [Question types](#question-types)
6. [Data model & persistence](#data-model--persistence)
7. [Composables](#composables)
8. [Routing](#routing)
9. [Payments (Stripe + PayPal)](#payments-stripe--paypal)
10. [Sharing & dictionary](#sharing--dictionary)
11. [Coding conventions](#coding-conventions)
12. [Scripts](#scripts)
13. [Browser support](#browser-support)
14. [License](#license)

---

## Tech stack

| Layer        | Choice                                                |
| ------------ | ----------------------------------------------------- |
| Framework    | [Vue 3.5](https://vuejs.org/) (Composition API, `<script setup>`) |
| Router       | [Vue Router 4](https://router.vuejs.org/) (hash mode) |
| Build tool   | [Vite 6](https://vitejs.dev/)                          |
| Language     | Pure JavaScript (ES2022 modules)                       |
| Node runtime | **Node.js >= 20 LTS**                                  |
| Persistence  | `window.localStorage` (with safe `try/catch` wrapper)  |

No state library, no UI kit. The dependency tree is intentionally minimal.

---

## Quick start

```bash
# 1. Install dependencies (Node 20 LTS or newer is required)
npm install

# 2. Start the dev server
npm run dev
# → open http://localhost:5173

# 3. Build for production
npm run build        # output → dist/

# 4. Preview the production build locally
npm run preview
```

The app is fully client-side and ships as static assets — drop `dist/` on
any static host (GitHub Pages, Netlify, Cloudflare Pages, S3 + CloudFront,
even a folder behind nginx) and it just works.

---

## Project layout

```
der-Sorach-Coach/
├── blogspot.html           # original monolithic source (reference only — not edited)
├── index.html              # Vite entry HTML
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg         # extracted from the original page
└── src/
    ├── main.js             # createApp + router + global CSS
    ├── App.vue             # shell + persistent Kontakt FAB
    ├── router/
    │   └── index.js        # 4 named routes: landing / trainer / premium / profile
    ├── views/
    │   ├── Landing.vue     # home screen, level picker, plan comparison
    │   ├── Trainer.vue     # question flow, timer, summary, upsells
    │   ├── Premium.vue     # demo activation + topic picker
    │   └── Profile.vue     # XP / streak / mastery dashboard + share card
    ├── components/
    │   ├── LzdLogo.vue
    │   ├── ContactModal.vue        # POSTs to sendContactForm endpoint
    │   ├── BootstrapHandler.vue    # ?stripe_success / ?activate / ?mltoken
    │   ├── GrammarTip.vue
    │   ├── DictionaryPopup.vue
    │   └── questions/
    │       ├── QuestionRenderer.vue   # dispatcher (4 types)
    │       ├── MultipleChoice.vue     # type: 'select-one'
    │       ├── MultiSelect.vue        # type: 'multi-select'
    │       ├── DragDrop.vue           # type: 'dropbox'
    │       └── FillBlank.vue          # type: 'input-text'
    ├── composables/
    │   ├── useStorage.js   # safe localStorage wrapper
    │   ├── useStreak.js    # daily streak + freezes + medals
    │   ├── useXp.js        # XP, level, per-topic mastery
    │   ├── usePremium.js   # async activateCode + revalidateOnLoad
    │   ├── useAuth.js      # 7-day Magic-Link user session
    │   └── useTimer.js     # count-up / count-down timer
    ├── data/
    │   ├── payment.js        # SCRIPT_URL + Stripe / PayPal config
    │   ├── grammarHints.js   # DE / RU / EN explanations
    │   ├── premiumTopics.js  # A1–B2 topic catalogue
    │   ├── stopwords.js      # words that should NOT trigger the dictionary
    │   └── questions.js      # build-time Markdown question loader
    ├── utils/
    │   ├── api.js               # Apps Script HTTP client
    │   ├── deviceId.js          # canvas fingerprint + sticky device ID
    │   ├── random.js            # Fisher-Yates shuffle
    │   ├── queue.js             # AdaptiveQueue (repeat-on-wrong)
    │   ├── markdownQuestion.js  # frontmatter parser for question MDs
    │   ├── dictionary.js        # MyMemory lookup + word wrapping
    │   └── shareCard.js         # Canvas → PNG → Web Share / download
    ├── questions/                  # ★ the question bank lives here ★
    │   ├── A1/<TOPIC>/<slug>.md
    │   ├── A2/<TOPIC>/<slug>.md
    │   ├── B1/<TOPIC>/<slug>.md
    │   └── B2/<TOPIC>/<slug>.md
    └── styles/
        └── main.css

scripts/
└── verify-questions.mjs   # lint every .md through the parser (CI-friendly)
```

---

## Features

Everything the original `blogspot.html` did, but in a single small SPA:

### Free tier

- Choose a CEFR level: **A1, A2, B1 or B2**.
- 5-minute training sprints with a live count-down.
- Five mixed question types (see below) with a "second chance" on the
  first wrong multiple-choice answer.
- Daily streak with up to **3 freezes** and a medal ladder
  (🔥 / 🥉 / 🥈 / 🥇 / 🏆 / 👑).
- Result summary with score, XP earned and "next-step" CTAs.
- Persistent contact form for support requests (demo: logs to console).

### Premium tier

- Topic-focused training across the **A1–B2 curriculum**
  (Artikel, Konjugation, Akkusativ/Dativ/Genitiv, Konjunktiv II, Passiv, …).
- **No time limit** — count-up timer instead of the free 5-minute sprint.
- **Grammar tips** in German, Russian and English, on demand per question.
- **Click-to-translate** dictionary popup for any non-stop-word in the text.
- **Profile dashboard** with XP, level, streak history and topic mastery.
- **Shareable progress card** rendered to a 1080×1080 PNG via Canvas and
  pushed to the OS share sheet through the Web Share API (with a
  download-PNG fallback when sharing is unavailable).

### Levelling

Five proficiency tiers, mirrored from the original page:

| Level | XP threshold | Name              |
| ----- | ------------ | ----------------- |
| 1     | 0            | Anfänger 🌱       |
| 2     | 100          | Lerner 📚         |
| 3     | 300          | Fortgeschritten 🚀 |
| 4     | 700          | Experte 🎯        |
| 5     | 1500         | Meister 👑        |

A topic is considered "mastered" after **50 correct answers** on it
(`useXp.isTopicMastered`).

---

## Question bank — Markdown on disk

All questions live as small Markdown files under
`src/questions/<LEVEL>/<TOPIC>/<slug>.md`. Vite scans the folder at
**build time** via `import.meta.glob`, parses every file through the
tiny frontmatter parser in `src/utils/markdownQuestion.js` and ships the
result inside the production bundle. There is no runtime fetch and no
server round-trip — adding a question is purely a file-system change.

### Folder layout

```
src/questions/
├── A1/
│   ├── ARTIKEL/
│   │   ├── a1-art-1.md
│   │   └── a1-art-2.md
│   ├── AKKUSATIVA1/
│   ├── DATIVA1/
│   ├── PLURAL/
│   └── …
├── A2/
├── B1/
└── B2/
```

- The **level** comes from the first folder (must be `A1`, `A2`, `B1`,
  or `B2`).
- The **topic key** comes from the second folder (uppercase, matches
  the `key` field in `src/data/premiumTopics.js`).
- The file name is purely human-readable — the canonical id lives in
  the frontmatter.

### File format

Each `.md` file is a YAML frontmatter block followed by the question
prompt (free-form text). Four `type` values are supported and they map
1:1 to the four components in `src/components/questions/`:

| `type:`        | UI                | Required frontmatter            |
| -------------- | ----------------- | ------------------------------- |
| `select-one`   | radio buttons     | `options:` (≥2), `correct:` (string) |
| `multi-select` | checkboxes        | `options:` (≥2), `correct:` (string OR list) |
| `dropbox`      | drag-and-drop     | `words:` (≥2). Optional `codes:` for TeKaMoLo |
| `input-text`   | typed answer      | `correct:` (string OR list of accepted strings) |

`hint` is optional on every type — when present it powers the 💡 button
on `input-text` and the post-answer banner on the others.

#### `select-one`

```markdown
---
id: a1-art-1
type: select-one
options:
  - Der
  - Die
  - Das
  - Den
correct: Der
---

___ Tisch ist neu.
```

#### `multi-select`

```markdown
---
id: a2-modal-multi-1
type: multi-select
options:
  - können
  - müssen
  - laufen
  - dürfen
correct:
  - können
  - müssen
  - dürfen
hint: Modalverben drücken eine Modalität aus.
---

Welche der folgenden Verben sind Modalverben?
```

#### `dropbox` (drag & drop)

```markdown
---
id: a1-sort-1
type: dropbox
words:
  - Heute
  - gehe
  - ich
  - ins
  - Kino
---

Ordne die Wörter zum richtigen Satz:
```

#### `input-text` (Lückentext)

```markdown
---
id: a2-fill-1
type: input-text
correct:
  - habe
  - hatte
hint: Perfekt mit haben — ich-Form.
---

Als Kind ___ ich oft im Park gespielt. (haben)
```

### Randomization, topic gating, repeat-on-wrong

- **Randomization** — `AdaptiveQueue` shuffles the question pool once
  per session with Fisher–Yates (`src/utils/random.js`).
- **Repeat-on-wrong** — when the learner answers a question incorrectly
  the queue re-inserts it 2–5 positions deeper so it pops up again
  before the session ends. A question is dropped after 3 wrong attempts
  to avoid an endless loop.
- **Topic gating for Premium** — free users get the entire level pool;
  Premium users can target a specific topic via
  `?level=…&topic=<TOPIC>&mode=premium`. The Trainer reads both fields
  and asks the loader for either `getQuestionsByLevel` or
  `getQuestionsByTopic`.

### Adding a question

1. Pick the right level + topic folder (create the topic folder if it
   does not exist yet — match the `key` from `premiumTopics.js`).
2. Drop a new `.md` file in that folder. Use any slug for the filename.
3. Save. The Vite dev server picks it up via HMR; production builds
   pick it up via the next `npm run build`.
4. Optionally run `npm run questions:verify` to lint every file through
   the parser (great for CI).

---

## Data model & persistence

All persistent state lives in `localStorage` under namespaced keys, exactly
like the original:

| Key                    | Composable     | Shape                                    |
| ---------------------- | -------------- | ---------------------------------------- |
| `lzd_streak_v1`        | `useStreak`    | `{ currentStreak, longestStreak, freezes, activeDays, lastActiveDate }` |
| `lzd_xp_v1`            | `useXp`        | `{ totalXP, topicCorrect: { [TOPIC_KEY]: number } }` |
| `lzd_premium_v1`       | `usePremium`   | `'true' \| null`                          |
| `lzd_premium_meta_v1`  | `usePremium`   | `{ activatedAt, code, deviceId }`        |
| `lzd_basis_v1`         | `usePremium`   | `'true' \| null`                          |
| `lzd_basis_meta_v1`    | `usePremium`   | `{ activatedAt, code, deviceId }`        |

The `useStorage` composable wraps every read/write in `try/catch` so the
app keeps working in private windows or sandboxed iframes where
`localStorage` is unavailable.

---

## Composables

Each composable is a self-contained, reusable piece of logic. They are
single-source-of-truth modules — importing a composable in two different
components shares the same reactive state.

| Composable     | Public surface                                                              |
| -------------- | --------------------------------------------------------------------------- |
| `useStorage`   | `loadJSON`, `saveJSON`, `loadString`, `saveString`, `removeKey`             |
| `useStreak`    | `state`, `recordActivityToday()`, `spendFreeze()`, `medalsFor(n)`           |
| `useXp`        | `state`, `level`, `addXP(n, topicKey?)`, `getLevel(xp)`, `isTopicMastered(topicKey)` |
| `usePremium`   | `isPremium`, `isBasis`, `meta`, `basisMeta`, `activateCode(code)`, `clearPremium()`, `clearBasis()`, `clearAll()` |
| `useTimer`     | `seconds`, `running`, `start({ mode, from })`, `stop()`, `reset()`, `formatMmSs(s)` |

All composables follow the same convention: the first call wires up
storage and returns plain refs / reactive objects, every subsequent call
returns the same shared instance.

---

## Routing

`Vue Router 4` in **hash mode** so the app deploys to subpaths
(`/some/where/#/trainer`) without any server config:

| Path        | Name      | Notes                                                   |
| ----------- | --------- | ------------------------------------------------------- |
| `/`         | `landing` | Default entry point.                                    |
| `/trainer`  | `trainer` | Requires `?level=A1\|A2\|B1\|B2`. Optional `topic=…` and `mode=premium`. |
| `/premium`  | `premium` | Activation form when free; topic picker when premium.   |
| `/profile`  | `profile` | Premium-only mastery dashboard.                         |

Unknown routes redirect to `landing`.

---

## Payments (Stripe + PayPal)

The Premium screen embeds the same checkout flow as the original:
**Stripe-hosted Payment Links** (primary) plus a **PayPal.me fallback**.
No SDKs and no card data ever touch the SPA — both buttons just open
the provider's hosted checkout in a new tab.

After a successful Stripe payment the user is redirected back to the
site with `?stripe_success=1`. `BootstrapHandler.vue` (mounted in
`App.vue`) picks this up, shows the green confirmation banner, strips
the query parameter from the URL and navigates the user to `/premium`
so they can paste in the activation code they received by e-mail.

### Architecture (client ↔ Apps Script)

```
[user] ─ pays at hosted checkout ─► Stripe / PayPal
                                         │ webhook / IPN
                                         ▼
                            ┌─────────────────────────┐
                            │ Google Apps Script       │  ← src/data/payment.js · SCRIPT_URL
                            │ (payments backend)        │
                            │  • generates code         │
                            │  • emails code to buyer   │
                            │  • validateCode endpoint  │
                            │  • magic-link login       │
                            │  • trial-code endpoint    │
                            └────────────┬─────────────┘
                                         │ fetch (GET / POST)
                                         ▼
                              [Vue 3 SPA in browser]
                                src/utils/api.js
```

The backend lives outside this repo as a **Google Apps Script Web
App**. The full source was kept in git history (see `payments-old.js`)
— deploy it once and put the resulting `https://script.google.com/macros/s/.../exec`
URL in `src/data/payment.js → SCRIPT_URL`.

When `SCRIPT_URL` is empty the SPA falls back to a **local demo
activator** (`PREMIUM_*` / `BASIS_*` prefix codes) so everything
remains usable offline.

### Configuring the checkout URLs

All URLs live in **one place** — `src/data/payment.js`:

```js
export const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbw0oS.../exec';
export const STRIPE_LINKS = {
  '1month':   'https://buy.stripe.com/00w7sF80EaP70ih8PsbII00',
  '3months':  'https://buy.stripe.com/bJedR35SwaP76GFaXAbII01',
  '12months': 'https://buy.stripe.com/eVq9ANdkYe1j2qp1n0bII02',
};
export const STRIPE_BASIS_LINK = 'https://buy.stripe.com/6oUfZbft60ate973v8bII03';
export const PAYPAL_HANDLE  = 'lehrermann';
export const PAYPAL_AMOUNTS = { '1month': '19EUR', '3months': '49EUR', '12months': '99EUR' };
```

For **production** you need to:

1. In the **Stripe Dashboard → Payment Links → Create link**, create one
   live (non-test) link per plan and replace the four `https://buy.stripe.com/...`
   URLs above.
2. On each Stripe link, set the **success URL** to
   `https://your-domain/?stripe_success=1` (the param name is
   configurable via `STRIPE_SUCCESS_PARAM`).
3. In the Stripe Dashboard add a **webhook** that POSTs
   `checkout.session.completed` events to the `SCRIPT_URL`. The Apps
   Script generates an activation code and e-mails it to the buyer.
4. Replace `PAYPAL_HANDLE` with your own paypal.me handle (and adjust
   `PAYPAL_AMOUNTS` if you change the prices).
5. Configure PayPal **IPN** to also POST to `SCRIPT_URL`. Same
   behaviour as Stripe: code generated server-side, mailed to payer.

### Activation flows the SPA supports

| Flow                | URL / UI entry                  | What happens client-side                                   |
| ------------------- | ------------------------------- | ---------------------------------------------------------- |
| Paste code          | Premium → "🔑 Aktivierungscode" | `validateCode` against `SCRIPT_URL`. Server returns expiry + 2-hour HMAC session token. |
| One-click deep-link | `…/?activate=<CODE>` (in e-mail)| Stashed in `sessionStorage`; consumed after Magic-Link login finishes. |
| Magic-Link login    | Premium → "✉️ Anmelden mit Email" | `requestMagicLink` POST → user receives `…?mltoken=<TOKEN>` → `validateMagicToken` GET on next load → 7-day session. |
| Free 1-day trial    | Premium → "🎁 1 Tag gratis testen" | `requestTrial` POST → backend e-mails a `TEST1-*` code → user pastes it back in. |
| Stripe redirect     | `…/?stripe_success=1`           | Green banner + auto-nav to `/premium`. |

### Demo activator (no backend)

When `SCRIPT_URL` is empty:

- Codes starting with `PREMIUM_` unlock the Premium tier (e.g. `PREMIUM_DEMO`).
- Codes starting with `BASIS_` unlock the Basis tier (e.g. `BASIS_TEST`).
- The Magic-Link / trial / contact endpoints are hidden.

### Backend API surface (Apps Script)

| Call                        | HTTP                                       | Returns                                                                     |
| --------------------------- | ------------------------------------------ | --------------------------------------------------------------------------- |
| `validateCode`              | `GET ?action=validateCode&code=…&email=…&deviceId=…` | `{ok, expires, sessionToken, sessionExpires}` or `{ok:false, error}` |
| `validateMagicToken`        | `GET ?action=validateMagicToken&token=…&deviceId=…`  | `{ok, email, sessionToken, sessionExpires, isPremium, premiumExpires}`        |
| `requestMagicLink`          | `POST {requestMagicLink, email, deviceId}` | `{ok, message}` (rate-limit: 3 per 10 min per e-mail)                        |
| `requestTrial`              | `POST {requestTrial, email, deviceId}`     | `{ok}` (one per (email, device); emails a `TEST1-*` code)                     |
| `sendContactForm`           | `POST {contactForm, name, email, message, isPremium, page}` | `{ok}`                                          |
| Stripe webhook              | `POST {type:'checkout.session.completed', data:{...}}`      | `'ok'` (writes Codes sheet + e-mails buyer)     |
| PayPal IPN                  | `POST` (form-encoded)                       | `''` (validates with `ipnpb.paypal.com`, then writes Codes sheet)            |

---

## Sharing & dictionary

### Dictionary popup (Premium)

`src/utils/dictionary.js` wraps every non-stop-word in the question
prompt with a clickable `<span>`. Clicking calls the public
[MyMemory translation API](https://mymemory.translated.net/) and shows the
result in a small floating popup (`DictionaryPopup.vue`). Stopwords live in
`src/data/stopwords.js` so common function words don't pollute the UI.

### Share card

`src/utils/shareCard.js` renders a 1080×1080 PNG with the learner's
level, XP, streak and mastered-topic count using the HTML5 Canvas API,
then:

1. Tries `navigator.share({ files: [...] })` (Web Share Level 2 — mobile).
2. Falls back to `navigator.share({ url, title, text })` if files are
   not supported.
3. Falls back to a plain download (`<a download>`) if neither works.

No images leave the device unless the OS share sheet does so.

---

## Coding conventions

- **Comments**: every exported function carries a JSDoc block in the
  Google style — short summary on the first line, blank line, then
  `@param` / `@returns` where applicable. Inline narrating comments are
  kept off; comments explain _why_, not _what_.
- **File naming**: PascalCase for `.vue`, camelCase for `.js`.
- **Imports**: absolute via the `@` alias (`@/components/...`) for any
  cross-folder import; relative for siblings.
- **CSS**: BEM-ish class prefixes (`card`, `card-title`, `small-note`,
  `level-btn`, …). All styles live in `src/styles/main.css` to keep the
  surface area small.
- **No `console.log` in production paths** except where the original
  page intentionally logged (e.g. demo contact submission).

---

## Scripts

| Command                    | What it does                                  |
| -------------------------- | --------------------------------------------- |
| `npm run dev`              | Vite dev server with HMR on `:5173`.          |
| `npm run build`            | Production build → `dist/`.                   |
| `npm run preview`          | Serve the production build locally.           |
| `npm run deploy`           | `vite build && wrangler deploy` (Cloudflare). |
| `npm run questions:verify` | Lint every `src/questions/**/*.md` through the parser. |

---

## Browser support

The rebuild targets evergreen browsers shipped from **2023 onward**:

- Chrome / Edge 110+
- Firefox 110+
- Safari 16+
- Mobile Safari 16+ and Chrome for Android 110+

Vue 3 + Vite handle the ES module / CSS output. No polyfills are
bundled by default.

---

## License

Internal / educational rebuild. See the project root for the original
attribution; the rebuilt source code is provided as-is for the project
owner to license as they see fit.
