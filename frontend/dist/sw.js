const CACHE_NAME = 'suvidha-kiosk-v2';
const API_CACHE_NAME = 'suvidha-api-v1';
const OFFLINE_URL = '/Suvidha-Kisok/';

const ASSETS_TO_CACHE = [
    OFFLINE_URL,
    '/Suvidha-Kisok/index.html',
];

// API paths to cache for offline viewing
const CACHEABLE_API_PATHS = [
    '/api/bills',
    '/api/complaints',
    '/api/infrastructure',
];

// Install event — cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate event — clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME && name !== API_CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch event — network first with offline fallback
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Navigation requests — network first, fallback to cached index
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(OFFLINE_URL);
            })
        );
        return;
    }

    // API requests — network first, cache response, fallback to cached
    if (CACHEABLE_API_PATHS.some(path => url.pathname.includes(path))) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(API_CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request).then((cached) => {
                        if (cached) {
                            // Notify clients that offline data is being used
                            self.clients.matchAll().then(clients => {
                                clients.forEach(client => {
                                    client.postMessage({ type: 'OFFLINE_DATA', url: event.request.url });
                                });
                            });
                            return cached;
                        }
                        return new Response(JSON.stringify({ error: 'Offline - data unavailable' }), {
                            headers: { 'Content-Type': 'application/json' },
                            status: 503,
                        });
                    });
                })
        );
        return;
    }

    // Map tiles — cache aggressively for offline maps
    if (url.hostname.includes('tile.openstreetmap.org') || url.hostname.includes('cdnjs.cloudflare.com')) {
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) return cached;
                return fetch(event.request).then((response) => {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                }).catch(() => cached);
            })
        );
        return;
    }

    // Static assets — stale-while-revalidate
    event.respondWith(
        caches.match(event.request).then((cached) => {
            const fetched = fetch(event.request).then((response) => {
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            }).catch(() => cached);
            return cached || fetched;
        })
    );
});
