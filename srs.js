/* Mesin spaced-repetition bersama, dipakai oleh Kanji, Materi, dan Hafalan.
   Satu skema penyimpanan lintas fitur supaya progres tidak tercecer:
   - nihonBenkyoSRS_v1: { [itemId]: { box, due, reviews, lastResult, lastReviewedAt } }
   - nihonBenkyoActivityLog_v1: { [tanggal ISO]: jumlah ulasan hari itu }
   itemId dipakai sebagai namespace, mis. "kanji:山", "materi:book1:0",
   "hafalan:bab3-kosakata:わたし". */
const SRS_STORAGE_KEY = "nihonBenkyoSRS_v1";
const SRS_ACTIVITY_KEY = "nihonBenkyoActivityLog_v1";
const SRS_INTERVAL_DAYS = [1, 2, 4, 7, 14, 30, 60];
const SRS_MASTERED_BOX = 3;

function srsToday() {
  return new Date().toISOString().slice(0, 10);
}

function srsAddDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function srsLoad() {
  try {
    return JSON.parse(localStorage.getItem(SRS_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function srsSave(data) {
  try {
    localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Penyimpanan penuh/diblokir; progres sesi ini tidak tersimpan, tidak fatal.
  }
}

function srsLoadActivity() {
  try {
    return JSON.parse(localStorage.getItem(SRS_ACTIVITY_KEY) || "{}");
  } catch {
    return {};
  }
}

function srsLogActivity() {
  const log = srsLoadActivity();
  const today = srsToday();
  log[today] = (log[today] || 0) + 1;
  try {
    localStorage.setItem(SRS_ACTIVITY_KEY, JSON.stringify(log));
  } catch {
    // Sama seperti srsSave: abaikan jika penyimpanan tidak tersedia.
  }
  srsPushActivity(today, log[today]);
}

/* --- Sinkronisasi ke Supabase ---
   localStorage tetap sumber kebenaran untuk perangkat ini (instan, tidak
   perlu menunggu jaringan). Setiap perubahan dikirim ke Supabase di latar
   belakang (fire-and-forget) supaya Sensei/Operator bisa melihatnya dari
   perangkat lain, dan supaya progres tidak hilang kalau localStorage
   perangkat ini dibersihkan. Gagal kirim (offline, dsb.) sengaja dibiarkan
   diam - tidak boleh mengganggu alur belajar. */
function srsPushItem(itemId, item) {
  if (!window.supabaseClient || !window.currentProfile) return;
  window.supabaseClient
    .from("srs_progress")
    .upsert(
      {
        user_id: window.currentProfile.id,
        item_id: itemId,
        box: item.box,
        due: item.due,
        reviews: item.reviews,
        last_result: item.lastResult,
        last_reviewed_at: item.lastReviewedAt,
      },
      { onConflict: "user_id,item_id" },
    )
    .then(({ error }) => {
      if (error) console.warn("srsPushItem gagal:", error.message);
    });
}

function srsPushActivity(dateStr, count) {
  if (!window.supabaseClient || !window.currentProfile) return;
  window.supabaseClient
    .from("activity_log")
    .upsert(
      { user_id: window.currentProfile.id, activity_date: dateStr, count },
      { onConflict: "user_id,activity_date" },
    )
    .then(({ error }) => {
      if (error) console.warn("srsPushActivity gagal:", error.message);
    });
}

/* Dipanggil auth.js sekali setelah login: tarik data milik user yang
   login dari Supabase, timpa localStorage supaya perangkat ini langsung
   sinkron dengan progres yang mungkin dibuat dari perangkat lain. */
async function srsHydrateFromRemote(userId) {
  if (!window.supabaseClient || !userId) return;
  const [progressRes, activityRes] = await Promise.all([
    window.supabaseClient.from("srs_progress").select("*").eq("user_id", userId),
    window.supabaseClient.from("activity_log").select("*").eq("user_id", userId),
  ]);
  if (!progressRes.error && progressRes.data) {
    const data = {};
    progressRes.data.forEach((row) => {
      data[row.item_id] = {
        box: row.box,
        due: row.due,
        reviews: row.reviews,
        lastResult: row.last_result,
        lastReviewedAt: row.last_reviewed_at,
      };
    });
    srsSave(data);
  }
  if (!activityRes.error && activityRes.data) {
    const log = {};
    activityRes.data.forEach((row) => {
      log[row.activity_date] = row.count;
    });
    try {
      localStorage.setItem(SRS_ACTIVITY_KEY, JSON.stringify(log));
    } catch {
      // Tidak fatal - lihat catatan di srsSave.
    }
  }
}

/* Untuk panel Sensei/Operator: baca progres user LAIN langsung dari
   Supabase (bukan localStorage perangkat ini, yang isinya cuma progres
   pengguna yang sedang login). */
async function srsFetchRemoteFor(userId) {
  const [progressRes, activityRes] = await Promise.all([
    window.supabaseClient.from("srs_progress").select("*").eq("user_id", userId),
    window.supabaseClient.from("activity_log").select("*").eq("user_id", userId),
  ]);
  return {
    progress: progressRes.data || [],
    activity: activityRes.data || [],
  };
}

function srsGet(itemId) {
  const data = srsLoad();
  return data[itemId] || { box: 0, due: null, reviews: 0, lastResult: null };
}

/* outcome: "again" (lupa/sulit), "hard" (masih belajar), "good" (sudah paham/kuat) */
function srsReview(itemId, outcome) {
  const data = srsLoad();
  const item = data[itemId] || { box: 0, due: null, reviews: 0 };
  if (outcome === "again") item.box = 0;
  else if (outcome === "hard") item.box = Math.max(0, item.box - 1);
  else item.box = Math.min(SRS_INTERVAL_DAYS.length - 1, item.box + 1);
  item.reviews = (item.reviews || 0) + 1;
  item.lastResult = outcome;
  item.lastReviewedAt = srsToday();
  item.due = srsAddDays(SRS_INTERVAL_DAYS[item.box]);
  data[itemId] = item;
  srsSave(data);
  srsLogActivity();
  srsPushItem(itemId, item);
  return item;
}

function srsIsDue(itemId) {
  const item = srsGet(itemId);
  if (!item.reviews) return false; // belum pernah dipelajari = "new", bukan "due"
  return !item.due || item.due <= srsToday();
}

/* "new" belum pernah dipelajari, "mastered" sudah cukup dalam box dan
   belum due, "review" sisanya (due sekarang, atau sudah dipelajari tapi
   belum cukup dalam untuk dianggap kuat). */
function srsStatusLabel(itemId) {
  const item = srsGet(itemId);
  if (!item.reviews) return "new";
  if (item.box >= SRS_MASTERED_BOX && !srsIsDue(itemId)) return "mastered";
  return "review";
}

function srsDueCount(prefix) {
  const data = srsLoad();
  const today = srsToday();
  return Object.keys(data).filter((id) => {
    if (prefix && !id.startsWith(prefix)) return false;
    const item = data[id];
    return item.reviews && (!item.due || item.due <= today);
  }).length;
}

function srsMasteredCount(prefix) {
  const data = srsLoad();
  return Object.keys(data).filter((id) => {
    if (prefix && !id.startsWith(prefix)) return false;
    return data[id].box >= SRS_MASTERED_BOX;
  }).length;
}

/* Dipakai dashboard untuk mencentang "Rencana hari ini" otomatis (bukan
   klik manual lagi): true kalau ada minimal satu item kategori ini yang
   sudah direview hari ini. */
function srsAnyReviewedToday(prefix) {
  const data = srsLoad();
  const today = srsToday();
  return Object.keys(data).some(
    (id) => id.startsWith(prefix) && data[id].lastReviewedAt === today,
  );
}

/* Jumlah seluruh aksi review (semua kategori, semua waktu) - basis
   perhitungan XP: setiap review, apa pun hasilnya, dihitung sekali di
   activity log lewat srsLogActivity(). */
function srsTotalActivityCount() {
  const log = srsLoadActivity();
  return Object.values(log).reduce((sum, count) => sum + count, 0);
}

function srsStreak() {
  const log = srsLoadActivity();
  let streak = 0;
  let cursor = new Date();
  // Kalau belum belajar hari ini, streak tetap dihitung dari kemarin mundur
  // (baru putus kalau ada hari kosong, bukan langsung nol begitu hari berganti).
  if (!log[cursor.toISOString().slice(0, 10)]) cursor.setDate(cursor.getDate() - 1);
  while (log[cursor.toISOString().slice(0, 10)]) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function srsTodayCount() {
  const log = srsLoadActivity();
  return log[srsToday()] || 0;
}

/* Total ulasan per minggu, 6 minggu terakhir (minggu ini paling akhir). */
function srsWeeklyActivity(weeks = 6) {
  const log = srsLoadActivity();
  const totals = Array(weeks).fill(0);
  const today = new Date();
  Object.entries(log).forEach(([dateStr, count]) => {
    const date = new Date(dateStr + "T00:00:00");
    const dayDiff = Math.floor((today - date) / 86400000);
    if (dayDiff < 0 || dayDiff >= weeks * 7) return;
    const weekIndex = weeks - 1 - Math.floor(dayDiff / 7);
    totals[weekIndex] += count;
  });
  return totals;
}
