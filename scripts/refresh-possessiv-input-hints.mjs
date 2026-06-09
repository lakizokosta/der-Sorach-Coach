#!/usr/bin/env node
/**
 * Re-applies possessiv input-text hints with person (ich/du/er …) from source banks.
 * Run: node scripts/refresh-possessiv-input-hints.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { BANK as A1_BANK } from './generate-a1-input-text.mjs';
import { BANK as A2_BANK } from './a2-input-text-data.mjs';
import { transformHint } from './fix-input-text-hints.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions');

/**
 * @param {string} level
 * @param {string} topic
 * @param {[string, string][]} bank
 */
function refreshFolder(level, topic, bank) {
  const dir = join(ROOT, level, topic);
  let n = 0;
  for (const file of readdirSync(dir).filter((f) => f.includes('-in-') && f.endsWith('.md'))) {
    const idx = parseInt(file.match(/-in-(\d+)/)?.[1] || '0', 10) - 1;
    if (idx < 0 || idx >= bank.length) continue;
    const [raw, correct] = bank[idx];
    const stripped = raw.replace(/^\[[^\]]+]\s+/, '');
    const m = stripped.match(/^([\s\S]*?)\s*\(([^)]*)\)\s*$/);
    if (!m) continue;
    const ans = Array.isArray(correct) ? correct : [correct];
    const hint = transformHint(m[2], topic, ans);
    const newBody = `${m[1].trimEnd()} (${hint})`;

    const full = join(dir, file);
    const content = readFileSync(full, 'utf8');
    const parsed = content.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
    if (!parsed) continue;
    const oldBody = parsed[2].trimEnd();
    if (oldBody === newBody) continue;
    writeFileSync(full, `---\n${parsed[1]}\n---\n\n${newBody}\n`, 'utf8');
    n += 1;
  }
  return n;
}

let total = 0;
total += refreshFolder('A1', 'POSSESSIVARTIKEL', A1_BANK.POSSESSIVARTIKEL);
total += refreshFolder('A2', 'POSSESSIVARTIKELA2', A2_BANK.POSSESSIVARTIKELA2);
console.log(`Updated ${total} possessiv input-text hints.`);
