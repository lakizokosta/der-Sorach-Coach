# A2-Audit 2026 — Vollbericht

> Auditiert am 2026-06-17 mit Claude Opus 4.7  
> Methodik wie im A1-Audit: Quelldateien (`scripts/a2-*-data.mjs`, Generatoren) + Stichproben aller 23 Topic-Ordner.

---

## Inhaltsverzeichnis

1. [Architektur](#architektur)
2. [Struktur-Anomalien](#struktur-anomalien)
3. [Themenweise Befunde](#themenweise-befunde)
   1. [ANTWORTPARTIKELN](#antwortpartikeln)
   2. [KONJUNKTIONENA2](#konjunktionena2)
   3. [PERFEKTA2](#perfekta2)
   4. [PRÄTERITUMA2](#prateritum-a2)
   5. [MODALVERBENA2](#modalverbena2)
   6. [REFLEXIVPRONOMEN](#reflexivpronomen)
   7. [KOMPARATIVA2](#komparativa2)
   8. [SUPERLATIVA2](#superlativa2)
   9. [WECHSELPRÄPOSITIONENA2](#wechselprapositionena2)
   10. [DATIVA2](#dativa2)
   11. [AKKUSATIVA2](#akkusativa2)
   12. [FESTEPRÄPOSITIONENA2](#festeprapositionena2)
   13. [ADJEKTIVDEKLINATIONA2](#adjektivdeklinationa2)
   14. [POSSESSIVARTIKELA2](#possessivartikela2)
   15. [GENITIVA2](#genitiva2)
   16. [INDEFINITPRONOMEN](#indefinitpronomen)
   17. [NOMENPRÄPOSITIONVERBINDUNGA2](#nomenprapositionverbindunga2)
   18. [TRENNBAREVERBEN](#trennbareverben)
   19. [TEMPORALSATZ](#temporalsatz)
   20. [LOKALPRÄPOSITIONENA2](#lokalprapositionena2)
   21. [N-DEKLINATION](#n-deklination)
   22. [SATZSTELLUNGA2](#satzstellunga2)
   23. [SPRACHBAUSTEINEB1](#sprachbausteineb1)

---

## Architektur

A2 ist sauberer strukturiert als A1: Daten und Generatorlogik sind bereits getrennt.

| Aufgabentyp | Generator | Datenbank |
|-------------|-----------|-----------|
| input-text  | `scripts/generate-a2-input-text.mjs` | `scripts/a2-input-text-data.mjs` |
| select-one  | `scripts/generate-a2-select-one.mjs` | `scripts/a2-select-one-data.mjs` |
| dropbox     | `scripts/generate-a2-dropbox.mjs`    | `scripts/a2-dropbox-data.mjs` |

Drei Generatoren bedienen je 21 Themen (× 50 Items, zyklisch wiederholt durch `cycle50`).  
Topics ohne Generator: `SATZSTELLUNGA2`, `SPRACHBAUSTEINEB1` → siehe [Struktur-Anomalien](#struktur-anomalien).

Dateizählung:
```
0     SPRACHBAUSTEINEB1
2     SATZSTELLUNGA2
150   ADJEKTIVDEKLINATIONA2, AKKUSATIVA2, DATIVA2, FESTEPRÄPOSITIONENA2,
      GENITIVA2, INDEFINITPRONOMEN, KOMPARATIVA2, LOKALPRÄPOSITIONENA2,
      N-DEKLINATION, NOMENPRÄPOSITIONVERBINDUNGA2, SUPERLATIVA2,
      TEMPORALSATZ, TRENNBAREVERBEN, WECHSELPRÄPOSITIONENA2
151   ANTWORTPARTIKELN, KONJUNKTIONENA2, MODALVERBENA2,
      PERFEKTA2, PRÄTERITUMA2, REFLEXIVPRONOMEN
153   POSSESSIVARTIKELA2
```

Die "151"/"153"-Ordner enthalten Zusatzdateien (siehe Anomalien).

---

## Struktur-Anomalien

### SA-1 — `SPRACHBAUSTEINEB1/` im A2-Verzeichnis (MAJOR) — **ERLEDIGT**
- War ein leerer Ordner, kein Generator, kein Topic-Eintrag in `TOPICS`.
- **2026-06-17:** leerer Ordner aus A2 entfernt. Die echte Sammlung mit 48 Dateien liegt unverändert unter `src/questions/B1/SPRACHBAUSTEINEB1/` und wird beim B1-Audit geprüft.

### SA-2 — `SATZSTELLUNGA2/` nur 2 Items, ID-Mismatch (MAJOR)
- `a2-sort-1.md` (`id: a2-sort-1`) — gemischter Satz mit `codes:` (T/M/L), aber kein vollständiges Drag-and-Drop-Layout-Schema, das im Rest des Repos verwendet wird.
- `a2-sort-2.md` hat **`id: a2-satz-sort-2`** im Frontmatter, Dateiname ist `a2-sort-2.md` — Inkonsistenz, die `questions:verify` möglicherweise toleriert, aber fragil.
- Kein Generator für dieses Topic.
- **Aktion:** entweder vollständig ausbauen oder als experimentell markieren.

### SA-3 — `PERFEKTA2/a2-sort-2.md` (CRITICAL/Struktur)
- Dropbox-Satz "Wir sind gestern ins Kino gegangen" mit ID `a2-sort-2` liegt **im PERFEKTA2-Ordner**.
- Vermutlich Kopierfehler aus `SATZSTELLUNGA2/`.
- **Aktion:** verschieben oder löschen.

### SA-4 — `POSSESSIVARTIKELA2/a2-poss-gen-dd-001..003.md` (CRITICAL)
- Alle drei: unvollständige Sätze (siehe Topic-Abschnitt).

### SA-5 — `MODALVERBENA2/a2-modal-multi-1.md` (Hinweis)
- Typ `multi-select` — nicht durch Generatoren erzeugt. Falls die Lerner-App diesen Typ nicht ausliefert, ist die Frage tot.

---

## Themenweise Befunde

> Konvention: **C** = Critical, **M** = Major, **m** = Minor.  
> Quellenangaben verweisen auf die `.mjs`-Datei und die Zeilennummer.

### ANTWORTPARTIKELN

Input-text (`a2-input-text-data.mjs:9–27`) — 17 Templates, gut.  
Dropbox (`a2-dropbox-data.mjs:9–27`) — OK.  
Select-one (`a2-select-one-data.mjs:14–40`).

- **C16** — select-one `:27`: `"„Trinkst du Milch?" — „___, ich trinke keinen."` mit Korrektantwort `Nein`. Die Antwort selbst enthält einen **Grammatikfehler** im Quellsatz: `Milch` ist feminin → `keine`, nicht `keinen`. ⇒ `"Nein, ich trinke keine."` oder Beispiel ändern.
- **m7** — dropbox `:14`: `Zuhause` als Wortform. Im Kontext "wir gehen nach Hause / wir bleiben zu Hause" ist `zu Hause` (Adverb) gemeint, nicht das Substantiv `das Zuhause`.

### KONJUNKTIONENA2

- **C5** — dropbox `:35`, `a2-konj-dd-006.md`:  
  Wörter: `[Weil, müde, war, ging, ich, früh, schlafen]`.  
  Es fehlt das **Subjekt** des Nebensatzes (`ich`). Lösung: `Weil ich müde war, ging ich früh schlafen.` ⇒ Wortliste ergänzen: `[Weil, ich, müde, war, ging, ich, früh, schlafen]` (mit `assertUnique`-Workaround, da `ich` zweimal vorkommt — alternativ den Hauptsatz umformulieren: `[Weil, ich, müde, war, schlief, ich, früh]`).
- **C6** — dropbox `:45`, `a2-konj-dd-016.md`:  
  Hint = `Konjunktion — Wenn`, Wörter = `[Bei, Fehlern, melden, Sie, sich, bitte]` — die Konjunktion `wenn` fehlt komplett. ⇒ ersetzen durch z. B. `[Wenn, Sie, einen, Fehler, machen, melden, sich, bitte]` (zwei `sich`/`einen`-Duplikate prüfen).
- (MINOR) input-text `:46`: `Hoffentlich kommt er, ___ er versprochen hat. (wie)` — `wie` als "vergleichende Konjunktion" zu A2 grenzwertig, aber tragbar.

### PERFEKTA2

- **C1** — input-text `:50`, `a2-perf-in-001.md` **und** dropbox `:50`, `a2-perf-dd-001.md`:  
  `"Ich bin gestern viele Leute kennengelernt"` — **`kennenlernen` wird mit `haben` konjugiert**, nicht mit `sein`. Korrektsatz: `Ich habe gestern viele Leute kennengelernt.`  
  ⇒ Korrektantwort von `bin` auf `habe` ändern; Hint `Perfekt — sein/ich` → `Perfekt — haben/ich`. Auch im Dropbox-Word-Array `bin` → `habe`.
- (M9) — daraus ergibt sich automatisch eine Hint-Korrektur in der Dropbox-Bank.
- Sonst sauber. Verb-Auswahl mit `haben`/`sein`-Verteilung pädagogisch sinnvoll.

### PRÄTERITUMA2

Sauber. Keine kritischen Befunde.  
Anmerkung: alle Hints in der Dropbox-Bank lauten nur `'Präteritum'` — wäre konsequent, das Verb wie in PERFEKTA2 anzugeben (`'Präteritum — spielte'`), aber kein Fehler.

### MODALVERBENA2

- **C2** — input-text `:106`, `a2-modal-in-017.md`:  
  Prompt: `"Ich ___ gern ein bisschen Ruhe haben. (Modalverb — möchten/ich)"`, Korrekt: `hätte`.  
  Probleme:  
  1. Korrektantwort `hätte` passt nicht zum Hint `möchten/ich`.  
  2. Der Satz `"Ich hätte gern ein bisschen Ruhe **haben**"` ist mit dem überschüssigen `haben` **ungrammatisch**. Korrekt ist eine von zwei Varianten:  
     - `Ich hätte gern ein bisschen Ruhe.` (ohne `haben`)  
     - `Ich möchte gern ein bisschen Ruhe haben.` (mit Modalverb `möchten`)  
  ⇒ Entweder Prompt zu `"Ich ___ gern ein bisschen Ruhe."` und Korrekt `hätte` (Hint: `höflicher Wunsch — haben Konj. II/ich`), oder Prompt zu `"Ich ___ gern ein bisschen Ruhe haben."` und Korrekt `möchte`.  
  Identische Korrektur erforderlich in **dropbox** `:106` (Wortliste enthält `[Ich, hätte, gern, ein, bisschen, Ruhe, haben]` — wieder das überflüssige `haben`).
- **M1** — input-text `:105`, `a2-modal-in-016.md`:  
  Korrekt `könntest`, Hint `Modalverb — können/du`. `könntest` ist **Konjunktiv II** (höflicher Vorschlag). Der Hint sollte das benennen, sonst akzeptiert das System nur `kannst` als "richtig", aber der Schüler weiß nicht, warum. ⇒ Hint `Konjunktiv II — können/du`.

### REFLEXIVPRONOMEN

- **C15** — select-one `:157`, `a2-refl-002.md`:  
  Pool `['interessiere', 'interessierst', 'interessieren', 'interessiert']` — Korrekt `interessiert`. Der Pool enthält bereits den korrekten Wert, was nach Deduplikation nur 3 Distraktoren übrig lässt (`options4` füllt korrekt auf, aber die Eingabe ist schlampig).
- **M2** — analog `:160`: Pool `['interessiert', 'interessieren', 'interessierst', 'interessiert']` enthält `interessiert` **doppelt** im Pool selbst (zweimal letztes Element). Korrekt ist `interessiere`. ⇒ Pool zu `['interessiert', 'interessieren', 'interessierst', 'interessierte']` o. ä.

### KOMPARATIVA2

- (m) input-text `:146`: `"Trotzdem habe ich gewonnen — ich war ___ als mein Gegner."` mit Korrekt `stärker`. Dropbox `:146` formuliert es als `"Trotzdem gewann ich als stärkerer Sportler"` — beides OK, aber die beiden Formate gehen auseinander.

Sonst sauber.

### SUPERLATIVA2

- **m1** — input-text `:165`: `"Am schönsten finde ich den ___ . (Superlativ — schön, mask., Akk.)"`, Korrekt `schönsten`.  
  "den schönsten" ohne Substantiv wirkt wie ein abgebrochener Satz. ⇒ z. B. `"Am schönsten finde ich den ___ Tag des Jahres."` mit Korrekt `schönsten`.

Sonst sauber. Pool-Qualität sehr gut (echte morphologische Verwechslungsgefahren).

### WECHSELPRÄPOSITIONENA2

- **C3** — dropbox `:175`, `a2-wech-dd-006.md`:  
  Wörter `[Stellen, Sie, die, Leiter, an, Wand]` — der Artikel **`die`** vor `Wand` fehlt. Korrektsatz: `Stellen Sie die Leiter an die Wand.` ⇒ Wortliste: `[Stellen, Sie, die, Leiter, an, die, Wand]` (Duplikate-Problem mit `assertUnique` beachten; ggf. ersetze `die Leiter` durch `eine Leiter`).
- **C4** — dropbox `:183`, `a2-wech-dd-014.md`:  
  `[Nach, der, Schule, gehe, ich, nach, Haus]`. Korrekt: `nach Hause`. ⇒ `Haus` → `Hause`.
- **m2** — input-text `:186`: Hint `(Wo? — im)` enthält die **Antwort** `im`.
- **m8** — select-one `:265`: Prompt enthält `___ Haus` und Korrekt `Nach`. Standard ist `Hause`.

### DATIVA2

Sauber. Pool und Hints konsistent.

### AKKUSATIVA2

- **C7** — dropbox `:211`, `a2-akk-dd-002.md`:  
  `[Er, denkt, gern, an, Urlaub, Mosel]`. Zwei Fehler:  
  1. `an + Akk. Urlaub` → es fehlt `den`.  
  2. `Mosel` braucht eine Präposition mit Artikel: `an **der** Mosel`.  
  Korrektsatz: `Er denkt gern an den Urlaub an der Mosel.` ⇒ Wortliste anpassen (`an` taucht doppelt auf — Duplikate-Workaround nötig).

### FESTEPRÄPOSITIONENA2

- **C13 / M3** — input-text `:234`, `:238` und select-one `:340`, `:344`:  
  Items mischen drei Lernziele:  
  - feste Präposition (`auf`, `vor`, `an`, …) — Original-Lernziel  
  - Artikel (`einen`, `die`, …)  
  - Adjektivendung (`klassische`, `gutes`) — Item 5 und 9  
  Auf einem A2-Tafel ist das verwirrend. ⇒ Items 5 und 9 entweder umformulieren, sodass die Präposition die Lücke ist (`Ich interessiere mich ___ klassische Musik.` mit Korrekt `für`), oder das Topic explizit in zwei Untertopics teilen.

### ADJEKTIVDEKLINATIONA2

- **M4** — alle 50 input-text-Items haben den generischen Hint `(Adjektivendung)`. Bei A2-Niveau ist die Adjektivdeklination das schwierigste Pensum überhaupt; ohne Genus/Kasus/Numerus im Hint ist die Aufgabe oft glücksabhängig.  
  ⇒ Hint ergänzen, z. B. `(neu, neutr., Nom.)` (so wie es bereits an wenigen Stellen, z. B. `:254`, `:288`, `:269`, vorbildlich ist).
- **M5** — input-text `:288`: `"In der ___ Klasse sind 25 Schüler. (Adjektivendung)"`, Korrekt `fünften`.  
  `fünften` ist eine **Ordinalzahl**, die wie ein Adjektiv flektiert wird. Auf A2 erwartet das Curriculum echte Adjektive an dieser Stelle. ⇒ ersetzen durch z. B. `In der ___ Klasse sind 25 Schüler. (klein, fem., Dat.)` → `kleinen`.

Pool-Qualität sonst gut.

### POSSESSIVARTIKELA2

- **C14** — Freie Dropbox-Dateien `a2-poss-gen-dd-001.md`, `a2-poss-gen-dd-002.md`, `a2-poss-gen-dd-003.md`:  
  Wörter sind jeweils `[Das, ist, meines, Vaters]`, `[Das, ist, deines, Bruders]`, `[Das, ist, unseres, Kindes]`.  
  **Diese Sätze sind unvollständig.** Genitiv-NPs (`meines Vaters`) können nicht alleinstehendes Prädikat eines `sein`-Satzes sein. Korrekte Konstruktionen wären:  
  - `Das ist das Auto meines Vaters.` (Genitiv-Attribut)  
  - `Das ist mein Vater.` (Nominativ-Prädikativ)  
  ⇒ Sätze um ein Bezugssubstantiv ergänzen oder Genitiv durch Nominativ ersetzen.

Sonst sauber. Generierte Items (input-text + select-one + dropbox) sind konsistent.

### GENITIVA2

Sauber. Hervorragende Lern-Kohärenz (`wegen`, `während`, `trotz` mit echten Genitivobjekten).

### INDEFINITPRONOMEN

- **m3** — input-text `:359`: `"Ich habe ___ davon gehört. (Indefinitpronomen — Sache)"`, Korrekt `nichts`.  
  `nichts` ist negativ konnotiert; der Hint `Sache` suggeriert eher `etwas` als Antwort. ⇒ Hint zu `Verneinung — Sache`.

Sonst sehr sauber.

### NOMENPRÄPOSITIONVERBINDUNGA2

- **m4** — input-text `:377`, select-one `:491`: `"Er hat Recht ___ der Sache." (Korrekt: in)`.  
  Die Wendung `Recht haben in + Dat.` existiert, ist aber selten. Idiomatisch ist `in dieser Sache Recht haben`. ⇒ Beispiel ändern: `"Er hat Recht **mit** seiner Aussage."` (Korrekt `mit`) o. ä.

### TRENNBAREVERBEN

- **C11** — input-text `:395`, select-one `:517`, `a2-trenn-012.md`, `a2-trenn-in-012.md`:  
  `"Wir ___ nach Hause ein. (trennbar — einfahren/wir)"`, Korrekt `fahren`.  
  **`einfahren` bedeutet "in einen Bahnhof/Tunnel/Stollen einlaufen"**, nicht "nach Hause kommen". Mit `nach Hause` ist die Konstruktion semantisch falsch. Üblich wäre `Wir fahren nach Hause.` (kein trennbares Verb mit `ein`) oder `Wir laufen zu Hause ein.` (auch unidiomatisch). ⇒ ganzen Eintrag ersetzen, z. B. `"Wir ___ den Wagen in die Garage ein."` mit `fahren` und `ein…`.

Sonst sauber.

### TEMPORALSATZ

- **C8** — dropbox `:370`, `a2-temp-dd-001.md`:  
  `[Als, Kind, wohnte, ich, auf, Land]` — fehlender Artikel `dem` vor `Land`.  
  Korrektsatz: `Als Kind wohnte ich auf dem Land.` ⇒ `dem` ergänzen.
- **C9** — dropbox `:376`, `a2-temp-dd-007.md`:  
  `[In, Berlin, lernte, ich, viel, Deutsch]` — das ist **kein Temporalsatz**, sondern eine einfache Lokalisierung. Im input-text steht hier korrekt `Als ich in Berlin lebte, lernte ich viel.` Die Dropbox-Variante wurde fälschlich vereinfacht. ⇒ `[Als, ich, in, Berlin, lebte, lernte, ich, viel]` (mit `ich`-Duplikat-Workaround).
- **C10** — dropbox `:385`, `:386`, `a2-temp-dd-016/017.md`:  
  `[Nach, Reisebuchung, sind, wir, glücklich]`, `[Nach, Aufwachen, trinke, ich, Kaffee]` — beide ohne Artikel (`der Reisebuchung`, `dem Aufwachen`). Außerdem sind nominalisierte Konstruktionen für A2 untypisch; passender wären `Nachdem`-Sätze (wie in input-text `:419`).  
  ⇒ z. B. `[Nachdem, wir, gebucht, haben, sind, wir, glücklich]`.
- **m5** — input-text `:419`: `Nachdem wir die Reise gebucht haben, sind wir glücklich.` — mit `nachdem` wird im Standarddeutsch Vorzeitigkeit verlangt (Plusquamperfekt im Nebensatz, Perfekt/Präteritum im Hauptsatz). Optional auf A2 tolerierbar.

### LOKALPRÄPOSITIONENA2

- **m6** — input-text `:441`, select-one `:576`: `"…Die Apotheke ist ___ ."` mit Korrekt `auf der rechten Seite`. Die Phrase ist sehr lang; passt formal nicht in den Lückentyp (typische Lücke = 1–3 Wörter). ⇒ kürzen: `"… ist ___ ."` mit Korrekt `rechts` / `links`, oder Item entfernen.

Sonst inhaltlich gut (kontextreiche Hinweise wie "Schaufenster gegen Schaufenster" für `gegenüber`).

### N-DEKLINATION

- **C12** — input-text `:451`, select-one `:596`, `a2-n-007.md`, `a2-n-in-007.md`:  
  `"Ich kenne einen ___. (N-Deklination — Italiener, Akk.)"`, Korrekt `Italiener`.  
  `der Italiener` gehört **nicht** zur N-Deklination. Akkusativ ist identisch mit Nominativ (`einen Italiener`). Damit ist das Item didaktisch sinnlos: es testet kein N-Deklinationsphänomen. ⇒ ersetzen durch ein echtes Beispiel: `Junge`, `Kollege`, `Affe`, `Bauer` usw.
- **M6** — select-one `:603`: Pool für `Wir helfen dem ___.` (Korrekt: `Kunden`) enthält `Kundin`. `Kundin` ist die feminine Form, kein N-Deklinationsphänomen ⇒ ersetzen (z. B. `Kund`, `Kundens` ist schon drin, `Kunder` als Phantasieform).
- (Hinweis) `:597`/`:417` für `Pilot` — `er ist Pilot geworden` ist OK; Berufsbezeichnungen ohne Artikel stehen im Nominativ und N-Deklination greift nicht. Hint sollte das aber benennen.

### SATZSTELLUNGA2

Siehe [SA-2](#sa-2--satzstellunga2-nur-2-items-id-mismatch-major).

### SPRACHBAUSTEINEB1

Siehe [SA-1](#sa-1--sprachbausteineb1-im-a2-verzeichnis-major).

---

## Vorgeschlagene Korrekturreihenfolge

1. **C1, C2** — beide Verb-/Modalverb-Fehler in PERFEKTA2 und MODALVERBENA2: Quelle in `a2-input-text-data.mjs` korrigieren, dann input-text + dropbox neu generieren.
2. **C3, C4** — Wechselpräpositionen-Dropbox: zwei einzelne Wortlisten ändern.
3. **C5, C6** — Konjunktionen-Dropbox: zwei Wortlisten.
4. **C7** — Akkusativ-Dropbox: eine Wortliste.
5. **C8, C9, C10** — Temporalsatz-Dropbox: drei Wortlisten.
6. **C11** — Trennbare Verben: input-text + select-one Item ersetzen.
7. **C12** — N-Deklination: input-text + select-one ein Item ersetzen.
8. **C13** — Feste Präpositionen: zwei Items refaktorieren (Lücke verschieben).
9. **C14** — POSSESSIVARTIKELA2: drei freie Dropbox-Dateien ändern.
10. **C15, C16, C17** — Restliche Critical-Items.
11. **M1–M9** — didaktische Verbesserungen.
12. **m1–m8** — Feinschliff.

Nach jeder Charge: `npm run questions:verify`.

---

## Anhang: Reproduktionspfade

- Datenbanken:  
  `scripts/a2-input-text-data.mjs`, `scripts/a2-dropbox-data.mjs`, `scripts/a2-select-one-data.mjs`
- Generatoren:  
  `scripts/generate-a2-input-text.mjs --restore-hints --topic=<TOPIC>`  
  `scripts/generate-a2-select-one.mjs --restore --topic=<TOPIC>`  
  `scripts/generate-a2-dropbox.mjs`
- Verifizierung: `npm run questions:verify`
