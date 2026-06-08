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
import { useStreak } from '@/composables/useStreak.js';
import { useXp } from '@/composables/useXp.js';
import { usePremium } from '@/composables/usePremium.js';

const router = useRouter();

const { state: streak } = useStreak();
const { state: xp, level } = useXp();
const { isPremium, isBasis } = usePremium();

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

    <section
      style="
        max-width: 360px;
        margin: 18px auto;
        overflow: hidden;
        border-radius: 16px;
        border: 1.5px solid #e0c8f0;
        font-size: 13px;
      "
    >
      <div
        style="
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          background: #f9f3ff;
        "
      >
        <div style="padding: 10px 8px;"></div>
        <div style="padding: 10px 4px; text-align: center; font-weight: 700; color: #bbb;">
          Kostenlos
        </div>
        <div style="padding: 10px 4px; text-align: center; font-weight: 900; color: #AB4DBB;">
          ⏱️ Basis
        </div>
        <div
          style="
            padding: 10px 4px;
            text-align: center;
            font-weight: 900;
            color: #AB4DBB;
            background: rgba(171, 77, 187, 0.08);
          "
        >
          💎 Premium
        </div>
      </div>

      <template
        v-for="row in [
          { label: 'Kein Zeitlimit', free: '5 Min', basis: '✅', premium: '✅' },
          { label: 'A1–B2', free: '✅', basis: '✅', premium: '✅' },
          { label: 'Streak & Rekord', free: '✅', basis: '✅', premium: '✅' },
          { label: 'Fehler-Analyse', free: '❌', basis: '✅', premium: '✅' },
          { label: 'Nach Themen', free: '❌', basis: '❌', premium: '✅' },
          { label: 'Grammatik-Tipps', free: '❌', basis: '❌', premium: '✅' },
          { label: 'Streak Freeze ❄️', free: '❌', basis: '❌', premium: '✅' },
          { label: 'Wort-Wörterbuch 📖', free: '❌', basis: '❌', premium: '✅' },
        ]"
        :key="row.label"
      >
        <div
          style="
            display: grid;
            grid-template-columns: 1.4fr 1fr 1fr 1fr;
            background: #fff;
            border-top: 1px solid #ecdff8;
          "
        >
          <div style="padding: 9px 8px; color: #555;">{{ row.label }}</div>
          <div style="padding: 9px 4px; text-align: center; color: #999;">
            {{ row.free }}
          </div>
          <div
            style="padding: 9px 4px; text-align: center; color: #2e7d32; font-weight: 700;"
          >
            {{ row.basis }}
          </div>
          <div
            style="
              padding: 9px 4px;
              text-align: center;
              color: #2e7d32;
              font-weight: 700;
              background: rgba(171, 77, 187, 0.04);
            "
          >
            {{ row.premium }}
          </div>
        </div>
      </template>

      <div
        style="
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          border-top: 2px solid #e0c8f0;
          background: #f9f3ff;
        "
      >
        <div style="padding: 10px 8px; font-weight: 700; color: #777; font-size: 12px;">
          Preis
        </div>
        <div style="padding: 10px 4px; text-align: center; font-weight: 700; color: #999;">
          Gratis
        </div>
        <div style="padding: 10px 4px; text-align: center; font-weight: 900; color: #AB4DBB;">
          4,99€<div style="font-size: 9px; font-weight: 400; color: #999;">einmalig</div>
        </div>
        <div
          style="
            padding: 10px 4px;
            text-align: center;
            font-weight: 900;
            color: #AB4DBB;
            background: rgba(171, 77, 187, 0.08);
          "
        >
          19€<div style="font-size: 9px; font-weight: 400; color: #999;">/Monat</div>
        </div>
      </div>
    </section>

    <div
      style="
        margin-top: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      "
    >
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
      <div v-if="!isPremium && !isBasis" style="font-size: 12px; color: #999;">
        Einmalzahlung · Kein Abo · Sofort aktiv
      </div>
    </div>

    <footer
      style="
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #999;
        margin-top: 10px;
      "
    >
      <div style="max-width: 720px; margin: 0 auto;">
        <a href="#" style="margin: 0 12px; color: #999;">AGB</a>
        <a href="#" style="margin: 0 12px; color: #999;">Datenschutz</a>
        <a href="#" style="margin: 0 12px; color: #999;">Impressum</a>
      </div>
      <div style="margin-top: 12px; font-size: 11px;">
        © 2026 Lernziel Deutsch | Der SprachCoach
      </div>
    </footer>
  </div>
</template>
