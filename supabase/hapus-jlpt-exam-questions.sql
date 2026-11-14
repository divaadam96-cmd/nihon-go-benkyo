-- Hapus tabel lama public.jlpt_exam_questions (simulasi JLPT versi awal).
-- Soal paket JLPT sekarang ada di package_questions (add-test-packages.sql);
-- kode & fungsi yang memakai tabel ini (get_jlpt_exam_questions,
-- grade_jlpt_exam) sudah dihapus - lihat PR #48 dan secure-test-grading.sql.
-- Jalankan sekali di SQL Editor Supabase. Aman dijalankan ulang.
--
-- Tanpa CASCADE: kalau ternyata masih ada objek lain yang bergantung pada
-- tabel ini, perintah gagal dan tidak ada yang terhapus.

drop table if exists public.jlpt_exam_questions;
