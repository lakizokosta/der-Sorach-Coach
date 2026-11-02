<script setup>
/**
 * Stripe / PayPal wordmarks on checkout buttons (hosted checkout links).
 */

defineProps({
  provider: {
    type: String,
    required: true,
    validator: (v) => v === 'stripe' || v === 'paypal',
  },
});
</script>

<template>
  <img
    :src="provider === 'stripe' ? '/payment/stripe-white.svg' : '/payment/paypal.svg'"
    alt=""
    class="payment-provider-logo"
    :class="`payment-provider-logo--${provider}`"
  />
</template>
