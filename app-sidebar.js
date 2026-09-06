/* Topnav + sidebar: rebuild menu (kanji/hafalan/monitor/admin), toggle
   rail desktop/drawer mobile, tooltip mode rail, dan re-binding klik
   [data-view]. Dipanggil sekali dari initApp() (app.js) lewat
   initSidebarNav(open, updateSidebarActiveIndicator) - dua dependensi
   ini dioper eksplisit sebagai parameter (bukan lewat window) supaya
   tidak menimpa window.open bawaan browser dan tidak kena masalah
   temporal-dead-zone kalau dipanggil lebih awal (mis. saat ada hash
   URL) sebelum bagian ini sempat jalan. updateSidebarActiveIndicator
   sendiri tetap didefinisikan di app.js karena dipakai juga oleh
   open() di sana. */
function initSidebarNav(openView, updateActiveIndicator) {
  const nav = document.querySelector(".topnav");
  if (nav)
    nav.innerHTML =
      '<button class="active" data-view="dashboard">Beranda</button><button data-view="materials">Materi</button><button data-view="kanji-study">Kanji</button><button data-view="memorization">Hafalan</button><button data-view="test">Tes kemampuan</button><button data-view="monitor" data-role-only="sensei,operator" hidden>Pantau Siswa</button><button data-view="admin" data-role-only="operator" hidden>Admin</button>';
  document
    .querySelectorAll('[data-open="flashcards"]')
    .forEach((button) => (button.dataset.open = "memorization"));
  document.querySelectorAll('[data-view="flashcards"]').forEach((button) => {
    button.dataset.view = "memorization";
    button.innerHTML = button.closest(".side")
      ? '<span class="jp">語</span><span class="menu-label-text">Hafalan</span>'
      : '<span class="jp">語</span>Hafalan';
  });
  const side = document.querySelector(".side");
  if (side) {
    const memorizeButton = side.querySelector('[data-view="memorization"]');
    if (memorizeButton)
      memorizeButton.insertAdjacentHTML(
        "beforebegin",
        '<button data-view="kanji-study"><span class="jp">漢</span><span class="menu-label-text">Belajar kanji</span></button>',
      );
    side.insertAdjacentHTML(
      "beforeend",
      '<div class="menu-label" data-role-only="sensei,operator" hidden>Kelola</div><button data-view="monitor" data-role-only="sensei,operator" hidden><span class="jp">監</span><span class="menu-label-text">Pantau Siswa</span></button><button data-view="admin" data-role-only="operator" hidden><span class="jp">管</span><span class="menu-label-text">Panel Admin</span></button>',
    );
    side.querySelectorAll("button[data-view]").forEach((button) => {
      const labelEl = button.querySelector(".menu-label-text");
      const label = labelEl ? labelEl.textContent.trim() : "";
      if (label) button.title = label;
    });
  }
  /* Sidebar dan tombol garis-3 jadi satu komponen: versi desktop hidup
     DI DALAM sidebar (menyatu), versi mobile tetap di navbar (karena
     drawer mobile geser total keluar layar saat tertutup, jadi butuh
     trigger yang selalu terjangkau di luar sidebar itu sendiri). Status
     rail tersimpan di localStorage; drawer mobile selalu mulai tertutup. */
  const layoutEl = document.querySelector(".layout");
  const sidebarToggleButtons = document.querySelectorAll(".sidebar-toggle");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  function isMobileSidebarViewport() {
    return window.matchMedia("(max-width: 700px)").matches;
  }
  /* Label (judul bagian, teks menu, kartu "Rencana hari ini") diberi
     transition-delay bertingkat 25ms per item saat expand - CSS sendiri
     sudah mengatur delay dasar 80ms untuk expand dan 0ms untuk collapse
     (lihat .menu-label/.menu-label-text/.study-note di styles.css),
     fungsi ini menambahkan stagger DI ATAS delay dasar itu dengan
     inline style; saat collapse, inline style dilepas supaya kembali ke
     delay seragam 0ms bawaan CSS. */
  function staggerSidebarLabels(expanding) {
    if (!side) return;
    const items = side.querySelectorAll(".menu-label, button[data-view], .study-note");
    items.forEach((el, i) => {
      el.style.transitionDelay = expanding ? `${80 + i * 25}ms` : "";
    });
  }
  function applySidebarCollapsed(collapsed) {
    if (!layoutEl) return;
    staggerSidebarLabels(!collapsed);
    layoutEl.classList.toggle("sidebar-collapsed", collapsed);
    const label = collapsed ? "Tampilkan sidebar" : "Sembunyikan sidebar";
    sidebarToggleButtons.forEach((btn) => {
      btn.title = label;
      btn.setAttribute("aria-label", label);
    });
    setTimeout(updateActiveIndicator, 340);
  }
  function setMobileDrawerOpen(open) {
    if (!layoutEl) return;
    layoutEl.classList.toggle("sidebar-mobile-open", open);
    const label = open ? "Tutup menu" : "Buka menu";
    sidebarToggleButtons.forEach((btn) => {
      btn.title = label;
      btn.setAttribute("aria-label", label);
    });
    if (open) setTimeout(updateActiveIndicator, 320);
  }
  if (layoutEl && sidebarToggleButtons.length) {
    applySidebarCollapsed(localStorage.getItem("sidebarCollapsed") === "1");
    updateActiveIndicator();
    const onSidebarToggleClick = () => {
      if (isMobileSidebarViewport()) {
        setMobileDrawerOpen(!layoutEl.classList.contains("sidebar-mobile-open"));
        return;
      }
      const collapsed = !layoutEl.classList.contains("sidebar-collapsed");
      applySidebarCollapsed(collapsed);
      localStorage.setItem("sidebarCollapsed", collapsed ? "1" : "0");
    };
    sidebarToggleButtons.forEach((btn) => (btn.onclick = onSidebarToggleClick));
    if (sidebarBackdrop) sidebarBackdrop.onclick = () => setMobileDrawerOpen(false);
    window.addEventListener("resize", () => updateActiveIndicator());
  }
  /* Tooltip untuk mode rail (collapsed) - elemen posisi:fixed terpisah
     supaya tidak terpotong overflow-x:hidden milik .side (lihat komentar
     di styles.css). Cuma tampil saat sidebar collapsed & bukan mode
     drawer mobile. */
  const sidebarTooltip = document.getElementById("sidebarTooltip");
  function showSidebarTooltip(button) {
    if (!sidebarTooltip || !layoutEl) return;
    if (layoutEl.classList.contains("sidebar-collapsed") || isMobileSidebarViewport()) return;
    const rect = button.getBoundingClientRect();
    sidebarTooltip.textContent = button.title || "";
    sidebarTooltip.style.left = `${rect.right + 12}px`;
    sidebarTooltip.style.top = `${rect.top + rect.height / 2}px`;
    sidebarTooltip.classList.add("visible");
  }
  function hideSidebarTooltip() {
    if (sidebarTooltip) sidebarTooltip.classList.remove("visible");
  }
  if (side) {
    side.querySelectorAll("button[data-view]").forEach((btn) => {
      btn.addEventListener("mouseenter", () => showSidebarTooltip(btn));
      btn.addEventListener("mouseleave", hideSidebarTooltip);
      btn.addEventListener("focus", () => showSidebarTooltip(btn));
      btn.addEventListener("blur", hideSidebarTooltip);
    });
  }
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.onclick = () => {
      const icon = button.querySelector(".jp");
      if (icon) {
        icon.classList.remove("pressing");
        void icon.offsetWidth;
        icon.classList.add("pressing");
      }
      openView(button.dataset.view);
    };
  });
}
