/**
 * Route/query helpers for Premium-gated trainer sessions.
 */

/**
 * @param {import('vue-router').LocationQuery|Record<string, unknown>} query
 * @return {boolean}
 */
export function trainerRequiresPremium(query) {
  const mode = String(query?.mode || '');
  return mode === 'schwaechen'
    || mode === 'placement'
    || mode === 'premium'
    || !!String(query?.topic || '').trim();
}

/**
 * @param {import('vue-router').LocationQuery|Record<string, unknown>} query
 * @return {boolean}
 */
export function trainerRequiresPaid(query) {
  return trainerRequiresPremium(query) || String(query?.mode || '') !== 'free';
}
