# A2 · 21 — N-DEKLINATION (Audit 2026)

**Geprüfte Dateien:** 150 (50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genNdekl()` (Zeilen 588–614)
- `scripts/a2-input-text-data.mjs` → `BANK['N-DEKLINATION']` (Zeilen 444–462)
- `scripts/a2-dropbox-data.mjs` → `BANK['N-DEKLINATION']` (Zeilen 409–427)

---

## CRITICAL

### C1 · `Italiener` gehört nicht zur N-Deklination

**Dateien:**
- `a2-n-in-007.md` (input-text, Bank Z.451)
- `a2-n-007.md` (select-one, Z.596)
- zyklische Wiederholungen

**Quelle:** `scripts/a2-input-text-data.mjs:451`, `scripts/a2-select-one-data.mjs:596`

**Item:** `Ich kenne einen ___. (N-Deklination — Italiener, Akk.)` → `Italiener`

**Problem:** Die N-Deklination betrifft schwache Maskulina, die in allen Kasus außer Nominativ-Singular die Endung `-en/-n` tragen. `Der Italiener` ist ein **normales Maskulinum** auf `-er` (Nomen agentis), das **keine N-Deklination** hat: `Nom. = Italiener`, `Akk. = Italiener`, `Dat. = Italiener`, `Gen. = Italieners`. Das Item testet also kein N-Deklinationsphänomen — die Korrektantwort ist identisch mit der Nominativform.

Außerdem sind die Distraktoren (`Italienen, Italienens, Italienener, Italienisch`) reine Phantasieformen, die wie typische N-Deklinationsfehler aussehen — das suggeriert dem Lerner fälschlich, `Italiener` sei ein N-Deklinationswort.

**Fix:** Item komplett ersetzen durch ein echtes N-Deklinationswort, z. B.
- `Ich kenne einen ___. (N-Deklination — Junge, Akk.)` → `Jungen`
- `Ich kenne einen ___. (N-Deklination — Kollege, Akk.)` → `Kollegen`
- `Ich kenne einen ___. (N-Deklination — Bauer, Akk.)` → `Bauern`

---

## MAJOR

### M1 · Distraktor `Kundin` ist feminin

**Quelle:** `scripts/a2-select-one-data.mjs:603`
**Item:** `Wir helfen dem ___. (Kunde, Dat.)` → Korrekt `Kunden`. Pool: `['Kunde', 'Kundes', 'Kundin', 'Kundens']`.

**Problem:** `Kundin` ist die **feminine Form** (die Kundin), passt nicht zu „dem". Im Kontext einer N-Deklinations-Übung sollte der Pool nur maskuline N-Deklinations-Formen oder typische Fehlbildungen enthalten, keine Genusverwechslung.

**Fix:** `Kundin` → `Kunder` (Phantasie-Plural) oder `Kundem` (typischer Fehler).

### M2 · Item 8 input-text: `Pilot` ohne Endung im Nominativ

**Quelle:** `scripts/a2-input-text-data.mjs:452`
**Item:** `Er ist ___ geworden. (N-Deklination — Pilot, Nom.)` → `Pilot`

**Bewertung:** Im Berufsbezeichnungssatz nach `sein/werden` steht das Substantiv ohne Artikel im Nominativ. `Pilot` ist N-Deklination, aber im Nominativ Singular ist die Endung tatsächlich `Ø`. Item ist korrekt, prüft aber **kein** N-Deklinationsphänomen (die Endung fehlt ja gerade). Optional in Akkusativ/Dativ umformulieren: `Ich treffe einen ___.` → `Piloten`.

---

## MINOR

### m1 · Pool-Distraktoren mit `-istin`/`-tin`-Femininum

**Items:** Z.592 `Polizistin`, Z.593 `Journalistin`, Z.594 `Präsidentin`, Z.595 `Nachbarin`, Z.598 `Fotografin`, Z.600 `Journalistin`, Z.601 `Komponistin`, Z.602 `Löwin`, Z.604 `Studentin`

**Bewertung:** Wie M1 — feminin-Formen sind keine N-Deklinationsfehler. Lerner können das missverstehen als „Polizist hat eine N-Deklination-Form `Polizistin`". Wäre konsequent, alle Distraktoren aus N-Deklinationsfehlbildungen zu wählen (`Polizisten` korrekt; `Polizist, Polizistens, Poliziste, Polizistem` als plausible Falschformen).

### m2 · Dropbox-Hints inkonsistent

**Quelle:** `scripts/a2-dropbox-data.mjs:410–426`

**Bewertung:** Einige Hints nennen das Substantiv (`'N-Deklination — Polizist'`), andere nicht (`'N-Deklination'`). Konsistenz wäre besser.

---

## Geprüft & in Ordnung

- Echte N-Deklinationswörter im Set:
  - **Schwache Maskulina auf `-e`:** `Junge, Kunde, Löwe, Komponist, Psychologe`.
  - **Internationalismen auf `-ist/-ent`:** `Polizist, Journalist, Präsident, Komponist, Student`.
  - **Sonderfälle:** `Herr` (Endung `-n` im Singular, `-en` im Plural), `Nachbar` (Schwankung — hier mit `-n`).
- Item 9 input-text (`Fotograf` → `Fotografen` Akk.) korrekt.
- Item 10 (`Herr` → `Herrn` Akk.) korrekt (Sonderform mit `-n` im Sg.).
- Item 13 (`Löwe` → `Löwen` Akk.) korrekt.
- Item 15 dropbox (`Junge` → `Jungen` Akk.) korrekt.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 1      | 1 Item ersetzen (input-text + select-one) |
| MAJOR       | 2      | Pool-Bereinigung in mehreren Items |
| MINOR       | 2      | Optional |
