/* Interaksi sidebar: toggle rail desktop/drawer mobile, tooltip mode rail.
   Dipanggil sekali dari js/app-shell.js lewat
   initSidebarNav(open, updateSidebarActiveIndicator) - dua dependensi ini
   dioper eksplisit sebagai parameter (bukan lewat window) supaya tidak
   menimpa window.open bawaan browser dan tidak kena masalah temporal-dead-
   zone kalau dipanggil lebih awal (mis. saat ada hash URL) sebelum bagian
   ini sempat jalan. updateSidebarActiveIndicator sendiri didefinisikan di
   app-shell.js karena dipakai juga oleh open() di sana.
   Markup topnav/sidebar (tombol Kanji/Hafalan/Pantau Siswa/Admin, judul
   tombol untuk tooltip, dst) sudah lengkap sejak dibangun app-shell.js,
   jadi file ini HANYA memasang perilaku, bukan lagi menyusun ulang DOM. */
function initSidebarNav(openView, updateActiveIndicator) {
  const side = document.querySelector(".side");
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
