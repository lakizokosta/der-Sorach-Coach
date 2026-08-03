# Расследование: периодические отвалы бэкенда (GAS)

**Дата:** 2026-08-01  
**Симптом:** бэкенд периодически перестаёт отвечать; помогает только новый деплой Web App с повторным подтверждением всех разрешений  
**Статус:** диагностика по коду + live smoke test

---

## Вывод (кратко)

**Наиболее вероятная причина — истечение или отзыв OAuth-токена владельца скрипта Google Apps Script**, а не баг в бизнес-логике `Code.gs`.

Повторный деплoy с диалогом «Разрешить доступ ко всему» заново выдаёт OAuth-токен — поэтому после него всё снова работает. Это **известное поведение GAS Web App**, задокументированное Google и сообществом.

---

## Почему симптомы совпадают

| Наблюдение пользователя | Объяснение |
| ----------------------- | ---------- |
| «Отваливается периодически» | OAuth refresh token отзывается (~7 дней в Testing mode, или ~неделя при auto-revoke) |
| «Помогает новый деплой с доступом ко всему» | Деплой запускает consent screen → новый OAuth grant |
| «Execute as: Me, Anyone» | Именно этот режим: скрипт работает **от имени владельца**, его токен и протухает |
| Ошибка 403 в UI | Прямо обработана в `src/utils/api.js` |

Сообщение, которое видит пользователь при 403:

```42:47:src/utils/api.js
  if (res.status === 403) {
    return {
      ok: false,
      error:
        'Backend-Zugriff verweigert (403). Apps Script neu deployen: „Execute as: Me“, „Who has access: Anyone“.',
    };
```

---

## Корневая причина #1 — OAuth consent (ГЛАВНАЯ)

### Механизм

Web App с **Execute as: Me** выполняет `SpreadsheetApp`, `MailApp`, `UrlFetchApp` **от имени аккаунта деплоя** (`lakizo.kosta@gmail.com`). Google периодически отзывает refresh token:

1. **OAuth consent screen в режиме Testing** → токены test users истекают через **7 дней**
2. **Unverified app** («Google hasn't verified this app») → периодический re-consent
3. **Scope drift** — код запрашивает scope шире, чем был одобрен при прошлом деплое
4. **Смена пароля / отзыв third-party access** в Google Account
5. **Деплой с другого аккаунта** (см. `.cursor/rules/apps-script-deploy.mdc`)

### Проверить в Google Cloud Console

1. Открыть https://script.google.com → проект **SprachCoach Backend** → ⚙ Project Settings → **Google Cloud Platform (GCP) Project**
2. APIs & Services → **OAuth consent screen**:
   - [ ] Publishing status = **In production** (не Testing)
   - [ ] Заполнены Privacy Policy URL, App homepage
3. Google Cloud → **OAuth consent screen → Branding** — убрать «Unverified app» warning через verification (если нужно)

### Проверить аккаунт деплоя

```
.cursor/rules/apps-script-deploy.mdc:
«Always deploy while logged in as lakizo.kosta@gmail.com
 (not der.sprachcoach@gmail.com) — second account causes OAuth 403»
```

---

## Корневая причина #2 — Scope drift (manifest не синхронизируется)

При **обновлении** бэкенда README говорит копировать только `Code.gs`:

```
apps-script/README.md §7:
1. Edit Code.gs → paste into editor
2. Deploy → Manage deployments → New version → Deploy
```

**`appsscript.json` при обновлениях не упоминается.** Если manifest в Google-редакторе устарел, GAS может infer-ить дополнительные scopes at runtime → mismatch с authorized scopes → 403 до re-deploy.

Текущий manifest в репо (корректный):

```6:14:apps-script/appsscript.json
  "oauthScopes": [
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/script.send_mail",
    "https://www.googleapis.com/auth/spreadsheets"
  ],
  "webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE_ANONYMOUS"
  }
```

**Действие:** при каждом деплое сверять manifest в script.google.com с `apps-script/appsscript.json`.

---

## Усиливающий фактор — 403 не покрывается grace period

При OAuth-отказе клиент получает 403. В `backendGrace.js` ошибки с «403» **не считаются transient**:

```31:32:src/utils/backendGrace.js
  if (/403|verweigert|Forbidden|.../.test(err)) {
    return false;
```

Следствие в `usePremium.js`:
- `refreshMagicSession` → fail → **немедленный logout** (строка 408)
- `validateCode` → fail → **очистка activation codes** (строки 437–441)
- Grace snapshot **не применяется** при 403

Пользователь видит полный «отвал» бэкенда, хотя проблема только в OAuth владельца, а не в данных пользователя.

---

## Вторичная причина — деградация Sheets (долгосрочная)

Не объясняет «лечение redeploy», но может усугублять timeouts:

| Функция | Проблема |
| ------- | -------- |
| `rateLimitOk_()` | Полный scan листа `Magic` на каждый magic-link request |
| `getEntitlementsForEmail_()` | Полный scan листа `Codes` |
| `extendMagicSession_()` | Полный scan `MagicSessions` |
| Нет cleanup | Старые строки Sessions/Magic накапливаются |

При росте данных — cold start + scan → ответы 3–6+ секунд (live test: **3835 ms** на `/api/health`).

---

## Live-проверка (2026-08-01)

```bash
node scripts/check-backend-url.mjs   # ✅ HTTP 200, JSON OK
node scripts/verify-backend.mjs      # ✅ 6/6 passed
# Worker /api/health latency: 3835ms  ← высокая, но рабочая
```

Сейчас бэкенд **жив**, но latency высокая — типичный GAS cold start.

---

## План исправления

### Немедленно (устранить корень)

| # | Действие | Где |
| - | -------- | --- |
| 1 | Перевести OAuth consent screen в **Production** | Google Cloud Console |
| 2 | Заполнить Privacy Policy + Homepage URL в OAuth branding | GCP Console |
| 3 | При деплое — только аккаунт `lakizo.kosta@gmail.com` | script.google.com |
| 4 | Синхронизировать `appsscript.json` при каждом обновлении | Apps Script editor |
| 5 | После деплоя — один раз запустить `validateCode` из редактора для re-auth | Apps Script → Run |

### Краткосрочно (снизить impact при следующем отвале)

| # | Действие | Файл |
| - | -------- | ---- |
| 6 | Treat OAuth 403 as transient → включать grace snapshot | `backendGrace.js` |
| 7 | Alerting: если health check fail → Slack/email | `.github/workflows/backend-health.yml` |
| 8 | Логировать `latencyMs` из `/api/health` в CI artifacts | `verify-backend.mjs` |

### Среднесрочно (убрать зависимость от GAS OAuth)

| # | Действие |
| - | -------- |
| 9 | Миграция auth/progress на Cloudflare D1 (см. `05-remediation-plan.md` P3) |
| 10 | `clasp` + CI deploy GAS (воспроизводимый деплой) |

---

## Диагностический чеклист при следующем отвале

**До redeploy** — зафиксировать данные:

```bash
# 1. Проверить HTTP status (403 = OAuth, 200+HTML = redirect/login page)
curl -sI "https://script.google.com/macros/s/.../exec?action=validateCode&code=PING"

# 2. Полный smoke test
node scripts/check-backend-url.mjs
node scripts/verify-backend.mjs

# 3. Worker health + latency
curl -s "https://lernziel-deutsch.de/api/health" | jq .
```

**В Apps Script → Executions:**
- Красные записи с `Authorization required` / `Access denied` → подтверждает OAuth
- `Exceeded maximum execution time` → проблема Sheets/performance
- `Service invoked too many times` → quota

**В Google Account → Security → Third-party access:**
- Проверить, есть ли приложение «SprachCoach Backend»
- Не отозвано ли вручную

---

## Как отличить OAuth от других причин

| Признак | OAuth / auth | Quota | Performance |
| ------- | ------------ | ----- | ----------- |
| HTTP 403 | ✅ | ❌ | ❌ |
| Лечится redeploy + consent | ✅ | ❌ | ❌ |
| Периодичность ~7 дней | ✅ | ❌ | ❌ |
| MailApp quota error в Executions | ❌ | ✅ | ❌ |
| Latency > 5s, но 200 OK | ❌ | ❌ | ✅ |
| `Code nicht gefunden` (немецкий) | ❌ — скрипт жив | ❌ | ❌ |
| `Код не найден` (русский) | ❌ — **старый** скрипт | ❌ | ❌ |

---

## Связанные файлы

| Файл | Роль |
| ---- | ---- |
| `apps-script/Code.gs` | GAS backend |
| `apps-script/appsscript.json` | OAuth scopes (must stay in sync) |
| `src/utils/api.js` | 403 detection + user message |
| `src/utils/backendGrace.js` | 403 excluded from grace |
| `src/composables/usePremium.js` | logout on 403 |
| `scripts/check-backend-url.mjs` | Quick ping |
| `.cursor/rules/apps-script-deploy.mdc` | Deploy runbook |
