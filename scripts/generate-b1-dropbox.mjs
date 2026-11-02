#!/usr/bin/env node
/**
 * Generates B1 dropbox questions (dd-001 … dd-050) per Premium grammar topic.
 * Run: npm run questions:generate-b1-dropbox
 * Restore: node scripts/generate-b1-dropbox.mjs --restore --topic=KONDITIONALSATZ
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { md, assertUnique } from './b1-dropbox-shared.mjs';
import { BANK } from './b1-dropbox-data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'site', 'questions', 'B1');

const TOPICS = {
  ADJEKTIVDEKLINATIONB1: 'b1-adj-dd',
  AKKUSATIVB1: 'b1-akk-dd',
  DEMONSTRATIVARTIKEL: 'b1-demo-dd',
  ERGÄNZUNGSSATZ: 'b1-erg-dd',
  FINALSATZ: 'b1-fin-dd',
  INDIREKTEFRAGESÄTZE: 'b1-indfr-dd',
  KAUSALSATZ: 'b1-kaus-dd',
  KONJUNKTIV2: 'b1-k2-dd',
  KONDITIONALSATZ: 'b1-kond-dd',
  KONZESSIVSATZB1: 'b1-konz-dd',
  KONJUNKTIONALADVERBIEN: 'b1-kadv-dd',
  LOKALEPRÄPOSITIONENB1: 'b1-lokal-dd',
  NOMENPRÄPOSITIONVERBINDUNGB1: 'b1-npv-dd',
  PASSIVB1: 'b1-pass-dd',
  PERFEKTB1: 'b1-perf-dd',
  PRÄPOSITIONENGENITIVB1: 'b1-gen-dd',
  PRÄPOSITIONALERGÄNZUNG: 'b1-praeg-dd',
  PRÄPOSITIONALADVERBIEN: 'b1-pradv-dd',
  POSSESSIVARTIKELB1: 'b1-poss-dd',
  PRÄPOSITIONENB1: 'b1-praep-dd',
  RELATIVSATZB1: 'b1-rel-dd',
  TRENNBAREVERBENB1: 'b1-trenn-dd',
  VERNEINUNG: 'b1-neg-dd',
  VERBNOMENVERBINDUNGB1: 'b1-vnv-dd',
  VERBLASSEN: 'b1-lass-dd',
  WORTSCHATZB1: 'b1-ws-dd',
};

function writeItem(folder, prefix, num, item) {
  const path = join(ROOT, folder, `${prefix}-${num}.md`);
  if (!item.allowDuplicateWords) assertUnique(item.words, `${folder} #${num}`);
  const prompt = `Ordne die Wörter zum richtigen Satz: (${item.hint})`;
  writeFileSync(path, md(`${prefix}-${num}`, prompt, item.words, item.alternatives, item.commas, item.hint), 'utf8');
}

function restoreTopic(topicKey) {
  const prefix = TOPICS[topicKey];
  const bank = BANK[topicKey];
  if (!prefix || !bank) return 0;
  mkdirSync(join(ROOT, topicKey), { recursive: true });
  let n = 0;
  bank.slice(0, 50).forEach((item, i) => {
    const num = String(i + 1).padStart(3, '0');
    const path = join(ROOT, topicKey, `${prefix}-${num}.md`);
    if (!existsSync(path)) return;
    writeItem(topicKey, prefix, num, item);
    n += 1;
  });
  return n;
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  const FORCE = process.argv.includes('--force');
  const TOPIC_ARG = process.argv.find((a) => a.startsWith('--topic='))?.slice(8);

  if (process.argv.includes('--restore')) {
    const topic = TOPIC_ARG || 'KONDITIONALSATZ';
    const n = restoreTopic(topic);
    console.log(`Restored ${n} ${topic} dropbox files.`);
    process.exit(0);
  }

  let total = 0;
  const errors = [];

  for (const [folder, prefix] of Object.entries(TOPICS)) {
    if (TOPIC_ARG && folder !== TOPIC_ARG) continue;
    const bank = BANK[folder];
    if (!bank) throw new Error(`Missing bank for ${folder}`);
    mkdirSync(join(ROOT, folder), { recursive: true });
    let n = 0;
    bank.slice(0, 50).forEach((item, i) => {
      const num = String(i + 1).padStart(3, '0');
      const path = join(ROOT, folder, `${prefix}-${num}.md`);
      if (!FORCE && existsSync(path)) return;
      try {
        writeItem(folder, prefix, num, item);
        n += 1;
        total += 1;
      } catch (e) {
        errors.push(e.message);
      }
    });
    console.log(`${folder}: ${FORCE ? 'regen' : '+'}${n}`);
  }

  if (errors.length) {
    console.error('\nSkipped due to duplicate words:');
    errors.forEach((e) => console.error(`  ${e}`));
    process.exit(1);
  }
  console.log(`\nTotal ${FORCE ? 'regenerated' : 'new'} dropbox files: ${total}`);
}

export { restoreTopic };
