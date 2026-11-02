/**
 * Legal pages — verbatim HTML blocks from docs/extra.md (Blogger original).
 * Do not edit the text here; update docs/extra.md instead.
 */

import extraRaw from '../../../docs/extra.md?raw';

/** @type {Array<{ slug: string, marker: string }>} */
const SECTIONS = [
  { slug: 'datenschutz', marker: '**Datenschutz**' },
  { slug: 'agb', marker: '**AGB**' },
  { slug: 'impressum', marker: '**Impressum**' },
];

/**
 * Restores Blogger-escaped tags (`\<h1\>`, `\#AB4DBB`) for v-html display.
 * Does not alter wording — mechanical unescape only.
 *
 * @param {string} chunk
 * @return {string}
 */
function unescapeBloggerHtml(chunk) {
  return chunk.replace(/\\</g, '<').replace(/\\>/g, '>').replace(/\\#/g, '#');
}

/**
 * @param {string} raw
 * @return {Record<string, { html: string }>}
 */
function parseExtraMd(raw) {
  /** @type {Record<string, { html: string }>} */
  const pages = {};
  for (let i = 0; i < SECTIONS.length; i += 1) {
    const { slug, marker } = SECTIONS[i];
    const start = raw.indexOf(marker);
    if (start === -1) continue;
    const contentStart = start + marker.length;
    const end =
      i + 1 < SECTIONS.length ? raw.indexOf(SECTIONS[i + 1].marker, contentStart) : raw.length;
    const chunk = raw.slice(contentStart, end === -1 ? raw.length : end).trim();
    pages[slug] = { html: unescapeBloggerHtml(chunk) };
  }
  return pages;
}

export const LEGAL_PAGES = parseExtraMd(extraRaw);

export const LEGAL_SLUGS = ['agb', 'datenschutz', 'impressum'];

/** @param {string} slug */
export function getLegalPage(slug) {
  return LEGAL_PAGES[slug] || null;
}
