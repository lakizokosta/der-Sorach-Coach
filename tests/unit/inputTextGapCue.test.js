import { describe, expect, it } from 'vitest';
import { resolveInputTextGapCue } from '../../src/utils/inputTextGapCue.js';

describe('resolveInputTextGapCue', () => {
  it('uses lemma when present', () => {
    expect(
      resolveInputTextGapCue({
        lemma: 'Student',
        hint: 'N-Deklination — Student, Dat.',
      }),
    ).toBe('Student');
  });

  it('parses N-Deklination hint and capitalises lowercase noun', () => {
    expect(
      resolveInputTextGapCue({
        hint: 'N-Deklination — junge, Akk.',
        prompt: 'Ich kenne einen ___.',
      }),
    ).toBe('Junge');
  });

  it('parses Adjektivdeklination / Komparativ base form', () => {
    expect(resolveInputTextGapCue({ hint: 'Adjektivdeklination — klein, mask., Nom.' })).toBe(
      'klein',
    );
    expect(resolveInputTextGapCue({ hint: 'Komparativ — groß' })).toBe('groß');
  });

  it('parses Akkusativ article cue with article+noun', () => {
    expect(resolveInputTextGapCue({ hint: 'Akkusativ — der Mann, Akk.' })).toBe('der Mann');
  });

  it('parses Gegenteil von / Plural:', () => {
    expect(resolveInputTextGapCue({ hint: 'Gegenteil von groß' })).toBe('groß');
    expect(resolveInputTextGapCue({ hint: 'Plural: Kind' })).toBe('Kind');
  });

  it('parses Artikel Negation cue after colon', () => {
    expect(resolveInputTextGapCue({ hint: 'Artikel — Negation: kein, neutr.' })).toBe('kein');
  });

  it('ignores topic-only hints without a lexical cue', () => {
    expect(resolveInputTextGapCue({ hint: 'Negation' })).toBe('');
    expect(resolveInputTextGapCue({ hint: 'Frage nach Ort' })).toBe('');
  });
});