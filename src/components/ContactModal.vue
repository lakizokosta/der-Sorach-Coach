<script setup>
/**
 * ContactModal — contact form in a modal overlay.
 */

import { ref } from 'vue';
import { hasBackend, sendContactForm } from '@/utils/api.js';
import { usePremium } from '@/composables/usePremium.js';
import { loadString, saveString } from '@/composables/useStorage.js';
import { useI18n } from '@/i18n/index.js';

const emit = defineEmits(['close']);
const { t } = useI18n();

const { isPremium } = usePremium();

const USER_EMAIL_KEY = 'userEmail';
const name = ref('');
const email = ref(loadString(USER_EMAIL_KEY) || '');
const message = ref('');
const status = ref({ text: '', color: '#888' });
const submitting = ref(false);

async function submit() {
  if (submitting.value) return;
  if (!message.value.trim()) {
    status.value = { text: t('contact.errEmptyMessage'), color: '#ed4545' };
    return;
  }
  submitting.value = true;
  status.value = { text: t('common.sending'), color: '#888' };
  const trimmedEmail = email.value.trim();
  if (trimmedEmail) saveString(USER_EMAIL_KEY, trimmedEmail);

  if (!hasBackend()) {
    setTimeout(() => {
      status.value = { text: t('contact.sentDemo'), color: '#69c43b' };
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
    status.value = { text: t('contact.sentOk'), color: '#69c43b' };
    finishAndClose();
  } else {
    status.value = {
      text: `✖ ${(res && res.error) || t('contact.errSend')}`,
      color: '#ed4545',
    };
  }
}

function finishAndClose() {
  submitting.value = false;
  setTimeout(() => {
    name.value = '';
    message.value = '';
    status.value = { text: '', color: '#888' };
    emit('close');
  }, 1500);
}

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
        <h3 style="margin: 0; color: #AB4DBB; font-size: 20px;">{{ t('contact.title') }}</h3>
        <button
          type="button"
          :aria-label="t('contact.close')"
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

      <input v-model="name" type="text" :placeholder="t('contact.name')" />
      <input v-model="email" type="email" :placeholder="t('contact.email')" />
      <textarea v-model="message" :placeholder="t('contact.message')" rows="4" />

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
        {{ submitting ? t('common.sending') : t('contact.submit') }}
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
        {{ t('contact.responseTime') }}
      </p>
    </div>
  </div>
</template>
