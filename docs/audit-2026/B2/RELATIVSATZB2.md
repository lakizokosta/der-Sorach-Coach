# RELATIVSATZB2 (B2)

**Файлов:** 100 (`b2-rel-001..050.md` + `b2-rel-in-001..050.md`).
**Banks:** `genRelativsatzB2()` (`b2-select-one-data.mjs:404–424`) + `BANK.RELATIVSATZB2` (`b2-input-text-data.mjs:148–166`).

## CRITICAL
— нет.

## MAJOR
— нет.

## MINOR
- Items тестируют все основные формы: `dessen`, `deren`, `der/die/das/dem/den/denen` + relative с предлогами `in der`, `von dem`, `für das`, `mit denen`, `bei der`, `über das`, `zu der`, `auf den`, `aus dem`, `mit der`. Полное покрытие.
- input-text помечает correct в hint (`(dessen)`, `(der)` …) — pedagogically полезно, но снижает challenge.

## Рекомендация
Не трогаем.
