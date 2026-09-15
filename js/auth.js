/* Gerbang login Nihon GO Benkyo.
   Menutupi seluruh aplikasi (lewat CSS default body:not(.authed) .app{display:none})
   sampai Supabase mengonfirmasi sesi yang valid, lalu menarik profil (peran)
   dan menghidrasi progres SRS milik user dari Supabase ke localStorage
   SEBELUM initApp() (app.js) dijalankan. */
const SUPABASE_URL = "https://twoerfizembbpuvlzzmt.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3b2VyZml6ZW1iYnB1dmx6em10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MTQ0MDMsImV4cCI6MjEwMzM5MDQwM30._-pgaQ2NIkWj7UQ-osm8PpnRg3xW4axvMn_AAJXkrzc";

window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.SUPABASE_URL = SUPABASE_URL;
window.currentProfile = null;

/* Sensei & Siswa login pakai ID buatan Operator (bukan email asli) - Supabase
   Auth tetap butuh format email di baliknya, jadi ID tanpa "@" otomatis
   diubah jadi email sintetis di domain ini sebelum dikirim ke Supabase.
   Operator tetap bisa login pakai email asli (kalau mengandung "@"). */
window.SYNTHETIC_ID_DOMAIN = "id.nihongobenkyo.local";
function toLoginEmail(rawInput) {
  const value = rawInput.trim();
  return value.includes("@") ? value : `${value}@${window.SYNTHETIC_ID_DOMAIN}`;
}

const loginScreenEl = document.getElementById("loginScreen");
const loginFormEl = document.getElementById("loginForm");
const loginErrorEl = document.getElementById("loginError");
const loginSubmitEl = document.getElementById("loginSubmit");
const forgotPasswordLinkEl = document.getElementById("forgotPasswordLink");
const forgotFormEl = document.getElementById("forgotForm");
const forgotEmailEl = document.getElementById("forgotEmail");
const forgotErrorEl = document.getElementById("forgotError");
const forgotSuccessEl = document.getElementById("forgotSuccess");
const forgotSubmitEl = document.getElementById("forgotSubmit");
const backToLoginLinkEl = document.getElementById("backToLoginLink");
const resetPasswordFormEl = document.getElementById("resetPasswordForm");
const newPasswordEl = document.getElementById("newPassword");
const newPasswordConfirmEl = document.getElementById("newPasswordConfirm");
const resetErrorEl = document.getElementById("resetError");
const resetSubmitEl = document.getElementById("resetSubmit");

/* Link reset password Supabase mendarat di sini dengan #access_token=...&type=recovery
   (atau ?code=...&type=recovery) di URL. Supabase-js otomatis membuat sesi dari token
   itu, tapi kita TIDAK boleh langsung revealApp() seperti login biasa - harus tampilkan
   form "buat password baru" dulu. Flag ini mencegah trySession() mendahului form itu. */
let isPasswordRecoveryLink =
  window.location.hash.includes("type=recovery") ||
  window.location.search.includes("type=recovery");

function showLoginError(message) {
  loginErrorEl.textContent = message;
  loginErrorEl.hidden = false;
}

function clearLoginError() {
  loginErrorEl.hidden = true;
  loginErrorEl.textContent = "";
}

async function fetchProfile(userId) {
  const { data, error } = await window.supabaseClient
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", userId)
    .single();
  if (error || !data) return null;
  return data;
}

const ROLE_LABELS = { operator: "Operator", sensei: "Sensei", siswa: "Siswa" };

function applyRoleVisibility(role) {
  document.body.dataset.role = role;
  document.querySelectorAll("[data-role-only]").forEach((el) => {
    const allowed = el.dataset.roleOnly.split(",");
    el.hidden = !allowed.includes(role);
  });
}

async function revealApp(profile) {
  window.currentProfile = profile;
  document.getElementById("accountName").textContent = profile.full_name;
  document.getElementById("accountRole").textContent = ROLE_LABELS[profile.role] || profile.role;
  await srsHydrateFromRemote(profile.id);
  document.body.classList.add("authed");
  loginScreenEl.style.display = "none";
  // initApp() membangun ulang nav (topnav/sidebar) lewat innerHTML, jadi
  // elemen ber-atribut data-role-only baru benar-benar ada di DOM SETELAH
  // ini dipanggil - applyRoleVisibility harus jalan lagi sesudahnya.
  if (typeof window.initApp === "function") window.initApp();
  applyRoleVisibility(profile.role);
}

async function trySession() {
  if (isPasswordRecoveryLink) return;
  const { data } = await window.supabaseClient.auth.getSession();
  const session = data?.session;
  if (!session) return;
  const profile = await fetchProfile(session.user.id);
  if (!profile) {
    showLoginError("Akun ini belum punya profil peran. Hubungi Operator.");
    await window.supabaseClient.auth.signOut();
    return;
  }
  await revealApp(profile);
}

loginFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearLoginError();
  loginSubmitEl.disabled = true;
  loginSubmitEl.textContent = "Memeriksa…";
  const email = toLoginEmail(document.getElementById("loginEmail").value);
  const password = document.getElementById("loginPassword").value;
  const { data, error } = await window.supabaseClient.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    showLoginError("Email atau password salah.");
    loginSubmitEl.disabled = false;
    loginSubmitEl.textContent = "Masuk";
    return;
  }
  const profile = await fetchProfile(data.user.id);
  if (!profile) {
    showLoginError("Akun ini belum punya profil peran. Hubungi Operator.");
    await window.supabaseClient.auth.signOut();
    loginSubmitEl.disabled = false;
    loginSubmitEl.textContent = "Masuk";
    return;
  }
  await revealApp(profile);
});

forgotPasswordLinkEl.addEventListener("click", () => {
  loginFormEl.hidden = true;
  forgotFormEl.hidden = false;
  forgotErrorEl.hidden = true;
  forgotSuccessEl.hidden = true;
});

backToLoginLinkEl.addEventListener("click", () => {
  forgotFormEl.hidden = true;
  loginFormEl.hidden = false;
});

forgotFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  forgotErrorEl.hidden = true;
  forgotSuccessEl.hidden = true;
  forgotSubmitEl.disabled = true;
  forgotSubmitEl.textContent = "Mengirim…";
  const { error } = await window.supabaseClient.auth.resetPasswordForEmail(
    forgotEmailEl.value.trim(),
    { redirectTo: window.location.origin + window.location.pathname },
  );
  forgotSubmitEl.disabled = false;
  forgotSubmitEl.textContent = "Kirim link reset";
  if (error) {
    forgotErrorEl.textContent = `Gagal mengirim link reset: ${error.message} (${error.status || "?"})`;
    forgotErrorEl.hidden = false;
    return;
  }
  forgotSuccessEl.textContent = "Link reset sudah dikirim. Cek email Anda (termasuk folder spam), lalu klik link di email itu.";
  forgotSuccessEl.hidden = false;
});

resetPasswordFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  resetErrorEl.hidden = true;
  if (newPasswordEl.value !== newPasswordConfirmEl.value) {
    resetErrorEl.textContent = "Password baru dan pengulangannya tidak sama.";
    resetErrorEl.hidden = false;
    return;
  }
  resetSubmitEl.disabled = true;
  resetSubmitEl.textContent = "Menyimpan…";
  const { error } = await window.supabaseClient.auth.updateUser({
    password: newPasswordEl.value,
  });
  resetSubmitEl.disabled = false;
  resetSubmitEl.textContent = "Simpan password baru";
  if (error) {
    resetErrorEl.textContent = "Gagal menyimpan password baru. Link mungkin sudah kedaluwarsa - minta link reset baru.";
    resetErrorEl.hidden = false;
    return;
  }
  resetPasswordFormEl.hidden = true;
  isPasswordRecoveryLink = false;
  history.replaceState(null, "", window.location.pathname);
  await trySession();
});

window.supabaseClient.auth.onAuthStateChange((event) => {
  if (event === "PASSWORD_RECOVERY") {
    loginFormEl.hidden = true;
    forgotFormEl.hidden = true;
    resetPasswordFormEl.hidden = false;
  }
});

document.getElementById("logoutButton").addEventListener("click", async () => {
  await window.supabaseClient.auth.signOut();
  // Perangkat ini mungkin dipakai bergantian (komputer sekolah, dsb.) -
  // bersihkan progres user sebelumnya dari localStorage supaya tidak
  // bocor ke akun berikutnya yang login di perangkat yang sama.
  localStorage.removeItem("nihonBenkyoSRS_v1");
  localStorage.removeItem("nihonBenkyoActivityLog_v1");
  location.reload();
});

trySession();
