# FUTURI (B2)

**Файлов:** 100 (`b2-fut-001..050.md` + `b2-fut-in-001..050.md`).
**Banks:** `genFuturI()` (`b2-select-one-data.mjs:52–72`) + `BANK.FUTURI` (`b2-input-text-data.mjs:28–46`).

## CRITICAL
— нет.

## MAJOR
— нет.

## MINOR
- `select-one` и `input-text` имеют почти **тот же набор prompts** (`Er wird wohl …`, `Die Experten werden …` и т.д.) — overlapping 70 %+. Рекомендуется в input-text дать другие глаголы / контексты.
- Все items качественно тестируют `werden + Inf` и Vermutung-функцию Futur I (с `wohl`, `sicher`, `vermutlich`). Грамматика чистая.

## Рекомендация
**Не трогаем.** Опционально — diversify input-text bank.
