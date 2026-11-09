/* Halaman Kelola Materi (pages/kelola-materi.html) - editor isi pelajaran
   untuk Operator, Tahap 1: kosakata, kanji, soal susun & pilih kalimat per
   Pelajaran 1-50. Isi bawaan diambil dari berkas data (data/bab-data.js,
   data/tugas-kalimat-data.js); yang disimpan ke database hanya bagian yang
   BERBEDA dari bawaan (supabase/add-editor-konten.sql), lalu halaman siswa
   menimpanya lewat js/konten-bab.js. Alur: draft -> terbitkan (divalidasi
   ulang di server) -> versi lama di Riwayat versi.
   Tinjauan berkala: tiap pelajaran mencatat kapan terakhir ditinjau
   (masih sesuai keadaan di Jepang); yang > TINJAU_HARI atau belum pernah
   ditinjau ditandai. Saat terbit, Operator bisa menulis catatan pembaruan
   yang tampil ke siswa di halaman Materi (konten_info).
   Pengecoh (bagian ⋯ Pengecoh di baris Kosakata/Kanji): kata bisa
   ditunjuk "sekelompok dengan" kata lain dan "artinya sama dengan" kata
   lain; kanji yang belum punya data kanji mirip bisa diisi. Data pengecoh
   bawaan (data/tugas-kategori-data.js, data/kanji-mirip-data.js) tidak
   diubah - suntingan ditambahkan di atasnya (KontenBab.gabungPengecoh).
   Isi global data di halaman ini selalu isi BAWAAN (konten-bab.js hanya
   dipakai fungsinya, tidak dimuat), kecuali sesaat saat "Contoh soal".
   Laporan siswa (supabase/add-laporan-konten.sql): antrian laporan dari
   tombol "Laporkan" di Materi/Tugas, dengan status & tanggapan.
   Teks dari pengguna selalu dimasukkan lewat textContent/value.
   Dibungkus initPage(), dijalankan auth.js setelah login. */
function initPage() {
if (!window.currentProfile || window.currentProfile.role !== "operator") return;

const $ = (id) => document.getElementById(id);
const supa = window.supabaseClient;
const escapeHtml = window.escapeHtml;
const listEl = $("kmBabList");
const editorEl = $("kmEditor");
const MAX_BAB = 50;
const JENIS = ["materi", "kosakata", "kanji", "kalimat", "pengecoh"];
const NAMA_JENIS = { materi: "Tata bahasa", kosakata: "Kosakata", kanji: "Kanji", kalimat: "Soal kalimat", pengecoh: "Pengecoh" };
const JUMLAH_TUGAS = 10; // TUGAS_KALIMAT_JUMLAH di js/tugas-bab.js
const TINJAU_HARI = 365; // pelajaran perlu ditinjau ulang setelah 12 bulan
const CATATAN_MAKS = 300;

let ringkasan = []; // baris konten_list()
let laporanPerBab = {}; // bab -> {baru, terbuka} dari laporan_ringkas()
let laporanFilter = { status: "terbuka", bab: null };
/* current: { bab, isi: {kosakata, kanji, kalimat} lengkap (bawaan + suntingan),
   terbit, base, source, updatedBy, dirty, tab, serverErrors } */
let current = null;
let filterText = "";

const salin = (v) => JSON.parse(JSON.stringify(v));
const sama = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function bawaan(jenis, bab) {
  if (jenis === "materi") return salin(bab <= 25 ? MATERI_BOOK1_LESSONS[bab - 1] : MATERI_BOOK2_LESSONS[bab - 26]);
  if (jenis === "kosakata") return salin(babKosakataData[bab] || []);
  if (jenis === "kanji") return salin(babKanjiData[bab] || []);
  if (jenis === "pengecoh") return {};
  return salin(tugasKalimatData[bab] || { susun: [], pilih: [] });
}
function errorMessage(error) {
  return (error && (error.message || error.error_description)) || String(error || "Terjadi kesalahan.");
}
const waktu = (iso) => new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
const tanggal = (iso) => new Date(iso).toLocaleDateString("id-ID", { dateStyle: "medium" });
const infoBab = (bab) => ringkasan.find((r) => r.bab === bab) || {};
const perluTinjau = (r) => !r.ditinjau_at || Date.now() - new Date(r.ditinjau_at).getTime() > TINJAU_HARI * 864e5;

// ---------- Validasi (cermin validate_konten_bab di server) + peringatan ----------
const tanpaSpasi = (t) => String(t).replace(/\s/g, "");
function teksOk(v, maks) {
  return typeof v === "string" && v.trim().length >= 1 && v.trim().length <= maks && !/[<>\r\n]/.test(v);
}
const ADA_KANJI = /[一-鿿々]/;
/* Per baris: { errors: [], warnings: [] }. `list` = seluruh daftar (untuk cek duplikat). */
function cekKosakata(item, i, list) {
  const errors = [], warnings = [];
  if (!teksOk(item[0], 60)) errors.push("Kata Jepang wajib diisi (maks. 60 karakter, tanpa < >).");
  if (!teksOk(item[1], 200)) errors.push("Arti wajib diisi (maks. 200 karakter, tanpa < >).");
  if (item[0].trim() && list.findIndex((x) => x[0].trim() === item[0].trim()) !== i) warnings.push("Kata ini sudah ada di atas - kartu Hafalan-nya akan tergabung.");
  return { errors, warnings };
}
function cekKanji(item, i, list) {
  const errors = [], warnings = [];
  if (!teksOk(item[0], 60)) errors.push("Tulisan kanji wajib diisi (maks. 60 karakter, tanpa < >).");
  if (!teksOk(item[1], 60)) errors.push("Cara baca wajib diisi (maks. 60 karakter, tanpa < >).");
  if (!teksOk(item[2], 200)) errors.push("Arti wajib diisi (maks. 200 karakter, tanpa < >).");
  if (item[0].trim() && !ADA_KANJI.test(item[0])) warnings.push("Tulisan ini tidak memuat huruf kanji.");
  if (/[一-鿿A-Za-z]/.test(item[1])) warnings.push("Cara baca sebaiknya hanya hiragana/katakana.");
  if (item[0].trim() && list.findIndex((x) => x[0].trim() === item[0].trim()) !== i) warnings.push("Kanji ini sudah ada di atas.");
  return { errors, warnings };
}
function cekSusun(item) {
  const errors = [], warnings = [];
  if (!teksOk(item.arti, 200)) errors.push("Arti wajib diisi (maks. 200 karakter, tanpa < >).");
  if (item.potongan.length < 2 || item.potongan.length > 20) errors.push("Harus ada 2–20 potongan (pisahkan dengan /).");
  else if (item.potongan.some((p) => !teksOk(p, 40))) errors.push("Setiap potongan wajib diisi (maks. 40 karakter, tanpa < >) - periksa tanda / yang berlebih.");
  if ((item.alt || []).length > 10 || (item.alt || []).some((a) => !teksOk(a, 300))) errors.push("Susunan lain maks. 10 kalimat, masing-masing maks. 300 karakter.");
  if (item.potongan.some((p) => /\s/.test(p.trim()))) warnings.push("Ada potongan yang berisi spasi - satu potongan sebaiknya satu kata atau satu partikel.");
  const huruf = (t) => [...tanpaSpasi(t)].sort().join("");
  if ((item.alt || []).some((a) => huruf(a) !== huruf(item.potongan.join("")))) warnings.push("Susunan lain harus memakai potongan yang sama persis (hanya urutannya berbeda) - kalau tidak, susunan itu tidak akan pernah cocok.");
  if (item.potongan.length > 9) warnings.push("Lebih dari 9 potongan: siswa harus memisahkan nomor dengan spasi/koma.");
  return { errors, warnings };
}
function cekPilih(item) {
  const errors = [], warnings = [];
  if (!teksOk(item.arti, 200)) errors.push("Arti wajib diisi (maks. 200 karakter, tanpa < >).");
  if (!teksOk(item.benar, 300)) errors.push("Kalimat benar wajib diisi (maks. 300 karakter, tanpa < >).");
  if (item.salah.length !== 3 || item.salah.some((s) => !teksOk(s, 300))) errors.push("Ketiga pengecoh wajib diisi (maks. 300 karakter, tanpa < >).");
  else {
    if (item.salah.some((s) => tanpaSpasi(s) === tanpaSpasi(item.benar))) errors.push("Salah satu pengecoh sama dengan kalimat benar.");
    if (new Set(item.salah.map(tanpaSpasi)).size < 3) errors.push("Ketiga pengecoh harus berbeda.");
  }
  return { errors, warnings };
}
const gabungCek = (a, b) => ({ errors: [...a.errors, ...b.errors], warnings: [...a.warnings, ...b.warnings] });
const CEK = {
  kosakata: (list) => {
    const ef = pengecohEfektif();
    return list.map((x, i) => gabungCek(cekKosakata(x, i, list), cekPengecohKata(x, ef)));
  },
  kanji: (list) => list.map((x, i) => gabungCek(cekKanji(x, i, list), cekPengecohKanji(x))),
  susun: (list) => list.map(cekSusun),
  pilih: (list) => list.map(cekPilih),
};
const LABEL_BARIS = { kosakata: "Kosakata", kanji: "Kanji", susun: "Susun", pilih: "Pilih" };
function daftarFor(tab) {
  if (tab === "susun" || tab === "pilih") return current.isi.kalimat[tab];
  return current.isi[tab];
}
/* Tata bahasa (cermin validate_konten_materi di server). Hasil per pola:
   [{ errors, warnings }]; kesalahan tingkat pelajaran di index -1. */
const htmlOk = (v, min, maks) =>
  typeof v === "string" && v.trim().length >= min && v.trim().length <= maks && window.isSafeQuestionHtml(v);
function cekPola(item) {
  const errors = [], warnings = [];
  if (!htmlOk(item.title, 1, 500)) errors.push("Judul pola wajib diisi (maks. 500 karakter, HTML terbatas).");
  if (item.suffix && !htmlOk(item.suffix, 0, 300)) errors.push("Keterangan judul maks. 300 karakter (HTML terbatas).");
  if (item.hidden) return { errors, warnings };
  if (!item.blocks.length || item.blocks.length > 20) errors.push("Harus ada 1–20 bagian penjelasan.");
  item.blocks.forEach((b, k) => {
    const p = `bagian ${k + 1}: `;
    const ada = (v) => typeof v === "string" && v.trim() !== "";
    if (!ada(b.label) && !ada(b.text) && !ada(b.note) && !b.table && !b.figure && !(b.examples || []).length) errors.push(`${p}kosong - isi minimal satu dari sub-judul, penjelasan, tabel, contoh, atau catatan.`);
    if (ada(b.label) && !htmlOk(b.label, 1, 1000)) errors.push(`${p}sub-judul maks. 1000 karakter (HTML terbatas).`);
    if (ada(b.text) && !htmlOk(b.text, 1, 6000)) errors.push(`${p}penjelasan maks. 6000 karakter (HTML terbatas).`);
    if (ada(b.note) && !htmlOk(b.note, 1, 4000)) errors.push(`${p}catatan maks. 4000 karakter (HTML terbatas).`);
    if (b.figure && (!String(b.figure.alt || "").trim() || b.figure.alt.length > 300 || /[<>"]/.test(b.figure.alt))) errors.push(`${p}keterangan gambar wajib diisi (maks. 300 karakter, tanpa < > ").`);
    if (b.table) {
      const { headers, rows } = b.table;
      if (!headers.length || headers.length > 10 || !rows.length || rows.length > 50) errors.push(`${p}tabel harus punya 1–10 kolom dan 1–50 baris.`);
      if (headers.some((h) => !htmlOk(h, 0, 300)) || rows.some((r) => r.some((c) => !htmlOk(c, 0, 500)))) errors.push(`${p}isi sel tabel memakai HTML yang tidak diizinkan atau terlalu panjang.`);
    }
    const ex = b.examples || [];
    if (ex.length > 40) errors.push(`${p}maks. 40 contoh.`);
    ex.forEach(([jp, arti], j) => {
      if (!htmlOk(jp, 1, 600)) errors.push(`${p}contoh ${j + 1}: kalimat wajib diisi (maks. 600 karakter, HTML terbatas).`);
      if (!htmlOk(arti, 0, 600)) errors.push(`${p}contoh ${j + 1}: arti maks. 600 karakter (HTML terbatas).`);
      if (jp.trim() && !arti.trim() && !/×/.test(jp)) warnings.push(`${p}contoh ${j + 1} belum punya arti (contoh tanpa arti tidak dipakai di latihan).`);
    });
  });
  return { errors, warnings };
}
function cekMateri(materi) {
  const errors = [], warnings = [];
  if (!teksOk(materi.title, 100)) errors.push({ tab: "materi", index: -1, message: "Materi: judul pelajaran wajib diisi (maks. 100 karakter, tanpa < >)." });
  if (!materi.items.length || materi.items.length > 30) errors.push({ tab: "materi", index: -1, message: "Materi: harus berisi 1–30 pola." });
  materi.items.forEach((item, i) => {
    const r = cekPola(item);
    r.errors.forEach((m) => errors.push({ tab: "materi", index: i, message: `Materi pola ${i + 1}: ${m}` }));
    r.warnings.forEach((m) => warnings.push({ tab: "materi", index: i, message: `Materi pola ${i + 1}: ${m}` }));
  });
  return { errors, warnings };
}

/* Semua kesalahan & peringatan: [{tab, index, message}] */
function semuaCek() {
  const { errors, warnings } = cekMateri(current.isi.materi);
  Object.keys(CEK).forEach((tab) => {
    const list = daftarFor(tab);
    if (!list.length) errors.push({ tab, index: -1, message: `${LABEL_BARIS[tab]}: daftar tidak boleh kosong.` });
    if (list.length > (tab === "susun" || tab === "pilih" ? 100 : 300)) errors.push({ tab, index: -1, message: `${LABEL_BARIS[tab]}: terlalu banyak (maks. ${tab === "susun" || tab === "pilih" ? 100 : 300}).` });
    if ((tab === "susun" || tab === "pilih") && list.length && list.length < JUMLAH_TUGAS)
      warnings.push({ tab, index: -1, message: `${LABEL_BARIS[tab]}: hanya ${list.length} soal - tugas biasanya mengambil ${JUMLAH_TUGAS} soal acak.` });
    CEK[tab](list).forEach((r, i) => {
      r.errors.forEach((m) => errors.push({ tab, index: i, message: `${LABEL_BARIS[tab]} no. ${i + 1}: ${m}` }));
      r.warnings.forEach((m) => warnings.push({ tab, index: i, message: `${LABEL_BARIS[tab]} no. ${i + 1}: ${m}` }));
    });
  });
  return { errors, warnings };
}

// ---------- Isi untuk disimpan: hanya bagian yang beda dari bawaan ----------
/* Spasi ASCII di tepi dibuang; spasi lebar Jepang (　) sengaja dipertahankan. */
const rapiTepi = (s) => String(s ?? "").replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, "");
function rapikanMateri(m) {
  const h = (s) => rapiTepi(s).replace(/\r?\n/g, "<br>");
  return {
    title: rapiTepi(m.title),
    items: m.items.map((it) => {
      const item = { title: h(it.title) };
      if (h(it.suffix)) item.suffix = h(it.suffix);
      if (it.noBox) item.noBox = true;
      if (it.hidden) item.hidden = true;
      item.blocks = it.blocks.map((b) => {
        const blok = {};
        if (h(b.label)) blok.label = h(b.label);
        if (h(b.text)) blok.text = h(b.text);
        if (b.figure) blok.figure = { src: b.figure.src, alt: rapiTepi(b.figure.alt) };
        if (b.table) blok.table = { headers: b.table.headers.map(h), rows: b.table.rows.map((r) => r.map(h)) };
        if ((b.examples || []).length) blok.examples = b.examples.map(([jp, arti]) => [h(jp), h(arti)]);
        if (h(b.note)) blok.note = h(b.note);
        return blok;
      });
      return item;
    }),
  };
}
/* Pengecoh: hanya entri untuk kata/kanji yang masih ada di pelajaran ini,
   kunci diurutkan supaya perbandingan dengan bawaan ({}) stabil. */
function rapikanPengecoh(p) {
  const kata = new Set([...current.isi.kosakata.map((x) => String(x[0]).trim()), ...current.isi.kanji.map((x) => String(x[1]).trim())]);
  const kanji = new Set(current.isi.kanji.flatMap((x) => [...String(x[0])]));
  const urut = (o, saring) => Object.fromEntries(Object.entries(o || {}).filter(saring).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
  const hasil = {};
  const kelompok = urut(p.kelompok, ([k, v]) => kata.has(k) && v);
  const sinonim = urut(p.sinonim, ([k, v]) => kata.has(k) && v && v.length);
  const kanjiMirip = urut(p.kanjiMirip, ([k, v]) => kanji.has(k) && v && v.length);
  if (Object.keys(kelompok).length) hasil.kelompok = kelompok;
  if (Object.keys(sinonim).length) hasil.sinonim = sinonim;
  if (Object.keys(kanjiMirip).length) hasil.kanjiMirip = kanjiMirip;
  return hasil;
}
function rapikan(jenis, v) {
  const t = (s) => String(s ?? "").trim();
  if (jenis === "materi") return rapikanMateri(v);
  if (jenis === "pengecoh") return rapikanPengecoh(v);
  if (jenis === "kosakata") return v.map(([a, b]) => [t(a), t(b)]);
  if (jenis === "kanji") return v.map(([a, b, c]) => [t(a), t(b), t(c)]);
  return {
    susun: v.susun.map((x) => {
      const item = { arti: t(x.arti), potongan: x.potongan.map(t) };
      const alt = (x.alt || []).map(t).filter(Boolean);
      if (alt.length) item.alt = alt;
      return item;
    }),
    pilih: v.pilih.map((x) => ({ arti: t(x.arti), benar: t(x.benar), salah: x.salah.map(t) })),
  };
}
function isiDisimpan() {
  const isi = {};
  JENIS.forEach((jenis) => {
    const v = rapikan(jenis, current.isi[jenis]);
    if (!sama(v, rapikan(jenis, bawaan(jenis, current.bab)))) isi[jenis] = v;
  });
  return isi;
}
function diubahDariBawaan(jenis) {
  return !sama(rapikan(jenis, current.isi[jenis]), rapikan(jenis, bawaan(jenis, current.bab)));
}

// ---------- Daftar pelajaran ----------
async function loadList() {
  const { data, error } = await supa.rpc("konten_list");
  if (error) {
    listEl.innerHTML = `<p class="login-error">Gagal memuat daftar: ${escapeHtml(errorMessage(error))}. Operator perlu menjalankan supabase/add-editor-konten.sql.</p>`;
    return;
  }
  ringkasan = data || [];
  renderList();
  if (current) paintTinjau();
}
function renderList() {
  const byBab = Object.fromEntries(ringkasan.map((r) => [r.bab, r]));
  listEl.innerHTML = Array.from({ length: MAX_BAB }, (_, i) => {
    const bab = i + 1;
    const r = byBab[bab] || {};
    const diubah = (r.diubah || []).map((j) => NAMA_JENIS[j] || j);
    const tinjau = perluTinjau(r);
    const lapor = laporanPerBab[bab];
    const title = [
      lapor ? `${lapor.terbuka} laporan siswa terbuka` : "",
      `Pelajaran ${bab}`,
      diubah.length ? `diubah: ${diubah.join(", ")}` : "isi bawaan",
      r.has_draft ? `ada draft (${r.draft_updated_by || "Operator"})` : "",
      r.ditinjau_at ? `ditinjau ${tanggal(r.ditinjau_at)}${tinjau ? " - perlu ditinjau ulang" : ""}` : "belum pernah ditinjau",
    ].filter(Boolean).join(" · ");
    return `<button type="button" class="km-bab${current && current.bab === bab ? " active" : ""}" data-bab="${bab}" title="${escapeHtml(title)}"><b>${bab}</b><span>${diubah.length ? '<i class="km-dot diubah"></i>' : ""}${r.has_draft ? '<i class="km-dot draft"></i>' : ""}${tinjau ? '<i class="km-dot tinjau"></i>' : ""}${lapor ? '<i class="km-dot lapor"></i>' : ""}</span></button>`;
  }).join("");
  const lama = ringkasan.filter((r) => r.ditinjau_at && perluTinjau(r)).length;
  const belum = ringkasan.filter((r) => !r.ditinjau_at).length;
  $("kmTinjauRingkas").textContent = lama + belum
    ? `Perlu ditinjau: ${lama + belum} pelajaran (${[belum ? `${belum} belum pernah` : "", lama ? `${lama} lebih dari 12 bulan` : ""].filter(Boolean).join(", ")}).`
    : "Semua pelajaran sudah ditinjau dalam 12 bulan terakhir.";
}
listEl.addEventListener("click", (event) => {
  const button = event.target.closest(".km-bab");
  if (button) openBab(Number(button.dataset.bab));
});

function confirmLeaveDirty() {
  return !current || !current.dirty || window.confirm("Ada perubahan yang belum disimpan. Tinggalkan perubahan ini?");
}
async function openBab(bab, { paksa = false, tab = null } = {}) {
  if (!paksa && current && current.bab === bab) return;
  if (!paksa && !confirmLeaveDirty()) return;
  editorEl.innerHTML = '<p class="muted">Memuat…</p>';
  const { data, error } = await supa.rpc("konten_load", { p_bab: bab });
  if (error) {
    editorEl.innerHTML = `<p class="login-error">Gagal memuat: ${escapeHtml(errorMessage(error))}</p>`;
    return;
  }
  const isi = {};
  JENIS.forEach((jenis) => (isi[jenis] = salin(data.isi?.[jenis] ?? bawaan(jenis, bab))));
  current = {
    bab, isi,
    terbit: data.terbit || {},
    base: data.updated_at || null,
    source: data.source,
    updatedBy: data.updated_by,
    terbitAt: data.terbit_at || null,
    terbitBy: data.terbit_by || null,
    dirty: false,
    catatan: "",
    tab: tab || (current && current.tab !== "riwayat" ? current.tab : "materi"),
    serverErrors: [],
  };
  filterText = "";
  pengecohTerbuka = new Set();
  polaTerbuka = new Set();
  pratinjau = new Set();
  renderList();
  renderEditor();
}

// ---------- Editor ----------
function statusText() {
  const diubah = JENIS.filter((j) => current.terbit[j] !== undefined).map((j) => NAMA_JENIS[j].toLowerCase());
  const terbit = diubah.length ? `Terbit: ${diubah.join(", ")} sudah disunting` : "Terbit: isi bawaan";
  if (current.source === "draft") return `Draft belum terbit · disimpan ${escapeHtml(current.updatedBy || "Operator")} ${escapeHtml(current.base ? waktu(current.base) : "")} · ${terbit}`;
  if (current.source === "terbit") return `${terbit} · terakhir oleh ${escapeHtml(current.terbitBy || "Operator")} ${escapeHtml(current.terbitAt ? waktu(current.terbitAt) : "")}`;
  return "Menampilkan isi bawaan (belum pernah disunting).";
}
const TABS = [
  ["materi", "Tata bahasa", () => current.isi.materi.items.filter((x) => !x.hidden).length],
  ["kosakata", "Kosakata", () => current.isi.kosakata.length],
  ["kanji", "Kanji", () => current.isi.kanji.length],
  ["susun", "Susun kalimat", () => current.isi.kalimat.susun.length],
  ["pilih", "Pilih kalimat", () => current.isi.kalimat.pilih.length],
  ["riwayat", "Riwayat versi", null],
];
const JENIS_TAB = { materi: "materi", kosakata: "kosakata", kanji: "kanji", susun: "kalimat", pilih: "kalimat" };
function renderEditor() {
  if (!current) return;
  editorEl.innerHTML = `
    <header class="ks-editor-head">
      <div><div class="eyebrow">Tugas &amp; Hafalan</div><h2>Pelajaran ${current.bab}</h2><p class="ks-status" id="kmStatus">${statusText()}</p></div>
      <div class="ks-actions">
        <span class="ks-dirty" id="kmDirty" ${current.dirty ? "" : "hidden"}>● Belum disimpan</span>
        <button type="button" class="secondary" id="kmSave">💾 Simpan draft</button>
        <button type="button" class="primary" id="kmPublish">🚀 Terbitkan</button>
        <button type="button" class="ks-link danger" id="kmDiscard" ${current.source === "draft" ? "" : "hidden"}>Buang draft</button>
      </div>
    </header>
    <div class="km-tinjau" id="kmTinjau"></div>
    <label class="km-catatan">Catatan pembaruan untuk siswa <small>(opsional, dikirim saat Terbitkan)</small>
      <input type="text" id="kmCatatan" maxlength="${CATATAN_MAKS}" placeholder="mis. Contoh percakapan di konbini disesuaikan dengan kasir mandiri">
      <small class="muted">Tampil di halaman Materi bersama tanda "Diperbarui". Kosongkan untuk perbaikan kecil seperti salah ketik.</small>
    </label>
    <div class="ks-feedback" id="kmFeedback" hidden></div>
    <nav class="ks-tabs">${TABS.map(([id, name, n]) => {
      const ubah = JENIS_TAB[id] && diubahDariBawaan(JENIS_TAB[id]) ? " km-tab-diubah" : "";
      return `<button type="button" data-tab="${id}" class="${current.tab === id ? "active" : ""}${ubah}">${name}${n ? ` (${n()})` : ""}</button>`;
    }).join("")}</nav>
    <div id="kmTabBody"></div>`;
  editorEl.querySelectorAll(".ks-tabs button").forEach((b) => (b.onclick = () => { current.tab = b.dataset.tab; filterText = ""; renderEditor(); }));
  $("kmSave").onclick = saveDraft;
  $("kmPublish").onclick = publish;
  $("kmDiscard").onclick = discardDraft;
  $("kmCatatan").value = current.catatan;
  $("kmCatatan").oninput = (event) => (current.catatan = event.target.value);
  paintTinjau();
  if (current.serverErrors.length) showFeedback("error", "Belum bisa diterbitkan:", current.serverErrors);
  if (current.tab === "riwayat") renderHistoryTab();
  else if (current.tab === "materi") renderMateriTab();
  else renderDaftarTab();
}
/* Baris tinjauan: kapan terakhir isi pelajaran ini dipastikan masih sesuai,
   dan catatan pembaruan terakhir yang dilihat siswa. */
function paintTinjau() {
  const el = $("kmTinjau");
  if (!el) return;
  const r = infoBab(current.bab);
  const perlu = perluTinjau(r);
  const status = r.ditinjau_at
    ? `Terakhir ditinjau ${escapeHtml(tanggal(r.ditinjau_at))} oleh ${escapeHtml(r.ditinjau_by || "Operator")}${perlu ? " - sudah lebih dari 12 bulan, perlu ditinjau ulang." : "."}`
    : "Belum pernah ditinjau.";
  const umum = r.diperbarui_at
    ? `<p class="muted">Pembaruan terakhir yang tampil ke siswa: <b>${escapeHtml(tanggal(r.diperbarui_at))}</b>${r.catatan ? ` - ${escapeHtml(r.catatan)}` : ""}</p>`
    : "";
  el.className = `km-tinjau${perlu ? " perlu" : ""}`;
  const lapor = laporanPerBab[current.bab];
  const laporHtml = lapor ? `<p>📮 ${lapor.terbuka} laporan siswa terbuka untuk pelajaran ini · <button type="button" class="ks-link" id="kmLihatLaporan">Lihat laporan</button></p>` : "";
  el.innerHTML = `<div><p>${status}</p>${umum}${laporHtml}</div><button type="button" class="secondary" id="kmTandaiTinjau">✔ Tandai sudah ditinjau</button>`;
  $("kmTandaiTinjau").onclick = tandaiDitinjau;
  if (lapor) $("kmLihatLaporan").onclick = () => bukaLaporan({ bab: current.bab, status: "terbuka" });
}
async function tandaiDitinjau() {
  const pesan = [`Tandai isi Pelajaran ${current.bab} yang SEDANG TERBIT sudah ditinjau dan masih sesuai dengan keadaan di Jepang sekarang?`];
  if (current.dirty || current.source === "draft") pesan.push("\nDraft yang belum diterbitkan tidak ikut dihitung - terbitkan dulu kalau ada yang perlu diubah.");
  if (!window.confirm(pesan.join("\n"))) return;
  const { error } = await supa.rpc("konten_tandai_ditinjau", { p_bab: current.bab });
  if (error) {
    showFeedback("error", `Gagal menandai: ${errorMessage(error)}`);
    return;
  }
  await loadList();
  showFeedback("success", `Pelajaran ${current.bab} ditandai sudah ditinjau.`);
}
function markDirty() {
  if (!current.dirty) {
    current.dirty = true;
    const dirtyEl = $("kmDirty");
    if (dirtyEl) dirtyEl.hidden = false;
  }
}
function showFeedback(kind, title, items) {
  const box = $("kmFeedback");
  if (!box) return;
  box.hidden = false;
  box.className = `ks-feedback ${kind}`;
  box.innerHTML = `<b></b>${items && items.length ? "<ul></ul>" : ""}`;
  box.querySelector("b").textContent = title;
  const ul = box.querySelector("ul");
  (items || []).slice(0, 30).forEach((message) => {
    const li = document.createElement("li");
    li.textContent = message;
    const match = /^(Kosakata|Kanji|Susun|Pilih) no\. (\d+):/.exec(message);
    const pola = /^Materi pola (\d+):/.exec(message);
    if (match) {
      li.className = "ks-jump";
      li.title = "Buka baris ini";
      li.onclick = () => lompat(match[1].toLowerCase(), Number(match[2]) - 1);
    } else if (pola) {
      li.className = "ks-jump";
      li.title = "Buka pola ini";
      li.onclick = () => lompatPola(Number(pola[1]) - 1);
    }
    ul.appendChild(li);
  });
  if (items && items.length > 30) {
    const li = document.createElement("li");
    li.textContent = `…dan ${items.length - 30} lainnya.`;
    ul.appendChild(li);
  }
}
function lompat(tab, index) {
  if (current.tab !== tab || filterText) {
    current.tab = tab;
    filterText = "";
    renderEditor();
  }
  const row = document.getElementById(`kmRow${index}`);
  if (row) {
    row.scrollIntoView({ behavior: "smooth", block: "center" });
    row.querySelector("input, textarea")?.focus({ preventScroll: true });
  }
}

// ---------- Tab daftar (kosakata / kanji / susun / pilih) ----------
const KOLOM = {
  kosakata: [["Kata Jepang", 0, "mis. わたし"], ["Arti", 1, "mis. Saya"]],
  kanji: [["Kanji", 0, "mis. 日本"], ["Cara baca", 1, "mis. にほん"], ["Arti", 2, "mis. Jepang"]],
};
const PETUNJUK = {
  kosakata: "Semua kata pelajaran ini: dipakai kartu Hafalan, tugas Kotoba (Jepang↔Indonesia), latihan Mendengar, dan sebagai pengecoh soal pelajaran lain. Mengganti tulisan kata Jepang memutus progres Hafalan siswa untuk kata lama (kata baru mulai dari awal); mengubah arti saja aman.",
  kanji: "Kata yang ada tulisan kanjinya: dipakai kartu Hafalan mode Kanji dan 4 tugas kanji. Pengecoh \"kanji mirip\" dibuat otomatis dari daftar kanji mirip; cara baca yang mirip juga dibuat otomatis. Mengganti tulisan kanji memutus progres Hafalan untuk kanji lama.",
  susun: "Tulis potongan dalam URUTAN BENAR, dipisah tanda / (mis. わたし / は / がくせい / です). Satu potongan = satu kata atau satu partikel. Saat tugas, potongan diacak dan diberi nomor. \"Susunan lain\" (opsional, satu kalimat per baris) untuk urutan lain yang juga benar. Soal ini juga dipakai latihan Isi partikel dan Ujian ulang.",
  pilih: "Siswa membaca arti bahasa Indonesia lalu memilih kalimat Jepang yang benar dari 4 pilihan. Buat pengecoh yang mirip (beda partikel, bentuk kata kerja, dsb.) tetapi jelas salah - jangan sampai ada dua jawaban benar. Kalimat benar juga dipakai latihan Mendengar.",
};
function kosong(tab) {
  if (tab === "kosakata") return ["", ""];
  if (tab === "kanji") return ["", "", ""];
  if (tab === "susun") return { arti: "", potongan: [] };
  return { arti: "", benar: "", salah: ["", "", ""] };
}
function cocok(tab, item) {
  if (!filterText) return true;
  const teks = Array.isArray(item) ? item.join(" ") : JSON.stringify(item);
  return teks.toLowerCase().includes(filterText.toLowerCase());
}
function renderDaftarTab() {
  const tab = current.tab;
  const jenis = JENIS_TAB[tab];
  const body = $("kmTabBody");
  const ubah = diubahDariBawaan(jenis);
  body.innerHTML = `
    <p class="ks-hint">${escapeHtml(PETUNJUK[tab])}</p>
    <div class="ks-toolbar"><input type="search" id="kmFilter" placeholder="Cari…"><span class="km-bawaan">${ubah ? `<span class="km-badge-diubah">Sudah diubah dari isi bawaan</span><button type="button" class="ks-link" id="kmReset">Kembalikan ${escapeHtml(NAMA_JENIS[jenis].toLowerCase())} ke isi bawaan</button>` : '<span class="muted">Sama dengan isi bawaan</span>'}</span></div>
    ${tab === "susun" || tab === "pilih" ? '<p class="ks-hint km-catatan">Soal kalimat (susun &amp; pilih) disimpan bersama: mengembalikan ke isi bawaan berlaku untuk keduanya.</p>' : ""}
    ${tab === "kosakata" || tab === "kanji" ? '<p class="ks-hint">Buka <b>⋯ Pengecoh</b> di tiap baris untuk mengatur pilihan salah soal Tugas: tunjuk kata sejenis, tandai kata yang artinya sama, isi kanji mirip untuk kanji baru, lalu coba <b>🎲 Contoh soal</b>.</p>' : ""}
    <div id="kmRows" class="km-rows km-rows-${tab}"></div>
    <button type="button" class="secondary ks-add" id="kmAdd">+ Tambah ${tab === "kosakata" ? "kata" : tab === "kanji" ? "kanji" : "soal"}</button>`;
  const filterEl = $("kmFilter");
  filterEl.value = filterText;
  filterEl.oninput = () => { filterText = filterEl.value; paintRows(); };
  if (tab === "kosakata" || tab === "kanji") siapkanDaftarKata();
  const reset = $("kmReset");
  if (reset) reset.onclick = () => {
    if (!window.confirm(`Kembalikan ${NAMA_JENIS[jenis].toLowerCase()} Pelajaran ${current.bab} ke isi bawaan? Suntingan di bagian ini dihapus dari draft (isi terbit baru berubah setelah diterbitkan).`)) return;
    current.isi[jenis] = bawaan(jenis, current.bab);
    markDirty();
    renderEditor();
  };
  $("kmAdd").onclick = () => {
    const list = daftarFor(tab);
    list.push(kosong(tab));
    markDirty();
    filterText = "";
    renderEditor();
    lompat(tab, list.length - 1);
  };
  paintRows();
}
function paintRows() {
  const container = $("kmRows");
  if (!container) return;
  const tab = current.tab;
  const list = daftarFor(tab);
  const hasil = CEK[tab](list);
  const ef = KOLOM[tab] ? pengecohEfektif() : null; // dihitung sekali untuk semua panel Pengecoh
  container.replaceChildren();
  list.forEach((item, i) => {
    if (!cocok(tab, item)) return;
    const row = document.createElement("div");
    row.className = "km-row";
    row.id = `kmRow${i}`;
    row.dataset.index = String(i);
    const num = document.createElement("span");
    num.className = "km-num";
    num.textContent = String(i + 1);
    const fields = document.createElement("div");
    fields.className = "km-fields";
    if (KOLOM[tab]) {
      KOLOM[tab].forEach(([label, key, ph]) => fields.appendChild(input(label, String(key), item[key], { placeholder: ph, lang: key === 0 || (tab === "kanji" && key === 1) ? "ja" : "" })));
      fields.appendChild(panelPengecoh(tab, i, ef));
    } else if (tab === "susun") {
      fields.append(
        input("Arti (bahasa Indonesia)", "arti", item.arti, { placeholder: "mis. Saya mahasiswa." }),
        input("Potongan, urutan benar (pisahkan dengan /)", "potongan", item.potongan.join(" / "), { placeholder: "わたし / は / がくせい / です", lang: "ja" }),
        input("Susunan lain yang juga benar (opsional, satu per baris)", "alt", (item.alt || []).join("\n"), { textarea: true, lang: "ja" }),
      );
      const pv = document.createElement("p");
      pv.className = "km-preview";
      pv.lang = "ja";
      fields.appendChild(pv);
    } else {
      fields.append(
        input("Arti (bahasa Indonesia)", "arti", item.arti, { placeholder: "mis. Saya orang Indonesia." }),
        input("Kalimat Jepang yang benar", "benar", item.benar, { placeholder: "わたしは インドネシアじんです。", lang: "ja", kelas: "km-benar" }),
        ...item.salah.map((s, k) => input(`Pengecoh ${k + 1}`, `salah${k}`, s, { lang: "ja", kelas: "km-salah" })),
      );
    }
    const msgs = document.createElement("ul");
    msgs.className = "km-msgs";
    fields.appendChild(msgs);
    const tools = document.createElement("div");
    tools.className = "ks-q-tools km-tools";
    [["up", "↑", "Naikkan"], ["down", "↓", "Turunkan"], ["delete", "✕", "Hapus"]].forEach(([action, text, title]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.action = action;
      b.textContent = text;
      b.title = title;
      b.setAttribute("aria-label", `${title} baris ${i + 1}`);
      tools.appendChild(b);
    });
    row.append(num, fields, tools);
    container.appendChild(row);
    paintPesan(row, item, hasil[i]);
  });
  if (!container.children.length) container.innerHTML = `<p class="muted">${list.length ? "Tidak ada yang cocok dengan pencarian." : "Belum ada isi."}</p>`;
}
function input(label, field, value, { textarea = false, placeholder = "", lang = "", kelas = "" } = {}) {
  const wrap = document.createElement("label");
  wrap.className = `ks-field${kelas ? ` ${kelas}` : ""}`;
  wrap.append(document.createTextNode(label));
  const el = document.createElement(textarea ? "textarea" : "input");
  if (textarea) el.rows = 2;
  el.dataset.f = field;
  el.value = value ?? "";
  if (placeholder) el.placeholder = placeholder;
  if (lang) el.lang = lang;
  el.autocomplete = "off";
  wrap.appendChild(el);
  return wrap;
}
function paintPesan(row, item, hasil) {
  row.classList.toggle("has-error", hasil.errors.length > 0);
  row.classList.toggle("has-warning", !hasil.errors.length && hasil.warnings.length > 0);
  const ul = row.querySelector(".km-msgs");
  ul.replaceChildren(
    ...hasil.errors.map((m) => Object.assign(document.createElement("li"), { textContent: m, className: "err" })),
    ...hasil.warnings.map((m) => Object.assign(document.createElement("li"), { textContent: `⚠ ${m}`, className: "warn" })),
  );
  const pv = row.querySelector(".km-preview");
  if (pv) pv.textContent = item.potongan.length ? `Kalimat: ${item.potongan.map((p) => p.trim()).join("")}。 · ${item.potongan.length} potongan` : "";
}
editorEl.addEventListener("input", (event) => {
  const target = event.target;
  if (!current || !target.dataset.f) return;
  const row = target.closest(".km-row");
  if (!row) return;
  const tab = current.tab;
  const list = daftarFor(tab);
  const i = Number(row.dataset.index);
  const item = list[i];
  const f = target.dataset.f;
  const v = target.value;
  if (Array.isArray(item)) item[Number(f)] = v;
  else if (f === "potongan") item.potongan = v.trim() ? v.split(/[\/／]/).map((p) => p.trim()) : [];
  else if (f === "alt") {
    const alt = v.split("\n").map((a) => a.trim()).filter(Boolean);
    if (alt.length) item.alt = alt;
    else delete item.alt;
  } else if (f.startsWith("salah")) item.salah[Number(f.slice(5))] = v;
  else item[f] = v;
  markDirty();
  // Duplikat bisa memengaruhi baris lain, jadi pesan semua baris yang tampil diperbarui.
  const hasil = CEK[tab](list);
  document.querySelectorAll("#kmRows .km-row").forEach((r) => paintPesan(r, list[Number(r.dataset.index)], hasil[Number(r.dataset.index)]));
  // Kata/kanji/cara baca berubah -> panel ⋯ Pengecoh baris ini ikut berubah.
  const panel = row.querySelector(".km-pengecoh");
  if (panel && KOLOM[tab][Number(f)] && Number(f) !== KOLOM[tab].length - 1) gantiPanel(row, panelPengecoh(tab, i));
});
editorEl.addEventListener("click", (event) => {
  const button = event.target.closest(".km-tools button[data-action]");
  if (!button || !current) return;
  const row = button.closest(".km-row");
  const list = daftarFor(current.tab);
  const i = Number(row.dataset.index);
  const action = button.dataset.action;
  if (action === "up" && i > 0) [list[i - 1], list[i]] = [list[i], list[i - 1]];
  else if (action === "down" && i < list.length - 1) [list[i + 1], list[i]] = [list[i], list[i + 1]];
  else if (action === "delete") {
    if (!window.confirm(`Hapus baris ${i + 1}? (Bisa dibatalkan dengan "Buang draft" atau Riwayat versi.)`)) return;
    list.splice(i, 1);
  } else return;
  markDirty();
  renderEditor();
  if (action !== "delete") lompat(current.tab, action === "up" ? i - 1 : i + 1);
});

// ---------- Pengecoh (⋯ Pengecoh di baris Kosakata & Kanji) ----------
const normKata = (t) => String(t).toLowerCase().replace(/\s+/g, "");
const KANJI_SATU = /^[\u4e00-\u9fff\u3400-\u4dbf々]$/;
let pengecohTerbuka = new Set(); // "tab:index" panel yang sedang dibuka
let daftarKata = null; // { label -> "kata@bab", acuan -> label }
/* Kunci pengecoh baris: kata (kosakata) atau cara baca (kanji) - sama
   dengan kunci kelompok makna di js/tugas-bab.js. */
const kunciBaris = (tab, item) => String(tab === "kanji" ? item[1] : item[0]).trim();
/* Kelompok makna efektif = bawaan + suntingan pelajaran ini.
   Mengembalikan fungsi grupOf(kata, bab) dan anggotaGrup(nama). */
function pengecohEfektif() {
  const gabung = KontenBab.gabungPengecoh({ kategori: tugasKategoriKata, sinonim: tugasSinonim, mirip: {} }, [{ bab: current.bab, isi: { pengecoh: current.isi.pengecoh } }]);
  const index = {};
  Object.entries(gabung.kategori).forEach(([nama, isi]) => isi.forEach((k) => {
    const [kata, bab] = k.split("@");
    index[bab ? `${normKata(kata)}@${bab}` : normKata(kata)] = nama;
  }));
  const sinonim = new Map();
  gabung.sinonim.forEach((grup) => grup.forEach((k) => {
    const set = sinonim.get(normKata(k)) || new Set();
    grup.forEach((lain) => lain !== k && set.add(normKata(lain)));
    sinonim.set(normKata(k), set);
  }));
  return {
    grupOf: (kata, bab) => index[`${normKata(kata)}@${bab}`] || index[normKata(kata)] || null,
    anggota: (nama) => gabung.kategori[nama] || [],
    sinonimOf: (kata) => sinonim.get(normKata(kata)) || new Set(),
  };
}
const namaGrup = (nama) => (nama.startsWith("operator:") ? `sekelompok dengan ${nama.slice(9).replace("@", " (Pel. ")})` : nama);
/* Arti kata acuan "kata@bab" (atau tanpa bab: bab pertama yang memuatnya). */
function artiKata(entri) {
  const [kata, bab] = entri.split("@");
  const babs = bab ? [Number(bab)] : Array.from({ length: MAX_BAB }, (_, i) => i + 1);
  for (const b of babs) {
    const list = b === current.bab ? current.isi.kosakata : babKosakataData[b] || [];
    const x = list.find((k) => String(k[0]).trim() === kata);
    if (x) return { arti: String(x[1]).trim(), bab: b };
  }
  return null;
}
function siapkanDaftarKata() {
  daftarKata = { label: new Map(), acuan: new Map() };
  const opsi = [];
  for (let b = 1; b <= MAX_BAB; b++) {
    (b === current.bab ? current.isi.kosakata : babKosakataData[b] || []).forEach(([jp, arti]) => {
      const kata = String(jp).trim();
      if (!kata || kata.includes("@")) return;
      const label = `${kata} — ${String(arti).trim()} (Pel. ${b})`;
      if (daftarKata.label.has(label)) return;
      daftarKata.label.set(label, `${kata}@${b}`);
      daftarKata.acuan.set(`${kata}@${b}`, label);
      opsi.push(new Option(label, label));
    });
  }
  let dl = $("kmDaftarKata");
  if (!dl) {
    dl = document.createElement("datalist");
    dl.id = "kmDaftarKata";
    document.body.appendChild(dl);
  }
  dl.replaceChildren(...opsi);
}
const kataBaru = (tab, item) => !bawaan(tab, current.bab).some((x) => String(x[0]).trim() === String(item[0]).trim());
function cekPengecohKata(item, ef) {
  const warnings = [];
  const kata = String(item[0]).trim();
  if (!kata || !kataBaru("kosakata", item)) return { errors: [], warnings };
  const grup = ef.grupOf(kata, current.bab);
  if (!grup) {
    warnings.push("Kata baru belum punya kelompok - pengecohnya hanya berdasarkan bentuk kata. Atur di ⋯ Pengecoh.");
    return { errors: [], warnings };
  }
  // Anggota sekelompok yang artinya mirip tapi belum ditandai sinonim.
  const arti = normKata(item[1]);
  const sudah = ef.sinonimOf(kata);
  ef.anggota(grup).forEach((entri) => {
    const lain = entri.split("@")[0];
    if (normKata(lain) === normKata(kata) || sudah.has(normKata(lain))) return;
    const a = artiKata(entri);
    const b = a && normKata(a.arti);
    if (b && arti.length >= 3 && b.length >= 3 && (b.includes(arti) || arti.includes(b)))
      warnings.push(`Artinya mirip dengan ${lain} ("${a.arti}"). Kalau artinya sama, tandai "Artinya sama dengan" di ⋯ Pengecoh supaya soal tidak punya dua jawaban benar.`);
  });
  return { errors: [], warnings };
}
const kanjiTanpaMirip = (item) => [...new Set([...String(item[0])].filter((ch) => KANJI_SATU.test(ch) && !kanjiMiripData[ch]))];
function cekPengecohKanji(item) {
  const kurang = kanjiTanpaMirip(item).filter((ch) => !(current.isi.pengecoh.kanjiMirip || {})[ch]);
  return { errors: [], warnings: kurang.length ? [`Kanji ${kurang.join("、")} belum punya daftar kanji mirip - pengecoh Hiragana → Kanji kurang menjebak. Isi di ⋯ Pengecoh.`] : [] };
}
function panelPengecoh(tab, i, ef = pengecohEfektif()) {
  const item = daftarFor(tab)[i];
  const kunci = kunciBaris(tab, item);
  const p = current.isi.pengecoh;
  const det = document.createElement("details");
  det.className = "km-pengecoh";
  det.open = pengecohTerbuka.has(`${tab}:${i}`);
  det.ontoggle = () => (det.open ? pengecohTerbuka.add(`${tab}:${i}`) : pengecohTerbuka.delete(`${tab}:${i}`));
  const grup = kunci ? ef.grupOf(kunci, current.bab) : null;
  const ringkas = document.createElement("summary");
  ringkas.textContent = `⋯ Pengecoh · ${grup ? `kelompok: ${namaGrup(grup)}` : "belum berkelompok"}`;
  det.appendChild(ringkas);
  if (!kunci) {
    det.append(Object.assign(document.createElement("p"), { className: "muted", textContent: tab === "kanji" ? "Isi cara baca dulu." : "Isi kata Jepang dulu." }));
    return det;
  }
  const status = document.createElement("p");
  status.className = "km-pg-status";
  if (grup) {
    const lain = ef.anggota(grup).map((e) => e.split("@")[0]).filter((k) => normKata(k) !== normKata(kunci));
    status.textContent = `Pengecoh diambil dari kelompok "${namaGrup(grup)}": ${[...new Set(lain)].slice(0, 8).join("、")}${lain.length > 8 ? "…" : ""}`;
  } else status.textContent = "Belum berkelompok: pengecohnya kata lain yang bentuknya mirip. Tunjuk satu kata yang sejenis supaya pilihan salahnya lebih masuk akal.";
  det.appendChild(status);

  const acuan = (p.kelompok || {})[kunci] || "";
  const kel = document.createElement("label");
  kel.className = "ks-field";
  kel.append(document.createTextNode(`Sekelompok dengan (${tab === "kanji" ? "berlaku untuk cara baca " + kunci : "kata sejenis"})`));
  const kelIn = Object.assign(document.createElement("input"), { value: acuan ? daftarKata.acuan.get(acuan) || acuan : "", placeholder: "ketik lalu pilih kata, mis. げんきん", autocomplete: "off" });
  kelIn.setAttribute("list", "kmDaftarKata");
  kelIn.dataset.p = "kelompok";
  kel.appendChild(kelIn);
  det.appendChild(kel);

  const sin = document.createElement("div");
  sin.className = "ks-field";
  sin.append(document.createTextNode("Artinya sama dengan (tidak akan muncul bersamaan di satu soal)"));
  const chips = document.createElement("div");
  chips.className = "km-pg-chips";
  ((p.sinonim || {})[kunci] || []).forEach((k) => {
    const chip = Object.assign(document.createElement("button"), { type: "button", className: "km-pg-chip", textContent: `${k} ✕`, title: `Hapus ${k}` });
    chip.dataset.pAksi = "hapus-sinonim";
    chip.dataset.v = k;
    chips.appendChild(chip);
  });
  const sinIn = Object.assign(document.createElement("input"), { placeholder: "ketik lalu pilih kata, mis. トイレ", autocomplete: "off" });
  sinIn.setAttribute("list", "kmDaftarKata");
  sinIn.dataset.p = "sinonim";
  sin.append(chips, sinIn);
  det.appendChild(sin);

  if (tab === "kanji") {
    const draft = p.kanjiMirip || {};
    const huruf = [...new Set([...String(item[0])].filter((ch) => KANJI_SATU.test(ch) && (!kanjiMiripData[ch] || draft[ch])))];
    huruf.forEach((ch) => {
      const lab = document.createElement("label");
      lab.className = "ks-field";
      lab.append(document.createTextNode(`Kanji mirip untuk ${ch} (1-6 huruf, mis. bentuk yang sering tertukar)`));
      const inp = Object.assign(document.createElement("input"), { value: (draft[ch] || []).join(""), placeholder: "mis. 健建", autocomplete: "off", lang: "ja" });
      inp.dataset.p = "mirip";
      inp.dataset.ch = ch;
      lab.appendChild(inp);
      det.appendChild(lab);
    });
    if (!huruf.length) det.append(Object.assign(document.createElement("p"), { className: "muted", textContent: "Semua huruf kanji di sini sudah punya daftar kanji mirip." }));
  }
  const pesan = document.createElement("p");
  pesan.className = "km-pg-pesan";
  pesan.setAttribute("aria-live", "polite");
  const contoh = Object.assign(document.createElement("button"), { type: "button", className: "secondary", textContent: "🎲 Contoh soal" });
  contoh.dataset.pAksi = "contoh";
  const hasil = document.createElement("div");
  hasil.className = "km-pg-contoh";
  det.append(pesan, contoh, hasil);
  return det;
}
/* Ganti panel ⋯ Pengecoh tanpa menutupnya kalau sedang terbuka. */
function gantiPanel(row, baru) {
  const lama = row.querySelector(".km-pengecoh");
  if (lama.open) {
    baru.open = true;
    pengecohTerbuka.add(`${current.tab}:${row.dataset.index}`);
  }
  lama.replaceWith(baru);
}
function segarkanPanel(row) {
  const tab = current.tab;
  const i = Number(row.dataset.index);
  gantiPanel(row, panelPengecoh(tab, i));
  const hasil = CEK[tab](daftarFor(tab));
  document.querySelectorAll("#kmRows .km-row").forEach((r) => paintPesan(r, daftarFor(tab)[Number(r.dataset.index)], hasil[Number(r.dataset.index)]));
}
function ubahPengecoh(bagian, kunci, nilai) {
  const p = current.isi.pengecoh;
  p[bagian] ||= {};
  if (nilai == null || (Array.isArray(nilai) && !nilai.length)) delete p[bagian][kunci];
  else p[bagian][kunci] = nilai;
  markDirty();
}
editorEl.addEventListener("change", (event) => {
  const target = event.target;
  if (!current || !target.dataset.p) return;
  const row = target.closest(".km-row");
  const item = daftarFor(current.tab)[Number(row.dataset.index)];
  const kunci = kunciBaris(current.tab, item);
  const pesan = row.querySelector(".km-pg-pesan");
  const v = target.value.trim();
  pesan.textContent = "";
  if (target.dataset.p === "kelompok") {
    if (!v) {
      ubahPengecoh("kelompok", kunci, null);
    } else {
      const acuan = daftarKata.label.get(v);
      if (!acuan) {
        pesan.textContent = "Pilih kata dari daftar yang muncul saat mengetik.";
        return;
      }
      if (acuan === `${kunci}@${current.bab}`) {
        pesan.textContent = "Pilih kata lain, bukan kata ini sendiri.";
        return;
      }
      ubahPengecoh("kelompok", kunci, acuan);
    }
  } else if (target.dataset.p === "sinonim") {
    const acuan = daftarKata.label.get(v);
    if (!acuan) {
      pesan.textContent = "Pilih kata dari daftar yang muncul saat mengetik.";
      return;
    }
    const lain = acuan.split("@")[0];
    const sekarang = (current.isi.pengecoh.sinonim || {})[kunci] || [];
    if (lain === kunci || sekarang.includes(lain)) return;
    if (sekarang.length >= 10) {
      pesan.textContent = "Maksimal 10 kata.";
      return;
    }
    ubahPengecoh("sinonim", kunci, [...sekarang, lain]);
  } else if (target.dataset.p === "mirip") {
    const ch = target.dataset.ch;
    const daftar = [...new Set([...v].filter((c) => KANJI_SATU.test(c) && c !== ch))];
    if (daftar.length > 6) {
      pesan.textContent = "Maksimal 6 kanji mirip.";
      return;
    }
    if ([...v].some((c) => !KANJI_SATU.test(c) && c.trim())) pesan.textContent = "Selain huruf kanji diabaikan.";
    ubahPengecoh("kanjiMirip", ch, daftar.length ? daftar : null);
  }
  const teks = pesan.textContent;
  segarkanPanel(row);
  row.querySelector(".km-pg-pesan").textContent = teks;
});
editorEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-p-aksi]");
  if (!button || !current) return;
  const row = button.closest(".km-row");
  const item = daftarFor(current.tab)[Number(row.dataset.index)];
  const kunci = kunciBaris(current.tab, item);
  if (button.dataset.pAksi === "hapus-sinonim") {
    ubahPengecoh("sinonim", kunci, ((current.isi.pengecoh.sinonim || {})[kunci] || []).filter((k) => k !== button.dataset.v));
    segarkanPanel(row);
  } else if (button.dataset.pAksi === "contoh") {
    tampilkanContoh(row, item);
  }
});
/* Pasang isi draft pelajaran ini ke data global sesaat, buat soal persis
   seperti di Tugas siswa (TugasBab.contohSoal), lalu kembalikan. */
function tampilkanContoh(row, item) {
  const wadah = row.querySelector(".km-pg-contoh");
  const tab = current.tab;
  const kunci = String(item[0]).trim();
  if (!window.TugasBab || !kunci) return;
  const bab = current.bab;
  const asliKos = babKosakataData[bab], asliKan = babKanjiData[bab];
  const cadangan = salin({ kategori: tugasKategoriKata, sinonim: tugasSinonim, mirip: kanjiMiripData });
  const ganti = (wadahData, isi) => {
    Object.keys(wadahData).forEach((k) => delete wadahData[k]);
    Object.assign(wadahData, isi);
  };
  const pasang = (isi) => {
    ganti(tugasKategoriKata, isi.kategori);
    ganti(kanjiMiripData, isi.mirip);
    tugasSinonim.length = 0;
    tugasSinonim.push(...isi.sinonim);
  };
  const targets = tab === "kanji" ? ["kanji-kana-kanji", "kanji-kanji-kana", "kanji-kanji-id"] : ["kotoba-jp-id", "kotoba-id-jp"];
  let soal = [];
  try {
    babKosakataData[bab] = rapikan("kosakata", current.isi.kosakata);
    babKanjiData[bab] = rapikan("kanji", current.isi.kanji);
    pasang(KontenBab.gabungPengecoh(cadangan, [{ bab, isi: { pengecoh: current.isi.pengecoh } }]));
    soal = targets.map((t) => TugasBab.contohSoal(bab, t, kunci)).filter(Boolean);
  } catch (error) {
    console.warn(error);
  } finally {
    babKosakataData[bab] = asliKos;
    babKanjiData[bab] = asliKan;
    pasang(cadangan);
  }
  if (!soal.length) {
    wadah.textContent = "Contoh soal belum bisa dibuat - lengkapi isi baris ini dulu.";
    return;
  }
  wadah.replaceChildren(...soal.map((q) => {
    const box = document.createElement("div");
    box.className = "km-contoh";
    const judul = document.createElement("p");
    judul.append(Object.assign(document.createElement("small"), { textContent: q.instruction }), " ", Object.assign(document.createElement("b"), { textContent: q.prompt, lang: "ja" }));
    const ol = document.createElement("ol");
    ol.type = "A";
    q.choices.forEach((c) => ol.appendChild(Object.assign(document.createElement("li"), { textContent: c === q.answer ? `${c} ✔` : c, className: c === q.answer ? "benar" : "", lang: "ja" })));
    box.append(judul, ol);
    return box;
  }));
}

// ---------- Tab Tata bahasa ----------
/* Isi disimpan sebagai HTML terbatas; di kotak isian <br> ditampilkan sebagai
   baris baru (Enter) dan dikembalikan saat diketik. Urutan pola DIKUNCI:
   progres siswa disimpan per nomor pola, jadi pola lama hanya bisa
   disembunyikan dan pola baru hanya ditambah di akhir. */
let polaTerbuka = new Set();
let pratinjau = new Set();
let fieldTerakhir = null;
const keTeks = (html) => String(html ?? "").replace(/<br\s*\/?>/gi, "\n");
const keHtml = (teks) => String(teks).replace(/\r?\n/g, "<br>");
/* Jumlah pola yang sudah pernah ada (bawaan / terbit) - pola di posisi ini
   tidak boleh dihapus, hanya disembunyikan. */
function polaTerkunci() {
  return Math.max(bawaan("materi", current.bab).items.length, current.terbit.materi?.items.length || 0);
}
function ambilPath(path) {
  return path.split(".").reduce((obj, k) => obj?.[k], current.isi.materi);
}
function setPath(path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const obj = keys.reduce((o, k) => o[k], current.isi.materi);
  obj[last] = value;
}
function renderMateriTab() {
  const body = $("kmTabBody");
  const m = current.isi.materi;
  const ubah = diubahDariBawaan("materi");
  body.innerHTML = `
    <p class="ks-hint">Keterangan tata bahasa yang dibaca siswa di Materi (tahap 1 "Pahami semua pola"); contoh kalimatnya juga dipakai tahap 2 "Pelajari contoh". <b>Urutan pola dikunci</b> karena progres "sudah paham" siswa disimpan per nomor pola: pola lama hanya bisa <b>disembunyikan</b>, pola baru ditambahkan di akhir. Bagian, contoh, dan baris tabel di dalam pola boleh ditambah, dihapus, dan diurutkan.</p>
    <div class="ks-toolbar km-materi-bar">
      <label class="ks-field km-judul">Judul pelajaran<input data-path="title" maxlength="100" autocomplete="off"></label>
      <span class="km-bawaan">${ubah ? `<span class="km-badge-diubah">Sudah diubah dari isi bawaan</span><button type="button" class="ks-link" data-mact="reset">Kembalikan tata bahasa ke isi bawaan</button>` : '<span class="muted">Sama dengan isi bawaan</span>'}</span>
    </div>
    <div class="km-format" role="toolbar" aria-label="Format teks">
      <span>Format teks terpilih:</span>
      <button type="button" data-fmt="u" title="Garis bawah"><u>U</u> garis bawah</button>
      <button type="button" data-fmt="sub" title="Huruf kecil di bawah (Kata Benda₁)">X<sub>1</sub> subskrip</button>
      <button type="button" data-fmt="i" title="Miring"><i>I</i> miring</button>
      <button type="button" data-fmt="kotak" title="Kotak pola kalimat">▭ kotak pola</button>
      <small>Enter = baris baru. HTML yang boleh: ${window.QUESTION_HTML_TAGS.slice(0, 15).join(", ")} (atribut hanya class).</small>
    </div>
    <p class="ks-hint km-gambar-hint">Gambar: pakai <b>+ gambar</b> / <b>Ganti gambar</b> di tiap bagian. Foto otomatis diperkecil (lebar maks. 1200 px), diubah ke WebP maks. 1 MB, dan data lokasi/kamera di foto dibuang. <button type="button" class="ks-link" data-mact="gambar-bersihkan">🧹 Bersihkan gambar tak terpakai</button></p>
    <div class="km-pola-list" id="kmPolaList"></div>
    <button type="button" class="secondary ks-add" data-mact="add-pola">+ Tambah pola baru (di akhir)</button>`;
  body.querySelector('[data-path="title"]').value = m.title;
  paintPolaList();
}
function paintPolaList() {
  const list = $("kmPolaList");
  if (!list) return;
  const terkunci = polaTerkunci();
  list.replaceChildren(...current.isi.materi.items.map((item, i) => kartuPola(item, i, i >= terkunci)));
}
function kartuPola(item, i, baru) {
  const hasil = cekPola(item);
  const card = document.createElement("article");
  card.className = `ks-q km-pola${polaTerbuka.has(i) ? " open" : ""}${hasil.errors.length ? " has-error" : ""}${item.hidden ? " km-pola-hidden" : ""}`;
  card.id = `kmPola${i}`;
  card.dataset.index = String(i);
  const ringkas = document.createElement("div");
  ringkas.innerHTML = window.sanitizeQuestionHtml(item.title || "");
  const judul = ringkas.textContent.replace(/\s+/g, " ").trim() || "(judul kosong)";
  card.innerHTML = `
    <header class="ks-q-head">
      <button type="button" class="ks-q-toggle" data-mact="toggle" aria-expanded="${polaTerbuka.has(i)}"><span class="ks-q-num">Pola ${i + 1}</span><span class="ks-q-sum"></span>${item.hidden ? '<span class="ks-badge off">Disembunyikan</span>' : ""}${baru ? '<span class="ks-badge new">Baru</span>' : ""}${hasil.errors.length ? `<span class="ks-q-err">${hasil.errors.length} perlu diperbaiki</span>` : ""}</button>
      <div class="ks-q-tools">
        ${item.hidden ? "" : `<button type="button" data-mact="preview">${pratinjau.has(i) ? "Tutup pratinjau" : "Pratinjau"}</button>`}
        ${baru ? '<button type="button" data-mact="del-pola">Hapus</button>' : `<button type="button" data-mact="hide">${item.hidden ? "Tampilkan lagi" : "Sembunyikan"}</button>`}
      </div>
    </header>`;
  card.querySelector(".ks-q-sum").textContent = judul;
  if (pratinjau.has(i) && !item.hidden) {
    const pv = document.createElement("div");
    pv.className = "km-pratinjau material-reader-body";
    pv.innerHTML = buildGrammarPointHtml(saringPola(item), i);
    card.appendChild(pv);
  }
  if (!polaTerbuka.has(i)) return card;
  const body = document.createElement("div");
  body.className = "km-pola-body";
  const p = `items.${i}`;
  if (item.hidden) {
    body.innerHTML = '<p class="ks-hint">Pola ini tidak tampil untuk siswa. Nomor polanya tetap disimpan supaya progres pola lain tidak bergeser. Tekan "Tampilkan lagi" untuk memunculkannya kembali.</p>';
    card.appendChild(body);
    return card;
  }
  body.append(
    isian("Judul pola (isi kotak pola)", `${p}.title`, item.title, { rows: 2 }),
    isian("Keterangan di luar kotak (opsional, mis. (kalimat tanya))", `${p}.suffix`, item.suffix || "", { single: true }),
  );
  const noBox = document.createElement("label");
  noBox.className = "ks-check";
  noBox.innerHTML = `<input type="checkbox" data-path="${p}.noBox"> Tanpa kotak (judul sub-bagian biasa, bukan pola kalimat)`;
  noBox.querySelector("input").checked = !!item.noBox;
  body.appendChild(noBox);
  item.blocks.forEach((b, k) => body.appendChild(kartuBagian(b, `${p}.blocks.${k}`, k, item.blocks.length)));
  const tambah = document.createElement("button");
  tambah.type = "button";
  tambah.className = "secondary km-small";
  tambah.dataset.mact = "add-blok";
  tambah.textContent = "+ Tambah bagian";
  const errs = document.createElement("ul");
  errs.className = "km-msgs";
  errs.append(
    ...hasil.errors.map((m) => Object.assign(document.createElement("li"), { textContent: m, className: "err" })),
    ...hasil.warnings.map((m) => Object.assign(document.createElement("li"), { textContent: `⚠ ${m}`, className: "warn" })),
  );
  body.append(tambah, errs);
  card.appendChild(body);
  return card;
}
function kartuBagian(b, p, k, total) {
  const box = document.createElement("fieldset");
  box.className = "km-bagian";
  box.dataset.path = p;
  const legend = document.createElement("legend");
  legend.innerHTML = `Bagian ${k + 1} <span class="km-tools-inline"><button type="button" data-mact="up" ${k === 0 ? "disabled" : ""} title="Naikkan">↑</button><button type="button" data-mact="down" ${k === total - 1 ? "disabled" : ""} title="Turunkan">↓</button><button type="button" data-mact="del" title="Hapus bagian">✕</button></span>`;
  box.appendChild(legend);
  box.append(
    isian("Sub-judul (mis. 1) …)", `${p}.label`, b.label || "", { rows: 2 }),
    isian("Penjelasan", `${p}.text`, b.text || "", { rows: 4 }),
  );
  if (b.figure) {
    const fig = document.createElement("div");
    fig.className = "km-figure";
    const img = Object.assign(document.createElement("img"), { alt: "", loading: "lazy" });
    if (String(b.figure.src).startsWith("materi-gambar/")) img.crossOrigin = "anonymous";
    img.src = materiFigureUrl(b.figure.src, "../");
    fig.appendChild(img);
    fig.appendChild(isian("Keterangan gambar (wajib, untuk pembaca layar)", `${p}.figure.alt`, b.figure.alt || "", { single: true, plain: true }));
    const aksiGambar = document.createElement("span");
    aksiGambar.className = "km-aksi";
    aksiGambar.innerHTML = '<button type="button" class="ks-link" data-mact="gambar-pilih">Ganti gambar</button><button type="button" class="ks-link danger" data-mact="gambar-hapus">Hapus gambar</button>';
    fig.appendChild(aksiGambar);
    box.appendChild(fig);
  }
  if (b.table) box.appendChild(editorTabel(b.table, `${p}.table`));
  const ex = document.createElement("div");
  ex.className = "km-contoh";
  ex.innerHTML = `<div class="km-sub">Contoh kalimat (${(b.examples || []).length})</div>`;
  (b.examples || []).forEach((e, j) => {
    const row = document.createElement("div");
    row.className = "km-contoh-row";
    row.dataset.path = `${p}.examples.${j}`;
    row.append(
      isian(`Contoh ${j + 1}`, `${p}.examples.${j}.0`, e[0], { rows: 1, lang: "ja" }),
      isian("Arti", `${p}.examples.${j}.1`, e[1], { rows: 1 }),
    );
    const tools = document.createElement("span");
    tools.className = "km-tools-inline";
    tools.innerHTML = `<button type="button" data-mact="up" ${j === 0 ? "disabled" : ""} title="Naikkan">↑</button><button type="button" data-mact="down" ${j === b.examples.length - 1 ? "disabled" : ""} title="Turunkan">↓</button><button type="button" data-mact="del" title="Hapus contoh">✕</button>`;
    row.appendChild(tools);
    ex.appendChild(row);
  });
  const aksi = document.createElement("div");
  aksi.className = "km-aksi";
  aksi.innerHTML = `<button type="button" class="ks-link" data-mact="add-contoh">+ contoh</button>${b.table ? "" : '<button type="button" class="ks-link" data-mact="add-tabel">+ tabel</button>'}${b.figure ? "" : '<button type="button" class="ks-link" data-mact="gambar-pilih">+ gambar</button>'}`;
  ex.appendChild(aksi);
  box.append(ex, isian("Catatan / [Perhatian] (opsional)", `${p}.note`, b.note || "", { rows: 2 }));
  return box;
}
function editorTabel(table, p) {
  const wrap = document.createElement("div");
  wrap.className = "km-tabel";
  wrap.dataset.path = p;
  wrap.innerHTML = `<div class="km-sub">Tabel (${table.headers.length} kolom × ${table.rows.length} baris; kolom pertama = judul baris)</div>`;
  const grid = document.createElement("div");
  grid.className = "km-tabel-grid";
  grid.style.gridTemplateColumns = `repeat(${table.headers.length + 1}, minmax(90px, 1fr))`;
  const sel = (path, value, ph) => {
    const el = document.createElement("textarea");
    el.rows = 1;
    el.dataset.path = path;
    el.dataset.html = "1";
    el.value = keTeks(value);
    el.placeholder = ph;
    el.lang = "ja";
    return el;
  };
  grid.appendChild(Object.assign(document.createElement("span"), { className: "km-tabel-pojok", textContent: "—" }));
  table.headers.forEach((h, c) => grid.appendChild(sel(`${p}.headers.${c}`, h, `Kolom ${c + 1}`)));
  table.rows.forEach((row, r) => row.forEach((cell, c) => grid.appendChild(sel(`${p}.rows.${r}.${c}`, cell, c === 0 ? `Baris ${r + 1}` : ""))));
  wrap.appendChild(grid);
  const aksi = document.createElement("div");
  aksi.className = "km-aksi";
  aksi.innerHTML = '<button type="button" class="ks-link" data-mact="tabel-baris+">+ baris</button><button type="button" class="ks-link" data-mact="tabel-baris-">− baris terakhir</button><button type="button" class="ks-link" data-mact="tabel-kolom+">+ kolom</button><button type="button" class="ks-link" data-mact="tabel-kolom-">− kolom terakhir</button><button type="button" class="ks-link danger" data-mact="tabel-hapus">Hapus tabel</button>';
  wrap.appendChild(aksi);
  return wrap;
}
function isian(label, path, value, { rows = 2, single = false, plain = false, lang = "" } = {}) {
  const wrap = document.createElement("label");
  wrap.className = "ks-field";
  wrap.append(document.createTextNode(label));
  const el = document.createElement(single ? "input" : "textarea");
  if (!single) el.rows = rows;
  el.dataset.path = path;
  if (!plain) el.dataset.html = "1";
  el.value = plain ? value ?? "" : keTeks(value);
  if (lang) el.lang = lang;
  el.autocomplete = "off";
  wrap.appendChild(el);
  return wrap;
}
/* Pratinjau memakai penyaring yang sama dengan halaman siswa. */
function saringPola(item) {
  const h = (v) => (typeof v === "string" ? window.sanitizeQuestionHtml(v) : v);
  return {
    ...item,
    title: h(item.title),
    suffix: h(item.suffix),
    blocks: item.blocks.map((b) => ({
      ...b,
      label: h(b.label),
      text: h(b.text),
      note: h(b.note),
      table: b.table ? { headers: b.table.headers.map(h), rows: b.table.rows.map((r) => r.map(h)) } : undefined,
      examples: (b.examples || []).map((e) => e.map(h)),
    })),
  };
}
function lompatPola(i) {
  if (current.tab !== "materi") {
    current.tab = "materi";
    renderEditor();
  }
  polaTerbuka.add(i);
  paintPolaList();
  $(`kmPola${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
function segarkanPola(i) {
  const lama = $(`kmPola${i}`);
  if (!lama) return;
  lama.replaceWith(kartuPola(current.isi.materi.items[i], i, i >= polaTerkunci()));
}
editorEl.addEventListener("focusin", (event) => {
  if (event.target.dataset?.html) fieldTerakhir = event.target;
});
editorEl.addEventListener("input", (event) => {
  const el = event.target;
  if (!current || current.tab !== "materi" || !el.dataset.path) return;
  const value = el.type === "checkbox" ? el.checked : el.dataset.html ? keHtml(el.value) : el.value;
  setPath(el.dataset.path, value);
  markDirty();
  // Perbarui ringkasan kesalahan & pratinjau pola tanpa merender ulang isian yang sedang diketik.
  const card = el.closest(".km-pola");
  if (!card) return;
  const i = Number(card.dataset.index);
  const item = current.isi.materi.items[i];
  const hasil = cekPola(item);
  card.classList.toggle("has-error", hasil.errors.length > 0);
  const ul = card.querySelector(".km-pola-body > .km-msgs");
  if (ul) ul.replaceChildren(
    ...hasil.errors.map((m) => Object.assign(document.createElement("li"), { textContent: m, className: "err" })),
    ...hasil.warnings.map((m) => Object.assign(document.createElement("li"), { textContent: `⚠ ${m}`, className: "warn" })),
  );
  const pv = card.querySelector(".km-pratinjau");
  if (pv) pv.innerHTML = buildGrammarPointHtml(saringPola(item), i);
});
editorEl.addEventListener("change", (event) => {
  if (current?.tab === "materi" && event.target.type === "checkbox" && event.target.dataset.path) {
    event.target.dispatchEvent(new Event("input", { bubbles: true }));
  }
});
editorEl.addEventListener("click", (event) => {
  const fmt = event.target.closest("[data-fmt]");
  if (fmt && current?.tab === "materi") {
    bungkusFormat(fmt.dataset.fmt);
    return;
  }
  const button = event.target.closest("[data-mact]");
  if (!button || !current || current.tab !== "materi") return;
  const act = button.dataset.mact;
  const m = current.isi.materi;
  if (act === "reset") {
    if (!window.confirm(`Kembalikan tata bahasa Pelajaran ${current.bab} ke isi bawaan? Suntingan di bagian ini dihapus dari draft (isi terbit baru berubah setelah diterbitkan).`)) return;
    current.isi.materi = bawaan("materi", current.bab);
    markDirty();
    renderEditor();
    return;
  }
  if (act === "gambar-bersihkan") {
    bersihkanGambar();
    return;
  }
  if (act === "add-pola") {
    m.items.push({ title: "", blocks: [{ label: "", text: "", examples: [["", ""]] }] });
    const i = m.items.length - 1;
    polaTerbuka.add(i);
    markDirty();
    renderEditor();
    lompatPola(i);
    return;
  }
  const card = button.closest(".km-pola");
  if (!card) return;
  const i = Number(card.dataset.index);
  const item = m.items[i];
  if (act === "toggle") {
    if (polaTerbuka.has(i)) polaTerbuka.delete(i);
    else polaTerbuka.add(i);
    segarkanPola(i);
    return;
  }
  if (act === "preview") {
    if (pratinjau.has(i)) pratinjau.delete(i);
    else pratinjau.add(i);
    segarkanPola(i);
    return;
  }
  if (act === "hide") {
    if (!item.hidden && !window.confirm(`Sembunyikan pola ${i + 1} dari siswa? Isinya tetap tersimpan dan bisa ditampilkan lagi.`)) return;
    item.hidden = !item.hidden;
    if (!item.hidden) delete item.hidden;
  } else if (act === "del-pola") {
    if (!window.confirm(`Hapus pola baru ${i + 1}?`)) return;
    m.items.splice(i, 1);
    polaTerbuka = new Set([...polaTerbuka].filter((x) => x !== i).map((x) => (x > i ? x - 1 : x)));
    pratinjau = new Set([...pratinjau].filter((x) => x !== i).map((x) => (x > i ? x - 1 : x)));
    markDirty();
    renderEditor();
    return;
  } else if (act === "add-blok") {
    item.blocks.push({ label: "", text: "" });
  } else if (act === "gambar-pilih") {
    pilihGambar(button.closest(".km-bagian").dataset.path, i);
    return;
  } else if (act === "gambar-hapus") {
    if (!window.confirm("Hapus gambar dari bagian ini? (File-nya tetap tersimpan sampai dibersihkan.)")) return;
    delete ambilPath(button.closest(".km-bagian").dataset.path).figure;
  } else {
    // Aksi di dalam bagian / contoh / tabel: path wadah terdekat.
    const wadah = button.closest("[data-path]");
    const path = wadah?.dataset.path;
    if (!path) return;
    if (!aksiDalam(act, path)) return;
  }
  markDirty();
  segarkanPola(i);
  const tabBtn = editorEl.querySelector('.ks-tabs [data-tab="materi"]');
  if (tabBtn) tabBtn.textContent = `Tata bahasa (${m.items.filter((x) => !x.hidden).length})`;
});
/* ---------- Unggah gambar (supabase/add-materi-gambar.sql) ----------
   Foto dikecilkan di browser (maks. 1200 x 1600 px) lalu diubah ke WebP
   <= 1 MB lewat canvas - sekalian membuang EXIF (lokasi GPS, kamera). Nama
   file acak, jadi isi file di alamat yang sama tidak pernah berubah. */
const GAMBAR_MAKS = 1048576;
function hexAcak() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (x) => x.toString(16).padStart(2, "0")).join("");
}
async function kecilkanGambar(file) {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") throw new Error("Pilih file foto/gambar (JPG, PNG, atau WebP).");
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Format gambar ini tidak bisa dibuka browser. Simpan ulang sebagai JPG atau PNG lalu coba lagi.");
  }
  const skala = Math.min(1, 1200 / bitmap.width, 1600 / bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * skala));
  canvas.height = Math.max(1, Math.round(bitmap.height * skala));
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff"; // latar putih untuk PNG transparan
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  for (const mutu of [0.82, 0.7, 0.55, 0.4]) {
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", mutu));
    if (!blob || blob.type !== "image/webp") throw new Error("Browser ini belum bisa membuat gambar WebP. Pakai Chrome, Edge, atau Firefox versi terbaru.");
    if (blob.size <= GAMBAR_MAKS) return blob;
  }
  throw new Error("Gambar masih lebih dari 1 MB setelah dikompres. Potong atau perkecil gambar dulu.");
}
function pilihGambar(path, i) {
  const pemilih = Object.assign(document.createElement("input"), { type: "file", accept: "image/jpeg,image/png,image/webp,image/*" });
  pemilih.onchange = async () => {
    const file = pemilih.files[0];
    if (!file || !current) return;
    const bab = current.bab;
    showFeedback("warning", "Memproses & mengunggah gambar…");
    try {
      const blob = await kecilkanGambar(file);
      const nama = `pelajaran-${bab}/${hexAcak()}.webp`;
      const { error } = await supa.storage.from("materi-gambar").upload(nama, blob, { contentType: "image/webp", cacheControl: "31536000", upsert: false });
      if (error) throw error;
      if (!current || current.bab !== bab) return; // Operator sudah pindah pelajaran.
      const blok = ambilPath(path);
      blok.figure = { src: `materi-gambar/${nama}`, alt: blok.figure?.alt || "" };
      markDirty();
      polaTerbuka.add(i);
      segarkanPola(i);
      showFeedback("success", `Gambar diunggah (${Math.round(blob.size / 1024)} KB). Isi keterangan gambar, lalu simpan draft.`);
      editorEl.querySelector(`[data-path="${path}.figure.alt"]`)?.focus();
    } catch (error) {
      const pesan = errorMessage(error);
      showFeedback("error", `Gagal mengunggah gambar: ${pesan}${/bucket|policy|row-level/i.test(pesan) ? " (Operator perlu menjalankan supabase/add-materi-gambar.sql.)" : ""}`);
    }
  };
  pemilih.click();
}
async function bersihkanGambar() {
  const { data, error } = await supa.rpc("materi_gambar_tak_terpakai");
  if (error) {
    showFeedback("error", `Gagal memeriksa gambar: ${errorMessage(error)}`);
    return;
  }
  if (!data.length) {
    showFeedback("success", "Tidak ada gambar tak terpakai. (Gambar yang diunggah kurang dari 1 hari lalu tidak dihitung.)");
    return;
  }
  const kb = Math.round(data.reduce((n, r) => n + Number(r.ukuran || 0), 0) / 1024);
  if (!window.confirm(`${data.length} gambar (${kb} KB) tidak dipakai di isi terbit, draft, maupun Riwayat versi mana pun. Hapus permanen? Ini tidak bisa dibatalkan.`)) return;
  const { error: hapus } = await supa.storage.from("materi-gambar").remove(data.map((r) => r.name));
  if (hapus) {
    showFeedback("error", `Gagal menghapus: ${errorMessage(hapus)}`);
    return;
  }
  showFeedback("success", `${data.length} gambar tak terpakai dihapus (${kb} KB).`);
}

/* Tambah/hapus/urutkan bagian, contoh, dan isi tabel. path = elemen terdekat
   (items.I.blocks.K, items.I.blocks.K.examples.J, atau ...table). */
function aksiDalam(act, path) {
  const keys = path.split(".");
  if (act === "up" || act === "down" || act === "del") {
    const idx = Number(keys.pop());
    const arr = ambilPath(keys.join("."));
    if (act === "del") {
      if (!window.confirm(keys[keys.length - 1] === "blocks" ? "Hapus bagian ini beserta contohnya?" : "Hapus contoh ini?")) return false;
      arr.splice(idx, 1);
    } else {
      const j = act === "up" ? idx - 1 : idx + 1;
      if (j < 0 || j >= arr.length) return false;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
    }
    return true;
  }
  const blok = ambilPath(path.replace(/\.table$/, ""));
  if (act === "add-contoh") (blok.examples ||= []).push(["", ""]);
  else if (act === "add-tabel") blok.table = { headers: ["", ""], rows: [["", "", ""]] };
  else if (act === "tabel-hapus") {
    if (!window.confirm("Hapus tabel ini?")) return false;
    delete blok.table;
  } else if (act === "tabel-baris+") blok.table.rows.push(Array(blok.table.headers.length + 1).fill(""));
  else if (act === "tabel-baris-") {
    if (blok.table.rows.length <= 1) return false;
    blok.table.rows.pop();
  } else if (act === "tabel-kolom+") {
    blok.table.headers.push("");
    blok.table.rows.forEach((r) => r.push(""));
  } else if (act === "tabel-kolom-") {
    if (blok.table.headers.length <= 1) return false;
    blok.table.headers.pop();
    blok.table.rows.forEach((r) => r.pop());
  } else return false;
  return true;
}
const FORMAT = { u: ["<u>", "</u>"], sub: ["<sub>", "</sub>"], i: ["<i>", "</i>"], kotak: ['<span class="grammar-pola-box">', "</span>"] };
function bungkusFormat(jenis) {
  const el = fieldTerakhir;
  if (!el || !document.body.contains(el)) {
    showFeedback("warning", "Klik dulu kotak isian, pilih teksnya, lalu tekan tombol format.");
    return;
  }
  const [buka, tutup] = FORMAT[jenis];
  const { selectionStart: a, selectionEnd: b, value } = el;
  el.value = value.slice(0, a) + buka + value.slice(a, b) + tutup + value.slice(b);
  el.focus();
  el.setSelectionRange(a + buka.length, b + buka.length);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

// ---------- Tab Riwayat ----------
async function renderHistoryTab() {
  const body = $("kmTabBody");
  body.innerHTML = '<p class="muted">Memuat riwayat…</p>';
  const { data, error } = await supa.rpc("konten_versions", { p_bab: current.bab });
  if (current.tab !== "riwayat") return;
  if (error) {
    body.innerHTML = `<p class="login-error">Gagal memuat riwayat: ${escapeHtml(errorMessage(error))}</p>`;
    return;
  }
  if (!data || !data.length) {
    body.innerHTML = '<p class="muted">Belum ada versi tersimpan. Isi yang sedang terbit disimpan otomatis setiap kali pelajaran ini diterbitkan atau dipulihkan.</p>';
    return;
  }
  body.innerHTML = '<p class="ks-hint">Setiap versi adalah isi yang terbit SEBELUM sebuah penerbitan/pemulihan. Memulihkan versi langsung mengganti isi yang terbit (isi saat ini disimpan dulu, jadi bisa dibatalkan) dan membuang draft pelajaran ini.</p><ol class="ks-versions" id="kmVersions"></ol>';
  const list = $("kmVersions");
  data.forEach((v) => {
    const li = document.createElement("li");
    const info = document.createElement("div");
    const title = document.createElement("b");
    title.textContent = waktu(v.created_at);
    const detail = document.createElement("small");
    const isi = v.diubah.length ? `${v.diubah.map((j) => NAMA_JENIS[j] || j).join(", ")} disunting` : "isi bawaan";
    detail.textContent = `#${v.id} · ${v.alasan} · ${isi} · oleh ${v.created_by_name}`;
    info.append(title, detail);
    const restore = document.createElement("button");
    restore.type = "button";
    restore.className = "secondary";
    restore.textContent = "Pulihkan";
    restore.onclick = () => restoreVersion(v);
    li.append(info, restore);
    list.appendChild(li);
  });
}
async function restoreVersion(v) {
  if (current.dirty && !window.confirm("Perubahan yang belum disimpan akan hilang. Lanjutkan?")) return;
  if (!window.confirm(`Pulihkan versi #${v.id}? Isi Pelajaran ${current.bab} yang sedang terbit akan diganti dan draft-nya dibuang.`)) return;
  const { error } = await supa.rpc("konten_restore", { p_version_id: v.id });
  if (error) {
    showFeedback("error", `Gagal memulihkan: ${errorMessage(error)}`);
    return;
  }
  current.dirty = false;
  await reload("riwayat");
  showFeedback("success", `Versi #${v.id} dipulihkan dan sudah terbit.`);
}

// ---------- Simpan, terbitkan, buang ----------
/* Kata/kanji yang tulisannya hilang dari daftar dibanding isi terbit
   sekarang - progres Hafalan siswa untuk kata itu tidak terbawa. */
function kataHilang() {
  const hilang = [];
  [["kosakata", 0], ["kanji", 0]].forEach(([jenis, k]) => {
    const lama = new Set((current.terbit[jenis] ?? bawaan(jenis, current.bab)).map((x) => x[k].trim()));
    const baru = new Set(current.isi[jenis].map((x) => x[k].trim()));
    lama.forEach((w) => !baru.has(w) && hilang.push(w));
  });
  return hilang;
}
async function saveDraft() {
  if (!current) return false;
  const button = $("kmSave");
  button.disabled = true;
  const label = button.textContent;
  button.textContent = "Menyimpan…";
  const { data, error } = await supa.rpc("konten_save_draft", { p_bab: current.bab, p_isi: isiDisimpan(), p_base_updated_at: current.base });
  button.disabled = false;
  button.textContent = label;
  if (error) {
    showFeedback("error", `Gagal menyimpan: ${errorMessage(error)}`);
    return false;
  }
  current.base = data;
  current.source = "draft";
  current.updatedBy = window.currentProfile.full_name;
  current.dirty = false;
  current.serverErrors = [];
  $("kmDirty").hidden = true;
  $("kmDiscard").hidden = false;
  $("kmStatus").innerHTML = statusText();
  const { errors, warnings } = semuaCek();
  if (errors.length) showFeedback("warning", `Draft tersimpan. Masih ada ${errors.length} hal yang perlu diperbaiki sebelum bisa diterbitkan:`, errors.map((e) => e.message));
  else showFeedback("success", warnings.length ? `Draft tersimpan dan bisa diterbitkan. Catatan (${warnings.length}):` : "Draft tersimpan dan siap diterbitkan.", warnings.map((w) => w.message));
  loadList();
  return true;
}
async function publish() {
  if (!current) return;
  const { errors } = semuaCek();
  if (errors.length) {
    showFeedback("error", "Perbaiki dulu sebelum diterbitkan:", errors.map((e) => e.message));
    return;
  }
  const catatan = current.catatan.trim();
  if (catatan.length > CATATAN_MAKS || /[<>]/.test(catatan)) {
    showFeedback("error", `Catatan untuk siswa maks. ${CATATAN_MAKS} karakter, tanpa < >.`);
    return;
  }
  if (current.dirty || current.source !== "draft") {
    if (!(await saveDraft())) return;
  }
  const hilang = kataHilang();
  const pesan = [`Terbitkan isi Pelajaran ${current.bab}? Siswa mendapat isi ini saat membuka Hafalan/Tugas berikutnya.`];
  pesan.push(catatan
    ? `\nSiswa melihat tanda "Diperbarui" dengan catatan: ${catatan}`
    : '\nTanpa catatan - dianggap perbaikan kecil, siswa tidak diberi tanda "Diperbarui".');
  if (hilang.length) pesan.push(`\nPerhatian: ${hilang.length} kata/kanji diganti atau dihapus (${hilang.slice(0, 8).join("、")}${hilang.length > 8 ? "…" : ""}). Progres Hafalan siswa untuk kata lama itu tidak terbawa ke kata baru.`);
  if (!window.confirm(pesan.join("\n"))) return;
  const button = $("kmPublish");
  button.disabled = true;
  const { data, error } = await supa.rpc("konten_publish", { p_bab: current.bab, p_base_updated_at: current.base, ...(catatan ? { p_catatan: catatan } : {}) });
  button.disabled = false;
  if (error) {
    showFeedback("error", `Gagal menerbitkan: ${errorMessage(error)}`);
    return;
  }
  if (!data.ok) {
    current.serverErrors = data.errors || [];
    showFeedback("error", "Belum bisa diterbitkan:", current.serverErrors);
    return;
  }
  await reload();
  showFeedback("success", "Berhasil diterbitkan. Versi sebelumnya tersimpan di tab Riwayat versi.");
}
async function discardDraft() {
  if (!current || !window.confirm("Buang draft ini dan kembali ke isi yang sedang terbit?")) return;
  const { error } = await supa.rpc("konten_discard_draft", { p_bab: current.bab });
  if (error) {
    showFeedback("error", `Gagal membuang draft: ${errorMessage(error)}`);
    return;
  }
  current.dirty = false;
  await reload();
  showFeedback("success", "Draft dibuang.");
}
async function reload(tab) {
  const bab = current.bab;
  await loadList();
  await openBab(bab, { paksa: true, tab: tab || current.tab });
}

// ---------- Laporan siswa ----------
const JENIS_LAPORAN = { tidak_sesuai: "Sudah tidak sesuai dengan keadaan di Jepang", salah: "Ada yang salah", kurang_jelas: "Penjelasan kurang jelas", lainnya: "Lainnya" };
const STATUS_LAPORAN = { baru: "Baru", diproses: "Diproses", selesai: "Selesai (sudah diperbaiki)", ditolak: "Ditolak (tidak diubah)" };
const FILTER_LAPORAN = [["terbuka", "Terbuka"], ["baru", "Baru"], ["diproses", "Diproses"], ["selesai", "Selesai"], ["ditolak", "Ditolak"], [null, "Semua"]];
const lokasiLabel = (lokasi) => (lokasi === "materi" ? "Materi" : `Soal tugas (${lokasi.replace(/^tugas-/, "")})`);
/* Tab editor yang paling dekat dengan bagian yang dilaporkan. */
function tabUntuk(lokasi) {
  if (/kotoba|dengar/.test(lokasi)) return "kosakata";
  if (/kanji/.test(lokasi)) return "kanji";
  if (/kalimat-susun/.test(lokasi)) return "susun";
  if (/kalimat-pilih|partikel/.test(lokasi)) return "pilih";
  return "materi";
}
async function loadLaporanRingkas() {
  const { data, error } = await supa.rpc("laporan_ringkas");
  if (error) {
    $("kmLaporanJumlah").textContent = "";
    return;
  }
  laporanPerBab = Object.fromEntries((data || []).map((r) => [r.bab, r]));
  const baru = (data || []).reduce((n, r) => n + r.baru, 0);
  $("kmLaporanJumlah").innerHTML = baru ? `<b>${baru} baru</b>` : "";
  renderList();
  if (current) paintTinjau();
}
function bukaLaporan(filter) {
  if (!confirmLeaveDirty()) return;
  current = null;
  laporanFilter = { ...laporanFilter, ...filter };
  renderList();
  renderLaporan();
}
async function renderLaporan() {
  const { status, bab } = laporanFilter;
  editorEl.innerHTML = `
    <header class="ks-editor-head"><div><div class="eyebrow">Masukan siswa</div><h2>Laporan siswa</h2>
      <p class="ks-status">Laporan dari tombol "Laporkan" di Materi dan soal Tugas. Tanggapan Anda dibaca siswa pelapor.</p></div></header>
    <div class="ks-feedback" id="kmFeedback" hidden></div>
    <nav class="ks-tabs">${FILTER_LAPORAN.map(([id, nama]) => `<button type="button" data-status="${id ?? ""}" class="${status === id ? "active" : ""}">${nama}</button>`).join("")}</nav>
    ${bab ? `<p class="muted">Hanya Pelajaran ${bab} · <button type="button" class="ks-link" id="kmLaporanSemuaBab">Tampilkan semua pelajaran</button></p>` : ""}
    <ul class="km-laporan-list" id="kmLaporanList"><li class="muted">Memuat…</li></ul>`;
  editorEl.querySelectorAll(".ks-tabs button").forEach((b) => (b.onclick = () => bukaLaporan({ status: b.dataset.status || null })));
  if (bab) $("kmLaporanSemuaBab").onclick = () => bukaLaporan({ bab: null });
  const { data, error } = await supa.rpc("laporan_list", { p_status: status });
  const list = $("kmLaporanList");
  if (!list) return; // sudah pindah ke halaman lain
  if (error) {
    list.innerHTML = `<li class="login-error">Gagal memuat laporan: ${escapeHtml(errorMessage(error))}. Operator perlu menjalankan supabase/add-laporan-konten.sql.</li>`;
    return;
  }
  const rows = (data || []).filter((r) => !bab || r.bab === bab);
  if (!rows.length) {
    list.innerHTML = '<li class="muted">Tidak ada laporan di sini.</li>';
    return;
  }
  list.replaceChildren(...rows.map(kartuLaporan));
}
function kartuLaporan(r) {
  const li = document.createElement("li");
  li.className = `km-laporan ${r.status}`;
  const teks = (kelas, isi) => Object.assign(document.createElement("p"), { className: kelas, textContent: isi });
  const pilih = document.createElement("select");
  Object.entries(STATUS_LAPORAN).forEach(([value, nama]) => pilih.append(new Option(nama, value, false, value === r.status)));
  const tanggapan = Object.assign(document.createElement("textarea"), {
    rows: 2, maxLength: 500, value: r.tanggapan || "",
    placeholder: "Tanggapan untuk siswa (opsional), mis. \"Sudah diperbaiki, terima kasih!\"",
  });
  const simpan = Object.assign(document.createElement("button"), { type: "button", className: "primary", textContent: "Simpan" });
  const buka = Object.assign(document.createElement("button"), { type: "button", className: "secondary", textContent: `Buka Pelajaran ${r.bab}` });
  const tombol = document.createElement("div");
  tombol.append(simpan, buka);
  const aksi = document.createElement("div");
  aksi.className = "km-laporan-aksi";
  aksi.append(pilih, tanggapan, tombol);
  const peran = r.pelapor_peran ? ` (${r.pelapor_peran})` : "";
  const ditangani = r.ditangani_at ? ` · ditangani ${tanggal(r.ditangani_at)}${r.ditangani_nama ? ` oleh ${r.ditangani_nama}` : ""}` : "";
  li.append(
    teks("km-laporan-meta", `Pelajaran ${r.bab} · ${lokasiLabel(r.lokasi)} · ${waktu(r.created_at)} · ${r.pelapor_nama}${peran}${ditangani}`),
    Object.assign(document.createElement("b"), { textContent: JENIS_LAPORAN[r.jenis] || r.jenis }),
    ...(r.rujukan ? [teks("km-laporan-rujukan", r.rujukan)] : []),
    teks("", r.pesan),
    aksi);
  simpan.onclick = async () => {
    simpan.disabled = true;
    const { error } = await supa.rpc("laporan_tangani", { p_id: r.id, p_status: pilih.value, p_tanggapan: tanggapan.value });
    simpan.disabled = false;
    if (error) {
      showFeedback("error", `Gagal menyimpan laporan: ${errorMessage(error)}`);
      return;
    }
    await loadLaporanRingkas();
    await renderLaporan();
    showFeedback("success", `Laporan Pelajaran ${r.bab} disimpan sebagai "${STATUS_LAPORAN[pilih.value]}".`);
  };
  buka.onclick = () => openBab(r.bab, { tab: tabUntuk(r.lokasi) });
  return li;
}
$("kmLaporanBtn").onclick = () => bukaLaporan({ bab: null });

// ---------- Jaga perubahan yang belum disimpan ----------
window.addEventListener("beforeunload", (event) => {
  if (current && current.dirty) {
    event.preventDefault();
    event.returnValue = "";
  }
});
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s" && current) {
    event.preventDefault();
    saveDraft();
  }
});
/* Sebelum logout otomatis karena tidak aktif (js/sesi-idle.js), editan yang
   belum disimpan disimpan dulu sebagai draft supaya tidak hilang. */
if (window.IdleSession) {
  window.IdleSession.beforeLogout(async () => {
    if (current && current.dirty) {
      await saveDraft();
      current.dirty = false;
    }
  });
}

loadList().then(loadLaporanRingkas);
}
window.initPage = initPage;
