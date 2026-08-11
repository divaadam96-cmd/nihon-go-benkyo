const CACHE_NAME = 'nihon-go-benkyo-v1';
const ASSETS = ['index.html', 'nihon-go-benkyo.webmanifest', 'japan-paper-background.png', 'kitsune-mascot.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request))));
