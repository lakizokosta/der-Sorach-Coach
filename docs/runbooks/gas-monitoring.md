# GAS Backend — мониторинг и e-mail уведомления

**Proactive e-mail:** ровно **за ~24 часа** до истечения OAuth-токена (не каждый день).

---

## Логика «за сутки до истечения»

```
Deploy day 0 ────────────────────────────── day 6 ── day 7
              (тишина)                      📧        ❌ token expired
                                         e-mail      FAIL + e-mail
```

| `daysSinceDeploy` | `daysUntilExpiry` (lifetime=7) | Действие |
| ----------------- | ------------------------------ | -------- |
| 0–5 | 7–2 | Тишина |
| **6** | **1** | **📧 Одно письмо «redeploy сегодня»** |
| ≥ 7 | ≤ 0 | 🚨 FAIL + e-mail (403 или token expired) |

Формула: `daysUntilExpiry = oauthTokenLifetimeDays - daysSinceDeploy`

---

## Расписание проверок

| Workflow | Cron | E-mail от SprachCoach |
| -------- | ---- | --------------------- |
| `backend-health.yml` | каждый час | **только** при FAIL (403) или `daysUntilExpiry === 1` |
| `gas-redeploy-email.yml` | вручную (Run workflow) | то же — для smoke-теста |

**Важно:** когда всё OK, **письма от SprachCoach не отправляются**. Если приходят ежедневные «всё хорошо» — это уведомления **GitHub** о успешном workflow (см. ниже).

Dedup в GAS: **1 письмо на deploy-цикл** (ключ `deployDate + level`), не 1 раз в день.

---

## Отключить ежедневные «всё OK» от GitHub

GitHub шлёт свои письма вида *«Run succeeded: GAS redeploy email reminder»* — это **не** наш monitor.

1. Открой [github.com/settings/notifications](https://github.com/settings/notifications)
2. Раздел **Actions**
3. Выбери **Send notifications for failed workflows only** (только при сбое)
4. Или сними галочку **Actions** / отключи watch для репозитория

После merge фикса workflows (`exit 0` всегда) GitHub не будет помечать runs как failed при proactive-напоминании.

---

## Конфигурация `docs/ops/gas-deploy-log.json`

```json
{
  "lastDeployAt": "2026-08-01",
  "oauthMode": "testing",
  "oauthTokenLifetimeDays": 7
}
```

| Поле | Значение |
| ---- | -------- |
| `lastDeployAt` | Дата redeploy (YYYY-MM-DD) — **обновлять после каждого deploy** |
| `oauthMode` | `testing` → lifetime 7d по умолчанию; `production` → proactive off |
| `oauthTokenLifetimeDays` | Явный срок токена (override). Для production можно `90` если известен |

---

## Настройка e-mail

### Способ A — через GAS (рекомендуется)

1. Задеплоить `Code.gs` с `monitorNotify` (+ dedup по `deployDate`)
2. GitHub Secret: `WEBHOOK_SECRET`

### Способ B — Resend / SMTP fallback

| Secret | Значение |
| ------ | -------- |
| `RESEND_API_KEY` | resend.com API key |
| `SMTP_USERNAME` + `SMTP_PASSWORD` | Gmail App Password при 403 |

---

## Локальная проверка

```bash
npm run backend:monitor
node scripts/monitor-gas-backend.mjs --json | jq '.checks.redeployEmailDue, .checks.deployLog'
```

---

## Пример письма (proactive)

```
Subject: [SprachCoach Monitor] OAuth läuft in ~24h ab — GAS redeploy

⏰ Proactive alert: OAuth token expires in approximately 24 hours.

• OAuth token expires in ~24 hours (deploy day 6/7, mode=testing). Redeploy GAS today.
```

---

## Checklist (production)

- [ ] `monitorNotify` задеплоен в GAS (`npm run ops:monitor:verify`)
- [ ] Workflows в **main** (cron только с default branch)
- [ ] GitHub Secret `WEBHOOK_SECRET` = значение из `Code.gs`
- [ ] `npm run ops:monitor:test-email` — тестовое письмо получено
- [ ] `lastDeployAt` актуален после каждого redeploy
- [ ] OAuth mode в GCP: Production (тогда proactive off по умолчанию)

---

## Связанные документы

- [06-backend-outage-investigation.md](../system-analysis/06-backend-outage-investigation.md)
