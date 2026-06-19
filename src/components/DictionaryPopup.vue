<script setup>
/**
 * DictionaryPopup — floating translation popup for a single German word.
 *
 * It positions itself just below the clicked word, fetches a translation
 * from MyMemory, and dismisses on any outside click. The component owns
 * its own RU/EN language switch independent of the grammar tip language.
 *
 * @prop {?{word:string, anchor:HTMLElement, token:number}} target
 *   When non-null the popup is shown; when set to `null` the popup hides.
 *   `token` changes on every word click so position and lookup refresh.
 */

import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { translate } from '@/utils/dictionary.js';

const props = defineProps({
  target: { type: Object, default: null },
});

const emit = defineEmits(['close']);

const lang = ref('RU');
const translation = ref('');
const loading = ref(false);
const popupStyle = ref({ display: 'none' });

/** Places the popup under the anchor word (viewport coords — popup is `position: fixed`). */
function syncPosition() {
  const anchor = props.target?.anchor;
  if (!anchor?.isConnected) {
    popupStyle.value = { display: 'none' };
    return;
  }
  const rect = anchor.getBoundingClientRect();
  let left = rect.left;
  if (left + 260 > window.innerWidth) left = Math.max(8, window.innerWidth - 265);
  if (left < 8) left = 8;
  popupStyle.value = {
    top: `${rect.bottom + 6}px`,
    left: `${left}px`,
  };
}

/** Triggers a fresh translation lookup for the current target word. */
async function lookup() {
  if (!props.target?.word) return;
  loading.value = true;
  translation.value = await translate(props.target.word, lang.value);
  loading.value = false;
}

watch(
  () => props.target?.token,
  () => {
    syncPosition();
    lookup();
  },
  { immediate: true },
);

watch(lang, () => {
  if (props.target?.word) lookup();
});

/**
 * Closes the popup when the user clicks anywhere outside of it and
 * outside of any `.dict-word` (so clicking another word reopens it).
 *
 * @param {MouseEvent} event
 */
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
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      "
    >
      <div style="font-weight: 900; color: #AB4DBB; font-size: 14px;">
        {{ target.word }}
      </div>
      <div style="display: flex; gap: 4px;">
        <button
          v-for="l in ['RU', 'EN']"
          :key="l"
          type="button"
          class="lang-btn"
          :class="{ active: lang === l }"
          @click="lang = l"
        >
          {{ l }}
        </button>
      </div>
    </div>
    <div style="color: #444; font-size: 14px;">
      <span v-if="loading">⏳</span>
      <span v-else>{{ translation }}</span>
    </div>
    <div style="font-size: 10px; color: #ccc; margin-top: 6px; text-align: right;">
      MyMemory
    </div>
  </div>
</template>
