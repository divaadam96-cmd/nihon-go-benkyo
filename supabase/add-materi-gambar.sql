-- Gambar Materi yang diunggah Operator dari Kelola Materi (tab Tata bahasa).
-- Jalankan SETELAH fix-1-operator-mfa.sql (require_operator) dan
-- add-editor-konten.sql (konten_bab, konten_bab_draft, konten_bab_versi),
-- di SQL Editor Supabase (atau `supabase db query --linked -f
-- supabase/add-materi-gambar.sql`). Aman dijalankan ulang.
--
-- File disimpan di bucket publik "materi-gambar" dengan nama
-- pelajaran-<N>/<32 hex acak>.webp (browser mengecilkan & mengubah foto ke
-- WebP sebelum mengunggah, sekaligus membuang data EXIF/GPS). Di isi
-- pelajaran ditulis sebagai src "materi-gambar/pelajaran-<N>/<hex>.webp"
-- (lihat validate_konten_materi & js/materi-render.js).

-- 1. Bucket: publik untuk dibaca (isi materi bukan rahasia, bisa disimpan
--    offline), maks. 1 MB, hanya gambar raster (SVG ditolak).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('materi-gambar', 'materi-gambar', true, 1048576, array['image/webp', 'image/png', 'image/jpeg'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- 2. Hanya Operator yang mengunggah & menghapus, dan hanya dengan pola nama
--    yang dipakai editor.
drop policy if exists "materi_gambar_insert_operator" on storage.objects;
create policy "materi_gambar_insert_operator"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'materi-gambar'
    and public.current_user_role() = 'operator'
    and name ~ '^pelajaran-([1-9]|[1-4][0-9]|50)/[0-9a-f]{32}[.]webp$'
  );
drop policy if exists "materi_gambar_delete_operator" on storage.objects;
create policy "materi_gambar_delete_operator"
  on storage.objects for delete to authenticated
  using (bucket_id = 'materi-gambar' and public.current_user_role() = 'operator');

-- 3. Gambar yang tidak dipakai di mana pun: isi terbit, draft, MAUPUN riwayat
--    versi (supaya "Pulihkan versi" tidak kehilangan gambarnya). File yang
--    baru diunggah (< 1 hari) dilewati - mungkin belum sempat disimpan ke
--    draft. Penghapusan file dilakukan browser lewat Storage API (menghapus
--    baris storage.objects dengan SQL tidak menghapus file aslinya).
create or replace function public.materi_gambar_tak_terpakai()
returns table (name text, ukuran bigint, created_at timestamptz)
language plpgsql stable security definer set search_path = public, storage as $$
#variable_conflict use_column
begin
  perform public.require_operator();
  return query
    select o.name, coalesce((o.metadata ->> 'size')::bigint, 0), o.created_at
    from storage.objects o
    where o.bucket_id = 'materi-gambar'
      and o.created_at < now() - interval '1 day'
      and not exists (select 1 from public.konten_bab k where position('materi-gambar/' || o.name in k.isi::text) > 0)
      and not exists (select 1 from public.konten_bab_draft d where position('materi-gambar/' || o.name in d.isi::text) > 0)
      and not exists (select 1 from public.konten_bab_versi v where v.isi is not null and position('materi-gambar/' || o.name in v.isi::text) > 0)
    order by o.created_at;
end;
$$;
revoke execute on function public.materi_gambar_tak_terpakai() from public, anon;
grant execute on function public.materi_gambar_tak_terpakai() to authenticated;
