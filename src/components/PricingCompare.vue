<script setup>
/**
 * Collapsible Gratis / Basis / Premium comparison table.
 */

import { computed, onMounted, ref } from 'vue';

import { PRICES_EUR } from '@/data/payment.js';
import { useI18n } from '@/i18n/index.js';

const detailsRef = ref(null);

const { t } = useI18n();

const basisPriceLabel = computed(() =>
  PRICES_EUR.basis.toFixed(2).replace('.', ','),
);
const premiumPriceLabel = computed(() => String(PRICES_EUR['1month']));

const rows = computed(() => [
  {
    label: t('landing.pricing.noLimit'),
    free: t('landing.pricing.freeLimit'),
    basis: '✅',
    premium: '✅',
  },
  { label: t('landing.pricing.levels'), free: '✅', basis: '✅', premium: '✅' },
  { label: t('landing.pricing.streak'), free: '✅', basis: '✅', premium: '✅' },
  {
    label: t('landing.pricing.errorAnalysis'),
    free: '❌',
    basis: '✅',
    premium: '✅',
  },
  {
    label: t('landing.pricing.byTopic'),
    free: '❌',
    basis: '❌',
    premium: '✅',
  },
  {
    label: t('landing.pricing.placementTest'),
    free: '❌',
    basis: '❌',
    premium: '✅',
  },
  {
    label: t('landing.pricing.grammarTips'),
    free: '❌',
    basis: '❌',
    premium: '✅',
  },
  {
    label: t('landing.pricing.streakFreeze'),
    free: '❌',
    basis: '❌',
    premium: '✅',
  },
  {
    label: t('landing.pricing.dictionary'),
    free: '❌',
    basis: '❌',
    premium: '✅',
  },
]);

onMounted(() => {
  if (window.location.hash === '#tarife') {
    detailsRef.value?.setAttribute('open', '');
  }
});
</script>

<template>
  <details
    id="tarife"
    ref="detailsRef"
    class="pricing-compare"
    :aria-label="t('landing.compareAria')"
  >
    <summary class="pricing-compare__summary">
      <div class="pricing-compare__row">
        <span class="pricing-compare__title">{{ t('landing.compareTitle') }}</span>
        <span class="pricing-compare__count">{{ t('landing.compareCount') }}</span>
      </div>

      <div
        class="pricing-compare__bar"
        role="progressbar"
        aria-valuenow="3"
        aria-valuemin="0"
        aria-valuemax="3"
        :aria-label="t('landing.compareAria')"
      >
        <div class="pricing-compare__fill" style="width: 100%" />
      </div>

      <p class="pricing-compare__hint">{{ t('landing.compareHint') }}</p>
    </summary>

    <div class="pricing-compare__body">
      <div class="pricing-compare__row pricing-compare__row--head">
        <div class="pricing-compare__cell pricing-compare__cell--label"></div>
        <div class="pricing-compare__cell pricing-compare__cell--tier pricing-compare__cell--muted">
          {{ t('common.free') }}
        </div>
        <div class="pricing-compare__cell pricing-compare__cell--tier">
          ⏱️ {{ t('common.basis') }}
        </div>
        <div class="pricing-compare__cell pricing-compare__cell--tier pricing-compare__cell--premium">
          💎 {{ t('common.premium') }}
        </div>
      </div>

      <div
        v-for="row in rows"
        :key="row.label"
        class="pricing-compare__row"
      >
        <div class="pricing-compare__cell pricing-compare__cell--label">{{ row.label }}</div>
        <div class="pricing-compare__cell pricing-compare__cell--muted">{{ row.free }}</div>
        <div class="pricing-compare__cell pricing-compare__cell--ok">{{ row.basis }}</div>
        <div class="pricing-compare__cell pricing-compare__cell--ok pricing-compare__cell--premium">
          {{ row.premium }}
        </div>
      </div>

      <div class="pricing-compare__row pricing-compare__row--price">
        <div class="pricing-compare__cell pricing-compare__cell--label">{{ t('common.price') }}</div>
        <div class="pricing-compare__cell pricing-compare__cell--muted">{{ t('common.gratis') }}</div>
        <div class="pricing-compare__cell pricing-compare__cell--price">
          {{ basisPriceLabel }}€<span class="pricing-compare__sub">{{ t('common.once') }}</span>
        </div>
        <div class="pricing-compare__cell pricing-compare__cell--price pricing-compare__cell--premium">
          {{ premiumPriceLabel }}€<span class="pricing-compare__sub">{{ t('common.perMonth') }}</span>
        </div>
      </div>
    </div>
  </details>
</template>
