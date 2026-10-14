#!/usr/bin/env node
/** Strips redundant [Theme] prefixes from A1 question prompts. */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'site', 'questions', 'A1');

/** Keep [Theme] only on dropbox when the scene benefits from it. */
const DROPBOX_KEEP = new Set(['Transport', 'Reisen', 'Stadt', 'Sport', 'Wetter']);

function* walk(dir) {
  for (const e of readdirSync(dir)) {
    if (e.startsWith('_')) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (e.endsWith('.md')) yield p;
  }
}

let changed = 0;
for (const file of walk(ROOT)) {
  const raw = readFileSync(file, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) continue;
  const [, fm, body] = m;
  const type = fm.match(/^type:\s*(.+)$/m)?.[1]?.trim();
  if (!body.match(/^\[[\wäöüÄÖÜ]+]\s/m)) continue;

  const trimmed = body.trimStart();
  if (!trimmed.startsWith('[')) continue;

  const tag = trimmed.match(/^\[([^\]]+)]\s*/)?.[1];
  let newBody = body;
  if (type === 'dropbox' && tag && DROPBOX_KEEP.has(tag)) {
    continue;
  }
  const stripped = trimmed.replace(/^\[[^\]]+]\s+/, '');
  newBody = body.slice(0, body.length - trimmed.length) + stripped;

  if (newBody.trim() !== body.trim()) {
    writeFileSync(file, `---\n${fm}\n---\n\n${stripped}\n`, 'utf8');
    changed += 1;
  }
}
console.log(`Updated ${changed} A1 prompt(s).`);
