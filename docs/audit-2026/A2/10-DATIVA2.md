# A2 · 10 — DATIVA2 (Audit 2026)

**Geprüfte Dateien:** 150 (50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genDativ()` (Zeilen 278–304)
- `scripts/a2-input-text-data.mjs` → `BANK.DATIVA2` (Zeilen 189–207)
- `scripts/a2-dropbox-data.mjs` → `BANK.DATIVA2` (Zeilen 189–207)

---

## CRITICAL

Keine.

---

## MAJOR

Keine.

---

## MINOR

### m1 · Item 16/17 input-text — Personalpronomen statt Artikel

**Quelle:** `scripts/a2-input-text-data.mjs:205–206`
- `Das schmeckt ___ gut. (Personalpronomen — du, Dat.)` → `dir`
- `Ich helfe ___ beim Ausfüllen. (Personalpronomen — Sie, Dat.)` → `Ihnen`

**Bewertung:** Diese Items üben Personalpronomen im Dativ, nicht Artikel. Methodisch berechtigt (Personalpronomen ist Dativ-Stoff auf A2), aber konsistent mit dem Topic-Namen wäre `DATIVA2` rein artikelbasiert. Alternativ explizite Unter-Sektion „Personalpronomen Dativ" einführen.

### m2 · Dropbox-Hints sind generisch (`'Dativ'`)

**Quelle:** `scripts/a2-dropbox-data.mjs:190–206`

**Bewertung:** Wie schon bei PRÄTERITUM/MODALVERBEN — Hints könnten das Verb nennen (`'Dativ — helfen'`, `'Dativ — antworten'`).

---

## Geprüft & in Ordnung

- Alle 17 Items prüfen Dativ in unterschiedlichen Konstellationen:
  - Dativverben: `antworten, helfen, danken, folgen, gratulieren, vertrauen`.
  - Dativ-Possessiv: `gebe meiner Mutter`, `schreibt seinem Freund`, `wohne bei meinen Eltern`, `kaufe meiner Schwester`.
  - Dativ-Präpositionen: `mit dem Bus`, `in einer Firma`, `auf dem Stuhl`, `in der Schule`.
  - Personalpronomen-Dativ: `dir`, `Ihnen`.
- Pool-Distraktoren decken alle Genus-Kasus-Verwechslungen ab (`die/den/des/dem`).
- Possessivartikel-Dativ-Formen korrekt: `meiner` (fem. Dat.), `seinem` (mask. Dat.), `meinen` (Pl. Dat.), `unseren` (Pl. Dat.).

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 0      | — |
| MAJOR       | 0      | — |
| MINOR       | 2      | Optional |

**Empfehlung:** Topic ist sauber. Optional Hint-Konsistenz.
