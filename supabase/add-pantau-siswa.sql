-- Pantau Siswa versi server: ringkasan & detail progres siswa dihitung di
-- database, bukan dengan mengunduh seluruh baris srs_progress tiap siswa
-- ke browser Sensei (lambat, dan terpotong di 1000 baris - lihat kasus
-- siswa dengan >1000 item yang tampak "ter-reset").
--
-- Semua fungsi di sini khusus Sensei/Operator (dicek di dalam fungsi) dan
-- memakai tanggal UTC, sama dengan srs_review() & srsToday() di js/srs.js.
-- Jalankan di SQL Editor SETELAH fix-3-xp-streak-server.sql. Aman
-- dijalankan ulang.

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
  quiz_count int, quiz_avg int, ungraded int
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
           round(avg(public.quiz_percent(q.correct_count, q.total_count)))::int as avg_pct
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
    coalesce(quiz.n, 0), quiz.avg_pct, coalesce(ungraded.n, 0)
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

-- Detail satu siswa (dibuka saat kartunya diklik): item paling lemah dan
-- riwayat tes. Angka ringkasnya tetap dari pantau_ringkasan().
drop function if exists public.pantau_detail(uuid);
create function public.pantau_detail(p_siswa uuid)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  perform public.require_staff();
  return jsonb_build_object(
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
    ), '[]'::jsonb)
  );
end;
$$;
revoke execute on function public.pantau_detail(uuid) from public, anon;
grant execute on function public.pantau_detail(uuid) to authenticated;
