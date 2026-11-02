#!/usr/bin/env node
/**
 * Audits B1 SPRACHBAUSTEINEB1 for typical grammar/content errors.
 * Run: npm run questions:audit-sprach
 * (Full bank: npm run questions:audit)
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseQuestionFile } from '../src/site/utils/markdownQuestion.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'site', 'questions', 'B1', 'SPRACHBAUSTEINEB1');

/** Fused prep+article must not be correct when the article is written out after ___. */
const FUSED = {
  dem: new Set(['im', 'am', 'zum', 'beim', 'vom']),
  der: new Set(['zur']),
  das: new Set(['ins', 'ans', 'voms']), // voms nonstandard but catch vom
  den: new Set([]),
  die: new Set([]),
};

const issues = [];

function add(file, code, msg) {
  issues.push({ file, code, msg });
}

function auditGapContext(text, correct, label) {
  const re = /___\s+(dem|der|den|das|die)\b/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    const art = m[1].toLowerCase();
    const bad = FUSED[art];
    if (bad?.has(String(correct).toLowerCase())) {
      add(label, 'FUSED+ARTICLE', `"${correct}" + "${m[1]}" → Doppelartikel (${text.slice(Math.max(0, m.index - 20), m.index + 30)}…)`);
    }
  }
}

function auditFile(file) {
  const raw = readFileSync(join(ROOT, file), 'utf8');
  let q;
  try {
    q = parseQuestionFile(raw, { level: 'B1', topic: 'SPRACHBAUSTEINEB1', path: file });
  } catch (e) {
    add(file, 'PARSE', e.message);
    return;
  }

  if (q.type === 'select-one') {
    if (!q.options.includes(q.correct)) {
      add(file, 'CORRECT_NOT_IN_OPTIONS', `correct="${q.correct}"`);
    }
    auditGapContext(q.prompt, q.correct, file);

    if (/weiterer Fragen/i.test(q.prompt)) {
      add(file, 'ADJ_PLURAL', '„weiterer Fragen“ → sollte „weiteren Fragen“ sein');
    }
    if (/weiteren Informationen/i.test(q.prompt)) {
      add(file, 'ADJ_PLURAL', '„weiteren Informationen“ ohne Artikel → „weitere Informationen“');
    }
    if (/___\s+Ihr\s+(Interesse|B1)/i.test(q.prompt) && q.correct.toLowerCase() === 'für') {
      // „für Ihr …“ ✓
    } else if (/___\s+Ihr\s+/i.test(q.prompt) && q.correct.toLowerCase() === 'an') {
      add(file, 'PRÄP', 'vor „Ihr …“ meist „für“, nicht „an“');
    }

    const filled = q.prompt.replace('___', q.correct);
    if (/\b(im dem|am dem|zum dem|beim dem|zur der|ins das|ans das)\b/i.test(filled)) {
      add(file, 'FUSED+ARTICLE', `ausgefüllt: „${filled.match(/\b\w+ \w+ \w+/i)?.[0] ?? filled.slice(0, 40)}…“`);
    }
    if (/Verständnis wegen der/i.test(q.prompt) && q.correct.toLowerCase() === 'wegen') {
      // ok
    }
    if (/___\s+Verfügung/i.test(q.prompt) && q.correct === 'in') {
      add(file, 'ZUR_VERFÜGUNG', 'nach „___ Verfügung“ ist „zur“ (zu+der) richtig, nicht „in“');
    }
    if (/___\s+Verfügung/i.test(q.prompt) && !['zur', 'in'].includes(q.correct) && q.correct !== 'zur') {
      // zur is correct for "zu der Verfügung"
    }

    // „überweisen … auf das Konto“
    if (/überweisen.*___\s+das/i.test(q.prompt) && q.correct !== 'auf') {
      add(file, 'ÜBERWEISEN', `„überweisen auf das Konto“, nicht „${q.correct}"`);
    }

    // Genitiv after wegen/Aufgrund/trotz/während/gemäß + der
    if (/^(wegen|aufgrund|trotz|während|gemäß|laut|innerhalb|außerhalb)$/i.test(q.correct)) {
      const after = q.prompt.match(/___\s+der\s+(\w+)/i);
      if (after && !/ungen|heit|keit|schaft|tion|schrift|arbeit|nachfrage|verschiebung|vorschriften|renovierungsarbeiten/i.test(after[1])) {
        // soft check only
      }
    }
  }

  if (q.type === 'text-gaps') {
    const gaps = q.gaps || [];
    let from = 0;
    let filled = q.prompt;
    for (let i = 0; i < gaps.length; i++) {
      const idx = q.prompt.indexOf('___', from);
      if (idx === -1) {
        add(file, 'GAP_COUNT', `gap ${i + 1}: kein ___ im Text`);
        break;
      }
      const after = q.prompt.slice(idx + 3).match(/^\s*(dem|der|den|das|die)\b/i);
      if (after) {
        auditGapContext(q.prompt.slice(idx), gaps[i].correct, `${file} [Lücke ${i + 1}]`);
      }
      from = idx + 3;
      if (!gaps[i].options.includes(gaps[i].correct)) {
        add(file, 'CORRECT_NOT_IN_OPTIONS', `Lücke ${i + 1}: correct="${gaps[i].correct}"`);
      }
      filled = filled.replace('___', gaps[i].correct);
    }
    if ((q.prompt.match(/___/g) || []).length !== gaps.length) {
      add(file, 'GAP_COUNT', `${gaps.length} gaps vs ${(q.prompt.match(/___/g) || []).length} ___`);
    }
    if (/\b(im dem|am dem|zum dem|beim dem|zur der|ins das|ans das)\b/i.test(filled)) {
      add(file, 'FUSED+ARTICLE', `ausgefüllter Text enthält Doppelartikel`);
    }
    if (/weiterer Fragen|weiteren Informationen/i.test(filled)) {
      add(file, 'ADJ_PLURAL', 'Adjektiv-Deklination im ausgefüllten Text prüfen');
    }
  }
}

for (const file of readdirSync(ROOT).filter((f) => f.endsWith('.md')).sort()) {
  auditFile(file);
}

if (issues.length === 0) {
  console.log(`✅ ${readdirSync(ROOT).filter((f) => f.endsWith('.md')).length} files — no issues found`);
} else {
  console.log(`⚠️  ${issues.length} issue(s):\n`);
  for (const i of issues) {
    console.log(`  [${i.code}] ${i.file}`);
    console.log(`    ${i.msg}\n`);
  }
  process.exit(1);
}
