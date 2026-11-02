/** Shared helpers for B1 dropbox generation. */

import { resolveDropboxCommas } from '../src/site/utils/dropboxCommas.js';

export function md(id, prompt, words, alternatives, commas, hint = '') {
  const lines = words.map((w) => `  - ${w}`).join('\n');
  let altBlock = '';
  if (Array.isArray(alternatives) && alternatives.length) {
    altBlock = `\nalternatives:\n${alternatives.map((a) => `  - ${a}`).join('\n')}`;
  }
  const resolvedCommas = resolveDropboxCommas({
    words,
    commas,
    hint: hint || String(prompt || '').match(/\(([^)]+)\)\s*$/)?.[1] || '',
  });
  let commaBlock = '';
  if (resolvedCommas.length) {
    commaBlock = `\ncommas:\n${resolvedCommas.map((c) => `  - ${c}`).join('\n')}`;
  }
  return `---\nid: ${id}\ntype: dropbox\nwords:\n${lines}${commaBlock}${altBlock}\n---\n\n${prompt}\n`;
}

export function assertUnique(words, label) {
  const seen = new Set();
  for (const w of words) {
    if (seen.has(w)) throw new Error(`Duplicate word "${w}" in ${label}`);
    seen.add(w);
  }
}

/** @param {{ hint: string, words: string[] }[]} items */
export function cycle50(items) {
  if (items.length === 0) throw new Error('empty bank');
  const out = [];
  for (let i = 0; i < 50; i++) out.push(items[i % items.length]);
  return out;
}
