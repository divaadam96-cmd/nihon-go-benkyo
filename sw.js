const CACHE_NAME = 'nihon-go-benkyo-v109';
const ASSETS = ['index.html', 'css/legacy-part-1.css?build=80', 'css/legacy-part-2.css?build=80', 'css/legacy-part-3.css?build=80', 'css/legacy-part-4.css?build=80', 'app.js?build=87', 'app-sidebar.js?v=1', 'js/app-effects.js?v=5', 'js/quiz-results.js?v=2', 'js/srs.js?v=5', 'js/auth.js?v=5', 'admin.js?v=2', 'monitor.js?v=5', 'js/assignments.js?v=4', 'js/pwa.js?v=2', 'nihon-go-benkyo.webmanifest', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/icons/icon-maskable-512.png', 'pages/kanji.html?v=19', 'css/pages/kanji.css?v=13', 'js/pages/kanji.js?v=17', 'pages/latihan.html?v=20', 'css/pages/latihan.css?v=8', 'js/pages/latihan.js?v=19', 'data/materi-data.js', 'data/kanji-data.js', 'data/kanji-stroke-data.js', 'data/kana-data.js', 'data/bab-data.js', 'assets/images/japan-paper-background.png', 'assets/images/logo.png'];
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
