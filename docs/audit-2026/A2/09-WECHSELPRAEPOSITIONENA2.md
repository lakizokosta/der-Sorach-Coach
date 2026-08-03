# A2 · 09 — WECHSELPRÄPOSITIONENA2 (Audit 2026)

**Geprüfte Dateien:** 150 (50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genWechsel()` (Zeilen 250–276)
- `scripts/a2-input-text-data.mjs` → `BANK.WECHSELPRÄPOSITIONENA2` (Zeilen 169–187)
- `scripts/a2-dropbox-data.mjs` → `BANK.WECHSELPRÄPOSITIONENA2` (Zeilen 169–187)

---

## CRITICAL

### C1 · Dropbox: fehlender Artikel `die` vor `Wand`

**Datei:** `a2-wech-dd-006.md` (zyklisch `-022`, `-038`)
**Quelle:** `scripts/a2-dropbox-data.mjs:175`

**Wortliste:** `[Stellen, Sie, die, Leiter, an, Wand]`
**Korrektsatz wäre:** `Stellen Sie die Leiter an die Wand.`

**Problem:** Es fehlt `die` vor `Wand` (Akkusativ-Artikel). Aus den vorhandenen Wörtern lässt sich kein grammatischer Satz bilden.

**Fix:** Wortliste `[Stellen, Sie, eine, Leiter, an, die, Wand]` (ersetze `die Leiter` durch `eine Leiter`, damit `die` nur einmal vorkommt und `assertUnique` greift), oder alternative Formulierung ohne `die`-Duplikat.

### C2 · Dropbox: „nach Haus" statt „nach Hause"

**Datei:** `a2-wech-dd-014.md` (zyklisch `-030`, `-046`)
**Quelle:** `scripts/a2-dropbox-data.mjs:183`

**Wortliste:** `[Nach, der, Schule, gehe, ich, nach, Haus]`

**Problem:** Die standardsprachliche Form ist `nach Hause` (mit `-e`); `nach Haus` ist dialektal/veraltet.

**Fix:** `Haus` → `Hause`.

---

## MAJOR

Keine.

---

## MINOR

### m1 · Hint enthält die Antwort

**Datei:** `a2-wech-in-017.md` (zyklisch)
**Quelle:** `scripts/a2-input-text-data.mjs:186`

**Item:** `Das Kind spielt ___ Garten. (Wo? — im)` → `im`

**Bewertung:** Der Hint `Wo? — im` nennt direkt die Korrektantwort. Lerner muss nichts mehr ableiten.

**Fix:** Hint zu `(Wo? — in + Dat.)` (wie bei Z.172 `Wo? — in + Dat.`).

### m2 · Select-One: „Nach Haus" statt „Nach Hause"

**Quelle:** `scripts/a2-select-one-data.mjs:265`
**Item:** `Wohin gehst du nach der Schule? — ___ Haus.` → Korrekt `Nach`.

**Bewertung:** Analog C2 — `Haus` statt `Hause`. Hier ist der Fehler im Prompt, nicht im Wortbeispiel — daher MINOR.

### m3 · Item 4 input-text mit Modalverb ohne Bewegungs­verb

**Quelle:** `scripts/a2-input-text-data.mjs:173`
**Item:** `Deshalb möchte ich ___ Zoo. (Wohin? — in + Akk.)` → `in den`

**Bewertung:** Umgangssprachlich akzeptiert („Ich möchte in den Zoo" statt „Ich möchte in den Zoo gehen"), didaktisch streng genommen unvollständig. Hint ist korrekt.

---

## Geprüft & in Ordnung

- Wechselpräpositionen sauber nach Wo (Dat.)/Wohin (Akk.) sortiert.
- Pools differenzieren konsequent zwischen Dativ- und Akkusativ-Artikeln.
- Kontraktionen (`im`, `ins`, `am`, `ans`) als eigenständige Pool-Werte vorhanden.
- Items mit `bei` (Z.182 `bei der Arbeit`) korrekt klassifiziert.
- Hints geben Genus des Substantivs implizit durch den Artikel im Pool.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 2      | 2 Wortlisten-Edits |
| MAJOR       | 0      | — |
| MINOR       | 3      | Hint-Bereinigung |
