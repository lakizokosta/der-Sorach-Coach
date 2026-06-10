#!/usr/bin/env node
/**
 * Generates B1 select-one questions (001–050) per Premium grammar topic.
 * Run: npm run questions:generate-b1
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { md } from './b1-select-one-shared.mjs';
import * as G from './b1-select-one-data.mjs';
import { verbFormHint } from './topic-context-hints.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions', 'B1');

const TOPICS = {
  ADJEKTIVDEKLINATIONB1: { prefix: 'b1-adj', gen: G.genAdjektivdeklinationB1 },
  AKKUSATIVB1: { prefix: 'b1-akk', gen: G.genAkkusativB1 },
  DEMONSTRATIVARTIKEL: { prefix: 'b1-demo', gen: G.genDemonstrativartikel },
  ERGÄNZUNGSSATZ: { prefix: 'b1-erg', gen: G.genErgaenzungssatz },
  FINALSATZ: { prefix: 'b1-fin', gen: G.genFinalsatz },
  INDIREKTEFRAGESÄTZE: { prefix: 'b1-indfr', gen: G.genIndirekteFragesaetze },
  KAUSALSATZ: { prefix: 'b1-kaus', gen: G.genKausalsatz },
  KONJUNKTIV2: { prefix: 'b1-k2', gen: G.genKonjunktiv2 },
  KONDITIONALSATZ: { prefix: 'b1-kond', gen: G.genKonditionalsatz },
  KONZESSIVSATZB1: { prefix: 'b1-konz', gen: G.genKonzessivsatzB1 },
  KONJUNKTIONALADVERBIEN: { prefix: 'b1-kadv', gen: G.genKonjunktionaladverbien },
  LOKALEPRÄPOSITIONENB1: { prefix: 'b1-lokal', gen: G.genLokalePraepositionenB1 },
  NOMENPRÄPOSITIONVERBINDUNGB1: { prefix: 'b1-npv', gen: G.genNomenPraepositionB1 },
  PASSIVB1: { prefix: 'b1-pass', gen: G.genPassivB1 },
  PERFEKTB1: { prefix: 'b1-perf', gen: G.genPerfektB1 },
  PRÄPOSITIONENGENITIVB1: { prefix: 'b1-gen', gen: G.genPraepositionenGenitivB1 },
  PRÄPOSITIONALERGÄNZUNG: { prefix: 'b1-praeg', gen: G.genPraepositionaleErgaenzung },
  PRÄPOSITIONALADVERBIEN: { prefix: 'b1-pradv', gen: G.genPraepositionaleAdverbien },
  POSSESSIVARTIKELB1: { prefix: 'b1-poss', gen: G.genPossessivartikelB1 },
  PRÄPOSITIONENB1: { prefix: 'b1-praep', gen: G.genPraepositionenB1 },
  RELATIVSATZB1: { prefix: 'b1-rel', gen: G.genRelativsatzB1 },
  TRENNBAREVERBENB1: { prefix: 'b1-trenn', gen: G.genTrennbareVerbenB1 },
  VERBPRÄPOSITIONVERBINDUNG: { prefix: 'b1-vpv', gen: G.genVerbPraeposition },
  VERNEINUNG: { prefix: 'b1-neg', gen: G.genVerneinung },
  VERBNOMENVERBINDUNGB1: { prefix: 'b1-vnv', gen: G.genVerbNomenVerbindungB1 },
  VERBLASSEN: { prefix: 'b1-lass', gen: G.genVerblassen },
  WORTSCHATZB1: { prefix: 'b1-ws', gen: G.genWortschatzB1 },
  SPRACHBAUSTEINEB1: { prefix: 'b1-sprach', gen: G.genSprachbausteineB1 },
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
    writeFileSync(file, md({ id: `${prefix}-${num}`, hint: verbFormHint(folder, '', q.correct, q.options), ...q }), 'utf8');
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
