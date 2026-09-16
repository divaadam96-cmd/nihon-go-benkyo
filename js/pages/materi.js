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
/* Mode embed (?source=1): sembunyikan header/sidebar/mobile-nav, tampilkan
   hanya konten materi - dipakai untuk menyematkan materi ini di tempat lain
   (mis. iframe eksternal). Dulu juga perlu memaksa "view" materials aktif
   dan menyembunyikan view lain; sekarang halaman ini isinya cuma materi,
   jadi bagian itu tidak diperlukan lagi. */
if (new URLSearchParams(location.search).get("source") === "1") {
  const sourceModeStyle = document.createElement("style");
  sourceModeStyle.textContent =
    ".top,.side,.mobile-nav{display:none!important}.layout{display:block;min-height:0}.main{padding:0;background:transparent}#materials .head,#materials>.material-grid,#materials>.notice{display:none!important}#materials{padding:0}.app{max-width:none;box-shadow:none;background:transparent}";
  document.head.appendChild(sourceModeStyle);
}
document.getElementById("materials").innerHTML =
  `<div class="head"><div><div class="eyebrow">Materi pembelajaran HTML lengkap</div><h1>Keterangan Tata Bahasa Pelajaran 1–25</h1><p>Setiap pelajaran memuat seluruh poin inti tata bahasa dalam penulisan ulang yang terstruktur untuk web.</p></div></div><div class="html-course">${fullLessons.map((lesson, i) => `<details class="html-lesson" ${i === 0 ? "open" : ""}><summary><span class="lesson-number">${i + 1}</span>Pelajaran ${i + 1}: ${lesson[0]}</summary><div class="html-content"><h3>Pokok pembahasan</h3><div class="html-pattern">${detailedGrammar[i][2]}</div><ul class="lesson-points">${lesson[1].map((p) => `<li>${p}</li>`).join("")}</ul><div class="html-note"><div><b>Tujuan belajar</b>Memahami fungsi pola dan dapat memilih bentuk yang sesuai untuk percakapan dasar.</div><div><b>Latihan mandiri</b>Tulis minimal dua kalimat tentang kehidupan sehari-hari menggunakan pola Pelajaran ${i + 1}, lalu baca dengan suara keras.</div></div></div></details>`).join("")}</div>`;
const lessonOne = `<summary><span class="lesson-number">1</span>Pelajaran 1: Kalimat nominal dasar</summary><div class="html-content"><div class="grammar-point"><h3>1. N1 は N2 です</h3><p>Pola ini dipakai untuk memperkenalkan atau menjelaskan identitas. Kata benda sebelum は menjadi topik pembicaraan; kata benda sesudahnya menjadi informasi atau predikat. です membuat pernyataan terdengar sopan.</p><span class="grammar-example">わたし は マイク・ミラー です。<span class="grammar-meaning">Saya Mike Miller.</span></span></div><div class="grammar-point"><h3>2. N1 は N2 じゃありません</h3><p>Ini adalah bentuk negatif dari kalimat です. Dalam percakapan biasa digunakan じゃありません; bentuk ではありません lebih formal dan lebih sering dijumpai pada situasi resmi atau tulisan.</p><span class="grammar-example">サントスさん は 学生 じゃありません。<span class="grammar-meaning">Sdr. Santos bukan mahasiswa.</span></span></div><div class="grammar-point"><h3>3. N1 は N2 ですか</h3><p>Tambahkan か di akhir kalimat untuk membuat pertanyaan. Untuk jawaban ya/tidak, gunakan はい atau いいえ. Jika bagian yang ditanyakan belum diketahui, gantilah bagian itu dengan kata tanya seperti だれ、なん、どなた、atau どのかた.</p><span class="grammar-example">ミラーさん は アメリカ人 ですか。<span class="grammar-meaning">Apakah Sdr. Miller orang Amerika?</span></span></div><div class="grammar-point"><h3>4. N も</h3><p>も berarti juga atau pun. Partikel ini dipakai ketika predikat pada kalimat kedua sama dengan predikat pada kalimat sebelumnya. も menggantikan は pada posisi topik.</p><span class="grammar-example">ミラーさん は 会社員 です。グプタさん も 会社員 です。<span class="grammar-meaning">Sdr. Miller pegawai perusahaan. Sdr. Gupta juga pegawai perusahaan.</span></span></div><div class="grammar-point"><h3>5. N1 の N2</h3><p>の menghubungkan dua kata benda. Kata benda pertama menerangkan kata benda kedua, misalnya asal, kepemilikan, organisasi, atau jenis. Keseluruhan frasa N1 の N2 dianggap satu kelompok kata benda.</p><span class="grammar-example">ミラーさん は IMC の 会社員 です。<span class="grammar-meaning">Sdr. Miller pegawai perusahaan IMC.</span></span></div><div class="grammar-point"><h3>6. ～さん</h3><p>さん diletakkan setelah nama atau marga orang lain sebagai sapaan sopan. Jangan gunakan さん setelah nama diri sendiri. Untuk anak kecil atau orang yang sangat akrab, ～ちゃん dapat dipakai. あなた biasanya dihindari bila nama lawan bicara sudah diketahui; gunakan nama + さん agar lebih wajar.</p><span class="grammar-example">あの かた は ミラーさん です。<span class="grammar-meaning">Orang itu Sdr. Miller.</span></span></div><div class="html-note"><div><b>Fokus Pelajaran 1</b>Perkenalan diri, pekerjaan, asal negara, serta cara bertanya dan menjawab secara sopan.</div><div><b>Latihan mandiri</b>Buat lima kalimat: dua pernyataan です, satu negatif, satu pertanyaan, dan satu kalimat memakai の atau も.</div></div></div>`;
const firstLesson = document.querySelector("#materials .html-lesson");
if (firstLesson) {
  firstLesson.innerHTML = lessonOne;
  firstLesson.open = true;
}
document
  .querySelectorAll("#materials .html-lesson")
  .forEach((lesson, lessonIndex) => {
    if (lessonIndex === 0) return;
    lesson.querySelectorAll(".lesson-points li").forEach((point, i) => {
      const source =
        pointExamples[lessonIndex][i % pointExamples[lessonIndex].length];
      const [jp, id] = source.split("|");
      point.insertAdjacentHTML(
        "beforeend",
        `<span class="inline-example">Contoh: ${jp}<em>${id}</em></span>`,
      );
    });
  });
const lessonTwo = `<summary><span class="lesson-number">2</span>Pelajaran 2: Kata tunjuk dan persamaan</summary><div class="html-content"><div class="grammar-point"><h3>1. これ／それ／あれ</h3><p>Ketiganya menunjuk benda dan dapat berdiri sendiri sebagai kata benda. これ untuk benda dekat pembicara, それ dekat lawan bicara, dan あれ jauh dari keduanya.</p><span class="grammar-example">これは じしょですか。<span class="grammar-meaning">Apakah ini kamus?</span></span></div><div class="grammar-point"><h3>2. この N／その N／あの N</h3><p>Gunakan bentuk ini ketika kata tunjuk menerangkan kata benda. この dekat pembicara, その dekat lawan bicara, dan あの jauh dari kedua pihak. Berbeda dengan これ, bentuk ini wajib diikuti kata benda.</p><span class="grammar-example">この 本は わたしのです。<span class="grammar-meaning">Buku ini kepunyaan saya.</span></span></div><div class="grammar-point"><h3>3. そうです</h3><p>Dalam kalimat nominal, そうです menjawab bahwa informasi atau dugaan lawan bicara benar. Untuk menyangkal, gunakan ちがいます atau bentuk negatif yang sesuai, bukan そうではありません.</p><span class="grammar-example">それは じしょですか。はい、そうです。<span class="grammar-meaning">Apakah itu kamus? Ya, benar.</span></span></div><div class="grammar-point"><h3>4. ～か、～か</h3><p>Pola ini memberi pilihan dari dua atau lebih kemungkinan. Jawaban tidak memakai はい atau いいえ, tetapi langsung menyebut pilihan yang benar.</p><span class="grammar-example">これは 「9」ですか、「7」ですか。……「9」です。<span class="grammar-meaning">Ini “9” atau “7”? …“9”.</span></span></div><div class="grammar-point"><h3>5. N1 の N2</h3><p>の menghubungkan dua kata benda. N1 dapat menerangkan jenis atau asal N2, misalnya buku komputer, dan juga dapat menyatakan kepemilikan, misalnya buku saya.</p><span class="grammar-example">これは コンピューターの 本です。<span class="grammar-meaning">Ini buku komputer.</span></span></div><div class="grammar-point"><h3>6. の sebagai pengganti kata benda</h3><p>の dapat menggantikan kata benda yang sudah disebut bila konteksnya jelas. Penggunaan ini lazim untuk benda, tetapi tidak dipakai untuk menggantikan orang.</p><span class="grammar-example">これは だれの かばんですか。……佐藤さんのです。<span class="grammar-meaning">Tas ini milik siapa? …Milik Sato.</span></span></div><div class="grammar-point"><h3>7. お～</h3><p>Awalan お dapat ditempatkan di depan beberapa kata benda untuk memberi nuansa sopan. Contoh umum adalah おみやげ dan おさけ.</p><span class="grammar-example">これは おみやげです。<span class="grammar-meaning">Ini oleh-oleh.</span></span></div><div class="grammar-point"><h3>8. そうですか</h3><p>Ekspresi ini dipakai ketika menerima informasi baru dan menunjukkan bahwa pembicara memahami atau menyadari informasi tersebut. Intonasi biasanya menurun.</p><span class="grammar-example">これは シュミットさんの かさです。……そうですか。<span class="grammar-meaning">Ini payung milik Sdr. Schmidt. …Oh, begitu.</span></span></div><div class="html-note"><div><b>Fokus Pelajaran 2</b>Menunjuk benda, membedakan jarak, menanyakan kepemilikan, dan memberi jawaban atas informasi.</div><div><b>Latihan mandiri</b>Pilih lima benda di sekitar Anda. Buat pertanyaan memakai これ／それ／あれ lalu jawab dengan そうです atau ちがいます.</div></div></div>`;
const lessonTwoElement = document.querySelectorAll(
  "#materials .html-lesson",
)[1];
if (lessonTwoElement) {
  lessonTwoElement.innerHTML = lessonTwo;
}
const lessonThree = `<summary><span class="lesson-number">3</span>Pelajaran 3: Tempat, arah, dan asal produk</summary><div class="html-content"><div class="grammar-point"><h3>1. ここ／そこ／あそこ／こちら／そちら／あちら</h3><p>ここ・そこ・あそこ menunjuk tempat. ここ dekat pembicara, そこ dekat lawan bicara, dan あそこ jauh dari keduanya. こちら・そちら・あちら dapat menunjuk arah atau tempat dengan nuansa lebih sopan.</p><span class="grammar-example">おてあらいは あそこです。<span class="grammar-meaning">Kamar kecil di sana.</span></span></div><div class="grammar-point"><h3>2. N は tempat です</h3><p>Pola ini menyatakan lokasi benda, fasilitas, atau orang. Tempat berada sesudah topik dan diikuti です.</p><span class="grammar-example">でんわは 2かいです。<span class="grammar-meaning">Telepon di lantai dua.</span></span></div><div class="grammar-point"><h3>3. どこ／どちら</h3><p>どこ adalah kata tanya tempat. どちら terutama untuk arah dan dapat dipakai untuk tempat dengan cara yang lebih sopan. Saat bertanya nama negara, sekolah, atau perusahaan, pakailah どこ atau どちら, bukan なん.</p><span class="grammar-example">エレベーターは どちらですか。……あちらです。<span class="grammar-meaning">Lift di sebelah mana? …Di sebelah sana.</span></span></div><div class="grammar-point"><h3>4. N1 の N2: asal atau pembuat</h3><p>Jika N1 adalah negara dan N2 adalah produk, N1 の menunjukkan produk buatan negara tersebut. Jika N1 adalah perusahaan dan N2 adalah produk, maknanya menunjukkan produk buatan perusahaan itu.</p><span class="grammar-example">これは にほんの コンピューターです。<span class="grammar-meaning">Ini komputer buatan Jepang.</span></span></div><div class="grammar-point"><h3>5. Daftar kata penunjuk</h3><p>Kelompok こ, そ, dan あ berlaku konsisten: これ・それ・あれ untuk barang; このN・そのN・あのN untuk barang/orang; ここ・そこ・あそこ untuk tempat; serta こちら・そちら・あちら untuk arah atau tempat yang sopan. Bentuk tanya pasangannya adalah どれ、どのN、どこ、dan どちら.</p><span class="grammar-example">これは どこの コンピューターですか。<span class="grammar-meaning">Ini komputer buatan mana?</span></span></div><div class="grammar-point"><h3>6. お～</h3><p>Awalan お dapat dipakai pada kata yang berkaitan dengan lawan bicara atau pihak ketiga untuk menunjukkan rasa hormat. Salah satu contoh yang umum adalah おくに.</p><span class="grammar-example">おくには どちらですか。<span class="grammar-meaning">Berasal dari mana?</span></span></div><div class="html-note"><div><b>Fokus Pelajaran 3</b>Menanyakan dan menjelaskan lokasi, arah, asal produk, serta bentuk penunjuk yang sopan.</div><div><b>Latihan mandiri</b>Gambarkan denah sederhana rumah atau sekolah, lalu buat enam kalimat memakai ここ、そこ、あそこ、どこ、dan どちら.</div></div></div>`;
const lessonThreeElement = document.querySelectorAll(
  "#materials .html-lesson",
)[2];
if (lessonThreeElement) {
  lessonThreeElement.innerHTML = lessonThree;
}
const lessonFour = `<summary><span class="lesson-number">4</span>Pelajaran 4: Waktu dan kegiatan harian</summary><div class="html-content"><div class="grammar-point"><h3>1. 今 ～時 ～分です</h3><p>Untuk menyatakan jam, gunakan kata bantu bilangan 時 dan 分 setelah angka. Pengucapan beberapa angka berubah, misalnya 4時 dibaca よじ, 7時 dibaca しちじ, dan 9時 dibaca くじ. Kata tanya untuk waktu adalah なんじ.</p><span class="grammar-example">いま なんじですか。……7じ 10ぷんです。<span class="grammar-meaning">Sekarang pukul berapa? …Pukul tujuh lewat sepuluh menit.</span></span></div><div class="grammar-point"><h3>2. Vます／Vません／Vました／Vませんでした</h3><p>ます adalah bentuk sopan kata kerja. Bentuk positif dan negatif dapat dipakai untuk kebiasaan, keadaan kini, atau rencana masa depan. ました dan ませんでした dipakai untuk menyatakan kegiatan yang telah selesai di masa lalu. Pertanyaan dibuat dengan menambahkan か tanpa mengubah susunan kalimat.</p><span class="grammar-example">まいあさ 6じに おきます。<span class="grammar-meaning">Setiap pagi saya bangun pukul enam.</span></span></div><div class="grammar-point"><h3>3. Kata benda waktu に V</h3><p>Partikel に diletakkan setelah waktu yang spesifik, seperti jam, tanggal, atau hari tertentu, untuk menandai kapan kegiatan dilakukan. Kata waktu relatif seperti きょう、あした、きのう、まいにち umumnya tidak memakai に.</p><span class="grammar-example">6じはんに おきます。<span class="grammar-meaning">Saya bangun pukul setengah tujuh.</span></span></div><div class="grammar-point"><h3>4. N1 から N2 まで</h3><p>から menunjukkan titik awal waktu atau tempat, sedangkan まで menunjukkan titik akhir. Keduanya dapat dipakai bersama atau sendiri. Untuk menyatakan jam mulai dan selesai, waktu dapat ditempatkan di depan atau sesudah frasa ini.</p><span class="grammar-example">9じから 5じまで べんきょうします。<span class="grammar-meaning">Belajar dari pukul sembilan sampai pukul lima.</span></span></div><div class="grammar-point"><h3>5. N1 と N2</h3><p>と menghubungkan dua kata benda yang setara, misalnya dua hari, dua tempat, atau dua orang. Pola ini tidak dipakai untuk menghubungkan kata kerja atau kalimat.</p><span class="grammar-example">ぎんこうの やすみは 土曜日と 日曜日です。<span class="grammar-meaning">Hari libur bank adalah Sabtu dan Minggu.</span></span></div><div class="grammar-point"><h3>6. ～ね</h3><p>ね di akhir kalimat dipakai ketika pembicara mengharapkan persetujuan, ingin memastikan informasi, atau ingin memberi kesan simpati. Intonasi dapat naik untuk meminta konfirmasi atau turun untuk menyatakan perasaan bersama.</p><span class="grammar-example">まいにち 10じまで べんきょうします。……たいへんですね。<span class="grammar-meaning">Setiap hari belajar sampai jam sepuluh. …Wah, berat ya.</span></span></div><div class="html-note"><div><b>Fokus Pelajaran 4</b>Menyatakan jam, kebiasaan, waktu kegiatan, rentang waktu, dan respons persetujuan dalam percakapan.</div><div><b>Latihan mandiri</b>Tuliskan jadwal harian Anda dari bangun sampai tidur dengan minimal lima kata kerja bentuk ます dan tiga penanda waktu.</div></div></div>`;
const lessonFourElement = document.querySelectorAll(
  "#materials .html-lesson",
)[3];
if (lessonFourElement) {
  lessonFourElement.innerHTML = lessonFour;
}
document
  .querySelectorAll("#materials .html-lesson")
  .forEach((lesson, lessonIndex) => {
    if (lessonIndex < 4) return;
    const content = lesson.querySelector(".html-content");
    if (!content) return;
    const points = [...content.querySelectorAll(".lesson-points li")];
    if (!points.length) return;
    const title = content.querySelector(".html-pattern")?.textContent || "";
    const notes = [...content.querySelectorAll(".html-note")]
      .map((n) => n.outerHTML)
      .join("");
    content.innerHTML = `<h3>Pokok tata bahasa</h3><div class="html-pattern">${title}</div>${points.map((point, i) => `<div class="grammar-point"><h3>Poin ${i + 1}</h3><p>${point.innerHTML}</p></div>`).join("")}${notes}`;
  });
const lessonFive = `<summary><span class="lesson-number">5</span>Pelajaran 5: Perjalanan dan perpindahan</summary><div class="html-content"><div class="grammar-point"><h3>1. Tempat へ 行きます／来ます／帰ります</h3><p>Untuk menyatakan arah perpindahan, bubuhkan partikel へ setelah tempat tujuan. へ dibaca e saat digunakan sebagai partikel. 行きます berarti pergi, 来ます datang, dan 帰ります pulang.</p><span class="grammar-example">京都へ 行きます。<span class="grammar-meaning">Pergi ke Kyoto.</span></span></div><div class="grammar-point"><h3>2. どこ［へ］も 行きません／行きませんでした</h3><p>Jika kata tanya ditanyakan secara total pada kalimat negatif, gunakan も sesudah kata tanya. Pola ini dapat menyatakan tidak ke mana-mana, tidak melakukan apa-apa, atau tidak ada siapa pun yang datang.</p><span class="grammar-example">どこへも 行きません。<span class="grammar-meaning">Tidak pergi ke mana-mana.</span></span></div><div class="grammar-point"><h3>3. Kendaraan で 行きます／来ます／帰ります</h3><p>で menunjukkan sarana atau cara. Pada pola ini, kata benda sebelum で adalah kendaraan atau alat transportasi. Bila berjalan kaki, gunakan あるいて tanpa partikel で.</p><span class="grammar-example">電車で 行きます。<span class="grammar-meaning">Pergi dengan kereta rel listrik.</span></span></div><div class="grammar-point"><h3>4. Orang/hewan と V</h3><p>と menunjukkan teman melakukan aktivitas bersama. Bila melakukan kegiatan sendiri, gunakan ひとりで; bentuk ini tidak memakai と.</p><span class="grammar-example">家族と 日本へ 来ました。<span class="grammar-meaning">Datang ke Jepang bersama keluarga.</span></span></div><div class="grammar-point"><h3>5. いつ</h3><p>いつ dipakai untuk menanyakan waktu yang tidak spesifik, seperti kapan datang atau kapan pergi. Berbeda dengan waktu tertentu, いつ tidak diikuti partikel に.</p><span class="grammar-example">いつ 日本へ 来ましたか。……3月25日に 来ました。<span class="grammar-meaning">Kapan datang ke Jepang? …Datang tanggal 25 Maret.</span></span></div><div class="grammar-point"><h3>6. ～よ</h3><p>よ diletakkan di akhir kalimat untuk menyampaikan informasi yang diperkirakan belum diketahui lawan bicara, atau untuk memberi tanggapan dan pendapat dengan tegas namun tetap wajar.</p><span class="grammar-example">この 電車は 神戸へ 行きますか。……いいえ、行きません。次の「普通」ですよ。<span class="grammar-meaning">Apakah kereta ini ke Kobe? …Tidak. Yang kereta biasa berikutnya.</span></span></div><div class="grammar-point"><h3>7. そうですね</h3><p>そうですね digunakan ketika pembicara setuju atau memiliki pendapat yang sama dengan lawan bicara. Ekspresi ini berbeda dari そうですか yang dipakai saat baru menerima informasi.</p><span class="grammar-example">あしたは 日曜日ですね。……ええ、そうですね。<span class="grammar-meaning">Besok hari Minggu, ya. …Ya, betul.</span></span></div><div class="html-note"><div><b>Fokus Pelajaran 5</b>Menyatakan tujuan perjalanan, transportasi, teman perjalanan, waktu, serta cara menanggapi informasi.</div><div><b>Latihan mandiri</b>Tulis rencana perjalanan akhir pekan dengan tempat tujuan, kendaraan, teman perjalanan, dan waktu keberangkatan.</div></div></div>`;
const lessonFiveElement = document.querySelectorAll(
  "#materials .html-lesson",
)[4];
if (lessonFiveElement) {
  lessonFiveElement.innerHTML = lessonFive;
}
const lessonSix = `<summary><span class="lesson-number">6</span>Pelajaran 6: Aktivitas dan ajakan</summary><div class="html-content"><div class="grammar-point"><h3>1. N を V (kata kerja transitif)</h3><p>Objek dari kata kerja transitif ditandai dengan partikel を. Partikel ini menunjukkan benda yang secara langsung dikenai kegiatan.</p><span class="grammar-example">ジュースを 飲みます。<span class="grammar-meaning">Minum jus.</span></span></div><div class="grammar-point"><h3>2. N を します</h3><p>します dapat digunakan secara luas dengan kata benda sebagai objek untuk menyatakan melakukan suatu aktivitas. Pola ini dipakai untuk olahraga, permainan, acara, belajar, pekerjaan, dan kegiatan lain.</p><span class="grammar-example">サッカーを します。<span class="grammar-meaning">Bermain sepak bola.</span></span></div><div class="grammar-point"><h3>3. 何をしますか</h3><p>Pertanyaan ini digunakan untuk menanyakan kegiatan yang dilakukan. Jawabannya memakai objek dan kata kerja yang sesuai dengan waktu pertanyaan.</p><span class="grammar-example">月曜日 何をしますか。……京都へ 行きます。<span class="grammar-meaning">Hari Senin melakukan apa? …Pergi ke Kyoto.</span></span></div><div class="grammar-point"><h3>4. なん dan なに</h3><p>なん dan なに sama-sama berarti apa. なん dipakai sebelum bunyi seperti た、だ、dan な, juga sebelum kata bantu bilangan. なに lebih umum pada bentuk lain. なんで juga dapat berarti mengapa atau dengan apa bergantung konteks.</p><span class="grammar-example">それは 何ですか。<span class="grammar-meaning">Itu apa?</span></span></div><div class="grammar-point"><h3>5. Tempat で V</h3><p>で setelah kata benda tempat menunjukkan lokasi berlangsungnya kegiatan. Ini berbeda dari に yang menandai waktu spesifik atau lokasi keberadaan.</p><span class="grammar-example">駅で 新聞を 買います。<span class="grammar-meaning">Membeli surat kabar di stasiun.</span></span></div><div class="grammar-point"><h3>6. Vませんか</h3><p>Ekspresi ini menawarkan atau mengajak lawan bicara melakukan suatu kegiatan dengan cara yang lembut. Jawaban dapat berupa persetujuan atau penolakan yang sopan.</p><span class="grammar-example">いっしょに 京都へ 行きませんか。<span class="grammar-meaning">Bagaimana kita pergi ke Kyoto bersama-sama?</span></span></div><div class="grammar-point"><h3>7. Vましょう</h3><p>Vましょう adalah ajakan aktif untuk melakukan kegiatan bersama. Pola ini juga dipakai untuk menanggapi ajakan Vませんか secara positif.</p><span class="grammar-example">ちょっと 休みましょう。<span class="grammar-meaning">Mari istirahat sebentar.</span></span></div><div class="grammar-point"><h3>8. ～か</h3><p>か di akhir kalimat dapat menyatakan bahwa pembicara baru menerima dan memahami informasi dari lawan bicara. Fungsinya mirip そうですか, tetapi lebih singkat dan informal dalam percakapan.</p><span class="grammar-example">日曜日 京都へ 行きました。……京都ですか。いいですね。<span class="grammar-meaning">Hari Minggu pergi ke Kyoto. …Kyoto? Bagus ya.</span></span></div><div class="html-note"><div><b>Fokus Pelajaran 6</b>Menyatakan aktivitas, objek, tempat kegiatan, pertanyaan kegiatan, serta cara mengajak orang lain.</div><div><b>Latihan mandiri</b>Tulis jadwal akhir pekan dengan tiga aktivitas, objeknya, tempatnya, dan satu ajakan memakai Vませんか atau Vましょう.</div></div></div>`;
const lessonSixElement = document.querySelectorAll(
  "#materials .html-lesson",
)[5];
if (lessonSixElement) {
  lessonSixElement.innerHTML = lessonSix;
}
const lessonSeven = `<summary><span class="lesson-number">7</span>Pelajaran 7: Alat, bahasa, memberi dan menerima</summary><div class="html-content"><div class="grammar-point"><h3>1. Alat/sarana で V</h3><p>で menunjukkan alat, cara, atau bahasa yang digunakan untuk melakukan kegiatan. Dalam pola ini, bagian sebelum で menjawab pertanyaan dengan apa atau memakai bahasa apa.</p><span class="grammar-example">はしで 食べます。<span class="grammar-meaning">Makan dengan sumpit.</span></span></div><div class="grammar-point"><h3>2. 「kata/kalimat」は ～語で 何ですか</h3><p>Pertanyaan ini dipakai untuk menanyakan bagaimana menyatakan sebuah kata atau kalimat dalam bahasa lain. Nama bahasa ditempatkan sebelum で.</p><span class="grammar-example">「Thank you」は 日本語で 何ですか。……「ありがとう」です。<span class="grammar-meaning">“Thank you” dalam bahasa Jepang apa? …“Arigatou”.</span></span></div><div class="grammar-point"><h3>3. Orang に N を あげます dan sejenisnya</h3><p>あげます、かします、dan おしえます menyatakan memberi barang atau informasi kepada seseorang. Penerima ditandai dengan に.</p><span class="grammar-example">わたしは 木村さんに 花を あげました。<span class="grammar-meaning">Saya memberikan bunga kepada Sdr. Kimura.</span></span></div><div class="grammar-point"><h3>4. Orang に N を もらいます dan sejenisnya</h3><p>もらいます、かります、dan ならいます menyatakan menerima barang, meminjam, atau belajar dari seseorang. Orang sumber ditandai dengan に; から juga dapat dipakai terutama untuk organisasi.</p><span class="grammar-example">わたしは 山田さんに 花を もらいました。<span class="grammar-meaning">Saya mendapatkan bunga dari Sdr. Yamada.</span></span></div><div class="grammar-point"><h3>5. もう Vました</h3><p>もう berarti sudah. Pola ini dipakai dengan kata kerja bentuk lampau untuk menyatakan kegiatan telah selesai. Jawaban negatifnya menggunakan いいえ、まだです atau まだ Vていません.</p><span class="grammar-example">もう 荷物を 送りましたか。……はい、もう 送りました。<span class="grammar-meaning">Apakah barang sudah dikirim? …Ya, sudah dikirim.</span></span></div><div class="grammar-point"><h3>6. Menghilangkan partikel</h3><p>Dalam percakapan santai, partikel tertentu dapat dihilangkan bila hubungan makna sudah jelas. Penghilangan ini tidak selalu cocok untuk bahasa formal atau tulisan.</p><span class="grammar-example">この スプーン、すてきですね。<span class="grammar-meaning">Sendok ini bagus, ya.</span></span></div><div class="html-note"><div><b>Fokus Pelajaran 7</b>Menjelaskan alat dan bahasa, memberi/menerima, serta menyatakan pekerjaan yang sudah selesai.</div><div><b>Latihan mandiri</b>Buat dialog singkat tentang meminjam buku, mengajari bahasa, dan mengirim hadiah kepada teman.</div></div></div>`;
const lessonEight = `<summary><span class="lesson-number">8</span>Pelajaran 8: Kata sifat dan kesan</summary><div class="html-content"><div class="grammar-point"><h3>1. Kata sifat</h3><p>Kata sifat menjelaskan kondisi atau sifat kata benda. Ada dua jenis utama: い形容詞 dan な形容詞. Keduanya memiliki perubahan bentuk yang berbeda.</p><span class="grammar-example">富士山は 高いです。<span class="grammar-meaning">Gunung Fuji tinggi.</span></span></div><div class="grammar-point"><h3>2. N は な形容詞です／い形容詞です</h3><p>Kata sifat positif waktu nonlampau diakhiri です. Untuk bentuk negatif, な形容詞 memakai じゃありません, sedangkan い形容詞 mengubah い menjadi くないです. Pertanyaan dijawab dengan kata sifat, bukan そうです.</p><span class="grammar-example">あそこは 静かじゃありません。<span class="grammar-meaning">Di sana tidak tenang.</span></span></div><div class="grammar-point"><h3>3. な形容詞なN／い形容詞N</h3><p>Saat menerangkan kata benda, な形容詞 diikuti な sedangkan い形容詞 langsung ditempatkan di depan kata benda. Pola ini membentuk frasa kata benda yang lebih rinci.</p><span class="grammar-example">ワット先生は 親切な 先生です。<span class="grammar-meaning">Bapak Watt adalah guru yang baik hati.</span></span></div><div class="grammar-point"><h3>4. ～が、～</h3><p>が menyambungkan dua kalimat yang memiliki hubungan berlawanan atau paradoks. Informasi yang dianggap positif biasanya diletakkan lebih dahulu, kemudian kontrasnya menyusul.</p><span class="grammar-example">日本の 食べ物は おいしいですが、高いです。<span class="grammar-meaning">Makanan Jepang enak, tetapi mahal.</span></span></div><div class="grammar-point"><h3>5. とても／あまり</h3><p>とても berarti sangat dan digunakan pada kalimat positif. あまり berarti tidak begitu dan umumnya dipakai bersama bentuk negatif.</p><span class="grammar-example">これは とても 有名な 映画です。<span class="grammar-meaning">Ini film yang sangat terkenal.</span></span></div><div class="grammar-point"><h3>6. N は どうですか</h3><p>Pola ini menanyakan pendapat, kesan, atau keadaan mengenai benda, tempat, dan pengalaman lawan bicara.</p><span class="grammar-example">日本の 生活は どうですか。……楽しいです。<span class="grammar-meaning">Bagaimana kehidupan di Jepang? …Menyenangkan.</span></span></div><div class="grammar-point"><h3>7. N1 は どんな N2 ですか</h3><p>どんな menanyakan keadaan atau sifat seseorang/benda, lalu harus diikuti kata benda yang dijelaskan.</p><span class="grammar-example">奈良は どんな 町ですか。……古い 町です。<span class="grammar-meaning">Nara kota bagaimana? …Kota yang lama.</span></span></div><div class="grammar-point"><h3>8. そうですね</h3><p>Selain menyetujui lawan bicara, そうですね dapat memberi waktu bagi pembicara untuk berpikir sebelum menjawab pertanyaan tentang kesan atau pendapat.</p><span class="grammar-example">お仕事は どうですか。……そうですね。忙しいですが、おもしろいです。<span class="grammar-meaning">Bagaimana pekerjaan? …Hmm. Sibuk, tetapi menarik.</span></span></div><div class="html-note"><div><b>Fokus Pelajaran 8</b>Mendeskripsikan sifat, bertanya kesan, membuat frasa kata sifat, dan menyatakan kontras.</div><div><b>Latihan mandiri</b>Pilih tiga tempat atau benda. Jelaskan masing-masing dengan い形容詞 dan な形容詞, lalu bandingkan dengan ～が.</div></div></div>`;
const lessonSevenElement = document.querySelectorAll(
  "#materials .html-lesson",
)[6];
if (lessonSevenElement) {
  lessonSevenElement.innerHTML = lessonSeven;
}
const lessonEightElement = document.querySelectorAll(
  "#materials .html-lesson",
)[7];
if (lessonEightElement) {
  lessonEightElement.innerHTML = lessonEight;
}
const installLesson = (index, title, items, focus) => {
  const el = document.querySelectorAll("#materials .html-lesson")[index];
  if (!el) return;
  el.innerHTML = `<summary><span class="lesson-number">${index + 1}</span>Pelajaran ${index + 1}: ${title}</summary><div class="html-content">${items.map((x, i) => `<div class="grammar-point"><h3>${i + 1}. ${x[0]}</h3><p>${x[1]}</p><span class="grammar-example">${x[2]}<span class="grammar-meaning">${x[3]}</span></span></div>`).join("")}<div class="html-note"><div><b>Fokus pelajaran</b>${focus}</div><div><b>Latihan mandiri</b>Buat tiga kalimat menggunakan pola utama pelajaran ini, lalu ucapkan dengan suara keras.</div></div></div>`;
};
installLesson(
  8,
  "Kesukaan, kemampuan, dan jumlah",
  [
    [
      "N が わかります／すきです",
      "Pola ini menyatakan hal yang dipahami, disukai, dibenci, dikuasai, atau kurang dikuasai (わかります・すきです・きらいです・じょうずです・へたです). Objek perasaan/kemampuan memakai が.",
      "わたしは 日本語が わかります。",
      "Saya mengerti bahasa Jepang.",
    ],
    [
      "どんな N",
      "Selain jawaban ya/tidak, pertanyaan どんな dapat dijawab dengan menyebutkan nama secara konkret.",
      "どんな スポーツが 好きですか。……サッカーが 好きです。",
      "Suka olahraga apa? ……Suka sepak bola.",
    ],
    [
      "よく／だいたい／たくさん／少し／あまり／全然",
      "Kata keterangan tingkat (よく・だいたい・あまり・ぜんぜん) dan kuantitas (たくさん・すこし) diletakkan sebelum kata kerja; あまり dan ぜんぜん dipakai dengan bentuk negatif. Ketiganya (すこし・あまり・ぜんぜん) juga bisa menerangkan kata sifat.",
      "英語が 少し わかります。",
      "Mengerti bahasa Inggris sedikit.",
    ],
    [
      "～から、～",
      "から menandai alasan; alasan diletakkan sebelum akibatnya, atau dijawab tersendiri dengan ～からです.",
      "時間が ありませんから、新聞を 読みません。",
      "Karena tidak ada waktu, saya tidak membaca surat kabar.",
    ],
    [
      "どうして",
      "Kata tanya untuk menanyakan alasan, dijawab dengan ～から. どうしてですか dipakai untuk menanyakan alasan yang baru disebut lawan bicara tanpa mengulang kata-katanya.",
      "どうして 朝 新聞を 読みませんか。……時間が ありませんから。",
      "Mengapa pada pagi hari tidak membaca surat kabar? ……Sebab tidak ada waktu.",
    ],
  ],
  "Menyatakan kesukaan, kemampuan, keterangan tingkat, dan alasan.",
);
installLesson(
  9,
  "Keberadaan benda dan makhluk",
  [
    [
      "N が あります／います",
      "あります dipakai untuk benda/tumbuhan; います untuk manusia/hewan.",
      "机の 上に 本が あります。",
      "Ada buku di atas meja.",
    ],
    [
      "Tempat に N が あります／います",
      "Menekankan benda atau makhluk yang ada di suatu tempat. Tanya benda pakai なにが, tanya orang pakai だれが (bukan なには／だれは).",
      "部屋に 猫が います。",
      "Ada kucing di kamar.",
    ],
    [
      "N は tempat に あります／います",
      "Menekankan lokasi dari benda atau makhluk yang telah diketahui. Pola ini juga bisa diganti Nは tempatです (どこ tidak dibubuhi に).",
      "銀行は 駅の 前に あります。",
      "Bank berada di depan stasiun.",
    ],
    [
      "Posisi N1 の N2",
      "Kata posisi seperti atas, bawah, depan, belakang, dalam, dan luar dihubungkan dengan の. Kata posisi ini juga bisa memakai で untuk menunjukkan tempat aksi.",
      "郵便局は 銀行の となりです。",
      "Kantor pos di sebelah bank.",
    ],
    [
      "N1 や N2",
      "や menyebutkan beberapa contoh benda secara mewakili (tidak lengkap), berbeda dari と yang menyebutkan semua; など bisa ditambahkan di belakang benda terakhir untuk arti dan lain-lain.",
      "箱の 中に 手紙や 写真が あります。",
      "Di dalam kotak ada surat dan foto, antara lain.",
    ],
    [
      "Konfirmasi pertanyaan",
      "Dalam percakapan, lawan bicara sering mengulang/menegaskan inti pertanyaan dulu sebelum menjawabnya.",
      "アジアストアは どこですか。……アジアストアですか。あの ビルの 中です。",
      "Di mana Asia Store? ……Asia Store? Di dalam gedung itu.",
    ],
  ],
  "Menjelaskan keberadaan dan posisi benda, orang, serta hewan.",
);
installLesson(
  10,
  "Letak, lokasi, dan keberadaan",
  [
    [
      "Tempat あります／います",
      "Gunakan pola keberadaan untuk menanyakan atau menjelaskan lokasi fasilitas dan orang.",
      "山田さんは 事務所に います。",
      "Sdr. Yamada ada di kantor.",
    ],
    [
      "Posisi relatif",
      "うえ、した、まえ、うしろ、みぎ、ひだり、なか、そと menjelaskan hubungan letak.",
      "かばんは いすの 下に あります。",
      "Tas berada di bawah kursi.",
    ],
    [
      "N1 や N2",
      "や menghubungkan contoh benda dalam daftar yang tidak lengkap; artinya antara lain.",
      "箱の 中に 本や ノートが あります。",
      "Di dalam kotak ada buku dan buku catatan, antara lain.",
    ],
    [
      "N1 の N2",
      "Pola ini memperinci hubungan lokasi atau kepemilikan.",
      "これは 会社の 電話です。",
      "Ini telepon perusahaan.",
    ],
  ],
  "Menggunakan kosakata posisi untuk menjelaskan denah dan lokasi.",
);
installLesson(
  11,
  "Bilangan dan durasi",
  [
    [
      "Kata bantu bilangan",
      "Bilangan berubah menurut jenis benda, orang, hewan, atau urutan.",
      "クラスに 学生が 20人 います。",
      "Ada 20 mahasiswa di kelas.",
    ],
    [
      "Durasi",
      "～時間、～週間、～か月 menunjukkan lama waktu dan tidak memakai に.",
      "日本語を 3か月 勉強しました。",
      "Saya belajar Jepang selama tiga bulan.",
    ],
    [
      "Frekuensi",
      "～に～回 menunjukkan berapa kali dalam satu periode.",
      "1しゅうかんに 2回 テニスを します。",
      "Saya bermain tenis dua kali seminggu.",
    ],
    [
      "Berapa lama",
      "どのくらい menanyakan durasi atau jumlah waktu.",
      "日本に どのくらい いましたか。",
      "Berapa lama berada di Jepang?",
    ],
  ],
  "Menghitung orang/benda dan menyatakan durasi serta frekuensi.",
);
installLesson(
  12,
  "Bentuk lampau dan perbandingan",
  [
    [
      "N／な形容詞 bentuk lampau",
      "です berubah menjadi でした; bentuk negatif lampau memakai じゃありませんでした.",
      "きのうは 休みでした。",
      "Kemarin libur.",
    ],
    [
      "い形容詞 bentuk lampau",
      "い berubah menjadi かったです; negatif lampau menjadi くなかったです.",
      "きのうは 寒かったです。",
      "Kemarin dingin.",
    ],
    [
      "N1 は N2 より Aです",
      "Membandingkan dua benda/orang dengan より.",
      "日本は インドネシアより 寒いです。",
      "Jepang lebih dingin daripada Indonesia.",
    ],
    [
      "N の中で N が いちばん Aです",
      "Menyatakan yang paling dalam suatu kelompok.",
      "日本で 富士山が いちばん 高いです。",
      "Di Jepang Gunung Fuji yang paling tinggi.",
    ],
  ],
  "Menceritakan keadaan lampau dan membuat perbandingan.",
);
installLesson(
  13,
  "Keinginan dan harapan",
  [
    [
      "N が ほしいです",
      "Menyatakan keinginan memiliki benda.",
      "新しい くるまが ほしいです。",
      "Saya ingin mobil baru.",
    ],
    [
      "Vたいです",
      "Bentuk ます tanpa ます ditambah たいです untuk keinginan melakukan kegiatan.",
      "日本へ 行きたいです。",
      "Saya ingin pergi ke Jepang.",
    ],
    [
      "Tempatへ Vます-stem に行きます",
      "Menyatakan pergi ke tempat tertentu untuk melakukan kegiatan.",
      "デパートへ かいものに 行きます。",
      "Saya pergi ke department store untuk berbelanja.",
    ],
    [
      "どこか／なにか",
      "Menyatakan tempat atau benda yang tidak spesifik.",
      "なにか 飲みたいです。",
      "Saya ingin minum sesuatu.",
    ],
  ],
  "Menyampaikan keinginan, tujuan, dan rencana kegiatan.",
);
installLesson(
  14,
  "Bentuk て dan permintaan",
  [
    [
      "Vてください",
      "Meminta seseorang melakukan tindakan dengan sopan.",
      "ここに 名前を 書いてください。",
      "Tolong tulis nama di sini.",
    ],
    [
      "Vています",
      "Menyatakan kegiatan yang sedang berlangsung atau keadaan berlanjut.",
      "いま 雨が 降っています。",
      "Sekarang sedang hujan.",
    ],
    [
      "Kelompok kata kerja",
      "Bentuk て berubah menurut kelompok kata kerja; hafalkan perubahan bunyinya.",
      "読んで、書いて、食べてください。",
      "Tolong baca, tulis, dan makan.",
    ],
    [
      "Urutan tindakan",
      "Bentuk て dapat dipakai untuk menghubungkan tindakan berurutan.",
      "朝 ごはんを 食べて、学校へ 行きます。",
      "Saya sarapan lalu pergi ke sekolah.",
    ],
  ],
  "Membentuk て dan memakainya untuk permintaan serta keadaan.",
);
installLesson(
  15,
  "Izin, larangan, dan keadaan",
  [
    [
      "Vてもいいです",
      "Meminta atau memberi izin melakukan sesuatu.",
      "ここで 写真を 撮っても いいですか。",
      "Bolehkah memotret di sini?",
    ],
    [
      "Vてはいけません",
      "Menyatakan larangan atau aturan.",
      "ここで タバコを 吸っては いけません。",
      "Tidak boleh merokok di sini.",
    ],
    [
      "Vています sebagai keadaan",
      "Selain aksi sedang berlangsung, pola ini dapat menunjukkan pekerjaan, kebiasaan, atau keadaan.",
      "わたしは 銀行で 働いています。",
      "Saya bekerja di bank.",
    ],
    [
      "知っています",
      "しっています berarti tahu/kenal; bentuk negatif umum adalah しりません.",
      "田中さんの 電話番号を 知っていますか。",
      "Apakah Anda tahu nomor telepon Tanaka?",
    ],
  ],
  "Meminta izin, memahami larangan, dan membedakan fungsi Vています.",
);
const add = (i, t, a, f) => installLesson(i, t, a, f);
add(
  15,
  "Menghubungkan informasi",
  [
    [
      "Vて",
      "Menyambungkan dua tindakan yang berkaitan.",
      "朝ごはんを 食べて、出かけます。",
      "Saya sarapan lalu pergi.",
    ],
    [
      "Aくて／Aで",
      "Menyambungkan kata sifat atau kata benda.",
      "この かばんは 安くて 便利です。",
      "Tas ini murah dan praktis.",
    ],
    [
      "Vてから、V",
      "Kata kerja kedua dilakukan setelah kata kerja pertama selesai.",
      "お金を 入れてから、ボタンを 押します。",
      "Setelah memasukkan uang, tekan tombolnya.",
    ],
    [
      "Nは Nが A",
      "Menjelaskan bahwa topik (N1) memiliki sifat N2.",
      "マリアさんは 髪が 長いです。",
      "Rambut Sdr. Maria panjang.",
    ],
    [
      "Nを + でます／おります",
      "を menandai titik awal atau tempat keberangkatan, bukan objek.",
      "梅田で 電車を 降ります。",
      "Turun dari kereta di Umeda.",
    ],
    [
      "どうやって",
      "Menanyakan cara atau sarana.",
      "どうやって 駅へ 行きますか。",
      "Bagaimana pergi ke stasiun?",
    ],
    [
      "どれ／どの N",
      "Menanyakan pilihan dari lebih dari tiga benda; どれ berdiri sendiri, どの diikuti kata benda.",
      "ミラーさんの 傘は どれですか。",
      "Yang mana payung Sdr. Miller?",
    ],
  ],
  "Menghubungkan kegiatan, sifat, urutan waktu, dan cara/pilihan.",
);
add(
  16,
  "Bentuk ない dan aturan",
  [
    [
      "Vないでください",
      "Meminta agar seseorang tidak melakukan sesuatu.",
      "ここで あそばないでください。",
      "Tolong jangan bermain di sini.",
    ],
    [
      "Vなければなりません",
      "Menyatakan kewajiban.",
      "くすりを 飲まなければなりません。",
      "Harus minum obat.",
    ],
    [
      "Vなくてもいいです",
      "Menyatakan sesuatu tidak wajib.",
      "あしたは 来なくても いいです。",
      "Besok tidak perlu datang.",
    ],
  ],
  "Memakai bentuk negatif untuk aturan dan kewajiban.",
);
add(
  17,
  "Bentuk kamus dan kemampuan",
  [
    [
      "V辞書形ことができます",
      "Menyatakan kemampuan atau kemungkinan.",
      "日本語を 話すことが できます。",
      "Saya bisa berbicara Jepang.",
    ],
    [
      "しゅみは V辞書形ことです",
      "Menyatakan hobi berupa aktivitas.",
      "しゅみは 本を 読むことです。",
      "Hobi saya membaca buku.",
    ],
    [
      "V辞書形まえに",
      "Menyatakan tindakan sebelum kegiatan lain.",
      "寝る まえに 本を 読みます。",
      "Saya membaca buku sebelum tidur.",
    ],
  ],
  "Memakai bentuk kamus untuk kemampuan dan hobi.",
);
add(
  18,
  "Pengalaman dan perubahan",
  [
    [
      "Vたことがあります",
      "Menyatakan pernah mengalami sesuatu.",
      "日本へ 行ったことが あります。",
      "Saya pernah pergi ke Jepang.",
    ],
    [
      "Nに なります",
      "Menyatakan perubahan menjadi keadaan/benda.",
      "来年 先生に なります。",
      "Tahun depan menjadi guru.",
    ],
    [
      "Aく／Aに なります",
      "Menyatakan perubahan sifat atau kondisi.",
      "だんだん 暑く なりました。",
      "Lambat-laun menjadi panas.",
    ],
  ],
  "Menceritakan pengalaman dan perubahan.",
);
add(
  19,
  "Bentuk biasa",
  [
    [
      "普通形",
      "Bentuk biasa dipakai dalam percakapan informal dan pola lanjutan.",
      "きょうは 行かない。",
      "Hari ini tidak pergi.",
    ],
    [
      "Vたことがあります",
      "Menyatakan pengalaman masa lalu.",
      "富士山に 登ったことが あります。",
      "Saya pernah mendaki Gunung Fuji.",
    ],
    [
      "Nに なります",
      "Menjelaskan perubahan keadaan.",
      "4月に 春に なります。",
      "Pada April menjadi musim semi.",
    ],
  ],
  "Mengenali bentuk informal dan pengalaman.",
);
add(
  20,
  "Gaya biasa dalam percakapan",
  [
    [
      "Bentuk biasa tanya",
      "Pertanyaan informal memakai intonasi atau の/か sesuai konteks.",
      "あした ひま？",
      "Besok senggang?",
    ],
    [
      "けれども／が",
      "Menyambungkan informasi yang berlawanan dengan gaya yang sesuai.",
      "安いけれども、便利です。",
      "Murah, tetapi praktis.",
    ],
    [
      "普通形と思います",
      "Menyampaikan pendapat dengan sopan.",
      "あしたは 雨が 降ると 思います。",
      "Saya pikir besok akan hujan.",
    ],
  ],
  "Menggunakan gaya biasa secara sesuai dalam dialog.",
);
add(
  21,
  "Pendapat dan kutipan",
  [
    [
      "普通形と思います",
      "Menyatakan pikiran atau dugaan.",
      "日本は きれいだと 思います。",
      "Saya pikir Jepang indah.",
    ],
    [
      "普通形といいます",
      "Menyampaikan ucapan atau informasi orang lain.",
      "田中さんは 来ると いいます。",
      "Tanaka berkata akan datang.",
    ],
    [
      "でしょう",
      "Menyatakan perkiraan atau konfirmasi ringan.",
      "あしたは いい天気でしょう。",
      "Besok mungkin cuacanya bagus.",
    ],
  ],
  "Menyampaikan pendapat dan informasi dari orang lain.",
);
add(
  22,
  "Klausa penjelas",
  [
    [
      "普通形 + N",
      "Klausa sebelum kata benda menerangkan kata benda tersebut.",
      "これは わたしが 買った 本です。",
      "Ini buku yang saya beli.",
    ],
    [
      "Subjek dalam klausa",
      "Subjek klausa lazim memakai が.",
      "あそこに いる 人は 先生です。",
      "Orang yang ada di sana adalah guru.",
    ],
    [
      "Menerangkan tempat/waktu",
      "Klausa dapat menerangkan berbagai kata benda.",
      "日本で 撮った 写真です。",
      "Ini foto yang diambil di Jepang.",
    ],
  ],
  "Membaca dan membuat anak kalimat penerang.",
);
add(
  23,
  "Waktu dan kondisi",
  [
    [
      "Vとき",
      "Menunjukkan waktu saat suatu keadaan/tindakan terjadi.",
      "日本へ 行くとき、パスポートが いります。",
      "Saat pergi ke Jepang, perlu paspor.",
    ],
    [
      "Vと",
      "Menunjukkan hasil yang terjadi secara alami atau selalu.",
      "この ボタンを 押すと、ドアが 開きます。",
      "Jika menekan tombol ini, pintu terbuka.",
    ],
    [
      "Bentuk sebelum とき",
      "Bentuk kata berubah sesuai urutan waktu dan jenis kata.",
      "寝るとき、電気を 消します。",
      "Saat tidur, saya mematikan lampu.",
    ],
  ],
  "Menyatakan waktu dan hubungan sebab-akibat alami.",
);
add(
  24,
  "Memberi dan menerima bantuan",
  [
    [
      "Vてあげます",
      "Melakukan tindakan untuk orang lain.",
      "友達に 日本語を 教えてあげます。",
      "Saya mengajari teman bahasa Jepang.",
    ],
    [
      "Vてもらいます",
      "Menerima bantuan dari orang lain.",
      "友達に 手伝ってもらいました。",
      "Saya dibantu teman.",
    ],
    [
      "Vてくれます",
      "Orang lain melakukan bantuan untuk pembicara/pihaknya.",
      "先生が 本を 貸してくれました。",
      "Guru meminjamkan buku kepada saya.",
    ],
  ],
  "Memahami arah bantuan dari sudut pandang pembicara.",
);
add(
  25,
  "Pengandaian dan syarat",
  [
    [
      "Vたら",
      "Menyatakan jika/ketika kondisi terjadi.",
      "雨が 降ったら、行きません。",
      "Jika hujan, saya tidak pergi.",
    ],
    [
      "A／Nだったら",
      "Menyatakan pengandaian untuk kata sifat atau kata benda.",
      "ひまだったら、来てください。",
      "Jika senggang, silakan datang.",
    ],
    [
      "Vても",
      "Hasil tidak berubah walaupun kondisi terjadi.",
      "高くても、この かばんを 買います。",
      "Walaupun mahal, saya membeli tas ini.",
    ],
  ],
  "Membuat pengandaian dan menyatakan kondisi.",
);
const materialsHeading = document.querySelector("#materials .head h1");
if (materialsHeading)
  materialsHeading.textContent =
    "Dasar — Buku 1: Keterangan Tata Bahasa Pelajaran 1–25";
/* Buku 2 BUKAN view/nav terpisah lagi ("fitur Kelas" sudah dihapus) -
   section ini ditaruh di DALAM #materials supaya seluruh materi (Buku 1
   dan Buku 2) bisa diakses dari satu tempat: menu "Materi pelajaran".
   id="book2" tetap dipertahankan karena masih dipakai sebagai penanda
   viewId oleh initMaterialLessonPicker/enrichLessons di bawah. */
const bookTwo = document.createElement("section");
bookTwo.id = "book2";
bookTwo.innerHTML = `<div class="head"><div><div class="eyebrow">Materi pembelajaran</div><h1>Menengah — Buku 2</h1><p>Bagian ini masih kosong dan akan diisi setelah materi Dasar — Buku 1 selesai.</p></div></div><article class="card" style="max-width:720px"><h2>Materi sedang disiapkan</h2><p style="color:var(--muted);line-height:1.65">Untuk saat ini, silakan selesaikan seluruh materi Dasar — Buku 1 terlebih dahulu.</p></article>`;
document.getElementById("materials").appendChild(bookTwo);
const book2 = document.getElementById("book2");
if (book2) {
  book2.innerHTML = `<div class="head"><div><div class="eyebrow">Materi pembelajaran menengah</div><h1>Menengah — Buku 2</h1><p>Pelajaran 26–50 disusun bertahap dari materi tata bahasa Buku 2.</p></div></div><div class="html-course"><details class="html-lesson" open><summary><span class="lesson-number">26</span>Pelajaran 26: Meminta bantuan dan menjelaskan alasan</summary><div class="html-content"><div class="grammar-point"><h3>1. Bentuk biasa + んです</h3><p>～んです dipakai untuk menjelaskan alasan, keadaan, atau latar belakang suatu informasi. Sebelum んです digunakan bentuk biasa. Untuk kata benda dan な形容詞, gunakan ～なんです.</p><span class="grammar-example">どうして 遅れたんですか。……電車が 遅れたんです。<span class="grammar-meaning">Mengapa terlambat? …Karena keretanya terlambat.</span></span></div><div class="grammar-point"><h3>2. Vていただけませんか</h3><p>Pola ini adalah cara sangat sopan untuk meminta seseorang melakukan sesuatu. Secara harfiah pembicara meminta lawan bicara berkenan melakukan bantuan untuknya.</p><span class="grammar-example">この 漢字を 読んで いただけませんか。<span class="grammar-meaning">Bisakah Anda berkenan membacakan kanji ini?</span></span></div><div class="grammar-point"><h3>3. Vたら いいですか</h3><p>Digunakan untuk meminta saran mengenai tindakan terbaik dalam suatu keadaan. Kata kerja memakai bentuk lampau た sebelum ら.</p><span class="grammar-example">ごみは どこに 捨てたら いいですか。<span class="grammar-meaning">Sampah sebaiknya dibuang di mana?</span></span></div><div class="grammar-point"><h3>4. N は bagaimana melakukan tindakan</h3><p>Topik dengan は dapat dipakai untuk menanyakan cara menangani benda tertentu, misalnya sampah, barang, atau dokumen. Jawaban menjelaskan tindakan dan tempat/cara yang tepat.</p><span class="grammar-example">この かさは どうしたら いいですか。<span class="grammar-meaning">Payung ini sebaiknya bagaimana?</span></span></div><div class="html-note"><div><b>Fokus Pelajaran 26</b>Menjelaskan penyebab, meminta bantuan dengan sopan, dan meminta saran dalam situasi sehari-hari.</div><div><b>Latihan mandiri</b>Buat tiga pertanyaan: satu memakai んです, satu permintaan Vていただけませんか, dan satu saran Vたらいいですか.</div></div></div></details></div>`;
}
const midLesson = (n, title, items) =>
  `<details class="html-lesson"><summary><span class="lesson-number">${n}</span>Pelajaran ${n}: ${title}</summary><div class="html-content">${items.map((x, i) => `<div class="grammar-point"><h3>${i + 1}. ${x[0]}</h3><p>${x[1]}</p><span class="grammar-example">${x[2]}<span class="grammar-meaning">${x[3]}</span></span></div>`).join("")}<div class="html-note"><div><b>Fokus pelajaran</b>Gunakan pola dalam percakapan sehari-hari dan perhatikan perubahan bentuk kata kerja.</div><div><b>Latihan mandiri</b>Buat tiga kalimat memakai pola utama pada pelajaran ini.</div></div></div></details>`;
if (book2) {
  const existing = book2.querySelector(".html-course");
  if (existing) {
    existing.insertAdjacentHTML(
      "beforeend",
      midLesson(27, "Bentuk potensial dan kemampuan", [
        [
          "Bentuk potensial",
          "Menyatakan bahwa seseorang mampu melakukan suatu tindakan.",
          "わたしは 日本語が 話せます。",
          "Saya bisa berbicara Jepang.",
        ],
        [
          "Kata kerja potensial",
          "Objek kemampuan lazim memakai が.",
          "この みせで カードが 使えます。",
          "Kartu dapat digunakan di toko ini.",
        ],
        [
          "見えます／聞こえます",
          "Menyatakan sesuatu terlihat atau terdengar secara alami.",
          "海が 見えます。",
          "Laut terlihat.",
        ],
        [
          "できます",
          "Menyatakan sesuatu selesai dibuat atau fasilitas tersedia.",
          "駅の 前に 新しい ホテルが できました。",
          "Hotel baru telah dibangun di depan stasiun.",
        ],
      ]) +
        midLesson(28, "Melakukan dua kegiatan", [
          [
            "Vますながら",
            "Menyatakan melakukan dua kegiatan sekaligus; kegiatan utama berada di bagian akhir.",
            "音楽を 聞きながら 勉強します。",
            "Saya belajar sambil mendengarkan musik.",
          ],
          [
            "Vています",
            "Menyatakan kebiasaan atau keadaan yang berlanjut.",
            "毎朝 ジョギングを しています。",
            "Saya joging setiap pagi.",
          ],
          [
            "し",
            "Menyebut alasan atau beberapa sifat secara berturut.",
            "この まちは 便利だし、静かです。",
            "Kota ini praktis dan tenang.",
          ],
          [
            "それで",
            "Menghubungkan sebab dan akibat yang logis.",
            "雨でした。それで、行きませんでした。",
            "Hujan. Karena itu, saya tidak pergi.",
          ],
        ]) +
        midLesson(29, "Keadaan dan persiapan", [
          [
            "Vています",
            "Menyatakan keadaan hasil tindakan, bukan hanya aksi sedang berlangsung.",
            "窓が 閉まっています。",
            "Jendelanya tertutup.",
          ],
          [
            "Vてしまいます",
            "Menyatakan menyelesaikan sesuatu atau penyesalan atas kejadian.",
            "宿題を 忘れてしまいました。",
            "Saya terlanjur lupa PR.",
          ],
          [
            "Vますに 行きます",
            "Pergi ke suatu tempat dengan tujuan melakukan kegiatan.",
            "買い物に 行きます。",
            "Saya pergi berbelanja.",
          ],
          [
            "これ／それ／あれ",
            "Dapat menunjuk benda atau peristiwa dalam konteks percakapan.",
            "それは いい 考えです。",
            "Itu ide yang bagus.",
          ],
        ]) +
        midLesson(30, "Persiapan dan perubahan keadaan", [
          [
            "Vてあります",
            "Menyatakan keadaan hasil tindakan yang dilakukan dengan tujuan tertentu.",
            "机の 上に メモが 置いてあります。",
            "Catatan diletakkan di atas meja.",
          ],
          [
            "Vておきます",
            "Melakukan sesuatu sebagai persiapan atau membiarkannya tetap begitu.",
            "旅行の 前に 切符を 買っておきます。",
            "Saya membeli tiket terlebih dahulu sebelum perjalanan.",
          ],
          [
            "Vますはじめます",
            "Menyatakan mulai melakukan suatu aktivitas.",
            "雨が 降り始めました。",
            "Hujan mulai turun.",
          ],
          [
            "Nでも",
            "Memberi contoh atau saran yang tidak membatasi pilihan.",
            "コーヒーでも 飲みませんか。",
            "Mau minum kopi atau semacamnya?",
          ],
        ]),
    );
  }
}
if (book2) {
  const course = book2.querySelector(".html-course");
  if (course) {
    course.insertAdjacentHTML(
      "beforeend",
      midLesson(31, "Niat dan rencana", [
        [
          "Bentuk maksud",
          "～つもりです menyatakan niat pribadi untuk melakukan atau tidak melakukan tindakan.",
          "来年 日本へ 行くつもりです。",
          "Saya berniat pergi ke Jepang tahun depan.",
        ],
        [
          "V辞書形／Vない形 つもりです",
          "Gunakan bentuk kamus untuk niat melakukan dan bentuk ない untuk niat tidak melakukan.",
          "きょうは 出かけないつもりです。",
          "Hari ini saya berniat tidak keluar.",
        ],
        [
          "予定です",
          "Menyatakan jadwal atau rencana yang lebih objektif.",
          "会議は 3時からの予定です。",
          "Rapat dijadwalkan mulai jam tiga.",
        ],
      ]) +
        midLesson(32, "Nasihat dan kebiasaan", [
          [
            "Vたほうがいいです",
            "Memberi saran agar seseorang melakukan sesuatu.",
            "もっと 野菜を 食べたほうがいいです。",
            "Sebaiknya makan lebih banyak sayur.",
          ],
          [
            "Vないほうがいいです",
            "Memberi saran agar tidak melakukan sesuatu.",
            "お酒を 飲みすぎないほうがいいです。",
            "Sebaiknya jangan terlalu banyak minum alkohol.",
          ],
          [
            "Vませんか／Vましょうか",
            "Menawarkan bantuan atau mengajak dengan sopan.",
            "荷物を 持ちましょうか。",
            "Bolehkah saya membawakan barangnya?",
          ],
        ]) +
        midLesson(33, "Perintah dan larangan", [
          [
            "Bentuk perintah",
            "Dipakai pada keadaan darurat, olahraga, atau instruksi tegas; tidak cocok untuk percakapan biasa.",
            "止まれ。",
            "Berhenti.",
          ],
          [
            "Bentuk larangan",
            "Bentuk kamus + な menyatakan larangan tegas.",
            "入るな。",
            "Jangan masuk.",
          ],
          [
            "～という意味です",
            "Menjelaskan arti suatu kata, tanda, atau aturan.",
            "「立入禁止」は 入るなという意味です。",
            "“Dilarang masuk” berarti jangan masuk.",
          ],
        ]) +
        midLesson(34, "Urutan dan perubahan", [
          [
            "Vたあとで",
            "Menyatakan tindakan yang dilakukan setelah tindakan lain selesai.",
            "ごはんを 食べたあとで、勉強します。",
            "Setelah makan, saya belajar.",
          ],
          [
            "Vて／Vないで",
            "Menjelaskan cara atau keadaan saat melakukan tindakan.",
            "靴を 脱いで、入ってください。",
            "Lepaskan sepatu lalu silakan masuk.",
          ],
          [
            "～とおりに",
            "Menyatakan melakukan sesuatu sesuai contoh, petunjuk, atau rencana.",
            "説明書の とおりに してください。",
            "Tolong lakukan sesuai petunjuk.",
          ],
        ]) +
        midLesson(35, "Syarat dan pengandaian", [
          [
            "Bentuk ば",
            "Menyatakan syarat umum atau hasil yang terjadi bila kondisi terpenuhi.",
            "時間が あれば、行きます。",
            "Jika ada waktu, saya pergi.",
          ],
          [
            "～なら",
            "Menyatakan saran atau informasi berdasarkan topik yang disebut lawan bicara.",
            "京都へ 行くなら、春が いいです。",
            "Kalau pergi ke Kyoto, musim semi bagus.",
          ],
          [
            "～ても",
            "Menyatakan hasil tetap berlaku walaupun syarat terjadi.",
            "雨が 降っても、行きます。",
            "Walaupun hujan, saya pergi.",
          ],
        ]),
    );
  }
}
if (book2) {
  const course = book2.querySelector(".html-course");
  if (course) {
    course.insertAdjacentHTML(
      "beforeend",
      midLesson(36, "Tujuan dan perubahan kemampuan", [
        [
          "V辞書形ように",
          "Menyatakan tujuan yang berkaitan dengan kemampuan atau keadaan.",
          "日本語が 話せるように、毎日 練習します。",
          "Saya berlatih setiap hari agar bisa berbicara Jepang.",
        ],
        [
          "V辞書形ようにします",
          "Berusaha membiasakan diri melakukan sesuatu.",
          "毎日 野菜を 食べるようにしています。",
          "Saya membiasakan makan sayur setiap hari.",
        ],
        [
          "Vないようにします",
          "Berusaha agar tidak melakukan sesuatu.",
          "遅れないようにします。",
          "Saya akan berusaha tidak terlambat.",
        ],
      ]) +
        midLesson(37, "Bentuk pasif", [
          [
            "Bentuk pasif",
            "Digunakan saat subjek menerima tindakan dari orang lain.",
            "わたしは 先生に ほめられました。",
            "Saya dipuji oleh guru.",
          ],
          [
            "Pasif gangguan",
            "Menyatakan dampak tidak menyenangkan dari tindakan orang lain/alam.",
            "雨に 降られました。",
            "Saya kehujanan.",
          ],
          [
            "Oleh pelaku",
            "Pelaku tindakan pasif lazim ditandai dengan に.",
            "友達に 写真を 撮られました。",
            "Saya difoto oleh teman.",
          ],
        ]) +
        midLesson(38, "Nominalisasi dan indera", [
          [
            "V辞書形のは",
            "Mengubah kegiatan menjadi topik kalimat.",
            "日本語を 勉強するのは 楽しいです。",
            "Belajar bahasa Jepang menyenangkan.",
          ],
          [
            "V辞書形のが",
            "Menyatakan kesukaan atau kemampuan terhadap kegiatan.",
            "わたしは 歌うのが 好きです。",
            "Saya suka bernyanyi.",
          ],
          [
            "見えます／聞こえます",
            "Menyatakan sesuatu terlihat atau terdengar secara alami.",
            "ここから 海が 見えます。",
            "Dari sini laut terlihat.",
          ],
        ]) +
        midLesson(39, "Bentuk kausatif", [
          [
            "Bentuk kausatif",
            "Menyatakan membuat atau membiarkan seseorang melakukan tindakan.",
            "母は 子どもを 勉強させます。",
            "Ibu menyuruh anak belajar.",
          ],
          [
            "Vさせてください",
            "Meminta izin untuk melakukan sesuatu.",
            "先に 帰らせてください。",
            "Izinkan saya pulang lebih dulu.",
          ],
          [
            "Pihak yang bertindak",
            "Orang yang melakukan tindakan kausatif ditandai dengan を atau に sesuai jenis kata kerja.",
            "先生は 学生に 発表させました。",
            "Guru membuat siswa presentasi.",
          ],
        ]) +
        midLesson(40, "Bentuk kehormatan", [
          [
            "お／ご～になります",
            "Menyatakan tindakan orang yang dihormati dengan sopan.",
            "先生は もう お帰りに なりました。",
            "Guru sudah pulang.",
          ],
          [
            "お／ご～ください",
            "Meminta lawan bicara melakukan sesuatu dengan hormat.",
            "こちらに お名前を お書きください。",
            "Silakan tulis nama Anda di sini.",
          ],
          [
            "いらっしゃいます",
            "Bentuk hormat untuk 行きます、来ます、います.",
            "社長は 会議室に いらっしゃいます。",
            "Presiden direktur ada di ruang rapat.",
          ],
        ]),
    );
  }
}
if (book2) {
  const course = book2.querySelector(".html-course");
  if (course) {
    course.insertAdjacentHTML(
      "beforeend",
      midLesson(41, "Bahasa merendahkan diri", [
        [
          "お／ご～します",
          "Menyatakan tindakan pembicara dengan rendah hati kepada orang yang dihormati.",
          "わたしが ご案内します。",
          "Saya akan memandu Anda.",
        ],
        [
          "～ていただきます",
          "Menyatakan menerima izin atau kebaikan dari orang lain dengan sopan.",
          "休ませていただきます。",
          "Izinkan saya beristirahat.",
        ],
        [
          "拝見します",
          "Bentuk rendah hati dari 見ます.",
          "資料を 拝見します。",
          "Saya akan melihat dokumen.",
        ],
      ]) +
        midLesson(42, "Tujuan dan keadaan", [
          [
            "V辞書形ために",
            "Menyatakan tujuan yang disengaja.",
            "日本で 働くために、日本語を 勉強します。",
            "Saya belajar Jepang untuk bekerja di Jepang.",
          ],
          [
            "Nのために",
            "Menyatakan tujuan/manfaat bagi sesuatu.",
            "健康のために 歩きます。",
            "Saya berjalan demi kesehatan.",
          ],
          [
            "V辞書形ように",
            "Tujuan berkaitan kemampuan atau keadaan.",
            "忘れないように メモします。",
            "Saya mencatat agar tidak lupa.",
          ],
        ]) +
        midLesson(43, "Perubahan dan keberlanjutan", [
          [
            "Vてきます",
            "Menunjukkan perubahan yang mendekat ke masa kini atau pergi lalu kembali.",
            "だんだん 暑く なってきました。",
            "Lambat-laun mulai panas.",
          ],
          [
            "Vていきます",
            "Menunjukkan perubahan yang berlanjut ke masa depan.",
            "これからも 日本語を 勉強していきます。",
            "Mulai sekarang saya akan terus belajar Jepang.",
          ],
          [
            "～そうです",
            "Menyatakan tampak/sepertinya berdasarkan pengamatan.",
            "雨が 降りそうです。",
            "Sepertinya akan hujan.",
          ],
        ]) +
        midLesson(44, "Menyampaikan informasi", [
          [
            "普通形そうです",
            "Menyampaikan informasi yang didengar dari sumber lain.",
            "天気予報では 雨が 降るそうです。",
            "Menurut ramalan cuaca, katanya akan hujan.",
          ],
          [
            "～によると",
            "Menyebutkan sumber informasi.",
            "ニュースによると、電車が 遅れているそうです。",
            "Menurut berita, kereta terlambat.",
          ],
          [
            "～らしいです",
            "Menyatakan informasi atau dugaan berdasar beberapa petunjuk.",
            "あの 人は 学生らしいです。",
            "Orang itu tampaknya mahasiswa.",
          ],
        ]) +
        midLesson(45, "Pengandaian lanjutan", [
          [
            "Vたら",
            "Syarat yang terjadi lebih dahulu sebelum hasil.",
            "時間が あったら、電話します。",
            "Jika ada waktu, saya telepon.",
          ],
          [
            "～場合は",
            "Menyatakan kondisi formal, misalnya pada pengumuman.",
            "遅れる 場合は、連絡してください。",
            "Jika terlambat, tolong hubungi.",
          ],
          [
            "～のに",
            "Menyatakan hasil yang berlawanan dengan harapan.",
            "薬を 飲んだのに、治りません。",
            "Walau minum obat, tidak sembuh.",
          ],
        ]),
    );
  }
}
if (book2) {
  const course = book2.querySelector(".html-course");
  if (course) {
    course.insertAdjacentHTML(
      "beforeend",
      midLesson(46, "Tindakan yang terjadi bersamaan", [
        [
          "Vているあいだに",
          "Menyatakan suatu kejadian terjadi selama kegiatan lain berlangsung.",
          "寝ている あいだに、雨が 降りました。",
          "Saat saya tidur, hujan turun.",
        ],
        [
          "Vたところです",
          "Menyatakan tindakan baru saja selesai.",
          "いま ごはんを 食べたところです。",
          "Saya baru saja makan.",
        ],
        [
          "Vているところです",
          "Menyatakan tindakan sedang tepat berlangsung.",
          "いま 電話しているところです。",
          "Saya sedang menelepon.",
        ],
      ]) +
        midLesson(47, "Pola pasif lanjutan", [
          [
            "～と 言われます",
            "Menyampaikan perkataan orang kepada pembicara.",
            "先生に もっと 練習しなさいと 言われました。",
            "Saya diberi tahu guru agar lebih banyak berlatih.",
          ],
          [
            "～ように 言います",
            "Menyampaikan instruksi atau permintaan tidak langsung.",
            "母は 早く 寝るように 言いました。",
            "Ibu berkata agar tidur lebih cepat.",
          ],
          [
            "～と 伝えていただけませんか",
            "Meminta seseorang menyampaikan pesan dengan sopan.",
            "田中さんに 電話を くださいと 伝えていただけませんか。",
            "Bisakah Anda menyampaikan kepada Tanaka agar menelepon saya?",
          ],
        ]) +
        midLesson(48, "Hubungan sebab dan tujuan", [
          [
            "～のは ～からです",
            "Menjelaskan alasan suatu keadaan dengan bentuk nominal.",
            "日本語を 勉強するのは 日本で 働きたいからです。",
            "Saya belajar Jepang karena ingin bekerja di Jepang.",
          ],
          [
            "～ために",
            "Menyatakan sebab formal atau tujuan.",
            "台風のために、電車が 止まりました。",
            "Karena topan, kereta berhenti.",
          ],
          [
            "～ように",
            "Menyatakan tujuan yang berkaitan kemampuan/keadaan.",
            "よく 見えるように、前に 座ります。",
            "Saya duduk di depan agar terlihat jelas.",
          ],
        ]) +
        midLesson(49, "Bahasa hormat lanjutan", [
          [
            "お／ご～になります",
            "Menyatakan tindakan orang yang dihormati.",
            "部長は もう お帰りに なりました。",
            "Kepala bagian sudah pulang.",
          ],
          [
            "お／ご～ください",
            "Meminta dengan sangat sopan.",
            "こちらを ご覧ください。",
            "Silakan lihat ini.",
          ],
          [
            "お／ご～します",
            "Merendahkan tindakan pembicara untuk menghormati lawan bicara.",
            "荷物を お持ちします。",
            "Saya akan membawakan barang Anda.",
          ],
        ]) +
        midLesson(50, "Merangkum pengalaman belajar", [
          [
            "～たら／～なら",
            "Menyatakan pengandaian dan saran sesuai situasi.",
            "時間が あったら、復習してください。",
            "Jika ada waktu, silakan mengulang.",
          ],
          [
            "普通形と思います",
            "Menyatakan pendapat atau rencana pribadi.",
            "これからも 勉強を 続けようと 思います。",
            "Saya berpikir akan terus belajar.",
          ],
          [
            "～ようにしています",
            "Menyatakan kebiasaan yang diusahakan secara berkelanjutan.",
            "毎日 日本語を 読むようにしています。",
            "Saya membiasakan membaca bahasa Jepang setiap hari.",
          ],
        ]),
    );
    course.insertAdjacentHTML(
      "beforeend",
      '<article class="card"><h2>Buku 2 selesai disusun</h2><p style="color:var(--muted);line-height:1.65">Pelajaran 26–50 kini tersedia sebagai materi menengah. Gunakan flashcard dan tes untuk mengulang pola yang telah dipelajari.</p></article>',
    );
  }
}
const lessonOneMore = document.querySelector("#materials .html-lesson");
if (lessonOneMore) {
  const body = lessonOneMore.querySelector(".html-content");
  if (body) {
    body.insertAdjacentHTML(
      "beforeend",
      `<div class="grammar-point"><h3>Ringkasan perubahan bentuk kalimat</h3><table class="pattern-table"><thead><tr><th>Fungsi</th><th>Pola</th><th>Contoh</th></tr></thead><tbody><tr><td>Pernyataan</td><td>N1 は N2 です</td><td>わたしは 学生です。</td></tr><tr><td>Negatif</td><td>N1 は N2 じゃありません</td><td>わたしは 先生じゃありません。</td></tr><tr><td>Pertanyaan</td><td>N1 は N2 ですか</td><td>あなたは 学生ですか。</td></tr><tr><td>Juga</td><td>N も N です</td><td>田中さんも 学生です。</td></tr></tbody></table></div><div class="grammar-point"><h3>Dialog contoh</h3><div class="mini-dialog"><b>A:</b> はじめまして。わたしは ディバです。<br><b>B:</b> はじめまして。わたしは アニです。学生ですか。<br><b>A:</b> はい、学生です。アニさんも 学生ですか。<br><b>B:</b> いいえ、学生じゃありません。会社員です。<br><br><small>Arti: Salam kenal. Saya Divha. — Salam kenal. Saya Ani. Apakah kamu mahasiswa? — Ya. Kamu juga mahasiswa? — Tidak, saya pegawai perusahaan.</small></div></div><div class="lesson-quiz"><b>Latihan cepat Pelajaran 1</b><p>Pilih kata yang tepat: わたしは 学生（　）。</p><button class="secondary" data-l1="wrong">か</button><button class="secondary" data-l1="correct">です</button><button class="secondary" data-l1="wrong">を</button><div class="quiz-feedback" id="l1Feedback"></div></div>`,
    );
    body.querySelectorAll("[data-l1]").forEach(
      (b) =>
        (b.onclick = () => {
          document.getElementById("l1Feedback").textContent =
            b.dataset.l1 === "correct"
              ? "Benar! です menutup pernyataan nominal secara sopan."
              : "Belum tepat. Jawabannya adalah です.";
        }),
    );
  }
}
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

/* Furigana kontekstual untuk contoh dan latihan materi Buku 1-2. */
const materialFuriganaReadings = {
  "立入禁止": "たちいりきんし", "天気予報": "てんきよほう", "電話番号": "でんわばんごう",
  "一週間": "いっしゅうかん", "会議室": "かいぎしつ", "会社員": "かいしゃいん",
  "図書館": "としょかん", "説明書": "せつめいしょ", "日本語": "にほんご",
  "郵便局": "ゆうびんきょく", "富士山": "ふじさん", "月曜日": "げつようび",
  "土曜日": "どようび", "日曜日": "にちようび", "普通形": "ふつうけい",
  "形容詞": "けいようし", "事務所": "じむしょ", "辞書形": "じしょけい",
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
  "週間": "しゅうかん", "親切": "しんせつ", "手伝": "てつだ", "何時": "なんじ",
  "神戸": "こうべ", "何ですか": "なんですか", "何人": "なんにん", "何を": "なにを",
  "何の": "なんの", "何か": "なにか", "何が": "なにが", "何に": "なにに",
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
  "薬": "くすり", "何": "なに", "一": "いち",
  "飲": "の", "押": "お", "開": "あ", "帰": "かえ", "起": "お", "休": "やす",
  "吸": "す", "教": "おし", "見": "み", "言": "い", "古": "ふる", "考": "かんが",
  "行": "い", "降": "ふ", "高": "たか", "座": "すわ", "使": "つか", "始": "はじ",
  "思": "おも", "止": "と", "試": "ため", "持": "も", "治": "なお", "捨": "す",
  "出": "で", "暑": "あつ", "書": "か", "消": "け", "食": "た", "寝": "ね",
  "静": "しず", "洗": "あら", "送": "おく", "続": "つづ", "貸": "か", "脱": "ぬ",
  "知": "し", "置": "お", "遅": "おく", "伝": "つた", "登": "のぼ", "働": "はたら",
  "読": "よ", "入": "はい", "買": "か", "聞": "き", "閉": "し", "歩": "ある",
  "忘": "わす", "忙": "いそが", "話": "はな", "来": "き", "楽": "たの",
};

const materialFuriganaEntries = Object.entries(materialFuriganaReadings).sort(
  ([left], [right]) => right.length - left.length,
);

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
    const [word, reading] = match;
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

  function getPointData(content) {
    return Array.from(content.querySelectorAll(":scope > .grammar-point"))
      .map((point) => {
        const example = point.querySelector(".grammar-example");
        const meaning = example?.querySelector(".grammar-meaning");
        if (!example || !meaning) return null;
        const japaneseClone = example.cloneNode(true);
        japaneseClone.querySelector(".grammar-meaning")?.remove();
        japaneseClone.querySelectorAll("rt").forEach((reading) => reading.remove());
        const titleClone = point.querySelector("h3")?.cloneNode(true);
        titleClone?.querySelectorAll("rt").forEach((reading) => reading.remove());
        const noteClone = point
          .querySelector(".grammar-important-note")
          ?.cloneNode(true);
        noteClone?.querySelectorAll("rt").forEach((reading) => reading.remove());
        return {
          title: titleClone?.textContent.trim() || "Pola",
          japanese: japaneseClone.textContent.trim(),
          meaning: meaning.textContent.trim(),
          note: noteClone?.textContent.trim() || "",
        };
      })
      .filter(Boolean);
  }

  function buildExampleStudy(content) {
    const points = getPointData(content);
    exampleStudy.innerHTML =
      '<header class="material-study-section-head"><div class="eyebrow">TAHAP 2 · PELAJARI CONTOH</div><h3>Amati penggunaan setiap pola.</h3><p>Baca kalimat Jepang dengan suara keras, lalu periksa artinya.</p></header>';
    const list = document.createElement("div");
    list.className = "material-example-list";
    points.forEach((point, index) => {
      const card = document.createElement("article");
      card.className = "material-example-card";
      const number = document.createElement("span");
      number.className = "material-example-number";
      number.textContent = `CONTOH ${String(index + 1).padStart(2, "0")}`;
      const title = document.createElement("h4");
      title.textContent = point.title;
      addMaterialFurigana(title);
      const japanese = document.createElement("p");
      japanese.className = "material-example-japanese";
      japanese.textContent = point.japanese;
      addMaterialFurigana(japanese);
      const meaning = document.createElement("p");
      meaning.className = "material-example-meaning";
      meaning.textContent = point.meaning;
      card.append(number, title, japanese, meaning);
      if (point.note) {
        const note = document.createElement("small");
        note.className = "material-example-note";
        note.textContent = `Catatan: ${point.note}`;
        addMaterialFurigana(note);
        card.appendChild(note);
      }
      list.appendChild(card);
    });
    exampleStudy.appendChild(list);
  }

  function buildPracticeTest(content) {
    const points = getPointData(content);
    const types = ["grammar", "sentence", "completion", "arrangement"];
    const labels = {
      grammar: "Pemilihan grammar",
      sentence: "Susunan kalimat",
      completion: "Melengkapi kalimat",
      arrangement: "Menyusun kalimat",
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

    function rotate(items, amount) {
      if (items.length < 2) return items.slice();
      const offset = ((amount % items.length) + items.length) % items.length;
      return items.slice(offset).concat(items.slice(0, offset));
    }

    function tokensOf(sentence) {
      const spaced = sentence
        .replace(/([。！？])/g, " $1")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      if (spaced.length >= 3) return spaced;
      return sentence
        .replace(/([はがをにでともへか、。！？])/g, " $1 ")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    }

    function chunksOf(sentence) {
      const tokens = tokensOf(sentence);
      if (tokens.length <= 4) return tokens;
      return Array.from({ length: 4 }, (_, index) => {
        const start = Math.round((index * tokens.length) / 4);
        const end = Math.round(((index + 1) * tokens.length) / 4);
        return tokens.slice(start, end).join(" ");
      }).filter(Boolean);
    }

    function wrongSentences(sentence) {
      const chunks = chunksOf(sentence);
      if (chunks.length < 2) return [`${sentence} か`, `${sentence} ね`, `${sentence} よ`];
      return unique([
        rotate(chunks, 1).join(" "),
        chunks.slice().reverse().join(" "),
        (chunks.length > 2
          ? [chunks[0], chunks[2], chunks[1], ...chunks.slice(3)]
          : rotate(chunks, -1)
        ).join(" "),
        rotate(chunks, 2).join(" "),
      ]).filter((item) => item !== sentence);
    }

    function fourChoices(correct, distractors, offset) {
      const choices = unique([correct, ...distractors]);
      const fallback = ["です", "ます", "ません", "でした", "から", "ので"];
      let fallbackIndex = 0;
      while (choices.length < 4) {
        const item = fallback[fallbackIndex % fallback.length];
        if (!choices.includes(item)) choices.push(item);
        fallbackIndex++;
      }
      return rotate(choices.slice(0, 4), offset % 4);
    }

    function makeQuestion(point, type, index) {
      const others = points.filter((candidate) => candidate !== point);
      if (type === "grammar") {
        return {
          type,
          pointTitle: point.title,
          sourceSentence: point.japanese,
          instruction: "Pilih kalimat yang menggunakan grammar sesuai pola berikut.",
          context: point.title,
          prompt: `Arti: ${point.meaning}`,
          correct: point.japanese,
          choices: fourChoices(
            point.japanese,
            [...others.map((item) => item.japanese), ...wrongSentences(point.japanese)],
            index + 1,
          ),
        };
      }

      if (type === "sentence") {
        return {
          type,
          pointTitle: point.title,
          sourceSentence: point.japanese,
          instruction: "Pilih susunan kalimat bahasa Jepang yang benar.",
          context: `Arti: ${point.meaning}`,
          prompt: "Kalimat manakah yang susunannya paling tepat?",
          correct: point.japanese,
          choices: fourChoices(point.japanese, wrongSentences(point.japanese), index + 2),
        };
      }

      if (type === "completion") {
        const tokens = tokensOf(point.japanese);
        const candidates = tokens
          .map((token, tokenIndex) => ({ token, tokenIndex }))
          .filter(({ token }) => !/^[、。！？]$/.test(token));
        const target = candidates[Math.floor(candidates.length / 2)] || {
          token: tokens[0] || point.japanese,
          tokenIndex: 0,
        };
        const prompt = tokens
          .map((token, tokenIndex) => (tokenIndex === target.tokenIndex ? "（　　）" : token))
          .join(" ");
        const pool = unique([
          ...others.flatMap((item) => tokensOf(item.japanese)),
          "です",
          "ます",
          "ません",
          "から",
        ]).filter((token) => token !== target.token && !/^[、。！？]$/.test(token));
        return {
          type,
          pointTitle: point.title,
          sourceSentence: point.japanese,
          instruction: "Pilih kata atau pola yang tepat untuk melengkapi kalimat.",
          context: `Arti: ${point.meaning}`,
          prompt,
          correct: target.token,
          choices: fourChoices(target.token, pool, index + 3),
        };
      }

      const chunks = chunksOf(point.japanese);
      const shuffled = chunks.length > 1 ? rotate(chunks, 1) : chunks;
      const correctOrder = chunks.map((chunk) => shuffled.indexOf(chunk) + 1);
      const correct = correctOrder.join(" - ");
      const variants = [
        rotate(correctOrder, 1),
        correctOrder.slice().reverse(),
        correctOrder.length > 2
          ? [correctOrder[0], correctOrder[2], correctOrder[1], ...correctOrder.slice(3)]
          : rotate(correctOrder, -1),
        rotate(correctOrder, 2),
      ].map((order) => order.join(" - "));
      return {
        type,
        pointTitle: point.title,
        sourceSentence: point.japanese,
        instruction: "Pilih urutan nomor yang membentuk kalimat dengan benar.",
        context: `Arti: ${point.meaning}`,
        prompt: shuffled.map((chunk, i) => `${i + 1}. ${chunk}`).join("　｜　"),
        correct,
        choices: fourChoices(correct, variants, index),
      };
    }

    const questionCount = points.length ? Math.max(8, points.length) : 0;
    const questions = Array.from({ length: questionCount }, (_, index) =>
      makeQuestion(points[index % points.length], types[index % types.length], index),
    );
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

    function explanationFor(question) {
      if (question.type === "grammar")
        return `Kalimat tersebut memakai pola ${question.pointTitle} dan sesuai dengan arti yang diberikan.`;
      if (question.type === "sentence")
        return `Susunan yang benar adalah ${question.sourceSentence}. Perhatikan posisi unsur kalimat dan pola ${question.pointTitle}.`;
      if (question.type === "completion")
        return `Bagian yang tepat melengkapi pola ${question.pointTitle}. Kalimat lengkapnya: ${question.sourceSentence}`;
      return `Urutan tersebut membentuk kalimat ${question.sourceSentence} sesuai pola ${question.pointTitle}.`;
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
      '<header class="material-study-section-head"><div class="eyebrow">TAHAP 3 · KERJAKAN LATIHAN</div><h3>Simulasi mini JLPT / JFT.</h3><p>Kerjakan empat jenis soal. Setiap jawaban disertai pembahasan singkat.</p></header><div class="material-test-types"><span>Pemilihan grammar</span><span>Susunan kalimat</span><span>Melengkapi kalimat</span><span>Menyusun kalimat</span></div><div class="material-mistake-bar" hidden><div><b>Daftar kesalahan bab ini</b><span></span></div><button type="button">Ulangi soal yang salah</button></div><div class="material-practice-card"></div>';
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
          const nextQuestions = reviewMode ? reviewQuestions() : questions;
          resetSession(nextQuestions.length ? nextQuestions : questions, reviewMode && nextQuestions.length > 0);
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
          explanation.textContent = explanationFor(question);
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
    activeContent
      .querySelectorAll(".grammar-japanese-example")
      .forEach((example) => addMaterialFurigana(example, true));
    activeContent
      .querySelectorAll(
        ".grammar-point > h3, .grammar-short-explanation, .grammar-important-note",
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
