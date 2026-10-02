-- Daftar paket ujian siap pakai di DATABASE (bukan lagi di kode), supaya
-- paket baru langsung bisa ditugaskan Sensei di Pantau Siswa dan dipilih
-- staf di Tes Kemampuan tanpa mengubah/deploy ulang aplikasi.
-- Jalankan SEKALI di Supabase SQL Editor SETELAH secure-test-grading.sql
-- dan seed-package-questions.sql. Aman dijalankan ulang.
--
-- Menambah paket baru: lihat supabase/contoh-tambah-paket.sql.

create table if not exists public.test_packages (
  key text primary key check (key ~ '^[a-z0-9][a-z0-9-]*$'),
  label text not null,                  -- nama lengkap, mis. "JLPT N5 · Paket B (Latihan)"
  mark text not null,                   -- kode singkat di kartu, mis. "N5·B"
  description text not null default '', -- keterangan di pilihan paket
  time_limit_minutes int not null default 60 check (time_limit_minutes between 5 and 240),
  one_page boolean not null default false, -- true: semua soal tampil satu halaman (format JLPT)
  position int not null default 0,      -- urutan tampil (kecil -> besar)
  active boolean not null default true  -- false: disembunyikan dari pilihan (akses lama tetap jalan)
);

alter table public.test_packages enable row level security;

-- Hanya Operator yang mengelola tabel ini langsung; semua user membaca
-- lewat list_test_packages() di bawah.
drop policy if exists "test_packages_operator_all" on public.test_packages;
create policy "test_packages_operator_all"
  on public.test_packages for all
  using (public.current_user_role() = 'operator')
  with check (public.current_user_role() = 'operator');

insert into public.test_packages (key, label, mark, description, time_limit_minutes, one_page, position) values
  ('d03', 'Paket Ujian · Kosakata & Kanji (Set 03)', 'SET', '35 soal format 4 bagian: cara baca kanji, penulisan kanji, kosakata, dan parafrasa.', 60, false, 10),
  ('jlpt-n5-tp1', 'JLPT N5 · Contoh Resmi + Latihan', 'N5', '67 soal: kosakata (contoh resmi JLPT + soal tambahan), tata bahasa & bacaan, dan mendengarkan (dengan audio & gambar).', 60, true, 20),
  ('jlpt-n5-tp2', 'JLPT N5 · Paket B (Latihan)', 'N5·B', '67 soal, struktur sama persis dengan paket JLPT N5 di atas tapi kosakata & soal semuanya berbeda - untuk latihan tambahan.', 60, true, 30),
  ('jlpt-n5-tp3', 'JLPT N5 · Paket C (Latihan)', 'N5·C', '67 soal, struktur sama persis dengan paket JLPT N5 lainnya, kosakata & soal berbeda dari Paket A dan B.', 60, true, 40),
  ('jlpt-n5-tp4', 'JLPT N5 · Paket D (Latihan)', 'N5·D', '67 soal, struktur sama persis dengan paket JLPT N5 lainnya, kosakata & soal berbeda dari Paket A, B, dan C.', 60, true, 50),
  ('jlpt-n5-tp5', 'JLPT N5 · Paket E (Latihan)', 'N5·E', '67 soal, struktur sama persis dengan paket JLPT N5 lainnya, kosakata & soal berbeda dari Paket A sampai D.', 60, true, 60),
  ('jlpt-n5-tp6', 'JLPT N5 · Paket F (Latihan)', 'N5·F', '67 soal, struktur sama persis dengan paket JLPT N5 lainnya, kosakata & soal berbeda dari Paket A sampai E.', 60, true, 70),
  ('jlpt-n4-tp1', 'JLPT N4 · Contoh Resmi + Latihan', 'N4', '75 soal: kosakata (contoh resmi JLPT N4 + soal tambahan), tata bahasa & bacaan, dan mendengarkan (rekaman & gambar resmi). Waktu 90 menit.', 90, true, 80),
  ('jlpt-n4-tp2', 'JLPT N4 · Paket B (Latihan)', 'N4·B', '75 soal, struktur sama persis dengan paket JLPT N4 Contoh Resmi, kosakata & soal semuanya berbeda. Waktu 90 menit.', 90, true, 90)
on conflict (key) do nothing;

-- Setiap soal paket wajib menunjuk paket yang terdaftar.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'package_questions_package_key_fkey') then
    alter table public.package_questions
      add constraint package_questions_package_key_fkey
      foreign key (package_key) references public.test_packages (key) on update cascade;
  end if;
end;
$$;

-- Daftar paket + jumlah soalnya (tanpa isi soal). Dipakai Pantau Siswa
-- (pilihan akses paket) dan Tes Kemampuan (pilihan paket staf, batas
-- waktu, tampilan). Paket tanpa soal tetap dikembalikan dengan
-- question_count = 0 supaya client bisa menyembunyikannya.
create or replace function public.list_test_packages()
returns table (
  key text, label text, mark text, description text,
  time_limit_minutes int, one_page boolean, "position" int, active boolean,
  question_count int
)
language sql
security definer
set search_path = public
stable
as $$
  select p.key, p.label, p.mark, p.description, p.time_limit_minutes,
         p.one_page, p.position, p.active,
         (select count(*)::int from public.package_questions q where q.package_key = p.key)
  from public.test_packages p
  order by p.position, p.key;
$$;

revoke execute on function public.list_test_packages() from public, anon;
grant execute on function public.list_test_packages() to authenticated;
