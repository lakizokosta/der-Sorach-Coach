#!/usr/bin/env node
/**
 * Move A1 superlative + adjektivdeklination questions to A2/SUPERLATIVA2.
 * Run after editing banks; idempotent (skips if A2 file already exists).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const A2_DIR = join(ROOT, 'src', 'questions', 'A2', 'SUPERLATIVA2');

/** @type {Array<{ a1Id: string, a1Path: string, a2Id: string, a2Content: string, a1Replacement: string }>} */
const MOVES = [
  {
    a1Id: 'a1-adj-in-033',
    a1Path: 'src/questions/A1/ADJEKTIVDEKLINATIONA1/a1-adj-in-033.md',
    a2Id: 'a2-sup-in-001',
    a2Content: `---
id: a2-sup-in-001
type: input-text
correct:
  - liebstes
---

Das ist mein ___ Buch. (Superlativ — lieb, neutr., Nom.)
`,
    a1Replacement: `---
id: a1-adj-in-033
type: input-text
correct:
  - liebes
---

Das ist mein ___ Buch. (lieb, neutr., Nom.)
`,
  },
];

mkdirSync(A2_DIR, { recursive: true });

for (const m of MOVES) {
  const a2Path = join(ROOT, 'src', 'questions', 'A2', 'SUPERLATIVA2', `${m.a2Id}.md`);
  if (!existsSync(a2Path)) {
    writeFileSync(a2Path, m.a2Content, 'utf8');
    console.log(`Created ${m.a2Id}`);
  }
  const a1Full = join(ROOT, m.a1Path);
  writeFileSync(a1Full, m.a1Replacement, 'utf8');
  console.log(`Replaced ${m.a1Id} with A1-positive form`);
}

console.log('Done.');
