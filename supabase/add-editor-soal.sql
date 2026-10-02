-- Editor soal Tes Kemampuan untuk Operator (pages/kelola-soal.html).
-- Jalankan SETELAH fix-6-riwayat-perubahan-soal.sql. Aman dijalankan ulang.
--
-- * Satu mekanisme draft untuk SEMUA tes (per-5-Bab & paket): tabel
--   content_drafts menyimpan seluruh soal + pengaturan paket sebagai JSON.
--   Draft per-Bab lama (baris status='draft' di quiz_questions) dipindahkan
--   ke sini.
-- * editor_save_draft menolak menimpa draft yang sudah diubah Operator lain
--   sejak dibuka (kontrol konkurensi optimistis).
-- * editor_publish memvalidasi SEMUA isi di server sebelum terbit
--   (perbaikan keamanan #7: HTML soal hanya boleh memakai tag & atribut yang
--   diizinkan; kunci jawaban, path gambar/audio, dsb. harus sah), menahan
--   penerbitan saat ada siswa yang sedang tes, dan menyimpan versi lama
--   (content_versions) sebelum menimpa.
-- * Hak tulis langsung Operator ke tabel soal/paket dicabut: semua
--   perubahan lewat fungsi editor, jadi validasi tidak bisa dilewati.

-- 1. Validasi HTML (allowlist) ----------------------------------------------
-- Setiap tag harus termasuk daftar & hanya boleh punya atribut class dengan
-- karakter aman; setiap "<" harus awal tag yang sah (teks "<" ditulis &lt;).
create or replace function public.is_safe_question_html(p_html text)
returns boolean
language plpgsql
immutable
as $$
declare
  v_tag text;
  v_lt int;
  v_tags int := 0;
begin
  if p_html is null or p_html = '' then
    return true;
  end if;
  v_lt := length(p_html) - length(replace(p_html, '<', ''));
  for v_tag in select m[1] from regexp_matches(p_html, '(<[^<>]*>)', 'g') as m loop
    if v_tag !~* '^</?(b|strong|i|em|u|br|small|span|div|p|ruby|rt|rp|sub|sup|blockquote|table|caption|thead|tbody|tr|th|td|ul|ol|li)(\s+class="[A-Za-z0-9 _-]*")?\s*/?>$' then
      return false;
    end if;
    v_tags := v_tags + 1;
  end loop;
  return v_lt = v_tags;
end;
$$;

-- 2. Validasi isi tes lengkap -> daftar pesan kesalahan (kosong = sah) ------
create or replace function public.validate_test_content(p_kind text, p_ref text, p_package jsonb, p_questions jsonb)
returns text[]
language plpgsql
stable
set search_path = public
as $$
declare
  e text[] := '{}';
  q jsonb;
  n int := 0;
  v_opts jsonb;
  v_answer jsonb;
  f text;
  v_txt text;
begin
  if p_kind = 'bab' then
    -- CASE dibungkus kurung: tanpa kurung, parser PL/pgSQL berhenti di
    -- "then" milik CASE dan menganggap kondisi IF sudah selesai.
    if (case when p_ref ~ '^[0-9]{1,2}$' then (p_ref::int - 1) % 5 <> 0 or p_ref::int not between 1 and 46 else true end) then
      e := e || 'Rentang Bab tidak dikenal.'::text;
    end if;
  elsif p_kind = 'paket' then
    if p_ref !~ '^[a-z0-9][a-z0-9-]{1,40}$' then
      e := e || 'Kode paket hanya boleh huruf kecil, angka, dan tanda minus (2-41 karakter).'::text;
    end if;
    if p_package is null or jsonb_typeof(p_package) <> 'object' then
      e := e || 'Pengaturan paket wajib diisi.'::text;
    else
      if length(coalesce(p_package ->> 'label', '')) not between 1 and 120 then e := e || 'Nama paket wajib diisi (maks. 120 karakter).'::text; end if;
      if length(coalesce(p_package ->> 'mark', '')) not between 1 and 12 then e := e || 'Kode singkat paket wajib diisi (maks. 12 karakter).'::text; end if;
      if length(coalesce(p_package ->> 'description', '')) > 500 then e := e || 'Deskripsi paket maks. 500 karakter.'::text; end if;
      if coalesce(p_package ->> 'time_limit_minutes', '') !~ '^[0-9]{1,3}$'
         or (p_package ->> 'time_limit_minutes')::int not between 5 and 240 then
        e := e || 'Batas waktu paket harus 5-240 menit.'::text;
      end if;
      if jsonb_typeof(p_package -> 'one_page') is distinct from 'boolean' then e := e || 'Pilihan tampilan satu halaman tidak sah.'::text; end if;
      if jsonb_typeof(p_package -> 'active') is distinct from 'boolean' then e := e || 'Status aktif paket tidak sah.'::text; end if;
      if coalesce(p_package ->> 'position', '') !~ '^-?[0-9]{1,5}$' then e := e || 'Urutan paket harus angka.'::text; end if;
    end if;
  else
    return array['Jenis tes tidak dikenal.'];
  end if;

  if p_questions is null or jsonb_typeof(p_questions) <> 'array' or jsonb_array_length(p_questions) = 0 then
    return e || 'Tes harus berisi minimal 1 soal.'::text;
  end if;
  if jsonb_array_length(p_questions) > 300 then
    e := e || 'Maksimal 300 soal per tes.'::text;
  end if;

  for q in select value from jsonb_array_elements(p_questions) loop
    n := n + 1;
    if jsonb_typeof(q) <> 'object' then
      e := e || format('Soal %s: format tidak sah.', n);
      continue;
    end if;
    if length(coalesce(q ->> 'category', '')) not between 1 and 60 then e := e || format('Soal %s: kategori wajib diisi (maks. 60 karakter).', n); end if;
    if length(coalesce(q ->> 'subcategory', '')) > 60 then e := e || format('Soal %s: subkategori maks. 60 karakter.', n); end if;
    if length(coalesce(q ->> 'instruction', '')) not between 1 and 1000 then e := e || format('Soal %s: instruksi wajib diisi (maks. 1000 karakter).', n); end if;
    if length(coalesce(q ->> 'html', '')) not between 1 and 5000 then e := e || format('Soal %s: teks soal wajib diisi (maks. 5000 karakter).', n); end if;
    if length(coalesce(q ->> 'explanation', '')) > 3000 then e := e || format('Soal %s: pembahasan maks. 3000 karakter.', n); end if;
    if length(coalesce(q ->> 'material', '')) not between 1 and 200 then e := e || format('Soal %s: label materi wajib diisi (maks. 200 karakter).', n); end if;
    foreach f in array array['instruction', 'html', 'explanation'] loop
      if not public.is_safe_question_html(q ->> f) then
        e := e || format('Soal %s: %s memakai tag/atribut HTML yang tidak diizinkan (boleh: b, i, u, br, small, span, div, p, ruby/rt, sub/sup, table, ul/ol/li - atribut hanya class; tulis "<" sebagai &lt;).',
                         n, case f when 'instruction' then 'instruksi' when 'html' then 'teks soal' else 'pembahasan' end);
      end if;
    end loop;

    v_opts := q -> 'options';
    if jsonb_typeof(v_opts) is distinct from 'array' or jsonb_array_length(v_opts) not between 2 and 6 then
      e := e || format('Soal %s: harus punya 2-6 pilihan jawaban.', n);
    else
      for v_txt in select coalesce(o #>> '{}', '') from jsonb_array_elements(v_opts) as o loop
        if length(trim(v_txt)) not between 1 and 300 then
          e := e || format('Soal %s: setiap pilihan jawaban wajib diisi (maks. 300 karakter).', n);
          exit;
        end if;
      end loop;
      v_answer := q -> 'answer';
      if jsonb_typeof(v_answer) is distinct from 'number' or v_answer::text !~ '^[0-9]+$'
         or v_answer::text::int >= jsonb_array_length(v_opts) then
        e := e || format('Soal %s: kunci jawaban belum dipilih / tidak sah.', n);
      end if;
    end if;

    if coalesce(q ->> 'image', '') <> '' and q ->> 'image' !~ '^assets/images/[A-Za-z0-9/_-]+\.(webp|png|jpe?g)$' then
      e := e || format('Soal %s: path gambar harus berupa assets/images/....webp/png/jpg.', n);
    end if;
    if coalesce(q ->> 'audio_src', '') <> '' and q ->> 'audio_src' !~ '^assets/audio/[A-Za-z0-9/_.-]+\.mp3$' then
      e := e || format('Soal %s: path audio harus berupa assets/audio/....mp3.', n);
    end if;
    if coalesce(q ->> 'srs_id', '') <> '' and q ->> 'srs_id' !~ '^(kanji:[^:[:space:]]{1,20}|materi:book[12]:[0-9]{1,2}:[0-9]{1,2}|hafalan:bab[0-9]{1,2}-(kosakata|kanji):[^\n]{1,60})$' then
      e := e || format('Soal %s: id hafalan (srs_id) tidak sah.', n);
    end if;
  end loop;
  return e;
end;
$$;

-- 3. Draft ------------------------------------------------------------------
create table if not exists public.content_drafts (
  test_kind text not null check (test_kind in ('bab', 'paket')),
  test_ref text not null,
  package jsonb,
  questions jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid,
  primary key (test_kind, test_ref)
);
alter table public.content_drafts enable row level security;
drop policy if exists "content_drafts_operator_select" on public.content_drafts;
create policy "content_drafts_operator_select"
  on public.content_drafts for select
  using (public.current_user_role() = 'operator');

-- Audit: baris draft dikenali dari jenis:kode tesnya (tidak punya id/key).
create or replace function public.log_content_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old jsonb := case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end;
  v_new jsonb := case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end;
  v_row jsonb := coalesce(v_new, v_old);
begin
  if tg_op = 'UPDATE' and v_old = v_new then
    return null;
  end if;
  insert into public.content_audit_log (table_name, row_ref, action, changed_by, old_data, new_data)
  values (
    tg_table_name,
    coalesce(v_row ->> 'id', v_row ->> 'key', (v_row ->> 'test_kind') || ':' || (v_row ->> 'test_ref')),
    tg_op, auth.uid(), v_old, v_new
  );
  return null;
end;
$$;
revoke execute on function public.log_content_change() from public, anon, authenticated;

drop trigger if exists content_drafts_audit on public.content_drafts;
create trigger content_drafts_audit after insert or update or delete on public.content_drafts
  for each row execute function public.log_content_change();

-- Pindahkan draft per-Bab lama yang BERBEDA dari soal terbit, lalu hapus
-- baris draft lama (draft kini hanya di content_drafts).
insert into public.content_drafts (test_kind, test_ref, questions, updated_at, updated_by)
select 'bab', d.bab_range::text, d.qs, d.at, d.by
from (
  select q.bab_range,
         jsonb_agg(jsonb_build_object(
           'category', q.category, 'instruction', q.instruction, 'html', q.html,
           'options', q.options, 'answer', q.answer, 'explanation', q.explanation,
           'material', q.material, 'srs_id', q.srs_id) order by q.position) as qs,
         max(q.updated_at) as at,
         (array_agg(q.updated_by order by q.updated_at desc))[1] as by
  from public.quiz_questions q
  where q.status = 'draft'
  group by q.bab_range
) d
where d.qs is distinct from (
  select jsonb_agg(jsonb_build_object(
           'category', p.category, 'instruction', p.instruction, 'html', p.html,
           'options', p.options, 'answer', p.answer, 'explanation', p.explanation,
           'material', p.material, 'srs_id', p.srs_id) order by p.position)
  from public.quiz_questions p
  where p.bab_range = d.bab_range and p.status = 'published'
)
on conflict (test_kind, test_ref) do nothing;
delete from public.quiz_questions where status = 'draft';

-- 4. Operator tidak lagi menulis tabel soal/paket langsung ------------------
drop policy if exists "quiz_questions_operator_write_draft" on public.quiz_questions;
drop policy if exists "package_questions_operator_all" on public.package_questions;
drop policy if exists "package_questions_operator_select" on public.package_questions;
create policy "package_questions_operator_select"
  on public.package_questions for select using (public.current_user_role() = 'operator');
drop policy if exists "test_packages_operator_all" on public.test_packages;
drop policy if exists "test_packages_operator_select" on public.test_packages;
create policy "test_packages_operator_select"
  on public.test_packages for select using (public.current_user_role() = 'operator');
drop function if exists public.publish_quiz_range(int);

-- 5. Isi terbit sebuah tes sebagai JSON editor (internal) -------------------
create or replace function public.published_test_json(p_kind text, p_ref text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select case when p_kind = 'bab' then (
    select jsonb_build_object('package', null, 'questions', coalesce(jsonb_agg(jsonb_build_object(
             'category', q.category, 'subcategory', '', 'instruction', q.instruction, 'html', q.html,
             'options', q.options, 'answer', q.answer, 'explanation', q.explanation,
             'material', q.material, 'image', '', 'audio_src', '', 'srs_id', coalesce(q.srs_id, ''))
           order by q.position), '[]'::jsonb))
    from public.quiz_questions q
    where q.bab_range::text = p_ref and q.status = 'published')
  else (
    select jsonb_build_object(
      'package', (select jsonb_build_object('label', t.label, 'mark', t.mark, 'description', t.description,
                    'time_limit_minutes', t.time_limit_minutes, 'one_page', t.one_page,
                    'position', t.position, 'active', t.active)
                  from public.test_packages t where t.key = p_ref),
      'questions', coalesce(jsonb_agg(jsonb_build_object(
             'category', q.category, 'subcategory', coalesce(q.subcategory, ''), 'instruction', q.instruction,
             'html', q.html, 'options', q.options, 'answer', q.answer, 'explanation', q.explanation,
             'material', q.material, 'image', coalesce(q.image, ''), 'audio_src', coalesce(q.audio_src, ''),
             'srs_id', coalesce(q.srs_id, ''))
           order by q.position), '[]'::jsonb))
    from public.package_questions q
    where q.package_key = p_ref)
  end;
$$;

-- 6. Fungsi editor ---------------------------------------------------------
create or replace function public.editor_list_tests()
returns table (
  test_kind text, test_ref text, label text, mark text, published_count int,
  has_draft boolean, draft_updated_at timestamptz, draft_updated_by text,
  open_attempts int, active boolean, sort_order int
)
language plpgsql
stable
security definer
set search_path = public
as $$
#variable_conflict use_column
begin
  perform public.require_operator();
  return query
  with tests as (
    select 'bab'::text as k, r::text as ref, format('Bab %s–%s', r, r + 4) as lbl, 'BAB'::text as mk,
           true as act, r as ord
    from generate_series(1, 46, 5) r
    union all
    select 'paket', t.key, t.label, t.mark, t.active, 1000 + t.position
    from public.test_packages t
    union all
    select 'paket', d.test_ref, coalesce(d.package ->> 'label', d.test_ref), coalesce(d.package ->> 'mark', 'BARU'),
           false, 100000
    from public.content_drafts d
    where d.test_kind = 'paket' and not exists (select 1 from public.test_packages t where t.key = d.test_ref)
  )
  select t.k, t.ref, t.lbl, t.mk,
         (select count(*)::int from public.test_answer_key(t.k, t.ref)),
         d.test_ref is not null, d.updated_at, p.full_name,
         public.open_attempt_count(t.k, t.ref), t.act, t.ord
  from tests t
  left join public.content_drafts d on d.test_kind = t.k and d.test_ref = t.ref
  left join public.profiles p on p.id = d.updated_by
  order by t.ord, t.ref;
end;
$$;

-- Isi untuk diedit: draft kalau ada, kalau tidak isi terbit.
create or replace function public.editor_load(p_kind text, p_ref text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  d public.content_drafts;
  v_has_draft boolean;
  v_pub jsonb;
begin
  perform public.require_operator();
  select * into d from public.content_drafts where test_kind = p_kind and test_ref = p_ref;
  v_has_draft := found;
  v_pub := public.published_test_json(p_kind, p_ref);
  if v_has_draft then
    return jsonb_build_object(
      'source', 'draft', 'package', d.package, 'questions', d.questions,
      'updated_at', d.updated_at,
      'updated_by', (select full_name from public.profiles where id = d.updated_by),
      'published_count', jsonb_array_length(v_pub -> 'questions'),
      'open_attempts', public.open_attempt_count(p_kind, p_ref));
  end if;
  return jsonb_build_object(
    'source', case when jsonb_array_length(v_pub -> 'questions') > 0 then 'published' else 'new' end,
    'package', v_pub -> 'package', 'questions', v_pub -> 'questions',
    'updated_at', null, 'updated_by', null,
    'published_count', jsonb_array_length(v_pub -> 'questions'),
    'open_attempts', public.open_attempt_count(p_kind, p_ref));
end;
$$;

-- Simpan draft. p_base_updated_at = updated_at draft saat dibuka (null kalau
-- belum ada draft); kalau berbeda, berarti Operator lain sudah menyimpan.
create or replace function public.editor_save_draft(
  p_kind text, p_ref text, p_package jsonb, p_questions jsonb, p_base_updated_at timestamptz
)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  d public.content_drafts;
  v_now timestamptz := clock_timestamp();
begin
  perform public.require_operator();
  if p_kind not in ('bab', 'paket') or p_ref is null or length(p_ref) > 41 then
    raise exception 'Tes tidak dikenal.' using errcode = '22023';
  end if;
  if p_kind = 'paket' and p_ref !~ '^[a-z0-9][a-z0-9-]{1,40}$' then
    raise exception 'Kode paket hanya boleh huruf kecil, angka, dan tanda minus.' using errcode = '22023';
  end if;
  if p_questions is null or jsonb_typeof(p_questions) <> 'array' or jsonb_array_length(p_questions) > 300
     or length(p_questions::text) > 2000000 or (p_package is not null and jsonb_typeof(p_package) <> 'object') then
    raise exception 'Isi draft tidak sah atau terlalu besar.' using errcode = '22023';
  end if;

  select * into d from public.content_drafts where test_kind = p_kind and test_ref = p_ref for update;
  if found and (p_base_updated_at is null or d.updated_at <> p_base_updated_at) then
    raise exception 'Draft ini sudah diubah oleh % pada % - muat ulang dulu supaya perubahannya tidak tertimpa.',
      coalesce((select full_name from public.profiles where id = d.updated_by), 'Operator lain'),
      to_char(d.updated_at at time zone 'Asia/Jakarta', 'DD-MM-YYYY HH24:MI')
      using errcode = '40001';
  end if;

  insert into public.content_drafts (test_kind, test_ref, package, questions, updated_at, updated_by)
  values (p_kind, p_ref, p_package, p_questions, v_now, auth.uid())
  on conflict (test_kind, test_ref) do update
    set package = excluded.package, questions = excluded.questions,
        updated_at = excluded.updated_at, updated_by = excluded.updated_by;
  return v_now;
end;
$$;

create or replace function public.editor_discard_draft(p_kind text, p_ref text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_operator();
  delete from public.content_drafts where test_kind = p_kind and test_ref = p_ref;
end;
$$;

-- Terbitkan draft: validasi lengkap -> tahan kalau ada tes berjalan ->
-- simpan versi lama -> ganti isi terbit -> hapus draft.
-- Mengembalikan {"ok": true, "version_id": ...} atau {"ok": false, "errors": [...]}.
create or replace function public.editor_publish(p_kind text, p_ref text, p_base_updated_at timestamptz)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  d public.content_drafts;
  v_errors text[];
  v_open int;
  v_version bigint;
begin
  perform public.require_operator();
  select * into d from public.content_drafts where test_kind = p_kind and test_ref = p_ref for update;
  if not found then
    return jsonb_build_object('ok', false, 'errors', jsonb_build_array('Tidak ada draft - simpan draft dulu.'));
  end if;
  if p_base_updated_at is null or d.updated_at <> p_base_updated_at then
    return jsonb_build_object('ok', false, 'errors', jsonb_build_array(
      'Draft sudah diubah Operator lain sejak dibuka - muat ulang dulu.'));
  end if;
  v_errors := public.validate_test_content(p_kind, p_ref, d.package, d.questions);
  if array_length(v_errors, 1) > 0 then
    return jsonb_build_object('ok', false, 'errors', to_jsonb(v_errors));
  end if;
  v_open := public.open_attempt_count(p_kind, p_ref);
  if v_open > 0 then
    return jsonb_build_object('ok', false, 'errors', jsonb_build_array(format(
      'Ada %s siswa yang sedang mengerjakan tes ini. Terbitkan setelah tes itu selesai.', v_open)));
  end if;

  v_version := public.snapshot_test_content(p_kind, p_ref, 'Sebelum diterbitkan dari editor');

  if p_kind = 'bab' then
    delete from public.quiz_questions where bab_range::text = p_ref and status = 'published';
    insert into public.quiz_questions
      (bab_range, status, position, category, instruction, html, options, answer, explanation, material, srs_id)
    select p_ref::int, 'published', r.ord - 1, r.q ->> 'category', r.q ->> 'instruction', r.q ->> 'html',
           r.q -> 'options', (r.q ->> 'answer')::int, coalesce(r.q ->> 'explanation', ''),
           r.q ->> 'material', nullif(r.q ->> 'srs_id', '')
    from jsonb_array_elements(d.questions) with ordinality as r(q, ord);
  else
    insert into public.test_packages (key, label, mark, description, time_limit_minutes, one_page, position, active)
    values (p_ref, d.package ->> 'label', d.package ->> 'mark', coalesce(d.package ->> 'description', ''),
            (d.package ->> 'time_limit_minutes')::int, (d.package ->> 'one_page')::boolean,
            (d.package ->> 'position')::int, (d.package ->> 'active')::boolean)
    on conflict (key) do update set
      label = excluded.label, mark = excluded.mark, description = excluded.description,
      time_limit_minutes = excluded.time_limit_minutes, one_page = excluded.one_page,
      position = excluded.position, active = excluded.active;
    delete from public.package_questions where package_key = p_ref;
    insert into public.package_questions
      (package_key, position, category, subcategory, instruction, html, options, answer,
       explanation, material, image, audio_src, srs_id)
    select p_ref, r.ord - 1, r.q ->> 'category', nullif(r.q ->> 'subcategory', ''), r.q ->> 'instruction',
           r.q ->> 'html', r.q -> 'options', (r.q ->> 'answer')::int, coalesce(r.q ->> 'explanation', ''),
           r.q ->> 'material', nullif(r.q ->> 'image', ''), nullif(r.q ->> 'audio_src', ''),
           nullif(r.q ->> 'srs_id', '')
    from jsonb_array_elements(d.questions) with ordinality as r(q, ord);
  end if;

  delete from public.content_drafts where test_kind = p_kind and test_ref = p_ref;
  return jsonb_build_object('ok', true, 'version_id', v_version);
end;
$$;

-- 7. Pemulihan versi: kini juga membuang draft tes itu (draft per-Bab tidak
--    lagi disimpan di quiz_questions).
create or replace function public.restore_test_content(p_version_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v public.content_versions;
  v_open int;
begin
  perform public.require_operator();
  select * into v from public.content_versions where id = p_version_id;
  if not found then
    raise exception 'Versi tidak ditemukan.' using errcode = 'P0002';
  end if;
  v_open := public.open_attempt_count(v.test_kind, v.test_ref);
  if v_open > 0 then
    raise exception 'Ada % siswa yang sedang mengerjakan tes ini. Pulihkan setelah tes itu selesai.', v_open
      using errcode = 'P0001';
  end if;

  perform public.snapshot_test_content(v.test_kind, v.test_ref, format('Sebelum memulihkan versi #%s', v.id));

  if v.test_kind = 'bab' then
    delete from public.quiz_questions where bab_range::text = v.test_ref and status = 'published';
    insert into public.quiz_questions
      (bab_range, status, position, category, instruction, html, options, answer, explanation, material, srs_id)
    select v.test_ref::int, 'published', r.position, r.category, r.instruction, r.html, r.options,
           r.answer, r.explanation, r.material, r.srs_id
    from jsonb_to_recordset(v.questions) as r(
           position int, category text, instruction text, html text, options jsonb,
           answer int, explanation text, material text, srs_id text);
  else
    if v.package is not null then
      insert into public.test_packages (key, label, mark, description, time_limit_minutes, one_page, position, active)
      select v.test_ref, p.label, p.mark, p.description, p.time_limit_minutes, p.one_page, p.position, p.active
      from jsonb_to_record(v.package) as p(
             label text, mark text, description text, time_limit_minutes int,
             one_page boolean, position int, active boolean)
      on conflict (key) do update set
        label = excluded.label, mark = excluded.mark, description = excluded.description,
        time_limit_minutes = excluded.time_limit_minutes, one_page = excluded.one_page,
        position = excluded.position, active = excluded.active;
    end if;
    delete from public.package_questions where package_key = v.test_ref;
    insert into public.package_questions
      (package_key, position, category, subcategory, instruction, html, options, answer,
       explanation, material, image, audio_src, srs_id)
    select v.test_ref, r.position, r.category, r.subcategory, r.instruction, r.html, r.options,
           r.answer, r.explanation, r.material, r.image, r.audio_src, r.srs_id
    from jsonb_to_recordset(v.questions) as r(
           position int, category text, subcategory text, instruction text, html text,
           options jsonb, answer int, explanation text, material text, image text,
           audio_src text, srs_id text);
  end if;
  delete from public.content_drafts where test_kind = v.test_kind and test_ref = v.test_ref;
end;
$$;

-- 8. Hak eksekusi -------------------------------------------------------
revoke execute on function public.published_test_json(text, text) from public, anon, authenticated;
revoke execute on function public.validate_test_content(text, text, jsonb, jsonb) from public, anon;
revoke execute on function public.is_safe_question_html(text) from public, anon;
revoke execute on function public.editor_list_tests() from public, anon;
revoke execute on function public.editor_load(text, text) from public, anon;
revoke execute on function public.editor_save_draft(text, text, jsonb, jsonb, timestamptz) from public, anon;
revoke execute on function public.editor_discard_draft(text, text) from public, anon;
revoke execute on function public.editor_publish(text, text, timestamptz) from public, anon;
revoke execute on function public.restore_test_content(bigint) from public, anon;
grant execute on function public.validate_test_content(text, text, jsonb, jsonb) to authenticated;
grant execute on function public.is_safe_question_html(text) to authenticated;
grant execute on function public.editor_list_tests() to authenticated;
grant execute on function public.editor_load(text, text) to authenticated;
grant execute on function public.editor_save_draft(text, text, jsonb, jsonb, timestamptz) to authenticated;
grant execute on function public.editor_discard_draft(text, text) to authenticated;
grant execute on function public.editor_publish(text, text, timestamptz) to authenticated;
grant execute on function public.restore_test_content(bigint) to authenticated;
