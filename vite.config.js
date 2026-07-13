import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

/** Restart dev server when question bank files are added or removed (glob is static at startup). */
function questionsGlobRefresh() {
  return {
    name: 'questions-glob-refresh',
    configureServer(server) {
      const pattern = /[/\\]src[/\\]questions[/\\].+\.md$/;
      const restart = (file) => {
        if (!pattern.test(file)) return;
        server.config.logger.info('Question bank changed — restarting dev server…', {
          timestamp: true,
        });
        server.restart();
      };
      server.watcher.on('add', restart);
      server.watcher.on('unlink', restart);
    },
  };
}

// Vite configuration for Der SprachCoach.
// Uses the official Vue plugin and exposes the `@` alias for the `src` folder.
export default defineConfig({
  plugins: [vue(), questionsGlobRefresh()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
