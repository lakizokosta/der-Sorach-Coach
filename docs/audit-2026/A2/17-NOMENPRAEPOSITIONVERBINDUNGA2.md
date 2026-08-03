# A2 · 17 — NOMENPRÄPOSITIONVERBINDUNGA2 (Audit 2026)

**Geprüfte Dateien:** 150 (50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genNomenPraep()` (Zeilen 476–502)
- `scripts/a2-input-text-data.mjs` → `BANK.NOMENPRÄPOSITIONVERBINDUNGA2` (Zeilen 363–381)
- `scripts/a2-dropbox-data.mjs` → `BANK.NOMENPRÄPOSITIONVERBINDUNGA2` (Zeilen 329–347)

---

## CRITICAL

Keine.

---

## MAJOR

Keine.

---

## MINOR

### m1 · Item 14 input-text: `Recht in der Sache` unidiomatisch

**Datei:** `a2-npv-in-014.md`
**Quelle:** `scripts/a2-input-text-data.mjs:377` (input-text), `scripts/a2-select-one-data.mjs:491` (select-one)

**Item:** `Er hat Recht ___ der Sache. (Nomen-Präp. — Recht)` → `in`

**Bewertung:** Die Wendung „Recht in einer Sache haben" existiert, ist aber selten. Idiomatisch ist `(In dieser Sache) hat er Recht.` (Recht haben ohne feste Präposition). Lerner werden „Recht haben mit + Dat." natürlicher empfinden („Er hat Recht mit seiner Aussage").

**Fix-Vorschlag:** Item ersetzen durch eine wirklich gebräuchliche Nomen-Präp.-Kollokation: `Er hat Anspruch ___ eine Belohnung.` → `auf`.

### m2 · Item 12 input-text: Konstruktion mit `nehmen` statt Nomen

**Quelle:** `scripts/a2-input-text-data.mjs:375`

**Item:** `Sie nimmt Teil ___ dem Kurs. (Nomen-Präp. — Teilnahme)` → `an`

**Bewertung:** `teilnehmen an` ist ein trennbares Verb, nicht eine Nomen-Präp.-Verbindung. Im Item wird die Verb-Form genutzt, aber als Lernziel `Teilnahme` deklariert. Konsistenter wäre `Sie meldet ihre Teilnahme ___ dem Kurs.` → `an`.

### m3 · Item 7 dropbox: `Sie hat Freude an Musik`

**Quelle:** `scripts/a2-dropbox-data.mjs:336`

**Bewertung:** Korrekte Kollokation, aber `Freude an + Dat.` ist eher gehoben. Auf A2 ist `Spaß an + Dat.` üblicher (kommt in Z.344 vor). Dopplung im Konzept nicht schlimm.

---

## Geprüft & in Ordnung

- Alle Nomen-Präp.-Kollokationen korrekt:
  - `Interesse an, Angst vor, Lust auf, Respekt vor, Hoffnung auf, Freude an, Zeit für, Vertrauen in, Bedarf an, Erfolg bei, Zweifel an, Spaß an`.
- Pool-Distraktoren bestehen aus echten Präpositionen, die in anderen Kollokationen üblich sind — sehr realistische Verwechslungsgefahr.
- Items 16, 17 input-text bilden eine schöne Brücke zu den festen Verben (`sich interessieren für`, `Lust auf`).

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 0      | — |
| MAJOR       | 0      | — |
| MINOR       | 3      | Optional |

**Empfehlung:** Topic ist insgesamt sauber. Optional Items 12 und 14 polishen.
