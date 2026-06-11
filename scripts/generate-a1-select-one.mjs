#!/usr/bin/env node
/**
 * Generates select-one A1 questions (006–050) per Premium topic.
 * Run once: node scripts/generate-a1-select-one.mjs
 */

import { mkdirSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { verbFormHint } from './topic-context-hints.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', 'src', 'questions', 'A1');

const TOPICS = {
  POSSESSIVARTIKEL: 'a1-poss',
  PLURAL: 'a1-pl',
  VERBKONJUGATION: 'a1-konj',
  ADJEKTIVDEKLINATIONA1: 'a1-adj',
  WECHSELPRÄPOSITIONEN: 'a1-wech',
  DATIVA1: 'a1-dat',
  AKKUSATIVA1: 'a1-akk',
  ARTIKEL: 'a1-art',
  'W-FRAGEN': 'a1-wf',
  NEGATION: 'a1-neg',
  GEGENTEILE: 'a1-geg',
};

/** @typedef {{ prompt: string, options: string[], correct: string }} Q */

function md({ id, prompt, options, correct, hint }) {
  const opts = options.map((o) => `  - ${o}`).join('\n');
  let text = String(prompt).replace(/^\[[^\]]+]\s+/, '').trim();
  if (hint && !/\([^)]+\)\s*$/.test(text)) text = `${text} (${hint})`;
  return `---\nid: ${id}\ntype: select-one\noptions:\n${opts}\ncorrect: ${correct}\n---\n\n${text}\n`;
}

function writeTopic(folder, prefix, questions, from = 6, to = 50, force = false) {
  const dir = join(ROOT, folder);
  mkdirSync(dir, { recursive: true });
  let written = 0;
  for (let i = from; i <= to; i++) {
    const q = questions[i - from];
    if (!q) break;
    const num = String(i).padStart(3, '0');
    const file = join(dir, `${prefix}-${num}.md`);
    if (!force && existsSync(file)) continue;
    const hint = q.hint || verbFormHint(folder, '', q.correct, q.options, q.prompt, `${prefix}-${num}`);
    writeFileSync(file, md({ id: `${prefix}-${num}`, hint, ...q }), 'utf8');
    written += 1;
  }
  return written;
}

function shuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(pool, correct, count, seed) {
  const rest = pool.filter((x) => x !== correct);
  return shuffle(rest, seed).slice(0, count);
}

function options4(correct, pool, seed) {
  const unique = [...new Set(pool.filter((x) => x !== correct))];
  return shuffle([correct, ...pickDistractors(unique, correct, 3, seed)], seed);
}

function options5(correct, pool, seed) {
  return shuffle([correct, ...pickDistractors(pool, correct, 4, seed)], seed);
}

// ─── POSSESSIVARTIKEL ───────────────────────────────────────────────────────

const POSSESSIV_CASE_LABEL = {
  nom_m: 'mask., Nom.',
  nom_f: 'fem., Nom.',
  nom_n: 'neutr., Nom.',
  akk_m: 'mask., Akk.',
  akk_f: 'fem., Akk.',
  akk_n: 'neutr., Akk.',
  akk_pl: 'Pl., Akk.',
  dat_m: 'mask., Dat.',
  dat_f: 'fem., Dat.',
  dat_n: 'neutr., Dat.',
};

function genPossessiv() {
  /** @type {(Q & { hint?: string })[]} */
  const out = [];
  const sets = [
    { who: 'ich', m: 'mein', f: 'meine', n: 'mein', pl: 'meine', akk_m: 'meinen', dat_m: 'meinem', dat_f: 'meiner' },
    { who: 'du', m: 'dein', f: 'deine', n: 'dein', pl: 'deine', akk_m: 'deinen', dat_m: 'deinem', dat_f: 'deiner' },
    { who: 'er', m: 'sein', f: 'seine', n: 'sein', pl: 'seine', akk_m: 'seinen', dat_m: 'seinem', dat_f: 'seiner' },
    { who: 'sie', m: 'ihr', f: 'ihre', n: 'ihr', pl: 'ihre', akk_m: 'ihren', dat_m: 'ihrem', dat_f: 'ihrer' },
    { who: 'wir', m: 'unser', f: 'unsere', n: 'unser', pl: 'unsere', akk_m: 'unseren', dat_m: 'unserem', dat_f: 'unserer' },
    { who: 'ihr', m: 'euer', f: 'eure', n: 'euer', pl: 'eure', akk_m: 'euren', dat_m: 'eurem', dat_f: 'eurer' },
  ];
  const templates = [
    { theme: 'Familie', case: 'nom_m', noun: 'Vater', prompt: (n) => `[Familie] Das ist ___ ${n}.` },
    { theme: 'Familie', case: 'nom_f', noun: 'Mutter', prompt: (n) => `[Familie] ___ ${n} kocht gern.` },
    { theme: 'Freunde', case: 'akk_m', noun: 'Freund', prompt: (n) => `[Freunde] Ich rufe ___ ${n} an.` },
    { theme: 'Freunde', case: 'akk_f', noun: 'Freundin', prompt: (n) => `[Freunde] Ich besuche ___ ${n}.` },
    { theme: 'Schule', case: 'nom_n', noun: 'Heft', prompt: (n) => `[Schule] Wo ist ___ ${n}?` },
    { theme: 'Schule', case: 'akk_f', noun: 'Tasche', prompt: (n) => `[Schule] Ich packe ___ ${n}.` },
    { theme: 'Hobby', case: 'nom_n', noun: 'Fahrrad', prompt: (n) => `[Hobby] ___ ${n} ist neu.` },
    { theme: 'Hobby', case: 'dat_m', noun: 'Computer', prompt: (n) => `[Hobby] Ich spiele mit ___ ${n}.` },
    { theme: 'Stadt', case: 'akk_f', noun: 'Wohnung', prompt: (n) => `[Stadt] Wir suchen ___ ${n}.` },
    { theme: 'Stadt', case: 'dat_n', noun: 'Büro', prompt: (n) => `[Stadt] Im Sommer arbeite ich in ___ ${n}.` },
    { theme: 'Essen', case: 'akk_m', noun: 'Apfel', prompt: (n) => `[Essen] Ich esse ___ ${n}.` },
    { theme: 'Essen', case: 'nom_f', noun: 'Pizza', prompt: (n) => `[Essen] ___ ${n} schmeckt super.` },
    { theme: 'Transport', case: 'dat_n', noun: 'Auto', prompt: (n) => `[Transport] Wir fahren mit ___ ${n} nach Berlin.` },
    { theme: 'Transport', case: 'akk_m', noun: 'Bus', prompt: (n) => `[Transport] Ich warte auf ___ ${n}.` },
    { theme: 'Wetter', case: 'akk_m', noun: 'Regenschirm', prompt: (n) => `[Wetter] Bei Regen brauche ich ___ ${n}.` },
    { theme: 'Musik', case: 'dat_f', noun: 'Gitarre', prompt: (n) => `[Musik] Ich übe auf ___ ${n}.` },
    { theme: 'Sport', case: 'akk_m', noun: 'Ball', prompt: (n) => `[Sport] Wir werfen ___ ${n}.` },
    { theme: 'Tiere', case: 'nom_n', noun: 'Kaninchen', prompt: (n) => `[Tiere] ___ ${n} ist süß.` },
    { theme: 'Kleidung', case: 'akk_m', noun: 'Mantel', prompt: (n) => `[Kleidung] Im Winter trage ich ___ ${n}.` },
    { theme: 'Gesundheit', case: 'akk_n', noun: 'Medikament', prompt: (n) => `[Gesundheit] Der Arzt gibt mir ___ ${n}.` },
    { theme: 'Reisen', case: 'akk_m', noun: 'Koffer', prompt: (n) => `[Reisen] Ich packe ___ ${n}.` },
    { theme: 'Arbeit', case: 'nom_f', noun: 'Arbeit', prompt: (n) => `[Arbeit] ___ ${n} beginnt um 8 Uhr.` },
    { theme: 'Zuhause', case: 'dat_n', noun: 'Zimmer', prompt: (n) => `[Zuhause] In ___ ${n} ist es ruhig.` },
    { theme: 'Einkaufen', case: 'nom_f', noun: 'Uhr', prompt: (n) => `[Einkaufen] ___ ${n} ist teuer.` },
    { theme: 'Hobby', case: 'akk_pl', noun: 'Bücher', prompt: (n) => `[Hobby] Ich lese gern ___ ${n}.` },
  ];

  const pool = ['mein', 'meine', 'meinen', 'meinem', 'meiner', 'dein', 'deine', 'deinen', 'sein', 'seine', 'seinen', 'ihr', 'ihre', 'ihren', 'unser', 'unsere', 'euer', 'eure'];

  for (let i = 0; i < 45; i++) {
    const s = sets[i % sets.length];
    const tpl = templates[i % templates.length];
    const noun = tpl.noun || 'Freund';
    let correct;
    if (tpl.case.startsWith('akk_m')) correct = s.akk_m;
    else if (tpl.case.startsWith('akk_f') || tpl.case === 'akk_pl') correct = tpl.case === 'akk_pl' ? s.pl : s.f;
    else if (tpl.case.startsWith('akk_n')) correct = s.n;
    else if (tpl.case.startsWith('dat_m')) correct = s.dat_m;
    else if (tpl.case.startsWith('dat_f')) correct = s.dat_f;
    else if (tpl.case.startsWith('dat_n')) correct = s.dat_m;
    else if (tpl.case === 'nom_f') correct = s.f;
    else if (tpl.case === 'nom_n') correct = s.n;
    else correct = s.m;

    const hint = `Possessivartikel — ${s.who}, ${POSSESSIV_CASE_LABEL[tpl.case] || 'Nom.'}`;
    out.push({
      prompt: tpl.prompt(noun),
      hint,
      options: options4(correct, pool, i + 11),
      correct,
    });
  }
  return out;
}

function restorePossessivSelectOne() {
  return writeTopic('POSSESSIVARTIKEL', 'a1-poss', genPossessiv(), 6, 50, true);
}

// ─── PLURAL ─────────────────────────────────────────────────────────────────

function genPlural() {
  /** Free-tier select-one (a1-pl-1…3): Kind, Buch, Mann — excluded from premium 006–050. */
  const FREE = new Set(['das Kind', 'der Mann', 'das Buch']);
  const pairs = [
    ['das Kind', 'die Kinder', ['die Kind', 'die Kinds', 'die Kindern']],
    ['der Mann', 'die Männer', ['die Mann', 'die Manns', 'die Männern']],
    ['die Frau', 'die Frauen', ['die Fraus', 'die Frau', 'die Frauens']],
    ['das Buch', 'die Bücher', ['die Buch', 'die Büchern', 'die Buchs']],
    ['der Apfel', 'die Äpfel', ['die Apfeln', 'die Apfel', 'die Apfels']],
    ['das Auto', 'die Autos', ['die Auto', 'die Auten', 'die Autosn']],
    ['der Freund', 'die Freunde', ['die Freunds', 'die Freund', 'die Freunden']],
    ['die Stadt', 'die Städte', ['die Stadt', 'die Städten', 'die Stadts']],
    ['das Hobby', 'die Hobbys', ['die Hobby', 'die Hobbien', 'die Hobbysn']],
    ['der Bus', 'die Busse', ['die Bus', 'die Bussen', 'die Buss']],
    ['die Blume', 'die Blumen', ['die Blum', 'die Blumens', 'die Blümen']],
    ['das Ei', 'die Eier', ['die Ei', 'die Eiers', 'die Eien']],
    ['der Tag', 'die Tage', ['die Tags', 'die Täg', 'die Tagen']],
    ['die Hand', 'die Hände', ['die Hands', 'die Händ', 'die Händen']],
    ['das Foto', 'die Fotos', ['die Foto', 'die Foten', 'die Fotosn']],
    ['der Film', 'die Filme', ['die Film', 'die Films', 'die Filmen']],
    ['die Lampe', 'die Lampen', ['die Lamp', 'die Lampes', 'die Lämpen']],
    ['das Tier', 'die Tiere', ['die Tier', 'die Tiers', 'die Tieren']],
    ['der Zug', 'die Züge', ['die Zug', 'die Züg', 'die Zügen']],
    ['die Uhr', 'die Uhren', ['die Uhr', 'die Uhres', 'die Uhrenn']],
    ['das Problem', 'die Probleme', ['die Problem', 'die Problems', 'die Problemen']],
    ['der Kuchen', 'die Kuchen', ['die Kuchs', 'die Küchen', 'die Kuchens']],
    ['die Banane', 'die Bananen', ['die Banan', 'die Bananes', 'die Bananens']],
    ['das Museum', 'die Museen', ['die Museums', 'die Museum', 'die Museens']],
    ['der Schüler', 'die Schüler', ['die Schülers', 'die Schüle', 'die Schülern']],
    ['die Pizza', 'die Pizzen', ['die Pizza', 'die Pizzes', 'die Pizzens']],
    ['das Brot', 'die Brote', ['die Brot', 'die Bröte', 'die Broten']],
    ['der Park', 'die Parks', ['die Park', 'die Parke', 'die Parken']],
    ['die Straße', 'die Straßen', ['die Straß', 'die Straßes', 'die Straßens']],
    ['das Gemüse', 'die Gemüse', ['die Gemüses', 'die Gemüsen', 'die Gemüs']],
    ['der Hund', 'die Hunde', ['die Hund', 'die Hunds', 'die Hünde']],
    ['die Katze', 'die Katzen', ['die Katz', 'die Katzes', 'die Kätzen']],
    ['das Glas', 'die Gläser', ['die Glas', 'die Gläsern', 'die Glass']],
    ['der Baum', 'die Bäume', ['die Baum', 'die Bäum', 'die Bäumen']],
    ['die Sonne', 'die Sonnen', ['die Sonn', 'die Sonnes', 'die Sönnen']],
    ['das Spiel', 'die Spiele', ['die Spiel', 'die Spiels', 'die Spielen']],
    ['der Computer', 'die Computer', ['die Computers', 'die Computern', 'die Computere']],
    ['die Idee', 'die Ideen', ['die Ide', 'die Idees', 'die Ideens']],
    ['das Ticket', 'die Tickets', ['die Ticket', 'die Ticketen', 'die Ticketsn']],
    ['der Kaffee', 'die Kaffees', ['die Kaffee', 'die Kaffeen', 'die Kaffes']],
    ['der Tee', 'die Tees', ['die Tee', 'die Tean', 'die Teesn']],
    ['die Tomate', 'die Tomaten', ['die Tomat', 'die Tomates', 'die Tomatens']],
    ['der Salat', 'die Salate', ['die Salat', 'die Salats', 'die Saläte']],
  ];

  const core = pairs.filter(([s, p]) => p !== '—' && !FREE.has(s));
  const premiumPairs = [
    ['der Stuhl', 'die Stühle', ['die Stuhl', 'die Stühlen', 'die Stuhs']],
    ['die Tasche', 'die Taschen', ['die Tasch', 'die Taschens', 'die Täschen']],
    core[0],
    ['der Tisch', 'die Tische', ['die Tisch', 'die Tischen', 'die Tischs']],
    ...core.slice(1),
    ['der Brief', 'die Briefe', ['die Brief', 'die Briefs', 'die Briefen']],
    ['das Handy', 'die Handys', ['die Handy', 'die Handysn', 'die Handysen']],
  ];
  if (premiumPairs.length !== 45) {
    throw new Error(`genPlural: expected 45 premium pairs, got ${premiumPairs.length}`);
  }

  const themes = ['Essen', 'Stadt', 'Transport', 'Schule', 'Familie', 'Hobby', 'Wetter', 'Einkaufen', 'Sport', 'Reisen'];
  /** @type {Q[]} */
  const out = [];
  for (let i = 0; i < 45; i++) {
    const [sing, plural, wrong] = premiumPairs[i];
    const theme = themes[i % themes.length];
    out.push({
      prompt: `[${theme}] Plural von „${sing}"?`,
      options: shuffle([plural, ...wrong], i + 3),
      correct: plural,
    });
  }
  return out;
}

function restorePluralSelectOne() {
  return writeTopic('PLURAL', 'a1-pl', genPlural(), 6, 50, true);
}

// ─── VERBKONJUGATION ────────────────────────────────────────────────────────

function genKonjugation() {
  const verbs = [
    { inf: 'spielen', ich: 'spiele', du: 'spielst', er: 'spielt', wir: 'spielen', ihr: 'spielt', sie: 'spielen', ctx: 'Fußball im Park' },
    { inf: 'kaufen', ich: 'kaufe', du: 'kaufst', er: 'kauft', wir: 'kaufen', ihr: 'kauft', sie: 'kaufen', ctx: 'Brot im Supermarkt' },
    { inf: 'fahren', ich: 'fahre', du: 'fährst', er: 'fährt', wir: 'fahren', ihr: 'fahrt', sie: 'fahren', ctx: 'mit dem Bus zur Schule' },
    { inf: 'lesen', ich: 'lese', du: 'liest', er: 'liest', wir: 'lesen', ihr: 'lest', sie: 'lesen', ctx: 'ein Buch über Reisen' },
    { inf: 'schreiben', ich: 'schreibe', du: 'schreibst', er: 'schreibt', wir: 'schreiben', ihr: 'schreibt', sie: 'schreiben', ctx: 'eine E-Mail an Freunde' },
    { inf: 'kochen', ich: 'koche', du: 'kochst', er: 'kocht', wir: 'kochen', ihr: 'kocht', sie: 'kochen', ctx: 'Pasta zum Abendessen' },
    { inf: 'tanzen', ich: 'tanze', du: 'tanzt', er: 'tanzt', wir: 'tanzen', ihr: 'tanzt', sie: 'tanzen', ctx: 'gern am Wochenende' },
    { inf: 'singen', ich: 'singe', du: 'singst', er: 'singt', wir: 'singen', ihr: 'singt', sie: 'singen', ctx: 'laut im Chor' },
    { inf: 'arbeiten', ich: 'arbeite', du: 'arbeitest', er: 'arbeitet', wir: 'arbeiten', ihr: 'arbeitet', sie: 'arbeiten', ctx: 'im Büro in der Stadt' },
    { inf: 'wohnen', ich: 'wohne', du: 'wohnst', er: 'wohnt', wir: 'wohnen', ihr: 'wohnt', sie: 'wohnen', ctx: 'in einer kleinen Wohnung' },
    { inf: 'lernen', ich: 'lerne', du: 'lernst', er: 'lernt', wir: 'lernen', ihr: 'lernt', sie: 'lernen', ctx: 'Deutsch für die Schule' },
    { inf: 'hören', ich: 'höre', du: 'hörst', er: 'hört', wir: 'hören', ihr: 'hört', sie: 'hören', ctx: 'Musik beim Sport' },
    { inf: 'trinken', ich: 'trinke', du: 'trinkst', er: 'trinkt', wir: 'trinken', ihr: 'trinkt', sie: 'trinken', ctx: 'Wasser nach dem Training' },
    { inf: 'essen', ich: 'esse', du: 'isst', er: 'isst', wir: 'essen', ihr: 'esst', sie: 'essen', ctx: 'Obst zum Frühstück' },
    { inf: 'schwimmen', ich: 'schwimme', du: 'schwimmst', er: 'schwimmt', wir: 'schwimmen', ihr: 'schwimmt', sie: 'schwimmen', ctx: 'im See im Sommer' },
  ];
  const subjects = [
    ['ich', 'ich'], ['du', 'du'], ['er', 'er'], ['sie', 'sie'], ['wir', 'wir'], ['ihr', 'ihr'], ['Anna', 'er/sie'],
    ['Peter', 'er'], ['meine Freunde', 'sie'], ['wir', 'wir'],
  ];
  const themes = ['Sport', 'Essen', 'Transport', 'Schule', 'Hobby', 'Stadt', 'Familie', 'Wetter', 'Musik', 'Reisen'];

  /** @type {Q[]} */
  const out = [];
  for (let i = 0; i < 45; i++) {
    const v = verbs[i % verbs.length];
    const [subj, key] = subjects[i % subjects.length];
    const correct = v[key === 'er/sie' ? 'er' : key];
    const pool = [...new Set([v.ich, v.du, v.er, v.wir, v.ihr, v.sie, v.inf])];
    const theme = themes[i % themes.length];
    out.push({
      prompt: `[${theme}] ${subj.charAt(0).toUpperCase() + subj.slice(1)} ___ ${v.ctx}. (${v.inf})`,
      options: options4(correct, pool, i + 5),
      correct,
    });
  }
  return out;
}

// ─── ADJEKTIVDEKLINATION ────────────────────────────────────────────────────

function genAdjektiv() {
  const items = [
    { art: 'ein', g: 'm', adj: 'klein', end: 'kleiner', noun: 'Hund', theme: 'Tiere' },
    { art: 'ein', g: 'f', adj: 'neu', end: 'neue', noun: 'Tasche', theme: 'Schule' },
    { art: 'ein', g: 'n', adj: 'alt', end: 'altes', noun: 'Fahrrad', theme: 'Transport' },
    { art: 'der', g: 'm', adj: 'gut', end: 'gute', noun: 'Freund', theme: 'Freunde' },
    { art: 'die', g: 'f', adj: 'schön', end: 'schöne', noun: 'Stadt', theme: 'Reisen' },
    { art: 'das', g: 'n', adj: 'lecker', end: 'leckere', noun: 'Essen', theme: 'Essen' },
    { art: 'kein', g: 'm', adj: 'groß', end: 'großer', noun: 'Garten', theme: 'Zuhause' },
    { art: 'keine', g: 'f', adj: 'warm', end: 'warme', noun: 'Jacke', theme: 'Wetter' },
    { art: 'ein', g: 'm', adj: 'schnell', end: 'schneller', noun: 'Zug', theme: 'Transport' },
    { art: 'der', g: 'm', adj: 'laut', end: 'laute', noun: 'Bus', theme: 'Stadt' },
    { art: 'eine', g: 'f', adj: 'interessant', end: 'interessante', noun: 'Idee', theme: 'Hobby' },
    { art: 'das', g: 'n', adj: 'modern', end: 'moderne', noun: 'Handy', theme: 'Freunde' },
    { art: 'ein', g: 'n', adj: 'kalt', end: 'kaltes', noun: 'Wasser', theme: 'Essen' },
    { art: 'der', g: 'm', adj: 'teuer', end: 'teure', noun: 'Mantel', theme: 'Einkaufen' },
    { art: 'die', g: 'f', adj: 'frisch', end: 'frische', noun: 'Milch', theme: 'Essen' },
  ];
  const wrongEnds = ['kleiner', 'kleine', 'kleines', 'kleinen', 'guter', 'gute', 'gutes', 'guten', 'neuer', 'neue', 'neues', 'neuen'];

  /** @param {typeof items[0]} it */
  function adjPrompt(it) {
    const t = it.theme;
    if (it.art === 'der' || it.art === 'die' || it.art === 'das') {
      return `[${t}] ${it.art.charAt(0).toUpperCase() + it.art.slice(1)} ___ ${it.noun} gefällt mir.`;
    }
    if (it.art === 'keine' || it.art === 'eine') {
      return `[${t}] Ich habe eine ___ ${it.noun}.`;
    }
    if (it.art === 'kein') {
      return `[${t}] Das ist kein ___ ${it.noun}.`;
    }
    if (it.art === 'ein' && it.g === 'f') {
      return `[${t}] Das ist eine ___ ${it.noun}.`;
    }
    return `[${t}] Das ist ein ___ ${it.noun}.`;
  }

  /** @type {Q[]} */
  const out = [];
  for (let i = 0; i < 45; i++) {
    const it = items[i % items.length];
    out.push({
      prompt: adjPrompt(it),
      hint: 'Adjektivendung',
      options: options4(it.end, wrongEnds, i + 17),
      correct: it.end,
    });
  }
  return out;
}

function restoreAdjektivSelectOne() {
  return writeTopic('ADJEKTIVDEKLINATIONA1', 'a1-adj', genAdjektiv(), 6, 50, true);
}

// ─── WECHSELPRÄPOSITIONEN ───────────────────────────────────────────────────

function genWechsel() {
  const scenes = [
    { move: true, prep: 'in', akk: 'in den', dat: 'im', noun: 'Park', theme: 'Stadt', verb: 'gehe' },
    { move: false, prep: 'in', akk: 'in den', dat: 'im', noun: 'Park', theme: 'Stadt', verb: 'bin' },
    { move: true, prep: 'auf', akk: 'auf den', dat: 'auf dem', noun: 'Tisch', theme: 'Essen', verb: 'lege' },
    { move: false, prep: 'auf', akk: 'auf den', dat: 'auf dem', noun: 'Tisch', theme: 'Essen', verb: 'liegt' },
    { move: true, prep: 'an', akk: 'an die', dat: 'an der', noun: 'Wand', theme: 'Zuhause', verb: 'hänge' },
    { move: false, prep: 'an', akk: 'an die', dat: 'an der', noun: 'Wand', theme: 'Zuhause', verb: 'hängt' },
    { move: true, prep: 'in', akk: 'ins', dat: 'im', noun: 'Kino', theme: 'Hobby', verb: 'gehe' },
    { move: false, prep: 'in', akk: 'ins', dat: 'im', noun: 'Kino', theme: 'Hobby', verb: 'sitze' },
    { move: true, prep: 'auf', akk: 'auf das', dat: 'auf dem', noun: 'Dach', theme: 'Stadt', verb: 'klettere' },
    { move: false, prep: 'auf', akk: 'auf das', dat: 'auf dem', noun: 'Dach', theme: 'Stadt', verb: 'stehe' },
    { move: true, prep: 'in', akk: 'in die', dat: 'in der', noun: 'Schule', theme: 'Schule', verb: 'komme' },
    { move: false, prep: 'in', akk: 'in die', dat: 'in der', noun: 'Schule', theme: 'Schule', verb: 'lerne' },
    { move: true, prep: 'auf', akk: 'auf die', dat: 'auf der', noun: 'Straße', theme: 'Transport', verb: 'fahre' },
    { move: false, prep: 'auf', akk: 'auf die', dat: 'auf der', noun: 'Straße', theme: 'Transport', verb: 'laufe' },
    { move: true, prep: 'in', akk: 'in das', dat: 'im', noun: 'Restaurant', theme: 'Essen', verb: 'gehe' },
  ];
  const pool = ['in den', 'im', 'ins', 'in der', 'auf den', 'auf dem', 'an die', 'an der', 'auf die', 'auf der'];

  /** @type {Q[]} */
  const out = [];
  for (let i = 0; i < 45; i++) {
    const sc = { ...scenes[i % scenes.length], move: i % 2 === 0 };
    const correct = sc.move ? sc.akk : sc.dat;
    const hint = sc.move ? 'Bewegung → Akkusativ' : 'Ort → Dativ';
    out.push({
      prompt: `[${sc.theme}] Ich ${sc.verb} ___ ${sc.noun}. (${hint})`,
      options: options4(correct, pool, i + 23),
      correct,
    });
  }
  return out;
}

// ─── DATIV ────────────────────────────────────────────────────────────────────

function genDativ() {
  const items = [
    { sent: 'Ich helfe ___ Kind.', correct: 'dem', pool: ['dem', 'den', 'der', 'das'], theme: 'Familie', hint: 'Dativ — das Kind, Dat.' },
    { sent: 'Ich gebe ___ Frau die Blume.', correct: 'der', pool: ['der', 'die', 'dem', 'den'], theme: 'Freunde', hint: 'Dativ — die Frau, Dat.' },
    { sent: 'Ich danke ___ Lehrer.', correct: 'dem', pool: ['dem', 'den', 'der', 'die'], theme: 'Schule', hint: 'Dativ — der Lehrer, Dat.' },
    { sent: 'Das gehört ___ Bruder.', correct: 'dem', pool: ['dem', 'den', 'der', 'des'], theme: 'Familie', hint: 'Dativ — der Bruder, Dat.' },
    { sent: 'Ich antworte ___ Freundin.', correct: 'der', pool: ['der', 'die', 'dem', 'den'], theme: 'Freunde', hint: 'Dativ — die Freundin, Dat.' },
    { sent: 'Wir gratulieren ___ Eltern.', correct: 'den', pool: ['den', 'der', 'dem', 'die'], theme: 'Familie', hint: 'Dativ — die Eltern, Dat.' },
    { sent: 'Ich erzähle ___ Kindern eine Geschichte.', correct: 'den Kindern', pool: ['den Kindern', 'die Kinder', 'der Kinder', 'dem Kind'], theme: 'Schule', hint: 'Dativ — die Kinder, Dat.' },
    { sent: 'Kannst du ___ helfen?', correct: 'mir', pool: ['mir', 'mich', 'ich', 'mein'], theme: 'Freunde', hint: 'Dativ — ich, Dat.' },
    { sent: 'Das schmeckt ___ gut.', correct: 'dir', pool: ['dir', 'dich', 'du', 'dein'], theme: 'Essen', hint: 'Dativ — du, Dat.' },
    { sent: 'Ich kaufe ___ eine Karte.', correct: 'meiner Mutter', pool: ['meiner Mutter', 'meine Mutter', 'meinen Mutter', 'meinem Mutter'], theme: 'Reisen', hint: 'Dativ — meine Mutter, Dat.' },
    { sent: 'Ich folge ___ Hund.', correct: 'dem', pool: ['dem', 'den', 'der', 'das'], theme: 'Tiere', hint: 'Dativ — der Hund, Dat.' },
    { sent: 'Es geht ___ schlecht.', correct: 'ihm', pool: ['ihm', 'ihn', 'er', 'sein'], theme: 'Gesundheit', hint: 'Dativ — er, Dat.' },
    { sent: 'Ich schreibe ___ einen Brief.', correct: 'Anna', pool: ['Anna', 'Annan', 'Annas', 'Annam'], theme: 'Freunde', hint: 'Dativ — Anna, Dat.' },
    { sent: 'Mit ___ fahre ich zur Arbeit.', correct: 'dem Bus', pool: ['dem Bus', 'den Bus', 'der Bus', 'des Bus'], theme: 'Transport', hint: 'Dativ — der Bus, Dat.' },
    { sent: 'In ___ Stadt wohne ich.', correct: 'der', pool: ['der', 'die', 'dem', 'den'], theme: 'Stadt', hint: 'Dativ — die Stadt, Dat.' },
  ];

  /** @type {Q[]} */
  const out = [];
  for (let i = 0; i < 45; i++) {
    const it = items[i % items.length];
    out.push({
      prompt: `[${it.theme}] ${it.sent}`,
      hint: it.hint,
      options: options4(it.correct, it.pool, i + 31),
      correct: it.correct,
    });
  }
  return out;
}

function restoreDativSelectOne() {
  return writeTopic('DATIVA1', 'a1-dat', genDativ(), 6, 50, true);
}

// ─── AKKUSATIV ────────────────────────────────────────────────────────────────

function genAkkusativ() {
  const items = [
    { sent: 'Ich sehe ___ Mann.', correct: 'den', pool: ['den', 'der', 'dem', 'des'], theme: 'Stadt', hint: 'Akkusativ — der Mann, Akk.' },
    { sent: 'Ich kaufe ___ Apfel.', correct: 'einen', pool: ['einen', 'ein', 'eine', 'einer'], theme: 'Essen', hint: 'Akkusativ — ein Apfel, Akk.' },
    { sent: 'Ich esse ___ Brot.', correct: 'das', pool: ['das', 'den', 'dem', 'der'], theme: 'Essen', hint: 'Akkusativ — das Brot, Akk.' },
    { sent: 'Ich trinke ___ Wasser.', correct: 'das', pool: ['das', 'den', 'dem', 'die'], theme: 'Essen', hint: 'Akkusativ — das Wasser, Akk.' },
    { sent: 'Ich lese ___ Buch.', correct: 'ein', pool: ['ein', 'einen', 'eine', 'einer'], theme: 'Schule', hint: 'Akkusativ — ein Buch, Akk.' },
    { sent: 'Ich besuche ___ Freundin.', correct: 'meine', pool: ['meine', 'mein', 'meinen', 'meiner'], theme: 'Freunde', hint: 'Akkusativ — meine Freundin, Akk.' },
    { sent: 'Ich nehme ___ Bus.', correct: 'den', pool: ['den', 'der', 'dem', 'des'], theme: 'Transport', hint: 'Akkusativ — der Bus, Akk.' },
    { sent: 'Ich brauche ___ Regenschirm.', correct: 'einen', pool: ['einen', 'ein', 'eine', 'einer'], theme: 'Wetter', hint: 'Akkusativ — ein Regenschirm, Akk.' },
    { sent: 'Ich suche ___ Hotel.', correct: 'ein', pool: ['ein', 'einen', 'eine', 'einer'], theme: 'Reisen', hint: 'Akkusativ — ein Hotel, Akk.' },
    { sent: 'Ich spiele ___ Ball.', correct: 'den', pool: ['den', 'der', 'dem', 'des'], theme: 'Sport', hint: 'Akkusativ — der Ball, Akk.' },
    { sent: 'Ich höre ___ Musik.', correct: 'die', pool: ['die', 'der', 'dem', 'den'], theme: 'Musik', hint: 'Akkusativ — die Musik, Akk.' },
    { sent: 'Ich mache ___ Foto.', correct: 'ein', pool: ['ein', 'einen', 'eine', 'einer'], theme: 'Hobby', hint: 'Akkusativ — ein Foto, Akk.' },
    { sent: 'Ich liebe ___ Stadt.', correct: 'diese', pool: ['diese', 'dieser', 'dieses', 'diesen'], theme: 'Reisen', hint: 'Akkusativ — diese Stadt, Akk.' },
    { sent: 'Ich finde ___ Film toll.', correct: 'den', pool: ['den', 'der', 'dem', 'des'], theme: 'Hobby', hint: 'Akkusativ — der Film, Akk.' },
    { sent: 'Ich kaufe ___ Jacke.', correct: 'eine', pool: ['eine', 'ein', 'einen', 'einer'], theme: 'Einkaufen', hint: 'Akkusativ — eine Jacke, Akk.' },
  ];

  /** @type {Q[]} */
  const out = [];
  for (let i = 0; i < 45; i++) {
    const it = items[i % items.length];
    out.push({
      prompt: `[${it.theme}] ${it.sent}`,
      hint: it.hint,
      options: options4(it.correct, it.pool, i + 37),
      correct: it.correct,
    });
  }
  return out;
}

function restoreAkkusativSelectOne() {
  return writeTopic('AKKUSATIVA1', 'a1-akk', genAkkusativ(), 6, 50, true);
}

// ─── ARTIKEL ──────────────────────────────────────────────────────────────────

function genArtikel() {
  const nouns = [
    { g: 'm', der: 'Der', ein: 'ein', kein: 'kein', noun: 'Tisch', theme: 'Zuhause' },
    { g: 'f', der: 'Die', ein: 'eine', kein: 'keine', noun: 'Lampe', theme: 'Zuhause' },
    { g: 'n', der: 'Das', ein: 'ein', kein: 'kein', noun: 'Kind', theme: 'Familie' },
    { g: 'm', der: 'Der', ein: 'ein', kein: 'kein', noun: 'Zug', theme: 'Transport' },
    { g: 'f', der: 'Die', ein: 'eine', kein: 'keine', noun: 'Straße', theme: 'Stadt' },
    { g: 'n', der: 'Das', ein: 'ein', kein: 'kein', noun: 'Essen', theme: 'Essen' },
    { g: 'm', der: 'Der', ein: 'ein', kein: 'kein', noun: 'Regen', theme: 'Wetter' },
    { g: 'f', der: 'Die', ein: 'eine', kein: 'keine', noun: 'Sonne', theme: 'Wetter' },
    { g: 'm', der: 'Der', ein: 'ein', kein: 'kein', noun: 'Freund', theme: 'Freunde' },
    { g: 'f', der: 'Die', ein: 'eine', kein: 'keine', noun: 'Schule', theme: 'Schule' },
    { g: 'n', der: 'Das', ein: 'ein', kein: 'kein', noun: 'Hobby', theme: 'Hobby' },
    { g: 'm', der: 'Der', ein: 'ein', kein: 'kein', noun: 'Arzt', theme: 'Gesundheit' },
    { g: 'f', der: 'Die', ein: 'eine', kein: 'keine', noun: 'Pizza', theme: 'Essen' },
    { g: 'n', der: 'Das', ein: 'ein', kein: 'kein', noun: 'Fahrrad', theme: 'Sport' },
    { g: 'm', der: 'Der', ein: 'ein', kein: 'kein', noun: 'Markt', theme: 'Einkaufen' },
  ];
  const modes = ['def', 'ein', 'kein'];

  /** @type {Q[]} */
  const out = [];
  for (let i = 0; i < 45; i++) {
    const n = nouns[i % nouns.length];
    const mode = modes[i % modes.length];
    let correct;
    let prompt;
    if (mode === 'def') {
      correct = n.der;
      prompt = `[${n.theme}] ___ ${n.noun} ist wichtig.`;
    } else if (mode === 'ein') {
      correct = n.ein;
      prompt = `[${n.theme}] Ich habe ___ ${n.noun}.`;
    } else {
      correct = n.kein;
      prompt = `[${n.theme}] Ich habe ___ ${n.noun}.`;
    }
    const pool = ['Der', 'Die', 'Das', 'Den', 'ein', 'eine', 'einen', 'kein', 'keine', 'keinen'];
    out.push({
      prompt,
      options: options4(correct, pool, i + 41),
      correct,
    });
  }
  return out;
}

// ─── W-FRAGEN ─────────────────────────────────────────────────────────────────

function genWFragen() {
  const items = [
    { q: 'Wo', sent: '___ wohnst du? — In München.', pool: ['Wo', 'Wohin', 'Woher', 'Wann'] },
    { q: 'Woher', sent: '___ kommst du? — Aus Polen.', pool: ['Woher', 'Wohin', 'Wo', 'Wer'] },
    { q: 'Wohin', sent: '___ fährst du? — Nach Hamburg.', pool: ['Wohin', 'Woher', 'Wo', 'Wie'] },
    { q: 'Wann', sent: '___ beginnt der Kurs? — Um 9 Uhr.', pool: ['Wann', 'Wo', 'Was', 'Wer'] },
    { q: 'Wie', sent: '___ heißt du? — Anna.', pool: ['Wie', 'Was', 'Wo', 'Wer'] },
    { q: 'Was', sent: '___ machst du heute? — Sport.', pool: ['Was', 'Wer', 'Wo', 'Wann'] },
    { q: 'Wer', sent: '___ ist das? — Mein Bruder.', pool: ['Wer', 'Was', 'Wo', 'Wie'] },
    { q: 'Warum', sent: '___ lernst du Deutsch? — Für die Arbeit.', pool: ['Warum', 'Wann', 'Wo', 'Was'] },
    { q: 'Wie viel', sent: '___ kostet das Brot? — 2 Euro.', pool: ['Wie viel', 'Wann', 'Wo', 'Was'] },
    { q: 'Wie', sent: '___ ist das Wetter? — Schön und warm.', pool: ['Wie', 'Was', 'Wo', 'Wann'], theme: 'Wetter' },
    { q: 'Wo', sent: '___ ist der Bahnhof? — Dort drüben.', pool: ['Wo', 'Wohin', 'Woher', 'Wann'], theme: 'Transport' },
    { q: 'Was', sent: '___ isst du gern? — Pizza.', pool: ['Was', 'Wer', 'Wo', 'Wann'], theme: 'Essen' },
    { q: 'Wann', sent: '___ kommst du? — Um 18 Uhr.', pool: ['Wann', 'Wo', 'Was', 'Wer'], theme: 'Freunde' },
    { q: 'Wie', sent: '___ kommst du zur Schule? — Mit dem Bus.', pool: ['Wie', 'Wo', 'Was', 'Wer'], theme: 'Schule' },
    { q: 'Was', sent: '___ ist dein Hobby? — Musik.', pool: ['Was', 'Wer', 'Wo', 'Wann'], theme: 'Hobby' },
  ];

  /** @type {Q[]} */
  const out = [];
  for (let i = 0; i < 45; i++) {
    const it = items[i % items.length];
    const theme = it.theme || ['Stadt', 'Familie', 'Reisen', 'Sport', 'Einkaufen'][i % 5];
    out.push({
      prompt: `[${theme}] ${it.sent}`,
      options: options4(it.q, it.pool, i + 43),
      correct: it.q,
    });
  }
  return out;
}

// ─── NEGATION ─────────────────────────────────────────────────────────────────

function genNegation() {
  const items = [
    { sent: 'Ich habe ___ Zeit.', correct: 'keine', pool: ['keine', 'kein', 'nicht', 'keinen'], theme: 'Schule' },
    { sent: 'Das ist ___ richtig.', correct: 'nicht', pool: ['nicht', 'kein', 'keine', 'keinen'], theme: 'Stadt' },
    { sent: 'Ich habe ___ Hunger.', correct: 'keinen', pool: ['keinen', 'kein', 'keine', 'nicht'], theme: 'Essen' },
    { sent: 'Ich trinke ___ Kaffee.', correct: 'keinen', pool: ['keinen', 'kein', 'keine', 'nicht'], theme: 'Essen' },
    { sent: 'Ich bin ___ müde.', correct: 'nicht', pool: ['nicht', 'kein', 'keine', 'nie'], theme: 'Gesundheit' },
    { sent: 'Ich habe ___ Auto.', correct: 'kein', pool: ['kein', 'keine', 'nicht', 'keinen'], theme: 'Transport' },
    { sent: 'Das Wetter ist ___ schön.', correct: 'nicht', pool: ['nicht', 'kein', 'keine', 'nie'], theme: 'Wetter' },
    { sent: 'Ich habe ___ Freunde in Berlin.', correct: 'keine', pool: ['keine', 'kein', 'nicht', 'keinen'], theme: 'Freunde' },
    { sent: 'Ich gehe ___ ins Kino.', correct: 'nicht', pool: ['nicht', 'kein', 'keine', 'nie'], theme: 'Hobby' },
    { sent: 'Ich esse ___ Fleisch.', correct: 'kein', pool: ['kein', 'keine', 'nicht', 'keinen'], theme: 'Essen' },
    { sent: 'Ich war ___ in Paris.', correct: 'noch nie', pool: ['noch nie', 'nicht', 'kein', 'keine'], theme: 'Reisen' },
    { sent: 'Er kommt ___ heute.', correct: 'nicht', pool: ['nicht', 'kein', 'keine', 'nie'], theme: 'Freunde' },
    { sent: 'Wir haben ___ Geld.', correct: 'kein', pool: ['kein', 'keine', 'nicht', 'keinen'], theme: 'Einkaufen' },
    { sent: 'Das ist ___ mein Fahrrad.', correct: 'nicht', pool: ['nicht', 'kein', 'keine', 'keinen'], theme: 'Sport' },
    { sent: 'Ich spiele ___ Gitarre.', correct: 'keine', pool: ['keine', 'kein', 'nicht', 'keinen'], theme: 'Musik' },
  ];

  /** @type {Q[]} */
  const out = [];
  for (let i = 0; i < 45; i++) {
    const it = items[i % items.length];
    out.push({
      prompt: `[${it.theme}] ${it.sent}`,
      options: options4(it.correct, it.pool, i + 47),
      correct: it.correct,
    });
  }
  return out;
}

// ─── GEGENTEILE ───────────────────────────────────────────────────────────────

function genGegenteile() {
  const pairs = [
    ['groß', 'klein', ['lang', 'kurz', 'dünn']],
    ['schnell', 'langsam', ['kurz', 'leicht', 'kalt']],
    ['warm', 'kalt', ['heiß', 'kühl', 'hell']],
    ['jung', 'alt', ['neu', 'frisch', 'klein']],
    ['billig', 'teuer', ['günstig', 'preiswert', 'reich']],
    ['hell', 'dunkel', ['schwarz', 'grau', 'blass']],
    ['leicht', 'schwer', ['schwierig', 'hart', 'dick']],
    ['neu', 'alt', ['jung', 'kaputt', 'modern']],
    ['offen', 'geschlossen', ['zu', 'leer', 'voll']],
    ['richtig', 'falsch', ['schlecht', 'kaputt', 'schwer']],
    ['fröhlich', 'traurig', ['müde', 'böse', 'still']],
    ['laut', 'leise', ['still', 'ruhig', 'sanft']],
    ['sauber', 'schmutzig', ['kaputt', 'voll', 'leer']],
    ['voll', 'leer', ['offen', 'klein', 'kurz']],
    ['stark', 'schwach', ['leicht', 'dünn', 'klein']],
    ['hoch', 'niedrig', ['klein', 'kurz', 'flach']],
    ['lang', 'kurz', ['klein', 'schnell', 'eng']],
    ['dick', 'dünn', ['schmal', 'leicht', 'klein']],
    ['schwer', 'leicht', ['einfach', 'klein', 'kurz']],
    ['gut', 'schlecht', ['böse', 'falsch', 'traurig']],
    ['schön', 'hässlich', ['traurig', 'dunkel', 'kalt']],
    ['freundlich', 'unfreundlich', ['böse', 'still', 'traurig']],
    ['pünktlich', 'unpünktlich', ['spät', 'langsam', 'falsch']],
    ['interessant', 'langweilig', ['schwer', 'still', 'leer']],
    ['gesund', 'krank', ['müde', 'schwach', 'schlecht']],
  ];
  const themes = ['Stadt', 'Wetter', 'Essen', 'Sport', 'Schule', 'Familie', 'Transport', 'Hobby', 'Einkaufen', 'Gesundheit'];

  /** @type {Q[]} */
  const out = [];
  for (let i = 0; i < 45; i++) {
    const [word, opp, wrong] = pairs[i % pairs.length];
    const theme = themes[i % themes.length];
    out.push({
      prompt: `[${theme}] Gegenteil von „${word}"?`,
      options: shuffle([opp, ...wrong], i + 51),
      correct: opp,
    });
  }
  return out;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const generators = {
  POSSESSIVARTIKEL: genPossessiv,
  PLURAL: genPlural,
  VERBKONJUGATION: genKonjugation,
  ADJEKTIVDEKLINATIONA1: genAdjektiv,
  WECHSELPRÄPOSITIONEN: genWechsel,
  DATIVA1: genDativ,
  AKKUSATIVA1: genAkkusativ,
  ARTIKEL: genArtikel,
  'W-FRAGEN': genWFragen,
  NEGATION: genNegation,
  GEGENTEILE: genGegenteile,
};

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  if (process.argv.includes('--restore')) {
    const topic = process.argv.find((a) => a.startsWith('--topic='))?.slice(8) || 'POSSESSIVARTIKEL';
    if (topic === 'POSSESSIVARTIKEL') {
      const n = restorePossessivSelectOne();
      console.log(`Restored ${n} A1 possessiv select-one files.`);
      process.exit(0);
    }
    if (topic === 'PLURAL') {
      const n = restorePluralSelectOne();
      console.log(`Restored ${n} A1 plural select-one files.`);
      process.exit(0);
    }
    if (topic === 'ADJEKTIVDEKLINATIONA1') {
      const n = restoreAdjektivSelectOne();
      console.log(`Restored ${n} A1 adjektiv select-one files.`);
      process.exit(0);
    }
    if (topic === 'DATIVA1') {
      const n = restoreDativSelectOne();
      console.log(`Restored ${n} A1 dativ select-one files.`);
      process.exit(0);
    }
    if (topic === 'AKKUSATIVA1') {
      const n = restoreAkkusativSelectOne();
      console.log(`Restored ${n} A1 akkusativ select-one files.`);
      process.exit(0);
    }
    console.error(`Restore not supported for ${topic}`);
    process.exit(1);
  }

  let total = 0;
  for (const [folder, prefix] of Object.entries(TOPICS)) {
    const qs = generators[folder]();
    const n = writeTopic(folder, prefix, qs);
    total += n;
    // eslint-disable-next-line no-console
    console.log(`${folder}: +${n} (target 45 new, 50 select-one total with 001–005)`);
  }

  // eslint-disable-next-line no-console
  console.log(`\nTotal new files: ${total}`);
}

export {
  genPossessiv, restorePossessivSelectOne, genPlural, restorePluralSelectOne,
  genAdjektiv, restoreAdjektivSelectOne, genDativ, restoreDativSelectOne,
  genAkkusativ, restoreAkkusativSelectOne, POSSESSIV_CASE_LABEL,
};
