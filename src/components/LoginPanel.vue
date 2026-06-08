<script setup>
/**
 * LoginPanel — magic-link login + optional code activation on the landing page.
 *
 * Mirrors the original Blogger `user-login-area`: learners log in with
 * their e-mail so XP and streak sync across devices.
 */

import { ref } from 'vue';

import { useAuth } from '@/composables/useAuth.js';
import { usePremium } from '@/composables/usePremium.js';
import { loadString, saveString } from '@/composables/useStorage.js';
import { hasBackend, requestMagicLink } from '@/utils/api.js';
import { activateCode } from '@/composables/usePremium.js';

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
    magicStatus.value = { text: '✖ Bitte gültige Email eingeben.', color: '#ed4545' };
    return;
  }
  magicSubmitting.value = true;
  magicStatus.value = { text: 'Link wird gesendet…', color: '#888' };
  saveString(USER_EMAIL_KEY, value);

  const res = await requestMagicLink(value);
  magicSubmitting.value = false;

  if (res && res.ok) {
    magicStatus.value = {
      text: `✔ Link gesendet! Schau in dein Postfach (${value}).`,
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
  <div v-if="backendOn" style="max-width: 340px; margin: 8px auto 12px auto;">
    <!-- Logged in + Premium/Basis -->
    <div
      v-if="isLoggedIn && (isPremium || isBasis)"
      style="
        background: linear-gradient(135deg, #ffd700, #ffb700);
        border-radius: 999px;
        padding: 11px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
      "
    >
      <div
        style="
          font-size: 14px;
          font-weight: 900;
          color: #000;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        "
      >
        👤 {{ auth.email }}
      </div>
      <button
        type="button"
        @click="signOut"
        style="
          border: none;
          background: rgba(0, 0, 0, 0.12);
          color: #000;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          padding: 4px 10px;
          border-radius: 999px;
          flex-shrink: 0;
        "
      >
        Abmelden
      </button>
    </div>

    <!-- Premium via code, not logged in — encourage login -->
    <div
      v-else-if="(isPremium || isBasis) && !isLoggedIn"
      style="
        background: #f9f0fc;
        border: 1.5px solid #e0d0f0;
        border-radius: 16px;
        padding: 12px 16px;
      "
    >
      <div style="font-size: 12px; color: #888; margin-bottom: 8px; text-align: center;">
        📱 Einloggen, um Streak &amp; Fortschritt auf allen Geräten zu speichern.
      </div>
      <div style="display: flex; gap: 6px;">
        <input
          v-model="magicEmail"
          type="email"
          placeholder="deine@email.de"
          style="
            flex: 1;
            padding: 9px 12px;
            border: 1px solid #d9b0e8;
            border-radius: 10px;
            font-size: 13px;
            min-width: 0;
            box-sizing: border-box;
          "
        />
        <button
          type="button"
          :disabled="magicSubmitting"
          @click="submitMagicLink"
          style="
            padding: 9px 14px;
            border: none;
            border-radius: 10px;
            background: #ab4dbb;
            color: #fff;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            white-space: nowrap;
          "
        >
          {{ magicSubmitting ? '…' : 'Einloggen' }}
        </button>
      </div>
      <div
        v-if="magicStatus.text"
        style="font-size: 11px; margin-top: 6px; min-height: 14px; text-align: center;"
        :style="{ color: magicStatus.color }"
      >
        {{ magicStatus.text }}
      </div>
    </div>

    <!-- Logged in, no premium yet — activate code -->
    <div
      v-else-if="isLoggedIn"
      style="
        background: #f9f0fc;
        border: 1.5px solid #ce93d8;
        border-radius: 16px;
        padding: 12px 16px;
      "
    >
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          gap: 8px;
        "
      >
        <div
          style="
            font-size: 13px;
            font-weight: 700;
            color: #7b2d8b;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          "
        >
          👤 {{ auth.email }}
        </div>
        <button
          type="button"
          @click="signOut"
          style="
            border: none;
            background: none;
            color: #999;
            font-size: 11px;
            cursor: pointer;
            padding: 0;
            flex-shrink: 0;
          "
        >
          Abmelden
        </button>
      </div>
      <div style="font-size: 12px; color: #888; margin-bottom: 8px;">
        🔑 Aktivierungscode eingeben:
      </div>
      <div style="display: flex; gap: 6px;">
        <input
          v-model="code"
          type="text"
          placeholder="z.B. BASIS_… oder TRIAL-…"
          style="
            flex: 1;
            padding: 9px 12px;
            border: 1px solid #d9b0e8;
            border-radius: 10px;
            font-size: 13px;
            min-width: 0;
            text-transform: uppercase;
            box-sizing: border-box;
          "
        />
        <button
          type="button"
          :disabled="codeSubmitting"
          @click="submitCode"
          style="
            padding: 9px 14px;
            border: none;
            border-radius: 10px;
            background: #ab4dbb;
            color: #fff;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            white-space: nowrap;
          "
        >
          {{ codeSubmitting ? '…' : 'Aktivieren' }}
        </button>
      </div>
      <div
        v-if="codeStatus.text"
        style="font-size: 11px; margin-top: 6px; min-height: 14px; text-align: center;"
        :style="{ color: codeStatus.color }"
      >
        {{ codeStatus.text }}
      </div>
    </div>

    <!-- Not logged in -->
    <div
      v-else
      style="
        background: #f9f0fc;
        border: 1.5px solid #e0d0f0;
        border-radius: 16px;
        padding: 12px 16px;
      "
    >
      <div style="font-size: 12px; color: #888; margin-bottom: 8px; text-align: center;">
        Mit deiner Email einloggen — Fortschritt auf allen Geräten speichern.
      </div>
      <div style="display: flex; gap: 6px;">
        <input
          v-model="magicEmail"
          type="email"
          placeholder="deine@email.de"
          style="
            flex: 1;
            padding: 9px 12px;
            border: 1px solid #d9b0e8;
            border-radius: 10px;
            font-size: 13px;
            min-width: 0;
            box-sizing: border-box;
          "
        />
        <button
          type="button"
          :disabled="magicSubmitting"
          @click="submitMagicLink"
          style="
            padding: 9px 14px;
            border: none;
            border-radius: 10px;
            background: #ab4dbb;
            color: #fff;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            white-space: nowrap;
          "
        >
          {{ magicSubmitting ? '…' : 'Einloggen' }}
        </button>
      </div>
      <div
        v-if="magicStatus.text"
        style="font-size: 11px; margin-top: 6px; min-height: 14px; text-align: center;"
        :style="{ color: magicStatus.color }"
      >
        {{ magicStatus.text }}
      </div>
    </div>
  </div>
</template>
