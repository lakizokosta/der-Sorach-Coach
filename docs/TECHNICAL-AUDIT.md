# Der SprachCoach — технический аудит после переезда

> **Проект:** der-Sorach-Coach (переезд с Blogger → GitHub + Cloudflare)  
> **Сайт:** https://lernziel-deutsch.de  
> **Дата начала аудита:** 2026-06-08  
> **Правило работы:** сначала анализ → предложение → ваше одобрение → внедрение

---

## Содержание

1. [Контекст и цели](#контекст-и-цели)
2. [Архитектура проекта](#архитектура-проекта)
3. [План этапов](#план-этапов)
4. [Этап 1 — Платежи и e-mail (текущий)](#этап-1--платежи-и-e-mail-текущий)
5. [Apps Script — что менять и как не сломать](#apps-script--что-менять-и-как-не-сломать)
6. [Тестирование без реальной оплаты](#тестирование-без-реальной-оплаты)
7. [Этап 2 — Premium-профиль и контакт](#этап-2--premium-профиль-и-контакт)
8. [Этап 3 — Аудит тренажёра](#этап-3--аудит-тренажёра)
9. [Этап 4 — Автопроверки](#этап-4--автопроверки)
10. [Этап 5 — Ручной чеклист](#этап-5--ручной-чеклист)
11. [Этап 6 — Сравнение с Blogger](#этап-6--сравнение-с-blogger)
12. [Этап 7 — План фиксов](#этап-7--план-фиксов)
13. [Журнал изменений](#журнал-изменений)
14. [Открытые вопросы к вам](#открытые-вопросы-к-вам)

---

## Контекст и цели

| Факт | Детали |
| --- | --- |
| Старая версия | Blogger (`blogspot.html`) — работала, но код был неоптимальным |
| Новая версия | Vue 3 + Vite, вопросы в Markdown, деплой на Cloudflare |
| Лендинг | ✅ В порядке — **не трогаем без необходимости** |
| Главная контентная проблема | Вопросы по темам Premium почти не перенесены (60 файлов на 70+ тем) |
| Главная техническая проблема (Этап 1) | Живой Apps Script, похоже, **старый** (v7.8), POST-запросы **не отвечают** |

### Принципы работы

- [ ] Логику меняем **только после согласования**
- [ ] Фиксы — **маленькими этапами**, после каждого — проверка
- [ ] Коммиты / PR — небольшие, с понятным описанием
- [ ] Лендинг не трогаем без явной причины

---

## Архитектура проекта

```
┌─────────────────────┐         ┌──────────────────────────┐
│  Фронтенд (Vue SPA) │  HTTP   │  Бэкенд (Google Apps     │
│  lernziel-deutsch.de│ ──────► │  Script + Google Sheets) │
│  Cloudflare Workers │         │  /exec URL               │
└─────────────────────┘         └──────────────────────────┘
         │                                    │
         │ Stripe redirect                    │ Stripe Webhook (POST)
         ▼                                    ▼
   ?stripe_success=1                   Генерация кода → e-mail
   ?activate=CODE                       ?activate=CODE в письме
   ?mltoken=TOKEN
```

### Ключевые файлы

| Файл | Назначение |
| --- | --- |
| `src/data/payment.js` | `SCRIPT_URL`, Stripe/PayPal ссылки, `APP_BASE_URL` |
| `src/utils/api.js` | HTTP-клиент к Apps Script |
| `src/composables/usePremium.js` | Активация кодов, Premium/Basis статус |
| `src/components/BootstrapHandler.vue` | Обработка `?activate`, `?stripe_success`, `?mltoken` |
| `src/views/Premium.vue` | Покупка, активация, trial, magic link |
| `apps-script/Code.gs` | Бэкенд в репозитории (шаблон + новая логика) |
| `apps-script/README.md` | Инструкция по деплою Apps Script |

### URL-правила (важно для e-mail)

```
✅ Правильно:  https://lernziel-deutsch.de/?activate=PREMIUM-XXXX
❌ Неправильно: https://lernziel-deutsch.de/#/?activate=PREMIUM-XXXX
```

`BootstrapHandler.vue` читает параметры из `window.location.search` (часть URL **до** `#`).

Константы должны совпадать:
- `APP_BASE_URL` в `src/data/payment.js` → `https://lernziel-deutsch.de`
- `BASE_URL` / `APP_BASE_URL` в **задеплоенном** Apps Script → то же значение

---

## План этапов

| Этап | Фокус | Статус |
| --- | --- | --- |
| **1** | Платежи и e-mail | ✅ P0 закрыт (Magic Link, Stripe redirect, backend) |
| **2** | Premium-профиль и контакт | ✅ P1: Free-профиль, unified `/premium`; контакт ✅ |
| **3** | Аудит тренажёра | ✅ См. [TRAINER-AUDIT.md](./TRAINER-AUDIT.md) |
| **4** | Автопроверки (build, questions:verify) | ⏳ Ожидает |
| **5** | Ручной чеклист (A1–B2, Free/Premium) | ⏳ Ожидает |
| **6** | Сравнение с Blogger | ⏳ Ожидает |
| **7** | План фиксов по приоритету | ⏳ Ожидает |

---

## Этап 1 — Платежи и e-mail (текущий)

### Чеклист проверки

| # | Проверка | Статус | Примечание |
| --- | --- | --- | --- |
| 1.1 | `SCRIPT_URL` в `payment.js` указывает на ваш `/exec` | ✅ | Не менялся вами — ок |
| 1.2 | Stripe Payment Links (4 шт.) в коде | ✅ | basis, 1month, 3months, 12months |
| 1.3 | Stripe Webhooks настроены | ✅ | По вашим словам — нужно проверить логи |
| 1.4 | `APP_BASE_URL` = `https://lernziel-deutsch.de` | ✅ | В `payment.js` |
| 1.5 | Живой Apps Script = новый `Code.gs` из репо? | ✅ | GET: `Code nicht gefunden` (нем.) |
| 1.6 | GET `validateCode` работает | ✅ | Новая логика из репо |
| 1.7 | POST `requestTrial` работает | ✅ | `fetch` / `verify-backend.mjs`; curl -L вводит в заблуждение |
| 1.8 | POST `contactForm` работает | ✅ | Подтверждено: письмо пришло 2026-06-08 |
| 1.9 | POST Stripe webhook доставляется | ✅ | Premium aktiv после оплаты (подтверждено) |
| 1.10 | E-mail после оплаты приходит | ✅ | Подтверждено пользователем |
| 1.11 | Ссылка в письме `/?activate=CODE` | ✅ | `APP_BASE_URL` = lernziel-deutsch.de |
| 1.12 | Premium активируется после клика по ссылке | ✅ | E2E подтверждено |
| 1.13 | Stripe success redirect `?stripe_success=1` | ✅ | Баннер на скриншоте |

### Обновление P0 (2026-06-08)

**Новый `Code.gs` задеплоен** — GET и POST отвечают по-немецки / JSON.

```bash
# GET — новый скрипт
curl ".../exec?action=validateCode&code=TEST"
→ {"ok":false,"error":"Code nicht gefunden"}

# POST — работает через fetch (браузер / node scripts/verify-backend.mjs)
→ {"ok":true,...} после 302 redirect

# curl -L с application/json может показать HTML — это артефакт curl, не баг backend
```

Полный чеклист: [P0-DEPLOY-CHECKLIST.md](./P0-DEPLOY-CHECKLIST.md)

**Уточнение (2026-06-08):** контактная форма **работает** — тестовое письмо пришло
(имя `Audit`, email `test@example.com`, тело `test`). Значит `doPost` для контакта
на живом скрипте **функционирует**. Trial / magic link / webhook — ещё не проверены
с сайта.

**Замечание по письму:** поле `Seite:` пустое — в тесте через curl не передавался URL
страницы; с сайта должно заполняться автоматически (`location.href`).

**Признак старого скрипта:** тема письма `[LZD] Nachricht von …` (в новом `Code.gs`
из репо было бы `[SprachCoach Kontakt]`).

### Stripe Payment Links — что проверить в Dashboard

Для **каждой** из 4 ссылок:

- [ ] **After payment** (redirect) = `https://lernziel-deutsch.de/?stripe_success=1`
- [ ] Цена совпадает с `STRIPE_AMOUNT_MAP` в коде:

| Сумма (центы) | План | Payment Link в коде |
| --- | --- | --- |
| 499 | basis | `STRIPE_BASIS_LINK` |
| 1900 | 1month | `STRIPE_LINKS['1month']` |
| 4900 | 3months | `STRIPE_LINKS['3months']` |
| 9900 / 9000 | 12months | `STRIPE_LINKS['12months']` |

### Stripe Webhook — URL должен быть

```
https://script.google.com/macros/s/<ВАШ_ID>/exec?action=stripeWebhook&secret=<WEBHOOK_SECRET>
```

- [ ] Событие: только `checkout.session.completed`
- [ ] Recent deliveries — зелёные?

### Где смотреть логи

| Место | Путь |
| --- | --- |
| Apps Script | Редактор → **Выполнения** (Executions) |
| Stripe | Dashboard → **Developers → Webhooks** → ваш endpoint → Recent deliveries |
| Google Sheets | Вкладка `Codes` — появляются ли новые строки после оплаты |

---

## Apps Script — что менять и как не сломать

### ❌ НЕ делать сразу

- Полностью удалять старый `Code.gs`
- Вставлять новый файл из репозитория без сравнения
- Менять `/exec` URL (при «Новая версия» URL **остаётся**)

### ✅ Сделать перед любыми изменениями

1. **Резервная копия скрипта**
   - script.google.com → ваш проект → скопировать весь `Code.gs` в файл  
     `Code.gs.BACKUP-YYYY-MM-DD.txt`
   - Или: **Файл → Создать копию** проекта

2. **Резервная копия таблицы**
   - Google Sheets с кодами → **Файл → Создать копию**

3. **Записать текущий `/exec` URL**  
   (тот же, что в `payment.js` → `SCRIPT_URL`)

### Сравнение: старый (у вас) vs новый (в репо)

| Параметр | Старый (Blogger v7.8) | Новый (`apps-script/Code.gs`) |
| --- | --- | --- |
| URL в письмах | `BASE_URL` | `APP_BASE_URL` |
| Секрет | `TOKEN_SECRET` | `WEBHOOK_SECRET` |
| Ошибки API | По-русски | По-немецки |
| SHEET_ID | Ваш реальный ID | Placeholder в репо |
| Magic Link v7.8 | Есть | Переписан |

### Рекомендуемый путь (после одобрения)

1. Прислать первые ~50 строк **живого** `Code.gs` → точное сравнение
2. **Минимальный патч** в старом скрипте:
   - `BASE_URL` → `https://lernziel-deutsch.de`
   - Ссылки в письмах: `/?activate=CODE`
   - Проверить / починить `doPost`
3. Полная замена — только если старый несовместим с Vue SPA

### Деплой после правок

```
Развертывание → Управление развертываниями → ⚙ → Изменить → Новая версия → Развернуть
```

**Не** просто «Сохранить» — только **Новая версия**.

---

## Тестирование без реальной оплаты

### Способ 1 — Trial «1 Tag gratis» (end-to-end)

1. Открыть https://lernziel-deutsch.de/premium
2. Ввести email → запросить trial
3. Проверить письмо и ссылку `/?activate=КОД`
4. Кликнуть → Premium на 24 часа

**Статус:** ❓ скорее не работает, пока POST сломан

### Способ 2 — Ручной код в Google Sheets (рекомендуется сейчас)

1. Открыть таблицу `Codes`
2. Добавить строку:

| code | email | plan | months | createdAt | usedAt | usedByDeviceId | source | txId |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PREMIUM-TEST-1234-ABCD` | ваш@email.com | 1month | 1 | сегодня | пусто | пусто | manual | test |

3. На `/premium` ввести код → должно активировать Premium

**Проверяет:** сайт ↔ таблица ↔ `validateCode` (без e-mail и Stripe)

### Способ 3 — Demo-режим (только локально)

В `payment.js` временно: `SCRIPT_URL = ''`  
Коды `PREMIUM_*` / `BASIS_*` активируются локально. **На проде не использовать.**

---

## Этап 2 — Premium-профиль и контакт

| # | Проверка | Статус | Зависит от |
| --- | --- | --- | --- |
| 2.1 | `/profile` открывается для Free + Premium | ✅ | Free: мини-профиль; Premium: полный |
| 2.2 | Mastery / статистика по темам | ✅ | Premium-only в полном профиле |
| 2.3 | Magic Link login | ✅ | Подтверждено на главной |
| 2.4 | Контактная форма отправляется | ✅ | Подтверждено пользователем |
| 2.5 | Письмо контакта приходит на inbox | ✅ | Тема `[SprachCoach Kontakt]` |
| 2.6 | Unified login на `/premium` | ✅ | Schritt 1 → 2 |

---

## Этап 3 — Аудит тренажёра

### Состояние контента (на 2026-06-08)

- **Всего файлов вопросов:** 60
- **Типы:** select-one 42, multi-select 4, dropbox 6, input-text 8
- **Тем в каталоге Premium:** ~70+
- **Тем с вопросами:** ~35 папок, большинство по 1–3 вопроса

### Известные проблемы папок

| Папка | Проблема |
| --- | --- |
| `A2/SPRACHBAUSTEINEB1` | Тема B1 в уровне A2 |
| `A1/SATZSTELLUNGA2` | Тема A2 в уровне A1 |

### Типы заданий — целевой список (Этап наполнения)

- [ ] multiple choice / select-one
- [ ] multi-select
- [ ] drag & drop (dropbox)
- [ ] fill in / input-text
- [ ] Sprachbausteine
- [ ] короткие тексты (Lesen)
- [ ] диалоги
- [ ] объявления

### Чеклист кода тренажёра

Полный отчёт: **[TRAINER-AUDIT.md](./TRAINER-AUDIT.md)**

| # | Компонент | Файл | Статус |
| --- | --- | --- | --- |
| 3.1 | Очередь вопросов | `src/utils/queue.js` | ✅ |
| 3.2 | Загрузчик MD | `src/data/questions.js` | ✅ 60 файлов |
| 3.3 | MultipleChoice | `MultipleChoice.vue` | ✅ |
| 3.4 | MultiSelect | `MultiSelect.vue` | ✅ |
| 3.5 | DragDrop | `DragDrop.vue` | ✅ |
| 3.6 | FillBlank | `FillBlank.vue` | ✅ |
| 3.7 | Trainer view | `Trainer.vue` | ✅ ⚠️ FIX-300, FIX-301 |
| 3.8 | Таймер | `useTimer.js` | ✅ ⚠️ обход через новую вкладку |
| 3.9 | Streak / XP | `useStreak.js`, `useXp.js` | ✅ ⚠️ streak vs Tagesziel |
| 3.10 | Дневная цель 5 Fragen | `useDailyGoal.js` | ✅ |
| 3.11 | Schwächen-Modus | `weakTopics.js` | ✅ |

---

## Этап 4 — Автопроверки

```bash
npm run build              # сборка
npm run questions:verify   # линт всех .md вопросов
```

| Команда | Последний результат | Дата |
| --- | --- | --- |
| `npm run build` | ✅ Успех | 2026-06-08 |
| `npm run questions:verify` | ✅ 60 файлов | 2026-06-08 |

---

## Этап 5 — Ручной чеклист

### Free-режим

- [ ] A1 — старт тренировки
- [ ] A2 — старт тренировки
- [ ] B1 — старт тренировки
- [ ] B2 — старт тренировки
- [ ] Таймер 5 минут
- [ ] Дневная блокировка после лимита
- [ ] Streak обновляется
- [ ] XP начисляется
- [ ] Цвета правильный/неправильный ответ
- [ ] Кнопка «Weiter» только после ответа
- [ ] Повтор ошибочного вопроса позже

### Premium-режим

- [ ] Выбор темы с вопросами (>0)
- [ ] Тема с 0 вопросов — поведение (пустая сессия?)
- [ ] Словарь
- [ ] Грамматика (GrammarTip)
- [ ] Streak freeze

### Типы вопросов

- [ ] select-one
- [ ] multi-select
- [ ] dropbox (drag & drop)
- [ ] input-text

---

## Этап 6 — Сравнение с Blogger

| Функция | Blogger | Новая версия | Статус |
| --- | --- | --- | --- |
| Лендинг | ✅ | ✅ | OK, не трогаем |
| Free тренировка | ✅ | ❓ | Проверить |
| Premium по темам | ✅ (много вопросов) | ❌ мало контента | Контент не перенесён |
| Платежи + e-mail | ✅ | ❓ | Этап 1 |
| Magic Link | ✅ | ❓ | POST? |
| Trial 1 день | ✅ | ❓ | POST? |
| Контакт | ✅ | ❓ | POST? |
| Sprachbausteine | ✅ | Частично (MD) | Наполнение |
| Lesen / диалоги | ✅ | Частично | Наполнение |

---

## Этап 7 — План фиксов

### Приоритет 1 (с вашего одобрения)

- [ ] **E-mail notification** со ссылкой на der-Sprach-Coach
- [ ] Починить POST в Apps Script (или согласовать миграцию)
- [ ] Синхронизировать `BASE_URL` в живом скрипте

### Приоритет 2

- [ ] Premium-профиль + контактная форма
- [ ] Stripe success redirect на всех Payment Links

### Приоритет 3

- [ ] Наполнение тем вопросами (контент)
- [ ] Аудит тренажёра (логика)

### Шаблон записи проблемы

```markdown
### FIX-XXX: Краткое название
- **Этап:** 1 / 2 / 3 …
- **Приоритет:** высокий / средний / низкий
- **Симптом:** что видит пользователь
- **Причина:** техническая (после диагностики)
- **Предложение:** что менять
- **Статус:** ожидает одобрения / в работе / готово / отложено
- **Проверка:** как убедиться, что починилось
```

---

## Журнал изменений

| Дата | Что сделано | Этап | Кто | Статус |
| --- | --- | --- | --- | --- |
| 2026-06-08 | Создан документ аудита, диагностика Этапа 1 | 1 | AI | ✅ |
| 2026-06-08 | Контактная форма: тест Audit → письмо получено | 1–2 | AI + вы | ✅ |
| 2026-06-08 | Добавлен `TRIAL_TEST_MODE` (+test bypass) в `Code.gs` | 1 | AI | ⏳ ждёт деплой в Google |
| 2026-06-08 | Константы из live `Код.gs` вставлены в `apps-script/Code.gs` | 1 | AI | ⏳ ждёт copy+deploy в Google |
| 2026-06-08 | Trial `Serverfehler` — исправлен `SHEET_ID` (`4L1J2`→`4LlJ2`) | 1 | AI | ⏳ ждёт redeploy |
| 2026-06-08 | P0/P1 закрыты; геймификация (3 пункта) | 1–2 | AI | ✅ |
| 2026-06-08 | Этап 3: аудит тренажёра → `TRAINER-AUDIT.md` | 3 | AI | ✅ |
| | | | | |

---

## Открытые вопросы к вам

Ответьте, когда будет удобно — обновим этот файл:

1. ~~Контактная форма~~ — ✅ работает (подтверждено 2026-06-08)
2. **После последней оплаты или trial** — письмо приходило? Какая ссылка в письме?
3. **Apps Script → Выполнения** — есть записи при trial / webhook / оплате?
4. **Stripe Webhooks → Recent deliveries** — зелёные или красные?
5. **Первые ~50 строк вашего живого `Code.gs`** (секреты можно заменить на `***`) — для точного сравнения
6. **Есть ли доступ к старой таблице Codes** с рабочими кодами от Blogger?

---

## Быстрые ссылки

| Ресурс | URL |
| --- | --- |
| Сайт | https://lernziel-deutsch.de |
| Premium / активация | https://lernziel-deutsch.de/premium |
| Apps Script | https://script.google.com |
| Stripe Webhooks | https://dashboard.stripe.com/webhooks |
| Stripe Payment Links | https://dashboard.stripe.com/payment-links |
| Инструкция Apps Script | [apps-script/README.md](../apps-script/README.md) |
| Платежи (фронт) | [src/data/payment.js](../src/data/payment.js) |
| Бэкенд (репо) | [apps-script/Code.gs](../apps-script/Code.gs) |
| Вопросы | [src/questions/](../src/questions/) |

---

*Документ обновляется по мере прохождения этапов. После каждого фикса — запись в [Журнал изменений](#журнал-изменений).*
