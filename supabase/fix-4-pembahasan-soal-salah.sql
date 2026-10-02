-- Perbaikan keamanan #4: setelah tes, siswa hanya menerima SKOR dan
-- PEMBAHASAN untuk soal yang dijawab SALAH.
--
-- Sebelumnya grade_test() mengembalikan kunci jawaban + pembahasan SEMUA
-- soal, sehingga halaman hasil memuat kunci lengkap yang mudah
-- di-screenshot dan dibagikan ke siswa lain yang mendapat paket yang sama.
-- Sekarang untuk soal yang dijawab benar, server tidak mengirim kunci &
-- pembahasannya sama sekali (bukan sekadar disembunyikan di tampilan).
-- Sensei/Operator (pratinjau tes) tetap menerima pembahasan lengkap.
--
-- Catatan: siswa tetap tahu jawabannya sendiri untuk soal yang benar, jadi
-- siswa yang sengaja mencatat semuanya masih bisa menyusun kunci lengkap.
-- Pengaman yang efektif untuk itu: beri paket berbeda ke siswa berbeda.
--
-- Jalankan SETELAH PR-nya di-merge & live: website versi lama mengartikan
-- kunci kosong (null) sebagai jawaban salah sehingga skor di layar keliru,
-- sedangkan versi baru menangani kedua format. Aman dijalankan ulang.

create or replace function public.grade_test(p_attempt_id bigint, p_answers jsonb default '{}'::jsonb)
returns table (question_id bigint, answer int, explanation text, is_correct boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  a public.test_attempts;
  v_staff boolean := coalesce(public.current_user_role() in ('sensei', 'operator'), false);
begin
  select * into a from public.test_attempts t where t.id = p_attempt_id;
  if not found or a.user_id <> auth.uid() then
    raise exception 'Percobaan tes tidak ditemukan.' using errcode = '42501';
  end if;
  if a.finished_at is null then
    if now() <= a.deadline + public.test_grace() then
      perform public.save_test_answers(a.id, coalesce(p_answers, '{}'::jsonb));
      perform public.finalize_test_attempt(a.id, 'submitted');
    else
      perform public.finalize_test_attempt(a.id, 'timeout');
    end if;
    select * into a from public.test_attempts t where t.id = p_attempt_id;
  end if;
  return query
    select g.id,
           case when g.ok and not v_staff then null else g.answer end,
           case when g.ok and not v_staff then null else g.explanation end,
           g.ok
    from (
      select k.id, k.position, k.answer, k.explanation,
             coalesce((a.answers ->> k.id::text) ~ '^\d+$'
                      and (a.answers ->> k.id::text)::int = k.answer, false) as ok
      from public.test_answer_key(a.test_kind, a.test_ref) k
    ) g
    order by g.position;
end;
$$;

revoke execute on function public.grade_test(bigint, jsonb) from public, anon;
grant execute on function public.grade_test(bigint, jsonb) to authenticated;
