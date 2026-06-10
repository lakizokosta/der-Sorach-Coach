/**
 * Daily bonus missions — extra challenges after the base Tagesziel is met.
 * Completing a mission awards one-time bonus XP for the day.
 */

import { reactive, computed } from 'vue';
import { loadJSON, saveJSON } from './useStorage.js';
import { DAILY_GOAL_QUESTIONS, getDailyGoalSnapshot } from './useDailyGoal.js';
import { addXP, getXpSnapshot } from './useXp.js';
import { getWeakestTopics } from '@/utils/weakTopics.js';

const KEY = 'lzd_daily_bonus';

/** Extra question-count milestones (total today, incl. base goal). */
export const BONUS_TIERS = [
  { count: DAILY_GOAL_QUESTIONS + 5, reward: 5 },
  { count: DAILY_GOAL_QUESTIONS + 10, reward: 8 },
  { count: DAILY_GOAL_QUESTIONS + 15, reward: 12 },
];

/** +1 XP per correct answer after Tagesziel is met. */
export const POST_GOAL_BONUS_XP = 1;

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function daySeed() {
  const [y, m, d] = todayISO().split('-').map(Number);
  return y * 372 + m * 31 + d;
}

function defaultState() {
  return {
    date: '',
    tiersClaimed: [],
    missionsClaimed: [],
    levelCounts: {},
    topicCounts: {},
    bestStreak: 0,
  };
}

const state = reactive(loadJSON(KEY, defaultState()));

function persist() {
  saveJSON(KEY, {
    date: state.date,
    tiersClaimed: [...state.tiersClaimed],
    missionsClaimed: [...state.missionsClaimed],
    levelCounts: { ...state.levelCounts },
    topicCounts: { ...state.topicCounts },
    bestStreak: state.bestStreak,
  });
  import('@/composables/useProgressSync.js').then((m) => m.scheduleProgressPush());
}

function ensureToday() {
  const today = todayISO();
  if (state.date !== today) {
    state.date = today;
    state.tiersClaimed = [];
    state.missionsClaimed = [];
    state.levelCounts = {};
    state.topicCounts = {};
    state.bestStreak = 0;
    persist();
  }
}

/**
 * @param {number} todayCount
 * @param {ReturnType<typeof getWeakestTopics>} weakTopics
 */
function buildMissions(todayCount, weakTopics) {
  ensureToday();
  const seed = daySeed();
  const levels = ['A1', 'A2', 'B1', 'B2'];
  const level = levels[seed % 4];
  const bonusTarget = DAILY_GOAL_QUESTIONS + 5;

  const missions = [
    {
      id: 'bonus_questions',
      icon: '⚡',
      title: '5 Bonus-Fragen',
      desc: `Beantworte heute insgesamt ${bonusTarget} Fragen.`,
      reward: 5,
      target: bonusTarget,
      progress: Math.min(todayCount, bonusTarget),
      done: todayCount >= bonusTarget,
      claimed: state.missionsClaimed.includes('bonus_questions'),
      cta: { name: 'trainer', query: { level } },
      ctaLabel: 'Weiter trainieren',
    },
    {
      id: `level_${level}`,
      icon: '📚',
      title: `${level} üben`,
      desc: `Löse 3 Fragen auf Niveau ${level}.`,
      reward: 4,
      target: 3,
      progress: Math.min(state.levelCounts[level] || 0, 3),
      done: (state.levelCounts[level] || 0) >= 3,
      claimed: state.missionsClaimed.includes(`level_${level}`),
      cta: { name: 'trainer', query: { level } },
      ctaLabel: `${level} starten`,
    },
    {
      id: 'streak3',
      icon: '🎯',
      title: 'Perfekte Serie',
      desc: '3 richtige Antworten hintereinander in einer Session.',
      reward: 6,
      target: 3,
      progress: Math.min(state.bestStreak, 3),
      done: state.bestStreak >= 3,
      claimed: state.missionsClaimed.includes('streak3'),
      cta: { name: 'trainer', query: { level: 'A1' } },
      ctaLabel: 'Serie starten',
    },
  ];

  if (weakTopics.length > 0) {
    const wt = weakTopics[seed % weakTopics.length];
    const tid = `weak_${wt.key}`;
    const prog = state.topicCounts[wt.key] || 0;
    missions[2] = {
      id: tid,
      icon: '🔧',
      title: `Schwäche: ${wt.name}`,
      desc: `Löse 3 Fragen zum Thema „${wt.name}".`,
      reward: 8,
      target: 3,
      progress: Math.min(prog, 3),
      done: prog >= 3,
      claimed: state.missionsClaimed.includes(tid),
      premium: true,
      cta: {
        name: 'trainer',
        query: { level: wt.level, topic: wt.key, mode: 'premium' },
      },
      ctaLabel: 'Thema üben',
    };
  }

  return missions;
}

/**
 * Claims tier/mission rewards and returns labels for UI toasts.
 *
 * @return {!Array<{amount:number, label:string}>}
 */
function claimPendingRewards(todayCount) {
  const claimed = [];
  ensureToday();

  for (const tier of BONUS_TIERS) {
    if (todayCount >= tier.count && !state.tiersClaimed.includes(tier.count)) {
      state.tiersClaimed.push(tier.count);
      addXP(tier.reward);
      claimed.push({ amount: tier.reward, label: `${tier.count} Fragen-Bonus` });
    }
  }

  const weak = getWeakestTopics(
    getXpSnapshot().topicWrong,
    getXpSnapshot().topicCorrect,
    3,
  );
  for (const m of buildMissions(todayCount, weak)) {
    if (m.done && !m.claimed && !state.missionsClaimed.includes(m.id)) {
      state.missionsClaimed.push(m.id);
      addXP(m.reward);
      claimed.push({ amount: m.reward, label: m.title });
    }
  }

  if (claimed.length) persist();
  return claimed;
}

/**
 * Called from Trainer after each scored answer.
 *
 * @param {{level:string, topic?:string, sessionStreak:number, todayCount:number}} ctx
 * @return {!Array<{amount:number, label:string}>}
 */
export function recordBonusProgress(ctx) {
  ensureToday();
  const lvl = String(ctx.level || '').toUpperCase();
  if (lvl) {
    state.levelCounts[lvl] = (state.levelCounts[lvl] || 0) + 1;
  }
  const topicKey = String(ctx.topic || '').toUpperCase();
  if (topicKey) {
    state.topicCounts[topicKey] = (state.topicCounts[topicKey] || 0) + 1;
  }
  if (ctx.sessionStreak > state.bestStreak) {
    state.bestStreak = ctx.sessionStreak;
  }
  persist();
  return claimPendingRewards(ctx.todayCount);
}

export function useDailyBonus() {
  const todayCount = computed(() => {
    const snap = getDailyGoalSnapshot();
    const today = todayISO();
    return snap.date === today ? snap.count : 0;
  });

  const weakTopics = computed(() =>
    getWeakestTopics(
      getXpSnapshot().topicWrong,
      getXpSnapshot().topicCorrect,
      3,
    ),
  );

  const missions = computed(() =>
    buildMissions(todayCount.value, weakTopics.value),
  );

  const tiers = computed(() =>
    BONUS_TIERS.map((t) => ({
      ...t,
      done: todayCount.value >= t.count,
      claimed: state.tiersClaimed.includes(t.count),
    })),
  );

  const completedMissions = computed(
    () => missions.value.filter((m) => m.claimed).length,
  );

  return {
    missions,
    tiers,
    todayCount,
    completedMissions,
    POST_GOAL_BONUS_XP,
  };
}
