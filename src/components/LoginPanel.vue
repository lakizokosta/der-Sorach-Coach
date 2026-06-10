<script setup>
/**
 * LoginPanel — magic-link login on the landing page (save progress only).
 */

import { ref } from 'vue';

import DeviceGuide from '@/components/DeviceGuide.vue';
import { useAuth } from '@/composables/useAuth.js';
import { activateCode, usePremium } from '@/composables/usePremium.js';
import { loadString, saveString } from '@/composables/useStorage.js';
import { hasBackend, requestMagicLink } from '@/utils/api.js';
import { useI18n } from '@/i18n/index.js';

const USER_EMAIL_KEY = 'userEmail';
const backendOn = hasBackend();
const { t } = useI18n();

const { state: auth, isLoggedIn, logout } = useAuth();
const { isPremium, isBasis } = usePremium();

const magicEmail = ref(auth.email || loadString(USER_EMAIL_KEY) || '');
const magicStatus = ref({ text: '', color: '#888' });
const magicSubmitting = ref(false);

const code = ref('');
const codeStatus = ref({ text: '', color: '#888' });
const codeSubmitting = ref(false);

async function submitMagicLink() {
  if (!backendOn || magicSubmitting.value) return;
  const value = magicEmail.value.trim().toLowerCase();
  if (!value || !value.includes('@')) {
    magicStatus.value = { text: t('login.errInvalidEmail'), color: '#ed4545' };
    return;
  }
  magicSubmitting.value = true;
  magicStatus.value = { text: t('login.sendingLink'), color: '#888' };
  saveString(USER_EMAIL_KEY, value);

  const res = await requestMagicLink(value);
  magicSubmitting.value = false;

  if (res && res.ok) {
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
  <div v-if="backendOn" class="login-panel">
    <template v-if="isLoggedIn && (isPremium || isBasis)">
      <div class="login-panel__session login-panel__session--premium">
        <div class="login-panel__session-email">👤 {{ auth.email }}</div>
        <button type="button" class="login-panel__signout-pill" @click="signOut">
          {{ t('common.signOut') }}
        </button>
      </div>
      <p class="login-panel__ok-note">{{ t('login.loggedInPremium') }}</p>
      <slot name="after-intro" />
    </template>

    <div v-else-if="(isPremium || isBasis) && !isLoggedIn" class="login-panel-card">
      <div class="login-panel-card__badge">{{ t('login.badgeHome') }}</div>
      <h3 class="login-panel-card__title">{{ t('login.otherDeviceTitle') }}</h3>
      <p class="login-panel-card__intro">
        {{ t('login.otherDeviceBefore') }}
        <strong>{{ t('login.otherDeviceEmail') }}</strong>
        {{ t('login.otherDeviceMid') }}
        <strong>{{ t('login.otherDeviceNoCode') }}</strong>
      </p>
      <DeviceGuide variant="landing" />
      <slot name="after-intro" />
      <div class="login-panel-card__row">
        <input
          v-model="magicEmail"
          type="email"
          class="login-panel-card__input"
          :placeholder="t('common.emailPlaceholder')"
        />
        <button
          type="button"
          class="login-panel__btn"
          :disabled="magicSubmitting"
          @click="submitMagicLink"
        >
          {{ magicSubmitting ? '…' : t('login.sendLink') }}
        </button>
      </div>
      <ol class="login-panel-card__how">
        <li>{{ t('login.step1') }}</li>
        <li>{{ t('login.step2') }}</li>
        <li>{{ t('login.step3') }}</li>
      </ol>
      <p
        v-if="magicStatus.text"
        class="login-panel-card__status"
        :style="{ color: magicStatus.color }"
      >
        {{ magicStatus.text }}
      </p>
    </div>

    <div v-else-if="isLoggedIn" class="login-panel-card login-panel-card--code">
      <div class="login-panel-card__badge">{{ t('login.badgeHome') }}</div>
      <div class="login-panel__session-row">
        <span class="login-panel__session-email">👤 {{ auth.email }}</span>
        <button type="button" class="login-panel__signout-text" @click="signOut">
          {{ t('common.signOut') }}
        </button>
      </div>
      <slot name="after-intro" />
      <p class="login-panel-card__intro">{{ t('login.codePrompt') }}</p>
      <div class="login-panel-card__row">
        <input
          v-model="code"
          type="text"
          class="login-panel-card__input login-panel-card__input--code"
          :placeholder="t('login.codePlaceholder')"
        />
        <button
          type="button"
          class="login-panel__btn login-panel__btn--code"
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

    <div v-else class="login-panel-card">
      <div class="login-panel-card__badge">{{ t('login.badgeHome') }}</div>
      <h3 class="login-panel-card__title">{{ t('login.saveTitle') }}</h3>
      <p class="login-panel-card__intro">
        {{ t('login.saveIntroBefore') }}
        <strong>{{ t('login.saveIntroStrong') }}</strong>
        {{ t('login.saveIntroMid') }}
        <strong>{{ t('login.saveIntroNoPw') }}</strong>
        {{ t('login.saveIntroPwMid') }}
        {{ t('login.saveIntroBuyBefore') }}
        <router-link :to="{ name: 'premium' }">{{ t('common.premium') }}</router-link>
        {{ t('login.saveIntroBuyAfter') }}
      </p>
      <slot name="after-intro" />
      <div class="login-panel-card__row">
        <input
          v-model="magicEmail"
          type="email"
          class="login-panel-card__input"
          :placeholder="t('common.emailPlaceholder')"
        />
        <button
          type="button"
          class="login-panel__btn"
          :disabled="magicSubmitting"
          @click="submitMagicLink"
        >
          {{ magicSubmitting ? '…' : t('login.sendLink') }}
        </button>
      </div>
      <ol class="login-panel-card__how">
        <li>{{ t('login.step1') }}</li>
        <li>{{ t('login.step2') }}</li>
        <li>{{ t('login.step3done') }}</li>
      </ol>
      <p class="login-panel-card__aside">
        {{ t('login.asidePremiumBefore') }}
        <router-link :to="{ name: 'premium' }">{{ t('common.premium') }}</router-link>
        {{ t('login.asidePremiumAfter') }}
      </p>
      <p
        v-if="magicStatus.text"
        class="login-panel-card__status"
        :style="{ color: magicStatus.color }"
      >
        {{ magicStatus.text }}
      </p>
    </div>
  </div>
</template>
