#!/usr/bin/env node
/**
 * Generate Beim Arzt draft questions + merge new lemmas into vocabulary.json
 *
 * Usage: node scripts/generate-beim-arzt-drafts.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { a2Questions } from './beim-arzt/a2.mjs';
import { b1Questions } from './beim-arzt/b1.mjs';
import { b2Questions } from './beim-arzt/b2.mjs';
import { newVocabEntries } from './beim-arzt/vocab.mjs';
import { renderQuestion } from './beim-arzt/emit.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outRoot = path.join(root, 'docs/new-questions/beim-arzt');

const TYPE_DIR = {
  'select-one': 'select-one',
  'multi-select': 'multi-select',
  dropbox: 'dropbox',
  'input-text': 'input-text',
  'text-gaps': 'text-gaps',
};

function levelOf(id) {
  if (id.startsWith('a2-')) return 'A2';
  if (id.startsWith('b1-')) return 'B1';
  if (id.startsWith('b2-')) return 'B2';
  throw new Error(`Unknown level for id ${id}`);
}

function validate(q) {
  const errors = [];
  if (!q.id || !q.type || !q.body) errors.push('missing id/type/body');
  if (q.type === 'select-one') {
    if (!q.options?.length || !q.options.includes(q.correct)) errors.push('select-one correct∉options');
  }
  if (q.type === 'multi-select') {
    if (!q.options?.length || !q.correct?.length) errors.push('multi-select incomplete');
    for (const c of q.correct || []) {
      if (!q.options.includes(c)) errors.push(`multi-select correct missing: ${c}`);
    }
  }
  if (q.type === 'dropbox') {
    if (!q.words || q.words.length < 2) errors.push('dropbox words');
  }
  if (q.type === 'input-text') {
    const corrects = Array.isArray(q.correct) ? q.correct : [q.correct];
    if (!corrects.length) errors.push('input-text correct');
  }
  if (q.type === 'text-gaps') {
    const gaps = (q.body.match(/___/g) || []).length;
    if (gaps !== q.correct.length) errors.push(`text-gaps gap count ${gaps}≠${q.correct.length}`);
    if (gaps !== q.options.length) errors.push(`text-gaps options count`);
    q.options.forEach((row, i) => {
      const parts = String(row).split(',');
      if (parts.length !== 3) errors.push(`text-gaps options[${i}] need 3`);
      if (!parts.includes(q.correct[i])) errors.push(`text-gaps correct[${i}]∉options`);
    });
  }
  return errors;
}

function writeReadme(counts) {
  const readme = `# Beim Arzt — Wortschatztraining (Entwurf)

**Правила авторства:** [../AUTHORING.md](../AUTHORING.md) (§4.1 дистракторы — A2/B1/B2)

**Status:** Entwurf zur manuellen Prüfung — noch **nicht** im Fragenbank (\`src/site/questions-vocab/\`).

**Thema:** Beim Arzt  
**Niveaus:** A2 · B1 · B2  
**Register:** formell (Sie)  
**Hints / Aufgabentexte:** Deutsch  
**Дистракторы:** только тема здоровье/врач/больница; один верный ответ в щели  

## Umfang

| Niveau | select-one | multi-select | dropbox | input-text | text-gaps | Summe |
|--------|------------|--------------|---------|------------|-----------|-------|
| A2 | ${counts.A2['select-one']} | ${counts.A2['multi-select']} | ${counts.A2.dropbox} | ${counts.A2['input-text']} | ${counts.A2['text-gaps']} | ${counts.A2.total} |
| B1 | ${counts.B1['select-one']} | ${counts.B1['multi-select']} | ${counts.B1.dropbox} | ${counts.B1['input-text']} | ${counts.B1['text-gaps']} | ${counts.B1.total} |
| B2 | ${counts.B2['select-one']} | ${counts.B2['multi-select']} | ${counts.B2.dropbox} | ${counts.B2['input-text']} | ${counts.B2['text-gaps']} | ${counts.B2.total} |
| **Gesamt** | | | | | | **${counts.grand}** |

## Lexik-Fokus

| Niveau | Fokus |
|--------|--------|
| A2 | Symptome (einfach), Termin, Rezeption, Rezept, Apotheke, Medikamente |
| B1 | Untersuchung, Überweisung, Krankschreibung, Nebenwirkung, Schmerzqualität, Facharzt |
| B2 | Anamnese, Befund, Diagnose, ambulant/stationär, Notaufnahme, Wechselwirkung, Indikation |

## Prüfung

1. Datei öffnen → Satz, Hint, Antwort, Distraktoren prüfen.
2. Typische Fehler notieren (Genus, Kollokation, uneindeutige Lücke, zu leichter Distraktor).
3. Nach Freigabe: nach \`src/site/questions-vocab/<LEVEL>/BEIM_ARZT/\` übertragen und in \`vocabularySets.js\` registrieren.

## Regenerieren

\`\`\`bash
node scripts/generate-beim-arzt-drafts.mjs
\`\`\`

Neue Lemmata werden in \`src/site/data/vocabulary.json\` ergänzt (bestehende Einträge nicht überschrieben, außer fehlende \`ru\`/\`en\`/\`gender\`).
`;
  fs.writeFileSync(path.join(outRoot, 'README.md'), readme, 'utf8');
}

function mergeVocabulary() {
  const vocabPath = path.join(root, 'src/site/data/vocabulary.json');
  const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
  let added = 0;
  let enriched = 0;
  for (const [lemma, entry] of Object.entries(newVocabEntries)) {
    const key = lemma.toLowerCase();
    if (!vocab[key]) {
      vocab[key] = entry;
      added += 1;
      continue;
    }
    const cur = vocab[key];
    let changed = false;
    for (const field of ['pos', 'ru', 'en', 'gender']) {
      if (entry[field] && !cur[field]) {
        cur[field] = entry[field];
        changed = true;
      }
    }
    if (changed) enriched += 1;
  }
  const sorted = Object.fromEntries(
    Object.entries(vocab).sort(([a], [b]) => a.localeCompare(b, 'de')),
  );
  fs.writeFileSync(vocabPath, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');
  return { added, enriched };
}

function main() {
  const all = [...a2Questions, ...b1Questions, ...b2Questions];
  const counts = {
    A2: { 'select-one': 0, 'multi-select': 0, dropbox: 0, 'input-text': 0, 'text-gaps': 0, total: 0 },
    B1: { 'select-one': 0, 'multi-select': 0, dropbox: 0, 'input-text': 0, 'text-gaps': 0, total: 0 },
    B2: { 'select-one': 0, 'multi-select': 0, dropbox: 0, 'input-text': 0, 'text-gaps': 0, total: 0 },
    grand: 0,
  };

  // clean previous md drafts (keep README rewritten)
  for (const level of ['A2', 'B1', 'B2']) {
    for (const type of Object.values(TYPE_DIR)) {
      const dir = path.join(outRoot, level, type);
      fs.mkdirSync(dir, { recursive: true });
      for (const f of fs.readdirSync(dir)) {
        if (f.endsWith('.md')) fs.unlinkSync(path.join(dir, f));
      }
    }
  }

  const failures = [];
  for (const q of all) {
    const errs = validate(q);
    if (errs.length) {
      failures.push(`${q.id}: ${errs.join('; ')}`);
      continue;
    }
    const level = levelOf(q.id);
    const dir = path.join(outRoot, level, TYPE_DIR[q.type]);
    const file = path.join(dir, `${q.id}.md`);
    fs.writeFileSync(file, renderQuestion(q), 'utf8');
    counts[level][q.type] += 1;
    counts[level].total += 1;
    counts.grand += 1;
  }

  if (failures.length) {
    console.error('Validation failed:');
    for (const f of failures) console.error(' -', f);
    process.exit(1);
  }

  writeReadme(counts);
  const vocabStats = mergeVocabulary();

  console.log(`Wrote ${counts.grand} draft questions → ${outRoot}`);
  console.log(`Vocabulary: +${vocabStats.added} new, ${vocabStats.enriched} enriched`);
  for (const level of ['A2', 'B1', 'B2']) {
    console.log(`  ${level}: ${counts[level].total}`);
  }
}

main();
