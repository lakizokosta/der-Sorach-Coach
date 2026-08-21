# Авторство заданий — зафиксированные правила

Документ для ручной проверки и для агента-преподавателя.  
Cursor-правила: `.cursor/rules/question-authoring.mdc`, `.cursor/rules/question-punctuation.mdc`.

---

## 1. Роль агента

- Преподаватель немецкого для тренажёра Der SprachCoach.
- Контроль: грамматика, логика предложения, однозначность ответа, уровень, дистракторы.
- Перед большим набором — **уточнять** условия; оптимизировать таск (объём, типы, фокус лексики).
- Каждый раз создавать **реальные `.md`-файлы на диске** для ручной проверки — не только текст в чате.

---

## 2. Типы упражнений

| `type` | UI | Назначение |
|--------|-----|------------|
| `select-one` | Multiple choice | один правильный |
| `multi-select` | Multi-select | несколько правильных |
| `dropbox` | Drag & drop | порядок слов |
| `input-text` | Fill in | ввод / выбор формы |
| `text-gaps` | Text gaps | Vorgeschichte + 1–2 пропуска; ответ из предистории |

Не путать дубли названий: Multiple choice = `select-one`, Drag & drop = `dropbox`, Fill in = `input-text`.

Шаблоны: `docs/question-templates/`.  
Парсер / проверка: `src/utils/markdownQuestion.js`, `npm run questions:verify` (после переноса в банк).

---

## 3. Workflow файлов

```
docs/new-questions/<тема>/
  README.md                 ← обзор для проверки
  A2|B1|B2/
    select-one|multi-select|dropbox|input-text|text-gaps/
      <id>.md               ← один вопрос = один файл
```

1. **Черновик** → `docs/new-questions/<tema>/…`
2. **Ручная проверка** владельцем
3. **Перенос** в банк (иначе тема **не появится** в тренажёре):
   - грамматика: `src/questions/<LEVEL>/<TOPIC_KEY>/`
   - словарь: плоская папка `src/questions-vocab/<LEVEL>/<SET_KEY>/*.md` + запись в `src/data/vocabularySets.js`
   - проверка: `npm run vocab:verify-sets` и `npm run questions:verify:vocab`
4. Новые леммы → `src/data/vocabulary.json` (`pos`, `ru`, `en`, `gender` для Nomen)

Имена файлов = `id` (пример: `a2-arzt-so-001.md`).

---

## 4. Согласованные параметры контента

| Параметр | Правило |
|----------|---------|
| Регистр | Формальный **Sie** (врач, ресепшен, клиника) |
| `hint` | Только **немецкий** |
| Инструкции в теле | Немецкий (как в существующем банке) |
| `text-gaps` | Короткая **Vorgeschichte** + вопрос–ответ; **1–2** `___`; ответ однозначно из предистории |
| `multi-select` | 5–6 вариантов, 2–3 верных |
| Уникальность | Внутри уровня — без повторов смысла; между уровнями сценарий может повториться с другой лексикой |
| Лестница уровня | A2 проще → B1 детальнее → B2 формальный регистр / клиника / анамнез |
| **Дистракторы** | **Обязательно для всех уровней (A1–B2) и всех будущих тем** — см. §4.1 |

### 4.1 Дистракторы (обязательно, все уровни)

Действует для **каждого** нового набора (Wortschatz и Grammatik), на **A1 / A2 / B1 / B2**, для типов:

`select-one` · `input-text` (`wordChoices`) · `text-gaps` (ряды options) · ложные опции `multi-select`

1. **Только лексика темы** — никаких внетематических слов (`Fahrrad`, `Kino`, `Pizza`, `Fenster`…).
2. **Один верный в щели** — остальные варианты из темы, но отсекаются грамматикой и/или смыслом.
3. Приёмы отсечения: род/число/падеж, коллокация, контекст ситуации.
4. На B1/B2 дистракторы могут быть ближе по звучанию/полю (*Überweisung / Untersuchung*), но всё равно тематические и однозначные.

```markdown
❌ wordChoices: [Kopfschmerzen, Fahrrad, Fenster]
✅ wordChoices: [Kopfschmerzen, Fieber, Husten]
   # при «starke ___» грамматически подходит только Kopfschmerzen
```

Применено к черновику **Beim Arzt** на A2 + B1 + B2 (все типы с вариантами ответа).

Vocab-метаданные в frontmatter:

```yaml
lemma: Kopfschmerzen
set: BEIM_ARZT
focus: word
```

---

## 5. Пунктуация (обязательно)

### Тело
- Каждое предложение: `.` / `?` / `!` в конце.
- Вопросы → `?`. Императив с Sie → `.`.
- Не оставлять голую метку сцены:  
  ✅ `An der Rezeption: Haben Sie Ihre Versicherungskarte dabei?`  
  ❌ отдельная строка `An der Rezeption:` без знака у фразы.
- Нет пробела перед знаком; после `,` — пробел.

### dropbox `words`
- Вопрос: последняя плитка `?`
- Утверждение / императив: последняя плитка `.`
- Инструкция: `Ordne die Wörter zum richtigen Satz (Thema).`

### multi-select
- Опции-предложения тоже с `.` или `?`.

---

## 6. Грамматика — типовые ловушки

- **Атрибутив vs предикатив:**  
  ✅ `Sie werden stationär aufgenommen.` / `Der Schmerz ist stechend.`  
  ❌ `eine stationär Aufnahme` / `einen stechend Schmerz` (нужны окончания или переформулировка).
- `correct` ∈ `options` (точное совпадение, включая пунктуацию в опции).
- `text-gaps`: число `___` = длина `correct` = длина `options`; в каждой строке options ровно **3** варианта через запятую.
- **Дистракторы:** только лексика темы; в пробеле однозначно верен один ответ (см. §9).

---

## 7. Чеклист перед сдачей набора

- [ ] Уточнены уровень, тема, типы, объём, фокус лексики
- [ ] Файлы лежат в `docs/new-questions/<tema>/…`
- [ ] Есть `README.md` с таблицей объёма
- [ ] Нет дублей смысла внутри уровня
- [ ] Пунктуация в теле и в dropbox `words`
- [ ] Дистракторы только по теме + единственный верный ответ (§4.1) — на **всех** уровнях набора
- [ ] У `text-gaps` есть Vorgeschichte; ответ не угадывается без неё (§9)
- [ ] Согласование прилагательных / артиклей проверено
- [ ] Новые слова добавлены в `vocabulary.json`
- [ ] Парсер не ругается на выборке (`parseQuestionFile` / после переноса `questions:verify`)

---

## 8. Пример темы: Beim Arzt

- Черновики: `docs/new-questions/beim-arzt/`
- Источник данных / регенерация: `scripts/beim-arzt/*.mjs`, `node scripts/generate-beim-arzt-drafts.mjs`
- После правок в `scripts/beim-arzt/` — **перегенерировать**, не править сотни `.md` вручную точечно без синхронизации источника.

---

## 9. Журнал типовых ошибок (живёт вместе с правками)

Правило работы: **нашли баг → исправили в источнике + `.md` → добавили строку сюда**, чтобы не повторять.

Формат записи:

```
### YYYY-MM-DD — краткий заголовок
- Симптом: …
- Почему плохо: …
- Правило: …
- Пример ❌ / ✅
```

### 2026-08-11 — атрибутив без окончания (Adj.)
- Симптом: `eine ___ Aufnahme` / `einen ___ Schmerz` с ответом `stationär` / `stechend`.
- Почему плохо: перед Nomen нужны окончания (`stationäre`, `stechenden`).
- Правило: для тренировки леммы в базовой форме писать предикатив/наречие или склонять ответ.
- ❌ `Bei Komplikationen ist eine stationär Behandlung nötig.`
- ✅ `Bei Komplikationen behandeln wir Sie stationär.`

### 2026-08-11 — пунктуация в dropbox
- Симптом: собранный вопрос/утверждение без финального знака в `words`.
- Правило: вопрос → плитка `?`; утверждение/императив Sie → плитка `.`; инструкция с точкой: `Ordne die Wörter zum richtigen Satz (Thema).`

### 2026-08-11 — голая метка сцены
- Симптом: отдельная строка `An der Rezeption:` без предложения.
- Правило: склеивать с репликой: `An der Rezeption: Haben Sie …?`

### 2026-08-11 — multi-select опция-предложение без точки
- Симптом: `Wirkung verändert sich` как option.
- Правило: полноценные предложения в options тоже с `.` / `?`; `correct` должен совпадать с option **включая** знак.

### 2026-08-11 — порядок пропусков в text-gaps
- Симптом: `correct: [Tablette, dreimal]` при теле `Nehmen Sie ___ am Tag eine ___.`
- Правило: порядок `correct` / `options` строго слева направо по `___`.

### 2026-08-11 — дистракторы только по теме + единственный верный
- Симптом: в `wordChoices` / `options` слова вне темы (`Fahrrad`, `Fenster`) или несколько вариантов одинаково подходят (`starke Kopfschmerzen` / `starke Halsschmerzen`).
- **Область:** все уровни A1–B2, все будущие темы, не только Beim Arzt.
- Где в файле: `select-one`, `input-text` (`wordChoices`), `text-gaps` (ряды options), ложные опции `multi-select`.
- Правило: см. §4.1.
- Приёмы отсечения: неверный род/падеж/число (`starke Fieber` ✗), неверная коллокация (`Grad Husten` ✗), неверный контекст (`Medizin in der Rezeption` ✗).
- ❌ `wordChoices: [Kopfschmerzen, Fahrrad, Fenster]`
- ✅ `wordChoices: [Kopfschmerzen, Fieber, Husten]` при `starke ___` (только Plural *Kopfschmerzen* согласуется)
- Статус Beim Arzt: применено к **A2, B1, B2** (перегенерация черновиков).

### 2026-08-11 — text-gaps: Vorgeschichte перед пропусками
- Симптом: без контекста несколько вариантов из `options` одинаково грамматически верны (`Fieber`/`Husten`, `drei`/`zehn`).
- Правило для **всех** будущих `text-gaps` (A1–B2):
  1. Перед диалогом/предложениями с `___` — короткая немецкая **Vorgeschichte** (2–4 предложения).
  2. Предистория **не** содержит само слово-ответ (и не делает вопрос бессмысленным: не спрашивать «Haben Sie Fieber?», если уже названо Fieber).
  3. Из предистории однозначно следует только `correct` для каждого пропуска.
  4. `hint`: `Lesen Sie die Vorgeschichte` (или аналог).
  5. В UI переносы строк поддерживаются (`TextGaps.vue` → `white-space: pre-wrap`).
- Пример: см. `docs/new-questions/beim-arzt/A2/text-gaps/a2-arzt-tg-002.md`.

### 2026-08-11 — input-text: Infinitiv-подсказка не должна выдавать ответ
- Симптом: при `focus: word` / `lemma: Husten` UI показывает `Infinitiv: husten` — ответ угадывается.
- Причина: существительные на `-en` (`Husten`, `Niesen`…) проходят эвристику «похоже на инфинитив» в `resolveInputTextInfinitive`.
- Правило: если `lemma` совпадает с `correct` (без учёта регистра) — **не** показывать Infinitiv-строку. Infinitiv только когда ответ — спрягаемая форма глагола, а lemma — настоящий инфинитив.
- ❌ `lemma: Husten` + `correct: [Husten]` → `Infinitiv: husten`
- ✅ та же карточка → только тематический `hint` (напр. `Symptom`), без Infinitiv
- Код: `src/utils/inputTextInfinitive.js`

### 2026-08-21 — dropbox: «?» у всех прямых вопросов (не только W-Fragen)
- Симптом: Ja/Nein-вопрос в dropbox без `?` (`Kann ich das auf den Tisch legen ja gern`) — ученик не видит, что это вопрос; раньше авто-`?` работал только для темы `W-FRAGEN`.
- Правило:
  1. В `words` у прямого вопроса — плитка `?` (для мини-диалога Frage+Antwort: `… legen ? Ja gern .`).
  2. В UI (`DragDrop.vue`) знаки `.?!` **не** перетаскиваются — фиксируются у нужного слова; `?` виден с самого начала.
  3. Runtime: `ensureDropboxInterrogativePunctuation` в `questionPunctuation.js` дописывает знаки, если их нет в `.md`.
- ❌ `Kann ich … legen ja gern`
- ✅ `Kann ich … legen ? Ja gern .`
- Код: `src/utils/questionPunctuation.js`, `src/utils/dropboxPunctuation.js`, `src/components/questions/DragDrop.vue`
