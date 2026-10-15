/* Riwayat hasil simulasi Tes Kemampuan (JLPT/JFT), dipakai untuk XP dan
   status "quiz" di kartu "Rencana hari ini" (app-shell.js, dashboard.js).
   Baris hasil ditulis server oleh grade_test() saat tes di
   js/pages/latihan.js dinilai - client hanya membaca.
   Dimuat setelah srs.js (pakai srsToday). */

let quizResultsCache = [];

/* Skala XP per quiz: 100% benar = 20 XP, sebanding dengan ~4 review SRS
   (5 XP/review) - supaya satu sesi quiz singkat tidak mendominasi XP
   harian dibanding belajar rutin. Rumus yang sama dipakai server untuk
   Pantau Siswa (quiz_xp di supabase/add-pantau-siswa.sql) - ubah keduanya. */
function quizXpForRow(row) {
  if (!row || !row.total_count) return 0;
  return Math.round(((row.correct_count / row.total_count) * 100) / 5);
}

async function loadQuizResultsCache() {
  if (!window.supabaseClient || !window.currentProfile) return;
  const { data, error } = await window.supabaseClient
    .from("quiz_results")
    .select("id, exam_type, correct_count, total_count, category_scores, created_at")
    .eq("user_id", window.currentProfile.id);
  if (!error && data) quizResultsCache = data;
}

function quizXpTotal() {
  return quizResultsCache.reduce((sum, row) => sum + quizXpForRow(row), 0);
}

function quizXpThisWeek() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  return quizResultsCache
    .filter((row) => new Date(row.created_at) >= cutoff)
    .reduce((sum, row) => sum + quizXpForRow(row), 0);
}

function quizDoneToday() {
  const today = srsToday();
  return quizResultsCache.some((row) => (row.created_at || "").slice(0, 10) === today);
}

window.loadQuizResultsCache = loadQuizResultsCache;
window.quizXpTotal = quizXpTotal;
window.quizXpThisWeek = quizXpThisWeek;
window.quizDoneToday = quizDoneToday;
