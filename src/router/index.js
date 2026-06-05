/**
 * @fileoverview Vue Router configuration for Der SprachCoach.
 *
 * Four named routes:
 *   - landing  (`/`)         The home screen.
 *   - trainer  (`/trainer`)  The question-flow screen. Requires `level`
 *                            query param plus optional `topic` and `mode`.
 *   - premium  (`/premium`)  Activation + topic-selection screen.
 *   - profile  (`/profile`)  Premium-only mastery dashboard.
 */

import { createRouter, createWebHashHistory } from 'vue-router';

import Landing from '@/views/Landing.vue';
import Trainer from '@/views/Trainer.vue';
import Premium from '@/views/Premium.vue';
import Profile from '@/views/Profile.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',         name: 'landing', component: Landing },
    { path: '/trainer',  name: 'trainer', component: Trainer },
    { path: '/premium',  name: 'premium', component: Premium },
    { path: '/profile',  name: 'profile', component: Profile },
    { path: '/:pathMatch(.*)*', redirect: { name: 'landing' } },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
