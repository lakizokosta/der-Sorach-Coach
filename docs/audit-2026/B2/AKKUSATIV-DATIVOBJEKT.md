# AKKUSATIV&DATIVOBJEKT (B2)

**Файлов:** 50 (`b2-obj-001..050.md`) · select-one.
**Bank:** `genAkkusativDativobjekt()` в `scripts/b2-select-one-data.mjs:8–28` (17 уникальных items).

## CRITICAL
— нет.

## MAJOR
— нет.

## MINOR
- Items хорошо тестируют N-Deklination (`den Angeklagten`, `den Studierenden`, `dem Journalisten`, `den Patienten`) и Possessivartikel-Dativ.
- Покрытие исключительно `select-one`. Темa выиграла бы от `dropbox` (например, на построение Akk + Dat в одном предложении), но это уже архитектурный пункт (M4).

## Рекомендация
Тему **не трогаем**. Лингвистически чистая.
