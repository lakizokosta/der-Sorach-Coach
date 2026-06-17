# A1 · 08 — ARTIKEL (Audit 2026)

**Geprüfte Dateien:** 150 (5 frei + 45 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a1-select-one.mjs` → `genArtikel()` (Z.473–531)
- `scripts/generate-a1-input-text.mjs` → `BANK.ARTIKEL` (Z.447–498)
- `scripts/a1-dropbox-data-3.mjs` → `ARTIKEL` (Z.110–161)

---

## CRITICAL

_Keine kritischen Fehler gefunden._

---

## MAJOR

### M1 · Pool mischt Klein- und Großschreibung von Artikeln

**Quelle:** `generate-a1-select-one.mjs` Z.522

```js
const pool = ['Der','Die','Das','Den','ein','eine','einen','kein','keine','keinen'];
```

**Problem:** Bestimmte Artikel sind großgeschrieben (Satzanfang), unbestimmte/Negation klein. Das macht Distraktoren **trivial unterscheidbar** — sobald der Prompt im Satzanfang die Lücke hat (`___ Tisch ist wichtig.`), eliminiert man `ein/eine/keinen` allein an der Kleinschreibung.

Gleichzeitig fehlt eine konsistente Behandlung: wenn ein Item `correct: 'einen'` hat, ist das ein Akkusativ-Item — aber Distraktoren beinhalten dann `Der, Die, Das` (definite-article-Großschreibung), die offensichtlich nicht hineinpassen.

**Beispiel** (a1-art-007.md mit Item `mode: 'ein'` und `noun: 'Lampe'`):
- correct: `eine`, pool zieht aus mixed pool → Optionen wie `Der, eine, kein, einen` — `Der` ist offensichtlich falsch wegen Großbuchstaben.

**Fix:** Pool nach Kontext aufteilen oder Großschreibung normalisieren. Vorschlag: ausschließlich Kleinbuchstaben im Pool + Capitalize in `prompt`-Formatter, je nach Position.

### M2 · Items `Z.474–490` mit `kein/keine` und `haben`-Konstruktion

**Quelle:** `generate-a1-select-one.mjs` Z.491–520

In `modes`-Zyklus wechseln sich `def, ein, kein` ab. Für `kein`-Modus ist der Prompt identisch zu `ein`-Modus („Ich habe ___ {n.noun}."), was bedeutet:

```
Prompt: „Ich habe ___ Tisch."
Möglich: einen / keinen (beide grammatisch korrekt)
correct (laut Code für kein-Modus): keinen
```

Ein Lernender, der „einen" einträgt, hat **grammatisch** ebenso recht — der Satz ist nicht eindeutig negiert. Es fehlt ein Hinweis im Prompt, der Negation einfordert (z. B. „… aber kein Bett.").

**Fix-Vorschlag:** Negations-Kontext erzwingen:
```
mode === 'kein' → „Ich habe ___ Tisch, sondern nur einen Stuhl."
```
Oder Hinweistext: „Negation".

---

## MINOR

### m1 · Free-Items decken nur 5 Konfigurationen ab

`a1-art-1` (Der), `a1-art-2` (Die), `a1-art-3` (Das), `a1-art-4` (Den), `a1-art-5` (kein) — keine `eine` oder `einen` im Free-Tier.

### m2 · BANK Z.469 mit „Schule"-Theme aber Item-Inhalt „Idee"

```
'[Schule] Ich habe ___ Idee. (eine Idee, fem., Akk.)', 'eine'
```

**Bewertung:** Themen-Tag „Schule" passt nur indirekt zu „Idee". Vertretbar, aber lose Verknüpfung.

### m3 · `Mädchen` als neutrales Substantiv

**Datei:** `a1-art-in-042.md` (Bank Z.490)
**Prompt:** „Ich kenne ___ Mädchen. (ein Mädchen, neutr., Akk.)" → `ein`

**Bewertung:** ✓ korrekt — `das Mädchen` ist Neutrum (Diminutiv mit -chen). Gute Möglichkeit, das Genus-Regel-Phänomen zu erwähnen, ist aber nicht erklärt.

---

## Geprüft & in Ordnung

- **Select-One Z.475–490** (15 Substantive × 3 Modi) — alle Artikelformen korrekt zugeordnet.
- **Input-Text** Items 1–50 — alle Artikelformen korrekt (`Der, Die, Das, eine, einen, ein, kein, keinen, keine`).
- **Dropbox** Items 1–50 — alle 50 Sätze grammatisch korrekt.
- **Genus-Konsistenz**: alle Substantive (Tisch m, Lampe f, Kind n, Zug m, Straße f, Essen n, Regen m, Sonne f, Freund m, Schule f, Hobby n, Arzt m, Pizza f, Fahrrad n, Markt m, Gitarre f, Hotel n, Büro n, Hund m, Jacke f) korrekt klassifiziert.
- **Akkusativ-Formen** nach `haben`: alle 15 korrekt (einen/eine/ein/keinen/keine/kein).

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 0      | — |
| MAJOR       | 2      | Code-Refactor in `genArtikel()` (Pool + Negationskontext) |
| MINOR       | 3      | Optional |
