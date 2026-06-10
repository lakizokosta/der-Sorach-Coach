/** Shared helpers for B1 select-one generation. */

/** @typedef {{ prompt: string, options: string[], correct: string }} Q */

export function shuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickDistractors(pool, correct, count, seed) {
  const rest = [...new Set(pool.filter((x) => x !== correct))];
  return shuffle(rest, seed).slice(0, count);
}

export function options4(correct, pool, seed) {
  return shuffle([correct, ...pickDistractors(pool, correct, 3, seed)], seed);
}

export function options5(correct, pool, seed) {
  return shuffle([correct, ...pickDistractors(pool, correct, 4, seed)], seed);
}

/** B1 communicative contexts — woven into prompts, no [Thema] tags. */
export const CTX = [
  'arbeit', 'universitaet', 'nachrichten', 'gesundheit', 'umwelt', 'politik', 'reisen',
];

export function md({ id, prompt, options, correct, hint }) {
  const opts = options.map((o) => `  - ${o}`).join('\n');
  const body = hint && !/\([^)]+\)\s*$/.test(prompt.trim())
    ? `${prompt.trim()} (${hint})`
    : prompt;
  return `---\nid: ${id}\ntype: select-one\noptions:\n${opts}\ncorrect: ${correct}\n---\n\n${body}\n`;
}

/** @param {() => Q[]} fn */
export function ensure50(fn) {
  const out = fn();
  if (out.length < 50) throw new Error(`Generator returned ${out.length}, need 50`);
  return out.slice(0, 50);
}
