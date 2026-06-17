# A2 · 03 — PERFEKTA2 (Audit 2026)

**Geprüfte Dateien:** 151 (1 Fremdling + 50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genPerfekt()` (Zeilen 70–96)
- `scripts/a2-input-text-data.mjs` → `BANK.PERFEKTA2` (Zeilen 49–67)
- `scripts/a2-dropbox-data.mjs` → `BANK.PERFEKTA2` (Zeilen 49–67)

---

## Schweregradskala

- **CRITICAL** — Falsche Antwort, falscher Hinweis, Lehrgegenstand widersprüchlich.
- **MAJOR** — Methodischer Fehler.
- **MINOR** — Stil.

---

## CRITICAL

### C1 · `kennenlernen` falsch mit `sein` konjugiert

**Dateien:**
- `a2-perf-in-001.md` (input-text, Bank Z.50)
- `a2-perf-dd-001.md` (dropbox, Bank Z.50)
- jeweils zyklische Wiederholungen `-018`, `-035` (input-text) bzw. `-018`, `-035` (dropbox).

**Quelle:** `scripts/a2-input-text-data.mjs:50`, `scripts/a2-dropbox-data.mjs:50`

**Item (input-text):**
```
Ich ___ gestern viele Leute kennengelernt. (Perfekt — sein/ich)   →  Korrekt: bin
```

**Problem:** `kennenlernen` ist ein **transitives Verb** und bildet das Perfekt mit **`haben`**, niemals mit `sein`.
Korrektsatz: `Ich habe gestern viele Leute kennengelernt.`
Der aktuelle Eintrag lehrt eine grammatisch falsche Form. Identischer Fehler in der Dropbox-Wortliste (`[Ich, bin, gestern, viele, Leute, kennengelernt]`).

**Fix:**
- Bank-Entry input-text: Antwort `bin` → `habe`, Hint `Perfekt — sein/ich` → `Perfekt — haben/ich`.
- Bank-Entry dropbox: Hint `Perfekt — bin gestern` → `Perfekt — habe gestern`, Wortliste `bin` → `habe`.
- Regenerieren mit `--restore-hints --topic=PERFEKTA2`.

### C2 · Fremde Datei im Topic-Ordner

**Datei:** `src/questions/A2/PERFEKTA2/a2-sort-2.md`

**Inhalt:** Dropbox-Übung "Wir sind gestern ins Kino gegangen" mit `id: a2-sort-2` — gehört thematisch zu Satzstellung, nicht zu Perfekt-Hilfsverben (auch wenn der Satz im Perfekt steht). Vermutlich Kopierfehler.

**Fix:** Datei in `SATZSTELLUNGA2/` verschieben oder löschen.

---

## MAJOR

### M1 · Distraktor `wurden` im select-one

**Quelle:** `scripts/a2-select-one-data.mjs:73`
**Datei:** `a2-perf-002.md` (zyklisch)

**Item:** `Wir ___ Pizza gegessen.` Korrekt: `haben`. Pool: `['sind', 'hat', 'wurden', 'sein']`.

**Problem:** `wurden` ist Präteritum von `werden`. Im Perfekt-Hilfsverb-Kontext irreführend — es trainiert nicht die `haben`/`sein`-Wahl. Pool sollte ausschließlich Hilfsverb-Formen enthalten.

**Fix-Vorschlag:** Pool zu `['sind', 'hat', 'ist', 'sein']`.

---

## MINOR

### m1 · Sehr enge Pool-Auswahl macht select-one zu leicht

Pools enthalten häufig 3 falsche Konjugationen desselben Hilfsverbs plus eine offensichtlich falsche Form (Infinitiv). Bei 50 Items mit nur 15 Templates wird Wiederholungslernen begünstigt, aber die Distraktorvielfalt schrumpft. Akzeptabel auf A2.

---

## Geprüft & in Ordnung

- Input-Text Items 2–17: `haben`/`sein`-Verteilung korrekt (`gegessen → haben`, `gefahren → sein`, `gekommen → sein`, `geschlafen → haben`, `gewesen → sein`).
- Select-One Items 2–15: Hilfsverben korrekt; alle Konjugationen passen zu Person.
- Dropbox Items 2–17: vollständige Sätze, Partizipien korrekt.
- Dropbox Z.61 (`a2-perf-dd-012.md`): `Ich bin an die Mosel gereist` — `reisen` mit `sein` ist korrekt.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 2      | Bank-Edit (input-text + dropbox) + 1 Datei verschieben |
| MAJOR       | 1      | Pool-Edit + Regen 1 select-one |
| MINOR       | 1      | — |
