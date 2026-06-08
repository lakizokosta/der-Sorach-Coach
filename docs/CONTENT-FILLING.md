# Наполнение Premium-тем вопросами

Один банк вопросов в Markdown — **два режима использования:**

| Режим | Как берутся вопросы |
| --- | --- |
| **Premium** (тема) | Только папка `LEVEL/TOPIC/` → `getQuestionsByTopic` |
| **Free** (кнопка A1 / A2 / B1 на главной) | **Все** темы уровня вместе → shuffle в `AdaptiveQueue` |

То есть каждый новый `.md` в `src/questions/B1/PASSIVB1/`:
- попадает в Premium-тему «Passiv»;
- **и** автоматически в Free-пул **B1** (вперемешку с Konjunktiv, Relativsatz и т.д.).

**B2** на главной тоже Free, но фокус наполнения — A1–B1 (как на экзамене до B1).

---

## Структура папок (обязательно)

```
src/questions/
  <LEVEL>/          ← A1 | A2 | B1 | B2
    <TOPIC_KEY>/    ← точно как key в premiumTopics.js
      slug.md       ← один вопрос = один файл
```

Примеры:

| Тема в Premium | Папка |
| --- | --- |
| A1 · Artikel | `src/questions/A1/ARTIKEL/` |
| A1 · Akkusativ | `src/questions/A1/AKKUSATIVA1/` |
| B1 · Passiv | `src/questions/B1/PASSIVB1/` |

**Ошибки сейчас в репо (перенести при миграции с Blogger):**

| Папка | Проблема |
| --- | --- |
| `A1/SATZSTELLUNGA2/` | тема A2 в уровне A1 |
| `A2/SPRACHBAUSTEINEB1/` | тема B1 в уровне A2 |

---

## Формат файла `.md`

Каждый файл = YAML frontmatter + текст задания (тело).

### select-one (один правильный)

```markdown
---
id: a1-art-003
type: select-one
options:
  - Der
  - Die
  - Das
correct: Der
---

___ Mann liest Zeitung.
```

### multi-select (несколько правильных)

```markdown
---
id: a1-plural-002
type: multi-select
options:
  - die Kinder
  - das Kind
  - die Kind
  - den Kindern
correct:
  - die Kinder
  - den Kindern
---

Welche Formen sind korrekt?
```

### input-text (Lückentext)

```markdown
---
id: b1-pass-fill-01
type: input-text
correct:
  - wurde
  - ward
---

Das Haus ___ gestern gebaut.
```

Несколько допустимых ответов — список в `correct:`.

### dropbox (Wörter sortieren / TeKaMoLo)

```markdown
---
id: b2-tekamolo-02
type: dropbox
words:
  - Ich
  - fahre
  - heute
  - mit
  - dem
  - Bus
  - nach
  - Hause
codes:
  - _
  - _
  - T
  - M
  - M
  - M
  - L
  - L
---

Ordne die Wörter zum richtigen Satz:
```

`___` в теле — для Lückentext; для dropbox тело обычно инструкция.

---

## Правила именования

| Поле | Правило |
| --- | --- |
| `id` | уникальный в проекте, латиница: `a1-art-003`, `b1-pass-12` |
| Имя файла | совпадает с `id` или `slug`: `a1-art-003.md` |
| `correct` | **точно** как в `options` (пробелы, регистр) |
| Промпт | `___` = пропуск (FillBlank / MC с лакуной) |

---

## Рабочий процесс (пошагово)

### 1. Выбрать тему

```bash
npm run questions:stats
```

Смотри блок `⬜ empty` — темы без вопросов. Начинать логично с A1 с малым числом вопросов или с приоритетных для экзамена (Passiv B1, Konjunktiv II…).

### 2. Создать папку (если нет)

```bash
mkdir -p src/questions/A1/WECHSELPRÄPOSITIONEN
```

### 3. Скопировать шаблон

Шаблоны: [`docs/question-templates/`](../docs/question-templates/)

### 4. Проверить

```bash
npm run questions:verify   # парсинг всех .md
npm run questions:stats    # покрытие тем
npm run dev                # тест в браузере
```

**Premium:** `/premium` → уровень → тема → тренировка.

**Free:** главная → **A1** (или A2/B1) → вопросы из **всех** тем уровня в случайном порядке.

### 5. Деплой

```bash
git add src/questions/
git commit -m "Add questions for TOPIC"
git push
```

Cloudflare пересоберёт бандл — **отдельный JS не нужен**.

---

## Рекомендуемые объёмы (ориентир)

| Уровень | Минимум на тему | Хорошо | Всего тем |
| --- | --- | --- | --- |
| A1 | 5 | 15–20 | 11 |
| A2 | 5 | 15–20 | 21 |
| B1 | 8 | 20–30 | 28 |
| B2 | 8 | 20–30 | 23 |

Сейчас: **~60 файлов**, большинство тем — 1–3 вопроса.

**Практичный старт:** по **5 вопросов** на 5 пустых A1-тем → сразу заметнее Free A1.

---

## Миграция с Blogger

1. Экспорт / копирование текста заданий из старого HTML/JS.
2. Разбить на отдельные `.md` по типу (`select-one` и т.д.).
3. Положить в правильную `LEVEL/TOPIC_KEY/`.
4. `questions:verify` → исправить ошибки `correct` / `options`.
5. Не дублировать `id` — иначе очередь склеит вопросы.

---

## Free-режим — как это уже работает в коде

```text
Главная → A1
  → Trainer: getQuestionsByLevel('A1')
  → все .md из A1/*/ 
  → AdaptiveQueue(shuffle) 
  → без разграничения по темам в UI
```

Ничего менять в коде для «рандома по уровню» **не нужно** — только добавлять файлы в папки.

---

## Чеклист одной темы

- [ ] Папка `src/questions/<LEVEL>/<KEY>/` совпадает с `premiumTopics.js`
- [ ] ≥5 файлов `.md` (или свой минимум)
- [ ] `npm run questions:verify` — без ошибок
- [ ] Premium: тема открывается, бейдж count > 0
- [ ] Free: на уровне встречаются вопросы из этой темы (после нескольких сессий)

---

## Команды

| Команда | Назначение |
| --- | --- |
| `npm run questions:stats` | Покрытие тем, пустые, orphans |
| `npm run questions:verify` | Валидация всех `.md` |
| `npm run build` | Сборка с новым банком |
