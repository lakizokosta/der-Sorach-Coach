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
import { useLoginModal } from '@/composables/useLoginModal.js';
import { useI18n } from '@/i18n/index.js';

const route = useRoute();
const { isLoggedIn } = useAuth();
const { isPremium, isBasis, entitlementsReady, backendDegraded } = usePremium();
const { t } = useI18n();

const bootstrapping = computed(() => hasBackend() && !entitlementsReady.value);

const showContact = ref(false);
const { showLogin, openLogin, closeLogin } = useLoginModal();

const showLoginFab = computed(() => {
  if (!hasBackend() || isLoggedIn.value || isPremium.value) return false;
  if (route.name === 'trainer') return false;
  if (route.name === 'landing') return !isBasis.value;
  return route.name === 'premium' && route.query.hub === '1';
});
</script>

<template>
  <BootstrapHandler />

  <div
    v-if="bootstrapping"
    class="app-bootstrap-overlay"
    role="status"
    aria-live="polite"
  >
    <div class="app-bootstrap-overlay__card">
      <div class="app-bootstrap-overlay__icon" aria-hidden="true">🔒</div>
      <p class="app-bootstrap-overlay__text">{{ t('common.checkingAccess') }}</p>
    </div>
  </div>

  <div
    v-if="backendDegraded.active"
    class="app-backend-banner"
    role="status"
    aria-live="polite"
  >
    <span class="app-backend-banner__icon" aria-hidden="true">⚠️</span>
    <span>{{ backendDegraded.message || t('common.backendDegraded') }}</span>
  </div>

  <LocaleSwitcher />

  <router-view />

  <div class="fab-stack">
    <button
      v-if="showLoginFab"
      type="button"
      class="app-fab app-fab--login"
      :aria-label="t('login.fabLabel')"
      @click="openLogin"
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

  <LoginModal v-if="showLogin" @close="closeLogin" />
  <ContactModal v-if="showContact" @close="showContact = false" />
</template>
