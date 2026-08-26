const shell=document.getElementById("appShell"),contextPanel=document.getElementById("contextPanel"),contentArea=document.getElementById("contentArea");
const lessonNames=["Kalimat nominal dasar","Kata tunjuk dan persamaan","Tempat, arah, dan asal","Waktu dan kegiatan","Perjalanan dan perpindahan","Aktivitas dan ajakan","Alat, bahasa, dan memberi","Kata sifat dan kesan","Kesukaan dan kemampuan","Keberadaan benda","Letak dan lokasi","Bilangan dan durasi","Bentuk lampau","Keinginan dan harapan","Bentuk て dan permintaan","Urutan kegiatan","Larangan dan kewajiban","Kemampuan dan hobi","Pengalaman","Bentuk biasa","Pendapat","Klausa penjelas","Syarat dan waktu","Memberi bantuan","Pengandaian"];
const contexts={dashboard:{label:"HARI INI",heading:"Target belajar",links:[["2 dari 4 aktivitas","50%"],["Streak belajar","7 hari"],["XP minggu ini","+150"]]},materials:{label:"MATERI AKTIF",heading:"Buku 1 · Dasar",links:[["Pelajaran 1–5","Mulai"],["Pelajaran 6–10","0%"],["Pelajaran 11–15","0%"],["Pelajaran 16–20","0%"],["Pelajaran 21–25","0%"]]},kanji:{label:"TINGKAT JLPT",heading:"613 kanji tersedia",links:[["JLPT N5","103"],["JLPT N4","144"],["JLPT N3","366"],["Perlu diulang","27"]]},memory:{label:"PAKET HAFALAN",heading:"Pilih sesi",links:[["Kosakata Bab aktif","38"],["Kanji Bab aktif","23"],["Kata sulit","12"],["Ulangi hari ini","7"]]},exam:{label:"SIMULASI UJIAN",heading:"Pilih jalur",links:[["Simulasi JLPT","Menunggu"],["Simulasi JFT-Basic","Menunggu"]]}};
const kanjiSample=[["山","Gunung"],["川","Sungai"],["人","Orang"],["日","Matahari"],["月","Bulan"],["木","Pohon"],["火","Api"],["水","Air"],["金","Emas"],["土","Tanah"],["本","Buku"],["学","Belajar"],["生","Hidup"],["先","Depan"],["私","Saya"],["会","Bertemu"]];
let activeSection="materials",bookNumber=1;

function hero(eyebrow,title,description,action=""){
  return `<section class="hero"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${description}</p></div>${action}</section>`;
}
function lessonCards(){const start=bookNumber===1?1:26;return lessonNames.map((name,index)=>`<button class="lesson-card${index===0?" active":""}"><span>${String(start+index).padStart(2,"0")}</span><b>${bookNumber===1?name:`Pelajaran ${start+index}`}</b><small>${index===0?"Rekomendasi berikutnya":"Belum dimulai"}</small></button>`).join("")}
function dashboardPage(){return `${hero("DASHBOARD SISWA","Selamat datang kembali, Divha.","Lanjutkan kebiasaan belajar kecil yang konsisten setiap hari.")}<section class="dashboard-cards"><article class="panel-card"><span>Aktivitas hari ini</span><b>2 dari 4</b><small>Dua target lagi untuk diselesaikan.</small></article><article class="panel-card"><span>Total XP</span><b>12.680</b><small>+150 XP minggu ini</small></article><article class="panel-card"><span>Target utama</span><b>JLPT N4</b><small>40% modul selesai</small></article><article class="panel-card"><span>Kanji dikuasai</span><b>84</b><small>Dari 613 kanji tersedia</small></article></section><section class="two-column"><article class="panel-card activity-panel"><div class="panel-title"><div><span class="eyebrow">RENCANA HARI INI</span><h2>Target belajar</h2></div><span>20 menit tersisa</span></div><div class="activity-list"><div><i>✓</i><b>Pelajari satu pola tata bahasa</b><small>Selesai</small></div><div><i>✓</i><b>Ulangi lima kosakata</b><small>Selesai</small></div><div><i></i><b>Latihan menulis tiga kanji</b><small>10 menit</small></div><div><i></i><b>Kerjakan kuis singkat</b><small>10 menit</small></div></div></article><article class="panel-card progress-panel"><div class="panel-title"><div><span class="eyebrow">PROGRES LEVEL</span><h2>Perkembangan</h2></div></div><div class="level-progress"><div><b>N5</b><i><em style="--progress:86%"></em></i><span>86%</span></div><div><b>N4</b><i><em style="--progress:40%"></em></i><span>40%</span></div><div><b>N3</b><i><em style="--progress:8%"></em></i><span>8%</span></div></div></article></section>`}
function materialsPage(){return '<section class="embedded-feature"><div class="feature-loading">Memuat fitur Materi lengkap…</div><iframe class="feature-frame" data-feature="materials" src="index.html?build=30&source=1" title="Materi pembelajaran Nihon GO Benkyo"></iframe></section>'}
function kanjiPage(){return '<section class="embedded-feature"><div class="feature-loading">Memuat fitur Kanji interaktif…</div><iframe class="feature-frame" data-feature="kanji" src="prototype-kanji-v2.html?v=12&embed=1" title="Belajar Kanji interaktif"></iframe></section>'}
function memoryPage(){return '<section class="embedded-feature"><div class="feature-loading">Memuat halaman Hafalan asli…</div><iframe class="feature-frame" data-feature="memory" src="index.html?build=30&source=1" title="Hafalan Nihon GO Benkyo"></iframe></section>'}
function examPage(){return `${hero("SIMULASI UJIAN","Tes Kemampuan","Pilih simulasi JLPT atau JFT-Basic. Bank soal lokal sudah siap digunakan.")}<section class="exam-routes-preview"><a class="route-preview" href="prototype-tes-v2.html?v=5&exam=jlpt&embed=1"><span>試</span><b>Simulasi JLPT</b><small>Kosakata, kanji, tata bahasa, bacaan, dan audio.</small><span class="waiting-badge ready-badge">Bank soal aktif</span></a><a class="route-preview" href="prototype-tes-v2.html?v=5&exam=jft&embed=1"><span>会</span><b>Simulasi JFT-Basic</b><small>Komunikasi praktis, bacaan, dan audio situasional.</small><span class="waiting-badge ready-badge">Bank soal aktif</span></a></section><div class="exam-note"><b>Simulasi siap digunakan.</b> Soal dibuat dari data kosakata, kanji, tata bahasa, dan konteks pembelajaran lokal.</div>`}
function renderContext(section){const data=contexts[section];contextPanel.innerHTML=`<span>${data.label}</span><h3>${section==="materials"?(bookNumber===1?"Buku 1 · Dasar":"Buku 2 · Menengah"):data.heading}</h3><div class="context-links">${data.links.map((item,index)=>`<button class="${index===0?"active":""}"><span>${item[0]}</span><b>${item[1]}</b></button>`).join("")}</div>`}
function prepareFeatureFrame(section){
  const frame=contentArea.querySelector(".feature-frame");
  if(!frame)return;

  frame.addEventListener("load",()=>{
    const doc=frame.contentDocument;
    if(!doc)return;

    const resize=()=>{
      const height=Math.max(doc.documentElement.scrollHeight,doc.body.scrollHeight);
      frame.style.height=`${height+6}px`;
    };

    const scrollToFeatureTop=()=>{
      const top=frame.getBoundingClientRect().top+window.scrollY-18;
      window.scrollTo({top:Math.max(0,top),behavior:"smooth"});
    };

    if(section==="materials"){
      const stylesheet=doc.createElement("link");
      stylesheet.rel="stylesheet";
      stylesheet.href="prototype-sidebar-material.css?v=2";
      doc.head.append(stylesheet);
      doc.querySelector(`[data-view="${bookNumber===2?"book2":"materials"}"]`)?.click();

      const materialView=doc.getElementById(bookNumber===2?"book2":"materials");
      if(materialView){
        const showLessonList=()=>{
          materialView.classList.add("sidebar-material-list-mode");
          materialView.classList.remove("sidebar-material-reader-mode");
          setTimeout(()=>{resize();scrollToFeatureTop()},20);
        };
        const showLessonReader=()=>{
          materialView.classList.remove("sidebar-material-list-mode");
          materialView.classList.add("sidebar-material-reader-mode");
          setTimeout(()=>{resize();scrollToFeatureTop()},20);
        };

        showLessonList();
        materialView.querySelectorAll(".material-choice").forEach(button=>{
          button.addEventListener("click",showLessonReader);
        });
        materialView.querySelector(".material-recommendation-button")?.addEventListener("click",showLessonReader);
        materialView.querySelector(".material-back-list")?.addEventListener("click",showLessonList);
      }
    }

    if(section==="memory"){
      const stylesheet=doc.createElement("link");
      stylesheet.rel="stylesheet";
      stylesheet.href="prototype-sidebar-memory.css?v=1";
      doc.head.append(stylesheet);
      doc.querySelector('[data-view="memorization"]')?.click();
    }

    contentArea.querySelector(".feature-loading")?.remove();
    resize();
    setTimeout(resize,250);
    setTimeout(resize,900);
    if("ResizeObserver" in window)new ResizeObserver(resize).observe(doc.body);
    doc.fonts?.ready.then(resize);
  });
}
function renderPage(section){activeSection=section;const pages={dashboard:dashboardPage,materials:materialsPage,kanji:kanjiPage,memory:memoryPage,exam:examPage};contentArea.innerHTML=`<div class="page-enter">${pages[section]()}</div>`;renderContext(section);document.querySelectorAll("[data-section]").forEach(button=>button.classList.toggle("active",button.dataset.section===section));prepareFeatureFrame(section);window.scrollTo({top:0,behavior:"smooth"})}

document.getElementById("collapseSidebar").onclick=()=>shell.classList.toggle("collapsed");
document.querySelectorAll("[data-section]").forEach(button=>button.onclick=()=>renderPage(button.dataset.section));
document.getElementById("courseSelect").onchange=event=>{bookNumber=event.target.value==="book2"?2:1;renderPage("materials")};
document.getElementById("continueLearning").onclick=()=>renderPage("materials");
renderPage("materials");
