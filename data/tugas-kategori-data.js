/* Kelompok makna kosakata untuk pengecoh pilihan ganda (js/tugas-bab.js).
   Kunci = cara baca (kana) persis seperti di data/bab-data.js, berlaku
   untuk kosakata MAUPUN kanji (kanji dicocokkan lewat cara bacanya).

   Pengecoh diambil dulu dari kelompok yang sama di bab yang sama, lalu dari
   kelompok yang sama di bab lain (bab terdekat didahulukan), baru kemudian
   kata yang bentuknya paling mirip. Jadi soal profesi selalu
   berpilihan profesi, negara berpilihan negara, dst.

   PERHATIAN saat menambah kata: jangan taruh dua kata yang artinya sama
   persis/sinonim di kelompok yang sama TANPA mencatatnya di tugasSinonim
   (bawah) - teks arti yang identik otomatis disaring, tapi sinonim dengan
   teks berbeda (おてあらい "Kamar kecil" & トイレ "Toilet") harus dicatat
   supaya soal tidak punya dua jawaban benar. Kata yang artinya beda di
   bab lain (homonim) ditulis "kana@bab".
   Kata yang belum dikelompokkan tetap mendapat pengecoh "mirip bentuk". */
const tugasKategoriKata = {
  "kata-tunjuk": ["これ", "それ", "あれ", "この～", "その～", "あの～", "ここ", "そこ", "あそこ", "こちら", "そちら", "あちら", "どれ", "どの～"],
  "benda-tulis": [
    "ほん", "じしょ", "ざっし", "しんぶん", "ノート", "てちょう", "めいし", "カード", "えんぴつ", "ボールペン", "シャープペンシル",
    "てがみ", "レポート", "はがき", "きって", "ふうとう", "カレンダー", "ポスター",
  ],
  benda: [
    "かぎ", "とけい", "かさ", "かばん", "テレビ", "ラジオ", "カメラ", "コンピューター", "くるま", "つくえ", "いす", "おみやげ",
    "くつ", "ネクタイ", "めがね", "でんわ", "じてんしゃ", "ビデオ", "しゃしん", "じどうはんばいき",
  ],
  // おちゃ (= こうちゃ), おさけ (≈ ワイン), さけ (salmon, ≈ さかな) sengaja tidak dimasukkan.
  makanan: [
    "チョコレート", "コーヒー", "ワイン", "ぎゅうにゅう", "ジュース", "ビール", "パン", "たまご", "にく", "さかな", "やさい",
    "くだもの", "みず", "ごはん", "ケーキ", "こうちゃ",
  ],
  orang: ["わたし", "あなた", "あのひと", "あのかた", "ひと", "ともだち", "かぞく", "こども", "おとこのひと", "おんなのひと"],
  "kata-tanya": [
    "だれ", "どなた", "なんさい", "おいくつ", "なん", "どこ", "どちら", "いくら", "なんがい",
    "なんじ", "なんぷん", "なんようび", "なんばん", "なんねん", "なんがつ", "なんにち",
  ],
  profesi: [
    "せんせい", "きょうし", "がくせい", "かいしゃいん", "しゃいん", "ぎんこういん", "いしゃ", "けんきゅうしゃ",
    "はいしゃ", "こうむいん", "えきいん", "ゆうびんきょくいん", "てんいん", "ちょうりし", "りようし", "びようし", "かんごし", "うんてんしゅ", "かしゅ",
  ],
  tempat: [
    "だいがく", "びょういん", "きょうしつ", "しょくどう", "じむしょ", "かいぎしつ", "うけつけ", "へや", "かいしゃ", "うち", "うりば", "レストラン",
    "ロビー", "おてあらい", "トイレ", "かいだん", "エレベーター", "エスカレーター", "ちか", "おくじょう", "ゆうえんち", "もよおしものかいじょう",
  ],
  // Bagian/barang di toko serba ada (Bab 3)
  "barang-toko": [
    "スポーツようひん", "りょこうようひん", "こどものふく", "おもちゃ", "ぶんぼうぐ", "かぐ", "しょっき", "でんかせいひん",
    "しんしふく", "ふじんふく", "アクセサリー", "けしょうひん", "しょくひん",
  ],
  kota: ["ジャカルタ", "バンコク", "ベルリン", "ニューヨーク", "ペキン", "ロサンゼルス", "ロンドン"],
  // "kana@bab" = hanya kata di bab itu (せん/おく punya arti lain di bab lain).
  angka: ["ひゃく", "せん@3", "まん", "おく@25", "はん@4", "ひとつ", "ふたつ", "ひとり", "ふたり"],
  // negara + bahasa (えいご vs イギリス: jebakan bahasa/negara)
  negara: ["アメリカ", "イギリス", "インド", "インドネシア", "かんこく", "ちゅうごく", "ドイツ", "にほん", "フランス", "イタリア", "スイス", "がいこく", "えいご", "にほんご", "おくに"],
  akhiran: ["～さん", "～ちゃん", "～じん", "～さい", "～ご@2", "～かい", "～えん"],
  ungkapan: [
    "はい", "いいえ", "はじめまして", "～からきました", "どうぞよろしくおねがいします", "しつれいですが", "おなまえは",
    "どうぞ", "どうもありがとうございます", "そうですか", "ちがいます", "これからおせわになります", "こちらこそよろしくおねがいします",
    "すみません", "いらっしゃいませ", "そう", "あのう", "えっ", "あ",
    "みせてください", "じゃ", "～をください",
  ],
};

/* Sinonim: kata dalam satu grup artinya (hampir) sama walau teks artinya
   berbeda - tidak pernah saling jadi pengecoh. Kunci = cara baca. */
const tugasSinonim = [
  ["おてあらい", "トイレ"],
  ["おちゃ", "こうちゃ"],
  ["パソコン", "コンピューター"],
  ["おさけ", "ワイン"],
  ["ここ", "こちら"],
  ["そこ", "そちら"],
  ["あそこ", "あちら"],
  ["どこ", "どちら"],
  ["どうも", "どうもありがとうございます"],
  ["しょくどう", "レストラン"],
];
