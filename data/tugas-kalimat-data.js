/* Bahan tugas "menyusun kalimat" per Bab (dipakai js/tugas-bab.js).
   Kosakata & kanji TIDAK ditulis di sini - diambil langsung dari
   data/bab-data.js (sama dengan fitur Hafalan).

   tugasKalimatData[bab] = {
     susun: [{ arti, potongan: [...] }]   potongan ditulis dalam URUTAN
            BENAR; saat tugas dibuat, urutannya diacak & diberi nomor, lalu
            siswa menuliskan urutan nomor yang benar. Partikel sengaja
            ditempel ke kata sebelumnya bila memisahkannya bisa membuat
            lebih dari satu susunan yang benar.
     pilih: [{ arti, benar, salah: [3 pengecoh] }]   soal berbahasa
            Indonesia, siswa memilih kalimat Jepang yang benar.
   }
   Tiap jenis berisi lebih dari 10 butir; setiap kali tugas dikerjakan
   diambil 10 secara acak dengan urutan acak (TUGAS_KALIMAT_JUMLAH). Bab
   tanpa entri di sini tidak mewajibkan target kalimat. */
const tugasKalimatData = {
  1: {
    susun: [
      { arti: "Saya Mike Miller.", potongan: ["わたしは", "マイク・ミラー", "です"] },
      { arti: "Sdr. Santos bukan mahasiswa.", potongan: ["サントスさんは", "がくせい", "じゃ", "ありません"] },
      { arti: "Apakah Sdr. Miller orang Amerika?", potongan: ["ミラーさんは", "アメリカ", "じん", "ですか"] },
      { arti: "Sdr. Miller pegawai perusahaan IMC.", potongan: ["ミラーさんは", "IMC", "の", "しゃいん", "です"] },
      { arti: "Siapakah beliau? (sopan)", potongan: ["あの", "かたは", "どなた", "ですか"] },
      { arti: "Sdr. Gupta juga pegawai perusahaan.", potongan: ["グプタさん", "も", "かいしゃいん", "です"] },
      { arti: "Saya bukan guru.", potongan: ["わたしは", "せんせい", "じゃ", "ありません"] },
      { arti: "Sdr. Wang dokter Rumah Sakit Kobe.", potongan: ["ワンさんは", "こうべびょういん", "の", "いしゃ", "です"] },
      { arti: "Teresa umur berapa?", potongan: ["テレサちゃんは", "なん", "さい", "ですか"] },
      { arti: "Sdri. Karina mahasiswi Universitas Fuji.", potongan: ["カリナさんは", "ふじだいがく", "の", "がくせい", "です"] },
      { arti: "Siapakah orang itu? (biasa)", potongan: ["あの", "ひとは", "だれ", "ですか"] },
      { arti: "Sdr. Lee juga orang Korea.", potongan: ["リーさん", "も", "かんこく", "じん", "です"] },
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
};
