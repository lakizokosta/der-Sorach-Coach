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

/** Ball centred in the visible cavity of an isometric cube (Wo · in). */
function insideBallForCube(cx, cy, scale = 1) {
  const h = H * scale;
  const d = D * scale;
  return {
    x: cx,
    y: cy + h + d * 0.38,
    r: 5.5 * scale,
  };
}

/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} [gap]
 */
function arrowLine(x1, y1, x2, y2, gap = 6) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return `M ${x1} ${y1} L ${x2 - ux * gap} ${y2 - uy * gap}`;
}

/**
 * @param {{ cx: number, cy: number, scale?: number }} cube
 * @param {'left'|'right'|'top'|'bottom'|'center'} face
 */
function cubeAnchor(cube, face) {
  const scale = cube.scale ?? 1;
  const w = W * scale;
  const h = H * scale;
  const d = D * scale;
  const { cx, cy } = cube;
  switch (face) {
    case 'left':
      return { x: cx - w * 0.85, y: cy + h * 0.55 };
    case 'right':
      return { x: cx + w * 0.85, y: cy + h * 0.55 };
    case 'top':
      return { x: cx, y: cy - h * 0.35 };
    case 'bottom':
      return { x: cx, y: cy + h + d * 0.15 };
    default:
      return { x: cx, y: cy + h + d * 0.35 };
  }
}

/**
 * @param {{ cx: number, cy: number, scale?: number }} cube
 * @param {{ x: number, y: number }} target
 */
function faceToward(cube, target) {
  const dx = target.x - cube.cx;
  const dy = target.y - cube.cy;
  if (Math.abs(dx) > Math.abs(dy) * 1.15) return dx > 0 ? 'right' : 'left';
  if (Math.abs(dy) > Math.abs(dx) * 1.15) return dy > 0 ? 'bottom' : 'top';
  return dx >= 0 ? 'right' : 'left';
}

/**
 * @param {{ cx: number, cy: number, scale?: number }} cube
 * @param {{ x: number, y: number, r?: number }} ball
 * @param {'out'|'in'|'through'|'to'|'down'|'up'} kind
 */
function buildMovementPath(cube, ball, kind) {
  const r = ball.r ?? 6;
  switch (kind) {
    case 'out': {
      const start = cubeAnchor(cube, 'center');
      return arrowLine(start.x, start.y, ball.x, ball.y, r + 2);
    }
    case 'in': {
      const target = cubeAnchor(cube, 'center');
      const scale = cube.scale ?? 1;
      const start = {
        x: cube.cx - W * scale * 1.75,
        y: cube.cy + H * scale * 1.15,
      };
      return arrowLine(start.x, start.y, target.x, target.y, 4);
    }
    case 'through': {
      const scale = cube.scale ?? 1;
      const w = W * scale;
      const h = H * scale;
      const y = cube.cy + h * 0.35;
      return arrowLine(cube.cx - w - 6, y, cube.cx + w + 12, y, 0);
    }
    case 'to': {
      const start = cubeAnchor(cube, faceToward(cube, ball));
      return arrowLine(start.x, start.y, ball.x, ball.y, r + 2);
    }
    case 'down': {
      const start = cubeAnchor(cube, 'bottom');
      return arrowLine(start.x, start.y, ball.x, ball.y, r + 2);
    }
    case 'up': {
      const start = cubeAnchor(cube, 'top');
      return arrowLine(start.x, start.y, ball.x, ball.y, r + 2);
    }
    default:
      return '';
  }
}

/** @type {Record<string, { cubes: Cube[], ball?: Ball, ballInside?: boolean, movement?: 'out'|'in'|'through'|'to'|'down'|'up', label?: string, badge?: string, caption?: string }>} */
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
    movement: 'through',
    label: 'über',
  },
  durch: {
    cubes: [{ cx: 70, cy: 44 }],
    ball: { x: 70, y: 44 },
    movement: 'through',
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
    movement: 'out',
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
    movement: 'down',
    label: 'geradeaus',
  },
  hinten: {
    cubes: [{ cx: 70, cy: 50 }],
    ball: { x: 70, y: 24 },
    movement: 'up',
    label: 'hinten',
  },
  vorne: {
    cubes: [{ cx: 70, cy: 42 }],
    ball: { x: 70, y: 76 },
    movement: 'down',
    label: 'vorn',
  },

  // Wechselpräpositionen — Wo (Dativ) vs Wohin (Akkusativ)
  'in-wo': {
    cubes: [{ cx: 70, cy: 40 }],
    ballInside: true,
    label: 'in',
    badge: 'Wo · Dativ',
  },
  'in-hin': {
    cubes: [{ cx: 82, cy: 44 }],
    ballInside: true,
    movement: 'in',
    label: 'in',
    badge: 'Wohin · Akkusativ',
  },
  'auf-wo': {
    cubes: [{ cx: 70, cy: 48 }],
    ball: { x: 70, y: 32, r: 5 },
    label: 'auf',
    badge: 'Wo · Dativ',
  },
  'auf-hin': {
    cubes: [{ cx: 70, cy: 50 }],
    ball: { x: 38, y: 18 },
    movement: 'to',
    label: 'auf',
    badge: 'Wohin · Akkusativ',
  },
  'an-wo': {
    cubes: [{ cx: 62, cy: 44 }],
    ball: { x: 88, y: 50, r: 5 },
    label: 'an',
    badge: 'Wo · Dativ',
  },
  'an-hin': {
    cubes: [{ cx: 76, cy: 44 }],
    ball: { x: 30, y: 48 },
    movement: 'to',
    label: 'an',
    badge: 'Wohin · Akkusativ',
  },
  'unter-wo': {
    cubes: [{ cx: 70, cy: 36 }],
    ball: { x: 70, y: 72, r: 5 },
    label: 'unter',
    badge: 'Wo · Dativ',
  },
  'unter-hin': {
    cubes: [{ cx: 70, cy: 40 }],
    ball: { x: 70, y: 16 },
    movement: 'to',
    label: 'unter',
    badge: 'Wohin · Akkusativ',
  },
  'über-wo': {
    cubes: [{ cx: 70, cy: 50 }],
    ball: { x: 70, y: 22, r: 5 },
    label: 'über',
    badge: 'Wo · Dativ',
  },
  'über-hin': {
    cubes: [{ cx: 70, cy: 52 }],
    ball: { x: 28, y: 36 },
    movement: 'through',
    label: 'über',
    badge: 'Wohin · Akkusativ',
  },
  'hinter-wo': {
    cubes: [{ cx: 72, cy: 42 }],
    ball: { x: 48, y: 30, r: 5 },
    label: 'hinter',
    badge: 'Wo · Dativ',
  },
  'hinter-hin': {
    cubes: [{ cx: 58, cy: 44 }],
    ball: { x: 96, y: 48 },
    movement: 'to',
    label: 'hinter',
    badge: 'Wohin · Akkusativ',
  },
  'vor-wo': {
    cubes: [{ cx: 72, cy: 42 }],
    ball: { x: 96, y: 56, r: 5 },
    label: 'vor',
    badge: 'Wo · Dativ',
  },
  'vor-hin': {
    cubes: [{ cx: 82, cy: 44 }],
    ball: { x: 34, y: 48 },
    movement: 'to',
    label: 'vor',
    badge: 'Wohin · Akkusativ',
  },
  'neben-wo': {
    cubes: [{ cx: 58, cy: 44 }],
    ball: { x: 98, y: 48, r: 5 },
    label: 'neben',
    badge: 'Wo · Dativ',
  },
  'neben-hin': {
    cubes: [{ cx: 72, cy: 44 }],
    ball: { x: 28, y: 48 },
    movement: 'to',
    label: 'neben',
    badge: 'Wohin · Akkusativ',
  },
  'zwischen-wo': {
    cubes: [{ cx: 42, cy: 44 }, { cx: 98, cy: 44 }],
    ball: { x: 70, y: 46, r: 5 },
    label: 'zwischen',
    badge: 'Wo · Dativ',
  },
  'zwischen-hin': {
    cubes: [{ cx: 38, cy: 44 }, { cx: 102, cy: 44 }],
    ball: { x: 18, y: 48 },
    movement: 'to',
    label: 'zwischen',
    badge: 'Wohin · Akkusativ',
  },
  'bei-wo': {
    cubes: [{ cx: 58, cy: 44 }],
    ball: { x: 96, y: 50, r: 5 },
    label: 'bei',
    badge: 'Wo · Dativ',
  },
  'nach-hin': {
    cubes: [{ cx: 38, cy: 44 }],
    ball: { x: 112, y: 48, r: 5 },
    movement: 'to',
    label: 'nach',
    badge: 'Wohin',
  },
};

const layout = computed(() => LAYOUTS[props.scene] || LAYOUTS.neben);

const cubeRender = computed(() =>
  layout.value.cubes.map((c) => ({
    ...cubeFaces(c.cx, c.cy, c.scale ?? 1),
    cx: c.cx,
    cy: c.cy,
    scale: c.scale ?? 1,
  })),
);

const ballInside = computed(() => Boolean(layout.value.ballInside));

const effectiveBall = computed(() => {
  if (layout.value.ballInside && cubeRender.value.length) {
    const c = cubeRender.value[0];
    return insideBallForCube(c.cx, c.cy, c.scale);
  }
  return layout.value.ball ?? { x: 70, y: 44, r: 6 };
});

const movementPath = computed(() => {
  const l = layout.value;
  if (!l.movement || !l.cubes.length) return null;
  return buildMovementPath(l.cubes[0], effectiveBall.value, l.movement);
});

const isMovement = computed(() => Boolean(layout.value.movement));

const spatialCaption = computed(() => {
  if (layout.value.badge) return null;
  if (isMovement.value) return '→ = Bewegungsrichtung';
  return layout.value.caption || '● = Position im Raum';
});
</script>

<template>
  <div class="preposition-spatial-hint" role="img" :aria-label="`Räumliche Lage: ${layout.label}`">
    <svg viewBox="0 0 140 88" xmlns="http://www.w3.org/2000/svg" class="preposition-spatial-svg">
      <defs>
        <radialGradient id="ball-shade" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#444" />
          <stop offset="100%" stop-color="#111" />
        </radialGradient>
        <marker id="spatial-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#8e24aa" />
        </marker>
      </defs>

      <g v-for="(cube, i) in cubeRender" :key="'cube-' + i">
        <polygon :points="cube.left" class="cube-face cube-left" />
        <polygon :points="cube.right" class="cube-face cube-right" />
        <circle
          v-if="ballInside && i === 0"
          :cx="effectiveBall.x"
          :cy="effectiveBall.y"
          :r="effectiveBall.r"
          fill="url(#ball-shade)"
          class="spatial-ball spatial-ball--inside"
        />
        <polygon :points="cube.top" class="cube-face cube-top" />
      </g>

      <path
        v-if="movementPath"
        :d="movementPath"
        class="spatial-path spatial-path--movement"
        marker-end="url(#spatial-arrow)"
      />

      <circle
        v-if="!ballInside"
        :cx="effectiveBall.x"
        :cy="effectiveBall.y"
        :r="effectiveBall.r ?? 6"
        fill="url(#ball-shade)"
        class="spatial-ball"
      />
    </svg>
    <p v-if="layout.badge" class="preposition-spatial-badge">{{ layout.badge }}</p>
    <p v-else-if="spatialCaption" class="preposition-spatial-caption">{{ spatialCaption }}</p>
  </div>
</template>
