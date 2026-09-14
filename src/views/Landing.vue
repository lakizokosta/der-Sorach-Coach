<script setup>
/**
 * Landing — same layout for free and Premium.
 * Premium only unlocks features on this page (hub, Niveau, Schwächen) + profile.
 * Tarife checkout: `/premium?hub=1`.
 */

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import LzdLogo from '@/components/LzdLogo.vue';
import DailyGoalCard from '@/components/DailyGoalCard.vue';
import BonusMissionsCard from '@/components/BonusMissionsCard.vue';
import ActivityCalendar from '@/components/ActivityCalendar.vue';
import SchwaechenCard from '@/components/SchwaechenCard.vue';
import LegalFooter from '@/components/LegalFooter.vue';
import NiveauTestBlock from '@/components/NiveauTestBlock.vue';
import ConversionSheet from '@/components/ConversionSheet.vue';
import TrainingHubPanel from '@/components/TrainingHubPanel.vue';
import { useAuth } from '@/composables/useAuth.js';
import { useStreak } from '@/composables/useStreak.js';
import { useXp } from '@/composables/useXp.js';
import { usePremium } from '@/composables/usePremium.js';
import { useCefrLevel } from '@/composables/useCefrLevel.js';
import { useI18n } from '@/i18n/index.js';

const router = useRouter();
const { t } = useI18n();

const { isLoggedIn } = useAuth();
const { state: streak } = useStreak();
const { state: xp, level } = useXp();
const { isPremium, isBasis } = usePremium();
const { level: cefrLevel } = useCefrLevel();
const conversionSheetOpen = ref(false);
const conversionVariant = ref('niveau');

const summaryText = computed(() => {
  const parts = [];
  if (streak.currentStreak > 0) {
    const dayLabel =
      streak.currentStreak === 1 ? t('common.day') : t('common.days');
    parts.push(
      `🔥 <strong>${streak.currentStreak} ${dayLabel}</strong>`,
    );
  }
  parts.push(`⭐ <strong>${xp.totalXP} XP</strong>`);
  parts.push(`Lv${level.value.num} ${level.value.name}`);
  return parts.join(' &nbsp;·&nbsp; ');
});

const hubLevel = computed(() => cefrLevel.value || 'A1');

const showProgressSection = computed(
  () =>
    isPremium.value ||
    isLoggedIn.value ||
    streak.currentStreak > 0 ||
    xp.totalXP > 0,
);

/** Always show Mein Profil; locked teaser for free/Basis without access. */
const profileLocked = computed(() => !isPremium.value);

const showFreeBadge = computed(
  () => !isPremium.value && !isBasis.value,
);

const subtitleLines = computed(() => t('landing.subtitle').split(' — '));

function startTrainer(lvl) {
  router.push({ name: 'trainer', query: { level: lvl, mode: 'free' } });
}

function openPremiumHub() {
  router.push({ name: 'premium', query: { hub: '1' } });
}

function openConversion(variant = 'checkout') {
  conversionVariant.value = variant;
  conversionSheetOpen.value = true;
}

function onNiveauLocked() {
  openConversion('niveau');
}

function onPremiumLocked() {
  openConversion('checkout');
}

function openProfile() {
  router.push({ name: 'profile' });
}

function onProfileClick() {
  if (profileLocked.value && !isLoggedIn.value) {
    openConversion('checkout');
    return;
  }
  openProfile();
}
</script>

<template>
  <div class="app-shell app-shell--landing">
    <header class="landing-hero">
      <LzdLogo />
      <h1 class="main-title">{{ t('landing.title') }}</h1>
      <p class="main-subtitle">
        {{ subtitleLines[0] }} —<br />{{ subtitleLines[1] || '' }}
      </p>
      <p class="brand-slogan">{{ t('landing.slogan') }}</p>

      <p v-if="showFreeBadge" class="landing-free-badge">{{ t('landing.freeStart') }}</p>

      <div
        v-if="showProgressSection"
        class="landing-summary"
        v-html="summaryText"
      />

      <div class="landing-logged-in-actions landing-logged-in-actions--hero">
        <button
          type="button"
          class="landing-profile-btn"
          :class="{ 'landing-profile-btn--locked': profileLocked }"
          @click="onProfileClick"
        >
          {{ t('landing.profileBtn') }}
          <span v-if="profileLocked" class="landing-profile-btn__lock" aria-hidden="true">💎</span>
        </button>
      </div>

      <div
        v-if="showProgressSection"
        class="landing-daily-goal-hero"
      >
        <DailyGoalCard />
      </div>
    </header>

    <div class="landing-stack">
      <section
        class="landing-section landing-section--levels landing-block"
        :aria-label="t('landing.sectionStart')"
      >
        <div class="landing-level-pick">
          <h2 class="landing-level-pick__title">{{ t('landing.levelPickTitle') }}</h2>
          <p v-if="!isPremium" class="landing-level-pick__hint">{{ t('landing.startA1Hint') }}</p>
        </div>

        <div class="level-grid level-grid--landing">
          <button
            type="button"
            class="level-card level-card--a1"
            @click="startTrainer('A1')"
          >
            <div class="level-name">A1</div>
            <div class="level-desc">{{ t('landing.levelA1') }}</div>
          </button>
          <button
            type="button"
            class="level-card level-card--b1"
            @click="startTrainer('B1')"
          >
            <div class="level-name">B1</div>
            <div class="level-desc">{{ t('landing.levelB1') }}</div>
          </button>
          <button
            type="button"
            class="level-card level-card--a2"
            @click="startTrainer('A2')"
          >
            <div class="level-name">A2</div>
            <div class="level-desc">{{ t('landing.levelA2') }}</div>
          </button>
          <button
            type="button"
            class="level-card level-card--b2"
            @click="startTrainer('B2')"
          >
            <div class="level-name">B2</div>
            <div class="level-desc">{{ t('landing.levelB2') }}</div>
          </button>
        </div>

        <NiveauTestBlock @locked="onNiveauLocked" />

        <TrainingHubPanel
          class="landing-block"
          :locked="!isPremium"
          :initial-level="hubLevel"
          @unlock="onPremiumLocked"
        />

        <button
          v-if="!isPremium"
          type="button"
          class="landing-more-btn"
          @click="openPremiumHub"
        >
          {{ t('landing.moreBtn') }}
        </button>
      </section>

      <section
        v-if="showProgressSection"
        class="landing-section landing-section--dashboard landing-block"
        :aria-label="t('landing.sectionDashboard')"
      >
        <div class="landing-divider" role="separator">
          <span class="landing-divider__label">{{ t('landing.sectionDashboard') }}</span>
        </div>

        <div class="landing-progress">
          <BonusMissionsCard />
          <ActivityCalendar />
          <SchwaechenCard @locked="onPremiumLocked" />
        </div>
      </section>
    </div>

    <LegalFooter />

    <ConversionSheet
      v-model="conversionSheetOpen"
      :variant="conversionVariant"
      plan="3months"
    />
  </div>
</template>
