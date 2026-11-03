/* Kelompok makna kosakata untuk pengecoh pilihan ganda (js/tugas-bab.js).
   Kunci = cara baca (kana) persis seperti di data/bab-data.js, berlaku
   untuk kosakata MAUPUN kanji (kanji dicocokkan lewat cara bacanya).

   Pengecoh diambil dulu dari kelompok yang sama di bab yang sama, lalu dari
   kelompok yang sama di bab lain (bab terdekat didahulukan), baru kemudian
   kata yang bentuknya paling mirip. Jadi soal profesi selalu
   berpilihan profesi, negara berpilihan negara, dst.

   PERHATIAN saat menambah kata: jangan taruh dua kata yang artinya sama
   persis/sinonim (mis. おてあらい & トイレ) di kelompok yang sama - kalau
   teks artinya identik memang otomatis disaring, tapi sinonim dengan teks
   berbeda akan membuat soal punya dua jawaban benar.
   Kata yang belum dikelompokkan tetap mendapat pengecoh "mirip bentuk". */
const tugasKategoriKata = {
  "kata-tunjuk": ["これ", "それ", "あれ", "この～", "その～", "あの～", "ここ", "そこ", "あそこ", "こちら", "そちら", "あちら", "どれ", "どの～"],
  "benda-tulis": [
    "ほん", "じしょ", "ざっし", "しんぶん", "ノート", "てちょう", "めいし", "カード", "えんぴつ", "ボールペン", "シャープペンシル",
    "てがみ", "レポート", "はがき", "きって", "ふうとう", "カレンダー", "ポスター",
  ],
  benda: [
    "かぎ", "とけい", "かさ", "かばん", "テレビ", "ラジオ", "カメラ", "コンピューター", "くるま", "つくえ", "いす", "おみやげ",
    "くつ", "ネクタイ", "めがね", "でんわ", "じてんしゃ", "ビデオ", "しゃしん",
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
  tempat: ["だいがく", "びょういん", "きょうしつ", "しょくどう", "じむしょ", "かいぎしつ", "うけつけ", "へや", "かいしゃ", "うち", "うりば", "レストラン"],
  // negara + bahasa (えいご vs イギリス: jebakan bahasa/negara)
  negara: ["アメリカ", "イギリス", "インド", "インドネシア", "かんこく", "ちゅうごく", "ドイツ", "にほん", "フランス", "イタリア", "スイス", "がいこく", "えいご", "にほんご"],
  akhiran: ["～さん", "～ちゃん", "～じん", "～さい", "～ご", "～かい", "～えん"],
  ungkapan: [
    "はい", "いいえ", "はじめまして", "～からきました", "どうぞよろしくおねがいします", "しつれいですが", "おなまえは",
    "どうぞ", "どうもありがとうございます", "そうですか", "ちがいます", "これからおせわになります", "こちらこそよろしくおねがいします",
    "すみません", "いらっしゃいませ", "そう", "あのう", "えっ", "あ",
  ],
};
