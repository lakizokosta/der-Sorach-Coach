<script setup>
/**
 * TextGaps — long text with clickable gaps (`text-gaps`).
 * Each gap opens a popup with exactly 3 answer options (one correct).
 *
 * Question shape:
 *   { id, type:'text-gaps', prompt, hint?, gaps: [{ options, correct }] }
 *
 * Frontmatter uses parallel lists:
 *   options: [ "a,b,c", "d,e,f" ]
 *   correct: [ "a", "d" ]
 */

import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { shuffle } from '@/utils/random.js';

const props = defineProps({
  question: { type: Object, required: true },
  premium: { type: Boolean, default: false },
});

const emit = defineEmits(['answer', 'first-wrong', 'complete']);

const hadWrong = ref(false);
const finalised = ref(false);
/** @type {import('vue').Ref<(string|null)[]>} */
const answers = ref([]);
const activeGap = ref(-1);
const popupStyle = ref({ display: 'none' });
const shuffledOpts = ref([]);

const gaps = computed(() => props.question.gaps || []);

const segments = computed(() => {
  const parts = (props.question.prompt || '').split('___');
  const out = [];
  for (let i = 0; i < parts.length; i++) {
    out.push({ type: 'text', value: parts[i] });
    if (i < gaps.value.length) out.push({ type: 'gap', index: i });
  }
  return out;
});

function gapClass(idx) {
  const val = answers.value[idx];
  if (!val) return activeGap.value === idx ? 'open' : '';
  const ok = val === gaps.value[idx]?.correct;
  return ok ? 'ok' : 'err';
}

function gapLabel(idx) {
  const val = answers.value[idx];
  if (val) return val;
  return '…';
}

function openGap(idx, event) {
  if (finalised.value) return;
  activeGap.value = idx;
  shuffledOpts.value = shuffle((gaps.value[idx]?.options || []).slice());
  const rect = event.currentTarget.getBoundingClientRect();
  const left = Math.min(rect.left, window.innerWidth - 200);
  popupStyle.value = {
    top: `${rect.bottom + 6}px`,
    left: `${Math.max(8, left)}px`,
  };
}

function closePopup() {
  activeGap.value = -1;
  popupStyle.value = { display: 'none' };
}

function pickOption(option) {
  const idx = activeGap.value;
  if (idx < 0 || finalised.value) return;
  const gap = gaps.value[idx];
  const isCorrect = String(option).trim() === String(gap.correct).trim();

  if (isCorrect) {
    answers.value[idx] = option;
    closePopup();
    if (answers.value.every((a, i) => a === gaps.value[i]?.correct)) {
      finalised.value = true;
      emit('answer', { isCorrect: !hadWrong.value });
      emit('complete');
    }
    return;
  }

  if (!hadWrong.value) {
    hadWrong.value = true;
    emit('first-wrong');
  }
  closePopup();
}

function onOutsideClick(event) {
  const root = document.getElementById('gap-popup-root');
  if (root && !root.contains(event.target) && !event.target.classList.contains('lesen-gap-marker')) {
    closePopup();
  }
}

onMounted(() => {
  answers.value = gaps.value.map(() => null);
  setTimeout(() => document.addEventListener('click', onOutsideClick), 100);
});
onBeforeUnmount(() => document.removeEventListener('click', onOutsideClick));
</script>

<template>
  <div>
    <div v-if="question.hint" class="lesen-qblock-label" style="margin-bottom: 10px;">
      {{ question.hint }}
    </div>

    <div class="lesen-text">
      <template v-for="(seg, i) in segments" :key="i">
        <span v-if="seg.type === 'text'">{{ seg.value }}</span>
        <button
          v-else
          type="button"
          class="lesen-gap-marker"
          :class="gapClass(seg.index)"
          @click.stop="openGap(seg.index, $event)"
        >
          {{ gapLabel(seg.index) }}
        </button>
      </template>
    </div>

    <p v-if="!finalised" style="font-size: 13px; color: #888; text-align: center; margin-top: 8px;">
      Tippe auf eine Lücke und wähle die richtige Form.
    </p>

    <div
      v-if="activeGap >= 0"
      id="gap-popup-root"
      class="gap-popup"
      :style="popupStyle"
    >
      <button
        v-for="(opt, j) in shuffledOpts"
        :key="`${activeGap}-${opt}-${j}`"
        type="button"
        class="gap-popup-opt"
        @click.stop="pickOption(opt)"
      >
        {{ opt }}
      </button>
    </div>
  </div>
</template>
