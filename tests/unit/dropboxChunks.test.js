import { describe, expect, it } from 'vitest';
import {
  chunkifyDropboxWords,
  commaAfterChunk,
  flattenDropboxChunks,
} from '../../src/site/utils/dropboxChunks.js';

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

  it('groups B1 Finalsatz into Hauptsatz and Nebensatz blocks', () => {
    const words = [
      'Sie', 'schreibt', 'eine', 'Zusammenfassung', 'damit', 'der', 'Chef', 'sie', 'schnell', 'liest',
    ];
    const chunks = chunkifyDropboxWords(words, { commas: [3] });
    expect(flattenDropboxChunks(chunks)).toEqual(words);
    expect(chunks.map((c) => c.text)).toEqual([
      'Sie schreibt eine Zusammenfassung',
      'damit der Chef sie schnell liest',
    ]);
  });

  it('groups um … zu Finalsatz at comma before um', () => {
    const words = ['Er', 'lernt', 'Deutsch', 'um', 'in', 'Berlin', 'arbeiten', 'zu', 'können'];
    const chunks = chunkifyDropboxWords(words, { commas: [2] });
    expect(chunks.map((c) => c.text)).toEqual([
      'Er lernt Deutsch',
      'um in Berlin arbeiten zu können',
    ]);
  });

  it('groups Konditionalsatz at comma after Nebensatz', () => {
    const words = ['Wenn', 'er', 'kommt', 'gehe', 'ich', 'nach', 'Hause', 'sofort'];
    const chunks = chunkifyDropboxWords(words, { commas: [2] });
    expect(chunks.map((c) => c.text)).toEqual([
      'Wenn er kommt',
      'gehe ich nach Hause sofort',
    ]);
  });

  it('groups Relativsatz into three clause blocks', () => {
    const words = ['Der', 'Minister', 'dessen', 'Entscheidung', 'umstritten', 'ist', 'spricht', 'heute'];
    const chunks = chunkifyDropboxWords(words, { commas: [1, 5] });
    expect(chunks.map((c) => c.text)).toEqual([
      'Der Minister',
      'dessen Entscheidung umstritten ist',
      'spricht heute',
    ]);
  });

  it('keeps clock-time um as a prep phrase in long sentences', () => {
    const words = ['Ich', 'gebe', 'den', 'Brief', 'um', 'neun', 'Uhr', 'ab'];
    const chunks = chunkifyDropboxWords(words);
    expect(chunks.some((c) => c.text === 'um neun Uhr')).toBe(true);
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
