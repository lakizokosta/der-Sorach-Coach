# Матрица тестов

Обновляется по мере появления новых фич. Статусы: ✅ автоматизировано · 🟡 частично · ⬜ не покрыто.

---

## Ядро приложения

| Область | Тест | Статус | Файл |
| ------- | ---- | ------ | ---- |
| Парсер MD-вопросов | 5 типов, ошибки, vocab metadata | ✅ | `tests/unit/markdownQuestion.test.js` |
| Очередь вопросов | shuffle, repeat-on-wrong, dedupe | ✅ | `tests/unit/queue.test.js` |
| Дедупликация | fingerprint по типу | ✅ | `tests/unit/dedupeQuestions.test.js` |
| Shuffle | Fisher-Yates, immutability | ✅ | `tests/unit/random.test.js` |
| XP / уровни | пороги 0→4000+ | ✅ | `tests/unit/xp.test.js` |
| Premium gating | mode/topic/set routing | ✅ | `tests/unit/premiumAccess.test.js` |
| Backend grace | transient errors, OAuth 403/HTML grace (P1-8), 72h snapshot | ✅ | `tests/unit/backendGrace.test.js` |
| GAS client response | 403 vs HTML login (P1-9) | ✅ | `tests/unit/gasResponse.test.js` |
| GAS OAuth monitor | deploy log, ping classify, latency budget | ✅ | `tests/unit/gasDeployLog.test.js` |
| Monitor notify | e-mail triggers, exit codes, GAS-down skip | ✅ | `tests/unit/monitorNotify.test.js` |
| GAS manifest | scope drift prevention (P0-O5) | ✅ | `tests/unit/appsscriptManifest.test.js` |
| Streak | freeze, medals, calendar | ⬜ | — |
| Timer | count-up/down | ⬜ | — |
| Progress sync | merge, debounce | ⬜ | — |
| Router guards | premium redirect | ⬜ | — |

---

## Банк вопросов

| Область | Тест | Статус | Команда |
| ------- | ---- | ------ | ------- |
| Грамматика (~11k) | parse all MD | ✅ | `npm run questions:verify` |
| Wortschatz (~180+) | parse + anti-spoiler hints | ✅ | `npm run questions:verify:vocab` |
| Vocab catalogue | JS ↔ filesystem | ✅ | `npm run vocab:verify-sets` |
| Duplicate distractors | ambiguous options | 🟡 | `npm run questions:audit-ambiguous-distractors` |
| Input-text hints | informative check | 🟡 | `npm run questions:audit-informative` |

---

## Wortschatz (активная разработка)

| Set | A1 | Вопросов | Покрытие |
| --- | -- | -------- | -------- |
| EINKAUFEN | ✅ | 60 | verify + catalogue |
| SICH_VORSTELLEN | ✅ | 60 | verify + catalogue |
| MEINE_FAMILIE | ✅ | 60 | verify + catalogue |
| MEINE_WOHNUNG | ✅ | 60 | verify + catalogue |

**Регрессии, пойманные тестами:**
- Hint не должен содержать correct-ответ (input-text / select-one) — `verify-vocab-questions.mjs`
- Каждый set в `vocabularySets.js` ↔ папка на диске

---

## Build & deploy

| Область | Тест | Статус | Команда |
| ------- | ---- | ------ | ------- |
| Production build | vite build | ✅ | `npm run build` |
| Bundle size | ≤ 60 MB | ✅ | CI step |
| Backend smoke | GAS + Worker | ✅ | `npm run backend:verify` (hourly CI) |
| GAS monitor | OAuth expiry, 403, latency | ✅ | `npm run backend:monitor` (hourly CI) |
| GAS manifest | oauthScopes + webapp access | ✅ | `npm run ops:verify-manifest` |

---

## Backlog (следующие итерации)

1. **Streak composable** — unit-тесты freeze/medals с mock premium
2. **inputTextInfinitive** — не показывать «die» как инфинитив
3. **E2E smoke** — Playwright: landing → trainer (free) → summary
4. **Component tests** — QuestionRenderer dispatch по type
5. **i18n** — ключи de/en/ru синхронизированы
