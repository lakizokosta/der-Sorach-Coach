<script setup>
import PaymentProviderLogo from '@/components/PaymentProviderLogo.vue';

defineProps({
  provider: {
    type: String,
    required: true,
    validator: (v) => v === 'stripe' || v === 'paypal',
  },
  main: { type: String, required: true },
  sub: { type: String, default: '' },
});
</script>

<template>
  <span class="payment-btn-label">
    <PaymentProviderLogo :provider="provider" />
    <span class="payment-btn-label__copy">
      <span class="payment-btn-label__main">{{ main }}</span>
      <span v-if="sub" class="payment-btn-label__sub">{{ sub }}</span>
    </span>
  </span>
</template>
