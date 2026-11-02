<script setup>
/**
 * GrammarTip — collapsible, multilingual hint box shown after a wrong
 * answer (Premium only in the original trainer).
 *
 * The component lets the user switch between RU / DE / EN versions of
 * the same hint without re-fetching anything.
 *
 * @prop {string}  topicKey  Canonical topic key (e.g. "AKKUSATIVA1").
 * @prop {string}  initial   Initial language code (default "DE").
 */

import { ref, watchEffect } from 'vue';
import { getStaticHint } from '@/data/grammarHints.js';

const props = defineProps({
  topicKey: { type: String, required: true },
  initial: { type: String, default: 'DE' },
});

const lang = ref(props.initial || 'DE');
const text = ref('');

watchEffect(() => {
  text.value = getStaticHint(props.topicKey, lang.value) || '';
});

/**
 * Switch the active language.
 *
 * @param {string} l  'RU' | 'DE' | 'EN'.
 */
function setLang(l) {
  lang.value = l;
}
</script>

<template>
  <div v-if="text" class="grammar-tip-box">
    <div class="grammar-tip-header">
      <div class="grammar-tip-title">📚 Grammatik-Tipp</div>
      <div class="lang-btn-row">
        <button
          v-for="l in ['RU', 'DE', 'EN']"
          :key="l"
          type="button"
          class="lang-btn"
          :class="{ active: lang === l }"
          @click="setLang(l)"
        >
          {{ l }}
        </button>
      </div>
    </div>
    <div style="font-size: 13px; line-height: 1.6; color: #444;">{{ text }}</div>
  </div>
</template>
