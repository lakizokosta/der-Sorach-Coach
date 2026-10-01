import { describe, it, expect } from 'vitest';
import {
  extractFixedPunctuation,
  rebuildWordsWithPunctuation,
} from '@/utils/dropboxPunctuation.js';
import {
  dropboxLooksInterrogative,
  ensureDropboxInterrogativePunctuation,
  applyInterrogativePunctuation,
} from '@/utils/questionPunctuation.js';
import { parseQuestionFile } from '@/utils/markdownQuestion.js';

describe('dropboxPunctuation', () => {
  it('peels mid and trailing marks out of words', () => {
    const { coreWords, punctAfter } = extractFixedPunctuation([
      'Kann', 'ich', 'kommen', '?', 'Ja', 'gern', '.',
    ]);
    expect(coreWords).toEqual(['Kann', 'ich', 'kommen', 'Ja', 'gern']);
    expect(punctAfter).toEqual({ 2: '?', 4: '.' });
    expect(rebuildWordsWithPunctuation(coreWords, punctAfter)).toEqual([
      'Kann', 'ich', 'kommen', '?', 'Ja', 'gern', '.',
    ]);
  });
});

describe('ensureDropboxInterrogativePunctuation', () => {
  it('inserts ? and . for Frage + Antwortpartikel dialogues', () => {
    expect(
      ensureDropboxInterrogativePunctuation([
        'Kann', 'ich', 'das', 'auf', 'den', 'Tisch', 'legen', 'ja', 'gern',
      ]),
    ).toEqual([
      'Kann', 'ich', 'das', 'auf', 'den', 'Tisch', 'legen', '?', 'Ja', 'gern', '.',
    ]);
  });

  it('appends ? for pure yes/no questions', () => {
    expect(
      ensureDropboxInterrogativePunctuation(['Kannst', 'du', 'mir', 'helfen']),
    ).toEqual(['Kannst', 'du', 'mir', 'helfen', '?']);
  });

  it('does not treat Sie-imperatives as questions', () => {
    expect(dropboxLooksInterrogative(['Nehmen', 'Sie', 'die', 'Tablette'])).toBe(
      false,
    );
    expect(
      ensureDropboxInterrogativePunctuation(['Nehmen', 'Sie', 'die', 'Tablette']),
    ).toEqual(['Nehmen', 'Sie', 'die', 'Tablette']);
  });

  it('treats modal + Sie as a question', () => {
    expect(dropboxLooksInterrogative(['Können', 'Sie', 'mir', 'helfen'])).toBe(
      true,
    );
  });

  it('leaves statements unchanged', () => {
    expect(
      ensureDropboxInterrogativePunctuation([
        'Ich', 'mag', 'Kaffee', 'aber', 'Tee', 'trinke', 'ich', 'lieber',
      ]),
    ).toEqual([
      'Ich', 'mag', 'Kaffee', 'aber', 'Tee', 'trinke', 'ich', 'lieber',
    ]);
  });
});

describe('parseQuestionFile applies dropbox ?', () => {
  it('adds dialogue punctuation for Antwortpartikeln cards', () => {
    const raw = `---
id: a2-part-dd-016
type: dropbox
words:
  - Kann
  - ich
  - das
  - auf
  - den
  - Tisch
  - legen
  - ja
  - gern
---

Ordne die Wörter zum richtigen Satz: (Antwortpartikel — ja)`;
    const q = parseQuestionFile(raw, {
      level: 'A2',
      topic: 'ANTWORTPARTIKELN',
      path: 'A2/ANTWORTPARTIKELN/a2-part-dd-016.md',
    });
    expect(q.words).toEqual([
      'Kann', 'ich', 'das', 'auf', 'den', 'Tisch', 'legen', '?', 'Ja', 'gern', '.',
    ]);
  });

  it('still auto-marks W-FRAGEN prompts', () => {
    const q = applyInterrogativePunctuation({
      type: 'select-one',
      topic: 'W-FRAGEN',
      prompt: '___ ist das (Fragewort)',
      options: ['Was', 'Wer'],
      correct: 'Was',
    });
    expect(q.prompt).toContain('?');
  });
});
