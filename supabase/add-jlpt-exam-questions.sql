-- Bank soal simulasi ujian JLPT N5 (Mode 1: Contoh Resmi - 29 soal asli
-- dari dokumen 問題例 milik Japan Foundation/JEES, dipublikasikan bebas
-- untuk menunjukkan bentuk ujian JLPT kepada publik; ditranskripsi apa
-- adanya, BUKAN hasil ciptaan). Karena ini konten resmi pihak lain (bukan
-- bank soal buatan sendiri seperti quiz_questions per-bab), kunci jawaban
-- TIDAK pernah dikirim ke klien selama siswa mengerjakan ujian - hanya
-- lewat get_jlpt_exam_questions() (tanpa correct_answer/explanation) saat
-- mengerjakan, dan grade_jlpt_exam() (security definer, menilai di server)
-- saat submit. Jalankan SEKALI di Supabase Dashboard -> SQL Editor -> New
-- query -> Run (aman dijalankan ulang, pakai "if not exists"/"or replace").

create table if not exists public.jlpt_exam_questions (
  id bigserial primary key,
  exam_id text not null,
  mode text not null check (mode in ('sample', 'full')),
  section text not null,
  subcategory text not null,
  question_number int not null,
  question_type text not null check (question_type in (
    'MULTIPLE_CHOICE', 'SENTENCE_ARRANGEMENT', 'CLOZE_TEST',
    'READING_COMPREHENSION', 'IMAGE_BASED', 'AUDIO_MULTIPLE_CHOICE',
    'AUDIO_IMAGE_CHOICE', 'AUDIO_RESPONSE'
  )),
  instruction text not null,
  question_html text not null,
  options jsonb not null,
  correct_answer int not null,
  explanation text,
  reading_passage_id text,
  image_url text,
  audio_url text,
  audio_start numeric,
  audio_end numeric,
  source_file text not null,
  source_page int,
  difficulty text not null default 'N5',
  status text not null default 'official_sample' check (status in ('official_sample', 'bank_soal', 'needs_review')),
  position int not null,
  unique (exam_id, mode, position)
);

alter table public.jlpt_exam_questions enable row level security;

-- Tabel mentah (termasuk correct_answer) HANYA boleh dibaca langsung oleh
-- Operator (untuk Kelola Soal nanti). Siswa/Sensei mengambil soal lewat
-- get_jlpt_exam_questions() di bawah, bukan select langsung ke tabel ini.
drop policy if exists "jlpt_exam_questions_operator_select" on public.jlpt_exam_questions;
create policy "jlpt_exam_questions_operator_select"
  on public.jlpt_exam_questions for select
  using (public.current_user_role() = 'operator');

drop policy if exists "jlpt_exam_questions_operator_write" on public.jlpt_exam_questions;
create policy "jlpt_exam_questions_operator_write"
  on public.jlpt_exam_questions for all
  using (public.current_user_role() = 'operator')
  with check (public.current_user_role() = 'operator');

-- Soal TANPA kunci jawaban/pembahasan - dipakai selagi siswa mengerjakan
-- ujian. Hanya soal status='official_sample' (needs_review disembunyikan
-- sampai diverifikasi manual).
create or replace function public.get_jlpt_exam_questions(p_exam_id text, p_mode text)
returns table (
  id bigint, section text, subcategory text, question_number int,
  question_type text, instruction text, question_html text, options jsonb,
  reading_passage_id text, image_url text, audio_url text,
  audio_start numeric, audio_end numeric, difficulty text, "position" int
)
language sql
security definer
set search_path = public
stable
as $$
  select q.id, q.section, q.subcategory, q.question_number, q.question_type,
         q.instruction, q.question_html, q.options, q.reading_passage_id,
         q.image_url, q.audio_url, q.audio_start, q.audio_end, q.difficulty, q.position as "position"
  from public.jlpt_exam_questions q
  where q.exam_id = p_exam_id and q.mode = p_mode and q.status = 'official_sample'
  order by q.position;
$$;

-- Supabase otomatis memberi grant EXECUTE ke anon/authenticated lewat
-- default privileges tiap kali function baru dibuat - revoke eksplisit
-- dari anon supaya soal (walau tanpa kunci jawaban) tidak bisa diambil
-- tanpa login sama sekali.
revoke execute on function public.get_jlpt_exam_questions(text, text) from public, anon;
grant execute on function public.get_jlpt_exam_questions(text, text) to authenticated;

-- Menilai jawaban siswa DI SERVER (kunci jawaban tidak pernah dikirim ke
-- klien sebelum ini dipanggil). p_answers: jsonb object {"<question_id>":
-- <submitted_option_index>, ...}. Menyimpan ringkasan ke quiz_results
-- (tabel yang sudah ada, exam_type='jlpt') dan mengembalikan detail per
-- soal (termasuk correct_answer + explanation) untuk layar review.
create or replace function public.grade_jlpt_exam(p_exam_id text, p_mode text, p_answers jsonb)
returns table (
  question_id bigint, section text, submitted_answer int, correct_answer int,
  is_correct boolean, explanation text, question_html text, options jsonb
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_correct_count int := 0;
  v_total_count int := 0;
  v_category_scores jsonb := '{}'::jsonb;
  v_section text;
  v_section_correct int;
  v_section_total int;
begin
  create temporary table if not exists _jlpt_grade_result on commit drop as
  select q.id as question_id, q.section,
         (p_answers ->> q.id::text)::int as submitted_answer,
         q.correct_answer,
         (p_answers ->> q.id::text)::int = q.correct_answer as is_correct,
         q.explanation, q.question_html, q.options
  from public.jlpt_exam_questions q
  where q.exam_id = p_exam_id and q.mode = p_mode and q.status = 'official_sample';

  select count(*) filter (where r.is_correct), count(*)
    into v_correct_count, v_total_count
  from _jlpt_grade_result r;

  for v_section in select distinct r.section from _jlpt_grade_result r loop
    select count(*) filter (where r.is_correct), count(*)
      into v_section_correct, v_section_total
      from _jlpt_grade_result r where r.section = v_section;
    v_category_scores := v_category_scores || jsonb_build_object(
      v_section, jsonb_build_object('correct', v_section_correct, 'total', v_section_total)
    );
  end loop;

  insert into public.quiz_results (user_id, exam_type, correct_count, total_count, category_scores)
  values (auth.uid(), 'jlpt', v_correct_count, v_total_count, v_category_scores);

  return query select * from _jlpt_grade_result;
end;
$$;

revoke execute on function public.grade_jlpt_exam(text, text, jsonb) from public, anon;
grant execute on function public.grade_jlpt_exam(text, text, jsonb) to authenticated;
