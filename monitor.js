/* Panel Pantau Siswa (Sensei & Operator): daftar semua Siswa + ringkasan
   progres SRS mereka (dibaca langsung dari Supabase, bukan localStorage -
   ini progres milik user LAIN), dan opsi reset progres per siswa.
   Dimuat setelah admin.js (pakai displayLoginId) dan srs.js (pakai
   srsToday/SRS_MASTERED_BOX). */

const monitorListEl = document.getElementById("monitorList");
const monitorDetailEl = document.getElementById("monitorDetail");
const monitorDetailName = document.getElementById("monitorDetailName");
const monitorDetailId = document.getElementById("monitorDetailId");
const monitorDetailStats = document.getElementById("monitorDetailStats");
const monitorResetBtn = document.getElementById("monitorResetBtn");
const monitorResetError = document.getElementById("monitorResetError");
const monitorDetailClose = document.getElementById("monitorDetailClose");
const monitorAssignmentList = document.getElementById("monitorAssignmentList");
const monitorAssignmentForm = document.getElementById("monitorAssignmentForm");
const monitorAssignmentError = document.getElementById("monitorAssignmentError");

let monitorStudents = [];
let monitorSelectedId = null;

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

/* XP siswa dihitung dengan formula sama seperti totalXp() di app.js:
   5 XP per aksi review SRS (semua kategori, activity_log) + XP dari
   riwayat quiz_results - dibaca langsung dari Supabase (bukan
   localStorage perangkat ini), supaya Sensei/Operator bisa memantau. */
function remoteXp(activityRows, quizRows) {
  const reviewXp = activityRows.reduce((sum, row) => sum + (row.count || 0), 0) * 5;
  const quizXp = typeof window.quizXpFromRows === "function" ? window.quizXpFromRows(quizRows) : 0;
  return reviewXp + quizXp;
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

  const [remoteData, quizData] = await Promise.all([
    Promise.all(students.map((s) => srsFetchRemoteFor(s.id))),
    Promise.all(
      students.map((s) => (typeof window.quizFetchRemoteFor === "function" ? window.quizFetchRemoteFor(s.id) : [])),
    ),
  ]);
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
      return `<button type="button" class="monitor-card" data-id="${student.id}"><b>${escapeHtml(student.full_name)}</b><small>${escapeHtml(displayLoginId(student.email))}</small><div class="monitor-card-stats"><span>${streak} hari streak</span><span>${due} due</span><span>${xp.toLocaleString("id-ID")} XP</span><span>${lastActive ? "Terakhir " + lastActive : "Belum pernah belajar"}</span></div></button>`;
    })
    .join("");
}

function renderMonitorDetail(student) {
  monitorDetailName.textContent = student.full_name;
  monitorDetailId.textContent = displayLoginId(student.email);
  const categories = [
    { prefix: "kanji:", label: "Kanji" },
    { prefix: "materi:", label: "Materi" },
    { prefix: "hafalan:", label: "Hafalan" },
  ];
  const xp = remoteXp(student.remote.activity, student.quiz);
  const quizCount = student.quiz.length;
  let statsHtml = `<div class="monitor-stat-row"><b>XP</b><span>${xp.toLocaleString("id-ID")} XP total · ${quizCount} sesi quiz diselesaikan</span></div>`;
  statsHtml += categories
    .map((cat) => {
      const due = remoteDueCount(student.remote.progress, cat.prefix);
      const mastered = remoteMasteredCount(student.remote.progress, cat.prefix);
      const total = student.remote.progress.filter((row) => row.item_id.startsWith(cat.prefix)).length;
      return `<div class="monitor-stat-row"><b>${cat.label}</b><span>${total} item dipelajari · ${mastered} dikuasai · ${due} due</span></div>`;
    })
    .join("");
  monitorDetailStats.innerHTML = statsHtml;
  monitorResetError.hidden = true;
  monitorResetBtn.disabled = false;
  monitorResetBtn.textContent = "Reset progres siswa ini";
  monitorAssignmentError.hidden = true;
  monitorAssignmentForm.reset();
  monitorDetailEl.hidden = false;
  loadStudentAssignments(student.id);
}

async function loadStudentAssignments(siswaId) {
  monitorAssignmentList.innerHTML = '<p class="muted">Memuat tugas…</p>';
  const { data, error } = await window.supabaseClient
    .from("assignments")
    .select("id, title, due_date, completed")
    .eq("siswa_id", siswaId)
    .order("completed", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false });
  if (error) {
    monitorAssignmentList.innerHTML = `<p class="muted">Gagal memuat tugas: ${error.message}</p>`;
    return;
  }
  if (!data || data.length === 0) {
    monitorAssignmentList.innerHTML = '<p class="muted">Belum ada tugas.</p>';
    return;
  }
  monitorAssignmentList.innerHTML = data
    .map((task) => {
      const dueText = task.due_date ? `Tenggat ${task.due_date}` : "Tanpa tenggat";
      const statusClass = task.completed ? "assignment-done" : "assignment-pending";
      return `<div class="monitor-assignment-row ${statusClass}"><div><b>${escapeHtml(task.title)}</b><small>${dueText} · ${task.completed ? "Selesai" : "Belum selesai"}</small></div><button type="button" class="monitor-assignment-delete" data-id="${task.id}">Hapus</button></div>`;
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

monitorDetailClose.addEventListener("click", () => {
  monitorDetailEl.hidden = true;
  monitorSelectedId = null;
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
  const title = document.getElementById("monitorAssignmentTitle").value.trim();
  const dueDate = document.getElementById("monitorAssignmentDue").value || null;
  monitorAssignmentError.hidden = true;

  const { error } = await window.supabaseClient.from("assignments").insert({
    sensei_id: window.currentProfile.id,
    siswa_id: student.id,
    title,
    due_date: dueDate,
  });
  if (error) {
    monitorAssignmentError.textContent = `Gagal memberi tugas: ${error.message}`;
    monitorAssignmentError.hidden = false;
    return;
  }
  monitorAssignmentForm.reset();
  loadStudentAssignments(student.id);
});

monitorAssignmentList.addEventListener("click", async (event) => {
  const button = event.target.closest(".monitor-assignment-delete");
  if (!button) return;
  const confirmed = confirm("Hapus tugas ini?");
  if (!confirmed) return;
  const { error } = await window.supabaseClient
    .from("assignments")
    .delete()
    .eq("id", button.dataset.id);
  if (error) {
    alert(`Gagal menghapus tugas: ${error.message}`);
    return;
  }
  const student = monitorStudents.find((s) => s.id === monitorSelectedId);
  if (student) loadStudentAssignments(student.id);
});

window.loadMonitorPanel = loadMonitorPanel;
