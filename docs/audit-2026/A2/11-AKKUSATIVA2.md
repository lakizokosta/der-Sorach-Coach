# A2 · 11 — AKKUSATIVA2 (Audit 2026)

**Geprüfte Dateien:** 150 (50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genAkkusativ()` (Zeilen 306–332)
- `scripts/a2-input-text-data.mjs` → `BANK.AKKUSATIVA2` (Zeilen 209–227)
- `scripts/a2-dropbox-data.mjs` → `BANK.AKKUSATIVA2` (Zeilen 209–227)

---

## CRITICAL

### C1 · Dropbox: zwei fehlende Artikel im selben Satz

**Datei:** `a2-akk-dd-002.md` (zyklisch `-018`, `-034`, `-050`)
**Quelle:** `scripts/a2-dropbox-data.mjs:211`

**Wortliste:** `[Er, denkt, gern, an, Urlaub, Mosel]`
**Korrektsatz wäre:** `Er denkt gern an den Urlaub an der Mosel.`

**Probleme:**
1. `denken an` regiert Akkusativ → es fehlt `den` (mask. Akk.).
2. `Mosel` braucht eine Präposition mit Artikel: `an der Mosel` (lokal, Dat.).

**Fix:** Wortliste neu zusammenstellen, z. B. `[Er, denkt, gern, an, den, Urlaub, an, der, Mosel]` — aber `an` doppelt → `assertUnique` schlägt fehl. Alternative: Bezugswort wechseln, etwa `[Er, denkt, gern, an, seinen, Urlaub]`.

---

## MAJOR

Keine.

---

## MINOR

### m1 · Dropbox-Hints stark spoilernd

**Quelle:** `scripts/a2-dropbox-data.mjs:210–226`

**Beispiele:** `Hint: 'Akkusativ — den'`, `'Possessiv — deine'`, `'Akkusativ — eine'`.

**Bewertung:** Der Hint nennt jeweils direkt die Akkusativ-Form (`den`, `deine`, `eine`). Bei Drag-and-Drop reduziert das die Aufgabe auf „Wo platziere ich den vorgegebenen Artikel?" statt „Welche Form ist hier korrekt?". Konsistenter wäre `'Akkusativ — mask.'`, `'Possessiv — du, fem.'`.

---

## Geprüft & in Ordnung

- Alle 17 Items prüfen Akkusativ korrekt:
  - Akk.-Präpositionen: `auf` (denken an, warten auf, freuen auf), `durch`, `für`, `gegen`, `ohne`.
  - Akkusativ als direktes Objekt: `suche, sehe, brauche, lese, höre, kaufe, reserviere, buche`.
  - Genusverteilung gut gemischt: `den` (mask.), `das` (neutr.), `die` (fem.), `eine/einen/ein` (unbestimmt).
- Pool-Distraktoren konsistent: zu jedem Korrekt-Artikel werden alle anderen Kasus-Formen angeboten.
- Possessivartikel im Akkusativ (`deine, seinen`) korrekt.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 1      | Dropbox-Wortliste reparieren |
| MAJOR       | 0      | — |
| MINOR       | 1      | Hint-Generalisierung optional |
