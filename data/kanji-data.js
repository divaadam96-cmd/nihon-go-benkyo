const kanjiLessons = [
  {
    char: "\u5c71",
    meaning: "Gunung",
    on: "san, zan",
    kun: "yama",
    steps:
      "1. Tulis garis pendek di atas.  2. Tambahkan garis kiri.  3. Selesaikan garis kanan yang lebih panjang.",
    words: [
      ["\u5bcc\u58eb\u5c71", "fujisan - Gunung Fuji"],
      ["\u706b\u5c71", "kazan - gunung berapi"],
      ["\u5c71\u5ddd", "yamakawa - gunung dan sungai"],
    ],
    level: "N5",
  },
  {
    char: "\u5ddd",
    meaning: "Sungai",
    on: "sen",
    kun: "kawa",
    steps:
      "1. Tulis garis kiri.  2. Tulis garis tengah.  3. Tulis garis kanan.",
    words: [
      ["\u5ddd", "kawa - sungai"],
      ["\u5ddd\u53e3", "kawaguchi - muara sungai"],
      ["\u6cb3\u5ddd", "kasen - sungai besar"],
    ],
    level: "N5",
  },
  {
    char: "\u4eba",
    meaning: "Orang",
    on: "jin, nin",
    kun: "hito",
    steps:
      "1. Buat sapuan miring ke kiri.  2. Tambahkan sapuan panjang ke kanan.",
    words: [
      ["\u65e5\u672c\u4eba", "nihonjin - orang Jepang"],
      ["\u4e8c\u4eba", "futari - dua orang"],
      ["\u4eba\u53e3", "jinko - populasi"],
    ],
    level: "N5",
  },
  {
    char: "\u65e5",
    meaning: "Matahari dan hari",
    on: "nichi, jitsu",
    kun: "hi, bi",
    steps:
      "1. Garis atas.  2. Garis tegak kiri dan bagian dalam.  3. Garis tengah.  4. Tutup dengan garis bawah.",
    words: [
      ["\u65e5\u672c", "nihon - Jepang"],
      ["\u65e5\u66dc\u65e5", "nichiyobi - hari Minggu"],
      ["\u6bce\u65e5", "mainichi - setiap hari"],
    ],
    level: "N5",
  },
  {
    char: "\u6708",
    meaning: "Bulan",
    on: "getsu, gatsu",
    kun: "tsuki",
    steps:
      "1. Tulis bagian kiri atas.  2. Bentuk bingkai vertikal.  3. Tambahkan dua garis pendek di dalam.  4. Tutup bagian bawah.",
    words: [
      ["\u6708\u66dc\u65e5", "getsuyobi - hari Senin"],
      ["\u4e00\u304b\u6708", "ikkagetsu - satu bulan"],
      ["\u4eca\u6708", "kongetsu - bulan ini"],
    ],
    level: "N5",
  },
  {
    char: "\u6728",
    meaning: "Pohon dan kayu",
    on: "moku, boku",
    kun: "ki",
    steps:
      "1. Tulis garis mendatar.  2. Tarik garis tegak ke bawah.  3. Buat sapuan kiri.  4. Buat sapuan kanan.",
    words: [
      ["\u6728\u66dc\u65e5", "mokuyobi - hari Kamis"],
      ["\u6728", "ki - pohon"],
      ["\u6728\u6751", "kimura - nama keluarga Kimura"],
    ],
    level: "N5",
  },
  {
    char: "\u672c",
    meaning: "Buku dan asal",
    on: "hon",
    kun: "moto",
    steps:
      "1. Tulis kanji kayu.  2. Tambahkan garis pendek di bawah bagian tengah sebagai penanda akar.",
    words: [
      ["\u672c", "hon - buku"],
      ["\u65e5\u672c", "nihon - Jepang"],
      ["\u672c\u5f53", "honto - benar, sungguh"],
    ],
    level: "N5",
  },
  {
    char: "\u5b66",
    meaning: "Belajar",
    on: "gaku",
    kun: "manabu",
    steps:
      "1. Tulis bagian atas.  2. Tambahkan dua titik di tengah.  3. Tulis penutup seperti atap.  4. Selesaikan bagian anak di bawah.",
    words: [
      ["\u5b66\u751f", "gakusei - siswa atau mahasiswa"],
      ["\u5b66\u6821", "gakko - sekolah"],
      ["\u5b66\u3076", "manabu - belajar"],
    ],
    level: "N5",
  },
  {
    char: "大",
    meaning: "Besar",
    on: "dai, tai",
    kun: "oo(kii)",
    steps:
      "1. Tulis garis mendatar di bagian atas.  2. Dari tengah garis itu, tarik sapuan ke kiri bawah.  3. Dari titik yang sama, tarik sapuan ke kanan bawah.",
    words: [
      ["大きい", "ookii - besar"],
      ["大学", "daigaku - universitas"],
      ["大切", "taisetsu - penting"],
    ],
    level: "N5",
  },
  {
    char: "一",
    meaning: "Satu",
    on: "ichi, itsu",
    kun: "hito(tsu)",
    steps: "1. Tulis satu garis mendatar dari kiri ke kanan.",
    words: [
      ["一人", "hitori - satu orang"],
      ["一月", "ichigatsu - bulan Januari"],
      ["一つ", "hitotsu - satu buah"],
    ],
    level: "N5",
  },
  {
    char: "分",
    meaning: "Bagian, menit, mengerti",
    on: "bun, fun, bu",
    kun: "wa(karu), wa(keru)",
    steps:
      "1. Tulis sapuan pendek ke kiri bawah di bagian atas.  2. Tulis sapuan pendek ke kanan bawah di sebelahnya.  3. Buat garis mendatar yang menekuk turun di bagian bawah.  4. Tarik sapuan diagonal memotong dari kanan atas ke kiri bawah.",
    words: [
      ["分かる", "wakaru - mengerti"],
      ["半分", "hanbun - setengah"],
      ["三分", "sanpun - tiga menit"],
    ],
    level: "N5",
  },
  {
    char: "見",
    meaning: "Melihat",
    on: "ken",
    kun: "mi(ru), mi(eru)",
    steps:
      "1. Tulis garis tegak kiri dari kotak mata (目) di bagian atas.  2. Lanjutkan garis atas yang menekuk turun di sisi kanan.  3. Tambahkan dua garis mendatar pendek di dalam kotak.  4. Tutup bagian bawah kotak dengan garis mendatar.  5. Buat sapuan kaki kiri dari tengah turun ke kiri bawah.  6. Buat sapuan kaki kanan dengan sedikit kaitan di ujung.",
    words: [
      ["見る", "miru - melihat"],
      ["意見", "iken - pendapat"],
      ["見学", "kengaku - berkunjung untuk belajar"],
    ],
    level: "N5",
  },
  {
    char: "出",
    meaning: "Keluar",
    on: "shutsu, sui",
    kun: "de(ru), da(su)",
    steps:
      "1. Tulis bagian gunung kecil pertama di kiri.  2. Tulis bagian gunung kecil kedua di kanan, sedikit lebih tinggi.  3. Sambungkan dengan garis tegak yang menyatukan kedua bagian.",
    words: [
      ["出る", "deru - keluar"],
      ["出口", "deguchi - pintu keluar"],
      ["出発", "shuppatsu - berangkat"],
    ],
    level: "N5",
  },
  {
    char: "行",
    meaning: "Pergi, melakukan",
    on: "kou, gyou",
    kun: "i(ku), okona(u)",
    steps:
      "1. Tulis sapuan kecil di kiri atas.  2. Tulis garis tegak kiri turun ke bawah.  3. Tulis garis mendatar pendek di tengah atas.  4. Tulis garis tegak kanan turun ke bawah.  5. Tambahkan sapuan kecil di kanan bawah.  6. Tutup dengan garis pendek terakhir di kanan bawah.",
    words: [
      ["行く", "iku - pergi"],
      ["旅行", "ryokou - perjalanan"],
      ["銀行", "ginkou - bank"],
    ],
    level: "N5",
  },
  {
    char: "前",
    meaning: "Sebelum, depan",
    on: "zen",
    kun: "mae",
    steps:
      "1. Tulis dua titik pendek di kiri atas.  2. Buat garis mendatar panjang di bawahnya.  3. Tulis bagian kiri berbentuk kotak kecil (月).  4. Tulis bagian pisau (刀) di kanan dengan sapuan tegak dan kait.",
    words: [
      ["前", "mae - sebelum, depan"],
      ["午前", "gozen - pagi (AM)"],
      ["名前", "namae - nama"],
    ],
    level: "N5",
  },
  {
    char: "時",
    meaning: "Waktu",
    on: "ji",
    kun: "toki",
    steps:
      "1. Tulis bagian matahari (日) di kiri: kotak kecil dengan garis tengah.  2. Tulis garis mendatar atas dari bagian 寺 di kanan.  3. Tulis garis tegak tengah menembus ke bawah.  4. Tambahkan garis mendatar kedua.  5. Tutup dengan sapuan dan titik di bagian bawah (寸).",
    words: [
      ["時間", "jikan - waktu"],
      ["何時", "nanji - jam berapa"],
      ["時々", "tokidoki - kadang-kadang"],
    ],
    level: "N5",
  },
  {
    char: "生",
    meaning: "Hidup, lahir, mentah",
    on: "sei, shou",
    kun: "i(kiru), u(mareru), nama",
    steps:
      "1. Tulis sapuan pendek ke kiri bawah di bagian atas.  2. Tulis garis mendatar di bawahnya.  3. Tulis garis mendatar kedua sedikit lebih panjang.  4. Tutup dengan garis tegak yang memotong ke bawah.",
    words: [
      ["学生", "gakusei - siswa"],
      ["先生", "sensei - guru"],
      ["誕生日", "tanjoubi - hari ulang tahun"],
    ],
    level: "N5",
  },
  {
    char: "中",
    meaning: "Tengah, dalam",
    on: "chuu",
    kun: "naka",
    steps:
      "1. Tulis kotak persegi di tengah.  2. Tarik garis tegak menembus dari atas ke bawah lewat tengah kotak.",
    words: [
      ["中", "naka - dalam"],
      ["中学校", "chuugakkou - SMP"],
      ["一日中", "ichinichijuu - sepanjang hari"],
    ],
    level: "N5",
  },
  {
    char: "今",
    meaning: "Sekarang",
    on: "kon, kin",
    kun: "ima",
    steps:
      "1. Tulis sapuan pendek di atas.  2. Tulis sapuan panjang menutupi ke kiri bawah.  3. Tambahkan garis kecil di dalam.  4. Tutup dengan garis mendatar di bagian bawah.",
    words: [
      ["今", "ima - sekarang"],
      ["今日", "kyou - hari ini"],
      ["今年", "kotoshi - tahun ini"],
    ],
    level: "N5",
  },
  {
    char: "間",
    meaning: "Antara, interval",
    on: "kan, ken",
    kun: "aida, ma",
    steps:
      "1. Tulis bingkai pintu (門) di luar: dua sisi tegak dan atas.  2. Isi bagian dalam bingkai kiri dan kanan.  3. Tulis matahari (日) di tengah dalam bingkai.",
    words: [
      ["時間", "jikan - waktu"],
      ["間", "aida - antara"],
      ["人間", "ningen - manusia"],
    ],
    level: "N5",
  },
  {
    char: "年",
    meaning: "Tahun",
    on: "nen",
    kun: "toshi",
    steps:
      "1. Tulis sapuan pendek di kiri atas.  2. Tulis tiga garis mendatar sejajar.  3. Tutup dengan garis tegak yang menembus ke bawah.",
    words: [
      ["年", "toshi - usia, tahun"],
      ["今年", "kotoshi - tahun ini"],
      ["去年", "kyonen - tahun lalu"],
    ],
    level: "N5",
  },
  {
    char: "子",
    meaning: "Anak",
    on: "shi, su",
    kun: "ko",
    steps:
      "1. Tulis sapuan melengkung dari atas ke kiri bawah.  2. Tulis garis tegak dengan kait di tengah.  3. Tutup dengan garis mendatar di bagian bawah.",
    words: [
      ["子供", "kodomo - anak"],
      ["女子", "joshi - perempuan"],
      ["男子", "danshi - laki-laki"],
    ],
    level: "N5",
  },
  {
    char: "長",
    meaning: "Panjang, kepala/pemimpin",
    on: "chou",
    kun: "naga(i)",
    steps:
      "1. Tulis garis pendek di atas dan sapuan turun.  2. Tambahkan beberapa garis mendatar sejajar di tengah.  3. Tutup dengan sapuan panjang melengkung ke kanan bawah.",
    words: [
      ["長い", "nagai - panjang"],
      ["社長", "shachou - direktur utama"],
      ["校長", "kouchou - kepala sekolah"],
    ],
    level: "N5",
  },
  {
    char: "上",
    meaning: "Atas",
    on: "jou",
    kun: "ue, a(garu), nobo(ru)",
    steps:
      "1. Tulis garis tegak pendek di kiri.  2. Tulis garis mendatar panjang di bawahnya.  3. Tambahkan garis tegak pendek di atas garis mendatar, sisi kanan.",
    words: [
      ["上", "ue - atas"],
      ["上手", "jouzu - pandai"],
      ["屋上", "okujou - atap"],
    ],
    level: "N5",
  },
  {
    char: "入",
    meaning: "Masuk",
    on: "nyuu",
    kun: "i(ru), hai(ru)",
    steps:
      "1. Tulis sapuan dari kanan atas ke kiri bawah.  2. Tulis sapuan dari kiri atas ke kanan bawah, memotong sapuan pertama.",
    words: [
      ["入る", "hairu - masuk"],
      ["入学", "nyuugaku - masuk sekolah"],
      ["輸入", "yunyuu - impor"],
    ],
    level: "N5",
  },
  {
    char: "後",
    meaning: "Sesudah, belakang",
    on: "go, kou",
    kun: "ato, ushi(ro), nochi",
    steps:
      "1. Tulis langkah kecil (彳) di kiri: dua sapuan pendek.  2. Tulis garis dan simpul benang di tengah atas.  3. Tambahkan garis tegak dan sapuan kecil.  4. Tutup dengan sapuan panjang melengkung di kanan bawah.",
    words: [
      ["後で", "atode - nanti"],
      ["午後", "gogo - sore, PM"],
      ["後ろ", "ushiro - belakang"],
    ],
    level: "N5",
  },
  {
    char: "気",
    meaning: "Semangat, udara",
    on: "ki, ke",
    kun: "",
    steps:
      "1. Tulis sapuan pendek di kiri atas.  2. Tulis garis mendatar di bawahnya.  3. Tulis sapuan melengkung panjang menutupi ke kanan bawah.  4. Tutup dengan sapuan kecil di dalam, menyerupai titik uap.",
    words: [
      ["元気", "genki - sehat"],
      ["天気", "tenki - cuaca"],
      ["病気", "byouki - sakit"],
    ],
    level: "N5",
  },
  {
    char: "来",
    meaning: "Datang",
    on: "rai",
    kun: "ku(ru), ki, ko",
    steps:
      "1. Tulis garis mendatar di bagian atas.  2. Tulis garis tegak tengah menembus ke bawah.  3. Tambahkan sapuan kiri dan sapuan kanan di tengah.  4. Tutup dengan sapuan kiri bawah dan sapuan kanan bawah.",
    words: [
      ["来る", "kuru - datang"],
      ["来週", "raishuu - minggu depan"],
      ["未来", "mirai - masa depan"],
    ],
    level: "N5",
  },
  {
    char: "話",
    meaning: "Berbicara, cerita",
    on: "wa",
    kun: "hana(su), hanashi",
    steps:
      "1. Tulis radikal kata (言) di kiri: garis-garis mendatar dan mulut kecil di bawah.  2. Tulis bagian lidah (舌) di kanan: kotak kecil di atas.  3. Tutup dengan bagian mulut di bawahnya.",
    words: [
      ["話す", "hanasu - berbicara"],
      ["電話", "denwa - telepon"],
      ["会話", "kaiwa - percakapan"],
    ],
    level: "N5",
  },
  {
    char: "女",
    meaning: "Wanita",
    on: "jo, nyo",
    kun: "onna, me",
    steps:
      "1. Tulis sapuan melengkung dari kanan atas ke kiri bawah.  2. Tulis sapuan pendek dari kiri ke kanan bawah, memotong sapuan pertama.  3. Tutup dengan garis mendatar di tengah.",
    words: [
      ["女", "onna - perempuan"],
      ["女性", "josei - wanita"],
      ["彼女", "kanojo - dia perempuan, pacar"],
    ],
    level: "N5",
  },
  {
    char: "国",
    meaning: "Negara",
    on: "koku",
    kun: "kuni",
    steps:
      "1. Tulis bingkai kotak besar mengelilingi.  2. Tulis bagian permata (玉) di dalam: garis-garis dan titik.  3. Tutup bingkai dengan garis mendatar bawah.",
    words: [
      ["国", "kuni - negara"],
      ["外国", "gaikoku - luar negeri"],
      ["中国", "chuugoku - China"],
    ],
    level: "N5",
  },
  {
    char: "金",
    meaning: "Emas, uang",
    on: "kin, kon",
    kun: "kane, kana",
    steps:
      "1. Tulis atap kecil di bagian atas.  2. Tulis sapuan kiri dan sapuan kanan di bawahnya.  3. Tambahkan garis tegak tengah.  4. Tutup dengan dua garis mendatar sejajar di bagian bawah.",
    words: [
      ["お金", "okane - uang"],
      ["金曜日", "kinyoubi - hari Jumat"],
      ["料金", "ryoukin - biaya"],
    ],
    level: "N5",
  },
  {
    char: "高",
    meaning: "Tinggi, mahal",
    on: "kou",
    kun: "taka(i)",
    steps:
      "1. Tulis atap kecil di bagian atas.  2. Tulis kotak persegi di tengah.  3. Tutup dengan bagian mulut ganda di bagian bawah.",
    words: [
      ["高い", "takai - mahal, tinggi"],
      ["高校", "koukou - SMA"],
      ["高速", "kousoku - cepat"],
    ],
    level: "N5",
  },
  {
    char: "下",
    meaning: "Bawah",
    on: "ka, ge",
    kun: "shita, sa(garu), kuda(ru)",
    steps:
      "1. Tulis garis mendatar panjang di atas.  2. Tulis garis tegak pendek di bawah garis, sisi kanan.  3. Tambahkan titik pendek di sebelahnya.",
    words: [
      ["下", "shita - bawah"],
      ["地下", "chika - bawah tanah"],
      ["下手", "heta - tidak pandai"],
    ],
    level: "N5",
  },
  {
    char: "先",
    meaning: "Sebelum, mendahului",
    on: "sen",
    kun: "saki",
    steps:
      "1. Tulis bagian atas (garis dan sapuan) menyerupai 屮.  2. Tulis garis mendatar di tengah.  3. Tutup dengan sapuan kaki kiri dan sapuan kaki kanan.",
    words: [
      ["先生", "sensei - guru"],
      ["先週", "senshuu - minggu lalu"],
      ["先に", "sakini - lebih dulu"],
    ],
    level: "N5",
  },
  {
    char: "外",
    meaning: "Luar",
    on: "gai, ge",
    kun: "soto, hoka, hazu(reru)",
    steps:
      "1. Tulis titik kecil di kiri atas (bagian 夕).  2. Tulis sapuan melengkung di bawahnya.  3. Tutup dengan bagian sapuan bersilang (卜) di kanan.",
    words: [
      ["外", "soto - luar"],
      ["外国人", "gaikokujin - orang asing"],
      ["外食", "gaishoku - makan di luar"],
    ],
    level: "N5",
  },
  {
    char: "何",
    meaning: "Apa",
    on: "ka",
    kun: "nani, nan",
    steps:
      "1. Tulis sapuan orang (イ) di kiri.  2. Tulis garis mendatar dan tegak di tengah atas.  3. Tambahkan garis mendatar kedua.  4. Tutup dengan garis tegak panjang menembus ke bawah di kanan.",
    words: [
      ["何", "nani - apa"],
      ["何時", "nanji - jam berapa"],
      ["何か", "nanika - sesuatu"],
    ],
    level: "N5",
  },
  {
    char: "男",
    meaning: "Laki-laki",
    on: "dan, nan",
    kun: "otoko",
    steps:
      "1. Tulis bagian sawah (田) di atas: kotak dengan garis silang.  2. Tutup dengan bagian tenaga (力) di bawah: sapuan tegak dan kait.",
    words: [
      ["男", "otoko - laki-laki"],
      ["男性", "dansei - pria"],
      ["長男", "chounan - anak laki-laki tertua"],
    ],
    level: "N5",
  },
  {
    char: "名",
    meaning: "Nama",
    on: "mei, myou",
    kun: "na",
    steps:
      "1. Tulis sapuan malam (夕) di atas.  2. Tutup dengan bagian mulut (口) di bawahnya.",
    words: [
      ["名前", "namae - nama"],
      ["有名", "yuumei - terkenal"],
      ["名刺", "meishi - kartu nama"],
    ],
    level: "N5",
  },
  {
    char: "小",
    meaning: "Kecil",
    on: "shou",
    kun: "chii(sai), ko, o",
    steps:
      "1. Tulis garis tegak pendek di tengah dengan kait kecil.  2. Tambahkan titik kecil di kiri.  3. Tutup dengan titik kecil di kanan.",
    words: [
      ["小さい", "chiisai - kecil"],
      ["小学校", "shougakkou - SD"],
      ["小説", "shousetsu - novel"],
    ],
    level: "N5",
  },
  {
    char: "聞",
    meaning: "Mendengar, bertanya",
    on: "bun, mon",
    kun: "ki(ku), ki(koeru)",
    steps:
      "1. Tulis bingkai pintu (門) di luar.  2. Isi dengan bagian telinga (耳) di dalam bingkai.",
    words: [
      ["聞く", "kiku - mendengar, bertanya"],
      ["新聞", "shinbun - koran"],
      ["聞こえる", "kikoeru - kedengaran"],
    ],
    level: "N5",
  },
  {
    char: "食",
    meaning: "Makan",
    on: "shoku, jiki",
    kun: "ta(beru), ku(u)",
    steps:
      "1. Tulis atap kecil di bagian atas.  2. Tulis sapuan kiri dan sapuan kanan di bawahnya.  3. Tutup dengan bagian bawah bersusun menyerupai mangkuk.",
    words: [
      ["食べる", "taberu - makan"],
      ["食事", "shokuji - makan"],
      ["食品", "shokuhin - makanan"],
    ],
    level: "N5",
  },
  {
    char: "書",
    meaning: "Menulis, buku",
    on: "sho",
    kun: "ka(ku)",
    steps:
      "1. Tulis bagian tangan memegang kuas di atas.  2. Tambahkan beberapa garis mendatar sejajar.  3. Tutup dengan matahari (日) di bagian bawah.",
    words: [
      ["書く", "kaku - menulis"],
      ["辞書", "jisho - kamus"],
      ["図書館", "toshokan - perpustakaan"],
    ],
    level: "N5",
  },
  {
    char: "電",
    meaning: "Listrik",
    on: "den",
    kun: "",
    steps:
      "1. Tulis bagian hujan (雨) di atas: atap dan titik-titik.  2. Tutup dengan sapuan kilat melengkung dan kait di bagian bawah.",
    words: [
      ["電話", "denwa - telepon"],
      ["電車", "densha - kereta listrik"],
      ["電気", "denki - listrik"],
    ],
    level: "N5",
  },
  {
    char: "二",
    meaning: "Dua",
    on: "ni, ji",
    kun: "futa(tsu)",
    steps:
      "1. Tulis garis mendatar pendek di atas.  2. Tulis garis mendatar panjang di bawahnya.",
    words: [
      ["二人", "futari - dua orang"],
      ["二月", "nigatsu - bulan Februari"],
      ["二つ", "futatsu - dua buah"],
    ],
    level: "N5",
  },
  {
    char: "車",
    meaning: "Mobil, kendaraan",
    on: "sha",
    kun: "kuruma",
    steps:
      "1. Tulis garis tegak tengah dari atas.  2. Tulis kotak persegi mengelilingi bagian tengah.  3. Tambahkan dua garis mendatar menembus kotak.  4. Tutup dengan garis mendatar bawah yang lebih panjang.",
    words: [
      ["車", "kuruma - mobil"],
      ["電車", "densha - kereta listrik"],
      ["自転車", "jitensha - sepeda"],
    ],
    level: "N5",
  },
  {
    char: "水",
    meaning: "Air",
    on: "sui",
    kun: "mizu",
    steps:
      "1. Tulis garis tegak dengan kait di tengah.  2. Tambahkan sapuan kiri atas dan sapuan kiri bawah.  3. Tutup dengan sapuan kanan panjang dari atas ke bawah kanan.",
    words: [
      ["水", "mizu - air"],
      ["水曜日", "suiyoubi - hari Rabu"],
      ["水泳", "suiei - berenang"],
    ],
    level: "N5",
  },
  {
    char: "母",
    meaning: "Ibu",
    on: "bo",
    kun: "haha",
    steps:
      "1. Tulis bingkai melengkung mengelilingi dari kiri.  2. Tambahkan dua titik di dalam.  3. Tutup dengan garis penutup di bagian bawah.",
    words: [
      ["母", "haha - ibu"],
      ["お母さん", "okaasan - ibu (orang lain)"],
      ["母国", "bokoku - tanah air"],
    ],
    level: "N5",
  },
  {
    char: "校",
    meaning: "Sekolah",
    on: "kou",
    kun: "",
    steps:
      "1. Tulis bagian kayu (木) di kiri: garis mendatar, tegak, lalu dua sapuan.  2. Tulis bagian atas (交) di kanan: atap kecil.  3. Tutup dengan sapuan bersilang di bagian bawah kanan.",
    words: [
      ["学校", "gakkou - sekolah"],
      ["校長", "kouchou - kepala sekolah"],
      ["高校", "koukou - SMA"],
    ],
    level: "N5",
  },
  {
    char: "三",
    meaning: "Tiga",
    on: "san",
    kun: "mit(tsu)",
    steps:
      "1. Tulis garis mendatar pendek di atas.  2. Tulis garis mendatar pendek di tengah.  3. Tulis garis mendatar panjang di bawah.",
    words: [
      ["三つ", "mittsu - tiga buah"],
      ["三月", "sangatsu - bulan Maret"],
      ["三人", "sannin - tiga orang"],
    ],
    level: "N5",
  },
  {
    char: "四",
    meaning: "Empat",
    on: "shi",
    kun: "yo, yon, yot(tsu)",
    steps:
      "1. Tulis garis tegak kiri turun.  2. Tulis garis atas menyambung ke kanan lalu turun membentuk kotak.  3. Tulis sapuan kiri di dalam kotak.  4. Tulis sapuan kanan di dalam kotak.  5. Tutup dengan garis mendatar bawah.",
    words: [
      ["四つ", "yottsu - empat buah"],
      ["四月", "shigatsu - bulan April"],
      ["四人", "yonin - empat orang"],
    ],
    level: "N5",
  },
  {
    char: "五",
    meaning: "Lima",
    on: "go",
    kun: "itsu(tsu)",
    steps:
      "1. Tulis garis mendatar pendek di atas.  2. Tulis sapuan menyilang dari kanan atas ke kiri bawah.  3. Tulis garis mendatar tengah membentuk kotak kecil.  4. Tutup dengan garis mendatar panjang di bawah.",
    words: [
      ["五つ", "itsutsu - lima buah"],
      ["五月", "gogatsu - bulan Mei"],
      ["五人", "gonin - lima orang"],
    ],
    level: "N5",
  },
  {
    char: "六",
    meaning: "Enam",
    on: "roku",
    kun: "mut(tsu)",
    steps:
      "1. Tulis titik kecil di atas.  2. Tulis garis mendatar di bawah titik.  3. Tulis sapuan kiri bawah.  4. Tulis sapuan kanan bawah.",
    words: [
      ["六つ", "muttsu - enam buah"],
      ["六月", "rokugatsu - bulan Juni"],
      ["六人", "rokunin - enam orang"],
    ],
    level: "N5",
  },
  {
    char: "七",
    meaning: "Tujuh",
    on: "shichi",
    kun: "nana(tsu)",
    steps:
      "1. Tulis garis mendatar dari kiri ke kanan dengan sedikit lengkungan turun.  2. Tulis garis tegak dengan kait kecil di bagian bawah, memotong garis pertama.",
    words: [
      ["七つ", "nanatsu - tujuh buah"],
      ["七月", "shichigatsu - bulan Juli"],
      ["七人", "nananin - tujuh orang"],
    ],
    level: "N5",
  },
  {
    char: "八",
    meaning: "Delapan",
    on: "hachi",
    kun: "yat(tsu)",
    steps:
      "1. Tulis sapuan dari atas ke kiri bawah.  2. Tulis sapuan dari atas ke kanan bawah, terpisah dari sapuan pertama.",
    words: [
      ["八つ", "yattsu - delapan buah"],
      ["八月", "hachigatsu - bulan Agustus"],
      ["八人", "hachinin - delapan orang"],
    ],
    level: "N5",
  },
  {
    char: "九",
    meaning: "Sembilan",
    on: "kyuu, ku",
    kun: "kokono(tsu)",
    steps:
      "1. Tulis sapuan melengkung dari kiri atas turun ke kanan.  2. Tulis sapuan panjang dengan kait, dari atas menembus ke kiri bawah.",
    words: [
      ["九つ", "kokonotsu - sembilan buah"],
      ["九月", "kugatsu - bulan September"],
      ["九人", "kyuunin - sembilan orang"],
    ],
    level: "N5",
  },
  {
    char: "十",
    meaning: "Sepuluh",
    on: "juu",
    kun: "too",
    steps:
      "1. Tulis garis mendatar dari kiri ke kanan.  2. Tulis garis tegak dari atas ke bawah, memotong garis mendatar di tengah.",
    words: [
      ["十", "juu - sepuluh"],
      ["十月", "juugatsu - bulan Oktober"],
      ["十日", "tooka - tanggal sepuluh, sepuluh hari"],
    ],
    level: "N5",
  },
  {
    char: "百",
    meaning: "Seratus",
    on: "hyaku",
    kun: "",
    steps:
      "1. Tulis garis mendatar pendek di atas.  2. Tulis garis tegak turun di kiri.  3. Tulis garis mendatar membentuk kotak (bagian 白).  4. Tambahkan garis tengah di dalam kotak.  5. Tulis garis mendatar kedua di dalam.  6. Tutup dengan garis mendatar bawah.",
    words: [
      ["百", "hyaku - seratus"],
      ["三百", "sanbyaku - tiga ratus"],
      ["百円", "hyakuen - seratus yen"],
    ],
    level: "N5",
  },
  {
    char: "千",
    meaning: "Seribu",
    on: "sen",
    kun: "chi",
    steps:
      "1. Tulis sapuan pendek di kiri atas.  2. Tulis garis mendatar memotong di tengah.  3. Tarik garis tegak panjang dari atas ke bawah.",
    words: [
      ["千", "sen - seribu"],
      ["三千", "sanzen - tiga ribu"],
      ["千円", "sen'en - seribu yen"],
    ],
    level: "N5",
  },
  {
    char: "万",
    meaning: "Sepuluh ribu",
    on: "man, ban",
    kun: "yorozu",
    steps:
      "1. Tulis sapuan pendek di kiri atas.  2. Tulis garis mendatar melengkung ke kanan.  3. Tutup dengan sapuan panjang melengkung dari atas ke kiri bawah.",
    words: [
      ["一万", "ichiman - sepuluh ribu"],
      ["万年筆", "mannenhitsu - pulpen"],
      ["三万円", "sanmanen - tiga puluh ribu yen"],
    ],
    level: "N5",
  },
  {
    char: "円",
    meaning: "Yen, bulat",
    on: "en",
    kun: "maru(i)",
    steps:
      "1. Tulis garis tegak kiri.  2. Tulis garis atas menyambung turun ke kanan membentuk bingkai.  3. Tulis garis mendatar pendek di dalam.  4. Tutup dengan garis mendatar bawah yang sedikit naik di ujung kanan.",
    words: [
      ["百円", "hyakuen - seratus yen"],
      ["円い", "marui - bulat"],
      ["円", "en - mata uang yen"],
    ],
    level: "N5",
  },
  {
    char: "週",
    meaning: "Minggu (satuan waktu)",
    on: "shuu",
    kun: "",
    steps:
      "1. Tulis bagian dalam (周): kotak dengan garis-garis di dalamnya menyerupai perahu.  2. Tulis titik kecil di kiri atas untuk bagian pembungkus (辶).  3. Tutup dengan sapuan melengkung panjang dari atas ke kanan bawah, melingkupi bagian dalam.",
    words: [
      ["今週", "konshuu - minggu ini"],
      ["来週", "raishuu - minggu depan"],
      ["毎週", "maishuu - setiap minggu"],
    ],
    level: "N5",
  },
  {
    char: "午",
    meaning: "Tengah hari",
    on: "go",
    kun: "",
    steps:
      "1. Tulis garis mendatar pendek di atas.  2. Tulis sapuan tegak dengan sedikit condong ke kiri.  3. Tulis garis mendatar kedua memotong di tengah.  4. Tutup dengan garis tegak turun ke bawah.",
    words: [
      ["午前", "gozen - pagi (AM)"],
      ["午後", "gogo - sore (PM)"],
      ["正午", "shougo - tengah hari tepat"],
    ],
    level: "N5",
  },
  {
    char: "半",
    meaning: "Setengah",
    on: "han",
    kun: "naka(ba)",
    steps:
      "1. Tulis titik kecil di kiri atas.  2. Tulis titik kecil di kanan atas.  3. Tulis garis mendatar panjang di bawah kedua titik.  4. Tarik garis tegak dari atas menembus ke bawah di tengah.  5. Tutup dengan garis mendatar bawah.",
    words: [
      ["半分", "hanbun - setengah"],
      ["三時半", "sanjihan - jam tiga lewat setengah"],
      ["半年", "hantoshi - setengah tahun"],
    ],
    level: "N5",
  },
  {
    char: "毎",
    meaning: "Setiap",
    on: "mai",
    kun: "goto(ni)",
    steps:
      "1. Tulis sapuan kecil di kiri atas menyerupai bagian ibu (母) yang disederhanakan.  2. Tulis sapuan melengkung mengelilingi dari kanan.  3. Tambahkan dua titik di dalam.  4. Tutup dengan garis mendatar bawah menyerupai bagian akar rumput di atas.",
    words: [
      ["毎日", "mainichi - setiap hari"],
      ["毎週", "maishuu - setiap minggu"],
      ["毎年", "mainen - setiap tahun"],
    ],
    level: "N5",
  },
  {
    char: "父",
    meaning: "Ayah",
    on: "fu",
    kun: "chichi",
    steps:
      "1. Tulis sapuan pendek dari kiri atas.  2. Tulis sapuan pendek dari kanan atas menyilang sapuan pertama.  3. Tulis sapuan panjang ke kiri bawah.  4. Tutup dengan sapuan panjang ke kanan bawah.",
    words: [
      ["父", "chichi - ayah (sendiri)"],
      ["お父さん", "otousan - ayah (panggilan hormat)"],
      ["父母", "fubo - ayah dan ibu"],
    ],
    level: "N5",
  },
  {
    char: "友",
    meaning: "Teman",
    on: "yuu",
    kun: "tomo",
    steps:
      "1. Tulis sapuan pendek di kiri atas.  2. Tulis garis mendatar menekuk turun ke sapuan panjang kiri bawah.  3. Tulis sapuan dari kiri atas ke kanan bawah.  4. Tutup dengan sapuan panjang dari kanan atas ke kiri bawah di bawahnya.",
    words: [
      ["友達", "tomodachi - teman"],
      ["友人", "yuujin - sahabat, kenalan"],
      ["親友", "shinyuu - sahabat karib"],
    ],
    level: "N5",
  },
  {
    char: "火",
    meaning: "Api",
    on: "ka",
    kun: "hi",
    steps:
      "1. Tulis titik kecil di kiri atas.  2. Tulis sapuan melengkung pendek di kanan atas.  3. Tulis sapuan panjang ke kiri bawah.  4. Tutup dengan sapuan panjang ke kanan bawah.",
    words: [
      ["火", "hi - api"],
      ["火曜日", "kayoubi - hari Selasa"],
      ["花火", "hanabi - kembang api"],
    ],
    level: "N5",
  },
  {
    char: "土",
    meaning: "Tanah",
    on: "do, to",
    kun: "tsuchi",
    steps:
      "1. Tulis garis mendatar pendek di atas.  2. Tarik garis tegak dari atas menembus ke bawah di tengah.  3. Tutup dengan garis mendatar panjang di bawah.",
    words: [
      ["土曜日", "doyoubi - hari Sabtu"],
      ["土", "tsuchi - tanah"],
      ["土地", "tochi - lahan, tanah"],
    ],
    level: "N5",
  },
  {
    char: "花",
    meaning: "Bunga",
    on: "ka",
    kun: "hana",
    steps:
      "1. Tulis dua garis pendek radikal rumput (艹) di atas.  2. Tulis sapuan orang (イ) di kiri bawah.  3. Tutup dengan sapuan melengkung membentuk bagian kanan (匕) di bawahnya.",
    words: [
      ["花", "hana - bunga"],
      ["花見", "hanami - melihat bunga sakura"],
      ["花火", "hanabi - kembang api"],
    ],
    level: "N5",
  },
  {
    char: "魚",
    meaning: "Ikan",
    on: "gyo",
    kun: "sakana, uo",
    steps:
      "1. Tulis bagian atas menyerupai kepala ikan dengan sapuan kecil dan garis mendatar.  2. Tulis kotak persegi di tengah sebagai badan.  3. Tambahkan garis mendatar di dalam kotak.  4. Tutup dengan empat titik di bagian bawah menyerupai sirip dan ekor.",
    words: [
      ["魚", "sakana - ikan"],
      ["魚屋", "sakanaya - toko ikan"],
      ["金魚", "kingyo - ikan mas koki"],
    ],
    level: "N5",
  },
  {
    char: "天",
    meaning: "Langit",
    on: "ten",
    kun: "ama, ame",
    steps:
      "1. Tulis garis mendatar pendek di atas.  2. Tulis garis mendatar kedua sedikit lebih panjang di bawahnya.  3. Tulis sapuan panjang ke kiri bawah.  4. Tutup dengan sapuan panjang ke kanan bawah.",
    words: [
      ["天気", "tenki - cuaca"],
      ["天ぷら", "tenpura - tempura"],
      ["天国", "tengoku - surga"],
    ],
    level: "N5",
  },
  {
    char: "空",
    meaning: "Langit, kosong",
    on: "kuu",
    kun: "sora, a(ku), a(keru)",
    steps:
      "1. Tulis atap kecil (穴) di atas.  2. Tulis sapuan kiri dan kanan di bawah atap.  3. Tulis garis mendatar atas bagian 工.  4. Tarik garis tegak di tengah.  5. Tutup dengan garis mendatar bawah.",
    words: [
      ["空", "sora - langit"],
      ["空港", "kuukou - bandara"],
      ["空く", "aku - menjadi kosong"],
    ],
    level: "N5",
  },
  {
    char: "雨",
    meaning: "Hujan",
    on: "u",
    kun: "ame, ama",
    steps:
      "1. Tulis garis mendatar atas sebagai atap.  2. Tulis garis tegak kiri dan kanan turun membentuk bingkai.  3. Tambahkan garis mendatar tengah.  4. Tutup dengan empat titik hujan di dalam bingkai.",
    words: [
      ["雨", "ame - hujan"],
      ["大雨", "ooame - hujan lebat"],
      ["梅雨", "tsuyu - musim hujan"],
    ],
    level: "N5",
  },
  {
    char: "語",
    meaning: "Bahasa, kata",
    on: "go",
    kun: "kata(ru), kata(rau)",
    steps:
      "1. Tulis radikal kata (言) di kiri: garis-garis mendatar bersusun dan mulut kecil di bawah.  2. Tulis bagian atas kanan menyerupai angka lima (五).  3. Tutup dengan bagian mulut (口) di bawahnya.",
    words: [
      ["日本語", "nihongo - bahasa Jepang"],
      ["英語", "eigo - bahasa Inggris"],
      ["単語", "tango - kosakata"],
    ],
    level: "N5",
  },
  {
    char: "耳",
    meaning: "Telinga",
    on: "ji",
    kun: "mimi",
    steps:
      "1. Tulis garis tegak kiri turun.  2. Tulis garis mendatar atas menekuk ke kanan turun.  3. Tambahkan dua garis mendatar pendek di tengah.  4. Tutup dengan garis mendatar bawah yang memanjang ke kiri.",
    words: [
      ["耳", "mimi - telinga"],
      ["耳鼻科", "jibika - dokter THT"],
      ["早耳", "hayamimi - cepat dengar berita"],
    ],
    level: "N5",
  },
  {
    char: "手",
    meaning: "Tangan",
    on: "shu, zu",
    kun: "te",
    steps:
      "1. Tulis sapuan pendek di kiri atas.  2. Tulis garis mendatar kedua.  3. Tulis garis mendatar ketiga.  4. Tutup dengan garis tegak dan kait di tengah menembus ke bawah.",
    words: [
      ["手", "te - tangan"],
      ["上手", "jouzu - pandai"],
      ["歌手", "kashu - penyanyi"],
    ],
    level: "N5",
  },
  {
    char: "足",
    meaning: "Kaki, cukup",
    on: "soku",
    kun: "ashi, ta(riru), ta(su)",
    steps:
      "1. Tulis kotak kecil (口) di atas sebagai lutut.  2. Tulis garis mendatar di bawahnya.  3. Tulis sapuan kiri panjang ke bawah.  4. Tutup dengan sapuan kanan yang menekuk membentuk kaki.",
    words: [
      ["足", "ashi - kaki"],
      ["足りる", "tariru - cukup"],
      ["満足", "manzoku - puas"],
    ],
    level: "N5",
  },
  {
    char: "目",
    meaning: "Mata",
    on: "moku, boku",
    kun: "me",
    steps:
      "1. Tulis garis tegak kiri turun.  2. Tulis garis atas menekuk turun ke kanan membentuk bingkai.  3. Tulis dua garis mendatar pendek di dalam.  4. Tutup dengan garis mendatar bawah.",
    words: [
      ["目", "me - mata"],
      ["目的", "mokuteki - tujuan"],
      ["二番目", "nibanme - yang kedua"],
    ],
    level: "N5",
  },
  {
    char: "口",
    meaning: "Mulut",
    on: "kou, ku",
    kun: "kuchi",
    steps:
      "1. Tulis garis tegak kiri turun.  2. Tulis garis atas menekuk turun ke kanan membentuk sudut.  3. Tutup dengan garis mendatar bawah.",
    words: [
      ["口", "kuchi - mulut"],
      ["入口", "iriguchi - pintu masuk"],
      ["人口", "jinkou - populasi"],
    ],
    level: "N5",
  },
  {
    char: "店",
    meaning: "Toko",
    on: "ten",
    kun: "mise",
    steps:
      "1. Tulis atap miring (广) di atas kiri.  2. Tulis garis tegak turun di bawah atap.  3. Tulis bagian 占 di dalam: sapuan kecil dan kotak mulut (口).",
    words: [
      ["店", "mise - toko"],
      ["店員", "ten'in - pegawai toko"],
      ["喫茶店", "kissaten - kedai kopi"],
    ],
    level: "N5",
  },
  {
    char: "駅",
    meaning: "Stasiun",
    on: "eki",
    kun: "",
    steps:
      "1. Tulis bagian kuda (馬) yang disederhanakan di kiri: kotak dan garis-garis kaki.  2. Tulis bagian 尺 di kanan: sapuan atas dan sapuan melengkung dengan kait di bawah.",
    words: [
      ["駅", "eki - stasiun"],
      ["駅員", "ekiin - petugas stasiun"],
      ["駅前", "ekimae - depan stasiun"],
    ],
    level: "N5",
  },
  {
    char: "道",
    meaning: "Jalan",
    on: "dou, tou",
    kun: "michi",
    steps:
      "1. Tulis bagian kepala (首) di atas: garis-garis dan mata kecil.  2. Tulis titik kecil di kiri bawah untuk bagian pembungkus (辶).  3. Tutup dengan sapuan melengkung panjang dari atas ke kanan bawah mengelilingi bagian atas.",
    words: [
      ["道", "michi - jalan"],
      ["道路", "douro - jalan raya"],
      ["北海道", "hokkaidou - Hokkaido"],
    ],
    level: "N5",
  },
  {
    char: "社",
    meaning: "Perusahaan, kuil",
    on: "sha",
    kun: "yashiro",
    steps:
      "1. Tulis radikal dewa (礻) di kiri: titik dan garis tegak dengan sapuan kecil.  2. Tulis bagian tanah (土) di kanan: garis mendatar, tegak, dan garis mendatar bawah.",
    words: [
      ["会社", "kaisha - perusahaan"],
      ["神社", "jinja - kuil Shinto"],
      ["社長", "shachou - direktur utama"],
    ],
    level: "N5",
  },
  {
    char: "北",
    meaning: "Utara",
    on: "hoku",
    kun: "kita",
    steps:
      "1. Tulis garis tegak kiri dengan sapuan kecil di atas.  2. Tulis sapuan melengkung ke kiri bawah.  3. Tulis garis tegak kanan dengan kait.  4. Tutup dengan sapuan melengkung ke kanan bawah.",
    words: [
      ["北", "kita - utara"],
      ["北海道", "hokkaidou - Hokkaido"],
      ["東北", "touhoku - timur laut"],
    ],
    level: "N5",
  },
  {
    char: "西",
    meaning: "Barat",
    on: "sei, sai",
    kun: "nishi",
    steps:
      "1. Tulis garis tegak kiri turun.  2. Tulis garis atas menekuk membentuk bingkai kotak.  3. Tambahkan garis tegak tengah dan garis mendatar di dalam.  4. Tutup dengan garis mendatar bawah.",
    words: [
      ["西", "nishi - barat"],
      ["西口", "nishiguchi - pintu barat"],
      ["関西", "kansai - wilayah Kansai"],
    ],
    level: "N5",
  },
  {
    char: "東",
    meaning: "Timur",
    on: "tou",
    kun: "higashi",
    steps:
      "1. Tulis garis mendatar atas.  2. Tulis garis tegak tengah menembus dari atas ke bawah.  3. Tulis kotak kecil di tengah menyilang garis tegak.  4. Tutup dengan sapuan kiri dan sapuan kanan di bagian bawah.",
    words: [
      ["東", "higashi - timur"],
      ["東京", "toukyou - Tokyo"],
      ["東口", "higashiguchi - pintu timur"],
    ],
    level: "N5",
  },
  {
    char: "南",
    meaning: "Selatan",
    on: "nan",
    kun: "minami",
    steps:
      "1. Tulis atap kecil di atas.  2. Tulis bingkai kotak di bawahnya.  3. Tambahkan garis tegak tengah dan garis mendatar di dalam bingkai.  4. Tutup dengan bagian bawah menyerupai sapuan ganda.",
    words: [
      ["南", "minami - selatan"],
      ["南口", "minamiguchi - pintu selatan"],
      ["東南アジア", "tounan ajia - Asia Tenggara"],
    ],
    level: "N5",
  },
  {
    char: "右",
    meaning: "Kanan",
    on: "u, yuu",
    kun: "migi",
    steps:
      "1. Tulis sapuan pendek dari kanan atas ke kiri bawah.  2. Tulis garis mendatar panjang di bawahnya.  3. Tutup dengan bagian mulut (口) di bawah garis mendatar.",
    words: [
      ["右", "migi - kanan"],
      ["右手", "migite - tangan kanan"],
      ["右側", "migigawa - sisi kanan"],
    ],
    level: "N5",
  },
  {
    char: "左",
    meaning: "Kiri",
    on: "sa",
    kun: "hidari",
    steps:
      "1. Tulis garis mendatar pendek di atas.  2. Tulis sapuan panjang dari kanan atas ke kiri bawah, memotong garis mendatar.  3. Tutup dengan bagian tenaga (工) di bawahnya.",
    words: [
      ["左", "hidari - kiri"],
      ["左手", "hidarite - tangan kiri"],
      ["左側", "hidarigawa - sisi kiri"],
    ],
    level: "N5",
  },
  {
    char: "読",
    meaning: "Membaca",
    on: "doku, tou",
    kun: "yo(mu)",
    steps:
      "1. Tulis radikal kata (言) di kiri: garis-garis bersusun dan mulut kecil di bawah.  2. Tulis bagian atas kanan menyerupai jual (売): silang kecil dan garis mendatar.  3. Tutup dengan bagian bawah melengkung dengan kait.",
    words: [
      ["読む", "yomu - membaca"],
      ["読書", "dokusho - membaca buku"],
      ["音読", "ondoku - membaca nyaring"],
    ],
    level: "N5",
  },
  {
    char: "買",
    meaning: "Membeli",
    on: "bai",
    kun: "ka(u)",
    steps:
      "1. Tulis bingkai jaring (罒) di atas: kotak lebar dengan dua garis tegak di dalam.  2. Tulis bagian uang kerang (貝) di bawah: kotak dengan garis tengah.  3. Tutup dengan sapuan kiri dan sapuan kanan kecil di bagian paling bawah.",
    words: [
      ["買う", "kau - membeli"],
      ["買い物", "kaimono - belanja"],
      ["売買", "baibai - jual beli"],
    ],
    level: "N5",
  },
  {
    char: "休",
    meaning: "Istirahat, libur",
    on: "kyuu",
    kun: "yasu(mu)",
    steps:
      "1. Tulis sapuan orang (亻) di kiri: sapuan pendek dan garis tegak dengan kait.  2. Tulis bagian pohon (木) di kanan: garis mendatar, tegak, lalu sapuan kiri dan kanan.",
    words: [
      ["休む", "yasumu - beristirahat"],
      ["休み", "yasumi - libur"],
      ["夏休み", "natsuyasumi - liburan musim panas"],
    ],
    level: "N5",
  },
  {
    char: "飲",
    meaning: "Minum",
    on: "in",
    kun: "no(mu)",
    steps:
      "1. Tulis bagian makan (食) di kiri: atap kecil, sapuan kiri-kanan, dan bagian bawah bersusun.  2. Tulis bagian di kanan (欠): sapuan atas dan sapuan panjang melengkung dengan kait di bawah.",
    words: [
      ["飲む", "nomu - minum"],
      ["飲み物", "nomimono - minuman"],
      ["飲食", "inshoku - makan minum"],
    ],
    level: "N5",
  },
  {
    char: "言",
    meaning: "Berkata, kata",
    on: "gen, gon",
    kun: "i(u)",
    steps:
      "1. Tulis sapuan pendek di atas.  2. Tulis dua garis mendatar sejajar di bawahnya.  3. Tulis garis mendatar ketiga sedikit lebih panjang.  4. Tutup dengan bagian mulut (口) di bagian paling bawah.",
    words: [
      ["言う", "iu - berkata"],
      ["言葉", "kotoba - kata, bahasa"],
      ["方言", "hougen - dialek"],
    ],
    level: "N5",
  },
  {
    char: "立",
    meaning: "Berdiri",
    on: "ritsu",
    kun: "ta(tsu)",
    steps:
      "1. Tulis titik kecil di atas tengah.  2. Tulis sapuan kiri dan sapuan kanan di bawahnya membentuk atap.  3. Tulis garis mendatar tengah.  4. Tutup dengan garis mendatar bawah yang lebih panjang.",
    words: [
      ["立つ", "tatsu - berdiri"],
      ["立派", "rippa - megah, hebat"],
      ["国立", "kokuritsu - negeri (institusi)"],
    ],
    level: "N5",
  },
  {
    char: "会",
    meaning: "Bertemu, perkumpulan",
    on: "kai, e",
    kun: "a(u)",
    steps:
      "1. Tulis sapuan kiri dan sapuan kanan di atas membentuk atap orang.  2. Tulis garis mendatar pendek di tengah.  3. Tutup dengan bagian bawah menyerupai awan: sapuan dan garis mendatar.",
    words: [
      ["会う", "au - bertemu"],
      ["会社", "kaisha - perusahaan"],
      ["会話", "kaiwa - percakapan"],
    ],
    level: "N5",
  },
  {
    char: "多",
    meaning: "Banyak",
    on: "ta",
    kun: "oo(i)",
    steps:
      "1. Tulis titik kecil lalu sapuan melengkung membentuk bagian malam pertama (夕) di atas.  2. Ulangi pola yang sama tepat di bawahnya untuk bagian kedua.",
    words: [
      ["多い", "ooi - banyak"],
      ["多分", "tabun - mungkin"],
      ["多数", "tasuu - banyak jumlah"],
    ],
    level: "N5",
  },
  {
    char: "少",
    meaning: "Sedikit",
    on: "shou",
    kun: "suku(nai), suko(shi)",
    steps:
      "1. Tulis garis tegak pendek di tengah dengan kait kecil.  2. Tambahkan titik kecil di kiri.  3. Tutup dengan sapuan pendek ke kanan bawah.",
    words: [
      ["少ない", "sukunai - sedikit"],
      ["少し", "sukoshi - sedikit"],
      ["少年", "shounen - anak laki-laki"],
    ],
    level: "N5",
  },
  {
    char: "古",
    meaning: "Lama, tua (benda)",
    on: "ko",
    kun: "furu(i)",
    steps:
      "1. Tulis sapuan pendek di kiri atas.  2. Tulis garis tegak turun di tengah.  3. Tutup dengan bagian mulut (口) di bawahnya.",
    words: [
      ["古い", "furui - lama, tua"],
      ["中古", "chuuko - bekas"],
      ["古本", "furuhon - buku bekas"],
    ],
    level: "N5",
  },
  {
    char: "新",
    meaning: "Baru",
    on: "shin",
    kun: "atara(shii)",
    steps:
      "1. Tulis bagian berdiri (立) di kiri atas.  2. Tulis bagian pohon (木) di kiri bawah.  3. Tutup dengan bagian kapak (斤) di kanan: sapuan dan garis tegak dengan kait.",
    words: [
      ["新しい", "atarashii - baru"],
      ["新聞", "shinbun - koran"],
      ["新年", "shinnen - tahun baru"],
    ],
    level: "N5",
  },
  {
    char: "安",
    meaning: "Murah, aman",
    on: "an",
    kun: "yasu(i)",
    steps:
      "1. Tulis atap (宀) di atas: titik dan garis melengkung turun ke kiri dan kanan.  2. Tutup dengan bagian wanita (女) di bawah atap.",
    words: [
      ["安い", "yasui - murah"],
      ["安全", "anzen - aman"],
      ["安心", "anshin - tenang, lega"],
    ],
    level: "N5",
  },
  {
    char: "白",
    meaning: "Putih",
    on: "haku, byaku",
    kun: "shiro(i)",
    steps:
      "1. Tulis sapuan pendek di kiri atas.  2. Tulis garis tegak kiri turun.  3. Tulis garis atas menekuk turun ke kanan membentuk bingkai.  4. Tulis garis mendatar tengah di dalam.  5. Tutup dengan garis mendatar bawah.",
    words: [
      ["白い", "shiroi - putih"],
      ["白", "shiro - warna putih"],
      ["白鳥", "hakuchou - angsa"],
    ],
    level: "N5",
  },
  {
    char: "不",
    meaning: "Bukan, tidak",
    on: "fu",
    kun: "",
    steps:
      "1. Tulis garis mendatar di atas.  2. Tarik garis tegak turun di tengah.  3. Tulis sapuan kiri bawah.  4. Tutup dengan titik kecil di kanan bawah.",
    words: [
      ["不便", "fuben - tidak praktis"],
      ["不安", "fuan - cemas"],
      ["不足", "fusoku - kurang"],
    ],
    level: "N4",
  },
  {
    char: "世",
    meaning: "Zaman, dunia",
    on: "sei",
    kun: "yo",
    steps:
      "1. Tulis tiga garis tegak pendek sejajar di atas.  2. Sambungkan dengan garis mendatar di tengah.  3. Tutup dengan garis mendatar panjang di bawah.",
    words: [
      ["世界", "sekai - dunia"],
      ["世紀", "seiki - abad"],
      ["世の中", "yononaka - dunia, masyarakat"],
    ],
    level: "N4",
  },
  {
    char: "主",
    meaning: "Utama, tuan",
    on: "shu",
    kun: "nushi, omo",
    steps:
      "1. Tulis titik kecil di atas.  2. Tarik garis tegak panjang dari atas ke bawah menembus tengah.  3. Tambahkan dua garis mendatar sejajar.  4. Tutup dengan garis mendatar bawah yang lebih panjang.",
    words: [
      ["主人", "shujin - suami, majikan"],
      ["主に", "omoni - terutama"],
      ["持ち主", "mochinushi - pemilik"],
    ],
    level: "N4",
  },
  {
    char: "事",
    meaning: "Hal, urusan",
    on: "ji",
    kun: "koto",
    steps:
      "1. Tulis garis tegak kiri dengan sapuan kecil di atas.  2. Tambahkan beberapa garis mendatar sejajar.  3. Tarik garis tegak panjang menembus ke bawah dengan kait di ujung.",
    words: [
      ["仕事", "shigoto - pekerjaan"],
      ["事故", "jiko - kecelakaan"],
      ["大事", "daiji - penting"],
    ],
    level: "N4",
  },
  {
    char: "京",
    meaning: "Ibu kota",
    on: "kyou",
    kun: "miyako",
    steps:
      "1. Tulis atap kecil (亠) di atas.  2. Tulis kotak kecil (口) di tengah.  3. Tutup dengan bagian kaki melebar di bawah.",
    words: [
      ["東京", "toukyou - Tokyo"],
      ["京都", "kyouto - Kyoto"],
      ["上京", "joukyou - pergi ke Tokyo"],
    ],
    level: "N4",
  },
  {
    char: "仕",
    meaning: "Melayani, bekerja",
    on: "shi",
    kun: "tsuka(eru)",
    steps:
      "1. Tulis sapuan orang (亻) di kiri.  2. Tulis bagian prajurit (士) di kanan: garis mendatar, tegak, garis mendatar lagi.",
    words: [
      ["仕事", "shigoto - pekerjaan"],
      ["仕える", "tsukaeru - mengabdi"],
      ["仕方", "shikata - cara"],
    ],
    level: "N4",
  },
  {
    char: "代",
    meaning: "Ganti, zaman, generasi",
    on: "dai",
    kun: "ka(waru), yo",
    steps:
      "1. Tulis sapuan orang (亻) di kiri.  2. Tulis bagian 弋 di kanan: sapuan miring dan garis menyilang.",
    words: [
      ["時代", "jidai - zaman"],
      ["代わる", "kawaru - menggantikan"],
      ["代金", "daikin - biaya"],
    ],
    level: "N4",
  },
  {
    char: "以",
    meaning: "Dengan, sejak",
    on: "i",
    kun: "",
    steps:
      "1. Tulis titik dan sapuan kecil di kiri atas.  2. Tulis garis tegak dengan kait.  3. Tutup dengan dua sapuan di kanan bawah.",
    words: [
      ["以上", "ijou - lebih dari"],
      ["以下", "ika - kurang dari"],
      ["以外", "igai - selain"],
    ],
    level: "N4",
  },
  {
    char: "住",
    meaning: "Tinggal, berdiam",
    on: "juu",
    kun: "su(mu)",
    steps:
      "1. Tulis sapuan orang (亻) di kiri.  2. Tulis bagian 主 di kanan: titik, garis tegak, dua garis mendatar, dan garis mendatar bawah.",
    words: [
      ["住む", "sumu - tinggal"],
      ["住所", "juusho - alamat"],
      ["住民", "juumin - penduduk"],
    ],
    level: "N4",
  },
  {
    char: "体",
    meaning: "Tubuh, badan",
    on: "tai",
    kun: "karada",
    steps:
      "1. Tulis sapuan orang (亻) di kiri.  2. Tulis bagian pohon/asal (本) di kanan.",
    words: [
      ["体", "karada - tubuh"],
      ["体育", "taiiku - olahraga"],
      ["体重", "taijuu - berat badan"],
    ],
    level: "N4",
  },
  {
    char: "作",
    meaning: "Membuat, karya",
    on: "saku",
    kun: "tsuku(ru)",
    steps:
      "1. Tulis sapuan orang (亻) di kiri.  2. Tulis bagian 乍 di kanan: beberapa sapuan pendek dan garis tegak.",
    words: [
      ["作る", "tsukuru - membuat"],
      ["作文", "sakubun - karangan"],
      ["動作", "dousa - gerakan"],
    ],
    level: "N4",
  },
  {
    char: "使",
    meaning: "Menggunakan, utusan",
    on: "shi",
    kun: "tsuka(u)",
    steps:
      "1. Tulis sapuan orang (亻) di kiri.  2. Tulis bagian 吏 di kanan: kotak mulut kecil di atas dan garis-garis di bawahnya.",
    words: [
      ["使う", "tsukau - menggunakan"],
      ["使い方", "tsukaikata - cara pakai"],
      ["大使", "taishi - duta besar"],
    ],
    level: "N4",
  },
  {
    char: "借",
    meaning: "Meminjam",
    on: "shaku",
    kun: "ka(riru)",
    steps:
      "1. Tulis sapuan orang (亻) di kiri.  2. Tulis bagian 昔 di kanan: kotak matahari di bawah garis-garis atas.",
    words: [
      ["借りる", "kariru - meminjam"],
      ["借金", "shakkin - hutang"],
      ["借家", "shakuya - rumah sewa"],
    ],
    level: "N4",
  },
  {
    char: "元",
    meaning: "Asal, semula",
    on: "gen",
    kun: "moto",
    steps:
      "1. Tulis dua garis mendatar sejajar di atas.  2. Tutup dengan sapuan melengkung dari atas ke kanan bawah.",
    words: [
      ["元気", "genki - sehat"],
      ["元", "moto - asal"],
      ["地元", "jimoto - daerah asal"],
    ],
    level: "N4",
  },
  {
    char: "兄",
    meaning: "Kakak laki-laki",
    on: "kyou",
    kun: "ani",
    steps:
      "1. Tulis kotak mulut (口) di atas.  2. Tutup dengan sapuan kaki kiri dan sapuan kaki kanan di bawah.",
    words: [
      ["兄", "ani - kakak laki-laki (sendiri)"],
      ["お兄さん", "oniisan - kakak laki-laki (panggilan)"],
      ["兄弟", "kyoudai - saudara kandung"],
    ],
    level: "N4",
  },
  {
    char: "公",
    meaning: "Umum, publik",
    on: "kou",
    kun: "ooyake",
    steps:
      "1. Tulis sapuan kiri dan sapuan kanan di atas membentuk atap.  2. Tutup dengan bagian bawah menyerupai bentuk 厶.",
    words: [
      ["公園", "kouen - taman"],
      ["公務員", "koumuin - pegawai negeri"],
      ["公開", "koukai - membuka untuk umum"],
    ],
    level: "N4",
  },
  {
    char: "写",
    meaning: "Menyalin, memotret",
    on: "sha",
    kun: "utsu(su)",
    steps:
      "1. Tulis atap kecil di atas.  2. Tutup dengan sapuan melengkung panjang dan kait di bagian bawah.",
    words: [
      ["写真", "shashin - foto"],
      ["写す", "utsusu - menyalin, memotret"],
      ["写生", "shasei - sketsa dari alam"],
    ],
    level: "N4",
  },
  {
    char: "冬",
    meaning: "Musim dingin",
    on: "tou",
    kun: "fuyu",
    steps:
      "1. Tulis sapuan kiri dan sapuan kanan di atas.  2. Tutup dengan dua titik es (冫) di bagian bawah.",
    words: [
      ["冬", "fuyu - musim dingin"],
      ["冬休み", "fuyuyasumi - liburan musim dingin"],
      ["真冬", "mafuyu - puncak musim dingin"],
    ],
    level: "N4",
  },
  {
    char: "切",
    meaning: "Memotong",
    on: "setsu",
    kun: "ki(ru)",
    steps:
      "1. Tulis bagian 七 di kiri: garis mendatar dan garis tegak dengan kait.  2. Tulis bagian pisau (刀) di kanan.",
    words: [
      ["切る", "kiru - memotong"],
      ["大切", "taisetsu - penting"],
      ["切符", "kippu - tiket"],
    ],
    level: "N4",
  },
  {
    char: "別",
    meaning: "Pisah, lain",
    on: "betsu",
    kun: "waka(reru)",
    steps:
      "1. Tulis bagian kiri berbentuk kotak dan garis tegak.  2. Tutup dengan bagian pisau (刂) di kanan.",
    words: [
      ["別れる", "wakareru - berpisah"],
      ["特別", "tokubetsu - khusus"],
      ["別に", "betsuni - tidak juga"],
    ],
    level: "N4",
  },
  {
    char: "力",
    meaning: "Kekuatan, tenaga",
    on: "ryoku",
    kun: "chikara",
    steps:
      "1. Tulis sapuan melengkung dari atas ke kiri bawah dengan kait.  2. Tambahkan sapuan pendek dari tengah ke kanan bawah.",
    words: [
      ["力", "chikara - kekuatan"],
      ["努力", "doryoku - usaha"],
      ["電力", "denryoku - daya listrik"],
    ],
    level: "N4",
  },
  {
    char: "勉",
    meaning: "Rajin, berusaha",
    on: "ben",
    kun: "",
    steps:
      "1. Tulis bagian atas menyerupai lepas (免).  2. Tutup dengan bagian tenaga (力) di kanan bawah.",
    words: [
      ["勉強", "benkyou - belajar"],
      ["勤勉", "kinben - rajin"],
      ["勉強家", "benkyouka - kutu buku"],
    ],
    level: "N4",
  },
  {
    char: "動",
    meaning: "Bergerak",
    on: "dou",
    kun: "ugo(ku)",
    steps:
      "1. Tulis bagian berat (重) di kiri.  2. Tutup dengan bagian tenaga (力) di kanan.",
    words: [
      ["動く", "ugoku - bergerak"],
      ["運動", "undou - olahraga"],
      ["動物", "doubutsu - hewan"],
    ],
    level: "N4",
  },
  {
    char: "医",
    meaning: "Dokter, pengobatan",
    on: "i",
    kun: "",
    steps:
      "1. Tulis bingkai kotak besar mengelilingi.  2. Tulis bagian panah (矢) di dalam.",
    words: [
      ["医者", "isha - dokter"],
      ["医学", "igaku - ilmu kedokteran"],
      ["医院", "iin - klinik"],
    ],
    level: "N4",
  },
  {
    char: "去",
    meaning: "Pergi, lampau",
    on: "kyo",
    kun: "sa(ru)",
    steps:
      "1. Tulis bagian tanah (土) di atas.  2. Tutup dengan bagian 厶 melengkung di bawah.",
    words: [
      ["去年", "kyonen - tahun lalu"],
      ["過去", "kako - masa lalu"],
      ["去る", "saru - pergi meninggalkan"],
    ],
    level: "N4",
  },
  {
    char: "台",
    meaning: "Alas, penghitung mesin",
    on: "dai",
    kun: "",
    steps:
      "1. Tulis atap kecil di atas.  2. Tutup dengan kotak mulut (口) di bawahnya.",
    words: [
      ["台所", "daidokoro - dapur"],
      ["一台", "ichidai - satu unit (mesin)"],
      ["台風", "taifuu - topan"],
    ],
    level: "N4",
  },
  {
    char: "同",
    meaning: "Sama",
    on: "dou",
    kun: "ona(ji)",
    steps:
      "1. Tulis bingkai kotak besar.  2. Tambahkan garis mendatar di dalam.  3. Tutup dengan kotak mulut kecil di bagian bawah dalam.",
    words: [
      ["同じ", "onaji - sama"],
      ["同時", "douji - bersamaan"],
      ["同僚", "douryou - rekan kerja"],
    ],
    level: "N4",
  },
  {
    char: "味",
    meaning: "Rasa",
    on: "mi",
    kun: "aji",
    steps:
      "1. Tulis kotak mulut (口) di kiri.  2. Tulis bagian belum (未) di kanan: dua garis mendatar dan sapuan silang.",
    words: [
      ["味", "aji - rasa"],
      ["味方", "mikata - sekutu"],
      ["意味", "imi - arti"],
    ],
    level: "N4",
  },
  {
    char: "品",
    meaning: "Barang, kualitas",
    on: "hin",
    kun: "shina",
    steps:
      "1. Tulis kotak mulut di kiri atas.  2. Tulis kotak mulut lagi di kanan atas.  3. Tutup dengan kotak mulut ketiga di tengah bawah.",
    words: [
      ["品物", "shinamono - barang"],
      ["作品", "sakuhin - karya"],
      ["品質", "hinshitsu - kualitas"],
    ],
    level: "N4",
  },
  {
    char: "員",
    meaning: "Anggota, pegawai",
    on: "in",
    kun: "",
    steps:
      "1. Tulis kotak mulut (口) di atas.  2. Tutup dengan bagian uang kerang (貝) di bawah.",
    words: [
      ["会員", "kaiin - anggota"],
      ["店員", "ten'in - pegawai toko"],
      ["社員", "shain - karyawan"],
    ],
    level: "N4",
  },
  {
    char: "問",
    meaning: "Bertanya, soal",
    on: "mon",
    kun: "to(u)",
    steps:
      "1. Tulis bingkai pintu (門) mengelilingi.  2. Isi dengan kotak mulut (口) di dalam bingkai.",
    words: [
      ["質問", "shitsumon - pertanyaan"],
      ["問題", "mondai - masalah"],
      ["問う", "tou - bertanya"],
    ],
    level: "N4",
  },
  {
    char: "図",
    meaning: "Gambar, rencana",
    on: "zu",
    kun: "haka(ru)",
    steps:
      "1. Tulis bingkai kotak besar.  2. Tulis bagian dalam menyerupai kepala kecil dengan garis-garis.",
    words: [
      ["図書館", "toshokan - perpustakaan"],
      ["地図", "chizu - peta"],
      ["図る", "hakaru - merencanakan"],
    ],
    level: "N4",
  },
  {
    char: "地",
    meaning: "Tanah, wilayah",
    on: "chi",
    kun: "",
    steps:
      "1. Tulis bagian tanah (土) di kiri.  2. Tulis bagian 也 di kanan: sapuan melengkung dengan kait.",
    words: [
      ["地図", "chizu - peta"],
      ["地下", "chika - bawah tanah"],
      ["地震", "jishin - gempa bumi"],
    ],
    level: "N4",
  },
  {
    char: "堂",
    meaning: "Aula, gedung",
    on: "dou",
    kun: "",
    steps:
      "1. Tulis bagian atas menyerupai aula (尚).  2. Tutup dengan bagian tanah (土) di bawah.",
    words: [
      ["食堂", "shokudou - kantin"],
      ["講堂", "koudou - aula"],
      ["本堂", "hondou - aula utama kuil"],
    ],
    level: "N4",
  },
  {
    char: "場",
    meaning: "Tempat",
    on: "jou",
    kun: "ba",
    steps:
      "1. Tulis bagian tanah (土) di kiri.  2. Tulis bagian matahari dan sinar (昜) di kanan.",
    words: [
      ["場所", "basho - tempat"],
      ["工場", "koujou - pabrik"],
      ["会場", "kaijou - lokasi acara"],
    ],
    level: "N4",
  },
  {
    char: "売",
    meaning: "Menjual",
    on: "bai",
    kun: "u(ru)",
    steps:
      "1. Tulis sapuan silang kecil di atas.  2. Tutup dengan bagian melengkung di bawah.",
    words: [
      ["売る", "uru - menjual"],
      ["販売", "hanbai - penjualan"],
      ["売店", "baiten - kios"],
    ],
    level: "N4",
  },
  {
    char: "夏",
    meaning: "Musim panas",
    on: "ka",
    kun: "natsu",
    steps:
      "1. Tulis garis mendatar dan sapuan kecil di atas.  2. Tulis kotak mata di tengah.  3. Tutup dengan sapuan kaki kiri dan kanan di bawah.",
    words: [
      ["夏", "natsu - musim panas"],
      ["夏休み", "natsuyasumi - liburan musim panas"],
      ["真夏", "manatsu - puncak musim panas"],
    ],
    level: "N4",
  },
  {
    char: "夕",
    meaning: "Petang, senja",
    on: "seki",
    kun: "yuu",
    steps:
      "1. Tulis sapuan melengkung dari kanan atas ke kiri bawah.  2. Tulis sapuan kedua di dalamnya.  3. Tutup dengan titik kecil di kanan bawah.",
    words: [
      ["夕方", "yuugata - sore hari"],
      ["夕食", "yuushoku - makan malam"],
      ["七夕", "tanabata - festival Tanabata"],
    ],
    level: "N4",
  },
  {
    char: "夜",
    meaning: "Malam",
    on: "ya",
    kun: "yoru",
    steps:
      "1. Tulis atap kecil di atas.  2. Tulis sapuan orang di tengah.  3. Tutup dengan sapuan malam (夕) di kanan bawah.",
    words: [
      ["夜", "yoru - malam"],
      ["夜中", "yonaka - tengah malam"],
      ["今夜", "kon'ya - malam ini"],
    ],
    level: "N4",
  },
  {
    char: "妹",
    meaning: "Adik perempuan",
    on: "mai",
    kun: "imouto",
    steps:
      "1. Tulis bagian wanita (女) di kiri.  2. Tulis bagian belum (未) di kanan.",
    words: [
      ["妹", "imouto - adik perempuan"],
      ["妹さん", "imoutosan - adik perempuan (orang lain)"],
      ["姉妹", "shimai - kakak-adik perempuan"],
    ],
    level: "N4",
  },
  {
    char: "姉",
    meaning: "Kakak perempuan",
    on: "shi",
    kun: "ane",
    steps:
      "1. Tulis bagian wanita (女) di kiri.  2. Tulis bagian 市 di kanan: atap kecil dan garis tegak dengan kait.",
    words: [
      ["姉", "ane - kakak perempuan (sendiri)"],
      ["お姉さん", "oneesan - kakak perempuan (panggilan)"],
      ["姉妹", "shimai - kakak-adik perempuan"],
    ],
    level: "N4",
  },
  {
    char: "始",
    meaning: "Memulai",
    on: "shi",
    kun: "haji(meru)",
    steps:
      "1. Tulis bagian wanita (女) di kiri.  2. Tulis bagian 台 di kanan: atap kecil dan kotak mulut.",
    words: [
      ["始める", "hajimeru - memulai"],
      ["始まる", "hajimaru - dimulai"],
      ["開始", "kaishi - permulaan"],
    ],
    level: "N4",
  },
  {
    char: "字",
    meaning: "Huruf, aksara",
    on: "ji",
    kun: "",
    steps:
      "1. Tulis atap (宀) di atas.  2. Tutup dengan bagian anak (子) di bawah.",
    words: [
      ["漢字", "kanji - aksara kanji"],
      ["字", "ji - huruf"],
      ["数字", "suuji - angka"],
    ],
    level: "N4",
  },
  {
    char: "室",
    meaning: "Ruangan, kamar",
    on: "shitsu",
    kun: "",
    steps:
      "1. Tulis atap (宀) di atas.  2. Tutup dengan bagian 至 di bawah: garis-garis dan garis mendatar panjang.",
    words: [
      ["教室", "kyoushitsu - ruang kelas"],
      ["図書室", "toshoshitsu - ruang baca"],
      ["地下室", "chikashitsu - ruang bawah tanah"],
    ],
    level: "N4",
  },
  {
    char: "家",
    meaning: "Rumah, keluarga",
    on: "ka",
    kun: "ie",
    steps:
      "1. Tulis atap (宀) di atas.  2. Tutup dengan bagian babi (豕) di bawah.",
    words: [
      ["家", "ie - rumah"],
      ["家族", "kazoku - keluarga"],
      ["家庭", "katei - rumah tangga"],
    ],
    level: "N4",
  },
  {
    char: "屋",
    meaning: "Atap, toko",
    on: "oku",
    kun: "ya",
    steps:
      "1. Tulis bagian atap mayat (尸) di atas.  2. Tutup dengan bagian 至 di bawah.",
    words: [
      ["部屋", "heya - kamar"],
      ["本屋", "hon'ya - toko buku"],
      ["屋上", "okujou - atap gedung"],
    ],
    level: "N4",
  },
  {
    char: "工",
    meaning: "Kerajinan, konstruksi",
    on: "kou",
    kun: "",
    steps:
      "1. Tulis garis mendatar di atas.  2. Tarik garis tegak dari tengah ke bawah.  3. Tutup dengan garis mendatar di bawah.",
    words: [
      ["工場", "koujou - pabrik"],
      ["大工", "daiku - tukang kayu"],
      ["人工", "jinkou - buatan manusia"],
    ],
    level: "N4",
  },
  {
    char: "帰",
    meaning: "Pulang",
    on: "ki",
    kun: "kae(ru)",
    steps:
      "1. Tulis bagian kiri menyerupai bendera kecil.  2. Tutup dengan bagian sapu di kanan.",
    words: [
      ["帰る", "kaeru - pulang"],
      ["帰国", "kikoku - pulang ke negara asal"],
      ["日帰り", "higaeri - pulang-pergi sehari"],
    ],
    level: "N4",
  },
  {
    char: "広",
    meaning: "Luas",
    on: "kou",
    kun: "hiro(i)",
    steps:
      "1. Tulis atap miring (广) di atas kiri.  2. Tutup dengan bagian 厶 kecil di dalamnya.",
    words: [
      ["広い", "hiroi - luas"],
      ["広場", "hiroba - lapangan"],
      ["広告", "koukoku - iklan"],
    ],
    level: "N4",
  },
  {
    char: "度",
    meaning: "Derajat, kali",
    on: "do",
    kun: "tabi",
    steps:
      "1. Tulis atap miring (广) di atas.  2. Tulis beberapa garis dan sapuan di dalam.  3. Tutup dengan bagian tangan (又) di kanan bawah.",
    words: [
      ["一度", "ichido - satu kali"],
      ["今度", "kondo - kali ini, nanti"],
      ["温度", "ondo - suhu"],
    ],
    level: "N4",
  },
  {
    char: "建",
    meaning: "Membangun",
    on: "ken",
    kun: "ta(teru)",
    steps:
      "1. Tulis bagian atas menyerupai garis-garis dan kotak.  2. Tutup dengan sapuan pembungkus (廴) di kiri bawah.",
    words: [
      ["建てる", "tateru - membangun"],
      ["建物", "tatemono - bangunan"],
      ["建築", "kenchiku - arsitektur"],
    ],
    level: "N4",
  },
  {
    char: "弟",
    meaning: "Adik laki-laki",
    on: "tei",
    kun: "otouto",
    steps:
      "1. Tulis garis tegak dengan kait di tengah.  2. Tambahkan sapuan-sapuan pendek di kiri dan kanan.  3. Tutup dengan sapuan melengkung panjang di bawah.",
    words: [
      ["弟", "otouto - adik laki-laki"],
      ["弟さん", "otoutosan - adik laki-laki (orang lain)"],
      ["兄弟", "kyoudai - saudara kandung"],
    ],
    level: "N4",
  },
  {
    char: "強",
    meaning: "Kuat",
    on: "kyou",
    kun: "tsuyo(i)",
    steps:
      "1. Tulis bagian busur (弓) di kiri.  2. Tulis bagian tengah dan kanan menyerupai benang dan serangga.",
    words: [
      ["強い", "tsuyoi - kuat"],
      ["勉強", "benkyou - belajar"],
      ["強力", "kyouryoku - kuat, kekuatan"],
    ],
    level: "N4",
  },
  {
    char: "待",
    meaning: "Menunggu",
    on: "tai",
    kun: "ma(tsu)",
    steps:
      "1. Tulis radikal langkah (彳) di kiri: dua sapuan pendek.  2. Tulis bagian kuil (寺) di kanan: garis-garis dan sapuan dengan titik.",
    words: [
      ["待つ", "matsu - menunggu"],
      ["招待", "shoutai - undangan"],
      ["期待", "kitai - harapan"],
    ],
    level: "N4",
  },
  {
    char: "心",
    meaning: "Hati, pikiran",
    on: "shin",
    kun: "kokoro",
    steps:
      "1. Tulis titik kecil di kiri.  2. Tulis sapuan melengkung dari kiri ke kanan seperti mangkuk.  3. Tutup dengan dua titik di atas sapuan.",
    words: [
      ["心", "kokoro - hati"],
      ["安心", "anshin - tenang"],
      ["心配", "shinpai - khawatir"],
    ],
    level: "N4",
  },
  {
    char: "思",
    meaning: "Berpikir",
    on: "shi",
    kun: "omo(u)",
    steps:
      "1. Tulis kotak sawah (田) di atas.  2. Tutup dengan bagian hati (心) di bawah.",
    words: [
      ["思う", "omou - berpikir"],
      ["思い出", "omoide - kenangan"],
      ["意思", "ishi - kehendak"],
    ],
    level: "N4",
  },
  {
    char: "急",
    meaning: "Buru-buru, mendadak",
    on: "kyuu",
    kun: "iso(gu)",
    steps:
      "1. Tulis sapuan menekuk di atas.  2. Tambahkan garis dan sapuan tangan di tengah.  3. Tutup dengan bagian hati (心) di bawah.",
    words: [
      ["急ぐ", "isogu - buru-buru"],
      ["急に", "kyuuni - tiba-tiba"],
      ["特急", "tokkyuu - kereta cepat"],
    ],
    level: "N4",
  },
  {
    char: "悪",
    meaning: "Buruk, jahat",
    on: "aku",
    kun: "waru(i)",
    steps:
      "1. Tulis bagian atas menyerupai kotak dan garis-garis.  2. Tutup dengan bagian hati (心) di bawah.",
    words: [
      ["悪い", "warui - buruk"],
      ["悪魔", "akuma - iblis"],
      ["最悪", "saiaku - paling buruk"],
    ],
    level: "N4",
  },
  {
    char: "意",
    meaning: "Maksud, hati",
    on: "i",
    kun: "",
    steps:
      "1. Tulis bagian suara (音) di atas: garis-garis dan kotak mulut.  2. Tutup dengan bagian hati (心) di bawah.",
    words: [
      ["意味", "imi - arti"],
      ["注意", "chuui - perhatian"],
      ["意見", "iken - pendapat"],
    ],
    level: "N4",
  },
  {
    char: "持",
    meaning: "Membawa, memiliki",
    on: "ji",
    kun: "mo(tsu)",
    steps:
      "1. Tulis radikal tangan (扌) di kiri.  2. Tulis bagian kuil (寺) di kanan.",
    words: [
      ["持つ", "motsu - membawa, memegang"],
      ["気持ち", "kimochi - perasaan"],
      ["持ち物", "mochimono - barang bawaan"],
    ],
    level: "N4",
  },
  {
    char: "教",
    meaning: "Mengajar",
    on: "kyou",
    kun: "oshi(eru)",
    steps:
      "1. Tulis bagian anak di kiri.  2. Tutup dengan radikal memukul (攵) di kanan: sapuan silang dan garis.",
    words: [
      ["教える", "oshieru - mengajar"],
      ["教室", "kyoushitsu - ruang kelas"],
      ["教育", "kyouiku - pendidikan"],
    ],
    level: "N4",
  },
  {
    char: "文",
    meaning: "Kalimat, tulisan",
    on: "bun",
    kun: "fumi",
    steps:
      "1. Tulis titik kecil di atas.  2. Tulis sapuan mendatar menekuk di bawahnya.  3. Tutup dengan sapuan kiri dan sapuan kanan yang menyilang.",
    words: [
      ["文", "bun - kalimat"],
      ["作文", "sakubun - karangan"],
      ["文化", "bunka - budaya"],
    ],
    level: "N4",
  },
  {
    char: "料",
    meaning: "Biaya, bahan",
    on: "ryou",
    kun: "",
    steps:
      "1. Tulis bagian beras (米) di kiri: garis-garis menyilang dan sapuan.  2. Tulis bagian takaran (斗) di kanan.",
    words: [
      ["料理", "ryouri - masakan"],
      ["料金", "ryoukin - biaya"],
      ["材料", "zairyou - bahan"],
    ],
    level: "N4",
  },
  {
    char: "方",
    meaning: "Arah, cara, orang (sopan)",
    on: "hou",
    kun: "kata",
    steps:
      "1. Tulis titik kecil di kiri atas.  2. Tulis garis mendatar.  3. Tutup dengan sapuan melengkung panjang dan sapuan kecil di kanan bawah.",
    words: [
      ["方", "kata - orang (sopan)"],
      ["使い方", "tsukaikata - cara pakai"],
      ["夕方", "yuugata - sore hari"],
    ],
    level: "N4",
  },
  {
    char: "旅",
    meaning: "Perjalanan",
    on: "ryo",
    kun: "tabi",
    steps:
      "1. Tulis radikal bendera (方) di kiri.  2. Tutup dengan bagian orang-orang berjalan di kanan.",
    words: [
      ["旅行", "ryokou - perjalanan"],
      ["旅", "tabi - perjalanan"],
      ["旅館", "ryokan - penginapan"],
    ],
    level: "N4",
  },
  {
    char: "族",
    meaning: "Suku, keluarga",
    on: "zoku",
    kun: "",
    steps:
      "1. Tulis radikal bendera (方) di kiri atas.  2. Tutup dengan bagian panah (矢) di kanan bawah.",
    words: [
      ["家族", "kazoku - keluarga"],
      ["民族", "minzoku - suku bangsa"],
      ["親族", "shinzoku - kerabat"],
    ],
    level: "N4",
  },
  {
    char: "早",
    meaning: "Cepat, pagi-pagi",
    on: "sou",
    kun: "haya(i)",
    steps:
      "1. Tulis kotak matahari (日) di atas.  2. Tutup dengan garis tegak dan sapuan kiri-kanan di bawah.",
    words: [
      ["早い", "hayai - cepat, pagi"],
      ["早く", "hayaku - segera"],
      ["早朝", "souchou - pagi buta"],
    ],
    level: "N4",
  },
  {
    char: "明",
    meaning: "Terang, jelas",
    on: "mei",
    kun: "aka(rui)",
    steps:
      "1. Tulis kotak matahari (日) di kiri.  2. Tulis bulan (月) di kanan.",
    words: [
      ["明るい", "akarui - terang"],
      ["説明", "setsumei - penjelasan"],
      ["明日", "ashita - besok"],
    ],
    level: "N4",
  },
  {
    char: "映",
    meaning: "Terpantul, memproyeksikan",
    on: "ei",
    kun: "utsu(ru)",
    steps:
      "1. Tulis kotak matahari (日) di kiri.  2. Tulis bagian pusat (央) di kanan.",
    words: [
      ["映画", "eiga - film"],
      ["映る", "utsuru - terpantul, muncul"],
      ["反映", "han'ei - refleksi"],
    ],
    level: "N4",
  },
  {
    char: "春",
    meaning: "Musim semi",
    on: "shun",
    kun: "haru",
    steps:
      "1. Tulis tiga garis dan sapuan silang di atas.  2. Tutup dengan matahari (日) di bawah.",
    words: [
      ["春", "haru - musim semi"],
      ["春休み", "haruyasumi - liburan musim semi"],
      ["青春", "seishun - masa muda"],
    ],
    level: "N4",
  },
  {
    char: "昼",
    meaning: "Siang",
    on: "chuu",
    kun: "hiru",
    steps:
      "1. Tulis garis dan sapuan di atas.  2. Tutup dengan matahari (日) di bawah.",
    words: [
      ["昼", "hiru - siang"],
      ["昼ご飯", "hirugohan - makan siang"],
      ["昼休み", "hiruyasumi - istirahat siang"],
    ],
    level: "N4",
  },
  {
    char: "曜",
    meaning: "Hari (dalam minggu)",
    on: "you",
    kun: "",
    steps:
      "1. Tulis matahari (日) di kiri.  2. Tulis bagian sayap burung di kanan.",
    words: [
      ["曜日", "youbi - hari (dalam minggu)"],
      ["月曜日", "getsuyoubi - hari Senin"],
      ["何曜日", "nan'youbi - hari apa"],
    ],
    level: "N4",
  },
  {
    char: "有",
    meaning: "Ada, memiliki",
    on: "yuu",
    kun: "a(ru)",
    steps:
      "1. Tulis sapuan pendek di kiri atas.  2. Tulis garis mendatar.  3. Tutup dengan bagian bulan/daging (月) di bawah.",
    words: [
      ["有名", "yuumei - terkenal"],
      ["有る", "aru - ada"],
      ["所有", "shoyuu - kepemilikan"],
    ],
    level: "N4",
  },
  {
    char: "服",
    meaning: "Pakaian",
    on: "fuku",
    kun: "",
    steps:
      "1. Tulis bagian bulan/daging (月) di kiri.  2. Tutup dengan bagian tangan menekan di kanan.",
    words: [
      ["服", "fuku - pakaian"],
      ["洋服", "youfuku - pakaian ala barat"],
      ["服装", "fukusou - busana"],
    ],
    level: "N4",
  },
  {
    char: "朝",
    meaning: "Pagi",
    on: "chou",
    kun: "asa",
    steps:
      "1. Tulis bagian matahari terbit di antara rumput di kiri.  2. Tutup dengan bulan (月) di kanan.",
    words: [
      ["朝", "asa - pagi"],
      ["朝ご飯", "asagohan - makan pagi"],
      ["毎朝", "maiasa - setiap pagi"],
    ],
    level: "N4",
  },
  {
    char: "業",
    meaning: "Usaha, pekerjaan",
    on: "gyou",
    kun: "",
    steps:
      "1. Tulis beberapa garis dan sapuan bergerigi di atas.  2. Tutup dengan garis tegak kiri dan kanan yang menopang di bawah.",
    words: [
      ["授業", "jugyou - kelas pelajaran"],
      ["卒業", "sotsugyou - lulus"],
      ["職業", "shokugyou - profesi"],
    ],
    level: "N4",
  },
  {
    char: "楽",
    meaning: "Senang, musik",
    on: "raku, gaku",
    kun: "tano(shii)",
    steps:
      "1. Tulis bagian atas menyerupai dua alat musik kecil.  2. Tutup dengan bagian pohon (木) di bawah.",
    words: [
      ["楽しい", "tanoshii - menyenangkan"],
      ["音楽", "ongaku - musik"],
      ["楽", "raku - santai, mudah"],
    ],
    level: "N4",
  },
  {
    char: "歌",
    meaning: "Lagu, menyanyi",
    on: "ka",
    kun: "uta",
    steps:
      "1. Tulis dua bagian 可 (garis dan kotak mulut) berulang di kiri.  2. Tutup dengan bagian menguap (欠) di kanan.",
    words: [
      ["歌", "uta - lagu"],
      ["歌う", "utau - bernyanyi"],
      ["歌手", "kashu - penyanyi"],
    ],
    level: "N4",
  },
  {
    char: "止",
    meaning: "Berhenti",
    on: "shi",
    kun: "to(maru)",
    steps:
      "1. Tulis garis tegak pendek di kiri.  2. Tulis garis mendatar.  3. Tutup dengan garis tegak dan garis mendatar bawah.",
    words: [
      ["止まる", "tomaru - berhenti"],
      ["中止", "chuushi - dibatalkan"],
      ["禁止", "kinshi - dilarang"],
    ],
    level: "N4",
  },
  {
    char: "正",
    meaning: "Benar, lurus",
    on: "sei",
    kun: "tada(shii)",
    steps:
      "1. Tulis garis mendatar pendek di atas.  2. Tarik garis tegak ke bawah.  3. Tutup dengan garis mendatar bawah yang lebih panjang.",
    words: [
      ["正しい", "tadashii - benar"],
      ["正月", "shougatsu - tahun baru Jepang"],
      ["正直", "shoujiki - jujur"],
    ],
    level: "N4",
  },
  {
    char: "歩",
    meaning: "Berjalan kaki",
    on: "ho",
    kun: "aru(ku)",
    steps:
      "1. Tulis bagian atas menyerupai sedikit tanpa titik.  2. Tutup dengan garis tegak dan sapuan kanan-kiri di bawah.",
    words: [
      ["歩く", "aruku - berjalan kaki"],
      ["散歩", "sanpo - jalan-jalan"],
      ["歩道", "hodou - trotoar"],
    ],
    level: "N4",
  },
  {
    char: "死",
    meaning: "Mati",
    on: "shi",
    kun: "shi(nu)",
    steps:
      "1. Tulis bagian tulang (歹) di kiri.  2. Tutup dengan sapuan berdiri (匕) di kanan.",
    words: [
      ["死ぬ", "shinu - mati"],
      ["死亡", "shibou - kematian"],
      ["必死", "hisshi - mati-matian"],
    ],
    level: "N4",
  },
  {
    char: "注",
    meaning: "Menuang, memperhatikan",
    on: "chuu",
    kun: "soso(gu)",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis bagian tuan (主) di kanan.",
    words: [
      ["注意", "chuui - perhatian"],
      ["注文", "chuumon - pesanan"],
      ["注射", "chuusha - suntikan"],
    ],
    level: "N4",
  },
  {
    char: "洋",
    meaning: "Samudra, ala barat",
    on: "you",
    kun: "",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis bagian kambing (羊) di kanan.",
    words: [
      ["洋服", "youfuku - pakaian barat"],
      ["西洋", "seiyou - dunia barat"],
      ["太平洋", "taiheiyou - Samudra Pasifik"],
    ],
    level: "N4",
  },
  {
    char: "海",
    meaning: "Laut",
    on: "kai",
    kun: "umi",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis bagian setiap (每) di kanan.",
    words: [
      ["海", "umi - laut"],
      ["海外", "kaigai - luar negeri"],
      ["海岸", "kaigan - pantai"],
    ],
    level: "N4",
  },
  {
    char: "漢",
    meaning: "China, Han",
    on: "kan",
    kun: "",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tutup dengan bagian kanan yang kompleks menyerupai gabungan garis dan sapuan.",
    words: [
      ["漢字", "kanji - aksara kanji"],
      ["漢方", "kanpou - pengobatan tradisional Cina"],
      ["悪漢", "akkan - penjahat"],
    ],
    level: "N4",
  },
  {
    char: "牛",
    meaning: "Sapi",
    on: "gyuu",
    kun: "ushi",
    steps:
      "1. Tulis sapuan kecil di kiri atas.  2. Tulis garis mendatar menyilang.  3. Tutup dengan garis tegak panjang menembus ke bawah.",
    words: [
      ["牛", "ushi - sapi"],
      ["牛肉", "gyuuniku - daging sapi"],
      ["牛乳", "gyuunyuu - susu sapi"],
    ],
    level: "N4",
  },
  {
    char: "物",
    meaning: "Benda",
    on: "butsu",
    kun: "mono",
    steps:
      "1. Tulis radikal sapi (牛) di kiri.  2. Tulis bagian 勿 di kanan: sapuan melengkung dan garis-garis kecil.",
    words: [
      ["物", "mono - benda"],
      ["買い物", "kaimono - belanja"],
      ["動物", "doubutsu - hewan"],
    ],
    level: "N4",
  },
  {
    char: "特",
    meaning: "Istimewa, khusus",
    on: "toku",
    kun: "",
    steps:
      "1. Tulis radikal sapi (牛) di kiri.  2. Tulis bagian kuil (寺) di kanan.",
    words: [
      ["特別", "tokubetsu - khusus"],
      ["特急", "tokkyuu - kereta cepat"],
      ["独特", "dokutoku - unik"],
    ],
    level: "N4",
  },
  {
    char: "犬",
    meaning: "Anjing",
    on: "ken",
    kun: "inu",
    steps:
      "1. Tulis sapuan kiri dan sapuan kanan di atas menyerupai besar (大).  2. Tutup dengan titik kecil di kanan atas.",
    words: [
      ["犬", "inu - anjing"],
      ["子犬", "koinu - anak anjing"],
      ["番犬", "banken - anjing penjaga"],
    ],
    level: "N4",
  },
  {
    char: "理",
    meaning: "Logika, alasan",
    on: "ri",
    kun: "",
    steps:
      "1. Tulis radikal permata (王) di kiri.  2. Tulis bagian desa (里) di kanan.",
    words: [
      ["料理", "ryouri - masakan"],
      ["理由", "riyuu - alasan"],
      ["無理", "muri - mustahil, memaksakan"],
    ],
    level: "N4",
  },
  {
    char: "用",
    meaning: "Guna, keperluan",
    on: "you",
    kun: "mochi(iru)",
    steps:
      "1. Tulis garis tegak kiri turun.  2. Tulis garis atas menekuk turun ke kanan.  3. Tambahkan garis-garis mendatar di dalam.",
    words: [
      ["用事", "youji - urusan"],
      ["使用", "shiyou - penggunaan"],
      ["費用", "hiyou - biaya"],
    ],
    level: "N4",
  },
  {
    char: "田",
    meaning: "Sawah",
    on: "den",
    kun: "ta",
    steps:
      "1. Tulis bingkai kotak besar.  2. Tambahkan garis tegak dan garis mendatar menyilang di dalam.",
    words: [
      ["田んぼ", "tanbo - sawah"],
      ["水田", "suiden - sawah air"],
      ["田舎", "inaka - pedesaan"],
    ],
    level: "N4",
  },
  {
    char: "町",
    meaning: "Kota kecil, kelurahan",
    on: "chou",
    kun: "machi",
    steps:
      "1. Tulis bagian sawah (田) di kiri.  2. Tulis bagian paku/kota (丁) di kanan.",
    words: [
      ["町", "machi - kota kecil"],
      ["下町", "shitamachi - kota tua"],
      ["町長", "chouchou - kepala kelurahan"],
    ],
    level: "N4",
  },
  {
    char: "画",
    meaning: "Gambar, lukisan",
    on: "ga",
    kun: "",
    steps:
      "1. Tulis bingkai kotak besar di atas berisi garis-garis.  2. Tutup dengan sawah (田) di bagian bawah.",
    words: [
      ["映画", "eiga - film"],
      ["絵画", "kaiga - lukisan"],
      ["計画", "keikaku - rencana"],
    ],
    level: "N4",
  },
  {
    char: "界",
    meaning: "Dunia, batas",
    on: "kai",
    kun: "",
    steps:
      "1. Tulis bagian sawah (田) di atas.  2. Tutup dengan bagian batas (介) di bawah.",
    words: [
      ["世界", "sekai - dunia"],
      ["業界", "gyoukai - industri"],
      ["限界", "genkai - batas"],
    ],
    level: "N4",
  },
  {
    char: "病",
    meaning: "Sakit",
    on: "byou",
    kun: "ya(mu)",
    steps:
      "1. Tulis atap sakit (疒) di kiri atas: sapuan dan titik-titik.  2. Tutup dengan bagian 丙 di dalamnya.",
    words: [
      ["病気", "byouki - sakit"],
      ["病院", "byouin - rumah sakit"],
      ["病人", "byounin - orang sakit"],
    ],
    level: "N4",
  },
  {
    char: "発",
    meaning: "Berangkat, menerbitkan",
    on: "hatsu",
    kun: "",
    steps:
      "1. Tulis sapuan kaki kiri dan kanan di atas.  2. Tutup dengan bagian busur dan sapuan di bawah.",
    words: [
      ["出発", "shuppatsu - berangkat"],
      ["発見", "hakken - penemuan"],
      ["発表", "happyou - presentasi"],
    ],
    level: "N4",
  },
  {
    char: "真",
    meaning: "Sungguh, asli",
    on: "shin",
    kun: "ma",
    steps:
      "1. Tulis sapuan pendek di atas.  2. Tulis garis tegak menembus beberapa garis mendatar di tengah.  3. Tutup dengan garis mendatar bawah yang lebih panjang.",
    words: [
      ["真実", "shinjitsu - kebenaran"],
      ["写真", "shashin - foto"],
      ["真面目", "majime - serius, rajin"],
    ],
    level: "N4",
  },
  {
    char: "着",
    meaning: "Tiba, memakai",
    on: "chaku",
    kun: "ki(ru)",
    steps:
      "1. Tulis bagian atas menyerupai domba ringkas.  2. Tutup dengan bagian matahari di bawah.",
    words: [
      ["着く", "tsuku - tiba"],
      ["着る", "kiru - memakai (baju)"],
      ["到着", "touchaku - kedatangan"],
    ],
    level: "N4",
  },
  {
    char: "知",
    meaning: "Mengetahui",
    on: "chi",
    kun: "shi(ru)",
    steps:
      "1. Tulis bagian panah (矢) di kiri.  2. Tulis bagian mulut (口) di kanan.",
    words: [
      ["知る", "shiru - mengetahui"],
      ["知識", "chishiki - pengetahuan"],
      ["通知", "tsuuchi - pemberitahuan"],
    ],
    level: "N4",
  },
  {
    char: "研",
    meaning: "Mengasah, meneliti",
    on: "ken",
    kun: "to(gu)",
    steps:
      "1. Tulis radikal batu (石) di kiri.  2. Tulis bagian 开 di kanan: dua garis tegak dan garis mendatar.",
    words: [
      ["研究", "kenkyuu - penelitian"],
      ["研修", "kenshuu - pelatihan"],
      ["研ぐ", "togu - mengasah"],
    ],
    level: "N4",
  },
  {
    char: "私",
    meaning: "Saya, pribadi",
    on: "shi",
    kun: "watashi",
    steps: "1. Tulis radikal padi (禾) di kiri.  2. Tulis bagian 厶 di kanan.",
    words: [
      ["私", "watashi - saya"],
      ["私立", "shiritsu - swasta"],
      ["私語", "shigo - bisik-bisik"],
    ],
    level: "N4",
  },
  {
    char: "秋",
    meaning: "Musim gugur",
    on: "shuu",
    kun: "aki",
    steps:
      "1. Tulis radikal padi (禾) di kiri.  2. Tulis bagian api (火) di kanan.",
    words: [
      ["秋", "aki - musim gugur"],
      ["秋分", "shuubun - ekuinoks musim gugur"],
      ["秋田", "akita - Akita (nama daerah)"],
    ],
    level: "N4",
  },
  {
    char: "究",
    meaning: "Meneliti, mendalami",
    on: "kyuu",
    kun: "kiwa(meru)",
    steps:
      "1. Tulis atap gua (穴) di atas.  2. Tutup dengan bagian sembilan (九) di bawah.",
    words: [
      ["研究", "kenkyuu - penelitian"],
      ["究極", "kyuukyoku - puncak, terbaik"],
      ["追究", "tsuikyuu - penyelidikan mendalam"],
    ],
    level: "N4",
  },
  {
    char: "答",
    meaning: "Jawaban",
    on: "tou",
    kun: "kota(eru)",
    steps:
      "1. Tulis radikal bambu (竹) di atas.  2. Tutup dengan bagian cocok (合) di bawah.",
    words: [
      ["答える", "kotaeru - menjawab"],
      ["答え", "kotae - jawaban"],
      ["返答", "hentou - balasan"],
    ],
    level: "N4",
  },
  {
    char: "紙",
    meaning: "Kertas",
    on: "shi",
    kun: "kami",
    steps:
      "1. Tulis radikal benang (糸) di kiri.  2. Tulis bagian akar (氏) di kanan.",
    words: [
      ["紙", "kami - kertas"],
      ["手紙", "tegami - surat"],
      ["新聞紙", "shinbunshi - kertas koran"],
    ],
    level: "N4",
  },
  {
    char: "終",
    meaning: "Berakhir",
    on: "shuu",
    kun: "o(waru)",
    steps:
      "1. Tulis radikal benang (糸) di kiri.  2. Tulis bagian musim dingin (冬) di kanan.",
    words: [
      ["終わる", "owaru - berakhir"],
      ["終電", "shuuden - kereta terakhir"],
      ["最終", "saishuu - terakhir"],
    ],
    level: "N4",
  },
  {
    char: "習",
    meaning: "Belajar, kebiasaan",
    on: "shuu",
    kun: "nara(u)",
    steps:
      "1. Tulis radikal bulu (羽) di atas.  2. Tutup dengan bagian putih (白) di bawah.",
    words: [
      ["習う", "narau - belajar dari guru"],
      ["練習", "renshuu - latihan"],
      ["習慣", "shuukan - kebiasaan"],
    ],
    level: "N4",
  },
  {
    char: "考",
    meaning: "Berpikir, mempertimbangkan",
    on: "kou",
    kun: "kanga(eru)",
    steps:
      "1. Tulis bagian atas menyerupai tua (老 ringkas).  2. Tutup dengan sapuan melengkung dengan kait di bawah.",
    words: [
      ["考える", "kangaeru - memikirkan"],
      ["考え", "kangae - pikiran"],
      ["参考", "sankou - referensi"],
    ],
    level: "N4",
  },
  {
    char: "者",
    meaning: "Orang (pelaku)",
    on: "sha",
    kun: "mono",
    steps:
      "1. Tulis bagian atas menyerupai tua (老 ringkas) tanpa kaki.  2. Tutup dengan titik kecil di bawah.",
    words: [
      ["医者", "isha - dokter"],
      ["学者", "gakusha - ilmuwan"],
      ["者", "mono - orang"],
    ],
    level: "N4",
  },
  {
    char: "肉",
    meaning: "Daging",
    on: "niku",
    kun: "",
    steps:
      "1. Tulis bingkai kotak besar.  2. Tambahkan dua sapuan menyerupai huruf 人 bertumpuk di dalam.",
    words: [
      ["肉", "niku - daging"],
      ["牛肉", "gyuuniku - daging sapi"],
      ["筋肉", "kinniku - otot"],
    ],
    level: "N4",
  },
  {
    char: "自",
    meaning: "Diri sendiri",
    on: "ji",
    kun: "mizuka(ra)",
    steps:
      "1. Tulis sapuan pendek di atas.  2. Tulis garis tegak kiri turun.  3. Tutup dengan beberapa garis mendatar di dalam bingkai.",
    words: [
      ["自分", "jibun - diri sendiri"],
      ["自転車", "jitensha - sepeda"],
      ["自由", "jiyuu - bebas"],
    ],
    level: "N4",
  },
  {
    char: "色",
    meaning: "Warna",
    on: "shoku, shiki",
    kun: "iro",
    steps:
      "1. Tulis sapuan orang di atas.  2. Tutup dengan bagian 巴 di bawah.",
    words: [
      ["色", "iro - warna"],
      ["景色", "keshiki - pemandangan"],
      ["色々", "iroiro - bermacam-macam"],
    ],
    level: "N4",
  },
  {
    char: "英",
    meaning: "Inggris, unggul",
    on: "ei",
    kun: "",
    steps:
      "1. Tulis dua garis pendek radikal rumput (艹) di atas.  2. Tutup dengan bagian tengah (央) di bawah.",
    words: [
      ["英語", "eigo - bahasa Inggris"],
      ["英国", "eikoku - Inggris (negara)"],
      ["英雄", "eiyuu - pahlawan"],
    ],
    level: "N4",
  },
  {
    char: "茶",
    meaning: "Teh",
    on: "cha",
    kun: "",
    steps:
      "1. Tulis dua garis pendek radikal rumput (艹) di atas.  2. Tutup dengan bagian pohon dan manusia di bawah.",
    words: [
      ["お茶", "ocha - teh"],
      ["茶色", "chairo - warna cokelat"],
      ["紅茶", "koucha - teh hitam"],
    ],
    level: "N4",
  },
  {
    char: "親",
    meaning: "Orang tua, akrab",
    on: "shin",
    kun: "oya",
    steps:
      "1. Tulis bagian berdiri di atas pohon di kiri.  2. Tutup dengan bagian melihat (見) di kanan.",
    words: [
      ["親", "oya - orang tua"],
      ["親切", "shinsetsu - baik hati"],
      ["両親", "ryoushin - kedua orang tua"],
    ],
    level: "N4",
  },
  {
    char: "計",
    meaning: "Menghitung, rencana",
    on: "kei",
    kun: "haka(ru)",
    steps:
      "1. Tulis radikal kata (言) di kiri.  2. Tulis garis mendatar dan sapuan kecil di kanan.",
    words: [
      ["計画", "keikaku - rencana"],
      ["時計", "tokei - jam"],
      ["合計", "goukei - jumlah total"],
    ],
    level: "N4",
  },
  {
    char: "試",
    meaning: "Mencoba, uji",
    on: "shi",
    kun: "tame(su)",
    steps:
      "1. Tulis radikal kata (言) di kiri.  2. Tulis bagian 式 di kanan: sapuan dan garis-garis.",
    words: [
      ["試す", "tamesu - mencoba"],
      ["試験", "shiken - ujian"],
      ["試合", "shiai - pertandingan"],
    ],
    level: "N4",
  },
  {
    char: "貸",
    meaning: "Meminjamkan",
    on: "tai",
    kun: "ka(su)",
    steps:
      "1. Tulis bagian menggantikan (代) di atas.  2. Tutup dengan uang kerang (貝) di bawah.",
    words: [
      ["貸す", "kasu - meminjamkan"],
      ["貸家", "kashiya - rumah sewa"],
      ["賃貸", "chintai - sewa"],
    ],
    level: "N4",
  },
  {
    char: "質",
    meaning: "Kualitas, sifat",
    on: "shitsu",
    kun: "",
    steps:
      "1. Tulis dua bagian kapak (斤) berulang di atas.  2. Tutup dengan uang kerang (貝) di bawah.",
    words: [
      ["質問", "shitsumon - pertanyaan"],
      ["品質", "hinshitsu - kualitas"],
      ["性質", "seishitsu - sifat"],
    ],
    level: "N4",
  },
  {
    char: "赤",
    meaning: "Merah",
    on: "seki",
    kun: "aka(i)",
    steps:
      "1. Tulis bagian tanah (土) di atas.  2. Tutup dengan sapuan kaki kiri dan kanan di bawah.",
    words: [
      ["赤い", "akai - merah"],
      ["赤ちゃん", "akachan - bayi"],
      ["赤字", "akaji - defisit"],
    ],
    level: "N4",
  },
  {
    char: "走",
    meaning: "Berlari",
    on: "sou",
    kun: "hashi(ru)",
    steps:
      "1. Tulis bagian tanah (土) di atas.  2. Tutup dengan bagian kaki melangkah di bawah.",
    words: [
      ["走る", "hashiru - berlari"],
      ["競走", "kyousou - lomba lari"],
      ["走者", "sousha - pelari"],
    ],
    level: "N4",
  },
  {
    char: "起",
    meaning: "Bangun, terjadi",
    on: "ki",
    kun: "o(kiru)",
    steps:
      "1. Tulis radikal berlari (走) di kiri.  2. Tulis bagian diri sendiri (己) di kanan.",
    words: [
      ["起きる", "okiru - bangun, terjadi"],
      ["起こる", "okoru - terjadi"],
      ["早起き", "hayaoki - bangun pagi"],
    ],
    level: "N4",
  },
  {
    char: "転",
    meaning: "Berputar, berpindah",
    on: "ten",
    kun: "koro(garu)",
    steps:
      "1. Tulis radikal kendaraan (車) di kiri.  2. Tulis bagian 云 di kanan.",
    words: [
      ["運転", "unten - mengemudi"],
      ["転ぶ", "korobu - terjatuh"],
      ["自転車", "jitensha - sepeda"],
    ],
    level: "N4",
  },
  {
    char: "近",
    meaning: "Dekat",
    on: "kin",
    kun: "chika(i)",
    steps:
      "1. Tulis bagian kapak (斤) di atas.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["近い", "chikai - dekat"],
      ["近所", "kinjo - tetangga"],
      ["最近", "saikin - baru-baru ini"],
    ],
    level: "N4",
  },
  {
    char: "送",
    meaning: "Mengirim, mengantar",
    on: "sou",
    kun: "oku(ru)",
    steps:
      "1. Tulis bagian atas menyerupai persembahan.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["送る", "okuru - mengirim, mengantar"],
      ["送料", "souryou - biaya kirim"],
      ["放送", "housou - siaran"],
    ],
    level: "N4",
  },
  {
    char: "通",
    meaning: "Melewati, lalu lintas",
    on: "tsuu",
    kun: "too(ru)",
    steps:
      "1. Tulis bagian 甬 di atas: kotak dan garis tegak.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["通る", "tooru - melewati"],
      ["交通", "koutsuu - lalu lintas"],
      ["通学", "tsuugaku - pergi sekolah"],
    ],
    level: "N4",
  },
  {
    char: "運",
    meaning: "Membawa, nasib",
    on: "un",
    kun: "hako(bu)",
    steps:
      "1. Tulis bagian tentara (軍 ringkas) di atas.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["運ぶ", "hakobu - membawa"],
      ["運動", "undou - olahraga"],
      ["運転", "unten - mengemudi"],
    ],
    level: "N4",
  },
  {
    char: "重",
    meaning: "Berat, penting",
    on: "juu",
    kun: "omo(i)",
    steps:
      "1. Tulis garis tegak menembus beberapa garis mendatar di atas.  2. Tulis kotak sawah (田) di tengah.  3. Tutup dengan garis mendatar bawah yang panjang.",
    words: [
      ["重い", "omoi - berat"],
      ["重要", "juuyou - penting"],
      ["体重", "taijuu - berat badan"],
    ],
    level: "N4",
  },
  {
    char: "野",
    meaning: "Ladang, liar",
    on: "ya",
    kun: "no",
    steps:
      "1. Tulis bagian sawah dan desa (里) di kiri.  2. Tulis bagian 予 di kanan.",
    words: [
      ["野菜", "yasai - sayuran"],
      ["野球", "yakyuu - bisbol"],
      ["分野", "bun'ya - bidang"],
    ],
    level: "N4",
  },
  {
    char: "銀",
    meaning: "Perak",
    on: "gin",
    kun: "",
    steps: "1. Tulis radikal logam (釒) di kiri.  2. Tulis bagian 艮 di kanan.",
    words: [
      ["銀行", "ginkou - bank"],
      ["銀色", "gin'iro - warna perak"],
      ["銀", "gin - perak"],
    ],
    level: "N4",
  },
  {
    char: "開",
    meaning: "Membuka",
    on: "kai",
    kun: "hira(ku)",
    steps:
      "1. Tulis bingkai pintu (門) mengelilingi.  2. Isi dengan bagian tangan membuka di dalam.",
    words: [
      ["開く", "hiraku - membuka"],
      ["開ける", "akeru - membuka"],
      ["開始", "kaishi - permulaan"],
    ],
    level: "N4",
  },
  {
    char: "院",
    meaning: "Institusi, rumah sakit",
    on: "in",
    kun: "",
    steps:
      "1. Tulis radikal bukit (阝) di kiri.  2. Tulis bagian lengkap (完) di kanan.",
    words: [
      ["病院", "byouin - rumah sakit"],
      ["入院", "nyuuin - rawat inap"],
      ["美容院", "biyouin - salon"],
    ],
    level: "N4",
  },
  {
    char: "集",
    meaning: "Mengumpulkan",
    on: "shuu",
    kun: "atsu(maru)",
    steps:
      "1. Tulis bagian burung (隹) di atas.  2. Tutup dengan pohon (木) di bawah.",
    words: [
      ["集める", "atsumeru - mengumpulkan"],
      ["集まる", "atsumaru - berkumpul"],
      ["集中", "shuuchuu - konsentrasi"],
    ],
    level: "N4",
  },
  {
    char: "青",
    meaning: "Biru",
    on: "sei",
    kun: "ao",
    steps:
      "1. Tulis bagian tunas di atas.  2. Tutup dengan bagian bulan/warna (月) di bawah.",
    words: [
      ["青い", "aoi - biru"],
      ["青年", "seinen - pemuda"],
      ["青空", "aozora - langit biru"],
    ],
    level: "N4",
  },
  {
    char: "音",
    meaning: "Suara",
    on: "on",
    kun: "oto",
    steps:
      "1. Tulis sapuan pendek di atas.  2. Tulis garis mendatar dan kotak.  3. Tutup dengan matahari (日) di bagian bawah.",
    words: [
      ["音", "oto - suara"],
      ["音楽", "ongaku - musik"],
      ["発音", "hatsuon - pelafalan"],
    ],
    level: "N4",
  },
  {
    char: "題",
    meaning: "Judul, topik",
    on: "dai",
    kun: "",
    steps:
      "1. Tulis bagian subjek (是) di kiri.  2. Tutup dengan bagian kepala (頁) di kanan.",
    words: [
      ["問題", "mondai - masalah"],
      ["宿題", "shukudai - PR"],
      ["話題", "wadai - topik pembicaraan"],
    ],
    level: "N4",
  },
  {
    char: "風",
    meaning: "Angin, gaya",
    on: "fuu",
    kun: "kaze",
    steps:
      "1. Tulis bingkai melengkung mengelilingi.  2. Isi dengan bagian serangga (虫) di dalam.",
    words: [
      ["風", "kaze - angin"],
      ["台風", "taifuu - topan"],
      ["風邪", "kaze - flu"],
    ],
    level: "N4",
  },
  {
    char: "飯",
    meaning: "Nasi, makanan",
    on: "han",
    kun: "meshi",
    steps:
      "1. Tulis bagian makan (食) di kiri.  2. Tulis bagian membalik (反) di kanan.",
    words: [
      ["ご飯", "gohan - nasi, makanan"],
      ["朝ご飯", "asagohan - sarapan"],
      ["夕飯", "yuuhan - makan malam"],
    ],
    level: "N4",
  },
  {
    char: "館",
    meaning: "Gedung besar",
    on: "kan",
    kun: "",
    steps:
      "1. Tulis bagian makan (食) di kiri.  2. Tulis bagian resmi (官) di kanan.",
    words: [
      ["図書館", "toshokan - perpustakaan"],
      ["映画館", "eigakan - bioskop"],
      ["大使館", "taishikan - kedutaan besar"],
    ],
    level: "N4",
  },
  {
    char: "験",
    meaning: "Menguji, mengalami",
    on: "ken",
    kun: "",
    steps:
      "1. Tulis radikal kuda (馬) di kiri.  2. Tulis bagian kanan menyerupai dua orang di bawah atap.",
    words: [
      ["試験", "shiken - ujian"],
      ["経験", "keiken - pengalaman"],
      ["実験", "jikken - eksperimen"],
    ],
    level: "N4",
  },
  {
    char: "鳥",
    meaning: "Burung",
    on: "chou",
    kun: "tori",
    steps:
      "1. Tulis bagian atas menyerupai kepala burung dengan mata kecil.  2. Tutup dengan empat titik kaki burung di bawah.",
    words: [
      ["鳥", "tori - burung"],
      ["白鳥", "hakuchou - angsa"],
      ["焼き鳥", "yakitori - sate ayam"],
    ],
    level: "N4",
  },
  {
    char: "黒",
    meaning: "Hitam",
    on: "koku",
    kun: "kuro(i)",
    steps:
      "1. Tulis bagian tanah dan sawah bertumpuk di atas.  2. Tutup dengan empat titik api (灬) di bawah.",
    words: [
      ["黒い", "kuroi - hitam"],
      ["黒板", "kokuban - papan tulis"],
      ["黒字", "kuroji - surplus"],
    ],
    level: "N4",
  },
  {
    char: "与",
    meaning: "Memberi",
    on: "yo",
    kun: "ata(eru)",
    steps:
      "Tulis garis mendatar pendek di kiri atas. Tulis bagian tengah menyerupai kotak terbuka dengan dua garis tegak pendek. Tutup dengan garis mendatar panjang di bawah.",
    words: [
      ["与える", "ataeru - memberi"],
      ["給与", "kyuuyo - gaji, tunjangan"],
      ["関与", "kan'yo - keterlibatan"],
    ],
    level: "N3",
  },
  {
    char: "両",
    meaning: "Kedua, pasang",
    on: "ryou",
    kun: "futatsu",
    steps:
      "Tulis bingkai kotak besar di atas mengelilingi dua garis pendek sejajar. Tutup dengan bagian bawah menyerupai dua kaki melebar.",
    words: [
      ["両親", "ryoushin - kedua orang tua"],
      ["両方", "ryouhou - keduanya"],
      ["両替", "ryougae - penukaran uang"],
    ],
    level: "N3",
  },
  {
    char: "乗",
    meaning: "Naik, mengendarai",
    on: "jou",
    kun: "no(ru)",
    steps:
      "Tulis bagian atas menyerupai huruf 千 dengan sapuan silang. Tarik garis tegak panjang menembus badan kanji ke bawah. Tutup dengan dua sapuan kaki di kiri dan kanan bawah.",
    words: [
      ["乗る", "noru - naik kendaraan"],
      ["乗客", "joukyaku - penumpang"],
      ["乗り換え", "norikae - transfer, ganti kendaraan"],
    ],
    level: "N3",
  },
  {
    char: "予",
    meaning: "Sebelumnya, perkiraan",
    on: "yo",
    kun: "arakaji(me)",
    steps:
      "Tulis sapuan melengkung kecil seperti kait di kiri atas. Tulis garis mendatar menembus tengah. Tutup dengan sapuan melengkung panjang dari atas ke kanan bawah dengan kait.",
    words: [
      ["予定", "yotei - jadwal, rencana"],
      ["予約", "yoyaku - reservasi"],
      ["予習", "yoshuu - belajar sebelum kelas"],
    ],
    level: "N3",
  },
  {
    char: "争",
    meaning: "Bertengkar, bersaing",
    on: "sou",
    kun: "araso(u)",
    steps:
      "Tulis sapuan melengkung pendek di atas. Tulis garis mendatar menembus tengah. Tutup dengan bagian bawah menyerupai kait tegak dan sapuan kiri.",
    words: [
      ["争う", "arasou - bertengkar, bersaing"],
      ["戦争", "sensou - perang"],
      ["競争", "kyousou - kompetisi"],
    ],
    level: "N3",
  },
  {
    char: "互",
    meaning: "Saling, timbal balik",
    on: "go",
    kun: "taga(i)",
    steps:
      "Tulis garis mendatar di atas. Tulis dua garis tegak pendek sejajar di dalam kotak. Tutup dengan garis mendatar di bawah.",
    words: [
      ["お互い", "otagai - satu sama lain"],
      ["互角", "gokaku - seimbang"],
      ["相互", "sougo - timbal balik"],
    ],
    level: "N3",
  },
  {
    char: "亡",
    meaning: "Meninggal, hilang",
    on: "bou",
    kun: "na(i)",
    steps:
      "Tulis atap kecil (亠) di atas. Tutup dengan sapuan melengkung dari kiri atas ke kanan bawah.",
    words: [
      ["死亡", "shibou - kematian"],
      ["亡くなる", "nakunaru - meninggal dunia"],
      ["亡命", "boumei - pengasingan, suaka"],
    ],
    level: "N3",
  },
  {
    char: "交",
    meaning: "Bertukar, bergaul",
    on: "kou",
    kun: "maji(waru)",
    steps:
      "Tulis atap kecil (亠) di atas. Tulis garis mendatar di tengah. Tutup dengan dua sapuan menyilang membentuk huruf X di bawah.",
    words: [
      ["交通", "koutsuu - lalu lintas"],
      ["交換", "koukan - pertukaran"],
      ["交わる", "majiwaru - berpotongan, bergaul"],
    ],
    level: "N3",
  },
  {
    char: "他",
    meaning: "Lain, yang lain",
    on: "ta",
    kun: "hoka",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian 也 di kanan: sapuan melengkung dengan kait.",
    words: [
      ["その他", "sonota - selain itu"],
      ["他人", "tanin - orang lain"],
      ["他の", "hokano - yang lain"],
    ],
    level: "N3",
  },
  {
    char: "付",
    meaning: "Menempel, melekat",
    on: "fu",
    kun: "tsu(keru)",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian 寸 di kanan: garis mendatar, tegak dengan kait, dan titik kecil.",
    words: [
      ["付ける", "tsukeru - memasang, menempelkan"],
      ["付近", "fukin - sekitar"],
      ["気付く", "kizuku - menyadari"],
    ],
    level: "N3",
  },
  {
    char: "件",
    meaning: "Perkara, hal",
    on: "ken",
    kun: "kudan",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian sapi (牛) di kanan: garis tegak menembus dua garis mendatar dan sapuan kiri.",
    words: [
      ["事件", "jiken - insiden, kasus"],
      ["用件", "youken - urusan penting"],
      ["条件", "jouken - syarat"],
    ],
    level: "N3",
  },
  {
    char: "任",
    meaning: "Tugas, mempercayakan",
    on: "nin",
    kun: "maka(seru)",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian 壬 di kanan: garis mendatar, tegak, dan garis mendatar lagi.",
    words: [
      ["任せる", "makaseru - mempercayakan"],
      ["責任", "sekinin - tanggung jawab"],
      ["主任", "shunin - kepala, penanggung jawab"],
    ],
    level: "N3",
  },
  {
    char: "伝",
    meaning: "Menyampaikan, tradisi",
    on: "den",
    kun: "tsuta(waru), tsuta(eru)",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian kanan menyerupai 云 dengan garis mendatar dan sapuan melengkung.",
    words: [
      ["伝える", "tsutaeru - menyampaikan"],
      ["伝統", "dentou - tradisi"],
      ["手伝う", "tetsudau - membantu"],
    ],
    level: "N3",
  },
  {
    char: "似",
    meaning: "Mirip, menyerupai",
    on: "ji",
    kun: "ni(ru)",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian 以 di kanan: titik, sapuan, garis tegak, dan dua sapuan bawah.",
    words: [
      ["似る", "niru - mirip"],
      ["似合う", "niau - cocok, serasi"],
      ["真似", "mane - tiruan"],
    ],
    level: "N3",
  },
  {
    char: "位",
    meaning: "Peringkat, kira-kira",
    on: "i",
    kun: "kurai",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian berdiri (立) di kanan.",
    words: [
      ["一位", "ichii - peringkat pertama"],
      ["位置", "ichi - posisi"],
      ["~くらい", "kurai - kira-kira"],
    ],
    level: "N3",
  },
  {
    char: "余",
    meaning: "Sisa, berlebih",
    on: "yo",
    kun: "ama(ru)",
    steps:
      "Tulis atap kecil (人) di atas. Tulis kotak kecil di tengah. Tutup dengan sapuan silang kecil di bawah.",
    words: [
      ["余る", "amaru - tersisa, berlebih"],
      ["余裕", "yoyuu - kelonggaran"],
      ["余分", "yobun - kelebihan"],
    ],
    level: "N3",
  },
  {
    char: "例",
    meaning: "Contoh",
    on: "rei",
    kun: "tato(eru)",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian 列 di kanan: bagian atas kecil dan pisau (刂).",
    words: [
      ["例えば", "tatoeba - contohnya"],
      ["例外", "reigai - pengecualian"],
      ["実例", "jitsurei - contoh nyata"],
    ],
    level: "N3",
  },
  {
    char: "供",
    meaning: "Menyediakan, menyajikan",
    on: "kyou",
    kun: "sona(eru)",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian 共 di kanan: kotak kecil di atas dan dua sapuan kaki di bawah.",
    words: [
      ["供える", "sonaeru - mempersembahkan"],
      ["提供", "teikyou - penyediaan"],
      ["子供", "kodomo - anak"],
    ],
    level: "N3",
  },
  {
    char: "便",
    meaning: "Praktis, kesempatan",
    on: "ben, bin",
    kun: "tayo(ri)",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian 更 di kanan: garis mendatar, kotak kecil, dan sapuan bawah.",
    words: [
      ["便利", "benri - praktis"],
      ["郵便", "yuubin - pos"],
      ["航空便", "koukuubin - pos udara"],
    ],
    level: "N3",
  },
  {
    char: "係",
    meaning: "Petugas, hubungan",
    on: "kei",
    kun: "kaka(ru)",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian benang (糸) di kanan: sapuan atas dan lilitan benang kecil di bawah.",
    words: [
      ["係員", "kakariin - petugas"],
      ["関係", "kankei - hubungan"],
      ["係る", "kakaru - berkaitan"],
    ],
    level: "N3",
  },
  {
    char: "信",
    meaning: "Percaya",
    on: "shin",
    kun: "",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian kata (言) di kanan: atap kecil dan beberapa garis mendatar di atas kotak mulut.",
    words: [
      ["信じる", "shinjiru - percaya"],
      ["自信", "jishin - percaya diri"],
      ["信号", "shingou - lampu lalu lintas, sinyal"],
    ],
    level: "N3",
  },
  {
    char: "倒",
    meaning: "Roboh, jatuh",
    on: "tou",
    kun: "tao(reru)",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian 至 di kanan: garis-garis mendatar dan tanah (土) di bawah.",
    words: [
      ["倒れる", "taoreru - roboh, jatuh"],
      ["面倒", "mendou - merepotkan"],
      ["倒産", "tousan - bangkrut"],
    ],
    level: "N3",
  },
  {
    char: "候",
    meaning: "Musim, iklim",
    on: "kou",
    kun: "sourou",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian kanan dengan garis tegak menembus beberapa garis mendatar dan sapuan kecil.",
    words: [
      ["天候", "tenkou - cuaca"],
      ["気候", "kikou - iklim"],
      ["候補", "kouho - kandidat"],
    ],
    level: "N3",
  },
  {
    char: "値",
    meaning: "Nilai, harga",
    on: "chi",
    kun: "ne",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian 直 di kanan: mata (目) dengan garis tegak menembus dan garis mendatar bawah.",
    words: [
      ["値段", "nedan - harga"],
      ["価値", "kachi - nilai"],
      ["数値", "suuchi - nilai numerik"],
    ],
    level: "N3",
  },
  {
    char: "偉",
    meaning: "Hebat, agung",
    on: "i",
    kun: "era(i)",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian 韋 di kanan: kotak dan garis-garis bertumpuk.",
    words: [
      ["偉い", "erai - hebat"],
      ["偉大", "idai - agung, besar"],
      ["偉人", "ijin - tokoh besar"],
    ],
    level: "N3",
  },
  {
    char: "側",
    meaning: "Sisi, samping",
    on: "soku",
    kun: "gawa, soba",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian 則 di kanan: uang kerang (貝) dan pisau (刂).",
    words: [
      ["内側", "uchigawa - sisi dalam"],
      ["右側", "migigawa - sisi kanan"],
      ["側面", "sokumen - sisi, tampak samping"],
    ],
    level: "N3",
  },
  {
    char: "偶",
    meaning: "Kebetulan, pasangan",
    on: "guu",
    kun: "tama",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian kanan menyerupai wajah dengan garis-garis dan kaki di bawah.",
    words: [
      ["偶然", "guuzen - kebetulan"],
      ["偶数", "guusuu - bilangan genap"],
      ["配偶者", "haiguusha - pasangan, suami-istri"],
    ],
    level: "N3",
  },
  {
    char: "備",
    meaning: "Melengkapi, persiapan",
    on: "bi",
    kun: "sona(eru)",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian kanan dengan garis tegak menembus beberapa garis mendatar dan sapuan bawah.",
    words: [
      ["準備", "junbi - persiapan"],
      ["備える", "sonaeru - mempersiapkan"],
      ["設備", "setsubi - fasilitas"],
    ],
    level: "N3",
  },
  {
    char: "働",
    meaning: "Bekerja",
    on: "dou",
    kun: "hatara(ku)",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian berat (重) di kanan atas. Tutup dengan bagian tenaga (力) di kanan bawah.",
    words: [
      ["働く", "hataraku - bekerja"],
      ["労働", "roudou - kerja, buruh"],
      ["共働き", "tomobataraki - suami istri bekerja"],
    ],
    level: "N3",
  },
  {
    char: "優",
    meaning: "Lembut, unggul",
    on: "yuu",
    kun: "yasa(shii)",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian kanan yang kompleks menyerupai gambar hati di tengah dengan garis-garis di atas dan bawah.",
    words: [
      ["優しい", "yasashii - lembut, baik hati"],
      ["優秀", "yuushuu - unggul"],
      ["女優", "joyuu - aktris"],
    ],
    level: "N3",
  },
  {
    char: "光",
    meaning: "Cahaya, sinar",
    on: "kou",
    kun: "hika(ru), hikari",
    steps:
      "Tulis kotak mulut kecil di kiri atas. Tulis garis tegak menembus di tengah. Tutup dengan sapuan kaki kiri dan kanan melengkung di bawah.",
    words: [
      ["光る", "hikaru - bersinar"],
      ["光線", "kousen - sinar cahaya"],
      ["観光", "kankou - pariwisata"],
    ],
    level: "N3",
  },
  {
    char: "全",
    meaning: "Seluruh, lengkap",
    on: "zen",
    kun: "matta(ku), sube(te)",
    steps:
      "Tulis atap kecil (人) di atas. Tutup dengan bagian raja (王) di bawah.",
    words: [
      ["全部", "zenbu - semuanya"],
      ["全然", "zenzen - sama sekali"],
      ["全て", "subete - semuanya"],
    ],
    level: "N3",
  },
  {
    char: "共",
    meaning: "Bersama",
    on: "kyou",
    kun: "tomo(ni)",
    steps:
      "Tulis kotak kecil di atas. Tutup dengan dua sapuan kaki melebar ke kiri dan kanan bawah.",
    words: [
      ["共に", "tomoni - bersama-sama"],
      ["共通", "kyoutsuu - kesamaan, umum"],
      ["公共", "koukyou - publik, umum"],
    ],
    level: "N3",
  },
  {
    char: "具",
    meaning: "Alat, perlengkapan",
    on: "gu",
    kun: "sona(eru)",
    steps:
      "Tulis kotak mulut besar di atas dengan garis-garis di dalam. Tutup dengan dua sapuan kaki di bawah.",
    words: [
      ["道具", "dougu - alat"],
      ["具合", "guai - keadaan, kondisi"],
      ["家具", "kagu - furnitur"],
    ],
    level: "N3",
  },
  {
    char: "内",
    meaning: "Dalam, di antara",
    on: "nai",
    kun: "uchi",
    steps:
      "Tulis bingkai kotak (冂) mengelilingi. Tulis bagian dalam menyerupai orang (人) di tengah.",
    words: [
      ["内側", "uchigawa - sisi dalam"],
      ["国内", "kokunai - dalam negeri"],
      ["案内", "annai - pemandu, informasi"],
    ],
    level: "N3",
  },
  {
    char: "冷",
    meaning: "Dingin, sejuk",
    on: "rei",
    kun: "tsume(tai), hi(eru)",
    steps:
      "Tulis dua titik es (冫) di kiri. Tulis bagian memerintah (令) di kanan: atap kecil dan garis-garis di bawahnya.",
    words: [
      ["冷たい", "tsumetai - dingin"],
      ["冷房", "reibou - AC, pendingin ruangan"],
      ["冷蔵庫", "reizouko - kulkas"],
    ],
    level: "N3",
  },
  {
    char: "処",
    meaning: "Menangani, tempat",
    on: "sho",
    kun: "tokoro",
    steps:
      "Tulis sapuan miring pendek di kiri atas. Tutup dengan bagian meja (几) melengkung di kanan bawah.",
    words: [
      ["処理", "shori - pengolahan, penanganan"],
      ["処分", "shobun - pembuangan, hukuman"],
      ["対処", "taisho - penanganan"],
    ],
    level: "N3",
  },
  {
    char: "列",
    meaning: "Baris, deret",
    on: "retsu",
    kun: "",
    steps:
      "Tulis bagian kiri menyerupai tulang (歹): sapuan miring dan garis-garis pendek. Tulis bagian pisau (刂) di kanan.",
    words: [
      ["列", "retsu - baris, antrean"],
      ["行列", "gyouretsu - antrean panjang"],
      ["列車", "ressha - kereta api"],
    ],
    level: "N3",
  },
  {
    char: "初",
    meaning: "Awal, pertama",
    on: "sho",
    kun: "haji(me), hatsu",
    steps:
      "Tulis bagian pakaian (衤) di kiri. Tulis bagian pisau (刀) di kanan.",
    words: [
      ["初めて", "hajimete - untuk pertama kalinya"],
      ["最初", "saisho - paling awal"],
      ["初日", "shonichi - hari pertama"],
    ],
    level: "N3",
  },
  {
    char: "判",
    meaning: "Keputusan, cap",
    on: "han",
    kun: "waka(ru)",
    steps:
      "Tulis bagian setengah (半) di kiri. Tulis bagian pisau (刂) di kanan.",
    words: [
      ["判断", "handan - keputusan, penilaian"],
      ["裁判", "saiban - persidangan"],
      ["評判", "hyouban - reputasi"],
    ],
    level: "N3",
  },
  {
    char: "利",
    meaning: "Keuntungan, manfaat",
    on: "ri",
    kun: "ki(ku)",
    steps: "Tulis bagian padi (禾) di kiri. Tulis bagian pisau (刂) di kanan.",
    words: [
      ["便利", "benri - praktis"],
      ["利用", "riyou - penggunaan"],
      ["利く", "kiku - berfungsi, manjur"],
    ],
    level: "N3",
  },
  {
    char: "到",
    meaning: "Tiba, sampai",
    on: "tou",
    kun: "ita(ru)",
    steps:
      "Tulis bagian 至 di kiri: garis-garis mendatar dan tanah (土). Tulis bagian pisau (刂) di kanan.",
    words: [
      ["到着", "touchaku - kedatangan"],
      ["到達", "toutatsu - mencapai, sampai"],
      ["殺到", "sattou - membanjiri, berbondong-bondong"],
    ],
    level: "N3",
  },
  {
    char: "制",
    meaning: "Sistem, aturan",
    on: "sei",
    kun: "",
    steps:
      "Tulis bagian kiri menyerupai bentuk 未 dengan garis-garis. Tulis bagian pisau (刂) di kanan.",
    words: [
      ["制度", "seido - sistem"],
      ["制服", "seifuku - seragam"],
      ["制限", "seigen - batasan"],
    ],
    level: "N3",
  },
  {
    char: "刻",
    meaning: "Mengukir, waktu",
    on: "koku",
    kun: "kiza(mu)",
    steps: "Tulis bagian babi (亥) di kiri. Tulis bagian pisau (刂) di kanan.",
    words: [
      ["刻む", "kizamu - mengukir, mencincang"],
      ["時刻", "jikoku - waktu"],
      ["深刻", "shinkoku - serius, mendalam"],
    ],
    level: "N3",
  },
  {
    char: "割",
    meaning: "Membagi, memecah",
    on: "katsu",
    kun: "wa(ru)",
    steps:
      "Tulis bagian 害 di kiri: atap dan kotak mulut. Tulis bagian pisau (刂) di kanan.",
    words: [
      ["割る", "waru - membagi, memecahkan"],
      ["割合", "wariai - proporsi"],
      ["役割", "yakuwari - peran"],
    ],
    level: "N3",
  },
  {
    char: "加",
    meaning: "Menambah",
    on: "ka",
    kun: "kuwa(eru)",
    steps: "Tulis bagian tenaga (力) di kiri. Tulis kotak mulut (口) di kanan.",
    words: [
      ["加える", "kuwaeru - menambahkan"],
      ["参加", "sanka - partisipasi"],
      ["追加", "tsuika - tambahan"],
    ],
    level: "N3",
  },
  {
    char: "助",
    meaning: "Membantu",
    on: "jo",
    kun: "tasu(keru)",
    steps:
      "Tulis bagian 且 di kiri: kotak dan garis-garis bertumpuk. Tulis bagian tenaga (力) di kanan.",
    words: [
      ["助ける", "tasukeru - menolong"],
      ["助手", "joshu - asisten"],
      ["手助け", "tedasuke - bantuan"],
    ],
    level: "N3",
  },
  {
    char: "努",
    meaning: "Berusaha keras",
    on: "do",
    kun: "tsuto(meru)",
    steps:
      "Tulis bagian wanita (女) dan garis di kiri atas. Tulis bagian tenaga (力) di kanan bawah.",
    words: [
      ["努力", "doryoku - usaha"],
      ["努める", "tsutomeru - berusaha keras"],
      ["努力家", "doryokuka - orang yang gigih"],
    ],
    level: "N3",
  },
  {
    char: "労",
    meaning: "Kerja keras, jasa",
    on: "rou",
    kun: "itawa(ru)",
    steps:
      "Tulis dua titik api kecil di atas. Tutup dengan bagian tenaga (力) di bawah.",
    words: [
      ["労働", "roudou - kerja, buruh"],
      ["苦労", "kurou - kesulitan, kerja keras"],
      ["疲労", "hirou - kelelahan"],
    ],
    level: "N3",
  },
  {
    char: "務",
    meaning: "Tugas, kewajiban",
    on: "mu",
    kun: "tsuto(meru)",
    steps:
      "Tulis bagian kiri menyerupai 矛 dan 攵. Tulis bagian tenaga (力) di kanan bawah.",
    words: [
      ["務める", "tsutomeru - menjalankan tugas"],
      ["事務所", "jimusho - kantor"],
      ["業務", "gyoumu - tugas pekerjaan"],
    ],
    level: "N3",
  },
  {
    char: "勝",
    meaning: "Menang",
    on: "shou",
    kun: "ka(tsu)",
    steps:
      "Tulis bagian daging, bulan (月) di kiri. Tulis bagian kanan yang kompleks. Tutup dengan bagian tenaga (力) di bawah kanan.",
    words: [
      ["勝つ", "katsu - menang"],
      ["勝手", "katte - seenaknya, sesuka hati"],
      ["決勝", "kesshou - final pertandingan"],
    ],
    level: "N3",
  },
  {
    char: "勤",
    meaning: "Bekerja, rajin",
    on: "kin",
    kun: "tsuto(meru)",
    steps:
      "Tulis bagian 堇 di kiri: tanah dan garis-garis. Tulis bagian tenaga (力) di kanan.",
    words: [
      ["勤める", "tsutomeru - bekerja di"],
      ["通勤", "tsuukin - perjalanan ke tempat kerja"],
      ["勤務", "kinmu - dinas kerja"],
    ],
    level: "N3",
  },
  {
    char: "化",
    meaning: "Berubah",
    on: "ka",
    kun: "ba(keru)",
    steps:
      "Tulis sapuan orang (亻) di kiri. Tulis bagian 匕 di kanan: sapuan melengkung dengan kait.",
    words: [
      ["変化", "henka - perubahan"],
      ["文化", "bunka - budaya"],
      ["化ける", "bakeru - menjelma"],
    ],
    level: "N3",
  },
  {
    char: "単",
    meaning: "Tunggal, sederhana",
    on: "tan",
    kun: "hitoe",
    steps:
      "Tulis atap kecil dan garis-garis bertumpuk di atas. Tutup dengan garis mendatar panjang dan garis tegak di bawah.",
    words: [
      ["簡単", "kantan - mudah, sederhana"],
      ["単語", "tango - kosakata"],
      ["単に", "tanni - hanya, semata-mata"],
    ],
    level: "N3",
  },
  {
    char: "危",
    meaning: "Berbahaya",
    on: "ki",
    kun: "abu(nai)",
    steps:
      "Tulis sapuan melengkung dari atas ke kiri bawah membentuk tebing. Tulis bagian 已 kecil di dalamnya. Tutup dengan titik kecil di bawah.",
    words: [
      ["危ない", "abunai - berbahaya"],
      ["危険", "kiken - bahaya"],
      ["危機", "kiki - krisis"],
    ],
    level: "N3",
  },
  {
    char: "原",
    meaning: "Asal, padang",
    on: "gen",
    kun: "hara",
    steps:
      "Tulis atap tebing (厂) di kiri atas. Tulis bagian mata air (泉) sederhana di dalamnya: kotak kecil dan garis-garis.",
    words: [
      ["原因", "gen'in - penyebab"],
      ["原料", "genryou - bahan baku"],
      ["原っぱ", "harappa - padang rumput"],
    ],
    level: "N3",
  },
  {
    char: "参",
    meaning: "Ikut serta, datang",
    on: "san",
    kun: "mai(ru)",
    steps:
      "Tulis tiga garis pendek menyerupai bintang di kiri atas. Tulis bagian 大 di tengah. Tutup dengan tiga sapuan rambut (彡) di kanan.",
    words: [
      ["参加", "sanka - partisipasi"],
      ["参る", "mairu - datang, pergi (bentuk merendah)"],
      ["参考", "sankou - referensi"],
    ],
    level: "N3",
  },
  {
    char: "反",
    meaning: "Kebalikan, melawan",
    on: "han",
    kun: "so(ru)",
    steps:
      "Tulis atap tebing (厂) di kiri atas. Tutup dengan sapuan melengkung panjang dari kiri ke kanan bawah.",
    words: [
      ["反対", "hantai - berlawanan"],
      ["反応", "hannou - reaksi"],
      ["反る", "soru - melengkung, melentur"],
    ],
    level: "N3",
  },
  {
    char: "収",
    meaning: "Menerima, mengumpulkan",
    on: "shuu",
    kun: "osa(meru)",
    steps:
      "Tulis bagian 丩 di kiri: sapuan melengkung kecil. Tulis bagian tangan memukul (攵) di kanan.",
    words: [
      ["収入", "shuunyuu - pendapatan"],
      ["収める", "osameru - menyimpan, memasukkan"],
      ["回収", "kaishuu - pengumpulan kembali"],
    ],
    level: "N3",
  },
  {
    char: "取",
    meaning: "Mengambil",
    on: "shu",
    kun: "to(ru)",
    steps:
      "Tulis bagian telinga (耳) di kiri. Tulis bagian tangan (又) di kanan bawah.",
    words: [
      ["取る", "toru - mengambil"],
      ["取材", "shuzai - liputan, wawancara"],
      ["取り消す", "torikesu - membatalkan"],
    ],
    level: "N3",
  },
  {
    char: "受",
    meaning: "Menerima",
    on: "ju",
    kun: "u(keru)",
    steps:
      "Tulis bagian atas menyerupai cakar (爪). Tulis garis tengah menyerupai penutup. Tutup dengan bagian tangan (又) di bawah.",
    words: [
      ["受ける", "ukeru - menerima"],
      ["受付", "uketsuke - resepsionis, pendaftaran"],
      ["受験", "juken - ujian masuk"],
    ],
    level: "N3",
  },
  {
    char: "号",
    meaning: "Nomor, tanda",
    on: "gou",
    kun: "yobina",
    steps:
      "Tulis kotak mulut (口) di kiri atas. Tulis bagian melengkung dengan kait di kanan bawah.",
    words: [
      ["番号", "bangou - nomor"],
      ["信号", "shingou - lampu lalu lintas"],
      ["号令", "gourei - komando, aba-aba"],
    ],
    level: "N3",
  },
  {
    char: "合",
    meaning: "Cocok, bergabung",
    on: "gou",
    kun: "a(u)",
    steps:
      "Tulis atap kecil (人) di atas. Tulis garis mendatar di tengah. Tutup dengan kotak mulut (口) di bawah.",
    words: [
      ["合う", "au - cocok, sesuai"],
      ["場合", "baai - keadaan, situasi"],
      ["合格", "goukaku - lulus ujian"],
    ],
    level: "N3",
  },
  {
    char: "向",
    meaning: "Menghadap, arah",
    on: "kou",
    kun: "mu(ku)",
    steps:
      "Tulis atap kecil di atas. Tutup dengan kotak mulut (口) memanjang di bawahnya.",
    words: [
      ["向く", "muku - menghadap"],
      ["方向", "houkou - arah"],
      ["向こう", "mukou - seberang, sana"],
    ],
    level: "N3",
  },
  {
    char: "君",
    meaning: "Kamu, tuan",
    on: "kun",
    kun: "kimi",
    steps:
      "Tulis bagian atas menyerupai memerintah (尹): sapuan dan garis-garis. Tutup dengan kotak mulut (口) di bawah.",
    words: [
      ["君", "kimi - kamu (informal)"],
      ["君主", "kunshu - raja, penguasa"],
      ["諸君", "shokun - kalian sekalian (formal)"],
    ],
    level: "N3",
  },
  {
    char: "否",
    meaning: "Tidak, menolak",
    on: "hi",
    kun: "ina, iya",
    steps:
      "Tulis bagian tidak (不) di atas. Tutup dengan kotak mulut (口) di bawah.",
    words: [
      ["否定", "hitei - penyangkalan"],
      ["拒否", "kyohi - penolakan"],
      ["安否", "anpi - keadaan selamat, kabar"],
    ],
    level: "N3",
  },
  {
    char: "吸",
    meaning: "Menghisap, bernapas",
    on: "kyuu",
    kun: "su(u)",
    steps:
      "Tulis kotak mulut (口) di kiri. Tulis bagian 及 di kanan: sapuan melengkung dan garis kecil.",
    words: [
      ["吸う", "suu - menghisap, menghirup"],
      ["呼吸", "kokyuu - pernapasan"],
      ["吸収", "kyuushuu - penyerapan"],
    ],
    level: "N3",
  },
  {
    char: "吹",
    meaning: "Meniup",
    on: "sui",
    kun: "fu(ku)",
    steps:
      "Tulis kotak mulut (口) di kiri. Tulis bagian tidak, kurang (欠) di kanan.",
    words: [
      ["吹く", "fuku - meniup, bertiup"],
      ["吹雪", "fubuki - badai salju"],
      ["息吹", "ibuki - embusan, napas kehidupan"],
    ],
    level: "N3",
  },
  {
    char: "告",
    meaning: "Memberitahu, mengumumkan",
    on: "koku",
    kun: "tsu(geru)",
    steps:
      "Tulis bagian 牛 sederhana di atas. Tutup dengan kotak mulut (口) di bawah.",
    words: [
      ["告げる", "tsugeru - memberitahu"],
      ["報告", "houkoku - laporan"],
      ["広告", "koukoku - iklan"],
    ],
    level: "N3",
  },
  {
    char: "呼",
    meaning: "Memanggil",
    on: "ko",
    kun: "yo(bu)",
    steps:
      "Tulis kotak mulut (口) di kiri. Tulis bagian 乎 di kanan: sapuan-sapuan kecil bertumpuk.",
    words: [
      ["呼ぶ", "yobu - memanggil"],
      ["呼吸", "kokyuu - pernapasan"],
      ["呼び出す", "yobidasu - memanggil keluar"],
    ],
    level: "N3",
  },
  {
    char: "命",
    meaning: "Nyawa, perintah",
    on: "mei",
    kun: "inochi",
    steps:
      "Tulis atap kecil (人) di atas. Tulis garis mendatar dan sapuan kecil. Tutup dengan kotak mulut (口) dan kait di bawah.",
    words: [
      ["命", "inochi - nyawa"],
      ["命令", "meirei - perintah"],
      ["運命", "unmei - takdir"],
    ],
    level: "N3",
  },
  {
    char: "和",
    meaning: "Harmoni, gaya Jepang",
    on: "wa",
    kun: "yawa(ragu)",
    steps: "Tulis bagian padi (禾) di kiri. Tulis kotak mulut (口) di kanan.",
    words: [
      ["平和", "heiwa - perdamaian"],
      ["和食", "washoku - makanan Jepang"],
      ["和らぐ", "yawaragu - mereda"],
    ],
    level: "N3",
  },
  {
    char: "商",
    meaning: "Berdagang",
    on: "shou",
    kun: "akina(u)",
    steps:
      "Tulis atap kecil di atas. Tulis kotak mulut kecil di tengah. Tutup dengan bagian melengkung dan kotak mulut lagi di bawah.",
    words: [
      ["商品", "shouhin - barang dagangan"],
      ["商店", "shouten - toko"],
      ["商売", "shoubai - bisnis, perdagangan"],
    ],
    level: "N3",
  },
  {
    char: "喜",
    meaning: "Gembira, senang",
    on: "ki",
    kun: "yoroko(bu)",
    steps:
      "Tulis bagian aula (士 dan 冖) di atas dengan kotak mulut. Tutup dengan kotak mulut dan garis-garis di bawah.",
    words: [
      ["喜ぶ", "yorokobu - bergembira"],
      ["喜び", "yorokobi - kegembiraan"],
      ["大喜び", "ooyorokobi - sangat senang"],
    ],
    level: "N3",
  },
  {
    char: "回",
    meaning: "Kali, berputar",
    on: "kai",
    kun: "mawa(ru)",
    steps: "Tulis bingkai kotak besar. Tulis kotak kecil di dalamnya.",
    words: [
      ["回る", "mawaru - berputar"],
      ["今回", "konkai - kali ini"],
      ["回転", "kaiten - rotasi"],
    ],
    level: "N3",
  },
  {
    char: "因",
    meaning: "Sebab, faktor",
    on: "in",
    kun: "yo(ru)",
    steps: "Tulis bingkai kotak besar. Tulis bagian besar (大) di dalamnya.",
    words: [
      ["原因", "gen'in - penyebab"],
      ["因る", "yoru - disebabkan oleh"],
      ["因果", "inga - sebab akibat"],
    ],
    level: "N3",
  },
  {
    char: "困",
    meaning: "Kesulitan, bingung",
    on: "kon",
    kun: "koma(ru)",
    steps: "Tulis bingkai kotak besar. Tulis bagian pohon (木) di dalamnya.",
    words: [
      ["困る", "komaru - kesulitan, bingung"],
      ["困難", "konnan - kesulitan"],
      ["貧困", "hinkon - kemiskinan"],
    ],
    level: "N3",
  },
  {
    char: "園",
    meaning: "Taman, kebun",
    on: "en",
    kun: "sono",
    steps:
      "Tulis bingkai kotak besar mengelilingi. Tulis bagian 袁 di dalamnya: kotak kecil dan garis-garis pakaian.",
    words: [
      ["公園", "kouen - taman"],
      ["幼稚園", "youchien - taman kanak-kanak"],
      ["動物園", "doubutsuen - kebun binatang"],
    ],
    level: "N3",
  },
  {
    char: "在",
    meaning: "Berada, eksis",
    on: "zai",
    kun: "a(ru)",
    steps:
      "Tulis sapuan miring di kiri atas. Tulis garis tegak menembus. Tutup dengan bagian tanah (土) di bawah.",
    words: [
      ["存在", "sonzai - keberadaan"],
      ["現在", "genzai - saat ini"],
      ["在る", "aru - ada, berada"],
    ],
    level: "N3",
  },
  {
    char: "報",
    meaning: "Laporan, balasan",
    on: "hou",
    kun: "muku(iru)",
    steps:
      "Tulis bagian tanah, keberuntungan (幸) di kiri. Tulis bagian tangan menekuk di kanan.",
    words: [
      ["報告", "houkoku - laporan"],
      ["情報", "jouhou - informasi"],
      ["報道", "houdou - pemberitaan"],
    ],
    level: "N3",
  },
  {
    char: "増",
    meaning: "Bertambah",
    on: "zou",
    kun: "ma(su), fu(eru)",
    steps:
      "Tulis bagian tanah (土) di kiri. Tulis bagian 曽 di kanan: kotak-kotak dan garis-garis bertumpuk.",
    words: [
      ["増える", "fueru - bertambah"],
      ["増加", "zouka - peningkatan"],
      ["増す", "masu - meningkat"],
    ],
    level: "N3",
  },
  {
    char: "声",
    meaning: "Suara",
    on: "sei",
    kun: "koe",
    steps:
      "Tulis bagian atas menyerupai 士 dan sapuan melengkung. Tutup dengan bagian bawah menyerupai 又.",
    words: [
      ["声", "koe - suara"],
      ["大声", "oogoe - suara keras"],
      ["音声", "onsei - suara, audio"],
    ],
    level: "N3",
  },
  {
    char: "変",
    meaning: "Berubah, aneh",
    on: "hen",
    kun: "ka(waru)",
    steps:
      "Tulis atap kecil di atas dengan garis-garis. Tutup dengan bagian tangan (夂) di bawah.",
    words: [
      ["変わる", "kawaru - berubah"],
      ["変な", "henna - aneh"],
      ["大変", "taihen - berat, luar biasa"],
    ],
    level: "N3",
  },
  {
    char: "夢",
    meaning: "Mimpi",
    on: "mu",
    kun: "yume",
    steps:
      "Tulis bagian rumput (艹) di atas. Tulis bagian tengah kompleks menyerupai mata tertutup. Tutup dengan bagian malam (夕) di bawah.",
    words: [
      ["夢", "yume - mimpi"],
      ["夢見る", "yumemiru - bermimpi"],
      ["悪夢", "akumu - mimpi buruk"],
    ],
    level: "N3",
  },
  {
    char: "太",
    meaning: "Gemuk, tebal",
    on: "tai",
    kun: "futo(i)",
    steps:
      "Tulis bagian besar (大) di atas. Tutup dengan titik kecil di kanan bawah.",
    words: [
      ["太い", "futoi - tebal, gemuk"],
      ["太る", "futoru - menjadi gemuk"],
      ["太陽", "taiyou - matahari"],
    ],
    level: "N3",
  },
  {
    char: "夫",
    meaning: "Suami, pria",
    on: "fu",
    kun: "otto",
    steps:
      "Tulis dua garis mendatar sejajar. Tutup dengan sapuan kiri dan sapuan kanan menyilang di atas dan bawah.",
    words: [
      ["夫", "otto - suami"],
      ["夫婦", "fuufu - suami istri"],
      ["工夫", "kufuu - akal, siasat"],
    ],
    level: "N3",
  },
  {
    char: "失",
    meaning: "Kehilangan",
    on: "shitsu",
    kun: "ushina(u)",
    steps:
      "Tulis garis mendatar pendek di atas. Tulis garis tegak menembus. Tutup dengan sapuan kiri dan sapuan kanan melebar di bawah.",
    words: [
      ["失う", "ushinau - kehilangan"],
      ["失敗", "shippai - kegagalan"],
      ["失礼", "shitsurei - permisi, tidak sopan"],
    ],
    level: "N3",
  },
  {
    char: "好",
    meaning: "Suka",
    on: "kou",
    kun: "kono(mu), su(ku)",
    steps: "Tulis bagian wanita (女) di kiri. Tulis bagian anak (子) di kanan.",
    words: [
      ["好き", "suki - suka"],
      ["好む", "konomu - menyukai, gemar"],
      ["大好き", "daisuki - sangat suka"],
    ],
    level: "N3",
  },
  {
    char: "妻",
    meaning: "Istri",
    on: "sai",
    kun: "tsuma",
    steps:
      "Tulis garis-garis bertumpuk di atas menyerupai rambut. Tutup dengan bagian wanita (女) di bawah.",
    words: [
      ["妻", "tsuma - istri"],
      ["夫妻", "fusai - suami istri"],
      ["人妻", "hitozuma - istri orang"],
    ],
    level: "N3",
  },
  {
    char: "娘",
    meaning: "Anak perempuan",
    on: "jou",
    kun: "musume",
    steps:
      "Tulis bagian wanita (女) di kiri. Tulis bagian 良 di kanan: titik dan garis-garis.",
    words: [
      ["娘", "musume - anak perempuan"],
      ["娘さん", "musumesan - putri (panggilan sopan)"],
      ["一人娘", "hitorimusume - anak perempuan tunggal"],
    ],
    level: "N3",
  },
  {
    char: "婚",
    meaning: "Pernikahan",
    on: "kon",
    kun: "",
    steps:
      "Tulis bagian wanita (女) di kiri. Tulis bagian 昏 di kanan: matahari (日) dan garis-garis di bawahnya.",
    words: [
      ["結婚", "kekkon - pernikahan"],
      ["婚約", "kon'yaku - pertunangan"],
      ["離婚", "rikon - perceraian"],
    ],
    level: "N3",
  },
  {
    char: "婦",
    meaning: "Wanita, istri",
    on: "fu",
    kun: "yome",
    steps: "Tulis bagian wanita (女) di kiri. Tulis bagian sapu (帚) di kanan.",
    words: [
      ["主婦", "shufu - ibu rumah tangga"],
      ["夫婦", "fuufu - suami istri"],
      ["婦人", "fujin - wanita"],
    ],
    level: "N3",
  },
  {
    char: "存",
    meaning: "Ada, menyimpan",
    on: "son, zon",
    kun: "",
    steps:
      "1. Tulis bagian atas menyerupai radikal bakat (才) yang dimodifikasi: garis mendatar dan sapuan menyilang.  2. Tutup dengan radikal anak (子) di bagian bawah.",
    words: [
      ["存在", "sonzai - keberadaan"],
      ["ご存知", "gozonji - mengetahui (bentuk hormat)"],
      ["保存", "hozon - penyimpanan"],
    ],
    level: "N3",
  },
  {
    char: "宅",
    meaning: "Rumah, kediaman",
    on: "taku",
    kun: "",
    steps:
      "1. Tulis atap rumah (宀) di bagian atas.  2. Tutup dengan bagian bawah yang menyerupai sapuan melengkung dengan garis pendek.",
    words: [
      ["自宅", "jitaku - rumah sendiri"],
      ["宅配", "takuhai - pengiriman ke rumah"],
      ["お宅", "otaku - rumah Anda"],
    ],
    level: "N3",
  },
  {
    char: "守",
    meaning: "Menjaga, melindungi",
    on: "shu, su",
    kun: "mamo(ru)",
    steps:
      "1. Tulis atap rumah (宀) di atas.  2. Tutup dengan radikal ukuran (寸) di bawah: garis mendatar, garis tegak, dan titik.",
    words: [
      ["守る", "mamoru - menjaga, melindungi"],
      ["留守", "rusu - sedang tidak ada di rumah"],
      ["保守", "hoshu - pemeliharaan, konservatif"],
    ],
    level: "N3",
  },
  {
    char: "完",
    meaning: "Selesai, sempurna",
    on: "kan",
    kun: "",
    steps:
      "1. Tulis atap rumah (宀) di atas.  2. Tutup dengan bagian 元 di bawah: dua garis mendatar dan sapuan melengkung berkait.",
    words: [
      ["完成", "kansei - penyelesaian"],
      ["完全", "kanzen - sempurna"],
      ["未完", "mikan - belum selesai"],
    ],
    level: "N3",
  },
  {
    char: "官",
    meaning: "Pejabat, organ",
    on: "kan",
    kun: "",
    steps:
      "1. Tulis atap rumah (宀) di atas.  2. Tutup dengan dua bentuk kotak kecil bersusun di bawahnya.",
    words: [
      ["警官", "keikan - polisi"],
      ["官僚", "kanryou - birokrat"],
      ["器官", "kikan - organ tubuh"],
    ],
    level: "N3",
  },
  {
    char: "定",
    meaning: "Menetapkan, memastikan",
    on: "tei, jou",
    kun: "sada(meru)",
    steps:
      "1. Tulis atap rumah (宀) di atas.  2. Tutup dengan bagian 正 (benar) di bawah: garis mendatar, kotak kecil, dan garis penutup.",
    words: [
      ["予定", "yotei - jadwal, rencana"],
      ["決定", "kettei - keputusan"],
      ["定める", "sadameru - menetapkan"],
    ],
    level: "N3",
  },
  {
    char: "実",
    meaning: "Kenyataan, buah, isi",
    on: "jitsu",
    kun: "mi, mino(ru)",
    steps:
      "1. Tulis atap rumah (宀) di atas.  2. Tulis garis mendatar di tengah.  3. Tutup dengan bentuk 大 (besar) di bagian bawah.",
    words: [
      ["事実", "jijitsu - fakta"],
      ["実は", "jitsuha - sebenarnya"],
      ["実る", "minoru - berbuah"],
    ],
    level: "N3",
  },
  {
    char: "客",
    meaning: "Tamu, pelanggan",
    on: "kyaku",
    kun: "",
    steps:
      "1. Tulis atap rumah (宀) di atas.  2. Tutup dengan bagian 各 di bawah: sapuan kecil dan kotak mulut (口).",
    words: [
      ["お客さん", "okyakusan - pelanggan, tamu"],
      ["客室", "kyakushitsu - kamar tamu"],
      ["乗客", "joukyaku - penumpang"],
    ],
    level: "N3",
  },
  {
    char: "害",
    meaning: "Bahaya, kerugian",
    on: "gai",
    kun: "",
    steps:
      "1. Tulis atap rumah (宀) di atas.  2. Tulis beberapa garis mendatar pendek di tengah.  3. Tutup dengan kotak mulut (口) di bawah.",
    words: [
      ["被害", "higai - kerugian, korban"],
      ["公害", "kougai - polusi"],
      ["害虫", "gaichuu - serangga hama"],
    ],
    level: "N3",
  },
  {
    char: "容",
    meaning: "Wadah, penampilan",
    on: "you",
    kun: "i(reru)",
    steps:
      "1. Tulis atap rumah (宀) di atas.  2. Tutup dengan bagian lembah (谷) di bawah.",
    words: [
      ["内容", "naiyou - isi"],
      ["容器", "youki - wadah"],
      ["美容", "biyou - kecantikan"],
    ],
    level: "N3",
  },
  {
    char: "宿",
    meaning: "Penginapan, menginap",
    on: "shuku",
    kun: "yado",
    steps:
      "1. Tulis atap rumah (宀) di atas.  2. Tulis sapuan orang (亻) di kiri bawah.  3. Tutup dengan bagian 百 (seratus) di kanan bawah.",
    words: [
      ["宿題", "shukudai - pekerjaan rumah"],
      ["宿", "yado - penginapan"],
      ["民宿", "minshuku - penginapan keluarga"],
    ],
    level: "N3",
  },
  {
    char: "寄",
    meaning: "Mendekat, singgah",
    on: "ki",
    kun: "yo(ru)",
    steps:
      "1. Tulis atap rumah (宀) di atas.  2. Tutup dengan bagian 奇 di bawah: garis besar dan sapuan kaki.",
    words: [
      ["寄る", "yoru - mendekat, singgah"],
      ["寄付", "kifu - sumbangan"],
      ["最寄り", "moyori - terdekat"],
    ],
    level: "N3",
  },
  {
    char: "富",
    meaning: "Kekayaan, kaya",
    on: "fu",
    kun: "to(mu)",
    steps:
      "1. Tulis atap rumah (宀) di atas.  2. Tutup dengan bagian 畐 di bawah, menyerupai kotak sawah (田) di atas titik dan garis.",
    words: [
      ["豊富", "houfu - berlimpah"],
      ["富む", "tomu - kaya, berlimpah"],
      ["富士山", "fujisan - Gunung Fuji"],
    ],
    level: "N3",
  },
  {
    char: "寒",
    meaning: "Dingin",
    on: "kan",
    kun: "samu(i)",
    steps:
      "1. Tulis atap rumah (宀) di atas.  2. Tulis beberapa garis mendatar sejajar di tengah menyerupai jerami.  3. Tutup dengan dua titik es (冫) di bawah.",
    words: [
      ["寒い", "samui - dingin"],
      ["寒気", "kanki - hawa dingin, menggigil"],
      ["寒帯", "kantai - zona dingin"],
    ],
    level: "N3",
  },
  {
    char: "寝",
    meaning: "Tidur, berbaring",
    on: "shin",
    kun: "ne(ru)",
    steps:
      "1. Tulis atap rumah (宀) di atas.  2. Tulis radikal ranjang (爿) di kiri bawah.  3. Tutup dengan sapuan-sapuan pendek di kanan bawah.",
    words: [
      ["寝る", "neru - tidur"],
      ["寝室", "shinshitsu - kamar tidur"],
      ["昼寝", "hirune - tidur siang"],
    ],
    level: "N3",
  },
  {
    char: "察",
    meaning: "Menduga, memeriksa",
    on: "satsu",
    kun: "",
    steps:
      "1. Tulis atap rumah (宀) di atas.  2. Tutup dengan bagian 祭 (upacara) di bawah: beberapa sapuan dan radikal tangan.",
    words: [
      ["警察", "keisatsu - polisi"],
      ["観察", "kansatsu - observasi"],
      ["察する", "sassuru - menduga, memahami"],
    ],
    level: "N3",
  },
  {
    char: "対",
    meaning: "Berhadapan, lawan",
    on: "tai, tsui",
    kun: "",
    steps:
      "1. Tulis bagian kiri menyerupai kotak kecil dengan garis-garis pendek.  2. Tutup dengan radikal ukuran (寸) di kanan: garis mendatar, tegak, dan titik.",
    words: [
      ["反対", "hantai - lawan, menentang"],
      ["対策", "taisaku - langkah penanggulangan"],
      ["一対", "ittsui - sepasang"],
    ],
    level: "N3",
  },
  {
    char: "局",
    meaning: "Kantor, bagian",
    on: "kyoku",
    kun: "",
    steps:
      "1. Tulis radikal atap miring (尸) di kiri atas.  2. Tulis kotak mulut (口) di dalamnya.  3. Tutup dengan sapuan berkait menembus ke bawah.",
    words: [
      ["郵便局", "yuubinkyoku - kantor pos"],
      ["薬局", "yakkyoku - apotek"],
      ["結局", "kekkyoku - pada akhirnya"],
    ],
    level: "N3",
  },
  {
    char: "居",
    meaning: "Berada, tinggal",
    on: "kyo",
    kun: "i(ru)",
    steps:
      "1. Tulis radikal atap miring (尸) di atas.  2. Tutup dengan bagian 古 (lama) di bawah: kotak mulut (口) dan garis mendatar di atasnya.",
    words: [
      ["居る", "iru - berada, ada"],
      ["住居", "juukyo - tempat tinggal"],
      ["居間", "ima - ruang keluarga"],
    ],
    level: "N3",
  },
  {
    char: "差",
    meaning: "Perbedaan, selisih",
    on: "sa",
    kun: "sa(su)",
    steps:
      "1. Tulis bagian atas menyerupai domba (羊) yang disederhanakan.  2. Tutup dengan radikal kerja (工) di bawah.",
    words: [
      ["差", "sa - selisih"],
      ["差別", "sabetsu - diskriminasi"],
      ["時差", "jisa - perbedaan waktu"],
    ],
    level: "N3",
  },
  {
    char: "市",
    meaning: "Kota, pasar",
    on: "shi",
    kun: "ichi",
    steps:
      "1. Tulis titik dan garis mendatar kecil (atap) di atas.  2. Tutup dengan radikal kain (巾) di bawah: garis tegak dan dua sapuan turun.",
    words: [
      ["市", "shi - kota"],
      ["市場", "ichiba - pasar"],
      ["都市", "toshi - kota besar"],
    ],
    level: "N3",
  },
  {
    char: "師",
    meaning: "Guru, ahli",
    on: "shi",
    kun: "",
    steps:
      "1. Tulis bagian kiri menyerupai tumpukan kecil bersusun.  2. Tutup dengan radikal kain (巾) di kanan.",
    words: [
      ["教師", "kyoushi - guru"],
      ["医師", "ishi - dokter"],
      ["師匠", "shishou - guru seni/kerajinan"],
    ],
    level: "N3",
  },
  {
    char: "席",
    meaning: "Tempat duduk",
    on: "seki",
    kun: "",
    steps:
      "1. Tulis atap miring (广) di kiri atas.  2. Tulis garis mendatar kecil di tengah.  3. Tutup dengan radikal kain (巾) di bawah.",
    words: [
      ["席", "seki - kursi, tempat duduk"],
      ["出席", "shusseki - kehadiran"],
      ["座席", "zaseki - tempat duduk"],
    ],
    level: "N3",
  },
  {
    char: "常",
    meaning: "Biasa, selalu",
    on: "jou",
    kun: "tsune",
    steps:
      "1. Tulis bagian atas menyerupai 尚 (atap kecil dan kotak mulut).  2. Tutup dengan radikal kain (巾) di bagian bawah.",
    words: [
      ["日常", "nichijou - sehari-hari"],
      ["非常に", "hijouni - sangat"],
      ["常に", "tsuneni - selalu"],
    ],
    level: "N3",
  },
  {
    char: "平",
    meaning: "Rata, damai",
    on: "hei",
    kun: "tai(ra), hira",
    steps:
      "1. Tulis titik kecil di kiri dan kanan atas.  2. Tulis garis mendatar panjang di tengah.  3. Tutup dengan garis tegak lurus ke bawah menembus garis mendatar.",
    words: [
      ["平和", "heiwa - perdamaian"],
      ["平日", "heijitsu - hari kerja"],
      ["平ら", "taira - rata, datar"],
    ],
    level: "N3",
  },
  {
    char: "幸",
    meaning: "Bahagia, beruntung",
    on: "kou",
    kun: "shiawa(se)",
    steps:
      "1. Tulis garis mendatar dan tegak menyilang di atas.  2. Tambahkan garis mendatar di tengah.  3. Tutup dengan garis tegak panjang menembus ke bawah dengan sapuan silang.",
    words: [
      ["幸せ", "shiawase - bahagia"],
      ["幸運", "kouun - keberuntungan"],
      ["不幸", "fukou - kemalangan"],
    ],
    level: "N3",
  },
  {
    char: "幾",
    meaning: "Berapa, beberapa",
    on: "ki",
    kun: "iku",
    steps:
      "1. Tulis dua bentuk benang kecil (幺幺) sejajar di kiri atas.  2. Tulis radikal manusia kecil di tengah.  3. Tutup dengan radikal tombak (戈) di kanan bawah.",
    words: [
      ["幾つ", "ikutsu - berapa banyak"],
      ["幾ら", "ikura - berapa harga"],
      ["幾日", "ikunichi - berapa hari"],
    ],
    level: "N3",
  },
  {
    char: "座",
    meaning: "Duduk, tempat duduk",
    on: "za",
    kun: "suwa(ru)",
    steps:
      "1. Tulis atap miring (广) di kiri atas.  2. Tulis dua sapuan kecil menyerupai orang duduk di tengah.  3. Tutup dengan radikal tanah (土) di bawah.",
    words: [
      ["座る", "suwaru - duduk"],
      ["座席", "zaseki - tempat duduk"],
      ["星座", "seiza - rasi bintang"],
    ],
    level: "N3",
  },
  {
    char: "庭",
    meaning: "Halaman, kebun",
    on: "tei",
    kun: "niwa",
    steps:
      "1. Tulis atap miring (广) di kiri atas.  2. Tutup dengan bagian 廷 di dalamnya: garis-garis dan sapuan melangkah.",
    words: [
      ["庭", "niwa - halaman, taman"],
      ["家庭", "katei - keluarga, rumah tangga"],
      ["庭園", "teien - taman"],
    ],
    level: "N3",
  },
  {
    char: "式",
    meaning: "Upacara, cara, rumus",
    on: "shiki",
    kun: "",
    steps:
      "1. Tulis bagian 弋 di kiri: sapuan miring dan garis menyilang.  2. Tutup dengan radikal kerja (工) di kanan.",
    words: [
      ["式", "shiki - upacara"],
      ["結婚式", "kekkonshiki - upacara pernikahan"],
      ["方式", "houshiki - metode, cara"],
    ],
    level: "N3",
  },
  {
    char: "引",
    meaning: "Menarik",
    on: "in",
    kun: "hi(ku)",
    steps:
      "1. Tulis radikal busur (弓) di kiri.  2. Tutup dengan garis tegak lurus di kanan.",
    words: [
      ["引く", "hiku - menarik"],
      ["引っ越し", "hikkoshi - pindah rumah"],
      ["割引", "waribiki - diskon"],
    ],
    level: "N3",
  },
  {
    char: "当",
    meaning: "Kena, tepat, wajar",
    on: "tou",
    kun: "a(taru)",
    steps:
      "1. Tulis dua sapuan kecil menyerupai atap di atas.  2. Tutup dengan bentuk menyerupai huruf ヨ di bawah.",
    words: [
      ["本当", "hontou - benar, sungguhan"],
      ["当たる", "ataru - kena, tepat"],
      ["当然", "touzen - tentu saja, wajar"],
    ],
    level: "N3",
  },
  {
    char: "形",
    meaning: "Bentuk, wujud",
    on: "kei, gyou",
    kun: "katachi",
    steps:
      "1. Tulis bagian kiri menyerupai 开: dua garis tegak dan garis mendatar.  2. Tutup dengan tiga sapuan melengkung pendek (彡) di kanan.",
    words: [
      ["形", "katachi - bentuk"],
      ["人形", "ningyou - boneka"],
      ["形式", "keishiki - format, formalitas"],
    ],
    level: "N3",
  },
  {
    char: "役",
    meaning: "Peran, tugas, jabatan",
    on: "yaku, eki",
    kun: "",
    steps:
      "1. Tulis radikal langkah kecil (彳) di kiri.  2. Tutup dengan bagian 殳 di kanan: garis-garis dan sapuan berkait dengan tangan (又) di bawah.",
    words: [
      ["役に立つ", "yakunitatsu - berguna"],
      ["役者", "yakusha - aktor"],
      ["市役所", "shiyakusho - balai kota"],
    ],
    level: "N3",
  },
  {
    char: "彼",
    meaning: "Dia (laki-laki), itu",
    on: "hi",
    kun: "kare",
    steps:
      "1. Tulis radikal langkah kecil (彳) di kiri.  2. Tutup dengan bagian kulit (皮) di kanan.",
    words: [
      ["彼", "kare - dia (laki-laki), pacar"],
      ["彼女", "kanojo - dia (perempuan), pacar"],
      ["彼氏", "kareshi - pacar laki-laki"],
    ],
    level: "N3",
  },
  {
    char: "徒",
    meaning: "Pejalan kaki, murid",
    on: "to",
    kun: "",
    steps:
      "1. Tulis radikal langkah kecil (彳) di kiri.  2. Tulis radikal tanah (土) di kanan atas.  3. Tutup dengan bagian kaki (疋) di kanan bawah.",
    words: [
      ["生徒", "seito - siswa"],
      ["徒歩", "toho - berjalan kaki"],
      ["信徒", "shinto - penganut agama"],
    ],
    level: "N3",
  },
  {
    char: "得",
    meaning: "Mendapat, untung",
    on: "toku",
    kun: "e(ru)",
    steps:
      "1. Tulis radikal langkah kecil (彳) di kiri.  2. Tulis bagian 旦 di kanan atas: kotak matahari (日) di atas garis mendatar.  3. Tutup dengan radikal ukuran (寸) di kanan bawah.",
    words: [
      ["得る", "eru - mendapatkan"],
      ["得意", "tokui - mahir, kesukaan"],
      ["納得", "nattoku - memahami, menyetujui"],
    ],
    level: "N3",
  },
  {
    char: "御",
    meaning: "Penghormatan (awalan)",
    on: "go",
    kun: "o",
    steps:
      "1. Tulis radikal langkah kecil (彳) di kiri.  2. Tulis bagian 午 di tengah atas.  3. Tutup dengan radikal segel (卩) di kanan bawah.",
    words: [
      ["御飯", "gohan - nasi"],
      ["御礼", "orei - ucapan terima kasih"],
      ["制御", "seigyo - kontrol"],
    ],
    level: "N3",
  },
  {
    char: "必",
    meaning: "Pasti, harus",
    on: "hitsu",
    kun: "kanara(zu)",
    steps:
      "1. Tulis titik kecil di atas.  2. Tulis radikal hati (心) di bawah: sapuan melengkung dan tiga titik.  3. Tambahkan sapuan menyilang panjang dari kiri atas ke kanan bawah.",
    words: [
      ["必ず", "kanarazu - pasti"],
      ["必要", "hitsuyou - perlu"],
      ["必死", "hisshi - mati-matian"],
    ],
    level: "N3",
  },
  {
    char: "忘",
    meaning: "Lupa",
    on: "bou",
    kun: "wasu(reru)",
    steps:
      "1. Tulis bagian 亡 di atas: atap kecil dan sapuan melengkung.  2. Tutup dengan radikal hati (心) di bawah.",
    words: [
      ["忘れる", "wasureru - lupa"],
      ["忘れ物", "wasuremono - barang tertinggal"],
      ["備忘録", "bibouroku - catatan pengingat"],
    ],
    level: "N3",
  },
  {
    char: "忙",
    meaning: "Sibuk",
    on: "bou",
    kun: "isoga(shii)",
    steps:
      "1. Tulis radikal hati tegak (忄) di kiri.  2. Tutup dengan bagian 亡 di kanan.",
    words: [
      ["忙しい", "isogashii - sibuk"],
      ["多忙", "tabou - sangat sibuk"],
      ["忙しさ", "isogashisa - tingkat kesibukan"],
    ],
    level: "N3",
  },
  {
    char: "念",
    meaning: "Perhatian, pikiran",
    on: "nen",
    kun: "",
    steps:
      "1. Tulis bagian 今 di atas: atap kecil dan sapuan orang.  2. Tutup dengan radikal hati (心) di bawah.",
    words: [
      ["残念", "zannen - sayang sekali"],
      ["記念", "kinen - kenangan, peringatan"],
      ["念のため", "nennotame - untuk berjaga-jaga"],
    ],
    level: "N3",
  },
  {
    char: "怒",
    meaning: "Marah",
    on: "do",
    kun: "oko(ru)",
    steps:
      "1. Tulis bagian 奴 di atas: radikal perempuan (女) dan tangan (又).  2. Tutup dengan radikal hati (心) di bawah.",
    words: [
      ["怒る", "okoru - marah"],
      ["怒り", "ikari - kemarahan"],
      ["激怒", "gekido - murka"],
    ],
    level: "N3",
  },
  {
    char: "怖",
    meaning: "Takut, menyeramkan",
    on: "fu",
    kun: "kowa(i)",
    steps:
      "1. Tulis radikal hati tegak (忄) di kiri.  2. Tutup dengan bagian kain (布) di kanan.",
    words: [
      ["怖い", "kowai - menakutkan"],
      ["怖がる", "kowagaru - merasa takut"],
      ["恐怖", "kyoufu - ketakutan"],
    ],
    level: "N3",
  },
  {
    char: "性",
    meaning: "Sifat, jenis kelamin",
    on: "sei",
    kun: "",
    steps:
      "1. Tulis radikal hati tegak (忄) di kiri.  2. Tutup dengan bagian 生 (hidup) di kanan.",
    words: [
      ["性格", "seikaku - kepribadian"],
      ["女性", "josei - perempuan"],
      ["可能性", "kanousei - kemungkinan"],
    ],
    level: "N3",
  },
  {
    char: "恐",
    meaning: "Takut, khawatir",
    on: "kyou",
    kun: "oso(reru), kowa(i)",
    steps:
      "1. Tulis bagian atas menyerupai radikal kerja (工) dan tangan yang dimodifikasi.  2. Tutup dengan radikal hati (心) di bawah.",
    words: [
      ["恐い", "kowai - menakutkan"],
      ["恐ろしい", "osoroshii - mengerikan"],
      ["恐怖", "kyoufu - ketakutan"],
    ],
    level: "N3",
  },
  {
    char: "恥",
    meaning: "Malu",
    on: "chi",
    kun: "ha(zukashii)",
    steps:
      "1. Tulis radikal telinga (耳) di kiri.  2. Tutup dengan radikal hati (心) di kanan.",
    words: [
      ["恥ずかしい", "hazukashii - malu"],
      ["恥", "haji - rasa malu"],
      ["恥じる", "hajiru - merasa malu"],
    ],
    level: "N3",
  },
  {
    char: "息",
    meaning: "Napas",
    on: "soku",
    kun: "iki",
    steps:
      "1. Tulis bagian 自 (hidung, diri) di atas.  2. Tutup dengan radikal hati (心) di bawah.",
    words: [
      ["息", "iki - napas"],
      ["息子", "musuko - anak laki-laki"],
      ["休息", "kyuusoku - istirahat"],
    ],
    level: "N3",
  },
  {
    char: "悲",
    meaning: "Sedih",
    on: "hi",
    kun: "kana(shii)",
    steps:
      "1. Tulis bagian 非 di atas: dua kelompok garis sejajar berlawanan arah.  2. Tutup dengan radikal hati (心) di bawah.",
    words: [
      ["悲しい", "kanashii - sedih"],
      ["悲しみ", "kanashimi - kesedihan"],
      ["悲劇", "higeki - tragedi"],
    ],
    level: "N3",
  },
  {
    char: "情",
    meaning: "Perasaan, keadaan",
    on: "jou, sei",
    kun: "",
    steps:
      "1. Tulis radikal hati tegak (忄) di kiri.  2. Tutup dengan bagian 青 (biru) di kanan.",
    words: [
      ["感情", "kanjou - perasaan, emosi"],
      ["情報", "jouhou - informasi"],
      ["事情", "jijou - keadaan, situasi"],
    ],
    level: "N3",
  },
  {
    char: "想",
    meaning: "Pikiran, gagasan",
    on: "sou",
    kun: "",
    steps:
      "1. Tulis bagian 相 di atas: radikal pohon (木) dan mata (目).  2. Tutup dengan radikal hati (心) di bawah.",
    words: [
      ["予想", "yosou - prediksi"],
      ["感想", "kansou - kesan, pendapat"],
      ["理想", "risou - ideal, cita-cita"],
    ],
    level: "N3",
  },
  {
    char: "愛",
    meaning: "Cinta, kasih sayang",
    on: "ai",
    kun: "",
    steps:
      "1. Tulis radikal cakar kecil (爪) di atas.  2. Tulis penutup kecil dan radikal hati (心) di tengah.  3. Tutup dengan sapuan kaki melangkah di bawah.",
    words: [
      ["愛", "ai - cinta"],
      ["恋愛", "ren'ai - percintaan"],
      ["愛する", "aisuru - mencintai"],
    ],
    level: "N3",
  },
  {
    char: "感",
    meaning: "Perasaan, kesan",
    on: "kan",
    kun: "",
    steps:
      "1. Tulis bagian 咸 di atas: garis-garis, kotak mulut (口), dan sapuan.  2. Tutup dengan radikal hati (心) di bawah.",
    words: [
      ["感じる", "kanjiru - merasakan"],
      ["感動", "kandou - terharu, tersentuh"],
      ["感謝", "kansha - rasa terima kasih"],
    ],
    level: "N3",
  },
  {
    char: "慣",
    meaning: "Terbiasa",
    on: "kan",
    kun: "na(reru)",
    steps:
      "1. Tulis radikal hati tegak (忄) di kiri.  2. Tutup dengan bagian 貫 di kanan: kotak jaring di atas radikal uang kerang (貝).",
    words: [
      ["慣れる", "nareru - terbiasa"],
      ["習慣", "shuukan - kebiasaan"],
      ["慣用句", "kan'youku - ungkapan idiom"],
    ],
    level: "N3",
  },
  {
    char: "成",
    meaning: "Menjadi, tercapai",
    on: "sei",
    kun: "na(ru)",
    steps:
      "1. Tulis sapuan melengkung dari kiri atas.  2. Tambahkan garis mendatar dan tegak di tengah.  3. Tutup dengan sapuan miring panjang dan titik di kanan bawah.",
    words: [
      ["成功", "seikou - keberhasilan"],
      ["成長", "seichou - pertumbuhan"],
      ["成る", "naru - menjadi, terwujud"],
    ],
    level: "N3",
  },
  {
    char: "戦",
    meaning: "Perang, pertandingan",
    on: "sen",
    kun: "tataka(u)",
    steps:
      "1. Tulis bagian 単 di kiri: garis-garis dan kotak kecil bersusun.  2. Tutup dengan radikal tombak (戈) di kanan.",
    words: [
      ["戦争", "sensou - perang"],
      ["戦う", "tatakau - bertarung"],
      ["挑戦", "chousen - tantangan"],
    ],
    level: "N3",
  },
  {
    char: "戻",
    meaning: "Kembali",
    on: "rei",
    kun: "modo(ru), modo(su)",
    steps:
      "1. Tulis radikal pintu (戸) di atas.  2. Tutup dengan sapuan menyilang kecil di bawah, menyerupai 大 dengan titik.",
    words: [
      ["戻る", "modoru - kembali"],
      ["戻す", "modosu - mengembalikan"],
      ["払い戻し", "haraimodoshi - pengembalian uang"],
    ],
    level: "N3",
  },
  {
    char: "所",
    meaning: "Tempat",
    on: "sho",
    kun: "tokoro",
    steps:
      "1. Tulis radikal pintu (戸) di kiri.  2. Tutup dengan radikal kapak (斤) di kanan.",
    words: [
      ["場所", "basho - tempat"],
      ["台所", "daidokoro - dapur"],
      ["住所", "juusho - alamat"],
    ],
    level: "N3",
  },
  {
    char: "才",
    meaning: "Umur (tahun), bakat",
    on: "sai",
    kun: "",
    steps:
      "1. Tulis garis mendatar pendek di atas.  2. Tarik garis tegak dengan kait ke bawah.  3. Tutup dengan sapuan miring dari kiri atas ke kanan bawah.",
    words: [
      ["才能", "sainou - bakat"],
      ["天才", "tensai - jenius"],
      ["二十才", "nijissai - 20 tahun (usia)"],
    ],
    level: "N3",
  },
  {
    char: "打",
    meaning: "Memukul",
    on: "da",
    kun: "u(tsu)",
    steps:
      "1. Tulis radikal tangan (扌) di kiri.  2. Tutup dengan bagian 丁 di kanan: garis mendatar dan garis tegak berkait.",
    words: [
      ["打つ", "utsu - memukul"],
      ["打撃", "dageki - pukulan, dampak"],
      ["打ち合わせ", "uchiawase - pertemuan persiapan"],
    ],
    level: "N3",
  },
  {
    char: "払",
    meaning: "Membayar",
    on: "futsu",
    kun: "hara(u)",
    steps:
      "1. Tulis radikal tangan (扌) di kiri.  2. Tutup dengan bentuk melengkung kecil (厶) di kanan.",
    words: [
      ["払う", "harau - membayar"],
      ["支払い", "shiharai - pembayaran"],
      ["現金払い", "genkinbarai - pembayaran tunai"],
    ],
    level: "N3",
  },
  {
    char: "投",
    meaning: "Melempar",
    on: "tou",
    kun: "na(geru)",
    steps:
      "1. Tulis radikal tangan (扌) di kiri.  2. Tutup dengan bagian 殳 di kanan: garis-garis dan sapuan berkait dengan tangan (又) di bawah.",
    words: [
      ["投げる", "nageru - melempar"],
      ["投票", "touhyou - pemungutan suara"],
      ["投資", "toushi - investasi"],
    ],
    level: "N3",
  },
  {
    char: "折",
    meaning: "Melipat, mematahkan",
    on: "setsu",
    kun: "o(ru)",
    steps:
      "1. Tulis radikal tangan (扌) di kiri.  2. Tutup dengan radikal kapak (斤) di kanan.",
    words: [
      ["折る", "oru - melipat, mematahkan"],
      ["折り紙", "origami - seni melipat kertas"],
      ["骨折", "kossetsu - patah tulang"],
    ],
    level: "N3",
  },
  {
    char: "抜",
    meaning: "Mencabut",
    on: "batsu",
    kun: "nu(ku)",
    steps:
      "1. Tulis radikal tangan (扌) di kiri.  2. Tutup dengan bagian 犮 di kanan: sapuan silang dan titik kecil.",
    words: [
      ["抜く", "nuku - mencabut"],
      ["追い抜く", "oinuku - menyalip"],
      ["抜群", "batsugun - luar biasa"],
    ],
    level: "N3",
  },
  {
    char: "抱",
    meaning: "Memeluk, memegang",
    on: "hou",
    kun: "da(ku), kaka(eru)",
    steps:
      "1. Tulis radikal tangan (扌) di kiri.  2. Tutup dengan bagian 包 (membungkus) di kanan.",
    words: [
      ["抱く", "daku - memeluk"],
      ["抱える", "kakaeru - memegang, menanggung"],
      ["抱負", "houfu - cita-cita, resolusi"],
    ],
    level: "N3",
  },
  {
    char: "押",
    meaning: "Mendorong, menekan",
    on: "ou",
    kun: "o(su)",
    steps:
      "1. Tulis radikal tangan (扌) di kiri.  2. Tutup dengan bagian 甲 di kanan: kotak dengan garis tegak menembus ke bawah.",
    words: [
      ["押す", "osu - mendorong, menekan"],
      ["押し入れ", "oshiire - lemari benam ala Jepang"],
      ["押収", "oushuu - penyitaan"],
    ],
    level: "N3",
  },
  {
    char: "招",
    meaning: "Mengundang",
    on: "shou",
    kun: "mane(ku)",
    steps:
      "1. Tulis radikal tangan (扌) di kiri.  2. Tutup dengan bagian 召 di kanan: sapuan pedang (刀) di atas kotak mulut (口).",
    words: [
      ["招く", "maneku - mengundang"],
      ["招待", "shoutai - undangan"],
      ["招集", "shoushuu - pemanggilan, rapat"],
    ],
    level: "N3",
  },
  {
    char: "指",
    meaning: "Jari, menunjuk",
    on: "shi",
    kun: "yubi",
    steps:
      "1. Tulis radikal tangan (扌) di kiri.  2. Tutup dengan bagian 旨 di kanan: sapuan sendok di atas kotak matahari (日).",
    words: [
      ["指", "yubi - jari"],
      ["指す", "sasu - menunjuk"],
      ["指導", "shidou - bimbingan"],
    ],
    level: "N3",
  },
  {
    char: "捕",
    meaning: "Menangkap",
    on: "ho",
    kun: "tsuka(maeru)",
    steps:
      "1. Tulis radikal tangan (扌) di kiri.  2. Tutup dengan bagian 甫 di kanan: kotak sawah kecil dengan sapuan tambahan.",
    words: [
      ["捕まえる", "tsukamaeru - menangkap"],
      ["捕まる", "tsukamaru - tertangkap"],
      ["逮捕", "taiho - penangkapan"],
    ],
    level: "N3",
  },
  {
    char: "掛",
    meaning: "Menggantung, mengenakan",
    on: "kei",
    kun: "ka(keru)",
    steps:
      "1. Tulis radikal tangan (扌) di kiri.  2. Tutup dengan bagian 卦 di kanan: dua bentuk 土 bersusun dan garis tegak berkait.",
    words: [
      ["掛ける", "kakeru - menggantung, mengenakan"],
      ["見掛け", "mikake - penampilan luar"],
      ["仕掛け", "shikake - mekanisme, jebakan"],
    ],
    level: "N3",
  },
  {
    char: "探",
    meaning: "Mencari",
    on: "tan",
    kun: "saga(su), sagu(ru)",
    steps:
      "1. Tulis radikal tangan (扌) di kiri.  2. Tulis atap gua (穴) di kanan atas.  3. Tutup dengan sapuan tambahan di kanan bawah.",
    words: [
      ["探す", "sagasu - mencari"],
      ["探る", "saguru - meraba, menyelidiki"],
      ["探検", "tanken - penjelajahan"],
    ],
    level: "N3",
  },
  {
    char: "支",
    meaning: "Menopang, cabang",
    on: "shi",
    kun: "sasa(eru)",
    steps:
      "1. Tulis garis mendatar dan tegak menyilang (十) di atas.  2. Tutup dengan bentuk tangan (又) di bawah.",
    words: [
      ["支える", "sasaeru - menopang"],
      ["支店", "shiten - cabang toko"],
      ["支持", "shiji - dukungan"],
    ],
    level: "N3",
  },
  {
    char: "放",
    meaning: "Melepaskan",
    on: "hou",
    kun: "hana(su)",
    steps:
      "1. Tulis bagian arah (方) di kiri.  2. Tutup dengan radikal pukulan kecil (攵) di kanan.",
    words: [
      ["放す", "hanasu - melepaskan"],
      ["放送", "housou - siaran"],
      ["解放", "kaihou - pembebasan"],
    ],
    level: "N3",
  },
  {
    char: "政",
    meaning: "Politik, pemerintahan",
    on: "sei",
    kun: "",
    steps:
      "1. Tulis bagian 正 (benar) di kiri.  2. Tutup dengan radikal pukulan kecil (攵) di kanan.",
    words: [
      ["政治", "seiji - politik"],
      ["政府", "seifu - pemerintah"],
      ["行政", "gyousei - administrasi pemerintahan"],
    ],
    level: "N3",
  },
  {
    char: "敗",
    meaning: "Kalah, gagal",
    on: "hai",
    kun: "yabu(reru)",
    steps:
      "1. Tulis radikal uang kerang (貝) di kiri.  2. Tutup dengan radikal pukulan kecil (攵) di kanan.",
    words: [
      ["失敗", "shippai - kegagalan"],
      ["敗北", "haiboku - kekalahan"],
      ["勝敗", "shouhai - menang kalah"],
    ],
    level: "N3",
  },
  {
    char: "散",
    meaning: "Berserakan, tersebar",
    on: "san",
    kun: "chi(ru)",
    steps:
      "1. Tulis bagian kiri atas menyerupai rerumputan kecil.  2. Tulis radikal daging (月) di kiri bawah.  3. Tutup dengan radikal pukulan kecil (攵) di kanan.",
    words: [
      ["散る", "chiru - berguguran, tersebar"],
      ["散歩", "sanpo - jalan-jalan"],
      ["散らかす", "chirakasu - membuat berantakan"],
    ],
    level: "N3",
  },
  {
    char: "数",
    meaning: "Angka, jumlah",
    on: "suu",
    kun: "kazu, kazo(eru)",
    steps:
      "1. Tulis radikal beras (米) di kiri atas.  2. Tulis radikal perempuan (女) di kiri bawah.  3. Tutup dengan radikal pukulan kecil (攵) di kanan.",
    words: [
      ["数", "kazu - jumlah"],
      ["数える", "kazoeru - menghitung"],
      ["数学", "suugaku - matematika"],
    ],
    level: "N3",
  },
  {
    char: "断",
    meaning: "Memutuskan, menolak",
    on: "dan",
    kun: "kotowa(ru)",
    steps:
      "1. Tulis bagian kiri menyerupai beberapa garis dan benang kecil bersusun.  2. Tutup dengan radikal kapak (斤) di kanan.",
    words: [
      ["断る", "kotowaru - menolak"],
      ["判断", "handan - penilaian, keputusan"],
      ["油断", "yudan - lengah"],
    ],
    level: "N3",
  },
  {
    char: "易",
    meaning: "Mudah",
    on: "eki, i",
    kun: "yasa(shii)",
    steps:
      "1. Tulis kotak matahari (日) di atas.  2. Tutup dengan bagian 勿 di bawah: sapuan melengkung dengan garis pendek di dalamnya.",
    words: [
      ["容易", "youi - mudah"],
      ["貿易", "boueki - perdagangan"],
      ["易しい", "yasashii - mudah"],
    ],
    level: "N3",
  },
  {
    char: "昔",
    meaning: "Dahulu, zaman dulu",
    on: "seki",
    kun: "mukashi",
    steps:
      "1. Tulis dua garis mendatar dan sapuan kecil di atas menyerupai rumput.  2. Tutup dengan kotak matahari (日) di bawah.",
    words: [
      ["昔", "mukashi - dahulu kala"],
      ["昔話", "mukashibanashi - cerita rakyat"],
      ["大昔", "oomukashi - zaman purba"],
    ],
    level: "N3",
  },
  {
    char: "昨",
    meaning: "Kemarin, sebelumnya",
    on: "saku",
    kun: "",
    steps:
      "1. Tulis kotak matahari (日) di kiri.  2. Tutup dengan bagian 乍 di kanan: beberapa sapuan pendek dan garis tegak.",
    words: [
      ["昨日", "kinou - kemarin"],
      ["昨年", "sakunen - tahun lalu"],
      ["昨夜", "sakuya - tadi malam"],
    ],
    level: "N3",
  },
  {
    char: "晩",
    meaning: "Malam",
    on: "ban",
    kun: "",
    steps:
      "1. Tulis kotak matahari (日) di kiri.  2. Tutup dengan bagian 免 di kanan: sapuan atap dan kaki melengkung.",
    words: [
      ["今晩", "konban - malam ini"],
      ["毎晩", "maiban - setiap malam"],
      ["晩ご飯", "bangohan - makan malam"],
    ],
    level: "N3",
  },
  {
    char: "景",
    meaning: "Pemandangan",
    on: "kei",
    kun: "",
    steps:
      "1. Tulis kotak matahari (日) di atas.  2. Tutup dengan bagian 京 (ibu kota) di bawah: atap kecil, kotak mulut, dan kaki melebar.",
    words: [
      ["景色", "keshiki - pemandangan"],
      ["風景", "fuukei - pemandangan alam"],
      ["光景", "koukei - pemandangan, adegan"],
    ],
    level: "N3",
  },
  {
    char: "晴",
    meaning: "Cerah",
    on: "sei",
    kun: "ha(reru)",
    steps:
      "1. Tulis kotak matahari (日) di kiri.  2. Tutup dengan bagian 青 (biru) di kanan.",
    words: [
      ["晴れる", "hareru - cerah"],
      ["晴天", "seiten - cuaca cerah"],
      ["快晴", "kaisei - cerah sekali"],
    ],
    level: "N3",
  },
  {
    char: "暗",
    meaning: "Gelap",
    on: "an",
    kun: "kura(i)",
    steps:
      "1. Tulis kotak matahari (日) di kiri.  2. Tutup dengan bagian 音 (suara) di kanan: garis mendatar di atas kotak matahari kecil (日).",
    words: [
      ["暗い", "kurai - gelap"],
      ["暗記", "anki - hafalan"],
      ["真っ暗", "makkura - gelap gulita"],
    ],
    level: "N3",
  },
  {
    char: "暮",
    meaning: "Senja, menjalani hidup",
    on: "bo",
    kun: "ku(rasu), ku(reru)",
    steps:
      "1. Tulis dua radikal rumput kecil (艹) mengapit kotak matahari di atas.  2. Tutup dengan kotak matahari (日) lagi di bagian bawah.",
    words: [
      ["暮らす", "kurasu - menjalani hidup"],
      ["暮れる", "kureru - senja, berakhirnya tahun"],
      ["夕暮れ", "yuugure - senja"],
    ],
    level: "N3",
  },
  {
    char: "曲",
    meaning: "Lagu, melengkung",
    on: "kyoku",
    kun: "ma(garu)",
    steps:
      "1. Tulis bingkai kotak lebar.  2. Tambahkan dua garis tegak pendek di dalamnya.  3. Tutup dengan garis mendatar panjang di bawah.",
    words: [
      ["曲", "kyoku - lagu"],
      ["曲がる", "magaru - berbelok"],
      ["作曲", "sakkyoku - komposisi musik"],
    ],
    level: "N3",
  },
  {
    char: "更",
    meaning: "Semakin, memperbarui",
    on: "kou",
    kun: "sara(ni)",
    steps:
      "1. Tulis garis mendatar pendek di atas.  2. Tulis kotak mulut lebar (曰) di tengah.  3. Tutup dengan sapuan menyilang di bawah.",
    words: [
      ["更に", "sarani - lebih lanjut"],
      ["変更", "henkou - perubahan"],
      ["更新", "koushin - pembaruan"],
    ],
    level: "N3",
  },
  {
    char: "最",
    meaning: "Paling, ter-",
    on: "sai",
    kun: "motto(mo)",
    steps:
      "1. Tulis kotak matahari (日) di atas.  2. Tutup dengan bagian 取 di bawah: radikal telinga (耳) dan tangan (又).",
    words: [
      ["最も", "mottomo - paling"],
      ["最近", "saikin - baru-baru ini"],
      ["最初", "saisho - pertama kali"],
    ],
    level: "N3",
  },
  {
    char: "望",
    meaning: "Harapan",
    on: "bou",
    kun: "nozo(mu)",
    steps:
      "1. Tulis bagian 亡 di kiri atas.  2. Tulis radikal bulan (月) di kanan atas.  3. Tutup dengan radikal raja (王) di bawah.",
    words: [
      ["希望", "kibou - harapan"],
      ["望む", "nozomu - mengharapkan"],
      ["人望", "jinbou - kepercayaan orang banyak"],
    ],
    level: "N3",
  },
  {
    char: "期",
    meaning: "Periode, jangka waktu",
    on: "ki",
    kun: "",
    steps:
      "1. Tulis bagian 其 di kiri: kotak dengan garis-garis dan kaki.  2. Tutup dengan radikal bulan (月) di kanan.",
    words: [
      ["時期", "jiki - waktu, periode"],
      ["期間", "kikan - jangka waktu"],
      ["期待", "kitai - harapan"],
    ],
    level: "N3",
  },
  {
    char: "未",
    meaning: "Belum",
    on: "mi",
    kun: "ima(da)",
    steps:
      "1. Tulis garis mendatar pendek di atas.  2. Tulis garis mendatar panjang di bawahnya.  3. Tutup dengan garis tegak menembus turun dan sapuan menyilang.",
    words: [
      ["未来", "mirai - masa depan"],
      ["未満", "miman - kurang dari, di bawah"],
      ["未だに", "imadani - masih saja"],
    ],
    level: "N3",
  },
  {
    char: "末",
    meaning: "Akhir, ujung",
    on: "matsu",
    kun: "sue",
    steps:
      "1. Tulis pohon (木) seperti biasa.  2. Tambahkan satu garis mendatar tambahan yang lebih panjang di bagian atas, menandakan ujung/ranting pohon.",
    words: [
      ["週末", "shuumatsu - akhir pekan"],
      ["年末", "nenmatsu - akhir tahun"],
      ["末っ子", "suekko - anak bungsu"],
    ],
    level: "N3",
  },
  {
    char: "束",
    meaning: "Ikatan, seikat",
    on: "soku",
    kun: "taba, taba(neru)",
    steps:
      "1. Tulis pohon (木) di tengah.  2. Tambahkan garis melingkar mengelilingi bagian tengah batang, seperti tali yang mengikat seikat kayu.",
    words: [
      ["約束", "yakusoku - janji"],
      ["花束", "hanataba - buket bunga"],
      ["束ねる", "tabaneru - mengikat"],
    ],
    level: "N3",
  },
  {
    char: "杯",
    meaning: "Gelas, cawan (penghitung)",
    on: "hai",
    kun: "sakazuki",
    steps:
      "1. Tulis radikal pohon/kayu (木) di kiri.  2. Tulis bagian 不 di kanan: garis mendatar lalu beberapa sapuan kecil di bawahnya.",
    words: [
      ["一杯", "ippai - satu gelas, penuh"],
      ["乾杯", "kanpai - bersulang"],
      ["杯", "sakazuki - cawan sake"],
    ],
    level: "N3",
  },
  {
    char: "果",
    meaning: "Buah, hasil",
    on: "ka",
    kun: "ha(tasu)",
    steps:
      "1. Tulis kotak sawah (田) di atas.  2. Tutup dengan bagian pohon (木) di bawah, seperti buah yang tumbuh di pohon.",
    words: [
      ["果物", "kudamono - buah-buahan"],
      ["結果", "kekka - hasil"],
      ["果たす", "hatasu - melaksanakan"],
    ],
    level: "N3",
  },
  {
    char: "格",
    meaning: "Status, tingkatan",
    on: "kaku",
    kun: "",
    steps:
      "1. Tulis radikal pohon (木) di kiri.  2. Tulis bagian 各 di kanan: atap kecil di atas dan kotak mulut (口) di bawahnya.",
    words: [
      ["性格", "seikaku - kepribadian"],
      ["合格", "goukaku - lulus"],
      ["価格", "kakaku - harga"],
    ],
    level: "N3",
  },
  {
    char: "構",
    meaning: "Menyusun, bersiap",
    on: "kou",
    kun: "kama(eru), kama(u)",
    steps:
      "1. Tulis radikal pohon (木) di kiri.  2. Tulis bagian kanan yang menyerupai 冓: beberapa kotak kecil bertumpuk dengan garis penghubung.",
    words: [
      ["構造", "kouzou - struktur"],
      ["構える", "kamaeru - bersiap, mengambil sikap"],
      ["構う", "kamau - peduli"],
    ],
    level: "N3",
  },
  {
    char: "様",
    meaning: "Cara, sapaan hormat",
    on: "you",
    kun: "sama, san",
    steps:
      "1. Tulis radikal pohon (木) di kiri.  2. Tulis bagian kanan menyerupai domba (羊) di atas dan bagian air (水) di bawah.",
    words: [
      ["お客様", "okyakusama - pelanggan, tamu (hormat)"],
      ["様子", "yousu - keadaan"],
      ["皆様", "minasama - semua orang (hormat)"],
    ],
    level: "N3",
  },
  {
    char: "権",
    meaning: "Kekuasaan, hak",
    on: "ken",
    kun: "kari",
    steps:
      "1. Tulis radikal pohon (木) di kiri.  2. Tulis bagian kanan yang rumit menyerupai burung (雚) bertumpuk dengan garis-garis kecil.",
    words: [
      ["人権", "jinken - hak asasi manusia"],
      ["権利", "kenri - hak"],
      ["政権", "seiken - kekuasaan politik"],
    ],
    level: "N3",
  },
  {
    char: "横",
    meaning: "Samping, horizontal",
    on: "ou",
    kun: "yoko",
    steps:
      "1. Tulis radikal pohon (木) di kiri.  2. Tulis bagian 黄 di kanan: kotak dan garis-garis menyerupai aksara warna kuning.",
    words: [
      ["横", "yoko - samping"],
      ["横断歩道", "oudanhodou - zebra cross"],
      ["横になる", "yoko ni naru - berbaring"],
    ],
    level: "N3",
  },
  {
    char: "機",
    meaning: "Mesin, kesempatan",
    on: "ki",
    kun: "hata",
    steps:
      "1. Tulis radikal pohon (木) di kiri.  2. Tulis bagian kanan atas menyerupai dua benang kecil (幺幺).  3. Tutup dengan bagian 戈 di kanan bawah.",
    words: [
      ["飛行機", "hikouki - pesawat terbang"],
      ["機会", "kikai - kesempatan"],
      ["機械", "kikai - mesin"],
    ],
    level: "N3",
  },
  {
    char: "欠",
    meaning: "Kurang, absen",
    on: "ketsu",
    kun: "ka(keru), ka(ku)",
    steps:
      "1. Tulis sapuan melengkung dari kiri atas ke bawah.  2. Tutup dengan sapuan kaki melengkung ke kanan bawah, menyerupai orang menguap.",
    words: [
      ["欠席", "kesseki - absen"],
      ["欠点", "ketten - kekurangan"],
      ["欠ける", "kakeru - kurang, sompel"],
    ],
    level: "N3",
  },
  {
    char: "次",
    meaning: "Berikutnya",
    on: "ji",
    kun: "tsugi, tsu(gu)",
    steps:
      "1. Tulis dua titik kecil menyerupai es (冫) di kiri.  2. Tulis bagian 欠 di kanan: sapuan melengkung dan kaki.",
    words: [
      ["次", "tsugi - berikutnya"],
      ["次回", "jikai - kali berikutnya"],
      ["目次", "mokuji - daftar isi"],
    ],
    level: "N3",
  },
  {
    char: "欲",
    meaning: "Keinginan, nafsu",
    on: "yoku",
    kun: "ho(shii)",
    steps:
      "1. Tulis bagian 谷 (lembah) di kiri: atap kecil dan kotak mulut.  2. Tulis bagian 欠 di kanan.",
    words: [
      ["欲しい", "hoshii - ingin"],
      ["意欲", "iyoku - semangat"],
      ["食欲", "shokuyoku - nafsu makan"],
    ],
    level: "N3",
  },
  {
    char: "歯",
    meaning: "Gigi",
    on: "shi",
    kun: "ha",
    steps:
      "1. Tulis bingkai kotak besar dengan bagian 止 di dalamnya.  2. Tambahkan garis-garis kecil di dalam kotak menyerupai deretan gigi.",
    words: [
      ["歯", "ha - gigi"],
      ["歯医者", "haisha - dokter gigi"],
      ["歯ブラシ", "haburashi - sikat gigi"],
    ],
    level: "N3",
  },
  {
    char: "歳",
    meaning: "Usia, tahun",
    on: "sai",
    kun: "toshi",
    steps:
      "1. Tulis bagian 止 di kiri atas.  2. Tulis bagian 戈 di kanan.  3. Tutup dengan bagian kecil menyerupai 少 di bawah.",
    words: [
      ["一歳", "issai - satu tahun (usia)"],
      ["お歳暮", "oseibo - hadiah akhir tahun"],
      ["歳月", "saigetsu - tahun bulan, waktu"],
    ],
    level: "N3",
  },
  {
    char: "残",
    meaning: "Sisa, tersisa",
    on: "zan",
    kun: "noko(ru), noko(su)",
    steps:
      "1. Tulis radikal tulang buruk (歹) di kiri.  2. Tulis bagian 戔 di kanan: dua bagian 戈 kecil bertumpuk.",
    words: [
      ["残る", "nokoru - tersisa"],
      ["残念", "zannen - sayang sekali"],
      ["残業", "zangyou - lembur"],
    ],
    level: "N3",
  },
  {
    char: "段",
    meaning: "Tingkat, anak tangga",
    on: "dan",
    kun: "",
    steps:
      "1. Tulis bagian kiri menyerupai lapisan batu bertumpuk.  2. Tutup dengan bagian tangan (殳) di kanan.",
    words: [
      ["階段", "kaidan - tangga"],
      ["段階", "dankai - tahap"],
      ["値段", "nedan - harga"],
    ],
    level: "N3",
  },
  {
    char: "殺",
    meaning: "Membunuh",
    on: "satsu",
    kun: "koro(su)",
    steps:
      "1. Tulis bagian 乂 dan 木 di kiri atas.  2. Tutup dengan bagian tangan (殳) di kanan.",
    words: [
      ["殺す", "korosu - membunuh"],
      ["自殺", "jisatsu - bunuh diri"],
      ["殺人", "satsujin - pembunuhan"],
    ],
    level: "N3",
  },
  {
    char: "民",
    meaning: "Rakyat",
    on: "min",
    kun: "tami",
    steps:
      "1. Tulis sapuan kiri dan garis tegak di atas.  2. Tutup dengan sapuan melengkung panjang berkait di bawah.",
    words: [
      ["国民", "kokumin - warga negara"],
      ["市民", "shimin - warga kota"],
      ["民族", "minzoku - suku bangsa"],
    ],
    level: "N3",
  },
  {
    char: "求",
    meaning: "Meminta, mencari",
    on: "kyuu",
    kun: "moto(meru)",
    steps:
      "1. Tulis titik kecil di atas.  2. Tulis sapuan melengkung besar dari kiri atas ke kanan bawah dengan dua titik tambahan di sisinya.",
    words: [
      ["求める", "motomeru - meminta"],
      ["要求", "youkyuu - tuntutan"],
      ["求人", "kyuujin - lowongan kerja"],
    ],
    level: "N3",
  },
  {
    char: "決",
    meaning: "Memutuskan",
    on: "ketsu",
    kun: "ki(meru), ki(maru)",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis bagian 夬 di kanan: kotak kecil dan sapuan melengkung berkait.",
    words: [
      ["決める", "kimeru - memutuskan"],
      ["決定", "kettei - keputusan"],
      ["解決", "kaiketsu - penyelesaian"],
    ],
    level: "N3",
  },
  {
    char: "治",
    meaning: "Mengatur, menyembuhkan",
    on: "ji, chi",
    kun: "osa(meru), nao(ru)",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis bagian 台 di kanan: atap kecil dan kotak mulut.",
    words: [
      ["政治", "seiji - politik"],
      ["治る", "naoru - sembuh"],
      ["治療", "chiryou - pengobatan"],
    ],
    level: "N3",
  },
  {
    char: "法",
    meaning: "Hukum, metode",
    on: "hou",
    kun: "nori",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis bagian 去 di kanan: bagian tanah di atas dan sapuan melengkung di bawah.",
    words: [
      ["方法", "houhou - cara"],
      ["法律", "houritsu - undang-undang"],
      ["文法", "bunpou - tata bahasa"],
    ],
    level: "N3",
  },
  {
    char: "泳",
    meaning: "Berenang",
    on: "ei",
    kun: "oyo(gu)",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis bagian 永 di kanan: sapuan panjang menyerupai aliran air.",
    words: [
      ["泳ぐ", "oyogu - berenang"],
      ["水泳", "suiei - renang"],
      ["競泳", "kyouei - lomba renang"],
    ],
    level: "N3",
  },
  {
    char: "洗",
    meaning: "Mencuci",
    on: "sen",
    kun: "ara(u)",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis bagian 先 di kanan: bagian atas kecil dan kaki manusia di bawah.",
    words: [
      ["洗う", "arau - mencuci"],
      ["洗濯", "sentaku - mencuci pakaian"],
      ["手洗い", "tearai - cuci tangan"],
    ],
    level: "N3",
  },
  {
    char: "活",
    meaning: "Hidup, aktif",
    on: "katsu",
    kun: "i(kiru)",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis bagian 舌 di kanan: kotak mulut dengan garis di atasnya.",
    words: [
      ["生活", "seikatsu - kehidupan"],
      ["活動", "katsudou - aktivitas"],
      ["活気", "kakki - semangat"],
    ],
    level: "N3",
  },
  {
    char: "流",
    meaning: "Aliran, mengalir",
    on: "ryuu",
    kun: "naga(reru), naga(su)",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis bagian kanan menyerupai bendera kecil di atas dan anak (子) mengalir di bawah.",
    words: [
      ["流れる", "nagareru - mengalir"],
      ["流行", "ryuukou - tren"],
      ["交流", "kouryuu - pertukaran"],
    ],
    level: "N3",
  },
  {
    char: "浮",
    meaning: "Mengapung",
    on: "fu",
    kun: "u(ku), u(kabu)",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis bagian 孚 di kanan: cakar kecil di atas dan anak (子) di bawah.",
    words: [
      ["浮く", "uku - mengapung"],
      ["浮かぶ", "ukabu - terapung, terlintas"],
      ["浮気", "uwaki - selingkuh"],
    ],
    level: "N3",
  },
  {
    char: "消",
    meaning: "Memadamkan, menghilang",
    on: "shou",
    kun: "ki(eru), ke(su)",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis bagian 肖 di kanan: sapuan kecil di atas dan bulan (月) di bawah.",
    words: [
      ["消える", "kieru - menghilang"],
      ["消す", "kesu - mematikan, menghapus"],
      ["消費", "shouhi - konsumsi"],
    ],
    level: "N3",
  },
  {
    char: "深",
    meaning: "Dalam",
    on: "shin",
    kun: "fuka(i)",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis atap kecil di kanan atas.  3. Tutup dengan bagian pohon (木) di bawahnya.",
    words: [
      ["深い", "fukai - dalam"],
      ["深夜", "shin'ya - tengah malam"],
      ["深呼吸", "shinkokyuu - napas dalam"],
    ],
    level: "N3",
  },
  {
    char: "済",
    meaning: "Selesai, lunas",
    on: "sai",
    kun: "su(mu)",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis bagian 斉 di kanan: garis-garis sejajar bertumpuk.",
    words: [
      ["済む", "sumu - selesai"],
      ["経済", "keizai - ekonomi"],
      ["返済", "hensai - pembayaran kembali"],
    ],
    level: "N3",
  },
  {
    char: "渡",
    meaning: "Menyeberang",
    on: "to",
    kun: "wata(ru), wata(su)",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis bagian 度 di kanan: atap miring di atas dan bagian tangan (又) di bawah.",
    words: [
      ["渡る", "wataru - menyeberang"],
      ["渡す", "watasu - menyerahkan"],
      ["譲渡", "jouto - transfer, penyerahan"],
    ],
    level: "N3",
  },
  {
    char: "港",
    meaning: "Pelabuhan",
    on: "kou",
    kun: "minato",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis bagian 巷 di kanan: bagian atas kecil dan bagian 己 di bawah.",
    words: [
      ["空港", "kuukou - bandara"],
      ["港", "minato - pelabuhan"],
      ["香港", "honkon - Hong Kong"],
    ],
    level: "N3",
  },
  {
    char: "満",
    meaning: "Penuh",
    on: "man",
    kun: "mi(chiru), mi(tasu)",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis dua garis mendatar (廿) di kanan atas.  3. Tutup dengan bagian 両 di bawahnya.",
    words: [
      ["満員", "man'in - penuh sesak"],
      ["満足", "manzoku - puas"],
      ["不満", "fuman - tidak puas"],
    ],
    level: "N3",
  },
  {
    char: "演",
    meaning: "Pertunjukan, memerankan",
    on: "en",
    kun: "",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis bagian 寅 di kanan: atap (宀) di atas dan garis-garis bertumpuk di bawahnya.",
    words: [
      ["演技", "engi - akting"],
      ["演奏", "ensou - pertunjukan musik"],
      ["講演", "kouen - ceramah"],
    ],
    level: "N3",
  },
  {
    char: "点",
    meaning: "Titik, nilai",
    on: "ten",
    kun: "tsu(ku)",
    steps:
      "1. Tulis bagian 占 di atas: garis miring dan kotak mulut.  2. Tutup dengan empat titik api (灬) di bawah.",
    words: [
      ["点数", "tensuu - nilai, skor"],
      ["弱点", "jakuten - kelemahan"],
      ["点く", "tsuku - menyala"],
    ],
    level: "N3",
  },
  {
    char: "然",
    meaning: "Begitu, alami",
    on: "zen, nen",
    kun: "shika",
    steps:
      "1. Tulis bagian 夕 di kiri atas dan bagian 犬 di kanan atas.  2. Tutup dengan empat titik api (灬) di bawah.",
    words: [
      ["自然", "shizen - alam"],
      ["天然", "tennen - alami"],
      ["全然", "zenzen - sama sekali"],
    ],
    level: "N3",
  },
  {
    char: "煙",
    meaning: "Asap",
    on: "en",
    kun: "kemuri, kemu(ru)",
    steps:
      "1. Tulis radikal api (火) di kiri.  2. Tulis bagian 垔 di kanan: kotak dan garis-garis bertumpuk di atas tanah.",
    words: [
      ["煙", "kemuri - asap"],
      ["禁煙", "kin'en - dilarang merokok"],
      ["喫煙", "kitsuen - merokok"],
    ],
    level: "N3",
  },
  {
    char: "熱",
    meaning: "Panas, demam",
    on: "netsu",
    kun: "atsu(i)",
    steps:
      "1. Tulis bagian 埶 di atas: tanah dan tangan menanam.  2. Tutup dengan empat titik api (灬) di bawah.",
    words: [
      ["熱い", "atsui - panas"],
      ["熱心", "nesshin - antusias, tekun"],
      ["発熱", "hatsunetsu - demam"],
    ],
    level: "N3",
  },
  {
    char: "犯",
    meaning: "Kejahatan, melanggar",
    on: "han",
    kun: "oka(su)",
    steps:
      "1. Tulis radikal anjing (犭) di kiri.  2. Tulis bagian 卩 di kanan: sapuan melengkung berkait.",
    words: [
      ["犯人", "hannin - pelaku kejahatan"],
      ["犯罪", "hanzai - kejahatan"],
      ["犯す", "okasu - melanggar"],
    ],
    level: "N3",
  },
  {
    char: "状",
    meaning: "Kondisi, keadaan",
    on: "jou",
    kun: "",
    steps:
      "1. Tulis radikal segi (爿) di kiri.  2. Tulis bagian anjing (犬) di kanan.",
    words: [
      ["状態", "joutai - kondisi"],
      ["招待状", "shoutaijou - kartu undangan"],
      ["現状", "genjou - keadaan sekarang"],
    ],
    level: "N3",
  },
  {
    char: "猫",
    meaning: "Kucing",
    on: "byou",
    kun: "neko",
    steps:
      "1. Tulis radikal anjing (犭) di kiri.  2. Tulis bagian 苗 di kanan: rumput (艹) di atas dan sawah (田) di bawah.",
    words: [
      ["猫", "neko - kucing"],
      ["子猫", "koneko - anak kucing"],
      ["猫好き", "nekozuki - pecinta kucing"],
    ],
    level: "N3",
  },
  {
    char: "王",
    meaning: "Raja",
    on: "ou",
    kun: "",
    steps:
      "1. Tulis dua garis mendatar sejajar di atas.  2. Tarik garis tegak menembus tengah.  3. Tutup dengan garis mendatar panjang di bawah.",
    words: [
      ["王様", "ousama - raja"],
      ["女王", "joou - ratu"],
      ["王国", "oukoku - kerajaan"],
    ],
    level: "N3",
  },
  {
    char: "現",
    meaning: "Sekarang, muncul",
    on: "gen",
    kun: "arawa(reru), arawa(su)",
    steps:
      "1. Tulis radikal permata (王) di kiri.  2. Tulis bagian 見 di kanan: kotak mata di atas dan kaki manusia di bawah.",
    words: [
      ["現れる", "arawareru - muncul"],
      ["現在", "genzai - sekarang"],
      ["実現", "jitsugen - terwujud"],
    ],
    level: "N3",
  },
  {
    char: "球",
    meaning: "Bola",
    on: "kyuu",
    kun: "tama",
    steps:
      "1. Tulis radikal permata (王) di kiri.  2. Tulis bagian 求 di kanan: titik dan sapuan melengkung besar.",
    words: [
      ["地球", "chikyuu - bumi"],
      ["野球", "yakyuu - baseball"],
      ["電球", "denkyuu - bola lampu"],
    ],
    level: "N3",
  },
  {
    char: "産",
    meaning: "Melahirkan, produk",
    on: "san",
    kun: "u(mu), u(mareru)",
    steps:
      "1. Tulis bagian 立 di atas kiri.  2. Tulis bagian 厂 di atas kanan.  3. Tutup dengan bagian 生 di bawah.",
    words: [
      ["産む", "umu - melahirkan"],
      ["生産", "seisan - produksi"],
      ["出産", "shussan - persalinan"],
    ],
    level: "N3",
  },
  {
    char: "由",
    meaning: "Alasan, sebab",
    on: "yuu, yu",
    kun: "yoshi",
    steps:
      "1. Tulis kotak sawah (田) tanpa sisi bawah.  2. Tarik garis tegak menembus ke bawah.",
    words: [
      ["自由", "jiyuu - bebas"],
      ["理由", "riyuu - alasan"],
      ["由来", "yurai - asal usul"],
    ],
    level: "N3",
  },
  {
    char: "申",
    meaning: "Menyatakan (hormat)",
    on: "shin",
    kun: "mou(su)",
    steps:
      "1. Tulis garis tegak panjang di tengah menembus dari atas ke bawah.  2. Tambahkan garis mendatar yang menyilang di tengahnya.",
    words: [
      ["申す", "mousu - mengatakan (hormat)"],
      ["申し込む", "moushikomu - mendaftar"],
      ["申告", "shinkoku - pelaporan, deklarasi"],
    ],
    level: "N3",
  },
  {
    char: "留",
    meaning: "Menahan, tinggal",
    on: "ryuu, ru",
    kun: "to(meru), to(maru)",
    steps:
      "1. Tulis bagian atas menyerupai dua sapuan melengkung sejajar.  2. Tutup dengan bagian sawah (田) di bawah.",
    words: [
      ["留学", "ryuugaku - belajar di luar negeri"],
      ["留守", "rusu - tidak di rumah"],
      ["留める", "tomeru - menahan, menempelkan"],
    ],
    level: "N3",
  },
  {
    char: "番",
    meaning: "Giliran, nomor",
    on: "ban",
    kun: "tsuga(i)",
    steps:
      "1. Tulis bagian atas menyerupai garis dan titik-titik bertumpuk.  2. Tutup dengan bagian sawah (田) di bawah.",
    words: [
      ["一番", "ichiban - nomor satu, paling"],
      ["番号", "bangou - nomor"],
      ["交番", "kouban - pos polisi"],
    ],
    level: "N3",
  },
  {
    char: "疑",
    meaning: "Curiga, ragu",
    on: "gi",
    kun: "utaga(u)",
    steps:
      "1. Tulis bagian kiri menyerupai 匕 dan 矢.  2. Tutup dengan bagian kanan menyerupai 疋 (kaki).",
    words: [
      ["疑う", "utagau - curiga"],
      ["質疑", "shitsugi - tanya jawab"],
      ["疑問", "gimon - pertanyaan, keraguan"],
    ],
    level: "N3",
  },
  {
    char: "疲",
    meaning: "Lelah",
    on: "hi",
    kun: "tsuka(reru)",
    steps:
      "1. Tulis radikal penyakit (疒) mengelilingi di kiri atas.  2. Tutup dengan bagian 皮 (kulit) di dalamnya.",
    words: [
      ["疲れる", "tsukareru - lelah"],
      ["疲労", "hirou - kelelahan"],
      ["気疲れ", "kizukare - lelah mental"],
    ],
    level: "N3",
  },
  {
    char: "痛",
    meaning: "Sakit, nyeri",
    on: "tsuu",
    kun: "ita(i), ita(mu)",
    steps:
      "1. Tulis radikal penyakit (疒) mengelilingi di kiri atas.  2. Tutup dengan bagian 甬 di dalamnya: kotak dan garis tegak.",
    words: [
      ["痛い", "itai - sakit"],
      ["頭痛", "zutsuu - sakit kepala"],
      ["痛み", "itami - rasa sakit"],
    ],
    level: "N3",
  },
  {
    char: "登",
    meaning: "Mendaki, naik",
    on: "tou",
    kun: "nobo(ru)",
    steps:
      "1. Tulis bagian kaki jalan (癶) di atas.  2. Tutup dengan bagian 豆 di bawah: garis dan kotak.",
    words: [
      ["登る", "noboru - mendaki"],
      ["登録", "touroku - registrasi"],
      ["登場", "toujou - kemunculan, tampil"],
    ],
    level: "N3",
  },
  {
    char: "皆",
    meaning: "Semua",
    on: "kai",
    kun: "mina, minna",
    steps:
      "1. Tulis bagian 比 di atas: dua sapuan sejajar.  2. Tutup dengan bagian matahari (白) di bawah.",
    words: [
      ["皆さん", "minasan - semuanya"],
      ["皆さま", "minasama - semuanya (hormat)"],
      ["皆無", "kaimu - nihil sama sekali"],
    ],
    level: "N3",
  },
  {
    char: "盗",
    meaning: "Mencuri",
    on: "tou",
    kun: "nusu(mu)",
    steps:
      "1. Tulis bagian 次 di atas: dua titik dan sapuan melengkung.  2. Tutup dengan bagian piring (皿) di bawah.",
    words: [
      ["盗む", "nusumu - mencuri"],
      ["盗難", "tounan - pencurian"],
      ["強盗", "goutou - perampokan"],
    ],
    level: "N3",
  },
  {
    char: "直",
    meaning: "Langsung, memperbaiki",
    on: "choku",
    kun: "nao(su), nao(ru)",
    steps:
      "1. Tulis mata (目) miring di kiri atas.  2. Tutup dengan garis tegak dan sapuan melengkung di bawah.",
    words: [
      ["直す", "naosu - memperbaiki"],
      ["直接", "chokusetsu - langsung"],
      ["正直", "shoujiki - jujur"],
    ],
    level: "N3",
  },
  {
    char: "相",
    meaning: "Saling, wajah",
    on: "sou, shou",
    kun: "ai",
    steps:
      "1. Tulis radikal pohon (木) di kiri.  2. Tulis bagian mata (目) di kanan.",
    words: [
      ["相談", "soudan - konsultasi"],
      ["相手", "aite - lawan bicara, pasangan"],
      ["首相", "shushou - perdana menteri"],
    ],
    level: "N3",
  },
  {
    char: "眠",
    meaning: "Tidur",
    on: "min",
    kun: "nemu(ru), nemu(i)",
    steps: "1. Tulis mata (目) di kiri.  2. Tulis bagian 民 di kanan.",
    words: [
      ["眠る", "nemuru - tidur"],
      ["睡眠", "suimin - tidur, istirahat"],
      ["眠い", "nemui - mengantuk"],
    ],
    level: "N3",
  },
  {
    char: "石",
    meaning: "Batu",
    on: "seki",
    kun: "ishi",
    steps:
      "1. Tulis atap miring (厂) di atas kiri.  2. Tutup dengan kotak mulut (口) di bawahnya.",
    words: [
      ["石", "ishi - batu"],
      ["宝石", "houseki - permata"],
      ["石油", "sekiyu - minyak bumi"],
    ],
    level: "N3",
  },
  {
    char: "破",
    meaning: "Merobek, memecahkan",
    on: "ha",
    kun: "yabu(ru)",
    steps:
      "1. Tulis radikal batu (石) di kiri.  2. Tulis bagian 皮 (kulit) di kanan.",
    words: [
      ["破る", "yaburu - merobek, melanggar"],
      ["破壊", "hakai - kehancuran"],
      ["破産", "hasan - bangkrut"],
    ],
    level: "N3",
  },
  {
    char: "確",
    meaning: "Pasti, yakin",
    on: "kaku",
    kun: "tashi(ka), tashi(kameru)",
    steps:
      "1. Tulis radikal batu (石) di kiri.  2. Tulis bagian 隺 di kanan: bentuk burung dengan garis-garis di atasnya.",
    words: [
      ["確かに", "tashika ni - memang benar"],
      ["確認", "kakunin - konfirmasi"],
      ["正確", "seikaku - akurat"],
    ],
    level: "N3",
  },
  {
    char: "示",
    meaning: "Menunjukkan",
    on: "ji",
    kun: "shime(su)",
    steps:
      "1. Tulis dua garis mendatar sejajar di atas.  2. Tutup dengan sapuan kaki kiri dan kanan di bawah.",
    words: [
      ["示す", "shimesu - menunjukkan"],
      ["指示", "shiji - instruksi"],
      ["展示", "tenji - pameran"],
    ],
    level: "N3",
  },
  {
    char: "礼",
    meaning: "Sopan santun, salam",
    on: "rei",
    kun: "",
    steps:
      "1. Tulis radikal roh (礻) di kiri.  2. Tulis sapuan melengkung kecil (乚) di kanan.",
    words: [
      ["お礼", "orei - ucapan terima kasih"],
      ["礼儀", "reigi - etika, sopan santun"],
      ["失礼", "shitsurei - permisi, tidak sopan"],
    ],
    level: "N3",
  },
  {
    char: "祖",
    meaning: "Leluhur",
    on: "so",
    kun: "",
    steps:
      "1. Tulis radikal roh (礻) di kiri.  2. Tulis bagian 且 di kanan: kotak-kotak bertumpuk.",
    words: [
      ["祖父", "sofu - kakek"],
      ["祖母", "sobo - nenek"],
      ["先祖", "senzo - leluhur"],
    ],
    level: "N3",
  },
  {
    char: "神",
    meaning: "Dewa, tuhan",
    on: "shin, jin",
    kun: "kami",
    steps:
      "1. Tulis radikal roh (礻) di kiri.  2. Tulis bagian 申 di kanan: garis tegak menembus garis mendatar.",
    words: [
      ["神様", "kamisama - dewa, tuhan"],
      ["神社", "jinja - kuil Shinto"],
      ["精神", "seishin - jiwa, mental"],
    ],
    level: "N3",
  },
  {
    char: "福",
    meaning: "Berkah, keberuntungan",
    on: "fuku",
    kun: "",
    steps:
      "1. Tulis radikal roh (礻) di kiri.  2. Tulis bagian 畐 di kanan: kotak dan garis-garis bertumpuk seperti kendi penuh.",
    words: [
      ["幸福", "koufuku - kebahagiaan"],
      ["福袋", "fukubukuro - tas keberuntungan"],
      ["祝福", "shukufuku - berkat, ucapan selamat"],
    ],
    level: "N3",
  },
  {
    char: "科",
    meaning: "Jurusan, bidang ilmu",
    on: "ka",
    kun: "",
    steps:
      "1. Tulis radikal padi (禾) di kiri.  2. Tulis bagian takaran (斗) di kanan.",
    words: [
      ["科学", "kagaku - sains"],
      ["教科書", "kyoukasho - buku pelajaran"],
      ["内科", "naika - penyakit dalam"],
    ],
    level: "N3",
  },
  {
    char: "程",
    meaning: "Kira-kira, tingkat",
    on: "tei",
    kun: "hodo",
    steps:
      "1. Tulis radikal padi (禾) di kiri.  2. Tulis bagian 呈 di kanan: kotak mulut dan garis-garis di bawahnya.",
    words: [
      ["程度", "teido - tingkat, derajat"],
      ["先程", "sakihodo - tadi"],
      ["過程", "katei - proses"],
    ],
    level: "N3",
  },
  {
    char: "種",
    meaning: "Jenis, benih",
    on: "shu",
    kun: "tane",
    steps:
      "1. Tulis radikal padi (禾) di kiri.  2. Tulis bagian 重 (berat) di kanan.",
    words: [
      ["種類", "shurui - jenis"],
      ["種", "tane - biji, benih"],
      ["人種", "jinshu - ras manusia"],
    ],
    level: "N3",
  },
  {
    char: "積",
    meaning: "Menumpuk, volume",
    on: "seki",
    kun: "tsu(mu)",
    steps:
      "1. Tulis radikal padi (禾) di kiri.  2. Tulis bagian 責 di kanan: uang kerang dengan garis-garis di atasnya.",
    words: [
      ["積む", "tsumu - menumpuk"],
      ["面積", "menseki - luas"],
      ["積極的", "sekkyokuteki - proaktif"],
    ],
    level: "N3",
  },
  {
    char: "突",
    meaning: "Menusuk, mendadak",
    on: "totsu",
    kun: "tsu(ku)",
    steps:
      "1. Tulis atap gua (穴) di atas.  2. Tutup dengan bagian anjing (犬) di bawah.",
    words: [
      ["突然", "totsuzen - tiba-tiba"],
      ["突く", "tsuku - menusuk"],
      ["衝突", "shoutotsu - tabrakan"],
    ],
    level: "N3",
  },
  {
    char: "窓",
    meaning: "Jendela",
    on: "sou",
    kun: "mado",
    steps:
      "1. Tulis atap gua (穴) di atas.  2. Tutup dengan bagian hati (心) dan garis-garis di bawah.",
    words: [
      ["窓", "mado - jendela"],
      ["窓口", "madoguchi - loket"],
      ["車窓", "shasou - jendela kendaraan"],
    ],
    level: "N3",
  },
  {
    char: "笑",
    meaning: "Tertawa, tersenyum",
    on: "shou",
    kun: "wara(u), e(mu)",
    steps:
      "1. Tulis radikal bambu (竹) di atas.  2. Tutup dengan bagian 夭 di bawah: sapuan-sapuan kecil menyerupai orang.",
    words: [
      ["笑う", "warau - tertawa"],
      ["笑顔", "egao - wajah tersenyum"],
      ["微笑む", "hohoemu - tersenyum"],
    ],
    level: "N3",
  },
  {
    char: "等",
    meaning: "Dan lain-lain, setara",
    on: "tou",
    kun: "hito(shii), nado",
    steps:
      "1. Tulis radikal bambu (竹) di atas.  2. Tutup dengan bagian 寺 di bawah: bagian tanah dan tangan.",
    words: [
      ["等しい", "hitoshii - setara"],
      ["平等", "byoudou - kesetaraan"],
      ["等", "nado - dan sebagainya"],
    ],
    level: "N3",
  },
  {
    char: "箱",
    meaning: "Kotak",
    on: "sou",
    kun: "hako",
    steps:
      "1. Tulis radikal bambu (竹) di atas.  2. Tutup dengan bagian 相 di bawah: pohon dan mata.",
    words: [
      ["箱", "hako - kotak"],
      ["ゴミ箱", "gomibako - tempat sampah"],
      ["弁当箱", "bentoubako - kotak bekal"],
    ],
    level: "N3",
  },
  {
    char: "米",
    meaning: "Beras, Amerika",
    on: "bei",
    kun: "kome",
    steps:
      "1. Tulis garis tegak dan garis mendatar menyilang di tengah.  2. Tambahkan empat titik di sekelilingnya menyerupai butiran beras.",
    words: [
      ["米", "kome - beras"],
      ["米国", "beikoku - Amerika Serikat"],
      ["玄米", "genmai - beras merah"],
    ],
    level: "N3",
  },
  {
    char: "精",
    meaning: "Semangat, murni",
    on: "sei",
    kun: "kuwa(shii)",
    steps:
      "1. Tulis radikal padi (禾) di kiri.  2. Tulis bagian 青 (biru, muda) di kanan.",
    words: [
      ["精神", "seishin - jiwa, semangat"],
      ["精一杯", "seiippai - sekuat tenaga"],
      ["妖精", "yousei - peri"],
    ],
    level: "N3",
  },
  {
    char: "約",
    meaning: "Janji, kira-kira",
    on: "yaku",
    kun: "tsuzu(maru)",
    steps:
      "1. Tulis radikal benang (糸) di kiri.  2. Tulis bagian 勺 di kanan: sapuan melengkung dengan titik.",
    words: [
      ["約束", "yakusoku - janji"],
      ["予約", "yoyaku - reservasi"],
      ["節約", "setsuyaku - penghematan"],
    ],
    level: "N3",
  },
  {
    char: "組",
    meaning: "Kelompok, menyusun",
    on: "so",
    kun: "ku(mu), kumi",
    steps:
      "1. Tulis radikal benang (糸) di kiri.  2. Tulis bagian 且 di kanan: kotak-kotak bertumpuk.",
    words: [
      ["組む", "kumu - menyusun, bergabung"],
      ["番組", "bangumi - acara TV"],
      ["組織", "soshiki - organisasi"],
    ],
    level: "N3",
  },
  {
    char: "経",
    meaning: "Melalui, ekonomi",
    on: "kei",
    kun: "he(ru)",
    steps:
      "1. Tulis radikal benang (糸) di kiri.  2. Tulis bagian 圣 di kanan: garis-garis dan bagian tanah.",
    words: [
      ["経済", "keizai - ekonomi"],
      ["経験", "keiken - pengalaman"],
      ["経る", "heru - melalui, melewati"],
    ],
    level: "N3",
  },
  {
    char: "給",
    meaning: "Gaji, memberi",
    on: "kyuu",
    kun: "tama(u)",
    steps:
      "1. Tulis radikal benang (糸) di kiri.  2. Tulis bagian 合 di kanan: atap kecil dan kotak mulut.",
    words: [
      ["給料", "kyuuryou - gaji"],
      ["給食", "kyuushoku - makan siang sekolah"],
      ["支給", "shikyuu - pemberian, tunjangan"],
    ],
    level: "N3",
  },
  {
    char: "絵",
    meaning: "Gambar, lukisan",
    on: "kai, e",
    kun: "",
    steps:
      "1. Tulis radikal benang (糸) di kiri.  2. Tulis bagian 会 di kanan: atap kecil dan kotak mulut.",
    words: [
      ["絵", "e - gambar"],
      ["絵画", "kaiga - lukisan"],
      ["絵本", "ehon - buku bergambar"],
    ],
    level: "N3",
  },
  {
    char: "絶",
    meaning: "Terputus, mutlak",
    on: "zetsu",
    kun: "ta(eru)",
    steps:
      "1. Tulis radikal benang (糸) di kiri.  2. Tulis bagian 色 (warna) di kanan.",
    words: [
      ["絶対", "zettai - mutlak"],
      ["絶える", "taeru - terputus"],
      ["絶望", "zetsubou - putus asa"],
    ],
    level: "N3",
  },
  {
    char: "続",
    meaning: "Berlanjut",
    on: "zoku",
    kun: "tsuzu(ku), tsuzu(keru)",
    steps:
      "1. Tulis radikal benang (糸) di kiri.  2. Tulis bagian 売 (menjual) di kanan.",
    words: [
      ["続く", "tsuzuku - berlanjut"],
      ["続ける", "tsuzukeru - melanjutkan"],
      ["継続", "keizoku - kelanjutan"],
    ],
    level: "N3",
  },
  {
    char: "緒",
    meaning: "Tali, permulaan",
    on: "sho",
    kun: "o",
    steps:
      "1. Tulis radikal benang (糸) di kiri.  2. Tulis bagian 者 di kanan: bagian orang dan matahari.",
    words: [
      ["一緒", "issho - bersama"],
      ["緒", "o - tali"],
      ["情緒", "joucho - suasana hati"],
    ],
    level: "N3",
  },
  {
    char: "罪",
    meaning: "Dosa, kejahatan",
    on: "zai",
    kun: "tsumi",
    steps:
      "1. Tulis jaring (罒) di atas.  2. Tutup dengan bagian 非 di bawah: sapuan-sapuan sejajar yang berlawanan arah.",
    words: [
      ["罪", "tsumi - dosa"],
      ["犯罪", "hanzai - kejahatan"],
      ["謝罪", "shazai - permintaan maaf"],
    ],
    level: "N3",
  },
  {
    char: "置",
    meaning: "Meletakkan",
    on: "chi",
    kun: "o(ku)",
    steps:
      "1. Tulis jaring (罒) di atas.  2. Tutup dengan bagian 直 di bawah: mata dan garis tegak.",
    words: [
      ["置く", "oku - meletakkan"],
      ["位置", "ichi - posisi"],
      ["装置", "souchi - alat, perangkat"],
    ],
    level: "N3",
  },
  {
    char: "美",
    meaning: "Indah, cantik",
    on: "bi",
    kun: "utsuku(shii)",
    steps:
      "1. Tulis domba (羊) di atas.  2. Tutup dengan bagian besar (大) di bawah.",
    words: [
      ["美しい", "utsukushii - indah"],
      ["美人", "bijin - wanita cantik"],
      ["美術", "bijutsu - seni rupa"],
    ],
    level: "N3",
  },
  {
    char: "老",
    meaning: "Tua",
    on: "rou",
    kun: "o(iru)",
    steps:
      "1. Tulis bagian atas menyerupai tanah (土) dengan sapuan miring.  2. Tutup dengan sapuan melengkung panjang di bawah.",
    words: [
      ["老人", "roujin - orang tua, lansia"],
      ["老いる", "oiru - menua"],
      ["老後", "rougo - masa tua"],
    ],
    level: "N3",
  },
  {
    char: "職",
    meaning: "Pekerjaan, jabatan",
    on: "shoku",
    kun: "",
    steps:
      "1. Tulis radikal telinga (耳) di kiri.  2. Tulis bagian kanan menyerupai 音 di atas dan 戈 di bawah.",
    words: [
      ["職業", "shokugyou - profesi"],
      ["就職", "shuushoku - mencari kerja"],
      ["職員", "shokuin - staf, pegawai"],
    ],
    level: "N3",
  },
  {
    char: "育",
    meaning: "Membesarkan, mendidik",
    on: "iku",
    kun: "soda(tsu), soda(teru)",
    steps:
      "1. Tulis bagian atas menyerupai bentuk anak terbalik.  2. Tutup dengan bagian bulan/daging (月) di bawah.",
    words: [
      ["育つ", "sodatsu - tumbuh"],
      ["育てる", "sodateru - membesarkan"],
      ["教育", "kyouiku - pendidikan"],
    ],
    level: "N3",
  },
  {
    char: "背",
    meaning: "Punggung, tinggi badan",
    on: "hai",
    kun: "se",
    steps:
      "1. Tulis bagian utara (北) di atas.  2. Tutup dengan radikal daging (月) di bawah.",
    words: [
      ["背中", "senaka - punggung"],
      ["背が高い", "se ga takai - bertubuh tinggi"],
      ["背景", "haikei - latar belakang"],
    ],
    level: "N3",
  },
  {
    char: "能",
    meaning: "Kemampuan, bakat",
    on: "nou",
    kun: "",
    steps:
      "1. Tulis bagian kiri menyerupai bulan kecil (⺼) dengan sapuan di atasnya.  2. Tulis dua sapuan melengkung (匕匕) di kanan.",
    words: [
      ["可能", "kanou - mungkin, bisa"],
      ["才能", "sainou - bakat"],
      ["能力", "nouryoku - kemampuan"],
    ],
    level: "N3",
  },
  {
    char: "腹",
    meaning: "Perut",
    on: "fuku",
    kun: "hara",
    steps:
      "1. Tulis radikal daging (月) di kiri.  2. Tulis bagian 复 di kanan: atap kecil, kotak, dan sapuan-sapuan di bawah.",
    words: [
      ["お腹", "onaka - perut"],
      ["腹痛", "fukutsuu - sakit perut"],
      ["空腹", "kuufuku - lapar"],
    ],
    level: "N3",
  },
  {
    char: "舞",
    meaning: "Tarian, menari",
    on: "bu",
    kun: "ma(u)",
    steps:
      "1. Tulis bagian atas menyerupai kanji 無 tanpa titik-titik.  2. Tutup dengan bagian kaki bersilang (舛) di bawah.",
    words: [
      ["舞台", "butai - panggung"],
      ["舞う", "mau - menari, beterbangan"],
      ["見舞い", "mimai - menjenguk"],
    ],
    level: "N3",
  },
  {
    char: "船",
    meaning: "Kapal, perahu",
    on: "sen",
    kun: "fune, funa",
    steps:
      "1. Tulis radikal perahu (舟) di kiri.  2. Tulis bagian 几 dan kotak kecil di kanan.",
    words: [
      ["船", "fune - kapal"],
      ["風船", "fuusen - balon"],
      ["船便", "funabin - pos laut"],
    ],
    level: "N3",
  },
  {
    char: "良",
    meaning: "Baik, bagus",
    on: "ryou",
    kun: "yo(i)",
    steps:
      "1. Tulis titik kecil dan garis mendatar di atas.  2. Tutup dengan sapuan menyilang dan kaki melebar di bawah.",
    words: [
      ["良い", "yoi - baik"],
      ["良心", "ryoushin - hati nurani"],
      ["改良", "kairyou - perbaikan"],
    ],
    level: "N3",
  },
  {
    char: "若",
    meaning: "Muda",
    on: "jaku",
    kun: "waka(i)",
    steps:
      "1. Tulis radikal rumput (艹) di atas.  2. Tutup dengan bagian mulut dan tangan (右) di bawah.",
    words: [
      ["若い", "wakai - muda"],
      ["若者", "wakamono - anak muda"],
      ["若干", "jakkan - sedikit"],
    ],
    level: "N3",
  },
  {
    char: "苦",
    meaning: "Pahit, menderita",
    on: "ku",
    kun: "kuru(shii), niga(i)",
    steps:
      "1. Tulis radikal rumput (艹) di atas.  2. Tutup dengan bagian kuno (古) di bawah: garis mendatar dan kotak mulut.",
    words: [
      ["苦しい", "kurushii - menyakitkan, sulit"],
      ["苦手", "nigate - tidak pandai, kurang suka"],
      ["苦労", "kurou - kesulitan, kerja keras"],
    ],
    level: "N3",
  },
  {
    char: "草",
    meaning: "Rumput",
    on: "sou",
    kun: "kusa",
    steps:
      "1. Tulis radikal rumput (艹) di atas.  2. Tutup dengan bagian pagi (早) di bawah.",
    words: [
      ["草", "kusa - rumput"],
      ["草原", "sougen - padang rumput"],
      ["海草", "kaisou - rumput laut"],
    ],
    level: "N3",
  },
  {
    char: "落",
    meaning: "Jatuh, gugur",
    on: "raku",
    kun: "o(chiru), o(tosu)",
    steps:
      "1. Tulis radikal rumput (艹) di atas.  2. Tulis radikal air (氵) di kiri bawah.  3. Tulis bagian 各 di kanan bawah.",
    words: [
      ["落ちる", "ochiru - jatuh"],
      ["落とす", "otosu - menjatuhkan"],
      ["落第", "rakudai - tidak lulus ujian"],
    ],
    level: "N3",
  },
  {
    char: "葉",
    meaning: "Daun",
    on: "you",
    kun: "ha",
    steps:
      "1. Tulis radikal rumput (艹) di atas.  2. Tulis bagian generasi (世) di tengah.  3. Tutup dengan radikal pohon (木) di bawah.",
    words: [
      ["葉", "ha - daun"],
      ["言葉", "kotoba - kata, bahasa"],
      ["紅葉", "kouyou - daun musim gugur"],
    ],
    level: "N3",
  },
  {
    char: "薬",
    meaning: "Obat",
    on: "yaku",
    kun: "kusuri",
    steps:
      "1. Tulis radikal rumput (艹) di atas.  2. Tutup dengan bagian musik/senang (楽) di bawah.",
    words: [
      ["薬", "kusuri - obat"],
      ["薬局", "yakkyoku - apotek"],
      ["火薬", "kayaku - bubuk mesiu"],
    ],
    level: "N3",
  },
  {
    char: "術",
    meaning: "Teknik, seni",
    on: "jutsu",
    kun: "sube",
    steps:
      "1. Tulis radikal jalan (行) mengelilingi kiri dan kanan.  2. Isi dengan bagian 术 di tengah.",
    words: [
      ["技術", "gijutsu - teknologi, teknik"],
      ["手術", "shujutsu - operasi bedah"],
      ["芸術", "geijutsu - seni"],
    ],
    level: "N3",
  },
  {
    char: "表",
    meaning: "Permukaan, tabel",
    on: "hyou",
    kun: "omote, arawa(su)",
    steps:
      "1. Tulis garis mendatar dan sapuan kecil di atas.  2. Tutup dengan bagian baju (衣) di bawah.",
    words: [
      ["表", "hyou - tabel"],
      ["表す", "arawasu - menyatakan, menunjukkan"],
      ["発表", "happyou - presentasi, pengumuman"],
    ],
    level: "N3",
  },
  {
    char: "要",
    meaning: "Perlu, penting",
    on: "you",
    kun: "i(ru)",
    steps:
      "1. Tulis bagian tutup barat (覀) di atas.  2. Tutup dengan radikal perempuan (女) di bawah.",
    words: [
      ["必要", "hitsuyou - perlu"],
      ["要る", "iru - perlu, butuh"],
      ["重要", "juuyou - penting"],
    ],
    level: "N3",
  },
  {
    char: "規",
    meaning: "Aturan, standar",
    on: "ki",
    kun: "",
    steps:
      "1. Tulis bagian suami (夫) di kiri.  2. Tulis radikal melihat (見) di kanan.",
    words: [
      ["規則", "kisoku - peraturan"],
      ["規模", "kibo - skala"],
      ["規定", "kitei - ketentuan"],
    ],
    level: "N3",
  },
  {
    char: "覚",
    meaning: "Ingat, sadar",
    on: "kaku",
    kun: "obo(eru), sa(meru)",
    steps:
      "1. Tulis bagian atas menyerupai kanji belajar (学) tanpa bagian anak.  2. Tutup dengan radikal melihat (見) di bawah.",
    words: [
      ["覚える", "oboeru - mengingat"],
      ["覚める", "sameru - terbangun, sadar"],
      ["感覚", "kankaku - indra, perasaan"],
    ],
    level: "N3",
  },
  {
    char: "観",
    meaning: "Pandangan, pemandangan",
    on: "kan",
    kun: "",
    steps:
      "1. Tulis bagian 雚 di kiri: kotak-kotak kecil dan bentuk burung.  2. Tulis radikal melihat (見) di kanan.",
    words: [
      ["観光", "kankou - wisata"],
      ["観察", "kansatsu - observasi"],
      ["楽観的", "rakkanteki - optimis"],
    ],
    level: "N3",
  },
  {
    char: "解",
    meaning: "Memahami, menguraikan",
    on: "kai",
    kun: "to(ku), waka(ru)",
    steps:
      "1. Tulis radikal tanduk (角) di kiri.  2. Tulis radikal pisau (刀) di kanan atas.  3. Tutup dengan radikal sapi (牛) di kanan bawah.",
    words: [
      ["理解", "rikai - memahami"],
      ["解く", "toku - memecahkan (soal), melepas"],
      ["解決", "kaiketsu - penyelesaian"],
    ],
    level: "N3",
  },
  {
    char: "記",
    meaning: "Mencatat, catatan",
    on: "ki",
    kun: "shiru(su)",
    steps:
      "1. Tulis radikal kata (言) di kiri.  2. Tulis bagian diri sendiri (己) di kanan.",
    words: [
      ["日記", "nikki - buku harian"],
      ["記録", "kiroku - rekor, catatan"],
      ["記憶", "kioku - ingatan"],
    ],
    level: "N3",
  },
  {
    char: "訪",
    meaning: "Mengunjungi, berkunjung",
    on: "hou",
    kun: "otozu(reru), tazu(neru)",
    steps:
      "1. Tulis radikal kata (言) di kiri.  2. Tulis bagian arah (方) di kanan.",
    words: [
      ["訪問", "houmon - kunjungan"],
      ["訪れる", "otozureru - mengunjungi, datang"],
      ["訪ねる", "tazuneru - mengunjungi seseorang"],
    ],
    level: "N3",
  },
  {
    char: "許",
    meaning: "Mengizinkan, izin",
    on: "kyo",
    kun: "yuru(su)",
    steps:
      "1. Tulis radikal kata (言) di kiri.  2. Tulis bagian siang (午) di kanan.",
    words: [
      ["許す", "yurusu - mengizinkan, memaafkan"],
      ["許可", "kyoka - izin"],
      ["免許", "menkyo - lisensi, SIM"],
    ],
    level: "N3",
  },
  {
    char: "認",
    meaning: "Mengakui, mengenali",
    on: "nin",
    kun: "mito(meru)",
    steps:
      "1. Tulis radikal kata (言) di kiri.  2. Tulis bagian sabar (忍) di kanan: pisau di atas hati (心).",
    words: [
      ["認める", "mitomeru - mengakui"],
      ["確認", "kakunin - konfirmasi"],
      ["承認", "shounin - persetujuan"],
    ],
    level: "N3",
  },
  {
    char: "誤",
    meaning: "Kesalahan, keliru",
    on: "go",
    kun: "ayama(ru)",
    steps: "1. Tulis radikal kata (言) di kiri.  2. Tulis bagian 呉 di kanan.",
    words: [
      ["誤る", "ayamaru - berbuat salah"],
      ["誤解", "gokai - salah paham"],
      ["誤差", "gosa - selisih, margin kesalahan"],
    ],
    level: "N3",
  },
  {
    char: "説",
    meaning: "Pendapat, penjelasan",
    on: "setsu",
    kun: "to(ku)",
    steps:
      "1. Tulis radikal kata (言) di kiri.  2. Tulis bagian 兌 di kanan: kotak kecil dan kaki melebar.",
    words: [
      ["説明", "setsumei - penjelasan"],
      ["小説", "shousetsu - novel"],
      ["説く", "toku - menjelaskan, menasihati"],
    ],
    level: "N3",
  },
  {
    char: "調",
    meaning: "Menyelidiki, menyesuaikan",
    on: "chou",
    kun: "shira(beru), totono(u)",
    steps:
      "1. Tulis radikal kata (言) di kiri.  2. Tulis bagian sekeliling (周) di kanan.",
    words: [
      ["調べる", "shiraberu - memeriksa"],
      ["調子", "choushi - kondisi"],
      ["調整", "chousei - penyesuaian"],
    ],
    level: "N3",
  },
  {
    char: "談",
    meaning: "Berbincang, berunding",
    on: "dan",
    kun: "",
    steps:
      "1. Tulis radikal kata (言) di kiri.  2. Tulis dua bagian api (火火) bertumpuk di kanan.",
    words: [
      ["相談", "soudan - konsultasi"],
      ["談話", "danwa - percakapan"],
      ["冗談", "joudan - lelucon"],
    ],
    level: "N3",
  },
  {
    char: "論",
    meaning: "Argumen, pembahasan",
    on: "ron",
    kun: "",
    steps:
      "1. Tulis radikal kata (言) di kiri.  2. Tulis bagian 侖 di kanan: atap kecil dan kotak-kotak.",
    words: [
      ["論文", "ronbun - makalah, skripsi"],
      ["議論", "giron - diskusi, debat"],
      ["結論", "ketsuron - kesimpulan"],
    ],
    level: "N3",
  },
  {
    char: "識",
    meaning: "Pengetahuan, mengenali",
    on: "shiki",
    kun: "",
    steps:
      "1. Tulis radikal kata (言) di kiri.  2. Tulis bagian suara (音) di kanan atas.  3. Tutup dengan bagian tombak (戈) di kanan bawah.",
    words: [
      ["意識", "ishiki - kesadaran"],
      ["知識", "chishiki - pengetahuan"],
      ["常識", "joushiki - akal sehat, pengetahuan umum"],
    ],
    level: "N3",
  },
  {
    char: "警",
    meaning: "Waspada, memperingatkan",
    on: "kei",
    kun: "",
    steps:
      "1. Tulis bagian menghormati (敬) di atas.  2. Tutup dengan radikal kata (言) di bawah.",
    words: [
      ["警察", "keisatsu - polisi"],
      ["警告", "keikoku - peringatan"],
      ["警備", "keibi - keamanan, penjagaan"],
    ],
    level: "N3",
  },
  {
    char: "議",
    meaning: "Musyawarah, perundingan",
    on: "gi",
    kun: "",
    steps:
      "1. Tulis radikal kata (言) di kiri.  2. Tulis bagian kebenaran (義) di kanan.",
    words: [
      ["会議", "kaigi - rapat"],
      ["議論", "giron - diskusi"],
      ["議員", "giin - anggota dewan"],
    ],
    level: "N3",
  },
  {
    char: "負",
    meaning: "Kalah, menanggung",
    on: "fu",
    kun: "ma(keru), o(u)",
    steps:
      "1. Tulis sapuan menyerupai orang membungkuk di atas.  2. Tutup dengan radikal uang kerang (貝) di bawah.",
    words: [
      ["負ける", "makeru - kalah"],
      ["負担", "futan - beban"],
      ["勝負", "shoubu - pertandingan, menang-kalah"],
    ],
    level: "N3",
  },
  {
    char: "財",
    meaning: "Harta, kekayaan",
    on: "zai",
    kun: "takara",
    steps:
      "1. Tulis radikal uang kerang (貝) di kiri.  2. Tulis bagian bakat (才) di kanan.",
    words: [
      ["財布", "saifu - dompet"],
      ["財産", "zaisan - harta benda"],
      ["財政", "zaisei - keuangan (negara)"],
    ],
    level: "N3",
  },
  {
    char: "貧",
    meaning: "Miskin",
    on: "hin, bin",
    kun: "mazu(shii)",
    steps:
      "1. Tulis bagian membagi (分) di atas.  2. Tutup dengan radikal uang kerang (貝) di bawah.",
    words: [
      ["貧しい", "mazushii - miskin"],
      ["貧乏", "binbou - kemiskinan"],
      ["貧困", "hinkon - kemiskinan"],
    ],
    level: "N3",
  },
  {
    char: "責",
    meaning: "Tanggung jawab, menyalahkan",
    on: "seki",
    kun: "se(meru)",
    steps:
      "1. Tulis bagian atas menyerupai duri kecil.  2. Tutup dengan radikal uang kerang (貝) di bawah.",
    words: [
      ["責任", "sekinin - tanggung jawab"],
      ["責める", "semeru - menyalahkan"],
      ["自責", "jiseki - menyalahkan diri sendiri"],
    ],
    level: "N3",
  },
  {
    char: "費",
    meaning: "Biaya, pengeluaran",
    on: "hi",
    kun: "tsui(yasu)",
    steps:
      "1. Tulis bagian 弗 di atas.  2. Tutup dengan radikal uang kerang (貝) di bawah.",
    words: [
      ["費用", "hiyou - biaya"],
      ["消費", "shouhi - konsumsi"],
      ["費やす", "tsuiyasu - menghabiskan (waktu, uang)"],
    ],
    level: "N3",
  },
  {
    char: "資",
    meaning: "Modal, dana",
    on: "shi",
    kun: "",
    steps:
      "1. Tulis bagian berikutnya (次) di atas.  2. Tutup dengan radikal uang kerang (貝) di bawah.",
    words: [
      ["資料", "shiryou - materi, dokumen"],
      ["資金", "shikin - dana"],
      ["投資", "toushi - investasi"],
    ],
    level: "N3",
  },
  {
    char: "賛",
    meaning: "Setuju, mendukung",
    on: "san",
    kun: "",
    steps:
      "1. Tulis dua bagian lebih dulu (先先) di atas.  2. Tutup dengan radikal uang kerang (貝) di bawah.",
    words: [
      ["賛成", "sansei - setuju"],
      ["賛美", "sanbi - pujian"],
      ["協賛", "kyousan - sponsor, dukungan"],
    ],
    level: "N3",
  },
  {
    char: "越",
    meaning: "Melewati, melampaui",
    on: "etsu",
    kun: "ko(su), ko(eru)",
    steps:
      "1. Tulis radikal berlari (走) di kiri.  2. Tulis bagian 戉 di kanan.",
    words: [
      ["引っ越す", "hikkosu - pindah rumah"],
      ["超越", "chouetsu - melampaui, transenden"],
      ["越える", "koeru - melewati, melampaui"],
    ],
    level: "N3",
  },
  {
    char: "路",
    meaning: "Jalan",
    on: "ro",
    kun: "michi",
    steps: "1. Tulis radikal kaki (足) di kiri.  2. Tulis bagian 各 di kanan.",
    words: [
      ["道路", "douro - jalan raya"],
      ["通路", "tsuuro - lorong, gang"],
      ["線路", "senro - rel kereta"],
    ],
    level: "N3",
  },
  {
    char: "辞",
    meaning: "Mengundurkan diri, kata",
    on: "ji",
    kun: "ya(meru)",
    steps:
      "1. Tulis bagian kiri menyerupai lidah terbalik.  2. Tulis bagian pedas (辛) di kanan.",
    words: [
      ["辞書", "jisho - kamus"],
      ["辞める", "yameru - berhenti (kerja)"],
      ["辞退", "jitai - menolak dengan sopan"],
    ],
    level: "N3",
  },
  {
    char: "込",
    meaning: "Penuh, termasuk",
    on: "",
    kun: "ko(mu)",
    steps:
      "1. Tulis radikal berjalan (辶) mengelilingi bawah kiri.  2. Isi dengan bagian masuk (入) di dalamnya.",
    words: [
      ["申し込む", "moushikomu - mendaftar, mengajukan"],
      ["込む", "komu - penuh sesak"],
      ["振り込む", "furikomu - mentransfer (uang)"],
    ],
    level: "N3",
  },
  {
    char: "迎",
    meaning: "Menyambut",
    on: "gei",
    kun: "muka(eru)",
    steps:
      "1. Tulis bagian 卬 di kanan atas.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["迎える", "mukaeru - menyambut"],
      ["出迎え", "demukae - penyambutan, jemputan"],
      ["歓迎", "kangei - selamat datang"],
    ],
    level: "N3",
  },
  {
    char: "返",
    meaning: "Mengembalikan",
    on: "hen",
    kun: "kae(su)",
    steps:
      "1. Tulis bagian berlawanan (反) di kanan atas.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["返す", "kaesu - mengembalikan"],
      ["返事", "henji - balasan, jawaban"],
      ["返却", "henkyaku - pengembalian"],
    ],
    level: "N3",
  },
  {
    char: "迷",
    meaning: "Tersesat, bingung",
    on: "mei",
    kun: "mayo(u)",
    steps:
      "1. Tulis bagian beras (米) di kanan atas.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["迷う", "mayou - bingung, tersesat"],
      ["迷子", "maigo - anak hilang"],
      ["迷惑", "meiwaku - gangguan, merepotkan"],
    ],
    level: "N3",
  },
  {
    char: "追",
    meaning: "Mengejar",
    on: "tsui",
    kun: "o(u)",
    steps:
      "1. Tulis bagian atas menyerupai potongan daging kecil.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["追う", "ou - mengejar"],
      ["追加", "tsuika - tambahan"],
      ["追跡", "tsuiseki - pelacakan, mengejar"],
    ],
    level: "N3",
  },
  {
    char: "退",
    meaning: "Mundur, keluar",
    on: "tai",
    kun: "shirizo(ku)",
    steps:
      "1. Tulis bagian 艮 di kanan atas.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["退院", "taiin - keluar rumah sakit"],
      ["退屈", "taikutsu - bosan"],
      ["引退", "intai - pensiun"],
    ],
    level: "N3",
  },
  {
    char: "逃",
    meaning: "Melarikan diri, kabur",
    on: "tou",
    kun: "ni(geru)",
    steps:
      "1. Tulis bagian tanda/pertanda (兆) di kanan atas.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["逃げる", "nigeru - melarikan diri"],
      ["逃す", "nogasu - melewatkan kesempatan"],
      ["逃亡", "toubou - pelarian"],
    ],
    level: "N3",
  },
  {
    char: "途",
    meaning: "Jalan, rute",
    on: "to",
    kun: "michi",
    steps:
      "1. Tulis bagian sisa (余) di kanan atas.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["途中", "tochuu - di tengah jalan"],
      ["用途", "youto - kegunaan"],
      ["途上国", "tojoukoku - negara berkembang"],
    ],
    level: "N3",
  },
  {
    char: "速",
    meaning: "Cepat",
    on: "soku",
    kun: "haya(i)",
    steps:
      "1. Tulis bagian ikat (束) di kanan atas.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["速い", "hayai - cepat"],
      ["速度", "sokudo - kecepatan"],
      ["高速", "kousoku - kecepatan tinggi, jalan tol"],
    ],
    level: "N3",
  },
  {
    char: "連",
    meaning: "Menghubungkan, mengajak",
    on: "ren",
    kun: "tsu(reru)",
    steps:
      "1. Tulis bagian kendaraan (車) di kanan atas.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["連れる", "tsureru - membawa (seseorang)"],
      ["連絡", "renraku - kontak, menghubungi"],
      ["連休", "renkyuu - libur panjang"],
    ],
    level: "N3",
  },
  {
    char: "進",
    meaning: "Maju",
    on: "shin",
    kun: "susu(mu)",
    steps:
      "1. Tulis bagian burung pendek (隹) di kanan atas.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["進む", "susumu - maju"],
      ["進歩", "shinpo - kemajuan"],
      ["前進", "zenshin - maju ke depan"],
    ],
    level: "N3",
  },
  {
    char: "遅",
    meaning: "Lambat, terlambat",
    on: "chi",
    kun: "oku(reru), oso(i)",
    steps:
      "1. Tulis bagian atas menyerupai tubuh (尸) dengan garis-garis.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["遅れる", "okureru - terlambat"],
      ["遅い", "osoi - lambat"],
      ["遅刻", "chikoku - keterlambatan (masuk sekolah/kerja)"],
    ],
    level: "N3",
  },
  {
    char: "遊",
    meaning: "Bermain",
    on: "yuu",
    kun: "aso(bu)",
    steps:
      "1. Tulis bagian arah (方) dan anak (子) di kanan atas.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["遊ぶ", "asobu - bermain"],
      ["遊園地", "yuuenchi - taman hiburan"],
      ["遊び相手", "asobiaite - teman bermain"],
    ],
    level: "N3",
  },
  {
    char: "過",
    meaning: "Melewati, berlebihan",
    on: "ka",
    kun: "su(giru)",
    steps:
      "1. Tulis bagian 咼 di kanan atas: kotak mulut dan sapuan.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["過ぎる", "sugiru - melewati, berlebihan"],
      ["過去", "kako - masa lalu"],
      ["過程", "katei - proses"],
    ],
    level: "N3",
  },
  {
    char: "達",
    meaning: "Mencapai, sampai",
    on: "tatsu",
    kun: "tachi",
    steps:
      "1. Tulis bagian atas menyerupai domba kecil (羍).  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["友達", "tomodachi - teman"],
      ["発達", "hattatsu - perkembangan"],
      ["達成", "tassei - pencapaian"],
    ],
    level: "N3",
  },
  {
    char: "違",
    meaning: "Berbeda, salah",
    on: "i",
    kun: "chiga(u)",
    steps:
      "1. Tulis bagian kulit (韋) di kanan atas.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["違う", "chigau - berbeda"],
      ["間違い", "machigai - kesalahan"],
      ["違反", "ihan - pelanggaran"],
    ],
    level: "N3",
  },
  {
    char: "遠",
    meaning: "Jauh",
    on: "en",
    kun: "too(i)",
    steps:
      "1. Tulis bagian 袁 di kanan atas.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["遠い", "tooi - jauh"],
      ["遠足", "ensoku - tamasya, darmawisata"],
      ["永遠", "eien - keabadian"],
    ],
    level: "N3",
  },
  {
    char: "適",
    meaning: "Cocok, sesuai",
    on: "teki",
    kun: "",
    steps:
      "1. Tulis bagian 啇 di kanan atas: atap kecil dan kotak mulut.  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["適当", "tekitou - sesuai, asal-asalan"],
      ["適切", "tekisetsu - tepat"],
      ["快適", "kaiteki - nyaman"],
    ],
    level: "N3",
  },
  {
    char: "選",
    meaning: "Memilih",
    on: "sen",
    kun: "era(bu)",
    steps:
      "1. Tulis bagian atas menyerupai dua orang (己己) di atas bagian bersama (共).  2. Tutup dengan radikal berjalan (辶) di kiri bawah.",
    words: [
      ["選ぶ", "erabu - memilih"],
      ["選手", "senshu - atlet"],
      ["選挙", "senkyo - pemilihan umum"],
    ],
    level: "N3",
  },
  {
    char: "部",
    meaning: "Bagian, departemen",
    on: "bu",
    kun: "",
    steps:
      "1. Tulis bagian berdiri (立) dan kotak mulut (口) di kiri.  2. Tulis radikal bukit (阝) di kanan.",
    words: [
      ["部分", "bubun - bagian"],
      ["全部", "zenbu - semuanya"],
      ["部長", "buchou - kepala departemen"],
    ],
    level: "N3",
  },
  {
    char: "都",
    meaning: "Ibu kota, kota besar",
    on: "to, tsu",
    kun: "miyako",
    steps:
      "1. Tulis bagian orang (者) di kiri.  2. Tulis radikal bukit (阝) di kanan.",
    words: [
      ["都市", "toshi - kota besar"],
      ["都合", "tsugou - keadaan, kenyamanan waktu"],
      ["首都", "shuto - ibu kota"],
    ],
    level: "N3",
  },
  {
    char: "配",
    meaning: "Membagikan, mengantar",
    on: "hai",
    kun: "kuba(ru)",
    steps:
      "1. Tulis radikal arak (酉) di kiri.  2. Tulis bagian diri sendiri (己) di kanan.",
    words: [
      ["配る", "kubaru - membagikan"],
      ["心配", "shinpai - khawatir"],
      ["配達", "haitatsu - pengiriman"],
    ],
    level: "N3",
  },
  {
    char: "酒",
    meaning: "Sake, alkohol",
    on: "shu",
    kun: "sake, saka",
    steps:
      "1. Tulis radikal air (氵) di kiri.  2. Tulis radikal arak (酉) di kanan.",
    words: [
      ["お酒", "osake - sake, minuman keras"],
      ["酒屋", "sakaya - toko minuman keras"],
      ["日本酒", "nihonshu - sake Jepang"],
    ],
    level: "N3",
  },
  {
    char: "閉",
    meaning: "Menutup",
    on: "hei",
    kun: "to(jiru), shi(meru)",
    steps:
      "1. Tulis bingkai pintu (門) mengelilingi.  2. Isi dengan bagian bakat (才) di dalamnya.",
    words: [
      ["閉じる", "tojiru - menutup"],
      ["閉店", "heiten - tutup toko"],
      ["閉める", "shimeru - menutup (pintu)"],
    ],
    level: "N3",
  },
  {
    char: "関",
    meaning: "Hubungan, berkaitan",
    on: "kan",
    kun: "seki, kaka(waru)",
    steps:
      "1. Tulis bingkai pintu (門) mengelilingi.  2. Isi dengan bagian dalam berupa dua silang kecil dan garis bawah.",
    words: [
      ["関係", "kankei - hubungan"],
      ["玄関", "genkan - pintu masuk rumah"],
      ["関わる", "kakawaru - terlibat, berkaitan"],
    ],
    level: "N3",
  },
  {
    char: "降",
    meaning: "Turun",
    on: "kou",
    kun: "o(riru), fu(ru)",
    steps:
      "1. Tulis radikal bukit (阝) di kiri.  2. Tulis bagian 夅 di kanan: dua sapuan kaki berlawanan.",
    words: [
      ["降りる", "oriru - turun (dari kendaraan)"],
      ["降る", "furu - turun (hujan, salju)"],
      ["以降", "ikou - sejak, setelah itu"],
    ],
    level: "N3",
  },
  {
    char: "限",
    meaning: "Batas, membatasi",
    on: "gen",
    kun: "kagi(ru)",
    steps: "1. Tulis radikal bukit (阝) di kiri.  2. Tulis bagian 艮 di kanan.",
    words: [
      ["限る", "kagiru - membatasi"],
      ["制限", "seigen - pembatasan"],
      ["期限", "kigen - batas waktu"],
    ],
    level: "N3",
  },
  {
    char: "除",
    meaning: "Menghilangkan, kecuali",
    on: "jo, ji",
    kun: "nozo(ku)",
    steps:
      "1. Tulis radikal bukit (阝) di kiri.  2. Tulis bagian sisa (余) di kanan.",
    words: [
      ["除く", "nozoku - menghilangkan, mengecualikan"],
      ["掃除", "souji - membersihkan"],
      ["解除", "kaijo - pembatalan, pelepasan"],
    ],
    level: "N3",
  },
  {
    char: "険",
    meaning: "Curam, berbahaya",
    on: "ken",
    kun: "kewa(shii)",
    steps:
      "1. Tulis radikal bukit (阝) di kiri.  2. Tulis bagian 㑒 di kanan: atap kecil dan dua orang.",
    words: [
      ["危険", "kiken - berbahaya"],
      ["保険", "hoken - asuransi"],
      ["険しい", "kewashii - curam, terjal"],
    ],
    level: "N3",
  },
  {
    char: "陽",
    meaning: "Matahari, cerah",
    on: "you",
    kun: "hi",
    steps:
      "1. Tulis radikal bukit (阝) di kiri.  2. Tulis bagian matahari dan sinar (昜) di kanan.",
    words: [
      ["太陽", "taiyou - matahari"],
      ["陽気", "youki - ceria, cerah"],
      ["陽射し", "hizashi - sinar matahari"],
    ],
    level: "N3",
  },
  {
    char: "際",
    meaning: "Saat, kesempatan",
    on: "sai",
    kun: "kiwa",
    steps:
      "1. Tulis radikal bukit (阝) di kiri.  2. Tulis bagian perayaan (祭) di kanan.",
    words: [
      ["国際", "kokusai - internasional"],
      ["実際", "jissai - kenyataan, sebenarnya"],
      ["窓際", "madogiwa - di samping jendela"],
    ],
    level: "N3",
  },
  {
    char: "雑",
    meaning: "Campur aduk, kasar",
    on: "zatsu",
    kun: "",
    steps:
      "1. Tulis bagian pohon (木) dan sembilan (九) di kiri.  2. Tulis radikal burung pendek (隹) di kanan.",
    words: [
      ["雑誌", "zasshi - majalah"],
      ["複雑", "fukuzatsu - rumit"],
      ["雑音", "zatsuon - suara bising"],
    ],
    level: "N3",
  },
  {
    char: "難",
    meaning: "Sulit, sukar",
    on: "nan",
    kun: "muzuka(shii)",
    steps:
      "1. Tulis bagian 堇 di kiri.  2. Tulis radikal burung pendek (隹) di kanan.",
    words: [
      ["難しい", "muzukashii - sulit"],
      ["困難", "konnan - kesulitan"],
      ["難民", "nanmin - pengungsi"],
    ],
    level: "N3",
  },
  {
    char: "雪",
    meaning: "Salju",
    on: "setsu",
    kun: "yuki",
    steps:
      "1. Tulis radikal hujan (雨) di atas.  2. Tutup dengan bagian tangan kecil (彐) di bawah.",
    words: [
      ["雪", "yuki - salju"],
      ["大雪", "ooyuki - salju lebat"],
      ["雪国", "yukiguni - negeri bersalju"],
    ],
    level: "N3",
  },
  {
    char: "静",
    meaning: "Tenang, sunyi",
    on: "sei",
    kun: "shizu(ka)",
    steps:
      "1. Tulis bagian biru/muda (青) di kiri.  2. Tulis bagian berebut (争) di kanan.",
    words: [
      ["静か", "shizuka - tenang"],
      ["静止", "seishi - diam, statis"],
      ["冷静", "reisei - tenang (pikiran)"],
    ],
    level: "N3",
  },
  {
    char: "非",
    meaning: "Bukan, tidak",
    on: "hi",
    kun: "",
    steps:
      "1. Tulis garis tegak dengan beberapa garis mendatar pendek di kiri.  2. Tulis cerminannya di kanan.",
    words: [
      ["非常に", "hijouni - sangat"],
      ["非常口", "hijouguchi - pintu darurat"],
      ["是非", "zehi - pasti, tolong"],
    ],
    level: "N3",
  },
  {
    char: "面",
    meaning: "Wajah, permukaan",
    on: "men",
    kun: "omote",
    steps:
      "1. Tulis bingkai kotak besar.  2. Isi dengan garis-garis mendatar dan kotak kecil di dalamnya menyerupai wajah.",
    words: [
      ["場面", "bamen - adegan"],
      ["面白い", "omoshiroi - menarik, lucu"],
      ["表面", "hyoumen - permukaan"],
    ],
    level: "N3",
  },
  {
    char: "靴",
    meaning: "Sepatu",
    on: "ka",
    kun: "kutsu",
    steps:
      "1. Tulis radikal kulit (革) di kiri.  2. Tulis bagian berubah (化) di kanan.",
    words: [
      ["靴", "kutsu - sepatu"],
      ["靴下", "kutsushita - kaus kaki"],
      ["運動靴", "undougutsu - sepatu olahraga"],
    ],
    level: "N3",
  },
  {
    char: "頂",
    meaning: "Puncak, menerima",
    on: "chou",
    kun: "itada(ku)",
    steps:
      "1. Tulis bagian paku (丁) di kiri.  2. Tulis radikal kepala (頁) di kanan.",
    words: [
      ["頂く", "itadaku - menerima (sopan)"],
      ["山頂", "sanchou - puncak gunung"],
      ["頂上", "choujou - puncak"],
    ],
    level: "N3",
  },
  {
    char: "頭",
    meaning: "Kepala",
    on: "tou, zu",
    kun: "atama",
    steps:
      "1. Tulis bagian kacang (豆) di kiri.  2. Tulis radikal kepala (頁) di kanan.",
    words: [
      ["頭", "atama - kepala"],
      ["頭痛", "zutsuu - sakit kepala"],
      ["先頭", "sentou - paling depan"],
    ],
    level: "N3",
  },
  {
    char: "頼",
    meaning: "Meminta, mengandalkan",
    on: "rai",
    kun: "tano(mu)",
    steps:
      "1. Tulis bagian kiri menyerupai ikatan (束) dengan sapuan tambahan.  2. Tulis radikal kepala (頁) di kanan.",
    words: [
      ["頼む", "tanomu - meminta tolong"],
      ["信頼", "shinrai - kepercayaan"],
      ["依頼", "irai - permintaan, permohonan"],
    ],
    level: "N3",
  },
  {
    char: "顔",
    meaning: "Wajah",
    on: "gan",
    kun: "kao",
    steps:
      "1. Tulis bagian 彦 di kiri.  2. Tulis radikal kepala (頁) di kanan.",
    words: [
      ["顔", "kao - wajah"],
      ["顔色", "kaoiro - raut wajah"],
      ["洗顔", "sengan - cuci muka"],
    ],
    level: "N3",
  },
  {
    char: "願",
    meaning: "Berharap, memohon",
    on: "gan",
    kun: "nega(u)",
    steps:
      "1. Tulis bagian asal/sumber (原) di kiri.  2. Tulis radikal kepala (頁) di kanan.",
    words: [
      ["願う", "negau - berharap"],
      ["お願いします", "onegaishimasu - tolong, mohon"],
      ["願書", "gansho - formulir permohonan"],
    ],
    level: "N3",
  },
  {
    char: "類",
    meaning: "Jenis, macam",
    on: "rui",
    kun: "tagu(i)",
    steps:
      "1. Tulis bagian beras (米) di kiri atas.  2. Tulis bagian besar (大) di kiri bawah.  3. Tulis radikal kepala (頁) di kanan.",
    words: [
      ["種類", "shurui - jenis"],
      ["人類", "jinrui - umat manusia"],
      ["分類", "bunrui - klasifikasi"],
    ],
    level: "N3",
  },
  {
    char: "飛",
    meaning: "Terbang",
    on: "hi",
    kun: "to(bu)",
    steps:
      "1. Tulis sapuan melengkung menyerupai sayap di kiri.  2. Tulis sapuan cerminannya di kanan dengan beberapa garis pendek.",
    words: [
      ["飛ぶ", "tobu - terbang"],
      ["飛行機", "hikouki - pesawat terbang"],
      ["飛び出す", "tobidasu - melompat keluar tiba-tiba"],
    ],
    level: "N3",
  },
  {
    char: "首",
    meaning: "Leher",
    on: "shu",
    kun: "kubi",
    steps:
      "1. Tulis dua titik kecil di atas.  2. Tutup dengan bagian mirip wajah (自) di bawah.",
    words: [
      ["首", "kubi - leher"],
      ["首都", "shuto - ibu kota"],
      ["首相", "shushou - perdana menteri"],
    ],
    level: "N3",
  },
  {
    char: "馬",
    meaning: "Kuda",
    on: "ba",
    kun: "uma",
    steps:
      "1. Tulis bagian atas menyerupai kepala dan surai kuda.  2. Tutup dengan empat titik kaki (灬) di bawah.",
    words: [
      ["馬", "uma - kuda"],
      ["競馬", "keiba - pacuan kuda"],
      ["馬力", "bariki - tenaga kuda"],
    ],
    level: "N3",
  },
  {
    char: "髪",
    meaning: "Rambut",
    on: "hatsu",
    kun: "kami",
    steps:
      "1. Tulis radikal rambut panjang (髟) di atas.  2. Tutup dengan bagian 犮 di bawah.",
    words: [
      ["髪", "kami - rambut"],
      ["髪型", "kamigata - gaya rambut"],
      ["理髪店", "rihatsuten - salon pangkas rambut"],
    ],
    level: "N3",
  },
  {
    char: "鳴",
    meaning: "Berbunyi, berkicau",
    on: "mei",
    kun: "na(ku), na(ru)",
    steps:
      "1. Tulis kotak mulut (口) di kiri.  2. Tulis radikal burung (鳥) di kanan.",
    words: [
      ["鳴く", "naku - berkicau, bersuara (hewan)"],
      ["鳴る", "naru - berbunyi"],
      ["悲鳴", "himei - jeritan"],
    ],
    level: "N3",
  },
];
