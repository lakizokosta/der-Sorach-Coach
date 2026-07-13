#!/usr/bin/env node
/**
 * Generates B2 input-text questions (in-001 … in-050).
 * Run: npm run questions:generate-b2-input
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { md } from './b1-input-text-shared.mjs';
import { getBank, INPUT_TOPICS as BANK_TOPICS } from './b2-input-text-data.mjs';
import * as G from './b2-select-one-data.mjs';
import { transformHint } from './fix-input-text-hints.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions', 'B2');

const FORCE = process.argv.includes('--force');
const TOPIC_ARG = process.argv.find((a) => a.startsWith('--topic='))?.slice(8);

/** Legacy banks with inline (…) hints in prompts. */
const BANK_PREFIX = {
  GENITIVB2: 'b2-genit-in',
  FUTURI: 'b2-fut-in',
  KONJUNKTIV2B2: 'b2-konj2-in',
  INDIREKTEREDE: 'b2-ired-in',
  PARTIZIP1: 'b2-pt1-in',
  PARTIZIP2: 'b2-pt2-in',
  PASSIVB2: 'b2-pass-in',
  RELATIVSATZB2: 'b2-rel-in',
  PASSIVERSATZ: 'b2-passv-in',
};

/** Select-one-only topics — now also get input-text (QUIZ excluded: mixed review). */
const SELECT_ONE_TOPICS = {
  'AKKUSATIV&DATIVOBJEKT': { prefix: 'b2-obj-in', gen: G.genAkkusativDativobjekt, label: 'Dativ/Akkusativ-Objekt' },
  INDEFINITPRONOMEN: { prefix: 'b2-indef-in', gen: G.genIndefinitpronomen, label: 'Indefinitpronomen' },
  KONJUNKTIONALADVERBIEN: { prefix: 'b2-kadv-in', gen: G.genKonjunktionaladverbien, label: 'Konjunktionaladverb' },
  KONSEKUTIVEKONJUNKTION: { prefix: 'b2-konsek-in', gen: G.genKonsekutiveKonjunktion, label: 'Konsekutivsatz' },
  KONZESSIVSATZB2: { prefix: 'b2-konz-in', gen: G.genKonzessivsatzB2, label: 'Konzessivsatz' },
  LOKALEPRÄPOSITIONENB2: { prefix: 'b2-lokal-in', gen: G.genLokalePraepositionenB2, label: 'Lokale Präposition' },
  MODALSATZ: { prefix: 'b2-modal-in', gen: G.genModalsatz, label: 'Modalsatz' },
  PRÄPOSITIONALADVERBIENB2: { prefix: 'b2-pradv-in', gen: G.genPraepositionaleAdverbienB2, label: 'Pronominaladverb' },
  PRÄPOSITIONENGENITIV: { prefix: 'b2-gen-in', gen: G.genPraepositionenGenitiv, label: 'Genitiv-Präposition' },
  REDEWENDUNGEN: { prefix: 'b2-rede-in', gen: G.genRedewendungen, label: 'Redewendung' },
  TEMPORALERNEBENSATZ: { prefix: 'b2-temp-in', gen: G.genTemporaleNebensatz, label: 'Temporalnebensatz' },
};

const CLOSED_SET_BANK_TOPICS = {
  PASSIVERSATZ: 'Passiv-Ersatz',
};

const CLOSED_SET_CACHE = new Map();
function closedSetForBankTopic(folder) {
  if (CLOSED_SET_CACHE.has(folder)) return CLOSED_SET_CACHE.get(folder);
  const bank = getBank(folder) || [];
  const all = new Set();
  for (const q of bank) {
    const ans = Array.isArray(q.correct) ? q.correct : [q.correct];
    for (const a of ans) all.add(String(a).trim());
  }
  const sorted = [...all].sort((a, b) => a.localeCompare(b, 'de'));
  CLOSED_SET_CACHE.set(folder, sorted);
  return sorted;
}

function closedSetHint(label, correct, options) {
  const all = [String(correct), ...((options || []).filter((o) => o !== correct))];
  const sorted = [...new Set(all.map((s) => String(s).trim()))].sort((a, b) => a.localeCompare(b, 'de'));
  return `${label} — ${sorted.join(' / ')}`;
}

function buildBankPrompt(rawPrompt, folder, correct, id) {
  const m = rawPrompt.match(/^([\s\S]*?)\s*\(([^)]*)\)\s*$/);
  const ans = Array.isArray(correct) ? correct : [correct];
  if (!m && !CLOSED_SET_BANK_TOPICS[folder]) return rawPrompt;
  const sentence = m ? m[1].trimEnd() : rawPrompt;
  if (CLOSED_SET_BANK_TOPICS[folder]) {
    const set = closedSetForBankTopic(folder);
    return `${sentence} (${CLOSED_SET_BANK_TOPICS[folder]} — ${set.join(' / ')})`;
  }
  const inner = m[2].trim();
  const hint = transformHint(inner, folder, ans, [], sentence, id);
  return `${sentence} (${hint})`;
}

function writeBankTopic(folder, prefix, questions) {
  mkdirSync(join(ROOT, folder), { recursive: true });
  let n = 0;
  questions.slice(0, 50).forEach((q, i) => {
    const num = String(i + 1).padStart(3, '0');
    const id = `${prefix}-${num}`;
    const path = join(ROOT, folder, `${id}.md`);
    if (!FORCE && existsSync(path)) return;
    const prompt = buildBankPrompt(q.prompt, folder, q.correct, id);
    writeFileSync(path, md(id, prompt, q.correct), 'utf8');
    n += 1;
  });
  return n;
}

function writeSelectOneTopic(folder, prefix, label, questions) {
  mkdirSync(join(ROOT, folder), { recursive: true });
  let n = 0;
  questions.slice(0, 50).forEach((q, i) => {
    const num = String(i + 1).padStart(3, '0');
    const id = `${prefix}-${num}`;
    const path = join(ROOT, folder, `${id}.md`);
    if (!FORCE && existsSync(path)) return;
    const hint = closedSetHint(label, q.correct, q.options || []);
    const prompt = `${q.prompt} (${hint})`;
    writeFileSync(path, md(id, prompt, q.correct), 'utf8');
    n += 1;
  });
  return n;
}

let total = 0;

for (const folder of BANK_TOPICS) {
  if (TOPIC_ARG && folder !== TOPIC_ARG) continue;
  const prefix = BANK_PREFIX[folder];
  const bank = getBank(folder);
  const n = writeBankTopic(folder, prefix, bank);
  total += n;
  console.log(`${folder}: ${FORCE ? 'regen ' : '+'}${n} input-text`);
}

for (const [folder, { prefix, gen, label }] of Object.entries(SELECT_ONE_TOPICS)) {
  if (TOPIC_ARG && folder !== TOPIC_ARG) continue;
  const n = writeSelectOneTopic(folder, prefix, label, gen());
  total += n;
  console.log(`${folder}: ${FORCE ? 'regen ' : '+'}${n} input-text`);
}

console.log(`\nTotal ${FORCE ? 'regenerated' : 'new'} input-text files: ${total}`);
