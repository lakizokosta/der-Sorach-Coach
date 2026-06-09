<script setup>
/**
 * Legal — AGB, Datenschutz, Impressum (verbatim HTML from docs/extra.md).
 */

import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import LzdLogo from '@/components/LzdLogo.vue';
import LegalFooter from '@/components/LegalFooter.vue';
import { getLegalPage, LEGAL_SLUGS } from '@/data/legalContent.js';

const route = useRoute();
const router = useRouter();

const slug = computed(() => String(route.params.slug || ''));
const page = computed(() => getLegalPage(slug.value));

const navLabel = {
  agb: 'AGB',
  datenschutz: 'Datenschutz',
  impressum: 'Impressum',
};

function goHome() {
  router.push({ name: 'landing' });
}
</script>

<template>
  <div class="app-shell legal-page">
    <LzdLogo small />

    <div v-if="page" class="legal-card card">
      <button type="button" class="legal-back" @click="goHome">← Zurück</button>

      <nav class="legal-nav" aria-label="Rechtliche Seiten">
        <router-link
          v-for="s in LEGAL_SLUGS"
          :key="s"
          :to="{ name: 'legal', params: { slug: s } }"
          class="legal-nav__link"
          :class="{ active: s === slug }"
        >
          {{ navLabel[s] }}
        </router-link>
      </nav>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <article class="legal-body legal-body--html" v-html="page.html" />
    </div>

    <div v-else class="legal-card card">
      <p>Seite nicht gefunden.</p>
      <button type="button" class="legal-back" @click="goHome">← Zurück zur Startseite</button>
    </div>

    <LegalFooter />
  </div>
</template>
