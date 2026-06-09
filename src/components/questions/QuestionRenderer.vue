<script setup>
/**
 * QuestionRenderer — dispatches the right `<component>` based on the
 * `question.type` discriminator. Keeping the dispatch in one place
 * lets the Trainer view stay generic.
 *
 * The four supported types map 1:1 to the Markdown question format
 * declared in `src/utils/markdownQuestion.js`:
 *
 *   select-one     → MultipleChoice
 *   multi-select   → MultiSelect
 *   dropbox        → DragDrop
 *   input-text     → FillBlank
 *   text-gaps      → TextGaps (Sprachbausteine / Lesen mit Popups)
 *
 * The component re-emits `answer`, `first-wrong` and `complete` events
 * so the parent stays loosely coupled to the actual widget.
 *
 * @prop {!Object}  question  The active question object.
 * @prop {boolean}  premium   Whether the learner has Premium active.
 */

import { computed } from 'vue';

import MultipleChoice from './MultipleChoice.vue';
import MultiSelect from './MultiSelect.vue';
import DragDrop from './DragDrop.vue';
import FillBlank from './FillBlank.vue';
import TextGaps from './TextGaps.vue';

const props = defineProps({
  question: { type: Object, required: true },
  premium: { type: Boolean, default: false },
});

defineEmits(['answer', 'first-wrong', 'complete']);

const COMPONENT_BY_TYPE = {
  'select-one': MultipleChoice,
  'multi-select': MultiSelect,
  'dropbox': DragDrop,
  'input-text': FillBlank,
  'text-gaps': TextGaps,
};

const view = computed(
  () => COMPONENT_BY_TYPE[props.question.type] || MultipleChoice,
);
</script>

<template>
  <component
    :is="view"
    :question="question"
    :premium="premium"
    @answer="$emit('answer', $event)"
    @first-wrong="$emit('first-wrong')"
    @complete="$emit('complete')"
  />
</template>
