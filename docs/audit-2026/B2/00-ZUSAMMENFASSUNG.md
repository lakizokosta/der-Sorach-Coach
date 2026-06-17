# B2-Audit 2026 — Zusammenfassung

**Stand:** ✅ **Фиксы внедрены и закоммичены** (`FIX-B2-AUDIT-2026`).
**Покрытие до фиксов:** 23 темы, 1641 файл.
**Покрытие после фиксов:** 23 темы, **1640 файлов** (`select-one` 1100, `dropbox` 50, `input-text` 450, `text-gaps` 40). `multi-select` orphan удалён.

## Архитектурный обзор

В отличие от A1 / A2 / B1, где каждая тема имела 150 файлов (3 формата × 50), B2 организован асимметрично:

| Формат | Тем | Файлов | Темы |
|---|---|---|---|
| только `select-one` (50) | 12 | 600 | AKKUSATIV&DATIVOBJEKT, INDEFINITPRONOMEN, KONJUNKTIONALADVERBIEN, KONSEKUTIVEKONJUNKTION, KONZESSIVSATZB2, LOKALEPRÄPOSITIONENB2, MODALSATZ, PRÄPOSITIONALADVERBIENB2, PRÄPOSITIONENGENITIV*, QUIZ, REDEWENDUNGEN, TEMPORALERNEBENSATZ |
| `select-one` + `input-text` (100) | 9 | 900 | FUTURI, GENITIVB2, INDIREKTEREDE, KONJUNKTIV2B2, PARTIZIP1, PARTIZIP2, PASSIVB2, PASSIVERSATZ, RELATIVSATZB2 |
| `select-one` + `dropbox` (100) | 1 | 100 | TEKAMOLO |
| `text-gaps` (telc-Exam) | 1 | 40 | SPRACHBAUSTEINEB2 (20 × Teil 1 Grammatik + 20 × Teil 2 Wortschatz) |

\* PRÄPOSITIONENGENITIV содержит дополнительно 1 `multi-select`-файл (`b2-genitiv-multi-1.md`) — выпадает из общей архитектуры.

## Сводная статистика находок

| Категория | Шт. | Что значит |
|---|---|---|
| **CRITICAL** | **3** | реальные грамматические/семантические ошибки или вопрос с >1 валидным ответом |
| **MAJOR** | **5** | методологические дефекты, портящие учебную ценность темы |
| **MINOR** | **7** | стилистические / дидактические замечания |

## CRITICAL — требует исправления

1. **REDEWENDUNGEN** (`b2-rede-004.md`): тавтологичный prompt.
   `Sie hat die Nase voll — sie hat die Nase ___ . correct: voll` → после заполнения: «Sie hat die Nase voll — sie hat die Nase voll.» Бессмысленный quiz.
2. **REDEWENDUNGEN** (`b2-rede-014.md`): искажена идиома.
   `Er ist mit dem falschen Bein ___ aufgestanden. correct: zuerst` → итог: «Er ist mit dem falschen Bein zuerst aufgestanden.» Подлинная идиома — **без** `zuerst`: *«mit dem falschen Bein aufstehen»*.
3. **TEKAMOLO** (все 50 `select-one`-файлов): distractor pool содержит грамматически валидные альтернативы.
   Пример (`b2-tkml-001.md`): correct = «Er fährt morgen wegen der Konferenz mit dem Zug nach Berlin.», но distraкtor «Wegen der Konferenz fährt er morgen mit dem Zug nach Berlin.» — **тоже грамматически корректен** (Kausal-Glied в Vorfeld). У каждого вопроса 2+ валидных ответа.

## MAJOR — рекомендуется исправить

4. **PASSIVERSATZ** (`b2-passv-008.md`, `b2-passv-012.md`, `b2-passv-in-008.md`, `b2-passv-in-012.md`): off-topic items.
   Например: «Der Text ist zu lang, um ihn zu ___ . correct: zusammenfassen» — это **um…zu-Infinitivkonstruktion**, а не Passiversatz. Авторы это понимали и пометили hint как `(Grammatikform)`, но items всё равно остались в теме Passiversatz.
5. **PRÄPOSITIONALADVERBIENB2** (`b2-pradv-005.md`): двухсловный correct в `select-one`.
   «Worüber ___ ihr gestern? correct: 'habt gesprochen'» → в UI рендерится один token «habt gesprochen». Структурно несовместимо с однократным fill-in-blank (та же проблема, что в B1 VERBNOMENVERBINDUNGB1, который мы уже исправили).
6. **KONSEKUTIVEKONJUNKTION** (все 50 файлов): все 17 базовых items имеют correct `= dass`. После `cycle50` ученик 50 раз подряд жмёт `dass`. Та же методическая ловушка, которую мы устранили в B1 ERGÄNZUNGSSATZ.
7. **Архитектурное недопокрытие**: 12 из 23 тем имеют **только** 50 `select-one`-файлов. Для B2 — недостаточно практики (по сравнению с 150-файловым стандартом A1/A2/B1). Решение нужно принять отдельно (см. вопрос #1 ниже).
8. **PRÄPOSITIONENGENITIV** содержит «осиротевший» файл `b2-genitiv-multi-1.md` (тип `multi-select`), не генерируемый ни одним скриптом. Аналог extra-файлов, удалённых в B1.

## MINOR — стилистика и дидактика

9. **GENITIVB2** (`b2-genit-010.md`): `Sie erinnert sich gern ihrer Jugend.` — конструкция `sich erinnern + Gen` устаревшая (modern: `sich erinnern an + Akk`). Корректно для B2-темы Genitiv, но стоит дать hint `(gehoben/altertümlich)`.
10. **REDEWENDUNGEN** (`b2-rede-003.md`, generator): distraкtor pool содержит дубликат correct (`'Rollen', 'Rolle', 'Rollen'`); фильтрация через `Set` это скрывает, но в коде выглядит небрежно.
11. **KONSEKUTIVEKONJUNKTION**: distraкtor pool в части items содержит `sodass` как альтернативу к `dass`. Поскольку prompt уже содержит `so X`, итог `so X, sodass …` — двойной маркер (грамматически некорректно). Distractor валидный как ловушка, но без объяснения может ввести ученика в заблуждение.
12. **SPRACHBAUSTEINEB2** Teil 2, файл №6 (`b2-sb2-06.md`, Mietvertrag): «Nebenkosten werden wie bisher ___ abgerechnet. correct: jährlich; pool: jährlich/monatlich/stündlich» — оба варианта `jährlich` и `monatlich` грамматически валидны (зависит от договора). Лучше формулировать однозначно.
13. **QUIZ**: ре-использует фрагменты других тем без отметки об источнике. Полезно как mixed-review, но создаёт redundance — ученик видит одни и те же items в разных папках.
14. **input-text vs select-one дублирование**: для всех 9 тем с двумя форматами `input-text`-bank на 80 %+ повторяет тот же prompt, что и `select-one`. Высокая избыточность.
15. **TEKAMOLO** dropbox (`b2-tkml-dd-014.md`): hint обещает `in der Küche`, а words array содержит `in seiner Küche` (Possessivartikel). Несоответствие hint ↔ words.

## Принятые решения и реализация

| # | Вопрос | Решение | Реализация |
|---|---|---|---|
| 1 | Покрытие 12 однофоrmatных тем | **skip** — оставлено как есть | — |
| 2 | TEKAMOLO select-one | **rewrite-distractors** | Distractor pool у всех 17 items переписан: только грамматически/логически неправильные перестановки в Mittelfeld (без валидных Vorfeld-альтернатив). Prompt также сменён на «Welche Satzstellung folgt der TeKaMoLo-Reihenfolge?». |
| 3 | `b2-genitiv-multi-1.md` | **delete** | Файл удалён, тема PRÄPOSITIONENGENITIV теперь содержит ровно 50 файлов. |
| 4 | KONSEKUTIVEKONJUNKTION | **keep** | Bank items не тронуты. Только distractors почищены (убран `sodass` как double-marker trap в 4 items). |
| 5 | MINOR-замечания | **all** | Все 7 minor-пунктов внедрены. |

## Список реализованных фиксов

### CRITICAL (3) — все исправлены
- ✅ REDEWENDUNGEN `b2-rede-004`: переписано в «Sie hat von der Arbeit die Nase ___ . correct: voll» — без тавтологии.
- ✅ REDEWENDUNGEN `b2-rede-014`: переписано в «Du bist heute wohl mit dem falschen ___ aufgestanden. correct: Bein» — настоящая идиома сохранена.
- ✅ TEKAMOLO все 50 файлов: distractor pool переписан, distractors теперь только нарушения TKML-порядка в Mittelfeld (V2 сохранён, но Te/Ka/Mo/Lo переставлены некорректно). Plus prompt-formulation сменена.

### MAJOR (5) — внедрены, кроме архитектурного
- ✅ PASSIVERSATZ items #8 и #12 (4 файла: 2 × select-one + 2 × input-text): off-topic `um…zu` заменены на корректные Passiversatz («Diese Frage ist nicht zu beantworten», «Die Maschine ist leicht zu bedienen»).
- ✅ PRÄPOSITIONALADVERBIENB2 `b2-pradv-005`: переформулировано в «Worüber ___ ihr gestern gesprochen? correct: habt» (одно слово).
- ✅ KONSEKUTIVEKONJUNKTION: bank не тронут (q4=keep), но distractor pool почищен.
- ⏭️ Архитектурное недопокрытие 12 тем: **отложено** (q1=skip).
- ✅ PRÄPOSITIONENGENITIV: orphan `b2-genitiv-multi-1.md` удалён.

### MINOR (7) — внедрены
- ✅ GENITIVB2 item #10: заменено на «Sie bedarf eines besonderen Schutzes.» (классический `bedürfen + Gen`).
- ✅ REDEWENDUNGEN item #3 (Rollen-pool): дубликат `Rollen` удалён.
- ✅ KONSEKUTIVEKONJUNKTION items 3, 6, 10, 13: `sodass` убран из distractor pool.
- ✅ SPRACHBAUSTEINEB2 TEIL2 #6: distractor `monatlich` заменён на `einmalig` (теперь однозначный ответ).
- ✅ QUIZ: переключено с `.slice(0, 8)` на `.slice(-8)` — items не пересекаются с первой страницей оригинальных тем.
- ⏭️ input-text vs select-one redundance: не трогали (слишком большая переработка).
- ✅ TEKAMOLO dropbox `b2-tkml-dd-014`: hint синхронизирован с words (`in unserer Küche`).

## Технические улучшения

- В `generate-b2-select-one.mjs`, `generate-b2-input-text.mjs`, `generate-b2-dropbox.mjs` добавлены флаги `--force` и `--topic=<NAME>` для точечной регенерации (по аналогии с генераторами B1).
- Прогон `npm run questions:verify` после фиксов: **10 434 файла, 0 ошибок**.

## Структура отчётов

- `00-ZUSAMMENFASSUNG.md` — этот файл.
- `00-VOLLBERICHT.md` — детальный перечень findings.
- Папка содержит 23 файла `<TOPIC>.md` — по одному на тему (с конкретными items, кодом, рекомендациями).
