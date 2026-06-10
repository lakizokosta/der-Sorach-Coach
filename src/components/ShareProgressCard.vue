<script setup>
/**
 * Live preview of the shareable progress card (Post / Story).
 */

import { ref, watch, onMounted, computed } from 'vue';

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

function redraw() {
  const el = canvasRef.value;
  if (!el) return;
  const canvas = buildShareCardCanvas({
    totalXP: props.totalXP,
    level: props.level,
    streak: props.streak,
    isMastered: props.isMastered,
    cefrLevel: props.cefrLevel,
    nickname: props.nickname,
    format: format.value,
  });
  el.width = canvas.width;
  el.height = canvas.height;
  const ctx = el.getContext('2d');
  ctx.drawImage(canvas, 0, 0);
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

onMounted(redraw);
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
        ▣ Post
      </button>
      <button
        type="button"
        role="tab"
        class="share-preview__format-btn"
        :class="{ 'share-preview__format-btn--active': format === SHARE_FORMAT.STORY }"
        :aria-selected="format === SHARE_FORMAT.STORY"
        @click="setFormat(SHARE_FORMAT.STORY)"
      >
        ▯ Story
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
