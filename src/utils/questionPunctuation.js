/**
 * @fileoverview Ensures direct questions end with «?» in trainer content.
 */

const TRAILING_PUNCT = new Set(['?', '!']);

/**
 * @param {Object} question
 * @return {boolean}
 */
export function isInterrogativeQuestion(question) {
  const topic = String(question.topic || '').toUpperCase();
  if (topic === 'W-FRAGEN') return true;

  const prompt = String(question.prompt || '');
  if (/\bW-Frage\b/i.test(prompt)) return true;
  if (/\bFragewort\b/i.test(prompt)) return true;
  if (/\bFrage nach\b/i.test(prompt)) return true;

  return false;
}

/**
 * @param {string} prompt
 * @return {string}
 */
function ensurePromptQuestionMark(prompt) {
  if (!prompt || prompt.includes('?')) return prompt;

  const emIdx = prompt.indexOf(' — ');
  const parenIdx = prompt.indexOf(' (');
  let cut = prompt.length;
  if (emIdx !== -1) cut = Math.min(cut, emIdx);
  if (parenIdx !== -1) cut = Math.min(cut, parenIdx);

  const sentence = prompt.slice(0, cut).trimEnd();
  const rest = prompt.slice(cut);
  if (!sentence) return prompt;

  return `${sentence}?${rest}`;
}

/**
 * @param {!Array<string>} words
 * @return {!Array<string>}
 */
function ensureWordsQuestionMark(words) {
  if (!Array.isArray(words) || !words.length) return words;
  const last = words[words.length - 1];
  if (TRAILING_PUNCT.has(last)) return words;
  return [...words, '?'];
}

/**
 * Mutates the parsed question so direct questions show «?» in the trainer UI.
 *
 * @param {Object} question
 */
export function applyInterrogativePunctuation(question) {
  if (!isInterrogativeQuestion(question)) return question;

  if (question.type === 'dropbox' && Array.isArray(question.words)) {
    question.words = ensureWordsQuestionMark(question.words);
    if (Array.isArray(question.alternatives)) {
      question.alternatives = question.alternatives.map((alt) =>
        ensureWordsQuestionMark(alt),
      );
    }
  } else if (question.prompt) {
    question.prompt = ensurePromptQuestionMark(question.prompt);
  }

  return question;
}
