/* Halaman Materi (pages/materi.html): daftar pelajaran Buku 1 (1-25) & Buku 2
   (26-50), pembaca per-pelajaran (mode fokus, tahap pahami/contoh/latihan),
   dan progres. Dibungkus initPage(), dijalankan auth.js setelah login.
   Dipecah dari app.js lama - konten pelajaran (data teks) tetap sama persis,
   cuma dipindah lokasi; satu kuis "tailored" yang di kode asli dibangun lalu
   SELALU langsung dihapus lagi sebelum sempat dilihat siapa pun (bukan
   dipakai) TIDAK dibawa ke sini. syncCurriculumDashboard() diubah agar
   menyimpan hasilnya ke localStorage (bukan menulis ke #dashboard langsung)
   karena Dashboard sekarang halaman terpisah - lihat renderCurriculumSummary()
   di js/pages/dashboard.js. */
function initPage() {
// === Pasang konten pelajaran Buku 1 & 2 (data ada di data/materi-grammar-data.js) ===
installMateriGrammarContent();

// === Mini-quiz di akhir tiap pelajaran ===
const enrichLessons = (root, offset) =>
  root.querySelectorAll(".html-lesson").forEach((lesson, i) => {
    if (offset === 0 && i === 0) return;
    if (lesson.querySelector(".lesson-quiz")) return;
    const body = lesson.querySelector(".html-content");
    if (!body) return;
    const pattern =
      body
        .querySelector(".grammar-example")
        ?.textContent.split("Contoh:")[0]
        .trim() || "Pola pelajaran";
    const uid = `practice-${offset + i}`;
    body.insertAdjacentHTML(
      "beforeend",
      `<div class="grammar-point"><h3>Ringkasan praktik</h3><table class="pattern-table"><thead><tr><th>Langkah</th><th>Praktik</th></tr></thead><tbody><tr><td>Baca</td><td>Baca pola dan contoh dengan suara keras.</td></tr><tr><td>Ubah</td><td>Ganti subjek, waktu, atau tempat pada contoh dengan informasi Anda sendiri.</td></tr><tr><td>Buat</td><td>Tulis dua kalimat baru menggunakan pola pelajaran ini.</td></tr></tbody></table></div><div class="grammar-point"><h3>Dialog latihan</h3><div class="mini-dialog"><b>A:</b> この 文を 読みましたか。<br><b>B:</b> はい、読みました。もう一度 練習します。<br><br><small>Arti: Apakah kamu sudah membaca kalimat ini? — Ya, sudah. Saya akan berlatih sekali lagi.</small></div></div><div class="lesson-quiz"><b>Latihan cepat</b><p>Pilih kebiasaan belajar yang tepat setelah mempelajari pola baru.</p><button class="secondary" data-practice="wrong">Langsung melupakan contohnya</button><button class="secondary" data-practice="correct">Membuat kalimat sendiri</button><button class="secondary" data-practice="wrong">Tidak membaca ulang</button><div class="quiz-feedback" id="${uid}"></div></div>`,
    );
    body.querySelectorAll("[data-practice]").forEach(
      (b) =>
        (b.onclick = () => {
          document.getElementById(uid).textContent =
            b.dataset.practice === "correct"
              ? "Benar! Membuat kalimat sendiri membantu memahami pola dalam konteks."
              : "Coba lagi. Setelah belajar pola, buat contoh kalimat sendiri agar lebih melekat.";
        }),
    );
  });
enrichLessons(document.getElementById("materials"), 0);
enrichLessons(document.getElementById("book2"), 100);
/* Kuis disesuaikan dengan fokus tata bahasa setiap pelajaran. */
/* Legacy Unicode quiz block is retained only as a record and is not executed.
    const lessonQuizzes={
      1:['Lengkapi: わたし は 学生 ___。',['です','を','に'],0,'Benar. です digunakan untuk menutup kalimat nominal sopan.'],
      2:['Manakah kata tunjuk untuk benda yang dekat dengan pembicara?',['これ','それ','あれ'],0,'Benar. これ berarti “ini” dan digunakan untuk benda dekat pembicara.'],
      3:['Lengkapi: トイレ は ___ ですか。',['どこ','だれ','いつ'],0,'Benar. どこ digunakan untuk menanyakan lokasi.'],
      4:['Partikel yang menandai waktu spesifik adalah …',['に','を','と'],0,'Benar. に dipakai dengan waktu spesifik, misalnya 7時に.'],
      5:['Lengkapi: 電車 ___ 東京へ 行きます。',['で','を','が'],0,'Benar. で menandai sarana/alat transportasi.'],
      6:['Lengkapi: 図書館 ___ 本を 読みます。',['で','に','と'],0,'Benar. で menunjukkan tempat suatu kegiatan berlangsung.'],
      7:['Pola 友だちに プレゼントを あげます berarti …',['Memberi hadiah kepada teman','Menerima hadiah dari teman','Pergi bersama teman'],0,'Benar. あげます berarti memberi kepada orang lain.'],
      8:['Untuk menyatakan “tidak terlalu mahal”, bentuk yang tepat adalah …',['あまり 高くないです','とても 高いです','高い ですか'],0,'Benar. あまり digunakan bersama bentuk negatif.'],
      9:['Partikel yang lazim dipakai dengan 好きです adalah …',['が','を','へ'],0,'Benar. Objek kesukaan umumnya memakai が.'],
      10:['Kata kerja untuk menyatakan “ada” bagi manusia/hewan adalah …',['います','あります','です'],0,'Benar. います digunakan untuk manusia dan hewan.'],
      11:['Lengkapi: わたし は 一週間に 二回 日本語を 勉強します。Maknanya adalah …',['Belajar dua kali seminggu','Belajar selama dua minggu','Belajar satu kali setiap hari'],0,'Benar. ～に二回 menunjukkan frekuensi dua kali dalam periode tersebut.'],
      12:['Bentuk lampau dari 元気です adalah …',['元気でした','元気ます','元気て'],0,'Benar. Kata benda/kata sifat-na memakai でした dalam bentuk lampau sopan.'],
      13:['Lengkapi: 日本へ 行き ___ です。',['たい','ます','ない'],0,'Benar. Bentuk masu-stem + たい menyatakan keinginan melakukan tindakan.'],
      14:['Bentuk sopan untuk meminta “tolong baca” adalah …',['読んで ください','読みます か','読まないで'],0,'Benar. Bentuk て + ください digunakan untuk permintaan sopan.'],
      15:['Pola 写真を 撮っても いいですか berarti …',['Bolehkah saya memotret?','Jangan memotret.','Saya sedang memotret.'],0,'Benar. ～てもいいですか digunakan untuk meminta izin.'],
      16:['Untuk menyambungkan dua tindakan “makan lalu belajar”, gunakan …',['食べて、勉強します','食べない、勉強します','食べた、勉強します'],0,'Benar. Bentuk て dapat menyambungkan urutan tindakan.'],
      17:['Pola ここで 写真を 撮らないでください berarti …',['Tolong jangan memotret di sini','Silakan memotret di sini','Bolehkah memotret di sini?'],0,'Benar. Bentuk ないでください adalah permintaan agar tidak melakukan sesuatu.'],
      18:['Pola 日本語を 話すことが できます berarti …',['Bisa berbicara bahasa Jepang','Ingin berbicara bahasa Jepang','Sedang berbicara bahasa Jepang'],0,'Benar. Bentuk kamus + ことができます menyatakan kemampuan.'],
      19:['Pola 富士山に 登ったことが あります berarti …',['Pernah mendaki Gunung Fuji','Sedang mendaki Gunung Fuji','Ingin mendaki Gunung Fuji'],0,'Benar. ～たことがあります menyatakan pengalaman.'],
      20:['Gaya biasa dari 食べます adalah …',['食べる','食べて','食べたい'],0,'Benar. 食べる adalah bentuk biasa/kamus positif.'],
      21:['Lengkapi: 日本語は おもしろいと ___。',['思います','します','います'],0,'Benar. ～と思います dipakai untuk menyatakan pendapat.'],
      22:['Pada frasa わたしが 昨日 買った 本, bagian yang menerangkan 本 adalah …',['わたしが 昨日 買った','本','が'],0,'Benar. Klausa biasa diletakkan sebelum kata benda yang diterangkan.'],
      23:['Lengkapi: 家に 帰る ___、手を 洗います。',['と','を','が'],0,'Benar. ～と dapat menunjukkan hasil yang terjadi secara alami/setiap kali.'],
      24:['Pola 友だちが 荷物を 持って くれました berarti …',['Teman membawakan barang untuk saya','Saya membawakan barang untuk teman','Saya menerima barang dari teman'],0,'Benar. ～てくれました menyatakan orang lain melakukan kebaikan untuk pembicara.'],
      25:['Lengkapi: 時間が あっ ___、映画を 見ます。',['たら','て','で'],0,'Benar. ～たら menyatakan “jika/ketika” syarat terpenuhi.'],
      26:['Pola どうして 遅れたんですか berarti …',['Mengapa kamu terlambat?','Kapan kamu terlambat?','Di mana kamu terlambat?'],0,'Benar. ～んですか meminta penjelasan atau alasan.'],
      27:['Lengkapi: 病院へ 行った ほうが ___ です。',['いい','たい','ある'],0,'Benar. ～たほうがいいです dipakai untuk memberi saran.'],
      28:['Pola 雨が 降ったら、行きません berarti …',['Jika hujan, saya tidak pergi','Karena hujan, saya pergi','Saya ingin hujan'],0,'Benar. ～たら menyatakan syarat.'],
      29:['Pola 窓が 閉まっています menjelaskan …',['Jendelanya dalam keadaan tertutup','Seseorang sedang menutup jendela','Tolong tutup jendela'],0,'Benar. ～ています dapat menunjukkan keadaan hasil suatu tindakan.'],
      30:['Pola 切符を 買っておきます berarti …',['Membeli tiket sebagai persiapan','Sedang membeli tiket','Tidak jadi membeli tiket'],0,'Benar. ～ておきます menyatakan persiapan sebelumnya.'],
      31:['Pola 来年 日本へ 行くつもりです berarti …',['Berniat pergi ke Jepang tahun depan','Sudah pergi ke Jepang tahun depan','Disuruh pergi ke Jepang tahun depan'],0,'Benar. ～つもりです menyatakan niat pribadi.'],
      32:['Saran “sebaiknya jangan tidur terlalu larut” memakai …',['遅くまで 起きないほうがいいです','遅くまで 起きたいです','遅くまで 起きています'],0,'Benar. Bentuk ないほうがいいです digunakan untuk saran agar tidak melakukan sesuatu.'],
      33:['Bentuk larangan tegas dari 入る adalah …',['入るな','入ってください','入ります'],0,'Benar. Bentuk kamus + な menyatakan larangan tegas.'],
      34:['Lengkapi: ご飯を 食べた ___、勉強します。',['あとで','から','まで'],0,'Benar. ～たあとで berarti “setelah melakukan …”.'],
      35:['Pola 時間が あれば、行きます berarti …',['Jika ada waktu, saya pergi','Ketika pergi, ada waktu','Saya ingin punya waktu'],0,'Benar. ～ば adalah pola syarat/pengandaian.'],
      36:['Pola 日本語が 話せるように 毎日 練習します menyatakan …',['Berlatih agar mampu berbicara Jepang','Berlatih karena sudah bisa Jepang','Tidak mau berlatih Jepang'],0,'Benar. ～ように menunjukkan tujuan terkait kemampuan/keadaan.'],
      37:['Pola わたしは 先生に ほめられました berarti …',['Saya dipuji oleh guru','Saya memuji guru','Guru sedang dipuji'],0,'Benar. ～られました adalah bentuk pasif.'],
      38:['Pola 日本語を 勉強するのは 楽しいです berarti …',['Belajar Jepang itu menyenangkan','Saya sedang belajar Jepang','Tolong belajar Jepang'],0,'Benar. Bentuk kamus + のは menominalkan kegiatan.'],
      39:['Pola 母は 子どもを 勉強させます berarti …',['Ibu menyuruh/membiarkan anak belajar','Anak mengajari ibu','Ibu sedang belajar'],0,'Benar. Bentuk kausatif menyatakan membuat atau membiarkan orang bertindak.'],
      40:['Bentuk hormat yang tepat untuk meminta seseorang menulis adalah …',['お名前を お書きください','名前を 書きます','名前を 書きたいです'],0,'Benar. お～ください dipakai saat meminta tindakan dengan hormat.'],
      41:['Ungkapan rendah hati untuk “saya akan melihat” adalah …',['拝見します','見ます','見られます'],0,'Benar. 拝見します adalah bentuk rendah hati dari 見ます.'],
      42:['Pola 日本で 働くために 日本語を 勉強します berarti …',['Belajar Jepang untuk bekerja di Jepang','Belajar Jepang sambil bekerja','Belajar Jepang setelah bekerja'],0,'Benar. ～ために menunjukkan tujuan yang disengaja.'],
      43:['Pola だんだん 暑く なってきました berarti …',['Lambat-laun mulai menjadi panas','Dari dulu selalu panas','Akan langsung menjadi panas'],0,'Benar. ～てきました menunjukkan perubahan yang mendekat hingga kini.'],
      44:['Pola 天気予報に よると、明日は 雨だそうです berarti …',['Menurut ramalan cuaca, besok katanya hujan','Saya ingin hujan besok','Besok saya melihat hujan'],0,'Benar. ～そうです menyampaikan informasi yang didengar.'],
      45:['Pola 雨が 降っても、行きます berarti …',['Walaupun hujan, saya pergi','Jika hujan, saya tidak pergi','Karena hujan, saya pergi'],0,'Benar. ～ても menyatakan hasil tetap terjadi walaupun ada kondisi.'],
      46:['Pola 寝ている間に、雨が 降りました berarti …',['Hujan turun saat saya tidur','Saya tidur karena hujan','Saya ingin tidur saat hujan'],0,'Benar. ～間に menunjukkan kejadian yang terjadi selama rentang kegiatan lain.'],
      47:['Pola 先生に もっと 練習するように 言われました berarti …',['Saya diberi tahu guru agar lebih banyak berlatih','Saya menyuruh guru berlatih','Guru sedang berlatih'],0,'Benar. ～ように言われました menyampaikan instruksi tidak langsung.'],
      48:['Pola よく 見えるように、前に 座ります berarti …',['Duduk di depan agar dapat melihat jelas','Duduk di depan karena sudah melihat','Duduk di depan setelah melihat'],0,'Benar. ～ように menyatakan tujuan kemampuan/keadaan.'],
      49:['Bentuk rendah hati yang tepat untuk “saya akan membawa” adalah …',['お持ちします','持ちます','持たれます'],0,'Benar. お持ちします adalah bentuk rendah hati dari 持っていきます/持ってきます.'],
      50:['Pola 毎日 日本語を 読むようにしています berarti …',['Saya mengusahakan kebiasaan membaca Jepang setiap hari','Saya sedang membaca Jepang sekarang','Saya ingin membaca Jepang sekali'],0,'Benar. ～ようにしています menyatakan kebiasaan yang diusahakan berkelanjutan.']
    };
    document.querySelectorAll('.html-lesson').forEach(lesson=>{
      const num=Number((lesson.id.match(/lesson-(\d+)/)||[])[1]);
      const data=lessonQuizzes[num]; if(!data)return;
      const quiz=lesson.querySelector('.lesson-quiz'); if(!quiz)return;
      const feedbackId=`lesson-feedback-${num}`;
      quiz.innerHTML=`<b>Latihan cepat Pelajaran ${num}</b><p>${data[0]}</p>${data[1].map((choice,i)=>`<button class="secondary" data-answer="${i}">${choice}</button>`).join('')}<div class="quiz-feedback" id="${feedbackId}"></div>`;
      quiz.querySelectorAll('[data-answer]').forEach(button=>button.onclick=()=>{
        const correct=Number(button.dataset.answer)===data[2];
        quiz.querySelectorAll('[data-answer]').forEach((item,i)=>{item.disabled=true;if(i===data[2])item.classList.add('correct');});
        if(!correct)button.classList.add('wrong');
        document.getElementById(feedbackId).textContent=correct?data[3]:`Belum tepat. ${data[3]}`;
      });
    });
    */

simplifyLessonMaterials();
structureGrammarPoints();

// === Furigana ===
/* Furigana kontekstual untuk contoh dan latihan materi Buku 1-2. */
const materialFuriganaReadings = {
  "立入禁止": "たちいりきんし", "天気予報": "てんきよほう", "電話番号": "でんわばんごう",
  "一週間": "いっしゅうかん", "会議室": "かいぎしつ", "会社員": "かいしゃいん",
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
  "土曜日": "どようび", "日曜日": "にちようび", "普通形": "ふつうけい",
  "形容詞": "けいようし", "事務所": "じむしょ", "辞書形": "じしょけい", "辞書": "じしょ",
  "心配": "しんぱい", "食堂": "しょくどう", "趣味": "しゅみ", "食事": "しょくじ", "去年": "きょねん",
  "今晩": "こんばん", "相撲": "すもう", "物価": "ぶっか", "空港": "くうこう", "交通": "こうつう",
  "不便": "ふべん", "出張": "しゅっちょう", "留学": "りゅうがく", "試合": "しあい", "意見": "いけん",
  "約束": "やくそく", "用事": "ようじ", "生まれ": "うまれ", "調子": "ちょうし", "病気": "びょうき",
  "散歩": "さんぽ", "交差点": "こうさてん", "体": "からだ",
  "案内": "あんない", "意味": "いみ", "一度": "いちど", "映画": "えいが",
  "音楽": "おんがく", "家族": "かぞく", "荷物": "にもつ", "会議": "かいぎ",
  "会社": "かいしゃ", "学校": "がっこう", "学生": "がくせい", "漢字": "かんじ",
  "京都": "きょうと", "銀行": "ぎんこう", "健康": "けんこう", "元気": "げんき",
  "佐藤": "さとう", "山田": "やまだ", "仕事": "しごと", "資料": "しりょう",
  "写真": "しゃしん", "社長": "しゃちょう", "宿題": "しゅくだい", "新聞": "しんぶん",
  "新しい": "あたらしい", "場合": "ばあい", "生活": "せいかつ", "切符": "きっぷ",
  "先生": "せんせい", "台風": "たいふう", "田中": "たなか", "電気": "でんき",
  "電車": "でんしゃ", "電話": "でんわ", "東京": "とうきょう", "奈良": "なら",
  "二回": "にかい", "日本": "にほん", "病院": "びょういん", "普通": "ふつう",
  "部屋": "へや", "部長": "ぶちょう", "復習": "ふくしゅう", "便利": "べんり",
  "勉強": "べんきょう", "毎朝": "まいあさ", "毎日": "まいにち", "名前": "なまえ",
  "明日": "あした", "木村": "きむら", "問題": "もんだい", "野菜": "やさい",
  "友達": "ともだち", "有名": "ゆうめい", "予定": "よてい", "来年": "らいねん",
  "旅行": "りょこう", "練習": "れんしゅう", "連絡": "れんらく", "時間": "じかん",
  "週間": "しゅうかん", "親切": "しんせつ", "手伝": "てつだ", "何時間": "なんじかん", "何時": "なんじ",
  "神戸": "こうべ", "何ですか": "なんですか", "何人": "なんにん", "何を": "なにを",
  "何の": "なんの", "何か": "なにか", "何が": "なにが", "何に": "なにに",
  "何で": "なんで", "何と": "なんと", "何歳": "なんさい",
  "下さい": "ください", "拝見": "はいけん",
  "駅": "えき", "家": "いえ", "花": "はな", "海": "うみ", "靴": "くつ",
  "机": "つくえ", "酒": "さけ", "春": "はる", "人": "ひと", "先": "さき",
  "前": "まえ", "窓": "まど", "中": "なか", "朝": "あさ", "町": "まち",
  "猫": "ねこ", "箱": "はこ", "飯": "はん", "物": "もの", "文": "ぶん",
  "母": "はは", "本": "ほん", "友": "とも", "手": "て", "雨": "あめ",
  "安": "やす", "歌": "うた", "回": "かい", "間": "あいだ", "形": "かたち",
  "寒": "さむ", "漢": "かん", "語": "ご", "好": "す", "今": "いま", "子": "こ",
  "次": "つぎ", "時": "とき", "上": "うえ", "早": "はや", "切": "き",
  "分": "ふん", "新": "あたら", "覧": "らん", "月": "つき", "日": "ひ",
  "薬": "くすり", "何": "なに", "一": "いち", "雪": "ゆき", "歳": "さい", "暇": "ひま", "辛": "から", "父": "ちち",
  "絵": "え", "彼": "かれ", "所": "ところ", "要": "い", "悪": "わる", "妻": "つま", "川": "かわ",
  "泳": "およ", "釣": "つ", "音": "おと", "右": "みぎ", "小": "ちい", "道": "みち", "渡": "わた", "曲": "ま",
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
  "思": "おも", "止": "と", "試": "ため", "持": "も", "治": "なお", "捨": "す",
  "出": "で", "暑": "あつ", "書": "か", "消": "け", "食": "た", "寝": "ね",
  "静": "しず", "洗": "あら", "送": "おく", "続": "つづ", "貸": "か", "脱": "ぬ",
  "知": "し", "置": "お", "遅": "おく", "伝": "つた", "登": "のぼ", "働": "はたら", "返": "かえ", "払": "はら",
  "読": "よ", "入": "はい", "買": "か", "聞": "き", "閉": "し", "歩": "ある",
  "忘": "わす", "忙": "いそが", "話": "はな", "来": "き", "楽": "たの",
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
    if (next === "な") return "こ";
    if (next === "る") return "く";
  }
  if (word === "回" && text[cursor + word.length] === "す") return "まわ";
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
      lessonEls[index]?.querySelectorAll(".grammar-point:not(.lesson-quiz)").length || 0;
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

// === Lesson picker & mesin quiz/practice ===
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
    (lesson) => lesson.querySelectorAll(".grammar-point:not(.lesson-quiz)").length,
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
    `<div class="material-reader-toolbar"><button type="button" class="material-back-list">↑ Daftar pelajaran</button><span class="material-reader-position">Pelajaran ${startNumber} dari ${endNumber}</span><button type="button" class="material-furigana-toggle active" aria-pressed="true">振 Furigana aktif</button><button type="button" class="material-focus-toggle" aria-pressed="false">⛶ Mode fokus</button></div><header class="material-reader-head"><div><div class="eyebrow material-reader-number"></div><h2 class="material-reader-title"></h2><p>Seluruh pola, penjelasan, dan contoh asli tetap ditampilkan.</p></div><span class="material-study-time">◷ 8–15 menit</span></header><div class="material-learning-steps" role="tablist" aria-label="Tahapan belajar"><button type="button" class="material-step active" data-material-step="patterns" role="tab" aria-selected="true"><b>1</b>Pahami semua pola</button><button type="button" class="material-step" data-material-step="examples" role="tab" aria-selected="false"><b>2</b>Pelajari contoh</button><button type="button" class="material-step" data-material-step="practice" role="tab" aria-selected="false"><b>3</b>Kerjakan latihan</button></div><div class="material-completeness">✓ Materi lengkap—tidak ada pola yang dikurangi.</div><div class="material-reader-body material-step-panel" data-material-panel="patterns"></div><section class="material-example-study material-step-panel" data-material-panel="examples" hidden></section><section class="material-practice-study material-step-panel" data-material-panel="practice" hidden></section><footer class="material-reader-actions"><button type="button" class="material-secondary-action material-previous">← Sebelumnya</button><div><button type="button" class="material-repeat-action material-mark-repeat">Perlu diulang</button><button type="button" class="material-primary-action material-mark-understood">Sudah paham ✓</button></div><button type="button" class="material-secondary-action material-next">Berikutnya →</button></footer>`;

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
  const practiceStudy = reader.querySelector(".material-practice-study");
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

    const recommendationIndex = statuses.findIndex(
      (status) => status === "repeat",
    );
    const nextIndex =
      recommendationIndex >= 0
        ? recommendationIndex
        : statuses.findIndex((status) => status === "new");
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
      button.classList.toggle("done", status === "done");
      button.classList.toggle("repeat", status === "repeat");
      button.querySelector(".material-choice-state").textContent =
        status === "done"
          ? "Sudah dipahami"
          : status === "repeat"
            ? "Perlu diulang"
            : "Belum dimulai";
    });
  }

  /* Jalan pintas "tandai semua pola pelajaran ini sekaligus" (tombol bar
     bawah reader) - siswa yang mau presisi tetap bisa menilai tiap pola
     satu-satu lewat tombol rating di masing-masing .grammar-point.
     outcome: "again" (Perlu diulang) atau "good" (Sudah paham) */
  function setLessonStatus(index, outcome) {
    const content = lessons[index]?.querySelector(".html-content") || activeContent;
    const points = content
      ? Array.from(content.querySelectorAll(".grammar-point")).filter(
          (point) => !point.classList.contains("lesson-quiz"),
        )
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

  /* Partikel untuk soal "cari partikel yang benar". detectStandaloneParticles
     dipakai pada JUDUL POLA (mis. "Kata Benda1 は Kata Benda2 です") untuk
     tahu partikel apa yang diajarkan pola itu - hanya dihitung kalau
     berdiri sendiri (dibatasi karakter BUKAN kana di kedua sisinya, karena
     di judul partikelnya selalu diapit teks Latin "Kata Benda"/spasi),
     supaya か di dalam ですか milik judul tidak dikira partikel berbeda dari
     か yang berdiri sendiri. blankParticle dipakai pada KALIMAT CONTOH
     sungguhan (di mana partikel wajar menempel ke kana sebelumnya, mis.
     わたしは) - jadi cuma perlu hindari で yang sebenarnya bagian dari
     です／でした. */
  const PARTICLE_SET = ["は", "が", "を", "に", "で", "と", "も", "の", "へ", "か"];

  function isKanaChar(ch) {
    return /[぀-ヿ]/.test(ch || "");
  }

  function detectStandaloneParticles(text) {
    const found = [];
    PARTICLE_SET.forEach((particle) => {
      let index = text.indexOf(particle);
      while (index !== -1) {
        // "か" tepat sebelum "月" adalah bagian dari kata bantu bilangan
        // ～か月 (mis. "2か月"), bukan partikel か yang berdiri sendiri -
        // batas non-kana di kedua sisi (angka di depan, 月 kanji di
        // belakang) bisa salah lolos pengecekan umum di bawah kalau tidak
        // dikecualikan eksplisit di sini.
        const isKagetsuFragment = particle === "か" && text[index + 1] === "月";
        if (!isKagetsuFragment && !isKanaChar(text[index - 1]) && !isKanaChar(text[index + 1])) {
          if (!found.includes(particle)) found.push(particle);
          break;
        }
        index = text.indexOf(particle, index + 1);
      }
    });
    return found;
  }

  /* の tepat di posisi `index` dalam `text` BISA berarti dua hal berbeda:
     (a) bagian dari kata tunjuk この／その／あの／どの (mis. "このかばん")
         - の di sini BUKAN partikel berdiri sendiri, kalau dilubangi/
         dipisah jadi "こ"+"かばん" yang tak bermakna (こ bukan kata utuh).
     (b) partikel の yang genuinely menempel ke kata tempat ここ／そこ／
         あそこ／どこ yang KEBETULAN berakhiran こ (mis. "どこの
         コンピューター" - どこ berdiri sendiri sebagai kata "mana", の di
         belakangnya partikel asli, sama seperti "IMCの"). Cek dua/tiga
         huruf sebelum の dulu: kalau membentuk ここ/そこ/どこ (atau あそこ
         untuk tiga huruf), itu kasus (b) - BUKAN kata tunjuk. Baru kalau
         bukan, cek kasus (a). Dipakai baik oleh blankParticle (soal
         partikel) maupun splitParticles (soal susun kalimat) supaya
         perlakuannya konsisten. */
  function isDemonstrativeNo(text, index) {
    if (text[index] !== "の" || index <= 0) return false;
    const beforeTwo = text.slice(Math.max(0, index - 2), index);
    const beforeThree = text.slice(Math.max(0, index - 3), index);
    const isLocationWord = ["ここ", "そこ", "どこ"].includes(beforeTwo) || beforeThree === "あそこ";
    return !isLocationWord && "こそあど".includes(text[index - 1]);
  }

  function blankParticle(sentence, particle) {
    let index = sentence.indexOf(particle);
    while (index !== -1) {
      const isCopulaFragment = particle === "で" && /^で(す|した)/.test(sentence.slice(index));
      const isDemonstrativeFragment = particle === "の" && isDemonstrativeNo(sentence, index);
      if (!isCopulaFragment && !isDemonstrativeFragment) {
        // Partikel opsional di sumber ditulis ［に］ - kurung sumber itu jadi
        // rancu kalau dibiarkan bertumpuk dengan kurung kosong soal, jadi
        // dilepas saat partikelnya diganti jadi soal isian.
        const hasBrackets = sentence[index - 1] === "［" && sentence[index + particle.length] === "］";
        const start = hasBrackets ? index - 1 : index;
        const end = hasBrackets ? index + particle.length + 1 : index + 1;
        return sentence.slice(0, start) + "（　　）" + sentence.slice(end);
      }
      index = sentence.indexOf(particle, index + 1);
    }
    return null;
  }

  /* Parafrase AMAN untuk soal cerita: ambil satu kalimat DARI CERITA ITU
     SENDIRI (bukan fakta dari kalimat lain di bab - supaya konteksnya
     tidak keluar dari soal) lalu ubah pola permukaannya tanpa mengubah
     makna. Cuma dua transformasi yang dilakukan, keduanya selalu benar
     secara makna:
     - "...です." -> "...ですか。……はい、そうです." (pernyataan jadi
       pertanyaan+konfirmasi - persis mekanisme pola "そうです" di buku).
     - "...ですか." -> "...です." TAPI HANYA jika kalimatnya sendiri sudah
       mengonfirmasi "はい" (supaya tidak menegaskan sesuatu yang menurut
       ceritanya sendiri sebenarnya belum/tidak terjawab "ya").
     Kalimat dengan kata tanya (だれ/どなた/なに/dst, tidak bisa dibalik jadi
     pernyataan) atau pola pilihan "～か、～か" dilewati - biarkan pemanggil
     coba kalimat lain dalam cerita yang sama. */
  const WH_WORDS = ["だれ", "どなた", "なに", "なん", "どこ", "いつ", "どう", "どの", "どんな", "どちら", "いくつ", "いくら"];

  function containsWhWord(text) {
    return WH_WORDS.some((word) => text.includes(word));
  }

  function paraphraseWithinStory(example) {
    const fullText = example.japaneseClean;
    const tryClause = (clause) => {
      if (!clause || containsWhWord(clause) || clause.includes("か、")) return null;
      const questionEndings = ["ですか", "ましたか", "ますか", "ませんでしたか", "ませんか"];
      if (questionEndings.some((ending) => clause.endsWith(ending))) {
        if (!fullText.includes("はい")) return null;
        return clause.slice(0, -1) + "。";
      }
      if (clause.endsWith("です")) return `${clause}か。……はい、そうです。`;
      // Kalimat verbal (bab yang polanya Vます／Vました, mis. Pelajaran 4) tidak
      // bisa dijawab dengan そうです (lihat Pel.4 pola 2-3), jadi jawabannya
      // mengulang kata kerja yang sama seperti contoh ⑥/⑦ di buku - bukan
      // memakai kalimat aslinya apa adanya (supaya bukan sekadar salin cerita).
      const verbEndings = ["ました", "ます", "ませんでした", "ません"];
      if (verbEndings.some((ending) => clause.endsWith(ending))) {
        return `${clause}か。……はい、${clause}。`;
      }
      return null;
    };
    const firstClause = fullText.split(/[。？]/)[0].trim();
    const direct = tryClause(firstClause);
    if (direct) return direct;
    // Kalimat pertama kadang pola tanya-jawab dengan Kata Tanya (mis.
    // Pel.12 pola 5 "～で 何/どこ/だれ/いつ が いちばん ～ですか") yang
    // tidak bisa diparafrase langsung (bukan pertanyaan ya/tidak) - coba
    // klausa JAWABAN setelah "……" yang sering berupa kalimat です/verbal
    // biasa yang justru BISA diparafrase, daripada langsung jatuh ke
    // salin kalimat aslinya apa adanya.
    const answerPart = fullText.split("……")[1];
    if (answerPart) return tryClause(answerPart.split(/[。？]/)[0].trim());
    return null;
  }

  function buildPracticeTest(content) {
    const examples = getAllExamplesData(content);
    /* Contoh bertanda "×" sengaja menunjukkan penggunaan yang SALAH (lihat
       Pelajaran 2 pola 6) - jangan dipakai sebagai sumber soal, tapi tetap
       tampil apa adanya di "Pelajari Contoh" di atas. Contoh tanpa nomor
       lingkaran (mis. daftar penggunaan します di Pelajaran 6 pola 2:
       "サッカーを します" / "bermain sepak bola") adalah demonstrasi kosakata
       di dalam penjelasan, bukan kalimat cerita/narasi - dikecualikan juga
       supaya tidak jadi "cerita" yang isinya cuma daftar kata tak nyambung. */
    const quizPool = examples.filter(
      (example) => !example.japaneseClean.includes("×") && example.isNumberedSentence,
    );
    const types = ["particle", "translate", "arrange", "story"];
    const labels = {
      particle: "Partikel yang tepat",
      translate: "Indonesia → Jepang",
      arrange: "Susun kalimat",
      story: "Soal cerita",
    };
    let questionIndex = 0;
    let correctAnswers = 0;
    let scoreByType = createEmptyScore();

    function createEmptyScore() {
      return Object.fromEntries(types.map((type) => [type, { correct: 0, total: 0 }]));
    }

    function unique(items) {
      return items.filter((item, index, array) => item && array.indexOf(item) === index);
    }

    /* Acak array (Fisher-Yates) - dasar dari SEMUA variasi soal di bawah ini.
       Dipakai supaya tiap kali buildQuestionSet() dipanggil ulang (siswa
       menekan "Ulangi tes", atau membuka lagi bab yang sama lain waktu),
       kalimat yang dipilih, pilihan ganda, dan urutannya bisa berbeda dari
       percobaan sebelumnya - bukan lagi 10 soal yang persis sama tiap kali. */
    function shuffleArray(items) {
      const array = items.slice();
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    /* Potong kalimat jadi UNIT ANTAR-SPASI dulu berdasarkan spasi yang sudah
       ada di teks (kalimat contoh di data memang ditulis berspasi antar
       unit frasa, mengikuti cara buku sumber menuliskannya). Satu
       pengecualian: sisipkan batas kata SETELAH tanda titik yang bukan di
       akhir kalimat (mis. "...です。グプタさんも..." pada contoh yang
       menggabungkan 2 kalimat tanpa spasi) supaya klausa berikutnya tetap
       jadi potongan sendiri - titiknya tetap menempel di kata sebelumnya,
       TIDAK jadi "kata" sendiri seperti bug versi lebih lama yang
       menyisipkan spasi SEBELUM tanda baca (itu juga bisa memecah です／
       でした jadi potongan tak bermakna). Hasilnya masih berupa UNIT
       (mis. "ミラーさんは"), belum kata+partikel terpisah - lihat
       splitParticles/wordsOf di bawah untuk pemisahan lebih lanjut. */
    function tokensOf(sentence) {
      return sentence
        .replace(/。(?!$)/g, "。 ")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    }

    /* Pecah SATU unit (hasil tokensOf, mis. "ミラーさんは" atau "会社員です。")
       jadi kata inti + partikel/kopula sebagai potongan TERSENDIRI, khusus
       untuk soal "susun kalimat" - supaya partikel yang menempel tanpa
       spasi ke kata sebelumnya (yang lazim di buku, bukan salah tulis)
       tetap jadi nomor sendiri saat diacak. Urutan pengecekan: ですか lalu
       でした／です dulu (kopula, sering menutup unit), baru satu partikel
       tunggal dari PARTICLE_SET di sisa unitnya - kecuali の yang menempel
       ke こ／そ／あ／ど (itu punya kata tunjuk この／その／あの／どの,
       bukan partikel berdiri sendiri, sama seperti pengecualian di
       blankParticle). Tanda titik penutup kalimat tetap menempel di
       potongan PALING AKHIR, tidak pernah jadi potongan sendiri. */
    function splitParticles(unit) {
      const hasPeriod = unit.endsWith("。");
      let stem = hasPeriod ? unit.slice(0, -1) : unit;
      const pieces = [];
      if (stem.endsWith("ですか")) {
        pieces.unshift("か");
        stem = stem.slice(0, -1);
      }
      if (stem.endsWith("でした")) {
        pieces.unshift("でした");
        stem = stem.slice(0, -3);
      } else if (stem.endsWith("です")) {
        pieces.unshift("です");
        stem = stem.slice(0, -2);
      }
      if (stem.length > 2 && stem.endsWith("まで")) {
        // まで partikel gabungan (Pel.4) - jangan sampai で di akhirnya
        // kepotong sendiri lewat pengecekan satu-karakter di bawah.
        pieces.unshift("まで");
        stem = stem.slice(0, -2);
      } else if (stem.length > 1) {
        const last = stem[stem.length - 1];
        const skipAsParticle = last === "の" && isDemonstrativeNo(stem, stem.length - 1);
        if (PARTICLE_SET.includes(last) && !skipAsParticle) {
          pieces.unshift(last);
          stem = stem.slice(0, -1);
        }
      }
      if (stem) pieces.unshift(stem);
      if (hasPeriod && pieces.length) pieces[pieces.length - 1] += "。";
      return pieces.length ? pieces : [unit];
    }

    function wordsOf(sentence) {
      return tokensOf(sentence).flatMap(splitParticles);
    }

    function fourChoices(correct, distractors) {
      const shuffledDistractors = shuffleArray(distractors.filter((item) => item !== correct));
      const choices = unique([correct, ...shuffledDistractors]);
      const fallback = ["です", "ます", "ません", "でした", "から", "ので"];
      let fallbackIndex = 0;
      while (choices.length < 4) {
        const item = fallback[fallbackIndex % fallback.length];
        if (!choices.includes(item)) choices.push(item);
        fallbackIndex++;
      }
      return shuffleArray(choices.slice(0, 4));
    }

    /* 2 soal: pilih partikel yang tepat. Satu pola dipakai sekali saja per
       bab (usedPatterns) dan satu partikel juga sekali saja (usedParticles)
       supaya 2 soalnya tidak mengetes hal yang sama. quizPool diacak dulu
       tiap panggilan supaya pola/partikel yang kepilih bisa beda-beda tiap
       kali soal dibuat ulang (lihat buildQuestionSet). */
    function buildParticleQuestions(count) {
      const questions = [];
      const usedParticles = new Set();
      const usedPatterns = new Set();
      const tryExample = (example, requireNewPattern) => {
        if (questions.length >= count) return;
        if (requireNewPattern && usedPatterns.has(example.pattern)) return;
        // Deteksi dari judul pola SAJA kadang mentok di 1 partikel kalau
        // sebagian besar pola bab ini memang berpusat ke partikel yang sama
        // (mis. Pelajaran 9 - hampir semua pola judulnya が, padahal kalimat
        // contohnya sendiri juga memakai partikel lain seperti は) - ikut
        // deteksi dari kalimat contohnya supaya tetap bisa dapat 2 partikel
        // BERBEDA, bukan cuma mentok di satu-satunya partikel di judul pola.
        const candidates = shuffleArray(
          detectStandaloneParticles(`${example.pattern} ${example.japaneseClean}`).filter(
            (particle) => !usedParticles.has(particle),
          ),
        );
        if (!candidates.length) return;
        // Sebagian kalimat (mis. "ご注文は？" Pel.13) diakhiri ？ bukan 。-
        // pakai tanda baca ASLI di akhir klausa pertama, jangan selalu
        // menambahkan 。 (kalau tidak, hasilnya jadi tanda baca dobel
        // "...は？。").
        const firstClauseBody = example.japaneseClean.split(/[。？]/)[0];
        const firstClause = firstClauseBody + (example.japaneseClean[firstClauseBody.length] || "。");
        const particle = candidates.find((candidate) => blankParticle(firstClause, candidate));
        if (!particle) return;
        const prompt = blankParticle(firstClause, particle);
        usedParticles.add(particle);
        usedPatterns.add(example.pattern);
        questions.push({
          type: "particle",
          sourceSentence: example.japaneseClean,
          instruction: "Pilih partikel yang tepat untuk melengkapi kalimat.",
          context: `Pola: ${example.pattern}`,
          prompt,
          correct: particle,
          choices: fourChoices(particle, PARTICLE_SET.filter((p) => p !== particle)),
          explanation: `Kalimat lengkapnya: ${firstClause} - partikel「${particle}」dipakai sesuai pola ${example.pattern}.`,
        });
      };
      const shuffledPool = shuffleArray(quizPool);
      shuffledPool.forEach((example) => tryExample(example, true));
      if (questions.length < count) shuffledPool.forEach((example) => tryExample(example, false));
      return questions;
    }

    /* 3 soal: diberi arti Indonesia, pilih kalimat Jepang yang tepat -
       distraktornya kalimat Jepang lain dari bab yang sama. Contoh yang
       dipakai diacak tiap panggilan (bukan lagi rotasi tetap) supaya 3
       kalimat yang dites bisa berbeda tiap kali soal dibuat ulang. */
    function buildTranslateQuestions(count) {
      const pool = shuffleArray(quizPool.filter((example) => example.japaneseClean && example.meaningText));
      return pool.slice(0, count).map((example) => ({
        type: "translate",
        sourceSentence: example.japaneseClean,
        instruction: "Pilih kalimat bahasa Jepang yang sesuai dengan artinya.",
        context: `Arti: ${example.meaningText}`,
        prompt: "Manakah kalimat Jepang yang tepat?",
        correct: example.japaneseClean,
        choices: fourChoices(
          example.japaneseClean,
          // Kalimat lain dengan arti Indonesia yang PERSIS SAMA (mis. Pel.7
          // pola 4 vs [Perhatian]-nya: "…に…" dan "…から…" sama-sama
          // diterjemahkan "Saya mendapatkan bunga dari Sdr. Yamada.") tidak
          // boleh jadi distraktor - itu jawaban yang SAMA benarnya, bukan salah.
          pool
            .filter((other) => other !== example && other.meaningText !== example.meaningText)
            .map((other) => other.japaneseClean),
        ),
        explanation: `Kalimat yang tepat: ${example.japaneseClean} (${example.pattern}).`,
      }));
    }

    /* 2 soal: bagian SOAL memecah kalimat KATA PER KATA TERMASUK PARTIKEL
       (wordsOf/splitParticles - partikel yang menempel ke kata sebelumnya
       tanpa spasi, mis. "ミラーさんは", tetap jadi nomor sendiri: "ミラー
       さん" + "は") lalu diacak & diberi nomor (mis. "1. です　2. は
       3. わたし"). PILIHAN JAWABANNYA berupa 4 URUTAN NOMOR (mis.
       "3 - 2 - 1"), bukan kalimat utuh - siswa mencocokkan nomor potongan
       yang tampil di soal, bukan menerka dari kalimat jadi. Dipakai indeks
       (bukan teks) untuk menentukan urutan benar supaya tetap akurat kalau
       ada dua potongan dengan teks yang sama persis (mis. dua "です" dalam
       satu kalimat). Contoh yang dipakai & urutan acaknya diundi ulang
       tiap panggilan. */
    function buildArrangeQuestions(count) {
      const pool = shuffleArray(quizPool.filter((example) => wordsOf(example.japaneseClean).length >= 3));
      return pool.slice(0, count).map((example) => {
        const words = wordsOf(example.japaneseClean);
        const order = words.map((_, index) => index);
        const shuffledOrder = shuffleArray(order);
        const correct = order.map((originalIndex) => shuffledOrder.indexOf(originalIndex) + 1).join(" - ");
        const variantSequences = new Set();
        for (let guard = 0; guard < 30 && variantSequences.size < 5; guard++) {
          const variant = shuffleArray(order.map((_, index) => index + 1)).join(" - ");
          if (variant !== correct) variantSequences.add(variant);
        }
        return {
          type: "arrange",
          sourceSentence: example.japaneseClean,
          instruction: "Susun potongan kata berikut, lalu pilih urutan nomor yang benar.",
          context: `Arti: ${example.meaningText}`,
          prompt: shuffledOrder.map((originalIndex, displayIndex) => `${displayIndex + 1}. ${words[originalIndex]}`).join("　｜　"),
          correct,
          choices: fourChoices(correct, Array.from(variantSequences)),
          explanation: `Urutan yang benar: ${correct} → ${words.join("")} (${example.pattern}).`,
        };
      });
    }

    /* 3 soal cerita: gabungkan beberapa kalimat contoh BAB INI SENDIRI
       (berurutan sesuai urutan pola dalam grupnya, bukan diacak lintas bab)
       jadi satu cerita/percakapan pendek yang levelnya otomatis sesuai bab
       (karena cuma memakai kosakata & pola yang memang sudah diajarkan bab
       itu) - lalu siswa memilih PERNYATAAN BAHASA JEPANG yang sesuai
       dengan cerita tsb.
       Pernyataan yang benar adalah PARAFRASE dari salah satu kalimat DI
       DALAM cerita itu sendiri (lewat paraphraseWithinStory) - konteksnya
       TIDAK PERNAH keluar dari cerita yang ditampilkan, cuma pola
       permukaannya yang beda dari cara kalimat itu ditulis di cerita.
       Kalau tidak ada kalimat dalam grup yang bisa diparafrase dengan
       aman (mis. semuanya kalimat tanya berkata tanya), baru jatuh ke
       kalimat aslinya apa adanya. Distraktornya kalimat Jepang lain dari
       bab yang sama yang TIDAK ada di cerita ini (jadi jelas salah).
       Grup cerita mana yang kepilih & kalimat mana dalam grup yang
       diparafrase diundi ulang tiap panggilan. */
    function buildStoryQuestions(count) {
      const groupSize = 3;
      const groups = [];
      for (let i = 0; i + groupSize <= quizPool.length; i += groupSize) {
        groups.push(quizPool.slice(i, i + groupSize));
      }
      const stories = shuffleArray(groups.length >= count ? groups : quizPool.map((example) => [example]));
      return stories.slice(0, count).map((group) => {
        const passage = group.map((example) => example.japaneseClean).join(" ");
        let correctExample = group[0];
        let correct = null;
        const startK = Math.floor(Math.random() * group.length);
        for (let k = 0; k < group.length; k++) {
          const candidate = group[(startK + k) % group.length];
          const paraphrase = paraphraseWithinStory(candidate);
          if (paraphrase) {
            correct = paraphrase;
            correctExample = candidate;
            break;
          }
        }
        if (!correct) correct = correctExample.japaneseClean;
        const distractorPool = quizPool
          .filter((example) => !group.includes(example))
          .map((example) => example.japaneseClean);
        return {
          type: "story",
          sourceSentence: passage,
          instruction: "Baca cerita pendek berikut, lalu pilih pernyataan bahasa Jepang yang sesuai.",
          context: unique(group.map((example) => example.pattern)).join(" · "),
          prompt: passage,
          correct,
          choices: fourChoices(correct, distractorPool),
          explanation: `Pernyataan yang sesuai dengan cerita: ${correct} (${correctExample.meaningText})`,
        };
      });
    }

    /* 10 soal, diacak ulang setiap kali dipanggil (lihat shuffleArray dan
       tiap builder di atas) - supaya begitu siswa menekan "Ulangi tes",
       soal & jawabannya tidak persis sama dengan percobaan sebelumnya.
       questions sengaja `let` (bukan const) karena tombol "Ulangi tes"
       memanggil ulang fungsi ini untuk mengganti isinya - lihat
       material-retry-practice di bawah. */
    function buildQuestionSet() {
      return [
        ...buildParticleQuestions(2),
        ...buildTranslateQuestions(3),
        ...buildArrangeQuestions(2),
        ...buildStoryQuestions(3),
      ];
    }
    let questions = buildQuestionSet();
    const mistakeStorageKey = `${progressKey}MistakesV1`;
    const lessonMistakeKey = String(startNumber + activeIndex);
    let activeQuestions = questions;
    let reviewMode = false;

    function questionId(question) {
      return `${question.type}::${question.sourceSentence}::${question.prompt}`;
    }

    function readMistakeStore() {
      try {
        const value = JSON.parse(localStorage.getItem(mistakeStorageKey) || "{}");
        return value && typeof value === "object" ? value : {};
      } catch {
        return {};
      }
    }

    function savedMistakeIds() {
      const value = readMistakeStore()[lessonMistakeKey];
      return Array.isArray(value) ? value : [];
    }

    function updateMistake(question, isCorrect) {
      const store = readMistakeStore();
      const ids = new Set(
        Array.isArray(store[lessonMistakeKey]) ? store[lessonMistakeKey] : [],
      );
      if (isCorrect) ids.delete(questionId(question));
      else ids.add(questionId(question));
      if (ids.size) store[lessonMistakeKey] = Array.from(ids);
      else delete store[lessonMistakeKey];
      try {
        localStorage.setItem(mistakeStorageKey, JSON.stringify(store));
      } catch {
        // Latihan tetap berjalan saat penyimpanan browser tidak tersedia.
      }
    }

    function reviewQuestions() {
      const ids = new Set(savedMistakeIds());
      return questions.filter((question) => ids.has(questionId(question)));
    }

    function resetSession(nextQuestions, isReview) {
      activeQuestions = nextQuestions;
      reviewMode = isReview;
      questionIndex = 0;
      correctAnswers = 0;
      scoreByType = createEmptyScore();
      renderQuestion();
    }

    practiceStudy.innerHTML =
      '<header class="material-study-section-head"><div class="eyebrow">TAHAP 3 · KERJAKAN LATIHAN</div><h3>10 soal pilihan ganda dari bab ini.</h3><p>2 soal partikel, 3 soal Indonesia → Jepang, 2 soal susun kalimat, dan 3 soal cerita - semuanya dari kotoba dan pola kalimat bab ini. Setiap jawaban disertai pembahasan singkat.</p></header><div class="material-test-types"><span>Partikel yang tepat</span><span>Indonesia → Jepang</span><span>Susun kalimat</span><span>Soal cerita</span></div><div class="material-mistake-bar" hidden><div><b>Daftar kesalahan bab ini</b><span></span></div><button type="button">Ulangi soal yang salah</button></div><div class="material-practice-card"></div>';
    const practiceCard = practiceStudy.querySelector(".material-practice-card");
    const mistakeBar = practiceStudy.querySelector(".material-mistake-bar");

    function refreshMistakeBar() {
      const mistakes = reviewQuestions();
      mistakeBar.hidden = mistakes.length === 0;
      mistakeBar.querySelector("span").textContent = `${mistakes.length} soal perlu dipelajari kembali.`;
      mistakeBar.querySelector("button").onclick = () =>
        resetSession(mistakes, true);
    }

    function renderQuestion() {
      refreshMistakeBar();
      if (!activeQuestions.length) {
        practiceCard.innerHTML = '<p class="material-practice-empty">Latihan untuk bab ini sedang disiapkan.</p>';
        return;
      }
      if (questionIndex >= activeQuestions.length) {
        const percentage = Math.round((correctAnswers / activeQuestions.length) * 100);
        const breakdown = types
          .map(
            (type) =>
              `<li><span>${labels[type]}</span><b>${scoreByType[type].correct}/${scoreByType[type].total}</b></li>`,
          )
          .join("");
        practiceCard.innerHTML = `<div class="material-practice-result"><span>${reviewMode ? "ULANG KESALAHAN SELESAI" : "TES SELESAI"}</span><b>${percentage}</b><small>SKOR</small><h4>${percentage >= 80 ? "Pemahaman sangat baik" : percentage >= 60 ? "Teruskan latihan" : "Pelajari kembali contohnya"}</h4><p>Jawaban benar ${correctAnswers} dari ${activeQuestions.length} soal.</p><ul class="material-practice-breakdown">${breakdown}</ul><div class="material-result-actions"><button type="button" class="material-retry-practice">${reviewMode ? "Ulangi soal ini" : "Ulangi tes"}</button><button type="button" class="material-all-practice" ${reviewMode ? "" : "hidden"}>Kembali ke tes lengkap</button></div></div>`;
        practiceCard.querySelector(".material-retry-practice").onclick = () => {
          if (reviewMode) {
            const nextQuestions = reviewQuestions();
            resetSession(nextQuestions.length ? nextQuestions : questions, nextQuestions.length > 0);
            return;
          }
          /* "Ulangi tes" (bukan mode ulang-kesalahan) membuat SET SOAL BARU
             (bukan mengulang 10 soal yang sama) - lihat buildQuestionSet. */
          questions = buildQuestionSet();
          resetSession(questions, false);
        };
        const allPracticeButton = practiceCard.querySelector(".material-all-practice");
        if (allPracticeButton)
          allPracticeButton.onclick = () => resetSession(questions, false);
        return;
      }

      const question = activeQuestions[questionIndex];
      practiceCard.innerHTML = `<div class="material-practice-progress"><span>${reviewMode ? "Ulang kesalahan · " : ""}Soal ${questionIndex + 1} dari ${activeQuestions.length}</span><i><b style="width:${((questionIndex + 1) / activeQuestions.length) * 100}%"></b></i></div><div class="material-practice-test-head"><span>${labels[question.type]}</span><b>問題 ${questionIndex + 1}</b></div><p class="material-practice-instruction"></p><div class="material-practice-context"></div><div class="material-practice-japanese"></div><div class="material-practice-options"></div><div class="material-practice-feedback" aria-live="polite"></div><button type="button" class="material-practice-next" hidden>${questionIndex + 1 === activeQuestions.length ? "Lihat hasil" : "Soal berikutnya →"}</button>`;
      practiceCard.querySelector(".material-practice-instruction").textContent = question.instruction;
      practiceCard.querySelector(".material-practice-context").textContent = question.context;
      practiceCard.querySelector(".material-practice-japanese").textContent = question.prompt;
      addMaterialFurigana(practiceCard.querySelector(".material-practice-test-head b"));
      addMaterialFurigana(practiceCard.querySelector(".material-practice-context"));
      addMaterialFurigana(practiceCard.querySelector(".material-practice-japanese"));
      const options = practiceCard.querySelector(".material-practice-options");
      question.choices.forEach((choice, choiceIndex) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.answer = choice;
        const number = document.createElement("b");
        number.textContent = String(choiceIndex + 1);
        const label = document.createElement("span");
        label.textContent = choice;
        addMaterialFurigana(label);
        button.append(number, label);
        button.onclick = () => {
          const isCorrect = choice === question.correct;
          if (isCorrect) correctAnswers++;
          updateMistake(question, isCorrect);
          scoreByType[question.type].total++;
          if (isCorrect) scoreByType[question.type].correct++;
          options.querySelectorAll("button").forEach((option) => {
            option.disabled = true;
            if (option.dataset.answer === question.correct) {
              option.classList.add("correct");
            }
          });
          if (!isCorrect) button.classList.add("wrong");
          const feedback = practiceCard.querySelector(".material-practice-feedback");
          const feedbackTitle = document.createElement("b");
          feedbackTitle.className = isCorrect ? "is-correct" : "is-wrong";
          feedbackTitle.textContent = isCorrect
            ? "✓ Jawaban benar"
            : `✕ Belum tepat · jawaban ${question.choices.indexOf(question.correct) + 1}`;
          const correctAnswer = document.createElement("p");
          correctAnswer.textContent = `Jawaban benar: ${question.correct}`;
          const explanation = document.createElement("small");
          explanation.textContent = question.explanation;
          addMaterialFurigana(correctAnswer);
          addMaterialFurigana(explanation);
          feedback.replaceChildren(feedbackTitle, correctAnswer, explanation);
          refreshMistakeBar();
          practiceCard.querySelector(".material-practice-next").hidden = false;
        };
        options.appendChild(button);
      });
      practiceCard.querySelector(".material-practice-next").onclick = () => {
        questionIndex++;
        renderQuestion();
      };
    }

    renderQuestion();
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
    buildPracticeTest(activeContent);
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
    setMaterialStep("patterns");

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
  reader.querySelector(".material-mark-understood").onclick = () => {
    setLessonStatus(activeIndex, "good");
    if (activeIndex < 24) selectLesson(activeIndex + 1, true);
  };
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
  updateMaterialProgress();
  selectLesson(0);
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
