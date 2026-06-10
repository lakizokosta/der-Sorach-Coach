<script setup>
/**
 * DailyGoalCard — today's question target; tap opens detail modal (XP & missions).
 */

import { computed, ref } from 'vue';

import { useDailyGoal } from '@/composables/useDailyGoal.js';
import DailyGoalDetailModal from '@/components/DailyGoalDetailModal.vue';
import { useI18n } from '@/i18n/index.js';

const { goal, todayCount, isMet, progressPct } = useDailyGoal();
const { t } = useI18n();
const showDetail = ref(false);

const hintText = computed(() => {
  if (isMet.value) return t('dailyGoal.hintDone');
  const remaining = goal - todayCount.value;
  return remaining === 1
    ? t('dailyGoal.hintOne', { count: remaining })
    : t('dailyGoal.hintMany', { count: remaining });
});

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
    :aria-label="t('common.tapForDetails')"
    @click="openDetail"
    @keydown.enter.prevent="openDetail"
    @keydown.space.prevent="openDetail"
  >
    <div class="daily-goal__row">
      <span class="daily-goal__title">
        {{ isMet ? t('dailyGoal.titleDone') : t('dailyGoal.title') }}
      </span>
      <span class="daily-goal__count">
        {{ t('dailyGoal.count', { today: todayCount, goal }) }}
      </span>
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

    <p class="daily-goal__hint">{{ hintText }}</p>

    <Teleport to="body">
      <DailyGoalDetailModal v-if="showDetail" @close="closeDetail" />
    </Teleport>
  </section>
</template>
