# PASSIVB2 (B2)

**Файлов:** 100 (`b2-pass-001..050.md` + `b2-pass-in-001..050.md`).
**Banks:** `genPassivB2()` (`b2-select-one-data.mjs:338–358`) + `BANK.PASSIVB2` (`b2-input-text-data.mjs:128–146`).

## CRITICAL
— нет.

## MAJOR
— нет.

## MINOR
- Items различают: Passiv-Präsens (`wird/werden + PII`), Passiv-Präteritum (`wurde/wurden + PII`), Passiv-Perfekt (`ist/sind + PII + worden`), Passiv-Futur (`wird + PII + werden`). Полное покрытие.
- input-text version помечает Tempus в hint (`(werden, Präteritum)`) — это очень полезно для самопроверки.

## Рекомендация
Не трогаем.
