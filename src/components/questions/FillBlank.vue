<script setup>
/**
 * FillBlank — "Lückentext" question. The sentence is split on `___` and
 * the user types the missing word inside a styled `<input>`. The German
 * keyboard underneath lets touch users insert umlauts and ß without
 * switching keyboard layouts.
 *
 * Emits:
 *   - 'answer'   { isCorrect:boolean }
 *   - 'complete'
 */

import { computed, nextTick, onMounted, ref } from 'vue';
import { wrapWordsForDictionary } from '@/utils/dictionary.js';
import { resolveSpatialScene } from '@/utils/prepositionSpatial.js';
import PrepositionSpatialHint from '@/components/PrepositionSpatialHint.vue';

const props = defineProps({
  question: { type: Object, required: true },
  premium: { type: Boolean, default: false },
});
const emit = defineEmits(['answer', 'complete']);

const value = ref('');
const checked = ref(false);
const isOk = ref(false);
const message = ref('');
const hintVisible = ref(false);
const inputRef = ref(null);

const parts = (props.question.prompt || '').split('___');
const acceptable = (props.question.correct || []).map((s) => String(s).toLowerCase());

const spatialScene = computed(() => resolveSpatialScene(props.question));
const showSpatialHint = computed(() => spatialScene.value !== null);

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
  if (checked.value) return;
  const userVal = value.value.trim().toLowerCase();
  if (!userVal) {
    message.value = 'Bitte zuerst eine Antwort eingeben!';
    return;
  }
  checked.value = true;
  isOk.value = acceptable.includes(userVal);
  if (isOk.value) {
    message.value = '✅ Richtig! Sehr gut!';
  } else {
    message.value = '❌ Nicht richtig. Schau dir die Antwort an!';
    value.value = props.question.correct?.[0] || value.value;
  }
  emit('answer', { isCorrect: isOk.value });
  emit('complete');
  nextTick(() => inputRef.value?.blur());
}

/** Resets the question without affecting the score. */
function reset() {
  if (checked.value) return;
  value.value = '';
  message.value = '';
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
  if (!checked.value) {
    ev.preventDefault();
    ev.stopPropagation();
    check();
  }
}

const inputClass = computed(() => ({
  'fill-input': true,
  correct: checked.value && isOk.value,
  wrong: checked.value && !isOk.value,
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
    <div class="question-box">Fülle die Lücke aus:</div>

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
        :disabled="checked"
        @keydown="onKeyDown"
      />
      <span v-html="partRightHtml" />
    </div>

    <div class="sprach-btns">
      <button
        type="button"
        class="sprach-btn sprach-btn-check"
        :disabled="checked"
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
        :disabled="checked"
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

    <div v-if="!checked" class="de-kbd">
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
