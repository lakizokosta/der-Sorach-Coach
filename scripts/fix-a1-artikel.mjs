#!/usr/bin/env node
/**
 * Fix A1 ARTIKEL per manual review (select-one hints + Akkusativ nach haben).
 * Run: npm run questions:fix-art-a1
 */

import { restoreArtikelSelectOne } from './generate-a1-select-one.mjs';

const n = restoreArtikelSelectOne();
console.log(`Updated ${n} A1 ARTIKEL select-one files.`);
