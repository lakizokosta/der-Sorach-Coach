# A1 · 05 — WECHSELPRÄPOSITIONEN (Audit 2026)

**Geprüfte Dateien:** 150 (5 frei + 45 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a1-select-one.mjs` → `genWechsel()` (Z.354–391)
- `scripts/generate-a1-input-text.mjs` → `BANK.WECHSELPRÄPOSITIONEN` (Z.287–338)
- `scripts/a1-dropbox-data-2.mjs` → `WECHSELPRÄPOSITIONEN` (Z.57–109)

---

## CRITICAL

### C1 · Dropbox — fehlendes Subjekt im Satz „Bei Regen gehe ins Haus"

**Datei:** `src/questions/A1/WECHSELPRÄPOSITIONEN/a1-wech-dd-011.md`
**Quelle:** `a1-dropbox-data-2.mjs` Z.68

```
hint:  „Wechselpräp. — ins Haus (Bewegung)"
words: ['Bei', 'Regen', 'gehe', 'ins', 'Haus']
```

**Problem:** Subjekt fehlt — „Bei Regen gehe ins Haus" ist kein vollständiger deutscher Satz. Imperativ wäre „Geh ins Haus", aber dann passt das Verb `gehe` (1 Sg.) nicht. Korrekt wäre „Bei Regen gehe **ich** ins Haus".

**Fix:** `words: ['Bei', 'Regen', 'gehe', 'ich', 'ins', 'Haus']`.

### C2 · Input-Text BANK Z.299 — gleiches Problem

**Datei:** `a1-wech-in-012.md`
**Quelle:** `generate-a1-input-text.mjs` Z.299

```
'[Wetter] Bei Gewitter gehe ich ___ Haus. (in + das, Bewegung)', 'ins'
```

**Bewertung:** ✓ korrekt (mit „ich"). **Kein Bug** — Input-Text-Variante hat das Subjekt drin. Nur Dropbox-Variante (C1) ist fehlerhaft.

→ C2 wird gestrichen.

---

## MAJOR

### M1 · Select-One Z.358–359: „Buch" doppelt im Prompt (Item-Paar Tisch)

**Quelle:** `generate-a1-select-one.mjs` Z.358–359

```js
{ sent: 'Ich lege das Buch ___ Tisch.', move: true, ... },
{ sent: 'Das Buch liegt ___ Tisch.', move: false, ... },
```

**Bewertung:** ✓ korrekt — keine Verdopplung. Lediglich Erwähnung der Items.

→ M1 gestrichen.

### M2 · Dropbox Z.91 — „Geh schnell in den Keller" — Imperativ mehrdeutig

**Datei:** `a1-wech-dd-035.md` (Bank Z.91)
**Words:** `['Geh', 'schnell', 'in', 'den', 'Keller']`

**Problem:** Zwei zulässige Reihenfolgen:
- „Geh schnell in den Keller." ✓
- „Geh in den Keller schnell." (stilistisch holprig, aber grammatisch erlaubt)

Lernende könnten je nach Variante eine korrekt setzen, Validierung akzeptiert aber nur eine.

**Fix-Vorschlag:** Adverb ans Satzende verschieben oder durch Zeitangabe ersetzen, z. B. `['Geh', 'sofort', 'in', 'den', 'Keller']`.

### M3 · Select-One Z.370 — Subjekt „Wir" mit Verb „steigen" + `in den Bus` redundant zu Z.365

**Datei:** Items Z.364 + Z.370 sind grob synonym (Wir fahren auf die Straße / Wir steigen in den Bus). Beide Bewegung, ähnliche Struktur.

**Bewertung:** Inhaltliche Doppelung, keine Fehlerhaftigkeit. Vertretbar bei nur 15 Schablonen, da Vielfalt nötig ist.

---

## MINOR

### m1 · Free-Items Z.1–5 mit Hinweis „(Dativ oder Akkusativ)"

**Dateien:** `a1-wech-1.md` … `a1-wech-5.md`

**Bewertung:** Hinweis ist sehr knapp, gibt nichts über Bewegung/Ort her. Lernender muss aus dem Verb ableiten (gehen → Bewegung, sein → Ort). Pädagogisch gut, aber sehr offen formuliert.

### m2 · `aufs`, `ins`, `im`, `am`-Kontraktionen — pädagogisch erklärt?

In Bank/Items werden Kontraktionen `aufs, ins, im, am` als Optionen geboten (z. B. Z.314 `aufs Land`). Lernende müssen Kontraktionen erkennen und unterscheiden. Für A1 angemessen, aber Lerner ohne Vorwissen brauchen ggf. eine Einführung.

---

## Geprüft & in Ordnung

- **Select-One Z.355–371** (15 Schablonen) — alle Items grammatisch korrekt, Bewegung/Ort-Logik sauber differenziert.
- **Input-Text** Items 1–50 — alle Antworten korrekt zur Hint-Spezifikation (`ins, im, auf den, auf dem, in den, in der, an die, an der, auf die, auf der, aufs` etc.).
- **Dropbox** Items 1–50 — bis auf C1 alle Sätze grammatisch korrekt, Wortstellung eindeutig.
- **Kasusverteilung**: 50/50 Akk./Dat. ausgewogen.
- **Verben mit Wechselpräp.**: alle 50 korrekt klassifiziert (gehen, fahren, fliegen, steigen, springen, laufen, kommen = Bewegung; sein, liegen, sitzen, stehen, hängen, wandern, arbeiten = Ort).

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 1      | 1 Bank-Edit (Subjekt einfügen) + Regen 1 Datei |
| MAJOR       | 1      | 1 Bank-Edit (Wortstellung-Eindeutigkeit) |
| MINOR       | 2      | Optional |
