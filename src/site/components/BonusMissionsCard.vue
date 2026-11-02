<script setup>
/**
 * BonusMissionsCard — daily bonus challenges after Tagesziel is met.
 */

import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { useDailyGoal } from '@/composables/useDailyGoal.js';
import { useDailyBonus } from '@/composables/useDailyBonus.js';
import { usePremium } from '@/composables/usePremium.js';

const router = useRouter();
const { isMet } = useDailyGoal();
const { missions, tiers, completedMissions } = useDailyBonus();
const { isPremium } = usePremium();

const visibleMissions = computed(() =>
  missions.value.filter((m) => !m.premium || isPremium.value),
);

function startMission(m) {
  if (m.premium && !isPremium.value) {
    router.push({ name: 'premium' });
    return;
  }
  router.push(m.cta);
}

function pct(m) {
  return Math.min(100, Math.round((m.progress / m.target) * 100));
}
</script>

<template>
  <section v-if="isMet" class="bonus-missions" aria-label="Bonus-Aufgaben">
    <div class="bonus-missions__head">
      <span class="bonus-missions__title">🏅 Bonus-Aufgaben für heute</span>
      <span class="bonus-missions__badge">{{ completedMissions }} / {{ visibleMissions.length }} erledigt</span>
    </div>

    <p class="bonus-missions__intro">
      Dein Streak ist gesichert. Schaffe diese Extra-Aufgaben für Bonus-XP — jede nur einmal pro Tag.
    </p>

    <ul class="bonus-missions__list">
      <li
        v-for="m in visibleMissions"
        :key="m.id"
        class="bonus-mission"
        :class="{
          'bonus-mission--done': m.claimed,
          'bonus-mission--ready': m.done && !m.claimed,
        }"
      >
        <div class="bonus-mission__top">
          <span class="bonus-mission__icon">{{ m.icon }}</span>
          <div class="bonus-mission__body">
            <div class="bonus-mission__name">{{ m.title }}</div>
            <div class="bonus-mission__desc">{{ m.desc }}</div>
          </div>
          <span class="bonus-mission__reward">+{{ m.reward }} XP</span>
        </div>

        <div
          class="bonus-mission__bar"
          role="progressbar"
          :aria-valuenow="m.progress"
          :aria-valuemin="0"
          :aria-valuemax="m.target"
        >
          <div class="bonus-mission__fill" :style="{ width: `${pct(m)}%` }" />
        </div>
        <div class="bonus-mission__meta">
          <span>{{ m.progress }} / {{ m.target }}</span>
          <span v-if="m.claimed" class="bonus-mission__status">✅ Belohnt</span>
          <span v-else-if="m.done" class="bonus-mission__status bonus-mission__status--ready">
            🎁 Wird im Training gutgeschrieben
          </span>
        </div>

        <button
          v-if="!m.claimed"
          type="button"
          class="bonus-mission__cta"
          @click="startMission(m)"
        >
          {{ m.premium && !isPremium ? '💎 Premium' : `▶ ${m.ctaLabel}` }}
        </button>
      </li>
    </ul>

    <div class="bonus-missions__tiers">
      <div class="bonus-missions__tiers-title">📈 Tages-Meilensteine</div>
      <div class="bonus-missions__tiers-row">
        <span
          v-for="t in tiers"
          :key="t.count"
          class="bonus-tier"
          :class="{ 'bonus-tier--done': t.claimed }"
        >
          {{ t.count }} Fr. +{{ t.reward }} XP
          <span v-if="t.claimed">✓</span>
        </span>
      </div>
    </div>
  </section>
</template>
