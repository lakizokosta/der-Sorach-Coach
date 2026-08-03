# B1 — Кратко (ZUSAMMENFASSUNG)

> **СТАТУС:** все CRITICAL+MAJOR+MINOR фиксы применены (`FIX-B1-AUDIT-2026`). Текущее число файлов: **3980** (было 4105). Темы: **27** (была 28, объединили `VERBPRÄPOSITIONVERBINDUNG` с `PRÄPOSITIONALERGÄNZUNG`).

**Дата:** 2026‑06‑17 · **Уровень:** B1 · **Объём:** 28 тем (исходно), 4105 .md (исходно)  
**Архитектура:** для 27 «обычных» тем — 3 формата по 50 файлов (select-one, dropbox, input-text) → 150 файлов; SPRACHBAUSTEINEB1 — особый exam-формат (48 файлов).

## Сводка по серьёзности

| Уровень | Кол-во | Что значит |
| --- | --- | --- |
| **CRITICAL** | **20** | Грамматические/семантические ошибки, неправильный ответ, пропущенные слова, грубые опечатки. Видны в реальных файлах ученика. |
| **MAJOR** | **9** | Методологический брак: дубликаты тем, выбившиеся из темы упражнения, hint↔words не совпадают, повторение шаблонов. |
| **MINOR** | **6** | Стилистические/педагогические улучшения. |

## Самые срочные проблемы

### Грамматика (CRITICAL)

1. **FINALSATZ #3** — пропущен `zu`: `… um die Schmerzen lindern` → должно `… um die Schmerzen zu lindern`.
2. **KAUSALSATZ #9** (dropbox) — пропущен артикль: `fällt Fest aus` → `fällt das Fest aus`.
3. **KAUSALSATZ #5** (dropbox) — пропущен артикль: `werden Preise höher` → `werden die Preise höher`.
4. **KONJUNKTIV II #1, 5, 7, 15** (dropbox) — отсутствуют подлежащие/артикли в главных предложениях:
   - `Hätte ich mehr Zeit, machte ein Praktikum` — нет `ich`.
   - `Wäre ich reich, reiste um die Welt` — нет `ich`.
   - `Wäre er hier, könnte Team uns helfen` — нет артикля (`das Team`).
   - `Hätte ich den Job, finge sofort an` — нет `ich`.
5. **KONDITIONALSATZ #10** (dropbox) — нелогичное `Sobald Hotel eingecheckt ist` (отель сам не «check-in»-ится) + нет артикля.
6. **KONZESSIVSATZ #1, 7, 13** (dropbox) — пропуски артиклей и subject-mismatch:
   - `Obwohl Schlafmangel herrscht, arbeitet Kollege sehr produktiv` — нет артиклей.
   - `Obwohl er kein Auto hat, bleibt Kollege pünktlich` — `er` vs `Kollege` (рассогласование) + нет артикля.
   - `Obschon die Vorlesung lang war, blieb Kursinhalt spannend` — нет артикля.
7. **TRENNBAREVERBEN #7, 8** (dropbox + input-text + select-one) — `sich freuen` это **не** trennbare Verb. Тематический mismatch.
8. **PRÄPOSITIONALADVERBIEN #12** — `Vertraust du in das Team? — Ich vertraue darin.` Глагол `vertrauen` берёт Dativ **без** `in`. Грубая ошибка.
9. **PRÄPOSITIONALADVERBIEN #13** — `Nimmst du an der Konferenz teil? — Ich nehme daran.` Не хватает `teil` — `teilnehmen` trennbar (correct в select-one файлах потерял `teil`).
10. **KAUSALSATZ #2** (dropbox) — `Weil er fleißig war, bestand seine Prüfung` — без местоимения в главной части смысл деформируется (`seine Prüfung bestand` — Prüfung как subject? нет.).
11. **INDIREKTEFRAGESÄTZE #2, 9** (dropbox) — знак `?` как отдельный «word» путает drag-and-drop; в дубликатах он отсутствует.

### Дубликаты тем (MAJOR)

12. **`PRÄPOSITIONALERGÄNZUNG`** и **`VERBPRÄPOSITIONVERBINDUNG`** — это **одна и та же тема** (verb + Präposition) с двумя именами. Все 15 шаблонов почти идентичны: `warten auf`, `denken an`, `interessieren für`, `freuen auf`, `erinnern an`, `hoffen auf`, `ärgern über`, `fragen nach`, `bestehen auf`, `träumen von`, `danken für`, `diskutieren über`, `achten auf`, `informieren über`. Ученик получает 300 файлов с одинаковым содержанием.

### Hints не совпадают со словами (MAJOR)

13. **FINALSATZ #16, 17** (dropbox) — hints `«damit Patienten genesen»` и `«um Kosten senken»` стоят над words, которые — копии item #1 и #2 (`Er lernt Deutsch...`, `Sie spart Geld...`). Это явные «заполнители», hint↔words рассогласованы.

### Структурные аномалии (MAJOR)

14. **SPRACHBAUSTEINEB1** содержит **legacy-файлы** `b1-lesen-1-0.md`, `b1-lesen-1-1.md`, `b1-lesen-1-2.md` (старый split-формат) — следующие тексты (`b1-lesen-2..11`) уже мигрированы в `text-gaps`, а первый — нет.
15. **SPRACHBAUSTEINEB1** имеет только **15 базовых select-one** (`b1-sprach-001..015`), но прыгает к exam-блоку `b1-sprach-051..070`. Дыра в нумерации `016..050` (генератор `genSprachbausteineB1` возвращает 15, без cycle50).
16. **Одинаковые ответы в шаблоне `ERGÄNZUNGSSATZ`** — все 15 templates дают `correct = dass`. Из-за cycle50 ученик 50 раз подряд отвечает `dass`. Превращается в «нажми один и тот же ответ».
17. **Дубликаты в банках dropbox** (ADJEKTIVDEKLINATIONB1, AKKUSATIVB1, DEMONSTRATIVARTIKEL, ERGÄNZUNGSSATZ, INDIREKTEFRAGESÄTZE, KAUSALSATZ, KONJUNKTIV2, KONDITIONALSATZ, KONZESSIVSATZB1, KONJUNKTIONALADVERBIEN, LOKALEPRÄPOSITIONENB1, NOMENPRÄPOSITIONVERBINDUNGB1, PASSIVB1) — items 16-17 явно дублируют 1-2. Не вредит (cycle50 повторит итак), но «грязный» банк.
18. **Topic extras** — 4 «странных» файла:
    - `FINALSATZ/b1-finale-1.md` (отдельный select-one с правильным предложением).
    - `KONJUNKTIV2/b1-fill-1.md` (input-text).
    - `KONJUNKTIV2/b1-konj2-multi-1.md` (multi-select, единственный такого типа в B1).
    - `KONZESSIVSATZB1/b1-kon-1.md`.
    - `PASSIVB1/b1-fill-2.md`.

    Происхождение неясно (не генерируются нынешними скриптами).

### Disраторы / pools (MINOR)

19. **NOMENPRÄPOSITIONVERBINDUNG #11** — distraктор `am` (`an dem`) рядом с correct `an` путает.
20. **Дubliкат рядом стоящих items в банках dropbox** — items 16-17 повторяют 1-2 в большинстве топиков.

---

## Структурные аномалии в файлах

| Папка | Файл | Что |
| --- | --- | --- |
| `SPRACHBAUSTEINEB1` | `b1-lesen-1-0/1/2.md` | Legacy split-формат, не мигрирован |
| `SPRACHBAUSTEINEB1` | дыра `b1-sprach-016..050` | Bank возвращает 15 items без cycle50 |
| `FINALSATZ` | `b1-finale-1.md` | Не из генератора |
| `KONJUNKTIV2` | `b1-fill-1.md`, `b1-konj2-multi-1.md` | Не из генератора |
| `KONZESSIVSATZB1` | `b1-kon-1.md` | Не из генератора |
| `PASSIVB1` | `b1-fill-2.md` | Не из генератора |

---

## Что сделано

- Все CRITICAL грамматики (20) — починены в `b1-select-one-data.mjs` и `b1-dropbox-data.mjs`.
- `VERBPRÄPOSITIONVERBINDUNG` удалён (150 файлов + topic из 9 мест: 3 генератора, `premiumTopics.js`, `grammarHints.js`, `topic-context-hints.mjs`, `fix-input-text-hints.mjs`, `rebuild-dropbox-banks.mjs`, `restore-all-dropbox.mjs`).
- 5 extras удалены: `b1-finale-1`, `b1-fill-1`, `b1-fill-2`, `b1-konj2-multi-1`, `b1-kon-1`, плюс `b1-rel-1`, `b1-rel-2` (нашлись по ходу).
- Legacy `b1-lesen-1-0/1/2.md` удалены.
- `SPRACHBAUSTEINEB1`: добавлен `cycle50` в `genSprachbausteineB1()` → дыра 016..050 заполнена.
- `ERGÄNZUNGSSATZ` разнообразлен: теперь 11 × `dass`, 4 × `ob`, 2 × `was`.
- `TRENNBAREVERBEN`: убраны `sich freuen` (reflexive, не trennbar), заменены реальными trennbare Verben (`abgeben`, `einladen`); `gefreet` → удалён из pools.
- `PRÄPOSITIONALADVERBIEN`: убраны `vertrauen in` (Dat-глагол) и `teilnehmen daran` (потерянный `teil`).
- Все `b1-*-data.mjs` items 16-17 (явные дубликаты #1-2) убраны (cycle50 теперь чистый).
- Hints↔words рассогласования в FINALSATZ #16-17 исправлены.
- `--force` и `--topic=NAME` добавлены в все 3 B1-генератора.

**Verify:** 10435 файлов, 0 ошибок.
