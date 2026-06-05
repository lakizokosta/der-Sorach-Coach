<script setup>
/**
 * App — top-level layout. Renders the active route plus the persistent
 * "Support / Kontakt" floating action button and its modal.
 */

import { ref } from 'vue';
import ContactModal from '@/components/ContactModal.vue';

const showContact = ref(false);
</script>

<template>
  <router-view />

  <button
    type="button"
    class="contact-fab"
    aria-label="Kontakt öffnen"
    @click="showContact = true"
  >
    <span style="font-size: 18px;">📧</span>
    <span class="label">Support / Kontakt</span>
  </button>

  <ContactModal v-if="showContact" @close="showContact = false" />
</template>
