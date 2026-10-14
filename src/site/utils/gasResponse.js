/**
 * @fileoverview Classify GAS Web App HTTP responses for client error messages.
 *
 * Distinguishes OAuth 403 from HTML login-page redirects (P1-9).
 * See docs/system-analysis/06-backend-outage-investigation.md
 */

export const GAS_RESPONSE_KIND = {
  OAUTH403: 'oauth403',
  HTML_LOGIN: 'html_login',
  EMPTY: 'empty',
};

/**
 * @param {number} status
 * @param {string} text
 * @return {typeof GAS_RESPONSE_KIND[keyof typeof GAS_RESPONSE_KIND]|null}
 */
export function classifyGasHttpResponse(status, text) {
  const body = String(text || '').trim();
  if (status === 403) return GAS_RESPONSE_KIND.OAUTH403;
  if (!body) return GAS_RESPONSE_KIND.EMPTY;

  const head = body.slice(0, 300).toLowerCase();
  if (
    head.startsWith('<!doctype')
    || head.startsWith('<html')
    || body.includes('accounts.google.com')
    || body.includes('ServiceLogin')
  ) {
    return GAS_RESPONSE_KIND.HTML_LOGIN;
  }

  return null;
}

/**
 * @param {typeof GAS_RESPONSE_KIND[keyof typeof GAS_RESPONSE_KIND]|null} kind
 * @return {{ ok: false, error: string }|null}
 */
export function gasHttpFailure(kind) {
  if (kind === GAS_RESPONSE_KIND.OAUTH403) {
    return {
      ok: false,
      error:
        'Backend-Zugriff verweigert (403). Apps Script neu deployen: „Execute as: Me“, „Who has access: Anyone“.',
    };
  }
  if (kind === GAS_RESPONSE_KIND.HTML_LOGIN) {
    return {
      ok: false,
      error:
        'Backend leitet zur Google-Anmeldeseite um — Web App nicht öffentlich oder OAuth abgelaufen. Apps Script neu deployen.',
    };
  }
  if (kind === GAS_RESPONSE_KIND.EMPTY) {
    return { ok: false, error: 'Leere Backend-Antwort' };
  }
  return null;
}

/**
 * Maps HTTP status + body to a normalised failure object (or null if not a GAS auth issue).
 *
 * @param {Response} res
 * @param {string} text
 * @return {{ ok: false, error: string }|null}
 */
export function classifyGasHttpFailure(res, text) {
  const kind = classifyGasHttpResponse(res.status, text);
  if (kind === GAS_RESPONSE_KIND.HTML_LOGIN) {
    return gasHttpFailure(kind);
  }
  if (!res.ok) {
    return gasHttpFailure(kind);
  }
  return null;
}
