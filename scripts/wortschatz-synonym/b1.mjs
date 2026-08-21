/** B1 — Wortschatz Synonym (60 Fragen, register: Sie) */
import { buildSynonymSets } from './make-set.mjs';
import { B1_ARZT } from './data/b1-arzt.mjs';
import { B1_BANK } from './data/b1-bank.mjs';

export const b1SynonymSets = buildSynonymSets('Sie', 'B1', [
  { setKey: 'BEIM_ARZT', idPrefix: 'b1-arzt', items: B1_ARZT },
  { setKey: 'AUF_DER_BANK', idPrefix: 'b1-bank', items: B1_BANK },
]);

export { buildSynonymBody } from './emit.mjs';
