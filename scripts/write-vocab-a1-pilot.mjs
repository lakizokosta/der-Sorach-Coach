#!/usr/bin/env node
/**
 * One-off writer for A1 pilot vocab sets (Einkaufen, Sich vorstellen, Meine Familie, Meine Wohnung).
 * Run: node scripts/write-vocab-a1-pilot.mjs
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MEINE_WOHNUNG } from './vocab-sets/meine-wohnung.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = join(ROOT, 'src', 'site', 'questions-vocab', 'A1');

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
    fm: `hint: Was machst du im Supermarkt?
wordChoices:
  - kaufe
  - koche
  - schlafe
correct:
  - kaufe
  - Kaufe`,
    body: 'Im Supermarkt ___ ich heute Milch und Brot.',
  },
  {
    id: 'a1-eink-in-002', type: 'input-text', lemma: 'Supermarkt',
    fm: `hint: Nach „in den“ folgt ein maskulines Nomen (Akkusativ).
wordChoices:
  - Supermarkt
  - Milch
  - Obst
correct:
  - Supermarkt
  - supermarkt`,
    body: 'Ich gehe in den ___.',
  },
  {
    id: 'a1-eink-in-003', type: 'input-text', lemma: 'Preis',
    fm: `hint: „Der“ zeigt maskulin · Nominativ.
wordChoices:
  - Preis
  - Milch
  - Gemüse
correct:
  - Preis
  - preis`,
    body: 'Der ___ für das Brot ist 2 Euro.',
  },
  {
    id: 'a1-eink-in-004', type: 'input-text', lemma: 'billig',
    fm: `hint: Wie sind die Bananen heute — teuer oder günstig?
wordChoices:
  - billig
  - teuer
  - laut
correct:
  - billig
  - Billig`,
    body: 'Die Bananen sind heute sehr ___.',
  },
  {
    id: 'a1-eink-in-005', type: 'input-text', lemma: 'teuer',
    fm: `hint: Der Kaffee kostet viel — welches Adjektiv passt?
wordChoices:
  - teuer
  - billig
  - klein
correct:
  - teuer
  - Teuer`,
    body: 'Der Kaffee ist zu ___.',
  },
  {
    id: 'a1-eink-in-006', type: 'input-text', lemma: 'Milch',
    fm: `hint: Was kaufst du zusammen mit Eiern?
wordChoices:
  - Milch
  - Brot
  - Käse
correct:
  - Milch
  - milch`,
    body: 'Ich kaufe ___ und Eier.',
  },
  {
    id: 'a1-eink-in-007', type: 'input-text', lemma: 'Käse',
    fm: `hint: „der“ — maskulin · Nominativ.
wordChoices:
  - Käse
  - Milch
  - Obst
correct:
  - Käse
  - Käse
  - kaese
  - Kaese`,
    body: 'Schmeckt dir der ___?',
  },
  {
    id: 'a1-eink-in-008', type: 'input-text', lemma: 'Obst',
    fm: `hint: Äpfel, Bananen, Orangen — welche Wortgruppe?
wordChoices:
  - Obst
  - Gemüse
  - Milch
correct:
  - Obst
  - obst`,
    body: 'Im Sommer kaufe ich viel ___.',
  },
  {
    id: 'a1-eink-in-009', type: 'input-text', lemma: 'Gemüse',
    fm: `hint: Salat und Tomaten — Obst oder Gemüse?
wordChoices:
  - Gemüse
  - Obst
  - Fleisch
correct:
  - Gemüse
  - gemüse
  - Gemuese
  - gemuese`,
    body: 'Salat und Tomaten sind ___.',
  },
  {
    id: 'a1-eink-in-010', type: 'input-text', lemma: 'bezahlen',
    fm: `hint: Was machst du an der Kasse?
wordChoices:
  - bezahle
  - koche
  - schreibe
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
    fm: `hint: Wie stellst du deinen Namen vor?
wordChoices:
  - heiße
  - kaufe
  - wohne
correct:
  - heiße
  - Heiße`,
    body: 'Ich ___ Maria.',
  },
  {
    id: 'a1-vor-in-002', type: 'input-text', lemma: 'kommen',
    fm: `hint: Woher kommst du?
wordChoices:
  - komme
  - wohne
  - arbeite
correct:
  - komme
  - Komme`,
    body: 'Ich ___ aus der Ukraine.',
  },
  {
    id: 'a1-vor-in-003', type: 'input-text', lemma: 'wohnen',
    fm: `hint: In welcher Stadt lebst du?
wordChoices:
  - wohne
  - komme
  - kaufe
correct:
  - wohne
  - Wohne`,
    body: 'Ich ___ in Hamburg.',
  },
  {
    id: 'a1-vor-in-004', type: 'input-text', lemma: 'Stadt',
    fm: `hint: „eine schöne …“ — feminin · Nominativ.
wordChoices:
  - Stadt
  - Land
  - Beruf
correct:
  - Stadt
  - stadt`,
    body: 'Köln ist eine schöne ___.',
  },
  {
    id: 'a1-vor-in-005', type: 'input-text', lemma: 'Land',
    fm: `hint: „ein kleines …“ — neutral · Nominativ.
wordChoices:
  - Land
  - Stadt
  - Beruf
correct:
  - Land
  - land`,
    body: 'Österreich ist ein kleines ___.',
  },
  {
    id: 'a1-vor-in-006', type: 'input-text', lemma: 'Beruf',
    fm: `hint: Was machst du beruflich?
wordChoices:
  - Beruf
  - Stadt
  - Name
correct:
  - Beruf
  - beruf`,
    body: 'Mein ___ ist Arzt.',
  },
  {
    id: 'a1-vor-in-007', type: 'input-text', lemma: 'sprechen',
    fm: `hint: Welche Sprache lernst du im Kurs?
wordChoices:
  - spreche
  - kaufe
  - esse
correct:
  - spreche
  - Spreche`,
    body: 'Im Kurs ___ ich Deutsch.',
  },
  {
    id: 'a1-vor-in-008', type: 'input-text', lemma: 'arbeiten',
    fm: `hint: Was machst du in der Firma?
wordChoices:
  - arbeite
  - schlafe
  - esse
correct:
  - arbeite
  - Arbeite`,
    body: 'Ich ___ in einer Firma.',
  },
  {
    id: 'a1-vor-in-009', type: 'input-text', lemma: 'Jahre alt',
    fm: `hint: Schreib dein Alter als Zahl.
wordChoices:
  - 30
  - 20
  - 40
correct:
  - 30
  - dreißig
  - dreissig`,
    body: 'Ich bin ___ Jahre alt. (Schreib die Zahl.)',
  },
  {
    id: 'a1-vor-in-010', type: 'input-text', lemma: 'Name',
    fm: `hint: „Mein … ist Lukas“ — wie heißt du?
wordChoices:
  - Name
  - Stadt
  - Land
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

const MEINE_FAMILIE = [
  {
    id: 'a1-fam-so-001', type: 'select-one', lemma: 'Familie',
    fm: `options:
  - Familie
  - Schule
  - Arbeit
correct: Familie`,
    body: 'Das ist meine ___.',
  },
  {
    id: 'a1-fam-so-002', type: 'select-one', lemma: 'Vater',
    fm: `options:
  - Mein
  - Meine
  - Meinen
correct: Mein`,
    body: '___ Vater heißt Thomas.',
  },
  {
    id: 'a1-fam-so-003', type: 'select-one', lemma: 'Mutter',
    fm: `options:
  - meine
  - mein
  - meinen
correct: meine`,
    body: 'Das ist ___ Mutter.',
  },
  {
    id: 'a1-fam-so-004', type: 'select-one', lemma: 'Bruder',
    fm: `options:
  - Bruder
  - Schwester
  - Onkel
correct: Bruder`,
    body: 'Ich habe einen ___ und eine Schwester.',
  },
  {
    id: 'a1-fam-so-005', type: 'select-one', lemma: 'Schwester',
    fm: `options:
  - Schwester
  - Bruder
  - Cousin
correct: Schwester`,
    body: 'Meine ___ ist 12 Jahre alt.',
  },
  {
    id: 'a1-fam-so-006', type: 'select-one', lemma: 'Eltern',
    fm: `options:
  - Eltern
  - Großeltern
  - Geschwister
correct: Eltern`,
    body: 'Vater und Mutter — das sind meine ___. Sie wohnen in Hamburg.',
  },
  {
    id: 'a1-fam-so-007', type: 'select-one', lemma: 'Kind',
    fm: `options:
  - Kind
  - Eltern
  - Onkel
correct: Kind`,
    body: 'Das ___ spielt im Garten.',
  },
  {
    id: 'a1-fam-so-008', type: 'select-one', lemma: 'Sohn',
    fm: `options:
  - Sohn
  - Tochter
  - Vater
correct: Sohn`,
    body: 'Er ist mein ___.',
  },
  {
    id: 'a1-fam-so-009', type: 'select-one', lemma: 'Tochter',
    fm: `options:
  - Tochter
  - Sohn
  - Mutter
correct: Tochter`,
    body: 'Sie ist meine ___.',
  },
  {
    id: 'a1-fam-so-010', type: 'select-one', lemma: 'Großvater',
    fm: `options:
  - Großvater
  - Bruder
  - Onkel
correct: Großvater`,
    body: 'Mein ___ ist 75 Jahre alt.',
  },
  {
    id: 'a1-fam-so-011', type: 'select-one', lemma: 'Großmutter',
    fm: `options:
  - Großmutter
  - Schwester
  - Tante
correct: Großmutter`,
    body: 'Am Sonntag besuche ich meine ___. Sie ist die Mutter meines Vaters.',
  },
  {
    id: 'a1-fam-so-012', type: 'select-one', lemma: 'haben',
    fm: `options:
  - haben
  - bin
  - wohne
correct: haben`,
    body: 'Wir ___ eine große Familie.',
  },
  {
    id: 'a1-fam-so-013', type: 'select-one', lemma: 'groß',
    fm: `options:
  - groß
  - klein
  - teuer
correct: groß`,
    body: 'Meine Familie ist sehr ___.',
  },
  {
    id: 'a1-fam-so-014', type: 'select-one', lemma: 'klein',
    fm: `options:
  - klein
  - groß
  - alt
correct: klein`,
    body: 'Er hat eine ___ Familie — nur drei Personen.',
  },
  {
    id: 'a1-fam-so-015', type: 'select-one', lemma: 'lieb',
    fm: `options:
  - lieb
  - teuer
  - laut
correct: lieb`,
    body: 'Meine kleine Schwester ist sehr ___.',
  },
  {
    id: 'a1-fam-so-016', type: 'select-one', lemma: 'Onkel',
    fm: `options:
  - Onkel
  - Tante
  - Cousin
correct: Onkel`,
    body: 'Mein ___ ist der Bruder von meinem Vater.',
  },
  {
    id: 'a1-fam-so-017', type: 'select-one', lemma: 'Tante',
    fm: `options:
  - Tante
  - Onkel
  - Neffe
correct: Tante`,
    body: 'Das ist meine ___. Sie ist die Schwester meiner Mutter.',
  },
  {
    id: 'a1-fam-so-018', type: 'select-one', lemma: 'Cousin',
    fm: `options:
  - Cousin
  - Cousine
  - Neffe
correct: Cousin`,
    body: 'Er ist mein ___ — der Sohn meines Onkels.',
  },
  {
    id: 'a1-fam-so-019', type: 'select-one', lemma: 'Cousine',
    fm: `options:
  - Cousine
  - Cousin
  - Nichte
correct: Cousine`,
    body: 'Sie ist meine ___. Sie ist die Tochter meiner Tante.',
  },
  {
    id: 'a1-fam-so-020', type: 'select-one', lemma: 'Enkel',
    fm: `options:
  - Enkel
  - Onkel
  - Vater
correct: Enkel`,
    body: 'Der ___ spielt gern mit seiner Oma.',
  },
  {
    id: 'a1-fam-so-021', type: 'select-one', lemma: 'Enkelin',
    fm: `options:
  - Enkelin
  - Tochter
  - Nichte
correct: Enkelin`,
    body: 'Die kleine ___ ist zwei Jahre alt. Sie ist die Tochter meines Sohnes.',
  },
  {
    id: 'a1-fam-so-022', type: 'select-one', lemma: 'Neffe',
    fm: `options:
  - Neffe
  - Nichte
  - Cousin
correct: Neffe`,
    body: 'Mein ___ ist der Sohn meiner Schwester.',
  },
  {
    id: 'a1-fam-so-023', type: 'select-one', lemma: 'Nichte',
    fm: `options:
  - Nichte
  - Neffe
  - Enkelin
correct: Nichte`,
    body: 'Meine ___ ist die Tochter meines Bruders.',
  },
  {
    id: 'a1-fam-so-024', type: 'select-one', lemma: 'Mann',
    fm: `options:
  - Mann
  - Bruder
  - Onkel
correct: Mann`,
    body: 'Das ist mein ___ — wir sind verheiratet.',
  },
  {
    id: 'a1-fam-so-025', type: 'select-one', lemma: 'Frau',
    fm: `options:
  - Frau
  - Schwester
  - Tante
correct: Frau`,
    body: 'Das ist meine ___. Wir sind verheiratet.',
  },
  {
    id: 'a1-fam-so-026', type: 'select-one', lemma: 'Opa',
    fm: `options:
  - Opa
  - Onkel
  - Cousin
correct: Opa`,
    body: 'Mein ___ heißt Karl — das ist mein Großvater.',
  },
  {
    id: 'a1-fam-so-027', type: 'select-one', lemma: 'Schwager',
    fm: `options:
  - Schwager
  - Schwester
  - Onkel
correct: Schwager`,
    body: 'Mein ___ ist der Bruder meiner Frau.',
  },
  {
    id: 'a1-fam-so-028', type: 'select-one', lemma: 'Schwägerin',
    fm: `options:
  - Schwägerin
  - Schwester
  - Tante
correct: Schwägerin`,
    body: 'Meine ___ ist die Schwester meines Mannes.',
  },
  {
    id: 'a1-fam-so-029', type: 'select-one', lemma: 'Baby',
    fm: `options:
  - Baby
  - Onkel
  - Cousin
correct: Baby`,
    body: 'Das ___ ist erst drei Monate alt und schläft viel.',
  },
  {
    id: 'a1-fam-so-030', type: 'select-one', lemma: 'Großeltern',
    fm: `options:
  - Großeltern
  - Eltern
  - Geschwister
correct: Großeltern`,
    body: 'Oma und Opa — das sind meine ___. Sie wohnen auf dem Land.',
  },
  {
    id: 'a1-fam-in-001', type: 'input-text', lemma: 'Vater',
    fm: `hint: Wer ist der Mann in deiner Familie — Papa?
wordChoices:
  - Vater
  - Mutter
  - Bruder
correct:
  - Vater
  - vater`,
    body: 'Mein ___ heißt Hans.',
  },
  {
    id: 'a1-fam-in-002', type: 'input-text', lemma: 'Mutter',
    fm: `hint: „meine …“ — feminin.
wordChoices:
  - Mutter
  - Vater
  - Bruder
correct:
  - Mutter
  - mutter`,
    body: 'Das ist meine ___.',
  },
  {
    id: 'a1-fam-in-003', type: 'input-text', lemma: 'Bruder',
    fm: `hint: „einen …“ — maskulin · Akkusativ.
wordChoices:
  - Bruder
  - Schwester
  - Mutter
correct:
  - Bruder
  - bruder`,
    body: 'Ich habe einen ___ und eine Schwester.',
  },
  {
    id: 'a1-fam-in-004', type: 'input-text', lemma: 'Schwester',
    fm: `hint: „Meine … ist 10 Jahre alt.“
wordChoices:
  - Schwester
  - Bruder
  - Vater
correct:
  - Schwester
  - schwester`,
    body: 'Meine ___ ist 10 Jahre alt.',
  },
  {
    id: 'a1-fam-in-005', type: 'input-text', lemma: 'Familie',
    fm: `hint: Vater, Mutter, Kinder — das ist die …
wordChoices:
  - Familie
  - Schule
  - Arbeit
correct:
  - Familie
  - familie`,
    body: 'Meine ___ ist groß.',
  },
  {
    id: 'a1-fam-in-006', type: 'input-text', lemma: 'haben',
    fm: `hint: Zwei Kinder — wir … zwei Kinder.
wordChoices:
  - haben
  - bin
  - wohne
correct:
  - haben
  - Haben`,
    body: 'Wir ___ zwei Kinder.',
  },
  {
    id: 'a1-fam-in-007', type: 'input-text', lemma: 'Sohn',
    fm: `hint: „Mein … heißt Max“ — ein Junge.
wordChoices:
  - Sohn
  - Tochter
  - Vater
correct:
  - Sohn
  - sohn`,
    body: 'Mein ___ heißt Max.',
  },
  {
    id: 'a1-fam-in-008', type: 'input-text', lemma: 'Tochter',
    fm: `hint: „Meine … heißt Anna“ — ein Mädchen.
wordChoices:
  - Tochter
  - Sohn
  - Schwester
correct:
  - Tochter
  - tochter`,
    body: 'Meine ___ heißt Anna.',
  },
  {
    id: 'a1-fam-in-009', type: 'input-text', lemma: 'Eltern',
    fm: `hint: Vater und Mutter zusammen — die …
wordChoices:
  - Eltern
  - Kinder
  - Freunde
correct:
  - Eltern
  - eltern`,
    body: 'Meine ___ wohnen in Köln.',
  },
  {
    id: 'a1-fam-in-010', type: 'input-text', lemma: 'Großmutter',
    fm: `hint: Die Mutter deiner Mutter — Oma / …
wordChoices:
  - Großmutter
  - Schwester
  - Tante
correct:
  - Großmutter
  - grossmutter
  - Oma
  - oma`,
    body: 'Ich besuche meine ___ am Sonntag.',
  },
  {
    id: 'a1-fam-in-011', type: 'input-text', lemma: 'Onkel',
    fm: `hint: Der Bruder von Vater oder Mutter.
wordChoices:
  - Onkel
  - Tante
  - Cousin
correct:
  - Onkel
  - onkel`,
    body: 'Mein ___ wohnt in Wien.',
  },
  {
    id: 'a1-fam-in-012', type: 'input-text', lemma: 'Tante',
    fm: `hint: „Meine …“ — die Schwester der Mutter.
wordChoices:
  - Tante
  - Onkel
  - Cousine
correct:
  - Tante
  - tante`,
    body: 'Meine ___ kocht sehr gut.',
  },
  {
    id: 'a1-fam-in-013', type: 'input-text', lemma: 'Cousin',
    fm: `hint: Der Sohn vom Onkel — mein …
wordChoices:
  - Cousin
  - Cousine
  - Neffe
correct:
  - Cousin
  - cousin`,
    body: 'Mein ___ spielt Fußball.',
  },
  {
    id: 'a1-fam-in-014', type: 'input-text', lemma: 'Cousine',
    fm: `hint: Die Tochter der Tante — meine …
wordChoices:
  - Cousine
  - Cousin
  - Nichte
correct:
  - Cousine
  - cousine`,
    body: 'Meine ___ studiert Medizin.',
  },
  {
    id: 'a1-fam-in-015', type: 'input-text', lemma: 'Enkel',
    fm: `hint: Die Kinder von deinen Kindern — Oma hat zwei …
wordChoices:
  - Enkel
  - Neffen
  - Cousins
correct:
  - Enkel
  - enkel`,
    body: 'Meine Großeltern haben zwei ___.',
  },
  {
    id: 'a1-fam-in-016', type: 'input-text', lemma: 'Enkelin',
    fm: `hint: Das Mädchen — die kleine …
wordChoices:
  - Enkelin
  - Enkel
  - Nichte
correct:
  - Enkelin
  - enkelin`,
    body: 'Die ___ ist erst ein Jahr alt.',
  },
  {
    id: 'a1-fam-in-017', type: 'input-text', lemma: 'Neffe',
    fm: `hint: Der Sohn deiner Schwester — dein …
wordChoices:
  - Neffe
  - Nichte
  - Cousin
correct:
  - Neffe
  - neffe`,
    body: 'Mein ___ ist fünf Jahre alt.',
  },
  {
    id: 'a1-fam-in-018', type: 'input-text', lemma: 'Nichte',
    fm: `hint: Die Tochter deines Bruders — deine …
wordChoices:
  - Nichte
  - Neffe
  - Enkelin
correct:
  - Nichte
  - nichte`,
    body: 'Meine ___ geht schon in die Schule.',
  },
  {
    id: 'a1-fam-in-019', type: 'input-text', lemma: 'Großeltern',
    fm: `hint: Oma und Opa zusammen — die …
wordChoices:
  - Großeltern
  - Eltern
  - Geschwister
correct:
  - Großeltern
  - grosseltern`,
    body: 'Oma und Opa — das sind meine ___.',
  },
  {
    id: 'a1-fam-in-020', type: 'input-text', lemma: 'Geschwister',
    fm: `hint: Bruder und Schwester zusammen — …
wordChoices:
  - Geschwister
  - Cousins
  - Enkel
correct:
  - Geschwister
  - geschwister`,
    body: 'Ich habe zwei ___ — einen Bruder und eine Schwester.',
  },
  {
    id: 'a1-fam-dd-001', type: 'dropbox', lemma: 'Familie',
    fm: `words:
  - Das
  - ist
  - meine
  - Familie
commas:
  - 2`,
    body: 'Ordne die Wörter: (Familie zeigen)',
  },
  {
    id: 'a1-fam-dd-002', type: 'dropbox', lemma: 'Bruder',
    fm: `words:
  - Ich
  - habe
  - einen
  - Bruder
  - und
  - eine
  - Schwester
commas:
  - 2
  - 6`,
    body: 'Ordne die Wörter: (Geschwister)',
  },
  {
    id: 'a1-fam-dd-003', type: 'dropbox', lemma: 'Vater',
    fm: `words:
  - Mein
  - Vater
  - arbeitet
  - in
  - Berlin
commas:
  - 2`,
    body: 'Ordne die Wörter: (Vater)',
  },
  {
    id: 'a1-fam-dd-004', type: 'dropbox', lemma: 'Mutter',
    fm: `words:
  - Meine
  - Mutter
  - kocht
  - gern
commas:
  - 2`,
    body: 'Ordne die Wörter: (Mutter)',
  },
  {
    id: 'a1-fam-dd-005', type: 'dropbox', lemma: 'Eltern',
    fm: `words:
  - Wir
  - wohnen
  - bei
  - unseren
  - Eltern`,
    body: 'Ordne die Wörter: (Mit den Eltern wohnen)',
  },
  {
    id: 'a1-fam-dd-006', type: 'dropbox', lemma: 'Onkel',
    fm: `words:
  - Mein
  - Onkel
  - kommt
  - aus
  - Österreich
commas:
  - 2`,
    body: 'Ordne die Wörter: (Onkel)',
  },
  {
    id: 'a1-fam-dd-007', type: 'dropbox', lemma: 'Tante',
    fm: `words:
  - Meine
  - Tante
  - wohnt
  - in
  - Berlin
commas:
  - 2`,
    body: 'Ordne die Wörter: (Tante)',
  },
  {
    id: 'a1-fam-dd-008', type: 'dropbox', lemma: 'Cousin',
    fm: `words:
  - Mein
  - Cousin
  - und
  - meine
  - Cousine
  - spielen
  - gern
commas:
  - 2
  - 5`,
    body: 'Ordne die Wörter: (Cousin und Cousine)',
  },
  {
    id: 'a1-fam-dd-009', type: 'dropbox', lemma: 'Enkel',
    fm: `words:
  - Oma
  - und
  - Opa
  - haben
  - drei
  - Enkel
commas:
  - 2
  - 4`,
    body: 'Ordne die Wörter: (Enkel)',
  },
  {
    id: 'a1-fam-dd-010', type: 'dropbox', lemma: 'Nichte',
    fm: `words:
  - Meine
  - Nichte
  - heißt
  - Sophie
commas:
  - 2`,
    body: 'Ordne die Wörter: (Nichte)',
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
emitSet(MEINE_FAMILIE, 'MEINE_FAMILIE');
emitSet(MEINE_WOHNUNG, 'MEINE_WOHNUNG');

console.log(`Wrote ${EINKAUFEN.length} EINKAUFEN + ${SICH_VORSTELLEN.length} SICH_VORSTELLEN + ${MEINE_FAMILIE.length} MEINE_FAMILIE + ${MEINE_WOHNUNG.length} MEINE_WOHNUNG questions.`);
