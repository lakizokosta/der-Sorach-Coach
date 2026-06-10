/** Shared helpers for B2 dropbox generation (supports optional TeKaMoLo codes). */

export function md(id, prompt, words, codes) {
  const wordLines = words.map((w) => `  - ${w}`).join('\n');
  const codeBlock = codes?.length
    ? `codes:\n${codes.map((c) => `  - ${c}`).join('\n')}\n`
    : '';
  return `---\nid: ${id}\ntype: dropbox\nwords:\n${wordLines}\n${codeBlock}---\n\n${prompt}\n`;
}

export function assertUnique(words, label) {
  const seen = new Set();
  for (const w of words) {
    if (seen.has(w)) throw new Error(`Duplicate word "${w}" in ${label}`);
    seen.add(w);
  }
}
