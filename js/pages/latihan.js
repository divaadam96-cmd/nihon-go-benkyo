/* Halaman Tes Kemampuan (pages/latihan.html). Dulu prototype-tes-v2.js yang
   jalan langsung begitu skrip termuat; sekarang dibungkus initPage() dan
   dijalankan auth.js SETELAH login, sama seperti halaman lain, supaya
   header/sidebar bersama (js/app-shell.js) selalu terpasang dulu. */
function initPage() {
const examEmbedMode=new URLSearchParams(location.search).get("embed")==="1";
document.body.classList.toggle("embed-mode",examEmbedMode);
/* Soal tes (paket siap pakai & per-5-Bab) beserta kunci jawabannya ada di
   database (package_questions / quiz_questions) - browser hanya menerima
   soal TANPA kunci lewat get_test_questions(), dan penilaian + penyimpanan
   nilai dilakukan server lewat grade_test(). Lihat
   supabase/secure-test-grading.sql. Daftar paket (label, batas waktu,
   tampilan) juga dari database lewat list_test_packages() - paket baru
   cukup ditambahkan di tabel (supabase/contoh-tambah-paket.sql). */
let testPackages=[];
async function loadTestPackages(){
  try{const{data,error}=await window.supabaseClient.rpc("list_test_packages");if(!error&&data)testPackages=data}catch(e){}
}
function packageInfo(key){return testPackages.find(p=>p.key===key)||{key,label:key,mark:"SET",description:"",time_limit_minutes:60,one_page:false}}
/* HTML soal berasal dari database (bisa diedit Operator) - disaring dulu
   dengan allowlist tag & atribut class saja sebelum masuk innerHTML,
   supaya akun Operator yang bocor pun tidak bisa menyisipkan skrip. */
const SAFE_TAGS=new Set(["B","STRONG","I","EM","U","BR","SMALL","SPAN","DIV","P","RUBY","RT","RP","SUB","SUP","BLOCKQUOTE","TABLE","CAPTION","THEAD","TBODY","TR","TH","TD","UL","OL","LI"]);
const DROP_TAGS=new Set(["SCRIPT","STYLE","IFRAME","OBJECT","EMBED","TEMPLATE","NOSCRIPT","SVG","MATH","LINK","META","BASE","FORM"]);
function sanitizeHtml(html){
  const template=document.createElement("template");
  template.innerHTML=html==null?"":String(html);
  const clean=(node)=>{
    Array.from(node.childNodes).forEach(child=>{
      if(child.nodeType===Node.COMMENT_NODE){child.remove();return}
      if(child.nodeType!==Node.ELEMENT_NODE)return;
      if(DROP_TAGS.has(child.tagName)){child.remove();return}
      clean(child);
      if(!SAFE_TAGS.has(child.tagName)){child.replaceWith(...child.childNodes);return}
      Array.from(child.attributes).forEach(attr=>{if(attr.name!=="class")child.removeAttribute(attr.name)});
    });
  };
  clean(template.content);
  return template.innerHTML;
}
const $=id=>document.getElementById(id);
let questions=[],rangeStart=1,mockPackage="",current=0,answers=[],checked=[],flags=[],graded=false,furigana=true,timerId=null,seconds=720,reviewOnly=false,reviewIndexes=[],onePageExamRendered=false;
/* Kontrol akses tes kemampuan: siswa cuma boleh mulai tes lewat akses yang
   sudah diberikan Sensei/Operator (baris `assignments` dengan test_kind
   terisi). Sensei/Operator sendiri tetap pakai form pilih-bebas di bawah
   (dipakai untuk menyiapkan/mengecek soal), jadi gating ini hanya aktif
   kalau peran login-nya "siswa". */
let restrictedMode=false,accessAssignments=[],activeAssignmentId=null;
function escapeHtmlTes(text){const div=document.createElement("div");div.textContent=text==null?"":String(text);return div.innerHTML}
function shuffled(values){const list=[...values];for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]]}return list}
/* Pilihan jawaban diacak per siswa (kecuali soal Mendengarkan yang
   pilihannya nomor gambar/audio). order[i] = index pilihan ASLI untuk
   posisi tampil i - jawaban dikirim ke server dalam index asli, dan kunci
   dari server dipetakan balik ke posisi tampil setelah dinilai. Paket
   siap pakai sengaja TIDAK diacak urutan soalnya supaya format ujian
   resmi (Mondai 1→2→3→4) tetap utuh; per-5-Bab diacak supaya tiap
   pengulangan terasa berbeda. */
function rowToQuestion(row){
  const options=row.options||[];
  const order=row.category==="Mendengarkan"?options.map((_,i)=>i):shuffled(options.map((_,i)=>i));
  return {id:row.id,category:row.category,subcategory:row.subcategory||"",instruction:sanitizeHtml(row.instruction),html:sanitizeHtml(row.html),options:order.map(i=>String(options[i])),order,material:row.material||"",image:row.image||"",audioSrc:row.audio_src||"",srsId:row.srs_id||"",answer:undefined,explanation:""};
}
function currentTest(){return mockPackage?{kind:"paket",ref:mockPackage}:{kind:"bab",ref:String(rangeStart)}}
async function buildSelectedQuestions(){
  if(!window.supabaseClient)throw new Error("Koneksi ke server belum siap.");
  const {kind,ref}=currentTest();
  const {data,error}=await window.supabaseClient.rpc("get_test_questions",{p_kind:kind,p_ref:ref});
  if(error)throw error;
  if(!data||!data.length)throw new Error("Soal untuk tes ini belum tersedia.");
  const list=data.map(rowToQuestion);
  questions=mockPackage?list:shuffled(list);
  $("heroQuestionTotal").textContent=questions.length;
  $("heroPackage").textContent=mockPackage?packageInfo(mockPackage).label:`Bab ${rangeStart}–${rangeStart+4}`;
}
/* Bab soal per rentang untuk layar Kelola Soal (Operator) - baca langsung
   tabel quiz_questions (RLS hanya mengizinkan Operator/Sensei). */
function questionRowToObject(row){
  const q={category:row.category,instruction:row.instruction,html:row.html,options:row.options,answer:row.answer,explanation:row.explanation,material:row.material};
  if(row.srs_id)q.srsId=row.srs_id;
  return q;
}
async function fetchQuizQuestions(babRange,status){
  if(!window.supabaseClient)return null;
  try{
    const{data,error}=await window.supabaseClient.from("quiz_questions").select("*").eq("bab_range",babRange).eq("status",status).order("position",{ascending:true});
    if(error||!data||!data.length)return null;
    return data.map(questionRowToObject);
  }catch(e){return null}
}
/* Batas waktu wajib (tidak bisa dimatikan siswa): latihan per 5 bab
   maksimal 45 menit, simulasi paket maksimal 60 menit. */
function timeLimitSeconds(){return mockPackage?packageInfo(mockPackage).time_limit_minutes*60:2700}
function updateTimerInfo(){
  const minutes=timeLimitSeconds()/60;
  $("timerInfo").querySelector("b").textContent=`Timer ${minutes} menit`;
}
function updatePackagePreview(){
  updateTimerInfo();
  if(mockPackage){const pkg=packageInfo(mockPackage),label=pkg.label;$("selectedTestName").textContent=label;$("selectedRangeText").textContent=pkg.description||"Paket soal siap pakai.";$("heroExamType").textContent="Paket Siap Pakai";$("heroPackage").textContent=label;return}
  $("selectedTestName").textContent=`Ujian per 5 Bab · Bab ${rangeStart}–${rangeStart+4}`;$("selectedRangeText").textContent=`Soal disusun manual dari kosakata, kanji, dan pola kalimat Bab ${rangeStart}–${rangeStart+4}.`;$("heroExamType").textContent="Per 5 Bab";$("heroPackage").textContent=`Bab ${rangeStart}–${rangeStart+4}`}
function speak(text){if(!("speechSynthesis" in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="ja-JP";u.rate=.82;speechSynthesis.speak(u)}
function activeQuestionIndex(){return reviewOnly?reviewIndexes[current]:current}
function renderNavigator(){
  const grid=$("numberGrid");grid.replaceChildren();
  questions.forEach((_,index)=>{const b=document.createElement("button");b.textContent=index+1;b.classList.toggle("current",index===activeQuestionIndex());b.classList.toggle("answered",answers[index]!==null);b.classList.toggle("flagged",flags[index]);b.onclick=()=>{reviewOnly=false;current=index;renderQuestion()};grid.append(b)});
  $("answeredCount").textContent=`${answers.filter(v=>v!==null).length} / ${questions.length}`;$("temporaryScore").textContent=graded?questions.filter((q,i)=>answers[i]===q.answer).length:"—";$("flaggedCount").textContent=flags.filter(Boolean).length;
  // Tombol "Selesaikan tes" baru boleh ditekan setelah semua soal terjawab -
  // siswa masih bisa lompat antar nomor lewat grid ini tanpa menjawab semua
  // dulu, jadi pengecekan lengkap ini yang mencegah selesai sebelum waktunya.
  const allAnswered=answers.every(value=>value!==null);
  $("finishEarly").disabled=!allAnswered;
  $("finishHint").hidden=allAnswered;
}
/* Paket dengan one_page=true (simulasi JLPT) ditampilkan sebagai SATU
   HALAMAN UTUH berisi semua soal sekaligus (dikelompokkan per kategori lalu per もんだい), meniru
   cara dokumen contoh resmi (N5/N4-mondai.pdf) menyajikan soal - bukan satu
   soal per layar seperti paket lain. questions[]/answers[]/checked[] TETAP
   flat per-index seperti biasa (skoring, bank kesalahan, SRS push semua
   tetap bekerja tanpa perubahan) - yang berbeda HANYA cara renderQuestion()
   menggambar kontennya untuk paket ini. onePageExamRendered mencegah audio
   ikut ter-reset tiap kali siswa mengklik satu jawaban (HTML gabungan cuma
   dibangun ulang penuh saat PERTAMA kali tes dimulai, sesudahnya cuma
   status tombol yang disegarkan). Karena semua soal sudah tampil sekaligus,
   navigasi per-soal (Sebelumnya/Tandai/Periksa/Berikutnya) disembunyikan -
   siswa mengisi lewat halaman ini lalu menekan "Selesaikan tes" di panel
   navigasi (tombol itu sudah generik, aktif begitu answers[] terisi semua). */
function isListeningQuestion(q){return q.category==="Mendengarkan"}
function isOnePageExam(){return !!mockPackage&&packageInfo(mockPackage).one_page}
/* Mengelompokkan index-index satu kategori jadi beberapa もんだい: soal
   Mendengarkan sudah punya field subcategory eksplisit (sudah diverifikasi
   manual terhadap PDF); kategori lain belum punya label eksplisit, jadi
   nomor もんだい diturunkan dari field material (bagian setelah "·") -
   soal dengan slug material yang sama dianggap satu もんだい, nomornya
   mengikuti urutan kemunculan pertama dalam kategori tersebut. */
function mondaiGroupsFor(indices){
  const groups={},order=[];let counter=0;const seen={};
  indices.forEach(i=>{
    const q=questions[i];
    let key=q.subcategory;
    if(!key){
      const slug=(q.material||"").split("·").pop().trim()||"soal";
      if(!seen[slug]){counter++;seen[slug]=`もんだい${counter}`}
      key=seen[slug];
    }
    if(!groups[key]){groups[key]=[];order.push(key)}
    groups[key].push(i);
  });
  return order.map(key=>({key,indices:groups[key]}));
}
function bindExamAnswerButtons(container){
  container.querySelectorAll("button[data-qidx]").forEach(btn=>{
    btn.onclick=()=>{
      const qi=Number(btn.dataset.qidx),choice=Number(btn.dataset.choice);
      answers[qi]=choice;
      btn.parentElement.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));
      btn.classList.add("selected");
      $("testProgress").style.width=`${answers.filter(v=>v!==null).length/questions.length*100}%`;
      renderNavigator();
    };
  });
}
function renderExamOnePage(forceRebuild){
  $("categoryBadge").textContent=`SIMULASI · ${packageInfo(mockPackage).mark}`;
  $("questionCounter").textContent=`${questions.length} soal · isi semua lalu klik "Selesaikan tes"`;
  $("testProgress").style.width=`${answers.filter(v=>v!==null).length/questions.length*100}%`;
  $("instruction").textContent="";
  $("audioButton").hidden=true;
  $("explanation").hidden=true;
  $("questionText").classList.toggle("hide-furigana",!furigana);
  $("flagQuestion").hidden=true;$("previousQuestion").hidden=true;$("checkAnswer").hidden=true;$("nextQuestion").hidden=true;
  if(!forceRebuild&&onePageExamRendered){
    questions.forEach((q,i)=>{
      $("questionText").querySelectorAll(`button[data-qidx="${i}"]`).forEach(btn=>{
        btn.classList.toggle("selected",answers[i]===Number(btn.dataset.choice));
      });
    });
    document.getElementById(`examQ${current}`)?.scrollIntoView({behavior:"smooth",block:"center"});
    renderNavigator();
    return;
  }
  const categories={},catOrder=[];
  questions.forEach((q,i)=>{if(!categories[q.category]){categories[q.category]=[];catOrder.push(q.category)}categories[q.category].push(i)});
  let html=`<p class="operator-hint">Kerjakan seluruh soal di halaman ini, lalu klik "Selesaikan tes" di panel navigasi sebelah kanan.</p>`;
  catOrder.forEach(cat=>{
    html+=`<h2 class="exam-category-title">${cat.toUpperCase()}</h2>`;
    /* Satu audio dipakai bersama untuk SELURUH kategori ini (semua soal
       Mendengarkan berasal dari satu file rekaman yang sama) - jadi
       pemutar audio cukup ditampilkan sekali di sini, bukan diulang di
       setiap もんだい seperti sebelumnya. */
    const catAudioSrc=questions[categories[cat][0]].audioSrc;
    if(catAudioSrc)html+=`<div class="listening-audio-top"><audio controls src="../${catAudioSrc}"></audio><small>Putar rekaman ini dari awal, lalu jawab semua soal mendengarkan di bawah sambil mendengarkan.</small></div>`;
    mondaiGroupsFor(categories[cat]).forEach(({key,indices:idxs})=>{
      html+=`<div class="listening-mondai"><h3>${key}</h3><p class="listening-instruction">${questions[idxs[0]].instruction}</p>`;
      idxs.forEach((qi,subI)=>{
        const q=questions[qi],listening=isListeningQuestion(q);
        html+=`<div class="listening-item" id="examQ${qi}"><b>${listening?`${subI+1}ばん`:`Soal ${qi+1}`}</b>`;
        if(!listening)html+=`<div class="question-text">${q.html}</div>`;
        if(q.image)html+=`<img class="listening-item-image" src="../${q.image}" alt="Ilustrasi soal">`;
        if(listening)html+=`<div class="listening-item-answers">${q.options.map((opt,oi)=>`<button data-qidx="${qi}" data-choice="${oi}" class="${answers[qi]===oi?"selected":""}">${escapeHtmlTes(opt)}</button>`).join("")}</div>`;
        else html+=`<div class="answers">${q.options.map((opt,oi)=>`<button data-qidx="${qi}" data-choice="${oi}" class="${answers[qi]===oi?"selected":""}"><b>${String.fromCharCode(65+oi)}</b><span>${escapeHtmlTes(opt)}</span></button>`).join("")}</div>`;
        html+="</div>";
      });
      html+="</div>";
    });
  });
  $("questionText").innerHTML=html;
  $("answers").replaceChildren();
  bindExamAnswerButtons($("questionText"));
  onePageExamRendered=true;
  renderNavigator();
}
function renderQuestion(){
  const index=activeQuestionIndex(),q=questions[index];
  if(isOnePageExam()&&!reviewOnly){renderExamOnePage(!onePageExamRendered);return}
  onePageExamRendered=false;
  $("categoryBadge").textContent=q.category.toUpperCase();$("questionCounter").textContent=reviewOnly?`Tinjauan ${current+1} dari ${reviewIndexes.length}`:`Soal ${index+1} dari ${questions.length}`;$("instruction").textContent=q.instruction;$("questionText").innerHTML=q.html;$("questionText").classList.toggle("hide-furigana",!furigana);$("testProgress").style.width=`${((reviewOnly?current:index)+1)/(reviewOnly?reviewIndexes.length:questions.length)*100}%`;
  $("audioButton").hidden=!q.audio;if(q.audio)$("audioButton").onclick=()=>speak(q.audio);
  const box=$("answers");box.replaceChildren();q.options.forEach((option,choice)=>{const b=document.createElement("button");b.innerHTML=`<b>${String.fromCharCode(65+choice)}</b><span></span>`;b.querySelector("span").textContent=option;b.classList.toggle("selected",answers[index]===choice);if(checked[index]||reviewOnly)b.disabled=true;if(reviewOnly){b.classList.toggle("correct",choice===q.answer);b.classList.toggle("wrong",answers[index]===choice&&choice!==q.answer)}b.onclick=()=>{answers[index]=choice;renderQuestion()};box.append(b)});
  $("explanation").hidden=!reviewOnly;if(reviewOnly){const correct=answers[index]===q.answer;$("explanation").className=`explanation${correct?"":" wrong"}`;$("explanation").innerHTML=`<b>${correct?"Jawaban benar":"Belum tepat"}</b>${q.explanation}`}
  $("flagQuestion").hidden=false;$("flagQuestion").classList.toggle("active",flags[index]);$("flagQuestion").textContent=flags[index]?"★ Ditandai":"☆ Tandai soal";$("previousQuestion").hidden=false;$("previousQuestion").disabled=current===0;$("nextQuestion").hidden=reviewOnly;$("nextQuestion").textContent=index===questions.length-1?"Lihat hasil →":"Soal berikutnya →";
  $("checkAnswer").hidden=reviewOnly;$("checkAnswer").textContent=index===questions.length-1?"Simpan & lihat hasil":"Simpan & berikutnya";
  renderNavigator();
}
function checkOrAdvance(){
  const index=activeQuestionIndex();
  if(answers[index]===null){$("explanation").hidden=false;$("explanation").className="explanation wrong";$("explanation").innerHTML="<b>Pilih satu jawaban terlebih dahulu.</b>Setelah memilih, jawaban dapat diperiksa.";return}
  checked[index]=true;if(index===questions.length-1)finishTest();else{current++;renderQuestion()}
}
function advance(){if(activeQuestionIndex()===questions.length-1)finishTest();else{current++;renderQuestion()}}
function categoryScores(){const result={};questions.forEach((q,i)=>{result[q.category]??={correct:0,total:0};result[q.category].total++;if(answers[i]===q.answer)result[q.category].correct++});return result}
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
/* Kirim jawaban ke server untuk dinilai (grade_test, security definer):
   server menghitung skor, menyimpan quiz_results, menandai akses tes
   selesai, lalu baru mengembalikan kunci + pembahasan. Kalau gagal
   (offline dsb.), jawaban TIDAK hilang - layar hasil menampilkan tombol
   kirim ulang. */
let grading=false;
async function finishTest(){
  if(grading||graded)return;
  grading=true;clearInterval(timerId);checked=checked.map(()=>true);
  $("testScreen").hidden=true;$("resultScreen").hidden=false;$("finalScore").textContent="…";$("resultTitle").textContent="Menilai jawaban…";$("resultSummary").textContent="Jawabanmu sedang dikirim ke server untuk dinilai.";$("retryGrading").hidden=true;
  $("categoryResults").replaceChildren();$("recommendations").replaceChildren();$("mistakeList").replaceChildren();$("reviewMistakes").hidden=true;
  const {kind,ref}=currentTest();
  const submitted={};questions.forEach((q,i)=>{if(answers[i]!==null)submitted[q.id]=q.order[answers[i]]});
  try{
    const {data,error}=await window.supabaseClient.rpc("grade_test",{p_kind:kind,p_ref:ref,p_answers:submitted,p_assignment_id:activeAssignmentId});
    if(error)throw error;
    const byId=new Map((data||[]).map(row=>[String(row.question_id),row]));
    questions.forEach(q=>{const row=byId.get(String(q.id));if(row){q.answer=q.order.indexOf(row.answer);q.explanation=sanitizeHtml(row.explanation)}});
    graded=true;activeAssignmentId=null;
  }catch(e){
    $("finalScore").textContent="!";$("resultTitle").textContent="Jawaban belum terkirim.";$("resultSummary").textContent=`Gagal menghubungi server (${e&&e.message?e.message:e}). Jawabanmu masih tersimpan di halaman ini - periksa koneksi lalu kirim ulang.`;$("retryGrading").hidden=false;
    return;
  }finally{grading=false}
  showResults();
}
function showResults(){
  const correct=questions.filter((q,i)=>answers[i]===q.answer).length,score=Math.round(correct/questions.length*100);$("finalScore").textContent=score;$("resultTitle").textContent=score>=80?"Fondasi kamu sudah kuat.":score>=60?"Fondasi sudah terbentuk.":"Mari perkuat dasar sedikit lagi.";$("resultSummary").textContent=`${correct} dari ${questions.length} soal benar. ${questions.length-correct} soal tersimpan dalam bank kesalahan untuk ditinjau kembali.`;$("reviewMistakes").hidden=false;
  pushQuizAnswersToSrs();
  const categoryBox=$("categoryResults");categoryBox.replaceChildren();Object.entries(categoryScores()).forEach(([name,value])=>{const pct=Math.round(value.correct/value.total*100),row=document.createElement("div");row.innerHTML=`<span>${name}</span><i style="--score:${pct}%"></i><b>${pct}%</b>`;categoryBox.append(row)});
  const weakest=Object.entries(categoryScores()).sort((a,b)=>a[1].correct/a[1].total-b[1].correct/b[1].total).slice(0,2);$("recommendations").innerHTML=weakest.map(([name])=>`<div><b>Perkuat ${name}</b>Ulangi materi dan latihan terkait sebelum mencoba simulasi berikutnya.</div>`).join("")+`<div><b>Ulangi bank kesalahan</b>Fokuskan sesi berikutnya pada ${questions.length-correct} soal yang masih salah.</div>`;
  reviewIndexes=questions.map((q,i)=>answers[i]!==q.answer?i:-1).filter(i=>i>=0);const list=$("mistakeList");list.replaceChildren();reviewIndexes.forEach(i=>{const q=questions[i],a=document.createElement("article");a.innerHTML=`<b>Soal ${i+1} · ${escapeHtmlTes(q.category)}</b><p>Jawabanmu: ${answers[i]===null?"Belum dijawab":escapeHtmlTes(q.options[answers[i]])} · Jawaban benar: ${escapeHtmlTes(q.options[q.answer])}</p><p>${q.explanation}</p><small>Pelajari kembali: ${escapeHtmlTes(q.material)}</small>`;list.append(a)});window.scrollTo({top:0,behavior:"smooth"});
}
/* Timer sekarang wajib dan tidak bisa dimatikan siswa (lihat timeLimitSeconds):
   latihan per 5 bab 45 menit, simulasi paket 60 menit. Saat waktu habis,
   tes otomatis selesai lewat finishTest() meski belum semua soal terjawab. */
function startTimer(){clearInterval(timerId);seconds=timeLimitSeconds();const render=()=>{const m=String(Math.floor(seconds/60)).padStart(2,"0"),s=String(seconds%60).padStart(2,"0");$("timer").textContent=`${m}:${s}`};render();timerId=setInterval(()=>{seconds--;render();if(seconds<=0)finishTest()},1000)}
async function startTest(){
  const button=$("startTest");button.disabled=true;const originalLabel=button.innerHTML;button.innerHTML="Memuat soal…";
  try{await buildSelectedQuestions()}catch(e){button.disabled=false;button.innerHTML=originalLabel;$("startError").textContent=`Soal gagal dimuat: ${e&&e.message?e.message:e}`;$("startError").hidden=false;return}
  button.disabled=false;button.innerHTML=originalLabel;$("startError").hidden=true;
  current=0;graded=false;answers=Array(questions.length).fill(null);checked=Array(questions.length).fill(false);flags=Array(questions.length).fill(false);reviewOnly=false;onePageExamRendered=false;$("startScreen").hidden=true;$("resultScreen").hidden=true;$("testScreen").hidden=false;startTimer();renderQuestion();window.scrollTo({top:0,behavior:"smooth"})
}
/* Tombol paket dibangun dari database (renderPackageChoices) - jadi klik
   ditangani lewat delegasi di #sourceChoice, bukan per tombol. */
function renderPackageChoices(){
  const box=$("sourceChoice");
  box.querySelectorAll('button[data-package]:not([data-package=""])').forEach(b=>b.remove());
  testPackages.filter(p=>p.active&&p.question_count>0).forEach(p=>{
    const b=document.createElement("button");b.dataset.package=p.key;
    b.innerHTML=`<span class="exam-mark">${escapeHtmlTes(p.mark)}</span><div><b>${escapeHtmlTes(p.label)}</b><small>${escapeHtmlTes(p.description)}</small></div>`;
    box.append(b);
  });
}
$("sourceChoice").addEventListener("click",event=>{
  const button=event.target.closest("button[data-package]");
  if(!button)return;
  mockPackage=button.dataset.package||"";
  document.querySelectorAll("#sourceChoice button").forEach(item=>item.classList.toggle("active",item===button));
  $("chapterRange").disabled=!!mockPackage;
  $("chapterRangeBlock").classList.toggle("disabled",!!mockPackage);
  updatePackagePreview();
});
$("chapterRange").onchange=()=>{rangeStart=Number($("chapterRange").value);updatePackagePreview()};
updatePackagePreview();
$("startTest").onclick=startTest;$("checkAnswer").onclick=checkOrAdvance;$("nextQuestion").onclick=advance;$("previousQuestion").onclick=()=>{if(current>0){current--;renderQuestion()}};$("flagQuestion").onclick=()=>{const i=activeQuestionIndex();flags[i]=!flags[i];renderQuestion()};$("furiganaToggle").onclick=()=>{furigana=!furigana;$("furiganaToggle").textContent=`振 Furigana: ${furigana?"aktif":"mati"}`;renderQuestion()};$("finishEarly").onclick=()=>{if(answers.some(value=>value===null))return;finishTest()};$("retryGrading").onclick=finishTest;$("restartTest").onclick=()=>{$("resultScreen").hidden=true;$("startScreen").hidden=false;window.scrollTo({top:0,behavior:"smooth"});if(restrictedMode)loadAccessAssignments()};$("reviewMistakes").onclick=()=>{$("mistakeBank").hidden=false;$("mistakeBank").scrollIntoView({behavior:"smooth"})};$("closeMistakes").onclick=()=>{$("mistakeBank").hidden=true};

/* --- Akses tes kemampuan: gating khusus siswa --- */
async function resolveRole(){
  try{if(window.parent&&window.parent!==window&&window.parent.currentProfile)return window.parent.currentProfile.role}catch(e){}
  try{
    const {data}=await window.supabaseClient.auth.getUser();
    const user=data&&data.user;
    if(!user)return null;
    const profileRes=await window.supabaseClient.from("profiles").select("role").eq("id",user.id).single();
    return profileRes.data&&profileRes.data.role;
  }catch(e){return null}
}
function renderAccessGate(){
  const empty=accessAssignments.length===0;
  $("accessEmpty").hidden=!empty;
  $("accessList").innerHTML=accessAssignments.map(a=>{
    const isPaket=a.test_kind==="paket";
    const start=Number(a.test_ref);
    const pkg=isPaket?packageInfo(a.test_ref):null;
    const limitMinutes=isPaket?pkg.time_limit_minutes:45;
    const dueText=a.due_date?`Tenggat ${a.due_date}`:"Tanpa tenggat";
    return `<button type="button" class="access-card" data-id="${a.id}"><span class="access-mark">${isPaket?escapeHtmlTes(pkg.mark):"BAB"}</span><div><b>${escapeHtmlTes(a.title)}</b><small>${dueText} · Batas waktu ${limitMinutes} menit</small></div><span class="access-go">Mulai →</span></button>`;
  }).join("");
}
async function loadAccessAssignments(){
  $("accessList").innerHTML="";
  $("accessEmpty").hidden=false;
  const {data}=await window.supabaseClient.auth.getUser();
  const user=data&&data.user;
  if(!user){accessAssignments=[];renderAccessGate();return}
  const {data:rows,error}=await window.supabaseClient
    .from("assignments")
    .select("id, title, due_date, test_kind, test_ref")
    .eq("siswa_id",user.id)
    .eq("completed",false)
    .not("test_kind","is",null)
    .order("due_date",{ascending:true,nullsFirst:false});
  accessAssignments=error?[]:(rows||[]);
  renderAccessGate();
}
$("accessList").addEventListener("click",(event)=>{
  const card=event.target.closest(".access-card");
  if(!card)return;
  const assignment=accessAssignments.find(a=>String(a.id)===card.dataset.id);
  if(!assignment)return;
  activeAssignmentId=assignment.id;
  mockPackage=assignment.test_kind==="paket"?assignment.test_ref:"";
  rangeStart=assignment.test_kind==="bab"?Number(assignment.test_ref):rangeStart;
  startTest();
});
/* Dipanggil dari app.js (mountExamSimulationV2) tiap kali tab Tes
   Kemampuan dibuka kembali, supaya akses baru dari Sensei langsung
   muncul tanpa perlu memuat ulang seluruh halaman. Tidak melakukan
   apa-apa kalau siswa sedang mengerjakan tes (testScreen tampil). */
window.refreshTestAccess=function(){
  if(restrictedMode&&$("testScreen").hidden)loadAccessAssignments();
};
/* Mode operator: review + edit soal satu rentang bab sekaligus (tanpa
   perlu mengerjakan satu-satu), termasuk tambah/hapus soal. Perubahan
   cuma di memori tab ini (operatorDraft) sampai Operator klik "Simpan
   draft" (quiz_questions status 'draft') atau "Terbitkan". */
let operatorDraft=[];
function blankOperatorQuestion(){
  return {category:"Kosakata",instruction:"（　）に なにを いれますか。1・2・3・4から いちばん いい ものを ひとつ えらんでください。",html:"",options:["","","",""],answer:0,explanation:"",material:`Bab ${rangeStart}–${rangeStart+4} · Soal baru`};
}
/* Draft Operator diambil dari baris status 'draft' dulu (kalau Operator
   pernah klik "Simpan draft"); kalau belum ada, mulai dari soal yang
   sedang terbit - belum tersimpan sebagai draft sampai Operator klik
   "Simpan draft"/"Terbitkan". */
async function loadOperatorDraft(){
  $("operatorQuestionList").innerHTML='<p class="operator-empty">Memuat…</p>';
  setOperatorStatus("");
  const draftRows=await fetchQuizQuestions(rangeStart,"draft");
  const publishedRows=draftRows?null:await fetchQuizQuestions(rangeStart,"published");
  operatorDraft=draftRows||publishedRows||[];
  if(!draftRows&&publishedRows)setOperatorStatus('Menampilkan soal yang sedang terbit - belum ada draft tersimpan untuk rentang ini. Perubahan baru tersimpan setelah klik "Simpan draft".');
  paintOperatorEditor();
}
function paintOperatorEditor(){
  $("operatorRangeLabel").textContent=`Bab ${rangeStart}–${rangeStart+4}`;
  $("operatorQuestionList").innerHTML=operatorDraft.length?operatorDraft.map((q,i)=>`
    <article class="operator-card" data-index="${i}">
      <header><b>Soal ${i+1} · ${escapeHtmlTes(q.category)}</b><button type="button" class="operator-remove">🗑 Hapus</button></header>
      <label>Kategori<input class="op-field" data-field="category" value="${escapeHtmlTes(q.category)}"></label>
      <label>Instruksi<input class="op-field" data-field="instruction" value="${escapeHtmlTes(q.instruction)}"></label>
      <label>Teks soal (HTML diperbolehkan, mis. &lt;ruby&gt;)<textarea class="op-field" data-field="html" rows="2">${escapeHtmlTes(q.html)}</textarea></label>
      <label>Pilihan jawaban (bulatan = jawaban benar)</label>
      <div class="operator-options">${q.options.map((opt,oi)=>`<label class="operator-option"><input type="radio" name="op-answer-${i}" class="op-answer-radio" data-oi="${oi}" ${q.answer===oi?"checked":""}><input class="op-option-field" data-oi="${oi}" value="${escapeHtmlTes(opt)}"></label>`).join("")}</div>
      <label>Pembahasan<textarea class="op-field" data-field="explanation" rows="2">${escapeHtmlTes(q.explanation)}</textarea></label>
      <label>Label materi<input class="op-field" data-field="material" value="${escapeHtmlTes(q.material)}"></label>
    </article>
  `).join(""):'<p class="operator-empty">Rentang ini belum punya paket soal manual. Klik "+ Tambah soal baru" untuk mulai membuatnya.</p>';
}
function operatorCardIndex(el){const card=el.closest(".operator-card");return card?Number(card.dataset.index):NaN}
function setOperatorStatus(text,kind){
  const el=$("operatorStatus");el.textContent=text;el.classList.toggle("is-success",kind==="success");el.classList.toggle("is-error",kind==="error");
}
/* Simpan seluruh operatorDraft sebagai baris status='draft' di Supabase:
   hapus draft lama rentang ini lalu tulis ulang dari awal (bukan diff
   satu-satu) - paling sederhana dan aman karena RLS hanya mengizinkan
   Operator menulis baris draft (lihat supabase/add-quiz-questions.sql). */
async function saveOperatorDraft(){
  if(!window.supabaseClient){setOperatorStatus("Supabase tidak tersedia - tidak bisa menyimpan ke database.","error");return false}
  const button=$("saveOperatorDraft");button.disabled=true;const original=button.textContent;button.textContent="Menyimpan…";
  setOperatorStatus("");
  try{
    const del=await window.supabaseClient.from("quiz_questions").delete().eq("bab_range",rangeStart).eq("status","draft");
    if(del.error)throw del.error;
    if(operatorDraft.length){
      const rows=operatorDraft.map((q,i)=>({bab_range:rangeStart,status:"draft",position:i,category:q.category,instruction:q.instruction,html:q.html,options:q.options,answer:q.answer,explanation:q.explanation,material:q.material,srs_id:q.srsId||null}));
      const ins=await window.supabaseClient.from("quiz_questions").insert(rows);
      if(ins.error)throw ins.error;
    }
    setOperatorStatus("Draft tersimpan ke database.","success");
    return true;
  }catch(e){
    setOperatorStatus("Gagal menyimpan draft: "+(e&&e.message?e.message:e),"error");
    return false;
  }finally{
    button.disabled=false;button.textContent=original;
  }
}
/* Terbitkan = simpan draft dulu (supaya yang diterbitkan pasti versi
   terbaru di layar ini) lalu panggil publish_quiz_range() - fungsi
   SECURITY DEFINER di database yang memindahkan draft -> published
   dalam satu transaksi, jadi siswa tidak pernah melihat soal setengah-edit. */
async function publishOperatorDraft(){
  const saved=await saveOperatorDraft();
  if(!saved)return;
  if(!window.supabaseClient)return;
  const button=$("publishOperatorDraft");button.disabled=true;const original=button.textContent;button.textContent="Menerbitkan…";
  try{
    const{error}=await window.supabaseClient.rpc("publish_quiz_range",{p_bab_range:rangeStart});
    if(error)throw error;
    setOperatorStatus(`Berhasil diterbitkan - siswa sekarang melihat versi terbaru Bab ${rangeStart}–${rangeStart+4}.`,"success");
  }catch(e){
    setOperatorStatus("Gagal menerbitkan: "+(e&&e.message?e.message:e),"error");
  }finally{
    button.disabled=false;button.textContent=original;
  }
}
$("openOperatorEditor").onclick=async()=>{$("startScreen").hidden=true;$("operatorEditorScreen").hidden=false;window.scrollTo({top:0,behavior:"smooth"});await loadOperatorDraft()};
$("closeOperatorEditor").onclick=()=>{$("operatorEditorScreen").hidden=true;$("startScreen").hidden=false};
$("addOperatorQuestion").onclick=()=>{operatorDraft.push(blankOperatorQuestion());paintOperatorEditor()};
$("saveOperatorDraft").onclick=saveOperatorDraft;
$("publishOperatorDraft").onclick=publishOperatorDraft;
$("operatorQuestionList").addEventListener("input",(event)=>{
  const i=operatorCardIndex(event.target);
  if(Number.isNaN(i))return;
  if(event.target.classList.contains("op-field")){operatorDraft[i][event.target.dataset.field]=event.target.value}
  else if(event.target.classList.contains("op-option-field")){operatorDraft[i].options[Number(event.target.dataset.oi)]=event.target.value}
});
$("operatorQuestionList").addEventListener("change",(event)=>{
  const i=operatorCardIndex(event.target);
  if(Number.isNaN(i))return;
  if(event.target.classList.contains("op-answer-radio"))operatorDraft[i].answer=Number(event.target.dataset.oi);
});
$("operatorQuestionList").addEventListener("click",(event)=>{
  if(!event.target.classList.contains("operator-remove"))return;
  const i=operatorCardIndex(event.target);
  if(Number.isNaN(i))return;
  operatorDraft.splice(i,1);
  paintOperatorEditor();
});
async function initAccessControl(){
  const role=await resolveRole();
  await loadTestPackages();
  restrictedMode=role==="siswa";
  $("accessGate").hidden=!restrictedMode;
  $("manualConfig").hidden=restrictedMode;
  if(!restrictedMode){renderPackageChoices();updatePackagePreview()}
  if(restrictedMode){
    $("heroExamType").textContent="Akses dari Sensei";$("heroPackage").textContent="Pilih dari daftar";$("heroQuestionTotal").textContent="—";
    await loadAccessAssignments();
  }
}
initAccessControl();
}
window.initPage = initPage;
