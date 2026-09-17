# Struktur Aplikasi

Dokumen ini menjelaskan **bagaimana bagian-bagian aplikasi saling
terhubung** — untuk gambaran ringkas isi tiap folder, lihat
[README](../README.md#struktur-project). Ditulis untuk pemula yang belum
familiar dengan kode ini.

## Gambaran besar: 7 halaman, 1 "shell" bersama

Aplikasi ini adalah **situs multi-halaman** (bukan single-page app) — tiap
menu (Materi, Hafalan, Kanji, dst.) adalah file `.html` sungguhan, bukan
bagian yang disembunyikan/ditampilkan di satu dokumen. Ada 7 halaman:

| Halaman | Berkas | Isinya |
|---|---|---|
| Beranda | `index.html` | Dashboard: XP, "Rencana hari ini", grafik aktivitas |
| Materi | `pages/materi.html` | Daftar pelajaran Buku 1/2 + pembaca |
| Hafalan | `pages/hafalan.html` | Flashcard per Bab + materi Hiragana/Katakana |
| Kanji | `pages/kanji.html` | Grid kanji, papan goresan, latihan menulis, kuis |
| Tes Kemampuan | `pages/latihan.html` | Simulasi ujian JLPT/JFT |
| Pantau Siswa | `pages/pantau.html` | Khusus Sensei/Operator |
| Panel Admin | `pages/admin.html` | Khusus Operator |

Login, header (logo + XP + info akun), dan sidebar (ikon menu) terlihat
**identik** di ke-7 halaman itu. Supaya tidak perlu menyalin HTML yang
sama ke 7 file berbeda (dan berisiko satu file lupa diperbarui saat
sidebar diubah nanti), bagian itu dibangun oleh **satu file JavaScript**:
`js/app-shell.js`.

## Bagaimana satu halaman "hidup", langkah demi langkah

Ambil contoh membuka `pages/materi.html`:

1. Browser memuat `materi.html`. Isinya sengaja sangat minim — cuma
   `<main class="main" id="pageMain">` kosong berisi placeholder konten,
   lalu deretan tag `<script>`.
2. Script pertama yang benar-benar membangun tampilan adalah
   **`js/app-shell.js`**. Ia menyisipkan HTML login-screen + header +
   sidebar ke `<body>`, lalu memindahkan `#pageMain` ke dalam struktur
   itu. Di titik ini halaman terlihat "lengkap" (ada header/sidebar),
   tapi seluruhnya masih tersembunyi oleh gerbang login (CSS
   `body:not(.authed) .app{display:none}`).
3. **`js/app-sidebar.js`** dipanggil oleh `app-shell.js` untuk memasang
   perilaku sidebar (buka/tutup, tooltip saat mode ringkas).
4. **`js/auth.js`** memeriksa sesi Supabase. Kalau belum login, form
   login yang tampil (dari langkah 2) yang aktif menunggu input.
5. Begitu login berhasil, `auth.js` menambahkan class `authed` (barulah
   `.app` benar-benar terlihat), lalu memanggil **`window.initPage()`**.
6. `initPage()` didefinisikan oleh file JS **khusus halaman itu** —
   untuk `materi.html`, itu adalah `js/pages/materi.js`. Fungsi inilah
   yang benar-benar mengisi konten (daftar pelajaran, dst). Khusus
   `materi.js`: teks pelajaran (grammar Pelajaran 1-50) sendiri ada di
   `data/materi-grammar-data.js` (dipasang lewat satu pemanggilan
   `installMateriGrammarContent()` di awal `initPage()`) — kalau mau
   edit teks pelajaran, di situ tempatnya, bukan di `materi.js`.

Pola `initPage()` ini SAMA untuk ketujuh halaman — kalau ingin tahu apa
yang terjadi saat sebuah halaman dibuka, cari `function initPage()` di
file `js/pages/<nama-halaman>.js`-nya.

## Berpindah antar-halaman

Klik ikon di sidebar tidak menyembunyikan/menampilkan bagian dokumen
(seperti SPA pada umumnya) — ia **memuat halaman lain sepenuhnya**, lewat
satu fungsi `open(view)` yang didefinisikan di `js/app-shell.js`:

```js
const PAGE_FOR_VIEW = {
  materials: "pages/materi.html",
  memorization: "pages/hafalan.html",
  "kanji-study": "pages/kanji.html",
  test: "pages/latihan.html",
  monitor: "pages/pantau.html",
  admin: "pages/admin.html",
};
```

`open("materials")` akan mengalihkan browser (`location.href`) ke
`pages/materi.html`. Satu-satunya "view" yang bukan alih-halaman adalah
`"dashboard"` — itu berarti "kembali ke `index.html`".

Kalau kelak menambah halaman baru, tambahkan satu baris di
`PAGE_FOR_VIEW` (dan satu baris lagi di peta `CURRENT_PAGE_VIEW` di
bagian bawah `app-shell.js`, supaya sidebar tahu ikon mana yang harus
ditandai aktif) — tidak perlu menyentuh 7 halaman lainnya.

## Data yang dibagi lintas halaman (tanpa server)

Karena tiap halaman adalah dokumen terpisah, variabel JavaScript **tidak**
otomatis "ingat" dari satu halaman ke halaman lain. Nilai yang perlu
bertahan (XP, progres SRS, dsb.) disimpan di `localStorage` browser
(dan disinkronkan ke Supabase oleh `srs.js`), lalu **dibaca ulang** oleh
halaman berikutnya saat dibuka:

- **XP & status "Rencana hari ini" di header/sidebar** — dihitung dari
  data SRS asli (`srs.js`) oleh `window.refreshShellXp()`
  (`js/app-shell.js`), dipanggil di semua halaman.
- **Progres Buku 1/2 di Dashboard** — `pages/materi.html` menghitungnya
  (dari kontennya sendiri) lalu menyimpan hasilnya ke
  `localStorage["nihonBenkyoCurriculumSummaryV1"]`. Dashboard
  (`js/pages/dashboard.js`) hanya membaca cache itu — ia tidak bisa
  menghitung ulang karena tidak punya akses ke konten materi.

Pola ini ("halaman A menghitung & menyimpan, halaman B cuma membaca") ada
di beberapa tempat. Kalau suatu angka di Dashboard terasa "telat"
update, biasanya karena halaman sumbernya belum sempat menuliskan ulang
ke `localStorage`.

## Bagian yang SENGAJA duplikat kecil-kecil

Beberapa fungsi kecil (murni utilitas, tidak berhubungan dengan tampilan)
disalin ke lebih dari satu file, alih-alih dibuat satu file bersama,
karena hanya dipakai 1–2 halaman:

- `displayLoginId()` — disalin di `js/pages/admin.js` dan
  `js/pages/pantau.js` (cuma dipakai 2 halaman khusus Sensei/Operator).
- `escapeHtmlTes()` di `js/pages/latihan.js` — mandiri, tidak memakai
  `window.escapeHtml` bersama.

Sebaliknya, `window.escapeHtml` (dipakai Dashboard, Pantau Siswa, DAN
Panel Admin) didefinisikan sekali di `js/app-shell.js` karena dipakai 3+
halaman berbeda. Aturan praktisnya: **kalau dipakai ≥3 halaman, jadikan
fungsi bersama; kalau cuma 1–2, boleh disalin** supaya halaman lain tidak
perlu memuat file yang tidak relevan baginya.

## Kode yang sengaja TIDAK dipindah (dan kenapa)

Saat restrukturisasi ini dikerjakan, ditemukan ada kode lama (dulu di
satu file `app.js` raksasa) yang ternyata **tidak pernah benar-benar
tampil** ke pengguna — dibangun oleh JavaScript, lalu ditimpa oleh kode
lain sebelum sempat dilihat siapa pun (mis. versi awal fitur Kanji yang
sudah digantikan versi iframe, lalu digantikan lagi jadi halaman asli).
Kode semacam ini **tidak dibawa** ke struktur baru, sudah diverifikasi
menyeluruh (bukan cuma diasumsikan) tidak tercapai lagi.

## Berkas HTML tiap halaman: cuma kerangka

Bandingkan `pages/materi.html` dengan HTML materi yang muncul di layar —
jauh lebih sederhana. Ini disengaja: HTML statis di tiap `pages/*.html`
cuma berisi `<main id="pageMain">` kosong/minim + daftar `<script>`.
**Seluruh konten dibangun oleh JavaScript saat halaman dibuka** (lewat
`initPage()`, lihat di atas). Kalau mencari teks/tombol tertentu dan
tidak ketemu di file `.html`-nya, cek file `.js` halaman itu di
`js/pages/`.
