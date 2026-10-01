/* Konten teks pelajaran (grammar Pelajaran 1-50, Buku 1 & Buku 2) untuk
   halaman Materi. installMateriGrammarContent() dipanggil SEKALI oleh
   initPage() di materi.js, di awal fungsi.

   Buku 1 dan Buku 2 dulu punya cara pasang konten yang BEDA (Buku 2 tadinya
   fitur terpisah "Kelas" di sidebar, digabung belakangan cuma di tampilan -
   lihat README.md/docs/desain.md). Sekarang KEDUANYA memakai bentuk yang
   sama: satu array data (MATERI_BOOK1_LESSONS / MATERI_BOOK2_LESSONS), satu
   fungsi render bersama (buildLessonHtml). Mau tambah/hapus/ubah 1 pelajaran?
   Tinggal ubah 1 entri array - tidak perlu utak-atik fungsi render atau
   file lain.

   Isi tiap pelajaran (teks, urutan, nomor tampil) PERSIS SAMA seperti
   sebelum restrukturisasi ini - diverifikasi byte-demi-byte di browser
   sungguhan untuk seluruh 50 pelajaran sebelum di-commit. Ini murni
   perubahan STRUKTUR kode, bukan konten. */

function buildLessonHtml(number, title, items, focusLabel, focus, practiceLabel, practice) {
  /* Tiap item pola bisa ditulis dalam 2 bentuk, keduanya dinormalisasi ke
     bentuk {pola, suffix, blocks} yang sama sebelum dirender - supaya HANYA
     ADA SATU jalur render/gaya visual untuk seluruh Materi (bukan 2 template
     terpisah):
     - array lama [pola, penjelasan, contoh, arti, catatan?] - 1 blok, 1 contoh.
     - objek baru {title, suffix?, blocks:[{label?, text?, examples?:[[contoh, arti], ...], note?, table?}]}
       - dipakai saat pola sumber (Keterangan Tata Bahasa asli) punya beberapa
         sub-penjelasan dan/atau beberapa contoh kalimat per pola (mis. Pelajaran 1).
         suffix = keterangan di luar kotak pola, mis. "(kalimat tanya)".
         text opsional: sebagian sub-poin di buku (mis. Pelajaran 2 pola 5)
         cuma satu baris "N) <kalimat>" tanpa paragraf penjelasan terpisah -
         taruh kalimatnya di `label` saja dan biarkan `text` kosong.
         table opsional {headers:[...], rows:[[...], ...]}: sebagian pola
         di buku memang berupa tabel referensi, bukan penjelasan+contoh
         (mis. Pelajaran 3 pola 5 "Daftar こ／そ／あ／ど"). Urutan render SATU
         blok tetap: label, text, table, examples, note - table SELALU
         sebelum examples (mis. Pelajaran 4 pola 2 sub 2: tabel konjugasi
         dulu baru contoh ③④⑤) karena begitu urutannya di buku sumber.
         noBox opsional: sebagian nomor di buku (mis. Pelajaran 8 nomor 1
         "Kata Sifat") bukan kotak pola kalimat, cuma judul sub-bagian biasa
         tanpa kotak - beda dari nomor lain di pelajaran yang sama.
         figure opsional {src, alt}: diagram/ilustrasi yang memang ada di
         buku (mis. garis waktu Pelajaran 29 pola 1), dipotong dari PDF ke
         assets/images/materi/. Dirender setelah text, sebelum table. */
  const normalize = (item) =>
    Array.isArray(item)
      ? { pola: item[0], suffix: "", noBox: false, blocks: [{ text: item[1], examples: [[item[2], item[3]]], note: item[4] }] }
      : { pola: item.title, suffix: item.suffix || "", noBox: !!item.noBox, blocks: item.blocks };
  const renderExample = ([contoh, arti]) =>
    `<div class="grammar-example"><span class="grammar-jp">${contoh}</span><span class="grammar-meaning">${arti}</span></div>`;
  const renderTable = (table) =>
    `<table class="grammar-table"><thead><tr><th></th>${table.headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${table.rows.map((row) => `<tr>${row.map((cell, i) => `<${i === 0 ? "th" : "td"}>${cell}</${i === 0 ? "th" : "td"}>`).join("")}</tr>`).join("")}</tbody></table>`;
  const renderBlock = (b) =>
    `<div class="grammar-block">${b.label ? `<p class="grammar-subhead">${b.label}</p>` : ""}${b.text ? `<p>${b.text}</p>` : ""}${b.figure ? `<figure class="grammar-figure"><img src="../${b.figure.src}" alt="${b.figure.alt}" loading="lazy"></figure>` : ""}${b.table ? renderTable(b.table) : ""}${(b.examples || []).map(renderExample).join("")}${b.note ? `<p class="grammar-important-note">${b.note}</p>` : ""}</div>`;
  const renderPoint = (item, i) => {
    const { pola, suffix, noBox, blocks } = normalize(item);
    const heading = `<h3><span class="grammar-pola-number">${i + 1}. </span><span class="${noBox ? "grammar-pola-plain" : "grammar-pola-box"}">${pola}</span>${suffix ? `<span class="grammar-pola-suffix"> ${suffix}</span>` : ""}</h3>`;
    return `<div class="grammar-point">${heading}${blocks.map(renderBlock).join("")}</div>`;
  };
  return `<details class="html-lesson"><summary><span class="lesson-number">${number}</span>Pelajaran ${number}: ${title}</summary><div class="html-content">${items.map(renderPoint).join("")}<div class="html-note"><div><b>${focusLabel}</b>${focus}</div><div><b>${practiceLabel}</b>${practice}</div></div></div></details>`;
}

function installMateriGrammarContent() {
if (new URLSearchParams(location.search).get("source") === "1") {
  const sourceModeStyle = document.createElement("style");
  sourceModeStyle.textContent =
    ".top,.side,.mobile-nav{display:none!important}.layout{display:block;min-height:0}.main{padding:0;background:transparent}#materials .head,#materials>.material-grid,#materials>.notice{display:none!important}#materials{padding:0}.app{max-width:none;box-shadow:none;background:transparent}";
  document.head.appendChild(sourceModeStyle);
}

document.getElementById("materials").innerHTML =
  `<div class="head"><div><div class="eyebrow">Materi pembelajaran HTML lengkap</div><h1>Keterangan Tata Bahasa Pelajaran 1–25</h1><p>Setiap pelajaran memuat seluruh poin inti tata bahasa dalam penulisan ulang yang terstruktur untuk web.</p></div></div><div class="html-course"></div>`;

const MATERI_BOOK1_LESSONS = [
  {
    title: "第一課",
    items: [
      {
        title: "Kata Benda<sub>1</sub> は Kata Benda<sub>2</sub> です",
        blocks: [
          {
            label: "1) Partikel は",
            text: "Partikel は menunjukkan bahwa kata sebelumnya adalah topik kalimat (Lihat: Kolom1: Topik dan Subjek). Si pembicara memakai は untuk hal yang mau dibicarakannya, kemudian selanjutnya membuat kalimat dengan menambahkan berbagai deskripsi.",
            examples: [["① わたしは マイク・ミラーです。", "Saya Mike Miller."]],
            note: "[Perhatian] Partikel は dibaca わ.",
          },
          {
            label: "2) です",
            text: "Kata Benda yang diikuti oleh です menjadi Predikat. です menyatakan maksud penilaian dan kepastian, juga menunjukkan sikap sopan terhadap lawan bicara. Jika です dalam kalimat negatif atau waktu lampau, bentuknya berubah.",
            examples: [["② わたしは 会社員です。", "Saya pegawai perusahaan."]],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub> は Kata Benda<sub>2</sub> じゃ（では）ありません",
        blocks: [
          {
            text: "じゃ（では）ありません adalah bentuk negatif untuk です. Dalam percakapan sehari-hari sering digunakan じゃ ありません. Dalam pidato yang resmi atau bahasa tertulis digunakan では ありません.",
            examples: [["③ サントスさんは　学生じゃ（では）ありません。", "Sdr. Santos bukan mahasiswa."]],
            note: "[Perhatian] は dari では diucapkan わ.",
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub> は Kata Benda<sub>2</sub> ですか",
        suffix: "(kalimat tanya)",
        blocks: [
          {
            label: "1) Partikel か",
            text: "Partikel か menyatakan perasaan ketidakpastian atau heran si pembicara. Dengan memakai か pada akhir kalimat maka dapat membuat kalimat tanya. Kalimat tanya biasanya menyertai intonasi naik pada akhir kalimat.",
          },
          {
            label: "2) Kalimat tanya untuk menanyakan “Ya” atau “Tidak” tentang isi kalimat.",
            text: "Tanpa mengubah susunan kata-kata, membuat kalimat dengan membubuhi か pada akhir kalimat. Kalimat tanya ini menanyakan apakah benar atau tidak isi kalimat, dan jika benar menjawab dengan memakai はい, jika salah menjawab dengan いいえ.",
            examples: [
              ["④ ミラーさんは アメリカ人ですか。<br>……はい、アメリカ人です。", "Apakah Sdr. Miller orang Amerika?<br>……Ya, orang Amerika."],
              ["⑤ ミラーさんは 先生ですか。<br>……いいえ、先生じゃ ありません。", "Apakah Sdr. Miller guru?<br>……Bukan, dia bukan guru."],
            ],
          },
          {
            label: "3) Kalimat tanya dengan kata tanya",
            text: "Bagian isi yang ingin ditanyakan diganti dengan kata tanya, dan dibubuhkan か pada akhir kalimat.",
            examples: [
              ["⑥ あの 方は どなたですか。<br>……[あの 方は] ミラーさんです。", "Siapakah orang itu?<br>……[Beliau] Sdr. Miller."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda も",
        blocks: [
          {
            text: "も digunakan apabila menyatakan predikatnya dianggap sama dengan predikat sebelumnya.",
            examples: [["⑦ ミラーさんは 会社員です。グプタさんも 会社員です。", "Sdr. Miller pegawai perusahaan. Sdr. Gupta juga pegawai perusahaan."]],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub> の Kata Benda<sub>2</sub>",
        blocks: [
          {
            text: "Jika Kata Benda<sub>1</sub> di depan menerangkan Kata Benda<sub>2</sub> di belakangnya, maka kedua Kata Benda disambung dengan の. Pada Pelajaran 1 Kata Benda<sub>1</sub> menunjukkan satu kesatuan Kata Benda<sub>2</sub>.",
            examples: [["⑧ ミラーさんは IMCの 社員です。", "Sdr. Miller pegawai perusahaan IMC."]],
          },
        ],
      },
      {
        title: "～さん",
        blocks: [
          {
            text: "Dalam bahasa Jepang memakai さん di belakang marga atau nama lawan bicara atau orang pihak ketiga. Karena さん menunjukkan kesopanan, tidak dipakai untuk marga atau nama si pembicara sendiri. Sebagai gantinya さん, untuk anak kecil dengan rasa akrab dipakai ちゃん.",
            examples: [["⑨ あの 方は ミラーさんです。", "Beliau Sdr. Miller."]],
          },
          {
            text: "Ketika memanggil lawan bicara, jika telah mengenal namanya maka あなた tidak dipakai lagi, tetapi memanggil marga atau namanya yang dibubuhi dengan さん.",
            examples: [["⑩ 鈴木： ミラーさんは 学生ですか。<br>ミラー： いいえ、会社員です。", "Suzuki: Apakah Sdr. Miller mahasiswa?<br>Miller: Bukan, saya pegawai perusahaan."]],
            note: "[Perhatian] あなた digunakan terhadap orang yang berhubungan sangat dekat (suami istri, pacar dll.). Perlu hati-hati bahwa jika menggunakannya kepada lawan bicara yang hubungan tidak dekat maka akan memberi kesan yang kurang sopan.",
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 1",
    focus: "Perkenalan diri, pekerjaan, asal negara, serta cara bertanya dan menjawab secara sopan.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat lima kalimat: dua pernyataan です, satu negatif, satu pertanyaan, dan satu kalimat memakai の atau も.",
  },
  {
    title: "Kata tunjuk dan persamaan",
    items: [
      {
        title: "これ／それ／あれ",
        blocks: [
          {
            text: "これ, それ, あれ menunjukkan benda dan berfungsi sebagai Kata Benda. これ menunjukkan benda yang ada di dekat si pembicara. それ menunjukkan benda yang ada di dekat lawan bicara. あれ menunjukkan benda yang ada jauh dari pembicara dan lawan bicara.",
            examples: [
              ["① それは 辞書ですか。", "Apakah ini kamus?"],
              ["② これは だれの 傘ですか。", "Ini payung siapa?"],
            ],
          },
        ],
      },
      {
        title: "この Kata Benda／その Kata Benda／あの Kata Benda",
        blocks: [
          {
            text: "Jika menerangkan Kata Benda, dipakai この, その dan あの.",
            examples: [
              ["③ この 本は わたしのです。", "Buku ini kepunyaan saya."],
              ["④ あの 方は どなたですか。", "Siapakah beliau?"],
            ],
          },
        ],
      },
      {
        title: "そうです",
        blocks: [
          {
            text: "Dalam kalimat nominal yang menanyakan positif atau negatif, sering digunakan そう terhadap jawaban positif, dan dapat menjawab dengan kalimat はい、そうです。",
            examples: [["⑤ それは 辞書ですか。<br>……はい、そうです。", "Apakah itu kamus?<br>……Ya, betul."]],
          },
          {
            text: "Untuk bentuk negatif, tidak lazim menjawab dengan そう, tetapi sebagai gantinya digunakan ちがいます（bukan）, atau menyatakan jawaban yang sebenarnya.",
            examples: [
              ["⑥ それは ミラーさんのですか。<br>……いいえ、違います。", "Apakah itu punya Sdr. Miller?<br>……Bukan."],
              ["⑦ それは シャープペンシルですか。<br>……いいえ、ボールペンです。", "Apakah itu pensil isi ulang?<br>……Bukan, bolpoin."],
            ],
          },
        ],
      },
      {
        title: "～か、～か",
        blocks: [
          {
            text: "Dengan kalimat tanya ini memberi pilihan yang lebih dari dua, kemudian lawan bicara memilih yang benar. Untuk jawaban, tidak dibubuhi はい、いいえ, tetapi menyatakan langsung kalimat yang dipilih.",
            examples: [["⑧ これは「9」ですか、「7」ですか。<br>……「9」です。", "Apakah ini “9” atau “7”?<br>……“9”."]],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub> の Kata Benda<sub>2</sub>",
        blocks: [
          {
            text: "Pada Pelajaran 1 telah dipelajari bahwa jika Kata Benda<sub>1</sub> menerangkan Kata Benda<sub>2</sub>, maka digunakan の di antara Kata Benda<sub>1</sub> dan Kata Benda<sub>2</sub>. Pada pelajaran ini belajar cara penggunaan の sebagai berikut di bawah ini:",
          },
          {
            label: "1) Kata Benda<sub>1</sub> menerangkan sesuatu dari Kata Benda<sub>2</sub>.",
            examples: [["⑨ これは コンピューターの 本です。", "Ini buku komputer."]],
          },
          {
            label: "2) Kata Benda<sub>1</sub> menyatakan pemilik Kata Benda<sub>2</sub>.",
            examples: [["⑩ これは わたしの 本です。", "Ini buku saya."]],
          },
        ],
      },
      {
        title: "の yang berfungsi sebagai pengganti Kata Benda",
        blocks: [
          {
            text: "の ini digunakan untuk mengganti Kata Benda yang terdapat sebelumnya（かばん pada contoh⑪）. Seperti contoh⑪, jika diletakkan di belakang Kata Benda（さとうさん）, maka bentuk kalimat menjadi sama maknanya dengan dihilangkannya Kata Benda<sub>2</sub> dari kalimat Kata Benda<sub>1</sub> の Kata Benda<sub>2</sub>（さとうさんの かばん）. の digunakan sebagai pengganti kata benda, tetapi tidak digunakan sebagai pengganti orang.",
            examples: [
              ["⑪ あれは だれの かばんですか。<br>……佐藤さんのです。", "Itu tas siapa?<br>……Kepunyaan Sdr. Sato."],
              ["⑫ この かばんは あなたのですか。<br>……いいえ、わたしのじゃ ありません。", "Apakah tas ini tas Anda?<br>……Bukan, bukan kepunyaan saya."],
              ["⑬ ミラーさんは IMCの 社員ですか。<br>……はい、IMCの 社員です。<br>×　はい、IMCのです。", "Apakah Sdr. Miller pegawai perusahaan IMC?<br>……Ya, pegawai perusahaan IMC."],
            ],
          },
        ],
      },
      {
        title: "お～",
        blocks: [
          {
            text: "お dibubuhkan pada Kata Benda dan berfungsi untuk menyatakan kesopanan.（Contoh: ［お］みやげ, ［お］さけ）",
          },
        ],
      },
      {
        title: "そうですか",
        blocks: [
          {
            text: "Ketika mendapatkan informasi baru, ekspresi ini digunakan untuk menyatakan telah mengerti. Diucapkan dengan intonasi menurun.",
            examples: [["⑭ この 傘は あなたのですか。<br>……いいえ、違います。シュミットさんのです。<br>そうですか。", "Apakah payung ini punya Anda?<br>……Bukan, salah. Punya Sdr. Schmidt.<br>O, begitu."]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 2",
    focus: "Menunjuk benda, membedakan jarak, menanyakan kepemilikan, dan memberi jawaban atas informasi.",
    practiceLabel: "Latihan mandiri",
    practice: "Pilih lima benda di sekitar Anda. Buat pertanyaan memakai これ／それ／あれ lalu jawab dengan そうです atau ちがいます.",
  },
  {
    title: "Tempat, arah, dan asal produk",
    items: [
      {
        title: "ここ／そこ／あそこ／こちら／そちら／あちら",
        blocks: [
          {
            text: "ここ, そこ, あそこ menunjukkan tempat. ここ menunjukkan tempat di mana si pembicara berada, そこ menunjukkan tempat di mana lawan bicara berada, dan あそこ menunjukkan tempat yang jauh dari kedua-duanya.",
          },
          {
            text: "こちら, そちら, あちら menunjukkan arah, tetapi juga dapat dipakai untuk menunjukkan tempat yang dapat dilihat oleh mata yang digantikan dengan ここ, そこ, あそこ. Dalam hal ini こちら, そちら, あちら menyatakan perasaan yang lebih sopan.",
            note: "[Perhatian] Jika si pembicara menganggap bahwa lawan bicara berada di daerah yang sama, maka tempat di mana kedua-duanya berada dikatakan ここ, tempat yang sedikit jauh dikatakan そこ, dan tempat yang jauh dikatakan あそこ.",
          },
        ],
      },
      {
        title: "Kata Benda は tempat です",
        blocks: [
          {
            text: "Dengan menggunakan pola kalimat ini, dapat menyatakan tempat di mana benda, tempat, atau orang berada.",
            examples: [
              ["① お手洗いは あそこです。", "Kamar kecil di sana."],
              ["② 電話は 2階です。", "Telepon di lantai dua."],
              ["③ 山田さんは 事務所です。", "Sdr. Yamada di kantor."],
            ],
          },
        ],
      },
      {
        title: "どこ／どちら",
        blocks: [
          {
            text: "どこ adalah Kata Tanya untuk tempat, dan どちら adalah Kata Tanya untuk bertanya arah. Untuk bertanya tempat, adakalanya digunakan どちら. Dalam hal ini, ungkapan menjadi lebih sopan daripada menggunakan どこ.",
            examples: [
              ["④ お手洗いは どこですか。<br>……あそこです。", "Di mana kamar kecil?<br>……Di sana."],
              ["⑤ エレベーターは どちらですか。<br>……あちらです。", "Lift di sebelah mana?<br>……Di sebelah sana."],
            ],
          },
          {
            text: "Jika menanyakan nama negara, perusahaan, sekolah dan lain-lain seperti tempat atau organisasi, tidak menggunakan Kata Tanya なん melainkan menggunakan どこ, どちら. Dalam hal ini, ungkapan どちら menjadi lebih sopan daripada menggunakan どこ.",
            examples: [
              ["⑥ 学校は どこですか。", "Sekolah di mana?"],
              ["⑦ 会社は どちらですか。", "Perusahaan mana?"],
            ],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub> の Kata Benda<sub>2</sub>",
        blocks: [
          {
            text: "Jika Kata Benda<sub>1</sub> adalah nama negara dan Kata Benda<sub>2</sub> adalah produknya, maka Kata Benda<sub>1</sub> の berarti buatan dari negara tersebut. Kalau Kata Benda<sub>1</sub> adalah nama perusahaan, dan Kata Benda<sub>2</sub> adalah produkunya, Kata Benda<sub>1</sub> の berarti buatan perusahaan tersebut. Untuk kedua pertanyaan digunakan Kata Tanya どこ.",
            examples: [
              ["⑧ これは どこの コンピューターですか。<br>……日本の コンピューターです。<br>……パワー電気の コンピューターです。", "Ini komputer buatan mana?<br>……Komputer buatan Jepang.<br>……Komputer Power Elektronik."],
            ],
          },
        ],
      },
      {
        title: "Daftar こ／そ／あ／ど（Kata Penunjuk）",
        blocks: [
          {
            table: {
              headers: ["kelompok こ", "kelompok そ", "kelompok あ", "kelompok ど"],
              rows: [
                ["Barang", "これ", "それ", "あれ", "どれ（Pel.16）"],
                ["Barang/Orang", "この Kata Benda", "その Kata Benda", "あの Kata Benda", "どの Kata Benda（Pel.16）"],
                ["Tempat", "ここ", "そこ", "あそこ", "どこ"],
                ["Arah/<br>Tempat (halus)", "こちら", "そちら", "あちら", "どちら"],
              ],
            },
          },
        ],
      },
      {
        title: "お～",
        blocks: [
          {
            text: "Prefiks お dibubuhkan pada hal-hal yang bersangkut dengan lawan bicara atau orang pihak ketiga untuk menyatakan rasa hormat dari si pembicara.",
            examples: [["⑨ ［お］国は どちらですか。", "Berasal dari mana?"]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 3",
    focus: "Menanyakan dan menjelaskan lokasi, arah, asal produk, serta bentuk penunjuk yang sopan.",
    practiceLabel: "Latihan mandiri",
    practice: "Gambarkan denah sederhana rumah atau sekolah, lalu buat enam kalimat memakai ここ、そこ、あそこ、どこ、dan どちら.",
  },
  {
    title: "Waktu dan kegiatan harian",
    items: [
      {
        title: "今 －時－分です",
        blocks: [
          {
            text: "Untuk menyatakan waktu, dibubuhkan Kata Bantu Bilangan 時, dan 分 di belakang angka. Jika angka 2,5,7, dan 9 di depan 分, dibacanya ふん, dan 1,3,4,6,8, dan 10 di depannya maka dibacanya ぷん. Jika angka 1,6,8 dan 10 di depan 分, masing-masing angka dibacanya いっ, ろっ, はっ, dan じゅっ（じっ）(Lihat Lampiran Buku Induk). Jika menanyakan waktu, なん dibubuhkan di depan じ atau ぷん.",
            examples: [["① 今 何時ですか。<br>……7時10分です。", "Sekarang pukul berapa?<br>……Pukul tujuh lewat sepuluh menit."]],
          },
        ],
      },
      {
        title: "Kata Kerja ます／Kata Kerja ません／Kata Kerja ました／Kata Kerja ませんでした",
        blocks: [
          {
            label: "1) Kata Kerja ます berfungsi sebagai predikat pada kalimat.",
            text: "ます menyatakan sikap halus terhadap lawan bicara.",
            examples: [["② わたしは 毎日 勉強します。", "Saya belajar setiap hari."]],
          },
          {
            label: "2) Kata Kerja ます digunakan untuk menjelaskan kebiasaan dan kebenaran saat ini, dan aksi serta peristiwa yang akan terjadi masa depan.",
            text: "Kalimat negatif dan bentuk lampau berubah menjadi seperti berikut:",
            table: {
              headers: ["Waktu non lampau<br>(Sekarang dan masa depan)", "Waktu lampau"],
              rows: [
                ["Positif", "おきます", "おきました"],
                ["Negatif", "おきません", "おきませんでした"],
              ],
            },
            examples: [
              ["③ 毎朝 6時に 起きます。", "Setiap pagi saya bangun pukul enam."],
              ["④ あした 6時に 起きます。", "Besok saya bangun pukul enam."],
              ["⑤ けさ 6時に 起きました。", "Tadi pagi saya bangun pukul enam."],
            ],
          },
          {
            label: "3) Kalimat Tanya tidak mengubah susunan kata, tetapi dibubuhkan か pada akhir kalimat. Kata Tanya diletakkan dibagian yang ingin tanyakan.",
            text: "Untuk jawabannya, menjawab dengan mengulang Kata Kerja yang terdapat di dalam kalimat tanya. そうです, ちがいます（Lihat Pel.2）tidak dapat digunakan sebagai jawaban untuk kalimat tanya dari kalimat verbal.",
            examples: [
              ["⑥ きのう 勉強しましたか。<br>……はい、勉強しました。<br>……いいえ、勉強しませんでした。", "Kemarin belajar?<br>……Ya, belajar.<br>……Tidak, tidak belajar."],
              ["⑦ 毎朝 何時に 起きますか。<br>……6時に 起きます。", "Setiap pagi bangun pukul berapa?<br>……Bangun pukul enam."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda（waktu）に Kata Kerja",
        blocks: [
          {
            text: "Setelah Kata Benda yang menunjukkan waktu, dibubuhkan partikel に untuk menunjukkan waktu ketika melakukan sesuatu.",
            examples: [
              ["⑧ 6時半に 起きます。", "Bangun pukul setengah tujuh."],
              ["⑨ 7月2日に 日本へ 来ました。", "Datang ke Jepang pada tanggal 2 Juli yang lalu. (Pel.5)"],
            ],
          },
          {
            label: "[Perhatian 1]",
            text: "Kata Benda yang menunjukkan waktu seperti di bawah ini, tidak dibubuhkan に.<br>きょう、あした、あさって、きのう、おととい、けさ、こんばん、いま、まいあさ、まいばん、まいにち、せんしゅう（Pel.5）、こんしゅう（Pel.5）、らいしゅう（Pel.5）、いつ（Pel.5）、せんげつ（Pel.5）、こんげつ（Pel.5）、らいげつ（Pel.5）、ことし（Pel.5）、らいねん（Pel.5）、きょねん（Pel.5）、dan lain-lain.",
            examples: [["⑩ きのう 勉強しました。", "Kemarin belajar."]],
          },
          {
            label: "[Perhatian 2]",
            text: "Untuk Kata Benda berikut, に boleh dibubuhkan dan juga boleh tidak dibubuhkan. ～ようび、あさ、ひる、ばん、よる",
            examples: [["⑪ 日曜日［に］奈良へ 行きます。", "Pada hari Minggu, pergi ke Nara. (Pel.5)"]],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub> から Kata Benda<sub>2</sub> まで",
        blocks: [
          {
            label: "1) から menunjukkan titik permulaan waktu atau tempat, sedangkan まで menunjukkan titik akhir waktu atau tempat.",
            examples: [
              ["⑫ 9時から 5時まで 勉強します。", "Belajar dari pukul sembilan sampai dengan pukul lima."],
              ["⑬ 大阪から 東京まで 3時間 かかります。", "Menghabiskan waktu tiga jam dari Osaka sampai di Tokyo. (Pel.11)"],
            ],
          },
          {
            label: "2) から dan まで tidak selalu dipakai secara bersamaan, tetapi juga dipakai sendiri.",
            examples: [["⑭ 9時から 働きます。", "Bekerja dari pukul sembilan."]],
          },
          {
            label: "3) Untuk menyatakan waktu atau tanggal mulai dan selesainya Kata Benda yang diangkat pada topik, dapat digunakan dengan です di belakang ～から, ～まで, ～から～まで.",
            examples: [
              ["⑮ 銀行は 9時から 3時までです。", "Bank dibuka dari pukul sembilan sampai dengan pukul tiga."],
              ["⑯ 昼休みは 12時からです。", "Waktu istirahat siang dari pukul dua belas."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub> と Kata Benda<sub>2</sub>",
        blocks: [
          {
            text: "Jika menyambung Kata Benda secara setaraf, Kata Benda dan Kata Benda disambung dengan と.",
            examples: [["⑰ 銀行の 休みは 土曜日と 日曜日です。", "Hari libur bank adalah hari Sabut dan hari Minggu."]],
          },
        ],
      },
      {
        title: "～ね",
        blocks: [
          {
            text: "Kata Bantu ね dibubuhkan di akhir kalimat, dan digunakan ketika mengharapkan persetujuan dari lawan bicara, menegaskan, atau menekankan.",
            examples: [
              ["⑱ 毎日 10時まで 勉強します。<br>……大変ですね。", "Setiap hari belajar sampai pukul sepuluh.<br>……O, berat ya."],
              ["⑲ 山田さんの 電話番号は 871の 6813です。<br>……871の 6813ですね。", "Nomor telepon Sdr. Yamada 871-6813.<br>……871-6813, ya."],
            ],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 4",
    focus: "Menyatakan jam, kebiasaan, waktu kegiatan, rentang waktu, dan respons persetujuan dalam percakapan.",
    practiceLabel: "Latihan mandiri",
    practice: "Tuliskan jadwal harian Anda dari bangun sampai tidur dengan minimal lima kata kerja bentuk ます dan tiga penanda waktu.",
  },
  {
    title: "Perjalanan dan perpindahan",
    items: [
      {
        title: "Kata Benda（tempat）へ 行きます／来ます／帰ります",
        blocks: [
          {
            text: "Jika menunjukkan pindah, arah pindahnya dinyatakan dengan membubuhkan partikel へ.",
            examples: [
              ["① 京都へ 行きます。", "Pergi ke Kyoto."],
              ["② 日本へ 来ました。", "Datang ke Jepang."],
              ["③ うちへ 帰ります。", "Pulang ke rumah."],
            ],
            note: "[Perhatian] Partikel へ diucapkan え.",
          },
        ],
      },
      {
        title: "どこ［へ］も 行きません／行きませんでした",
        blocks: [
          {
            text: "Apabila ingin menyangkal hal yang ditanyakan oleh Kata Tanya secara total, pembentukkan Kata Kerja negatif dengan membubuhkan partikel も pada Kata Tanya.",
            examples: [
              ["④ どこ［へ］も 行きません。", "Tidak pergi ke mana-mana."],
              ["⑤ 何も 食べません。", "Tidak makan apa-apa."],
              ["⑥ だれも 来ませんでした。", "Tidak datang siapa-siapa."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda（kendaraan）で 行きます／来ます／帰ります",
        blocks: [
          {
            text: "Partikel で menunjukkan sarana dan cara. Yang dimaksud di bagian ini yang diikuti Kata Benda yang menunjukkan kendaraan adalah menunjukkan sarana transportasi.",
            examples: [
              ["⑦ 電車で 行きます。", "Pergi dengan kereta rel listrik."],
              ["⑧ タクシーで 来ました。", "Datang dengan taksi."],
            ],
          },
          {
            text: "Jika pergi dengan jalan kaki digunakan あるいて, tetapi tidak dibubuhkan partikel で.",
            examples: [["⑨ 駅から 歩いて 帰りました。", "Pulang dengan jalan kaki dari stasiun."]],
          },
        ],
      },
      {
        title: "Kata Benda（orang/hewan）と Kata Kerja",
        blocks: [
          {
            text: "Jika melakukan sesuatu bersama orang (hewan) maka ditunjukkan dengan membubuhkan partikel と.",
            examples: [["⑩ 家族と 日本へ 来ました。", "Datang ke Jepang bersama dengan keluarga."]],
          },
          {
            text: "Jika melakukan suatu aksi sendiri digunakan ひとりで. Dalam hal ini tidak menggunakan partikel と.",
            examples: [["⑪ 一人で 東京へ 行きます。", "Pergi ke Tokyo sendirian."]],
          },
        ],
      },
      {
        title: "いつ",
        blocks: [
          {
            text: "Untuk menanyakan waktu, selain digunakan Kata Tanya なん digunakan Kata Tanya いつ sebagaimana halnya seperti なんじ, なんようび, なんがつ, なんにち. Kata いつ tidak dapat dibubuhkan partikel に.",
            examples: [
              ["⑫ いつ 日本へ 来ましたか。<br>……3月25日に 来ました。", "Kapan datang ke Jepang?<br>……Datang pada tanggal 25 Maret."],
              ["⑬ いつ 広島へ 行きますか。<br>……来週 行きます。", "Kapan pergi ke Hiroshima?<br>……Pergi minggu depan."],
            ],
          },
        ],
      },
      {
        title: "～よ",
        blocks: [
          {
            text: "Partikel よ dibubuhkan pada akhir kalimat dan digunakan untuk memberitahukan suatu hal yang belum diketahui oleh lawan bicara, atau menyampaikan tanggapan dan pendapat si pembicara kepada lawan bicaranya.",
            examples: [
              ["⑭ この 電車は 甲子園へ 行きますか。<br>……いいえ、行きません。次の「普通」ですよ。", "Apakah kereta rel listrik ini menuju Koshien?<br>……Tidak, tidak pergi. Yang “Biasa” berikutnya."],
              ["⑮ 北海道に 馬が たくさん いますよ。", "Di Hokkaido ada banyak kuda. (Pel.18)"],
              ["⑯ マリアさん、この アイスクリーム、おいしいですよ。", "Ibu Maria, es krim ini enak. (Pel.19)"],
            ],
          },
        ],
      },
      {
        title: "そうですね",
        blocks: [
          {
            text: "そうですね digunakan jika menyetujui atau sependapat dengan hal yang dikatakan oleh lawan bicara. Adapun ungkapan mirip (Lihat Pel.2-8) yaitu そうですか, tetapi そうですか adalah ekspresi ketika mendapat informasi baru yang belum diketahui si pembicara kemudian memahaminya sedangkan そうですね digunakan untuk menunjukkan bahwa si pembicara berpikir hal yang sama, menyetujui hal yang telah dikenal, atau sependapat.",
            examples: [["⑰ あしたは 日曜日ですね。<br>……あ、そうですね。", "Besok hari Minggu, ya.<br>……O, ya betul."]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 5",
    focus: "Menyatakan tujuan perjalanan, transportasi, teman perjalanan, waktu, serta cara menanggapi informasi.",
    practiceLabel: "Latihan mandiri",
    practice: "Tulis rencana perjalanan akhir pekan dengan tempat tujuan, kendaraan, teman perjalanan, dan waktu keberangkatan.",
  },
  {
    title: "Aktivitas dan ajakan",
    items: [
      {
        title: "Kata Benda を Kata Kerja（Kata Kerja Transitif）",
        blocks: [
          {
            text: "Objek dari Kata Kerja Transitif ditunjukkan oleh partikel を.",
            examples: [["① ジュースを 飲みます。", "Minum jus."]],
            note: "[Perhatian] を hanya dipakai untuk menulis partikel saja.",
          },
        ],
      },
      {
        title: "Kata Benda を します",
        blocks: [
          {
            text: "します disertai Kata Benda secara luas sebagai objek. します mempunyai arti bahwa melakukan hal yang ditunjukan oleh objek tersebut. Beberapa contoh diberikan di bawah ini:",
          },
          {
            label: "1) Olahraga, permainan dan lain-lain",
            examples: [
              ["サッカーを します", "bermain sepak bola"],
              ["トランプを します", "bermain kartu"],
            ],
          },
          {
            label: "2) Pertemuan, acara dan lain-lain",
            examples: [
              ["パーティーを します", "berpesta"],
              ["会議を します", "mengadakan rapat"],
            ],
          },
          {
            label: "3) Dan lain-lain",
            examples: [
              ["宿題を します", "membuat PR"],
              ["仕事を します", "bekerja"],
              ["電話を します", "menelepon"],
            ],
          },
        ],
      },
      {
        title: "何を しますか",
        blocks: [
          {
            text: "Ini adalah pertanyaan untuk menanyakan hal yang dilakukan.",
            examples: [
              ["② 月曜日 何を しますか。<br>……京都へ 行きます。", "Hari Senin melakukan apa?<br>……Pergi ke Kyoto."],
              ["③ きのう 何を しましたか。<br>……サッカーを しました。", "Kemarin melakukan apa?<br>……Bermain sepak bola."],
            ],
          },
        ],
      },
      {
        title: "なん dan なに",
        blocks: [
          {
            text: "なん dan なに mempunyai arti yang sama.<br>なん digunakan pada hal-hal berikut:",
          },
          {
            label: "1) Jika kata yang mengikutinya diawali dengan baris た, だ, dan な.",
            examples: [
              ["④ それは 何ですか。", "Itu apa?"],
              ["⑤ 何の 本ですか。", "Buku apa?"],
              ["⑥ 寝る まえに、何と 言いますか。", "Sebelum tidur, mengucapkan apa? (Pel.21)"],
              ["⑦ 何で 東京へ 行きますか。", "Dengan apa pergi ke Tokyo?"],
            ],
          },
          {
            label: "[Perhatian]",
            text: "Selain bertanya tentang sarana, なんで digunakan untuk menanyakan alasan juga. Adakalanya dikatakan なにで jika ingin menunjukkan lebih jelas untuk menanyakan sarana.",
            examples: [["⑧ 何で 東京へ 行きますか。<br>……新幹線で 行きます。", "Dengan apa pergi ke Tokyo?<br>……Dengan Shinkansen."]],
          },
          {
            label: "2) Disertai Kata Bantu Bilangan",
            examples: [["⑨ テレーザちゃんは 何歳ですか。", "Berapa usia Teresa?"]],
          },
          {
            text: "Selain 1) dan 2) menggunakan なに.",
            examples: [["⑩ 何を 買いますか。", "Mau membeli apa?"]],
          },
        ],
      },
      {
        title: "Kata Benda（tempat）で Kata Kerja",
        blocks: [
          {
            text: "Partikel yang dipelajari di sini disertai Kata Benda yang menunjukkan tempat kemudian menunjukkan tempat yang melakukan aksi.",
            examples: [["⑪ 駅で 新聞を 買います。", "Membeli surat kabar di stasiun."]],
          },
        ],
      },
      {
        title: "Kata Kerja ませんか",
        blocks: [
          {
            text: "Ekspresi untuk mengajak lawan bicara.",
            examples: [["⑫ いっしょに 京都へ 行きませんか。<br>……ええ、いいですね。", "Bagaimana kita pergi ke Kyoto bersama-sama?<br>……Ya, bagus ya."]],
          },
        ],
      },
      {
        title: "Kata Kerja ましょう",
        blocks: [
          {
            text: "Ekspresi untuk mengusulkan secara aktif dan mengajak. Dipakai untuk menanggapi usulan atau ajakan secara aktif juga.",
            examples: [
              ["⑬ ちょっと 休みましょう。", "Mari istirahat sebentar."],
              ["⑭ いっしょに 昼ごはんを 食べませんか。<br>……ええ、食べましょう。", "Bagaimana kita makan siang bersama-sama?<br>……Ya, ayo kita makan."],
            ],
            note: "[Perhatian] Kata Kerja ませんか dan Kata Kerja ましょう kedua-duanya adalah ekspresi untuk mengajak lawan bicara, tetapi Kata Kerja ませんか lebih ditunjukkan perasaan yang menghormati keinginan lawan bicara.",
          },
        ],
      },
      {
        title: "～か",
        blocks: [
          {
            text: "か menyatakan hal untuk mendapatkan informasi baru yang belum diketahui oleh lawan bicara sebelumnya, kemudian memahaminya. Ini adalah cara penggunaan yang sama dengan か dari そうですか (Lihat Pel.2-8).",
            examples: [["⑮ 日曜日 京都へ 行きました。<br>……京都ですか。いいですね。", "Hari Minggu yang lalu pergi ke Kyoto.<br>……Kyoto? Bagus ya."]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 6",
    focus: "Menyatakan aktivitas, objek, tempat kegiatan, pertanyaan kegiatan, serta cara mengajak orang lain.",
    practiceLabel: "Latihan mandiri",
    practice: "Tulis jadwal akhir pekan dengan tiga aktivitas, objeknya, tempatnya, dan satu ajakan memakai Vませんか atau Vましょう.",
  },
  {
    title: "Alat, bahasa, memberi dan menerima",
    items: [
      {
        title: "Kata Benda（alat/sarana）で Kata Kerja",
        blocks: [
          {
            text: "Di bagian ini mempelajari partikel で yang menunjukkan sarana dan cara.",
            examples: [
              ["① はしで 食べます。", "Makan dengan sumpit."],
              ["② 日本語で レポートを 書きます。", "Menulis laporan dalam bahasa Jepang."],
            ],
          },
        ],
      },
      {
        title: "“Kata/Kalimat” は ～語で 何ですか",
        blocks: [
          {
            text: "Pertanyaan ini digunakan ketika menanyakan bagaimana cara mengatakan arti kata atau kalimat dalam bahasa lain.",
            examples: [
              ["③ 「ありがとう」は 英語で 何ですか。<br>……「Thank you」です。", "Apa bahasa Inggris dari “Arigato”?<br>……“Thank you”."],
              ["④ 「Thank you」は 日本語で 何ですか。<br>……「ありがとう」です。", "Apa bahasa Jepang dari “Thank you”?<br>……“Arigato”."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub>（orang）に Kata Benda<sub>2</sub> を あげます dan lain-lain",
        blocks: [
          {
            text: "Kata Kerja あげます, かします, おしえます dan lain-lainnya menunjukkan arti yang memberi barang atau informasi, dan memerlukan lawan yang diberikan barang atau informasi. Kata Benda<sub>1</sub> (orang) tersebut dibubuhkan dengan patrikel に.",
            examples: [
              ["⑤ ［わたしは］ 木村さんに 花を あげました。", "Saya memberikan Sdr. Kimura bunga."],
              ["⑥ ［わたしは］ イーさんに 本を 貸しました。", "Saya meminjamkan buku kepada Sdr. Lee."],
              ["⑦ ［わたしは］ 山田さんに 英語を 教えます。", "Saya mengajar bahasa Inggris kepada Sdr. Yamada."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub>（orang）に Kata Benda<sub>2</sub> を もらいます dan lain-lain",
        blocks: [
          {
            text: "Kata Kerja もらいます, かります, ならいます dan lain-lainnya menunjukkan arti yang menerima barang atau informasi, dan memerlukan lawan yang diberikan barang atau informasi. Kata Benda<sub>1</sub> (orang) tersebut dibubuhkan dengan  patrikel に.",
            examples: [
              ["⑧ ［わたしは］ 山田さんに 花を もらいました。", "Saya mendapatkan bunga dari Sdr. Yamada."],
              ["⑨ ［わたしは］ カリナさんに CDを 借りました。", "Saya meminjam CD dari Karina."],
              ["⑩ ［わたしは］ ワンさんに 中国語を 習います。", "Saya belajar bahasa Tionghua dari Sdr. Wang."],
            ],
          },
          {
            label: "[Perhatian]",
            text: "Untuk pola kalimat ini, partikel から juga dapat digunakan sebagai pengganti partikel に. Terutama jika lawannya bukan orang melainkan organisasi seperti perusahaan atau sekolah, dan sebagainya bukan に yang digunakan, melainkan から.",
            examples: [
              ["⑪ ［わたしは］ 山田さんから 花を もらいました。", "Saya mendapatkan bunga dari Sdr. Yamada."],
              ["⑫ 銀行から お金を 借りました。", "Saya meminjam uang dari bank."],
            ],
          },
        ],
      },
      {
        title: "もう Kata Kerja ました",
        blocks: [
          {
            text: "もう mempunyai arti sudah dan digunakan dengan kombinasi Kata Kerja ました. Dalam hal ini, Kata Kerja ました bermaksud bahwa perbuatan telah diselesaikan saat ini.<br>Jawaban untuk pertanyaan mengenai apakah perbuatannya telah diselesaikan atau belum yaitu もう Kata Kerja ましたか adalah jika telah diselesaikan atau jawaban positif はい、もう Kata Kerja ました, sedangkan belum diselesaikan atau jawaban negatif いいえ、Kata Kerjaて いません (Lihat Pel.31), atau いいえ、まだです. いいえ、Kata Kerjaませんでした tidak dapat digunakan sebab mempunyai arti yang tidak dilakukan pada waktu lampau.",
            examples: [
              ["⑬ もう 荷物を 送りましたか。<br>……はい、［もう］ 送りました。<br>……いいえ、まだ 送って いません。<br>……いいえ、まだです。", "Apakah barang sudah dikirim?<br>……Ya, sudah dikirim.<br>……Belum, belum dikirim. (Pel.31)<br>……Belum."],
            ],
          },
        ],
      },
      {
        title: "Menghilangkan partikel",
        blocks: [
          {
            text: "Dalam kalimat percakapan, jika sudah dapat memahami arti dari hubungan sebelum dan sesudahnya maka partikel sering dihilangkan.",
            examples: [
              ["⑭ この スプーン［は］、すてきですね。", "Sendok ini bagus ya."],
              ["⑮ コーヒー［を］、もう 一杯 いかがですか。", "Bagaimana kopi secangkir lagi? (Pel.8)"],
            ],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 7",
    focus: "Menjelaskan alat dan bahasa, memberi/menerima, serta menyatakan pekerjaan yang sudah selesai.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat dialog singkat tentang meminjam buku, mengajari bahasa, dan mengirim hadiah kepada teman.",
  },
  {
    title: "Kata sifat dan kesan",
    items: [
      {
        title: "Kata Sifat",
        noBox: true,
        blocks: [
          {
            text: "Kata Sifat berfungsi sebagai predikat dan menunjukkan kondisi Kata Benda dalam kalimat Kata Benda は Kata Sifat です atau digunakan sebagai kata yang menerangkan Kata Benda. Dalam bahasa Jepang terdapat dua jenis Kata Sifat yaitu Kata Sifat い dan Kata Sifat な, lalu perubahan bentuknya berbeda.",
          },
        ],
      },
      {
        title: "Kata Benda は Kata Sifat な［な］です<br>Kata Benda は Kata Sifat い（～い）です",
        blocks: [
          {
            text: "Kalimat adjektival positif waktu non lampau diakhiri です. です menunjukkan sikap yang hormat terhadap pendengar. Kata Sifat な disambung dengan です tanpa な, sedangkan Kata Sifat い disambung dengan です dalam bentuk yang sama.",
            examples: [
              ["① ワット先生は 親切です。", "Bapak Watt baik hati."],
              ["② 富士山は 高いです。", "Gunung Fuji tinggi."],
            ],
          },
          {
            label: "1) Kata Sifat な［な］じゃ（では）ありません",
            text: "Negatif waktu non lampau dari Kata Sifat な dibuat dengan dibubuhkan じゃ（では）ありません pada bentuk tanpa な dari Kata Sifat な.",
            examples: [["③ あそこは 静かじゃ（では）ありません。", "Di sana tidak sunyi."]],
          },
          {
            label: "2) Kata Sifat い（～い）です → ～くないです",
            text: "Negatif waktu non lampau dari Kata Sifat い dibuat dengan dibubuhkan くないです pada bentuk yang dihilangkan い di bagian akhir dari Kata Sifat い.",
            examples: [["④ この 本は おもしろくないです。", "Buku ini tidak menarik."]],
            note: "[Perhatian] Negatif untuk いいです adalah よくないです.",
          },
          {
            label: "3) Rangkuman Perubahan Bentuk",
            table: {
              headers: ["Kata Sifat な", "Kata Sifat い"],
              rows: [
                ["Positif waktu non lampau", "しんせつです", "たかいです"],
                ["Negaif waktu non lampau", "しんせつじゃ（では）ありません", "たかくないです"],
              ],
            },
          },
          {
            label: "4) Cara membuat kalimat tanya dari kalimat adjektival sama seperti kalimat nominal (Lihat Pel.1) dan kalimat verbal (Lihat Pel.4). Untuk jawabannya digunakan Kata Sifat, dan tidak dapat menjawab dengan menggunakan そうです atau ちがいます.",
            examples: [
              ["⑤ ペキンは 寒いですか。<br>……はい、寒いです。", "Apakah Beijing dingin?<br>……Ya, dingin."],
              ["⑥ 奈良公園は にぎやかですか。<br>……いいえ、にぎやかじゃ ありません。", "Apakah Taman Nara ramai?<br>……Tidak, tidak ramai."],
            ],
          },
        ],
      },
      {
        title: "Kata Sifat な［な］ Kata Benda<br>Kata Sifat い（～い） Kata Benda",
        blocks: [
          {
            text: "Jika Kata Sifat menerangkan Kata Benda, Kata Sifat diletakan di depan Kata Benda. Kata Sifat な menerangkan Kata Benda dengan bentuk diikuti な.",
            examples: [
              ["⑦ ワット先生は 親切な 先生です。", "Bapak Watt adalah guru yang baik hati."],
              ["⑧ 富士山は 高い 山です。", "Gunung Fuji adalah gunung yang tinggi."],
            ],
          },
        ],
      },
      {
        title: "～が、～",
        blocks: [
          {
            text: "が menyambungkan kalimat yang menyatakan sebelum dan sesudah secara paradoksal. Dalam kalimat adjektival yang subjeknya sama, hal yang bernilai positif oleh si pembicara diletakkan di bagian depan, maka hal yang negatif di bagian belakangnya. Sebaliknya, jika hal yang bernilai negatif oleh si pembicara diletakkan di bagian depan, maka hal yang positif di bagian belakangnya.",
            examples: [["⑨ 日本の 食べ物は おいしいですが、高いです。", "Makanan Jepang enak, tetapi mahal."]],
          },
        ],
      },
      {
        title: "とても／あまり",
        blocks: [
          {
            text: "とても dan あまり adalah Kata keterangan yang menyatakan tingkat, dan jika menerangkan Kata Sifat kata tersebut diletakkan di depan Kata Sifat. とても mempunyai arti sangat dan digunakan pada kalimat positif. あまり digunakan bersamaan dengan kalimat negatif yang mempunyai arti tidak begitu.",
            examples: [
              ["⑩ ペキンは とても 寒いです。", "Beijing sangat dingin."],
              ["⑪ これは とても 有名な 映画です。", "Ini film yang sangat terkenal."],
              ["⑫ シャンハイは あまり 寒くないです。", "Shanghai tidak begitu dingin."],
              ["⑬ さくら大学は あまり 有名な 大学じゃ ありません。", "Universitas Sakura adalah universitas yang tidak begitu terkenal."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda は どうですか",
        blocks: [
          {
            text: "Kata Benda は どうですか menanyakan citra, pendapat, dan kesan mengenai hal yang dialami tentang tempat yang telah dikunjungi atau orang yang pernah dijumpai dan lain-lainnya oleh lawan bicara.",
            examples: [["⑭ 日本の 生活は どうですか。<br>……楽しいです。", "Bagaimana kehidupan di Jepang?<br>……Senang."]],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub> は どんな Kata Benda<sub>2</sub> ですか",
        blocks: [
          {
            text: "どんな adalah Kata Tanya untuk menanyakan keadaan atau sifat orang dan benda, kemudian digunakan untuk menerangkan Kata Benda.",
            examples: [["⑮ 奈良は どんな 町ですか。<br>……古い 町です。", "Nara kota bagaimana?<br>……Kota yang lama."]],
          },
        ],
      },
      {
        title: "そうですね",
        blocks: [
          {
            text: "Pada Pelajaran 5 telah dipelajari そうですね yang menyatakan persetujuan atau perasaan yang sama. Pada pelajaran ini terdapat そうですね menunjukkan sikap dari lawan bicaranya yang sedang berpikir seperti pada percakapan ⑯.",
            examples: [["⑯ お仕事は どうですか。<br>……そうですね。忙しいですが、おもしろいです。", "Bagaimana pekerjaannya?<br>……Ya... Sibuk, tetapi menyenangkan."]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 8",
    focus: "Mendeskripsikan sifat, bertanya kesan, membuat frasa kata sifat, dan menyatakan kontras.",
    practiceLabel: "Latihan mandiri",
    practice: "Pilih tiga tempat atau benda. Jelaskan masing-masing dengan い形容詞 dan な形容詞, lalu bandingkan dengan ～が.",
  },
  {
    title: "Kesukaan, kemampuan, dan jumlah",
    items: [
      {
        title: "Kata Benda が あります／わかります<br>Kata Benda が 好きです／嫌いです／上手です／下手です",
        blocks: [
          {
            text: "Sebagian Kata Kerja atau Kata Sifat menunjukkan objek dengan partikel が.",
            examples: [
              ["① わたしは イタリア料理が 好きです。", "Saya suka masakan Italia."],
              ["② わたしは 日本語が わかります。", "Saya mengerti bahasa Jepang."],
              ["③ わたしは 車が あります。", "Saya mempunyai mobil."],
            ],
          },
        ],
      },
      {
        title: "どんな Kata Benda",
        blocks: [
          {
            text: "Cara menjawab untuk kalimat tanya dengan menggunakan どんな, selain cara menjawab yang telah dipelajari pada Pelajaran 8, dapat dijawab juga dengan memberikan nama secara kongkret.",
            examples: [["④ どんな スポーツが 好きですか。<br>……サッカーが 好きです。", "Suka olahraga apa?<br>……Suka sepak bola."]],
          },
        ],
      },
      {
        title: "よく／だいたい／たくさん／少し／あまり／全然",
        blocks: [
          {
            text: "Kata Keterangan tersebut di atas diletakkan di depan Kata Kerja yang diterangkannya.",
            table: {
              headers: ["Kata Keterangan tingkat", "Kata Keterangan kuantitas"],
              rows: [
                ["digunakan dengan<br>kalimat positif", "よく　わかります<br>だいたい　わかります<br>すこし　わかります", "たくさん　あります<br>すこし　あります"],
                ["digunakan dengan<br>kalimat negatif", "あまり　わかりません<br>ぜんぜん　わかりません", "あまり　ありません<br>ぜんぜん　ありません"],
              ],
            },
            examples: [
              ["⑤ 英語が よく わかります。", "Mengerti bahasa Inggris dengan baik."],
              ["⑥ 英語が 少し わかります。", "Mengerti bahasa Inggris sedikit."],
              ["⑦ 英語が あまり わかりません。", "Tidak begitu mengerti bahasa Inggris."],
              ["⑧ お金が たくさん あります。", "Uang ada banyak."],
              ["⑨ お金が 全然 ありません。", "Uang tidak ada sama sekali."],
            ],
          },
          {
            label: "[Perhatian]",
            text: "すこし, ぜんぜん dan あまり juga dapat menerangkan Kata Sifat.",
            examples: [
              ["⑩ ここは 少し 寒いです。", "Di sini sedikit dingin."],
              ["⑪ あの 映画は 全然 おもしろくないです。", "Film itu tidak menarik sama sekali."],
            ],
          },
        ],
      },
      {
        title: "～から、～",
        blocks: [
          {
            text: "Hal yang dinyatakan di depan から merupakan alasan dari kalimat yang dinyatakan di belakangnya.",
            examples: [["⑫ 時間が ありませんから、新聞を 読みません。", "Karena tidak ada waktu, tidak membaca surat kabar."]],
          },
          {
            text: "Digunakan juga untuk menyatakan suatu hal dan alasan dengan memasukkan ～から.",
            examples: [["⑬ 毎朝 新聞を 読みますか。<br>……いいえ、読みません。時間が ありませんから。", "Apakah membaca surat kabar setiap pagi?<br>……Tidak, tidak membaca. Karena tidak ada waktu."]],
          },
        ],
      },
      {
        title: "どうして",
        blocks: [
          {
            text: "どうして adalah Kata Tanya untuk menanyakan alasan. Pada akhir kalimat dibubuhkan から untuk menyatakan alasannya.",
            examples: [["⑭ どうして 朝 新聞を 読みませんか。<br>……時間が ありませんから。", "Mengapa pada pagi hari tidak membaca surat kabar?<br>……Sebab tidak ada waktu."]],
          },
          {
            text: "Jika menanyakan alasan yang dikatakan oleh lawan bicara, dapat mengatakan どうしてですか untuk tidak menanyakan kata-kata yang dikatakan oleh lawan bicara.",
            examples: [["⑮ きょうは 早く 帰ります。<br>……どうしてですか。<br>子どもの 誕生日ですから。", "Hari ini cepat pulang.<br>……Mengapa?<br>Sebab hari ulang tahun anak."]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 9",
    focus: "Menyatakan kesukaan, kemampuan, keterangan tingkat, dan alasan.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Keberadaan benda dan makhluk",
    items: [
      {
        title: "Kata Benda が あります／います",
        blocks: [
          {
            text: "あります dan います menyatakan keberadaan benda atau orang. Kalimat ini adalah kalimat yang menggambarkan secara langsung untuk menyampaikan keberadaan benda atau orang, maka digunakan untuk menyatakan Kata Benda dengan membubuhkan partikel が.",
          },
          {
            label: "1) あります digunakan untuk menyatakan keberadaan benda atau tumbuhan dan lain-lainnya yang tidak bergerak dengan sendirinya.",
            examples: [
              ["① コンピューターが あります。", "Ada komputer."],
              ["② 桜が あります。", "Ada Sakura."],
              ["③ 公園が あります。", "Ada taman."],
            ],
          },
          {
            label: "2) います digunakan untuk benda atau orang yang bergerak dengan sendirinya.",
            examples: [
              ["④ 男の 人が います。", "Ada orang laki-laki."],
              ["⑤ 犬が います。", "Ada anjing."],
            ],
          },
        ],
      },
      {
        title: "Tempat に Kata Benda が あります／います",
        blocks: [
          {
            text: "Dengan menggunakan pola kalimat ini menyatakan keberadaan benda atau orang di suatu tempat.",
          },
          {
            label: "1) Tempat untuk keberadaan benda atau orang dinyatakan dengan partikel に.",
            examples: [
              ["⑥ わたしの 部屋に 机が あります。", "Di kamar saya ada meja."],
              ["⑦ 事務所に ミラーさんが います。", "Di kantor ada Sdr. Miller."],
            ],
          },
          {
            label: "2) Kata Tanya なに digunakan untuk menanyakan benda atau orang yang berada, dan Kata Tanya だれ digunakan untuk menanyakan keberadaan orang.",
            examples: [
              ["⑧ 地下に 何が ありますか。<br>……レストランが あります。", "Di lantai basement ada apa?<br>……Ada restoran."],
              ["⑨ 受付に だれが いますか。<br>……木村さんが います。", "Di resepsionis ada siapa?<br>……Ada Sdr. Kimura."],
            ],
            note: "[Perhatian] Tidak terbatas contoh di atas ini, perlu hati-hati bahwa partikel di belakang Kata Tanya adalah が.（×なには　×だれは）.",
          },
        ],
      },
      {
        title: "Kata Benda は tempat に あります／います",
        blocks: [
          {
            text: "Ini adalah kalimat yang menyatakan keberadaan suatu benda dari 2.tempat に Kata Benda が あります／います yang dijadikan topik. Di belakang Kata Benda digunakan は yang diletakkan di paling depan dalam kalimat. Kata Benda adalah hal yang telah diakui oleh kedua belah pihak yaitu si pembicara dan lawan bicara.",
            examples: [
              ["⑩ 東京ディズニーランドは 千葉県に あります。", "Tokyo Disneyland terletak di prefektur Chiba."],
              ["⑪ ミラーさんは 事務所に います。", "Sdr. Miller ada di kantor."],
              ["⑫ 東京ディズニーランドは どこに ありますか。<br>……千葉県に あります。", "Tokyo Disneyland terletak di mana?<br>……Terletak di prefektur Chiba."],
              ["⑬ ミラーさんは どこに いますか。<br>……事務所に います。", "Sdr. Miller ada di mana?<br>……Ada di kantor."],
            ],
          },
          {
            label: "[Perhatian]",
            text: "Pola kalimat ini dapat diganti dengan Kata Benda は tempat です (Pel.3). Untuk ini, perlu hati-hati bahwa di belakang Kata Tanya yang menunjukkan tempat（どこ）dan Kata Benda（ちばけん）tidak dibubuhkan に.",
            examples: [["⑭ 東京ディズニーランドは どこですか。<br>……千葉県です。", "Di mana Tokyo Disneyland?<br>……Di prefektur Chiba."]],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub>（benda/orang/tempat）の Kata Benda<sub>2</sub>（posisi）",
        blocks: [
          {
            text: "うえ, した, まえ, うしろ, みぎ, ひだり, なか, そと, となり, ちかく, あいだ dan lain-lainnya menunjukkan hubungan posisi antara Kata Benda<sub>1</sub> dan Kata Benda<sub>2</sub>.",
            examples: [
              ["⑮ 机の 上に 写真が あります。", "Di atas meja ada foto."],
              ["⑯ 郵便局は 銀行の 隣に あります。", "Kantor pos ada di sebelah bank."],
              ["⑰ 本屋は 花屋と スーパーの 間に あります。", "Toko buku ada di antara toko bunga dan pasar swalayan."],
            ],
          },
          {
            label: "[Perhatian]",
            text: "Yang disebut di atas, sama halnya seperti Kata Benda yang menunjukkan tempat, dapat menunjukkan tempat aksi dengan dibubuhkan partikel で.",
            examples: [["⑱ 駅の 近くで 友達に 会いました。", "Di dekat stasiun, bertemu dengan teman."]],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub> や Kata Benda<sub>2</sub>",
        blocks: [
          {
            text: "Partikel と yang telah dipelajari di Pelajaran 4 digunakan untuk menyebutkan semua Kata Benda secara setara, sedangkan partikel や mengambil beberapa hal saja yang mewakili (lebih dari dua) untuk menyebutkannya secara setara. Adakalanya untuk menyatakan bahwa masih ada Kata Benda yang tidak disebutkan secara jelas, dengan membubuhkan など di belakang Kata Benda yang disebut terakhir.",
            examples: [
              ["⑲ 箱の 中に 手紙や 写真が あります。", "Di dalam kotak ada surat dan foto."],
              ["⑳ 箱の 中に 手紙や 写真などが あります。", "Di dalam kotak ada surat, foto dan lain-lainnya."],
            ],
          },
        ],
      },
      {
        title: "アジアストアですか",
        blocks: [
          {
            text: "Pada bagian awal percakapan di pelajaran ini terdapat percakapan sebagai berikut:",
            examples: [["㉑ すみません。アジアストアは どこですか。<br>……アジアストアですか。（中略）あの ビルの 中です。", "Maaf. Di mana Asia Store?<br>……Asia Store? (disingkat) Di dalam gedung itu."]],
          },
          {
            text: "Dalam percakapan praktek sering kali lawan bicara tidak langsung menjawab terhadap pertanyaan, tetapi menjawab setelah menegaskan inti pertanyaan si pembicara.",
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 10",
    focus: "Menjelaskan keberadaan dan posisi benda, orang, serta hewan.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Bilangan dan cara menghitung",
    items: [
      {
        title: "Cara menghitung kuantitas",
        noBox: true,
        blocks: [
          {
            label: "1) Cara menghitung 1 sampai dengan 10 ひとつ, ふたつ, ……とお",
            text: "Cara menghitung di atas ini adalah cara untuk menghitung benda. Untuk 11 ke atas digunakan angka itu sendiri.",
          },
          {
            label: "2) Berbagai Kata Bantu Bilangan",
            text: "Waktu menghitung orang, benda atau menunjukkan kwantitas digunakan Kata Bantu Bilangan yang berbeda-beda sesuai dengan benda yang dihitung. Kata Bantu Bilangan dibubuhkan di belakang angka.<br>－人　jumlah orang (dengan catatan untuk seorang dibaca dengan ひとり（1人）, dua orang dibaca dengan ふたり（2人）, 4人 dibacanya よにん)<br>－台　mesin, kendaraan<br>－枚　benda yang tipis dan datar (kertas, baju kaos, piring, CD dll.)<br>－回　kali<br>－分　menit<br>－時間　jam<br>－日　hari<br>（Sama dengan cara membaca tanggal, tetapi 1日 tidak dibaca ついたち melainkan いちにち.）<br>－週間　minggu<br>－か月　bulan<br>－年　tahun",
          },
        ],
      },
      {
        title: "Cara penggunaan Kata Keterangan Bilangan",
        noBox: true,
        blocks: [
          {
            label: "1) Kata Keterangan Bilangan (angka yang dibubuhkan Kata Bantu Bilangan) pada dasarnya diletakkan langsung di belakang Kata Benda yang menentukan jenis Kata Keterangan Bilangan + partikel. Kecuali untuk Kata Keterangan Bilangan yang menunjukkan lama waktu tidak harus mengikuti aturan susunan kata ini.",
            examples: [
              ["① りんごを 4つ 買いました。", "Membeli empat buah apel."],
              ["② 外国人の 学生が 2人 います。", "Ada dua orang mahasiswa asing."],
              ["③ 国で 2か月 日本語を 勉強しました。", "Belajar bahasa Jepang di negara saya selama dua bulan."],
            ],
          },
          {
            label: "2) Cara menanyakan kuantitas",
          },
          {
            label: "(1) いくつ",
            text: "いくつ digunakan untuk menghitung kuantitas benda dengan menggunakan cara menghitung 1-1).",
            examples: [["④ みかんを いくつ 買いましたか。<br>……8つ 買いました。", "Membeli berapa buah jeruk?<br>……Membeli delapan buah."]],
          },
          {
            label: "(2) なん＋Kata Bantu Bilangan",
            text: "なん＋Kata Bantu Bilangan digunakan untuk menghitung kuantitas benda yang dibubuhkan Kata Bantu Bilangan seperti 1-2).",
            examples: [
              ["⑤ この 会社に 外国人が 何人 いますか。<br>……5人 います。", "Di perusahaan ini ada berapa orang asing?<br>……Ada lima orang."],
              ["⑥ 毎晩 何時間 日本語を 勉強しますか。<br>……2時間 勉強します。", "Setiap malam berapa jam belajar bahasa Jepang?<br>……Belajar dua jam."],
            ],
          },
          {
            label: "(3) どのくらい",
            text: "どのくらい digunakan untuk menanyakan lama waktu.",
            examples: [
              ["⑦ どのくらい 日本語を 勉強しましたか。<br>……3年 勉強しました。", "Berapa lama belajar bahasa Jepang?<br>……Belajar selama tiga tahun."],
              ["⑧ 大阪から 東京まで どのくらい かかりますか。<br>……新幹線で 2時間半 かかります。", "Memerlukan waktu berapa lama dari Osaka sampai dengan Tokyo?<br>……Memerlukan waktu dua setengah jam dengan Shinkansen."],
            ],
          },
          {
            label: "3) ～ぐらい",
            text: "ぐらい mengikuti Kata Keterangan Bilangan dan menunjukkan perkiraan jumlah.",
            examples: [
              ["⑨ 学校に 先生が 30人ぐらい います。", "Di sekolah ada kira-kira tiga puluh orang guru."],
              ["⑩ 15分ぐらい かかります。", "Memerlukan waktu kira-kira lima belas menit."],
            ],
          },
        ],
      },
      {
        title: "Kata Keterangan Bilangan（jangka waktu）に －回 Kata Kerja",
        blocks: [
          {
            text: "Ekspresi untuk menunjukkan frekuensi.",
            examples: [["⑪ 1か月に 2回 映画を 見ます。", "Sebulan dua kali menonton film."]],
          },
        ],
      },
      {
        title: "Kata Keterangan Bilangan だけ／ Kata Bend だけ",
        blocks: [
          {
            text: "だけ diletakkan di belakang Kata Keterangan Bilangan atau Kata Benda, yang mempunyai arti tidak ada yang lebih dari itu atau tidak ada selain itu.",
            examples: [
              ["⑫ パワー電気に 外国人の 社員が 1人だけ います。", "Di Power Elektronik hanya ada seorang pegawai orang asing."],
              ["⑬ 休みは 日曜日だけです。", "Hari libur hanya hari Minggu saja."],
            ],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 11",
    focus: "Menghitung benda, orang, dan waktu dengan Kata Bantu Bilangan yang tepat, serta menanyakan dan menyatakan jumlah dan frekuensi.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Waktu lampau, perbandingan, dan superlatif",
    items: [
      {
        title: "Waktu Positif/Negatif untuk Kalimat Nominal・Kalimat Adjektival な",
        blocks: [
          {
            table: {
              headers: ["Waktu non lampau<br>(Sekarang dan masa depan)", "Waktu lampau"],
              rows: [
                ["Positif", "Kata Benda　あめです<br>Kata Sifat な　しずかです", "Kata Benda　あめでした<br>Kata Sifat な　しずかでした"],
                ["Negatif", "Kata Benda　あめじゃ（では）ありません<br>Kata Sifat な　しずかじゃ（では）ありません", "Kata Benda　あめじゃ（では）ありませんでした<br>Kata Sifat な　しずかじゃ（では）ありませんでした"],
              ],
            },
            examples: [
              ["① きのうは 雨でした。", "Kemarin hujan."],
              ["② きのうの 試験は 簡単じゃ ありませんでした。", "Ujian kemarin tidak mudah."],
            ],
          },
        ],
      },
      {
        title: "Waktu Positif/Negatif untuk Kalimat Adjektival い",
        blocks: [
          {
            table: {
              headers: ["Waktu non lampau<br>(Sekarang dan masa depan)", "Waktu lampau"],
              rows: [
                ["Positif", "あついです", "あつかったです"],
                ["Negatif", "あつくないです", "あつくなかったです"],
              ],
            },
            examples: [
              ["③ きのうは 暑かったです。", "Kemarin panas."],
              ["④ きのうの パーティーは あまり 楽しくなかったです。", "Pesta kemarin tidak begitu menyenangkan."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub> は Kata Benda<sub>2</sub> より Kata Sifat です",
        blocks: [
          {
            text: "Menyatakan sifat atau kondisi Kata Benda<sub>1</sub> dengan Kata Benda<sub>2</sub> yang dianggap sebagai patokan.",
            examples: [["⑤ この 車は あの 車より 大きいです。", "Mobil ini lebih besar daripada mobil itu."]],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub> と Kata Benda<sub>2</sub> と どちらが Kata Sifat ですか<br>……Kata Benda<sub>1</sub>/Kata Benda<sub>2</sub> の ほうが Kata Sifat です",
        blocks: [
          {
            text: "Jika membandingkan dua benda, digunakan Kata Tanya どちら untuk seluruh benda yang dibandingkan.",
            examples: [
              ["⑥ サッカーと 野球と どちらが おもしろいですか。<br>……サッカーの ほうが おもしろいです。", "Yang mana lebih menarik, sepak bola atau baseball?<br>……Sepak bola yang lebih menarik."],
              ["⑦ ミラーさんと サントスさんと どちらが テニスが 上手ですか。", "Yang mana lebih pandai bermain tenis, Sdr. Miller atau Sdr. Santos?"],
              ["⑧ 北海道と 大阪と どちらが 涼しいですか。", "Yang mana lebih sejuk, Hokkaido atau Osaka?"],
              ["⑨ 春と 秋と どちらが 好きですか。", "Yang mana lebih suka, musim semi atau musim gugur?"],
            ],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub>［の 中］で 何／どこ／だれ／いつ が いちばん Kata Sifat ですか<br>……Kata Benda<sub>2</sub> が いちばん Kata Sifat です",
        blocks: [
          {
            text: "で menunjukkan ruang lingkup. Jika menanyakan benda, tempat, orang atau waktu yang menunjukan kondisi dan sifat yang tingkatnya maksimal dari ruang lingkup Kata Benda<sub>1</sub>, gunakan Kata Tanya sesuai dengan target.",
            examples: [
              ["⑩ 日本料理［の 中］で 何が いちばん おいしいですか。<br>……てんぷらが いちばん おいしいです。", "Apa yang paling enak [di antara] masakan Jepang?<br>……Tempura yang paling enak."],
              ["⑪ ヨーロッパで どこが いちばん よかったですか。<br>……スイスが いちばん よかったです。", "Daerah mana yang paling bagus di Eropa?<br>……Swiss yang paling bagus."],
              ["⑫ 家族で だれが いちばん 背が 高いですか。<br>……弟が いちばん 背が 高いです。", "Siapa yang paling tinggi di antara keluarga?<br>……Adik laki-laki yang paling tinggi. (Pel.16)"],
              ["⑬ 1年で いつが いちばん 寒いですか。<br>……2月が いちばん 寒いです。", "Kapan yang paling dingin dalam satu tahun?<br>……Bulan Februari yang paling dingin."],
            ],
          },
          {
            label: "[Perhatian]",
            text: "Kalimat Tanya yang menggunakan Kata Tanya yang menanyakan subjek dari kalimat adjektival, partikel が digunakan di belakang Kata Tanya (Lihat Pel.10).",
          },
        ],
      },
      {
        title: "Kata Sifat の",
        suffix: "（の yang berfungsi sebagai pengganti Kata Benda）",
        blocks: [
          {
            text: "Pada Pelajaran 2 telah dipelajari の dengan bentuk Kata Benda<sub>1</sub> の yang digunakan sebagai pengganti Kata Benda. Kata yang diberikan pada pelajaran ini, yaitu あついの adalah bentuk Kata Sifat の dan の yang menggantikan Kata Benda seperti sama halnya dengan Kata Benda<sub>1</sub> の.",
            examples: [["⑭ カリナさんの かばんは どれですか。<br>……あの 赤くて、大きいのです。", "Yang mana tas Sdr. Karina?<br>……Yang merah dan besar itu."]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 12",
    focus: "Menyatakan kejadian waktu lampau, membandingkan dua hal, menentukan yang paling unggul dalam suatu kelompok, dan memakai Kata Sifat の sebagai pengganti Kata Benda.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Keinginan dan tujuan kepergian",
    items: [
      {
        title: "Kata Benda が 欲しいです",
        blocks: [
          {
            text: "欲しい adalah Kata Sifat い. Objek untuk 欲しい ditunjuk dengan が.",
            examples: [
              ["① わたしは 友達が 欲しいです。", "Saya ingin punya teman."],
              ["② 今 何が いちばん 欲しいですか。<br>……車が 欲しいです。", "Sekarang apa yang paling diinginkan?<br>……Ingin punya mobil."],
              ["③ 子どもが 欲しいですか。<br>……いいえ、欲しくないです。", "Apakah ingin punya anak?<br>……Tidak, tidak ingin punya."],
            ],
          },
        ],
      },
      {
        title: "Kata Kerja（Bentuk ます）たいです",
        blocks: [
          {
            label: "1) Kata Kerja Bentuk ます",
            text: "Bentuk yang disambung pada ます（Contoh: かい dari かいます）disebut bentuk ます.",
          },
          {
            label: "2) Kata Kerja（Bentuk ます）たいです",
            text: "Kata Kerja（Bentuk ます）たいです digunakan untuk menunjukkan keinginan untuk berbuat sesuatu. Objek dari ～たい dapat ditunjuk dengan partikel を dan が juga. Perubahan bentuk ～たい sama dengan Kata Sifat い.",
            examples: [
              ["④ わたしは 沖縄へ 行きたいです。", "Saya ingin pergi ke Okinawa."],
              ["⑤ わたしは てんぷらを（が）食べたいです。", "Saya ingin makan Tempura."],
              ["⑥ 神戸で 何を（が）買いたいですか。<br>……靴を（が）買いたいです。", "Di Kobe ingin membeli apa?<br>……Ingin membeli sepatu."],
              ["⑦ おなかが 痛いですから、何も 食べたくないです。", "Karena perut sakit, tidak mau makan apa-apa. (Pel.17)"],
            ],
          },
          {
            label: "[Perhatian 1]",
            text: "Dengan ほしいです, たいです tidak dapat menyatakan keinginan dari pihak ketiga selain si pembicara dan lawan bicara.",
          },
          {
            label: "[Perhatian 2]",
            text: "ほしいですか, Kata Kerja（Bentuk ます）たいです tidak dapat digunakan pada situasi untuk menawarkan sesuatu kepada lawan bicara. Misalnya pada situasi untuk menawarkan kopi, tidak tepat jika mengatakan コーヒーが ほしいですか, コーヒーが のみたいですか. Untuk situasi tersebut digunakan ekspresi コーヒーは いかがですか, コーヒーを のみませんか dan sebagainya.",
          },
        ],
      },
      {
        title: "Kata Benda（tempat）へ｛Kata Kerja（Bentuk ます）／Kata Benda｝に 行きます／来ます／帰ります",
        blocks: [
          {
            text: "Objek untuk aksi dari いきます, きます, かえります ditunjuk dengan に.",
            examples: [["⑧ 神戸へ インド料理を 食べに 行きます。", "Pergi makan masakan India ke Kobe."]],
          },
          {
            text: "Jika Kata Kerja di depan に adalah Kata Kerja します（かいものします, べんきょうします）serta Kata Benda を します（おはなみを します, つりを します）, bentuk Kata Benda に いきます／きます／かえります yang digunakan.",
            examples: [
              ["⑨ 神戸へ 買い物に 行きます。", "Pergi ke Kobe untuk belanja."],
              ["⑩ 日本へ 美術の 勉強に 来ました。", "Datang ke Jepang untuk belajar seni."],
            ],
          },
          {
            label: "[Perhatian]",
            text: "Jika Kata Benda yang menunjukkan acara seperti perayaan, konser dan sebagainya, biasanya objek aksi dianggap untuk menonton perayaan atau mendengar konser.",
            examples: [["⑪ あした 京都の お祭りに 行きます。", "Besok pergi ke perayaan di Kyoto."]],
          },
        ],
      },
      {
        title: "どこか／何か",
        blocks: [
          {
            text: "どこか berarti suatu tempat, dan なにか berarti sesuatu. Partikel へ atau を di belakang どこか atau なにか dapat dihilangkan.",
            examples: [["⑫ 冬休みは どこか［へ］ 行きましたか。<br>……はい。北海道へ スキーに 行きました。", "Pada waktu liburan musim dingin pergi ke mana?<br>……Ya, pergi ke Hokkaido untuk bermain ski."]],
          },
          {
            label: "[Perhatian]",
            text: "Untuk kata-kata yang menunjukkan waktu dapat diangkat sebagai topik dengan dibubuhkan は.",
            examples: [["⑬ のどが かわきましたから、何か［を］ 飲みたいです。", "Karena haus, ingin minum sesuatu."]],
          },
        ],
      },
      {
        title: "ご～",
        blocks: [
          {
            text: "ご menunjukkan penghormatan.",
            examples: [["⑭ ご注文は？", "Mau pesan apa?"]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 13",
    focus: "Menyatakan keinginan memiliki benda atau melakukan sesuatu, serta menjelaskan tujuan bepergian ke suatu tempat.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Kelompok kata kerja dan bentuk te",
    items: [
      {
        title: "Kelompok Kata Kerja",
        noBox: true,
        blocks: [
          {
            text: "Kata Kerja bahasa Jepang mengalami perubahan bentuk, kemudian dapat dibuat berbagai maksud kalimat dengan dibubuhkan kata-kata yang mengikutinya pada bentuk konjugasi. Kata Kerja terbagi dalam tiga kelompok sesuai dengan cara konjugasi.",
          },
          {
            label: "1) Kata Kerja Kelompok I",
            text: "Kelompok ini, bunyi terakhir bentuk ます berakhir dengan bunyi pada kolom い.<br>Contoh: かきます　menulis, menggambar　のみます　minum",
          },
          {
            label: "2) Kata Kerja Kelompok II",
            text: "Hampir semua kata yang tergolong ke dalam kelompok ini, bunyi terakhir bentuk ます berakhir dengan bunyi pada kolom え, tetapi terdapat pula sebagiannya berakhir dengan bunyi pada kolom い.<br>Contoh: たべます　makan　みせます　memperlihatkan　みます　melihat, menonton",
          },
          {
            label: "3) Kata Kerja Kelompok III",
            text: "Kelompok ini します dan Kata Benda yang menunjukkan aksi＋します, serta きます.",
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk て",
        noBox: true,
        blocks: [
          {
            text: "Bentuk konjugasi yang berakhir dengan て atau で disebut bentuk て. Cara membuat bentuk て dari bentuk ます tergantung pada kelompok Kata Kerja, dan hasilnya sebagai berikut: (Lihat bagian Latihan A1 pada Pel.14 Buku Induk)",
          },
          {
            label: "1) Kata Kerja Kelompok I",
          },
          {
            text: "(1) Jika bunyi terakhir bentuk ます yang い, ち, り, maka い, ち, dan り perlu diganti dengan って.<br>Contoh: かいます → かって　membeli　まちます → まって　menunggu　かえります → かえって　pulang",
          },
          {
            text: "(2) Jika bunyi terakhir bentuk ます yang み, び, に, maka み, び, dan に perlu diganti dengan んで.<br>Contoh: のみます → のんで　minum　よびます → よんで　memanggil　しにます → しんで　meninggal",
          },
          {
            text: "(3) Jika bunyi terakhir bentuk ます yang き dan ぎ, maka masing-masing perlu diganti dengan いて dan いで.<br>Contoh: かきます → かいて　menulis, menggambar　いそぎます → いそいで　buru-buru<br>Dengan catatan いきます adalah pengecualian, karena itu berubah menjadi いって.",
          },
          {
            text: "(4) Jika bunyi terakhir bentuk ます yang し, dibubuhkan て pada bentuk ます.<br>Contoh: かします → かして　meminjamkan",
          },
          {
            label: "2) Kata Kerja Kelompok II",
            text: "Bubuhkan て pada bentuk ます.<br>Contoh: たべます → たべて　makan　みせます → みせて　memperlihatkan　みます → みて　melihat, menonton",
          },
          {
            label: "3) Kata Kerja Kelompok III",
            text: "Bubuhkan て pada bentuk ます.<br>Contoh: きます → きて　datang　します → して　melakukan　さんぽします → さんぽして　berjalan-jalan",
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk て ください",
        suffix: "Tolong......",
        blocks: [
          {
            text: "Pola kalimat ini dipakai untuk memerintah, meminta, dan menawarkan sesuatu kepada lawan bicara. Dengan catatan bahwa, pada umumnya dipakai bersama dengan すみませんが seperti contoh ① di bawah ini, sebab maksud permintaan dianggap kurang halus.",
            examples: [
              ["① すみませんが、この 漢字の 読み方を 教えて ください。", "Permisi, tolong ajarkan cara membaca Kanji ini. (permintaan)"],
              ["② ボールペンで 名前を 書いて ください。", "Tolong tuliskan nama dengan bolpoin. (perintah)"],
              ["③ どうぞ たくさん 食べて ください。", "Silakan makan banyak. (ajakan)"],
            ],
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk て います",
        blocks: [
          {
            text: "Pola kalimat ini menunjukkan suatu aksi yang sedang berlangsung.",
            examples: [
              ["④ ミラーさんは 今 電話を かけて います。", "Sdr. Miller sedang menelepon."],
              ["⑤ 今 雨が 降って いますか。<br>……はい、降って います。<br>……いいえ、降って いません。", "Sekarang hujan turun?<br>……Ya, hujan turun.<br>……Tidak, tidak turun hujan."],
            ],
          },
        ],
      },
      {
        title: "Kata Kerja（Bentuk ます）ましょうか",
        suffix: "Bagaimana kalau......?",
        blocks: [
          {
            text: "Ini adalah ekspresi dari si pembicara menawarkan untuk melakukan sesuatu untuk lawan bicara.",
            examples: [
              ["⑥ あしたも 来ましょうか。<br>……ええ、10時に 来て ください。", "Bagaimana kalau saya besok juga datang?<br>……Ya, tolong datang pada pukul sepuluh."],
              ["⑦ 傘を 貸しましょうか。<br>……すみません。お願いします。", "Bagaimana kalau saya pinjamkan payung?<br>……Terima kasih. Tolong pinjamkan."],
              ["⑧ 荷物を 持ちましょうか。<br>……いいえ、けっこうです。", "Bagaimana kalau saya membawa barang?<br>……Tidak, terima kasih."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda が Kata Kerja",
        blocks: [
          {
            text: "Jika menyatakan suatu kejadian alam yang dirasakan dengan panca indera (mata, telinga dan lain-lain), atau menyampaikan peristiwa secara objektivitas, partikel が dipakai untuk subjek.",
            examples: [
              ["⑨ 雨が 降って います。", "Hujan turun."],
              ["⑩ ミラーさんが いませんね。", "Sdr. Miller tidak ada ya."],
            ],
          },
        ],
      },
      {
        title: "すみませんが",
        blocks: [
          {
            examples: [
              ["⑪ すみませんが、塩を 取って ください。", "Maaf, tolong ambilkan garam."],
              ["⑫ 失礼ですが、お名前は？", "Maaf, siapa namanya?"],
            ],
          },
          {
            text: "Jika が yang dipakai sebagai ekspresi awal pembicaraan seperti すみませんが atau しつれいですが, が tidak berarti paradoks melainkan dipakai sebagai pendahuluan.",
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 14",
    focus: "Mengenal kelompok kata kerja, membentuk dan menggunakan bentuk て untuk meminta, menawarkan, dan menyatakan aksi yang sedang berlangsung.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Izin, larangan, dan keadaan berlanjut",
    items: [
      {
        title: "Kata Kerja Bentuk ても いいですか",
        suffix: "Boleh......?",
        blocks: [
          {
            text: "Ini adalah ungkapan untuk meminta izin.",
            examples: [["① 写真を 撮っても いいですか。", "Boleh mengambil foto?"]],
          },
          {
            text: "Cara menjawab untuk permohonan izin dengan ekspresi di atas adalah contoh ② atau contoh ③ yang terdapat di bawah ini.<br>Secara khusus ada caranya untuk jika tidak memberi izin, dengan cara menjawab secara tidak langsung (②) dan memakai ekspresi larangan (③ serta melihat 2 di bawahnya). Adakalanya memberikan alasan juga untuk kedua-duanya.",
            examples: [
              ["② ここで たばこを 吸っても いいですか。<br>……ええ、［吸っても］ いいですよ。<br>……すみません、ちょっと……。のどが 痛いですから。", "Boleh merokok di sini?<br>……Ya, boleh [merokok].<br>……Maaf, tidak boleh. Sebab kerongkongan sakit. (Pel.17)"],
              ["③ ここで たばこを 吸っても いいですか。<br>……ええ、［吸っても］ いいですよ。<br>……いいえ、［吸っては］ いけません。禁煙ですから。", "Boleh merokok di sini?<br>……Ya, boleh [merokok].<br>……Tidak, tidak boleh [merokok]. Sebab dilarang merokok di sini."],
            ],
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk ては いけません",
        suffix: "Tidak boleh......",
        blocks: [
          {
            text: "Ekspresi ini menunjukkan arti larangan.",
            examples: [["④ ここで たばこを 吸っては いけません。禁煙ですから。", "Tidak boleh merokok di sini. Sebab dilarang merokok."]],
          },
          {
            text: "Ekspresi ini tidak dapat dipakai oleh bawahan terhadap atasan.",
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk て います",
        blocks: [
          {
            text: "Dalam pola kalimat ini, selain cara penggunaan yang menunjukkan aksi yang sedang berlangsung yang telah dipelajari pada Pelajaran 14 terdapat cara penggunaan seperti di bawah ini.",
          },
          {
            label: "1) Menunjukkan keadaan（terutama dipakai Kata Kerja ～て います）",
            examples: [
              ["⑤ わたしは 結婚して います。", "Saya telah menikah."],
              ["⑥ わたしは 田中さんを 知って います。", "Saya kenal Sdr. Tanaka."],
              ["⑦ わたしは カメラを 持って います。", "Saya mempunyai kamera."],
              ["⑧ わたしは 大阪に 住んで います。", "Saya tinggal di Osaka."],
            ],
          },
          {
            label: "[Perhatian 1]",
            text: "Bentuk negatif dari しって います adalah しりません. Perlu hati-hati bahwa tidak dikatakan しって いません.",
            examples: [["⑨ 市役所の 電話番号を 知って いますか。<br>……はい、知って います。<br>……いいえ、知りません。", "Apakah tahu nomor telepon kantor wali kota?<br>……Ya, tahu.<br>……Tidak, tidak tahu."]],
          },
          {
            label: "[Perhatian 2]",
            text: "もって います mempunyai dua arti yaitu, sekarang memegang di tangan dan memiliki.",
          },
          {
            label: "2) Menunjukkan perbuatan dari kebiasan (aksi yang sama sedang berlangsung secara berulang-ulang dalam jangka waktu yang lama), atau pekerjaan dan status.",
            examples: [
              ["⑩ IMCは コンピューターソフトを 作って います。", "IMC memproduksi perangkat lunak komputer."],
              ["⑪ スーパーで ナンプラーを 売って います。", "Di pasar swalayan dijual kecap ikan."],
              ["⑫ ミラーさんは IMCで 働いて います。", "Sdr. Miller bekerja di IMC."],
              ["⑬ 妹は 大学で 勉強して います。", "Adik perempuan saya kuliah di universitas."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda に Kata Kerja",
        blocks: [
          {
            text: "Partikel に digunakan bersama dengan Kata Kerja seperti はいります, すわります, のります (naik Pel.16), のぼります (naik Pel.19), つきます (tiba Pel.25), kemudian menunjukkan hasil melakukan aksi dan tempat subjek berada.",
            examples: [
              ["⑭ ここに 入っては いけません。", "Tidak boleh masuk ke sini."],
              ["⑮ ここに 座っても いいですか。", "Boleh duduk di sini?"],
              ["⑯ 京都駅から 16番の バスに 乗って ください。", "Silakan naik bus nomor 16 dari stasiun Kyoto. (Pel.16)"],
            ],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub> に Kata Benda<sub>2</sub> を Kata Kerja",
        blocks: [
          {
            text: "Partikel に menunjukkan tempat Kata Benda<sub>2</sub> berada (Kata Benda<sub>1</sub>) akibat dari melakukan aksi.",
            examples: [["⑰ ここに 車を 止めて ください。", "Hentikan mobil di sini."]],
          },
          {
            text: "に dari ⑱ juga memiliki fungsi yang sama.",
            examples: [["⑱ ここに 住所を 書いて ください。", "Tuliskan alamat di sini."]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 15",
    focus: "Meminta dan memberi izin, menyatakan larangan, serta menjelaskan keadaan dan kebiasaan dengan bentuk て います.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Menyambung kalimat dan menunjuk pilihan",
    items: [
      {
        title: "Cara menyambung kalimat yang lebih dari dua",
        noBox: true,
        blocks: [
          {
            text: "Dengan memakai ～て（～で）dapat menyambung kalimat yang lebih dari dua menjadi satu kalimat.",
          },
          {
            label: "1) Kata Kerja Bentuk て<sub>1</sub>、［Kata Kerja Bentuk て<sub>2</sub>、］Kata Kerja<sub>3</sub>",
            text: "Apabila menyatakan lebih dari dua aksi yang berturut-turut, menyebutkan aksi tersebut sesuai dengan urutannya dengan menggunakan bentuk て. Waktu ditentukan dengan Kata Kerja yang terakhir.",
            examples: [
              ["① 朝 ジョギングを して、シャワーを 浴びて、会社へ 行きます。", "Pagi hari joging, mandi, kemudian pergi ke perusahaan."],
              ["② 神戸へ 行って、映画を 見て、お茶を 飲みました。", "Pergi ke Kobe, menonton film, kemudian minum teh."],
            ],
          },
          {
            label: "2) Kata Sifat い（～い）→ ～くて",
            text: "おおきーい → おおきーくて　besar<br>ちいさーい → ちいさーくて　kecil<br>いーい → 　よーくて（pengecualian）　baik, bagus",
            examples: [
              ["③ ミラーさんは 若くて、元気です。", "Sdr. Miller muda dan sehat."],
              ["④ きのうは 天気が よくて、暑かったです。", "Kemarin cuaca baik dan panas."],
            ],
          },
          {
            label: "3) Kata Sifat な［な］→ ～で",
            examples: [
              ["⑤ ミラーさんは ハンサムで、親切です。", "Sdr. Miller ganteng dan baik hati."],
              ["⑥ 奈良は 静かで、きれいな 町です。", "Nara adalah kota yang tenang dan indah."],
            ],
            note: "[Perhatian] Jika memakai ～て（～で）untuk menyambung Kata sifat yang bersubjek yang sama, tidak dapat menyambungkan kalimat yang nilai pembicaranya berbeda. Dalam hal itu, menggunakan が (Lihat Pel.8-4).<br>×この 部屋は 狭くて、きれいです。<br>○この 部屋は 狭いですが、きれいです。　Kamar ini sempit, tetapi bersih.",
          },
          {
            label: "4) Kata Benda で",
            examples: [
              ["⑦ カリナさんは インドネシア人で、富士大学の 留学生です。", "Sdr. Karina adalah orang Indonesia dan pelajar asing dari Universitas Fuji."],
              ["⑧ カリナさんは 学生で、マリアさんは 主婦です。", "Sdr. Karina adalah mahasiswa, sedangkan Sdr. Maria adalah ibu rumah tangga."],
            ],
          },
        ],
      },
      {
        title: "Kata Kerja<sub>1</sub> Bentuk てから、Kata Kerja<sub>2</sub>",
        blocks: [
          {
            text: "Pola kalimat ini menunjukkan bahwa Kata Kerja<sub>2</sub> dilakukan setelah Kata Kerja<sub>1</sub>. Oleh karena itu, pada umumnya dengan Kata Kerja<sub>1</sub> dikatakan prasyarat sebagai persiapan untuk melakukan Kata Kerja<sub>2</sub>. Waktu ditentukan oleh waktu Kata Kerja terakhir.",
            examples: [["⑨ お金を 入れてから、ボタンを 押して ください。", "Tekanlah tombol setelah memasukkan uang."]],
          },
          {
            text: "Dengan catatan bahwa subjek untuk Kata Kerja Bentuk てから ditunjukkan dengan partikel が.",
            examples: [["⑩ もう 昼ごはんを 食べましたか。<br>……この 仕事が 終わってから、食べます。", "Sudah makan siang?<br>……Setelah selesai pekerjaan ini, baru mau makan."]],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub> は Kata Benda<sub>2</sub> が Kata Sifat",
        blocks: [
          {
            text: "Pola kalimat ini menunjukkan bahwa topik (Kata Benda<sub>1</sub>) mempunyai sifat 'Kata Benda<sub>2</sub> が Kata Sifat'.",
            examples: [
              ["⑪ 大阪は 食べ物が おいしいです。", "Osaka makanannya enak."],
              ["⑫ ドイツの フランケンは ワインが 有名です。", "Franken di Jerman anggurnya terkenal."],
              ["⑬ マリアさんは 髪が 長いです。", "Sdr. Maria rambutnya panjang."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda を Kata Kerja",
        blocks: [
          {
            text: "Kata Kerja でます, おります dan lain-lainnya digunakan bersama dengan partikel を. を ini menunjukkan titik awal atau titik keberangkatan.",
            examples: [
              ["⑭ 7時に うちを 出ます。", "Pada pukul tujuh keluar dari rumah."],
              ["⑮ 梅田で 電車を 降りました。", "Turun kereta rel listrik di Umeda."],
            ],
          },
        ],
      },
      {
        title: "どうやって",
        blocks: [
          {
            text: "どうやって dipakai untuk menanyakan cara pergi ke suatu tempat atau cara untuk melakukan sesuatu.",
            examples: [["⑯ 大学まで どうやって 行きますか。<br>……京都駅から 16番の バスに 乗って、大学前で 降ります。", "Bagaimana caranya pergi ke universitas?<br>……Dari stasiun Kyoto, naik bus nomor 16, dan turun di Daigakumae."]],
          },
        ],
      },
      {
        title: "どれ／どの Kata Benda",
        blocks: [
          {
            text: "どれ adalah Kata Tanya untuk meminta untuk menuntukan satu dari lebih dari tiga macam pilihan yang ditunjukkan secara konkret.",
            examples: [["⑰ ミラーさんの 傘は どれですか。<br>……あの 青い 傘です。", "Yang mana payung Sdr. Miller?<br>……Payung yang biru itu."]],
          },
          {
            text: "どれ tidak dapat digunakan dengan Kata Benda secara langsung. Ketika menerangkan Kata Benda digunakan どの.",
            examples: [["⑱ サントスさんは どの 人ですか。<br>……あの 背が 高くて、髪が 黒い 人です。", "Sdr. Santos orangnya yang mana?<br>……Orang yang badannya tinggi, dan rambutnya hitam."]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 16",
    focus: "Menyambung beberapa kalimat menjadi satu, menjelaskan sifat topik, serta menanyakan cara dan menunjuk pilihan dari beberapa benda.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Bentuk ない dan cara memerintah",
    items: [
      {
        title: "Kata Kerja Bentuk ない",
        noBox: true,
        blocks: [
          {
            text: "Bentuk yang disambung pada ない（Contoh: かか dari かかない）disebut bentuk ない. Sesuai dengan kelompok Kata Kerja, cara membuat bentuk ない dari bentuk ます adalah sebagai berikut: (Lihat Buku Induk Pel.17 Latihan A1.)",
          },
          {
            label: "1) Kata Kerja Kelompok I",
            text: "Bunyi terakhir bentuk ます adalah bunyi kolom い, maka い diganti dengan bunyi kolom あ. Dengan catatan bahwa untuk Kata Kerja bentuk ます yang bunyi terakhirnya bunyi い sebagai vokal（かいます、あいます dan lain-lain）tidak diganti dengan あ melainkan わ.<br>か<u>き</u>－ます　→　か<u>か</u>－ない　　　いそ<u>ぎ</u>－ます　→　いそ<u>が</u>－ない<br>よ<u>み</u>－ます　→　よ<u>ま</u>－ない　　　あそ<u>び</u>－ます　→　あそ<u>ば</u>－ない<br>と<u>り</u>－ます　→　と<u>ら</u>－ない　　　ま<u>ち</u>－ます　→　ま<u>た</u>－ない<br>す<u>い</u>－ます　→　す<u>わ</u>－ない　　　はな<u>し</u>－ます　→　はな<u>さ</u>－ない",
          },
          {
            label: "2) Kata Kerja Kelompok II",
            text: "Bentuknya sama dengan bentuk ます.<br>たべ－ます　→　たべ－ない<br>み－ます　→　み－ない",
          },
          {
            label: "3) Kata Kerja kelompok III",
            text: "べんきょうし－ます　→　べんきょうし－ない<br>し－ます　→　し－ない<br>き－ます　→　こ－ない",
          },
        ],
      },
      {
        title: "Kata Kerja（Bentuk ない）ないで ください",
        suffix: "Jangan......!",
        blocks: [
          {
            text: "Pola kalimat ini dipakai jika meminta atau memerintah kepada lawan bicara supaya tidak melakukan sesuatu hal.",
            examples: [["① ここで 写真を 撮らないで ください。", "Jangan mengambil foto di sini!"]],
          },
          {
            text: "Dapat menyatakan perhatian kepada lawan bicara untuk tidak perlu berbuat sesuatu hal.",
            examples: [["② わたしは 元気ですから、心配しないで ください。", "Karena saya sehat, jangan khawatir."]],
          },
        ],
      },
      {
        title: "Kata Kerja（Bentuk ない）なければ なりません",
        suffix: "Harus......",
        blocks: [
          {
            text: "Pola kalimat ini menunjukkan keharusan. Perlu hati-hati bahwa ini bukan kalimat negatif.",
            examples: [["③ 薬を 飲まなければ なりません。", "Harus minum obat."]],
          },
        ],
      },
      {
        title: "Kata Kerja（Bentuk ない）なくても いいです",
        suffix: "Tidak perlu......",
        blocks: [
          {
            text: "Pola kalimat ini menunjukkan bahwa tidak perlu melakukan sesuatu hal.",
            examples: [["④ あした 来なくても いいです。", "Besok tidak perlu datang."]],
          },
        ],
      },
      {
        title: "Pentopikan objek",
        noBox: true,
        blocks: [
          {
            text: "Jika menyatakan dengan objek langsung sebagai topik, maka partikel を dihilangkan kemudian membubuhkan partikel は, lalu diletakkan paling di depan dalam kalimat.",
            examples: [
              ["ここに　荷物を　置かないで　ください。", "Jangan letakkan barang di sini."],
              ["荷物<span style=\"font-size:.65em\">を</span>は　ここに　置かないで　ください。", ""],
              ["⑤　荷物<u>は</u>　　ここに　置かないで　ください。", "Barangnya jangan diletakkan di sini."],
              ["会社の　食堂で　昼ごはんを　食べます。", "Makan siang di kantin perusahaan."],
              ["昼ごはん<span style=\"font-size:.65em\">を</span>は　会社の　食堂で　食べます。", ""],
              ["⑥　昼ごはん<u>は</u>　　会社の　食堂で　食べます。", "Makan siangnya makan di kantin perusahaan."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda（waktu）までに Kata Kerja",
        blocks: [
          {
            text: "Menunjukkan batas waktu aksi atau peristiwa.",
            examples: [
              ["⑦ 会議は 5時までに 終わります。", "Rapat selesai sebelum pukul lima."],
              ["⑧ 土曜日までに 本を 返さなければ なりません。", "Mengembalikan buku sampai dengan hari Sabtu."],
            ],
          },
          {
            note: "[Perhatian] Partikel まで yang telah dipelajari pada Pelajaran 4 menunjukkan titik akhir aksi yang sedang berlangsung. Perlu hati-hati sebab bentuknya mirip.",
          },
          {
            examples: [["⑨ 5時まで 働きます。", "Bekerja sampai pukul lima."]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 17",
    focus: "Membentuk kata kerja bentuk ない untuk melarang, mewajibkan, dan membebaskan dari kewajiban, serta menopikkan objek dan menyatakan batas waktu.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Bentuk kamus dan kemampuan",
    items: [
      {
        title: "Kata Kerja Bentuk Kamus",
        noBox: true,
        blocks: [
          {
            text: "Ini adalah bentuk dasar Kata Kerja yang disajikan di kamus. Sesuai dengan kelompok Kata Kerja, cara membuat bentuk kamus dari bentuk ます sebagai berikut: (Lihat Buku Induk Pel.18 Latihan A1.)",
          },
          {
            label: "1) Kata Kerja Kelompok I",
            text: "Bunyi terakhir bentuk ます adalah bunyi kolom い, maka ini diganti dengan bunyi kolom う.<br>か<u>き</u>－ます　→　か<u>く</u>　　　いそ<u>ぎ</u>－ます　→　いそ<u>ぐ</u><br>よ<u>み</u>－ます　→　よ<u>む</u>　　　あそ<u>び</u>－ます　→　あそ<u>ぶ</u><br>と<u>り</u>－ます　→　と<u>る</u>　　　ま<u>ち</u>－ます　→　ま<u>つ</u><br>す<u>い</u>－ます　→　す<u>う</u>　　　はな<u>し</u>－ます　→　はな<u>す</u>",
          },
          {
            label: "2) Kata Kerja Kelompok II",
            text: "Membubuhkan る pada bentuk ます.<br>たべ－ます　→　たべ－る<br>み－ます　→　み－る",
          },
          {
            label: "3) Kata Kerja Kelompok III",
            text: "Bentuk kamus します adalah する, sedangkan bentuk kamus きます adalah くる.",
          },
        ],
      },
      {
        title: "Kata Benda<br>Kata Kerja Bentuk Kamus こと｝　が できます",
        suffix: "Dapat......",
        blocks: [
          {
            text: "できます adalah Kata Kerja yang menunjukkan hal yang dapat dilakukan atas kemampuan yang dimiliki orang itu, atau aksi yang memungkinkan dengan kondisi itu. Objek untuk できます ditunjuk dengan が, dan isi kemampuan atau kemungkinan ditunjuk dengan Kata Benda atau Kata Kerja Bentuk Kamus こと.",
          },
          {
            label: "1) Untuk Kata Benda",
            text: "Dipakai Kata Benda yang bersifat aksi（うんてん、かいもの、スキー、ダンス）。Kemudian digunakan juga Kata Benda seperti にほんご、atau ピアノ yang menunjukkan ketrampilan.",
            examples: [
              ["① ミラーさんは 日本語が できます。", "Sdr. Miller bisa berbahasa Jepang."],
              ["② 雪が たくさん 降りましたから、ことしは スキーが できます。", "Karena salju turun banyak, tahun ini dapat bermain ski."],
            ],
          },
          {
            label: "2) Untuk Kata Kerja",
            text: "Jika mengatakan dapat melakukan suatu perbuatan, maka bentuk frase Kata Benda dengan membubuhkan こと pada Kata Kerja Bentuk Kamus, kemudian dilanjutkan dengan が できます di belakangnya.",
            examples: [
              ["③ ミラーさんは <u>漢字を　読む</u>　ことが できます。<br><span class=\"grammar-annotation\">　　　　　（frase Kata Benda）</span>", "Sdr. Miller bisa membaca <i>Kanji</i>."],
              ["④ <u>カードで　払う</u>　ことが できます。<br><span class=\"grammar-annotation\">（frase Kata Benda）</span>", "Dapat membayar dengan kartu."],
            ],
          },
        ],
      },
      {
        title: "わたしの　趣味は｛Kata Benda<br>Kata Kerja Bentuk Kamus　こと｝です",
        suffix: "Hobi saya adalah......",
        blocks: [
          {
            examples: [["⑤ わたしの 趣味は 音楽です。", "Hobi saya adalah musik."]],
          },
          {
            text: "Jika memakai Kata Kerja Bentuk Kamus こと maka dapat menunjukkan isi hobi lebih konkret.",
            examples: [["⑥ わたしの 趣味は 音楽を 聞く ことです。", "Hobi saya adalah mendengarkan musik."]],
          },
        ],
      },
      {
        title: "Kata Kerja<sub>1</sub> Bentuk Kamus<br>Kata Benda の<br>Kata Keterangan Bilangan（jangka waktu）｝　まえに、Kata Kerja<sub>2</sub>",
        suffix: "Sebelum......,<br>melakukan......",
        blocks: [
          {
            label: "1) Untuk Kata Kerja",
            text: "Menyatakan bahwa sebelum Kata Kerja<sub>1</sub>, terjadi Kata Kerja<sub>2</sub>. Perlu hati-hati bahwa jika waktu kalimat (waktu Kata Kerja<sub>2</sub>) menunjukkan waktu lampau atau juga menunjukkan waktu non lampau, maka Kata Kerja<sub>1</sub> selalu berbentuk Bentuk Kamus.",
            examples: [
              ["⑦ 日本へ 来る まえに、日本語を 勉強しました。", "Sebelum datang di Jepang, belajar bahasa Jepang."],
              ["⑧ 寝る まえに、本を 読みます。", "Sebelum tidur, membaca buku."],
            ],
          },
          {
            label: "2) Untuk Kata Benda",
            text: "Di belakang Kata Benda membubuhkan の. Menggunakan Kata Benda yang bersifat aksi.",
            examples: [["⑨ 食事の まえに、手を 洗います。", "Sebelum makan mencuci tangan."]],
          },
          {
            label: "3) Untuk Kata Keterangan Bilangan (jangka waktu)",
            text: "Perlu hati-hati bahwa di belakang Kata Keterangan Bilangan (jangka waktu) tidak membubuhkan の.",
            examples: [["⑩ 田中さんは 1時間まえに、出かけました。", "Sdr. Tanaka telah keluar sejam yang lalu."]],
          },
        ],
      },
      {
        title: "なかなか",
        blocks: [
          {
            text: "なかなか menyertai ekspresi negatif di belakangnya, dan menunjukkan arti yang tidak mudah untuk melakukan atau tidak dapat melakukan sebagaimana apa yang diharapkan.",
            examples: [["⑪ 日本では なかなか 馬を 見る ことが できません。", "Di Jepang tidak mudah untuk melihat kuda."]],
            note: "[Perhatian] Contoh kalimat ⑪ (Lihat Buku Induk Pel.18 Percakapan) adalah kalimat yang kata にほんで dijadikan sebagai topik. Dengan demikian, Kata Benda yang dibubuhkan で dijadikan sebagai topik, maka Kata Benda berbentuk Kata Benda では (Lihat Kolom 1 mengenai contoh yang berpartikel selain が dan を yang dijadikan sebagai topik).",
          },
        ],
      },
      {
        title: "ぜひ",
        blocks: [
          {
            text: "Dipakai bersama dengan ekspresi yang menunjukkan harapan si pembicara, dan berfungsi untuk menekankannya.",
            examples: [
              ["⑫ ぜひ 北海道へ 行きたいです。", "Ingin sekali pergi ke Hokkaido."],
              ["⑬ ぜひ 遊びに 来て ください。", "Sungguh diharapkan untuk datang bermain."],
            ],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 18",
    focus: "Membentuk kata kerja bentuk kamus untuk menyatakan kemampuan, hobi, dan urutan waktu, serta menekankan harapan dan kesulitan melakukan sesuatu.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Pengalaman dan perubahan",
    items: [
      {
        title: "Kata Kerja Bentuk た",
        noBox: true,
        blocks: [
          {
            text: "Bentuk konjugasi Kata Kerja yang berakhir dengan た atau だ disebut bentuk た. Cara membuat bentuk た adalah て atau で dari bentuk て diubah menjadi た atau だ (Lihat Buku Induk Pel.19 Latihan A1).<br>Bentuk て　→　Bentuk た<br>かいて　→　かいた<br>のんで　→　のんだ<br>たべて　→　たべた<br>きて　→　きた<br>して　→　した",
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk た ことが あります",
        suffix: "Pernah......",
        blocks: [
          {
            examples: [["① 馬に 乗った ことが あります。", "Pernah berkuda."]],
          },
          {
            text: "Perlu hati-hati bahwa jika hanya menyatakan kenyataan pada waktu lampau sebagaimana pernah dilakukan suatu aksi pada suatu titik waktu lampau, memakai bentuk waktu lampau.",
            examples: [["② 去年 北海道で 馬に 乗りました。", "Tahun lalu berkuda di Hokkaido."]],
          },
        ],
      },
      {
        title: "Kata Kerja<sub>1</sub> Bentuk たり、Kata Kerja<sub>2</sub> Bentuk たり します",
        suffix: "Melakukan......,<br>melakukan......",
        blocks: [
          {
            text: "Jika mengangkat beberapa Kata Benda (lebih dari dua) yang mewakilinya secara paralel pada umumnya memakai partikel や, tetapi menyatakan dengan mengangkat beberapa aksi yang mewakilinya maka digunakan pola kalimat ini. Waktu ditunjukkan pada akhir kalimat.",
            examples: [
              ["③ 日曜日は テニスを したり、映画を 見たり します。", "Pada hari Minggu bermain tenis, dan menonton film."],
              ["④ 日曜日は テニスを したり、映画を 見たり しました。", "Pada hari Minggu yang lalu bermain tenis, dan menonton film."],
            ],
          },
          {
            note: "[Perhatian] Perlu hati-hati bahwa cara penggunaannya berbeda dengan Kata Kerja<sub>1</sub> Bentuk て、［Kata Kerja<sub>2</sub> Bentuk て、］Kata Kerja<sub>3</sub> yang telah dipelajari di Pelajaran 16. Kata Kerja<sub>1</sub> Bentuk て、［Kata Kerja<sub>2</sub> Bentuk て、］Kata Kerja<sub>3</sub> menyatakan aksi yang lebih dari dua yang terjadi secara berturut-turut sesuai dengan urutannya.",
          },
          {
            examples: [["⑤ 日曜日は テニスを して、映画を 見ました。", "Pada hari Minggu yang lalu, bermain tenis, kemudian menonton film."]],
          },
          {
            note: "Akan tetapi, tidak ada hubungan tentang waktu di antara aksi yang diangkat dengan Kata Kerja<sub>1</sub> Bentuk たり、Kata Kerja<sub>2</sub> Bentuk たり します. Dengan pola kalimat ini mengangkat aksi yang mewakilinya, maka tidak wajar untuk mengatakan hal-hal yang dilakukan setiap hari (bangun pagi, makan, tidur malam, dan lain-lain).",
          },
        ],
      },
      {
        title: "Kata Sifat い（～い）→　～く<br>Kata Sifat な［な］→　～に<br>Kata Benda に｝なります",
        suffix: "Menjadi......",
        blocks: [
          {
            text: "なります menunjuk perubahan kondisi.",
            examples: [
              ["⑥ 寒い　→　寒く なります", "menjadi dingin"],
              ["⑦ 元気［な］　→　元気に なります", "menjadi sehat"],
              ["⑧ 25歳　→　25歳に なります", "menjadi (umur) dua puluh lima tahun"],
            ],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 19",
    focus: "Menceritakan pengalaman dengan bentuk た, menyebutkan beberapa aksi yang mewakili, dan menyatakan perubahan kondisi.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Bentuk biasa",
    items: [
      {
        title: "Bentuk Sopan dan Bentuk Biasa",
        noBox: true,
        blocks: [
          {
            text: "Dalam bentuk kalimat bahasa Jepang terdapat dua jenis bentuk kalimat, yaitu bentuk halus dan bentuk biasa.",
            table: {
              headers: ["Bentuk Sopan", "Bentuk Biasa"],
              rows: [
                ["", "あした 東京へ 行きます。<br>Besok pergi ke Tokyo.", "あした 東京へ 行く。<br>Besok pergi ke Tokyo."],
                ["", "毎日 忙しいです。<br>Setiap hari sibuk.", "毎日 忙しい。<br>Setiap hari sibuk."],
                ["", "相撲が 好きです。<br>Suka sumo.", "相撲が 好きだ。<br>Suka sumo."],
                ["", "富士山に 登りたいです。<br>Ingin mendaki gunung Fuji.", "富士山に 登りたい。<br>Ingin mendaki gunung Fuji."],
                ["", "ドイツへ 行った ことが ありません。<br>Belum pernah pergi ke Jerman.", "ドイツへ 行った ことが ない。<br>Belum pernah pergi ke Jerman."],
              ],
            },
          },
          {
            text: "Bentuk yang diikuti です, ます disebut bentuk sopan, dan bentuk yang dipakai pada kalimat biasa disebut bentuk biasa (Lihat Buku Induk Pel.20 Latihan A1).",
          },
        ],
      },
      {
        title: "Pembagian cara pemakaian Bentuk Sopan dan Bentuk Biasa",
        noBox: true,
        blocks: [
          {
            label: "1) Percakapan",
            text: "Bentuk sopan dipakai untuk orang yang baru saja dikenal, atasan, atau orang yang tidak begitu akrab walaupun orang itu gerenasi yang sama. Sedangkan bentuk biasa dipakai untuk teman akrab, rekan, atau percakapan antara keluarga.<br>Jika memakai bentuk biasa kepada lawan bicara yang tidak tepat maka dianggap tidak sopan, karena itu perlu hati-hati kepada lawan bicara yang boleh atau tidak untuk memakai bentuk biasa.",
          },
          {
            label: "2) Ketika menulis",
            text: "Pada umumnya, surat tertulis dalam bentuk sopan. Untuk makalah, laporan, catatan harian dan lain-lainnya dipakai bentuk biasa.",
          },
        ],
      },
      {
        title: "Percakapan dalam Bentuk Biasa",
        noBox: true,
        blocks: [
          {
            label: "1)",
            text: "Dalam kalimat tanya dengan bentuk biasa, pada umumnya partikel か tidak dibubuhkan pada akhir kalimat, tetapi diungkapkan dengan nada yang naik seperti のむ（⤴）atau のんだ（⤴）.",
            examples: [["① コーヒーを 飲む？（⤴）<br>……うん、飲む。（⤵）", "Mau minum kopi?<br>……Ya, mau minum."]],
          },
          {
            label: "2)",
            text: "Dalam kalimat tanya dari Kata Benda atau Kata Sifat Bentuk な, bentuk biasa だ dari です dihilangkan. Untuk jawaban positif, kalau dijawab dengan bentuk だ memberi kesan yang kasar dan keras maka だ dihilangkan atau membubuhkan partikel penutup demi menghaluskan nada ungkapan.",
            examples: [["② 今晩 暇？<br>……うん、暇／暇だ／暇だよ。<br>……うん、暇／暇よ／暇だよ。<br>……ううん、暇じゃ ない。", "Nanti malam luang?<br>……Ya, luang. (digunakan oleh pria)<br>……Ya, luang. (digunakan oleh wanita)<br>……Tidak, tidak luang."]],
          },
          {
            label: "3)",
            text: "Dalam kalimat bentuk biasa, jika sudah dapat mengerti hubungan dari konteks kalimat sebelum dan sesudahnya, maka adakalanya partikel dihilangkan.",
            examples: [
              ["③ ごはん［を］ 食べる？", "Mau makan?"],
              ["④ あした 京都［へ］ 行かない？", "Bagaimana kalau besok ke Kyoto?"],
              ["⑤ この りんご［は］ おいしいね。", "Apel ini enak ya."],
              ["⑥ そこに はさみ［が］ ある？", "Di situ ada gunting?"],
            ],
            note: "Akan tetapi, partikel で、に、から、まで、と、dan sebagainya tidak dihilangkan sebab konteksnya menjadi tidak jelas.",
          },
          {
            label: "4)",
            text: "Dalam kalimat bentuk biasa, い dari Kata Kerja Bentuk て いる juga sering dihilangkan.",
            examples: [["⑦ 辞書、持って［い］る？<br>……うん、持って［い］る。<br>……ううん、持って［い］ない。", "Punya kamus?<br>……Ya, punya.<br>……Tidak, tidak punya."]],
          },
          {
            label: "5) けど",
            text: "けど mempunyai fungsi yang sama dengan が, dan sering digunakan dalam percakapan.",
            examples: [
              ["⑧ その カレー［は］ おいしい？<br>……うん、辛いけど、おいしい。", "Kare itu enak?<br>……Ya, pedas, tetapi enak."],
              ["⑨ 相撲の チケット［が］ あるけど、いっしょに 行かない？<br>……いいね。", "Punya tiket <i>sumo</i>, bagaimana kalau kita pergi sama-sama?<br>……Bagus ya."],
            ],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 20",
    focus: "Membedakan bentuk sopan dan bentuk biasa, serta memakai bentuk biasa dalam percakapan sehari-hari.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Gaya biasa dalam percakapan",
    items: [
      {
        title: "Bentuk Biasa と 思います",
        suffix: "Saya kira......",
        blocks: [
          {
            text: "Isi pikiran dan keputusan ditunjukan dengan memakai partikel と. Untuk pola kalimat ini terdapat penggunaan sebagai berikut di bawah ini:",
          },
          {
            label: "1) Menyatakan dugaan.",
            examples: [
              ["① あした 雨が 降ると 思います。", "Saya kira besok hujan turun."],
              ["② テレーザちゃんは もう 寝たと 思います。", "Saya kira Teresa sudah tidur."],
            ],
          },
          {
            text: "Jika isi dugaan bersifat negatif, bentuk negatif diletakkan di depan と.",
            examples: [["③ ミラーさんは この ニュースを 知って いますか。<br>……いいえ、知らないと 思います。", "Apakah Sdr. Miller tahu berita ini?<br>……Tidak, saya kira dia tidak tahu."]],
          },
          {
            label: "2) Menyatakan pendapat.",
            examples: [["④ 日本は 物価が 高いと 思います。", "Saya pikir Jepang harga barangnya mahal."]],
          },
          {
            text: "Jika menanyakan pendapat tentang sesuatu, memakai ekspresi ～に ついて どう おもいますか, dan tidak membubuhkan と di belakang どう.",
            examples: [["⑤ 新しい 空港に ついて どう 思いますか。<br>……きれいですが、ちょっと 交通が 不便だと 思います。", "Mengenai bandara baru, menurut Anda bagaimana?<br>……Bersih, tetapi lalu lintasnya kurang praktis."]],
          },
          {
            text: "Untuk menyatakan setuju atau tidak setuju terhadap pendapat orang lain sebagai berikut:",
            examples: [["⑥ ケータイは 便利ですね。<br>……わたしも そう 思います。", "HP itu praktis ya.<br>……Saya rasa begitu juga."]],
          },
        ],
      },
      {
        title: "“Kalimat”<br>Bentuk Biasa｝と 言います",
        suffix: "Mengatakan bahwa......",
        blocks: [
          {
            text: "Isi ucapan ditunjukkan dengan と. Caranya ada dua.",
          },
          {
            label: "1)",
            text: "Jika mengutip langsung, mengatakan kata yang dikutip seperti yang diucapkan tanpa diubah. Untuk menulis, kata tersebut dimasukkan ke dalam kurung「 」tanpa diubah.",
            examples: [
              ["⑦ 寝る まえに、「お休みなさい」と 言います。", "Sebelum tidur mengucapkan “Selamat tidur”."],
              ["⑧ ミラーさんは 「来週 東京へ 出張します」と 言いました。", "Sdr. Miller berkata “Minggu depan dinas ke Tokyo”."],
            ],
          },
          {
            label: "2)",
            text: "Jika mengungkapkan isi rangkuman yang disingkat oleh pengutip, sebelum と dipakai bentuk biasa.",
            examples: [["⑨ ミラーさんは 東京へ 出張すると 言いました。", "Sdr. Miller mengatakan bahwa dinas ke Tokyo."]],
          },
          {
            text: "Bagian ketipan tidak dipengaruhi waktu kalimat.<br>Lawan bicara yang mendengarkan ungkapan pembicara ditunjukan dengan partikel に.",
            examples: [["⑩ 父に 留学したいと 言いました。", "Saya berkata kepada ayah bahwa ingin belajar di luar negeri."]],
          },
        ],
      },
      {
        title: "Kata Kerja<br>Kata Sifat い｝Bentuk Biasa<br>Kata Sifat な<br>Kata Benda｝Bentuk Biasa～だ｝でしょう？",
        suffix: "......, bukan?",
        blocks: [
          {
            text: "Ini digunakan pada waktu bertanya dengan tujuan mendapatkan persetujuan dari lawan bicara atau menegaskan. でしょう diungkapkan dengan nada yang naik.<br>Di depan でしょう dipakai bentuk biasa, tetapi untuk Kata Sifat な dan Kata Benda dilanjutkan dengan bentuk ない dari～だ.",
            examples: [
              ["⑪ あした パーティーに 行くでしょう？<br>……ええ、行きます。", "Besok pergi ke pesta, bukan?<br>……Ya, pergi."],
              ["⑫ 北海道は 寒かったでしょう？<br>……いいえ、そんなに 寒くなかったです。", "Hokkaido dingin, bukan?<br>……Tidak, tidak begitu dingin."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub>（tempat）で Kata Benda<sub>2</sub> が あります",
        blocks: [
          {
            text: "Jika Kata Benda<sub>2</sub> menyatakan acara atau peristiwa seperti pesta, konser, perayaan, kejadian, bencana dan sebagainya, maka あります digunakan dalam maksud diadakan atau terjadi.",
            examples: [["⑬ 東京で 日本と ブラジルの サッカーの 試合が あります。", "Di Tokyo diadakan pertandingan sepak bola antara Jepang dan Brasil."]],
          },
        ],
      },
      {
        title: "Kata Benda（adegan）で",
        blocks: [
          {
            text: "Sesuatu adegan yang dilakukan ditunjukkan dengan partikel で.",
            examples: [["⑭ 会議で 何か 意見を 言いましたか。", "Di dalam rapat, apakah mengutarakan suatu pendapat?"]],
          },
        ],
      },
      {
        title: "Kata Benda でも Kata Kerja",
        blocks: [
          {
            text: "Jika menawarkan atau mengusulkan sesuatu, atau menyatakan keinginan dipakai partikel でも untuk menyebutkan satu dari beberapa contoh yang ada.",
            examples: [["⑮ ちょっと ビールでも 飲みませんか。", "Bagaimana kalau minum bir, atau...?"]],
          },
        ],
      },
      {
        title: "Kata Kerja（Bentuk ない）ないと……",
        blocks: [
          {
            text: "Ini adalah bentuk yang disingkat dari Kata Kerja（Bentukない）ないと いけません (Pel.17). Kata Kerja（Bentukない）ないと いけません mempunyai arti yang hampir sama dengan Kata Kerja（Bentukない）なければ なりません yang telah dipelajari pada Pelajaran 17.",
            examples: [["⑯ もう 帰らないと……。", "Harus pulang..."]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 21",
    focus: "Menyampaikan dugaan dan pendapat, mengutip perkataan, meminta persetujuan, serta menyatakan peristiwa dan tawaran.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Anak kalimat dan janji",
    items: [
      {
        title: "Anak Kalimat",
        noBox: true,
        blocks: [
          {
            text: "Pada Pelajaran 2 dan Pelajaran 8 telah dipelajari cara untuk menerangkan Kata Benda.<br>ミラーさんの うち　　rumah Sdr. Miller (Pel.2)<br>新しい うち　　rumah yang baru (Pel.8)<br>きれいな うち　　rumah yang indah (Pel.8)<br>Kata atau frase yang menerangkan diletakkan di depan Kata Benda. Pada pelajaran ini, mempelajari frase yang menerangkan Kata Benda.",
          },
          {
            label: "1)",
            text: "Kata Kerja, Kata Sifat dan Kata Benda yang terdapat di dalam anak kalimat adalah Bentuk Biasa. Untuk Kata Sifat Bentuk な menjadi～な, sedangkan untuk Kata Benda menjadi～の.",
            examples: [
              ["① 京都へ　行く　人", "orang yang pergi ke Kyoto"],
              ["　　　　行かない　人", "orang yang tidak pergi ke Kyoto"],
              ["　　　　行った　人", "orang yang telah pergi ke Kyoto"],
              ["　　　　行かなかった　人", "orang yang tidak pergi ke Kyoto (lampau)"],
              ["背が 高くて、髪が 黒い 人", "orang yang badannya tinggi, dan rambutnya hitam"],
              ["親切で、きれいな 人", "orang yang baik hati dan cantik"],
              ["65歳の 人", "orang yang berumur enam puluh lima tahun"],
            ],
          },
          {
            label: "2)",
            text: "Anak kalimat dipakai dalam berbagai pola kalimat seperti di bawah ini.",
            examples: [
              ["② これは ミラーさんが 住んで いた うちです。", "Ini adalah rumah yang dihuni Sdr. Miller."],
              ["③ ミラーさんが 住んで いた うちは 古いです。", "Rumah yang dihuni Sdr. Miller sudah tua."],
              ["④ ミラーさんが 住んで いた うちを 買いました。", "Membeli rumah yang dihuni Sdr. Miller."],
              ["⑤ わたしは ミラーさんが 住んで いた うちが 好きです。", "Saya suka rumah yang dihuni Sdr. Miller."],
              ["⑥ ミラーさんが 住んで いた うちに 猫が いました。", "Di rumah yang dihuni Sdr. Miller ada kucing."],
              ["⑦ ミラーさんが 住んで いた うちへ 行った ことが あります。", "Pernah pergi ke rumah yang dihuni Sdr. Miller."],
            ],
          },
          {
            label: "3)",
            text: "Subjek di dalam anak kalimat ditunjukan dengan partikel が.",
            examples: [
              ["⑧ これは ミラーさんが 作った ケーキです。", "Ini adalah kue yang dibuat oleh Sdr. Miller."],
              ["⑨ わたしは カリナさんが かいた 絵が 好きです。", "Saya suka lukisan yang dilukis oleh Sdr. Karina."],
              ["⑩ ［あなたは］彼が 生まれた 所を 知って いますか。", "Apakah [Anda] tahu tempat dia lahir?"],
            ],
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk Kamus 時間／約束／用事",
        blocks: [
          {
            text: "Jika menunjukkan waktu ketika melakukan sesuatu, ada janji dan ada urusan, aksi tersebut dijadikan Bentuk Kamus kemudian diletakkan di depan Kata Benda じかん、やくそく、ようじ dan lain-lainnya.",
            examples: [
              ["⑪ わたしは 朝ごはんを 食べる 時間が ありません。", "Saya tidak ada waktu untuk makan pagi."],
              ["⑫ わたしは 友達と 映画を 見る 約束が あります。", "Saya ada janji dengan teman untuk menonton film."],
              ["⑬ きょうは 市役所へ 行く 用事が あります。", "Hari ini ada urusan pergi ke kantor wali kota."],
            ],
          },
        ],
      },
      {
        title: "Kata Kerja（Bentuk ます）ましょうか",
        suffix: "Bagaimana kalau......?",
        blocks: [
          {
            text: "Pada Pelajaran 14, pola kalimat ini telah dipelajari sebagai ekspresi dari si pembicara menawarkan diri untuk melakukan sesuatu kepada lawan bicara. Pada percakapan dalam pelajaran ini, ekspresi ini disajikan sebagai ekspresi si pembicara yang menawarkan diri kepada lawan bicara untuk bersama-sama melakukan sesuatu.",
            examples: [["⑭ この 部屋、きょう 見る ことが できますか。<br>……ええ。今から 行きましょうか。", "Apakah kamar ini dapat saya lihat hari ini?<br>……Ya. Bagaimana kalau pergi sekarang?"]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 22",
    focus: "Menerangkan Kata Benda dengan anak kalimat, serta menyatakan waktu, janji, urusan, dan ajakan bersama.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Waktu, syarat, dan gerakan berpindah",
    items: [
      {
        title: "Kata Kerja Bentuk Kamus<br>Kata Kerja（Bentuk ない）ない<br>Kata Sifat Bentuk い（～い）<br>Kata Sifat Bentuk な［な］<br>Kata Benda の｝とき、～（kalimat pokok）",
        suffix: "Ketika......",
        blocks: [
          {
            text: "とき menunjukkan waktu ketika terjadinya keadaan dan aksi atau fenomena yang dinyatakan dalam kalimat pokok yang menyusul. Bentuk yang diletakkan di depan とき sama dengan bentuk yang menerangkan Kata Benda.",
            examples: [
              ["① 図書館で 本を 借りる とき、カードが 要ります。", "Ketika meminjam buku di perpustakaan, diperlukan kartu."],
              ["② 使い方が わからない とき、わたしに 聞いて ください。", "Jika tidak tahu cara pemakaiannya, silakan tanya kepada saya."],
              ["③ 体の 調子が 悪い とき、「元気茶」を 飲みます。", "Ketika badan tidak enak, minum “Genki-cha”."],
              ["④ 暇な とき、うちへ 遊びに 来ませんか。", "Pada waktu luang, bagaimana kalau datang bermain ke rumah saya?"],
              ["⑤ 妻が 病気の とき、会社を 休みます。", "Jika istri sakit, saya tidak masuk kerja."],
              ["⑥ 若い とき、あまり 勉強しませんでした。", "Waktu muda, tidak begitu belajar."],
              ["⑦ 子どもの とき、よく 川で 泳ぎました。", "Waktu masih kecil, sering berenang di sungai."],
            ],
            note: "Kalimat dengan menggunakan とき tidak berpengaruh pada induk kalimat.",
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk Kamus<br>Kata Kerja Bentuk た｝とき、～（kalimat pokok）",
        suffix: "Waktu......",
        blocks: [
          {
            text: "Jika Kata Kerja di depan とき adalah Bentuk Kamus, maka kalimat pokok menunjukkan hal yang terjadi sebelum kalimat～とき.<br>Jika Kata Kerja di depan とき adalah Bentuk た, maka kalimat pokok menunjukkan hal yang terjadi setelah kalimat～とき.",
            examples: [
              ["⑧ パリへ 行く とき、かばんを 買いました。", "Waktu mau pergi ke Paris, saya membeli tas."],
              ["⑨ パリへ 行った とき、かばんを 買いました。", "Waktu pergi ke Paris, saya membeli tas."],
            ],
          },
          {
            text: "⑧ menyatakan bahwa membeli tas sebelum tiba di Paris, yaitu suatu tempat dalam perjalanan ke Paris, sedangkan ⑨ menyatakan bahwa membeli tas setelah tiba di Paris, yaitu membelinya di Paris.",
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk Kamus と、～（kalimat pokok）",
        suffix: "Kalau......",
        blocks: [
          {
            text: "と menyatakan jika suatu aksi atau kejadian di depan と yang terjadi, menyatakan secara pasti akibat terjadinya suatu keadaan, aksi, fenomena, dan kejadian yang diikuti oleh kalimat pokok yang menyusul di belakangnya.",
            examples: [
              ["⑩ この ボタンを 押すと、お釣りが 出ます。", "Kalau tekan tombol ini, uang kembaliannya keluar."],
              ["⑪ これを 回すと、音が 大きく なります。", "Kalau memutar ini, suaranya akan membesar."],
              ["⑫ 右へ 曲がると、郵便局が あります。", "Kalau belok ke kanan, ada kantor pos."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda が Kata Sifat",
        blocks: [
          {
            text: "Pada Pelajaran 14, telah dipelajari hal yang menyatakan suatu fenomena yang dirasakan dengan panca indera (mata, telinga dan lain-lain) secara langsung sesuai dengan perasaan, atau menyampaikan peristiwa secara objektivitas dengan menggunakan partikel が. Hal ini tidak sebatas kalimat verbal, tetapi adakalanya juga dipakai untuk kalimat adjektival.",
            examples: [["⑬ 音が 小さいです。", "Suaranya kecil."]],
          },
        ],
      },
      {
        title: "Kata Benda を Kata Kerja yang menunjukkan gerakan berpindah",
        blocks: [
          {
            text: "を yang digunakan bersama dengan Kata Kerja yang menunjukkan gerakan berpindah seperti さんぽします、わたります、あるきます dan lain-lainnya menunjukkan tempat yang dilewati orang atau benda.",
            examples: [
              ["⑭ 公園を 散歩します。", "Berjalan-jalan di taman. (Pel.13)"],
              ["⑮ 道を 渡ります。", "Menyeberangi jalan."],
              ["⑯ 交差点を 右へ 曲がります。", "Di perempatan belok ke kanan."],
            ],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 23",
    focus: "Menyatakan waktu terjadinya sesuatu dengan とき, syarat pasti dengan と, serta kesan panca indera dan gerakan berpindah dengan を.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Memberi dan menerima kebaikan",
    items: [
      {
        title: "くれます",
        noBox: true,
        blocks: [
          {
            text: "あげます yang telah dipelajari pada Pelajaran 7 tidak dapat dipakai jika orang lain yang memberikan sesuatu kepada pembicara (diri sendiri) atau keluarga si pembicara. Dalam hal ini dipakai くれます.",
            examples: [
              ["① わたしは 佐藤さんに 花を あげました。", "Saya memberikan Sdr. Sato bunga."],
              ["×佐藤さんは わたしに クリスマスカードを あげました。", ""],
              ["② 佐藤さんは わたしに クリスマスカードを くれました。", "Sdr. Sato memberikan saya kartu Natal."],
              ["③ 佐藤さんは 妹に お菓子を くれました。", "Sdr. Sato memberikan adik kue."],
            ],
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk て｛あげます<br>　　　もらいます<br>　　　くれます",
        blocks: [
          {
            text: "あげます, もらいます dan くれます digunakan untuk pemberian atau penerimaan benda, sedangkan～て あげます,～て もらいます dan～て くれます digunakan untuk menunjukkan bahwa perbuatan tersebut saling memberi kebaikan atau keuntungan.",
          },
          {
            label: "Kata Kerja Bentuk て あげます",
            text: "Subjek dari Kata Kerja Bentuk て あげます adalah pelaku dijadikan sebagai subjek, dan dipakai ketika menunjukkan bahwa perbuatan tersebut memberikan kebaikan atau keuntungan.",
            examples: [["④ わたしは 木村さんに 本を 貸して あげました。", "Saya meminjamkan Sdr. Kimura buku."]],
          },
          {
            text: "Oleh sebab itu, perlu hati-hati jika perbuatan yang memberikan kebaikan atau keuntungan kepada atasan dengan menggunakan～て あげます memberi kesan yang memaksa orang untuk menerima kebaikan. Untuk menawarkan perbuatan yang memberi kebaikan atau keuntungan kepada atasan, digunakan Kata Kerja（Bentuk ます）ましょうか. (Lihat Pel.14-5).",
            examples: [
              ["⑤ タクシーを 呼びましょうか。", "Bagaimana kalau saya panggilkan taksi? (Pel.14)"],
              ["⑥ 手伝いましょうか。", "Bagaimana kalau saya bantu? (Pel.14)"],
            ],
          },
          {
            label: "Kata Kerja Bentuk て もらいます",
            examples: [["⑦ わたしは 山田さんに 図書館の 電話番号を 教えて もらいました。", "Saya diberikan nomor telepon perpustakaan oleh Sdr. Yamada."]],
          },
          {
            text: "Ini menunjukkan bahwa si penerima bantuan dijadikan subjek dan dengan perbuatan itu si pembicara dianggap sebagai subjek yang menerima kebaikan atau keuntungan. Jika subjeknya わたし, biasanya subjek itu dihilangkan.",
          },
          {
            label: "Kata Kerja Bentuk て くれます",
            examples: [["⑧ 母は ［わたしに］ セーターを 送って くれました。", "Ibu saya mengirimkan saya sweater."]],
          },
          {
            text: "Ini menunjukan bahwa pelaku dijadikan subjek dan dengan perbuatan itu si pembicara diaggap sebagai penerima kebaikan atau keuntungan. Jika penerima perbuatan (ditunjuk dengan partikel に) adalah わたし, biasanya わたし itu dihilangkan.",
            note: "[Perhatian] Partikel yang menunjuk penerima kebaikan dalam kalimat～て あげます atau～て くれます menjadi sama dengan kalimat yang tidak digunakan～て あげます atau～て くれます.<br>わたし<u>に</u> 旅行の 写真を 見せます。<br>↓<br>わたし<u>に</u> 旅行の 写真を 見せて くれます。<br>Memperlihatkan saya foto waktu berwisata.<br><br>わたし<u>を</u> 大阪城へ 連れて 行きます。<br>↓<br>わたし<u>を</u> 大阪城へ 連れて 行って くれます。<br>Mengantarkan saya ke Benteng Osaka.<br><br>わたし<u>の</u> 引っ越しを 手伝います。<br>↓<br>わたし<u>の</u> 引っ越しを 手伝って くれます。<br>Membantu saya pindah rumah.",
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub> は Kata Benda<sub>2</sub> が Kata Kerja",
        blocks: [
          {
            examples: [["⑨ おいしい ワインですね。<br>……ええ、［この ワインは］ 佐藤さんが くれました。", "Anggur yang enak ya.<br>……Ya, [anggur ini] Sdr. Sato yang berikan."]],
          },
          {
            text: "Kalimat jawaban adalah objek dari kalimat yang さとうさんが この ワインを くれました yaitu この ワイン dijadikan topik (Lihat Pel.17-5). この ワインは dapat dihilangkan sebab hal yang telah saling dipahami oleh si pembicara dan lawan bicara. Dengan catatan bahwa dalam kalimat ini さとうさん menjadi subjek maka dipakai が.",
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 24",
    focus: "Menyatakan pemberian dan penerimaan kebaikan dengan あげます, もらいます, dan くれます.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Pengandaian dan konsesi",
    items: [
      {
        title: "Bentuk Biasa Lampau ら、～（kalimat pokok）",
        suffix: "Kalau...",
        blocks: [
          {
            text: "Menyatakan persyaratan asumsi dengan membubuhkan ら pada Bentuk Biasa Lampau Kata Kerja, Kata Sifat dan Kata Benda yang menunjukkan isi suatu hal yang terjadi di bawah persyaratan asumsi yang disusul dengan kalimat pokok di belakangnya. Untuk kalimat pokok dapat digunakan ekspresi untuk menunjukkan keinginan, harapan, ajakan, permohonan dan lain-lain dari lawan bicara.",
            examples: [
              ["① お金が あったら、旅行します。", "Kalau punya uang, berwisata."],
              ["② 時間が なかったら、テレビを 見ません。", "Kalau tidak ada waktu, tidak menonton TV."],
              ["③ 安かったら、パソコンを 買いたいです。", "Kalau murah, ingin membeli komputer."],
              ["④ 暇だったら、手伝って ください。", "Kalau sedang luang, tolong bantu saya."],
              ["⑤ いい 天気だったら、散歩しませんか。", "Kalau cuaca baik, bagaimana kita jalan-jalan?"],
            ],
            note: "[Perhatian] Di belakang kalimat bentuk～と（kalimat pokok）, ekspresi untuk keinginan, harapan, ajakan, permohonan dan lain-lainnya tidak dapat dipakai.<br>×時間が あると、｛<br>　　コンサートに 行きます。　（keinginan）<br>　　コンサートに 行きたいです。　（harapan）<br>　　コンサートに 行きませんか。　（ajakan）<br>　　ちょっと 手伝って ください。　（permohonan）",
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk たら、～（kalimat pokok）",
        suffix: "Kalau sudah..., ～",
        blocks: [
          {
            text: "Jika sebelumnya telah mengetahui bahwa maksud dari Kata Kerja Bentuk たら pasti terjadi, setelah terjadi hal itu menyatakan terjadinya hal-hal seperti aksi atau kejadian yang disusul kalimat pokok.",
            examples: [
              ["⑥ 10時に なったら、出かけましょう。", "Kalau sudah sampai pukul sepuluh, kita berangkat."],
              ["⑦ うちへ 帰ったら、すぐ シャワーを 浴びます。", "Kalau pulang ke rumah, saya langsung mandi."],
            ],
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk て<br>Kata Kerja（Bentuk ない）なくて<br>Kata Sifat い（～い）→～くて<br>Kata Sifat な［な］→～で<br>Kata Benda で｝も、～（kalimat pokok）",
        suffix: "Walaupun...",
        blocks: [
          {
            text: "Ini menunjukkan persyaratan asumsi paradoks. Dengan kalimat yang disusul bentuk ても（kalimat pokok）, ditunjukkan terjadi hal yang terbaik yang biasanya dapat diduga di bawah persyaratan asumsi, atau tidak terjadinya hal yang biasanya dapat diduga.",
            examples: [
              ["⑧ 雨が 降っても、洗濯します。", "Walaupun hujan, mencuci pakaian."],
              ["⑨ 安くても、わたしは グループ旅行が 嫌いです。", "Walaupun murah, saya tidak suka tur rombongan."],
              ["⑩ 便利でも、パソコンを 使いません。", "Walaupun praktis, tidak memakai komputer."],
              ["⑪ 日曜日でも、働きます。", "Walaupun hari Minggu, bekerja."],
            ],
          },
        ],
      },
      {
        title: "もし",
        blocks: [
          {
            text: "もし dipakai bersama dengan～たら, dan berfungsi untuk memberitahukan sebelumnya bahwa kalimat tersebut adalah kalimat persyaratan. もし menekankan perasaan asumsi si pembicara.",
            examples: [["⑫ もし 1億円 あったら、いろいろな 国を 旅行したいです。", "Kalau punya seratus juta yen, ingin berwisata di berbagai negara."]],
          },
        ],
      },
      {
        title: "Subjek dalam anak kalimat",
        noBox: true,
        blocks: [
          {
            text: "Pada Pelajaran 16 bagian 2, telah dijelaskan bahwa subjek dalam kalimat～てから ditunjuk dengan が. Sama halnya dengan～てから,～とき atau～まえに, untuk～たら dan～ても subjek dalam anak kalimat ditunjuk dengan が.",
            examples: [
              ["⑬ 友達が 来る まえに、部屋を 掃除します。", "Sebelum teman datang, membersihkan kamar. (Pel.18)"],
              ["⑭ 妻が 病気の とき、会社を 休みます。", "Waktu istri sakit, saya tidak masuk kerja. (Pel.23)"],
              ["⑮ 友達が 約束の 時間に 来なかったら、どう しますか。", "Kalau teman tidak datang pada waktu janji, bagaimana? (Pel.25)"],
            ],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 25",
    focus: "Menyatakan pengandaian dengan ら／たら dan konsesi dengan ても, serta subjek dalam anak kalimat.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
];
document.querySelector("#materials .html-course").innerHTML = MATERI_BOOK1_LESSONS.map((l, i) => buildLessonHtml(i + 1, l.title, l.items, l.focusLabel, l.focus, l.practiceLabel, l.practice)).join("");
const firstLesson = document.querySelector("#materials .html-lesson");
if (firstLesson) {
  firstLesson.open = true;
}

const lessonOneMore = document.querySelector("#materials .html-lesson");
if (lessonOneMore) {
  const body = lessonOneMore.querySelector(".html-content");
  if (body) {
    body.insertAdjacentHTML(
      "beforeend",
      `<div class="grammar-point"><h3>Ringkasan perubahan bentuk kalimat</h3><table class="pattern-table"><thead><tr><th>Fungsi</th><th>Pola</th><th>Contoh</th></tr></thead><tbody><tr><td>Pernyataan</td><td>N1 は N2 です</td><td>わたしは 学生です。</td></tr><tr><td>Negatif</td><td>N1 は N2 じゃありません</td><td>わたしは 先生じゃありません。</td></tr><tr><td>Pertanyaan</td><td>N1 は N2 ですか</td><td>あなたは 学生ですか。</td></tr><tr><td>Juga</td><td>N も N です</td><td>田中さんも 学生です。</td></tr></tbody></table></div><div class="grammar-point"><h3>Dialog contoh</h3><div class="mini-dialog"><b>A:</b> はじめまして。わたしは ディバです。<br><b>B:</b> はじめまして。わたしは アニです。学生ですか。<br><b>A:</b> はい、学生です。アニさんも 学生ですか。<br><b>B:</b> いいえ、学生じゃありません。会社員です。<br><br><small>Arti: Salam kenal. Saya Divha. — Salam kenal. Saya Ani. Apakah kamu mahasiswa? — Ya. Kamu juga mahasiswa? — Tidak, saya pegawai perusahaan.</small></div></div><div class="lesson-quiz"><b>Latihan cepat Pelajaran 1</b><p>Pilih kata yang tepat: わたしは 学生（　）。</p><button class="secondary" data-l1="wrong">か</button><button class="secondary" data-l1="correct">です</button><button class="secondary" data-l1="wrong">を</button><div class="quiz-feedback" id="l1Feedback"></div></div>`,
    );
    body.querySelectorAll("[data-l1]").forEach(
      (b) =>
        (b.onclick = () => {
          document.getElementById("l1Feedback").textContent =
            b.dataset.l1 === "correct"
              ? "Benar! です menutup pernyataan nominal secara sopan."
              : "Belum tepat. Jawabannya adalah です.";
        }),
    );
  }
}

const materialsHeading = document.querySelector("#materials .head h1");
if (materialsHeading)
  materialsHeading.textContent =
    "Dasar — Buku 1: Keterangan Tata Bahasa Pelajaran 1–25";
/* Buku 2 BUKAN view/nav terpisah lagi ("fitur Kelas" sudah dihapus) -
   section ini ditaruh di DALAM #materials supaya seluruh materi (Buku 1
   dan Buku 2) bisa diakses dari satu tempat: menu "Materi pelajaran".
   id="book2" tetap dipertahankan karena masih dipakai sebagai penanda
   viewId oleh initMaterialLessonPicker/enrichLessons di js/pages/materi.js. */
const bookTwo = document.createElement("section");
bookTwo.id = "book2";
bookTwo.innerHTML = `<div class="head"><div><div class="eyebrow">Materi pembelajaran menengah</div><h1>Menengah — Buku 2</h1><p>Pelajaran 26–50 disusun bertahap dari materi tata bahasa Buku 2.</p></div></div><div class="html-course"></div>`;
document.getElementById("materials").appendChild(bookTwo);
const book2 = document.getElementById("book2");

const MATERI_BOOK2_LESSONS = [
  {
    title: "Meminta bantuan dan menjelaskan alasan",
    items: [
      {
        title: "Kata Kerja<br>Kata Sifat い｝Bentuk Biasa<br>Kata Sifat な<br>Kata Benda｝Bentuk Biasa ～だ→～な｝んです",
        blocks: [
          {
            text: "～んです dipakai dalam bahasa lisan, sedangkan dalam bahasa tertulis bentuknya menjadi～のです.<br>～んです dipakai seperti berikut;",
          },
          {
            label: "1) ～んですか",
          },
          {
            label: "(1) Ketika pembicara memastikan atau meminta keterangan tentang hal yang dilihat atau didengar.",
            examples: [["①（ぬれた 傘を 持って いる 人を 見て） 雨が 降って いるんですか。", "(Ketika melihat orang yang membawa payung yang basah) Apakah turun hujan?"]],
          },
          {
            label: "(2) Ketika meminta keterangan lebih lanjut tentang hal yang dilihat atau didengar oleh lawan bicara.",
            examples: [["② おもしろい デザインの 靴ですね。どこで 買ったんですか。", "Sepatu yang desainnya lucu, ya. Beli di mana?"]],
          },
          {
            label: "(3) Ketika meminta keterangan alasan tentang hal yang dilihat atau didengar oleh lawan bicara.",
            examples: [["③ どうして 遅れたんですか。", "Kenapa terlambat?"]],
          },
          {
            label: "(4) Ketika meminta keterangan tentang keadaan.",
            examples: [["④ どう したんですか。", "Kenapa?"]],
            note: "[Perhatian] Jika memakai～んですか pada bagian yang seharusnya tidak perlu, akan memberikan perasaan yang tidak nyaman, maka perlu berhati-hati.",
          },
          {
            label: "2) ～んです",
          },
          {
            label: "(1) Ketika menjelaskan alasan sebagai jawaban dari kalimat pada～んですか (3) atau (4) dari 1) di atas.",
            examples: [
              ["⑤ どうして 遅れたんですか。<br>……バスが 来なかったんです。", "Kenapa terlambat?<br>…… Karena bus tidak datang."],
              ["⑥ どう したんですか。<br>……ちょっと 気分が 悪いんです。", "Kenapa?<br>…… Saya sedikit tidak enak badan."],
            ],
          },
          {
            label: "(2) Ketika menambahkan alasan pada hal yang telah dijelaskan oleh pembicara sendiri.",
            examples: [["⑦ よく カラオケに 行きますか。<br>……いいえ、あまり 行きません。カラオケは 好きじゃ ないんです。", "Sering pergi ke <i>Karaoke</i>?<br>…… Tidak, jarang pergi. Saya tidak suka <i>Karaoke</i>."]],
            note: "[Perhatian] Jika tidak menjelaskan alasan, melainkan kenyataan,～んです tidak dipakai.<br>×わたしは マイク・ミラーなんです。",
          },
          {
            label: "3) ～んですが、～",
            text: "～んですが berfungsi untuk memulai suatu cerita. Di belakangnya disusul ekspresi permohonan, ajakan, atau permohonan izin. が ini dipakai sebagai prakata yang ringan (Lihat Pel.14). Seperti ⑩, isi yang disusul di belakang～んですが memang telah nyata, adakalanya kalimat lanjutannya dihilangkan.",
            examples: [
              ["⑧ 頭が 痛いんですが、帰っても いいですか。", "Sakit kepala, boleh pulang?"],
              ["⑨ 来週 友達と スキーに 行くんですが、ミラーさんも いっしょに 行きませんか。", "Minggu depan, saya pergi bermain ski dengan teman, bagaimana kalau sdr. Miller juga pergi sama-sama?"],
              ["⑩ お湯が 出ないんですが……。", "Air panas tidak keluar..."],
            ],
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk て いただけませんか",
        suffix: "Dapatkah Anda ～ untuk saya?",
        blocks: [
          {
            text: "Ungkapan ini adalah ungkapan yang lebih sopan daripada～て ください:",
            examples: [["⑪ いい 先生を 紹介して いただけませんか。", "Bisakah perkenalkan saya guru yang baik?"]],
          },
        ],
      },
      {
        title: "Kata Tanya Kata Kerja Bentuk たら いいですか",
        suffix: "Sebaiknya saya...?/ Bagaimana cara...?",
        blocks: [
          {
            text: "Ini adalah ungkapan untuk meminta masukan atau petunjuk.",
            examples: [
              ["⑫ どこで カメラを 買ったら いいですか。<br>……ABC ストアが 安いですよ。", "Sebaiknya saya membeli kamera di mana?<br>…… ABC store yang murah."],
              ["⑬ 国会議事堂を 見学したいんですが、どう したら いいですか。<br>……直接 行ったら いいですよ。", "Saya ingin mengunjungi Gedung Parlemen Nasional, bagaimana caranya?<br>…… Langsung pergi saja."],
            ],
          },
          {
            text: "Seperti jawaban untuk ⑬, dengan cara ucapan Kata Kerja Bentuk たら いいですよ, dapat memberi masukan atau tawaran kepada lawan bicara.",
          },
        ],
      },
      {
        title: "Kata Benda（objek）は｛好きです／嫌いです<br>　　　　　　　　　上手です／下手です<br>　　　　　　　　　あります, dll.",
        suffix: "suka/tidak suka<br>pandai/tidak pandai<br>ada dll.｝Kata Benda",
        blocks: [
          {
            examples: [["⑭ よく カラオケに 行きますか。<br>……いいえ、あまり 行きません。カラオケは 好きじゃ ないんです。", "Sering pergi ke <i>Karaoke</i>?<br>…… Tidak, jarang pergi. Saya tidak suka <i>Karaoke</i>."]],
          },
          {
            text: "Pada tingkat dasar I, telah mempelajari hal tentang objek langsung yang ditunjuk oleh を yang diangkat sebagai topik (Pel.17). Seperti ⑭, kata benda yang ditunjuk oleh が sebagai objek dari すきです dan lain-lainnya juga dapat diangkat sebagai topik.",
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 26",
    focus: "Menjelaskan dan menanyakan alasan dengan ～んです, meminta dengan sopan ～て いただけませんか, dan meminta saran dengan ～たら いいですか.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Bentuk potensial dan kemampuan",
    items: [
      {
        title: "Kata Kerja Potensial",
        noBox: true,
        blocks: [
          {
            text: "Sebagai cara menyatakan kebisaan, pada Pelajaran 18 di tingkat dasar I, telah mempelajari Kata Benda/Kata Kerja Bentuk Kamus＋ことが できます. Di sini Anda akan mempelajari cara lain untuk menyatakan Kata Kerja Potensial.",
            table: {
              headers: ["", "Kata Kerja Potensial<br>Bentuk Sopan", "Kata Kerja Potensial<br>Bentuk Biasa"],
              rows: [
                ["I", "かきます<br>かいます", "かけます<br>かえます", "かける<br>かえる"],
                ["II", "たべます", "たべられます", "たべられる"],
                ["III", "きます<br>します", "こられます<br>できます", "こられる<br>できる"],
              ],
            },
          },
          {
            text: "(Lihat Buku Induk Pel.27 Latihan A1)<br>Kata Kerja Potensial dikonjugasi sebagai Kata Kerja Kelompok II.<br>Contoh: かえます　かえる　かえ(ない)　かえて<br>Dengan catatan bahwa わかります sudah bermakna kebisaan maka tidak menjadi dalam bentuk わかれます.",
          },
        ],
      },
      {
        title: "Kalimat yang digunakan Kata Kerja Potensial",
        noBox: true,
        blocks: [
          {
            label: "1) Kata Kerja Potensial tidak menyatakan gerakan, melainkan keadaan. Objek dari Kata Kerja Transitif dinyatakan dengan を, sedangkan pada prinsipnya objek dari Kata Kerja Potensial dinyatakan dengan が.",
            examples: [
              ["① わたしは 日本語<u>を</u> 話します。", "Saya berbahasa Jepang."],
              ["② わたしは 日本語<u>が</u> 話せます。", "Saya bisa berbahasa Jepang."],
            ],
          },
          {
            text: "Tidak berubah kecuali Kata Bantu が.",
            examples: [
              ["③ 一人で 病院へ 行けますか。", "Bisa pergi ke rumah sakit sendiri?"],
              ["④ 田中さんに 会えませんでした。", "Tidak bisa bertemu dengan sdr. Tanaka."],
            ],
          },
          {
            label: "2) Dalam Kata Kerja Potensial, terdapat cara penggunaan untuk menyatakan kemampuan dari pelaku ⑤, dan menyatakan kemungkinan untuk melakukan suatu perbuatan dalam kondisi tertentu ⑥.",
            examples: [
              ["⑤ ミラーさんは 漢字が 読めます。", "Sdr. Miller bisa membaca huruf <i>Kanji</i>."],
              ["⑥ この 銀行で ドルが 換えられます。", "Di bank ini dolar dapat ditukar."],
            ],
          },
        ],
      },
      {
        title: "見えます dan 聞こえます",
        blocks: [
          {
            text: "みえます, きこえます dengan tidak sengaja menyatakan suatu objek yang dapat ditangkap di dalam wawasan secara alami, atau bunyi yang tercapai di telinga secara alami. Objek tersebut dinyatakan dengan が. みえます, きこえます tidak dapat dipakai untuk hal yang memperhatikan secara sengaja, dan untuk itu dipakai Kata Kerja Potensional.",
            examples: [
              ["⑦ 新幹線から 富士山が 見えます。", "Dari <i>Shinkansen</i> terlihat Gunung Fuji."],
              ["⑧ ラジオの 音が 聞こえます。", "Terdengar suara radio."],
              ["⑨ 新宿で 今 黒沢の 映画が 見られます。", "Di Shinjuku sekarang kita bisa menonton film karya sutradara Kurosawa."],
              ["⑩ 電話で 天気予報が 聞けます。", "Melalui telepon dapat mendengar prakiraan cuaca."],
            ],
          },
        ],
      },
      {
        title: "できます",
        blocks: [
          {
            text: "できます yang dipelajari di sini bermakna “menimbulkan”, “rampung”, “selesai”, “dibuat”, dan lain-lain.",
            examples: [
              ["⑪ 駅の 前に 大きい スーパーが できました。", "Di depan stasiun, telah dibangun pasar swalayan besar."],
              ["⑫ 時計の 修理は いつ できますか。", "Kapan perbaikan jam akan selesai?"],
            ],
          },
        ],
      },
      {
        title: "しか",
        blocks: [
          {
            text: "しか dibubuhkan pada Kata Benda atau Kata Keterangan Bilangan, dan selalu digunakan dengan menyertakan kata bentuk negatif. Mengangkat kata yang dibubuhkan しか, dan menyangkal semua kata yang lain. Jika dibubuhkan pada Kata Benda yang dibubuhkan が atau を, が atau を dihilangkan. Untuk selain Kata Bantu tersebut, langsung dibubuhkan di belakangnya. しか bernuansa tidak sempurna.",
            examples: [
              ["⑬ ローマ字しか 書けません。", "Hanya bisa menulis huruf latin saja."],
              ["⑭ ローマ字だけ 書けます。", "Bisa menulis huruf latin saja."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda は（Perbandingan）",
        blocks: [
          {
            text: "Selain menyatakan topik, は berfungsi untuk menyatakan perbandingan.",
            examples: [
              ["⑮ ワインは 飲みますが、ビールは 飲みません。", "(Saya) Minum aggur, tetapi tidak minum bir."],
              ["⑯ きのうは 山が 見えましたが、きょうは 見えません。", "Kemarin gunung terlihat, tetapi hari ini tidak terlihat."],
            ],
          },
        ],
      },
      {
        title: "は yang dianggap kata yang disertai Kata Bantu",
        noBox: true,
        blocks: [
          {
            text: "Sebagaimana telah dijelaskan di Kolom 1 pada Tingkat Dasar I (h.160), jika は disertai Kata Benda yang dibubuhkan が atau を, maka が atau を dihilangkan, tetapi selain Kata Bantu tersebut, dibubuhkan di belakangnya.",
            examples: [
              ["⑰ 日本では 馬を 見る ことが できません。", "Di Jepang tidak bisa melihat kuda. (Pel.18)"],
              ["⑱ 天気の いい 日には 海が 見えるんです。", "Pada hari yang bercuaca baik, laut terlihat."],
              ["⑲ ここからは 東京スカイツリーが 見えません。", "Dari sini, Tokyo Sky Tree tidak terlihat."],
            ],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 27",
    focus: "Menyatakan kemampuan dengan Kata Kerja Potensial, 見えます／聞こえます, できます, しか, dan は untuk perbandingan.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Melakukan dua kegiatan",
    items: [
      {
        title: "Kata Kerja<sub>1</sub>（Bentuk ます）ながら Kata Kerja<sub>2</sub>",
        blocks: [
          {
            text: "Pola kalimat ini menyatakan bahwa ketika pelaku yang sama melakukan aksi<sub>2</sub> dan aksi<sub>1</sub> secara bersamaan. Kata Kerja<sub>2</sub> yang merupakan aksi utama.",
            examples: [["① 音楽を 聞きながら 食事します。", "Makan sambil mendengar musik."]],
          },
          {
            text: "Seperti ②, digunakan pula jika melakukan dua hal dengan terus-menerus dalam suatu jangka waktu tertentu.",
            examples: [["② 働きながら 日本語を 勉強して います。", "Belajar bahasa Jepang sambil bekerja."]],
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk て います",
        blocks: [
          {
            text: "Pola kalimat ini digunakan pula ketika menyatakan perbuatan yang berulang kali sebagai kebiasaan. Jika perbuatan tersebut dilakukan pada masa lampau sebelum titik ucapannya, bentuknya berubah menjadi Kata Kerja Bentuk て いました.",
            examples: [
              ["③ 毎朝 ジョギングを して います。", "Setiap pagi, saya <i>joging</i>."],
              ["④ 子どもの とき、毎晩 8時に 寝て いました。", "Ketika masih kecil, setiap malam saya tidur pukul delapan."],
            ],
          },
        ],
      },
      {
        title: "Bentuk Biasa し、Bentuk Biasa し、～",
        blocks: [
          {
            label: "1) Pola kalimat ini digunakan jika menjelaskan lebih dari dua hal yang mirip mengenai topik dengan setaraf. Yang dimaksud mirip di sini adalah hal yang dijelaskannya semuanya kelebihan seperti ⑤ yang dicontohkan.",
            examples: [["⑤ 鈴木さんは ピアノも 弾けるし、歌も 歌えるし、ダンスも できます。", "Sdr. Suzuki bisa bermain piano, bisa bernyanyi, juga bisa berdansa."]],
          },
          {
            text: "Dengan catatan bahwa pola kalimat ini tidak hanya satu hal, melainkan mengandung satu hal lagi yang dibubuhkan mengenai perasaan si pembicara, maka sering digunakan も. Agar lebih jelas, adakalanya menggunakan それに, seperti ⑥.",
            examples: [["⑥ 田中さんは まじめだし、中国語も 上手だし、それに 経験も あります。", "Sdr. Tanaka rajin, pandai bahasa Tionghoa, lagi pula berpengalaman."]],
          },
          {
            label: "2) Pola kalimat ini digunakan pula untuk cara menyatakan alasan dibelakang bagian～し、～し.",
            examples: [["⑦ ここは 値段も 安いし、魚も 新しいし、よく 食べに 来ます。", "Di sini harganya murah, ikan juga segar, maka sering datang untuk makan."]],
          },
          {
            text: "Untuk ini, jika kesimpulannya sudah jelas, adakalanya alasan saja yang dijelaskan tanpa kesimpulan.",
            examples: [["⑧ どうして この 店へ 来るんですか。<br>……ここは 値段も 安いし、魚も 新しいし……。", "Kenapa datang ke toko ini?<br>…… Di sini harganya murah, ikan juga segar..."]],
          },
          {
            text: "Adakalanya し paling belakang dinyatakan dengan から untuk alasan.",
            examples: [["⑨ どうして 日本の アニメが 好きなんですか。<br>……話も おもしろいし、音楽も すてきですから。", "Kenapa suka animasi Jepang?<br>…… Ceritanya menarik, dan musiknya juga bagus."]],
          },
        ],
      },
      {
        title: "それで",
        blocks: [
          {
            text: "それで digunakan jika menjelaskan kesimpulan yang ditemukan oleh hal yang dijelaskan sebelumnya sebagai alasan.",
            examples: [
              ["⑩ 将来 小説家に なりたいです。それで 今は アルバイトを しながら 小説を 書いて います。", "(Saya) Ingin menjadi pengarang novel pada masa depan.<br>Oleh karena itu, sekarang menulis novel sambil bekerja paruh waktu."],
              ["⑪ ここは コーヒーも おいしいし、食事も できるし……。<br>……それで 人気が あるんですね。", "Di sini kopinya enak, dan juga bisa makan...<br>…… Oleh karena itu, populer, ya."],
            ],
          },
        ],
      },
      {
        title: "～とき＋Kata Bantu",
        blocks: [
          {
            text: "とき yang telah dipelajari pada Pelajaran 23 adalah Kata Benda, maka dapat menggunakannya dengan menyertai Kata Bantu di belakangnya.",
            examples: [
              ["⑫ 勉強する ときは、音楽を 聞きません。", "Ketika belajar tidak mendengar musik."],
              ["⑬ 疲れた ときや 寂しい とき、よく 田舎の 青い 空を 思い出す。", "Ketika lelah atau sepi, saya sering ingat langit biru kampung halaman. (Pel.31)"],
            ],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 28",
    focus: "Menyatakan dua kegiatan sekaligus dengan ながら, kebiasaan dengan ～て います, alasan dengan ～し、～し, それで, dan ～とき＋Kata Bantu.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Keadaan dan persiapan",
    items: [
      {
        title: "Kata Kerja Bentuk て います",
        blocks: [
          {
            text: "Kata Kerja Bentukて います ini adalah cara penggunaan untuk menyatakan hal yang berlangsung atas akibat dari aksi itu.",
            examples: [
              ["① 窓が 割れて います。", "Kaca jendela pecah."],
              ["② 電気が ついて います。", "Listrik menyala."],
            ],
          },
          {
            text: "Misalnya, ① menyatakan bahwa kaca jendela pecah pada suatu titik, kemudian saat ini pun akibatnya tetap berlangsung (= keadaan kaca jendela pecah).",
            figure: { src: "assets/images/materi/p29-mado.png", alt: "Garis waktu: 窓が 割れました (jendela pecah pada suatu titik), lalu 窓が 割れて います (keadaan pecah berlangsung sampai sekarang)" },
          },
          {
            text: "Kata Kerja yang digunakan dengan cara penggunaan ini adalah Kata Kerja yang mengalami perubahan sebelum dan sesudah terjadi aksi tersebut, seperti あきます, しまります, つきます, きえます, こわれます, われます.<br>Dengan catatan bahwa jika menggambarkan keadaan di depan mata secara langsung, seperti ① atau ②, subjek dinyatakan dengan が.<br>Jika subjek dianggap sebagai topik, digunakan Kata Bantu は seperti ③.",
            examples: [["③ この いすは 壊れて います。", "Kursi ini rusak."]],
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk て しまいました／しまいます",
        blocks: [
          {
            text: "～て しまいました menyatakan bahwa aksi telah selesai.～て しまいます menyatakan bahwa aksi akan selesai pada suatu titik pada masa depan.",
            examples: [
              ["④ シュミットさんが 持って 来た ワインは みんなで 飲んで しまいました。", "Anggur yang dibawa oleh sdr. Schmidt telah diminum oleh semuanya."],
              ["⑤ 漢字の 宿題は もう やって しまいました。", "PR mengenai huruf <i>Kanji</i> telah saya selesaikan."],
              ["⑥ 昼ごはんまでに レポートを 書いて しまいます。", "Sampai dengan makan siang, saya akan menyelesaikan menulis laporan."],
            ],
          },
          {
            text: "Dalam～て しまいました adakalanya untuk menyatakan perasaan penyesalan atau kekecewaan si pembicara seperti ⑦ atau ⑧.",
            examples: [
              ["⑦ パスポートを なくして しまいました。", "(Saya) Kehilangan paspor."],
              ["⑧ パソコンが 故障して しまいました。", "PC rusak."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda（Tempat）に 行きます／来ます／帰ります",
        blocks: [
          {
            text: "Pada ⑨ (Lihat Latihan C3), untuk menggantikan Kata Bantu へ yang menunjuk arah, digunakan Kata Bantu に untuk menyatakan titik sampainya. Sebagaimana pada keterangan itu, Kata Kerja いきます, きます, かえります dan lain-lainnya keduanya dapat digunakan untuk tempat へ atau tempat に.",
            examples: [["⑨ どこかで 財布を 落として しまったんです。<br>……それは 大変ですね。すぐ 交番に 行かないと。", "Dompet (Saya) terjatuh di suatu tempat.<br>…… Susah, ya. Harus pergi ke pos polisi dengan segera."]],
          },
        ],
      },
      {
        title: "それ／その／そう",
        blocks: [
          {
            text: "Pada Pelajaran 2 telah dipelajari cara penggunaan mengenai Kata Petunjuk yang menunjukkan benda yang ada di tempat itu. Di sini diperkenalkan それ, その, そう yang menunjukkan benda yang muncul di dalam cerita si pembicara atau kalimat.",
          },
          {
            label: "1) Untuk percakapan",
            text: "それ pada ⑩ dan ⑪, その pada ⑫, dan そう pada ⑬ menunjuk isi yang dijelaskan oleh lawan bicara tepat sebelumnya.",
            examples: [
              ["⑩ <u>どこかで 財布を 落として しまった</u>んです。<br>……<u>それ</u>は 大変ですね。すぐ 交番に 行かないと。", "Dompet (Saya) terjatuh di suatu tempat.<br>…… Susah, ya. Harus pergi ke pos polisi dengan segera."],
              ["⑪ 来月から <u>大阪の 本社に 転勤</u>なんです。<br>……<u>それ</u>は おめでとう ございます。", "Mulai bulan depan, (saya) pindah ke kantor pusat di Osaka.<br>…… Oh, saya mengucapkan selamat! (Pel.31)"],
              ["⑫ あのう、<u>途中で やめたい</u> 場合は？<br>……<u>その</u> 場合は、近くの 係員に 名前を 言って、帰って ください。", "Anu..., kalau mau berhenti setengah jalan?<br>…… Untuk masalah itu, beritahukan nama (Anda) kepada staf terdekat, lalu silakan pulang. (Pel.45)"],
              ["⑬ <u>うちへ 帰って、休んだ</u> ほうが いいですよ。<br>……ええ、<u>そう</u> します。", "Lebih baik pulang ke rumah, dan beristirahat.<br>…… Ya, benar. (Pel.32)"],
            ],
          },
          {
            label: "2) Untuk Kalimat",
            text: "その pada ⑭ menunjuk isi dari kalimat yang terdapat pada kalimat sebelumnya.",
            examples: [["⑭ 一人で <u>コンサートや 展覧会に 出かける</u>と、いいでしょう。<u>その</u> とき 会った 人が 将来の 恋人に なるかも しれません。", "Bagus juga kalau pergi ke konser atau pameran sendirian. Siapa tahu kalau orang yang Anda jumpai pada saat itu yang menjadi pacar untuk masa depan. (Pel.32)"]],
          },
        ],
      },
      {
        title: "ありました",
        blocks: [
          {
            examples: [["⑮ ［かばんが］ ありましたよ。", "[Tasnya] Ada."]],
          },
          {
            text: "ありました ini menyatakan bahwa lawan bicaranya menemukan keberadaan tas. Tidak bermaksud bahwa pernah ada tas di situ.",
          },
        ],
      },
      {
        title: "どこかで／どこかに",
        blocks: [
          {
            text: "Kata Bantu へ dan を di belakang どこか dan なにか dapat dihilangkan, sedangkan Kata Bantu で dan に di belakang どこかで dan どこかに tidak dapat dihilangkan.",
            examples: [
              ["⑯ どこかで 財布を なくして しまいました。", "Entah di mana (saya) kehilangan dompet."],
              ["⑰ どこかに 電話が ありますか。", "Apakah ada telepon dari suatu tempat?"],
            ],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 29",
    focus: "Menyatakan keadaan hasil aksi dengan ～て います, selesai/penyesalan dengan ～て しまいました, serta それ／その／そう dalam percakapan.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Persiapan dan perubahan keadaan",
    items: [
      {
        title: "Kata Kerja Bentuk て あります",
        blocks: [
          {
            text: "Kata Kerja Bentuk て あります adalah perbuatan dari seseorang untuk suatu tujuan, kemudian menyatakan bahwa akibat atau hasil dari perbuatan itu sedang berlangsung. Kata Kerja yang digunakan berupa Kata Kerja Transitif.",
          },
          {
            label: "1) <span class=\"grammar-pola-box\">Kata Benda<sub>1</sub> に Kata Benda<sub>2</sub> が Kata Kerja Bentuk て あります</span>",
            examples: [
              ["① 机の 上に メモが 置いて あります。", "Di atas meja diletakkan catatan."],
              ["② カレンダーに 今月の 予定が 書いて あります。", "Pada kalender ditulis rencana bulan ini."],
            ],
          },
          {
            label: "2) <span class=\"grammar-pola-box\">Kata Benda<sub>2</sub> は Kata Benda<sub>1</sub> に Kata Kerja Bentuk て あります</span>",
            text: "Jika Kata Benda<sub>2</sub> diangkat sebagai topik, maka menggunakan Kata Bantu は.",
            examples: [
              ["③ メモは どこですか。<br>……［メモは］ 机の 上に 置いて あります。", "Di mana catatan?<br>…… [Catatan] Diletakkan di atas meja."],
              ["④ 今月の 予定は カレンダーに 書いて あります。", "Rencana bulan ini ditulis pada kalender."],
            ],
          },
          {
            note: "[Perhatian] Perbedaan antara Kata Kerja Bentuk て います dan Kata Kerja Bentuk て あります.",
            examples: [
              ["⑤ 窓が 閉まって います。", "Jendela tertutup."],
              ["⑥ 窓が 閉めて あります。", "Jendela ditutup."],
            ],
          },
          {
            text: "Seperti ⑤ dan ⑥, jika dipakai Kata Kerja Intransitif (しまります) dan Kata Kerja Transitif (しめます) yang berpasangan dengan Kata Kerja Bentuk て います dan Kata Kerja Bentuk て あります, ⑤ hanya menjelaskan untuk keadaan jendela tertutup, sedangkan pada ⑥ menyatakan bahwa terjadi keadaan disebabkan oleh perbuatan dari seseorang.",
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk て おきます",
        blocks: [
          {
            label: "1) Menyatakan bahwa menyelesaikan aksi atau perbuatan yang diperlukan sampai dengan waktu tertentu.",
            examples: [
              ["⑦ 旅行の まえに、切符を 買って おきます。", "Sebelum perjalanan, membeli karcis."],
              ["⑧ 次の 会議までに 何を して おいたら いいですか。<br>……この 資料を 読んで おいて ください。", "Apa yang harus saya lakukan sampai dengan rapat berikut?<br>…… Diharapkan untuk membaca materi ini."],
            ],
          },
          {
            label: "2) Menyatakan bahwa menyelesaikan aksi yang diperlukan untuk persiapan pemakaian berikutnya, atau tindakan untuk sementara.",
            examples: [["⑨ はさみを 使ったら、元の 所に 戻して おいて ください。", "Jika memakai gunting, tolong kembalikan ke tempat semula."]],
          },
          {
            label: "3) Menyatakan akibat dari mempertahankan suatu keadaan.",
            examples: [["⑩ あした 会議が ありますから、いすは この ままに して おいて ください。", "Karena besok ada rapat, kursinya dibiarkan begini saja."]],
            note: "[Perhatian] Dalam bahasa lisan,～て おきます sering berubah menjadi～ときます.",
          },
          {
            examples: [["⑪ そこに 置いといて（置いて おいて） ください。", "Tolong letakkan di situ saja. (Pel.38)"]],
          },
        ],
      },
      {
        title: "まだ＋Bentuk positif",
        suffix: "masih...",
        blocks: [
          {
            examples: [
              ["⑫ まだ 雨が 降って います。", "Masih turun hujan."],
              ["⑬ 道具を 片づけましょうか。<br>……まだ 使って いますから、その ままに して おいて ください。", "Apa saya yang membereskan alatnya?<br>…… Karena masih dipakai, tolong dibiarkan begitu saja."],
            ],
          },
          {
            text: "まだ ini berarti masih, dan menyatakan bahwa aksi atau keadaannya sedang berlangsung.",
          },
        ],
      },
      {
        title: "とか",
        blocks: [
          {
            text: "とか digunakan jika memberikan contoh seperti sama halnya dengan や. とか jika dibandingan dengan や dalam bahasa lisan, dapat digunakan di belakang Kata Benda terakhir di antara yang disebutkan.",
            examples: [["⑭ どんな スポーツを して いますか。<br>……そうですね。テニスとか 水泳とか……。", "Berolahraga apa saja?<br>…… Apa ya? Tenis, atau renang..."]],
          },
        ],
      },
      {
        title: "Partikel＋も",
        blocks: [
          {
            text: "Jika も digabung dengan Kata Benda yang dibubuhkan が atau を, maka が atau を dihapuskan.<br>Jika selain Kata Bantu tersebut, (Contoh: に, で, から, まで, と) dibubuhkan di belakangnya.<br>へ boleh dihapuskan dan juga boleh untuk tidak dihapuskan.",
            examples: [
              ["⑮ ほか<u>にも</u> いろいろ あります。", "Selain itu masih ada macam-macam."],
              ["⑯ どこ<u>［へ］も</u> 行きません。", "Tidak pergi ke mana-mana."],
            ],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 30",
    focus: "Menyatakan hasil perbuatan dengan ～て あります, persiapan dengan ～て おきます, まだ, とか, dan Partikel＋も.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Niat dan rencana",
    items: [
      {
        title: "Bentuk Maksud",
        noBox: true,
        blocks: [
          {
            text: "Cara membuat Bentuk Maksud dari Bentuk ます adalah sebagai berikut; (Lihat Buku Induk Pel.31 Latihan A1)",
          },
          {
            text: "Kelompok I: Bunyi dari kolom い sebagai bunyi terakhir dari Bentuk ます diubah menjadi bunyi kolom お kemudian dibubuhkan う.<br>か<u>き</u>－ます → か<u>こ</u>－う　　いそ<u>ぎ</u>－ます → いそ<u>ご</u>－う<br>よ<u>み</u>－ます → よ<u>も</u>－う　　あそ<u>び</u>－ます → あそ<u>ぼ</u>－う",
          },
          {
            text: "Kelompok II: Dibubuhkan よう pada Bentuk ます<br>たべ－ます → たべ－よう　　み－ます → み－よう",
          },
          {
            text: "Kelompok III:<br>し－ます → し－よう　　き－ます → こ－よう",
          },
        ],
      },
      {
        title: "Cara pemakaian Bentuk Maksud",
        noBox: true,
        blocks: [
          {
            label: "1) Merupakan Bentuk Biasa dari～ましょう, digunakan dalam kalimat Bentuk Biasa.",
            examples: [
              ["① ちょっと 休まない？<br>……うん、休もう。", "Bagaima kalau beristirahat sebentar?<br>……Ya, mari beristirahat."],
              ["② 手伝おうか。", "Mari saya bantu!"],
              ["③ 傘を 持って 行こうか。", "Apa sebaiknya bawa payung?"],
            ],
            note: "[Perhatian] Pada kalimat tanya Bentuk Biasa, pada umumnya tidak membubuhkan Kata Bantu か pada akhir kalimat, tetapi untuk kalimat tanya Bentuk Biasa～ましょうか seperti ② atau ③ diperlukan Kata Bantu か pada akhir kalimat.",
          },
          {
            label: "2) Kata Kerja Bentuk Maksud と 思って います",
            text: "Pola kalimat ini digunakan untuk menyatakan kehendak si pembicara kepada lawan bicaranya. Kata Kerja Bentuk Maksud と おもいます juga dapat digunakan dengan makna yang sama, tetapi Kata Kerja Bentuk Maksud と おもって います menyatakan jangka waktu tertentu sampai dan saat ini kehendak itu masih dipertahankan.",
            examples: [
              ["④ 週末は 海へ 行こうと 思って います。", "Pada akhir minggu ingin pergi ke laut."],
              ["⑤ 今から 銀行へ 行こうと 思います。", "Sekarang mau pergi ke bank."],
            ],
            note: "[Perhatian] Kata Kerja Bentuk Maksud と おもいます hanya dapat menyatakan maksud dari si pembicara, sedangkan Kata Kerja Bentuk Maksud と おもって います dapat menyatakan maksud dari orang ketiga.",
          },
          {
            examples: [["⑥ 彼は 学校を 作ろうと 思って います。", "Rencananya dia ingin membangun sekolah."]],
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk Kamus<br>Kata Kerja（Bentuk ない）ない｝つもりです",
        blocks: [
          {
            text: "Kata Kerja Bentuk Kamus つもりです menyatakan kehendak. Bentuk negatif biasanya menggunakan dengan bentuk Kata Kerja (Bentuk ない) ない つもりです.",
            examples: [
              ["⑦ 国へ 帰っても、日本語の 勉強を 続ける つもりです。", "Kalau pulang ke tanah air, (saya) ingin meneruskan belajar bahasa Jepang."],
              ["⑧ あしたからは たばこを 吸わない つもりです。", "Mulai besok, (saya) bermaksud tidak merokok."],
            ],
            note: "[Perhatian] Antara Kata Kerja Bentuk Maksud と おもって います dan Kata Kerja Bentuk Kamus つもり tidak terdapat perbedaan yang besar, namun untuk menyatakan kehendak yang pasti, atau ketepatan hati yang kukuh, kebanyakan Kata Kerja Bentuk Kamus つもりです yang digunakan.",
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk Kamus<br>Kata Benda の｝予定です",
        blocks: [
          {
            text: "Cara untuk menjelaskan pernyatakan rencana.",
            examples: [
              ["⑨ 7月の 終わりに ドイツへ 出張する 予定です。", "Rencananya pada akhir bulan Juli (saya) dinas ke Jerman."],
              ["⑩ 旅行は 1週間ぐらいの 予定です。", "Rencananya perjalanan kurang lebih seminggu."],
            ],
          },
        ],
      },
      {
        title: "まだ Kata Kerja Bentuk て いません",
        blocks: [
          {
            text: "Ekspresi ini menyatakan bahwa pada saat ungkapan/pembicaraan, belum terjadi kejadian atau perbuatan belum selesai.",
            examples: [
              ["⑪ 銀行は まだ 開いて いません。", "Bank belum buka."],
              ["⑫ レポートは もう 書きましたか。<br>……いいえ、まだ 書いて いません。", "Apakah (Anda) telah menulis laporan?<br>…… Belum, belum menulisnya."],
            ],
          },
        ],
      },
      {
        title: "帰ります － 帰り",
        blocks: [
          {
            text: "Seperti ⑬ atau ⑭, adakalanya bentuk yang sama dengan Bentuk ます digunakan sebagai Kata Benda.",
            examples: [
              ["⑬ 帰りの 新幹線は どこから 乗りますか。", "Naik dari mana <i>Shinkansen</i> untuk pulangnya?"],
              ["⑭ 休みは 何曜日ですか。", "Hari apa hari libur? (Pel.4)."],
            ],
          },
          {
            text: "Selain itu, terdapat contoh seperti di bawah ini;<br>遊びます － 遊び　　答えます － 答え<br>申し込みます － 申し込み　　楽しみます (menikmati) － 楽しみ",
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 31",
    focus: "Menyatakan niat dengan Bentuk Maksud, ～と 思って います, つもりです, rencana dengan 予定です, dan まだ～て いません.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Nasihat dan kemungkinan",
    items: [
      {
        title: "Kata Kerja Bentuk た<br>Kata Kerja（Bentuk ない）ない｝ほうが いいです",
        blocks: [
          {
            examples: [
              ["① 毎日 運動した ほうが いいです。", "Lebih baik berolahraga setiap hari."],
              ["② 熱が あるんです。<br>……じゃ、おふろに 入らない ほうが いいですよ。", "Berdemam.<br>…… Kalau begitu, lebih baik jangan mandi."],
            ],
          },
          {
            text: "Pola kalimat ini digunakan jika memberi masukan atau nasihat kepada lawan bicara. Kata Kerja Bentuk た ほうが いいです mengandung makna untuk memperbandingkan dua hal kemudian memilih salah satunya, maka mempunyai maksud tidak baik jika tidak melakukan perbuatan tersebut. Karena itu, kalimat ini memberi kesan bahwa si pembicara sedikit memaksa. Ketika hanya merekomendasikan tindakan tertentu digunakan～たら いい (Pel.26).",
            examples: [["③ 日本の お寺が 見たいんですが……。<br>……じゃ、京都へ 行ったら いいですよ。", "(Saya) Ingin melihat kuil Jepang ….<br>…… Kalau begitu, sebaiknya pergi ke Kyoto."]],
          },
        ],
      },
      {
        title: "Kata Kerja<br>Kata Sifat い｝Bentuk Biasa<br>Kata Sifat な<br>Kata Benda｝Bentuk Biasa ～だ｝でしょう",
        blocks: [
          {
            text: "～でしょう digunakan jika menjelaskan pikiran si pembicara secara tidak pasti terhadap hal untuk masa depan atau hal yang tidak tentu.",
            examples: [
              ["④ あしたは 雨が 降るでしょう。", "Besok akan turun hujan."],
              ["⑤ タワポンさんは 合格するでしょうか。<br>……きっと 合格するでしょう。", "Apakah sdr. Thawapon akan lulus?<br>…… Pasti akan lulus."],
            ],
          },
        ],
      },
      {
        title: "Kata Kerja<br>Kata Sifat い｝Bentuk Biasa<br>Kata Sifat な<br>Kata Benda｝Bentuk Biasa ～だ｝かも しれません",
        blocks: [
          {
            text: "～かもしれません dapat menggunakan ketika ingin berkata bahwa ada kemungkinan walaupun sedikit.",
            examples: [["⑥ 約束の 時間に 間に 合わないかも しれません。", "Ada kemungkinan terlambat untuk jam yang telah saya janjikan."]],
          },
        ],
      },
      {
        title: "Kata Kerja（Bentuk ます）ましょう",
        blocks: [
          {
            examples: [["⑦ エンジンの 音が おかしいんですが。<br>……そうですね。故障かも しれません。ちょっと 調べましょう。", "Bunyi mesinnya aneh ...<br>…… Ya, benar. Mungkin kerusakan. Mari periksanya sebentar."]],
          },
          {
            text: "Kata Kerja (Bentuk ます) ましょう pada ⑦ adalah ekspresi untuk menyampaikan maksud si pembicara kepada lawan bicara. Digunakan jika mengusulkan suatu perbuatan. Bernuansa lebih tegas daripada Kata Kerja (Bentuk ます) ましょうか (Pel.14).",
          },
        ],
      },
      {
        title: "Kata Keterangan Bilangan で",
        blocks: [
          {
            text: "Menyatakan batas waktu atau batasan.",
            examples: [
              ["⑧ 駅まで 30分で 行けますか。", "Dapat pergi sampai stasiun dalam waktu tiga puluh menit?"],
              ["⑨ 3万円で パソコンが 買えますか。", "Dapat membeli PC dengan tiga puluh ribu yen?"],
            ],
          },
        ],
      },
      {
        title: "何か 心配な こと",
        blocks: [
          {
            examples: [["⑩ 何か 心配な ことが あるんですか。", "Ada suatu hal yang mengkhawatirkan?"]],
          },
          {
            text: "Untuk contoh seperti ⑩, yang digunakan bukan しんぱいな なにか (khawatir akan suatu hal) melainkan なにか しんぱいな こと (suatu hal yang mengkhawatirkan). Untuk ekspresi serupa, selain ini ada なにか～もの, どこか～ところ, だれか～ひと, いつか～とき dan sebagainya.",
            examples: [["⑪ スキーに 行きたいんですが、どこか いい 所、ありますか。", "(Saya) Ingin pergi bermain ski, apakah ada suatu tempat yang bagus?"]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 32",
    focus: "Memberi nasihat dengan ～ほうが いいです, menyatakan dugaan dengan でしょう dan かも しれません, serta ～ましょう, Kata Keterangan Bilangan で, dan 何か 心配な こと.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Perintah, larangan, dan pesan",
    items: [
      {
        title: "Bentuk Imperatif・Bentuk Larangan",
        noBox: true,
        blocks: [
          {
            label: "1) Cara membuat Bentuk Imperatif (Lihat Buku Induk Pel.33 Latihan A1)",
            text: "Kelompok I: Bunyi dari kolom い sebagai bunyi terakhir dari Bentuk ます diubah menjadi bunyi kolom え.<br>か<u>き</u>－ます → か<u>け</u>　　いそ<u>ぎ</u>－ます → いそ<u>げ</u><br>よ<u>み</u>－ます → よ<u>め</u>　　あそ<u>び</u>－ます → あそ<u>べ</u><br>Kelompok II: Dibubuhi ろ pada Bentuk ます.<br>たべ－ます → たべ－ろ　　み－ます → み－ろ<br>Pengecualian: くれ－ます → くれろ<br>Kelompok III: し－ます → しろ　　き－ます → こい",
            note: "[Perhatian] Kata Kerja Keadaan seperti ある, できる, わかる dan sebagainya tidak memiliki Bentuk Imperatif.",
          },
          {
            label: "2) Cara membuat Bentuk Larangan (Lihat Buku Induk Pel.33 Latihan A1)",
            text: "Membubuhkan な pada Bentuk Kamus.",
          },
        ],
      },
      {
        title: "Cara pemakaian Bentuk Imperatif dan Bentuk Larangan",
        noBox: true,
        blocks: [
          {
            text: "Bentuk Imperatif dipakai jika memaksa suatu aksi, dan Bentuk Larangan dipakai jika memerintah untuk tidak melakukan suatu aksi kepada lawan biacara. Ini mempunyai nada paksaan serta kedengaran sangat keras sehingga adegan pemakaiannya sangat terbatas jika memakainya pada akhir kalimat. Kemudian yang menggunakannya secara lisan, kebanyakan kasus hanya terbatas bagi kaum pria. Bentuk Imperatif atau Bentuk Larangan yang dipakai pada akhir kalimat adalah kasus di bawah berikut ini;",
          },
          {
            label: "1) Pria yang posisi atau usianya dari atas ke bawah, atau ayah memakainya kepada anak.",
            examples: [
              ["① 早く 寝ろ。", "Cepat tidur!"],
              ["② 遅れるな。", "Jangan terlambat!"],
            ],
          },
          {
            label: "2) Dipakai antara sesama pria. Untuk memperlembut suasana perkataan, biasanya sering dibubuhkan Kata Bantu よ pada akhir kalimat.",
            examples: [
              ["③ あした うちへ 来い［よ］。", "Besok datanglah ke rumahku!"],
              ["④ あまり 飲むな［よ］。", "Jangan minum terlalu banyak!"],
            ],
          },
          {
            label: "3) Ketika memberi petunjuk saat bekerja sama di pabrik, atau jika tidak ada peluang untuk cara ungkap terhadap lawan bicara karena saat darurat seperti kebakaran, gempa bumi. Untuk kasus itu pun, kebanyakan dipakai oleh pria yang posisi atau usianya atas saja.",
            examples: [
              ["⑤ 逃げろ。", "Berlarilah!"],
              ["⑥ エレベーターを 使うな。", "Jangan gunakan tangga berjalan!"],
            ],
          },
          {
            label: "4) Ketika memberi perintah pada saat latihan berkelompok, atau mata pelajaran olah raga, kurikulum ektra di bidang kegiatan olah raga di sekolah.",
            examples: [
              ["⑦ 休め。", "Beristirahat!"],
              ["⑧ 休むな。", "Jangan beristirahat!"],
            ],
          },
          {
            label: "5) Pengobaran semangat pada saat menonton pertandingan olah raga. Untuk kasus ini adakalanya wanita juga memakainya.",
            examples: [
              ["⑨ 頑張れ。", "Semangat!"],
              ["⑩ 負けるな。", "Jangan kalah!/Jangan menyerah!"],
            ],
          },
          {
            label: "6) Jika mementingkan kesederhanaan seperti tanda lalu-lintas, slogan, atau mengharapkan efek yang tinggi.",
            examples: [
              ["⑪ 止まれ。", "Berhenti!"],
              ["⑫ 入るな。", "Dilarang masuk!"],
            ],
            note: "[Perhatian] Dalam bentuk imperatif terdapat pula Kata Kerja (Bentuk ます) なさい. Bentuk ini dipakai oleh orang tua kepada anak, atau guru kepada murid, dan terasa bunyi yang lebih halus daripada Kata Kerja Bentuk Imperatif. Namun, tidak bisa digunakan untuk orang yang lebih tua.",
          },
          {
            examples: [["⑬ 勉強しなさい。", "Belajarlah!"]],
          },
        ],
      },
      {
        title: "～と 書いて あります／～と 読みます",
        blocks: [
          {
            examples: [
              ["⑭ あの 漢字は 何と 読むんですか。", "Huruf <i>Kanji</i> itu cara membacanya bagaimana?"],
              ["⑮ あそこに「止まれ」と 書いて あります。", "Di sana bertuliskan “Berhenti”."],
            ],
          },
          {
            text: "と pada ⑭ dan ⑮ berfungsi sama dengan と dari～と いいます (Pel.21).",
          },
        ],
      },
      {
        title: "X は Y と いう 意味です",
        blocks: [
          {
            text: "Bentuk ini digunakan untuk mendefinisikan makna X. と いう berasal dari と いいます. Jika bertanya artinya, menggunakan Kata Tanya どういう.",
            examples: [
              ["⑯「立入禁止」は 入るなと いう 意味です。", "“<i>Tachiiri Kinshi</i>” berarti dilarang masuk."],
              ["⑰ この マークは どういう 意味ですか。<br>……洗濯機で 洗えると いう 意味です。", "Apa maksud tanda ini?<br>…… Maksudnya dapat dicuci dengan mesin cuci."],
            ],
          },
        ],
      },
      {
        title: "“Kalimat”<br>Bentuk Biasa｝と 言って いました",
        blocks: [
          {
            text: "Jika mengutip perkataan orang ketiga menggunakan～と いいました (Pel.21), sedangkan jika menyampaikan perkataan orang ketiga menggunakan～と いって いました.",
            examples: [
              ["⑱ 田中さんは「あした 休みます」と 言って いました。", "Sdr. Tanaka berkata bahwa “Besok tidak masuk”."],
              ["⑲ 田中さんは あした 休むと 言って いました。", "Katanya sdr. Tanaka besok tidak masuk."],
            ],
          },
        ],
      },
      {
        title: "“Kalimat”<br>Bentuk Biasa｝と 伝えて いただけませんか",
        blocks: [
          {
            text: "Memakai jika meminta pesan secara halus.",
            examples: [
              ["⑳ ワンさんに「あとで 電話を ください」と 伝えて いただけませんか。", "Tolong sampaikan kepada sdr. Wang bahwa “Minta ditelepon nanti”."],
              ["㉑ すみませんが、渡辺さんに あしたの パーティーは 6時からだと 伝えて いただけませんか。", "Maaf; tolong sampaikan kepada sdri. Watanabe bahwa pesta besok dari pukul enam."],
            ],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 33",
    focus: "Memahami Bentuk Imperatif dan Bentuk Larangan, ～と 書いて あります／読みます, ～と いう 意味です, dan menyampaikan pesan orang lain.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Melakukan sesuai contoh dan urutan",
    items: [
      {
        title: "Kata Kerja<sub>1</sub> Bentuk た<br>Kata Benda の｝とおりに、Kata Kerja<sub>2</sub>",
        blocks: [
          {
            label: "1) <span class=\"grammar-pola-box\">Kata Kerja<sub>1</sub> Bentuk た とおりに、Kata Kerja<sub>2</sub></span>",
            text: "Menyatakan bahwa melakukan Kata Kerja<sub>2</sub> dengan keadaan atau cara yang sama dengan Kata Kerja<sub>1</sub>,",
            examples: [
              ["① わたしが やった とおりに、やって ください。", "Silakan lakukan sama seperti yang saya buat!"],
              ["② 見た とおりに、話して ください。", "Silakan berbicara sama seperti yang Anda lihat!"],
            ],
          },
          {
            label: "2) <span class=\"grammar-pola-box\">Kata Benda の とおりに、Kata Kerja</span>",
            text: "Menyatakan hal yang melakukan aksi tanpa terlepas dari standar yang ditunjuk oleh Kata Benda.",
            examples: [
              ["③ 線の とおりに、紙を 切って ください。", "Silakan menggunting kertas sesuai dengan garis!"],
              ["④ 説明書の とおりに、組み立てました。", "(Saya) Memasang sesuai dengan petunjuk."],
            ],
            note: "[Perhatian] とおり adalah Kata Benda, maka langsung menyertai Kata Tunjuk seperti この, その, あの kemudian dapat menyatakan bahwa bermaksud keadaan atau cara yang sama seperti ditunjuk oleh Kata Tunjuk tersebut.",
          },
          {
            examples: [["⑤ この とおりに、書いて ください。", "Silakan tulis sama seperti ini!"]],
          },
        ],
      },
      {
        title: "Kata Kerja<sub>1</sub> Bentuk た<br>Kata Benda の｝あとで、Kata Kerja<sub>2</sub>",
        blocks: [
          {
            text: "Menyatakan bahwa Kata Kerja<sub>2</sub> terjadi setelah Kata Kerja<sub>1</sub> atau Kata Benda.",
            examples: [
              ["⑥ 新しいのを 買った あとで、なくした 時計が 見つかりました。", "Setelah membeli yang baru, ditemukan arloji yang hilang."],
              ["⑦ 仕事の あとで、飲みに 行きませんか。", "Setelah selesai bekerja, bagaimana kalau pergi minum?"],
            ],
          },
          {
            text: "Jika dibandingkan dengan Kata Kerja Bentuk て から yang menyatakan arti yang sama (Lihat Pel.16), menggunakannya jika mengfokuskan hubungan waktu yang pra dan pasca. Kemudian berbeda dengan Kata Kerja Bentuk て から, Kata Kerja<sub>1</sub> atau Kata Benda tidak bernuansa sebagai dasar pikiran atau aksi persiapan utuk Kata Kerja<sub>2</sub>.",
          },
        ],
      },
      {
        title: "Kata Kerja<sub>1</sub> Bentuk て<br>Kata Kerja<sub>1</sub>（Bentuk ない）ないで｝Kata Kerja<sub>2</sub>",
        blocks: [
          {
            label: "1) Kata Kerja<sub>1</sub> menyatakan aksi dan keadaan yang disertai Kata Kerja<sub>2</sub>. Misalnya dalam contoh kalimat ⑧ dan ⑨, ketika aksi たべます dilakukan, dijelaskan untuk memakai atau tidaknya kecap asin. Aksi dari unsur pokok kalimat Kata Kerja<sub>1</sub> dan Kata Kerja<sub>2</sub> adalah sama.",
            examples: [
              ["⑧ しょうゆを つけて 食べます。", "Makan dibubuhkan kecap asin."],
              ["⑨ しょうゆを つけないで 食べます。", "Makan tanpa kecap asin."],
            ],
          },
          {
            label: "2) Dalam Kata Kerja<sub>1</sub> (Bentuk ない) ないで Kata Kerja<sub>2</sub>, terdapat pula cara penggunaan untuk menyatakan memilih salah satunya (Kata Kerja<sub>2</sub>) di antara aksi yang tidak dapat dilakukan secara bersamaan (Kata Kerja<sub>1</sub>, Kata Kerja<sub>2</sub>).",
            examples: [["⑩ 日曜日は どこも 行かないで、うちで ゆっくり 休みます。", "Hari Minggu tidak pergi ke mana-mana, tetapi beristirahat santai-santai di rumah."]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 34",
    focus: "Melakukan sesuatu sesuai contoh dengan とおりに, menyatakan urutan dengan あとで, dan keadaan penyerta dengan ～て／～ないで.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Syarat dan saran",
    items: [
      {
        title: "Cara membuat Bentuk Syarat",
        suffix: "(Lihat Buku Induk Pel.35 Latihan A1)",
        noBox: true,
        blocks: [
          {
            text: "Kelompok I: Bunyi dari kolom い sebagai bunyi terakhir dari Bentuk ます diubah menjadi bunyi kolom え kemudian dibubuhkan ば.<br>Kelompok II: Dibubuhkan れば pada Bentuk ます.<br>Kelompok III: し－ます → すれば　　き－ます → くれば",
            note: "[Perhatian] Jika Bentuk Negatif dari Kata Kerja (Contoh: いかない) diubah menjadi Bentuk Syarat, dengan membubuhkan なければ pada Bentuk ない (Contoh: いか).",
          },
          {
            text: "Kata Sifat い: い diubah menjadi ければ.<br>Kata Sifat な: Dibubuhkan なら pada Bentuk yang dihilangkan な.<br>Kata Benda: Dibubuhkan なら.",
          },
        ],
      },
      {
        title: "Bentuk Syarat、～",
        blocks: [
          {
            label: "1) Pada hal awal yang menyatakan syarat yang diperlukan untuk mencapai hal-hal pada bagian belakang (klausa pokok).",
            examples: [
              ["① ボタンを 押せば、窓が 開きます。", "Kalau menekan tombol, jendelanya terbuka."],
              ["② 彼が 行けば、わたしも 行きます。", "Kalau dia pergi, saya juga pergi."],
              ["③ あした 都合が よければ、来て ください。", "Jika besok ada waktu, silakan datang."],
              ["④ いい 天気なら、向こうに 島が 見えます。", "Kalau cuaca baik, terlihat pulau di selebah sana."],
            ],
          },
          {
            label: "2) Untuk merespon perkataan lawan bicara atau suatu keadaan, menyatakan keputusan si pembicara.",
            examples: [
              ["⑤ ボールペンが ないんですが。<br>……ボールペンが なければ、鉛筆で 書いて ください。", "Tidak ada bolpoin...<br>…… Kalau tidak ada bolpoin, silakan tulis dengan pensil."],
              ["⑥ あしたまでに レポートを 出さなければ なりませんか。<br>……無理なら、金曜日までに 出して ください。", "Apakah (saya) harus menyerahkan laporan sampai dengan besok?<br>…… Kalau tidak bisa, serahkan sampai dengan hari Jumat."],
            ],
          },
          {
            text: "Pada dasarnya, dalam hal bagian belakang (klausa pokok) tidak akan diletakkan ekspresi mengenai keinginan, harapan, perintah, permintaan dan lain-lainya, tetapi jika subjek antara hal awal dan belakangnya berbeda (②), atau predikat dari hal awal secara keadaan (③ dan ⑤) dapat digunakan ekspresi tersebut.",
          },
          {
            text: "[Referensi] Perbandingan dengan ekspresi mirip yang telah dipelajari sampai dengan pelajaran ini",
          },
          {
            label: "1) ～と (Pel.23)",
            text: "～と menyatakan bahwa jika terjadi aksi atau situasi di depan と, secara pasti mencapai keadaan, aksi yang dinyatakan oleh klausa pokok yang disusulkanya di belakang, fenomena atau situasi. Pada bagian belakang (kalimat pokok) tidak digunakan ekspresi keinginan, harapan, perintah, permintaan dan lain-lain.",
            examples: [["⑦ ここを 押すと、ドアが 開きます。", "Kalau menekan di sini, pintunya terbuka."]],
          },
          {
            text: "⑦ dapat menyatakan dengan menggunakan～ば.",
            examples: [["⑧ ここを 押せば、ドアが 開きます。", "Jika menekan di sini, pintunya terbuka."]],
          },
          {
            label: "2) ～たら (Pel.25)",
            text: "～たら mempunyai dua cara penggunaan yaitu, (1) cara penggunaan untuk menyatakan syarat pengandaian, dan (2) cara penggunanan untuk jika sebelumnya jelas bahwa akan mencapai Kata Kerja Bentuk たら, setelah tercapai yang tersebut, akan mencapai aksi atau keadaan pada kalimat pokok yang menyusulinya. Untuk hal di belakang (kalimat pokok) dapat menggunakan ekspresi keinginan, harapan, perintah dan permintaan.",
            examples: [
              ["⑨ 東京へ 来たら、ぜひ 連絡して ください。", "Kalau datang ke Tokyo, silakan hubungi (saya)."],
              ["×東京へ 来ると、ぜひ 連絡して ください。", ""],
              ["×東京へ 来れば、ぜひ 連絡して ください。", ""],
              ["⑩ 田中さんが 東京へ 来れば、［わたしは］ 会いに 行きます。", "Kalau sdr.Tanaka datang ke Tokyo, saya pergi bertemu."],
            ],
          },
          {
            text: "Jika terdapat keinginan si pembicara pada kalimat pokok seperti ⑨, dapat memakai～たら, tetapi tidak dapat memakai～と,～ば. Dengan catatan bahwa seperti ⑩ subjek dari hal di depan dan belakang (kalimat pokok) berbeda, walaupun keinginan si pembicara terdapat pada hal di belakang (kalimat pokok),～ば dapat dipakai. Dengan demikian,～たら dapat dikatakan bahwa batas pemakaiannya paling luas, tetapi karena bahasa lisan maka jarang digunakan pada bahasa tertulis.",
          },
        ],
      },
      {
        title: "Kata Tanya Kata Kerja Bentuk Syarat いいですか",
        blocks: [
          {
            text: "Ekspresi untuk meminta masukan atau petunjuk dari lawan bicara. Dapat memakainya sama seperti～たら いいですか yang telah dipelajari pada Pel.26.",
            examples: [
              ["⑪ 本を 借りたいんですが、どう すれば いいですか。", "Ingin meminjam buku, bagaimana caranya?"],
              ["⑫ 本を 借りたいんですが、どう したら いいですか。", "Ingin meminjam buku, bagaimana caranya? (Pel.26)"],
            ],
          },
        ],
      },
      {
        title: "Kata Benda なら、～",
        blocks: [
          {
            text: "Kata Benda なら、～ digunakan pula jika merespon perkataan lawan bicara, kemudian memberikan informasi mengenai sesuatu hal tersebut.",
            examples: [["⑬ 温泉に 行きたいんですが、どこが いいですか。<br>……温泉なら、白馬が いいですよ。", "Ingin pergi ke permandian air panas, yang bagus di mana?<br>…… Kalau permandian air panas, Hakuba yang bagus."]],
          },
        ],
      },
      {
        title: "～は ありませんか（Kalimat Tanya Negatif）",
        blocks: [
          {
            examples: [["⑭ 2、3日 旅行を しようと 思って いるんですが、どこか いい 所は ありませんか。", "Saya pikir mau berjalan-jalan selama dua, tiga hari, apakah ada tempat yang Anda rekomendasikan?"]],
          },
          {
            text: "いい ところは ありませんか pada ⑭ artinya sama dengan いい ところは ありますか, tetapi bertanya dengan ありませんか, lawan bicara dengan mudah menjawab “tidak ada” maka dianggap cara bertanya yang menjaga perasaan lawan bicara. Dengan demikian, pada umumnya bentuk Tanya Negatif yang dijadikan cara untuk menanyakan secara halus. Ketika menjawab, menggunakan はい、あります atau いいえ、ありません.",
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 35",
    focus: "Membuat dan memakai Bentuk Syarat ～ば, membandingkannya dengan ～と／～たら, serta どう すれば いいですか, Kata Benda なら, dan ～は ありませんか.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Tujuan dan perubahan kebiasaan",
    items: [
      {
        title: "Kata Kerja<sub>1</sub> Bentuk Kamus<br>Kata Kerja<sub>1</sub>（Bentuk ない）ない｝ように、Kata Kerja<sub>2</sub>",
        blocks: [
          {
            text: "ように menunjukan objek dari Kata Kerja<sub>2</sub> untuk mencapai keadaan yang dinyatakan oleh～ように. Sebelum ように, digunakan Kata Kerja yang bukan keinginan Bentuk Kamus (①) (Contoh: Kata Kerja Potensial, わかります, みえます, きこえます, なります dan lain-lain), atau Kata Kerja Bentuk Negatif (②).",
            examples: [
              ["① 速く 泳げるように、毎日 練習して います。", "Setiap hari (saya) berlatih agar bisa berenang dengan cepat."],
              ["② 忘れないように、メモして ください。", "Tolong dicatat supaya tidak lupa."],
            ],
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk Kamus ように なります",
        blocks: [
          {
            label: "1) なります menyatakan keadaan. Jika dipakai Kata Kerja Potensial seperti わかります, atau みえます Kata Kerja Bentuk Kamus ように なります menyatakan perubahan dari keadaan tidak bisa menjadi keadaan bisa.",
            examples: [
              ["③ 毎日 練習すれば、泳げるように なります。", "Kalau setiap hari berlatih, bisa berenang."],
              ["④ やっと 自転車に 乗れるように なりました。", "Akhirnya bisa bersepeda."],
            ],
          },
          {
            label: "2) Jika menjawab dengan いいえ untuk Kalimat Tanya～ように なりましたか caranya sebagai berikut;",
            examples: [["⑤ ショパンの 曲が 弾けるように なりましたか。<br>……いいえ、まだ 弾けません。", "Apakah sudah bisa bermain musik Chopin?<br>…… Belum, belum bisa bermain."]],
            note: "[Perhatian] Dalam Buku Induk tidak menyinggung halnya, tetapi jika pada pola kalimat 2 dipakai Kata Kerja kecuali Kata Kerja Potensial, わかります, atau みえます maka bermakna bahwa dapat kebiasaan baru yang sebelumnya tidak ada (⑥).",
          },
          {
            examples: [["⑥ 日本人は 100年ぐらいまえから 牛肉や 豚肉を 食べるように なりました。", "Orang Jepang telah makan daging sapi dan daging babi sejak kira-kira seratus tahun yang lalu."]],
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk Kamus<br>Kata Kerja（Bentuk ない）ない｝ように します",
        blocks: [
          {
            label: "1) ～ように して います",
            text: "Menyatakan bahwa berusaha untuk melakukan suatu aksi secara kebiasan.",
            examples: [
              ["⑦ 毎日 運動して、何でも 食べるように して います。", "Setiap hari berolahraga dan berusaha untuk makan apa saja."],
              ["⑧ 歯に 悪いですから、甘い 物を 食べないように して います。", "Karena tidak baik untuk gigi, maka berusaha tidak makan makanan manis."],
            ],
          },
          {
            label: "2) ～ように して ください",
            text: "Ekspresi untuk meminta agar berusaha mencapai suatu aksi. Dibandingkan dengan～て／～ないで ください yang ungkapan permintaan secara langsung,～ように して ください adalah ungkapan tidak langsung maka menjadi ungkapan lebih halus daripada～て／～ないで ください. Digunakan seperti di bawah ini;",
            examples: [
              ["⑨ もっと 野菜を 食べるように して ください。", "Usahakan makan sayur-mayur yang lebih banyak."],
              ["⑩ 絶対に パスポートを なくさないように して ください。", "Sama sekali jangan sampai kehilangan paspor."],
            ],
            note: "[Perhatian]～ように して ください tidak dapat digunakan untuk permintaan pada saat itu juga.",
          },
          {
            examples: [
              ["⑪ すみませんが、塩を 取って ください。", "Maaf, tolong ambilkan saya garam."],
              ["×すみませんが、塩を 取るように して ください。", ""],
            ],
          },
        ],
      },
      {
        title: "早い→早く　　上手な→上手に",
        blocks: [
          {
            text: "Jika Kata Sifat menerangkan Kata Sifat atau Kata Kerja lain, mengubah Kata Sifat い menjadi～く, dan Kata Sifat な menjadi～に.",
            examples: [["⑫ 早く 上手に お茶が たてられるように なりたいです。", "(Saya) ingin menjadi cepat pandai membuat teh."]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 36",
    focus: "Menyatakan tujuan dengan ように, perubahan kemampuan atau kebiasaan dengan ように なります, usaha dengan ように します, dan bentuk kata keterangan dari Kata Sifat.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Kalimat pasif",
    items: [
      {
        title: "Kata Kerja Pasif",
        noBox: true,
        blocks: [
          {
            table: {
              headers: ["", "Kata Kerja Pasif<br>Bentuk Sopan", "Kata Kerja Pasif<br>Bentuk Biasa"],
              rows: [
                ["I", "かきます", "かかれます", "かかれる"],
                ["II", "ほめます", "ほめられます", "ほめられる"],
                ["III", "きます<br>します", "こられます<br>されます", "こられる<br>される"],
              ],
            },
          },
          {
            text: "(Lihat Buku Induk Pel.37 Latihan A1)<br>Kata Kerja Pasif dikonjugasi sebagai Kata Kerja Kelompok II.<br>Contoh: かかれます　かかれる　かかれ(ない)　かかれて",
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub>（orang<sub>1</sub>）は Kata Benda<sub>2</sub>（orang<sub>2</sub>）に Kata Kerja Pasif",
        blocks: [
          {
            text: "Pola kalimat yang perbuatan yang dilakukan oleh orang<sub>2</sub> terhadap orang<sub>1</sub> mengekspresikan dari pihak yang menerika perbuatan (orang<sub>1</sub>).<br>Menyatakan dengan cara bahwa orang<sub>1</sub> diangkat sebagai topik, kemudian pelaku (orang<sub>2</sub>) dibubuhkan Kata Bantu に.",
            examples: [
              ["先生が <u>わたし</u>を 褒めました。", "Guru yang memuji saya."],
              ["① <u>わたし</u>は 先生に 褒められました。", "Saya dipuji oleh guru."],
              ["母が <u>わたし</u>に 買い物を 頼みました。", "Ibu yang meminta kepada saya untuk berbelanja."],
              ["② <u>わたし</u>は 母に 買い物を 頼まれました。", "Saya diminta oleh ibu untuk berbelanja."],
            ],
          },
          {
            text: "Adakalanya selain manusia, benda yang bergerak (hewan, mobil dan lain-lain) menjadi pelaku.",
            examples: [["③ わたしは 犬に かまれました。", "Saya digigit anjing."]],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub>（orang<sub>1</sub>）は Kata Benda<sub>2</sub>（orang<sub>2</sub>）に<br>Kata Benda<sub>3</sub> を Kata Kerja Pasif",
        blocks: [
          {
            text: "Menyatakan bahwa orang<sub>2</sub> melakukan suatu perbuatan terhadap benda milik orang<sub>1</sub> (Kata Benda<sub>3</sub>), kemudian pada umumnya perbuatan tersebut sering dianggap gangguan oleh orang<sub>1</sub> (pemiliknya).",
            examples: [
              ["弟が <u>わたし</u>の パソコンを 壊しました。", "Adik laki-laki saya merusak PC saya."],
              ["④ <u>わたし</u>は 弟に パソコンを 壊されました。", "PC saya dirusak oleh adik laki-laki saya."],
            ],
          },
          {
            text: "Adakalanya selain manusia, benda yang bergerak (hewan, mobil dan lain-lain) menjadi pelaku.",
            examples: [["⑤ わたしは 犬に 手を かまれました。", "Tangan saya digigit anjing."]],
            note: "[Perhatian 1] Yang diangkat sebagai topik adalah bukan benda milik melainkan orang (pemilik) yang merasa terganggu akan perbuatan. Misalnya, ④ tidak menjadi わたしの パソコンは おとうとに こわされました.<br>[Perhatian 2] Pola kalimat ini dalam kebanyakan kasus berarti orang yang melakukan perbuatan yang menganggap perbuatan tersebut sebagai gangguan, maka perlu hati-hati.～て もらいます digunakan jika berterima kasih karena dilakukan sesuatu.",
          },
          {
            examples: [
              ["×わたしは 友達に 自転車を 修理されました。", ""],
              ["⑥ わたしは 友達に 自転車を 修理して もらいました。", "Saya dibantu oleh teman untuk memperbaiki sepeda."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda（benda/hal）が／は Kata Kerja Pasif",
        blocks: [
          {
            text: "Ketika kejelaskan suatu prihal dan tidak mempersoalkan orang yang melakukan perbuatan, maka adakalanya untuk mengekspresikan dengan memakai Kata Kerja Pasif yang benda atau prihal dijadikan sebagai subjek atau topik.",
            examples: [
              ["⑦ 大阪で 展覧会が 開かれました。", "Di Osaka diadakan pameran."],
              ["⑧ 電話は 19世紀に 発明されました。", "Telepon ditemukan pada abad kesembilan belas."],
              ["⑨ この 本は 世界中で 読まれて います。", "Buku ini dibaca di seluruh dunia."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda から／Kata Benda で つくります",
        blocks: [
          {
            text: "Jika membuat barang, bahan baku itu dinyatakan dengan から, dan bahan dinyatakan dengan で.",
            examples: [
              ["⑩ ビールは 麦から 造られます。", "Bir terbuat dari gandum."],
              ["⑪ 昔 日本の 家は 木で 造られました。", "Pada zaman dulu, perumahan Jepang dibuat dari kayu."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub> の Kata Benda<sub>2</sub>",
        blocks: [
          {
            examples: [["⑫ ビールは 麦から 造られます。<br>これが 原料の 麦です。", "Bir terbuat dari gandum.<br>Inilah bahan bakunya, yaitu gandum."]],
          },
          {
            text: "げんりょうの むぎ pada ⑫ bermaksud untuk menyebutkan bahwa bahan bakunya gandum. Sebagai contoh lain, ada ペットの いぬ (Pel.39), むすこの ハンス (Pel.43) dan lain-lain.",
          },
        ],
      },
      {
        title: "この／その／あの Kata Benda（Posisi）",
        blocks: [
          {
            text: "Kata Benda yang menyatakan posisi seperti うえ, した, なか, となり, ちかく dibubuhkan この, その, あの, kemudian Kata Petunjuk menyatakan hubungan posisi dengan benda yang ditunjuk.",
            examples: [["⑬ あの 中に 入れますか。", "Apakah bisa masuk ke dalam itu?"]],
          },
          {
            text: "あの なか pada ⑬ berarti あの たてものの なか.",
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 37",
    focus: "Membentuk dan memakai Kata Kerja Pasif untuk orang, benda milik, dan hal, serta から／で つくります, Kata Benda の Kata Benda, dan この／その／あの + posisi.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Nominalisasi dengan の",
    items: [
      {
        title: "の sebagai fungsi pembentukan Kata Benda",
        noBox: true,
        blocks: [
          {
            text: "の berfungsi sebagai membentukkan Kata Benda untuk bermacam-macam ekspresi. Kata Kerja, Kata Sifat dan Kata Benda yang disambung dengan の tidak dibentukkan sebagai bentuk sopan, tetapi bentuk biasa. Ekspresi yang terbentuk sebagai Kata Benda menjadi berbagai unsur seperti di bawah ini;",
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk Kamus のは Kata Sifat です",
        blocks: [
          {
            examples: [
              ["① テニスは おもしろいです。", "Tenis itu menarik."],
              ["② テニスを するのは おもしろいです。", "Bermain tenis menarik."],
              ["③ テニスを 見るのは おもしろいです。", "Menonton tenis menarik."],
            ],
          },
          {
            text: "Pola kalimat Kata Kerja Bentuk Kamus の sebagai topik yang ditandai dengan は. Kata Sifat yang sering digunakan untuk pola kalimat ini, yaitu むずかしい, やさしい, おもしろい, たのしい, たいへん［な］ dan lain-lain.<br>Dibandingkan dengan kalimat ① yang tidak memakai の, kalimat ② dan ③ yang memakai の secara kongkret menjelaskan hal bermain tenis dan hal menonton tenis adalah hal yang menarik.",
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk Kamus のが Kata Sifat です",
        blocks: [
          {
            examples: [
              ["④ わたしは 花が 好きです。", "Saya suka bunga."],
              ["⑤ わたしは 花を 育てるのが 好きです。", "Saya suka memelihara bunga."],
              ["⑥ 東京の 人は 歩くのが 速いです。", "Orang di Tokyo berjalannya cepat."],
            ],
          },
          {
            text: "Kata Kerja Bentuk Kamus の yang menjadi sasaran daripada Kata Sifat. Kata Sifat yang sering digunakan pada pola kalimat ini adalah Kata Sifat yang menyatakan kesukaan, keterampilan, kemampuan, misalnya すき［な］, きらい［な］, じょうず［な］, へた［な］, はやい, おそい dan lain-lainnya.",
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk Kamus のを 忘れました",
        suffix: "lupa...",
        blocks: [
          {
            examples: [
              ["⑦ かぎを 忘れました。", "Lupa kunci."],
              ["⑧ 牛乳を 買うのを 忘れました。", "Lupa membeli susu."],
              ["⑨ 車の 窓を 閉めるのを 忘れました。", "Lupa menutup jendela mobil."],
            ],
          },
          {
            text: "Contoh Kata Kerja Bentuk Kamus の yang ditandai dengan を. Menjelaskan isi mengenai hal yang dilupakan secara kongkret.",
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk Biasa のを 知って いますか",
        suffix: "Apakah Anda tahu...?",
        blocks: [
          {
            text: "Contoh Kata Kerja Bentuk Biasa の yang ditandai dengan を. Digunakan ketika menanyakan bahwa apakah tahu atau tidak mengenai isi kalimat secara kongkret.",
            examples: [["⑩ 鈴木さんが 来月 結婚するのを 知って いますか。", "Apakah Anda tahu sdr. Suzuki akan menikah pada bulan depan?"]],
            note: "[Perhatian] Perbedaan antara しりません dan しりませんでした:",
          },
          {
            examples: [
              ["⑪ 木村さんに 赤ちゃんが 生まれたのを 知って いますか。<br>……いいえ、知りませんでした。", "Apakah Anda tahu bahwa sdri. Kimura telah melahirkan?<br>…… Tidak, tidak tahu."],
              ["⑫ ミラーさんの 住所を 知って いますか。<br>……いいえ、知りません。", "Apakah Anda tahu alamat sdr. Miller?<br>…… Tidak, tidak tahu."],
            ],
          },
          {
            text: "Pada ⑪, lawan bicara tidak memiliki informasi bahwa bayi telah lahir, tetapi dengan pertanyaan dia mendapatkan informasinya, maka menjawab dengan しりませんでした. Sedangankan pada ⑫, sebelum pertanyaan dan dengan pertanyaan pun, tidak mempunyai informasi maka menjawab dengan しりません.",
          },
        ],
      },
      {
        title: "Kata Kerja<br>Kata Sifat い｝Bentuk Biasa<br>Kata Sifat な<br>Kata Benda<sub>1</sub>｝Bentuk Biasa ～だ→～な｝のは Kata Benda<sub>2</sub> です",
        blocks: [
          {
            text: "Pola kalimat sebagai cara ungkapan untuk menekankan Kata Benda<sub>2</sub>.",
            examples: [["⑬ 初めて 会ったのは いつですか。<br>……3年まえです。", "Kapan pertama kali bertemu?<br>…… Tiga tahun yang lalu."]],
          },
          {
            text: "Pada ⑬ hal yang si pembicara ingin tanyai adalah hal mengenai pertama kalinya bertemu, dan secara khusus kapan waktunya.<br>Pola kalimat ini sering digunakan ketika mengoreksikan perkataan lawan bicara seperti ⑭.",
            examples: [["⑭ バンコクで 生まれたんですか。<br>……いいえ、生まれたのは チェンマイです。", "Lahir di Bangkok?<br>…… Tidak, lahirnya di Chiang Mai."]],
          },
          {
            text: "Unsur pokok pada kalimat sebelum～のは ditunjuk dengan が, tetapi bukan dengan は.",
            examples: [["⑮ 父が 生まれたのは 北海道の 小さな 村です。", "Tempat ayah saya lahir adalah sebuah desa kecil di Hokkaido."]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 38",
    focus: "Membentuk Kata Benda dengan の: のは／のが Kata Sifat, のを 忘れました, のを 知って いますか, dan ～のは Kata Benda です untuk penekanan.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Sebab dan alasan",
    items: [
      {
        title: "～て（で）、～",
        blocks: [
          {
            text: "Pada Pelajaran 16 dan Pelajaran 34 telah dipelajari pola kalimat mengenai～て（で）、～. Di sini kita belajar cara penggunaan untuk menyatakan sebab atau alasan yang dikarenakan oleh hal di bagian depan kalimat (bagian～て（で）), kemudian menyatakan akibat yang didatangkan oleh hal di bagian belakang kalimat yang disebabkan oleh hal di bagian depan kalimat. Pada bagian belakang tidak digunakan ekspresi keinginan atau keadaan.",
          },
          {
            label: "1) <span class=\"grammar-pola-box\">Kata Kerja Bentuk て<br>Kata Kerja（Bentuk ない）なくて<br>Kata Sifat い（～い）→～くて<br>Kata Sifat な［な］→で｝、～</span>",
            text: "Untuk hal di bagian belakang kalimat kebanyakan terletak ekspresi sebagai berikut;",
          },
          {
            label: "(1) Kata Kerja atau Kata Sifat yang menyatakan perasaan: びっくりします, あんしんします, こまります, さびしい, うれしい, ざんねん［な］ dan lain-lainnya.",
            examples: [
              ["① ニュースを 聞いて、びっくりしました。", "(Saya) Kaget karena mendengar berita."],
              ["② 家族に 会えなくて、寂しいです。", "(Saya) Kesepian karena tidak dapat bertemu dengan keluarga."],
            ],
          },
          {
            label: "(2) Kata Kerja atau ekspresi yang menyatakan potensial atau keadaan",
            examples: [
              ["③ 土曜日は 都合が 悪くて、行けません。", "(Saya) Tidak bisa pergi karena berhalangan pada hari Sabtu."],
              ["④ 話が 複雑で、よく わかりませんでした。", "Ceritanya rumit maka kurang mengerti."],
              ["⑤ 事故が あって、バスが 遅れて しまいました。", "Bus terlambat karena mengalami kecelakaan."],
              ["⑥ 授業に 遅れて、先生に しかられました。", "(Saya) Dimarahi guru karena terlambat masuk kelas."],
            ],
            note: "[Perhatian] Jika menggunakan ekspresi yang mengandung keinginan pada hal di bagian belakang kalimat (keinginan, perintah, ajakan, permintaan), digunakan～から.",
          },
          {
            examples: [
              ["⑦ 危ないですから、機械に 触らないで ください。", "Jangan menyentuh mesin karena bahaya."],
              ["×危なくて、機械に 触らないで ください。", ""],
            ],
          },
          {
            label: "2) <span class=\"grammar-pola-box\">Kata Benda で</span>",
            text: "Kata Benda, kebanyakan menyatakan fenomena alam, kejadian atau peristiwa seperti じこ, じしん, かじ dan lain-lain.",
            examples: [
              ["⑧ 地震で ビルが 倒れました。", "Gedung roboh karena terjadi gempa bumi."],
              ["⑨ 病気で 会社を 休みました。", "(Saya) Tidak masuk kerja karena sakit."],
            ],
          },
        ],
      },
      {
        title: "Kata Kerja<br>Kata Sifat い｝Bentuk Biasa<br>Kata Sifat な<br>Kata Benda｝Bentuk Biasa ～だ→～な｝ので、～",
        blocks: [
          {
            text: "Sama halnya dengan～から yang telah dipelajari pada Pelajaran 9,～ので juga menyatakan sebab atau alasan. ので sebenarnya menyatakan hubungan sebab akibat, kemudian bersifat untuk menjelaskan akibat yang dituntun oleh sebab, maka cocok untuk memperlembut ekspresi alasan meminta izin atau pengertian.",
            examples: [
              ["⑩ 日本語が わからないので、英語で 話して いただけませんか。", "Karena tidak mengerti bahasa Jepang, tolong berbicara dalam bahasa Inggris."],
              ["⑪ 用事が あるので、お先に 失礼します。", "Karena ada urusan, (saya) pamit duluan."],
            ],
          },
        ],
      },
      {
        title: "途中で",
        blocks: [
          {
            text: "とちゅうで bermakna suatu titik untuk berpindah ke suatu tempat. Digunakan bersama dengan Kata Kerja Bentuk Kamus atau Kata Benda の.",
            examples: [
              ["⑫ 実は 来る 途中で 事故が あって、バスが 遅れて しまったんです。", "Soalnya, di tengah perjalanan ada kecelakaan hingga bus terlambat."],
              ["⑬ マラソンの 途中で 気分が 悪く なりました。", "Ketika sedang maraton, badan kurang enak."],
            ],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 39",
    focus: "Menyatakan sebab dan akibat dengan ～て（で）, Kata Benda で, dan ～ので, serta 途中で.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Kalimat tanya di dalam kalimat",
    items: [
      {
        title: "Kata Kerja<br>Kata Sifat い｝Bentuk Biasa<br>Kata Sifat な<br>Kata Benda｝Bentuk Biasa ～だ｝か、～",
        blocks: [
          {
            text: "Pola kalimat ini digunakan jika Kalimat Tanya yang mengandung Kata Tanya dimasukkan ke dalam kalimat lain.",
            examples: [
              ["① JL107便は 何時に 到着するか、調べて ください。", "Tolong dicek, pukul berapa kedatangan penerbangan dengan nomor JL107!"],
              ["② 結婚の お祝いは 何が いいか、話して います。", "Sedang membicarakan tentang hadiah apa yang cocok untuk pernikahan."],
              ["③ わたしたちが 初めて 会ったのは いつか、覚えて いますか。", "Apakah (Anda) masih ingat kapan pertama kali kita bertemu?"],
            ],
          },
          {
            text: "Dengan catatan bahwa Kata Tanya bukan Kata Benda, maka bentuknya menjadi Kata Tanya か seperti ③.",
          },
        ],
      },
      {
        title: "Kata Kerja<br>Kata Sifat い｝Bentuk Biasa<br>Kata Sifat な<br>Kata Benda｝Bentuk Biasa ～だ｝か どうか、～",
        blocks: [
          {
            text: "Pola kalimat ini digunakan jika Kalimat Tanya yang tidak mengandung Kata Tanya dimasukkan ke dalam kalimat. Berhati-hatilah karena di belakang Bentuk Biasa か perlu どうか.",
            examples: [
              ["④ 忘年会に 出席するか どうか、20日までに 返事を ください。", "Tolong berikan jawaban sampai dengan tanggal 20 bahwa apakah bisa hadir pada pesta akhir tahun atau tidak."],
              ["⑤ その 話は ほんとうか どうか、わかりません。", "(Saya) Kurang tahu apakah cerita itu benar atau tidak."],
              ["⑥ まちがいが ないか どうか、調べて ください。", "Tolong diperiksa apakah ada kesalahan tidak!"],
            ],
          },
          {
            text: "Pada ⑥, bukan まちがいが あるか どうか, melainkan まちがいが ないか どうか karena si pembicara ingin memastikan hal yang まちがいが ない.",
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk て みます",
        blocks: [
          {
            text: "Pola Kalimat ini menyatakan arti melakukan aksi sebagai percobaan.",
            examples: [
              ["⑦ もう 一度 考えて みます。", "Coba berpikir sekali lagi."],
              ["⑧ この ズボンを はいて みても いいですか。", "Bolehkah mencoba memakai celana ini?"],
              ["⑨ 北海道へ 行って みたいです。", "(Saya) Ingin pergi ke Hokkaido."],
            ],
          },
          {
            text: "Seperti ⑨, kalau memakai bentuk～て みたい, dapat menyampaikan harapan diri sendiri secara lunak atau secara tidak langsung daripada～たい.",
          },
        ],
      },
      {
        title: "Kata Sifat い（～い）→～さ",
        blocks: [
          {
            text: "Kata Sifat い dengan mengubah い ke さ pada akhir kata, dapat membuat Kata Benda.<br>Contoh: 高い → 高さ　　長い → 長さ　　速い → 速さ",
            examples: [
              ["⑩ 山の 高さは どうやって 測るか、知って いますか。", "Apakah (Anda) tahu bagaimana caranya untuk mengukur tingginya gunung?"],
              ["⑪ 新しい 橋の 長さは 3,911 メートルです。", "Panjangnya jembatan baru 3.911 meter."],
            ],
          },
        ],
      },
      {
        title: "～でしょうか",
        blocks: [
          {
            text: "Kalau～でしょう (Pel.32) digunakan pada Kalimat Pertanyaan seperti ⑫, ungkapannya tidak meminta jawaban yang pasti, maka dapat memberi kesan yang lembut terhadap lawan bicara.",
            examples: [["⑫ ハンスは 学校で どうでしょうか。", "Bagaimana Hans di sekolah?"]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 40",
    focus: "Memasukkan kalimat tanya ke dalam kalimat dengan ～か dan ～か どうか, mencoba dengan ～て みます, Kata Sifat い→～さ, dan ～でしょうか.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Memberi dan menerima dengan hormat",
    items: [
      {
        title: "Ungkapan Pemberian dan Penerimaan",
        noBox: true,
        blocks: [
          {
            text: "Pada Pelajaran 7 dan Pelajaran 24 telah mempelajari ungkapan pemberian dan penerimaan untuk barang atau perbuatan. Selanjutnya pada pelajaran ini mempelajari ungkapan pemberian dan penerimaan yang mencerminkan hubungan antara pemberi dan penerimaya.",
          },
          {
            label: "1) <span class=\"grammar-pola-box\">Kata Benda<sub>1</sub>（orang）に Kata Benda<sub>2</sub> を いただきます</span>",
            text: "Jika pembicara menerima barang (Kata Benda<sub>2</sub>) dari orang yang berpangkat lebih tinggi (Kata Benda<sub>1</sub>) daripada diri sendiri, menggunakan いただきます, tetapi tidak menggunakan もらいます.",
            figure: { src: "assets/images/materi/p41-itadakimasu.png", alt: "Diagram: ［わたしは］ menerima dari ［部長に］ dengan いただきます, dari ［友達に］ dan ［子どもに］ dengan もらいます" },
            examples: [["① わたしは 社長に お土産を いただきました。", "Saya menerima oleh-oleh dari direktur."]],
          },
          {
            label: "2) <span class=\"grammar-pola-box\">［わたしに］ Kata Benda を くださいます</span>",
            text: "Jika orang yang berpangkat tinggi yang memberi barang kepada lawan bicaranya, menggunakan くださいます, tetapi tidak menggunakan くれます.",
            figure: { src: "assets/images/materi/p41-kudasaimasu.png", alt: "Diagram: ［部長が］ memberi ［わたしに］ dengan くださいます, ［友達が］ dan ［子どもが］ dengan くれます" },
            examples: [["② 社長が わたしに お土産を くださいました。", "Direktur memberikan saya oleh-oleh."]],
            note: "[Perhatian] Adakalanya いただきます, dan くださいます digunakan jika penerimanya anggota keluarga dari pembicara.",
          },
          {
            examples: [
              ["③ 娘は 部長に お土産を いただきました。", "Anak perempuan saya menerima oleh-oleh dari direktur."],
              ["④ 部長が 娘に お土産を くださいました。", "Kepala bagian memberikan anak perempuan saya oleh-oleh."],
            ],
          },
          {
            label: "3) <span class=\"grammar-pola-box\">Kata Benda<sub>1</sub> に Kata Benda<sub>2</sub> を やります</span>",
            text: "Jika pembicara memberi barang (Kata Benda<sub>2</sub>) terhadap tumbuhan dan fauna (Kata Benda<sub>1</sub>), sesungguhnya menggunakan やります. Tetapi, akhir-akhir ini banyak orang menggunkan あげます karena merasa lebih sopan daripada やります.",
            figure: { src: "assets/images/materi/p41-yarimasu.png", alt: "Diagram: ［わたしは］ memberi ［部長に］ dengan さしあげます, ［友達に］ dengan あげます, ［子どもに］［犬／花に］ dengan やります（あげます）" },
            examples: [
              ["⑤ わたしは 息子に お菓子を やりました（あげました）。", "Saya memberikan anak laki-laki saya kue."],
              ["⑥ わたしは 犬に えさを やりました。", "Saya memberi umpan pada anjing."],
            ],
          },
        ],
      },
      {
        title: "Pemberian dan Penerimaan Perbuatan",
        noBox: true,
        blocks: [
          {
            text: "Jika menyatakan pemberian dan penerimaan perbuatan digunakan いただきます, くださいます, dan やります. Diberikan contoh di bawah ini.",
          },
          {
            label: "1) <span class=\"grammar-pola-box\">Kata Kerja Bentuk て いただきます</span>",
            examples: [["⑦ わたしは 課長に 手紙の まちがいを 直して いただきました。", "Saya dibantu oleh kepala bagian untuk dikoreksikan kesalahan surat."]],
          },
          {
            label: "2) <span class=\"grammar-pola-box\">Kata Kerja Bentuk て くださいます</span>",
            examples: [
              ["⑧ 部長の 奥さんが ［わたしに］ お茶を 教えて くださいました。", "Istri kepala bagian mengajarkan saya cara membuat teh."],
              ["⑨ 部長が ［わたしを］ 駅まで 送って くださいました。", "Kepala bagian mengantarkan (saya) sampai stasiun."],
              ["⑩ 部長が ［わたしの］ レポートを 直して くださいました。", "Kepala bagian mengoreksikan laporan (saya)."],
            ],
          },
          {
            label: "3) <span class=\"grammar-pola-box\">Kata Kerja Bentuk て やります</span>",
            examples: [
              ["⑪ わたしは 息子に 紙飛行機を 作って やりました（あげました）。", "Saya membuat pesawat-pesawatan dari kertas untuk anak laki-laki. (membuatkan anak laki-laki)"],
              ["⑫ わたしは 犬を 散歩に 連れて 行って やりました。", "Saya membawa anjing jalan-jalan."],
              ["⑬ わたしは 娘の 宿題を 見て やりました（あげました）。", "Saya membantu adik saya untuk membuat PR-nya."],
            ],
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk て くださいませんか",
        blocks: [
          {
            text: "Dibandingkan dengan～て ください, ungkapan ini permintaan yang sikap halusnya lebih kuat. Akan tetapi, sikap halusnya kurang daripada～て いただけませんか yang telah dipelajari pada Pelajaran 26.",
            examples: [
              ["⑭ コピー機の 使い方を 教えて くださいませんか。", "Tolong ajarkan (saya) cara pemakaian mesin fotocopy."],
              ["⑮ コピー機の 使い方を 教えて いただけませんか。", "Apakah (Anda) bisa mengajarkan saya cara pemakaian mesin fotocopy? (Pel.26)"],
            ],
          },
        ],
      },
      {
        title: "Kata Benda に Kata Kerja",
        blocks: [
          {
            text: "Kata Bantu に yang digukanan dalam contoh kalimat di bawah ini menyatakan arti “sebagai tanda～” atau “sebagai kenang-kenangan～”.",
            examples: [
              ["⑯ 田中さんが 結婚祝いに この お皿を くださいました。", "Srd. Tanaka memberikan saya piring ini sebagai tanda ucapan selamat atas pernikahan (saya)."],
              ["⑰ 北海道旅行の お土産に 人形を 買いました。", "(Saya) Membeli boneka ini sebagai oleh-oleh perjalanan ke Hokkaido."],
            ],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 41",
    focus: "Memberi dan menerima barang serta perbuatan dengan いただきます, くださいます, やります, meminta dengan ～て くださいませんか, dan Kata Benda に Kata Kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Tujuan dan kegunaan",
    items: [
      {
        title: "Kata Kerja Bentuk Kamus<br>Kata Benda の｝ために、～",
        suffix: "untuk...",
        blocks: [
          {
            text: "ために menyatakan tujuan. Kata Benda の ために digunakan dengan maksud menguntungkan Kata Benda ④.",
            examples: [
              ["① 自分の 店を 持つ ために、貯金して います。", "Saya menabung uang untuk memiliki toko sendiri."],
              ["② 引っ越しの ために、車を 借ります。", "Saya meminjam/menyewa mobil untuk pindah rumah."],
              ["③ 健康の ために、毎朝 走って います。", "Saya berlari setiap pagi demi kesehatan."],
              ["④ 家族の ために、うちを 建てます。", "Saya membangun rumah untuk keluarga."],
            ],
            note: "[Perhatian 1] Sebagai ungkapan yang mirip terdapat～ように yang telah dipelajari pada Pelajaran 36, namun sebelum ために digunakan Kata Kerja Keinginan Bentuk Kamus, sedangkan sebelum ように digunakan Kata Kerja Non Keinginan Bentuk Kamus atau Kata Kerja Bentuk Negatif.",
          },
          {
            text: "Jika membandingkan kedua kalimat di bawah ini, ① di bawah ini bernuansa dengan tujuan untuk “memiliki toko sendiri” dengan keinginannya, kemudian untuk mencapainya menabung uang, sedangkan berbeda nuansanya yaitu ⑤ dengan tujuan untuk menabung uang agar menjadi kondisi “dapat memiliki toko sendiri”.",
            examples: [
              ["① 自分の 店を 持つ ために、貯金して います。", "Saya menabung uang untuk memiliki toko sendiri."],
              ["⑤ 自分の 店が 持てるように、貯金して います。", "Saya menabung uang agar dapat memiliki toko sendiri."],
            ],
            note: "[Perhatian 2] なります terdapat dua macam cara penggunaan, yaitu segabai Kata Kerja Keinginan dan Kata Kerja Non Keinginan.",
          },
          {
            examples: [
              ["⑥ 弁護士に なる ために、法律を 勉強して います。", "Saya belajar hukum untuk menjadi pengacara."],
              ["⑦ 日本語が 上手に なるように、毎日 勉強して います。", "Saya belajar setiap hari agar pandai berbahasa Jepang. (Pel.36)"],
            ],
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk Kamus の<br>Kata Benda｝に ～",
        blocks: [
          {
            text: "Pola Kalimat ini digunakan bersama dengan つかいます, いいです, べんりです, やくにたちます, ［じかん］が かかります dan lain-lainnya untuk menyatakan kegunaan atau tujuannya.",
            examples: [
              ["⑧ この はさみは 花を 切るのに 使います。", "Gunting ini digunakan untuk memotong bunga."],
              ["⑨ この かばんは 大きくて、旅行に 便利です。", "Tas ini besar sehingga praktis untuk perjalanan."],
              ["⑩ 電話番号を 調べるのに 時間が かかりました。", "Memakan waktu lama untuk memeriksa nomor telepon."],
            ],
          },
        ],
      },
      {
        title: "Kata Keterangan Bilangan は／も",
        blocks: [
          {
            text: "Kata Bantu は dibubuhkan pada Kata Keterangan Bilangan, menyatakan batas minimal yang dikisarkan oleh pembicara. Kata Bantu も dibubuhkan pada Kata Keterangan Bilangan, menyatakan bahwa pembicara merasa banyak jumlahnya.",
            examples: [["⑪ わたしは ［ボーナスの］ 半分は 貯金する つもりです。<br>……えっ、半分も 貯金するんですか。", "Saya berencana menabung separuhnya [bonus].<br>…… Eh! menabung separuhnya?"]],
          },
        ],
      },
      {
        title: "～に よって",
        blocks: [
          {
            text: "Jika Kata Kerja yang menyatakan penciptaan atau penemuan digunakan dalam bentuk pasif (Contoh: かきます, はつめいします, はっけんします dan lain-lainnya), pelaku ditunjuk dengan に よって, tetapi bukan dengan に.",
            examples: [["⑫ チキンラーメンは 1958年に 安藤百福さんに よって 発明されました。", "<i>Chicken Ramen</i> diciptakan oleh Bapak Ando Momofuku pada tahun 1958."]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 42",
    focus: "Menyatakan tujuan dengan ために, kegunaan dengan ～のに, Kata Keterangan Bilangan は／も, dan pelaku pasif dengan ～に よって.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Dugaan dari penampilan dan pergi lalu kembali",
    items: [
      {
        title: "～そうです",
        suffix: "rupanya～/kelihatannya～",
        blocks: [
          {
            label: "1) <span class=\"grammar-pola-box\">Kata Kerja（Bentuk ます）そうです</span>",
            text: "Pola kalimat ini menyatakan gejala akan terjadinya gerakan atau perubahan yang dinyatakan dengan Kata Kerja. Dapat digunakan bersama dengan Kata Keterangan いまにも, もうすぐ, これから dan lain-lainnya yang menyatakan masa gerakan atau perubahannya akan terjadi.",
            examples: [
              ["① 今にも 雨が 降りそうです。", "Mau hujan sekarang juga."],
              ["② もうすぐ 桜が 咲きそうです。", "Sebentar lagi <i>Sakura</i> mau mekar."],
              ["③ これから 寒く なりそうです。", "Rupanya mau menjadi dingin."],
            ],
          },
          {
            label: "2) <span class=\"grammar-pola-box\">Kata Sifat い（～い）<br>Kata Sifat な［な］｝そうです</span>",
            text: "Cara ungkapan untuk menjelaskan sifat dari pandangan/pengelihatan luar dengan menduga tanpa mengechek sesungguhnya.",
            examples: [
              ["④ この 料理は 辛そうです。", "Rupanya masakan ini pedas."],
              ["⑤ 彼女は 頭が よさそうです。", "Rupanya dia pintar."],
              ["⑥ この 机は 丈夫そうです。", "Rupanya meja ini kuat."],
            ],
            note: "[Perhatian] Ketika menyatakan perasaan orang, Kata Sifat yang menyatakan perasaan (うれしい, かなしい, さびしい dan lain-lainnya) tidak dapat digunakan langsung. Digunakan cara ungkapan setelah membubuhkan そうです dengan menduga dari pandangan/pengelihatan luar.",
          },
          {
            examples: [["⑦ うれしそうですね。<br>……ええ、実は きのう 結婚を 申し込まれたんです。", "Kelihatan senang, ya.<br>…… Ya, soalnya kemarin dilamar."]],
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk て 来ます",
        blocks: [
          {
            label: "1) Kata Kerja Bentuk て きます menyatakan arti bahwa pergi ke suatu tempat, dan melakulan suatu aksi, kemudian kembali.",
            examples: [["⑧ ちょっと たばこを 買って 来ます。", "Pergi beli rokok sebentar."]],
          },
          {
            text: "⑧ menyatakan tiga aksi, yakni (1) pergi ke tempat menjual rokok, (2) membeli rokok di situ, dan (3) kembali ke tempat semula.",
            figure: { src: "assets/images/materi/p43-tekimasu.png", alt: "Ilustrasi: (1) pergi ke mesin penjual rokok, (2) membeli rokok, (3) kembali ke tempat semula" },
          },
          {
            text: "Seperti ⑨, tempat beraksi yang dinyatakan dengan Kata Kerja Bentuk て ditunjuk dengan で, sedangkan seperti ⑩, jika dianggap sebagai asal usul barang yang ditunjuk dengan を (titik awal untuk keluar barang), digunakan から. Selain とって きます, Kata Kerja yang menggunakan から terdapat もって きます, はこんで きます dan lain-lainnya.",
            examples: [
              ["⑨ スーパーで 牛乳を 買って 来ます。", "Pergi membeli susu di pasar swalayan."],
              ["⑩ 台所から コップを 取って 来ます。", "Pergi mengambil gelas dari dapur."],
            ],
          },
          {
            label: "2) Kata Benda（tempat）へ 行って 来ます",
            text: "Sebelum きます memakai Kata Kerja いきます Bentuk て menyatakan arti untuk pergi ke suatu tempat kemudian kembali. Mengenai aksi yang dilakukan di tempat dimana pergi digunakan jika tidak diungkapkan secara khusus.",
            examples: [["⑪ 郵便局へ 行って 来ます。", "Pergi ke kantor pos."]],
          },
          {
            label: "3) 出かけて 来ます",
            text: "Sebelum きます menggunakan Kata Kerja でかけます Bentuk て menyatakan arti untuk pergi ke suatu tempat dan kembali. Digunakan jika secara khusus tidak berkata mengenai tempat di mana pergi dan tujuan.",
            examples: [["⑫ ちょっと 出かけて 来ます。", "Pergi sebentar."]],
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk て くれませんか",
        suffix: "Apakah (Anda) dapat ～ untuk ... ?",
        blocks: [
          {
            text: "Ungkapan permintaan yang lebih halus daripada～て ください, namun kurang halus daripada～て いただけませんか (Pel.26) atau～て くださいませんか (Pel.46). Ungkapan yang cocok untuk dipakai kepada orang yang setaraf atau di bawah dari diri sendiri.",
            examples: [["⑬ コンビニへ 行って 来ます。<br>……じゃ、お弁当を 買って 来て くれませんか。", "Pergi ke toko 24 jam.<br>…… Kalau begitu, tolong belikan saya bekal?"]],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 43",
    focus: "Menduga dari penampilan dengan ～そうです, menyatakan pergi lalu kembali dengan ～て 来ます, dan meminta dengan ～て くれませんか.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Terlalu, mudah, sulit, dan mengubah",
    items: [
      {
        title: "Kata Kerja Bentuk ます<br>Kata Sifat い（～い）<br>Kata Sifat な［な］｝すぎます",
        blocks: [
          {
            text: "～すぎます menunjuk bahwa tingkat dari perbuatan atau keadaan kelewatan. Biasanya digunakan jika perbuatan atau kondisinya tidak menyenangkan.",
            examples: [
              ["① ゆうべ お酒を 飲みすぎました。", "Tadi malam (saya) minum terlalu banyak minuman keras."],
              ["② この セーターは 大きすぎます。", "<i>Sweater</i> ini terlalu besar."],
            ],
            note: "[Perhatian]～すぎます dikonjugasi sebagai Kata Kerja Kelompok II.<br>Contoh: のみすぎる　のみすぎ(ない)　のみすぎた",
          },
          {
            examples: [
              ["③ 最近の 車は 操作が 簡単すぎて、運転が おもしろくないです。", "Mobil pada akhir-akhir ini tidak menarik sebab operasinya terlalu mudah."],
              ["④ いくら 好きでも、飲みすぎると、体に 悪いですよ。", "Walaupun suka, kalau terlalu banyak minum tidak baik untuk badan."],
            ],
          },
        ],
      },
      {
        title: "Kata Kerja Bentuk ます｛やすいです<br>　　　　　　　　　 にくいです",
        blocks: [
          {
            label: "1) Jika Kata Kerja Bentuk ます adalah Kata Kerja Keinginan,～やすい bermakna bahwa melakukan aksi itu mudah, dan～にくい bermakna bahwa melakukan aksi itu sulit.",
            examples: [
              ["⑤ この パソコンは 使いやすいです。", "PC ini mudah dipakai."],
              ["⑥ 東京は 住みにくいです。", "Tokyo tidak nyaman untuk didiami."],
            ],
          },
          {
            text: "⑤ menyatakan bahwa PC memilili sifat untuk mudah dipakai, dan ⑥ menyatakan bahwa kota yang namanya Tokyo melibatkan kesulitan untuk didiami.",
          },
          {
            label: "2) Jika Kata Kerja Bentuk ます adalah bukan Kata Kerja secara keinginan,～やすい menyatakan akan terjadi aksi itu dengan mudah, dan～にくい menyatakan bahwa aksi itu jarang terjadi.",
            examples: [
              ["⑦ 白い シャツは 汚れやすいです。", "Kemaja putih mudah kotor."],
              ["⑧ 雨の 日は 洗濯物が 乾きにくいです。", "Pada hari yang hujan, cucian sulit mengering."],
            ],
            note: "[Perhatian]～やすい,～にくい dikonjugasi sama seperti Kata Sifat い.",
          },
          {
            examples: [
              ["⑨ この 薬は 砂糖を 入れると、飲みやすく なりますよ。", "Kalau memasukkan gula, obat ini menjadi mudah diminum."],
              ["⑩ この コップは 割れにくくて、安全ですよ。", "Gelas ini tidak mudah pecah dan aman."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda<sub>1</sub> を｛Kata Sifat い（～い）→～く<br>　　　　　　　Kata Sifat な［な］→～に<br>　　　　　　　Kata Benda<sub>2</sub> に｝します",
        blocks: [
          {
            text: "～く／～に なります yang telah dipelajari pada Pelajaran 19 adalah ungkapan untuk menyatakan perubahan unsur pokok, sedangkan～く／～に します adalah ungkapan untuk menyatakan mengubah obyek (Kata Benda<sub>1</sub>).",
            examples: [
              ["⑪ 音を 大きく します。", "Mengeras bunyi."],
              ["⑫ 部屋を きれいに します。", "Membersihkan kamar."],
              ["⑬ 塩の 量を 半分に しました。", "Mengurangi jumlah garam sampai setengah."],
            ],
          },
        ],
      },
      {
        title: "Kata Benda に します",
        blocks: [
          {
            text: "Pola kalimat ini menyatakan pilihan atau keputusan.",
            examples: [
              ["⑭ 部屋は シングルに しますか、ツインに しますか。", "Kamarnya mau <i>single</i> atau <i>twin</i>?"],
              ["⑮ 会議は あしたに します。", "Rapat diadakan besok."],
            ],
          },
        ],
      },
    ],
    focusLabel: "Fokus Pelajaran 44",
    focus: "Menyatakan berlebihan dengan ～すぎます, mudah/sulit dengan ～やすい／～にくい, mengubah obyek dengan ～く／～に します, dan memilih dengan Kata Benda に します.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Pengandaian lanjutan",
    items: [
          [
            "Vたら",
            "Syarat yang terjadi lebih dahulu sebelum hasil.",
            "時間が あったら、電話します。",
            "Jika ada waktu, saya telepon.",
          ],
          [
            "～場合は",
            "Menyatakan kondisi formal, misalnya pada pengumuman.",
            "遅れる 場合は、連絡してください。",
            "Jika terlambat, tolong hubungi.",
          ],
          [
            "～のに",
            "Menyatakan hasil yang berlawanan dengan harapan.",
            "薬を 飲んだのに、治りません。",
            "Walau minum obat, tidak sembuh.",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Tindakan yang terjadi bersamaan",
    items: [
        [
          "Vているあいだに",
          "Menyatakan suatu kejadian terjadi selama kegiatan lain berlangsung.",
          "寝ている あいだに、雨が 降りました。",
          "Saat saya tidur, hujan turun.",
        ],
        [
          "Vたところです",
          "Menyatakan tindakan baru saja selesai.",
          "いま ごはんを 食べたところです。",
          "Saya baru saja makan.",
        ],
        [
          "Vているところです",
          "Menyatakan tindakan sedang tepat berlangsung.",
          "いま 電話しているところです。",
          "Saya sedang menelepon.",
        ],
      ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Pola pasif lanjutan",
    items: [
          [
            "～と 言われます",
            "Menyampaikan perkataan orang kepada pembicara.",
            "先生に もっと 練習しなさいと 言われました。",
            "Saya diberi tahu guru agar lebih banyak berlatih.",
          ],
          [
            "～ように 言います",
            "Menyampaikan instruksi atau permintaan tidak langsung.",
            "母は 早く 寝るように 言いました。",
            "Ibu berkata agar tidur lebih cepat.",
          ],
          [
            "～と 伝えていただけませんか",
            "Meminta seseorang menyampaikan pesan dengan sopan.",
            "田中さんに 電話を くださいと 伝えていただけませんか。",
            "Bisakah Anda menyampaikan kepada Tanaka agar menelepon saya?",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Hubungan sebab dan tujuan",
    items: [
          [
            "～のは ～からです",
            "Menjelaskan alasan suatu keadaan dengan bentuk nominal.",
            "日本語を 勉強するのは 日本で 働きたいからです。",
            "Saya belajar Jepang karena ingin bekerja di Jepang.",
          ],
          [
            "～ために",
            "Menyatakan sebab formal atau tujuan.",
            "台風のために、電車が 止まりました。",
            "Karena topan, kereta berhenti.",
          ],
          [
            "～ように",
            "Menyatakan tujuan yang berkaitan kemampuan/keadaan.",
            "よく 見えるように、前に 座ります。",
            "Saya duduk di depan agar terlihat jelas.",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Bahasa hormat lanjutan",
    items: [
          [
            "お／ご～になります",
            "Menyatakan tindakan orang yang dihormati.",
            "部長は もう お帰りに なりました。",
            "Kepala bagian sudah pulang.",
          ],
          [
            "お／ご～ください",
            "Meminta dengan sangat sopan.",
            "こちらを ご覧ください。",
            "Silakan lihat ini.",
          ],
          [
            "お／ご～します",
            "Merendahkan tindakan pembicara untuk menghormati lawan bicara.",
            "荷物を お持ちします。",
            "Saya akan membawakan barang Anda.",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Merangkum pengalaman belajar",
    items: [
          [
            "～たら／～なら",
            "Menyatakan pengandaian dan saran sesuai situasi.",
            "時間が あったら、復習してください。",
            "Jika ada waktu, silakan mengulang.",
          ],
          [
            "普通形と思います",
            "Menyatakan pendapat atau rencana pribadi.",
            "これからも 勉強を 続けようと 思います。",
            "Saya berpikir akan terus belajar.",
          ],
          [
            "～ようにしています",
            "Menyatakan kebiasaan yang diusahakan secara berkelanjutan.",
            "毎日 日本語を 読むようにしています。",
            "Saya membiasakan membaca bahasa Jepang setiap hari.",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
];
if (book2) {
  const course = book2.querySelector(".html-course");
  if (course) {
    course.innerHTML = MATERI_BOOK2_LESSONS.map((l, i) => buildLessonHtml(i + 26, l.title, l.items, l.focusLabel, l.focus, l.practiceLabel, l.practice)).join("");
    course.querySelector(".html-lesson").open = true;
    course.insertAdjacentHTML(
      "beforeend",
      '<article class="card"><h2>Buku 2 selesai disusun</h2><p style="color:var(--muted);line-height:1.65">Pelajaran 26–50 kini tersedia sebagai materi menengah. Gunakan flashcard dan tes untuk mengulang pola yang telah dipelajari.</p></article>',
    );
  }
}

/* 2 pelajaran Buku 1 yang SAAT INI TIDAK TAMPIL ke siswa - bug lama
   (bukan disebabkan reorganisasi ini). Dulu masing-masing punya index
   manual yang salah: installLesson(15, "Izin, larangan, dan keadaan")
   langsung ditimpa add(15, "Menghubungkan informasi") yang dipanggil
   sesudahnya (index sama), dan add(25, "Pengandaian dan syarat") memakai
   index di luar batas 25 elemen Buku 1 sehingga tidak pernah terpasang.
   Isinya disimpan di sini APA ADANYA supaya tidak hilang - SENGAJA belum
   dimasukkan ke MATERI_BOOK1_LESSONS karena menambahnya di akhir akan
   membuat Buku 1 jadi 27 pelajaran dan tabrakan nomor dengan Pelajaran 27
   Buku 2 (lihat MATERI_BOOK2_LESSONS). Keputusan mau ditaruh di mana/
   diberi nomor berapa ditunggu dari pemilik aplikasi - JANGAN dirender. */
const MATERI_BOOK1_UNPLACED_LESSONS = [
  {
    title: "Izin, larangan, dan keadaan",
    items: [
    [
      "Vてもいいです",
      "Meminta atau memberi izin melakukan sesuatu.",
      "ここで 写真を 撮っても いいですか。",
      "Bolehkah memotret di sini?",
    ],
    [
      "Vてはいけません",
      "Menyatakan larangan atau aturan.",
      "ここで タバコを 吸っては いけません。",
      "Tidak boleh merokok di sini.",
    ],
    [
      "Vています sebagai keadaan",
      "Selain aksi sedang berlangsung, pola ini dapat menunjukkan pekerjaan, kebiasaan, atau keadaan.",
      "わたしは 銀行で 働いています。",
      "Saya bekerja di bank.",
    ],
    [
      "知っています",
      "しっています berarti tahu/kenal; bentuk negatif umum adalah しりません.",
      "田中さんの 電話番号を 知っていますか。",
      "Apakah Anda tahu nomor telepon Tanaka?",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Meminta izin, memahami larangan, dan membedakan fungsi Vています.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Pengandaian dan syarat",
    items: [
    [
      "Vたら",
      "Menyatakan jika/ketika kondisi terjadi.",
      "雨が 降ったら、行きません。",
      "Jika hujan, saya tidak pergi.",
    ],
    [
      "A／Nだったら",
      "Menyatakan pengandaian untuk kata sifat atau kata benda.",
      "ひまだったら、来てください。",
      "Jika senggang, silakan datang.",
    ],
    [
      "Vても",
      "Hasil tidak berubah walaupun kondisi terjadi.",
      "高くても、この かばんを 買います。",
      "Walaupun mahal, saya membeli tas ini.",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Membuat pengandaian dan menyatakan kondisi.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
];
}
