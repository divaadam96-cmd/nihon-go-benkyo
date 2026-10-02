/* Halaman Beranda/Dashboard (index.html). Dibungkus initPage() dan baru
   dijalankan oleh auth.js SETELAH login + hidrasi data dari Supabase selesai
   - supaya tidak sempat membaca localStorage yang masih kosong/lama sebelum
   data milik user yang login benar-benar siap. Dipecah dari app.js lama:
   bagian materi/hafalan/kanji-belajar sekarang punya halaman & file sendiri
   (pages/materi.html+js/pages/materi.js, pages/hafalan.html+js/pages/hafalan.js,
   pages/kanji.html+js/pages/kanji.js), dan bagian shell (login/header/sidebar/
   mobile-nav/open()) sekarang di js/app-shell.js supaya sama di semua halaman. */
function initPage() {
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
    const xpCardEl = document.getElementById("xpCard");
    if (xpCardEl) xpCardEl.textContent = format(window.totalXp());
    const xpWeeklyNote = document.getElementById("xpWeeklyNote");
    if (xpWeeklyNote)
      xpWeeklyNote.textContent = `+${format(weeklyXpDelta())} XP minggu ini`;
    const taskHeadlineEl = document.getElementById("taskHeadline");
    if (taskHeadlineEl) taskHeadlineEl.textContent = `${done} dari 4`;
    const kanjiCountEl = document.getElementById("kanjiCount");
    if (kanjiCountEl) kanjiCountEl.textContent = srsMasteredCount("kanji:");
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
    let summary = { bookOnePercent: 0, bookTwoPercent: 0, totalPercent: 0, totalDone: 0 };
    try {
      const raw = localStorage.getItem("nihonBenkyoCurriculumSummaryV1");
      if (raw) summary = Object.assign(summary, JSON.parse(raw));
    } catch {
      // Cache rusak/tidak tersedia - tampil 0% saja, tidak fatal.
    }
    const targetMetric = document.querySelector("#dashboard .overview .metric:nth-child(3)");
    if (targetMetric) {
      const targetLabel = targetMetric.querySelector("small");
      const targetValue = targetMetric.querySelector("b");
      const targetCopy = targetMetric.querySelector("p");
      if (targetLabel) targetLabel.textContent = "Progres keseluruhan";
      if (targetValue) targetValue.textContent = `${summary.totalPercent}%`;
      if (targetCopy)
        targetCopy.textContent = `${summary.totalDone} dari 50 pelajaran dipahami`;
    }
    const levels = document.querySelectorAll("#dashboard .levels .level");
    const progressData = [
      ["Buku 1", summary.bookOnePercent],
      ["Buku 2", summary.bookTwoPercent],
    ];
    levels.forEach((level, index) => {
      if (!progressData[index]) return;
      const [label, percent] = progressData[index];
      const name = level.querySelector("b");
      const fill = level.querySelector(".fill");
      const value = level.querySelector("span");
      if (name) name.textContent = label;
      if (fill) fill.style.width = `${percent}%`;
      if (value) value.textContent = `${percent}%`;
    });
    const levelsHeading = document.querySelector("#dashboard .levels")
      ?.parentElement?.querySelector("h2");
    if (levelsHeading) levelsHeading.textContent = "Progres materi";
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
        label.onclick = () => open(row.dataset.goto);
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

  sync();
}
window.initPage = initPage;
