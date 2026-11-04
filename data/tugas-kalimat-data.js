/* Bahan tugas "menyusun kalimat" per Bab (dipakai js/tugas-bab.js).
   Kosakata & kanji TIDAK ditulis di sini - diambil langsung dari
   data/bab-data.js (sama dengan fitur Hafalan).

   tugasKalimatData[bab] = {
     susun: [{ arti, potongan: [...] }]   potongan ditulis dalam URUTAN
            BENAR, SATU nomor = SATU kata atau SATU partikel (は, も, の,
            か, じゃ ...; nama+さん dan negara+じん dihitung satu kata).
            Saat tugas dibuat, urutannya diacak & diberi nomor, lalu siswa
            menuliskan urutan nomor. Jawaban dinilai dari KALIMAT yang
            tersusun, jadi urutan nomor lain yang menghasilkan kalimat sama
            persis tetap benar. Opsional `alt: ["kalimat lain", ...]` untuk
            susunan lain yang juga benar (mis. "A と B" ditukar), ditulis
            dari potongan yang sama (spasi diabaikan).
     pilih: [{ arti, benar, salah: [3 pengecoh] }]   soal berbahasa
            Indonesia, siswa memilih kalimat Jepang yang benar.
   }
   Tiap jenis berisi lebih dari 10 butir; setiap kali tugas dikerjakan
   diambil 10 secara acak dengan urutan acak (TUGAS_KALIMAT_JUMLAH). Bab
   tanpa entri di sini tidak mewajibkan target kalimat. */
const tugasKalimatData = {
  1: {
    susun: [
      { arti: "Saya Mike Miller.", potongan: ["わたし", "は", "マイク・ミラー", "です"] },
      { arti: "Sdr. Santos bukan mahasiswa.", potongan: ["サントスさん", "は", "がくせい", "じゃ", "ありません"] },
      { arti: "Apakah Sdr. Miller orang Amerika?", potongan: ["ミラーさん", "は", "アメリカじん", "です", "か"] },
      { arti: "Sdr. Miller pegawai perusahaan IMC.", potongan: ["ミラーさん", "は", "IMC", "の", "しゃいん", "です"] },
      { arti: "Siapakah beliau? (sopan)", potongan: ["あの", "かた", "は", "どなた", "です", "か"] },
      { arti: "Sdr. Gupta juga pegawai perusahaan.", potongan: ["グプタさん", "も", "かいしゃいん", "です"] },
      { arti: "Saya bukan guru.", potongan: ["わたし", "は", "せんせい", "じゃ", "ありません"] },
      { arti: "Sdr. Wang dokter Rumah Sakit Kobe.", potongan: ["ワンさん", "は", "こうべびょういん", "の", "いしゃ", "です"] },
      { arti: "Teresa umur berapa?", potongan: ["テレサちゃん", "は", "なんさい", "です", "か"] },
      { arti: "Sdri. Karina mahasiswi Universitas Fuji.", potongan: ["カリナさん", "は", "ふじだいがく", "の", "がくせい", "です"] },
      { arti: "Siapakah orang itu? (biasa)", potongan: ["あの", "ひと", "は", "だれ", "です", "か"] },
      { arti: "Sdr. Lee juga orang Korea.", potongan: ["リーさん", "も", "かんこくじん", "です"] },
    ],
    pilih: [
      {
        arti: "Saya orang Indonesia.",
        benar: "わたしは インドネシアじんです。",
        salah: ["わたしの インドネシアじんです。", "わたしは インドネシアじんですか。", "わたしも インドネシアじんじゃ ありません。"],
      },
      {
        arti: "Sdr. Yamada bukan guru.",
        benar: "やまださんは せんせいじゃ ありません。",
        salah: ["やまださんは せんせいです。", "やまださんは せんせいですか。", "やまださんの せんせいじゃ ありません。"],
      },
      {
        arti: "Apakah Sdr. Lee mahasiswa?",
        benar: "リーさんは がくせいですか。",
        salah: ["リーさんは がくせいです。", "リーさんの がくせいですか。", "リーさんは がくせいじゃ ありません。"],
      },
      {
        arti: "Sdr. Santos juga pegawai perusahaan.",
        benar: "サントスさんも かいしゃいんです。",
        salah: ["サントスさんは かいしゃいんです。", "サントスさんの かいしゃいんです。", "サントスさんも かいしゃいんじゃ ありません。"],
      },
      {
        arti: "Siapakah orang itu? (biasa)",
        benar: "あの ひとは だれですか。",
        salah: ["あの ひとは なんさいですか。", "あの ひとは だれじゃ ありません。", "あの ひとの だれですか。"],
      },
      {
        arti: "Sdr. Miller pegawai perusahaan IMC.",
        benar: "ミラーさんは IMCの しゃいんです。",
        salah: ["ミラーさんは IMCも しゃいんです。", "ミラーさんの IMCは しゃいんです。", "IMCは ミラーさんの しゃいんです。"],
      },
      {
        arti: "Maaf, siapa nama Anda?",
        benar: "しつれいですが、おなまえは？",
        salah: ["はじめまして、おなまえは？", "しつれいですが、おいくつですか。", "どうぞ よろしく おねがいします。"],
      },
      {
        arti: "Sdri. Karina bukan mahasiswi Universitas Fuji.",
        benar: "カリナさんは ふじだいがくの がくせいじゃ ありません。",
        salah: ["カリナさんは ふじだいがくの がくせいです。", "カリナさんも ふじだいがくの がくせいじゃ ありません。", "カリナさんの ふじだいがくは がくせいじゃ ありません。"],
      },
      {
        arti: "Ya, saya orang Jepang.",
        benar: "はい、わたしは にほんじんです。",
        salah: ["いいえ、わたしは にほんじんです。", "はい、わたしは にほんじんじゃ ありません。", "はい、わたしの にほんじんです。"],
      },
      {
        arti: "Bukan, saya bukan peneliti.",
        benar: "いいえ、わたしは けんきゅうしゃじゃ ありません。",
        salah: ["はい、わたしは けんきゅうしゃです。", "いいえ、わたしは けんきゅうしゃです。", "いいえ、わたしの けんきゅうしゃじゃ ありません。"],
      },
      {
        arti: "Berapa umur Anda? (sopan)",
        benar: "おいくつですか。",
        salah: ["なんさいですか。", "どなたですか。", "おなまえは？"],
      },
      {
        arti: "Perkenalkan, saya Karina. Saya datang dari Indonesia.",
        benar: "はじめまして。カリナです。インドネシアから きました。",
        salah: ["はじめまして。カリナさんです。インドネシアから きました。", "しつれいですが、カリナです。インドネシアから きました。", "はじめまして。カリナです。インドネシアじん きました。"],
      },
    ],
  },
  2: {
    susun: [
      { arti: "Apakah itu kamus?", potongan: ["それ", "は", "じしょ", "です", "か"] },
      { arti: "Ini payung siapa?", potongan: ["これ", "は", "だれ", "の", "かさ", "です", "か"] },
      { arti: "Buku ini kepunyaan saya.", potongan: ["この", "ほん", "は", "わたし", "の", "です"] },
      { arti: "Ini buku (tentang) komputer.", potongan: ["これ", "は", "コンピューター", "の", "ほん", "です"] },
      { arti: "Itu (jauh) tas siapa?", potongan: ["あれ", "は", "だれ", "の", "かばん", "です", "か"] },
      { arti: "Tas ini bukan kepunyaan saya.", potongan: ["この", "かばん", "は", "わたし", "の", "じゃ", "ありません"] },
      { arti: "Itu majalah (tentang) mobil.", potongan: ["それ", "は", "くるま", "の", "ざっし", "です"] },
      { arti: "Payung itu (jauh) kepunyaan Sdr. Santos.", potongan: ["あの", "かさ", "は", "サントスさん", "の", "です"] },
      { arti: "Apakah kunci ini kepunyaan Anda?", potongan: ["この", "かぎ", "は", "あなた", "の", "です", "か"] },
      { arti: "Itu koran berbahasa Inggris.", potongan: ["それ", "は", "えいご", "の", "しんぶん", "です"] },
      { arti: "Bukan, bukan kepunyaan saya.", potongan: ["いいえ", "わたし", "の", "じゃ", "ありません"] },
      { arti: "Kartu nama itu kepunyaan siapa?", potongan: ["その", "めいし", "は", "だれ", "の", "です", "か"] },
    ],
    pilih: [
      {
        arti: "Apakah itu kamus?",
        benar: "それは じしょですか。",
        salah: ["それは じしょです。", "それの じしょですか。", "その じしょですか。"],
      },
      {
        arti: "Ini payung siapa?",
        benar: "これは だれの かさですか。",
        salah: ["これは だれ かさですか。", "この だれの かさですか。", "これは だれの かさです。"],
      },
      {
        arti: "Buku ini kepunyaan saya.",
        benar: "この ほんは わたしのです。",
        salah: ["これ ほんは わたしのです。", "この ほんは わたしです。", "この ほんの わたしのです。"],
      },
      {
        arti: "(Apakah itu kamus?) Ya, betul.",
        benar: "はい、そうです。",
        salah: ["はい、そうですか。", "はい、ちがいます。", "いいえ、そうです。"],
      },
      {
        arti: "(Apakah itu punya Sdr. Miller?) Bukan.",
        benar: "いいえ、ちがいます。",
        salah: ["いいえ、そうです。", "はい、ちがいます。", "いいえ、そうですか。"],
      },
      {
        arti: "Apakah itu bolpoin atau pensil mekanik?",
        benar: "それは ボールペンですか、シャープペンシルですか。",
        salah: ["それは ボールペンですか、シャープペンシルです。", "それは ボールペンも シャープペンシルですか。", "それは ボールペンの シャープペンシルですか。"],
      },
      {
        arti: "Ini buku (tentang) komputer.",
        benar: "これは コンピューターの ほんです。",
        salah: ["これは ほんの コンピューターです。", "これは コンピューター ほんです。", "この コンピューターの ほんです。"],
      },
      {
        arti: "Itu (jauh) tas siapa?",
        benar: "あれは だれの かばんですか。",
        salah: ["あれは だれ かばんですか。", "あの だれの かばんですか。", "あれは だれの かばんです。"],
      },
      {
        arti: "(Itu tas siapa?) Kepunyaan Sdr. Sato.",
        benar: "さとうさんのです。",
        salah: ["さとうさんです。", "さとうさんも です。", "さとうさんのじゃ ありません。"],
      },
      {
        arti: "Tas ini bukan kepunyaan saya.",
        benar: "この かばんは わたしのじゃ ありません。",
        salah: ["この かばんは わたしじゃ ありません。", "これ かばんは わたしのじゃ ありません。", "この かばんは わたしのです。"],
      },
      {
        arti: "(Mendapat informasi baru) O, begitu.",
        benar: "そうですか。",
        salah: ["そうです。", "ちがいます。", "どうぞ。"],
      },
      {
        arti: "Ini oleh-oleh. Silakan.",
        benar: "これは おみやげです。どうぞ。",
        salah: ["これは おみやげですか。どうぞ。", "この おみやげです。どうぞ。", "これは おみやげです。どうも。"],
      },
    ],
  },
  3: {
    susun: [
      { arti: "Kamar kecil di sana.", potongan: ["おてあらい", "は", "あそこ", "です"] },
      { arti: "Telepon di lantai dua.", potongan: ["でんわ", "は", "にかい", "です"] },
      { arti: "Sdr. Yamada di kantor.", potongan: ["やまださん", "は", "じむしょ", "です"] },
      { arti: "Di mana kamar kecil?", potongan: ["おてあらい", "は", "どこ", "です", "か"] },
      { arti: "Lift di sebelah mana?", potongan: ["エレベーター", "は", "どちら", "です", "か"] },
      { arti: "Ini komputer buatan mana?", potongan: ["これ", "は", "どこ", "の", "コンピューター", "です", "か"] },
      { arti: "(Ini) komputer buatan Jepang.", potongan: ["にほん", "の", "コンピューター", "です"] },
      { arti: "Anda berasal dari negara mana? (sopan)", potongan: ["おくに", "は", "どちら", "です", "か"] },
      { arti: "Ruang rapat di lantai berapa?", potongan: ["かいぎしつ", "は", "なんがい", "です", "か"] },
      { arti: "Berapa harga ini?", potongan: ["これ", "は", "いくら", "です", "か"] },
      { arti: "Ini anggur (wine) Italia.", potongan: ["これ", "は", "イタリア", "の", "ワイン", "です"] },
      { arti: "Kantin di lantai bawah tanah.", potongan: ["しょくどう", "は", "ちか", "です"] },
    ],
    pilih: [
      {
        arti: "Kamar kecil di sana.",
        benar: "おてあらいは あそこです。",
        salah: ["おてあらいは あそこですか。", "おてあらいの あそこです。", "あそこは おてあらいですか。"],
      },
      {
        arti: "Di mana kamar kecil?",
        benar: "おてあらいは どこですか。",
        salah: ["おてあらいは どれですか。", "おてあらいは だれですか。", "どこは おてあらいですか。"],
      },
      {
        arti: "Lift di sebelah mana?",
        benar: "エレベーターは どちらですか。",
        salah: ["エレベーターは どなたですか。", "エレベーターは どれですか。", "エレベーターは あちらですか。"],
      },
      {
        arti: "Ini komputer buatan mana?",
        benar: "これは どこの コンピューターですか。",
        salah: ["これは どこ コンピューターですか。", "これは なんの コンピューターですか。", "これは だれの コンピューターですか。"],
      },
      {
        arti: "(Ini) komputer buatan Jepang.",
        benar: "にほんの コンピューターです。",
        salah: ["にほん コンピューターです。", "コンピューターの にほんです。", "にほんじんの コンピューターです。"],
      },
      {
        arti: "Anda berasal dari negara mana? (sopan)",
        benar: "おくには どちらですか。",
        salah: ["おくには どなたですか。", "おくには なんですか。", "おくには どれですか。"],
      },
      {
        arti: "Sdr. Yamada di kantor.",
        benar: "やまださんは じむしょです。",
        salah: ["やまださんの じむしょです。", "やまださんは じむしょですか。", "やまださんも じむしょじゃ ありません。"],
      },
      {
        arti: "Ruang rapat di lantai berapa?",
        benar: "かいぎしつは なんがいですか。",
        salah: ["かいぎしつは いくらですか。", "かいぎしつは どなたですか。", "かいぎしつは なんさいですか。"],
      },
      {
        arti: "Berapa harga ini?",
        benar: "これは いくらですか。",
        salah: ["これは なんがいですか。", "これは どこですか。", "これは だれのですか。"],
      },
      {
        arti: "Permisi, tolong perlihatkan anggur (wine) itu.",
        benar: "すみません。その ワインを みせてください。",
        salah: ["すみません。それ ワインを みせてください。", "すみません。その ワインは みせてください。", "すみません。その ワインを ください。"],
      },
      {
        arti: "Kalau begitu, saya minta yang ini.",
        benar: "じゃ、これを ください。",
        salah: ["じゃ、これを みせてください。", "じゃ、この ください。", "じゃ、これは ください。"],
      },
      {
        arti: "(Pelayan toko kepada pembeli) Selamat datang.",
        benar: "いらっしゃいませ。",
        salah: ["すみません。", "どうも。", "どうぞ。"],
      },
    ],
  },
  4: {
    susun: [
      { arti: "Sekarang pukul berapa?", potongan: ["いま", "なんじ", "です", "か"] },
      { arti: "Saya belajar setiap hari.", potongan: ["わたし", "は", "まいにち", "べんきょうします"] },
      { arti: "Setiap pagi (saya) bangun pukul enam.", potongan: ["まいあさ", "ろくじ", "に", "おきます"] },
      { arti: "Tadi pagi (saya) bangun pukul enam.", potongan: ["けさ", "ろくじ", "に", "おきました"] },
      { arti: "Belajar dari pukul sembilan sampai pukul lima.", potongan: ["くじ", "から", "ごじ", "まで", "べんきょうします"] },
      { arti: "Bank (buka) dari pukul sembilan sampai pukul tiga.", potongan: ["ぎんこう", "は", "くじ", "から", "さんじ", "まで", "です"] },
      { arti: "Istirahat siang dari pukul dua belas.", potongan: ["ひるやすみ", "は", "じゅうにじ", "から", "です"] },
      {
        arti: "Hari libur bank adalah hari Sabtu dan hari Minggu.",
        potongan: ["ぎんこう", "の", "やすみ", "は", "どようび", "と", "にちようび", "です"],
        alt: ["ぎんこうのやすみはにちようびとどようびです"],
      },
      { arti: "Setiap pagi (Anda) bangun pukul berapa?", potongan: ["まいあさ", "なんじ", "に", "おきます", "か"] },
      { arti: "Setiap malam (saya) tidur pukul sebelas.", potongan: ["まいばん", "じゅういちじ", "に", "ねます"] },
      { arti: "Rapat selesai pukul empat.", potongan: ["かいぎ", "は", "よじ", "に", "おわります"] },
      { arti: "Kemarin (saya) tidak bekerja.", potongan: ["きのう", "は", "はたらきませんでした"] },
    ],
    pilih: [
      {
        arti: "Sekarang pukul tujuh lewat sepuluh menit.",
        benar: "いま しちじ じゅっぷんです。",
        salah: ["いま しちじ じゅうふんです。", "いま じゅっぷん しちじです。", "いま しちじに じゅっぷんです。"],
      },
      {
        arti: "Saya belajar setiap hari.",
        benar: "わたしは まいにち べんきょうします。",
        salah: ["わたしは まいにちに べんきょうします。", "わたしは まいにち べんきょうしました。", "わたしは まいにち べんきょうしません。"],
      },
      {
        arti: "Besok (saya) bangun pukul enam.",
        benar: "あした ろくじに おきます。",
        salah: ["あした ろくじに おきました。", "あしたに ろくじに おきます。", "あした ろくじから おきます。"],
      },
      {
        arti: "Kemarin (saya) tidak belajar.",
        benar: "きのう べんきょうしませんでした。",
        salah: ["きのう べんきょうしません。", "きのう べんきょうしました。", "きのうに べんきょうしませんでした。"],
      },
      {
        arti: "Bank (buka) dari pukul sembilan sampai pukul tiga.",
        benar: "ぎんこうは くじから さんじまでです。",
        salah: ["ぎんこうは くじまで さんじからです。", "ぎんこうは くじと さんじまでです。", "ぎんこうは くじから さんじにです。"],
      },
      {
        arti: "Hari libur bank adalah hari Sabtu dan hari Minggu.",
        benar: "ぎんこうの やすみは どようびと にちようびです。",
        salah: ["ぎんこうの やすみは どようびも にちようびです。", "ぎんこうの やすみは どようびの にちようびです。", "ぎんこうの やすみは どようびから にちようびです。"],
      },
      {
        arti: "(Saya) bangun pukul setengah tujuh.",
        benar: "ろくじはんに おきます。",
        salah: ["しちじはんに おきます。", "ろくじはんに ねます。", "ろくじはんから おきます。"],
      },
      {
        arti: "Setiap malam belajar sampai pukul sepuluh. ... Berat, ya.",
        benar: "まいばん じゅうじまで べんきょうします。……たいへんですね。",
        salah: ["まいばん じゅうじから べんきょうします。……たいへんですね。", "まいばん じゅうじまで べんきょうします。……たいへんですか。", "まいばんに じゅうじまで べんきょうします。……たいへんですね。"],
      },
      {
        arti: "Kemarin (Anda) bekerja? ... Ya, bekerja.",
        benar: "きのう はたらきましたか。……はい、はたらきました。",
        salah: ["きのう はたらきましたか。……はい、そうです。", "きのう はたらきますか。……はい、はたらきました。", "きのう はたらきましたか。……はい、はたらきます。"],
      },
      {
        arti: "Istirahat siang dari pukul dua belas.",
        benar: "ひるやすみは じゅうにじからです。",
        salah: ["ひるやすみは じゅうにじまでです。", "ひるやすみは じゅうにじにです。", "ひるやすみの じゅうにじからです。"],
      },
      {
        arti: "Nomor telepon Sdr. Yamada 871-6813, ya.",
        benar: "やまださんの でんわばんごうは 871の 6813ですね。",
        salah: ["やまださんの でんわばんごうは 871の 6813ですか。", "やまださんは でんわばんごうの 871の 6813ですね。", "やまださんの でんわばんごうは 871と 6813ですね。"],
      },
      {
        arti: "Ujiannya hari Rabu.",
        benar: "しけんは すいようびです。",
        salah: ["しけんは もくようびです。", "しけんは すいようびにです。", "しけんは かようびです。"],
      },
    ],
  },
  5: {
    susun: [
      { arti: "Pergi ke Kyoto.", potongan: ["きょうと", "へ", "いきます"] },
      { arti: "(Saya) datang ke Jepang.", potongan: ["にほん", "へ", "きました"] },
      { arti: "Pulang ke rumah.", potongan: ["うち", "へ", "かえります"] },
      { arti: "Tidak pergi ke mana-mana.", potongan: ["どこ", "へ", "も", "いきません"] },
      { arti: "Tidak makan apa-apa.", potongan: ["なに", "も", "たべません"] },
      { arti: "Pergi dengan kereta listrik.", potongan: ["でんしゃ", "で", "いきます"] },
      { arti: "Pulang jalan kaki dari stasiun.", potongan: ["えき", "から", "あるいて", "かえりました"] },
      {
        arti: "Datang ke Jepang bersama keluarga.",
        potongan: ["かぞく", "と", "にほん", "へ", "きました"],
        alt: ["にほんへかぞくときました"],
      },
      {
        arti: "Pergi ke Tokyo sendirian.",
        potongan: ["ひとりで", "とうきょう", "へ", "いきます"],
        alt: ["とうきょうへひとりでいきます"],
      },
      {
        arti: "Kapan (Anda) datang ke Jepang?",
        potongan: ["いつ", "にほん", "へ", "きました", "か"],
        alt: ["にほんへいつきましたか"],
      },
      {
        arti: "Minggu depan (saya) pergi ke Hiroshima.",
        potongan: ["らいしゅう", "ひろしま", "へ", "いきます"],
        alt: ["ひろしまへらいしゅういきます"],
      },
      { arti: "Apakah kereta ini pergi ke Koshien?", potongan: ["この", "でんしゃ", "は", "こうしえん", "へ", "いきます", "か"] },
    ],
    pilih: [
      {
        arti: "Pergi ke Kyoto.",
        benar: "きょうとへ いきます。",
        salah: ["きょうとで いきます。", "きょうとを いきます。", "きょうとへ きます。"],
      },
      {
        arti: "Tidak pergi ke mana-mana.",
        benar: "どこへも いきません。",
        salah: ["どこへも いきます。", "どこへ いきません。", "どこで いきません。"],
      },
      {
        arti: "Tidak ada seorang pun yang datang.",
        benar: "だれも きませんでした。",
        salah: ["だれも きました。", "だれが きませんでした。", "だれも いきませんでした。"],
      },
      {
        arti: "(Saya) datang dengan taksi.",
        benar: "タクシーで きました。",
        salah: ["タクシーへ きました。", "タクシーと きました。", "タクシーで いきました。"],
      },
      {
        arti: "Pulang jalan kaki dari stasiun.",
        benar: "えきから あるいて かえりました。",
        salah: ["えきから あるいてで かえりました。", "えきまで あるいて かえりました。", "えきから あるいて きました。"],
      },
      {
        arti: "Datang ke Jepang bersama keluarga.",
        benar: "かぞくと にほんへ きました。",
        salah: ["かぞくで にほんへ きました。", "かぞくへ にほんと きました。", "かぞくと にほんへ いきました。"],
      },
      {
        arti: "Pergi ke Tokyo sendirian.",
        benar: "ひとりで とうきょうへ いきます。",
        salah: ["ひとりと とうきょうへ いきます。", "ひとりで とうきょうで いきます。", "ひとりで とうきょうへ きます。"],
      },
      {
        arti: "Kapan datang ke Jepang? ... Datang tanggal 25 Maret.",
        benar: "いつ にほんへ きましたか。……さんがつ にじゅうごにちに きました。",
        salah: ["いつ にほんへ きましたか。……さんがつ にじゅうごにち きました。", "なんじ にほんへ きましたか。……さんがつ にじゅうごにちに きました。", "いつ にほんへ きますか。……さんがつ にじゅうごにちに きました。"],
      },
      {
        arti: "Minggu depan (saya) pergi ke Hiroshima.",
        benar: "らいしゅう ひろしまへ いきます。",
        salah: ["らいしゅうに ひろしまへ いきます。", "せんしゅう ひろしまへ いきます。", "らいしゅう ひろしまへ いきました。"],
      },
      {
        arti: "Tidak, tidak (ke sana). Yang \"Biasa\" berikutnya, lho.",
        benar: "いいえ、いきません。つぎの「ふつう」ですよ。",
        salah: ["いいえ、いきません。つぎの「ふつう」ですか。", "いいえ、いきます。つぎの「ふつう」ですよ。", "いいえ、いきません。つぎ「ふつう」ですよ。"],
      },
      {
        arti: "Besok hari Minggu, ya. ... O, iya betul.",
        benar: "あしたは にちようびですね。……あ、そうですね。",
        salah: ["あしたは にちようびですね。……あ、そうですか。", "あしたは にちようびですね。……あ、ちがいますね。", "あしたは どようびですね。……あ、そうですね。"],
      },
      {
        arti: "Ulang tahun saya tanggal 8 Juni.",
        benar: "わたしの たんじょうびは ろくがつ ようかです。",
        salah: ["わたしの たんじょうびは ろくがつ はちにちです。", "わたしの たんじょうびは しちがつ ようかです。", "わたしの たんじょうびは ろくがつ ようかに です。"],
      },
    ],
  },
  6: {
    susun: [
      { arti: "Minum jus.", potongan: ["ジュース", "を", "のみます"] },
      { arti: "Kemarin (Anda) melakukan apa?", potongan: ["きのう", "なに", "を", "しました", "か"] },
      { arti: "Bermain sepak bola.", potongan: ["サッカー", "を", "します"] },
      {
        arti: "Membeli koran di stasiun.",
        potongan: ["えき", "で", "しんぶん", "を", "かいます"],
        alt: ["しんぶんをえきでかいます"],
      },
      {
        arti: "Bagaimana kalau kita pergi ke Kyoto bersama-sama?",
        potongan: ["いっしょに", "きょうと", "へ", "いきません", "か"],
        alt: ["きょうとへいっしょにいきませんか"],
      },
      { arti: "Mari (kita) istirahat sebentar.", potongan: ["ちょっと", "やすみましょう"] },
      {
        arti: "Dengan apa (Anda) pergi ke Tokyo?",
        potongan: ["なん", "で", "とうきょう", "へ", "いきます", "か"],
        alt: ["とうきょうへなんでいきますか"],
      },
      { arti: "Mau membeli apa?", potongan: ["なに", "を", "かいます", "か"] },
      { arti: "Setiap pagi (saya) minum kopi.", potongan: ["まいあさ", "コーヒー", "を", "のみます"] },
      {
        arti: "Saya kadang-kadang menonton film.",
        potongan: ["わたし", "は", "ときどき", "えいが", "を", "みます"],
        alt: ["ときどきわたしはえいがをみます"],
      },
      {
        arti: "Makan siang di kantin.",
        potongan: ["しょくどう", "で", "ひるごはん", "を", "たべます"],
        alt: ["ひるごはんをしょくどうでたべます"],
      },
      { arti: "Setelah itu (saya) membaca buku.", potongan: ["それから", "ほん", "を", "よみます"] },
    ],
    pilih: [
      {
        arti: "Minum jus.",
        benar: "ジュースを のみます。",
        salah: ["ジュースで のみます。", "ジュースへ のみます。", "ジュースを たべます。"],
      },
      {
        arti: "Membeli koran di stasiun.",
        benar: "えきで しんぶんを かいます。",
        salah: ["えきへ しんぶんを かいます。", "えきで しんぶんで かいます。", "えきを しんぶんで かいます。"],
      },
      {
        arti: "Kemarin melakukan apa? ... Bermain sepak bola.",
        benar: "きのう なにを しましたか。……サッカーを しました。",
        salah: ["きのう なにを しましたか。……サッカーを します。", "きのう なにを しますか。……サッカーを しました。", "きのう なんを しましたか。……サッカーを しました。"],
      },
      {
        arti: "Itu apa?",
        benar: "それは なんですか。",
        salah: ["それは なにですか。", "それは なにを ですか。", "それの なんですか。"],
      },
      {
        arti: "Dengan apa pergi ke Tokyo? ... Dengan Shinkansen.",
        benar: "なんで とうきょうへ いきますか。……しんかんせんで いきます。",
        salah: ["なんで とうきょうへ いきますか。……しんかんせんへ いきます。", "なにを とうきょうへ いきますか。……しんかんせんで いきます。", "なんで とうきょうへ いきますか。……しんかんせんを いきます。"],
      },
      {
        arti: "Bagaimana kalau pergi ke Kyoto bersama-sama? ... Ya, bagus ya.",
        benar: "いっしょに きょうとへ いきませんか。……ええ、いいですね。",
        salah: ["いっしょに きょうとへ いきますか。……ええ、いいですね。", "いっしょに きょうとへ いきませんか。……ええ、いきません。", "いっしょに きょうとへ いきましたか。……ええ、いいですね。"],
      },
      {
        arti: "Mari (kita) istirahat sebentar.",
        benar: "ちょっと やすみましょう。",
        salah: ["ちょっと やすみませんでした。", "ちょっと やすみました。", "いつも やすみましょう。"],
      },
      {
        arti: "Bagaimana kalau makan siang bersama? ... Ya, ayo kita makan.",
        benar: "いっしょに ひるごはんを たべませんか。……ええ、たべましょう。",
        salah: ["いっしょに ひるごはんを たべませんか。……ええ、たべません。", "いっしょに ひるごはんを たべませんか。……ええ、たべましたか。", "いっしょに ひるごはんで たべませんか。……ええ、たべましょう。"],
      },
      {
        arti: "Hari Minggu (saya) pergi ke Kyoto. ... Kyoto? Bagus ya.",
        benar: "にちようび きょうとへ いきました。……きょうとですか。いいですね。",
        salah: ["にちようび きょうとへ いきました。……きょうとですね。いいですか。", "にちようび きょうとへ いきました。……きょうとですよ。いいですね。", "にちようび きょうとで いきました。……きょうとですか。いいですね。"],
      },
      {
        arti: "Saya kadang-kadang menonton film.",
        benar: "わたしは ときどき えいがを みます。",
        salah: ["わたしは いつも えいがを みます。", "わたしは ときどき えいがを ききます。", "わたしは ときどき えいがで みます。"],
      },
      {
        arti: "Hari Senin (Anda) melakukan apa? ... Pergi ke Kyoto.",
        benar: "げつようび なにを しますか。……きょうとへ いきます。",
        salah: ["げつようび なにを しますか。……きょうとを します。", "げつようび なにを しますか。……はい、します。", "げつようび なにを しますか。……きょうとで いきます。"],
      },
      {
        arti: "Mari kita mengambil foto.",
        benar: "しゃしんを とりましょう。",
        salah: ["しゃしんを とりませんでした。", "しゃしんで とりましょう。", "しゃしんを みましょう。"],
      },
    ],
  },
  7: {
    susun: [
      { arti: "Makan dengan sumpit.", potongan: ["はし", "で", "たべます"] },
      {
        arti: "Menulis laporan dalam bahasa Jepang.",
        potongan: ["にほんご", "で", "レポート", "を", "かきます"],
        alt: ["レポートをにほんごでかきます"],
      },
      { arti: "Apa bahasa Inggrisnya \"Arigatou\"?", potongan: ["「ありがとう」", "は", "えいご", "で", "なん", "です", "か"] },
      {
        arti: "Saya memberikan bunga kepada Sdr. Kimura.",
        potongan: ["わたし", "は", "きむらさん", "に", "はな", "を", "あげました"],
        alt: ["わたしははなをきむらさんにあげました"],
      },
      {
        arti: "Saya meminjamkan buku kepada Sdr. Lee.",
        potongan: ["わたし", "は", "イーさん", "に", "ほん", "を", "かしました"],
        alt: ["わたしはほんをイーさんにかしました"],
      },
      {
        arti: "(Saya) mengajar bahasa Inggris kepada Sdr. Yamada.",
        potongan: ["やまださん", "に", "えいご", "を", "おしえます"],
        alt: ["えいごをやまださんにおしえます"],
      },
      {
        arti: "(Saya) mendapat bunga dari Sdr. Yamada.",
        potongan: ["やまださん", "に", "はな", "を", "もらいました"],
        alt: ["はなをやまださんにもらいました"],
      },
      {
        arti: "(Saya) meminjam uang dari bank.",
        potongan: ["ぎんこう", "から", "おかね", "を", "かりました"],
        alt: ["おかねをぎんこうからかりました"],
      },
      {
        arti: "Apakah barangnya sudah (Anda) kirim?",
        potongan: ["もう", "にもつ", "を", "おくりました", "か"],
        alt: ["にもつをもうおくりましたか"],
      },
      {
        arti: "(Saya) belajar bahasa Mandarin dari Sdr. Wang.",
        potongan: ["ワンさん", "に", "ちゅうごくご", "を", "ならいます"],
        alt: ["ちゅうごくごをワンさんにならいます"],
      },
      {
        arti: "Memotong kertas dengan gunting.",
        potongan: ["はさみ", "で", "かみ", "を", "きります"],
        alt: ["かみをはさみできります"],
      },
      {
        arti: "Mengirim email kepada teman.",
        potongan: ["ともだち", "に", "メール", "を", "おくります"],
        alt: ["メールをともだちにおくります"],
      },
    ],
    pilih: [
      {
        arti: "Makan dengan sumpit.",
        benar: "はしで たべます。",
        salah: ["はしを たべます。", "はしに たべます。", "はしと たべます。"],
      },
      {
        arti: "Apa bahasa Inggrisnya \"Arigatou\"? ... \"Thank you\".",
        benar: "「ありがとう」は えいごで なんですか。……「Thank you」です。",
        salah: ["「ありがとう」は えいごで なにですか。……「Thank you」です。", "「ありがとう」は えいごに なんですか。……「Thank you」です。", "「ありがとう」は えいごを なんですか。……「Thank you」です。"],
      },
      {
        arti: "(Saya) memberikan bunga kepada Sdr. Kimura.",
        benar: "きむらさんに はなを あげました。",
        salah: ["きむらさんに はなを もらいました。", "きむらさんを はなに あげました。", "きむらさんで はなを あげました。"],
      },
      {
        arti: "(Saya) mendapat bunga dari Sdr. Yamada.",
        benar: "やまださんに はなを もらいました。",
        salah: ["やまださんに はなを あげました。", "やまださんへ はなを もらいました。", "やまださんで はなを もらいました。"],
      },
      {
        arti: "(Saya) meminjam CD dari Karina.",
        benar: "カリナさんに CDを かりました。",
        salah: ["カリナさんに CDを かしました。", "カリナさんを CDに かりました。", "カリナさんと CDを かりました。"],
      },
      {
        arti: "(Saya) meminjam uang dari bank.",
        benar: "ぎんこうから おかねを かりました。",
        salah: ["ぎんこうから おかねを かしました。", "ぎんこうへ おかねを かりました。", "ぎんこうから おかねで かりました。"],
      },
      {
        arti: "Apakah barangnya sudah dikirim? ... Ya, sudah dikirim.",
        benar: "もう にもつを おくりましたか。……はい、もう おくりました。",
        salah: ["もう にもつを おくりますか。……はい、もう おくりました。", "もう にもつを おくりましたか。……はい、まだです。", "もう にもつを おくりましたか。……はい、おくりませんでした。"],
      },
      {
        arti: "(Apakah sudah dikirim?) Belum.",
        benar: "いいえ、まだです。",
        salah: ["いいえ、もうです。", "はい、まだです。", "いいえ、まだでした。"],
      },
      {
        arti: "(Saya) mengajar bahasa Inggris kepada Sdr. Yamada.",
        benar: "やまださんに えいごを おしえます。",
        salah: ["やまださんに えいごを ならいます。", "やまださんを えいごに おしえます。", "やまださんと えいごを おしえます。"],
      },
      {
        arti: "Sendok ini bagus, ya.",
        benar: "この スプーン、すてきですね。",
        salah: ["この スプーン、すてきですか。", "これ スプーン、すてきですね。", "この スプーンを、すてきですね。"],
      },
      {
        arti: "(Selesai makan) Terima kasih atas hidangannya.",
        benar: "ごちそうさまでした。",
        salah: ["いただきます。", "いらっしゃい。", "しつれいします。"],
      },
      {
        arti: "Bagaimana kalau kopi secangkir lagi? (menawarkan)",
        benar: "コーヒー、もう いっぱい いかがですか。",
        salah: ["コーヒー、まだ いっぱい いかがですか。", "コーヒー、もう いっぱい いかがでしたか。", "コーヒーで、もう いっぱい いかがですか。"],
      },
    ],
  },
  8: {
    susun: [
      { arti: "Pak Watt baik hati.", potongan: ["ワットせんせい", "は", "しんせつ", "です"] },
      { arti: "Gunung Fuji tinggi.", potongan: ["ふじさん", "は", "たかい", "です"] },
      { arti: "Di sana tidak sunyi.", potongan: ["あそこ", "は", "しずか", "じゃ", "ありません"] },
      { arti: "Buku ini tidak menarik.", potongan: ["この", "ほん", "は", "おもしろくない", "です"] },
      { arti: "Pak Watt adalah guru yang baik hati.", potongan: ["ワットせんせい", "は", "しんせつな", "せんせい", "です"] },
      { arti: "Gunung Fuji adalah gunung yang tinggi.", potongan: ["ふじさん", "は", "たかい", "やま", "です"] },
      { arti: "Makanan Jepang enak, tetapi mahal.", potongan: ["にほん", "の", "たべもの", "は", "おいしい", "です", "が", "たかい", "です"] },
      { arti: "Beijing sangat dingin.", potongan: ["ペキン", "は", "とても", "さむい", "です"] },
      { arti: "Shanghai tidak begitu dingin.", potongan: ["シャンハイ", "は", "あまり", "さむくない", "です"] },
      { arti: "Bagaimana kehidupan di Jepang?", potongan: ["にほん", "の", "せいかつ", "は", "どう", "です", "か"] },
      { arti: "Nara kota yang bagaimana?", potongan: ["なら", "は", "どんな", "まち", "です", "か"] },
      { arti: "Ini film yang sangat terkenal.", potongan: ["これ", "は", "とても", "ゆうめいな", "えいが", "です"] },
    ],
    pilih: [
      {
        arti: "Pak Watt baik hati.",
        benar: "ワットせんせいは しんせつです。",
        salah: ["ワットせんせいは しんせつなです。", "ワットせんせいは しんせついです。", "ワットせんせいの しんせつです。"],
      },
      {
        arti: "Di sana tidak sunyi.",
        benar: "あそこは しずかじゃ ありません。",
        salah: ["あそこは しずかくないです。", "あそこは しずかなじゃ ありません。", "あそこは しずかないです。"],
      },
      {
        arti: "Buku ini tidak menarik.",
        benar: "この ほんは おもしろくないです。",
        salah: ["この ほんは おもしろいじゃ ありません。", "この ほんは おもしろくです。", "この ほんは おもしろないです。"],
      },
      {
        arti: "Pak Watt adalah guru yang baik hati.",
        benar: "ワットせんせいは しんせつな せんせいです。",
        salah: ["ワットせんせいは しんせつ せんせいです。", "ワットせんせいは しんせつの せんせいです。", "ワットせんせいは しんせつい せんせいです。"],
      },
      {
        arti: "Gunung Fuji adalah gunung yang tinggi.",
        benar: "ふじさんは たかい やまです。",
        salah: ["ふじさんは たかいな やまです。", "ふじさんは たかの やまです。", "ふじさんは たかく やまです。"],
      },
      {
        arti: "Makanan Jepang enak, tetapi mahal.",
        benar: "にほんの たべものは おいしいですが、たかいです。",
        salah: ["にほんの たべものは おいしいですが、やすいです。", "にほんの たべものは おいしいですと、たかいです。", "にほんの たべものは おいしくですが、たかいです。"],
      },
      {
        arti: "Beijing sangat dingin.",
        benar: "ペキンは とても さむいです。",
        salah: ["ペキンは あまり さむいです。", "ペキンは とても さむくないです。", "ペキンは とても つめたいです。"],
      },
      {
        arti: "Shanghai tidak begitu dingin.",
        benar: "シャンハイは あまり さむくないです。",
        salah: ["シャンハイは あまり さむいです。", "シャンハイは とても さむくないです。", "シャンハイは あまり さむいじゃ ありません。"],
      },
      {
        arti: "Bagaimana kehidupan di Jepang? ... Menyenangkan.",
        benar: "にほんの せいかつは どうですか。……たのしいです。",
        salah: ["にほんの せいかつは どんなですか。……たのしいです。", "にほんの せいかつは なんですか。……たのしいです。", "にほんの せいかつは どうですか。……たのしくです。"],
      },
      {
        arti: "Nara kota yang bagaimana? ... Kota yang tua.",
        benar: "ならは どんな まちですか。……ふるい まちです。",
        salah: ["ならは どう まちですか。……ふるい まちです。", "ならは どんな まちですか。……ふるいな まちです。", "ならは どんな まちですか。……ふるく まちです。"],
      },
      {
        arti: "Bagaimana pekerjaannya? ... Yah... sibuk, tetapi menarik.",
        benar: "おしごとは どうですか。……そうですね。いそがしいですが、おもしろいです。",
        salah: ["おしごとは どうですか。……そうですか。いそがしいですが、おもしろいです。", "おしごとは どうですか。……そうですね。いそがしくですが、おもしろいです。", "おしごとは どうですか。……そうですね。いそがしいですと、おもしろいです。"],
      },
      {
        arti: "(Menolak tawaran) Tidak, cukup.",
        benar: "いいえ、けっこうです。",
        salah: ["いいえ、そうです。", "いいえ、どうぞ。", "いいえ、けっこうでした。"],
      },
    ],
  },
  9: {
    susun: [
      { arti: "Saya suka masakan Italia.", potongan: ["わたし", "は", "イタリア", "りょうり", "が", "すき", "です"] },
      { arti: "Saya mengerti bahasa Jepang.", potongan: ["わたし", "は", "にほんご", "が", "わかります"] },
      { arti: "Saya mempunyai mobil.", potongan: ["わたし", "は", "くるま", "が", "あります"] },
      { arti: "(Anda) suka olahraga apa?", potongan: ["どんな", "スポーツ", "が", "すき", "です", "か"] },
      { arti: "Mengerti bahasa Inggris dengan baik.", potongan: ["えいご", "が", "よく", "わかります"] },
      { arti: "Uangnya ada banyak.", potongan: ["おかね", "が", "たくさん", "あります"] },
      { arti: "Uang tidak ada sama sekali.", potongan: ["おかね", "が", "ぜんぜん", "ありません"] },
      { arti: "Di sini sedikit dingin.", potongan: ["ここ", "は", "すこし", "さむい", "です"] },
      { arti: "Karena tidak ada waktu, (saya) tidak membaca koran.", potongan: ["じかん", "が", "ありません", "から", "しんぶん", "を", "よみません"] },
      { arti: "Mengapa pagi hari (Anda) tidak membaca koran?", potongan: ["どうして", "あさ", "しんぶん", "を", "よみません", "か"] },
      { arti: "Sdri. Maria pandai berdansa.", potongan: ["マリアさん", "は", "ダンス", "が", "じょうず", "です"] },
      { arti: "Saya tidak begitu mengerti kanji.", potongan: ["わたし", "は", "かんじ", "が", "あまり", "わかりません"] },
    ],
    pilih: [
      {
        arti: "Saya suka masakan Italia.",
        benar: "わたしは イタリアりょうりが すきです。",
        salah: ["わたしは イタリアりょうりを すきです。", "わたしは イタリアりょうりに すきです。", "わたしは イタリアりょうりが きらいです。"],
      },
      {
        arti: "Saya mengerti bahasa Jepang.",
        benar: "わたしは にほんごが わかります。",
        salah: ["わたしは にほんごを わかります。", "わたしは にほんごで わかります。", "わたしは にほんごが わかりです。"],
      },
      {
        arti: "Saya mempunyai mobil.",
        benar: "わたしは くるまが あります。",
        salah: ["わたしは くるまを あります。", "わたしは くるまに あります。", "わたしは くるまが ありません。"],
      },
      {
        arti: "Suka olahraga apa? ... Suka sepak bola.",
        benar: "どんな スポーツが すきですか。……サッカーが すきです。",
        salah: ["どう スポーツが すきですか。……サッカーが すきです。", "どんな スポーツが すきですか。……はい、すきです。", "どんな スポーツを すきですか。……サッカーを すきです。"],
      },
      {
        arti: "Mengerti bahasa Inggris sedikit.",
        benar: "えいごが すこし わかります。",
        salah: ["えいごが ぜんぜん わかります。", "えいごを すこし わかります。", "えいごが たくさん わかりません。"],
      },
      {
        arti: "Tidak begitu mengerti bahasa Inggris.",
        benar: "えいごが あまり わかりません。",
        salah: ["えいごが あまり わかります。", "えいごが たくさん わかりません。", "えいごを あまり わかりません。"],
      },
      {
        arti: "Uang tidak ada sama sekali.",
        benar: "おかねが ぜんぜん ありません。",
        salah: ["おかねが ぜんぜん あります。", "おかねが すこし ありません。", "おかねを ぜんぜん ありません。"],
      },
      {
        arti: "Film itu sama sekali tidak menarik.",
        benar: "あの えいがは ぜんぜん おもしろくないです。",
        salah: ["あの えいがは ぜんぜん おもしろいです。", "あの えいがは とても おもしろくないです。", "あの えいがは ぜんぜん おもしろいじゃ ありません。"],
      },
      {
        arti: "Karena tidak ada waktu, (saya) tidak membaca koran.",
        benar: "じかんが ありませんから、しんぶんを よみません。",
        salah: ["じかんが ありますから、しんぶんを よみません。", "じかんが ありませんが、しんぶんを よみません。", "しんぶんを よみませんから、じかんが ありません。"],
      },
      {
        arti: "Mengapa pagi hari tidak membaca koran? ... Karena tidak ada waktu.",
        benar: "どうして あさ しんぶんを よみませんか。……じかんが ありませんから。",
        salah: ["どう あさ しんぶんを よみませんか。……じかんが ありませんから。", "どうして あさ しんぶんを よみませんか。……じかんが ありませんが。", "どうして あさ しんぶんを よみませんか。……はい、よみません。"],
      },
      {
        arti: "Hari ini (saya) pulang cepat. ... Kenapa?",
        benar: "きょうは はやく かえります。……どうしてですか。",
        salah: ["きょうは はやく かえります。……どうですか。", "きょうは はやく かえります。……どんなですか。", "きょうは はやく かえりました。……どうしてですか。"],
      },
      {
        arti: "(Menolak ajakan) Sayang sekali. Lain kali saja.",
        benar: "ざんねんです。また こんど おねがいします。",
        salah: ["いいですよ。また こんど おねがいします。", "ざんねんです。いっしょに いかがですか。", "ざんねんです。また きのう おねがいします。"],
      },
    ],
  },
  10: {
    susun: [
      { arti: "Ada komputer.", potongan: ["コンピューター", "が", "あります"] },
      { arti: "Ada anjing.", potongan: ["いぬ", "が", "います"] },
      { arti: "Di kamar saya ada meja.", potongan: ["わたし", "の", "へや", "に", "つくえ", "が", "あります"] },
      { arti: "Di kantor ada Sdr. Miller.", potongan: ["じむしょ", "に", "ミラーさん", "が", "います"] },
      { arti: "Di basement ada apa?", potongan: ["ちか", "に", "なに", "が", "あります", "か"] },
      { arti: "Tokyo Disneyland ada di prefektur Chiba.", potongan: ["とうきょうディズニーランド", "は", "ちばけん", "に", "あります"] },
      { arti: "Sdr. Miller ada di mana?", potongan: ["ミラーさん", "は", "どこ", "に", "います", "か"] },
      { arti: "Di atas meja ada foto.", potongan: ["つくえ", "の", "うえ", "に", "しゃしん", "が", "あります"] },
      { arti: "Kantor pos ada di sebelah bank.", potongan: ["ゆうびんきょく", "は", "ぎんこう", "の", "となり", "に", "あります"] },
      {
        arti: "Toko buku ada di antara toko bunga dan supermarket.",
        potongan: ["ほんや", "は", "はなや", "と", "スーパー", "の", "あいだ", "に", "あります"],
        alt: ["ほんやはスーパーとはなやのあいだにあります"],
      },
      {
        arti: "Di dalam kotak ada surat, foto, dan lain-lain.",
        potongan: ["はこ", "の", "なか", "に", "てがみ", "や", "しゃしん", "など", "が", "あります"],
        alt: ["はこのなかにしゃしんやてがみなどがあります"],
      },
      { arti: "Di depan stasiun ada taman.", potongan: ["えき", "の", "まえ", "に", "こうえん", "が", "あります"] },
    ],
    pilih: [
      {
        arti: "Ada anjing.",
        benar: "いぬが います。",
        salah: ["いぬが あります。", "いぬを います。", "いぬに います。"],
      },
      {
        arti: "Ada taman.",
        benar: "こうえんが あります。",
        salah: ["こうえんが います。", "こうえんに あります。", "こうえんを あります。"],
      },
      {
        arti: "Di kamar saya ada meja.",
        benar: "わたしの へやに つくえが あります。",
        salah: ["わたしの へやで つくえが あります。", "わたしの へやに つくえが います。", "わたしの へやは つくえに あります。"],
      },
      {
        arti: "Di resepsionis ada siapa? ... Ada Sdr. Kimura.",
        benar: "うけつけに だれが いますか。……きむらさんが います。",
        salah: ["うけつけに だれが ありますか。……きむらさんが あります。", "うけつけに なにが いますか。……きむらさんが います。", "うけつけに だれが いますか。……きむらさんが あります。"],
      },
      {
        arti: "Tokyo Disneyland ada di prefektur Chiba.",
        benar: "とうきょうディズニーランドは ちばけんに あります。",
        salah: ["とうきょうディズニーランドは ちばけんで あります。", "とうきょうディズニーランドは ちばけんに います。", "とうきょうディズニーランドは ちばけんを あります。"],
      },
      {
        arti: "Sdr. Miller ada di mana? ... Ada di kantor.",
        benar: "ミラーさんは どこに いますか。……じむしょに います。",
        salah: ["ミラーさんは どこに ありますか。……じむしょに あります。", "ミラーさんは どこに いますか。……じむしょで います。", "ミラーさんは なにに いますか。……じむしょに います。"],
      },
      {
        arti: "Di atas meja ada foto.",
        benar: "つくえの うえに しゃしんが あります。",
        salah: ["つくえの したに しゃしんが あります。", "うえの つくえに しゃしんが あります。", "つくえの うえに しゃしんが います。"],
      },
      {
        arti: "Kantor pos ada di sebelah bank.",
        benar: "ゆうびんきょくは ぎんこうの となりに あります。",
        salah: ["ゆうびんきょくは ぎんこうの まえに あります。", "ぎんこうは ゆうびんきょくの となりに あります。", "ゆうびんきょくは ぎんこうの となりに います。"],
      },
      {
        arti: "Toko buku ada di antara toko bunga dan supermarket.",
        benar: "ほんやは はなやと スーパーの あいだに あります。",
        salah: ["ほんやは はなやと スーパーの となりに あります。", "ほんやは はなやや スーパーの あいだに あります。", "はなやは ほんやと スーパーの あいだに あります。"],
      },
      {
        arti: "Di dalam kotak ada surat, foto, dan lain-lain.",
        benar: "はこの なかに てがみや しゃしんなどが あります。",
        salah: ["はこの そとに てがみや しゃしんなどが あります。", "はこの なかに てがみや しゃしんなどが います。", "はこの なかで てがみや しゃしんなどが あります。"],
      },
      {
        arti: "Di dekat stasiun (saya) bertemu teman.",
        benar: "えきの ちかくで ともだちに あいました。",
        salah: ["えきの ちかくに ともだちに あいました。", "えきの ちかくで ともだちを あいました。", "えきの ちかくで ともだちに いました。"],
      },
      {
        arti: "Permisi, Asia Store di mana? ... Asia Store? Di dalam gedung itu.",
        benar: "すみません。アジアストアは どこですか。……アジアストアですか。あの ビルの なかです。",
        salah: ["すみません。アジアストアは どれですか。……アジアストアですか。あの ビルの なかです。", "すみません。アジアストアは どこですか。……アジアストアですか。あの ビルの なかに います。", "すみません。アジアストアは どこですか。……アジアストアですね。あの ビルの なかです。"],
      },
    ],
  },
  11: {
    susun: [
      { arti: "(Saya) membeli empat buah apel.", potongan: ["りんご", "を", "よっつ", "かいました"] },
      { arti: "Ada dua orang mahasiswa asing.", potongan: ["がいこくじん", "の", "がくせい", "が", "ふたり", "います"] },
      {
        arti: "(Saya) belajar bahasa Jepang selama dua bulan.",
        potongan: ["にかげつ", "にほんご", "を", "べんきょうしました"],
        alt: ["にほんごをにかげつべんきょうしました"],
      },
      { arti: "(Anda) membeli jeruk berapa buah?", potongan: ["みかん", "を", "いくつ", "かいました", "か"] },
      { arti: "Di perusahaan ini ada berapa orang asing?", potongan: ["この", "かいしゃ", "に", "がいこくじん", "が", "なんにん", "います", "か"] },
      {
        arti: "Setiap malam (Anda) belajar bahasa Jepang berapa jam?",
        potongan: ["まいばん", "なんじかん", "にほんご", "を", "べんきょうします", "か"],
        alt: ["まいばんにほんごをなんじかんべんきょうしますか"],
      },
      { arti: "Dari Osaka sampai Tokyo memerlukan waktu berapa lama?", potongan: ["おおさか", "から", "とうきょう", "まで", "どのくらい", "かかります", "か"] },
      { arti: "Memerlukan waktu kira-kira 15 menit.", potongan: ["じゅうごふん", "ぐらい", "かかります"] },
      {
        arti: "Sebulan dua kali (saya) menonton film.",
        potongan: ["いっかげつ", "に", "にかい", "えいが", "を", "みます"],
        alt: ["えいがをいっかげつににかいみます"],
      },
      { arti: "Hari liburnya hanya hari Minggu.", potongan: ["やすみ", "は", "にちようび", "だけ", "です"] },
      { arti: "Di sekolah ada kira-kira 30 orang guru.", potongan: ["がっこう", "に", "せんせい", "が", "さんじゅうにん", "ぐらい", "います"] },
      { arti: "Tolong (berikan) perangko 80 yen tiga lembar.", potongan: ["はちじゅうえん", "の", "きって", "を", "さんまい", "ください"] },
    ],
    pilih: [
      {
        arti: "(Saya) membeli empat buah apel.",
        benar: "りんごを よっつ かいました。",
        salah: ["りんごを よんつ かいました。", "りんごを よにん かいました。", "りんごを よっつを かいました。"],
      },
      {
        arti: "Ada dua orang mahasiswa asing.",
        benar: "がいこくじんの がくせいが ふたり います。",
        salah: ["がいこくじんの がくせいが ににん います。", "がいこくじんの がくせいが ふたつ います。", "がいこくじんの がくせいが ふたり あります。"],
      },
      {
        arti: "Membeli jeruk berapa buah? ... Membeli delapan buah.",
        benar: "みかんを いくつ かいましたか。……やっつ かいました。",
        salah: ["みかんを いくつ かいましたか。……はちつ かいました。", "みかんを なんにん かいましたか。……やっつ かいました。", "みかんを いくら かいましたか。……やっつ かいました。"],
      },
      {
        arti: "Berapa lama belajar bahasa Jepang? ... Belajar tiga tahun.",
        benar: "どのくらい にほんごを べんきょうしましたか。……さんねん べんきょうしました。",
        salah: ["どのくらい にほんごを べんきょうしましたか。……さんねんに べんきょうしました。", "いつ にほんごを べんきょうしましたか。……さんねん べんきょうしました。", "どのくらい にほんごを べんきょうしましたか。……さんがつ べんきょうしました。"],
      },
      {
        arti: "Dengan Shinkansen memerlukan waktu dua setengah jam.",
        benar: "しんかんせんで にじかんはん かかります。",
        salah: ["しんかんせんで にじはん かかります。", "しんかんせんに にじかんはん かかります。", "しんかんせんで にじかんはん あります。"],
      },
      {
        arti: "Memerlukan waktu kira-kira 15 menit.",
        benar: "じゅうごふんぐらい かかります。",
        salah: ["じゅうごふんだけ かかります。", "じゅうごふんぐらい います。", "じゅうごふんに かかります。"],
      },
      {
        arti: "Sebulan dua kali (saya) menonton film.",
        benar: "いっかげつに にかい えいがを みます。",
        salah: ["いっかげつで にかい えいがを みます。", "にかげつに いっかい えいがを みます。", "いっかげつに にかい えいがを ききます。"],
      },
      {
        arti: "Di Power Elektronik hanya ada seorang pegawai asing.",
        benar: "パワーでんきに がいこくじんの しゃいんが ひとりだけ います。",
        salah: ["パワーでんきに がいこくじんの しゃいんが ひとりだけ あります。", "パワーでんきに がいこくじんの しゃいんが ひとつだけ います。", "パワーでんきに がいこくじんの しゃいんが ひとりも います。"],
      },
      {
        arti: "Hari liburnya hanya hari Minggu.",
        benar: "やすみは にちようびだけです。",
        salah: ["やすみは にちようびもです。", "やすみは にちようびぐらいです。", "やすみは どようびだけです。"],
      },
      {
        arti: "Tolong (berikan) perangko 80 yen tiga lembar.",
        benar: "はちじゅうえんの きってを さんまい ください。",
        salah: ["はちじゅうえんの きってを さんだい ください。", "はちじゅうえんの きってを さんにん ください。", "はちじゅうえんの きってで さんまい ください。"],
      },
      {
        arti: "Mau keluar? ... Ya, sebentar ke kantor pos.",
        benar: "おでかけですか。……ええ、ちょっと ゆうびんきょくまで。",
        salah: ["おでかけですか。……ええ、ちょっと ゆうびんきょくから。", "いってらっしゃい。……ええ、ちょっと ゆうびんきょくまで。", "おでかけですか。……ええ、ちょっと ゆうびんきょくだけ。"],
      },
      {
        arti: "(Yang berangkat) Saya berangkat. ... (Yang ditinggal) Hati-hati.",
        benar: "いってきます。……いってらっしゃい。",
        salah: ["いってらっしゃい。……いってきます。", "いってきます。……いらっしゃい。", "いってきます。……いってきます。"],
      },
    ],
  },
  12: {
    susun: [
      { arti: "Kemarin hujan.", potongan: ["きのう", "は", "あめ", "でした"] },
      { arti: "Ujian kemarin tidak mudah.", potongan: ["きのう", "の", "しけん", "は", "かんたん", "じゃ", "ありませんでした"] },
      { arti: "Kemarin panas.", potongan: ["きのう", "は", "あつかった", "です"] },
      { arti: "Pesta kemarin tidak begitu menyenangkan.", potongan: ["きのう", "の", "パーティー", "は", "あまり", "たのしくなかった", "です"] },
      { arti: "Mobil ini lebih besar daripada mobil itu.", potongan: ["この", "くるま", "は", "あの", "くるま", "より", "おおきい", "です"] },
      {
        arti: "Mana yang lebih menarik, sepak bola atau baseball?",
        potongan: ["サッカー", "と", "やきゅう", "と", "どちら", "が", "おもしろい", "です", "か"],
        alt: ["やきゅうとサッカーとどちらがおもしろいですか"],
      },
      { arti: "Sepak bola yang lebih menarik.", potongan: ["サッカー", "の", "ほう", "が", "おもしろい", "です"] },
      { arti: "Di antara masakan Jepang, apa yang paling enak?", potongan: ["にほんりょうり", "で", "なに", "が", "いちばん", "おいしい", "です", "か"] },
      { arti: "Tempura yang paling enak.", potongan: ["てんぷら", "が", "いちばん", "おいしい", "です"] },
      { arti: "Dalam setahun, kapan yang paling dingin?", potongan: ["いちねん", "で", "いつ", "が", "いちばん", "さむい", "です", "か"] },
      {
        arti: "(Anda) lebih suka musim semi atau musim gugur?",
        potongan: ["はる", "と", "あき", "と", "どちら", "が", "すき", "です", "か"],
        alt: ["あきとはるとどちらがすきですか"],
      },
      { arti: "Tas Sdri. Karina yang mana?", potongan: ["カリナさん", "の", "かばん", "は", "どれ", "です", "か"] },
    ],
    pilih: [
      {
        arti: "Kemarin hujan.",
        benar: "きのうは あめでした。",
        salah: ["きのうは あめです。", "きのうは あめかったです。", "きのうは あめじゃ ありませんでした。"],
      },
      {
        arti: "Ujian kemarin tidak mudah.",
        benar: "きのうの しけんは かんたんじゃ ありませんでした。",
        salah: ["きのうの しけんは かんたんくなかったです。", "きのうの しけんは かんたんじゃ ありません。", "きのうの しけんは かんたんでした。"],
      },
      {
        arti: "Kemarin panas.",
        benar: "きのうは あつかったです。",
        salah: ["きのうは あついでした。", "きのうは あつかったでした。", "きのうは あついです。"],
      },
      {
        arti: "Pesta kemarin tidak begitu menyenangkan.",
        benar: "きのうの パーティーは あまり たのしくなかったです。",
        salah: ["きのうの パーティーは あまり たのしかったです。", "きのうの パーティーは あまり たのしいじゃ ありませんでした。", "きのうの パーティーは とても たのしくなかったです。"],
      },
      {
        arti: "Mobil ini lebih besar daripada mobil itu.",
        benar: "この くるまは あの くるまより おおきいです。",
        salah: ["あの くるまは この くるまより おおきいです。", "この くるまは あの くるまより ちいさいです。", "この くるまは あの くるまから おおきいです。"],
      },
      {
        arti: "Mana yang lebih menarik, sepak bola atau baseball? ... Sepak bola yang lebih menarik.",
        benar: "サッカーと やきゅうと どちらが おもしろいですか。……サッカーの ほうが おもしろいです。",
        salah: ["サッカーと やきゅうと どれが おもしろいですか。……サッカーの ほうが おもしろいです。", "サッカーと やきゅうと どちらが おもしろいですか。……サッカーが ほうが おもしろいです。", "サッカーと やきゅうと なにが おもしろいですか。……サッカーの ほうが おもしろいです。"],
      },
      {
        arti: "Di antara masakan Jepang, apa yang paling enak? ... Tempura yang paling enak.",
        benar: "にほんりょうりで なにが いちばん おいしいですか。……てんぷらが いちばん おいしいです。",
        salah: ["にほんりょうりで なにが いちばん おいしいですか。……てんぷらは いちばん おいしいです。", "にほんりょうりに なにが いちばん おいしいですか。……てんぷらが いちばん おいしいです。", "にほんりょうりで どちらが いちばん おいしいですか。……てんぷらが いちばん おいしいです。"],
      },
      {
        arti: "Di Eropa, mana yang paling bagus? ... Swiss yang paling bagus.",
        benar: "ヨーロッパで どこが いちばん よかったですか。……スイスが いちばん よかったです。",
        salah: ["ヨーロッパで どこが いちばん いかったですか。……スイスが いちばん いかったです。", "ヨーロッパで どこが いちばん よかったですか。……スイスが いちばん いいでした。", "ヨーロッパで なにが いちばん よかったですか。……スイスが いちばん よかったです。"],
      },
      {
        arti: "Dalam setahun, kapan yang paling dingin? ... Februari yang paling dingin.",
        benar: "いちねんで いつが いちばん さむいですか。……にがつが いちばん さむいです。",
        salah: ["いちねんで いつが いちばん さむいですか。……にがつは いちばん さむいです。", "いちねんで なんが いちばん さむいですか。……にがつが いちばん さむいです。", "いちねんに いつが いちばん さむいですか。……にがつが いちばん さむいです。"],
      },
      {
        arti: "Tas Sdri. Karina yang mana? ... Yang merah dan besar itu.",
        benar: "カリナさんの かばんは どれですか。……あの あかくて、おおきいのです。",
        salah: ["カリナさんの かばんは どれですか。……あの あかくて、おおきいです。", "カリナさんの かばんは どれですか。……あの あかい、おおきいのです。", "カリナさんの かばんは なんですか。……あの あかくて、おおきいのです。"],
      },
      {
        arti: "(Anda) lebih suka musim semi atau musim gugur? ... Dua-duanya suka.",
        benar: "はると あきと どちらが すきですか。……どちらも すきです。",
        salah: ["はると あきと どちらが すきですか。……どちらが すきです。", "はると あきと どれが すきですか。……どちらも すきです。", "はると あきと どちらが すきですか。……どちらも すきじゃ ありません。"],
      },
      {
        arti: "(Yang datang) Saya pulang. ... (Yang di rumah) Selamat datang kembali.",
        benar: "ただいま。……おかえりなさい。",
        salah: ["おかえりなさい。……ただいま。", "ただいま。……いってらっしゃい。", "ただいま。……いらっしゃいませ。"],
      },
    ],
  },
  13: {
    susun: [
      { arti: "Saya ingin punya teman.", potongan: ["わたし", "は", "ともだち", "が", "ほしい", "です"] },
      { arti: "Sekarang apa yang paling (Anda) inginkan?", potongan: ["いま", "なに", "が", "いちばん", "ほしい", "です", "か"] },
      { arti: "Saya ingin pergi ke Okinawa.", potongan: ["わたし", "は", "おきなわ", "へ", "いきたい", "です"] },
      { arti: "Saya ingin makan tempura.", potongan: ["わたし", "は", "てんぷら", "を", "たべたい", "です"] },
      { arti: "(Saya) tidak ingin minum apa-apa.", potongan: ["なに", "も", "のみたくない", "です"] },
      {
        arti: "Pergi ke Kobe untuk makan masakan India.",
        potongan: ["こうべ", "へ", "インドりょうり", "を", "たべ", "に", "いきます"],
        alt: ["インドりょうりをたべにこうべへいきます"],
      },
      {
        arti: "Pergi ke Kobe untuk berbelanja.",
        potongan: ["こうべ", "へ", "かいもの", "に", "いきます"],
        alt: ["かいものにこうべへいきます"],
      },
      {
        arti: "(Saya) datang ke Jepang untuk belajar seni.",
        potongan: ["にほん", "へ", "びじゅつ", "の", "べんきょう", "に", "きました"],
        alt: ["びじゅつのべんきょうににほんへきました"],
      },
      { arti: "Besok (saya) pergi ke festival di Kyoto.", potongan: ["あした", "きょうと", "の", "おまつり", "に", "いきます"] },
      { arti: "Liburan musim dingin (Anda) pergi ke suatu tempat?", potongan: ["ふゆやすみ", "は", "どこか", "へ", "いきました", "か"] },
      { arti: "Karena haus, (saya) ingin minum sesuatu.", potongan: ["のど", "が", "かわきました", "から", "なにか", "のみたい", "です"] },
      {
        arti: "Pergi ke kolam renang untuk berenang.",
        potongan: ["プール", "へ", "およぎ", "に", "いきます"],
        alt: ["およぎにプールへいきます"],
      },
    ],
    pilih: [
      {
        arti: "Saya ingin punya mobil.",
        benar: "わたしは くるまが ほしいです。",
        salah: ["わたしは くるまを ほしいです。", "わたしは くるまが ほしたいです。", "わたしは くるまが ほしくないです。"],
      },
      {
        arti: "Apakah (Anda) ingin punya anak? ... Tidak, tidak ingin.",
        benar: "こどもが ほしいですか。……いいえ、ほしくないです。",
        salah: ["こどもが ほしいですか。……いいえ、ほしいじゃ ありません。", "こどもが ほしいですか。……いいえ、ほしくです。", "こどもが ほしいですか。……はい、ほしくないです。"],
      },
      {
        arti: "Saya ingin pergi ke Okinawa.",
        benar: "わたしは おきなわへ いきたいです。",
        salah: ["わたしは おきなわへ いきますたいです。", "わたしは おきなわへ いきほしいです。", "わたしは おきなわを いきたいです。"],
      },
      {
        arti: "Di Kobe (Anda) ingin membeli apa? ... Ingin membeli sepatu.",
        benar: "こうべで なにを かいたいですか。……くつを かいたいです。",
        salah: ["こうべで なにを かいたいですか。……くつを かいたくないです。", "こうべへ なにを かいたいですか。……くつを かいたいです。", "こうべで なにを かいほしいですか。……くつを かいほしいです。"],
      },
      {
        arti: "Pergi ke Kobe untuk makan masakan India.",
        benar: "こうべへ インドりょうりを たべに いきます。",
        salah: ["こうべへ インドりょうりを たべるに いきます。", "こうべへ インドりょうりを たべますに いきます。", "こうべへ インドりょうりを たべで いきます。"],
      },
      {
        arti: "Pergi ke Kobe untuk berbelanja.",
        benar: "こうべへ かいものに いきます。",
        salah: ["こうべへ かいもので いきます。", "こうべへ かいものを いきます。", "こうべへ かいものに きました。"],
      },
      {
        arti: "(Saya) datang ke Jepang untuk belajar seni.",
        benar: "にほんへ びじゅつの べんきょうに きました。",
        salah: ["にほんへ びじゅつの べんきょうで きました。", "にほんへ びじゅつの べんきょうを きました。", "にほんへ びじゅつの べんきょうに きます。"],
      },
      {
        arti: "Besok (saya) pergi ke festival di Kyoto.",
        benar: "あした きょうとの おまつりに いきます。",
        salah: ["あした きょうとの おまつりで いきます。", "あしたに きょうとの おまつりに いきます。", "あした きょうとの おまつりを いきます。"],
      },
      {
        arti: "Liburan musim dingin pergi ke suatu tempat? ... Ya, ke Hokkaido untuk bermain ski.",
        benar: "ふゆやすみは どこかへ いきましたか。……はい。ほっかいどうへ スキーに いきました。",
        salah: ["ふゆやすみは どこへ いきましたか。……はい。ほっかいどうへ スキーに いきました。", "ふゆやすみは どこかへ いきましたか。……はい。ほっかいどうへ スキーで いきました。", "ふゆやすみは なにかへ いきましたか。……はい。ほっかいどうへ スキーに いきました。"],
      },
      {
        arti: "Karena haus, (saya) ingin minum sesuatu.",
        benar: "のどが かわきましたから、なにか のみたいです。",
        salah: ["のどが かわきましたから、なにも のみたいです。", "のどが かわきましたが、なにか のみたいです。", "のどが かわきましたから、なにか のみほしいです。"],
      },
      {
        arti: "(Pelayan) Mau pesan apa?",
        benar: "ごちゅうもんは？",
        salah: ["おちゅうもんは？", "ごちゅうもんを？", "ごちゅうもんで？"],
      },
      {
        arti: "(Membayar) Tolong (dibayar) masing-masing.",
        benar: "べつべつに おねがいします。",
        salah: ["べつべつで おねがいします。", "べつべつを おねがいします。", "いっしょに おねがいします。"],
      },
    ],
  },
  14: {
    susun: [
      { arti: "Tolong ajarkan cara membaca kanji ini.", potongan: ["この", "かんじ", "の", "よみかた", "を", "おしえて", "ください"] },
      {
        arti: "Tolong tuliskan nama dengan bolpoin.",
        potongan: ["ボールペン", "で", "なまえ", "を", "かいて", "ください"],
        alt: ["なまえをボールペンでかいてください"],
      },
      { arti: "Silakan makan yang banyak.", potongan: ["どうぞ", "たくさん", "たべて", "ください"] },
      {
        arti: "Sdr. Miller sekarang sedang menelepon.",
        potongan: ["ミラーさん", "は", "いま", "でんわ", "を", "かけて", "います"],
        alt: ["いまミラーさんはでんわをかけています"],
      },
      { arti: "Sekarang sedang turun hujan?", potongan: ["いま", "あめ", "が", "ふって", "います", "か"] },
      { arti: "Bagaimana kalau besok saya juga datang?", potongan: ["あした", "も", "きましょう", "か"] },
      { arti: "Bagaimana kalau saya pinjamkan payung?", potongan: ["かさ", "を", "かしましょう", "か"] },
      { arti: "Maaf, tolong ambilkan garam.", potongan: ["すみません", "が", "しお", "を", "とって", "ください"] },
      { arti: "Tolong datang pukul sepuluh.", potongan: ["じゅうじ", "に", "きて", "ください"] },
      { arti: "Tolong nyalakan lampu.", potongan: ["でんき", "を", "つけて", "ください"] },
      { arti: "Tolong bicara pelan-pelan.", potongan: ["ゆっくり", "はなして", "ください"] },
      { arti: "Tolong tunggu sebentar.", potongan: ["ちょっと", "まって", "ください"] },
    ],
    pilih: [
      {
        arti: "Tolong tuliskan nama dengan bolpoin.",
        benar: "ボールペンで なまえを かいて ください。",
        salah: ["ボールペンで なまえを かきて ください。", "ボールペンで なまえを かって ください。", "ボールペンを なまえで かいて ください。"],
      },
      {
        arti: "Sdr. Miller sekarang sedang menelepon.",
        benar: "ミラーさんは いま でんわを かけて います。",
        salah: ["ミラーさんは いま でんわを かけて ください。", "ミラーさんは いま でんわを かけます います。", "ミラーさんは いま でんわを かけって います。"],
      },
      {
        arti: "Hujan sedang turun.",
        benar: "あめが ふって います。",
        salah: ["あめが ふいて います。", "あめが ふって ください。", "あめを ふって います。"],
      },
      {
        arti: "Bagaimana kalau saya pinjamkan payung? ... Terima kasih, tolong.",
        benar: "かさを かしましょうか。……すみません。おねがいします。",
        salah: ["かさを かしませんか。……すみません。おねがいします。", "かさを かりましょうか。……すみません。おねがいします。", "かさを かしましょうか。……はい、かしましょう。"],
      },
      {
        arti: "Bagaimana kalau saya bawakan barangnya? ... Tidak, terima kasih.",
        benar: "にもつを もちましょうか。……いいえ、けっこうです。",
        salah: ["にもつを もちましょうか。……いいえ、もちましょう。", "にもつを もちませんか。……いいえ、けっこうです。", "にもつを もって いますか。……いいえ、けっこうです。"],
      },
      {
        arti: "Silakan makan yang banyak.",
        benar: "どうぞ たくさん たべて ください。",
        salah: ["どうぞ たくさん たべって ください。", "どうぞ たくさん たべりて ください。", "どうぞ たくさん たべましょうか。"],
      },
      {
        arti: "Maaf, tolong ambilkan garam.",
        benar: "すみませんが、しおを とって ください。",
        salah: ["すみませんが、しおを といて ください。", "すみませんが、しおを とりて ください。", "すみませんが、しおを とって います。"],
      },
      {
        arti: "Tolong panggilkan taksi.",
        benar: "タクシーを よんで ください。",
        salah: ["タクシーを よって ください。", "タクシーを よびて ください。", "タクシーを よいて ください。"],
      },
      {
        arti: "Tolong cepat sedikit.",
        benar: "すこし いそいで ください。",
        salah: ["すこし いそいて ください。", "すこし いそって ください。", "すこし いそぎて ください。"],
      },
      {
        arti: "Tolong tunggu sebentar.",
        benar: "ちょっと まって ください。",
        salah: ["ちょっと まちて ください。", "ちょっと まんで ください。", "ちょっと まいて ください。"],
      },
      {
        arti: "Tolong bicara pelan-pelan.",
        benar: "ゆっくり はなして ください。",
        salah: ["ゆっくり はなって ください。", "ゆっくり はなしって ください。", "ゆっくり はないて ください。"],
      },
      {
        arti: "Tolong matikan AC.",
        benar: "エアコンを けして ください。",
        salah: ["エアコンを つけて ください。", "エアコンを けいて ください。", "エアコンを けって ください。"],
      },
    ],
  },
  15: {
    susun: [
      { arti: "Bolehkah (saya) mengambil foto?", potongan: ["しゃしん", "を", "とって", "も", "いいです", "か"] },
      {
        arti: "Bolehkah (saya) merokok di sini?",
        potongan: ["ここ", "で", "たばこ", "を", "すって", "も", "いいです", "か"],
        alt: ["たばこをここですってもいいですか"],
      },
      {
        arti: "Tidak boleh merokok di sini.",
        potongan: ["ここ", "で", "たばこ", "を", "すって", "は", "いけません"],
        alt: ["たばこをここですってはいけません"],
      },
      { arti: "Saya sudah menikah.", potongan: ["わたし", "は", "けっこんして", "います"] },
      { arti: "Saya kenal Sdr. Tanaka.", potongan: ["わたし", "は", "たなかさん", "を", "しって", "います"] },
      { arti: "Saya mempunyai kamera.", potongan: ["わたし", "は", "カメラ", "を", "もって", "います"] },
      { arti: "Saya tinggal di Osaka.", potongan: ["わたし", "は", "おおさか", "に", "すんで", "います"] },
      { arti: "Sdr. Miller bekerja di IMC.", potongan: ["ミラーさん", "は", "IMC", "で", "はたらいて", "います"] },
      {
        arti: "Di supermarket dijual kecap ikan.",
        potongan: ["スーパー", "で", "ナンプラー", "を", "うって", "います"],
        alt: ["ナンプラーをスーパーでうっています"],
      },
      { arti: "Tidak boleh masuk ke sini.", potongan: ["ここ", "に", "はいって", "は", "いけません"] },
      { arti: "Bolehkah (saya) duduk di sini?", potongan: ["ここ", "に", "すわって", "も", "いいです", "か"] },
      {
        arti: "Tolong hentikan mobil di sini.",
        potongan: ["ここ", "に", "くるま", "を", "とめて", "ください"],
        alt: ["くるまをここにとめてください"],
      },
    ],
    pilih: [
      {
        arti: "Bolehkah (saya) mengambil foto?",
        benar: "しゃしんを とっても いいですか。",
        salah: ["しゃしんを とりても いいですか。", "しゃしんを とっては いいですか。", "しゃしんを とっても いけませんか。"],
      },
      {
        arti: "Bolehkah merokok di sini? ... Ya, boleh.",
        benar: "ここで たばこを すっても いいですか。……ええ、いいですよ。",
        salah: ["ここで たばこを すっても いいですか。……ええ、いけません。", "ここで たばこを すっても いいですか。……ええ、すっては いいですよ。", "ここに たばこを すっても いいですか。……ええ、いいですよ。"],
      },
      {
        arti: "Tidak boleh merokok di sini. Karena dilarang merokok.",
        benar: "ここで たばこを すっては いけません。きんえんですから。",
        salah: ["ここで たばこを すっても いけません。きんえんですから。", "ここで たばこを すっては いいです。きんえんですから。", "ここで たばこを すっては いけません。きんえんですが。"],
      },
      {
        arti: "Saya sudah menikah.",
        benar: "わたしは けっこんして います。",
        salah: ["わたしは けっこんします。", "わたしは けっこんしました います。", "わたしは けっこんしって います。"],
      },
      {
        arti: "Tahu nomor telepon kantor walikota? ... Tidak, tidak tahu.",
        benar: "しやくしょの でんわばんごうを しって いますか。……いいえ、しりません。",
        salah: ["しやくしょの でんわばんごうを しって いますか。……いいえ、しって いません。", "しやくしょの でんわばんごうを しって いますか。……いいえ、しりませんでした。", "しやくしょの でんわばんごうを しりますか。……いいえ、しりません。"],
      },
      {
        arti: "Saya tinggal di Osaka.",
        benar: "わたしは おおさかに すんで います。",
        salah: ["わたしは おおさかで すんで います。", "わたしは おおさかに すみて います。", "わたしは おおさかに すって います。"],
      },
      {
        arti: "IMC memproduksi perangkat lunak komputer.",
        benar: "IMCは コンピューターソフトを つくって います。",
        salah: ["IMCは コンピューターソフトを つくりて います。", "IMCは コンピューターソフトに つくって います。", "IMCは コンピューターソフトを うって います。"],
      },
      {
        arti: "Sdr. Miller bekerja di IMC.",
        benar: "ミラーさんは IMCで はたらいて います。",
        salah: ["ミラーさんは IMCに はたらいて います。", "ミラーさんは IMCで はたらって います。", "ミラーさんは IMCで はたらきて います。"],
      },
      {
        arti: "Adik perempuan saya kuliah di universitas.",
        benar: "いもうとは だいがくで べんきょうして います。",
        salah: ["いもうとさんは だいがくで べんきょうして います。", "いもうとは だいがくに べんきょうして います。", "あねは だいがくで べんきょうして います。"],
      },
      {
        arti: "Tidak boleh masuk ke sini.",
        benar: "ここに はいっては いけません。",
        salah: ["ここで はいっては いけません。", "ここに はいりては いけません。", "ここに はいっても いいです。"],
      },
      {
        arti: "Silakan naik bus nomor 16 dari stasiun Kyoto.",
        benar: "きょうとえきから 16ばんの バスに のって ください。",
        salah: ["きょうとえきから 16ばんの バスを のって ください。", "きょうとえきから 16ばんの バスで のって ください。", "きょうとえきから 16ばんの バスに のりて ください。"],
      },
      {
        arti: "Tolong tuliskan alamat di sini.",
        benar: "ここに じゅうしょを かいて ください。",
        salah: ["ここに じゅうしょに かいて ください。", "ここに じゅうしょを かきて ください。", "ここを じゅうしょに かいて ください。"],
      },
    ],
  },
  16: {
    susun: [
      {
        arti: "Pagi hari (saya) joging, mandi, lalu pergi ke kantor.",
        potongan: ["あさ", "ジョギング", "を", "して", "シャワー", "を", "あびて", "かいしゃ", "へ", "いきます"],
      },
      {
        arti: "(Saya) pergi ke Kobe, menonton film, lalu minum teh.",
        potongan: ["こうべ", "へ", "いって", "えいが", "を", "みて", "おちゃ", "を", "のみました"],
      },
      { arti: "Sdr. Miller muda dan sehat.", potongan: ["ミラーさん", "は", "わかくて", "げんき", "です"] },
      { arti: "Sdr. Miller tampan dan baik hati.", potongan: ["ミラーさん", "は", "ハンサムで", "しんせつ", "です"] },
      { arti: "Nara adalah kota yang tenang dan indah.", potongan: ["なら", "は", "しずかで", "きれいな", "まち", "です"] },
      { arti: "Tekan tombol setelah memasukkan uang.", potongan: ["おかね", "を", "いれて", "から", "ボタン", "を", "おして", "ください"] },
      { arti: "Setelah pekerjaan ini selesai, (saya) makan.", potongan: ["この", "しごと", "が", "おわって", "から", "たべます"] },
      { arti: "Osaka makanannya enak.", potongan: ["おおさか", "は", "たべもの", "が", "おいしい", "です"] },
      { arti: "Sdri. Maria rambutnya panjang.", potongan: ["マリアさん", "は", "かみ", "が", "ながい", "です"] },
      {
        arti: "Pukul tujuh (saya) keluar dari rumah.",
        potongan: ["しちじ", "に", "うち", "を", "でます"],
        alt: ["うちをしちじにでます"],
      },
      {
        arti: "(Saya) turun dari kereta di Umeda.",
        potongan: ["うめだ", "で", "でんしゃ", "を", "おりました"],
        alt: ["でんしゃをうめだでおりました"],
      },
      {
        arti: "Bagaimana caranya pergi ke universitas?",
        potongan: ["だいがく", "まで", "どうやって", "いきます", "か"],
        alt: ["どうやってだいがくまでいきますか"],
      },
    ],
    pilih: [
      {
        arti: "(Saya) pergi ke Kobe, menonton film, lalu minum teh.",
        benar: "こうべへ いって、えいがを みて、おちゃを のみました。",
        salah: ["こうべへ いきて、えいがを みて、おちゃを のみました。", "こうべへ いって、えいがを みって、おちゃを のみました。", "こうべへ いって、えいがを みて、おちゃを のんで。"],
      },
      {
        arti: "Sdr. Miller muda dan sehat.",
        benar: "ミラーさんは わかくて、げんきです。",
        salah: ["ミラーさんは わかいて、げんきです。", "ミラーさんは わかいで、げんきです。", "ミラーさんは わかくて、げんきでです。"],
      },
      {
        arti: "Kemarin cuacanya baik dan panas.",
        benar: "きのうは てんきが よくて、あつかったです。",
        salah: ["きのうは てんきが いくて、あつかったです。", "きのうは てんきが よくて、あついでした。", "きのうは てんきが いいで、あつかったです。"],
      },
      {
        arti: "Sdr. Miller tampan dan baik hati.",
        benar: "ミラーさんは ハンサムで、しんせつです。",
        salah: ["ミラーさんは ハンサムくて、しんせつです。", "ミラーさんは ハンサムなで、しんせつです。", "ミラーさんは ハンサムて、しんせつです。"],
      },
      {
        arti: "Sdri. Karina mahasiswi, sedangkan Sdri. Maria ibu rumah tangga.",
        benar: "カリナさんは がくせいで、マリアさんは しゅふです。",
        salah: ["カリナさんは がくせいくて、マリアさんは しゅふです。", "カリナさんは がくせいて、マリアさんは しゅふです。", "カリナさんは がくせいの、マリアさんは しゅふです。"],
      },
      {
        arti: "Tekan tombol setelah memasukkan uang.",
        benar: "おかねを いれてから、ボタンを おして ください。",
        salah: ["ボタンを おしてから、おかねを いれて ください。", "おかねを いれるから、ボタンを おして ください。", "おかねを いれてから、ボタンを おいて ください。"],
      },
      {
        arti: "Osaka makanannya enak.",
        benar: "おおさかは たべものが おいしいです。",
        salah: ["おおさかは たべものを おいしいです。", "おおさかが たべものは おいしいです。", "おおさかは たべものが おいしくです。"],
      },
      {
        arti: "Sdri. Maria rambutnya panjang.",
        benar: "マリアさんは かみが ながいです。",
        salah: ["マリアさんは かみが みじかいです。", "マリアさんは かみを ながいです。", "マリアさんは かみが ながくです。"],
      },
      {
        arti: "Pukul tujuh (saya) keluar dari rumah.",
        benar: "しちじに うちを でます。",
        salah: ["しちじに うちに でます。", "しちじに うちで でます。", "しちじに うちを はいります。"],
      },
      {
        arti: "(Saya) turun dari kereta di Umeda.",
        benar: "うめだで でんしゃを おりました。",
        salah: ["うめだで でんしゃに おりました。", "うめだに でんしゃを おりました。", "うめだで でんしゃを のりました。"],
      },
      {
        arti: "Bagaimana caranya pergi ke universitas? ... Dari stasiun Kyoto naik bus nomor 16, lalu turun di Daigakumae.",
        benar: "だいがくまで どうやって いきますか。……きょうとえきから 16ばんの バスに のって、だいがくまえで おります。",
        salah: ["だいがくまで どうして いきますか。……きょうとえきから 16ばんの バスに のって、だいがくまえで おります。", "だいがくまで どうやって いきますか。……きょうとえきから 16ばんの バスを のって、だいがくまえで おります。", "だいがくまで どうやって いきますか。……きょうとえきから 16ばんの バスに のりて、だいがくまえで おります。"],
      },
      {
        arti: "Payung Sdr. Miller yang mana? ... Payung yang biru itu.",
        benar: "ミラーさんの かさは どれですか。……あの あおい かさです。",
        salah: ["ミラーさんの かさは どのですか。……あの あおい かさです。", "ミラーさんの かさは どれ かさですか。……あの あおい かさです。", "ミラーさんの かさは どれですか。……あの あおいな かさです。"],
      },
    ],
  },
  17: {
    susun: [
      {
        arti: "Jangan mengambil foto di sini!",
        potongan: ["ここ", "で", "しゃしん", "を", "とらないで", "ください"],
        alt: ["しゃしんをここでとらないでください"],
      },
      { arti: "Karena saya sehat, jangan khawatir.", potongan: ["わたし", "は", "げんき", "です", "から", "しんぱいしないで", "ください"] },
      { arti: "(Saya) harus minum obat.", potongan: ["くすり", "を", "のまなければ", "なりません"] },
      { arti: "Besok tidak perlu datang.", potongan: ["あした", "こなくて", "も", "いいです"] },
      { arti: "Barangnya jangan diletakkan di sini.", potongan: ["にもつ", "は", "ここ", "に", "おかないで", "ください"] },
      { arti: "Makan siangnya, (saya) makan di kantin perusahaan.", potongan: ["ひるごはん", "は", "かいしゃ", "の", "しょくどう", "で", "たべます"] },
      { arti: "Rapat selesai sebelum pukul lima.", potongan: ["かいぎ", "は", "ごじ", "までに", "おわります"] },
      {
        arti: "(Saya) harus mengembalikan buku paling lambat hari Sabtu.",
        potongan: ["どようび", "までに", "ほん", "を", "かえさなければ", "なりません"],
        alt: ["ほんをどようびまでにかえさなければなりません"],
      },
      { arti: "(Saya) bekerja sampai pukul lima.", potongan: ["ごじ", "まで", "はたらきます"] },
      { arti: "Tidak perlu melepas sepatu.", potongan: ["くつ", "を", "ぬがなくて", "も", "いいです"] },
      { arti: "Jangan lupa (membawa) paspor.", potongan: ["パスポート", "を", "わすれないで", "ください"] },
      { arti: "Hari ini (saya) harus lembur.", potongan: ["きょう", "は", "ざんぎょうしなければ", "なりません"] },
    ],
    pilih: [
      {
        arti: "Jangan mengambil foto di sini!",
        benar: "ここで しゃしんを とらないで ください。",
        salah: ["ここで しゃしんを とりないで ください。", "ここで しゃしんを とらなくて ください。", "ここで しゃしんを とって ください。"],
      },
      {
        arti: "(Saya) harus minum obat.",
        benar: "くすりを のまなければ なりません。",
        salah: ["くすりを のみなければ なりません。", "くすりを のまなくても いいです。", "くすりを のまないで ください。"],
      },
      {
        arti: "Besok tidak perlu datang.",
        benar: "あした こなくても いいです。",
        salah: ["あした きなくても いいです。", "あした こなければ なりません。", "あした くなくても いいです。"],
      },
      {
        arti: "Karena saya sehat, jangan khawatir.",
        benar: "わたしは げんきですから、しんぱいしないで ください。",
        salah: ["わたしは げんきですから、しんぱいしなくて ください。", "わたしは げんきですから、しんぱいさないで ください。", "わたしは げんきですから、しんぱいして ください。"],
      },
      {
        arti: "Barangnya jangan diletakkan di sini.",
        benar: "にもつは ここに おかないで ください。",
        salah: ["にもつをは ここに おかないで ください。", "にもつは ここで おかないで ください。", "にもつは ここに おきないで ください。"],
      },
      {
        arti: "Rapat selesai sebelum pukul lima.",
        benar: "かいぎは ごじまでに おわります。",
        salah: ["かいぎは ごじまで おわります。", "かいぎは ごじまでに おわりません。", "かいぎは ごじからに おわります。"],
      },
      {
        arti: "(Saya) bekerja sampai pukul lima.",
        benar: "ごじまで はたらきます。",
        salah: ["ごじまでに はたらきます。", "ごじから はたらきます。", "ごじまで はたらいて ください。"],
      },
      {
        arti: "(Saya) harus mengembalikan buku paling lambat hari Sabtu.",
        benar: "どようびまでに ほんを かえさなければ なりません。",
        salah: ["どようびまでに ほんを かえしなければ なりません。", "どようびまでに ほんを かえさなくても いいです。", "どようびまで ほんを かえさなければ なりません。"],
      },
      {
        arti: "Tidak perlu melepas sepatu.",
        benar: "くつを ぬがなくても いいです。",
        salah: ["くつを ぬぎなくても いいです。", "くつを ぬがなければ なりません。", "くつを ぬがないで ください。"],
      },
      {
        arti: "Ada apa? ... Kepala (saya) sakit.",
        benar: "どうしましたか。……あたまが いたいです。",
        salah: ["どうしましたか。……あたまを いたいです。", "どうしましたか。……あたまが いたくです。", "どうしてですか。……あたまが いたいです。"],
      },
      {
        arti: "(Kepada orang sakit) Semoga lekas sembuh.",
        benar: "おだいじに。",
        salah: ["いってらっしゃい。", "だいじょうぶです。", "おかえりなさい。"],
      },
      {
        arti: "Hari ini (saya) harus lembur.",
        benar: "きょうは ざんぎょうしなければ なりません。",
        salah: ["きょうは ざんぎょうさなければ なりません。", "きょうは ざんぎょうしなくても いいです。", "きょうは ざんぎょうしないで ください。"],
      },
    ],
  },
  18: {
    susun: [
      { arti: "Sdr. Miller bisa berbahasa Jepang.", potongan: ["ミラーさん", "は", "にほんご", "が", "できます"] },
      { arti: "Sdr. Miller bisa membaca kanji.", potongan: ["ミラーさん", "は", "かんじ", "を", "よむ", "こと", "が", "できます"] },
      { arti: "Bisa membayar dengan kartu.", potongan: ["カード", "で", "はらう", "こと", "が", "できます"] },
      { arti: "Hobi saya musik.", potongan: ["わたし", "の", "しゅみ", "は", "おんがく", "です"] },
      { arti: "Hobi saya mendengarkan musik.", potongan: ["わたし", "の", "しゅみ", "は", "おんがく", "を", "きく", "こと", "です"] },
      { arti: "Sebelum datang ke Jepang, (saya) belajar bahasa Jepang.", potongan: ["にほん", "へ", "くる", "まえ", "に", "にほんご", "を", "べんきょうしました"] },
      { arti: "Sebelum tidur, (saya) membaca buku.", potongan: ["ねる", "まえ", "に", "ほん", "を", "よみます"] },
      { arti: "Sebelum makan, (saya) mencuci tangan.", potongan: ["しょくじ", "の", "まえ", "に", "て", "を", "あらいます"] },
      { arti: "Sdr. Tanaka keluar satu jam yang lalu.", potongan: ["たなかさん", "は", "いちじかん", "まえ", "に", "でかけました"] },
      { arti: "Di Jepang tidak mudah melihat kuda.", potongan: ["にほん", "で", "は", "なかなか", "うま", "を", "みる", "こと", "が", "できません"] },
      { arti: "(Saya) ingin sekali pergi ke Hokkaido.", potongan: ["ぜひ", "ほっかいどう", "へ", "いきたい", "です"] },
      { arti: "Saya bisa bermain piano.", potongan: ["わたし", "は", "ピアノ", "を", "ひく", "こと", "が", "できます"] },
    ],
    pilih: [
      {
        arti: "Sdr. Miller bisa berbahasa Jepang.",
        benar: "ミラーさんは にほんごが できます。",
        salah: ["ミラーさんは にほんごを できます。", "ミラーさんは にほんごに できます。", "ミラーさんは にほんごが できる ことです。"],
      },
      {
        arti: "Sdr. Miller bisa membaca kanji.",
        benar: "ミラーさんは かんじを よむ ことが できます。",
        salah: ["ミラーさんは かんじを よみ ことが できます。", "ミラーさんは かんじを よむが できます。", "ミラーさんは かんじを よむ ことを できます。"],
      },
      {
        arti: "Bisa membayar dengan kartu.",
        benar: "カードで はらう ことが できます。",
        salah: ["カードで はらいます ことが できます。", "カードを はらう ことが できます。", "カードで はらって ことが できます。"],
      },
      {
        arti: "Hobi saya mendengarkan musik.",
        benar: "わたしの しゅみは おんがくを きく ことです。",
        salah: ["わたしの しゅみは おんがくを きくです。", "わたしの しゅみは おんがくを ききます ことです。", "わたしの しゅみは おんがくを きく ことが できます。"],
      },
      {
        arti: "Sebelum datang ke Jepang, (saya) belajar bahasa Jepang.",
        benar: "にほんへ くる まえに、にほんごを べんきょうしました。",
        salah: ["にほんへ きた まえに、にほんごを べんきょうしました。", "にほんへ きます まえに、にほんごを べんきょうしました。", "にほんへ くるの まえに、にほんごを べんきょうしました。"],
      },
      {
        arti: "Sebelum makan, (saya) mencuci tangan.",
        benar: "しょくじの まえに、てを あらいます。",
        salah: ["しょくじ まえに、てを あらいます。", "しょくじを まえに、てを あらいます。", "しょくじの あとで、てを あらいます。"],
      },
      {
        arti: "Sdr. Tanaka keluar satu jam yang lalu.",
        benar: "たなかさんは いちじかんまえに、でかけました。",
        salah: ["たなかさんは いちじかんの まえに、でかけました。", "たなかさんは いちじまえに、でかけました。", "たなかさんは いちじかんまえに、でかけます。"],
      },
      {
        arti: "Di Jepang tidak mudah melihat kuda.",
        benar: "にほんでは なかなか うまを みる ことが できません。",
        salah: ["にほんでは なかなか うまを みる ことが できます。", "にほんでは とても うまを みる ことが できません。", "にほんでは なかなか うまを みます ことが できません。"],
      },
      {
        arti: "(Saya) ingin sekali pergi ke Hokkaido.",
        benar: "ぜひ ほっかいどうへ いきたいです。",
        salah: ["ぜひ ほっかいどうへ いきたくないです。", "なかなか ほっかいどうへ いきたいです。", "ぜひ ほっかいどうへ いきません。"],
      },
      {
        arti: "Karena salju turun banyak, tahun ini bisa bermain ski.",
        benar: "ゆきが たくさん ふりましたから、ことしは スキーが できます。",
        salah: ["ゆきが たくさん ふりましたから、ことしは スキーを できます。", "ゆきが たくさん ふりましたが、ことしは スキーが できます。", "ゆきが たくさん ふりましたから、ことしは スキーが できる ことです。"],
      },
      {
        arti: "Itu menarik, ya.",
        benar: "それは おもしろいですね。",
        salah: ["それは おもしろいですか。", "それは おもしろくですね。", "それは おもしろいでしたね。"],
      },
      {
        arti: "Bisakah (Anda) bermain piano?",
        benar: "ピアノを ひく ことが できますか。",
        salah: ["ピアノを ひきます ことが できますか。", "ピアノを する ことが できますか。", "ピアノを ひく ことを できますか。"],
      },
    ],
  },
  19: {
    susun: [
      { arti: "(Saya) pernah berkuda.", potongan: ["うま", "に", "のった", "こと", "が", "あります"] },
      { arti: "Tahun lalu (saya) berkuda di Hokkaido.", potongan: ["きょねん", "ほっかいどう", "で", "うま", "に", "のりました"] },
      {
        arti: "Hari Minggu (saya) bermain tenis, menonton film, dan lain-lain.",
        potongan: ["にちようび", "は", "テニス", "を", "したり", "えいが", "を", "みたり", "します"],
        alt: ["にちようびはえいがをみたりテニスをしたりします"],
      },
      { arti: "Mulai sekarang (cuaca) akan menjadi dingin.", potongan: ["これから", "さむく", "なります"] },
      { arti: "Anak itu sudah menjadi sehat.", potongan: ["こども", "は", "げんきに", "なりました"] },
      { arti: "Saya sudah berumur 25 tahun.", potongan: ["わたし", "は", "にじゅうごさい", "に", "なりました"] },
      {
        arti: "Saya belum pernah naik pesawat sekali pun.",
        potongan: ["いちども", "ひこうき", "に", "のった", "こと", "が", "ありません"],
        alt: ["ひこうきにいちどものったことがありません"],
      },
      { arti: "Pernahkah (Anda) makan sushi?", potongan: ["すし", "を", "たべた", "こと", "が", "あります", "か"] },
      { arti: "Sedikit demi sedikit (saya) menjadi pandai.", potongan: ["だんだん", "じょうずに", "なります"] },
      { arti: "Sebentar lagi musim panas.", potongan: ["もうすぐ", "なつ", "です"] },
      {
        arti: "Hari Minggu (saya) membersihkan kamar, mencuci pakaian, dan lain-lain.",
        potongan: ["にちようび", "は", "へや", "を", "そうじしたり", "せんたくしたり", "します"],
        alt: ["にちようびはせんたくしたりへやをそうじしたりします"],
      },
      { arti: "Kondisi (badan) saya sudah membaik.", potongan: ["ちょうし", "が", "よく", "なりました"] },
    ],
    pilih: [
      {
        arti: "(Saya) pernah berkuda.",
        benar: "うまに のった ことが あります。",
        salah: ["うまに のる ことが あります。", "うまに のりました ことが あります。", "うまを のった ことが あります。"],
      },
      {
        arti: "Tahun lalu (saya) berkuda di Hokkaido.",
        benar: "きょねん ほっかいどうで うまに のりました。",
        salah: ["きょねん ほっかいどうで うまに のった ことが あります。", "きょねん ほっかいどうに うまに のりました。", "きょねん ほっかいどうで うまを のりました。"],
      },
      {
        arti: "Hari Minggu (saya) bermain tenis, menonton film, dan lain-lain.",
        benar: "にちようびは テニスを したり、えいがを みたり します。",
        salah: ["にちようびは テニスを したり、えいがを みます。", "にちようびは テニスを しったり、えいがを みったり します。", "にちようびは テニスを したり、えいがを みたり です。"],
      },
      {
        arti: "(Cuacanya) menjadi dingin.",
        benar: "さむく なります。",
        salah: ["さむいに なります。", "さむいく なります。", "さむく します。"],
      },
      {
        arti: "(Ia) menjadi sehat.",
        benar: "げんきに なります。",
        salah: ["げんきく なります。", "げんきなに なります。", "げんきで なります。"],
      },
      {
        arti: "(Saya) menjadi berumur 25 tahun.",
        benar: "にじゅうごさいに なります。",
        salah: ["にじゅうごさいく なります。", "にじゅうごさいを なります。", "にじゅうごさいで なります。"],
      },
      {
        arti: "Saya belum pernah naik pesawat sekali pun.",
        benar: "いちども ひこうきに のった ことが ありません。",
        salah: ["いちども ひこうきに のった ことが あります。", "いちども ひこうきに のる ことが ありません。", "いちども ひこうきを のった ことが ありません。"],
      },
      {
        arti: "Pernahkah (Anda) menonton sumo? ... Ya, sekali.",
        benar: "すもうを みた ことが ありますか。……ええ、いちど あります。",
        salah: ["すもうを みた ことが ありますか。……ええ、いちども あります。", "すもうを みる ことが ありますか。……ええ、いちど あります。", "すもうを みた ことが ありますか。……ええ、いちど みました ことが あります。"],
      },
      {
        arti: "Sedikit demi sedikit (saya) menjadi pandai.",
        benar: "だんだん じょうずに なります。",
        salah: ["だんだん じょうずく なります。", "だんだん じょうずなに なります。", "もうすぐ じょうずに なりました。"],
      },
      {
        arti: "Sebentar lagi musim panas.",
        benar: "もうすぐ なつです。",
        salah: ["だんだん なつです。", "もうすぐ なつに です。", "もうすぐ なつでした。"],
      },
      {
        arti: "Apa kabar? ... Berkat doa Anda, baik.",
        benar: "おげんきですか。……おかげさまで、げんきです。",
        salah: ["おげんきですか。……かんぱい、げんきです。", "おげんきですか。……おだいじに、げんきです。", "おげんきですか。……おかげさまで、げんきじゃ ありません。"],
      },
      {
        arti: "Kondisi (badan) saya sudah membaik.",
        benar: "ちょうしが よく なりました。",
        salah: ["ちょうしが いく なりました。", "ちょうしが よいに なりました。", "ちょうしが よく しました。"],
      },
    ],
  },
  20: {
    susun: [
      { arti: "(Bentuk biasa) Mau minum kopi?", potongan: ["コーヒー", "を", "のむ"] },
      { arti: "(Bentuk biasa) Besok ke Kyoto, yuk?", potongan: ["あした", "きょうと", "へ", "いかない"] },
      { arti: "(Bentuk biasa) Apel ini enak, ya.", potongan: ["この", "りんご", "おいしい", "ね"] },
      { arti: "(Bentuk biasa) Di situ ada gunting?", potongan: ["そこ", "に", "はさみ", "ある"] },
      { arti: "(Bentuk biasa) Saya punya kamus.", potongan: ["わたし", "は", "じしょ", "を", "もって", "いる"] },
      { arti: "(Bentuk biasa) Kare itu pedas, tetapi enak.", potongan: ["その", "カレー", "は", "からい", "けど", "おいしい"] },
      {
        arti: "(Bentuk biasa) Ada tiket sumo, mau pergi bersama?",
        potongan: ["すもう", "の", "チケット", "が", "ある", "けど", "いっしょに", "いかない"],
      },
      { arti: "(Bentuk biasa) Saya perlu visa.", potongan: ["わたし", "は", "ビザ", "が", "いる"] },
      {
        arti: "(Bentuk biasa) (Saya) memeriksa kata itu di kamus.",
        potongan: ["その", "ことば", "を", "じしょ", "で", "しらべる"],
        alt: ["じしょでそのことばをしらべる"],
      },
      { arti: "(Bentuk biasa) Besok (saya) tidak pergi ke kantor.", potongan: ["あした", "かいしゃ", "へ", "いかない"] },
      { arti: "(Bentuk biasa) Kemarin hujan.", potongan: ["きのう", "は", "あめ", "だった"] },
      { arti: "(Bentuk biasa) Ini tidak mahal.", potongan: ["これ", "は", "たかくない"] },
    ],
    pilih: [
      {
        arti: "(Bentuk biasa) Mau minum kopi? ... Ya, mau.",
        benar: "コーヒーを のむ？……うん、のむ。",
        salah: ["コーヒーを のみ？……うん、のみ。", "コーヒーを のむ？……ううん、のむ。", "コーヒーを のんだ？……うん、のむ。"],
      },
      {
        arti: "(Bentuk biasa) Nanti malam luang? ... Tidak, tidak luang.",
        benar: "こんばん ひま？……ううん、ひまじゃ ない。",
        salah: ["こんばん ひま？……ううん、ひまく ない。", "こんばん ひま？……うん、ひまじゃ ない。", "こんばん ひま？……ううん、ひまだ ない。"],
      },
      {
        arti: "(Bentuk biasa) Besok ke Kyoto, yuk?",
        benar: "あした きょうとへ いかない？",
        salah: ["あした きょうとへ いきない？", "あした きょうとへ いくない？", "あした きょうとへ いかなかった？"],
      },
      {
        arti: "(Bentuk biasa) Punya kamus? ... Tidak, tidak punya.",
        benar: "じしょ、もってる？……ううん、もってない。",
        salah: ["じしょ、もってる？……ううん、もっていらない。", "じしょ、もってる？……うん、もってない。", "じしょ、もってる？……ううん、もちない。"],
      },
      {
        arti: "(Bentuk biasa) Kare itu enak? ... Ya, pedas tetapi enak.",
        benar: "その カレー、おいしい？……うん、からいけど、おいしい。",
        salah: ["その カレー、おいしい？……うん、からいだけど、おいしい。", "その カレー、おいしい？……うん、からくけど、おいしい。", "その カレー、おいしい？……ううん、からいけど、おいしい。"],
      },
      {
        arti: "(Bentuk biasa) Kemarin hujan.",
        benar: "きのうは あめだった。",
        salah: ["きのうは あめかった。", "きのうは あめだ。", "きのうは あめじゃ なかった。"],
      },
      {
        arti: "(Bentuk biasa) Ujian kemarin tidak mudah.",
        benar: "きのうの しけんは かんたんじゃ なかった。",
        salah: ["きのうの しけんは かんたんくなかった。", "きのうの しけんは かんたんじゃ ない。", "きのうの しけんは かんたんだった。"],
      },
      {
        arti: "(Bentuk biasa) Pesta kemarin menyenangkan.",
        benar: "きのうの パーティーは たのしかった。",
        salah: ["きのうの パーティーは たのしいだった。", "きのうの パーティーは たのしくなかった。", "きのうの パーティーは たのしい。"],
      },
      {
        arti: "(Bentuk biasa) Saya tidak minum sake.",
        benar: "わたしは おさけを のまない。",
        salah: ["わたしは おさけを のみない。", "わたしは おさけを のむない。", "わたしは おさけを のまなかった。"],
      },
      {
        arti: "(Bentuk biasa) (Saya) sudah makan.",
        benar: "もう たべた。",
        salah: ["もう たべった。", "もう たべる。", "もう たべない。"],
      },
      {
        arti: "(Saya sudah) kenyang.",
        benar: "おなかが いっぱいです。",
        salah: ["おなかが すきました。", "おなかが いたいです。", "おなかが いっぱいじゃ ありません。"],
      },
      {
        arti: "Kalau mau, ayo pergi bersama-sama.",
        benar: "よかったら、いっしょに いきませんか。",
        salah: ["よかったら、いっしょに いきましたか。", "よかったら、ひとりで いきませんか。", "よくて、いっしょに いきませんか。"],
      },
    ],
  },
  21: {
    susun: [
      { arti: "Saya kira besok hujan.", potongan: ["あした", "あめ", "が", "ふる", "と", "おもいます"] },
      { arti: "Saya kira Teresa sudah tidur.", potongan: ["テレサちゃん", "は", "もう", "ねた", "と", "おもいます"] },
      { arti: "Saya kira Sdr. Miller tidak tahu.", potongan: ["ミラーさん", "は", "しらない", "と", "おもいます"] },
      { arti: "Saya pikir di Jepang harga barangnya mahal.", potongan: ["にほん", "は", "ぶっか", "が", "たかい", "と", "おもいます"] },
      { arti: "Bagaimana pendapat Anda tentang bandara baru?", potongan: ["あたらしい", "くうこう", "に", "ついて", "どう", "おもいます", "か"] },
      { arti: "Sebelum tidur, (kita) mengucapkan \"Selamat tidur\".", potongan: ["ねる", "まえ", "に", "「おやすみなさい」", "と", "いいます"] },
      { arti: "Sdr. Miller mengatakan bahwa ia akan dinas ke Tokyo.", potongan: ["ミラーさん", "は", "とうきょう", "へ", "しゅっちょうする", "と", "いいました"] },
      { arti: "Besok (Anda) pergi ke pesta, bukan?", potongan: ["あした", "パーティー", "に", "いく", "でしょう"] },
      { arti: "Di Tokyo ada pertandingan sepak bola.", potongan: ["とうきょう", "で", "サッカー", "の", "しあい", "が", "あります"] },
      { arti: "Bagaimana kalau minum bir atau apa?", potongan: ["ちょっと", "ビール", "でも", "のみません", "か"] },
      { arti: "Saya juga berpikir begitu.", potongan: ["わたし", "も", "そう", "おもいます"] },
      { arti: "(Saya) berkata kepada ayah bahwa (saya) ingin belajar di luar negeri.", potongan: ["ちち", "に", "りゅうがくしたい", "と", "いいました"] },
    ],
    pilih: [
      {
        arti: "Saya kira besok hujan.",
        benar: "あした あめが ふると おもいます。",
        salah: ["あした あめが ふりますと おもいます。", "あした あめが ふるを おもいます。", "あした あめが ふったと おもいます。"],
      },
      {
        arti: "(Apakah ia tahu berita ini?) Tidak, saya kira (ia) tidak tahu.",
        benar: "いいえ、しらないと おもいます。",
        salah: ["いいえ、しって いないと おもいます。", "いいえ、しりますと おもいます。", "いいえ、しらないを おもいます。"],
      },
      {
        arti: "Saya pikir di Jepang harga barangnya mahal.",
        benar: "にほんは ぶっかが たかいと おもいます。",
        salah: ["にほんは ぶっかが たかいだと おもいます。", "にほんは ぶっかが たかくと おもいます。", "にほんは ぶっかを たかいと おもいます。"],
      },
      {
        arti: "(Bandara baru) bersih, tetapi lalu lintasnya agak kurang praktis.",
        benar: "きれいですが、ちょっと こうつうが ふべんだと おもいます。",
        salah: ["きれいですが、ちょっと こうつうが ふべんと おもいます。", "きれいですが、ちょっと こうつうが ふべんなと おもいます。", "きれいですが、ちょっと こうつうが ふべんですと おもいます。"],
      },
      {
        arti: "HP itu praktis, ya. ... Saya juga berpikir begitu.",
        benar: "ケータイは べんりですね。……わたしも そう おもいます。",
        salah: ["ケータイは べんりですね。……わたしも そうと おもいます。", "ケータイは べんりですね。……わたしも そう いいます。", "ケータイは べんりですね。……わたしは そう おもいません。"],
      },
      {
        arti: "Sebelum tidur, (kita) mengucapkan \"Selamat tidur\".",
        benar: "ねる まえに、「おやすみなさい」と いいます。",
        salah: ["ねる まえに、「おやすみなさい」を いいます。", "ねる まえに、「おやすみなさい」と おもいます。", "ねた まえに、「おやすみなさい」と いいます。"],
      },
      {
        arti: "Sdr. Miller mengatakan bahwa ia akan dinas ke Tokyo.",
        benar: "ミラーさんは とうきょうへ しゅっちょうすると いいました。",
        salah: ["ミラーさんは とうきょうへ しゅっちょうしますと いいました。", "ミラーさんは とうきょうへ しゅっちょうすると おもいました。", "ミラーさんは とうきょうへ しゅっちょうするを いいました。"],
      },
      {
        arti: "Besok (Anda) pergi ke pesta, bukan? ... Ya, pergi.",
        benar: "あした パーティーに いくでしょう？……ええ、いきます。",
        salah: ["あした パーティーに いきますでしょう？……ええ、いきます。", "あした パーティーに いくでしょう？……ええ、いきません。", "あした パーティーに いくだでしょう？……ええ、いきます。"],
      },
      {
        arti: "Hokkaido dingin, bukan? ... Tidak, tidak begitu dingin.",
        benar: "ほっかいどうは さむかったでしょう？……いいえ、そんなに さむくなかったです。",
        salah: ["ほっかいどうは さむかったでしょう？……いいえ、そんなに さむかったです。", "ほっかいどうは さむいかったでしょう？……いいえ、そんなに さむくなかったです。", "ほっかいどうは さむかったでしょう？……いいえ、とても さむくなかったです。"],
      },
      {
        arti: "Di Tokyo ada pertandingan sepak bola.",
        benar: "とうきょうで サッカーの しあいが あります。",
        salah: ["とうきょうに サッカーの しあいが あります。", "とうきょうで サッカーの しあいが います。", "とうきょうで サッカーの しあいを あります。"],
      },
      {
        arti: "Bagaimana kalau minum bir atau apa?",
        benar: "ちょっと ビールでも のみませんか。",
        salah: ["ちょっと ビールでも のみましたか。", "ちょっと ビールでも のみたいですか。", "ちょっと ビールを のみませんでしたか。"],
      },
      {
        arti: "(Saya) sudah harus pulang...",
        benar: "もう かえらないと……。",
        salah: ["もう かえりないと……。", "もう かえらなくても……。", "もう かえるないと……。"],
      },
    ],
  },
  22: {
    susun: [
      { arti: "Ini rumah yang dulu dihuni Sdr. Miller.", potongan: ["これ", "は", "ミラーさん", "が", "すんで", "いた", "うち", "です"] },
      { arti: "Rumah yang dulu dihuni Sdr. Miller sudah tua.", potongan: ["ミラーさん", "が", "すんで", "いた", "うち", "は", "ふるい", "です"] },
      { arti: "Ini kue yang dibuat oleh Sdr. Miller.", potongan: ["これ", "は", "ミラーさん", "が", "つくった", "ケーキ", "です"] },
      { arti: "Saya suka lukisan yang digambar Sdri. Karina.", potongan: ["わたし", "は", "カリナさん", "が", "かいた", "え", "が", "すき", "です"] },
      { arti: "Apakah (Anda) tahu tempat dia lahir?", potongan: ["かれ", "が", "うまれた", "ところ", "を", "しって", "います", "か"] },
      { arti: "Saya tidak punya waktu untuk sarapan.", potongan: ["わたし", "は", "あさごはん", "を", "たべる", "じかん", "が", "ありません"] },
      { arti: "Saya ada janji menonton film dengan teman.", potongan: ["わたし", "は", "ともだち", "と", "えいが", "を", "みる", "やくそく", "が", "あります"] },
      { arti: "Hari ini (saya) ada urusan pergi ke kantor walikota.", potongan: ["きょう", "は", "しやくしょ", "へ", "いく", "ようじ", "が", "あります"] },
      { arti: "Orang yang memakai kacamata itu Sdr. Tanaka.", potongan: ["めがね", "を", "かけて", "いる", "ひと", "は", "たなかさん", "です"] },
      { arti: "Siapa orang yang pergi ke Kyoto?", potongan: ["きょうと", "へ", "いった", "ひと", "は", "だれ", "です", "か"] },
      { arti: "Bagaimana kalau kita pergi sekarang?", potongan: ["いま", "から", "いきましょう", "か"] },
      { arti: "Ini topi yang saya beli di Paris.", potongan: ["これ", "は", "パリ", "で", "かった", "ぼうし", "です"] },
    ],
    pilih: [
      {
        arti: "Ini kue yang dibuat oleh Sdr. Miller.",
        benar: "これは ミラーさんが つくった ケーキです。",
        salah: ["これは ミラーさんは つくった ケーキです。", "これは ミラーさんが つくりました ケーキです。", "これは ミラーさんが つくったの ケーキです。"],
      },
      {
        arti: "Saya suka lukisan yang digambar Sdri. Karina.",
        benar: "わたしは カリナさんが かいた えが すきです。",
        salah: ["わたしは カリナさんが かいた えを すきです。", "わたしは カリナさんが かきました えが すきです。", "わたしは カリナさんが かいたの えが すきです。"],
      },
      {
        arti: "Rumah yang dulu dihuni Sdr. Miller sudah tua.",
        benar: "ミラーさんが すんで いた うちは ふるいです。",
        salah: ["ミラーさんが すんで いたの うちは ふるいです。", "ミラーさんが すみます うちは ふるいです。", "ミラーさんが すんで いた うちを ふるいです。"],
      },
      {
        arti: "Apakah (Anda) tahu tempat dia lahir?",
        benar: "かれが うまれた ところを しって いますか。",
        salah: ["かれは うまれた ところを しって いますか。", "かれが うまれました ところを しって いますか。", "かれが うまれた ところが しって いますか。"],
      },
      {
        arti: "Saya tidak punya waktu untuk sarapan.",
        benar: "あさごはんを たべる じかんが ありません。",
        salah: ["あさごはんを たべた じかんが ありません。", "あさごはんを たべます じかんが ありません。", "あさごはんを たべる じかんを ありません。"],
      },
      {
        arti: "(Saya) ada janji menonton film dengan teman.",
        benar: "ともだちと えいがを みる やくそくが あります。",
        salah: ["ともだちと えいがを みます やくそくが あります。", "ともだちと えいがを みる やくそくを あります。", "ともだちと えいがを みるの やくそくが あります。"],
      },
      {
        arti: "Orang yang memakai kacamata itu Sdr. Tanaka.",
        benar: "めがねを かけて いる ひとは たなかさんです。",
        salah: ["めがねを きて いる ひとは たなかさんです。", "めがねを はいて いる ひとは たなかさんです。", "めがねを かぶって いる ひとは たなかさんです。"],
      },
      {
        arti: "Orang yang memakai topi itu Sdr. Lee.",
        benar: "ぼうしを かぶって いる ひとは イーさんです。",
        salah: ["ぼうしを きて いる ひとは イーさんです。", "ぼうしを はいて いる ひとは イーさんです。", "ぼうしを かけて いる ひとは イーさんです。"],
      },
      {
        arti: "Sdri. Maria memakai rok.",
        benar: "マリアさんは スカートを はいて います。",
        salah: ["マリアさんは スカートを きて います。", "マリアさんは スカートを かぶって います。", "マリアさんは スカートを かけて います。"],
      },
      {
        arti: "Sdr. Santos memakai sweter.",
        benar: "サントスさんは セーターを きて います。",
        salah: ["サントスさんは セーターを はいて います。", "サントスさんは セーターを かぶって います。", "サントスさんは セーターを かけて います。"],
      },
      {
        arti: "Selamat!",
        benar: "おめでとうございます。",
        salah: ["おだいじに。", "おかげさまで。", "いただきます。"],
      },
      {
        arti: "Apakah kamar ini bisa dilihat hari ini? ... Ya. Bagaimana kalau kita pergi sekarang?",
        benar: "この へや、きょう みる ことが できますか。……ええ。いまから いきましょうか。",
        salah: ["この へや、きょう みる ことが できますか。……ええ。いまから いきましたか。", "この へや、きょう みる ことが できますか。……ええ。いまから いきませんでしたか。", "この へや、きょう みる ことが できますか。……ええ。いまで いきましょうか。"],
      },
    ],
  },
};
