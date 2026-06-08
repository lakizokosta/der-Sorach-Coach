# P0 — Деплой backend + проверка платежей и email

Цель: на проде работает **новый** `apps-script/Code.gs` из репозитория — trial, magic link, синхронизация прогресса, Stripe webhook, письма с кодом.

**Сайт:** https://lernziel-deutsch.de  
**Backend URL:** см. `SCRIPT_URL` в `src/data/payment.js`

---

## Текущий статус (2026-06-08)

| Проверка | Статус | Примечание |
| --- | --- | --- |
| GET `validateCode` → немецкая ошибка | ✅ | `Code nicht gefunden` = новый скрипт |
| POST `requestTrial` / `requestMagicLink` | ✅ | Работает через `fetch` (браузер) |
| `APP_BASE_URL` в Code.gs | ✅ | `https://lernziel-deutsch.de` |
| `APP_BASE_URL` в payment.js | ✅ | Совпадает |
| Контактная форма | ✅ | Тема `[SprachCoach Kontakt]` |
| `TRIAL_TEST_MODE` | ⚠️ | Сейчас `true` — выключить перед продом |
| Stripe webhook end-to-end | ❓ | Проверить в Stripe Dashboard |
| Письмо после реальной оплаты | ❓ | Нужен ваш тест |

> **Важно:** `curl -X POST …/exec` без follow redirect может показать HTML «страница не найдена». Это **не** значит, что POST сломан — браузер и `node scripts/verify-backend.mjs` обрабатывают 302 корректно.

---

## Шаг 1 — Обновить Apps Script (если меняли Code.gs)

1. Откройте https://script.google.com → ваш проект **SprachCoach Backend**
2. **Скопируйте целиком** `apps-script/Code.gs` из репозитория в редактор
3. Проверьте константы в начале файла:

   | Константа | Значение |
   | --- | --- |
   | `SHEET_ID` | `1vqKJV1jV9Rq_Owb5gDA4LlJ2GgcQvYkurVnBUfUp8WU` |
   | `APP_BASE_URL` | `https://lernziel-deutsch.de` |
   | `SUPPORT_EMAIL` | ваш inbox |
   | `WEBHOOK_SECRET` | тот же, что в Stripe webhook URL |

4. **Перед продакшеном:** `TRIAL_TEST_MODE = false` (строка ~92)
5. **Deploy → Manage deployments → ⚙ Edit → New version → Deploy**
6. URL `/exec` **не меняется** — пересборка фронта не нужна

---

## Шаг 2 — Автоматическая проверка из репо

```bash
node scripts/verify-backend.mjs
```

Опционально — проверка Stripe webhook URL:

```bash
WEBHOOK_SECRET='ваш_секрет_из_Code.gs' node scripts/verify-backend.mjs --webhook
```

Ожидаемый результат: все ✅, одно ⚠️ про `TRIAL_TEST_MODE` если ещё не выключили.

---

## Шаг 3 — Stripe Dashboard

### Webhook endpoint

```
https://script.google.com/macros/s/AKfycbw0oSHhowmjag6KMvsSd8C7nBkTduQ93L25Vv1yn6mY_7y6D_XEMxDRg5UuAvN36nkuRA/exec?action=stripeWebhook&secret=LZD_S3cr3t_T0k3n_K3y_2024_xQ9mR7
```

- [ ] Событие: только `checkout.session.completed`
- [ ] **Recent deliveries** — зелёные после тестовой оплаты
- [ ] **Send test webhook** → письмо на email из тестового события

### Payment Links (все 4)

Для каждой ссылки (Basis, 1m, 3m, 12m):

- [ ] **After payment redirect** = `https://lernziel-deutsch.de/?stripe_success=1`
- [ ] Цена совпадает с `STRIPE_AMOUNT_MAP` (499 / 1900 / 4900 / 9900 центов)

---

## Шаг 4 — Ручной end-to-end тест на сайте

### 4.1 Magic Link (логин)

1. https://lernziel-deutsch.de → ввести email → «Einloggen»
2. Письмо с темой про Login-Link
3. Ссылка вида `https://lernziel-deutsch.de/?mltoken=…`
4. После клика — email на главной, прогресс подтягивается

### 4.2 Trial

1. Premium → «Trial anfordern»
2. Письмо с кодом `TRIAL-…`
3. Ссылка `https://lernziel-deutsch.de/?activate=TRIAL-…`
4. Premium активируется

### 4.3 Синхронизация прогресса

1. Залогиниться на устройстве A → ответить на вопросы
2. Залогиниться тем же email на устройстве B
3. XP, streak, дневная цель должны совпасть (лучший из двух)

### 4.4 Оплата Stripe (реальная или test mode)

1. Оплатить любой план
2. Редирект на `?stripe_success=1` + баннер «Prüfe deine E-Mail»
3. Письмо с кодом + ссылкой `/?activate=CODE`
4. В Google Sheet → вкладка `Codes` — новая строка
5. Apps Script → **Executions** — запись `handleStripeWebhook_`

---

## Шаг 5 — Apps Script Executions

После каждого теста смотрите **Executions** в script.google.com:

| Действие | Ожидаемая функция |
| --- | --- |
| Trial | `doPost` → `requestTrial` |
| Magic link | `doPost` → `requestMagicLink` |
| Login по ссылке | `doGet` → `validateMagicToken` |
| Сохранение прогресса | `doPost` → `saveProgressByEmail_` |
| Stripe оплата | `doPost` → `handleStripeWebhook_` |

Красные записи → открыть, скопировать ошибку.

---

## Частые проблемы

| Симптом | Причина | Решение |
| --- | --- | --- |
| Ошибка по-русски «Код не найден» | Старый скрипт | Redeploy нового Code.gs |
| Trial: «Serverfehler» | Неверный `SHEET_ID` | Проверить ID таблицы |
| Письмо не приходит | Квота Gmail (100/день) | Executions → ошибка MailApp |
| Webhook красный в Stripe | Неверный secret в URL | Сверить с `WEBHOOK_SECRET` |
| Ссылка в письме на старый домен | Старый `BASE_URL` | `APP_BASE_URL` в Code.gs |
| Прогресс не синхронится | Не залогинен / нет сессии | Magic link → 7-дневная сессия |

---

## Критерий «P0 готов»

- [ ] `node scripts/verify-backend.mjs` — без ❌
- [ ] `TRIAL_TEST_MODE = false` в задеплоенном скрипте
- [ ] Stripe webhook — зелёные доставки
- [ ] Все 4 Payment Links → redirect на lernziel-deutsch.de
- [ ] Magic link + trial + контакт — проверены на сайте
- [ ] Одна тестовая оплата → письмо + код + активация

После этого можно переходить к **P1** (упрощённый профиль для Free).
