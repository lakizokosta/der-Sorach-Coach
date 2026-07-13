<script setup>
/**
 * FillBlank — "Lückentext" question. The sentence is split on `___` and
 * the user types the missing word inside a styled `<input>`. The German
 * keyboard underneath lets touch users insert umlauts and ß without
 * switching keyboard layouts.
 *
 * First wrong check: learner may edit and try again (emits `first-wrong`);
 * the Noch-einmal button stays active. Second wrong check: shows the
 * correct word in the gap (yellow) and finalises as wrong.
 *
 * Emits:
 *   - 'first-wrong'  — fired once on the very first wrong check.
 *   - 'answer'       { isCorrect:boolean }
 *   - 'complete'
 */

import { computed, nextTick, onMounted, ref } from 'vue';
import { wrapWordsForDictionary } from '@/utils/dictionary.js';
import { stripTrailingPromptHint, normalizeGapAnswer } from '@/utils/markdownQuestion.js';
import { resolveSpatialScene } from '@/utils/prepositionSpatial.js';
import PrepositionSpatialHint from '@/components/PrepositionSpatialHint.vue';
import { useI18n } from '@/i18n/index.js';

const props = defineProps({
  question: { type: Object, required: true },
  premium: { type: Boolean, default: false },
});
const emit = defineEmits(['answer', 'first-wrong', 'complete']);

const { t } = useI18n();

const value = ref('');
const wrongChecks = ref(0);
const hadWrong = ref(false);
const finalised = ref(false);
const showSolution = ref(false);
const isOk = ref(false);
const message = ref('');
const hintVisible = ref(false);
const inputRef = ref(null);

const rawPrompt = props.question.prompt || '';
const withoutTrailing = stripTrailingPromptHint(rawPrompt);
const promptLines = withoutTrailing.split('\n').map((l) => l.trim()).filter(Boolean);
const sentenceLine = promptLines.find((l) => l.includes('___')) || promptLines[promptLines.length - 1] || '';
const instructionText = promptLines.filter((l) => l !== sentenceLine).join(' ') || '';
const displayPrompt = sentenceLine;
const parts = displayPrompt.split('___');
const acceptable = (props.question.correct || []).map((s) => normalizeGapAnswer(s));

const fillInstruction = computed(() => {
  if (instructionText) return instructionText;
  return t('trainer.fillBlankDefault');
});

const spatialScene = computed(() => resolveSpatialScene(props.question));
const showSpatialHint = computed(() => spatialScene.value !== null);

const verbInfinitive = computed(() => String(props.question.verbInfinitive || '').trim());

const partLeftHtml = computed(() =>
  props.premium ? wrapWordsForDictionary(parts[0] || '') : escapeHtml(parts[0] || ''),
);
const partRightHtml = computed(() =>
  props.premium ? wrapWordsForDictionary(parts[1] || '') : escapeHtml(parts[1] || ''),
);

/** Tiny html escape for safe v-html when the dictionary wrap is off. */
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

onMounted(() => nextTick(() => inputRef.value?.focus()));

/** Submits the typed answer. */
function check() {
  if (finalised.value) return;
  const userVal = normalizeGapAnswer(value.value);
  if (!userVal) {
    message.value = 'Bitte zuerst eine Antwort eingeben!';
    return;
  }

  if (acceptable.includes(userVal)) {
    finalised.value = true;
    isOk.value = true;
    message.value = '✅ Richtig! Sehr gut!';
    emit('answer', { isCorrect: !hadWrong.value });
    emit('complete');
    nextTick(() => inputRef.value?.blur());
    return;
  }

  wrongChecks.value += 1;
  hadWrong.value = true;

  if (wrongChecks.value === 1) {
    message.value = '';
    emit('first-wrong');
    nextTick(() => inputRef.value?.focus());
    return;
  }

  showSolution.value = true;
  finalised.value = true;
  isOk.value = false;
  value.value = props.question.correct?.[0] || value.value;
  message.value = '❌ Nicht richtig. Richtige Antwort:';
  emit('answer', { isCorrect: false });
  emit('complete');
  nextTick(() => inputRef.value?.blur());
}

/** Clears the gap so the learner can try again (until the question is finalised). */
function reset() {
  if (finalised.value) return;
  value.value = '';
  message.value = '';
  wrongChecks.value = 0;
  hadWrong.value = false;
  showSolution.value = false;
  nextTick(() => inputRef.value?.focus());
}

/**
 * Inserts a German special character at the current caret position.
 *
 * @param {string} ch  Character to insert.
 */
function insertChar(ch) {
  const input = inputRef.value;
  if (!input || input.disabled) return;
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const before = value.value.slice(0, start);
  const after = value.value.slice(end);
  value.value = before + ch + after;
  nextTick(() => {
    input.focus();
    const pos = start + ch.length;
    input.setSelectionRange(pos, pos);
  });
}

/**
 * Enter submits the answer only — never advances to the next question
 * (Trainer ignores Enter while focus is in the gap-fill input).
 *
 * @param {KeyboardEvent} ev
 */
function onKeyDown(ev) {
  if (ev.key !== 'Enter') return;
  if (!finalised.value) {
    ev.preventDefault();
    ev.stopPropagation();
    check();
  }
}

const inputClass = computed(() => ({
  'fill-input': true,
  correct: finalised.value && isOk.value,
  wrong: wrongChecks.value > 0 && !showSolution.value,
  revealed: showSolution.value,
}));

/** Size the blank so typed/correct answers always fit (shorter words → larger type). */
const inputStyle = computed(() => {
  const typedLen = value.value.length;
  const correctLens = (props.question.correct || []).map((s) => String(s).length);
  const maxCorrect = correctLens.length ? Math.max(...correctLens) : 0;
  const len = Math.max(typedLen, maxCorrect, 3);
  /* +3.5ch reserves ~0.5em padding on each side inside the box */
  const widthCh = Math.min(28, Math.max(6, len + 3.5));
  let fontSize = 18;
  if (len > 7) fontSize = 17;
  if (len > 9) fontSize = 15;
  if (len > 11) fontSize = 14;
  if (len > 13) fontSize = 13;
  if (len > 15) fontSize = 12;
  if (len > 18) fontSize = 11;
  if (len > 22) fontSize = 10;
  return {
    width: `${widthCh}ch`,
    fontSize: `${fontSize}px`,
  };
});
</script>

<template>
  <div>
    <PrepositionSpatialHint v-if="showSpatialHint" :scene="spatialScene" />
    <div class="question-box">{{ fillInstruction }}</div>

    <div class="fill-sentence">
      <span v-html="partLeftHtml" />
      <input
        ref="inputRef"
        v-model="value"
        type="text"
        autocomplete="off"
        spellcheck="false"
        :class="inputClass"
        :style="inputStyle"
        :disabled="finalised"
        @keydown="onKeyDown"
      />
      <span v-html="partRightHtml" />
    </div>

    <p v-if="verbInfinitive" class="fill-infinitive-hint">
      {{ t('trainer.infinitiveHint', { verb: verbInfinitive }) }}
    </p>

    <div class="sprach-btns">
      <button
        type="button"
        class="sprach-btn sprach-btn-check"
        :disabled="finalised"
        @click="check"
      >
        ✔ Prüfen
      </button>
      <button
        v-if="question.hint"
        type="button"
        class="sprach-btn"
        style="background: #FFB700; color: #000;"
        @click="hintVisible = true"
      >
        💡 Tipp
      </button>
      <button
        type="button"
        class="sprach-btn sprach-btn-reset"
        :disabled="finalised"
        @click="reset"
      >
        ↺ Noch einmal
      </button>
    </div>

    <div
      class="sprach-msg"
      :style="{ color: isOk ? '#4caf50' : '#ed4545' }"
    >
      {{ message }}
    </div>

    <div
      v-if="hintVisible"
      style="
        font-size: 13px;
        color: #888;
        font-style: italic;
        margin-top: 4px;
        text-align: center;
      "
    >
      💡 {{ question.hint }}
    </div>

    <p
      v-if="question.hint && !finalised"
      class="fill-choice-hint"
    >
      {{ t('trainer.fillBlankTipHint') }}
    </p>

    <div v-if="!finalised" class="de-kbd">
      <button
        v-for="ch in ['ä', 'ö', 'ü', 'Ä', 'Ö', 'Ü', 'ß']"
        :key="ch"
        type="button"
        tabindex="-1"
        @click="insertChar(ch)"
      >
        {{ ch }}
      </button>
    </div>
  </div>
</template>
