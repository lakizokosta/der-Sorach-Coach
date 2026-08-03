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
    || mode === 'vocab'
    || !!String(query?.topic || '').trim()
    || !!String(query?.set || '').trim();
}

/**
 * @param {import('vue-router').LocationQuery|Record<string, unknown>} query
 * @return {boolean}
 */
export function trainerRequiresPaid(query) {
  return trainerRequiresPremium(query) || String(query?.mode || '') !== 'free';
}
