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
  return `<details class="html-lesson"><summary><span class="lesson-number">${number}</span>Pelajaran ${number}: ${title}</summary><div class="html-content">${items.map((x, i) => `<div class="grammar-point"><h3>${i + 1}. ${x[0]}</h3><p>${x[1]}</p><span class="grammar-example">${x[2]}<span class="grammar-meaning">${x[3]}</span></span></div>`).join("")}<div class="html-note"><div><b>${focusLabel}</b>${focus}</div><div><b>${practiceLabel}</b>${practice}</div></div></div></details>`;
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
    items: [["N1 は N2 です", "Pola ini dipakai untuk memperkenalkan atau menjelaskan identitas. Kata benda sebelum は menjadi topik pembicaraan; kata benda sesudahnya menjadi informasi atau predikat. です membuat pernyataan terdengar sopan.", "わたし は マイク・ミラー です。", "Saya Mike Miller."], ["N1 は N2 じゃありません", "Ini adalah bentuk negatif dari kalimat です. Dalam percakapan biasa digunakan じゃありません; bentuk ではありません lebih formal dan lebih sering dijumpai pada situasi resmi atau tulisan.", "サントスさん は 学生 じゃありません。", "Sdr. Santos bukan mahasiswa."], ["N1 は N2 ですか", "Tambahkan か di akhir kalimat untuk membuat pertanyaan. Untuk jawaban ya/tidak, gunakan はい atau いいえ. Jika bagian yang ditanyakan belum diketahui, gantilah bagian itu dengan kata tanya seperti だれ、なん、どなた、atau どのかた.", "ミラーさん は アメリカ人 ですか。", "Apakah Sdr. Miller orang Amerika?"], ["N も", "も berarti juga atau pun. Partikel ini dipakai ketika predikat pada kalimat kedua sama dengan predikat pada kalimat sebelumnya. も menggantikan は pada posisi topik.", "ミラーさん は 会社員 です。グプタさん も 会社員 です。", "Sdr. Miller pegawai perusahaan. Sdr. Gupta juga pegawai perusahaan."], ["N1 の N2", "の menghubungkan dua kata benda. Kata benda pertama menerangkan kata benda kedua, misalnya asal, kepemilikan, organisasi, atau jenis. Keseluruhan frasa N1 の N2 dianggap satu kelompok kata benda.", "ミラーさん は IMC の 会社員 です。", "Sdr. Miller pegawai perusahaan IMC."], ["～さん", "さん diletakkan setelah nama atau marga orang lain sebagai sapaan sopan. Jangan gunakan さん setelah nama diri sendiri. Untuk anak kecil atau orang yang sangat akrab, ～ちゃん dapat dipakai. あなた biasanya dihindari bila nama lawan bicara sudah diketahui; gunakan nama + さん agar lebih wajar.", "あの かた は ミラーさん です。", "Orang itu Sdr. Miller."]],
    focusLabel: "Fokus Pelajaran 1",
    focus: "Perkenalan diri, pekerjaan, asal negara, serta cara bertanya dan menjawab secara sopan.",
    practiceLabel: "Latihan mandiri",
    practice: "Buat lima kalimat: dua pernyataan です, satu negatif, satu pertanyaan, dan satu kalimat memakai の atau も.",
  },
  {
    title: "Kata tunjuk dan persamaan",
    items: [["これ／それ／あれ", "Ketiganya menunjuk benda dan dapat berdiri sendiri sebagai kata benda. これ untuk benda dekat pembicara, それ dekat lawan bicara, dan あれ jauh dari keduanya.", "これは じしょですか。", "Apakah ini kamus?"], ["この N／その N／あの N", "Gunakan bentuk ini ketika kata tunjuk menerangkan kata benda. この dekat pembicara, その dekat lawan bicara, dan あの jauh dari kedua pihak. Berbeda dengan これ, bentuk ini wajib diikuti kata benda.", "この 本は わたしのです。", "Buku ini kepunyaan saya."], ["そうです", "Dalam kalimat nominal, そうです menjawab bahwa informasi atau dugaan lawan bicara benar. Untuk menyangkal, gunakan ちがいます atau bentuk negatif yang sesuai, bukan そうではありません.", "それは じしょですか。はい、そうです。", "Apakah itu kamus? Ya, benar."], ["～か、～か", "Pola ini memberi pilihan dari dua atau lebih kemungkinan. Jawaban tidak memakai はい atau いいえ, tetapi langsung menyebut pilihan yang benar.", "これは 「9」ですか、「7」ですか。……「9」です。", "Ini “9” atau “7”? …“9”."], ["N1 の N2", "の menghubungkan dua kata benda. N1 dapat menerangkan jenis atau asal N2, misalnya buku komputer, dan juga dapat menyatakan kepemilikan, misalnya buku saya.", "これは コンピューターの 本です。", "Ini buku komputer."], ["の sebagai pengganti kata benda", "の dapat menggantikan kata benda yang sudah disebut bila konteksnya jelas. Penggunaan ini lazim untuk benda, tetapi tidak dipakai untuk menggantikan orang.", "これは だれの かばんですか。……佐藤さんのです。", "Tas ini milik siapa? …Milik Sato."], ["お～", "Awalan お dapat ditempatkan di depan beberapa kata benda untuk memberi nuansa sopan. Contoh umum adalah おみやげ dan おさけ.", "これは おみやげです。", "Ini oleh-oleh."], ["そうですか", "Ekspresi ini dipakai ketika menerima informasi baru dan menunjukkan bahwa pembicara memahami atau menyadari informasi tersebut. Intonasi biasanya menurun.", "これは シュミットさんの かさです。……そうですか。", "Ini payung milik Sdr. Schmidt. …Oh, begitu."]],
    focusLabel: "Fokus Pelajaran 2",
    focus: "Menunjuk benda, membedakan jarak, menanyakan kepemilikan, dan memberi jawaban atas informasi.",
    practiceLabel: "Latihan mandiri",
    practice: "Pilih lima benda di sekitar Anda. Buat pertanyaan memakai これ／それ／あれ lalu jawab dengan そうです atau ちがいます.",
  },
  {
    title: "Tempat, arah, dan asal produk",
    items: [["ここ／そこ／あそこ／こちら／そちら／あちら", "ここ・そこ・あそこ menunjuk tempat. ここ dekat pembicara, そこ dekat lawan bicara, dan あそこ jauh dari keduanya. こちら・そちら・あちら dapat menunjuk arah atau tempat dengan nuansa lebih sopan.", "おてあらいは あそこです。", "Kamar kecil di sana."], ["N は tempat です", "Pola ini menyatakan lokasi benda, fasilitas, atau orang. Tempat berada sesudah topik dan diikuti です.", "でんわは 2かいです。", "Telepon di lantai dua."], ["どこ／どちら", "どこ adalah kata tanya tempat. どちら terutama untuk arah dan dapat dipakai untuk tempat dengan cara yang lebih sopan. Saat bertanya nama negara, sekolah, atau perusahaan, pakailah どこ atau どちら, bukan なん.", "エレベーターは どちらですか。……あちらです。", "Lift di sebelah mana? …Di sebelah sana."], ["N1 の N2: asal atau pembuat", "Jika N1 adalah negara dan N2 adalah produk, N1 の menunjukkan produk buatan negara tersebut. Jika N1 adalah perusahaan dan N2 adalah produk, maknanya menunjukkan produk buatan perusahaan itu.", "これは にほんの コンピューターです。", "Ini komputer buatan Jepang."], ["Daftar kata penunjuk", "Kelompok こ, そ, dan あ berlaku konsisten: これ・それ・あれ untuk barang; このN・そのN・あのN untuk barang/orang; ここ・そこ・あそこ untuk tempat; serta こちら・そちら・あちら untuk arah atau tempat yang sopan. Bentuk tanya pasangannya adalah どれ、どのN、どこ、dan どちら.", "これは どこの コンピューターですか。", "Ini komputer buatan mana?"], ["お～", "Awalan お dapat dipakai pada kata yang berkaitan dengan lawan bicara atau pihak ketiga untuk menunjukkan rasa hormat. Salah satu contoh yang umum adalah おくに.", "おくには どちらですか。", "Berasal dari mana?"]],
    focusLabel: "Fokus Pelajaran 3",
    focus: "Menanyakan dan menjelaskan lokasi, arah, asal produk, serta bentuk penunjuk yang sopan.",
    practiceLabel: "Latihan mandiri",
    practice: "Gambarkan denah sederhana rumah atau sekolah, lalu buat enam kalimat memakai ここ、そこ、あそこ、どこ、dan どちら.",
  },
  {
    title: "Waktu dan kegiatan harian",
    items: [["今 ～時 ～分です", "Untuk menyatakan jam, gunakan kata bantu bilangan 時 dan 分 setelah angka. Pengucapan beberapa angka berubah, misalnya 4時 dibaca よじ, 7時 dibaca しちじ, dan 9時 dibaca くじ. Kata tanya untuk waktu adalah なんじ.", "いま なんじですか。……7じ 10ぷんです。", "Sekarang pukul berapa? …Pukul tujuh lewat sepuluh menit."], ["Vます／Vません／Vました／Vませんでした", "ます adalah bentuk sopan kata kerja. Bentuk positif dan negatif dapat dipakai untuk kebiasaan, keadaan kini, atau rencana masa depan. ました dan ませんでした dipakai untuk menyatakan kegiatan yang telah selesai di masa lalu. Pertanyaan dibuat dengan menambahkan か tanpa mengubah susunan kalimat.", "まいあさ 6じに おきます。", "Setiap pagi saya bangun pukul enam."], ["Kata benda waktu に V", "Partikel に diletakkan setelah waktu yang spesifik, seperti jam, tanggal, atau hari tertentu, untuk menandai kapan kegiatan dilakukan. Kata waktu relatif seperti きょう、あした、きのう、まいにち umumnya tidak memakai に.", "6じはんに おきます。", "Saya bangun pukul setengah tujuh."], ["N1 から N2 まで", "から menunjukkan titik awal waktu atau tempat, sedangkan まで menunjukkan titik akhir. Keduanya dapat dipakai bersama atau sendiri. Untuk menyatakan jam mulai dan selesai, waktu dapat ditempatkan di depan atau sesudah frasa ini.", "9じから 5じまで べんきょうします。", "Belajar dari pukul sembilan sampai pukul lima."], ["N1 と N2", "と menghubungkan dua kata benda yang setara, misalnya dua hari, dua tempat, atau dua orang. Pola ini tidak dipakai untuk menghubungkan kata kerja atau kalimat.", "ぎんこうの やすみは 土曜日と 日曜日です。", "Hari libur bank adalah Sabtu dan Minggu."], ["～ね", "ね di akhir kalimat dipakai ketika pembicara mengharapkan persetujuan, ingin memastikan informasi, atau ingin memberi kesan simpati. Intonasi dapat naik untuk meminta konfirmasi atau turun untuk menyatakan perasaan bersama.", "まいにち 10じまで べんきょうします。……たいへんですね。", "Setiap hari belajar sampai jam sepuluh. …Wah, berat ya."]],
    focusLabel: "Fokus Pelajaran 4",
    focus: "Menyatakan jam, kebiasaan, waktu kegiatan, rentang waktu, dan respons persetujuan dalam percakapan.",
    practiceLabel: "Latihan mandiri",
    practice: "Tuliskan jadwal harian Anda dari bangun sampai tidur dengan minimal lima kata kerja bentuk ます dan tiga penanda waktu.",
  },
  {
    title: "Perjalanan dan perpindahan",
    items: [["Tempat へ 行きます／来ます／帰ります", "Untuk menyatakan arah perpindahan, bubuhkan partikel へ setelah tempat tujuan. へ dibaca e saat digunakan sebagai partikel. 行きます berarti pergi, 来ます datang, dan 帰ります pulang.", "京都へ 行きます。", "Pergi ke Kyoto."], ["どこ［へ］も 行きません／行きませんでした", "Jika kata tanya ditanyakan secara total pada kalimat negatif, gunakan も sesudah kata tanya. Pola ini dapat menyatakan tidak ke mana-mana, tidak melakukan apa-apa, atau tidak ada siapa pun yang datang.", "どこへも 行きません。", "Tidak pergi ke mana-mana."], ["Kendaraan で 行きます／来ます／帰ります", "で menunjukkan sarana atau cara. Pada pola ini, kata benda sebelum で adalah kendaraan atau alat transportasi. Bila berjalan kaki, gunakan あるいて tanpa partikel で.", "電車で 行きます。", "Pergi dengan kereta rel listrik."], ["Orang/hewan と V", "と menunjukkan teman melakukan aktivitas bersama. Bila melakukan kegiatan sendiri, gunakan ひとりで; bentuk ini tidak memakai と.", "家族と 日本へ 来ました。", "Datang ke Jepang bersama keluarga."], ["いつ", "いつ dipakai untuk menanyakan waktu yang tidak spesifik, seperti kapan datang atau kapan pergi. Berbeda dengan waktu tertentu, いつ tidak diikuti partikel に.", "いつ 日本へ 来ましたか。……3月25日に 来ました。", "Kapan datang ke Jepang? …Datang tanggal 25 Maret."], ["～よ", "よ diletakkan di akhir kalimat untuk menyampaikan informasi yang diperkirakan belum diketahui lawan bicara, atau untuk memberi tanggapan dan pendapat dengan tegas namun tetap wajar.", "この 電車は 神戸へ 行きますか。……いいえ、行きません。次の「普通」ですよ。", "Apakah kereta ini ke Kobe? …Tidak. Yang kereta biasa berikutnya."], ["そうですね", "そうですね digunakan ketika pembicara setuju atau memiliki pendapat yang sama dengan lawan bicara. Ekspresi ini berbeda dari そうですか yang dipakai saat baru menerima informasi.", "あしたは 日曜日ですね。……ええ、そうですね。", "Besok hari Minggu, ya. …Ya, betul."]],
    focusLabel: "Fokus Pelajaran 5",
    focus: "Menyatakan tujuan perjalanan, transportasi, teman perjalanan, waktu, serta cara menanggapi informasi.",
    practiceLabel: "Latihan mandiri",
    practice: "Tulis rencana perjalanan akhir pekan dengan tempat tujuan, kendaraan, teman perjalanan, dan waktu keberangkatan.",
  },
  {
    title: "Aktivitas dan ajakan",
    items: [["N を V (kata kerja transitif)", "Objek dari kata kerja transitif ditandai dengan partikel を. Partikel ini menunjukkan benda yang secara langsung dikenai kegiatan.", "ジュースを 飲みます。", "Minum jus."], ["N を します", "します dapat digunakan secara luas dengan kata benda sebagai objek untuk menyatakan melakukan suatu aktivitas. Pola ini dipakai untuk olahraga, permainan, acara, belajar, pekerjaan, dan kegiatan lain.", "サッカーを します。", "Bermain sepak bola."], ["何をしますか", "Pertanyaan ini digunakan untuk menanyakan kegiatan yang dilakukan. Jawabannya memakai objek dan kata kerja yang sesuai dengan waktu pertanyaan.", "月曜日 何をしますか。……京都へ 行きます。", "Hari Senin melakukan apa? …Pergi ke Kyoto."], ["なん dan なに", "なん dan なに sama-sama berarti apa. なん dipakai sebelum bunyi seperti た、だ、dan な, juga sebelum kata bantu bilangan. なに lebih umum pada bentuk lain. なんで juga dapat berarti mengapa atau dengan apa bergantung konteks.", "それは 何ですか。", "Itu apa?"], ["Tempat で V", "で setelah kata benda tempat menunjukkan lokasi berlangsungnya kegiatan. Ini berbeda dari に yang menandai waktu spesifik atau lokasi keberadaan.", "駅で 新聞を 買います。", "Membeli surat kabar di stasiun."], ["Vませんか", "Ekspresi ini menawarkan atau mengajak lawan bicara melakukan suatu kegiatan dengan cara yang lembut. Jawaban dapat berupa persetujuan atau penolakan yang sopan.", "いっしょに 京都へ 行きませんか。", "Bagaimana kita pergi ke Kyoto bersama-sama?"], ["Vましょう", "Vましょう adalah ajakan aktif untuk melakukan kegiatan bersama. Pola ini juga dipakai untuk menanggapi ajakan Vませんか secara positif.", "ちょっと 休みましょう。", "Mari istirahat sebentar."], ["～か", "か di akhir kalimat dapat menyatakan bahwa pembicara baru menerima dan memahami informasi dari lawan bicara. Fungsinya mirip そうですか, tetapi lebih singkat dan informal dalam percakapan.", "日曜日 京都へ 行きました。……京都ですか。いいですね。", "Hari Minggu pergi ke Kyoto. …Kyoto? Bagus ya."]],
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
