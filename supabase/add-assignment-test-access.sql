-- Akses "Tes Kemampuan" lewat tugas dari Sensei/Operator. Jalankan sekali
-- di SQL Editor (setelah add-assignments.sql).
--
-- Sebelumnya siswa bisa membuka & memulai tes kemampuan (latihan per 5 bab
-- atau simulasi paket) kapan saja tanpa batasan. Sekarang tes kemampuan
-- hanya bisa dikerjakan siswa kalau Sensei/Operator sudah memberikan
-- akses lewat baris `assignments` yang menunjuk ke tes tertentu:
--   test_kind = 'bab'   -> test_ref = bab awal rentang (mis. "1", "6", "11", ...)
--   test_kind = 'paket' -> test_ref = kunci paket (mis. "d03")
-- Tugas umum (bukan akses tes) tetap punya test_kind/test_ref NULL seperti
-- sebelumnya, jadi tidak terpengaruh.

alter table public.assignments
  add column if not exists test_kind text check (test_kind in ('bab', 'paket')),
  add column if not exists test_ref text;
