#!/usr/bin/env node
/**
 * Rewrite all Beim Arzt text-gaps with a short German Vorgeschichte
 * that uniquely determines the gap answers.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TG } from './text-gaps-vorgeschichte-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function fmtList(arr) {
  return `[${arr.map((s) => `'${String(s).replace(/'/g, "\\'")}'`).join(', ')}]`;
}

function escapeTpl(body) {
  return body.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function patchFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  let n = 0;

  for (const [id, data] of Object.entries(TG)) {
    const start = src.indexOf(`id: '${id}'`);
    if (start === -1) {
      console.warn('id not found', id);
      continue;
    }
    // find start of object: go back to nearest "  {\n"
    const objStart = src.lastIndexOf('  {\n', start);
    const nextObj = src.indexOf('\n  {\n', start);
    const endArr = src.indexOf('\n];', start);
    const objEnd = nextObj === -1 ? endArr : Math.min(nextObj, endArr);
    if (objStart === -1 || objEnd === -1) {
      console.warn('block bounds fail', id);
      continue;
    }
    const block = src.slice(objStart, objEnd);
    const lemmaM = block.match(/lemma: '([^']+)'/);
    const lemma = lemmaM ? lemmaM[1] : 'Wortschatz';
    const newBlock = `  {
    id: '${id}',
    type: 'text-gaps',
    lemma: '${lemma}',
    hint: '${data.hint.replace(/'/g, "\\'")}',
    options: ${fmtList(data.options)},
    correct: ${fmtList(data.correct)},
    body: \`${escapeTpl(data.body)}\`,
  }`;
    // Keep separating comma before the next object / end of array.
    const needsComma = src.slice(objEnd).match(/^\s*\{/) || src.slice(objEnd).startsWith('\n  {');
    src = src.slice(0, objStart) + newBlock + (needsComma || true ? '' : '') + src.slice(objEnd);
    // Normalize: always ensure `},\n  {` between objects
    src = src.replace(/\n  \}\n  \{/g, '\n  },\n  {');
    n += 1;
  }

  fs.writeFileSync(filePath, src);
  console.log(path.basename(filePath), 'rewrote', n);
}

for (const f of ['a2.mjs', 'b1.mjs', 'b2.mjs']) {
  patchFile(path.join(__dirname, f));
}
