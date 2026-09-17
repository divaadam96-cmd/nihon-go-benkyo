/* Konten teks pelajaran (grammar Pelajaran 1-50 + kerangka Buku 1/2) untuk
   halaman Materi. Dipisah dari js/pages/materi.js (2267 baris, sebagian
   besar teks pelajaran bercampur dengan logika render/quiz/progress)
   supaya konten dan logika tidak tercampur - lihat README.md/docs/desain.md.
   installMateriGrammarContent() dipanggil SEKALI oleh initPage() di
   materi.js, di awal fungsi. Isinya PERSIS sama seperti sebelum dipisah
   (dipindah apa adanya, bukan ditulis ulang) - kalau mau ubah teks
   pelajaran, di sinilah tempatnya; kalau mau ubah cara pelajaran
   dirender/logika quiz, itu tetap di materi.js.
   Butuh fullLessons/detailedGrammar/pointExamples dari data/materi-data.js
   (harus dimuat SEBELUM file ini). */
function installMateriGrammarContent() {
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

}
