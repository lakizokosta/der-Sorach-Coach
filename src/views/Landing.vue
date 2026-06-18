<script setup>
/**
 * Landing — the home screen.
 */

import { computed } from 'vue';
import { useRouter } from 'vue-router';

import LzdLogo from '@/components/LzdLogo.vue';
import LoginPanel from '@/components/LoginPanel.vue';
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
import { loadString } from '@/composables/useStorage.js';
import { hasBackend } from '@/utils/api.js';
import { useI18n } from '@/i18n/index.js';

const USER_EMAIL_KEY = 'userEmail';

const router = useRouter();
const { t } = useI18n();
const backendOn = hasBackend();

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

const hasSavedEmail = computed(() => {
  const email = (loadString(USER_EMAIL_KEY) || '').trim();
  return email.includes('@');
});

const loginOpenByDefault = computed(
  () =>
    hasSavedEmail.value ||
    isLoggedIn.value ||
    isPremium.value ||
    isBasis.value,
);

const showProgressSection = computed(
  () =>
    isLoggedIn.value ||
    streak.currentStreak > 0 ||
    xp.totalXP > 0,
);

const pricingCompareRows = computed(() => [
  {
    label: t('landing.pricing.noLimit'),
    free: t('landing.pricing.freeLimit'),
    basis: '✅',
    premium: '✅',
  },
  { label: t('landing.pricing.levels'), free: '✅', basis: '✅', premium: '✅' },
  { label: t('landing.pricing.streak'), free: '✅', basis: '✅', premium: '✅' },
  {
    label: t('landing.pricing.errorAnalysis'),
    free: '❌',
    basis: '✅',
    premium: '✅',
  },
  {
    label: t('landing.pricing.byTopic'),
    free: '❌',
    basis: '❌',
    premium: '✅',
  },
  {
    label: t('landing.pricing.placementTest'),
    free: '❌',
    basis: '❌',
    premium: '✅',
  },
  {
    label: t('landing.pricing.grammarTips'),
    free: '❌',
    basis: '❌',
    premium: '✅',
  },
  {
    label: t('landing.pricing.streakFreeze'),
    free: '❌',
    basis: '❌',
    premium: '✅',
  },
  {
    label: t('landing.pricing.dictionary'),
    free: '❌',
    basis: '❌',
    premium: '✅',
  },
]);

const subtitleLines = computed(() => t('landing.subtitle').split(' — '));

function startTrainer(lvl) {
  router.push({ name: 'trainer', query: { level: lvl, mode: 'free' } });
}

function continuePractice() {
  startTrainer(continueLevel.value);
}

function openPremium() {
  router.push({ name: 'premium' });
}

function openProfile() {
  router.push({ name: 'profile' });
}

function payBasis() {
  router.push({ name: 'premium', query: { focus: 'basis' } });
}

function onNiveauTestClick() {
  if (!isPremium.value) {
    openPremium();
    return;
  }
  router.push({ name: 'trainer', query: { mode: 'placement' } });
}
</script>

<template>
  <div class="app-shell">
    <LzdLogo />
    <h1 class="main-title">{{ t('landing.title') }}</h1>
    <p class="main-subtitle">
      {{ subtitleLines[0] }} —<br />{{ subtitleLines[1] || '' }}
    </p>
    <p class="brand-slogan">{{ t('landing.slogan') }}</p>

    <div
      v-if="streak.currentStreak > 0 || xp.totalXP > 0"
      style="
        margin: 6px auto 10px auto;
        max-width: 340px;
        padding: 10px 20px;
        background: rgba(171, 77, 187, 0.1);
        border-radius: 20px;
        font-size: 14px;
        font-weight: 700;
        color: #AB4DBB;
        text-align: center;
        border: 1.5px solid rgba(171, 77, 187, 0.2);
      "
      v-html="summaryText"
    />

    <section
      class="landing-section landing-section--start"
      :aria-label="t('landing.sectionStart')"
    >
      <div
        v-if="showLocalPremiumBanner"
        class="landing-premium-banner"
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
      </div>

      <div
        v-else-if="isLoggedIn && (isPremium || isBasis)"
        class="landing-premium-banner landing-premium-banner--ok"
      >
        <p class="landing-premium-banner__title">{{ t('landing.premiumActiveLoggedIn') }}</p>
        <button
          type="button"
          class="landing-premium-banner__btn"
          @click="continuePractice"
        >
          {{ continueLabel }}
        </button>
      </div>

      <h2 class="landing-section__title landing-section__title--new">
        {{ t('landing.sectionNew') }}
      </h2>

      <button
        type="button"
        class="landing-start-a1"
        @click="startTrainer('A1')"
      >
        {{ t('landing.startA1Btn') }}
      </button>
      <p class="landing-start-a1__hint">{{ t('landing.startA1Hint') }}</p>

      <p class="landing-other-levels">{{ t('landing.otherLevels') }}</p>

      <div class="level-grid level-grid--secondary">
        <button class="level-card level-card--compact" type="button" @click="startTrainer('A2')">
          <div class="level-name">A2</div>
          <div class="level-desc">{{ t('landing.levelA2') }}</div>
        </button>
        <button class="level-card level-card--compact" type="button" @click="startTrainer('B1')">
          <div class="level-name">B1</div>
          <div class="level-desc">{{ t('landing.levelB1') }}</div>
        </button>
        <button class="level-card level-card--compact" type="button" @click="startTrainer('B2')">
          <div class="level-name">B2</div>
          <div class="level-desc">{{ t('landing.levelB2') }}</div>
        </button>
      </div>

      <details class="pricing-compare">
        <summary class="pricing-compare__summary">
          <div class="pricing-compare__row">
            <span class="pricing-compare__title">{{ t('landing.compareTitle') }}</span>
            <span class="pricing-compare__count">{{ t('landing.compareCount') }}</span>
          </div>

          <div
            class="pricing-compare__bar"
            role="progressbar"
            aria-valuenow="3"
            aria-valuemin="0"
            aria-valuemax="3"
            :aria-label="t('landing.compareAria')"
          >
            <div class="pricing-compare__fill" style="width: 100%" />
          </div>

          <p class="pricing-compare__hint">{{ t('landing.compareHint') }}</p>
        </summary>

        <div class="pricing-compare__body">
          <div class="pricing-compare__row pricing-compare__row--head">
            <div class="pricing-compare__cell pricing-compare__cell--label"></div>
            <div class="pricing-compare__cell pricing-compare__cell--tier pricing-compare__cell--muted">
              {{ t('common.free') }}
            </div>
            <div class="pricing-compare__cell pricing-compare__cell--tier">⏱️ {{ t('common.basis') }}</div>
            <div class="pricing-compare__cell pricing-compare__cell--tier pricing-compare__cell--premium">
              💎 {{ t('common.premium') }}
            </div>
          </div>

          <div
            v-for="row in pricingCompareRows"
            :key="row.label"
            class="pricing-compare__row"
          >
            <div class="pricing-compare__cell pricing-compare__cell--label">{{ row.label }}</div>
            <div class="pricing-compare__cell pricing-compare__cell--muted">{{ row.free }}</div>
            <div class="pricing-compare__cell pricing-compare__cell--ok">{{ row.basis }}</div>
            <div class="pricing-compare__cell pricing-compare__cell--ok pricing-compare__cell--premium">
              {{ row.premium }}
            </div>
          </div>

          <div class="pricing-compare__row pricing-compare__row--price">
            <div class="pricing-compare__cell pricing-compare__cell--label">{{ t('common.price') }}</div>
            <div class="pricing-compare__cell pricing-compare__cell--muted">{{ t('common.gratis') }}</div>
            <div class="pricing-compare__cell pricing-compare__cell--price">
              4,99€<span class="pricing-compare__sub">{{ t('common.once') }}</span>
            </div>
            <div class="pricing-compare__cell pricing-compare__cell--price pricing-compare__cell--premium">
              19€<span class="pricing-compare__sub">{{ t('common.perMonth') }}</span>
            </div>
          </div>
        </div>
      </details>

      <div class="landing-cta-stack">
        <button type="button" class="level-card landing-cta-premium" @click="openPremium">
          {{ isPremium ? t('landing.ctaMyPremium') : t('landing.ctaPremium') }}
        </button>

        <button
          v-if="!isPremium && !isBasis"
          type="button"
          class="level-card landing-cta-basis"
          @click="payBasis"
        >
          {{ t('landing.ctaBasis') }}
        </button>
        <div v-if="!isPremium && !isBasis" class="landing-cta-stack__note">
          {{ t('landing.ctaNote') }}
        </div>
      </div>
    </section>

    <section
      v-if="backendOn"
      class="landing-section landing-section--login"
      :aria-label="t('landing.sectionLogin')"
    >
      <details
        class="landing-login-fold"
        :open="loginOpenByDefault"
      >
        <summary class="landing-login-fold__summary">
          {{ t('landing.loginFoldSummary') }}
        </summary>
        <div class="landing-login-fold__body">
          <LoginPanel />
        </div>
      </details>
    </section>

    <section
      v-if="showProgressSection"
      class="landing-section landing-section--dashboard"
      :aria-label="t('landing.sectionDashboard')"
    >
      <h2 class="landing-section__title">{{ t('landing.sectionDashboard') }}</h2>

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

    <LegalFooter />
  </div>
</template>
