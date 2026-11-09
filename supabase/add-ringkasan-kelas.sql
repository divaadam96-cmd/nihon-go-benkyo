-- Ringkasan kelas untuk Sensei/Operator di halaman Ringkasan (index.html):
-- posisi pelajaran tiap siswa, pelajaran tuntas, nilai tugas, materi yang
-- dipahami, keaktifan, dan siapa yang perlu perhatian.
-- Jalankan SETELAH add-pantau-siswa.sql (require_staff, activity_streak,
-- srs_mastered_box) dan add-target-bab.sql (bab_targets, target_bab_kkm),
-- di SQL Editor Supabase (atau `supabase db query --linked -f
-- supabase/add-ringkasan-kelas.sql`). Aman dijalankan ulang.
--
-- "Tuntas" per pelajaran = sama dengan isComplete() di js/tugas-bab.js:
-- materi ditandai paham + 8 tugas dikerjakan + rata-rata >= KKM, dan untuk
-- Pelajaran 5, 10, ..., 50 juga lulus Ujian ulang - kecuali siswa sudah
-- punya hasil di pelajaran sesudahnya (ujianWajib). Pelajaran saat ini =
-- pelajaran paling awal yang belum tuntas (frontierBab).

create or replace function public.ringkasan_kelas()
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_today date := (now() at time zone 'utc')::date;
  v_kkm int := public.target_bab_kkm();
begin
  perform public.require_staff();
  return (
    with siswa as (
      select p.id, p.full_name from public.profiles p where p.role = 'siswa'
    ),
    per_bab as (
      select t.siswa_id, t.bab,
             bool_or(t.target = 'materi') as materi,
             count(*) filter (where t.target not in ('materi', 'ujian-ulang'))::int as dikerjakan,
             floor(coalesce(sum(t.skor_terbaik) filter (where t.target not in ('materi', 'ujian-ulang')), 0) / 8.0)::int as rata,
             bool_or(t.target = 'ujian-ulang' and t.lulus) as ujian,
             count(*) filter (where t.target not in ('materi', 'ujian-ulang')
                                and t.percobaan >= 3 and t.skor_terbaik < v_kkm)::int as sulit,
             max(t.updated_at) as terakhir
      from public.bab_targets t
      join siswa s on s.id = t.siswa_id
      group by t.siswa_id, t.bab
    ),
    maks as (
      select siswa_id, max(bab) as maxbab from per_bab group by siswa_id
    ),
    tuntas as (
      select p.*, (p.materi and p.dikerjakan = 8 and p.rata >= v_kkm
                   and (p.bab % 5 <> 0 or p.ujian or m.maxbab > p.bab)) as ok
      from per_bab p join maks m using (siswa_id)
    ),
    posisi as (
      select s.id as siswa_id,
             coalesce((select min(b) from generate_series(1, 50) b
                       where not exists (select 1 from tuntas t where t.siswa_id = s.id and t.bab = b and t.ok)), 50) as pelajaran,
             (select count(*) from tuntas t where t.siswa_id = s.id and t.ok)::int as jumlah_tuntas,
             (select coalesce(sum(t.sulit), 0) from tuntas t where t.siswa_id = s.id)::int as sulit,
             (select max(t.terakhir) from tuntas t where t.siswa_id = s.id) as tugas_terakhir
      from siswa s
    ),
    nilai as (
      select t.siswa_id, round(avg(t.skor_terbaik))::int as rata_tugas
      from public.bab_targets t join siswa s on s.id = t.siswa_id
      where t.target not in ('materi', 'ujian-ulang')
      group by t.siswa_id
    ),
    materi as (
      select r.user_id, count(*) filter (where r.box >= public.srs_mastered_box())::int as paham
      from public.srs_progress r join siswa s on s.id = r.user_id
      where r.item_id like 'materi:%'
      group by r.user_id
    ),
    aktif as (
      select a.user_id, max(a.activity_date) as d
      from public.activity_log a join siswa s on s.id = a.user_id
      where a.count > 0 group by a.user_id
    ),
    tes as (
      select q.user_id, max((q.created_at at time zone 'utc')::date) as d
      from public.quiz_results q join siswa s on s.id = q.user_id group by q.user_id
    ),
    data as (
      select s.id, s.full_name, po.pelajaran, po.jumlah_tuntas, po.sulit,
             coalesce(m.paham, 0) as materi_paham, n.rata_tugas,
             public.activity_streak(s.id) as streak,
             greatest(a.d, te.d, (po.tugas_terakhir at time zone 'utc')::date) as terakhir,
             cur.dikerjakan as cur_dikerjakan, cur.rata as cur_rata
      from siswa s
      join posisi po on po.siswa_id = s.id
      left join nilai n on n.siswa_id = s.id
      left join materi m on m.user_id = s.id
      left join aktif a on a.user_id = s.id
      left join tes te on te.user_id = s.id
      left join tuntas cur on cur.siswa_id = s.id and cur.bab = po.pelajaran
    ),
    lengkap as (
      select d.*,
             array_remove(array[
               case when d.terakhir is null then 'Belum pernah belajar' end,
               case when d.terakhir is not null and v_today - d.terakhir >= 7
                    then format('Tidak aktif %s hari', v_today - d.terakhir) end,
               case when d.cur_dikerjakan = 8 and d.cur_rata < v_kkm
                    then format('Rata-rata Pelajaran %s masih %s (KKM %s)', d.pelajaran, d.cur_rata, v_kkm) end,
               case when d.sulit >= 3
                    then format('%s tugas sudah dicoba 3x lebih tapi belum %s', d.sulit, v_kkm) end
             ], null) as perhatian
      from data d
    )
    select jsonb_build_object(
      'kkm', v_kkm,
      'hari_ini', v_today,
      'total_siswa', (select count(*) from lengkap),
      'aktif_7', (select count(*) from lengkap where terakhir >= v_today - 6),
      'aktif_hari_ini', (select count(*) from lengkap where terakhir = v_today),
      'rata_tuntas', (select round(avg(jumlah_tuntas), 1) from lengkap),
      'rata_tugas', (select round(avg(rata_tugas)) from lengkap where rata_tugas is not null),
      'siswa', coalesce((select jsonb_agg(jsonb_build_object(
                 'id', l.id, 'nama', l.full_name, 'pelajaran', l.pelajaran,
                 'tuntas', l.jumlah_tuntas, 'materi_paham', l.materi_paham,
                 'rata_tugas', l.rata_tugas, 'streak', l.streak, 'terakhir', l.terakhir,
                 'perhatian', to_jsonb(l.perhatian)) order by l.full_name)
               from lengkap l), '[]'::jsonb),
      'tersulit', coalesce((select jsonb_agg(x order by x.rata, x.bab) from (
                 select t.bab, round(avg(t.skor_terbaik))::int as rata,
                        count(distinct t.siswa_id)::int as siswa
                 from public.bab_targets t join siswa s on s.id = t.siswa_id
                 where t.target not in ('materi', 'ujian-ulang')
                 group by t.bab
                 order by 2, 1
                 limit 5) x), '[]'::jsonb)
    )
  );
end;
$$;
revoke execute on function public.ringkasan_kelas() from public, anon;
grant execute on function public.ringkasan_kelas() to authenticated;
