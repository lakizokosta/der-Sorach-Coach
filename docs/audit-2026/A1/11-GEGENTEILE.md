# A1 · 11 — GEGENTEILE (Audit 2026)

**Geprüfte Dateien:** 150 (5 frei + 45 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a1-select-one.mjs` → `genGegenteile()` (Z.617–680)
- `scripts/generate-a1-input-text.mjs` → `BANK.GEGENTEILE` (Z.606–657)
- `scripts/a1-dropbox-data-3.mjs` → `GEGENTEILE` (Z.269–320)

---

## CRITICAL

_Keine kritischen Fehler gefunden._

---

## MAJOR

### M1 · Dropbox Z.297 — „hart" als Gegenteil von „sanft" — unscharfes Wortpaar

**Datei:** `a1-geg-dd-028.md` (Bank Z.297)
**Hint:** „Gegenteil — hart / sanft"
**Words:** `['Die', 'Pause', 'ist', 'sanft']`

**Problem:** „Hart" hat mehrere Antonyme je nach Bedeutung:
- physikalisch hart ↔ weich (Brot ist hart/weich)
- charakterlich hart ↔ sanft/mild (jemand ist hart/sanft)
- schwierig ↔ leicht (Test ist hart/leicht)

„Die Pause ist sanft" wird im Deutschen praktisch nie gesagt — Pausen sind „kurz", „lang", „erholsam", „anstrengend". „Sanft" für eine Pause ist sehr ungewöhnlich.

**Fix-Vorschlag:** Wortpaar austauschen, z. B. `hart ↔ weich` mit Substantiv „Bett" oder „Brot". Beispiel: „Das Brot ist weich."

### M2 · Input-Text Z.609 — „kalt" mit zwei möglichen Kontexten

**Datei:** `a1-geg-in-003.md` (Bank Z.609)

```
'[Wetter] Gestern war es warm, heute ist es ___. (Gegenteil von warm)', 'kalt'
```

**Bewertung:** ✓ eindeutig — `kalt`. Aber Lernender könnte auch `kühl` schreiben (Gegenteil von „warm" je nach Skala). Validator akzeptiert nur `kalt`.

**Fix-Vorschlag (optional):** Antwort-Array `['kalt', 'kühl']`.

### M3 · BANK Z.643 — „einfach / schwierig" semantisch ähnlich zu „leicht / schwer"

**Datei:** `a1-geg-in-037.md` (Bank Z.643)

```
'[Schule] Die Frage ist einfach, die Aufgabe ist ___. (Gegenteil von einfach)', 'schwierig'
```

**Bewertung:** ✓ korrekt, aber wiederholt das Konzept aus Z.613 (leicht/schwer). Inhaltliche Doppelung — kein Bug.

---

## MINOR

### m1 · Mehrere Gegenteile pro Adjektiv möglich

Viele Adjektive haben mehrere mögliche Gegenteile:
- `groß` ↔ `klein` ✓ (kanonisch), aber auch `winzig`
- `schön` ↔ `hässlich` ✓ (kanonisch), aber auch `unattraktiv`, `unschön`
- `gut` ↔ `schlecht` ✓ (kanonisch), aber auch `böse`, `mies`

Die Auswahl ist immer kanonisch — gut für A1.

### m2 · Z.611 — `billig / teuer` aus Bank vs `preiswert` als alternativ

`billig` hat negative Konnotation, `preiswert` ist neutral. Gegenteil von beiden ist `teuer`. Lerner lernen `billig`, was umgangssprachlich angesehen wird. Nicht falsch.

### m3 · Free-Items decken nur 5 Gegenteile

`a1-geg-1` (klein), `…-2`, `…-3`, `…-4`, `…-5` — alle korrekt. Premium-Items decken 50 weitere Paare ab.

### m4 · Inkonsistente Kapitalisierung in Free-Items

`a1-geg-1` mit ASCII `"groß"` (Z.12), andere Items mit deutschen Anführungszeichen `„..."`.

---

## Geprüft & in Ordnung

- **Select-One Z.619–644** (25 Paare) — alle Gegenteilpaare lexikalisch korrekt.
- **Input-Text** Items 1–50 — alle Antworten korrekt (mit Ausnahme der Mehrdeutigkeit in M2).
- **Dropbox** Items 1–50 — alle 50 Sätze grammatisch korrekt.
- **Antonym-Validierung**: alle 50 + 25 = 75 Wortpaare bei Standard-Synonymwörterbüchern als Gegenteile bestätigt.
- **Themen-Verteilung**: ausgewogen (Wetter, Sport, Familie, Schule, Stadt, Tiere, Essen, Hobby, Reisen, Arbeit, Gesundheit, Musik).

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 0      | — |
| MAJOR       | 2 (M1 + M2) | 2 Bank-Edits |
| MINOR       | 4      | Optional |

**Empfehlung:** GEGENTEILE sehr sauber. Einzelne lexikalische Schwächen sind das Hauptproblem.
