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
 * Keyboard handler — Enter checks the answer or advances when allowed
 * by the parent (the parent owns the Weiter button).
 *
 * @param {KeyboardEvent} ev
 */
function onKeyDown(ev) {
  if (ev.key === 'Enter') {
    ev.preventDefault();
    ev.stopPropagation();
    if (!checked.value) check();
  }
}

const inputClass = computed(() => ({
  'fill-input': true,
  correct: checked.value && isOk.value,
  wrong: checked.value && !isOk.value,
}));
</script>

<template>
  <div>
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
