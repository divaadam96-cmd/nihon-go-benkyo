/* Shell bersama untuk SEMUA halaman (index.html, pages/*.html): login-screen,
   header, sidebar, dan mobile-nav. Dijalankan PALING AWAL (sebelum auth.js)
   supaya elemen #loginScreen/#accountName/dll sudah ada di DOM saat auth.js
   membaca/menulisnya. Setiap halaman hanya perlu punya:
     <body>
       <main class="main" id="pageMain"> ...konten halaman ini saja... </main>
       <script src="(path)/js/app-shell.js"></script>
       <script src="(path)/js/app-sidebar.js"></script>
       ...script lain...
       <script src="(path)/js/auth.js"></script>
     </body>
   app-shell.js akan membungkus #pageMain dengan login-screen + .app (header +
   .layout + sidebar), lalu memanggil initSidebarNav() (app-sidebar.js) untuk
   memasang interaksi sidebar (toggle/drawer/tooltip). Fungsi initPage() milik
   tiap halaman (didefinisikan oleh app.js/js/pages/*.js) dipanggil oleh
   auth.js SETELAH login sukses, sama seperti initApp() sebelumnya.

   Menggantikan: markup statis header/sidebar/login yang dulu ada di setiap
   file HTML, sebagian besar app.js (open/openHashView/mobile-nav/sakura/nav-
   indicator), dan bagian app-sidebar.js yang dulu merapikan/menambah tombol
   (topnav/sidebar sekarang sudah lengkap dari awal lewat template di sini). */
(function () {
  const IS_SUBPAGE = /\/pages\//.test(location.pathname);
  const ROOT = IS_SUBPAGE ? "../" : "";
  window.ROOT_PATH = ROOT;

  const pageMain = document.getElementById("pageMain");
  if (!pageMain) return;

  const shellHtml = `
<div class="login-screen" id="loginScreen"><form class="login-card" id="loginForm"><img class="mark" src="${ROOT}assets/images/logo.png" alt="Logo Nihon GO Benkyo"><h1>Nihon GO Benkyo</h1><p>Masuk untuk melanjutkan belajar. Akun Sensei &amp; Siswa dibuat oleh Operator.</p><label>Email / ID<input type="text" id="loginEmail" autocomplete="username" required></label><label>Password<input type="password" id="loginPassword" autocomplete="current-password" required></label><p class="login-error" id="loginError" hidden></p><button type="submit" class="primary" id="loginSubmit">Masuk</button><button type="button" class="link-btn" id="forgotPasswordLink">Lupa password?</button><button type="button" class="install-app-btn" hidden>Install aplikasi</button><p class="ios-install-hint" hidden>Di iPhone/iPad: buka menu Bagikan (Share) lalu pilih "Tambah ke Layar Utama".</p></form><form class="login-card" id="forgotForm" hidden><img class="mark" src="${ROOT}assets/images/logo.png" alt="Logo Nihon GO Benkyo"><h1>Lupa password</h1><p>Masukkan email akun Anda (hanya berlaku untuk akun yang login pakai email asli, mis. akun Operator). Link reset akan dikirim ke email tersebut.</p><label>Email<input type="email" id="forgotEmail" autocomplete="username" required></label><p class="login-error" id="forgotError" hidden></p><p class="form-success" id="forgotSuccess" hidden></p><button type="submit" class="primary" id="forgotSubmit">Kirim link reset</button><button type="button" class="link-btn" id="backToLoginLink">← Kembali ke login</button></form><form class="login-card" id="resetPasswordForm" hidden><img class="mark" src="${ROOT}assets/images/logo.png" alt="Logo Nihon GO Benkyo"><h1>Buat password baru</h1><p>Masukkan password baru untuk akun Anda.</p><label>Password baru<input type="password" id="newPassword" autocomplete="new-password" required minlength="6"></label><label>Ulangi password baru<input type="password" id="newPasswordConfirm" autocomplete="new-password" required minlength="6"></label><p class="login-error" id="resetError" hidden></p><button type="submit" class="primary" id="resetSubmit">Simpan password baru</button></form></div>
<div class="app">
  <header class="top"><button type="button" id="sidebarToggleMobile" class="sidebar-toggle sidebar-toggle-mobile" aria-label="Buka menu" title="Buka menu"><span></span><span></span><span></span></button><div class="brand"><img class="mark" src="${ROOT}assets/images/logo.png" alt="Logo Nihon GO Benkyo"><span>Nihon GO Benkyo<small>日本語勉強</small></span></div><nav class="topnav"><button data-view="dashboard">Beranda</button><button data-view="materials">Materi</button><button data-view="kanji-study">Kanji</button><button data-view="memorization">Hafalan</button><button data-view="test">Tes kemampuan</button><button data-view="monitor" data-role-only="sensei,operator" hidden>Pantau Siswa</button><button data-view="admin" data-role-only="operator" hidden>Admin</button></nav><div class="identity">XP Anda <b id="xp">0</b></div><div class="account-box"><span id="accountName"></span><small id="accountRole"></small><button type="button" class="install-app-btn" hidden>Install</button><button type="button" id="logoutButton">Keluar</button></div></header>
  <div class="layout"><div class="sidebar-backdrop" id="sidebarBackdrop"></div><aside class="side"><div class="side-toggle-row"><button type="button" id="sidebarToggleDesktop" class="sidebar-toggle sidebar-toggle-desktop" aria-label="Sembunyikan sidebar" title="Sembunyikan sidebar"><span></span><span></span><span></span></button></div><div class="active-indicator" id="sidebarActiveIndicator" aria-hidden="true"></div><div class="menu-label">Belajar</div><button data-view="dashboard"><span class="jp">⌂</span><span class="menu-label-text">Ringkasan</span></button><button data-view="materials"><span class="jp">文</span><span class="menu-label-text">Materi pelajaran</span></button><button data-view="kanji-study"><span class="jp">漢</span><span class="menu-label-text">Belajar kanji</span></button><button data-view="memorization"><span class="jp">語</span><span class="menu-label-text">Hafalan</span></button><button data-view="test"><span class="jp">試</span><span class="menu-label-text">Tes kemampuan</span></button><div class="study-note"><b>Rencana hari ini</b><span id="taskStatus">0 dari 4 aktivitas selesai</span><br>Mulai dari satu target kecil agar belajar tetap konsisten.</div><div class="menu-label" data-role-only="sensei,operator" hidden>Kelola</div><button data-view="monitor" data-role-only="sensei,operator" hidden><span class="jp">監</span><span class="menu-label-text">Pantau Siswa</span></button><button data-view="admin" data-role-only="operator" hidden><span class="jp">管</span><span class="menu-label-text">Panel Admin</span></button></aside><div class="sidebar-tooltip" id="sidebarTooltip" role="tooltip"></div>
  </div>
</div>`;

  const wrap = document.createElement("div");
  wrap.innerHTML = shellHtml;
  const loginScreenEl = wrap.querySelector(".login-screen");
  const appEl = wrap.querySelector(".app");
  const layoutEl = appEl.querySelector(".layout");

  document.body.insertBefore(loginScreenEl, document.body.firstChild);
  document.body.insertBefore(appEl, pageMain);
  layoutEl.appendChild(pageMain);

  document.querySelectorAll(".side button[data-view]").forEach((button) => {
    const labelEl = button.querySelector(".menu-label-text");
    const label = labelEl ? labelEl.textContent.trim() : "";
    if (label) button.title = label;
  });

  /* Peta view -> halaman asli. Materi/Hafalan/Kanji/Tes sudah jadi halaman
     sungguhan (bukan <section> SPA lagi) - lihat Fase 2/3 restrukturisasi. */
  const PAGE_FOR_VIEW = {
    materials: "pages/materi.html",
    memorization: "pages/hafalan.html",
    "kanji-study": "pages/kanji.html",
    test: "pages/latihan.html",
  };

  function updateSidebarActiveIndicator() {
    const sideEl = document.querySelector(".side");
    const indicatorEl = document.getElementById("sidebarActiveIndicator");
    if (!sideEl || !indicatorEl) return;
    const activeButton = sideEl.querySelector("button[data-view].active");
    if (!activeButton) {
      indicatorEl.style.opacity = "0";
      return;
    }
    indicatorEl.style.opacity = "1";
    indicatorEl.style.transform = `translateY(${activeButton.offsetTop}px)`;
    indicatorEl.style.height = `${activeButton.offsetHeight}px`;
  }
  window.updateSidebarActiveIndicator = updateSidebarActiveIndicator;

  const topnavIndicator = document.createElement("span");
  topnavIndicator.className = "nav-indicator";
  const topnavEl = document.querySelector(".topnav");
  if (topnavEl) topnavEl.appendChild(topnavIndicator);
  function moveTopnavIndicator() {
    const active = topnavEl && topnavEl.querySelector("button.active");
    if (!active) return;
    topnavIndicator.style.left = active.offsetLeft + "px";
    topnavIndicator.style.width = active.offsetWidth + "px";
  }

  /* Satu-satunya tempat yang tahu "view apa hidup di halaman mana". Dipakai
     sidebar/topnav/mobile-nav, hash lama (#materials dkk di webmanifest atau
     bookmark lama), dan tombol "Kerjakan tes" (assignments.js). */
  function open(view) {
    const targetPage = PAGE_FOR_VIEW[view];
    if (targetPage) {
      location.href = ROOT + targetPage;
      return;
    }
    const viewEl = document.getElementById(view);
    if (!viewEl) {
      // view ini (dashboard/monitor/admin) tidak ada di halaman ini - pindah
      // ke index.html dengan hash yang sama, biar diproses di sana.
      location.href = `${ROOT}index.html#${view}`;
      return;
    }
    document
      .querySelectorAll(".view")
      .forEach((v) => v.classList.toggle("active", v.id === view));
    document
      .querySelectorAll("[data-view]")
      .forEach((b) => b.classList.toggle("active", b.dataset.view === view));
    document
      .querySelectorAll("[data-mobile-view]")
      .forEach((b) => b.classList.toggle("active", b.dataset.mobileView === view));
    window.scrollTo({ top: 0, behavior: "smooth" });
    updateSidebarActiveIndicator();
    requestAnimationFrame(moveTopnavIndicator);
    if (view === "dashboard" && typeof window.renderDashboardActivity === "function")
      window.renderDashboardActivity();
    if (view === "admin" && typeof window.loadAdminPanel === "function")
      window.loadAdminPanel();
    if (view === "monitor" && typeof window.loadMonitorPanel === "function")
      window.loadMonitorPanel();
  }
  window.open = open;

  function openHashView() {
    const view = location.hash.slice(1);
    if (view && document.getElementById(view)) open(view);
  }
  window.addEventListener("hashchange", openHashView);

  document
    .querySelectorAll("[data-view]")
    .forEach((button) => {
      button.onclick = () => {
        const icon = button.querySelector(".jp");
        if (icon) {
          icon.classList.remove("pressing");
          void icon.offsetWidth;
          icon.classList.add("pressing");
        }
        open(button.dataset.view);
      };
    });
  document
    .querySelectorAll("[data-open]")
    .forEach((b) => (b.onclick = () => open(b.dataset.open)));

  /* XP di header + ringkasan "Rencana hari ini" di sidebar - satu-satunya
     bagian dari status belajar yang tampil di SEMUA halaman (bukan cuma
     dashboard). Dashboard punya ringkasan yang lebih detail sendiri
     (lihat paintProgressUI di js/pages/dashboard.js) yang memanggil ini
     juga supaya tidak dobel logika. */
  function format(n) {
    return n.toLocaleString("id-ID");
  }
  function totalXp() {
    const quizXp = typeof window.quizXpTotal === "function" ? window.quizXpTotal() : 0;
    return srsTotalActivityCount() * 5 + quizXp;
  }
  window.totalXp = totalXp;
  function refreshShellXp() {
    const xpEl = document.getElementById("xp");
    if (xpEl) xpEl.textContent = format(totalXp());
    const taskStatusEl = document.getElementById("taskStatus");
    if (taskStatusEl) {
      const done = [
        srsAnyReviewedToday("hafalan:"),
        srsAnyReviewedToday("materi:"),
        srsAnyReviewedToday("kanji:"),
        typeof window.quizDoneToday === "function" && window.quizDoneToday(),
      ].filter(Boolean).length;
      taskStatusEl.textContent = `${done} dari 4 aktivitas selesai`;
    }
  }
  window.refreshShellXp = refreshShellXp;

  /* Mobile nav (bar bawah, cuma tampil <=700px) - sama untuk semua halaman. */
  const mobileNav = document.createElement("nav");
  mobileNav.className = "mobile-nav";
  mobileNav.innerHTML =
    '<button data-mobile-view="dashboard"><span>⌂</span>Beranda</button><button data-mobile-view="materials"><span>文</span>Materi</button><button data-mobile-view="memorization"><span>語</span>Hafalan</button><button data-mobile-view="kanji-study"><span>漢</span>Kanji</button><button data-mobile-view="test"><span>試</span>Latihan</button>';
  document.body.appendChild(mobileNav);
  mobileNav.querySelectorAll("button").forEach(
    (button) => (button.onclick = () => open(button.dataset.mobileView)),
  );

  const shellStyle = document.createElement("style");
  shellStyle.textContent = `
      .mobile-nav{display:none}
      @media(max-width:700px){.top{height:58px;padding:0 18px;gap:10px;position:sticky;top:0;z-index:30}.brand{font-size:16px;min-width:0}.brand span{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.brand small,.topnav,.identity{display:none}.account-box{margin-left:0;padding-left:0;border-left:0;gap:6px}.account-box span{max-width:88px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.account-box small,.account-box .install-app-btn{display:none}.layout{display:block}.main{padding:20px 15px 92px;background-attachment:scroll}.head h1{font-size:25px}.overview{grid-template-columns:1fr 1fr;gap:10px}.overview .metric:first-child{grid-column:span 2}.metric b{font-size:23px}.card{padding:16px}.dashboard-grid,.flash-layout,.kana-grid,.memory-routes,.course-nav,.exam-grid{grid-template-columns:1fr}.mobile-nav{position:fixed;z-index:50;left:10px;right:10px;bottom:10px;height:64px;display:grid;grid-template-columns:repeat(5,1fr);align-items:center;background:#142945f5;border:1px solid #caa45d55;border-radius:17px;box-shadow:0 12px 28px #0b162b55;padding:4px}.mobile-nav button{border:0;background:transparent;color:#cbd4df;font:600 10px "DM Sans";display:grid;gap:3px;place-items:center;padding:6px 1px}.mobile-nav button span{font:700 18px "Zen Kaku Gothic New"}.mobile-nav button.active{color:#f7dfad}.flashcard{height:270px}.face .kana{font-size:58px}}
      @media (prefers-reduced-motion: no-preference){
        .sakura-layer{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:1}
        .sakura-layer .petal{position:absolute;top:-40px;line-height:1;opacity:0;animation:sakura-fall linear infinite;will-change:transform,opacity}
        @keyframes sakura-fall{0%{transform:translate(0,0) rotate(0deg);opacity:0}8%{opacity:.28}92%{opacity:.22}100%{transform:translate(var(--drift,40px),112vh) rotate(340deg);opacity:0}}
        .topnav{position:relative}
        .topnav button.active{border-bottom:2px solid transparent}
        .nav-indicator{position:absolute;bottom:0;height:2px;background:var(--gold);border-radius:2px;left:0;width:0;transition:left .32s cubic-bezier(.22,.75,.25,1),width .32s cubic-bezier(.22,.75,.25,1)}
        .kanji-tile-grid .kanji-tile,.kana-table .kana-cell{opacity:0;transform:translateY(8px);animation:stagger-in .38s ease forwards}
        ${Array.from({ length: 24 }, (_, i) => `.kanji-tile-grid .kanji-tile:nth-child(${i + 1}){animation-delay:${i * 28}ms}`).join("")}
        .kanji-tile-grid .kanji-tile:nth-child(n+25){animation-delay:672ms}
        ${Array.from({ length: 5 }, (_, i) => `.kana-table .kana-cell:nth-child(${i + 1}){animation-delay:${i * 45}ms}`).join("")}
        @keyframes stagger-in{to{opacity:1;transform:none}}
      }
    `;
  document.head.appendChild(shellStyle);

  if (typeof window.initSakuraPetals === "function") window.initSakuraPetals();

  if (typeof window.initSidebarNav === "function")
    window.initSidebarNav(open, updateSidebarActiveIndicator);

  window.addEventListener("resize", moveTopnavIndicator);
  window.addEventListener("resize", updateSidebarActiveIndicator);
  if (document.fonts && document.fonts.ready)
    document.fonts.ready.then(moveTopnavIndicator).catch(() => {});

  // Halaman default: kalau tidak ada hash, tandai "dashboard"/view utama
  // halaman ini sebagai aktif di sidebar/topnav/mobile-nav.
  const CURRENT_PAGE_VIEW =
    { "materi.html": "materials", "hafalan.html": "memorization", "kanji.html": "kanji-study", "latihan.html": "test" }[
      location.pathname.split("/").pop()
    ] || "dashboard";
  document
    .querySelectorAll(`[data-view="${CURRENT_PAGE_VIEW}"], [data-mobile-view="${CURRENT_PAGE_VIEW}"]`)
    .forEach((b) => b.classList.add("active"));

  /* PENTING: mengukur posisi/tinggi tombol aktif (updateSidebarActiveIndicator,
     moveTopnavIndicator) dan openHashView() (yang bisa memicu open(), yang
     JUGA mengukur posisi) TIDAK BOLEH dijalankan di sini - IIFE ini jalan
     sebelum login (saat body belum ".authed", .app masih display:none),
     jadi setiap pengukuran offsetTop/offsetHeight saat itu akan bernilai 0
     dan pil indikator jadi tidak terlihat (teks aktif jadi gelap-di-atas-
     gelap). Sama seperti openHashView()/initApp() dulu HANYA dipanggil
     SETELAH login lewat revealApp() (auth.js) - fungsi ini diekspos supaya
     auth.js bisa memanggilnya lagi SETELAH class "authed" ditambahkan &
     .app benar-benar terlihat. */
  window.refreshShellNav = function () {
    updateSidebarActiveIndicator();
    moveTopnavIndicator();
    openHashView();
  };
})();
