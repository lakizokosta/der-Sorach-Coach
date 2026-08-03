# Аудит безопасности

**Уровень:** статический анализ кодовой базы  
**Дата:** 2026-08-01

---

## Сводка

| Категория | Критичных | Высоких | Средних | Низких |
| --------- | --------- | ------- | ------- | ------ |
| Secrets management | 1 | 1 | 0 | 0 |
| Authentication | 0 | 1 | 2 | 0 |
| Authorization | 0 | 1 | 1 | 0 |
| Data exposure | 0 | 1 | 1 | 0 |
| Input validation | 0 | 0 | 2 | 1 |
| Infrastructure | 0 | 0 | 1 | 1 |

---

## CRITICAL

### SEC-001: Секреты закоммичены в git

**Файлы:**
- `wrangler.toml` — `TRAINING_JWT_SECRET = "LZD_S3cr3t_T0k3n_K3y_2024_xQ9mR7"`
- `apps-script/Code.gs` — `WEBHOOK_SECRET`, `TRAINING_JWT_SECRET`, `SHEET_ID`

**Риск:** Любой с доступом к репозиторию может:
- Подписывать training JWT → получить Premium API без оплаты
- Отправлять поддельные Stripe/PayPal webhooks → генерировать activation codes
- Читать/модифицировать Google Sheet напрямую (если sheet не защищён ACL)

**Рекомендация:** Немедленная ротация всех секретов. Использовать:
- Cloudflare Workers Secrets (`wrangler secret put`)
- GAS Script Properties (`PropertiesService.getScriptProperties()`)
- Удалить секреты из git history (BFG / git filter-repo)

---

## HIGH

### SEC-002: Stripe webhook без HMAC-подписи

**Контекст:** GAS `doPost(e)` не предоставляет HTTP headers, поэтому `Stripe-Signature` недоступен.

**Текущая митигация:** Secret в URL query string (`?secret=WEBHOOK_SECRET`).

**Риск:** URL webhook хранится в Stripe Dashboard. При компрометации Stripe-аккаунта или утечке dashboard access — подделка платежей.

**Рекомендация (среднесрочно):** Прокси webhook через Cloudflare Worker, который проверяет HMAC и форвардит в GAS.

### SEC-003: Client-side entitlement grace (72h)

**Файл:** `src/utils/backendGrace.js`

Grace snapshot хранится в `localStorage` (`lzd_entitlement_grace`). Технически savvy user может модифицировать `isPremium: true`.

**Митигация:** Server re-validation каждые 5 мин во время тренировки; Worker API требует valid JWT/GAS verify.

**Риск:** 72-часовое окно offline Premium без server check для UI-gated features (не для Worker API).

**Рекомендация:** Сократить grace до 24h; premium training всё равно требует JWT.

### SEC-004: Premium questions downloadable

**Файл:** `worker/index.js` — `/api/questions` возвращает до 500 вопросов за запрос.

Любой authenticated Premium user может скачать весь question bank через API (rate limit 120/min).

**Риск:** Утечка premium-контента. Free tier уже содержит ~11k grammar questions в client bundle.

**Рекомендация:** Pagination с меньшим limit; watermarking question IDs; per-session question pool.

### SEC-005: GAS Web App — публичный доступ

Deploy: `Execute as: Me`, `Who has access: Anyone`.

Все endpoints публично вызываемы. Безопасность полностью на action-level logic.

**Риски:**
- Brute-force activation codes (формат `PREMIUM-XXXX-XXXX-XXXX`)
- Magic-link spam (mitigated: 3 req/10 min per email)
- Contact form abuse

**Текущие митигации:**
- `rateLimitOk_()` для magic links
- `MAX_DEVICES_PER_EMAIL = 2`
- Code format с checksum (проверить в Code.gs)

**Рекомендация:** Добавить global rate limiting через GAS CacheService; CAPTCHA на contact form.

---

## MEDIUM

### SEC-006: In-memory rate limiting на Worker

**Файл:** `worker/index.js:89-108`

`rateBuckets` Map — per-isolate, сбрасывается при cold start. Не shared между Worker instances.

**Риск:** Distributed brute-force / scraping premium API.

**Рекомендация:** Cloudflare Rate Limiting rules или KV-based counters.

### SEC-007: Device ID fingerprinting

**Файл:** `src/utils/deviceId.js`

Canvas fingerprint + sticky ID. Privacy concern (GDPR), но не security vulnerability per se.

**Рекомендация:** Документировать в Privacy Policy; рассмотреть crypto-random UUID без fingerprint.

### SEC-008: POST as text/plain для CORS bypass

**Файл:** `src/utils/api.js:155`

Обход CORS preflight — стандартный паттерн для GAS, но body не signed.

**Риск:** CSRF-like attacks если GAS не проверяет origin (GAS не получает Origin header reliably).

**Митигация:** Session tokens required для sensitive actions.

### SEC-009: Support email в коде

**Файл:** `apps-script/Code.gs:52` — `lakizo.kosta@gmail.com`

PII в репозитории. Низкий security risk, но privacy concern.

---

## LOW

### SEC-010: Hash routing

Hash mode (`/#/trainer`) — URL params после `#` не отправляются на server. Magic tokens в query (`?mltoken=`) — до hash, OK.

### SEC-011: Health endpoint без auth

`/api/health` публичен — информационная утечка (GAS latency). Acceptable для monitoring.

---

## Security checklist (текущий статус)

| Control | Статус |
| ------- | ------ |
| HTTPS everywhere | ✅ Cloudflare + GAS |
| Secrets not in git | ❌ |
| Webhook signature verification | ⚠️ URL secret only |
| Rate limiting | ⚠️ Partial (Worker in-memory, GAS magic-link) |
| Input sanitization (contact form) | ⚠️ Проверить Code.gs |
| CORS restrictions | ✅ Worker origin check |
| Session token rotation | ✅ Sliding 365d magic session |
| Device binding | ✅ Max 2 devices |
| JWT for training API | ✅ 30 min HMAC |
| CSP headers | ❌ Не настроены |
| Dependency audit | ⚠️ Minimal deps, но нет `npm audit` в CI |

---

## Compliance notes (GDPR)

| Аспект | Статус |
| ------ | ------ |
| Privacy Policy page | ✅ Есть legal views |
| Data minimization | ⚠️ Email + deviceId + progress в Sheets |
| Right to deletion | ❌ Нет automated flow |
| Data portability | ❌ Нет export API |
| Cookie consent | ⚠️ localStorage без banner |
