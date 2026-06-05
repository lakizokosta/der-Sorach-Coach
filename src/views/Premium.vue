<script setup>
/**
 * Premium — the activation / login / topic-selection screen.
 *
 * When Premium is NOT active, this screen shows (top to bottom):
 *   - An optional "Zeitlimit aufheben" Basis quick-buy banner when
 *     the user arrives from `?focus=basis`.
 *   - The activation form — code + e-mail field, with an inline
 *     Magic-Link request and a Trial-Code request.
 *   - The Premium buy form (plan picker + Stripe + PayPal).
 *
 * When Premium IS active, this screen shows:
 *   - The streak / XP summary.
 *   - The four level cards plus the topic grid.
 *   - A topic count badge per topic (read from the sample bank).
 */

import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import LzdLogo from '@/components/LzdLogo.vue';

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
const backendOn = hasBackend();

const activeLevel = ref('A1');
const code = ref('');
const activationEmail = ref(auth.email || loadString(USER_EMAIL_KEY) || '');
const status = ref({ text: '', color: '#888' });
const submitting = ref(false);

const focusBasis = computed(() => route.query.focus === 'basis');
const topics = computed(() => getTopicsForLevel(activeLevel.value));

const plan = ref('1month');
const email = ref(auth.email || loadString(USER_EMAIL_KEY) || '');
const agbChecked = ref(false);
const buyStatus = ref({ text: '', color: '#888' });
const basisEmail = ref(auth.email || loadString(USER_EMAIL_KEY) || '');

const magicEmail = ref(auth.email || loadString(USER_EMAIL_KEY) || '');
const magicStatus = ref({ text: '', color: '#888' });
const magicSubmitting = ref(false);

const trialEmail = ref(auth.email || loadString(USER_EMAIL_KEY) || '');
const trialStatus = ref({ text: '', color: '#888' });
const trialSubmitting = ref(false);

/**
 * Validates the buy form (email + AGB checkbox).
 *
 * @return {boolean} true if the form is valid; otherwise sets
 *   `buyStatus` to an error message and returns false.
 */
function validateBuyForm() {
  const value = email.value.trim();
  if (!value || !value.includes('@')) {
    buyStatus.value = { text: '✖ Bitte gültige Email-Adresse eingeben.', color: '#ed4545' };
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
  const url = buildStripePremiumUrl(plan.value, email.value.trim());
  window.open(url, '_blank', 'noopener');
  buyStatus.value = {
    text: `💳 Stripe-Seite geöffnet. Nach der Zahlung erhältst du deinen Code per E-Mail an ${email.value.trim()}.`,
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
    text: `💳 PayPal-Seite geöffnet. Nach der Zahlung schicken wir den Code an ${email.value.trim()}.`,
    color: '#0070BA',
  };
}

/**
 * Opens the Stripe-hosted checkout for the one-off Basis purchase
 * (Zeitlimit aufheben — 4,99€). Uses the email entered in the basis
 * mini-form (or the stored userEmail) for pre-fill.
 */
function payBasis() {
  const value = (basisEmail.value || '').trim();
  if (value) saveString(USER_EMAIL_KEY, value);
  const url = buildStripeBasisUrl(value);
  window.open(url, '_blank', 'noopener');
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
  submitting.value = true;
  status.value = { text: 'Wird überprüft…', color: '#888' };
  const trimmedEmail = activationEmail.value.trim();
  if (trimmedEmail) saveString(USER_EMAIL_KEY, trimmedEmail);

  const res = await activateCode(code.value, trimmedEmail);
  submitting.value = false;

  if (res.ok) {
    status.value = {
      text: res.type === 'premium' ? '✔ Premium aktiviert!' : '✔ Zeitlimit aufgehoben!',
      color: '#69c43b',
    };
    code.value = '';
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
  if (magicSubmitting.value) return;
  const value = magicEmail.value.trim();
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
 * Requests a free 1-day trial code. The backend e-mails a `TEST1-…`
 * activation code (one trial per e-mail / device).
 */
async function submitTrial() {
  if (trialSubmitting.value) return;
  const value = trialEmail.value.trim();
  if (!value || !value.includes('@')) {
    trialStatus.value = { text: '✖ Bitte gültige Email-Adresse eingeben.', color: '#ed4545' };
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
          <div
            v-if="focusBasis"
            style="
              background: linear-gradient(135deg, #f3e8ff, #fdf4ff);
              border: 1.5px solid #C86DD7;
              border-radius: 16px;
              padding: 16px;
              margin-bottom: 16px;
              text-align: left;
            "
          >
            <div
              style="
                font-weight: 900;
                font-size: 15px;
                color: #5b1f6a;
                margin-bottom: 6px;
              "
            >
              ⏱️ Zeitlimit aufheben – {{ PRICES_EUR.basis.toFixed(2).replace('.', ',') }}€
            </div>
            <p
              style="
                font-size: 12px;
                color: #5b1f6a;
                line-height: 1.45;
                margin: 0 0 12px 0;
              "
            >
              Einmalzahlung · kein Abo · sofort aktiv. Nach der Zahlung erhältst
              du den Aktivierungscode per E-Mail.
            </p>
            <input
              v-model="basisEmail"
              type="email"
              placeholder="Deine Email-Adresse"
              style="
                width: 100%;
                padding: 12px;
                border-radius: 12px;
                border: 1px solid #ddd;
                font-size: 14px;
                margin-bottom: 10px;
                box-sizing: border-box;
              "
            />
            <button
              type="button"
              @click="payBasis"
              style="
                width: 100%;
                padding: 12px;
                border-radius: 12px;
                border: none;
                background: #635BFF;
                color: #fff;
                font-weight: 900;
                font-size: 14px;
                cursor: pointer;
              "
            >
              💳 Mit Stripe bezahlen – 4,99€
            </button>
            <p style="font-size: 10px; color: #888; margin: 8px 0 0 0; text-align: center;">
              🔒 Sichere Zahlung über Stripe · Visa, Mastercard, Apple Pay, Google Pay
            </p>
          </div>

          <div
            v-if="isLoggedIn"
            style="
              background: linear-gradient(135deg, #FFD700, #FFB700);
              border-radius: 14px;
              padding: 12px 16px;
              margin-bottom: 14px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 10px;
            "
          >
            <div style="font-size: 13px; font-weight: 900; color: #000; overflow: hidden; text-overflow: ellipsis;">
              👤 {{ auth.email }}
            </div>
            <button
              type="button"
              @click="signOut"
              style="
                background: rgba(0, 0, 0, 0.18);
                color: #000;
                border: none;
                border-radius: 999px;
                padding: 6px 14px;
                font-size: 12px;
                font-weight: 900;
                cursor: pointer;
              "
            >
              Abmelden
            </button>
          </div>

          <div
            style="
              background: #f9f9f9;
              border-radius: 16px;
              padding: 16px;
              margin-bottom: 16px;
            "
          >
            <div style="font-weight: 700; margin-bottom: 8px;">🔑 Aktivierungscode</div>
            <input
              v-model="code"
              type="text"
              :placeholder="backendOn ? 'Aktivierungscode (z.B. STRIPE_…, BASIS_…)' : 'z.B. PREMIUM_DEMO oder BASIS_TEST'"
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
            <input
              v-if="backendOn"
              v-model="activationEmail"
              type="email"
              placeholder="Deine Email-Adresse (für Verifizierung)"
              style="
                width: 100%;
                padding: 14px;
                border-radius: 12px;
                border: 1px solid #ddd;
                font-size: 15px;
                margin-bottom: 8px;
                box-sizing: border-box;
              "
            />
            <button
              type="button"
              :disabled="submitting"
              @click="submitCode"
              style="
                width: 100%;
                padding: 12px;
                border-radius: 12px;
                border: none;
                background: #AB4DBB;
                color: #fff;
                font-weight: 900;
                font-size: 14px;
                cursor: pointer;
              "
              :style="submitting ? 'opacity: 0.6; cursor: progress;' : ''"
            >
              {{ submitting ? 'Wird überprüft…' : 'Code aktivieren' }}
            </button>
            <div
              style="font-size: 13px; margin-top: 12px; min-height: 18px;"
              :style="{ color: status.color }"
            >
              {{ status.text }}
            </div>
            <p v-if="!backendOn" style="font-size: 11px; color: #999; margin-top: 12px;">
              Demo-Modus: jeder Code, der mit <strong>PREMIUM</strong> beginnt,
              schaltet Premium für 30 Tage frei; <strong>BASIS</strong>-Codes
              heben das Zeitlimit dauerhaft auf.
            </p>
          </div>

          <details
            v-if="backendOn"
            style="
              background: #f3f7ff;
              border: 1px solid #cfd9ef;
              border-radius: 16px;
              padding: 12px 16px;
              margin-bottom: 16px;
            "
          >
            <summary
              style="
                cursor: pointer;
                font-weight: 700;
                color: #2a4dbf;
                font-size: 14px;
              "
            >
              ✉️ Anmelden mit Email (Magic Link)
            </summary>
            <div style="margin-top: 12px;">
              <input
                v-model="magicEmail"
                type="email"
                placeholder="Deine Email-Adresse"
                style="
                  width: 100%;
                  padding: 12px;
                  border-radius: 10px;
                  border: 1px solid #cfd9ef;
                  font-size: 14px;
                  margin-bottom: 8px;
                  box-sizing: border-box;
                "
              />
              <button
                type="button"
                :disabled="magicSubmitting"
                @click="submitMagicLink"
                style="
                  width: 100%;
                  padding: 12px;
                  border-radius: 10px;
                  border: none;
                  background: #2a4dbf;
                  color: #fff;
                  font-weight: 900;
                  font-size: 14px;
                  cursor: pointer;
                "
                :style="magicSubmitting ? 'opacity:0.6;cursor:progress;' : ''"
              >
                {{ magicSubmitting ? 'Wird gesendet…' : 'Link senden' }}
              </button>
              <div
                v-if="magicStatus.text"
                style="font-size: 12px; margin-top: 10px; min-height: 14px;"
                :style="{ color: magicStatus.color }"
              >
                {{ magicStatus.text }}
              </div>
              <p style="font-size: 11px; color: #888; margin-top: 8px;">
                Wir senden dir einen Link – der Link ist 15 Minuten gültig
                und meldet dich automatisch an.
              </p>
            </div>
          </details>

          <details
            v-if="backendOn"
            style="
              background: #f4fff0;
              border: 1px solid #cfe9c0;
              border-radius: 16px;
              padding: 12px 16px;
              margin-bottom: 16px;
            "
          >
            <summary
              style="
                cursor: pointer;
                font-weight: 700;
                color: #2e7d32;
                font-size: 14px;
              "
            >
              🎁 1 Tag gratis testen
            </summary>
            <div style="margin-top: 12px;">
              <input
                v-model="trialEmail"
                type="email"
                placeholder="Deine Email-Adresse"
                style="
                  width: 100%;
                  padding: 12px;
                  border-radius: 10px;
                  border: 1px solid #cfe9c0;
                  font-size: 14px;
                  margin-bottom: 8px;
                  box-sizing: border-box;
                "
              />
              <button
                type="button"
                :disabled="trialSubmitting"
                @click="submitTrial"
                style="
                  width: 100%;
                  padding: 12px;
                  border-radius: 10px;
                  border: none;
                  background: #2e7d32;
                  color: #fff;
                  font-weight: 900;
                  font-size: 14px;
                  cursor: pointer;
                "
                :style="trialSubmitting ? 'opacity:0.6;cursor:progress;' : ''"
              >
                {{ trialSubmitting ? 'Wird angefordert…' : 'Gratis-Code anfordern' }}
              </button>
              <div
                v-if="trialStatus.text"
                style="font-size: 12px; margin-top: 10px; min-height: 14px;"
                :style="{ color: trialStatus.color }"
              >
                {{ trialStatus.text }}
              </div>
              <p style="font-size: 11px; color: #888; margin-top: 8px;">
                Einmaliger Gratis-Code (24 h) — ein Code pro Email und Gerät.
              </p>
            </div>
          </details>

          <div
            style="
              background: #fff;
              border-radius: 16px;
              padding: 18px;
              border: 1px solid #eee;
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

            <div style="font-size: 13px; color: #666; margin-bottom: 6px;">
              Gib deine Email ein:
            </div>
            <input
              v-model="email"
              type="email"
              placeholder="Deine Email-Adresse"
              style="
                width: 100%;
                padding: 14px;
                border-radius: 12px;
                border: 1px solid #ddd;
                font-size: 15px;
                margin-bottom: 12px;
                box-sizing: border-box;
              "
            />

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
                <a
                  href="https://www.lernziel-deutsch.de/p/agb.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="color: #AB4DBB; text-decoration: underline;"
                >AGB</a>
                zu und bestätige, dass das Widerrufsrecht mit Bereitstellung
                des Codes erlischt.
              </span>
            </label>

            <button
              type="button"
              @click="payWithStripe"
              style="
                width: 100%;
                padding: 14px;
                border-radius: 12px;
                border: none;
                background: #635BFF;
                color: #fff;
                font-weight: 900;
                font-size: 15px;
                cursor: pointer;
                line-height: 1.2;
                margin-bottom: 8px;
              "
            >
              <span style="display: block;">💳 Mit Stripe bezahlen</span>
              <span style="display: block; font-size: 11px; font-weight: 400; opacity: 0.85;">
                Visa, Mastercard, Apple Pay, Google Pay
              </span>
            </button>

            <button
              type="button"
              @click="payWithPaypal"
              style="
                width: 100%;
                padding: 12px;
                border-radius: 12px;
                border: none;
                background: #FFC439;
                color: #000;
                font-weight: 900;
                font-size: 14px;
                cursor: pointer;
                line-height: 1.2;
              "
            >
              <span style="display: block;">💳 Mit PayPal kaufen</span>
              <span style="display: block; font-size: 10px; font-weight: 400; opacity: 0.8;">
                Code kommt automatisch per Mail
              </span>
            </button>

            <p
              style="
                font-size: 11px;
                color: #888;
                margin: 12px 0 0 0;
                text-align: center;
              "
            >
              🔒 Sichere Zahlung · Ein Code = ein Gerät
            </p>

            <div
              v-if="buyStatus.text"
              style="font-size: 13px; margin-top: 14px; min-height: 18px; text-align: center;"
              :style="{ color: buyStatus.color }"
            >
              {{ buyStatus.text }}
            </div>
          </div>
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
                  ❄️ Freezes
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
