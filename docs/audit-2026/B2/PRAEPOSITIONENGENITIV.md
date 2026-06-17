# PRÄPOSITIONENGENITIV (B2)

**Файлов:** 51 (`b2-gen-001..050.md` + `b2-genitiv-multi-1.md`).
**Bank:** `genPraepositionenGenitiv()` (`b2-select-one-data.mjs:250–270`).

## CRITICAL
— нет.

## MAJOR
- **M5** — `b2-genitiv-multi-1.md` — extra file, **не генерируется** ни одним скриптом, тип `multi-select` (другие 50 файлов — `select-one`).

  Это аналог extra-файлов, которые мы удаляли в B1 (`b1-finale-1.md` и пр.). Здесь, однако, файл concept-wise валидный (test «какие предлоги требуют Genitiv» — `wegen/trotz/während/aufgrund`).

  Возможные решения:
  1. **DELETE** — для единообразия с архитектурой B1 (50 файлов на тему).
  2. **KEEP** — но тогда нужно интегрировать в генератор `multi-select` как поддерживаемый формат (сейчас он orphan, и `select-one`-генератор молча его игнорирует).
  3. **CONVERT** — переписать как `dropbox` (более стандартный формат).

## MINOR
- Items #1–17 тестируют Genitiv-Präpositionen: `trotz, aufgrund, während, wegen, im Laufe, im Zuge, dank, infolge, anlässlich, ungeachtet, statt, entgegen, unweit`. Покрытие хорошее.

## Рекомендация
Решение пользователя по #M5 (см. вопрос #3 в `00-ZUSAMMENFASSUNG.md`).
