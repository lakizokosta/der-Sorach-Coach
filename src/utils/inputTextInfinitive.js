/**
 * Resolves the verb infinitive shown as a learner hint on input-text gaps.
 * Sources (in order): frontmatter `lemma`, trailing `(…)` in the prompt body,
 * separable-verb particle + finite `correct` answer.
 */

function stripTrailingPromptHint(text) {
  return String(text || '')
    .replace(/\s*\([^)]*\)\s*$/, '')
    .trim();
}

const PERSON = /^(ich|du|er|sie|es|wir|ihr|Sie|man)$/i;

const SEPARABLE_PARTICLES = [
  'zurück', 'zusammen', 'wieder', 'fort', 'nieder', 'wider', 'fest', 'frei', 'hoch',
  'an', 'ab', 'auf', 'aus', 'bei', 'ein', 'mit', 'nach', 'vor', 'zu', 'weg', 'weiter',
  'her', 'hin', 'um', 'durch',
];

const FINITE_TO_INF = {
  bereite: 'vorbereiten', bereitest: 'vorbereiten', bereitet: 'vorbereiten',
  freue: 'freuen', freust: 'freuen', freut: 'freuen',
  melde: 'melden', meldest: 'melden', meldet: 'melden',
  kaufe: 'kaufen', kaufst: 'kaufen', kauft: 'kaufen',
  mache: 'machen', machst: 'machen', macht: 'machen',
  gehe: 'gehen', gehst: 'gehen', geht: 'gehen',
  stehe: 'stehen', stehst: 'stehen', steht: 'stehen',
  komme: 'kommen', kommst: 'kommen', kommt: 'kommen',
  nehme: 'nehmen', nimmst: 'nehmen', nimmt: 'nehmen',
  bin: 'sein', bist: 'sein', ist: 'sein', sind: 'sein', seid: 'sein',
  habe: 'haben', hast: 'haben', hat: 'haben', haben: 'haben', habt: 'haben',
  werde: 'werden', wirst: 'werden', wird: 'werden', werdet: 'werden',
  kann: 'können', kannst: 'können', können: 'können', könnt: 'können',
  muss: 'müssen', musst: 'müssen', müssen: 'müssen', müsst: 'müssen',
  darf: 'dürfen', darfst: 'dürfen', dürfen: 'dürfen', dürft: 'dürfen',
  will: 'wollen', willst: 'wollen', wollen: 'wollen', wollt: 'wollen',
  soll: 'sollen', sollst: 'sollen', sollen: 'sollen', sollt: 'sollen',
};

/**
 * @param {string} word
 * @return {boolean}
 */
function looksLikeInfinitive(word) {
  const w = String(word || '').toLowerCase().trim();
  if (!w || PERSON.test(w)) return false;
  if (/^(?:sein|haben|werden|tun|wissen|können|müssen|sollen|dürfen|wollen|mögen|möchten)$/.test(w)) {
    return true;
  }
  return /(?:en|eln|ern)$/i.test(w);
}

/**
 * @param {string} word
 * @return {string}
 */
function finiteToInfinitive(word) {
  const w = String(word || '').toLowerCase().trim();
  if (!w) return '';
  if (FINITE_TO_INF[w]) return FINITE_TO_INF[w];
  if (/(?:en|eln|ern)$/i.test(w)) return w;
  if (/[a-zäöüß]{2,}st$/i.test(w)) {
    const stem = w.slice(0, -2);
    return stem.endsWith('e') ? `${stem}n` : `${stem}en`;
  }
  if (/[a-zäöüß]{2,}t$/i.test(w)) {
    const stem = w.slice(0, -1);
    return stem.endsWith('e') ? `${stem}n` : `${stem}en`;
  }
  if (/[a-zäöüß]{2,}e$/i.test(w)) return `${w.slice(0, -1)}en`;
  return '';
}

/**
 * @param {string} inner  Text inside trailing parentheses.
 * @return {string}
 */
function infinitiveFromParenInner(inner) {
  const text = String(inner || '').trim();
  if (!text) return '';

  const reflexiv = text.match(/Reflexiv\s*\+\s*Verb\s+([\wäöüÄÖÜß-]+)/i);
  if (reflexiv) {
    const verb = reflexiv[1].toLowerCase();
    if (verb.startsWith('sich ')) return verb;
    if (looksLikeInfinitive(verb)) return `sich ${verb}`;
    return verb;
  }

  const verbTag = text.match(/(?:Trennbares\s+Verb\s*\+\s*)?Verb\s+([\wäöüÄÖÜß-]+)/i);
  if (verbTag) {
    const verb = verbTag[1].toLowerCase();
    if (looksLikeInfinitive(verb)) return verb;
  }

  const dash = text.match(/—\s*([^/—,]+?)(?:\/[^/—,)]+)?\s*$/);
  if (dash) {
    const verb = dash[1].trim().toLowerCase();
    if (looksLikeInfinitive(verb)) return verb;
  }

  const parts = text.split(',').map((s) => s.trim());
  if (parts.length >= 2 && looksLikeInfinitive(parts[0]) && !PERSON.test(parts[0])) {
    return parts[0].toLowerCase();
  }

  if (looksLikeInfinitive(text)) return text.toLowerCase();

  return '';
}

/**
 * @param {string} promptBody
 * @return {string}
 */
function infinitiveFromTrailingParen(promptBody) {
  const match = String(promptBody || '').match(/\(([^)]*)\)\s*$/);
  if (!match) return '';
  return infinitiveFromParenInner(match[1]);
}

/**
 * @param {string} correct
 * @param {string} promptBody
 * @return {string}
 */
function infinitiveFromSeparableVerb(correct, promptBody) {
  const stem = finiteToInfinitive(correct);
  if (!stem) return '';

  const sentence = stripTrailingPromptHint(promptBody);
  const particleRe = new RegExp(
    `\\b(${SEPARABLE_PARTICLES.join('|')})\\s*[?.,!]`,
    'i',
  );
  const particle = sentence.match(particleRe);
  if (!particle) return stem;

  const prefix = particle[1].toLowerCase();
  if (stem.startsWith(prefix)) return stem;
  return `${prefix}${stem}`;
}

/**
 * @param {{ prompt?: string, correct?: string[], topic?: string, lemma?: string }} question
 * @return {string}  Lower-case infinitive for display, or empty string.
 */
export function resolveInputTextInfinitive(question) {
  const lemma = String(question.lemma || '').trim().toLowerCase();
  if (lemma) return lemma;

  const fromParen = infinitiveFromTrailingParen(question.prompt || '');
  if (fromParen) return fromParen;

  const topic = String(question.topic || '').toUpperCase();
  const correct = Array.isArray(question.correct) ? question.correct[0] : '';
  if (/TRENNBAREVERBEN/.test(topic)) {
    const sep = infinitiveFromSeparableVerb(correct, question.prompt || '');
    if (sep) return sep;
  }

  const fromAnswer = finiteToInfinitive(correct);
  if (fromAnswer && looksLikeInfinitive(fromAnswer)) return fromAnswer;

  return '';
}
