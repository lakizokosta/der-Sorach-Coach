/**
 * @fileoverview Premium Wortschatz sets — separate from grammar topics.
 *
 * Each set maps to Markdown under `src/questions-vocab/<LEVEL>/<KEY>/`.
 */

/** @type {Record<string, Array<{key:string, name:string, desc:string, theme?:{tint:string, accent:string, image:string}}>>} */
export const VOCAB_SETS = {
  A1: [
    {
      key: 'EINKAUFEN',
      name: 'Einkaufen',
      desc: 'Lebensmittel, Preise, im Geschäft',
      theme: {
        tint: 'rgba(255, 196, 120, 0.14)',
        accent: '#c47a2a',
        image: '/themes/theme-einkaufen.png',
      },
    },
    {
      key: 'SICH_VORSTELLEN',
      name: 'Sich vorstellen',
      desc: 'Name, Herkunft, Beruf, Hobbys',
      theme: {
        tint: 'rgba(140, 190, 255, 0.12)',
        accent: '#3d6fb5',
        image: '/themes/theme-sich-vorstellen.png',
      },
    },
    {
      key: 'MEINE_FAMILIE',
      name: 'Meine Familie',
      desc: 'Familie — Onkel, Tante, Cousins, Enkel, Neffen …',
      theme: {
        tint: 'rgba(255, 170, 190, 0.14)',
        accent: '#c45a7a',
      },
    },
  ],
  A2: [],
  B1: [],
  B2: [],
};

/**
 * @param {('A1'|'A2'|'B1'|'B2')} level
 * @return {!Array<{key:string, name:string, desc:string, theme?:object}>}
 */
export function getVocabSetsForLevel(level) {
  const upper = String(level || '').toUpperCase();
  return VOCAB_SETS[upper] || [];
}

/**
 * @param {string} level
 * @param {string} setKey
 * @return {?{tint:string, accent:string, image:string}}
 */
export function getVocabSetTheme(level, setKey) {
  const target = String(setKey || '').toUpperCase();
  const set = getVocabSetsForLevel(level).find((s) => s.key === target);
  return set?.theme || null;
}
