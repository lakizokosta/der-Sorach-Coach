# SPRACHBAUSTEINEB2 (B2)

**Файлов:** 40 (`b2-sb1-01..20.md` + `b2-sb2-01..20.md`).
**Banks:** `TEIL1`, `TEIL2` в `scripts/b2-sprachbausteine-exam-data.mjs`.
**Формат:** telc B2 Sprachbausteine — 20 текстов по Teil 1 (Grammatik) + 20 по Teil 2 (Wortschatz). Каждый текст = 5 пропусков × 3 опции. Валидируется `validateTasks()`.

## CRITICAL
— нет.

## MAJOR
— нет.

## MINOR
- **m4** — TEIL2 #6 (`b2-sb2-06.md`, Mietvertrag Verlängerung):
  «Nebenkosten werden wie bisher ___ abgerechnet. correct: 'jährlich', options: 'jährlich/monatlich/stündlich'»
  Оба варианта `jährlich` и `monatlich` грамматически и фактически валидны (зависит от договора). `stündlich` явный distractor, но второй вариант делает выбор не однозначным. Решение: заменить distractor на нейтрально-неправильное (`einmalig`, `nachträglich`) или переписать контекст («Nebenkosten werden wie bisher **einmal pro Jahr** abgerechnet → jährlich»).

- Teil 1 #5 (`b2-sb1-05.md`, Seminar): `Bitte ___ Sie sich am 14. Oktober … ein.` correct = `finden` — `sich einfinden` (Funktionsverbgefüge). Хорошо.
- Teil 1 #3 (Antwort auf Beschwerde): первый gap correct = `die` (`Verzögerung, die durch …`) — корректный Relativpronomen Akk fem.
- Teil 2 #15 (Schulungsangebot, b2-sb2-15.md), gap #5: «Anmeldungen nehmen wir … bis zum 25. Oktober ___» correct = `entgegen` — конструкция `entgegennehmen` (trennbar). Pool: `'entgegen', 'mit', 'entgegennehmen'`. Второй distractor `'entgegennehmen'` — это полная форма глагола, могла бы быть валидной без `nehmen` в prompt; здесь distractor валидный, но edge-case. Acceptable.
- Все 40 текстов реалистичны (формальные письма / уведомления / запросы), стилистика B2-уровня выдержана. Очень хорошее упражнение.

## Рекомендация
- ИСПРАВИТЬ TEIL2 #6 (заменить distractor `monatlich`).
- Остальное не трогаем.
