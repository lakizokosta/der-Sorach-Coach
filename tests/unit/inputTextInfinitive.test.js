import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';
import { parseQuestionFile } from '../../src/site/utils/markdownQuestion.js';
import { resolveInputTextInfinitive } from '../../src/site/utils/inputTextInfinitive.js';

describe('resolveInputTextInfinitive', () => {
  it('does not leak noun lemma as Infinitiv on focus:word gaps', () => {
    expect(
      resolveInputTextInfinitive({
        lemma: 'Husten',
        focus: 'word',
        correct: ['Husten'],
        topic: 'BEIM_ARZT',
        prompt: 'Nachts habe ich starken ___.',
      }),
    ).toBe('');
  });

  it('parsed Konjunktiv II sein gap shows infinitive sein', () => {
    const q = parseQuestionFile(
      readFileSync('src/site/questions/B1/KONJUNKTIV2/b1-k2-in-003.md', 'utf8'),
      { level: 'B1', topic: 'KONJUNKTIV2', path: 'B1/KONJUNKTIV2/b1-k2-in-003.md' },
    );
    expect(q.verbInfinitive).toBe('sein');
  });

  it('uses YAML hint «Verb wissen» for Präteritum gaps (not wusste → wussten)', () => {
    expect(
      resolveInputTextInfinitive({
        hint: 'Präteritum + Verb wissen',
        correct: ['wusste'],
        topic: 'PRÄTERITUMA2',
        prompt: 'Ergänze die Präteritumsform:\n\nIch ___ das nicht.',
      }),
    ).toBe('wissen');
  });

  it('still shows infinitive for conjugated verb answers with focus:word', () => {
    expect(
      resolveInputTextInfinitive({
        lemma: 'machen',
        focus: 'word',
        correct: ['mache'],
        topic: 'VERBEN',
        prompt: 'Ich ___ das.',
      }),
    ).toBe('machen');
  });
});
