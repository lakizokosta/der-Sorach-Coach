<script setup>
/**
 * Trainer — the question-flow view.
 *
 * Reads `level` and (optionally) `topic` + `mode` from the route query
 * and drives the user through a varied queue of questions. Tracks live
 * score, drives the timer (10 min cap in free mode, count-up otherwise)
 * and renders a final result screen with mastery + topic feedback.
 *
 * Route examples:
 *   /trainer?level=A1
 *   /trainer?level=B2&topic=PASSIVB2&mode=premium
 *   /trainer?mode=schwaechen
 *   /trainer?mode=placement          (Premium Niveau-Test A1–B2)
 */

import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch, markRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import LzdLogo from '@/components/LzdLogo.vue';
import GrammarTip from '@/components/GrammarTip.vue';
import DictionaryPopup from '@/components/DictionaryPopup.vue';
import QuestionRenderer from '@/components/questions/QuestionRenderer.vue';
import ConversionSheet from '@/components/ConversionSheet.vue';

import { usePremium, verifyEntitlementsLive, getPremiumRequestContext } from '@/composables/usePremium.js';
import { useXp, getLevel, recordTopicWrong } from '@/composables/useXp.js';
import { getWeakestTopics, getQuestionsForWeakTopics } from '@/utils/weakTopics.js';
import { useStreak } from '@/composables/useStreak.js';
import {
  DAILY_GOAL_QUESTIONS,
  getDailyGoalSnapshot,
  recordQuestionAnswered,
} from '@/composables/useDailyGoal.js';
import {
  POST_GOAL_BONUS_XP,
  recordBonusProgress,
} from '@/composables/useDailyBonus.js';
import {
  FREE_SECONDS_PER_DAY,
  getFreeSecondsRemaining,
  addFreeSecondsUsed,
} from '@/composables/useFreeDailyLimit.js';
import { useTimer, formatMmSs } from '@/composables/useTimer.js';

import { getQuestionsByLevel, getQuestionsByTopic, getTopicQuestionCount } from '@/data/questions.js';
import { getQuestionsByVocabSet } from '@/data/questionsVocab.js';
import { getVocabSetTheme, getVocabSetsForLevel } from '@/data/vocabularySets.js';
import { hasBackend } from '@/utils/api.js';
import { trainerRequiresPremium } from '@/utils/premiumAccess.js';
import {
  loadPremiumQuestions,
  loadWeakTopicsFromServer,
  shouldLoadQuestionsFromServer,
} from '@/utils/premiumQuestions.js';
import { PREMIUM_TOPICS } from '@/data/premiumTopics.js';
import { AdaptiveQueue } from '@/utils/queue.js';
import {
  buildPlacementQuestions,
  evaluatePlacementLevel,
  placementBreakdown,
  PLACEMENT_LEVELS,
  PLACEMENT_TOTAL,
} from '@/utils/placementTest.js';
import { setCefrLevel } from '@/composables/useCefrLevel.js';
import { useNickname } from '@/composables/useNickname.js';
import { sharePlacementCard, shareSessionCard } from '@/utils/shareCard.js';
import { useI18n } from '@/i18n/index.js';
import { PRICES_EUR } from '@/data/payment.js';

const route = useRoute();
const { t } = useI18n();
const router = useRouter();
const { isPremium, isBasis } = usePremium();
const { addXP, state: xpState, level: liveLevel, MASTERY_THRESHOLD } = useXp();
const { state: streakState } = useStreak();
const { displayName } = useNickname();

/** Free countdown at session start — used to persist seconds used today. */
let freeTimerBaseline = null;

const level = ref(route.query.level || 'A1');
const topic = ref(route.query.topic || '');
const schwaechenMode = computed(() => route.query.mode === 'schwaechen');
const placementMode = computed(() => route.query.mode === 'placement');
const vocabMode = computed(() => route.query.mode === 'vocab');
const vocabSetKey = computed(() => String(route.query.set || '').toUpperCase());
const vocabTheme = computed(() => {
  if (!vocabMode.value || !vocabSetKey.value) return null;
  return getVocabSetTheme(level.value, vocabSetKey.value);
});
const vocabSetLabel = computed(() => {
  if (!vocabSetKey.value) return '';
  const set = getVocabSetsForLevel(level.value).find((s) => s.key === vocabSetKey.value);
  return set?.name || vocabSetKey.value;
});
const vocabShellClass = computed(() => ({
  'app-shell--vocab-themed': vocabMode.value && !!vocabTheme.value,
}));
const vocabShellStyle = computed(() => {
  const theme = vocabTheme.value;
  if (!vocabMode.value || !theme) return undefined;
  const style = {
    '--vocab-tint': theme.tint,
    '--vocab-accent': theme.accent,
  };
  if (theme.image) style['--vocab-bg-image'] = `url(${theme.image})`;
  return style;
});
const schwaechenTopics = ref([]);

// `shallowRef` so Vue's reactivity does NOT deeply proxy the queue's
// internal array. Otherwise `consumeCorrect()` would mutate the inner
// array, Vue would notice, `currentQuestion` would re-compute to the
// new head, and the displayed question would jump on the same click —
// the learner would never see the green colour. Advance is driven
// explicitly by bumping `queueVersion` from `next()`.
const queue = shallowRef(null);           // AdaptiveQueue instance (raw)
const queueVersion = ref(0);              // bumped by next() to advance
const answered = ref(0);
const correct = ref(0);
const finished = ref(false);
const showRetry = ref(false);
const dictTarget = ref(null);
const showGrammarTip = ref(false);
const wrongTopics = ref({});              // key -> { name, level, count }
const upsellHtml = ref('');
const lastAnswerResolved = ref(false);    // is the head question fully resolved?
const sessionStreak = ref(0);             // consecutive correct answers this session
/** Funnel sheets — at most once per session each. */
const funnelStreakShown = ref(false);
const funnelQuestionsShown = ref(false);
const conversionSheetOpen = ref(false);
const conversionSheetVariant = ref('checkout');
/** @type {import('vue').Ref<Record<string, { correct: number, total: number }>>} */
const placementScores = ref({});
const placementDetectedLevel = ref('');
/** Why the session ended — e.g. `Zeit abgelaufen` when free daily limit hits. */
const finishReason = ref('');

/** Short-lived toast after each answer (+XP, level-up, mastery). */
const microFeedback = ref({ visible: false, lines: [], tone: 'good' });
const xpBadgePulse = ref(false);
let microFeedbackTimer = null;

/** Re-check paid access every 5 minutes during a session. */
const ENTITLEMENT_CHECK_MS = 5 * 60 * 1000;
let entitlementTimer = null;

const timer = useTimer(
  isPremium.value || isBasis.value
    ? { mode: 'up', initialSeconds: 0 }
    : { mode: 'down', initialSeconds: FREE_SECONDS_PER_DAY, onExpire: () => finish('Zeit abgelaufen') },
);

// Computed values for the header / score display.
const timerLabel = computed(() => formatMmSs(timer.value.value));
const wrongCount = computed(() => answered.value - correct.value);
const scorePct = computed(() =>
  answered.value > 0 ? Math.round((correct.value / answered.value) * 100) : 0,
);
// All queue-derived values depend on `queueVersion`, which is bumped
// only by `next()`. That makes the displayed question / progress /
// counter advance exactly when the learner clicks Weiter, never on
// the answer click itself.
const currentQuestion = computed(() => {
  // eslint-disable-next-line no-unused-expressions
  queueVersion.value;
  return queue.value ? queue.value.peek() : null;
});
const progressPct = computed(() => {
  // eslint-disable-next-line no-unused-expressions
  queueVersion.value;
  return queue.value ? queue.value.progressPct : 0;
});
const totalQuestions = computed(() => (queue.value ? queue.value.total : 0));
const questionNumber = computed(() => {
  // eslint-disable-next-line no-unused-expressions
  queueVersion.value;
  if (!queue.value) return 0;
  // 1-based: solved count + 1, but never past the total.
  return Math.min(queue.value.solvedCount + 1, queue.value.total);
});

/** Friendly topic label for the active question (Premium topic grid names). */
const currentTopicName = computed(() => {
  const q = currentQuestion.value;
  if (!q?.topic) return '';
  const lvl = q.level || level.value;
  const found = (PREMIUM_TOPICS[lvl] || []).find(
    (t) => t.key.toUpperCase() === String(q.topic).toUpperCase(),
  );
  return found?.name || q.topic;
});

/** Pool size of the current question's topic (shown in level-wide sessions). */
const currentTopicPoolSize = computed(() => {
  const q = currentQuestion.value;
  if (!q?.topic || topic.value) return 0;
  return getTopicQuestionCount(q.level, q.topic);
});

const topicPoolHint = computed(() => {
  if (!currentTopicPoolSize.value || !currentTopicName.value) return '';
  return t('trainer.topicPool', {
    topic: currentTopicName.value,
    count: currentTopicPoolSize.value,
  });
});

/** Label for session result screen and share card (level · topic). */
const sessionTopicLabel = computed(() => {
  if (vocabMode.value && vocabSetLabel.value) {
    return `${level.value} · ${vocabSetLabel.value}`;
  }
  if (topic.value) {
    const found = (PREMIUM_TOPICS[level.value] || []).find(
      (item) => item.key.toUpperCase() === String(topic.value).toUpperCase(),
    );
    return found ? `${level.value} · ${found.name}` : `${level.value} · ${topic.value}`;
  }
  if (schwaechenMode.value) return t('trainer.schwaechenShareLabel');
  return level.value;
});

const xpPerAnswer = computed(() => (isPremium.value ? 2 : 1));

/** Canonical topic key for mastery / XP attribution. */
function activeTopicKey() {
  const q = currentQuestion.value;
  return String(q?.topic || topic.value || '').toUpperCase();
}

/**
 * Shows a floating micro-feedback toast near the XP badge.
 *
 * @param {string[]} lines
 * @param {('good'|'bad'|'celebrate')} tone
 */
function showMicroFeedback(lines, tone) {
  if (!lines.length) return;
  if (microFeedbackTimer) clearTimeout(microFeedbackTimer);
  microFeedback.value = { visible: true, lines, tone };
  xpBadgePulse.value = true;
  setTimeout(() => {
    xpBadgePulse.value = false;
  }, 500);
  microFeedbackTimer = setTimeout(() => {
    microFeedback.value = { ...microFeedback.value, visible: false };
  }, 2200);
}

/**
 * Applies an immediate XP change and triggers micro-feedback.
 *
 * @param {boolean} wasCorrect
 * @param {string[]} [extraLines]
 */
function applyAnswerXp(wasCorrect, extraLines = []) {
  const delta = wasCorrect ? xpPerAnswer.value : -xpPerAnswer.value;
  const topicKey = activeTopicKey();
  const levelBefore = getLevel(xpState.totalXP);
  const topicCountBefore = topicKey ? (xpState.topicCorrect[topicKey] || 0) : 0;

  addXP(delta, topicKey || undefined, wasCorrect ? 1 : topicKey ? -1 : undefined);

  const lines = [wasCorrect ? `+${delta} XP` : `${delta} XP`, ...extraLines];
  const levelAfter = getLevel(xpState.totalXP);
  let tone = wasCorrect ? 'good' : 'bad';

  if (levelAfter.num > levelBefore.num) {
    lines.push(`🎉 Lv${levelAfter.num} — ${levelAfter.name}!`);
    tone = 'celebrate';
  }

  if (wasCorrect && topicKey) {
    const countAfter = xpState.topicCorrect[topicKey] || 0;
    if (topicCountBefore < MASTERY_THRESHOLD && countAfter >= MASTERY_THRESHOLD) {
      lines.push('🏆 Thema gemeistert!');
      tone = 'celebrate';
    }
  }

  if (extraLines.some((line) => line.includes('🎁'))) {
    tone = 'celebrate';
  }

  showMicroFeedback(lines, tone);
}

/**
 * Tracks bonus missions and awards post-goal XP after Tagesziel is exceeded.
 *
 * @param {boolean} wasCorrect
 * @return {string[]}
 */
function collectBonusLines(wasCorrect) {
  if (wasCorrect) sessionStreak.value += 1;
  else sessionStreak.value = 0;

  const snap = getDailyGoalSnapshot();
  const today = new Date().toISOString().split('T')[0];
  const todayCount = snap.date === today ? snap.count : 0;
  const lines = [];

  if (wasCorrect && todayCount > DAILY_GOAL_QUESTIONS) {
    addXP(POST_GOAL_BONUS_XP);
    lines.push(`+${POST_GOAL_BONUS_XP} Bonus-XP`);
  }

  const rewards = recordBonusProgress({
    level: level.value,
    topic: activeTopicKey(),
    sessionStreak: sessionStreak.value,
    todayCount,
  });
  for (const reward of rewards) {
    lines.push(`🎁 +${reward.amount} XP — ${reward.label}`);
  }

  return lines;
}

/** Loads the queue, restores any free-session timer, kicks things off. */
async function ensureAccessBeforeLoad() {
  const needsPremium = trainerRequiresPremium(route.query);
  const needsPaid = needsPremium || isPremium.value || isBasis.value;

  if (!needsPaid) return true;

  if (!hasBackend()) {
    if (needsPremium) return false;
    return isPremium.value || isBasis.value;
  }

  const verified = await verifyEntitlementsLive();
  if (!verified.ok) return false;
  if (needsPremium && !verified.isPremium) return false;
  if ((isPremium.value || isBasis.value) && !verified.isPremium && !verified.isBasis) {
    return false;
  }
  return true;
}

/** Builds the question list for the current route mode. */
async function loadSessionQuestions() {
  const authCtx = getPremiumRequestContext();
  const useServer = shouldLoadQuestionsFromServer(route.query);

  if (placementMode.value) {
    placementScores.value = Object.fromEntries(
      PLACEMENT_LEVELS.map((lvl) => [lvl, { correct: 0, total: 0 }]),
    );
    return buildPlacementQuestions(useServer ? authCtx : null);
  }
  if (schwaechenMode.value) {
    schwaechenTopics.value = getWeakestTopics(
      xpState.topicWrong,
      xpState.topicCorrect,
      3,
    );
    if (useServer) {
      return loadWeakTopicsFromServer(schwaechenTopics.value, authCtx);
    }
    return getQuestionsForWeakTopics(schwaechenTopics.value);
  }
  if (vocabMode.value) {
    const setKey = String(route.query.set || '').trim();
    if (!setKey) return [];
    return getQuestionsByVocabSet(level.value, setKey);
  }
  if (topic.value) {
    if (useServer) {
      return loadPremiumQuestions({
        level: level.value,
        topic: topic.value,
        ...authCtx,
      });
    }
    return getQuestionsByTopic(level.value, topic.value);
  }
  if (useServer && route.query.mode === 'premium') {
    return loadPremiumQuestions({
      level: level.value,
      ...authCtx,
    });
  }
  return getQuestionsByLevel(level.value);
}

function stopEntitlementPolling() {
  if (entitlementTimer) {
    clearInterval(entitlementTimer);
    entitlementTimer = null;
  }
}

/** Ends the session when server revokes paid access mid-training. */
async function runEntitlementCheck() {
  const verified = await verifyEntitlementsLive();
  if (verified.degraded) return;

  const needsPremium = trainerRequiresPremium(route.query);
  const needsPaid = needsPremium || isPremium.value || isBasis.value;

  if (!verified.ok) {
    finish('Session beendet');
    stopEntitlementPolling();
    router.replace({ name: 'landing' });
    return;
  }
  if (needsPremium && !verified.isPremium) {
    finish('Session beendet');
    stopEntitlementPolling();
    router.replace({ name: 'premium', query: { hub: '1' } });
    return;
  }
  if (needsPaid && !verified.isPremium && !verified.isBasis) {
    finish('Session beendet');
    stopEntitlementPolling();
    router.replace({ name: 'landing' });
  }
}

function startEntitlementPolling() {
  stopEntitlementPolling();
  if (!hasBackend()) return;
  if (!isPremium.value && !isBasis.value && !trainerRequiresPremium(route.query)) return;
  entitlementTimer = setInterval(runEntitlementCheck, ENTITLEMENT_CHECK_MS);
}

/** Clears in-session state when route params change or a round restarts. */
function resetTrainerSessionState() {
  answered.value = 0;
  correct.value = 0;
  finished.value = false;
  finishReason.value = '';
  showRetry.value = false;
  showGrammarTip.value = false;
  upsellHtml.value = '';
  wrongTopics.value = {};
  lastAnswerResolved.value = false;
  sessionStreak.value = 0;
  microFeedback.value = { visible: false, lines: [], tone: 'good' };
  freeTimerBaseline = null;
  placementDetectedLevel.value = '';
  placementScores.value = {};
  level.value = String(route.query.level || 'A1');
  topic.value = String(route.query.topic || '');
  queue.value = null;
  queueVersion.value += 1;
}

async function initTrainer() {
  if ((schwaechenMode.value || placementMode.value || vocabMode.value) && !isPremium.value) {
    router.replace({ name: 'premium', query: { hub: '1' } });
    return;
  }

  const accessOk = await ensureAccessBeforeLoad();
  if (!accessOk) {
    if (
      schwaechenMode.value
      || placementMode.value
      || vocabMode.value
      || (topic.value && route.query.mode === 'premium')
    ) {
      router.replace({ name: 'premium', query: { hub: '1' } });
    } else {
      router.replace({ name: 'landing' });
    }
    return;
  }

  let all;
  try {
    all = await loadSessionQuestions();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[trainer] failed to load questions', err);
    finished.value = true;
    return;
  }

  queue.value = new AdaptiveQueue(all, { shuffle: !placementMode.value });
  if (!queue.value.hasNext()) {
    finished.value = true;
    return;
  }

  if (!isPremium.value && !isBasis.value) {
    const remaining = getFreeSecondsRemaining();
    timer.reset(remaining, false);
    if (remaining <= 0) {
      finish('Zeit abgelaufen');
    }
  }

  startEntitlementPolling();
}

onMounted(() => {
  initTrainer();
  window.addEventListener('keydown', onTrainerKeydown);
});

watch(
  () => [route.query.mode, route.query.level, route.query.topic, route.query.set].join('|'),
  async (nextKey, prevKey) => {
    if (prevKey === undefined) return;
    if (nextKey === prevKey) return;
    resetTrainerSessionState();
    stopEntitlementPolling();
    await initTrainer();
  },
);

onBeforeUnmount(() => {
  delete document.documentElement.dataset.funnelSticky;
  stopEntitlementPolling();
  window.removeEventListener('keydown', onTrainerKeydown);
  if (microFeedbackTimer) clearTimeout(microFeedbackTimer);
  saveProgressEarly();
});

/**
 * Persists free-mode seconds used today (localStorage, per calendar day).
 */
function persistFreeTimeUsed() {
  if (isPremium.value || isBasis.value || freeTimerBaseline == null) return;
  const used = Math.max(0, freeTimerBaseline - timer.value.value);
  addFreeSecondsUsed(used);
  freeTimerBaseline = timer.value.value;
}

/**
 * Called when the user leaves mid-session. XP is already persisted per
 * answer; streak is tied to the daily goal (Tagesziel), not early exit.
 */
function saveProgressEarly() {
  if (finished.value) return;
  persistFreeTimeUsed();
}

/** Starts the timer and snapshots the free countdown baseline. */
function ensureTimerStarted() {
  if (!isPremium.value && !isBasis.value && freeTimerBaseline == null) {
    freeTimerBaseline = timer.value.value;
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
function trackPlacementAnswer(isCorrect) {
  const lvl = currentQuestion.value?.level;
  if (!lvl || !placementScores.value[lvl]) return;
  placementScores.value[lvl].total += 1;
  if (isCorrect) placementScores.value[lvl].correct += 1;
}

function onAnswer(payload) {
  ensureTimerStarted();
  const isCorrect = payload.isCorrect && !showRetry.value;

  if (!showRetry.value) {
    answered.value += 1;
    if (placementMode.value) {
      trackPlacementAnswer(isCorrect);
    } else {
      recordQuestionAnswered();
    }
    if (isCorrect) {
      correct.value += 1;
      if (!placementMode.value) {
        applyAnswerXp(true, collectBonusLines(true));
      }
    } else if (!placementMode.value) {
      collectBonusLines(false);
      applyAnswerXp(false);
      recordWrongTopic();
      showGrammarTip.value = isPremium.value;
      if (!isPremium.value) refreshUpsell();
    }
  }

  if (queue.value) {
    if (isCorrect || placementMode.value) queue.value.consumeCorrect();
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
    if (placementMode.value) {
      trackPlacementAnswer(false);
    } else {
      recordQuestionAnswered();
      collectBonusLines(false);
      applyAnswerXp(false);
      recordWrongTopic();
    }
    showRetry.value = true;
    if (!placementMode.value) {
      showGrammarTip.value = isPremium.value;
      if (!isPremium.value) refreshUpsell();
    }
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
  recordTopicWrong(upper);
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
function finalizePlacementResult() {
  const detected = evaluatePlacementLevel(placementScores.value);
  placementDetectedLevel.value = detected;
  setCefrLevel(detected, {
    scores: { ...placementScores.value },
    totalCorrect: correct.value,
    totalAnswered: answered.value,
  });
}

function next() {
  showRetry.value = false;
  showGrammarTip.value = false;
  upsellHtml.value = '';
  lastAnswerResolved.value = false;
  queueVersion.value += 1;
  if (!queue.value || !queue.value.hasNext()) {
    if (placementMode.value) finalizePlacementResult();
    finish('Fragen zu Ende');
  }
}

function startPlacement() {
  router.push({ name: 'trainer', query: { mode: 'placement' } });
}

function trainAtDetectedLevel() {
  const lvl = placementDetectedLevel.value;
  if (!lvl) return;
  router.push({ name: 'trainer', query: { level: lvl, mode: 'premium' } });
}

function sharePlacementResult() {
  if (!placementDetectedLevel.value) return;
  sharePlacementCard({
    level: placementDetectedLevel.value,
    breakdown: placementBreakdownRows.value,
    scorePct: scorePct.value,
    nickname: displayName.value,
    shareTitle: t('trainer.placementShareTitle'),
    shareText: t('trainer.placementShareText', {
      level: placementDetectedLevel.value,
    }),
  });
}

function shareSessionResult() {
  if (answered.value === 0 || placementDetectedLevel.value || freeTimeExpired.value) return;
  shareSessionCard({
    scorePct: scorePct.value,
    answered: answered.value,
    correct: correct.value,
    wrong: wrongCount.value,
    xpEarned: finalXp.value,
    streak: streakState.currentStreak,
    levelNum: liveLevel.num,
    levelName: liveLevel.name,
    nickname: displayName.value,
    sessionLabel: sessionTopicLabel.value,
    headline: sessionResultHeadline.value,
    shareTitle: t('trainer.sessionShareTitle'),
    shareText: t('trainer.sessionShareText', {
      scorePct: scorePct.value,
      correct: correct.value,
      answered: answered.value,
    }),
  });
}

/**
 * Ends the session, persists XP & streak and renders the result screen.
 *
 * @param {string} reason  Reason label used in some result screens.
 */
function finish(reason) {
  if (finished.value) return;
  finishReason.value = reason || '';
  persistFreeTimeUsed();
  finished.value = true;
  timer.stop();
}

/**
 * Re-routes after the session ends (back to landing home).
 */
function exitSession() {
  router.push({ name: 'landing' });
}

/**
 * Restarts the same session without leaving the page.
 * Resets all state and rebuilds the queue with the same params.
 */
async function restartSession() {
  resetTrainerSessionState();

  const accessOk = await ensureAccessBeforeLoad();
  if (!accessOk) {
    stopEntitlementPolling();
    router.replace({ name: 'premium', query: { hub: '1' } });
    return;
  }

  let all;
  try {
    all = await loadSessionQuestions();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[trainer] failed to reload questions', err);
    finished.value = true;
    return;
  }

  queue.value = new AdaptiveQueue(all, { shuffle: !placementMode.value });
  queueVersion.value += 1;

  if (!isPremium.value && !isBasis.value) {
    const remaining = getFreeSecondsRemaining();
    timer.reset(remaining, false);
  } else {
    timer.reset(0, false);
  }
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
  const query = { level: lvl, topic: key, mode: 'premium' };
  if (route.query.returnTo === 'hub') query.returnTo = 'hub';
  router.push({ name: 'trainer', query });
}

/**
 * Captures clicks on `<span class="dict-word">` (Premium only) and opens
 * the dictionary popup positioned next to the word.
 *
 * @param {MouseEvent} event
 */
function onContainerClick(event) {
  const word = event.target.closest?.('.dict-word');
  if (!word || !isPremium.value) return;
  event.stopPropagation();
  dictTarget.value = {
    word: word.dataset.word,
    anchor: markRaw(word),
    token: Date.now(),
  };
}

/** Result screen helpers — readable summary numbers. */
const finalXp = computed(() => correct.value * (isPremium.value ? 2 : 1));
const wrongTopicList = computed(() =>
  Object.entries(wrongTopics.value)
    .map(([k, v]) => ({ key: k, ...v }))
    .sort((a, b) => b.count - a.count),
);

const placementBreakdownRows = computed(() =>
  placementMode.value && placementDetectedLevel.value
    ? placementBreakdown(placementScores.value)
    : [],
);

const freeTimeExpired = computed(
  () => finishReason.value === 'Zeit abgelaufen' && !isPremium.value && !isBasis.value,
);

const sessionResultHeadline = computed(() => {
  if (freeTimeExpired.value) return t('trainer.freeTimeExpiredTitle');
  if (placementDetectedLevel.value) return `Dein Niveau: ${placementDetectedLevel.value}`;
  if (scorePct.value >= 80) return t('trainer.excellent');
  if (scorePct.value >= 60) return t('trainer.goodJob');
  return t('trainer.keepPracticing');
});

/** Sticky upsell bar in free trainer mode (Concept A). */
const showFunnelSticky = computed(
  () =>
    !isPremium.value &&
    !isBasis.value &&
    !finished.value &&
    !!currentQuestion.value &&
    !placementMode.value &&
    !schwaechenMode.value,
);

watch(
  showFunnelSticky,
  (on) => {
    if (on) document.documentElement.dataset.funnelSticky = '1';
    else delete document.documentElement.dataset.funnelSticky;
  },
  { immediate: true },
);

function openFunnelCheckout(variant = 'checkout') {
  conversionSheetVariant.value = variant;
  conversionSheetOpen.value = true;
}

function openBasisPage() {
  router.push({ name: 'premium', query: { focus: 'basis', hub: '1' } });
}

watch(sessionStreak, (val) => {
  if (
    val === 10 &&
    !funnelStreakShown.value &&
    !isPremium.value &&
    !isBasis.value &&
    !finished.value
  ) {
    funnelStreakShown.value = true;
    openFunnelCheckout('streak10');
  }
});

watch(answered, (val) => {
  if (
    val === 15 &&
    !funnelQuestionsShown.value &&
    !isPremium.value &&
    !isBasis.value &&
    !finished.value &&
    !conversionSheetOpen.value
  ) {
    funnelQuestionsShown.value = true;
    openFunnelCheckout('questions15');
  }
});

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

const trainerRootRef = ref(null);
const nextBtnRef = ref(null);

/** Focusable action buttons in DOM order (skips tabindex=-1, e.g. umlaut keys). */
function getTrainerButtons() {
  const root = trainerRootRef.value;
  if (!root) return [];
  return [...root.querySelectorAll('button')].filter(
    (btn) => !btn.disabled && btn.tabIndex !== -1,
  );
}

/** Moves keyboard focus to the next/previous trainer button. */
function moveButtonFocus(direction) {
  const buttons = getTrainerButtons();
  if (!buttons.length) return;
  const active = document.activeElement;
  const idx = buttons.indexOf(active);
  if (idx === -1) {
    buttons[0].focus();
    return;
  }
  const nextIdx = idx + direction;
  if (nextIdx >= 0 && nextIdx < buttons.length) {
    buttons[nextIdx].focus();
  }
}

/**
 * Global keyboard shortcuts for the active session:
 *   Enter  → Weiter (after the question is resolved; not from gap-fill input)
 *   Arrows → move focus between buttons (Prüfen, Antworten, Weiter, …)
 */
function onTrainerKeydown(ev) {
  if (finished.value || !currentQuestion.value) return;

  const active = document.activeElement;
  const fromFillInput =
    ev.target?.matches?.('input.fill-input') ||
    active?.matches?.('input.fill-input');

  if (ev.key === 'Enter') {
    if (fromFillInput) return;
    if (canAdvance.value) {
      ev.preventDefault();
      next();
    }
    return;
  }

  const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[ev.key];
  if (!dir) return;

  // Keep arrow keys for caret movement inside the gap-fill input.
  if (active?.matches?.('input.fill-input, textarea')) return;

  ev.preventDefault();
  moveButtonFocus(dir);
}

watch(lastAnswerResolved, (resolved) => {
  if (resolved) {
    nextTick(() => nextBtnRef.value?.focus());
  }
});
</script>

<template>
  <!-- Loading / empty queue -->
  <div
    v-if="!currentQuestion && !finished"
    class="app-shell"
    :class="vocabShellClass"
    :style="vocabShellStyle"
  >
    <LzdLogo />
    <h2 style="margin-top: 20px;">{{ t('trainer.loading') }}</h2>
  </div>

  <!-- Empty result for missing topic -->
  <div
    v-else-if="!currentQuestion && finished && answered === 0"
    class="app-shell"
    :class="vocabShellClass"
    :style="vocabShellStyle"
  >
    <LzdLogo />
    <h2>{{ t('trainer.noQuestions') }}</h2>
    <p v-if="schwaechenMode">{{ t('schwaechen.bodyNoErrors') }}</p>
    <p v-else-if="placementMode">{{ t('trainer.noQuestionsLevel') }}</p>
    <p v-else>{{ t('trainer.noQuestionsTopic') }}</p>
    <button class="soft-btn" type="button" @click="exitSession">{{ t('trainer.back') }}</button>
  </div>

  <!-- Final result screen -->
  <div
    v-else-if="finished"
    class="app-shell"
    :class="vocabShellClass"
    :style="vocabShellStyle"
  >
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
          {{
            freeTimeExpired
              ? '⏱️'
              : placementDetectedLevel
                ? '🎯'
                : scorePct >= 80
                  ? '🏆'
                  : scorePct >= 60
                    ? '💪'
                    : '📚'
          }}
        </div>
        <div style="font-size: 22px; font-weight: 900;">
          {{
            freeTimeExpired
              ? t('trainer.freeTimeExpiredTitle')
              : placementDetectedLevel
                ? `Dein Niveau: ${placementDetectedLevel}`
                : scorePct >= 80
                  ? t('trainer.excellent')
                  : scorePct >= 60
                    ? t('trainer.goodJob')
                    : t('trainer.keepPracticing')
          }}
        </div>
        <div
          v-if="freeTimeExpired"
          class="trainer-free-limit-msg"
        >
          {{ t('trainer.freeTimeExpiredMessage') }}
        </div>

        <div v-if="freeTimeExpired" class="funnel-timer-end">
          <p class="funnel-timer-end__lead">{{ t('funnel.timerEndLead') }}</p>
          <button
            type="button"
            class="funnel-timer-end__cta funnel-timer-end__cta--premium"
            @click="openFunnelCheckout('checkout')"
          >
            {{ t('funnel.ctaPremium3') }}
          </button>
          <button
            type="button"
            class="funnel-timer-end__cta funnel-timer-end__cta--basis"
            @click="openBasisPage"
          >
            {{ t('funnel.basisBtn', { price: PRICES_EUR.basis }) }}
          </button>
          <button
            type="button"
            class="funnel-timer-end__ghost"
            @click="exitSession"
          >
            {{ t('funnel.timerEndTomorrow') }}
          </button>
        </div>
        <div
          v-else
          style="font-size: 14px; color: #888; margin: 8px 0 20px;"
        >
          {{ placementDetectedLevel ? 'Niveau-Test abgeschlossen' : t('trainer.sessionEnded') }}
        </div>

        <div
          v-if="placementDetectedLevel"
          style="text-align: left; margin-bottom: 16px; font-size: 13px; color: #555;"
        >
          <p style="margin: 0 0 10px 0; line-height: 1.5;">
            Bonus-Aufgaben und Trainingsempfehlungen werden ab jetzt an
            <strong>{{ placementDetectedLevel }}</strong> angepasst.
          </p>
          <div
            v-for="row in placementBreakdownRows"
            :key="row.level"
            style="display: flex; justify-content: space-between; padding: 4px 0;"
          >
            <span>{{ row.level }}</span>
            <span>{{ row.correct }}/{{ row.total }} ({{ row.pct }}%)</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-around; gap: 10px;">
          <div>
            <div style="font-size: 28px; font-weight: 900; color: #AB4DBB;">
              {{ answered }}
            </div>
            <div class="small-note" style="text-transform: uppercase;">{{ t('trainer.questionsLabel') }}</div>
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
          v-if="placementDetectedLevel"
          type="button"
          class="trainer-placement-share"
          @click="sharePlacementResult"
        >
          {{ t('trainer.placementShare') }}
        </button>

        <button
          v-if="!placementDetectedLevel && !freeTimeExpired && answered > 0"
          type="button"
          class="trainer-placement-share"
          @click="shareSessionResult"
        >
          {{ t('trainer.sessionShare') }}
        </button>

        <button
          v-if="placementDetectedLevel"
          class="soft-btn"
          type="button"
          style="
            background: #AB4DBB;
            color: #fff;
            border: none;
            width: 100%;
            margin-top: 10px;
          "
          @click="trainAtDetectedLevel"
        >
          ▶ {{ placementDetectedLevel }} trainieren
        </button>

        <button
          v-if="!placementDetectedLevel && !freeTimeExpired"
          class="soft-btn"
          type="button"
          style="
            background: #AB4DBB;
            color: #fff;
            border: none;
            width: 100%;
            margin-top: 10px;
            font-size: 17px;
            font-weight: 900;
            padding: 14px;
          "
          @click="restartSession"
        >
          ▶ Neue Runde starten
        </button>

        <button
          v-if="!freeTimeExpired"
          class="soft-btn"
          type="button"
          :style="{
            background: '#f5f5f5',
            color: '#333',
            border: '1.5px solid #ddd',
            width: '100%',
            marginTop: '10px',
          }"
          @click="exitSession"
        >
          {{ t('trainer.back') }}
        </button>

        <button
          v-if="isPremium && !placementDetectedLevel"
          class="soft-btn"
          type="button"
          style="
            background: #e3f2fd;
            color: #1565c0;
            border: 1.5px solid #90caf9;
            width: 100%;
            margin-top: 10px;
          "
          @click="startPlacement"
        >
          Niveau testen (Premium)
        </button>
      </div>

      <div
        v-if="wrongTopicList.length > 0 && !placementDetectedLevel"
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
            v-if="isPremium"
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
  <div
    v-else
    ref="trainerRootRef"
    class="app-shell"
    :class="[{ 'app-shell--funnel': showFunnelSticky }, vocabShellClass]"
    :style="vocabShellStyle"
    @click="onContainerClick"
  >
    <LzdLogo small />

    <div class="small-note">
      <template v-if="placementMode">
        {{ t('trainer.placementLabel', { count: PLACEMENT_TOTAL }) }}
        <span v-if="currentQuestion"> — {{ currentQuestion.level }}</span>
        <span class="placement-hint"> · zählt nicht zum Tagesziel</span>
      </template>
      <template v-else-if="schwaechenMode">
        🎯 Schwächen-Modus
        <span v-if="schwaechenTopics.length">
          — {{ schwaechenTopics.map((t) => t.name).join(' · ') }}
        </span>
      </template>
      <template v-else-if="vocabMode">
        📚 {{ t('trainer.vocabLabel', { level }) }}
        <span v-if="vocabSetLabel"> / {{ vocabSetLabel }}</span>
      </template>
      <template v-else>
        {{
          isPremium
            ? t('trainer.premium', { level })
            : t('trainer.free', { level })
        }}
        <span v-if="topic"> / {{ topic }}</span>
      </template>
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

    <div class="training-badges-wrap">
      <div class="training-badges">
        <span
          v-if="streakState.currentStreak > 0"
          class="training-badge training-badge--streak"
        >
          🔥 Tag {{ streakState.currentStreak }}
        </span>
        <span
          class="training-badge training-badge--xp"
          :class="{ 'training-badge--pulse': xpBadgePulse }"
        >
          ⭐ {{ xpState.totalXP }} XP · Lv{{ liveLevel.num }}
        </span>
        <span v-if="isPremium" class="training-badge training-badge--prem">
          💎 ×2 XP
        </span>
      </div>

      <Transition name="micro-fb">
        <div
          v-if="microFeedback.visible"
          class="micro-feedback"
          :class="`micro-feedback--${microFeedback.tone}`"
          role="status"
          aria-live="polite"
        >
          <div
            v-for="(line, idx) in microFeedback.lines"
            :key="idx"
            class="micro-feedback__line"
          >
            {{ line }}
          </div>
        </div>
      </Transition>
    </div>

    <h2 style="margin: 6px 0 4px 0;">
      {{ t('trainer.question', { current: questionNumber, total: totalQuestions }) }}
    </h2>
    <p v-if="topicPoolHint" class="small-note" style="margin: 0 0 12px 0;">
      {{ topicPoolHint }}
    </p>

    <QuestionRenderer
      :key="currentQuestion.id"
      :question="currentQuestion"
      :premium="isPremium"
      @answer="onAnswer"
      @first-wrong="onFirstWrong"
      @complete="onComplete"
    />

    <div v-if="showRetry && !canAdvance" class="retry-hint">
      {{ t('trainer.wrongRetry') }}
    </div>

    <div v-if="showGrammarTip" style="margin: 12px 0;">
      <GrammarTip :topic-key="currentQuestion.topic || topic || ''" />
    </div>

    <div v-if="!isPremium && upsellHtml" class="upsell-hint" v-html="upsellHtml" />

    <button
      ref="nextBtnRef"
      class="next-btn"
      type="button"
      :disabled="!canAdvance"
      @click="next"
    >
      {{ t('trainer.next') }}
    </button>

    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 14px;">
      <button class="soft-btn" type="button" @click="finish('Manuell beendet')">
        {{ t('trainer.finish') }}
      </button>
      <button class="soft-btn" type="button" @click="back">{{ t('trainer.backShort') }}</button>
    </div>

    <DictionaryPopup
      v-if="isPremium"
      :target="dictTarget"
      @close="dictTarget = null"
    />

    <div v-if="showFunnelSticky" class="funnel-sticky" role="complementary">
      <div class="funnel-sticky__meta">
        <span class="funnel-sticky__level">{{ level }}</span>
        <span class="funnel-sticky__dot">·</span>
        <span class="funnel-sticky__timer">⏱ {{ timerLabel }}</span>
      </div>
      <button
        type="button"
        class="funnel-sticky__cta"
        @click="openFunnelCheckout('checkout')"
      >
        {{ t('funnel.stickyCta') }}
      </button>
    </div>
  </div>

  <ConversionSheet
    v-model="conversionSheetOpen"
    :variant="conversionSheetVariant"
    plan="3months"
  />
</template>
