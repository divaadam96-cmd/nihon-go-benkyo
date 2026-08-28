-- Tugas dari Sensei/Operator ke Siswa tertentu (fitur "Tugas dari
-- Sensei" di dashboard). Jalankan sekali di SQL Editor.

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

-- Siswa cuma bisa baca tugas miliknya sendiri.
create policy "assignments_select_own_siswa"
  on public.assignments for select
  using (siswa_id = auth.uid());

-- Sensei & Operator kelola semua tugas (buat, lihat, edit, hapus).
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
