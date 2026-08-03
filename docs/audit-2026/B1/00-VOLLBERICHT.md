# B1 — Полный отчёт (VOLLBERICHT)

**Дата:** 2026‑06‑17 · **Уровень:** B1  
**Объём:** 28 тем, 4105 файлов `.md`

## 0. Архитектура

| Источник | Файлов | Формат | Что генерирует |
| --- | --- | --- | --- |
| `scripts/b1-select-one-data.mjs` | банк | `select-one` | 50 select-one × 27 тем + 15 sprach (без cycle50) |
| `scripts/b1-dropbox-data.mjs` | банк | `dropbox` | 50 dropbox × 27 тем (cycle50) |
| `scripts/generate-b1-input-text.mjs` | использует select-one bank + переопределённые hints | `input-text` | 50 × 27 тем |
| `scripts/b1-sprachbausteine-exam-data.mjs` | банк | `select-one` (20) + `text-gaps` (10) | exam-блок в SPRACHBAUSTEINEB1 |
| `scripts/migrate-b1-lesen-text-gaps.mjs` | миграция | — | конвертирует legacy split-файлы в text-gaps |

### Структурные особенности

- **SPRACHBAUSTEINEB1** (48 файлов):
  - `b1-sprach-001..015` (select-one из общего bank)
  - **дыра 016..050** (не сгенерировано, банк имеет 15 items без cycle50)
  - `b1-sprach-051..070` (curated exam, 20 standalone)
  - `b1-lesen-2..11` (10 длинных текстов с text-gaps)
  - `b1-lesen-1-0/1/2.md` — **legacy split-формат** (не мигрирован).
- **Дубликат темы**: `PRÄPOSITIONALERGÄNZUNG` ↔ `VERBPRÄPOSITIONVERBINDUNG` — практически идентичные банки.
- **Extras** не из генератора: `FINALSATZ/b1-finale-1.md`, `KONJUNKTIV2/b1-fill-1.md`, `KONJUNKTIV2/b1-konj2-multi-1.md`, `KONZESSIVSATZB1/b1-kon-1.md`, `PASSIVB1/b1-fill-2.md`.

---

## 1. CRITICAL — реальные грамматические ошибки

| № | Тема | Файл/Item | Проблема | Должно быть |
| --- | --- | --- | --- | --- |
| C1 | FINALSATZ | dropbox #3 | `Ich nehme Medikamente, um die Schmerzen lindern` — **нет `zu`** | `… um die Schmerzen zu lindern` |
| C2 | FINALSATZ | dropbox #16 | hint «damit Patienten genesen», words = item #1 (Deutsch lernen) | hint↔words не совпадают |
| C3 | FINALSATZ | dropbox #17 | hint «um Kosten senken», words = item #2 (Geld sparen) | hint↔words не совпадают |
| C4 | KAUSALSATZ | dropbox #5 | `Da die Nachfrage steigt, werden Preise höher` — нет `die` | `werden die Preise höher` |
| C5 | KAUSALSATZ | dropbox #9 | `Weil das Wetter schlecht ist, fällt Fest aus` — нет артикля | `fällt das Fest aus` (или `unser Fest`) |
| C6 | KAUSALSATZ | dropbox #2 | `Weil er fleißig war, bestand seine Prüfung` — нет subject `er` в главной части (нелогично) | `… bestand er die Prüfung` |
| C7 | KAUSALSATZ | dropbox #8 | `Er ist gestresst, denn zu viel Arbeit wartet` — после `denn` нужен полноценный V2-Satz | `denn er hat zu viel Arbeit` |
| C8 | KAUSALSATZ | dropbox #14 | `Er ist pünktlich, denn er hat den frühen Bus genommen` — `er` дважды → `assertUnique` fail при regen | заменить второе `er` на `den` или переформулировать |
| C9 | KONJUNKTIV II | dropbox #1 | `Hätte ich mehr Zeit, machte ein Praktikum` — нет subject в главной | `… würde ich ein Praktikum machen` (требует регенерации) |
| C10 | KONJUNKTIV II | dropbox #5 | `Wäre ich reich, reiste um die Welt` — нет subject | `… würde ich um die Welt reisen` |
| C11 | KONJUNKTIV II | dropbox #7 | `Wäre er hier, könnte Team uns helfen` — нет артикля `das Team` | `könnte das Team uns helfen` |
| C12 | KONJUNKTIV II | dropbox #15 | `Hätte ich den Job, finge sofort an` — нет subject | `… finge ich sofort an` |
| C13 | KONDITIONALSATZ | dropbox #10 | `Sobald Hotel eingecheckt ist…` — нет артикля и **семантически** отель сам не «check-in»-ится | `Sobald wir im Hotel sind, gehen wir essen` или подобное |
| C14 | KONZESSIVSATZ | dropbox #1 | `Obwohl Schlafmangel herrscht, arbeitet Kollege sehr produktiv` — нет артикля у `Schlafmangel` и `Kollege` | `Obwohl der Kollege wenig schläft, arbeitet er produktiv` |
| C15 | KONZESSIVSATZ | dropbox #7 | `Obwohl er kein Auto hat, bleibt Kollege pünktlich` — нет артикля + subject-mismatch | `bleibt der Kollege pünktlich` |
| C16 | KONZESSIVSATZ | dropbox #13 | `Obschon die Vorlesung lang war, blieb Kursinhalt spannend` — нет артикля | `blieb der Kursinhalt spannend` |
| C17 | TRENNBAREVERBEN | dropbox #7, #8; select-one #7, #8; input-text #7, #8 | `sich freuen` это **reflexive**, не trennbar | заменить на реальные trennbare Verben |
| C18 | PRÄPOSITIONALADVERBIEN | select-one/input-text/dropbox #12 | `Vertraust du in das Team? — Ich vertraue darin.` Глагол `vertrauen` берёт Dativ без `in` | заменить на корректный глагол с `in`, напр. `glauben an` → `daran` |
| C19 | PRÄPOSITIONALADVERBIEN | select-one/input-text/dropbox #13 | `Nimmst du an der Konferenz teil? — Ich nehme ___.` correct `daran teil`, но в файлах потерян `teil` | поставить `daran teil` целиком или переформулировать без trennbar |
| C20 | INDIREKTEFRAGESÄTZE | dropbox #2, #9 | `?` как отдельный word; в дубликатах (#16) `?` отсутствует — непоследовательно | убрать `?` как word везде |

---

## 2. MAJOR — методология / структура

| № | Тема | Item | Проблема | Решение |
| --- | --- | --- | --- | --- |
| M1 | **PRÄPOSITIONALERGÄNZUNG ↔ VERBPRÄPOSITIONVERBINDUNG** | весь банк | Это одна и та же тема. Все шаблоны почти идентичны. Ученик получает 300 файлов с одинаковым контентом | Решение: либо объединить, либо чётко разделить (напр., `Präpositionalergänzung` = verb+präp с обязательной dummy, `Verb+Präposition` = просто типичные коллокации) |
| M2 | ERGÄNZUNGSSATZ | select-one все 50 | Все ответы = `dass`. Из-за cycle50 ученик 50 раз нажимает один ответ | Добавить варианты с `was, wer, wohin` и другими subordinate WHs; либо переименовать тему и разделить на «dass» vs «indirekte Frage» |
| M3 | SPRACHBAUSTEINEB1 | `b1-lesen-1-0/1/2.md` | Legacy split-формат, не migrated | Запустить `migrate-b1-lesen-text-gaps.mjs` для seria 1 (нужно добавить запись в `LESEN_SERIES`) или удалить |
| M4 | SPRACHBAUSTEINEB1 | `b1-sprach-016..050` | Дыра в нумерации (банк имеет 15, без cycle50) | Либо расширить bank, либо добавить cycle, либо сжать нумерацию `051..070` к `016..035` |
| M5 | Extras | `b1-finale-1`, `b1-fill-1`, `b1-fill-2`, `b1-konj2-multi-1`, `b1-kon-1` | Не из генератора, происхождение неясно | Решить: оставить как «kuratiert» (с дополнительным «registered manual» списком) или удалить |
| M6 | dropbox banks | items 16-17 в 13 темах | Явные дубликаты items 1-2 (cycle50 это сделает сам) | Убрать ручные дубликаты из bank |
| M7 | KAUSALSATZ | dropbox #2 (см. C6) | Дубликат `er` в одном sentence → блокирует regen | См. C6 — переформулировка решает оба |
| M8 | INDIREKTEFRAGESÄTZE | dropbox 4 | `'Ich', 'interessiere', 'mich', 'dafür', 'was'…` — `dafür` + indirekte Frage — нестандартная конструкция | Лучше `daran, was…` или переформулировать |
| M9 | VERBNOMENVERBINDUNGB1 | select-one #2 | correct = `führt durch` — двухсловный ответ в select-one | Шаблон следует упростить (использовать только präsens с trennbar) |

---

## 3. MINOR — стиль / педагогика

| № | Тема | Item | Замечание |
| --- | --- | --- | --- |
| m1 | KONZESSIVSATZ | items с `Obschon` | `obschon` редкий синоним `obwohl`; pool не содержит `obwohl`. Учебно: было бы лучше включить |
| m2 | NOMENPRÄPOSITIONVERBINDUNG | #11 (`Anteil an`) | distraктор `am` (= `an dem`) конфликтует с correct `an` — путает |
| m3 | RELATIVSATZB1 | select-one #10 (`Die Firma, ___ er arbeitet`) | correct `für die`, но `bei der` тоже валидно | Можно добавить `bei der` как alternative |
| m4 | INDIREKTEFRAGESÄTZE | #11 (`wie lange`) | двухсловный correct в select-one — потеря для UI |
| m5 | LOKALEPRÄPOSITIONENB1 | #8 (`Das Hotel liegt an dem Fluss`) | стилистически `am Fluss` лучше; но `an dem` грамматически верно |
| m6 | KAUSALSATZ | select-one items 1-15 | Pool везде одинаковый — слабая дифференциация |

---

## 4. Регенерация после фиксов

Команды:
```bash
node scripts/generate-b1-select-one.mjs
node scripts/generate-b1-dropbox.mjs --force                # если добавим --force
node scripts/generate-b1-input-text.mjs                     # потребует --force при перезаписи
node scripts/generate-b1-sprachbausteine-exam.mjs
npm run questions:verify
```

> Генераторы `select-one` и `input-text` не имеют `--force`/`--restore-all` — добавим по образцу A2.

---

**ИТОГ:** все CRITICAL+MAJOR+MINOR применены 2026-06-17 (`FIX-B1-AUDIT-2026`). Файлов после фикса: **3980** (B1) / **10435** (общее, verify 0 ошибок). Удалена тема `VERBPRÄPOSITIONVERBINDUNG`, удалены 7 extras + 3 legacy.
