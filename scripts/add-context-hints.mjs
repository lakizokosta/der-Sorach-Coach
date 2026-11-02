#!/usr/bin/env node
/**
 * Adds generalized context hints in parentheses to fill-in questions.
 * Run: node scripts/add-context-hints.mjs
 */

import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyHintToBody, contextHintForTopic, POSSESSIV_TOPICS } from './topic-context-hints.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'site', 'questions');

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

function parseOptions(fm) {
  return parseListBlock(fm, 'options');
}

function parseMd(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
  if (!m) return null;
  const fm = m[1];
  const body = m[2].trimEnd();
  const id = fm.match(/^id:\s*(.+)$/m)?.[1]?.trim() || '';
  const type = fm.match(/^type:\s*(.+)$/m)?.[1]?.trim() || '';
  const correct = parseListBlock(fm, 'correct');
  const options = parseOptions(fm);
  return { fm, body, id, type, correct, options };
}

/** @param {string} filePath @param {string} id */
function siblingInputPath(filePath, id) {
  const dir = dirname(filePath);
  const inId = id.replace(/-(\d+)$/, '-in-$1').replace(/-in-in-/, '-in-');
  if (inId === id) return null;
  const candidate = join(dir, `${inId}.md`);
  return existsSync(candidate) ? candidate : null;
}

/** @param {string} filePath @param {string} id */
function siblingSelectOnePath(filePath, id) {
  if (!id.includes('-in-')) return null;
  const dir = dirname(filePath);
  const soId = id.replace('-in-', '-');
  const candidate = join(dir, `${soId}.md`);
  return existsSync(candidate) ? candidate : null;
}

function extractInnerHint(body) {
  const last = body.split('\n').pop() || '';
  const m = last.match(/\(([^)]*)\)\s*$/);
  return m ? m[1] : '';
}

function needsHint(type, body) {
  if (type === 'dropbox') return /\([^)]*\)\s*$/.test(body);
  if (!['select-one', 'multi-select', 'input-text'].includes(type)) return false;
  return body.includes('___');
}

let changed = 0;
let scanned = 0;

for (const full of walkMd(ROOT)) {
  const topic = basename(dirname(full));
  const parsed = parseMd(readFileSync(full, 'utf8'));
  if (!parsed || !needsHint(parsed.type, parsed.body)) continue;
  scanned += 1;

  let inner = extractInnerHint(parsed.body);
  let options = parsed.options;

  // Possessiv / Verb / Adjektiv: select-one and input-text share an index but different sentences.
  const NO_SIBLING_HINT = new Set(['VERBKONJUGATION', 'ADJEKTIVDEKLINATIONA1', 'DATIVA1', 'AKKUSATIVA1', 'ARTIKEL']);
  const siblingIn = siblingInputPath(full, parsed.id);
  if (siblingIn && !POSSESSIV_TOPICS.has(topic) && !NO_SIBLING_HINT.has(topic)) {
    const sib = parseMd(readFileSync(siblingIn, 'utf8'));
    if (sib) inner = extractInnerHint(sib.body) || inner;
  }

  // Input-text and select-one siblings share an index but test different gaps —
  // never borrow select-one options for input-text hints (e.g. REFLEXIVPRONOMEN).
  const siblingSo = siblingSelectOnePath(full, parsed.id);
  if (siblingSo && parsed.type !== 'input-text') {
    const sib = parseMd(readFileSync(siblingSo, 'utf8'));
    if (sib?.options?.length) options = sib.options;
  }

  const hint = contextHintForTopic(topic, inner, parsed.correct, options, parsed.body, parsed.id);
  const newBody = applyHintToBody(parsed.body, hint);
  if (newBody === `${parsed.body}\n` || newBody === parsed.body) continue;

  writeFileSync(full, `---\n${parsed.fm}\n---\n\n${newBody}`, 'utf8');
  changed += 1;
}

console.log(`Scanned ${scanned} fill-in questions, updated ${changed}.`);
