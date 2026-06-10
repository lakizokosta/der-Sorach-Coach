<script setup>
/**
 * App — top-level layout. Renders the active route plus the persistent
 * "Support / Kontakt" floating action button and its modal.
 */

import { ref } from 'vue';
import ContactModal from '@/components/ContactModal.vue';
import BootstrapHandler from '@/components/BootstrapHandler.vue';
import LocaleSwitcher from '@/components/LocaleSwitcher.vue';
import { useI18n } from '@/i18n/index.js';

const showContact = ref(false);
const { t } = useI18n();
</script>

<template>
  <BootstrapHandler />

  <LocaleSwitcher />

  <router-view />

  <button
    type="button"
    class="contact-fab"
    :aria-label="t('common.openContact')"
    @click="showContact = true"
  >
    <span style="font-size: 18px;">📧</span>
    <span class="label">{{ t('common.support') }}</span>
  </button>

  <ContactModal v-if="showContact" @close="showContact = false" />
</template>
