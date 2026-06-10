#!/usr/bin/env node
/**
 * Audits dropbox word banks: duplicate chips and implausibly short sentences.
 * Run: npm run questions:audit-dropbox
 */

import * as A1D1 from './a1-dropbox-data.mjs';
import * as A1D2 from './a1-dropbox-data-2.mjs';
import * as A1D3 from './a1-dropbox-data-3.mjs';
import { BANK as B1_BANK } from './b1-dropbox-data.mjs';
import { BANK as A2_BANK } from './a2-dropbox-data.mjs';
import { BANK as B2_BANK } from './b2-dropbox-data.mjs';
import { assertUnique } from './b1-dropbox-shared.mjs';

const A1_BANK = {
  POSSESSIVARTIKEL: A1D1.POSSESSIVARTIKEL,
  PLURAL: A1D1.PLURAL,
  VERBKONJUGATION: A1D1.VERBKONJUGATION,
  ADJEKTIVDEKLINATIONA1: A1D2.ADJEKTIVDEKLINATIONA1,
  WECHSELPRÄPOSITIONEN: A1D2.WECHSELPRÄPOSITIONEN,
  DATIVA1: A1D3.DATIVA1,
  AKKUSATIVA1: A1D3.AKKUSATIVA1,
  ARTIKEL: A1D3.ARTIKEL,
  'W-FRAGEN': A1D3.W_FRAGEN,
  NEGATION: A1D3.NEGATION,
  GEGENTEILE: A1D3.GEGENTEILE,
};

/** @type {{ level: string, topic: string, hint: string, sentence: string, issue: string }[]} */
const issues = [];

/** @param {string} level @param {Record<string, { hint: string, words: string[] }[]>} bank */
function auditBank(level, bank) {
  for (const [topic, items] of Object.entries(bank)) {
    const seenHints = new Set();
    for (const item of items) {
      if (seenHints.has(item.hint)) continue;
      seenHints.add(item.hint);

      const sentence = item.words.join(' ');
      if (item.words.length < 3) {
        issues.push({ level, topic, hint: item.hint, sentence, issue: 'too few words' });
        continue;
      }
      try {
        assertUnique(item.words, `${level}/${topic}`);
      } catch (e) {
        issues.push({ level, topic, hint: item.hint, sentence, issue: e.message });
      }
    }
  }
}

for (const [level, bank] of [
  ['A1', A1_BANK],
  ['A2', A2_BANK],
  ['B1', B1_BANK],
  ['B2', B2_BANK],
]) {
  auditBank(level, bank);
}

if (!issues.length) {
  console.log('Dropbox audit OK — no duplicate chips or broken templates found.');
  process.exit(0);
}

console.log(`Found ${issues.length} dropbox issue(s):\n`);
for (const i of issues) {
  console.log(`[${i.level}/${i.topic}] ${i.hint}`);
  console.log(`  ${i.sentence}`);
  console.log(`  → ${i.issue}\n`);
}
process.exit(1);
