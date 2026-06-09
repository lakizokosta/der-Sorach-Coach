/** Shared helpers for B1 dropbox generation. */

export function md(id, prompt, words) {
  const lines = words.map((w) => `  - ${w}`).join('\n');
  return `---\nid: ${id}\ntype: dropbox\nwords:\n${lines}\n---\n\n${prompt}\n`;
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
