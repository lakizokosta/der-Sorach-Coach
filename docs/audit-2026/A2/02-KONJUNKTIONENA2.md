# A2 · 02 — KONJUNKTIONENA2 (Audit 2026)

**Geprüfte Dateien:** 151 (1 frei + 50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genKonjunktionen()` (Zeilen 42–68)
- `scripts/a2-input-text-data.mjs` → `BANK.KONJUNKTIONENA2` (Zeilen 29–47)
- `scripts/a2-dropbox-data.mjs` → `BANK.KONJUNKTIONENA2` (Zeilen 29–47)

---

## Schweregradskala

- **CRITICAL** — Falsche Antwort, falscher Hinweis, Lehrgegenstand widersprüchlich.
- **MAJOR** — Methodischer Fehler.
- **MINOR** — Stil.

---

## CRITICAL

### C1 · Dropbox-Satz ohne Subjekt im Nebensatz

**Datei:** `a2-konj-dd-006.md` (zyklisch `-022`, `-038`)
**Quelle:** `scripts/a2-dropbox-data.mjs:35`

**Wortliste:** `[Weil, müde, war, ging, ich, früh, schlafen]`

**Problem:** Im Nebensatz fehlt das **Subjekt `ich`**. Mit den gegebenen Wörtern lässt sich kein vollständiger deutscher Satz bilden. Korrekt wäre: `Weil ich müde war, ging ich früh schlafen.`

**Fix:** Wortliste anpassen — zwei Möglichkeiten:
1. Subjekt im Hauptsatz „opfern" → `[Weil, ich, müde, war, schlief, ich, früh]` (hat `ich` doppelt — `assertUnique` würde diese Variante ablehnen).
2. Subjekt nur einmal: `[Weil, ich, müde, war, ging, früh, schlafen]` — grammatisch zwar lückenhaft (Hauptsatz ohne Subjekt), aber im Lückentyp Dropbox üblich. Besser: ganzen Satz refaktorieren auf `[Weil, das, Wetter, schlecht, war, blieben, wir, drinnen]`.

### C2 · Dropbox: Hinweis nennt Konjunktion, die nicht in den Wörtern vorkommt

**Datei:** `a2-konj-dd-016.md` (zyklisch `-032`, `-048`)
**Quelle:** `scripts/a2-dropbox-data.mjs:45`

**Hint:** `Konjunktion — Wenn`
**Wortliste:** `[Bei, Fehlern, melden, Sie, sich, bitte]`

**Problem:** Die Wörter enthalten **keine Konjunktion**, sondern eine reine Präpositionalkonstruktion (`Bei Fehlern`). Der Hinweis `Wenn` ist irreführend; die richtige Lösung gemäß Hint wäre `Wenn Sie einen Fehler machen, melden Sie sich bitte.`

**Fix:** Wortliste ersetzen, z. B. `[Wenn, Sie, einen, Fehler, machen, melden, Sie, sich, bitte]` — beachte `Sie` zweimal: `assertUnique` schlägt fehl. Lösungsvorschlag: `[Wenn, Sie, etwas, brauchen, sagen, Sie, Bescheid]` — auch `Sie` doppelt. Vereinfachung: `[Wenn, du, einen, Fehler, machst, melde, dich, bitte]`.

---

## MAJOR

### M1 · Select-One-Pool mischt subordinierende und koordinierende Konjunktionen ohne Hinweis

**Quelle:** `scripts/a2-select-one-data.mjs:44–58`

**Problem:** Die Distraktor-Pools enthalten regelmäßig sowohl subordinierende (`weil`, `wenn`, `dass`, `ob`) als auch koordinierende (`denn`, `und`, `aber`, `oder`) Konjunktionen. Auf A2 ist der Unterschied „Wortstellung Nebensatz vs. Hauptsatz" zentral, wird aber im Hint nicht benannt. Lerner können bei Mehrfachakzeptanz (`weil` vs. `denn`) verwirrt sein.

**Fix-Vorschlag:** Hinweise im input-text bereits sehr gut (`Konjunktion — Grund`, `— Bedingung`, `— Nebensatz`, `— indirekte Frage`). Im select-one fehlt der Hint komplett, da der `verbFormHint`-Generator hier keinen sinnvollen Beitrag liefert. ⇒ Items als Tupel `[prompt, correct, pool, hint]` erweitern und den Hint mit ausgeben.

---

## MINOR

### m1 · Item 17 input-text mit `wie`

**Quelle:** `a2-input-text-data.mjs:46`
**Satz:** `Hoffentlich kommt er, ___ er versprochen hat. (Art und Weise)` → `wie`

**Bewertung:** `wie` als vergleichende Konjunktion ist eher B1-Niveau. Auf A2 begegnet Lernenden `wie` meist als Fragewort/Vergleichspartikel. Item bleibt didaktisch vertretbar, sollte aber als „leicht überpitched" markiert werden.

---

## Geprüft & in Ordnung

- Input-Text Items 1–16: alle Korrektantworten stimmen, Hinweise nennen Funktion (`Grund`, `Nebensatz`, `Bedingung`, `indirekte Frage`) klar.
- Select-One Items 1–15: korrekte Antworten und plausible Distraktoren.
- Dropbox Items 1–5, 7–15, 17: vollständige, grammatisch korrekte Sätze.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 2      | 2 Dropbox-Wortlisten reparieren |
| MAJOR       | 1      | Hint-Ausgabe im select-one ergänzen |
| MINOR       | 1      | Optional |
