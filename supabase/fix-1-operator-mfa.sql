-- Perbaikan keamanan #1: akun Operator WAJIB verifikasi dua langkah (MFA).
--
-- Jalankan SETELAH Operator selesai mendaftarkan aplikasi authenticator
-- lewat layar login baru (kalau dijalankan sebelumnya pun aman: Operator
-- tetap bisa login dan mendaftar MFA, hanya fitur khusus Operator yang
-- terkunci sampai MFA selesai). Aman dijalankan ulang.
--
-- Cara kerja: token login Supabase (JWT) membawa klaim "aal":
--   aal1 = baru login dengan password,
--   aal2 = password + kode TOTP dari aplikasi authenticator.
-- Semua aturan akses (RLS) & fungsi di database memeriksa peran lewat
-- current_user_role(). Fungsi itu sekarang hanya mengakui 'operator'
-- kalau token-nya aal2; Operator yang baru memasukkan password
-- diperlakukan sebagai 'operator_mfa_pending' (tidak punya hak apa pun),
-- jadi password yang bocor saja TIDAK cukup untuk memakai hak Operator -
-- walaupun penyerang memanggil API Supabase langsung tanpa lewat website.
--
-- Darurat - Operator kehilangan HP/aplikasi authenticator: pemilik proyek
-- Supabase menghapus faktor MFA-nya lewat SQL Editor, lalu Operator
-- login ulang dan mendaftar MFA baru:
--   delete from auth.mfa_factors
--   where user_id = (select id from auth.users where email = 'email-operator@contoh.com');

create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select case
    when p.role = 'operator' and coalesce(auth.jwt() ->> 'aal', 'aal1') <> 'aal2'
      then 'operator_mfa_pending'
    else p.role
  end
  from public.profiles p
  where p.id = auth.uid();
$$;
