# A2 · 16 — INDEFINITPRONOMEN (Audit 2026)

**Geprüfte Dateien:** 150 (50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genIndefinit()` (Zeilen 448–474)
- `scripts/a2-input-text-data.mjs` → `BANK.INDEFINITPRONOMEN` (Zeilen 343–361)
- `scripts/a2-dropbox-data.mjs` → `BANK.INDEFINITPRONOMEN` (Zeilen 309–327)

---

## CRITICAL

Keine.

---

## MAJOR

Keine.

---

## MINOR

### m1 · Item 16 input-text: Hint `Sache` für `nichts`

**Datei:** `a2-ind-in-016.md` (zyklisch)
**Quelle:** `scripts/a2-input-text-data.mjs:359`

**Item:** `Ich habe ___ davon gehört. (Indefinitpronomen — Sache)` → `nichts`

**Bewertung:** Der Hint `Sache` lässt eher `etwas` erwarten (Sach-Indefinitpronomen positiv). `nichts` ist Verneinung. Lerner können verwirrt sein.

**Fix:** Hint `Indefinitpronomen — Verneinung (Sache)` oder einfach `Verneinung — Sache`.

### m2 · `etwas` zweimal in Item 7 falsch interpretierbar

**Quelle:** `scripts/a2-input-text-data.mjs:350`

**Item:** `Hast du ___ Interesse an Sport? (Indefinitpronomen — Sache)` → `etwas`

**Bewertung:** `etwas Interesse` (= ein bisschen Interesse) ist als Quantifikator gebraucht, nicht als Sach-Indefinitpronomen. Methodisch grenzwertig.

### m3 · Akkusativform `niemanden` korrekt, aber selten geübt

**Items 6, 11:** `Ich sehe ___ auf der Straße.` → `niemanden`; `Ich kenne ___ hier in der neuen Stadt.` → `niemanden`.

**Bewertung:** Korrekt. Pool im select-one (Z.455) enthält `jemanden, etwas, alle, man` — das fördert die Verwechslung mit Akkusativ-Formen. Gut.

---

## Geprüft & in Ordnung

- Indefinitpronomen-Paradigma vollständig abgedeckt: `man, jemand, niemand, etwas, nichts`, sowie Akkusativformen `jemanden, niemanden`.
- Pool-Distraktoren in select-one wechseln korrekt zwischen Nominativ- und Akkusativ-Versionen.
- Items mit `Man` (unpersönlich) klar von `Jemand` (Person, Nom.) und `niemand`/`niemanden` (Verneinung) unterschieden.
- Dropbox-Sätze grammatisch und idiomatisch.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 0      | — |
| MAJOR       | 0      | — |
| MINOR       | 3      | Hint-Verfeinerung optional |

**Empfehlung:** Topic ist sauber. Optional Hint #16.
