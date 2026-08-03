# Executive Summary — Системный анализ Der SprachCoach

## Резюме для руководства

Проект **Der SprachCoach** — зрелый MVP с продуманной бизнес-логикой (Freemium, magic-link auth, cross-device sync), но построенный на **serverless-стеке с жёсткими квотами** (Google Apps Script + Sheets). Для текущей нагрузки (образовательный продукт, ограниченная аудитория) архитектура **работоспособна**. При росте пользовательской базы или расширении функционала без миграции бэкенда система **упрётся в потолок** на нескольких уровнях одновременно.

### Топ-рисков (актуализировано v1.1)

| # | Риск | Влияние | Вероятность |
| - | ---- | ------- | ----------- |
| 1 | **Секреты в репозитории** (`TRAINING_JWT_SECRET`, `WEBHOOK_SECRET`, `SHEET_ID`) | Компрометация Premium-доступа, подделка webhook | Высокая (публичный git) |
| 2 | **Google Apps Script как SPOF** | Полная недоступность auth, платежей, sync | Средняя |
| 3 | **Google Sheets как БД** | Деградация при конкурентных запросах, лимит 10M ячеек | Средняя при росте |
| 4 | **Размер клиентского бандла** (52 MB dist, 11k чанков) | Медленная первая загрузка, плохой UX на мобильных | Высокая при росте контента |
| 5 | **GAS OAuth token expiry (~7d)** | Полный отвал auth/payments/sync; лечится redeploy | Высокая (Testing mode) |
| 6 | **Отсутствие CI для build/deploy** | Регрессии попадают в прод без автоматической проверки | Средняя |

### Сильные стороны

- Минимальный dependency tree (Vue + Router)
- Чёткое разделение: free-контент на клиенте, premium — за Worker API
- Resilient API client с retries и transient error detection
- 72-часовой grace period при недоступности GAS
- Training JWT (30 мин) снижает нагрузку на GAS при premium-тренировках
- Обширный набор audit-скриптов для question bank

---

## Матрица рисков

```
                    ВЛИЯНИЕ
              Низкое    Среднее    Высокое
         ┌─────────┬──────────┬──────────┐
Высокая  │ In-mem  │ Bundle   │ Secrets  │
         │ rate    │ size     │ in git   │
         │ limit   │          │          │
ВЕРОЯТ-  ├─────────┼──────────┼──────────┤
НОСТЬ    │ No unit │ GAS cold │ GAS      │
Средняя  │ tests   │ start    │ outage   │
         ├─────────┼──────────┼──────────┤
Низкая   │ Hash    │ PayPal   │ Stripe   │
         │ routing │ IPN      │ webhook  │
         └─────────┴──────────┴──────────┘
```

---

## Рекомендуемая дорожная карта (кратко)

| Фаза | Срок | Фокус |
| ---- | ---- | ----- |
| **P0 — Краткосрочно** | **1–3 дня** | **OAuth Production + manifest sync (P0-OAuth)** — устранить периодические отвалы GAS |
| P0 — безопасность | 1–2 недели | Ротация секретов, вынос из git |
| **P1 — Краткосрочно** | 1–2 месяца | CI pipeline, grace при OAuth 403, alerting |
| **P2 — Среднесрочно** | 3–6 месяцев | Миграция auth/progress на Cloudflare D1 или Supabase, оптимизация бандла |
| **P3 — Долгосрочно** | 6–12 месяцев | Полноценный backend API, CDN-кэш вопросов, load testing |

Подробный план → [05-remediation-plan.md](./05-remediation-plan.md)

---

## Ключевые метрики (текущее состояние)

| Метрика | Значение |
| ------- | -------- |
| Runtime dependencies | 2 (vue, vue-router) |
| Grammar questions | ~11 034 MD файлов |
| Vocab questions | ~180 MD файлов |
| Production dist size | ~52 MB |
| Server-questions JSON | ~2.9 MB (A1–B2) |
| JS asset chunks в dist | ~11 215 |
| GAS email limit (free Gmail) | 100/день |
| GAS execution limit | 6 мин/вызов |
| Grace period (offline) | 72 часа |
| Device limit per email | 2 |
| Rate limit (Worker) | 120 req/min per IP+device |
