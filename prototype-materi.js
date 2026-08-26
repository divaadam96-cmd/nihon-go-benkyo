const materiEmbedMode = new URLSearchParams(location.search).get("embed") === "1";
document.body.classList.toggle("embed-mode", materiEmbedMode);

const lessons = [
  ["Kalimat nominal dasar","N1 は N2 です","わたしは 学生です。","Saya adalah pelajar.","Memperkenalkan diri dan menjelaskan identitas dengan kalimat sopan."],
  ["Kata tunjuk dan persamaan","これは N です","これは 辞書です。","Ini adalah kamus.","Menunjuk benda dan menjelaskan kepemilikan atau jenisnya."],
  ["Tempat, gedung, dan arah","N は ここ／そこ／あそこです","食堂は 二階です。","Kantin berada di lantai dua.","Menanyakan dan menjelaskan tempat, lantai, serta arah."],
  ["Waktu dan kegiatan harian","Waktu に Vます","六時半に 起きます。","Saya bangun pukul setengah tujuh.","Menyebut waktu dan menceritakan kegiatan sehari-hari."],
  ["Perjalanan dan perpindahan","Tempat へ 行きます","京都へ 行きます。","Saya pergi ke Kyoto.","Menceritakan tujuan, kendaraan, teman, dan waktu perjalanan."],
  ["Aktivitas dan ajakan","N を Vます","図書館で 本を 読みます。","Saya membaca buku di perpustakaan.","Menyatakan aktivitas serta mengajak orang melakukan sesuatu."],
  ["Memberi, menerima, alat, bahasa","Alat で Vます","はしで ご飯を 食べます。","Saya makan nasi dengan sumpit.","Menjelaskan alat, bahasa, serta kegiatan memberi dan menerima."],
  ["Kata sifat dan perbandingan","N は い／な形容詞です","奈良は 静かな 町です。","Nara adalah kota yang tenang.","Mendeskripsikan sifat, kesan, dan perbandingan sederhana."],
  ["Kesukaan, kemampuan, dan jumlah","N が 好きです","日本料理が 好きです。","Saya suka masakan Jepang.","Mengungkapkan kesukaan, kemampuan, dan tingkat pemahaman."],
  ["Keberadaan dan posisi","Tempat に N が あります／います","机の 上に 本が あります。","Ada buku di atas meja.","Menjelaskan keberadaan orang, hewan, dan benda."],
  ["Bilangan, frekuensi, dan durasi","Periode に Jumlah Vます","一週間に 三回 勉強します。","Saya belajar tiga kali seminggu.","Menggunakan kata bantu bilangan, frekuensi, dan durasi."],
  ["Bentuk lampau dan perbandingan","N は 形容詞かったです","きのうは 寒かったです。","Kemarin dingin.","Menceritakan keadaan lampau dan membandingkan dua hal."],
  ["Keinginan dan harapan","N が ほしいです／Vたいです","日本へ 行きたいです。","Saya ingin pergi ke Jepang.","Mengungkapkan benda dan kegiatan yang diinginkan."],
  ["Bentuk て dan permintaan","Vて ください","ここに 名前を 書いて ください。","Tolong tulis nama di sini.","Membuat permintaan dan menghubungkan tindakan dengan bentuk て."],
  ["Izin, larangan, dan keadaan","Vても いいです","ここで 写真を 撮っても いいです。","Boleh memotret di sini.","Meminta izin, menyatakan larangan, dan menjelaskan keadaan."],
  ["Menyambungkan kalimat","Vて、Vて、それから Vます","ご飯を 食べて、勉強します。","Saya makan lalu belajar.","Menyusun beberapa aktivitas dan sifat dalam satu rangkaian."],
  ["Bentuk ない dan aturan","Vなければ なりません","勉強しなければ なりません。","Saya harus belajar.","Mengungkapkan kewajiban, larangan, dan hal yang tidak perlu."],
  ["Bentuk kamus dan kemampuan","V辞書形 ことが できます","日本語を 話すことが できます。","Saya bisa berbicara bahasa Jepang.","Menyatakan kemampuan, hobi, dan kegiatan sebelum aktivitas lain."],
  ["Pengalaman, perubahan, kebiasaan","Vた ことが あります","富士山に 登ったことが あります。","Saya pernah mendaki Gunung Fuji.","Menceritakan pengalaman dan perubahan kebiasaan."],
  ["Bentuk biasa dan percakapan informal","V普通形","明日 映画を 見る。","Besok saya menonton film.","Menggunakan bentuk biasa dalam percakapan yang akrab."],
  ["Pendapat dan informasi kutipan","Bentuk biasa と 思います","日本は 便利だと 思います。","Menurut saya Jepang itu praktis.","Menyampaikan pendapat, perkiraan, dan ucapan orang lain."],
  ["Klausa penjelas untuk kata benda","Klausa biasa + N","これは 先生が 書いた 本です。","Ini buku yang ditulis guru.","Menerangkan orang atau benda menggunakan klausa."],
  ["Waktu dan hubungan kondisi","V辞書形／Vた とき","日本へ 行くとき、かばんを 買いました。","Saya membeli tas ketika akan pergi ke Jepang.","Menjelaskan kapan sesuatu terjadi dan hasil suatu kondisi."],
  ["Memberi dan menerima bantuan","Vて あげます／もらいます","友達に 荷物を 持って もらいました。","Saya dibantu teman membawakan barang.","Mengungkapkan bantuan yang diberikan atau diterima."],
  ["Pengandaian dan syarat","Vたら","雨が 降ったら、家に います。","Kalau hujan, saya tinggal di rumah.","Menyatakan syarat, pengandaian, dan hasil yang mengikuti."],
];

const status = lessons.map((_,index)=>index<4?"done":index===4?"repeat":"new");
let currentLesson=0;
const grid=document.getElementById("lessonGrid");
const reader=document.getElementById("focusReader");
const sourceFrame=document.getElementById("sourceApp");
let currentBook=1;
const bookTwoLessons=Array.from({length:25},(_,index)=>`Materi menengah Pelajaran ${index+26}`);
let checkQuestions=[];
let checkQuestionIndex=0;
let checkScore=0;

function buildCheckQuestions(index){
  const lesson=lessons[index]||lessons[0];
  const [title,formula,japanese,meaning]=lesson;
  const particleQuestions=[
    ["わたし（　）学生です。","は"],["これは わたし（　）本です。","の"],["学校（　）どこですか。","は"],["七時（　）起きます。","に"],["京都（　）行きます。","へ"],
    ["図書館（　）本を読みます。","で"],["はし（　）ご飯を食べます。","で"],["奈良（　）静かな町です。","は"],["日本料理（　）好きです。","が"],["机の上（　）本があります。","に"],
    ["一週間（　）三回勉強します。","に"],["きのう（　）寒かったです。","は"],["日本へ行きたい（　）です。","です"],["名前を書い（　）ください。","て"],["写真を撮ってもいい（　）すか。","で"],
    ["ご飯を食べ（　）、勉強します。","て"],["勉強しなけれ（　）なりません。","ば"],["話すこと（　）できます。","が"],["登ったこと（　）あります。","が"],["明日（　）映画を見る。","は"],
    ["便利だ（　）思います。","と"],["先生（　）書いた本です。","が"],["日本へ行く（　）、かばんを買いました。","とき"],["友達に持って（　）いました。","もら"],["雨が降っ（　）、家にいます。","たら"],
  ];
  const [particleSentence,particleAnswer]=particleQuestions[index]||particleQuestions[0];
  const particleOptions=[particleAnswer,"を","に","で"].filter((value,optionIndex,array)=>value||optionIndex===0).filter((value,optionIndex,array)=>array.indexOf(value)===optionIndex).slice(0,4);
  return [
    {type:"Partikel",prompt:`${title}: pilih partikel yang tepat.`,question:particleSentence,options:particleOptions,answer:0},
    {type:"Susun kalimat",prompt:`Susun contoh yang sesuai dengan materi ${title}.`,question:`Arti: ${meaning}`,options:[japanese,japanese.split(" ").reverse().join(" "),`${japanese} です。`,"これは 学生です。"],answer:0},
    {type:"Bahasa Jepang",prompt:`Ubah arti berikut sesuai materi ${title}.`,question:meaning,options:[japanese,"これは 先生です。","どこへ 行きますか。","本を 読みません。"],answer:0},
    {type:"Lengkapi",prompt:`Lengkapi pola utama Bab ${index+1}.`,question:`Contoh: ${japanese}\nPilih pola yang melengkapi contoh tersebut.`,options:[formula,"N を ください","Vては いけません","N が あります"],answer:0},
  ];
}

function renderCheckQuiz(){
  const question=checkQuestions[checkQuestionIndex];
  const answerGrid=document.getElementById("answerGrid");
  const nextButton=document.getElementById("nextCheck");
  document.getElementById("checkProgress").textContent=`Soal ${checkQuestionIndex+1} dari ${checkQuestions.length}`;
  document.getElementById("checkTitle").textContent=`${question.type}: ${question.prompt}`;
  document.getElementById("checkFeedback").textContent="";
  document.getElementById("checkScore").textContent=`Skor: ${checkScore} / ${checkQuestions.length}`;
  nextButton.hidden=true;
  nextButton.textContent=checkQuestionIndex===checkQuestions.length-1?"Ulangi tes":"Soal berikutnya →";
  answerGrid.replaceChildren();
  question.options.forEach((option,optionIndex)=>{
    const button=document.createElement("button");
    button.type="button";
    button.className="answer-option";
    button.innerHTML=`<b>${optionIndex+1}</b> <span></span>`;
    button.querySelector("span").textContent=option;
    button.onclick=()=>{
      answerGrid.querySelectorAll("button").forEach((item)=>{item.disabled=true});
      const correct=optionIndex===question.answer;
      button.classList.add(correct?"correct":"wrong");
      if(!correct) answerGrid.children[question.answer].classList.add("correct");
      if(correct) checkScore+=1;
      document.getElementById("checkFeedback").textContent=correct?"Benar. Penguasaan babmu bertambah.":"Belum tepat. Perhatikan pola yang ditandai hijau.";
      document.getElementById("checkScore").textContent=`Skor: ${checkScore} / ${checkQuestions.length}`;
      nextButton.hidden=false;
    };
    answerGrid.appendChild(button);
  });
}

function getFullLessonContent(index){
  const sourceDocument=sourceFrame.contentDocument;
  if(!sourceDocument) return null;
  const root=sourceDocument.querySelector(currentBook===1?"#materials":"#book2");
  if(!root) return null;
  if(index===0){
    return root.querySelector(".material-reader-body .html-content") || root.querySelector(".html-course > .html-lesson .html-content");
  }
  return root.querySelectorAll(".html-course > .html-lesson")[index]?.querySelector(".html-content") || null;
}

function renderCompletePatterns(index,fallback){
  const patternList=document.getElementById("patternList");
  const sourceContent=getFullLessonContent(index);
  if(!sourceContent){
    patternList.innerHTML=fallback;
    return;
  }
  const clonedContent=sourceContent.cloneNode(true);
  clonedContent.classList.add("prototype-full-content");
  clonedContent.querySelectorAll(".lesson-quiz,.html-note,.lesson-dialog-example").forEach(element=>element.remove());
  const note=document.createElement("p");
  note.className="full-pattern-note";
  const totalPatterns=clonedContent.querySelectorAll(":scope > .grammar-point, :scope > .lesson-points > li").length;
  note.textContent=`✓ Seluruh ${totalPatterns || ""} pola dan poin materi asli ditampilkan tanpa dikurangi.`;
  patternList.replaceChildren(note,clonedContent);
}

function renderGrid(){
  grid.innerHTML="";
  const sourceLessons=currentBook===1?lessons:bookTwoLessons;
  const start=currentBook===1?1:26;
  sourceLessons.forEach((lesson,index)=>{
    const button=document.createElement("button");
    button.type="button";
    button.className=`lesson-card ${status[index]}${currentLesson===index?" current":""}`;
    const title=currentBook===1?lesson[0]:lesson;
    button.innerHTML=`<span class="lesson-card-top"><span class="lesson-number">PELAJARAN ${String(start+index).padStart(2,"0")}</span><i class="lesson-status"></i></span><b>${title}</b><small>${status[index]==="done"?"Sudah dipahami":status[index]==="repeat"?"Perlu diulang":"Belum dimulai"}</small>`;
    button.onclick=()=>openLesson(index,true);
    grid.appendChild(button);
  });
  updateProgress();
}

function openLesson(index,scroll=false){
  currentLesson=Math.max(0,Math.min(lessons.length-1,index));
  const lesson=currentBook===1?lessons[currentLesson]:[bookTwoLessons[currentLesson],"Pola tata bahasa buku 2","Materi lengkap Buku 2.","Pelajari materi menengah.","Memahami pola bahasa Jepang tingkat menengah."];
  const [title,formula,japanese,meaning,goal]=lesson;
  const number=(currentBook===1?1:26)+currentLesson;
  document.getElementById("readerPosition").textContent=`Pelajaran ${number} dari ${currentBook===1?25:50}`;
  document.getElementById("readerEyebrow").textContent=`PELAJARAN ${String(number).padStart(2,"0")} · ${currentBook===1?"DASAR":"MENENGAH"}`;
  document.getElementById("readerTitle").textContent=title;
  document.getElementById("readerGoal").textContent=goal;
  const fallbackPattern=`<section class="pattern-card"><span class="pattern-index">MEMUAT MATERI LENGKAP</span><h3>${title}</h3><p>${goal} Seluruh pola dari materi asli akan muncul setelah sumber selesai dimuat.</p><div class="formula">${formula}</div><div class="example"><span class="example-label">CONTOH</span><div><b>${japanese}</b><span>${meaning}</span></div></div></section>`;
  renderCompletePatterns(currentLesson,fallbackPattern);
  document.getElementById("previousLesson").disabled=currentLesson===0;
  document.getElementById("nextLesson").disabled=currentLesson===24;
  renderGrid();
  if(scroll) reader.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
}

function updateProgress(){
  const done=status.filter(item=>item==="done").length;
  const repeat=status.filter(item=>item==="repeat").length;
  const fresh=25-done-repeat;
  const percent=Math.round(done/25*100);
  document.getElementById("doneCount").textContent=done;
  document.getElementById("repeatCount").textContent=repeat;
  document.getElementById("newCount").textContent=fresh;
  document.getElementById("topProgress").textContent=`${done} / 25`;
  document.getElementById("progressPercent").textContent=`${percent}%`;
  document.getElementById("progressRing").style.setProperty("--progress",`${percent}%`);
}

function setLearningStep(step, shouldScroll = true) {
  const targets = {
    patterns: document.getElementById("patternList"),
    examples: document.querySelector("#patternList .grammar-example") || document.getElementById("patternList"),
    check: document.querySelector(".micro-check"),
  };
  document.querySelectorAll("[data-learning-step]").forEach((button) =>
    button.classList.toggle("active", button.dataset.learningStep === step),
  );
  if (shouldScroll) targets[step]?.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelectorAll("[data-open-lesson]").forEach(button=>button.onclick=()=>openLesson(Number(button.dataset.openLesson),true));
document.getElementById("backToDirectory").onclick=()=>document.getElementById("lessonDirectory").scrollIntoView({behavior:"smooth"});
document.getElementById("previousLesson").onclick=()=>openLesson(currentLesson-1,true);
document.getElementById("nextLesson").onclick=()=>openLesson(currentLesson+1,true);
document.getElementById("markRepeat").onclick=()=>{status[currentLesson]="repeat";renderGrid()};
document.getElementById("markUnderstood").onclick=()=>{status[currentLesson]="done";renderGrid();if(currentLesson<24)openLesson(currentLesson+1,true)};
document.querySelectorAll("[data-book]").forEach((button)=>{
  button.onclick=()=>{
    currentBook=Number(button.dataset.book);
    currentLesson=0;
    document.querySelectorAll("[data-book]").forEach((item)=>item.classList.toggle("active",item===button));
    document.getElementById("directoryTitle").textContent=currentBook===1?"Pelajaran 1–25":"Pelajaran 26–50";
    document.getElementById("readerPosition").textContent=currentBook===1?"Pelajaran 1 dari 25":"Pelajaran 26 dari 50";
    document.querySelector(".progress-panel h2").textContent=`Perjalanan ${currentBook===1?"Buku 1":"Buku 2"}`;
    document.querySelector(".today-card b").textContent=currentBook===1?"Pelajaran 5":"Pelajaran 30";
    document.querySelector(".today-card p").textContent=currentBook===1?"Perjalanan dan perpindahan":"Materi menengah";
    renderGrid();
    openLesson(0,false);
  };
});
document.querySelectorAll("[data-learning-step]").forEach((button)=>{
  button.onclick=()=>setLearningStep(button.dataset.learningStep);
});

sourceFrame.addEventListener("load",()=>openLesson(currentLesson));

renderGrid();
openLesson(0);
