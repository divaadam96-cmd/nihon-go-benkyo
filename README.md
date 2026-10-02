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
adalah `@supabase/supabase-js` (versi dipatok, mis. `@2.117.2`) yang dimuat
lewat CDN jsdelivr tepat sebelum `js/auth.js`. Semua `<script>` di halaman
memakai `defer` (urutan eksekusi tetap sesuai urutan tag).

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
  kelola-soal.html         panel Operator: editor soal Tes Kemampuan

css/
  base.css                 variabel warna (:root), @font-face DM Sans
                           (self-host), reset dasar, [hidden] - dimuat
                           PERTAMA di index.html & semua pages/*.html
  shell.css                header/sidebar/nav + kartu/tombol dasar dipakai
                           semua halaman (lihat catatan di bawah)
  auth.css                 layar login + account-box, dimuat semua halaman
  pages/dashboard.css      gaya konten khusus Beranda (index.html)
  pages/materi.css         gaya konten khusus halaman Materi
  pages/hafalan.css        gaya konten khusus halaman Hafalan (flashcard)
  pages/kanji.css          gaya konten khusus halaman Kanji
  pages/latihan.css        gaya konten khusus halaman Tes Kemampuan
  pages/pantau.css         gaya panel ringkasan progres Pantau Siswa
  pages/admin.css          gaya konten khusus Panel Admin

js/
  app-shell.js             login-screen + header + sidebar + mobile-nav -
                           dibangun SEKALI di sini, dipakai sama persis di
                           SEMUA halaman (lihat docs/struktur-aplikasi.md).
                           Pengecualian: index.html menulis layar login yang
                           sama secara statis (supaya tampil tanpa menunggu
                           JS) - ubah markup login? samakan di keduanya
  app-sidebar.js           interaksi sidebar (toggle rail/drawer, tooltip)
  app-effects.js           efek visual (sakura) & bantuan tampilan materi
  auth.js                  login Supabase, sinkronisasi profil/peran,
                           memanggil initPage() tiap halaman setelah login
  srs.js                   mesin spaced-repetition bersama + sync Supabase
  quiz-results.js          cache + perhitungan XP dari riwayat quiz_results
  assignments.js           kartu "Tugas dari Sensei" + pengingat harian
  pwa.js                   install prompt (service worker didaftarkan di sini,
                           setelah event load)
  pages/                   1 file JS per halaman di atas (dashboard.js,
                           materi.js, hafalan.js, kanji.js, latihan.js,
                           pantau.js, admin.js) - isinya dibungkus
                           initPage(), dipanggil auth.js setelah login

data/                     dataset murni (tanpa kode render), dimuat halaman
                          yang perlu saja:
  bab-data.js             kosakata & kanji per Bab 1-50 (Hafalan, Latihan)
  kana-data.js            tabel hiragana/katakana + jalur goresan (Hafalan)
  kanji-data.js           daftar kanji per pelajaran (Kanji)
  kanji-stroke-data.js    jalur goresan kanji (Kanji)
  materi-grammar-data.js  Keterangan Tata Bahasa Pelajaran 1-50 (Materi)
assets/
  icons/                  ikon PWA
  images/                 logo & gambar latar
  fonts/                  DM Sans woff2 self-host (OFL) - nama file
                          berversi, di-cache immutable (vercel.json)

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

### Kenapa CSS dipecah jadi `base.css` + `shell.css` + `auth.css` + `pages/*.css`?

Sebelumnya seluruh CSS ada di 4 file `legacy-part-1..4.css` hasil
pemecahan BERURUTAN dari satu `styles.css` lama (3671 baris) — dipecah
persis berurutan, bukan per-topik, karena beberapa selector yang sama
(`.card`, `.top`, `.main`, dst) sengaja didefinisikan ulang lebih jauh
di bawah untuk menimpa definisi sebelumnya, dan waktu itu belum
dipastikan aman memecahnya tanpa mengubah urutan override tersebut.

Reorganisasi berikutnya menelusuri SETIAP selector yang didefinisikan
ulang (termasuk `.main` yang override-nya berlapis 4× untuk overlay
background) untuk memastikan urutan efektifnya tidak berubah, lalu
memindahkannya ke file per-fungsi: `base.css` (variabel + reset,
dimuat pertama), `shell.css` (header/sidebar/nav + komponen dasar
dipakai semua halaman, termasuk override reponsive-nya), `auth.css`
(layar login, tampil di semua halaman), dan `css/pages/<nama>.css`
per halaman (dimuat terakhir, cuma di halaman yang butuh). Sudah diuji
visual di ke-7 halaman (screenshot sebelum/sesudah identik) dan cek
jaringan (semua aset 200, tanpa 404). Kode yang ternyata sudah tidak
dipakai (dicek lewat grep) TIDAK dihapus dalam pemindahan ini — cuma
ditandai jelas dengan komentar di akhir `shell.css`, supaya
reorganisasi ini murni pemindahan, bukan pembersihan.

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
maupun di `APP_FILES` pada `sw.js`. Satu-satunya sumber kebenaran versi
adalah **`CACHE_NAME` di awal `sw.js`**. Saat `install`, service worker
mengambil semua file di `APP_FILES` dengan `{cache: 'no-cache'}`
(revalidasi ke server - file yang tidak berubah cukup dijawab 304), jadi
tidak perlu query string per file.

**Setiap kali ada file di `APP_FILES` yang isinya diubah, naikkan
`CACHE_NAME` di `sw.js` (satu tempat saja)** — kalau tidak, pengguna
yang sudah meng-install PWA bisa tetap memakai versi lama dari cache.
Kalau menambah file HTML/CSS/JS/data baru, tambahkan juga path-nya ke
`APP_FILES`.

Gambar di `assets/images/` (gambar soal, ilustrasi materi) dan aset CDN
**tidak** di-precache: di-cache saat pertama dipakai ke cache runtime
yang tidak ikut dibersihkan saat versi naik. Karena itu **gambar yang
isinya diganti wajib diberi nama file baru**. Rekaman audio
(`assets/audio/`) selalu langsung dari network.

## Keamanan

- **Header** (CSP, X-Frame-Options, nosniff, Referrer-Policy,
  Permissions-Policy) diatur di `vercel.json`. CSP mengizinkan skrip
  inline `index.html` lewat hash-nya - **kalau isi `<script>` inline di
  `index.html` diubah, hash `sha256-…` di `vercel.json` wajib dihitung
  ulang** (file itu dikunci ke LF lewat `.gitattributes` supaya hash
  stabil). Domain eksternal baru (CDN, API) juga harus ditambahkan ke CSP.
- **supabase-js** dimuat dengan atribut `integrity` (SRI) - kalau versi
  di URL dinaikkan, hash `sha384-…` di kedelapan file HTML ikut diganti.
- **Tes Kemampuan dinilai di server.** Soal + kunci jawaban ada di
  database (`quiz_questions` per-5-Bab, `package_questions` paket
  ujian); browser hanya menerima soal tanpa kunci lewat
  `get_test_questions()`, lalu `grade_test()` yang menilai, menyimpan
  `quiz_results`, dan menandai akses tes selesai. Siswa tidak bisa
  menulis `quiz_results` langsung. Lihat
  `supabase/secure-test-grading.sql`.
- **Akun Operator wajib verifikasi dua langkah (MFA/TOTP).** Setelah
  password, Operator memasukkan kode 6 digit dari aplikasi authenticator
  (pendaftaran pertama lewat QR code di layar login - `js/auth.js`).
  Penegakannya di database: `current_user_role()` hanya mengakui peran
  operator kalau token login sudah `aal2`
  (`supabase/fix-1-operator-mfa.sql`); Edge Function `create-user` /
  `delete-user` memeriksa hal yang sama. Operator kehilangan HP: pemilik
  proyek Supabase menghapus faktornya lewat SQL Editor (perintahnya ada di
  komentar file SQL tersebut), lalu Operator mendaftar ulang.
- **Batas waktu tes dijaga server** (`supabase/fix-2-batas-waktu-server.sql`).
  `start_test()` mencatat jam mulai & tenggat saat soal dibuka (tabel
  `test_attempts`, satu percobaan per akses tes); soal hanya bisa diambil
  selama percobaan berjalan; jawaban disimpan ke server setiap dipilih
  (`save_test_answers`) dan ditolak setelah tenggat (+30 detik kelonggaran).
  Reload/tutup tab tidak mengulang timer - siswa otomatis melanjutkan tes
  yang sama. Tes yang ditinggal sampai waktu habis ditutup & dinilai dari
  jawaban tersimpan saat siswa membuka dashboard/Tes Kemampuan atau Sensei
  membuka Pantau Siswa (ditandai "⏱ Waktu habis").
- **Riwayat & versi soal** (`supabase/fix-6-riwayat-perubahan-soal.sql`).
  Trigger mencatat setiap perubahan `quiz_questions`, `package_questions`,
  dan `test_packages` ke `content_audit_log` (siapa, kapan, isi sebelum &
  sesudah; hanya Operator yang bisa membaca, tidak bisa diubah/dihapus).
  Isi soal disimpan ke `content_versions` sebelum diterbitkan/dipulihkan;
  `list_content_versions()` & `restore_test_content()` untuk Operator.
  Penerbitan/pemulihan ditolak saat ada siswa yang sedang mengerjakan tes
  itu (jawaban disimpan per id soal). Cek peran di SQL wajib memakai
  `coalesce(...)` / `require_operator()` - `NULL <> 'operator'` bukan true,
  jadi pemanggil tanpa login lolos dari pengecekan `<>` biasa.
- **Hasil tes: skor + pembahasan soal yang salah saja**
  (`supabase/fix-4-pembahasan-soal-salah.sql`). Untuk soal yang dijawab
  benar, `grade_test()` tidak mengirim kunci & pembahasan ke siswa
  (Sensei/Operator tetap menerima lengkap). Siswa yang sengaja mencatat
  jawabannya tetap bisa menyusun kunci - untuk ujian penting, beri paket
  berbeda ke siswa berbeda.
- **XP, streak, dan progres hafalan dihitung server**
  (`supabase/fix-3-xp-streak-server.sql`). Siswa hanya bisa membaca
  `srs_progress`/`activity_log`; setiap ulasan lewat `srs_review()` yang
  menghitung kotak SRS, jadwal, dan XP memakai tanggal server. Kotak hanya
  naik kalau item sudah jatuh tempo; satu item dihitung XP sekali per hari,
  maksimal 300 ulasan XP per hari (`srs_daily_review_cap()`, sama dengan
  `SRS_DAILY_REVIEW_CAP` di `js/srs.js`). Format id item yang valid
  dibatasi di fungsi itu - id item baru harus ditambahkan ke regex-nya.
- **Password minimal 10 karakter, huruf + angka** - dicek di form, di
  Edge Function `create-user`, dan di pengaturan Supabase Auth.
- **Paket ujian dikelola di database, tanpa ubah kode.** Daftar paket
  (label, kode singkat, deskripsi, batas waktu, tampilan satu halaman,
  urutan, aktif) ada di tabel `test_packages`; soalnya di
  `package_questions`. Pantau Siswa dan Tes Kemampuan membacanya lewat
  `list_test_packages()`, jadi paket baru yang sudah punya soal langsung
  bisa ditugaskan Sensei. Menyembunyikan paket: `active = false`.
- **Editor soal untuk Operator: halaman Kelola Soal**
  (`pages/kelola-soal.html`, menu "Kelola Soal"; database:
  `supabase/add-editor-soal.sql`). Mengedit semua soal per-5-Bab dan
  semua paket, membuat paket baru, draft -> terbitkan, dan riwayat versi
  dengan tombol pulihkan. Semua lewat fungsi `editor_*`: draft di
  `content_drafts` (menolak menimpa simpanan Operator lain),
  `editor_publish` memvalidasi ulang SEMUA isi di server
  (`validate_test_content` + `is_safe_question_html` - allowlist tag HTML
  yang sama dengan `js/soal-html.js`), menahan penerbitan saat ada siswa
  yang sedang tes, dan menyimpan versi lama. Operator tidak bisa menulis
  tabel soal/paket langsung. Impor massal lewat SQL Editor tetap bisa
  (contoh: `supabase/contoh-tambah-paket.sql`).

## Testing

Belum ada automated test. Sebelum deploy perubahan yang menyentuh alur
inti, jalankan `QA_CHECKLIST.md` secara manual. Alasan belum pakai
automated e2e (mis. Playwright) dan rencana upgradenya dijelaskan di
bagian akhir checklist tersebut — singkatnya: database yang dipakai
adalah database produksi dengan siswa sungguhan, jadi test otomatis
butuh isolasi (project/akun test terpisah) sebelum aman dijalankan
rutin.
