# Checklist QA manual — Nihon GO Benkyo

Belum ada automated test (lihat README bagian "Testing"). Jalankan checklist
ini secara manual sebelum setiap deploy yang menyentuh alur di bawah, dan
sekali penuh sebelum merilis perubahan besar.

## 1. Login & peran

- [ ] Login sebagai **Operator** pakai email asli (mengandung `@`).
- [ ] Login sebagai **Sensei** pakai ID login sintetis (tanpa `@`).
- [ ] Login sebagai **Siswa** pakai ID login sintetis.
- [ ] Salah password → pesan error tampil, tidak menembus ke dashboard.
- [ ] Menu **Pantau Siswa** & **Admin** di sidebar hanya muncul untuk peran yang berhak (cek dengan DevTools kalau perlu, RLS di database tetap jadi lapisan pertahanan utama).

## 2. Panel Admin (Operator)

- [ ] Buat akun Sensei baru → muncul di daftar akun.
- [ ] Buat akun Siswa baru → muncul di daftar akun, bisa langsung dipakai login.
- [ ] Hapus akun Siswa/Sensei → hilang dari daftar, tidak bisa login lagi.
- [ ] Coba hapus akun Operator → ditolak dengan pesan jelas.
- [ ] Password kurang dari 6 karakter → ditolak dengan pesan jelas.

## 3. Panel Pantau Siswa (Sensei/Operator)

- [ ] Daftar siswa tampil dengan streak, due count, dan **XP** yang masuk akal.
- [ ] Buka detail satu siswa → statistik Kanji/Materi/Hafalan + XP + jumlah sesi quiz tampil benar.
- [ ] Beri tugas baru ke siswa → siswa melihatnya di dashboard ("Tugas dari Sensei").
- [ ] Hapus tugas → hilang dari kedua sisi (Sensei & Siswa).
- [ ] Reset progres siswa → status SRS siswa itu kembali ke nol, due/mastered ikut turun.

## 4. Dashboard Siswa

- [ ] Banner pengingat belajar tampil kalau belum ada aktivitas hari ini, dan hilang setelah satu review dilakukan.
- [ ] Kartu "Rencana hari ini" (hafalan/materi/kanji/quiz) tercentang **otomatis** setelah aktivitas terkait dilakukan hari itu — bukan lagi bisa diklik manual.
- [ ] Total XP & "+X XP minggu ini" naik setelah melakukan review flashcard/kanji atau menyelesaikan quiz.
- [ ] Grafik "Aktivitas 6 minggu terakhir" dan progres level Buku 1/Buku 2 menampilkan angka yang masuk akal (bukan 0 terus kalau sudah ada aktivitas).

## 5. Flashcard & Kanji

- [ ] Flashcard: "Sudah paham" menaikkan box SRS item itu; "Belum ingat" mengembalikannya ke box 0.
- [ ] Belajar Kanji: animasi urutan goresan tampil, tombol kanji sebelumnya/berikutnya bekerja.
- [ ] Buka `prototype-kanji-v2.html` atau `prototype-tes-v2.html` langsung di address bar **tanpa login** → otomatis redirect ke `index.html` (guard akses langsung).

## 6. Tes Kemampuan

- [ ] Selesaikan satu sesi simulasi JLPT atau JFT sampai layar hasil.
- [ ] Kembali ke halaman utama (dashboard) → kartu "Kerjakan quiz singkat" tercentang, Total XP bertambah sesuai skor.
- [ ] Cek di Supabase (Table Editor / `supabase db query --linked "select * from quiz_results order by created_at desc limit 5;"`) baris hasil quiz baru benar-benar tersimpan dengan `exam_type`, `correct_count`, `total_count` yang sesuai.
- [ ] Login sebagai Sensei/Operator → panel Pantau Siswa menunjukkan sesi quiz siswa itu bertambah.

## 7. PWA

- [ ] Tombol "Install aplikasi" muncul di layar login (Chrome/Edge desktop atau Android).
- [ ] Di iOS Safari, petunjuk manual "Tambah ke Layar Utama" tampil.
- [ ] Setelah install, buka app dalam mode standalone — service worker aktif (cek tab Application → Service Workers di DevTools).
- [ ] Matikan koneksi internet setelah app pernah dibuka sekali → halaman masih bisa dibuka (cache offline).

## 8. Dua domain produksi + CORS

- [ ] Buka app dari **GitHub Pages** (`https://divaadam96-cmd.github.io/nihon-go-benkyo/`) → login sebagai Operator, buat/hapus satu akun test → tidak ada error CORS di console.
- [ ] Ulangi langkah yang sama dari **Vercel** (`https://nihon-go-benkyo-web.vercel.app/`).
- [ ] Kalau menambah domain produksi baru di kemudian hari, tambahkan ke `ALLOWED_ORIGINS` di **kedua** Edge Function (`supabase/functions/create-user/index.ts` dan `delete-user/index.ts`) lalu redeploy (`supabase functions deploy <nama>`), baru jalankan ulang dua langkah di atas.

## Ke depan: automated testing

Checklist manual ini dipilih dulu (bukan Playwright/e2e otomatis) karena
project belum punya `package.json`/tooling apa pun, dan database yang
dipakai adalah database produksi dengan siswa sungguhan — test otomatis
butuh akun test khusus yang terisolasi dari data asli. Kalau nanti mau
upgrade ke automated e2e:

1. Siapkan project Supabase **terpisah** untuk testing (jangan pakai project produksi ini), atau minimal akun test Operator/Sensei/Siswa yang jelas ditandai dan tidak dipakai siswa asli.
2. Tambahkan `package.json` + Playwright, jalankan lewat `npx playwright test` terhadap server statis lokal (`python -m http.server`).
3. Otomatiskan minimal alur di bagian 1, 2, dan 6 di atas — itu yang paling sering berubah dan paling berisiko kalau regresi.
