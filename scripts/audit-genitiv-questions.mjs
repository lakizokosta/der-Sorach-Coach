#!/usr/bin/env node
/**
 * Audit genitive questions for logical/grammatical errors.
 * Run: node scripts/audit-genitiv-questions.mjs
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'site', 'questions');

const GENITIV_TOPICS = new Set([
  'GENITIVA2',
  'GENITIVB2',
  'PRÄPOSITIONENGENITIV',
  'PRÄPOSITIONENGENITIVB1',
]);

const WECHSEL = /\b(Vor|Hinter|Neben|Über|Unter|An|Auf|In|Zwischen)\b/i;
const GENITIV_PREP = /\b(Wegen|Trotz|Während|Statt|Innerhalb|Außerhalb|Anlässlich|Infolge|Aufgrund|Ungeachtet|Entgegen|Unweit|Dank|Aus)\b/i;

function* walkMd(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('_')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walkMd(full);
    else if (entry.endsWith('.md')) yield full;
  }
}

function parseMd(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
  if (!m) return null;
  const fm = m[1];
  const body = m[2].trimEnd();
  const id = fm.match(/^id:\s*(.+)$/m)?.[1]?.trim() || '';
  const type = fm.match(/^type:\s*(.+)$/m)?.[1]?.trim() || '';
  const correctInline = fm.match(/^correct:\s*(.+)$/m)?.[1]?.trim();
  const correctList = fm.includes('correct:\n')
    ? [...fm.matchAll(/^\s*-\s+(.+)$/gm)].map((x) => x[1].trim())
    : correctInline ? [correctInline] : [];
  const options = [...fm.matchAll(/^  - (.+)$/gm)]
    .map((x) => x[1].trim())
    .filter((_, i, arr) => {
      const optsStart = fm.indexOf('options:');
      const corrStart = fm.indexOf('correct:');
      const pos = fm.indexOf(`- ${arr[i]}`);
      return optsStart >= 0 && pos > optsStart && (corrStart < 0 || pos < corrStart);
    });
  const line = body.split('\n').pop() || '';
  const sentence = line.replace(/\s*\([^)]*\)\s*$/, '').trim();
  return { id, type, correct: correctList, options, sentence, body };
}

/** @param {string} sentence @param {string} answer */
function filledSentence(sentence, answer) {
  return sentence.replace('___', answer).replace(/\s+/g, ' ').trim();
}

/** @param {string} text */
function issuesFor(text) {
  const found = [];
  if (/\bWegen\s+\S+\s+\w+\s+wegen\b/i.test(text)) found.push('double-wegen');
  if (/\bwegen\s+wegen\b/i.test(text)) found.push('double-wegen');
  if (/\b(?:Vor|Hinter|Neben|Über|Unter|An|Auf|In)\s+(?:dem|der|die|den)\s+des\b/i.test(text)) {
    found.push('wechsel+dative+genitive');
  }
  if (/\b(?:Vor|Hinter|Neben|Über|Unter|An|Auf|In)\s+des\b/i.test(text)) {
    found.push('wechsel+genitive');
  }
  if (/\bdes\s+des\b/i.test(text)) found.push('double-genitive-article');
  if (/\bder\s+des\b/i.test(text)) found.push('mixed-articles');
  if (/\bdem\s+des\b/i.test(text)) found.push('dative-before-genitive');
  return found;
}

const problems = [];
let scanned = 0;

for (const full of walkMd(ROOT)) {
  const topic = basename(dirname(full));
  if (!GENITIV_TOPICS.has(topic)) continue;
  const parsed = parseMd(readFileSync(full, 'utf8'));
  if (!parsed) continue;
  scanned += 1;

  const checks = [parsed.sentence];
  for (const ans of parsed.correct) {
    checks.push(filledSentence(parsed.sentence, ans));
  }
  for (const opt of parsed.options) {
    if (WECHSEL.test(opt) && /\bdes\b/i.test(parsed.sentence)) {
      checks.push(filledSentence(parsed.sentence, opt));
    }
    if (/^(Vor|Während|Wegen|Trotz)\s+(dem|der|die|den)/i.test(opt)) {
      checks.push(filledSentence(parsed.sentence, opt));
    }
  }

  const issueSet = new Set();
  for (const text of checks) {
    for (const issue of issuesFor(text)) issueSet.add(issue);
  }

  if (parsed.type === 'input-text') {
    for (const ans of parsed.correct) {
      if (/\s/.test(ans)) issueSet.add('multi-word-input-answer');
    }
  }

  if (issueSet.size) {
    problems.push({
      file: full.replace(`${ROOT}/`, ''),
      issues: [...issueSet],
      sentence: parsed.sentence.slice(0, 70),
      correct: parsed.correct.join(', '),
    });
  }
}

console.log(`Scanned ${scanned} genitive questions`);
console.log(`Problems: ${problems.length}`);

for (const p of problems) {
  console.log(`\n${p.file}`);
  console.log(`  issues: ${p.issues.join(', ')}`);
  console.log(`  sentence: ${p.sentence}`);
  if (p.correct) console.log(`  correct: ${p.correct}`);
}

process.exit(problems.length ? 1 : 0);
