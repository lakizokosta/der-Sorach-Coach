import { describe, expect, it } from 'vitest';
import { resolveInputTextInfinitive } from '../../src/utils/inputTextInfinitive.js';

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
