<script setup>
/**
 * LoginPanel — magic-link login on the landing page (save progress only).
 */

import { ref } from 'vue';

import { useAuth } from '@/composables/useAuth.js';
import { activateCode, usePremium } from '@/composables/usePremium.js';
import { loadString, saveString } from '@/composables/useStorage.js';
import { hasBackend, requestMagicLink } from '@/utils/api.js';

const USER_EMAIL_KEY = 'userEmail';
const backendOn = hasBackend();

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
    magicStatus.value = { text: '✖ Bitte gültige E-Mail eingeben.', color: '#ed4545' };
    return;
  }
  magicSubmitting.value = true;
  magicStatus.value = { text: 'Link wird gesendet…', color: '#888' };
  saveString(USER_EMAIL_KEY, value);

  const res = await requestMagicLink(value);
  magicSubmitting.value = false;

  if (res && res.ok) {
    magicStatus.value = {
      text: `✔ Link gesendet! Öffne dein Postfach (${value}) und tippe auf den Link.`,
      color: '#69c43b',
    };
  } else {
    magicStatus.value = {
      text: `✖ ${(res && res.error) || 'Fehler. Bitte versuche es erneut.'}`,
      color: '#ed4545',
    };
  }
}

async function submitCode() {
  if (!isLoggedIn.value || codeSubmitting.value) return;
  const value = code.value.trim().toUpperCase();
  if (!value) {
    codeStatus.value = { text: '✖ Bitte Code eingeben.', color: '#ed4545' };
    return;
  }
  codeSubmitting.value = true;
  codeStatus.value = { text: 'Wird aktiviert…', color: '#888' };

  const res = await activateCode(value, auth.email);
  codeSubmitting.value = false;

  if (res.ok) {
    codeStatus.value = {
      text: res.type === 'premium' ? '✔ Premium aktiviert!' : '✔ Zeitlimit aufgehoben!',
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
    <!-- Logged in + Premium/Basis -->
    <template v-if="isLoggedIn && (isPremium || isBasis)">
      <div class="login-panel__session login-panel__session--premium">
        <div class="login-panel__session-email">👤 {{ auth.email }}</div>
        <button type="button" class="login-panel__signout-pill" @click="signOut">
          Abmelden
        </button>
      </div>
      <p class="login-panel__ok-note">✅ Eingeloggt — Fortschritt wird gespeichert.</p>
      <slot name="after-intro" />
    </template>

    <!-- Premium via code, not logged in -->
    <div v-else-if="(isPremium || isBasis) && !isLoggedIn" class="login-panel-card">
      <div class="login-panel-card__badge">🏠 Startseite</div>
      <h3 class="login-panel-card__title">Fortschritt speichern</h3>
      <p class="login-panel-card__intro">
        Du hast Premium — logge dich ein, damit XP &amp; Streak auf allen Geräten bleiben.
        <strong>Kein Passwort:</strong> Link per E-Mail.
      </p>
      <slot name="after-intro" />
      <div class="login-panel-card__row">
        <input
          v-model="magicEmail"
          type="email"
          class="login-panel-card__input"
          placeholder="deine@email.de"
        />
        <button
          type="button"
          class="login-panel__btn"
          :disabled="magicSubmitting"
          @click="submitMagicLink"
        >
          {{ magicSubmitting ? '…' : '📧 Link senden' }}
        </button>
      </div>
      <ol class="login-panel-card__how">
        <li>E-Mail eingeben</li>
        <li>«Link senden» tippen</li>
        <li>Link im Postfach antippen</li>
      </ol>
      <p
        v-if="magicStatus.text"
        class="login-panel-card__status"
        :style="{ color: magicStatus.color }"
      >
        {{ magicStatus.text }}
      </p>
    </div>

    <!-- Logged in, no premium yet — activate code -->
    <div v-else-if="isLoggedIn" class="login-panel-card login-panel-card--code">
      <div class="login-panel-card__badge">🏠 Startseite</div>
      <div class="login-panel__session-row">
        <span class="login-panel__session-email">👤 {{ auth.email }}</span>
        <button type="button" class="login-panel__signout-text" @click="signOut">
          Abmelden
        </button>
      </div>
      <slot name="after-intro" />
      <p class="login-panel-card__intro">🔑 Hast du einen Code? Hier eingeben:</p>
      <div class="login-panel-card__row">
        <input
          v-model="code"
          type="text"
          class="login-panel-card__input login-panel-card__input--code"
          placeholder="z.B. BASIS_… oder TRIAL-…"
        />
        <button
          type="button"
          class="login-panel__btn login-panel__btn--code"
          :disabled="codeSubmitting"
          @click="submitCode"
        >
          {{ codeSubmitting ? '…' : 'Aktivieren' }}
        </button>
      </div>
      <p class="login-panel-card__aside">
        Code nach dem Kauf? Besser auf der
        <router-link :to="{ name: 'premium' }">Premium-Seite</router-link>
        in Schritt 2 eingeben.
      </p>
      <p
        v-if="codeStatus.text"
        class="login-panel-card__status"
        :style="{ color: codeStatus.color }"
      >
        {{ codeStatus.text }}
      </p>
    </div>

    <!-- Not logged in (default) -->
    <div v-else class="login-panel-card">
      <div class="login-panel-card__badge">🏠 Startseite</div>
      <h3 class="login-panel-card__title">Fortschritt speichern</h3>
      <p class="login-panel-card__intro">
        Nur für <strong>XP &amp; Streak</strong> auf Handy und Computer.
        <strong>Kein Passwort</strong> — du bekommst einen Link per E-Mail.
        Hier <em>nicht</em> Premium kaufen!
      </p>
      <slot name="after-intro" />
      <div class="login-panel-card__row">
        <input
          v-model="magicEmail"
          type="email"
          class="login-panel-card__input"
          placeholder="deine@email.de"
        />
        <button
          type="button"
          class="login-panel__btn"
          :disabled="magicSubmitting"
          @click="submitMagicLink"
        >
          {{ magicSubmitting ? '…' : '📧 Link senden' }}
        </button>
      </div>
      <ol class="login-panel-card__how">
        <li>E-Mail eingeben</li>
        <li>«Link senden» tippen</li>
        <li>Link im Postfach antippen — fertig!</li>
      </ol>
      <p class="login-panel-card__aside">
        💎 Premium gekauft? Gehe zur
        <router-link :to="{ name: 'premium' }">Premium-Seite</router-link>
        und gib dort deinen Code ein (Schritt 2).
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
