-- Target per Bab (kunci bab berurutan). Jalankan sekali di SQL Editor
-- (atau `supabase db query --linked -f supabase/add-target-bab.sql`).
-- Butuh current_user_role() (schema.sql). Aman dijalankan ulang.
--
-- Alur (js/tugas-bab.js):
--   1. Siswa membaca materi Bab N lalu menekan "Sudah paham" -> target
--      'materi' tercatat.
--   2. Siswa mengerjakan tugas bab itu (kotoba, kanji, kalimat). Setiap
--      tugas selesai dikirim lewat catat_target_bab(); tugas dianggap lulus
--      kalau skornya >= target_bab_kkm() (80). Skor terbaik disimpan,
--      status lulus tidak pernah dicabut oleh percobaan berikutnya.
--   3. Bab N+1 terbuka untuk siswa kalau materi Bab N sudah ditandai,
--      semua tugasnya sudah dikerjakan, dan RATA-RATA skor_terbaik semua
--      tugas >= 80 (dihitung di js/tugas-bab.js; kolom `lulus` per tugas
--      hanya penanda skor >= 80, bukan syarat). Daftar target per bab
--      ditentukan di js/tugas-bab.js (bab yang belum punya soal kalimat
--      tidak mewajibkan target kalimat).
-- Sensei/Operator tidak dikunci (aturan hanya untuk peran siswa), tapi
-- boleh membaca target semua siswa (untuk Pantau Siswa nanti).
--
-- Catatan keamanan: tugas dinilai di browser (bahan soalnya = kosakata/
-- kanji publik di data/bab-data.js), server hanya mencatat. Siswa yang
-- sengaja memanggil RPC ini langsung bisa membuka bab tanpa mengerjakan -
-- yang dirugikan dirinya sendiri, dan riwayat percobaan tetap tercatat.

-- 1. Tabel -----------------------------------------------------------------
create table if not exists public.bab_targets (
  siswa_id uuid not null references auth.users (id) on delete cascade,
  bab int not null check (bab between 1 and 50),
  target text not null check (target in (
    'materi',
    'kotoba-jp-id', 'kotoba-id-jp',
    'kanji-kanji-kana', 'kanji-kana-kanji', 'kanji-kanji-id', 'kanji-id-kanji',
    'kalimat-susun', 'kalimat-pilih'
  )),
  skor_terbaik int not null default 0 check (skor_terbaik between 0 and 100),
  skor_terakhir int not null default 0 check (skor_terakhir between 0 and 100),
  percobaan int not null default 0,
  lulus boolean not null default false,
  lulus_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (siswa_id, bab, target)
);

alter table public.bab_targets enable row level security;

-- Siswa membaca miliknya sendiri; menulis HANYA lewat catat_target_bab().
drop policy if exists "bab_targets_select_own" on public.bab_targets;
create policy "bab_targets_select_own"
  on public.bab_targets for select
  using (siswa_id = auth.uid());

drop policy if exists "bab_targets_select_staff" on public.bab_targets;
create policy "bab_targets_select_staff"
  on public.bab_targets for select
  using (coalesce(public.current_user_role(), '') in ('sensei', 'operator'));

-- 2. Nilai minimal lulus (samakan dengan TUGAS_KKM di js/tugas-bab.js) ----
create or replace function public.target_bab_kkm()
returns int
language sql
immutable
as $$ select 80 $$;

-- 3. Catat hasil satu target ------------------------------------------------
create or replace function public.catat_target_bab(
  p_bab int, p_target text, p_benar int, p_total int
)
returns public.bab_targets
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  v_uid uuid := auth.uid();
  v_skor int;
  v_lulus boolean;
  v_row public.bab_targets;
begin
  if v_uid is null then
    raise exception 'Harus login.';
  end if;
  if p_bab is null or p_bab < 1 or p_bab > 50 then
    raise exception 'Bab tidak valid.';
  end if;
  if p_total is null or p_total < 1 or p_total > 500
     or p_benar is null or p_benar < 0 or p_benar > p_total then
    raise exception 'Jumlah jawaban tidak valid.';
  end if;
  if p_target = 'materi' and (p_benar <> 1 or p_total <> 1) then
    raise exception 'Target materi dicatat dengan 1/1.';
  end if;

  v_skor := floor(100.0 * p_benar / p_total);
  v_lulus := v_skor >= public.target_bab_kkm();

  -- Nilai p_target yang tidak dikenal ditolak oleh check constraint tabel.
  insert into public.bab_targets as t
    (siswa_id, bab, target, skor_terbaik, skor_terakhir, percobaan, lulus, lulus_at, updated_at)
  values
    (v_uid, p_bab, p_target, v_skor, v_skor, 1, v_lulus,
     case when v_lulus then now() end, now())
  on conflict (siswa_id, bab, target) do update
    set skor_terbaik = greatest(t.skor_terbaik, excluded.skor_terbaik),
        skor_terakhir = excluded.skor_terakhir,
        percobaan = t.percobaan + 1,
        lulus = t.lulus or excluded.lulus,
        lulus_at = coalesce(t.lulus_at, excluded.lulus_at),
        updated_at = now()
  returning * into v_row;

  return v_row;
end;
$$;

revoke all on function public.catat_target_bab(int, text, int, int) from public, anon;
grant execute on function public.catat_target_bab(int, text, int, int) to authenticated;
