/** Shared helpers for B1 input-text generation. */

export function md(id, prompt, correct, hint = '') {
  const ans = (Array.isArray(correct) ? correct : [correct]).map((c) => `  - ${c}`).join('\n');
  const hintLine = hint ? `hint: ${hint}\n` : '';
  return `---\nid: ${id}\ntype: input-text\n${hintLine}correct:\n${ans}\n---\n\n${prompt}\n`;
}

/** @param {[string, string|string[]][]} items */
export function cycle50(items) {
  if (items.length === 0) throw new Error('empty bank');
  const out = [];
  for (let i = 0; i < 50; i++) out.push(items[i % items.length]);
  return out;
}
