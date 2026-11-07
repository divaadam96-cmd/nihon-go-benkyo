/* Halaman Kelola Materi (pages/kelola-materi.html) - editor isi pelajaran
   untuk Operator, Tahap 1: kosakata, kanji, soal susun & pilih kalimat per
   Pelajaran 1-50. Isi bawaan diambil dari berkas data (data/bab-data.js,
   data/tugas-kalimat-data.js); yang disimpan ke database hanya bagian yang
   BERBEDA dari bawaan (supabase/add-editor-konten.sql), lalu halaman siswa
   menimpanya lewat js/konten-bab.js. Alur: draft -> terbitkan (divalidasi
   ulang di server) -> versi lama di Riwayat versi.
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
const JENIS = ["kosakata", "kanji", "kalimat"];
const NAMA_JENIS = { kosakata: "Kosakata", kanji: "Kanji", kalimat: "Soal kalimat" };
const JUMLAH_TUGAS = 10; // TUGAS_KALIMAT_JUMLAH di js/tugas-bab.js

let ringkasan = []; // baris konten_list()
/* current: { bab, isi: {kosakata, kanji, kalimat} lengkap (bawaan + suntingan),
   terbit, base, source, updatedBy, dirty, tab, serverErrors } */
let current = null;
let filterText = "";

const salin = (v) => JSON.parse(JSON.stringify(v));
const sama = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function bawaan(jenis, bab) {
  if (jenis === "kosakata") return salin(babKosakataData[bab] || []);
  if (jenis === "kanji") return salin(babKanjiData[bab] || []);
  return salin(tugasKalimatData[bab] || { susun: [], pilih: [] });
}
function errorMessage(error) {
  return (error && (error.message || error.error_description)) || String(error || "Terjadi kesalahan.");
}
const waktu = (iso) => new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });

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
const CEK = {
  kosakata: (list) => list.map((x, i) => cekKosakata(x, i, list)),
  kanji: (list) => list.map((x, i) => cekKanji(x, i, list)),
  susun: (list) => list.map(cekSusun),
  pilih: (list) => list.map(cekPilih),
};
const LABEL_BARIS = { kosakata: "Kosakata", kanji: "Kanji", susun: "Susun", pilih: "Pilih" };
function daftarFor(tab) {
  if (tab === "susun" || tab === "pilih") return current.isi.kalimat[tab];
  return current.isi[tab];
}
/* Semua kesalahan & peringatan: [{tab, index, message}] */
function semuaCek() {
  const errors = [], warnings = [];
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
function rapikan(jenis, v) {
  const t = (s) => String(s ?? "").trim();
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
}
function renderList() {
  const byBab = Object.fromEntries(ringkasan.map((r) => [r.bab, r]));
  listEl.innerHTML = Array.from({ length: MAX_BAB }, (_, i) => {
    const bab = i + 1;
    const r = byBab[bab] || {};
    const diubah = (r.diubah || []).map((j) => NAMA_JENIS[j] || j);
    const title = [`Pelajaran ${bab}`, diubah.length ? `diubah: ${diubah.join(", ")}` : "isi bawaan", r.has_draft ? `ada draft (${r.draft_updated_by || "Operator"})` : ""].filter(Boolean).join(" · ");
    return `<button type="button" class="km-bab${current && current.bab === bab ? " active" : ""}" data-bab="${bab}" title="${escapeHtml(title)}"><b>${bab}</b><span>${diubah.length ? '<i class="km-dot diubah"></i>' : ""}${r.has_draft ? '<i class="km-dot draft"></i>' : ""}</span></button>`;
  }).join("");
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
    tab: tab || (current && current.tab !== "riwayat" ? current.tab : "kosakata"),
    serverErrors: [],
  };
  filterText = "";
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
  ["kosakata", "Kosakata", () => current.isi.kosakata.length],
  ["kanji", "Kanji", () => current.isi.kanji.length],
  ["susun", "Susun kalimat", () => current.isi.kalimat.susun.length],
  ["pilih", "Pilih kalimat", () => current.isi.kalimat.pilih.length],
  ["riwayat", "Riwayat versi", null],
];
const JENIS_TAB = { kosakata: "kosakata", kanji: "kanji", susun: "kalimat", pilih: "kalimat" };
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
  if (current.serverErrors.length) showFeedback("error", "Belum bisa diterbitkan:", current.serverErrors);
  if (current.tab === "riwayat") renderHistoryTab();
  else renderDaftarTab();
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
    if (match) {
      li.className = "ks-jump";
      li.title = "Buka baris ini";
      li.onclick = () => lompat(match[1].toLowerCase(), Number(match[2]) - 1);
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
    <div id="kmRows" class="km-rows km-rows-${tab}"></div>
    <button type="button" class="secondary ks-add" id="kmAdd">+ Tambah ${tab === "kosakata" ? "kata" : tab === "kanji" ? "kanji" : "soal"}</button>`;
  const filterEl = $("kmFilter");
  filterEl.value = filterText;
  filterEl.oninput = () => { filterText = filterEl.value; paintRows(); };
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
  if (current.dirty || current.source !== "draft") {
    if (!(await saveDraft())) return;
  }
  const hilang = kataHilang();
  const pesan = [`Terbitkan isi Pelajaran ${current.bab}? Siswa mendapat isi ini saat membuka Hafalan/Tugas berikutnya.`];
  if (hilang.length) pesan.push(`\nPerhatian: ${hilang.length} kata/kanji diganti atau dihapus (${hilang.slice(0, 8).join("、")}${hilang.length > 8 ? "…" : ""}). Progres Hafalan siswa untuk kata lama itu tidak terbawa ke kata baru.`);
  if (!window.confirm(pesan.join("\n"))) return;
  const button = $("kmPublish");
  button.disabled = true;
  const { data, error } = await supa.rpc("konten_publish", { p_bab: current.bab, p_base_updated_at: current.base });
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

loadList();
}
window.initPage = initPage;
