import { buildSynonymBody } from './emit.mjs';

/**
 * @param {'du'|'Sie'} register
 * @param {string} setKey
 * @param {string} idPrefix e.g. a1-eink
 * @param {Array<{lemma:string,replace:string,hint:string,context:string,options:string[],correct:string[]}>} items
 */
export function makeQuestions(register, setKey, idPrefix, items) {
  return items.map((item, i) => {
    const num = String(i + 1).padStart(3, '0');
    return {
      id: `${idPrefix}-wsn-${num}`,
      set: setKey,
      lemma: item.lemma,
      replace: item.replace,
      hint: item.hint,
      options: item.options,
      correct: item.correct,
      body: buildSynonymBody(register, { context: item.context, replace: item.replace }),
    };
  });
}

/** @param {'du'|'Sie'} register @param {string} level @param {Array<{setKey:string,idPrefix:string,items:object[]}>} specs */
export function buildSynonymSets(register, level, specs) {
  return specs.map(({ setKey, idPrefix, items }) => ({
    level,
    setKey,
    questions: makeQuestions(register, setKey, idPrefix, items),
  }));
}
