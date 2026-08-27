-- Perbaikan: policy "profiles_select_all_for_staff" (dan sepupunya di
-- srs_progress/activity_log) mengecek tabel profiles dari DALAM policy
-- tabel profiles sendiri -> infinite recursion di Postgres. Jalankan
-- skrip ini SEKALI untuk memperbaiki (aman dijalankan meski sudah pernah
-- menjalankan schema.sql sebelumnya).

-- Fungsi perantara (SECURITY DEFINER) supaya pengecekan role tidak lagi
-- lewat RLS tabel profiles, jadi tidak ada lagi rekursi.
create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Ganti policy lama (yang rekursif) dengan versi yang pakai fungsi di atas.
drop policy if exists "profiles_select_all_for_staff" on public.profiles;
create policy "profiles_select_all_for_staff"
  on public.profiles for select
  using (public.current_user_role() in ('sensei', 'operator'));

drop policy if exists "srs_progress_staff_all" on public.srs_progress;
create policy "srs_progress_staff_all"
  on public.srs_progress for all
  using (public.current_user_role() in ('sensei', 'operator'))
  with check (public.current_user_role() in ('sensei', 'operator'));

drop policy if exists "activity_log_staff_all" on public.activity_log;
create policy "activity_log_staff_all"
  on public.activity_log for all
  using (public.current_user_role() in ('sensei', 'operator'))
  with check (public.current_user_role() in ('sensei', 'operator'));
