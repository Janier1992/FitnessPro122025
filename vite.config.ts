import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Reemplaza '<REPO_NAME>' con el nombre de tu repositorio de GitHub
const repoName = 'fitness-flow-pro';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.js',
        includeAssets: ['favicon.svg', 'robots.txt'],
        injectManifest: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        },
        manifest: false, // Usamos public/manifest.json
        devOptions: {
          enabled: true,
          type: 'module',
          navigateFallback: 'index.html',
        }
      })
    ],
    base: '/FitnessPro122025/', // GitHub Pages repo name
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
    define: {
      // 'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY) // Removed deprecated
    },

    resolve: {
      // alias: { uuid: '...' } removed
    },
    optimizeDeps: {
      include: ['uuid', '@supabase/supabase-js'],
    },
  };
});