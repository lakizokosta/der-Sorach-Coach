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
import { i18nPlugin } from './i18n/index.js';

import './styles/main.css';

const app = createApp(App);

app.config.errorHandler = (err, _instance, info) => {
  console.error('[SprachCoach]', err, info);
  const root = document.getElementById('app');
  if (root && !root.querySelector('.boot-error')) {
    root.innerHTML = `<div class="boot-error" style="max-width:520px;margin:40px auto;padding:20px;text-align:left;background:#fff3f3;border:2px solid #ed4545;border-radius:12px;font-family:Arial,sans-serif;">
      <h2 style="margin:0 0 12px;color:#c62828;">App-Fehler</h2>
      <pre style="white-space:pre-wrap;word-break:break-word;font-size:13px;color:#333;">${err?.message || err}</pre>
      <p style="font-size:12px;color:#666;margin:12px 0 0;">Öffne die Seite in Safari/Chrome: <strong>http://localhost:5173/#/</strong></p>
    </div>`;
  }
};

app.use(router).use(i18nPlugin).mount('#app');
