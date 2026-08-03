# A1 · 06 — DATIVA1 (Audit 2026)

**Geprüfte Dateien:** 154 (4 frei + 45 select-one + 50 input-text + 50 dropbox + 5 weitere)
**Quellen:**
- `scripts/generate-a1-select-one.mjs` → `genDativ()` (Z.395–426)
- `scripts/generate-a1-input-text.mjs` → `BANK.DATIVA1` (Z.340–391)
- `scripts/a1-dropbox-data-3.mjs` → `DATIVA1` (Z.3–55)

---

## CRITICAL

### C1 · Massenfehler: Lückentext + Antwort verdoppeln das Substantiv

**Betroffen:** 22 Dateien in `src/questions/A1/DATIVA1/` (alle aus dem fehlerhaften Muster)

Die Lücke `___` steht **vor** dem Substantiv, aber die richtige Antwort enthält **dasselbe Substantiv noch einmal**. Wenn der Lernende die korrekte Antwort einsetzt, entsteht eine Verdopplung.

**Beispiele aus `BANK.DATIVA1`:**

| Bank-Zeile | Datei | Prompt | `correct` | Ergebnis nach Einsetzen |
|------------|-------|--------|-----------|--------------------------|
| Z.347 | `a1-dat-in-007.md` | `Ich erzähle ___ Kindern eine Geschichte.` | `den Kindern` | **„Ich erzähle den Kindern Kindern eine Geschichte."** |
| Z.350 | `a1-dat-in-010.md` | `Ich kaufe ___ Mutter eine Karte.` | `meiner Mutter` | **„Ich kaufe meiner Mutter Mutter eine Karte."** |
| Z.356 | `a1-dat-in-016.md` | `Ich spiele mit ___ Ball.` | `dem Ball` | **„Ich spiele mit dem Ball Ball."** |
| Z.357 | `a1-dat-in-017.md` | `Sie singt mit ___ Freundin.` | `der Freundin` | **„Sie singt mit der Freundin Freundin."** |
| Z.360 | `a1-dat-in-020.md` | `Ich gebe ___ Verkäufer Geld.` | `dem Verkäufer` | „Ich gebe dem Verkäufer Verkäufer Geld." |
| Z.361 | `a1-dat-in-021.md` | `Der Stift gehört ___ Schüler.` | `dem Schüler` | „… dem Schüler Schüler." |
| Z.362 | `a1-dat-in-022.md` | `Ich schenke ___ Oma Blumen.` | `meiner Oma` | „… meiner Oma Oma Blumen." |
| Z.366 | `a1-dat-in-026.md` | `Aus ___ Fenster sehe ich den Park.` | `dem Fenster` | „Aus dem Fenster Fenster sehe …" |
| Z.367 | `a1-dat-in-027.md` | `Mit ___ Freunden esse ich gern.` | `meinen Freunden` | „… meinen Freunden Freunden …" |
| Z.368 | `a1-dat-in-028.md` | `Nach ___ Arbeit fahre ich nach Hause.` | `der Arbeit` | „… der Arbeit Arbeit …" |
| Z.369 | `a1-dat-in-029.md` | `Bei ___ Regen bleibe ich drinnen.` | `Regen` | **„Bei Regen Regen bleibe …"** |
| Z.370 | `a1-dat-in-030.md` | `Der Arzt hilft ___ Patient.` | `dem Patienten` | **„Der Arzt hilft dem Patienten Patient."** (zusätzl. N-Dekl.-Mismatch!) |
| Z.371 | `a1-dat-in-031.md` | `In ___ Schuhen laufe ich schnell.` | `den Schuhen` | „… den Schuhen Schuhen …" |
| Z.372 | `a1-dat-in-032.md` | `Mit ___ Gitarre spielt er ein Lied.` | `der Gitarre` | „… der Gitarre Gitarre …" |
| Z.373 | `a1-dat-in-033.md` | `Ich gratuliere ___ Team.` | `dem Team` | „… dem Team Team." |
| Z.375 | `a1-dat-in-035.md` | `Ich bringe ___ Kindern Süßigkeiten.` | `den Kindern` | „… den Kindern Kindern …" |
| Z.376 | `a1-dat-in-036.md` | `Ich vertraue ___ Freund.` | `meinem Freund` | „… meinem Freund Freund." |
| Z.377 | `a1-dat-in-037.md` | `Auf ___ Party tanzen alle.` | `der Party` | „Auf der Party Party tanzen …" |
| Z.378 | `a1-dat-in-038.md` | `Mit ___ Messer schneide ich Brot.` | `dem Messer` | „… dem Messer Messer …" |
| Z.379 | `a1-dat-in-039.md` | `In ___ Hotel übernachten wir.` | `dem Hotel` | „… dem Hotel Hotel …" |
| Z.381 | `a1-dat-in-041.md` | `Ich danke ___ netten Verkäuferin.` | `der Verkäuferin` | „… der Verkäuferin netten Verkäuferin." |
| Z.382 | `a1-dat-in-042.md` | `Mit ___ Schwester spiele ich Karten.` | `meiner Schwester` | „… meiner Schwester Schwester …" |
| Z.383 | `a1-dat-in-043.md` | `Ich gebe ___ Hund Wasser.` | `dem Hund` | „… dem Hund Hund Wasser." |
| Z.384 | `a1-dat-in-044.md` | `In ___ Bad dusche ich morgens.` | `dem Bad` | „In dem Bad Bad dusche …" |
| Z.385 | `a1-dat-in-045.md` | `Mit ___ Taxi komme ich schnell an.` | `dem Taxi` | „… dem Taxi Taxi …" |
| Z.389 | `a1-dat-in-049.md` | `Ich kaufe ___ Vater ein Geschenk.` | `meinem Vater` | „… meinem Vater Vater …" |

**Auch in Select-One (3 + 1 = 4 Dateien):**
- `a1-dat-012.md`, `a1-dat-027.md`, `a1-dat-042.md` → Item Z.403 in `genDativ()`: prompt `„Ich erzähle ___ Kindern eine Geschichte."` + `correct: "den Kindern"` → Verdopplung.
- `a1-dat-4.md` (frei) → identischer Bug.

**Ursache:** In `BANK.DATIVA1` enthält der Prompt das Substantiv **bereits**, gleichzeitig wird in `correct` die volle Phrase (Artikel + Substantiv) verlangt.

**Fix-Vorschlag (zwei Optionen pro Item):**

- **Option A (Lücke nur für Artikel):** `correct` reduzieren auf nur den Artikel/Possessiv, z. B. `dem` statt `dem Ball`. Prompt bleibt wie er ist.
- **Option B (Lücke für die ganze Phrase):** Substantiv aus dem Prompt entfernen, sodass `correct` die volle Phrase ersetzt. Beispiel: `„Ich erzähle ___ eine Geschichte."` + `correct: „den Kindern"`.

**Empfehlung:** Option A ist mit minimalem Aufwand machbar (nur `correct`-Felder anpassen, Hint anpassen), behält die kontextuelle Lesbarkeit bei.

Zusätzlich `a1-dat-in-030`: `„Patient"` → `„Patienten"` (N-Deklination), oder zumindest mit Option B `correct: „dem Patienten"` und `„Der Arzt hilft ___."`.

---

## MAJOR

### M1 · Hint Z.369 schlägt unmögliche Antwort vor

**Datei:** `a1-dat-in-029.md` (Bank Z.369)
**Prompt:** „Bei ___ Regen bleibe ich drinnen. (der Regen, Dat.)"
**Correct:** `Regen` (ohne Artikel!)

**Problem:** Der Hinweis sagt „der Regen, Dat." → Lernender erwartet „dem Regen". Tatsächliche Antwort lautet aber nur `Regen` (Verdopplung — siehe C1). Selbst wenn C1 behoben wird, ist hier „Bei dem Regen" stilistisch ungewöhnlich (üblich: „Bei Regen", ohne Artikel). Item sollte komplett umformuliert werden.

**Fix-Vorschlag:** Prompt: `„Bei ___ Wetter bleibe ich drinnen."` + `correct: "schlechtem"` — oder Item streichen.

### M2 · Dropbox Z.32 — „Mir geht es gut" mit Hint „mir geht gut"

**Datei:** `a1-dat-dd-030.md` (Bank Z.32)
**Hint:** „Dativ — mir geht gut"
**Words:** `['Mir', 'geht', 'es', 'gut']`

**Problem:** Hint ohne `es` ist unvollständig (typischer Anfängerfehler — Mir geht **es** gut). Im Hint sollte das Hilfssubjekt erwähnt sein.

**Fix-Vorschlag:** Hint: „Dativ — Mir geht es gut".

### M3 · Dropbox Z.26 — Wortstellung mehrdeutig

**Datei:** `a1-dat-dd-024.md` (Bank Z.26)
**Words:** `['Wir', 'spielen', 'nach', 'der', 'Schule']`

**Problem:** Zwei korrekte Reihenfolgen möglich:
- „Wir spielen nach der Schule." ✓
- „Nach der Schule spielen wir." ✓

Lernende könnten je nach Variante eine korrekt setzen, die Validierung akzeptiert aber nur eine.

**Fix-Vorschlag:** Eindeutige Variante erzwingen, z. B. `['Wir', 'spielen', 'nach', 'der', 'Schule', 'Fußball']` oder Zeitadverb hinzufügen.

---

## MINOR

### m1 · Free-Items decken nur Standard-Dativ ab

`a1-dat-1.md` … `a1-dat-5.md` — keine Pronomen (mir/dir/uns/euch), keine Pluralformen. Premium-Items decken alles ab.

### m2 · Hint-Format inkonsistent

In `BANK.DATIVA1` heißt der Hint mal `„Dativ — der X, Dat."`, mal nur `„Dativ — Dat."` nach `fix-input-text-hints.mjs`-Transformation. Lernender bekommt unterschiedliche Detailtiefe.

---

## Geprüft & in Ordnung

- **Select-One Z.397–402, 404–409, 411** (12 Schablonen) — alle ergeben grammatisch korrekte Sätze, keine Verdopplung.
- **Free Items `a1-dat-1`, `a1-dat-2`, `a1-dat-3`, `a1-dat-5`** — korrekt.
- **Dropbox** — 49/50 Sätze grammatisch korrekt (Ausnahme: M3).
- **Verb-Dativ-Konsistenz:** alle Verben mit Dativ-Objekt korrekt eingesetzt (`helfen, danken, gehören, antworten, gratulieren, folgen, gefallen, schmecken, vertrauen, schreiben, schenken, applaudieren, zuhören`).

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 1 (mit 26 betroffenen Items/Dateien) | 26 Bank-Einträge fixen + Regen aller 50 Input-Text und 3 Select-One Dateien |
| MAJOR       | 3      | Einzelfixes |
| MINOR       | 2      | Optional |

**Sofortpriorität:** C1 — größte Anzahl betroffener Dateien im gesamten A1, kompromittiert die Lerneffektivität der ganzen Dativ-Übung.
