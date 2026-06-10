<script setup>
/**
 * DailyGoalCard — today's question target; tap opens detail modal (XP & missions).
 */

import { ref } from 'vue';

import { useDailyGoal } from '@/composables/useDailyGoal.js';
import DailyGoalDetailModal from '@/components/DailyGoalDetailModal.vue';

const { goal, todayCount, isMet, progressPct } = useDailyGoal();
const showDetail = ref(false);

function openDetail() {
  showDetail.value = true;
}

function closeDetail() {
  showDetail.value = false;
}
</script>

<template>
  <section
    class="daily-goal daily-goal--clickable"
    :class="{ 'daily-goal--met': isMet }"
    role="button"
    tabindex="0"
    aria-label="Tagesziel — Details anzeigen"
    @click="openDetail"
    @keydown.enter.prevent="openDetail"
    @keydown.space.prevent="openDetail"
  >
    <div class="daily-goal__row">
      <span class="daily-goal__title">
        {{ isMet ? '✅ Tagesziel geschafft!' : '🎯 Heutiges Ziel' }}
      </span>
      <span class="daily-goal__count">{{ todayCount }} / {{ goal }} Fragen</span>
    </div>

    <div
      class="daily-goal__bar"
      role="progressbar"
      :aria-valuenow="todayCount"
      :aria-valuemin="0"
      :aria-valuemax="goal"
    >
      <div class="daily-goal__fill" :style="{ width: `${progressPct}%` }" />
    </div>

    <p class="daily-goal__hint">
      {{
        isMet
          ? 'Super — dein Streak ist gesichert. Tippe für Bonus & XP-Infos.'
          : `Noch ${goal - todayCount} Frage${goal - todayCount === 1 ? '' : 'n'} bis zum Tagesziel. Tippe für Details.`
      }}
    </p>

    <Teleport to="body">
      <DailyGoalDetailModal v-if="showDetail" @close="closeDetail" />
    </Teleport>
  </section>
</template>
