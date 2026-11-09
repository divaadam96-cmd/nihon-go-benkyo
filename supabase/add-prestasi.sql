-- Prestasi & papan peringkat siswa (pages/prestasi.html).
-- Jalankan SETELAH add-pantau-siswa.sql (require_staff, activity_streak),
-- add-target-bab.sql + add-ujian-ulang.sql (bab_targets, target_bab_kkm),
-- di SQL Editor Supabase (atau `supabase db query --linked -f
-- supabase/add-prestasi.sql`). Aman dijalankan ulang: total poin semua
-- siswa disamakan ulang dengan rumus terbaru TANPA dicatat sebagai poin
-- minggu ini.
--
-- Poin prestasi (dihitung di server dari data yang sudah ada):
--   tugas   = jumlah skor terbaik tiap tugas (0-100 per tugas, 8 tugas per
--             pelajaran) - mengulang tugas hanya menaikkan skor terbaik,
--             tidak menimbun poin
--   tuntas  = 200 per pelajaran tuntas (aturan sama dengan isComplete() di
--             js/tugas-bab.js dan ringkasan_kelas())
--   ujian   = 150 per Ujian ulang yang lulus
--   materi  = 10 per pola materi yang sedang ditandai "sudah paham"
--             (srs_progress materi:* box >= 1), HANYA di pelajaran yang
--             sudah tuntas - tombol "sudah paham" diisi siswa sendiri
-- Catatan: skor tugas dikirim browser siswa (catat_target_bab); risiko
-- nilai palsu diterima untuk sementara (keputusan pemilik, Nov 2026).
--
-- Poin minggu ini = jumlah kenaikan/penurunan total sejak Senin 00:00 WIB,
-- dicatat trigger di prestasi_log setiap kali bab_targets atau status
-- pola materi berubah.

-- 1. Rumus poin ---------------------------------------------------------------
create or replace function public.prestasi_rincian(p_siswa uuid)
returns jsonb
language sql stable security definer set search_path = public as $$
  with t as (
    select * from public.bab_targets where siswa_id = p_siswa
  ),
  per_bab as (
    select bab,
           bool_or(target = 'materi') as materi,
           count(*) filter (where target not in ('materi', 'ujian-ulang')) as dikerjakan,
           floor(coalesce(sum(skor_terbaik) filter (where target not in ('materi', 'ujian-ulang')), 0) / 8.0) as rata,
           bool_or(target = 'ujian-ulang' and lulus) as ujian
    from t group by bab
  ),
  tuntas as (
    select p.bab from per_bab p
    where p.materi and p.dikerjakan = 8 and p.rata >= public.target_bab_kkm()
      and (p.bab % 5 <> 0 or p.ujian or exists (select 1 from per_bab q where q.bab > p.bab))
  ),
  pola as (
    select ((substring(split_part(s.item_id, ':', 2) from '[0-9]+'))::int - 1) * 25
           + split_part(s.item_id, ':', 3)::int + 1 as bab
    from public.srs_progress s
    where s.user_id = p_siswa and s.box >= 1
      and s.item_id ~ '^materi:book[12]:[0-9]+:[0-9]+$'
  ),
  hasil as (
    select coalesce((select sum(skor_terbaik) from t where target not in ('materi', 'ujian-ulang')), 0)::int as tugas,
           (select count(*) from tuntas)::int * 200 as tuntas,
           (select count(*) from t where target = 'ujian-ulang' and lulus)::int * 150 as ujian,
           (select count(*) from pola where bab in (select bab from tuntas))::int * 10 as materi,
           (select count(*) from tuntas)::int as jumlah_tuntas
  )
  select jsonb_build_object('tugas', tugas, 'tuntas', tuntas, 'ujian', ujian, 'materi', materi,
                            'jumlah_tuntas', jumlah_tuntas, 'total', tugas + tuntas + ujian + materi)
  from hasil;
$$;
revoke execute on function public.prestasi_rincian(uuid) from public, anon, authenticated;

-- 2. Total & riwayat poin -------------------------------------------------------
-- Tanpa policy: hanya dibaca/ditulis lewat fungsi di file ini.
create table if not exists public.prestasi_total (
  siswa_id uuid primary key references auth.users (id) on delete cascade,
  poin int not null default 0,
  updated_at timestamptz not null default now()
);
create table if not exists public.prestasi_log (
  id bigserial primary key,
  siswa_id uuid not null references auth.users (id) on delete cascade,
  waktu timestamptz not null default now(),
  delta int not null
);
create index if not exists prestasi_log_waktu on public.prestasi_log (waktu, siswa_id);
alter table public.prestasi_total enable row level security;
alter table public.prestasi_log enable row level security;
revoke all on public.prestasi_total from anon, authenticated;
revoke all on public.prestasi_log from anon, authenticated;
revoke all on sequence public.prestasi_log_id_seq from anon, authenticated;

-- Hitung ulang total satu siswa; selisihnya dicatat sebagai poin pada saat ini.
create or replace function public.prestasi_catat(p_siswa uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_baru int;
  v_lama int;
begin
  if p_siswa is null or not exists (select 1 from public.profiles where id = p_siswa and role = 'siswa') then
    return;
  end if;
  v_baru := (public.prestasi_rincian(p_siswa) ->> 'total')::int;
  select poin into v_lama from public.prestasi_total where siswa_id = p_siswa for update;
  if v_lama is not distinct from v_baru then
    return;
  end if;
  insert into public.prestasi_log (siswa_id, delta) values (p_siswa, v_baru - coalesce(v_lama, 0));
  insert into public.prestasi_total (siswa_id, poin, updated_at) values (p_siswa, v_baru, now())
  on conflict (siswa_id) do update set poin = excluded.poin, updated_at = excluded.updated_at;
end;
$$;
revoke execute on function public.prestasi_catat(uuid) from public, anon, authenticated;

create or replace function public.prestasi_trigger()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_table_name = 'bab_targets' then
    perform public.prestasi_catat(coalesce(new.siswa_id, old.siswa_id));
  else
    perform public.prestasi_catat(coalesce(new.user_id, old.user_id));
  end if;
  return null;
end;
$$;
revoke execute on function public.prestasi_trigger() from public, anon, authenticated;

drop trigger if exists prestasi_bab_targets on public.bab_targets;
create trigger prestasi_bab_targets
  after insert or update or delete on public.bab_targets
  for each row execute function public.prestasi_trigger();
-- Hanya status pola materi yang memengaruhi poin (bukan kartu Hafalan/kanji).
drop trigger if exists prestasi_srs_ubah on public.srs_progress;
create trigger prestasi_srs_ubah
  after insert or update on public.srs_progress
  for each row when (new.item_id like 'materi:%')
  execute function public.prestasi_trigger();
drop trigger if exists prestasi_srs_hapus on public.srs_progress;
create trigger prestasi_srs_hapus
  after delete on public.srs_progress
  for each row when (old.item_id like 'materi:%')
  execute function public.prestasi_trigger();

-- Samakan total semua siswa dengan rumus sekarang (tidak masuk poin minggu ini).
insert into public.prestasi_total (siswa_id, poin, updated_at)
select p.id, (public.prestasi_rincian(p.id) ->> 'total')::int, now()
from public.profiles p where p.role = 'siswa'
on conflict (siswa_id) do update set poin = excluded.poin, updated_at = excluded.updated_at;

-- 3. Papan peringkat ------------------------------------------------------------
-- p_jenis: 'poin' (p_periode 'minggu' | 'semua'), 'streak', 'naik' (naik
-- peringkat poin sepanjang waktu sejak awal minggu).
-- Siswa: 10 besar (nama depan saja, tanpa id) + posisinya sendiri + rincian
-- poinnya. Sensei/Operator: semua peserta dengan nama lengkap.
create or replace function public.prestasi_papan(p_jenis text default 'poin', p_periode text default 'minggu')
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_peran text := public.current_user_role();
  v_staf boolean;
  v_mulai timestamptz := date_trunc('week', now() at time zone 'Asia/Jakarta') at time zone 'Asia/Jakarta';
  v_hasil jsonb;
begin
  if v_uid is null or v_peran is null then
    raise exception 'Masuk dulu.' using errcode = '42501';
  end if;
  if p_jenis not in ('poin', 'streak', 'naik') or p_periode not in ('minggu', 'semua') then
    raise exception 'Jenis papan tidak valid.' using errcode = '22023';
  end if;
  v_staf := v_peran in ('sensei', 'operator');
  with siswa as (
    select p.id, p.full_name,
           coalesce(pt.poin, 0) as total,
           coalesce((select sum(l.delta) from public.prestasi_log l where l.siswa_id = p.id and l.waktu >= v_mulai), 0)::int as minggu
    from public.profiles p
    left join public.prestasi_total pt on pt.siswa_id = p.id
    where p.role = 'siswa'
  ),
  naik as (
    select s.id,
           (rank() over (order by s.total - s.minggu desc))::int as dari,
           (rank() over (order by s.total desc))::int as ke
    from siswa s
  ),
  nilai as (
    select s.id, s.full_name, n.dari, n.ke,
           case p_jenis
             when 'poin' then case when p_periode = 'minggu' then s.minggu else s.total end
             when 'streak' then public.activity_streak(s.id)
             else n.dari - n.ke
           end as nilai
    from siswa s join naik n on n.id = s.id
  ),
  urut as (
    select v.*, (rank() over (order by v.nilai desc))::int as posisi,
           row_number() over (order by v.nilai desc, v.full_name) as baris
    from nilai v where v.nilai > 0
  )
  select jsonb_build_object(
    'jenis', p_jenis, 'periode', p_periode, 'mulai_minggu', v_mulai, 'staf', v_staf,
    'peserta', (select count(*) from urut),
    'baris', coalesce((
      select jsonb_agg(jsonb_build_object(
               'posisi', u.posisi, 'nilai', u.nilai, 'saya', u.id = v_uid,
               'nama', case when v_staf then u.full_name else split_part(btrim(u.full_name), ' ', 1) end,
               'id', case when v_staf then u.id end,
               'dari', case when p_jenis = 'naik' then u.dari end,
               'ke', case when p_jenis = 'naik' then u.ke end)
             order by u.baris)
      from urut u where v_staf or u.baris <= 10), '[]'::jsonb),
    'saya', (select jsonb_build_object('posisi', u.posisi, 'nilai', u.nilai, 'dari', u.dari, 'ke', u.ke)
             from urut u where u.id = v_uid),
    'rincian', case when v_peran = 'siswa' then
                 public.prestasi_rincian(v_uid) || jsonb_build_object(
                   'minggu', (select minggu from siswa where id = v_uid),
                   'streak', public.activity_streak(v_uid))
               end
  ) into v_hasil;
  return v_hasil;
end;
$$;
revoke execute on function public.prestasi_papan(text, text) from public, anon;
grant execute on function public.prestasi_papan(text, text) to authenticated;
