const examEmbedMode=new URLSearchParams(location.search).get("embed")==="1";
document.body.classList.toggle("embed-mode",examEmbedMode);
const questionBankReady=true;
const defaultQuestions=[
  {category:"Kosakata",instruction:"Pilih arti yang paling tepat.",html:"<ruby>学生<rt>がくせい</rt></ruby>",options:["Guru","Pelajar","Pegawai","Dokter"],answer:1,explanation:"学生（がくせい） berarti pelajar atau mahasiswa. 先生 adalah guru dan 医者 adalah dokter.",material:"Bab 1 · Perkenalan dan profesi"},
  {category:"Kanji",instruction:"Pilih cara baca kanji yang benar.",html:"<ruby>病院<rt>びょういん</rt></ruby>",options:["びよういん","びょういん","びょいん","びょうえん"],answer:1,explanation:"病院 dibaca びょういん (byouin) dan berarti rumah sakit. Perhatikan bunyi panjang びょう.",material:"Bab 1 · Kosakata tempat"},
  {category:"Tata bahasa",instruction:"Pilih kata yang tepat untuk melengkapi kalimat.",html:"これは わたし（　）ほんです。",options:["は","を","の","に"],answer:2,explanation:"Partikel の menghubungkan dua kata benda dan menunjukkan kepemilikan: わたしのほん berarti buku saya.",material:"Bab 2 · Pola N1 の N2"},
  {category:"Tata bahasa",instruction:"Pilih partikel yang tepat.",html:"まいあさ 7<ruby>時<rt>じ</rt></ruby>（　）おきます。",options:["で","に","を","へ"],answer:1,explanation:"Partikel に digunakan setelah waktu yang spesifik. 7時におきます berarti bangun pukul tujuh.",material:"Bab 4 · Waktu dan kegiatan"},
  {category:"Susunan kalimat",instruction:"Pilih susunan kalimat yang benar.",html:"“Saya pergi ke sekolah dengan bus.”",options:["バスで 学校へ 行きます。","学校で バスへ 行きます。","バスへ 学校で 行きます。","学校を バスに 行きます。"],answer:0,explanation:"Urutan yang alami adalah alat transportasi + で, tujuan + へ, lalu kata kerja: バスで 学校へ 行きます。",material:"Bab 5 · Perjalanan dan perpindahan"},
  {category:"Melengkapi kalimat",instruction:"Pilih bentuk kata kerja yang sesuai.",html:"きょうは <ruby>日曜日<rt>にちようび</rt></ruby>ですから、<ruby>会社<rt>かいしゃ</rt></ruby>へ（　）。",options:["行きます","行きません","行きました","行って"],answer:1,explanation:"Karena hari ini Minggu, pembicara tidak pergi ke kantor. Bentuk negatif sopan dari 行きます adalah 行きません.",material:"Bab 4 · Bentuk positif dan negatif"},
  {category:"Bacaan",instruction:"Baca teks pendek, lalu jawab pertanyaannya.",html:"わたしは マリアです。<ruby>毎朝<rt>まいあさ</rt></ruby> 6<ruby>時<rt>じ</rt></ruby>に おきます。7<ruby>時半<rt>じはん</rt></ruby>に <ruby>会社<rt>かいしゃ</rt></ruby>へ <ruby>行<rt>い</rt></ruby>きます。<br><small>マリアさんは なんじに 会社へ 行きますか。</small>",options:["6時","6時半","7時","7時半"],answer:3,explanation:"Kalimat 7時半に会社へ行きます menyatakan Maria pergi ke kantor pukul 07.30.",material:"Bab 4–5 · Membaca jadwal"},
  {category:"Mendengarkan",instruction:"Dengarkan audio, lalu pilih kalimat yang diucapkan.",html:"音声を聞いてください。",audio:"駅はどこですか。",options:["えきは どこですか。","いえは どこですか。","えきは ここですか。","みせは どこですか。"],answer:0,explanation:"Audio berbunyi 駅はどこですか（えきは どこですか）, artinya “Stasiun ada di mana?”.",material:"Bab 3 · Tempat dan arah"},
  {category:"Kanji",instruction:"Pilih arti kanji yang benar.",html:"<ruby>先生<rt>せんせい</rt></ruby>",options:["Peneliti","Pelajar","Guru","Pegawai"],answer:2,explanation:"先生（せんせい） berarti guru atau dosen. Kanji 先 bermakna dahulu/depan dan 生 berkaitan dengan hidup/lahir.",material:"Bab 1 · Profesi"},
  {category:"Situasi",instruction:"Pilih ungkapan yang paling sesuai dengan situasi.",html:"Di restoran, kamu ingin meminta air dengan sopan.",options:["みずを ください。","みずを いきます。","みずが います。","みずで ください。"],answer:0,explanation:"Pola benda + をください digunakan untuk meminta sesuatu dengan sopan: みずをください berarti “Tolong beri saya air.”",material:"Bab 7 · Meminta dan memberi"},
];
/* Paket soal siap pakai (bukan hasil generator acak per-bab) - diadaptasi
   dari soal latihan JLPT N5 publik (Uno Japano) supaya siswa juga bisa
   berlatih dengan format ujian resmi (4 mondai) selain paket per-bab. */
const mockTestPackages={
  "n5-d03":{
    label:"JLPT N5 (D03) · Kosakata & Kanji",
    source:"Uno Japano — unojapano.com/test/jlpt-n5-03-vocabulary",
    questions:[
      {category:"Cara Baca Kanji",instruction:"＿＿＿の ことばは ひらがなで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"<u>西</u>の そらに ほしが みえます。",options:["ひがし","にし","きた","みなみ"],answer:1,explanation:"西 dibaca “にし” dan berarti arah barat. 東=ひがし(timur), 北=きた(utara), 南=みなみ(selatan).",material:"Uno Japano · JLPT N5 D03 — Mondai 1 No.1"},
      {category:"Cara Baca Kanji",instruction:"＿＿＿の ことばは ひらがなで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"あの<u>白い</u> いえが わたしの いえです。",options:["ひろい","とおい","しろい","ひくい"],answer:2,explanation:"白い dibaca “しろい” dan berarti putih. ひろい=luas, とおい=jauh, ひくい=rendah.",material:"Uno Japano · JLPT N5 D03 — Mondai 1 No.2"},
      {category:"Cara Baca Kanji",instruction:"＿＿＿の ことばは ひらがなで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"なつに <u>海</u>へ いきました。",options:["やま","かわ","しま","うみ"],answer:3,explanation:"海 dibaca “うみ” dan berarti laut. 山=やま(gunung), 川=かわ(sungai), 島=しま(pulau).",material:"Uno Japano · JLPT N5 D03 — Mondai 1 No.3"},
      {category:"Cara Baca Kanji",instruction:"＿＿＿の ことばは ひらがなで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"ちちは いま ソファで <u>休んで</u> います。",options:["やすんで","のんで","ならんで","よろこんで"],answer:0,explanation:"休んで dibaca “やすんで”, dari kata kerja 休む (beristirahat).",material:"Uno Japano · JLPT N5 D03 — Mondai 1 No.4"},
      {category:"Cara Baca Kanji",instruction:"＿＿＿の ことばは ひらがなで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"<u>来週</u> くにへ かえります。",options:["らいしゅ","らいしゅう","らしゅ","らしゅう"],answer:1,explanation:"来週 dibaca “らいしゅう” dan berarti minggu depan. Perhatikan bunyi panjang しゅう.",material:"Uno Japano · JLPT N5 D03 — Mondai 1 No.5"},
      {category:"Cara Baca Kanji",instruction:"＿＿＿の ことばは ひらがなで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"りんごを <u>五つ</u> かいました。",options:["ごつ","いつ","いつつ","ごうつ"],answer:2,explanation:"五つ dibaca “いつつ”, bilangan asli Jepang untuk lima buah (ひとつ・ふたつ・みっつ・よっつ・いつつ…).",material:"Uno Japano · JLPT N5 D03 — Mondai 1 No.6"},
      {category:"Cara Baca Kanji",instruction:"＿＿＿の ことばは ひらがなで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"せまい <u>道</u>を とおります。",options:["とち","にわ","はし","みち"],answer:3,explanation:"道 dibaca “みち” dan berarti jalan.",material:"Uno Japano · JLPT N5 D03 — Mondai 1 No.7"},
      {category:"Cara Baca Kanji",instruction:"＿＿＿の ことばは ひらがなで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"きょうの <u>午後</u> ともだちに あいます。",options:["ごご","ごうご","ごごう","ごうごう"],answer:0,explanation:"午後 dibaca “ごご” dan berarti siang/sore (setelah tengah hari).",material:"Uno Japano · JLPT N5 D03 — Mondai 1 No.8"},
      {category:"Cara Baca Kanji",instruction:"＿＿＿の ことばは ひらがなで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"つくえの <u>上</u>に なにが ありますか。",options:["なか","した","うえ","よこ"],answer:2,explanation:"上 dibaca “うえ” dan berarti atas.",material:"Uno Japano · JLPT N5 D03 — Mondai 1 No.9"},
      {category:"Cara Baca Kanji",instruction:"＿＿＿の ことばは ひらがなで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"みせに ひとが <u>十人</u> います。",options:["じゅにん","じゅうにん","じゅじん","じゅうじん"],answer:1,explanation:"十人 dibaca “じゅうにん”, sepuluh orang. Perhatikan bunyi panjang じゅう.",material:"Uno Japano · JLPT N5 D03 — Mondai 1 No.10"},
      {category:"Cara Baca Kanji",instruction:"＿＿＿の ことばは ひらがなで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"<u>外国</u>に いきたいです。",options:["かいこく","かいごく","がいごく","がいこく"],answer:3,explanation:"外国 dibaca “がいこく” dan berarti luar negeri.",material:"Uno Japano · JLPT N5 D03 — Mondai 1 No.11"},
      {category:"Cara Baca Kanji",instruction:"＿＿＿の ことばは ひらがなで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"この えいがは <u>長い</u>です。",options:["ながい","やすい","たのしい","あたらしい"],answer:0,explanation:"長い dibaca “ながい” dan berarti panjang/lama.",material:"Uno Japano · JLPT N5 D03 — Mondai 1 No.12"},
      {category:"Penulisan Kanji",instruction:"＿＿＿の ことばは かんじで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"こどもたちが こうえんを <u>あるいて</u> います。",options:["走いて","足いて","歩いて","促いて"],answer:2,explanation:"あるいて ditulis 歩いて, dari kata kerja 歩く (berjalan).",material:"Uno Japano · JLPT N5 D03 — Mondai 2 No.13"},
      {category:"Penulisan Kanji",instruction:"＿＿＿の ことばは かんじで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"<u>ぱそこん</u>で しごとを します。",options:["パンコソ","パソコン","バツコシ","バシコツ"],answer:1,explanation:"ぱそこん (komputer) ditulis dengan katakana パソコン — perhatikan bentuk huruf yang mirip.",material:"Uno Japano · JLPT N5 D03 — Mondai 2 No.14"},
      {category:"Penulisan Kanji",instruction:"＿＿＿の ことばは かんじで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"ほんを <u>よんで</u> ください。",options:["読んで","語んで","話んで","伺んで"],answer:0,explanation:"よんで ditulis 読んで, dari kata kerja 読む (membaca).",material:"Uno Japano · JLPT N5 D03 — Mondai 2 No.15"},
      {category:"Penulisan Kanji",instruction:"＿＿＿の ことばは かんじで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"きょうは <u>てんき</u>が いいですね。",options:["夫木","天木","夫気","天気"],answer:3,explanation:"てんき (cuaca) ditulis 天気.",material:"Uno Japano · JLPT N5 D03 — Mondai 2 No.16"},
      {category:"Penulisan Kanji",instruction:"＿＿＿の ことばは かんじで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"きのうは <u>しんぶん</u>を よみませんでした。",options:["新文","新聞","親文","親聞"],answer:1,explanation:"しんぶん (koran) ditulis 新聞.",material:"Uno Japano · JLPT N5 D03 — Mondai 2 No.17"},
      {category:"Penulisan Kanji",instruction:"＿＿＿の ことばは かんじで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"ちかくに <u>ふるい</u> アパートが あります。",options:["由い","百い","古い","苦い"],answer:2,explanation:"ふるい (tua/lama) ditulis 古い.",material:"Uno Japano · JLPT N5 D03 — Mondai 2 No.18"},
      {category:"Penulisan Kanji",instruction:"＿＿＿の ことばは かんじで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"<u>とも</u>だちと いっしょに がっこうへ いきます。",options:["支","反","有","友"],answer:3,explanation:"とも(だち) ditulis 友, dari kata 友だち (teman).",material:"Uno Japano · JLPT N5 D03 — Mondai 2 No.19"},
      {category:"Penulisan Kanji",instruction:"＿＿＿の ことばは かんじで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"<u>じかん</u>が ありません。",options:["時間","時問","寺間","寺問"],answer:0,explanation:"じかん (waktu) ditulis 時間. Hati-hati membedakan 間 dengan 問 yang bentuknya mirip.",material:"Uno Japano · JLPT N5 D03 — Mondai 2 No.20"},
      {category:"Kosakata",instruction:"（　）に なにを いれますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"（　）で かいものを しましょう。",options:["スプーン","スーパー","スペース","スポーツ"],answer:1,explanation:"“Ayo berbelanja di ___.” Jawaban yang tepat adalah スーパー (supermarket).",material:"Uno Japano · JLPT N5 D03 — Mondai 3 No.21"},
      {category:"Kosakata",instruction:"（　）に なにを いれますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"いえから かいしゃまで １じかん（　）。",options:["たちます","いきます","かかります","します"],answer:2,explanation:"“Dari rumah ke kantor perlu waktu 1 jam.” かかります dipakai untuk menyatakan waktu yang diperlukan.",material:"Uno Japano · JLPT N5 D03 — Mondai 3 No.22"},
      {category:"Kosakata",instruction:"（　）に なにを いれますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"ほんを たくさん いれましたから、かばんが とても（　）です。",options:["おもい","かるい","よわい","たかい"],answer:0,explanation:"Karena banyak buku dimasukkan, tasnya jadi sangat おもい (berat).",material:"Uno Japano · JLPT N5 D03 — Mondai 3 No.23"},
      {category:"Kosakata",instruction:"（　）に なにを いれますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"ゆうこさんは あまり はなしません。（　）な ひとです。",options:["ひま","ふべん","にぎやか","しずか"],answer:3,explanation:"Yuko tidak banyak bicara, jadi ia orang yang しずか (pendiam/tenang).",material:"Uno Japano · JLPT N5 D03 — Mondai 3 No.24"},
      {category:"Kosakata",instruction:"（　）に なにを いれますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"よごれた シャツを（　）しました。",options:["よしゅう","しつもん","せんたく","あいさつ"],answer:2,explanation:"Kemeja yang kotor di せんたく (dicuci).",material:"Uno Japano · JLPT N5 D03 — Mondai 3 No.25"},
      {category:"Kosakata",instruction:"（　）に なにを いれますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"ともだちの いえに くるまが ３（　）あります。",options:["まい","だい","かい","こ"],answer:1,explanation:"Kata bantu bilangan untuk kendaraan/mesin adalah だい.",material:"Uno Japano · JLPT N5 D03 — Mondai 3 No.26"},
      {category:"Kosakata",instruction:"（　）に なにを いれますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"かんじを（　）。おしえて ください。",options:["わすれました","おぼえました","のみました","しりました"],answer:0,explanation:"“Saya lupa kanjinya. Tolong ajari saya.” わすれました (lupa) paling sesuai dengan permintaan diajari.",material:"Uno Japano · JLPT N5 D03 — Mondai 3 No.27"},
      {category:"Kosakata",instruction:"（　）に なにを いれますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"（　）ですね。でんきを つけましょう。",options:["せまい","くろい","くらい","うすい"],answer:2,explanation:"“Gelap ya. Ayo nyalakan lampu.” くらい berarti gelap.",material:"Uno Japano · JLPT N5 D03 — Mondai 3 No.28"},
      {category:"Kosakata",instruction:"（　）に なにを いれますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"はじめまして。（　）よろしく おねがいします。",options:["どうも","どうぞ","とても","どんな"],answer:1,explanation:"Ungkapan baku perkenalan: はじめまして。どうぞ よろしく おねがいします。",material:"Uno Japano · JLPT N5 D03 — Mondai 3 No.29"},
      {category:"Kosakata",instruction:"（　）に なにを いれますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"わからない ことばが ありましたから、（　）を みました。",options:["とけい","つくえ","えんぴつ","じしょ"],answer:3,explanation:"Karena ada kata yang tidak dimengerti, saya melihat じしょ (kamus).",material:"Uno Japano · JLPT N5 D03 — Mondai 3 No.30"},
      {category:"Parafrasa",instruction:"＿＿＿の ぶんと だいたい おなじ いみの ぶんが あります。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"リーさんは いもうとが ひとりと おとうとが ふたり います。",options:["リーさんは ３にん きょうだいです。","リーさんは ４にん きょうだいです。","リーさんは ５にん きょうだいです。","リーさんは きょうだいの なかで いちばん わかいです。"],answer:1,explanation:"1 adik perempuan + 2 adik laki-laki + Lee sendiri = 4 orang bersaudara.",material:"Uno Japano · JLPT N5 D03 — Mondai 4 No.31"},
      {category:"Parafrasa",instruction:"＿＿＿の ぶんと だいたい おなじ いみの ぶんが あります。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"きょうは しゅくだいが すくないです。",options:["きょうは しゅくだいが たくさん あります。","きょうは しゅくだいが あまり ありません。","きょうは しゅくだいが ありません。","きょうは しゅくだいが むずかしいです。"],answer:1,explanation:"すくない (sedikit) semakna dengan あまり ありません (tidak terlalu banyak).",material:"Uno Japano · JLPT N5 D03 — Mondai 4 No.32"},
      {category:"Parafrasa",instruction:"＿＿＿の ぶんと だいたい おなじ いみの ぶんが あります。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"へやを そうじしました。",options:["へやを あかるく しました。","へやを きれいに しました。","へやを あたらしく しました。","へやを かわいく しました。"],answer:1,explanation:"そうじしました (membersihkan) semakna dengan membuat kamar きれいに (bersih).",material:"Uno Japano · JLPT N5 D03 — Mondai 4 No.33"},
      {category:"Parafrasa",instruction:"＿＿＿の ぶんと だいたい おなじ いみの ぶんが あります。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"がっこうに ちこくしました。",options:["がっこうを やすみました。","がっこうから はやく かえりました。","がっこうに はやく いきました。","がっこうに おそく いきました。"],answer:3,explanation:"ちこくしました (terlambat) berarti pergi ke sekolah おそく (terlambat/telat).",material:"Uno Japano · JLPT N5 D03 — Mondai 4 No.34"},
      {category:"Parafrasa",instruction:"＿＿＿の ぶんと だいたい おなじ いみの ぶんが あります。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"タンさんは シンさんに くにの しゃしんを みせました。",options:["タンさんは シンさんの くにで しゃしんを とりました。","タンさんは シンさんの くにの しゃしんを みました。","シンさんは タンさんの くにの しゃしんを みました。","シンさんは タンさんの くにで しゃしんを とりました。"],answer:2,explanation:"タンさんが みせた (memperlihatkan) berarti シンさんが みた (melihat) foto negara Tan.",material:"Uno Japano · JLPT N5 D03 — Mondai 4 No.35"}
    ]
  }
};

const $=id=>document.getElementById(id);
const testTypeLabels={vocabulary:"Kosakata",kanji:"Kanji",grammar:"Tata Bahasa",sentence:"Susunan Kalimat",reading:"Bacaan",audio:"Audio",situational:"Situasional"};
let questions=[...defaultQuestions],examType=new URLSearchParams(location.search).get("exam")==="jft"?"jft":"jlpt",testType="vocabulary",rangeStart=1,mockPackage="",current=0,mode="simulation",answers=Array(questions.length).fill(null),checked=Array(questions.length).fill(false),flags=Array(questions.length).fill(false),furigana=true,timerId=null,seconds=720,reviewOnly=false,reviewIndexes=[];
function shuffled(values){return [...values].sort(()=>Math.random()-.5)}
function collectRangeData(source){const rows=[];for(let bab=rangeStart;bab<rangeStart+5;bab++)(source[bab]||[]).forEach(item=>rows.push({item,bab}));return rows}
function optionSet(correct,pool){return shuffled([correct,...shuffled(pool.filter(value=>value&&value!==correct)).slice(0,3)])}
/* bab 1-25 = Buku 1 (lessonIndex 0-24), bab 26-50 = Buku 2 (lessonIndex
   0-24) - penomoran bab di data ini SAMA dengan penomoran Pelajaran di
   Materi Pelajaran, jadi soal bisa dipetakan balik ke item SRS yang
   sudah dipakai flashcard/materi (lihat srsId di tiap builder di bawah). */
function materiIdForBab(bab){return `materi:book${bab<=25?1:2}:${bab<=25?bab-1:bab-26}:0`}
function vocabularyQuestions(){const source=collectRangeData(babKosakataData),rows=shuffled(source).slice(0,10),meanings=source.map(row=>row.item[1]);return rows.map(({item,bab})=>{const options=optionSet(item[1],meanings);return{category:"Kosakata",instruction:"Pilih arti kosakata yang paling tepat.",html:item[0],options,answer:options.indexOf(item[1]),explanation:`${item[0]} berarti “${item[1]}”. Kosakata ini berasal dari Bab ${bab}.`,material:`Bab ${bab} · Kosakata`,srsId:`hafalan:bab${bab}:${item[0]}`}})}
function kanjiQuestions(){const source=collectRangeData(babKanjiData),rows=shuffled(source).slice(0,10),readings=source.map(row=>row.item[1]);return rows.map(({item,bab})=>{const options=optionSet(item[1],readings);return{category:"Kanji",instruction:"Pilih cara baca kanji yang benar.",html:`<ruby>${item[0]}<rt>${item[1]}</rt></ruby>`,options,answer:options.indexOf(item[1]),explanation:`${item[0]} dibaca ${item[1]} dan berarti “${item[2]}”.`,material:`Bab ${bab} · Kanji dan cara baca`,srsId:`kanji:${item[0]}`}})}
function grammarQuestions(){const result=[];for(let bab=rangeStart;bab<rangeStart+5;bab++){const item=tailoredQuizData[bab];if(item)result.push({category:"Tata Bahasa",instruction:`Pilih jawaban yang sesuai dengan pola Bab ${bab}.`,html:item[0],options:item[1],answer:item[2],explanation:item[3],material:`Bab ${bab} · Tata bahasa`,srsId:materiIdForBab(bab)})}return result}
function contextualQuestions(kind){const source=collectRangeData(babKanjiData),rows=shuffled(source).slice(0,10),allWords=source.map(row=>row.item[0]),allMeanings=source.map(row=>row.item[2]);return rows.map(({item,bab})=>{const [word,reading,meaning]=item;
  if(kind==="sentence"){const correct=`${word}を おぼえます。`,options=optionSet(correct,[`${word}が おぼえます。`,`${word}へ おぼえます。`,`おぼえます ${word}を。`]);return{category:"Susunan Kalimat",instruction:"Pilih susunan kalimat yang paling tepat.",html:`“Saya menghafalkan ${meaning}.”`,options,answer:options.indexOf(correct),explanation:`Objek ditandai を dan diletakkan sebelum kata kerja: ${correct}`,material:`Bab ${bab} · Kosakata dalam kalimat`,srsId:`kanji:${word}`}}
  if(kind==="reading"){const options=optionSet(meaning,allMeanings);return{category:"Bacaan",instruction:"Baca kalimat pendek, lalu pilih maknanya.",html:`これは <ruby>${word}<rt>${reading}</rt></ruby> です。`,options,answer:options.indexOf(meaning),explanation:`Kata ${word} (${reading}) pada teks berarti “${meaning}”.`,material:`Bab ${bab} · Bacaan pendek`,srsId:`kanji:${word}`}}
  if(kind==="audio"){const options=optionSet(word,allWords);return{category:"Audio",instruction:"Dengarkan audio, lalu pilih kata yang diucapkan.",html:"音声を聞いてください。",audio:reading,options,answer:options.indexOf(word),explanation:`Audio mengucapkan ${reading}, yaitu ${word} yang berarti “${meaning}”.`,material:`Bab ${bab} · Pemahaman audio`,srsId:`kanji:${word}`}}
  const correct=`${word}を ください。`,options=optionSet(correct,[`${word}へ ください。`,`${word}が ください。`,`${word}で ください。`]);return{category:"Situasional",instruction:"Pilih ungkapan yang paling sesuai dengan situasi.",html:`Kamu ingin meminta “${meaning}” dengan sopan.`,options,answer:options.indexOf(correct),explanation:`Pola benda + をください digunakan untuk meminta sesuatu dengan sopan: ${correct}`,material:`Bab ${bab} · Komunikasi praktis`,srsId:`kanji:${word}`}})}
function buildSelectedQuestions(){
  if(mockPackage){const pack=mockTestPackages[mockPackage];questions=[...pack.questions];$("heroQuestionTotal").textContent=questions.length;$("heroPackage").textContent=pack.label;return}
  const vocabulary=vocabularyQuestions(),kanji=kanjiQuestions(),grammar=grammarQuestions(),sentence=contextualQuestions("sentence"),reading=contextualQuestions("reading"),audio=contextualQuestions("audio"),situational=contextualQuestions("situational");
  questions=examType==="jlpt"?[...vocabulary.slice(0,2),...kanji.slice(0,2),...grammar.slice(0,2),sentence[0],...reading.slice(0,2),audio[0]]:[...vocabulary.slice(0,2),...reading.slice(0,2),...audio.slice(0,3),...situational.slice(0,3)];
  questions=questions.filter(Boolean);if(!questions.length)questions=[...defaultQuestions];$("heroQuestionTotal").textContent=questions.length;$("heroPackage").textContent=`Bab ${rangeStart}–${rangeStart+4}`;
}
function updatePackagePreview(){
  if(mockPackage){const pack=mockTestPackages[mockPackage];$("selectedTestName").textContent=pack.label;$("selectedRangeText").textContent=`Paket soal siap pakai (format resmi 4 mondai) dari ${pack.source}. Tetap untuk latihan mandiri, bukan soal resmi JLPT.`;$("heroExamType").textContent="JLPT";$("heroPackage").textContent=pack.label;return}
  const label=examType==="jlpt"?"Simulasi JLPT":"Simulasi JFT-Basic";$("selectedTestName").textContent=`${label} · Bab ${rangeStart}–${rangeStart+4}`;$("selectedRangeText").textContent=`Materi gabungan diambil dari Bab ${rangeStart}, ${rangeStart+1}, ${rangeStart+2}, ${rangeStart+3}, dan ${rangeStart+4}.`;$("heroExamType").textContent=examType==="jlpt"?"JLPT":"JFT";$("heroPackage").textContent=`Bab ${rangeStart}–${rangeStart+4}`}
function speak(text){if(!("speechSynthesis" in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="ja-JP";u.rate=.82;speechSynthesis.speak(u)}
function activeQuestionIndex(){return reviewOnly?reviewIndexes[current]:current}
function renderNavigator(){
  const grid=$("numberGrid");grid.replaceChildren();
  questions.forEach((_,index)=>{const b=document.createElement("button");b.textContent=index+1;b.classList.toggle("current",index===activeQuestionIndex());b.classList.toggle("answered",answers[index]!==null);b.classList.toggle("flagged",flags[index]);b.onclick=()=>{reviewOnly=false;current=index;renderQuestion()};grid.append(b)});
  $("answeredCount").textContent=`${answers.filter(v=>v!==null).length} / ${questions.length}`;$("temporaryScore").textContent=questions.filter((q,i)=>checked[i]&&answers[i]===q.answer).length;$("flaggedCount").textContent=flags.filter(Boolean).length;
}
function renderQuestion(){
  const index=activeQuestionIndex(),q=questions[index];
  $("categoryBadge").textContent=q.category.toUpperCase();$("questionCounter").textContent=reviewOnly?`Tinjauan ${current+1} dari ${reviewIndexes.length}`:`Soal ${index+1} dari ${questions.length}`;$("instruction").textContent=q.instruction;$("questionText").innerHTML=q.html;$("questionText").classList.toggle("hide-furigana",!furigana);$("testProgress").style.width=`${((reviewOnly?current:index)+1)/(reviewOnly?reviewIndexes.length:questions.length)*100}%`;
  $("audioButton").hidden=!q.audio;if(q.audio)$("audioButton").onclick=()=>speak(q.audio);
  const box=$("answers");box.replaceChildren();q.options.forEach((option,choice)=>{const b=document.createElement("button");b.innerHTML=`<b>${String.fromCharCode(65+choice)}</b><span></span>`;b.querySelector("span").textContent=option;b.classList.toggle("selected",answers[index]===choice);if(checked[index]||reviewOnly){b.disabled=true;b.classList.toggle("correct",choice===q.answer);b.classList.toggle("wrong",answers[index]===choice&&choice!==q.answer)}b.onclick=()=>{answers[index]=choice;renderQuestion()};box.append(b)});
  const showExplanation=(checked[index]&&mode==="practice")||reviewOnly;$("explanation").hidden=!showExplanation;if(showExplanation){const correct=answers[index]===q.answer;$("explanation").className=`explanation${correct?"":" wrong"}`;$("explanation").innerHTML=`<b>${correct?"Jawaban benar":"Belum tepat"}</b>${q.explanation}`}
  $("flagQuestion").classList.toggle("active",flags[index]);$("flagQuestion").textContent=flags[index]?"★ Ditandai":"☆ Tandai soal";$("previousQuestion").disabled=current===0;$("checkAnswer").hidden=reviewOnly||checked[index]||mode==="simulation";$("checkAnswer").textContent="Periksa jawaban";$("nextQuestion").hidden=reviewOnly||(!checked[index]&&mode==="practice");$("nextQuestion").textContent=index===questions.length-1?"Lihat hasil →":"Soal berikutnya →";
  if(mode==="simulation"&&!reviewOnly){$("checkAnswer").hidden=false;$("checkAnswer").textContent=index===questions.length-1?"Simpan & lihat hasil":"Simpan & berikutnya"}
  renderNavigator();
}
function checkOrAdvance(){
  const index=activeQuestionIndex();if(answers[index]===null){$("explanation").hidden=false;$("explanation").className="explanation wrong";$("explanation").innerHTML="<b>Pilih satu jawaban terlebih dahulu.</b>Setelah memilih, jawaban dapat diperiksa.";return}
  checked[index]=true;if(mode==="simulation"){if(index===questions.length-1)finishTest();else{current++;renderQuestion()}}else renderQuestion();
}
function advance(){if(activeQuestionIndex()===questions.length-1)finishTest();else{current++;renderQuestion()}}
function categoryScores(){const result={};questions.forEach((q,i)=>{result[q.category]??={correct:0,total:0};result[q.category].total++;if(answers[i]===q.answer)result[q.category].correct++});return result}
/* Kirim hasil ke Supabase (fire-and-forget, sama seperti srsPushItem di
   srs.js) supaya XP, status "quiz" di dashboard, dan panel Pantau Siswa
   ikut mencatat sesi ini. Gagal kirim (offline, dsb.) sengaja dibiarkan
   diam - tidak boleh mengganggu hasil yang sudah ditampilkan ke siswa. */
function submitQuizResult(correct,total,catScores){
  if(!window.supabaseClient)return;
  window.supabaseClient.auth.getUser().then(({data})=>{
    const uid=data&&data.user&&data.user.id;
    if(!uid)return;
    return window.supabaseClient.from("quiz_results").insert({user_id:uid,exam_type:examType,correct_count:correct,total_count:total,category_scores:catScores});
  }).then((res)=>{if(res&&res.error)console.warn("submitQuizResult gagal:",res.error.message)}).catch(()=>{});
}
/* Jawaban benar/salah dikirim sebagai review SRS ke halaman utama (iframe
   ini tidak memuat srs.js sendiri, tapi window.parent yang menampung
   iframe ini sudah memuatnya - sama origin, aman diakses). Ini yang
   membuat kesalahan di quiz benar-benar terjadwal untuk diulang lewat
   SRS, bukan cuma tampil sekali di bank kesalahan lalu terlupakan. */
function pushQuizAnswersToSrs(){
  if(!window.parent||typeof window.parent.srsReview!=="function")return;
  questions.forEach((q,i)=>{
    if(!q.srsId)return;
    try{window.parent.srsReview(q.srsId,answers[i]===q.answer?"good":"again")}catch(e){}
  });
}
function finishTest(){
  clearInterval(timerId);checked=checked.map(()=>true);const correct=questions.filter((q,i)=>answers[i]===q.answer).length,score=Math.round(correct/questions.length*100);$("testScreen").hidden=true;$("resultScreen").hidden=false;$("finalScore").textContent=score;$("resultTitle").textContent=score>=80?"Fondasi kamu sudah kuat.":score>=60?"Fondasi sudah terbentuk.":"Mari perkuat dasar sedikit lagi.";$("resultSummary").textContent=`${correct} dari ${questions.length} soal benar. ${questions.length-correct} soal tersimpan dalam bank kesalahan untuk ditinjau kembali.`;
  submitQuizResult(correct,questions.length,categoryScores());
  pushQuizAnswersToSrs();
  const categoryBox=$("categoryResults");categoryBox.replaceChildren();Object.entries(categoryScores()).forEach(([name,value])=>{const pct=Math.round(value.correct/value.total*100),row=document.createElement("div");row.innerHTML=`<span>${name}</span><i style="--score:${pct}%"></i><b>${pct}%</b>`;categoryBox.append(row)});
  const weakest=Object.entries(categoryScores()).sort((a,b)=>a[1].correct/a[1].total-b[1].correct/b[1].total).slice(0,2);$("recommendations").innerHTML=weakest.map(([name])=>`<div><b>Perkuat ${name}</b>Ulangi materi dan latihan terkait sebelum mencoba simulasi berikutnya.</div>`).join("")+`<div><b>Ulangi bank kesalahan</b>Fokuskan sesi berikutnya pada ${questions.length-correct} soal yang masih salah.</div>`;
  reviewIndexes=questions.map((q,i)=>answers[i]!==q.answer?i:-1).filter(i=>i>=0);const list=$("mistakeList");list.replaceChildren();reviewIndexes.forEach(i=>{const q=questions[i],a=document.createElement("article");a.innerHTML=`<b>Soal ${i+1} · ${q.category}</b><p>Jawabanmu: ${answers[i]===null?"Belum dijawab":q.options[answers[i]]} · Jawaban benar: ${q.options[q.answer]}</p><p>${q.explanation}</p><small>Pelajari kembali: ${q.material}</small>`;list.append(a)});window.scrollTo({top:0,behavior:"smooth"});
}
function startTimer(){clearInterval(timerId);seconds=Math.max(720,questions.length*40);const m0=String(Math.floor(seconds/60)).padStart(2,"0"),s0=String(seconds%60).padStart(2,"0");$("timer").textContent=`${m0}:${s0}`;if(!$("timerEnabled").checked){$("timer").textContent="Tanpa timer";return}timerId=setInterval(()=>{seconds--;const m=String(Math.floor(seconds/60)).padStart(2,"0"),s=String(seconds%60).padStart(2,"0");$("timer").textContent=`${m}:${s}`;if(seconds<=0)finishTest()},1000)}
function startTest(){if(!questionBankReady)return;buildSelectedQuestions();current=0;answers=Array(questions.length).fill(null);checked=Array(questions.length).fill(false);flags=Array(questions.length).fill(false);reviewOnly=false;$("startScreen").hidden=true;$("resultScreen").hidden=true;$("testScreen").hidden=false;startTimer();renderQuestion();window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll("#examChoice button").forEach(button=>button.onclick=()=>{examType=button.dataset.exam;document.querySelectorAll("#examChoice button").forEach(item=>item.classList.toggle("active",item===button));updatePackagePreview()});
$("chapterRange").onchange=()=>{rangeStart=Number($("chapterRange").value);updatePackagePreview()};
$("mockPackage").onchange=()=>{
  mockPackage=$("mockPackage").value;
  document.querySelectorAll("#examChoice button").forEach(button=>button.disabled=!!mockPackage);
  $("chapterRange").disabled=!!mockPackage;
  $("chapterRangeBlock").classList.toggle("disabled",!!mockPackage);
  updatePackagePreview();
};
document.querySelectorAll("#modeChoice button").forEach(b=>b.onclick=()=>{mode=b.dataset.mode;document.querySelectorAll("#modeChoice button").forEach(x=>x.classList.toggle("active",x===b))});
updatePackagePreview();
$("startTest").onclick=startTest;$("checkAnswer").onclick=checkOrAdvance;$("nextQuestion").onclick=advance;$("previousQuestion").onclick=()=>{if(current>0){current--;renderQuestion()}};$("flagQuestion").onclick=()=>{const i=activeQuestionIndex();flags[i]=!flags[i];renderQuestion()};$("furiganaToggle").onclick=()=>{furigana=!furigana;$("furiganaToggle").textContent=`振 Furigana: ${furigana?"aktif":"mati"}`;renderQuestion()};$("finishEarly").onclick=finishTest;$("restartTest").onclick=()=>{$("resultScreen").hidden=true;$("startScreen").hidden=false;window.scrollTo({top:0,behavior:"smooth"})};$("reviewMistakes").onclick=()=>{$("mistakeBank").hidden=false;$("mistakeBank").scrollIntoView({behavior:"smooth"})};$("closeMistakes").onclick=()=>{$("mistakeBank").hidden=true};
