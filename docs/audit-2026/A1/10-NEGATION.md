# A1 · 10 — NEGATION (Audit 2026)

**Geprüfte Dateien:** 149 (4 frei + 45 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a1-select-one.mjs` → `genNegation()` (Z.579–608)
- `scripts/generate-a1-input-text.mjs` → `BANK.NEGATION` (Z.553–604)
- `scripts/a1-dropbox-data-3.mjs` → `NEGATION` (Z.216–267)

---

## CRITICAL

_Keine kritischen Fehler gefunden._

---

## MAJOR

### M1 · Items mit `nicht` vs `kein` mehrdeutig

**Quelle:** mehrere Items in `BANK.NEGATION` und `genNegation()`.

**Beispiele:**
- Z.557: „Ich trinke ___ Kaffee." → `keinen` (Akk., mask.)
  - Aber auch „Ich trinke **nicht Kaffee, sondern Tee**" ist möglich (kontrastive Negation).
- Z.583: „Das ist ___ mein Fahrrad." → `nicht`
  - Eindeutig — „kein" ginge wegen „mein Fahrrad" (bestimmt) nicht.

**Bewertung:** Die meisten Items sind durch die Hint-Spezifikation (`kein, mask.` / `nicht`) eindeutig. Aber:

- **Z.582: „Das Wetter ist ___ schön." → `nicht`** ✓ eindeutig (Adj.-Negation).
- **Z.602: „Wir haben ___ Hund." → `keinen`** ✓ eindeutig.

Keine echten Fehler, nur konzeptuelle Schwierigkeit, die der Lerner durch Hint kompensieren kann.

→ M1 **nicht** als Bug — als pädagogische Anmerkung in MINOR verschoben.

### M2 · Item Z.602 (Free, `a1-neg-5.md`) Hint fehlt

**Datei:** `a1-neg-5.md`
**Prompt:** „Ich bin ___ spät dran."
**Correct:** `nie`

**Bewertung:** ✓ korrekt. Aber Free-Item ist das **einzige** mit `nie` als Antwort — die Premium-Items haben `noch nie` (Bank Z.564), aber kein eigenständiges `nie`. Inhalt korrekt, nur Aufzählung schwach.

---

## MINOR

### m1 · `nicht` vs `kein` mehrdeutig (siehe M1-Anmerkung)

### m2 · Free-Items decken nur 4 + 1 Negationsformen ab

`a1-neg-1` (keine), `a1-neg-2` (keinen), `a1-neg-3` (kein), `a1-neg-4` (nicht), `a1-neg-5` (nie) — gut verteilt, aber `noch nie` und `nie mehr` fehlen.

### m3 · BANK Z.591 — „Ich war noch nie in Paris" mit Hint „(noch nie)"

**Datei:** `a1-neg-in-011.md`

```
'[Reisen] Ich war ___ in Paris. (noch nie)', 'noch nie'
```

**Bewertung:** ✓ korrekt. Idiom „noch nie" als zwei Wörter — Lernender muss korrekt schreiben.

### m4 · Verbstellung mit Negation nicht thematisiert

Wo `nicht` steht, hängt von Komplement ab (Akk vs. Präp.-Phrase vs. Adj.). Die Items sind zwar formal korrekt, aber das eigentliche Schwierige (Stellung von `nicht`) wird nicht systematisch geübt. Für A1 ggf. angemessen — vertieft in B1.

---

## Geprüft & in Ordnung

- **Select-One Z.581–595** (15 Schablonen) — alle Negationsformen korrekt (`keine, nicht, keinen, kein, noch nie`).
- **Input-Text** Items 1–50 — alle Antworten korrekt zur Hint-Spezifikation.
- **Dropbox** Items 1–50 — alle 50 Sätze grammatisch korrekt.
- **Genus-Konsistenz** für `kein/keine/keinen`: alle korrekt (Zeit f, Hunger m, Auto n, Freunde Pl., Fleisch n, Geld n, Hausaufgaben Pl., Geschwister Pl., Haustier n, Medizin f, Sport m, Brot n, Termin m, Ticket n, Obst n, Handy n, Hut m, Musik f, Milch f, Chef m, Hund m, Kinder Pl.).
- **`nicht`-Position**: alle korrekt (vor Adj., vor Präp.-Phrase, am Ende bei Verb).

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 0      | — |
| MAJOR       | 0      | — |
| MINOR       | 4      | Optional |

**Empfehlung:** NEGATION ist sehr sauber. Keine Sofortkorrekturen nötig.
