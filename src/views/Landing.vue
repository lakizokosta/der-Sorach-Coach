<script setup>
/**
 * Landing — game-first home. Tarife & Login live on Premium Hub (`/premium?hub=1`).
 */

import { computed } from 'vue';
import { useRouter } from 'vue-router';

import LzdLogo from '@/components/LzdLogo.vue';
import DailyGoalCard from '@/components/DailyGoalCard.vue';
import BonusMissionsCard from '@/components/BonusMissionsCard.vue';
import ActivityCalendar from '@/components/ActivityCalendar.vue';
import SchwaechenCard from '@/components/SchwaechenCard.vue';
import LegalFooter from '@/components/LegalFooter.vue';
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

const continueLevel = computed(() => cefrLevel.value || 'A1');

const continueLabel = computed(() =>
  cefrLevel.value
    ? t('landing.premiumContinue', { level: cefrLevel.value })
    : t('landing.premiumContinueDefault'),
);

const showLocalPremiumBanner = computed(
  () => (isPremium.value || isBasis.value) && !isLoggedIn.value,
);

const showProgressSection = computed(
  () =>
    isLoggedIn.value ||
    streak.currentStreak > 0 ||
    xp.totalXP > 0,
);

const showFreeBadge = computed(
  () => !isPremium.value && !isBasis.value,
);

const subtitleLines = computed(() => t('landing.subtitle').split(' — '));

function startTrainer(lvl) {
  router.push({ name: 'trainer', query: { level: lvl, mode: 'free' } });
}

function continuePractice() {
  startTrainer(continueLevel.value);
}

function openPremiumHub() {
  router.push({ name: 'premium', query: { hub: '1' } });
}

function openProfile() {
  router.push({ name: 'profile' });
}

function onNiveauTestClick() {
  if (!isPremium.value) {
    openPremiumHub();
    return;
  }
  router.push({ name: 'trainer', query: { mode: 'placement' } });
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
    </header>

    <div class="landing-stack">
      <div
        v-if="showLocalPremiumBanner"
        class="landing-premium-banner landing-block"
      >
        <p class="landing-premium-banner__title">{{ t('landing.premiumActiveLocal') }}</p>
        <p class="landing-premium-banner__hint">{{ t('landing.premiumActiveLocalHint') }}</p>
        <button
          type="button"
          class="landing-premium-banner__btn"
          @click="continuePractice"
        >
          {{ continueLabel }}
        </button>
        <button
          v-if="isPremium"
          type="button"
          class="landing-more-btn landing-more-btn--secondary"
          @click="openPremiumHub"
        >
          {{ t('premium.topicsHeading') }} →
        </button>
      </div>

      <div
        v-else-if="isLoggedIn && (isPremium || isBasis)"
        class="landing-premium-banner landing-premium-banner--ok landing-block"
      >
        <p class="landing-premium-banner__title">{{ t('landing.premiumActiveLoggedIn') }}</p>
        <button
          type="button"
          class="landing-premium-banner__btn"
          @click="continuePractice"
        >
          {{ continueLabel }}
        </button>
        <button
          v-if="isPremium"
          type="button"
          class="landing-more-btn landing-more-btn--secondary"
          @click="openPremiumHub"
        >
          {{ t('premium.topicsHeading') }} →
        </button>
      </div>

      <section
        class="landing-section landing-section--levels landing-block"
        :aria-label="t('landing.sectionStart')"
      >
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

        <p class="landing-start-a1__hint">{{ t('landing.startA1Hint') }}</p>

        <button
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

        <div v-if="isLoggedIn" class="landing-logged-in-actions">
          <button type="button" class="landing-profile-btn" @click="openProfile">
            {{ t('landing.profileBtn') }}
          </button>

          <div class="landing-niveau-block">
            <button
              type="button"
              class="niveau-test-btn"
              :class="{
                'level-card': isPremium,
                'niveau-test-btn--unlocked': isPremium,
                'niveau-test-btn--inactive': !isPremium,
              }"
              @click="onNiveauTestClick"
            >
              <span class="niveau-test-btn__label">
                {{
                  cefrLevel
                    ? t('landing.niveauRetest', { level: cefrLevel })
                    : t('landing.niveauTest')
                }}
              </span>
              <span v-if="!isPremium" class="niveau-test-btn__badge">💎 {{ t('common.premium') }}</span>
            </button>
            <p class="niveau-test-btn__hint">
              {{
                isPremium ? t('landing.niveauHintPremium') : t('landing.niveauHintLocked')
              }}
            </p>
          </div>
        </div>

        <div class="landing-progress">
          <DailyGoalCard />
          <BonusMissionsCard />
          <SchwaechenCard />
          <ActivityCalendar />
        </div>
      </section>
    </div>

    <LegalFooter />
  </div>
</template>
