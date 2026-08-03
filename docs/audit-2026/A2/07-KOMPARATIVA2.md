# A2 · 07 — KOMPARATIVA2 (Audit 2026)

**Geprüfte Dateien:** 150 (50 select-one + 50 input-text + 50 dropbox)
**Quellen:**
- `scripts/generate-a2-select-one.mjs` → `genKomparativ()` (Zeilen 182–220)
- `scripts/a2-input-text-data.mjs` → `BANK.KOMPARATIVA2` (Zeilen 129–147)
- `scripts/a2-dropbox-data.mjs` → `BANK.KOMPARATIVA2` (Zeilen 129–147)

---

## CRITICAL

Keine.

---

## MAJOR

Keine.

---

## MINOR

### m1 · Item 16 input-text vs. dropbox semantisch divergent

**Quellen:**
- input-text `:145`: `Am schönsten finde ich den Teppich — er ist ___ als der Tisch. (schön)` → `schöner`
- dropbox `:145`: `[Am, schönsten, finde, ich, den, Teppich, er, ist, schöner, als, der, Tisch]`

**Bewertung:** Beide Varianten korrekt. Im Dropbox-Item fehlt aber das Bindezeichen (Gedankenstrich) zwischen den beiden Sätzen; aus den Wörtern lassen sich grammatisch gleich gültige aber zwei verschiedene Sätze bauen.

### m2 · Item 17 input-text vs. dropbox divergent

**Quellen:**
- input-text `:146`: `Trotzdem habe ich gewonnen — ich war ___ als mein Gegner. (stark)` → `stärker`
- dropbox `:146`: `[Trotzdem, gewann, ich, als, stärkerer, Sportler]` → ganz andere Konstruktion mit attributivem Komparativ

**Bewertung:** Beide grammatisch ok. Die Diskrepanz ist aber irritierend, wenn ein Lerner zwischen den Formaten wechselt.

### m3 · Komparativ-Pool enthält Stamm-Form

**Quelle:** select-one `:184–198`
**Beispiel:** Korrekt `größer`, Pool `['große', 'am groß', 'mehr groß', 'großer']`.

**Bewertung:** `*am groß` und `*mehr groß` sind Phantasieformen — fair als typische Lernerfehler. `großer` (mit `r` ohne Umlaut) ist allerdings die attributive Form des Positivs (z. B. „großer Vater"), die Verwechslung mit dem Komparativ ist realistisch. Pool OK, leicht harsch.

---

## Geprüft & in Ordnung

- Alle 15 Komparativ-Paare korrekt (`größer, besser, mehr, schneller, älter, jünger, teurer, billiger, höher, näher, lieber, schöner, kälter, wärmer, länger`).
- Unregelmäßige Komparative (`besser, mehr, lieber, höher, näher`) inklusive.
- Vergleichsstruktur mit `als` korrekt benutzt.
- Adverbiale Verwendung (`schneller laufen`, `lieber trinken`) korrekt von attributiver Form unterschieden.

---

## Zusammenfassung

| Schweregrad | Anzahl | Geschätzter Aufwand |
|-------------|--------|---------------------|
| CRITICAL    | 0      | — |
| MAJOR       | 0      | — |
| MINOR       | 3      | Optional |

**Empfehlung:** Topic ist sauber. Keine Korrektur nötig.
