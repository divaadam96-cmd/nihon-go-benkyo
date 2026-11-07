-- Pantau Siswa per bab: skor Tugas & target tiap siswa per pelajaran dan
-- soal yang paling sering salah se-kelas.
-- Jalankan SETELAH add-target-bab.sql, add-pantau-siswa.sql (require_staff)
-- dan add-ujian-ulang.sql, di SQL Editor Supabase
-- (atau `supabase db query --linked -f supabase/add-pantau-bab.sql`).
-- Aman dijalankan ulang.

-- 1. Kesalahan per soal ----------------------------------------------------
-- Satu baris = satu siswa x bab x jenis tugas x item (kata, kanji, atau arti
-- kalimat), jumlah = berapa kali salah. Ditulis hanya lewat catat_kesalahan().
create table if not exists public.bab_kesalahan (
  siswa_id uuid not null references auth.users (id) on delete cascade,
  bab int not null check (bab between 1 and 50),
  target text not null check (target in (
    'kotoba-jp-id', 'kotoba-id-jp',
    'kanji-kanji-kana', 'kanji-kana-kanji', 'kanji-kanji-id', 'kanji-id-kanji',
    'kalimat-susun', 'kalimat-pilih'
  )),
  item text not null check (char_length(item) between 1 and 200),
  jumlah int not null default 1,
  terakhir timestamptz not null default now(),
  primary key (siswa_id, bab, target, item)
);
create index if not exists bab_kesalahan_bab_idx on public.bab_kesalahan (bab);

alter table public.bab_kesalahan enable row level security;
drop policy if exists "bab_kesalahan_select_own" on public.bab_kesalahan;
create policy "bab_kesalahan_select_own"
  on public.bab_kesalahan for select
  using (siswa_id = auth.uid());
drop policy if exists "bab_kesalahan_select_staff" on public.bab_kesalahan;
create policy "bab_kesalahan_select_staff"
  on public.bab_kesalahan for select
  using (coalesce(public.current_user_role(), '') in ('sensei', 'operator'));

-- p_items: [{"bab": 3, "target": "kanji-kanji-kana", "item": "本"}, ...]
-- (satu kali menyelesaikan tugas/ujian; item yang sama dihitung sekali).
create or replace function public.catat_kesalahan(p_items jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Harus login.' using errcode = '42501';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) > 100 then
    raise exception 'Data kesalahan tidak valid.' using errcode = '22023';
  end if;
  -- Nilai bab/target/item yang tidak valid ditolak check constraint tabel.
  insert into public.bab_kesalahan as k (siswa_id, bab, target, item)
  select distinct v_uid, (e ->> 'bab')::int, e ->> 'target', e ->> 'item'
  from jsonb_array_elements(p_items) e
  on conflict (siswa_id, bab, target, item) do update
    set jumlah = k.jumlah + 1, terakhir = now();
end;
$$;
revoke all on function public.catat_kesalahan(jsonb) from public, anon;
grant execute on function public.catat_kesalahan(jsonb) to authenticated;

-- 2. Ringkasan semua bab ---------------------------------------------------
-- Per bab: siswa yang sudah mulai, siswa yang tugasnya tuntas (materi +
-- 8 tugas + rata-rata >= KKM, sama dengan tugasSelesai() di
-- js/tugas-bab.js), rata-rata nilai tugas, dan yang lulus ujian ulang.
create or replace function public.pantau_bab_ringkas()
returns table (bab int, mulai int, tuntas int, rata int, lulus_ujian int)
language plpgsql stable security definer set search_path = public as $$
begin
  perform public.require_staff();
  return query
  with siswa as (
    select p.id from public.profiles p where p.role = 'siswa'
  ),
  per_siswa as (
    select t.bab, t.siswa_id,
           bool_or(t.target = 'materi') as materi,
           count(*) filter (where t.target not in ('materi', 'ujian-ulang')) as dikerjakan,
           floor(coalesce(sum(t.skor_terbaik) filter (where t.target not in ('materi', 'ujian-ulang')), 0) / 8.0)::int as rata,
           bool_or(t.target = 'ujian-ulang' and t.lulus) as ujian
    from public.bab_targets t join siswa s on s.id = t.siswa_id
    group by t.bab, t.siswa_id
  )
  select ps.bab,
         count(*)::int,
         count(*) filter (where ps.materi and ps.dikerjakan = 8 and ps.rata >= public.target_bab_kkm())::int,
         coalesce(round(avg(ps.rata) filter (where ps.dikerjakan > 0)), 0)::int,
         count(*) filter (where ps.ujian)::int
  from per_siswa ps
  group by ps.bab
  order by ps.bab;
end;
$$;
revoke execute on function public.pantau_bab_ringkas() from public, anon;
grant execute on function public.pantau_bab_ringkas() to authenticated;

-- 3. Detail satu bab -------------------------------------------------------
-- { "siswa": [{id, full_name, email, targets: {target: {skor, percobaan, lulus}}}],
--   "kesalahan": [{target, item, siswa, jumlah}] }  (20 teratas)
create or replace function public.pantau_bab_detail(p_bab int)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  perform public.require_staff();
  if p_bab is null or p_bab < 1 or p_bab > 50 then
    raise exception 'Bab tidak valid.' using errcode = '22023';
  end if;
  return jsonb_build_object(
    'siswa', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', p.id, 'full_name', p.full_name, 'email', p.email,
               'targets', coalesce((
                 select jsonb_object_agg(t.target, jsonb_build_object(
                          'skor', t.skor_terbaik, 'percobaan', t.percobaan, 'lulus', t.lulus))
                 from public.bab_targets t
                 where t.siswa_id = p.id and t.bab = p_bab), '{}'::jsonb))
             order by p.full_name)
      from public.profiles p where p.role = 'siswa'), '[]'::jsonb),
    'kesalahan', coalesce((
      select jsonb_agg(x order by x.siswa desc, x.jumlah desc)
      from (
        select k.target, k.item, count(*)::int as siswa, sum(k.jumlah)::int as jumlah
        from public.bab_kesalahan k
        join public.profiles p on p.id = k.siswa_id and p.role = 'siswa'
        where k.bab = p_bab
        group by k.target, k.item
        order by 3 desc, 4 desc
        limit 20
      ) x), '[]'::jsonb)
  );
end;
$$;
revoke execute on function public.pantau_bab_detail(int) from public, anon;
grant execute on function public.pantau_bab_detail(int) to authenticated;
