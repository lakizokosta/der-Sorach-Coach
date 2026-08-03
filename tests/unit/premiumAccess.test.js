import { describe, it, expect } from 'vitest';
import { trainerRequiresPremium, trainerRequiresPaid } from '@/utils/premiumAccess.js';

describe('premiumAccess', () => {
  describe('trainerRequiresPremium', () => {
    it('free mode without topic/set is not premium', () => {
      expect(trainerRequiresPremium({ level: 'A1', mode: 'free' })).toBe(false);
    });

    it('vocab mode requires premium', () => {
      expect(trainerRequiresPremium({ mode: 'vocab', set: 'EINKAUFEN' })).toBe(true);
    });

    it('grammar topic requires premium', () => {
      expect(trainerRequiresPremium({ topic: 'ARTIKEL' })).toBe(true);
    });

    it('schwaechen and placement modes require premium', () => {
      expect(trainerRequiresPremium({ mode: 'schwaechen' })).toBe(true);
      expect(trainerRequiresPremium({ mode: 'placement' })).toBe(true);
    });
  });

  describe('trainerRequiresPaid', () => {
    it('free mode is not paid', () => {
      expect(trainerRequiresPaid({ mode: 'free' })).toBe(false);
    });

    it('non-free modes require paid', () => {
      expect(trainerRequiresPaid({ mode: 'premium' })).toBe(true);
    });
  });
});
