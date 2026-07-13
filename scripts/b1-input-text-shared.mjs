/** Shared helpers for B1 input-text generation. */
export { md } from './input-text-prompt-shared.mjs';

/** @param {{ hint: string, words: string[] }[]} items */
export function cycle50(items) {
  if (items.length === 0) throw new Error('empty bank');
  const out = [];
  for (let i = 0; i < 50; i++) out.push(items[i % items.length]);
  return out;
}
