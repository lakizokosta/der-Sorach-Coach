<script setup>
/**
 * DictionaryPopup — floating translation popup for a single German word.
 *
 * It positions itself just below the clicked word, fetches a translation
 * from MyMemory, and dismisses on any outside click. The component owns
 * its own RU/EN language switch independent of the grammar tip language.
 *
 * @prop {?{word:string, rect:DOMRect}} target
 *   When non-null the popup is shown; when set to `null` the popup hides.
 */

import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { translate } from '@/utils/dictionary.js';

const props = defineProps({
  target: { type: Object, default: null },
});

const emit = defineEmits(['close']);

const lang = ref('RU');
const translation = ref('');
const loading = ref(false);

const style = computed(() => {
  if (!props.target?.rect) return { display: 'none' };
  const rect = props.target.rect;
  const top = rect.bottom + window.scrollY + 6;
  let left = rect.left + window.scrollX;
  if (left + 260 > window.innerWidth) left = window.innerWidth - 265;
  return { top: `${top}px`, left: `${left}px` };
});

/** Triggers a fresh translation lookup for the current target word. */
async function lookup() {
  if (!props.target?.word) return;
  loading.value = true;
  translation.value = await translate(props.target.word, lang.value);
  loading.value = false;
}

watch(() => [props.target?.word, lang.value], lookup, { immediate: true });

/**
 * Closes the popup when the user clicks anywhere outside of it and
 * outside of any `.dict-word` (so clicking another word reopens it).
 *
 * @param {MouseEvent} event
 */
function handleOutsideClick(event) {
  const root = document.getElementById('dict-popup-root');
  if (root && !root.contains(event.target) && !event.target.classList.contains('dict-word')) {
    emit('close');
  }
}

onMounted(() => {
  setTimeout(() => document.addEventListener('click', handleOutsideClick), 150);
});
onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick));
</script>

<template>
  <div v-if="target" id="dict-popup-root" class="dict-popup" :style="style">
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      "
    >
      <div style="font-weight: 900; color: #AB4DBB; font-size: 14px;">
        📖 {{ target.word }}
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
