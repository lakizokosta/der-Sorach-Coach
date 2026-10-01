#!/usr/bin/env node
/**
 * Fails if dist/ exceeds bundle size budget (default 75 MB).
 */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const BUDGET_MB = Number(process.env.BUNDLE_BUDGET_MB || 75);

if (!existsSync(DIST)) {
  console.error('dist/ not found — run npm run build first');
  process.exit(1);
}

const sizeMb = Number(execSync(`du -sm "${DIST}"`, { encoding: 'utf8' }).trim().split(/\s/)[0]);
console.log(`dist size: ${sizeMb} MB (budget: ${BUDGET_MB} MB)`);

if (sizeMb > BUDGET_MB) {
  console.error(`Bundle exceeds ${BUDGET_MB} MB budget`);
  process.exit(1);
}
