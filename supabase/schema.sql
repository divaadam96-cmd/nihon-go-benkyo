-- Nihon GO Benkyo: skema database untuk sistem login 3 peran.
-- Jalankan seluruh file ini di Supabase Dashboard -> SQL Editor -> New query -> Run.

-- ============================================================
-- 1. Tabel profil (peran user)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text,
  role text not null check (role in ('operator', 'sensei', 'siswa')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Fungsi perantara (SECURITY DEFINER): membaca role user yang sedang
-- login TANPA melewati RLS tabel profiles lagi. Dipakai oleh policy di
-- bawah supaya tidak terjadi infinite recursion (policy tabel profiles
-- yang query tabel profiles itu sendiri secara langsung akan error).
create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Siapa pun yang login boleh baca profil sendiri.
create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid());

-- Sensei & Operator boleh baca semua profil (perlu untuk daftar siswa).
create policy "profiles_select_all_for_staff"
  on public.profiles for select
  using (public.current_user_role() in ('sensei', 'operator'));

-- Tidak ada policy INSERT/UPDATE/DELETE untuk client sama sekali:
-- hanya Edge Function (pakai service_role, otomatis melewati RLS) yang
-- boleh menambah/mengubah profil. Ini memaksakan "cuma Operator yang
-- bisa bikin akun" di level database, bukan cuma di tampilan.

-- ============================================================
-- 2. Tabel progres SRS (kanji, materi, hafalan)
-- ============================================================
create table if not exists public.srs_progress (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  item_id text not null,
  box int not null default 0,
  due date,
  reviews int not null default 0,
  last_result text,
  last_reviewed_at date,
  unique (user_id, item_id)
);

alter table public.srs_progress enable row level security;

create policy "srs_progress_owner_all"
  on public.srs_progress for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "srs_progress_staff_all"
  on public.srs_progress for all
  using (public.current_user_role() in ('sensei', 'operator'))
  with check (public.current_user_role() in ('sensei', 'operator'));

-- ============================================================
-- 3. Tabel log aktivitas harian (streak & grafik dashboard)
-- ============================================================
create table if not exists public.activity_log (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  activity_date date not null,
  count int not null default 0,
  unique (user_id, activity_date)
);

alter table public.activity_log enable row level security;

create policy "activity_log_owner_all"
  on public.activity_log for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "activity_log_staff_all"
  on public.activity_log for all
  using (public.current_user_role() in ('sensei', 'operator'))
  with check (public.current_user_role() in ('sensei', 'operator'));

-- ============================================================
-- 4. Tabel tugas dari Sensei/Operator ke Siswa tertentu
-- ============================================================
create table if not exists public.assignments (
  id bigserial primary key,
  sensei_id uuid not null references auth.users (id) on delete cascade,
  siswa_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.assignments enable row level security;

create policy "assignments_select_own_siswa"
  on public.assignments for select
  using (siswa_id = auth.uid());

create policy "assignments_staff_all"
  on public.assignments for all
  using (public.current_user_role() in ('sensei', 'operator'))
  with check (public.current_user_role() in ('sensei', 'operator'));

-- Siswa menandai tugas selesai lewat fungsi ini saja (bukan UPDATE
-- langsung) - supaya field lain (judul, deadline, dst.) tidak bisa
-- diubah sembarangan oleh siswa, cuma status selesainya.
create or replace function public.mark_assignment_done(assignment_id bigint)
returns void
language sql
security definer
set search_path = public
as $$
  update public.assignments
  set completed = true, completed_at = now()
  where id = assignment_id and siswa_id = auth.uid();
$$;
