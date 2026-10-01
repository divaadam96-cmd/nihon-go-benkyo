/* Pendaftaran service worker + tombol "Install aplikasi". Sengaja TIDAK
   dibungkus initApp() - harus jalan dari layar login juga (sebelum
   login), bukan cuma setelah masuk, supaya app bisa di-install dan tetap
   di-cache walau pengunjung belum login. */

// Didaftarkan setelah event load: instalasi service worker langsung
// men-precache seluruh ASSETS di sw.js (>1 MB) - kalau mulai lebih awal,
// unduhan itu berebut bandwidth dengan CSS/font/script halaman ini sendiri
// pada kunjungan pertama.
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });

  // sw.js menyajikan CSS/JS cache-first, jadi kunjungan pertama setelah
  // deploy masih memakai file lama sementara versi baru terpasang di
  // belakang layar (skipWaiting + clients.claim). Begitu versi baru
  // mengambil alih, muat ulang sekali supaya file terbaru langsung
  // dipakai - hanya di awal buka halaman, supaya siswa yang sedang
  // mengerjakan tes tidak kehilangan jawabannya.
  const hadController = !!navigator.serviceWorker.controller;
  const pageOpenedAt = Date.now();
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (hadController && Date.now() - pageOpenedAt < 15000) location.reload();
  });
}

let deferredInstallPrompt = null;

function installButtons() {
  return document.querySelectorAll(".install-app-btn");
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButtons().forEach((btn) => (btn.hidden = false));
});

document.addEventListener("click", async (event) => {
  const button = event.target.closest(".install-app-btn");
  if (!button || !deferredInstallPrompt) return;
  button.hidden = true;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
});

window.addEventListener("appinstalled", () => {
  installButtons().forEach((btn) => (btn.hidden = true));
  deferredInstallPrompt = null;
});

/* Safari iOS tidak mendukung beforeinstallprompt - tampilkan petunjuk
   manual sebagai gantinya kalau bukan sedang berjalan sebagai app yang
   sudah ter-install. */
function isIosDevice() {
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
}
function isStandaloneDisplay() {
  return (
    ("standalone" in window.navigator && window.navigator.standalone) ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}
if (isIosDevice() && !isStandaloneDisplay()) {
  document.querySelectorAll(".ios-install-hint").forEach((hint) => (hint.hidden = false));
}
