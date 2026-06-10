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
 *   - Optional trial block.
 *
 * When Premium IS active, this screen shows:
 *   - The streak / XP summary.
 *   - The four level cards plus the topic grid.
 *   - A topic count badge per topic (read from the sample bank).
 */

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import DeviceGuide from '@/components/DeviceGuide.vue';
import LzdLogo from '@/components/LzdLogo.vue';
import PaymentButtonLabel from '@/components/PaymentButtonLabel.vue';

import { PREMIUM_TOPICS, getTopicsForLevel } from '@/data/premiumTopics.js';
import { getQuestionsByTopic } from '@/data/questions.js';
import { usePremium } from '@/composables/usePremium.js';
import { useStreak } from '@/composables/useStreak.js';
import { useXp, getLevel } from '@/composables/useXp.js';
import { isTopicMastered } from '@/composables/useXp.js';
import { useAuth } from '@/composables/useAuth.js';
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
  requestTrial,
} from '@/utils/api.js';

const router = useRouter();
const route = useRoute();
const { isPremium, isBasis, activateCode, clearPremium, clearBasis } = usePremium();
const { state: streak, medalsFor } = useStreak();
const { state: xp, level: liveLevel } = useXp();
const { state: auth, isLoggedIn, logout } = useAuth();

const USER_EMAIL_KEY = 'userEmail';
const PENDING_CODE_KEY = 'pendingActivationCode';
const backendOn = hasBackend();

const activeLevel = ref('A1');
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
const topics = computed(() => getTopicsForLevel(activeLevel.value));

/** E-mail used for checkout, trial, and payment pre-fill. */
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

const magicStatus = ref({ text: '', color: '#888' });
const magicSubmitting = ref(false);

const trialStatus = ref({ text: '', color: '#888' });
const trialSubmitting = ref(false);

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
});

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
        ? '✖ Keine E-Mail in der Sitzung.'
        : '✖ Bitte deine E-Mail für den Code eingeben.',
      color: '#ed4545',
    };
    return false;
  }
  if (!agbChecked.value) {
    buyStatus.value = { text: '✖ Bitte stimmen Sie den AGB zu.', color: '#ed4545' };
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
    text: `💳 Stripe-Seite geöffnet. Nach der Zahlung erhältst du deinen Code per E-Mail an ${emailForCheckout.value}.`,
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
    text: `💳 PayPal-Seite geöffnet. Nach der Zahlung schicken wir den Code an ${emailForCheckout.value}.`,
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
      text: '✖ Bitte deine E-Mail für den Code eingeben.',
      color: '#ed4545',
    };
    return false;
  }
  if (!agbChecked.value) {
    buyStatus.value = { text: '✖ Bitte stimmen Sie den AGB zu.', color: '#ed4545' };
    return false;
  }
  saveString(USER_EMAIL_KEY, value);
  return true;
}

function payBasis() {
  if (!validateBasisCheckout()) return;
  window.open(buildStripeBasisUrl(emailForCheckout.value), '_blank', 'noopener');
  buyStatus.value = {
    text: `💳 Stripe-Seite geöffnet. Code nach Zahlung an ${emailForCheckout.value}.`,
    color: '#635BFF',
  };
}

function payBasisPaypal() {
  if (!validateBasisCheckout()) return;
  window.open(buildPaypalBasisUrl(), '_blank', 'noopener');
  buyStatus.value = {
    text: `💳 PayPal-Seite geöffnet. Code nach Zahlung an ${emailForCheckout.value}.`,
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
  return getQuestionsByTopic(activeLevel.value, topicKey).length;
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
    status.value = { text: '✖ Bitte Code eingeben.', color: '#ed4545' };
    return;
  }
  if (backendOn && !isLoggedIn.value) {
    status.value = {
      text: '✖ Bitte zuerst einloggen (Login-Link aus der Kauf-E-Mail oder unten anfordern).',
      color: '#ed4545',
    };
    return;
  }

  submitting.value = true;
  status.value = { text: 'Wird überprüft…', color: '#888' };

  const emailForCode = backendOn ? auth.email : emailForCheckout.value;
  const res = await activateCode(trimmedCode, emailForCode);
  submitting.value = false;

  if (res.ok) {
    status.value = {
      text: res.type === 'premium' ? '✔ Premium aktiviert!' : '✔ Zeitlimit aufgehoben!',
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
    magicStatus.value = { text: '✖ Bitte gültige Email-Adresse eingeben.', color: '#ed4545' };
    return;
  }
  magicSubmitting.value = true;
  magicStatus.value = { text: 'Link wird gesendet…', color: '#888' };
  saveString(USER_EMAIL_KEY, value);

  const res = await requestMagicLink(value);
  magicSubmitting.value = false;

  if (res && res.ok) {
    magicStatus.value = {
      text: res.message || `✔ Anmelde-Link an ${value} gesendet.`,
      color: '#69c43b',
    };
  } else {
    magicStatus.value = {
      text: `✖ ${(res && res.error) || 'Link konnte nicht gesendet werden.'}`,
      color: '#ed4545',
    };
  }
}

/**
 * Requests a free 1-day trial code. The backend e-mails a `TRIAL-…`
 * code (one trial per e-mail / device). QA: e-mails with `+test` in the
 * local part bypass device deduplication when `TRIAL_TEST_MODE` is on
 * in the deployed Apps Script.
 */
async function submitTrial() {
  if (trialSubmitting.value) return;
  const value = emailForCheckout.value;
  if (!value || !value.includes('@')) {
    trialStatus.value = {
      text: isLoggedIn.value
        ? '✖ Keine E-Mail in der Sitzung.'
        : '✖ Bitte deine E-Mail eingeben.',
      color: '#ed4545',
    };
    return;
  }
  trialSubmitting.value = true;
  trialStatus.value = { text: 'Gratis-Code wird angefordert…', color: '#888' };
  saveString(USER_EMAIL_KEY, value);

  const res = await requestTrial(value);
  trialSubmitting.value = false;

  if (res && res.ok) {
    trialStatus.value = {
      text: `✔ Gratis-Code an ${value} gesendet. Bitte checke deine E-Mail.`,
      color: '#69c43b',
    };
  } else {
    trialStatus.value = {
      text: `✖ ${(res && res.error) || 'Konnte keinen Gratis-Code ausstellen.'}`,
      color: '#ed4545',
    };
  }
}

/** Removes Premium / Basis activation. */
function deactivate() {
  clearPremium();
  clearBasis();
  status.value = { text: 'Premium deaktiviert.', color: '#888' };
}

/** Logs the user out (clears the 7-day Magic-Link session). */
function signOut() {
  logout();
  magicStatus.value = { text: 'Abgemeldet.', color: '#888' };
}

/**
 * Starts a training session focussed on the chosen topic.
 *
 * @param {string} topicKey
 */
function trainTopic(topicKey) {
  if (!isPremium.value) return;
  router.push({
    name: 'trainer',
    query: { level: activeLevel.value, topic: topicKey, mode: 'premium' },
  });
}

/** Returns true when the topic has been mastered (50+ correct). */
function topicMastered(key) {
  return isTopicMastered(key);
}
</script>

<template>
  <div class="app-shell">
    <LzdLogo small />
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
          <div style="text-align: left;">
            <div style="font-size: 22px; font-weight: 900;">Der SprachCoach</div>
            <div style="font-size: 13px; color: #666;">Trainiere gezielt zur Prüfung.</div>
            <div style="font-size: 14px; font-style: italic; color: #AB4DBB;">
              Dein Trainer für alle Fälle
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
            {{ isPremium ? 'Status: aktiv' : 'Status: nicht aktiv' }}
          </div>
        </header>

        <!-- LOCKED VIEW: activation + price block -->
        <div v-if="!isPremium" style="text-align: left;">
          <div v-if="focusBasis" class="premium-basis-card">
            <div class="premium-basis-card__title">
              ⏱️ Zeitlimit aufheben – {{ PRICES_EUR.basis.toFixed(2).replace('.', ',') }}€
            </div>
            <p class="premium-basis-card__intro">
              Einmalzahlung · kein Abo · sofort aktiv. Nach der Zahlung erhältst
              du den Aktivierungscode per E-Mail.
            </p>
            <div v-if="!isLoggedIn" class="premium-basis-card__email">
              <label
                for="basis-buy-email"
                class="premium-basis-card__email-label"
              >
                E-Mail für den Aktivierungscode
              </label>
              <input
                id="basis-buy-email"
                v-model="buyEmail"
                type="email"
                class="premium-flow__input"
                placeholder="deine@email.de"
              />
            </div>
            <p v-else class="premium-basis-card__email-hint">
              📧 Code an: <strong>{{ auth.email }}</strong>
            </p>
            <DeviceGuide variant="basis" />
            <label class="premium-basis-card__agb">
              <input
                v-model="agbChecked"
                type="checkbox"
                class="premium-basis-card__agb-check"
              />
              <span>
                Ich stimme den
                <router-link
                  :to="{ name: 'legal', params: { slug: 'agb' } }"
                  target="_blank"
                >AGB</router-link>
                zu und bestätige, dass das Widerrufsrecht mit Bereitstellung
                des Codes erlischt.
              </span>
            </label>
            <button
              type="button"
              class="premium-basis-btn premium-basis-btn--stripe"
              @click="payBasis"
            >
              <PaymentButtonLabel
                provider="stripe"
                main="Bezahlen – 4,99€"
                sub="Visa, Mastercard, Apple Pay, Google Pay"
              />
            </button>
            <button
              type="button"
              class="premium-basis-btn premium-basis-btn--paypal"
              @click="payBasisPaypal"
            >
              <PaymentButtonLabel
                provider="paypal"
                main="Kaufen – 4,99€"
                sub="Code kommt automatisch per Mail"
              />
            </button>
            <p class="premium-buy-footer" style="margin-top: 8px;">
              🔒 Sichere Zahlung · Einmalzahlung · kein Abo
            </p>
            <div
              v-if="buyStatus.text"
              class="premium-flow__status premium-basis-card__status"
              :style="{ color: buyStatus.color }"
            >
              {{ buyStatus.text }}
            </div>
            <p class="premium-basis-card__alt">
              <router-link :to="{ name: 'premium' }">
                💎 Stattdessen Premium ab 19€/Monat
              </router-link>
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
            <div style="font-weight: 900; margin-bottom: 8px;">🛒 Premium kaufen</div>
            <div style="font-size: 13px; color: #666; margin-bottom: 12px;">
              Wähle deinen Plan:
            </div>

            <div style="margin-bottom: 14px;">
              <label
                v-for="opt in [
                  { v: '1month',   label: '1 Monat – 19€',   note: '' },
                  { v: '3months',  label: '3 Monate – 49€',  note: '1 Monat gratis' },
                  { v: '12months', label: '12 Monate – 99€', note: '3 Monate gratis' },
                ]"
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
                E-Mail für den Aktivierungscode
              </label>
              <input
                id="premium-buy-email"
                v-model="buyEmail"
                type="email"
                class="premium-flow__input"
                placeholder="deine@email.de"
              />
            </div>
            <p v-else style="font-size: 13px; color: #666; margin: 0 0 12px 0;">
              Code nach Zahlung an: <strong>{{ auth.email }}</strong>
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
                Ich stimme den
                <router-link
                  :to="{ name: 'legal', params: { slug: 'agb' } }"
                  target="_blank"
                  style="color: #AB4DBB; text-decoration: underline;"
                >AGB</router-link>
                zu und bestätige, dass das Widerrufsrecht mit Bereitstellung
                des Codes erlischt.
              </span>
            </label>

            <button
              type="button"
              class="premium-basis-btn premium-basis-btn--stripe"
              @click="payWithStripe"
            >
              <PaymentButtonLabel
                provider="stripe"
                main="Bezahlen"
                sub="Visa, Mastercard, Apple Pay, Google Pay"
              />
            </button>

            <button
              type="button"
              class="premium-basis-btn premium-basis-btn--paypal"
              @click="payWithPaypal"
            >
              <PaymentButtonLabel
                provider="paypal"
                main="Kaufen"
                sub="Code kommt automatisch per Mail"
              />
            </button>

            <p class="premium-buy-footer">
              🔒 Sichere Zahlung · Code einmal aktivieren · Weitere Geräte per E-Mail-Login
            </p>

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
            aria-label="Code aus E-Mail aktivieren"
          >
            <div class="premium-flow__head">
              <span class="premium-flow__title">✉️ Fast geschafft!</span>
            </div>
            <p class="premium-flow__intro">
              Dein Code aus der Kauf-E-Mail ist bereit. Einloggen — wir aktivieren ihn
              <strong>automatisch</strong>. Gleiche E-Mail wie beim Kauf verwenden.
            </p>
            <input
              v-model="accountEmail"
              type="email"
              class="premium-flow__input"
              placeholder="deine@email.de"
            />
            <button
              type="button"
              class="premium-flow__btn premium-flow__btn--login"
              :disabled="magicSubmitting"
              @click="submitMagicLink"
            >
              {{ magicSubmitting ? 'Wird gesendet…' : '📧 Login-Link senden' }}
            </button>
            <p class="premium-flow__hint">
              Postfach öffnen → Link antippen → Premium startet von selbst.
            </p>
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
            aria-label="Aktivierungscode eingeben"
          >
            <div class="premium-flow__head">
              <span class="premium-flow__title">🔑 Aktivierungscode</span>
            </div>
            <div class="premium-flow__logged-in">
              <span class="premium-flow__logged-email">✅ {{ auth.email }}</span>
              <button type="button" class="premium-flow__signout" @click="signOut">
                Abmelden
              </button>
            </div>
            <p v-if="pendingCode" class="premium-flow__hint premium-flow__hint--ok">
              Code aus deiner E-Mail übernommen — tippe auf «Code aktivieren».
            </p>
            <input
              v-model="code"
              type="text"
              class="premium-flow__input premium-flow__input--code"
              placeholder="Code aus der E-Mail (z.B. PREMIUM-…)"
            />
            <button
              type="button"
              class="premium-flow__btn premium-flow__btn--code"
              :disabled="submitting"
              @click="submitCode"
            >
              {{ submitting ? 'Wird überprüft…' : 'Code aktivieren' }}
            </button>
            <div
              v-if="status.text"
              class="premium-flow__status"
              :style="{ color: status.color }"
            >
              {{ status.text }}
            </div>
          </section>

          <!-- Demo mode: no backend -->
          <div
            v-else-if="!backendOn"
            style="
              background: #f9f9f9;
              border-radius: 16px;
              padding: 16px;
              margin-bottom: 16px;
            "
          >
            <div style="font-weight: 700; margin-bottom: 8px;">🔑 Aktivierungscode (Demo)</div>
            <input
              v-model="code"
              type="text"
              placeholder="z.B. PREMIUM_DEMO oder BASIS_TEST"
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
              {{ submitting ? 'Wird überprüft…' : 'Code aktivieren' }}
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
            <summary>Schon bezahlt, aber keinen Link bekommen?</summary>
            <p class="premium-flow__hint">
              Fordere hier einen Login-Link an und gib danach den Code aus der Kauf-E-Mail ein.
            </p>
            <input
              v-model="accountEmail"
              type="email"
              class="premium-flow__input"
              placeholder="deine@email.de"
            />
            <button
              type="button"
              class="premium-flow__btn premium-flow__btn--login"
              :disabled="magicSubmitting"
              @click="submitMagicLink"
            >
              {{ magicSubmitting ? 'Wird gesendet…' : '📧 Login-Link senden' }}
            </button>
            <div
              v-if="magicStatus.text"
              class="premium-flow__status"
              :style="{ color: magicStatus.color }"
            >
              {{ magicStatus.text }}
            </div>
          </details>

          <details v-if="backendOn && !focusBasis" class="premium-flow-trial">
            <summary>🎁 1 Tag gratis testen</summary>
            <p class="premium-flow__hint">
              <template v-if="isLoggedIn">
                Trial-Code wird an <strong>{{ auth.email }}</strong> gesendet.
              </template>
              <template v-else-if="emailForCheckout">
                Trial-Code wird an <strong>{{ emailForCheckout }}</strong> gesendet.
              </template>
              <template v-else>
                Gib oben deine E-Mail ein.
              </template>
            </p>
            <button
              type="button"
              class="premium-flow__btn premium-flow__btn--trial"
              :disabled="trialSubmitting"
              @click="submitTrial"
            >
              {{ trialSubmitting ? 'Wird angefordert…' : 'Gratis-Code anfordern' }}
            </button>
            <div
              v-if="trialStatus.text"
              class="premium-flow__status"
              :style="{ color: trialStatus.color }"
            >
              {{ trialStatus.text }}
            </div>
          </details>
        </div>

        <!-- UNLOCKED VIEW: streak, XP, levels, topics -->
        <div v-else>
          <div
            style="
              background: linear-gradient(135deg, #f5f0f7 0%, #f9f9f9 100%);
              border-radius: 20px;
              padding: 20px;
              margin-bottom: 16px;
              border: 1px solid rgba(171, 77, 187, 0.15);
            "
          >
            <div
              style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;"
            >
              <span style="font-size: 20px;">🔥</span>
              <span
                style="
                  font-weight: 900;
                  color: #AB4DBB;
                  font-size: 16px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                "
              >
                Dein Streak
              </span>
            </div>
            <div
              style="
                display: flex;
                justify-content: space-around;
                gap: 10px;
                margin-bottom: 16px;
              "
            >
              <div style="text-align: center; flex: 1;">
                <div style="font-size: 28px; font-weight: 900;">
                  {{ streak.currentStreak }}
                </div>
                <div class="small-note" style="text-transform: uppercase;">
                  Tage aktuell
                </div>
              </div>
              <div style="text-align: center; flex: 1;">
                <div style="font-size: 28px; font-weight: 900;">
                  {{ streak.longestStreak }}
                </div>
                <div class="small-note" style="text-transform: uppercase;">
                  Rekord 🏆
                </div>
              </div>
              <div style="text-align: center; flex: 1;">
                <div style="font-size: 28px; font-weight: 900; color: #69c43b;">
                  {{ streak.freezes }}
                </div>
                <div class="small-note" style="text-transform: uppercase;">
                  Freezes
                </div>
              </div>
            </div>
            <div style="text-align: center;">
              <span class="small-note" style="margin-right: 8px;">🏅 Medaillen:</span>
              <span style="font-size: 22px; letter-spacing: 6px;">
                {{ medalsFor(streak.longestStreak) }}
              </span>
            </div>
          </div>

          <div
            style="
              background: linear-gradient(135deg, #f5f0ff, #fff);
              border-radius: 16px;
              padding: 16px;
              margin: 12px 0;
              border: 1px solid rgba(171, 77, 187, 0.2);
            "
          >
            <div style="display: flex; align-items: center; gap: 10px;">
              <div
                style="
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: 900;
                  color: #fff;
                "
                :style="{ background: liveLevel.color }"
              >
                Lv{{ liveLevel.num }}
              </div>
              <div style="flex: 1; text-align: left;">
                <div style="font-weight: 900;">{{ liveLevel.name }}</div>
                <div class="small-note">
                  ⭐ {{ xp.totalXP }} XP
                  <template v-if="liveLevel.next">
                    · noch {{ liveLevel.next - xp.totalXP }} XP bis Lv{{
                      liveLevel.num + 1
                    }}
                  </template>
                  <template v-else>· Max. Level!</template>
                </div>
              </div>
            </div>
          </div>

          <div style="margin-top: 18px;">
            <div style="font-weight: 900; margin-bottom: 10px;">Niveau wählen</div>
            <div class="level-grid">
              <button
                v-for="lvl in ['A1', 'A2', 'B1', 'B2']"
                :key="lvl"
                type="button"
                class="level-card"
                :class="{ active: activeLevel === lvl }"
                @click="activeLevel = lvl"
              >
                <div class="level-name">{{ lvl }}</div>
              </button>
            </div>
          </div>

          <div style="margin-top: 18px;">
            <div style="font-weight: 900; margin-bottom: 10px;">Themen</div>
            <div class="topic-grid">
              <button
                v-for="t in topics"
                :key="t.key"
                type="button"
                class="topic-btn"
                @click="trainTopic(t.key)"
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
                    {{ t.name }}
                    <span v-if="topicMastered(t.key)" style="margin-left: 4px;">✅</span>
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
                    {{ questionCount(t.key) }} Fragen
                  </div>
                </div>
                <div class="topic-desc">{{ t.desc }}</div>
              </button>
            </div>
          </div>

          <div style="margin-top: 18px; text-align: center;">
            <button class="soft-btn" type="button" @click="deactivate">
              Premium deaktivieren
            </button>
          </div>
        </div>

        <div style="margin-top: 20px; text-align: center;">
          <button
            class="soft-btn"
            type="button"
            style="max-width: 200px; margin: 0 auto;"
            @click="router.push({ name: 'landing' })"
          >
            ← Zurück
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
