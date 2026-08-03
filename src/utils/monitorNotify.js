/**
 * @fileoverview Monitor notification decision helpers (CI / hourly workflow).
 */

/**
 * @param {{ level?: string, checks?: { redeployEmailDue?: boolean } }} report
 * @return {boolean}
 */
export function shouldSendMonitorEmail(report) {
  const level = String(report?.level || 'ok').toLowerCase();
  const redeployEmailDue = report?.checks?.redeployEmailDue === true;
  return level === 'fail' || redeployEmailDue;
}

/**
 * True when GAS is down — e-mail via GAS must be skipped (use Resend/SMTP).
 *
 * @param {{ httpStatus?: number, ok?: boolean }|null|undefined} gas
 * @return {boolean}
 */
export function isGasMonitorDown(gas) {
  if (!gas) return false;
  if (gas.httpStatus === 403) return true;
  if (gas.ok === false && Number(gas.httpStatus) >= 400) return true;
  return false;
}

/**
 * Monitor exit code from aggregated level + proactive redeploy flag.
 *
 * @param {'ok'|'warn'|'fail'} level
 * @param {boolean} redeployEmailDue
 * @return {0|1|2}
 */
export function monitorExitCode(level, redeployEmailDue) {
  if (level === 'fail') return 1;
  if (redeployEmailDue) return 2;
  return 0;
}
