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
};
