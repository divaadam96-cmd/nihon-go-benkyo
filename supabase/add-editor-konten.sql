-- Editor isi pelajaran untuk Operator (pages/kelola-materi.html):
-- kosakata, kanji, soal kalimat (susun & pilih) [Tahap 1] dan teks Materi
-- tata bahasa [Tahap 2] per Pelajaran 1-50.
-- Jalankan SETELAH fix-1-operator-mfa.sql, fix-6-riwayat-perubahan-soal.sql
-- (require_operator) dan add-editor-soal.sql (is_safe_question_html), di SQL
-- Editor Supabase (atau `supabase db query --linked -f supabase/add-editor-konten.sql`).
-- Aman dijalankan ulang - versi baru file ini cukup dijalankan ulang seluruhnya.
--
-- Isi bawaan tetap di berkas data/bab-data.js & data/tugas-kalimat-data.js.
-- Tabel ini hanya menyimpan bagian yang DIUBAH Operator, per pelajaran:
--   isi = { "kosakata": [[jp, arti], ...],
--           "kanji":    [[kanji, kana, arti], ...],
--           "kalimat":  { "susun": [{arti, potongan: [...], alt?: [...]}],
--                         "pilih": [{arti, benar, salah: [3 pengecoh]}] },
--           "materi":   { "title": "...", "items": [pola, ...] } }
-- Bentuk pola sama dengan data/materi-grammar-data.js (+ "hidden": pola yang
-- disembunyikan; urutan pola tidak boleh berubah karena progres siswa
-- disimpan per nomor pola - dijaga halaman editor).
-- Kunci yang tidak ada = memakai isi bawaan. Halaman siswa (js/konten-bab.js)
-- menimpa isi bawaan dengan isi terbit ini. Alurnya sama dengan Kelola Soal:
-- draft -> terbitkan (divalidasi di server) -> versi lama disimpan di riwayat.

-- 1. Tabel ------------------------------------------------------------------
-- Isi terbit: dibaca semua pengguna yang login (bukan rahasia - sama dengan
-- isi berkas data yang bisa diunduh siapa pun). Ditulis hanya lewat fungsi.
create table if not exists public.konten_bab (
  bab int primary key check (bab between 1 and 50),
  isi jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid
);
alter table public.konten_bab enable row level security;
drop policy if exists "konten_bab_select_login" on public.konten_bab;
create policy "konten_bab_select_login"
  on public.konten_bab for select
  using (auth.uid() is not null);
grant select on public.konten_bab to authenticated;

create table if not exists public.konten_bab_draft (
  bab int primary key check (bab between 1 and 50),
  isi jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid
);
alter table public.konten_bab_draft enable row level security;
drop policy if exists "konten_bab_draft_operator_select" on public.konten_bab_draft;
create policy "konten_bab_draft_operator_select"
  on public.konten_bab_draft for select
  using (public.current_user_role() = 'operator');

-- Riwayat: isi terbit SEBELUM setiap penerbitan/pemulihan. isi null = saat
-- itu pelajaran ini masih memakai isi bawaan seluruhnya.
create table if not exists public.konten_bab_versi (
  id bigserial primary key,
  bab int not null check (bab between 1 and 50),
  isi jsonb,
  alasan text not null,
  created_at timestamptz not null default now(),
  created_by uuid
);
create index if not exists konten_bab_versi_bab on public.konten_bab_versi (bab, created_at desc);
alter table public.konten_bab_versi enable row level security;
drop policy if exists "konten_bab_versi_operator_select" on public.konten_bab_versi;
create policy "konten_bab_versi_operator_select"
  on public.konten_bab_versi for select
  using (public.current_user_role() = 'operator');

-- 2. Validasi ---------------------------------------------------------------
-- Teks satu baris: string, 1..maks karakter (tanpa spasi tepi), tanpa < > dan
-- baris baru (isi ini ikut dipakai sebagai id kartu Hafalan & item statistik).
create or replace function public.konten_teks_ok(p jsonb, p_maks int)
returns boolean
language sql
immutable
as $$
  select coalesce(jsonb_typeof(p) = 'string'
    and length(btrim(p #>> '{}')) between 1 and p_maks
    and (p #>> '{}') !~ '[<>\r\n]', false);
$$;

-- Teks berformat (Materi): string, panjang min..maks, HTML hanya tag & atribut
-- yang diizinkan is_safe_question_html (sama dengan soal Tes Kemampuan).
create or replace function public.konten_html_ok(p jsonb, p_min int, p_maks int)
returns boolean
language sql
immutable
set search_path = public
as $$
  select coalesce(jsonb_typeof(p) = 'string'
    and length(btrim(p #>> '{}')) between p_min and p_maks
    and public.is_safe_question_html(p #>> '{}'), false);
$$;

-- Validasi bagian "materi" -> daftar pesan "Materi pola N: ...".
create or replace function public.validate_konten_materi(x jsonb)
returns text[]
language plpgsql
immutable
set search_path = public
as $$
declare
  e text[] := '{}';
  it jsonb;
  b jsonb;
  t jsonb;
  r jsonb;
  n int := 0;
  m int;
  v_kolom int;
  v_isi boolean;
  p text;
begin
  if jsonb_typeof(x) <> 'object'
     or exists (select 1 from jsonb_object_keys(x) k where k not in ('title', 'items')) then
    return array['Format materi tidak sah.'];
  end if;
  if not public.konten_teks_ok(x -> 'title', 100) then
    e := e || 'Materi: judul pelajaran wajib diisi (maks. 100 karakter, tanpa < >).'::text;
  end if;
  if jsonb_typeof(x -> 'items') is distinct from 'array' or jsonb_array_length(x -> 'items') not between 1 and 30 then
    return e || 'Materi: harus berisi 1-30 pola.'::text;
  end if;
  for it in select value from jsonb_array_elements(x -> 'items') loop
    n := n + 1;
    p := format('Materi pola %s: ', n);
    if jsonb_typeof(it) <> 'object'
       or exists (select 1 from jsonb_object_keys(it) k where k not in ('title', 'suffix', 'noBox', 'hidden', 'blocks')) then
      e := e || (p || 'format tidak sah.');
      continue;
    end if;
    if not public.konten_html_ok(it -> 'title', 1, 500) then e := e || (p || 'judul pola wajib diisi (maks. 500 karakter, HTML terbatas).'); end if;
    if it ? 'suffix' and not public.konten_html_ok(it -> 'suffix', 0, 300) then e := e || (p || 'keterangan judul maks. 300 karakter (HTML terbatas).'); end if;
    if it ? 'noBox' and jsonb_typeof(it -> 'noBox') <> 'boolean' then e := e || (p || 'pilihan tanpa kotak tidak sah.'); end if;
    if it ? 'hidden' and jsonb_typeof(it -> 'hidden') <> 'boolean' then e := e || (p || 'pilihan sembunyikan tidak sah.'); end if;
    if jsonb_typeof(it -> 'blocks') is distinct from 'array'
       or jsonb_array_length(it -> 'blocks') > 20
       or (jsonb_array_length(it -> 'blocks') = 0 and coalesce(it -> 'hidden' = 'true'::jsonb, false) = false) then
      e := e || (p || 'harus punya 1-20 bagian penjelasan.');
      continue;
    end if;
    m := 0;
    for b in select value from jsonb_array_elements(it -> 'blocks') loop
      m := m + 1;
      if jsonb_typeof(b) <> 'object'
         or exists (select 1 from jsonb_object_keys(b) k where k not in ('label', 'text', 'figure', 'table', 'examples', 'note')) then
        e := e || format('%sbagian %s: format tidak sah.', p, m);
        continue;
      end if;
      v_isi := false;
      if b ? 'label' then
        if not public.konten_html_ok(b -> 'label', 1, 1000) then e := e || format('%sbagian %s: sub-judul maks. 1000 karakter (HTML terbatas).', p, m); end if;
        v_isi := true;
      end if;
      if b ? 'text' then
        if not public.konten_html_ok(b -> 'text', 1, 6000) then e := e || format('%sbagian %s: penjelasan maks. 6000 karakter (HTML terbatas).', p, m); end if;
        v_isi := true;
      end if;
      if b ? 'note' then
        if not public.konten_html_ok(b -> 'note', 1, 4000) then e := e || format('%sbagian %s: catatan maks. 4000 karakter (HTML terbatas).', p, m); end if;
        v_isi := true;
      end if;
      if b ? 'figure' then
        t := b -> 'figure';
        if jsonb_typeof(t) <> 'object'
           or exists (select 1 from jsonb_object_keys(t) k where k not in ('src', 'alt'))
           or coalesce(t ->> 'src', '') !~ '^assets/images/materi/[A-Za-z0-9_-]+[.](webp|png|jpe?g)$'
           or jsonb_typeof(t -> 'alt') is distinct from 'string'
           or length(t ->> 'alt') > 300 or (t ->> 'alt') ~ '[<>"]' then
          e := e || format('%sbagian %s: gambar tidak sah (keterangan maks. 300 karakter, tanpa < > ").', p, m);
        end if;
        v_isi := true;
      end if;
      if b ? 'table' then
        t := b -> 'table';
        if jsonb_typeof(t) <> 'object'
           or exists (select 1 from jsonb_object_keys(t) k where k not in ('headers', 'rows'))
           or jsonb_typeof(t -> 'headers') is distinct from 'array' or jsonb_array_length(t -> 'headers') not between 1 and 10
           or jsonb_typeof(t -> 'rows') is distinct from 'array' or jsonb_array_length(t -> 'rows') not between 1 and 50 then
          e := e || format('%sbagian %s: tabel harus punya 1-10 kolom dan 1-50 baris.', p, m);
        else
          v_kolom := jsonb_array_length(t -> 'headers') + 1;
          if exists (select 1 from jsonb_array_elements(t -> 'headers') h where not public.konten_html_ok(h, 0, 300)) then
            e := e || format('%sbagian %s: judul kolom tabel maks. 300 karakter (HTML terbatas).', p, m);
          end if;
          for r in select value from jsonb_array_elements(t -> 'rows') loop
            if jsonb_typeof(r) <> 'array' or jsonb_array_length(r) <> v_kolom
               or exists (select 1 from jsonb_array_elements(r) c where not public.konten_html_ok(c, 0, 500)) then
              e := e || format('%sbagian %s: setiap baris tabel harus berisi %s sel (maks. 500 karakter, HTML terbatas).', p, m, v_kolom);
              exit;
            end if;
          end loop;
        end if;
        v_isi := true;
      end if;
      if b ? 'examples' then
        if jsonb_typeof(b -> 'examples') is distinct from 'array' or jsonb_array_length(b -> 'examples') > 40 then
          e := e || format('%sbagian %s: maks. 40 contoh.', p, m);
        else
          if exists (select 1 from jsonb_array_elements(b -> 'examples') c
                     where jsonb_typeof(c) <> 'array' or jsonb_array_length(c) <> 2
                        or not public.konten_html_ok(c -> 0, 1, 600) or not public.konten_html_ok(c -> 1, 0, 600)) then
            e := e || format('%sbagian %s: setiap contoh wajib berisi kalimat (maks. 600 karakter) dan arti (boleh kosong), HTML terbatas.', p, m);
          end if;
          if jsonb_array_length(b -> 'examples') > 0 then v_isi := true; end if;
        end if;
      end if;
      if not v_isi then
        e := e || format('%sbagian %s: kosong - isi minimal satu dari sub-judul, penjelasan, tabel, contoh, atau catatan.', p, m);
      end if;
    end loop;
  end loop;
  return e;
end;
$$;

-- Daftar pesan kesalahan (kosong = sah). Format pesan "Kosakata no. N: ..."
-- dipakai halaman editor untuk melompat ke baris yang salah.
create or replace function public.validate_konten_bab(p_isi jsonb)
returns text[]
language plpgsql
immutable
as $$
declare
  e text[] := '{}';
  k text;
  x jsonb;
  y jsonb;
  n int;
  m int;
  v_benar text;
  v_salah text[];
begin
  if p_isi is null or jsonb_typeof(p_isi) <> 'object' then
    return array['Format isi tidak sah.'];
  end if;
  if length(p_isi::text) > 600000 then
    return array['Isi terlalu besar.'];
  end if;
  for k in select jsonb_object_keys(p_isi) loop
    if k not in ('kosakata', 'kanji', 'kalimat', 'materi') then
      e := e || format('Bagian "%s" tidak dikenal.', k);
    end if;
  end loop;

  -- Kosakata: [[jp, arti], ...]
  if p_isi ? 'kosakata' then
    x := p_isi -> 'kosakata';
    if jsonb_typeof(x) <> 'array' or jsonb_array_length(x) not between 1 and 300 then
      e := e || 'Kosakata harus berisi 1-300 kata.'::text;
    else
      n := 0;
      for y in select value from jsonb_array_elements(x) loop
        n := n + 1;
        if jsonb_typeof(y) <> 'array' or jsonb_array_length(y) <> 2 then
          e := e || format('Kosakata no. %s: format tidak sah.', n);
        else
          if not public.konten_teks_ok(y -> 0, 60) then e := e || format('Kosakata no. %s: kata Jepang wajib diisi (maks. 60 karakter, tanpa < >).', n); end if;
          if not public.konten_teks_ok(y -> 1, 200) then e := e || format('Kosakata no. %s: arti wajib diisi (maks. 200 karakter, tanpa < >).', n); end if;
        end if;
      end loop;
    end if;
  end if;

  -- Kanji: [[kanji, kana, arti], ...]
  if p_isi ? 'kanji' then
    x := p_isi -> 'kanji';
    if jsonb_typeof(x) <> 'array' or jsonb_array_length(x) not between 1 and 300 then
      e := e || 'Kanji harus berisi 1-300 kata.'::text;
    else
      n := 0;
      for y in select value from jsonb_array_elements(x) loop
        n := n + 1;
        if jsonb_typeof(y) <> 'array' or jsonb_array_length(y) <> 3 then
          e := e || format('Kanji no. %s: format tidak sah.', n);
        else
          if not public.konten_teks_ok(y -> 0, 60) then e := e || format('Kanji no. %s: tulisan kanji wajib diisi (maks. 60 karakter, tanpa < >).', n); end if;
          if not public.konten_teks_ok(y -> 1, 60) then e := e || format('Kanji no. %s: cara baca wajib diisi (maks. 60 karakter, tanpa < >).', n); end if;
          if not public.konten_teks_ok(y -> 2, 200) then e := e || format('Kanji no. %s: arti wajib diisi (maks. 200 karakter, tanpa < >).', n); end if;
        end if;
      end loop;
    end if;
  end if;

  -- Kalimat: {susun: [...], pilih: [...]}
  if p_isi ? 'kalimat' then
    x := p_isi -> 'kalimat';
    if jsonb_typeof(x) <> 'object'
       or exists (select 1 from jsonb_object_keys(x) kk where kk not in ('susun', 'pilih'))
       or jsonb_typeof(x -> 'susun') is distinct from 'array'
       or jsonb_typeof(x -> 'pilih') is distinct from 'array' then
      e := e || 'Format soal kalimat tidak sah.'::text;
    else
      if jsonb_array_length(x -> 'susun') not between 1 and 100 then
        e := e || 'Soal susun kalimat harus berisi 1-100 soal.'::text;
      end if;
      n := 0;
      for y in select value from jsonb_array_elements(x -> 'susun') loop
        n := n + 1;
        if jsonb_typeof(y) <> 'object'
           or exists (select 1 from jsonb_object_keys(y) kk where kk not in ('arti', 'potongan', 'alt')) then
          e := e || format('Susun no. %s: format tidak sah.', n);
          continue;
        end if;
        if not public.konten_teks_ok(y -> 'arti', 200) then e := e || format('Susun no. %s: arti wajib diisi (maks. 200 karakter, tanpa < >).', n); end if;
        if jsonb_typeof(y -> 'potongan') is distinct from 'array' or jsonb_array_length(y -> 'potongan') not between 2 and 20 then
          e := e || format('Susun no. %s: harus ada 2-20 potongan.', n);
        elsif exists (select 1 from jsonb_array_elements(y -> 'potongan') p where not public.konten_teks_ok(p, 40)) then
          e := e || format('Susun no. %s: setiap potongan wajib diisi (maks. 40 karakter, tanpa < >).', n);
        end if;
        if y ? 'alt' and (jsonb_typeof(y -> 'alt') <> 'array' or jsonb_array_length(y -> 'alt') > 10
           or exists (select 1 from jsonb_array_elements(y -> 'alt') a where not public.konten_teks_ok(a, 300))) then
          e := e || format('Susun no. %s: susunan lain (alt) maks. 10 kalimat, masing-masing maks. 300 karakter.', n);
        end if;
      end loop;

      if jsonb_array_length(x -> 'pilih') not between 1 and 100 then
        e := e || 'Soal pilih kalimat harus berisi 1-100 soal.'::text;
      end if;
      n := 0;
      for y in select value from jsonb_array_elements(x -> 'pilih') loop
        n := n + 1;
        if jsonb_typeof(y) <> 'object'
           or exists (select 1 from jsonb_object_keys(y) kk where kk not in ('arti', 'benar', 'salah')) then
          e := e || format('Pilih no. %s: format tidak sah.', n);
          continue;
        end if;
        if not public.konten_teks_ok(y -> 'arti', 200) then e := e || format('Pilih no. %s: arti wajib diisi (maks. 200 karakter, tanpa < >).', n); end if;
        if not public.konten_teks_ok(y -> 'benar', 300) then e := e || format('Pilih no. %s: kalimat benar wajib diisi (maks. 300 karakter, tanpa < >).', n); end if;
        if jsonb_typeof(y -> 'salah') is distinct from 'array' or jsonb_array_length(y -> 'salah') <> 3
           or exists (select 1 from jsonb_array_elements(y -> 'salah') s where not public.konten_teks_ok(s, 300)) then
          e := e || format('Pilih no. %s: harus ada tepat 3 kalimat pengecoh (masing-masing maks. 300 karakter, tanpa < >).', n);
        elsif jsonb_typeof(y -> 'benar') = 'string' then
          -- Spasi diabaikan (sama dengan penilaian di js/tugas-bab.js).
          v_benar := regexp_replace(y ->> 'benar', '\s', '', 'g');
          select array_agg(regexp_replace(s #>> '{}', '\s', '', 'g')) into v_salah from jsonb_array_elements(y -> 'salah') s;
          if v_benar = any (v_salah) then
            e := e || format('Pilih no. %s: salah satu pengecoh sama dengan kalimat benar.', n);
          end if;
          select count(distinct s) into m from unnest(v_salah) s;
          if m < 3 then
            e := e || format('Pilih no. %s: ketiga pengecoh harus berbeda.', n);
          end if;
        end if;
      end loop;
    end if;
  end if;
  if p_isi ? 'materi' then
    e := e || public.validate_konten_materi(p_isi -> 'materi');
  end if;
  return e;
end;
$$;

-- 3. Fungsi editor (khusus Operator) -----------------------------------------
-- Ringkasan 50 pelajaran: bagian yang sudah diubah & status draft.
create or replace function public.konten_list()
returns table (bab int, diubah text[], has_draft boolean, draft_updated_at timestamptz, draft_updated_by text)
language plpgsql
stable
security definer
set search_path = public
as $$
#variable_conflict use_column
begin
  perform public.require_operator();
  return query
  select b, coalesce((select array_agg(k order by k) from jsonb_object_keys(t.isi) k), '{}'::text[]),
         d.bab is not null, d.updated_at, p.full_name
  from generate_series(1, 50) b
  left join public.konten_bab t on t.bab = b
  left join public.konten_bab_draft d on d.bab = b
  left join public.profiles p on p.id = d.updated_by
  order by b;
end;
$$;

-- Isi untuk diedit: draft kalau ada, kalau tidak isi terbit ({} = bawaan
-- seluruhnya; halaman editor melengkapinya dari berkas data).
create or replace function public.konten_load(p_bab int)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  d public.konten_bab_draft;
  t public.konten_bab;
begin
  perform public.require_operator();
  if p_bab is null or p_bab not between 1 and 50 then
    raise exception 'Pelajaran tidak valid.' using errcode = '22023';
  end if;
  select * into t from public.konten_bab where bab = p_bab;
  select * into d from public.konten_bab_draft where bab = p_bab;
  if found then
    return jsonb_build_object(
      'source', 'draft', 'isi', d.isi, 'terbit', coalesce(t.isi, '{}'::jsonb),
      'updated_at', d.updated_at,
      'updated_by', (select full_name from public.profiles where id = d.updated_by));
  end if;
  return jsonb_build_object(
    'source', case when t.bab is null then 'bawaan' else 'terbit' end,
    'isi', coalesce(t.isi, '{}'::jsonb), 'terbit', coalesce(t.isi, '{}'::jsonb),
    'updated_at', null, 'updated_by', null,
    'terbit_at', t.updated_at,
    'terbit_by', (select full_name from public.profiles where id = t.updated_by));
end;
$$;

-- Simpan draft. p_base_updated_at = updated_at draft saat dibuka (null kalau
-- belum ada draft); kalau berbeda, berarti Operator lain sudah menyimpan.
create or replace function public.konten_save_draft(p_bab int, p_isi jsonb, p_base_updated_at timestamptz)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  d public.konten_bab_draft;
  v_now timestamptz := clock_timestamp();
begin
  perform public.require_operator();
  if p_bab is null or p_bab not between 1 and 50 then
    raise exception 'Pelajaran tidak valid.' using errcode = '22023';
  end if;
  if p_isi is null or jsonb_typeof(p_isi) <> 'object' or length(p_isi::text) > 600000 then
    raise exception 'Isi draft tidak sah atau terlalu besar.' using errcode = '22023';
  end if;
  select * into d from public.konten_bab_draft where bab = p_bab for update;
  if found and (p_base_updated_at is null or d.updated_at <> p_base_updated_at) then
    raise exception 'Draft ini sudah diubah oleh % pada % - muat ulang dulu supaya perubahannya tidak tertimpa.',
      coalesce((select full_name from public.profiles where id = d.updated_by), 'Operator lain'),
      to_char(d.updated_at at time zone 'Asia/Jakarta', 'DD-MM-YYYY HH24:MI')
      using errcode = '40001';
  end if;
  insert into public.konten_bab_draft (bab, isi, updated_at, updated_by)
  values (p_bab, p_isi, v_now, auth.uid())
  on conflict (bab) do update
    set isi = excluded.isi, updated_at = excluded.updated_at, updated_by = excluded.updated_by;
  return v_now;
end;
$$;

create or replace function public.konten_discard_draft(p_bab int)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_operator();
  delete from public.konten_bab_draft where bab = p_bab;
end;
$$;

-- Simpan isi terbit saat ini sebagai versi (internal).
create or replace function public.konten_snapshot(p_bab int, p_alasan text)
returns bigint
language sql
security definer
set search_path = public
as $$
  insert into public.konten_bab_versi (bab, isi, alasan, created_by)
  values (p_bab, (select isi from public.konten_bab where bab = p_bab), p_alasan, auth.uid())
  returning id;
$$;

-- Ganti isi terbit ({} / null = kembali ke isi bawaan seluruhnya) (internal).
create or replace function public.konten_set_terbit(p_bab int, p_isi jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_isi is null or p_isi = '{}'::jsonb then
    delete from public.konten_bab where bab = p_bab;
  else
    insert into public.konten_bab (bab, isi, updated_at, updated_by)
    values (p_bab, p_isi, now(), auth.uid())
    on conflict (bab) do update
      set isi = excluded.isi, updated_at = excluded.updated_at, updated_by = excluded.updated_by;
  end if;
end;
$$;

-- Terbitkan draft: validasi -> simpan versi lama -> ganti isi terbit -> hapus
-- draft. Mengembalikan {"ok": true, "version_id": ...} atau
-- {"ok": false, "errors": [...]}.
create or replace function public.konten_publish(p_bab int, p_base_updated_at timestamptz)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  d public.konten_bab_draft;
  v_errors text[];
  v_version bigint;
begin
  perform public.require_operator();
  select * into d from public.konten_bab_draft where bab = p_bab for update;
  if not found then
    return jsonb_build_object('ok', false, 'errors', jsonb_build_array('Tidak ada draft - simpan draft dulu.'));
  end if;
  if p_base_updated_at is null or d.updated_at <> p_base_updated_at then
    return jsonb_build_object('ok', false, 'errors', jsonb_build_array(
      'Draft sudah diubah Operator lain sejak dibuka - muat ulang dulu.'));
  end if;
  v_errors := public.validate_konten_bab(d.isi);
  if array_length(v_errors, 1) > 0 then
    return jsonb_build_object('ok', false, 'errors', to_jsonb(v_errors));
  end if;
  v_version := public.konten_snapshot(p_bab, 'Sebelum diterbitkan dari editor');
  perform public.konten_set_terbit(p_bab, d.isi);
  delete from public.konten_bab_draft where bab = p_bab;
  return jsonb_build_object('ok', true, 'version_id', v_version);
end;
$$;

create or replace function public.konten_versions(p_bab int)
returns table (id bigint, created_at timestamptz, created_by_name text, alasan text, diubah text[])
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  perform public.require_operator();
  return query
    select v.id, v.created_at, coalesce(p.full_name, 'SQL / sistem'), v.alasan,
           coalesce((select array_agg(k order by k) from jsonb_object_keys(v.isi) k), '{}'::text[])
    from public.konten_bab_versi v
    left join public.profiles p on p.id = v.created_by
    where v.bab = p_bab
    order by v.created_at desc, v.id desc;
end;
$$;

-- Pulihkan versi: isi saat ini disimpan dulu (bisa dibatalkan), draft dibuang.
create or replace function public.konten_restore(p_version_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v public.konten_bab_versi;
begin
  perform public.require_operator();
  select * into v from public.konten_bab_versi where id = p_version_id;
  if not found then
    raise exception 'Versi tidak ditemukan.' using errcode = 'P0002';
  end if;
  perform public.konten_snapshot(v.bab, format('Sebelum memulihkan versi #%s', v.id));
  perform public.konten_set_terbit(v.bab, v.isi);
  delete from public.konten_bab_draft where bab = v.bab;
end;
$$;

-- 4. Hak eksekusi -------------------------------------------------------------
revoke execute on function public.konten_snapshot(int, text) from public, anon, authenticated;
revoke execute on function public.konten_set_terbit(int, jsonb) from public, anon, authenticated;
revoke execute on function public.konten_teks_ok(jsonb, int) from public, anon;
revoke execute on function public.validate_konten_bab(jsonb) from public, anon;
revoke execute on function public.konten_html_ok(jsonb, int, int) from public, anon;
revoke execute on function public.validate_konten_materi(jsonb) from public, anon;
revoke execute on function public.konten_list() from public, anon;
revoke execute on function public.konten_load(int) from public, anon;
revoke execute on function public.konten_save_draft(int, jsonb, timestamptz) from public, anon;
revoke execute on function public.konten_discard_draft(int) from public, anon;
revoke execute on function public.konten_publish(int, timestamptz) from public, anon;
revoke execute on function public.konten_versions(int) from public, anon;
revoke execute on function public.konten_restore(bigint) from public, anon;
grant execute on function public.konten_teks_ok(jsonb, int) to authenticated;
grant execute on function public.validate_konten_bab(jsonb) to authenticated;
grant execute on function public.konten_html_ok(jsonb, int, int) to authenticated;
grant execute on function public.validate_konten_materi(jsonb) to authenticated;
grant execute on function public.konten_list() to authenticated;
grant execute on function public.konten_load(int) to authenticated;
grant execute on function public.konten_save_draft(int, jsonb, timestamptz) to authenticated;
grant execute on function public.konten_discard_draft(int) to authenticated;
grant execute on function public.konten_publish(int, timestamptz) to authenticated;
grant execute on function public.konten_versions(int) to authenticated;
grant execute on function public.konten_restore(bigint) to authenticated;
