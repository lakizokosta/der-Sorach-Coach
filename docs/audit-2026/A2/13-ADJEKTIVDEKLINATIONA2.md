# A2 · 13 — ADJEKTIVDEKLINATIONA2 (Audit 2026)

**Geprüfte Dateien:** 150 (50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genAdjDekl()` (Zeilen 362–390)
- `scripts/a2-input-text-data.mjs` → `BANK.ADJEKTIVDEKLINATIONA2` (Zeilen 249–301)
- `scripts/a2-dropbox-data.mjs` → `BANK.ADJEKTIVDEKLINATIONA2` (Zeilen 249–267)

---

## CRITICAL

Keine — alle Endungen sind grammatisch korrekt.

---

## MAJOR

### M1 · Generischer Hint `(Adjektivendung)` für 90 % der Items

**Datei:** alle input-text-Items 1–50, mit Ausnahme von Z.254 (`groß, fem., Akk.`), Z.269 (`groß, mask., Dat.`), Z.288 (`Adjektivendung`), Z.297 (`groß, fem., Akk.`) — also nur 3 Items haben konkreten Hint.
**Quelle:** `scripts/a2-input-text-data.mjs:249–300`

**Beispiel:**
```
Das ist ein ___ Hund. (Adjektivendung)   → kleiner
```

**Problem:** Adjektivdeklination ist die **schwierigste** A2-Grammatik. Ohne Angabe von Genus/Kasus/Numerus läuft die Übung auf reines Auswendiglernen der Schablonensätze hinaus. Ein Lerner, der den Satz noch nie gesehen hat, hat nur eine Trefferchance per Zufall.

**Vergleich:** Dropbox-Hints (Z.250–267) sind vorbildlich: `'klein, mask., Nom. — kleiner'`, `'schön, fem., Akk. — schöne'`, `'neu, neutr., Nom. — neue'`. Dieses Format auf input-text übertragen.

**Fix:** Bank-Items als `[prompt, answer, hint]`-Tupel umstrukturieren oder im Prompt explizit ergänzen. Beispiel:
```
Das ist ein ___ Hund. (klein, mask., Nom.)   → kleiner
```

### M2 · Item 39: Ordinalzahl statt Adjektiv

**Datei:** `a2-adj-in-039.md` (zyklisch)
**Quelle:** `scripts/a2-input-text-data.mjs:288`

**Item:** `In der ___ Klasse sind 25 Schüler. (Adjektivendung)` → `fünften`

**Problem:** `fünfter` ist eine Ordinalzahl, kein klassisches Adjektiv. Sie folgt zwar denselben Deklinationsregeln, aber das Topic heißt explizit „Adjektivdeklination". Auf A2 verwirrt das.

**Fix:** Ersetzen durch ein echtes Adjektiv, z. B. `In der ___ Klasse sind 25 Schüler. (klein, fem., Dat.)` → `kleinen`.

---

## MINOR

### m1 · Hint-Inkonsistenz innerhalb der Bank

**Quelle:** input-text Z.254 (`(groß, fem., Akk.)`) vs. Z.252 (`(Adjektivendung)`).

**Bewertung:** Drei Items haben konkrete Hints (5, 20, 48), 47 Items haben generischen Hint. Wenn Hinweise wenigstens einheitlich wären (alle generisch oder alle konkret), wäre die Erwartung klar. Aktuell entstehen falsche Erwartungen.

### m2 · Adjektivdeklination mit `mein/dein` (mixed declination) gut abgedeckt

**Bewertung:** Items 14 (`Mein neuer Job`), 17 (`Meine junge Schwester`), 33 (`mein neues Buch`) decken mixed declension korrekt ab.

### m3 · Items mit `etwas`/`viel`/`viele` fehlen

**Bewertung:** Auf A2 wird `etwas Schönes`/`viele schöne Tage` thematisiert (Substantivierung von Adjektiven). Topic könnte erweitert werden, ist aber kein Fehler.

---

## Geprüft & in Ordnung

- Alle 50 Endungen korrekt nach „der/die/das"-, „ein/mein/dein"-, oder Nullartikel-Schema.
- Schwierige Fälle korrekt:
  - **Nullartikel (Z.258, Z.290, Z.300):** `Bei schlechtem Wetter`, `Bei starkem Wind`, `Mit neuem Auto` — strong endings.
  - **Mixed declination (Z.263, Z.282):** `Mein neuer Job`, `Mein neues Buch` — korrekte Strong-Endungen nach `mein`.
  - **Plural mit `meine`:** keine im aktuellen Set (Erweiterung möglich).
- Dropbox-Items 1–17: Sätze grammatisch korrekt, Hints geben Genus/Kasus.
- Select-One Pool-Distraktoren decken alle möglichen Endungs­fehler ab (`-en, -e, -er, -es, -em`).

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 0      | — |
| MAJOR       | 2      | Hint-Erweiterung für 47 Items + 1 Item ersetzen |
| MINOR       | 3      | Optional |

**Empfehlung:** M1 ist der wichtigste Fix für dieses Topic — ohne Genus/Kasus im Hint ist die Aufgabe für A2 zu schwer.
