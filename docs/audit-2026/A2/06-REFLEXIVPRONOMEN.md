# A2 · 06 — REFLEXIVPRONOMEN (Audit 2026)

**Geprüfte Dateien:** 151 (1 frei + 50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genReflexiv()` (Zeilen 154–180)
- `scripts/a2-input-text-data.mjs` → `BANK.REFLEXIVPRONOMEN` (Zeilen 109–127)
- `scripts/a2-dropbox-data.mjs` → `BANK.REFLEXIVPRONOMEN` (Zeilen 109–127)

---

## CRITICAL

### C1 · Select-One: Distraktor identisch mit Korrektantwort

**Datei:** `a2-refl-002.md` (zyklisch `-017`, `-032`, `-047`)
**Quelle:** `scripts/a2-select-one-data.mjs:157`

**Item:**
```
Er ___ sich für Musik.   →  Korrekt: interessiert
Pool: ['interessiere', 'interessierst', 'interessieren', 'interessiert']
```

**Problem:** `interessiert` steht **bereits im Pool**. `options4` dedupliziert das zwar, lässt aber nur 3 echte Distraktoren übrig → Aufgabe wird mathematisch leichter (33% statt 25% Zufallstreffer).

**Fix:** Pool `['interessiere', 'interessierst', 'interessieren', 'interessierte']` (oder Partizip-Form `interessiert` durch andere Personalform ersetzen).

---

## MAJOR

### M1 · Select-One Item 5: Doppelter Distraktor im Pool

**Quelle:** `scripts/a2-select-one-data.mjs:160`

**Item:**
```
Ich ___ mich für Sport.   →  Korrekt: interessiere
Pool: ['interessiert', 'interessieren', 'interessierst', 'interessiert']
```

**Problem:** `interessiert` doppelt im Pool. Reine Eingabe-Schlamperei. Wie bei C1 reduziert das die Distraktorzahl.

**Fix:** Letztes Element auf andere Form ändern, z. B. `'interessierte'` (Präteritum).

---

## MINOR

### m1 · Item 16/30/44 reflexives Verb mit *trennbarem* Präfix

**Quelle:** input-text `:122` (`anziehen`), `:123` (`vorbereiten`)

**Bewertung:** Beide Verben sind trennbar **und** reflexiv. Hint `Reflexiv — anziehen/du` lässt offen, ob das Präfix `an` am Satzende stehen muss. Bei input-text wird nur eine Verbform abgefragt → unkritisch.

### m2 · Item 7 ist eigentlich Perfekt, nicht Reflexivpronomen

**Quelle:** input-text `:116`
**Satz:** `Ich ___ mich erkältet. (Perfekt — erkälten/ich)` → `habe`

**Bewertung:** Hier wird **Hilfsverb-Wahl** geübt, nicht Reflexivpronomen. Methodisch fehl am Platz. Optional in PERFEKTA2 verschieben oder ein reflexiv-spezifisches Item finden.

### m3 · Pool-Distraktor `gefreet`

**Quelle:** select-one `:167`
**Pool:** `['freut', 'freuen', 'gefreet', 'freust']`

**Bewertung:** `gefreet` ist eine Phantasieform — korrektes Partizip ist `gefreut`. Als Distraktor wirkt es unfair, weil es nirgendwo wirklich vorkommt. ⇒ Ersetzen durch `gefreut`.

---

## Geprüft & in Ordnung

- Input-Text Items 1–6, 8–15, 17: alle reflexiven Verbformen korrekt (`wasche, freut, treffen, beeilt, interessiere, wäscht, sieht, freue, verletzt, sehen, fühle, ziehst, bereitet, kümmert, erholen`).
- Reflexivpronomen-Paradigma vollständig abgedeckt (mich, dich, sich, uns, euch).
- Dropbox-Items: vollständige Sätze, korrekte Wortstellung mit Reflexivpronomen.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 1      | Pool-Edit + Regen |
| MAJOR       | 1      | Pool-Edit + Regen |
| MINOR       | 3      | Optional |
