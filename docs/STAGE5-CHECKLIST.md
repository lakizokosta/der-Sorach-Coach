# Этап 5 — Ручной чеклист на проде

**Сайт:** https://lernziel-deutsch.de  
**Дата прогона:** 2026-06-08  
**Коммит на проде:** `index-BFu_d-2b.js` (совпадает с локальным `npm run build`)  
**FIX-301 на проде:** ✅ в бандле есть `lzd_free_daily` (старый `lzd_free_start_ms` убран)

---

## Автоматические проверки (CI-локально)

| Проверка | Результат |
| --- | --- |
| `npm run build` | ✅ |
| `npm run questions:verify` | ✅ 60 файлов |
| `npm run backend:verify` | ✅ 6/6 (⚠️ `TRIAL_TEST_MODE` ещё ON) |
| Прод-бандл = локальный | ✅ `index-BFu_d-2b.js` |
| Git `main` = `origin/main` | ✅ `6019e37` |

**Деплой:** push уже на `origin/main` — Cloudflare подхватил билд.

---

## Free-режим

| # | Проверка | Статус | Как проверить |
| --- | --- | --- | --- |
| F1 | A1 стартует | ☐ | Главная → **A1** |
| F2 | A2 стартует | ☐ | Главная → **A2** |
| F3 | B1 стартует | ☐ | Главная → **B1** |
| F4 | B2 стартует | ☐ | Главная → **B2** |
| F5 | Таймер тикает вниз (05:00…) | ☐ | Free-сессия, после 1-го ответа |
| F6 | Лимит общий на день (FIX-301) | ☐ | 2 мин тренировки → выход → **новая вкладка** → ~03:00, не 05:00 |
| F7 | После исчерпания 5 мин — конец сессии | ☐ | Дождаться 00:00 или `localStorage` `lzd_free_daily` |
| F8 | MC: красный при ошибке | ☐ | Неверный клик → красная кнопка |
| F9 | MC: зелёный при верном | ☐ | Верный ответ → зелёный |
| F10 | Weiter заблокирован до ответа | ☐ | До ответа серая кнопка |
| F11 | Ошибочный вопрос позже в сессии | ☐ | Ошибиться → Weiter → тот же вопрос всплывёт снова |
| F12 | Streak только после 5 Fragen (FIX-300) | ☐ | 1 ответ + Beenden → streak **не** растёт; 5 ответов → +1 |

---

## Premium-режим

| # | Проверка | Статус | Как проверить |
| --- | --- | --- | --- |
| P1 | Тема с вопросами → сессия | ☐ | `/premium` → A1 → тема с бейджем >0 |
| P2 | Тема без вопросов → пустой экран | ☐ | Тема с **0** вопросов → «Keine Fragen gefunden» |
| P3 | Словарь по клику | ☐ | Premium-тема → клик по подсвеченному слову |
| P4 | GrammarTip после ошибки | ☐ | Premium → ошибка → блок грамматики |
| P5 | ×2 XP в бейдже | ☐ | Верный ответ → `+2 XP` |
| P6 | Schwächen-Modus | ☐ | Главная → ошибки в Premium-темах → карточка → trainieren |
| P7 | Magic Link + sync | ☐ | Login → 2 устройства → одинаковый XP |

**Быстрые URL (Premium-темы с вопросами):**

- A1 Plural (MC): `#/trainer?level=A1&topic=PLURAL&mode=premium`
- B2 TeKaMoLo (drag): `#/trainer?level=B2&topic=TEKAMOLO&mode=premium`
- A1 Plural (multi): вопрос `multi-select` в той же теме
- B1 Passiv (Lücke): `#/trainer?level=B1&topic=PASSIVB1&mode=premium`

---

## Типы вопросов (по одному)

| Тип | Тема / уровень | URL | Статус |
| --- | --- | --- | --- |
| select-one | A1 PLURAL | `#/trainer?level=A1&topic=PLURAL&mode=premium` | ☐ |
| multi-select | A1 PLURAL (2-й вопрос в очереди) | то же | ☐ |
| dropbox | B2 TEKAMOLO | `#/trainer?level=B2&topic=TEKAMOLO&mode=premium` | ☐ |
| input-text | B1 PASSIVB1 | `#/trainer?level=B1&topic=PASSIVB1&mode=premium` | ☐ |

---

## Аккаунт и профиль

| # | Проверка | Статус |
| --- | --- | --- |
| A1 | Free `/profile` — мини-профиль (XP, streak, Tagesziel) | ☐ |
| A2 | Premium `/profile` — сетка тем + share | ☐ |
| A3 | `/premium` Schritt 1 → 2 (login → code) | ☐ |

---

## Как отмечать

Замените `☐` на `✅` или `❌` + комментарий при провале.

После прогона обновите [TECHNICAL-AUDIT.md](./TECHNICAL-AUDIT.md) этап 5.

---

## Известные ограничения (не блокеры чеклиста)

- `TRIAL_TEST_MODE = true` в Code.gs — для QA с `+test`
- Мало контента в некоторых темах (FIX-304)
- FIX-302: итоговый +XP на экране результата без штрафов
