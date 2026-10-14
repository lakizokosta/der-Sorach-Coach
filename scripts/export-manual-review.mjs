#!/usr/bin/env node
/**
 * Export all questions to human-readable Markdown checklists for manual review.
 * Run: npm run questions:export-review
 */

import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PREMIUM_TOPICS } from '../src/site/data/premiumTopics.js';
import { parseQuestionFile } from '../src/site/utils/markdownQuestion.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const QUESTIONS_ROOT = resolve(__dirname, '..', 'src', 'site', 'questions');
const OUT_ROOT = resolve(__dirname, '..', 'docs', 'manual-review');

const TYPE_ORDER = ['select-one', 'multi-select', 'input-text', 'dropbox', 'text-gaps'];
const TYPE_LABEL = {
  'select-one': 'Auswahl (1 Antwort)',
  'multi-select': 'Mehrfachauswahl',
  'input-text': 'Eingabe',
  dropbox: 'Wörter ordnen',
  'text-gaps': 'Text mit Lücken',
};

/** @param {string} id */
function sortKey(id) {
  const parts = id.split(/[-_]/);
  const nums = parts.map((p) => parseInt(p, 10)).filter((n) => !Number.isNaN(n));
  return nums.length ? nums : [id];
}

/** @param {string} a @param {string} b */
function compareId(a, b) {
  const ka = sortKey(a);
  const kb = sortKey(b);
  for (let i = 0; i < Math.max(ka.length, kb.length); i++) {
    const va = ka[i] ?? 0;
    const vb = kb[i] ?? 0;
    if (va !== vb) return va - vb;
  }
  return a.localeCompare(b);
}

/** @param {import('../src/site/utils/markdownQuestion.js').ParsedQuestion} q */
function formatQuestion(q, index) {
  const lines = [];
  lines.push(`### ${index}. \`${q.id}\` · ${q.type}`);
  lines.push('');

  const prompt = (q.prompt || '').trim();
  if (prompt) {
    lines.push('**Aufgabe:**');
    for (const line of prompt.split('\n')) lines.push(`> ${line}`);
    lines.push('');
  }

  if (q.type === 'select-one' || q.type === 'multi-select') {
    const correct = new Set(
      Array.isArray(q.correct) ? q.correct.map(String) : [String(q.correct)],
    );
    lines.push('**Optionen:**');
    for (const opt of q.options || []) {
      const mark = correct.has(String(opt)) ? ' **✓**' : '';
      lines.push(`- ${opt}${mark}`);
    }
    lines.push('');
  }

  if (q.type === 'input-text') {
    const ans = Array.isArray(q.correct) ? q.correct : [q.correct];
    lines.push(`**Antwort:** ${ans.map((a) => `\`${a}\``).join(', ')}`);
    lines.push('');
  }

  if (q.type === 'dropbox') {
    lines.push(`**Wörter:** ${(q.words || []).join(' · ')}`);
    lines.push('');
  }

  if (q.type === 'text-gaps') {
    if (q.hint) lines.push(`**Hinweis:** ${q.hint}`);
    if (q.gaps?.length) {
      lines.push(`**Lücken:** ${q.gaps.length}`);
      lines.push('');
      lines.push('**Optionen pro Lücke:**');
      q.gaps.forEach((gap, i) => {
        lines.push(
          `${i + 1}. ${gap.options.map((o) => (o === gap.correct ? `**${o}** ✓` : o)).join(' | ')}`,
        );
      });
    }
    lines.push('');
  }

  lines.push('- [ ] OK');
  lines.push('- [ ] Fehler / Anmerkung:');
  lines.push('');
  return lines.join('\n');
}

/** @param {string} level @param {string} topic @param {{ key: string, name: string, desc: string } | null} meta */
function exportTopic(level, topic, meta) {
  const topicPath = join(QUESTIONS_ROOT, level, topic);
  if (!statSync(topicPath).isDirectory()) return null;

  const files = readdirSync(topicPath)
    .filter((f) => f.endsWith('.md'))
    .sort((a, b) => compareId(a.replace(/\.md$/, ''), b.replace(/\.md$/, '')));

  if (!files.length) return null;

  /** @type {Map<string, import('../src/site/utils/markdownQuestion.js').ParsedQuestion[]>} */
  const byType = new Map();
  let total = 0;

  for (const file of files) {
    const content = readFileSync(join(topicPath, file), 'utf8');
    const q = parseQuestionFile(content, { level, topic, path: `${level}/${topic}/${file}` });
    if (!byType.has(q.type)) byType.set(q.type, []);
    byType.get(q.type).push(q);
    total += 1;
  }

  for (const list of byType.values()) {
    list.sort((a, b) => compareId(a.id, b.id));
  }

  const title = meta?.name || topic;
  const desc = meta?.desc || '';
  const lines = [];
  lines.push(`# ${level} — ${title}`);
  lines.push('');
  lines.push(`| | |`);
  lines.push(`|---|---|`);
  lines.push(`| **Topic-Key** | \`${topic}\` |`);
  lines.push(`| **Beschreibung** | ${desc || '—'} |`);
  lines.push(`| **Fragen gesamt** | ${total} |`);
  for (const t of TYPE_ORDER) {
    const n = byType.get(t)?.length || 0;
    if (n) lines.push(`| ${TYPE_LABEL[t] || t} | ${n} |`);
  }
  lines.push('');
  lines.push('> Manuelle Prüfung: Grammatik, Sinn des Satzes, Hinweise, Antworten.');
  lines.push('');
  lines.push('---');
  lines.push('');

  let n = 0;
  for (const t of TYPE_ORDER) {
    const list = byType.get(t);
    if (!list?.length) continue;
    lines.push(`## ${TYPE_LABEL[t] || t} (${list.length})`);
    lines.push('');
    for (const q of list) {
      n += 1;
      lines.push(formatQuestion(q, n));
    }
  }

  // Other types not in TYPE_ORDER
  for (const [t, list] of byType) {
    if (TYPE_ORDER.includes(t)) continue;
    lines.push(`## ${t} (${list.length})`);
    lines.push('');
    for (const q of list) {
      n += 1;
      lines.push(formatQuestion(q, n));
    }
  }

  return { total, content: `${lines.join('\n')}\n` };
}

/** Collect topic folders per level (catalog order + orphans). */
function topicsForLevel(level) {
  const levelPath = join(QUESTIONS_ROOT, level);
  if (!statSync(levelPath).isDirectory()) return [];

  const catalog = PREMIUM_TOPICS[level] || [];
  const onDisk = new Set(
    readdirSync(levelPath).filter((e) => {
      const p = join(levelPath, e);
      return statSync(p).isDirectory() && !e.startsWith('_');
    }),
  );

  /** @type {{ topic: string, meta: { key: string, name: string, desc: string } | null, idx: number }[]} */
  const out = [];
  catalog.forEach((t, i) => {
    if (onDisk.has(t.key)) {
      out.push({ topic: t.key, meta: t, idx: i + 1 });
      onDisk.delete(t.key);
    }
  });
  let extra = 1000;
  for (const topic of [...onDisk].sort()) {
    out.push({ topic, meta: null, idx: extra++ });
  }
  return out;
}

mkdirSync(OUT_ROOT, { recursive: true });

const levels = ['A1', 'A2', 'B1', 'B2'];
/** @type {{ level: string, topic: string, name: string, file: string, total: number }[]} */
const index = [];
let grandTotal = 0;

for (const level of levels) {
  const levelDir = join(OUT_ROOT, level);
  mkdirSync(levelDir, { recursive: true });

  for (const { topic, meta, idx } of topicsForLevel(level)) {
    const result = exportTopic(level, topic, meta);
    if (!result) continue;
    const slug = `${String(idx).padStart(2, '0')}-${topic}`;
    const filename = `${slug}.md`;
    writeFileSync(join(levelDir, filename), result.content, 'utf8');
    index.push({
      level,
      topic,
      name: meta?.name || topic,
      file: `${level}/${filename}`,
      total: result.total,
    });
    grandTotal += result.total;
  }
}

const readme = [];
readme.push('# Manuelle Fragenprüfung');
readme.push('');
readme.push('Checklisten aller Fragen aus `src/site/questions/`, gruppiert nach Niveau und Thema.');
readme.push('');
readme.push('**Aktualisieren:** `npm run questions:export-review`');
readme.push('');
readme.push(`**Stand:** ${index.length} Themen · ${grandTotal} Fragen`);
readme.push('');
readme.push('## So prüfen');
readme.push('');
readme.push('1. Thema aus der Tabelle unten öffnen.');
readme.push('2. Jede Frage lesen — Satz, Hinweis, Antworten.');
readme.push('3. `- [ ] OK` abhaken oder unter **Fehler / Anmerkung** notieren.');
readme.push('4. Fehler im Quellfile unter `src/site/questions/<LEVEL>/<TOPIC>/` korrigieren.');
readme.push('');
readme.push('## Übersicht');
readme.push('');

for (const level of levels) {
  const rows = index.filter((r) => r.level === level);
  if (!rows.length) continue;
  const sum = rows.reduce((s, r) => s + r.total, 0);
  readme.push(`### ${level} (${sum} Fragen)`);
  readme.push('');
  readme.push('| Thema | Fragen | Datei |');
  readme.push('|-------|--------|-------|');
  for (const r of rows) {
    readme.push(`| ${r.name} | ${r.total} | [${r.file}](${r.file}) |`);
  }
  readme.push('');
}

writeFileSync(join(OUT_ROOT, 'README.md'), `${readme.join('\n')}\n`, 'utf8');

console.log(`Exported ${index.length} topic files · ${grandTotal} questions → docs/manual-review/`);
