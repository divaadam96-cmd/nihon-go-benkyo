# Nihon GO Benkyo

Aplikasi belajar bahasa Jepang (materi, flashcard/hafalan dengan spaced
repetition, belajar kanji, simulasi tes JLPT/JFT) dengan sistem login 3
peran: **Operator** (kelola akun), **Sensei** (beri tugas & pantau
progres), **Siswa** (belajar).

Dokumentasi lebih detail ada di folder [`docs/`](docs/):
[struktur aplikasi](docs/struktur-aplikasi.md),
[desain](docs/desain.md), dan
[daftar fitur](docs/daftar-fitur.md).

## Teknologi

- **Frontend**: HTML/CSS/JavaScript vanilla, tanpa framework atau build
  step. Setiap halaman (`index.html`, `pages/*.html`) memuat file
  `<script>`/`<link>`-nya sendiri secara langsung.
- **Backend**: [Supabase](https://supabase.com) — Auth (email+password),
  Postgres dengan Row Level Security, dan 2 Edge Function (Deno) untuk
  operasi yang butuh hak admin (buat/hapus akun).
- **PWA**: service worker (`sw.js`) + manifest, installable dan bisa
  dipakai offline untuk aset yang sudah pernah dimuat.

Tidak ada `package.json`/npm dependency — satu-satunya library eksternal
adalah `@supabase/supabase-js@2` yang dimuat lewat CDN jsdelivr.

## Struktur project

```
index.html              Beranda/Dashboard (juga "pintu masuk" - lihat di bawah)
pages/                   halaman lain, masing-masing dokumen HTML sendiri
  materi.html              daftar + pembaca materi (Buku 1 & 2, mode fokus)
  hafalan.html             flashcard per Bab + materi Hiragana/Katakana
  kanji.html               belajar Kanji (grid, papan goresan, kuis)
  latihan.html             simulasi Tes Kemampuan (JLPT/JFT)
  pantau.html              panel Sensei/Operator: pantau progres siswa
  admin.html               panel Operator: kelola akun

css/
  legacy-part-1..4.css     gaya seluruh aplikasi, dipecah BERURUTAN dari
                           satu styles.css lama (lihat catatan di bawah) -
                           dimuat di index.html & semua pages/*.html
  pages/kanji.css          gaya konten khusus halaman Kanji
  pages/latihan.css        gaya konten khusus halaman Tes Kemampuan
  pages/pantau.css         gaya panel ringkasan progres Pantau Siswa

js/
  app-shell.js             login-screen + header + sidebar + mobile-nav -
                           dibangun SEKALI di sini, dipakai sama persis di
                           SEMUA halaman (lihat docs/struktur-aplikasi.md)
  app-sidebar.js           interaksi sidebar (toggle rail/drawer, tooltip)
  app-effects.js           efek visual (sakura) & bantuan tampilan materi
  auth.js                  login Supabase, sinkronisasi profil/peran,
                           memanggil initPage() tiap halaman setelah login
  srs.js                   mesin spaced-repetition bersama + sync Supabase
  quiz-results.js          cache + perhitungan XP dari riwayat quiz_results
  assignments.js           kartu "Tugas dari Sensei" + pengingat harian
  pwa.js                   install prompt (service worker didaftarkan di sini)
  pages/                   1 file JS per halaman di atas (dashboard.js,
                           materi.js, hafalan.js, kanji.js, latihan.js,
                           pantau.js, admin.js) - isinya dibungkus
                           initPage(), dipanggil auth.js setelah login

data/*.js                dataset murni (kanji, kana, materi per-bab, bab
                          kosakata/kanji) - dimuat halaman yang perlu saja
assets/
  icons/                  ikon PWA
  images/                 logo & gambar latar

sw.js                     service worker (WAJIB tetap di root - lihat di bawah)
nihon-go-benkyo.webmanifest  manifest PWA
supabase/                  schema.sql + migrasi tambahan + 2 Edge Function
QA_CHECKLIST.md            checklist QA manual untuk alur kritis
```

### Kenapa `index.html` tetap di root, bukan `pages/dashboard.html`?

`index.html` adalah Beranda/Dashboard sekaligus **halaman default** yang
dibuka browser saat mengunjungi domain aplikasi ini (`/`) atau lewat
shortcut PWA. Service worker (`sw.js`) juga wajib berada di root folder
supaya cache-nya berlaku untuk seluruh situs, bukan cuma folder `pages/`.

### `css/legacy-part-1..4.css` — kenapa dipecah "berurutan", bukan per-tema?

`styles.css` lama (3671 baris) ternyata **tidak bisa** dipecah bebas
menurut jenisnya (variabel/komponen/responsive) — beberapa selector yang
sama (`.card`, `.top`, dst) sengaja didefinisikan ulang lebih jauh di
bawah untuk menimpa definisi sebelumnya (dikomentari eksplisit di file
aslinya, mis. "timpa warna terang di atas"). Kalau dipecah menurut jenis
dan urutan pemuatannya berubah, tampilan bisa diam-diam berubah. Karena
itu file ini dipecah **persis berurutan** (isi ke-4 file kalau digabung
lagi = identik byte-demi-byte dengan `styles.css` asli) — aman dari
risiko itu, tapi belum rapi per-topik. Pemecahan yang lebih rapi per
halaman bisa dikerjakan bertahap nanti, dengan uji visual per langkah.

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

File statis dimuat tanpa query string versi — URL-nya apa adanya
(`dashboard.js`, `srs.js`, dst.) baik di `index.html`/`pages/*.html`
maupun di `ASSETS` pada `sw.js`. Satu-satunya sumber kebenaran versi
adalah **`CACHE_NAME` di baris pertama `sw.js`**. Saat `install`,
service worker mengambil semua file di `ASSETS` dengan `{cache:
'reload'}` (bypass HTTP cache browser, langsung ke network), jadi
tidak perlu query string per file lagi.

**Setiap kali ada file di `ASSETS` yang isinya diubah, naikkan
`CACHE_NAME` di `sw.js` (satu tempat saja)** — kalau tidak, pengguna
yang sudah meng-install PWA bisa tetap memakai versi lama dari cache.
Kalau menambah file baru yang perlu bisa diakses offline, tambahkan
juga path-nya ke `ASSETS`.

## Testing

Belum ada automated test. Sebelum deploy perubahan yang menyentuh alur
inti, jalankan `QA_CHECKLIST.md` secara manual. Alasan belum pakai
automated e2e (mis. Playwright) dan rencana upgradenya dijelaskan di
bagian akhir checklist tersebut — singkatnya: database yang dipakai
adalah database produksi dengan siswa sungguhan, jadi test otomatis
butuh isolasi (project/akun test terpisah) sebelum aman dijalankan
rutin.
