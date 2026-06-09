#!/usr/bin/env node
/**
 * Generates A2 dropbox questions (dd-001 … dd-050) per Premium grammar topic.
 * Run: npm run questions:generate-a2-dropbox
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { md, assertUnique } from './a2-dropbox-shared.mjs';
import { BANK } from './a2-dropbox-data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions', 'A2');

const TOPICS = {
  ANTWORTPARTIKELN: 'a2-part-dd',
  KONJUNKTIONENA2: 'a2-konj-dd',
  PERFEKTA2: 'a2-perf-dd',
  PRÄTERITUMA2: 'a2-prät-dd',
  MODALVERBENA2: 'a2-modal-dd',
  REFLEXIVPRONOMEN: 'a2-refl-dd',
  KOMPARATIVA2: 'a2-komp-dd',
  SUPERLATIVA2: 'a2-sup-dd',
  WECHSELPRÄPOSITIONENA2: 'a2-wech-dd',
  DATIVA2: 'a2-dat-dd',
  AKKUSATIVA2: 'a2-akk-dd',
  FESTEPRÄPOSITIONENA2: 'a2-fest-dd',
  ADJEKTIVDEKLINATIONA2: 'a2-adj-dd',
  POSSESSIVARTIKELA2: 'a2-poss-dd',
  GENITIVA2: 'a2-gen-dd',
  INDEFINITPRONOMEN: 'a2-ind-dd',
  NOMENPRÄPOSITIONVERBINDUNGA2: 'a2-npv-dd',
  TRENNBAREVERBEN: 'a2-trenn-dd',
  TEMPORALSATZ: 'a2-temp-dd',
  LOKALPRÄPOSITIONENA2: 'a2-lokal-dd',
  'N-DEKLINATION': 'a2-n-dd',
};

let total = 0;
const errors = [];

for (const [folder, prefix] of Object.entries(TOPICS)) {
  const bank = BANK[folder];
  if (!bank) throw new Error(`Missing bank for ${folder}`);
  mkdirSync(join(ROOT, folder), { recursive: true });
  let n = 0;
  bank.slice(0, 50).forEach((item, i) => {
    const num = String(i + 1).padStart(3, '0');
    const path = join(ROOT, folder, `${prefix}-${num}.md`);
    if (existsSync(path)) return;
    try {
      assertUnique(item.words, `${folder} #${i + 1}`);
    } catch (e) {
      errors.push(e.message);
      return;
    }
    const prompt = `Ordne die Wörter zum richtigen Satz: (${item.hint})`;
    writeFileSync(path, md(`${prefix}-${num}`, prompt, item.words), 'utf8');
    n += 1;
    total += 1;
  });
  console.log(`${folder}: +${n}`);
}

if (errors.length) {
  console.error('\nSkipped due to duplicate words:');
  errors.forEach((e) => console.error(`  ${e}`));
}
console.log(`\nTotal new dropbox files: ${total}`);
if (errors.length) process.exit(1);
