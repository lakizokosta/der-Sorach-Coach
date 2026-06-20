<script setup>
/**
 * App — top-level layout. Renders the active route plus persistent FABs
 * (login on Premium Hub, Support / Kontakt) and their modals.
 */

import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import ContactModal from '@/components/ContactModal.vue';
import LoginModal from '@/components/LoginModal.vue';
import BootstrapHandler from '@/components/BootstrapHandler.vue';
import LocaleSwitcher from '@/components/LocaleSwitcher.vue';
import { useAuth } from '@/composables/useAuth.js';
import { usePremium } from '@/composables/usePremium.js';
import { hasBackend } from '@/utils/api.js';
import { useI18n } from '@/i18n/index.js';

const route = useRoute();
const { isLoggedIn } = useAuth();
const { isPremium } = usePremium();
const { t } = useI18n();

const showContact = ref(false);
const showLogin = ref(false);

const showLoginFab = computed(
  () =>
    hasBackend() &&
    route.name === 'premium' &&
    route.query.hub === '1' &&
    !isLoggedIn.value &&
    !isPremium.value,
);
</script>

<template>
  <BootstrapHandler />

  <LocaleSwitcher />

  <router-view />

  <div class="fab-stack">
    <button
      v-if="showLoginFab"
      type="button"
      class="app-fab app-fab--login"
      :aria-label="t('login.fabLabel')"
      @click="showLogin = true"
    >
      <span class="app-fab__icon" aria-hidden="true">🔑</span>
      <span class="app-fab__label">{{ t('login.fabLabel') }}</span>
    </button>

    <button
      type="button"
      class="app-fab app-fab--contact"
      :aria-label="t('common.openContact')"
      @click="showContact = true"
    >
      <span class="app-fab__icon" aria-hidden="true">📧</span>
      <span class="app-fab__label">{{ t('common.support') }}</span>
    </button>
  </div>

  <LoginModal v-if="showLogin" @close="showLogin = false" />
  <ContactModal v-if="showContact" @close="showContact = false" />
</template>
