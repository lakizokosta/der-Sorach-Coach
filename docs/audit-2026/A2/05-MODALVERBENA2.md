# A2 · 05 — MODALVERBENA2 (Audit 2026)

**Geprüfte Dateien:** 151 (1 multi-select-Fremdling + 50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genModalverben()` (Zeilen 126–152)
- `scripts/a2-input-text-data.mjs` → `BANK.MODALVERBENA2` (Zeilen 89–107)
- `scripts/a2-dropbox-data.mjs` → `BANK.MODALVERBENA2` (Zeilen 89–107)
- Freidatei: `src/questions/A2/MODALVERBENA2/a2-modal-multi-1.md` (Typ `multi-select`)

---

## CRITICAL

### C1 · Ungrammatischer Quellsatz: „Ich hätte gern Ruhe **haben**"

**Dateien:**
- `a2-modal-in-017.md` (input-text, Bank Z.106)
- `a2-modal-dd-017.md` (dropbox, Bank Z.106)
- zyklische Wiederholungen `-034`, `-051` …

**Quelle:** `scripts/a2-input-text-data.mjs:106`, `scripts/a2-dropbox-data.mjs:106`

**Item (input-text):**
```
Ich ___ gern ein bisschen Ruhe haben. (Modalverb — möchten/ich)   →  Korrekt: hätte
```

**Probleme:**
1. Mit `hätte` und dem Restsatz entsteht `*Ich hätte gern ein bisschen Ruhe haben` — **doppeltes Vollverb** (`haben` als Konjunktiv + `haben` im Infinitiv). Ungrammatisch.
2. Der Hint `möchten/ich` passt nicht zur Antwort `hätte` (Konj. II von `haben`).

**Korrekte Varianten:**
- `Ich hätte gern ein bisschen Ruhe.` (kein `haben` am Ende; Hint `höflicher Wunsch — haben Konj. II/ich`)
- `Ich möchte gern ein bisschen Ruhe haben.` (mit Modalverb; Hint `Modalverb — möchten/ich`)

**Fix:** Entweder das überschüssige `haben` aus Prompt entfernen und Antwort `hätte` lassen (mit neuem Hint), oder Antwort auf `möchte` ändern und Hint beibehalten. Identische Korrektur in der Dropbox-Wortliste (entferne `haben`).

---

## MAJOR

### M1 · `könntest` als Korrektantwort, aber Hint = Indikativ

**Datei:** `a2-modal-in-016.md` (Bank Z.105) + zyklisch.
**Quelle:** `scripts/a2-input-text-data.mjs:105`

**Item:**
```
Du ___ auch mitmachen. (Modalverb — können/du)   →  Korrekt: könntest
```

**Problem:** `könntest` ist Konjunktiv II („Du **könntest** auch mitmachen" als höflicher Vorschlag). Der Hint nennt aber nur „Modalverb — können/du", was die Indikativform `kannst` erwarten lässt.

**Fix:** Hint auf `Konjunktiv II — können/du (Vorschlag)` ändern.

### M2 · Freidatei `a2-modal-multi-1.md` mit nicht-Standard-Typ

**Datei:** `src/questions/A2/MODALVERBENA2/a2-modal-multi-1.md`

**Frontmatter:** `type: multi-select` — von allen drei Generatoren nicht erzeugt; im Rest des Repos kein zweites Beispiel.

**Bewertung:** Falls die Lerner-App `multi-select` nicht unterstützt, ist die Frage unsichtbar. Falls sie unterstützt wird, ist sie methodisch wertvoll (echte Wissens­abfrage „Welche dieser Verben sind Modalverben?").

**Fix:** Verifizieren, dass `apps-script/Code.gs` (oder der Frontend-Renderer) den Typ behandelt. Sonst entfernen oder in `select-one`-Multiple-Choice-Variante umbauen.

---

## MINOR

### m1 · Dropbox-Hints generisch (`'Modalverben'`)

**Quelle:** `scripts/a2-dropbox-data.mjs:90–106`

**Bewertung:** Alle 17 Items haben den gleichen Hint. Analog zu PERFEKT/REFLEXIV wäre `'Modalverben — sollst'`, `'Modalverben — Darf'` informativer.

### m2 · Dropbox-Items mit isoliertem `?`

**Beispiel:** `a2-modal-dd-003.md` Wortliste `['Darf', 'ich', 'hier', 'am', 'Bankschalter', 'fragen', '?']`

**Bewertung:** Das einzelne `?` als „Wort" ist im Drag-and-Drop unüblich (Interpunktion gehört normalerweise nicht zu den Schiebebausteinen). Wenn die UI das toleriert, ist es OK; sauberer wäre, das `?` automatisch zu setzen oder das Item ohne Frageform zu formulieren.

---

## Geprüft & in Ordnung

- Input-Text Items 1–15: Modalverben korrekt nach Kontext gewählt (`sollst, muss, Darf, wollen, kann …`).
- Select-One Items 1–15: Pools sind sinnvoll homogen (alle 5 Modalverben in 2.Sg./1.Sg./1.Pl.).
- Dropbox Items 1–15: vollständige Sätze, Modalverben in der richtigen Position (Position 2 / Satzanfang bei Fragen).
- Mischung von Funktionen: `sollen` (Empfehlung), `müssen` (Verpflichtung), `dürfen` (Erlaubnis), `können` (Möglichkeit), `wollen` (Absicht).

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 1      | Bank-Edit (input-text + dropbox), Regen |
| MAJOR       | 2      | Hint-Edit; Entscheidung über multi-select-Typ |
| MINOR       | 2      | Optional |
