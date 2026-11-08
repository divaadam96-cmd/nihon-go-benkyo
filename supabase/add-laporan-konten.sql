-- Laporan isi pelajaran dari siswa: tombol "Laporkan" di halaman Materi
-- (per pelajaran) dan di soal Tugas (per soal). Laporan masuk ke antrian
-- di Kelola Materi (Operator) dengan status baru -> diproses -> selesai /
-- ditolak, plus tanggapan yang bisa dibaca siswa pelapor.
-- Jalankan SETELAH fix-1-operator-mfa.sql (require_operator), di SQL Editor
-- Supabase (atau `supabase db query --linked -f supabase/add-laporan-konten.sql`).
-- Aman dijalankan ulang.

-- 1. Tabel ------------------------------------------------------------------
-- Ditulis hanya lewat fungsi. Siswa hanya membaca laporannya sendiri (tanpa
-- kolom peninjau); Operator membaca semuanya lewat laporan_list().
create table if not exists public.laporan_konten (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  pelapor uuid not null,
  bab int not null check (bab between 1 and 50),
  lokasi text not null check (lokasi ~ '^[a-z0-9-]{1,40}$'),
  rujukan text not null default '' check (length(rujukan) <= 300),
  jenis text not null check (jenis in ('tidak_sesuai', 'salah', 'kurang_jelas', 'lainnya')),
  pesan text not null check (length(pesan) between 5 and 1000),
  status text not null default 'baru' check (status in ('baru', 'diproses', 'selesai', 'ditolak')),
  tanggapan text check (tanggapan is null or length(tanggapan) <= 500),
  ditangani_at timestamptz,
  ditangani_by uuid
);
create index if not exists laporan_konten_status on public.laporan_konten (status, created_at desc);
create index if not exists laporan_konten_pelapor on public.laporan_konten (pelapor, created_at desc);
alter table public.laporan_konten enable row level security;
drop policy if exists "laporan_konten_select_sendiri" on public.laporan_konten;
create policy "laporan_konten_select_sendiri"
  on public.laporan_konten for select
  using (pelapor = auth.uid());
revoke all on public.laporan_konten from anon, authenticated;
revoke all on sequence public.laporan_konten_id_seq from anon, authenticated;
grant select (id, created_at, bab, lokasi, rujukan, jenis, pesan, status, tanggapan, ditangani_at)
  on public.laporan_konten to authenticated;

-- 2. Kirim laporan (semua pengguna yang login) --------------------------------
-- Maks. 10 laporan per 24 jam per akun; laporan yang sama persis dan masih
-- terbuka tidak digandakan (id lama dikembalikan).
create or replace function public.lapor_konten(p_bab int, p_lokasi text, p_rujukan text, p_jenis text, p_pesan text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_pesan text := btrim(coalesce(p_pesan, ''));
  v_rujukan text := left(btrim(coalesce(p_rujukan, '')), 300);
  v_id bigint;
begin
  if v_uid is null then
    raise exception 'Masuk dulu untuk mengirim laporan.' using errcode = '42501';
  end if;
  if p_bab is null or p_bab not between 1 and 50 then
    raise exception 'Pelajaran tidak valid.' using errcode = '22023';
  end if;
  if p_lokasi is null or p_lokasi !~ '^[a-z0-9-]{1,40}$' then
    raise exception 'Lokasi laporan tidak valid.' using errcode = '22023';
  end if;
  if p_jenis is null or p_jenis not in ('tidak_sesuai', 'salah', 'kurang_jelas', 'lainnya') then
    raise exception 'Pilih jenis masalahnya.' using errcode = '22023';
  end if;
  if length(v_pesan) not between 5 and 1000 then
    raise exception 'Tuliskan penjelasan 5-1000 karakter.' using errcode = '22023';
  end if;
  select id into v_id from public.laporan_konten
  where pelapor = v_uid and bab = p_bab and lokasi = p_lokasi and rujukan = v_rujukan
    and pesan = v_pesan and status in ('baru', 'diproses')
  limit 1;
  if found then
    return v_id;
  end if;
  if (select count(*) from public.laporan_konten
      where pelapor = v_uid and created_at > now() - interval '24 hours') >= 10 then
    raise exception 'Batas 10 laporan per hari sudah tercapai - coba lagi besok.' using errcode = 'P0001';
  end if;
  insert into public.laporan_konten (pelapor, bab, lokasi, rujukan, jenis, pesan)
  values (v_uid, p_bab, p_lokasi, v_rujukan, p_jenis, v_pesan)
  returning id into v_id;
  return v_id;
end;
$$;

-- 3. Antrian Operator ----------------------------------------------------------
-- p_status: null = semua, 'terbuka' = baru + diproses, atau satu status.
create or replace function public.laporan_list(p_status text default 'terbuka')
returns table (id bigint, created_at timestamptz, bab int, lokasi text, rujukan text, jenis text, pesan text,
               status text, tanggapan text, ditangani_at timestamptz,
               pelapor_nama text, pelapor_peran text, ditangani_nama text)
language plpgsql
stable
security definer
set search_path = public
as $$
#variable_conflict use_column
begin
  perform public.require_operator();
  return query
    select l.id, l.created_at, l.bab, l.lokasi, l.rujukan, l.jenis, l.pesan, l.status, l.tanggapan,
           l.ditangani_at, coalesce(p.full_name, 'Pengguna'), p.role, h.full_name
    from public.laporan_konten l
    left join public.profiles p on p.id = l.pelapor
    left join public.profiles h on h.id = l.ditangani_by
    where p_status is null
       or (p_status = 'terbuka' and l.status in ('baru', 'diproses'))
       or l.status = p_status
    order by (l.status = 'baru') desc, l.created_at desc
    limit 500;
end;
$$;

-- Jumlah laporan terbuka per pelajaran (penanda di daftar pelajaran).
create or replace function public.laporan_ringkas()
returns table (bab int, baru int, terbuka int)
language plpgsql
stable
security definer
set search_path = public
as $$
#variable_conflict use_column
begin
  perform public.require_operator();
  return query
    select l.bab, count(*) filter (where l.status = 'baru')::int, count(*)::int
    from public.laporan_konten l
    where l.status in ('baru', 'diproses')
    group by l.bab
    order by l.bab;
end;
$$;

-- Ubah status + tanggapan (dibaca siswa pelapor).
create or replace function public.laporan_tangani(p_id bigint, p_status text, p_tanggapan text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tanggapan text := nullif(btrim(coalesce(p_tanggapan, '')), '');
begin
  perform public.require_operator();
  if p_status is null or p_status not in ('baru', 'diproses', 'selesai', 'ditolak') then
    raise exception 'Status tidak valid.' using errcode = '22023';
  end if;
  if length(v_tanggapan) > 500 then
    raise exception 'Tanggapan maks. 500 karakter.' using errcode = '22023';
  end if;
  update public.laporan_konten
  set status = p_status, tanggapan = v_tanggapan, ditangani_at = now(), ditangani_by = auth.uid()
  where id = p_id;
  if not found then
    raise exception 'Laporan tidak ditemukan.' using errcode = 'P0002';
  end if;
end;
$$;

-- 4. Hak eksekusi -------------------------------------------------------------
revoke execute on function public.lapor_konten(int, text, text, text, text) from public, anon;
revoke execute on function public.laporan_list(text) from public, anon;
revoke execute on function public.laporan_ringkas() from public, anon;
revoke execute on function public.laporan_tangani(bigint, text, text) from public, anon;
grant execute on function public.lapor_konten(int, text, text, text, text) to authenticated;
grant execute on function public.laporan_list(text) to authenticated;
grant execute on function public.laporan_ringkas() to authenticated;
grant execute on function public.laporan_tangani(bigint, text, text) to authenticated;
