import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const MANIFEST = JSON.parse(
  readFileSync(join(process.cwd(), 'apps-script', 'appsscript.json'), 'utf8'),
);

const REQUIRED_SCOPES = [
  'https://www.googleapis.com/auth/script.external_request',
  'https://www.googleapis.com/auth/script.send_mail',
  'https://www.googleapis.com/auth/spreadsheets',
];

describe('appsscript.json manifest (P0-O5 scope sync)', () => {
  it('has exactly the three required OAuth scopes', () => {
    expect(MANIFEST.oauthScopes).toEqual(REQUIRED_SCOPES);
  });

  it('webapp runs as deploying user with anonymous access', () => {
    expect(MANIFEST.webapp.executeAs).toBe('USER_DEPLOYING');
    expect(MANIFEST.webapp.access).toBe('ANYONE_ANONYMOUS');
  });

  it('uses V8 runtime', () => {
    expect(MANIFEST.runtimeVersion).toBe('V8');
  });
});
