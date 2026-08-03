import { describe, it, expect } from 'vitest';
import {
  parseQuestionFile,
  stripTrailingPromptHint,
  extractTrailingPromptHint,
  normalizeGapAnswer,
} from '@/utils/markdownQuestion.js';

const CTX = { level: 'A1', topic: 'ARTIKEL', path: 'A1/ARTIKEL/test.md' };

describe('markdownQuestion — helpers', () => {
  it('stripTrailingPromptHint removes parenthetical suffix', () => {
    expect(stripTrailingPromptHint('Als Kind ___ ich oft. (haben)')).toBe('Als Kind ___ ich oft.');
  });

  it('extractTrailingPromptHint returns inner text', () => {
    expect(extractTrailingPromptHint('Text (Perfekt mit haben)')).toBe('Perfekt mit haben');
    expect(extractTrailingPromptHint('No hint here')).toBe('');
  });

  it('normalizeGapAnswer trims, lowercases, collapses spaces', () => {
    expect(normalizeGapAnswer('  Der  ')).toBe('der');
    expect(normalizeGapAnswer('Habe  Gegessen')).toBe('habe gegessen');
  });
});

describe('markdownQuestion — select-one', () => {
  const raw = `---
id: test-1
type: select-one
options:
  - Der
  - Die
  - Das
correct: Der
---

___ Tisch ist neu.`;

  it('parses valid select-one', () => {
    const q = parseQuestionFile(raw, CTX);
    expect(q.id).toBe('test-1');
    expect(q.type).toBe('select-one');
    expect(q.options).toEqual(['Der', 'Die', 'Das']);
    expect(q.correct).toBe('Der');
    expect(q.prompt).toContain('Tisch');
  });

  it('rejects correct not in options', () => {
    const bad = raw.replace('correct: Der', 'correct: Den');
    expect(() => parseQuestionFile(bad, CTX)).toThrow(/must appear in options/);
  });
});

describe('markdownQuestion — input-text', () => {
  it('accepts multiple correct variants', () => {
    const raw = `---
id: fill-1
type: input-text
correct:
  - habe
  - Habe
---

Ich ___ Zeit.`;
    const q = parseQuestionFile(raw, CTX);
    expect(q.correct).toEqual(['habe', 'Habe']);
  });
});

describe('markdownQuestion — dropbox', () => {
  it('parses words and validates alternatives', () => {
    const raw = `---
id: dd-1
type: dropbox
words:
  - Heute
  - gehe
  - ich
  - ins
  - Kino
---

Ordne die Wörter.`;
    const q = parseQuestionFile(raw, CTX);
    expect(q.words).toHaveLength(5);
  });
});

describe('markdownQuestion — text-gaps', () => {
  it('requires gap count to match correct/options', () => {
    const raw = `---
id: tg-1
type: text-gaps
correct:
  - der
options:
  - der,die,das
---

___ Mann liest.`;
    const q = parseQuestionFile(raw, CTX);
    expect(q.gaps).toHaveLength(1);
    expect(q.gaps[0].options).toEqual(['der', 'die', 'das']);
  });

  it('rejects mismatched gap count', () => {
    const raw = `---
id: tg-bad
type: text-gaps
correct:
  - der
  - die
options:
  - der,die,das
  - der,die,das
---

Nur ___ Lücke.`;
    expect(() => parseQuestionFile(raw, CTX)).toThrow(/1 "___" in body but 2 gap/);
  });
});

describe('markdownQuestion — vocab metadata', () => {
  it('preserves lemma, set, focus from frontmatter', () => {
    const raw = `---
id: a1-wohn-so-001
type: select-one
lemma: Wohnung
set: MEINE_WOHNUNG
focus: word
options:
  - Wohnung
  - Küche
correct: Wohnung
---

Das ist meine ___.`;
    const q = parseQuestionFile(raw, { level: 'A1', topic: 'MEINE_WOHNUNG', path: 'vocab.md' });
    expect(q.lemma).toBe('Wohnung');
    expect(q.set).toBe('MEINE_WOHNUNG');
    expect(q.focus).toBe('word');
  });
});

describe('markdownQuestion — errors', () => {
  it('throws on missing frontmatter', () => {
    expect(() => parseQuestionFile('no yaml here', CTX)).toThrow(/Missing YAML frontmatter/);
  });

  it('throws on unknown type', () => {
    const raw = `---
id: x
type: unknown-type
---
Body.`;
    expect(() => parseQuestionFile(raw, CTX)).toThrow(/Unknown question type/);
  });
});
