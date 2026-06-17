# KONSEKUTIVEKONJUNKTION (B2)

**Файлов:** 50 (`b2-konsek-001..050.md`).
**Bank:** `genKonsekutiveKonjunktion()` (`b2-select-one-data.mjs:74–94`, 17 items).

## CRITICAL
— нет.

## MAJOR
- **M3** — **все 17 items имеют correct `= dass`**. После `cycle50` ученик 50 раз нажимает `dass`. Полностью аналогично проблеме B1 ERGÄNZUNGSSATZ (которую мы исправили).

  Решение по аналогии с B1: добавить items с альтернативами:
  - `sodass` (без `so` в prompt): «Er sprach leise, sodass niemand ihn verstehen konnte.»
  - `so dass` как раздельный вариант — то же значение.
  - `derart … dass`, `solch ein … dass` — более редкие, но валидные конструкции.

## MINOR
- **m3** — items 3, 6, 10, 13 имеют `sodass` в distractor pool, хотя prompt уже содержит `so X`. В сочетании `so X, sodass …` это double-marker. Distractor валидный как ловушка, но требует осознанной обработки.
- **m2-аналог** — distractor pools местами не идеально однородны (некоторые items дают 4 distractor, другие 3).

## Рекомендация
- **Разбавить bank** так, чтобы 5–7 items имели `sodass` как correct (без `so` в prompt) и 1–2 — `derart … dass`.
- Hint функции `genKonsekutiveKonjunktion` (или общий) сменить с «Konsekutive Konjunktion — dass» (если такой есть) на нейтральный.
