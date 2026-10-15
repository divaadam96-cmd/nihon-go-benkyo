-- Pantau Siswa versi server: ringkasan & detail progres siswa dihitung di
-- database, bukan dengan mengunduh seluruh baris srs_progress tiap siswa
-- ke browser Sensei (lambat, dan terpotong di 1000 baris - lihat kasus
-- siswa dengan >1000 item yang tampak "ter-reset").
--
-- Semua fungsi di sini khusus Sensei/Operator (dicek di dalam fungsi) dan
-- memakai tanggal UTC, sama dengan srs_review() & srsToday() di js/srs.js.
-- Jalankan di SQL Editor SETELAH fix-3-xp-streak-server.sql. Aman
-- dijalankan ulang.

-- Bersihkan item hafalan format lama "hafalan:bab<N>:<kata>" (sebelum
-- dipisah jadi -kosakata/-kanji): srs_review() sudah menolak format ini,
-- jadi item-item itu tidak bisa diulas lagi tapi tetap terhitung
-- "dipelajari"/"perlu diulang". Per Okt 2026 hanya 10 baris di akun uji.
delete from public.srs_progress where item_id ~ '^hafalan:bab[0-9]+:';

-- Batas "dikuasai" = SRS_MASTERED_BOX di js/srs.js.
create or replace function public.srs_mastered_box()
returns int language sql immutable as $$ select 3 $$;

-- XP satu sesi tes = quizXpForRow() di js/quiz-results.js
-- (100% benar = 20 XP). Dihitung pakai float seperti di browser supaya
-- pembulatannya sama persis dengan XP yang dilihat siswa di dashboard.
create or replace function public.quiz_xp(p_correct int, p_total int)
returns int language sql immutable as $$
  select case when coalesce(p_total, 0) = 0 then 0
              else round((p_correct::float8 / p_total * 100 / 5)::numeric)::int end
$$;

create or replace function public.quiz_percent(p_correct int, p_total int)
returns int language sql immutable as $$
  select case when coalesce(p_total, 0) = 0 then 0
              else round((p_correct::float8 / p_total * 100)::numeric)::int end
$$;

create or replace function public.require_staff()
returns void language plpgsql stable security definer set search_path = public as $$
begin
  if coalesce(public.current_user_role(), '') not in ('sensei', 'operator') then
    raise exception 'Khusus Sensei/Operator.' using errcode = '42501';
  end if;
end;
$$;
revoke execute on function public.require_staff() from public, anon, authenticated;

-- Streak = jumlah hari berturut-turut ada ulasan, berakhir hari ini - atau
-- kemarin kalau hari ini belum belajar (sama dengan srsStreak() di srs.js).
create or replace function public.activity_streak(p_user uuid)
returns int language sql stable security definer set search_path = public as $$
  with days as (
    select activity_date as d from public.activity_log
    where user_id = p_user and count > 0
  ),
  anchor as (
    select case
      when exists (select 1 from days where d = (now() at time zone 'utc')::date)
        then (now() at time zone 'utc')::date
      when exists (select 1 from days where d = (now() at time zone 'utc')::date - 1)
        then (now() at time zone 'utc')::date - 1
    end as a
  ),
  islands as (
    select d, d - (row_number() over (order by d))::int as grp from days
  )
  select coalesce((
    select count(*)::int from islands
    where grp = (select i.grp from islands i, anchor where i.d = anchor.a)
  ), 0)
$$;
revoke execute on function public.activity_streak(uuid) from public, anon, authenticated;

-- Satu baris per siswa untuk kartu di Pantau Siswa.
drop function if exists public.pantau_ringkasan();
create function public.pantau_ringkasan()
returns table (
  id uuid, full_name text, email text,
  kanji_studied int, kanji_mastered int, kanji_due int,
  materi_studied int, materi_mastered int, materi_due int,
  hafalan_studied int, hafalan_mastered int, hafalan_due int,
  review_count int, last_active date, streak int, xp int,
  quiz_count int, quiz_avg int, last_quiz_pct int, ungraded int
)
language plpgsql stable security definer set search_path = public as $$
declare
  v_today date := (now() at time zone 'utc')::date;
begin
  perform public.require_staff();
  return query
  with srs as (
    select s.user_id, split_part(s.item_id, ':', 1) as ns,
           count(*)::int as studied,
           count(*) filter (where s.box >= public.srs_mastered_box())::int as mastered,
           count(*) filter (where s.reviews > 0 and (s.due is null or s.due <= v_today))::int as due
    from public.srs_progress s
    group by 1, 2
  ),
  act as (
    select a.user_id, sum(a.count)::int as reviews, max(a.activity_date) as last_active
    from public.activity_log a group by 1
  ),
  quiz as (
    select q.user_id, count(*)::int as n,
           sum(public.quiz_xp(q.correct_count, q.total_count))::int as xp,
           round(avg(public.quiz_percent(q.correct_count, q.total_count)))::int as avg_pct,
           (array_agg(public.quiz_percent(q.correct_count, q.total_count) order by q.created_at desc))[1] as last_pct
    from public.quiz_results q group by 1
  ),
  ungraded as (
    select u.siswa_id, count(*)::int as n
    from public.assignment_submissions u where u.graded_at is null group by 1
  )
  select p.id, p.full_name, p.email,
    coalesce(k.studied, 0), coalesce(k.mastered, 0), coalesce(k.due, 0),
    coalesce(m.studied, 0), coalesce(m.mastered, 0), coalesce(m.due, 0),
    coalesce(h.studied, 0), coalesce(h.mastered, 0), coalesce(h.due, 0),
    coalesce(act.reviews, 0), act.last_active, public.activity_streak(p.id),
    coalesce(act.reviews, 0) * 5 + coalesce(quiz.xp, 0),
    coalesce(quiz.n, 0), quiz.avg_pct, quiz.last_pct, coalesce(ungraded.n, 0)
  from public.profiles p
  left join srs k on k.user_id = p.id and k.ns = 'kanji'
  left join srs m on m.user_id = p.id and m.ns = 'materi'
  left join srs h on h.user_id = p.id and h.ns = 'hafalan'
  left join act on act.user_id = p.id
  left join quiz on quiz.user_id = p.id
  left join ungraded on ungraded.siswa_id = p.id
  where p.role = 'siswa'
  order by p.full_name;
end;
$$;
revoke execute on function public.pantau_ringkasan() from public, anon;
grant execute on function public.pantau_ringkasan() to authenticated;

-- Ringkasan tes seluruh siswa N hari terakhir: rata-rata nilai dan
-- benar/total per bagian soal (category_scores dari grade_test), untuk
-- melihat bagian mana yang paling banyak salah se-kelas.
create or replace function public.pantau_kelas(p_days int default 30)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  perform public.require_staff();
  return (
    with recent as (
      select q.* from public.quiz_results q
      join public.profiles p on p.id = q.user_id and p.role = 'siswa'
      where q.created_at >= now() - make_interval(days => greatest(p_days, 1))
    )
    select jsonb_build_object(
      'days', greatest(p_days, 1),
      'quiz_count', (select count(*) from recent),
      'student_count', (select count(distinct user_id) from recent),
      'avg_pct', (select round(avg(public.quiz_percent(correct_count, total_count))) from recent),
      'categories', coalesce((
        select jsonb_agg(c order by c.correct::float8 / nullif(c.total, 0), c.label)
        from (
          select e.key as label,
                 sum(coalesce((e.value ->> 'correct')::int, 0))::int as correct,
                 sum(coalesce((e.value ->> 'total')::int, 0))::int as total
          from recent r, jsonb_each(coalesce(r.category_scores, '{}'::jsonb)) e
          group by e.key
          having sum(coalesce((e.value ->> 'total')::int, 0)) > 0
        ) c
      ), '[]'::jsonb)
    )
  );
end;
$$;
revoke execute on function public.pantau_kelas(int) from public, anon;
grant execute on function public.pantau_kelas(int) to authenticated;

-- ============================================================
-- Riwayat reset progres + cadangan supaya reset bisa dipulihkan.
-- Reset hanya lewat reset_student_progress() (tercatat siapa & kapan);
-- hak DELETE langsung staf ke srs_progress/activity_log dicabut.
-- ============================================================
create table if not exists public.progress_resets (
  id bigserial primary key,
  siswa_id uuid not null references auth.users (id) on delete cascade,
  reset_by uuid references auth.users (id) on delete set null,
  reset_at timestamptz not null default now(),
  item_count int not null,
  restored_at timestamptz,
  restored_by uuid references auth.users (id) on delete set null
);
create index if not exists progress_resets_siswa_idx on public.progress_resets (siswa_id, reset_at desc);

create table if not exists public.progress_reset_items (
  reset_id bigint not null references public.progress_resets (id) on delete cascade,
  item_id text not null,
  box int not null,
  due date,
  reviews int not null,
  last_result text,
  last_reviewed_at date,
  primary key (reset_id, item_id)
);

-- Tanpa policy: hanya bisa diakses lewat fungsi di bawah.
alter table public.progress_resets enable row level security;
alter table public.progress_reset_items enable row level security;

drop policy if exists "srs_progress_staff_delete" on public.srs_progress;
drop policy if exists "activity_log_staff_delete" on public.activity_log;

create or replace function public.reset_student_progress(p_siswa uuid)
returns bigint
language plpgsql security definer set search_path = public as $$
declare
  v_reset_id bigint;
  v_count int;
begin
  perform public.require_staff();
  if not exists (select 1 from public.profiles where id = p_siswa and role = 'siswa') then
    raise exception 'Siswa tidak ditemukan.' using errcode = '22023';
  end if;
  select count(*) into v_count from public.srs_progress where user_id = p_siswa;
  insert into public.progress_resets (siswa_id, reset_by, item_count)
    values (p_siswa, auth.uid(), v_count)
    returning id into v_reset_id;
  insert into public.progress_reset_items (reset_id, item_id, box, due, reviews, last_result, last_reviewed_at)
    select v_reset_id, item_id, box, due, reviews, last_result, last_reviewed_at
    from public.srs_progress where user_id = p_siswa;
  delete from public.srs_progress where user_id = p_siswa;
  return v_reset_id;
end;
$$;
revoke execute on function public.reset_student_progress(uuid) from public, anon;
grant execute on function public.reset_student_progress(uuid) to authenticated;

-- Item yang sudah dipelajari lagi setelah reset tetap memakai progres
-- terbarunya; sisanya dikembalikan dari cadangan. Mengembalikan jumlah
-- item yang dipulihkan.
create or replace function public.restore_student_progress(p_reset_id bigint)
returns int
language plpgsql security definer set search_path = public as $$
declare
  v_reset public.progress_resets;
  v_count int;
begin
  perform public.require_staff();
  select * into v_reset from public.progress_resets where id = p_reset_id for update;
  if not found then
    raise exception 'Riwayat reset tidak ditemukan.' using errcode = '22023';
  end if;
  if v_reset.restored_at is not null then
    raise exception 'Reset ini sudah dipulihkan.' using errcode = '22023';
  end if;
  insert into public.srs_progress (user_id, item_id, box, due, reviews, last_result, last_reviewed_at)
    select v_reset.siswa_id, item_id, box, due, reviews, last_result, last_reviewed_at
    from public.progress_reset_items where reset_id = p_reset_id
    on conflict (user_id, item_id) do nothing;
  get diagnostics v_count = row_count;
  update public.progress_resets set restored_at = now(), restored_by = auth.uid() where id = p_reset_id;
  return v_count;
end;
$$;
revoke execute on function public.restore_student_progress(bigint) from public, anon;
grant execute on function public.restore_student_progress(bigint) to authenticated;

-- ============================================================
-- Detail satu siswa (dibuka saat kartunya diklik). Angka ringkasnya tetap
-- dari pantau_ringkasan().
-- ============================================================
drop function if exists public.pantau_detail(uuid);
create function public.pantau_detail(p_siswa uuid)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_today date := (now() at time zone 'utc')::date;
begin
  perform public.require_staff();
  return jsonb_build_object(
    -- 6 minggu terakhir, minggu ini paling akhir (sama dengan
    -- srsWeeklyActivity() di js/srs.js): jumlah ulasan & hari aktif.
    'weekly', (
      select jsonb_agg(jsonb_build_object('reviews', coalesce(t.reviews, 0), 'days', coalesce(t.days, 0)) order by w)
      from generate_series(0, 5) w
      left join (
        select 5 - (v_today - a.activity_date) / 7 as week, sum(a.count)::int as reviews,
               count(*) filter (where a.count > 0)::int as days
        from public.activity_log a
        where a.user_id = p_siswa and a.activity_date between v_today - 41 and v_today
        group by 1
      ) t on t.week = w
    ),
    -- Per pelajaran Materi (Buku 1 = Pel. 1-25, Buku 2 = Pel. 26-50, sama
    -- dengan describeItemId di pantau.js) dan per bab Hafalan.
    'lessons', coalesce((
      select jsonb_agg(l order by l.kind, l.no)
      from (
        select g.kind, g.no, count(*)::int as studied,
               count(*) filter (where g.box >= public.srs_mastered_box())::int as mastered,
               count(*) filter (where g.reviews > 0 and (g.due is null or g.due <= v_today))::int as due
        from (
          select 'materi' as kind,
                 split_part(s.item_id, ':', 3)::int
                   + case split_part(s.item_id, ':', 2) when 'book1' then 1 else 26 end as no,
                 s.box, s.reviews, s.due
          from public.srs_progress s
          where s.user_id = p_siswa and s.item_id ~ '^materi:book[12]:[0-9]+:'
          union all
          select 'hafalan', substring(s.item_id from '^hafalan:bab([0-9]+)-')::int, s.box, s.reviews, s.due
          from public.srs_progress s
          where s.user_id = p_siswa and s.item_id ~ '^hafalan:bab[0-9]+-'
        ) g
        group by g.kind, g.no
      ) l
    ), '[]'::jsonb),
    -- Sudah pernah diulas tapi box masih rendah: box naik, lalu paling
    -- sering dicoba duluan (paling perlu dibantu Sensei).
    'weak_items', coalesce((
      select jsonb_agg(w order by w.box, w.reviews desc, w.item_id)
      from (
        select s.item_id, s.box, s.reviews, s.due from public.srs_progress s
        where s.user_id = p_siswa and s.reviews > 0
        order by s.box, s.reviews desc, s.item_id
        limit 6
      ) w
    ), '[]'::jsonb),
    'quizzes', coalesce((
      select jsonb_agg(q order by q.created_at desc)
      from (
        select r.id, r.correct_count, r.total_count, r.category_scores, r.created_at, r.finish_reason
        from public.quiz_results r where r.user_id = p_siswa
      ) q
    ), '[]'::jsonb),
    'resets', coalesce((
      select jsonb_agg(x order by x.reset_at desc)
      from (
        select r.id, r.reset_at, r.item_count, r.restored_at,
               (select full_name from public.profiles where id = r.reset_by) as reset_by_name,
               (select full_name from public.profiles where id = r.restored_by) as restored_by_name
        from public.progress_resets r where r.siswa_id = p_siswa
      ) x
    ), '[]'::jsonb)
  );
end;
$$;
revoke execute on function public.pantau_detail(uuid) from public, anon;
grant execute on function public.pantau_detail(uuid) to authenticated;
