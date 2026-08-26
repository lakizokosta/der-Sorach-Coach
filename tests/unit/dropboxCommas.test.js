import { describe, expect, it } from 'vitest';
import { resolveDropboxCommas } from '../../src/utils/dropboxCommas.js';

describe('resolveDropboxCommas', () => {
  it('adds comma before trotzdem when it opens a second Hauptsatz (V2)', () => {
    expect(
      resolveDropboxCommas({
        words: ['Es', 'regnet', 'trotzdem', 'fahren', 'wir', 'in', 'den', 'Urlaub'],
        hint: 'Konzessivsatz — trotzdem',
      }),
    ).toEqual([1]);
  });

  it('does not add comma for mid-clause trotzdem', () => {
    expect(
      resolveDropboxCommas({
        words: ['Wir', 'fahren', 'trotzdem', 'in', 'den', 'Urlaub'],
        hint: 'Konzessivsatz — trotzdem',
      }),
    ).toEqual([]);
  });

  it('adds comma before aber / denn between Hauptsätze', () => {
    expect(
      resolveDropboxCommas({
        words: ['Ich', 'mag', 'Kaffee', 'aber', 'Tee', 'trinke', 'ich', 'lieber'],
      }),
    ).toEqual([2]);
    expect(
      resolveDropboxCommas({
        words: ['Ich', 'bleibe', 'zu', 'Hause', 'denn', 'es', 'regnet'],
      }),
    ).toEqual([3]);
  });

  it('adds comma before obwohl Nebensatz', () => {
    expect(
      resolveDropboxCommas({
        words: ['Wir', 'fahren', 'los', 'obwohl', 'es', 'regnet'],
        hint: 'Konzessivsatz — obwohl',
      }),
    ).toEqual([2]);
  });

  it('adds comma before trotzdem when next word is hilft (not in legacy verb list)', () => {
    expect(
      resolveDropboxCommas({
        words: ['Sie', 'hat', 'wenig', 'Zeit', 'trotzdem', 'hilft', 'sie', 'uns'],
        hint: 'Konzessivsatz — trotzdem',
      }),
    ).toEqual([3]);
  });

  it('adds Relativsatz commas for prepositional relative (in der)', () => {
    expect(
      resolveDropboxCommas({
        words: ['Die', 'Stadt', 'in', 'der', 'ich', 'wohne', 'ist', 'klein'],
        hint: 'Relativsatz',
      }),
    ).toEqual([1, 5]);
  });

  it('does not add comma for trotzdem auf Reisen (mid-clause)', () => {
    expect(
      resolveDropboxCommas({
        words: ['Trotz', 'der', 'hohen', 'Kosten', 'gehen', 'wir', 'trotzdem', 'auf', 'Reisen'],
        hint: 'Genitiv-Präposition',
      }),
    ).toEqual([]);
  });
});
