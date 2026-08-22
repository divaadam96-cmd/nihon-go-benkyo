const deck = {
  noun: [
    ["学校", "sekolah", "がっこう · gakkou"],
    ["本", "buku", "ほん · hon"],
    ["電車", "kereta listrik", "でんしゃ · densha"],
    ["友達", "teman", "ともだち · tomodachi"],
    ["会社", "perusahaan", "かいしゃ · kaisha"],
  ],
  verb: [
    ["食べる", "makan", "たべる · taberu"],
    ["飲む", "minum", "のむ · nomu"],
    ["行く", "pergi", "いく · iku"],
    ["見る", "melihat", "みる · miru"],
    ["書く", "menulis", "かく · kaku"],
  ],
  adjective: [
    ["大きい", "besar", "おおきい · ookii"],
    ["小さい", "kecil", "ちいさい · chiisai"],
    ["新しい", "baru", "あたらしい · atarashii"],
    ["静か", "tenang", "しずか · shizuka"],
    ["便利", "praktis", "べんり · benri"],
  ],
  kanji: [
    ["山", "gunung", "やま · yama"],
    ["川", "sungai", "かわ · kawa"],
    ["人", "orang", "ひと · hito"],
    ["時間", "waktu", "じかん · jikan"],
    ["日本", "Jepang", "にほん · nihon"],
  ],
};

const quizzes = {
  jlpt: [
    {
      q: "Apa arti kata 先生 (せんせい)?",
      a: ["Siswa", "Guru", "Dokter", "Teman"],
      c: 1,
    },
    {
      q: "Pilih partikel yang tepat: わたし___学生です。",
      a: ["を", "に", "は", "で"],
      c: 2,
    },
    {
      q: "Bagaimana membaca kanji 山?",
      a: ["かわ", "やま", "ひと", "ほん"],
      c: 1,
    },
    {
      q: "Apa bentuk sopan dari 食べる?",
      a: ["食べます", "食べた", "食べない", "食べて"],
      c: 0,
    },
    {
      q: "Kalimat 「きのう えいがを みました」 berarti…",
      a: [
        "Besok menonton film",
        "Kemarin menonton film",
        "Sedang menonton film",
        "Ingin menonton film",
      ],
      c: 1,
    },
  ],
  jft: [
    {
      q: "Di stasiun, arti 「次の電車は何時ですか」 adalah…",
      a: [
        "Kereta berikutnya jam berapa?",
        "Kereta ini ke mana?",
        "Tiketnya berapa?",
        "Di mana stasiunnya?",
      ],
      c: 0,
    },
    {
      q: "Saat meminta tolong dengan sopan, pilihan yang tepat adalah…",
      a: ["手伝ってください", "手伝います", "手伝った", "手伝わない"],
      c: 0,
    },
    {
      q: "「ここに 名前を 書いてください」 berarti…",
      a: [
        "Tolong baca nama di sini",
        "Tolong tulis nama di sini",
        "Tolong cari nama di sini",
        "Tolong sebut nama di sini",
      ],
      c: 1,
    },
    {
      q: "Jawaban yang tepat untuk 「ありがとうございます」 adalah…",
      a: ["どういたしまして", "いただきます", "しつれいします", "おやすみ"],
      c: 0,
    },
    {
      q: "「少し待ってください」 berarti…",
      a: [
        "Tolong makan sedikit",
        "Tolong tunggu sebentar",
        "Tolong bicara pelan",
        "Tolong pergi sekarang",
      ],
      c: 1,
    },
  ],
};

const grammar = [
  [
    "Identitas & kalimat nominal",
    "Kalimat memperkenalkan diri, pernyataan positif-negatif, pertanyaan, kepemilikan, dan sapaan.",
    "N は N です",
  ],
  [
    "Penunjuk benda",
    "Kore/sore/are, kono/sono/ano, persamaan, penyangkalan, dan kata tanya.",
    "これ・それ・あれ",
  ],
  [
    "Tempat & arah",
    "Menunjukkan lokasi, arah, lantai, serta penggunaan kata tunjuk tempat.",
    "ここ・そこ・あそこ",
  ],
  [
    "Waktu & kegiatan",
    "Menyatakan waktu, jadwal, rentang waktu, dan perubahan bentuk sopan kata kerja.",
    "Vます・Vません",
  ],
  [
    "Perjalanan",
    "Tujuan, transportasi, teman perjalanan, tanggal, dan kata tanya untuk tujuan.",
    "場所 へ 行きます",
  ],
  [
    "Aktivitas sehari-hari",
    "Objek kegiatan, lokasi aktivitas, ajakan, dan tawaran melakukan sesuatu bersama.",
    "N を Vます",
  ],
  [
    "Memberi & menerima",
    "Alat atau bahasa, serta pola memberi dan menerima barang.",
    "N を あげます／もらいます",
  ],
  [
    "Kata sifat & perbandingan",
    "Deskripsi sifat, kesan, perbandingan, dan tingkat paling.",
    "N は い形容詞 です",
  ],
  [
    "Kesukaan & kemampuan",
    "Menyatakan suka, tidak suka, mampu, kurang mampu, dan kuantitas.",
    "N が わかります",
  ],
  [
    "Keberadaan",
    "Menyatakan adanya benda atau makhluk hidup, lokasi, dan posisi.",
    "N が あります／います",
  ],
  [
    "Jumlah & durasi",
    "Penggunaan penghitung, frekuensi, durasi, dan pertanyaan jumlah.",
    "〜回・〜時間",
  ],
  [
    "Bentuk lampau",
    "Menceritakan kondisi dan perbandingan pada masa lalu.",
    "〜でした／〜かったです",
  ],
  [
    "Keinginan",
    "Menyatakan keinginan atas benda, aktivitas, dan tujuan perjalanan.",
    "Vたいです",
  ],
  [
    "Bentuk て: permintaan",
    "Permintaan sopan dan tindakan yang sedang berlangsung.",
    "Vて ください",
  ],
  [
    "Izin & larangan",
    "Meminta atau memberi izin, melarang tindakan, dan menyatakan keadaan.",
    "Vても いいです",
  ],
  [
    "Menghubungkan informasi",
    "Menyambung klausa serta menghubungkan kata sifat dan kata benda.",
    "Vて・Aくて・Nで",
  ],
  [
    "Bentuk ない",
    "Larangan sopan, kewajiban, dan pilihan untuk tidak melakukan sesuatu.",
    "Vないでください",
  ],
  [
    "Bentuk kamus & kemampuan",
    "Kemampuan, hobi, tindakan sebelum waktu tertentu, dan urutan aktivitas.",
    "V辞書形 ことができます",
  ],
  [
    "Pengalaman & perubahan",
    "Pernah melakukan sesuatu, menjadi suatu keadaan, serta kegiatan rutin.",
    "Vたことがあります",
  ],
  [
    "Bentuk biasa",
    "Membaca dan menggunakan gaya informal dalam percakapan dekat.",
    "普通形",
  ],
  [
    "Pikiran & kutipan",
    "Menyampaikan pendapat, informasi yang didengar, dan kutipan ucapan.",
    "〜と 思います",
  ],
  [
    "Klausa penjelas",
    "Menggunakan anak kalimat untuk menerangkan orang, benda, atau situasi.",
    "普通形 + N",
  ],
  [
    "Waktu & kondisi",
    "Menyatakan peristiwa saat kondisi tertentu dan hubungan sebab-akibat alami.",
    "〜とき・〜と",
  ],
  [
    "Memberi bantuan",
    "Mengungkapkan tindakan yang dilakukan untuk atau dari orang lain.",
    "Vて あげます",
  ],
  [
    "Pengandaian",
    "Menyampaikan kondisi, kemungkinan, dan tindakan bila suatu syarat terjadi.",
    "〜たら",
  ],
];

const detailedGrammar = [
  [
    "Kalimat nominal dasar",
    "Gunakan pola ini untuk menyebut identitas, pekerjaan, asal, atau status seseorang/benda. は menandai topik yang sedang dibicarakan; です memberi nada sopan. Bentuk negatif memakai じゃありません, sedangkan か di akhir kalimat mengubahnya menjadi pertanyaan.",
    "N1 は N2 です",
  ],
  [
    "Kata tunjuk benda",
    "これ・それ・あれ menggantikan nama benda, sedangkan この・その・あの harus diikuti kata benda. Pilihan bentuknya bergantung pada posisi benda terhadap pembicara dan lawan bicara. そうです dipakai untuk membenarkan informasi; ちがいます untuk menyangkalnya.",
    "これ／それ／あれ・この N",
  ],
  [
    "Kata tunjuk tempat",
    "ここ・そこ・あそこ menunjuk tempat, sementara こちら dapat menjadi bentuk lebih sopan untuk arah atau orang. Gunakan どこ／どちら saat menanyakan lokasi atau arah. Kalimat nominal tetap dipakai untuk menyatakan suatu tempat.",
    "N は 場所 です",
  ],
  [
    "Waktu dan kegiatan",
    "Kata kerja bentuk ます dipakai pada percakapan sopan. Partikel に menandai waktu yang spesifik seperti jam atau tanggal; tidak selalu diperlukan untuk kata seperti きょう atau あした. から dan まで menunjukkan awal serta akhir rentang waktu.",
    "時 に Vます",
  ],
  [
    "Tujuan perjalanan",
    "Partikel へ menunjukkan arah tujuan, sedangkan で menunjukkan sarana transportasi. と dapat menyatakan teman perjalanan. Kata tanya いつ、どこ、だれと membantu menanyakan informasi perjalanan dengan jelas.",
    "場所 へ 行きます",
  ],
  [
    "Objek dan lokasi aktivitas",
    "を menandai benda yang dikenai tindakan, seperti makanan yang dimakan atau buku yang dibaca. で menandai tempat sebuah kegiatan berlangsung. ～ませんか menawarkan kegiatan, dan ～ましょう menyatakan ajakan bersama.",
    "N を Vます・場所 で Vます",
  ],
  [
    "Memberi dan menerima",
    "に menunjukkan penerima atau sumber dalam aktivitas memberi dan menerima. あげます berarti memberi kepada orang lain, sedangkan もらいます berarti menerima dari seseorang. Saat menyebut bahasa atau alat yang dipakai, gunakan で.",
    "A は B に N を あげます",
  ],
  [
    "Kata sifat dan perbandingan",
    "Kata sifat い dan な dapat menjelaskan keadaan benda/orang. い形容詞 langsung diikuti です, sedangkan な形容詞 memakai です pada predikat dan な sebelum kata benda. とても memperkuat makna, あまり dipakai bersama bentuk negatif.",
    "N は A です",
  ],
  [
    "Kesukaan dan kemampuan",
    "すき・きらい・じょうず・へた・わかります umumnya memakai partikel が untuk hal yang disukai, dipahami, atau dikuasai. Pola ini sering dipakai untuk menjelaskan minat dan kemampuan pribadi.",
    "N が わかります／すきです",
  ],
  [
    "Keberadaan benda dan makhluk",
    "あります digunakan untuk benda atau tumbuhan, sedangkan います untuk manusia dan hewan. Pola pertama menekankan sesuatu yang ada di suatu tempat; pola kedua menekankan lokasi sesuatu yang sudah diketahui.",
    "場所 に N が あります／います",
  ],
  [
    "Bilangan, durasi, frekuensi",
    "Gunakan kata bantu bilangan sesuai jenis benda atau orang yang dihitung. Durasi seperti ～時間 tidak memakai に. Frekuensi dapat dijelaskan dengan ～回 atau ～に一回 untuk menyatakan seberapa sering kegiatan dilakukan.",
    "期間 Vます・〜回",
  ],
  [
    "Bentuk lampau dan perbandingan",
    "Bentuk lampau dipakai untuk menceritakan kondisi yang sudah lewat: でした untuk kata benda/な形容詞 dan ～かったです untuk い形容詞. Pola より dan ほど membantu membandingkan dua hal, sedangkan いちばん menyatakan tingkat paling.",
    "N1 は N2 より A です",
  ],
  [
    "Keinginan dan harapan",
    "ほしいです menyatakan keinginan memiliki benda, sedangkan ～たいです menyatakan keinginan melakukan tindakan. Subjek dapat berubah sesuai siapa yang memiliki keinginan. Keinginan pergi ke tempat tertentu memakai ～へ行きたいです.",
    "Vます-stem たいです",
  ],
  [
    "Bentuk て untuk permintaan",
    "Bentuk て menjadi dasar banyak pola penting. ～てください dipakai untuk meminta seseorang melakukan sesuatu dengan sopan. ～ています dapat menunjukkan tindakan yang sedang berlangsung atau keadaan yang berlanjut, tergantung kata kerjanya.",
    "Vて ください",
  ],
  [
    "Izin, larangan, dan keadaan",
    "～てもいいです meminta atau memberi izin. ～てはいけません menyatakan larangan. ～ています juga dipakai untuk kebiasaan, pekerjaan, atau keadaan hasil tindakan, sehingga konteks sangat penting saat menafsirkan maknanya.",
    "Vても いいです・Vては いけません",
  ],
  [
    "Menghubungkan kalimat",
    "Bentuk て dapat menyambung dua tindakan atau dua informasi yang berkaitan. Kata sifat い berubah menjadi ～くて, kata sifat な dan kata benda memakai で. Untuk menyatakan cara melakukan sesuatu, gunakan kata tanya どうやって.",
    "Vて・Aくて・Nで",
  ],
  [
    "Bentuk negatif ない",
    "Bentuk ない dipakai untuk menyatakan tidak melakukan tindakan. ～ないでください adalah larangan atau permintaan agar tidak melakukan sesuatu. ～なければなりません menyatakan kewajiban, sedangkan ～なくてもいいです menyatakan bahwa suatu tindakan tidak wajib.",
    "Vないでください",
  ],
  [
    "Bentuk kamus dan kemampuan",
    "Bentuk kamus adalah bentuk dasar kata kerja. ～ことができます menyatakan kemampuan atau kemungkinan, sedangkan しゅみは～ことです menyebut hobi. Sebelum melakukan tindakan lain, gunakan V辞書形まえに.",
    "V辞書形 ことができます",
  ],
  [
    "Pengalaman dan perubahan",
    "～たことがあります menyatakan pengalaman yang pernah terjadi setidaknya sekali. ～なります menunjukkan perubahan keadaan, misalnya menjadi panas atau menjadi guru. Bentuk biasa mulai digunakan untuk menghubungkan ide yang lebih panjang.",
    "Vたことが あります",
  ],
  [
    "Bentuk biasa dalam percakapan",
    "Bentuk biasa digunakan dalam percakapan santai dengan teman atau keluarga. Kata kerja, kata sifat, dan kata benda memiliki bentuk biasa positif maupun negatif. Saat belajar, penting membedakan kapan bentuk sopan dan bentuk biasa sesuai dipakai.",
    "普通形",
  ],
  [
    "Pendapat dan kutipan",
    "～とおもいます dipakai untuk menyatakan pendapat atau perkiraan pribadi. ～といいます menyampaikan informasi atau ucapan orang lain. Bentuk biasa diletakkan sebelum と agar isi pemikiran atau kutipan dapat disampaikan lengkap.",
    "普通形 と おもいます",
  ],
  [
    "Klausa yang menerangkan kata benda",
    "Kalimat pendek dapat ditempatkan sebelum kata benda untuk menjelaskan orang, benda, tempat, atau waktu. Tidak diperlukan kata penghubung khusus seperti “yang”; langsung gunakan bentuk biasa sebelum kata benda yang diterangkan.",
    "普通形 + N",
  ],
  [
    "Waktu dan kondisi",
    "～とき menjelaskan kapan suatu tindakan atau keadaan terjadi; bentuk sebelum とき dipilih sesuai urutan waktunya. ～と menunjukkan hasil yang biasanya terjadi bila suatu kondisi terpenuhi, misalnya saat menekan tombol atau tiba di suatu tempat.",
    "Vる とき・Vた とき",
  ],
  [
    "Tindakan untuk orang lain",
    "あげます、もらいます、dan くれます membedakan arah bantuan atau kebaikan. Saat yang diberikan adalah tindakan, gunakan bentuk て. Perhatikan sudut pandang pembicara agar memilih kata yang tepat.",
    "Vて あげます／もらいます／くれます",
  ],
  [
    "Pengandaian dan syarat",
    "～たら menyatakan “jika/ketika” suatu kondisi sudah terjadi. ～ても menyatakan hasil yang tetap berlaku meskipun ada keadaan tertentu. もし dapat diletakkan di awal untuk memperjelas bahwa kalimat adalah pengandaian.",
    "Vたら・Vても",
  ],
];

const webNotes = [
  [
    "Topik kalimat",
    "Bagian sebelum は adalah hal yang sedang dibicarakan; informasi sesudahnya menjelaskan topik itu.",
  ],
  [
    "Jarak pembicara",
    "これ dekat pembicara, それ dekat lawan bicara, dan あれ jauh dari keduanya.",
  ],
  [
    "Lokasi sopan",
    "こちら dapat dipilih ketika ingin bertanya arah atau tempat dengan lebih sopan.",
  ],
  [
    "Penanda waktu",
    "Pakai に untuk waktu spesifik; kata waktu relatif seperti きょう biasanya tidak memerlukannya.",
  ],
  [
    "Arah dan sarana",
    "へ menunjukkan tujuan; で menunjukkan kendaraan atau alat yang dipakai.",
  ],
  [
    "Objek tindakan",
    "を mengikuti benda yang dikenai kegiatan; tempat kegiatan memakai で.",
  ],
  [
    "Sudut pandang",
    "Pilih あげます atau もらいます menurut arah pemberian dari sudut pandang pembicara.",
  ],
  [
    "Jenis kata sifat",
    "い形容詞 dan な形容詞 berubah dengan cara berbeda saat negatif atau lampau.",
  ],
  ["Partikel が", "Pola kemampuan dan kesukaan lazim memakai が, bukan を."],
  [
    "Benda atau makhluk",
    "あります untuk benda/tumbuhan; います untuk manusia dan hewan.",
  ],
  [
    "Kata bantu bilangan",
    "Pilih penghitung sesuai benda yang dihitung, misalnya ～人 atau ～枚.",
  ],
  [
    "Membandingkan",
    "より membandingkan dua hal; いちばん menyatakan yang paling dalam suatu kelompok.",
  ],
  ["Dua macam keinginan", "ほしいです untuk benda; ～たいです untuk kegiatan."],
  [
    "Fungsi bentuk て",
    "Bentuk ini menjadi dasar untuk meminta, menyambung, dan menjelaskan keadaan.",
  ],
  [
    "Nada aturan",
    "～てもいいです memberi izin; ～てはいけません adalah larangan yang lebih tegas.",
  ],
  [
    "Hubungan informasi",
    "Gunakan bentuk sambung ketika dua keadaan atau kegiatan saling berkaitan.",
  ],
  [
    "Kewajiban",
    "～なければなりません menyatakan harus; ～なくてもいいです menyatakan tidak wajib.",
  ],
  [
    "Bentuk dasar",
    "Bentuk kamus dipakai sebelum ことができます dan sebelum まえに.",
  ],
  [
    "Pengalaman",
    "～たことがあります menyatakan pengalaman, bukan kegiatan yang sedang dilakukan.",
  ],
  [
    "Situasi informal",
    "Bentuk biasa sesuai untuk hubungan akrab; gunakan bentuk sopan dalam situasi resmi.",
  ],
  [
    "Sumber informasi",
    "Pola kutipan memisahkan isi yang dipikirkan atau diucapkan dari kalimat utama.",
  ],
  [
    "Penerang kata benda",
    "Klausa penjelas diletakkan langsung sebelum kata benda yang diterangkan.",
  ],
  [
    "Urutan waktu",
    "Bentuk sebelum とき menunjukkan apakah tindakan terjadi sebelum, saat, atau sesudah waktu itu.",
  ],
  [
    "Penerima bantuan",
    "Perhatikan siapa yang melakukan dan siapa yang menerima agar kata kerja bantuan tepat.",
  ],
  [
    "Kondisi",
    "～たら cocok untuk kondisi yang mungkin terjadi; ～ても untuk keadaan yang tidak mengubah hasil.",
  ],
];

const fullLessons = [
  [
    "Kalimat nominal dasar",
    [
      "は menandai topik. Topik dapat berupa orang, benda, negara, pekerjaan, atau status yang sedang dibicarakan.",
      "です ditempatkan setelah kata benda untuk membuat pernyataan sopan dan menyatakan penilaian atau kepastian pembicara.",
      "じゃありません adalah bentuk negatif sehari-hari dari です; ではありません lebih formal dan umum dalam tulisan.",
      "か di akhir kalimat membentuk pertanyaan ya/tidak atau pertanyaan dengan kata tanya.",
      "の menghubungkan dua kata benda untuk menunjukkan hubungan, kepemilikan, asal, atau jenis.",
      "～さん dipakai setelah nama orang sebagai sapaan hormat.",
    ],
  ],
  [
    "Kata tunjuk dan persamaan",
    [
      "これ・それ・あれ menggantikan nama benda; pilih bentuk berdasarkan jarak benda dari pembicara dan lawan bicara.",
      "この・その・あの menerangkan kata benda sehingga tidak dapat berdiri sendiri.",
      "そうです menyatakan bahwa informasi benar; ちがいます menyatakan bahwa informasi tidak benar atau berbeda.",
      "どれ dan どの N dipakai saat meminta pilihan di antara beberapa benda.",
      "も berarti juga/terlalu dan menggantikan は atau が pada bagian yang sama.",
      "ね dipakai untuk mencari persetujuan atau memastikan informasi bersama.",
    ],
  ],
  [
    "Tempat, gedung, dan arah",
    [
      "ここ・そこ・あそこ adalah kata tunjuk tempat; こちら・そちら・あちら adalah bentuk lebih sopan dan juga dapat menunjuk arah atau orang.",
      "N は tempat です menyatakan lokasi sebuah fasilitas atau orang.",
      "どこ／どちら digunakan untuk menanyakan tempat, arah, atau asal dengan tingkat kesopanan yang berbeda.",
      "Kata benda tempat dapat diikuti の untuk memperjelas lokasi, misalnya kantor perusahaan atau ruang kelas.",
      "Partikel も dapat membuat bentuk negatif menyeluruh seperti tidak ada di mana pun, sesuai konteks kalimat.",
    ],
  ],
  [
    "Waktu dan kegiatan harian",
    [
      "Bentuk ます adalah bentuk sopan kata kerja untuk kebiasaan atau kegiatan saat ini/masa depan.",
      "ます、ません、ました、ませんでした membedakan pernyataan positif, negatif, lampau positif, dan lampau negatif.",
      "に menandai waktu yang spesifik seperti jam, tanggal, atau hari tertentu; tidak wajib pada kata waktu relatif.",
      "から menunjukkan titik mulai dan まで titik akhir; keduanya dapat dipakai bersama atau terpisah.",
      "と menghubungkan kata benda yang setara, misalnya dua tempat atau dua orang.",
      "ね di akhir kalimat mengundang persetujuan mengenai jadwal atau kebiasaan.",
    ],
  ],
  [
    "Perjalanan dan perpindahan",
    [
      "へ menunjukkan arah tujuan. Dalam tulisan modern, へ dibaca e ketika berfungsi sebagai partikel.",
      "で menunjukkan alat transportasi yang dipakai untuk pergi, datang, atau pulang.",
      "と menunjukkan teman perjalanan; ひとりで menjelaskan bahwa pembicara pergi sendiri.",
      "いつ、どこへ、だれと membantu menanyakan waktu, tujuan, dan teman perjalanan.",
      "Kata tanya dapat digabung dengan も pada kalimat negatif untuk menyatakan tidak ke mana pun atau tidak dengan siapa pun.",
      "Bentuk lampau dipakai saat menceritakan perjalanan yang telah terjadi.",
    ],
  ],
  [
    "Aktivitas dan ajakan",
    [
      "を menandai objek langsung dari kegiatan seperti membaca buku, makan makanan, atau minum kopi.",
      "で menandai tempat kegiatan dilakukan, berbeda dari に yang menandai waktu atau tujuan keberadaan.",
      "Vませんか adalah ajakan yang lembut, cocok untuk menawarkan kegiatan kepada lawan bicara.",
      "Vましょう adalah ajakan yang lebih langsung untuk melakukan sesuatu bersama.",
      "Kata tanya なに atau なん berubah pengucapannya menurut bunyi berikutnya, misalnya なんようび.",
      "Partikel も dapat menggantikan を untuk menyatakan tidak melakukan apa pun pada kalimat negatif.",
    ],
  ],
  [
    "Memberi, menerima, alat, bahasa",
    [
      "で menunjukkan alat, sarana, atau bahasa yang digunakan untuk melakukan kegiatan.",
      "に menandai penerima dalam pola memberi dan sumber dalam pola menerima.",
      "あげます berarti memberi dari pembicara/pihaknya kepada orang lain; もらいます berarti menerima dari orang lain.",
      "Kata kerja memberi dan menerima dipilih dari sudut pandang pembicara, jadi hubungan pelaku dan penerima perlu diperhatikan.",
      "もう berarti sudah; まだ berarti belum jika digunakan dengan bentuk negatif.",
      "Kata tanya なんで dapat berarti dengan apa atau mengapa, tergantung konteks.",
    ],
  ],
  [
    "Kata sifat dan perbandingan",
    [
      "い形容詞 berakhiran い dan dapat langsung menjadi predikat dengan です. な形容詞 memakai な sebelum kata benda.",
      "Bentuk negatif い形容詞 memakai くないです; bentuk negatif な形容詞 memakai じゃありません.",
      "とても memperkuat makna positif; あまり lazim dipakai bersama bentuk negatif untuk menyatakan tidak terlalu.",
      "N は どうですか meminta kesan atau pendapat mengenai suatu hal.",
      "N1 は N2 より A です membandingkan dua hal; どちら dan どれ menanyakan pilihan yang lebih unggul.",
      "いちばん menyatakan yang paling dalam suatu kelompok yang ditandai dengan の中で.",
    ],
  ],
  [
    "Kesukaan, kemampuan, dan jumlah",
    [
      "すき、きらい、じょうず、へた、わかります memakai が untuk hal yang disukai, dikuasai, atau dipahami.",
      "程度 seperti よく、だいたい、あまり、ぜんぜん menunjukkan tingkat kemampuan atau pemahaman.",
      "Kata bantu bilangan harus disesuaikan dengan benda yang dihitung, misalnya orang, lembar, atau buah.",
      "なんにん、なんまい dan bentuk tanya lain dipakai untuk menanyakan jumlah.",
      "Kata kerja dapat berubah menjadi bentuk kamus atau bentuk negatif untuk menjelaskan kebiasaan sederhana.",
    ],
  ],
  [
    "Keberadaan dan posisi",
    [
      "あります digunakan untuk benda atau tumbuhan, sedangkan います digunakan untuk manusia dan hewan.",
      "場所にNがあります／います menekankan apa yang ada di suatu tempat. Nは場所にあります／います menekankan lokasi dari benda atau makhluk yang sudah diketahui.",
      "Kata posisi seperti うえ、した、まえ、うしろ、みぎ、ひだり、なか、そと biasanya dihubungkan dengan の.",
      "N1のN2 menyatakan lokasi relatif, misalnya di atas meja atau di dalam kotak.",
      "Kata tanya どこ dapat menggantikan informasi tempat yang belum diketahui.",
    ],
  ],
  [
    "Bilangan, frekuensi, dan durasi",
    [
      "Kata bantu bilangan mengikuti benda atau peristiwa yang dihitung. Letaknya biasanya setelah objek atau waktu.",
      "Durasi seperti ～時間、～週間、～か月 dapat langsung mendahului kata kerja dan tidak memakai に.",
      "Frekuensi memakai ～回 atau ～に一回 untuk menyatakan berapa kali kegiatan dilakukan dalam suatu periode.",
      "どのくらい／どれくらい menanyakan lama waktu atau tingkat secara umum.",
      "Kata tanya ぐらい dapat digunakan dalam jawaban untuk menyatakan perkiraan.",
    ],
  ],
  [
    "Bentuk lampau dan perbandingan lanjutan",
    [
      "Kata benda dan な形容詞 berubah menjadi ～でした dalam bentuk lampau positif dan ～じゃありませんでした dalam bentuk lampau negatif.",
      "い形容詞 berubah い menjadi かったです dalam bentuk lampau positif dan くなかったです dalam bentuk lampau negatif.",
      "より menunjukkan pembanding; ほど～ない menyatakan tidak se... dibandingkan pembandingnya.",
      "どちらが lebih cocok untuk dua pilihan, sedangkan どれ／だれ／いつが cocok untuk tiga pilihan atau lebih.",
      "いちばん menunjukkan tingkat tertinggi dalam kelompok yang batasnya jelas.",
    ],
  ],
  [
    "Keinginan dan harapan",
    [
      "Nがほしいです menyatakan benda yang diinginkan. Orang pertama adalah subjek yang paling lazim digunakan.",
      "Vます tanpa ます lalu たいです menyatakan keinginan melakukan tindakan.",
      "たいです berubah seperti い形容詞 saat negatif atau lampau.",
      "TempatへVます-stemに行きます menyatakan pergi ke suatu tempat untuk melakukan kegiatan.",
      "どこか dan なにか menyatakan sesuatu atau suatu tempat yang tidak spesifik.",
      "Saat menjelaskan keinginan orang lain, konteks dan bentuk yang lebih hati-hati diperlukan.",
    ],
  ],
  [
    "Bentuk て dan permintaan",
    [
      "Bentuk て dibuat berbeda menurut kelompok kata kerja. Kuasai pengelompokan agar pola berikutnya mudah dipakai.",
      "Vてください meminta tindakan dengan sopan; gunakan ketika pembicara meminta bantuan atau instruksi.",
      "Vています dapat menjelaskan kegiatan yang sedang terjadi pada saat berbicara.",
      "Beberapa kata kerja dengan ています lebih tepat dipahami sebagai keadaan berlanjut, bukan tindakan sesaat.",
      "Kelompok kata kerja dan perubahan bunyi perlu diperhatikan saat membentuk て.",
    ],
  ],
  [
    "Izin, larangan, dan keadaan",
    [
      "Vてもいいです berarti boleh melakukan sesuatu; bentuk pertanyaan dipakai untuk meminta izin.",
      "Vてはいけません berarti tidak boleh melakukan sesuatu dan cocok untuk aturan atau larangan.",
      "Vています dapat menyatakan pekerjaan, kebiasaan, keadaan hasil, atau situasi sekarang.",
      "しっています berarti tahu/kenal; bentuk negatif umumnya しりません, bukan しっていません.",
      "Tanyakan izin dengan nada sopan sesuai situasi, terutama di tempat umum atau pekerjaan.",
    ],
  ],
  [
    "Menyambungkan kalimat",
    [
      "Vて dapat menghubungkan dua kegiatan yang berurutan atau dua informasi terkait.",
      "い形容詞 berubah menjadi ～くて, sedangkan な形容詞 dan kata benda memakai で saat disambungkan.",
      "どうやって menanyakan cara atau langkah melakukan sesuatu.",
      "どのN menunjukkan pilihan tertentu dalam kelompok kata benda.",
      "Kata tanya dapat digabung dengan も untuk makna semua atau tidak satu pun, bergantung bentuk kalimat.",
    ],
  ],
  [
    "Bentuk ない dan aturan",
    [
      "Bentuk ない adalah dasar untuk banyak ungkapan negatif. Perubahan bentuk mengikuti kelompok kata kerja.",
      "Vないでください meminta seseorang untuk tidak melakukan sesuatu.",
      "Vなければなりません menyatakan kewajiban; dalam percakapan bentuknya sering dipendekkan.",
      "Vなくてもいいです berarti suatu tindakan tidak wajib dilakukan.",
      "なにも dan だれも dengan bentuk negatif menyatakan tidak apa pun atau tidak seorang pun.",
    ],
  ],
  [
    "Bentuk kamus dan kemampuan",
    [
      "V辞書形 adalah bentuk dasar yang dipakai dalam kamus dan sebagai dasar pola lanjutan.",
      "V辞書形ことができます menyatakan kemampuan atau kemungkinan melakukan tindakan.",
      "しゅみはV辞書形ことです menyatakan hobi berupa aktivitas.",
      "V辞書形まえに menunjukkan tindakan yang dilakukan sebelum aktivitas lain.",
      "～時間 atau ～日間 menunjukkan lama kegiatan dan dipadukan dengan kata kerja sesuai konteks.",
    ],
  ],
  [
    "Pengalaman, perubahan, dan kebiasaan",
    [
      "Vたことがあります menyatakan pengalaman pernah melakukan sesuatu. Waktu pengalaman tidak perlu disebutkan secara rinci.",
      "Nになります dan Aくなります menunjukkan perubahan menjadi suatu keadaan.",
      "V辞書形／ない形ようになります menunjukkan perubahan kemampuan, kebiasaan, atau keadaan.",
      "V辞書形ことがあります dapat menjelaskan kegiatan yang kadang-kadang terjadi.",
      "Pola ini membantu membedakan fakta masa lalu, perubahan, dan kebiasaan berulang.",
    ],
  ],
  [
    "Bentuk biasa dan percakapan informal",
    [
      "Bentuk biasa kata kerja mencakup bentuk kamus, ない、た、dan なかった.",
      "い形容詞 dan な形容詞 juga memiliki bentuk biasa positif, negatif, lampau, dan lampau negatif.",
      "Dalam percakapan informal, kata akhir dan partikel dapat dihilangkan bila konteks sudah jelas.",
      "Bentuk biasa tetap perlu dipakai dengan hati-hati; hubungan sosial menentukan tingkat bahasa yang sesuai.",
      "Pemahaman bentuk biasa penting untuk membaca cerita, dialog santai, dan pola lanjutan.",
    ],
  ],
  [
    "Pendapat dan informasi kutipan",
    [
      "普通形とおもいます menyampaikan pendapat, dugaan, atau keyakinan pembicara.",
      "普通形といいます menyampaikan ucapan, nama, atau informasi yang didengar.",
      "Bentuk sebelum と harus sesuai dengan jenis kata: kata benda dan な形容詞 memiliki penyesuaian khusus.",
      "～でしょう dapat memperhalus dugaan atau meminta konfirmasi ringan.",
      "Informasi sumber dapat ditambahkan agar lawan bicara memahami siapa yang mengatakan sesuatu.",
    ],
  ],
  [
    "Klausa penjelas untuk kata benda",
    [
      "Klausa yang menjelaskan diletakkan sebelum kata benda tanpa kata “yang”.",
      "Kata kerja, kata sifat, dan kata benda di dalam klausa memakai bentuk biasa.",
      "Subjek dalam klausa penerang sering memakai が untuk membedakannya dari topik kalimat utama.",
      "Klausa dapat menjelaskan orang, benda, tempat, waktu, atau peristiwa.",
      "Baca dari akhir: cari kata benda utama lebih dahulu, lalu lihat informasi yang menerangkannya.",
    ],
  ],
  [
    "Waktu dan hubungan kondisi",
    [
      "V辞書形とき menunjukkan melakukan sesuatu sebelum suatu waktu/kejadian; Vたとき menunjukkan setelah kejadian itu selesai.",
      "Aいとき、Aなとき、danNのとき menyesuaikan bentuk dengan jenis kata yang menerangkan waktu.",
      "V辞書形と dapat menyatakan hasil yang selalu atau alami terjadi setelah suatu kondisi.",
      "Pola と tidak lazim dipakai untuk keinginan atau perintah yang disengaja pada hasilnya.",
      "Gunakan konteks waktu untuk membedakan arti ketika, saat, dan jika.",
    ],
  ],
  [
    "Memberi dan menerima bantuan",
    [
      "Vてあげます menyatakan melakukan tindakan untuk orang lain; berhati-hatilah agar tidak terdengar membanggakan diri.",
      "Vてもらいます menyatakan pembicara menerima bantuan dari orang lain.",
      "Vてくれます menyatakan orang lain melakukan bantuan untuk pembicara atau pihak pembicara.",
      "に menandai orang yang menerima atau memberi bantuan, sesuai arah tindakan.",
      "Pilihan pola bergantung pada empati dan sudut pandang pembicara.",
    ],
  ],
  [
    "Pengandaian dan syarat",
    [
      "Vたら menyatakan jika atau ketika suatu kondisi terjadi; hasilnya dapat berupa keinginan, permintaan, atau rencana.",
      "Aかったら、Aだったら、danNだったら menyesuaikan bentuk pengandaian dengan jenis kata.",
      "Vても menyatakan bahwa hasil tidak berubah walaupun kondisi tertentu terjadi.",
      "もし dapat dipakai pada awal kalimat untuk menekankan makna andaikan.",
      "Bandingkan pola syarat dengan konteks nyata, kebiasaan umum, dan rencana pribadi agar memilih bentuk yang tepat.",
    ],
  ],
];

const pointExamples = [
  [],
  [
    "これは 本です。|Ini buku.",
    "この かさは わたしのです。|Payung ini milik saya.",
    "それは ちがいます。|Itu berbeda/tidak benar.",
    "どれが あなたの かばんですか。|Yang mana tas Anda?",
    "ミラーさんも 学生です。|Sdr. Miller juga mahasiswa.",
  ],
  [
    "ここは きょうしつです。|Di sini ruang kelas.",
    "うけつけは あちらです。|Meja penerimaan di sebelah sana.",
    "トイレは どこですか。|Di mana toilet?",
    "IMCの じむしょです。|Ini kantor IMC.",
  ],
  [
    "わたしは 7じに おきます。|Saya bangun pukul 7.",
    "きょうは はたらきません。|Hari ini saya tidak bekerja.",
    "9じから 5じまで はたらきます。|Saya bekerja dari jam 9 sampai 5.",
    "ともだちと えいがを みます。|Saya menonton film dengan teman.",
  ],
  [
    "あした とうきょうへ いきます。|Besok saya pergi ke Tokyo.",
    "でんしゃで かいしゃへ いきます。|Saya pergi ke kantor dengan kereta.",
    "ともだちと きょうとへ いきました。|Saya pergi ke Kyoto dengan teman.",
    "いつ にほんへ きますか。|Kapan datang ke Jepang?",
  ],
  [
    "まいあさ パンを たべます。|Setiap pagi saya makan roti.",
    "としょかんで べんきょうします。|Saya belajar di perpustakaan.",
    "いっしょに ひるごはんを たべませんか。|Maukah makan siang bersama?",
    "ちょっと やすみましょう。|Mari beristirahat sebentar.",
  ],
  [
    "はしで ごはんを たべます。|Saya makan nasi dengan sumpit.",
    "わたしは ともだちに はなを あげます。|Saya memberi bunga kepada teman.",
    "ともだちに ほんを もらいました。|Saya menerima buku dari teman.",
    "もう しゅくだいを しました。|Saya sudah mengerjakan PR.",
  ],
  [
    "この へやは ひろいです。|Kamar ini luas.",
    "この まちは しずかじゃありません。|Kota ini tidak tenang.",
    "とても おいしい りょうりです。|Ini masakan yang sangat enak.",
    "にほんごは えいごより むずかしいです。|Bahasa Jepang lebih sulit daripada bahasa Inggris.",
  ],
  [
    "わたしは にほんごが わかります。|Saya mengerti bahasa Jepang.",
    "サッカーが すきです。|Saya suka sepak bola.",
    "ミラーさんは りょうりが じょうずです。|Sdr. Miller pandai memasak.",
    "りんごを 3つ かいました。|Saya membeli tiga apel.",
  ],
  [
    "つくえの うえに ほんが あります。|Ada buku di atas meja.",
    "へやに ねこが います。|Ada kucing di kamar.",
    "ぎんこうは えきの まえに あります。|Bank berada di depan stasiun.",
    "かばんは どこに ありますか。|Di mana tasnya?",
  ],
  [
    "りんごを 5つ かいました。|Saya membeli lima apel.",
    "にほんごを 3か月 べんきょうしました。|Saya belajar Jepang selama tiga bulan.",
    "1しゅうかんに 2かい えいがを みます。|Saya menonton film dua kali seminggu.",
    "どのくらい にほんごを べんきょうしますか。|Berapa lama belajar Jepang?",
  ],
  [
    "きのうは さむかったです。|Kemarin dingin.",
    "この まちは にぎやかでした。|Kota ini ramai.",
    "くるまは でんしゃより はやいです。|Mobil lebih cepat daripada kereta.",
    "にほんで ふじさんが いちばん たかいです。|Gunung Fuji paling tinggi di Jepang.",
  ],
  [
    "あたらしい くるまが ほしいです。|Saya ingin mobil baru.",
    "にほんへ いきたいです。|Saya ingin pergi ke Jepang.",
    "きょうは なにも たべたくないです。|Hari ini saya tidak ingin makan apa pun.",
    "ともだちに あいたいです。|Saya ingin bertemu teman.",
  ],
  [
    "ここに なまえを かいてください。|Tolong tulis nama di sini.",
    "ドアを しめてください。|Tolong tutup pintunya.",
    "いま でんわを かけています。|Sekarang sedang menelepon.",
    "まいにち にほんごを ならっています。|Saya belajar Jepang setiap hari.",
  ],
  [
    "ここで しゃしんを とっても いいですか。|Bolehkah memotret di sini?",
    "ここで たばこを すっては いけません。|Tidak boleh merokok di sini.",
    "わたしは IMCで はたらいています。|Saya bekerja di IMC.",
    "でんわばんごうを しっていますか。|Apakah Anda tahu nomor teleponnya?",
  ],
  [
    "あさ ごはんを たべて、かいしゃへ いきます。|Saya sarapan lalu pergi ke kantor.",
    "この かばんは おもくて、たかいです。|Tas ini berat dan mahal.",
    "バスで えきへ いきます。|Saya pergi ke stasiun dengan bus.",
    "どうやって びょういんへ いきますか。|Bagaimana pergi ke rumah sakit?",
  ],
  [
    "ここで あそばないでください。|Tolong jangan bermain di sini.",
    "くすりを のまなければなりません。|Harus minum obat.",
    "あしたは こなくても いいです。|Besok tidak perlu datang.",
    "だれも いません。|Tidak ada seorang pun.",
  ],
  [
    "わたしは にほんごを はなすことが できます。|Saya bisa berbicara bahasa Jepang.",
    "しゅみは ほんを よむことです。|Hobi saya membaca buku.",
    "ねる まえに はを みがきます。|Saya sikat gigi sebelum tidur.",
    "ここで しゃしんを とることが できます。|Bisa memotret di sini.",
  ],
  [
    "にほんへ いったことが あります。|Saya pernah pergi ke Jepang.",
    "もう すずしく なりました。|Sudah menjadi sejuk.",
    "にほんごが はなせるように なりました。|Saya sudah menjadi bisa berbicara Jepang.",
    "ときどき かいしゃへ くることが あります。|Kadang-kadang datang ke kantor.",
  ],
  [
    "きょうは いかない。|Hari ini tidak pergi.",
    "きのう えいがを みた。|Kemarin menonton film.",
    "この ほんは おもしろい。|Buku ini menarik.",
    "あした ひま？|Besok senggang?",
  ],
  [
    "あしたは あめが ふると おもいます。|Saya pikir besok akan hujan.",
    "たなかさんは くると いいます。|Tanaka berkata akan datang.",
    "この まちは しずかだと おもいます。|Saya pikir kota ini tenang.",
    "あしたは いい てんきでしょう。|Besok mungkin cuacanya bagus.",
  ],
  [
    "これは わたしが きのう かった ほんです。|Ini buku yang saya beli kemarin.",
    "あそこに いる ひとは せんせいです。|Orang yang ada di sana adalah guru.",
    "これは にほんで とった しゃしんです。|Ini foto yang diambil di Jepang.",
    "わたしが すんでいる まちは しずかです。|Kota tempat saya tinggal tenang.",
  ],
  [
    "にほんへ いくとき、パスポートが いります。|Saat pergi ke Jepang, perlu paspor.",
    "ねるとき、ほんを よみます。|Saat tidur, saya membaca buku.",
    "はるに なると、さくらが さきます。|Saat musim semi tiba, sakura mekar.",
    "この ボタンを おすと、ドアが あきます。|Jika menekan tombol ini, pintu terbuka.",
  ],
  [
    "わたしは ともだちに にほんごを おしえてあげます。|Saya mengajari teman bahasa Jepang.",
    "ともだちに てつだってもらいました。|Saya dibantu teman.",
    "せんせいが ほんを かしてくれました。|Guru meminjamkan buku kepada saya.",
    "ともだちに えきを おしえてもらいます。|Saya meminta teman menunjukkan stasiun.",
  ],
  [
    "あめが ふったら、いきません。|Jika hujan, saya tidak pergi.",
    "ひまだったら、あそびに きてください。|Jika senggang, silakan datang bermain.",
    "たかくても、この かばんを かいます。|Walaupun mahal, saya membeli tas ini.",
    "もし じかんが あったら、でんわしてください。|Jika ada waktu, tolong telepon.",
  ],
];

const tailoredQuizData = {
  1: [
    "Lengkapi kalimat nominal: Watashi wa gakusei ___.",
    ["desu", "o", "ni"],
    0,
    "desu menutup pernyataan nominal dengan sopan.",
  ],
  2: [
    "Kata tunjuk untuk benda dekat pembicara adalah ...",
    ["kore", "sore", "are"],
    0,
    "kore berarti ini.",
  ],
  3: [
    "Kata tanya untuk lokasi adalah ...",
    ["doko", "dare", "itsu"],
    0,
    "doko digunakan untuk menanyakan tempat.",
  ],
  4: [
    "Partikel untuk waktu yang spesifik adalah ...",
    ["ni", "o", "to"],
    0,
    "ni dipakai pada jam atau tanggal tertentu.",
  ],
  5: [
    "Partikel untuk alat transportasi adalah ...",
    ["de", "o", "ga"],
    0,
    "de menandai sarana seperti densha de.",
  ],
  6: [
    "Partikel tempat melakukan kegiatan adalah ...",
    ["de", "ni", "to"],
    0,
    "de menunjukkan tempat aktivitas berlangsung.",
  ],
  7: [
    "agemasu berarti ...",
    ["memberi", "menerima", "pergi"],
    0,
    "agemasu berarti memberi kepada orang lain.",
  ],
  8: [
    "Bentuk untuk tidak terlalu mahal adalah ...",
    ["amari takakunai desu", "totemo takai desu", "takai desu ka"],
    0,
    "amari digunakan dengan bentuk negatif.",
  ],
  9: [
    "Partikel yang lazim dipakai dengan suki desu adalah ...",
    ["ga", "o", "e"],
    0,
    "Hal yang disukai biasanya memakai ga.",
  ],
  10: [
    "Kata kerja ada untuk manusia atau hewan adalah ...",
    ["imasu", "arimasu", "desu"],
    0,
    "imasu dipakai untuk manusia dan hewan.",
  ],
  11: [
    "isshukan ni nikai berarti ...",
    ["dua kali seminggu", "dua minggu", "setiap hari"],
    0,
    "Pola ini menyatakan frekuensi.",
  ],
  12: [
    "Bentuk lampau dari genki desu adalah ...",
    ["genki deshita", "genki masu", "genki te"],
    0,
    "Kata benda atau na-adjective memakai deshita.",
  ],
  13: [
    "Bentuk keinginan dari ikimasu adalah ...",
    ["ikitai", "ikimasu", "ikanai"],
    0,
    "Masu-stem ditambah tai menyatakan keinginan.",
  ],
  14: [
    "Permintaan sopan memakai pola ...",
    ["te kudasai", "masu ka", "nai de"],
    0,
    "Te kudasai berarti tolong lakukan.",
  ],
  15: [
    "Temo ii desu ka digunakan untuk ...",
    ["meminta izin", "melarang", "menyatakan sedang"],
    0,
    "Pola ini menanyakan boleh atau tidak.",
  ],
  16: [
    "Untuk menghubungkan dua tindakan gunakan ...",
    ["bentuk te", "bentuk tai", "bentuk nai"],
    0,
    "Bentuk te menyambung tindakan.",
  ],
  17: [
    "Nai de kudasai berarti ...",
    ["tolong jangan", "silakan lakukan", "ingin lakukan"],
    0,
    "Pola ini adalah larangan sopan.",
  ],
  18: [
    "Koto ga dekimasu menyatakan ...",
    ["kemampuan", "keinginan", "larangan"],
    0,
    "Pola ini menyatakan bisa melakukan sesuatu.",
  ],
  19: [
    "Ta koto ga arimasu menyatakan ...",
    ["pengalaman", "rencana", "perintah"],
    0,
    "Pola ini berarti pernah melakukan.",
  ],
  20: [
    "Bentuk biasa dari tabemasu adalah ...",
    ["taberu", "tabete", "tabetai"],
    0,
    "taberu adalah bentuk kamus.",
  ],
  21: [
    "To omoimasu digunakan untuk ...",
    ["pendapat", "lokasi", "jumlah"],
    0,
    "Pola ini menyatakan pikiran atau pendapat.",
  ],
  22: [
    "Klausa penjelas diletakkan ...",
    ["sebelum kata benda", "sesudah kata benda", "di akhir selalu"],
    0,
    "Klausa biasa langsung mendahului kata benda.",
  ],
  23: [
    "To pada pola pulang lalu cuci tangan menyatakan ...",
    ["hasil kebiasaan alami", "objek", "alat"],
    0,
    "To menunjukkan hasil yang biasanya mengikuti kondisi.",
  ],
  24: [
    "Te kuremashita berarti ...",
    [
      "orang lain membantu saya",
      "saya membantu orang lain",
      "saya menerima barang",
    ],
    0,
    "Kureru menunjukkan kebaikan untuk pembicara.",
  ],
  25: [
    "Tara pada kalimat berarti ...",
    ["jika atau ketika", "karena", "walaupun"],
    0,
    "Tara menyatakan syarat.",
  ],
  26: [
    "N desu ka dipakai untuk ...",
    ["meminta penjelasan", "menyuruh", "menghitung"],
    0,
    "N desu ka meminta alasan atau penjelasan.",
  ],
  27: [
    "Ta hou ga ii desu berarti ...",
    ["sebaiknya melakukan", "jangan melakukan", "sedang melakukan"],
    0,
    "Pola ini digunakan untuk memberi saran positif.",
  ],
  28: [
    "Tara adalah bentuk untuk ...",
    ["syarat", "kepemilikan", "perbandingan"],
    0,
    "Tara digunakan dalam pengandaian.",
  ],
  29: [
    "Te imasu dapat menyatakan ...",
    ["keadaan hasil tindakan", "masa lampau saja", "keinginan"],
    0,
    "Contohnya jendela dalam keadaan tertutup.",
  ],
  30: [
    "Te okimasu berarti ...",
    ["melakukan persiapan", "melakukan larangan", "menerima bantuan"],
    0,
    "Pola ini menunjukkan persiapan sebelumnya.",
  ],
  31: [
    "Tsumori desu berarti ...",
    ["niat pribadi", "perintah", "kemampuan"],
    0,
    "Tsumori desu menyatakan maksud pembicara.",
  ],
  32: [
    "Nai hou ga ii desu berarti ...",
    ["sebaiknya jangan", "silakan lakukan", "sudah melakukan"],
    0,
    "Ini saran agar tidak melakukan sesuatu.",
  ],
  33: [
    "Bentuk kamus ditambah na adalah ...",
    ["larangan tegas", "permintaan sopan", "keinginan"],
    0,
    "Contohnya hairu na.",
  ],
  34: [
    "Ta ato de berarti ...",
    ["setelah melakukan", "sebelum melakukan", "sedang melakukan"],
    0,
    "Ato de menyatakan urutan sesudah kegiatan.",
  ],
  35: [
    "Ba adalah bentuk ...",
    ["syarat", "objek", "alat"],
    0,
    "Ba menyatakan jika kondisi dipenuhi.",
  ],
  36: [
    "You ni pada pelajaran ini menyatakan ...",
    ["tujuan kemampuan", "larangan", "kepemilikan"],
    0,
    "Contohnya berlatih agar bisa berbicara.",
  ],
  37: [
    "Raremashita pada konteks ini adalah ...",
    ["pasif", "kausatif", "keinginan"],
    0,
    "Subjek menerima tindakan dari orang lain.",
  ],
  38: [
    "Bentuk kamus ditambah no wa membuat ...",
    ["kegiatan menjadi topik", "perintah", "tempat"],
    0,
    "No wa menominalkan kegiatan.",
  ],
  39: [
    "Sasemasu menyatakan ...",
    ["membuat atau membiarkan", "mengalami pasif", "berniat"],
    0,
    "Ini adalah bentuk kausatif.",
  ],
  40: [
    "O - kudasai digunakan untuk ...",
    ["permintaan hormat", "larangan", "pengalaman"],
    0,
    "Pola ini meminta tindakan dengan hormat.",
  ],
  41: [
    "Haiken shimasu adalah bentuk ...",
    ["merendahkan diri", "pasif", "perintah"],
    0,
    "Ungkapan ini dipakai dengan rendah hati.",
  ],
  42: [
    "Tame ni digunakan untuk ...",
    ["tujuan yang disengaja", "waktu lampau", "larangan"],
    0,
    "Tame ni menyatakan tujuan.",
  ],
  43: [
    "Te kimasu dapat menunjukkan ...",
    ["perubahan sampai kini", "perintah keras", "kepemilikan"],
    0,
    "Pola ini menunjukkan perubahan yang mendekat ke sekarang.",
  ],
  44: [
    "Sou desu pada pelajaran ini digunakan untuk ...",
    ["informasi yang didengar", "keinginan", "alat"],
    0,
    "Sou desu menyampaikan kabar dari sumber lain.",
  ],
  45: [
    "Temo menyatakan ...",
    ["walaupun", "jika", "karena"],
    0,
    "Hasil tetap terjadi meski kondisi ada.",
  ],
  46: [
    "Aida ni berarti ...",
    ["selama rentang waktu", "sebelum", "setelah"],
    0,
    "Kejadian berlangsung pada saat aktivitas lain.",
  ],
  47: [
    "You ni iwaremashita berarti ...",
    ["diberi instruksi tidak langsung", "memberi hadiah", "sedang belajar"],
    0,
    "Pola ini melaporkan perintah atau permintaan.",
  ],
  48: [
    "You ni dapat menyatakan ...",
    ["tujuan keadaan atau kemampuan", "benda milik", "waktu tertentu"],
    0,
    "Misalnya duduk agar bisa melihat jelas.",
  ],
  49: [
    "Omochi shimasu adalah bentuk ...",
    ["merendahkan diri", "biasa", "larangan"],
    0,
    "Bentuk ini merendahkan tindakan pembicara.",
  ],
  50: [
    "You ni shiteimasu menunjukkan ...",
    ["kebiasaan yang diusahakan", "kejadian sekali", "larangan"],
    0,
    "Pola ini menyatakan upaya yang berkelanjutan.",
  ],
};
