/* Halaman Tes Kemampuan (pages/latihan.html). Dulu prototype-tes-v2.js yang
   jalan langsung begitu skrip termuat; sekarang dibungkus initPage() dan
   dijalankan auth.js SETELAH login, sama seperti halaman lain, supaya
   header/sidebar bersama (js/app-shell.js) selalu terpasang dulu. */
function initPage() {
  /* Soal tes (paket siap pakai & per-5-Bab) beserta kunci jawabannya ada di
   database (package_questions / quiz_questions) - browser hanya menerima
   soal TANPA kunci lewat get_test_questions(), dan penilaian + penyimpanan
   nilai dilakukan server lewat grade_test(). Lihat
   supabase/secure-test-grading.sql. Daftar paket (label, batas waktu,
   tampilan) juga dari database lewat list_test_packages() - paket baru
   cukup ditambahkan di tabel (supabase/contoh-tambah-paket.sql). */
  let testPackages = [];
  async function loadTestPackages() {
    try {
      const { data, error } = await window.supabaseClient.rpc("list_test_packages");
      if (!error && data) testPackages = data;
    } catch (e) {}
  }
  function packageInfo(key) {
    return (
      testPackages.find((p) => p.key === key) || {
        key,
        label: key,
        mark: "SET",
        description: "",
        time_limit_minutes: 60,
        one_page: false,
      }
    );
  }
  /* HTML soal dari database disaring dulu (js/soal-html.js - aturan sama
   dengan is_safe_question_html() di server). */
  const sanitizeHtml = window.sanitizeQuestionHtml;
  const $ = (id) => document.getElementById(id);
  let questions = [],
    rangeStart = 1,
    mockPackage = "",
    current = 0,
    answers = [],
    checked = [],
    flags = [],
    graded = false,
    furigana = true,
    timerId = null,
    seconds = 720,
    reviewOnly = false,
    reviewIndexes = [],
    onePageExamRendered = false;
  /* Kontrol akses tes kemampuan: siswa hanya bisa mulai tes yang sudah
   terbuka sesuai kemajuannya atau lewat akses dari Sensei/Operator (lihat
   renderTesGate). Sensei/Operator sendiri tetap pakai form pilih-bebas di
   bawah (dipakai untuk menyiapkan/mengecek soal). */
  let restrictedMode = false,
    activeAssignmentId = null;
  // Nilai acuan lulus Tes per 5 Bab (= target_bab_kkm() di SQL).
  const TES_KKM = 80;
  /* Percobaan tes di server (start_test, supabase/fix-2-batas-waktu-server.sql):
   waktu mulai & tenggat dicatat server, jadi timer di layar hanya MENAMPILKAN
   sisa waktu menuju tenggat itu (dihitung ulang tiap detik dari jam server,
   bukan dikurangi satu-satu) - menghentikan timer, reload, atau mengubah jam
   laptop tidak memberi waktu tambahan. clockOffset = selisih jam server -
   jam perangkat. Jawaban dikirim ke server setiap kali dipilih
   (save_test_answers), jadi tes yang ditinggal tetap dinilai dari jawaban
   yang sudah tersimpan saat waktunya habis. */
  let attempt = null,
    clockOffset = 0,
    pendingSave = {},
    saveTimer = null,
    saving = false;
  function serverNowMs() {
    return Date.now() + clockOffset;
  }
  function testRunning() {
    return !!attempt && !graded;
  }
  function escapeHtmlTes(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
  }
  function shuffled(values) {
    const list = [...values];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }
  /* Pilihan jawaban diacak per siswa (kecuali soal Mendengarkan yang
   pilihannya nomor gambar/audio). order[i] = index pilihan ASLI untuk
   posisi tampil i - jawaban dikirim ke server dalam index asli, dan kunci
   dari server dipetakan balik ke posisi tampil setelah dinilai. Paket
   siap pakai sengaja TIDAK diacak urutan soalnya supaya format ujian
   resmi (Mondai 1→2→3→4) tetap utuh; Tes per 5 Bab diacak supaya tiap
   pengulangan terasa berbeda. */
  function rowToQuestion(row) {
    const options = row.options || [];
    const order = row.category === "Mendengarkan" ? options.map((_, i) => i) : shuffled(options.map((_, i) => i));
    return {
      id: row.id,
      category: row.category,
      subcategory: row.subcategory || "",
      instruction: sanitizeHtml(row.instruction),
      html: sanitizeHtml(row.html),
      options: order.map((i) => String(options[i])),
      order,
      material: row.material || "",
      image: row.image || "",
      audioSrc: row.audio_src || "",
      srsId: row.srs_id || "",
      answer: undefined,
      explanation: "",
    };
  }
  function currentTest() {
    return mockPackage ? { kind: "paket", ref: mockPackage } : { kind: "bab", ref: String(rangeStart) };
  }
  async function buildSelectedQuestions() {
    if (!window.supabaseClient) throw new Error("Koneksi ke server belum siap.");
    const { kind, ref } = currentTest();
    const { data, error } = await window.supabaseClient.rpc("get_test_questions", { p_kind: kind, p_ref: ref });
    if (error) throw error;
    if (!data || !data.length) throw new Error("Soal untuk tes ini belum tersedia.");
    const list = data.map(rowToQuestion);
    questions = mockPackage ? list : shuffled(list);
    // Melanjutkan percobaan: pulihkan jawaban yang sudah tersimpan di server.
    const saved = (attempt && attempt.answers) || {};
    answers = questions.map((q) => {
      const orig = saved[q.id];
      return orig == null ? null : q.order.indexOf(Number(orig));
    });
    $("heroQuestionTotal").textContent = questions.length;
    $("heroPackage").textContent = mockPackage ? packageInfo(mockPackage).label : `Bab ${rangeStart}–${rangeStart + 4}`;
  }
  /* Batas waktu wajib (tidak bisa dimatikan siswa): latihan per 5 bab
   maksimal 45 menit, paket mengikuti batas waktu paketnya (test_packages). */
  function timeLimitSeconds() {
    return mockPackage ? packageInfo(mockPackage).time_limit_minutes * 60 : 2700;
  }
  function updateTimerInfo() {
    const minutes = timeLimitSeconds() / 60;
    $("timerInfo").querySelector("b").textContent = `Timer ${minutes} menit`;
  }
  function updatePackagePreview() {
    updateTimerInfo();
    if (mockPackage) {
      const pkg = packageInfo(mockPackage),
        label = pkg.label;
      $("selectedTestName").textContent = label;
      $("selectedRangeText").textContent = pkg.description || "Paket soal siap pakai.";
      $("heroExamType").textContent = "Paket Siap Pakai";
      $("heroPackage").textContent = label;
      return;
    }
    $("selectedTestName").textContent = `Tes per 5 Bab · Bab ${rangeStart}–${rangeStart + 4}`;
    $("selectedRangeText").textContent =
      `Cara baca & penulisan kanji, partikel, susunan kalimat, dan soal cerita dari Bab ${rangeStart}–${rangeStart + 4}.`;
    $("heroExamType").textContent = "Per 5 Bab";
    $("heroPackage").textContent = `Bab ${rangeStart}–${rangeStart + 4}`;
  }
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP";
    u.rate = 0.82;
    speechSynthesis.speak(u);
  }
  function activeQuestionIndex() {
    return reviewOnly ? reviewIndexes[current] : current;
  }
  function renderNavigator() {
    const grid = $("numberGrid");
    grid.replaceChildren();
    questions.forEach((_, index) => {
      const b = document.createElement("button");
      b.textContent = index + 1;
      b.classList.toggle("current", index === activeQuestionIndex());
      b.classList.toggle("answered", answers[index] !== null);
      b.classList.toggle("flagged", flags[index]);
      b.onclick = () => {
        reviewOnly = false;
        current = index;
        renderQuestion();
      };
      grid.append(b);
    });
    $("answeredCount").textContent = `${answers.filter((v) => v !== null).length} / ${questions.length}`;
    $("temporaryScore").textContent = graded ? questions.filter((q, i) => answers[i] === q.answer).length : "—";
    $("flaggedCount").textContent = flags.filter(Boolean).length;
    // Tombol "Selesaikan tes" baru boleh ditekan setelah semua soal terjawab -
    // siswa masih bisa lompat antar nomor lewat grid ini tanpa menjawab semua
    // dulu, jadi pengecekan lengkap ini yang mencegah selesai sebelum waktunya.
    const allAnswered = answers.every((value) => value !== null);
    $("finishEarly").disabled = !allAnswered;
    $("finishHint").hidden = allAnswered;
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
  function isListeningQuestion(q) {
    return q.category === "Mendengarkan";
  }
  function isOnePageExam() {
    return !!mockPackage && packageInfo(mockPackage).one_page;
  }
  /* Mengelompokkan index-index satu kategori jadi beberapa もんだい: soal
   Mendengarkan sudah punya field subcategory eksplisit (sudah diverifikasi
   manual terhadap PDF); kategori lain belum punya label eksplisit, jadi
   nomor もんだい diturunkan dari field material (bagian setelah "·") -
   soal dengan slug material yang sama dianggap satu もんだい, nomornya
   mengikuti urutan kemunculan pertama dalam kategori tersebut. */
  function mondaiGroupsFor(indices) {
    const groups = {},
      order = [];
    let counter = 0;
    const seen = {};
    indices.forEach((i) => {
      const q = questions[i];
      let key = q.subcategory;
      if (!key) {
        const slug = (q.material || "").split("·").pop().trim() || "soal";
        if (!seen[slug]) {
          counter++;
          seen[slug] = `もんだい${counter}`;
        }
        key = seen[slug];
      }
      if (!groups[key]) {
        groups[key] = [];
        order.push(key);
      }
      groups[key].push(i);
    });
    return order.map((key) => ({ key, indices: groups[key] }));
  }
  /* Antrekan jawaban soal qi untuk dikirim ke server (digabung tiap ~0,8 detik
   supaya klik beruntun = satu request). Gagal kirim -> dicoba lagi; ditolak
   karena waktu habis -> tes langsung diselesaikan. */
  function queueAnswerSave(qi) {
    if (!attempt || graded) return;
    const q = questions[qi];
    if (!q || answers[qi] == null) return;
    pendingSave[q.id] = q.order[answers[qi]];
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flushAnswerSave, 800);
  }
  async function flushAnswerSave() {
    if (saving || !attempt || graded || !Object.keys(pendingSave).length) return;
    saving = true;
    const batch = pendingSave;
    pendingSave = {};
    try {
      const { data, error } = await window.supabaseClient.rpc("save_test_answers", {
        p_attempt_id: attempt.attempt_id,
        p_answers: batch,
      });
      if (error) throw error;
      if (data && data[0]) clockOffset = Date.parse(data[0].server_now) - Date.now();
      $("saveStatus").textContent = "✓ Jawaban tersimpan";
      $("saveStatus").classList.remove("is-error");
    } catch (e) {
      pendingSave = { ...batch, ...pendingSave };
      if (/habis|selesai/i.test((e && e.message) || "")) {
        finishTest();
        return;
      }
      $("saveStatus").textContent = "⚠ Belum tersimpan - mencoba lagi…";
      $("saveStatus").classList.add("is-error");
      clearTimeout(saveTimer);
      saveTimer = setTimeout(flushAnswerSave, 3000);
    } finally {
      saving = false;
    }
  }
  function bindExamAnswerButtons(container) {
    container.querySelectorAll("button[data-qidx]").forEach((btn) => {
      btn.onclick = () => {
        const qi = Number(btn.dataset.qidx),
          choice = Number(btn.dataset.choice);
        answers[qi] = choice;
        queueAnswerSave(qi);
        btn.parentElement.querySelectorAll("button").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        $("testProgress").style.width = `${(answers.filter((v) => v !== null).length / questions.length) * 100}%`;
        renderNavigator();
      };
    });
  }
  function renderExamOnePage(forceRebuild) {
    $("categoryBadge").textContent = `SIMULASI · ${packageInfo(mockPackage).mark}`;
    $("questionCounter").textContent = `${questions.length} soal · isi semua lalu klik "Selesaikan tes"`;
    $("testProgress").style.width = `${(answers.filter((v) => v !== null).length / questions.length) * 100}%`;
    $("instruction").textContent = "";
    $("audioButton").hidden = true;
    $("explanation").hidden = true;
    $("questionText").classList.toggle("hide-furigana", !furigana);
    $("flagQuestion").hidden = true;
    $("previousQuestion").hidden = true;
    $("checkAnswer").hidden = true;
    $("nextQuestion").hidden = true;
    if (!forceRebuild && onePageExamRendered) {
      questions.forEach((q, i) => {
        $("questionText")
          .querySelectorAll(`button[data-qidx="${i}"]`)
          .forEach((btn) => {
            btn.classList.toggle("selected", answers[i] === Number(btn.dataset.choice));
          });
      });
      document.getElementById(`examQ${current}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      renderNavigator();
      return;
    }
    const categories = {},
      catOrder = [];
    questions.forEach((q, i) => {
      if (!categories[q.category]) {
        categories[q.category] = [];
        catOrder.push(q.category);
      }
      categories[q.category].push(i);
    });
    let html = `<p class="operator-hint">Kerjakan seluruh soal di halaman ini, lalu klik "Selesaikan tes" di panel navigasi sebelah kanan.</p>`;
    catOrder.forEach((cat) => {
      html += `<h2 class="exam-category-title">${cat.toUpperCase()}</h2>`;
      /* Satu audio dipakai bersama untuk SELURUH kategori ini (semua soal
       Mendengarkan berasal dari satu file rekaman yang sama) - jadi
       pemutar audio cukup ditampilkan sekali di sini, bukan diulang di
       setiap もんだい seperti sebelumnya. */
      const catAudioSrc = questions[categories[cat][0]].audioSrc;
      if (catAudioSrc)
        html += `<div class="listening-audio-top"><audio controls src="../${catAudioSrc}"></audio><small>Putar rekaman ini dari awal, lalu jawab semua soal mendengarkan di bawah sambil mendengarkan.</small></div>`;
      mondaiGroupsFor(categories[cat]).forEach(({ key, indices: idxs }) => {
        html += `<div class="listening-mondai"><h3>${key}</h3><p class="listening-instruction">${questions[idxs[0]].instruction}</p>`;
        idxs.forEach((qi, subI) => {
          const q = questions[qi],
            listening = isListeningQuestion(q);
          html += `<div class="listening-item" id="examQ${qi}"><b>${listening ? `${subI + 1}ばん` : `Soal ${qi + 1}`}</b>`;
          if (!listening) html += `<div class="question-text">${q.html}</div>`;
          if (q.image) html += `<img class="listening-item-image" src="../${q.image}" alt="Ilustrasi soal">`;
          if (listening)
            html += `<div class="listening-item-answers">${q.options.map((opt, oi) => `<button data-qidx="${qi}" data-choice="${oi}" class="${answers[qi] === oi ? "selected" : ""}">${escapeHtmlTes(opt)}</button>`).join("")}</div>`;
          else
            html += `<div class="answers">${q.options.map((opt, oi) => `<button data-qidx="${qi}" data-choice="${oi}" class="${answers[qi] === oi ? "selected" : ""}"><b>${String.fromCharCode(65 + oi)}</b><span>${escapeHtmlTes(opt)}</span></button>`).join("")}</div>`;
          html += "</div>";
        });
        html += "</div>";
      });
    });
    $("questionText").innerHTML = html;
    $("answers").replaceChildren();
    bindExamAnswerButtons($("questionText"));
    onePageExamRendered = true;
    renderNavigator();
  }
  function renderQuestion() {
    const index = activeQuestionIndex(),
      q = questions[index];
    if (isOnePageExam() && !reviewOnly) {
      renderExamOnePage(!onePageExamRendered);
      return;
    }
    onePageExamRendered = false;
    $("categoryBadge").textContent = q.category.toUpperCase();
    $("questionCounter").textContent = reviewOnly
      ? `Tinjauan ${current + 1} dari ${reviewIndexes.length}`
      : `Soal ${index + 1} dari ${questions.length}`;
    $("instruction").textContent = q.instruction;
    $("questionText").innerHTML = q.html;
    $("questionText").classList.toggle("hide-furigana", !furigana);
    $("testProgress").style.width =
      `${(((reviewOnly ? current : index) + 1) / (reviewOnly ? reviewIndexes.length : questions.length)) * 100}%`;
    $("audioButton").hidden = !q.audio;
    if (q.audio) $("audioButton").onclick = () => speak(q.audio);
    const box = $("answers");
    box.replaceChildren();
    q.options.forEach((option, choice) => {
      const b = document.createElement("button");
      b.innerHTML = `<b>${String.fromCharCode(65 + choice)}</b><span></span>`;
      b.querySelector("span").textContent = option;
      b.classList.toggle("selected", answers[index] === choice);
      if (checked[index] || reviewOnly) b.disabled = true;
      if (reviewOnly) {
        b.classList.toggle("correct", choice === q.answer);
        b.classList.toggle("wrong", answers[index] === choice && choice !== q.answer);
      }
      b.onclick = () => {
        answers[index] = choice;
        queueAnswerSave(index);
        renderQuestion();
      };
      box.append(b);
    });
    $("explanation").hidden = !reviewOnly;
    if (reviewOnly) {
      const correct = answers[index] === q.answer;
      $("explanation").className = `explanation${correct ? "" : " wrong"}`;
      $("explanation").innerHTML = `<b>${correct ? "Jawaban benar" : "Belum tepat"}</b>${q.explanation}`;
    }
    $("flagQuestion").hidden = false;
    $("flagQuestion").classList.toggle("active", flags[index]);
    $("flagQuestion").textContent = flags[index] ? "★ Ditandai" : "☆ Tandai soal";
    $("previousQuestion").hidden = false;
    $("previousQuestion").disabled = current === 0;
    $("nextQuestion").hidden = reviewOnly;
    $("nextQuestion").textContent = index === questions.length - 1 ? "Lihat hasil →" : "Soal berikutnya →";
    $("checkAnswer").hidden = reviewOnly;
    $("checkAnswer").textContent = index === questions.length - 1 ? "Simpan & lihat hasil" : "Simpan & berikutnya";
    renderNavigator();
  }
  function checkOrAdvance() {
    const index = activeQuestionIndex();
    if (answers[index] === null) {
      $("explanation").hidden = false;
      $("explanation").className = "explanation wrong";
      $("explanation").innerHTML =
        "<b>Pilih satu jawaban terlebih dahulu.</b>Setelah memilih, jawaban dapat diperiksa.";
      return;
    }
    checked[index] = true;
    if (index === questions.length - 1) finishTest();
    else {
      current++;
      renderQuestion();
    }
  }
  function advance() {
    if (activeQuestionIndex() === questions.length - 1) finishTest();
    else {
      current++;
      renderQuestion();
    }
  }
  function categoryScores() {
    const result = {};
    questions.forEach((q, i) => {
      result[q.category] ??= { correct: 0, total: 0 };
      result[q.category].total++;
      if (answers[i] === q.answer) result[q.category].correct++;
    });
    return result;
  }
  /* Jawaban benar/salah dikirim sebagai review SRS (js/srs.js) - ini yang
   membuat kesalahan di tes benar-benar terjadwal untuk diulang di Hafalan,
   bukan cuma tampil sekali di daftar kesalahan lalu terlupakan. */
  function pushQuizAnswersToSrs() {
    if (typeof srsReview !== "function") return;
    questions.forEach((q, i) => {
      if (!q.srsId) return;
      try {
        srsReview(q.srsId, answers[i] === q.answer ? "good" : "again");
      } catch (e) {}
    });
  }
  /* Kirim jawaban ke server untuk dinilai (grade_test, security definer):
   server menghitung skor, menyimpan quiz_results, menandai akses tes
   selesai, lalu baru mengembalikan kunci + pembahasan. Kalau gagal
   (offline dsb.), jawaban TIDAK hilang - layar hasil menampilkan tombol
   kirim ulang. */
  let grading = false;
  async function finishTest() {
    if (grading || graded) return;
    grading = true;
    clearInterval(timerId);
    checked = checked.map(() => true);
    $("testScreen").hidden = true;
    $("resultScreen").hidden = false;
    $("finalScore").textContent = "…";
    $("resultTitle").textContent = "Menilai jawaban…";
    $("resultSummary").textContent = "Jawabanmu sedang dikirim ke server untuk dinilai.";
    $("retryGrading").hidden = true;
    $("resultLulus").hidden = true;
    $("categoryResults").replaceChildren();
    $("recommendations").replaceChildren();
    $("mistakeList").replaceChildren();
    $("reviewMistakes").hidden = true;
    clearTimeout(saveTimer);
    const submitted = {};
    questions.forEach((q, i) => {
      if (answers[i] !== null) submitted[q.id] = q.order[answers[i]];
    });
    try {
      const { data, error } = await window.supabaseClient.rpc("grade_test", {
        p_attempt_id: attempt.attempt_id,
        p_answers: submitted,
      });
      if (error) throw error;
      const byId = new Map((data || []).map((row) => [String(row.question_id), row]));
      /* Untuk soal yang dijawab benar server tidak mengirim kunci/pembahasan
       (fix-4-pembahasan-soal-salah.sql) - kuncinya = pilihan siswa sendiri. */
      questions.forEach((q, i) => {
        const row = byId.get(String(q.id));
        if (!row) return;
        if (row.is_correct && row.answer == null) {
          q.answer = answers[i];
          q.explanation = "";
        } else {
          q.answer = q.order.indexOf(row.answer);
          q.explanation = sanitizeHtml(row.explanation);
        }
      });
      graded = true;
      activeAssignmentId = null;
      pendingSave = {};
    } catch (e) {
      $("finalScore").textContent = "!";
      $("resultTitle").textContent = "Jawaban belum terkirim.";
      $("resultSummary").textContent =
        `Gagal menghubungi server (${e && e.message ? e.message : e}). Jawabanmu masih tersimpan di halaman ini - periksa koneksi lalu kirim ulang.`;
      $("retryGrading").hidden = false;
      return;
    } finally {
      grading = false;
    }
    showResults();
  }
  function showResults() {
    const correct = questions.filter((q, i) => answers[i] === q.answer).length,
      score = Math.round((correct / questions.length) * 100);
    $("finalScore").textContent = score;
    $("resultTitle").textContent =
      (serverNowMs() > Date.parse(attempt.deadline) ? "Waktu habis. " : "") +
      (score >= 80
        ? "Fondasi kamu sudah kuat."
        : score >= 60
          ? "Fondasi sudah terbentuk."
          : "Mari perkuat dasar sedikit lagi.");
    $("resultSummary").textContent =
      `${correct} dari ${questions.length} soal benar. ${questions.length - correct} soal tersimpan dalam bank kesalahan untuk ditinjau kembali.`;
    // Acuan 80: Tes per 5 Bab = lulus/belum; paket = target latihan saja
    // (kelulusan JLPT asli memakai skala & batas per bagian yang berbeda).
    const lulus = score >= TES_KKM;
    $("resultLulus").hidden = false;
    $("resultLulus").className = `result-lulus${lulus ? " lulus" : ""}`;
    $("resultLulus").textContent = mockPackage
      ? `${lulus ? "🎯 Target latihan tercapai" : "🎯 Target latihan belum tercapai"} (nilai ${TES_KKM} ke atas). Nilai simulasi ini bukan nilai kelulusan JLPT resmi.`
      : lulus
        ? `✅ Lulus Tes per 5 Bab (nilai minimal ${TES_KKM}).`
        : `Belum lulus - perlu nilai minimal ${TES_KKM}. Pelajari bank kesalahan, lalu coba lagi${restrictedMode ? " besok" : ""}.`;
    $("reviewMistakes").hidden = false;
    pushQuizAnswersToSrs();
    const categoryBox = $("categoryResults");
    categoryBox.replaceChildren();
    Object.entries(categoryScores()).forEach(([name, value]) => {
      const pct = Math.round((value.correct / value.total) * 100),
        row = document.createElement("div");
      row.innerHTML = `<span>${name}</span><i style="--score:${pct}%"></i><b>${pct}%</b>`;
      categoryBox.append(row);
    });
    const weakest = Object.entries(categoryScores())
      .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
      .slice(0, 2);
    $("recommendations").innerHTML =
      weakest
        .map(
          ([name]) =>
            `<div><b>Perkuat ${name}</b>Ulangi materi dan latihan terkait sebelum mencoba simulasi berikutnya.</div>`,
        )
        .join("") +
      `<div><b>Ulangi bank kesalahan</b>Fokuskan sesi berikutnya pada ${questions.length - correct} soal yang masih salah.</div>`;
    reviewIndexes = questions.map((q, i) => (answers[i] !== q.answer ? i : -1)).filter((i) => i >= 0);
    const list = $("mistakeList");
    list.replaceChildren();
    reviewIndexes.forEach((i) => {
      const q = questions[i],
        a = document.createElement("article");
      a.innerHTML = `<b>Soal ${i + 1} · ${escapeHtmlTes(q.category)}</b><p>Jawabanmu: ${answers[i] === null ? "Belum dijawab" : escapeHtmlTes(q.options[answers[i]])} · Jawaban benar: ${escapeHtmlTes(q.options[q.answer])}</p><p>${q.explanation}</p><small>Pelajari kembali: ${escapeHtmlTes(q.material)}</small>`;
      list.append(a);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  /* Timer wajib, menghitung mundur ke tenggat dari server (attempt.deadline).
   Saat waktu habis, tes otomatis selesai lewat finishTest() meski belum
   semua soal terjawab. */
  function startTimer() {
    clearInterval(timerId);
    const deadline = Date.parse(attempt.deadline);
    const tick = () => {
      seconds = Math.max(0, Math.ceil((deadline - serverNowMs()) / 1000));
      const m = String(Math.floor(seconds / 60)).padStart(2, "0"),
        s = String(seconds % 60).padStart(2, "0");
      $("timer").textContent = `${m}:${s}`;
      if (seconds <= 0) finishTest();
    };
    tick();
    timerId = setInterval(tick, 1000);
  }
  async function startTest() {
    const button = $("startTest");
    button.disabled = true;
    const originalLabel = button.innerHTML;
    button.innerHTML = "Memuat soal…";
    try {
      const { kind, ref } = currentTest();
      const { data, error } = await window.supabaseClient.rpc("start_test", {
        p_kind: kind,
        p_ref: ref,
        p_assignment_id: activeAssignmentId,
      });
      if (error) throw error;
      attempt = data && data[0];
      if (!attempt) throw new Error("Tes gagal dibuka.");
      clockOffset = Date.parse(attempt.server_now) - Date.now();
      graded = false;
      pendingSave = {};
      await buildSelectedQuestions();
    } catch (e) {
      attempt = null;
      button.disabled = false;
      button.innerHTML = originalLabel;
      $("startError").textContent = `Tes gagal dibuka: ${e && e.message ? e.message : e}`;
      $("startError").hidden = false;
      if (restrictedMode) loadTesStatus();
      return;
    }
    button.disabled = false;
    button.innerHTML = originalLabel;
    $("startError").hidden = true;
    $("saveStatus").textContent = "";
    current = 0;
    checked = Array(questions.length).fill(false);
    flags = Array(questions.length).fill(false);
    reviewOnly = false;
    onePageExamRendered = false;
    $("startScreen").hidden = true;
    $("resultScreen").hidden = true;
    $("testScreen").hidden = false;
    startTimer();
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  /* Tombol paket dibangun dari database (renderPackageChoices) - jadi klik
   ditangani lewat delegasi di #sourceChoice, bukan per tombol. */
  function renderPackageChoices() {
    const box = $("sourceChoice");
    box.querySelectorAll('button[data-package]:not([data-package=""])').forEach((b) => b.remove());
    testPackages
      .filter((p) => p.active && p.question_count > 0)
      .forEach((p) => {
        const b = document.createElement("button");
        b.dataset.package = p.key;
        b.innerHTML = `<span class="exam-mark">${escapeHtmlTes(p.mark)}</span><div><b>${escapeHtmlTes(p.label)}</b><small>${escapeHtmlTes(p.description)}</small></div>`;
        box.append(b);
      });
  }
  $("sourceChoice").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-package]");
    if (!button) return;
    mockPackage = button.dataset.package || "";
    document
      .querySelectorAll("#sourceChoice button")
      .forEach((item) => item.classList.toggle("active", item === button));
    $("chapterRange").disabled = !!mockPackage;
    $("chapterRangeBlock").classList.toggle("disabled", !!mockPackage);
    updatePackagePreview();
  });
  $("chapterRange").onchange = () => {
    rangeStart = Number($("chapterRange").value);
    updatePackagePreview();
  };
  updatePackagePreview();
  $("startTest").onclick = startTest;
  $("checkAnswer").onclick = checkOrAdvance;
  $("nextQuestion").onclick = advance;
  $("previousQuestion").onclick = () => {
    if (current > 0) {
      current--;
      renderQuestion();
    }
  };
  $("flagQuestion").onclick = () => {
    const i = activeQuestionIndex();
    flags[i] = !flags[i];
    renderQuestion();
  };
  $("furiganaToggle").onclick = () => {
    furigana = !furigana;
    $("furiganaToggle").textContent = `振 Furigana: ${furigana ? "aktif" : "mati"}`;
    renderQuestion();
  };
  $("finishEarly").onclick = () => {
    if (answers.some((value) => value === null)) return;
    finishTest();
  };
  $("retryGrading").onclick = finishTest;
  $("restartTest").onclick = () => {
    $("resultScreen").hidden = true;
    $("startScreen").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (restrictedMode) loadTesStatus();
  };
  $("reviewMistakes").onclick = () => {
    $("mistakeBank").hidden = false;
    $("mistakeBank").scrollIntoView({ behavior: "smooth" });
  };
  $("closeMistakes").onclick = () => {
    $("mistakeBank").hidden = true;
  };

  /* Tes yang sedang berjalan tidak bisa "dikeluarkan": tenggat tetap berjalan
   di server walau tab ditutup. Peringatkan sebelum meninggalkan halaman; saat
   kembali, tes otomatis dilanjutkan (resumeOpenAttempt). */
  window.addEventListener("beforeunload", (event) => {
    if (!testRunning()) return;
    flushAnswerSave();
    event.preventDefault();
    event.returnValue = "";
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushAnswerSave();
  });
  /* Logout otomatis karena tidak aktif (js/sesi-idle.js) tidak berlaku selama
   tes berjalan - bagian mendengarkan bisa lama tanpa sentuhan, dan tes N4
   berlangsung 90 menit. */
  if (window.IdleSession) window.IdleSession.keepAlive(() => testRunning());

  /* --- Daftar tes untuk siswa (supabase/add-tes-otomatis.sql) ---
   Tes per 5 Bab terbuka sendiri setiap 5 pelajaran tuntas, paket JLPT N5
   setelah Pelajaran 25, N4 setelah Pelajaran 50 - boleh dikerjakan 1x per
   hari. Paket yang belum terbuka bisa diminta ke Sensei; akses dari Sensei
   (tugas) tetap satu kali percobaan. Semua aturan dijaga server
   (start_test); daftar ini hanya menampilkan statusnya (tes_status). */
  async function resolveRole() {
    return window.currentProfile?.role || null;
  }
  let tesStatus = { tuntas_sampai: 0, tes: [] };
  function tesCardHtml(t) {
    const akses = t.akses && t.akses[0];
    const kkm = TES_KKM;
    const nilai =
      t.terbaik == null
        ? ""
        : `<em class="tes-nilai${t.terbaik >= kkm ? " lulus" : ""}">Nilai terbaik ${t.terbaik}${t.kind === "bab" ? (t.terbaik >= kkm ? " · Lulus" : ` · belum ${kkm}`) : ""}</em>`;
    const data = `data-kind="${t.kind}" data-ref="${escapeHtmlTes(t.ref)}"`;
    let meta = `${t.menit} menit`;
    let aksi;
    let locked = false;
    if (akses) {
      meta += ` · akses dari Sensei${akses.due_date ? ` · tenggat ${akses.due_date}` : ""}`;
      aksi = `<button type="button" class="primary" ${data} data-akses="${akses.id}">Mulai →</button>`;
    } else if (t.terbuka && t.hari_ini) {
      aksi = '<span class="tes-status">Sudah dikerjakan hari ini · coba lagi besok</span>';
    } else if (t.terbuka) {
      aksi = `<button type="button" class="primary" ${data}>${t.kali ? "Kerjakan lagi" : "Mulai"} →</button>`;
    } else {
      locked = true;
      meta += t.syarat ? ` · 🔒 terbuka setelah Pelajaran ${t.syarat} tuntas` : " · 🔒 hanya lewat akses dari Sensei";
      const minta = t.permintaan;
      if (t.kind !== "paket") aksi = "";
      else if (minta && minta.status === "menunggu") aksi = '<span class="tes-status">Permintaan terkirim · menunggu Sensei</span>';
      else
        aksi = `${minta && minta.status === "ditolak" ? `<span class="tes-status ditolak">Permintaan ditolak${minta.alasan ? `: ${escapeHtmlTes(minta.alasan)}` : ""}</span>` : ""}<button type="button" class="secondary" data-minta="${escapeHtmlTes(t.ref)}">Minta izin ke Sensei</button>`;
    }
    return `<article class="access-card${locked ? " locked" : ""}"><span class="access-mark">${escapeHtmlTes(t.mark)}</span><div><b>${escapeHtmlTes(t.label)}</b><small>${meta}</small>${nilai}</div><div class="access-act">${aksi}</div></article>`;
  }
  function renderTesGate() {
    const tes = tesStatus.tes || [];
    const sampai = tesStatus.tuntas_sampai || 0;
    const bab = tes.filter((t) => t.kind === "bab");
    const paket = tes.filter((t) => t.kind === "paket");
    const siap = tes.filter((t) => t.akses || (t.terbuka && !t.hari_ini)).length;
    $("accessIntro").querySelector("b").textContent = sampai
      ? `Kamu sudah tuntas sampai Pelajaran ${sampai} · ${siap} tes siap dikerjakan`
      : "Tuntaskan Pelajaran 1–5 untuk membuka tes pertamamu";
    const grup = (judul, list) =>
      list.length ? `<h3 class="access-group">${judul}</h3><div class="access-list">${list.map(tesCardHtml).join("")}</div>` : "";
    $("accessList").innerHTML = grup("Tes per 5 Bab", bab) + grup("Paket ujian", paket);
    $("heroQuestionTotal").textContent = "—";
    $("heroPackage").textContent = `${siap} tes siap`;
  }
  async function loadTesStatus() {
    try {
      const { data, error } = await window.supabaseClient.rpc("tes_status");
      if (error) throw error;
      tesStatus = data || { tuntas_sampai: 0, tes: [] };
      renderTesGate();
    } catch (e) {
      $("accessIntro").querySelector("b").textContent = "Daftar tes gagal dimuat";
      $("accessList").innerHTML = `<p class="start-error">${escapeHtmlTes(e && e.message ? e.message : e)}. Muat ulang halaman untuk mencoba lagi.</p>`;
    }
  }
  $("accessList").addEventListener("click", async (event) => {
    const mulai = event.target.closest("button[data-kind]");
    if (mulai) {
      activeAssignmentId = mulai.dataset.akses ? Number(mulai.dataset.akses) : null;
      mockPackage = mulai.dataset.kind === "paket" ? mulai.dataset.ref : "";
      if (mulai.dataset.kind === "bab") rangeStart = Number(mulai.dataset.ref);
      startTest();
      return;
    }
    const minta = event.target.closest("button[data-minta]");
    if (!minta) return;
    minta.disabled = true;
    minta.textContent = "Mengirim…";
    const { error } = await window.supabaseClient.rpc("minta_akses_tes", { p_paket: minta.dataset.minta });
    if (error) {
      $("startError").textContent = `Permintaan gagal dikirim: ${error.message}`;
      $("startError").hidden = false;
    } else $("startError").hidden = true;
    loadTesStatus();
  });
  async function initAccessControl() {
    const role = await resolveRole();
    await loadTestPackages();
    restrictedMode = role === "siswa";
    $("accessGate").hidden = !restrictedMode;
    $("manualConfig").hidden = restrictedMode;
    if (!restrictedMode) {
      renderPackageChoices();
      updatePackagePreview();
    }
    if (restrictedMode) {
      $("restartTest").textContent = "Kembali ke daftar tes";
      $("heroExamType").textContent = "Sesuai kemajuan";
      $("heroPackage").textContent = "Memuat…";
      $("heroQuestionTotal").textContent = "—";
      await loadTesStatus();
      await resumeOpenAttempt();
    }
  }
  /* Siswa kembali ke halaman ini saat tesnya masih berjalan (reload, tab
   ditutup lalu dibuka lagi, pindah menu) -> langsung lanjutkan tes yang sama
   dengan sisa waktunya. */
  async function resumeOpenAttempt() {
    try {
      const { data } = await window.supabaseClient.rpc("my_open_test_attempt");
      const open = data && data[0];
      if (!open) return;
      activeAssignmentId = open.assignment_id;
      mockPackage = open.test_kind === "paket" ? open.test_ref : "";
      if (open.test_kind === "bab") rangeStart = Number(open.test_ref);
      await startTest();
      if (testRunning()) $("saveStatus").textContent = "↻ Melanjutkan tes - waktu terus berjalan sejak tes dibuka";
    } catch (e) {}
  }
  initAccessControl();
}
window.initPage = initPage;
