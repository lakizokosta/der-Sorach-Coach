# A2 · 18 — TRENNBAREVERBEN (Audit 2026)

**Geprüfte Dateien:** 150 (50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genTrennbar()` (Zeilen 504–530)
- `scripts/a2-input-text-data.mjs` → `BANK.TRENNBAREVERBEN` (Zeilen 383–401)
- `scripts/a2-dropbox-data.mjs` → `BANK.TRENNBAREVERBEN` (Zeilen 349–367)

---

## CRITICAL

### C1 · Semantisch falsches Verb: `einfahren` für „nach Hause kommen"

**Dateien:**
- `a2-trenn-in-012.md` (input-text, Bank Z.395)
- `a2-trenn-012.md` (select-one, Z.517)
- zyklische Wiederholungen

**Quelle:** `scripts/a2-input-text-data.mjs:395`, `scripts/a2-select-one-data.mjs:517`

**Item input-text:** `Wir ___ nach Hause ein. (trennbar — einfahren/wir)` → `fahren`
**Item select-one:** `Wir ___ nach Hause ein.` → `fahren`

**Problem:** `einfahren` bedeutet im Deutschen:
- „in einen Bahnhof, Tunnel, Stollen einfahren" (Zug, Fahrzeug → festes Ziel mit Eingang)
- „ein Fahrzeug einfahren" (technisch: erste Kilometer mit neuem Auto)
- übertragen: „Geld einfahren" (Gewinne einfahren)

**Nicht möglich:** *„Wir fahren nach Hause ein." — dieses Verb existiert nicht in diesem Kontext.

**Fix:** Verb ersetzen:
- `Wir kaufen heute ___. (trennbar — einkaufen/wir)` → `kaufen` (auf der Dropbox-Seite schon vorhanden: Z.361!)
- oder `Wir fahren mit dem Zug in den Bahnhof ___. (trennbar — einfahren/wir)` → `ein` (echte Bedeutung)

---

## MAJOR

Keine.

---

## MINOR

### m1 · `aufstehen` mehrfach im Set

**Quelle:** input-text `:384, 387, 390, 396, 400` (5 Items mit `aufstehen`).

**Bewertung:** 5 von 17 Templates üben dasselbe Verb. Auch wenn die Personen variieren (`du, wir, er, sie, ich`), wird die Vielfalt der trennbaren Verben unnötig reduziert.

**Fix-Vorschlag:** Einige `aufstehen`-Items durch `abfahren, ankommen, einladen, vorlesen, mitkommen` ersetzen.

### m2 · Pool im select-one mit „bereits getrennten" Distraktoren

**Quelle:** select-one `:506`
**Pool:** `['steht', 'stehen', 'aufstehst', 'stehst auf']`

**Bewertung:** `stehst auf` ist die korrekte abgetrennte Form für „Du stehst auf" — wenn die Lücke nur das Verb-Stammwort vor `auf` füllen soll, ist `stehst auf` als Distraktor unfair (es ist ebenfalls korrekt, nur mit doppeltem `auf`). `aufstehst` ist Infinitivform mit Präfix — auch eine typische Lernerfehlerproduktion. OK, aber Pool könnte sauberer.

### m3 · Dropbox-Hint `'Trennbares Verb'` generisch

**Quelle:** `scripts/a2-dropbox-data.mjs:350–366`

Wie in anderen Topics — Konsistenz mit Format `'Trennbares Verb — aufstehen'` wäre wünschenswert.

---

## Geprüft & in Ordnung

- Mischung trennbarer Präfixe: `auf-, an-, aus-, ein-, vor-, zu-`.
- Trennbare-Verben-Wortstellung im Hauptsatz korrekt (Präfix am Satzende).
- Items mit Modalverb/Perfekt fehlen — auf A2 ist das sinnvoll, da Hauptsatz-Trennung die primäre Schwierigkeit ist.
- Konjugationen korrekt: `stehst auf` (du), `ruft an` (er/sie/es), `mache an` (ich), `stehen auf` (wir), `macht aus` (sie), `steige ein` (ich), etc.
- Dropbox-Items 1–17: vollständige Sätze, Präfix korrekt am Satzende.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 1      | Bank-Edit (input-text + select-one), Regen |
| MAJOR       | 0      | — |
| MINOR       | 3      | Optional |
