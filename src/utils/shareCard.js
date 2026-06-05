/**
 * @fileoverview Generates a square shareable progress card on a Canvas and
 * triggers the Web Share API (when available) or a plain download fallback.
 *
 * The visual layout closely follows the original Blogger trainer so users
 * have a consistent share asset across both versions of the app.
 */

import { getAllTopics } from '@/data/premiumTopics.js';

/**
 * Stroke-friendly rounded rectangle path.
 *
 * @param {!CanvasRenderingContext2D} ctx
 * @param {number} x Top-left x coordinate.
 * @param {number} y Top-left y coordinate.
 * @param {number} w Width.
 * @param {number} h Height.
 * @param {number} r Corner radius.
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
 * Renders the progress card and either shares or downloads the resulting
 * PNG. Inputs are passed in explicitly to keep this util free of
 * composables / Vue state.
 *
 * @param {Object} progress
 * @param {number} progress.totalXP        Lifetime XP.
 * @param {Object} progress.level          Level descriptor (see useXp.js).
 * @param {Object} progress.streak         Streak state from useStreak.js.
 * @param {!Function} progress.isMastered  `(topicKey:string)=>boolean`.
 */
export function shareProgressCard({ totalXP, level, streak, isMastered }) {
  const allTopics = getAllTopics();
  const masteredCount = allTopics.filter((t) => isMastered(t.key)).length;
  const C = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = C;
  canvas.height = C;
  const ctx = canvas.getContext('2d');

  // Purple gradient background.
  const bg = ctx.createLinearGradient(0, 0, C, C);
  bg.addColorStop(0, '#5A1068');
  bg.addColorStop(1, '#C86DD7');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, C, C);

  // White rounded card.
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, 60, 60, 960, 960, 56);
  ctx.fill();

  // Logo circle with "LZD".
  ctx.fillStyle = '#AB4DBB';
  ctx.beginPath();
  ctx.arc(540, 210, 90, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 68px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LZD', 540, 212);

  // Level badge.
  ctx.fillStyle = level.color;
  roundRect(ctx, 350, 330, 380, 74, 37);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 34px Arial, sans-serif';
  ctx.fillText(`Lv${level.num}  ${level.name}`, 540, 367);

  // XP number.
  ctx.fillStyle = '#333';
  ctx.font = 'bold 52px Arial, sans-serif';
  ctx.fillText(`${totalXP} XP`, 540, 468);

  // XP progress bar.
  ctx.fillStyle = '#ecdff8';
  roundRect(ctx, 160, 492, 760, 22, 11);
  ctx.fill();
  const xpRange = level.next ? level.next - level.prev : 1;
  const xpFill = level.next ? Math.max(0.04, (totalXP - level.prev) / xpRange) : 1;
  const barGrad = ctx.createLinearGradient(160, 0, 920, 0);
  barGrad.addColorStop(0, level.color);
  barGrad.addColorStop(1, '#AB4DBB');
  ctx.fillStyle = barGrad;
  roundRect(ctx, 160, 492, 760 * xpFill, 22, 11);
  ctx.fill();

  ctx.strokeStyle = '#f0e6f8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(160, 552);
  ctx.lineTo(920, 552);
  ctx.stroke();

  // Streak block.
  ctx.fillStyle = streak.currentStreak > 0 ? '#e65100' : '#aaa';
  ctx.font = 'bold 58px Arial, sans-serif';
  ctx.fillText(
    `${streak.currentStreak > 0 ? streak.currentStreak + ' Tage' : 'Kein'} Streak`,
    540, 636,
  );
  ctx.font = '32px Arial, sans-serif';
  ctx.fillStyle = '#888';
  ctx.fillText(`Rekord: ${streak.longestStreak} Tage`, 540, 684);

  // Mastered topics.
  ctx.fillStyle = '#AB4DBB';
  ctx.font = 'bold 46px Arial, sans-serif';
  ctx.fillText(`${masteredCount} / ${allTopics.length} Themen gemeistert`, 540, 760);

  ctx.strokeStyle = '#f0e6f8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(160, 800);
  ctx.lineTo(920, 800);
  ctx.stroke();

  // Footer caption.
  ctx.fillStyle = '#AB4DBB';
  ctx.font = 'bold 38px Arial, sans-serif';
  ctx.fillText('Ich lerne Deutsch!', 540, 868);
  ctx.fillStyle = '#bbb';
  ctx.font = '28px Arial, sans-serif';
  ctx.fillText('lernziel-deutsch.de', 540, 916);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const file = new File([blob], 'mein-fortschritt-lzd.png', { type: 'image/png' });
    if (
      navigator.share &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [file] })
    ) {
      navigator
        .share({
          files: [file],
          title: 'Mein Deutsch-Fortschritt',
          text: 'Ich lerne Deutsch mit Der SprachCoach!',
        })
        .catch(() => {
          /* user cancelled — ignored */
        });
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mein-fortschritt-lzd.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }, 'image/png');
}
