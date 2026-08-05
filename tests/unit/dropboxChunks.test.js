import { describe, expect, it } from 'vitest';
import {
  chunkifyDropboxWords,
  commaAfterChunk,
  flattenDropboxChunks,
} from '../../src/utils/dropboxChunks.js';

describe('chunkifyDropboxWords', () => {
  it('keeps single-word chips for short sentences', () => {
    const words = ['Die', 'Bank', 'ist', 'gegenüber', 'der', 'Post'];
    const chunks = chunkifyDropboxWords(words);
    expect(chunks).toHaveLength(6);
    expect(chunks.every((c) => c.words.length === 1)).toBe(true);
  });

  it('groups long Lokalpräposition sentence into meaningful blocks', () => {
    const words = [
      'Vom', 'Bahnhofsplatz', 'aus', 'sieht', 'man', 'das', 'Hotel',
      'nicht', 'es', 'liegt', 'hinter', 'dem', 'Bahnhof',
    ];
    const chunks = chunkifyDropboxWords(words);
    expect(flattenDropboxChunks(chunks)).toEqual(words);
    expect(chunks.map((c) => c.text)).toEqual([
      'Vom Bahnhofsplatz aus',
      'sieht man',
      'das Hotel',
      'nicht',
      'es liegt',
      'hinter dem Bahnhof',
    ]);
  });

  it('groups article phrases and prep phrases in medium-long sentences', () => {
    const words = ['Das', 'Kind', 'steht', 'neben', 'der', 'Mutter', 'beim', 'Einkaufen'];
    const chunks = chunkifyDropboxWords(words);
    expect(chunks.map((c) => c.text)).toEqual([
      'Das Kind',
      'steht',
      'neben der Mutter',
      'beim Einkaufen',
    ]);
  });

  it('groups article + adjective + noun inside prep phrase', () => {
    const words = ['Das', 'Büro', 'ist', 'auf', 'der', 'zweiten', 'Etage', 'heute'];
    const chunks = chunkifyDropboxWords(words);
    expect(chunks.some((c) => c.text === 'auf der zweiten Etage')).toBe(true);
  });
});

describe('commaAfterChunk', () => {
  it('maps comma positions from word indices to chunk boundaries', () => {
    const chunks = chunkifyDropboxWords([
      'Wenn', 'er', 'kommt', 'gehe', 'ich', 'nach', 'Hause', 'sofort',
    ], { minWords: 8 });
    expect(commaAfterChunk(chunks, 2, [2])).toBe(true);
    expect(commaAfterChunk(chunks, 1, [2])).toBe(false);
  });
});
