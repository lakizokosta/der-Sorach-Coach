<script setup>
/**
 * ContactModal — a simple contact form rendered inside a modal overlay.
 *
 * Submits to the Apps Script `sendContactForm` endpoint when a
 * backend URL is configured (see `src/data/payment.js`). With no
 * backend configured, the form falls back to a local confirmation so
 * the SPA stays usable offline.
 *
 * Emits:
 *   - 'close' — when the user clicks the × button or the backdrop.
 */

import { ref } from 'vue';
import { hasBackend, sendContactForm } from '@/utils/api.js';
import { usePremium } from '@/composables/usePremium.js';
import { loadString, saveString } from '@/composables/useStorage.js';

const emit = defineEmits(['close']);

const { isPremium } = usePremium();

const USER_EMAIL_KEY = 'userEmail';
const name = ref('');
const email = ref(loadString(USER_EMAIL_KEY) || '');
const message = ref('');
const status = ref({ text: '', color: '#888' });
const submitting = ref(false);

/**
 * Validates the form and submits it. When `SCRIPT_URL` is set, the
 * payload is POSTed to the Apps Script; otherwise a local "demo"
 * confirmation is shown.
 */
async function submit() {
  if (submitting.value) return;
  if (!message.value.trim()) {
    status.value = { text: 'Bitte gib eine Nachricht ein.', color: '#ed4545' };
    return;
  }
  submitting.value = true;
  status.value = { text: 'Wird gesendet…', color: '#888' };
  const trimmedEmail = email.value.trim();
  if (trimmedEmail) saveString(USER_EMAIL_KEY, trimmedEmail);

  if (!hasBackend()) {
    setTimeout(() => {
      status.value = { text: '✔ Nachricht gesendet (Demo).', color: '#69c43b' };
      finishAndClose();
    }, 600);
    return;
  }

  const res = await sendContactForm({
    name: name.value.trim(),
    email: trimmedEmail,
    message: message.value.trim(),
    isPremium: !!isPremium.value,
    page: typeof location !== 'undefined' ? location.href : '',
  });
  submitting.value = false;

  if (res && res.ok) {
    status.value = { text: '✔ Nachricht gesendet. Danke!', color: '#69c43b' };
    finishAndClose();
  } else {
    status.value = {
      text: `✖ ${(res && res.error) || 'Senden fehlgeschlagen.'}`,
      color: '#ed4545',
    };
  }
}

/** Clears the form and closes the modal after a short delay. */
function finishAndClose() {
  submitting.value = false;
  setTimeout(() => {
    name.value = '';
    message.value = '';
    status.value = { text: '', color: '#888' };
    emit('close');
  }, 1500);
}

/** Closes the modal when the click target is the backdrop itself. */
function backdropClick(event) {
  if (event.target === event.currentTarget) emit('close');
}
</script>

<template>
  <div class="modal-backdrop" @click="backdropClick">
    <div class="modal-card">
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        "
      >
        <h3 style="margin: 0; color: #AB4DBB; font-size: 20px;">📧 Kontakt</h3>
        <button
          type="button"
          aria-label="Schließen"
          @click="$emit('close')"
          style="
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
          "
        >
          &times;
        </button>
      </div>

      <input v-model="name" type="text" placeholder="Dein Name" />
      <input v-model="email" type="email" placeholder="Deine Email-Adresse" />
      <textarea v-model="message" placeholder="Deine Nachricht..." rows="4" />

      <button
        type="button"
        :disabled="submitting"
        @click="submit"
        style="
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: #AB4DBB;
          color: #fff;
          font-weight: 900;
          font-size: 16px;
          cursor: pointer;
        "
        :style="submitting ? 'opacity: 0.6; cursor: progress;' : ''"
      >
        {{ submitting ? 'Wird gesendet…' : 'Nachricht senden' }}
      </button>

      <div
        style="
          font-size: 13px;
          margin-top: 12px;
          text-align: center;
          min-height: 18px;
        "
        :style="{ color: status.color }"
      >
        {{ status.text }}
      </div>

      <p style="font-size: 11px; color: #999; margin-top: 16px; text-align: center;">
        Wir antworten in der Regel innerhalb von 24 Stunden.
      </p>
    </div>
  </div>
</template>
