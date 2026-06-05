<script setup>
/**
 * DragDrop — "Ordne die Wörter zum richtigen Satz" question.
 *
 * The user taps chips in the bank to move them into the drop zone (and
 * vice-versa). Pressing "Prüfen" compares the assembled order against
 * `question.words`. Optional TeKaMoLo `codes` enable the colour-coded
 * sentence breakdown on a wrong attempt.
 *
 * Emits:
 *   - 'answer'   { isCorrect:boolean }
 *   - 'complete'
 */

import { computed, ref, onMounted } from 'vue';
import { shuffle } from '@/utils/random.js';

const props = defineProps({
  question: { type: Object, required: true },
});
const emit = defineEmits(['answer', 'complete']);

const correct = props.question.words || [];
const bank = ref([]);
const drop = ref([]);
const checked = ref(false);
const message = ref({ html: '', color: '' });

/**
 * Initial bank shuffle. Guarantees the starting order does not already
 * match the solution (we swap the first and last chip in that case so the
 * learner is not handed a trivial win).
 */
function scrambleBank() {
  let s = shuffle(correct);
  if (s.join('|') === correct.join('|') && s.length > 1) {
    [s[0], s[s.length - 1]] = [s[s.length - 1], s[0]];
  }
  bank.value = s;
  drop.value = [];
}

onMounted(scrambleBank);

/** Moves a chip from the bank into the drop zone. */
function pushChip(word) {
  if (checked.value) return;
  const i = bank.value.indexOf(word);
  if (i !== -1) bank.value.splice(i, 1);
  drop.value.push(word);
}

/** Moves a chip from the drop zone back into the bank. */
function popChip(index) {
  if (checked.value) return;
  const [w] = drop.value.splice(index, 1);
  if (w !== undefined) bank.value.push(w);
}

/** Compares the current order with `correct` and emits the result. */
function check() {
  if (checked.value) return;
  if (drop.value.length === 0) {
    message.value = { html: 'Bitte erst Wörter einordnen!', color: '#ed4545' };
    return;
  }
  checked.value = true;
  const isCorrect = drop.value.join('|') === correct.join('|');
  if (isCorrect) {
    message.value = { html: '✅ Richtig! Sehr gut!', color: '#4caf50' };
  } else {
    let html = '❌ Noch nicht richtig!';
    if (props.question.codes && props.question.codes.length === correct.length) {
      html += renderTekamoloBreakdown(correct, props.question.codes);
    }
    message.value = { html, color: '#ed4545' };
  }
  emit('answer', { isCorrect });
  emit('complete');
}

/** Resets the chips (does not affect the score). */
function reset() {
  if (checked.value) return;
  scrambleBank();
  message.value = { html: '', color: '' };
}

/**
 * Builds an HTML snippet that colour-codes consecutive runs of the same
 * TeKaMoLo code (T/K/M/L/_) and labels them with the corresponding W-Frage.
 *
 * @param {!Array<string>} words
 * @param {!Array<string>} codes
 * @return {string} HTML string.
 */
function renderTekamoloBreakdown(words, codes) {
  const CFG = {
    T: { label: 'Te', q: 'Wann?', bg: '#fff3e0', border: '#FF9800', color: '#bf360c' },
    K: { label: 'Ka', q: 'Warum?', bg: '#e3f2fd', border: '#1976D2', color: '#0d47a1' },
    M: { label: 'Mo', q: 'Wie?', bg: '#e8f5e9', border: '#388E3C', color: '#1b5e20' },
    L: { label: 'Lo', q: 'Wo/Wohin?', bg: '#fce4ec', border: '#C2185B', color: '#880e4f' },
    _: { label: '', q: '', bg: '#f5f5f5', border: '#bdbdbd', color: '#555' },
  };
  const groups = [];
  for (let i = 0; i < words.length; ) {
    const code = codes[i] || '_';
    const group = { code, words: [words[i]] };
    while (i + 1 < words.length && (codes[i + 1] || '_') === code) {
      i++;
      group.words.push(words[i]);
    }
    groups.push(group);
    i++;
  }
  const inner = groups
    .map((g) => {
      const c = CFG[g.code] || CFG._;
      const label = c.label
        ? `<div style="font-size:11px;font-weight:900;color:${c.color};margin-top:3px;">${c.label} · ${c.q}</div>`
        : '';
      return (
        `<div style="text-align:center;">` +
        `<div style="padding:6px 10px;border-radius:10px;border:2px solid ${c.border};` +
        `background:${c.bg};color:${c.color};font-weight:700;font-size:14px;white-space:nowrap;">` +
        `${g.words.join(' ')}</div>${label}</div>`
      );
    })
    .join('');
  return (
    `<div style="margin-top:14px;text-align:center;">` +
    `<div style="font-size:11px;color:#888;margin-bottom:8px;letter-spacing:.5px;">📌 SATZANALYSE</div>` +
    `<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;">${inner}</div></div>`
  );
}

const chipClass = computed(() => (word) => {
  if (!checked.value) return '';
  const i = drop.value.indexOf(word);
  if (i === -1) return '';
  return drop.value[i] === correct[i] ? 'correct' : 'wrong';
});
</script>

<template>
  <div>
    <div class="question-box">
      {{ question.prompt || 'Ordne die Wörter zum richtigen Satz:' }}
    </div>

    <div class="dd-drop">
      <span v-if="drop.length === 0" class="dd-placeholder">Tippe auf Wörter ↓</span>
      <span
        v-for="(w, i) in drop"
        :key="`d-${i}-${w}`"
        class="dd-chip"
        :class="chipClass(w)"
        @click="popChip(i)"
      >
        {{ w }}
      </span>
    </div>

    <div class="dd-bank">
      <span
        v-for="(w, i) in bank"
        :key="`b-${i}-${w}`"
        class="dd-chip"
        @click="pushChip(w)"
      >
        {{ w }}
      </span>
    </div>

    <div
      class="sprach-msg"
      :style="{ color: message.color }"
      v-html="message.html"
    />

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
        ↺ Noch einmal
      </button>
    </div>
  </div>
</template>
