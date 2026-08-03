# A1 · 07 — AKKUSATIVA1 (Audit 2026)

**Geprüfte Dateien:** 148 (3 frei + 45 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a1-select-one.mjs` → `genAkkusativ()` (Z.434–465)
- `scripts/generate-a1-input-text.mjs` → `BANK.AKKUSATIVA1` (Z.393–445)
- `scripts/a1-dropbox-data-3.mjs` → `AKKUSATIVA1` (Z.57–108)

---

## CRITICAL

_Keine kritischen Fehler gefunden._

---

## MAJOR

### M1 · Dropbox Z.101 — Wortstellung ohne Subjekt-Verb-Inversion-Stützen

**Datei:** `a1-akk-dd-044.md` (Bank Z.101)
**Words:** `['Er', 'sammelt', 'Briefmarken']`

**Bewertung:** ✓ korrekt, kein Bug. „Er sammelt Briefmarken." vollständiger Satz. → Gestrichen.

### M2 · Dropbox Z.105 — „Den Hund spazieren führen" mit Lücke nur für 4 Wörter

**Datei:** `a1-akk-dd-048.md` (Bank Z.105)
**Words:** `['Ich', 'führe', 'den', 'Hund']`
**Hint:** „Akkusativ — den Hund spazieren führen"

**Problem:** Hint nennt „spazieren führen" (vollständige Verbphrase), aber im Zielsatz fehlt `spazieren`. Lernender sucht es im Vorrat und findet es nicht — verwirrend.

**Fix:** Entweder `words: ['Ich', 'führe', 'den', 'Hund', 'spazieren']` (vollständiger Satz) oder Hint kürzen zu „Akkusativ — den Hund führen".

### M3 · Dropbox Z.107 — Imperativ ohne Subjekt

**Datei:** `a1-akk-dd-050.md` (Bank Z.107)
**Words:** `['Nimm', 'die', 'Medizin']`

**Bewertung:** ✓ Imperativ-Form ohne Subjekt ist im Deutschen korrekt („Nimm die Medizin!"). Kein Bug. → Gestrichen.

→ Nur **M2** als echtes MAJOR.

---

## MINOR

### m1 · Free-Items decken nur 3 Konfigurationen ab

`a1-akk-1` (der → den), `a1-akk-2` (eine), `a1-akk-3` (das) — keine Possessive (mein/dein) und keine Plural-Items im Free-Tier.

### m2 · BANK Z.443 — `Briefmarken` als Plural-Substantiv ohne expliziten Plural-Hint

**Datei:** `a1-akk-in-051.md`

```
'[Hobby] Er sammelt ___ Briefmarken. (die Briefmarken, Akk.)', 'die'
```

**Bewertung:** ✓ korrekt — `die Briefmarken` (Pl. Akk.) → `die`. Lerner muss erkennen, dass `Briefmarken` ein Plural ist. Vertretbar.

### m3 · Hint-Notation `(N, Akk.)` vs. `(ein/eine/einen)`

Hints schwanken zwischen `(der Mann, Akk.)` (Z.394) und `(ein Apfel, Akk.)` (Z.395). Beide korrekt, aber gemischt. Vereinheitlichen wäre wünschenswert.

---

## Geprüft & in Ordnung

- **Select-One Z.436–450** (15 Schablonen) — alle Akkusativformen korrekt (`den, einen, ein, das, die, meine, meinen, eine, diese`).
- **Input-Text** Items 1–50 — alle Antworten korrekt; keine Doppelungen wie in DATIVA1 — Substantiv steht nach `___`, Antwort enthält nur Artikel/Pronomen.
- **Dropbox** Items 1–50 — alle 50 Sätze grammatisch korrekt (außer M2-Hint-Problem).
- **Akkusativ-Verben**: alle Verben mit Akk.-Objekt korrekt (`sehen, kaufen, essen, trinken, lesen, besuchen, nehmen, brauchen, suchen, spielen, hören, machen, lieben, finden, rufen, schreiben, bestellen, verpassen, kennen, putzen, streicheln, treffen, lernen, reparieren, erkunden, schauen, beenden, werfen, buchen, fotografieren, sammeln, öffnen, lieben, lade…ein, führen, nehmen, teilen, einladen`).

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 0      | — |
| MAJOR       | 1      | 1 Bank-Edit (Hint oder Wörter ergänzen) |
| MINOR       | 3      | Optional |

**Empfehlung:** AKKUSATIVA1 ist nach PLURAL die zweitsauberste A1-Themengruppe. Nur 1 Bank-Edit nötig.
