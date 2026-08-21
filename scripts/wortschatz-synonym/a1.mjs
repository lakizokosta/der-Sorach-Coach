/** A1 — Wortschatz Synonym (150 Fragen, register: du) */
import { buildSynonymSets } from './make-set.mjs';
import { EINKAUFEN } from './data/a1-einkaufen.mjs';
import { SICH_VORSTELLEN } from './data/a1-vorstellen.mjs';
import { MEINE_FAMILIE } from './data/a1-familie.mjs';
import { MEINE_WOHNUNG } from './data/a1-wohnung.mjs';
import { A1_BANK } from './data/a1-bank.mjs';

export const a1SynonymSets = buildSynonymSets('du', 'A1', [
  { setKey: 'EINKAUFEN', idPrefix: 'a1-eink', items: EINKAUFEN },
  { setKey: 'SICH_VORSTELLEN', idPrefix: 'a1-vor', items: SICH_VORSTELLEN },
  { setKey: 'MEINE_FAMILIE', idPrefix: 'a1-fam', items: MEINE_FAMILIE },
  { setKey: 'MEINE_WOHNUNG', idPrefix: 'a1-wohn', items: MEINE_WOHNUNG },
  { setKey: 'AUF_DER_BANK', idPrefix: 'a1-bank', items: A1_BANK },
]);

export { buildSynonymBody } from './emit.mjs';
