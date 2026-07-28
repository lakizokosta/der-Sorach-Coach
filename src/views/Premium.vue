<script setup>
/**
 * Premium — the activation / login / topic-selection screen.
 *
 * When Premium is NOT active, this screen shows (top to bottom):
 *   - An optional "Zeitlimit aufheben" Basis quick-buy banner when
 *     the user arrives from `?focus=basis`.
 *   - The Premium buy form (plan picker + Stripe + PayPal) — first.
 *   - Activation UI only after purchase: when the user is logged in
 *     or arrived via `?activate=CODE` from the payment e-mail.
 *
 * When Premium IS active, this screen shows:
 *   - Hero CTA, streak / XP summary.
 *   - One level picker with random vs topic mode.
 *   - Topic grid with sticky level tabs.
 *   - Daily goal, Schwächen-Modus, activity calendar.
 */

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import DeviceGuide from '@/components/DeviceGuide.vue';
import LzdLogo from '@/components/LzdLogo.vue';
import ConversionSheet from '@/components/ConversionSheet.vue';
import PaymentButtonLabel from '@/components/PaymentButtonLabel.vue';
import DailyGoalCard from '@/components/DailyGoalCard.vue';
import SchwaechenCard from '@/components/SchwaechenCard.vue';
import ActivityCalendar from '@/components/ActivityCalendar.vue';
import NiveauTestBlock from '@/components/NiveauTestBlock.vue';
import PricingCompare from '@/components/PricingCompare.vue';
import LegalFooter from '@/components/LegalFooter.vue';

import { PREMIUM_TOPICS, getTopicsForLevel } from '@/data/premiumTopics.js';
import { getTopicQuestionCount } from '@/data/questions.js';
import { usePremium } from '@/composables/usePremium.js';
import { useStreak } from '@/composables/useStreak.js';
import { useXp, getLevel } from '@/composables/useXp.js';
import { isTopicMastered } from '@/composables/useXp.js';
import { useAuth } from '@/composables/useAuth.js';
import { useCefrLevel } from '@/composables/useCefrLevel.js';
import { loadString, saveString } from '@/composables/useStorage.js';
import {
  PRICES_EUR,
  buildStripePremiumUrl,
  buildStripeBasisUrl,
  buildPaypalUrl,
  buildPaypalBasisUrl,
} from '@/data/payment.js';
import {
  hasBackend,
  requestMagicLink,
} from '@/utils/api.js';
import { useI18n } from '@/i18n/index.js';

const router = useRouter();
const { t } = useI18n();
const route = useRoute();
const { isPremium, isBasis, activateCode, signOutUser } = usePremium();
const { state: streak, medalsFor } = useStreak();
const { state: xp, level: liveLevel } = useXp();
const { state: auth, isLoggedIn } = useAuth();
const { level: cefrLevel } = useCefrLevel();

const USER_EMAIL_KEY = 'userEmail';
const PREMIUM_LEVELS = ['A1', 'A2', 'B1', 'B2'];
const PENDING_CODE_KEY = 'pendingActivationCode';
const backendOn = hasBackend();
const isDev = import.meta.env.DEV;

const activeLevel = ref('A1');
const trainingMode = ref('random');
const code = ref('');
/** E-mail for Stripe / PayPal checkout (no login required). */
const buyEmail = ref(auth.email || loadString(USER_EMAIL_KEY) || '');
/** E-mail for the post-purchase magic-link step only. */
const accountEmail = ref(auth.email || loadString(USER_EMAIL_KEY) || '');
/** Code stashed from `?activate=…` in the payment e-mail. */
const pendingCode = ref('');
const status = ref({ text: '', color: '#888' });
const submitting = ref(false);

const focusBasis = computed(() => route.query.focus === 'basis');
/** Premium Hub — opened from Landing «Mehr: Tarife & Anmelden». */
const isHubMode = computed(() => route.query.hub === '1');
const showTopicCatalog = computed(() => isPremium.value || isHubMode.value);
/** Branding under logo on the active Premium home (not hub/checkout). */
const showPremiumHero = computed(() => isPremium.value && !isHubMode.value);
const topics = computed(() => getTopicsForLevel(activeLevel.value));

const conversionSheetOpen = ref(false);
const conversionVariant = ref('checkout');

/** E-mail used for checkout and payment pre-fill. */
const emailForCheckout = computed(() =>
  isLoggedIn.value
    ? String(auth.email || '').trim().toLowerCase()
    : buyEmail.value.trim().toLowerCase(),
);

/** Show activation UI only after purchase e-mail or when already logged in. */
const showActivationPanel = computed(
  () => isLoggedIn.value || Boolean(pendingCode.value),
);

const plan = ref('1month');
const agbChecked = ref(false);
const buyStatus = ref({ text: '', color: '#888' });

const basisPriceLabel = computed(() =>
  PRICES_EUR.basis.toFixed(2).replace('.', ','),
);

const planOptions = computed(() => [
  { v: '12months', label: t('premium.plan12'), note: t('common.monthsFree3') },
  { v: '3months', label: t('premium.plan3'), note: t('common.monthFree1') },
  { v: '1month', label: t('premium.plan1'), note: '' },
]);

const magicStatus = ref({ text: '', color: '#888' });
const magicSubmitting = ref(false);

watch(
  () => auth.email,
  (value) => {
    if (value) {
      accountEmail.value = value;
      buyEmail.value = value;
    }
  },
);

function loadPendingCode() {
  try {
    const pending = sessionStorage.getItem(PENDING_CODE_KEY) || '';
    if (!pending) return;
    pendingCode.value = pending.toUpperCase();
    if (!code.value) code.value = pendingCode.value;
  } catch {
    /* ignored */
  }
}

function clearPendingCode() {
  pendingCode.value = '';
  try {
    sessionStorage.removeItem(PENDING_CODE_KEY);
  } catch {
    /* ignored */
  }
}

onMounted(() => {
  loadPendingCode();
  const lvl = route.query.level;
  if (lvl && PREMIUM_LEVELS.includes(String(lvl))) {
    activeLevel.value = String(lvl);
  } else if (cefrLevel.value && PREMIUM_LEVELS.includes(cefrLevel.value)) {
    activeLevel.value = cefrLevel.value;
  }
  if (route.query.plan === '3months') plan.value = '3months';
  else if (route.query.hub === '1' && !isPremium.value) plan.value = '3months';
});

watch(
  () => route.query.level,
  (lvl) => {
    if (lvl && ['A1', 'A2', 'B1', 'B2'].includes(String(lvl))) {
      activeLevel.value = String(lvl);
    }
  },
);

/**
 * Validates the buy form (email + AGB checkbox).
 *
 * @return {boolean} true if the form is valid; otherwise sets
 *   `buyStatus` to an error message and returns false.
 */
function validateBuyForm() {
  const value = emailForCheckout.value;
  if (!value || !value.includes('@')) {
    buyStatus.value = {
      text: isLoggedIn.value
        ? t('premium.errNoSessionEmail')
        : t('premium.errEmailForCode'),
      color: '#ed4545',
    };
    return false;
  }
  if (!agbChecked.value) {
    buyStatus.value = { text: t('premium.errAgb'), color: '#ed4545' };
    return false;
  }
  saveString(USER_EMAIL_KEY, value);
  return true;
}

/**
 * Opens the Stripe-hosted checkout for the selected Premium plan in
 * a new tab, pre-filling the e-mail address.
 */
function payWithStripe() {
  if (!validateBuyForm()) return;
  const url = buildStripePremiumUrl(plan.value, emailForCheckout.value);
  window.open(url, '_blank', 'noopener');
  buyStatus.value = {
    text: t('premium.stripeOpened', { email: emailForCheckout.value }),
    color: '#635BFF',
  };
}

/**
 * Opens the PayPal.me link for the selected Premium plan in a new tab.
 * PayPal does not pre-fill an email so we only validate locally.
 */
function payWithPaypal() {
  if (!validateBuyForm()) return;
  const url = buildPaypalUrl(plan.value);
  window.open(url, '_blank', 'noopener');
  buyStatus.value = {
    text: t('premium.paypalOpened', { email: emailForCheckout.value }),
    color: '#0070BA',
  };
}

/**
 * Opens the Stripe-hosted checkout for the one-off Basis purchase
 * (Zeitlimit aufheben — 4,99€). Uses the email entered in the basis
 * mini-form (or the stored userEmail) for pre-fill.
 */
function validateBasisCheckout() {
  const value = emailForCheckout.value;
  if (!value || !value.includes('@')) {
    buyStatus.value = {
      text: t('premium.errEmailForCode'),
      color: '#ed4545',
    };
    return false;
  }
  if (!agbChecked.value) {
    buyStatus.value = { text: t('premium.errAgb'), color: '#ed4545' };
    return false;
  }
  saveString(USER_EMAIL_KEY, value);
  return true;
}

function payBasis() {
  if (!validateBasisCheckout()) return;
  window.open(buildStripeBasisUrl(emailForCheckout.value), '_blank', 'noopener');
  buyStatus.value = {
    text: t('premium.basisStripeOpened', { email: emailForCheckout.value }),
    color: '#635BFF',
  };
}

function payBasisPaypal() {
  if (!validateBasisCheckout()) return;
  window.open(buildPaypalBasisUrl(), '_blank', 'noopener');
  buyStatus.value = {
    text: t('premium.basisPaypalOpened', { email: emailForCheckout.value }),
    color: '#0070BA',
  };
}

/**
 * Returns the number of available questions for a topic in `activeLevel`.
 *
 * @param {string} topicKey
 * @return {number}
 */
function questionCount(topicKey) {
  return getTopicQuestionCount(activeLevel.value, topicKey);
}

/**
 * Submits the activation code and (optional) e-mail to the backend.
 * Updates the status message in-place. When no backend is configured
 * the call resolves locally against the demo activator.
 */
async function submitCode() {
  if (submitting.value) return;
  const trimmedCode = code.value.trim();
  if (!trimmedCode) {
    status.value = { text: t('login.errEnterCode'), color: '#ed4545' };
    return;
  }
  if (backendOn && !isLoggedIn.value) {
    status.value = {
      text: t('premium.errLoginFirst'),
      color: '#ed4545',
    };
    return;
  }

  submitting.value = true;
  status.value = { text: t('premium.checking'), color: '#888' };

  const emailForCode = backendOn ? auth.email : emailForCheckout.value;
  const res = await activateCode(trimmedCode, emailForCode);
  submitting.value = false;

  if (res.ok) {
    status.value = {
      text: res.type === 'premium' ? t('login.premiumActivated') : t('login.basisActivated'),
      color: '#69c43b',
    };
    code.value = '';
    clearPendingCode();
    setTimeout(() => window.location.reload(), 1500);
  } else {
    status.value = { text: `✖ ${res.error}`, color: '#ed4545' };
  }
}

/**
 * Requests a Magic-Link login e-mail. The link sent to the user
 * deep-links back to the SPA with `?mltoken=…` which is consumed at
 * app startup by `BootstrapHandler.vue`.
 */
async function submitMagicLink() {
  if (magicSubmitting.value || isLoggedIn.value) return;
  const value = accountEmail.value.trim().toLowerCase();
  if (!value || !value.includes('@')) {
    magicStatus.value = { text: t('login.errInvalidEmail'), color: '#ed4545' };
    return;
  }
  magicSubmitting.value = true;
  magicStatus.value = { text: t('login.sendingLink'), color: '#888' };
  saveString(USER_EMAIL_KEY, value);

  try {
    const res = await requestMagicLink(value);
    if (res && res.ok) {
      magicStatus.value = {
        text: res.delayed
          ? (res.message || t('login.linkSentDelayed', { email: value }))
          : (res.message || t('premium.magicLinkSent', { email: value })),
        color: '#69c43b',
      };
    } else {
      magicStatus.value = {
        text: `✖ ${(res && res.error) || t('premium.magicLinkErr')}`,
        color: '#ed4545',
      };
    }
  } finally {
    magicSubmitting.value = false;
  }
}

/** Logs the user out (clears magic-link session + premium session tokens). */
async function signOut() {
  await signOutUser();
  window.location.assign(router.resolve({ name: 'landing' }).href);
}

/**
 * Starts a training session focussed on the chosen topic.
 *
 * @param {string} topicKey
 */
function trainTopic(topicKey) {
  if (!isPremium.value) return;
  const query = {
    level: activeLevel.value,
    topic: topicKey,
    mode: 'premium',
  };
  if (isHubMode.value) query.returnTo = 'hub';
  router.push({ name: 'trainer', query });
}

/** Random mixed training for one CEFR level (all topics). */
function trainRandomLevel(lvl) {
  if (!isPremium.value) return;
  const query = { level: lvl, mode: 'premium' };
  if (isHubMode.value) query.returnTo = 'hub';
  router.push({ name: 'trainer', query });
}

function openProfile() {
  router.push({ name: 'profile' });
}

/** Locked topic tap in hub mode — open quick checkout. */
function onTopicClick(_topicKey) {
  if (isPremium.value) {
    trainTopic(_topicKey);
    return;
  }
  conversionVariant.value = 'checkout';
  conversionSheetOpen.value = true;
}

function onNiveauLocked() {
  conversionVariant.value = 'niveau';
  conversionSheetOpen.value = true;
}

function goPremiumBack() {
  if (isHubMode.value) {
    router.push({ name: 'landing' });
    return;
  }
  router.push({ name: 'landing' });
}

/** Returns true when the topic has been mastered (50+ correct). */
function topicMastered(key) {
  return isTopicMastered(key);
}
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell--premium-hub': isHubMode }">
    <LzdLogo small />

    <header v-if="showPremiumHero" class="landing-hero premium-hero">
      <h1 class="main-title">{{ t('landing.title') }}</h1>
      <p class="brand-slogan">{{ t('landing.slogan') }}</p>
    </header>

    <button
      v-if="isHubMode"
      type="button"
      class="premium-hub-back landing-back-btn"
      @click="goPremiumBack"
    >
      {{ t('premium.hubBack') }}
    </button>

    <section class="section">
      <div class="card premium-card">
        <header
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            padding-bottom: 12px;
          "
        >
          <div v-if="!showPremiumHero" style="text-align: left;">
            <div style="font-size: 22px; font-weight: 900;">{{ t('premium.title') }}</div>
            <div style="font-size: 13px; color: #666;">{{ t('premium.subtitle') }}</div>
            <div style="font-size: 14px; font-style: italic; color: #AB4DBB;">
              {{ t('premium.tagline') }}
            </div>
          </div>
          <div
            style="
              font-size: 12px;
              font-weight: 900;
              padding: 9px 12px;
              border-radius: 999px;
              border: 1px solid rgba(0, 0, 0, 0.1);
            "
            :style="
              isPremium
                ? 'background:rgba(105,196,59,.14);border-color:rgba(105,196,59,.35);'
                : 'background:rgba(237,69,69,.12);border-color:rgba(237,69,69,.28);'
            "
          >
            {{ isPremium ? t('premium.statusActive') : t('premium.statusInactive') }}
          </div>
        </header>

        <div
          v-if="isHubMode && isBasis && !isPremium"
          class="premium-hub-basis-banner"
          role="status"
        >
          {{ t('premium.hubBasisBanner') }}
        </div>

        <!-- LOCKED VIEW: activation + price block -->
        <div v-if="!isPremium" style="text-align: left;">
          <PricingCompare class="premium-hub-pricing-compare" />

          <div v-if="focusBasis" class="premium-basis-card">
            <div class="premium-basis-card__title">
              {{ t('premium.basisTitle', { price: basisPriceLabel }) }}
            </div>
            <p class="premium-basis-card__intro">{{ t('premium.basisIntro') }}</p>
            <div v-if="!isLoggedIn" class="premium-basis-card__email">
              <label
                for="basis-buy-email"
                class="premium-basis-card__email-label"
              >
                {{ t('premium.emailLabel') }}
              </label>
              <input
                id="basis-buy-email"
                v-model="buyEmail"
                type="email"
                class="premium-flow__input"
                :placeholder="t('common.emailPlaceholder')"
              />
            </div>
            <p v-else class="premium-basis-card__email-hint">
              📧 {{ t('premium.codeToEmail') }} <strong>{{ auth.email }}</strong>
            </p>
            <DeviceGuide variant="basis" />
            <label class="premium-basis-card__agb">
              <input
                v-model="agbChecked"
                type="checkbox"
                class="premium-basis-card__agb-check"
              />
              <span>
                {{ t('common.agbAcceptBefore') }}
                <router-link
                  :to="{ name: 'legal', params: { slug: 'agb' } }"
                  target="_blank"
                >{{ t('common.agb') }}</router-link>
                {{ t('common.agbAcceptAfter') }}
              </span>
            </label>
            <button
              type="button"
              class="premium-basis-btn premium-basis-btn--stripe"
              @click="payBasis"
            >
              <PaymentButtonLabel
                provider="stripe"
                :main="t('premium.payBasis', { price: basisPriceLabel })"
                :sub="t('premium.stripeSub')"
              />
            </button>
            <button
              type="button"
              class="premium-basis-btn premium-basis-btn--paypal"
              @click="payBasisPaypal"
            >
              <PaymentButtonLabel
                provider="paypal"
                :main="t('premium.buyBasis', { price: basisPriceLabel })"
                :sub="t('premium.paypalSub')"
              />
            </button>
            <p class="premium-buy-footer" style="margin-top: 8px;">
              {{ t('premium.secureBasis') }}
            </p>
            <div
              v-if="buyStatus.text"
              class="premium-flow__status premium-basis-card__status"
              :style="{ color: buyStatus.color }"
            >
              {{ buyStatus.text }}
            </div>
            <p class="premium-basis-card__alt">
              <router-link :to="{ name: 'premium' }">{{ t('premium.altPremium') }}</router-link>
            </p>
          </div>

          <div
            v-if="!focusBasis"
            class="premium-buy-card"
            style="
              background: #fff;
              border-radius: 16px;
              padding: 18px;
              border: 1px solid #eee;
              margin-bottom: 16px;
            "
          >
            <div style="font-weight: 900; margin-bottom: 8px;">{{ t('premium.buyTitle') }}</div>
            <div style="font-size: 13px; color: #666; margin-bottom: 12px;">
              {{ t('premium.choosePlan') }}
            </div>

            <div style="margin-bottom: 14px;">
              <label
                v-for="opt in planOptions"
                :key="opt.v"
                style="
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  margin-bottom: 8px;
                  cursor: pointer;
                "
              >
                <input
                  v-model="plan"
                  type="radio"
                  name="plan"
                  :value="opt.v"
                  style="margin: 0;"
                />
                <span style="font-weight: 600;">{{ opt.label }}</span>
                <span v-if="opt.note" style="font-size: 11px; color: #69c43b;">
                  ({{ opt.note }})
                </span>
              </label>
            </div>

            <div v-if="!isLoggedIn" style="margin-bottom: 12px;">
              <label
                for="premium-buy-email"
                style="display: block; font-size: 12px; font-weight: 700; color: #666; margin-bottom: 6px;"
              >
                {{ t('premium.emailLabel') }}
              </label>
              <input
                id="premium-buy-email"
                v-model="buyEmail"
                type="email"
                class="premium-flow__input"
                :placeholder="t('common.emailPlaceholder')"
              />
            </div>
            <p v-else style="font-size: 13px; color: #666; margin: 0 0 12px 0;">
              {{ t('premium.codeTo') }} <strong>{{ auth.email }}</strong>
            </p>
            <DeviceGuide variant="buy" />

            <label
              style="
                display: flex;
                align-items: flex-start;
                gap: 8px;
                margin: 12px 0;
                font-size: 12px;
                color: #666;
                cursor: pointer;
              "
            >
              <input
                v-model="agbChecked"
                type="checkbox"
                style="width: 16px; height: 16px; margin: 2px 0 0 0; flex-shrink: 0;"
              />
              <span>
                {{ t('common.agbAcceptBefore') }}
                <router-link
                  :to="{ name: 'legal', params: { slug: 'agb' } }"
                  target="_blank"
                  style="color: #AB4DBB; text-decoration: underline;"
                >{{ t('common.agb') }}</router-link>
                {{ t('common.agbAcceptAfter') }}
              </span>
            </label>

            <button
              type="button"
              class="premium-basis-btn premium-basis-btn--stripe"
              @click="payWithStripe"
            >
              <PaymentButtonLabel
                provider="stripe"
                :main="t('premium.payStripe')"
                :sub="t('premium.stripeSub')"
              />
            </button>

            <button
              type="button"
              class="premium-basis-btn premium-basis-btn--paypal"
              @click="payWithPaypal"
            >
              <PaymentButtonLabel
                provider="paypal"
                :main="t('premium.payPaypal')"
                :sub="t('premium.paypalSub')"
              />
            </button>

            <button
              type="button"
              class="premium-basis-btn premium-basis-btn--lilac"
              @click="payBasis"
            >
              ⏱️ {{ t('funnel.basisQuick', { price: basisPriceLabel }) }}
            </button>

            <p class="premium-buy-footer">{{ t('premium.securePremium') }}</p>

            <div
              v-if="buyStatus.text"
              style="font-size: 13px; margin-top: 14px; min-height: 18px; text-align: center;"
              :style="{ color: buyStatus.color }"
            >
              {{ buyStatus.text }}
            </div>
          </div>

          <!-- Post-purchase: code from e-mail link, user not logged in yet -->
          <section
            v-if="backendOn && showActivationPanel && !isLoggedIn && pendingCode"
            class="premium-flow premium-flow--pending"
            :aria-label="t('premium.pendingAria')"
          >
            <div class="premium-flow__head">
              <span class="premium-flow__title">{{ t('premium.almostDone') }}</span>
            </div>
            <p class="premium-flow__intro">{{ t('premium.pendingIntro') }}</p>
            <input
              v-model="accountEmail"
              type="email"
              class="premium-flow__input"
              :placeholder="t('common.emailPlaceholder')"
            />
            <button
              type="button"
              class="premium-flow__btn premium-flow__btn--login"
              :disabled="magicSubmitting"
              @click="submitMagicLink"
            >
              {{ magicSubmitting ? t('common.sending') : t('premium.sendLoginLink') }}
            </button>
            <p class="premium-flow__hint">{{ t('premium.inboxHint') }}</p>
            <DeviceGuide variant="compact" />
            <div
              v-if="magicStatus.text"
              class="premium-flow__status"
              :style="{ color: magicStatus.color }"
            >
              {{ magicStatus.text }}
            </div>
          </section>

          <!-- Logged in: enter / confirm activation code -->
          <section
            v-else-if="backendOn && showActivationPanel && isLoggedIn"
            class="premium-flow"
            :aria-label="t('premium.activationAria')"
          >
            <div class="premium-flow__head">
              <span class="premium-flow__title">{{ t('premium.codeTitle') }}</span>
            </div>
            <div class="premium-flow__logged-in">
              <span class="premium-flow__logged-email">✅ {{ auth.email }}</span>
              <button type="button" class="premium-flow__signout" @click="signOut">
                {{ t('common.signOut') }}
              </button>
            </div>
            <p v-if="pendingCode" class="premium-flow__hint premium-flow__hint--ok">
              {{ t('premium.pendingCodeHint') }}
            </p>
            <input
              v-model="code"
              type="text"
              class="premium-flow__input premium-flow__input--code"
              :placeholder="t('premium.codePlaceholder')"
            />
            <button
              type="button"
              class="premium-flow__btn premium-flow__btn--code"
              :disabled="submitting"
              @click="submitCode"
            >
              {{ submitting ? t('premium.checking') : t('premium.activateCode') }}
            </button>
            <div
              v-if="status.text"
              class="premium-flow__status"
              :style="{ color: status.color }"
            >
              {{ status.text }}
            </div>
          </section>

          <!-- Dev only: local demo activator when SCRIPT_URL is empty -->
          <div
            v-else-if="!backendOn && isDev"
            style="
              background: #f9f9f9;
              border-radius: 16px;
              padding: 16px;
              margin-bottom: 16px;
            "
          >
            <div style="font-weight: 700; margin-bottom: 8px;">{{ t('premium.codeDemoTitle') }}</div>
            <input
              v-model="code"
              type="text"
              :placeholder="t('premium.codeDemoPlaceholder')"
              style="
                width: 100%;
                padding: 14px;
                border-radius: 12px;
                border: 1px solid #ddd;
                font-size: 15px;
                text-transform: uppercase;
                margin-bottom: 8px;
                box-sizing: border-box;
              "
            />
            <button
              type="button"
              class="premium-flow__btn premium-flow__btn--code"
              :disabled="submitting"
              @click="submitCode"
            >
              {{ submitting ? t('premium.checking') : t('premium.activateCode') }}
            </button>
            <div
              v-if="status.text"
              style="font-size: 13px; margin-top: 12px; min-height: 18px;"
              :style="{ color: status.color }"
            >
              {{ status.text }}
            </div>
          </div>

          <!-- Edge case: paid but did not click e-mail link -->
          <details v-if="backendOn && !showActivationPanel" class="premium-flow-manual">
            <summary>{{ t('premium.manualTitle') }}</summary>
            <p class="premium-flow__hint">{{ t('premium.manualHint') }}</p>
            <input
              v-model="accountEmail"
              type="email"
              class="premium-flow__input"
              :placeholder="t('common.emailPlaceholder')"
            />
            <button
              type="button"
              class="premium-flow__btn premium-flow__btn--login"
              :disabled="magicSubmitting"
              @click="submitMagicLink"
            >
              {{ magicSubmitting ? t('common.sending') : t('premium.sendLoginLink') }}
            </button>
            <div
              v-if="magicStatus.text"
              class="premium-flow__status"
              :style="{ color: magicStatus.color }"
            >
              {{ magicStatus.text }}
            </div>
          </details>
        </div>

        <!-- UNLOCKED VIEW: streak + XP (Premium active only) -->
        <div v-else>
          <div class="premium-stats-card">
            <div class="premium-stats-card__top">
              <div class="premium-stats-card__level">
                <div
                  class="premium-stats-card__badge"
                  :style="{ background: liveLevel.color }"
                >
                  Lv{{ liveLevel.num }}
                </div>
                <div class="premium-stats-card__level-text">
                  <div class="premium-stats-card__level-name">{{ liveLevel.name }}</div>
                  <div class="small-note">
                    ⭐ {{ xp.totalXP }} XP
                    <template v-if="liveLevel.next">
                      ·
                      {{
                        t('premium.xpUntil', {
                          xp: liveLevel.next - xp.totalXP,
                          level: liveLevel.num + 1,
                        })
                      }}
                    </template>
                    <template v-else>· {{ t('premium.maxLevel') }}</template>
                  </div>
                </div>
              </div>
              <button
                type="button"
                class="premium-stats-card__profile-btn"
                @click="openProfile"
              >
                {{ t('landing.profileBtn') }}
              </button>
            </div>
            <div class="premium-stats-card__streak">
              <div class="premium-stats-card__streak-grid">
                <div class="premium-stats-card__stat">
                  <span class="premium-stats-card__stat-num">{{ streak.currentStreak }}</span>
                  <span class="premium-stats-card__stat-label">{{ t('premium.streakCurrent') }}</span>
                </div>
                <div class="premium-stats-card__stat">
                  <span class="premium-stats-card__stat-num">{{ streak.longestStreak }}</span>
                  <span class="premium-stats-card__stat-label">{{ t('premium.streakRecord') }}</span>
                </div>
                <div class="premium-stats-card__stat">
                  <span class="premium-stats-card__stat-num premium-stats-card__stat-num--green">
                    {{ streak.freezes }}
                  </span>
                  <span class="premium-stats-card__stat-label">{{ t('premium.streakFreezes') }}</span>
                </div>
              </div>
              <div class="premium-stats-card__medals">
                <span class="small-note">🏅</span>
                <span>{{ medalsFor(streak.longestStreak) }}</span>
              </div>
            </div>
          </div>

          <DailyGoalCard variant="reminder" class="premium-stats-card__goal" />

          <NiveauTestBlock />
        </div>

        <!-- Premium training: one level picker + random / topics mode -->
        <section
          v-if="isPremium"
          class="premium-training"
          :aria-label="t('premium.trainingAria')"
        >
          <div class="premium-mode-switch" role="tablist">
            <button
              type="button"
              role="tab"
              class="premium-mode-switch__btn"
              :class="{ 'premium-mode-switch__btn--active': trainingMode === 'random' }"
              :aria-selected="trainingMode === 'random'"
              @click="trainingMode = 'random'"
            >
              {{ t('premium.modeRandom') }}
            </button>
            <button
              type="button"
              role="tab"
              class="premium-mode-switch__btn"
              :class="{ 'premium-mode-switch__btn--active': trainingMode === 'topics' }"
              :aria-selected="trainingMode === 'topics'"
              @click="trainingMode = 'topics'"
            >
              {{ t('premium.modeTopics') }}
            </button>
          </div>

          <div
            class="premium-level-tabs premium-level-tabs--sticky"
            role="tablist"
            :aria-label="t('premium.chooseLevel')"
          >
            <button
              v-for="lvl in PREMIUM_LEVELS"
              :key="lvl"
              type="button"
              role="tab"
              class="premium-level-tab"
              :class="{ 'premium-level-tab--active': activeLevel === lvl }"
              :aria-selected="activeLevel === lvl"
              @click="activeLevel = lvl"
            >
              {{ lvl }}
            </button>
          </div>

          <div v-if="trainingMode === 'random'" class="premium-random-start">
            <p class="premium-random-start__hint">{{ t('premium.randomTrainingHint') }}</p>
            <button
              type="button"
              class="premium-random-start__btn"
              @click="trainRandomLevel(activeLevel)"
            >
              {{ t('premium.startRandomLevel', { level: activeLevel }) }}
            </button>
          </div>

          <div v-else class="topic-grid">
            <button
              v-for="topicItem in topics"
              :key="topicItem.key"
              type="button"
              class="topic-btn"
              @click="onTopicClick(topicItem.key)"
            >
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  gap: 8px;
                "
              >
                <div class="topic-name">
                  {{ topicItem.name }}
                  <span v-if="topicMastered(topicItem.key)" style="margin-left: 4px;">✅</span>
                </div>
                <div
                  style="
                    font-size: 11px;
                    font-weight: 700;
                    color: #AB4DBB;
                    white-space: nowrap;
                    padding: 2px 8px;
                    background: #f3e8f9;
                    border-radius: 20px;
                  "
                >
                  {{ t('premium.questionsCount', { count: questionCount(topicItem.key) }) }}
                </div>
              </div>
              <div class="topic-desc">{{ topicItem.desc }}</div>
            </button>
          </div>
        </section>

        <section
          v-if="isPremium"
          class="premium-dashboard landing-block"
          :aria-label="t('landing.sectionDashboard')"
        >
          <div class="landing-divider" role="separator">
            <span class="landing-divider__label">{{ t('landing.sectionDashboard') }}</span>
          </div>
          <div class="landing-progress premium-dashboard__cards">
            <SchwaechenCard />
            <ActivityCalendar />
          </div>
        </section>

        <!-- Hub topic preview (locked, non-Premium) -->
        <div v-else-if="showTopicCatalog" class="premium-topic-catalog">
          <NiveauTestBlock @locked="onNiveauLocked" />

          <div class="premium-topic-catalog__head">
            <div style="font-weight: 900;">{{ t('premium.topicsHeading') }}</div>
            <p class="premium-topic-catalog__hint">
              {{
                isPremium
                  ? t('premium.hubTopicsHintActive')
                  : t('premium.hubTopicsHint')
              }}
            </p>
          </div>

          <div style="margin-top: 12px;">
            <div style="font-weight: 900; margin-bottom: 10px;">{{ t('premium.chooseLevel') }}</div>
            <div
              class="premium-level-tabs premium-level-tabs--sticky"
              role="tablist"
              :aria-label="t('premium.chooseLevel')"
            >
              <button
                v-for="lvl in PREMIUM_LEVELS"
                :key="lvl"
                type="button"
                role="tab"
                class="premium-level-tab"
                :class="{ 'premium-level-tab--active': activeLevel === lvl }"
                :aria-selected="activeLevel === lvl"
                @click="activeLevel = lvl"
              >
                {{ lvl }}
              </button>
            </div>
          </div>

          <div class="topic-grid">
            <button
              v-for="topicItem in topics"
              :key="topicItem.key"
              type="button"
              class="topic-btn"
              :class="{ 'topic-btn--locked': !isPremium }"
              @click="onTopicClick(topicItem.key)"
            >
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  gap: 8px;
                "
              >
                <div class="topic-name">
                  {{ topicItem.name }}
                  <span v-if="isPremium && topicMastered(topicItem.key)" style="margin-left: 4px;">✅</span>
                  <span v-if="!isPremium" class="topic-btn__lock">💎</span>
                </div>
                <div
                  style="
                    font-size: 11px;
                    font-weight: 700;
                    color: #AB4DBB;
                    white-space: nowrap;
                    padding: 2px 8px;
                    background: #f3e8f9;
                    border-radius: 20px;
                  "
                >
                  {{ t('premium.questionsCount', { count: questionCount(topicItem.key) }) }}
                </div>
              </div>
              <div class="topic-desc">{{ topicItem.desc }}</div>
            </button>
          </div>
        </div>

        <div
          v-if="!isPremium && !isHubMode"
          style="margin-top: 20px; text-align: center;"
        >
          <button
            class="soft-btn"
            type="button"
            style="max-width: 200px; margin: 0 auto;"
            @click="goPremiumBack"
          >
            {{ t('premium.back') }}
          </button>
        </div>
      </div>
    </section>

    <LegalFooter />

    <ConversionSheet
      v-model="conversionSheetOpen"
      :variant="conversionVariant"
      plan="3months"
    />
  </div>
</template>
