# A1 · 04 — ADJEKTIVDEKLINATIONA1 (Audit 2026)

**Geprüfte Dateien:** 150 (5 frei + 45 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a1-select-one.mjs` → `genAdjektiv()` (Z.296–346)
- `scripts/generate-a1-input-text.mjs` → `BANK.ADJEKTIVDEKLINATIONA1` (Z.234–285)
- `scripts/a1-dropbox-data-2.mjs` → `ADJEKTIVDEKLINATIONA1` (Z.3–55)

---

## CRITICAL

### C1 · `a1-adj-4.md` — falsche Adjektivendung

**Datei:** `src/questions/A1/ADJEKTIVDEKLINATIONA1/a1-adj-4.md`

```
options: neue | neuer | neues | neuen
correct: neues
prompt: „Das ___ Auto ist schnell."
```

**Problem:** `Das` ist hier **bestimmter Artikel** (Neutrum Nom.) → **schwache** Deklination → `-e`. Korrekt: **„Das neue Auto ist schnell."** „Das neues Auto" ist grammatisch falsch (das wäre die starke Endung, aber starke Endungen kommen nur bei Null-Artikel: „neues Auto" ohne Artikel).

Die Input-Text-Bank Z.238 hat dasselbe Item korrekt: `'Das ___ Auto ist schnell. (neu, neutr., Nom.)', 'neue'`. Free-Select-One widerspricht.

**Fix:** `correct: neue`. (Distraktor `neues` bleibt drin, ist jetzt korrekt als Falsche.)

---

## MAJOR

### M1 · `adjPrompt` zeigt „eine" statt `art`-Wert für `keine`-Items

**Quelle:** `generate-a1-select-one.mjs` Z.322–323

```js
if (it.art === 'keine' || it.art === 'eine') {
  return `[${t}] Ich habe eine ___ ${it.noun}.`;
}
```

**Problem:** Für `{ art: 'keine', noun: 'Jacke' }` (Z.305) wird der Prompt zu „Ich habe eine ___ Jacke." statt „Ich habe **keine** ___ Jacke." Die Antwort `warme` ist zwar in beiden Fällen identisch (Fem. Akk. schwach = -e), aber:

1. Der Hinweis verspricht `keine`-Übung, der Prompt liefert `eine`-Übung.
2. Das Item kann gar nicht negiert geübt werden.
3. Lernender bekommt nie Praxis mit `keine` vor Adjektiv.

**Betroffene Items in `items`:** Z.305 (`keine`/`warm`/`Jacke`).
**Betroffene Files:** alle Files, in denen `i % 15 === 7` (≈ `a1-adj-013.md`, `…-028.md`, `…-043.md`).

**Fix:** Prompt-Generator anpassen:

```js
if (it.art === 'keine') return `[${t}] Ich habe keine ___ ${it.noun}.`;
if (it.art === 'eine')  return `[${t}] Ich habe eine ___ ${it.noun}.`;
```

### M2 · Distraktorpool `wrongEnds` zyklisch wiederholt nur 3 Adjektive

**Quelle:** `generate-a1-select-one.mjs` Z.314

```js
const wrongEnds = ['kleiner','kleine','kleines','kleinen','guter','gute','gutes','guten','neuer','neue','neues','neuen'];
```

**Problem:** Für `correct = "schöne"` werden die Distraktoren immer aus `klein/gut/neu` gezogen — Lernender erkennt sofort, dass nur „schöne" zum Stamm passt. Übung degeneriert: man wählt die Antwort an Hand des **Stamms**, nicht der **Endung**.

**Fix:** Distraktoren aus den Endungen **desselben Adjektivs** ableiten, z. B. für `schöne` → `[schöner, schöne, schönes, schönen]`. Dafür Helferfunktion `endingsOf(stem)` einführen.

### M3 · Input-Text Z.273 — `fünft` als Bank-Eintrag

**Datei:** `a1-adj-in-039.md` (Bank Z.273)

```
'[Schule] In der ___ Klasse sind 25 Schüler. (fünft, fem., Dat.)', 'fünften'
```

**Problem:** `fünft` ist eine **Ordnungszahl**, kein normales Adjektiv. Die Behandlung als „Adjektivdeklination" ist methodisch fragwürdig: Ordnungszahlen folgen zwar adjektivischen Endungen, aber das ist eigentlich Thema **Ordinalzahlen** (A2). Auf A1 fehl am Platz.

**Fix-Vorschlag:** Item ersetzen, z. B. mit „ruhig" oder „neu".

### M4 · Input-Text Z.275 — `An einem sonnigen Tag` mit Hint „mask., Dat."

**Datei:** `a1-adj-in-041.md` (Bank Z.275)

```
'[Wetter] An einem ___ Tag gehen wir spazieren. (sonnig, mask., Dat.)', 'sonnigen'
```

**Bewertung:** ✓ korrekt (Tag — mask., Dat. nach `einem` → schwach -en). Kein Bug.

### M5 · BANK Z.243 — `bei schlechtem Wetter` als A1-Item

**Datei:** `a1-adj-in-009.md` (Bank Z.243)

```
'[Wetter] Bei ___ Wetter bleibe ich zu Hause. (schlecht, neutr., Dat.)', 'schlechtem'
```

**Bewertung:** ✓ korrekt — Null-Artikel-Konstruktion (bei + Nullartikel + Adj.) → starke Endung. Für A1 anspruchsvoll, aber nicht falsch. Sehr fortgeschrittenes Item.

---

## MINOR

### m1 · Free-Items decken nur 5 Konfigurationen ab

`a1-adj-1` (ein+m+Nom), `a1-adj-2` (der+m+Nom), `a1-adj-3` (eine+f+Akk), `a1-adj-4` (das+n+Nom — siehe **C1**!), `a1-adj-5` (keine+f+Akk) — kein Dativ und keine Pluralformen im Free-Tier.

### m2 · `BANK.ADJEKTIVDEKLINATIONA1` Hint-Notation

Die Notation `(klein, mask., Nom.)` ist sehr explizit (Stamm + Genus + Kasus). Lehrreich, aber spoilert die Antwort fast komplett — Lernender muss nur noch das Endungs-Schema auswendig lernen.

---

## Geprüft & in Ordnung

- **Select-One Z.298–312** (15 Schablonen) — alle 14 grammatisch korrekt (außer M1-Schablone mit Prompt-Bug).
- **Input-Text Items 1–50** — alle Endungen korrekt zur Hint-Spezifikation (Sonderfälle korrekt: `teure` Z.258, `hohen` Z.269, `hellen` Z.262, `harten` Z.271).
- **Dropbox Items 1–50** — alle 50 Sätze grammatisch korrekt.
- **Substantivgenus** in allen 65 Items korrekt zugeordnet.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 1      | 1-Zeilen-Fix in `a1-adj-4.md` |
| MAJOR       | 3 (M1 + M2 + M3) | Code-Refactor in `genAdjektiv()` + 1 Bank-Edit, Regen 45 Files |
| MINOR       | 2      | Optional |
