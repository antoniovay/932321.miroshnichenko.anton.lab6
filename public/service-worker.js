const CACHE_NAME = 'portfolio-cache-v3';

const FILES_TO_CACHE = [
    '/',
    '/about.html',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json'
];

// Установка Service Worker и кеширование файлов
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );

    self.skipWaiting();
});

// Активация и удаление старого кеша
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            )
        )
    );

    self.clients.claim();
});

// Обработка запросов
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    
    if (new URL(event.request.url).pathname.startsWith('/api/')) {
        event.respondWith(fetch(event.request));
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then(response => {
                if (
                    response &&
                    response.status === 200 &&
                    response.type === 'basic'
                ) {
                    const responseCopy = response.clone();

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseCopy);
                    });
                }

                return response;
            }).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('/');
                }

                return new Response('Ресурс недоступен офлайн', {
                    status: 503,
                    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                });
            });
        })
    );
});
