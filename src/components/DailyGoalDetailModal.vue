<script setup>
/**
 * DailyGoalDetailModal — explains Tagesziel, XP rules, and bonus missions.
 */

import { computed } from 'vue';

import { useDailyGoal } from '@/composables/useDailyGoal.js';
import {
  useDailyBonus,
  BONUS_TIERS,
  POST_GOAL_BONUS_XP,
} from '@/composables/useDailyBonus.js';
import { useXp } from '@/composables/useXp.js';
import { useStreak } from '@/composables/useStreak.js';
import { usePremium } from '@/composables/usePremium.js';

const emit = defineEmits(['close']);

const { goal, todayCount, isMet, progressPct } = useDailyGoal();
const { missions, tiers } = useDailyBonus();
const { state: xp, level } = useXp();
const { state: streak } = useStreak();
const { isPremium } = usePremium();

const visibleMissions = computed(() =>
  missions.value.filter((m) => !m.premium || isPremium.value),
);

const xpPerAnswer = computed(() => (isPremium.value ? 2 : 1));

function backdropClick(event) {
  if (event.target === event.currentTarget) emit('close');
}

function missionPct(m) {
  return Math.min(100, Math.round((m.progress / m.target) * 100));
}
</script>

<template>
  <div class="modal-backdrop daily-goal-modal-backdrop" @click.stop="backdropClick">
    <div class="modal-card daily-goal-modal" role="dialog" aria-labelledby="daily-goal-modal-title">
      <div class="daily-goal-modal__head">
        <h2 id="daily-goal-modal-title" class="daily-goal-modal__title">
          {{ isMet ? '✅ Tagesziel & Bonus' : '🎯 Tagesziel & XP' }}
        </h2>
        <button type="button" class="daily-goal-modal__close" aria-label="Schließen" @click="emit('close')">
          ×
        </button>
      </div>

      <section class="daily-goal-modal__section">
        <h3 class="daily-goal-modal__label">Heutiges Ziel</h3>
        <div class="daily-goal-modal__stat-row">
          <span class="daily-goal-modal__big">{{ todayCount }} / {{ goal }} Fragen</span>
          <span class="daily-goal-modal__pct">{{ progressPct }}%</span>
        </div>
        <div class="daily-goal__bar daily-goal-modal__bar">
          <div class="daily-goal__fill" :style="{ width: `${progressPct}%` }" />
        </div>
        <p class="daily-goal-modal__text">
          {{
            isMet
              ? 'Streak für heute ist gesichert. Jede beantwortete Frage zählt — richtig oder falsch.'
              : `Noch ${goal - todayCount} Frage${goal - todayCount === 1 ? '' : 'n'} bis zum Tagesziel. Danach wird dein Streak gezählt.`
          }}
        </p>
      </section>

      <section class="daily-goal-modal__section">
        <h3 class="daily-goal-modal__label">Dein Fortschritt</h3>
        <ul class="daily-goal-modal__facts">
          <li>🔥 Streak: <strong>{{ streak.currentStreak }}</strong> Tag{{ streak.currentStreak === 1 ? '' : 'e' }}</li>
          <li>⭐ XP gesamt: <strong>{{ xp.totalXP }}</strong> · Lv{{ level.num }} {{ level.name }}</li>
          <li v-if="level.next">
            Nächstes Level bei <strong>{{ level.next }} XP</strong>
            (noch {{ level.next - xp.totalXP }})
          </li>
        </ul>
      </section>

      <section class="daily-goal-modal__section">
        <h3 class="daily-goal-modal__label">XP im Training</h3>
        <ul class="daily-goal-modal__facts">
          <li>Richtige Antwort: <strong>+{{ xpPerAnswer }} XP</strong>{{ isPremium ? ' (Premium ×2)' : '' }}</li>
          <li>Falsche Antwort: <strong>−{{ xpPerAnswer }} XP</strong></li>
          <li v-if="isMet">
            Nach dem Tagesziel: <strong>+{{ POST_GOAL_BONUS_XP }} XP</strong> pro richtiger Antwort extra
          </li>
          <li>Thema gemeistert ab <strong>50</strong> richtigen Antworten im Thema</li>
        </ul>
      </section>

      <section class="daily-goal-modal__section">
        <h3 class="daily-goal-modal__label">
          Bonus-Aufgaben
          <span v-if="!isMet" class="daily-goal-modal__locked">nach {{ goal }} Fragen</span>
        </h3>
        <ul class="daily-goal-modal__missions">
          <li
            v-for="m in visibleMissions"
            :key="m.id"
            class="daily-goal-modal__mission"
            :class="{
              'daily-goal-modal__mission--done': m.claimed,
              'daily-goal-modal__mission--locked': !isMet,
            }"
          >
            <div class="daily-goal-modal__mission-top">
              <span>{{ m.icon }} {{ m.title }}</span>
              <span class="daily-goal-modal__reward">+{{ m.reward }} XP</span>
            </div>
            <p class="daily-goal-modal__mission-desc">{{ m.desc }}</p>
            <div class="daily-goal-modal__mission-bar">
              <div
                class="daily-goal-modal__mission-fill"
                :style="{ width: `${isMet ? missionPct(m) : 0}%` }"
              />
            </div>
            <span class="daily-goal-modal__mission-meta">
              {{ isMet ? `${m.progress} / ${m.target}` : '—' }}
              <span v-if="m.claimed"> · ✅ Belohnt</span>
            </span>
          </li>
        </ul>
      </section>

      <section class="daily-goal-modal__section daily-goal-modal__section--last">
        <h3 class="daily-goal-modal__label">Tages-Meilensteine</h3>
        <div class="daily-goal-modal__tiers">
          <span
            v-for="t in tiers"
            :key="t.count"
            class="daily-goal-modal__tier"
            :class="{ 'daily-goal-modal__tier--done': t.claimed }"
          >
            {{ t.count }} Fr. → +{{ t.reward }} XP
            <span v-if="t.claimed">✓</span>
          </span>
        </div>
        <p class="daily-goal-modal__text daily-goal-modal__text--small">
          Meilensteine bei {{ BONUS_TIERS.map((t) => t.count).join(', ') }} beantworteten Fragen heute.
        </p>
      </section>
    </div>
  </div>
</template>
