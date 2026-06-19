<script setup>
/**
 * Live preview of the shareable progress card (Post / Story).
 */

import { ref, watch, onMounted, onUnmounted, computed } from 'vue';

import {
  buildShareCardCanvas,
  getShareTagline,
  getEarnedBadges,
  SHARE_FORMAT,
} from '@/utils/shareCard.js';
import { getAllTopics } from '@/data/premiumTopics.js';

const format = defineModel('format', { type: String, default: SHARE_FORMAT.POST });

const props = defineProps({
  totalXP: { type: Number, required: true },
  level: { type: Object, required: true },
  streak: { type: Object, required: true },
  isMastered: { type: Function, required: true },
  cefrLevel: { type: String, default: '' },
  nickname: { type: String, default: '' },
});

const canvasRef = ref(null);
let resizeObserver = null;

/** Draw full-res card into preview canvas at display size (sharper on retina). */
function redraw() {
  const el = canvasRef.value;
  if (!el) return;
  const source = buildShareCardCanvas({
    totalXP: props.totalXP,
    level: props.level,
    streak: props.streak,
    isMastered: props.isMastered,
    cefrLevel: props.cefrLevel,
    nickname: props.nickname,
    format: format.value,
  });

  const frame = el.parentElement;
  const cssWidth = frame?.clientWidth || 320;
  const cssHeight = Math.round(cssWidth * (source.height / source.width));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  el.width = Math.round(cssWidth * dpr);
  el.height = Math.round(cssHeight * dpr);
  el.style.width = `${cssWidth}px`;
  el.style.height = `${cssHeight}px`;

  const ctx = el.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.clearRect(0, 0, cssWidth, cssHeight);
  ctx.drawImage(source, 0, 0, cssWidth, cssHeight);
}

const masteredCount = computed(() =>
  getAllTopics().filter((t) => props.isMastered(t.key)).length,
);

const tagline = computed(() =>
  getShareTagline({ streak: props.streak, masteredCount: masteredCount.value, level: props.level }),
);

const earnedBadges = computed(() =>
  getEarnedBadges({
    totalXP: props.totalXP,
    level: props.level,
    streak: props.streak,
    masteredCount: masteredCount.value,
  }),
);

const formatHint = computed(() =>
  format.value === SHARE_FORMAT.STORY
    ? 'Vertikal 1080×1920 · ideal für Stories'
    : 'Quadrat 1080×1080 · ideal für Feed',
);

function setFormat(next) {
  format.value = next;
}

onMounted(() => {
  redraw();
  if (typeof ResizeObserver !== 'undefined' && canvasRef.value?.parentElement) {
    resizeObserver = new ResizeObserver(() => redraw());
    resizeObserver.observe(canvasRef.value.parentElement);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});
watch(
  () => [props.totalXP, props.level, props.streak, props.cefrLevel, props.nickname, format.value],
  redraw,
  { deep: true },
);
</script>

<template>
  <section
    class="share-preview"
    :class="{ 'share-preview--story': format === SHARE_FORMAT.STORY }"
    aria-label="Fortschritts-Karte Vorschau"
  >
    <div class="share-preview__head">
      <span class="share-preview__title">📤 Deine Erfolgs-Karte</span>
      <span class="share-preview__hint">{{ formatHint }}</span>
    </div>

    <div class="share-preview__format" role="tablist" aria-label="Kartenformat">
      <button
        type="button"
        role="tab"
        class="share-preview__format-btn"
        :class="{ 'share-preview__format-btn--active': format === SHARE_FORMAT.POST }"
        :aria-selected="format === SHARE_FORMAT.POST"
        @click="setFormat(SHARE_FORMAT.POST)"
      >
        <span class="share-preview__format-btn-inner">
          <svg class="share-preview__format-icon" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="2.5" y="2.5" width="19" height="19" rx="4" fill="none" stroke="currentColor" stroke-width="1.8" />
            <rect x="5.5" y="5.5" width="13" height="9.5" rx="2" fill="currentColor" opacity="0.22" />
            <circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" />
            <path
              d="M5.5 13.5 L9 10 L11.5 12 L18.5 7.5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <rect x="5.5" y="16.5" width="9" height="1.6" rx="0.8" fill="currentColor" opacity="0.45" />
          </svg>
          <span>Post</span>
        </span>
      </button>
      <button
        type="button"
        role="tab"
        class="share-preview__format-btn"
        :class="{ 'share-preview__format-btn--active': format === SHARE_FORMAT.STORY }"
        :aria-selected="format === SHARE_FORMAT.STORY"
        @click="setFormat(SHARE_FORMAT.STORY)"
      >
        <span class="share-preview__format-btn-inner">
          <svg class="share-preview__format-icon" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="6.5" y="1.5" width="11" height="21" rx="3" fill="none" stroke="currentColor" stroke-width="1.8" />
            <circle cx="12" cy="6.5" r="2.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="3.2 2.2" />
            <rect x="8.5" y="11" width="7" height="1.6" rx="0.8" fill="currentColor" opacity="0.45" />
            <rect x="8.5" y="14" width="5" height="1.6" rx="0.8" fill="currentColor" opacity="0.3" />
            <rect x="10" y="18.5" width="4" height="1.2" rx="0.6" fill="currentColor" opacity="0.35" />
          </svg>
          <span>Story</span>
        </span>
      </button>
    </div>

    <div class="share-preview__frame">
      <canvas ref="canvasRef" class="share-preview__canvas" aria-hidden="true" />
    </div>

    <p class="share-preview__tagline">{{ tagline }}</p>

    <div v-if="earnedBadges.length" class="share-preview__badges" aria-label="Verdiente Abzeichen">
      <span
        v-for="(badge, i) in earnedBadges"
        :key="i"
        class="share-preview__badge"
      >
        {{ badge.emoji }} {{ badge.label }}
      </span>
    </div>
  </section>
</template>
