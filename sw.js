const CACHE_NAME = 'nihon-go-benkyo-v42';
const ASSETS = ['index.html', 'styles.css?build=37', 'app.js?build=38', 'prototype-kanji-v2.html?v=12', 'prototype-kanji-v2.html?v=12&embed=1', 'prototype-kanji-v2.css?v=11', 'prototype-kanji-v2.js?v=12', 'prototype-tes-v2.html?v=5', 'prototype-tes-v2.html?v=5&embed=1', 'prototype-tes-v2.css?v=4', 'prototype-tes-v2.js?v=5', 'prototype-materi.html?v=11', 'prototype-materi.css?v=12', 'prototype-materi.js?v=11', 'prototype-sidebar-v2.html?v=7', 'prototype-sidebar-v2.css?v=6', 'prototype-sidebar-v2.js?v=7', 'prototype-sidebar-material.css?v=2', 'prototype-sidebar-memory.css?v=1', 'prototype-ui-v2.html?v=3', 'prototype-ui-v2.css?v=2', 'prototype-ui-v2.js?v=3', 'data/materi-data.js', 'data/kanji-data.js', 'data/kanji-stroke-data.js', 'data/kana-data.js', 'data/bab-data.js', 'nihon-go-benkyo.webmanifest', 'japan-paper-background.png', 'logo.png'];
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
