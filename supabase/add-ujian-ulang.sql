-- Ujian ulang tiap 5 bab (js/tugas-bab.js, target 'ujian-ulang').
-- Jalankan SETELAH supabase/add-target-bab.sql, di SQL Editor Supabase
-- (atau `supabase db query --linked -f supabase/add-ujian-ulang.sql`).
-- Aman dijalankan ulang.
--
-- Ujian dicatat sebagai baris bab_targets biasa lewat catat_target_bab()
-- (bab = 5, 10, ..., 50; lulus = skor >= target_bab_kkm()), jadi Pantau
-- Siswa langsung bisa membacanya. Yang berubah hanya daftar target yang
-- diizinkan tabel.

alter table public.bab_targets drop constraint if exists bab_targets_target_check;
alter table public.bab_targets add constraint bab_targets_target_check check (target in (
  'materi',
  'kotoba-jp-id', 'kotoba-id-jp',
  'kanji-kanji-kana', 'kanji-kana-kanji', 'kanji-kanji-id', 'kanji-id-kanji',
  'kalimat-susun', 'kalimat-pilih',
  'ujian-ulang'
));

-- Ujian hanya ada di bab kelipatan 5.
alter table public.bab_targets drop constraint if exists bab_targets_ujian_bab_check;
alter table public.bab_targets add constraint bab_targets_ujian_bab_check
  check (target <> 'ujian-ulang' or bab % 5 = 0);
