# A1 · 02 — PLURAL (Audit 2026)

**Geprüfte Dateien:** 151 (4 frei + 1 multi-select + 45 select-one + 50 input-text + 50 dropbox + 1 input-text frei)
**Quellen:**
- `scripts/generate-a1-select-one.mjs` → `genPlural()` (Z.169–249)
- `scripts/generate-a1-input-text.mjs` → `BANK.PLURAL` (Z.127–179)
- `scripts/a1-dropbox-data.mjs` → `PLURAL` (Z.57–108)

---

## CRITICAL

_Keine kritischen Fehler gefunden._

---

## MAJOR

### M1 · Plural „die Tomate" sollte „die Tomaten" sein — Bank Z.214 inkonsistent

**Datei:** `a1-pl-049.md` (oder zyklisch entsprechende) — abhängig von `pairs[40]`
**Quelle:** `generate-a1-select-one.mjs` Z.214

```
['die Tomate', 'die Tomaten', ['die Tomat', 'die Tomates', 'die Tomatens']]
```

**Bewertung:** Eintrag korrekt — `die Tomate (Sg.)` → `die Tomaten (Pl.)`. **Kein Bug** — irrtümlich zunächst markiert.

→ **Wird im Bericht NICHT mehr gelistet (Fehlalarm bei Erstprüfung).**

### M2 · Inkonsistente Anführungszeichen in Free-Items

**Dateien:** `a1-pl-1.md` verwendet ASCII `"..."`, alle anderen (`a1-pl-2.md`, `…-3`, `…-006…050`) verwenden deutsche Anführungszeichen `„...""`.

**Bewertung:** Kosmetisch, aber inkonsistent — sollte einheitlich `„..."` sein.

**Fix:** `src/questions/A1/PLURAL/a1-pl-1.md` Z.12: `"das Kind"` → `„das Kind"`.

---

## MINOR

### m1 · Multi-Select `a1-multi-1.md` — `das Buch` und `die Lampe` als Distraktoren

**Datei:** `src/questions/A1/PLURAL/a1-multi-1.md`

**Bewertung:** Item korrekt — `das Buch` und `die Lampe` sind Sg. und werden als nicht-Plural-Distraktoren angeboten. Inhaltlich ok, aber sehr offensichtlich (jeder erkennt den Plural an `die … -er/-en/-s`). Für A1 dennoch passend.

### m2 · BANK.PLURAL Z.176 — „Sportart" als Pluralthema

**Datei:** `a1-pl-in-048.md`
**Prompt:** „[Sport] Im Verein machen wir verschiedene ___. (Plural: Sportart)" → `Sportarten`

**Bewertung:** Wort `Sportart` ist eher A2-Vokabular. Für A1 vertretbar im Kontext.

### m3 · Distraktoren mit absichtlich falscher Form

Distraktoren wie `die Manns`, `die Kindern`, `die Buchs` etc. sind absichtlich falsch konstruiert. Das ist methodisch sinnvoll, allerdings besteht das Risiko, dass Lernende sich die falsche Form unbewusst merken. A1-Standard und vertretbar.

---

## Geprüft & in Ordnung

- **Select-One Z.172–215** (45 Premium-Paare) — alle Plurale grammatisch korrekt: Umlaute (`Männer, Bücher, Äpfel, Städte, Bäume, Züge, Hände, Gläser, Tomaten, Salate`), Endungen (`-er, -en, -e, -s`), Sonderfälle (`Pizzen, Museen, Computer (Nullplural)`).
- **Free Items `a1-pl-1` … `a1-pl-3`** — alle Plurale korrekt.
- **Input-Text-Frei `a1-pl-4.md`** — „In Europa gibt es viele alte Städte." korrekt.
- **Input-Text-Premium** Items 1–50 — alle Plurale korrekt zur Sg.-Form passend.
- **Dropbox** Items 1–50 — alle 50 Sätze grammatisch korrekt, eindeutige Wortstellung.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 0      | — |
| MAJOR       | 1      | 1 Datei: Anführungszeichen vereinheitlichen |
| MINOR       | 3      | Optional |

**Empfehlung:** PLURAL ist die sauberste Themengruppe im A1. Nur kosmetischer Fix nötig.
