# A2 · 22 — SATZSTELLUNGA2 (Audit 2026)

**Geprüfte Dateien:** 2 freie Items (kein Generator, keine Bank)
**Quellen:** keine — Topic ist nicht in `TOPICS` von `generate-a2-*.mjs` registriert.

---

## CRITICAL

### C1 · ID-Mismatch in `a2-sort-2.md`

**Datei:** `src/questions/A2/SATZSTELLUNGA2/a2-sort-2.md`

**Frontmatter:**
```yaml
id: a2-satz-sort-2
```
**Dateiname:** `a2-sort-2.md`

**Problem:** Die `id` weicht vom Dateinamen ab. `questions:verify` toleriert das möglicherweise, aber Lerner-App-Tooling, das aus Dateinamen IDs ableitet, wird inkonsistent.

**Fix:** Entweder
- Dateiname zu `a2-satz-sort-2.md` umbenennen, oder
- ID im Frontmatter zu `a2-sort-2` ändern.

---

## MAJOR

### M1 · Topic praktisch ungenutzt

**Bewertung:** Es gibt nur 2 freie Items im Ordner, **kein Generator** und kein Eintrag in den `TOPICS`-Tabellen der drei A2-Generatoren. Das Topic ist daher entweder:
- ein verlassener Prototyp;
- oder ein bewusstes „experimentelles" Topic ohne Premium-Items.

Beide A1-Dropbox-Beispiele bilden korrekt deutsche Sätze (`Morgen fahre ich mit dem Bus nach Berlin.`, `Heute gehe ich ins Kino.`). Inhaltlich sind sie A2-relevant (Wortstellung mit Zeitangabe in Position 1 → Subjekt in Position 3 nach finitem Verb).

**Fix-Vorschlag:**
- Entweder das Topic ausbauen (Generator + 50 Items, analog anderer Topics).
- Oder die zwei Items löschen / in `KONJUNKTIONENA2` integrieren.

### M2 · `a2-sort-1.md` hat ungewöhnliches `codes`-Feld

**Datei:** `src/questions/A2/SATZSTELLUNGA2/a2-sort-1.md`

```yaml
words: [Morgen, fahre, ich, mit, dem, Bus, nach, Berlin]
alternatives: [ich,fahre,Morgen,mit,dem,Bus,nach,Berlin]
codes: [T, _, _, M, M, M, L, L]
```

**Bewertung:** Das `codes`-Feld (T = Zeit, M = Mittel, L = Lokal) ist sonst nirgends im Repo zu finden. Vermutlich ein experimentelles Tagging für Lerner-App-Hinweise. Wenn der Renderer es nicht versteht, ist es totes Markup.

**Fix:** Prüfen, ob `apps-script/Code.gs` oder Frontend `codes` interpretiert. Wenn nicht: entfernen.

---

## MINOR

Keine.

---

## Geprüft & in Ordnung

- Beide Sätze sind grammatisch korrekt.
- Die `alternatives`-Schreibweise (Kommata-getrennt in Frontmatter) folgt dem Repo-Standard.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 1      | ID oder Dateiname angleichen |
| MAJOR       | 2      | Topic-Strategie klären |
| MINOR       | 0      | — |

**Empfehlung:** Vor Fix-Phase entscheiden:
- Wenn `SATZSTELLUNGA2` aktiv bleiben soll → Generator schreiben (Aufwand ~1 h), 50 Items in jedem Subtyp erzeugen.
- Sonst Topic in den Inventarscripten ignorieren oder löschen.
