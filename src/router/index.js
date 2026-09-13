/**
 * @fileoverview Vue Router configuration for Der SprachCoach.
 *
 * Named routes:
 *   - landing  (`/`)         Shared home (free + Premium training panel).
 *   - trainer  (`/trainer`)  The question-flow screen. Requires `level`
 *                            query param plus optional `topic` and `mode`.
 *   - premium  (`/premium`)  Checkout / activation (not the main home).
 *   - profile  (`/profile`)  Learner dashboard (mini for Free, full for Premium).
 */

import { createRouter, createWebHashHistory } from 'vue-router';

import Landing from '@/views/Landing.vue';
import Trainer from '@/views/Trainer.vue';
import Premium from '@/views/Premium.vue';
import Profile from '@/views/Profile.vue';
import Legal from '@/views/Legal.vue';
import { usePremium } from '@/composables/usePremium.js';
import { hasBackend } from '@/utils/api.js';
import { trainerRequiresPremium } from '@/utils/premiumAccess.js';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',         name: 'landing', component: Landing },
    { path: '/trainer',  name: 'trainer', component: Trainer },
    { path: '/premium',  name: 'premium', component: Premium },
    { path: '/profile',  name: 'profile', component: Profile },
    {
      path: '/legal/:slug(agb|datenschutz|impressum)',
      name: 'legal',
      component: Legal,
      props: true,
    },
    { path: '/:pathMatch(.*)*', redirect: { name: 'landing' } },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  const { isPremium, entitlementsReady } = usePremium();

  // Landing is the shared home for free and Premium (training panel unlocks in-place).
  // `/premium` stays for checkout / activation only (not when already Premium).
  if (to.name === 'premium' && isPremium.value && to.query.focus !== 'basis') {
    return { name: 'landing' };
  }

  if (to.name === 'trainer' && hasBackend() && entitlementsReady.value) {
    if (trainerRequiresPremium(to.query) && !isPremium.value) {
      return { name: 'premium', query: { hub: '1' } };
    }
  }

  return true;
});

export default router;
