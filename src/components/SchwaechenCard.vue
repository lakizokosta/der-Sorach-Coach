<script setup>
/**
 * SchwaechenCard — collapsible entry point for Schwächen-Modus on the landing page.
 *
 * Picks the three topics with the most recorded wrong answers and
 * starts a mixed premium training session.
 */

import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { usePremium } from '@/composables/usePremium.js';
import { useXp } from '@/composables/useXp.js';
import { getWeakestTopics } from '@/utils/weakTopics.js';

const router = useRouter();
const { isPremium } = usePremium();
const { state: xp } = useXp();

const weakTopics = computed(() =>
  getWeakestTopics(xp.topicWrong, xp.topicCorrect, 3),
);

const hasWeakTopics = computed(() => weakTopics.value.length > 0);

const totalErrors = computed(() =>
  weakTopics.value.reduce((n, t) => n + t.wrongCount, 0),
);

const summaryCount = computed(() => {
  if (!isPremium.value) return 'Premium';
  if (!hasWeakTopics.value) return '0 / 3 Themen';
  return `${totalErrors.value} Fehler · ${weakTopics.value.length} Themen`;
});

const progressPct = computed(() => {
  if (!isPremium.value || !hasWeakTopics.value) return 0;
  return Math.min(100, Math.round((totalErrors.value / 30) * 100));
});

const summaryHint = computed(() => {
  if (!isPremium.value) {
    return 'Gezielt schwache Themen üben — nur mit Premium. Tippe für Details.';
  }
  if (!hasWeakTopics.value) {
    return 'Noch keine Schwachstellen erfasst. Tippe für mehr Infos.';
  }
  return 'Deine 3 Themen mit den meisten Fehlern. Tippe zum Trainieren.';
});

function startSchwaechen() {
  if (!isPremium.value || !hasWeakTopics.value) return;
  router.push({ name: 'trainer', query: { mode: 'schwaechen' } });
}

function openPremium() {
  router.push({ name: 'premium' });
}
</script>

<template>
  <details class="schwaechen-card" aria-label="Schwächen-Modus">
    <summary class="schwaechen-card__summary">
      <div class="schwaechen-card__row">
        <span class="schwaechen-card__title">🎯 Schwächen-Modus</span>
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
        <p class="schwaechen-card__hint">
          Trainiere gezielt deine 3 schwächsten Themen — nur mit Premium.
        </p>
        <button type="button" class="schwaechen-card__cta schwaechen-card__cta--upsell" @click="openPremium">
          💎 Premium freischalten
        </button>
      </template>

      <template v-else-if="!hasWeakTopics">
        <p class="schwaechen-card__hint">
          Noch keine Fehler erfasst. Starte ein Themen-Training — dann zeigen wir dir hier deine Schwachstellen.
        </p>
        <button type="button" class="schwaechen-card__cta schwaechen-card__cta--ghost" @click="openPremium">
          Zu den Premium-Themen →
        </button>
      </template>

      <template v-else>
        <p class="schwaechen-card__hint">
          Deine 3 Themen mit den meisten Fehlern:
        </p>
        <ul class="schwaechen-card__list">
          <li v-for="t in weakTopics" :key="`${t.level}-${t.key}`">
            <span class="schwaechen-card__topic">{{ t.level }} · {{ t.name }}</span>
            <span class="schwaechen-card__errors">{{ t.wrongCount }} Fehler</span>
          </li>
        </ul>
        <button type="button" class="schwaechen-card__cta" @click="startSchwaechen">
          ▶ Schwächen trainieren
        </button>
      </template>
    </div>
  </details>
</template>
