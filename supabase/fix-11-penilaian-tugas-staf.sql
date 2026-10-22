-- Perbaikan keamanan #11: grade_submission() memeriksa peran dengan
-- "current_user_role() not in (...)". Bila peran NULL (sesi login tanpa
-- baris profiles) hasilnya NULL, bukan true, sehingga pengecekan LOLOS dan
-- siapa pun bisa mengubah nilai tugas. Belum bisa dimanfaatkan saat audit
-- (pendaftaran publik mati, semua akun punya profil), tapi jangan
-- bergantung pada itu. Kini memakai require_staff() (add-pantau-siswa.sql)
-- yang aman terhadap NULL - satu tempat untuk aturan "siapa staf".
-- Jalankan SETELAH add-pantau-siswa.sql. Aman dijalankan ulang.

create or replace function public.grade_submission(p_submission_id bigint, p_score int, p_feedback text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_staff();
  if p_score is null or p_score < 0 or p_score > 100 then
    raise exception 'Nilai harus 0-100.';
  end if;

  update public.assignment_submissions
  set score = p_score,
      feedback = nullif(btrim(coalesce(p_feedback, '')), ''),
      graded_by = auth.uid(),
      graded_at = now()
  where id = p_submission_id;

  if not found then
    raise exception 'Kiriman tidak ditemukan.';
  end if;
end;
$$;

revoke execute on function public.grade_submission(bigint, int, text) from public, anon;
grant execute on function public.grade_submission(bigint, int, text) to authenticated;
