#!/usr/bin/env node
/**
 * Add/update comma positions in all dropbox question files (Nebensätze).
 * Run: node scripts/patch-dropbox-commas.mjs
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { parseQuestionFile } from '../src/utils/markdownQuestion.js';
import { resolveDropboxCommas } from '../src/utils/dropboxCommas.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const QROOT = join(ROOT, 'src', 'questions');

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('_')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (entry.endsWith('.md')) yield full;
  }
}

function patchDropboxFile(path) {
  const rel = relative(QROOT, path);
  const [level, topic] = rel.split(/[\\/]/);
  const raw = readFileSync(path, 'utf8');
  let q;
  try {
    q = parseQuestionFile(raw, { level, topic, path: rel });
  } catch {
    return null;
  }
  if (q.type !== 'dropbox' || !q.words?.length) return null;

  const commas = resolveDropboxCommas({
    words: q.words,
    commas: q.commas,
    hint: q.hint || String(q.prompt || '').match(/\(([^)]+)\)\s*$/)?.[1] || '',
  });

  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
  if (!fmMatch) return null;

  const body = fmMatch[2];
  const metaLines = fmMatch[1].split('\n');
  const outMeta = [];
  let inCommas = false;
  let hadCommas = false;

  for (const line of metaLines) {
    if (/^commas:/.test(line)) {
      inCommas = true;
      hadCommas = true;
      continue;
    }
    if (inCommas) {
      if (/^  - /.test(line)) continue;
      inCommas = false;
    }
    outMeta.push(line);
  }

  if (commas.length) {
    outMeta.push('commas:');
    for (const c of commas) outMeta.push(`  - ${c}`);
  }

  const next = `---\n${outMeta.join('\n')}\n---\n\n${body}`;
  const changed = next !== raw;
  if (changed) writeFileSync(path, next, 'utf8');
  return { changed, hadCommas, commas: commas.length };
}

let patched = 0;
let withCommas = 0;

for (const file of walk(QROOT)) {
  const result = patchDropboxFile(file);
  if (!result) continue;
  if (result.commas > 0) withCommas += 1;
  if (result.changed) patched += 1;
}

console.log(`Dropbox comma patch complete: ${patched} file(s) updated, ${withCommas} with comma positions.`);
