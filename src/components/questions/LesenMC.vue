<script setup>
/**
 * LesenMC — "Leseverstehen" question: a short paragraph with multiple
 * numbered gaps `[0]`, `[1]`, ... and a set of multiple-choice radio
 * groups underneath the text. The question is considered correct only
 * when every gap is answered correctly.
 *
 * Emits:
 *   - 'answer'   { isCorrect:boolean }
 *   - 'complete'
 */

import { computed, onMounted, ref } from 'vue';
import { shuffle } from '@/utils/random.js';

const props = defineProps({
  question: { type: Object, required: true },
});
const emit = defineEmits(['answer', 'complete']);

const rawText = props.question.sentence || '';
const gaps = props.question.gaps || {};
const keys = Object.keys(gaps).sort((a, b) => +a - +b);

// Pre-shuffle the options per gap so the correct one is not always first.
const shuffledGaps = ref({});
onMounted(() => {
  const map = {};
  for (const n of keys) map[n] = shuffle(gaps[n].o || []);
  shuffledGaps.value = map;
});

const picks = ref({});      // gap -> chosen value
const results = ref({});    // gap -> 'correct' | 'wrong'
const checked = ref(false);
const message = ref({ html: '', color: '' });

/**
 * Renders the paragraph as HTML with `[n]` markers replaced by spans
 * that show either the gap number, the correct value (after check), and
 * the colour class indicating success.
 *
 * @return {string} HTML string.
 */
const renderedHtml = computed(() => {
  return rawText.replace(/\[(\d+)\]/g, (_, n) => {
    const correctVal = gaps[n]?.c || '';
    const display = checked.value ? correctVal : `(${+n + 1})`;
    const klass = checked.value
      ? `lesen-gap-marker ${results.value[n] === 'correct' ? 'ok' : 'err'}`
      : 'lesen-gap-marker';
    return `<span class="${klass}">${display}</span>`;
  });
});

/** Validates the picks and emits the result. */
function check() {
  const allFilled = keys.every((n) => Boolean(picks.value[n]));
  if (!allFilled) {
    message.value = { html: '❌ Bitte beantworte alle Fragen!', color: '#ed4545' };
    return;
  }
  checked.value = true;
  let correctCount = 0;
  for (const n of keys) {
    const ok = picks.value[n] === (gaps[n].c || '');
    results.value[n] = ok ? 'correct' : 'wrong';
    if (ok) correctCount++;
  }
  const total = keys.length;
  const allCorrect = correctCount === total;
  message.value = allCorrect
    ? { html: '✔ Alles richtig! Hervorragend!', color: '#69c43b' }
    : {
        html: `❌ ${correctCount} von ${total} richtig (${Math.round((correctCount / total) * 100)}%)`,
        color: '#ed4545',
      };
  emit('answer', { isCorrect: allCorrect });
  emit('complete');
}

/** Clears all radios (only allowed before check). */
function reset() {
  if (checked.value) return;
  picks.value = {};
  message.value = { html: '', color: '' };
}

/**
 * CSS class for a single option label.
 *
 * @param {string} n   Gap index.
 * @param {string} v   Option value.
 * @return {!Object<string, boolean>}
 */
function optClass(n, v) {
  if (!checked.value) return {};
  const right = gaps[n]?.c;
  const chosen = picks.value[n];
  return {
    correct: v === right,
    wrong: v !== right && chosen === v,
  };
}
</script>

<template>
  <div>
    <div class="question-box">{{ question.title }}</div>

    <div class="lesen-text" v-html="renderedHtml" />

    <div style="text-align: left;">
      <div
        v-for="n in keys"
        :key="n"
        class="lesen-qblock"
      >
        <div class="lesen-qblock-label">({{ +n + 1 }})</div>
        <label
          v-for="(opt, i) in shuffledGaps[n] || []"
          :key="opt + i"
          class="lesen-opt"
          :class="optClass(n, opt)"
        >
          <input
            v-model="picks[n]"
            type="radio"
            :name="`lg${n}`"
            :value="opt"
            :disabled="checked"
          />
          <strong>{{ ['a', 'b', 'c', 'd'][i] || i + 1 }}</strong>&nbsp;&nbsp;
          {{ opt }}
        </label>
      </div>
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
        type="button"
        class="sprach-btn sprach-btn-reset"
        :disabled="checked"
        @click="reset"
      >
        ↺ Zurücksetzen
      </button>
    </div>

    <div
      class="sprach-msg"
      :style="{ color: message.color }"
      v-html="message.html"
    />
  </div>
</template>
