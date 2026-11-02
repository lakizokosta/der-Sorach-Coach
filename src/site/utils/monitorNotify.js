/**
 * @fileoverview Monitor notification decision helpers (CI / hourly workflow).
 */

/** @type {Set<string>} */
const OUTAGE_GAS_KINDS = new Set(['oauth403', 'html', 'old_script', 'unexpected']);

/**
 * True when a live check detected a backend outage (not log-only warnings).
 *
 * @param {{ messages?: string[], checks?: { gas?: object, worker?: object } }} report
 * @return {boolean}
 */
export function isMonitorOutageDetected(report) {
  const gas = report?.checks?.gas;
  const worker = report?.checks?.worker;
  const messages = report?.messages || [];

  if (gas?.kind && OUTAGE_GAS_KINDS.has(String(gas.kind))) return true;
  if (gas?.ok === false) return true;

  if (messages.some((m) => /SCRIPT_URL not configured/i.test(m))) return true;
  if (messages.some((m) => /Worker \/api\/health failed/i.test(m))) return true;
  if (messages.some((m) => /Worker health unreachable/i.test(m))) return true;
  if (messages.some((m) => /GAS HTTP 403/i.test(m))) return true;
  if (messages.some((m) => /GAS returned HTML/i.test(m))) return true;
  if (messages.some((m) => /OLD GAS script still live/i.test(m))) return true;
  if (messages.some((m) => /Unexpected GAS response/i.test(m))) return true;

  if (worker && worker.gasReachable === false) return true;

  return false;
}

/**
 * @param {{ level?: string, checks?: { redeployEmailDue?: boolean }, messages?: string[] }} report
 * @return {boolean}
 */
export function shouldSendMonitorEmail(report) {
  return isMonitorOutageDetected(report);
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
 * Monitor exit code: non-zero only when an outage e-mail should be sent.
 *
 * @param {{ messages?: string[], checks?: object }} report
 * @return {0|1}
 */
export function monitorExitCode(report) {
  return shouldSendMonitorEmail(report) ? 1 : 0;
}
