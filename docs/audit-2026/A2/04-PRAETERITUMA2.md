# A2 · 04 — PRÄTERITUMA2 (Audit 2026)

**Geprüfte Dateien:** 151 (1 frei + 50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genPraeteritum()` (Zeilen 98–124)
- `scripts/a2-input-text-data.mjs` → `BANK.PRÄTERITUMA2` (Zeilen 69–87)
- `scripts/a2-dropbox-data.mjs` → `BANK.PRÄTERITUMA2` (Zeilen 69–87)

---

## CRITICAL

Keine.

---

## MAJOR

Keine.

---

## MINOR

### m1 · Dropbox-Hints sind generisch (`'Präteritum'`)

**Quelle:** `scripts/a2-dropbox-data.mjs:70–86` (alle 17 Items)

**Bewertung:** Im Perfekt-Topic enthalten Dropbox-Hints das Verb explizit (`'Perfekt — hat gegessen'`). Im Präteritum-Topic lautet der Hint immer nur `'Präteritum'`. Konsistenz wäre wünschenswert: `'Präteritum — spielte'`, `'Präteritum — war'`, etc.

### m2 · Modalverben im Präteritum

**Items:** `:84` `wollte`, `:85` `sollte` (jeweils `a2-prät-in-015/016.md`).

**Bewertung:** Modalverben im Präteritum sind A2-relevant (typische Form: `wollte`, `konnte`, `musste`, `sollte`, `durfte`). Items sind korrekt eingebaut. Optional: `konnte`, `musste`, `durfte` ergänzen für vollständige Paradigmenabdeckung.

---

## Geprüft & in Ordnung

- **Input-Text** Items 1–17 — alle Präteritum-Formen korrekt (`spielte`, `war`, `trank`, `waren`, `kaufte`, `schlief`, `fuhren`, `wusste`, `las`, `hatte`, `warteten`, `zog`, `wollte`, `sollte`).
- **Select-One** Items 1–15 — Distraktor-Pools mischen sinnvoll: Präsens/Partizip/Infinitiv/2.Sg.-Präsens.
- **Dropbox** Items 1–17 — vollständige Sätze, korrekte Wortstellung.
- Starke vs. schwache Verbgruppen ausgewogen abgedeckt: schwach (`spielte, kaufte, warteten`) und stark (`trank, schlief, fuhr, las, zog, wusste`).
- Beispiele kontextuell stimmig zu A2-Lektionen ("Bankschalter", "Mosel", "Berlin", "Schulsystem").

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 0      | — |
| MAJOR       | 0      | — |
| MINOR       | 2      | Optional — Konsistenz mit PERFEKT-Hints |

**Empfehlung:** Dieses Topic ist eines der saubersten in A2. Nur kosmetische Verbesserungen.
