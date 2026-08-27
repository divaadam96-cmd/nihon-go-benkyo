/* Panel Admin (khusus Operator): buat & hapus akun Sensei/Siswa lewat Edge
   Function create-user/delete-user, dan tampilkan daftar akun yang sudah ada.
   Dimuat setelah auth.js supaya window.supabaseClient/SUPABASE_URL/toLoginEmail
   siap dipakai. */

const ROLE_LABELS_ADMIN = { operator: "Operator", sensei: "Sensei", siswa: "Siswa" };

const adminForm = document.getElementById("adminCreateForm");
const adminFormError = document.getElementById("adminFormError");
const adminFormSuccess = document.getElementById("adminFormSuccess");
const adminSubmit = document.getElementById("adminSubmit");
const adminListEl = document.getElementById("adminAccountList");

function showAdminError(message) {
  adminFormSuccess.hidden = true;
  adminFormError.textContent = message;
  adminFormError.hidden = false;
}

function showAdminSuccess(message) {
  adminFormError.hidden = true;
  adminFormSuccess.textContent = message;
  adminFormSuccess.hidden = false;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text == null ? "" : String(text);
  return div.innerHTML;
}

/* Akun Sensei/Siswa disimpan pakai email sintetis (lihat toLoginEmail di
   auth.js) supaya operator bisa bikin ID bebas tanpa email asli. Di daftar
   akun, tampilkan ID bersihnya saja - potong domain sintetis kalau ada. */
function displayLoginId(email) {
  if (!email) return "-";
  const suffix = `@${window.SYNTHETIC_ID_DOMAIN}`;
  return email.endsWith(suffix) ? email.slice(0, -suffix.length) : email;
}

async function getAccessToken() {
  const { data: sessionData } = await window.supabaseClient.auth.getSession();
  return sessionData?.session?.access_token || null;
}

async function loadAdminPanel() {
  adminListEl.innerHTML = '<p class="muted">Memuat…</p>';
  const { data, error } = await window.supabaseClient
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    adminListEl.innerHTML = `<p class="muted">Gagal memuat daftar akun: ${error.message}</p>`;
    return;
  }
  if (!data || data.length === 0) {
    adminListEl.innerHTML = '<p class="muted">Belum ada akun.</p>';
    return;
  }
  adminListEl.innerHTML = data
    .map((row) => {
      const deleteButton =
        row.role === "operator"
          ? ""
          : `<button type="button" class="admin-delete-btn" data-id="${row.id}" data-name="${escapeHtml(row.full_name)}">Hapus</button>`;
      return `<div class="admin-account-row"><div><b>${escapeHtml(row.full_name)}</b><small>${escapeHtml(displayLoginId(row.email))}</small></div><div class="admin-account-actions"><span class="admin-role-badge admin-role-${row.role}">${ROLE_LABELS_ADMIN[row.role] || row.role}</span>${deleteButton}</div></div>`;
    })
    .join("");
}

if (adminForm) {
  adminForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    adminFormError.hidden = true;
    adminFormSuccess.hidden = true;
    adminSubmit.disabled = true;
    adminSubmit.textContent = "Membuat…";

    const full_name = document.getElementById("adminFullName").value.trim();
    const email = toLoginEmail(document.getElementById("adminEmail").value);
    const password = document.getElementById("adminPassword").value;
    const role = document.getElementById("adminRole").value;

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        showAdminError("Sesi login tidak ditemukan. Coba masuk ulang.");
        return;
      }
      const response = await fetch(`${window.SUPABASE_URL}/functions/v1/create-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ full_name, email, password, role }),
      });
      const result = await response.json();
      if (!response.ok) {
        showAdminError(result.error || "Gagal membuat akun.");
        return;
      }
      showAdminSuccess(`Akun ${ROLE_LABELS_ADMIN[role] || role} "${full_name}" berhasil dibuat.`);
      adminForm.reset();
      await loadAdminPanel();
    } catch (err) {
      showAdminError("Tidak bisa menghubungi server. Cek koneksi internet.");
    } finally {
      adminSubmit.disabled = false;
      adminSubmit.textContent = "Buat akun";
    }
  });
}

adminListEl.addEventListener("click", async (event) => {
  const button = event.target.closest(".admin-delete-btn");
  if (!button) return;
  const id = button.dataset.id;
  const name = button.dataset.name;
  const confirmed = confirm(
    `Hapus akun "${name}"? Semua progres belajarnya akan ikut terhapus permanen dan tidak bisa dikembalikan.`,
  );
  if (!confirmed) return;

  button.disabled = true;
  button.textContent = "Menghapus…";
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      alert("Sesi login tidak ditemukan. Coba masuk ulang.");
      return;
    }
    const response = await fetch(`${window.SUPABASE_URL}/functions/v1/delete-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ user_id: id }),
    });
    const result = await response.json();
    if (!response.ok) {
      alert(result.error || "Gagal menghapus akun.");
      button.disabled = false;
      button.textContent = "Hapus";
      return;
    }
    await loadAdminPanel();
  } catch (err) {
    alert("Tidak bisa menghubungi server. Cek koneksi internet.");
    button.disabled = false;
    button.textContent = "Hapus";
  }
});

window.loadAdminPanel = loadAdminPanel;
