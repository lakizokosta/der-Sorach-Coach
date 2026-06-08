/**
 * @fileoverview Cross-device XP + streak sync via the Apps Script backend.
 *
 * When the user is logged in (magic-link session) progress is pushed to
 * the `Progress` sheet keyed by e-mail. Premium users without a login
 * still push streak data keyed by their activation code (legacy path).
 */

import { hasBackend, loadProgress, saveProgress, saveStreakByCode } from '@/utils/api.js';
import { useAuth } from '@/composables/useAuth.js';
import { usePremium } from '@/composables/usePremium.js';
import { importStreakData, getStreakSnapshot } from '@/composables/useStreak.js';
import { importXpData, getXpSnapshot } from '@/composables/useXp.js';
import { mergeStreak, mergeXp, parseProgressJson } from '@/utils/progressMerge.js';

let pushTimer = null;
let skipPush = false;

/**
 * Applies server payloads and merges them with local state.
 *
 * @param {string} [streakRaw]  JSON string from the server.
 * @param {string} [xpRaw]      JSON string from the server.
 */
export function applyServerProgress(streakRaw, xpRaw) {
  skipPush = true;
  try {
    if (streakRaw) {
      const server = parseProgressJson(streakRaw, null);
      if (server) {
        importStreakData(mergeStreak(getStreakSnapshot(), server));
      }
    }
    if (xpRaw) {
      const server = parseProgressJson(xpRaw, null);
      if (server) {
        importXpData(mergeXp(getXpSnapshot(), server));
      }
    }
  } finally {
    skipPush = false;
  }
}

/**
 * Pulls the latest progress for the active magic-link session.
 *
 * @return {Promise<void>}
 */
export async function pullProgressFromServer() {
  if (!hasBackend()) return;
  const { state, isLoggedIn } = useAuth();
  if (!isLoggedIn.value) return;

  const res = await loadProgress(state.email, state.sessionToken);
  if (!res || !res.ok) return;
  applyServerProgress(res.streakData, res.xpData);
}

/**
 * Debounced fire-and-forget push after local progress changes.
 */
export function scheduleProgressPush() {
  if (skipPush || !hasBackend()) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    pushProgressToServer();
  }, 800);
}

/**
 * Immediately uploads local progress to the backend.
 *
 * @return {Promise<void>}
 */
export async function pushProgressToServer() {
  if (!hasBackend()) return;
  const { state, isLoggedIn } = useAuth();

  if (isLoggedIn.value) {
    await saveProgress({
      email: state.email,
      sessionToken: state.sessionToken,
      streakData: JSON.stringify(getStreakSnapshot()),
      xpData: JSON.stringify(getXpSnapshot()),
    });
    return;
  }

  const { state: prem, isPremium } = usePremium();
  if (isPremium.value && prem.premiumCode) {
    await saveStreakByCode(prem.premiumCode, JSON.stringify(getStreakSnapshot()));
  }
}
