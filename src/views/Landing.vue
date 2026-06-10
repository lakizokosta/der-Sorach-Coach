<script setup>
/**
 * Landing — the home screen.
 *
 * Shows the logo, branding, the streak/XP summary, the four CEFR level
 * cards (which start a free training session), the feature comparison
 * table, and the call-to-action buttons that lead to the Premium screen.
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
import { useStreak } from '@/composables/useStreak.js';
import { useXp } from '@/composables/useXp.js';
import { usePremium } from '@/composables/usePremium.js';
import { useCefrLevel } from '@/composables/useCefrLevel.js';

const router = useRouter();

const { state: streak } = useStreak();
const { state: xp, level } = useXp();
const { isPremium, isBasis } = usePremium();
const { level: cefrLevel } = useCefrLevel();

const summaryText = computed(() => {
  const parts = [];
  if (streak.currentStreak > 0) {
    parts.push(
      `🔥 <strong>${streak.currentStreak} ${streak.currentStreak === 1 ? 'Tag' : 'Tage'}</strong>`,
    );
  }
  parts.push(`⭐ <strong>${xp.totalXP} XP</strong>`);
  parts.push(`Lv${level.value.num} ${level.value.name}`);
  return parts.join(' &nbsp;·&nbsp; ');
});

/**
 * Starts a free training session for the chosen level.
 *
 * @param {('A1'|'A2'|'B1'|'B2')} lvl
 */
function startTrainer(lvl) {
  router.push({ name: 'trainer', query: { level: lvl, mode: 'free' } });
}

/** Opens the Premium / activation screen. */
function openPremium() {
  router.push({ name: 'premium' });
}

/** Opens the user profile (mastery dashboard). */
function openProfile() {
  router.push({ name: 'profile' });
}

/**
 * Demo handler for the "Basis" upsell button.
 *
 * Navigates to the Premium screen with a `focus=basis` hint so the
 * activation form pre-emphasises the BASIS code flow instead of using
 * a jarring native browser alert.
 */
function payBasis() {
  router.push({ name: 'premium', query: { focus: 'basis' } });
}

function onNiveauTestClick() {
  if (!isPremium.value) return;
  router.push({ name: 'trainer', query: { mode: 'placement' } });
}

const pricingCompareRows = [
  { label: 'Kein Zeitlimit', free: '5 Min', basis: '✅', premium: '✅' },
  { label: 'A1–B2', free: '✅', basis: '✅', premium: '✅' },
  { label: 'Streak & Rekord', free: '✅', basis: '✅', premium: '✅' },
  { label: 'Fehler-Analyse', free: '❌', basis: '✅', premium: '✅' },
  { label: 'Nach Themen', free: '❌', basis: '❌', premium: '✅' },
  { label: 'Niveau-Test', free: '❌', basis: '❌', premium: '✅' },
  { label: 'Grammatik-Tipps', free: '❌', basis: '❌', premium: '✅' },
  { label: 'Streak Freeze', free: '❌', basis: '❌', premium: '✅' },
  { label: 'Wort-Wörterbuch', free: '❌', basis: '❌', premium: '✅' },
];
</script>

<template>
  <div class="app-shell">
    <LzdLogo />
    <h1 class="main-title">Der SprachCoach</h1>
    <p class="main-subtitle">
      Deutsch sprechen wie ein Profi —<br />5 Minuten täglich reichen.
    </p>
    <p class="brand-slogan">Dein Trainer für alle Fälle</p>

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

    <LoginPanel />

    <div class="landing-progress">
      <DailyGoalCard />
      <BonusMissionsCard />
      <SchwaechenCard />
      <ActivityCalendar />
    </div>

    <div style="text-align: center; margin: 6px auto 10px auto;">
      <button
        type="button"
        @click="openProfile"
        style="
          background: linear-gradient(135deg, #f3e5f5, #e8d5f0);
          border: 1.5px solid #ce93d8;
          border-radius: 22px;
          padding: 9px 22px;
          font-size: 14px;
          font-weight: 700;
          color: #7B2D8B;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(171, 77, 187, 0.15);
        "
      >
        🏅 Mein Profil &amp; Fortschritt
      </button>
    </div>

    <div class="landing-niveau-block">
      <button
        type="button"
        class="niveau-test-btn"
        :class="{ 'niveau-test-btn--inactive': !isPremium }"
        :aria-disabled="!isPremium"
        @click="onNiveauTestClick"
      >
        <span class="niveau-test-btn__label">
          {{
            cefrLevel
              ? `Niveau ${cefrLevel} — erneut testen`
              : 'Niveau testen (A1–B2)'
          }}
        </span>
        <span v-if="!isPremium" class="niveau-test-btn__badge">💎 Premium</span>
      </button>
      <p class="niveau-test-btn__hint">
        <template v-if="isPremium">
          60 zufällige Fragen aus dem Trainer (15 pro Niveau, steigend A1→B2).
        </template>
        <template v-else>
          Personalisierte Tagesaufgaben — mit Premium freischalten.
        </template>
      </p>
    </div>

    <div class="free-box">✨ Kostenlos starten · Keine Anmeldung nötig</div>

    <div class="level-grid">
      <button class="level-card" type="button" @click="startTrainer('A1')">
        <div class="level-name">A1</div>
        <div class="level-desc">Anfänger</div>
      </button>
      <button class="level-card" type="button" @click="startTrainer('A2')">
        <div class="level-name">A2</div>
        <div class="level-desc">Grundlagen</div>
      </button>
      <button class="level-card" type="button" @click="startTrainer('B1')">
        <div class="level-name">B1</div>
        <div class="level-desc">Alltagssprache</div>
      </button>
      <button class="level-card" type="button" @click="startTrainer('B2')">
        <div class="level-name">B2</div>
        <div class="level-desc">Fortgeschrittene</div>
      </button>
    </div>

    <details class="pricing-compare">
      <summary class="pricing-compare__summary">
        <span class="pricing-compare__title">Tarife vergleichen</span>
        <span class="pricing-compare__meta">Gratis · Basis 4,99€ · Premium 19€</span>
      </summary>

      <div class="pricing-compare__body">
        <div class="pricing-compare__row pricing-compare__row--head">
          <div class="pricing-compare__cell pricing-compare__cell--label"></div>
          <div class="pricing-compare__cell pricing-compare__cell--tier pricing-compare__cell--muted">
            Kostenlos
          </div>
          <div class="pricing-compare__cell pricing-compare__cell--tier">⏱️ Basis</div>
          <div class="pricing-compare__cell pricing-compare__cell--tier pricing-compare__cell--premium">
            💎 Premium
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
          <div class="pricing-compare__cell pricing-compare__cell--label">Preis</div>
          <div class="pricing-compare__cell pricing-compare__cell--muted">Gratis</div>
          <div class="pricing-compare__cell pricing-compare__cell--price">
            4,99€<span class="pricing-compare__sub">einmalig</span>
          </div>
          <div class="pricing-compare__cell pricing-compare__cell--price pricing-compare__cell--premium">
            19€<span class="pricing-compare__sub">/Monat</span>
          </div>
        </div>
      </div>
    </details>

    <div class="landing-cta-stack">
      <button
        type="button"
        class="level-card"
        style="
          background: linear-gradient(135deg, #FFD700, #FFB700);
          color: #000;
          width: 100%;
          max-width: 320px;
          font-weight: 900;
          font-size: 18px;
          border-radius: 999px;
        "
        @click="openPremium"
      >
        {{ isPremium ? '💎 Mein Premium' : '💎 Premium – ab 19€' }}
      </button>

      <button
        v-if="!isPremium && !isBasis"
        type="button"
        class="level-card"
        style="
          width: 100%;
          max-width: 320px;
          font-weight: 900;
          font-size: 18px;
          border-radius: 999px;
          background: linear-gradient(135deg, #C86DD7, #7B2D8B);
        "
        @click="payBasis"
      >
        ⏱️ Zeitlimit aufheben – 4,99€
      </button>
      <div v-if="!isPremium && !isBasis" class="landing-cta-stack__note">
        Einmalzahlung · Kein Abo · Sofort aktiv
      </div>
    </div>

    <LegalFooter />
  </div>
</template>
