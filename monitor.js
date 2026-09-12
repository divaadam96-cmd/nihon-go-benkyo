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
const monitorAssignmentTitle = document.getElementById("monitorAssignmentTitle");
const monitorAssignmentBab = document.getElementById("monitorAssignmentBab");
const monitorAssignmentPaket = document.getElementById("monitorAssignmentPaket");

let monitorStudents = [];
let monitorSelectedId = null;

/* Label paket harus sinkron dengan mockTestPackages di prototype-tes-v2.js
   (halaman itu tidak dimuat di sini, jadi labelnya diduplikasi manual). */
const TEST_PAKET_LABELS = { d03: "Paket Ujian · Kosakata & Kanji (Set 03)" };

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
  const today = srsToday();
  const weakRows = weakestItems(student.remote.progress);
  if (weakRows.length) {
    statsHtml += `<div class="monitor-weak-list"><h4>Perlu perhatian</h4>${weakRows
      .map((row) => {
        const due = !row.due || row.due <= today;
        return `<div class="monitor-weak-row${due ? " due" : ""}"><span>${escapeHtml(describeItemId(row.item_id))}</span><small>Box ${row.box} · ${row.reviews}× direview${due ? " · due hari ini" : ""}</small></div>`;
      })
      .join("")}</div>`;
  }
  monitorDetailStats.innerHTML = statsHtml;
  monitorResetError.hidden = true;
  monitorResetBtn.disabled = false;
  monitorResetBtn.textContent = "Reset progres siswa ini";
  monitorAssignmentError.hidden = true;
  monitorAssignmentForm.reset();
  updateAssignmentFormMode();
  monitorDetailEl.hidden = false;
  loadStudentAssignments(student.id);
}

function describeTestAccess(task) {
  if (task.test_kind === "paket") {
    return { tag: "Akses tes · Paket", limitText: "Batas waktu 60 menit" };
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

async function loadStudentAssignments(siswaId) {
  monitorAssignmentList.innerHTML = '<p class="muted">Memuat tugas…</p>';
  const { data, error } = await window.supabaseClient
    .from("assignments")
    .select("id, title, due_date, completed, test_kind, test_ref")
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
      const access = describeTestAccess(task);
      const tagHtml = access ? `<span class="assignment-type-tag">${access.tag}</span>` : "";
      const detailText = access
        ? `${dueText} · ${access.limitText} · ${task.completed ? "Selesai" : "Belum dikerjakan"}`
        : `${dueText} · ${task.completed ? "Selesai" : "Belum selesai"}`;
      return `<div class="monitor-assignment-row ${statusClass}"><div><b>${escapeHtml(task.title)}</b>${tagHtml}<small>${detailText}</small></div><button type="button" class="monitor-assignment-delete" data-id="${task.id}">Hapus</button></div>`;
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
    title = `Simulasi Paket · ${TEST_PAKET_LABELS[testRef] || testRef}`;
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
