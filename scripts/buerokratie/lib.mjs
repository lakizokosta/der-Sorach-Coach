/**
 * Shared lemma specs + question builders for Bürokratie levels.
 */

export function pad(n) {
  return String(n).padStart(3, '0');
}

export function toSource(value, indent = 0) {
  const sp = '  '.repeat(indent);
  if (value === null) return 'null';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    return `[\n${value.map((v) => `${sp}  ${toSource(v, indent + 1)}`).join(',\n')}\n${sp}]`;
  }
  const entries = Object.entries(value);
  return `{\n${entries
    .map(([k, v]) => `${sp}  ${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${toSource(v, indent + 1)}`)
    .join(',\n')}\n${sp}}`;
}

export function buildQuestions(prefix, words) {
  const out = [];

  words.forEach((w, i) => {
    const n = pad(i + 1);
    out.push({
      id: `${prefix}-so-${n}`,
      type: 'select-one',
      lemma: w.lemma,
      options: w.so.options,
      correct: w.so.correct,
      hint: w.hint,
      body: w.so.body,
    });
  });

  words.forEach((w, i) => {
    const n = pad(i + 1);
    out.push({
      id: `${prefix}-ms-${n}`,
      type: 'multi-select',
      lemma: w.lemma,
      options: w.ms.options,
      correct: w.ms.correct,
      hint: w.hint,
      body: w.ms.body,
    });
  });

  words.forEach((w, i) => {
    const n = pad(i + 1);
    out.push({
      id: `${prefix}-dd-${n}`,
      type: 'dropbox',
      lemma: w.lemma,
      words: w.dd,
      hint: w.hint,
      body: w.ddBody || `Ordne die Wörter zum richtigen Satz (${w.lemma}).`,
    });
  });

  words.forEach((w, i) => {
    const n = pad(i + 1);
    out.push({
      id: `${prefix}-in-${n}`,
      type: 'input-text',
      lemma: w.lemma,
      hint: w.inHint || w.hint.replace(/^Wortschatz — /, ''),
      wordChoices: w.in.wordChoices,
      correct: w.in.correct,
      body: w.in.body,
    });
  });

  words.forEach((w, i) => {
    const n = pad(i + 1);
    out.push({
      id: `${prefix}-tg-${n}`,
      type: 'text-gaps',
      lemma: w.lemma,
      hint: 'Lesen Sie die Vorgeschichte',
      options: w.tg.options,
      correct: w.tg.correct,
      body: `${w.tg.story}\n\n${w.tg.dialog}`,
    });
  });

  return out;
}

export function writeLevelFile(exportName, levelLabel, questions) {
  return `/** ${levelLabel} — Bürokratie (100 Fragen) */\n\nexport const ${exportName} = ${toSource(questions)};\n`;
}
