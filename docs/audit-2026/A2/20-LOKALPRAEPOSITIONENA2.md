# A2 · 20 — LOKALPRÄPOSITIONENA2 (Audit 2026)

**Geprüfte Dateien:** 150 (50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genLokal()` (Zeilen 560–586)
- `scripts/a2-input-text-data.mjs` → `BANK.LOKALPRÄPOSITIONENA2` (Zeilen 423–442)
- `scripts/a2-dropbox-data.mjs` → `BANK.LOKALPRÄPOSITIONENA2` (Zeilen 389–407)

---

## CRITICAL

Keine.

---

## MAJOR

Keine.

---

## MINOR

### m1 · Item 18 input-text: Phrase als Korrektantwort

**Datei:** `a2-lokal-in-018.md` (zyklisch)
**Quelle:** `scripts/a2-input-text-data.mjs:441` (input-text), `scripts/a2-select-one-data.mjs:576` (select-one)

**Item:** `Vom Eingang der Mall aus: Die Apotheke ist ___ . (Lokalpräposition)` → `auf der rechten Seite`

**Bewertung:** Die Korrektantwort ist eine 4-Wort-Phrase, kein Wort/keine Präposition. Das passt nicht zum Format „Lückenwort = 1–2 Wörter". Im input-text muss der Lerner exakt diese vier Wörter mit Bindestrich tippen — fehleranfällig.

**Fix:** Antwort kürzen auf `rechts` oder `links`; Hint zu `Lokalangabe`.

### m2 · Item 17 dropbox: `gegenüber` als Postposition

**Datei:** `a2-lokal-dd-017.md`
**Quelle:** `scripts/a2-dropbox-data.mjs:405`

**Wortliste:** `[Das, Hotel, liegt, direkt, gegenüber, dem, Bahnhof]`

**Bewertung:** `gegenüber` kann sowohl vor als auch nach dem Substantiv stehen (`gegenüber dem Bahnhof` ODER `dem Bahnhof gegenüber`). Aus der Wortliste lassen sich beide Varianten konstruieren. Wenn die Validation nur eine Reihenfolge akzeptiert, kann das frustrieren.

### m3 · Item 15 input-text mit ungewöhnlichem Satz

**Quelle:** `scripts/a2-input-text-data.mjs:438`

**Item:** `Gehen Sie dann ___ den Stadtpark. (Lokalpräposition + Akk.)` → `durch`

**Bewertung:** „Gehen Sie dann durch den Stadtpark" ist im Kontext einer Wegbeschreibung ok. Würde mit vorangehendem Satz (`Sie kommen aus dem Hotel.`) Sinn ergeben. Standalone wirkt es abgehackt.

---

## Geprüft & in Ordnung

- Alle Lokalpräpositionen sauber abgedeckt: `an, auf, in, gegenüber, neben, hinter, vor, zwischen, durch, über, unter, aus`.
- Wechselpräpositionen (`an, auf, in, hinter, vor, zwischen, neben, über, unter`) korrekt mit Dativ (Wo?) — Topic ist klar von WECHSELPRÄPOSITIONENA2 abgegrenzt (dort: Wo/Wohin-Wechsel; hier: pure Lokalisierung).
- Items mit Akkusativ (`über die Brücke`, `durch den Tunnel`) klar markiert mit Hint `+ Akk.`.
- Pool-Distraktoren sind ebenfalls Lokalpräpositionen — sehr realistische Verwechslungsgefahr.
- Sehr gute kontextuelle Hints („Auf derselben Straße, Schaufenster gegen Schaufenster" für `gegenüber`; „Vom Bahnhofsplatz aus sieht man das Hotel nicht — es liegt …" für `hinter`).

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 0      | — |
| MAJOR       | 0      | — |
| MINOR       | 3      | Optional |

**Empfehlung:** Topic ist sauber. Optional Item 18 vereinfachen.
