/* Riwayat hasil simulasi Tes Kemampuan (JLPT/JFT), dipakai untuk XP dan
   status "quiz" di kartu "Rencana hari ini" (app.js), serta panel Pantau
   Siswa (monitor.js). Baris hasil dikirim dari prototype-tes-v2.js lewat
   window.supabaseClient langsung ke tabel quiz_results.
   Dimuat setelah srs.js (pakai srsToday). */

let quizResultsCache = [];

/* Skala XP per quiz: 100% benar = 20 XP, sebanding dengan ~4 review SRS
   (5 XP/review) - supaya satu sesi quiz singkat tidak mendominasi XP
   harian dibanding belajar rutin. */
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

/* Untuk panel Sensei/Operator: ambil riwayat quiz milik siswa LAIN (bukan
   localStorage/cache perangkat ini) - diizinkan oleh policy
   quiz_results_staff_select di database. */
async function quizFetchRemoteFor(userId) {
  if (!window.supabaseClient) return [];
  const { data, error } = await window.supabaseClient
    .from("quiz_results")
    .select("correct_count, total_count, created_at")
    .eq("user_id", userId);
  return error || !data ? [] : data;
}

function quizXpFromRows(rows) {
  return rows.reduce((sum, row) => sum + quizXpForRow(row), 0);
}

window.loadQuizResultsCache = loadQuizResultsCache;
window.quizXpTotal = quizXpTotal;
window.quizXpThisWeek = quizXpThisWeek;
window.quizDoneToday = quizDoneToday;
window.quizFetchRemoteFor = quizFetchRemoteFor;
window.quizXpFromRows = quizXpFromRows;
