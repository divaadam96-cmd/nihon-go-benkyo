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
  const { data, error } = await window.supabaseClient.rpc("pantau_ringkasan");
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
  monitorListEl.innerHTML = monitorStudents
    .map((student) => {
      const ungradedHtml = student.ungraded
        ? `<span class="monitor-card-ungraded">${student.ungraded} tugas perlu dinilai</span>`
        : "";
      return `<button type="button" class="monitor-card" data-id="${student.id}"><b>${escapeHtml(student.full_name)}</b><small>${escapeHtml(displayLoginId(student.email))}</small><div class="monitor-card-stats">${ungradedHtml}<span>${student.streak} hari streak</span><span>${totalDue(student)} due</span><span>${student.xp.toLocaleString("id-ID")} XP</span><span>${student.last_active ? "Terakhir " + student.last_active : "Belum pernah belajar"}</span></div></button>`;
    })
    .join("");
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
  monitorAttentionSlot.innerHTML = '<p class="muted">Memuat…</p>';
  monitorQuizCount.textContent = `${student.quiz_count} sesi`;
  monitorQuizList.innerHTML = '<p class="muted">Memuat…</p>';
  monitorResetHistory.innerHTML = "";
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
  loadStudentDetail(student.id);
  loadStudentAssignments(student.id);
}

async function loadStudentDetail(siswaId) {
  const { data, error } = await window.supabaseClient.rpc("pantau_detail", { p_siswa: siswaId });
  if (monitorSelectedId !== siswaId) return; // Sensei sudah membuka siswa lain.
  if (error) {
    const message = `<p class="muted">Gagal memuat detail: ${escapeHtml(error.message)}</p>`;
    monitorAttentionSlot.innerHTML = message;
    monitorQuizList.innerHTML = message;
    monitorResetHistory.innerHTML = message;
    return;
  }
  monitorAttentionSlot.innerHTML = attentionHtml(data.weak_items);
  monitorQuizList.innerHTML = quizHistoryHtml(data.quizzes);
  monitorResetHistory.innerHTML = resetHistoryHtml(data.resets);
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
    const remaining = Math.max(0, student.ungraded - 1);
    student.ungraded = remaining;
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
