# A1 · 09 — W-FRAGEN (Audit 2026)

**Geprüfte Dateien:** 150 (5 frei + 45 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a1-select-one.mjs` → `genWFragen()` (Z.539–575)
- `scripts/generate-a1-input-text.mjs` → `BANK['W-FRAGEN']` (Z.500–551)
- `scripts/a1-dropbox-data-3.mjs` → `W_FRAGEN` (Z.163–214)

---

## CRITICAL

_Keine kritischen Fehler gefunden._

---

## MAJOR

### M1 · Input-Text Z.532 — „Wie warm" als Antwort, akzeptiert keine alternativen Antworten

**Datei:** `a1-wf-in-032.md` (Bank Z.532)

```
'[Wetter] ___ ist es heute draußen? — 20 Grad. (Frage nach Temperatur)', 'Wie warm'
```

**Problem:** Zwei gleichermaßen idiomatische Fragen sind möglich:
- „**Wie warm** ist es heute draußen?" ✓
- „**Wie kalt** ist es heute draußen?" ✓ (bei kaltem Wetter)
- „**Wie viel Grad** ist es heute draußen?" ✓
- „**Was für ein Wetter** ist es heute draußen?" ✓

Validator akzeptiert nur „Wie warm". Bei `20 Grad` kontextuell mehrdeutig (kühler Frühlingstag oder warmer Sommertag — beides nennt man je nach Temperaturerwartung „warm" oder „kalt").

**Fix-Vorschlag:** Antwort-Array erweitern: `['Wie warm', 'Wie kalt', 'Wie viel Grad']` oder Frage präzisieren (z. B. „— 30 Grad" → eindeutig „Wie warm").

### M2 · Input-Text Z.547 — `Wie viele` vs `Welche` für Eltern-Zählung

**Datei:** `a1-wf-in-047.md` (Bank Z.547)

```
'[Familie] ___ Eltern hast du? — Zwei. (Frage nach Anzahl)', 'Wie viele'
```

**Bewertung:** ✓ korrekt — Antwort „Zwei" zwingt zur Anzahl. Aber Lernende könnten auch „Welche" wählen (Welche Eltern hast du? — Zwei). Hint klärt das („Frage nach Anzahl"). Vertretbar.

### M3 · Dropbox Z.213 — `['Mit', 'wem', 'gehst', 'du']` mit Hint „Mit wem gehen?"

**Datei:** `a1-wf-dd-050.md` (Bank Z.213)
**Words:** `['Mit', 'wem', 'gehst', 'du']`

**Bewertung:** ✓ korrekt („Mit wem gehst du?"). Item ist eigentlich kein W-Fragewort mehr (das ist Dativ-Fragepronomen + Präposition), also thematisch leicht abweichend, aber linguistisch sauber.

---

## MINOR

### m1 · Bank-Inkonsistenz: „Welches Team" als W-Frage

`BANK['W-FRAGEN']` Z.533–538: Items mit `Welches/Welche/Welchen` als Antwort. Das sind **Interrogativpronomen**, keine reinen W-Fragewörter. Vermischung der Konzepte (W-Wort vs. Interrogativpronomen). Für A1 verzeihlich, aber didaktisch sauberer wäre ein eigenes Thema.

### m2 · Free-Items decken nur 5 Fragewörter ab

`a1-wf-1` (Woher), `…-2` (Wann), `…-3` (Wohin), `…-4` (Wie), `…-5` (Was) — fehlt: Wer, Warum, Wo, Welcher.

### m3 · Hint-Stil sehr explizit

`(Frage nach Ort)`, `(Frage nach Zeit)` etc. — sehr direkt, spoilt die Antwort. Für A1 didaktisch vertretbar.

---

## Geprüft & in Ordnung

- **Select-One Z.540–556** (15 Schablonen) — alle W-Fragen grammatisch korrekt, Subjekt/Verb-Inversion sauber.
- **Input-Text** Items 1–50 — alle Antworten korrekt (`Wo, Woher, Wohin, Wann, Wie, Was, Wer, Warum, Wie viel, Welches, Welche, Welchen, Wie oft, Wie alt, Wie lange, Wie warm, Wie viele`).
- **Dropbox** Items 1–50 — alle 50 W-Fragen grammatisch korrekt, eindeutige Wortstellung.
- **Antworten-Konsistenz**: alle Antworten zur Frage passend (Wo→Ort, Wann→Zeit, Wer→Person, etc.).

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 0      | — |
| MAJOR       | 1      | 1 Bank-Edit (Mehrfachantworten oder Frage präzisieren) |
| MINOR       | 3      | Optional |

**Empfehlung:** W-FRAGEN ist gut gepflegt. Nur Z.532 sollte präziser werden.
