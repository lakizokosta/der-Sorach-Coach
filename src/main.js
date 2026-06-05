/**
 * @fileoverview Application bootstrap.
 *
 * Mounts the root Vue application, wires up the router, and pulls in the
 * global stylesheet. Keep this file tiny so the bootstrap path stays
 * easy to reason about.
 */

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';

import './styles/main.css';

createApp(App).use(router).mount('#app');
