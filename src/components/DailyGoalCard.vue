<script setup>
/**
 * DailyGoalCard — today's question target with a progress bar.
 */

import { useDailyGoal } from '@/composables/useDailyGoal.js';

const { goal, todayCount, isMet, progressPct } = useDailyGoal();
</script>

<template>
  <section
    class="daily-goal"
    :class="{ 'daily-goal--met': isMet }"
    aria-label="Tagesziel"
  >
    <div class="daily-goal__row">
      <span class="daily-goal__title">
        {{ isMet ? '✅ Tagesziel geschafft!' : '🎯 Heutiges Ziel' }}
      </span>
      <span class="daily-goal__count">{{ todayCount }} / {{ goal }} Fragen</span>
    </div>

    <div class="daily-goal__bar" role="progressbar" :aria-valuenow="todayCount" :aria-valuemin="0" :aria-valuemax="goal">
      <div class="daily-goal__fill" :style="{ width: `${progressPct}%` }" />
    </div>

    <p class="daily-goal__hint">
      {{
        isMet
          ? 'Super — dein Streak ist für heute gesichert. Weiter üben bringt extra XP!'
          : `Noch ${goal - todayCount} Frage${goal - todayCount === 1 ? '' : 'n'} bis zum Tagesziel.`
      }}
    </p>
  </section>
</template>
