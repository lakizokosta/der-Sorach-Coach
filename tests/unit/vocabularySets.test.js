import { describe, it, expect } from 'vitest';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { VOCAB_SETS, getVocabSetsForLevel } from '@/data/vocabularySets.js';

const VOCAB_ROOT = join(process.cwd(), 'src', 'questions-vocab');

function listSetFolders(level) {
  const dir = join(VOCAB_ROOT, level);
  try {
    return readdirSync(dir).filter((name) => {
      const full = join(dir, name);
      return statSync(full).isDirectory() && !name.startsWith('_');
    });
  } catch {
    return [];
  }
}

describe('vocabularySets — catalogue integrity', () => {
  for (const level of ['A1', 'A2', 'B1', 'B2']) {
    it(`${level}: every catalogue entry has a questions folder`, () => {
      const folders = new Set(listSetFolders(level));
      for (const set of getVocabSetsForLevel(level)) {
        expect(folders.has(set.key)).toBe(true);
      }
    });

    it(`${level}: every questions folder is registered in VOCAB_SETS`, () => {
      const registered = new Set((VOCAB_SETS[level] || []).map((s) => s.key));
      for (const folder of listSetFolders(level)) {
        expect(registered.has(folder)).toBe(true);
      }
    });
  }

  it('A1 pilot sets have unique keys and names', () => {
    const sets = getVocabSetsForLevel('A1');
    const keys = sets.map((s) => s.key);
    const names = sets.map((s) => s.name);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(names).size).toBe(names.length);
  });

  it('each set has key, name, desc', () => {
    for (const level of Object.keys(VOCAB_SETS)) {
      for (const set of VOCAB_SETS[level]) {
        expect(set.key).toBeTruthy();
        expect(set.name).toBeTruthy();
        expect(set.desc).toBeTruthy();
      }
    }
  });
});
