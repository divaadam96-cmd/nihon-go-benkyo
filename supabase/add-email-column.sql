-- Tambahan kecil: simpan email di tabel profiles juga (selain di
-- auth.users bawaan Supabase) supaya panel Admin bisa menampilkan daftar
-- akun tanpa perlu akses admin API dari client. Jalankan sekali di SQL
-- Editor.

alter table public.profiles add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;
