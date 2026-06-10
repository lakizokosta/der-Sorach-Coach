#!/usr/bin/env node
/**
 * Regenerate genitive question files from fixed banks.
 * Run: node scripts/fix-genitiv-questions.mjs
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { restoreTopic as restoreA2Select } from './generate-a2-select-one.mjs';
import { BANK as A2_INPUT_BANK } from './a2-input-text-data.mjs';
import { md as a2InputMd } from './a2-input-text-shared.mjs';
import { transformHint } from './fix-input-text-hints.mjs';
import { BANK as A2_DROPBOX_BANK } from './a2-dropbox-data.mjs';
import { md as a2DropboxMd, assertUnique } from './a2-dropbox-shared.mjs';
import * as B2G from './b2-select-one-data.mjs';
import { md as b2SelectMd } from './b2-select-one-shared.mjs';
import { verbFormHint } from './topic-context-hints.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions');

function buildA2InputPrompt(item, topicKey) {
  const raw = item[0].replace(/^\[[^\]]+]\s+/, '');
  const m = raw.match(/^([\s\S]*?)\s*\(([^)]*)\)\s*$/);
  const ans = Array.isArray(item[1]) ? item[1] : [item[1]];
  if (m) return `${m[1].trimEnd()} (${transformHint(m[2], topicKey, ans)})`;
  return raw;
}

function restoreA2InputText() {
  const items = A2_INPUT_BANK.GENITIVA2;
  const dir = join(ROOT, 'A2', 'GENITIVA2');
  mkdirSync(dir, { recursive: true });
  let n = 0;
  items.slice(0, 50).forEach((item, i) => {
    const num = String(i + 1).padStart(3, '0');
    const id = `a2-gen-in-${num}`;
    const prompt = buildA2InputPrompt(item, 'GENITIVA2');
    writeFileSync(join(dir, `${id}.md`), a2InputMd(id, prompt, item[1]), 'utf8');
    n += 1;
  });
  return n;
}

function restoreA2Dropbox() {
  const bank = A2_DROPBOX_BANK.GENITIVA2;
  const dir = join(ROOT, 'A2', 'GENITIVA2');
  mkdirSync(dir, { recursive: true });
  let n = 0;
  bank.slice(0, 50).forEach((item, i) => {
    const num = String(i + 1).padStart(3, '0');
    const id = `a2-gen-dd-${num}`;
    assertUnique(item.words, `GENITIVA2 #${i + 1}`);
    const prompt = `Ordne die Wörter zum richtigen Satz: (${item.hint})`;
    writeFileSync(join(dir, `${id}.md`), a2DropboxMd(id, prompt, item.words), 'utf8');
    n += 1;
  });
  return n;
}

function restoreB2GenitivSelect() {
  const questions = B2G.genGenitivB2();
  const dir = join(ROOT, 'B2', 'GENITIVB2');
  mkdirSync(dir, { recursive: true });
  let n = 0;
  for (let i = 1; i <= 50; i++) {
    const q = questions[i - 1];
    if (!q) break;
    const num = String(i).padStart(3, '0');
    const id = `b2-genit-${num}`;
    const hint = verbFormHint('GENITIVB2', '', q.correct, q.options, q.prompt, id);
    writeFileSync(join(dir, `${id}.md`), b2SelectMd({ id, hint, ...q }), 'utf8');
    n += 1;
  }
  return n;
}

const a2in = restoreA2InputText();
const a2so = restoreA2Select('GENITIVA2');
const a2dd = restoreA2Dropbox();
const b2so = restoreB2GenitivSelect();

console.log(`Restored A2 GENITIVA2 input-text: ${a2in}`);
console.log(`Restored A2 GENITIVA2 select-one: ${a2so}`);
console.log(`Restored A2 GENITIVA2 dropbox: ${a2dd}`);
console.log(`Restored B2 GENITIVB2 select-one: ${b2so}`);
