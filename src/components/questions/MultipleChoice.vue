<script setup>
/**
 * MultipleChoice — classic single-answer quiz buttons.
 *
 * Behaviour copied from the Blogger trainer:
 *   - The four answer options are shuffled on mount.
 *   - The first click decides the answer (correct or wrong).
 *   - A wrong click counts as an error but the learner gets ONE second
 *     chance to also pick the correct option (which is then highlighted
 *     in green without affecting the score).
 *
 * Emits:
 *   - 'first-wrong' — fired exactly once when the learner picks an
 *      incorrect option on the first attempt. Lets the parent show the
 *      retry hint and a grammar tip without affecting the score twice.
 *   - 'answer' { isCorrect:boolean } — fired exactly once when the
 *      question is finally resolved.
 *   - 'complete' — fired together with 'answer'.
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
  shuffled.value = shuffle(props.question.options || []);
});

const renderedTitle = computed(() =>
  props.premium ? wrapWordsForDictionary(props.question.title) : props.question.title,
);

/**
 * Click handler for each answer button.
 *
 * @param {{text:string, correct:boolean}} option
 * @param {number} index
 */
function pick(option, index) {
  if (finalised.value) return;

  if (option.correct) {
    finalised.value = true;
    // If a wrong click already happened, the answer counts as wrong.
    emit('answer', { isCorrect: !hadWrong.value });
    emit('complete');
    return;
  }

  // Wrong pick.
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
 * CSS class helper for a given option index.
 *
 * @param {number} index
 * @return {!Object<string, boolean>}
 */
function classFor(index) {
  if (!finalised.value && !hadWrong.value) return {};
  const opt = shuffled.value[index];
  if (!opt) return {};
  if (finalised.value) {
    return { correct: opt.correct, wrong: !opt.correct };
  }
  // Only a wrong pick has happened so far: just mark wrong picks.
  return {};
}
</script>

<template>
  <div>
    <div class="question-box" v-html="renderedTitle" />

    <div v-if="hadWrong && !finalised" class="retry-hint">
      ❌ Falsch! Wähle jetzt die richtige Antwort.
    </div>

    <div class="answers-box">
      <button
        v-for="(opt, i) in shuffled"
        :key="opt.text + i"
        type="button"
        class="answer-btn"
        :class="classFor(i)"
        :disabled="finalised"
        @click="pick(opt, i)"
      >
        {{ opt.text }}
      </button>
    </div>
  </div>
</template>
