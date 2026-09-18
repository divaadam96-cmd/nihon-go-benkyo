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
         (mis. Pelajaran 3 pola 5 "Daftar こ／そ／あ／ど"). */
  const normalize = (item) =>
    Array.isArray(item)
      ? { pola: item[0], suffix: "", blocks: [{ text: item[1], examples: [[item[2], item[3]]], note: item[4] }] }
      : { pola: item.title, suffix: item.suffix || "", blocks: item.blocks };
  const renderExample = ([contoh, arti]) =>
    `<div class="grammar-example"><span class="grammar-jp">${contoh}</span><span class="grammar-meaning">${arti}</span></div>`;
  const renderTable = (table) =>
    `<table class="grammar-table"><thead><tr><th></th>${table.headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${table.rows.map((row) => `<tr>${row.map((cell, i) => `<${i === 0 ? "th" : "td"}>${cell}</${i === 0 ? "th" : "td"}>`).join("")}</tr>`).join("")}</tbody></table>`;
  const renderBlock = (b) =>
    `<div class="grammar-block">${b.label ? `<p class="grammar-subhead">${b.label}</p>` : ""}${b.text ? `<p>${b.text}</p>` : ""}${(b.examples || []).map(renderExample).join("")}${b.table ? renderTable(b.table) : ""}${b.note ? `<p class="grammar-important-note">${b.note}</p>` : ""}</div>`;
  const renderPoint = (item, i) => {
    const { pola, suffix, blocks } = normalize(item);
    const heading = `<h3><span class="grammar-pola-number">${i + 1}. </span><span class="grammar-pola-box">${pola}</span>${suffix ? `<span class="grammar-pola-suffix"> ${suffix}</span>` : ""}</h3>`;
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
    title: "Kalimat nominal dasar",
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
    items: [["Alat/sarana で V", "で menunjukkan alat, cara, atau bahasa yang digunakan untuk melakukan kegiatan. Dalam pola ini, bagian sebelum で menjawab pertanyaan dengan apa atau memakai bahasa apa.", "はしで 食べます。", "Makan dengan sumpit."], ["「kata/kalimat」は ～語で 何ですか", "Pertanyaan ini dipakai untuk menanyakan bagaimana menyatakan sebuah kata atau kalimat dalam bahasa lain. Nama bahasa ditempatkan sebelum で.", "「Thank you」は 日本語で 何ですか。……「ありがとう」です。", "“Thank you” dalam bahasa Jepang apa? …“Arigatou”."], ["Orang に N を あげます dan sejenisnya", "あげます、かします、dan おしえます menyatakan memberi barang atau informasi kepada seseorang. Penerima ditandai dengan に.", "わたしは 木村さんに 花を あげました。", "Saya memberikan bunga kepada Sdr. Kimura."], ["Orang に N を もらいます dan sejenisnya", "もらいます、かります、dan ならいます menyatakan menerima barang, meminjam, atau belajar dari seseorang. Orang sumber ditandai dengan に; から juga dapat dipakai terutama untuk organisasi.", "わたしは 山田さんに 花を もらいました。", "Saya mendapatkan bunga dari Sdr. Yamada."], ["もう Vました", "もう berarti sudah. Pola ini dipakai dengan kata kerja bentuk lampau untuk menyatakan kegiatan telah selesai. Jawaban negatifnya menggunakan いいえ、まだです atau まだ Vていません.", "もう 荷物を 送りましたか。……はい、もう 送りました。", "Apakah barang sudah dikirim? …Ya, sudah dikirim."], ["Menghilangkan partikel", "Dalam percakapan santai, partikel tertentu dapat dihilangkan bila hubungan makna sudah jelas. Penghilangan ini tidak selalu cocok untuk bahasa formal atau tulisan.", "この スプーン、すてきですね。", "Sendok ini bagus, ya."]],
    focusLabel: "Fokus Pelajaran 7",
    focus: "Menjelaskan alat dan bahasa, memberi/menerima, serta menyatakan pekerjaan yang sudah selesai.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat dialog singkat tentang meminjam buku, mengajari bahasa, dan mengirim hadiah kepada teman.",
  },
  {
    title: "Kata sifat dan kesan",
    items: [["Kata sifat", "Kata sifat menjelaskan kondisi atau sifat kata benda. Ada dua jenis utama: い形容詞 dan な形容詞. Keduanya memiliki perubahan bentuk yang berbeda.", "富士山は 高いです。", "Gunung Fuji tinggi."], ["N は な形容詞です／い形容詞です", "Kata sifat positif waktu nonlampau diakhiri です. Untuk bentuk negatif, な形容詞 memakai じゃありません, sedangkan い形容詞 mengubah い menjadi くないです. Pertanyaan dijawab dengan kata sifat, bukan そうです.", "あそこは 静かじゃありません。", "Di sana tidak tenang."], ["な形容詞なN／い形容詞N", "Saat menerangkan kata benda, な形容詞 diikuti な sedangkan い形容詞 langsung ditempatkan di depan kata benda. Pola ini membentuk frasa kata benda yang lebih rinci.", "ワット先生は 親切な 先生です。", "Bapak Watt adalah guru yang baik hati."], ["～が、～", "が menyambungkan dua kalimat yang memiliki hubungan berlawanan atau paradoks. Informasi yang dianggap positif biasanya diletakkan lebih dahulu, kemudian kontrasnya menyusul.", "日本の 食べ物は おいしいですが、高いです。", "Makanan Jepang enak, tetapi mahal."], ["とても／あまり", "とても berarti sangat dan digunakan pada kalimat positif. あまり berarti tidak begitu dan umumnya dipakai bersama bentuk negatif.", "これは とても 有名な 映画です。", "Ini film yang sangat terkenal."], ["N は どうですか", "Pola ini menanyakan pendapat, kesan, atau keadaan mengenai benda, tempat, dan pengalaman lawan bicara.", "日本の 生活は どうですか。……楽しいです。", "Bagaimana kehidupan di Jepang? …Menyenangkan."], ["N1 は どんな N2 ですか", "どんな menanyakan keadaan atau sifat seseorang/benda, lalu harus diikuti kata benda yang dijelaskan.", "奈良は どんな 町ですか。……古い 町です。", "Nara kota bagaimana? …Kota yang lama."], ["そうですね", "Selain menyetujui lawan bicara, そうですね dapat memberi waktu bagi pembicara untuk berpikir sebelum menjawab pertanyaan tentang kesan atau pendapat.", "お仕事は どうですか。……そうですね。忙しいですが、おもしろいです。", "Bagaimana pekerjaan? …Hmm. Sibuk, tetapi menarik."]],
    focusLabel: "Fokus Pelajaran 8",
    focus: "Mendeskripsikan sifat, bertanya kesan, membuat frasa kata sifat, dan menyatakan kontras.",
    practiceLabel: "Latihan mandiri",
    practice: "Pilih tiga tempat atau benda. Jelaskan masing-masing dengan い形容詞 dan な形容詞, lalu bandingkan dengan ～が.",
  },
  {
    title: "Kesukaan, kemampuan, dan jumlah",
    items: [
    [
      "N が わかります／すきです",
      "Pola ini menyatakan hal yang dipahami, disukai, dibenci, dikuasai, atau kurang dikuasai (わかります・すきです・きらいです・じょうずです・へたです). Objek perasaan/kemampuan memakai が.",
      "わたしは 日本語が わかります。",
      "Saya mengerti bahasa Jepang.",
    ],
    [
      "どんな N",
      "Selain jawaban ya/tidak, pertanyaan どんな dapat dijawab dengan menyebutkan nama secara konkret.",
      "どんな スポーツが 好きですか。……サッカーが 好きです。",
      "Suka olahraga apa? ……Suka sepak bola.",
    ],
    [
      "よく／だいたい／たくさん／少し／あまり／全然",
      "Kata keterangan tingkat (よく・だいたい・あまり・ぜんぜん) dan kuantitas (たくさん・すこし) diletakkan sebelum kata kerja; あまり dan ぜんぜん dipakai dengan bentuk negatif. Ketiganya (すこし・あまり・ぜんぜん) juga bisa menerangkan kata sifat.",
      "英語が 少し わかります。",
      "Mengerti bahasa Inggris sedikit.",
    ],
    [
      "～から、～",
      "から menandai alasan; alasan diletakkan sebelum akibatnya, atau dijawab tersendiri dengan ～からです.",
      "時間が ありませんから、新聞を 読みません。",
      "Karena tidak ada waktu, saya tidak membaca surat kabar.",
    ],
    [
      "どうして",
      "Kata tanya untuk menanyakan alasan, dijawab dengan ～から. どうしてですか dipakai untuk menanyakan alasan yang baru disebut lawan bicara tanpa mengulang kata-katanya.",
      "どうして 朝 新聞を 読みませんか。……時間が ありませんから。",
      "Mengapa pada pagi hari tidak membaca surat kabar? ……Sebab tidak ada waktu.",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Menyatakan kesukaan, kemampuan, keterangan tingkat, dan alasan.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Keberadaan benda dan makhluk",
    items: [
    [
      "N が あります／います",
      "あります dipakai untuk benda/tumbuhan; います untuk manusia/hewan.",
      "机の 上に 本が あります。",
      "Ada buku di atas meja.",
    ],
    [
      "Tempat に N が あります／います",
      "Menekankan benda atau makhluk yang ada di suatu tempat. Tanya benda pakai なにが, tanya orang pakai だれが (bukan なには／だれは).",
      "部屋に 猫が います。",
      "Ada kucing di kamar.",
    ],
    [
      "N は tempat に あります／います",
      "Menekankan lokasi dari benda atau makhluk yang telah diketahui. Pola ini juga bisa diganti Nは tempatです (どこ tidak dibubuhi に).",
      "銀行は 駅の 前に あります。",
      "Bank berada di depan stasiun.",
    ],
    [
      "Posisi N1 の N2",
      "Kata posisi seperti atas, bawah, depan, belakang, dalam, dan luar dihubungkan dengan の. Kata posisi ini juga bisa memakai で untuk menunjukkan tempat aksi.",
      "郵便局は 銀行の となりです。",
      "Kantor pos di sebelah bank.",
    ],
    [
      "N1 や N2",
      "や menyebutkan beberapa contoh benda secara mewakili (tidak lengkap), berbeda dari と yang menyebutkan semua; など bisa ditambahkan di belakang benda terakhir untuk arti dan lain-lain.",
      "箱の 中に 手紙や 写真が あります。",
      "Di dalam kotak ada surat dan foto, antara lain.",
    ],
    [
      "Konfirmasi pertanyaan",
      "Dalam percakapan, lawan bicara sering mengulang/menegaskan inti pertanyaan dulu sebelum menjawabnya.",
      "アジアストアは どこですか。……アジアストアですか。あの ビルの 中です。",
      "Di mana Asia Store? ……Asia Store? Di dalam gedung itu.",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Menjelaskan keberadaan dan posisi benda, orang, serta hewan.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Letak, lokasi, dan keberadaan",
    items: [
    [
      "Tempat あります／います",
      "Gunakan pola keberadaan untuk menanyakan atau menjelaskan lokasi fasilitas dan orang.",
      "山田さんは 事務所に います。",
      "Sdr. Yamada ada di kantor.",
    ],
    [
      "Posisi relatif",
      "うえ、した、まえ、うしろ、みぎ、ひだり、なか、そと menjelaskan hubungan letak.",
      "かばんは いすの 下に あります。",
      "Tas berada di bawah kursi.",
    ],
    [
      "N1 や N2",
      "や menghubungkan contoh benda dalam daftar yang tidak lengkap; artinya antara lain.",
      "箱の 中に 本や ノートが あります。",
      "Di dalam kotak ada buku dan buku catatan, antara lain.",
    ],
    [
      "N1 の N2",
      "Pola ini memperinci hubungan lokasi atau kepemilikan.",
      "これは 会社の 電話です。",
      "Ini telepon perusahaan.",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Menggunakan kosakata posisi untuk menjelaskan denah dan lokasi.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Bilangan dan durasi",
    items: [
    [
      "Kata bantu bilangan",
      "Bilangan berubah menurut jenis benda, orang, hewan, atau urutan.",
      "クラスに 学生が 20人 います。",
      "Ada 20 mahasiswa di kelas.",
    ],
    [
      "Durasi",
      "～時間、～週間、～か月 menunjukkan lama waktu dan tidak memakai に.",
      "日本語を 3か月 勉強しました。",
      "Saya belajar Jepang selama tiga bulan.",
    ],
    [
      "Frekuensi",
      "～に～回 menunjukkan berapa kali dalam satu periode.",
      "1しゅうかんに 2回 テニスを します。",
      "Saya bermain tenis dua kali seminggu.",
    ],
    [
      "Berapa lama",
      "どのくらい menanyakan durasi atau jumlah waktu.",
      "日本に どのくらい いましたか。",
      "Berapa lama berada di Jepang?",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Menghitung orang/benda dan menyatakan durasi serta frekuensi.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Bentuk lampau dan perbandingan",
    items: [
    [
      "N／な形容詞 bentuk lampau",
      "です berubah menjadi でした; bentuk negatif lampau memakai じゃありませんでした.",
      "きのうは 休みでした。",
      "Kemarin libur.",
    ],
    [
      "い形容詞 bentuk lampau",
      "い berubah menjadi かったです; negatif lampau menjadi くなかったです.",
      "きのうは 寒かったです。",
      "Kemarin dingin.",
    ],
    [
      "N1 は N2 より Aです",
      "Membandingkan dua benda/orang dengan より.",
      "日本は インドネシアより 寒いです。",
      "Jepang lebih dingin daripada Indonesia.",
    ],
    [
      "N の中で N が いちばん Aです",
      "Menyatakan yang paling dalam suatu kelompok.",
      "日本で 富士山が いちばん 高いです。",
      "Di Jepang Gunung Fuji yang paling tinggi.",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Menceritakan keadaan lampau dan membuat perbandingan.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Keinginan dan harapan",
    items: [
    [
      "N が ほしいです",
      "Menyatakan keinginan memiliki benda.",
      "新しい くるまが ほしいです。",
      "Saya ingin mobil baru.",
    ],
    [
      "Vたいです",
      "Bentuk ます tanpa ます ditambah たいです untuk keinginan melakukan kegiatan.",
      "日本へ 行きたいです。",
      "Saya ingin pergi ke Jepang.",
    ],
    [
      "Tempatへ Vます-stem に行きます",
      "Menyatakan pergi ke tempat tertentu untuk melakukan kegiatan.",
      "デパートへ かいものに 行きます。",
      "Saya pergi ke department store untuk berbelanja.",
    ],
    [
      "どこか／なにか",
      "Menyatakan tempat atau benda yang tidak spesifik.",
      "なにか 飲みたいです。",
      "Saya ingin minum sesuatu.",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Menyampaikan keinginan, tujuan, dan rencana kegiatan.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Bentuk て dan permintaan",
    items: [
    [
      "Vてください",
      "Meminta seseorang melakukan tindakan dengan sopan.",
      "ここに 名前を 書いてください。",
      "Tolong tulis nama di sini.",
    ],
    [
      "Vています",
      "Menyatakan kegiatan yang sedang berlangsung atau keadaan berlanjut.",
      "いま 雨が 降っています。",
      "Sekarang sedang hujan.",
    ],
    [
      "Kelompok kata kerja",
      "Bentuk て berubah menurut kelompok kata kerja; hafalkan perubahan bunyinya.",
      "読んで、書いて、食べてください。",
      "Tolong baca, tulis, dan makan.",
    ],
    [
      "Urutan tindakan",
      "Bentuk て dapat dipakai untuk menghubungkan tindakan berurutan.",
      "朝 ごはんを 食べて、学校へ 行きます。",
      "Saya sarapan lalu pergi ke sekolah.",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Membentuk て dan memakainya untuk permintaan serta keadaan.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Menghubungkan informasi",
    items: [
    [
      "Vて",
      "Menyambungkan dua tindakan yang berkaitan.",
      "朝ごはんを 食べて、出かけます。",
      "Saya sarapan lalu pergi.",
    ],
    [
      "Aくて／Aで",
      "Menyambungkan kata sifat atau kata benda.",
      "この かばんは 安くて 便利です。",
      "Tas ini murah dan praktis.",
    ],
    [
      "Vてから、V",
      "Kata kerja kedua dilakukan setelah kata kerja pertama selesai.",
      "お金を 入れてから、ボタンを 押します。",
      "Setelah memasukkan uang, tekan tombolnya.",
    ],
    [
      "Nは Nが A",
      "Menjelaskan bahwa topik (N1) memiliki sifat N2.",
      "マリアさんは 髪が 長いです。",
      "Rambut Sdr. Maria panjang.",
    ],
    [
      "Nを + でます／おります",
      "を menandai titik awal atau tempat keberangkatan, bukan objek.",
      "梅田で 電車を 降ります。",
      "Turun dari kereta di Umeda.",
    ],
    [
      "どうやって",
      "Menanyakan cara atau sarana.",
      "どうやって 駅へ 行きますか。",
      "Bagaimana pergi ke stasiun?",
    ],
    [
      "どれ／どの N",
      "Menanyakan pilihan dari lebih dari tiga benda; どれ berdiri sendiri, どの diikuti kata benda.",
      "ミラーさんの 傘は どれですか。",
      "Yang mana payung Sdr. Miller?",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Menghubungkan kegiatan, sifat, urutan waktu, dan cara/pilihan.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Bentuk ない dan aturan",
    items: [
    [
      "Vないでください",
      "Meminta agar seseorang tidak melakukan sesuatu.",
      "ここで あそばないでください。",
      "Tolong jangan bermain di sini.",
    ],
    [
      "Vなければなりません",
      "Menyatakan kewajiban.",
      "くすりを 飲まなければなりません。",
      "Harus minum obat.",
    ],
    [
      "Vなくてもいいです",
      "Menyatakan sesuatu tidak wajib.",
      "あしたは 来なくても いいです。",
      "Besok tidak perlu datang.",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Memakai bentuk negatif untuk aturan dan kewajiban.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Bentuk kamus dan kemampuan",
    items: [
    [
      "V辞書形ことができます",
      "Menyatakan kemampuan atau kemungkinan.",
      "日本語を 話すことが できます。",
      "Saya bisa berbicara Jepang.",
    ],
    [
      "しゅみは V辞書形ことです",
      "Menyatakan hobi berupa aktivitas.",
      "しゅみは 本を 読むことです。",
      "Hobi saya membaca buku.",
    ],
    [
      "V辞書形まえに",
      "Menyatakan tindakan sebelum kegiatan lain.",
      "寝る まえに 本を 読みます。",
      "Saya membaca buku sebelum tidur.",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Memakai bentuk kamus untuk kemampuan dan hobi.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Pengalaman dan perubahan",
    items: [
    [
      "Vたことがあります",
      "Menyatakan pernah mengalami sesuatu.",
      "日本へ 行ったことが あります。",
      "Saya pernah pergi ke Jepang.",
    ],
    [
      "Nに なります",
      "Menyatakan perubahan menjadi keadaan/benda.",
      "来年 先生に なります。",
      "Tahun depan menjadi guru.",
    ],
    [
      "Aく／Aに なります",
      "Menyatakan perubahan sifat atau kondisi.",
      "だんだん 暑く なりました。",
      "Lambat-laun menjadi panas.",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Menceritakan pengalaman dan perubahan.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Bentuk biasa",
    items: [
    [
      "普通形",
      "Bentuk biasa dipakai dalam percakapan informal dan pola lanjutan.",
      "きょうは 行かない。",
      "Hari ini tidak pergi.",
    ],
    [
      "Vたことがあります",
      "Menyatakan pengalaman masa lalu.",
      "富士山に 登ったことが あります。",
      "Saya pernah mendaki Gunung Fuji.",
    ],
    [
      "Nに なります",
      "Menjelaskan perubahan keadaan.",
      "4月に 春に なります。",
      "Pada April menjadi musim semi.",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Mengenali bentuk informal dan pengalaman.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Gaya biasa dalam percakapan",
    items: [
    [
      "Bentuk biasa tanya",
      "Pertanyaan informal memakai intonasi atau の/か sesuai konteks.",
      "あした ひま？",
      "Besok senggang?",
    ],
    [
      "けれども／が",
      "Menyambungkan informasi yang berlawanan dengan gaya yang sesuai.",
      "安いけれども、便利です。",
      "Murah, tetapi praktis.",
    ],
    [
      "普通形と思います",
      "Menyampaikan pendapat dengan sopan.",
      "あしたは 雨が 降ると 思います。",
      "Saya pikir besok akan hujan.",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Menggunakan gaya biasa secara sesuai dalam dialog.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Pendapat dan kutipan",
    items: [
    [
      "普通形と思います",
      "Menyatakan pikiran atau dugaan.",
      "日本は きれいだと 思います。",
      "Saya pikir Jepang indah.",
    ],
    [
      "普通形といいます",
      "Menyampaikan ucapan atau informasi orang lain.",
      "田中さんは 来ると いいます。",
      "Tanaka berkata akan datang.",
    ],
    [
      "でしょう",
      "Menyatakan perkiraan atau konfirmasi ringan.",
      "あしたは いい天気でしょう。",
      "Besok mungkin cuacanya bagus.",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Menyampaikan pendapat dan informasi dari orang lain.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Klausa penjelas",
    items: [
    [
      "普通形 + N",
      "Klausa sebelum kata benda menerangkan kata benda tersebut.",
      "これは わたしが 買った 本です。",
      "Ini buku yang saya beli.",
    ],
    [
      "Subjek dalam klausa",
      "Subjek klausa lazim memakai が.",
      "あそこに いる 人は 先生です。",
      "Orang yang ada di sana adalah guru.",
    ],
    [
      "Menerangkan tempat/waktu",
      "Klausa dapat menerangkan berbagai kata benda.",
      "日本で 撮った 写真です。",
      "Ini foto yang diambil di Jepang.",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Membaca dan membuat anak kalimat penerang.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Waktu dan kondisi",
    items: [
    [
      "Vとき",
      "Menunjukkan waktu saat suatu keadaan/tindakan terjadi.",
      "日本へ 行くとき、パスポートが いります。",
      "Saat pergi ke Jepang, perlu paspor.",
    ],
    [
      "Vと",
      "Menunjukkan hasil yang terjadi secara alami atau selalu.",
      "この ボタンを 押すと、ドアが 開きます。",
      "Jika menekan tombol ini, pintu terbuka.",
    ],
    [
      "Bentuk sebelum とき",
      "Bentuk kata berubah sesuai urutan waktu dan jenis kata.",
      "寝るとき、電気を 消します。",
      "Saat tidur, saya mematikan lampu.",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Menyatakan waktu dan hubungan sebab-akibat alami.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.",
  },
  {
    title: "Memberi dan menerima bantuan",
    items: [
    [
      "Vてあげます",
      "Melakukan tindakan untuk orang lain.",
      "友達に 日本語を 教えてあげます。",
      "Saya mengajari teman bahasa Jepang.",
    ],
    [
      "Vてもらいます",
      "Menerima bantuan dari orang lain.",
      "友達に 手伝ってもらいました。",
      "Saya dibantu teman.",
    ],
    [
      "Vてくれます",
      "Orang lain melakukan bantuan untuk pembicara/pihaknya.",
      "先生が 本を 貸してくれました。",
      "Guru meminjamkan buku kepada saya.",
    ],
  ],
    focusLabel: "Fokus pelajaran",
    focus: "Memahami arah bantuan dari sudut pandang pembicara.",
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
    items: [["Bentuk biasa + んです", "～んです dipakai untuk menjelaskan alasan, keadaan, atau latar belakang suatu informasi. Sebelum んです digunakan bentuk biasa. Untuk kata benda dan な形容詞, gunakan ～なんです.", "どうして 遅れたんですか。……電車が 遅れたんです。", "Mengapa terlambat? …Karena keretanya terlambat."], ["Vていただけませんか", "Pola ini adalah cara sangat sopan untuk meminta seseorang melakukan sesuatu. Secara harfiah pembicara meminta lawan bicara berkenan melakukan bantuan untuknya.", "この 漢字を 読んで いただけませんか。", "Bisakah Anda berkenan membacakan kanji ini?"], ["Vたら いいですか", "Digunakan untuk meminta saran mengenai tindakan terbaik dalam suatu keadaan. Kata kerja memakai bentuk lampau た sebelum ら.", "ごみは どこに 捨てたら いいですか。", "Sampah sebaiknya dibuang di mana?"], ["N は bagaimana melakukan tindakan", "Topik dengan は dapat dipakai untuk menanyakan cara menangani benda tertentu, misalnya sampah, barang, atau dokumen. Jawaban menjelaskan tindakan dan tempat/cara yang tepat.", "この かさは どうしたら いいですか。", "Payung ini sebaiknya bagaimana?"]],
    focusLabel: "Fokus Pelajaran 26",
    focus: "Menjelaskan penyebab, meminta bantuan dengan sopan, dan meminta saran dalam situasi sehari-hari.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga pertanyaan: satu memakai んです, satu permintaan Vていただけませんか, dan satu saran Vたらいいですか.",
  },
  {
    title: "Bentuk potensial dan kemampuan",
    items: [
        [
          "Bentuk potensial",
          "Menyatakan bahwa seseorang mampu melakukan suatu tindakan.",
          "わたしは 日本語が 話せます。",
          "Saya bisa berbicara Jepang.",
        ],
        [
          "Kata kerja potensial",
          "Objek kemampuan lazim memakai が.",
          "この みせで カードが 使えます。",
          "Kartu dapat digunakan di toko ini.",
        ],
        [
          "見えます／聞こえます",
          "Menyatakan sesuatu terlihat atau terdengar secara alami.",
          "海が 見えます。",
          "Laut terlihat.",
        ],
        [
          "できます",
          "Menyatakan sesuatu selesai dibuat atau fasilitas tersedia.",
          "駅の 前に 新しい ホテルが できました。",
          "Hotel baru telah dibangun di depan stasiun.",
        ],
      ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Melakukan dua kegiatan",
    items: [
          [
            "Vますながら",
            "Menyatakan melakukan dua kegiatan sekaligus; kegiatan utama berada di bagian akhir.",
            "音楽を 聞きながら 勉強します。",
            "Saya belajar sambil mendengarkan musik.",
          ],
          [
            "Vています",
            "Menyatakan kebiasaan atau keadaan yang berlanjut.",
            "毎朝 ジョギングを しています。",
            "Saya joging setiap pagi.",
          ],
          [
            "し",
            "Menyebut alasan atau beberapa sifat secara berturut.",
            "この まちは 便利だし、静かです。",
            "Kota ini praktis dan tenang.",
          ],
          [
            "それで",
            "Menghubungkan sebab dan akibat yang logis.",
            "雨でした。それで、行きませんでした。",
            "Hujan. Karena itu, saya tidak pergi.",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Keadaan dan persiapan",
    items: [
          [
            "Vています",
            "Menyatakan keadaan hasil tindakan, bukan hanya aksi sedang berlangsung.",
            "窓が 閉まっています。",
            "Jendelanya tertutup.",
          ],
          [
            "Vてしまいます",
            "Menyatakan menyelesaikan sesuatu atau penyesalan atas kejadian.",
            "宿題を 忘れてしまいました。",
            "Saya terlanjur lupa PR.",
          ],
          [
            "Vますに 行きます",
            "Pergi ke suatu tempat dengan tujuan melakukan kegiatan.",
            "買い物に 行きます。",
            "Saya pergi berbelanja.",
          ],
          [
            "これ／それ／あれ",
            "Dapat menunjuk benda atau peristiwa dalam konteks percakapan.",
            "それは いい 考えです。",
            "Itu ide yang bagus.",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Persiapan dan perubahan keadaan",
    items: [
          [
            "Vてあります",
            "Menyatakan keadaan hasil tindakan yang dilakukan dengan tujuan tertentu.",
            "机の 上に メモが 置いてあります。",
            "Catatan diletakkan di atas meja.",
          ],
          [
            "Vておきます",
            "Melakukan sesuatu sebagai persiapan atau membiarkannya tetap begitu.",
            "旅行の 前に 切符を 買っておきます。",
            "Saya membeli tiket terlebih dahulu sebelum perjalanan.",
          ],
          [
            "Vますはじめます",
            "Menyatakan mulai melakukan suatu aktivitas.",
            "雨が 降り始めました。",
            "Hujan mulai turun.",
          ],
          [
            "Nでも",
            "Memberi contoh atau saran yang tidak membatasi pilihan.",
            "コーヒーでも 飲みませんか。",
            "Mau minum kopi atau semacamnya?",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Niat dan rencana",
    items: [
        [
          "Bentuk maksud",
          "～つもりです menyatakan niat pribadi untuk melakukan atau tidak melakukan tindakan.",
          "来年 日本へ 行くつもりです。",
          "Saya berniat pergi ke Jepang tahun depan.",
        ],
        [
          "V辞書形／Vない形 つもりです",
          "Gunakan bentuk kamus untuk niat melakukan dan bentuk ない untuk niat tidak melakukan.",
          "きょうは 出かけないつもりです。",
          "Hari ini saya berniat tidak keluar.",
        ],
        [
          "予定です",
          "Menyatakan jadwal atau rencana yang lebih objektif.",
          "会議は 3時からの予定です。",
          "Rapat dijadwalkan mulai jam tiga.",
        ],
      ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Nasihat dan kebiasaan",
    items: [
          [
            "Vたほうがいいです",
            "Memberi saran agar seseorang melakukan sesuatu.",
            "もっと 野菜を 食べたほうがいいです。",
            "Sebaiknya makan lebih banyak sayur.",
          ],
          [
            "Vないほうがいいです",
            "Memberi saran agar tidak melakukan sesuatu.",
            "お酒を 飲みすぎないほうがいいです。",
            "Sebaiknya jangan terlalu banyak minum alkohol.",
          ],
          [
            "Vませんか／Vましょうか",
            "Menawarkan bantuan atau mengajak dengan sopan.",
            "荷物を 持ちましょうか。",
            "Bolehkah saya membawakan barangnya?",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Perintah dan larangan",
    items: [
          [
            "Bentuk perintah",
            "Dipakai pada keadaan darurat, olahraga, atau instruksi tegas; tidak cocok untuk percakapan biasa.",
            "止まれ。",
            "Berhenti.",
          ],
          [
            "Bentuk larangan",
            "Bentuk kamus + な menyatakan larangan tegas.",
            "入るな。",
            "Jangan masuk.",
          ],
          [
            "～という意味です",
            "Menjelaskan arti suatu kata, tanda, atau aturan.",
            "「立入禁止」は 入るなという意味です。",
            "“Dilarang masuk” berarti jangan masuk.",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Urutan dan perubahan",
    items: [
          [
            "Vたあとで",
            "Menyatakan tindakan yang dilakukan setelah tindakan lain selesai.",
            "ごはんを 食べたあとで、勉強します。",
            "Setelah makan, saya belajar.",
          ],
          [
            "Vて／Vないで",
            "Menjelaskan cara atau keadaan saat melakukan tindakan.",
            "靴を 脱いで、入ってください。",
            "Lepaskan sepatu lalu silakan masuk.",
          ],
          [
            "～とおりに",
            "Menyatakan melakukan sesuatu sesuai contoh, petunjuk, atau rencana.",
            "説明書の とおりに してください。",
            "Tolong lakukan sesuai petunjuk.",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Syarat dan pengandaian",
    items: [
          [
            "Bentuk ば",
            "Menyatakan syarat umum atau hasil yang terjadi bila kondisi terpenuhi.",
            "時間が あれば、行きます。",
            "Jika ada waktu, saya pergi.",
          ],
          [
            "～なら",
            "Menyatakan saran atau informasi berdasarkan topik yang disebut lawan bicara.",
            "京都へ 行くなら、春が いいです。",
            "Kalau pergi ke Kyoto, musim semi bagus.",
          ],
          [
            "～ても",
            "Menyatakan hasil tetap berlaku walaupun syarat terjadi.",
            "雨が 降っても、行きます。",
            "Walaupun hujan, saya pergi.",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Tujuan dan perubahan kemampuan",
    items: [
        [
          "V辞書形ように",
          "Menyatakan tujuan yang berkaitan dengan kemampuan atau keadaan.",
          "日本語が 話せるように、毎日 練習します。",
          "Saya berlatih setiap hari agar bisa berbicara Jepang.",
        ],
        [
          "V辞書形ようにします",
          "Berusaha membiasakan diri melakukan sesuatu.",
          "毎日 野菜を 食べるようにしています。",
          "Saya membiasakan makan sayur setiap hari.",
        ],
        [
          "Vないようにします",
          "Berusaha agar tidak melakukan sesuatu.",
          "遅れないようにします。",
          "Saya akan berusaha tidak terlambat.",
        ],
      ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Bentuk pasif",
    items: [
          [
            "Bentuk pasif",
            "Digunakan saat subjek menerima tindakan dari orang lain.",
            "わたしは 先生に ほめられました。",
            "Saya dipuji oleh guru.",
          ],
          [
            "Pasif gangguan",
            "Menyatakan dampak tidak menyenangkan dari tindakan orang lain/alam.",
            "雨に 降られました。",
            "Saya kehujanan.",
          ],
          [
            "Oleh pelaku",
            "Pelaku tindakan pasif lazim ditandai dengan に.",
            "友達に 写真を 撮られました。",
            "Saya difoto oleh teman.",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Nominalisasi dan indera",
    items: [
          [
            "V辞書形のは",
            "Mengubah kegiatan menjadi topik kalimat.",
            "日本語を 勉強するのは 楽しいです。",
            "Belajar bahasa Jepang menyenangkan.",
          ],
          [
            "V辞書形のが",
            "Menyatakan kesukaan atau kemampuan terhadap kegiatan.",
            "わたしは 歌うのが 好きです。",
            "Saya suka bernyanyi.",
          ],
          [
            "見えます／聞こえます",
            "Menyatakan sesuatu terlihat atau terdengar secara alami.",
            "ここから 海が 見えます。",
            "Dari sini laut terlihat.",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Bentuk kausatif",
    items: [
          [
            "Bentuk kausatif",
            "Menyatakan membuat atau membiarkan seseorang melakukan tindakan.",
            "母は 子どもを 勉強させます。",
            "Ibu menyuruh anak belajar.",
          ],
          [
            "Vさせてください",
            "Meminta izin untuk melakukan sesuatu.",
            "先に 帰らせてください。",
            "Izinkan saya pulang lebih dulu.",
          ],
          [
            "Pihak yang bertindak",
            "Orang yang melakukan tindakan kausatif ditandai dengan を atau に sesuai jenis kata kerja.",
            "先生は 学生に 発表させました。",
            "Guru membuat siswa presentasi.",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Bentuk kehormatan",
    items: [
          [
            "お／ご～になります",
            "Menyatakan tindakan orang yang dihormati dengan sopan.",
            "先生は もう お帰りに なりました。",
            "Guru sudah pulang.",
          ],
          [
            "お／ご～ください",
            "Meminta lawan bicara melakukan sesuatu dengan hormat.",
            "こちらに お名前を お書きください。",
            "Silakan tulis nama Anda di sini.",
          ],
          [
            "いらっしゃいます",
            "Bentuk hormat untuk 行きます、来ます、います.",
            "社長は 会議室に いらっしゃいます。",
            "Presiden direktur ada di ruang rapat.",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Bahasa merendahkan diri",
    items: [
        [
          "お／ご～します",
          "Menyatakan tindakan pembicara dengan rendah hati kepada orang yang dihormati.",
          "わたしが ご案内します。",
          "Saya akan memandu Anda.",
        ],
        [
          "～ていただきます",
          "Menyatakan menerima izin atau kebaikan dari orang lain dengan sopan.",
          "休ませていただきます。",
          "Izinkan saya beristirahat.",
        ],
        [
          "拝見します",
          "Bentuk rendah hati dari 見ます.",
          "資料を 拝見します。",
          "Saya akan melihat dokumen.",
        ],
      ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Tujuan dan keadaan",
    items: [
          [
            "V辞書形ために",
            "Menyatakan tujuan yang disengaja.",
            "日本で 働くために、日本語を 勉強します。",
            "Saya belajar Jepang untuk bekerja di Jepang.",
          ],
          [
            "Nのために",
            "Menyatakan tujuan/manfaat bagi sesuatu.",
            "健康のために 歩きます。",
            "Saya berjalan demi kesehatan.",
          ],
          [
            "V辞書形ように",
            "Tujuan berkaitan kemampuan atau keadaan.",
            "忘れないように メモします。",
            "Saya mencatat agar tidak lupa.",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Perubahan dan keberlanjutan",
    items: [
          [
            "Vてきます",
            "Menunjukkan perubahan yang mendekat ke masa kini atau pergi lalu kembali.",
            "だんだん 暑く なってきました。",
            "Lambat-laun mulai panas.",
          ],
          [
            "Vていきます",
            "Menunjukkan perubahan yang berlanjut ke masa depan.",
            "これからも 日本語を 勉強していきます。",
            "Mulai sekarang saya akan terus belajar Jepang.",
          ],
          [
            "～そうです",
            "Menyatakan tampak/sepertinya berdasarkan pengamatan.",
            "雨が 降りそうです。",
            "Sepertinya akan hujan.",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
  },
  {
    title: "Menyampaikan informasi",
    items: [
          [
            "普通形そうです",
            "Menyampaikan informasi yang didengar dari sumber lain.",
            "天気予報では 雨が 降るそうです。",
            "Menurut ramalan cuaca, katanya akan hujan.",
          ],
          [
            "～によると",
            "Menyebutkan sumber informasi.",
            "ニュースによると、電車が 遅れているそうです。",
            "Menurut berita, kereta terlambat.",
          ],
          [
            "～らしいです",
            "Menyatakan informasi atau dugaan berdasar beberapa petunjuk.",
            "あの 人は 学生らしいです。",
            "Orang itu tampaknya mahasiswa.",
          ],
        ],
    focusLabel: "Fokus pelajaran",
    focus: "Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat tiga kalimat memakai pola utama pada pelajaran ini.",
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
