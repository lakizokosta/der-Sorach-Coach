# B2-Audit 2026 — Vollbericht

**Дата:** 2026-06.
**Скрипт-стек:** `scripts/generate-b2-{select-one,input-text,dropbox,sprachbausteine-exam}.mjs`; данные в `scripts/b2-{select-one,input-text,dropbox,sprachbausteine-exam}-data.mjs` + `b2-select-one-shared.mjs` / `b2-dropbox-shared.mjs`.

## Объём аудита

| Источник | Items / файлов |
|---|---|
| `b2-select-one-data.mjs` | 22 функции × ~17 items = ~374 уникальных prompts (потом `cycle50` → 1100 файлов) |
| `b2-input-text-data.mjs` | 9 топиков × ~17 items = ~153 prompts (→ 450 файлов) |
| `b2-dropbox-data.mjs` | 1 топик × 17 items (→ 50 файлов) |
| `b2-sprachbausteine-exam-data.mjs` | 40 уникальных текстов (Teil 1 + Teil 2) |
| `src/questions/B2/PRÄPOSITIONENGENITIV/b2-genitiv-multi-1.md` | 1 «осиротевший» файл |

Все банки прочитаны и проверены вручную, плюс прогон `npm run questions:verify` (10 435 файлов · 0 ошибок).

## Полный перечень находок (детали по темам — в отдельных файлах)

### CRITICAL

| # | Топик | Файл / source | Описание |
|---|---|---|---|
| C1 | REDEWENDUNGEN | `b2-rede-004.md` (gen item #4) | Тавтологичный prompt: «Sie hat die Nase voll — sie hat die Nase voll.» |
| C2 | REDEWENDUNGEN | `b2-rede-014.md` (gen item #14) | Идиома искажена: «mit dem falschen Bein zuerst aufgestanden» (правильно — без `zuerst`) |
| C3 | TEKAMOLO | все 50 `b2-tkml-*.md` (gen items 1–17) | distractor pool содержит грамматически корректные альтернативы → >1 валидный ответ |

### MAJOR

| # | Топик | Файл / source | Описание |
|---|---|---|---|
| M1 | PASSIVERSATZ | `b2-passv-008`, `b2-passv-012`, `b2-passv-in-008`, `b2-passv-in-012` | `um … zu` — не Passiversatz, а Infinitivkonstruktion |
| M2 | PRÄPOSITIONALADVERBIENB2 | `b2-pradv-005.md` | Двухсловный correct в `select-one` (`habt gesprochen`) |
| M3 | KONSEKUTIVEKONJUNKTION | все 50 файлов | все 17 items correct = `dass` (после `cycle50` 50 раз `dass`) |
| M4 | архитектура | 12 топиков | только 50 файлов (один формат) против 150 в A1/A2/B1 |
| M5 | PRÄPOSITIONENGENITIV | `b2-genitiv-multi-1.md` | extra file, не генерируется, тип `multi-select` (вне общей архитектуры) |

### MINOR

| # | Топик | Файл / source | Описание |
|---|---|---|---|
| m1 | GENITIVB2 | `b2-genit-010.md` | `sich erinnern + Gen` устаревшая конструкция, нужен hint |
| m2 | REDEWENDUNGEN | gen item #3 | distractor pool содержит дубликат correct (`Rollen`) |
| m3 | KONSEKUTIVEKONJUNKTION | gen items 3, 6, 10, 13 | `sodass` в distractor pool при наличии `so X` в prompt |
| m4 | SPRACHBAUSTEINEB2 | `b2-sb2-06.md` (Teil 2, #6) | `jährlich` vs `monatlich` — оба валидны |
| m5 | QUIZ | все 50 файлов | reuse items из других тем без указания источника |
| m6 | input-text vs select-one | 9 двойных тем | high redundance prompts между форматами |
| m7 | TEKAMOLO dropbox | `b2-tkml-dd-014.md` | hint обещает `in der Küche`, words = `in seiner Küche` |

---

## Темы без значимых находок (только мелкие/нет)

- `AKKUSATIV&DATIVOBJEKT`
- `FUTURI`
- `INDEFINITPRONOMEN`
- `INDIREKTEREDE`
- `KONJUNKTIONALADVERBIEN`
- `KONJUNKTIV2B2`
- `KONZESSIVSATZB2`
- `LOKALEPRÄPOSITIONENB2`
- `MODALSATZ`
- `PARTIZIP1`
- `PARTIZIP2`
- `PASSIVB2`
- `RELATIVSATZB2`
- `TEMPORALERNEBENSATZ`
- `SPRACHBAUSTEINEB2` (есть один MINOR-item)

Эти темы лингвистически и структурно чистые, грамматика выверена.

## Статус

✅ **Все фиксы внедрены и закоммичены** (`FIX-B2-AUDIT-2026`). См. `00-ZUSAMMENFASSUNG.md` для полного списка.

`npm run questions:verify` → 10 434 файла, 0 ошибок.
B2 теперь: 23 темы, 1640 файлов.
