/**
 * B2 dropbox banks — TeKaMoLo word ordering with T/K/M/L codes.
 */

import { cycle50 } from './b1-dropbox-shared.mjs';

const TEKAMOLO_RAW = [
  {
    hint: 'TeKaMoLo — morgen / wegen Konferenz / mit Zug / nach Berlin',
    words: ['Er', 'fährt', 'morgen', 'wegen', 'der', 'Konferenz', 'mit', 'dem', 'Zug', 'nach', 'Berlin'],
    codes: ['_', '_', 'T', 'K', 'K', 'K', 'M', 'M', 'M', 'L', 'L'],
  },
  {
    hint: 'TeKaMoLo — heute / aus beruflichen Gründen / sorgfältig / im Labor',
    words: ['Sie', 'arbeitet', 'heute', 'aus', 'beruflichen', 'Gründen', 'besonders', 'sorgfältig', 'im', 'Labor'],
    codes: ['_', '_', 'T', 'K', 'K', 'K', 'M', 'M', 'L', 'L'],
  },
  {
    hint: 'TeKaMoLo — morgen / wegen Termin / pünktlich / im Büro',
    words: ['Wir', 'treffen', 'uns', 'morgen', 'wegen', 'des', 'Termins', 'pünktlich', 'im', 'Büro'],
    codes: ['_', '_', '_', 'T', 'K', 'K', 'K', 'M', 'L', 'L'],
  },
  {
    hint: 'TeKaMoLo — abends / aus Interesse / regelmäßig / die Zeitung',
    words: ['Er', 'liest', 'abends', 'aus', 'Interesse', 'an', 'Politik', 'regelmäßig', 'die', 'Zeitung'],
    codes: ['_', '_', 'T', 'K', 'K', 'K', 'K', 'M', 'L', 'L'],
  },
  {
    hint: 'TeKaMoLo — nächste Woche / wegen Messe / geschäftlich / nach Hamburg',
    words: ['Sie', 'fährt', 'nächste', 'Woche', 'wegen', 'der', 'Messe', 'geschäftlich', 'nach', 'Hamburg'],
    codes: ['_', '_', 'T', 'T', 'K', 'K', 'K', 'M', 'L', 'L'],
  },
  {
    hint: 'TeKaMoLo — heute / wegen Deadline / schnell / den Bericht',
    words: ['Er', 'schreibt', 'heute', 'wegen', 'der', 'Deadline', 'besonders', 'schnell', 'den', 'Bericht'],
    codes: ['_', '_', 'T', 'K', 'K', 'K', 'M', 'M', 'L', 'L'],
  },
  {
    hint: 'TeKaMoLo — heute Abend / aus Zeitgründen / schnell / zu Hause',
    words: ['Wir', 'essen', 'heute', 'Abend', 'aus', 'Zeitgründen', 'schnell', 'zu', 'Hause'],
    codes: ['_', '_', 'T', 'T', 'K', 'K', 'M', 'L', 'L'],
  },
  {
    hint: 'TeKaMoLo — täglich / wegen Prüfung / intensiv / im Selbststudium',
    words: ['Sie', 'lernt', 'täglich', 'wegen', 'der', 'Prüfung', 'intensiv', 'im', 'Selbststudium'],
    codes: ['_', '_', 'T', 'K', 'K', 'K', 'M', 'L', 'L'],
  },
  {
    hint: 'TeKaMoLo — morgen / wegen Meeting / früh / ins Büro',
    words: ['Er', 'kommt', 'morgen', 'wegen', 'des', 'Meetings', 'früh', 'ins', 'Büro'],
    codes: ['_', '_', 'T', 'K', 'K', 'K', 'M', 'L', 'L'],
  },
  {
    hint: 'TeKaMoLo — heute / aus beruflichen Gründen / viel / mit Kunden',
    words: ['Sie', 'telefoniert', 'heute', 'aus', 'beruflichen', 'Gründen', 'viel', 'mit', 'Kunden'],
    codes: ['_', '_', 'T', 'K', 'K', 'K', 'M', 'M', 'L'],
  },
  {
    hint: 'TeKaMoLo — am Wochenende / wegen Wetter / lieber / nach Süden',
    words: ['Wir', 'fahren', 'am', 'Wochenende', 'wegen', 'des', 'Wetters', 'lieber', 'nach', 'Süden'],
    codes: ['_', '_', 'T', 'T', 'K', 'K', 'K', 'M', 'L', 'L'],
  },
  {
    hint: 'TeKaMoLo — morgens / aus gesundheitlichen Gründen / regelmäßig / im Park',
    words: ['Er', 'trainiert', 'morgens', 'aus', 'gesundheitlichen', 'Gründen', 'regelmäßig', 'im', 'Park'],
    codes: ['_', '_', 'T', 'K', 'K', 'K', 'M', 'L', 'L'],
  },
  {
    hint: 'TeKaMoLo — nächsten Monat / wegen Projekt / beruflich / nach Wien',
    words: ['Sie', 'reist', 'nächsten', 'Monat', 'wegen', 'des', 'Projekts', 'beruflich', 'nach', 'Wien'],
    codes: ['_', '_', 'T', 'T', 'K', 'K', 'K', 'M', 'L', 'L'],
  },
  {
    hint: 'TeKaMoLo — heute / wegen Gäste / aufwendig / in der Küche',
    words: ['Er', 'kocht', 'heute', 'wegen', 'der', 'Gäste', 'aufwendig', 'in', 'seiner', 'Küche'],
    codes: ['_', '_', 'T', 'K', 'K', 'K', 'M', 'L', 'L', 'L'],
  },
  {
    hint: 'TeKaMoLo — heute / wegen Krise / ausführlich / im Team',
    words: ['Wir', 'diskutieren', 'heute', 'wegen', 'der', 'Krise', 'ausführlich', 'im', 'Team'],
    codes: ['_', '_', 'T', 'K', 'K', 'K', 'M', 'L', 'L'],
  },
  {
    hint: 'TeKaMoLo — nachts / wegen Lärm / schlecht / im Hotelzimmer',
    words: ['Sie', 'schläft', 'nachts', 'wegen', 'des', 'Lärms', 'schlecht', 'im', 'Hotelzimmer'],
    codes: ['_', '_', 'T', 'K', 'K', 'K', 'M', 'L', 'L'],
  },
  {
    hint: 'TeKaMoLo — morgen / wegen Konferenz / professionell / die Ergebnisse',
    words: ['Er', 'präsentiert', 'morgen', 'wegen', 'der', 'Konferenz', 'professionell', 'die', 'Ergebnisse'],
    codes: ['_', '_', 'T', 'K', 'K', 'K', 'M', 'L', 'L'],
  },
];

export const BANK = {
  TEKAMOLO: cycle50(TEKAMOLO_RAW),
};
