# QA-Runde 2 — детальный список всех найденных ошибок

**Дата:** 2026-06-17
**Состояние банка перед проверкой:** 10 434 файла, `npm run questions:verify` ✅ 0 ошибок.

---

## I. CRITICAL — B2 LOKALEPRÄPOSITIONENB2: Doppelartikel «am dem»

**Тип ошибки:** грамматическая (двойной артикль после слияния предлога с артиклем).
**Источник:** `scripts/b2-select-one-data.mjs::genLokalePraepositionenB2()`.
**Файлов под фикс:** **9** (3 базовых items × cycle50-фактор).

### Базовый item #1 — «Marktplatz»

```js
['Das Büro befindet sich direkt ___ dem Marktplatz.', 'am', ['in dem', 'im', 'zum', 'vom']]
```

После filling: «Das Büro befindet sich direkt **am dem** Marktplatz.»
Поскольку `am` = `an + dem`, фактическое предложение = «direkt an dem dem Marktplatz» — **Doppelartikel**.
Distractor `'in dem'` имеет тот же дефект: «direkt in dem dem Marktplatz».

**Затронутые файлы:**
- `src/questions/B2/LOKALEPRÄPOSITIONENB2/b2-lokal-001.md`
- `src/questions/B2/LOKALEPRÄPOSITIONENB2/b2-lokal-018.md`
- `src/questions/B2/LOKALEPRÄPOSITIONENB2/b2-lokal-035.md`

### Базовый item #5 — «See»

```js
['Das Hotel liegt ___ dem See.', 'am', ['in dem', 'im', 'zum', 'vom']]
```

**Затронутые файлы:**
- `src/questions/B2/LOKALEPRÄPOSITIONENB2/b2-lokal-005.md`
- `src/questions/B2/LOKALEPRÄPOSITIONENB2/b2-lokal-022.md`
- `src/questions/B2/LOKALEPRÄPOSITIONENB2/b2-lokal-039.md`

### Базовый item #7 — «Flussufer»

```js
['Die Fabrik steht ___ dem Flussufer.', 'am', ['in dem', 'im', 'zum', 'vom']]
```

**Затронутые файлы:**
- `src/questions/B2/LOKALEPRÄPOSITIONENB2/b2-lokal-007.md`
- `src/questions/B2/LOKALEPRÄPOSITIONENB2/b2-lokal-024.md`
- `src/questions/B2/LOKALEPRÄPOSITIONENB2/b2-lokal-041.md`

### Рекомендация по фиксу

Убрать `dem` из prompt и заменить distractor pool на чистые fused-формы:

```js
['Das Büro befindet sich direkt ___ Marktplatz.', 'am', ['im', 'zum', 'vom', 'beim']]
['Das Hotel liegt ___ See.', 'am', ['im', 'zum', 'vom', 'beim']]
['Die Fabrik steht ___ Flussufer.', 'am', ['im', 'zum', 'vom', 'beim']]
```

---

## II. MAJOR — A2 REFLEXIVPRONOMEN: сломанные / устаревшие hints

**Тип ошибки:** дидактическая (hint вводит ученика в заблуждение).
**Источник:** (1) файлы устарели после рефактора `verbFormHint()`; (2) сам `verbFormHint()` имеет баги для нерегулярных глаголов.
**Файлов под фикс:** **67** из 151.

### II.1 — `Modalverb + Verb …` (ellipsis вместо лексического глагола) — 9 файлов

В этих файлах options = модальные глаголы (`kannst/musst/willst/darfst`), а hint обрезан до троеточия.

| Файл | Должно быть |
|---|---|
| `a2-refl-006.md` | `Modalverb + Verb anziehen` |
| `a2-refl-008.md` | `Modalverb + Verb freuen` |
| `a2-refl-011.md` | `Modalverb + Verb ausruhen` |
| `a2-refl-021.md` | `Modalverb + Verb anziehen` |
| `a2-refl-023.md` | `Modalverb + Verb freuen` |
| `a2-refl-026.md` | `Modalverb + Verb ausruhen` |
| `a2-refl-036.md` | `Modalverb + Verb anziehen` |
| `a2-refl-038.md` | `Modalverb + Verb freuen` |
| `a2-refl-041.md` | `Modalverb + Verb ausruhen` |

### II.2 — `Reflexiv + Verb isen` (обрезанный стем `erkält`-`en`) — 3 файла

```
got:      Reflexiv + Verb isen
expected: Reflexiv + Verb erkälten
```

| Файл |
|---|
| `a2-refl-009.md` |
| `a2-refl-024.md` |
| `a2-refl-039.md` |

### II.3 — `Reflexiv + Verb gefreuen` (несуществующее слово) — 1 файл

`gefreuen` — фантазия (правильно `gefreut` как Partizip II или `freuen` как Infinitiv).

| Файл | Должно быть |
|---|---|
| `a2-refl-042.md` | `Reflexiv + Verb freuen` |

### II.4 — Partizip II вместо Infinitiv в hint — 1 файл

| Файл | Hint в файле | Должно быть |
|---|---|---|
| `a2-refl-046.md` | `Reflexiv + Verb gewaschen` | `Reflexiv + Verb waschen` |

### II.5 — Dropbox hints в старом формате `Reflexiv — finite` — 50 файлов

Эти файлы используют шаблон `Reflexiv — freue`, `Reflexiv — wasche` и т.п. (с финитной формой через тире), а единый формат — `Reflexiv + Verb freuen` (с Infinitiv через `+ Verb`).

**Глаголы и количество затронутых файлов:**

| Финитная форма | Файлов | Корректный Infinitiv |
|---|---|---|
| `freue / freut` | 6 + 3 = 9 | `freuen` |
| `wasche / wäscht` | 3 + 3 = 6 | `waschen` |
| `beeilt` | 3 | `beeilen` |
| `bereitet` | 3 | `vorbereiten` |
| `fühle` | 3 | `fühlen` |
| `interessiere` | 3 | `interessieren` |
| `kümmert` | 3 | `kümmern` |
| `sieht / sehen` | 3 + 3 = 6 | `sehen` |
| `treffen` | 3 | `treffen` |
| `verletzt` | 3 | `verletzen` |
| `ziehst` | 3 | `anziehen` |
| `erholen` | 2 | `erholen` |
| **Perfekt — habe erkältet** | 3 | `erkälten` |

**Полный список 50 dropbox-файлов:**

```
a2-refl-dd-001.md  a2-refl-dd-018.md  a2-refl-dd-035.md   ← wasche → waschen
a2-refl-dd-002.md  a2-refl-dd-019.md  a2-refl-dd-036.md   ← freut → freuen
a2-refl-dd-003.md  a2-refl-dd-020.md  a2-refl-dd-037.md   ← treffen → treffen
a2-refl-dd-004.md  a2-refl-dd-021.md  a2-refl-dd-038.md   ← beeilt → beeilen
a2-refl-dd-005.md  a2-refl-dd-022.md  a2-refl-dd-039.md   ← interessiere → interessieren
a2-refl-dd-006.md  a2-refl-dd-023.md  a2-refl-dd-040.md   ← wäscht → waschen
a2-refl-dd-007.md  a2-refl-dd-024.md  a2-refl-dd-041.md   ← habe erkältet → erkälten
a2-refl-dd-008.md  a2-refl-dd-025.md  a2-refl-dd-042.md   ← sieht → sehen
a2-refl-dd-009.md  a2-refl-dd-015.md  a2-refl-dd-026.md   ← freue → freuen
a2-refl-dd-032.md  a2-refl-dd-043.md  a2-refl-dd-049.md   ← freue → freuen
a2-refl-dd-010.md  a2-refl-dd-027.md  a2-refl-dd-044.md   ← verletzt → verletzen
a2-refl-dd-011.md  a2-refl-dd-028.md  a2-refl-dd-045.md   ← sehen → sehen
a2-refl-dd-012.md  a2-refl-dd-029.md  a2-refl-dd-046.md   ← fühle → fühlen
a2-refl-dd-013.md  a2-refl-dd-030.md  a2-refl-dd-047.md   ← ziehst → anziehen
a2-refl-dd-014.md  a2-refl-dd-031.md  a2-refl-dd-048.md   ← bereitet → vorbereiten
a2-refl-dd-016.md  a2-refl-dd-033.md  a2-refl-dd-050.md   ← kümmert → kümmern
a2-refl-dd-017.md  a2-refl-dd-034.md                      ← erholen → erholen
```

### II.6 — Audit-скрипт сам ошибается для нерегулярных глаголов (баг verbFormHint) — 3 файла

`extractInfinitiveFromOptions` в `scripts/topic-context-hints.mjs` считает Partizip II (`gesehen`, `getroffen`) валидным инфинитивом из-за -en на конце. Поэтому audit предлагает неверные «expected»:

| Файл | Hint в файле (правильный!) | Audit ожидает (ошибочно) |
|---|---|---|
| `a2-refl-029.md` | `Reflexiv + Verb sehen` ✓ | `Reflexiv + Verb gesehen` ✗ |
| `a2-refl-033.md` | `Reflexiv + Verb getroffen` ✗ | `Reflexiv + Verb triffen` ✗✗ |
| `a2-refl-048.md` | `Reflexiv + Verb getroffen` ✗ | `Reflexiv + Verb triffen` ✗✗ |

Для `a2-refl-029.md` — **hint в файле корректен**, а audit-скрипт ошибается.
Для `a2-refl-033/048.md` — оба варианта неверны: `getroffen` (Partizip) и `triffen` (несуществующее слово). Правильный hint: `Reflexiv + Verb treffen`.

### Рекомендация по фиксу

1. Расширить `finiteToInfinitive` map в `scripts/verb-hint-banks.mjs`:
   - `sah, sahst, sahen, gesehen, sieht, siehst, sehe → sehen`
   - `traf, trafst, trafen, getroffen, triffst, trifft → treffen`
   - `gefreut → freuen`, `gewaschen → waschen`, `erkältet → erkälten`
2. В `extractInfinitiveFromOptions` (в `scripts/topic-context-hints.mjs`) добавить фильтр: если слово начинается с `ge-` → пропускать как кандидата в lemma (это Partizip II).
3. Перегенерировать все `a2-refl-*.md` с флагом `--force` или удалить старые файлы.

---

## III. KNOWN — B1 RELATIVSATZB1 / WORTSCHATZB1: дубликат токена `der` в dropbox

**Тип:** архитектурное замечание (не баг данных).
**Источник:** `scripts/b1-dropbox-data.mjs`, items с `allowDuplicateWords: true`.
**Файлов:** 7.

### Item RELATIVSATZB1 #16

```js
{ hint: 'Relativsatz', allowDuplicateWords: true,
  words: ['Der', 'Artikel', 'der', 'in', 'der', 'Zeitung', 'stand', 'war', 'interessant'] }
```

**Затронутые файлы:**
- `src/questions/B1/RELATIVSATZB1/b1-rel-dd-009.md`
- `src/questions/B1/RELATIVSATZB1/b1-rel-dd-024.md`
- `src/questions/B1/RELATIVSATZB1/b1-rel-dd-039.md`

### Item WORTSCHATZB1 #1

```js
{ hint: 'Wortschatz B1', allowDuplicateWords: true,
  words: ['Nach', 'der', 'Operation', 'braucht', 'der', 'Patient', 'Rehabilitation'] }
```

**Затронутые файлы:**
- `src/questions/B1/WORTSCHATZB1/b1-ws-dd-001.md`
- `src/questions/B1/WORTSCHATZB1/b1-ws-dd-016.md`
- `src/questions/B1/WORTSCHATZB1/b1-ws-dd-031.md`
- `src/questions/B1/WORTSCHATZB1/b1-ws-dd-046.md`

**Грамматика обоих предложений корректна.** Авторская пометка `allowDuplicateWords: true` намеренно отключает проверку `assertUnique`.

**Потенциальная UI-проблема:** если в dropbox два токена идентичны (`der` и `der`), фронтенд может (а) не различать их позиции, (б) засчитывать любой `der` в любую позицию. Поведение зависит от того, как backend сверяет ответ (по индексу позиции или по последовательности).

**Рекомендация:** оставить как есть до проверки UI-поведения; альтернатива — переписать предложения с уникальными артиклями (например, «Der Artikel, **welcher** in der Zeitung stand, war interessant», «Nach **einer** Operation braucht der Patient Rehabilitation»). Или можно сделать те артикли которые дублируются в заданиях, сразу  вместе с с существительным связкой.

---

## IV. Чисто (хорошие новости)

| Проверка | Файлов | Ошибок |
|---|---|---|
| `verify-questions` | 10 434 | 0 |
| `audit-sprachbausteine` | 80 (B2 SPRACHB.) | 0 |
| `audit-genitiv` | 450 (GENITIVA2/B2 + PRÄP-GEN) | 0 |
| `audit-possessiv` | 150 (POSSESSIV B1) | 0 |
| `correct ∈ options` (10 434 файла) | — | 0 |
| Дубликаты `options` | — | 0 |
| Дубликаты `id` | — | 0 |
| Пустые `correct`/`prompt` | — | 0 |
| `multi-select` без options | — | 0 |
| `input-text` без `___` | — | 0 |
| Кодировка / CRLF / непечатные | — | 0 |

---

## V. False positives, которые я перепроверил

| # | Подозрение | Реальная причина |
|---|---|---|
| F1 | 66 файлов <100 байт (B1 VERNEINUNG, A1 NEGATION/ARTIKEL/PLURAL/DATIV) | Короткие prompt типа `Er kommt heute ___. (Verneinung)` — корректные |
| F2 | 50 файлов B2 TEKAMOLO без `___` | by design: формат «выбор корректного предложения» |
| F3 | «41 файл с DUPLICATE_OPTION» | ошибка моего первого Python-скрипта (`block.strip()` срезал первые 2 пробела). После исправления: **0 файлов** |
| F4 | DUPLICATE_WORD в B1 dropbox | помеченные `allowDuplicateWords: true` → намеренно (см. III) |

---

## Итог

**Реальные баги:** 2 (1 CRITICAL — B2 LOKAL Doppelartikel; 1 MAJOR — A2 REFLEXIV hints).
**Архитектурное замечание:** 1 (B1 dropbox дубль `der`).
**Файлов под регенерацию:** **76** (9 B2 LOKAL + 67 A2 REFLEXIV).
**Источников под правку:** **2 банка** (`b2-select-one-data.mjs`, `verb-hint-banks.mjs`) + **2 генератора-скрипта** (для дефекта `extractInfinitiveFromOptions`).
