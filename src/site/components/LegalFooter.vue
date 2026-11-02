<script setup>
import { useI18n } from '@/i18n/index.js';

const { t } = useI18n();
</script>

<template>
  <footer class="legal-footer">
    <div class="legal-footer__links">
      <router-link :to="{ name: 'legal', params: { slug: 'agb' } }">{{ t('common.agb') }}</router-link>
      <router-link :to="{ name: 'legal', params: { slug: 'datenschutz' } }">{{ t('common.privacy') }}</router-link>
      <router-link :to="{ name: 'legal', params: { slug: 'impressum' } }">{{ t('common.imprint') }}</router-link>
    </div>
    <div class="legal-footer__copy">{{ t('common.copyright') }}</div>
  </footer>
</template>
