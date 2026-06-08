/**
 * Regenerates apps-script/logoData.gs from public/logo-email.png.
 * Run after updating the logo: node scripts/embed-logo.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const png = readFileSync(join(root, 'public/logo-email.png'));
const b64 = png.toString('base64');

const logoBlock = `/**
 * Inline logo bytes for HTML e-mails (auto-generated from public/logo-email.png).
 * Regenerate: node scripts/embed-logo.mjs
 */
const LOGO_PNG_BASE64 = '${b64}';`;

writeFileSync(join(root, 'apps-script/logoData.gs'), logoBlock + '\n');

const codePath = join(root, 'apps-script/Code.gs');
let code = readFileSync(codePath, 'utf8');
if (code.includes('const LOGO_PNG_BASE64 = ')) {
  code = code.replace(/\/\*\*[\s\S]*?Regenerate: node scripts\/embed-logo\.mjs[\s\S]*?\*\/\nconst LOGO_PNG_BASE64 = '[^']*';/, logoBlock);
} else {
  code = code.replace(
    "const APP_BASE_URL = 'https://lernziel-deutsch.de';",
    `const APP_BASE_URL = 'https://lernziel-deutsch.de';\n\n${logoBlock}`,
  );
}
writeFileSync(codePath, code);

console.log(`logo embedded in Code.gs (${b64.length} base64 chars)`);
