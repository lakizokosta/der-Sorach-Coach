/**
 * @fileoverview Dictionary helpers — word wrapping and local lookup.
 *
 * Premium users click words in question text. Lookup order:
 *   1. Stopwords / grammar meta → not clickable
 *   2. Lemma resolution (verb/adj inflection maps from question bank)
 *   3. Local `vocabulary.json` (+ seed merges at build time)
 *
 * MyMemory is not used at runtime (too unreliable). Build-time fetch remains
 * optional via `npm run dictionary:build:fetch` for drafting vocabulary.json.
 */

import { isDictStopword } from '@/data/stopwords.js';
import { isDictMetaSkipped } from '@/data/dictMeta.js';
import verbLemmas from '@/data/verbLemmas.json';
import adjLemmas from '@/data/adjLemmas.json';
import nounLemmas from '@/data/nounLemmas.json';
import vocabulary from '@/data/vocabulary.json';

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
  if (nounLemmas[key]) {
    const lemma = nounLemmas[key];
    const entry = vocabulary[lemma];
    return { form, lemma, pos: entry?.pos || 'noun' };
  }
  const entry = vocabulary[key];
  if (entry) {
    return { form, lemma: key, pos: entry.pos || null };
  }
  return { form, lemma: key, pos: null };
}

/**
 * Maps UI locale to foreign-language gloss target(s). Never German→German.
 *
 * @param {string} uiLocale  `de` | `ru` | `en`
 * @return {('ru'|'en')[]}
 */
export function resolveDictionaryTargetLangs(uiLocale) {
  if (uiLocale === 'en') return ['en'];
  if (uiLocale === 'ru') return ['ru'];
  return ['ru', 'en'];
}

/**
 * @param {string} lemma
 * @param {'ru'|'en'} lang
 * @return {string|null}
 */
export function getLocalTranslation(lemma, lang) {
  const entry = vocabulary[String(lemma || '').toLowerCase()];
  if (!entry) return null;
  const raw = lang === 'en' ? entry.en : entry.ru;
  if (!raw || /MYMEMORY WARNING/i.test(raw)) return null;
  return raw;
}

/**
 * @param {string} text
 * @param {string} lemma
 * @param {'ru'|'en'} lang
 * @return {boolean}
 */
function isUsableTranslation(text, lemma, lang) {
  if (!text || text === '—') return false;
  if (text.toLowerCase() === lemma.toLowerCase()) return false;
  if (lang === 'ru' && !/[а-яё]/i.test(text) && /^[a-zäöüß0-9\s.,/()-]+$/i.test(text)) {
    return false;
  }
  return true;
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
 * @param {string} lemma
 * @param {'ru'|'en'} targetLang
 * @return {{ translation: string, source: 'local'|'none' }}
 */
function lookupLemmaInLang(lemma, targetLang) {
  const local = getLocalTranslation(lemma, targetLang);
  if (local && isUsableTranslation(local, lemma, targetLang)) {
    return { translation: local, source: 'local' };
  }
  return { translation: '—', source: 'none' };
}

/**
 * @param {string} word
 * @param {string} uiLocale  `de` | `ru` | `en`
 * @return {Promise<{ translation: string, lemma: string, pos: string|null, gender: string|null, source: 'local'|'none', targetLang: 'ru'|'en' }>}
 */
export async function lookupWord(word, uiLocale) {
  const { form, lemma, pos } = resolveLemma(word);
  const gender = getNounGender(lemma);
  const entry = vocabulary[lemma];
  const resolvedPos = pos || entry?.pos || null;
  const langs = resolveDictionaryTargetLangs(uiLocale);

  let last = { translation: '—', source: /** @type {'none'} */ ('none'), targetLang: langs[0] };

  for (const targetLang of langs) {
    const hit = lookupLemmaInLang(lemma, targetLang);
    last = { ...hit, targetLang };
    if (hit.source !== 'none' && hit.translation !== '—') {
      return {
        translation: hit.translation,
        lemma,
        pos: resolvedPos,
        gender,
        source: hit.source,
        targetLang,
      };
    }
  }

  return {
    translation: last.translation,
    lemma,
    pos: resolvedPos,
    gender,
    source: last.source,
    targetLang: last.targetLang,
  };
}

/** @deprecated Use lookupWord — kept for gradual migration. */
export async function translate(word, lang) {
  const uiLocale =
    lang === 'EN' || lang === 'en'
      ? 'en'
      : lang === 'RU' || lang === 'ru'
        ? 'ru'
        : 'de';
  const result = await lookupWord(word, uiLocale);
  return result.translation;
}
