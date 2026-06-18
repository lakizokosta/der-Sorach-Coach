# QA-Runde 4 — Kontroll-Audit A1–B2

**Datum:** 2026-06-18  
**Scope:** alle 10 434 Fragen in `src/questions/` (A1 → B2)  
**Methode:** automatische Audit-Skripte + Runtime-Simulation (`FillBlank.vue`-Logik) + Stichproben  
**Status:** nur Analyse — **keine Dateien geändert, kein Commit**

---

## Kurzfazit

| Kategorie | Ergebnis |
| --- | --- |
| **Struktur / Parser** | ✅ 0 Fehler (`npm run questions:verify`) |
| **Grammatik / Doppelartikel / correct∈options** | ✅ 0 Fehler (`npm run questions:audit`) |
| **Informative Hints (input-text)** | ✅ 0 / 3 356 (`audit-input-text-informative.mjs`) |
| **Genitiv / Possessiv / Dropbox / Sprachbausteine** | ✅ 0 Fehler |
| **Runtime Acceptance** | ⚠️ **MAJOR** — Synonym-Hints vs. einzelner `correct`-Wert |
| **Didaktik / Hint-Qualität** | ⚠️ **MAJOR + MINOR** — siehe unten |

**CRITICAL in der aktuellen Repo-Version:** 0  
**Der vom Nutzer gemeldete ADJEKTIVDEKLINATIONA2-Bug ist im Repo behoben** (siehe Abschnitt 7).

---

## 1. Umfang

| Level | Dateien | Themen | select-one | dropbox | input-text | text-gaps | multi-select |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **A1** | 1 654 | 11 | 549 | 550 | 554 | — | 1 |
| **A2** | 3 160 | 22 | 1 052 | 1 055 | 1 052 | — | 1 |
| **B1** | 3 980 | 27 | 1 370 | 1 300 | 1 300 | 10 | — |
| **B2** | 1 640 | 23 | 1 100 | 50 | 450 | 40 | — |
| **Σ** | **10 434** | **83** | 4 071 | 2 955 | 3 356 | 50 | 2 |

---

## 2. Checkliste — Ergebnisse

### A. Grammatik & Syntax ✅

Ausgeführt: `npm run questions:audit` (10 434 Dateien)

- Doppelartikel (`im dem`, `zum dem`, …): **0**
- Falsche Adjektiv-Lücken (Artikel statt Endung): **0**
- Bekannte Präposition-Fehler (`überweisen`, `zur Verfügung`): **0**
- Parse-Fehler: **0**

Zusätzlich: `npm run questions:audit-genitiv` (450), `audit-possessiv` (150), `audit-dropbox`, `audit-sprach` (80) — alles **0 Probleme**.

### B. Logik der Aufgabe ⚠️ MAJOR

**Problem:** In mehreren Konjunktionsthemen listet der Hint mehrere Alternativen (`weil/da/denn`, `obwohl/obschon/trotzdem`, `um/damit`), obwohl pro Satz nur **eine** grammatisch passende Form in die Lücke passt.

| Thema | Betroffene input-text | Problem |
| --- | ---: | --- |
| KAUSALSATZ | 50 | Hint nennt `weil/da/denn`, Satz verlangt oft nur Nebensatz (`weil`/`da`) oder Hauptsatz (`denn`) |
| KONZESSIVSATZB1 | 50 | Hint nennt `obwohl/obschon/trotzdem`, Satz braucht oft nur `trotzdem` (Hauptsatz-Adverb) |
| KONDITIONALSATZ | 50 | Hint nennt `wenn/falls`, jeweils nur eine Antwort korrekt |
| FINALSATZ | 50 | Hint nennt `um/damit`, unterschiedliche Satzstruktur |
| KONJUNKTIONALADVERBIEN | 50 | Closed-set über alle Items — absichtlich, aber irreführend |
| VERNEINUNG | 50 | Mehrere Negationspartikeln im Hint, ein `correct` pro Item |

**Beispiel — irreführender Hint (Logik):**

| id | Satz | Hint | correct |
| --- | --- | --- | --- |
| `b1-konz-in-010` | Es regnet, ___ fahren wir in den Urlaub. | Konzessivsatz — obwohl/obschon/trotzdem | `trotzdem` |
| `b1-kaus-in-004` | Ich bin müde, ___ ich habe wenig geschlafen. | Kausalsatz — weil/da/denn | `denn` |
| `b1-fin-in-001` | Er lernt Deutsch, ___ in Berlin arbeiten zu können. | Finalsatz — um/damit | `um` |

→ Nutzer wählt eine **thematisch verwandte**, aber **syntaktisch falsche** Form und wird verwirrt.

### C. Korrektheit von `correct` ✅

- `select-one`: `correct` immer in `options` — **0 Verstöße**
- `input-text`: kein leerer `correct`, kein fehlendes `___` — **0 Verstöße**
- `text-gaps` (50): `correct` in Options je Lücke — **0 Verstöße**
- `multi-select` (2): **0 Verstöße**

### D. Struktur ✅

`npm run questions:verify` — alle 10 434 Dateien parsen fehlerfrei durch `parseQuestionFile()` (derselbe Parser wie die SPA).

### E. Informative Hints ✅

`node scripts/audit-input-text-informative.mjs` → **0 / 3 356** uninformative input-text-Fragen.

Der frühere Bug `(Adjektivendung)` ohne Lemma ist behoben, z. B.:

```
a2-adj-in-016 → (Adjektivdeklination — schwer, neutr., Nom.)
```

### F. Runtime Acceptance ⚠️ MAJOR

Simuliert nach `FillBlank.vue`: exakter Abgleich `userInput.trim().toLowerCase()` gegen `correct[]`.

| Prüfung | Ergebnis |
| --- | --- |
| `correct[0]` wird akzeptiert | ✅ 3 356 / 3 356 |
| Groß/Kleinschreibung | ✅ egal (toLowerCase) |
| Mehrere `correct`-Einträge | ⚠️ **0 Dateien** — kein input-text hat Synonym-Alternativen |
| Synonym-Hint vs. ein `correct` | ⚠️ **~306 Items** in Konjunktionsthemen |

**CRITICAL-ähnliches Runtime-Problem (weil↔da austauschbar):**

Bei Nebensatz-Kausalsätzen sind `weil` und `da` oft **beide grammatisch korrekt**, aber nur einer steht in `correct`:

| id | correct | Nutzer tippt | Runtime |
| --- | --- | --- | --- |
| `b1-kaus-in-005` | `Da` | `weil` | ❌ abgelehnt (grammatisch OK) |
| `b1-kaus-in-012` | `Da` | `weil` | ❌ abgelehnt |
| `b1-kaus-in-002` | `Weil` | `da` | ❌ abgelehnt |

→ **14 KAUSALSATZ-Items** mit nachweislich austauschbarem `weil`/`da`.

**Nutzer-Bug aus Screenshot (schweres abgelehnt):**

Im Repo ist `a2-adj-in-016` korrekt (`correct: schweres`). Runtime-Simulation: `schweres` → ✅ akzeptiert.  
Wenn der Screenshot **nach** dem Fix entstanden ist → prüfen, ob **Production/Deploy** den Stand `50ef8ef5` (QA-R3-final) enthält.

---

## 3. CRITICAL — 0

Keine blockierenden Fehler in Struktur, Grammatik, Parser oder uninformative input-text-Hints.

---

## 4. MAJOR — 2 Kategorien

### MAJOR-1: Synonym-Hint listet Optionen, Runtime akzeptiert nur eine (~306 Items)

Betroffene Topics (input-text):

| Topic | Anzahl |
| --- | ---: |
| KAUSALSATZ | 50 |
| KONZESSIVSATZB1 | 50 |
| KONDITIONALSATZ | 50 |
| FINALSATZ | 50 |
| KONJUNKTIONALADVERBIEN | 50 |
| VERNEINUNG | 50 |
| TEMPORALSATZ | 3 |
| MODALVERBENA2 | 3 |

**Beispiele:**

```
b1-kaus-in-005  correct="Da"       hint="… weil/da/denn"     → "weil" wird abgelehnt
b1-konz-in-010  correct="trotzdem" hint="… obwohl/obschon/trotzdem"
b1-kond-in-001  correct="Wenn"     hint="… wenn/falls"
b1-fin-in-001   correct="um"       hint="… um/damit"
```

**Empfehlung:** Entweder (a) alle grammatisch gültigen Synonyme in `correct:` aufnehmen, oder (b) Hint auf **satztaugliche** Optionen beschränken (nicht alle Topic-Synonyme).

### MAJOR-2: Closed-set Hints bei Vokabel-Topics (~550 Items)

Topics wie `WORTSCHATZB1`, `FESTEPRÄPOSITIONENA2`, `PRÄPOSITIONENB1` listen **alle Bank-Kandidaten** im Hint. Das ist für Informative-Hints-Audit **OK** (irgendein Kandidat ist im Hint), aber didaktisch schwach: der Hint verrät nicht, **welches** Wort in **diesen** Satz passt.

**Beispiel:**

```
a2-fest-in-001  correct="eine"
hint="Feste Präposition — auf / das / dem / den / die / eine / …"
```

→ Aufgabe ist lösbar, aber Hint ist eher Wortliste als Hilfe.

---

## 5. MINOR — 9 Items

### MINOR-1: Tippfehler `sien` statt `sich` in REFLEXIVPRONOMEN-Hints

| id | Aktueller Hint |
| --- | --- |
| `a2-refl-in-004` | Reflexiv + Verb beeilen/**sien** |
| `a2-refl-in-008` | Reflexiv + Verb sehen/**sien** |
| `a2-refl-in-014` | Reflexiv + Verb vorbereiten/**sien** |
| `a2-refl-in-021` | Reflexiv + Verb beeilen/**sien** |
| `a2-refl-in-025` | Reflexiv + Verb sehen/**sien** |
| `a2-refl-in-031` | Reflexiv + Verb vorbereiten/**sien** |
| `a2-refl-in-038` | Reflexiv + Verb beeilen/**sien** |
| `a2-refl-in-042` | Reflexiv + Verb sehen/**sien** |
| `a2-refl-in-048` | Reflexiv + Verb vorbereiten/**sien** |

(`npm run questions:audit-reflexiv` meldet 9 Hint-Mismatches.)

### MINOR-2: select-one ADJEKTIVDEKLINATION mit nur `(Adjektivendung)` — 150 Items

Betrifft A1/A2/B1 select-one (nicht input-text). **Kein Bug:** die vier Optionen zeigen den Adjektivstamm (`schlechter/schlechten/…`), die Endung ist die Aufgabe.

---

## 6. Automatische Skripte — Übersicht

| Skript | Ergebnis |
| --- | --- |
| `npm run questions:verify` | ✅ 10 434 OK |
| `npm run questions:audit` | ✅ 0 Issues |
| `audit-input-text-informative.mjs` | ✅ 0 / 3 356 |
| `npm run questions:audit-genitiv` | ✅ 0 / 450 |
| `npm run questions:audit-possessiv` | ✅ 0 / 150 |
| `npm run questions:audit-reflexiv` | ⚠️ 9 Hint-Mismatches |
| `npm run questions:audit-dropbox` | ✅ OK |
| `npm run questions:audit-sprach` | ✅ 80 OK |
| Runtime-Simulation (FillBlank) | ⚠️ siehe MAJOR-1 |

---

## 7. Nutzer-Bug ADJEKTIVDEKLINATIONA2 — Status

| | Vor Fix (Screenshot) | Nach Fix (Repo) |
| --- | --- | --- |
| Hint | `(Adjektivendung)` | `(Adjektivdeklination — schwer, neutr., Nom.)` |
| Lösbar? | ❌ unendlich viele Adjektive | ✅ |
| `schweres` akzeptiert? | Nutzer-Bericht: ❌ | Runtime-Test: ✅ |

**Warum in QA-Runde 1+2 übersehen:** Audits prüften Grammatik/Struktur, nicht Hint-Informativität. Erst QA-Runde 3 mit `audit-input-text-informative.mjs` schloss diese Lücke.

---

## 8. Empfohlene Fix-Reihenfolge (nach Freigabe)

1. **MAJOR-1 CRITICAL-Subset:** 14 KAUSALSATZ-Items — `weil`/`da` beide in `correct:` oder Hint auf eine Option reduzieren  
2. **MAJOR-1 Rest:** Konjunktionsthemen (~306) — Hint vs. `correct`/`acceptedAnswers` angleichen  
3. **MINOR-1:** `sien` → `sich` in 9 REFLEXIV-Dateien (Generator/Bank)  
4. **Deploy prüfen:** Production auf Commit `50ef8ef5` oder neuer?

---

## 9. Was diese Runde **nicht** abdeckt

- Manuelle Leseprüfung aller 10 434 Sätze Wort für Wort  
- Semantische Plausibilität jedes Satzes (Realitätsbezug, Stil)  
- Vollständiger E2E-Test in der laufenden SPA (Browser)  
- Free-Timer / Streak / XP (siehe `docs/TRAINER-AUDIT.md`)

---

*Erstellt automatisch im Rahmen von QA-Runde 4. Keine Repository-Änderungen.*
