<script setup>
/**
 * Bottom sheet for the free-tier conversion funnel (Concept A).
 * Variants: streak milestone, questions milestone, quick Premium checkout.
 */

import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import PaymentButtonLabel from '@/components/PaymentButtonLabel.vue';
import { loadString, saveString } from '@/composables/useStorage.js';
import {
  PRICES_EUR,
  buildStripePremiumUrl,
  buildStripeBasisUrl,
  buildPaypalUrl,
} from '@/data/payment.js';
import { useI18n } from '@/i18n/index.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** @type {'streak10'|'questions15'|'checkout'|'niveau'} */
  variant: { type: String, default: 'checkout' },
  plan: { type: String, default: '3months' },
});

const emit = defineEmits(['update:modelValue', 'later']);

const router = useRouter();
const { t } = useI18n();

const USER_EMAIL_KEY = 'userEmail';

const email = ref(loadString(USER_EMAIL_KEY) || '');
const agbChecked = ref(false);
const buyStatus = ref({ text: '', color: '' });
const showCheckout = ref(false);

watch(
  () => props.modelValue,
  (open) => {
    if (!open) {
      showCheckout.value = false;
      buyStatus.value = { text: '', color: '' };
      return;
    }
    showCheckout.value = props.variant === 'checkout';
    email.value = loadString(USER_EMAIL_KEY) || email.value;
  },
);

function close() {
  emit('update:modelValue', false);
}

function dismissLater() {
  emit('later');
  close();
}

function openCheckoutForm() {
  showCheckout.value = true;
}

function validateCheckout() {
  const value = (email.value || '').trim();
  if (!value.includes('@')) {
    buyStatus.value = { text: t('premium.errEmailForCode'), color: '#ed4545' };
    return false;
  }
  if (!agbChecked.value) {
    buyStatus.value = { text: t('premium.errAgb'), color: '#ed4545' };
    return false;
  }
  saveString(USER_EMAIL_KEY, value);
  return true;
}

function payPremiumStripe() {
  if (!validateCheckout()) return;
  window.open(buildStripePremiumUrl(props.plan, email.value.trim()), '_blank', 'noopener');
  buyStatus.value = {
    text: t('premium.stripeOpened', { email: email.value.trim() }),
    color: '#635BFF',
  };
}

function payPremiumPaypal() {
  if (!validateCheckout()) return;
  window.open(buildPaypalUrl(props.plan), '_blank', 'noopener');
  buyStatus.value = {
    text: t('premium.paypalOpened', { email: email.value.trim() }),
    color: '#0070BA',
  };
}

function payBasisStripe() {
  if (!validateCheckout()) return;
  window.open(buildStripeBasisUrl(email.value.trim()), '_blank', 'noopener');
  buyStatus.value = {
    text: t('premium.basisStripeOpened', { email: email.value.trim() }),
    color: '#635BFF',
  };
}

function openFullPremium() {
  close();
  const target = {
    name: 'premium',
    query: { hub: '1', plan: props.plan },
  };
  const route = router.currentRoute.value;
  const onHub =
    route.name === 'premium' && String(route.query.hub || '') === '1';
  if (onHub) {
    requestAnimationFrame(() => {
      document
        .querySelector('.premium-buy-card')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return;
  }
  router.push(target);
}
</script>

<template>
  <Teleport to="body">
    <Transition name="funnel-sheet">
      <div
        v-if="modelValue"
        class="funnel-sheet-backdrop"
        role="presentation"
        @click="dismissLater"
      />
    </Transition>

    <Transition name="funnel-sheet">
      <div
        v-if="modelValue"
        class="funnel-sheet"
        role="dialog"
        aria-modal="true"
        :aria-label="t('funnel.sheetAria')"
        @click.stop
      >
        <button
          type="button"
          class="funnel-sheet__close"
          :aria-label="t('funnel.later')"
          @click="dismissLater"
        >
          ×
        </button>

        <template v-if="!showCheckout && variant === 'streak10'">
          <div class="funnel-sheet__emoji">🔥</div>
          <h2 class="funnel-sheet__title">{{ t('funnel.streakTitle') }}</h2>
          <p class="funnel-sheet__body">{{ t('funnel.streakBody', { count: 10 }) }}</p>
          <button type="button" class="funnel-sheet__cta" @click="openCheckoutForm">
            {{ t('funnel.ctaPremium3') }}
          </button>
          <button type="button" class="funnel-sheet__ghost" @click="dismissLater">
            {{ t('funnel.later') }}
          </button>
        </template>

        <template v-else-if="!showCheckout && variant === 'questions15'">
          <div class="funnel-sheet__emoji">⭐</div>
          <h2 class="funnel-sheet__title">{{ t('funnel.questionsTitle') }}</h2>
          <p class="funnel-sheet__body">{{ t('funnel.questionsBody', { count: 15 }) }}</p>
          <button type="button" class="funnel-sheet__cta" @click="openCheckoutForm">
            {{ t('funnel.ctaPremium3') }}
          </button>
          <button type="button" class="funnel-sheet__ghost" @click="dismissLater">
            {{ t('funnel.later') }}
          </button>
        </template>

        <template v-else-if="!showCheckout && variant === 'niveau'">
          <div class="funnel-sheet__emoji">📊</div>
          <h2 class="funnel-sheet__title">{{ t('funnel.niveauTitle') }}</h2>
          <p class="funnel-sheet__body">{{ t('funnel.niveauBody') }}</p>
          <button type="button" class="funnel-sheet__cta" @click="openCheckoutForm">
            {{ t('funnel.ctaPremium3') }}
          </button>
          <button type="button" class="funnel-sheet__ghost" @click="dismissLater">
            {{ t('funnel.later') }}
          </button>
        </template>

        <template v-else>
          <h2 class="funnel-sheet__title">{{ t('funnel.checkoutTitle') }}</h2>
          <p class="funnel-sheet__plan">
            💎 {{ t('premium.plan3') }}
            <span class="funnel-sheet__badge">{{ t('funnel.discountBadge') }}</span>
          </p>
          <p class="funnel-sheet__body funnel-sheet__body--compact">
            {{ t('funnel.checkoutHint') }}
          </p>

          <label class="funnel-sheet__field">
            <span class="funnel-sheet__label">{{ t('premium.emailLabel') }}</span>
            <input
              v-model="email"
              type="email"
              autocomplete="email"
              :placeholder="t('common.emailPlaceholder')"
              class="funnel-sheet__input"
            />
          </label>

          <label class="funnel-sheet__agb">
            <input v-model="agbChecked" type="checkbox" class="funnel-sheet__agb-check" />
            <span>
              {{ t('common.agbAcceptBefore') }}
              <router-link :to="{ name: 'legal', params: { slug: 'agb' } }">
                {{ t('common.agb') }}
              </router-link>
              {{ t('common.agbAcceptAfter') }}
            </span>
          </label>

          <button type="button" class="funnel-sheet__stripe" @click="payPremiumStripe">
            <PaymentButtonLabel
              provider="stripe"
              :main="t('premium.payStripe')"
              :sub="t('premium.stripeSub')"
            />
          </button>

          <button type="button" class="funnel-sheet__paypal" @click="payPremiumPaypal">
            <PaymentButtonLabel
              provider="paypal"
              :main="t('premium.payPaypal')"
              :sub="t('premium.paypalSub')"
            />
          </button>

          <button type="button" class="funnel-sheet__basis" @click="payBasisStripe">
            ⏱️ {{ t('funnel.basisQuick', { price: PRICES_EUR.basis }) }}
          </button>

          <p v-if="buyStatus.text" class="funnel-sheet__status" :style="{ color: buyStatus.color }">
            {{ buyStatus.text }}
          </p>

          <button type="button" class="funnel-sheet__link" @click="openFullPremium">
            {{ t('funnel.allPlans') }}
          </button>
          <button type="button" class="funnel-sheet__ghost" @click="dismissLater">
            {{ t('funnel.later') }}
          </button>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>
