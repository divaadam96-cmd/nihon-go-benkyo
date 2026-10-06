/* Halaman Pantau Siswa (pages/pantau.html, khusus Sensei & Operator):
   daftar semua Siswa + ringkasan progres SRS mereka (dibaca langsung dari
   Supabase, bukan localStorage - ini progres milik user LAIN), dan opsi
   reset progres per siswa serta pemberian tugas. Dulu monitor.js (dimuat
   setelah admin.js untuk pakai escapeHtml-nya) - escapeHtml sekarang
   fungsi bersama (window.escapeHtml, lihat js/app-shell.js) karena
   dashboard (assignments.js) juga memakainya. displayLoginId tetap
   disalin di sini karena cuma dipakai halaman Sensei/Operator (di sini
   dan admin.js). Dibungkus initPage(), dijalankan auth.js setelah login -
   loadMonitorPanel() langsung dipanggil di akhir karena seluruh halaman
   ini memang panel itu (tidak perlu menunggu trigger "view aktif" seperti
   dulu). */
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
const monitorDetailEl = document.getElementById("monitorDetail");
const monitorDetailName = document.getElementById("monitorDetailName");
const monitorDetailId = document.getElementById("monitorDetailId");
const monitorDetailAvatar = document.getElementById("monitorDetailAvatar");
const monitorDetailStats = document.getElementById("monitorDetailStats");
const monitorAttentionSlot = document.getElementById("monitorAttentionSlot");
const monitorQuizSection = document.getElementById("monitorQuizSection");
const monitorQuizCount = document.getElementById("monitorQuizCount");
const monitorQuizList = document.getElementById("monitorQuizList");
const monitorResetBtn = document.getElementById("monitorResetBtn");
const monitorResetError = document.getElementById("monitorResetError");
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
// Jumlah kiriman tugas yang belum dinilai per siswa (siswa_id -> jumlah).
let ungradedBySiswa = {};

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

function remoteDueCount(progressRows, prefix) {
  const today = srsToday();
  return progressRows.filter(
    (row) => row.item_id.startsWith(prefix) && row.reviews && (!row.due || row.due <= today),
  ).length;
}

function remoteMasteredCount(progressRows, prefix) {
  return progressRows.filter((row) => row.item_id.startsWith(prefix) && row.box >= SRS_MASTERED_BOX)
    .length;
}

function remoteStreak(activityRows) {
  const log = {};
  activityRows.forEach((row) => {
    log[row.activity_date] = row.count;
  });
  let streak = 0;
  const cursor = new Date();
  if (!log[cursor.toISOString().slice(0, 10)]) cursor.setDate(cursor.getDate() - 1);
  while (log[cursor.toISOString().slice(0, 10)]) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function remoteLastActive(activityRows) {
  if (!activityRows.length) return null;
  return activityRows.map((row) => row.activity_date).sort().pop();
}

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

function quizAveragePercent(quizRows) {
  if (!quizRows.length) return null;
  const sum = quizRows.reduce((total, row) => total + quizScorePercent(row), 0);
  return Math.round(sum / quizRows.length);
}

/* Rincian nilai per sesi tes untuk Sensei/Operator: skor keseluruhan lalu
   bagian (kategori soal, lihat categoryScores() di js/pages/latihan.js)
   yang masih banyak salah, diurutkan dari sesi terbaru. */
function quizHistoryHtml(quizRows) {
  if (!quizRows.length) {
    return '<p class="muted">Belum ada tes yang dikerjakan.</p>';
  }
  const sorted = quizRows.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return sorted
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

/* XP siswa dihitung dengan formula sama seperti totalXp() di app.js:
   5 XP per aksi review SRS (semua kategori, activity_log) + XP dari
   riwayat quiz_results - dibaca langsung dari Supabase (bukan
   localStorage perangkat ini), supaya Sensei/Operator bisa memantau. */
function remoteXp(activityRows, quizRows) {
  const reviewXp = activityRows.reduce((sum, row) => sum + (row.count || 0), 0) * 5;
  const quizXp = typeof window.quizXpFromRows === "function" ? window.quizXpFromRows(quizRows) : 0;
  return reviewXp + quizXp;
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

/* Item yang paling lemah: sudah pernah direview tapi box-nya masih
   rendah (sering salah/perlu diulang) - diurutkan box naik lalu jumlah
   review turun (paling sering dicoba tapi belum maju, paling perlu
   dibantu Sensei duluan). */
function weakestItems(progressRows, limit = 6) {
  return progressRows
    .filter((row) => row.reviews > 0)
    .slice()
    .sort((a, b) => a.box - b.box || b.reviews - a.reviews)
    .slice(0, limit);
}

async function loadMonitorPanel() {
  monitorListEl.innerHTML = '<p class="muted">Memuat…</p>';
  const { data: students, error } = await window.supabaseClient
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "siswa")
    .order("full_name", { ascending: true });
  if (error) {
    monitorListEl.innerHTML = `<p class="muted">Gagal memuat daftar siswa: ${error.message}</p>`;
    return;
  }
  if (!students || students.length === 0) {
    monitorListEl.innerHTML = '<p class="muted">Belum ada siswa terdaftar.</p>';
    return;
  }

  // Tes yang ditinggal siswa sampai waktunya habis ditutup & dinilai dulu
  // (dari jawaban yang tersimpan sebelum tenggat), supaya nilainya tampil.
  try {
    await window.supabaseClient.rpc("finalize_all_expired_tests");
  } catch {
    // Gagal tidak fatal - nilai muncul saat siswa/Sensei membuka berikutnya.
  }
  const ungradedRequest = window.supabaseClient
    .from("assignment_submissions")
    .select("siswa_id")
    .is("graded_at", null);
  const [remoteData, quizData, ungradedResult] = await Promise.all([
    Promise.all(students.map((s) => srsFetchRemoteFor(s.id))),
    Promise.all(
      students.map((s) => (typeof window.quizFetchRemoteFor === "function" ? window.quizFetchRemoteFor(s.id) : [])),
    ),
    ungradedRequest,
  ]);
  ungradedBySiswa = {};
  (ungradedResult.data || []).forEach((row) => {
    ungradedBySiswa[row.siswa_id] = (ungradedBySiswa[row.siswa_id] || 0) + 1;
  });
  monitorStudents = students.map((student, i) => ({
    ...student,
    remote: remoteData[i],
    quiz: quizData[i],
  }));

  monitorListEl.innerHTML = monitorStudents
    .map((student) => {
      const due =
        remoteDueCount(student.remote.progress, "kanji:") +
        remoteDueCount(student.remote.progress, "materi:") +
        remoteDueCount(student.remote.progress, "hafalan:");
      const streak = remoteStreak(student.remote.activity);
      const lastActive = remoteLastActive(student.remote.activity);
      const xp = remoteXp(student.remote.activity, student.quiz);
      const ungraded = ungradedBySiswa[student.id] || 0;
      const ungradedHtml = ungraded ? `<span class="monitor-card-ungraded">${ungraded} tugas perlu dinilai</span>` : "";
      return `<button type="button" class="monitor-card" data-id="${student.id}"><b>${escapeHtml(student.full_name)}</b><small>${escapeHtml(displayLoginId(student.email))}</small><div class="monitor-card-stats">${ungradedHtml}<span>${streak} hari streak</span><span>${due} due</span><span>${xp.toLocaleString("id-ID")} XP</span><span>${lastActive ? "Terakhir " + lastActive : "Belum pernah belajar"}</span></div></button>`;
    })
    .join("");
}

function renderMonitorDetail(student) {
  monitorDetailName.textContent = student.full_name;
  monitorDetailId.textContent = displayLoginId(student.email);
  monitorDetailAvatar.textContent = (student.full_name || "S").trim().charAt(0).toUpperCase();
  const categories = [
    { prefix: "kanji:", label: "Kanji", icon: "漢" },
    { prefix: "materi:", label: "Materi", icon: "文" },
    { prefix: "hafalan:", label: "Hafalan", icon: "語" },
  ];
  const xp = remoteXp(student.remote.activity, student.quiz);
  const quizCount = student.quiz.length;
  const quizAvg = quizAveragePercent(student.quiz);
  const streak = remoteStreak(student.remote.activity);
  const lastActive = remoteLastActive(student.remote.activity);
  const reviewCount = student.remote.activity.reduce((sum, row) => sum + (row.count || 0), 0);
  const categoryCards = categories
    .map((cat) => {
      const due = remoteDueCount(student.remote.progress, cat.prefix);
      const mastered = remoteMasteredCount(student.remote.progress, cat.prefix);
      const total = student.remote.progress.filter((row) => row.item_id.startsWith(cat.prefix)).length;
      const percentage = total ? Math.round((mastered / total) * 100) : 0;
      return `<article class="monitor-progress-card"><header><span class="monitor-progress-icon">${cat.icon}</span><div><b>${cat.label}</b><small>${mastered} dari ${total} dikuasai</small></div><strong>${percentage}%</strong></header><div class="monitor-progress-track"><i style="width:${percentage}%"></i></div><footer><span>${total} dipelajari</span><span class="${due ? "is-due" : ""}">${due ? `${due} perlu diulang` : "Tidak ada yang jatuh tempo"}</span></footer></article>`;
    })
    .join("");
  const today = srsToday();
  const weakRows = weakestItems(student.remote.progress);
  const attentionHtml = weakRows.length
    ? `<details class="monitor-attention"><summary><span><b>Perlu perhatian</b><small>Item yang sering diulang atau masih berada di box rendah.</small></span><strong>${weakRows.length} item</strong></summary><div class="monitor-weak-items">${weakRows
        .map((row) => {
          const due = !row.due || row.due <= today;
          return `<div class="monitor-weak-row${due ? " due" : ""}"><span>${escapeHtml(describeItemId(row.item_id))}</span><small>Box ${row.box} · ${row.reviews}× direview${due ? " · perlu diulang" : ""}</small></div>`;
        })
        .join("")}</div></details>`
    : '<div class="monitor-all-clear"><span>✓</span><div><b>Tidak ada item yang perlu perhatian</b><small>Progres yang sudah direkam berada dalam kondisi baik.</small></div></div>';

  monitorDetailStats.innerHTML = `<div class="monitor-summary-grid"><article><span>XP</span><b>${xp.toLocaleString("id-ID")}</b><small>Total pengalaman</small></article><article><span>STREAK</span><b>${streak} hari</b><small>Konsistensi belajar</small></article><article><span>TES</span><b>${quizCount} sesi</b><small>${quizAvg === null ? "Tes diselesaikan" : `Rata-rata nilai ${quizAvg}%`}</small></article><article><span>AKTIF</span><b>${formatActivityDate(lastActive)}</b><small>${reviewCount.toLocaleString("id-ID")} aktivitas tercatat</small></article></div><section class="monitor-progress-overview"><header><div><span>PROGRES BELAJAR</span><h4>Penguasaan per kategori</h4></div><small>${student.remote.progress.length} item tersimpan</small></header><div class="monitor-progress-grid">${categoryCards}</div></section>`;
  monitorAttentionSlot.innerHTML = attentionHtml;
  monitorQuizCount.textContent = `${quizCount} sesi`;
  monitorQuizList.innerHTML = quizHistoryHtml(student.quiz);
  monitorResetError.hidden = true;
  monitorResetBtn.disabled = false;
  monitorResetBtn.textContent = "Reset progres siswa ini";
  monitorAssignmentError.hidden = true;
  monitorAssignmentForm.reset();
  updateAssignmentFormMode();
  monitorQuizSection.open = false;
  monitorAssignmentSection.open = false;
  monitorDangerSection.open = false;
  monitorAssignmentCount.textContent = "Memuat…";
  monitorDetailEl.hidden = false;
  document.body.classList.add("monitor-modal-open");
  monitorDetailClose.focus();
  loadStudentAssignments(student.id);
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
    `Reset seluruh progres belajar "${student.full_name}"? Semua status kuasa kanji/materi/hafalan akan kembali ke nol. Aksi ini tidak bisa dibatalkan.`,
  );
  if (!confirmed) return;

  monitorResetError.hidden = true;
  monitorResetBtn.disabled = true;
  monitorResetBtn.textContent = "Mereset…";
  const { error } = await window.supabaseClient.from("srs_progress").delete().eq("user_id", student.id);
  if (error) {
    monitorResetError.textContent = `Gagal reset: ${error.message}`;
    monitorResetError.hidden = false;
    monitorResetBtn.disabled = false;
    monitorResetBtn.textContent = "Reset progres siswa ini";
    return;
  }
  student.remote = await srsFetchRemoteFor(student.id);
  renderMonitorDetail(student);
  await loadMonitorPanel();
});

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
  if (form.hasAttribute("data-ungraded")) {
    const remaining = Math.max(0, (ungradedBySiswa[monitorSelectedId] || 0) - 1);
    ungradedBySiswa[monitorSelectedId] = remaining;
    const badge = monitorListEl.querySelector(`.monitor-card[data-id="${monitorSelectedId}"] .monitor-card-ungraded`);
    if (badge && remaining) badge.textContent = `${remaining} tugas perlu dinilai`;
    else if (badge) badge.remove();
  }
  loadStudentAssignments(monitorSelectedId);
});

window.loadMonitorPanel = loadMonitorPanel;

loadTestPackages();
loadMonitorPanel();
}
window.initPage = initPage;
