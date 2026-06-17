# A1 · 01 — POSSESSIVARTIKEL (Audit 2026)

**Geprüfte Dateien:** 150 (5 frei + 45 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a1-select-one.mjs` → `genPossessiv()` (Zeilen 96–161)
- `scripts/generate-a1-input-text.mjs` → `BANK.POSSESSIVARTIKEL` (Zeilen 73–125)
- `scripts/a1-dropbox-data.mjs` → `POSSESSIVARTIKEL` (Zeilen 3–55)

---

## Schweregradskala

- **CRITICAL** — Falsche Antwort, falscher Hinweis, Lehrgegenstand widersprüchlich.
- **MAJOR** — Methodischer Fehler: Distraktoren ungeeignet, Antwort durch Hinweis trivial.
- **MINOR** — Stilistisch / didaktisch verbesserungswürdig, aber nicht falsch.

---

## CRITICAL

### C1 · Falscher Genus-Hinweis bei „Team"

**Datei:** `src/questions/A1/POSSESSIVARTIKEL/a1-poss-in-026.md`
**Quelle:** `generate-a1-input-text.mjs` Z.99
**Satz:** „___ Team gewinnt heute. (ihr, mask., Nom.)" → `Euer`

**Problem:** `Team` ist **Neutrum** (das Team), nicht Maskulinum. Der Hinweis `(ihr, mask., Nom.)` lehrt falsches Genuswissen.
Die Antwort `Euer` bleibt zwar korrekt (Maskulinum und Neutrum Nominativ sind bei `euer` identisch), aber der Lernende prägt sich ein falsches Genus ein.

**Fix:** Hinweis auf `(ihr, neutr., Nom.)` ändern.

---

## MAJOR

### M1 · Distraktoren-Pool mischt fremde Personen — Hinweis trivialisiert Aufgabe

**Betroffen:** alle 45 Dateien `a1-poss-006.md` … `a1-poss-050.md`
**Quelle:** `generate-a1-select-one.mjs` Z.135 (gemeinsamer `pool`)

**Problem:** Der gemeinsame Pool enthält Formen aller Personen:
```
['mein','meine','meinen','meinem','meiner','dein','deine','deinen',
 'sein','seine','seinen','ihr','ihre','ihren','unser','unsere','euer','eure']
```
Der Hinweis nennt aber **immer** die Person explizit, z. B. `(ich, mask., Nom.)`. Beispiel `a1-poss-006.md`:

```
options: meinen | ihr | deinen | mein
correct: mein
prompt: "Das ist ___ Vater. (Possessivartikel — ich, mask., Nom.)"
```

→ Der Lernende eliminiert `ihr` und `deinen` trivial nach Person und steht vor 50 % statt 25 %. `Wahlloses` Raten zwischen `mein/meinen` ist die einzige verbleibende Übung.

**Fix-Vorschlag:** Distraktoren auf Formen **derselben Person** beschränken (z. B. für `ich`: `mein, meine, meinen, meinem, meiner`). Dadurch wird Kasus/Genus geübt, nicht Personalpronomen.

### M2 · Pool unvollständig für 1./2. Plural und 3. Person fem./pl.

**Betroffen:** alle Dateien `a1-poss-006.md` … `a1-poss-050.md`
**Quelle:** `generate-a1-select-one.mjs` Z.135

**Problem:** Pool enthält **nicht**: `unseren, unserem, unserer, euren, eurer, eurem, seiner, seinem, deinem, deiner, ihrem, ihrer`.

Folge: bei `correct = "unseren"` (Schablone „Wir werfen ___ Ball.") oder `correct = "ihrer"` (Schablone „Ich übe auf ___ Gitarre." mit Set `er/sie`) gibt es **keine paradigmatischen Mitspieler** (z. B. `unser/unsere/unserem`). Die Distraktoren kommen alle aus anderen Personen.

**Fix-Vorschlag:** Pool um vollständige Paradigmen erweitern oder pro Frage dynamisch aus der jeweiligen Personenreihe ziehen.

### M3 · Template „Im Sommer arbeite ich in ___ Büro." semantisch holprig

**Betroffen:** `a1-poss-023.md`, `…-038.md`, `…` (alle Vorkommen, abhängig vom Zyklus)
**Quelle:** `generate-a1-select-one.mjs` Z.117 (template Index 9)

**Problem:** Der Satz „Im Sommer arbeite ich in ___ Büro." kollidiert lexikalisch — „im Büro" wäre natürlicher. Mit Possessivartikel: „in meinem Büro" ist grammatisch korrekt, aber im Kontext „Im Sommer arbeite ich…" wirkt seltsam (warum nur im Sommer? warum „mein" Büro?).

**Fix-Vorschlag:** „Ich arbeite gern in ___ Büro." oder Kontext entfernen.

---

## MINOR

### m1 · Freie Items decken nur 3 Personen ab

**Betroffen:** `a1-poss-1.md` … `a1-poss-5.md`
**Personen:** `ich, ich, ich, du, sie Pl.` — keine Items für `er, wir, ihr`.

**Bewertung:** Premium-Items decken alles ab — nicht kritisch, aber kostenlose Stufe gibt unausgewogenes Bild.

### m2 · Hinweise sind sehr explizit

**Betroffen:** alle 45 Premium-Select-One sowie 50 Input-Text.
**Beispiel:** `(Possessivartikel — du, fem., Nom.)` nennt Person + Genus + Kasus.

**Bewertung:** Für A1 vertretbar (Lernende brauchen Stützen), aber didaktisch wäre es lehrreicher, mindestens Genus selbst aus dem Substantiv ableiten zu lassen.

### m3 · Input-Text: „Seine Arbeit beginnt um 8 Uhr." semantisch ambig

**Datei:** `a1-poss-in-019.md` (Bank Z.92)

**Bewertung:** „Seine Arbeit" kann „seine Arbeitsstelle" oder „seine Tätigkeit" meinen — beides plausibel, kein Fehler. Lediglich erwähnt.

---

## Geprüft & in Ordnung

- **Free `a1-poss-1.md` … `-5.md`** — alle Genus-/Kasusformen korrekt, inkl. `Das ist ihr Auto.` mit Hinweis „sie, Plural" (3. Pl. und 3. Sg. fem. haben identische Possessivformen).
- **Dropbox `a1-poss-dd-001.md` … `-050.md`** — alle 50 Wortketten ergeben grammatisch korrekte deutsche Sätze. Keine telegrafischen Lücken, keine fehlenden Subjekte/Artikel.
- **Input-Text** Items 1–25, 27–50 — alle Antworten korrekt zur Hinweis-Spezifikation (außer C1 oben).
- **Genus-Konsistenz Substantive:** alle Substantive (Vater, Mutter, Heft, Tasche, Fahrrad …) tragen korrekte Genusangaben in Hinweisen — Ausnahme **C1** (Team).
- **Dat./Akk.-Logik:** Verben mit Dativ (`helfen, danken, gehören, antworten, gratulieren, folgen, gefallen, schmecken, gehören, vertrauen`) und Akkusativ (`rufen, besuchen, packen, suchen, sehen, kaufen, lesen, hören, brauchen, treffen`) — alle Items grammatisch konsistent.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 1      | 1 Hint-Edit + Regen 1 Datei |
| MAJOR       | 3      | Pool-/Schablonen-Refaktorierung in `genPossessiv()` + Regen 45 Dateien |
| MINOR       | 3      | Optional, keine sofortige Korrektur nötig |

**Empfehlung:** C1 und M1+M2 zusammen beheben (gemeinsamer Edit in `generate-a1-select-one.mjs` plus Regenerierung aller 45 Select-One-Files). M3 + alle MINORs optional.
