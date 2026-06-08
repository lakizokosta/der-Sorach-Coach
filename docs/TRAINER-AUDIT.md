# Этап 3 — Аудит тренажёра

**Дата:** 2026-06-08  
**Объект:** `Trainer.vue`, очередь, таймер, XP/streak, типы вопросов, Premium-режимы  
**Метод:** статический разбор кода + `npm run build` + `npm run questions:verify`

---

## Краткий вердикт

| Область | Оценка | Комментарий |
| --- | --- | --- |
| Архитектура (очередь, виджеты, роутинг) | ✅ Хорошо | Продуманная decoupling, баг с «прыжком» вопроса исправлен через `shallowRef` |
| Типы вопросов (4 виджета) | ✅ Работает | 60 MD-файлов валидны |
| XP + микро-фидбек | ✅ Работает | ±1/±2, level-up, mastery в тосте |
| Premium-фичи | ✅ Работает | Словарь, GrammarTip, ×2 XP, темы |
| Schwächen-Modus | ✅ Работает | Guard + `topicWrong` |
| Free-таймер 5 мин | ⚠️ Есть дыры | Обход через новую вкладку; нет сброса по календарному дню |
| Streak vs Tagesziel | ⚠️ Расхождение | Streak может начислиться за 1 вопрос при «Beenden» |
| Контент | ⚠️ Мало | ~60 вопросов, ~35 тем; Blogger был богаче |
| Экран результата | 🟡 Мелочь | `+XP` на итоге не учитывает штрафы |

**Итого:** ядро тренажёра **готово к использованию**. Критичных блокеров в логике ответов/очереди нет. Главные риски — **лимит Free** и **согласованность streak с дневной целью**.

---

## 1. Очередь вопросов (`src/utils/queue.js`)

| Проверка | Статус | Детали |
| --- | --- | --- |
| Shuffle при старте | ✅ | `shuffle()` один раз |
| Повтор после ошибки | ✅ | Re-insert через 2–5 позиций |
| Лимит попыток | ✅ | `MAX_ATTEMPTS = 3`, затем вопрос выбрасывается |
| Прогресс-бар | ✅ | По уникальным решённым (`solvedCount / total`) |
| Не прыгает на клике ответа | ✅ | `queueVersion` бампается только в `next()` |

**Замечание (низкий приоритет):** после 3 ошибок вопрос исчезает из сессии без явного сообщения пользователю.

---

## 2. Trainer view (`src/views/Trainer.vue`)

### Поток ответа

| Сценарий | Поведение | Статус |
| --- | --- | --- |
| MultipleChoice — верно с первого раза | `onAnswer` → +XP → `consumeCorrect` | ✅ |
| MultipleChoice — ошибка → потом верно | `onFirstWrong` (−XP, счётчик) → `onAnswer` с `showRetry` (без повторного XP) → `consumeWrong` | ✅ Задумано: засчитывается как ошибка |
| MultiSelect / FillBlank / DragDrop | Один выстрел `answer` | ✅ |
| Кнопка Weiter | Только после `lastAnswerResolved` | ✅ |
| Уход «Zurück» mid-session | `saveProgressEarly()` сохраняет XP | ✅ |

### Режимы

| Режим | Загрузка вопросов | Статус |
| --- | --- | --- |
| Free `?level=A1&mode=free` | `getQuestionsByLevel` | ✅ |
| Premium тема | `getQuestionsByTopic` | ✅ |
| Schwächen `?mode=schwaechen` | 3 слабых темы, premium-guard | ✅ |
| Пустая тема | Экран «Keine Fragen gefunden» | ✅ |

---

## 3. Таймер Free (5 минут)

**Реализация:** `sessionStorage` ключ `lzd_free_start_ms` + countdown 300 с.

| Проверка | Статус | Детали |
| --- | --- | --- |
| Countdown в Free | ✅ | 05:00 → 00:00 |
| Basis без лимита | ✅ | `isBasis` → таймер скрыт, режим `up` |
| Premium без лимита | ✅ | Count-up |
| Reload в той же вкладке | ✅ | Остаток времени восстанавливается |
| **Новая вкладка / инкогнито** | ❌ | `sessionStorage` пустой → снова 5 минут в тот же день |
| **Сброс в полночь** | ❌ | Лимит привязан к timestamp старта, не к календарному дню |

**FIX-301 (средний):** хранить лимит в `localStorage` с ключом `YYYY-MM-DD` (как streak), чтобы лимит был **на день на устройство**, а не на вкладку.

---

## 4. XP (`useXp.js` + Trainer)

| Проверка | Статус |
| --- | --- |
| Free +1 / −1 за ответ | ✅ |
| Premium +2 / −2 | ✅ |
| Mastery 50 правильных по теме | ✅ |
| `topicWrong` для Schwächen | ✅ |
| Микро-фидбек (тост, пульс бейджа) | ✅ |
| Синхронизация на сервер | ✅ (при логине) |

**Замечание:** штраф XP за ошибку может демотивировать новичков — продуктовое решение, не баг.

**FIX-302 (низкий):** на экране результата `finalXp = correct × multiplier` не отражает реальный дельта-XP сессии (штрафы уже применены в `totalXP`).

---

## 5. Streak и дневная цель

| Механика | Когда срабатывает | Статус |
| --- | --- | --- |
| `markActiveDay()` | Каждый ответ (`recordQuestionAnswered`) | ✅ Календарь |
| `recordActivityToday()` через daily goal | При 5-м ответе за день | ✅ |
| `recordActivityToday()` в `finish()` | При завершении сессии, если `answered ≥ 1` | ⚠️ |
| `recordActivityToday()` в `saveProgressEarly()` | При уходе «Zurück», если `answered ≥ 1` | ⚠️ |

**FIX-300 (средний):** streak для дня должен совпадать с Tagesziel — начислять `recordActivityToday()` **только** когда дневная цель выполнена (или убрать вызовы из `finish` / `saveProgressEarly`).

Сейчас пользователь может:
1. Ответить на 1 вопрос
2. Нажать «Beenden & Ergebnis» или «Zurück»
3. Получить +1 к streak, хотя на главной цель «0 / 5 Fragen»

---

## 6. Типы вопросов

`npm run questions:verify` → **60 файлов**, типы: select-one 42, multi-select 4, dropbox 6, input-text 8.

| Виджет | Файл | Статус | Заметки |
| --- | --- | --- | --- |
| select-one | `MultipleChoice.vue` | ✅ | Shuffle, красный/зелёный, `first-wrong` |
| multi-select | `MultiSelect.vue` | ✅ | Exact set match |
| dropbox | `DragDrop.vue` | ✅ | TeKaMoLo breakdown при ошибке |
| input-text | `FillBlank.vue` | ✅ | Нем. клавиатура, показ правильного ответа |
| Dispatch | `QuestionRenderer.vue` | ✅ | Fallback на MC |

**Контент:** папки `A2/SPRACHBAUSTEINEB1`, `A1/SATZSTELLUNGA2` — тема не совпадает с уровнем папки (не ломает код, путает каталог).

---

## 7. Premium-only в сессии

| Фича | Условие | Статус |
| --- | --- | --- |
| Словарь `.dict-word` | `isPrem` | ✅ |
| GrammarTip после ошибки | `isPrem` | ✅ |
| Upsell-баннер | `!isPrem` | ✅ |
| ×2 XP бейдж | `isPrem` | ✅ |
| Панель «Themen mit Fehlern» → Trainieren | `isPrem` | ✅ |

---

## 8. Рекомендуемые фиксы (по приоритету)

| ID | Приоритет | Проблема | Предложение | Статус |
| --- | --- | --- | --- | --- |
| FIX-300 | Средний | Streak за 1 ответ при Beenden | Streak только через `recordQuestionAnswered` (5 Fragen) | ✅ 2026-06-08 |
| FIX-301 | Средний | Free 5 мин обходится новой вкладкой | `useFreeDailyLimit.js` — localStorage по дате | ✅ 2026-06-08 |
| FIX-302 | Низкий | Итоговый +XP на экране результата | Показать реальную дельту или «XP gesamt» | Ожидает |
| FIX-303 | Низкий | Вопрос dropped после 3 ошибок | Тост «Thema übersprungen» | Ожидает |
| FIX-304 | Контент | Мало вопросов / неверные папки | Наполнение MD-банка | Отдельный этап |

---

## 9. Ручной чеклист (этап 5) — для вас

После деплоя пройти на https://lernziel-deutsch.de:

### Free
- [ ] A1–B2 стартуют
- [ ] Таймер тикает вниз
- [ ] После 5 мин — «Zeit abgelaufen»
- [ ] MC: красный при ошибке, зелёный при верном
- [ ] Weiter заблокирован до ответа
- [ ] Ошибочный вопрос возвращается позже в сессии

### Premium
- [ ] Тема с вопросами → сессия
- [ ] Тема без вопросов → пустой экран
- [ ] Словарь по клику на слово
- [ ] GrammarTip после ошибки
- [ ] Schwächen-Modus с главной

### Типы (по одному примеру каждого)
- [ ] select-one, multi-select, dropbox, input-text

---

## Связанные файлы

| Файл | Роль |
| --- | --- |
| `src/views/Trainer.vue` | Оркестратор сессии |
| `src/utils/queue.js` | AdaptiveQueue |
| `src/composables/useTimer.js` | Таймер |
| `src/composables/useXp.js` | XP / mastery / topicWrong |
| `src/composables/useStreak.js` | Streak / freezes |
| `src/composables/useDailyGoal.js` | 5 Fragen/Tag |
| `src/components/questions/*` | Виджеты ответов |

---

*Следующий шаг: согласовать FIX-300 / FIX-301 и внедрить, либо перейти к этапу 5 (ручной прогон чеклиста).*
