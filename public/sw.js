/**
 * Service Worker for Offline Caching
 * 
 * Caches API responses and static assets for offline access
 * 
 * Layer: Infrastructure Layer
 */

const CACHE_NAME = 'toy-marketplace-v1';
const API_CACHE_NAME = 'api-cache-v1';
const STATIC_CACHE_NAME = 'static-cache-v1';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting(); // Activate immediately
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (
                        cacheName !== CACHE_NAME &&
                        cacheName !== API_CACHE_NAME &&
                        cacheName !== STATIC_CACHE_NAME
                    ) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim(); // Take control of all pages
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Handle API requests
    if (url.pathname.startsWith('/api/') || url.pathname.includes('/toys') || url.pathname.includes('/shops')) {
        event.respondWith(
            caches.open(API_CACHE_NAME).then((cache) => {
                return fetch(request)
                    .then((response) => {
                        // Cache successful GET responses
                        if (request.method === 'GET' && response.status === 200) {
                            cache.put(request, response.clone());
                        }
                        return response;
                    })
                    .catch(() => {
                        // Return cached response if network fails
                        return cache.match(request).then((cachedResponse) => {
                            if (cachedResponse) {
                                return cachedResponse;
                            }
                            // Return offline fallback
                            return new Response(
                                JSON.stringify({ 
                                    error: 'Offline', 
                                    message: 'You are currently offline. Please check your connection.' 
                                }),
                                {
                                    status: 503,
                                    headers: { 'Content-Type': 'application/json' }
                                }
                            );
                        });
                    });
            })
        );
        return;
    }

    // Handle static assets
    if (request.method === 'GET' && (
        url.pathname.endsWith('.js') ||
        url.pathname.endsWith('.css') ||
        url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.jpg') ||
        url.pathname.endsWith('.svg') ||
        url.pathname.endsWith('.woff') ||
        url.pathname.endsWith('.woff2')
    )) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                return cachedResponse || fetch(request).then((response) => {
                    // Cache the response
                    if (response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(STATIC_CACHE_NAME).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return response;
                });
            })
        );
        return;
    }

    // Default: network first, cache fallback
    event.respondWith(
        fetch(request)
            .then((response) => {
                // Cache successful responses
                if (response.status === 200 && request.method === 'GET') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // Return from cache if available
                return caches.match(request).then((cachedResponse) => {
                    return cachedResponse || new Response('Offline', { status: 503 });
                });
            })
    );
});

// Message event - handle cache invalidation
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(API_CACHE_NAME).then(() => {
            event.ports[0].postMessage({ success: true });
        });
    }
});

