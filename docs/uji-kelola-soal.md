# Uji Kelola Soal

Langkah menguji editor soal Tes Kemampuan untuk Operator (halaman
**Kelola Soal**, `pages/kelola-soal.html`) di production
(`https://www.nihongobenkyo.my.id`).

- **Waktu:** 15–20 menit
- **Wajib:** bagian A–F · **Opsional:** bagian G, H
- **Versi website saat panduan ini dibuat:** v232
- Versi interaktif (tombol Lolos/Gagal + lembar hasil otomatis):
  <https://claude.ai/artifact/PzU8Jn47aRTj2g5Rz4LUbs> (privat, bagikan lewat
  menu Share kalau dipakai Operator lain)

## Persiapan

1. **HP** dengan aplikasi authenticator (Google/Microsoft Authenticator) yang
   sudah terdaftar untuk akun Operator.
2. **Satu akun siswa uji** untuk bagian F. Kalau belum ada, buat di **Panel
   Admin** (ikon 管), mis. ID `siswa.uji`, password `contoh12345`.
3. **Dua jendela browser**: jendela biasa untuk **Operator**, jendela
   **incognito/private** (`Ctrl+Shift+N` di Chrome/Edge) untuk **siswa uji**.
4. Buka `https://www.nihongobenkyo.my.id`. Kalau tampilan masih versi lama,
   tekan `Ctrl+F5` sekali.

## A. Membuka halaman Kelola Soal

1. Login sebagai **Operator**: email + password, lalu **kode 6 digit** dari HP.
2. Di sidebar kiri, klik ikon **題** (tooltip: **Kelola Soal**).

**Yang harus terlihat**

- Judul **Kelola Soal.**
- Panel **Daftar tes**:
  - **Per 5 Bab**: Bab 1–5 sampai Bab 46–50 (10 item, masing-masing
    "40 soal terbit").
  - **Paket ujian**: Set 03 (35 soal), JLPT N5 A–F (67 soal), JLPT N4 A–B
    (75 soal).
- Di kanan: *"Pilih tes di sebelah kiri untuk mulai mengedit."*

**Kalau gagal:** menu 題 tidak ada atau halaman kosong → pastikan Anda login
sebagai Operator dan sudah memasukkan kode MFA.

## B. Mengedit soal & pratinjau

1. Klik **Bab 1–5**. Terlihat status *"Menampilkan isi yang sedang terbit ·
   40 soal terbit"* dan tab **Soal (40)**.
2. Klik baris **soal nomor 1**. Kartu terbuka: form di kiri, **Pratinjau
   tampilan siswa** di kanan.
3. **Catat atau foto teks asli** di kotak **Teks soal (HTML)** — dipakai di
   bagian E untuk memastikan soal kembali normal.
4. Klik di **akhir** isi kotak itu, lalu ketik: ` <b>UJI EDITOR</b>`

**Yang harus terlihat**

- Pratinjau kanan menampilkan **UJI EDITOR** dengan huruf tebal.
- Di kanan atas muncul **● Belum disimpan**.

## C. Pengaman HTML berbahaya

1. Di kotak **Teks soal (HTML)**, tambahkan: ` <img src=x>`
2. Klik **🚀 Terbitkan**.
3. Hapus lagi `<img src=x>` dari kotak itu, sisakan `<b>UJI EDITOR</b>`.

**Yang harus terlihat**

- Setelah langkah 1: kartu soal bergaris merah, header kartu menampilkan
  **⚠ 1**, pesan merah *"HTML teks soal memakai tag/atribut yang tidak
  diizinkan…"*, dan **tidak ada gambar** di pratinjau.
- Setelah langkah 2: kotak merah *"Perbaiki dulu sebelum diterbitkan:"* berisi
  *"Soal 1: HTML teks soal …"*. Klik tulisan itu → halaman melompat ke soal 1.
  Tidak ada yang terbit.
- Setelah langkah 3: garis merah dan **⚠ 1** hilang.

## D. Simpan draft, lalu terbitkan

1. Klik **💾 Simpan draft** (atau `Ctrl+S`).
2. Tekan `F5` untuk memuat ulang, klik lagi **Bab 1–5**, buka soal 1.
3. Klik **🚀 Terbitkan**, lalu **OK** pada konfirmasi *"Terbitkan 40 soal? …"*

**Yang harus terlihat**

- Setelah langkah 1: kotak hijau *"Draft tersimpan dan siap diterbitkan."*;
  status *"Draft belum terbit · disimpan [nama Anda] …"*; tombol **Buang
  draft** muncul; di Daftar tes, Bab 1–5 berlabel **Draft**.
- Setelah langkah 2: status masih "Draft belum terbit", teks
  `<b>UJI EDITOR</b>` masih ada.
- Setelah langkah 3: kotak hijau *"Berhasil diterbitkan. Versi sebelumnya
  tersimpan di tab Riwayat versi."*; label Draft hilang.

**Perilaku yang benar:** pesan *"Ada N siswa yang sedang mengerjakan tes
ini…"* berarti penerbitan ditahan selama ada siswa yang sedang tes. Tunggu
tesnya selesai, lalu coba lagi.

## E. Riwayat versi & pemulihan

1. Klik tab **Riwayat versi**.
2. Pada baris **paling atas**, klik **Pulihkan**, lalu **OK**.
3. Klik tab **Soal (40)**, buka soal 1.
4. Buka lagi tab **Riwayat versi**.

**Yang harus terlihat**

- Langkah 1: minimal satu baris bertanggal hari ini, *"#N · Sebelum
  diterbitkan dari editor · 40 soal · oleh [nama Anda]"*.
- Langkah 2: kotak hijau *"Versi #N dipulihkan dan sudah terbit."*
- Langkah 3: teks soal **sama persis dengan catatan di bagian B**, tanpa
  "UJI EDITOR".
- Langkah 4: ada baris baru *"Sebelum memulihkan versi #N"* — pemulihan pun
  bisa dibatalkan.

## F. Paket baru sampai dikerjakan siswa

### F1 · Membuat paket (jendela Operator)

1. Di bawah Daftar tes, klik **+ Paket ujian baru**. Isi **Kode paket**
   `uji-coba-01` dan **Nama paket** `Paket Uji Coba`, lalu klik **Buat draft
   paket**.
2. Di tab **Pengaturan paket**: **Kode singkat** `UJI`, **Batas waktu
   (menit)** `10`. Biarkan "Aktif" tercentang dan "satu halaman" tidak
   dicentang.
3. Tab **Soal (1)**, buka soal 1 dan isi:

   | Kolom | Isi |
   |---|---|
   | Kategori | `Kosakata` |
   | Instruksi | `Pilih arti yang tepat.` |
   | Teks soal | `<u>山</u>` |
   | Pilihan | `gunung` · `sungai` · `laut` · `langit`, lalu klik **bulatan di samping "gunung"** |
   | Pembahasan | `山 dibaca やま, artinya gunung.` |
   | Label materi | `Paket Uji · Kosakata` |

4. Klik **⧉** (Duplikat) di header soal 1. Buka soal 2, ubah **Teks soal**
   menjadi `<u>川</u>`, **Pembahasan** `川 dibaca かわ, artinya sungai.`, dan
   klik **bulatan "sungai"**.
5. Klik **🚀 Terbitkan**, lalu **OK**.

### F2 · Memberi akses (jendela Operator)

1. Buka **Pantau Siswa** (ikon 監), klik kartu siswa uji.
2. Pilih **Akses simulasi paket**, pilih **Paket Uji Coba · 2 soal · 10
   menit**, klik **Beri tugas**.

### F3 · Mengerjakan (jendela incognito, siswa uji)

1. Login sebagai siswa uji, buka **Tes Kemampuan** (ikon 試), klik kartu
   **UJI · Simulasi Paket · Paket Uji Coba**.
2. Jawab 山 dengan **benar** ("gunung") dan 川 dengan **salah** (mis. "laut"),
   lalu selesaikan tes.
3. Klik **Tinjau jawaban salah**.

### F4 · Merapikan (jendela Operator)

1. **Kelola Soal** → **Paket Uji Coba** → tab **Pengaturan paket**. Hapus
   centang **Aktif**, lalu **🚀 Terbitkan** → **OK**.

**Yang harus terlihat**

- F1: di soal yang lengkap tidak ada pesan merah; pratinjau menandai "gunung"
  hijau dengan ✓; setelah terbit muncul **Paket Uji Coba · 2 soal terbit** di
  Daftar tes.
- F2: dropdown akses berisi **Paket Uji Coba · 2 soal · 10 menit**.
- F3: kartu akses menunjukkan batas waktu 10 menit; timer mulai **10:00**;
  skor **50**; tinjauan hanya memuat soal 川 dengan jawaban benar "sungai" dan
  pembahasannya — soal 山 tidak muncul.
- F4: paket berlabel **Nonaktif** di Daftar tes dan tidak lagi muncul di
  dropdown Pantau Siswa.

## G. Dua Operator menyimpan bersamaan (opsional)

Perlu akun Operator kedua.

1. Operator 1 dan Operator 2 sama-sama membuka **Bab 6–10**.
2. Operator 1 mengubah satu huruf, lalu **Simpan draft**.
3. Operator 2 mengubah sesuatu, lalu **Simpan draft**.
4. Sesudahnya klik **Buang draft** supaya Bab 6–10 kembali seperti semula.

**Yang harus terlihat:** Operator 2 mendapat pesan merah *"Draft ini sudah
diubah oleh [nama] pada …"*. Simpanan Operator 1 tidak tertimpa.

## H. Siswa tidak bisa membuka editor (opsional)

1. Di jendela incognito (siswa uji), ketik alamat
   `https://www.nihongobenkyo.my.id/pages/kelola-soal.html`.

**Yang harus terlihat:** halaman kosong; ikon 題 tidak ada di sidebar.

## Lembar hasil

Isi ✅ atau ❌. Untuk yang ❌, tulis apa yang muncul atau pesan error-nya.

| Bagian | Hasil | Catatan |
|---|---|---|
| A. Halaman & daftar tes tampil | | |
| B. Edit + pratinjau + "Belum disimpan" | | |
| C. `<img src=x>` ditandai & penerbitan ditolak | | |
| D. Simpan draft, tetap ada setelah F5, terbitkan | | |
| E. Riwayat versi & pulihkan (soal kembali normal) | | |
| F. Paket baru: terbit, diakses, dikerjakan, dinonaktifkan | | |
| G. (opsional) Simpan bersamaan ditolak | | |
| H. (opsional) Siswa tidak bisa membuka editor | | |
