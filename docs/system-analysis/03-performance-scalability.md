# Производительность и масштабируемость

## Текущие метрики

| Метрика | Значение | Порог concern |
| ------- | -------- | ------------- |
| Production `dist/` | **52 MB** | > 5 MB initial |
| JS asset chunks | **11 215** | > 100 |
| `server-questions/` JSON | **2.9 MB** | > 10 MB Worker limit |
| Grammar questions (MD) | ~11 034 | Linear growth |
| Vocab questions (MD) | ~180 | Growing |
| Runtime deps | 2 | OK |

---

## Узкие места (Bottlenecks)

### BOT-001: Размер клиентского бандла 🔴

**Проблема:** Vite создаёт отдельный lazy chunk для каждого Markdown-вопроса через `import.meta.glob`. При ~11k вопросов → ~11k JS файлов в `dist/assets/`.

**Влияние:**
- Медленный `npm run build` и deploy
- Cloudflare asset count limits
- Первый заход на уровень = множество HTTP requests (mitigated HTTP/2, но mobile 3G страдает)
- Dev HMR замедляется при редактировании questions

**Файлы:** `src/data/questions.js`, `vite.config.js`

**Решения:**
1. **Краткосрочно:** Group questions per topic into single JSON at build time (как `server-questions/`)
2. **Среднесрочно:** Level-wide JSON chunks (A1.json, A2.json) для free tier
3. **Долгосрочно:** Serve free questions через Worker API с CDN cache

### BOT-002: Google Apps Script quotas 🔴

**Лимиты GAS (consumer account):**

| Quota | Limit |
| ----- | ----- |
| Script runtime | 6 min/execution |
| Triggers total runtime | 90 min/day |
| UrlFetch calls | 20,000/day |
| Email (MailApp) | **100/day** (free Gmail) |
| Concurrent executions | ~30 |

**Критический bottleneck:** 100 emails/day. При >100 новых покупок или magic-link requests в день — emails не отправляются.

**Решение:** Google Workspace (1,500 emails/day) или внешний email service (SendGrid, Resend).

### BOT-003: Google Sheets как database 🟡

**Проблемы:**
- Linear row scan для validateCode, session lookup
- No indexes, no transactions
- Concurrent writes могут conflict
- 10 million cell limit

**Оценка capacity:** ~10,000 activation codes + ~5,000 active sessions — OK. При 100k+ users — деградация.

**Решение:** Миграция на Cloudflare D1, Supabase Postgres, или Firebase.

### BOT-004: GAS cold start latency 🟡

**Проблема:** GAS Web App cold start 1–5+ секунд.

**Текущая митигация:**
- API retries (2 attempts, 700ms backoff) в `api.js`
- Training JWT (30 min) — Worker не вызывает GAS при каждом question fetch
- 72h grace period

**Измерение:** `/api/health` возвращает `latencyMs` — использовать для monitoring.

### BOT-005: Worker in-memory caches 🟡

**Файлы:** `worker/index.js`

| Cache | Scope | Issue |
| ----- | ----- | ----- |
| `levelCache` | Per-isolate | OK — read-only data |
| `rateBuckets` | Per-isolate | Not shared across instances |

**Решение:** Cloudflare KV для rate limiting.

### BOT-006: Premium question bundle in Worker 🟡

**Текущий размер:** 2.9 MB (4 JSON files). Worker script size limit: 10 MB (free), 50 MB (paid).

**Projection:** При 50k questions → ~15 MB — превысит free tier limit.

**Решение:** R2 binding для question JSON; lazy load per level.

### BOT-007: Progress sync — write amplification 🟡

**Файл:** `src/composables/useProgressSync.js`

Debounced push on every XP/streak change. Active user → frequent GAS writes → Sheets quota.

**Решение:** Increase debounce interval; batch writes; write-on-session-end only.

---

## Масштабируемость по компонентам

```
                    Текущая        1k users       10k users      100k users
                    capacity
─────────────────────────────────────────────────────────────────────────
Cloudflare Worker   ✅ Unlimited   ✅             ✅             ✅
Cloudflare Assets   ✅ CDN         ✅             ✅             ⚠️ 52MB×N
GAS executions      ⚠️ ~30 conc    ⚠️ Timeouts    🔴 Quota       🔴 Blocked
Gmail sending       🔴 100/day     🔴             🔴             🔴
Google Sheets       ✅ <10k rows   ✅             ⚠️ Slow scans  🔴
Client bundle       ⚠️ 52MB        ⚠️             🔴             🔴
```

---

## Рекомендации по оптимизации (приоритет)

### Quick wins (< 1 week)

1. **Topic-level JSON chunks** для free tier вместо per-question chunks
2. **Compress server-questions** — gzip уже на CDN, но pre-minify JSON
3. **Increase progress push debounce** — с 1s до 30s
4. **Google Workspace** — поднять email limit

### Medium term (1–3 months)

1. **Cloudflare KV** для rate limiting и session cache
2. **Build CI** с bundle size budget (fail if > threshold)
3. **Lazy load dictionary** — split by letter/frequency
4. **Service Worker** для offline caching critical assets

### Long term (3–12 months)

1. **Backend migration** — D1/Postgres для auth, codes, progress
2. **Question CDN** — R2 + signed URLs
3. **Edge caching** premium questions per topic
4. **Load testing** — k6/Artillery scripts

---

## Мониторинг (рекомендуемые метрики)

| Metric | Source | Alert threshold |
| ------ | ------ | --------------- |
| GAS latency | `/api/health` | > 3000ms |
| GAS error rate | CI hourly + CF analytics | > 5% |
| Worker 429 rate | CF analytics | > 1% requests |
| Build size | CI artifact | > 60 MB |
| Email send failures | GAS Executions log | Any failure |
| Active sessions count | Sheets row count | > 5000 |
