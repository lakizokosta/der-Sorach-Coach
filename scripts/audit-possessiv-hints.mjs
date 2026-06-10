#!/usr/bin/env node
/**
 * Audit possessiv hints: person in hint must match correct answer.
 * Run: node scripts/audit-possessiv-hints.mjs
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { possessivWhoFromForm } from './topic-context-hints.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions');

const TOPICS = new Set(['POSSESSIVARTIKEL', 'POSSESSIVARTIKELA2', 'POSSESSIVARTIKELB1']);

function* walkMd(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('_')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walkMd(full);
    else if (entry.endsWith('.md') && !entry.includes('-in-') && !entry.includes('-dd-')) yield full;
  }
}

function parseMd(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
  if (!m) return null;
  const type = m[1].match(/^type:\s*(.+)$/m)?.[1]?.trim();
  if (type !== 'select-one') return null;
  const correct = m[1].match(/^correct:\s*(.+)$/m)?.[1]?.trim() || '';
  const body = m[2].trimEnd();
  const hint = body.match(/\(([^)]*)\)\s*$/)?.[1] || '';
  return { correct, hint, sentence: body.replace(/\s*\([^)]*\)\s*$/, '').trim() };
}

const problems = [];
let scanned = 0;

for (const full of walkMd(ROOT)) {
  const topic = basename(dirname(full));
  if (!TOPICS.has(topic)) continue;
  const parsed = parseMd(readFileSync(full, 'utf8'));
  if (!parsed) continue;
  scanned += 1;

  const whoAns = possessivWhoFromForm(parsed.correct);
  if (!whoAns) continue;

  const whoHint = parsed.hint.match(/(?:Possessivartikel\s*—\s*)?(ich|du|er|sie|wir|ihr)\b/i)?.[1]?.toLowerCase();
  if (!whoHint) continue;
  if (whoHint !== whoAns) {
    problems.push({
      file: full.replace(`${ROOT}/`, ''),
      correct: parsed.correct,
      whoAns,
      whoHint,
      sentence: parsed.sentence.slice(0, 60),
    });
  }
}

console.log(`Scanned ${scanned} possessiv select-one questions`);
console.log(`Mismatches: ${problems.length}`);

for (const p of problems) {
  console.log(`\n${p.file}`);
  console.log(`  answer: ${p.correct} (${p.whoAns})  hint person: ${p.whoHint}`);
  console.log(`  ${p.sentence}`);
}

process.exit(problems.length ? 1 : 0);
