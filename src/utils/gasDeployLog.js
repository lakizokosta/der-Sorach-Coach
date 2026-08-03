/**
 * @fileoverview OAuth deploy log parsing and proactive redeploy assessment.
 *
 * Used by `scripts/monitor-gas-backend.mjs` and unit tests.
 * See docs/system-analysis/06-backend-outage-investigation.md
 */

/** Default OAuth token lifetime in Testing mode (days). */
export const DEFAULT_OAUTH_TOKEN_LIFETIME_DAYS = 7;

/**
 * @typedef {{
 *   lastDeployAt: string,
 *   oauthMode: string,
 *   oauthTokenLifetimeDays: number,
 *   daysSinceDeploy: number|null,
 *   daysUntilExpiry: number|null,
 * }} DeployLogSnapshot
 */

/**
 * Parses deploy log fields and computes days since / until OAuth expiry.
 *
 * @param {object|null|undefined} data  Parsed gas-deploy-log.json
 * @param {{ defaultTokenLifetimeDays?: number, now?: number }} [options]
 * @return {DeployLogSnapshot}
 */
export function parseDeployLog(data, options = {}) {
  const defaultLifetime = Number(options.defaultTokenLifetimeDays) || DEFAULT_OAUTH_TOKEN_LIFETIME_DAYS;
  const now = options.now ?? Date.now();

  const lastDeployAt = String(data?.lastDeployAt || '').trim();
  const oauthMode = String(data?.oauthMode || 'unknown').toLowerCase();

  let oauthTokenLifetimeDays = Number(data?.oauthTokenLifetimeDays);
  if (!Number.isFinite(oauthTokenLifetimeDays) || oauthTokenLifetimeDays <= 0) {
    oauthTokenLifetimeDays = oauthMode === 'production' ? 0 : defaultLifetime;
  }

  if (!lastDeployAt) {
    return {
      lastDeployAt: '',
      oauthMode,
      oauthTokenLifetimeDays,
      daysSinceDeploy: null,
      daysUntilExpiry: null,
    };
  }

  const deployMs = new Date(`${lastDeployAt}T12:00:00Z`).getTime();
  const daysSinceDeploy = Number.isFinite(deployMs)
    ? Math.floor((now - deployMs) / (24 * 60 * 60 * 1000))
    : null;

  const daysUntilExpiry = (
    daysSinceDeploy != null && oauthTokenLifetimeDays > 0
  )
    ? oauthTokenLifetimeDays - daysSinceDeploy
    : null;

  return {
    lastDeployAt,
    oauthMode,
    oauthTokenLifetimeDays,
    daysSinceDeploy,
    daysUntilExpiry,
  };
}

/**
 * @param {DeployLogSnapshot} log
 * @return {{ level: 'ok'|'warn'|'fail', redeployEmailDue: boolean, messages: string[] }}
 */
export function assessOAuthDeployStatus(log) {
  /** @type {'ok'|'warn'|'fail'} */
  let level = 'ok';
  let redeployEmailDue = false;
  /** @type {string[]} */
  const messages = [];

  /**
   * @param {'ok'|'warn'|'fail'} next
   * @param {string} msg
   */
  function note(next, msg) {
    messages.push(msg);
    if (next === 'fail') level = 'fail';
    else if (next === 'warn' && level !== 'fail') level = 'warn';
  }

  if (log.daysSinceDeploy == null) {
    note('warn', 'Deploy log missing — update docs/ops/gas-deploy-log.json after each GAS redeploy');
    return { level, redeployEmailDue, messages };
  }

  if (!log.oauthTokenLifetimeDays || log.daysUntilExpiry == null) {
    return { level, redeployEmailDue, messages };
  }

  const { daysSinceDeploy, daysUntilExpiry, oauthTokenLifetimeDays, oauthMode } = log;

  if (daysUntilExpiry <= 0) {
    note(
      'fail',
      `OAuth token expired (deploy ${daysSinceDeploy}d ago, lifetime ${oauthTokenLifetimeDays}d, mode=${oauthMode})`,
    );
    return { level, redeployEmailDue, messages };
  }

  if (daysUntilExpiry === 1) {
    redeployEmailDue = true;
    note(
      'warn',
      `OAuth token expires in ~24 hours (deploy day ${daysSinceDeploy}/${oauthTokenLifetimeDays}, mode=${oauthMode})`,
    );
  }

  return { level, redeployEmailDue, messages };
}

/**
 * Classifies a GAS validateCode ping response (monitor probe).
 *
 * @param {{ status: number, body: string, isJson: boolean, data: object|null }} res
 * @return {'ok'|'oauth403'|'html'|'old_script'|'unexpected'}
 */
export function classifyGasPingResponse(res) {
  if (res.status === 403) return 'oauth403';
  if (!res.isJson) return 'html';

  const err = String(res.data?.error || '');
  if (err === 'Code nicht gefunden') return 'ok';
  if (err.includes('не найден') || err.includes('Код')) return 'old_script';
  if (res.data && typeof res.data === 'object') return 'ok';

  return 'unexpected';
}

/**
 * Maps worker health latency to monitor severity.
 *
 * @param {number} latencyMs
 * @param {{ warnMs?: number, failMs?: number }} [thresholds]
 * @return {'ok'|'warn'|'fail'}
 */
export function assessGasLatency(latencyMs, thresholds = {}) {
  const warnMs = Number(thresholds.warnMs) || 6000;
  const failMs = Number(thresholds.failMs) || 12000;
  if (latencyMs >= failMs) return 'fail';
  if (latencyMs >= warnMs) return 'warn';
  return 'ok';
}
