#!/usr/bin/env node
/**
 * Generates B2 select-one questions (001–050) per Premium grammar topic.
 * Run: npm run questions:generate-b2
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { md } from './b2-select-one-shared.mjs';
import * as G from './b2-select-one-data.mjs';
import { genAkkusativDativobjektWordOrder } from './b2-obj-word-order-data.mjs';
import { verbFormHint } from './topic-context-hints.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'site', 'questions', 'B2');

const FORCE = process.argv.includes('--force');
const TOPIC_ARG = process.argv.find((a) => a.startsWith('--topic='))?.slice(8);

const TOPICS = {
  'AKKUSATIV&DATIVOBJEKT': { prefix: 'b2-obj', gen: G.genAkkusativDativobjekt },
  GENITIVB2: { prefix: 'b2-genit', gen: G.genGenitivB2 },
  FUTURI: { prefix: 'b2-fut', gen: G.genFuturI },
  KONSEKUTIVEKONJUNKTION: { prefix: 'b2-konsek', gen: G.genKonsekutiveKonjunktion },
  KONJUNKTIONALADVERBIEN: { prefix: 'b2-kadv', gen: G.genKonjunktionaladverbien },
  KONJUNKTIV2B2: { prefix: 'b2-konj2', gen: G.genKonjunktiv2B2 },
  KONZESSIVSATZB2: { prefix: 'b2-konz', gen: G.genKonzessivsatzB2 },
  LOKALEPRÄPOSITIONENB2: { prefix: 'b2-lokal', gen: G.genLokalePraepositionenB2 },
  MODALSATZ: { prefix: 'b2-modal', gen: G.genModalsatz },
  INDEFINITPRONOMEN: { prefix: 'b2-indef', gen: G.genIndefinitpronomen },
  INDIREKTEREDE: { prefix: 'b2-ired', gen: G.genIndirekteRede },
  PRÄPOSITIONENGENITIV: { prefix: 'b2-gen', gen: G.genPraepositionenGenitiv },
  PRÄPOSITIONALADVERBIENB2: { prefix: 'b2-pradv', gen: G.genPraepositionaleAdverbienB2 },
  PARTIZIP1: { prefix: 'b2-pt1', gen: G.genPartizip1 },
  PARTIZIP2: { prefix: 'b2-pt2', gen: G.genPartizip2 },
  PASSIVB2: { prefix: 'b2-pass', gen: G.genPassivB2 },
  PASSIVERSATZ: { prefix: 'b2-passv', gen: G.genPassiversatz },
  REDEWENDUNGEN: { prefix: 'b2-rede', gen: G.genRedewendungen },
  RELATIVSATZB2: { prefix: 'b2-rel', gen: G.genRelativsatzB2 },
  TEKAMOLO: { prefix: 'b2-tkml', gen: G.genTekamolo },
  TEMPORALERNEBENSATZ: { prefix: 'b2-temp', gen: G.genTemporaleNebensatz },
  QUIZ: { prefix: 'b2-quiz', gen: G.genQuiz },
  // SPRACHBAUSTEINEB2: exam format only — separate generator later
};

function writeTopic(folder, prefix, questions, { start = 1, count = 50 } = {}) {
  const dir = join(ROOT, folder);
  mkdirSync(dir, { recursive: true });
  let written = 0;
  for (let i = 0; i < count; i++) {
    const q = questions[i];
    if (!q) break;
    const num = String(start + i).padStart(3, '0');
    const file = join(dir, `${prefix}-${num}.md`);
    if (!FORCE && existsSync(file)) continue;
    const hint = q.hint || verbFormHint(folder, '', q.correct, q.options);
    writeFileSync(file, md({ id: `${prefix}-${num}`, hint, ...q }), 'utf8');
    written += 1;
  }
  return written;
}

let total = 0;
for (const [folder, { prefix, gen }] of Object.entries(TOPICS)) {
  if (TOPIC_ARG && folder !== TOPIC_ARG) continue;
  const qs = gen();
  const n = writeTopic(folder, prefix, qs);
  total += n;
  console.log(`${folder}: ${FORCE ? 'regen ' : '+'}${n} select-one`);
  if (folder === 'AKKUSATIV&DATIVOBJEKT') {
    const wo = genAkkusativDativobjektWordOrder();
    const n2 = writeTopic(folder, prefix, wo, { start: 51, count: 25 });
    total += n2;
    console.log(`${folder} (Wortstellung): ${FORCE ? 'regen ' : '+'}${n2} select-one`);
  }
}
console.log(`\nTotal ${FORCE ? 'regenerated' : 'new'} files: ${total}`);
