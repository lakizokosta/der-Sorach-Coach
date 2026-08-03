#!/usr/bin/env node
/**
 * Writes src/data/vocabulary-seed-en.json from scripts/en-seed-overrides.mjs.
 * Run after editing EN overrides: npm run dictionary:seed-en
 */

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { EN_SEED_OVERRIDES } from './en-seed-overrides.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src', 'data', 'vocabulary-seed-en.json');

const sorted = Object.fromEntries(
  Object.entries(EN_SEED_OVERRIDES).sort(([a], [b]) => a.localeCompare(b)),
);

writeFileSync(OUT, `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`Wrote ${Object.keys(sorted).length} EN seed entries → ${OUT}`);
