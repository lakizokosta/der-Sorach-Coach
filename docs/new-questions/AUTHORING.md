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

### 2026-08-26 — dropbox: запятая перед trotzdem / Konjunktionaladverbien
- Симптом: `Es regnet trotzdem fahren wir…` без запятой в поле сборки (плитки `Es regnet` | `trotzdem` | …).
- Причина: `inferDropboxCommas` пропускал `trotzdem`/`aber`/`denn`/`dann`.
- Правило:
  1. Между двумя Hauptsätzen перед Konjunktionaladverb с V2 (`trotzdem fahren wir`, `deshalb bleibt er`) — запятая (`commas` = индекс слова **перед** коннектором).
  2. Mid-clause (`wir fahren trotzdem …`) — **без** запятой.
  3. `aber` / `denn` / `sondern` между частями — запятая.
  4. Relativsatz с `in der` / `für die`: запятые вокруг придаточного (`Die Stadt, in der ich wohne, ist klein`).
- Патч банка: `node scripts/patch-dropbox-commas.mjs` (questions + questions-vocab).
- ❌ `Es regnet trotzdem fahren wir in den Urlaub.`
- ✅ `Es regnet, trotzdem fahren wir in den Urlaub.`
- Код: `src/utils/dropboxCommas.js`, UI: `DragDrop.vue` (`dd-comma`)

### 2026-08-26 — KONZESSIVSATZB1 select-one: оба коннектора темы в options
- Симптом: в `select-one` только один коннектор темы (`Obwohl` среди Damit/Dass/Deshalb/Weil) — `trotzdem` отсутствует, тема выглядит однобоко.
- Правило: в options KONZESSIV всегда держать контраст **obwohl/obschon** ↔ **trotzdem** (плюс 1–2 внетематических дистрактора вроде weil/deshalb/dass).
  - Верный ответ по слоту не менять: `___ … Verb-end` → obwohl/obschon; `…, ___ V2` → trotzdem.
  - `trotzdem` как дистрактор при obwohl-щели — ок (не открывает Nebensatz).
- ❌ options: `[Deshalb, Dass, Damit, Obwohl]`
- ✅ options: `[Deshalb, Dass, Trotzdem, Obwohl]`
- Статус: применено к **37** select-one в `src/questions/B1/KONZESSIVSATZB1/`.

### 2026-09-01 — Relativsatz wo(r)- / was: однозначность + Falle „das“
- Симптом (`RELATIVSATZERWEITERTB2`): input принимает только одну wo(r)-форму, хотя глагол допускает две (`gesprochen haben` → `worüber`/`wovon`; `stammt` → `wovon`/`woraus`); у части `was`-select-one нет дистрактора `das`; `Ursache, wodurch…` педагогически криво; клон *Land, aus ___ stammt* с Relativsätze I.
- Правило:
  1. Глагол/контекст для wo(r)- должен однозначно тянуть одну форму (`austauschen über` → `worüber`; `ausgehen von` → `wovon`; `anreisen` → `woher`) **или** перечислить все допустимые в `correct:`.
  2. Во всех `was`-select-one всегда включать дистрактор **`das`**.
  3. Антецедент для `wodurch` — событие/средство (`Unfall`, `Maßnahme`), не `Ursache`.
  4. Не копировать стемы из `RELATIVSATZB2` дословно.
- Источник: `scripts/b2-relativ-erweitert-data.mjs` → `node scripts/generate-b2-relativ-erweitert.mjs --force`

### 2026-09-01 — Plusquamperfekt B1: реальный Plq + артикли + однозначный союз
- Симптом (`PLUSQUAMPERFEKTB1`): *hatte er schon eine neue Stelle* без Partizip II; телеграф в DD (*Chef Unterlagen*, *Polizei…Diebe*); в options рядом *Bevor* и *Als* (оба возможны).
- Правило:
  1. Plusquamperfekt = **Hilfsverb + Partizip II** (не *hatte* + NP владения).
  2. В gap и dropbox — полные артикли; без телеграфных Nomen.
  3. В `select-one` на Konjunktion не ставить конкурирующие темпоральные (*Nachdem* / *Bevor* / *Als*) в одном пуле — дистракторы *Weil/Obwohl/Damit/Während*.
  4. Dropbox: одна запятая (NS, HS); слова-уники (без дублей чипов).
- Источник: `scripts/b1-plusquamperfekt-data.mjs` → `node scripts/generate-b1-plusquamperfekt.mjs --force`


### 2026-09-02 — Full-bank audit Sprint B/C: дедуп клонов
- Симптом: grammar ratio ~0.21 (150 файлов / ~31 unique) → placement кормит повторами.
- Правило: один stem = один файл на тип; **не** размножать `items[i % len]` до 50.
- Fix: `bank()` / `ensure50` без cycling; TEKAMOLO/OBJ — уникальный prompt (`Bausteine:` / `Wörter:`); `scripts/dedupe-grammar-prompt-clones.mjs`.
- Результат: все grammar-темы **uniqueBodies/files = 1.0** (было 76 тем <0.85).
- ❌ `Welche Satzstellung…?` ×50 с разными options  
- ✅ `Welche Satzstellung…?\nBausteine: morgen · wegen…` — один stem на карточку


### 2026-09-02 — Full-bank audit Sprint A (handoff `AUDIT-FULL-BANK-2026-09-02`)
- Orphan `A2/SATZSTELLUNGA2` (2 stub files) → `docs/_orphans/A2/SATZSTELLUNGA2/`; placement filters to `PREMIUM_TOPICS`.
- Cross-bank id collision: grammar `b2-rede-in-*` → `b2-rede-g-in-*` (vocab keeps `b2-rede-in-*`).
- Dropbox: batch final `.`/`?` in sources + runtime `ensureDropboxStatementPunctuation`.
- Vocab multi-select: sentence options/correct get final `.`/`?`.
- A2 `INDEFINITPRONOMEN`: 50 unique stems with pinned polarity (no bare *Hier ist ___ zu Hause*).
- Script: `scripts/patch-audit-p0-2026-09-02.mjs`.


### 2026-09-02 — Pronominaladverbien B2: щель на наречии, не на глаголе
- Симптом (`PRÄPOSITIONALADVERBIENB2`): *Hierauf ___ die ganze Argumentation* + options *bauen/baut…*, инструкция «Ergänze das Pronominaladverb» — наречие уже дано, ответ = глагол; смысл и задача непрозрачны.
- Правило: в теме Pronominaladverbien пробел **только** на *da-/wo-(hier-)* форме. Контекст (вопрос с Präp. или ответная реплика) однозначно задаёт форму. Дистракторы — другие Pronominaladverbien, не спряжения глагола.
- ❌ `Hierauf ___ die ganze Argumentation.` / correct `baut`
- ✅ `Baut die Argumentation auf dieser These? — Ja, sie baut ___.` / correct `darauf`
- Источник: `scripts/b2-select-one-data.mjs` → `genPraepositionaleAdverbienB2` + `--force` select-one/input-text.


### 2026-09-02 — Indefinitpronomen: однозначность jemand/niemand/etwas
- Симптом (`INDEFINITPRONOMEN` B2, частично A2): *Hast du ___ in der Menge gesehen?* с options *jemanden/etwas/niemanden* — несколько грамматически верных ответов.
- Правило: Indefinitpronomen в щели однозначны через **контекст** (50/50):
  1. Inline: *von deinen Freunden / von den Kollegen / unbedingt / völlig neu…*
  2. Или короткая **Vorgeschichte** строкой выше предложения с `___`.
- Дистракторы: падежные ловушки (*jemand* vs *jemanden*) ок; конкурирующая полярность (*niemanden* при ключе *jemanden*) — только если контекст её отсекает.
- Источник B2: `scripts/b2-select-one-data.mjs` → `node scripts/generate-b2-select-one.mjs --force --topic=INDEFINITPRONOMEN` + input-text.


### 2026-08-21 — dropbox: «?» у всех прямых вопросов (не только W-Fragen)
- Симптом: Ja/Nein-вопрос в dropbox без `?` (`Kann ich das auf den Tisch legen ja gern`) — ученик не видит, что это вопрос; раньше авто-`?` работал только для темы `W-FRAGEN`.
- Правило:
  1. В `words` у прямого вопроса — плитка `?` (для мини-диалога Frage+Antwort: `… legen ? Ja gern .`).
  2. В UI (`DragDrop.vue`) знаки `.?!` **не** перетаскиваются — фиксируются у нужного слова; `?` виден с самого начала.
  3. Runtime: `ensureDropboxInterrogativePunctuation` в `questionPunctuation.js` дописывает знаки, если их нет в `.md`.
- ❌ `Kann ich … legen ja gern`
- ✅ `Kann ich … legen ? Ja gern .`
- Код: `src/utils/questionPunctuation.js`, `src/utils/dropboxPunctuation.js`, `src/components/questions/DragDrop.vue`

### 2026-09-14 — input-text: базовое слово сразу в скобках после предложения
- Симптом (N-Deklination u. a.): `Ich kenne einen ___.` без `(Junge)` — непонятно, что склонять; форма была только под 💡 Tipp (`hint: N-Deklination — junge, Akk.`).
- Причина: `FillBlank` снимал trailing `(…)` с prompt, а `hint`/`lemma` показывались только после Tipp. У глаголов уже был `Infinitiv: …`, у form-filling — нет.
- Правило для **всех** `input-text` с формой от базового слова:
  1. В UI сразу после предложения: `(Lemma)` / базовый артикль+Nomen / Gegenteil-von / Plural-Stamm.
  2. Источник: `lemma` → сегмент после `—` в `hint` → `Gegenteil von X` / `Plural: X` → trailing `(…)`.
  3. 💡 Tipp остаётся для падежа/рода/темы (`…, Akk.`).
  4. Не дублировать, если уже есть `Infinitiv:` или `wordChoices`.
- ❌ только Tipp: `N-Deklination — Junge, Akk.`
- ✅ сразу: `Ich kenne einen ___. (Junge)` + Tipp с полным hint
- Код: `src/utils/inputTextGapCue.js`, `FillBlank.vue`

### 2026-09-15 — dropbox: не склеивать придаточные в 2 мега-плитки
- Симптом (Plusquamperfekt u. a.): вместо слов две плитки `Als sie den Raum betrat` | `hatte jemand das Fenster geöffnet` — задание почти без выбора.
- Причина: `chunkifyDropboxWords` → `tryClauseSegments` по `commas` резал на целые NS/HS.
- Правило: при наличии `commas` — **одна плитка = одно слово**; запятая и `.`/`?` остаются фиксированными в UI (`DragDrop`), не чипами.
- Phrase-grouping (артикли/предлоги) — только у длинных предложений **без** фиксированных запятых.
- ❌ 2 куска-придаточных  
- ✅ `Als` `sie` `den` `Raum` `betrat` `,` `hatte` … `geöffnet` `.`
- Код: `src/utils/dropboxChunks.js`

### 2026-09-22 — dropbox: запятая после Ja / Nein / Doch (Antwortpartikel)
- Симптом: `Nein die Wohnung ist günstig .` — точка фиксирована (салатовая), запятой нет; ученик не видит норму *Nein, …*.
- Правило: как `.`/`?`, запятые **фиксированы в UI** (`dd-comma`), не чипы. После *Ja* / *Nein* (и *Doch* как ответ) — запятая, если дальше есть слова. Adversative mid-clause *doch* — запятая **перед** ним (как раньше).
- Инференс на **core words** (без `.?!` в списке).
- ❌ `Nein die Wohnung ist günstig.`
- ✅ `Nein, die Wohnung ist günstig.`
- Код: `src/utils/dropboxCommas.js`; патч банка: `node scripts/patch-dropbox-commas.mjs`

### 2026-09-22 — dropbox: запятая после начального Nebensatz (Wenn/Als …, HS)
- Симптом: `Wenn ihr müde seid solltet euch ausruhen` / `Als Maria anrief hatte Tom…` без запятой между NS и HS.
- Причина: (1) `commaAfterV1Subordinate` искал только узкий `MAIN_FINITE` и ставил индекс на слово *перед* глаголом NS; (2) `Als` + имя (`Maria`) ошибочно считалось ролевым *Als Abgeordneter*.
- Правило:
  1. После финитного глагола начального Nebensatz — запятая, если дальше идёт второй финит (Hauptsatz).
  2. *Als* + CapWord: роль без запятой при **одном** фините (`Als Kind wohnte ich…`); темпоральный NS при **≥2** финитах (`Als Maria anrief, hatte…`).
  3. *Während des/der…*, *Seit dem…* — по-прежнему без NS-запятой.
- ❌ `Als wir in Berlin lebten lernte ich viel.`
- ✅ `Als wir in Berlin lebten, lernte ich viel.`
- Код: `src/utils/dropboxCommas.js`; патч: `node scripts/patch-dropbox-commas.mjs`

### 2026-10-01 — trennbare Verben im Nebensatz: Präfix nicht abtrennen
- Симптом (`a2-konj-in-010`): `Er fragt, ob wir mit zum Zoo kommen.` — приставка *mit* оторвана от глагола внутри Nebensatz.
- Правило: в Nebensatz (после *ob/dass/weil/wenn/als…*, в Relativsatz, в косвенном вопросе) отделяемый глагол стоит **слитно в конце**. Приставка отделяется только в Hauptsatz (V2/V1).
- Проверка набора: скан всех Nebensätze в `src/questions*` и `scripts/` на «приставка … глагол в конце» — других случаев нет.
- ❌ `Er fragt, ob wir mit zum Zoo kommen.`
- ✅ `Er fragt, ob wir zum Zoo mitkommen.`
- Источник: `scripts/a2-input-text-data.mjs`

### 2026-09-22 — Modalverben A2: контекст, один верный Modal
- Симптом: `Ich ___ heute nicht arbeiten` + options *kann/will/darf/muss* — все грамматически возможны; система принимает только *muss*.
- Правило для **select-one / input-text** Modalverben (A1–B2, будущие темы):
  1. В предложении (или короткой строке выше) — контекст, который тянет **ровно один** Modal: Pflicht (*Vertrag/Feiertag*), Fähigkeit (*Kurs/Schlüssel*), Erlaubnis (*Schild/bitte*), Rat (*Arzt sagt*), Wunsch/Plan (*Lust/Plan/Wunsch*).
  2. Дистракторы — другие Modalформы того же лица; без «пустого» gap.
- ❌ `Ich ___ heute nicht arbeiten.` / correct `muss`
- ✅ `Heute ist Feiertag. Laut Vertrag ___ ich nicht arbeiten.` / correct `muss`
- Источник: `scripts/a2-select-one-data.mjs` (`genModalverben`), `a2-input-text-data.mjs`, `a2-dropbox-data.mjs`
