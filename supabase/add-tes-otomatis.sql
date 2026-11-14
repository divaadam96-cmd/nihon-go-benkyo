-- Tes Kemampuan terbuka otomatis mengikuti kemajuan siswa + permintaan
-- akses paket ujian + poin Prestasi dari tes.
--
-- Jalankan SETELAH fix-2-batas-waktu-server.sql, add-test-packages.sql,
-- add-editor-soal.sql, add-target-bab.sql, add-ujian-ulang.sql dan
-- add-prestasi.sql, add-pantau-siswa.sql dan fix-6-riwayat-perubahan-soal.sql,
-- di SQL Editor Supabase (atau `supabase db query
-- --linked -f supabase/add-tes-otomatis.sql`). Aman dijalankan ulang.
--
-- Aturan (khusus SISWA; Sensei/Operator tetap bebas mencoba):
--   * Tes per 5 Bab (Bab a-(a+4)) terbuka sendiri setelah siswa tuntas
--     sampai Pelajaran a+4. Paket berlevel N5 terbuka setelah tuntas
--     sampai Pelajaran 25, paket N4 setelah Pelajaran 50. Paket tanpa
--     level hanya bisa lewat akses dari Sensei.
--   * "Tuntas sampai N" = Pelajaran 1..N semuanya tuntas (aturan sama
--     dengan isComplete()/frontierBab() di js/tugas-bab.js).
--   * Tes yang terbuka otomatis boleh dikerjakan 1 kali per hari (WIB) per
--     tes. Akses dari Sensei tetap = satu percobaan, di luar batas ini.
--   * Nilai tes TIDAK memengaruhi kunci pelajaran; hanya menambah poin
--     Prestasi: nilai terbaik tiap tes (0-100) + bonus kalau >= 80
--     (50 untuk Tes per 5 Bab, 100 untuk paket).
--   * Siswa boleh meminta akses paket yang belum terbuka; Sensei/Operator
--     menyetujui (otomatis jadi akses tes satu kali) atau menolak.

-- 1. Level paket -------------------------------------------------------------
alter table public.test_packages
  add column if not exists level text check (level in ('n5', 'n4'));
update public.test_packages set level = 'n5'
  where level is null and (key like 'jlpt-n5-%' or key = 'd03');
update public.test_packages set level = 'n4'
  where level is null and key like 'jlpt-n4-%';

-- Pelajaran yang harus tuntas untuk membuka level paket.
create or replace function public.tes_level_bab(p_level text)
returns int language sql immutable as $$
  select case p_level when 'n5' then 25 when 'n4' then 50 end
$$;

drop function if exists public.list_test_packages();
create function public.list_test_packages()
returns table (
  key text, label text, mark text, description text,
  time_limit_minutes int, one_page boolean, "position" int, active boolean,
  question_count int, level text
)
language sql
security definer
set search_path = public
stable
as $$
  select p.key, p.label, p.mark, p.description, p.time_limit_minutes,
         p.one_page, p.position, p.active,
         (select count(*)::int from public.package_questions q where q.package_key = p.key),
         p.level
  from public.test_packages p
  order by p.position, p.key;
$$;
revoke execute on function public.list_test_packages() from public, anon;
grant execute on function public.list_test_packages() to authenticated;

-- Operator mengatur level paket dari Kelola Soal (langsung tersimpan, di
-- luar draft soal). p_level null = hanya lewat akses Sensei.
create or replace function public.atur_level_paket(p_key text, p_level text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  perform public.require_operator();
  if p_level is not null and p_level not in ('n5', 'n4') then
    raise exception 'Level tidak dikenal.' using errcode = '22023';
  end if;
  update public.test_packages set level = p_level where key = p_key;
  if not found then
    raise exception 'Paket belum diterbitkan.' using errcode = 'P0002';
  end if;
end;
$$;
revoke execute on function public.atur_level_paket(text, text) from public, anon;
grant execute on function public.atur_level_paket(text, text) to authenticated;

-- 2. Pelajaran tuntas (satu rumus untuk tes & Prestasi) ----------------------
-- Sama dengan isComplete() di js/tugas-bab.js: materi ditandai paham + 8
-- tugas dikerjakan + rata-rata >= KKM, dan untuk Pelajaran 5, 10, ..., 50
-- juga lulus Ujian ulang - kecuali siswa sudah punya hasil di pelajaran
-- sesudahnya. (ringkasan_kelas() memakai rumus yang sama secara massal
-- untuk semua siswa sekaligus.)
create or replace function public.bab_tuntas(p_siswa uuid)
returns table (bab int)
language sql stable security definer set search_path = public as $$
  with per_bab as (
    select t.bab,
           bool_or(t.target = 'materi') as materi,
           count(*) filter (where t.target not in ('materi', 'ujian-ulang')) as dikerjakan,
           floor(coalesce(sum(t.skor_terbaik) filter (where t.target not in ('materi', 'ujian-ulang')), 0) / 8.0) as rata,
           bool_or(t.target = 'ujian-ulang' and t.lulus) as ujian
    from public.bab_targets t where t.siswa_id = p_siswa group by t.bab
  )
  select p.bab from per_bab p
  where p.materi and p.dikerjakan = 8 and p.rata >= public.target_bab_kkm()
    and (p.bab % 5 <> 0 or p.ujian or exists (select 1 from per_bab q where q.bab > p.bab))
$$;
revoke execute on function public.bab_tuntas(uuid) from public, anon, authenticated;

-- Pelajaran terakhir yang tuntas berurutan dari Pelajaran 1 (0 = belum ada).
create or replace function public.bab_tuntas_sampai(p_siswa uuid)
returns int
language sql stable security definer set search_path = public as $$
  select coalesce((select min(b) from generate_series(1, 50) b
                   where b not in (select t.bab from public.bab_tuntas(p_siswa) t)), 51) - 1
$$;
revoke execute on function public.bab_tuntas_sampai(uuid) from public, anon, authenticated;

-- 3. Syarat & batas percobaan ---------------------------------------------------
-- Pelajaran yang harus tuntas untuk membuka tes ini secara otomatis;
-- null = tidak terbuka otomatis (hanya lewat akses Sensei).
create or replace function public.tes_syarat_bab(p_kind text, p_ref text)
returns int
language sql stable security definer set search_path = public as $$
  select case
    when p_kind = 'bab' and p_ref ~ '^[0-9]{1,2}$' and p_ref::int between 1 and 46
         and (p_ref::int - 1) % 5 = 0 then p_ref::int + 4
    when p_kind = 'paket' then
      (select public.tes_level_bab(t.level) from public.test_packages t where t.key = p_ref and t.active)
  end
$$;
revoke execute on function public.tes_syarat_bab(text, text) from public, anon, authenticated;

-- Hari kalender WIB (batas 1 percobaan per hari).
create or replace function public.tes_hari(p_waktu timestamptz)
returns date language sql immutable as $$
  select (p_waktu at time zone 'Asia/Jakarta')::date
$$;

create index if not exists test_attempts_user_test
  on public.test_attempts (user_id, test_kind, test_ref);

-- 4. Membuka tes (versi baru) ----------------------------------------------------
-- Siswa: lewat akses Sensei (p_assignment_id) seperti sebelumnya, ATAU
-- tanpa akses kalau tes sudah terbuka otomatis (1x per hari; percobaan yang
-- masih berjalan dilanjutkan).
create or replace function public.start_test(p_kind text, p_ref text, p_assignment_id bigint default null)
returns table (attempt_id bigint, started_at timestamptz, deadline timestamptz, server_now timestamptz, answers jsonb)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_staff boolean := coalesce(public.current_user_role() in ('sensei', 'operator'), false);
  v_syarat int;
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
  elsif p_assignment_id is not null then
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
  else
    v_syarat := public.tes_syarat_bab(p_kind, p_ref);
    if v_syarat is null or public.bab_tuntas_sampai(v_uid) < v_syarat then
      raise exception 'Tes ini belum terbuka untukmu.' using errcode = '42501';
    end if;
    -- Cegah dua percobaan dari klik ganda / dua tab.
    perform pg_advisory_xact_lock(hashtext(v_uid::text || ':' || p_kind || ':' || p_ref));
    select * into a from public.test_attempts t
      where t.user_id = v_uid and t.assignment_id is null and t.test_kind = p_kind
        and t.test_ref = p_ref and t.finished_at is null
      order by t.started_at desc limit 1;
    if not found then
      if exists (select 1 from public.test_attempts t
                 where t.user_id = v_uid and t.assignment_id is null and t.test_kind = p_kind
                   and t.test_ref = p_ref and public.tes_hari(t.started_at) = public.tes_hari(now())) then
        raise exception 'Tes ini sudah dikerjakan hari ini. Coba lagi besok.' using errcode = 'P0001';
      end if;
      insert into public.test_attempts (user_id, test_kind, test_ref, deadline)
      values (v_uid, p_kind, p_ref, now() + public.test_time_limit(p_kind, p_ref))
      returning * into a;
    end if;
  end if;

  return query select a.id, a.started_at, a.deadline, now(), a.answers;
end;
$$;

-- Percobaan siswa yang masih berjalan (termasuk tes yang terbuka otomatis).
-- Percobaan pratinjau staf tidak dilanjutkan otomatis.
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
    where t.user_id = auth.uid() and t.finished_at is null
      and (t.assignment_id is not null or coalesce(public.current_user_role(), '') = 'siswa')
    order by t.started_at desc
    limit 1;
end;
$$;

-- 5. Permintaan akses paket -------------------------------------------------------
create table if not exists public.test_requests (
  id bigserial primary key,
  siswa_id uuid not null references auth.users (id) on delete cascade,
  package_key text not null references public.test_packages (key) on update cascade on delete cascade,
  status text not null default 'menunggu' check (status in ('menunggu', 'disetujui', 'ditolak')),
  alasan text check (char_length(alasan) <= 300),
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references auth.users (id) on delete set null,
  assignment_id bigint references public.assignments (id) on delete set null
);
create unique index if not exists test_requests_satu_menunggu
  on public.test_requests (siswa_id, package_key) where status = 'menunggu';
create index if not exists test_requests_siswa on public.test_requests (siswa_id, created_at desc);
-- Tanpa policy: hanya lewat fungsi di bawah.
alter table public.test_requests enable row level security;
revoke all on public.test_requests from anon, authenticated;
revoke all on sequence public.test_requests_id_seq from anon, authenticated;

create or replace function public.minta_akses_tes(p_paket text)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_syarat int;
begin
  if v_uid is null or coalesce(public.current_user_role(), '') <> 'siswa' then
    raise exception 'Khusus siswa.' using errcode = '42501';
  end if;
  if not exists (select 1 from public.test_packages t where t.key = p_paket and t.active)
     or not exists (select 1 from public.package_questions q where q.package_key = p_paket) then
    raise exception 'Paket tidak tersedia.' using errcode = 'P0002';
  end if;
  v_syarat := public.tes_syarat_bab('paket', p_paket);
  if v_syarat is not null and public.bab_tuntas_sampai(v_uid) >= v_syarat then
    raise exception 'Paket ini sudah terbuka untukmu.' using errcode = 'P0001';
  end if;
  if exists (select 1 from public.assignments x where x.siswa_id = v_uid and not x.completed
               and x.test_kind = 'paket' and x.test_ref = p_paket) then
    raise exception 'Kamu sudah punya akses untuk paket ini.' using errcode = 'P0001';
  end if;
  if exists (select 1 from public.test_requests r where r.siswa_id = v_uid and r.package_key = p_paket
               and r.status = 'menunggu') then
    raise exception 'Permintaanmu untuk paket ini masih menunggu jawaban Sensei.' using errcode = 'P0001';
  end if;
  if (select count(*) from public.test_requests r where r.siswa_id = v_uid and r.status = 'menunggu') >= 3 then
    raise exception 'Paling banyak 3 permintaan yang menunggu sekaligus.' using errcode = 'P0001';
  end if;
  insert into public.test_requests (siswa_id, package_key) values (v_uid, p_paket);
end;
$$;
revoke execute on function public.minta_akses_tes(text) from public, anon;
grant execute on function public.minta_akses_tes(text) to authenticated;

-- Permintaan yang menunggu, untuk Pantau Siswa.
create or replace function public.daftar_minta_akses()
returns table (id bigint, siswa_id uuid, package_key text, label text, created_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  perform public.require_staff();
  return query
    select r.id, r.siswa_id, r.package_key, t.label, r.created_at
    from public.test_requests r
    join public.test_packages t on t.key = r.package_key
    join public.profiles p on p.id = r.siswa_id and p.role = 'siswa'
    where r.status = 'menunggu'
    order by r.created_at;
end;
$$;
revoke execute on function public.daftar_minta_akses() from public, anon;
grant execute on function public.daftar_minta_akses() to authenticated;

-- Setujui = buat akses tes satu kali (baris assignments, alur lama);
-- tolak = boleh dengan alasan singkat.
create or replace function public.putuskan_minta_akses(p_id bigint, p_setuju boolean, p_alasan text default null)
returns void
language plpgsql security definer set search_path = public as $$
declare
  r public.test_requests;
  v_assignment bigint;
begin
  perform public.require_staff();
  select * into r from public.test_requests where id = p_id for update;
  if not found or r.status <> 'menunggu' then
    raise exception 'Permintaan tidak ditemukan atau sudah diputuskan.' using errcode = 'P0002';
  end if;
  if p_setuju then
    insert into public.assignments (sensei_id, siswa_id, title, test_kind, test_ref)
    select auth.uid(), r.siswa_id, 'Simulasi Paket · ' || t.label, 'paket', t.key
    from public.test_packages t where t.key = r.package_key
    returning id into v_assignment;
  end if;
  update public.test_requests
    set status = case when p_setuju then 'disetujui' else 'ditolak' end,
        alasan = case when p_setuju then null else nullif(left(btrim(coalesce(p_alasan, '')), 300), '') end,
        decided_at = now(), decided_by = auth.uid(), assignment_id = v_assignment
    where id = p_id;
end;
$$;
revoke execute on function public.putuskan_minta_akses(bigint, boolean, text) from public, anon;
grant execute on function public.putuskan_minta_akses(bigint, boolean, text) to authenticated;

-- 6. Status semua tes untuk satu siswa ----------------------------------------------
-- Dipakai halaman Tes Kemampuan & Beranda (siswa sendiri, p_siswa null) dan
-- Pantau Siswa (staf, p_siswa diisi).
create or replace function public.tes_status(p_siswa uuid default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := coalesce(p_siswa, auth.uid());
  v_sampai int;
begin
  if auth.uid() is null then
    raise exception 'Harus login.' using errcode = '42501';
  end if;
  if v_uid <> auth.uid() then
    perform public.require_staff();
  end if;
  -- Tes yang ditinggal sampai waktunya habis ditutup & dinilai dulu.
  perform public.finalize_expired_test_attempts(v_uid);
  v_sampai := public.bab_tuntas_sampai(v_uid);
  return jsonb_build_object(
    'tuntas_sampai', v_sampai,
    'tes', coalesce((
      with daftar as (
        select 'bab'::text as kind, s::text as ref, format('Tes per 5 Bab · Bab %s–%s', s, s + 4) as label,
               'BAB'::text as mark, format('Soal kanji, partikel, susunan kalimat, dan soal cerita dari Pelajaran %s–%s.', s, s + 4) as deskripsi,
               45 as menit, s + 4 as syarat, s as urut
        from generate_series(1, 46, 5) s
        where exists (select 1 from public.quiz_questions q where q.bab_range = s and q.status = 'published')
        union all
        select 'paket', p.key, p.label, p.mark, p.description, p.time_limit_minutes,
               public.tes_level_bab(p.level), 1000 + p.position
        from public.test_packages p
        where p.active and exists (select 1 from public.package_questions q where q.package_key = p.key)
      ),
      hasil as (
        select a.test_kind, a.test_ref,
               max(public.quiz_percent(r.correct_count, r.total_count)) as terbaik,
               count(*)::int as kali
        from public.test_attempts a join public.quiz_results r on r.id = a.quiz_result_id
        where a.user_id = v_uid
        group by 1, 2
      ),
      hari_ini as (
        select distinct a.test_kind, a.test_ref from public.test_attempts a
        where a.user_id = v_uid and a.assignment_id is null
          and public.tes_hari(a.started_at) = public.tes_hari(now())
      ),
      minta as (
        select distinct on (r.package_key) r.package_key, r.status, r.alasan
        from public.test_requests r where r.siswa_id = v_uid
        order by r.package_key, r.created_at desc
      )
      select jsonb_agg(jsonb_build_object(
               'kind', d.kind, 'ref', d.ref, 'label', d.label, 'mark', d.mark,
               'deskripsi', d.deskripsi, 'menit', d.menit, 'syarat', d.syarat,
               'terbuka', d.syarat is not null and v_sampai >= d.syarat,
               'hari_ini', h.test_kind is not null,
               'terbaik', hs.terbaik, 'kali', coalesce(hs.kali, 0),
               'akses', (select jsonb_agg(jsonb_build_object('id', x.id, 'due_date', x.due_date) order by x.id)
                         from public.assignments x
                         where x.siswa_id = v_uid and not x.completed
                           and x.test_kind = d.kind and x.test_ref = d.ref),
               'permintaan', case when m.package_key is not null
                                  then jsonb_build_object('status', m.status, 'alasan', m.alasan) end)
             order by d.urut)
      from daftar d
      left join hasil hs on hs.test_kind = d.kind and hs.test_ref = d.ref
      left join hari_ini h on h.test_kind = d.kind and h.test_ref = d.ref
      left join minta m on d.kind = 'paket' and m.package_key = d.ref
    ), '[]'::jsonb)
  );
end;
$$;
revoke execute on function public.tes_status(uuid) from public, anon;
grant execute on function public.tes_status(uuid) to authenticated;

-- 7. Poin Prestasi dari tes ------------------------------------------------------------
-- Rumus add-prestasi.sql + komponen 'tes': nilai terbaik tiap tes (0-100)
-- + bonus kalau >= KKM (50 Tes per 5 Bab, 100 paket). Mengulang tes hanya
-- menaikkan nilai terbaik, tidak menimbun poin.
create or replace function public.prestasi_rincian(p_siswa uuid)
returns jsonb
language sql stable security definer set search_path = public as $$
  with t as (
    select * from public.bab_targets where siswa_id = p_siswa
  ),
  tuntas as (
    select b.bab from public.bab_tuntas(p_siswa) b
  ),
  pola as (
    select ((substring(split_part(s.item_id, ':', 2) from '[0-9]+'))::int - 1) * 25
           + split_part(s.item_id, ':', 3)::int + 1 as bab
    from public.srs_progress s
    where s.user_id = p_siswa and s.box >= 1
      and s.item_id ~ '^materi:book[12]:[0-9]+:[0-9]+$'
  ),
  tes as (
    select a.test_kind, a.test_ref, max(public.quiz_percent(r.correct_count, r.total_count)) as terbaik
    from public.test_attempts a join public.quiz_results r on r.id = a.quiz_result_id
    where a.user_id = p_siswa
    group by 1, 2
  ),
  hasil as (
    select coalesce((select sum(skor_terbaik) from t where target not in ('materi', 'ujian-ulang')), 0)::int as tugas,
           (select count(*) from tuntas)::int * 200 as tuntas,
           (select count(*) from t where target = 'ujian-ulang' and lulus)::int * 150 as ujian,
           (select count(*) from pola where bab in (select bab from tuntas))::int * 10 as materi,
           coalesce((select sum(terbaik + case when terbaik >= public.target_bab_kkm()
                                               then case when test_kind = 'bab' then 50 else 100 end
                                               else 0 end) from tes), 0)::int as tes,
           (select count(*) from tuntas)::int as jumlah_tuntas,
           (select count(*) from tes)::int as jumlah_tes
  )
  select jsonb_build_object('tugas', tugas, 'tuntas', tuntas, 'ujian', ujian, 'materi', materi, 'tes', tes,
                            'jumlah_tuntas', jumlah_tuntas, 'jumlah_tes', jumlah_tes,
                            'total', tugas + tuntas + ujian + materi + tes)
  from hasil;
$$;
revoke execute on function public.prestasi_rincian(uuid) from public, anon, authenticated;

-- Hasil tes baru tercatat saat percobaan ditutup (finalize_test_attempt
-- mengisi quiz_result_id) - saat itu poin dihitung ulang.
drop trigger if exists prestasi_test_attempts on public.test_attempts;
create trigger prestasi_test_attempts
  after update of quiz_result_id on public.test_attempts
  for each row when (new.quiz_result_id is not null and old.quiz_result_id is null)
  execute function public.prestasi_trigger();

-- Samakan total semua siswa dengan rumus baru (tidak masuk poin minggu ini).
insert into public.prestasi_total (siswa_id, poin, updated_at)
select p.id, (public.prestasi_rincian(p.id) ->> 'total')::int, now()
from public.profiles p where p.role = 'siswa'
on conflict (siswa_id) do update set poin = excluded.poin, updated_at = excluded.updated_at;
