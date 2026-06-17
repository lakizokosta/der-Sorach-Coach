# REDEWENDUNGEN (B2)

**Файлов:** 50 (`b2-rede-001..050.md`).
**Bank:** `genRedewendungen()` (`b2-select-one-data.mjs:382–402`, 17 items).

## CRITICAL
- **C1** — `b2-rede-004.md` (gen item #4):
  `Sie hat die Nase voll — sie hat die Nase ___ . correct: 'voll'`
  → итог: «Sie hat die Nase voll — sie hat die Nase voll.»
  Prompt сам показывает ответ. Тавтология, бессмысленный вопрос.

  Решение: переписать без подсказки в prompt. Например:
  - «Sie hat die Nase ___ — sie kann es nicht mehr ertragen.» → `voll`
  - «Sie hat von der Arbeit die Nase ___.» → `voll`

- **C2** — `b2-rede-014.md` (gen item #14):
  `Er ist mit dem falschen Bein ___ aufgestanden. correct: 'zuerst'`
  → итог: «Er ist mit dem falschen Bein zuerst aufgestanden.»

  Подлинная немецкая идиома: «**mit dem falschen Bein aufstehen**» (быть не в духе). Слово `zuerst` искажает идиому. Дополнительно: `zuerst` — это adverb, и его склонение (`zuerste/zuerstes/zuerstem`) в distractor pool — фантазийные формы.

  Решение: переформулировать. Варианты:
  - «Du bist heute wohl mit dem falschen ___ aufgestanden.» → `Bein`
  - «Sie ist heute mit dem falschen Bein aufgestanden — sie ist ___ Laune.» → `schlechter`

## MAJOR
— нет.

## MINOR
- **m2** — gen item #3 (`Wir müssen den Stein ins ___ bringen.`): distractor pool `['Rollens', 'Rolle', 'Rollen', 'Roller']` содержит дубликат `'Rollen'` = correct. `[...new Set(...)]` это маскирует, но в исходнике небрежно.

- Items 5, 7, 11, 12, 15, 16, 17 — отличные Redewendungen B2-уровня (`offen aussprechen`, `scharfes Auge`, `alles auf den Kopf stellen`, `um den heißen Brei reden`, `den Ball flach halten`, `ins kalte Wasser springen`, `auf den Punkt bringen`). Чистая лексика.

## Рекомендация
**ИСПРАВИТЬ** items #4 и #14 (CRITICAL). Минор #3 — почистить distractor pool.
