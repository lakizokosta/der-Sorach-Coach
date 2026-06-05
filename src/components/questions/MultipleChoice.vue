<script setup>
/**
 * MultipleChoice — single-answer radio question (`select-one`).
 *
 * Behaviour copied from the Blogger trainer:
 *   - The answer options are shuffled on mount.
 *   - The first click decides the answer (correct or wrong).
 *   - A wrong click counts as an error but the learner gets ONE second
 *     chance to pick the correct option (which is then highlighted in
 *     green without affecting the score).
 *
 * Question shape (from `parseQuestionFile`):
 *   { id, type:'select-one', prompt, options: string[], correct: string }
 *
 * Emits:
 *   - 'first-wrong'              — fired once when the learner picks an
 *     incorrect option on the first attempt.
 *   - 'answer' { isCorrect }     — fired once when the question is
 *     finally resolved.
 *   - 'complete'                 — fired together with 'answer'.
 */

import { computed, ref, onMounted } from 'vue';
import { shuffle } from '@/utils/random.js';
import { wrapWordsForDictionary } from '@/utils/dictionary.js';

const props = defineProps({
  question: { type: Object, required: true },
  premium: { type: Boolean, default: false },
});

const emit = defineEmits(['answer', 'first-wrong', 'complete']);

const shuffled = ref([]);
const hadWrong = ref(false);
const finalised = ref(false);

onMounted(() => {
  shuffled.value = shuffle((props.question.options || []).slice());
});

const renderedPrompt = computed(() =>
  props.premium
    ? wrapWordsForDictionary(props.question.prompt || '')
    : props.question.prompt || '',
);

/**
 * Click handler for each answer button.
 *
 * @param {string} option
 */
function pick(option) {
  if (finalised.value) return;
  const isCorrect = option === props.question.correct;

  if (isCorrect) {
    finalised.value = true;
    emit('answer', { isCorrect: !hadWrong.value });
    emit('complete');
    return;
  }

  if (hadWrong.value) {
    finalised.value = true;
    emit('answer', { isCorrect: false });
    emit('complete');
  } else {
    hadWrong.value = true;
    emit('first-wrong');
  }
}

/**
 * CSS class helper used to colour the buttons after the answer is
 * resolved (or after a first wrong click).
 *
 * @param {string} option
 * @return {!Object<string, boolean>}
 */
function classFor(option) {
  if (!finalised.value) return {};
  return {
    correct: option === props.question.correct,
    wrong: option !== props.question.correct,
  };
}
</script>

<template>
  <div>
    <div class="question-box" v-html="renderedPrompt" />

    <div class="answers-box">
      <button
        v-for="(opt, i) in shuffled"
        :key="opt + '-' + i"
        type="button"
        class="answer-btn"
        :class="classFor(opt)"
        :disabled="finalised"
        @click="pick(opt)"
      >
        {{ opt }}
      </button>
    </div>
  </div>
</template>
