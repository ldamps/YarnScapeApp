// Service worker for YarnScape

var CACHE_NAME = 'yarnscape-pwa-cache';
var urlsToCache = [
    './index.html',
    './manifest.json',
    './404.html',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
    console.log('Service worker installed');

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching all the files');
            return cache.addAll(urlsToCache);
        }),
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        (async () => {
            const cachedResponse = await caches.match(event.request);

            if (cachedResponse) {
                return cachedResponse;
            }

            const response = await fetch(event.request);
            return response;
        })(),
    );
});

self.addEventListener('activate', async (event) => {
    console.log('Service worker activated');
    const keys = await caches.keys();
    await Promise.all(
        keys.map((key) => {
            if (key !== CACHE_NAME) {
                return caches.delete(key);
            }
        }),
    );
    clients.claim();
});