/**
 * Node module hooks that let plain Node import website modules the way Vite
 * does: `@/…` resolves to `src/site/…`, and `.json` imports work without an
 * explicit `with { type: 'json' }` attribute.
 *
 * Register with `module.register('./lib/site-alias-hooks.mjs', import.meta.url)`.
 */

import { pathToFileURL } from 'node:url';
import { resolve as resolvePath } from 'node:path';

const SITE_ROOT = pathToFileURL(resolvePath(import.meta.dirname, '..', '..', 'src', 'site') + '/');

export async function resolve(specifier, context, nextResolve) {
  const target = specifier.startsWith('@/') ? new URL(specifier.slice(2), SITE_ROOT).href : specifier;
  const result = await nextResolve(target, context);
  if (!result.url.endsWith('.json')) return result;
  return { ...result, importAttributes: { ...result.importAttributes, type: 'json' } };
}

export async function load(url, context, nextLoad) {
  if (!url.endsWith('.json')) return nextLoad(url, context);
  return nextLoad(url, { ...context, importAttributes: { ...context.importAttributes, type: 'json' } });
}
