<script setup>
/**
 * QuestionRenderer — dispatches the right `<component>` based on the
 * `question.type` discriminator. Keeping the dispatch in one place lets
 * the Trainer view stay generic.
 *
 * The component re-emits the `answer` and `complete` events that the
 * inner question components fire, so the parent can stay loosely coupled.
 *
 * @prop {!Object}  question  The active question object.
 * @prop {boolean}  premium   Whether the learner has Premium active.
 */

import { computed } from 'vue';

import MultipleChoice from './MultipleChoice.vue';
import DragDrop from './DragDrop.vue';
import FillBlank from './FillBlank.vue';
import LesenMC from './LesenMC.vue';
import Sprachbausteine from './Sprachbausteine.vue';

const props = defineProps({
  question: { type: Object, required: true },
  premium: { type: Boolean, default: false },
});

defineEmits(['answer', 'first-wrong', 'complete']);

const componentByType = {
  mc: MultipleChoice,
  sort: DragDrop,
  fill: FillBlank,
  lesen: LesenMC,
  sprach: Sprachbausteine,
};

const view = computed(() => componentByType[props.question.type] || MultipleChoice);
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
