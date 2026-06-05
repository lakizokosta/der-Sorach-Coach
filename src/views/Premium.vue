<script setup>
/**
 * Premium — the activation/topic-selection screen.
 *
 * When Premium is NOT active, this screen shows:
 *   - A code activation form (demo mode: PREMIUM... or BASIS... codes).
 *   - A pricing summary (CTA buttons are stubbed out — they don't go
 *     anywhere because we don't bundle Stripe/PayPal here).
 *
 * When Premium IS active, this screen shows:
 *   - The streak / XP summary.
 *   - The four level cards plus the topic grid.
 *   - A topic count badge per topic (read from the sample bank).
 */

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import LzdLogo from '@/components/LzdLogo.vue';

import { PREMIUM_TOPICS, getTopicsForLevel } from '@/data/premiumTopics.js';
import { getQuestionsByTopic } from '@/data/sampleQuestions.js';
import { usePremium } from '@/composables/usePremium.js';
import { useStreak } from '@/composables/useStreak.js';
import { useXp, getLevel } from '@/composables/useXp.js';
import { isTopicMastered } from '@/composables/useXp.js';

const router = useRouter();
const { isPremium, isBasis, activateCode, clearPremium, clearBasis } = usePremium();
const { state: streak, medalsFor } = useStreak();
const { state: xp, level: liveLevel } = useXp();

const activeLevel = ref('A1');
const code = ref('');
const status = ref({ text: '', color: '#888' });

const topics = computed(() => getTopicsForLevel(activeLevel.value));

/**
 * Returns the number of available questions for a topic in `activeLevel`.
 *
 * @param {string} topicKey
 * @return {number}
 */
function questionCount(topicKey) {
  return getQuestionsByTopic(activeLevel.value, topicKey).length;
}

/**
 * Submits the activation code. Updates the status message in-place.
 */
function submitCode() {
  const res = activateCode(code.value);
  if (res.ok) {
    status.value = {
      text: res.type === 'premium' ? '✔ Premium aktiviert!' : '✔ Zeitlimit aufgehoben!',
      color: '#69c43b',
    };
    code.value = '';
  } else {
    status.value = { text: `✖ ${res.error}`, color: '#ed4545' };
  }
}

/** Removes Premium / Basis activation. */
function deactivate() {
  clearPremium();
  clearBasis();
  status.value = { text: 'Premium deaktiviert.', color: '#888' };
}

/**
 * Starts a training session focussed on the chosen topic.
 *
 * @param {string} topicKey
 */
function trainTopic(topicKey) {
  if (!isPremium.value) {
    alert('Premium nicht aktiv.');
    return;
  }
  router.push({
    name: 'trainer',
    query: { level: activeLevel.value, topic: topicKey, mode: 'premium' },
  });
}

/** Returns true when the topic has been mastered (50+ correct). */
function topicMastered(key) {
  return isTopicMastered(key);
}
</script>

<template>
  <div class="app-shell">
    <LzdLogo small />
    <section class="section">
      <div class="card premium-card">
        <header
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            padding-bottom: 12px;
          "
        >
          <div style="text-align: left;">
            <div style="font-size: 22px; font-weight: 900;">Der SprachCoach</div>
            <div style="font-size: 13px; color: #666;">Trainiere gezielt zur Prüfung.</div>
            <div style="font-size: 14px; font-style: italic; color: #AB4DBB;">
              Dein Trainer für alle Fälle
            </div>
          </div>
          <div
            style="
              font-size: 12px;
              font-weight: 900;
              padding: 9px 12px;
              border-radius: 999px;
              border: 1px solid rgba(0, 0, 0, 0.1);
            "
            :style="
              isPremium
                ? 'background:rgba(105,196,59,.14);border-color:rgba(105,196,59,.35);'
                : 'background:rgba(237,69,69,.12);border-color:rgba(237,69,69,.28);'
            "
          >
            {{ isPremium ? 'Status: aktiv' : 'Status: nicht aktiv' }}
          </div>
        </header>

        <!-- LOCKED VIEW: activation + price block -->
        <div v-if="!isPremium" style="text-align: left;">
          <div
            style="
              background: #f9f9f9;
              border-radius: 16px;
              padding: 16px;
              margin-bottom: 16px;
            "
          >
            <div style="font-weight: 700; margin-bottom: 8px;">🔑 Aktivierungscode</div>
            <input
              v-model="code"
              type="text"
              placeholder="z.B. PREMIUM_DEMO oder BASIS_TEST"
              style="
                width: 100%;
                padding: 14px;
                border-radius: 12px;
                border: 1px solid #ddd;
                font-size: 15px;
                text-transform: uppercase;
                margin-bottom: 8px;
                box-sizing: border-box;
              "
            />
            <button
              type="button"
              @click="submitCode"
              style="
                width: 100%;
                padding: 12px;
                border-radius: 12px;
                border: none;
                background: #AB4DBB;
                color: #fff;
                font-weight: 900;
                font-size: 14px;
                cursor: pointer;
              "
            >
              Code aktivieren
            </button>
            <div
              style="font-size: 13px; margin-top: 12px; min-height: 18px;"
              :style="{ color: status.color }"
            >
              {{ status.text }}
            </div>
            <p style="font-size: 11px; color: #999; margin-top: 12px;">
              Demo-Modus: jeder Code, der mit <strong>PREMIUM</strong> beginnt,
              schaltet Premium für 30 Tage frei; <strong>BASIS</strong>-Codes
              heben das Zeitlimit dauerhaft auf.
            </p>
          </div>

          <div
            style="
              background: #fff;
              border-radius: 16px;
              padding: 18px;
              border: 1px solid #eee;
            "
          >
            <div style="font-weight: 900; margin-bottom: 8px;">Pläne</div>
            <ul style="margin: 0; padding-left: 18px; line-height: 1.7;">
              <li>1 Monat – 19€</li>
              <li>3 Monate – 49€ <span style="color: #69c43b;">(1 Monat gratis)</span></li>
              <li>12 Monate – 99€ <span style="color: #69c43b;">(3 Monate gratis)</span></li>
              <li>Basis (Zeitlimit aufheben) – 4,99€ einmalig</li>
            </ul>
            <p style="font-size: 11px; color: #999; margin-top: 12px;">
              In dieser Demo-Version sind Bezahlbuttons deaktiviert.
              Aktiviere stattdessen oben einen Demo-Code.
            </p>
          </div>
        </div>

        <!-- UNLOCKED VIEW: streak, XP, levels, topics -->
        <div v-else>
          <div
            style="
              background: linear-gradient(135deg, #f5f0f7 0%, #f9f9f9 100%);
              border-radius: 20px;
              padding: 20px;
              margin-bottom: 16px;
              border: 1px solid rgba(171, 77, 187, 0.15);
            "
          >
            <div
              style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;"
            >
              <span style="font-size: 20px;">🔥</span>
              <span
                style="
                  font-weight: 900;
                  color: #AB4DBB;
                  font-size: 16px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                "
              >
                Dein Streak
              </span>
            </div>
            <div
              style="
                display: flex;
                justify-content: space-around;
                gap: 10px;
                margin-bottom: 16px;
              "
            >
              <div style="text-align: center; flex: 1;">
                <div style="font-size: 28px; font-weight: 900;">
                  {{ streak.currentStreak }}
                </div>
                <div class="small-note" style="text-transform: uppercase;">
                  Tage aktuell
                </div>
              </div>
              <div style="text-align: center; flex: 1;">
                <div style="font-size: 28px; font-weight: 900;">
                  {{ streak.longestStreak }}
                </div>
                <div class="small-note" style="text-transform: uppercase;">
                  Rekord 🏆
                </div>
              </div>
              <div style="text-align: center; flex: 1;">
                <div style="font-size: 28px; font-weight: 900; color: #69c43b;">
                  {{ streak.freezes }}
                </div>
                <div class="small-note" style="text-transform: uppercase;">
                  ❄️ Freezes
                </div>
              </div>
            </div>
            <div style="text-align: center;">
              <span class="small-note" style="margin-right: 8px;">🏅 Medaillen:</span>
              <span style="font-size: 22px; letter-spacing: 6px;">
                {{ medalsFor(streak.longestStreak) }}
              </span>
            </div>
          </div>

          <div
            style="
              background: linear-gradient(135deg, #f5f0ff, #fff);
              border-radius: 16px;
              padding: 16px;
              margin: 12px 0;
              border: 1px solid rgba(171, 77, 187, 0.2);
            "
          >
            <div style="display: flex; align-items: center; gap: 10px;">
              <div
                style="
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: 900;
                  color: #fff;
                "
                :style="{ background: liveLevel.color }"
              >
                Lv{{ liveLevel.num }}
              </div>
              <div style="flex: 1; text-align: left;">
                <div style="font-weight: 900;">{{ liveLevel.name }}</div>
                <div class="small-note">
                  ⭐ {{ xp.totalXP }} XP
                  <template v-if="liveLevel.next">
                    · noch {{ liveLevel.next - xp.totalXP }} XP bis Lv{{
                      liveLevel.num + 1
                    }}
                  </template>
                  <template v-else>· Max. Level!</template>
                </div>
              </div>
            </div>
          </div>

          <div style="margin-top: 18px;">
            <div style="font-weight: 900; margin-bottom: 10px;">Niveau wählen</div>
            <div class="level-grid">
              <button
                v-for="lvl in ['A1', 'A2', 'B1', 'B2']"
                :key="lvl"
                type="button"
                class="level-card"
                :class="{ active: activeLevel === lvl }"
                @click="activeLevel = lvl"
              >
                <div class="level-name">{{ lvl }}</div>
              </button>
            </div>
          </div>

          <div style="margin-top: 18px;">
            <div style="font-weight: 900; margin-bottom: 10px;">Themen</div>
            <div class="topic-grid">
              <button
                v-for="t in topics"
                :key="t.key"
                type="button"
                class="topic-btn"
                @click="trainTopic(t.key)"
              >
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 8px;
                  "
                >
                  <div class="topic-name">
                    {{ t.name }}
                    <span v-if="topicMastered(t.key)" style="margin-left: 4px;">✅</span>
                  </div>
                  <div
                    style="
                      font-size: 11px;
                      font-weight: 700;
                      color: #AB4DBB;
                      white-space: nowrap;
                      padding: 2px 8px;
                      background: #f3e8f9;
                      border-radius: 20px;
                    "
                  >
                    {{ questionCount(t.key) }} Fragen
                  </div>
                </div>
                <div class="topic-desc">{{ t.desc }}</div>
              </button>
            </div>
          </div>

          <div style="margin-top: 18px; text-align: center;">
            <button class="soft-btn" type="button" @click="deactivate">
              Premium deaktivieren
            </button>
          </div>
        </div>

        <div style="margin-top: 20px; text-align: center;">
          <button
            class="soft-btn"
            type="button"
            style="max-width: 200px; margin: 0 auto;"
            @click="router.push({ name: 'landing' })"
          >
            ← Zurück
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
