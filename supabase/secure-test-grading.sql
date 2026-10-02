-- Penilaian Tes Kemampuan DI SERVER. Jalankan SEKALI di Supabase Dashboard
-- -> SQL Editor -> New query -> Run, lalu jalankan
-- seed-package-questions.sql. Aman dijalankan ulang.
--
-- Sebelumnya seluruh soal + kunci jawaban paket ujian (JLPT/Set) ikut
-- terkirim ke browser di js/pages/latihan.js, soal per-Bab dibaca siswa
-- langsung dari quiz_questions (termasuk kolom answer), dan nilai dihitung
-- di browser lalu di-INSERT sendiri oleh siswa ke quiz_results - artinya
-- kunci jawaban bisa dilihat lewat DevTools dan nilai bisa dipalsukan.
-- Sekarang:
--   * soal diambil lewat get_test_questions() - TANPA answer/explanation,
--     dan siswa hanya bisa mengambil tes yang memang ditugaskan kepadanya;
--   * grade_test() menilai di server, menyimpan quiz_results, menandai
--     akses tes selesai, lalu baru mengembalikan kunci + pembahasan;
--   * client tidak bisa lagi menulis quiz_results atau membaca
--     quiz_questions/package_questions secara langsung (kecuali staf).

-- 1. Bank soal paket ujian (sebelumnya mockTestPackages di latihan.js) ---
create table if not exists public.package_questions (
  id bigserial primary key,
  package_key text not null,
  position int not null,
  category text not null,
  subcategory text,
  instruction text not null,
  html text not null,
  options jsonb not null,
  answer int not null,
  explanation text not null,
  material text not null,
  image text,
  audio_src text,
  srs_id text,
  unique (package_key, position)
);

alter table public.package_questions enable row level security;

drop policy if exists "package_questions_operator_all" on public.package_questions;
create policy "package_questions_operator_all"
  on public.package_questions for all
  using (public.current_user_role() = 'operator')
  with check (public.current_user_role() = 'operator');

-- 2. quiz_questions: siswa tidak lagi membaca tabel ini langsung ----------
drop policy if exists "quiz_questions_select_published" on public.quiz_questions;
drop policy if exists "quiz_questions_staff_select" on public.quiz_questions;
create policy "quiz_questions_staff_select"
  on public.quiz_questions for select
  using (
    public.current_user_role() = 'operator'
    or (status = 'published' and public.current_user_role() = 'sensei')
  );

-- 3. quiz_results: pemilik cuma boleh MEMBACA; baris baru hanya lewat
--    grade_test() (security definer) ---------------------------------------
drop policy if exists "quiz_results_owner_all" on public.quiz_results;
drop policy if exists "quiz_results_owner_select" on public.quiz_results;
create policy "quiz_results_owner_select"
  on public.quiz_results for select
  using (user_id = auth.uid());

-- 4. Akses tes: staf bebas, siswa hanya lewat akses tes yang belum selesai -
create or replace function public.can_take_test(p_kind text, p_ref text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(public.current_user_role() in ('sensei', 'operator'), false)
      or exists (
        select 1 from public.assignments a
        where a.siswa_id = auth.uid()
          and a.completed = false
          and a.test_kind = p_kind
          and a.test_ref = p_ref
      );
$$;

-- Kunci jawaban satu tes - HANYA dipanggil dari dalam grade_test(), tidak
-- pernah diberikan ke client (lihat revoke di bawah).
create or replace function public.test_answer_key(p_kind text, p_ref text)
returns table (id bigint, "position" int, category text, answer int, explanation text)
language sql
security definer
set search_path = public
stable
as $$
  select q.id, q.position, q.category, q.answer, q.explanation
  from public.quiz_questions q
  where p_kind = 'bab' and q.bab_range::text = p_ref and q.status = 'published'
  union all
  select p.id, p.position, p.category, p.answer, p.explanation
  from public.package_questions p
  where p_kind = 'paket' and p.package_key = p_ref;
$$;

-- 5. Soal tanpa kunci jawaban ---------------------------------------------
create or replace function public.get_test_questions(p_kind text, p_ref text)
returns table (
  id bigint, "position" int, category text, subcategory text,
  instruction text, html text, options jsonb, material text,
  image text, audio_src text, srs_id text
)
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  if auth.uid() is null or not public.can_take_test(p_kind, p_ref) then
    raise exception 'Tidak punya akses ke tes ini.' using errcode = '42501';
  end if;
  return query
    select q.id, q.position, q.category, null::text, q.instruction, q.html,
           q.options, q.material, null::text, null::text, q.srs_id
    from public.quiz_questions q
    where p_kind = 'bab' and q.bab_range::text = p_ref and q.status = 'published'
    union all
    select p.id, p.position, p.category, p.subcategory, p.instruction, p.html,
           p.options, p.material, p.image, p.audio_src, p.srs_id
    from public.package_questions p
    where p_kind = 'paket' and p.package_key = p_ref
    order by 2;
end;
$$;

-- 6. Penilaian di server ----------------------------------------------------
-- p_answers: {"<id soal>": <index pilihan ASLI (sebelum diacak di layar)>}.
-- Siswa wajib menyertakan p_assignment_id akses tes miliknya yang belum
-- selesai - akses itu langsung ditandai selesai di transaksi yang sama,
-- jadi satu akses = satu kali penilaian.
create or replace function public.grade_test(
  p_kind text, p_ref text, p_answers jsonb, p_assignment_id bigint default null
)
returns table (question_id bigint, answer int, explanation text, is_correct boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_staff boolean := coalesce(public.current_user_role() in ('sensei', 'operator'), false);
  v_correct int;
  v_total int;
  v_scores jsonb;
begin
  if v_uid is null then
    raise exception 'Harus login.' using errcode = '42501';
  end if;
  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then
    raise exception 'Format jawaban tidak valid.' using errcode = '22023';
  end if;

  if not v_staff then
    perform 1 from public.assignments a
    where a.id = p_assignment_id
      and a.siswa_id = v_uid
      and a.completed = false
      and a.test_kind = p_kind
      and a.test_ref = p_ref
    for update;
    if not found then
      raise exception 'Akses tes tidak valid atau sudah selesai.' using errcode = '42501';
    end if;
  end if;

  create temporary table if not exists _graded (
    id bigint, "position" int, category text, answer int, explanation text, is_correct boolean
  ) on commit drop;
  truncate _graded;
  insert into _graded
    select k.id, k.position, k.category, k.answer, k.explanation,
           coalesce((p_answers ->> k.id::text) ~ '^\d+$'
                    and (p_answers ->> k.id::text)::int = k.answer, false)
    from public.test_answer_key(p_kind, p_ref) k;

  select count(*) filter (where g.is_correct), count(*)
    into v_correct, v_total
    from _graded g;
  if v_total = 0 then
    raise exception 'Soal tes tidak ditemukan.' using errcode = 'P0002';
  end if;

  select coalesce(jsonb_object_agg(s.category, jsonb_build_object('correct', s.c, 'total', s.t)), '{}'::jsonb)
    into v_scores
    from (
      select g.category, count(*) filter (where g.is_correct) as c, count(*) as t
      from _graded g group by g.category
    ) s;

  -- exam_type tetap 'jlpt' - kolom ini dibatasi check (jlpt|jft) di DB.
  insert into public.quiz_results (user_id, exam_type, correct_count, total_count, category_scores)
  values (v_uid, 'jlpt', v_correct, v_total, v_scores);

  if p_assignment_id is not null then
    update public.assignments
      set completed = true, completed_at = now()
      where id = p_assignment_id and siswa_id = v_uid and completed = false;
  end if;

  return query
    select g.id, g.answer, g.explanation, g.is_correct
    from _graded g order by g.position;
end;
$$;

-- 7. mark_assignment_done hanya untuk tugas biasa - akses tes ditandai
--    selesai oleh grade_test(), supaya tidak bisa "selesai" tanpa dikerjakan.
create or replace function public.mark_assignment_done(assignment_id bigint)
returns void
language sql
security definer
set search_path = public
as $$
  update public.assignments
  set completed = true, completed_at = now()
  where id = assignment_id and siswa_id = auth.uid() and test_kind is null;
$$;

-- 8. Hak eksekusi -------------------------------------------------------
revoke execute on function public.test_answer_key(text, text) from public, anon, authenticated;
revoke execute on function public.can_take_test(text, text) from public, anon;
revoke execute on function public.get_test_questions(text, text) from public, anon;
revoke execute on function public.grade_test(text, text, jsonb, bigint) from public, anon;
grant execute on function public.can_take_test(text, text) to authenticated;
grant execute on function public.get_test_questions(text, text) to authenticated;
grant execute on function public.grade_test(text, text, jsonb, bigint) to authenticated;

-- 9. Fungsi lama yang tidak dipakai lagi (penilaian JLPT versi awal) -------
drop function if exists public.grade_jlpt_exam(text, text, jsonb);
drop function if exists public.get_jlpt_exam_questions(text, text);
