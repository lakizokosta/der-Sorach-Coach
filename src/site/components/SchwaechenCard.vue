<script setup>
/**
 * SchwaechenCard — collapsible entry point for Schwächen-Modus on the landing page.
 */

import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { usePremium } from '@/composables/usePremium.js';
import { useXp } from '@/composables/useXp.js';
import { getWeakestTopics } from '@/utils/weakTopics.js';
import { useI18n } from '@/i18n/index.js';

const router = useRouter();
const { t } = useI18n();
const { isPremium } = usePremium();
const { state: xp } = useXp();

const emit = defineEmits(['locked']);

const weakTopics = computed(() =>
  getWeakestTopics(xp.topicWrong, xp.topicCorrect, 3),
);

const hasWeakTopics = computed(() => weakTopics.value.length > 0);

const totalErrors = computed(() =>
  weakTopics.value.reduce((n, topic) => n + topic.wrongCount, 0),
);

const summaryCount = computed(() => {
  if (!isPremium.value) return t('schwaechen.countPremium');
  if (!hasWeakTopics.value) return t('schwaechen.countEmpty');
  return t('schwaechen.countSummary', {
    errors: totalErrors.value,
    topics: weakTopics.value.length,
  });
});

const progressPct = computed(() => {
  if (!isPremium.value || !hasWeakTopics.value) return 0;
  return Math.min(100, Math.round((totalErrors.value / 30) * 100));
});

const summaryHint = computed(() => {
  if (!isPremium.value) return t('schwaechen.hintLocked');
  if (!hasWeakTopics.value) return t('schwaechen.hintEmpty');
  return t('schwaechen.hintReady');
});

function startSchwaechen() {
  if (!isPremium.value || !hasWeakTopics.value) return;
  router.push({ name: 'trainer', query: { mode: 'schwaechen' } });
}

function unlockPremium() {
  emit('locked');
}

function goTopics() {
  router.push({ name: 'landing' });
}
</script>

<template>
  <details
    class="schwaechen-card"
    :class="{ 'schwaechen-card--locked': !isPremium }"
    :aria-label="t('schwaechen.aria')"
  >
    <summary class="schwaechen-card__summary">
      <div class="schwaechen-card__row">
        <span class="schwaechen-card__title">{{ t('schwaechen.title') }}</span>
        <span class="schwaechen-card__count">{{ summaryCount }}</span>
      </div>

      <div
        class="schwaechen-card__bar"
        role="progressbar"
        :aria-valuenow="progressPct"
        :aria-valuemin="0"
        :aria-valuemax="100"
      >
        <div class="schwaechen-card__fill" :style="{ width: `${progressPct}%` }" />
      </div>

      <p class="schwaechen-card__hint-summary">{{ summaryHint }}</p>
    </summary>

    <div class="schwaechen-card__body">
      <template v-if="!isPremium">
        <p class="schwaechen-card__hint">{{ t('schwaechen.bodyLocked') }}</p>
        <button
          type="button"
          class="schwaechen-card__cta schwaechen-card__cta--upsell"
          @click="unlockPremium"
        >
          {{ t('schwaechen.unlock') }}
        </button>
      </template>

      <template v-else-if="!hasWeakTopics">
        <p class="schwaechen-card__hint">{{ t('schwaechen.bodyNoErrors') }}</p>
        <button
          type="button"
          class="schwaechen-card__cta schwaechen-card__cta--ghost"
          @click="goTopics"
        >
          {{ t('schwaechen.toTopics') }}
        </button>
      </template>

      <template v-else>
        <p class="schwaechen-card__hint">{{ t('schwaechen.listTitle') }}</p>
        <ul class="schwaechen-card__list">
          <li v-for="topic in weakTopics" :key="`${topic.level}-${topic.key}`">
            <span class="schwaechen-card__topic">{{ topic.level }} · {{ topic.name }}</span>
            <span class="schwaechen-card__errors">
              {{ t('schwaechen.errorCount', { count: topic.wrongCount }) }}
            </span>
          </li>
        </ul>
        <button type="button" class="schwaechen-card__cta" @click="startSchwaechen">
          {{ t('schwaechen.train') }}
        </button>
      </template>
    </div>
  </details>
</template>
