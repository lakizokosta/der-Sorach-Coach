/** B2 — Wortschatz Synonym (60 Fragen, register: Sie) */
import { buildSynonymSets } from './make-set.mjs';
import { B2_ARZT } from './data/b2-arzt.mjs';
import { B2_BANK } from './data/b2-bank.mjs';
import { B2_HOBBYS } from './data/b2-hobbys.mjs';

export const b2SynonymSets = buildSynonymSets('Sie', 'B2', [
  { setKey: 'BEIM_ARZT', idPrefix: 'b2-arzt', items: B2_ARZT },
  { setKey: 'AUF_DER_BANK', idPrefix: 'b2-bank', items: B2_BANK },
  { setKey: 'HOBBYS_FREIZEIT', idPrefix: 'b2-hobb', items: B2_HOBBYS },
]);

export { buildSynonymBody } from './emit.mjs';
