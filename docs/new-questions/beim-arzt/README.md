# Beim Arzt — Wortschatztraining (Entwurf)

**Правила авторства:** [../AUTHORING.md](../AUTHORING.md) (§4.1 дистракторы — A2/B1/B2)

**Status:** Entwurf zur manuellen Prüfung — noch **nicht** im Fragenbank (`src/questions-vocab/`).

**Thema:** Beim Arzt  
**Niveaus:** A2 · B1 · B2  
**Register:** formell (Sie)  
**Hints / Aufgabentexte:** Deutsch  
**Дистракторы:** только тема здоровье/врач/больница; один верный ответ в щели  

## Umfang

| Niveau | select-one | multi-select | dropbox | input-text | text-gaps | Summe |
|--------|------------|--------------|---------|------------|-----------|-------|
| A2 | 20 | 20 | 20 | 20 | 20 | 100 |
| B1 | 20 | 20 | 20 | 20 | 20 | 100 |
| B2 | 20 | 20 | 20 | 20 | 20 | 100 |
| **Gesamt** | | | | | | **300** |

## Lexik-Fokus

| Niveau | Fokus |
|--------|--------|
| A2 | Symptome (einfach), Termin, Rezeption, Rezept, Apotheke, Medikamente |
| B1 | Untersuchung, Überweisung, Krankschreibung, Nebenwirkung, Schmerzqualität, Facharzt |
| B2 | Anamnese, Befund, Diagnose, ambulant/stationär, Notaufnahme, Wechselwirkung, Indikation |

## Prüfung

1. Datei öffnen → Satz, Hint, Antwort, Distraktoren prüfen.
2. Typische Fehler notieren (Genus, Kollokation, uneindeutige Lücke, zu leichter Distraktor).
3. Nach Freigabe: nach `src/questions-vocab/<LEVEL>/BEIM_ARZT/` übertragen und in `vocabularySets.js` registrieren.

## Regenerieren

```bash
node scripts/generate-beim-arzt-drafts.mjs
```

Neue Lemmata werden in `src/data/vocabulary.json` ergänzt (bestehende Einträge nicht überschrieben, außer fehlende `ru`/`en`/`gender`).
