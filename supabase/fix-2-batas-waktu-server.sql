-- Perbaikan keamanan #2: batas waktu Tes Kemampuan dijaga SERVER.
--
-- Sebelumnya timer cuma berjalan di browser: siswa bisa menghentikannya
-- lewat DevTools, mengulangnya dengan reload, atau mengambil soal sebelum
-- menekan "Mulai". Sekarang:
--   * Waktu dihitung sejak soal dibuka (start_test mencatat jam mulai &
--     tenggat menurut jam SERVER).
--   * Tes yang sudah dibuka tidak bisa dibatalkan/diulang: reload, tutup
--     tab, atau pindah halaman -> saat kembali, siswa melanjutkan percobaan
--     yang sama dengan tenggat yang sama.
--   * Siswa hanya bisa mengambil soal selama percobaannya berjalan.
--   * Jawaban disimpan ke server setiap kali dipilih (save_test_answers) dan
--     ditolak setelah tenggat.
--   * Tes selesai saat siswa menekan "Selesaikan" ATAU saat waktu habis -
--     termasuk kalau siswa menutup browser: percobaan yang lewat tenggat
--     ditutup & dinilai dari jawaban yang tersimpan sebelum tenggat.
--
-- Jalankan di Supabase SQL Editor / `supabase db query --linked -f ...`
-- SETELAH secure-test-grading.sql & add-test-packages.sql, lalu SEGERA
-- merge PR-nya (versi website lama memakai grade_test versi lama yang
-- dihapus di sini). Sebaiknya saat tidak ada siswa yang sedang tes.
-- Aman dijalankan ulang.

-- 1. Percobaan tes -----------------------------------------------------------
create table if not exists public.test_attempts (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  assignment_id bigint references public.assignments (id) on delete cascade,
  test_kind text not null check (test_kind in ('bab', 'paket')),
  test_ref text not null,
  started_at timestamptz not null default now(),
  deadline timestamptz not null,
  answers jsonb not null default '{}'::jsonb,   -- {"<id soal>": <index pilihan asli>}
  finished_at timestamptz,
  finish_reason text check (finish_reason in ('submitted', 'timeout')),
  quiz_result_id bigint references public.quiz_results (id) on delete set null
);
-- Satu akses tes = satu percobaan (tidak bisa dibuka ulang dari awal).
create unique index if not exists test_attempts_one_per_assignment
  on public.test_attempts (assignment_id) where assignment_id is not null;
create index if not exists test_attempts_open
  on public.test_attempts (user_id) where finished_at is null;

alter table public.test_attempts enable row level security;
-- Hanya BACA: pemilik melihat miliknya, staf melihat semua. Semua penulisan
-- lewat fungsi security definer di bawah.
drop policy if exists "test_attempts_owner_select" on public.test_attempts;
create policy "test_attempts_owner_select"
  on public.test_attempts for select using (user_id = auth.uid());
drop policy if exists "test_attempts_staff_select" on public.test_attempts;
create policy "test_attempts_staff_select"
  on public.test_attempts for select
  using (public.current_user_role() in ('sensei', 'operator'));

-- Hasil tes mencatat percobaan asalnya & cara selesainya (dipakai Pantau
-- Siswa untuk menandai tes yang selesai karena waktu habis).
alter table public.quiz_results
  add column if not exists attempt_id bigint references public.test_attempts (id) on delete set null,
  add column if not exists finish_reason text check (finish_reason in ('submitted', 'timeout'));

-- 2. Aturan waktu --------------------------------------------------------
-- Kelonggaran untuk koneksi lambat: jawaban yang sampai <= 30 detik
-- setelah tenggat masih diterima.
create or replace function public.test_grace()
returns interval language sql immutable as $$ select interval '30 seconds' $$;

create or replace function public.test_time_limit(p_kind text, p_ref text)
returns interval
language sql
stable
security definer
set search_path = public
as $$
  select make_interval(mins => case
    when p_kind = 'bab' then 45
    else coalesce((select t.time_limit_minutes from public.test_packages t where t.key = p_ref), 60)
  end);
$$;

-- 3. Menutup & menilai percobaan (internal) --------------------------------
create or replace function public.finalize_test_attempt(p_attempt_id bigint, p_reason text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  a public.test_attempts;
  v_correct int;
  v_total int;
  v_scores jsonb;
  v_result bigint;
begin
  select * into a from public.test_attempts where id = p_attempt_id for update;
  if not found then
    raise exception 'Percobaan tes tidak ditemukan.' using errcode = 'P0002';
  end if;
  if a.finished_at is not null then
    return a.quiz_result_id;
  end if;

  with graded as (
    select k.category,
           coalesce((a.answers ->> k.id::text) ~ '^\d+$'
                    and (a.answers ->> k.id::text)::int = k.answer, false) as is_correct
    from public.test_answer_key(a.test_kind, a.test_ref) k
  )
  select count(*) filter (where g.is_correct), count(*),
         coalesce((select jsonb_object_agg(s.category, jsonb_build_object('correct', s.c, 'total', s.t))
                   from (select category, count(*) filter (where is_correct) as c, count(*) as t
                         from graded group by category) s), '{}'::jsonb)
    into v_correct, v_total, v_scores
    from graded g;

  insert into public.quiz_results (user_id, exam_type, correct_count, total_count, category_scores, attempt_id, finish_reason)
  values (a.user_id, 'jlpt', v_correct, v_total, v_scores, a.id, p_reason)
  returning id into v_result;

  update public.test_attempts
    set finished_at = now(), finish_reason = p_reason, quiz_result_id = v_result
    where id = a.id;

  if a.assignment_id is not null then
    update public.assignments
      set completed = true, completed_at = now()
      where id = a.assignment_id and completed = false;
  end if;
  return v_result;
end;
$$;

-- Tutup semua percobaan yang lewat tenggat (+ kelonggaran) tapi belum
-- dikirim - mis. siswa menutup browser. p_user null = semua user.
create or replace function public.finalize_expired_test_attempts(p_user uuid default null)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
  n int := 0;
begin
  for r in
    select t.id from public.test_attempts t
    where t.finished_at is null
      and now() > t.deadline + public.test_grace()
      and (p_user is null or t.user_id = p_user)
    for update skip locked
  loop
    perform public.finalize_test_attempt(r.id, 'timeout');
    n := n + 1;
  end loop;
  return n;
end;
$$;

-- Dipanggil website: siswa (dashboard & Tes Kemampuan) untuk dirinya
-- sendiri, staf (Pantau Siswa) untuk semua siswa.
create or replace function public.finalize_my_expired_tests()
returns int language sql security definer set search_path = public as $$
  select public.finalize_expired_test_attempts(auth.uid());
$$;

create or replace function public.finalize_all_expired_tests()
returns int
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(public.current_user_role() in ('sensei', 'operator'), false) is not true then
    raise exception 'Hanya Sensei/Operator.' using errcode = '42501';
  end if;
  return public.finalize_expired_test_attempts(null);
end;
$$;

-- 4. Membuka tes ---------------------------------------------------------
create or replace function public.start_test(p_kind text, p_ref text, p_assignment_id bigint default null)
returns table (attempt_id bigint, started_at timestamptz, deadline timestamptz, server_now timestamptz, answers jsonb)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_staff boolean := coalesce(public.current_user_role() in ('sensei', 'operator'), false);
  a public.test_attempts;
begin
  if v_uid is null then
    raise exception 'Harus login.' using errcode = '42501';
  end if;
  if p_kind is null or p_kind not in ('bab', 'paket') then
    raise exception 'Jenis tes tidak dikenal.' using errcode = '22023';
  end if;
  perform public.finalize_expired_test_attempts(v_uid);

  if not exists (select 1 from public.test_answer_key(p_kind, p_ref)) then
    raise exception 'Soal untuk tes ini belum tersedia.' using errcode = 'P0002';
  end if;

  if v_staff then
    -- Staf bebas mencoba tes kapan saja (pratinjau) - selalu percobaan baru.
    insert into public.test_attempts (user_id, test_kind, test_ref, deadline)
    values (v_uid, p_kind, p_ref, now() + public.test_time_limit(p_kind, p_ref))
    returning * into a;
  else
    perform 1 from public.assignments x
    where x.id = p_assignment_id and x.siswa_id = v_uid
      and x.test_kind = p_kind and x.test_ref = p_ref and x.completed = false;
    if not found then
      if exists (select 1 from public.test_attempts t
                 where t.assignment_id = p_assignment_id and t.user_id = v_uid and t.finish_reason = 'timeout') then
        raise exception 'Waktu tes ini sudah habis. Jawaban yang tersimpan sudah dinilai.' using errcode = 'P0001';
      end if;
      raise exception 'Akses tes tidak valid atau sudah selesai.' using errcode = '42501';
    end if;
    insert into public.test_attempts (user_id, assignment_id, test_kind, test_ref, deadline)
    values (v_uid, p_assignment_id, p_kind, p_ref, now() + public.test_time_limit(p_kind, p_ref))
    on conflict (assignment_id) where assignment_id is not null do nothing;
    select * into a from public.test_attempts t where t.assignment_id = p_assignment_id;
  end if;

  return query select a.id, a.started_at, a.deadline, now(), a.answers;
end;
$$;

-- Percobaan siswa yang masih berjalan (untuk melanjutkan otomatis saat
-- siswa kembali ke Tes Kemampuan).
create or replace function public.my_open_test_attempt()
returns table (attempt_id bigint, test_kind text, test_ref text, assignment_id bigint, deadline timestamptz, server_now timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.finalize_expired_test_attempts(auth.uid());
  return query
    select t.id, t.test_kind, t.test_ref, t.assignment_id, t.deadline, now()
    from public.test_attempts t
    where t.user_id = auth.uid() and t.finished_at is null and t.assignment_id is not null
    order by t.started_at desc
    limit 1;
end;
$$;

-- 5. Soal hanya selama percobaan berjalan -----------------------------------
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
  if auth.uid() is null or not (
    coalesce(public.current_user_role() in ('sensei', 'operator'), false)
    or exists (
      select 1 from public.test_attempts t
      where t.user_id = auth.uid() and t.test_kind = p_kind and t.test_ref = p_ref
        and t.finished_at is null and now() <= t.deadline + public.test_grace()
    )
  ) then
    raise exception 'Tes belum dimulai atau waktunya sudah habis.' using errcode = '42501';
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

-- 6. Simpan jawaban selama tes ----------------------------------------------
-- p_answers: {"<id soal>": <index pilihan asli>} - hanya angka 0-9 yang
-- diterima, sisanya diabaikan.
create or replace function public.save_test_answers(p_attempt_id bigint, p_answers jsonb)
returns table (deadline timestamptz, server_now timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  a public.test_attempts;
  v_clean jsonb;
begin
  select * into a from public.test_attempts t where t.id = p_attempt_id for update;
  if not found or a.user_id <> auth.uid() then
    raise exception 'Percobaan tes tidak ditemukan.' using errcode = '42501';
  end if;
  if a.finished_at is not null then
    raise exception 'Tes ini sudah selesai.' using errcode = 'P0001';
  end if;
  if now() > a.deadline + public.test_grace() then
    raise exception 'Waktu tes sudah habis.' using errcode = 'P0001';
  end if;
  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then
    raise exception 'Format jawaban tidak valid.' using errcode = '22023';
  end if;
  select coalesce(jsonb_object_agg(e.key, e.value), '{}'::jsonb) into v_clean
    from jsonb_each(p_answers) e
    where e.key ~ '^\d+$' and jsonb_typeof(e.value) = 'number' and e.value::text ~ '^\d$';
  update public.test_attempts t set answers = t.answers || v_clean where t.id = a.id;
  return query select a.deadline, now();
end;
$$;

-- 7. Menyelesaikan tes -------------------------------------------------------
-- Jawaban terakhir (p_answers) hanya diterima kalau masih dalam waktu.
-- Aman dipanggil ulang (mis. kirim ulang setelah koneksi putus): kalau tes
-- sudah selesai, langsung mengembalikan hasil yang sama.
drop function if exists public.grade_test(text, text, jsonb, bigint);
create or replace function public.grade_test(p_attempt_id bigint, p_answers jsonb default '{}'::jsonb)
returns table (question_id bigint, answer int, explanation text, is_correct boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  a public.test_attempts;
begin
  select * into a from public.test_attempts t where t.id = p_attempt_id;
  if not found or a.user_id <> auth.uid() then
    raise exception 'Percobaan tes tidak ditemukan.' using errcode = '42501';
  end if;
  if a.finished_at is null then
    if now() <= a.deadline + public.test_grace() then
      perform public.save_test_answers(a.id, coalesce(p_answers, '{}'::jsonb));
      perform public.finalize_test_attempt(a.id, 'submitted');
    else
      perform public.finalize_test_attempt(a.id, 'timeout');
    end if;
    select * into a from public.test_attempts t where t.id = p_attempt_id;
  end if;
  return query
    select k.id, k.answer, k.explanation,
           coalesce((a.answers ->> k.id::text) ~ '^\d+$'
                    and (a.answers ->> k.id::text)::int = k.answer, false)
    from public.test_answer_key(a.test_kind, a.test_ref) k
    order by k.position;
end;
$$;

-- 8. Bersih-bersih & hak eksekusi --------------------------------------------
drop function if exists public.can_take_test(text, text);

revoke execute on function public.test_time_limit(text, text) from public, anon, authenticated;
revoke execute on function public.finalize_test_attempt(bigint, text) from public, anon, authenticated;
revoke execute on function public.finalize_expired_test_attempts(uuid) from public, anon, authenticated;
revoke execute on function public.finalize_my_expired_tests() from public, anon;
revoke execute on function public.finalize_all_expired_tests() from public, anon;
revoke execute on function public.start_test(text, text, bigint) from public, anon;
revoke execute on function public.my_open_test_attempt() from public, anon;
revoke execute on function public.get_test_questions(text, text) from public, anon;
revoke execute on function public.save_test_answers(bigint, jsonb) from public, anon;
revoke execute on function public.grade_test(bigint, jsonb) from public, anon;
grant execute on function public.finalize_my_expired_tests() to authenticated;
grant execute on function public.finalize_all_expired_tests() to authenticated;
grant execute on function public.start_test(text, text, bigint) to authenticated;
grant execute on function public.my_open_test_attempt() to authenticated;
grant execute on function public.get_test_questions(text, text) to authenticated;
grant execute on function public.save_test_answers(bigint, jsonb) to authenticated;
grant execute on function public.grade_test(bigint, jsonb) to authenticated;
