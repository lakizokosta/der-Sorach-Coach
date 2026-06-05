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
9. [Premium activation (demo)](#premium-activation-demo)
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
    │   ├── ContactModal.vue
    │   ├── GrammarTip.vue
    │   ├── DictionaryPopup.vue
    │   └── questions/
    │       ├── QuestionRenderer.vue   # dispatcher
    │       ├── MultipleChoice.vue     # type: 'mc'
    │       ├── DragDrop.vue           # type: 'sort'
    │       ├── FillBlank.vue          # type: 'fill'
    │       ├── LesenMC.vue            # type: 'lesen'
    │       └── Sprachbausteine.vue    # type: 'sprachbausteine'
    ├── composables/
    │   ├── useStorage.js   # safe localStorage wrapper
    │   ├── useStreak.js    # daily streak + freezes + medals
    │   ├── useXp.js        # XP, level, per-topic mastery
    │   ├── usePremium.js   # Premium / Basis status + demo activation
    │   └── useTimer.js     # count-up / count-down timer
    ├── data/
    │   ├── grammarHints.js   # DE / RU / EN explanations
    │   ├── premiumTopics.js  # A1–B2 topic catalogue
    │   ├── stopwords.js      # words that should NOT trigger the dictionary
    │   └── sampleQuestions.js # bundled question bank for all 5 types
    ├── utils/
    │   ├── random.js         # shuffle + varied-queue builder
    │   ├── dictionary.js     # MyMemory lookup + word wrapping
    │   └── shareCard.js      # Canvas → PNG → Web Share / download
    └── styles/
        └── main.css
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

## Question types

Every question is a plain JavaScript object. The shared shape is:

```js
{
  id: 'a1-mc-1',
  type: 'mc' | 'sort' | 'fill' | 'lesen' | 'sprachbausteine',
  level: 'A1',
  topic: 'artikel',        // optional, used for topic-focused training
  prompt: '…',             // markdown-free plain text shown above the choices
  // type-specific fields below…
}
```

### `mc` — Multiple choice

```js
{ type: 'mc', prompt: '___ ist mein Buch.', options: ['Der', 'Die', 'Das'], answer: 'Das' }
```

The component shuffles `options`, lets the user pick, and emits
`first-wrong` on a first incorrect choice (so the user gets a hint and a
second chance) and `answer` once the question is fully resolved.

### `sort` — Drag & drop ordering

```js
{ type: 'sort', prompt: 'Ich · gehe · ins · Kino', words: [...], correctOrder: [0,1,2,3] }
```

### `fill` — Lückentext

```js
{ type: 'fill', prompt: 'Ich ___ (gehen) nach Hause.', answer: 'gehe', alternatives: ['gehe'] }
```

Comes with a virtual German keyboard for `ä ö ü ß`, plus
case-insensitive matching against `answer` + `alternatives`.

### `lesen` — Reading comprehension

```js
{ type: 'lesen', text: '…', questions: [ { q: '…', options: [...], answer: '…' } ] }
```

### `sprachbausteine` — Inline dropdowns

```js
{
  type: 'sprachbausteine',
  parts: [
    { text: 'Ich ' },
    { gap: true, options: ['gehe','geht','gehst'], answer: 'gehe' },
    { text: ' nach Hause.' },
  ],
}
```

A bundled question set covers all five types for every CEFR level — see
`src/data/sampleQuestions.js`. Drop new questions into the same file
(or fetch them from an API and feed the same shape into `Trainer.vue`)
and the trainer picks them up automatically.

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

## Premium activation (demo)

The original page integrates Stripe + PayPal via a Google Apps Script
backend. The rebuild ships a **demo activator** so the project is
self-contained.

In `src/composables/usePremium.js`:

- Codes starting with `PREMIUM_` unlock the Premium tier.
- Codes starting with `BASIS_` unlock the (cheaper) Basis tier.
- Any other code is rejected with a friendly error.
- No network calls are ever made.

For a real deployment, replace `activateCode()` with a `fetch()` to your
billing backend — the rest of the app already reacts to `isPremium` and
`isBasis` everywhere.

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

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Vite dev server with HMR on `:5173`.          |
| `npm run build`   | Production build → `dist/`.                   |
| `npm run preview` | Serve the production build locally.           |

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
