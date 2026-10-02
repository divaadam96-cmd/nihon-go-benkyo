-- CARA UTAMA menambah/mengedit paket sekarang lewat website: menu
-- "Kelola Soal" (Operator) -> "+ Paket ujian baru". File ini hanya untuk
-- IMPOR MASSAL lewat SQL Editor (melewati validasi editor - pastikan
-- isinya benar; HTML soal tetap disaring saat ditampilkan ke siswa).
--
-- CONTOH menambah paket ujian baru. Salin file ini, ganti isinya, lalu
-- jalankan di Supabase SQL Editor. Tidak perlu mengubah kode atau deploy:
-- begitu paket punya minimal 1 soal, paket langsung muncul di Pantau Siswa
-- (untuk ditugaskan ke siswa) dan di pilihan paket Tes Kemampuan (staf).
--
-- Aturan:
--   * key: huruf kecil/angka/tanda minus, unik, tidak diganti setelah
--     ditugaskan ke siswa (mis. 'jlpt-n3-tp1').
--   * position soal mulai dari 0, berurutan sesuai urutan tampil.
--   * options = array JSON 4 pilihan; answer = index pilihan benar (0-3).
--   * category menentukan pengelompokan hasil; soal mendengarkan pakai
--     category 'Mendengarkan' + audio_src (file di assets/audio/) + image
--     opsional (assets/images/...), subcategory = nama もんだい.
--   * html boleh memakai tag sederhana (u, b, br, small, ruby/rt, span,
--     div, table) - tag lain disaring otomatis di browser.
--   * Paket bisa disembunyikan tanpa menghapus soal:
--       update public.test_packages set active = false where key = '...';

begin;

insert into public.test_packages (key, label, mark, description, time_limit_minutes, one_page, position)
values ('contoh-set-04', 'Paket Ujian · Contoh (Set 04)', 'SET·4',
        '2 soal contoh - ganti dengan deskripsi paket.', 30, false, 100);

insert into public.package_questions
  (package_key, position, category, subcategory, instruction, html, options, answer, explanation, material, image, audio_src, srs_id)
values
  ('contoh-set-04', 0, 'Cara Baca Kanji', null,
   '＿＿＿の ことばは ひらがなで どう かきますか。',
   '<u>山</u>に のぼります。',
   '["やま","かわ","うみ","そら"]'::jsonb, 0,
   '山 dibaca やま (gunung).', 'Set 04 · Cara baca kanji', null, null, null),
  ('contoh-set-04', 1, 'Kosakata', null,
   '（　）に なにを いれますか。',
   'まいにち （　） を のみます。',
   '["みず","ほん","くつ","いす"]'::jsonb, 0,
   'Yang bisa diminum adalah みず (air).', 'Set 04 · Kosakata', null, null, null);

-- Cek: paket baru harus muncul dengan question_count > 0
select key, label, question_count from public.list_test_packages() where key = 'contoh-set-04';

rollback; -- GANTI menjadi commit; setelah isinya benar
