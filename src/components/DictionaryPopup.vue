<script setup>
/**
 * DictionaryPopup — floating translation for a clicked German word.
 *
 * Uses the app UI locale (DE / RU / EN). Local vocabulary first, MyMemory fallback.
 */

import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';

import { lookupWord, resolveLemma } from '@/utils/dictionary.js';
import { useI18n } from '@/i18n/index.js';

const props = defineProps({
  target: { type: Object, default: null },
});

const emit = defineEmits(['close']);

const { locale } = useI18n();

const translation = ref('');
const lemmaLine = ref('');
const posLabel = ref('');
const source = ref('local');
const loading = ref(false);
const popupStyle = ref({ display: 'none' });

const genderLabels = { m: 'der', f: 'die', n: 'das' };

const showLemma = computed(
  () =>
    lemmaLine.value &&
    props.target?.word &&
    lemmaLine.value.toLowerCase() !== String(props.target.word).toLowerCase(),
);

function syncPosition() {
  const anchor = props.target?.anchor;
  if (!anchor?.isConnected) {
    popupStyle.value = { display: 'none' };
    return;
  }
  const rect = anchor.getBoundingClientRect();
  let left = rect.left;
  if (left + 280 > window.innerWidth) left = Math.max(8, window.innerWidth - 285);
  if (left < 8) left = 8;
  popupStyle.value = {
    top: `${rect.bottom + 6}px`,
    left: `${left}px`,
  };
}

async function lookup() {
  if (!props.target?.word) return;
  loading.value = true;
  const lang = locale.value === 'ru' ? 'ru' : locale.value === 'en' ? 'en' : 'de';
  const resolved = resolveLemma(props.target.word);
  const result = await lookupWord(props.target.word, lang);

  lemmaLine.value = resolved.lemma;
  translation.value = result.translation;

  const pos = result.pos;
  if (pos === 'verb') posLabel.value = 'Verb';
  else if (pos === 'adj') posLabel.value = 'Adj.';
  else if (pos === 'noun' && result.gender) {
    posLabel.value = genderLabels[result.gender] || 'Nomen';
  } else if (pos === 'noun') posLabel.value = 'Nomen';
  else posLabel.value = '';

  source.value = result.source;
  loading.value = false;
}

watch(
  () => [props.target?.token, locale.value],
  () => {
    syncPosition();
    lookup();
  },
  { immediate: true },
);

function handleOutsideClick(event) {
  const root = document.getElementById('dict-popup-root');
  if (root && !root.contains(event.target) && !event.target.closest?.('.dict-word')) {
    emit('close');
  }
}

onMounted(() => {
  setTimeout(() => document.addEventListener('click', handleOutsideClick), 150);
  window.addEventListener('scroll', syncPosition, true);
  window.addEventListener('resize', syncPosition);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick);
  window.removeEventListener('scroll', syncPosition, true);
  window.removeEventListener('resize', syncPosition);
});
</script>

<template>
  <div v-if="target" id="dict-popup-root" class="dict-popup" :style="popupStyle">
    <div class="dict-popup__head">
      <div>
        <div class="dict-popup__word">{{ target.word }}</div>
        <div v-if="showLemma" class="dict-popup__lemma">→ {{ lemmaLine }}</div>
      </div>
      <span v-if="posLabel" class="dict-popup__pos">{{ posLabel }}</span>
    </div>
    <div class="dict-popup__body">
      <span v-if="loading">⏳</span>
      <span v-else>{{ translation }}</span>
    </div>
    <div v-if="source === 'api'" class="dict-popup__source">MyMemory</div>
    <div v-else-if="source === 'local' && locale !== 'de'" class="dict-popup__source">
      Wörterbuch
    </div>
  </div>
</template>
