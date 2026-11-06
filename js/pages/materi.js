/* Halaman Materi (pages/materi.html): daftar pelajaran Buku 1 (1-25) & Buku 2
   (26-50), pembaca per-pelajaran (mode fokus, tahap pahami/contoh/tugas),
   dan progres. Dibungkus initPage(), dijalankan auth.js setelah login.
   Data teks pelajaran ada di data/materi-grammar-data.js; file ini yang
   merendernya (buildLessonHtml). syncCurriculumDashboard() menyimpan
   progres ke localStorage untuk dibaca Dashboard - lihat
   renderCurriculumSummary() di js/pages/dashboard.js. */
// === Render konten pelajaran (data: data/materi-grammar-data.js) ===
function buildLessonHtml(number, title, items) {
  /* Bentuk item pola: lihat komentar di atas data/materi-grammar-data.js. */
  const renderExample = ([contoh, arti]) =>
    `<div class="grammar-example"><span class="grammar-jp">${contoh}</span><span class="grammar-meaning">${arti}</span></div>`;
  const renderTable = (table) =>
    `<table class="grammar-table"><thead><tr><th></th>${table.headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${table.rows.map((row) => `<tr>${row.map((cell, i) => `<${i === 0 ? "th" : "td"}>${cell}</${i === 0 ? "th" : "td"}>`).join("")}</tr>`).join("")}</tbody></table>`;
  const renderBlock = (b) =>
    `<div class="grammar-block">${b.label ? `<p class="grammar-subhead">${b.label}</p>` : ""}${b.text ? `<p>${b.text}</p>` : ""}${b.figure ? `<figure class="grammar-figure"><img src="../${b.figure.src}" alt="${b.figure.alt}" loading="lazy"></figure>` : ""}${b.table ? renderTable(b.table) : ""}${(b.examples || []).map(renderExample).join("")}${b.note ? `<p class="grammar-important-note">${b.note}</p>` : ""}</div>`;
  const renderPoint = (item, i) => {
    const heading = `<h3><span class="grammar-pola-number">${i + 1}. </span><span class="${item.noBox ? "grammar-pola-plain" : "grammar-pola-box"}">${item.title}</span>${item.suffix ? `<span class="grammar-pola-suffix"> ${item.suffix}</span>` : ""}</h3>`;
    return `<div class="grammar-point">${heading}${item.blocks.map(renderBlock).join("")}</div>`;
  };
  return `<details class="html-lesson"><summary><span class="lesson-number">${number}</span>Pelajaran ${number}: ${title}</summary><div class="html-content">${items.map(renderPoint).join("")}</div></details>`;
}

function installMateriGrammarContent() {
  document.getElementById("materials").innerHTML =
    `<div class="head"><div><div class="eyebrow">Materi pembelajaran HTML lengkap</div><h1>Dasar — Buku 1: Keterangan Tata Bahasa Pelajaran 1–25</h1><p>Setiap pelajaran memuat seluruh poin inti tata bahasa dalam penulisan ulang yang terstruktur untuk web.</p></div></div><div class="html-course"></div>`;
  document.querySelector("#materials .html-course").innerHTML = MATERI_BOOK1_LESSONS.map((l, i) => buildLessonHtml(i + 1, l.title, l.items)).join("");

  /* Buku 2 BUKAN view/nav terpisah lagi ("fitur Kelas" sudah dihapus) -
     section ini ditaruh di DALAM #materials supaya seluruh materi (Buku 1
     dan Buku 2) bisa diakses dari satu tempat: menu "Materi pelajaran".
     id="book2" tetap dipertahankan karena masih dipakai sebagai penanda
     viewId oleh initMaterialLessonPicker di bawah. */
  const bookTwo = document.createElement("section");
  bookTwo.id = "book2";
  bookTwo.innerHTML = `<div class="head"><div><div class="eyebrow">Materi pembelajaran menengah</div><h1>Menengah — Buku 2</h1><p>Pelajaran 26–50 disusun bertahap dari materi tata bahasa Buku 2.</p></div></div><div class="html-course"></div>`;
  document.getElementById("materials").appendChild(bookTwo);
  bookTwo.querySelector(".html-course").innerHTML = MATERI_BOOK2_LESSONS.map((l, i) => buildLessonHtml(i + 26, l.title, l.items)).join("");
}

function initPage() {
// Status target bab (kunci pelajaran) dimuat dari server di latar; daftar
// pelajaran diperbarui otomatis lewat TugasBab.onChange setelah selesai.
TugasBab.init();
// === Pasang konten pelajaran Buku 1 & 2 ===
installMateriGrammarContent();

structureGrammarPoints();

// === Furigana ===
/* Furigana kontekstual untuk contoh materi Buku 1-2. */
const materialFuriganaReadings = {
  "立入禁止": "たちいりきんし", "天気予報": "てんきよほう", "電話番号": "でんわばんごう",
  "会社員": "かいしゃいん",
  "図書館": "としょかん", "説明書": "せつめいしょ", "日本語": "にほんご",
  "郵便局": "ゆうびんきょく", "富士山": "ふじさん", "月曜日": "げつようび",
  "大阪": "おおさか", "昼休み": "ひるやすみ", "大変": "たいへん",
  "広島": "ひろしま", "甲子園": "こうしえん", "北海道": "ほっかいどう", "来週": "らいしゅう",
  "一人": "ひとり", "新幹線": "しんかんせん", "英語": "えいご", "一杯": "いっぱい",
  "公園": "こうえん", "大学": "だいがく", "上手": "じょうず", "下手": "へた",
  "料理": "りょうり", "少し": "すこし", "全然": "ぜんぜん", "誕生日": "たんじょうび",
  "地下": "ちか", "受付": "うけつけ", "千葉県": "ちばけん", "近く": "ちかく",
  "手紙": "てがみ", "中略": "ちゅうりゃく", "外国人": "がいこくじん", "毎晩": "まいばん",
  "1人": "ひとり", "2人": "ふたり", "2日": "ふつか",
  "試験": "しけん", "簡単": "かんたん", "野球": "やきゅう",
  "沖縄": "おきなわ", "美術": "びじゅつ", "注文": "ちゅうもん", "失礼": "しつれい",
  "禁煙": "きんえん", "結婚": "けっこん", "市役所": "しやくしょ", "住所": "じゅうしょ",
  "天気": "てんき", "留学生": "りゅうがくせい", "主婦": "しゅふ", "梅田": "うめだ", "富士": "ふじ",
  "土曜日": "どようび", "日曜日": "にちようび",
  "事務所": "じむしょ", "辞書": "じしょ",
  "心配": "しんぱい", "食堂": "しょくどう", "趣味": "しゅみ", "食事": "しょくじ", "去年": "きょねん",
  "今晩": "こんばん", "相撲": "すもう", "物価": "ぶっか", "空港": "くうこう", "交通": "こうつう",
  "不便": "ふべん", "出張": "しゅっちょう", "留学": "りゅうがく", "試合": "しあい", "意見": "いけん",
  "約束": "やくそく", "用事": "ようじ", "生まれ": "うまれ", "調子": "ちょうし", "病気": "びょうき",
  "散歩": "さんぽ", "交差点": "こうさてん", "体": "からだ", "菓子": "かし", "引っ越し": "ひっこし",
  "洗濯": "せんたく", "掃除": "そうじ",
  "案内": "あんない", "意味": "いみ", "一度": "いちど", "映画": "えいが",
  "音楽": "おんがく", "家族": "かぞく", "荷物": "にもつ", "会議": "かいぎ",
  "会社": "かいしゃ", "学校": "がっこう", "学生": "がくせい", "漢字": "かんじ",
  "京都": "きょうと", "銀行": "ぎんこう", "健康": "けんこう", "元気": "げんき",
  "佐藤": "さとう", "山田": "やまだ", "仕事": "しごと", "資料": "しりょう",
  "写真": "しゃしん", "社長": "しゃちょう", "宿題": "しゅくだい", "新聞": "しんぶん",
  "新しい": "あたらしい", "場合": "ばあい", "生活": "せいかつ", "切符": "きっぷ",
  "先生": "せんせい", "田中": "たなか", "電気": "でんき",
  "電車": "でんしゃ", "電話": "でんわ", "東京": "とうきょう", "奈良": "なら",
  "日本": "にほん", "病院": "びょういん", "普通": "ふつう",
  "部屋": "へや", "部長": "ぶちょう", "便利": "べんり",
  "勉強": "べんきょう", "毎朝": "まいあさ", "毎日": "まいにち", "名前": "なまえ",
  "木村": "きむら", "野菜": "やさい",
  "友達": "ともだち", "有名": "ゆうめい", "予定": "よてい",
  "旅行": "りょこう", "練習": "れんしゅう", "連絡": "れんらく", "時間": "じかん",
  "週間": "しゅうかん", "親切": "しんせつ", "手伝": "てつだ", "何時間": "なんじかん", "何時": "なんじ",
  "神戸": "こうべ", "何ですか": "なんですか", "何人": "なんにん", "何を": "なにを",
  "何の": "なんの", "何か": "なにか", "何が": "なにが",
  "何で": "なんで", "何と": "なんと", "何歳": "なんさい",
  "駅": "えき", "家": "いえ", "花": "はな", "海": "うみ", "靴": "くつ",
  "机": "つくえ", "酒": "さけ", "春": "はる", "人": "ひと", "先": "さき",
  "前": "まえ", "窓": "まど", "中": "なか", "朝": "あさ", "町": "まち",
  "猫": "ねこ", "箱": "はこ", "物": "もの", "文": "ぶん",
  "母": "はは", "本": "ほん", "友": "とも", "手": "て", "雨": "あめ",
  "安": "やす", "歌": "うた", "回": "かい", "間": "あいだ", "形": "かたち",
  "寒": "さむ", "漢": "かん", "語": "ご", "好": "す", "今": "いま", "子": "こ",
  "次": "つぎ", "時": "とき", "上": "うえ", "早": "はや", "切": "き",
  "分": "ふん", "新": "あたら", "覧": "らん", "月": "つき", "日": "ひ",
  "薬": "くすり", "何": "なに", "一": "いち", "雪": "ゆき", "歳": "さい", "暇": "ひま", "辛": "から", "父": "ちち",
  "絵": "え", "彼": "かれ", "所": "ところ", "要": "い", "悪": "わる", "妻": "つま", "川": "かわ",
  "泳": "およ", "釣": "つ", "音": "おと", "右": "みぎ", "小": "ちい", "道": "みち", "渡": "わた", "曲": "ま",
  "呼": "よ", "城": "じょう", "連": "つ", "億": "おく", "円": "えん",
  "方": "かた", "社員": "しゃいん", "鈴木": "すずき", "傘": "かさ",
  "違": "ちが", "階": "かい", "国": "くに", "半": "はん", "馬": "うま", "昼": "ひる",
  "借": "か", "習": "なら", "金": "かね", "山": "やま", "嫌": "きら", "車": "くるま",
  "桜": "さくら", "男": "おとこ", "犬": "いぬ", "隣": "となり", "屋": "や", "会": "あ",
  "台": "だい", "枚": "まい", "年": "ねん", "大": "おお", "涼": "すず",
  "秋": "あき", "背": "せ", "弟": "おとうと", "赤": "あか",
  "欲": "ほ", "痛": "いた", "祭": "まつ", "冬": "ふゆ", "願": "ねが", "塩": "しお", "取": "と",
  "撮": "と", "住": "す", "作": "つく", "売": "う", "妹": "いもうと", "番": "ばん", "乗": "の",
  "浴": "あ", "茶": "ちゃ", "若": "わか", "狭": "せま", "終": "お", "髪": "かみ", "遊": "あそ",
  "長": "なが", "青": "あお", "黒": "くろ",
  "飲": "の", "押": "お", "開": "あ", "帰": "かえ", "起": "お", "休": "やす",
  "吸": "す", "教": "おし", "見": "み", "言": "い", "古": "ふる", "考": "かんが",
  "行": "い", "降": "ふ", "高": "たか", "座": "すわ", "使": "つか", "始": "はじ",
  "思": "おも", "止": "と", "試": "ため", "持": "も",
  "出": "で", "暑": "あつ", "書": "か", "食": "た", "寝": "ね",
  "静": "しず", "洗": "あら", "送": "おく", "続": "つづ", "貸": "か",
  "知": "し", "置": "お", "遅": "おく", "伝": "つた", "登": "のぼ", "働": "はたら", "返": "かえ", "払": "はら",
  "読": "よ", "入": "はい", "買": "か", "聞": "き", "閉": "し", "歩": "ある",
  "忘": "わす", "忙": "いそが", "話": "はな", "来": "き", "楽": "たの",
  // Pelajaran 26
  "気分": "きぶん", "頭": "あたま", "湯": "ゆ", "紹介": "しょうかい", "見学": "けんがく",
  "国会議事堂": "こっかいぎじどう", "直接": "ちょくせつ",
  // Pelajaran 27
  "換": "か", "新宿": "しんじゅく", "黒沢": "くろさわ", "時計": "とけい", "修理": "しゅうり", "字": "じ",
  // Pelajaran 28
  "弾": "ひ", "中国語": "ちゅうごくご", "経験": "けいけん", "値段": "ねだん", "魚": "さかな", "店": "みせ",
  "将来": "しょうらい", "小説家": "しょうせつか", "小説": "しょうせつ", "人気": "にんき",
  "疲": "つか", "寂": "さび", "田舎": "いなか", "空": "そら", "思い出": "おもいだ",
  // Pelajaran 29
  "割": "わ", "壊": "こわ", "落": "お", "故障": "こしょう", "財布": "さいふ", "交番": "こうばん",
  "来月": "らいげつ", "本社": "ほんしゃ", "転勤": "てんきん", "途中": "とちゅう", "係員": "かかりいん",
  "展覧会": "てんらんかい", "恋人": "こいびと",
  // Pelajaran 30
  "今月": "こんげつ", "元": "もと", "戻": "もど", "道具": "どうぐ", "片": "かた", "水泳": "すいえい",
  // Pelajaran 31
  "週末": "しゅうまつ", "何曜日": "なんようび", "答": "こた", "申し込": "もうしこ",
  // Pelajaran 32
  "運動": "うんどう", "熱": "ねつ", "寺": "てら", "合格": "ごうかく", "合": "あ",
  "調": "しら", "万円": "まんえん", "万": "まん",
  // Pelajaran 33
  "逃": "に", "頑張": "がんば", "負": "ま", "洗濯機": "せんたくき", "渡辺": "わたなべ",
  // Pelajaran 34
  "線": "せん", "紙": "かみ", "組": "く", "立": "た",
  // Pelajaran 35
  "都合": "つごう", "向": "む", "島": "しま", "鉛筆": "えんぴつ", "無理": "むり", "金曜日": "きんようび",
  "温泉": "おんせん", "白馬": "はくば",
  // Pelajaran 36
  "速": "はや", "自転車": "じてんしゃ", "日本人": "にほんじん", "牛肉": "ぎゅうにく", "豚肉": "ぶたにく",
  "歯": "は", "甘": "あま", "絶対": "ぜったい",
  // Pelajaran 37
  "褒": "ほ", "頼": "たの", "世紀": "せいき", "発明": "はつめい", "世界中": "せかいじゅう", "麦": "むぎ",
  "造": "つく", "昔": "むかし", "木": "き", "原料": "げんりょう", "開か": "ひらか",
  // Pelajaran 38
  "育": "そだ", "牛乳": "ぎゅうにゅう", "初": "はじ", "村": "むら",
  // Pelajaran 39
  "複雑": "ふくざつ", "事故": "じこ", "授業": "じゅぎょう", "危": "あぶ", "機械": "きかい", "触": "さわ",
  "地震": "じしん", "倒": "たお", "実は": "じつは",
  // Pelajaran 40
  "便": "びん", "到着": "とうちゃく", "祝": "いわ", "覚": "おぼ", "忘年会": "ぼうねんかい", "出席": "しゅっせき",
  "返事": "へんじ", "測": "はか", "橋": "はし", "20日": "はつか",
  // Pelajaran 41
  "土産": "みやげ", "娘": "むすめ", "息子": "むすこ", "課長": "かちょう", "直": "なお", "奥": "おく",
  "飛行機": "ひこうき", "機": "き", "皿": "さら", "人形": "にんぎょう", "結婚祝": "けっこんいわ",
  // Pelajaran 42
  "自分": "じぶん", "貯金": "ちょきん", "走": "はし", "建": "た", "弁護士": "べんごし",
  "法律": "ほうりつ", "半分": "はんぶん", "安藤百福": "あんどうももふく",
  // Pelajaran 43
  "咲": "さ", "彼女": "かのじょ", "丈夫": "じょうぶ", "台所": "だいどころ", "弁当": "べんとう",
  // Pelajaran 44
  "最近": "さいきん", "操作": "そうさ", "運転": "うんてん", "白": "しろ", "汚": "よご", "洗濯物": "せんたくもの",
  "乾": "かわ", "砂糖": "さとう", "安全": "あんぜん", "量": "りょう",
  // Pelajaran 45
  "会場": "かいじょう", "領収書": "りょうしゅうしょ", "必要": "ひつよう", "火事": "かじ",
  // Pelajaran 46
  "原因": "げんいん", "先月": "せんげつ", "先週": "せんしゅう",
  // Pelajaran 47
  "大勢": "おおぜい", "集": "あつ", "救急車": "きゅうきゅうしゃ", "声": "こえ", "味": "あじ",
  // Pelajaran 48
  "自由": "じゆう", "右側": "みぎがわ", "準備": "じゅんび", "生徒": "せいと", "説明": "せつめい", "結婚式": "けっこんしき",
  // Pelajaran 49
  "中村": "なかむら", "研究室": "けんきゅうしつ", "召し上": "めしあ", "注意": "ちゅうい", "奥様": "おくさま", "下が": "さが",
  "忘れ物": "わすれもの", "尊敬語": "そんけいご", "敬語": "けいご", "熱心": "ねっしん",
  // Pelajaran 50
  "重": "おも", "私": "わたくし", "兄": "あに", "江戸東京博物館": "えどとうきょうはくぶつかん", "目": "め", "伺": "うかが",
  "申": "もう", "参": "まい", "謙譲語": "けんじょうご",
};

const materialFuriganaEntries = Object.entries(materialFuriganaReadings).sort(
  ([left], [right]) => right.length - left.length,
);

/* Beberapa kanji kata bantu bilangan punya bacaan berbeda dari bacaan
   berdiri sendiri di kamus (materialFuriganaReadings) begitu ditempeli
   angka/tanda placeholder（－）di depannya - kamus di atas cuma simpan SATU
   bacaan per kanji, jadi kasus-kasus ini perlu override sesuai konteks:
   - 時: berdiri sendiri "waktu" = とき, tapi jadi kata bantu jam = じ
     (7時 = しちじ).
   - 人: berdiri sendiri "orang" = ひと, tapi jadi kata bantu jumlah orang
     = にん (5人 = ごにん). 1人／2人 tidak beraturan (ひとり／ふたり) jadi
     punya entri gabungan sendiri di kamus, bukan lewat fungsi ini.
   - 日: berdiri sendiri "hari/matahari" = ひ, tapi jadi kata bantu jumlah
     hari = にち (－日 = にち, Lihat Pel.11).
   - 月: berdiri sendiri "bulan (benda langit)" = つき, tapi jadi kata
     bantu bulan-dalam-tanggal = がつ (3月 = さんがつ) atau kata bantu
     jangka waktu = げつ kalau menempel ke か (２か月 = にかげつ).
   - 来: Kata Kerja Kelompok III tidak beraturan - bentuk ます/て memakai
     bacaan き (来ます, 来て), bentuk ない memakai bacaan こ
     (来ない = こない, Lihat Pel.17), sedangkan bentuk kamus memakai
     bacaan く (来る = くる, Lihat Pel.18), jadi perlu dicek huruf
     SESUDAHnya.
   - 回: berdiri sendiri/sebagai kata bantu bilangan (何回, 二回) = かい,
     tapi jadi Kata Kerja 回す "memutar" = まわ (Lihat Pel.23) kalau
     langsung diikuti す - dicek huruf SESUDAHnya juga. */
function resolveCounterReading(word, text, cursor) {
  const prev = text[cursor - 1] || "";
  const isDigitOrDash = /[0-9０-９－]/.test(prev);
  if (word === "時" && isDigitOrDash) return "じ";
  if (word === "人" && isDigitOrDash) return "にん";
  if (word === "日" && isDigitOrDash) return "にち";
  if (word === "月") {
    if (prev === "か") return "げつ";
    if (isDigitOrDash) return "がつ";
  }
  if (word === "来") {
    const next = text[cursor + word.length];
    if (next === "な" || next === "い" || next === "ら") return "こ";
    if (next === "る" || next === "れ") return "く";
  }
  if (word === "回" && text[cursor + word.length] === "す") return "まわ";
  // 曲 default "ま" (曲がる); kata benda 曲（lagu）dibaca きょく.
  if (word === "曲" && !(text[cursor + 1] === "が" && /[っらりるれろ]/.test(text[cursor + 2] || ""))) return "きょく";
  return null;
}

function createMaterialFuriganaFragment(text) {
  const fragment = document.createDocumentFragment();
  let cursor = 0;
  while (cursor < text.length) {
    const match = materialFuriganaEntries.find(([word]) =>
      text.startsWith(word, cursor),
    );
    if (!match) {
      fragment.append(document.createTextNode(text[cursor]));
      cursor++;
      continue;
    }
    const [word, defaultReading] = match;
    const reading = resolveCounterReading(word, text, cursor) ?? defaultReading;
    const ruby = document.createElement("ruby");
    ruby.className = "material-furigana";
    ruby.append(document.createTextNode(word));
    const rt = document.createElement("rt");
    rt.textContent = reading;
    ruby.appendChild(rt);
    fragment.appendChild(ruby);
    cursor += word.length;
  }
  return fragment;
}

function addMaterialFurigana(element, directTextOnly = false) {
  if (!element) return;
  let nodes;
  if (directTextOnly) {
    nodes = Array.from(element.childNodes).filter(
      (node) => node.nodeType === Node.TEXT_NODE,
    );
  } else {
    nodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.parentElement?.closest("ruby, rt")
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      },
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
  }
  nodes.forEach((node) => {
    if (!/[\u3400-\u9fff]/.test(node.nodeValue || "")) return;
    node.replaceWith(createMaterialFuriganaFragment(node.nodeValue));
  });
}

// === Sinkronisasi dashboard (progres Buku 1/2) ===
/* Pilihan materi Buku 1 dan Buku 2: masing-masing 25 pelajaran dalam kisi 5 x 5. */
/* Query mandiri (bukan dari closure initMaterialLessonPicker) supaya
   dashboard bisa hitung progres Buku 1/2 kapan saja tanpa bergantung
   urutan pemanggilan initMaterialLessonPicker. Jumlah pola per pelajaran
   dihitung langsung dari DOM (sama seperti patternCounts di
   initMaterialLessonPicker), lalu diagregasi lewat srsLessonStatus yang
   sama supaya kedua tempat selalu konsisten. */
function materiStatusesForBook(bookNumber) {
  const viewId = bookNumber === 1 ? "materials" : "book2";
  const courseEl = document.getElementById(viewId)?.querySelector(".html-course");
  const lessonEls = courseEl ? Array.from(courseEl.querySelectorAll(":scope > .html-lesson")) : [];
  return Array.from({ length: 25 }, (_, index) => {
    const patternCount =
      lessonEls[index]?.querySelectorAll(".grammar-point").length || 0;
    return srsLessonStatus(bookNumber, index, patternCount);
  });
}

function syncCurriculumDashboard() {
  const bookOne = materiStatusesForBook(1);
  const bookTwo = materiStatusesForBook(2);
  const bookOneDone = bookOne.filter((status) => status === "done").length;
  const bookTwoDone = bookTwo.filter((status) => status === "done").length;
  const totalDone = bookOneDone + bookTwoDone;
  const bookOnePercent = Math.round((bookOneDone / 25) * 100);
  const bookTwoPercent = Math.round((bookTwoDone / 25) * 100);
  const totalPercent = Math.round((totalDone / 50) * 100);

  // Dashboard adalah halaman terpisah sekarang (index.html) - tidak ada
  // lagi #dashboard di dokumen ini untuk ditulis langsung. Simpan hasilnya
  // ke localStorage; dashboard membaca cache ini lewat
  // renderCurriculumSummary() (js/pages/dashboard.js) setiap kali dibuka.
  try {
    localStorage.setItem(
      "nihonBenkyoCurriculumSummaryV1",
      JSON.stringify({ bookOnePercent, bookTwoPercent, totalPercent, totalDone }),
    );
  } catch {
    // Penyimpanan browser tidak tersedia - dashboard tetap tampil 0%, tidak fatal.
  }
}

// === Lesson picker & pembaca materi ===
function initMaterialLessonPicker({
  viewId,
  startNumber,
  bookNumber,
  progressKey,
}) {
  const materialsView = document.getElementById(viewId);
  const sourceCourse = materialsView?.querySelector(".html-course");
  if (!materialsView || !sourceCourse) return;
  const endNumber = startNumber + 24;

  const lessons = Array.from(
    sourceCourse.querySelectorAll(":scope > .html-lesson"),
  ).filter((lesson) => lesson.querySelector("summary") && lesson.querySelector(".html-content"));
  if (lessons.length !== 25) return;
  /* Dihitung SEKALI di sini, sebelum selectLesson() mulai memindah-mindah
     .html-content antara lessons[] dan reader - supaya jumlah pola per
     pelajaran tetap akurat berapa pun lesson yang sedang aktif. */
  const patternCounts = lessons.map(
    (lesson) => lesson.querySelectorAll(".grammar-point").length,
  );

  const picker = document.createElement("section");
  picker.className = "material-picker";
  picker.setAttribute("aria-labelledby", `materialPickerTitle-${viewId}`);
  picker.innerHTML =
    `<div class="material-picker-heading"><div><div class="eyebrow">Daftar pelajaran</div><h2 id="materialPickerTitle-${viewId}">Pilih Materi Pembelajaran</h2></div><p>Pelajaran ${startNumber}–${endNumber} tersusun dalam 5 kolom dan 5 baris.</p></div><div class="material-choice-grid" role="tablist" aria-label="Pilihan Pelajaran ${startNumber} sampai ${endNumber}"></div>`;

  const reader = document.createElement("section");
  reader.className = "material-reader";
  reader.id = `materialLessonReader-${viewId}`;
  reader.setAttribute("role", "tabpanel");
  reader.setAttribute("tabindex", "-1");
  reader.innerHTML =
    `<div class="material-reader-toolbar"><button type="button" class="material-back-list">↑ Daftar pelajaran</button><span class="material-reader-position">Pelajaran ${startNumber} dari ${endNumber}</span><button type="button" class="material-furigana-toggle active" aria-pressed="true">振 Furigana aktif</button><button type="button" class="material-focus-toggle" aria-pressed="false">⛶ Mode fokus</button></div><header class="material-reader-head"><div><div class="eyebrow material-reader-number"></div><h2 class="material-reader-title"></h2><p>Seluruh pola, penjelasan, dan contoh asli tetap ditampilkan.</p></div><span class="material-study-time">◷ 8–15 menit</span></header><div class="material-learning-steps" role="tablist" aria-label="Tahapan belajar"><button type="button" class="material-step active" data-material-step="patterns" role="tab" aria-selected="true"><b>1</b>Pahami semua pola</button><button type="button" class="material-step" data-material-step="examples" role="tab" aria-selected="false"><b>2</b>Pelajari contoh</button><button type="button" class="material-step material-step-tugas" data-material-step="tugas" role="tab" aria-selected="false"><b>3</b>Tugas &amp; target</button></div><div class="material-lock-notice" hidden></div><div class="material-completeness">✓ Materi lengkap—tidak ada pola yang dikurangi.</div><div class="material-reader-body material-step-panel" data-material-panel="patterns"></div><section class="material-example-study material-step-panel" data-material-panel="examples" hidden></section><section class="material-tugas-study material-step-panel" data-material-panel="tugas" hidden></section><footer class="material-reader-actions"><button type="button" class="material-secondary-action material-previous">← Sebelumnya</button><div><button type="button" class="material-repeat-action material-mark-repeat">Perlu diulang</button><button type="button" class="material-primary-action material-mark-understood">Sudah paham ✓</button></div><button type="button" class="material-secondary-action material-next">Berikutnya →</button></footer>`;

  const progressPanel = document.createElement("aside");
  progressPanel.className = "material-progress-panel";
  progressPanel.innerHTML =
    `<div class="material-progress-ring" style="--material-progress:0%"><div><b class="material-progress-percent">0%</b><span>selesai</span></div></div><h2>Perjalanan Buku ${bookNumber}</h2><p>Progres dihitung dari materi yang sudah Anda tandai sebagai dipahami.</p><div class="material-progress-stats"><span><i class="status-dot done"></i><b class="material-done-count">0</b> Dikuasai</span><span><i class="status-dot repeat"></i><b class="material-repeat-count">0</b> Ulangi</span><span><i class="status-dot new"></i><b class="material-new-count">25</b> Belum mulai</span></div><div class="material-recommendation"><span>REKOMENDASI BERIKUTNYA</span><b class="material-recommendation-title">Pelajaran ${startNumber}</b><p class="material-recommendation-text"></p><button type="button" class="material-recommendation-button">Mulai belajar</button></div>`;

  const learningLayout = document.createElement("div");
  learningLayout.className = "material-learning-layout";
  const learningMain = document.createElement("div");
  learningMain.className = "material-learning-main";

  const grid = picker.querySelector(".material-choice-grid");
  const readerNumber = reader.querySelector(".material-reader-number");
  const readerTitle = reader.querySelector(".material-reader-title");
  const readerBody = reader.querySelector(".material-reader-body");
  const exampleStudy = reader.querySelector(".material-example-study");
  const tugasStudy = reader.querySelector(".material-tugas-study");
  const lockNotice = reader.querySelector(".material-lock-notice");
  function materiSrsId(index, patternIndex) {
    return `materi:book${bookNumber}:${index}:${patternIndex}`;
  }
  /* Status pelajaran diagregasi dari status semua POLA di dalamnya
     (srsLessonStatus, srs.js) - bukan lagi satu id per pelajaran, supaya
     "sudah paham" tidak lagi all-or-nothing padahal satu pelajaran berisi
     beberapa pola berbeda. Rating per-pola sendiri ada di setiap
     .grammar-point (lihat createRatingControls, app-effects.js). */
  function lessonStatusFor(index) {
    return srsLessonStatus(bookNumber, index, patternCounts[index]);
  }
  const buttons = [];
  let activeIndex = -1;
  let activeContent = null;

  lessons.forEach((lesson, lessonIndex) => {
    const lessonNumber = startNumber + lessonIndex;
    const summaryText = lesson
      .querySelector("summary")
      .textContent.replace(/^\s*\d+\s*/, "")
      .replace(/^Pelajaran\s+\d+\s*:\s*/i, "")
      .trim();
    const button = document.createElement("button");
    button.type = "button";
    button.className = "material-choice";
    button.id = `materialChoice-${viewId}-${lessonNumber}`;
    button.dataset.lesson = String(lessonIndex);
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", reader.id);
    button.setAttribute("aria-selected", "false");

    const number = document.createElement("span");
    number.className = "material-choice-number";
    number.textContent = String(lessonNumber).padStart(2, "0");
    const label = document.createElement("span");
    label.className = "material-choice-label";
    label.textContent = summaryText;
    const statusDot = document.createElement("i");
    statusDot.className = "material-choice-status";
    statusDot.setAttribute("aria-hidden", "true");
    const statusLabel = document.createElement("small");
    statusLabel.className = "material-choice-state";
    button.append(number, statusDot, label, statusLabel);
    grid.appendChild(button);
    buttons.push(button);
  });

  function updateMaterialProgress() {
    const statuses = Array.from({ length: 25 }, (_, index) => lessonStatusFor(index));
    const done = statuses.filter((status) => status === "done").length;
    const repeat = statuses.filter((status) => status === "repeat").length;
    const fresh = 25 - done - repeat;
    const percent = Math.round((done / 25) * 100);
    progressPanel.querySelector(".material-done-count").textContent = done;
    progressPanel.querySelector(".material-repeat-count").textContent = repeat;
    progressPanel.querySelector(".material-new-count").textContent = fresh;
    progressPanel.querySelector(".material-progress-percent").textContent =
      `${percent}%`;
    progressPanel
      .querySelector(".material-progress-ring")
      .style.setProperty("--material-progress", `${percent}%`);

    /* Rekomendasi: pelajaran terbuka yang belum tuntas targetnya (titik
       belajar siswa); kalau semua pelajaran buku ini tuntas, pakai status
       SRS (yang perlu diulang dulu, lalu yang belum dimulai). */
    const unlocked = (index) => !TugasBab.isLocked(startNumber + index);
    const frontier = TugasBab.frontierBab() - startNumber;
    const repeatIndex = statuses.findIndex(
      (status, index) => status === "repeat" && unlocked(index),
    );
    const nextIndex =
      frontier >= 0 && frontier <= 24 && !TugasBab.isComplete(startNumber + frontier)
        ? frontier
        : repeatIndex >= 0
          ? repeatIndex
          : statuses.findIndex((status, index) => status === "new" && unlocked(index));
    const recommended = nextIndex >= 0 ? nextIndex : 24;
    const recommendedTitle = buttons[recommended]
      .querySelector(".material-choice-label")
      .textContent;
    progressPanel.querySelector(".material-recommendation-title").textContent =
      `Pelajaran ${startNumber + recommended}`;
    progressPanel.querySelector(".material-recommendation-text").textContent =
      recommendedTitle;
    progressPanel.querySelector(".material-recommendation-button").onclick =
      () => selectLesson(recommended, true);

    buttons.forEach((button, index) => {
      const status = statuses[index];
      const lessonNumber = startNumber + index;
      const locked = TugasBab.isLocked(lessonNumber);
      const targetDone = TugasBab.isComplete(lessonNumber);
      button.classList.toggle("done", status === "done");
      button.classList.toggle("repeat", status === "repeat");
      button.classList.toggle("locked", locked);
      button.classList.toggle("target-done", targetDone);
      button.querySelector(".material-choice-state").textContent = locked
        ? "🔒 Terkunci"
        : targetDone
          ? "✓ Target selesai"
          : status === "done"
            ? "Sudah dipahami"
            : status === "repeat"
              ? "Perlu diulang"
              : "Belum dimulai";
    });
    applyLockState();
  }

  /* Pelajaran terkunci tetap bisa dipilih, tapi isinya diganti
     pemberitahuan (CSS .material-reader.is-locked menyembunyikan tahap &
     materi). Kunci hanya berlaku untuk siswa - lihat js/tugas-bab.js. */
  function applyLockState() {
    if (activeIndex < 0) return;
    const lessonNumber = startNumber + activeIndex;
    const locked = TugasBab.isLocked(lessonNumber);
    reader.classList.toggle("is-locked", locked);
    lockNotice.hidden = !locked;
    if (locked) {
      const prev = lessonNumber - 1;
      const p = TugasBab.progress(prev);
      lockNotice.innerHTML = `<b>🔒 Pelajaran ${lessonNumber} masih terkunci.</b><p>Selesaikan target Pelajaran ${prev} dulu: tandai materinya sudah paham, kerjakan semua ${p.totalTugas} tugas, dan capai rata-rata nilai minimal ${TugasBab.KKM}. Saat ini: ${p.dikerjakan}/${p.totalTugas} tugas dikerjakan, rata-rata ${p.rataRata}.</p><p>Yang masih kurang: ${TugasBab.kekurangan(prev).join("; ")}.</p>${activeIndex > 0 ? `<button type="button" class="primary">Buka Pelajaran ${prev}</button>` : ""}`;
      const openPrev = lockNotice.querySelector("button");
      if (openPrev)
        openPrev.onclick = () => {
          selectLesson(activeIndex - 1, true);
          setMaterialStep("tugas");
        };
    } else if (
      !tugasStudy.hidden &&
      tugasStudy.dataset.tugasBab === String(lessonNumber) &&
      !tugasStudy.querySelector(".tugas-quiz, .tugas-result")
    ) {
      // Daftar tugas yang sedang tampil ikut diperbarui (mis. setelah sinkron server).
      renderTugas();
    }
  }

  function renderTugas() {
    TugasBab.renderPanel(tugasStudy, startNumber + activeIndex, {
      onMateri: markUnderstood,
      onBukaMateri: () => {
        setMaterialStep("patterns");
        reader.scrollIntoView({ block: "start" });
      },
    });
  }

  /* "Sudah paham ✓": tandai semua pola + catat target materi, lalu arahkan
     ke tahap Tugas (bukan langsung ke pelajaran berikutnya, karena
     pelajaran berikutnya baru terbuka setelah tugas selesai). */
  function markUnderstood() {
    setLessonStatus(activeIndex, "good");
    TugasBab.recordMateri(startNumber + activeIndex);
    setMaterialStep("tugas");
    reader
      .querySelector(".material-learning-steps")
      .scrollIntoView({ block: "start", behavior: "smooth" });
  }

  /* Jalan pintas "tandai semua pola pelajaran ini sekaligus" (tombol bar
     bawah reader) - siswa yang mau presisi tetap bisa menilai tiap pola
     satu-satu lewat tombol rating di masing-masing .grammar-point.
     outcome: "again" (Perlu diulang) atau "good" (Sudah paham) */
  function setLessonStatus(index, outcome) {
    const content = lessons[index]?.querySelector(".html-content") || activeContent;
    const points = content
      ? Array.from(content.querySelectorAll(".grammar-point"))
      : [];
    points.forEach((point, patternIndex) => {
      const id = materiSrsId(index, patternIndex);
      srsReview(id, outcome);
      if (typeof refreshPatternStatus === "function") refreshPatternStatus(point, id);
    });
    updateMaterialProgress();
    syncCurriculumDashboard();
  }

  /* Ambil SEMUA contoh kalimat (bukan cuma satu contoh representatif per
     pola seperti sebelumnya) dari .html-content pelajaran yang SEDANG
     AKTIF - dipakai baik oleh "Pelajari Contoh" (semua contoh ditampilkan
     apa adanya) maupun "Kerjakan Latihan" (sumber kalimat & arti untuk
     soal). Karena selalu dibangun dari activeContent bab yang dibuka,
     kedua tahap ini otomatis memakai materi bab itu sendiri - bukan bab
     lain atau kalimat karangan generik. */
  function htmlToFlatText(html) {
    return html
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // ①-⑳ (U+2460-2473) cukup untuk 20 nomor pertama, tapi beberapa bab
  // (mis. Pelajaran 10) hitungan contohnya tembus 21 - lanjutannya
  // (㉑-㊳ dst.) dipakai Unicode blok BERBEDA (U+3251-325F, 32B1-32BF),
  // bukan lanjutan blok yang sama, jadi harus disebut eksplisit di sini.
  const CIRCLED_NUMBER_PREFIX = /^[①-⑳㉑-㉟㊱-㊿]\s*/;

  function getAllExamplesData(content) {
    const results = [];
    content.querySelectorAll(":scope > .grammar-point").forEach((point) => {
      const titleClone = point.querySelector("h3")?.cloneNode(true);
      titleClone?.querySelectorAll("rt").forEach((reading) => reading.remove());
      const pattern = (titleClone?.textContent || "Pola").replace(/^\d+\.\s*/, "").trim();
      point.querySelectorAll(".grammar-example").forEach((example) => {
        const jpClone = example.querySelector(".grammar-jp")?.cloneNode(true);
        const meaningClone = example.querySelector(".grammar-meaning")?.cloneNode(true);
        jpClone?.querySelectorAll("rt").forEach((reading) => reading.remove());
        meaningClone?.querySelectorAll("rt").forEach((reading) => reading.remove());
        /* .grammar-annotation: label editorial di bawah kalimat (mis.
           "(frase Kata Benda)" di Pelajaran 18 pola 2) yang di buku sumber
           menunjuk ke bagian kalimat tertentu, bukan bagian dari kalimat
           itu sendiri - kalau ikut masuk ke japaneseText/japaneseClean,
           soal susun-kalimat/partikel/cerita ikut memecah token dari teks
           label ini juga. Dibuang sebelum flatten, sama seperti rt. */
        jpClone?.querySelectorAll(".grammar-annotation").forEach((el) => el.remove());
        const japaneseHtml = jpClone?.innerHTML.trim() || "";
        const meaningHtml = meaningClone?.innerHTML.trim() || "";
        if (!japaneseHtml || !meaningHtml) return;
        const japaneseText = htmlToFlatText(japaneseHtml);
        results.push({
          pattern,
          japaneseHtml,
          meaningHtml,
          japaneseText,
          meaningText: htmlToFlatText(meaningHtml),
          japaneseClean: japaneseText.replace(CIRCLED_NUMBER_PREFIX, ""),
          isNumberedSentence: CIRCLED_NUMBER_PREFIX.test(japaneseText),
        });
      });
    });
    return results;
  }

  function buildExampleStudy(content) {
    const examples = getAllExamplesData(content);
    exampleStudy.innerHTML =
      '<header class="material-study-section-head"><div class="eyebrow">TAHAP 2 · PELAJARI CONTOH</div><h3>Amati penggunaan setiap pola.</h3><p>Seluruh contoh kalimat pelajaran ini ditampilkan di sini - baca kalimat Jepangnya dengan suara keras, lalu periksa artinya.</p></header>';
    const list = document.createElement("div");
    list.className = "material-example-list";
    examples.forEach((example, index) => {
      const card = document.createElement("article");
      card.className = "material-example-card";
      const number = document.createElement("span");
      number.className = "material-example-number";
      number.textContent = `CONTOH ${String(index + 1).padStart(2, "0")}`;
      const title = document.createElement("h4");
      title.textContent = example.pattern;
      addMaterialFurigana(title);
      const japanese = document.createElement("p");
      japanese.className = "material-example-japanese";
      japanese.innerHTML = example.japaneseHtml;
      addMaterialFurigana(japanese);
      const meaning = document.createElement("p");
      meaning.className = "material-example-meaning";
      meaning.innerHTML = example.meaningHtml;
      card.append(number, title, japanese, meaning);
      list.appendChild(card);
    });
    exampleStudy.appendChild(list);
  }

  function setMaterialStep(step) {
    reader.querySelectorAll(".material-step").forEach((button) => {
      const isActive = button.dataset.materialStep === step;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
    reader.querySelectorAll(".material-step-panel").forEach((panel) => {
      panel.hidden = panel.dataset.materialPanel !== step;
    });
    if (step === "tugas") renderTugas();
  }

  function selectLesson(nextIndex, shouldScroll = false) {
    const lesson = lessons[nextIndex];
    const nextContent = lesson?.querySelector(".html-content");
    if (!lesson || !nextContent || nextIndex === activeIndex) return;

    if (activeContent && activeIndex >= 0)
      lessons[activeIndex].appendChild(activeContent);

    activeIndex = nextIndex;
    activeContent = nextContent;
    const summaryText = lesson
      .querySelector("summary")
      .textContent.replace(/^\s*\d+\s*/, "")
      .trim();
    const currentNumber = startNumber + nextIndex;
    readerNumber.textContent = `Materi ${String(currentNumber).padStart(2, "0")} · Buku ${bookNumber}`;
    reader.querySelector(".material-reader-position").textContent =
      `Pelajaran ${currentNumber} dari ${endNumber}`;
    readerTitle.textContent = summaryText;
    readerBody.replaceChildren(activeContent);
    buildExampleStudy(activeContent);
    /* directTextOnly (true) HANYA memindai text node ANAK LANGSUNG elemen
       - cocok untuk struktur lama tempat teks Jepang langsung jadi anak
       .grammar-example. Sejak .grammar-example dipecah jadi
       <span class="grammar-jp"> + <span class="grammar-meaning"> (supaya
       kolom Jepang/arti sejajar meniru buku), teks Jepang jadi CUCU, bukan
       anak langsung, lagi - directTextOnly=true jadi tidak pernah
       menemukan apa-apa dan furigana di Tahap 1 (Pahami Pola) diam-diam
       berhenti muncul. Pakai penelusuran penuh (false, TreeWalker) supaya
       tetap ketemu walau nested; .grammar-meaning ikut terlewati tapi
       aman karena teks Indonesia tidak pernah cocok pola kanji. */
    activeContent
      .querySelectorAll(".grammar-japanese-example")
      .forEach((example) => addMaterialFurigana(example));
    activeContent
      .querySelectorAll(
        ".grammar-point > h3, .grammar-short-explanation, .grammar-subhead, .grammar-important-note, .grammar-table td, .grammar-table th",
      )
      .forEach((section) => addMaterialFurigana(section));
    tugasStudy.replaceChildren();
    delete tugasStudy.dataset.tugasBab;
    setMaterialStep("patterns");
    applyLockState();

    buttons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === nextIndex;
      button.classList.toggle("active", isActive);
      button.classList.toggle("current", isActive);
      button.setAttribute("aria-selected", String(isActive));
      button.tabIndex = isActive ? 0 : -1;
    });
    reader.querySelector(".material-previous").disabled = nextIndex === 0;
    reader.querySelector(".material-next").disabled = nextIndex === 24;

    if (shouldScroll) {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      reader.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  }

  buttons.forEach((button, buttonIndex) => {
    button.onclick = () => selectLesson(buttonIndex, true);
    button.onkeydown = (event) => {
      let nextIndex = buttonIndex;
      if (event.key === "ArrowRight") nextIndex = Math.min(24, buttonIndex + 1);
      else if (event.key === "ArrowLeft") nextIndex = Math.max(0, buttonIndex - 1);
      else if (event.key === "ArrowDown") nextIndex = Math.min(24, buttonIndex + 5);
      else if (event.key === "ArrowUp") nextIndex = Math.max(0, buttonIndex - 5);
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = 24;
      else return;
      event.preventDefault();
      buttons[nextIndex].focus();
      selectLesson(nextIndex);
    };
  });

  sourceCourse.classList.add("material-source-hidden");
  sourceCourse.insertAdjacentElement("beforebegin", learningLayout);
  learningLayout.append(progressPanel, learningMain);
  learningMain.append(picker, sourceCourse, reader);
  reader.querySelector(".material-back-list").onclick = () =>
    picker.scrollIntoView({ behavior: "smooth", block: "start" });
  reader.querySelector(".material-previous").onclick = () =>
    selectLesson(Math.max(0, activeIndex - 1), true);
  reader.querySelector(".material-next").onclick = () =>
    selectLesson(Math.min(24, activeIndex + 1), true);
  reader.querySelector(".material-mark-repeat").onclick = () =>
    setLessonStatus(activeIndex, "again");
  reader.querySelector(".material-mark-understood").onclick = markUnderstood;
  reader.querySelectorAll(".material-step").forEach((button) => {
    button.onclick = () => setMaterialStep(button.dataset.materialStep);
  });
  reader.querySelector(".material-focus-toggle").onclick = () =>
    setMaterialFocusMode(!document.body.classList.contains("focus-mode"));
  reader.querySelector(".material-furigana-toggle").onclick = (event) => {
    const on = reader.classList.toggle("hide-furigana");
    event.currentTarget.classList.toggle("active", !on);
    event.currentTarget.setAttribute("aria-pressed", String(!on));
    event.currentTarget.textContent = on ? "振 Furigana mati" : "振 Furigana aktif";
  };
  /* Diekspos supaya tombol rating per-pola (createRatingControls,
     app-effects.js) bisa memicu refresh grid picker & ring progres buku
     ini segera setelah dinilai, tanpa app-effects.js perlu tahu isi
     closure ini. */
  window.materialProgressRefreshers = window.materialProgressRefreshers || {};
  window.materialProgressRefreshers[bookNumber] = updateMaterialProgress;
  TugasBab.onChange(updateMaterialProgress);
  selectLesson(0);
  updateMaterialProgress();
}

initMaterialLessonPicker({
  viewId: "materials",
  startNumber: 1,
  bookNumber: 1,
  progressKey: "nihonBenkyoLessonStatusV1",
});
initMaterialLessonPicker({
  viewId: "book2",
  startNumber: 26,
  bookNumber: 2,
  progressKey: "nihonBenkyoLessonStatusV2",
});
syncCurriculumDashboard();

/* Siswa pilih Buku 1 atau Buku 2 dulu, baru diarahkan ke materi buku itu
   - bukan langsung menampilkan semua materi sekaligus. Seluruh konten
   Buku 1 yang sudah dibangun di atas (head + picker interaktif) dipindah
   ke satu wrapper (#materialsBook1) supaya bisa disembunyikan/
   ditampilkan sebagai satu kesatuan, sejajar dengan #book2. */
(function initMaterialBookChooser() {
  const materialsEl = document.getElementById("materials");
  const book2El = document.getElementById("book2");
  if (!materialsEl || !book2El) return;

  const book1El = document.createElement("div");
  book1El.id = "materialsBook1";
  Array.from(materialsEl.childNodes).forEach((node) => {
    if (node !== book2El) book1El.appendChild(node);
  });

  const chooser = document.createElement("div");
  chooser.className = "material-book-choice";
  chooser.innerHTML =
    '<div class="head"><div><div class="eyebrow">Silabus mandiri</div><h1>Pilih buku materi.</h1><p>Susunan topik mengikuti progres belajar pemula hingga menengah awal, dengan referensi struktur Minna no Nihongo 1–2.</p></div></div><div class="mode-grid"><article class="card mode"><div class="eyebrow">Pemula · N5</div><h2>Dasar — Buku 1</h2><p>Pelajaran 1–25: pola kalimat dasar, kata kerja, kata sifat, dan kegiatan sehari-hari.</p><button type="button" class="primary" data-choose-book="1">Mulai Buku 1</button></article><article class="card mode"><div class="eyebrow">Menengah awal · N4</div><h2>Menengah — Buku 2</h2><p>Pelajaran 26–50: komunikasi situasional, alasan, dan bentuk kalimat yang lebih luas.</p><button type="button" class="primary" data-choose-book="2">Mulai Buku 2</button></article></div>';

  const backButtonHtml = '<button type="button" class="secondary material-book-back">← Ganti buku</button>';
  book1El.insertAdjacentHTML("afterbegin", backButtonHtml);
  book2El.insertAdjacentHTML("afterbegin", backButtonHtml);

  materialsEl.append(chooser, book1El, book2El);

  function showBook(number) {
    chooser.hidden = number != null;
    book1El.hidden = number !== 1;
    book2El.hidden = number !== 2;
    // Ingat buku terakhir dibuka per-tab (sessionStorage) - sebelumnya
    // (saat Materi masih section SPA) pindah ke menu lain lalu balik lagi
    // tidak mengulang dari pemilihan buku sama sekali, karena dokumennya
    // tidak pernah dimuat ulang. Sekarang halaman ini dokumen sendiri.
    if (number) sessionStorage.setItem("materiActiveBook", String(number));
    else sessionStorage.removeItem("materiActiveBook");
  }
  chooser.querySelectorAll("[data-choose-book]").forEach((button) => {
    button.onclick = () => showBook(Number(button.dataset.chooseBook));
  });
  materialsEl.querySelectorAll(".material-book-back").forEach((button) => {
    button.onclick = () => showBook(null);
  });

  const savedBook = Number(sessionStorage.getItem("materiActiveBook"));
  showBook(savedBook === 1 || savedBook === 2 ? savedBook : null);
})();

// === Mode fokus ===
/* Mode fokus untuk pembaca materi (Buku 1 dan Buku 2 berbagi fungsi yang sama). */
function setMaterialFocusMode(on) {
  document.body.classList.toggle("focus-mode", on);
  let visibleToggle = null;
  document.querySelectorAll(".material-focus-toggle").forEach((button) => {
    button.classList.toggle("active", on);
    button.setAttribute("aria-pressed", String(on));
    button.textContent = on ? "✕ Keluar fokus" : "⛶ Mode fokus";
    if (!visibleToggle && button.offsetParent) visibleToggle = button;
  });
  /* Masuk/keluar mode fokus menyembunyikan atau memunculkan navbar, judul
     halaman, daftar pelajaran, dan panel progres - tinggi halaman berubah
     drastis. Tanpa scroll ulang ke toolbar, posisi scroll lama bisa
     membuat toolbar (berisi tombol keluar) terlempar jauh dari layar,
     sehingga mode fokus terkesan "tidak bisa dimatikan" di HP. */
  if (visibleToggle) {
    const toolbar = visibleToggle.closest(".material-reader-toolbar");
    if (toolbar) toolbar.scrollIntoView({ block: "start" });
  }
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("focus-mode"))
    setMaterialFocusMode(false);
});
}
window.initPage = initPage;
