<script setup>
/**
 * Niveau-Test entry — locked gray for Free/Basis, active for Premium.
 */

import { useRouter } from 'vue-router';

import { usePremium } from '@/composables/usePremium.js';
import { useCefrLevel } from '@/composables/useCefrLevel.js';
import { useI18n } from '@/i18n/index.js';

const emit = defineEmits(['locked']);

const router = useRouter();
const { t } = useI18n();
const { isPremium } = usePremium();
const { level: cefrLevel } = useCefrLevel();

function onClick() {
  if (!isPremium.value) {
    emit('locked');
    return;
  }
  router.push({ name: 'trainer', query: { mode: 'placement' } });
}
</script>

<template>
  <div class="landing-niveau-block">
    <button
      type="button"
      class="niveau-test-btn"
      :class="{
        'level-card': isPremium,
        'niveau-test-btn--unlocked': isPremium,
        'niveau-test-btn--locked': !isPremium,
      }"
      @click="onClick"
    >
      <span class="niveau-test-btn__label">
        {{
          cefrLevel
            ? t('landing.niveauRetest', { level: cefrLevel })
            : t('landing.niveauTest')
        }}
      </span>
      <span v-if="!isPremium" class="niveau-test-btn__badge">💎 {{ t('common.premium') }}</span>
    </button>
    <p class="niveau-test-btn__hint">
      {{ isPremium ? t('landing.niveauHintPremium') : t('landing.niveauHintLocked') }}
    </p>
  </div>
</template>
