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
        includeAssets: ['favicon.svg', 'robots.txt'],
        manifest: {
          name: 'FitnessFlow Pro',
          short_name: 'FitnessFlow',
          description: 'Tu entrenador personal y gestión de gimnasios con IA.',
          theme_color: '#00E0C6',
          background_color: '#0f172a',
          display: 'standalone',
          orientation: 'portrait',
          id: '/',
          start_url: './',
          categories: ['fitness', 'health', 'lifestyle'],
          lang: 'es',
          shortcuts: [
            {
              name: 'Mis Rutinas',
              short_name: 'Rutinas',
              description: 'Ver mis rutinas de entrenamiento',
              url: '/rutinas',
              icons: [{ src: 'favicon.svg', sizes: '192x192' }]
            },
            {
              name: 'Dashboard',
              short_name: 'Inicio',
              description: 'Ir al panel principal',
              url: '/',
              icons: [{ src: 'favicon.svg', sizes: '192x192' }]
            }
          ],
          icons: [
            {
              src: 'favicon.svg',
              sizes: '192x192 512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              // Cache Supabase API requests
              urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 // 24 hours
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
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