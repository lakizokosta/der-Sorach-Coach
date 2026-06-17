# A2 · 19 — TEMPORALSATZ (Audit 2026)

**Geprüfte Dateien:** 150 (50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genTemporal()` (Zeilen 532–558)
- `scripts/a2-input-text-data.mjs` → `BANK.TEMPORALSATZ` (Zeilen 403–421)
- `scripts/a2-dropbox-data.mjs` → `BANK.TEMPORALSATZ` (Zeilen 369–387)

---

## CRITICAL

### C1 · Dropbox: fehlender Artikel `dem` vor `Land`

**Datei:** `a2-temp-dd-001.md` (zyklisch `-017`, `-033`, `-049`)
**Quelle:** `scripts/a2-dropbox-data.mjs:370`

**Wortliste:** `[Als, Kind, wohnte, ich, auf, Land]`
**Korrektsatz wäre:** `Als Kind wohnte ich auf dem Land.`

**Problem:** Im Idiom „auf dem Land(e) leben/wohnen" ist der Artikel obligatorisch. Aus den vorhandenen Wörtern lässt sich kein grammatischer Satz bauen.

**Fix:** `dem` ergänzen → `[Als, Kind, wohnte, ich, auf, dem, Land]`.

### C2 · Dropbox: kein Temporalsatz, obwohl Hint dies behauptet

**Datei:** `a2-temp-dd-007.md` (zyklisch)
**Quelle:** `scripts/a2-dropbox-data.mjs:376`

**Wortliste:** `[In, Berlin, lernte, ich, viel, Deutsch]`
**Hint:** `Temporalsatz`

**Problem:** Aus diesen Wörtern entsteht der Satz `In Berlin lernte ich viel Deutsch.` — eine einfache lokale Angabe, **kein** Temporalsatz. Im input-text steht dieses Item korrekt als `Als ich in Berlin lebte, lernte ich viel.` (Z.410). Die Dropbox-Variante wurde fehlerhaft vereinfacht.

**Fix:** Wortliste zu `[Als, ich, in, Berlin, lebte, lernte, viel]` ändern (Subjekt-Doppel `ich` muss vermieden werden — alternativ Hauptsatzform anpassen: `[Als, ich, in, Berlin, lebte, lernte, ich, viel, Deutsch]` — verstößt gegen `assertUnique`).

Pragmatische Lösung: `[Als, wir, in, Berlin, lebten, lernte, ich, viel]` — hier sind alle Wörter unique.

### C3 · Dropbox: zwei Nominalisierungen ohne Artikel

**Dateien:** `a2-temp-dd-016.md`, `a2-temp-dd-017.md`
**Quelle:** `scripts/a2-dropbox-data.mjs:385–386`

**Wortlisten:**
```
016: [Nach, Reisebuchung, sind, wir, glücklich]
017: [Nach, Aufwachen, trinke, ich, Kaffee]
```

**Probleme:**
1. `Nach + Substantiv` braucht den Artikel: `Nach **der** Reisebuchung`, `Nach **dem** Aufwachen`.
2. Beide Nominalisierungen sind stilistisch sperrig — A2-Lerner formulieren das eher als `Nachdem`-Satz (so wie in input-text Z.419: `Nachdem wir die Reise gebucht haben, sind wir glücklich.`).

**Fix:**
- 016: `[Nachdem, wir, gebucht, haben, sind, wir, glücklich]` (zwei `wir` — Refaktor: `[Nachdem, sie, gebucht, haben, sind, wir, glücklich]`)
- 017: `[Wenn, ich, aufwache, trinke, ich, Kaffee]` (zwei `ich` — Refaktor mit anderem Subjekt im NS).

---

## MAJOR

Keine.

---

## MINOR

### m1 · Item 16 input-text: `nachdem` ohne Plusquamperfekt

**Quelle:** `scripts/a2-input-text-data.mjs:419`

**Item:** `Nachdem wir die Reise gebucht haben, sind wir glücklich.` (Hint `Temporal — nachdem`) → `Nachdem`

**Bewertung:** Standardsprachlich verlangt `nachdem` Vorzeitigkeit (im Nebensatz Plusquamperfekt, im Hauptsatz Präteritum/Perfekt). Korrekter wäre `Nachdem wir die Reise gebucht hatten, waren wir glücklich.` Auf A2 wird Plusquamperfekt jedoch oft noch nicht geübt — Toleranz vertretbar.

### m2 · Items 11/13 input-text mit `Während des/der …`

**Quelle:** `:409, :415, :418`

**Bewertung:** `während` als Genitivpräposition ist auf A2 schon GENITIVA2-Stoff. Hier wird es zusätzlich als Konjunktion (`Während er kocht`) und als Präposition (`Während des Essens`) gezeigt — gut, dass beide Funktionen abgedeckt sind. Hint nennt die Funktion (`gleichzeitig`) — sehr informativ.

---

## Geprüft & in Ordnung

- Drei zentrale Konjunktionen sauber unterschieden: `Als` (einmalig in der Vergangenheit), `Wenn` (wiederholt/Bedingung), `Während` (gleichzeitig).
- `Als`-Items konsistent in Präteritum (Erzählvergangenheit) — korrekte Tempusverwendung.
- `Wenn`-Items im Präsens — korrekt für gegenwärtige Bedingungen.
- `Während` als Konjunktion (Z.406) und als Genitivpräposition (Z.409) klar getrennt durch Hint und Folgewort.
- Select-One Items 1–15 ohne Fehler.
- Input-Text Items 1–15 grammatisch korrekt.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 3      | 4 Dropbox-Wortlisten reparieren |
| MAJOR       | 0      | — |
| MINOR       | 2      | Optional |
