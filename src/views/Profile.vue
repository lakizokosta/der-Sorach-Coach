<script setup>
/**
 * Profile — learner dashboard.
 *
 * Premium: full view with topic mastery grid + share card.
 * Free/Basis: mini profile (XP, level, streak, daily goal, calendar).
 */

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import LzdLogo from '@/components/LzdLogo.vue';
import { usePremium } from '@/composables/usePremium.js';
import { useXp, isTopicMastered } from '@/composables/useXp.js';
import { useStreak } from '@/composables/useStreak.js';
import DailyGoalCard from '@/components/DailyGoalCard.vue';
import { useAuth } from '@/composables/useAuth.js';
import { PREMIUM_TOPICS, getAllTopics } from '@/data/premiumTopics.js';
import ShareProgressCard from '@/components/ShareProgressCard.vue';
import { shareProgressCard } from '@/utils/shareCard.js';
import { useCefrLevel } from '@/composables/useCefrLevel.js';
import { useNickname } from '@/composables/useNickname.js';
import { SHARE_FORMAT } from '@/utils/shareCard.js';

const router = useRouter();
const { isPremium } = usePremium();
const { isLoggedIn } = useAuth();
const { state: xp, level: liveLevel } = useXp();
const { state: streak, medalsFor } = useStreak();
const activeDaysCount = computed(() => (streak.activeDays || []).length);
const { level: cefrLevel } = useCefrLevel();
const { state: nicknameState, displayName, setNickname } = useNickname();
const shareFormat = ref(SHARE_FORMAT.POST);

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
    cefrLevel: cefrLevel.value || '',
    nickname: displayName.value,
    format: shareFormat.value,
  });
}
</script>

<template>
  <div class="app-shell">
    <LzdLogo small />

    <section v-if="!isPremium" class="section">
      <div class="card premium-card profile-free">
        <div class="profile-free__head">
          <div class="profile-free__title">🏅 Mein Fortschritt</div>
          <div class="profile-free__sub">Dein Lernstand auf einen Blick</div>
        </div>

        <div
          v-if="!isLoggedIn"
          class="profile-free__login-hint"
        >
          📱 <router-link :to="{ name: 'landing' }">Auf der Startseite einloggen</router-link>,
          um Fortschritt auf allen Geräten zu speichern.
        </div>

        <!-- XP + Level -->
        <div class="profile-free__block profile-free__block--xp">
          <div class="profile-free__xp-row">
            <div
              class="profile-free__level-badge"
              :style="{ background: liveLevel.color }"
            >
              Lv{{ liveLevel.num }}
            </div>
            <div class="profile-free__xp-text">
              <div class="profile-free__level-name">{{ liveLevel.name }}</div>
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
          <div class="profile-free__bar-track">
            <div
              class="profile-free__bar-fill"
              :style="{
                width: `${xpPct}%`,
                background: `linear-gradient(90deg, ${liveLevel.color}, #AB4DBB)`,
              }"
            />
          </div>
        </div>

        <!-- Streak -->
        <div class="profile-free__block profile-free__block--streak">
          <div class="profile-free__block-title">🔥 Streak</div>
          <div class="profile-free__stats">
            <div>
              <div class="profile-free__stat-num">{{ streak.currentStreak }}</div>
              <div class="small-note">Aktuell</div>
            </div>
            <div>
              <div class="profile-free__stat-num">{{ streak.longestStreak }}</div>
              <div class="small-note">Rekord 🏆</div>
            </div>
            <div>
              <div class="profile-free__stat-num profile-free__stat-num--muted">
                {{ activeDaysCount }}
              </div>
              <div class="small-note">Aktive Tage</div>
            </div>
          </div>
          <div v-if="streak.longestStreak > 0" class="profile-free__medals small-note">
            🏅 {{ medalsFor(streak.longestStreak) }}
          </div>
        </div>

        <DailyGoalCard class="profile-free__daily" />

        <!-- Premium upsell -->
        <div class="profile-free__upsell">
          <div class="profile-free__upsell-title">💎 Mehr mit Premium</div>
          <ul class="profile-free__upsell-list">
            <li>Themen-Fortschritt &amp; Meisterschaft (50/50)</li>
            <li>Schwächen-Modus &amp; Grammatik-Tipps</li>
            <li>Streak-Freezes &amp; Fortschritts-Karte teilen</li>
          </ul>
          <button
            type="button"
            class="profile-free__upsell-btn"
            @click="router.push({ name: 'premium' })"
          >
            Premium freischalten
          </button>
        </div>

        <button
          type="button"
          class="soft-btn"
          style="max-width: 100%; margin: 14px 0 0 0;"
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
              <div class="small-note" style="text-transform: uppercase;">Freezes</div>
            </div>
          </div>
          <div style="margin-top: 10px; text-align: center;" class="small-note">
            🏅 {{ medalsFor(streak.longestStreak) }}
          </div>
        </div>

        <label class="profile-nickname">
          <span class="profile-nickname__label">✏️ Dein Nickname</span>
          <input
            v-model="nicknameState.nickname"
            type="text"
            class="profile-nickname__input"
            maxlength="24"
            placeholder="Lernender"
            autocomplete="nickname"
            @change="setNickname(nicknameState.nickname)"
            @blur="setNickname(nicknameState.nickname)"
          />
          <span class="profile-nickname__hint">Erscheint auf deiner Erfolgs-Karte</span>
        </label>

        <ShareProgressCard
          v-model:format="shareFormat"
          :total-x-p="xp.totalXP"
          :level="liveLevel"
          :streak="streak"
          :is-mastered="isTopicMastered"
          :cefr-level="cefrLevel || ''"
          :nickname="displayName"
        />

        <!-- Topic mastery (collapsed) -->
        <details class="profile-topics">
          <summary class="profile-topics__summary">
            <span class="profile-topics__title">📚 Alle Themen</span>
            <span class="profile-topics__meta">{{ masteredCount }} / {{ allTopics.length }} gemeistert</span>
          </summary>
          <div class="profile-topics__body">
            <div class="profile-topics__bar-track">
              <div
                class="profile-topics__bar-fill"
                :style="{ width: `${themePct}%` }"
              />
            </div>
            <div
              v-for="lvl in ['A1', 'A2', 'B1', 'B2']"
              :key="lvl"
              class="profile-topics__level"
            >
              <div class="profile-topics__level-label">{{ lvl }}</div>
              <div class="profile-topics__chips">
                <span
                  v-for="t in PREMIUM_TOPICS[lvl]"
                  :key="t.key"
                  class="profile-topics__chip"
                  :class="{ 'profile-topics__chip--done': isTopicMastered(t.key) }"
                  :title="`${t.name}: ${xp.topicCorrect[t.key.toUpperCase()] || 0}/50 richtig`"
                >
                  {{ isTopicMastered(t.key) ? '✅ ' : '' }}{{ t.name }}
                </span>
              </div>
            </div>
          </div>
        </details>

        <div class="profile-share-actions">
          <button type="button" class="profile-share-btn" @click="shareCard">
            📤
            {{
              shareFormat === SHARE_FORMAT.STORY
                ? 'Story teilen (1080×1920)'
                : 'Post teilen (1080×1080)'
            }}
          </button>
          <p class="profile-share-note">
            Auf dem Handy direkt in Instagram oder Facebook teilen — sonst wird das Bild heruntergeladen.
          </p>
          <button
            type="button"
            class="soft-btn profile-share-back"
            @click="router.push({ name: 'landing' })"
          >
            ← Zurück
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
