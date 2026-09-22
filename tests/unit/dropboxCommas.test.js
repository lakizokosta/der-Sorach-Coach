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

  it('adds comma before dennoch blieb (strong past finite)', () => {
    expect(
      resolveDropboxCommas({
        words: ['Das', 'Essen', 'war', 'teuer', 'dennoch', 'blieb', 'die', 'Qualität', 'hoch'],
        hint: 'Konjunktionaladverb',
      }),
    ).toEqual([3]);
  });

  it('does not treat Als Abgeordneter / Seit dem as Nebensatz openers', () => {
    expect(
      resolveDropboxCommas({
        words: ['Als', 'Abgeordneter', 'haben', 'Sie', 'ein', 'dickes', 'Fell', '.'],
      }),
    ).toEqual([]);
    expect(
      resolveDropboxCommas({
        words: ['Seit', 'dem', 'Konzert', 'haben', 'Sie', 'einen', 'Ohrwurm', '.'],
      }),
    ).toEqual([]);
  });

  it('adds comma after Ja / Nein / Doch as Antwortpartikel', () => {
    expect(
      resolveDropboxCommas({
        words: ['Nein', 'die', 'Wohnung', 'ist', 'günstig', '.'],
        hint: 'Antwortpartikel — nein',
      }),
    ).toEqual([0]);
    expect(
      resolveDropboxCommas({
        words: ['Kann', 'ich', 'das', 'auf', 'den', 'Tisch', 'legen', '?', 'Ja', 'gern', '.'],
        hint: 'Antwortpartikel — ja',
      }),
    ).toEqual([7]); // core without ?: Kann ich das auf den Tisch legen Ja gern
    expect(
      resolveDropboxCommas({
        words: ['Doch', 'ich', 'komme', 'bestimmt', 'zur', 'Hochzeit', '.'],
        hint: 'Antwortpartikel — doch',
      }),
    ).toEqual([0]);
  });

  it('keeps comma before mid-sentence adversative doch (not after)', () => {
    expect(
      resolveDropboxCommas({
        words: ['Es', 'ist', 'teuer', 'doch', 'wir', 'kaufen', 'es'],
      }),
    ).toEqual([2]);
  });
});
