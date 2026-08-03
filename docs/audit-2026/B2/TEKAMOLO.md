# TEKAMOLO (B2)

**Файлов:** 100 (`b2-tkml-001..050.md` — select-one + `b2-tkml-dd-001..050.md` — dropbox).
**Banks:** `genTekamolo()` (`b2-select-one-data.mjs:426–446`) + `BANK.TEKAMOLO` (`b2-dropbox-data.mjs:7–93`).

## CRITICAL

- **C3** — `select-one` все 50 файлов имеют **>1 валидный ответ**.

  Пример `b2-tkml-001.md`:
  - correct: «Er fährt morgen wegen der Konferenz mit dem Zug nach Berlin.» (TeKaMoLo default order)
  - distractor 1: «Wegen der Konferenz fährt er morgen mit dem Zug nach Berlin.» — **тоже корректен** (Kausal-Glied в Vorfeld, ein сильнее emphasis).
  - distractor 4: «Morgen fährt er nach Berlin wegen der Konferenz mit dem Zug.» — нарушает TKML, но grammatisch nicht falsch (Temporal в Vorfeld + Lokal перед Modal — стилистически слабо, но не неграмматично).

  Прoблема: prompt `Welche Satzstellung ist korrekt?` подразумевает **только один** корректный вариант. Но без явного маркера «TeKaMoLo» distractors с Vorfeld-перестановками — тоже корректные предложения.

  Решения:
  1. **Сменить formulation prompt-а** на «Welche Satzstellung folgt der **TeKaMoLo-Reihenfolge** (Subject + Verb + Tem + Kau + Mod + Lok)?» (уже частично сделано в hint: `(TeKaMoLo-Reihenfolge)`).
  2. **Сделать distractor pool жёстким**: только грамматически некорректные перестановки (например, Verb не на втором месте). Сейчас distractors сохраняют V2-порядок, что делает их корректными.
  3. **Полностью переписать тему как dropbox** (что уже есть) и убрать `select-one` версию (или сократить).

## MAJOR
— нет (помимо C3).

## MINOR

- **m7** — `b2-tkml-dd-014.md` (dropbox bank item #14):
  hint: `TeKaMoLo — heute / wegen Gäste / aufwendig / in der Küche`
  words: `['Er', 'kocht', 'heute', 'wegen', 'der', 'Gäste', 'aufwendig', 'in', 'seiner', 'Küche']`
  → words содержит `in seiner Küche` (Possessivartikel), а hint обещает `in der Küche` (definiter Artikel). Несоответствие.

  Решение: или words → `['in', 'der', 'Küche']`, или hint → `… in seiner Küche`.

- dropbox bank (17 уникальных items, cycle50 → 50 файлов): assertUnique pass для всех items. Codes (T/K/M/L) выверены. Хорошее упражнение.

## Рекомендация
- **CRITICAL C3** требует архитектурного решения от пользователя (см. вопрос #2 в `00-ZUSAMMENFASSUNG.md`).
- **MINOR m7** — поправить item #14 (либо hint, либо words).
