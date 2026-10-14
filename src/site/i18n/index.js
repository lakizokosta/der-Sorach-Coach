/**
 * Lightweight UI i18n (DE / RU / EN). Questions stay in German.
 */

import { ref, computed } from 'vue';
import de from './locales/de.js';
import ru from './locales/ru.js';
import en from './locales/en.js';

const LOCALE_KEY = 'uiLocale';
const messages = { de, ru, en };

function readStoredLocale() {
  try {
    const saved = localStorage.getItem(LOCALE_KEY);
    if (saved && messages[saved]) return saved;
  } catch {
    /* ignored */
  }
  return 'de';
}

const locale = ref(readStoredLocale());

function applyDocumentLang(code) {
  try {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = code;
    }
  } catch {
    /* ignored */
  }
}

/**
 * @param {string} key  Dot path, e.g. `landing.title`.
 * @param {Record<string, string|number>} [params]
 * @return {string}
 */
function resolve(key, params = {}) {
  const parts = key.split('.');
  let node = messages[locale.value];
  for (const part of parts) {
    if (!node || typeof node !== 'object') {
      node = undefined;
      break;
    }
    node = node[part];
  }
  if (Array.isArray(node)) return node;
  if (typeof node !== 'string') return key;
  return Object.entries(params).reduce((str, [k, v]) => {
    const token = `{${k}}`;
    return str.split(token).join(String(v));
  }, node);
}

/**
 * @param {string} code  `de` | `ru` | `en`
 */
function setLocale(code) {
  if (!messages[code]) return;
  locale.value = code;
  try {
    localStorage.setItem(LOCALE_KEY, code);
  } catch {
    /* ignored */
  }
  applyDocumentLang(code);
}

export const localeLabels = {
  de: 'DE',
  ru: 'RU',
  en: 'EN',
};

export const localeOptions = ['de', 'ru', 'en'];

export function useI18n() {
  return {
    locale,
    setLocale,
    t: resolve,
    localeLabels,
    localeOptions,
  };
}

/** Vue plugin — provides `$t` and `$locale` globally. */
export const i18nPlugin = {
  install(app) {
    applyDocumentLang(locale.value);
    app.config.globalProperties.$t = resolve;
    app.config.globalProperties.$locale = locale;
    app.provide('i18n', {
      locale,
      setLocale,
      t: resolve,
      localeLabels,
      localeOptions,
    });
  },
};

export function t(key, params) {
  return resolve(key, params);
}

export const currentLocale = computed(() => locale.value);
