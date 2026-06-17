# A1 — Zusammenfassung Audit 2026

**Gesamtumfang:** 1 654 geprüfte `.md`-Dateien in 11 produktiven Themengruppen + 1 leerer Themenordner.

## Kritische Befunde (CRITICAL) im Überblick

| Datei | Tema | Problem |
|-------|------|---------|
| `a1-poss-in-026.md` | POSSESSIVARTIKEL | „Team" als `mask.` markiert (ist `neutr.`) |
| `a1-konj-dd-046.md` | VERBKONJUGATION | „streiche" statt „streichle" — falsches Verb |
| `a1-adj-4.md` | ADJEKTIVDEKLINATIONA1 | „Das ___ Auto" → `neues` (richtig: `neue`) |
| `a1-wech-dd-011.md` | WECHSELPRÄPOSITIONEN | „Bei Regen gehe ins Haus" — Subjekt fehlt |
| **26 Dateien** in DATIVA1 (`a1-dat-in-007, -010, -016 … -049`, `a1-dat-012, -027, -042, -4`) | DATIVA1 | **Massensystemfehler:** Substantiv steht im Prompt UND in `correct` → Verdopplung bei Einsetzen |

**Insgesamt 30 kritisch fehlerhafte Dateien** im A1.

---

## Übersicht pro Tema

| # | Tema | Dateien | CRITICAL | MAJOR | MINOR | Hauptproblem |
|---|------|---------|----------|-------|-------|--------------|
| 01 | POSSESSIVARTIKEL | 150 | 1 | 3 | 3 | Pool mischt Personen, ein falscher Genus-Hint |
| 02 | PLURAL | 151 | 0 | 1 | 3 | Nur kosmetisch (Anführungszeichen) |
| 03 | VERBKONJUGATION | 151 | 1 | 3 | 3 | `streiche` ↔ `streichle`-Verwechslung, Hint-Inkonsistenz |
| 04 | ADJEKTIVDEKLINATIONA1 | 150 | 1 | 3 | 2 | Falsche Endung in Free-Item, Pool-Schwäche |
| 05 | WECHSELPRÄPOSITIONEN | 150 | 1 | 1 | 2 | Subjektloser Satz in Dropbox |
| 06 | DATIVA1 | 154 | 1 (26 Items) | 3 | 2 | **Massensystemfehler Substantivverdopplung** |
| 07 | AKKUSATIVA1 | 148 | 0 | 1 | 3 | Hint-Wortwahl nicht zu Words passend |
| 08 | ARTIKEL | 150 | 0 | 2 | 3 | Pool-Großschreibung & `ein/kein`-Mehrdeutigkeit |
| 09 | W-FRAGEN | 150 | 0 | 1 | 3 | Eine ambige Frage („Wie warm" vs „Wie kalt") |
| 10 | NEGATION | 149 | 0 | 0 | 4 | Sauber, nur didaktische Anmerkungen |
| 11 | GEGENTEILE | 150 | 0 | 2 | 4 | Lexikalische Schwächen (sanft/hart) |

**Leere Themenordner:** `src/questions/A1/SATZSTELLUNGA2/` — enthält **0 Dateien**. Vermutlich Artefakt einer früheren Umstrukturierung. **Empfehlung: Ordner löschen.**

---

## Priorisierte Fix-Reihenfolge

### Stufe 1 — CRITICAL (sofort, max. 1 Stunde)

1. **DATIVA1** — 26 Bank-Einträge fixen (Lücke nur für Artikel oder Substantiv aus Prompt entfernen); Regen aller betroffenen Files.
2. **ADJEKTIVDEKLINATIONA1** `a1-adj-4.md` — `neues` → `neue`.
3. **VERBKONJUGATION** `a1-dropbox-data.mjs` Z.156 — `streiche` → `streichle`.
4. **WECHSELPRÄPOSITIONEN** `a1-dropbox-data-2.mjs` Z.68 — Subjekt `ich` einfügen.
5. **POSSESSIVARTIKEL** `generate-a1-input-text.mjs` Z.99 — `mask.` → `neutr.`.

### Stufe 2 — MAJOR (≈ 2-3 Stunden)

Pool-Refactor in `genPossessiv`, `genAdjektiv`, `genArtikel`; Hint-Vereinheitlichung in `BANK.VERBKONJUGATION`; Mehrfachantworten in `BANK['W-FRAGEN']` Z.532 und `BANK.GEGENTEILE` Z.609.

### Stufe 3 — MINOR (optional, low priority)

Anführungszeichen-Vereinheitlichung; Free-Item-Erweiterung; Hint-Notationssäuberung.

---

## Methodische Beobachtungen

1. **Bank-Konsistenz:** Die parallel gepflegten Bänke für select-one / input-text / dropbox **divergieren bei identischen Items** (siehe DATIVA1 Item „Mutter eine Karte" — Bank und Select-One haben unterschiedliche Prompt-Konstruktionen). **Empfehlung:** Items aus einem zentralen Schema generieren statt parallel zu pflegen.
2. **Hints spoilern oft die Antwort:** Persönlich-Genus-Kasus-Angabe macht die Übung zur Tabellen-Abfrage. Für A1 vertretbar, sollte aber bei A2/B1 reduziert werden.
3. **Distraktoren-Pools mischen Lexem-Familien:** In POSSESSIV und ARTIKEL eliminieren Lernende Falschantworten trivial nach Person/Großschreibung. Echte Kasus/Genus-Übung fehlt.

---

**Status:** Alle 11 Themengruppen geprüft. Detailberichte liegen in `docs/audit-2026/A1/01-…-11-….md`.

**Nächster Schritt:** Auf Nutzerfreigabe warten, dann **Stufe 1** der Fixes umsetzen. Anschließend Audit A2 starten.
