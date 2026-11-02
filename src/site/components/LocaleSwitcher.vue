<script setup>
import { useI18n } from '@/i18n/index.js';

const { locale, setLocale, localeOptions, localeLabels, t } = useI18n();

const titles = {
  de: 'Deutsch',
  ru: 'Русский',
  en: 'English',
};
</script>

<template>
  <div class="locale-switcher" role="group" :aria-label="t('common.localeSwitcherAria')">
    <button
      v-for="code in localeOptions"
      :key="code"
      type="button"
      class="locale-switcher__btn"
      :class="{ 'locale-switcher__btn--active': locale === code }"
      :title="titles[code]"
      :aria-pressed="locale === code"
      @click="setLocale(code)"
    >
      {{ localeLabels[code] }}
    </button>
  </div>
</template>
