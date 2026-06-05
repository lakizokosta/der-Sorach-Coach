<script setup>
/**
 * ContactModal — a simple contact form rendered inside a modal overlay.
 *
 * In the original trainer this posted to a Google Apps Script endpoint.
 * In this rebuild the form runs in "demo mode": it validates inputs,
 * displays a confirmation message, and resets the form. Hook it into a
 * real backend by replacing the body of `submit()`.
 *
 * Emits:
 *   - 'close' — when the user clicks the × button or the backdrop.
 */

import { ref } from 'vue';

const emit = defineEmits(['close']);

const name = ref('');
const email = ref('');
const message = ref('');
const status = ref({ text: '', color: '#888' });

/** Validates the form and shows a fake success notification (demo mode). */
function submit() {
  if (!message.value.trim()) {
    status.value = { text: 'Bitte gib eine Nachricht ein.', color: '#ed4545' };
    return;
  }
  status.value = { text: 'Wird gesendet...', color: '#888' };
  // Demo mode: pretend the request succeeded after a short delay.
  setTimeout(() => {
    status.value = { text: '✔ Nachricht gesendet (Demo)!', color: '#69c43b' };
    setTimeout(() => {
      name.value = '';
      email.value = '';
      message.value = '';
      status.value = { text: '', color: '#888' };
      emit('close');
    }, 1500);
  }, 600);
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
      >
        Nachricht senden
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
        Wir antworten in der Regel innerhalb von 24 Stunden. (Demo-Modus —
        keine echten Nachrichten werden versendet.)
      </p>
    </div>
  </div>
</template>
