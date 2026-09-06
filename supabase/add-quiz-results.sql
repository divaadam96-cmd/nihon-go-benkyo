-- Riwayat hasil simulasi Tes Kemampuan (JLPT/JFT) per siswa - supaya XP
-- dan status "quiz" di Rencana hari ini dihitung dari aktivitas nyata
-- (bukan lagi ditandai manual), dan Sensei/Operator bisa memantau riwayat
-- skor di panel Pantau Siswa. Jalankan sekali di SQL Editor (aman
-- dijalankan ulang - pakai "if not exists").

create table if not exists public.quiz_results (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  exam_type text not null check (exam_type in ('jlpt', 'jft')),
  correct_count int not null,
  total_count int not null,
  category_scores jsonb,
  created_at timestamptz not null default now()
);

alter table public.quiz_results enable row level security;

create policy "quiz_results_owner_all"
  on public.quiz_results for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Sensei & Operator boleh baca (bukan ubah/hapus) riwayat quiz semua
-- siswa, sama seperti kebijakan srs_progress/activity_log.
create policy "quiz_results_staff_select"
  on public.quiz_results for select
  using (public.current_user_role() in ('sensei', 'operator'));
