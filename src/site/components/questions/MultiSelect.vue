<script setup>
/**
 * MultiSelect — checkbox question (`multi-select`).
 *
 * Several options may be correct simultaneously. The learner ticks
 * every option they think is right, then presses **Prüfen**. The
 * answer is correct only if the chosen set EXACTLY matches the set
 * declared in the question's `correct` array.
 *
 * Question shape (from `parseQuestionFile`):
 *   { id, type:'multi-select', prompt, options: string[], correct: string[] }
 *
 * Emits:
 *   - 'answer' { isCorrect }  — fired once when the user presses Prüfen.
 *   - 'complete'              — fired together with 'answer'.
 */

import { computed, onMounted, ref } from 'vue';
import { shuffle } from '@/utils/random.js';
import { wrapWordsForDictionary } from '@/utils/dictionary.js';
import { stripTrailingPromptHint } from '@/utils/markdownQuestion.js';

const props = defineProps({
  question: { type: Object, required: true },
  premium: { type: Boolean, default: false },
});

const emit = defineEmits(['answer', 'complete']);

const shuffled = ref([]);
const selected = ref(new Set());
const finalised = ref(false);

onMounted(() => {
  shuffled.value = shuffle((props.question.options || []).slice());
});

const renderedPrompt = computed(() => {
  const prompt = stripTrailingPromptHint(props.question.prompt || '');
  return props.premium ? wrapWordsForDictionary(prompt) : prompt;
});

const correctSet = computed(() => new Set(props.question.correct || []));

/**
 * Toggles an option in the selected set.
 *
 * @param {string} option
 */
function toggle(option) {
  if (finalised.value) return;
  const next = new Set(selected.value);
  if (next.has(option)) next.delete(option);
  else next.add(option);
  selected.value = next;
}

/**
 * Commits the answer. Correct iff the selected set equals the
 * declared correct set.
 */
function submit() {
  if (finalised.value) return;
  finalised.value = true;

  const sel = selected.value;
  let isCorrect = sel.size === correctSet.value.size;
  if (isCorrect) {
    for (const c of correctSet.value) {
      if (!sel.has(c)) {
        isCorrect = false;
        break;
      }
    }
  }

  emit('answer', { isCorrect });
  emit('complete');
}

/**
 * Class helper used to highlight options after submission.
 *
 * @param {string} option
 * @return {!Object<string, boolean>}
 */
function classFor(option) {
  if (!finalised.value) {
    return { selected: selected.value.has(option) };
  }
  const isRight = correctSet.value.has(option);
  const wasPicked = selected.value.has(option);
  return {
    correct: isRight && wasPicked,
    'should-be-correct': isRight && !wasPicked,
    wrong: !isRight && wasPicked,
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
        class="answer-btn multi"
        :class="classFor(opt)"
        :disabled="finalised"
        @click="toggle(opt)"
      >
        <span style="margin-right: 8px;">
          {{
            finalised
              ? correctSet.has(opt) && selected.has(opt)
                ? '✅'
                : correctSet.has(opt)
                  ? '☑️'
                  : selected.has(opt)
                    ? '❌'
                    : '☐'
              : selected.has(opt)
                ? '☑️'
                : '☐'
          }}
        </span>
        {{ opt }}
      </button>
    </div>

    <button
      type="button"
      class="next-btn"
      style="margin-top: 14px;"
      :disabled="finalised || selected.size === 0"
      @click="submit"
    >
      Prüfen
    </button>
  </div>
</template>
