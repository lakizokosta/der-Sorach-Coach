# Заметки разработчика

Хронология работы в форке. Изменения **не затрагивают main/прод** до отдельного merge и review.

**Ветка:** `update_worker_name_to_der-sorach-coach`  
**Роль:** разработчик  
**Дата старта:** 2026-08-01

---

## Контекст

- Системный анализ: [docs/system-analysis/](../system-analysis/README.md) — риски P0–P3
- QA-инфраструктура: [docs/qa/](../qa/README.md) — unit-тесты, verify-скрипты, CI
- Ограничение: **не менять runtime prod-приложения** — только инфраструктура, контент vocab, документация

---

## 2026-08-01 — Старт работы в форке

### Изучено

| Документ | Ключевые выводы |
| -------- | --------------- |
| `00-executive-summary.md` | Топ-риски: secrets in git, bundle 52 MB, нет CI build/deploy |
| `05-remediation-plan.md` | P0 secrets — **отложено** (требует ротации + deploy, затронет prod) |
| `docs/qa/README.md` | `test:stabilize` — единая команда перед PR |
| `docs/qa/notes.md` | 2 vocab hint-дефекта уже исправлены тестировщиком |

### Выполнено (безопасно для prod)

| ID | Задача | Статус | Комментарий |
| -- | ------ | ------ | ----------- |
| P1-1 | CI: build + verify + size budget | ✅ | `.github/workflows/ci.yml` |
| P0-3 | `.dev.vars` в `.gitignore` | ✅ | уже на ветке |
| P0-3 | `.dev.vars.example` | ✅ | шаблон для локальной разработки |
| QA | Unit-тесты (49) | ✅ | `npm run test` |
| QA | Verify grammar (11034) | ✅ | `npm run questions:verify` |
| QA | Verify vocab (180) | ✅ | `npm run questions:verify:vocab` |
| QA | Vocab catalogue sync | ✅ | `npm run vocab:verify-sets` |
| QA | Build smoke | ✅ | dist 52 MB ≤ 60 MB budget |
| Content | `a1-eink-in-009.md` hint | ✅ | убран spoiler «Gemüse» |
| Content | `a1-fam-in-010.md` hint | ✅ | убран spoiler «Oma» |

### Намеренно отложено (затронет prod)

| ID | Задача | Причина |
| -- | ------ | ------- |
| P0-1 | Ротация секретов | Требует deploy GAS + CF, invalidate старых |
| P0-2 | Удалить secrets из `wrangler.toml` | Сломает deploy без предварительного `wrangler secret put` |
| P0-4 | Очистка git history | Force push, согласование с owner |
| P2-1 | Topic-level JSON chunks | Архитектурный рефакторинг loading |

### Результаты stabilize

```
npm run test:stabilize  →  49 passed, 11034+180 verify OK
npm run build           →  ✓ built, 52 MB
```

### Следующие шаги (после merge в main)

1. P0-O1..O4 — OAuth Production в GCP Console (ручные шаги, см. apps-script/README.md §7)
2. P0-1/P0-2 — secret rotation runbook + staging deploy
3. Playwright E2E smoke (QA backlog P2)
4. Streak/timer unit-тесты

---

## 2026-08-01 (вечер) — OAuth incident: P1-8/P1-9/P0-O6

### Контекст

- Аналитик v1.1: [06-backend-outage-investigation.md](../system-analysis/06-backend-outage-investigation.md)
- Тестировщик добавил +26 unit-тестов (GAS monitor, manifest, OAuth grace)
- Задачи P0-O1..O4 — GCP Console, **не в коде**

### Реализовано

| ID | Задача | Файлы |
| -- | ------ | ----- |
| P1-9 | Различать 403 vs HTML login page | `src/utils/gasResponse.js`, `api.js` |
| P1-8 | OAuth grace + специфичный banner | `usePremium.js`, `backendGrace.js` |
| P0-O6 | Deploy runbook + manifest sync | `apps-script/README.md`, `.cursor/rules/` |
| P0-O7 | Baseline инцидента | `docs/ops/gas-deploy-log.json` |
| QA | Unit-тесты gasResponse | `tests/unit/gasResponse.test.js` (+10) |

### Результаты stabilize

```
npm run test:stabilize  →  85 passed (12 files)
```

### Не затронуто (prod-safe)

- `wrangler.toml` secrets — без изменений
- GAS OAuth Production — требует ручного шага в GCP

---

## Шаблон для следующих записей

```markdown
## YYYY-MM-DD — [краткое описание]

### Изменения
- ...

### Тесты
- [ ] test · [ ] verify · [ ] build

### Риски для prod
- ...
```
