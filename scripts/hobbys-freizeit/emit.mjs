/**
 * Emit Markdown question files for Hobbys & Freizeit Wortschatz sets.
 */

export function yamlList(items, key) {
  return `${key}:\n${items.map((i) => `  - ${escapeYamlScalar(i)}`).join('\n')}`;
}

export function escapeYamlScalar(value) {
  const s = String(value);
  if (/^[\wÄÖÜäöüß .,'!?/%+-]+$/u.test(s) && !/^[-?]/.test(s)) return s;
  return JSON.stringify(s);
}

export function renderQuestion(q) {
  const lines = ['---', `id: ${q.id}`, `type: ${q.type}`];
  if (q.lemma) lines.push(`lemma: ${q.lemma}`);
  lines.push('set: HOBBYS_FREIZEIT', 'focus: word');
  if (q.hint) lines.push(`hint: ${escapeYamlScalar(q.hint)}`);

  if (q.type === 'select-one') {
    lines.push(yamlList(q.options, 'options'));
    lines.push(`correct: ${escapeYamlScalar(q.correct)}`);
  } else if (q.type === 'multi-select') {
    lines.push(yamlList(q.options, 'options'));
    lines.push(yamlList(q.correct, 'correct'));
  } else if (q.type === 'dropbox') {
    lines.push(yamlList(q.words, 'words'));
    if (q.commas?.length) lines.push(yamlList(q.commas, 'commas'));
    if (q.alternatives?.length) lines.push(yamlList(q.alternatives, 'alternatives'));
  } else if (q.type === 'input-text') {
    if (q.wordChoices?.length) lines.push(yamlList(q.wordChoices, 'wordChoices'));
    lines.push(yamlList(Array.isArray(q.correct) ? q.correct : [q.correct], 'correct'));
  } else if (q.type === 'text-gaps') {
    lines.push(yamlList(q.options, 'options'));
    lines.push(yamlList(q.correct, 'correct'));
  }

  lines.push('---', '', q.body.trim(), '');
  return lines.join('\n');
}
