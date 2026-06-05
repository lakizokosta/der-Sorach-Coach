/**
 * @fileoverview Dictionary helpers — word wrapping plus a MyMemory lookup.
 *
 * The trainer shows clickable words in the question and answer text for
 * Premium users. Clicking a word fetches a translation from MyMemory
 * (https://mymemory.translated.net/) which is free and CORS-friendly.
 *
 * Translations are cached for the lifetime of the tab in `sessionStorage`
 * so repeatedly hovering the same word does not trigger redundant fetches.
 */

import { DICT_STOPWORDS } from '@/data/stopwords.js';

const MEMORY_URL = 'https://api.mymemory.translated.net/get';

/**
 * Wraps every "interesting" word in `text` with a `<span class="dict-word">`
 * so clicking it can be intercepted by the dictionary popup. Stopwords and
 * tokens shorter than three characters are left untouched.
 *
 * @param {string} text  Plain text (no HTML).
 * @return {string}      HTML string with wrapped words.
 */
export function wrapWordsForDictionary(text) {
  if (!text) return '';
  return text.replace(/([А-Яа-яA-Za-zÄÖÜäöüß]+)/g, (word) => {
    if (word.length < 3) return word;
    if (DICT_STOPWORDS.has(word.toLowerCase())) return word;
    const safe = word.replace(/"/g, '&quot;');
    return `<span class="dict-word" data-word="${safe}">${word}</span>`;
  });
}

/**
 * Tidies up the raw translation string from MyMemory: strips HTML entities,
 * collapses whitespace and converts ALL-CAPS results to Title case.
 *
 * @param {string} raw  Raw translation string.
 * @return {string}     Cleaned translation.
 */
export function cleanTranslation(raw) {
  if (!raw) return '';
  let t = raw.replace(/[\r\n]+/g, ' ').trim();
  const ta = document.createElement('textarea');
  ta.innerHTML = t;
  t = ta.value;
  if (t === t.toUpperCase() && t.length > 1) {
    t = t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
  }
  return t;
}

/**
 * Looks up the translation for a single German word via MyMemory.
 *
 * @param {string} word  German word to translate.
 * @param {('RU'|'EN')} lang  Target language code.
 * @return {!Promise<string>} The translated string (or '—' on miss).
 */
export async function translate(word, lang) {
  if (!word) return '';
  const cacheKey = `dict_${word.toLowerCase()}_${lang}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached !== null) return cached;
  const langpair = lang === 'EN' ? 'de|en' : 'de|ru';
  try {
    const url = `${MEMORY_URL}?q=${encodeURIComponent(word)}&langpair=${langpair}`;
    const res = await fetch(url);
    const data = await res.json();
    const raw = (data && data.responseData && data.responseData.translatedText) || '';
    let result = cleanTranslation(raw);
    if (!result || result.toLowerCase() === word.toLowerCase()) result = '—';
    sessionStorage.setItem(cacheKey, result);
    return result;
  } catch {
    return '(Keine Verbindung)';
  }
}
