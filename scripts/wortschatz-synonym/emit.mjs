/**
 * Emit Markdown for «Wie würdest du es noch sagen?» multi-select vocab tasks.
 */

export function escapeYamlScalar(value) {
  const s = String(value);
  if (/^[\wÄÖÜäöüß .,'!?/%+-]+$/u.test(s) && !/^[-?]/.test(s)) return s;
  return JSON.stringify(s);
}

export function yamlList(items, key) {
  return `${key}:\n${items.map((i) => `  - ${escapeYamlScalar(i)}`).join('\n')}`;
}

/**
 * @param {{ id:string, set:string, lemma?:string, replace?:string, hint?:string, options:string[], correct:string[], body:string }} q
 */
export function renderSynonymQuestion(q) {
  const lines = [
    '---',
    `id: ${q.id}`,
    'type: multi-select',
  ];
  if (q.lemma) lines.push(`lemma: ${q.lemma}`);
  lines.push(`set: ${q.set}`, 'focus: synonym');
  if (q.replace) lines.push(`replace: ${escapeYamlScalar(q.replace)}`);
  if (q.hint) lines.push(`hint: ${escapeYamlScalar(q.hint)}`);
  lines.push(yamlList(q.options, 'options'));
  lines.push(yamlList(q.correct, 'correct'));
  lines.push('---', '', q.body.trim(), '');
  return lines.join('\n');
}

/**
 * @param {'du'|'Sie'} register
 * @param {{ context:string, replace:string }} param1
 */
export function buildSynonymBody(register, { context, replace }) {
  const head = register === 'du'
    ? 'Wie würdest du es noch sagen?'
    : 'Wie würden Sie es noch sagen?';
  const task = register === 'du'
    ? `Welche Wörter oder Ausdrücke passen auch statt «${replace}»? Wähle alle richtigen Antworten.`
    : `Welche Wörter oder Ausdrücke passen auch statt «${replace}»? Wählen Sie alle richtigen Antworten.`;
  return `${head}\n\n${context}\n\n${task}`;
}
