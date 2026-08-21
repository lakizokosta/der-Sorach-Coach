/** A2 — Wortschatz Synonym (60 Fragen, register: Sie) */
import { buildSynonymSets } from './make-set.mjs';
import { A2_ARZT } from './data/a2-arzt.mjs';
import { A2_BANK } from './data/a2-bank.mjs';
import { A2_HOBBYS } from './data/a2-hobbys.mjs';

export const a2SynonymSets = buildSynonymSets('Sie', 'A2', [
  { setKey: 'BEIM_ARZT', idPrefix: 'a2-arzt', items: A2_ARZT },
  { setKey: 'AUF_DER_BANK', idPrefix: 'a2-bank', items: A2_BANK },
  { setKey: 'HOBBYS_FREIZEIT', idPrefix: 'a2-hobb', items: A2_HOBBYS },
]);

export { buildSynonymBody } from './emit.mjs';
