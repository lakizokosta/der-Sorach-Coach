# SPRACHBAUSTEINEB1

**Файлов:** 48 (вместо ожидаемых 50+20+10 = 80)

## Состав фактический
- `b1-sprach-001..015` (15 select-one из общего bank `genSprachbausteineB1`)
- **дыра 016..050** (нет файлов)
- `b1-sprach-051..070` (20 curated exam standalone)
- `b1-lesen-2..11` (10 text-gaps текстов)
- `b1-lesen-1-0.md, b1-lesen-1-1.md, b1-lesen-1-2.md` — **legacy split-формат**

## CRITICAL
— нет (грамматически все items корректны).

## MAJOR
| № | Проблема | Фикс |
| --- | --- | --- |
| M1 | **`b1-lesen-1-0/1/2.md`** — legacy split-формат, не мигрирован в text-gaps как остальные lesen-2..11 | Либо добавить запись `LESEN_SERIES[0]` в `b1-sprachbausteine-exam-data.mjs` и запустить migrate, либо удалить эти 3 файла |
| M2 | Дыра `b1-sprach-016..050` | Bank `genSprachbausteineB1()` возвращает 15 без cycle50. Решения: (а) добавить cycle50 в `generate-b1-select-one.mjs` для этой темы, (б) расширить bank до 50 items, (в) перенумеровать exam-блок (`051..070` → `016..035`) |

## MINOR
— нет.

## Дополнительно
- 15 select-one items (`genSprachbausteineB1`) корректны: B1-business-стиль, типичные формулировки писем.
- 20 exam standalone (`SPRACH_STANDALONE`) — отличная подборка реальных формулировок (Anfrage, Bewerbung, Termin verschieben, Kursanmeldung).
- 10 text-gaps (`LESEN_SERIES`) — длинные тексты на 3 gaps каждый, экзаменный формат хорошо реализован.
