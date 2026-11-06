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
      { arti: "Mari (kita) istirahat sebentar di sini.", potongan: ["ここ", "で", "ちょっと", "やすみましょう"], alt: ["ちょっとここでやすみましょう"] },
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
        salah: ["ミラーさんは とうきょうへ しゅっちょうするの いいました。", "ミラーさんは とうきょうへ しゅっちょうすると おもいました。", "ミラーさんは とうきょうへ しゅっちょうするを いいました。"],
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
  23: {
    susun: [
      { arti: "Ketika meminjam buku di perpustakaan, diperlukan kartu.", potongan: ["としょかん", "で", "ほん", "を", "かりる", "とき", "カード", "が", "いります"] },
      { arti: "Ketika menyeberang jalan, (saya) berhati-hati terhadap mobil.", potongan: ["みち", "を", "わたる", "とき", "くるま", "に", "きをつけます"] },
      { arti: "Ketika mengantuk, (saya) minum kopi.", potongan: ["ねむい", "とき", "コーヒー", "を", "のみます"] },
      { arti: "Ketika senggang, (saya) menonton video di rumah.", potongan: ["ひまな", "とき", "うち", "で", "ビデオ", "を", "みます"] },
      { arti: "Ketika masih anak-anak, (saya) sering berenang di sungai.", potongan: ["こども", "の", "とき", "よく", "かわ", "で", "およぎました"] },
      { arti: "Ketika kesepian, (saya) menelepon keluarga.", potongan: ["さびしい", "とき", "かぞく", "に", "でんわします"] },
      { arti: "Kalau tombol ini ditekan, uang kembalian keluar.", potongan: ["この", "ボタン", "を", "おす", "と", "おつり", "が", "でます"] },
      { arti: "Kalau tombol putar ini diputar, suaranya menjadi keras.", potongan: ["この", "つまみ", "を", "まわす", "と", "おと", "が", "おおきく", "なります"] },
      { arti: "Kalau menyeberangi jembatan itu, ada kantor pos.", potongan: ["あの", "はし", "を", "わたる", "と", "ゆうびんきょく", "が", "あります"] },
      { arti: "Kalau belok ke kanan di perempatan itu, ada stasiun.", potongan: ["あの", "こうさてん", "を", "みぎ", "へ", "まがる", "と", "えき", "が", "あります"] },
      { arti: "Kalau tuas ini ditarik, air keluar.", potongan: ["この", "レバー", "を", "ひく", "と", "みず", "が", "でます"] },
      { arti: "Ketika pulang ke negara asal, (saya) membeli oleh-oleh.", potongan: ["くに", "へ", "かえる", "とき", "おみやげ", "を", "かいます"] },
    ],
    pilih: [
      {
        arti: "Ketika meminjam buku di perpustakaan, diperlukan kartu.",
        benar: "としょかんで ほんを かりる とき、カードが いります。",
        salah: ["としょかんで ほんを かります とき、カードが いります。", "としょかんで ほんを かりるの とき、カードが いります。", "としょかんで ほんを かりる と、カードを いります。"],
      },
      {
        arti: "Ketika mengantuk, (saya) minum kopi.",
        benar: "ねむい とき、コーヒーを のみます。",
        salah: ["ねむいの とき、コーヒーを のみます。", "ねむいな とき、コーヒーを のみます。", "ねむくて とき、コーヒーを のみます。"],
      },
      {
        arti: "Ketika senggang, (saya) menonton video di rumah.",
        benar: "ひまな とき、うちで ビデオを みます。",
        salah: ["ひまの とき、うちで ビデオを みます。", "ひま とき、うちで ビデオを みます。", "ひまだ とき、うちで ビデオを みます。"],
      },
      {
        arti: "Ketika masih anak-anak, (saya) sering berenang di sungai.",
        benar: "こどもの とき、よく かわで およぎました。",
        salah: ["こどもな とき、よく かわで およぎました。", "こども とき、よく かわで およぎました。", "こどもの とき、よく かわを およぎました。"],
      },
      {
        arti: "Ketika (akan) pulang ke negara asal, (saya) membeli oleh-oleh (di Jepang).",
        benar: "くにへ かえる とき、おみやげを かいます。",
        salah: ["くにへ かえった とき、おみやげを かいます。", "くにへ かえります とき、おみやげを かいます。", "くにへ かえるの とき、おみやげを かいます。"],
      },
      {
        arti: "Ketika (sudah) sampai di rumah, (saya) bilang \"ただいま\".",
        benar: "うちへ かえった とき、「ただいま」と いいます。",
        salah: ["うちへ かえる とき、「ただいま」と いいます。", "うちへ かえりました とき、「ただいま」と いいます。", "うちへ かえったの とき、「ただいま」と いいます。"],
      },
      {
        arti: "Kalau tombol ini ditekan, uang kembalian keluar.",
        benar: "この ボタンを おすと、おつりが でます。",
        salah: ["この ボタンを おすの と、おつりが でます。", "この ボタンを おすと、おつりを でます。", "この ボタンを おしたと、おつりが でます。"],
      },
      {
        arti: "Kalau tombol putar ini diputar, suaranya menjadi keras.",
        benar: "この つまみを まわすと、おとが おおきく なります。",
        salah: ["この つまみを まわすと、おとが おおきい なります。", "この つまみを まわすと、おとが おおきに なります。", "この つまみを まわしと、おとが おおきく なります。"],
      },
      {
        arti: "Kalau menyeberangi jembatan itu, ada kantor pos.",
        benar: "あの はしを わたると、ゆうびんきょくが あります。",
        salah: ["あの はしに わたると、ゆうびんきょくが あります。", "あの はしを わたって と、ゆうびんきょくが あります。", "あの はしを わたると、ゆうびんきょくを あります。"],
      },
      {
        arti: "Kalau belok ke kanan di lampu lalu lintas kedua, ada stasiun.",
        benar: "ふたつめの しんごうを みぎへ まがると、えきが あります。",
        salah: ["ふたつめの しんごうで みぎを まがると、えきが あります。", "ふたつめの しんごうを みぎへ まがって と、えきが あります。", "ふたつの しんごうを みぎへ まがると、えきが あります。"],
      },
      {
        arti: "Ketika menyeberang jalan, (saya) berhati-hati terhadap mobil.",
        benar: "みちを わたる とき、くるまに きを つけます。",
        salah: ["みちに わたる とき、くるまに きを つけます。", "みちを わたる とき、くるまを きを つけます。", "みちを わたります とき、くるまに きを つけます。"],
      },
      {
        arti: "Kalau tuas ini ditarik, air keluar.",
        benar: "この レバーを ひくと、みずが でます。",
        salah: ["この レバーを ひくと、みずを でます。", "この レバーを ひいて と、みずが でます。", "この レバーを ひくの と、みずが でます。"],
      },
    ],
  },
  24: {
    susun: [
      { arti: "Sdr. Sato memberi saya kartu Natal.", potongan: ["さとうさん", "は", "わたし", "に", "クリスマスカード", "を", "くれました"], alt: ["さとうさんはクリスマスカードをわたしにくれました"] },
      { arti: "Saya meminjamkan buku kepada Sdr. Kimura.", potongan: ["わたし", "は", "きむらさん", "に", "ほん", "を", "かして", "あげました"], alt: ["わたしはほんをきむらさんにかしてあげました"] },
      { arti: "Saya diberi tahu nomor telepon perpustakaan oleh Sdr. Yamada.", potongan: ["わたし", "は", "やまださん", "に", "としょかん", "の", "でんわばんごう", "を", "おしえて", "もらいました"] },
      { arti: "Ibu mengirimkan sweter (untuk saya).", potongan: ["はは", "は", "セーター", "を", "おくって", "くれました"] },
      { arti: "Siapa yang akan pergi membantu?", potongan: ["だれ", "が", "てつだい", "に", "いきます", "か"] },
      { arti: "Saya dibantu pindah rumah oleh Sdri. Maria.", potongan: ["わたし", "は", "マリアさん", "に", "ひっこし", "を", "てつだって", "もらいました"] },
      { arti: "Sdr. Tanaka mengantar (saya) sampai stasiun dengan mobil.", potongan: ["たなかさん", "が", "えき", "まで", "くるま", "で", "おくって", "くれました"], alt: ["たなかさんがくるまでえきまでおくってくれました"] },
      { arti: "Orang kantor memandu (saya keliling) Kyoto.", potongan: ["かいしゃ", "の", "ひと", "が", "きょうと", "を", "あんないして", "くれました"] },
      { arti: "Karangan saya diperbaiki oleh guru.", potongan: ["わたし", "は", "せんせい", "に", "さくぶん", "を", "なおして", "もらいました"] },
      { arti: "Saya membawa anak ke taman.", potongan: ["わたし", "は", "こども", "を", "こうえん", "へ", "つれて", "いきました"], alt: ["わたしはこうえんへこどもをつれていきました"] },
      { arti: "Sdr. Yamada memberi saya kue (makanan ringan) dari Hokkaido.", potongan: ["やまださん", "は", "わたし", "に", "ほっかいどう", "の", "おかし", "を", "くれました"], alt: ["やまださんはほっかいどうのおかしをわたしにくれました"] },
      { arti: "Saya menjelaskan cara memakai komputer kepada nenek.", potongan: ["わたし", "は", "おばあさん", "に", "パソコン", "の", "つかいかた", "を", "せつめいして", "あげました"] },
    ],
    pilih: [
      {
        arti: "Sdr. Sato memberi saya kartu Natal.",
        benar: "さとうさんは わたしに クリスマスカードを くれました。",
        salah: ["さとうさんは わたしに クリスマスカードを あげました。", "さとうさんは わたしを クリスマスカードを くれました。", "さとうさんは わたしに クリスマスカードを もらいました。"],
      },
      {
        arti: "Saya meminjamkan buku kepada Sdr. Kimura.",
        benar: "わたしは きむらさんに ほんを かして あげました。",
        salah: ["わたしは きむらさんに ほんを かして くれました。", "わたしは きむらさんに ほんを かりて あげました。", "わたしは きむらさんを ほんを かして あげました。"],
      },
      {
        arti: "Saya diberi tahu nomor telepon perpustakaan oleh Sdr. Yamada.",
        benar: "わたしは やまださんに としょかんの でんわばんごうを おしえて もらいました。",
        salah: ["わたしは やまださんに としょかんの でんわばんごうを おしえて くれました。", "わたしは やまださんに としょかんの でんわばんごうを おしえて あげました。", "わたしは やまださんを としょかんの でんわばんごうを おしえて もらいました。"],
      },
      {
        arti: "Ibu mengirimkan sweter (untuk saya).",
        benar: "ははは セーターを おくって くれました。",
        salah: ["ははは セーターを おくって もらいました。", "ははは セーターを おくって あげました。", "ははは セーターを おくて くれました。"],
      },
      {
        arti: "Siapa yang akan pergi membantu? ... Sdri. Karina yang pergi.",
        benar: "だれが てつだいに いきますか。……カリナさんが いきます。",
        salah: ["だれは てつだいに いきますか。……カリナさんが いきます。", "だれが てつだいに いきますか。……カリナさんは いきます。", "だれが てつだいを いきますか。……カリナさんが いきます。"],
      },
      {
        arti: "Saya dibantu pindah rumah oleh Sdri. Maria.",
        benar: "わたしは マリアさんに ひっこしを てつだって もらいました。",
        salah: ["わたしは マリアさんに ひっこしを てつだって くれました。", "わたしは マリアさんが ひっこしを てつだって もらいました。", "わたしは マリアさんに ひっこしを てつだいて もらいました。"],
      },
      {
        arti: "Sdr. Tanaka mengantar (saya) sampai stasiun dengan mobil.",
        benar: "たなかさんが えきまで くるまで おくって くれました。",
        salah: ["たなかさんが えきまで くるまで おくって もらいました。", "たなかさんが えきまで くるまで おくって あげました。", "たなかさんに えきまで くるまで おくって くれました。"],
      },
      {
        arti: "Karangan saya diperbaiki oleh guru.",
        benar: "わたしは せんせいに さくぶんを なおして もらいました。",
        salah: ["わたしは せんせいに さくぶんを なおして くれました。", "わたしは せんせいに さくぶんを なおって もらいました。", "わたしは せんせいで さくぶんを なおして もらいました。"],
      },
      {
        arti: "Sdr. Yamada memberi saya kue (makanan ringan) dari Hokkaido.",
        benar: "やまださんは わたしに ほっかいどうの おかしを くれました。",
        salah: ["やまださんは わたしに ほっかいどうの おかしを もらいました。", "やまださんは わたしから ほっかいどうの おかしを くれました。", "やまださんは わたしに ほっかいどうの おかしを くれて あげました。"],
      },
      {
        arti: "Saya mendapat oleh-oleh dari Sdr. Miller.",
        benar: "わたしは ミラーさんに おみやげを もらいました。",
        salah: ["わたしは ミラーさんに おみやげを くれました。", "わたしは ミラーさんを おみやげを もらいました。", "わたしは ミラーさんで おみやげを もらいました。"],
      },
      {
        arti: "Saya menjelaskan cara memakai komputer kepada nenek.",
        benar: "わたしは おばあさんに パソコンの つかいかたを せつめいして あげました。",
        salah: ["わたしは おばあさんに パソコンの つかいかたを せつめいして くれました。", "わたしは おばあさんに パソコンの つかいかたを せつめいして もらいました。", "わたしは おばあさんを パソコンの つかいかたを せつめいして あげました。"],
      },
      {
        arti: "Saya membawa anak ke taman.",
        benar: "わたしは こどもを こうえんへ つれて いきました。",
        salah: ["わたしは こどもに こうえんへ つれて いきました。", "わたしは こどもを こうえんへ つれる いきました。", "わたしは こどもを こうえんへ もって いきました。"],
      },
    ],
  },
  25: {
    susun: [
      { arti: "Kalau hujan, (saya) tidak akan keluar.", potongan: ["あめ", "が", "ふったら", "でかけません"] },
      { arti: "Kalau sudah sampai di stasiun, tolong telepon (saya).", potongan: ["えき", "に", "ついたら", "でんわして", "ください"] },
      { arti: "Kalau ada 100 juta yen, (saya) ingin bepergian ke berbagai negara.", potongan: ["もし", "いちおくえん", "あったら", "いろいろな", "くに", "を", "りょこうしたい", "です"] },
      { arti: "Kalau murah, (saya) ingin membeli komputer.", potongan: ["やすかったら", "パソコン", "を", "かいたい", "です"] },
      { arti: "Kalau senggang, tolong bantu (saya).", potongan: ["ひまだったら", "てつだって", "ください"] },
      { arti: "Kalau cuacanya bagus, mari jalan-jalan.", potongan: ["いい", "てんき", "だったら", "さんぽしましょう"] },
      { arti: "Kalau sudah jam 10, mari kita berangkat.", potongan: ["じゅうじ", "に", "なったら", "でかけましょう"] },
      { arti: "Walaupun dipikirkan berapa kali pun, (saya) tidak mengerti.", potongan: ["いくら", "かんがえても", "わかりません"] },
      { arti: "Walaupun hujan, (saya) tetap mencuci pakaian.", potongan: ["あめ", "が", "ふっても", "せんたくします"] },
      { arti: "Walaupun murah, saya tidak suka perjalanan rombongan.", potongan: ["やすくても", "わたし", "は", "グループりょこう", "が", "きらい", "です"] },
      { arti: "Walaupun hari Minggu, (saya) tetap bekerja.", potongan: ["にちようび", "でも", "はたらきます"] },
      { arti: "Kalau tidak mengerti artinya, tolong tanyakan kepada guru.", potongan: ["いみ", "が", "わからなかったら", "せんせい", "に", "きいて", "ください"] },
    ],
    pilih: [
      {
        arti: "Kalau hujan, (saya) tidak akan keluar.",
        benar: "あめが ふったら、でかけません。",
        salah: ["あめが ふるたら、でかけません。", "あめが ふりたら、でかけません。", "あめが ふっても、でかけません。"],
      },
      {
        arti: "Kalau murah, (saya) ingin membeli komputer.",
        benar: "やすかったら、パソコンを かいたいです。",
        salah: ["やすいだったら、パソコンを かいたいです。", "やすいたら、パソコンを かいたいです。", "やすくても、パソコンを かいたいです。"],
      },
      {
        arti: "Kalau senggang, tolong bantu (saya).",
        benar: "ひまだったら、てつだって ください。",
        salah: ["ひまかったら、てつだって ください。", "ひまなたら、てつだって ください。", "ひまでも、てつだって ください。"],
      },
      {
        arti: "Kalau cuacanya bagus, mari jalan-jalan.",
        benar: "いい てんきだったら、さんぽしましょう。",
        salah: ["いい てんきかったら、さんぽしましょう。", "いい てんきたら、さんぽしましょう。", "いい てんきでも、さんぽしましょう。"],
      },
      {
        arti: "Kalau sudah sampai di stasiun, tolong telepon (saya).",
        benar: "えきに ついたら、でんわして ください。",
        salah: ["えきに つきたら、でんわして ください。", "えきに ついても、でんわして ください。", "えきを ついたら、でんわして ください。"],
      },
      {
        arti: "Kalau ada 100 juta yen, (saya) ingin bepergian ke berbagai negara.",
        benar: "もし 1おくえん あったら、いろいろな くにを りょこうしたいです。",
        salah: ["もし 1おくえん あるたら、いろいろな くにを りょこうしたいです。", "もし 1おくえん あっても、いろいろな くにを りょこうしたいです。", "もし 1おくえん ありたら、いろいろな くにを りょこうしたいです。"],
      },
      {
        arti: "Walaupun dipikirkan berapa kali pun, (saya) tidak mengerti.",
        benar: "いくら かんがえても、わかりません。",
        salah: ["いくら かんがえたら、わかりません。", "いくら かんがえっても、わかりません。", "いくら かんがえるても、わかりません。"],
      },
      {
        arti: "Walaupun hujan, (saya) tetap mencuci pakaian.",
        benar: "あめが ふっても、せんたくします。",
        salah: ["あめが ふりても、せんたくします。", "あめが ふるでも、せんたくします。", "あめが ふったら、せんたくします。"],
      },
      {
        arti: "Walaupun murah, saya tidak suka perjalanan rombongan.",
        benar: "やすくても、わたしは グループりょこうが きらいです。",
        salah: ["やすいても、わたしは グループりょこうが きらいです。", "やすいでも、わたしは グループりょこうが きらいです。", "やすかったら、わたしは グループりょこうが きらいです。"],
      },
      {
        arti: "Walaupun sepi (tenang), (saya) tidak bisa tidur.",
        benar: "しずかでも、ねむれません。",
        salah: ["しずかくても、ねむれません。", "しずかなでも、ねむれません。", "しずかだったら、ねむれません。"],
      },
      {
        arti: "Walaupun hari Minggu, (saya) tetap bekerja.",
        benar: "にちようびでも、はたらきます。",
        salah: ["にちようびても、はたらきます。", "にちようびくても、はたらきます。", "にちようびだったら、はたらきます。"],
      },
      {
        arti: "Selama ini (Anda) sudah banyak membantu (saya). Terima kasih.",
        benar: "いろいろ おせわに なりました。",
        salah: ["いろいろ おせわを なりました。", "いろいろ おせわに しました。", "どうぞ おげんきで。"],
      },
    ],
  },
  26: {
    susun: [
      { arti: "Kemarin kenapa (Anda) libur?", potongan: ["きのう", "どうして", "やすんだ", "んです", "か"], alt: ["どうしてきのうやすんだんですか"] },
      { arti: "(Saya) tidak enak badan.", potongan: ["きぶん", "が", "わるい", "んです"] },
      { arti: "Kenapa kemarin (Anda) terlambat? ... Karena busnya tidak datang.", potongan: ["バス", "が", "こなかった", "んです"] },
      { arti: "(Saya) sudah menulis surat dalam bahasa Jepang, bisakah (Anda) melihatnya sebentar?", potongan: ["にほんご", "で", "てがみ", "を", "かいた", "んです", "が", "ちょっと", "みて", "いただけません", "か"] },
      { arti: "(Saya) ingin mengunjungi perusahaan surat kabar, sebaiknya bagaimana?", potongan: ["しんぶんしゃ", "を", "けんがくしたい", "んです", "が", "どう", "したら", "いい", "です", "か"] },
      { arti: "Sampah sebaiknya dibuang di mana?", potongan: ["ごみ", "は", "どこ", "に", "だしたら", "いい", "です", "か"] },
      { arti: "(Saya) ingin ikut pesta, sebaiknya mendaftar kepada siapa?", potongan: ["パーティー", "に", "さんかしたい", "んです", "が", "だれ", "に", "もうしこんだら", "いい", "です", "か"] },
      { arti: "Baju ini dibeli di mana?", potongan: ["この", "ふく", "は", "どこ", "で", "かった", "んです", "か"] },
      { arti: "Kalau ada kesulitan, silakan hubungi (saya) kapan saja.", potongan: ["こまった", "こと", "が", "あったら", "いつでも", "れんらくして", "ください"] },
      { arti: "Siapa pun bisa ikut serta sebagai sukarelawan.", potongan: ["だれでも", "ボランティア", "に", "さんかする", "こと", "が", "できます"] },
      { arti: "(Saya) tidak sempat tepat waktu.", potongan: ["じかん", "に", "まにあわなかった", "んです"] },
      { arti: "Logat Osaka ya. Pernah tinggal di Osaka?", potongan: ["おおさか", "に", "すんで", "いた", "んです", "か"] },
    ],
    pilih: [
      {
        arti: "Ada apa? ... (Saya) tidak enak badan.",
        benar: "どうしたんですか。……きぶんが わるいんです。",
        salah: ["どうしたんですか。……きぶんが わるいなんです。", "どうしたんですか。……きぶんが わるかったなんです。", "どうするんですか。……きぶんが わるいんです。"],
      },
      {
        arti: "Kenapa (Anda) terlambat? ... Karena busnya tidak datang.",
        benar: "どうして おくれたんですか。……バスが こなかったんです。",
        salah: ["どうして おくれたんですか。……バスが こないかったんです。", "どうして おくれたんですか。……バスが きなかったんです。", "どうして おくれたんですか。……バスを こなかったんです。"],
      },
      {
        arti: "Tenang sekali ya. ... Ya, di sini (memang) tenang.",
        benar: "しずかですね。……ええ、ここは しずかなんです。",
        salah: ["しずかですね。……ええ、ここは しずかんです。", "しずかですね。……ええ、ここは しずかだんです。", "しずかですね。……ええ、ここは しずかいんです。"],
      },
      {
        arti: "Apakah (Anda) mahasiswa? ... Ya, saya mahasiswa.",
        benar: "がくせいなんですか。……ええ、がくせいなんです。",
        salah: ["がくせいなんですか。……ええ、がくせいだんです。", "がくせいなんですか。……ええ、がくせいんです。", "がくせいなんですか。……ええ、がくせいのんです。"],
      },
      {
        arti: "(Saya) sudah menulis surat dalam bahasa Jepang, bisakah (Anda) melihatnya sebentar?",
        benar: "にほんごで てがみを かいたんですが、ちょっと みて いただけませんか。",
        salah: ["にほんごで てがみを かいたんですが、ちょっと みて いただきませんか。", "にほんごで てがみを かいたんですが、ちょっと みって いただけませんか。", "にほんごで てがみを かいたなんですが、ちょっと みて いただけませんか。"],
      },
      {
        arti: "Sampah sebaiknya dibuang di mana?",
        benar: "ごみは どこに だしたら いいですか。",
        salah: ["ごみは どこに だすたら いいですか。", "ごみは どこに だしたら いいんでしたか。", "ごみは どこを だしたら いいですか。"],
      },
      {
        arti: "(Saya) ingin ikut pesta, sebaiknya mendaftar kepada siapa?",
        benar: "パーティーに さんかしたいんですが、だれに もうしこんだら いいですか。",
        salah: ["パーティーに さんかしたいんですが、だれに もうしこみたら いいですか。", "パーティーを さんかしたいんですが、だれに もうしこんだら いいですか。", "パーティーに さんかしたいですんが、だれに もうしこんだら いいですか。"],
      },
      {
        arti: "Baju ini bagus ya. Dibeli di mana?",
        benar: "この ふく、すてきですね。どこで かったんですか。",
        salah: ["この ふく、すてきですね。どこで かうんでしたか。", "この ふく、すてきですね。どこで かいたんですか。", "この ふく、すてきですね。どこに かったんですか。"],
      },
      {
        arti: "(Saya) ingin mengunjungi perusahaan surat kabar, sebaiknya bagaimana?",
        benar: "しんぶんしゃを けんがくしたいんですが、どう したら いいですか。",
        salah: ["しんぶんしゃを けんがくしたいんですが、どう しても いいですか。", "しんぶんしゃを けんがくしたいんですが、どう するたら いいですか。", "しんぶんしゃを けんがくしたいなんですが、どう したら いいですか。"],
      },
      {
        arti: "Sampah yang dapat dibakar dibuang hari Senin, Rabu, dan Jumat.",
        benar: "もえる ごみは げつ・すい・きんに だします。",
        salah: ["もえない ごみは げつ・すい・きんに だします。", "もえる ごみは げつ・すい・きんを だします。", "もえる ごみは げつ・すい・きんで だします。"],
      },
      {
        arti: "Kalau ada kesulitan, silakan hubungi (saya) kapan saja.",
        benar: "こまった ことが あったら、いつでも れんらくして ください。",
        salah: ["こまった ことが あったら、いつも れんらくして ください。", "こまった ことが あったら、いつでも れんらくして もらいます。", "こまった ことが あったら、だれでも れんらくして ください。"],
      },
      {
        arti: "(Saya) tidak sempat tepat waktu.",
        benar: "じかんに まにあわなかったんです。",
        salah: ["じかんを まにあわなかったんです。", "じかんに まにあいなかったんです。", "じかんに まにあわないかったんです。"],
      },
    ],
  },
  27: {
    susun: [
      { arti: "Saya bisa berbicara bahasa Jepang sedikit.", potongan: ["わたし", "は", "にほんご", "が", "すこし", "はなせます"] },
      { arti: "Apakah (Anda) bisa membaca katakana?", potongan: ["かたかな", "が", "よめます", "か"] },
      { arti: "Dari atas gunung laut kelihatan.", potongan: ["やま", "の", "うえ", "から", "うみ", "が", "みえます"] },
      { arti: "Suara radio kedengaran.", potongan: ["ラジオ", "の", "おと", "が", "きこえます"] },
      { arti: "Di depan stasiun sudah jadi sebuah supermarket besar.", potongan: ["えき", "の", "まえ", "に", "おおきい", "スーパー", "が", "できました"] },
      { arti: "(Saya) hanya bisa menulis hiragana.", potongan: ["ひらがな", "しか", "かけません"] },
      { arti: "Di apartemen ini tidak boleh (tidak bisa) memelihara binatang.", potongan: ["この", "マンション", "で", "は", "ペット", "が", "かえません"] },
      { arti: "Suatu saat (saya) ingin membangun rumah sendiri.", potongan: ["いつか", "じぶん", "の", "いえ", "を", "たてたい", "です"] },
      { arti: "Apakah besok (Anda) bisa datang?", potongan: ["あした", "こられます", "か"] },
      { arti: "Kemarin (saya) hanya tidur 3 jam.", potongan: ["きのう", "さんじかん", "しか", "ねません", "でした"] },
      { arti: "Di mana (saya) bisa membeli tiket konser?", potongan: ["どこ", "で", "コンサート", "の", "チケット", "が", "かえます", "か"] },
      { arti: "Di sini (saya) bisa melihat kembang api dengan jelas.", potongan: ["ここ", "から", "はなび", "が", "はっきり", "みえます"] },
    ],
    pilih: [
      {
        arti: "Saya bisa berbicara bahasa Jepang sedikit.",
        benar: "わたしは にほんごが すこし はなせます。",
        salah: ["わたしは にほんごが すこし はなされます。", "わたしは にほんごが すこし はなしれます。", "わたしは にほんごが すこし はなすます。"],
      },
      {
        arti: "Apakah (Anda) bisa membaca katakana?",
        benar: "かたかなが よめますか。",
        salah: ["かたかなが よまれますか。", "かたかなが よみれますか。", "かたかなが よむれますか。"],
      },
      {
        arti: "Apakah besok (Anda) bisa datang?",
        benar: "あした こられますか。",
        salah: ["あした きられますか。", "あした くられますか。", "あした きますれますか。"],
      },
      {
        arti: "Saya bisa makan sashimi.",
        benar: "わたしは さしみが たべられます。",
        salah: ["わたしは さしみが たべます られます。", "わたしは さしみが たべせます。", "わたしは さしみが たべえます。"],
      },
      {
        arti: "Dari atas gunung laut kelihatan.",
        benar: "やまの うえから うみが みえます。",
        salah: ["やまの うえから うみが みえられます。", "やまの うえから うみを みえます。", "やまの うえから うみが みえれます。"],
      },
      {
        arti: "Suara radio kedengaran.",
        benar: "ラジオの おとが きこえます。",
        salah: ["ラジオの おとが きこえられます。", "ラジオの おとを きこえます。", "ラジオの おとが きけえます。"],
      },
      {
        arti: "(Saya) hanya bisa menulis hiragana.",
        benar: "ひらがなしか かけません。",
        salah: ["ひらがなしか かけます。", "ひらがなだけ かけません。", "ひらがなしか かきれません。"],
      },
      {
        arti: "Kemarin (saya) hanya tidur 3 jam.",
        benar: "きのう 3じかんしか ねませんでした。",
        salah: ["きのう 3じかんしか ねました。", "きのう 3じかんだけ ねませんでした。", "きのう 3じかんしか ねなかったでした。"],
      },
      {
        arti: "Di depan stasiun sudah jadi sebuah supermarket besar.",
        benar: "えきの まえに おおきい スーパーが できました。",
        salah: ["えきの まえに おおきい スーパーを できました。", "えきの まえに おおきい スーパーが できられました。", "えきの まえで おおきい スーパーが できました。"],
      },
      {
        arti: "Di apartemen ini tidak bisa memelihara binatang.",
        benar: "この マンションでは ペットが かえません。",
        salah: ["この マンションでは ペットが かいえません。", "この マンションでは ペットが かわれません。", "この マンションでは ペットが かいれません。"],
      },
      {
        arti: "Bahasa Inggris bisa, tetapi bahasa Prancis tidak bisa.",
        benar: "えいごは はなせますが、フランスごは はなせません。",
        salah: ["えいごは はなせますが、フランスごは はなしません。", "えいごは はなせますが、フランスごも はなせません。", "えいごは はなしますが、フランスごは はなせません。"],
      },
      {
        arti: "Hari Minggu (saya) bisa mengambil libur.",
        benar: "にちようびは やすみが とれます。",
        salah: ["にちようびは やすみが とられます。", "にちようびは やすみが とりれます。", "にちようびは やすみを とるます。"],
      },
    ],
  },
  28: {
    susun: [
      { arti: "(Saya) makan sambil mendengarkan musik.", potongan: ["おんがく", "を", "ききながら", "しょくじします"] },
      { arti: "(Saya) belajar bahasa Jepang sambil bekerja.", potongan: ["はたらきながら", "にほんご", "を", "べんきょうして", "います"] },
      { arti: "Setiap pagi (saya) jogging.", potongan: ["まいあさ", "ジョギング", "を", "して", "います"] },
      { arti: "Waktu kecil, setiap malam (saya) tidur jam 8.", potongan: ["こども", "の", "とき", "まいばん", "はちじ", "に", "ねて", "いました"] },
      { arti: "Toko ini harganya murah, rasanya juga enak.", potongan: ["この", "みせ", "は", "ねだん", "も", "やすい", "し", "あじ", "も", "いい", "です"] },
      { arti: "Sdr. Miller rajin, tekun, dan lagi berpengalaman.", potongan: ["ミラーさん", "は", "まじめだ", "し", "ねっしんだ", "し", "それに", "けいけん", "も", "あります"] },
      { arti: "Jangan menyetir sambil makan permen karet.", potongan: ["ガム", "を", "かみながら", "うんてんしないで", "ください"] },
      { arti: "Anak saya kuliah di universitas Tokyo.", potongan: ["むすこ", "は", "とうきょう", "の", "だいがく", "に", "かよって", "います"] },
      { arti: "Hari ini hujan, dan juga (saya) tidak punya uang, jadi (saya) tidak keluar.", potongan: ["きょう", "は", "あめ", "だ", "し", "おかね", "も", "ない", "し", "でかけません"] },
      { arti: "Biasanya (saya) pergi ke kantor dengan bus.", potongan: ["たいてい", "バス", "で", "かいしゃ", "へ", "いきます"], alt: ["たいていかいしゃへバスでいきます"] },
      { arti: "Acara ini populer di kalangan anak muda.", potongan: ["この", "ばんぐみ", "は", "わかい", "ひと", "に", "にんき", "が", "あります"] },
      { arti: "Sambil menulis catatan, (saya) mendengarkan penjelasan guru.", potongan: ["メモしながら", "せんせい", "の", "せつめい", "を", "ききます"] },
    ],
    pilih: [
      {
        arti: "(Saya) makan sambil mendengarkan musik.",
        benar: "おんがくを ききながら しょくじします。",
        salah: ["おんがくを きくながら しょくじします。", "おんがくを きいてながら しょくじします。", "おんがくを ききますながら しょくじします。"],
      },
      {
        arti: "(Saya) belajar bahasa Jepang sambil bekerja.",
        benar: "はたらきながら にほんごを べんきょうして います。",
        salah: ["はたらくながら にほんごを べんきょうして います。", "はたらいてながら にほんごを べんきょうして います。", "はたらきながら にほんごに べんきょうして います。"],
      },
      {
        arti: "Setiap pagi (saya) jogging.",
        benar: "まいあさ ジョギングを して います。",
        salah: ["まいあさ ジョギングを します います。", "まいあさ ジョギングが して います。", "まいあさ ジョギングを しながら います。"],
      },
      {
        arti: "Toko ini harganya murah, rasanya juga enak.",
        benar: "この みせは ねだんも やすいし、あじも いいです。",
        salah: ["この みせは ねだんも やすいだし、あじも いいです。", "この みせは ねだんも やすくし、あじも いいです。", "この みせは ねだんも やすいし、あじも わるいです。"],
      },
      {
        arti: "Sdr. Miller rajin, tekun, dan lagi berpengalaman.",
        benar: "ミラーさんは まじめだし、ねっしんだし、それに けいけんも あります。",
        salah: ["ミラーさんは まじめし、ねっしんし、それに けいけんも あります。", "ミラーさんは まじめなし、ねっしんなし、それに けいけんも あります。", "ミラーさんは まじめだし、ねっしんだし、それで けいけんが ありません。"],
      },
      {
        arti: "Hari ini hujan, dan juga (saya) tidak punya uang, jadi (saya) tidak keluar.",
        benar: "きょうは あめだし、おかねも ないし、でかけません。",
        salah: ["きょうは あめし、おかねも ないし、でかけません。", "きょうは あめだし、おかねも なくし、でかけません。", "きょうは あめなし、おかねも ないし、でかけません。"],
      },
      {
        arti: "Waktu kecil, setiap malam (saya) tidur jam 8.",
        benar: "こどもの とき、まいばん 8じに ねて いました。",
        salah: ["こどもの とき、まいばん 8じに ねて います。", "こどもの とき、まいばん 8じを ねて いました。", "こどもの とき、まいばん 8じに ねながら いました。"],
      },
      {
        arti: "Jangan menyetir sambil makan permen karet.",
        benar: "ガムを かみながら うんてんしないで ください。",
        salah: ["ガムを かむながら うんてんしないで ください。", "ガムを かんでながら うんてんしないで ください。", "ガムを かみながら うんてんしなくて ください。"],
      },
      {
        arti: "Anak saya kuliah di universitas Tokyo.",
        benar: "むすこは とうきょうの だいがくに かよって います。",
        salah: ["むすこは とうきょうの だいがくを かよって います。", "むすこは とうきょうの だいがくに かよいて います。", "むすこさんは とうきょうの だいがくに かよって います。"],
      },
      {
        arti: "Kenapa (Anda) memilih universitas ini? ... Karena ayah lulus dari sini, dan gurunya juga banyak yang bagus.",
        benar: "どうして この だいがくを えらんだんですか。……ちちが でた だいがくだし、いい せんせいも おおいし……。",
        salah: ["どうして この だいがくを えらんだんですか。……ちちが でた だいがくし、いい せんせいも おおいし……。", "どうして この だいがくを えらんだんですか。……ちちが でた だいがくだし、いい せんせいも おおいだし……。", "どうして この だいがくを えらびたんですか。……ちちが でた だいがくだし、いい せんせいも おおいし……。"],
      },
      {
        arti: "Acara ini populer di kalangan anak muda.",
        benar: "この ばんぐみは わかい ひとに にんきが あります。",
        salah: ["この ばんぐみは わかい ひとを にんきが あります。", "この ばんぐみは わかい ひとに にんきを あります。", "この ばんぐみは わかい ひとに にんきが います。"],
      },
      {
        arti: "Ada sedikit permintaan.",
        benar: "ちょっと おねがいが あるんですが。",
        salah: ["ちょっと おねがいを あるんですが。", "ちょっと おねがいが いるんですが。", "ちょっと おねがいが あるなんですが。"],
      },
    ],
  },
  29: {
    susun: [
      { arti: "Jendelanya tertutup.", potongan: ["まど", "が", "しまって", "います"] },
      { arti: "Lampunya menyala.", potongan: ["でんき", "が", "ついて", "います"] },
      { arti: "Kursi ini rusak.", potongan: ["この", "いす", "は", "こわれて", "います"] },
      { arti: "Jalan ini selalu macet.", potongan: ["この", "みち", "は", "いつも", "こんで", "います"] },
      { arti: "Gelasnya pecah.", potongan: ["コップ", "が", "われて", "います"] },
      { arti: "Pintunya terkunci.", potongan: ["ドア", "に", "かぎ", "が", "かかって", "います"] },
      { arti: "PR kemarin sudah selesai (saya) kerjakan.", potongan: ["きのう", "の", "しゅくだい", "は", "もう", "やって", "しまいました"] },
      { arti: "(Saya) ketinggalan payung di kereta.", potongan: ["でんしゃ", "に", "かさ", "を", "わすれて", "しまいました"], alt: ["かさをでんしゃにわすれてしまいました"] },
      { arti: "(Saya) kehilangan paspor.", potongan: ["パスポート", "を", "なくして", "しまいました"] },
      { arti: "Kantongnya sobek.", potongan: ["ふくろ", "が", "やぶれて", "います"] },
      { arti: "Kalau tidak salah, ada kantor pos di sekitar sini.", potongan: ["たしか", "このへん", "に", "ゆうびんきょく", "が", "あります"] },
      { arti: "Karena gempa bumi, pohonnya roboh.", potongan: ["じしん", "で", "き", "が", "たおれて", "います"] },
    ],
    pilih: [
      {
        arti: "Jendelanya tertutup.",
        benar: "まどが しまって います。",
        salah: ["まどを しまって います。", "まどが しめて います。", "まどが しまりて います。"],
      },
      {
        arti: "Lampunya menyala.",
        benar: "でんきが ついて います。",
        salah: ["でんきが つけて います。", "でんきを ついて います。", "でんきが つきて います。"],
      },
      {
        arti: "Gelasnya pecah.",
        benar: "コップが われて います。",
        salah: ["コップが わって います。", "コップを われて います。", "コップが われりて います。"],
      },
      {
        arti: "Pintunya terkunci.",
        benar: "ドアに かぎが かかって います。",
        salah: ["ドアに かぎが かけて います。", "ドアに かぎを かかって います。", "ドアで かぎが かかって います。"],
      },
      {
        arti: "Jalan ini selalu macet.",
        benar: "この みちは いつも こんで います。",
        salah: ["この みちは いつも こみて います。", "この みちは いつも すいて います。", "この みちは いつも こんで しまいました。"],
      },
      {
        arti: "Mobilnya berhenti di depan stasiun.",
        benar: "えきまえに くるまが とまって います。",
        salah: ["えきまえに くるまが とめて います。", "えきまえに くるまを とまって います。", "えきまえを くるまが とまって います。"],
      },
      {
        arti: "PR kemarin sudah selesai (saya) kerjakan.",
        benar: "きのうの しゅくだいは もう やって しまいました。",
        salah: ["きのうの しゅくだいは もう やり しまいました。", "きのうの しゅくだいは もう やって しまいます。", "きのうの しゅくだいは もう やるて しまいました。"],
      },
      {
        arti: "(Saya) ketinggalan payung di kereta.",
        benar: "でんしゃに かさを わすれて しまいました。",
        salah: ["でんしゃに かさを わすれて しまいます。", "でんしゃに かさが わすれて しまいました。", "でんしゃに かさを わすれって しまいました。"],
      },
      {
        arti: "(Saya) kehilangan paspor.",
        benar: "パスポートを なくして しまいました。",
        salah: ["パスポートが なくして しまいました。", "パスポートを なくって しまいました。", "パスポートを なくしで しまいました。"],
      },
      {
        arti: "Bajunya kotor.",
        benar: "ふくが よごれて います。",
        salah: ["ふくを よごれて います。", "ふくが よごして います。", "ふくが よごれりて います。"],
      },
      {
        arti: "Silakan duluan.",
        benar: "おさきに どうぞ。",
        salah: ["おさきで どうぞ。", "おさきを どうぞ。", "おさきが どうぞ。"],
      },
      {
        arti: "(Saya) ketinggalan barang. ... Barang apa? ... Tas biru kira-kira sebesar ini.",
        benar: "わすれものを して しまったんですが。……なにを わすれたんですか。……あおい かばんです。このくらいの……。",
        salah: ["わすれものを して しまったんですが。……なにを わすれたんですか。……あおい かばんです。このくらいな……。", "わすれものを して しまいましたんですが。……なにを わすれたんですか。……あおい かばんです。このくらいの……。", "わすれものを して しまうんですが。……なにを わすれたんですか。……あおい かばんです。このくらいの……。"],
      },
    ],
  },
  30: {
    susun: [
      { arti: "Di pos polisi tertempel peta kota.", potongan: ["こうばん", "に", "まち", "の", "ちず", "が", "はって", "あります"] },
      { arti: "Di kalender tertulis rencana.", potongan: ["カレンダー", "に", "よてい", "が", "かいて", "あります"] },
      { arti: "Di dinding tergantung lukisan.", potongan: ["かべ", "に", "え", "が", "かけて", "あります"] },
      { arti: "Di atas meja (sudah) dihias bunga.", potongan: ["つくえ", "の", "うえ", "に", "はな", "が", "かざって", "あります"] },
      { arti: "Di halaman (sudah) ditanam pohon.", potongan: ["にわ", "に", "き", "が", "うえて", "あります"] },
      { arti: "Sebelum bepergian, (saya) membeli tiket terlebih dahulu.", potongan: ["りょこう", "の", "まえ", "に", "きっぷ", "を", "かって", "おきます"] },
      { arti: "Sebelum pelajaran, (saya) mempersiapkan pelajaran terlebih dahulu.", potongan: ["じゅぎょう", "の", "まえ", "に", "よしゅうして", "おきます"] },
      { arti: "Setelah memakai gunting, tolong kembalikan ke tempat semula.", potongan: ["はさみ", "を", "つかったら", "もとのところ", "に", "もどして", "おいて", "ください"] },
      { arti: "Boleh saya bereskan kursinya? ... Tolong biarkan saja.", potongan: ["そのまま", "に", "して", "おいて", "ください"] },
      { arti: "Masih hujan.", potongan: ["まだ", "あめ", "が", "ふって", "います"] },
      { arti: "Sampai rapat, tolong susun materinya terlebih dahulu.", potongan: ["かいぎ", "までに", "しりょう", "を", "まとめて", "おいて", "ください"] },
      { arti: "Di sudut kamar ada tempat sampah.", potongan: ["へや", "の", "すみ", "に", "ごみばこ", "が", "おいて", "あります"] },
    ],
    pilih: [
      {
        arti: "Di pos polisi tertempel peta kota.",
        benar: "こうばんに まちの ちずが はって あります。",
        salah: ["こうばんに まちの ちずを はって あります。", "こうばんに まちの ちずが はって います。", "こうばんに まちの ちずが はりて あります。"],
      },
      {
        arti: "Di kalender tertulis rencana.",
        benar: "カレンダーに よていが かいて あります。",
        salah: ["カレンダーに よていが かいて います。", "カレンダーに よていを かいて あります。", "カレンダーで よていが かいて あります。"],
      },
      {
        arti: "Jendelanya (sengaja) dibuka.",
        benar: "まどが あけて あります。",
        salah: ["まどが あけて います。", "まどを あけて あります。", "まどが あいて あります。"],
      },
      {
        arti: "Di dinding tergantung lukisan.",
        benar: "かべに えが かけて あります。",
        salah: ["かべに えが かかって あります。", "かべに えを かけて あります。", "かべに えが かけて います。"],
      },
      {
        arti: "Sebelum bepergian, (saya) membeli tiket terlebih dahulu.",
        benar: "りょこうの まえに きっぷを かって おきます。",
        salah: ["りょこうの まえに きっぷを かって あります。", "りょこうの まえに きっぷを かいて おきます。", "りょこうの まえに きっぷが かって おきます。"],
      },
      {
        arti: "Sebelum pelajaran, (saya) mempersiapkan pelajaran terlebih dahulu.",
        benar: "じゅぎょうの まえに よしゅうして おきます。",
        salah: ["じゅぎょうの まえに よしゅうして あります。", "じゅぎょうの あとで よしゅうして おきます。", "じゅぎょうの まえに よしゅうしって おきます。"],
      },
      {
        arti: "Setelah memakai gunting, tolong kembalikan ke tempat semula.",
        benar: "はさみを つかったら、もとの ところに もどして おいて ください。",
        salah: ["はさみを つかったら、もとの ところに もどして あって ください。", "はさみを つかったら、もとの ところを もどして おいて ください。", "はさみを つかったら、もとの ところに もどって おいて ください。"],
      },
      {
        arti: "Boleh saya bereskan kursinya? ... Tolong biarkan saja.",
        benar: "いすを かたづけましょうか。……そのままに して おいて ください。",
        salah: ["いすを かたづけましょうか。……そのままに して あって ください。", "いすを かたづけましょうか。……そのままを して おいて ください。", "いすを かたづけましょうか。……そのままに しって おいて ください。"],
      },
      {
        arti: "Masih hujan.",
        benar: "まだ あめが ふって います。",
        salah: ["もう あめが ふって います。", "まだ あめが ふって あります。", "まだ あめを ふって います。"],
      },
      {
        arti: "Sampai rapat, tolong susun materinya terlebih dahulu.",
        benar: "かいぎまでに しりょうを まとめて おいて ください。",
        salah: ["かいぎまで しりょうを まとめて おいて ください。", "かいぎまでに しりょうを まとめて あって ください。", "かいぎまでに しりょうが まとめて おいて ください。"],
      },
      {
        arti: "Terima kasih atas jerih payah Anda. (atasan kepada bawahan)",
        benar: "ごくろうさまです。",
        salah: ["ごちそうさまでした。", "おせわに なりました。", "おかげさまで。"],
      },
      {
        arti: "Bunga sudah dihias di dalam vas.",
        benar: "かびんに はなが かざって あります。",
        salah: ["かびんに はなが かざって います。", "かびんに はなを かざって あります。", "かびんに はなが かざりて あります。"],
      },
    ],
  },
  31: {
    susun: [
      { arti: "(Saya) berniat mendirikan perusahaan sendiri di masa depan.", potongan: ["しょうらい", "じぶん", "の", "かいしゃ", "を", "つくろう", "と", "おもって", "います"] },
      { arti: "Tahun depan (saya) berniat masuk universitas.", potongan: ["らいねん", "だいがく", "に", "にゅうがくしよう", "と", "おもって", "います"] },
      { arti: "Walaupun pulang ke negara asal, (saya) bermaksud meneruskan belajar bahasa Jepang.", potongan: ["くに", "へ", "かえっても", "にほんご", "の", "べんきょう", "を", "つづける", "つもり", "です"] },
      { arti: "Mulai besok (saya) bermaksud tidak merokok.", potongan: ["あした", "から", "たばこ", "を", "すわない", "つもり", "です"] },
      { arti: "Dinas luar kotanya direncanakan kira-kira satu minggu.", potongan: ["しゅっちょう", "は", "いっしゅうかん", "ぐらい", "の", "よてい", "です"] },
      { arti: "Akhir bulan Juli (saya) dijadwalkan dinas ke Jerman.", potongan: ["しちがつ", "の", "おわり", "に", "ドイツ", "へ", "しゅっちょうする", "よてい", "です"] },
      { arti: "(Saya) belum menentukan.", potongan: ["まだ", "きめて", "いません"] },
      { arti: "(Saya) belum menulis laporan.", potongan: ["まだ", "レポート", "を", "かいて", "いません"] },
      { arti: "Capek, jadi mari istirahat sebentar di sini. (bentuk biasa)", potongan: ["つかれた", "から", "ここ", "で", "ちょっと", "やすもう"], alt: ["つかれたからちょっとここでやすもう"] },
      { arti: "(Saya) berniat belajar ekonomi di pascasarjana.", potongan: ["だいがくいん", "で", "けいざいがく", "を", "べんきょうしよう", "と", "おもって", "います"] },
      { arti: "Upacara pernikahan dimulai jam 2.", potongan: ["けっこんしき", "は", "にじ", "から", "はじまります"] },
      { arti: "Liburan panjang ini (saya) berniat pergi ke pemandian air panas.", potongan: ["こんど", "の", "れんきゅう", "は", "おんせん", "へ", "いこう", "と", "おもって", "います"] },
    ],
    pilih: [
      {
        arti: "(Saya) berniat mendirikan perusahaan sendiri di masa depan.",
        benar: "しょうらい じぶんの かいしゃを つくろうと おもって います。",
        salah: ["しょうらい じぶんの かいしゃを つくりようと おもって います。", "しょうらい じぶんの かいしゃを つくるようと おもって います。", "しょうらい じぶんの かいしゃを つくろうを おもって います。"],
      },
      {
        arti: "Tahun depan (saya) berniat masuk universitas.",
        benar: "らいねん だいがくに にゅうがくしようと おもって います。",
        salah: ["らいねん だいがくに にゅうがくすようと おもって います。", "らいねん だいがくに にゅうがくしろうと おもって います。", "らいねん だいがくを にゅうがくしようと おもって います。"],
      },
      {
        arti: "Mari makan bersama. (bentuk biasa)",
        benar: "いっしょに たべよう。",
        salah: ["いっしょに たべろう。", "いっしょに たべおう。", "いっしょに たべるよう。"],
      },
      {
        arti: "Besok datang lagi yuk. (bentuk biasa)",
        benar: "あした また こよう。",
        salah: ["あした また きよう。", "あした また くよう。", "あした また ころう。"],
      },
      {
        arti: "Mari istirahat sebentar. (bentuk biasa)",
        benar: "ちょっと やすもう。",
        salah: ["ちょっと やすみよう。", "ちょっと やすむよう。", "ちょっと やすまう。"],
      },
      {
        arti: "Walaupun pulang ke negara asal, (saya) bermaksud meneruskan belajar bahasa Jepang.",
        benar: "くにへ かえっても、にほんごの べんきょうを つづける つもりです。",
        salah: ["くにへ かえっても、にほんごの べんきょうを つづけた つもりです。", "くにへ かえっても、にほんごの べんきょうを つづけます つもりです。", "くにへ かえっても、にほんごの べんきょうを つづけるの つもりです。"],
      },
      {
        arti: "Mulai besok (saya) bermaksud tidak merokok.",
        benar: "あしたから たばこを すわない つもりです。",
        salah: ["あしたから たばこを すいない つもりです。", "あしたから たばこを すわないの つもりです。", "あしたから たばこを すいません つもりです。"],
      },
      {
        arti: "Dinas luar kotanya direncanakan kira-kira satu minggu.",
        benar: "しゅっちょうは 1しゅうかんぐらいの よていです。",
        salah: ["しゅっちょうは 1しゅうかんぐらい よていです。", "しゅっちょうは 1しゅうかんぐらいな よていです。", "しゅっちょうは 1しゅうかんぐらいを よていです。"],
      },
      {
        arti: "Akhir bulan Juli (saya) dijadwalkan dinas ke Jerman.",
        benar: "7がつの おわりに ドイツへ しゅっちょうする よていです。",
        salah: ["7がつの おわりに ドイツへ しゅっちょうするの よていです。", "7がつの おわりに ドイツへ しゅっちょうします よていです。", "7がつの おわりに ドイツへ しゅっちょうしよう よていです。"],
      },
      {
        arti: "Laporannya sudah ditulis? ... Belum, belum (saya) tulis.",
        benar: "レポートは もう かきましたか。……いいえ、まだ かいて いません。",
        salah: ["レポートは もう かきましたか。……いいえ、まだ かきませんでした。", "レポートは もう かきましたか。……いいえ、もう かいて いません。", "レポートは もう かきましたか。……いいえ、まだ かいて います。"],
      },
      {
        arti: "Upacara pernikahan dimulai jam 2.",
        benar: "けっこんしきは 2じから はじまります。",
        salah: ["けっこんしきを 2じから はじまります。", "けっこんしきは 2じから はじめます。", "けっこんしきは 2じまで はじまります。"],
      },
      {
        arti: "(Saya) ingin menghadiri pesta.",
        benar: "パーティーに しゅっせきしたいです。",
        salah: ["パーティーを しゅっせきしたいです。", "パーティーで しゅっせきしたいです。", "パーティーに しゅっせきしようです。"],
      },
    ],
  },
  32: {
    susun: [
      { arti: "Sebaiknya berolahraga setiap hari.", potongan: ["まいにち", "うんどうした", "ほう", "が", "いい", "です"] },
      { arti: "Waktu demam, sebaiknya tidak masuk ke bak mandi.", potongan: ["ねつ", "が", "ある", "とき", "は", "おふろ", "に", "はいらない", "ほう", "が", "いい", "です"] },
      { arti: "Besok mungkin akan hujan.", potongan: ["あした", "は", "あめ", "が", "ふる", "でしょう"] },
      { arti: "Malam ini bintang mungkin kelihatan.", potongan: ["こんや", "は", "ほし", "が", "みえる", "でしょう"] },
      { arti: "Mungkin (saya) tidak sempat tepat pada waktu janji.", potongan: ["やくそく", "の", "じかん", "に", "まにあわない", "かも", "しれません"] },
      { arti: "Mungkin (saya) masuk angin.", potongan: ["かぜ", "を", "ひいた", "かも", "しれません"] },
      { arti: "Sebaiknya jangan memaksakan diri.", potongan: ["むり", "を", "しない", "ほう", "が", "いい", "です", "よ"] },
      { arti: "Barangkali (itu) penyakit lambung.", potongan: ["もしかしたら", "い", "の", "びょうき", "かも", "しれません"] },
      { arti: "Sebaiknya minuman didinginkan di kulkas.", potongan: ["のみもの", "は", "れいぞうこ", "で", "ひやした", "ほう", "が", "いい", "です"] },
      { arti: "Besok sore mungkin akan cerah.", potongan: ["あした", "の", "ゆうがた", "は", "はれる", "でしょう"] },
      { arti: "Mesin mobilnya mungkin rusak.", potongan: ["くるま", "の", "エンジン", "が", "こわれた", "かも", "しれません"] },
      { arti: "Tim itu mungkin akan menang.", potongan: ["あの", "チーム", "は", "かつ", "でしょう"] },
    ],
    pilih: [
      {
        arti: "Sebaiknya berolahraga setiap hari.",
        benar: "まいにち うんどうした ほうが いいです。",
        salah: ["まいにち うんどうしたの ほうが いいです。", "まいにち うんどうして ほうが いいです。", "まいにち うんどうします ほうが いいです。"],
      },
      {
        arti: "Waktu demam, sebaiknya tidak masuk ke bak mandi.",
        benar: "ねつが ある ときは、おふろに はいらない ほうが いいです。",
        salah: ["ねつが ある ときは、おふろに はいらなかった ほうが いいです。", "ねつが ある ときは、おふろに はいりない ほうが いいです。", "ねつが ある ときは、おふろに はいった ほうが いいです。"],
      },
      {
        arti: "Besok mungkin akan hujan.",
        benar: "あしたは あめが ふるでしょう。",
        salah: ["あしたは あめが ふりでしょう。", "あしたは あめが ふるだでしょう。", "あしたは あめが ふったでしょう。"],
      },
      {
        arti: "Mungkin (saya) masuk angin.",
        benar: "かぜを ひいたかも しれません。",
        salah: ["かぜを ひいただかも しれません。", "かぜを ひきたかも しれません。", "かぜが ひいたかも しれません。"],
      },
      {
        arti: "Barangkali (itu) penyakit lambung.",
        benar: "もしかしたら いの びょうきかも しれません。",
        salah: ["もしかしたら いの びょうきだかも しれません。", "もしかしたら いの びょうきなかも しれません。", "もしかしたら いの びょうきのかも しれません。"],
      },
      {
        arti: "Besok mungkin dingin.",
        benar: "あしたは さむいでしょう。",
        salah: ["あしたは さむいだでしょう。", "あしたは さむくでしょう。", "あしたは さむかったでしょう。"],
      },
      {
        arti: "Besok mungkin akan tenang (tidak berangin).",
        benar: "あしたは しずかでしょう。",
        salah: ["あしたは しずかだでしょう。", "あしたは しずかなでしょう。", "あしたは しずかいでしょう。"],
      },
      {
        arti: "Mungkin (saya) tidak sempat tepat pada waktu janji.",
        benar: "やくそくの じかんに まにあわないかも しれません。",
        salah: ["やくそくの じかんに まにあいないかも しれません。", "やくそくの じかんを まにあわないかも しれません。", "やくそくの じかんに まにあわないでしょうかも しれません。"],
      },
      {
        arti: "Sebaiknya jangan memaksakan diri.",
        benar: "むりを しない ほうが いいですよ。",
        salah: ["むりを しなかった ほうが いいですよ。", "むりを しないで ほうが いいですよ。", "むりを する ほうが いいですよ。"],
      },
      {
        arti: "Kenapa? ... Sakit lambung. ... Kasihan ya.",
        benar: "どうしたんですか。……いが いたいんです。……それは いけませんね。",
        salah: ["どうしたんですか。……いが いたいんです。……それは いいですね。", "どうしたんですか。……いを いたいんです。……それは いけませんね。", "どうしたんですか。……いが いたいなんです。……それは いけませんね。"],
      },
      {
        arti: "Mesin mobilnya mungkin rusak.",
        benar: "くるまの エンジンが こわれたかも しれません。",
        salah: ["くるまの エンジンが こわしたかも しれません。", "くるまの エンジンを こわれたかも しれません。", "くるまの エンジンが こわれりかも しれません。"],
      },
      {
        arti: "Hujannya sudah berhenti.",
        benar: "あめが やみました。",
        salah: ["あめを やみました。", "あめが やめました。", "あめが やすみました。"],
      },
    ],
  },
  33: {
    susun: [
      { arti: "Jangan berlari di sini!", potongan: ["ここ", "で", "はしる", "な"] },
      { arti: "Kanji itu dibaca apa? ... Dibaca \"kin'en\".", potongan: ["あの", "かんじ", "は", "なん", "と", "よみます", "か"] },
      { arti: "Tanda ini artinya apa?", potongan: ["この", "マーク", "は", "どういう", "いみ", "です", "か"] },
      { arti: "\"Tachiiri kinshi\" artinya jangan masuk.", potongan: ["たちいりきんし", "は", "はいる", "な", "と", "いう", "いみ", "です"] },
      { arti: "Sdr. Tanaka bilang besok (dia) libur.", potongan: ["たなかさん", "は", "あした", "やすむ", "と", "いって", "いました"] },
      { arti: "Bisakah (Anda) sampaikan kepada Sdr. Miller agar menelepon (saya) nanti?", potongan: ["ミラーさん", "に", "あとで", "でんわ", "を", "ください", "と", "つたえて", "いただけません", "か"] },
      { arti: "Jangan parkir mobil di sini!", potongan: ["ここ", "に", "くるま", "を", "とめる", "な"] },
      { arti: "Lari sampai garis finis! (perintah)", potongan: ["ゴール", "まで", "はしれ"] },
      { arti: "Tolong hubungi (saya) secepat mungkin.", potongan: ["できるだけ", "はやく", "れんらくして", "ください"] },
      { arti: "Tinggal 5 menit lagi.", potongan: ["あと", "ごふん", "です"] },
      { arti: "Denda pelanggaran parkir harus dibayar dalam satu minggu.", potongan: ["ばっきん", "は", "いっしゅうかん", "いない", "に", "はらって", "ください"] },
      { arti: "Sdr. Watanabe sedang meninggalkan tempat duduknya.", potongan: ["わたなべさん", "は", "いま", "せき", "を", "はずして", "います"] },
    ],
    pilih: [
      {
        arti: "Larilah! (perintah)",
        benar: "にげろ。",
        salah: ["にげれ。", "にげい。", "にげら。"],
      },
      {
        arti: "Cepat! (perintah)",
        benar: "いそげ。",
        salah: ["いそぎろ。", "いそげろ。", "いそがれ。"],
      },
      {
        arti: "Kemari! (perintah)",
        benar: "こい。",
        salah: ["きろ。", "くれ。", "こえ。"],
      },
      {
        arti: "Kerjakan! (perintah)",
        benar: "しろ。",
        salah: ["すれ。", "しれ。", "せろ。"],
      },
      {
        arti: "Jangan berlari di sini!",
        benar: "ここで はしるな。",
        salah: ["ここで はしりな。", "ここで はしらな。", "ここで はしれな。"],
      },
      {
        arti: "Jangan buang sampah! (larangan)",
        benar: "ごみを すてるな。",
        salah: ["ごみを すてな。", "ごみを すてろな。", "ごみを すてないな。"],
      },
      {
        arti: "Kanji itu dibaca apa? ... Dibaca \"kin'en\".",
        benar: "あの かんじは なんと よみますか。……「きんえん」と よみます。",
        salah: ["あの かんじは なにを よみますか。……「きんえん」と よみます。", "あの かんじは なんと よみますか。……「きんえん」を よみます。", "あの かんじは なんで よみますか。……「きんえん」と よみます。"],
      },
      {
        arti: "\"Tachiiri kinshi\" artinya jangan masuk.",
        benar: "「たちいりきんし」は はいるなと いう いみです。",
        salah: ["「たちいりきんし」は はいるなの いみです。", "「たちいりきんし」は はいるなと いいます いみです。", "「たちいりきんし」は はいれと いう いみです。"],
      },
      {
        arti: "Sdr. Tanaka bilang besok (dia) libur.",
        benar: "たなかさんは あした やすむと いって いました。",
        salah: ["たなかさんは あした やすむを いって いました。", "たなかさんは あした やすみと いって いました。", "たなかさんは あした やすむと いって いきました。"],
      },
      {
        arti: "Bisakah (Anda) sampaikan kepada Sdr. Miller agar menelepon (saya) nanti?",
        benar: "ミラーさんに あとで でんわを くださいと つたえて いただけませんか。",
        salah: ["ミラーさんを あとで でんわを くださいと つたえて いただけませんか。", "ミラーさんに あとで でんわを くださいを つたえて いただけませんか。", "ミラーさんに あとで でんわを くださいと つたえって いただけませんか。"],
      },
      {
        arti: "Tidak boleh merokok di sini.",
        benar: "ここで たばこを すっては いけません。",
        salah: ["ここで たばこを すうては いけません。", "ここで たばこを すいては いけません。", "ここで たばこを すっては いきません。"],
      },
      {
        arti: "(Saya) sudah tidak bisa berjalan lagi.",
        benar: "もう あるけません。",
        salah: ["まだ あるけません。", "もう あるけます。", "もう あるきません けます。"],
      },
    ],
  },
  34: {
    susun: [
      { arti: "Tolong lakukan seperti yang saya lakukan.", potongan: ["わたし", "が", "やる", "とおり", "に", "やって", "ください"] },
      { arti: "Tolong ceritakan seperti yang (Anda) lihat.", potongan: ["みた", "とおり", "に", "はなして", "ください"] },
      { arti: "(Saya) merakitnya sesuai buku petunjuk.", potongan: ["せつめいしょ", "の", "とおり", "に", "くみたてました"] },
      { arti: "Setelah pekerjaan selesai, (saya) pergi minum.", potongan: ["しごと", "が", "おわった", "あと", "で", "のみ", "に", "いきます"] },
      { arti: "Sesudah makan, (saya) menggosok gigi.", potongan: ["しょくじ", "の", "あと", "で", "は", "を", "みがきます"] },
      { arti: "(Saya) makan dengan mencelupkan ke kecap asin.", potongan: ["しょうゆ", "を", "つけて", "たべます"] },
      { arti: "(Saya) minum kopi tanpa memasukkan gula.", potongan: ["さとう", "を", "いれないで", "コーヒー", "を", "のみます"] },
      { arti: "Hari Minggu (saya) tidak pergi ke mana-mana, tetapi beristirahat di rumah.", potongan: ["にちようび", "は", "どこ", "も", "いかないで", "うち", "で", "やすみます"] },
      { arti: "Tolong lipat kertas mengikuti garis.", potongan: ["せん", "の", "とおり", "に", "かみ", "を", "おって", "ください"] },
      { arti: "Kemarin malam setelah menonton film, (saya) makan malam.", potongan: ["ゆうべ", "えいが", "を", "みた", "あと", "で", "しょくじしました"] },
      { arti: "(Saya) memasak nasi dengan rice cooker.", potongan: ["すいはんき", "で", "ごはん", "を", "たきます"] },
      { arti: "Silakan pergi duluan.", potongan: ["どうぞ", "さきに", "いって", "ください"] },
    ],
    pilih: [
      {
        arti: "Tolong lakukan seperti yang saya lakukan.",
        benar: "わたしが やる とおりに、やって ください。",
        salah: ["わたしが やるの とおりに、やって ください。", "わたしが やって とおりに、やって ください。", "わたしが やります とおりに、やって ください。"],
      },
      {
        arti: "(Saya) merakitnya sesuai buku petunjuk.",
        benar: "せつめいしょの とおりに、くみたてました。",
        salah: ["せつめいしょな とおりに、くみたてました。", "せつめいしょが とおりに、くみたてました。", "せつめいしょの とおりで、くみたてました。"],
      },
      {
        arti: "Setelah pekerjaan selesai, (saya) pergi minum.",
        benar: "しごとが おわった あとで、のみに いきます。",
        salah: ["しごとが おわる あとで、のみに いきます。", "しごとが おわって あとで、のみに いきます。", "しごとが おわった あとに、のみを いきます。"],
      },
      {
        arti: "Sesudah makan, (saya) menggosok gigi.",
        benar: "しょくじの あとで、はを みがきます。",
        salah: ["しょくじ あとで、はを みがきます。", "しょくじした の あとで、はを みがきます。", "しょくじの まえに、はを みがきます。"],
      },
      {
        arti: "(Saya) makan dengan mencelupkan ke kecap asin.",
        benar: "しょうゆを つけて たべます。",
        salah: ["しょうゆを つけないで たべます。", "しょうゆを つけで たべます。", "しょうゆを つけって たべます。"],
      },
      {
        arti: "(Saya) minum kopi tanpa memasukkan gula.",
        benar: "さとうを いれないで コーヒーを のみます。",
        salah: ["さとうを いれなくて コーヒーを のみます。", "さとうを いれて コーヒーを のみます。", "さとうを いれないて コーヒーを のみます。"],
      },
      {
        arti: "Hari Minggu (saya) tidak pergi ke mana-mana, tetapi beristirahat di rumah.",
        benar: "にちようびは どこも いかないで、うちで やすみます。",
        salah: ["にちようびは どこも いかなくて、うちで やすみます。", "にちようびは どこでも いかないで、うちで やすみます。", "にちようびは どこも いきないで、うちで やすみます。"],
      },
      {
        arti: "Tolong ceritakan seperti yang (Anda) lihat.",
        benar: "みた とおりに はなして ください。",
        salah: ["みて とおりに はなして ください。", "みたの とおりに はなして ください。", "みます とおりに はなして ください。"],
      },
      {
        arti: "(Saya) pergi ke kantor tanpa memakai dasi.",
        benar: "ネクタイを しないで かいしゃへ いきました。",
        salah: ["ネクタイを しなくて かいしゃへ いきました。", "ネクタイを きないで かいしゃへ いきました。", "ネクタイを しないて かいしゃへ いきました。"],
      },
      {
        arti: "Setelah selesai merakit perabot, (saya) membersihkan kamar.",
        benar: "かぐを くみたてた あとで、へやを そうじしました。",
        salah: ["かぐを くみたてる あとで、へやを そうじしました。", "かぐを くみたてて あとで、へやを そうじしました。", "かぐを くみたてたの あとで、へやを そうじしました。"],
      },
      {
        arti: "Tolong lipat kertas mengikuti garis.",
        benar: "せんの とおりに かみを おって ください。",
        salah: ["せんの とおりに かみを おりて ください。", "せんの とおりに かみを おれて ください。", "せんで とおりに かみを おって ください。"],
      },
      {
        arti: "Ini sudah benar? ... Ya, bagus sekali.",
        benar: "これで いいですか。……ええ、とても じょうずです。",
        salah: ["これに いいですか。……ええ、とても じょうずです。", "これを いいですか。……ええ、とても じょうずです。", "これで いいですか。……ええ、とても へたです。"],
      },
    ],
  },
  35: {
    susun: [
      { arti: "Kalau sudah musim semi, bunga sakura mekar.", potongan: ["はる", "に", "なれば", "さくら", "が", "さきます"] },
      { arti: "Kalau tombol ini ditekan, jendela terbuka.", potongan: ["この", "ボタン", "を", "おせば", "まど", "が", "あきます"] },
      { arti: "Kalau tas ini murah, (saya) beli.", potongan: ["この", "かばん", "が", "やすければ", "かいます"] },
      { arti: "Kalau cuacanya bagus, pulau kelihatan di seberang sana.", potongan: ["てんき", "が", "よければ", "むこう", "に", "しま", "が", "みえます"] },
      { arti: "Kalau senggang, tolong bantu (saya).", potongan: ["ひま", "なら", "てつだって", "ください"] },
      { arti: "Kalau tidak ada pendapat lain, kita akhiri sampai di sini.", potongan: ["ほか", "に", "いけん", "が", "なければ", "これ", "で", "おわります"] },
      { arti: "Sebaiknya bagaimana (caranya)?", potongan: ["どう", "すれば", "いい", "です", "か"] },
      { arti: "Kalau soal komputer, Sdr. Miller paham betul.", potongan: ["パソコン", "なら", "ミラーさん", "が", "くわしい", "です"] },
      { arti: "Kalau tidak tahu arti kata, tolong cari di kamus.", potongan: ["ことば", "の", "いみ", "が", "わからなければ", "じしょ", "で", "しらべて", "ください"] },
      { arti: "Kalau pergi ke mana, (saya) bisa membeli tiket?", potongan: ["どこ", "へ", "いけば", "きっぷ", "が", "かえます", "か"] },
      { arti: "Kalau hujan, (saya) tidak pergi.", potongan: ["あめ", "なら", "いきません"] },
      { arti: "Kalau ada kesempatan, (saya) ingin pergi ke luar negeri.", potongan: ["きかい", "が", "あれば", "かいがい", "へ", "いきたい", "です"] },
    ],
    pilih: [
      {
        arti: "Kalau tombol ini ditekan, jendela terbuka.",
        benar: "この ボタンを おせば、まどが あきます。",
        salah: ["この ボタンを おすば、まどが あきます。", "この ボタンを おしば、まどが あきます。", "この ボタンを おせば、まどを あきます。"],
      },
      {
        arti: "Kalau murah, (saya) beli.",
        benar: "やすければ、かいます。",
        salah: ["やすいければ、かいます。", "やすくければ、かいます。", "やすければ、かいません。"],
      },
      {
        arti: "Kalau cuacanya bagus, pulau kelihatan di seberang sana.",
        benar: "てんきが よければ、むこうに しまが みえます。",
        salah: ["てんきが いければ、むこうに しまが みえます。", "てんきが いいければ、むこうに しまが みえます。", "てんきが よければ、むこうに しまを みえます。"],
      },
      {
        arti: "Kalau senggang, tolong bantu (saya).",
        benar: "ひまなら、てつだって ください。",
        salah: ["ひまければ、てつだって ください。", "ひまなれば、てつだって ください。", "ひまだれば、てつだって ください。"],
      },
      {
        arti: "Kalau tidak ada pendapat lain, kita akhiri sampai di sini.",
        benar: "ほかに いけんが なければ、これで おわります。",
        salah: ["ほかに いけんが ないれば、これで おわります。", "ほかに いけんが なくれば、これで おわります。", "ほかに いけんが あれば、これで おわります。"],
      },
      {
        arti: "Sebaiknya bagaimana (caranya)?",
        benar: "どう すれば いいですか。",
        salah: ["どう するば いいですか。", "どう しれば いいですか。", "どう すれば いいでしたか。"],
      },
      {
        arti: "Kalau besok datang, tolong telepon (saya).",
        benar: "あした くれば、でんわして ください。",
        salah: ["あした これば、でんわして ください。", "あした きれば、でんわして ください。", "あした くるば、でんわして ください。"],
      },
      {
        arti: "Kalau soal komputer, Sdr. Miller paham betul.",
        benar: "パソコンなら、ミラーさんが くわしいです。",
        salah: ["パソコンれば、ミラーさんが くわしいです。", "パソコンければ、ミラーさんが くわしいです。", "パソコンなら、ミラーさんを くわしいです。"],
      },
      {
        arti: "Kalau tidak tahu arti kata, tolong cari di kamus.",
        benar: "ことばの いみが わからなければ、じしょで しらべて ください。",
        salah: ["ことばの いみが わかりなければ、じしょで しらべて ください。", "ことばの いみが わからないれば、じしょで しらべて ください。", "ことばの いみが わかれば、じしょで しらべて ください。"],
      },
      {
        arti: "Kalau pergi ke mana, (saya) bisa membeli tiket?",
        benar: "どこへ いけば、きっぷが かえますか。",
        salah: ["どこへ いくば、きっぷが かえますか。", "どこへ いきば、きっぷが かえますか。", "どこへ いけるば、きっぷが かえますか。"],
      },
      {
        arti: "Kalau ada kesempatan, (saya) ingin pergi ke luar negeri.",
        benar: "きかいが あれば、かいがいへ いきたいです。",
        salah: ["きかいが あるば、かいがいへ いきたいです。", "きかいが ありば、かいがいへ いきたいです。", "きかいが なければ、かいがいへ いきたいです。"],
      },
      {
        arti: "Kalau sudah musim semi, bunga sakura mekar.",
        benar: "はるに なれば、さくらが さきます。",
        salah: ["はるに なるば、さくらが さきます。", "はるが なれば、さくらが さきます。", "はるに なれば、さくらを さきます。"],
      },
    ],
  },
  36: {
    susun: [
      { arti: "Supaya bisa berenang dengan cepat, (saya) berlatih setiap hari.", potongan: ["はやく", "およげる", "ように", "まいにち", "れんしゅうして", "います"] },
      { arti: "Supaya tidak lupa, tolong dicatat.", potongan: ["わすれない", "ように", "メモして", "ください"] },
      { arti: "Kalau berlatih setiap hari, (Anda) akan menjadi bisa berenang.", potongan: ["まいにち", "れんしゅうすれば", "およげる", "ように", "なります"] },
      { arti: "Akhirnya (saya) menjadi bisa naik sepeda.", potongan: ["やっと", "じてんしゃ", "に", "のれる", "ように", "なりました"] },
      { arti: "(Saya) mengusahakan berolahraga setiap hari.", potongan: ["まいにち", "うんどうする", "ように", "して", "います"] },
      { arti: "Tolong usahakan jangan sampai terlambat.", potongan: ["ぜったいに", "おくれない", "ように", "して", "ください"] },
      { arti: "(Saya) berusaha makan sayur sebanyak mungkin.", potongan: ["できるだけ", "やさい", "を", "たべる", "ように", "して", "います"] },
      { arti: "Supaya tidak masuk angin, (saya) memakai sweter.", potongan: ["かぜ", "を", "ひかない", "ように", "セーター", "を", "きて", "います"] },
      { arti: "Supaya anak-anak bisa membaca, (saya) menulis dengan hiragana.", potongan: ["こども", "が", "よめる", "ように", "ひらがな", "で", "かきます"] },
      { arti: "Akhir-akhir ini (saya) sudah terbiasa dengan kehidupan di Jepang.", potongan: ["このごろ", "にほん", "の", "せいかつ", "に", "なれました"] },
      { arti: "Barangnya akhirnya sampai.", potongan: ["にもつ", "が", "やっと", "とどきました"] },
      { arti: "Setiap bulan (saya) menabung sedikit demi sedikit.", potongan: ["まいつき", "すこし", "ずつ", "ちょきんして", "います"] },
    ],
    pilih: [
      {
        arti: "Supaya bisa berenang dengan cepat, (saya) berlatih setiap hari.",
        benar: "はやく およげる ように、まいにち れんしゅうして います。",
        salah: ["はやく およげれる ように、まいにち れんしゅうして います。", "はやく およげて ように、まいにち れんしゅうして います。", "はやく およげるの ように、まいにち れんしゅうして います。"],
      },
      {
        arti: "Supaya tidak lupa, tolong dicatat.",
        benar: "わすれない ように、メモして ください。",
        salah: ["わすれなく ように、メモして ください。", "わすれないで ように、メモして ください。", "わすれる ように、メモして ください。"],
      },
      {
        arti: "Akhirnya (saya) menjadi bisa naik sepeda.",
        benar: "やっと じてんしゃに のれる ように なりました。",
        salah: ["やっと じてんしゃを のれる ように なりました。", "やっと じてんしゃに のれる ように しました。", "やっと じてんしゃに のりれる ように なりました。"],
      },
      {
        arti: "(Saya) mengusahakan berolahraga setiap hari.",
        benar: "まいにち うんどうする ように して います。",
        salah: ["まいにち うんどうした ように して います。", "まいにち うんどうする ように なって います。", "まいにち うんどうするの ように して います。"],
      },
      {
        arti: "Tolong usahakan jangan sampai terlambat.",
        benar: "ぜったいに おくれない ように して ください。",
        salah: ["ぜったいに おくれない ように なって ください。", "ぜったいに おくれなくて ように して ください。", "ぜったいに おくれる ように して ください。"],
      },
      {
        arti: "Supaya tidak masuk angin, (saya) memakai sweter.",
        benar: "かぜを ひかない ように、セーターを きて います。",
        salah: ["かぜを ひきない ように、セーターを きて います。", "かぜを ひかないで ように、セーターを きて います。", "かぜを ひかない ように、セーターを はいて います。"],
      },
      {
        arti: "Supaya anak-anak bisa membaca, (saya) menulis dengan hiragana.",
        benar: "こどもが よめる ように、ひらがなで かきます。",
        salah: ["こどもが よまれる ように、ひらがなで かきます。", "こどもが よめれる ように、ひらがなで かきます。", "こどもが よめる ように、ひらがなを かきます。"],
      },
      {
        arti: "(Saya) sudah bisa berbicara bahasa Jepang.",
        benar: "にほんごが はなせる ように なりました。",
        salah: ["にほんごが はなされる ように なりました。", "にほんごが はなせる ように しました。", "にほんごが はなせる ように なります でした。"],
      },
      {
        arti: "Akhir-akhir ini (saya) sudah terbiasa dengan kehidupan di Jepang.",
        benar: "このごろ にほんの せいかつに なれました。",
        salah: ["このごろ にほんの せいかつを なれました。", "このごろ にほんの せいかつで なれました。", "このごろ にほんの せいかつに なりました。"],
      },
      {
        arti: "Setiap bulan (saya) menabung sedikit demi sedikit.",
        benar: "まいつき すこしずつ ちょきんして います。",
        salah: ["まいつき すこしだけ ちょきんして います。", "まいつき すこしずつ ちょきんしって います。", "まいつき すこしも ちょきんして います。"],
      },
      {
        arti: "Sudah lewat jam 7. ... Ayo cepat.",
        benar: "もう 7じを すぎました。……いそぎましょう。",
        salah: ["もう 7じに すぎました。……いそぎましょう。", "もう 7じで すぎました。……いそぎましょう。", "まだ 7じを すぎました。……いそぎましょう。"],
      },
      {
        arti: "Pak Tanaka ikut pertandingan.",
        benar: "たなかさんは しあいに でます。",
        salah: ["たなかさんは しあいを でます。", "たなかさんは しあいで でます。", "たなかさんは しあいに だします。"],
      },
    ],
  },
  37: {
    susun: [
      { arti: "Saya dipuji oleh guru.", potongan: ["わたし", "は", "せんせい", "に", "ほめられました"] },
      { arti: "Saya dimarahi oleh ibu.", potongan: ["わたし", "は", "はは", "に", "しかられました"] },
      { arti: "Kaki saya diinjak oleh seseorang.", potongan: ["わたし", "は", "だれか", "に", "あし", "を", "ふまれました"] },
      { arti: "Dompet saya dicuri oleh pencuri.", potongan: ["わたし", "は", "どろぼう", "に", "さいふ", "を", "とられました"] },
      { arti: "Komputer saya dirusak oleh adik laki-laki.", potongan: ["わたし", "は", "おとうと", "に", "パソコン", "を", "こわされました"] },
      { arti: "Gedung ini dibangun tahun 1990.", potongan: ["この", "ビル", "は", "せんきゅうひゃくきゅうじゅうねん", "に", "たてられました"] },
      { arti: "Rapat diadakan di Tokyo.", potongan: ["かいぎ", "は", "とうきょう", "で", "おこなわれます"] },
      { arti: "Buku ini dibaca di seluruh dunia.", potongan: ["この", "ほん", "は", "せかいじゅう", "で", "よまれて", "います"] },
      { arti: "Telepon ditemukan (diciptakan) oleh Bell.", potongan: ["でんわ", "は", "ベル", "に", "よって", "はつめいされました"] },
      { arti: "Bir dibuat dari gandum.", potongan: ["ビール", "は", "むぎ", "から", "つくられます"] },
      { arti: "Sdr. Miller diundang ke pesta oleh manajer.", potongan: ["ミラーさん", "は", "ぶちょう", "に", "パーティー", "に", "しょうたいされました"] },
      { arti: "Minyak bumi diimpor dari luar negeri.", potongan: ["せきゆ", "は", "がいこく", "から", "ゆにゅうされて", "います"] },
    ],
    pilih: [
      {
        arti: "Saya dipuji oleh guru.",
        benar: "わたしは せんせいに ほめられました。",
        salah: ["わたしは せんせいに ほめれました。", "わたしは せんせいに ほめさせました。", "わたしは せんせいを ほめられました。"],
      },
      {
        arti: "Saya dimarahi oleh ibu.",
        benar: "わたしは ははに しかられました。",
        salah: ["わたしは ははに しかりられました。", "わたしは ははに しかれました。", "わたしは ははが しかられました。"],
      },
      {
        arti: "Kaki saya diinjak oleh seseorang.",
        benar: "わたしは だれかに あしを ふまれました。",
        salah: ["わたしは だれかに あしを ふみられました。", "わたしは だれかに あしが ふまれました。", "わたしは だれかを あしを ふまれました。"],
      },
      {
        arti: "Dompet saya dicuri oleh pencuri.",
        benar: "わたしは どろぼうに さいふを とられました。",
        salah: ["わたしは どろぼうに さいふを とりられました。", "わたしは どろぼうに さいふを とれました。", "わたしの さいふは どろぼうを とられました。"],
      },
      {
        arti: "Komputer saya dirusak oleh adik laki-laki.",
        benar: "わたしは おとうとに パソコンを こわされました。",
        salah: ["わたしは おとうとに パソコンを こわれられました。", "わたしは おとうとに パソコンを こわしられました。", "わたしは おとうとに パソコンを こわしました。"],
      },
      {
        arti: "Gedung ini dibangun tahun 1990.",
        benar: "この ビルは 1990ねんに たてられました。",
        salah: ["この ビルは 1990ねんに たちられました。", "この ビルは 1990ねんに たてました。", "この ビルは 1990ねんに たてれました。"],
      },
      {
        arti: "Rapat diadakan di Tokyo.",
        benar: "かいぎは とうきょうで おこなわれます。",
        salah: ["かいぎは とうきょうで おこないられます。", "かいぎは とうきょうに おこなわれます。", "かいぎは とうきょうで おこなえます。"],
      },
      {
        arti: "Buku ini dibaca di seluruh dunia.",
        benar: "この ほんは せかいじゅうで よまれて います。",
        salah: ["この ほんは せかいじゅうで よめて います。", "この ほんは せかいじゅうで よみられて います。", "この ほんは せかいじゅうを よまれて います。"],
      },
      {
        arti: "Telepon diciptakan oleh Bell.",
        benar: "でんわは ベルによって はつめいされました。",
        salah: ["でんわは ベルによって はつめいしました。", "でんわは ベルによって はつめいられました。", "でんわは ベルについて はつめいされました。"],
      },
      {
        arti: "Bir dibuat dari gandum.",
        benar: "ビールは むぎから つくられます。",
        salah: ["ビールは むぎから つくれます。", "ビールは むぎを つくられます。", "ビールは むぎから つくりられます。"],
      },
      {
        arti: "Sdr. Miller diundang ke pesta oleh manajer.",
        benar: "ミラーさんは ぶちょうに パーティーに しょうたいされました。",
        salah: ["ミラーさんは ぶちょうに パーティーに しょうたいしました。", "ミラーさんは ぶちょうに パーティーに しょうたいられました。", "ミラーさんは ぶちょうに パーティーを しょうたいされました。"],
      },
      {
        arti: "Minyak bumi diimpor dari luar negeri.",
        benar: "せきゆは がいこくから ゆにゅうされて います。",
        salah: ["せきゆは がいこくから ゆしゅつされて います。", "せきゆは がいこくから ゆにゅうしられて います。", "せきゆは がいこくに ゆにゅうされて います。"],
      },
    ],
  },
  38: {
    susun: [
      { arti: "Menggambar itu menyenangkan.", potongan: ["え", "を", "かく", "の", "は", "たのしい", "です"] },
      { arti: "Saya suka melihat bintang.", potongan: ["わたし", "は", "ほし", "を", "みる", "の", "が", "すき", "です"] },
      { arti: "Ibu pandai memasak.", potongan: ["はは", "は", "りょうり", "を", "つくる", "の", "が", "じょうず", "です"] },
      { arti: "(Saya) lupa membawa dokumen.", potongan: ["しょるい", "を", "もって", "くる", "の", "を", "わすれました"] },
      { arti: "Apakah (Anda) tahu bahwa Sdr. Miller akan menikah bulan depan?", potongan: ["ミラーさん", "が", "らいげつ", "けっこんする", "の", "を", "しって", "います", "か"] },
      { arti: "Tempat saya lahir adalah sebuah desa kecil di Hokkaido.", potongan: ["わたし", "が", "うまれた", "の", "は", "ほっかいどう", "の", "ちいさな", "むら", "です"] },
      { arti: "Yang paling penting adalah keluarga.", potongan: ["いちばん", "たいせつな", "の", "は", "かぞく", "です"] },
      { arti: "Membesarkan anak itu berat.", potongan: ["こども", "を", "そだてる", "の", "は", "たいへん", "です"] },
      { arti: "Jangan lupa mematikan aliran listrik.", potongan: ["でんげん", "を", "きる", "の", "を", "わすれないで", "ください"] },
      { arti: "(Saya) lupa mengunci pintu.", potongan: ["ドア", "に", "かぎ", "を", "かける", "の", "を", "わすれました"] },
      { arti: "Adik perempuan saya mirip dengan ibu.", potongan: ["いもうと", "は", "はは", "に", "にて", "います"] },
      { arti: "Sdr. Tanaka masuk rumah sakit minggu lalu.", potongan: ["たなかさん", "は", "せんしゅう", "にゅういんしました"] },
    ],
    pilih: [
      {
        arti: "Menggambar itu menyenangkan.",
        benar: "えを かくのは たのしいです。",
        salah: ["えを かくは たのしいです。", "えを かきのは たのしいです。", "えを かくのを たのしいです。"],
      },
      {
        arti: "Saya suka melihat bintang.",
        benar: "わたしは ほしを みるのが すきです。",
        salah: ["わたしは ほしを みるのを すきです。", "わたしは ほしを みるが すきです。", "わたしは ほしを みますのが すきです。"],
      },
      {
        arti: "Ibu pandai memasak.",
        benar: "ははは りょうりを つくるのが じょうずです。",
        salah: ["ははは りょうりを つくるのを じょうずです。", "ははは りょうりを つくりのが じょうずです。", "ははは りょうりを つくるのが へたです。"],
      },
      {
        arti: "(Saya) lupa menutup jendela.",
        benar: "まどを しめるのを わすれました。",
        salah: ["まどを しめるのが わすれました。", "まどを しめのを わすれました。", "まどを しまるのを わすれました。"],
      },
      {
        arti: "Apakah (Anda) tahu bahwa Sdr. Miller akan menikah bulan depan?",
        benar: "ミラーさんが らいげつ けっこんするのを しって いますか。",
        salah: ["ミラーさんが らいげつ けっこんするのが しって いますか。", "ミラーさんが らいげつ けっこんするを しって いますか。", "ミラーさんが らいげつ けっこんしますのを しって いますか。"],
      },
      {
        arti: "Tempat saya lahir adalah sebuah desa kecil di Hokkaido.",
        benar: "わたしが うまれたのは ほっかいどうの ちいさな むらです。",
        salah: ["わたしが うまれるのは ほっかいどうの ちいさな むらです。", "わたしが うまれたは ほっかいどうの ちいさな むらです。", "わたしが うまれたのは ほっかいどうの ちいさい な むらです。"],
      },
      {
        arti: "Yang paling penting adalah keluarga.",
        benar: "いちばん たいせつなのは かぞくです。",
        salah: ["いちばん たいせつのは かぞくです。", "いちばん たいせつだのは かぞくです。", "いちばん たいせつなは かぞくです。"],
      },
      {
        arti: "Jangan lupa mematikan aliran listrik.",
        benar: "でんげんを きるのを わすれないで ください。",
        salah: ["でんげんを きりのを わすれないで ください。", "でんげんを きるのが わすれないで ください。", "でんげんを いれるのを わすれないで ください。"],
      },
      {
        arti: "Adik perempuan saya mirip dengan ibu.",
        benar: "いもうとは ははに にて います。",
        salah: ["いもうとは ははに にます。", "いもうとは ははを にて います。", "いもうとは ははに にって います。"],
      },
      {
        arti: "Saya permisi duluan.",
        benar: "おさきに しつれいします。",
        salah: ["おさきに しつれいです。", "おさきで しつれいします。", "おさきを しつれいします。"],
      },
      {
        arti: "Aduh, celaka. (Saya) lupa menutup jendela.",
        benar: "あ、いけない。まどを しめるのを わすれました。",
        salah: ["あ、いけない。まどを しめたのを わすれます。", "あ、いけない。まどを しめるのに わすれました。", "あ、いけない。まどが しめるのを わすれました。"],
      },
      {
        arti: "Kucing ini besar ya.",
        benar: "この ねこは おおきいですね。",
        salah: ["この ねこは おおきなですね。", "この ねこは おおきいなですね。", "この ねこは おおきくですね。"],
      },
    ],
  },
  39: {
    susun: [
      { arti: "Mendengar berita itu, (saya) terkejut.", potongan: ["ニュース", "を", "きいて", "びっくりしました"] },
      { arti: "Tidak bisa bertemu keluarga, (saya) kesepian.", potongan: ["かぞく", "に", "あえなくて", "さびしい", "です"] },
      { arti: "Ceritanya rumit, jadi (saya) kurang mengerti.", potongan: ["はなし", "が", "ふくざつで", "よく", "わかりません"] },
      { arti: "Karena ada kecelakaan, busnya terlambat.", potongan: ["じこ", "が", "あって", "バス", "が", "おくれて", "しまいました"] },
      { arti: "Karena gempa bumi, gedungnya roboh.", potongan: ["じしん", "で", "ビル", "が", "たおれました"] },
      { arti: "Karena sakit, (saya) tidak masuk kantor.", potongan: ["びょうき", "で", "かいしゃ", "を", "やすみました"] },
      { arti: "Karena ada urusan, saya permisi duluan.", potongan: ["ようじ", "が", "ある", "ので", "おさきに", "しつれいします"] },
      { arti: "Karena (saya) tidak mengerti bahasa Jepang, bisakah (Anda) berbicara dalam bahasa Inggris?", potongan: ["にほんご", "が", "わからない", "ので", "えいご", "で", "はなして", "いただけません", "か"] },
      { arti: "Karena kamar ini tenang, (saya) bisa tidur nyenyak.", potongan: ["この", "へや", "は", "しずかな", "ので", "よく", "ねむれます"] },
      { arti: "Soalnya sulit, jadi (saya) tidak bisa menjawab.", potongan: ["もんだい", "が", "むずかしくて", "こたえられませんでした"] },
      { arti: "Maaf, (saya) terlambat dari waktu janji.", potongan: ["やくそく", "の", "じかん", "に", "おくれて", "すみませんでした"] },
      { arti: "Di tengah perjalanan, mobil bertabrakan dengan truk.", potongan: ["とちゅう", "で", "くるま", "が", "トラック", "に", "ぶつかりました"] },
    ],
    pilih: [
      {
        arti: "Mendengar berita itu, (saya) terkejut.",
        benar: "ニュースを きいて、びっくりしました。",
        salah: ["ニュースを きって、びっくりしました。", "ニュースを ききて、びっくりしました。", "ニュースを きいて、あんしんしました。"],
      },
      {
        arti: "Tidak bisa bertemu keluarga, (saya) kesepian.",
        benar: "かぞくに あえなくて、さびしいです。",
        salah: ["かぞくに あえないで、さびしいです。", "かぞくに あえないくて、さびしいです。", "かぞくを あえなくて、さびしいです。"],
      },
      {
        arti: "Ceritanya rumit, jadi (saya) kurang mengerti.",
        benar: "はなしが ふくざつで、よく わかりません。",
        salah: ["はなしが ふくざつて、よく わかりません。", "はなしが ふくざつくて、よく わかりません。", "はなしが ふくざつなで、よく わかりません。"],
      },
      {
        arti: "Karena gempa bumi, gedungnya roboh.",
        benar: "じしんで ビルが たおれました。",
        salah: ["じしんに ビルが たおれました。", "じしんで ビルを たおれました。", "じしんで ビルが たおしました。"],
      },
      {
        arti: "Karena sakit, (saya) tidak masuk kantor.",
        benar: "びょうきで かいしゃを やすみました。",
        salah: ["びょうきて かいしゃを やすみました。", "びょうきくて かいしゃを やすみました。", "びょうきで かいしゃに やすみました。"],
      },
      {
        arti: "Karena ada urusan, saya permisi duluan.",
        benar: "ようじが あるので、おさきに しつれいします。",
        salah: ["ようじが あるなので、おさきに しつれいします。", "ようじが ありので、おさきに しつれいします。", "ようじが あるので、おさきに しつれいしましょう。"],
      },
      {
        arti: "Karena (saya) tidak mengerti bahasa Jepang, bisakah (Anda) berbicara dalam bahasa Inggris?",
        benar: "にほんごが わからないので、えいごで はなして いただけませんか。",
        salah: ["にほんごが わからなくので、えいごで はなして いただけませんか。", "にほんごが わかりないので、えいごで はなして いただけませんか。", "にほんごが わからないので、えいごを はなして いただけませんか。"],
      },
      {
        arti: "Karena kamar ini tenang, (saya) bisa tidur nyenyak.",
        benar: "この へやは しずかなので、よく ねむれます。",
        salah: ["この へやは しずかので、よく ねむれます。", "この へやは しずかだので、よく ねむれます。", "この へやは しずかくて、よく ねむれます。"],
      },
      {
        arti: "Soalnya sulit, jadi (saya) tidak bisa menjawab.",
        benar: "もんだいが むずかしくて、こたえられませんでした。",
        salah: ["もんだいが むずかしいて、こたえられませんでした。", "もんだいが むずかしで、こたえられませんでした。", "もんだいが むずかしくて、こたえませられんでした。"],
      },
      {
        arti: "Maaf, (saya) terlambat dari waktu janji.",
        benar: "やくそくの じかんに おくれて、すみませんでした。",
        salah: ["やくそくの じかんを おくれて、すみませんでした。", "やくそくの じかんに おくれって、すみませんでした。", "やくそくの じかんに おくりて、すみませんでした。"],
      },
      {
        arti: "Di tengah perjalanan, mobil bertabrakan dengan truk.",
        benar: "とちゅうで くるまが トラックに ぶつかりました。",
        salah: ["とちゅうに くるまが トラックを ぶつかりました。", "とちゅうで くるまが トラックを ぶつかりました。", "とちゅうで くるまを トラックに ぶつかりました。"],
      },
      {
        arti: "Terima kasih atas kerja kerasnya. ... Saya pamit dulu.",
        benar: "おつかれさまでした。……おさきに しつれいします。",
        salah: ["おつかれさまでした。……おさきで しつれいします。", "おつかれさまでした。……おさきに しつれいでした。", "おつかれさまでした。……おさきを しつれいします。"],
      },
    ],
  },
  40: {
    susun: [
      { arti: "Tolong cari tahu jam berapa pesawat JL107 tiba.", potongan: ["JL107びん", "は", "なんじ", "に", "とうちゃくする", "か", "しらべて", "ください"] },
      { arti: "Tolong beri jawaban apakah (Anda) hadir di pesta akhir tahun atau tidak.", potongan: ["ぼうねんかい", "に", "しゅっせきする", "か", "どうか", "へんじ", "を", "ください"] },
      { arti: "(Saya) tidak tahu apakah cerita itu benar atau tidak.", potongan: ["その", "はなし", "は", "ほんとう", "か", "どうか", "わかりません"] },
      { arti: "Tolong periksa sekali lagi apakah ada kesalahan atau tidak.", potongan: ["まちがい", "が", "ない", "か", "どうか", "もう", "いちど", "たしかめて", "ください"] },
      { arti: "Bolehkah (saya) mencoba memakai celana ini?", potongan: ["この", "ズボン", "を", "はいて", "みても", "いい", "です", "か"] },
      { arti: "(Saya) ingin mencoba minum sake Jepang.", potongan: ["にほん", "の", "おさけ", "を", "のんで", "みたい", "です"] },
      { arti: "Berapa kira-kira tinggi Gunung Fuji?", potongan: ["ふじさん", "の", "たかさ", "は", "どのくらい", "です", "か"] },
      { arti: "Tolong timbang berat barangnya.", potongan: ["にもつ", "の", "おもさ", "を", "はかって", "ください"] },
      { arti: "(Kami) menyelidiki siapa yang paling cepat.", potongan: ["だれ", "が", "いちばん", "はやい", "か", "しらべます"] },
      { arti: "Tolong tentukan motif mana yang bagus.", potongan: ["どんな", "もよう", "が", "いい", "か", "きめて", "ください"] },
      { arti: "Mari coba hitung jumlah barangnya.", potongan: ["にもつ", "の", "かず", "を", "かぞえて", "みましょう"] },
      { arti: "Tiba-tiba (dia) menjalankan mobilnya.", potongan: ["きゅうに", "くるま", "を", "うごかしました"] },
    ],
    pilih: [
      {
        arti: "Tolong cari tahu jam berapa pesawat JL107 tiba.",
        benar: "JL107びんは なんじに とうちゃくするか、しらべて ください。",
        salah: ["JL107びんは なんじに とうちゃくするのか どうか、しらべて ください。", "JL107びんは なんじに とうちゃくしますか、しらべて ください。", "JL107びんは なんじに とうちゃくするか どうか、しらべて ください。"],
      },
      {
        arti: "Tolong beri jawaban apakah (Anda) hadir di pesta akhir tahun atau tidak.",
        benar: "ぼうねんかいに しゅっせきするか どうか、へんじを ください。",
        salah: ["ぼうねんかいに しゅっせきするか ないか、へんじを ください。", "ぼうねんかいに しゅっせきしますか どうか、へんじを ください。", "ぼうねんかいに しゅっせきするの どうか、へんじを ください。"],
      },
      {
        arti: "(Saya) tidak tahu apakah cerita itu benar atau tidak.",
        benar: "その はなしは ほんとうか どうか、わかりません。",
        salah: ["その はなしは ほんとうだか どうか、わかりません。", "その はなしは ほんとうなか どうか、わかりません。", "その はなしは ほんとうか なにか、わかりません。"],
      },
      {
        arti: "Tolong periksa sekali lagi apakah ada kesalahan atau tidak.",
        benar: "まちがいが ないか どうか、もう いちど たしかめて ください。",
        salah: ["まちがいが ないの どうか、もう いちど たしかめて ください。", "まちがいが なくか どうか、もう いちど たしかめて ください。", "まちがいが ないか どうか、もう いちど たしかめって ください。"],
      },
      {
        arti: "Bolehkah (saya) mencoba memakai celana ini?",
        benar: "この ズボンを はいて みても いいですか。",
        salah: ["この ズボンを はいて みりても いいですか。", "この ズボンを はきて みても いいですか。", "この ズボンを きて みても いいですか。"],
      },
      {
        arti: "(Saya) ingin mencoba minum sake Jepang.",
        benar: "にほんの おさけを のんで みたいです。",
        salah: ["にほんの おさけを のみて みたいです。", "にほんの おさけを のんで みりたいです。", "にほんの おさけを のんで みますたいです。"],
      },
      {
        arti: "Berapa kira-kira tinggi Gunung Fuji?",
        benar: "ふじさんの たかさは どのくらいですか。",
        salah: ["ふじさんの たかいさは どのくらいですか。", "ふじさんの たかくさは どのくらいですか。", "ふじさんの たかさを どのくらいですか。"],
      },
      {
        arti: "Tolong timbang berat barangnya.",
        benar: "にもつの おもさを はかって ください。",
        salah: ["にもつの おもいさを はかって ください。", "にもつの おもさを はかりて ください。", "にもつの おもさが はかって ください。"],
      },
      {
        arti: "(Kami) menyelidiki siapa yang paling cepat.",
        benar: "だれが いちばん はやいか、しらべます。",
        salah: ["だれが いちばん はやいだか、しらべます。", "だれが いちばん はやくか、しらべます。", "だれを いちばん はやいか、しらべます。"],
      },
      {
        arti: "Tolong tentukan motif mana yang bagus.",
        benar: "どんな もようが いいか、きめて ください。",
        salah: ["どんな もようが いいか どうか、きめて ください。", "どんな もようが いいだか、きめて ください。", "どんな もようが よくか、きめて ください。"],
      },
      {
        arti: "Mari kita coba hitung.",
        benar: "かぞえて みましょう。",
        salah: ["かぞえて みりましょう。", "かぞえり みましょう。", "かぞえて みえましょう。"],
      },
      {
        arti: "Ngomong-ngomong, bagaimana hasil ujiannya? ... Hmm, bagaimana ya.",
        benar: "ところで、テストの せいせきは どうでしたか。……さあ、どうでしょうか。",
        salah: ["ところで、テストの せいせきは どうでしたか。……さあ、どうでしょうでした。", "ところで、テストの せいせきは どうでしたか。……さあ、どうでしょうだか。", "ところで、テストの せいせきを どうでしたか。……さあ、どうでしょうか。"],
      },
    ],
  },
  41: {
    susun: [
      { arti: "Saya menerima oleh-oleh dari direktur.", potongan: ["わたし", "は", "しゃちょう", "に", "おみやげ", "を", "いただきました"] },
      { arti: "Istri manajer memberi saya kue.", potongan: ["ぶちょう", "の", "おくさん", "が", "わたし", "に", "おかし", "を", "くださいました"] },
      { arti: "Saya memberi makan anjing.", potongan: ["わたし", "は", "いぬ", "に", "えさ", "を", "やりました"] },
      { arti: "Saya dibetulkan kesalahan surat oleh guru.", potongan: ["わたし", "は", "せんせい", "に", "てがみ", "の", "まちがい", "を", "なおして", "いただきました"] },
      { arti: "Istri manajer mengajari saya upacara minum teh.", potongan: ["ぶちょう", "の", "おくさん", "が", "さどう", "を", "おしえて", "くださいました"] },
      { arti: "Saya membacakan buku bergambar untuk cucu.", potongan: ["わたし", "は", "まご", "に", "えほん", "を", "よんで", "やりました"] },
      { arti: "Bisakah (Anda) menitipkan barang ini sebentar?", potongan: ["ちょっと", "この", "にもつ", "を", "あずかって", "いただけません", "か"] },
      { arti: "Guru memotretkan (foto kami).", potongan: ["せんせい", "が", "しゃしん", "を", "とって", "くださいました"] },
      { arti: "Saya membelikan mainan untuk anak laki-laki saya.", potongan: ["わたし", "は", "むすこ", "に", "おもちゃ", "を", "かって", "やりました"] },
      { arti: "Tolong beri makan kucingnya.", potongan: ["ねこ", "に", "えさ", "を", "やって", "ください"] },
      { arti: "Dulu kala, ada seorang pemuda yang menolong kura-kura.", potongan: ["むかし", "かめ", "を", "たすけた", "ひと", "が", "いました"] },
      { arti: "Bisakah kaos kaki ini ditukar?", potongan: ["この", "くつした", "を", "とりかえて", "いただけません", "か"] },
    ],
    pilih: [
      {
        arti: "Saya menerima oleh-oleh dari direktur.",
        benar: "わたしは しゃちょうに おみやげを いただきました。",
        salah: ["わたしは しゃちょうに おみやげを くださいました。", "わたしは しゃちょうに おみやげを やりました。", "わたしは しゃちょうを おみやげを いただきました。"],
      },
      {
        arti: "Istri manajer memberi saya kue.",
        benar: "ぶちょうの おくさんが わたしに おかしを くださいました。",
        salah: ["ぶちょうの おくさんが わたしに おかしを いただきました。", "ぶちょうの おくさんが わたしに おかしを やりました。", "ぶちょうの おくさんを わたしに おかしを くださいました。"],
      },
      {
        arti: "Saya memberi makan anjing.",
        benar: "わたしは いぬに えさを やりました。",
        salah: ["わたしは いぬに えさを くださいました。", "わたしは いぬに えさを いただきました。", "わたしは いぬを えさを やりました。"],
      },
      {
        arti: "Saya dibetulkan kesalahan surat oleh guru.",
        benar: "わたしは せんせいに てがみの まちがいを なおして いただきました。",
        salah: ["わたしは せんせいに てがみの まちがいを なおして くださいました。", "わたしは せんせいに てがみの まちがいを なおして やりました。", "わたしは せんせいに てがみの まちがいを なおりて いただきました。"],
      },
      {
        arti: "Istri manajer mengajari saya upacara minum teh.",
        benar: "ぶちょうの おくさんが さどうを おしえて くださいました。",
        salah: ["ぶちょうの おくさんが さどうを おしえて いただきました。", "ぶちょうの おくさんが さどうを おしえて やりました。", "ぶちょうの おくさんが さどうを おしえって くださいました。"],
      },
      {
        arti: "Saya membacakan buku bergambar untuk cucu.",
        benar: "わたしは まごに えほんを よんで やりました。",
        salah: ["わたしは まごに えほんを よんで くださいました。", "わたしは まごに えほんを よんで いただきました。", "わたしは まごに えほんを よみて やりました。"],
      },
      {
        arti: "Bisakah (Anda) menitipkan barang ini sebentar?",
        benar: "ちょっと この にもつを あずかって いただけませんか。",
        salah: ["ちょっと この にもつを あずかって いただきませんか。", "ちょっと この にもつを あずかって やりませんか。", "ちょっと この にもつを あずかりて いただけませんか。"],
      },
      {
        arti: "Guru memotretkan (foto kami).",
        benar: "せんせいが しゃしんを とって くださいました。",
        salah: ["せんせいが しゃしんを とって いただきました。", "せんせいに しゃしんを とって くださいました。", "せんせいが しゃしんを とりて くださいました。"],
      },
      {
        arti: "Tolong beri makan kucingnya.",
        benar: "ねこに えさを やって ください。",
        salah: ["ねこに えさを くださって ください。", "ねこを えさを やって ください。", "ねこに えさを やりて ください。"],
      },
      {
        arti: "Kalau tidak keberatan, bolehkah (saya) meminjam payung?",
        benar: "かさを かして いただけませんか。",
        salah: ["かさを かりて いただけませんか。", "かさを かして くださいませんでしたか。", "かさを かして いただきませんか。"],
      },
      {
        arti: "Mohon maaf. (sangat sopan)",
        benar: "もうしわけ ありません。",
        salah: ["もうしわけ ありました。", "もうしわけ いません。", "もうしわけ ございました。"],
      },
      {
        arti: "Terima kasih banyak, sangat tertolong.",
        benar: "どうも ありがとう ございました。たすかりました。",
        salah: ["どうも ありがとう ございました。たすけました。", "どうも ありがとう ございました。たすかれました。", "どうも ありがとう ございました。たすかりませんでした。"],
      },
    ],
  },
  42: {
    susun: [
      { arti: "Untuk memiliki toko sendiri, (saya) menabung.", potongan: ["じぶん", "の", "みせ", "を", "もつ", "ために", "ちょきんして", "います"] },
      { arti: "Untuk pindah rumah, (saya) menyewa mobil.", potongan: ["ひっこし", "の", "ために", "くるま", "を", "かります"] },
      { arti: "Demi kesehatan, setiap pagi (saya) berlari.", potongan: ["けんこう", "の", "ために", "まいあさ", "はしって", "います"] },
      { arti: "Gunting ini dipakai untuk memotong bunga.", potongan: ["この", "はさみ", "は", "はな", "を", "きる", "のに", "つかいます"] },
      { arti: "Kalkulator dipakai untuk menghitung.", potongan: ["でんたく", "は", "けいさんする", "のに", "つかいます"] },
      { arti: "Furoshiki dipakai untuk membungkus barang.", potongan: ["ふろしき", "は", "もの", "を", "つつむ", "のに", "つかいます"] },
      { arti: "(Saya) ingin bekerja demi perdamaian.", potongan: ["へいわ", "の", "ために", "はたらきたい", "です"] },
      { arti: "Ceret ini praktis untuk merebus air.", potongan: ["この", "やかん", "は", "おゆ", "を", "わかす", "のに", "べんり", "です"] },
      { arti: "Untuk membaca buku ini diperlukan 3 jam.", potongan: ["この", "ほん", "を", "よむ", "のに", "さんじかん", "かかりました"] },
      { arti: "Untuk membangun rumah diperlukan 30 juta yen.", potongan: ["うち", "を", "たてる", "のに", "さんぜんまんえん", "ひつよう", "です"] },
      { arti: "Tas ini praktis untuk bepergian.", potongan: ["この", "かばん", "は", "りょこう", "に", "べんり", "です"] },
      { arti: "Kenapa (Anda) belajar bahasa Jepang?", potongan: ["なぜ", "にほんご", "を", "べんきょうして", "いる", "んです", "か"] },
    ],
    pilih: [
      {
        arti: "Untuk memiliki toko sendiri, (saya) menabung.",
        benar: "じぶんの みせを もつ ために、ちょきんして います。",
        salah: ["じぶんの みせを もてる ために、ちょきんして います。", "じぶんの みせを もった ために、ちょきんして います。", "じぶんの みせを もつの ために、ちょきんして います。"],
      },
      {
        arti: "Untuk pindah rumah, (saya) menyewa mobil.",
        benar: "ひっこしの ために、くるまを かります。",
        salah: ["ひっこし ために、くるまを かります。", "ひっこしな ために、くるまを かります。", "ひっこしに ために、くるまを かります。"],
      },
      {
        arti: "Demi kesehatan, setiap pagi (saya) berlari.",
        benar: "けんこうの ために、まいあさ はしって います。",
        salah: ["けんこうな ために、まいあさ はしって います。", "けんこう ために、まいあさ はしって います。", "けんこうの ために、まいあさ はしりて います。"],
      },
      {
        arti: "Gunting ini dipakai untuk memotong bunga.",
        benar: "この はさみは はなを きるのに つかいます。",
        salah: ["この はさみは はなを きるに つかいます。", "この はさみは はなを きりのに つかいます。", "この はさみは はなを きるのを つかいます。"],
      },
      {
        arti: "Kalkulator dipakai untuk menghitung.",
        benar: "でんたくは けいさんするのに つかいます。",
        salah: ["でんたくは けいさんしますのに つかいます。", "でんたくは けいさんのに つかいます。", "でんたくは けいさんするのが つかいます。"],
      },
      {
        arti: "Ceret ini praktis untuk merebus air.",
        benar: "この やかんは おゆを わかすのに べんりです。",
        salah: ["この やかんは おゆを わかしのに べんりです。", "この やかんは おゆを わかすのを べんりです。", "この やかんは おゆを わかすに べんりです。"],
      },
      {
        arti: "(Saya) ingin bekerja demi perdamaian.",
        benar: "へいわの ために はたらきたいです。",
        salah: ["へいわな ために はたらきたいです。", "へいわ ために はたらきたいです。", "へいわの ために はたらきたいでした。"],
      },
      {
        arti: "Untuk membangun rumah diperlukan 30 juta yen.",
        benar: "うちを たてるのに 3000まんえん ひつようです。",
        salah: ["うちを たてたのに 3000まんえん ひつようです。", "うちを たてるのを 3000まんえん ひつようです。", "うちを たてりのに 3000まんえん ひつようです。"],
      },
      {
        arti: "Tas ini praktis untuk bepergian.",
        benar: "この かばんは りょこうに べんりです。",
        salah: ["この かばんは りょこうを べんりです。", "この かばんは りょこうが べんりです。", "この かばんは りょこうで べんりです。"],
      },
      {
        arti: "Untuk membaca buku ini diperlukan 3 jam.",
        benar: "この ほんを よむのに 3じかん かかりました。",
        salah: ["この ほんを よみのに 3じかん かかりました。", "この ほんを よむのを 3じかん かかりました。", "この ほんを よむのに 3じかん かけりました。"],
      },
      {
        arti: "Daripada pena, pakailah pensil. (sebagai pengganti pena)",
        benar: "ペンの かわりに えんぴつを つかって ください。",
        salah: ["ペンを かわりに えんぴつを つかって ください。", "ペンが かわりに えんぴつを つかって ください。", "ペンの かわりで えんぴつを つかって ください。"],
      },
      {
        arti: "Kenapa (Anda) belajar bahasa Jepang?",
        benar: "なぜ にほんごを べんきょうして いるんですか。",
        salah: ["なぜ にほんごを べんきょうして いるなんですか。", "なぜ にほんごに べんきょうして いるんですか。", "なぜ にほんごを べんきょうしって いるんですか。"],
      },
    ],
  },
  43: {
    susun: [
      { arti: "Sepertinya sebentar lagi akan hujan.", potongan: ["いまにも", "あめ", "が", "ふりそう", "です"] },
      { arti: "Kue ini kelihatannya enak.", potongan: ["この", "ケーキ", "は", "おいしそう", "です"] },
      { arti: "Sdr. Miller kelihatannya senang.", potongan: ["ミラーさん", "は", "うれしそう", "です"] },
      { arti: "Barang itu kelihatannya berat ya.", potongan: ["その", "にもつ", "は", "おもそう", "です", "ね"] },
      { arti: "Kancingnya kelihatannya akan lepas.", potongan: ["ボタン", "が", "とれそう", "です"] },
      { arti: "Sebentar, (saya) pergi membeli rokok (lalu kembali).", potongan: ["ちょっと", "たばこ", "を", "かって", "きます"] },
      { arti: "(Saya) pergi ke kantor pos dulu (lalu kembali).", potongan: ["ゆうびんきょく", "へ", "いって", "きます"] },
      { arti: "Sepatu ini kelihatannya kuat.", potongan: ["この", "くつ", "は", "じょうぶそう", "です"] },
      { arti: "Harganya kelihatannya akan naik.", potongan: ["ねだん", "が", "あがりそう", "です"] },
      { arti: "Toko ini kelihatannya bagus.", potongan: ["この", "みせ", "は", "よさそう", "です"] },
      { arti: "Kelihatannya tidak ada waktu.", potongan: ["じかん", "が", "なさそう", "です"] },
      { arti: "Sdri. Tanaka kelihatannya sehat.", potongan: ["たなかさん", "は", "げんきそう", "です"] },
    ],
    pilih: [
      {
        arti: "Sepertinya sebentar lagi akan hujan.",
        benar: "いまにも あめが ふりそうです。",
        salah: ["いまにも あめが ふりさそうです。", "いまにも あめが ふらそうです。", "いまにも あめを ふりそうです。"],
      },
      {
        arti: "Kue ini kelihatannya enak.",
        benar: "この ケーキは おいしそうです。",
        salah: ["この ケーキは おいしくそうです。", "この ケーキは おいしいだそうです。", "この ケーキは おいしなそうです。"],
      },
      {
        arti: "Sdr. Miller kelihatannya senang.",
        benar: "ミラーさんは うれしそうです。",
        salah: ["ミラーさんは うれしくそうです。", "ミラーさんは うれしなそうです。", "ミラーさんは うれしいだそうです。"],
      },
      {
        arti: "Sdri. Tanaka kelihatannya sehat.",
        benar: "たなかさんは げんきそうです。",
        salah: ["たなかさんは げんきなそうです。", "たなかさんは げんきいそうです。", "たなかさんは げんきくそうです。"],
      },
      {
        arti: "Toko ini kelihatannya bagus.",
        benar: "この みせは よさそうです。",
        salah: ["この みせは いさそうです。", "この みせは いいさそうです。", "この みせは よくそうです。"],
      },
      {
        arti: "Kelihatannya tidak ada waktu.",
        benar: "じかんが なさそうです。",
        salah: ["じかんが なそうです。", "じかんが ないさそうです。", "じかんが なくそうです。"],
      },
      {
        arti: "Kancingnya kelihatannya akan lepas.",
        benar: "ボタンが とれそうです。",
        salah: ["ボタンが とれさそうです。", "ボタンが とりそうです。", "ボタンを とれそうです。"],
      },
      {
        arti: "Sebentar, (saya) pergi membeli rokok (lalu kembali).",
        benar: "ちょっと たばこを かって きます。",
        salah: ["ちょっと たばこを かいて きます。", "ちょっと たばこを かいって きます。", "ちょっと たばこが かって きます。"],
      },
      {
        arti: "Barang itu kelihatannya berat ya.",
        benar: "その にもつは おもそうですね。",
        salah: ["その にもつは おもいさそうですね。", "その にもつは おもくそうですね。", "その にもつは おもさそうですね。"],
      },
      {
        arti: "Harganya kelihatannya akan naik.",
        benar: "ねだんが あがりそうです。",
        salah: ["ねだんが あげりそうです。", "ねだんを あがりそうです。", "ねだんが あがりさそうです。"],
      },
      {
        arti: "Bensinnya kelihatannya akan habis.",
        benar: "ガソリンが なくなりそうです。",
        salah: ["ガソリンが なくなりさそうです。", "ガソリンが なくりそうです。", "ガソリンを なくなりそうです。"],
      },
      {
        arti: "Orang itu kelihatannya keras kepala.",
        benar: "あの ひとは がんこそうです。",
        salah: ["あの ひとは がんこなそうです。", "あの ひとは がんこいそうです。", "あの ひとは がんこくそうです。"],
      },
    ],
  },
  44: {
    susun: [
      { arti: "Tadi malam (saya) terlalu banyak minum sake.", potongan: ["ゆうべ", "おさけ", "を", "のみすぎました"] },
      { arti: "Sweter ini terlalu besar.", potongan: ["この", "セーター", "は", "おおきすぎます"] },
      { arti: "Soal ini terlalu rumit, jadi (saya) tidak mengerti.", potongan: ["この", "もんだい", "は", "ふくざつすぎて", "わかりません"] },
      { arti: "Pena ini mudah dipakai menulis.", potongan: ["この", "ペン", "は", "かきやすい", "です"] },
      { arti: "Obat ini sulit diminum.", potongan: ["この", "くすり", "は", "のみにくい", "です"] },
      { arti: "Jalan bersalju mudah membuat terpeleset.", potongan: ["ゆき", "の", "みち", "は", "すべりやすい", "です"] },
      { arti: "Tolong kecilkan suaranya.", potongan: ["おと", "を", "ちいさく", "して", "ください"] },
      { arti: "Tolong bersihkan kamarnya.", potongan: ["へや", "を", "きれい", "に", "して", "ください"] },
      { arti: "Tolong potong rambut (saya) menjadi pendek.", potongan: ["かみ", "を", "みじかく", "して", "ください"] },
      { arti: "Saya pilih kopi.", potongan: ["わたし", "は", "コーヒー", "に", "します"] },
      { arti: "Mari kita bagi dua kuenya.", potongan: ["ケーキ", "を", "はんぶん", "に", "しましょう"] },
      { arti: "Kata ini sulit diingat.", potongan: ["この", "ことば", "は", "おぼえにくい", "です"] },
    ],
    pilih: [
      {
        arti: "Tadi malam (saya) terlalu banyak minum sake.",
        benar: "ゆうべ おさけを のみすぎました。",
        salah: ["ゆうべ おさけを のむすぎました。", "ゆうべ おさけを のんですぎました。", "ゆうべ おさけが のみすぎました。"],
      },
      {
        arti: "Sweter ini terlalu besar.",
        benar: "この セーターは おおきすぎます。",
        salah: ["この セーターは おおきいすぎます。", "この セーターは おおきくすぎます。", "この セーターは おおきなすぎます。"],
      },
      {
        arti: "Soal ini terlalu rumit, jadi (saya) tidak mengerti.",
        benar: "この もんだいは ふくざつすぎて、わかりません。",
        salah: ["この もんだいは ふくざつなすぎて、わかりません。", "この もんだいは ふくざつにすぎて、わかりません。", "この もんだいは ふくざつすぎで、わかりません。"],
      },
      {
        arti: "Pena ini mudah dipakai menulis.",
        benar: "この ペンは かきやすいです。",
        salah: ["この ペンは かくやすいです。", "この ペンは かいてやすいです。", "この ペンは かきやすくです。"],
      },
      {
        arti: "Obat ini sulit diminum.",
        benar: "この くすりは のみにくいです。",
        salah: ["この くすりは のむにくいです。", "この くすりは のみやすいです。", "この くすりは のんでにくいです。"],
      },
      {
        arti: "Tolong kecilkan suaranya.",
        benar: "おとを ちいさく して ください。",
        salah: ["おとを ちいさい して ください。", "おとを ちいさに して ください。", "おとが ちいさく して ください。"],
      },
      {
        arti: "Tolong bersihkan kamarnya.",
        benar: "へやを きれいに して ください。",
        salah: ["へやを きれいく して ください。", "へやを きれいな して ください。", "へやを きれいで して ください。"],
      },
      {
        arti: "Tolong potong rambut (saya) menjadi pendek.",
        benar: "かみを みじかく して ください。",
        salah: ["かみを みじかい して ください。", "かみを みじかに して ください。", "かみを ながく して ください。"],
      },
      {
        arti: "Saya pilih kopi.",
        benar: "わたしは コーヒーに します。",
        salah: ["わたしは コーヒーを します。", "わたしは コーヒーで します。", "わたしは コーヒーく します。"],
      },
      {
        arti: "Mari kita bagi dua kuenya.",
        benar: "ケーキを はんぶんに しましょう。",
        salah: ["ケーキを はんぶんく しましょう。", "ケーキを はんぶんを しましょう。", "ケーキが はんぶんに しましょう。"],
      },
      {
        arti: "Jalan bersalju mudah membuat terpeleset.",
        benar: "ゆきの みちは すべりやすいです。",
        salah: ["ゆきの みちは すべるやすいです。", "ゆきの みちは すべりにくいです。", "ゆきの みちは すべってやすいです。"],
      },
      {
        arti: "Mau dipotong bagaimana? ... Tolong buat seperti foto ini.",
        benar: "どういう ふうに なさいますか。……この しゃしんみたいに して ください。",
        salah: ["どういう ふうに なさいますか。……この しゃしんみたいな して ください。", "どういう ふうに なさいますか。……この しゃしんみたいく して ください。", "どういう ふうに なさいますか。……この しゃしんみたいを して ください。"],
      },
    ],
  },
};
