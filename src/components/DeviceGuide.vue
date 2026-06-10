<script setup>
import { useI18n } from '@/i18n/index.js';

defineProps({
  variant: {
    type: String,
    default: 'buy',
    validator: (v) => ['buy', 'basis', 'landing', 'compact'].includes(v),
  },
});

const { t } = useI18n();
</script>

<template>
  <div
    class="device-guide"
    :class="{
      'device-guide--landing': variant === 'landing',
      'device-guide--compact': variant === 'compact',
    }"
  >
    <template v-if="variant === 'buy' || variant === 'basis'">
      <div class="device-guide__title">{{ t('deviceGuide.title') }}</div>
      <ol class="device-guide__steps">
        <li>
          <strong>{{ t('deviceGuide.stepPayBold') }}</strong> —
          {{ t('deviceGuide.stepPayRest') }}
        </li>
        <li>{{ t('deviceGuide.stepFirst') }}</li>
        <li>
          <strong>{{ t('deviceGuide.stepOther') }}</strong>
          <router-link :to="{ name: 'landing' }">{{ t('common.homepage') }}</router-link>
          {{ t('deviceGuide.stepOtherLink') }}
          <em>{{
            variant === 'basis'
              ? t('deviceGuide.stepOtherEndBasis')
              : t('deviceGuide.stepOtherEndPremium')
          }}</em>
        </li>
      </ol>
    </template>

    <template v-else-if="variant === 'landing'">
      <div class="device-guide__title">{{ t('deviceGuide.newDeviceTitle') }}</div>
      <p class="device-guide__text">{{ t('deviceGuide.newDeviceText') }}</p>
    </template>

    <p v-else class="device-guide__text">
      {{ t('deviceGuide.compactBefore') }}
      <router-link :to="{ name: 'landing' }">{{ t('common.homepage') }}</router-link>
      {{ t('deviceGuide.compactAfter') }}
    </p>
  </div>
</template>
