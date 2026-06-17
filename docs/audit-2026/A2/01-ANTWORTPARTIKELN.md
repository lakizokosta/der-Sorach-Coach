# A2 · 01 — ANTWORTPARTIKELN (Audit 2026)

**Geprüfte Dateien:** 151 (1 frei + 50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genAntwortpartikeln()` (Zeilen 14–40)
- `scripts/a2-input-text-data.mjs` → `BANK.ANTWORTPARTIKELN` (Zeilen 9–27)
- `scripts/a2-dropbox-data.mjs` → `BANK.ANTWORTPARTIKELN` (Zeilen 9–27)

---

## Schweregradskala

- **CRITICAL** — Falsche Antwort, falscher Hinweis, Lehrgegenstand widersprüchlich.
- **MAJOR** — Methodischer Fehler: Distraktoren ungeeignet, Antwort durch Hinweis trivial.
- **MINOR** — Stilistisch / didaktisch verbesserungswürdig, aber nicht falsch.

---

## CRITICAL

### C1 · Grammatikfehler im Quellsatz: „ich trinke **keinen**" für „Milch"

**Datei:** alle Vorkommen aus `a2-select-one-data.mjs:27`, also `a2-part-012.md` und zyklische Wiederholungen (`-022`, `-032`, `-042`)
**Quelle:** `scripts/a2-select-one-data.mjs` Z.27

**Item:**
```
„Trinkst du Milch?" — „___, ich trinke keinen."   →  Korrekt: Nein
```

**Problem:** `Milch` ist **feminin** (die Milch). Korrekt wäre `keine` (Akk. fem.). Die Lernerin liest also den Beispielsatz mit einem **grammatischen Fehler** ab. Die Antwortpartikel `Nein` selbst ist richtig — aber der Beispielkontext lehrt falsches Genuswissen.

**Fix:** Beispielsatz ändern auf `„Ich trinke keine."` oder Bezugswort tauschen, z. B. `„Trinkst du Kaffee?" — „Nein, ich trinke keinen."` (Kaffee = mask., Akk. = keinen — passt).

---

## MAJOR

Keine.

---

## MINOR

### m1 · Dropbox: `Zuhause` statt `zu Hause`

**Datei:** `a2-part-dd-005.md` (zyklisch auch `-015`, `-025`, `-035`, `-045`)
**Quelle:** `scripts/a2-dropbox-data.mjs:14`

**Wortliste:** `[Gehen, wir, ins, Kino, oder, bleiben, Zuhause]`

**Bewertung:** `Zuhause` ist das Substantiv (das Zuhause). Hier ist das Adverb gemeint → standardsprachlich `zu Hause` (zwei Wörter). Da Dropbox keine Bindestriche unterstützt, ist das mit `assertUnique`-Wörtern kniffliger; Lösung: anderes Beispiel.

### m2 · Free-Item fehlt — nur 1 Datei für die kostenlose Stufe

**Bewertung:** Mit 50 Premium-Items pro Subtyp (input/dropbox/select-one) ist die Topic-Abdeckung mehr als ausreichend. Aber die Free-Stufe besteht aus nur 1 Item — andere Themen haben 5. Optional: 4 Items hinzufügen für `ja/nein/doch/aber/oder`.

---

## Geprüft & in Ordnung

- **Input-Text** Items 1–11, 13–17 — alle korrekt (Hint nennt Partikel-Typ explizit).
- **Select-One** Items 1–11, 13–15 — alle Antworten richtig, Distraktoren plausibel.
- **Dropbox** Items 1–4, 6–17 — Sätze grammatisch und semantisch in Ordnung.
- Pool `PART_POOL_CAPS` für Satzanfänge korrekt von `PART_POOL` getrennt (Großschreibung).
- `Doch` als Antwort auf negativ-formulierte Fragen wird durchgehend richtig modelliert.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 1      | 1 Item-Edit + `--restore`-Regen für select-one |
| MAJOR       | 0      | — |
| MINOR       | 2      | Optional, kosmetisch |

**Empfehlung:** C1 in der nächsten Charge mit beheben.
