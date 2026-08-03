# PASSIVERSATZ (B2)

**Файлов:** 100 (`b2-passv-001..050.md` + `b2-passv-in-001..050.md`).
**Banks:** `genPassiversatz()` (`b2-select-one-data.mjs:360–380`) + `BANK.PASSIVERSATZ` (`b2-input-text-data.mjs:168–186`).

## CRITICAL
— нет.

## MAJOR
- **M1** — Items #8 и #12 банков (= файлы `b2-passv-008.md`, `b2-passv-012.md`, `b2-passv-in-008.md`, `b2-passv-in-012.md`) — **off-topic**.

  Item #8 select-one: `Der Text ist zu lang, um ihn zu ___ . correct: 'zusammenfassen'`
  Item #12 select-one: `Das Thema ist zu komplex, um es kurz zu ___ . correct: 'erklären'`

  Конструкция `(zu Adj),  um zu + Inf` — это **finale/konsekutive Infinitivkonstruktion**, а **не Passiversatz**.
  Passiversatz это:
  1. `lassen + sich + Inf` (= können-Passiv): «Das lässt sich machen.»
  2. `sein + zu + Inf` (= können/müssen-Passiv): «Das ist zu machen.»
  3. `bekommen/kriegen + PII` (= Dativ-Passiv).
  4. `-bar/-lich`-Adjektive (= können-Passiv): «machbar», «lesbar».

  Решение: **заменить** эти 2 items в обоих банках на нормальные Passiversatz-примеры. Варианты:
  - «Das Auto ___ sich gut verkaufen.» → `lässt`
  - «Diese Frage ist nicht zu ___ .» → `beantworten`
  - «Die Maschine ist leicht zu ___ .» → `bedienen`

## MINOR
- Остальные 15 items в каждом банке делятся 50/50 между `lassen sich + Inf` и `sein zu + Inf` — отличный balance.
- Решение через тэг `(Grammatikform)` в hint — это попытка обойти проблему, но не решение.

## Рекомендация
**ИСПРАВИТЬ** 4 файла (2 select-one + 2 input-text), заменив `um … zu`-items на корректные Passiversatz-примеры.
