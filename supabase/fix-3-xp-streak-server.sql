-- Perbaikan keamanan #3: XP, streak, dan progres hafalan dihitung SERVER.
--
-- Sebelumnya browser menghitung sendiri kotak SRS & jumlah ulasan lalu
-- menulis langsung ke srs_progress / activity_log - siswa bisa menulis
-- angka sembarang lewat API (XP palsu, streak untuk tanggal lampau, semua
-- kanji "dikuasai"), dan semuanya tampil di Pantau Siswa. Sekarang:
--   * Siswa hanya bisa MEMBACA kedua tabel; satu-satunya cara mengubahnya
--     adalah srs_review(), yang menghitung semuanya di server.
--   * Tanggal ulasan = tanggal server (UTC, sama dengan perhitungan lama di
--     browser) - streak tidak bisa dibuat mundur.
--   * Kotak SRS hanya naik kalau item memang sudah jatuh tempo; mengulas
--     item yang sama berulang kali di hari yang sama tidak menaikkannya.
--   * XP: satu item hanya dihitung sekali per hari, maksimal
--     srs_daily_review_cap() ulasan per siswa per hari.
--   * Sensei/Operator tetap bisa melihat & mereset progres siswa (Pantau
--     Siswa), tapi tidak bisa mengisinya.
-- Jalankan SEBELUM merge PR-nya. Aman dijalankan ulang.

create or replace function public.srs_daily_review_cap()
returns int language sql immutable as $$ select 300 $$;

-- Jarak hari per kotak SRS (sama dengan SRS_INTERVAL_DAYS di js/srs.js).
create or replace function public.srs_interval_days(p_box int)
returns int language sql immutable as $$
  select (array[1, 2, 4, 7, 14, 30, 60])[least(greatest(p_box, 0), 6) + 1]
$$;

-- p_outcome: 'again' (lupa), 'hard' (masih belajar), 'good' (sudah kuat).
create or replace function public.srs_review(p_item_id text, p_outcome text)
returns table (
  item_id text, box int, due date, reviews int, last_result text,
  last_reviewed_at date, counted boolean, today_count int
)
language plpgsql
security definer
set search_path = public
as $$
-- Nama kolom output (item_id, box, ...) sama dengan kolom tabel: pakai
-- kolom tabel saat bentrok (mis. di "on conflict (user_id, item_id)").
#variable_conflict use_column
declare
  v_uid uuid := auth.uid();
  v_today date := (now() at time zone 'utc')::date;
  v_item public.srs_progress;
  v_found boolean;
  v_was_due boolean;
  v_box int;
  v_due date;
  v_counted boolean;
  v_today_count int;
begin
  if v_uid is null then
    raise exception 'Harus login.' using errcode = '42501';
  end if;
  if p_outcome is null or p_outcome not in ('again', 'hard', 'good') then
    raise exception 'Hasil ulasan tidak dikenal.' using errcode = '22023';
  end if;
  -- Format id item yang dipakai aplikasi: kanji:<karakter>,
  -- materi:book<1|2>:<pelajaran>:<pola>, hafalan:bab<N>-<kosakata|kanji>:<kata>.
  if p_item_id is null or p_item_id !~ '^(kanji:[^:[:space:]]{1,20}|materi:book[12]:[0-9]{1,2}:[0-9]{1,2}|hafalan:bab[0-9]{1,2}-(kosakata|kanji):[^\n]{1,60})$' then
    raise exception 'Item tidak valid.' using errcode = '22023';
  end if;

  select * into v_item from public.srs_progress s
    where s.user_id = v_uid and s.item_id = p_item_id
    for update;
  v_found := found;
  if not v_found then
    v_item.box := 0;
    v_item.reviews := 0;
    v_item.due := null;
    v_item.last_reviewed_at := null;
  end if;

  v_was_due := v_item.reviews = 0 or v_item.due is null or v_item.due <= v_today;
  v_box := v_item.box;
  v_due := v_item.due;
  if p_outcome = 'again' then
    v_box := 0;
    v_due := v_today + public.srs_interval_days(v_box);
  elsif p_outcome = 'hard' then
    v_box := greatest(0, v_box - 1);
    v_due := v_today + public.srs_interval_days(v_box);
  elsif v_was_due then
    v_box := least(6, v_box + 1);
    v_due := v_today + public.srs_interval_days(v_box);
  end if; -- 'good' sebelum jatuh tempo: kotak & jadwal tetap.

  insert into public.srs_progress as s (user_id, item_id, box, due, reviews, last_result, last_reviewed_at)
  values (v_uid, p_item_id, v_box, v_due, 1, p_outcome, v_today)
  on conflict (user_id, item_id) do update
    set box = excluded.box, due = excluded.due, reviews = s.reviews + 1,
        last_result = excluded.last_result, last_reviewed_at = excluded.last_reviewed_at;

  -- XP/streak: item ini belum diulas hari ini & batas harian belum penuh.
  select coalesce((select a.count from public.activity_log a
                   where a.user_id = v_uid and a.activity_date = v_today), 0)
    into v_today_count;
  v_counted := v_item.last_reviewed_at is distinct from v_today
               and v_today_count < public.srs_daily_review_cap();
  if v_counted then
    insert into public.activity_log as a (user_id, activity_date, count)
    values (v_uid, v_today, 1)
    on conflict (user_id, activity_date) do update set count = a.count + 1
    returning a.count into v_today_count;
  end if;

  return query
    select s.item_id, s.box, s.due, s.reviews, s.last_result, s.last_reviewed_at, v_counted, v_today_count
    from public.srs_progress s
    where s.user_id = v_uid and s.item_id = p_item_id;
end;
$$;

revoke execute on function public.srs_review(text, text) from public, anon;
grant execute on function public.srs_review(text, text) to authenticated;

-- Pemilik: hanya baca.
drop policy if exists "srs_progress_owner_all" on public.srs_progress;
drop policy if exists "srs_progress_owner_select" on public.srs_progress;
create policy "srs_progress_owner_select"
  on public.srs_progress for select using (user_id = auth.uid());

drop policy if exists "activity_log_owner_all" on public.activity_log;
drop policy if exists "activity_log_owner_select" on public.activity_log;
create policy "activity_log_owner_select"
  on public.activity_log for select using (user_id = auth.uid());

-- Staf: baca & hapus (reset progres di Pantau Siswa), tidak bisa mengisi.
drop policy if exists "srs_progress_staff_all" on public.srs_progress;
drop policy if exists "srs_progress_staff_select" on public.srs_progress;
drop policy if exists "srs_progress_staff_delete" on public.srs_progress;
create policy "srs_progress_staff_select"
  on public.srs_progress for select using (public.current_user_role() in ('sensei', 'operator'));
create policy "srs_progress_staff_delete"
  on public.srs_progress for delete using (public.current_user_role() in ('sensei', 'operator'));

drop policy if exists "activity_log_staff_all" on public.activity_log;
drop policy if exists "activity_log_staff_select" on public.activity_log;
drop policy if exists "activity_log_staff_delete" on public.activity_log;
create policy "activity_log_staff_select"
  on public.activity_log for select using (public.current_user_role() in ('sensei', 'operator'));
create policy "activity_log_staff_delete"
  on public.activity_log for delete using (public.current_user_role() in ('sensei', 'operator'));
