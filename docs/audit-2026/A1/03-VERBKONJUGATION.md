# A1 · 03 — VERBKONJUGATION (Audit 2026)

**Geprüfte Dateien:** 151 (5 frei + 45 select-one + 50 input-text + 50 dropbox + 1 fill)
**Quellen:**
- `scripts/generate-a1-select-one.mjs` → `genKonjugation()` (Z.253–292)
- `scripts/generate-a1-input-text.mjs` → `BANK.VERBKONJUGATION` (Z.181–232)
- `scripts/a1-dropbox-data.mjs` → `VERBKONJUGATION` (Z.110–162)

---

## CRITICAL

### C1 · Dropbox — Wortform widerspricht dem Hint („streicheln" ≠ „streiche")

**Datei:** `src/questions/A1/VERBKONJUGATION/a1-konj-dd-046.md`
**Quelle:** `a1-dropbox-data.mjs` Z.156

```
hint:  „Verb — streicheln, ich"
words: ['Ich', 'streiche', 'die', 'Katze']
```

**Problem:** „streicheln" (streicheln = jdn. zärtlich berühren) wird in der 1. Pers. Sg. zu **„streichle"** (oder umgangssprachlich „streichel"). „**streiche**" gehört zum Verb **„streichen"** (= ein Brett anmalen / die Wand streichen). Der Satz „Ich streiche die Katze" bedeutet wörtlich „Ich male die Katze an" — falsch und potenziell verwirrend.

**Fix-Vorschlag:** `words: ['Ich', 'streichle', 'die', 'Katze']` (oder Hint auf „streichen" ändern, falls Schreibroutine gemeint ist — aber dann passt der Inhalt nicht).

---

## MAJOR

### M1 · Hint-Inkonsistenz im Dropbox (Person vs. Artikel)

**Dateien:** `a1-konj-dd-028.md`, `a1-konj-dd-032.md`
**Quelle:** `a1-dropbox-data.mjs` Z.138, Z.142

```
Z.138: hint: „Verb — beginnen, der", words: ['Der', 'Kurs', 'beginnt', 'um', 'acht']
Z.142: hint: „Verb — scheinen, die", words: ['Die', 'Sonne', 'scheint', 'heute']
```

**Problem:** Andere Items folgen dem Schema `„Verb — X, <Person>"` (ich/du/er/wir/ihr/sie). Hier steht statt der Person der Artikel des Subjekts (`der`, `die`). Inkonsistent und wenig informativ.

**Fix-Vorschlag:** Konvention vereinheitlichen, z. B. `„Verb — beginnen, 3 Sg."` oder `„Verb — beginnen, der Kurs"`.

### M2 · Select-One Subjekt „sie" zweideutig

**Betroffen:** alle Select-One-Dateien, in denen `subjects[3] = ['sie', 'sie']` mit Verb-Form `v.sie` (Plural-Form) gepaart wird. Aufgrund des Zyklus alle 10. Datei (z. B. `a1-konj-009.md`).

**Problem:** Prompt „Sie ___ ein Buch über Reisen." kann sowohl als 3. Sg. fem. (= „liest") als auch als 3. Pl. oder höfliches „Sie" (= „lesen") gelesen werden. Beide Antworten sind grammatisch korrekt; das System akzeptiert nur „lesen".

**Aktueller Workaround:** Hinweis enthält `„sie (Pl.)"` (siehe `a1-konj-009.md`). Das ist eine korrekte Stütze, aber:

1. Lernende vergessen oft Klammerhinweise,
2. die Free-Item-Varianten haben keinen Pluralhinweis,
3. die Bank `BANK.VERBKONJUGATION` Z.185 nennt es `„sie Fem."`, Z.188 nennt es `„sie Pl."` — uneinheitlich.

**Fix-Vorschlag:** Subjekt durch eindeutiges Personalpronomen / Eigennamen ersetzen, z. B. `„Anna"` für 3 Sg. fem. und `„meine Freunde"` für 3 Pl. (beides bereits in `subjects` vorhanden, nur `'sie'` ist problematisch).

### M3 · Input-Text Hint Z.224 nennt „sie Fem." als Personenkennung

**Datei:** `a1-konj-in-043.md` (Bank Z.224)

```
'[Kleidung] Sie ___ einen blauen Mantel. (tragen, sie Fem.)', 'trägt'
```

**Problem:** Markierung „sie Fem." ist Privatnotation, kein deutsches Grammatikkürzel. Lernende verstehen „Fem." nicht zwangsläufig als „feminin" / 3 Sg. Üblicher: `„(tragen, 3 Sg. fem.)"`.

**Fix-Vorschlag:** Vereinheitlichen mit `BANK.VERBKONJUGATION` Z.185, 200 (gleiches Problem) → `„3 Sg. fem."` oder konkrete Person nennen.

---

## MINOR

### m1 · `subjects[6]` mit Key `'er/sie'` fällt im Code auf `er` zurück

**Quelle:** `generate-a1-select-one.mjs` Z.282 — `const correct = v[key === 'er/sie' ? 'er' : key];`

**Bewertung:** Funktioniert, aber der Eintrag `['Anna', 'er/sie']` ist semantisch verwirrend (Anna ist eindeutig 3 Sg.). Sollte `['Anna', 'er']` sein.

### m2 · `a1-fill-2.md` ist ein verstecktes input-text-Item für Free-Tier

**Datei:** `src/questions/A1/VERBKONJUGATION/a1-fill-2.md`

```
correct: steht
prompt: "Er ___ jeden Tag um 7 Uhr auf."
hint: "Trennbares Verb — Präfix ans Ende!"
```

**Bewertung:** Inhaltlich korrekt (`aufstehen` → 3 Sg.: `steht … auf`). Aber: Thema „trennbare Verben" gehört eigentlich nicht zu VERBKONJUGATION, sondern hat in A2 ein eigenes Thema TRENNBAREVERBEN. Eventuell verschieben.

### m3 · BANK Hint Z.156: `Verb — streicheln, ich` (siehe C1) — gleiches Hint-Inkonsistenzproblem wie M3

---

## Geprüft & in Ordnung

- **Select-One Z.255–269** (14 Standard-Verben + 1 Sonderverb `essen`) — alle Konjugationsformen korrekt (auch Umlaut-Verben: `fahren → fährt`, `lesen → liest`, `essen → isst`, `schlafen → schläft`, `tragen → trägt`).
- **Input-Text** Items 1–22, 24–50 — alle Antworten korrekt zur Form (außer M3 hinsichtlich Hint-Notation).
- **Dropbox** 49/50 Wortketten ergeben grammatisch korrekte Sätze (Ausnahme: C1 streicheln-Item).
- **Trennbare Verben in Bank** (`anrufen, aufstehen, anziehen`) — alle korrekt zerlegt: `rufe…an`, `stehe…auf`, `ziehst…an`.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 1      | 1 Bank-Edit + Regen 1 Dropbox-Datei |
| MAJOR       | 3      | Hint-Vereinheitlichung in 3 Banks (≈ 10 Items) |
| MINOR       | 3      | Optional |
