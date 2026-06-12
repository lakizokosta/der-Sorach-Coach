<script setup>
/**
 * MultipleChoice — single-answer radio question (`select-one`).
 *
 * Behaviour:
 *   - The answer options are shuffled on mount.
 *   - A wrong click highlights the picked button RED and is added to
 *     the persistent "wrong picks" set. The learner keeps trying — the
 *     question is NOT finalised until the correct answer is picked.
 *   - The first wrong click also emits `first-wrong` so the parent can
 *     count the error (once) and show its retry banner.
 *   - When the correct option is finally picked it turns GREEN and the
 *     `answer` event fires with `isCorrect = !hadAnyWrongPick`.
 *
 * Question shape (from `parseQuestionFile`):
 *   { id, type:'select-one', prompt, options: string[], correct: string }
 *
 * Emits:
 *   - 'first-wrong'              — fired exactly once on the very first
 *     wrong click.
 *   - 'answer' { isCorrect }     — fired once when the correct option
 *     is finally picked.
 *   - 'complete'                 — fired together with 'answer'.
 */

import { computed, ref, onMounted } from 'vue';
import { shuffle } from '@/utils/random.js';
import { wrapWordsForDictionary } from '@/utils/dictionary.js';
import { resolveSpatialScene } from '@/utils/prepositionSpatial.js';
import PrepositionSpatialHint from '@/components/PrepositionSpatialHint.vue';

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

const spatialScene = computed(() => resolveSpatialScene(props.question));

const WECHSEL_TOPICS = new Set(['WECHSELPRÄPOSITIONEN', 'WECHSELPRÄPOSITIONENA2']);

// For Wechselpräpositionen the badge (Wo·Dativ / Wohin·Akkusativ) reveals the
// answer, so we show the diagram only after the correct option is picked.
const showSpatialHint = computed(() =>
  spatialScene.value !== null &&
  (!WECHSEL_TOPICS.has(props.question.topic) || finalised.value),
);

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
 * Click handler for each answer button. Wrong clicks accumulate in
 * `wrongPicks` and do NOT end the question — the learner keeps trying
 * until the correct option is found.
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

  // Wrong pick — track it visually and notify the parent ONCE so it
  // can count the error. Subsequent wrong picks just turn red.
  if (!wrongPicks.value.includes(option)) {
    wrongPicks.value = [...wrongPicks.value, option];
  }
  if (!hadWrong.value) {
    hadWrong.value = true;
    emit('first-wrong');
  }

  // If only one option is left untried, auto-select it (it must be correct).
  const remaining = shuffled.value.filter((o) => !wrongPicks.value.includes(o));
  if (remaining.length === 1) {
    finalised.value = true;
    emit('answer', { isCorrect: false });
    emit('complete');
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
    <PrepositionSpatialHint v-if="showSpatialHint" :scene="spatialScene" />
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
