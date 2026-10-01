#!/usr/bin/env node
/**
 * Fix grammatically incomplete / incorrect A1 dropbox sentences.
 * Patches source banks and existing .md question files.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** @type {Record<string, string[]>} */
const FIXES = {
  'a1-dat-dd-010': ['Ich', 'fahre', 'mit', 'dem', 'Bus'],
  'a1-dat-dd-011': ['Ich', 'wohne', 'in', 'der', 'Stadt'],
  'a1-dat-dd-012': ['Wir', 'spielen', 'mit', 'dem', 'Ball'],
  'a1-dat-dd-013': ['Er', 'spielt', 'mit', 'der', 'Gitarre'],
  'a1-dat-dd-014': ['Mama', 'kocht', 'in', 'der', 'Küche'],
  'a1-dat-dd-015': ['Er', 'ist', 'bei', 'der', 'Arbeit'],
  'a1-dat-dd-017': ['Der', 'Arzt', 'hilft', 'dem', 'Patient'],
  'a1-dat-dd-021': ['Der', 'Lehrer', 'gibt', 'dem', 'Schüler', 'ein', 'Buch'],
  'a1-dat-dd-022': ['Ich', 'schneide', 'mit', 'dem', 'Messer'],
  'a1-dat-dd-024': ['Wir', 'tanzen', 'auf', 'der', 'Party'],
  'a1-dat-dd-025': ['Ich', 'spiele', 'mit', 'der', 'Schwester'],
  'a1-dat-dd-032': ['Er', 'geht', 'aus', 'dem', 'Kurs'],
  'a1-dat-dd-039': ['Ich', 'komme', 'von', 'der', 'Arbeit'],
  'a1-dat-dd-047': ['Ich', 'sende', 'ihr', 'eine', 'Nachricht'],
  'a1-konj-dd-003': ['Er', 'fährt', 'mit', 'dem', 'Bus'],
  'a1-konj-dd-014': ['Wir', 'reisen', 'gern', 'nach', 'Italien'],
  'a1-konj-dd-019': ['Er', 'wartet', 'auf', 'den', 'Zug'],
  'a1-konj-dd-024': ['Ich', 'gehe', 'in', 'die', 'Stadt'],
  'a1-konj-dd-027': ['Sie', 'bezahlt', 'an', 'der', 'Kasse'],
  'a1-konj-dd-028': ['Der', 'Kurs', 'beginnt', 'um', 'acht'],
  'a1-konj-dd-038': ['Ich', 'steige', 'in', 'den', 'Bus'],
};

const OLD_TO_NEW = new Map(
  Object.entries(FIXES).map(([id, words]) => {
    const oldKey = id; // matched by id in md files
    return [oldKey, words];
  }),
);

/** Replace words arrays in source banks by matching old array string. */
const SOURCE_PATCHES = [
  ["['Ich', 'fahre', 'mit', 'Bus']", "['Ich', 'fahre', 'mit', 'dem', 'Bus']"],
  ["['Ich', 'wohne', 'in', 'Stadt']", "['Ich', 'wohne', 'in', 'der', 'Stadt']"],
  ["['Wir', 'spielen', 'mit', 'Ball']", "['Wir', 'spielen', 'mit', 'dem', 'Ball']"],
  ["['Er', 'spielt', 'mit', 'Gitarre']", "['Er', 'spielt', 'mit', 'der', 'Gitarre']"],
  ["['Mama', 'kocht', 'in', 'Küche']", "['Mama', 'kocht', 'in', 'der', 'Küche']"],
  ["['Er', 'ist', 'bei', 'Arbeit']", "['Er', 'ist', 'bei', 'der', 'Arbeit']"],
  ["['Der', 'Arzt', 'hilft', 'Patient']", "['Der', 'Arzt', 'hilft', 'dem', 'Patient']"],
  ["['Der', 'Lehrer', 'gibt', 'Schüler']", "['Der', 'Lehrer', 'gibt', 'dem', 'Schüler', 'ein', 'Buch']"],
  ["['Ich', 'schneide', 'mit', 'Messer']", "['Ich', 'schneide', 'mit', 'dem', 'Messer']"],
  ["['Wir', 'tanzen', 'auf', 'Party']", "['Wir', 'tanzen', 'auf', 'der', 'Party']"],
  ["['Ich', 'spiele', 'mit', 'Schwester']", "['Ich', 'spiele', 'mit', 'der', 'Schwester']"],
  ["['Er', 'geht', 'aus', 'Kurs']", "['Er', 'geht', 'aus', 'dem', 'Kurs']"],
  ["['Ich', 'komme', 'von', 'Stadt']", "['Ich', 'komme', 'von', 'der', 'Arbeit']"],
  ["['Ich', 'sende', 'ihr', 'Nachricht']", "['Ich', 'sende', 'ihr', 'eine', 'Nachricht']"],
  ["['Er', 'fährt', 'mit', 'Bus']", "['Er', 'fährt', 'mit', 'dem', 'Bus']"],
  ["['Wir', 'reisen', 'gern', 'nach']", "['Wir', 'reisen', 'gern', 'nach', 'Italien']"],
  ["['Er', 'wartet', 'auf', 'Zug']", "['Er', 'wartet', 'auf', 'den', 'Zug']"],
  ["['Ich', 'gehe', 'in', 'Stadt']", "['Ich', 'gehe', 'in', 'die', 'Stadt']"],
  ["['Sie', 'bezahlt', 'an', 'Kasse']", "['Sie', 'bezahlt', 'an', 'der', 'Kasse']"],
  ["['Der', 'Kurs', 'beginnt', 'um']", "['Der', 'Kurs', 'beginnt', 'um', 'acht']"],
  ["['Ich', 'steige', 'in', 'Bus']", "['Ich', 'steige', 'in', 'den', 'Bus']"],
];

function walkMd(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walkMd(p));
    else if (name.endsWith('.md')) out.push(p);
  }
  return out;
}

function patchMd(file) {
  let content = readFileSync(file, 'utf8');
  const id = content.match(/^id: (.+)$/m)?.[1];
  if (!id || !FIXES[id]) return false;
  const words = FIXES[id];
  const wordsBlock = words.map((w) => `  - ${w}`).join('\n');
  const updated = content.replace(/^words:\n(?:  - .+\n)+/m, `words:\n${wordsBlock}\n`);
  if (updated === content) return false;
  writeFileSync(file, updated, 'utf8');
  return true;
}

let mdCount = 0;
for (const file of walkMd(join(ROOT, 'src', 'questions'))) {
  if (patchMd(file)) mdCount += 1;
}

let srcCount = 0;
for (const rel of ['scripts/a1-dropbox-data.mjs', 'scripts/a1-dropbox-data-3.mjs']) {
  const path = join(ROOT, rel);
  let src = readFileSync(path, 'utf8');
  let changed = false;
  for (const [oldStr, newStr] of SOURCE_PATCHES) {
    if (src.includes(oldStr)) {
      src = src.replace(oldStr, newStr);
      changed = true;
      srcCount += 1;
    }
  }
  if (changed) writeFileSync(path, src, 'utf8');
}

console.log(`Patched ${mdCount} question files, ${srcCount} source entries.`);
