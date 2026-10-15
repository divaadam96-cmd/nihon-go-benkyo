/* Halaman Pantau Siswa (pages/pantau.html, khusus Sensei & Operator):
   ringkasan progres semua Siswa (dihitung server lewat pantau_ringkasan,
   pantau_detail & pantau_kelas - supabase/add-pantau-siswa.sql), reset &
   pulihkan progres, pemberian/penilaian tugas, dan unduh rapor CSV.
   escapeHtml bersama dari js/app-shell.js; displayLoginId disalin di sini
   karena cuma dipakai halaman Sensei/Operator (di sini dan admin.js).
   Dibungkus initPage(), dijalankan auth.js setelah login. */
function initPage() {
const escapeHtml = window.escapeHtml;
/* Akun Sensei/Siswa disimpan pakai email sintetis (lihat toLoginEmail di
   auth.js) supaya operator bisa bikin ID bebas tanpa email asli. Tampilkan
   ID bersihnya saja - potong domain sintetis kalau ada. */
function displayLoginId(email) {
  if (!email) return "-";
  const suffix = `@${window.SYNTHETIC_ID_DOMAIN}`;
  return email.endsWith(suffix) ? email.slice(0, -suffix.length) : email;
}

const monitorListEl = document.getElementById("monitorList");
const monitorClassEl = document.getElementById("monitorClass");
const monitorFiltersEl = document.getElementById("monitorFilters");
const monitorSortEl = document.getElementById("monitorSort");
const monitorExportBtn = document.getElementById("monitorExport");
const monitorDetailEl = document.getElementById("monitorDetail");
const monitorDetailName = document.getElementById("monitorDetailName");
const monitorDetailId = document.getElementById("monitorDetailId");
const monitorDetailAvatar = document.getElementById("monitorDetailAvatar");
const monitorDetailStats = document.getElementById("monitorDetailStats");
const monitorActivity = document.getElementById("monitorActivity");
const monitorAttentionSlot = document.getElementById("monitorAttentionSlot");
const monitorLessonSection = document.getElementById("monitorLessonSection");
const monitorLessonCount = document.getElementById("monitorLessonCount");
const monitorLessons = document.getElementById("monitorLessons");
const monitorQuizSection = document.getElementById("monitorQuizSection");
const monitorQuizCount = document.getElementById("monitorQuizCount");
const monitorQuizList = document.getElementById("monitorQuizList");
const monitorResetBtn = document.getElementById("monitorResetBtn");
const monitorResetError = document.getElementById("monitorResetError");
const monitorResetHistory = document.getElementById("monitorResetHistory");
const monitorDetailClose = document.getElementById("monitorDetailClose");
const monitorAssignmentSection = document.getElementById("monitorAssignmentSection");
const monitorDangerSection = document.getElementById("monitorDangerSection");
const monitorAssignmentCount = document.getElementById("monitorAssignmentCount");
const monitorAssignmentList = document.getElementById("monitorAssignmentList");
const monitorAssignmentForm = document.getElementById("monitorAssignmentForm");
const monitorAssignmentError = document.getElementById("monitorAssignmentError");
const monitorAssignmentTitle = document.getElementById("monitorAssignmentTitle");
const monitorAssignmentBab = document.getElementById("monitorAssignmentBab");
const monitorAssignmentPaket = document.getElementById("monitorAssignmentPaket");

let monitorStudents = [];
let monitorSelectedId = null;
let monitorFilter = "all";

/* Paket ujian siap pakai dibaca dari database (list_test_packages) - paket
   baru yang ditambahkan Operator di tabel test_packages + package_questions
   (lihat supabase/contoh-tambah-paket.sql) langsung muncul di pilihan akses
   tanpa mengubah kode. Paket yang belum punya soal / dinonaktifkan tidak
   ditawarkan, tapi labelnya tetap dipakai untuk menampilkan akses lama. */
let testPackages = [];
function packageInfo(key) {
  return testPackages.find((p) => p.key === key) || { key, label: key, mark: "Paket", time_limit_minutes: 60 };
}
async function loadTestPackages() {
  try {
    const { data, error } = await window.supabaseClient.rpc("list_test_packages");
    if (!error && data) testPackages = data;
  } catch {
    // Gagal memuat (offline dsb.) - pilihan paket kosong, form menjelaskannya.
  }
  const assignable = testPackages.filter((p) => p.active && p.question_count > 0);
  monitorAssignmentPaket.innerHTML = assignable.length
    ? assignable
        .map((p) => `<option value="${escapeHtml(p.key)}">${escapeHtml(p.label)} · ${p.question_count} soal · ${p.time_limit_minutes} menit</option>`)
        .join("")
    : '<option value="" disabled selected>Belum ada paket yang siap</option>';
}

function currentAssignmentType() {
  const checked = monitorAssignmentForm.querySelector('input[name="assignmentType"]:checked');
  return checked ? checked.value : "umum";
}

function updateAssignmentFormMode() {
  const type = currentAssignmentType();
  monitorAssignmentBab.hidden = type !== "bab";
  monitorAssignmentPaket.hidden = type !== "paket";
  const isTestAccess = type !== "umum";
  monitorAssignmentTitle.hidden = isTestAccess;
  monitorAssignmentTitle.required = !isTestAccess;
}

monitorAssignmentForm.querySelectorAll('input[name="assignmentType"]').forEach((radio) => {
  radio.addEventListener("change", updateAssignmentFormMode);
});
updateAssignmentFormMode();

function formatActivityDate(value) {
  if (!value) return "Belum pernah";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatQuizDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function quizScorePercent(row) {
  return row.total_count ? Math.round((row.correct_count / row.total_count) * 100) : 0;
}

/* Tren nilai tiap bagian soal dari sesi pertama ke terakhir: garis kecil
   + selisih, supaya terlihat bagian mana yang membaik / memburuk. */
function quizTrendHtml(quizRows) {
  const series = {};
  quizRows
    .slice()
    .reverse() // pantau_detail mengirim terbaru dulu; tren dibaca dari yang terlama.
    .forEach((row) => {
      Object.entries(row.category_scores || {}).forEach(([label, score]) => {
        if (!score || !score.total) return;
        (series[label] = series[label] || []).push(Math.round((score.correct / score.total) * 100));
      });
    });
  const labels = Object.keys(series);
  if (!labels.length) return "";
  const rows = labels
    .map((label) => {
      const values = series[label];
      const first = values[0];
      const last = values[values.length - 1];
      const delta = last - first;
      const points = values
        .map((v, i) => `${values.length === 1 ? 40 : (i / (values.length - 1)) * 80},${(22 - (v / 100) * 20).toFixed(1)}`)
        .join(" ");
      const deltaHtml =
        values.length < 2
          ? '<small class="monitor-trend-delta">1 sesi</small>'
          : `<small class="monitor-trend-delta ${delta > 0 ? "up" : delta < 0 ? "down" : ""}">${delta > 0 ? "▲" : delta < 0 ? "▼" : "="} ${Math.abs(delta)} poin</small>`;
      return `<div class="monitor-trend-row"><span>${escapeHtml(label)}</span><svg viewBox="0 0 80 24" aria-hidden="true"><polyline points="${points}"></polyline></svg><b>${last}%</b>${deltaHtml}</div>`;
    })
    .join("");
  return `<div class="monitor-trend"><b>Tren per bagian</b>${rows}</div>`;
}

/* Rincian nilai per sesi tes untuk Sensei/Operator: skor keseluruhan lalu
   bagian (kategori soal, lihat categoryScores() di js/pages/latihan.js)
   yang masih banyak salah. Baris sudah terurut dari sesi terbaru
   (pantau_detail). */
function quizHistoryHtml(quizRows) {
  if (!quizRows.length) {
    return '<p class="muted">Belum ada tes yang dikerjakan.</p>';
  }
  return quizRows
    .map((row) => {
      const percent = quizScorePercent(row);
      const categories = Object.entries(row.category_scores || {});
      const tagsHtml = categories.length
        ? categories
            .map(([label, score]) => {
              const correct = (score && score.correct) || 0;
              const total = (score && score.total) || 0;
              const wrong = total - correct;
              const tagClass = wrong > 0 ? "monitor-quiz-tag wrong" : "monitor-quiz-tag";
              return `<span class="${tagClass}">${escapeHtml(label)} · ${correct}/${total}${wrong > 0 ? ` (${wrong} salah)` : ""}</span>`;
            })
            .join("")
        : '<span class="monitor-quiz-tag">Rincian bagian tidak tersedia</span>';
      return `<div class="monitor-quiz-row${percent < 60 ? " due" : ""}"><div class="monitor-quiz-row-head"><b>${percent}%</b><span>${row.correct_count}/${row.total_count} benar</span><small>${formatQuizDate(row.created_at)}</small>${row.finish_reason === "timeout" ? '<span class="monitor-quiz-tag wrong" title="Dinilai dari jawaban yang tersimpan sebelum batas waktu">⏱ Waktu habis</span>' : ""}</div><div class="monitor-quiz-breakdown">${tagsHtml}</div></div>`;
    })
    .join("");
}

/* Uraikan item_id jadi label yang bisa dibaca Sensei - bukan cuma
   "kanji:山" mentah. Format materi ("materi:book{N}:{lessonIndex}:
   {patternIndex}") dipetakan balik ke nomor Pelajaran + nomor pola. */
function describeItemId(itemId) {
  const parts = itemId.split(":");
  const ns = parts[0];
  if (ns === "kanji") return `Kanji ${parts[1]}`;
  if (ns === "hafalan") {
    const rest = parts.slice(1);
    const word = rest[rest.length - 1];
    const category = rest.slice(0, -1).join(" ");
    return category ? `Kosakata ${word} (${category})` : `Kosakata ${word}`;
  }
  if (ns === "materi") {
    const bookNumber = (parts[1] || "").replace("book", "");
    const lessonIndex = Number(parts[2]);
    const patternIndex = parts[3] != null ? Number(parts[3]) : null;
    const lessonNumber = bookNumber === "1" ? lessonIndex + 1 : lessonIndex + 26;
    return `Buku ${bookNumber} · Pelajaran ${lessonNumber}${patternIndex != null ? ` · Pola ${patternIndex + 1}` : ""}`;
  }
  return itemId;
}

const CATEGORIES = [
  { key: "kanji", label: "Kanji", icon: "漢" },
  { key: "materi", label: "Materi", icon: "文" },
  { key: "hafalan", label: "Hafalan", icon: "語" },
];

function totalDue(student) {
  return CATEGORIES.reduce((sum, cat) => sum + student[`${cat.key}_due`], 0);
}

// Ambang penanda "perlu perhatian" di kartu siswa.
const INACTIVE_DAYS = 3;
const MANY_DUE = 30;
const LOW_QUIZ_PERCENT = 60;

function daysSince(dateStr) {
  if (!dateStr) return null;
  return Math.round((new Date(`${srsToday()}T00:00:00Z`) - new Date(`${dateStr}T00:00:00Z`)) / 86400000);
}

/* Alasan siswa perlu dihubungi Sensei, dari yang paling mendesak. */
function studentFlags(student) {
  const flags = [];
  if (student.ungraded) flags.push({ key: "ungraded", label: `${student.ungraded} tugas perlu dinilai` });
  const idle = daysSince(student.last_active);
  if (idle === null) flags.push({ key: "inactive", label: "Belum pernah belajar" });
  else if (idle >= INACTIVE_DAYS) flags.push({ key: "inactive", label: `Tidak aktif ${idle} hari` });
  if (student.last_quiz_pct !== null && student.last_quiz_pct < LOW_QUIZ_PERCENT) {
    flags.push({ key: "lowquiz", label: `Tes terakhir ${student.last_quiz_pct}%` });
  }
  const due = totalDue(student);
  if (due >= MANY_DUE) flags.push({ key: "due", label: `${due} item perlu diulang` });
  return flags;
}

const FILTERS = {
  all: () => true,
  attention: (student) => studentFlags(student).length > 0,
  inactive: (student) => studentFlags(student).some((f) => f.key === "inactive"),
  ungraded: (student) => student.ungraded > 0,
};

const SORTS = {
  attention: (a, b) => studentFlags(b).length - studentFlags(a).length || a.full_name.localeCompare(b.full_name, "id"),
  name: (a, b) => a.full_name.localeCompare(b.full_name, "id"),
  active: (a, b) => (b.last_active || "").localeCompare(a.last_active || ""),
  xp: (a, b) => b.xp - a.xp,
};

function renderMonitorList() {
  monitorFiltersEl.querySelectorAll("button").forEach((button) => {
    const key = button.dataset.filter;
    const count = monitorStudents.filter(FILTERS[key]).length;
    button.setAttribute("aria-pressed", String(key === monitorFilter));
    button.textContent = `${button.textContent.replace(/ \(\d+\)$/, "")} (${count})`;
  });
  const shown = monitorStudents.filter(FILTERS[monitorFilter]).sort(SORTS[monitorSortEl.value]);
  if (!shown.length) {
    monitorListEl.innerHTML = '<p class="muted">Tidak ada siswa untuk saringan ini.</p>';
    return;
  }
  monitorListEl.innerHTML = shown
    .map((student) => {
      const flags = studentFlags(student);
      const flagsHtml = flags.length
        ? `<div class="monitor-card-flags">${flags.map((f) => `<span class="monitor-flag monitor-flag-${f.key}">${f.label}</span>`).join("")}</div>`
        : "";
      return `<button type="button" class="monitor-card${flags.length ? " needs-attention" : ""}" data-id="${student.id}"><b>${escapeHtml(student.full_name)}</b><small>${escapeHtml(displayLoginId(student.email))}</small>${flagsHtml}<div class="monitor-card-stats"><span>${student.streak} hari streak</span><span>${totalDue(student)} due</span><span>${student.xp.toLocaleString("id-ID")} XP</span>${student.last_active ? `<span>Terakhir ${student.last_active}</span>` : ""}</div></button>`;
    })
    .join("");
}

monitorFiltersEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  monitorFilter = button.dataset.filter;
  renderMonitorList();
});
monitorSortEl.addEventListener("change", renderMonitorList);

/* Rapor semua siswa (bukan hanya yang sedang disaring) sebagai CSV:
   pemisah ";" + BOM supaya langsung rapi di Excel berbahasa Indonesia. */
function csvCell(value) {
  let text = value == null ? "" : String(value);
  // Cegah formula injection saat dibuka di spreadsheet.
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return /[";\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function reportCsv() {
  const header = [
    "Nama", "ID login", "XP", "Streak (hari)", "Terakhir aktif", "Total ulasan",
    ...CATEGORIES.flatMap((cat) => [`${cat.label} dipelajari`, `${cat.label} dikuasai`, `${cat.label} perlu diulang`]),
    "Jumlah tes", "Rata-rata tes (%)", "Tes terakhir (%)", "Tugas perlu dinilai", "Perlu perhatian",
  ];
  const rows = monitorStudents
    .slice()
    .sort(SORTS.name)
    .map((student) => [
      student.full_name, displayLoginId(student.email), student.xp, student.streak, student.last_active || "", student.review_count,
      ...CATEGORIES.flatMap((cat) => [student[`${cat.key}_studied`], student[`${cat.key}_mastered`], student[`${cat.key}_due`]]),
      student.quiz_count, student.quiz_avg ?? "", student.last_quiz_pct ?? "", student.ungraded,
      studentFlags(student).map((f) => f.label).join(", "),
    ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(";")).join("\r\n");
}

monitorExportBtn.addEventListener("click", () => {
  if (!monitorStudents.length) return;
  const blob = new Blob(["\ufeff" + reportCsv()], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `rapor-siswa-${srsToday()}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
});

const CLASS_SUMMARY_DAYS = 30;

function scoreLevel(percent) {
  return percent >= 80 ? "high" : percent >= 60 ? "mid" : "low";
}

/* Ringkasan tes seluruh siswa: bagian soal diurutkan dari yang paling
   banyak salah se-kelas (pantau_kelas). */
function classSummaryHtml(summary) {
  if (!summary.quiz_count) {
    return `<p class="muted">Belum ada tes yang dikerjakan siswa dalam ${summary.days} hari terakhir.</p>`;
  }
  const rows = summary.categories
    .map((c) => {
      const percent = Math.round((c.correct / c.total) * 100);
      return `<div class="monitor-class-row"><span>${escapeHtml(c.label)}</span><span class="monitor-class-track"><i class="level-${scoreLevel(percent)}" style="width:${percent}%"></i></span><b>${percent}%</b><small>${c.correct}/${c.total} benar</small></div>`;
    })
    .join("");
  return `<header><div><span>RINGKASAN KELAS</span><h4>${summary.days} hari terakhir</h4></div><small>${summary.quiz_count} tes oleh ${summary.student_count} siswa · rata-rata ${summary.avg_pct}%</small></header>${rows ? `<p class="monitor-class-note">Bagian soal, dari yang paling banyak salah:</p>${rows}` : ""}`;
}

/* Ringkasan semua siswa dihitung di server (pantau_ringkasan, lihat
   supabase/add-pantau-siswa.sql) - tidak lagi mengunduh seluruh baris
   progres tiap siswa ke browser. */
async function loadMonitorPanel() {
  monitorListEl.innerHTML = '<p class="muted">Memuat…</p>';
  // Tes yang ditinggal siswa sampai waktunya habis ditutup & dinilai dulu
  // (dari jawaban yang tersimpan sebelum tenggat), supaya nilainya tampil.
  try {
    await window.supabaseClient.rpc("finalize_all_expired_tests");
  } catch {
    // Gagal tidak fatal - nilai muncul saat siswa/Sensei membuka berikutnya.
  }
  const [{ data, error }, classResult] = await Promise.all([
    window.supabaseClient.rpc("pantau_ringkasan"),
    window.supabaseClient.rpc("pantau_kelas", { p_days: CLASS_SUMMARY_DAYS }),
  ]);
  monitorClassEl.innerHTML = classResult.error ? "" : classSummaryHtml(classResult.data);
  if (error) {
    // Jangan tampilkan angka nol - Sensei akan mengira progres siswa ter-reset.
    monitorListEl.innerHTML = `<p class="muted">Gagal memuat progres siswa: ${escapeHtml(error.message)}. Muat ulang halaman untuk mencoba lagi.</p>`;
    return;
  }
  monitorStudents = data || [];
  if (monitorStudents.length === 0) {
    monitorListEl.innerHTML = '<p class="muted">Belum ada siswa terdaftar.</p>';
    return;
  }
  renderMonitorList();
}

function attentionHtml(weakItems) {
  if (!weakItems.length) {
    return '<div class="monitor-all-clear"><span>✓</span><div><b>Tidak ada item yang perlu perhatian</b><small>Progres yang sudah direkam berada dalam kondisi baik.</small></div></div>';
  }
  const today = srsToday();
  return `<details class="monitor-attention"><summary><span><b>Perlu perhatian</b><small>Item yang sering diulang atau masih berada di box rendah.</small></span><strong>${weakItems.length} item</strong></summary><div class="monitor-weak-items">${weakItems
    .map((row) => {
      const due = !row.due || row.due <= today;
      return `<div class="monitor-weak-row${due ? " due" : ""}"><span>${escapeHtml(describeItemId(row.item_id))}</span><small>Box ${row.box} · ${row.reviews}× direview${due ? " · perlu diulang" : ""}</small></div>`;
    })
    .join("")}</div></details>`;
}

/* Angka ringkas dari pantau_ringkasan (sudah dimuat untuk kartu); item
   lemah & riwayat tes diambil terpisah lewat pantau_detail. */
function renderMonitorDetail(student) {
  monitorDetailName.textContent = student.full_name;
  monitorDetailId.textContent = displayLoginId(student.email);
  monitorDetailAvatar.textContent = (student.full_name || "S").trim().charAt(0).toUpperCase();
  const studiedTotal = CATEGORIES.reduce((sum, cat) => sum + student[`${cat.key}_studied`], 0);
  const categoryCards = CATEGORIES.map((cat) => {
    const due = student[`${cat.key}_due`];
    const mastered = student[`${cat.key}_mastered`];
    const total = student[`${cat.key}_studied`];
    const percentage = total ? Math.round((mastered / total) * 100) : 0;
    return `<article class="monitor-progress-card"><header><span class="monitor-progress-icon">${cat.icon}</span><div><b>${cat.label}</b><small>${mastered} dari ${total} dikuasai</small></div><strong>${percentage}%</strong></header><div class="monitor-progress-track"><i style="width:${percentage}%"></i></div><footer><span>${total} dipelajari</span><span class="${due ? "is-due" : ""}">${due ? `${due} perlu diulang` : "Tidak ada yang jatuh tempo"}</span></footer></article>`;
  }).join("");

  monitorDetailStats.innerHTML = `<div class="monitor-summary-grid"><article><span>XP</span><b>${student.xp.toLocaleString("id-ID")}</b><small>Total pengalaman</small></article><article><span>STREAK</span><b>${student.streak} hari</b><small>Konsistensi belajar</small></article><article><span>TES</span><b>${student.quiz_count} sesi</b><small>${student.quiz_avg === null ? "Tes diselesaikan" : `Rata-rata nilai ${student.quiz_avg}%`}</small></article><article><span>AKTIF</span><b>${formatActivityDate(student.last_active)}</b><small>${student.review_count.toLocaleString("id-ID")} aktivitas tercatat</small></article></div><section class="monitor-progress-overview"><header><div><span>PROGRES BELAJAR</span><h4>Penguasaan per kategori</h4></div><small>${studiedTotal.toLocaleString("id-ID")} item tersimpan</small></header><div class="monitor-progress-grid">${categoryCards}</div></section>`;
  monitorActivity.innerHTML = "";
  monitorAttentionSlot.innerHTML = '<p class="muted">Memuat…</p>';
  monitorLessonCount.textContent = "Memuat…";
  monitorLessons.innerHTML = "";
  monitorQuizCount.textContent = `${student.quiz_count} sesi`;
  monitorQuizList.innerHTML = '<p class="muted">Memuat…</p>';
  monitorResetHistory.innerHTML = "";
  monitorResetError.hidden = true;
  monitorResetBtn.disabled = false;
  monitorResetBtn.textContent = "Reset progres siswa ini";
  monitorAssignmentError.hidden = true;
  monitorAssignmentForm.reset();
  updateAssignmentFormMode();
  monitorLessonSection.open = false;
  monitorQuizSection.open = false;
  monitorAssignmentSection.open = false;
  monitorDangerSection.open = false;
  monitorAssignmentCount.textContent = "Memuat…";
  monitorDetailEl.hidden = false;
  document.body.classList.add("monitor-modal-open");
  monitorDetailClose.focus();
  loadStudentDetail(student.id);
  loadStudentAssignments(student.id);
}

async function loadStudentDetail(siswaId) {
  const { data, error } = await window.supabaseClient.rpc("pantau_detail", { p_siswa: siswaId });
  if (monitorSelectedId !== siswaId) return; // Sensei sudah membuka siswa lain.
  if (error) {
    const message = `<p class="muted">Gagal memuat detail: ${escapeHtml(error.message)}</p>`;
    monitorAttentionSlot.innerHTML = message;
    monitorLessons.innerHTML = message;
    monitorLessonCount.textContent = "Gagal dimuat";
    monitorQuizList.innerHTML = message;
    monitorResetHistory.innerHTML = message;
    return;
  }
  monitorActivity.innerHTML = activityHtml(data.weekly);
  monitorAttentionSlot.innerHTML = attentionHtml(data.weak_items);
  monitorLessons.innerHTML = lessonsHtml(data.lessons);
  monitorLessonCount.textContent = `${data.lessons.length} dari 100 dipelajari`;
  monitorQuizList.innerHTML = quizTrendHtml(data.quizzes) + quizHistoryHtml(data.quizzes);
  monitorResetHistory.innerHTML = resetHistoryHtml(data.resets);
}

/* Grafik batang ulasan per minggu (6 minggu, minggu ini paling kanan) -
   kelihatan apakah siswa belajar rutin atau hanya sesekali. */
function activityHtml(weekly) {
  const max = Math.max(1, ...weekly.map((w) => w.reviews));
  const total = weekly.reduce((sum, w) => sum + w.reviews, 0);
  const activeDays = weekly.reduce((sum, w) => sum + w.days, 0);
  const bars = weekly
    .map((w, i) => {
      const label = i === weekly.length - 1 ? "Minggu ini" : `${weekly.length - 1 - i} mgg lalu`;
      const height = Math.round((w.reviews / max) * 100);
      return `<div class="monitor-activity-bar" title="${label}: ${w.reviews} ulasan, ${w.days} hari aktif"><b>${w.reviews}</b><span><i style="height:${height}%"></i></span><small>${label}</small><small>${w.days}/7 hari</small></div>`;
    })
    .join("");
  return `<header><div><span>AKTIVITAS</span><h4>6 minggu terakhir</h4></div><small>${total.toLocaleString("id-ID")} ulasan · ${activeDays} dari 42 hari aktif</small></header><div class="monitor-activity-chart">${bars}</div>`;
}

const LESSON_GROUPS = [
  { kind: "materi", title: "Materi", unit: "Pel." },
  { kind: "hafalan", title: "Hafalan", unit: "Bab" },
];

function lessonLevel(lesson) {
  if (!lesson) return "none";
  const ratio = lesson.mastered / lesson.studied;
  return ratio >= 0.8 ? "high" : ratio >= 0.5 ? "mid" : "low";
}

/* Peta 50 pelajaran/bab: warna = porsi item yang dikuasai, abu-abu =
   belum dipelajari. Di bawahnya 3 yang paling lemah (minimal 3 item
   dipelajari supaya tidak menyorot yang baru dimulai). */
function lessonsHtml(lessons) {
  const groups = LESSON_GROUPS.map((group) => {
    const byNo = {};
    lessons.filter((l) => l.kind === group.kind).forEach((l) => (byNo[l.no] = l));
    const cells = Array.from({ length: 50 }, (_, i) => {
      const no = i + 1;
      const l = byNo[no];
      const title = l
        ? `${group.unit} ${no}: ${l.mastered} dari ${l.studied} dikuasai${l.due ? ` · ${l.due} perlu diulang` : ""}`
        : `${group.unit} ${no}: belum dipelajari`;
      return `<span class="monitor-lesson-cell level-${lessonLevel(l)}" title="${title}">${no}</span>`;
    }).join("");
    return `<div class="monitor-lesson-group"><b>${group.title}</b><div class="monitor-lesson-grid">${cells}</div></div>`;
  }).join("");
  const unitOf = (kind) => LESSON_GROUPS.find((g) => g.kind === kind).unit;
  const weakest = lessons
    .filter((l) => l.studied >= 3 && lessonLevel(l) !== "high")
    .sort((a, b) => a.mastered / a.studied - b.mastered / b.studied || b.due - a.due)
    .slice(0, 3);
  const weakHtml = weakest.length
    ? `<p class="monitor-lesson-weak">Paling lemah: ${weakest
        .map((l) => `<b>${unitOf(l.kind)} ${l.no}</b> (${Math.round((l.mastered / l.studied) * 100)}% dikuasai)`)
        .join(", ")}</p>`
    : "";
  return `${groups}<p class="monitor-lesson-legend"><span class="monitor-lesson-cell level-high"></span>≥80% dikuasai <span class="monitor-lesson-cell level-mid"></span>50–79% <span class="monitor-lesson-cell level-low"></span>&lt;50% <span class="monitor-lesson-cell level-none"></span>belum dipelajari</p>${weakHtml}`;
}

/* Riwayat reset (siapa & kapan) + tombol pulihkan dari cadangan. */
function resetHistoryHtml(resets) {
  if (!resets.length) return '<p class="muted">Belum pernah direset.</p>';
  return `<b>Riwayat reset</b>${resets
    .map((r) => {
      const who = escapeHtml(r.reset_by_name || "akun yang sudah dihapus");
      const status = r.restored_at
        ? `<small>Dipulihkan ${formatQuizDate(r.restored_at)} oleh ${escapeHtml(r.restored_by_name || "akun yang sudah dihapus")}</small>`
        : `<button type="button" class="secondary monitor-restore-btn" data-reset-id="${r.id}">Pulihkan</button>`;
      return `<div class="monitor-reset-row"><div><span>${formatQuizDate(r.reset_at)} · oleh ${who}</span><small>${r.item_count.toLocaleString("id-ID")} item dicadangkan</small></div>${status}</div>`;
    })
    .join("")}`;
}

function describeTestAccess(task) {
  if (task.test_kind === "paket") {
    const pkg = packageInfo(task.test_ref);
    return { tag: `Akses tes · ${escapeHtml(pkg.mark)}`, limitText: `Batas waktu ${pkg.time_limit_minutes} menit` };
  }
  if (task.test_kind === "bab") {
    const start = Number(task.test_ref);
    return {
      tag: `Akses tes · Bab ${start}–${start + 4}`,
      limitText: "Batas waktu 45 menit",
    };
  }
  return null;
}

// Relasi 1-1 assignments -> assignment_submissions bisa datang sebagai
// objek atau array tergantung versi PostgREST - samakan jadi objek/null.
function firstSubmission(task) {
  const sub = task.assignment_submissions;
  return Array.isArray(sub) ? sub[0] || null : sub || null;
}

async function signedFileUrls(paths) {
  if (!paths.length) return {};
  const { data, error } = await window.supabaseClient.storage.from("assignment-files").createSignedUrls(paths, 3600);
  if (error || !data) return {};
  return Object.fromEntries(data.filter((row) => row.signedUrl).map((row) => [row.path, row.signedUrl]));
}

/* Kiriman siswa untuk satu tugas umum + form nilai (0-100) & komentar.
   Nilai bisa diubah lagi setelah disimpan. */
function submissionHtml(sub, urls) {
  const url = sub.file_path && urls[sub.file_path];
  const fileName = escapeHtml(sub.file_name || "Lampiran");
  const fileHtml = sub.file_path
    ? url
      ? `<a class="monitor-submission-file" href="${escapeHtml(url)}" target="_blank" rel="noopener">📎 ${fileName}</a>`
      : `<span class="monitor-submission-file">📎 ${fileName} (gagal memuat tautan)</span>`
    : "";
  const status = sub.graded_at ? `Dinilai ${formatQuizDate(sub.graded_at)}` : "Belum dinilai";
  const scoreValue = sub.score == null ? "" : sub.score;
  return `<div class="monitor-submission"><small>Dikirim ${formatQuizDate(sub.submitted_at)} · ${status}</small>${sub.answer_text ? `<p class="monitor-submission-answer">${escapeHtml(sub.answer_text)}</p>` : ""}${fileHtml}<form class="monitor-grade-form" data-id="${sub.id}"${sub.graded_at ? "" : " data-ungraded"}><label>Nilai<input type="number" name="score" min="0" max="100" step="1" required value="${scoreValue}"></label><label>Komentar<textarea name="feedback" rows="2" maxlength="2000" placeholder="Masukan untuk siswa (opsional)">${escapeHtml(sub.feedback || "")}</textarea></label><button type="submit" class="secondary">${sub.graded_at ? "Ubah nilai" : "Simpan nilai"}</button><p class="login-error" hidden></p></form></div>`;
}

async function loadStudentAssignments(siswaId) {
  monitorAssignmentList.innerHTML = '<p class="muted">Memuat tugas…</p>';
  monitorAssignmentCount.textContent = "Memuat…";
  const { data, error } = await window.supabaseClient
    .from("assignments")
    .select(
      "id, title, due_date, completed, test_kind, test_ref, assignment_submissions(id, answer_text, file_path, file_name, submitted_at, score, feedback, graded_at)",
    )
    .eq("siswa_id", siswaId)
    .order("completed", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false });
  if (error) {
    monitorAssignmentList.innerHTML = `<p class="muted">Gagal memuat tugas: ${error.message}</p>`;
    monitorAssignmentCount.textContent = "Gagal dimuat";
    return;
  }
  if (!data || data.length === 0) {
    monitorAssignmentList.innerHTML = '<p class="muted">Belum ada tugas.</p>';
    monitorAssignmentCount.textContent = "0 tugas";
    return;
  }
  const activeCount = data.filter((task) => !task.completed).length;
  const ungradedCount = data.filter((task) => {
    const sub = firstSubmission(task);
    return sub && !sub.graded_at;
  }).length;
  monitorAssignmentCount.textContent = `${activeCount} aktif · ${data.length} total${ungradedCount ? ` · ${ungradedCount} perlu dinilai` : ""}`;
  const urls = await signedFileUrls(
    data.map(firstSubmission).filter((sub) => sub && sub.file_path).map((sub) => sub.file_path),
  );
  monitorAssignmentList.innerHTML = data
    .map((task) => {
      const dueText = task.due_date ? `Tenggat ${task.due_date}` : "Tanpa tenggat";
      const statusClass = task.completed ? "assignment-done" : "assignment-pending";
      const access = describeTestAccess(task);
      const tagHtml = access ? `<span class="assignment-type-tag">${access.tag}</span>` : "";
      const sub = firstSubmission(task);
      const generalStatus = sub
        ? sub.graded_at
          ? `Nilai ${sub.score}`
          : "Sudah dikirim, perlu dinilai"
        : task.completed
          ? "Selesai"
          : "Belum dikirim";
      const detailText = access
        ? `${dueText} · ${access.limitText} · ${task.completed ? "Selesai" : "Belum dikerjakan"}`
        : `${dueText} · ${generalStatus}`;
      const rowClass = sub && !sub.graded_at ? "assignment-needs-grading" : statusClass;
      return `<div class="monitor-assignment-row ${rowClass}"><div><b>${escapeHtml(task.title)}</b>${tagHtml}<small>${detailText}</small></div><button type="button" class="monitor-assignment-delete" data-id="${task.id}"${sub && sub.file_path ? ` data-file="${escapeHtml(sub.file_path)}"` : ""}>Hapus</button>${sub ? submissionHtml(sub, urls) : ""}</div>`;
    })
    .join("");
}

monitorListEl.addEventListener("click", (event) => {
  const card = event.target.closest(".monitor-card");
  if (!card) return;
  monitorSelectedId = card.dataset.id;
  const student = monitorStudents.find((s) => s.id === monitorSelectedId);
  if (student) renderMonitorDetail(student);
});

function closeMonitorDetail() {
  monitorDetailEl.hidden = true;
  monitorSelectedId = null;
  document.body.classList.remove("monitor-modal-open");
}

monitorDetailClose.addEventListener("click", closeMonitorDetail);

monitorDetailEl.addEventListener("click", (event) => {
  if (event.target === monitorDetailEl) closeMonitorDetail();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !monitorDetailEl.hidden) closeMonitorDetail();
});

monitorResetBtn.addEventListener("click", async () => {
  const student = monitorStudents.find((s) => s.id === monitorSelectedId);
  if (!student) return;
  const confirmed = confirm(
    `Reset seluruh progres belajar "${student.full_name}"? Status kanji/materi/hafalan kembali ke nol. Progres lama disimpan sebagai cadangan dan bisa dipulihkan dari riwayat reset.`,
  );
  if (!confirmed) return;

  monitorResetError.hidden = true;
  monitorResetBtn.disabled = true;
  monitorResetBtn.textContent = "Mereset…";
  const { error } = await window.supabaseClient.rpc("reset_student_progress", { p_siswa: student.id });
  if (error) {
    monitorResetError.textContent = `Gagal reset: ${error.message}`;
    monitorResetError.hidden = false;
    monitorResetBtn.disabled = false;
    monitorResetBtn.textContent = "Reset progres siswa ini";
    return;
  }
  await refreshSelectedStudent(student.id);
});

monitorResetHistory.addEventListener("click", async (event) => {
  const button = event.target.closest(".monitor-restore-btn");
  if (!button) return;
  const studentId = monitorSelectedId;
  if (!confirm("Pulihkan progres dari cadangan ini? Item yang sudah dipelajari lagi setelah reset tetap memakai progres terbarunya.")) return;
  button.disabled = true;
  button.textContent = "Memulihkan…";
  const { error } = await window.supabaseClient.rpc("restore_student_progress", { p_reset_id: Number(button.dataset.resetId) });
  if (error) {
    monitorResetError.textContent = `Gagal memulihkan: ${error.message}`;
    monitorResetError.hidden = false;
    button.disabled = false;
    button.textContent = "Pulihkan";
    return;
  }
  await refreshSelectedStudent(studentId);
});

// Muat ulang ringkasan semua siswa, lalu buka lagi detail siswa yang sama.
async function refreshSelectedStudent(studentId) {
  await loadMonitorPanel();
  const refreshed = monitorStudents.find((s) => s.id === studentId);
  if (refreshed) {
    monitorSelectedId = studentId;
    renderMonitorDetail(refreshed);
    monitorDangerSection.open = true;
  } else {
    closeMonitorDetail();
  }
}

monitorAssignmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const student = monitorStudents.find((s) => s.id === monitorSelectedId);
  if (!student) return;
  const dueDate = document.getElementById("monitorAssignmentDue").value || null;
  const type = currentAssignmentType();
  monitorAssignmentError.hidden = true;

  let title, testKind, testRef;
  if (type === "bab") {
    const start = Number(monitorAssignmentBab.value);
    testKind = "bab";
    testRef = String(start);
    title = `Latihan per 5 Bab · Bab ${start}–${start + 4}`;
  } else if (type === "paket") {
    testKind = "paket";
    testRef = monitorAssignmentPaket.value;
    if (!testRef) {
      monitorAssignmentError.textContent = "Pilih paket ujian terlebih dahulu.";
      monitorAssignmentError.hidden = false;
      return;
    }
    title = `Simulasi Paket · ${packageInfo(testRef).label}`;
  } else {
    testKind = null;
    testRef = null;
    title = monitorAssignmentTitle.value.trim();
  }

  const { error } = await window.supabaseClient.from("assignments").insert({
    sensei_id: window.currentProfile.id,
    siswa_id: student.id,
    title,
    due_date: dueDate,
    test_kind: testKind,
    test_ref: testRef,
  });
  if (error) {
    monitorAssignmentError.textContent = `Gagal memberi tugas: ${error.message}`;
    monitorAssignmentError.hidden = false;
    return;
  }
  monitorAssignmentForm.reset();
  updateAssignmentFormMode();
  loadStudentAssignments(student.id);
});

monitorAssignmentList.addEventListener("click", async (event) => {
  const button = event.target.closest(".monitor-assignment-delete");
  if (!button) return;
  const confirmed = confirm("Hapus tugas ini? Kiriman siswa untuk tugas ini (kalau ada) ikut terhapus.");
  if (!confirmed) return;
  const { error } = await window.supabaseClient
    .from("assignments")
    .delete()
    .eq("id", button.dataset.id);
  if (error) {
    alert(`Gagal menghapus tugas: ${error.message}`);
    return;
  }
  // Kiriman ikut terhapus (on delete cascade); lampirannya dibersihkan dari
  // Storage di sini - gagal tidak fatal, cuma menyisakan file.
  if (button.dataset.file) window.supabaseClient.storage.from("assignment-files").remove([button.dataset.file]);
  const student = monitorStudents.find((s) => s.id === monitorSelectedId);
  if (student) loadStudentAssignments(student.id);
});

monitorAssignmentList.addEventListener("submit", async (event) => {
  const form = event.target.closest(".monitor-grade-form");
  if (!form) return;
  event.preventDefault();
  const errorEl = form.querySelector(".login-error");
  const button = form.querySelector('button[type="submit"]');
  errorEl.hidden = true;
  button.disabled = true;
  button.textContent = "Menyimpan…";
  const { error } = await window.supabaseClient.rpc("grade_submission", {
    p_submission_id: Number(form.dataset.id),
    p_score: Number(form.elements.score.value),
    p_feedback: form.elements.feedback.value,
  });
  if (error) {
    errorEl.textContent = `Gagal menyimpan nilai: ${error.message}`;
    errorEl.hidden = false;
    button.disabled = false;
    button.textContent = "Simpan nilai";
    return;
  }
  if (!monitorSelectedId) return;
  // Perbarui label "perlu dinilai" di kartu siswa tanpa memuat ulang semua.
  const student = monitorStudents.find((s) => s.id === monitorSelectedId);
  if (student && form.hasAttribute("data-ungraded")) {
    student.ungraded = Math.max(0, student.ungraded - 1);
    renderMonitorList();
  }
  loadStudentAssignments(monitorSelectedId);
});

window.loadMonitorPanel = loadMonitorPanel;

loadTestPackages();
loadMonitorPanel();
}
window.initPage = initPage;
