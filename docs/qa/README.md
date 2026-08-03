# QA — стабилизационные тесты Der SprachCoach

**Роль:** тестировщик  
**Ветка:** `update_worker_name_to_der-sorach-coach`  
**Дата старта:** 2026-08-01

---

## Цель

Набор автоматических проверок, которые запускаются **после каждой новой фичи** и ловят регрессии до деплоя. Покрывают:

1. **Unit-тесты** — чистая логика (парсер вопросов, очередь, XP, premium-gating, grace period).
2. **Data-тесты** — валидность банка грамматики и Wortschatz.
3. **Build smoke** — сборка не падает, bundle в пределах бюджета.

---

## Быстрый запуск

```bash
# Полный набор стабилизации (рекомендуется перед PR)
npm run test:stabilize

# Только unit-тесты (быстро, ~2 с)
npm run test

# Только банк вопросов
npm run questions:verify
npm run questions:verify:vocab
npm run vocab:verify-sets
npm run ops:verify-manifest
```

---

## Структура

```
tests/
  unit/
    markdownQuestion.test.js   # парсер MD-вопросов (5 типов)
    queue.test.js              # AdaptiveQueue (repeat-on-wrong)
    dedupeQuestions.test.js    # дедупликация по контенту
    random.test.js             # Fisher-Yates shuffle
    xp.test.js                 # пороги уровней XP
    backendGrace.test.js       # offline grace 72h
    premiumAccess.test.js      # gating trainer routes
    gasDeployLog.test.js       # OAuth deploy log + GAS ping classify
    monitorNotify.test.js      # CI notify decisions
    appsscriptManifest.test.js # scope drift (P0-O5)

scripts/
  verify-questions.mjs         # грамматика (~11k файлов)
  verify-vocab-questions.mjs   # Wortschatz + anti-spoiler hints
  verify-vocab-sets.mjs        # vocabularySets.js ↔ папки
  verify-appsscript-manifest.mjs  # GAS oauthScopes (P0-O5)

docs/qa/
  README.md                    # этот файл
  test-matrix.md               # матрица покрытия по фичам
  notes.md                     # рабочие заметки тестировщика
```

---

## Когда запускать

| Событие | Команда |
| ------- | ------- |
| Новые MD-вопросы (грамматика) | `npm run questions:verify` |
| Новый vocab-set / вопросы Wortschatz | `npm run questions:verify:vocab && npm run vocab:verify-sets` |
| Изменения в utils/composables | `npm run test` |
| Любой PR / перед деплоем | `npm run test:stabilize` |

---

## CI

Workflow `.github/workflows/ci.yml` запускает `test:stabilize` на каждый push/PR в `main` и feature-ветки.

Отдельно: `.github/workflows/backend-health.yml` — hourly smoke GAS + Worker (уже есть).

---

## Связанные документы

- [test-matrix.md](./test-matrix.md) — что покрыто, что ещё нужно
- [notes.md](./notes.md) — заметки по ходу работы
- [../system-analysis/05-remediation-plan.md](../system-analysis/05-remediation-plan.md) — P1-1 CI
