<script setup>
/**
 * Trainer — the question-flow view.
 *
 * Reads `level` and (optionally) `topic` + `mode` from the route query
 * and drives the user through a varied queue of questions. Tracks live
 * score, drives the timer (5 min cap in free mode, count-up otherwise)
 * and renders a final result screen with mastery + topic feedback.
 *
 * Route examples:
 *   /trainer?level=A1
 *   /trainer?level=B2&topic=PASSIVB2&mode=premium
 */

import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import LzdLogo from '@/components/LzdLogo.vue';
import GrammarTip from '@/components/GrammarTip.vue';
import DictionaryPopup from '@/components/DictionaryPopup.vue';
import QuestionRenderer from '@/components/questions/QuestionRenderer.vue';

import { usePremium } from '@/composables/usePremium.js';
import { useXp, getLevel } from '@/composables/useXp.js';
import { useStreak } from '@/composables/useStreak.js';
import { useTimer, formatMmSs } from '@/composables/useTimer.js';

import { getQuestionsByLevel, getQuestionsByTopic } from '@/data/questions.js';
import { PREMIUM_TOPICS } from '@/data/premiumTopics.js';
import { AdaptiveQueue } from '@/utils/queue.js';

const FREE_SECONDS_PER_DAY = 300;
const FREE_SESSION_KEY = 'lzd_free_start_ms';

const route = useRoute();
const router = useRouter();
const { isPremium, isBasis } = usePremium();
const { addXP, state: xpState, level: liveLevel } = useXp();
const { state: streakState, recordActivityToday } = useStreak();

const level = ref(route.query.level || 'A1');
const topic = ref(route.query.topic || '');
const forcedPremium = route.query.mode === 'premium';
const isPrem = computed(() => forcedPremium || isPremium.value);

const queue = ref(null);                  // AdaptiveQueue instance
const queueVersion = ref(0);              // bumped to force renderer remount
const answered = ref(0);
const correct = ref(0);
const finished = ref(false);
const showRetry = ref(false);
const dictTarget = ref(null);
const showGrammarTip = ref(false);
const wrongTopics = ref({});              // key -> { name, level, count }
const upsellHtml = ref('');
const lastAnswerResolved = ref(false);    // is the head question fully resolved?

const timer = useTimer(
  isPrem.value || isBasis.value
    ? { mode: 'up', initialSeconds: 0 }
    : { mode: 'down', initialSeconds: FREE_SECONDS_PER_DAY, onExpire: () => finish('Zeit abgelaufen') },
);

// Computed values for the header / score display.
const timerLabel = computed(() => formatMmSs(timer.value.value));
const wrongCount = computed(() => answered.value - correct.value);
const scorePct = computed(() =>
  answered.value > 0 ? Math.round((correct.value / answered.value) * 100) : 0,
);
const progressPct = computed(() => (queue.value ? queue.value.progressPct : 0));
// Re-read both `queueVersion` and the queue on every advance so the
// renderer remounts with a fresh `currentQuestion` reference.
const currentQuestion = computed(() => {
  // eslint-disable-next-line no-unused-expressions
  queueVersion.value;
  return queue.value ? queue.value.peek() : null;
});
const totalQuestions = computed(() => (queue.value ? queue.value.total : 0));
const questionNumber = computed(() => {
  if (!queue.value) return 0;
  // 1-based: solved count + 1, but never past the total.
  return Math.min(queue.value.solvedCount + 1, queue.value.total);
});

/** Loads the queue, restores any free-session timer, kicks things off. */
onMounted(() => {
  const all = topic.value
    ? getQuestionsByTopic(level.value, topic.value)
    : getQuestionsByLevel(level.value);
  queue.value = new AdaptiveQueue(all);
  if (!queue.value.hasNext()) {
    finished.value = true;
    return;
  }

  // For free mode, restore "time used today" from sessionStorage so
  // reload doesn't reset the daily allowance.
  if (!isPrem.value && !isBasis.value) {
    const stored = Number(sessionStorage.getItem(FREE_SESSION_KEY) || 0);
    if (stored > 0 && stored <= Date.now()) {
      const elapsed = Math.floor((Date.now() - stored) / 1000);
      const remaining = Math.max(0, FREE_SECONDS_PER_DAY - elapsed);
      timer.reset(remaining, false);
      if (remaining <= 0) {
        finish('Zeit abgelaufen');
        return;
      }
    }
  }
});

onBeforeUnmount(() => {
  // Save partial XP when navigating away mid-session.
  saveProgressEarly();
});

/**
 * Persists partial XP & streak when the user leaves mid-session so
 * answered work is never lost.
 */
function saveProgressEarly() {
  if (finished.value) return;
  if (correct.value > 0) {
    addXP(correct.value * (isPrem.value ? 2 : 1), topic.value, correct.value);
    if (answered.value > 0) recordActivityToday();
    correct.value = 0;
  }
}

/** Starts the timer + records the free-mode session start (once). */
function ensureTimerStarted() {
  if (!isPrem.value && !isBasis.value && !sessionStorage.getItem(FREE_SESSION_KEY)) {
    sessionStorage.setItem(FREE_SESSION_KEY, String(Date.now()));
  }
  timer.start();
}

/**
 * Handles the (final) `answer` event from any question component.
 *
 * Two cases collapse into one:
 *   - The MultipleChoice widget only fires `answer` after the learner
 *     picks the CORRECT option. `payload.isCorrect` is true iff there
 *     were no wrong clicks in between (i.e. `showRetry` is still false).
 *   - The other widgets (MultiSelect / DragDrop / FillBlank) fire
 *     `answer` exactly once at the end of the question.
 *
 * The score / queue are updated exactly once per question. If the
 * learner already saw the first-wrong banner the answer is counted
 * as wrong regardless of what `payload.isCorrect` says.
 *
 * @param {{isCorrect:boolean}} payload
 */
function onAnswer(payload) {
  ensureTimerStarted();
  const isCorrect = payload.isCorrect && !showRetry.value;

  if (!showRetry.value) {
    answered.value += 1;
    if (isCorrect) {
      correct.value += 1;
    } else {
      recordWrongTopic();
      showGrammarTip.value = isPrem.value;
      if (!isPrem.value) refreshUpsell();
    }
  }

  if (queue.value) {
    if (isCorrect) queue.value.consumeCorrect();
    else queue.value.consumeWrong();
  }
  lastAnswerResolved.value = true;
}

/**
 * Reacts to the MultipleChoice "first-wrong" intermediate event.
 * Records the wrong attempt (only once per question) and reveals the
 * retry banner. The queue is NOT mutated — the question stays at the
 * head until the learner finally picks the correct answer.
 */
function onFirstWrong() {
  ensureTimerStarted();
  if (!showRetry.value) {
    answered.value += 1;
    recordWrongTopic();
    showRetry.value = true;
    showGrammarTip.value = isPrem.value;
    if (!isPrem.value) refreshUpsell();
  }
}

/** Question component has finished — enables the Weiter button. */
function onComplete() {
  // The Weiter toggle is driven by `canAdvance`.
}

/**
 * Marks the current question's topic as a wrong-topic entry for the
 * post-session "Themen mit Fehlern" panel.
 */
function recordWrongTopic() {
  const q = currentQuestion.value;
  if (!q) return;
  const key = q.topic || topic.value;
  if (!key) return;
  const upper = String(key).toUpperCase();
  let displayName = upper;
  let topicLevel = q.level || level.value;
  // Lookup a friendly name from PREMIUM_TOPICS.
  for (const lvl of ['A1', 'A2', 'B1', 'B2']) {
    const found = (PREMIUM_TOPICS[lvl] || []).find(
      (t) => t.key.toUpperCase() === upper,
    );
    if (found) {
      displayName = found.name;
      topicLevel = lvl;
      break;
    }
  }
  if (!wrongTopics.value[upper]) {
    wrongTopics.value[upper] = { name: displayName, level: topicLevel, count: 0 };
  }
  wrongTopics.value[upper].count += 1;
}

/** Pick a randomised upsell message for free users on every wrong answer. */
function refreshUpsell() {
  const msgs = [
    '📚 Willst du <em>gezielt</em> trainieren? Mit Premium übst du nur deine Schwachstellen — ohne Zeitlimit.',
    '⏱️ Einmalig 4,99€ — für immer kein Limit.',
    '💡 Grammatik automatisieren? Premium gibt dir gezieltes Training, bis die Regel sitzt.',
    '🔥 Fortschritt sichtbar machen: Streak, Kalender und Medaillen warten auf dich.',
  ];
  upsellHtml.value = msgs[Math.floor(Math.random() * msgs.length)];
}

/** Advances to the next question (or finishes if the queue is empty). */
function next() {
  showRetry.value = false;
  showGrammarTip.value = false;
  upsellHtml.value = '';
  lastAnswerResolved.value = false;
  queueVersion.value += 1;
  if (!queue.value || !queue.value.hasNext()) {
    finish('Fragen zu Ende');
  }
}

/**
 * Ends the session, persists XP & streak and renders the result screen.
 *
 * @param {string} reason  Reason label used in some result screens.
 */
function finish(_reason) {
  if (finished.value) return;
  finished.value = true;
  timer.stop();
  if (answered.value > 0) recordActivityToday();
  if (correct.value > 0) {
    addXP(correct.value * (isPrem.value ? 2 : 1), topic.value, correct.value);
    correct.value = correct.value; // keep value for result screen
  }
}

/**
 * Re-routes after the session ends (back to landing or premium menu).
 */
function exitSession() {
  if (isPrem.value) router.push({ name: 'premium' });
  else router.push({ name: 'landing' });
}

/** Returns to landing (or premium for Premium users) with progress saved. */
function back() {
  saveProgressEarly();
  exitSession();
}

/**
 * Restarts a topic-specific training session. Used by the wrong-topics
 * panel on the result screen.
 *
 * @param {string} lvl   Level code.
 * @param {string} key   Topic key.
 */
function trainTopic(lvl, key) {
  router.push({ name: 'trainer', query: { level: lvl, topic: key, mode: 'premium' } });
}

/**
 * Captures clicks on `<span class="dict-word">` (Premium only) and opens
 * the dictionary popup positioned next to the word.
 *
 * @param {MouseEvent} event
 */
function onContainerClick(event) {
  const word = event.target.closest?.('.dict-word');
  if (!word || !isPrem.value) return;
  event.stopPropagation();
  dictTarget.value = {
    word: word.dataset.word,
    rect: word.getBoundingClientRect(),
  };
}

/** Result screen helpers — readable summary numbers. */
const finalXp = computed(() => correct.value * (isPrem.value ? 2 : 1));
const wrongTopicList = computed(() =>
  Object.entries(wrongTopics.value)
    .map(([k, v]) => ({ key: k, ...v }))
    .sort((a, b) => b.count - a.count),
);

/**
 * Whether the Weiter button should be enabled. A question is "done"
 * after the active widget has emitted its final `answer` event — we
 * track that via `lastAnswerResolved`, which is reset on every `next()`.
 *
 * The `showRetry` banner can still be visible at this point (the user
 * had a wrong click before getting the answer right); that does NOT
 * block advancing.
 */
const canAdvance = computed(() => lastAnswerResolved.value);
</script>

<template>
  <!-- Loading / empty queue -->
  <div v-if="!currentQuestion && !finished" class="app-shell">
    <LzdLogo />
    <h2 style="margin-top: 20px;">Lade Fragen…</h2>
  </div>

  <!-- Empty result for missing topic -->
  <div v-else-if="!currentQuestion && finished && answered === 0" class="app-shell">
    <LzdLogo />
    <h2>Keine Fragen gefunden</h2>
    <p>Für dieses Thema gibt es noch keine Fragen.</p>
    <button class="soft-btn" type="button" @click="exitSession">← Zurück</button>
  </div>

  <!-- Final result screen -->
  <div v-else-if="finished" class="app-shell">
    <LzdLogo />
    <div style="max-width: 520px; margin: 0 auto; padding: 10px 18px 30px;">
      <div
        style="
          background: #fff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.09);
          margin-bottom: 20px;
          text-align: center;
        "
      >
        <div style="font-size: 48px; margin-bottom: 8px;">
          {{ scorePct >= 80 ? '🏆' : scorePct >= 60 ? '💪' : '📚' }}
        </div>
        <div style="font-size: 22px; font-weight: 900;">
          {{ scorePct >= 80 ? 'Ausgezeichnet!' : scorePct >= 60 ? 'Gut gemacht!' : 'Weiter üben!' }}
        </div>
        <div style="font-size: 14px; color: #888; margin: 8px 0 20px;">Session beendet</div>

        <div style="display: flex; justify-content: space-around; gap: 10px;">
          <div>
            <div style="font-size: 28px; font-weight: 900; color: #AB4DBB;">
              {{ answered }}
            </div>
            <div class="small-note" style="text-transform: uppercase;">Fragen</div>
          </div>
          <div>
            <div style="font-size: 28px; font-weight: 900; color: #69c43b;">
              {{ correct }}
            </div>
            <div class="small-note" style="text-transform: uppercase;">Richtig</div>
          </div>
          <div>
            <div style="font-size: 28px; font-weight: 900; color: #ed4545;">
              {{ wrongCount }}
            </div>
            <div class="small-note" style="text-transform: uppercase;">Falsch</div>
          </div>
          <div>
            <div style="font-size: 28px; font-weight: 900;">{{ scorePct }}%</div>
            <div class="small-note" style="text-transform: uppercase;">Ergebnis</div>
          </div>
        </div>

        <div
          style="
            display: flex;
            gap: 8px;
            justify-content: center;
            flex-wrap: wrap;
            margin: 12px 0;
          "
        >
          <span
            v-if="streakState.currentStreak > 0"
            style="
              background: #fff3e0;
              border: 1px solid #ffcc80;
              border-radius: 20px;
              padding: 6px 14px;
              font-size: 13px;
              font-weight: 700;
              color: #e65100;
            "
          >
            🔥 Tag {{ streakState.currentStreak }}
          </span>
          <span
            v-if="finalXp > 0"
            style="
              background: #f3e5f5;
              border: 1px solid #ce93d8;
              border-radius: 20px;
              padding: 6px 14px;
              font-size: 13px;
              font-weight: 700;
              color: #6a1b9a;
            "
          >
            +{{ finalXp }} XP ⭐
          </span>
          <span
            style="
              background: #f3e5f5;
              border: 1px solid #ce93d8;
              border-radius: 20px;
              padding: 6px 14px;
              font-size: 13px;
              font-weight: 700;
              color: #6a1b9a;
            "
          >
            Lv{{ liveLevel.num }} {{ liveLevel.name }}
          </span>
        </div>

        <button
          class="soft-btn"
          type="button"
          style="
            background: #AB4DBB;
            color: #fff;
            border: none;
            width: 100%;
            margin-top: 10px;
          "
          @click="exitSession"
        >
          ← Zurück
        </button>
      </div>

      <div
        v-if="wrongTopicList.length > 0"
        style="
          background: #fff;
          border-radius: 20px;
          padding: 20px 22px;
          margin-bottom: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
          text-align: left;
        "
      >
        <div style="font-weight: 900; font-size: 16px; margin-bottom: 14px;">
          📋 Themen mit Fehlern
        </div>
        <div
          v-for="wt in wrongTopicList"
          :key="wt.key"
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f0e6ff;
            gap: 8px;
          "
        >
          <div style="flex: 1; min-width: 0;">
            <span
              style="
                font-size: 10px;
                font-weight: 700;
                color: #AB4DBB;
                background: #f0e6ff;
                border-radius: 20px;
                padding: 2px 7px;
                margin-right: 6px;
              "
            >
              {{ wt.level }}
            </span>
            <span style="font-weight: 700; font-size: 14px;">{{ wt.name }}</span>
            <div style="font-size: 12px; font-weight: 700; color: #ed4545; margin-top: 2px;">
              ❌ {{ wt.count }} Fehler
            </div>
          </div>
          <button
            v-if="isPrem"
            type="button"
            class="soft-btn"
            style="background: #AB4DBB; color: #fff; padding: 5px 12px; margin: 0;"
            @click="trainTopic(wt.level, wt.key)"
          >
            ▶ Trainieren
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Active question screen -->
  <div v-else class="app-shell" @click="onContainerClick">
    <LzdLogo small />

    <div class="small-note">
      {{ isPrem ? `Premium - ${level}` : `Kostenlos - ${level}` }}
      <span v-if="topic"> / {{ topic }}</span>
    </div>

    <div v-if="!isBasis" class="timer-circle">{{ timerLabel }}</div>

    <div class="streak-box">
      <div class="live-score">
        <span class="ok">✓ {{ correct }}</span>
        &nbsp;·&nbsp;
        <span class="err">✗ {{ wrongCount }}</span>
        &nbsp;·&nbsp;
        <span class="total">{{ scorePct }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progressPct}%` }" />
      </div>
    </div>

    <div class="training-badges">
      <span
        v-if="streakState.currentStreak > 0"
        style="
          background: #fff3e0;
          border: 1px solid #ffcc80;
          border-radius: 20px;
          padding: 4px 12px;
        "
      >
        🔥 Tag {{ streakState.currentStreak }}
      </span>
      <span
        style="
          background: #f3e5f5;
          border: 1px solid #ce93d8;
          border-radius: 20px;
          padding: 4px 12px;
          color: #6a1b9a;
        "
      >
        ⭐ {{ xpState.totalXP }} XP · Lv{{ liveLevel.num }}
      </span>
      <span
        v-if="isPrem"
        style="
          background: #fff8e1;
          border: 1px solid #ffe082;
          border-radius: 20px;
          padding: 4px 12px;
          color: #b8860b;
        "
      >
        💎 ×2 XP
      </span>
    </div>

    <h2 style="margin: 6px 0 12px 0;">
      Frage {{ questionNumber }} von {{ totalQuestions }}
    </h2>

    <QuestionRenderer
      :key="currentQuestion.id"
      :question="currentQuestion"
      :premium="isPrem"
      @answer="onAnswer"
      @first-wrong="onFirstWrong"
      @complete="onComplete"
    />

    <div v-if="showRetry" class="retry-hint">
      ❌ Falsch! Wähle jetzt die richtige Antwort.
    </div>

    <div v-if="showGrammarTip" style="margin: 12px 0;">
      <GrammarTip :topic-key="currentQuestion.topic || topic || ''" />
    </div>

    <div v-if="!isPrem && upsellHtml" class="upsell-hint" v-html="upsellHtml" />

    <button
      class="next-btn"
      type="button"
      :disabled="!canAdvance"
      @click="next"
    >
      Weiter
    </button>

    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 14px;">
      <button class="soft-btn" type="button" @click="finish('Manuell beendet')">
        🏁 Beenden &amp; Ergebnis
      </button>
      <button class="soft-btn" type="button" @click="back">Zurück</button>
    </div>

    <DictionaryPopup
      v-if="isPrem"
      :target="dictTarget"
      @close="dictTarget = null"
    />
  </div>
</template>
