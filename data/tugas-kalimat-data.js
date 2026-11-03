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
            persis tetap benar.
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
};
