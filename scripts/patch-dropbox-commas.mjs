#!/usr/bin/env node
/**
 * Add/update comma positions in all dropbox question files (Nebensätze).
 * Run: node scripts/patch-dropbox-commas.mjs
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { parseQuestionFile } from '../src/site/utils/markdownQuestion.js';
import { resolveDropboxCommas } from '../src/site/utils/dropboxCommas.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const QROOTS = [
  join(ROOT, 'src', 'site', 'questions'),
  join(ROOT, 'src', 'site', 'questions-vocab'),
];

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('_')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (entry.endsWith('.md')) yield full;
  }
}

function patchDropboxFile(path, qroot) {
  const rel = relative(qroot, path);
  const [level, topic] = rel.split(/[\\/]/);
  const raw = readFileSync(path, 'utf8');
  let q;
  try {
    q = parseQuestionFile(raw, { level, topic, path: rel });
  } catch {
    return null;
  }
  if (q.type !== 'dropbox' || !q.words?.length) return null;

  const hint = q.hint || String(q.prompt || '').match(/\(([^)]+)\)\s*$/)?.[1] || '';
  const inferred = resolveDropboxCommas({
    words: q.words,
    commas: undefined, // re-infer (ignore stale YAML)
    hint,
  });
  // Keep hand-authored commas only when inference finds nothing (edge Relativsatz etc.).
  const existing = Array.isArray(q.commas)
    ? q.commas.map(Number).filter((n) => Number.isInteger(n) && n >= 0)
    : [];
  const commas = inferred.length ? inferred : existing;

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
let scanned = 0;

for (const qroot of QROOTS) {
  for (const file of walk(qroot)) {
    const result = patchDropboxFile(file, qroot);
    if (!result) continue;
    scanned += 1;
    if (result.commas > 0) withCommas += 1;
    if (result.changed) patched += 1;
  }
}

console.log(
  `Dropbox comma patch complete: scanned ${scanned}, updated ${patched}, with commas ${withCommas}.`,
);
