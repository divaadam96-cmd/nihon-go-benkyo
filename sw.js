// Satu-satunya angka yang perlu dinaikkan setiap kali ada file di ASSETS
// yang isinya berubah (JS/CSS/data/gambar). Tanpa ini, service worker
// akan terus menyajikan versi lama dari cache ke user yang sudah install.
const CACHE_NAME = 'nihon-go-benkyo-v128';
const ASSETS = [
  'index.html',
  'css/base.css', 'css/shell.css', 'css/auth.css',
  'js/app-shell.js', 'js/app-sidebar.js', 'js/app-effects.js', 'js/quiz-results.js', 'js/srs.js', 'js/auth.js', 'js/assignments.js', 'js/pwa.js',
  'js/pages/dashboard.js',
  'nihon-go-benkyo.webmanifest',
  'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/icons/icon-maskable-512.png',
  'css/pages/dashboard.css',
  'pages/materi.html', 'css/pages/materi.css', 'data/materi-grammar-data.js', 'js/pages/materi.js',
  'pages/hafalan.html', 'css/pages/hafalan.css', 'js/pages/hafalan.js',
  'pages/kanji.html', 'css/pages/kanji.css', 'js/pages/kanji.js',
  'pages/latihan.html', 'css/pages/latihan.css', 'js/pages/latihan.js',
  'pages/pantau.html', 'css/pages/pantau.css', 'js/pages/pantau.js',
  'pages/admin.html', 'css/pages/admin.css', 'js/pages/admin.js',
  'data/materi-data.js', 'data/kanji-data.js', 'data/kanji-stroke-data.js', 'data/kana-data.js', 'data/bab-data.js',
  'assets/images/japan-paper-background.webp', 'assets/images/logo.webp',
];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      // cache: 'reload' memaksa fetch lewat network, bukan HTTP cache browser,
      // supaya bump CACHE_NAME di atas cukup untuk membawa file terbaru.
      Promise.all(ASSETS.map(url => fetch(url, { cache: 'reload' }).then(res => cache.put(url, res))))
    )
  );
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
