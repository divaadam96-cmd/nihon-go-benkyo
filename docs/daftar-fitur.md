# Daftar Fitur

Dokumen ini menjadi peta fitur Nihon GO Benkyo setelah aplikasi diubah menjadi
situs multi-halaman. Untuk hubungan teknis antar-file, lihat
[Struktur Aplikasi](struktur-aplikasi.md). Untuk aturan visual, lihat
[Panduan Desain](desain.md).

## Peran pengguna

| Fitur | Siswa | Sensei | Operator |
|---|:---:|:---:|:---:|
| Dashboard dan fitur belajar | Ya | Ya | Ya |
| Melihat tugas dari Sensei | Ya | Tidak | Tidak |
| Pantau progres siswa | Tidak | Ya | Ya |
| Memberi/menghapus tugas dan akses tes | Tidak | Ya | Ya |
| Reset progres siswa | Tidak | Ya | Ya |
| Membuat dan menghapus akun | Tidak | Tidak | Ya |

Penyembunyian menu berdasarkan peran dilakukan oleh `js/auth.js`, sedangkan
Row Level Security Supabase tetap menjadi pengaman data di sisi server.

## Login dan akun

- Login memakai Supabase Auth.
- Operator dapat masuk dengan email asli.
- Sensei dan Siswa dapat memakai ID login yang dipetakan aplikasi ke alamat
  internal.
- Header menampilkan nama, peran, XP, tombol instalasi PWA, dan tombol keluar.
- Sesi yang masih aktif dipulihkan saat halaman dibuka kembali.

## Beranda / Dashboard

Lokasi: `index.html` dan `js/pages/dashboard.js`.

- Ringkasan aktivitas hari ini, total XP, target JLPT, dan jumlah Kanji.
- “Rencana hari ini” untuk Hafalan, Materi, Kanji, dan Tes.
- Tugas dari Sensei untuk akun Siswa.
- Pengingat belajar dan permintaan izin notifikasi browser.
- Grafik aktivitas enam minggu terakhir.
- Ringkasan progres materi Buku 1 dan Buku 2.
- Navigasi cepat menuju seluruh halaman belajar.

## Materi

Lokasi: `pages/materi.html` dan `js/pages/materi.js`.

- Pilihan Buku 1 (pelajaran 1–25) dan Buku 2 (pelajaran 26–50).
- Daftar pelajaran terpisah dari pembaca materi.
- Pembaca berisi pola, penjelasan, contoh, serta latihan.
- Tahap belajar: pahami pola, pelajari contoh, dan kerjakan latihan.
- Furigana dapat dinyalakan atau dimatikan.
- Mode fokus untuk membaca tanpa gangguan.
- Tombol pelajaran sebelumnya/berikutnya dan kembali ke daftar.
- Status “Sudah paham”, “Perlu diulang”, rekomendasi berikutnya, dan ringkasan
  progres per buku.
- Penyimpanan daftar kesalahan untuk latihan materi.

## Hafalan

Lokasi: `pages/hafalan.html` dan `js/pages/hafalan.js`.

- Flashcard kosakata dan Kanji berdasarkan Bab.
- Kartu dapat dibalik dengan klik atau keyboard.
- Tombol “Belum ingat” dan “Sudah paham” terhubung ke progres SRS.
- Penghitung penguasaan sesi.
- Materi Hiragana dan Katakana: huruf dasar, dakuten/handakuten, yoon, contoh
  bacaan, serta panduan urutan goresan.

## Belajar Kanji

Lokasi: `pages/kanji.html` dan `js/pages/kanji.js`.

- Pencarian berdasarkan Kanji, arti, onyomi, dan kunyomi.
- Filter tingkat JLPT.
- Detail arti, bacaan, dan kosakata terkait.
- Animasi urutan goresan dan kontrol sebelumnya/berikutnya.
- Kanvas latihan menulis dengan contoh transparan dan tombol hapus.
- Audio karakter/kosakata melalui kemampuan suara browser.
- Latihan pemahaman adaptif.
- Penilaian SRS untuk mengatur jadwal pengulangan.

## Tes Kemampuan

Lokasi: `pages/latihan.html` dan `js/pages/latihan.js`.

- Pilihan simulasi JLPT atau JFT dan paket soal yang tersedia.
- Pengaturan tingkat, cakupan, serta jenis soal.
- Timer, navigasi nomor soal, penanda soal, dan progres pengerjaan.
- Penyelesaian otomatis ketika waktu habis.
- Nilai akhir, akurasi per kategori, dan rekomendasi belajar.
- Bank jawaban salah untuk ditinjau kembali.
- Hasil disimpan ke Supabase dan ikut dihitung sebagai XP.
- Akses tes tertentu dapat diberikan Sensei/Operator melalui tugas.

## Pantau Siswa

Lokasi: `pages/pantau.html` dan `js/pages/pantau.js`.

Tersedia untuk Sensei dan Operator:

- daftar Siswa beserta streak, item jatuh tempo, dan XP;
- detail progres Kanji, Materi, Hafalan, dan riwayat Tes;
- indikator bagian yang perlu perhatian;
- pemberian serta penghapusan tugas;
- pemberian akses ke Tes Kemampuan dengan batas waktu;
- reset progres SRS seorang Siswa setelah konfirmasi.

## Panel Admin

Lokasi: `pages/admin.html` dan `js/pages/admin.js`.

Tersedia hanya untuk Operator:

- membuat akun Siswa atau Sensei;
- menentukan ID login, nama, peran, dan password awal;
- melihat daftar akun;
- menghapus akun non-Operator melalui Supabase Edge Function.

## Progres, SRS, dan XP

`js/srs.js` menyimpan progres lokal dan menyinkronkannya ke Supabase ketika sesi
pengguna tersedia. Kunci `localStorage` yang menjadi kontrak data dan tidak
boleh diganti sembarangan:

| Kunci | Isi |
|---|---|
| `nihonBenkyoSRS_v1` | status box, jadwal, dan hasil review tiap item |
| `nihonBenkyoActivityLog_v1` | jumlah review per tanggal |
| `nihonBenkyoProgress` | ringkasan penguasaan Hafalan |
| `nihonBenkyoLessonStatusV1` | status materi Buku 1 |
| `nihonBenkyoLessonStatusV2` | status materi Buku 2 |
| `nihonBenkyoCurriculumSummaryV1` | ringkasan materi untuk Dashboard |
| `sidebarCollapsed` | keadaan sidebar desktop |

Materi juga membentuk kunci daftar kesalahan dari kunci status bukunya. Jangan
menghapus atau mengganti nama kunci di atas tanpa migrasi data, karena progres
pengguna yang tersimpan di browser dapat hilang.

XP berasal dari aktivitas review SRS dan hasil Tes. Ringkasan XP di shell dibaca
ulang pada setiap halaman agar tetap konsisten ketika pengguna berpindah menu.

## PWA dan penggunaan offline

- Aplikasi dapat dipasang dari browser yang mendukung PWA.
- Manifest menyediakan ikon dan shortcut ke halaman belajar.
- Service worker menyimpan shell, halaman, data, dan aset penting.
- Halaman yang sudah tersedia di cache dapat dibuka kembali ketika koneksi
  terputus.
- Setiap perubahan aset statis perlu diikuti pembaruan versi referensi dan nama
  cache sesuai konvensi di `README.md`.

## Batas pengujian saat ini

Belum ada automated end-to-end test. Pengujian akun, perubahan data, RLS,
Edge Function, dan dua domain production tetap mengikuti `QA_CHECKLIST.md` dan
harus memakai akun/data test yang terisolasi agar data siswa asli tidak berubah.
