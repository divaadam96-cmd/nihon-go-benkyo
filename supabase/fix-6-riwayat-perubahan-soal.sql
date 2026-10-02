-- Perbaikan keamanan #6: riwayat perubahan & versi soal Tes Kemampuan.
--
-- 1. content_audit_log: setiap tambah/ubah/hapus di quiz_questions,
--    package_questions, dan test_packages dicatat otomatis oleh trigger
--    (siapa, kapan, isi sebelum & sesudah) - berlaku untuk editor mana pun,
--    termasuk perubahan lewat SQL. Hanya Operator yang bisa membaca; TIDAK
--    ada yang bisa mengubah/menghapus catatannya lewat API.
-- 2. content_versions: isi soal disimpan sebagai versi sebelum diterbitkan
--    atau dipulihkan, dan bisa dikembalikan (restore_test_content) - salah
--    edit atau akun yang disalahgunakan tidak lagi merusak bank soal permanen.
-- 3. publish_quiz_range diperkuat:
--    * Celah: dulu dicek dengan "current_user_role() <> 'operator'". Untuk
--      pemanggil TANPA login hasilnya NULL (bukan true), jadi pengecekan
--      terlewati - siapa pun yang tahu anon key (publik) bisa menerbitkan
--      draft, dan draft kosong = soal terbit terhapus. Sekarang ditolak.
--    * Menolak menerbitkan draft kosong.
--    * Menolak menerbitkan/memulihkan saat ada siswa yang sedang
--      mengerjakan tes itu (jawaban disimpan per id soal - terbit ulang
--      membuat id baru, sehingga jawaban siswa yang sedang tes hilang).
-- Aman dijalankan ulang.

-- 1. Catatan audit -------------------------------------------------------
create table if not exists public.content_audit_log (
  id bigserial primary key,
  table_name text not null,
  row_ref text,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  changed_by uuid,           -- null = lewat SQL Editor / sistem
  changed_at timestamptz not null default now(),
  old_data jsonb,
  new_data jsonb
);
create index if not exists content_audit_log_recent on public.content_audit_log (changed_at desc);

alter table public.content_audit_log enable row level security;
drop policy if exists "content_audit_log_operator_select" on public.content_audit_log;
create policy "content_audit_log_operator_select"
  on public.content_audit_log for select
  using (public.current_user_role() = 'operator');

create or replace function public.log_content_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old jsonb := case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end;
  v_new jsonb := case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end;
begin
  if tg_op = 'UPDATE' and v_old = v_new then
    return null;
  end if;
  insert into public.content_audit_log (table_name, row_ref, action, changed_by, old_data, new_data)
  values (
    tg_table_name,
    coalesce(v_new ->> 'id', v_old ->> 'id', v_new ->> 'key', v_old ->> 'key'),
    tg_op, auth.uid(), v_old, v_new
  );
  return null;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array['quiz_questions', 'package_questions', 'test_packages'] loop
    execute format('drop trigger if exists %I on public.%I', t || '_audit', t);
    execute format(
      'create trigger %I after insert or update or delete on public.%I for each row execute function public.log_content_change()',
      t || '_audit', t);
  end loop;
end;
$$;

-- updated_by/updated_at soal per-Bab diisi otomatis (dulu tidak pernah terisi).
create or replace function public.stamp_quiz_question()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at := now();
  new.updated_by := coalesce(auth.uid(), new.updated_by);
  return new;
end;
$$;
drop trigger if exists quiz_questions_stamp on public.quiz_questions;
create trigger quiz_questions_stamp before insert or update on public.quiz_questions
  for each row execute function public.stamp_quiz_question();

-- 2. Versi konten --------------------------------------------------------
create table if not exists public.content_versions (
  id bigserial primary key,
  test_kind text not null check (test_kind in ('bab', 'paket')),
  test_ref text not null,
  created_at timestamptz not null default now(),
  created_by uuid,
  reason text not null,
  package jsonb,             -- baris test_packages (paket saja)
  questions jsonb not null   -- array soal terbit, urut posisi
);
create index if not exists content_versions_by_test on public.content_versions (test_kind, test_ref, created_at desc);

alter table public.content_versions enable row level security;
drop policy if exists "content_versions_operator_select" on public.content_versions;
create policy "content_versions_operator_select"
  on public.content_versions for select
  using (public.current_user_role() = 'operator');

-- Simpan isi terbit saat ini sebagai versi (internal). Null kalau kosong.
create or replace function public.snapshot_test_content(p_kind text, p_ref text, p_reason text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_questions jsonb;
  v_package jsonb;
  v_id bigint;
begin
  if p_kind = 'bab' then
    select jsonb_agg(jsonb_build_object(
             'position', q.position, 'category', q.category, 'instruction', q.instruction,
             'html', q.html, 'options', q.options, 'answer', q.answer,
             'explanation', q.explanation, 'material', q.material, 'srs_id', q.srs_id)
           order by q.position)
      into v_questions
      from public.quiz_questions q
      where q.bab_range::text = p_ref and q.status = 'published';
  else
    select jsonb_agg(jsonb_build_object(
             'position', q.position, 'category', q.category, 'subcategory', q.subcategory,
             'instruction', q.instruction, 'html', q.html, 'options', q.options,
             'answer', q.answer, 'explanation', q.explanation, 'material', q.material,
             'image', q.image, 'audio_src', q.audio_src, 'srs_id', q.srs_id)
           order by q.position)
      into v_questions
      from public.package_questions q
      where q.package_key = p_ref;
    select to_jsonb(t) into v_package from public.test_packages t where t.key = p_ref;
  end if;
  if v_questions is null then
    return null;
  end if;
  insert into public.content_versions (test_kind, test_ref, created_by, reason, package, questions)
  values (p_kind, p_ref, auth.uid(), p_reason, v_package, v_questions)
  returning id into v_id;
  return v_id;
end;
$$;

-- Jumlah tes yang sedang dikerjakan (belum lewat tenggat) - internal.
create or replace function public.open_attempt_count(p_kind text, p_ref text)
returns int
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::int from public.test_attempts t
  where t.test_kind = p_kind and t.test_ref = p_ref
    and t.finished_at is null and now() <= t.deadline + public.test_grace();
$$;

create or replace function public.require_operator()
returns void
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  -- coalesce: pemanggil tanpa login/profil menghasilkan NULL, yang di SQL
  -- BUKAN "tidak sama dengan operator" - harus ditolak secara eksplisit.
  if coalesce(public.current_user_role(), '') <> 'operator' then
    raise exception 'Hanya Operator (dengan verifikasi dua langkah).' using errcode = '42501';
  end if;
end;
$$;

-- 3. Terbitkan draft soal per-Bab -----------------------------------------
create or replace function public.publish_quiz_range(p_bab_range int)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_open int;
begin
  perform public.require_operator();
  if not exists (select 1 from public.quiz_questions
                 where bab_range = p_bab_range and status = 'draft') then
    raise exception 'Tidak ada draft untuk diterbitkan - simpan draft dulu.' using errcode = 'P0001';
  end if;
  v_open := public.open_attempt_count('bab', p_bab_range::text);
  if v_open > 0 then
    raise exception 'Ada % tes Bab %–% yang sedang dikerjakan siswa. Terbitkan setelah tes itu selesai.',
      v_open, p_bab_range, p_bab_range + 4 using errcode = 'P0001';
  end if;

  perform public.snapshot_test_content('bab', p_bab_range::text, 'Sebelum diterbitkan ulang');

  delete from public.quiz_questions
    where bab_range = p_bab_range and status = 'published';
  insert into public.quiz_questions
    (bab_range, status, position, category, instruction, html, options, answer, explanation, material, srs_id)
  select bab_range, 'published', position, category, instruction, html, options, answer, explanation, material, srs_id
  from public.quiz_questions
  where bab_range = p_bab_range and status = 'draft'
  order by position;
end;
$$;

-- 4. Daftar versi & pemulihan ---------------------------------------------
create or replace function public.list_content_versions(p_kind text, p_ref text)
returns table (id bigint, created_at timestamptz, created_by_name text, reason text, question_count int)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  perform public.require_operator();
  return query
    select v.id, v.created_at, coalesce(p.full_name, 'SQL / sistem'), v.reason, jsonb_array_length(v.questions)
    from public.content_versions v
    left join public.profiles p on p.id = v.created_by
    where v.test_kind = p_kind and v.test_ref = p_ref
    order by v.created_at desc, v.id desc;
end;
$$;

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
    raise exception 'Ada % tes yang sedang dikerjakan siswa. Pulihkan setelah tes itu selesai.', v_open
      using errcode = 'P0001';
  end if;

  -- Isi saat ini disimpan dulu, jadi pemulihan pun bisa dibatalkan.
  perform public.snapshot_test_content(v.test_kind, v.test_ref, format('Sebelum memulihkan versi #%s', v.id));

  if v.test_kind = 'bab' then
    delete from public.quiz_questions where bab_range::text = v.test_ref;
    insert into public.quiz_questions
      (bab_range, status, position, category, instruction, html, options, answer, explanation, material, srs_id)
    select v.test_ref::int, s.status, r.position, r.category, r.instruction, r.html, r.options,
           r.answer, r.explanation, r.material, r.srs_id
    from jsonb_to_recordset(v.questions) as r(
           position int, category text, instruction text, html text, options jsonb,
           answer int, explanation text, material text, srs_id text)
    cross join (values ('published'), ('draft')) as s(status);
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
end;
$$;

-- 5. Hak eksekusi ----------------------------------------------------------
revoke execute on function public.log_content_change() from public, anon, authenticated;
revoke execute on function public.stamp_quiz_question() from public, anon, authenticated;
revoke execute on function public.snapshot_test_content(text, text, text) from public, anon, authenticated;
revoke execute on function public.open_attempt_count(text, text) from public, anon, authenticated;
revoke execute on function public.require_operator() from public, anon, authenticated;
revoke execute on function public.publish_quiz_range(int) from public, anon;
revoke execute on function public.list_content_versions(text, text) from public, anon;
revoke execute on function public.restore_test_content(bigint) from public, anon;
revoke execute on function public.mark_assignment_done(bigint) from public, anon;
grant execute on function public.publish_quiz_range(int) to authenticated;
grant execute on function public.list_content_versions(text, text) to authenticated;
grant execute on function public.restore_test_content(bigint) to authenticated;
grant execute on function public.mark_assignment_done(bigint) to authenticated;
