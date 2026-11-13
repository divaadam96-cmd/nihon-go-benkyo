/* Halaman Beranda/Dashboard (index.html). Dibungkus initPage() dan baru
   dijalankan oleh auth.js SETELAH login + hidrasi data dari Supabase selesai
   - supaya tidak sempat membaca localStorage yang masih kosong/lama sebelum
   data milik user yang login benar-benar siap. Dipecah dari app.js lama:
   bagian materi/hafalan/kanji-belajar sekarang punya halaman & file sendiri
   (pages/materi.html+js/pages/materi.js, pages/hafalan.html+js/pages/hafalan.js,
   pages/kanji.html+js/pages/kanji.js), dan bagian shell (login/header/sidebar/
   mobile-nav/open()) sekarang di js/app-shell.js supaya sama di semua halaman. */
function initPage() {
  /* Sensei/Operator: Ringkasan berisi progres seluruh siswa
     (js/pages/ringkasan-kelas.js), bukan dashboard belajar pribadi. */
  if (["sensei", "operator"].includes(window.currentProfile?.role) && window.RingkasanKelas) {
    const pribadi = document.getElementById("dashboard");
    pribadi.hidden = true;
    pribadi.classList.remove("active");
    window.RingkasanKelas.muat();
  }
  function format(n) {
    return n.toLocaleString("id-ID");
  }
  function weeklyXpDelta() {
    const quizXp = typeof window.quizXpThisWeek === "function" ? window.quizXpThisWeek() : 0;
    return srsWeeklyActivity(1)[0] * 5 + quizXp;
  }

  /* XP & status "Rencana hari ini" dihitung murni dari aktivitas SRS/quiz
     nyata, bukan checkbox manual: srsTotalActivityCount/srsAnyReviewedToday
     (srs.js) dan quizXpTotal/quizXpThisWeek/quizDoneToday (quiz-results.js).
     Bagian XP header + ringkasan sidebar (dipakai SEMUA halaman) diperbarui
     lewat window.refreshShellXp() (js/app-shell.js) - di sini cuma menambah
     kartu-kartu yang cuma ada di dashboard. */
  function paintProgressUI() {
    if (typeof window.refreshShellXp === "function") window.refreshShellXp();
    const taskDone = {
      hafalan: srsAnyReviewedToday("hafalan:"),
      materi: srsAnyReviewedToday("materi:"),
      kanji: srsAnyReviewedToday("kanji:"),
      quiz: typeof window.quizDoneToday === "function" && window.quizDoneToday(),
    };
    const done = Object.values(taskDone).filter(Boolean).length;
    // XP ada di baris angka "Progres saya" (dibangun renderProgresSaya).
    const xpCardEl = document.getElementById("xpCard");
    if (xpCardEl) xpCardEl.textContent = format(window.totalXp());
    const xpWeeklyNote = document.getElementById("xpWeeklyNote");
    if (xpWeeklyNote) xpWeeklyNote.textContent = `+${format(weeklyXpDelta())} minggu ini`;
    const hitungEl = document.getElementById("rencanaHitung");
    if (hitungEl) hitungEl.innerHTML = `<b>${done}</b> dari 4 selesai`;
    const barEl = document.getElementById("rencanaBar");
    if (barEl) {
      barEl.setAttribute("aria-label", `${done} dari 4 selesai`);
      barEl.firstElementChild.style.width = `${done * 25}%`;
    }
    document
      .querySelectorAll(".todo")
      .forEach((t) => t.classList.toggle("done", !!taskDone[t.dataset.task]));
  }
  function sync() {
    paintProgressUI();
    renderDashboardActivity();
  }

  /* Progres Buku 1/Buku 2 dihitung di pages/materi.html (satu-satunya
     tempat yang punya konten materinya) dan disimpan ke localStorage -
     dashboard cuma membaca cache itu, karena kedua halaman ini sekarang
     dokumen terpisah. Kalau cache belum ada (siswa belum pernah membuka
     Materi sama sekali), tampil 0% - itu memang benar adanya. */
  function renderCurriculumSummary() {
    let summary = { bookOnePercent: 0, bookTwoPercent: 0 };
    try {
      const raw = localStorage.getItem("nihonBenkyoCurriculumSummaryV1");
      if (raw) summary = Object.assign(summary, JSON.parse(raw));
    } catch {
      // Cache rusak/tidak tersedia - tampil 0% saja, tidak fatal.
    }
    const percents = [summary.bookOnePercent, summary.bookTwoPercent];
    document.querySelectorAll("#progresPeta .progres-buku").forEach((buku, index) => {
      const persen = percents[index] || 0;
      buku.querySelector(".bar-tipis").setAttribute("aria-label", `Buku ${index + 1}: ${persen}% materi dipahami`);
      buku.querySelector(".bar-tipis i").style.width = `${persen}%`;
      buku.querySelector(".progres-buku-persen").textContent = `${persen}%`;
    });
  }
  window.renderCurriculumSummary = renderCurriculumSummary;

  /* Rencana hari ini & grafik aktivitas: dihitung dari data SRS asli
     (kanji, materi, hafalan), bukan angka contoh statis. */
  function renderDashboardActivity() {
    const streakEl = document.getElementById("streakDays");
    if (streakEl) streakEl.textContent = `${srsStreak()} hari`;
    if (typeof window.loadStudyReminder === "function") window.loadStudyReminder();
    if (typeof window.loadSiswaAssignments === "function") window.loadSiswaAssignments();
    if (typeof window.loadQuizResultsCache === "function")
      window.loadQuizResultsCache().then(paintProgressUI);
    renderCurriculumSummary();

    const hafalanDue = srsDueCount("hafalan:");
    const materiDue = srsDueCount("materi:");
    const kanjiDue = srsDueCount("kanji:");
    const subtitle = (due) =>
      due > 0 ? `${due} perlu diulang hari ini` : "Tidak ada yang due — lanjut materi baru";
    const hafalanSub = document.getElementById("taskHafalanSub");
    const materiSub = document.getElementById("taskMateriSub");
    const kanjiSub = document.getElementById("taskKanjiSub");
    if (hafalanSub) hafalanSub.textContent = subtitle(hafalanDue);
    if (materiSub) materiSub.textContent = subtitle(materiDue);
    if (kanjiSub) kanjiSub.textContent = subtitle(kanjiDue);

    document.querySelectorAll(".todo[data-goto]").forEach((row) => {
      const label = row.querySelector("span");
      if (label && !label.dataset.navBound) {
        label.dataset.navBound = "1";
        label.style.cursor = "pointer";
        label.onclick = () => {
          // Ada kartu Hafalan jatuh tempo -> langsung ke mode Ulangan.
          if (row.dataset.task === "hafalan" && srsDueCount("hafalan:") > 0) location.href = "pages/hafalan.html?ulangan=1";
          else open(row.dataset.goto);
        };
      }
    });

    const chartPath = document.getElementById("activityChartPath");
    if (chartPath) {
      const weekly = srsWeeklyActivity(6);
      const max = Math.max(5, ...weekly);
      const points = weekly.map((count, index) => {
        const x = (index / (weekly.length - 1)) * 600;
        const y = 155 - (count / max) * 130;
        return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      });
      chartPath.setAttribute("d", points.join(" "));
    }
    const goalPath = document.getElementById("activityGoalPath");
    if (goalPath) {
      const weekly = srsWeeklyActivity(6);
      const max = Math.max(5, ...weekly);
      const goal = 14; // target ringan: ~2 ulasan sehari
      const y = Math.max(5, 155 - (Math.min(goal, max) / max) * 130);
      goalPath.setAttribute("d", `M0,${y.toFixed(1)} L600,${y.toFixed(1)}`);
    }
  }
  window.renderDashboardActivity = renderDashboardActivity;

  /* "Lanjutkan belajar": daftar langkah berikutnya supaya siswa tidak perlu
     menebak harus membuka menu mana - ulangan Hafalan yang jatuh tempo
     dulu (singkat, menjaga ingatan), lalu hal pertama yang masih kurang di
     pelajaran terdepan (TugasBab.langkahBerikut, js/tugas-bab.js). */
  function langkahBelajar() {
    const langkah = [];
    const due = srsDueCount("hafalan:");
    if (due > 0)
      langkah.push({
        judul: `Ulangan Hafalan: ${due} kartu`,
        ket: "Kata & kanji yang jadwal ulangnya hari ini, termasuk yang salah di tugas.",
        href: "pages/hafalan.html?ulangan=1",
      });
    if (window.TugasBab) {
      const l = TugasBab.langkahBerikut();
      const materi = `pages/materi.html?bab=${l.bab}`;
      if (l.jenis === "materi")
        langkah.push({ judul: `Pelajaran ${l.bab}: baca & pahami materi`, ket: "Pelajari polanya, lalu tekan \"Sudah paham\" untuk membuka tugas.", href: materi });
      else if (l.jenis === "tugas")
        langkah.push({ judul: `Pelajaran ${l.bab}: ${l.judul}`, ket: `${l.dikerjakan} dari ${l.totalTugas} tugas sudah dikerjakan.`, href: `${materi}&tahap=tugas&tugas=${l.target}` });
      else if (l.jenis === "ujian")
        langkah.push({ judul: l.judul, ket: l.skor === null ? `Semua tugas Pelajaran ${l.bab} selesai. Ujian campuran 5 pelajaran ini membuka pelajaran berikutnya.` : `Skor terbaik ${l.skor}, perlu minimal ${TugasBab.KKM} untuk lulus.`, href: `${materi}&tahap=tugas&tugas=${l.target}` });
      else if (l.jenis === "ulang")
        langkah.push({ judul: `Pelajaran ${l.bab}: ulangi ${l.judul}`, ket: `Rata-rata tugas ${l.rataRata}, perlu minimal ${TugasBab.KKM}. Skor terbaik tugas ini ${l.skor}.`, href: `${materi}&tahap=tugas&tugas=${l.target}` });
      else
        langkah.push({ judul: "Semua 50 pelajaran tuntas 🎉", ket: "Jaga ingatan dengan ulangan Hafalan setiap hari.", href: materi });
    }
    return langkah;
  }
  function esc(text) {
    return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }
  /* Panel "Hari ini": langkah pertama besar di kiri, langkah berikutnya
     sebagai tautan kecil di bawahnya; rencana hari ini di kanan. */
  function renderLanjutkan() {
    const card = document.getElementById("continueCard");
    if (!card) return;
    const langkah = langkahBelajar();
    card.hidden = !langkah.length;
    document.getElementById("hariIni").classList.toggle("tanpa-lanjut", !langkah.length);
    if (!langkah.length) return;
    const [utama, ...lain] = langkah;
    card.innerHTML = `<div class="eyebrow">Lanjutkan belajar</div><b>${esc(utama.judul)}</b><span>${esc(utama.ket)}</span><a class="hari-ini-mulai" href="${esc(utama.href)}">Mulai →</a>${lain
      .map((l) => `<a class="hari-ini-lain" href="${esc(l.href)}">Berikutnya: ${esc(l.judul)} →</a>`)
      .join("")}`;
  }
  /* Peta 50 pelajaran (siswa): status tiap pelajaran dari TugasBab
     (nilai tugas di server, aturan kunci yang sama dengan halaman Materi),
     angka ringkas, rincian nilai pelajaran yang diklik, dan nilai rata-rata
     tugas per pelajaran. */
  let babDipilih = null; // null = ikut pelajaran saat ini
  const bukuTerbuka = {}; // no buku -> true/false bila siswa membuka/menutup sendiri
  function statusBab(bab, sekarang) {
    if (TugasBab.isComplete(bab)) return "tuntas";
    if (bab === sekarang) return "sekarang";
    if (TugasBab.isLocked(bab)) return "kunci";
    const p = TugasBab.progress(bab);
    return p.materi || p.dikerjakan ? "mulai" : "buka";
  }
  const NAMA_STATUS = { tuntas: "Tuntas", sekarang: "Sedang dikerjakan", mulai: "Sudah dimulai", buka: "Terbuka", kunci: "Terkunci" };
  function renderRincian() {
    const el = document.getElementById("progresRincian");
    const bab = babDipilih || TugasBab.frontierBab();
    const r = TugasBab.rincian(bab);
    const status = statusBab(bab, TugasBab.frontierBab());
    if (status === "kunci") {
      el.innerHTML = `<div class="progres-rincian-head"><h3>Pelajaran ${bab}</h3><span>Terkunci</span></div><p class="muted">Terbuka setelah Pelajaran ${bab - 1} tuntas.</p>`;
      return;
    }
    const kurang = TugasBab.isComplete(bab) ? [] : TugasBab.kekurangan(bab);
    const nilai = (v) => (v === null ? '<span class="muted">belum</span>' : `<b class="${v >= TugasBab.KKM ? "lulus" : "kurang"}">${v}</b>`);
    el.innerHTML = `<div class="progres-rincian-head"><h3>Pelajaran ${bab}</h3><span>${esc(NAMA_STATUS[status])}</span><a class="secondary" href="pages/materi.html?bab=${bab}">Buka pelajaran →</a></div>
      <ul class="progres-tugas"><li><span>Materi ditandai paham</span>${r.materi ? '<b class="lulus">✔</b>' : '<span class="muted">belum</span>'}</li>${r.tugas.map((t) => `<li><span>${esc(t.judul)}</span>${nilai(t.skor)}${t.percobaan ? `<small>${t.percobaan}x</small>` : ""}</li>`).join("")}${r.ujian ? `<li><span>Ujian ulang Pel. ${esc(r.ujian.rentang)}${r.ujian.wajib ? "" : " (tidak wajib)"}</span>${nilai(r.ujian.skor)}</li>` : ""}</ul>
      ${kurang.length ? `<p class="progres-kurang">Yang masih kurang: ${kurang.map(esc).join("; ")}.</p>` : ""}`;
  }
  function renderProgresSaya() {
    const kartu = document.getElementById("progresSaya");
    if (!kartu || !window.TugasBab || window.currentProfile?.role !== "siswa") return;
    const max = TugasBab.MAX_BAB;
    const sekarang = TugasBab.frontierBab();
    const status = Array.from({ length: max }, (_, i) => statusBab(i + 1, sekarang));
    const dengan = Array.from({ length: max }, (_, i) => i + 1).filter((b) => TugasBab.progress(b).dikerjakan > 0);
    // Rata-rata skor terbaik semua tugas yang sudah dikerjakan (sama dengan Ringkasan kelas staf).
    const skor = dengan.flatMap((b) => TugasBab.rincian(b).tugas.map((t) => t.skor).filter((v) => v !== null));
    const rata = skor.length ? Math.round(skor.reduce((n, v) => n + v, 0) / skor.length) : null;
    // Satu baris angka (XP diperbarui paintProgressUI lewat id xpCard/xpWeeklyNote).
    const angka = [
      ["Total XP", `<b id="xpCard">${esc(format(window.totalXp()))}</b><em id="xpWeeklyNote">+${esc(format(weeklyXpDelta()))} minggu ini</em>`],
      ["Pelajaran tuntas", `<b>${status.filter((s) => s === "tuntas").length} / ${max}</b><em>sedang di Pelajaran ${sekarang}</em>`],
      ["Rata-rata nilai tugas", `<b>${esc(rata ?? "–")}</b><em>KKM ${TugasBab.KKM}</em>`],
      ["Pola dipahami", `<b>${srsMasteredCount("materi:")}</b><em>pola materi</em>`],
      ["Kata dikuasai", `<b>${srsMasteredCount("hafalan:")}</b><em>di Hafalan</em>`],
      ["Kanji dikuasai", `<b>${srsMasteredCount("kanji:")}</b><em>di Hafalan</em>`],
    ];
    document.getElementById("progresAngka").innerHTML = angka.map(([k, v]) => `<div><small>${esc(k)}</small>${v}</div>`).join("");
    const sel = (bab) => {
      const s = status[bab - 1];
      const p = TugasBab.progress(bab);
      const ket = `Pelajaran ${bab}: ${NAMA_STATUS[s]}${p.dikerjakan ? `, rata-rata ${p.rataRata}` : ""}`;
      return `<button type="button" role="listitem" class="progres-bab ${s}${bab === (babDipilih || sekarang) ? " dipilih" : ""}" data-bab="${bab}" title="${esc(ket)}" aria-label="${esc(ket)}"><b>${bab}</b>${p.dikerjakan ? `<small>${p.rataRata}</small>` : ""}</button>`;
    };
    // Peta per buku: buku pelajaran saat ini terbuka, buku lain dilipat
    // (pilihan buka/tutup siswa diingat selama halaman terbuka).
    const bukuSekarang = sekarang <= 25 ? 1 : 2;
    document.getElementById("progresPeta").innerHTML = [1, 2].map((no) => {
      const awal = no === 1 ? 1 : 26;
      const buka = bukuTerbuka[no] ?? no === bukuSekarang;
      return `<details class="progres-buku" data-buku="${no}"${buka ? " open" : ""}><summary><b>Buku ${no}</b><small>Pelajaran ${awal}–${awal + 24}</small><span class="bar-tipis" role="img"><i></i></span><span class="progres-buku-persen">0%</span><em class="progres-buku-lihat">Lihat 25 pelajaran</em></summary><div class="progres-peta" role="list">${Array.from({ length: 25 }, (_, i) => sel(awal + i)).join("")}</div></details>`;
    }).join("");
    renderCurriculumSummary();
    document.getElementById("progresNilai").innerHTML = dengan.length
      ? `<div class="progres-bar-wrap" style="--kkm-angka:${TugasBab.KKM / 100}">${dengan.map((b) => {
          const v = TugasBab.progress(b).rataRata;
          return `<div class="progres-bar ${v >= TugasBab.KKM ? "lulus" : "kurang"}" title="Pelajaran ${b}: ${v}"><span style="height:${Math.max(4, v)}%"></span><small>${b}</small></div>`;
        }).join("")}</div><p class="muted progres-ket">Garis putus-putus = KKM ${TugasBab.KKM}. Nilai dihitung dari skor terbaik 8 tugas tiap pelajaran.</p>`
      : '<p class="muted">Belum ada tugas yang dikerjakan.</p>';
    renderRincian();
    kartu.hidden = false;
  }
  document.getElementById("progresPeta")?.addEventListener("toggle", (event) => {
    const buku = event.target.closest(".progres-buku");
    if (buku) bukuTerbuka[buku.dataset.buku] = buku.open;
  }, true);
  document.getElementById("progresPeta")?.addEventListener("click", (event) => {
    const tombol = event.target.closest(".progres-bab");
    if (!tombol) return;
    babDipilih = Number(tombol.dataset.bab);
    document.querySelectorAll(".progres-bab").forEach((b) => b.classList.toggle("dipilih", b === tombol));
    renderRincian();
  });

  /* Sapaan memakai nama depan akun yang login. */
  const greeting = document.getElementById("dashboardGreeting");
  const namaDepan = String(window.currentProfile?.full_name || "").trim().split(/\s+/)[0];
  if (greeting && namaDepan) greeting.textContent = `Selamat datang kembali, ${namaDepan}.`;

  if (window.TugasBab) {
    TugasBab.onChange(renderLanjutkan);
    TugasBab.onChange(renderProgresSaya);
    TugasBab.init();
  }
  renderLanjutkan();
  renderProgresSaya();

  sync();
}
window.initPage = initPage;
