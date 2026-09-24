/* Halaman Simulasi JLPT N5 (pages/jlpt-n5.html). Mode 1 "Contoh Resmi"
   memakai 28 soal asli dari dokumen contoh resmi JLPT (1 soal ditahan
   sementara - lihat catatan needs_review di data/jlpt-n5-tp1-data.js),
   diambil lewat RPC get_jlpt_exam_questions() yang SENGAJA tidak
   menyertakan kunci jawaban/pembahasan - baru terlihat setelah
   grade_jlpt_exam() dipanggil saat submit (dinilai di server, bukan di
   browser). Mode 2 (91 soal, simulasi penuh) baru berupa kerangka
   terkunci - lihat rencana di plan file terkait, belum bisa dikerjakan
   sampai bank soalnya lengkap dan tervalidasi. */
function initPage() {
  const $ = id => document.getElementById(id);
  const EXAM_ID = "n5-tp1";
  const MODE = "sample";
  const STORAGE_KEY = `jlptExamSession:${EXAM_ID}:${MODE}`;
  const TIME_LIMIT_SECONDS = 35 * 60;
  const LABELS = ["A", "B", "C", "D"];
  const SECTION_LABEL = { vocabulary: "Kosakata", grammar_reading: "Tata Bahasa & Bacaan", listening: "Mendengarkan" };

  let questions = [];
  let answers = {};
  let current = 0;
  let secondsLeft = TIME_LIMIT_SECONDS;
  let timerId = null;
  let gradedResult = null;
  let currentAudioSegment = null;

  /* N5Sample.mp3 (5:16) berisi rekaman ke-8 soal mendengarkan secara
     berurutan tanpa jeda antar soal yang bisa dipilih sendiri - audio_start/
     audio_end (dari data/jlpt-n5-tp1-data.js, diukur lewat deteksi jeda
     hening ffmpeg + dicocokkan dengan panjang skrip tiap soal) menandai
     potongan yang relevan untuk soal yang sedang aktif. Pemutar dihentikan
     otomatis begitu lewat audio_end supaya tidak "bocor" ke rekaman soal
     berikutnya kalau siswa lupa menjeda sendiri.
     */
  const listeningAudioEl = document.getElementById("listeningAudio");
  if (listeningAudioEl) {
    listeningAudioEl.addEventListener("loadedmetadata", () => {
      if (currentAudioSegment) listeningAudioEl.currentTime = currentAudioSegment.start;
    });
    listeningAudioEl.addEventListener("timeupdate", () => {
      if (currentAudioSegment && currentAudioSegment.end && listeningAudioEl.currentTime >= currentAudioSegment.end) {
        listeningAudioEl.pause();
      }
    });
  }

  function saveSession() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, current, secondsLeft })); } catch (e) {}
  }
  function loadSession() {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function clearSession() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  async function fetchQuestions() {
    if (!window.supabaseClient) return null;
    try {
      const { data, error } = await window.supabaseClient.rpc("get_jlpt_exam_questions", { p_exam_id: EXAM_ID, p_mode: MODE });
      if (error || !data || !data.length) return null;
      return data;
    } catch (e) { return null; }
  }

  const SCREENS = ["modeSelectScreen", "instructionsScreen", "examScreen", "resultScreen", "reviewScreen"];
  function showScreen(name) {
    SCREENS.forEach(id => { $(id).hidden = id !== name; });
  }

  $("startModeSample").onclick = () => showScreen("instructionsScreen");
  $("backToModeSelect").onclick = () => showScreen("modeSelectScreen");

  $("beginExam").onclick = async () => {
    $("beginExam").disabled = true;
    $("beginExam").textContent = "Memuat soal…";
    const fetched = await fetchQuestions();
    $("beginExam").disabled = false;
    $("beginExam").textContent = "Mulai mengerjakan";
    if (!fetched) {
      alert("Tidak bisa memuat soal. Periksa koneksi internet, lalu coba lagi.");
      return;
    }
    questions = fetched;
    const saved = loadSession();
    if (saved && saved.answers && Object.keys(saved.answers).length) {
      answers = saved.answers;
      current = Math.min(saved.current || 0, questions.length - 1);
      secondsLeft = typeof saved.secondsLeft === "number" ? saved.secondsLeft : TIME_LIMIT_SECONDS;
    } else {
      answers = {};
      current = 0;
      secondsLeft = TIME_LIMIT_SECONDS;
    }
    $("heroMode").textContent = "Contoh Resmi";
    $("heroTotal").textContent = questions.length;
    $("heroTime").textContent = Math.round(TIME_LIMIT_SECONDS / 60) + " menit";
    buildNumberGrid();
    renderQuestion();
    startTimer();
    showScreen("examScreen");
  };

  function renderQuestion() {
    const q = questions[current];
    $("sectionBadge").textContent = (SECTION_LABEL[q.section] || q.section).toUpperCase();
    $("questionCounter").textContent = `Soal ${current + 1} dari ${questions.length}`;
    $("examProgress").style.width = ((current + 1) / questions.length * 100) + "%";
    $("instruction").innerHTML = q.instruction;
    $("questionText").innerHTML = q.question_html;

    const img = $("questionImage");
    if (q.image_url) { img.hidden = false; img.src = "../" + q.image_url; } else { img.hidden = true; img.removeAttribute("src"); }

    $("audioBox").hidden = !q.audio_url;
    if (q.audio_url) {
      const audioEl = $("listeningAudio");
      audioEl.pause();
      currentAudioSegment = (typeof q.audio_start === "number") ? { start: q.audio_start, end: q.audio_end } : null;
      if (currentAudioSegment) audioEl.currentTime = currentAudioSegment.start;
    } else {
      currentAudioSegment = null;
    }

    const answersEl = $("answers");
    answersEl.innerHTML = "";
    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.innerHTML = `<b>${LABELS[i]}</b><span>${opt}</span>`;
      if (answers[q.id] === i) btn.classList.add("selected");
      btn.onclick = () => { answers[q.id] = i; saveSession(); renderQuestion(); };
      answersEl.appendChild(btn);
    });

    $("prevQuestion").disabled = current === 0;
    $("nextQuestion").hidden = current === questions.length - 1;
    $("submitExam").hidden = current !== questions.length - 1;
    updateNumberGrid();
    updateAnsweredCount();
  }

  function buildNumberGrid() {
    const grid = $("numberGrid");
    grid.innerHTML = "";
    questions.forEach((q, i) => {
      const btn = document.createElement("button");
      btn.textContent = String(i + 1);
      btn.onclick = () => { current = i; renderQuestion(); };
      grid.appendChild(btn);
    });
    $("answeredCount").parentElement && ($("answeredCount").textContent = `0 / ${questions.length}`);
  }
  function updateNumberGrid() {
    [...$("numberGrid").children].forEach((btn, i) => {
      btn.classList.toggle("current", i === current);
      btn.classList.toggle("answered", answers[questions[i].id] !== undefined);
    });
  }
  function updateAnsweredCount() {
    $("answeredCount").textContent = `${Object.keys(answers).length} / ${questions.length}`;
  }

  $("prevQuestion").onclick = () => { if (current > 0) { current--; renderQuestion(); } };
  $("nextQuestion").onclick = () => { if (current < questions.length - 1) { current++; renderQuestion(); } };

  function openSubmitConfirm() {
    const count = Object.keys(answers).length;
    $("submitConfirmText").textContent = `Kamu sudah menjawab ${count} dari ${questions.length} soal. Soal yang belum dijawab akan dianggap salah.`;
    $("submitConfirmScreen").hidden = false;
  }
  $("submitExam").onclick = openSubmitConfirm;
  $("finishNow").onclick = openSubmitConfirm;
  $("cancelSubmit").onclick = () => { $("submitConfirmScreen").hidden = true; };
  $("confirmSubmit").onclick = doSubmit;

  async function doSubmit() {
    $("submitConfirmScreen").hidden = true;
    stopTimer();
    $("confirmSubmit").disabled = true;
    const { data, error } = await window.supabaseClient.rpc("grade_jlpt_exam", { p_exam_id: EXAM_ID, p_mode: MODE, p_answers: answers });
    $("confirmSubmit").disabled = false;
    if (error || !data) {
      alert("Gagal mengumpulkan ujian. Periksa koneksi internet, lalu coba lagi.");
      startTimer();
      return;
    }
    gradedResult = data;
    clearSession();
    renderResults();
    showScreen("resultScreen");
  }

  function renderResults() {
    const correctCount = gradedResult.filter(r => r.is_correct).length;
    $("finalScore").textContent = correctCount;
    $("finalScore").nextElementSibling.textContent = `/ ${gradedResult.length}`;
    const pct = Math.round(correctCount / gradedResult.length * 100);
    $("resultSummary").textContent = `${correctCount} dari ${gradedResult.length} soal benar (${pct}%).`;
    const bySection = {};
    gradedResult.forEach(r => {
      bySection[r.section] = bySection[r.section] || { correct: 0, total: 0 };
      bySection[r.section].total++;
      if (r.is_correct) bySection[r.section].correct++;
    });
    const grid = $("sectionResults");
    grid.innerHTML = "";
    Object.keys(bySection).forEach(sec => {
      const { correct, total } = bySection[sec];
      const secPct = Math.round(correct / total * 100);
      const art = document.createElement("article");
      art.innerHTML = `<h3>${SECTION_LABEL[sec] || sec}</h3><div class="score-line"><span>${correct} / ${total} benar</span><b>${secPct}%</b></div><i style="--score:${secPct}%"></i>`;
      grid.appendChild(art);
    });
  }

  $("reviewAnswers").onclick = () => { renderReview(); showScreen("reviewScreen"); };
  $("closeReview").onclick = () => showScreen("resultScreen");
  $("restartExam").onclick = () => showScreen("modeSelectScreen");

  function renderReview() {
    const list = $("reviewList");
    list.innerHTML = "";
    gradedResult.forEach((r, i) => {
      const div = document.createElement("div");
      div.className = "review-item";
      const submittedText = (r.submitted_answer === null || r.submitted_answer === undefined)
        ? "(tidak dijawab)"
        : `${LABELS[r.submitted_answer]}. ${r.options[r.submitted_answer]}`;
      const correctText = `${LABELS[r.correct_answer]}. ${r.options[r.correct_answer]}`;
      const explanationHtml = r.explanation
        ? `<div class="review-answer-line">${r.explanation}</div>`
        : `<span class="pending-badge">Pembahasan belum tersedia</span>`;
      div.innerHTML = `<header><b>Soal ${i + 1} · ${SECTION_LABEL[r.section] || r.section}</b><span class="review-status ${r.is_correct ? "correct" : "wrong"}">${r.is_correct ? "Benar" : "Salah"}</span></header>
        <div class="review-question">${r.question_html}</div>
        <div class="review-answer-line">Jawabanmu: <b>${submittedText}</b></div>
        <div class="review-answer-line">Jawaban benar: <b>${correctText}</b></div>
        ${explanationHtml}`;
      list.appendChild(div);
    });
  }

  function startTimer() {
    stopTimer();
    updateTimerDisplay();
    timerId = setInterval(() => {
      secondsLeft--;
      updateTimerDisplay();
      saveSession();
      if (secondsLeft <= 0) doSubmit();
    }, 1000);
  }
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
  function updateTimerDisplay() {
    const s = Math.max(secondsLeft, 0);
    const m = Math.floor(s / 60), sec = s % 60;
    $("timer").textContent = `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
}
window.initPage = initPage;
