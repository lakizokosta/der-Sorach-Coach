<script setup>
/**
 * DragDrop — "Ordne die Wörter zum richtigen Satz" question.
 *
 * First wrong check: learner may reorder chips (emits `first-wrong`);
 * words already in the correct slot are highlighted green and locked.
 * Second wrong check: shows the correct sentence and finalises as wrong.
 * The Tipp button inserts the next reference word (trimming a wrong tail).
 * Correct on first try (or after one wrong) finalises like MultipleChoice.
 *
 * Optional `commas` in question data: 0-based word indices after which a
 * comma is shown (Relativsatz and similar).
 */

import { computed, ref, onMounted } from 'vue';
import { shuffle } from '@/utils/random.js';
import { stripTrailingPromptHint } from '@/utils/markdownQuestion.js';
import { resolveDropboxCommas } from '@/utils/dropboxCommas.js';
import {
  chunkifyDropboxWords,
  commaAfterChunk,
  flattenDropboxChunks,
} from '@/utils/dropboxChunks.js';

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

const commaAfter = computed(() =>
  resolveDropboxCommas({
    words: correct,
    commas: props.question.commas,
    hint: props.question.hint || stripTrailingPromptHint(props.question.prompt || ''),
  }),
);

// A trailing punctuation mark is trivially obvious — pre-place it as a fixed
// suffix so the learner only arranges the meaningful words.
const TRAILING_PUNCT = new Set(['?', '!']);
const lastWord = correct[correct.length - 1] ?? '';
const suffix = TRAILING_PUNCT.has(lastWord) ? lastWord : '';
// Words the student actually needs to arrange (excludes the fixed suffix).
const coreWords = suffix ? correct.slice(0, -1) : correct;
const coreChunks = computed(() => chunkifyDropboxWords(coreWords));

/** Builds a display string with optional comma positions. */
function formatSentence(words, suffixChar = '') {
  let out = '';
  for (let i = 0; i < words.length; i++) {
    if (i > 0) out += ' ';
    out += words[i];
    if (commaAfter.value.includes(i)) out += ',';
  }
  return out + (suffixChar || '');
}

function scrambleBank() {
  let s = shuffle([...coreChunks.value]);
  const coreKey = coreChunks.value.map((c) => c.id).join('|');
  if (s.map((c) => c.id).join('|') === coreKey && s.length > 1) {
    [s[0], s[s.length - 1]] = [s[s.length - 1], s[0]];
  }
  bank.value = s;
  drop.value = [];
}

function flatDropWords() {
  return flattenDropboxChunks(drop.value);
}

function chunksMatch(a, b) {
  return a?.id === b?.id;
}

onMounted(scrambleBank);

const locked = computed(() => finalised.value || showSolution.value);

/** True when a chip matches the reference order and must not be removed. */
function isChipLocked(index) {
  return (
    wrongChecks.value >= 1
    && !finalised.value
    && !showSolution.value
    && chunksMatch(drop.value[index], coreChunks.value[index])
  );
}

const canApplyHint = computed(() => {
  if (locked.value) return false;
  const nextIndex = drop.value.findIndex((chunk, i) => !chunksMatch(chunk, coreChunks.value[i]));
  const targetIndex = nextIndex === -1 ? drop.value.length : nextIndex;
  return targetIndex < coreChunks.value.length;
});

function pushChip(index) {
  if (locked.value) return;
  const chunk = bank.value[index];
  if (chunk === undefined) return;
  bank.value.splice(index, 1);
  drop.value.push(chunk);
  if (bank.value.length === 1) {
    const last = bank.value.splice(0, 1)[0];
    drop.value.push(last);
  }
}

function popChip(index) {
  if (locked.value || isChipLocked(index)) return;
  const [chunk] = drop.value.splice(index, 1);
  if (chunk !== undefined) bank.value.push(chunk);
}

/** Inserts the next reference chunk; trims a wrong tail first if needed. */
function applyHint() {
  if (!canApplyHint.value) return;

  let nextIndex = drop.value.findIndex((chunk, i) => !chunksMatch(chunk, coreChunks.value[i]));
  if (nextIndex === -1) nextIndex = drop.value.length;

  while (drop.value.length > nextIndex) {
    const chunk = drop.value.pop();
    if (chunk !== undefined) bank.value.push(chunk);
  }

  const targetChunk = coreChunks.value[nextIndex];
  const bankIndex = bank.value.findIndex((c) => c.id === targetChunk.id);
  if (bankIndex === -1) return;

  bank.value.splice(bankIndex, 1);
  drop.value.push(targetChunk);

  if (bank.value.length === 1) {
    const last = bank.value.splice(0, 1)[0];
    drop.value.push(last);
  }
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
  drop.value = [...coreChunks.value];
  bank.value = [];
  let html = '❌ Nicht richtig. Richtige Lösung:';
  html += `<div style="margin-top:10px;font-weight:700;color:#2e7d32;">${formatSentence(coreWords, suffix)}</div>`;
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

  const full = suffix ? [...flatDropWords(), suffix] : flatDropWords();
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

const promptLabel = computed(
  () =>
    stripTrailingPromptHint(props.question.prompt || '') ||
    'Ordne die Wörter zum richtigen Satz:',
);

const chipClass = computed(() => (chunk, index) => {
  if (showSolution.value || (finalised.value && succeeded.value)) return 'correct';
  if (finalised.value && wrongChecks.value >= 2) {
    return chunksMatch(chunk, coreChunks.value[index]) ? 'correct' : 'wrong';
  }
  if (wrongChecks.value >= 1 && chunksMatch(chunk, coreChunks.value[index])) return 'correct';
  return '';
});

function showCommaAfter(chunkIndex) {
  return commaAfterChunk(drop.value, chunkIndex, commaAfter.value);
}
</script>

<template>
  <div>
    <div class="question-box">
      {{ promptLabel }}
    </div>

    <div class="dd-drop">
      <span v-if="drop.length === 0" class="dd-placeholder">Tippe auf Wörter ↓</span>
      <template v-for="(chunk, i) in drop" :key="`d-${chunk.id}-${i}`">
        <span
          class="dd-chip"
          :class="[
            chipClass(chunk, i),
            { locked: isChipLocked(i), 'dd-chip--group': chunk.words.length > 1 },
          ]"
          @click="popChip(i)"
        >
          {{ chunk.text }}
        </span>
        <span v-if="showCommaAfter(i)" class="dd-comma">,</span>
      </template>
      <!-- Fixed trailing punctuation — pre-placed, not draggable -->
      <span
        v-if="suffix"
        class="dd-chip correct"
        style="opacity: 0.55; cursor: default;"
      >{{ suffix }}</span>
    </div>

    <div class="dd-bank">
      <span
        v-for="(chunk, i) in bank"
        :key="`b-${chunk.id}`"
        class="dd-chip"
        :class="{ 'dd-chip--group': chunk.words.length > 1 }"
        @click="pushChip(i)"
      >
        {{ chunk.text }}
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
        class="sprach-btn sprach-btn-hint"
        :disabled="finalised || !canApplyHint"
        @click="applyHint"
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
  </div>
</template>
