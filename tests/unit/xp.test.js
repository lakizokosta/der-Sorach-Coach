import { describe, it, expect } from 'vitest';
import { getLevel } from '@/composables/useXp.js';

describe('getLevel', () => {
  it('returns Anfänger for 0 XP', () => {
    const lvl = getLevel(0);
    expect(lvl.num).toBe(1);
    expect(lvl.name).toBe('Anfänger');
    expect(lvl.next).toBe(100);
  });

  it('returns Lernender at 100 XP', () => {
    expect(getLevel(100).num).toBe(2);
    expect(getLevel(99).num).toBe(1);
  });

  it('returns Fortgeschrittener at 500 XP', () => {
    expect(getLevel(500).num).toBe(3);
  });

  it('returns Profi at 1500 XP', () => {
    expect(getLevel(1500).num).toBe(4);
  });

  it('returns Meister at 4000+ XP with no next threshold', () => {
    const lvl = getLevel(4000);
    expect(lvl.num).toBe(5);
    expect(lvl.name).toBe('Meister');
    expect(lvl.next).toBeNull();
  });
});
