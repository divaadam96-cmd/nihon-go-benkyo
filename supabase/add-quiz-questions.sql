-- Bank soal Tes Kemampuan per-5-bab yang bisa dikelola Operator lewat web
-- (layar "Kelola Soal" di pages/latihan.html), dengan alur draft/terbitkan:
-- Operator bebas mengedit baris status='draft' kapan saja tanpa memengaruhi
-- siswa; siswa (dan generator soal) hanya pernah membaca baris
-- status='published'. publish_quiz_range() memindahkan draft -> published
-- dalam satu transaksi. Jalankan file ini SEKALI di Supabase Dashboard ->
-- SQL Editor -> New query -> Run (aman dijalankan ulang, pakai "if not
-- exists"/"or replace"). Bab yang BELUM ada baris published-nya di sini
-- otomatis tetap memakai bank soal statis lama (lihat buildSelectedQuestions
-- di js/pages/latihan.js) - migrasi dilakukan bertahap per rentang bab.

create table if not exists public.quiz_questions (
  id bigserial primary key,
  bab_range int not null,
  status text not null check (status in ('draft', 'published')) default 'draft',
  position int not null,
  category text not null,
  instruction text not null,
  html text not null,
  options jsonb not null,
  answer int not null,
  explanation text not null,
  material text not null,
  srs_id text,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id),
  unique (bab_range, status, position)
);

alter table public.quiz_questions enable row level security;

-- Siapa pun yang login boleh baca soal yang SUDAH TERBIT (siswa mengerjakan
-- tes lewat baris ini). Operator tambahan boleh baca baris draft miliknya
-- sendiri untuk keperluan Kelola Soal.
create policy "quiz_questions_select_published"
  on public.quiz_questions for select
  using (status = 'published' or public.current_user_role() = 'operator');

-- Hanya Operator yang boleh menulis, dan CUMA ke baris draft - baris
-- published tidak pernah ditulis langsung oleh client, hanya lewat
-- publish_quiz_range() (security definer) di bawah supaya siswa tidak
-- pernah melihat soal setengah-edit.
create policy "quiz_questions_operator_write_draft"
  on public.quiz_questions for all
  using (public.current_user_role() = 'operator' and status = 'draft')
  with check (public.current_user_role() = 'operator' and status = 'draft');

-- Pindahkan seluruh draft satu rentang bab ke published dalam satu
-- transaksi (hapus published lama, ganti dengan salinan draft saat ini) -
-- dipanggil oleh tombol "Terbitkan" di layar Kelola Soal.
create or replace function public.publish_quiz_range(p_bab_range int)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.current_user_role() <> 'operator' then
    raise exception 'Hanya Operator yang boleh menerbitkan soal.';
  end if;

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
