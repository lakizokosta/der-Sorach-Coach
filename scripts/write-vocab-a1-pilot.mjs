#!/usr/bin/env node
/**
 * One-off writer for A1 pilot vocab sets (Einkaufen, Sich vorstellen).
 * Run: node scripts/write-vocab-a1-pilot.mjs
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = join(ROOT, 'src', 'questions-vocab', 'A1');

/** @param {string} dir @param {string} name @param {string} body */
function writeQ(dir, name, body) {
  const folder = join(BASE, dir);
  mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, `${name}.md`), `${body.trim()}\n`, 'utf8');
}

const EINKAUFEN = [
  {
    id: 'a1-eink-so-001', type: 'select-one', lemma: 'Supermarkt',
    fm: `options:
  - Supermarkt
  - Unterricht
  - Urlaub
correct: Supermarkt`,
    body: 'Wo kaufst du Brot und Milch?\n\nIch gehe in den ___.',
  },
  {
    id: 'a1-eink-so-002', type: 'select-one', lemma: 'kaufen',
    fm: `options:
  - kaufe
  - koche
  - schlafe
correct: kaufe`,
    body: 'Heute ___ ich Obst und Gemüse.',
  },
  {
    id: 'a1-eink-so-003', type: 'select-one', lemma: 'Preis',
    fm: `options:
  - der Preis
  - die Prüfung
  - der Urlaub
correct: der Preis`,
    body: 'Was ist das?\n\n→ Das ist ___ vom Brot. (3 Euro)',
  },
  {
    id: 'a1-eink-so-004', type: 'select-one', lemma: 'billig',
    fm: `options:
  - billig
  - teuer
  - laut
correct: billig`,
    body: 'Diese Äpfel kosten nur 1 Euro — sie sind sehr ___.',
  },
  {
    id: 'a1-eink-so-005', type: 'select-one', lemma: 'teuer',
    fm: `options:
  - teuer
  - billig
  - klein
correct: teuer`,
    body: 'Der Käse kostet 8 Euro. Das ist ___.',
  },
  {
    id: 'a1-eink-so-006', type: 'select-one', lemma: 'Milch',
    fm: `options:
  - die Milch
  - das Brot
  - der Käse
correct: die Milch`,
    body: 'Ich trinke gern ___ zum Frühstück.',
  },
  {
    id: 'a1-eink-so-007', type: 'select-one', lemma: 'Brot',
    fm: `options:
  - das Brot
  - die Milch
  - das Wasser
correct: das Brot`,
    body: 'Im Supermarkt kaufe ich oft frisches ___.',
  },
  {
    id: 'a1-eink-so-008', type: 'select-one', lemma: 'Käse',
    fm: `options:
  - der Käse
  - der Tee
  - der Reis
correct: der Käse`,
    body: 'Möchtest du ___ auf dem Brot?',
  },
  {
    id: 'a1-eink-so-009', type: 'select-one', lemma: 'Obst',
    fm: `options:
  - das Obst
  - das Gemüse
  - das Fleisch
correct: das Obst`,
    body: 'Äpfel, Bananen und Orangen — das ist ___.',
  },
  {
    id: 'a1-eink-so-010', type: 'select-one', lemma: 'Gemüse',
    fm: `options:
  - das Gemüse
  - das Obst
  - die Schokolade
correct: das Gemüse`,
    body: 'Karotten, Tomaten und Salat — das ist ___.',
  },
  {
    id: 'a1-eink-so-011', type: 'select-one', lemma: 'Kasse',
    fm: `options:
  - an der Kasse
  - in der Küche
  - im Bett
correct: an der Kasse`,
    body: 'Wo bezahlst du im Supermarkt?\n\n→ ___.',
  },
  {
    id: 'a1-eink-so-012', type: 'select-one', lemma: 'bezahlen',
    fm: `options:
  - bezahle
  - koche
  - schreibe
correct: bezahle`,
    body: 'Ich ___ mit Karte.',
  },
  {
    id: 'a1-eink-so-013', type: 'select-one', lemma: 'brauchen',
    fm: `options:
  - brauche
  - schlafe
  - esse
correct: brauche`,
    body: 'Wir ___ noch Wasser und Brot.',
  },
  {
    id: 'a1-eink-so-014', type: 'select-one', lemma: 'möchten',
    fm: `options:
  - möchte
  - muss
  - kann
correct: möchte`,
    body: 'Guten Tag! Ich ___ zwei Brötchen, bitte.',
  },
  {
    id: 'a1-eink-so-015', type: 'select-one', lemma: 'Flasche',
    fm: `options:
  - eine Flasche
  - ein Tisch
  - ein Buch
correct: eine Flasche`,
    body: 'Ich kaufe ___ Wasser.',
  },
  {
    id: 'a1-eink-in-001', type: 'input-text', lemma: 'kaufen',
    fm: `hint: Wortschatz — einkaufen
correct:
  - kaufe
  - Kaufe`,
    body: 'Im Supermarkt ___ ich heute Milch und Brot.',
  },
  {
    id: 'a1-eink-in-002', type: 'input-text', lemma: 'Supermarkt',
    fm: `hint: Wortschatz — der Supermarkt
correct:
  - Supermarkt
  - supermarkt`,
    body: 'Ich gehe in den ___.',
  },
  {
    id: 'a1-eink-in-003', type: 'input-text', lemma: 'Preis',
    fm: `hint: Wortschatz — der Preis
correct:
  - Preis
  - preis`,
    body: 'Der ___ für das Brot ist 2 Euro.',
  },
  {
    id: 'a1-eink-in-004', type: 'input-text', lemma: 'billig',
    fm: `hint: Wortschatz — billig
correct:
  - billig
  - Billig`,
    body: 'Die Bananen sind heute sehr ___.',
  },
  {
    id: 'a1-eink-in-005', type: 'input-text', lemma: 'teuer',
    fm: `hint: Wortschatz — teuer
correct:
  - teuer
  - Teuer`,
    body: 'Der Kaffee ist zu ___.',
  },
  {
    id: 'a1-eink-in-006', type: 'input-text', lemma: 'Milch',
    fm: `hint: Wortschatz — die Milch
correct:
  - Milch
  - milch`,
    body: 'Ich kaufe ___ und Eier.',
  },
  {
    id: 'a1-eink-in-007', type: 'input-text', lemma: 'Käse',
    fm: `hint: Wortschatz — der Käse
correct:
  - Käse
  - Käse
  - kaese
  - Kaese`,
    body: 'Schmeckt dir der ___?',
  },
  {
    id: 'a1-eink-in-008', type: 'input-text', lemma: 'Obst',
    fm: `hint: Wortschatz — das Obst
correct:
  - Obst
  - obst`,
    body: 'Im Sommer kaufe ich viel ___.',
  },
  {
    id: 'a1-eink-in-009', type: 'input-text', lemma: 'Gemüse',
    fm: `hint: Wortschatz — das Gemüse
correct:
  - Gemüse
  - gemüse
  - Gemuese
  - gemuese`,
    body: 'Salat und Tomaten sind ___.',
  },
  {
    id: 'a1-eink-in-010', type: 'input-text', lemma: 'bezahlen',
    fm: `hint: Wortschatz — bezahlen
correct:
  - bezahle
  - Bezahle`,
    body: 'Entschuldigung, ich ___ bar.',
  },
  {
    id: 'a1-eink-dd-001', type: 'dropbox', lemma: 'kaufen',
    fm: `words:
  - Ich
  - kaufe
  - Brot
  - und
  - Milch
commas:
  - 2`,
    body: 'Ordne die Wörter: (Im Supermarkt einkaufen)',
  },
  {
    id: 'a1-eink-dd-002', type: 'dropbox', lemma: 'möchten',
    fm: `words:
  - Ich
  - möchte
  - einen
  - Apfel
  - bitte
commas:
  - 2`,
    body: 'Ordne die Wörter: (An der Theke)',
  },
  {
    id: 'a1-eink-dd-003', type: 'dropbox', lemma: 'Preis',
    fm: `words:
  - Was
  - kostet
  - das
  - Brot
commas:
  - 0`,
    body: 'Ordne die Wörter: (Nach dem Preis fragen)',
  },
  {
    id: 'a1-eink-dd-004', type: 'dropbox', lemma: 'Kasse',
    fm: `words:
  - Wir
  - bezahlen
  - an
  - der
  - Kasse
commas:
  - 2`,
    body: 'Ordne die Wörter: (Bezahlen)',
  },
  {
    id: 'a1-eink-dd-005', type: 'dropbox', lemma: 'Supermarkt',
    fm: `words:
  - Der
  - Supermarkt
  - ist
  - heute
  - geöffnet
commas:
  - 2`,
    body: 'Ordne die Wörter: (Öffnungszeiten)',
  },
];

const SICH_VORSTELLEN = [
  {
    id: 'a1-vor-so-001', type: 'select-one', lemma: 'heißen',
    fm: `options:
  - heiße
  - heißt
  - heißen
correct: heiße`,
    body: 'Ich ___ Anna.',
  },
  {
    id: 'a1-vor-so-002', type: 'select-one', lemma: 'Name',
    fm: `options:
  - der Name
  - der Preis
  - der Tisch
correct: der Name`,
    body: 'Wie ist dein ___?',
  },
  {
    id: 'a1-vor-so-003', type: 'select-one', lemma: 'kommen',
    fm: `options:
  - komme
  - kaufe
  - wohne
correct: komme`,
    body: 'Ich ___ aus Polen.',
  },
  {
    id: 'a1-vor-so-004', type: 'select-one', lemma: 'wohnen',
    fm: `options:
  - wohne
  - komme
  - arbeite
correct: wohne`,
    body: 'Ich ___ in Berlin.',
  },
  {
    id: 'a1-vor-so-005', type: 'select-one', lemma: 'Stadt',
    fm: `options:
  - die Stadt
  - das Land
  - der Beruf
correct: die Stadt`,
    body: 'München ist eine große ___.',
  },
  {
    id: 'a1-vor-so-006', type: 'select-one', lemma: 'Land',
    fm: `options:
  - das Land
  - die Stadt
  - die Sprache
correct: das Land`,
    body: 'Deutschland ist mein ___.',
  },
  {
    id: 'a1-vor-so-007', type: 'select-one', lemma: 'Beruf',
    fm: `options:
  - der Beruf
  - der Name
  - der Tag
correct: der Beruf`,
    body: 'Was ist dein ___? — Ich bin Lehrerin.',
  },
  {
    id: 'a1-vor-so-008', type: 'select-one', lemma: 'Student',
    fm: `options:
  - Student
  - Studentin
  - Schüler
correct: Student`,
    body: 'Er studiert an der Uni — er ist ___.',
  },
  {
    id: 'a1-vor-so-009', type: 'select-one', lemma: 'Studentin',
    fm: `options:
  - Studentin
  - Student
  - Lehrer
correct: Studentin`,
    body: 'Sie lernt Medizin — sie ist ___.',
  },
  {
    id: 'a1-vor-so-010', type: 'select-one', lemma: 'Sprache',
    fm: `options:
  - Deutsch
  - Tisch
  - Auto
correct: Deutsch`,
    body: 'Welche ___ sprichst du?',
  },
  {
    id: 'a1-vor-so-011', type: 'select-one', lemma: 'sprechen',
    fm: `options:
  - spreche
  - schreibe
  - lese
correct: spreche`,
    body: 'Ich ___ Deutsch und Russisch.',
  },
  {
    id: 'a1-vor-so-012', type: 'select-one', lemma: 'freut mich',
    fm: `options:
  - Freut mich
  - Guten Appetit
  - Gute Nacht
correct: Freut mich`,
    body: '„Ich bin Max." — „___ ."',
  },
  {
    id: 'a1-vor-so-013', type: 'select-one', lemma: 'Jahre alt',
    fm: `options:
  - 25 Jahre alt
  - 25 Euro
  - 25 Uhr
correct: 25 Jahre alt`,
    body: 'Wie alt bist du?\n\n→ Ich bin ___.',
  },
  {
    id: 'a1-vor-so-014', type: 'select-one', lemma: 'arbeiten',
    fm: `options:
  - arbeite
  - wohne
  - heiße
correct: arbeite`,
    body: 'Ich ___ als Kellnerin in einem Café.',
  },
  {
    id: 'a1-vor-so-015', type: 'select-one', lemma: 'Hallo',
    fm: `options:
  - Hallo
  - Tschüss
  - Danke
correct: Hallo`,
    body: 'Du triffst eine neue Kollegin. Was sagst du?\n\n→ ___ !',
  },
  {
    id: 'a1-vor-in-001', type: 'input-text', lemma: 'heißen',
    fm: `hint: Wortschatz — heißen
correct:
  - heiße
  - Heiße`,
    body: 'Ich ___ Maria.',
  },
  {
    id: 'a1-vor-in-002', type: 'input-text', lemma: 'kommen',
    fm: `hint: Wortschatz — kommen aus
correct:
  - komme
  - Komme`,
    body: 'Ich ___ aus der Ukraine.',
  },
  {
    id: 'a1-vor-in-003', type: 'input-text', lemma: 'wohnen',
    fm: `hint: Wortschatz — wohnen
correct:
  - wohne
  - Wohne`,
    body: 'Ich ___ in Hamburg.',
  },
  {
    id: 'a1-vor-in-004', type: 'input-text', lemma: 'Stadt',
    fm: `hint: Wortschatz — die Stadt
correct:
  - Stadt
  - stadt`,
    body: 'Köln ist eine schöne ___.',
  },
  {
    id: 'a1-vor-in-005', type: 'input-text', lemma: 'Land',
    fm: `hint: Wortschatz — das Land
correct:
  - Land
  - land`,
    body: 'Österreich ist ein kleines ___.',
  },
  {
    id: 'a1-vor-in-006', type: 'input-text', lemma: 'Beruf',
    fm: `hint: Wortschatz — der Beruf
correct:
  - Beruf
  - beruf`,
    body: 'Mein ___ ist Arzt.',
  },
  {
    id: 'a1-vor-in-007', type: 'input-text', lemma: 'sprechen',
    fm: `hint: Wortschatz — sprechen
correct:
  - spreche
  - Spreche`,
    body: 'Im Kurs ___ ich Deutsch.',
  },
  {
    id: 'a1-vor-in-008', type: 'input-text', lemma: 'arbeiten',
    fm: `hint: Wortschatz — arbeiten
correct:
  - arbeite
  - Arbeite`,
    body: 'Ich ___ in einer Firma.',
  },
  {
    id: 'a1-vor-in-009', type: 'input-text', lemma: 'Jahre alt',
    fm: `hint: Wortschatz — Jahre alt
correct:
  - 30
  - dreißig
  - dreissig`,
    body: 'Ich bin ___ Jahre alt. (Schreib die Zahl.)',
  },
  {
    id: 'a1-vor-in-010', type: 'input-text', lemma: 'Name',
    fm: `hint: Wortschatz — der Name
correct:
  - Name
  - name`,
    body: 'Mein ___ ist Lukas.',
  },
  {
    id: 'a1-vor-dd-001', type: 'dropbox', lemma: 'heißen',
    fm: `words:
  - Ich
  - heiße
  - Tom
  - und
  - komme
  - aus
  - Italien
commas:
  - 2
  - 6`,
    body: 'Ordne die Wörter: (Sich vorstellen)',
  },
  {
    id: 'a1-vor-dd-002', type: 'dropbox', lemma: 'wohnen',
    fm: `words:
  - Ich
  - wohne
  - in
  - München
commas:
  - 2`,
    body: 'Ordne die Wörter: (Wo wohnst du?)',
  },
  {
    id: 'a1-vor-dd-003', type: 'dropbox', lemma: 'Beruf',
    fm: `words:
  - Ich
  - bin
  - Lehrer
  - von
  - Beruf
commas:
  - 2`,
    body: 'Ordne die Wörter: (Beruf nennen)',
  },
  {
    id: 'a1-vor-dd-004', type: 'dropbox', lemma: 'sprechen',
    fm: `words:
  - Ich
  - spreche
  - ein
  - bisschen
  - Deutsch
commas:
  - 2`,
    body: 'Ordne die Wörter: (Sprachen)',
  },
  {
    id: 'a1-vor-dd-005', type: 'dropbox', lemma: 'freut mich',
    fm: `words:
  - Freut
  - mich
  - sehr
commas:
  - 1`,
    body: 'Ordne die Wörter: (Höfliche Antwort)',
  },
];

/** @param {typeof EINKAUFEN} list @param {string} setKey */
function emitSet(list, setKey) {
  for (const q of list) {
    const yaml = `---
id: ${q.id}
type: ${q.type}
lemma: ${q.lemma}
set: ${setKey}
focus: word
${q.fm}
---

${q.body}`;
    writeQ(setKey, q.id, yaml);
  }
}

emitSet(EINKAUFEN, 'EINKAUFEN');
emitSet(SICH_VORSTELLEN, 'SICH_VORSTELLEN');

console.log(`Wrote ${EINKAUFEN.length} EINKAUFEN + ${SICH_VORSTELLEN.length} SICH_VORSTELLEN questions.`);
