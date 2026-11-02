<script setup>
/**
 * ActivityCalendar — collapsible 42-day activity heatmap (6 × 7).
 */

import { computed } from 'vue';

import { useStreak } from '@/composables/useStreak.js';
import { useI18n } from '@/i18n/index.js';

const { state: streak } = useStreak();
const { t } = useI18n();

const dayLabels = computed(() => {
  const labels = t('calendar.dayLabels');
  return Array.isArray(labels) ? labels : ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
});

const cells = computed(() => {
  const active = new Set(streak.activeDays || []);
  const today = new Date().toISOString().split('T')[0];
  const out = [];

  for (let offset = 41; offset >= 0; offset -= 1) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - offset);
    const iso = d.toISOString().split('T')[0];
    out.push({
      iso,
      isToday: iso === today,
      isActive: active.has(iso),
    });
  }
  return out;
});

const TOTAL_DAYS = 42;

const activeCount = computed(() => cells.value.filter((c) => c.isActive).length);

const progressPct = computed(() =>
  Math.round((activeCount.value / TOTAL_DAYS) * 100),
);

const summaryHint = computed(() => {
  if (activeCount.value === 0) return t('calendar.hintEmpty');
  return t('calendar.hintActive', { count: activeCount.value });
});
</script>

<template>
  <details class="activity-calendar">
    <summary class="activity-calendar__summary">
      <div class="activity-calendar__row">
        <span class="activity-calendar__title">{{ t('calendar.title') }}</span>
        <span class="activity-calendar__count">
          {{ t('calendar.count', { active: activeCount, total: TOTAL_DAYS }) }}
        </span>
      </div>

      <div
        class="activity-calendar__bar"
        role="progressbar"
        :aria-valuenow="activeCount"
        :aria-valuemin="0"
        :aria-valuemax="TOTAL_DAYS"
      >
        <div class="activity-calendar__fill" :style="{ width: `${progressPct}%` }" />
      </div>

      <p class="activity-calendar__hint">{{ summaryHint }}</p>
    </summary>

    <div class="activity-calendar__body" :aria-label="t('calendar.title')">
      <div class="activity-calendar__weekdays">
        <span v-for="label in dayLabels" :key="label">{{ label }}</span>
      </div>

      <div class="activity-calendar__grid">
        <div
          v-for="cell in cells"
          :key="cell.iso"
          class="activity-calendar__cell"
          :class="{
            'activity-calendar__cell--active': cell.isActive,
            'activity-calendar__cell--today': cell.isToday,
          }"
          :title="cell.iso"
        />
      </div>

      <div class="activity-calendar__legend">
        <span><i class="activity-calendar__dot" /> {{ t('calendar.legendLess') }}</span>
        <span>
          <i class="activity-calendar__dot activity-calendar__dot--active" />
          {{ t('calendar.legendActive') }}
        </span>
        <span>
          <i class="activity-calendar__dot activity-calendar__dot--today" />
          {{ t('calendar.legendToday') }}
        </span>
      </div>
    </div>
  </details>
</template>
