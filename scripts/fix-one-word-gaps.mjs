#!/usr/bin/env node
/**
 * Enforces one gap = one word for input-text questions.
 * Splits "Während des" / "Wegen der" answers into preposition + article gap.
 * Run: node scripts/fix-one-word-gaps.mjs
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'questions');

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
  return { fm: m[1], body: m[2].trimEnd(), correct: parseListBlock(m[1], 'correct') };
}

/**
 * @param {string} body
 * @param {string} answer
 */
function fixPrepArticleGap(body, answer) {
  const parts = answer.trim().split(/\s+/);
  if (parts.length !== 2) return null;
  const [prep, art] = parts;
  if (!/^(Während|Wegen|Trotz)$/i.test(prep)) return null;
  if (!/^(des|der|dem|den|das|die)$/i.test(art)) return null;

  const lines = body.split('\n');
  const last = lines.length - 1;
  const hint = lines[last].match(/^([\s\S]*?)\s*\(([^)]*)\)\s*$/);
  let sentence = hint ? hint[1] : lines[last];
  const hintInner = hint ? hint[2] : '';

  if (sentence.includes(`${prep} ___`) || sentence.includes(`${prep.toLowerCase()} ___`)) {
    return null;
  }
  if (!sentence.trimStart().startsWith('___')) return null;

  sentence = sentence.replace(/^\s*___/, `${prep} ___`);
  lines[last] = hintInner ? `${sentence} (${hintInner})` : sentence;
  return { body: lines.join('\n'), answer: art };
}

function* walkMd(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('_')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walkMd(full);
    else if (entry.endsWith('.md')) yield full;
  }
}

let changed = 0;
for (const full of walkMd(ROOT)) {
  const content = readFileSync(full, 'utf8');
  const parsed = parseMd(content);
  if (!parsed || !parsed.body.includes('___')) continue;
  const type = parsed.fm.match(/^type:\s*(.+)$/m)?.[1]?.trim();
  if (type !== 'input-text') continue;
  if ((parsed.body.match(/___/g) || []).length !== 1) continue;

  const answer = parsed.correct[0];
  if (!answer || !answer.includes(' ')) continue;

  const fixed = fixPrepArticleGap(parsed.body, answer);
  if (!fixed) continue;

  let newFm = parsed.fm;
  if (/^correct:\s*\S/m.test(newFm)) {
    newFm = newFm.replace(/^correct:\s*\S.*$/m, `correct:\n  - ${fixed.answer}`);
  } else {
    newFm = newFm.replace(/^correct:\n[\s\S]*?(?=\n[a-z_][\w-]*:|$)/m, `correct:\n  - ${fixed.answer}`);
  }

  writeFileSync(full, `---\n${newFm}\n---\n\n${fixed.body}\n`, 'utf8');
  changed += 1;
}

console.log(`Fixed ${changed} input-text questions (one gap = one word).`);
