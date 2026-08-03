<script setup>
/**
 * BootstrapHandler — global startup handler mounted once in App.vue.
 *
 * On every page load this component looks for three deep-link query
 * parameters and acts on them. It also revalidates any stored Premium
 * code against the backend.
 *
 * URL parameter contracts (matches the original `blogspot.html` and
 * the e-mails sent by `payments-old.js`):
 *
 *   ?stripe_success=1            → green "Zahlung erfolgreich" banner,
 *                                  then nav to /premium.
 *   ?activate=<CODE>             → stashed in sessionStorage and
 *                                  consumed after the next Magic-Link
 *                                  login completes.
 *   ?mltoken=<TOKEN>             → loading overlay → validate against
 *                                  the backend → store the sliding user
 *                                  session → consume any pending
 *                                  activation code.
 *
 * The query parameters are stripped from the URL with
 * `history.replaceState` so a refresh doesn't re-trigger them.
 */

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { STRIPE_SUCCESS_PARAM } from '@/data/payment.js';
import { useI18n } from '@/i18n/index.js';
import { hasBackend, validateMagicToken } from '@/utils/api.js';
import { activateCode, bootstrapEntitlements, applyMagicSessionEntitlements, usePremium } from '@/composables/usePremium.js';
import { useAuth } from '@/composables/useAuth.js';
import {
  applyServerProgress,
  pullProgressFromServer,
} from '@/composables/useProgressSync.js';

const router = useRouter();
const { t } = useI18n();
const { setSession } = useAuth();

const PENDING_CODE_KEY = 'pendingActivationCode';

const stripeBannerVisible = ref(false);
const magicLoading = ref(false);
const toast = ref({ visible: false, text: '', color: '#2e7d32' });

/**
 * Removes a specific query parameter from the address bar without
 * reloading.
 *
 * @param {string} key
 */
function stripParam(key) {
  try {
    const params = new URLSearchParams(window.location.search);
    if (!params.has(key)) return;
    params.delete(key);
    const qs = params.toString();
    const search = qs ? `?${qs}` : '';
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname + search + window.location.hash,
    );
  } catch {
    /* old browser — ignore */
  }
}

/**
 * Shows a short-lived bottom-center toast.
 *
 * @param {string} text
 * @param {('success'|'error')} [kind='success']
 * @param {number} [durationMs=4000]
 */
function showToast(text, kind = 'success', durationMs = 4000) {
  toast.value = {
    visible: true,
    text,
    color: kind === 'error' ? '#c62828' : '#2e7d32',
  };
  setTimeout(() => {
    toast.value.visible = false;
  }, durationMs);
}

/**
 * Handles `?stripe_success=1` by showing the persistent green banner.
 */
function handleStripeSuccess() {
  const params = new URLSearchParams(window.location.search);
  if (params.get(STRIPE_SUCCESS_PARAM) !== '1') return;
  stripParam(STRIPE_SUCCESS_PARAM);
  stripeBannerVisible.value = true;
  setTimeout(() => router.push({ name: 'premium', query: { hub: '1' } }), 2000);
}

/**
 * Stashes `?activate=<CODE>` in sessionStorage so it can be consumed
 * once Magic-Link login completes (or by the Premium screen).
 */
function handleActivateParam() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('activate');
  if (!code) return;
  stripParam('activate');
  try {
    sessionStorage.setItem(PENDING_CODE_KEY, code.toUpperCase());
  } catch {
    /* ignored */
  }
  router.push({ name: 'premium', query: { hub: '1' } });
}

/**
 * Consumes `?mltoken=<TOKEN>`, validates it against the backend,
 * stores the user session and optionally activates a pending code.
 *
 * @return {Promise<{navigatePremium:boolean}|null>}
 */
async function handleMagicToken() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('mltoken');
  if (!token) return null;
  stripParam('mltoken');

  if (!hasBackend()) {
    showToast('⚠ Magic-Link benötigt eine Backend-Konfiguration.', 'error', 6000);
    return { navigatePremium: false };
  }

  magicLoading.value = true;
  const res = await validateMagicToken(token);
  magicLoading.value = false;

  if (!res || !res.ok) {
    const msg =
      res && res.errorCode === 'DEVICE_LIMIT'
        ? t('login.errDeviceLimit', { maxDevices: res.maxDevices || 2 })
        : (res && res.error) || 'Link ungültig';
    showToast(`⚠ ${msg}`, 'error', 6000);
    return { navigatePremium: false };
  }

  setSession({
    email: res.email,
    sessionToken: res.sessionToken,
    sessionExpires: res.sessionExpires,
  });
  applyServerProgress(res.streakData, res.xpData, res.dailyGoalData);
  applyMagicSessionEntitlements(res);

  let pendingCode = '';
  try {
    pendingCode = sessionStorage.getItem(PENDING_CODE_KEY) || '';
    if (pendingCode) sessionStorage.removeItem(PENDING_CODE_KEY);
  } catch {
    pendingCode = '';
  }

  if (pendingCode) {
    const ad = await activateCode(pendingCode, res.email);
    if (ad && ad.ok) {
      showToast('✅ Willkommen & Code aktiviert!');
      setTimeout(() => window.location.reload(), 1500);
      return { navigatePremium: true };
    }
    showToast(
      `Willkommen! Code-Fehler: ${(ad && ad.error) || 'Ungültiger Code'}`,
      'error',
      5000,
    );
    return { navigatePremium: false };
  }

  let navigatePremium = Boolean(res.isPremium || res.isBasis);
  const linkedCode = String(res.premiumCode || res.basisCode || '')
    .trim()
    .toUpperCase();

  if (linkedCode) {
    const ad = await activateCode(linkedCode, res.email);
    if (ad && ad.ok) navigatePremium = true;
  }

  if (navigatePremium) {
    const activeLabel = res.isBasis && !res.isPremium ? 'Basis ist aktiv' : 'Premium ist aktiv';
    showToast(`✅ Willkommen, ${res.email}! ${activeLabel}.`);
  } else {
    showToast(`✅ Willkommen, ${res.email}!`);
  }

  return { navigatePremium };
}

async function finishPostLoginNavigation(magicResult) {
  const { isPremium, isBasis } = usePremium();
  const { isLoggedIn } = useAuth();
  const shouldOpenPremium =
    magicResult?.navigatePremium ||
    (isLoggedIn.value && (isPremium.value || isBasis.value));

  if (!shouldOpenPremium) return;
  if (router.currentRoute.value.name === 'premium') return;
  await router.replace({ name: 'premium' });
}

onMounted(async () => {
  handleStripeSuccess();
  handleActivateParam();
  const magicResult = await handleMagicToken();
  await bootstrapEntitlements();
  await pullProgressFromServer();
  await finishPostLoginNavigation(magicResult);
});
</script>

<template>
  <div
    v-if="stripeBannerVisible"
    role="status"
    style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      background: linear-gradient(90deg, #69c43b, #4caf50);
      color: #fff;
      text-align: center;
      padding: 14px 20px;
      font-weight: 900;
      font-size: 15px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    "
  >
    ✅ Zahlung erfolgreich! Prüfe deine E-Mail — dein Aktivierungscode wurde zugesendet.
    <button
      type="button"
      @click="stripeBannerVisible = false"
      style="
        background: none;
        border: 1px solid #fff;
        color: #fff;
        border-radius: 20px;
        padding: 4px 12px;
        cursor: pointer;
        font-weight: 700;
        margin-left: 12px;
      "
    >
      ✕
    </button>
  </div>

  <div
    v-if="magicLoading"
    style="
      position: fixed;
      inset: 0;
      background: rgba(255, 255, 255, 0.92);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
    "
  >
    <div style="font-size: 42px; margin-bottom: 16px;">🔑</div>
    <div style="font-size: 18px; font-weight: 700; color: #AB4DBB;">
      Anmeldung läuft…
    </div>
  </div>

  <div
    v-if="toast.visible"
    role="status"
    style="
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
      padding: 14px 24px;
      border-radius: 14px;
      font-weight: 700;
      font-size: 15px;
      z-index: 9998;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      max-width: 90vw;
      text-align: center;
    "
    :style="{ background: toast.color }"
  >
    {{ toast.text }}
  </div>
</template>
