<script setup>
/**
 * TrainingHubPanel — Zufällig / Nach Thema / Wortschatz + level tabs.
 * Shared by Landing (locked teaser) and Premium (active training).
 */

import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { getTopicsForLevel } from '@/data/premiumTopics.js';
import { getTopicQuestionCount } from '@/data/questions.js';
import { getVocabSetsForLevel } from '@/data/vocabularySets.js';
import { getVocabSetQuestionCount } from '@/data/questionsVocab.js';
import { usePremium } from '@/composables/usePremium.js';
import { isTopicMastered } from '@/composables/useXp.js';
import { useCefrLevel } from '@/composables/useCefrLevel.js';
import { useI18n } from '@/i18n/index.js';

const props = defineProps({
  /** When true, panel is a gray teaser; train actions emit `locked`. */
  locked: { type: Boolean, default: false },
  /** Pass returnTo=hub into trainer query when started from Premium Hub. */
  returnToHub: { type: Boolean, default: false },
  /** Optional initial CEFR level. */
  initialLevel: { type: String, default: '' },
});

const emit = defineEmits(['unlock']);

const LEVELS = ['A1', 'A2', 'B1', 'B2'];

const router = useRouter();
const { t } = useI18n();
const { isPremium } = usePremium();
const { level: cefrLevel } = useCefrLevel();

const trainingMode = ref('random');
const activeLevel = ref('A1');

watch(
  () => props.initialLevel,
  (lvl) => {
    if (lvl && LEVELS.includes(lvl)) activeLevel.value = lvl;
  },
  { immediate: true },
);

if (!props.initialLevel && cefrLevel.value && LEVELS.includes(cefrLevel.value)) {
  activeLevel.value = cefrLevel.value;
}

const topics = computed(() => getTopicsForLevel(activeLevel.value));
const vocabSets = computed(() => getVocabSetsForLevel(activeLevel.value));

function questionCount(topicKey) {
  return getTopicQuestionCount(activeLevel.value, topicKey);
}

function vocabQuestionCount(setKey) {
  return getVocabSetQuestionCount(activeLevel.value, setKey);
}

function topicMastered(key) {
  return isTopicMastered(key);
}

function requestUnlock() {
  emit('unlock');
}

function setMode(mode) {
  trainingMode.value = mode;
}

function setLevel(lvl) {
  activeLevel.value = lvl;
}

function trainRandomLevel(lvl) {
  if (props.locked || !isPremium.value) {
    requestUnlock();
    return;
  }
  const query = { level: lvl, mode: 'premium' };
  if (props.returnToHub) query.returnTo = 'hub';
  router.push({ name: 'trainer', query });
}

function trainTopic(topicKey) {
  if (props.locked || !isPremium.value) {
    requestUnlock();
    return;
  }
  const query = {
    level: activeLevel.value,
    topic: topicKey,
    mode: 'premium',
  };
  if (props.returnToHub) query.returnTo = 'hub';
  router.push({ name: 'trainer', query });
}

function trainVocabSet(setKey) {
  if (props.locked || !isPremium.value) {
    requestUnlock();
    return;
  }
  const query = {
    level: activeLevel.value,
    set: setKey,
    mode: 'vocab',
  };
  if (props.returnToHub) query.returnTo = 'hub';
  router.push({ name: 'trainer', query });
}
</script>

<template>
  <section
    class="premium-training training-hub-panel"
    :class="{ 'training-hub-panel--locked': locked }"
    :aria-label="t('premium.trainingAria')"
  >
    <div class="training-hub-panel__head">
      <h2 class="training-hub-panel__title">
        {{ t('premium.trainingAria') }}
        <span v-if="locked" class="training-hub-panel__gem" aria-hidden="true">💎</span>
      </h2>
      <p v-if="locked" class="training-hub-panel__hint">
        {{ t('premium.hubTopicsHint') }}
      </p>
    </div>

    <div class="premium-mode-switch" role="tablist">
      <button
        type="button"
        role="tab"
        class="premium-mode-switch__btn"
        :class="{ 'premium-mode-switch__btn--active': trainingMode === 'random' }"
        :aria-selected="trainingMode === 'random'"
        @click="setMode('random')"
      >
        {{ t('premium.modeRandom') }}
      </button>
      <button
        type="button"
        role="tab"
        class="premium-mode-switch__btn"
        :class="{ 'premium-mode-switch__btn--active': trainingMode === 'topics' }"
        :aria-selected="trainingMode === 'topics'"
        @click="setMode('topics')"
      >
        {{ t('premium.modeTopics') }}
      </button>
      <button
        type="button"
        role="tab"
        class="premium-mode-switch__btn"
        :class="{ 'premium-mode-switch__btn--active': trainingMode === 'vocab' }"
        :aria-selected="trainingMode === 'vocab'"
        @click="setMode('vocab')"
      >
        {{ t('premium.modeVocab') }}
      </button>
    </div>

    <div
      class="premium-level-tabs premium-level-tabs--sticky"
      role="tablist"
      :aria-label="t('premium.chooseLevel')"
    >
      <button
        v-for="lvl in LEVELS"
        :key="lvl"
        type="button"
        role="tab"
        class="premium-level-tab"
        :class="{ 'premium-level-tab--active': activeLevel === lvl }"
        :aria-selected="activeLevel === lvl"
        @click="setLevel(lvl)"
      >
        {{ lvl }}
      </button>
    </div>

    <div v-if="trainingMode === 'random'" class="premium-random-start">
      <p class="premium-random-start__hint">{{ t('premium.randomTrainingHint') }}</p>
      <button
        type="button"
        class="premium-random-start__btn"
        :class="{ 'premium-random-start__btn--locked': locked }"
        @click="trainRandomLevel(activeLevel)"
      >
        {{
          locked
            ? `💎 ${t('premium.startRandomLevel', { level: activeLevel })}`
            : t('premium.startRandomLevel', { level: activeLevel })
        }}
      </button>
    </div>

    <div v-else-if="trainingMode === 'topics'" class="topic-grid">
      <button
        v-for="topicItem in topics"
        :key="topicItem.key"
        type="button"
        class="topic-btn"
        :class="{ 'topic-btn--locked': locked }"
        @click="trainTopic(topicItem.key)"
      >
        <div class="training-hub-panel__row">
          <div class="topic-name">
            {{ topicItem.name }}
            <span v-if="!locked && topicMastered(topicItem.key)" class="training-hub-panel__ok">✅</span>
            <span v-if="locked" class="topic-btn__lock">💎</span>
          </div>
          <div class="training-hub-panel__count">
            {{ t('premium.questionsCount', { count: questionCount(topicItem.key) }) }}
          </div>
        </div>
        <div class="topic-desc">{{ topicItem.desc }}</div>
      </button>
    </div>

    <div v-else class="topic-grid">
      <p v-if="!vocabSets.length" class="premium-vocab-empty">
        {{ t('premium.vocabEmpty', { level: activeLevel }) }}
      </p>
      <button
        v-for="setItem in vocabSets"
        :key="setItem.key"
        type="button"
        class="topic-btn topic-btn--vocab"
        :class="{ 'topic-btn--locked': locked }"
        :style="{ '--vocab-accent': setItem.theme?.accent || '#ab4dbb' }"
        @click="trainVocabSet(setItem.key)"
      >
        <div class="training-hub-panel__row">
          <div class="topic-name">
            {{ setItem.name }}
            <span v-if="locked" class="topic-btn__lock">💎</span>
          </div>
          <div class="training-hub-panel__count">
            {{ t('premium.questionsCount', { count: vocabQuestionCount(setItem.key) }) }}
          </div>
        </div>
        <div class="topic-desc">{{ setItem.desc }}</div>
      </button>
    </div>
  </section>
</template>
