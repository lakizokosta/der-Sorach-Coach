<script setup>
/**
 * LzdLogo — the purple "Lernziel Deutsch" SVG mark.
 *
 * Always clickable: clicking returns the user to the landing route.
 * Use the `small` prop in the trainer / premium screens where space is
 * tighter than on the landing page.
 *
 * @prop {boolean} small  Render the compact 78px version instead of 198px.
 */

import { useRouter } from 'vue-router';

defineProps({
  small: { type: Boolean, default: false },
});

const router = useRouter();

/** Navigates to the landing page. Exposed via the click/keydown handlers. */
function goHome() {
  router.push('/');
}
</script>

<template>
  <button
    type="button"
    class="logo-wrap"
    title="Zur Startseite"
    aria-label="Zur Startseite"
    @click="goHome"
    @keydown.enter.prevent="goHome"
    @keydown.space.prevent="goHome"
  >
    <svg
      :class="['lzd-logo', { small }]"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="200" cy="200" r="185" fill="#AB4DBB" />
      <polygon
        points="80,112 100,135 90,135 90,268 145,268 145,290 70,290 70,135 60,135"
        fill="white"
      />
      <path
        d="M 157,115 H 232 V 135 L 179,270 H 232 V 290 H 157 V 270 L 210,135 H 157 Z"
        fill="white"
      />
      <path
        d="M 244,115 H 268 A 62,87.5,0,0,1,268,290 H 244 Z M 280,140 A 32,62,0,0,1,280,265 Z"
        fill="white"
        fill-rule="evenodd"
      />
    </svg>
  </button>
</template>
