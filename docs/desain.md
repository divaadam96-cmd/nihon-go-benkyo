# Panduan Desain

Dokumen ini mencatat aturan visual yang sudah dipakai Nihon GO Benkyo.
Tujuannya bukan mengganti desain, melainkan membantu perubahan berikutnya tetap
konsisten dengan tampilan yang sekarang.

## Karakter visual

Tampilan aplikasi menggabungkan suasana buku belajar Jepang dengan antarmuka
dashboard yang tenang. Ciri utamanya:

- latar seperti kertas berwarna hangat;
- biru tua untuk struktur utama dan teks penting;
- emas dan merah mawar sebagai aksen;
- kartu putih-krem dengan garis tipis dan sudut membulat;
- huruf Jepang yang tetap besar dan mudah dibaca;
- animasi singkat yang membantu pengguna memahami perubahan keadaan.

## Warna utama

Sumber warna bersama berada di bagian paling atas
`css/base.css` sebagai CSS custom properties.

| Variabel | Nilai | Pemakaian umum |
|---|---:|---|
| `--navy` | `#102037` | header, judul, tombol atau panel utama |
| `--blue` | `#315fa8` | aksen biru dan status tertentu |
| `--ink` | `#27354b` | teks isi dengan kontras tinggi |
| `--muted` | `#718096` | keterangan, label sekunder, teks bantuan |
| `--paper` | `#fffdf9` | permukaan kartu atau bidang seperti kertas |
| `--wash` | `#f6f5f1` | latar lembut di belakang konten |
| `--line` | `#e4e0d8` | garis pembatas dan border |
| `--gold` | `#ad8b50` | aksen belajar, fokus, dan elemen Jepang |
| `--green` | `#2d9d79` | status berhasil atau sudah dikuasai |
| `--rose` | `#bd725b` | aksen utama, grafik, dan penekanan |
| `--rose-soft` | `#f4e3dc` | latar lembut untuk aksen mawar |
| `--red` | `#bd5c55` | peringatan dan tindakan berbahaya |

Beberapa modul lama masih mempunyai warna literal yang sedikit berbeda. Jangan
mengganti semuanya sekaligus hanya agar memakai variabel: urutan cascade CSS
lama memang sengaja dipertahankan supaya tampilan tidak berubah.

## Tipografi

Teks antarmuka terutama menggunakan `Zen Kaku Gothic New` dengan cadangan
`Yu Gothic` dan `sans-serif`. Bagian tertentu memakai `DM Sans`. Kanji yang
bersifat dekoratif atau menjadi panduan goresan memakai `Noto Serif JP` atau
`Yu Mincho` agar bentuknya lebih sesuai.

Aturan praktis:

- gunakan sans-serif untuk navigasi, tombol, angka, dan penjelasan;
- gunakan font Jepang yang sudah ada untuk karakter kana/kanji;
- jangan mengecilkan teks hanya agar muat; perbaiki layout responsifnya;
- pertahankan jarak baris yang longgar pada materi panjang.

## Struktur layout bersama

`js/app-shell.js` membangun empat bagian yang sama pada seluruh halaman:

1. layar login;
2. header atas;
3. sidebar desktop dan drawer mobile;
4. navigasi bawah pada layar kecil.

Konten khusus halaman ditempatkan di `<main id="pageMain">`. Karena shell
dipakai bersama, perubahan header atau sidebar cukup dilakukan di satu tempat.
Jangan menyalin markup shell ke setiap `pages/*.html`.

Lebar layout menyesuaikan layar melalui breakpoint yang sudah tersebar di CSS:
sekitar 1120/1150 px untuk grid besar, 900/860 px untuk tablet, 760/700 px
untuk perubahan navigasi dan kolom, serta 610/600/480 px untuk ponsel.

## Komponen yang berulang

- `.card` adalah permukaan konten utama.
- `.head` dan `.eyebrow` membentuk pembuka setiap halaman atau bagian.
- `.primary`, `.secondary`, dan `.danger` membedakan tingkat tindakan.
- `.track` dan `.fill` menampilkan progres.
- badge/status memakai warna sesuai maknanya, bukan sekadar hiasan.
- elemen materi memakai kelas berawalan `.material-`.
- elemen Kanji dan Tes mempunyai CSS khusus di `css/pages/`.

Saat menambah komponen, cari pola yang sudah ada terlebih dahulu. Pakai kelas
baru hanya jika fungsi dan bentuknya benar-benar berbeda.

## Gerak dan interaksi

Animasi digunakan untuk indikator navigasi, kemunculan konten, penekanan ikon,
flashcard, dan beberapa aktivitas belajar. Durasi umumnya pendek agar terasa
responsif. Sejumlah aturan sudah menghormati
`prefers-reduced-motion: reduce`; animasi baru juga harus menyediakan keadaan
tanpa gerak bagi pengguna yang membutuhkannya.

Keadaan interaktif harus tetap dapat dikenali tanpa animasi, misalnya melalui
warna, teks, `aria-pressed`, atau status aktif.

## Aksesibilitas dasar

- Semua tombol ikon perlu `aria-label` yang menjelaskan tindakannya.
- Fokus keyboard tidak boleh dihilangkan tanpa pengganti yang terlihat.
- Gunakan elemen `<button>` untuk tindakan dan tautan/navigasi yang sesuai
  untuk perpindahan halaman.
- Jangan menyampaikan benar/salah hanya dengan warna; sertakan teks atau ikon.
- Pertahankan kontras teks terhadap kartu dan latar.
- Uji keyboard, pembesaran teks, dan lebar 320 px setelah mengubah layout.

## Urutan pemuatan CSS

Setiap halaman memuat CSS dengan urutan tetap: `base.css` (variabel +
reset) → `shell.css` (header/sidebar/nav + komponen dasar) → `auth.css`
(layar login) → `css/pages/<nama>.css` (konten khusus halaman itu).
Urutan ini bagian dari desain: beberapa selector (mis. `.main`, `.card`,
`.top`) sengaja didefinisikan ulang di file yang dimuat belakangan untuk
menimpa definisi sebelumnya. Karena itu:

1. jangan menukar urutan `<link>` tersebut;
2. jangan memindahkan selector antar-file tanpa uji visual menyeluruh
   (cek juga apakah selector itu didefinisikan ulang di tempat lain);
3. CSS khusus halaman (`css/pages/*.css`) selalu dimuat PALING TERAKHIR;
4. naikkan `CACHE_NAME` di `sw.js` kalau ada file CSS yang isinya diubah
   (lihat "Konvensi cache-busting" di `README.md` — sekarang cuma satu
   angka itu yang perlu dinaikkan, tidak ada lagi query string `?v=`).

## Checklist sebelum mengubah tampilan

- Bandingkan halaman sebelum dan sesudah pada desktop serta ponsel.
- Uji sidebar terbuka/ringkas, drawer mobile, dan navigasi bawah.
- Uji keadaan kosong, aktif, berhasil, salah, loading, dan disabled.
- Pastikan Kanji Jepang, materi panjang, dan label peran tidak terpotong.
- Gunakan `QA_CHECKLIST.md` sebelum perubahan dilepas ke production.
