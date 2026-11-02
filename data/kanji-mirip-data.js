/* Kanji yang bentuknya mirip, untuk pengecoh tugas "Hiragana → Kanji"
   (js/tugas-bab.js). Pengecoh dibuat dengan mengganti SATU huruf kanji
   pada jawaban dengan salah satu kanji miripnya (先生 -> 失生 / 先主),
   seperti soal kanji JLPT. Kanji yang belum ada di sini memakai pengecoh
   biasa (kanji lain sekelompok makna).

   Isi per Bab saat tugas bab itu disusun. Sudah lengkap: Bab 1.
   Semua kanji di daftar harus kanji asli (bukan bentuk karangan). */
const kanjiMiripData = {
  // Bab 1
  私: ["和", "秋", "払"],
  人: ["入", "八", "大"],
  方: ["万", "力", "放"],
  先: ["失", "光", "洗"],
  生: ["主", "星", "牛"],
  教: ["孝", "救", "数"],
  師: ["帥", "獅", "飾"],
  学: ["字", "覚", "栄"],
  会: ["合", "今", "云"],
  社: ["杜", "祉", "礼"],
  員: ["貝", "買", "負"],
  銀: ["根", "眼", "銅"],
  行: ["往", "術", "街"],
  医: ["区", "匠", "矢"],
  者: ["著", "煮", "都"],
  研: ["砂", "形", "石"],
  究: ["空", "突", "窓"],
  大: ["太", "犬", "天"],
  病: ["痛", "疲", "症"],
  院: ["完", "陰", "阮"],
  歳: ["蔵", "成", "威"],
  何: ["河", "可", "荷"],
  来: ["米", "末", "未"],
  願: ["顔", "頭", "原"],
  失: ["先", "矢", "夫"],
  礼: ["札", "社", "乱"],
  名: ["各", "多", "召"],
  前: ["削", "煎", "首"],
  韓: ["幹", "乾", "朝"],
  国: ["困", "固", "図"],
  中: ["申", "虫", "仲"],
  日: ["目", "白", "旧"],
  本: ["木", "体", "末"],
};

/* Bacaan keliru khas untuk tugas "Kanji → Hiragana" (js/tugas-bab.js).
   Pengecoh utama dibuat otomatis (bunyi panjang, tenten, huruf kecil,
   tsu kecil); daftar ini menambah jebakan yang tidak bisa dibuat aturan,
   terutama bacaan ON/KUN lain dari kanji yang sama (来 -> こ/く,
   歳 -> せい, 名前 -> めいぜん). Kunci = tulisan kanji persis seperti di
   data/bab-data.js. JANGAN isi bacaan yang sebenarnya juga benar
   (mis. 日本 にっぽん, あの方 あのほう). */
const bacaanKeliruData = {
  // Bab 1
  私: ["し"],
  あの方: ["あのほお", "あのがだ"],
  お名前は: ["おめいぜんは", "おなまいは", "おみょうまえは"],
  日本: ["にちほん", "にぽん"],
  "～から来ました": ["～からこました", "～からくました", "～かららいました"],
  "～人": ["～じゅん", "～ぢん"],
  どうぞよろしくお願いします: ["どうぞよろしくおがんいします", "どうぞよろしくおねがします"],
  何歳: ["なにさい", "なんせい"],
  "～歳": ["～せい", "～さえ"],
  失礼ですが: ["しつらいですが", "しちれいですが"],
};
