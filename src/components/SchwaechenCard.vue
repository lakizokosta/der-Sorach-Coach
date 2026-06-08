<script setup>
/**
 * SchwaechenCard — entry point for Schwächen-Modus on the landing page.
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

function startSchwaechen() {
  if (!isPremium.value || !hasWeakTopics.value) return;
  router.push({ name: 'trainer', query: { mode: 'schwaechen' } });
}

function openPremium() {
  router.push({ name: 'premium' });
}
</script>

<template>
  <section class="schwaechen-card" aria-label="Schwächen-Modus">
    <div class="schwaechen-card__head">
      <span class="schwaechen-card__title">🎯 Schwächen-Modus</span>
      <span v-if="isPremium && hasWeakTopics" class="schwaechen-card__badge">Premium</span>
    </div>

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
  </section>
</template>
