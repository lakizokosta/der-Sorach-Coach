# Заметки тестировщика

Хронология работы над стабилизацией. Дополняется после каждой сессии.

---

## 2026-08-01 (вечер) — Обновления аналитика (GAS OAuth incident)

### Контекст

- Аналитик: [06-backend-outage-investigation.md](../system-analysis/06-backend-outage-investigation.md), remediation v1.1
- Root cause: OAuth token expiry в GAS Testing mode (~7 дней)
- Новая инфраструктура: `monitor-gas-backend.mjs`, `notify-monitor.mjs`, `gas-deploy-log.json`

### Добавленные тесты (+25 unit)

| Файл | Покрытие |
| ---- | -------- |
| `gasDeployLog.test.js` | parseDeployLog, assessOAuthDeployStatus, classifyGasPingResponse, assessGasLatency |
| `monitorNotify.test.js` | shouldSendMonitorEmail, isGasMonitorDown, monitorExitCode |
| `appsscriptManifest.test.js` | oauthScopes, webapp access (P0-O5) |
| `backendGrace.test.js` | +isOAuthBackendError, OAuth 403 → transient (P1-8) |

### Код (P1-8)

- `backendGrace.js`: `isOAuthBackendError()` — OAuth 403 теперь transient → grace 72h сохраняет Premium
- `gasDeployLog.js`, `monitorNotify.js` — логика вынесена из scripts для тестируемости

### Verify

- `scripts/verify-appsscript-manifest.mjs` — scope drift check
- `npm run ops:verify-manifest` добавлен в `test:stabilize`

---

## 2026-08-01 — Первичный аудит и набор тестов

### Контекст

- Ветка `update_worker_name_to_der-sorach-Coach` — активная разработка Wortschatz (A1: 4 set × 60 вопросов).
- Unit-тестов не было; только скрипты `questions:verify` и `backend:verify`.
- Системный анализ ([05-remediation-plan.md](../system-analysis/05-remediation-plan.md)) рекомендует CI: build + verify.

### Наблюдения

1. **Парсер вопросов** (`markdownQuestion.js`) — критический путь: один баг ломает весь банк. Приоритет №1 для unit-тестов.
2. **AdaptiveQueue** — repeat-on-wrong и MAX_ATTEMPTS=3 — ключевое UX-поведение тренажёра.
3. **Wortschatz отделён** от грамматики (`questions-vocab/` vs `questions/`), но verify-скрипт покрывал только грамматику.
4. **Недавний фикс** (коммит `85b1f3db`): hints в vocab не должны раскрывать ответ — добавлена проверка в `verify-vocab-questions.mjs`.
5. **Premium gating** расширен mode=vocab — покрыт в `premiumAccess.test.js`.
6. **Bundle ~52 MB** — build smoke + size budget в CI.

### Что создано

- Vitest + happy-dom
- 8 unit-test файлов (см. `tests/unit/`)
- `scripts/verify-vocab-questions.mjs` — parse + anti-spoiler
- `scripts/verify-vocab-sets.mjs` — catalogue sync
- `npm run test:stabilize` — единая команда
- `.github/workflows/ci.yml`
- Документация: README, test-matrix, notes

### Найденные дефекты (исправлены в этой сессии)

| Файл | Проблема | Статус |
| ---- | -------- | ------ |
| `a1-eink-in-009.md` | hint содержал «Gemüse» (= correct) | ✅ исправлен |
| `a1-fam-in-010.md` | hint содержал «Oma» (= correct) | ✅ исправлен |
| `a1-vor-in-006.md` | ложное срабатывание на «beruf» ⊂ «beruflich» | ✅ checker уточнён (word boundary) |

### Открытые риски

| Риск | Приоритет | Действие |
| ---- | --------- | -------- |
| Нет E2E — UI-регрессии не ловятся | P2 | Playwright smoke |
| Streak/timer без unit-тестов | P2 | Следующая итерация |
| Vue-компоненты не тестируются | P2 | @vue/test-utils |
| 7 npm audit vulnerabilities | P3 | `npm audit fix` отдельным PR |

### Чеклист после новой фичи (для агента-разработчика)

- [ ] `npm run test` — unit-тесты зелёные
- [ ] Если добавлены MD-вопросы → `questions:verify` или `questions:verify:vocab`
- [ ] Если новый vocab-set → обновить `vocabularySets.js` + `vocab:verify-sets`
- [ ] `npm run test:stabilize` перед PR

---

## Шаблон для следующих записей

```markdown
## YYYY-MM-DD — [краткое описание фичи/сессии]

### Что тестировали
- ...

### Найденные баги
- ...

### Добавленные/обновлённые тесты
- ...

### Статус stabilize
- [ ] test · [ ] verify · [ ] build
```

---

## 2026-08-01 — Разработчик: stabilize в форке

### Контекст

- Разработчик подключился после первичного набора тестов.
- Ограничение: изменения не затрагивают prod (`main`) — P0 secrets отложены.

### Проверено разработчиком

| Команда | Результат |
| ------- | --------- |
| `npm run test` | ✅ 49/49 |
| `npm run questions:verify` | ✅ 11034 files |
| `npm run questions:verify:vocab` | ✅ 180 files |
| `npm run vocab:verify-sets` | ✅ 4 A1 sets |
| `npm run build` | ✅ 52 MB ≤ 60 MB |

### Добавлено

- `docs/dev/notes.md` — журнал разработчика
- `.dev.vars.example` — шаблон для P0-3 (локальный dev без secrets в git)

### Статус stabilize

- [x] test · [x] verify · [x] build

---

## 2026-08-01 (вечер) — Разработчик: OAuth P1-8/P1-9

### Реализовано разработчиком

| ID | Изменение |
| -- | --------- |
| P1-9 | `gasResponse.js` — 403 vs HTML login; интеграция в `api.js` |
| P1-8 | OAuth-specific degraded banner; HTML login → transient grace |
| P0-O6 | Deploy runbook: manifest sync + OAuth checklist |
| P0-O7 | `gas-deploy-log.json` — baseline инцидента |

### Тесты

| Команда | Результат |
| ------- | --------- |
| `npm run test` | ✅ 85/85 (+10 gasResponse) |
| `npm run test:stabilize` | ✅ all green |

### Статус stabilize

- [x] test · [x] verify · [x] build
