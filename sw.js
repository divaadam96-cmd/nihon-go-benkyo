const CACHE_NAME = 'nihon-go-benkyo-v87';
const ASSETS = ['index.html', 'styles.css?build=75', 'app.js?build=70', 'app-sidebar.js?v=1', 'app-effects.js?v=3', 'quiz-results.js?v=1', 'srs.js?v=3', 'auth.js?v=2', 'admin.js?v=2', 'monitor.js?v=3', 'assignments.js?v=1', 'pwa.js?v=1', 'nihon-go-benkyo.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'prototype-kanji-v2.html?v=18', 'prototype-kanji-v2.html?v=18&embed=1', 'prototype-kanji-v2.css?v=12', 'prototype-kanji-v2.js?v=16', 'prototype-tes-v2.html?v=8', 'prototype-tes-v2.html?v=8&embed=1', 'prototype-tes-v2.css?v=4', 'prototype-tes-v2.js?v=6', 'data/materi-data.js', 'data/kanji-data.js', 'data/kanji-stroke-data.js', 'data/kana-data.js', 'data/bab-data.js', 'japan-paper-background.png', 'logo.png'];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  const isPage = event.request.mode === 'navigate' || event.request.destination === 'document';
  if (isPage) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request)));
});
