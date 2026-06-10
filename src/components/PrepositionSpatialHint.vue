<script setup>
/**
 * Minimal isometric cube diagram — black ball shows the spatial relation
 * that matches the expected preposition (Lokal or Wechsel Wo/Wohin).
 */

import { computed } from 'vue';

const props = defineProps({
  scene: { type: String, required: true },
});

/** @typedef {{ cx: number, cy: number, scale?: number }} Cube */
/** @typedef {{ x: number, y: number, r?: number }} Ball */

const W = 22;
const H = 13;
const D = 16;

/**
 * @param {number} cx
 * @param {number} cy
 * @param {number} [scale]
 */
function cubeFaces(cx, cy, scale = 1) {
  const w = W * scale;
  const h = H * scale;
  const d = D * scale;
  const top = `${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`;
  const right = `${cx + w},${cy} ${cx},${cy + h} ${cx},${cy + h + d} ${cx + w},${cy + d}`;
  const left = `${cx - w},${cy} ${cx},${cy + h} ${cx},${cy + h + d} ${cx - w},${cy + d}`;
  return { top, right, left };
}

/** @type {Record<string, { cubes: Cube[], ball: Ball, path?: string, label?: string, badge?: string, caption?: string }>} */
const LAYOUTS = {
  hinter: {
    cubes: [{ cx: 72, cy: 42 }],
    ball: { x: 48, y: 30 },
    label: 'hinten',
  },
  vor: {
    cubes: [{ cx: 58, cy: 40 }],
    ball: { x: 82, y: 58 },
    label: 'vorn',
  },
  neben: {
    cubes: [{ cx: 58, cy: 44 }],
    ball: { x: 98, y: 48 },
    label: 'neben',
  },
  gegenüber: {
    cubes: [{ cx: 42, cy: 44, scale: 0.95 }, { cx: 98, cy: 44, scale: 0.95 }],
    ball: { x: 98, y: 44 },
    label: 'gegenüber',
  },
  zwischen: {
    cubes: [{ cx: 42, cy: 44 }, { cx: 98, cy: 44 }],
    ball: { x: 70, y: 46 },
    label: 'zwischen',
  },
  unter: {
    cubes: [{ cx: 70, cy: 36 }],
    ball: { x: 70, y: 72 },
    label: 'unter',
  },
  auf: {
    cubes: [{ cx: 70, cy: 48 }],
    ball: { x: 70, y: 32 },
    label: 'auf',
  },
  'über-above': {
    cubes: [{ cx: 70, cy: 50 }],
    ball: { x: 70, y: 22 },
    label: 'über',
  },
  'über-across': {
    cubes: [{ cx: 70, cy: 52 }],
    ball: { x: 92, y: 36 },
    path: 'M 28 36 L 112 36',
    label: 'über',
  },
  durch: {
    cubes: [{ cx: 70, cy: 44 }],
    ball: { x: 70, y: 44 },
    path: 'M 44 44 L 96 44',
    label: 'durch',
  },
  an: {
    cubes: [{ cx: 66, cy: 44 }],
    ball: { x: 92, y: 50 },
    label: 'an',
  },
  aus: {
    cubes: [{ cx: 58, cy: 44 }],
    ball: { x: 96, y: 50 },
    path: 'M 78 50 L 104 50',
    label: 'aus',
  },
  'rechte-seite': {
    cubes: [{ cx: 58, cy: 44 }],
    ball: { x: 90, y: 52 },
    label: 'rechts',
  },
  'linke-seite': {
    cubes: [{ cx: 82, cy: 44 }],
    ball: { x: 50, y: 52 },
    label: 'links',
  },
  links: {
    cubes: [{ cx: 82, cy: 44 }],
    ball: { x: 34, y: 48 },
    label: 'links',
  },
  rechts: {
    cubes: [{ cx: 58, cy: 44 }],
    ball: { x: 106, y: 48 },
    label: 'rechts',
  },
  geradeaus: {
    cubes: [{ cx: 70, cy: 50 }],
    ball: { x: 70, y: 78 },
    path: 'M 70 58 L 70 74',
    label: 'geradeaus',
  },
  hinten: {
    cubes: [{ cx: 70, cy: 50 }],
    ball: { x: 70, y: 24 },
    path: 'M 70 32 L 70 20',
    label: 'hinten',
  },
  vorne: {
    cubes: [{ cx: 70, cy: 42 }],
    ball: { x: 70, y: 76 },
    path: 'M 70 50 L 70 70',
    label: 'vorn',
  },

  // Wechselpräpositionen — Wo (Dativ) vs Wohin (Akkusativ)
  'in-wo': {
    cubes: [{ cx: 70, cy: 40 }],
    ball: { x: 70, y: 52, r: 5 },
    label: 'in',
    badge: 'Wo · Dativ',
    caption: '● = im Inneren (Ort)',
  },
  'in-hin': {
    cubes: [{ cx: 82, cy: 44 }],
    ball: { x: 28, y: 48 },
    path: 'M 34 48 L 60 50',
    label: 'in',
    badge: 'Wohin · Akkusativ',
    caption: '● → hinein (Bewegung)',
  },
  'auf-wo': {
    cubes: [{ cx: 70, cy: 48 }],
    ball: { x: 70, y: 32, r: 5 },
    label: 'auf',
    badge: 'Wo · Dativ',
    caption: '● = oben auf (Ort)',
  },
  'auf-hin': {
    cubes: [{ cx: 70, cy: 50 }],
    ball: { x: 38, y: 18 },
    path: 'M 42 22 L 66 28',
    label: 'auf',
    badge: 'Wohin · Akkusativ',
    caption: '● → hinauf (Bewegung)',
  },
  'an-wo': {
    cubes: [{ cx: 62, cy: 44 }],
    ball: { x: 88, y: 50, r: 5 },
    label: 'an',
    badge: 'Wo · Dativ',
    caption: '● = an der Fläche (Ort)',
  },
  'an-hin': {
    cubes: [{ cx: 76, cy: 44 }],
    ball: { x: 30, y: 48 },
    path: 'M 36 48 L 58 48',
    label: 'an',
    badge: 'Wohin · Akkusativ',
    caption: '● → hinan (Bewegung)',
  },
  'unter-wo': {
    cubes: [{ cx: 70, cy: 36 }],
    ball: { x: 70, y: 72, r: 5 },
    label: 'unter',
    badge: 'Wo · Dativ',
    caption: '● = darunter (Ort)',
  },
  'unter-hin': {
    cubes: [{ cx: 70, cy: 40 }],
    ball: { x: 70, y: 16 },
    path: 'M 70 22 L 70 34',
    label: 'unter',
    badge: 'Wohin · Akkusativ',
    caption: '● → hinunter (Bewegung)',
  },
  'über-wo': {
    cubes: [{ cx: 70, cy: 50 }],
    ball: { x: 70, y: 22, r: 5 },
    label: 'über',
    badge: 'Wo · Dativ',
    caption: '● = darüber (Ort)',
  },
  'über-hin': {
    cubes: [{ cx: 70, cy: 52 }],
    ball: { x: 28, y: 36 },
    path: 'M 32 36 L 108 36',
    label: 'über',
    badge: 'Wohin · Akkusativ',
    caption: '● → hinüber (Bewegung)',
  },
  'hinter-wo': {
    cubes: [{ cx: 72, cy: 42 }],
    ball: { x: 48, y: 30, r: 5 },
    label: 'hinter',
    badge: 'Wo · Dativ',
    caption: '● = dahinter (Ort)',
  },
  'hinter-hin': {
    cubes: [{ cx: 58, cy: 44 }],
    ball: { x: 96, y: 48 },
    path: 'M 90 48 L 66 44',
    label: 'hinter',
    badge: 'Wohin · Akkusativ',
    caption: '● → dahinter (Bewegung)',
  },
  'vor-wo': {
    cubes: [{ cx: 72, cy: 42 }],
    ball: { x: 96, y: 56, r: 5 },
    label: 'vor',
    badge: 'Wo · Dativ',
    caption: '● = davor (Ort)',
  },
  'vor-hin': {
    cubes: [{ cx: 82, cy: 44 }],
    ball: { x: 34, y: 48 },
    path: 'M 40 48 L 62 48',
    label: 'vor',
    badge: 'Wohin · Akkusativ',
    caption: '● → davor (Bewegung)',
  },
  'neben-wo': {
    cubes: [{ cx: 58, cy: 44 }],
    ball: { x: 98, y: 48, r: 5 },
    label: 'neben',
    badge: 'Wo · Dativ',
    caption: '● = daneben (Ort)',
  },
  'neben-hin': {
    cubes: [{ cx: 72, cy: 44 }],
    ball: { x: 28, y: 48 },
    path: 'M 34 48 L 54 48',
    label: 'neben',
    badge: 'Wohin · Akkusativ',
    caption: '● → daneben (Bewegung)',
  },
  'zwischen-wo': {
    cubes: [{ cx: 42, cy: 44 }, { cx: 98, cy: 44 }],
    ball: { x: 70, y: 46, r: 5 },
    label: 'zwischen',
    badge: 'Wo · Dativ',
    caption: '● = dazwischen (Ort)',
  },
  'zwischen-hin': {
    cubes: [{ cx: 38, cy: 44 }, { cx: 102, cy: 44 }],
    ball: { x: 18, y: 48 },
    path: 'M 24 48 L 52 48',
    label: 'zwischen',
    badge: 'Wohin · Akkusativ',
    caption: '● → dazwischen (Bewegung)',
  },
  'bei-wo': {
    cubes: [{ cx: 58, cy: 44 }],
    ball: { x: 96, y: 50, r: 5 },
    label: 'bei',
    badge: 'Wo · Dativ',
    caption: '● = in der Nähe (Ort)',
  },
  'nach-hin': {
    cubes: [{ cx: 38, cy: 44 }],
    ball: { x: 112, y: 48, r: 5 },
    path: 'M 46 48 L 104 48',
    label: 'nach',
    badge: 'Wohin',
    caption: '● → Ziel (Richtung)',
  },
};

const layout = computed(() => LAYOUTS[props.scene] || LAYOUTS.neben);

const cubeRender = computed(() =>
  layout.value.cubes.map((c) => ({
    ...cubeFaces(c.cx, c.cy, c.scale ?? 1),
    cx: c.cx,
    cy: c.cy,
  })),
);
</script>

<template>
  <div class="preposition-spatial-hint" role="img" :aria-label="`Räumliche Lage: ${layout.label}`">
    <svg viewBox="0 0 140 88" xmlns="http://www.w3.org/2000/svg" class="preposition-spatial-svg">
      <defs>
        <radialGradient id="ball-shade" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#444" />
          <stop offset="100%" stop-color="#111" />
        </radialGradient>
        <marker id="spatial-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#ab4dbb" opacity="0.55" />
        </marker>
      </defs>

      <path
        v-if="layout.path"
        :d="layout.path"
        class="spatial-path"
        marker-end="url(#spatial-arrow)"
      />

      <g v-for="(cube, i) in cubeRender" :key="'cube-' + i">
        <polygon :points="cube.left" class="cube-face cube-left" />
        <polygon :points="cube.right" class="cube-face cube-right" />
        <polygon :points="cube.top" class="cube-face cube-top" />
      </g>

      <circle
        :cx="layout.ball.x"
        :cy="layout.ball.y"
        :r="layout.ball.r ?? 6"
        fill="url(#ball-shade)"
        class="spatial-ball"
      />
    </svg>
    <p v-if="layout.badge" class="preposition-spatial-badge">{{ layout.badge }}</p>
    <p class="preposition-spatial-caption">{{ layout.caption || '● = Position im Raum' }}</p>
  </div>
</template>
