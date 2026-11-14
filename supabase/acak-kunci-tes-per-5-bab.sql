-- Acak ulang urutan pilihan jawaban Tes per 5 Bab (quiz_questions).
--
-- Kenapa: 35-38 dari 40 soal tiap rentang menyimpan kunci di pilihan
-- pertama (A) - peninggalan bank soal awal. Siswa tidak melihat pola ini
-- (latihan.js mengacak pilihan setiap kali tes dibuka), tapi pola itu
-- terlihat di Kelola Soal dan langsung bocor kalau pengacakan di browser
-- suatu saat dimatikan. Paket ujian & soal Mendengarkan sebarannya sudah
-- merata, jadi tidak disentuh.
--
-- Yang dilakukan, per soal terbit: urutan `options` diacak dan `answer`
-- dipindah ke posisi baru kunci yang sama - teks soal, pilihan, dan
-- pembahasan tidak berubah (pembahasan tidak menyebut huruf pilihan; sudah
-- dicek 2026-11-14). Sebelumnya isi tiap rentang disimpan sebagai versi di
-- content_versions, jadi bisa dipulihkan lewat Kelola Soal -> Riwayat.
-- Setiap perubahan baris juga tercatat di content_audit_log.
--
-- Jalankan SEKALI di SQL Editor Supabase saat tidak ada siswa yang sedang
-- mengerjakan Tes per 5 Bab (dicek otomatis; kalau ada, perintah dibatalkan
-- tanpa mengubah apa pun). Menjalankan ulang = mengacak ulang lagi.

do $$
declare
  q record;
  v_order int[];
  v_options jsonb;
  v_answer int;
  v_count int := 0;
begin
  if exists (select 1 from public.test_attempts t
             where t.test_kind = 'bab' and t.finished_at is null) then
    raise exception 'Ada siswa yang sedang mengerjakan Tes per 5 Bab. Tunggu sampai selesai, lalu jalankan lagi.';
  end if;
  if exists (select 1 from public.content_drafts d where d.test_kind = 'bab') then
    raise exception 'Ada draft Tes per 5 Bab di Kelola Soal. Terbitkan atau buang draft itu dulu, lalu jalankan lagi.';
  end if;

  for r in 1..46 by 5 loop
    perform public.snapshot_test_content('bab', r::text, 'Sebelum urutan pilihan jawaban diacak ulang');
  end loop;

  for q in select id, options, answer from public.quiz_questions where status = 'published' loop
    -- v_order[i] = index pilihan lama yang tampil di posisi baru i (1-based).
    select array_agg(i order by random()) into v_order
      from generate_series(0, jsonb_array_length(q.options) - 1) i;
    select jsonb_agg(q.options -> v_order[n] order by n) into v_options
      from generate_series(1, array_length(v_order, 1)) n;
    v_answer := array_position(v_order, q.answer) - 1;
    update public.quiz_questions set options = v_options, answer = v_answer where id = q.id;
    v_count := v_count + 1;
  end loop;

  raise notice 'Selesai: % soal diacak ulang.', v_count;
end;
$$;

-- Cek hasil: sebaran kunci per rentang (seharusnya kira-kira merata).
select bab_range,
       count(*) filter (where answer = 0) as a,
       count(*) filter (where answer = 1) as b,
       count(*) filter (where answer = 2) as c,
       count(*) filter (where answer = 3) as d
from public.quiz_questions
where status = 'published'
group by bab_range
order by bab_range;
