#!/usr/bin/env node
/**
 * Generates A2 select-one questions (001–050) per Premium grammar topic.
 * Run: npm run questions:generate-a2
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { md } from './a2-select-one-shared.mjs';
import * as G from './a2-select-one-data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions', 'A2');

const TOPICS = {
  ANTWORTPARTIKELN: { prefix: 'a2-part', gen: G.genAntwortpartikeln },
  KONJUNKTIONENA2: { prefix: 'a2-konj', gen: G.genKonjunktionen },
  PERFEKTA2: { prefix: 'a2-perf', gen: G.genPerfekt },
  PRÄTERITUMA2: { prefix: 'a2-prät', gen: G.genPraeteritum },
  MODALVERBENA2: { prefix: 'a2-modal', gen: G.genModalverben },
  REFLEXIVPRONOMEN: { prefix: 'a2-refl', gen: G.genReflexiv },
  KOMPARATIVA2: { prefix: 'a2-komp', gen: G.genKomparativ },
  SUPERLATIVA2: { prefix: 'a2-sup', gen: G.genSuperlativ },
  WECHSELPRÄPOSITIONENA2: { prefix: 'a2-wech', gen: G.genWechsel },
  DATIVA2: { prefix: 'a2-dat', gen: G.genDativ },
  AKKUSATIVA2: { prefix: 'a2-akk', gen: G.genAkkusativ },
  FESTEPRÄPOSITIONENA2: { prefix: 'a2-fest', gen: G.genFestePraep },
  ADJEKTIVDEKLINATIONA2: { prefix: 'a2-adj', gen: G.genAdjDekl },
  POSSESSIVARTIKELA2: { prefix: 'a2-poss', gen: G.genPossessiv },
  GENITIVA2: { prefix: 'a2-gen', gen: G.genGenitiv },
  INDEFINITPRONOMEN: { prefix: 'a2-ind', gen: G.genIndefinit },
  NOMENPRÄPOSITIONVERBINDUNGA2: { prefix: 'a2-npv', gen: G.genNomenPraep },
  TRENNBAREVERBEN: { prefix: 'a2-trenn', gen: G.genTrennbar },
  TEMPORALSATZ: { prefix: 'a2-temp', gen: G.genTemporal },
  LOKALPRÄPOSITIONENA2: { prefix: 'a2-lokal', gen: G.genLokal },
  'N-DEKLINATION': { prefix: 'a2-n', gen: G.genNdekl },
};

function writeTopic(folder, prefix, questions) {
  const dir = join(ROOT, folder);
  mkdirSync(dir, { recursive: true });
  let written = 0;
  for (let i = 1; i <= 50; i++) {
    const q = questions[i - 1];
    if (!q) break;
    const num = String(i).padStart(3, '0');
    const file = join(dir, `${prefix}-${num}.md`);
    if (existsSync(file)) continue;
    writeFileSync(file, md({ id: `${prefix}-${num}`, ...q }), 'utf8');
    written += 1;
  }
  return written;
}

let total = 0;
for (const [folder, { prefix, gen }] of Object.entries(TOPICS)) {
  const qs = gen();
  const n = writeTopic(folder, prefix, qs);
  total += n;
  console.log(`${folder}: +${n} select-one`);
}
console.log(`\nTotal new files: ${total}`);
