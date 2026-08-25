#!/usr/bin/env node
/**
 * Build a2.mjs–b2.mjs with 100 questions each.
 * Run: node scripts/job-suche/build-levels.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildQuestions, writeLevelFile } from './lib.mjs';
import { a2Words } from './word-data-a2.mjs';
import { b1Words } from './word-data-b1.mjs';
import { b2Words } from './word-data-b2.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const LEVELS = [
  { file: 'a2.mjs', label: 'A2', exportName: 'a2Questions', prefix: 'a2-jobs', words: a2Words },
  { file: 'b1.mjs', label: 'B1', exportName: 'b1Questions', prefix: 'b1-jobs', words: b1Words },
  { file: 'b2.mjs', label: 'B2', exportName: 'b2Questions', prefix: 'b2-jobs', words: b2Words },
];

for (const level of LEVELS) {
  if (level.words.length !== 20) {
    throw new Error(`${level.label}: expected 20 lemmas, got ${level.words.length}`);
  }

  const questions = buildQuestions(level.prefix, level.words);
  if (questions.length !== 100) {
    throw new Error(`${level.label}: expected 100 questions, got ${questions.length}`);
  }

  const content = writeLevelFile(level.exportName, level.label, questions);
  fs.writeFileSync(path.join(__dirname, level.file), content);
  console.log(`${level.file}: ${questions.length} questions (${level.words.length} lemmas × 5 types)`);
}
