/**
 * @fileoverview Vue Router configuration for Der SprachCoach.
 *
 * Named routes:
 *   - landing  (`/`)         The home screen.
 *   - trainer  (`/trainer`)  The question-flow screen. Requires `level`
 *                            query param plus optional `topic` and `mode`.
 *   - premium  (`/premium`)  Activation + topic-selection screen.
 *   - profile  (`/profile`)  Learner dashboard.
 */

import { createRouter, createWebHashHistory } from 'vue-router';

import Landing from '@/views/Landing.vue';
import Trainer from '@/views/Trainer.vue';
import Premium from '@/views/Premium.vue';
import Profile from '@/views/Profile.vue';
import Legal from '@/views/Legal.vue';
import { usePremium } from '@/composables/usePremium.js';

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
  const { isPremium, isBasis } = usePremium();
  if (to.name === 'landing' && isPremium.value) {
    return { name: 'premium' };
  }
  if (to.name === 'trainer' && !isPremium.value && !isBasis.value) {
    return { name: 'premium', query: { hub: '1' } };
  }
  return true;
});

export default router;
