#!/usr/bin/env node
/** One-off fixes from questions:audit. Run: node scripts/fix-question-bank-audit.mjs */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseQuestionFile } from '../src/utils/markdownQuestion.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions');

function* walk(dir) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (e.endsWith('.md')) yield full;
  }
}

function dedupeOptions(options, correct) {
  const out = [];
  const seen = new Set();
  for (const o of options) {
    const t = String(o).trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  if (!seen.has(String(correct).trim())) out.unshift(String(correct).trim());
  return out;
}

function patchYamlOptions(raw, newOpts) {
  const lines = raw.split('\n');
  const start = lines.findIndex((l) => l.trim() === 'options:');
  if (start < 0) return raw;
  let end = start + 1;
  while (end < lines.length && /^\s+-\s+/.test(lines[end])) end += 1;
  const optLines = newOpts.map((o) => `  - ${o}`);
  return [...lines.slice(0, start + 1), ...optLines, ...lines.slice(end)].join('\n');
}

let n = 0;

for (const file of walk(ROOT)) {
  let raw = readFileSync(file, 'utf8');
  const rel = file.replace(ROOT + '/', '');
  const [level, topic] = rel.split('/');

  if (rel === 'A2/SATZSTELLUNGA2/a2-sort-2.md') {
    raw = raw.replace(/^id: a2-sort-2$/m, 'id: a2-satz-sort-2');
    writeFileSync(file, raw, 'utf8');
    n += 1;
    continue;
  }

  if (rel === 'A1/PLURAL/a1-pl-4.md') {
    raw = raw.replace(/\n\nPlural von „die Stadt“\?\n*$/, '\n\nPlural von „die Stadt“: ___\n');
    writeFileSync(file, raw, 'utf8');
    n += 1;
    continue;
  }

  let q;
  try {
    q = parseQuestionFile(raw, { level, topic, path: rel });
  } catch {
    continue;
  }

  if (q.type === 'select-one') {
    const deduped = dedupeOptions(q.options, q.correct);
    if (deduped.length !== q.options.length) {
      let opts = deduped;
      if (opts.length < 4) {
        const inf = q.prompt.match(/\((\w+)\)\s*$/)?.[1];
        const extras = ['machen', 'gehen', 'kommen', inf].filter(Boolean);
        for (const e of extras) {
          if (opts.length >= 4) break;
          if (!opts.includes(e) && e !== q.correct) opts.push(e);
        }
      }
      writeFileSync(file, patchYamlOptions(raw, opts.slice(0, 4)), 'utf8');
      n += 1;
    }
  }

  if (rel.includes('NOMENPRÄPOSITIONVERBINDUNGB1/b1-npv') && /Anteil ___ dem/.test(q.prompt)) {
    if (q.type === 'select-one' && q.correct === 'am') {
      raw = raw.replace(/^correct: am$/m, 'correct: an');
      if (!raw.includes('\n  - an\n')) {
        raw = patchYamlOptions(raw, ['an', 'am', 'auf', 'in']);
      }
      writeFileSync(file, raw, 'utf8');
      n += 1;
    }
    if (q.type === 'input-text' && q.correct?.[0] === 'am') {
      raw = raw.replace(/^  - am$/m, '  - an');
      writeFileSync(file, raw, 'utf8');
      n += 1;
    }
  }
}

console.log(`Patched ${n} file(s)`);
