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
import { usePremium, signOutUser } from '@/composables/usePremium.js';
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
import { placementBreakdown } from '@/utils/placementTest.js';
import { useI18n } from '@/i18n/index.js';

const router = useRouter();
const { t } = useI18n();
const { isPremium } = usePremium();
const { state: auth, isLoggedIn } = useAuth();
const { state: xp, level: liveLevel } = useXp();
const { state: streak, medalsFor } = useStreak();
const activeDaysCount = computed(() => (streak.activeDays || []).length);
const { level: cefrLevel, state: cefrState } = useCefrLevel();
const placementRows = computed(() =>
  cefrLevel.value ? placementBreakdown(cefrState.scores) : [],
);
const placementScorePct = computed(() => {
  if (!cefrState.totalAnswered) return 0;
  return Math.round((cefrState.totalCorrect / cefrState.totalAnswered) * 100);
});
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
    placementBreakdown: placementRows.value,
    nickname: displayName.value,
    format: shareFormat.value,
  });
}

async function signOut() {
  await signOutUser();
  window.location.assign(router.resolve({ name: 'landing' }).href);
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
          v-if="isLoggedIn"
          class="profile-account"
        >
          <span class="profile-account__email">👤 {{ auth.email }}</span>
          <button type="button" class="profile-account__signout" @click="signOut">
            {{ t('common.signOut') }}
          </button>
        </div>
        <div
          v-else
          class="profile-free__login-hint"
        >
          📱 <router-link :to="{ name: 'landing' }">Auf der Startseite einloggen</router-link>,
          um Fortschritt auf bis zu 2 Geräten zu speichern.
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
            @click="router.push({ name: 'premium', query: { hub: '1' } })"
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
      <div class="card premium-card profile-premium">
        <header class="profile-premium__head">
          <h1 class="profile-premium__title">🏅 Mein Profil</h1>
          <div class="profile-account profile-account--premium">
            <span class="profile-account__email">
              {{ isLoggedIn ? `👤 ${auth.email}` : '💎 Premium aktiv' }}
            </span>
            <button type="button" class="profile-account__signout" @click="signOut">
              {{ t('common.signOut') }}
            </button>
          </div>
        </header>

        <!-- XP + Level -->
        <div class="profile-block profile-block--xp">
          <div class="profile-xp-row">
            <div
              class="profile-xp-badge"
              :style="{ background: liveLevel.color }"
            >
              Lv{{ liveLevel.num }}
            </div>
            <div class="profile-xp-text">
              <div class="profile-xp-name">{{ liveLevel.name }}</div>
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
          <div class="profile-xp-bar-track">
            <div
              class="profile-xp-bar-fill"
              :style="{
                width: `${xpPct}%`,
                background: `linear-gradient(90deg, ${liveLevel.color}, #AB4DBB)`,
              }"
            />
          </div>
        </div>

        <!-- Streak -->
        <div class="profile-block profile-block--streak">
          <div class="profile-block__title">🔥 Streak</div>
          <div class="profile-streak-grid">
            <div>
              <div class="profile-streak-grid__num">{{ streak.currentStreak }}</div>
              <div class="profile-streak-grid__label">Aktuell</div>
            </div>
            <div>
              <div class="profile-streak-grid__num">{{ streak.longestStreak }}</div>
              <div class="profile-streak-grid__label">Rekord 🏆</div>
            </div>
            <div>
              <div class="profile-streak-grid__num profile-streak-grid__num--green">
                {{ streak.freezes }}
              </div>
              <div class="profile-streak-grid__label">Freezes</div>
            </div>
          </div>
          <p class="profile-streak-medals small-note">
            🏅 {{ medalsFor(streak.longestStreak) }}
          </p>
        </div>

        <div v-if="cefrLevel" class="profile-block profile-block--placement">
          <div class="profile-block__title profile-block__title--placement">
            📊 Einstufungtest · {{ cefrLevel }}
          </div>
          <ul class="profile-placement-rows">
            <li
              v-for="row in placementRows"
              :key="row.level"
              class="profile-placement-rows__row"
              :class="{ 'profile-placement-rows__row--active': row.level === cefrLevel }"
            >
              <span class="profile-placement-rows__level">{{ row.level }}</span>
              <span class="profile-placement-rows__score">
                {{ row.correct }}/{{ row.total }} ({{ row.pct }}%)
              </span>
            </li>
          </ul>
          <p v-if="placementScorePct" class="profile-placement-summary small-note">
            {{ placementScorePct }}% richtig gesamt
          </p>
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
          :placement-breakdown="placementRows"
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
