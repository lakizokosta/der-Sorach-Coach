# A2-Audit 2026 — Zusammenfassung

Auditiert am: 2026-06-17  
Modell: Claude Opus 4.7  
Umfang: 23 Themen, ~3 161 `.md`-Dateien  
**Korrekturphase abgeschlossen am 2026-06-17 (alle CRITICAL + MAJOR + MINOR umgesetzt; `npm run questions:verify` grün).**

## Befund-Statistik

| Kategorie | Anzahl |
|-----------|--------|
| **CRITICAL** (echte Grammatik-/Semantikfehler) | **17** |
| **MAJOR** (didaktische Mängel) | **9** |
| **MINOR** (Stil/Vorschläge) | **8** |

## Struktur-Anomalien (vor Themen-Audit)

1. ~~**`SPRACHBAUSTEINEB1/` im A2-Verzeichnis** — leerer Ordner, gehört nicht zu A2.~~ **ERLEDIGT (2026-06-17): leerer Ordner entfernt. Die echte `SPRACHBAUSTEINEB1`-Sammlung mit 48 Dateien existiert weiterhin unter `src/questions/B1/SPRACHBAUSTEINEB1/` und wird im B1-Audit geprüft.**
2. **`SATZSTELLUNGA2/`** — enthält nur 2 Freidateien, kein Generator. ID-Mismatch in `a2-sort-2.md` (`id: a2-satz-sort-2`, Dateiname `a2-sort-2.md`).
3. **`PERFEKTA2/a2-sort-2.md`** — fremde Sort-Datei im falschen Topic-Ordner (vermutlich Kopierfehler).
4. **`POSSESSIVARTIKELA2/a2-poss-gen-dd-001..003.md`** — drei freie Dropbox-Dateien mit **unvollständigen Sätzen** ("Das ist meines Vaters" ist grammatisch unvollständig). **CRITICAL**.
5. **`MODALVERBENA2/a2-modal-multi-1.md`** — Typ `multi-select`. Falls die App diesen Typ nicht unterstützt, ist die Frage tot.

## CRITICAL-Liste (sofortige Korrektur)

### Generatoren / Datenbanken

| # | Topic | Datei/Quelle | Problem |
|---|-------|--------------|---------|
| C1 | PERFEKTA2 | `a2-input-text-data.mjs:50`, `a2-perf-in-001.md`, `a2-perf-dd-001.md` | `kennenlernen` mit **`sein`** statt `haben` ("Ich BIN gestern viele Leute kennengelernt") |
| C2 | MODALVERBENA2 | `a2-input-text-data.mjs:106`, `a2-modal-in-017.md`, `a2-modal-dd-017.md` | "Ich hätte gern ein bisschen Ruhe haben" — überflüssiges `haben`; Hint `möchten/ich` passt nicht zu `hätte` |
| C3 | WECHSELPRÄPOSITIONENA2 | `a2-dropbox-data.mjs:175`, `a2-wech-dd-006.md` | "Stellen Sie die Leiter an Wand" — fehlender Artikel `die` (an **die** Wand) |
| C4 | WECHSELPRÄPOSITIONENA2 | `a2-dropbox-data.mjs:183`, `a2-wech-dd-014.md` | "nach Haus" statt "nach **Hause**" (Standardform) |
| C5 | KONJUNKTIONENA2 | `a2-dropbox-data.mjs:35`, `a2-konj-dd-006.md` | "Weil müde war ging ich…" — fehlendes Subjekt `ich` |
| C6 | KONJUNKTIONENA2 | `a2-dropbox-data.mjs:45`, `a2-konj-dd-016.md` | Hint `Konjunktion — Wenn`, aber Wörter enthalten **kein** `wenn`/keine Konjunktion |
| C7 | AKKUSATIVA2 | `a2-dropbox-data.mjs:211`, `a2-akk-dd-002.md` | "Er denkt gern an Urlaub Mosel" — fehlt `den` (an **den** Urlaub) **und** `an der` Mosel |
| C8 | TEMPORALSATZ | `a2-dropbox-data.mjs:370`, `a2-temp-dd-001.md` | "Als Kind wohnte ich auf Land" — fehlt `dem` (auf **dem** Land) |
| C9 | TEMPORALSATZ | `a2-dropbox-data.mjs:376`, `a2-temp-dd-007.md` | "In Berlin lernte ich viel Deutsch" — **kein Temporalsatz**, Hint trifft nicht zu |
| C10 | TEMPORALSATZ | `a2-dropbox-data.mjs:385–386`, `a2-temp-dd-016/017.md` | "Nach Reisebuchung…", "Nach Aufwachen…" — beide ohne Artikel (`der`/`dem`), nominalisierte Form unidiomatisch |
| C11 | TRENNBAREVERBEN | `a2-input-text-data.mjs:395`, `a2-select-one-data.mjs:517`, `a2-trenn-012.md`, `a2-trenn-in-012.md` | "Wir fahren nach Hause ein" — `einfahren` semantisch falsch (= "in Bahnhof einlaufen"), passt nicht zu "nach Hause" |
| C12 | N-DEKLINATION | `a2-input-text-data.mjs:451`, `a2-select-one-data.mjs:596`, `a2-n-007.md`, `a2-n-in-007.md` | `Italiener` ist **kein** N-Deklinationswort (Akk = `Italiener`, identisch mit Nom) — gehört nicht in dieses Topic |
| C13 | FESTEPRÄPOSITIONENA2 | `a2-input-text-data.mjs:234, 238` | Hint `feste Präposition`, aber Korrektantwort ist **Adjektiv** (`klassische`, `gutes`) — Topic-Mismatch |
| C14 | POSSESSIVARTIKELA2 | `a2-poss-gen-dd-001..003.md` | "Das ist meines Vaters" — **unvollständiger Satz** (Genitiv kann nicht alleinstehendes Prädikat sein). Alle drei Dateien betroffen |
| C15 | REFLEXIVPRONOMEN | `a2-select-one-data.mjs:157`, `a2-refl-002.md` | Pool enthält `interessiert` zweimal (sichtbar als Pool-Duplikat — wird zwar dedupliziert, deutet aber auf Eingabefehler hin) |
| C16 | ANTWORTPARTIKELN | `a2-input-text-data.mjs:21` (analog) und `a2-select-one-data.mjs:27` | "Trinkst du Milch? — Nein, ich trinke **keinen**." — `Milch` ist feminin, Korrektform `keine` |
| C17 | PERFEKTA2 | `a2-sort-2.md` in `PERFEKTA2/` | Fremde Datei: Sort-Übung im Perfekt-Ordner; falsche Zuordnung |

### MAJOR-Liste (didaktisch)

| # | Topic | Quelle | Problem |
|---|-------|--------|---------|
| M1 | MODALVERBENA2 | `:105` / `a2-modal-in-016.md` | `könntest` (Konjunktiv II) mit Hint `Modalverb — können/du` — Modus nicht erklärt |
| M2 | REFLEXIVPRONOMEN | `a2-select-one-data.mjs:160` | Pool enthält identischen String mehrfach (Eintrag-Fehler) |
| M3 | FESTEPRÄPOSITIONENA2 | input-text + select-one | Vermischung dreier Phänomene: feste Präposition, Artikel, Adjektivendung — Lernziel unscharf |
| M4 | ADJEKTIVDEKLINATIONA2 | `a2-input-text-data.mjs:250–300` | Alle 50 Hints lauten nur `(Adjektivendung)`, ohne Genus/Kasus/Numerus. Sehr schwach |
| M5 | ADJEKTIVDEKLINATIONA2 | `:288` / `a2-adj-in-039.md` | `fünften` ist eine Ordinalzahl — wird wie ein Adjektiv behandelt, ohne Erklärung |
| M6 | N-DEKLINATION | `a2-select-one-data.mjs:603` | Distraktor `Kundin` (feminin) im Pool für `Kunden` — verfälscht das Lernziel |
| M7 | SATZSTELLUNGA2 | Verzeichnis | Nur 2 freie Items, kein Generator, ID-Mismatch — Topic praktisch ungenutzt |
| M8 | SPRACHBAUSTEINEB1 | leeres Verzeichnis unter A2 | Strukturartefakt, gehört nicht zu A2 |
| M9 | PERFEKTA2 dropbox `_dd-001` | `a2-dropbox-data.mjs:50` | Erbt C1: "Ich bin gestern viele Leute kennengelernt" — auch in der Dropbox-Bank falsch |

### MINOR-Liste (Stil)

| # | Topic | Bemerkung |
|---|-------|-----------|
| m1 | SUPERLATIVA2 `:165` | "Am schönsten finde ich den ___ ." (Akk., kein Substantiv) — wirkt unfertig |
| m2 | WECHSELPRÄPOSITIONENA2 `:186` | Hint `(Wo? — im)` enthält die Antwort `im` |
| m3 | INDEFINITPRONOMEN `:359` | `nichts` mit Hint `Sache` — `nichts` ist primär Verneinung |
| m4 | NOMENPRÄPOSITIONVERBINDUNGA2 `:377` | "Er hat Recht in der Sache" — unidiomatisch; üblich: "in dieser Sache Recht haben" |
| m5 | TEMPORALSATZ `:419` | "Nachdem wir gebucht haben, sind wir glücklich" — auf A2 wird typischerweise Plusquamperfekt verlangt |
| m6 | LOKALPRÄPOSITIONENA2 `:441`, select-one `:576` | "auf der rechten Seite" als Korrektantwort — sehr lang; weicht vom Lückentyp ab |
| m7 | ANTWORTPARTIKELN dropbox `:14` | `Zuhause` (Subst.) vs `zu Hause` (Adverb) — hier wäre `zu Hause` standardsprachlich besser |
| m8 | WECHSELPRÄPOSITIONENA2 select-one `:265` | "Nach Haus" statt "nach Hause" (siehe C4) |

## Empfehlung zum Vorgehen

1. **Phase 1 (CRITICAL)** — Quellen in `scripts/a2-*-data.mjs` korrigieren und betroffene `.md`-Dateien regenerieren (`--force`/`--restore`-Flags wie bei A1).
2. **Phase 2 (MAJOR)** — Hint-System verfeinern (Genus/Kasus zu `(Adjektivendung)`), Pool-Duplikate säubern, FESTEPRÄP-Items vereinheitlichen.
3. **Phase 3 (Struktur)** — Entscheidung über `SPRACHBAUSTEINEB1/`, `SATZSTELLUNGA2/`, `a2-sort-2.md` in `PERFEKTA2`.
4. **Phase 4 (MINOR)** — kosmetische Verbesserungen.

Bitte freigeben, dann beginne ich mit Phase 1.
