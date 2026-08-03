# План исправлений

**Версия:** 1.1  
**Дата:** 2026-08-01  
**Статус:** Draft — дополнен после расследования периодических отвалов GAS  
**Источник инцидента:** [06-backend-outage-investigation.md](./06-backend-outage-investigation.md)

---

## Контекст обновления v1.1

Обнаружена **активная production-проблема**: GAS Web App периодически возвращает HTTP 403 из‑за истечения OAuth-токена владельца скрипта. Redeploy с re-consent временно восстанавливает работу.

**Приоритет сдвинут:** задачи **P0-OAuth** выполняются **раньше** ротации секретов — они устраняют текущие пользовательские сбои без изменения prod-секретов.

| Симптом | Root cause | Задачи плана |
| ------- | ---------- | ------------ |
| Бэкенд «отваливается» ~раз в неделю | OAuth Testing mode / unverified app | P0-O1, P0-O2 |
| Помогает только redeploy + «доступ ко всему» | Re-consent выдаёт новый refresh token | P0-O3, P0-O4 |
| Пользователи сразу теряют Premium | 403 не покрывается grace period | P1-8, P1-9 |
| Latency `/api/health` > 3s | GAS cold start + full sheet scan | P2-8, P2-9 |

---

## Фазы реализации

### Фаза P0-OAuth — Стабилизация GAS (1–3 дня) ⚡ ПРИОРИТЕТ

> Устраняет периодические отвалы **без** миграции backend и **без** ротации секретов.  
> Выполняется в Google Cloud Console + script.google.com, код приложения не обязателен.

| ID | Задача | Effort | Где | Критерий готовности |
| -- | ------ | ------ | --- | ------------------- |
| P0-O1 | **OAuth consent → Production** | 30m | GCP Console | Publishing status = In production |
| P0-O2 | **Заполнить OAuth branding** | 1h | GCP Console | Privacy Policy URL + App homepage (можно ссылка на `/legal` на сайте) |
| P0-O3 | **Проверить GCP project linkage** | 15m | script.google.com → Settings | Один GCP project, не «default» без branding |
| P0-O4 | **Re-deploy + re-auth с правильного аккаунта** | 30m | script.google.com | Деплой только как `lakizo.kosta@gmail.com`; Run `validateCode` → consent OK |
| P0-O5 | **Синхронизировать `appsscript.json`** | 15m | Apps Script editor | Manifest scopes = repo; `webapp.access = ANYONE_ANONYMOUS` |
| P0-O6 | **Обновить deploy runbook** | 1h | `apps-script/README.md`, `.cursor/rules/` | Checklist OAuth + manifest sync при каждом деплое |
| P0-O7 | **Зафиксировать baseline инцидента** | 30m | `docs/system-analysis/` | Дата последнего отвала, latency, статус OAuth screen |

#### P0-O1: Пошагово

1. script.google.com → Project Settings → скопировать **GCP Project Number**
2. console.cloud.google.com → OAuth consent screen
3. Если **Testing** → Publish App → **In production**
4. Добавить test users не нужно в Production (доступ для всех пользователей Web App)
5. Deploy → Manage deployments → Edit → New version → Deploy → пройти consent

#### P0-O5: Manifest sync (при каждом деплое Code.gs)

```
apps-script/appsscript.json  →  script.google.com → Project Settings
                                 → Show appsscript.json → paste scopes + webapp block
```

Scopes должны совпадать:

```json
"oauthScopes": [
  "https://www.googleapis.com/auth/script.external_request",
  "https://www.googleapis.com/auth/script.send_mail",
  "https://www.googleapis.com/auth/spreadsheets"
]
```

---

### Фаза P0 — Критические исправления безопасности (1–2 недели)

> Блокеры безопасности. Можно параллельно с P0-OAuth, но **не блокирует** стабилизацию GAS.

| ID | Задача | Effort | Файлы | Критерий готовности |
| -- | ------ | ------ | ----- | ------------------- |
| P0-1 | **Ротация всех секретов** | 2h | GAS, Stripe, CF | Новые secrets deployed, старые invalidated |
| P0-2 | **Вынести secrets из git** | 4h | `wrangler.toml`, `Code.gs` | Secrets только в CF Secrets + GAS Properties |
| P0-3 | **Добавить `.dev.vars` в `.gitignore`** | 15m | `.gitignore` | Local dev через `.dev.vars.example` |
| P0-4 | **Очистить git history от secrets** | 2h | git | BFG/filter-repo, force push с согласия |
| P0-5 | **Документировать secret rotation runbook** | 1h | `docs/` | Runbook в repo |

#### P0-2: Детали реализации

**Cloudflare Workers:**
```bash
# Удалить [vars] TRAINING_JWT_SECRET из wrangler.toml
wrangler secret put TRAINING_JWT_SECRET
wrangler secret put SCRIPT_URL  # optional, если не в vars
```

**Google Apps Script:**
```javascript
// Code.gs — заменить hardcoded constants:
function getSecret_(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}
const WEBHOOK_SECRET = getSecret_('WEBHOOK_SECRET');
```

**wrangler.toml (после):**
```toml
[vars]
# Только non-secret config
# SCRIPT_URL можно оставить — это public URL
```

---

### Фаза P1 — CI/CD, мониторинг, resilience (2–4 недели)

| ID | Задача | Effort | Критерий готовности |
| -- | ------ | ------ | ------------------- |
| P1-1 | **CI: build + questions:verify** | 4h | PR checks pass/fail на broken questions |
| P1-2 | **CI: bundle size budget** | 2h | Fail if dist > 60 MB |
| P1-3 | **CI: deploy to CF on main merge** | 4h | Automated deploy с secrets из GH |
| P1-4 | **Alerting на health check failure** | 2h | Slack/email при hourly failure |
| P1-5 | **Cloudflare KV rate limiting** | 4h | Shared rate limit across instances |
| P1-6 | **npm audit в CI** | 1h | Weekly dependency scan |
| P1-7 | **CSP headers** | 2h | Content-Security-Policy via CF Transform Rules |
| **P1-8** | **403 OAuth → grace period (client)** | 3h | OAuth 403 не logout'ит; grace 72h + banner «Backend vorübergehend» |
| **P1-9** | **Detect GAS 403 vs HTML login page** | 2h | `api.js`: отличать JSON 403 от HTML redirect; точное сообщение в UI |
| **P1-10** | **Health check: latency threshold + 403 probe** | 2h | CI fail if latency > 8s или HTTP 403 |
| **P1-11** | **Incident log + e-mail runbook** | 1h | `docs/runbooks/gas-monitoring.md` |
| **P1-12** | **E-mail alerts (GAS + SMTP fallback)** | ✅ | Daily 07:00 UTC + hourly; dedup 1/day |

#### P1-8: Grace при OAuth 403 (детали)

**Проблема:** `backendGrace.js` явно исключает 403 → при OAuth-отвале пользователь теряет Premium и session.

**Изменения:**

```javascript
// backendGrace.js — новая функция
export function isOAuthBackendError(res) {
  if (!res || res.ok) return false;
  const err = String(res.error || '');
  return /403|Backend-Zugriff verweigert|Access Denied/i.test(err);
}

// usePremium.js — refreshEntitlementsFromServer()
// if (isOAuthBackendError(magicRes)) → transientFailure = true (не logout)
```

**Критерий:** при симуляции 403 (mock) пользователь остаётся Premium через grace snapshot.

#### P1-10: Расширенный health check (draft)

```yaml
# .github/workflows/backend-health.yml — дополнение
- name: Check GAS latency budget
  run: |
    LATENCY=$(curl -s https://lernziel-deutsch.de/api/health | jq .latencyMs)
    if [ "$LATENCY" -gt 8000 ]; then exit 1; fi

- name: Check GAS not 403
  run: node scripts/check-backend-url.mjs
```

#### P1-1: GitHub Actions workflow (draft)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run questions:verify
      - run: npm run build
      - name: Check bundle size
        run: |
          SIZE=$(du -sm dist | cut -f1)
          if [ "$SIZE" -gt 60 ]; then exit 1; fi
```

---

### Фаза P2 — Производительность и масштаб (1–3 месяца)

| ID | Задача | Effort | Impact | Критерий готовности |
| -- | ------ | ------ | ------ | ------------------- |
| P2-1 | **Topic-level JSON для free tier** | 1w | 🔴 Bundle size | dist < 10 MB |
| P2-2 | **Google Workspace для email** | 1d | 🔴 Email limit | 1500 emails/day |
| P2-3 | **Stripe webhook proxy через Worker** | 3d | 🟡 Security | HMAC verification |
| P2-4 | **Sheets backup automation** | 2d | 🟡 Resilience | Daily export to Drive/R2 |
| P2-5 | **Progress sync debounce 30s** | 2h | 🟡 GAS quota | Reduced write frequency |
| P2-6 | **Premium API pagination** | 1d | 🟡 Content leak | Max 50 questions/request |
| P2-7 | **Service Worker offline cache** | 3d | 🟢 UX | Core assets cached |
| **P2-8** | **Sheets: cleanup старых Magic/Sessions строк** | 4h | 🟡 GAS perf | Scheduled trigger раз в сутки; latency p95 < 3s |
| **P2-9** | **Sheets: rate limit через CacheService** | 3h | 🟡 GAS perf | `rateLimitOk_()` не сканирует весь лист Magic |
| **P2-10** | **OAuth monitoring cron (GAS trigger)** | 2h | 🟡 Ops | Ежедневный ping `sheet_('Codes')` → email admin при fail |

#### P2-8: Cleanup trigger (draft)

```javascript
// Code.gs — новая функция + time-driven trigger
function cleanupExpiredRows_() {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 days
  // Magic: delete rows where expiresAt < cutoff
  // Sessions: delete rows where expiresAt < now
  // MagicSessions: delete rows where expiresAt < now - 7 days
}
```

#### P2-1: Topic-level chunks (архитектура)

```
Текущее:  src/questions/A1/ARTIKEL/a1-art-so-001.md → dist/assets/a1-art-so-001-xxx.js
Целевое:  scripts/build-free-questions.mjs → dist/data/A1-ARTIKEL.json
          src/data/questions.js → fetch('/data/A1-ARTIKEL.json')
```

Ожидаемый результат: ~200 JSON files вместо ~11,000 JS chunks.

---

### Фаза P3 — Backend migration (3–12 месяцев)

> **Конечная цель:** полностью убрать зависимость от GAS OAuth и Sheets SPOF.

| ID | Задача | Effort | Impact |
| -- | ------ | ------ | ------ |
| P3-1 | **Cloudflare D1 для codes/sessions** | 2w | Убирает Sheets bottleneck + OAuth SPOF |
| P3-2 | **D1 для progress sync** | 1w | Faster reads/writes |
| P3-3 | **R2 для question bank** | 1w | Unlimited question storage |
| P3-4 | **Transactional email (Resend/SendGrid)** | 3d | Reliable email delivery |
| P3-5 | **GDPR: data export/deletion API** | 1w | Compliance |
| P3-6 | **Load testing suite (k6)** | 3d | Capacity planning |
| P3-7 | **Deprecate GAS backend** | 2w | Single deploy target; **нет periodic OAuth redeploy** |

#### P3-1: Target architecture

```
Browser → Cloudflare Worker (API + SPA)
              ├── D1 (auth, codes, sessions, progress)
              ├── R2 (question JSON)
              ├── KV (rate limits, JWT blacklist)
              └── Email Worker (Resend binding)

Stripe → Worker (HMAC verify) → D1 (create code) → Email Worker
```

**Мотивация после инцидента:** GAS «Execute as: Me» = single OAuth owner = periodic failure mode. D1 + Worker secrets не имеют 7-day token expiry.

---

## Обновлённая дорожная карта

```
Неделя 1          Недели 2–4         Месяцы 2–4          Месяцы 6–12
─────────         ──────────         ──────────          ───────────
P0-OAuth ⚡       P0 secrets         P2 perf             P3 D1 migration
(Production,      P1 CI + grace      Sheets cleanup      Deprecate GAS
 manifest sync)   P1 alerting        Bundle optimize     No OAuth SPOF
```

---

## Матрица приоритетов (v1.1)

```
                    IMPACT
              Low      Medium       High
         ┌──────────┬───────────┬────────────┐
Высокая  │ P2-7     │ P1-8      │ P0-O1..O4  │ ← OAuth fix
         │ P1-6     │ P2-8      │ P0-1..4    │
ВЕРОЯТ-  ├──────────┼───────────┼────────────┤
НОСТЬ    │ P2-10    │ P1-4      │ P1-1       │
Средняя  │ P2-4     │ P1-10     │ P2-1       │
         ├──────────┼───────────┼────────────┤
Низкая   │ P3-6     │ P3-5      │ P3-1       │
         └──────────┴───────────┴────────────┘
                    EFFORT →
```

---

## Оценка ресурсов (v1.1)

| Фаза | Calendar time | Dev effort | Infra cost/month | User impact |
| ---- | ------------- | ---------- | ---------------- | ----------- |
| **P0-OAuth** | **1–3 days** | **~4h** | $0 | **Немедленно: стабильный backend** |
| P0 | 1–2 weeks | ~10h | $0 | Security |
| P1 | 2–4 weeks | ~27h (+7h) | $0 | Grace при следующем OAuth fail |
| P2 | 1–3 months | ~90h (+10h) | ~$6 (Workspace) | Latency, email quota |
| P3 | 3–12 months | ~200h | ~$20 | Permanent fix |

---

## KPI для отслеживания прогресса (v1.1)

| KPI | Baseline | После P0-OAuth | P1 target | P3 target |
| --- | -------- | -------------- | --------- | --------- |
| **GAS OAuth uptime** | **~7 days между redeploy** | **> 90 days** | > 180 days | N/A (no GAS) |
| **Manual redeploys/month** | **~4** | **0** | 0 | 0 |
| `/api/health` latency p95 | 3835 ms | < 5000 ms | < 3000 ms | < 500 ms |
| 403-induced user logouts | 100% при OAuth fail | 100% | **0%** (grace) | N/A |
| Secrets in git | 3 | 3 | 0 | 0 |
| dist size | 52 MB | 52 MB | < 60 MB budget | < 10 MB |
| CI checks | 1 (health) | 1 | 5+ | 6+ |
| GAS calls/session | ~5 | ~5 | ~3 (KV cache) | 0 |
| Email reliability | 100/day cap | 100/day | 1500/day | Unlimited |
| RTO при OAuth fail | Manual redeploy 1–24h | — | Grace 72h auto | < 1h automated |
| Test coverage | 49 unit tests | 49 | + grace tests | Unit + E2E |

---

## Риски плана (v1.1)

| Risk | Mitigation |
| ---- | ---------- |
| **OAuth Production требует verification Google** | Заполнить Privacy Policy на сайте; подать verification если Google запросит |
| **P0-OAuth не помогает (не OAuth причина)** | Incident log по чеклисту 06-backend-outage; проверить Executions log |
| GAS migration breaks existing users | Parallel run GAS + D1, feature flag |
| Bundle refactor breaks question loading | Incremental migration per level |
| Secret rotation breaks production | Blue-green deploy, test on staging first |
| Grace при 403 маскирует реальные auth errors | Grace только для OAuth 403; device limit / invalid token — по-прежнему hard fail |
| Scope creep in P3 | Define MVP backend scope before starting |

---

## Следующие шаги (обновлено)

### Сегодня / эта неделя

1. **P0-O1** — проверить OAuth consent screen status в GCP Console
2. **P0-O2** — добавить Privacy Policy URL (можно `/legal` на lernziel-deutsch.de)
3. **P0-O4 + P0-O5** — redeploy GAS с sync manifest, только `lakizo.kosta@gmail.com`
4. **P0-O7** — записать дату и симптомы последнего инцидента

### Следующие 2–4 недели

5. **P1-8** — grace при OAuth 403 (код)
6. **P1-4, P1-10** — alerting + latency budget в CI
7. **P0-1..P0-2** — secret rotation (после стабилизации OAuth)

### Среднесрочно

8. **P2-8, P2-9** — Sheets cleanup + CacheService rate limit
9. **P3-1** — начать проектирование D1 migration

---

## Связанные документы

- [06-backend-outage-investigation.md](./06-backend-outage-investigation.md) — **root cause analysis отвалов GAS**
- [00-executive-summary.md](./00-executive-summary.md)
- [02-security.md](./02-security.md) — детали SEC-* findings
- [03-performance-scalability.md](./03-performance-scalability.md) — детали BOT-* findings
- [04-resilience.md](./04-resilience.md) — failure scenarios
- [apps-script/README.md](../../apps-script/README.md) — deploy guide (обновить в P0-O6)
