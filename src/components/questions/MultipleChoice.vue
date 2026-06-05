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
const wrongPicks = ref([]);   // options the learner clicked but were wrong

onMounted(() => {
  shuffled.value = shuffle((props.question.options || []).slice());
});

const renderedPrompt = computed(() =>
  props.premium
    ? wrapWordsForDictionary(props.question.prompt || '')
    : props.question.prompt || '',
);

const correctValue = computed(() => String(props.question.correct ?? '').trim());

/**
 * Returns true iff `option` matches the declared correct answer. The
 * comparison trims whitespace defensively so a stray YAML space cannot
 * break the visual feedback.
 *
 * @param {string} option
 * @return {boolean}
 */
function isCorrectOption(option) {
  return String(option ?? '').trim() === correctValue.value;
}

/**
 * Click handler for each answer button.
 *
 * @param {string} option
 */
function pick(option) {
  if (finalised.value) return;

  if (isCorrectOption(option)) {
    finalised.value = true;
    emit('answer', { isCorrect: !hadWrong.value });
    emit('complete');
    return;
  }

  if (!wrongPicks.value.includes(option)) {
    wrongPicks.value = [...wrongPicks.value, option];
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
 * CSS class helper. Three states:
 *   1. The learner has just picked a wrong option (not yet finalised)
 *      → only THAT option turns red.
 *   2. The question is finalised
 *      → the correct option is green, every previously-picked wrong
 *        option is red. Untouched options stay neutral so the screen
 *        is not visually overwhelming.
 *   3. Otherwise → no class.
 *
 * @param {string} option
 * @return {!Object<string, boolean>}
 */
function classFor(option) {
  const wasPickedWrong = wrongPicks.value.includes(option);
  if (finalised.value) {
    return {
      correct: isCorrectOption(option),
      wrong: wasPickedWrong,
    };
  }
  return { wrong: wasPickedWrong };
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
