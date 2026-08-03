# A2 · 08 — SUPERLATIVA2 (Audit 2026)

**Geprüfte Dateien:** 150 (50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genSuperlativ()` (Zeilen 222–248)
- `scripts/a2-input-text-data.mjs` → `BANK.SUPERLATIVA2` (Zeilen 149–167)
- `scripts/a2-dropbox-data.mjs` → `BANK.SUPERLATIVA2` (Zeilen 149–167)

---

## CRITICAL

Keine.

---

## MAJOR

Keine.

---

## MINOR

### m1 · Item 16 ohne Bezugssubstantiv

**Datei:** `a2-sup-in-016.md`
**Quelle:** `scripts/a2-input-text-data.mjs:165`

**Item:** `Am schönsten finde ich den ___ . (Superlativ — schön, mask., Akk.)` → `schönsten`

**Bewertung:** „Ich finde den schönsten." wirkt unfertig — der Satz endet ohne Substantiv. Auf A2 kann das verwirren („den schönsten was?"). Vorschlag: `Am schönsten finde ich den ___ Tag des Jahres.` mit Antwort `schönsten`.

**Vergleich Dropbox:** `:165` ändert die Konstruktion zu `[Am, schönsten, finde, ich, Frühling]` — auch ohne den-Artikel. Variante „Am schönsten ist mir der Frühling" wäre runder.

### m2 · `liebstes` als Superlativ etwas literarisch

**Quelle:** input-text `:151`
**Item:** `Das ist mein ___ Buch. (Superlativ — lieb, neutr., Nom.)` → `liebstes`

**Bewertung:** Korrekte Form, aber im Alltagsdeutsch häufiger `Lieblingsbuch` (Komposition) als `liebstes Buch` (Superlativ-Adjektiv). Didaktisch trotzdem in Ordnung, um die Form zu üben.

---

## Geprüft & in Ordnung

- Alle 17 Superlativformen korrekt (`schnellste, liebstes, beste, schönste, schnellsten, billigste, besten, höchste, bester, wärmsten, bekannteste, lautesten, kleinste, jüngste, leckersten, schönsten, teuerste`).
- Korrekte Unterscheidung **prädikativ/adverbial** (`am schönsten`) vs. **attributiv** (`der schönste`).
- Endungen für Genus/Kasus korrekt: `schnellste` (mask. Nom. mit `der`), `bester` (mask. Nom. mit `mein` — strong), `liebstes` (neutr. Nom. mit `mein`), `höchste` (mask. Nom. mit `der`).
- Unregelmäßige Superlative (`beste`, `höchste`, `liebstes`) richtig modelliert.
- Pool-Distraktoren plausibel: Komparativ-Form, fehlende Endung, `am`-Variante als Alternative.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 0      | — |
| MAJOR       | 0      | — |
| MINOR       | 2      | Optional |

**Empfehlung:** Topic ist sauber. Optional Item 16 ergänzen, sonst keine Änderung nötig.
