# A2 · 12 — FESTEPRÄPOSITIONENA2 (Audit 2026)

**Geprüfte Dateien:** 150 (50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genFestePraep()` (Zeilen 334–360)
- `scripts/a2-input-text-data.mjs` → `BANK.FESTEPRÄPOSITIONENA2` (Zeilen 229–247)
- `scripts/a2-dropbox-data.mjs` → `BANK.FESTEPRÄPOSITIONENA2` (Zeilen 229–247)

---

## CRITICAL

### C1 · Topic-Mismatch: Lückenwort ist Adjektiv statt Präposition

**Dateien:** alle Vorkommen von Bank-Items 5 und 9.
- `a2-fest-in-005.md`, `a2-fest-005.md` (zyklisch alle 5er-Schritte)
- `a2-fest-in-009.md`, `a2-fest-009.md`

**Quellen:** `scripts/a2-input-text-data.mjs:234, 238`, `scripts/a2-select-one-data.mjs:340, 344`

**Items:**
```
[5]  Ich interessiere mich für ___ Musik.   → klassische   (feste Präposition)
[9]  Ich hoffe auf ___ gutes Wetter.         → gutes        (feste Präposition)
```

**Problem:** Das Lernziel des Topics ist die **feste Präposition** (`sich interessieren für`, `hoffen auf`). Stattdessen ist die Lücke auf das **Adjektiv** gelegt, dessen Endung geübt wird (Akkusativ fem./neutr.). Der Hint `feste Präposition` ist irreführend, weil die Antwort kein Präpositional-Element ist.

**Fix-Vorschläge:**
1. Lücke verschieben: `Ich interessiere mich ___ klassische Musik.` → `für`
2. Items in `ADJEKTIVDEKLINATIONA2` verschieben.
3. Items komplett ersetzen durch echte Beispiele wie `Ich freue mich auf ___ Wochenende.` → `das`.

---

## MAJOR

### M1 · Topic vermischt drei Lernziele

**Bewertung übergreifend:**
- Items 1–4, 6–8, 10–15 üben **Artikel** im Akkusativ/Dativ nach fester Präposition (`eine, seine, die, den, einem, das, dem`).
- Items 16–17 üben **die Präposition selbst** (`auf` bei `freuen auf`, `bestehen auf`).
- Items 5 und 9 üben **Adjektivendung** (siehe C1).

**Folge:** Lerner ist nie sicher, ob er Artikel, Adjektiv oder Präposition produzieren soll. Auf A2 ist „feste Präposition" eigentlich das Konzept „Verb regiert eine bestimmte Präposition", das man auswendig lernen muss.

**Fix:** Topic in zwei Teile splitten:
- `FESTEPRÄP-PRÄP`: 30 Items, in denen die Präposition selbst Lücke ist (`auf`, `an`, `über`, `für`, `von`, `mit`, `nach`).
- `FESTEPRÄP-ARTIKEL`: 20 Items, in denen nach Präposition das richtige Artikel-/Pronominalkasus geübt wird.

---

## MINOR

### m1 · Dropbox-Hints sehr informativ

**Quelle:** `scripts/a2-dropbox-data.mjs:230–246`

**Beispiele:** `'warten auf'`, `'denken an'`, `'sich freuen auf'`.

**Bewertung:** Dropbox-Hints sind didaktisch hervorragend (geben die Kollokation explizit). Bei der Hint-Politik konsistent: input-text- und select-one-Hints sind generischer.

---

## Geprüft & in Ordnung

- Dropbox-Items 1–17: alle Sätze grammatisch und idiomatisch korrekt; Kollokationen treffend gewählt.
- Liste der echten festen Präpositionen: `warten auf, denken an, sprechen über/mit, freuen auf, interessieren für, träumen von, diskutieren über, ärgern über, hoffen auf, erinnern an, danken für, fragen nach, lachen über, bestehen auf` — alle korrekt.
- Pool-Distraktoren in select-one passen zum jeweiligen Substantiv.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 1      | 2 Items refaktorieren oder verschieben |
| MAJOR       | 1      | Topic-Aufteilung (mittlerer Aufwand) |
| MINOR       | 1      | — |
