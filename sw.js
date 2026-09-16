const CACHE_NAME = 'nihon-go-benkyo-v116';
const ASSETS = [
  'index.html',
  'css/legacy-part-1.css?build=80', 'css/legacy-part-2.css?build=80', 'css/legacy-part-3.css?build=80', 'css/legacy-part-4.css?build=80',
  'js/app-shell.js?v=2', 'js/app-sidebar.js?v=2', 'js/app-effects.js?v=5', 'js/quiz-results.js?v=2', 'js/srs.js?v=5', 'js/auth.js?v=6', 'js/assignments.js?v=5', 'js/pwa.js?v=2',
  'js/pages/dashboard.js?v=1',
  'nihon-go-benkyo.webmanifest',
  'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/icons/icon-maskable-512.png',
  'pages/materi.html?v=1', 'js/pages/materi.js?v=2',
  'pages/hafalan.html?v=1', 'js/pages/hafalan.js?v=1',
  'pages/kanji.html?v=20', 'css/pages/kanji.css?v=14', 'js/pages/kanji.js?v=18',
  'pages/latihan.html?v=21', 'css/pages/latihan.css?v=9', 'js/pages/latihan.js?v=21',
  'pages/pantau.html?v=3', 'css/pages/pantau.css?v=2', 'js/pages/pantau.js?v=3',
  'pages/admin.html?v=1', 'js/pages/admin.js?v=1',
  'data/materi-data.js?v=2', 'data/kanji-data.js', 'data/kanji-stroke-data.js?v=2', 'data/kana-data.js', 'data/bab-data.js',
  'assets/images/japan-paper-background.png', 'assets/images/logo.png',
];
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
