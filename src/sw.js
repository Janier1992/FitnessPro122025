import { cleanupOutdatedCaches, precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// --- Navigation Fallback (Fixes Refresh 404/Blue Screen) ---
const handler = createHandlerBoundToURL('index.html');
const navigationRoute = new NavigationRoute(handler, {
    allowlist: [
        // Match any path
        new RegExp('/.*'),
    ],
    denylist: [
        // Exclude API calls and files
        new RegExp('^/api/'),
        new RegExp('.*\\..*'), // Exclude paths with dots (files)
    ],
});
registerRoute(navigationRoute);

clientsClaim()


// --- Runtime Caching (Moved from vite.config.ts) ---

// Google Fonts
registerRoute(
    /^https:\/\/fonts\.googleapis\.com\/.*/i,
    new CacheFirst({
        cacheName: 'google-fonts-cache',
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
            }),
        ],
    })
);

// Supabase API
registerRoute(
    /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
    new StaleWhileRevalidate({
        cacheName: 'api-cache',
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24,
            }),
        ],
    })
);

// --- Background Sync ---
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-updates') {
        console.log('[SW] Sync event triggered');
        event.waitUntil(syncUpdates());
    }
});

async function syncUpdates() {
    console.log('[SW] Processing sync...');
    // In a real app, read from IDB and POST to Supabase
}

// --- Push Notifications ---
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'FitnessFlow Notificación';
    const options = {
        body: data.body || 'Tienes un nuevo mensaje.',
        icon: './pwa-192x192.png',
        badge: './pwa-192x192.png',
        data: data.url || '/'
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data)
    );
});
