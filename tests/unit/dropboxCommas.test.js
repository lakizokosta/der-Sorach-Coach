import { describe, expect, it } from 'vitest';
import { resolveDropboxCommas } from '../../src/site/utils/dropboxCommas.js';

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

  it('adds comma after initial Nebensatz (Wenn / Als …, HS)', () => {
    expect(
      resolveDropboxCommas({
        words: ['Wenn', 'ihr', 'müde', 'seid', 'solltet', 'euch', 'ausruhen', '.'],
        hint: 'Konjunktion — Wenn',
      }),
    ).toEqual([3]);
    expect(
      resolveDropboxCommas({
        words: ['Als', 'wir', 'in', 'Berlin', 'lebten', 'lernte', 'ich', 'viel', '.'],
        hint: 'Temporalsatz',
      }),
    ).toEqual([4]);
    expect(
      resolveDropboxCommas({
        words: ['Als', 'Maria', 'jung', 'war', 'tanzte', 'sie', 'gern', '.'],
        hint: 'Temporalsatz',
      }),
    ).toEqual([3]);
    expect(
      resolveDropboxCommas({
        words: ['Als', 'Maria', 'anrief', 'hatte', 'Tom', 'schon', 'geantwortet', '.'],
        hint: 'Plusquamperfekt',
      }),
    ).toEqual([2]);
  });

  it('puts the Nebensatz comma after the final auxiliary, not after the participle', () => {
    expect(
      resolveDropboxCommas({
        words: ['Nachdem', 'ich', 'die', 'Nachricht', 'gelesen', 'hatte', 'rief', 'Karl', 'zurück', '.'],
        hint: 'Plusquamperfekt',
      }),
    ).toEqual([5]);
    expect(
      resolveDropboxCommas({
        words: ['Weil', 'das', 'Wetter', 'schlecht', 'war', 'blieben', 'wir', 'drinnen', '.'],
        hint: 'Konjunktion — Weil',
      }),
    ).toEqual([4]);
    expect(
      resolveDropboxCommas({
        words: ['Sobald', 'ich', 'im', 'Hotel', 'angekommen', 'bin', 'gehen', 'wir', 'essen', '.'],
        hint: 'Konditionalsatz',
      }),
    ).toEqual([5]);
    expect(
      resolveDropboxCommas({
        words: ['Wenn', 'mir', 'mehr', 'Zeit', 'bliebe', 'würde', 'ich', 'ein', 'Praktikum', 'machen', '.'],
        hint: 'Konjunktiv II',
      }),
    ).toEqual([4]);
  });

  it('does not treat um without zu or V2 Da as subordinators', () => {
    expect(
      resolveDropboxCommas({
        words: ['Kümmerst', 'du', 'dich', 'um', 'die', 'Patienten', '?', '—', 'Ich', 'kümmere', 'mich', 'darum', '.'],
        hint: 'Pronominaladverb',
      }),
    ).toEqual([]);
    expect(
      resolveDropboxCommas({
        words: ['Da', 'ist', 'jemand', 'der', 'mir', 'helfen', 'kann', '.'],
        hint: 'Indefinitpronomen',
      }),
    ).toEqual([]);
  });

  it('does not add comma for Als Kind / Während des (no Nebensatz)', () => {
    expect(
      resolveDropboxCommas({
        words: ['Als', 'Kind', 'wohnte', 'ich', 'auf', 'dem', 'Land', '.'],
        hint: 'Temporalsatz',
      }),
    ).toEqual([]);
    expect(
      resolveDropboxCommas({
        words: ['Als', 'Kind', 'spielte', 'ich', 'gern', 'Fußball', '.'],
        hint: 'Präteritum',
      }),
    ).toEqual([]);
    expect(
      resolveDropboxCommas({
        words: ['Während', 'des', 'Essens', 'sprechen', 'wir', 'über', 'Arbeit', '.'],
        hint: 'Temporalsatz',
      }),
    ).toEqual([]);
  });

  it('adds comma for Während + Nebensatz (Während er kocht, …)', () => {
    expect(
      resolveDropboxCommas({
        words: ['Während', 'er', 'kocht', 'höre', 'ich', 'Radio', '.'],
        hint: 'Temporalsatz',
      }),
    ).toEqual([2]);
  });
});
