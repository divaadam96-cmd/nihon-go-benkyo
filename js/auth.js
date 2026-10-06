/* Gerbang login Nihon GO Benkyo.
   Menutupi seluruh aplikasi (lewat CSS default body:not(.authed) .app{display:none})
   sampai Supabase mengonfirmasi sesi yang valid, lalu menarik profil (peran)
   dan menghidrasi progres SRS milik user dari Supabase ke localStorage
   SEBELUM initApp() (app.js) dijalankan. */
const SUPABASE_URL = "https://twoerfizembbpuvlzzmt.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3b2VyZml6ZW1iYnB1dmx6em10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MTQ0MDMsImV4cCI6MjEwMzM5MDQwM30._-pgaQ2NIkWj7UQ-osm8PpnRg3xW4axvMn_AAJXkrzc";

/* Tombol mata di kolom password: tampilkan/sembunyikan isi supaya user bisa
   mengecek ketikannya. Dipasang sebelum createClient supaya tetap jalan
   walau supabase-js gagal dimuat. */
document.addEventListener("click", (event) => {
  const toggle = event.target.closest(".pw-toggle");
  if (!toggle) return;
  const input = toggle.parentElement.querySelector("input");
  const show = input.type === "password";
  input.type = show ? "text" : "password";
  toggle.setAttribute("aria-pressed", String(show));
  toggle.setAttribute("aria-label", show ? "Sembunyikan password" : "Tampilkan password");
});

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

/* Perangkat bisa dipakai bergantian (komputer sekolah, warnet). Data
   pribadi di penyimpanan browser (progres, kesalahan latihan, posisi
   terakhir) dihapus saat logout - dan juga saat akun LAIN login di
   perangkat yang sama tanpa logout sebelumnya. Memakai daftar yang BOLEH
   disimpan (bukan daftar yang harus dihapus), supaya kunci pribadi baru di
   masa depan otomatis ikut terhapus. Sesi login Supabase (sb-*) diurus
   signOut(). */
const LAST_USER_KEY = "nihonBenkyoLastUser";
function isSharedDeviceKey(key) {
  return key === "sidebarCollapsed" || key.startsWith("kanjiStrokeCacheV1:") || key.startsWith("sb-");
}
function clearPersonalData() {
  try {
    Object.keys(localStorage)
      .filter((key) => !isSharedDeviceKey(key))
      .forEach((key) => localStorage.removeItem(key));
    sessionStorage.clear();
  } catch {
    // Penyimpanan tidak tersedia - tidak ada yang perlu dibersihkan.
  }
}
/* Logout otomatis karena tidak aktif >= 1 jam (js/sesi-idle.js). Hanya
   sesi di BROWSER INI yang diakhiri (scope "local") - tombol Keluar biasa
   tetap mengakhiri sesi di semua perangkat. Pesan untuk layar login
   disimpan SETELAH data pribadi dibersihkan, jadi bertahan satu kali muat. */
const IDLE_LOGOUT_FLAG = "nihonBenkyoIdleLogout";
const IDLE_LOGOUT_MESSAGE = "Sesi berakhir karena tidak aktif lebih dari 1 jam. Silakan masuk lagi.";
/* true selama tab INI sendiri yang sedang logout - supaya event SIGNED_OUT
   (yang juga muncul di tab ini) tidak memuat ulang halaman sebelum data
   pribadi selesai dibersihkan. */
let signingOutHere = false;
async function endIdleSession() {
  signingOutHere = true;
  try {
    await window.supabaseClient.auth.signOut({ scope: "local" });
  } catch {
    // Offline - sesi lokal tetap dibersihkan di bawah.
  }
  clearPersonalData();
  try {
    localStorage.setItem(IDLE_LOGOUT_FLAG, "1");
  } catch {
    // Tidak fatal.
  }
}
function showIdleLogoutMessageOnce() {
  try {
    if (localStorage.getItem(IDLE_LOGOUT_FLAG)) {
      localStorage.removeItem(IDLE_LOGOUT_FLAG);
      showLoginError(IDLE_LOGOUT_MESSAGE);
    }
  } catch {
    // Tidak fatal.
  }
}
function rememberUser(userId) {
  try {
    if (localStorage.getItem(LAST_USER_KEY) !== userId) clearPersonalData();
    localStorage.setItem(LAST_USER_KEY, userId);
  } catch {
    // Tidak fatal.
  }
}

/* Aturan password (sama dengan create-user & pengaturan Supabase Auth):
   minimal 10 karakter, ada huruf DAN angka. */
const PASSWORD_RULE_MESSAGE = "Password minimal 10 karakter dan harus berisi huruf serta angka.";
function isStrongPassword(password) {
  return password.length >= 10 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

/* Verifikasi dua langkah (MFA/TOTP) WAJIB untuk Operator. Ini hanya
   "pintu"-nya: pengaman sebenarnya ada di database - current_user_role()
   baru mengakui peran operator kalau token login sudah aal2 (lihat
   supabase/fix-1-operator-mfa.sql) - jadi password Operator yang bocor
   saja tidak cukup walaupun API Supabase dipanggil langsung.
   Resolve true begitu sesi sudah aal2 (langsung, atau setelah Operator
   memasukkan kode 6 digit). Operator yang belum punya aplikasi
   authenticator terdaftar dipandu mendaftar lewat QR code dulu. */
let mfaFormEl = null;
function buildMfaForm() {
  if (mfaFormEl) return mfaFormEl;
  mfaFormEl = document.createElement("form");
  mfaFormEl.className = "login-card mfa-card";
  mfaFormEl.id = "mfaForm";
  mfaFormEl.hidden = true;
  mfaFormEl.innerHTML =
    '<h1>Verifikasi dua langkah</h1><p id="mfaIntro"></p>' +
    '<div class="mfa-enroll" id="mfaEnroll" hidden><img id="mfaQr" alt="QR code untuk aplikasi authenticator" width="180" height="180"><p>Tidak bisa memindai? Masukkan kode ini secara manual:<code id="mfaSecret"></code></p></div>' +
    '<label>Kode 6 digit<input type="text" id="mfaCode" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required></label>' +
    '<p class="login-error" id="mfaError" hidden></p>' +
    '<button type="submit" class="primary" id="mfaSubmit">Verifikasi</button>' +
    '<button type="button" class="link-btn" id="mfaCancel">Batal &amp; keluar</button>';
  resetPasswordFormEl.after(mfaFormEl);
  mfaFormEl.querySelector("#mfaCancel").addEventListener("click", async () => {
    await window.supabaseClient.auth.signOut();
    clearPersonalData();
    location.reload();
  });
  return mfaFormEl;
}

async function requireOperatorMfa() {
  const mfa = window.supabaseClient.auth.mfa;
  const { data: level, error: levelError } = await mfa.getAuthenticatorAssuranceLevel();
  if (levelError) throw levelError;
  if (level.currentLevel === "aal2") return true;

  const { data: factors, error: factorsError } = await mfa.listFactors();
  if (factorsError) throw factorsError;
  let factorId = factors.totp.find((factor) => factor.status === "verified")?.id;

  const form = buildMfaForm();
  const intro = form.querySelector("#mfaIntro");
  if (factorId) {
    intro.textContent = "Buka aplikasi authenticator di HP Anda, lalu masukkan kode 6 digit untuk Nihon GO Benkyo.";
  } else {
    // Pendaftaran sebelumnya yang belum selesai (QR sudah dibuat tapi kode
    // belum pernah diverifikasi) dibersihkan dulu supaya bisa daftar ulang.
    for (const factor of factors.all.filter((f) => f.factor_type === "totp" && f.status !== "verified")) {
      await mfa.unenroll({ factorId: factor.id });
    }
    const { data: enrolled, error: enrollError } = await mfa.enroll({
      factorType: "totp",
      friendlyName: `Nihon GO Benkyo ${new Date().toISOString().slice(0, 16)}`,
    });
    if (enrollError) throw enrollError;
    factorId = enrolled.id;
    form.querySelector("#mfaQr").src = enrolled.totp.qr_code;
    form.querySelector("#mfaSecret").textContent = enrolled.totp.secret;
    form.querySelector("#mfaEnroll").hidden = false;
    intro.textContent =
      "Akun Operator wajib memakai verifikasi dua langkah. Pasang aplikasi authenticator (Google Authenticator, Microsoft Authenticator, dsb.) di HP, pindai QR code di bawah, lalu masukkan kode 6 digit yang muncul.";
  }

  loginFormEl.hidden = true;
  forgotFormEl.hidden = true;
  resetPasswordFormEl.hidden = true;
  form.hidden = false;
  document.body.classList.remove("auth-checking");
  const codeEl = form.querySelector("#mfaCode");
  const errorEl = form.querySelector("#mfaError");
  const submitEl = form.querySelector("#mfaSubmit");
  codeEl.value = "";
  codeEl.focus();

  return new Promise((resolve) => {
    form.onsubmit = async (event) => {
      event.preventDefault();
      errorEl.hidden = true;
      submitEl.disabled = true;
      submitEl.textContent = "Memeriksa…";
      const { error } = await mfa.challengeAndVerify({ factorId, code: codeEl.value.trim() });
      submitEl.disabled = false;
      submitEl.textContent = "Verifikasi";
      if (error) {
        errorEl.textContent = "Kode salah atau sudah kedaluwarsa. Masukkan kode terbaru dari aplikasi authenticator.";
        errorEl.hidden = false;
        codeEl.select();
        return;
      }
      form.hidden = true;
      resolve(true);
    };
  });
}

/* Satu pintu setelah password diterima: ambil profil, minta MFA kalau
   Operator, lalu buka aplikasi. Mengembalikan false kalau gagal. */
async function continueAfterPassword(userId) {
  const profile = await fetchProfile(userId);
  if (!profile) {
    showLoginError("Akun ini belum punya profil peran. Hubungi Operator.");
    await window.supabaseClient.auth.signOut();
    return false;
  }
  if (profile.role === "operator") await requireOperatorMfa();
  await revealApp(profile);
  return true;
}

function applyRoleVisibility(role) {
  document.body.dataset.role = role;
  document.querySelectorAll("[data-role-only]").forEach((el) => {
    const allowed = el.dataset.roleOnly.split(",");
    el.hidden = !allowed.includes(role);
  });
}

async function revealApp(profile) {
  rememberUser(profile.id);
  window.currentProfile = profile;
  document.getElementById("accountName").textContent = profile.full_name;
  document.getElementById("accountRole").textContent = ROLE_LABELS[profile.role] || profile.role;
  await srsHydrateFromRemote(profile.id);
  document.body.classList.remove("auth-checking");
  document.body.classList.add("authed");
  loginScreenEl.style.display = "none";
  // initPage() (didefinisikan js/pages/*.js, beda-beda per halaman) mengisi
  // konten & interaksi khusus halaman ini. Markup shell (header/sidebar,
  // termasuk elemen data-role-only) sudah lengkap dari app-shell.js sejak
  // awal, tapi applyRoleVisibility tetap dipanggil SESUDAH initPage() jaga-
  // jaga kalau initPage() menambah elemen data-role-only baru sendiri.
  if (typeof window.initPage === "function") window.initPage();
  applyRoleVisibility(profile.role);
  // Sidebar/topnav dibangun (js/app-shell.js) SEBELUM baris ini - saat itu
  // .app masih disembunyikan (display:none) oleh gerbang login, jadi ukuran/
  // posisi tombol aktif yang dihitung waktu itu selalu nol. Ukur ulang di
  // sini, SETELAH .app benar-benar terlihat, supaya indikator aktif sidebar
  // (pil terang) tidak hilang.
  if (typeof window.refreshShellNav === "function") window.refreshShellNav();
  if (window.IdleSession) {
    window.IdleSession.start({
      logout: async () => {
        await endIdleSession();
        location.reload();
      },
    });
  }
}

async function trySession() {
  showIdleLogoutMessageOnce();
  if (isPasswordRecoveryLink) {
    loginFormEl.hidden = true;
    forgotFormEl.hidden = true;
    resetPasswordFormEl.hidden = false;
    document.body.classList.remove("auth-checking");
    return;
  }
  try {
    const { data, error } = await window.supabaseClient.auth.getSession();
    const session = data?.session;
    if (error || !session) {
      document.body.classList.remove("auth-checking");
      return;
    }
    if (window.IdleSession && window.IdleSession.isExpired()) {
      await endIdleSession();
      showIdleLogoutMessageOnce();
      document.body.classList.remove("auth-checking");
      return;
    }
    if (!(await continueAfterPassword(session.user.id))) document.body.classList.remove("auth-checking");
  } catch (error) {
    console.error("Gagal memeriksa sesi:", error);
    showLoginError("Sesi belum dapat diperiksa. Periksa koneksi lalu muat ulang halaman.");
    document.body.classList.remove("auth-checking");
  }
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
  try {
    if (await continueAfterPassword(data.user.id)) return;
  } catch (mfaError) {
    console.error("Verifikasi dua langkah gagal dimulai:", mfaError);
    showLoginError("Verifikasi dua langkah belum dapat dimulai. Periksa koneksi lalu coba lagi.");
    loginFormEl.hidden = false;
    if (mfaFormEl) mfaFormEl.hidden = true;
  }
  loginSubmitEl.disabled = false;
  loginSubmitEl.textContent = "Masuk";
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
  if (!isStrongPassword(newPasswordEl.value)) {
    resetErrorEl.textContent = PASSWORD_RULE_MESSAGE;
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
  // Logout di tab lain (tombol Keluar atau logout otomatis) -> tab ini ikut
  // kembali ke layar login.
  if (event === "SIGNED_OUT" && !signingOutHere && document.body.classList.contains("authed")) {
    location.reload();
    return;
  }
  if (event === "PASSWORD_RECOVERY") {
    loginFormEl.hidden = true;
    forgotFormEl.hidden = true;
    resetPasswordFormEl.hidden = false;
  }
});

document.getElementById("logoutButton").addEventListener("click", async () => {
  signingOutHere = true;
  await window.supabaseClient.auth.signOut();
  clearPersonalData();
  location.reload();
});

trySession();
