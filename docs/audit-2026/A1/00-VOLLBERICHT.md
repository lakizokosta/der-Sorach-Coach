# A1 — Vollbericht: alle gefundenen Fehler (Audit 2026)

Уровень A1: **1654 файла, 11 тем** проверены. Все находки в одном месте.

---

## 🔴 CRITICAL — 30 файлов с реальными грамматическими/смысловыми ошибками

### C1 · POSSESSIVARTIKEL — неверный род в подсказке (1 файл)

**Файл:** `src/questions/A1/POSSESSIVARTIKEL/a1-poss-in-026.md`
**Источник:** `scripts/generate-a1-input-text.mjs` Z.99

```
Prompt:  „___ Team gewinnt heute. (ihr, mask., Nom.)"
Correct: Euer
```

**Проблема:** `Team` — **Neutrum** (das Team), не Maskulinum. Подсказка `mask.` лжёт. Ответ `Euer` остаётся правильным (для mask. и neutr. в Nom. форма совпадает), но учащийся запоминает неверное склонение по родам.

**Fix:** `(ihr, mask., Nom.)` → `(ihr, neutr., Nom.)`

---

### C2 · VERBKONJUGATION — неправильный глагол (1 файл)

**Файл:** `src/questions/A1/VERBKONJUGATION/a1-konj-dd-046.md`
**Источник:** `scripts/a1-dropbox-data.mjs` Z.156

```
hint:  „Verb — streicheln, ich"
words: ['Ich', 'streiche', 'die', 'Katze']
```

**Проблема:** `streicheln` (гладить) в 1-м лице — `streichle` (или разг. `streichel`). `streiche` — это от **`streichen`** (красить, наносить). Буквально: «Я крашу кошку».

**Fix:** `'streiche'` → `'streichle'`

---

### C3 · ADJEKTIVDEKLINATIONA1 — неверное окончание прилагательного (1 файл)

**Файл:** `src/questions/A1/ADJEKTIVDEKLINATIONA1/a1-adj-4.md`

```
Prompt:  „Das ___ Auto ist schnell."
correct: neues
```

**Проблема:** `Das` — определённый артикль (neutr. Nom.) → **слабое** склонение → `-e`. Правильно: **„Das neue Auto"**. Запись `„Das neues Auto"` грамматически неверна (сильное окончание `-es` — только без артикля: `neues Auto`).

Параллельный input-text Z.238 этот же пункт даёт правильно (`neue`).

**Fix:** `correct: neues` → `correct: neue`

---

### C4 · WECHSELPRÄPOSITIONEN — отсутствует субъект (1 файл)

**Файл:** `src/questions/A1/WECHSELPRÄPOSITIONEN/a1-wech-dd-011.md`
**Источник:** `scripts/a1-dropbox-data-2.mjs` Z.68

```
words: ['Bei', 'Regen', 'gehe', 'ins', 'Haus']
```

**Проблема:** «Bei Regen gehe ins Haus» — не полное немецкое предложение. Глагол `gehe` (1 sg.) требует субъект `ich`.

**Fix:** добавить `'ich'`: `['Bei', 'Regen', 'gehe', 'ich', 'ins', 'Haus']`

---

### C5 · DATIVA1 — **МАССОВЫЙ СИСТЕМНЫЙ БАГ** (26 файлов)

**Источники:**
- `scripts/generate-a1-input-text.mjs` `BANK.DATIVA1` (Z.340–391) — 22 испорченных пункта
- `scripts/generate-a1-select-one.mjs` `genDativ()` item Z.403 — 1 испорченный шаблон, тиражируется в 3 select-one файла
- Free item `a1-dat-4.md` — 1 ручной файл с тем же багом

**Проблема:** в шаблоне пропуск `___` стоит **перед** существительным, а `correct` содержит **то же самое существительное**. При подстановке получается дублирование.

**Все 26 затронутых файлов:**

| Файл | Prompt | Correct | Что получится при правильном вводе |
|------|--------|---------|--------------------------------------|
| `a1-dat-in-007.md` | `Ich erzähle ___ Kindern eine Geschichte.` | `den Kindern` | **„Ich erzähle den Kindern Kindern eine Geschichte."** |
| `a1-dat-in-010.md` | `Ich kaufe ___ Mutter eine Karte.` | `meiner Mutter` | **„Ich kaufe meiner Mutter Mutter eine Karte."** |
| `a1-dat-in-016.md` | `Ich spiele mit ___ Ball.` | `dem Ball` | „Ich spiele mit dem Ball Ball." |
| `a1-dat-in-017.md` | `Sie singt mit ___ Freundin.` | `der Freundin` | „… der Freundin Freundin." |
| `a1-dat-in-020.md` | `Ich gebe ___ Verkäufer Geld.` | `dem Verkäufer` | „… dem Verkäufer Verkäufer Geld." |
| `a1-dat-in-021.md` | `Der Stift gehört ___ Schüler.` | `dem Schüler` | „… dem Schüler Schüler." |
| `a1-dat-in-022.md` | `Ich schenke ___ Oma Blumen.` | `meiner Oma` | „… meiner Oma Oma Blumen." |
| `a1-dat-in-026.md` | `Aus ___ Fenster sehe ich den Park.` | `dem Fenster` | „Aus dem Fenster Fenster sehe ich …" |
| `a1-dat-in-027.md` | `Mit ___ Freunden esse ich gern.` | `meinen Freunden` | „… meinen Freunden Freunden …" |
| `a1-dat-in-028.md` | `Nach ___ Arbeit fahre ich nach Hause.` | `der Arbeit` | „… der Arbeit Arbeit …" |
| `a1-dat-in-029.md` | `Bei ___ Regen bleibe ich drinnen.` | `Regen` | **„Bei Regen Regen bleibe ich …"** |
| `a1-dat-in-030.md` | `Der Arzt hilft ___ Patient.` | `dem Patienten` | **„Der Arzt hilft dem Patienten Patient."** + ещё ошибка N-Deklination |
| `a1-dat-in-031.md` | `In ___ Schuhen laufe ich schnell.` | `den Schuhen` | „… den Schuhen Schuhen …" |
| `a1-dat-in-032.md` | `Mit ___ Gitarre spielt er ein Lied.` | `der Gitarre` | „… der Gitarre Gitarre …" |
| `a1-dat-in-033.md` | `Ich gratuliere ___ Team.` | `dem Team` | „… dem Team Team." |
| `a1-dat-in-035.md` | `Ich bringe ___ Kindern Süßigkeiten.` | `den Kindern` | „… den Kindern Kindern …" |
| `a1-dat-in-036.md` | `Ich vertraue ___ Freund.` | `meinem Freund` | „… meinem Freund Freund." |
| `a1-dat-in-037.md` | `Auf ___ Party tanzen alle.` | `der Party` | „Auf der Party Party …" |
| `a1-dat-in-038.md` | `Mit ___ Messer schneide ich Brot.` | `dem Messer` | „… dem Messer Messer …" |
| `a1-dat-in-039.md` | `In ___ Hotel übernachten wir.` | `dem Hotel` | „… dem Hotel Hotel …" |
| `a1-dat-in-041.md` | `Ich danke ___ netten Verkäuferin.` | `der Verkäuferin` | „… der Verkäuferin netten Verkäuferin." |
| `a1-dat-in-042.md` | `Mit ___ Schwester spiele ich Karten.` | `meiner Schwester` | „… meiner Schwester Schwester …" |
| `a1-dat-in-043.md` | `Ich gebe ___ Hund Wasser.` | `dem Hund` | „… dem Hund Hund Wasser." |
| `a1-dat-in-044.md` | `In ___ Bad dusche ich morgens.` | `dem Bad` | „In dem Bad Bad dusche …" |
| `a1-dat-in-045.md` | `Mit ___ Taxi komme ich schnell an.` | `dem Taxi` | „… dem Taxi Taxi …" |
| `a1-dat-in-049.md` | `Ich kaufe ___ Vater ein Geschenk.` | `meinem Vater` | „… meinem Vater Vater …" |
| `a1-dat-012.md` (select-one) | `Ich erzähle ___ Kindern eine Geschichte.` | `den Kindern` | дублирование |
| `a1-dat-027.md` (select-one) | то же | то же | дублирование |
| `a1-dat-042.md` (select-one) | то же | то же | дублирование |
| `a1-dat-4.md` (free) | то же | `den Kindern` | дублирование |

**Fix (две опции):**
- **A** (минимальный): в `correct` оставить только артикль/местоимение (`den` вместо `den Kindern`, `dem` вместо `dem Hund` и т.д.). Подсказку поправить.
- **B**: убрать существительное из prompt, оставить полную фразу в `correct`. Пример: `„Ich erzähle ___ eine Geschichte."` + `correct: „den Kindern"`.

Рекомендую вариант **A** — быстрее и сохраняет читаемость.

Дополнительно `a1-dat-in-030`: `„Patient"` → `„Patienten"` (N-Deklination).

---

## 🟠 MAJOR — методические дефекты (без неправильного немецкого, но снижают качество обучения)

### M1 · POSSESSIVARTIKEL — пул дистракторов выдаёт лицо (45 файлов)

**Источник:** `generate-a1-select-one.mjs` Z.135

Пул содержит формы всех лиц: `mein, meine, meinen, meinem, meiner, dein, deine, deinen, sein, seine, seinen, ihr, ihre, ihren, unser, unsere, euer, eure`.

Подсказка всегда называет лицо явно: `(ich, mask., Nom.)`. Учащийся тривиально отсекает дистракторы из других лиц.

**Пример** `a1-poss-006.md`:
```
options: meinen | ihr | deinen | mein
correct: mein
hint:    Possessivartikel — ich, mask., Nom.
```
Дистрактор `ihr` бесполезен — отсекается по лицу.

**Fix:** дистракторы только из форм того же лица (для `ich`: `mein, meine, meinen, meinem, meiner`).

---

### M2 · POSSESSIVARTIKEL — пул неполный для wir / ihr / 3 sg fem / 3 pl

**Источник:** тот же

Отсутствуют: `unseren, unserem, unserer, euren, eurer, eurem, seiner, seinem, deinem, deiner, ihrem, ihrer`.

Для пунктов типа `„Wir werfen ___ Ball."` (correct = `unseren`) дистракторы не могут содержать другие формы парадигмы `unser-`.

**Fix:** расширить пул либо генерировать пул динамически из парадигмы текущего лица.

---

### M3 · POSSESSIVARTIKEL — семантически странный шаблон

**Источник:** `generate-a1-select-one.mjs` Z.117

```
„Im Sommer arbeite ich in ___ Büro."
```

Почему только летом? Почему «своё» офис? Звучит неестественно — обычно говорят «im Büro».

**Fix:** заменить на `„Ich arbeite gern in ___ Büro."`

---

### M4 · VERBKONJUGATION — несогласованный формат подсказки (2 файла)

**Источник:** `a1-dropbox-data.mjs` Z.138, Z.142

```
Z.138: hint: „Verb — beginnen, der", words: ['Der', 'Kurs', 'beginnt', 'um', 'acht']
Z.142: hint: „Verb — scheinen, die", words: ['Die', 'Sonne', 'scheint', 'heute']
```

Все остальные подсказки — `„Verb — X, ich/du/er/…"` (лицо). Здесь вдруг артикль (`der`, `die`).

**Fix:** `„Verb — beginnen, 3 Sg."` или `„Verb — beginnen, der Kurs"`.

---

### M5 · VERBKONJUGATION — неоднозначное `sie` (5 файлов)

**Источник:** `generate-a1-select-one.mjs` Z.272

В шаблоне `subjects[3] = ['sie', 'sie']` форма берётся `v.sie` (= 3 Pl.).

Prompt типа `„Sie ___ ein Buch über Reisen."` грамматически допускает обе формы: `liest` (3 sg fem) ИЛИ `lesen` (3 pl / Sie формальное). Принимается только `lesen`.

В файле `a1-konj-009.md` сейчас есть хинт `„(sie (Pl.))"` как заплатка, но это разрозненный фикс.

**Fix:** заменить субъект на однозначный: `Anna` для 3 sg fem, `meine Freunde` для 3 pl (оба уже есть в массиве `subjects`).

---

### M6 · VERBKONJUGATION — `„sie Fem."` как обозначение

**Источник:** `BANK.VERBKONJUGATION` Z.185, 200, 224 (входит в input-text)

`„sie Fem."` — не стандартное немецкое грамматическое сокращение. Должно быть `„3 Sg. fem."` или конкретное имя (Anna).

---

### M7 · ADJEKTIVDEKLINATIONA1 — `keine` подменяется на `eine` в prompt (3 файла)

**Источник:** `generate-a1-select-one.mjs` Z.322–323

```js
if (it.art === 'keine' || it.art === 'eine') {
  return `[${t}] Ich habe eine ___ ${it.noun}.`;
}
```

Для пункта `{ art: 'keine', noun: 'Jacke' }` prompt становится `„Ich habe eine ___ Jacke."` вместо `„Ich habe keine ___ Jacke."` Окончание `warme` одинаково для обоих, но `keine` никогда не тренируется.

**Затронуто:** файлы `a1-adj-013.md`, `a1-adj-028.md`, `a1-adj-043.md` (item index 7, циклится).

**Fix:** разделить ветки:
```js
if (it.art === 'keine') return `[${t}] Ich habe keine ___ ${it.noun}.`;
if (it.art === 'eine')  return `[${t}] Ich habe eine ___ ${it.noun}.`;
```

---

### M8 · ADJEKTIVDEKLINATIONA1 — дистракторы из чужих корней (все 45 select-one)

**Источник:** `generate-a1-select-one.mjs` Z.314

```js
const wrongEnds = ['kleiner','kleine','kleines','kleinen','guter','gute','gutes','guten','neuer','neue','neues','neuen'];
```

Для `correct = "schöne"` дистракторы всегда из `klein/gut/neu`. Учащийся выбирает по корню `schön`, а не по окончанию. **Упражнение деградирует** — оно учит распознавать корень, не склонение.

**Fix:** генерировать дистракторы из тех же 4 окончаний текущего корня: для `schöne` → `[schöner, schöne, schönes, schönen]`.

---

### M9 · ADJEKTIVDEKLINATIONA1 — порядковое числительное под видом прилагательного

**Источник:** `BANK.ADJEKTIVDEKLINATIONA1` Z.273

```
„In der ___ Klasse sind 25 Schüler. (fünft, fem., Dat.)" → fünften
```

`fünft` — порядковое числительное, не обычное прилагательное. Тема ORDINALZAHLEN — A2. На A1 не место.

**Fix:** заменить на нормальное прилагательное, например `„ruhig"` или `„neu"`.

---

### M10 · WECHSELPRÄPOSITIONEN — неоднозначный порядок слов в dropbox

**Файл:** `a1-wech-dd-035.md`
**Источник:** `a1-dropbox-data-2.mjs` Z.91

```
words: ['Geh', 'schnell', 'in', 'den', 'Keller']
```

Возможны: `„Geh schnell in den Keller."` ✓ и `„Geh in den Keller schnell."` (грамматически допустимо, стилистически плохо). Учащийся может собрать любой вариант — валидация принимает только один.

**Fix:** заменить на однозначное: `['Geh', 'sofort', 'in', 'den', 'Keller']` или добавить уточнение, исключающее перестановку.

---

### M11 · AKKUSATIVA1 — слово из подсказки не входит в words

**Файл:** `a1-akk-dd-048.md`
**Источник:** `a1-dropbox-data-3.mjs` Z.105

```
hint:  „Akkusativ — den Hund spazieren führen"
words: ['Ich', 'führe', 'den', 'Hund']     ← spazieren отсутствует
```

Учащийся ищет `spazieren` среди слов — его нет.

**Fix:** либо добавить `spazieren` в words, либо убрать из подсказки.

---

### M12 · ARTIKEL — пул мешает заглавные и строчные

**Источник:** `generate-a1-select-one.mjs` Z.522

```js
const pool = ['Der','Die','Das','Den','ein','eine','einen','kein','keine','keinen'];
```

При prompt в начале предложения (`„___ Tisch ist wichtig."`) учащийся отсекает все строчные варианты тривиально. Реальное задание — выбрать падеж — не тренируется.

**Fix:** хранить пул в нижнем регистре, капитализировать в форматтере при позиции в начале.

---

### M13 · ARTIKEL — неоднозначность `ein`/`kein` (15 файлов)

**Источник:** `generate-a1-select-one.mjs` Z.491–520

Шаблон режима `'kein'` имеет тот же prompt, что и режим `'ein'`: `„Ich habe ___ Tisch."`. Обе формы (`einen` и `keinen`) грамматически правильны. `correct` — только `keinen`.

**Fix:** заставить контекст быть отрицательным, например `„Ich habe ___ Tisch, sondern nur einen Stuhl."` или хинт «Negation».

---

### M14 · W-FRAGEN — неоднозначная температура

**Файл:** `a1-wf-in-032.md`
**Источник:** `BANK['W-FRAGEN']` Z.532

```
„___ ist es heute draußen? — 20 Grad." → 'Wie warm'
```

Грамматически: `Wie warm`, `Wie kalt`, `Wie viel Grad` — все верны. При 20°C это может быть и тепло, и холодно (зависит от сезона).

**Fix:** либо принимать несколько ответов (`['Wie warm', 'Wie kalt', 'Wie viel Grad']`), либо изменить температуру на однозначную (`„— 30 Grad"`).

---

### M15 · GEGENTEILE — нелогичная пара sanft/hart

**Файл:** `a1-geg-dd-028.md`
**Источник:** `a1-dropbox-data-3.mjs` Z.297

```
hint:  „Gegenteil — hart / sanft"
words: ['Die', 'Pause', 'ist', 'sanft']
```

В немецком про паузу не говорят `sanft`. Естественно: `kurz`, `lang`, `erholsam`. Пара `hart ↔ sanft` обычно используется только для характера человека.

**Fix:** заменить пару, например `hart ↔ weich` со словом `Brot` или `Bett`.

---

### M16 · GEGENTEILE — `kalt` vs `kühl` оба верны

**Файл:** `a1-geg-in-003.md`
**Источник:** `BANK.GEGENTEILE` Z.609

```
„Gestern war es warm, heute ist es ___." → 'kalt'
```

`kühl` тоже грамматически верно как противоположное `warm`. Валидатор принимает только `kalt`.

**Fix:** принимать оба: `['kalt', 'kühl']`.

---

### M17 · DATIVA1 — Dropbox `Mir geht gut` (hint без `es`)

**Файл:** `a1-dat-dd-030.md`
**Источник:** `a1-dropbox-data-3.mjs` Z.32

```
hint:  „Dativ — mir geht gut"   ← правильно: „Mir geht es gut"
words: ['Mir', 'geht', 'es', 'gut']
```

В words есть `es` — а в hint нет. Типичная начальная ошибка учащихся (`*Mir geht gut`), и подсказка её повторяет.

**Fix:** hint → `„Dativ — Mir geht es gut"`.

---

### M18 · DATIVA1 — двусмысленный порядок слов

**Файл:** `a1-dat-dd-024.md`
**Источник:** `a1-dropbox-data-3.mjs` Z.26

```
words: ['Wir', 'spielen', 'nach', 'der', 'Schule']
```

Два правильных порядка: `„Wir spielen nach der Schule."` и `„Nach der Schule spielen wir."`. Валидация — только один.

---

### M19 · DATIVA1 — пункт Z.369 невозможный

**Файл:** `a1-dat-in-029.md` (уже учтён в C5)

После исправления дублирования получаем `„Bei dem Regen bleibe ich drinnen."` — стилистически плохо. Стандартно: `„Bei Regen"` (без артикля). Пункт стоит **полностью перепридумать**.

---

## 🟡 MINOR — стилистические/дидактические замечания

| Тема | Замечание |
|------|-----------|
| **Все темы** | Free-уровень (1–5 файлов) везде покрывает только 3–5 конфигураций — Premium покрывает всё, но «бесплатная» демонстрация неполная |
| **POSSESSIVARTIKEL** | Хинты очень явные: `Possessivartikel — du, fem., Nom.` — превращают задание в чтение таблицы склонений |
| **POSSESSIVARTIKEL** | `„Seine Arbeit beginnt um 8 Uhr."` — семантически неоднозначно («работа» как место или процесс) |
| **PLURAL** | `a1-pl-1.md` использует ASCII `"..."`, остальные `„..."` — кошмар немецкого пунктуатора |
| **PLURAL** | `Sportart` (BANK Z.176) — это уже A2-словарь |
| **VERBKONJUGATION** | `subjects[6] = ['Anna', 'er/sie']` — двусмысленный ключ, нужно просто `'er'` |
| **VERBKONJUGATION** | `a1-fill-2.md` (`aufstehen`) — это тема TRENNBAREVERBEN, а не VERBKONJUGATION |
| **ADJEKTIVDEKLINATIONA1** | `bei schlechtem Wetter` (Z.243) — Null-Artikel с сильным окончанием, для A1 продвинутое |
| **WECHSELPRÄPOSITIONEN** | Free-хинт `(Dativ oder Akkusativ)` слишком открыт, нужно из глагола выводить |
| **WECHSELPRÄPOSITIONEN** | Контракции `aufs, ins, im, am` не пояснены — учащийся без вступления может растеряться |
| **AKKUSATIVA1** | `Briefmarken` (BANK Z.443) — Plural без явного `(Pl., Akk.)` |
| **AKKUSATIVA1** | Hint-нотация скачет: `(der Mann, Akk.)` vs `(ein Apfel, Akk.)` |
| **ARTIKEL** | `[Schule] Ich habe ___ Idee.` — тема Schule с словом Idee, слабая связка |
| **ARTIKEL** | `Mädchen` — neutr. (Diminutiv с -chen), правило не объяснено |
| **W-FRAGEN** | `Welches/Welche/Welchen` (Z.533–538) — это **Interrogativpronomen**, не чистые W-Wörter. Тема смешивает концепции |
| **NEGATION** | Free-items охватывают `keine/keinen/kein/nicht/nie`, но нет `noch nie`, `nie mehr` |
| **NEGATION** | Позиция `nicht` в предложении не тренируется системно (для A1 — ок, для B1 — нужно) |
| **GEGENTEILE** | Многие прилагательные имеют несколько антонимов (`groß ↔ klein/winzig`), берётся только канонический |
| **GEGENTEILE** | `billig` имеет негативную коннотацию, `preiswert` нейтральнее — учащийся учится только разговорной форме |

---

## Сводная таблица по приоритетам

| Stufe | Что | Файлов | Время |
|-------|-----|--------|-------|
| **1. CRITICAL** | 5 категорий, 30 файлов с реальными ошибками | 30 | ~1–2 часа |
| **2. MAJOR** | 19 методических дефектов (пулы, неоднозначности, хинты) | разные | ~3–4 часа |
| **3. MINOR** | ~20 стилистических/дидактических замечаний | разные | опционально |

---

## Архитектурные наблюдения (не баги, но важно)

1. **Bank-файлы для одной и той же темы расходятся между собой.** Например DATIVA1: select-one пишет `„Ich kaufe ___ eine Karte."` (правильно), а input-text — `„Ich kaufe ___ Mutter eine Karte."` (с багом). Это означает, что пункты ведутся параллельно, без общего источника.
   **Рекомендация:** единый schema-источник, из которого генерируются обе формы (select-one и input-text), с автоматической проверкой на дублирование.

2. **Хинты везде слишком явные** — задание превращается в чтение таблицы. На A1 это терпимо, но для B1/B2 нужно убирать.

3. **Дистрактор-пулы часто смешивают категории**, что позволяет учащимся отсекать неверные ответы по поверхностному признаку (лицо, заглавная буква, длина), а не по сути правила.

---

**Status:** все 11 тем A1 проверены. Это полный сводный отчёт. Детальные отчёты по каждой теме лежат отдельно: `01-POSSESSIVARTIKEL.md` … `11-GEGENTEILE.md`.

**Готов применять fixes по команде пользователя.**
