# A2 · 15 — GENITIVA2 (Audit 2026)

**Geprüfte Dateien:** 150 (50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genGenitiv()` (Zeilen 420–446)
- `scripts/a2-input-text-data.mjs` → `BANK.GENITIVA2` (Zeilen 323–341)
- `scripts/a2-dropbox-data.mjs` → `BANK.GENITIVA2` (Zeilen 289–307)

---

## CRITICAL

Keine.

---

## MAJOR

Keine.

---

## MINOR

### m1 · Dropbox-Hints generisch (`'Genitiv'`)

**Quelle:** `scripts/a2-dropbox-data.mjs:290–306`

**Bewertung:** Alle 17 Items haben identischen Hint. Eine Spezifikation wie `'Genitiv — wegen + Substantiv'` würde Lerner darauf hinweisen, welche Präposition Genitiv regiert (statt zufälligem Raten zwischen `wegen/während/trotz`).

### m2 · Sehr ähnliche Items mit `wegen`/`während`/`trotz`

**Bewertung:** Alle Items folgen dem Schema `[Genitiv-Präp] + [Genitiv-NP] + Hauptsatz`. Sehr fokussiert (das ist gut für die Übung), aber für 50 Items (zyklisch wiederholt) wird es repetitiv. Optional: Genitivobjekte ohne Präposition einbauen (`Das Buch des Lehrers`), die im Possessiv-Topic Z.304 ja auch vorkommen.

### m3 · `während` als Konjunktion auch zulässig

**Item:** `Während ___ Sommers freue ich mich auf Urlaub.` (Z.325)

**Bewertung:** `während` ist auf A2 oft Konjunktion (Temporalsatz). Hier ist es klar als Präposition + Genitiv markiert (durch das anschließende `des Sommers`). Lerner sollten den Unterschied erkennen.

---

## Geprüft & in Ordnung

- Alle 17 Items prüfen `wegen`/`während`/`trotz` + Genitiv korrekt:
  - mask./neutr.: `des Regens, des Sommers, des Unterrichts, des Problems, des Sturms, des Tages, des Lärms, des Preises` — alle mit `-s` am Substantiv (außer wenn schon auf `-s` endend).
  - fem.: `der Krankheit, der Kälte, der Verspätung, der Prüfung, der Müdigkeit, der Arbeit, der Pause` — Endung `-er` ohne Substantiv-Endung.
  - Plural: `der Ferien` — korrekt.
- Adjektiv im Genitiv (Z.340 `des schlechten Wetters`) — korrekt mit `-en`.
- Pool-Distraktoren bestehen ausschließlich aus Genitiv-Alternativen (`des/der`) plus Dativ/Akkusativ-Verwechslungen.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 0      | — |
| MAJOR       | 0      | — |
| MINOR       | 3      | Optional |

**Empfehlung:** Eines der saubersten Topics in A2. Keine Korrektur nötig.
