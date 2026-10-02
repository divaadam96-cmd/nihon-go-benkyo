// Aturan keamanan bersama untuk Edge Functions (dibundel otomatis saat
// `supabase functions deploy`, folder berawalan "_" tidak dideploy sendiri).

// Level verifikasi token login: "aal1" = password saja, "aal2" = password +
// kode MFA. Dipanggil SETELAH token diverifikasi lewat admin.auth.getUser(),
// jadi isi payload-nya sudah terbukti asli dan aman dibaca.
export function tokenAal(jwt: string): string {
  try {
    const payload = jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    return JSON.parse(atob(padded)).aal || "aal1";
  } catch {
    return "aal1";
  }
}

// Password akun baru: minimal 10 karakter, ada huruf DAN angka. Sama dengan
// aturan "Password Requirements" di Supabase Auth (lihat README).
export const PASSWORD_RULE_MESSAGE = "Password minimal 10 karakter dan harus berisi huruf serta angka.";
export function isStrongPassword(password: unknown): boolean {
  return typeof password === "string" && password.length >= 10 && /[A-Za-z]/.test(password) && /\d/.test(password);
}
