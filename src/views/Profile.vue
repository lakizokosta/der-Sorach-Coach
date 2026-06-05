<script setup>
/**
 * Profile — the Premium-only learner dashboard.
 *
 * Displays:
 *   - Level + XP progress bar.
 *   - Streak / record / freezes summary with medals.
 *   - Per-topic mastery grid for every CEFR level.
 *   - "Share progress card" button (uses HTML5 Canvas + Web Share API).
 *
 * In the original trainer this was Premium-only; we keep the same gate
 * but show a friendly upsell card for free users.
 */

import { computed } from 'vue';
import { useRouter } from 'vue-router';

import LzdLogo from '@/components/LzdLogo.vue';
import { usePremium } from '@/composables/usePremium.js';
import { useXp, isTopicMastered } from '@/composables/useXp.js';
import { useStreak } from '@/composables/useStreak.js';
import { PREMIUM_TOPICS, getAllTopics } from '@/data/premiumTopics.js';
import { shareProgressCard } from '@/utils/shareCard.js';

const router = useRouter();
const { isPremium } = usePremium();
const { state: xp, level: liveLevel } = useXp();
const { state: streak, medalsFor } = useStreak();

const allTopics = getAllTopics();
const masteredCount = computed(() => allTopics.filter((t) => isTopicMastered(t.key)).length);
const xpToNext = computed(() => (liveLevel.value.next ? liveLevel.value.next - xp.totalXP : 0));
const xpPct = computed(() => {
  const lv = liveLevel.value;
  if (!lv.next) return 100;
  const range = lv.next - lv.prev;
  return Math.max(0, Math.min(100, Math.round(((xp.totalXP - lv.prev) / range) * 100)));
});
const themePct = computed(() => Math.round((masteredCount.value / allTopics.length) * 100));

/** Generates and shares (or downloads) the progress card PNG. */
function shareCard() {
  shareProgressCard({
    totalXP: xp.totalXP,
    level: liveLevel.value,
    streak,
    isMastered: isTopicMastered,
  });
}
</script>

<template>
  <div class="app-shell">
    <LzdLogo small />

    <section v-if="!isPremium" class="section">
      <div class="card premium-card" style="text-align: center;">
        <div style="font-size: 40px; margin-bottom: 10px;">💎</div>
        <div style="font-size: 18px; font-weight: 900; margin-bottom: 8px;">
          Nur für Premium-Mitglieder
        </div>
        <div style="font-size: 14px; color: #666; margin-bottom: 20px;">
          Das Profil mit XP, Level und Themen-Fortschritt ist ein Premium-Feature.
        </div>
        <button
          type="button"
          @click="router.push({ name: 'premium' })"
          style="
            width: 100%;
            padding: 13px;
            border: none;
            border-radius: 14px;
            background: linear-gradient(135deg, #FFD700, #FFB700);
            color: #000;
            font-weight: 900;
            font-size: 15px;
            cursor: pointer;
            margin-bottom: 10px;
          "
        >
          💎 Premium freischalten
        </button>
        <button
          type="button"
          class="soft-btn"
          style="width: 100%; margin: 0;"
          @click="router.push({ name: 'landing' })"
        >
          ← Zurück
        </button>
      </div>
    </section>

    <section v-else class="section">
      <div class="card premium-card">
        <div style="text-align: center; margin-bottom: 16px;">
          <div style="font-size: 18px; font-weight: 900; color: #AB4DBB;">🏅 Mein Profil</div>
        </div>

        <!-- XP + Level -->
        <div
          style="
            background: linear-gradient(135deg, #f5f0ff, #fff);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 16px;
            border: 1px solid rgba(171, 77, 187, 0.2);
          "
        >
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px;">
            <div
              style="
                width: 52px;
                height: 52px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                font-weight: 900;
                color: #fff;
                flex-shrink: 0;
              "
              :style="{ background: liveLevel.color }"
            >
              Lv{{ liveLevel.num }}
            </div>
            <div style="flex: 1; text-align: left;">
              <div style="font-size: 18px; font-weight: 900;">{{ liveLevel.name }}</div>
              <div class="small-note">
                ⭐ {{ xp.totalXP }} XP
                <template v-if="liveLevel.next">
                  · noch <strong>{{ xpToNext }} XP</strong> bis Lv{{ liveLevel.num + 1 }}
                </template>
                <template v-else>
                  · <strong>Maximales Level!</strong>
                </template>
              </div>
            </div>
          </div>
          <div
            style="
              background: #ecdff8;
              border-radius: 8px;
              height: 12px;
              overflow: hidden;
              margin-bottom: 6px;
            "
          >
            <div
              style="height: 12px; border-radius: 8px; transition: width 0.8s;"
              :style="{
                width: `${xpPct}%`,
                background: `linear-gradient(90deg, ${liveLevel.color}, #AB4DBB)`,
              }"
            />
          </div>
        </div>

        <!-- Streak -->
        <div
          style="
            background: #fff9f0;
            border-radius: 16px;
            padding: 16px;
            margin-bottom: 16px;
            border: 1px solid #ffcc80;
          "
        >
          <div
            style="font-size: 14px; font-weight: 900; color: #e65100; margin-bottom: 12px;"
          >
            🔥 Streak
          </div>
          <div style="display: flex; justify-content: space-around; text-align: center;">
            <div>
              <div style="font-size: 28px; font-weight: 900;">
                {{ streak.currentStreak }}
              </div>
              <div class="small-note" style="text-transform: uppercase;">Aktuell</div>
            </div>
            <div>
              <div style="font-size: 28px; font-weight: 900;">
                {{ streak.longestStreak }}
              </div>
              <div class="small-note" style="text-transform: uppercase;">Rekord 🏆</div>
            </div>
            <div>
              <div style="font-size: 28px; font-weight: 900; color: #69c43b;">
                {{ streak.freezes }}
              </div>
              <div class="small-note" style="text-transform: uppercase;">❄️ Freezes</div>
            </div>
          </div>
          <div style="margin-top: 10px; text-align: center;" class="small-note">
            🏅 {{ medalsFor(streak.longestStreak) }}
          </div>
        </div>

        <!-- Topic mastery -->
        <div
          style="
            background: #fff;
            border-radius: 16px;
            padding: 16px;
            border: 1px solid #e8d8f8;
          "
        >
          <div style="font-size: 14px; font-weight: 900; margin-bottom: 12px;">
            📚 Gemeisterte Themen
            <span style="font-size: 12px; color: #AB4DBB; font-weight: 400;">
              ({{ masteredCount }} / {{ allTopics.length }})
            </span>
          </div>
          <div
            style="
              background: #ecdff8;
              border-radius: 6px;
              height: 8px;
              overflow: hidden;
              margin-bottom: 14px;
            "
          >
            <div
              style="
                height: 8px;
                border-radius: 6px;
                background: linear-gradient(90deg, #43a047, #69c43b);
                transition: width 0.8s;
              "
              :style="{ width: `${themePct}%` }"
            />
          </div>

          <div
            v-for="lvl in ['A1', 'A2', 'B1', 'B2']"
            :key="lvl"
            style="margin-bottom: 10px; text-align: left;"
          >
            <div
              style="font-size: 11px; font-weight: 700; color: #AB4DBB; margin-bottom: 6px;"
            >
              {{ lvl }}
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              <div
                v-for="t in PREMIUM_TOPICS[lvl]"
                :key="t.key"
                :title="`${t.name}: ${xp.topicCorrect[t.key.toUpperCase()] || 0}/50 richtig`"
                style="
                  font-size: 11px;
                  padding: 3px 8px;
                  border-radius: 12px;
                  background: #f5f5f5;
                  border: 1px solid #e0e0e0;
                  color: #888;
                "
                :style="
                  isTopicMastered(t.key)
                    ? 'background:#e8f5e9;border-color:#a5d6a7;color:#2e7d32;'
                    : ''
                "
              >
                {{ isTopicMastered(t.key) ? '✅ ' : '' }}{{ t.name }}
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px;">
          <button
            type="button"
            @click="shareCard"
            style="
              width: 100%;
              padding: 14px;
              border: none;
              border-radius: 14px;
              background: linear-gradient(135deg, #C86DD7, #7B2D8B);
              color: #fff;
              font-weight: 900;
              font-size: 15px;
              cursor: pointer;
            "
          >
            📤 Fortschritts-Karte teilen
          </button>
          <button
            type="button"
            class="soft-btn"
            style="max-width: 100%; margin: 0;"
            @click="router.push({ name: 'landing' })"
          >
            ← Zurück
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
