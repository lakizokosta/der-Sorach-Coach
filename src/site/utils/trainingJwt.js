/**
 * @fileoverview Client-side checks for server-issued training JWTs.
 *
 * Signature verification happens only on the Cloudflare Worker (secret
 * is not shipped to the browser). Here we reject obvious forgeries and
 * expired tokens before trusting entitlement responses.
 */

/**
 * @param {string} token
 * @return {Record<string, unknown>|null}
 */
export function decodeTrainingJwtPayload(token) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) return null;
  try {
    const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padLen = (4 - (padded.length % 4)) % 4;
    const json = atob(padded + '='.repeat(padLen));
    const payload = JSON.parse(json);
    return payload && typeof payload === 'object' ? payload : null;
  } catch {
    return null;
  }
}

/**
 * @param {unknown} token
 * @return {boolean}
 */
export function isPlausibleTrainingJwt(token) {
  const payload = decodeTrainingJwtPayload(String(token || ''));
  if (!payload) return false;
  if (!payload.premium) return false;
  const exp = Number(payload.exp);
  if (!Number.isFinite(exp) || exp * 1000 <= Date.now()) return false;
  return true;
}
