# QA-Runde 2 — повторная проверка всех вопросов (A1–B2)

**Дата:** 2026-06-17.
**Состояние банка:** 10 434 файла, 0 ошибок `verify`.
**Метод:** запуск всех имеющихся аудит-скриптов + структурные сверки + выборочная инспекция.

**STATUS:** ✅ **ВСЕ НАЙДЕННЫЕ БАГИ ИСПРАВЛЕНЫ** — все 7 аудит-скриптов проходят с 0 ошибок. См. финальный блок «Применённые фиксы» в конце документа.

## Запущенные проверки

| Скрипт | Результат |
|---|---|
| `npm run questions:verify` | ✅ 10 434 файла, 0 ошибок parse / структуры |
| `npm run questions:audit` | ⚠️ **25 issue(s) в 16 файлах** (см. ниже) |
| `npm run questions:audit-dropbox` | ⚠️ 1 issue (intentional, `allowDuplicateWords: true`) |
| `npm run questions:audit-sprach` | ✅ 80 файлов, 0 ошибок |
| `npm run questions:audit-reflexiv` | ⚠️ **67 hint mismatches** в A2 REFLEXIVPRONOMEN |
| `npm run questions:audit-genitiv` | ✅ 450 файлов, 0 ошибок |
| `npm run questions:audit-possessiv` | ✅ 150 файлов, 0 ошибок |
| Структурный обход (correct ∈ options, dup options, размеры, encoding) | ✅ 0 новых ошибок |

## Найденные баги

### CRITICAL #1 — B2 LOKALEPRÄPOSITIONENB2: Doppelartikel (`am dem`)

**Затронуто:** 9 `.md`-файлов (3 базовых items × cycle-фактор), генератор `b2-select-one-data.mjs::genLokalePraepositionenB2`.

**Проблема:**
```
['Das Büro befindet sich direkt ___ dem Marktplatz.', 'am', ['in dem', 'im', 'zum', 'vom']]
['Das Hotel liegt ___ dem See.', 'am', ['in dem', 'im', 'zum', 'vom']]
['Die Fabrik steht ___ dem Flussufer.', 'am', ['in dem', 'im', 'zum', 'vom']]
```

После заполнения correct = `am`: «Das Büro befindet sich direkt **am dem** Marktplatz.» Поскольку `am` = `an + dem`, после filling получаем `an dem dem` — двойной артикль. **Грамматическая ошибка**.

Дополнительная проблема: distractor pool содержит `'in dem'` — raw form. После filling «direkt in dem dem Marktplatz» — тоже двойной артикль.

**Затронутые файлы (cycle50 c 17 base items):**
- base #1 (Marktplatz) → `b2-lokal-001.md`, `b2-lokal-018.md`, `b2-lokal-035.md`
- base #5 (See) → `b2-lokal-005.md`, `b2-lokal-022.md`, `b2-lokal-039.md`
- base #7 (Flussufer) → `b2-lokal-007.md`, `b2-lokal-024.md`, `b2-lokal-041.md`

**Severity:** CRITICAL — некорректная немецкая грамматика, ученик видит «am dem» как «правильный» ответ.

**Решение:**
- Убрать `dem` из prompt-а (используем существительное без артикля): `'Das Büro befindet sich direkt ___ Marktplatz.'`
- distractor pool заменить на чистые fused-формы: `['im', 'zum', 'vom', 'beim']`.

### MAJOR #2 — A2 REFLEXIVPRONOMEN: устаревшие/сломанные hints

**Затронуто:** **67 файлов** из 151 — почти половина.

**Примеры:**
| Файл | Hint в файле | Что должен быть |
|---|---|---|
| `a2-refl-006.md` | `Modalverb + Verb …` (ellipsis) | `Modalverb + Verb anziehen` |
| `a2-refl-009.md` | `Reflexiv + Verb isen` | `Reflexiv + Verb erkälten` |
| `a2-refl-014.md` | `Reflexiv + Verb gesehen` | `Reflexiv + Verb sehen` |
| `a2-refl-033.md` | `Reflexiv + Verb getroffen` | `Reflexiv + Verb treffen` |
| `a2-refl-042.md` | `Reflexiv + Verb gefreuen` (фантазийное слово!) | `Reflexiv + Verb freuen` |
| `a2-refl-046.md` | `Reflexiv + Verb gewaschen` | `Reflexiv + Verb waschen` |

**Корневые причины:**

1. **Файлы устарели** — hint встраивался старым алгоритмом. После рефактора `verbFormHint()` файлы не были перегенерированы.
2. **Сама `verbFormHint()` содержит баги для нерегулярных глаголов**:
   - Для options `[siehst, sah, gesehen, sehen]` функция возвращает `gesehen` (Partizip II) вместо `sehen` (Infinitiv), потому что `extractInfinitiveFromOptions` принимает любое слово, оканчивающееся на `-en`, как инфинитив.
   - Аналогично `getroffen → treffen` рушится; `triffst` (через `slice(0,-1)+'en'`) даёт `triffen` — несуществующее слово.

**Severity:** MAJOR — hints вводят ученика в заблуждение, показывая ему неправильные глаголы или Partizip II вместо Infinitiv.

**Решение:**
- Расширить `finiteToInfinitive` map в `scripts/verb-hint-banks.mjs` всеми неправильными глаголами темы (sehen/sah/gesehen → sehen; treffen/traf/getroffen/triffst/trifft → treffen; freuen/gefreut → freuen; waschen/gewaschen/wäscht → waschen; erkälten/erkältet → erkälten; …).
- Поправить `extractInfinitiveFromOptions` так, чтобы он отбраковывал слова, начинающиеся с `ge-` (Partizip II).
- Регенерировать все 151 `a2-refl-*.md` с `--force`.

### KNOWN — B1 RELATIVSATZB1 / WORTSCHATZB1: intentional duplicate `der` в dropbox

**Затронуто:** 7 файлов:
- `b1-rel-dd-009.md`, `b1-rel-dd-024.md`, `b1-rel-dd-039.md`
- `b1-ws-dd-001.md`, `b1-ws-dd-016.md`, `b1-ws-dd-031.md`, `b1-ws-dd-046.md`

**Предложения:** «Der Artikel, der in der Zeitung stand, war interessant.» и «Nach der Operation braucht der Patient Rehabilitation.» — содержат 2× `der`.

**Это `allowDuplicateWords: true`** — авторская пометка, обходящая `assertUnique`. **Грамматика предложений корректна.**

**Потенциальная UI-проблема:** в `dropbox` пользователь перетаскивает токены. Если два токена идентичны (`der` и `der`), фронтенд может (а) не различать их позиции, (б) засчитывать любой `der` в любую позицию. Если backend сверяет порядок по `words`-массиву поочерёдно — тогда любое размещение `der`-токенов идентично правильному, никакой ошибки. Если по позициям через ID — потенциальный баг UI.

**Рекомендация:** оставить как есть, либо переписать предложения, чтобы один `der` стал другим словом (например, заменить артикль перед существительным).

### NOT-A-BUG / FALSE POSITIVES, что я перепроверил

| # | Подозрение | Реальность |
|---|---|---|
| F1 | 66 файлов <100 байт | Короткие prompts типа `Er kommt heute ___ . (Verneinung)` — нормально |
| F2 | 50 файлов B2 TEKAMOLO без `___` | by design — это «выбор корректного предложения», не fill-in-blank |
| F3 | «41 файл с DUPLICATE_OPTION» | Ошибка моего Python-скрипта на первом проходе. Корректная проверка показала **0 дубликатов** |
| F4 | `audit-question-bank` нашёл `[DUPLICATE_WORD]` в B1 dropbox | Это и есть `allowDuplicateWords: true` items — намеренная пометка |

## Что НЕ найдено (хорошие новости)

- ❌ Нет файлов с `correct ∉ options` (ни одного).
- ❌ Нет файлов с дублирующимися `options`.
- ❌ Нет файлов с пустыми `correct` / `prompt`.
- ❌ Нет дубликатов id (ни одного в 10 434 файлах).
- ❌ Нет проблем в B2 SPRACHBAUSTEINEB2 (40 файлов exam-формата чистые).
- ❌ Нет нарушений в темах Genitiv (450 файлов) и Possessivartikel (150 файлов).

## Итого

**Реальных багов:** **2** (один CRITICAL, один MAJOR) + при глубоком осмотре B2 LOKAL найдены **9 дополнительных скрытых items** с тем же CRITICAL-паттерном (Doppelartikel `an der der`, `auf dem dem`, `neben der der` и т.п.).
**Архитектурное замечание:** **1** (`allowDuplicateWords` в B1 dropbox) — также исправлено.
**Файлов под фикс:** 50 (B2 LOKAL целиком регенерировано) + 100 (A2 REFLEXIV select-one + dropbox) + 100 (B1 RELATIV+WORTSCHATZ dropbox) = **250 .md-файлов** регенерировано.

См. `docs/audit-2026/QA-RUNDE-2-DETAILS.md`.

---

## Применённые фиксы

### 1. CRITICAL — B2 LOKALEPRÄPOSITIONENB2 (12 базовых items)

**Источник:** `scripts/b2-select-one-data.mjs::genLokalePraepositionenB2()`.

Из prompts убран дублирующийся артикль после `___`, distractor pools у fused-форм заменены на чистые fused-формы:

| До | После |
|---|---|
| `'... ___ dem Marktplatz.', 'am', ['in dem', 'im', 'zum', 'vom']` | `'... ___ Marktplatz.', 'am', ['im', 'zum', 'vom', 'beim']` |
| `'... ___ dem See.', 'am', [...]` | `'... ___ See.', 'am', ['im', 'zum', 'vom', 'beim']` |
| `'... ___ dem Flussufer.', 'am', [...]` | `'... ___ Flussufer.', 'am', [...]` |
| `'... ___ der Stadtgrenze.', 'an der', [...]` | `'... ___ Stadtgrenze.', 'an der', [...]` |
| `'... ___ der Ecke ...', 'an der', [...]` | `'... ___ Ecke ...', 'an der', [...]` |
| `'... ___ der anderen Seite ...', 'auf der', [...]` | `'... ___ anderen Seite ...', 'auf der', [...]` |
| `'... ___ der Fußgängerzone.', 'in der', [...]` | `'... ___ Fußgängerzone.', 'in der', [...]` |
| `'... ___ dem Hof.', 'auf dem', [...]` | `'... ___ Hof.', 'auf dem', [...]` |
| `'... ___ die Autobahn ...', 'auf die', [...]` | `'... ___ Autobahn ...', 'auf die', [...]` (distr. `bei die` → `durch die`) |
| `'... ___ der Wand ...', 'an der', [...]` | `'... ___ Wand ...', 'an der', [...]` |
| `'... ___ der Post.', 'neben der', [...]` | `'... ___ Post.', 'neben der', [...]` |
| `'... ___ der Berge.', 'zwischen den', [...]` | `'... ___ Bergen.', 'zwischen den', [...]` (исправлен и Genus/Numerus) |

**Регенерировано:** 50 файлов `b2-lokal-*.md`.

### 2. MAJOR — A2 REFLEXIVPRONOMEN: hints + `verbFormHint()` баги

**Источник правок:** `scripts/verb-hint-banks.mjs`, `scripts/topic-context-hints.mjs`, `scripts/generate-a2-select-one.mjs`, `scripts/a2-dropbox-data.mjs`.

1. **`finiteToInfinitive` map расширена** всеми нерегулярными формами темы:
   - `sah/sahst/gesehen/sieht/sehe → sehen`
   - `traf/trafst/getroffen/triffst/trifft → treffen`
   - `gefreut/gefreuen → freuen`, `gewaschen → waschen`, `erkältet/erkältest → erkälten`
   - `zog/angezogen → anziehen`, `ruhe/ruht/ausgeruht → ausruhen`, `beeilte → beeilen`
2. **`isLikelyLemma` + `extractInfinitiveFromOptions`**: добавлен фильтр Partizip II (`/^ge\w+(en|t)$/`) — теперь `gesehen`, `getroffen` не считаются инфинитивами.
3. **Генератор `generate-a2-select-one.mjs`**: теперь передаёт `q.prompt` и `id` в `verbFormHint()`, чтобы `bankLemmaFromBody`/`bankLemmaFromId` смогли найти правильную лемму.
4. **Банк `a2-dropbox-data.mjs`**: 17 dropbox items REFLEXIVPRONOMEN переведены на единый формат hint `Reflexiv + Verb <Infinitiv>`.

**Регенерировано:** 50 файлов `a2-refl-*.md` (select-one) + 50 файлов `a2-refl-dd-*.md` (dropbox) = 100 файлов.

### 3. KNOWN → FIXED — B1 RELATIVSATZB1 / WORTSCHATZB1: связки артикль+существительное

**Источник:** `scripts/b1-dropbox-data.mjs`.

| До | После |
|---|---|
| RELATIVSATZB1 #16: `['Der', 'Artikel', 'der', 'in', 'der', 'Zeitung', 'stand', 'war', 'interessant']` + `allowDuplicateWords: true` | `['Der Artikel', 'der', 'in der Zeitung', 'stand', 'war', 'interessant']` |
| WORTSCHATZB1 #1: `['Nach', 'der', 'Operation', 'braucht', 'der', 'Patient', 'Rehabilitation']` + `allowDuplicateWords: true` | `['Nach der Operation', 'braucht', 'der Patient', 'Rehabilitation']` |

Артикли соединены с существительными в один токен → нет дубликатов `der`, флаг `allowDuplicateWords` снят.

**Регенерировано:** 50 файлов `b1-rel-dd-*.md` + 50 файлов `b1-ws-dd-*.md` = 100 файлов.

### Финальная верификация

```
verify-questions:   10 434 файла, 0 ошибок ✅
audit-question-bank: ✅ Keine Probleme gefunden
audit-dropbox:       ✅ no duplicate chips or broken templates
audit-sprach:        ✅ 80 files, no issues
audit-reflexiv:      ✅ 0 mismatches (был 67!)
audit-genitiv:       ✅ 450 files, 0 problems
audit-possessiv:     ✅ 150 files, 0 mismatches
```

Все 7 проверок чистые.
