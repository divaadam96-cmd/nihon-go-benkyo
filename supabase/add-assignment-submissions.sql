-- Pengumpulan tugas lewat website + penilaian Sensei. Jalankan sekali di
-- SQL Editor (setelah add-assignments.sql, add-assignment-test-access.sql
-- dan secure-test-grading.sql).
--
-- Alur:
--   1. Siswa mengirim jawaban (teks dan/atau 1 file) untuk tugas umum
--      lewat submit_assignment(). File diunggah langsung dari browser ke
--      bucket Storage private "assignment-files" di folder
--      {siswa_id}/{assignment_id}/... - tidak lewat server Vercel.
--   2. Kiriman bisa diubah selama belum dinilai.
--   3. Sensei/Operator memberi nilai (0-100) + komentar lewat
--      grade_submission(). Setelah dinilai kiriman terkunci.
-- Akses tes kemampuan (test_kind diisi) tidak lewat sini - tetap dinilai
-- otomatis oleh grade_test().

-- 1. Tabel kiriman ------------------------------------------------------
create table if not exists public.assignment_submissions (
  id bigserial primary key,
  assignment_id bigint not null unique references public.assignments (id) on delete cascade,
  siswa_id uuid not null references auth.users (id) on delete cascade,
  answer_text text check (char_length(answer_text) <= 5000),
  file_path text,
  file_name text,
  file_type text,
  submitted_at timestamptz not null default now(),
  score int check (score between 0 and 100),
  feedback text check (char_length(feedback) <= 2000),
  graded_by uuid references auth.users (id) on delete set null,
  graded_at timestamptz,
  check (coalesce(btrim(answer_text), '') <> '' or file_path is not null)
);

create index if not exists assignment_submissions_siswa_idx
  on public.assignment_submissions (siswa_id);
create index if not exists assignment_submissions_ungraded_idx
  on public.assignment_submissions (siswa_id) where graded_at is null;

alter table public.assignment_submissions enable row level security;

-- Siswa hanya membaca kirimannya sendiri; menulis HANYA lewat
-- submit_assignment() (tidak ada policy insert/update untuk siswa), supaya
-- nilai & komentar tidak bisa diisi sendiri.
drop policy if exists "submissions_select_own_siswa" on public.assignment_submissions;
create policy "submissions_select_own_siswa"
  on public.assignment_submissions for select
  using (siswa_id = auth.uid());

-- Sensei & Operator membaca semua kiriman; menilai lewat grade_submission().
drop policy if exists "submissions_select_staff" on public.assignment_submissions;
create policy "submissions_select_staff"
  on public.assignment_submissions for select
  using (public.current_user_role() in ('sensei', 'operator'));

-- 2. Bucket file (private, maks 5 MB, foto/PDF/audio) -------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'assignment-files', 'assignment-files', false, 5242880,
  array[
    'image/jpeg', 'image/png', 'image/webp',
    'application/pdf',
    'audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/webm', 'audio/ogg', 'audio/wav', 'audio/x-wav'
  ]
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Siswa mengunggah hanya ke foldernya sendiri ({uid}/...).
drop policy if exists "assignment_files_insert_own" on storage.objects;
create policy "assignment_files_insert_own"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'assignment-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Siswa membaca file sendiri; Sensei/Operator membaca semua.
drop policy if exists "assignment_files_select" on storage.objects;
create policy "assignment_files_select"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'assignment-files'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.current_user_role() in ('sensei', 'operator')
    )
  );

-- Siswa menghapus file sendiri (saat mengganti kiriman), tapi tidak file
-- yang sudah dinilai. Sensei/Operator boleh menghapus semua.
drop policy if exists "assignment_files_delete" on storage.objects;
create policy "assignment_files_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'assignment-files'
    and (
      public.current_user_role() in ('sensei', 'operator')
      or (
        (storage.foldername(name))[1] = auth.uid()::text
        and not exists (
          select 1 from public.assignment_submissions s
          where s.file_path = storage.objects.name and s.graded_at is not null
        )
      )
    )
  );

-- 3. Siswa mengirim / mengubah kiriman ----------------------------------
-- Mengembalikan file_path LAMA kalau file diganti/dihapus, supaya browser
-- bisa membersihkan file lama dari Storage.
create or replace function public.submit_assignment(
  p_assignment_id bigint,
  p_answer_text text,
  p_file_path text,
  p_file_name text,
  p_file_type text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_answer text := nullif(btrim(coalesce(p_answer_text, '')), '');
  v_old record;
begin
  if not exists (
    select 1 from public.assignments
    where id = p_assignment_id and siswa_id = v_uid and test_kind is null
  ) then
    raise exception 'Tugas tidak ditemukan.';
  end if;

  if v_answer is null and p_file_path is null then
    raise exception 'Isi jawaban atau lampirkan file.';
  end if;

  if p_file_path is not null
     and p_file_path not like v_uid::text || '/' || p_assignment_id::text || '/%' then
    raise exception 'Lokasi file tidak valid.';
  end if;

  select file_path, graded_at into v_old
  from public.assignment_submissions
  where assignment_id = p_assignment_id;

  if found and v_old.graded_at is not null then
    raise exception 'Tugas sudah dinilai Sensei dan tidak bisa diubah.';
  end if;

  insert into public.assignment_submissions
    (assignment_id, siswa_id, answer_text, file_path, file_name, file_type, submitted_at)
  values
    (p_assignment_id, v_uid, v_answer, p_file_path,
     left(p_file_name, 200), left(p_file_type, 100), now())
  on conflict (assignment_id) do update
    set answer_text = excluded.answer_text,
        file_path = excluded.file_path,
        file_name = excluded.file_name,
        file_type = excluded.file_type,
        submitted_at = now();

  update public.assignments
  set completed = true, completed_at = now()
  where id = p_assignment_id;

  if v_old.file_path is not null and v_old.file_path is distinct from p_file_path then
    return v_old.file_path;
  end if;
  return null;
end;
$$;

-- 4. Sensei/Operator menilai ---------------------------------------------
create or replace function public.grade_submission(
  p_submission_id bigint,
  p_score int,
  p_feedback text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.current_user_role() not in ('sensei', 'operator') then
    raise exception 'Hanya Sensei/Operator yang bisa menilai.';
  end if;
  if p_score is null or p_score < 0 or p_score > 100 then
    raise exception 'Nilai harus 0-100.';
  end if;

  update public.assignment_submissions
  set score = p_score,
      feedback = nullif(btrim(coalesce(p_feedback, '')), ''),
      graded_by = auth.uid(),
      graded_at = now()
  where id = p_submission_id;

  if not found then
    raise exception 'Kiriman tidak ditemukan.';
  end if;
end;
$$;

-- 5. "Tandai selesai" untuk tugas umum diganti pengiriman tugas ----------
drop function if exists public.mark_assignment_done(bigint);

-- 6. Hak eksekusi --------------------------------------------------------
revoke execute on function public.submit_assignment(bigint, text, text, text, text) from public, anon;
revoke execute on function public.grade_submission(bigint, int, text) from public, anon;
grant execute on function public.submit_assignment(bigint, text, text, text, text) to authenticated;
grant execute on function public.grade_submission(bigint, int, text) to authenticated;
