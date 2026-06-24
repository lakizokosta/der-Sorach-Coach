/**
 * @fileoverview Dictionary helpers — word wrapping and local lookup.
 *
 * Premium users click words in question text. Lookup order:
 *   1. Stopwords / grammar meta → not clickable
 *   2. Lemma resolution (verb/adj inflection maps from question bank)
 *   3. Local `vocabulary.json` (+ seed merges at build time)
 *   4. MyMemory API fallback (cached in sessionStorage)
 */

import { isDictStopword } from '@/data/stopwords.js';
import { isDictMetaSkipped } from '@/data/dictMeta.js';
import verbLemmas from '@/data/verbLemmas.json';
import adjLemmas from '@/data/adjLemmas.json';
import vocabulary from '@/data/vocabulary.json';

const MEMORY_URL = 'https://api.mymemory.translated.net/get';

/** @param {string} word */
export function shouldSkipDictionaryWord(word) {
  const w = String(word || '').toLowerCase();
  if (w.length < 3) return true;
  if (isDictStopword(w)) return true;
  if (isDictMetaSkipped(w)) return true;
  return false;
}

/**
 * @param {string} word  Clicked surface form.
 * @return {{ form: string, lemma: string, pos: string | null }}
 */
export function resolveLemma(word) {
  const form = String(word || '').trim();
  const key = form.toLowerCase();
  if (verbLemmas[key]) {
    return { form, lemma: verbLemmas[key], pos: 'verb' };
  }
  if (adjLemmas[key]) {
    return { form, lemma: adjLemmas[key], pos: 'adj' };
  }
  const entry = vocabulary[key];
  if (entry) {
    return { form, lemma: key, pos: entry.pos || null };
  }
  return { form, lemma: key, pos: null };
}

/**
 * @param {string} lemma
 * @param {'ru'|'en'|'de'} lang
 * @return {string|null}
 */
export function getLocalTranslation(lemma, lang) {
  const entry = vocabulary[String(lemma || '').toLowerCase()];
  if (!entry) return null;
  if (lang === 'de') return null;
  if (lang === 'en') return entry.en || null;
  return entry.ru || null;
}

/**
 * @param {string} lemma
 * @return {string|null}  `m` | `f` | `n`
 */
export function getNounGender(lemma) {
  const entry = vocabulary[String(lemma || '').toLowerCase()];
  return entry?.gender || null;
}

/**
 * Wraps every "interesting" word in `text` with a clickable span.
 *
 * @param {string} text  Plain text (no HTML).
 * @return {string}      HTML string with wrapped words.
 */
export function wrapWordsForDictionary(text) {
  if (!text) return '';
  return text.replace(/([А-Яа-яA-Za-zÄÖÜäöüß]+)/g, (word) => {
    if (shouldSkipDictionaryWord(word)) return word;
    const safe = word.replace(/"/g, '&quot;');
    return `<span class="dict-word" data-word="${safe}">${word}</span>`;
  });
}

/**
 * @param {string} raw
 * @return {string}
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
 * @param {string} word
 * @param {('ru'|'en'|'de')} lang
 * @return {Promise<{ translation: string, lemma: string, pos: string|null, gender: string|null, source: 'local'|'api'|'none' }>}
 */
export async function lookupWord(word, lang) {
  const { form, lemma, pos } = resolveLemma(word);
  const gender = getNounGender(lemma);
  const targetLang = lang === 'de' ? 'de' : lang;

  if (targetLang === 'de') {
    const entry = vocabulary[lemma];
    const label = entry?.pos === 'verb'
      ? `Infinitiv: ${lemma}`
      : entry?.pos === 'adj'
        ? `Grundform: ${lemma}`
        : entry?.pos === 'noun' && gender
          ? `${lemma} (${gender}.)`
          : lemma;
    return { translation: label, lemma, pos: pos || entry?.pos || null, gender, source: 'local' };
  }

  const local = getLocalTranslation(lemma, targetLang);
  if (local) {
    return { translation: local, lemma, pos, gender, source: 'local' };
  }

  const cacheKey = `dict_${lemma}_${targetLang}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached !== null) {
    return {
      translation: cached || '—',
      lemma,
      pos,
      gender,
      source: cached ? 'api' : 'none',
    };
  }

  const langpair = targetLang === 'en' ? 'de|en' : 'de|ru';
  try {
    const url = `${MEMORY_URL}?q=${encodeURIComponent(lemma)}&langpair=${langpair}`;
    const res = await fetch(url);
    const data = await res.json();
    const raw = data?.responseData?.translatedText || '';
    let result = cleanTranslation(raw);
    if (!result || result.toLowerCase() === lemma.toLowerCase()) result = '—';
    sessionStorage.setItem(cacheKey, result);
    return { translation: result, lemma, pos, gender, source: result === '—' ? 'none' : 'api' };
  } catch {
    return { translation: '(Keine Verbindung)', lemma, pos, gender, source: 'none' };
  }
}

/** @deprecated Use lookupWord — kept for gradual migration. */
export async function translate(word, lang) {
  const code = lang === 'EN' ? 'en' : lang === 'RU' ? 'ru' : String(lang).toLowerCase();
  const result = await lookupWord(word, code);
  return result.translation;
}
