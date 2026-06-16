<script setup>
/**
 * DragDrop — "Ordne die Wörter zum richtigen Satz" question.
 *
 * First wrong check: learner may reorder chips (emits `first-wrong`).
 * Second wrong check: shows the correct sentence and finalises as wrong.
 * Correct on first try (or after one wrong) finalises like MultipleChoice.
 */

import { computed, ref, onMounted } from 'vue';
import { shuffle } from '@/utils/random.js';

const props = defineProps({
  question: { type: Object, required: true },
});
const emit = defineEmits(['answer', 'first-wrong', 'complete']);

const correct = props.question.words || [];
const validOrders = [
  correct,
  ...(props.question.alternatives || []),
];
const bank = ref([]);
const drop = ref([]);
const wrongChecks = ref(0);
const hadWrong = ref(false);
const finalised = ref(false);
const succeeded = ref(false);
const showSolution = ref(false);
const message = ref({ html: '', color: '' });

// A trailing punctuation mark is trivially obvious — pre-place it as a fixed
// suffix so the learner only arranges the meaningful words.
const TRAILING_PUNCT = new Set(['?', '!']);
const lastWord = correct[correct.length - 1] ?? '';
const suffix = TRAILING_PUNCT.has(lastWord) ? lastWord : '';
// Words the student actually needs to arrange (excludes the fixed suffix).
const coreWords = suffix ? correct.slice(0, -1) : correct;

function scrambleBank() {
  let s = shuffle(coreWords);
  if (s.join('|') === coreWords.join('|') && s.length > 1) {
    [s[0], s[s.length - 1]] = [s[s.length - 1], s[0]];
  }
  bank.value = s;
  drop.value = [];
}

onMounted(scrambleBank);

const locked = computed(() => finalised.value || showSolution.value);

function pushChip(index) {
  if (locked.value) return;
  const word = bank.value[index];
  if (word === undefined) return;
  bank.value.splice(index, 1);
  drop.value.push(word);
  // Auto-place the last remaining word (already handles "?" via suffix).
  if (bank.value.length === 1) {
    const last = bank.value.splice(0, 1)[0];
    drop.value.push(last);
  }
}

function popChip(index) {
  if (locked.value) return;
  const [w] = drop.value.splice(index, 1);
  if (w !== undefined) bank.value.push(w);
}

function finalise(isCorrect) {
  finalised.value = true;
  succeeded.value = isCorrect;
  if (isCorrect) {
    message.value = { html: '✅ Richtig! Sehr gut!', color: '#4caf50' };
  }
  emit('answer', { isCorrect: isCorrect && !hadWrong.value });
  emit('complete');
}

function showCorrectSolution() {
  showSolution.value = true;
  drop.value = [...coreWords];
  bank.value = [];
  let html = '❌ Nicht richtig. Richtige Lösung:';
  // Build display sentence without awkward space before punctuation.
  const displaySentence = coreWords.join(' ') + (suffix ? suffix : '');
  html += `<div style="margin-top:10px;font-weight:700;color:#2e7d32;">${displaySentence}</div>`;
  if (props.question.codes && props.question.codes.length === correct.length) {
    html += renderTekamoloBreakdown(correct, props.question.codes);
  }
  message.value = { html, color: '#ed4545' };
}

function check() {
  if (finalised.value) return;
  if (drop.value.length === 0) {
    message.value = { html: 'Bitte erst Wörter einordnen!', color: '#ed4545' };
    return;
  }

  // Include the fixed suffix when checking (it is not part of the drop array).
  const full = suffix ? [...drop.value, suffix] : drop.value;
  const key = full.join('|');
  const isCorrect = validOrders.some((order) => order.join('|') === key);
  if (isCorrect) {
    finalise(true);
    return;
  }

  wrongChecks.value += 1;
  hadWrong.value = true;

  if (wrongChecks.value === 1) {
    emit('first-wrong');
    message.value = {
      html: '❌ Noch nicht richtig. Ordne die Wörter noch einmal.',
      color: '#ed4545',
    };
    return;
  }

  showCorrectSolution();
  finalise(false);
}

function reset() {
  if (finalised.value) return;
  wrongChecks.value = 0;
  hadWrong.value = false;
  succeeded.value = false;
  showSolution.value = false;
  scrambleBank();
  message.value = { html: '', color: '' };
}

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

const chipClass = computed(() => (word, index) => {
  if (showSolution.value || (finalised.value && succeeded.value)) return 'correct';
  if (!finalised.value || wrongChecks.value < 2) return '';
  return drop.value[index] === correct[index] ? 'correct' : 'wrong';
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
        :class="chipClass(w, i)"
        @click="popChip(i)"
      >
        {{ w }}
      </span>
      <!-- Fixed trailing punctuation — pre-placed, not draggable -->
      <span
        v-if="suffix"
        class="dd-chip correct"
        style="opacity: 0.55; cursor: default;"
      >{{ suffix }}</span>
    </div>

    <div class="dd-bank">
      <span
        v-for="(w, i) in bank"
        :key="`b-${i}-${w}`"
        class="dd-chip"
        @click="pushChip(i)"
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
        :disabled="finalised"
        @click="check"
      >
        ✔ Prüfen
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
  </div>
</template>
