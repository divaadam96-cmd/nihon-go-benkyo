-- Jalankan file ini SETELAH kamu membuat akun Operator pertama lewat
-- Supabase Dashboard -> Authentication -> Users -> Add user (isi email +
-- password untuk dirimu sendiri, centang "Auto Confirm User").
--
-- Setelah user itu dibuat, salin UUID-nya dari kolom "UID" di tabel Users,
-- lalu ganti 'GANTI-DENGAN-UID-KAMU' di bawah ini dengan UID tersebut
-- sebelum menjalankan query ini.

insert into public.profiles (id, full_name, role)
values ('GANTI-DENGAN-UID-KAMU', 'Divha', 'operator');
