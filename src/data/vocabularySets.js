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
        image: '/themes/theme-meine-familie.png',
      },
    },
    {
      key: 'MEINE_WOHNUNG',
      name: 'Meine Wohnung',
      desc: 'Räume, Möbel, mieten — Wohnung beschreiben',
      theme: {
        tint: 'rgba(150, 195, 170, 0.14)',
        accent: '#4a8f6a',
      },
    },
    {
      key: 'AUF_DER_BANK',
      name: 'Auf der Bank',
      desc: 'Konto, Geld, EC-Karte, einzahlen, abheben',
      theme: {
        tint: 'rgba(255, 210, 100, 0.14)',
        accent: '#9a7b2a',
      },
    },
  ],
  A2: [
    {
      key: 'BEIM_ARZT',
      name: 'Beim Arzt',
      desc: 'Symptome, Termin, Rezept, Apotheke',
      theme: {
        tint: 'rgba(120, 180, 200, 0.14)',
        accent: '#2f7a8a',
        image: '/themes/theme-beim-arzt.png',
      },
    },
    {
      key: 'AUF_DER_BANK',
      name: 'Auf der Bank',
      desc: 'Girokonto, Überweisung, Online-Banking, Kontoauszug',
      theme: {
        tint: 'rgba(255, 210, 100, 0.14)',
        accent: '#9a7b2a',
      },
    },
  ],
  B1: [
    {
      key: 'BEIM_ARZT',
      name: 'Beim Arzt',
      desc: 'Untersuchung, Überweisung, Krankschreibung, Nebenwirkungen',
      theme: {
        tint: 'rgba(120, 180, 200, 0.14)',
        accent: '#2f7a8a',
        image: '/themes/theme-beim-arzt.png',
      },
    },
    {
      key: 'AUF_DER_BANK',
      name: 'Auf der Bank',
      desc: 'Kredit, Zinsen, Lastschrift, SEPA, Dispo',
      theme: {
        tint: 'rgba(255, 210, 100, 0.14)',
        accent: '#9a7b2a',
      },
    },
  ],
  B2: [
    {
      key: 'BEIM_ARZT',
      name: 'Beim Arzt',
      desc: 'Anamnese, Klinik, ambulant/stationär, Verträglichkeit',
      theme: {
        tint: 'rgba(120, 180, 200, 0.14)',
        accent: '#2f7a8a',
        image: '/themes/theme-beim-arzt.png',
      },
    },
    {
      key: 'AUF_DER_BANK',
      name: 'Auf der Bank',
      desc: 'Kontokorrent, Bonität, Depot, Compliance, Valuta',
      theme: {
        tint: 'rgba(255, 210, 100, 0.14)',
        accent: '#9a7b2a',
      },
    },
  ],
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
