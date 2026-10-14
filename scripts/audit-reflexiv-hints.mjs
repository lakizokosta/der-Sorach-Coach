#!/usr/bin/env node
/** Audit REFLEXIVPRONOMEN hints — verb infinitive, no redundant person. */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { verbFormHint } from './topic-context-hints.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'site', 'questions');
const PERSON = /^(ich|du|er|sie|wir|ihr|Sie|man|es)$/i;

function* walkMd(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('_')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walkMd(full);
    else if (entry.endsWith('.md')) yield full;
  }
}

function parseListBlock(fm, key) {
  const inline = fm.match(new RegExp(`^${key}:[ \\t]*(\\S.*)$`, 'm'));
  if (inline) return [inline[1].trim()];
  const list = fm.match(new RegExp(`^${key}:\\n((?:[ \\t]*- .*\\n?)*)`, 'm'));
  if (!list) return [];
  return [...list[1].matchAll(/^\s*-\s+(.+)$/gm)].map((x) => x[1].trim());
}

function parseMd(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
  if (!m) return null;
  const fm = m[1];
  const body = m[2].trimEnd();
  const id = fm.match(/^id:\s*(.+)$/m)?.[1]?.trim() || '';
  const type = fm.match(/^type:\s*(.+)$/m)?.[1]?.trim() || '';
  const correct = parseListBlock(fm, 'correct');
  const options = parseListBlock(fm, 'options');
  const hint = (body.split('\n').pop() || '').match(/\(([^)]*)\)\s*$/)?.[1] || '';
  return { id, type, correct, options, hint, body };
}

const mismatches = [];
const personOnly = [];
let scanned = 0;

for (const full of walkMd(ROOT)) {
  if (basename(dirname(full)) !== 'REFLEXIVPRONOMEN') continue;
  const parsed = parseMd(readFileSync(full, 'utf8'));
  if (!parsed) continue;
  if (!parsed.body.includes('___') && parsed.type !== 'dropbox') continue;
  scanned += 1;

  const expected = verbFormHint(
    'REFLEXIVPRONOMEN',
    parsed.hint,
    parsed.correct,
    parsed.options,
    parsed.body,
    parsed.id,
  );

  if (expected !== parsed.hint) {
    mismatches.push({ file: full.replace(`${ROOT}/`, ''), hint: parsed.hint, expected });
  }

  if (/^Reflexivpronomen\s*—\s*(ich|du|er|sie|wir|ihr|Sie|man|es)\s*$/i.test(parsed.hint)) {
    personOnly.push(full.replace(`${ROOT}/`, ''));
  }

  const verbInHint = parsed.hint.match(/\+\s*Verb\s+(\S+)/i)?.[1];
  if (verbInHint && PERSON.test(verbInHint)) {
    personOnly.push(`${full.replace(`${ROOT}/`, '')} (verb=${verbInHint})`);
  }
}

console.log(`Scanned ${scanned} REFLEXIVPRONOMEN questions`);
console.log(`Hint mismatches: ${mismatches.length}`);
console.log(`Person-only bad hints: ${personOnly.length}`);

if (mismatches.length) {
  console.log('\nFirst mismatches:');
  for (const row of mismatches.slice(0, 20)) {
    console.log(`  ${row.file}`);
    console.log(`    got:      ${row.hint}`);
    console.log(`    expected: ${row.expected}`);
  }
}
if (personOnly.length) {
  console.log('\nPerson-only hints:');
  personOnly.forEach((f) => console.log(`  ${f}`));
}

process.exit(mismatches.length || personOnly.length ? 1 : 0);
