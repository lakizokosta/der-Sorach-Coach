/**
 * @fileoverview Shareable progress cards for Instagram / Facebook.
 * Post: 1080×1080 · Story: 1080×1920. Renders to Canvas, shares via Web Share API.
 */

import { getAllTopics } from '@/data/premiumTopics.js';

export const SHARE_FORMAT = {
  POST: 'post',
  STORY: 'story',
};

const POST_SIZE = 1080;
const STORY_W = 1080;
const STORY_H = 1920;

const DAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

/** @type {Array<{id:string, emoji:string, label:string, check:Function}>} */
const BADGE_DEFS = [
  { id: 'streak7', emoji: '🔥', label: '7 Tage', check: (d) => d.streak.longestStreak >= 7 },
  { id: 'streak14', emoji: '💪', label: '14 Tage', check: (d) => d.streak.longestStreak >= 14 },
  { id: 'streak30', emoji: '🏆', label: '30 Tage', check: (d) => d.streak.longestStreak >= 30 },
  { id: 'topic1', emoji: '✅', label: '1. Thema', check: (d) => d.masteredCount >= 1 },
  { id: 'topic10', emoji: '📚', label: '10 Themen', check: (d) => d.masteredCount >= 10 },
  { id: 'topic25', emoji: '🎓', label: '25 Themen', check: (d) => d.masteredCount >= 25 },
  { id: 'xp500', emoji: '⭐', label: '500 XP', check: (d) => d.totalXP >= 500 },
  { id: 'xp1500', emoji: '💎', label: '1500 XP', check: (d) => d.totalXP >= 1500 },
  { id: 'lv3', emoji: '🚀', label: 'Lv3+', check: (d) => d.level.num >= 3 },
  { id: 'lv5', emoji: '👑', label: 'Meister', check: (d) => d.level.num >= 5 },
];

/**
 * @param {!CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} r
 */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * @param {Object} p
 * @return {string}
 */
export function getShareTagline(p) {
  const { streak, masteredCount, level } = p;
  if (streak.currentStreak >= 14) return 'Zwei Wochen Streak! 🔥';
  if (streak.currentStreak >= 7) return 'Eine Woche jeden Tag! 🔥';
  if (masteredCount >= 10) return 'Grammatik-Profi! 📚';
  if (masteredCount >= 1) return 'Erstes Thema gemeistert! ✅';
  if (level.num >= 4) return 'Auf dem Weg zum Profi! 💪';
  if (level.num >= 2) return 'Ich bleibe dran! 🇩🇪';
  return 'Deutsch lernen — jeden Tag! ✨';
}

/**
 * @param {Object} data
 * @return {Array<{emoji:string, label:string}>}
 */
export function getEarnedBadges(data) {
  return BADGE_DEFS.filter((b) => b.check(data)).map((b) => ({
    emoji: b.emoji,
    label: b.label,
  }));
}

/**
 * @param {Array<string>} activeDays
 * @return {Array<{iso:string, label:string, active:boolean, isToday:boolean}>}
 */
function getLast7Days(activeDays) {
  const active = new Set(activeDays || []);
  const todayIso = new Date().toISOString().split('T')[0];
  const out = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - offset);
    const iso = d.toISOString().split('T')[0];
    const dayIdx = (d.getDay() + 6) % 7;
    out.push({
      iso,
      label: DAY_LABELS[dayIdx],
      active: active.has(iso),
      isToday: iso === todayIso,
    });
  }
  return out;
}

/**
 * @param {!Function} isMastered
 * @param {number} [limit]
 * @return {string[]}
 */
function masteredNames(isMastered, limit = 4) {
  return getAllTopics()
    .filter((t) => isMastered(t.key))
    .slice(0, limit)
    .map((t) => `${t.level} · ${t.name}`);
}

/**
 * @param {!CanvasRenderingContext2D} ctx
 * @param {number} w
 * @param {number} h
 */
function drawBackground(ctx, w, h) {
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#3d0f5c');
  bg.addColorStop(0.45, '#7b2d8b');
  bg.addColorStop(1, '#c86dd7');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const orbs = [
    { x: w * 0.17, y: h * 0.18, r: w * 0.2, a: 0.14 },
    { x: w * 0.83, y: h * 0.14, r: w * 0.17, a: 0.1 },
    { x: w * 0.76, y: h * 0.82, r: w * 0.24, a: 0.12 },
  ];
  for (const o of orbs) {
    const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
    g.addColorStop(0, `rgba(255,255,255,${o.a})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * @param {!CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} cy
 * @param {number} radius
 * @param {number} lineW
 * @param {number} pct
 * @param {string} color
 */
function drawRing(ctx, cx, cy, radius, lineW, pct, color) {
  ctx.lineCap = 'round';
  ctx.lineWidth = lineW;
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  if (pct > 0) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(pct, 1));
    ctx.stroke();
  }
}

/**
 * @param {!CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {string} value
 * @param {string} label
 * @param {string} accent
 * @param {number} [valueSize]
 */
function drawStatTile(ctx, x, y, w, h, value, label, accent, valueSize = 52) {
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  roundRect(ctx, x, y, w, h, 28);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, 28);
  ctx.stroke();

  ctx.fillStyle = accent;
  ctx.font = `bold ${valueSize}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(value, x + w / 2, y + h / 2 - 14);

  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = 'bold 22px Arial, Helvetica, sans-serif';
  ctx.fillText(label, x + w / 2, y + h / 2 + 32);
}

/**
 * @param {!CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} y
 * @param {string} nickname
 * @param {number} scale
 */
function drawNickname(ctx, cx, y, nickname, scale) {
  const name = (nickname || 'Lernender').trim().slice(0, 24);
  const initial = (name[0] || 'L').toUpperCase();
  const avatarR = 28 * scale;

  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.arc(cx - 120 * scale, y, avatarR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.font = `bold ${Math.round(28 * scale)}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initial, cx - 120 * scale, y);

  ctx.textAlign = 'left';
  ctx.font = `bold ${Math.round(34 * scale)}px Arial, Helvetica, sans-serif`;
  ctx.fillText(name, cx - 78 * scale, y);

  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = `${Math.round(20 * scale)}px Arial, Helvetica, sans-serif`;
  ctx.fillText('Deutsch-Lerner', cx - 78 * scale, y + 28 * scale);
}

/**
 * @param {!CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} y
 * @param {Array} days
 * @param {number} scale
 */
function drawStreakWeek(ctx, cx, y, days, scale) {
  const cell = 56 * scale;
  const gap = 14 * scale;
  const totalW = days.length * cell + (days.length - 1) * gap;
  let x = cx - totalW / 2;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (const day of days) {
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    roundRect(ctx, x, y, cell, cell, 14 * scale);
    ctx.fill();

    if (day.isToday) {
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      roundRect(ctx, x, y, cell, cell, 14 * scale);
      ctx.stroke();
    }

    if (day.active) {
      ctx.font = `${Math.round(28 * scale)}px Arial, Helvetica, sans-serif`;
      ctx.fillText('🔥', x + cell / 2, y + cell / 2 - 4 * scale);
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.beginPath();
      ctx.arc(x + cell / 2, y + cell / 2, 8 * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = `bold ${Math.round(16 * scale)}px Arial, Helvetica, sans-serif`;
    ctx.fillText(day.label, x + cell / 2, y + cell + 18 * scale);

    x += cell + gap;
  }
}

/**
 * @param {!CanvasRenderingContext2D} ctx
 * @param {number} cx
 * @param {number} y
 * @param {Array<{emoji:string, label:string}>} badges
 * @param {number} maxW
 * @param {number} scale
 * @return {number} bottom Y
 */
function drawBadges(ctx, cx, y, badges, maxW, scale) {
  const list = badges.slice(0, 6);
  if (!list.length) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = `${Math.round(20 * scale)}px Arial, Helvetica, sans-serif`;
    ctx.fillText('Noch keine Abzeichen — weiter üben!', cx, y + 20 * scale);
    return y + 40 * scale;
  }

  const padX = 18 * scale;
  const padY = 10 * scale;
  const rowH = 44 * scale;
  const gap = 12 * scale;
  const fontSize = Math.round(20 * scale);
  ctx.font = `bold ${fontSize}px Arial, Helvetica, sans-serif`;

  let rowX = cx - maxW / 2;
  let rowY = y;
  let rowBottom = y;

  for (const badge of list) {
    const text = `${badge.emoji} ${badge.label}`;
    const tw = ctx.measureText(text).width + padX * 2;
    if (rowX + tw > cx + maxW / 2 && rowX > cx - maxW / 2) {
      rowX = cx - maxW / 2;
      rowY += rowH + gap;
    }

    ctx.fillStyle = 'rgba(255,215,0,0.22)';
    roundRect(ctx, rowX, rowY, tw, rowH, rowH / 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,215,0,0.55)';
    ctx.lineWidth = 2;
    roundRect(ctx, rowX, rowY, tw, rowH, rowH / 2);
    ctx.stroke();

    ctx.fillStyle = '#fff8e1';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, rowX + padX, rowY + rowH / 2);

    rowX += tw + gap;
    rowBottom = rowY + rowH;
  }

  return rowBottom;
}

/**
 * @param {Object} data
 * @param {number} data.totalXP
 * @param {Object} data.level
 * @param {Object} data.streak
 * @param {!Function} data.isMastered
 * @param {string} [data.cefrLevel]
 * @param {string} [data.nickname]
 * @param {string} [data.format]
 * @param {!CanvasRenderingContext2D} ctx
 * @param {number} w
 * @param {number} h
 */
function renderShareCard(data, ctx, w, h) {
  const {
    totalXP,
    level,
    streak,
    isMastered,
    cefrLevel = '',
    nickname = '',
    format = SHARE_FORMAT.POST,
  } = data;

  const isStory = format === SHARE_FORMAT.STORY;
  const scale = isStory ? 1.15 : 0.82;
  const cx = w / 2;
  const pad = isStory ? 64 : 56;

  const allTopics = getAllTopics();
  const masteredCount = allTopics.filter((t) => isMastered(t.key)).length;
  const themePct = allTopics.length ? masteredCount / allTopics.length : 0;
  const mastered = masteredNames(isMastered, isStory ? 5 : 0);
  const tagline = getShareTagline({ streak, masteredCount, level });
  const badges = getEarnedBadges({ totalXP, level, streak, masteredCount });
  const weekDays = getLast7Days(streak.activeDays);

  drawBackground(ctx, w, h);

  const innerH = h - pad * 2;
  const innerW = w - pad * 2;
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  roundRect(ctx, pad, pad, innerW, innerH, isStory ? 56 : 48);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 3;
  roundRect(ctx, pad, pad, innerW, innerH, isStory ? 56 : 48);
  ctx.stroke();

  let y = pad + (isStory ? 56 : 40);

  ctx.fillStyle = '#fff';
  ctx.font = `bold ${isStory ? 36 : 30}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('Der SprachCoach', cx, y);
  y += isStory ? 38 : 30;

  drawNickname(ctx, cx, y + (isStory ? 18 : 14) * scale, nickname, scale);
  y += isStory ? 72 : 48;

  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = `${isStory ? 24 : 20}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('Mein Deutsch-Fortschritt', cx, y);
  y += isStory ? 36 : 22;

  if (cefrLevel) {
    const badgeW = 200;
    const badgeH = 52;
    const bx = w - pad - badgeW - 8;
    const by = pad + 36;
    ctx.fillStyle = 'rgba(255,215,0,0.95)';
    roundRect(ctx, bx, by, badgeW, badgeH, 26);
    ctx.fill();
    ctx.fillStyle = '#3d0f5c';
    ctx.font = 'bold 24px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Niveau ${cefrLevel}`, bx + badgeW / 2, by + badgeH / 2 + 2);
  }

  const ringY = y + (isStory ? 100 : 58);
  const ringR = isStory ? 108 : 68;
  const ringLine = isStory ? 20 : 14;
  drawRing(
    ctx,
    cx,
    ringY,
    ringR + 30,
    ringLine,
    level.next ? (totalXP - level.prev) / (level.next - level.prev) : 1,
    '#ffd700',
  );
  ctx.fillStyle = level.color;
  ctx.beginPath();
  ctx.arc(cx, ringY, ringR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${isStory ? 72 : 48}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`Lv${level.num}`, cx, ringY - 4);
  ctx.font = `bold ${isStory ? 30 : 20}px Arial, Helvetica, sans-serif`;
  ctx.fillText(level.name, cx, ringY + (isStory ? 36 : 28));

  y = ringY + ringR + (isStory ? 56 : 32);

  const tileW = isStory ? 280 : 220;
  const tileH = isStory ? 130 : 92;
  const tileGap = isStory ? 24 : 18;
  const tilesStart = (w - tileW * 3 - tileGap * 2) / 2;
  drawStatTile(ctx, tilesStart, y, tileW, tileH, String(totalXP), 'XP ⭐', '#ffd700', isStory ? 56 : 40);
  drawStatTile(
    ctx,
    tilesStart + tileW + tileGap,
    y,
    tileW,
    tileH,
    String(streak.currentStreak),
    'Streak 🔥',
    '#ffab40',
    isStory ? 56 : 40,
  );
  drawStatTile(
    ctx,
    tilesStart + (tileW + tileGap) * 2,
    y,
    tileW,
    tileH,
    `${masteredCount}/${allTopics.length}`,
    'Themen 📚',
    '#69f0ae',
    isStory ? 56 : 40,
  );

  y += tileH + (isStory ? 40 : 20);

  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = `bold ${isStory ? 22 : 18}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('Letzte 7 Tage', cx, y);
  y += isStory ? 20 : 14;
  drawStreakWeek(ctx, cx, y + (isStory ? 28 : 22) * scale, weekDays, scale);
  y += (isStory ? 56 : 46) * scale + (isStory ? 36 : 22);

  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = `bold ${isStory ? 22 : 18}px Arial, Helvetica, sans-serif`;
  ctx.fillText('Abzeichen', cx, y);
  y += isStory ? 16 : 10;
  const badgeLimit = isStory ? 6 : 4;
  y = drawBadges(ctx, cx, y + 8, badges.slice(0, badgeLimit), innerW - 80, scale)
    + (isStory ? 28 : 14);

  const barX = pad + 68;
  const barW = innerW - 136;
  const barH = isStory ? 32 : 20;
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  roundRect(ctx, barX, y, barW, barH, barH / 2);
  ctx.fill();
  if (themePct > 0) {
    const mg = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    mg.addColorStop(0, '#43a047');
    mg.addColorStop(1, '#b9f6ca');
    ctx.fillStyle = mg;
    roundRect(ctx, barX, y, Math.max(barW * themePct, 24), barH, barH / 2);
    ctx.fill();
  }
  y += barH + (isStory ? 36 : 22);

  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = `bold ${isStory ? 26 : 22}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(`${masteredCount} von ${allTopics.length} Themen gemeistert`, cx, y);
  y += isStory ? 40 : 28;

  if (mastered.length) {
    ctx.font = `${Math.round(20 * scale)}px Arial, Helvetica, sans-serif`;
    let chipX = barX;
    const chipY = y;
    for (const name of mastered) {
      const tw = ctx.measureText(name).width + 40;
      if (chipX + tw > barX + barW) break;
      ctx.fillStyle = 'rgba(105,240,174,0.25)';
      roundRect(ctx, chipX, chipY, tw, 40, 20);
      ctx.fill();
      ctx.strokeStyle = 'rgba(105,240,174,0.6)';
      ctx.lineWidth = 2;
      roundRect(ctx, chipX, chipY, tw, 40, 20);
      ctx.stroke();
      ctx.fillStyle = '#e8f5e9';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(name, chipX + 20, chipY + 20);
      chipX += tw + 12;
    }
    y += 56;
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${isStory ? 48 : 32}px Arial, Helvetica, sans-serif`;
  ctx.fillText(tagline, cx, y);
  y += isStory ? 48 : 32;

  if (streak.longestStreak > 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = `${isStory ? 26 : 20}px Arial, Helvetica, sans-serif`;
    ctx.fillText(`Bester Streak: ${streak.longestStreak} Tage 🏆`, cx, y);
  }

  const footerY = isStory ? h - pad - 48 : h - 52;
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = 'bold 30px Arial, Helvetica, sans-serif';
  ctx.fillText('lernziel-deutsch.de', cx, footerY);
  ctx.font = '24px Arial, Helvetica, sans-serif';
  ctx.fillText('#DeutschLernen · #SprachCoach', cx, footerY + 36);
}

/**
 * @param {Object} data
 * @return {HTMLCanvasElement}
 */
export function buildShareCardCanvas(data) {
  const format = data.format === SHARE_FORMAT.STORY ? SHARE_FORMAT.STORY : SHARE_FORMAT.POST;
  const w = POST_SIZE;
  const h = format === SHARE_FORMAT.STORY ? STORY_H : POST_SIZE;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  renderShareCard({ ...data, format }, ctx, w, h);
  return canvas;
}

/**
 * @param {Object} progress
 */
export function shareProgressCard(progress) {
  const format = progress.format === SHARE_FORMAT.STORY ? SHARE_FORMAT.STORY : SHARE_FORMAT.POST;
  const canvas = buildShareCardCanvas({ ...progress, format });
  const filename =
    format === SHARE_FORMAT.STORY
      ? 'mein-fortschritt-story-sprachcoach.png'
      : 'mein-fortschritt-sprachcoach.png';

  canvas.toBlob((blob) => {
    if (!blob) return;
    const file = new File([blob], filename, { type: 'image/png' });
    const masteredCount = getAllTopics().filter((t) => progress.isMastered(t.key)).length;
    const tagline = getShareTagline({
      streak: progress.streak,
      masteredCount,
      level: progress.level,
    });
    if (
      navigator.share &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [file] })
    ) {
      navigator
        .share({
          files: [file],
          title: 'Mein Deutsch-Fortschritt',
          text: `${tagline} — Der SprachCoach`,
        })
        .catch(() => {});
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }, 'image/png');
}
