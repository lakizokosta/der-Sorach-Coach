# A2 · 14 — POSSESSIVARTIKELA2 (Audit 2026)

**Geprüfte Dateien:** 153 (3 freie Sondertypen + 50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genPossessiv()` (Zeilen 392–418)
- `scripts/a2-input-text-data.mjs` → `BANK.POSSESSIVARTIKELA2` (Zeilen 303–321)
- `scripts/a2-dropbox-data.mjs` → `BANK.POSSESSIVARTIKELA2` (Zeilen 269–287)
- Freie Dateien: `a2-poss-gen-dd-001.md` … `a2-poss-gen-dd-003.md`

---

## CRITICAL

### C1 · Drei unvollständige Sätze in den freien Dropbox-Dateien

**Dateien:**
- `src/questions/A2/POSSESSIVARTIKELA2/a2-poss-gen-dd-001.md`
- `src/questions/A2/POSSESSIVARTIKELA2/a2-poss-gen-dd-002.md`
- `src/questions/A2/POSSESSIVARTIKELA2/a2-poss-gen-dd-003.md`

**Wortlisten:**
```
001: [Das, ist, meines, Vaters]
002: [Das, ist, deines, Bruders]
003: [Das, ist, unseres, Kindes]
```

**Problem:** Aus diesen Wörtern lassen sich keine grammatischen deutschen Sätze bauen. Ein Genitiv-NP (`meines Vaters`) kann nicht alleinstehendes Prädikat eines `sein`-Satzes sein. Korrekte Konstruktionen wären:
- `Das ist das Auto meines Vaters.` (Genitiv-Attribut zu einem Bezugssubstantiv)
- `Das ist mein Vater.` (Nominativ-Prädikativ)

**Fix:** Bezugssubstantiv einfügen, z. B.
- `[Das, ist, das, Auto, meines, Vaters]`
- `[Das, ist, das, Haus, deines, Bruders]`
- `[Das, ist, das, Zimmer, unseres, Kindes]`

Alternativ Items komplett ersetzen, da die generierten Items (input-text, select-one, dropbox) den Genitiv-Possessiv bereits ausreichend abdecken.

---

## MAJOR

Keine.

---

## MINOR

### m1 · Dropbox-Hints sind sehr knapp

**Quelle:** `scripts/a2-dropbox-data.mjs:270–286`

**Beispiele:** `'Possessiv — ich'`, `'Genitiv'`.

**Bewertung:** Person ohne Genus/Kasus zwingt den Lerner, die Form aus dem Substantiv abzuleiten — das ist didaktisch gut, könnte aber für A2-Anfänger zu viel sein. Optional Hint präzisieren: `'Possessiv — ich, mask., Gen.'`.

### m2 · Item 14 dropbox: `[Wir, feiern, euren, Geburtstag]`

**Quelle:** `scripts/a2-dropbox-data.mjs:283`

**Bewertung:** „Wir feiern **euren** Geburtstag" ist eine ungewöhnliche Konstellation (warum würde „wir" den Geburtstag von „euch" feiern? Eher umgekehrt). Grammatisch korrekt, aber pragmatisch schief. Optional `Wir feiern euren Hochzeitstag.` oder andere Person.

---

## Geprüft & in Ordnung

- Alle 17 input-text-Items korrekt: `meines, meiner, seiner, des, unsere, seiner, ihren, meiner, des, seines, meine, seinen, meiner, euren, ihres, meinem, Meine`.
- Genitiv-Possessiv (`meines Vaters`, `seiner Krankheit`, `seines Freundes`, `ihres Chefs`) korrekt nach Genus.
- Mischung von Possessivartikeln und reinen Genitiv-Artikeln (`des Kindes`, `des Regens`) gut differenziert.
- Select-One Items 1–15: Pools enthalten alle Formen einer Person (`meines, mein, meinem, meinen, meine` etc.) — anders als bei A1, wo Personen gemischt waren! Das ist eine deutliche Verbesserung gegenüber A1.
- Possessiv-Akkusativ vs. Possessiv-Dativ vs. Possessiv-Genitiv korrekt unterschieden.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 1      | 3 freie Dropbox-Dateien reparieren oder ersetzen |
| MAJOR       | 0      | — |
| MINOR       | 2      | Optional |
