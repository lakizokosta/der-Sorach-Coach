import { describe, it, expect } from 'vitest';
import {
  questionContentFingerprint,
  dedupeIdenticalQuestions,
} from '@/utils/dedupeQuestions.js';

describe('dedupeQuestions', () => {
  it('same select-one prompt+correct → same fingerprint', () => {
    const a = { id: '1', type: 'select-one', prompt: '___ Buch', correct: 'Das' };
    const b = { id: '2', type: 'select-one', prompt: '___ Buch', correct: 'Das' };
    expect(questionContentFingerprint(a)).toBe(questionContentFingerprint(b));
  });

  it('different types with same sentence → different fingerprints', () => {
    const select = { id: '1', type: 'select-one', prompt: '___ Buch', correct: 'Das' };
    const input = { id: '2', type: 'input-text', prompt: '___ Buch', correct: ['Das'] };
    expect(questionContentFingerprint(select)).not.toBe(questionContentFingerprint(input));
  });

  it('dedupeIdenticalQuestions keeps one survivor per group', () => {
    const questions = [
      { id: 'a', type: 'select-one', prompt: 'Same', correct: 'x' },
      { id: 'b', type: 'select-one', prompt: 'Same', correct: 'x' },
      { id: 'c', type: 'select-one', prompt: 'Other', correct: 'y' },
    ];
    const result = dedupeIdenticalQuestions(questions);
    expect(result).toHaveLength(2);
  });

  it('input-text fingerprint is case-insensitive per answer token', () => {
    const a = { id: '1', type: 'input-text', prompt: 'Ich ___', correct: ['Habe'] };
    const b = { id: '2', type: 'input-text', prompt: 'Ich ___', correct: ['habe'] };
    expect(questionContentFingerprint(a)).toBe(questionContentFingerprint(b));
  });
});
