<script setup>
/**
 * Sprachbausteine — formal text completion. A paragraph contains gaps
 * `[0]`, `[1]`, ... and each gap is rendered as an inline `<select>`
 * with the shuffled candidate values. All gaps must be correctly filled
 * for the answer to count as correct.
 *
 * The template renders the text as discrete tokens (plain text plus
 * `<select>` elements) using `v-for` instead of v-html so Vue's reactive
 * model binding stays intact.
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
const picks = ref({});
const checked = ref(false);
const results = ref({});
const message = ref({ html: '', color: '' });

const shuffledOptions = ref({});
onMounted(() => {
  const map = {};
  for (const key of Object.keys(gaps)) map[key] = shuffle(gaps[key].o || []);
  shuffledOptions.value = map;
});

/**
 * Tokenises the raw paragraph into an array of `{ type, value }` chunks
 * suitable for v-for rendering. `type === 'text'` for plain text,
 * `type === 'gap'` for a gap placeholder identified by its index.
 *
 * @return {!Array<{type:'text'|'gap', value:string}>}
 */
const tokens = computed(() => {
  const out = [];
  const re = /\[(\d+)\]/g;
  let lastIdx = 0;
  let match;
  while ((match = re.exec(rawText)) !== null) {
    if (match.index > lastIdx) {
      out.push({ type: 'text', value: rawText.slice(lastIdx, match.index) });
    }
    out.push({ type: 'gap', value: match[1] });
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < rawText.length) {
    out.push({ type: 'text', value: rawText.slice(lastIdx) });
  }
  return out;
});

/** Validates every gap and emits the result. */
function check() {
  const keys = Object.keys(gaps);
  const allFilled = keys.every((n) => Boolean(picks.value[n]));
  if (!allFilled) {
    message.value = { html: '❌ Bitte fülle zuerst alle Lücken aus!', color: '#ed4545' };
    return;
  }
  checked.value = true;
  let correctCount = 0;
  for (const n of keys) {
    const ok = picks.value[n] === gaps[n].c;
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

/** Resets all dropdowns (only allowed before check). */
function reset() {
  if (checked.value) return;
  picks.value = {};
  message.value = { html: '', color: '' };
}

/**
 * CSS class for a given select element.
 *
 * @param {string} n  Gap index.
 * @return {!Object<string, boolean>}
 */
function selectClass(n) {
  return {
    'sprach-select': true,
    correct: results.value[n] === 'correct',
    wrong: results.value[n] === 'wrong',
  };
}
</script>

<template>
  <div>
    <div class="question-box">{{ question.title }}</div>

    <div class="sprach-text">
      <template v-for="(tok, idx) in tokens" :key="idx">
        <template v-if="tok.type === 'text'">{{ tok.value }}</template>
        <select
          v-else
          :class="selectClass(tok.value)"
          :disabled="checked"
          :value="picks[tok.value] || ''"
          @change="picks[tok.value] = $event.target.value"
        >
          <option value="">—</option>
          <option
            v-for="opt in shuffledOptions[tok.value] || []"
            :key="opt"
            :value="opt"
          >
            {{ opt }}
          </option>
        </select>
        <template v-if="checked && results[tok.value] === 'wrong'">
          <span style="color:#69c43b;font-weight:700;font-size:11px;margin-left:3px;">
            → {{ gaps[tok.value].c }}
          </span>
        </template>
      </template>
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
