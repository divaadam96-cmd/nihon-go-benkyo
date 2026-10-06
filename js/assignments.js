/* Dashboard Siswa: daftar "Tugas dari Sensei" + banner pengingat belajar
   harian. Dimuat setelah app-shell.js (escapeHtml) dan srs.js (srsTodayCount,
   srsStreak). Dipanggil dari js/pages/dashboard.js (renderDashboardActivity)
   setiap kali dashboard dibuka/di-refresh. */

const studyReminderBanner = document.getElementById("studyReminderBanner");
const studyReminderText = document.getElementById("studyReminderText");
const studyReminderEnableBtn = document.getElementById("studyReminderEnableBtn");
const assignmentsCard = document.getElementById("assignmentsCard");
const assignmentsList = document.getElementById("assignmentsList");

function loadStudyReminder() {
  if (!studyReminderBanner || !window.currentProfile) return;
  if (srsTodayCount() > 0) {
    studyReminderBanner.hidden = true;
    return;
  }
  studyReminderText.textContent = `Kamu belum belajar hari ini. Streak kamu ${srsStreak()} hari — jangan sampai putus!`;
  studyReminderBanner.hidden = false;

  if (window.Notification && Notification.permission === "granted") {
    studyReminderEnableBtn.hidden = true;
    if (!sessionStorage.getItem("studyReminderShownToday")) {
      new Notification("Nihon GO Benkyo", {
        body: "Kamu belum belajar hari ini. Yuk sisihkan beberapa menit!",
        icon: "assets/icons/icon-192.png",
      });
      sessionStorage.setItem("studyReminderShownToday", "1");
    }
  } else if (window.Notification && Notification.permission !== "denied") {
    studyReminderEnableBtn.hidden = false;
  } else {
    studyReminderEnableBtn.hidden = true;
  }
}

if (studyReminderEnableBtn) {
  studyReminderEnableBtn.addEventListener("click", async () => {
    if (!window.Notification) return;
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      studyReminderEnableBtn.hidden = true;
      new Notification("Nihon GO Benkyo", {
        body: "Pengingat belajar aktif. Kami akan mengingatkanmu saat kamu belum belajar hari ini.",
        icon: "assets/icons/icon-192.png",
      });
    }
  });
}

/* Kiriman tugas umum (lihat supabase/add-assignment-submissions.sql): file
   diunggah langsung dari browser ke bucket Storage private, lalu dicatat
   lewat RPC submit_assignment(). Batas ukuran & jenis file sama dengan
   pengaturan bucket - dicek di sini dulu supaya pesan errornya jelas. */
const SUBMISSION_BUCKET = "assignment-files";
const SUBMISSION_MAX_BYTES = 5 * 1024 * 1024;
const SUBMISSION_TYPES = [
  "image/jpeg", "image/png", "image/webp",
  "application/pdf",
  "audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/webm", "audio/ogg", "audio/wav", "audio/x-wav",
];
let siswaAssignmentsById = new Map();

function formatSubmissionDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Relasi 1-1 assignments -> assignment_submissions bisa datang sebagai
// objek atau array tergantung versi PostgREST - samakan jadi objek/null.
function firstSubmission(task) {
  const sub = task.assignment_submissions;
  return Array.isArray(sub) ? sub[0] || null : sub || null;
}

async function signedFileUrls(paths) {
  if (!paths.length) return {};
  const { data, error } = await window.supabaseClient.storage.from(SUBMISSION_BUCKET).createSignedUrls(paths, 3600);
  if (error || !data) return {};
  return Object.fromEntries(data.filter((row) => row.signedUrl).map((row) => [row.path, row.signedUrl]));
}

function submissionFileLink(sub, urls) {
  if (!sub.file_path) return "";
  const name = escapeHtml(sub.file_name || "Lampiran");
  const url = urls[sub.file_path];
  return url
    ? `<a class="assignment-file-link" href="${escapeHtml(url)}" target="_blank" rel="noopener">📎 ${name}</a>`
    : `<span class="assignment-file-link">📎 ${name}</span>`;
}

function submissionFormHtml(task, sub) {
  return `<form class="assignment-submit-form" data-id="${task.id}" hidden><label>Jawaban<textarea name="answer" rows="4" maxlength="5000" placeholder="Tulis jawaban atau catatan untuk Sensei…">${sub ? escapeHtml(sub.answer_text || "") : ""}</textarea></label><label>Lampiran (opsional · foto, PDF, atau audio · maks 5 MB)<input type="file" name="file" accept="${SUBMISSION_TYPES.join(",")}"></label>${sub && sub.file_path ? `<small>File sekarang: ${escapeHtml(sub.file_name || "lampiran")} — pilih file baru untuk menggantinya.</small>` : ""}<p class="login-error" hidden></p><div class="assignment-submit-actions"><button type="button" class="assignment-cancel-btn">Batal</button><button type="submit" class="assignment-test-btn">Kirim</button></div></form>`;
}

function generalTaskHtml(task, dueText, urls) {
  const sub = firstSubmission(task);
  let actionButton;
  let detailHtml = "";
  if (sub && sub.graded_at) {
    actionButton = `<span class="assignment-done-label">Nilai ${sub.score}</span>`;
    detailHtml = `<div class="assignment-submission"><small>Dikirim ${formatSubmissionDate(sub.submitted_at)}</small>${submissionFileLink(sub, urls)}${sub.feedback ? `<p class="assignment-feedback"><b>Komentar Sensei</b>${escapeHtml(sub.feedback)}</p>` : ""}</div>`;
  } else if (sub) {
    actionButton = '<button type="button" class="assignment-done-btn assignment-open-form">Ubah kiriman</button>';
    detailHtml = `<div class="assignment-submission"><small>Dikirim ${formatSubmissionDate(sub.submitted_at)} · menunggu nilai Sensei</small>${submissionFileLink(sub, urls)}</div>`;
  } else if (task.completed) {
    // Tugas lama yang ditandai selesai sebelum ada fitur kirim tugas.
    actionButton = '<span class="assignment-done-label">Selesai</span>';
  } else {
    actionButton = '<button type="button" class="assignment-test-btn assignment-open-form">Kirim tugas</button>';
  }
  const form = sub && sub.graded_at ? "" : submissionFormHtml(task, sub);
  return `<div class="assignment-row"><div><b>${escapeHtml(task.title)}</b><small>${dueText}</small></div>${actionButton}${detailHtml}${form}</div>`;
}

async function loadSiswaAssignments() {
  if (!assignmentsCard || !window.currentProfile || window.currentProfile.role !== "siswa") return;
  assignmentsList.innerHTML = '<p class="muted">Memuat…</p>';
  // Akses tes yang waktunya habis (tes ditinggal) ditutup & dinilai dulu.
  try {
    await window.supabaseClient.rpc("finalize_my_expired_tests");
  } catch {
    // Tidak fatal.
  }
  const { data, error } = await window.supabaseClient
    .from("assignments")
    .select(
      "id, title, due_date, completed, test_kind, test_ref, assignment_submissions(id, answer_text, file_path, file_name, file_type, submitted_at, score, feedback, graded_at)",
    )
    .eq("siswa_id", window.currentProfile.id)
    .order("completed", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false });
  if (error) {
    assignmentsList.innerHTML = `<p class="muted">Gagal memuat tugas: ${error.message}</p>`;
    return;
  }
  if (!data || data.length === 0) {
    assignmentsList.innerHTML = '<p class="muted">Belum ada tugas dari Sensei.</p>';
    return;
  }
  siswaAssignmentsById = new Map(data.map((task) => [String(task.id), task]));
  const urls = await signedFileUrls(
    data.map(firstSubmission).filter((sub) => sub && sub.file_path).map((sub) => sub.file_path),
  );
  assignmentsList.innerHTML = data
    .map((task) => {
      const dueText = task.due_date ? `Tenggat ${task.due_date}` : "Tanpa tenggat";
      if (!task.test_kind) return generalTaskHtml(task, dueText, urls);
      // Akses tes kemampuan tidak bisa dikirim/ditandai selesai secara
      // manual - status "selesai"-nya hanya diisi otomatis oleh grade_test()
      // di server saat tesnya dinilai (supabase/secure-test-grading.sql),
      // supaya siswa tidak bisa curang lewat tombol ini.
      const actionButton = task.completed
        ? '<span class="assignment-done-label">Selesai</span>'
        : '<button type="button" class="assignment-test-btn" data-goto-test="1">Kerjakan tes →</button>';
      return `<div class="assignment-row"><div><b>${escapeHtml(task.title)}</b><span class="assignment-type-tag">Akses Tes Kemampuan</span><small>${dueText}</small></div>${actionButton}</div>`;
    })
    .join("");
}

function submissionFilePath(assignmentId, file) {
  const safeName = file.name.replace(/[^A-Za-z0-9._-]+/g, "_").slice(-80) || "file";
  return `${window.currentProfile.id}/${assignmentId}/${Date.now()}-${safeName}`;
}

async function submitAssignment(form) {
  const errorEl = form.querySelector(".login-error");
  const submitBtn = form.querySelector('button[type="submit"]');
  const task = siswaAssignmentsById.get(form.dataset.id);
  const oldSub = task ? firstSubmission(task) : null;
  const answer = form.elements.answer.value.trim();
  const file = form.elements.file.files[0] || null;
  const showError = (message) => {
    errorEl.textContent = message;
    errorEl.hidden = false;
    submitBtn.disabled = false;
    submitBtn.textContent = "Kirim";
  };
  errorEl.hidden = true;

  if (file && file.size > SUBMISSION_MAX_BYTES) return showError("Ukuran file maksimal 5 MB.");
  if (file && !SUBMISSION_TYPES.includes(file.type)) {
    return showError("Jenis file tidak didukung. Gunakan foto (JPG/PNG/WebP), PDF, atau audio.");
  }
  if (!answer && !file && !(oldSub && oldSub.file_path)) {
    return showError("Isi jawaban atau lampirkan file.");
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Mengirim…";
  const storage = window.supabaseClient.storage.from(SUBMISSION_BUCKET);
  let filePath = oldSub ? oldSub.file_path : null;
  let fileName = oldSub ? oldSub.file_name : null;
  let fileType = oldSub ? oldSub.file_type : null;
  let uploadedPath = null;
  if (file) {
    uploadedPath = submissionFilePath(form.dataset.id, file);
    const { error: uploadError } = await storage.upload(uploadedPath, file, { contentType: file.type });
    if (uploadError) return showError(`Gagal mengunggah file: ${uploadError.message}`);
    filePath = uploadedPath;
    fileName = file.name;
    fileType = file.type;
  }

  const { data: replacedPath, error } = await window.supabaseClient.rpc("submit_assignment", {
    p_assignment_id: Number(form.dataset.id),
    p_answer_text: answer,
    p_file_path: filePath,
    p_file_name: fileName,
    p_file_type: fileType,
  });
  if (error) {
    if (uploadedPath) storage.remove([uploadedPath]);
    return showError(`Gagal mengirim tugas: ${error.message}`);
  }
  // File lama yang diganti dibersihkan; gagal tidak fatal (cuma sisa file).
  if (replacedPath) storage.remove([replacedPath]);
  loadSiswaAssignments();
}

if (assignmentsList) {
  assignmentsList.addEventListener("click", (event) => {
    if (event.target.closest(".assignment-test-btn[data-goto-test]")) {
      // app-shell.js sengaja menyediakan window.open(view) sebagai satu pintu
      // navigasi. Setelah migrasi multi-halaman, view "test" mengarah ke
      // pages/latihan.html, bukan lagi section/hash SPA di index.html.
      window.open("test");
      return;
    }
    const row = event.target.closest(".assignment-row");
    const form = row && row.querySelector(".assignment-submit-form");
    if (!form) return;
    if (event.target.closest(".assignment-open-form")) {
      form.hidden = false;
      form.elements.answer.focus();
    } else if (event.target.closest(".assignment-cancel-btn")) {
      form.hidden = true;
    }
  });
  assignmentsList.addEventListener("submit", (event) => {
    const form = event.target.closest(".assignment-submit-form");
    if (!form) return;
    event.preventDefault();
    submitAssignment(form);
  });
}

window.loadStudyReminder = loadStudyReminder;
window.loadSiswaAssignments = loadSiswaAssignments;
