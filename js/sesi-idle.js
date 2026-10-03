/* Logout otomatis setelah 1 jam tidak aktif (semua peran).
   Waktu aktivitas terakhir disimpan di localStorage, jadi BERSAMA untuk
   semua tab: aktif di satu tab = aktif di semua tab. Setiap 15 detik (dan
   saat tab kembali terlihat - mis. laptop bangun dari tidur):
     * >= 55 menit tidak aktif -> peringatan dengan hitung mundur + tombol
       "Tetap masuk";
     * >= 60 menit -> logout (lewat fungsi yang diberikan auth.js).
   auth.js juga memakai isExpired() saat halaman DIBUKA, supaya sesi yang
   ditinggal (browser ditutup, laptop tidur) diakhiri sebelum isi aplikasi
   tampil.
   Halaman lain bisa mendaftarkan:
     * keepAlive(fn): selama fn() true dianggap aktif (mis. tes berjalan);
     * beforeLogout(fn): dijalankan sebelum logout, maks. 8 detik (mis.
       simpan draft editor).
   Dimuat SEBELUM auth.js di setiap halaman. */
(function () {
  const IDLE_LIMIT_MS = 60 * 60 * 1000;
  const WARN_BEFORE_MS = 5 * 60 * 1000;
  const CHECK_EVERY_MS = 15 * 1000;
  const WRITE_THROTTLE_MS = 15 * 1000;
  const LAST_ACTIVE_KEY = "nihonBenkyoLastActive";
  const ACTIVITY_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart", "scroll", "mousemove"];

  const keepAliveChecks = [];
  const beforeLogoutHooks = [];
  let started = false;
  let loggingOut = false;
  let logoutFn = null;
  let timerId = null;
  let countdownId = null;
  let lastWrite = 0;
  let dialogEl = null;

  function readLastActive() {
    try {
      return Number(localStorage.getItem(LAST_ACTIVE_KEY)) || 0;
    } catch {
      return 0;
    }
  }
  function touch(force) {
    const now = Date.now();
    if (!force && now - lastWrite < WRITE_THROTTLE_MS) return;
    lastWrite = now;
    try {
      localStorage.setItem(LAST_ACTIVE_KEY, String(now));
    } catch {
      // Penyimpanan tidak tersedia - pemeriksaan tetap jalan per tab.
    }
  }
  /* true kalau sesi di browser ini sudah ditinggal > 1 jam. Tanpa catatan
     (mis. login pertama setelah fitur ini rilis) dianggap belum kedaluwarsa. */
  function isExpired() {
    const last = readLastActive();
    return last > 0 && Date.now() - last > IDLE_LIMIT_MS;
  }
  function idleFor() {
    const last = readLastActive();
    return last > 0 ? Date.now() - last : 0;
  }

  function buildDialog() {
    if (dialogEl) return dialogEl;
    dialogEl = document.createElement("div");
    dialogEl.className = "idle-backdrop";
    dialogEl.hidden = true;
    dialogEl.innerHTML =
      '<div class="idle-dialog" role="alertdialog" aria-modal="true" aria-labelledby="idleTitle" aria-describedby="idleText">' +
      '<h2 id="idleTitle">Masih di sana?</h2>' +
      '<p id="idleText">Anda akan keluar otomatis dalam <b id="idleCountdown">5:00</b> karena tidak aktif. Perubahan yang belum disimpan di editor soal akan disimpan sebagai draft.</p>' +
      '<div class="idle-actions"><button type="button" class="primary" id="idleStay">Tetap masuk</button>' +
      '<button type="button" class="secondary" id="idleLeave">Keluar sekarang</button></div></div>';
    document.body.appendChild(dialogEl);
    dialogEl.querySelector("#idleStay").addEventListener("click", () => {
      touch(true);
      hideWarning();
    });
    dialogEl.querySelector("#idleLeave").addEventListener("click", () => logout());
    return dialogEl;
  }
  function showWarning() {
    const el = buildDialog();
    if (el.hidden) {
      el.hidden = false;
      el.querySelector("#idleStay").focus();
    }
    const paint = () => {
      const left = Math.max(0, IDLE_LIMIT_MS - idleFor());
      const m = Math.floor(left / 60000);
      const s = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");
      el.querySelector("#idleCountdown").textContent = `${m}:${s}`;
    };
    paint();
    clearInterval(countdownId);
    countdownId = setInterval(() => {
      paint();
      check();
    }, 1000);
  }
  function hideWarning() {
    clearInterval(countdownId);
    countdownId = null;
    if (dialogEl) dialogEl.hidden = true;
  }

  async function logout() {
    if (loggingOut) return;
    loggingOut = true;
    clearInterval(timerId);
    clearInterval(countdownId);
    for (const hook of beforeLogoutHooks) {
      try {
        await Promise.race([Promise.resolve().then(hook), new Promise((resolve) => setTimeout(resolve, 8000))]);
      } catch {
        // Hook gagal (mis. offline) - logout tetap dijalankan.
      }
    }
    if (typeof logoutFn === "function") await logoutFn();
  }

  function check() {
    if (!started || loggingOut) return;
    if (keepAliveChecks.some((fn) => {
      try {
        return fn();
      } catch {
        return false;
      }
    })) {
      touch(true); // dipanggil tiap 15 detik, jadi tidak perlu dibatasi
    }
    const idle = idleFor();
    if (idle >= IDLE_LIMIT_MS) {
      logout();
    } else if (idle >= IDLE_LIMIT_MS - WARN_BEFORE_MS) {
      showWarning();
    } else if (dialogEl && !dialogEl.hidden) {
      hideWarning(); // aktif lagi (di tab ini atau tab lain)
    }
  }

  function onActivity() {
    if (!started || loggingOut) return;
    // Selama peringatan tampil, hanya tombol "Tetap masuk" yang memperpanjang
    // sesi - gerakan mouse tak sengaja tidak menutup peringatan.
    if (dialogEl && !dialogEl.hidden) return;
    touch(false);
  }

  /* Dipanggil auth.js setelah aplikasi terbuka (login berhasil). */
  function start(options) {
    logoutFn = options && options.logout;
    if (started) return;
    started = true;
    touch(true);
    ACTIVITY_EVENTS.forEach((type) => window.addEventListener(type, onActivity, { passive: true, capture: true }));
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") check();
    });
    timerId = setInterval(check, CHECK_EVERY_MS);
  }

  window.IdleSession = {
    start,
    isExpired,
    touch: () => touch(true),
    checkNow: check,
    keepAlive(fn) {
      keepAliveChecks.push(fn);
    },
    beforeLogout(fn) {
      beforeLogoutHooks.push(fn);
    },
    LIMIT_MINUTES: IDLE_LIMIT_MS / 60000,
  };
})();
