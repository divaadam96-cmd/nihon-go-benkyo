/* Dashboard Siswa: daftar "Tugas dari Sensei" + banner pengingat belajar
   harian. Dimuat setelah admin.js (escapeHtml) dan srs.js (srsTodayCount,
   srsStreak). Dipanggil dari app.js (renderDashboardActivity) setiap kali
   dashboard dibuka/di-refresh. */

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
        icon: "icon-192.png",
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
        icon: "icon-192.png",
      });
    }
  });
}

async function loadSiswaAssignments() {
  if (!assignmentsCard || !window.currentProfile || window.currentProfile.role !== "siswa") return;
  assignmentsList.innerHTML = '<p class="muted">Memuat…</p>';
  const { data, error } = await window.supabaseClient
    .from("assignments")
    .select("id, title, due_date, completed")
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
  assignmentsList.innerHTML = data
    .map((task) => {
      const dueText = task.due_date ? `Tenggat ${task.due_date}` : "Tanpa tenggat";
      const doneButton = task.completed
        ? '<span class="assignment-done-label">Selesai</span>'
        : `<button type="button" class="assignment-done-btn" data-id="${task.id}">Tandai selesai</button>`;
      return `<div class="assignment-row"><div><b>${escapeHtml(task.title)}</b><small>${dueText}</small></div>${doneButton}</div>`;
    })
    .join("");
}

if (assignmentsList) {
  assignmentsList.addEventListener("click", async (event) => {
    const button = event.target.closest(".assignment-done-btn");
    if (!button) return;
    button.disabled = true;
    button.textContent = "Menandai…";
    const { error } = await window.supabaseClient.rpc("mark_assignment_done", {
      assignment_id: Number(button.dataset.id),
    });
    if (error) {
      alert(`Gagal menandai tugas: ${error.message}`);
      button.disabled = false;
      button.textContent = "Tandai selesai";
      return;
    }
    loadSiswaAssignments();
  });
}

window.loadStudyReminder = loadStudyReminder;
window.loadSiswaAssignments = loadSiswaAssignments;
