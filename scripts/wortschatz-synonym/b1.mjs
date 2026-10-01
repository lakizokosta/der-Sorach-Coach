/** B1 — Wortschatz Synonym (60 Fragen, register: Sie) */
import { buildSynonymSets } from './make-set.mjs';
import { B1_ARZT } from './data/b1-arzt.mjs';
import { B1_BANK } from './data/b1-bank.mjs';
import { B1_HOBBYS } from './data/b1-hobbys.mjs';
import { B1_JOBS } from './data/b1-jobs.mjs';
import { B1_BURO } from './data/b1-buro.mjs';
import { B1_REDE } from './data/b1-rede.mjs';

export const b1SynonymSets = buildSynonymSets('Sie', 'B1', [
  { setKey: 'BEIM_ARZT', idPrefix: 'b1-arzt', items: B1_ARZT },
  { setKey: 'AUF_DER_BANK', idPrefix: 'b1-bank', items: B1_BANK },
  { setKey: 'HOBBYS_FREIZEIT', idPrefix: 'b1-hobb', items: B1_HOBBYS },
  { setKey: 'JOB_SUCHE', idPrefix: 'b1-jobs', items: B1_JOBS },
  { setKey: 'BUEROKRATIE', idPrefix: 'b1-buro', items: B1_BURO },
  { setKey: 'REDEWENDUNGEN', idPrefix: 'b1-rede', items: B1_REDE },
]);

export { buildSynonymBody } from './emit.mjs';
