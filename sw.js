// Naikkan CACHE_NAME setiap kali ada file di APP_FILES yang isinya berubah
// (HTML/CSS/JS/data). Tanpa ini, service worker terus menyajikan versi lama
// dari cache ke user yang sudah install. Saat versi naik, file yang TIDAK
// berubah tidak diunduh ulang penuh: install memakai cache: 'no-cache'
// (revalidasi ETag -> cukup 304 kalau isinya sama).
const CACHE_NAME = 'nihon-go-benkyo-v234';
// Gambar soal, ilustrasi materi & aset CDN (URL berversi) di-cache saat
// pertama kali dipakai - tidak ikut di-precache dan tidak dihapus saat
// CACHE_NAME naik, karena isinya praktis tidak pernah berubah.
const RUNTIME_CACHE = 'nihon-go-benkyo-runtime-v1';
const APP_FILES = [
  'index.html',
  'css/base.css', 'css/shell.css', 'css/auth.css', 'css/shell-akhir.css',
  'js/app-shell.js', 'js/app-sidebar.js', 'js/app-effects.js', 'js/soal-html.js', 'js/quiz-results.js', 'js/srs.js', 'js/sesi-idle.js', 'js/auth.js', 'js/assignments.js', 'js/pwa.js',
  'js/pages/dashboard.js', 'css/pages/dashboard.css',
  'nihon-go-benkyo.webmanifest',
  'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/icons/icon-maskable-512.png',
  'assets/images/japan-paper-background.webp', 'assets/images/logo.webp',
  'assets/fonts/dm-sans-latin-v17.woff2', 'assets/fonts/dm-sans-latin-ext-v17.woff2',
  'pages/materi.html', 'css/pages/materi.css', 'data/materi-grammar-data.js', 'js/pages/materi.js',
  'pages/hafalan.html', 'css/pages/hafalan.css', 'css/pages/hafalan-kana.css', 'js/pages/hafalan.js', 'data/kana-data.js', 'data/bab-data.js',
  'pages/kanji.html', 'css/pages/kanji.css', 'js/pages/kanji.js', 'data/kanji-data.js', 'data/kanji-stroke-data.js',
  'pages/latihan.html', 'css/pages/latihan.css', 'js/pages/latihan.js',
  'pages/pantau.html', 'css/pages/pantau.css', 'js/pages/pantau.js',
  'pages/admin.html', 'css/pages/admin.css', 'js/pages/admin.js',
  'pages/kelola-soal.html', 'css/pages/kelola-soal.css', 'js/pages/kelola-soal.js',
];
// Aset CDN yang di-cache saat dipakai (supabase-js berversi, font Google).
const CDN_HOSTS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(APP_FILES.map(url =>
        fetch(url, { cache: 'no-cache' }).then(res => {
          if (!res.ok) throw new Error(`${url}: ${res.status}`);
          return cache.put(url, res);
        })
      ))
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names
        .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
        .map(name => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

function cacheFirst(request, cacheName) {
  return caches.match(request).then(hit => hit || fetch(request).then(response => {
    // Respons parsial (206), opaque & error tidak disimpan.
    if (response.status === 200) {
      const copy = response.clone();
      caches.open(cacheName).then(cache => cache.put(request, copy));
    }
    return response;
  }));
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Halaman: selalu coba network dulu (konten terbaru), cache cuma cadangan offline.
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    // Rekaman mendengarkan (puluhan MB, diputar dengan Range request)
    // langsung dari network.
    if (url.pathname.startsWith('/assets/audio/')) return;
    if (url.pathname.startsWith('/assets/images/')) {
      event.respondWith(cacheFirst(request, RUNTIME_CACHE));
      return;
    }
    event.respondWith(caches.match(request).then(hit => hit || fetch(request)));
    return;
  }

  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(request, RUNTIME_CACHE));
  }
  // Selain itu (Supabase API, KanjiVG, dst.) tidak disentuh service worker.
});
