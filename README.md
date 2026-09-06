# Nihon GO Benkyo

Aplikasi belajar bahasa Jepang (materi, flashcard/hafalan dengan spaced
repetition, belajar kanji, simulasi tes JLPT/JFT) dengan sistem login 3
peran: **Operator** (kelola akun), **Sensei** (beri tugas & pantau
progres), **Siswa** (belajar).

## Teknologi

- **Frontend**: HTML/CSS/JavaScript vanilla, tanpa framework atau build
  step. Semua file dimuat langsung lewat `<script>`/`<link>` di
  `index.html`.
- **Backend**: [Supabase](https://supabase.com) — Auth (email+password),
  Postgres dengan Row Level Security, dan 2 Edge Function (Deno) untuk
  operasi yang butuh hak admin (buat/hapus akun).
- **PWA**: service worker (`sw.js`) + manifest, installable dan bisa
  dipakai offline untuk aset yang sudah pernah dimuat.

Tidak ada `package.json`/npm dependency — satu-satunya library eksternal
adalah `@supabase/supabase-js@2` yang dimuat lewat CDN jsdelivr.

## Struktur project

```
index.html              shell aplikasi: login screen + SPA, nav dibangun ulang oleh app.js
auth.js                 login Supabase, sinkronisasi profil/role
app.js                  inti aplikasi: dashboard, flashcard, materi, kanji dasar, dsb (dibungkus initApp())
app-sidebar.js          topnav & sidebar (rebuild menu, toggle rail/drawer, tooltip)
app-effects.js          efek visual mandiri (sakura petals) & pembersihan tampilan materi
quiz-results.js         cache + perhitungan XP dari riwayat quiz_results
srs.js                  mesin spaced-repetition bersama (kanji/materi/hafalan) + sync ke Supabase
admin.js                panel Operator: buat/hapus akun lewat Edge Function
monitor.js              panel Sensei/Operator: pantau progres & XP siswa, kelola tugas
assignments.js          kartu "Tugas dari Sensei" + banner pengingat harian
pwa.js / sw.js          install prompt & service worker
prototype-kanji-v2.*    modul Belajar Kanji (dimuat sebagai <iframe>)
prototype-tes-v2.*      modul simulasi tes JLPT/JFT (dimuat sebagai <iframe>)
data/*.js               dataset (kanji, kana, materi per-bab, stroke order)
supabase/                schema.sql + migrasi tambahan + 2 Edge Function
QA_CHECKLIST.md          checklist QA manual untuk alur kritis
```

`app.js` masih berukuran besar — bagian materi/dashboard/kanji-kana yang
sangat saling terkait sengaja belum dipecah lebih jauh karena belum ada
automated test untuk menjamin tidak ada regresi (lihat `QA_CHECKLIST.md`).

## Setup Supabase dari nol

Jalankan berurutan di **Supabase Dashboard → SQL Editor** (atau lewat
`supabase db query --linked -f <file>` kalau project sudah di-link lewat
CLI):

1. `supabase/schema.sql` — tabel inti (`profiles`, `srs_progress`,
   `activity_log`, `assignments`) + RLS.
2. `supabase/add-email-column.sql` — kolom `email` di `profiles`.
3. `supabase/add-quiz-results.sql` — tabel riwayat hasil Tes Kemampuan.
4. `supabase/fix-rls-recursion.sql` — hanya perlu kalau `schema.sql` yang
   dipakai adalah versi lama (sudah otomatis benar di versi saat ini).
5. `supabase/bootstrap-operator.sql` — buat akun Operator pertama: buat
   dulu usernya lewat **Authentication → Users → Add user** di dashboard,
   salin UID-nya, lalu isi ke file ini sebelum dijalankan.

Lalu deploy 2 Edge Function (butuh Supabase CLI ter-link ke project):

```
supabase functions deploy create-user
supabase functions deploy delete-user
```

## Jalan lokal

Tidak ada build step — cukup server statis apa pun:

```
python -m http.server 8000
# atau
npx serve .
```

Buka `http://localhost:8000`. `localhost:8000`/`127.0.0.1:8000` sudah
termasuk di `ALLOWED_ORIGINS` kedua Edge Function, jadi panel Admin bisa
langsung dites dari lokal.

## Deploy & CORS

Aplikasi ini live di **dua** domain sekaligus:

- GitHub Pages: `https://divaadam96-cmd.github.io/nihon-go-benkyo/`
- Vercel: `https://nihon-go-benkyo-web.vercel.app/`

Kedua domain ini terdaftar di `ALLOWED_ORIGINS` pada
`supabase/functions/create-user/index.ts` dan `delete-user/index.ts`.
**Kalau menambah domain produksi baru (custom domain, dsb.), domain itu
wajib ditambahkan ke `ALLOWED_ORIGINS` di kedua file itu, lalu kedua Edge
Function di-redeploy** — kalau tidak, panel Admin akan gagal karena
diblokir CORS saat diakses dari domain baru tersebut.

## Konvensi cache-busting

File statis dimuat dengan query string versi (`app.js?build=66`,
`srs.js?v=3`, dst.) dan didaftarkan juga di `sw.js` (`ASSETS` +
`CACHE_NAME`). **Setiap kali sebuah file diubah, naikkan angka versinya
di SEMUA tempat ia dirujuk** (tag `<script>`/`<link>` di `index.html`
atau `prototype-*.html`, referensi iframe di `app.js`, dan entri di
`sw.js`), lalu naikkan juga `CACHE_NAME` di `sw.js` — kalau tidak,
pengguna yang sudah meng-install PWA bisa tetap memakai versi lama dari
cache.

## Testing

Belum ada automated test. Sebelum deploy perubahan yang menyentuh alur
inti, jalankan `QA_CHECKLIST.md` secara manual. Alasan belum pakai
automated e2e (mis. Playwright) dan rencana upgradenya dijelaskan di
bagian akhir checklist tersebut — singkatnya: database yang dipakai
adalah database produksi dengan siswa sungguhan, jadi test otomatis
butuh isolasi (project/akun test terpisah) sebelum aman dijalankan
rutin.
