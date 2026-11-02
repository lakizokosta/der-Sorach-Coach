<script setup>
/**
 * LoginModal — magic-link login in a modal (Premium Hub FAB).
 */

import LoginPanel from '@/components/LoginPanel.vue';
import { useI18n } from '@/i18n/index.js';

const emit = defineEmits(['close']);
const { t } = useI18n();

function backdropClick(event) {
  if (event.target === event.currentTarget) emit('close');
}
</script>

<template>
  <div class="modal-backdrop" @click="backdropClick">
    <div class="modal-card modal-card--login">
      <div class="modal-card__head">
        <h3 class="modal-card__title">{{ t('landing.sectionLoginOnly') }}</h3>
        <button
          type="button"
          class="modal-card__close"
          :aria-label="t('contact.close')"
          @click="emit('close')"
        >
          &times;
        </button>
      </div>
      <p class="modal-card__intro">{{ t('landing.sectionLoginOnlyHint') }}</p>
      <LoginPanel prominent />
    </div>
  </div>
</template>
