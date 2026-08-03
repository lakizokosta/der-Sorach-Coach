#!/usr/bin/env node
/**
 * Validates apps-script/appsscript.json against deploy runbook requirements.
 * Prevents scope drift (root cause of periodic GAS 403).
 *
 * See docs/system-analysis/06-backend-outage-investigation.md § Scope drift
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = join(__dirname, '..', 'apps-script', 'appsscript.json');

const REQUIRED_SCOPES = [
  'https://www.googleapis.com/auth/script.external_request',
  'https://www.googleapis.com/auth/script.send_mail',
  'https://www.googleapis.com/auth/spreadsheets',
];

/** @type {Record<string, unknown>} */
let manifest;
try {
  manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
} catch (err) {
  console.error(`✘ Cannot read ${MANIFEST_PATH}: ${err.message}`);
  process.exit(1);
}

let errors = 0;

const scopes = Array.isArray(manifest.oauthScopes) ? manifest.oauthScopes : [];
for (const required of REQUIRED_SCOPES) {
  if (!scopes.includes(required)) {
    errors += 1;
    console.error(`✘ Missing oauthScope: ${required}`);
  }
}

if (scopes.length !== REQUIRED_SCOPES.length) {
  errors += 1;
  console.error(`✘ Expected exactly ${REQUIRED_SCOPES.length} oauthScopes, got ${scopes.length}`);
  console.error('  Extra scopes may cause OAuth consent drift on redeploy');
}

const webapp = manifest.webapp || {};
if (webapp.executeAs !== 'USER_DEPLOYING') {
  errors += 1;
  console.error(`✘ webapp.executeAs must be USER_DEPLOYING, got ${webapp.executeAs}`);
}
if (webapp.access !== 'ANYONE_ANONYMOUS') {
  errors += 1;
  console.error(`✘ webapp.access must be ANYONE_ANONYMOUS, got ${webapp.access}`);
}

if (errors > 0) {
  console.error(`\n✘ ${errors} manifest error(s) — sync before GAS deploy`);
  process.exit(1);
}

console.log('✔ appsscript.json manifest OK (scopes + webapp access)');
