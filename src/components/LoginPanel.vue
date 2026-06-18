<script setup>
/**
 * LoginPanel — compact magic-link login on the landing page.
 */

import { computed, ref } from 'vue';

import { useAuth } from '@/composables/useAuth.js';
import { activateCode, usePremium } from '@/composables/usePremium.js';
import { loadString, saveString } from '@/composables/useStorage.js';
import { hasBackend, requestMagicLink } from '@/utils/api.js';
import { useI18n } from '@/i18n/index.js';

defineProps({
  prominent: { type: Boolean, default: false },
});

const USER_EMAIL_KEY = 'userEmail';
const backendOn = hasBackend();
const { t } = useI18n();

const { state: auth, isLoggedIn, logout } = useAuth();
const { isPremium, isBasis } = usePremium();

const magicEmail = ref(auth.email || loadString(USER_EMAIL_KEY) || '');
const magicStatus = ref({ text: '', color: '#888' });
const magicSubmitting = ref(false);
const linkSent = ref(false);

const code = ref('');
const codeStatus = ref({ text: '', color: '#888' });
const codeSubmitting = ref(false);

const savedEmail = computed(() => (loadString(USER_EMAIL_KEY) || '').trim().toLowerCase());

const showWelcomeBack = computed(() => {
  if (isLoggedIn.value || linkSent.value) return false;
  const current = magicEmail.value.trim().toLowerCase();
  return savedEmail.value.includes('@') && current === savedEmail.value;
});

const panelTitle = computed(() => {
  if ((isPremium.value || isBasis.value) && !isLoggedIn.value) {
    return t('login.otherDeviceTitleShort');
  }
  return t('login.compactTitle');
});

async function submitMagicLink() {
  if (!backendOn || magicSubmitting.value) return;
  const value = magicEmail.value.trim().toLowerCase();
  if (!value || !value.includes('@')) {
    magicStatus.value = { text: t('login.errInvalidEmail'), color: '#ed4545' };
    linkSent.value = false;
    return;
  }
  magicSubmitting.value = true;
  linkSent.value = false;
  magicStatus.value = { text: t('login.sendingLink'), color: '#888' };
  saveString(USER_EMAIL_KEY, value);

  const res = await requestMagicLink(value);
  magicSubmitting.value = false;

  if (res && res.ok) {
    linkSent.value = true;
    magicStatus.value = {
      text: t('login.linkSent', { email: value }),
      color: '#69c43b',
    };
  } else {
    magicStatus.value = {
      text: `✖ ${(res && res.error) || t('login.errGeneric')}`,
      color: '#ed4545',
    };
  }
}

async function submitCode() {
  if (!isLoggedIn.value || codeSubmitting.value) return;
  const value = code.value.trim().toUpperCase();
  if (!value) {
    codeStatus.value = { text: t('login.errEnterCode'), color: '#ed4545' };
    return;
  }
  codeSubmitting.value = true;
  codeStatus.value = { text: t('login.activating'), color: '#888' };

  const res = await activateCode(value, auth.email);
  codeSubmitting.value = false;

  if (res.ok) {
    codeStatus.value = {
      text: res.type === 'premium' ? t('login.premiumActivated') : t('login.basisActivated'),
      color: '#69c43b',
    };
    code.value = '';
    setTimeout(() => window.location.reload(), 1500);
  } else {
    codeStatus.value = { text: `✖ ${res.error}`, color: '#ed4545' };
  }
}

function signOut() {
  logout();
  window.location.reload();
}
</script>

<template>
  <div
    v-if="backendOn"
    class="login-panel"
    :class="{ 'login-panel--prominent': prominent }"
  >
    <template v-if="isLoggedIn && (isPremium || isBasis)">
      <div class="login-panel__session login-panel__session--premium">
        <div class="login-panel__session-email">👤 {{ auth.email }}</div>
        <button type="button" class="login-panel__signout-pill" @click="signOut">
          {{ t('common.signOut') }}
        </button>
      </div>
      <p class="login-panel__ok-note">{{ t('login.loggedInPremium') }}</p>
    </template>

    <div
      v-else-if="(isPremium || isBasis) && !isLoggedIn"
      class="login-panel-card login-panel-card--primary"
    >
      <h3 v-if="!prominent" class="login-panel-card__title">{{ panelTitle }}</h3>
      <p v-if="!prominent" class="login-panel-card__hint">{{ t('login.compactHint') }}</p>

      <div v-if="linkSent" class="login-panel__sent">
        <div class="login-panel__sent-icon">✉️</div>
        <p class="login-panel__sent-text">{{ magicStatus.text }}</p>
        <button
          type="button"
          class="login-panel__sent-resend"
          :disabled="magicSubmitting"
          @click="submitMagicLink"
        >
          {{ t('login.sendLinkShort') }}
        </button>
      </div>

      <template v-else>
        <div class="login-steps-visual" aria-hidden="true">
          <div class="login-steps-visual__item">
            <span class="login-steps-visual__icon">📧</span>
            <span class="login-steps-visual__label">{{ t('login.visualEmail') }}</span>
          </div>
          <span class="login-steps-visual__arrow">→</span>
          <div class="login-steps-visual__item">
            <span class="login-steps-visual__icon">📬</span>
            <span class="login-steps-visual__label">{{ t('login.visualMail') }}</span>
          </div>
          <span class="login-steps-visual__arrow">→</span>
          <div class="login-steps-visual__item">
            <span class="login-steps-visual__icon">✅</span>
            <span class="login-steps-visual__label">{{ t('login.visualDone') }}</span>
          </div>
        </div>

        <div
          v-if="showWelcomeBack"
          class="login-panel__welcome"
        >
          <span class="login-panel__welcome-label">{{ t('login.welcomeBack') }}</span>
          <button
            type="button"
            class="login-panel__welcome-btn"
            :disabled="magicSubmitting"
            @click="submitMagicLink"
          >
            {{ t('login.welcomeBackSend', { email: magicEmail.trim() }) }}
          </button>
        </div>

        <div class="login-panel-card__row login-panel-card__row--stack">
          <label
            v-if="prominent"
            class="login-panel__email-label"
            for="magic-email-input"
          >
            {{ t('common.emailLoginPlaceholder') }}
          </label>
          <input
            id="magic-email-input"
            v-model="magicEmail"
            type="email"
            class="login-panel-card__input"
            autocomplete="email"
            inputmode="email"
            :placeholder="prominent ? 'name@beispiel.de' : t('common.emailLoginPlaceholder')"
          />
          <button
            type="button"
            class="login-panel__btn login-panel__btn--full"
            :disabled="magicSubmitting"
            @click="submitMagicLink"
          >
            {{ magicSubmitting ? '…' : t('login.sendLink') }}
          </button>
        </div>
      </template>

      <p
        v-if="magicStatus.text && !linkSent"
        class="login-panel-card__status"
        :style="{ color: magicStatus.color }"
      >
        {{ magicStatus.text }}
      </p>
    </div>

    <div v-else-if="isLoggedIn" class="login-panel-card login-panel-card--code">
      <div class="login-panel__session-row">
        <span class="login-panel__session-email">👤 {{ auth.email }}</span>
        <button type="button" class="login-panel__signout-text" @click="signOut">
          {{ t('common.signOut') }}
        </button>
      </div>
      <p class="login-panel-card__intro">{{ t('login.codePrompt') }}</p>
      <div class="login-panel-card__row login-panel-card__row--stack">
        <input
          v-model="code"
          type="text"
          class="login-panel-card__input login-panel-card__input--code"
          :placeholder="t('login.codePlaceholder')"
        />
        <button
          type="button"
          class="login-panel__btn login-panel__btn--code login-panel__btn--full"
          :disabled="codeSubmitting"
          @click="submitCode"
        >
          {{ codeSubmitting ? '…' : t('common.activate') }}
        </button>
      </div>
      <p class="login-panel-card__aside">
        {{ t('login.asideCodeBefore') }}
        <router-link :to="{ name: 'premium' }">{{ t('common.premium') }}</router-link>
        {{ t('login.asideCodeAfter') }}
      </p>
      <p
        v-if="codeStatus.text"
        class="login-panel-card__status"
        :style="{ color: codeStatus.color }"
      >
        {{ codeStatus.text }}
      </p>
    </div>

    <div v-else class="login-panel-card login-panel-card--primary">
      <h3 v-if="!prominent" class="login-panel-card__title">{{ panelTitle }}</h3>
      <p v-if="!prominent" class="login-panel-card__hint">{{ t('login.compactHint') }}</p>

      <div v-if="linkSent" class="login-panel__sent">
        <div class="login-panel__sent-icon">✉️</div>
        <p class="login-panel__sent-text">{{ magicStatus.text }}</p>
        <button
          type="button"
          class="login-panel__sent-resend"
          :disabled="magicSubmitting"
          @click="submitMagicLink"
        >
          {{ t('login.sendLinkShort') }}
        </button>
      </div>

      <template v-else>
        <div class="login-steps-visual" aria-hidden="true">
          <div class="login-steps-visual__item">
            <span class="login-steps-visual__icon">📧</span>
            <span class="login-steps-visual__label">{{ t('login.visualEmail') }}</span>
          </div>
          <span class="login-steps-visual__arrow">→</span>
          <div class="login-steps-visual__item">
            <span class="login-steps-visual__icon">📬</span>
            <span class="login-steps-visual__label">{{ t('login.visualMail') }}</span>
          </div>
          <span class="login-steps-visual__arrow">→</span>
          <div class="login-steps-visual__item">
            <span class="login-steps-visual__icon">✅</span>
            <span class="login-steps-visual__label">{{ t('login.visualDone') }}</span>
          </div>
        </div>

        <div
          v-if="showWelcomeBack"
          class="login-panel__welcome"
        >
          <span class="login-panel__welcome-label">{{ t('login.welcomeBack') }}</span>
          <button
            type="button"
            class="login-panel__welcome-btn"
            :disabled="magicSubmitting"
            @click="submitMagicLink"
          >
            {{ t('login.welcomeBackSend', { email: magicEmail.trim() }) }}
          </button>
        </div>

        <div class="login-panel-card__row login-panel-card__row--stack">
          <label
            v-if="prominent"
            class="login-panel__email-label"
            for="magic-email-input"
          >
            {{ t('common.emailLoginPlaceholder') }}
          </label>
          <input
            id="magic-email-input"
            v-model="magicEmail"
            type="email"
            class="login-panel-card__input"
            autocomplete="email"
            inputmode="email"
            :placeholder="prominent ? 'name@beispiel.de' : t('common.emailLoginPlaceholder')"
          />
          <button
            type="button"
            class="login-panel__btn login-panel__btn--full"
            :disabled="magicSubmitting"
            @click="submitMagicLink"
          >
            {{ magicSubmitting ? '…' : t('login.sendLink') }}
          </button>
        </div>
      </template>

      <p
        v-if="magicStatus.text && !linkSent"
        class="login-panel-card__status"
        :style="{ color: magicStatus.color }"
      >
        {{ magicStatus.text }}
      </p>
    </div>
  </div>
</template>
