/* Halaman Kelola Soal (pages/kelola-soal.html) - editor soal Tes Kemampuan
   untuk Operator: semua rentang per-5-Bab dan semua paket ujian (termasuk
   membuat paket baru), dengan alur draft -> terbitkan dan riwayat versi.
   Semua penyimpanan lewat fungsi editor_* di database
   (supabase/add-editor-soal.sql) yang memvalidasi ulang isinya - validasi
   di halaman ini hanya supaya kesalahan langsung terlihat saat mengetik.
   Teks dari pengguna selalu dimasukkan lewat textContent/value; hanya
   pratinjau yang merender HTML soal, dan selalu lewat sanitizeQuestionHtml
   (js/soal-html.js). Dibungkus initPage(), dijalankan auth.js setelah login. */
function initPage() {
if (!window.currentProfile || window.currentProfile.role !== "operator") return;

const $ = (id) => document.getElementById(id);
const supa = window.supabaseClient;
const escapeHtml = window.escapeHtml;
const listEl = $("ksTestList");
const editorEl = $("ksEditor");

const KEY_RE = /^[a-z0-9][a-z0-9-]{1,40}$/;
const IMAGE_RE = /^assets\/images\/[A-Za-z0-9/_-]+\.(webp|png|jpe?g)$/;
const AUDIO_RE = /^assets\/audio\/[A-Za-z0-9/_.-]+\.mp3$/;
const SRS_RE = /^(kanji:[^:\s]{1,20}|materi:book[12]:[0-9]{1,2}:[0-9]{1,2}|hafalan:bab[0-9]{1,2}-(kosakata|kanji):[^\n]{1,60})$/;
const HTML_FIELDS = { instruction: "instruksi", html: "teks soal", explanation: "pembahasan" };

let tests = [];
/* current: { kind, ref, label, pkg, questions, base, source, dirty,
   openAttempts, publishedCount, tab } */
let current = null;
let expanded = new Set();
let filterText = "";

const blankQuestion = () => ({
  category: "", subcategory: "", instruction: "", html: "", options: ["", "", "", ""],
  answer: null, explanation: "", material: "", image: "", audio_src: "", srs_id: "",
});
const defaultPackage = (label) => ({
  label, mark: "SET", description: "", time_limit_minutes: 60, one_page: false, position: 100, active: true,
});
function normalizeQuestion(q) {
  const base = blankQuestion();
  const merged = { ...base, ...(q || {}) };
  for (const key of Object.keys(base)) if (merged[key] == null && key !== "answer") merged[key] = base[key];
  merged.options = Array.isArray(merged.options) ? merged.options.map((o) => String(o ?? "")) : base.options;
  merged.answer = Number.isInteger(merged.answer) ? merged.answer : null;
  return merged;
}
const testTitle = (kind, ref, label) => (kind === "bab" ? `Bab ${ref}–${Number(ref) + 4}` : label || ref);
function errorMessage(error) {
  return (error && (error.message || error.error_description)) || String(error || "Terjadi kesalahan.");
}

// ---------- Validasi (cermin aturan validate_test_content di server) ----------
function validateQuestion(q) {
  const errs = [];
  const len = (v) => String(v || "").length;
  if (len(q.category) < 1 || len(q.category) > 60) errs.push("Kategori wajib diisi (maks. 60 karakter).");
  if (len(q.subcategory) > 60) errs.push("Subkategori maks. 60 karakter.");
  if (len(q.instruction) < 1 || len(q.instruction) > 1000) errs.push("Instruksi wajib diisi (maks. 1000 karakter).");
  if (len(q.html) < 1 || len(q.html) > 5000) errs.push("Teks soal wajib diisi (maks. 5000 karakter).");
  if (len(q.explanation) > 3000) errs.push("Pembahasan maks. 3000 karakter.");
  if (len(q.material) < 1 || len(q.material) > 200) errs.push("Label materi wajib diisi (maks. 200 karakter).");
  for (const [field, name] of Object.entries(HTML_FIELDS)) {
    if (!window.isSafeQuestionHtml(q[field])) errs.push(`HTML ${name} memakai tag/atribut yang tidak diizinkan (tulis "<" sebagai &lt;).`);
  }
  if (q.options.length < 2 || q.options.length > 6) errs.push("Harus ada 2–6 pilihan jawaban.");
  else if (q.options.some((o) => o.trim().length < 1 || o.length > 300)) errs.push("Setiap pilihan jawaban wajib diisi (maks. 300 karakter).");
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) errs.push("Pilih kunci jawaban (bulatan di samping pilihan).");
  if (q.image && !IMAGE_RE.test(q.image)) errs.push("Path gambar harus assets/images/….webp/png/jpg.");
  if (q.audio_src && !AUDIO_RE.test(q.audio_src)) errs.push("Path audio harus assets/audio/….mp3.");
  if (q.srs_id && !SRS_RE.test(q.srs_id)) errs.push("Id hafalan (srs_id) tidak sah.");
  return errs;
}
function validatePackage(pkg) {
  const errs = [];
  if (!pkg) return ["Pengaturan paket wajib diisi."];
  if (String(pkg.label || "").length < 1 || String(pkg.label).length > 120) errs.push("Nama paket wajib diisi (maks. 120 karakter).");
  if (String(pkg.mark || "").length < 1 || String(pkg.mark).length > 12) errs.push("Kode singkat wajib diisi (maks. 12 karakter).");
  if (String(pkg.description || "").length > 500) errs.push("Deskripsi maks. 500 karakter.");
  if (!Number.isInteger(pkg.time_limit_minutes) || pkg.time_limit_minutes < 5 || pkg.time_limit_minutes > 240) errs.push("Batas waktu harus 5–240 menit.");
  if (!Number.isInteger(pkg.position)) errs.push("Urutan harus angka.");
  return errs;
}
function allErrors() {
  if (!current) return [];
  const list = [];
  if (current.kind === "paket") validatePackage(current.pkg).forEach((m) => list.push({ index: -1, message: `Pengaturan paket: ${m}` }));
  if (!current.questions.length) list.push({ index: -1, message: "Tes harus berisi minimal 1 soal." });
  current.questions.forEach((q, i) => validateQuestion(q).forEach((m) => list.push({ index: i, message: `Soal ${i + 1}: ${m}` })));
  return list;
}

// ---------- Daftar tes ----------
async function loadTests() {
  const { data, error } = await supa.rpc("editor_list_tests");
  if (error) {
    listEl.innerHTML = `<p class="login-error">Gagal memuat daftar tes: ${escapeHtml(errorMessage(error))}</p>`;
    return;
  }
  tests = data || [];
  renderTestList();
}
function renderTestList() {
  const group = (kind, title) => {
    const rows = tests.filter((t) => t.test_kind === kind);
    const items = rows.map((t) => {
      const active = current && current.kind === t.test_kind && current.ref === t.test_ref;
      const badges = [
        t.has_draft ? '<span class="ks-badge draft">Draft</span>' : "",
        t.published_count === 0 ? '<span class="ks-badge new">Belum terbit</span>' : "",
        t.test_kind === "paket" && t.published_count > 0 && !t.active ? '<span class="ks-badge off">Nonaktif</span>' : "",
        t.open_attempts > 0 ? `<span class="ks-badge live">${t.open_attempts} sedang tes</span>` : "",
      ].join("");
      return `<button type="button" class="ks-test${active ? " active" : ""}" data-kind="${escapeHtml(t.test_kind)}" data-ref="${escapeHtml(t.test_ref)}"><b>${escapeHtml(testTitle(t.test_kind, t.test_ref, t.label))}</b><small>${t.published_count} soal terbit</small><span class="ks-badges">${badges}</span></button>`;
    });
    return `<div class="ks-group"><div class="ks-group-title">${title}</div>${items.join("") || '<p class="muted">Belum ada.</p>'}</div>`;
  };
  listEl.innerHTML = group("bab", "Per 5 Bab") + group("paket", "Paket ujian");
}
listEl.addEventListener("click", (event) => {
  const button = event.target.closest(".ks-test");
  if (button) openTest(button.dataset.kind, button.dataset.ref);
});

function confirmLeaveDirty() {
  return !current || !current.dirty || window.confirm("Ada perubahan yang belum disimpan. Tinggalkan perubahan ini?");
}
async function openTest(kind, ref) {
  if (current && current.kind === kind && current.ref === ref) return;
  if (!confirmLeaveDirty()) return;
  editorEl.innerHTML = '<p class="muted">Memuat soal…</p>';
  const { data, error } = await supa.rpc("editor_load", { p_kind: kind, p_ref: ref });
  if (error) {
    editorEl.innerHTML = `<p class="login-error">Gagal memuat: ${escapeHtml(errorMessage(error))}</p>`;
    return;
  }
  const meta = tests.find((t) => t.test_kind === kind && t.test_ref === ref);
  current = {
    kind, ref,
    label: meta ? meta.label : ref,
    pkg: kind === "paket" ? { ...defaultPackage(meta ? meta.label : ref), ...(data.package || {}) } : null,
    questions: (data.questions || []).map(normalizeQuestion),
    base: data.updated_at || null,
    source: data.source,
    updatedBy: data.updated_by,
    dirty: false,
    openAttempts: data.open_attempts || 0,
    publishedCount: data.published_count || 0,
    tab: "soal",
    serverErrors: [],
  };
  expanded = new Set();
  filterText = "";
  renderTestList();
  renderEditor();
}

// ---------- Paket baru ----------
$("ksNewPackageForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const key = $("ksNewKey").value.trim();
  const label = $("ksNewLabel").value.trim();
  const errorEl = $("ksNewError");
  errorEl.hidden = true;
  if (!KEY_RE.test(key)) {
    errorEl.textContent = "Kode paket hanya boleh huruf kecil, angka, dan tanda minus (2–41 karakter).";
    errorEl.hidden = false;
    return;
  }
  if (tests.some((t) => t.test_kind === "paket" && t.test_ref === key)) {
    errorEl.textContent = "Kode paket ini sudah dipakai.";
    errorEl.hidden = false;
    return;
  }
  if (!label) return;
  if (!confirmLeaveDirty()) return;
  current = {
    kind: "paket", ref: key, label, pkg: defaultPackage(label), questions: [blankQuestion()],
    base: null, source: "new", updatedBy: null, dirty: true, openAttempts: 0, publishedCount: 0,
    tab: "paket", serverErrors: [],
  };
  expanded = new Set([0]);
  $("ksNewPackageForm").reset();
  $("ksNewPackage").open = false;
  renderTestList();
  renderEditor();
});

// ---------- Editor ----------
function statusText() {
  const pub = current.publishedCount ? `${current.publishedCount} soal terbit` : "belum pernah terbit";
  if (current.source === "draft") {
    const when = current.base ? new Date(current.base).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "";
    return `Draft belum terbit · disimpan ${escapeHtml(current.updatedBy || "Operator")} ${escapeHtml(when)} · ${pub}`;
  }
  if (current.source === "new") return `Paket baru · ${pub}`;
  return `Menampilkan isi yang sedang terbit · ${pub}`;
}
function renderEditor() {
  if (!current) return;
  const isPaket = current.kind === "paket";
  const tabs = [["soal", `Soal (${current.questions.length})`], ...(isPaket ? [["paket", "Pengaturan paket"]] : []), ["riwayat", "Riwayat versi"]];
  editorEl.innerHTML = `
    <header class="ks-editor-head">
      <div><div class="eyebrow">${isPaket ? `Paket · ${escapeHtml(current.ref)}` : "Per 5 Bab"}</div><h2 id="ksTitle"></h2><p class="ks-status" id="ksStatus">${statusText()}</p></div>
      <div class="ks-actions">
        <span class="ks-dirty" id="ksDirty" ${current.dirty ? "" : "hidden"}>● Belum disimpan</span>
        <button type="button" class="secondary" id="ksSave">💾 Simpan draft</button>
        <button type="button" class="primary" id="ksPublish">🚀 Terbitkan</button>
        <button type="button" class="ks-link danger" id="ksDiscard" ${current.source === "draft" ? "" : "hidden"}>Buang draft</button>
      </div>
    </header>
    ${current.openAttempts > 0 ? `<p class="ks-warning">⚠ ${current.openAttempts} siswa sedang mengerjakan tes ini. Draft tetap bisa disimpan, tapi baru bisa diterbitkan setelah tes mereka selesai.</p>` : ""}
    <div class="ks-feedback" id="ksFeedback" hidden></div>
    <nav class="ks-tabs">${tabs.map(([id, name]) => `<button type="button" data-tab="${id}" class="${current.tab === id ? "active" : ""}">${name}</button>`).join("")}</nav>
    <div id="ksTabBody"></div>`;
  $("ksTitle").textContent = testTitle(current.kind, current.ref, isPaket ? current.pkg.label : current.label);
  editorEl.querySelectorAll(".ks-tabs button").forEach((b) => (b.onclick = () => { current.tab = b.dataset.tab; renderEditor(); }));
  $("ksSave").onclick = saveDraft;
  $("ksPublish").onclick = publish;
  $("ksDiscard").onclick = discardDraft;
  if (current.serverErrors.length) showFeedback("error", "Belum bisa diterbitkan:", current.serverErrors);
  if (current.tab === "soal") renderQuestionsTab();
  else if (current.tab === "paket") renderPackageTab();
  else renderHistoryTab();
}
function markDirty() {
  if (!current.dirty) {
    current.dirty = true;
    const dirtyEl = $("ksDirty");
    if (dirtyEl) dirtyEl.hidden = false;
  }
}
function showFeedback(kind, title, items) {
  const box = $("ksFeedback");
  if (!box) return;
  box.hidden = false;
  box.className = `ks-feedback ${kind}`;
  box.innerHTML = `<b></b>${items && items.length ? "<ul></ul>" : ""}`;
  box.querySelector("b").textContent = title;
  const ul = box.querySelector("ul");
  (items || []).slice(0, 30).forEach((message) => {
    const li = document.createElement("li");
    li.textContent = message;
    const match = /^Soal (\d+):/.exec(message);
    if (match) {
      li.className = "ks-jump";
      li.title = "Buka soal ini";
      li.onclick = () => jumpToQuestion(Number(match[1]) - 1);
    }
    ul.appendChild(li);
  });
  if (items && items.length > 30) {
    const li = document.createElement("li");
    li.textContent = `…dan ${items.length - 30} lainnya.`;
    ul.appendChild(li);
  }
}
function jumpToQuestion(index) {
  current.tab = "soal";
  filterText = "";
  expanded.add(index);
  renderEditor();
  document.getElementById(`ksQ${index}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---------- Tab Soal ----------
function questionMatches(q) {
  if (!filterText) return true;
  const hay = [q.category, q.subcategory, q.instruction, q.html, q.material, ...q.options].join(" ").toLowerCase();
  return hay.includes(filterText.toLowerCase());
}
function renderQuestionsTab() {
  const body = $("ksTabBody");
  body.innerHTML = `
    <div class="ks-toolbar"><input type="search" id="ksFilter" placeholder="Cari soal (teks, kategori, pilihan)…"><button type="button" class="ks-link" id="ksExpandAll">Buka semua</button><button type="button" class="ks-link" id="ksCollapseAll">Tutup semua</button></div>
    <p class="ks-hint">HTML yang boleh dipakai: <code>${window.QUESTION_HTML_TAGS.join(" ")}</code> — atribut hanya <code>class</code>. Contoh: <code>&lt;u&gt;山&lt;/u&gt;</code>, <code>&lt;ruby&gt;漢&lt;rt&gt;かん&lt;/rt&gt;&lt;/ruby&gt;</code>.</p>
    <div id="ksQuestions" class="ks-questions"></div>
    <button type="button" class="secondary ks-add" id="ksAdd">+ Tambah soal</button>`;
  const filterEl = $("ksFilter");
  filterEl.value = filterText;
  filterEl.oninput = () => { filterText = filterEl.value; paintQuestions(); };
  $("ksExpandAll").onclick = () => { current.questions.forEach((_, i) => expanded.add(i)); paintQuestions(); };
  $("ksCollapseAll").onclick = () => { expanded.clear(); paintQuestions(); };
  $("ksAdd").onclick = () => {
    current.questions.push(blankQuestion());
    expanded.add(current.questions.length - 1);
    markDirty();
    filterText = "";
    renderEditor();
    $(`ksQ${current.questions.length - 1}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  paintQuestions();
}
function field(label, name, value, { textarea = false, rows = 2, hint = "", placeholder = "" } = {}) {
  const wrap = document.createElement("label");
  wrap.className = "ks-field";
  wrap.append(document.createTextNode(label));
  if (hint) {
    const small = document.createElement("small");
    small.textContent = hint;
    wrap.appendChild(small);
  }
  const input = document.createElement(textarea ? "textarea" : "input");
  if (textarea) input.rows = rows;
  input.dataset.field = name;
  input.value = value ?? "";
  if (placeholder) input.placeholder = placeholder;
  wrap.appendChild(input);
  return wrap;
}
function questionSummary(q) {
  const tmp = document.createElement("div");
  tmp.innerHTML = window.sanitizeQuestionHtml(q.html);
  const text = tmp.textContent.replace(/\s+/g, " ").trim();
  return text.length > 70 ? `${text.slice(0, 70)}…` : text || "(teks soal kosong)";
}
function paintQuestions() {
  const container = $("ksQuestions");
  if (!container) return;
  container.replaceChildren();
  current.questions.forEach((q, i) => {
    if (!questionMatches(q)) return;
    const errs = validateQuestion(q);
    const card = document.createElement("article");
    card.className = `ks-q${errs.length ? " has-error" : ""}${expanded.has(i) ? " open" : ""}`;
    card.id = `ksQ${i}`;
    card.dataset.index = String(i);

    const head = document.createElement("header");
    head.className = "ks-q-head";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "ks-q-toggle";
    toggle.innerHTML = '<span class="ks-q-num"></span><span class="ks-q-cat"></span><span class="ks-q-sum"></span><span class="ks-q-err"></span>';
    toggle.querySelector(".ks-q-num").textContent = `${i + 1}`;
    toggle.querySelector(".ks-q-cat").textContent = q.category || "Tanpa kategori";
    toggle.querySelector(".ks-q-sum").textContent = questionSummary(q);
    toggle.querySelector(".ks-q-err").textContent = errs.length ? `⚠ ${errs.length}` : "";
    toggle.onclick = () => {
      if (expanded.has(i)) expanded.delete(i);
      else expanded.add(i);
      paintQuestions();
    };
    const tools = document.createElement("span");
    tools.className = "ks-q-tools";
    [["↑", "up", "Pindah ke atas"], ["↓", "down", "Pindah ke bawah"], ["⧉", "copy", "Duplikat"], ["🗑", "delete", "Hapus soal"]].forEach(([icon, action, title]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = icon;
      b.title = title;
      b.setAttribute("aria-label", `${title} ${i + 1}`);
      b.dataset.action = action;
      tools.appendChild(b);
    });
    head.append(toggle, tools);
    card.appendChild(head);

    if (expanded.has(i)) {
      const bodyEl = document.createElement("div");
      bodyEl.className = "ks-q-body";
      const form = document.createElement("div");
      form.className = "ks-q-form";
      const row = document.createElement("div");
      row.className = "ks-row";
      row.append(field("Kategori", "category", q.category, { placeholder: "mis. Kosakata" }));
      if (current.kind === "paket") row.append(field("Subkategori", "subcategory", q.subcategory, { hint: "nama もんだい (opsional)" }));
      form.append(
        row,
        field("Instruksi", "instruction", q.instruction, { textarea: true }),
        field("Teks soal (HTML)", "html", q.html, { textarea: true, rows: 3 }),
      );
      const optionsWrap = document.createElement("div");
      optionsWrap.className = "ks-options";
      const optTitle = document.createElement("div");
      optTitle.className = "ks-options-title";
      optTitle.textContent = "Pilihan jawaban — bulatan = kunci jawaban";
      optionsWrap.appendChild(optTitle);
      q.options.forEach((opt, oi) => {
        const line = document.createElement("div");
        line.className = "ks-option";
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `ksAnswer${i}`;
        radio.dataset.answer = String(oi);
        radio.checked = q.answer === oi;
        radio.setAttribute("aria-label", `Jadikan pilihan ${oi + 1} kunci jawaban`);
        const input = document.createElement("input");
        input.dataset.option = String(oi);
        input.value = opt;
        input.placeholder = `Pilihan ${oi + 1}`;
        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "✕";
        remove.title = "Hapus pilihan";
        remove.dataset.action = "remove-option";
        remove.dataset.option = String(oi);
        remove.disabled = q.options.length <= 2;
        line.append(radio, input, remove);
        optionsWrap.appendChild(line);
      });
      const addOpt = document.createElement("button");
      addOpt.type = "button";
      addOpt.className = "ks-link";
      addOpt.textContent = "+ Tambah pilihan";
      addOpt.dataset.action = "add-option";
      addOpt.disabled = q.options.length >= 6;
      optionsWrap.appendChild(addOpt);
      form.appendChild(optionsWrap);
      form.append(
        field("Pembahasan (HTML)", "explanation", q.explanation, { textarea: true, hint: "ditampilkan ke siswa hanya kalau jawabannya salah" }),
        field("Label materi", "material", q.material, { placeholder: "mis. Bab 3 · Kata tunjuk" }),
      );
      const media = document.createElement("div");
      media.className = "ks-row";
      if (current.kind === "paket") {
        media.append(
          field("Gambar", "image", q.image, { placeholder: "assets/images/…webp" }),
          field("Audio", "audio_src", q.audio_src, { placeholder: "assets/audio/…mp3" }),
        );
      }
      media.append(field("Id hafalan (opsional)", "srs_id", q.srs_id, { placeholder: "mis. kanji:山" }));
      form.appendChild(media);

      const side = document.createElement("div");
      side.className = "ks-q-side";
      const errList = document.createElement("ul");
      errList.className = "ks-q-errors";
      const previewTitle = document.createElement("div");
      previewTitle.className = "ks-preview-title";
      previewTitle.textContent = "Pratinjau tampilan siswa";
      const preview = document.createElement("div");
      preview.className = "ks-preview";
      side.append(errList, previewTitle, preview);
      bodyEl.append(form, side);
      card.appendChild(bodyEl);
      updateCardSide(card, q);
    }
    container.appendChild(card);
  });
  if (!container.children.length) container.innerHTML = '<p class="muted">Tidak ada soal yang cocok dengan pencarian.</p>';
}
function updateCardSide(card, q) {
  const errs = validateQuestion(q);
  card.classList.toggle("has-error", errs.length > 0);
  const errBadge = card.querySelector(".ks-q-err");
  if (errBadge) errBadge.textContent = errs.length ? `⚠ ${errs.length}` : "";
  const sum = card.querySelector(".ks-q-sum");
  if (sum) sum.textContent = questionSummary(q);
  const cat = card.querySelector(".ks-q-cat");
  if (cat) cat.textContent = q.category || "Tanpa kategori";
  const errList = card.querySelector(".ks-q-errors");
  if (errList) {
    errList.replaceChildren(...errs.map((m) => Object.assign(document.createElement("li"), { textContent: m })));
  }
  const preview = card.querySelector(".ks-preview");
  if (!preview) return;
  preview.innerHTML = `<p class="ks-pv-instruction"></p>${q.image ? '<img class="ks-pv-image" alt="Gambar soal">' : ""}<div class="ks-pv-question"></div><ol class="ks-pv-options"></ol>`;
  preview.querySelector(".ks-pv-instruction").innerHTML = window.sanitizeQuestionHtml(q.instruction);
  preview.querySelector(".ks-pv-question").innerHTML = window.sanitizeQuestionHtml(q.html);
  const img = preview.querySelector(".ks-pv-image");
  if (img && IMAGE_RE.test(q.image)) img.src = `../${q.image}`;
  else if (img) img.remove();
  const ol = preview.querySelector(".ks-pv-options");
  q.options.forEach((opt, oi) => {
    const li = document.createElement("li");
    li.textContent = opt || "…";
    if (q.answer === oi) li.className = "correct";
    ol.appendChild(li);
  });
}
editorEl.addEventListener("input", (event) => {
  if (!current || current.tab === "riwayat") return;
  const target = event.target;
  if (current.tab === "paket" && target.dataset.pkg) {
    const key = target.dataset.pkg;
    let value = target.type === "checkbox" ? target.checked : target.value;
    if (key === "time_limit_minutes" || key === "position") value = target.value === "" ? null : Number(target.value);
    current.pkg[key] = value;
    if (key === "label") $("ksTitle").textContent = value || current.ref;
    markDirty();
    paintPackageErrors();
    return;
  }
  const card = target.closest(".ks-q");
  if (!card) return;
  const q = current.questions[Number(card.dataset.index)];
  if (target.dataset.field) q[target.dataset.field] = target.value;
  else if (target.dataset.option) q.options[Number(target.dataset.option)] = target.value;
  else return;
  markDirty();
  updateCardSide(card, q);
});
editorEl.addEventListener("change", (event) => {
  const target = event.target;
  if (!current || !target.dataset.answer) return;
  const card = target.closest(".ks-q");
  const q = current.questions[Number(card.dataset.index)];
  q.answer = Number(target.dataset.answer);
  markDirty();
  updateCardSide(card, q);
});
editorEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button || !current) return;
  const card = button.closest(".ks-q");
  if (!card) return;
  const i = Number(card.dataset.index);
  const qs = current.questions;
  const q = qs[i];
  const action = button.dataset.action;
  if (action === "up" && i > 0) {
    [qs[i - 1], qs[i]] = [qs[i], qs[i - 1]];
    swapExpanded(i - 1, i);
  } else if (action === "down" && i < qs.length - 1) {
    [qs[i + 1], qs[i]] = [qs[i], qs[i + 1]];
    swapExpanded(i, i + 1);
  } else if (action === "copy") {
    qs.splice(i + 1, 0, JSON.parse(JSON.stringify(q)));
    shiftExpanded(i + 1, 1);
    expanded.add(i + 1);
  } else if (action === "delete") {
    if (!window.confirm(`Hapus soal ${i + 1}? (Bisa dibatalkan dengan "Buang draft" atau Riwayat versi.)`)) return;
    qs.splice(i, 1);
    expanded.delete(i);
    shiftExpanded(i + 1, -1);
  } else if (action === "add-option" && q.options.length < 6) {
    q.options.push("");
  } else if (action === "remove-option" && q.options.length > 2) {
    const oi = Number(button.dataset.option);
    q.options.splice(oi, 1);
    if (q.answer === oi) q.answer = null;
    else if (q.answer > oi) q.answer -= 1;
  } else {
    return;
  }
  markDirty();
  if (action === "delete" || action === "copy") renderEditor();
  else paintQuestions();
});
function swapExpanded(a, b) {
  const hasA = expanded.has(a);
  const hasB = expanded.has(b);
  expanded.delete(a);
  expanded.delete(b);
  if (hasA) expanded.add(b);
  if (hasB) expanded.add(a);
}
function shiftExpanded(from, delta) {
  const next = new Set();
  expanded.forEach((i) => next.add(i >= from ? i + delta : i));
  expanded = next;
}

// ---------- Tab Pengaturan paket ----------
function renderPackageTab() {
  const body = $("ksTabBody");
  const p = current.pkg;
  body.innerHTML = `
    <div class="ks-package">
      <label class="ks-field">Nama paket<input data-pkg="label" maxlength="120"></label>
      <div class="ks-row">
        <label class="ks-field">Kode singkat<small>tampil di kartu, mis. N5·B</small><input data-pkg="mark" maxlength="12"></label>
        <label class="ks-field">Batas waktu (menit)<input data-pkg="time_limit_minutes" type="number" min="5" max="240"></label>
        <label class="ks-field">Urutan<small>kecil tampil lebih dulu</small><input data-pkg="position" type="number"></label>
      </div>
      <label class="ks-field">Deskripsi<textarea data-pkg="description" rows="3" maxlength="500"></textarea></label>
      <label class="ks-check"><input type="checkbox" data-pkg="one_page"> Tampilkan semua soal dalam satu halaman (format simulasi JLPT)</label>
      <label class="ks-check"><input type="checkbox" data-pkg="active"> Aktif — bisa dipilih Sensei di Pantau Siswa (akses yang sudah diberikan tetap berlaku walau nonaktif)</label>
      <ul class="ks-q-errors" id="ksPkgErrors"></ul>
    </div>`;
  body.querySelectorAll("[data-pkg]").forEach((input) => {
    const value = p[input.dataset.pkg];
    if (input.type === "checkbox") input.checked = !!value;
    else input.value = value ?? "";
  });
  paintPackageErrors();
}
function paintPackageErrors() {
  const ul = $("ksPkgErrors");
  if (ul) ul.replaceChildren(...validatePackage(current.pkg).map((m) => Object.assign(document.createElement("li"), { textContent: m })));
}

// ---------- Tab Riwayat ----------
async function renderHistoryTab() {
  const body = $("ksTabBody");
  body.innerHTML = '<p class="muted">Memuat riwayat…</p>';
  const { data, error } = await supa.rpc("list_content_versions", { p_kind: current.kind, p_ref: current.ref });
  if (current.tab !== "riwayat") return;
  if (error) {
    body.innerHTML = `<p class="login-error">Gagal memuat riwayat: ${escapeHtml(errorMessage(error))}</p>`;
    return;
  }
  if (!data || !data.length) {
    body.innerHTML = '<p class="muted">Belum ada versi tersimpan. Versi lama disimpan otomatis setiap kali tes ini diterbitkan atau dipulihkan.</p>';
    return;
  }
  body.innerHTML = '<p class="ks-hint">Isi soal disimpan otomatis sebelum setiap penerbitan. Memulihkan sebuah versi langsung mengganti isi yang terbit (isi saat ini disimpan dulu, jadi bisa dibatalkan) dan membuang draft tes ini.</p><ol class="ks-versions" id="ksVersions"></ol>';
  const list = $("ksVersions");
  data.forEach((v) => {
    const li = document.createElement("li");
    const info = document.createElement("div");
    const title = document.createElement("b");
    title.textContent = new Date(v.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
    const detail = document.createElement("small");
    detail.textContent = `#${v.id} · ${v.reason} · ${v.question_count} soal · oleh ${v.created_by_name}`;
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
  if (!window.confirm(`Pulihkan versi #${v.id} (${v.question_count} soal)? Isi yang sedang terbit akan diganti dan draft tes ini dibuang.`)) return;
  const { error } = await supa.rpc("restore_test_content", { p_version_id: v.id });
  if (error) {
    showFeedback("error", `Gagal memulihkan: ${errorMessage(error)}`);
    return;
  }
  await reloadCurrent("riwayat");
  showFeedback("success", `Versi #${v.id} dipulihkan dan sudah terbit.`);
}

// ---------- Simpan, terbitkan, buang ----------
async function saveDraft() {
  if (!current) return false;
  const button = $("ksSave");
  button.disabled = true;
  const label = button.textContent;
  button.textContent = "Menyimpan…";
  const { data, error } = await supa.rpc("editor_save_draft", {
    p_kind: current.kind,
    p_ref: current.ref,
    p_package: current.kind === "paket" ? current.pkg : null,
    p_questions: current.questions,
    p_base_updated_at: current.base,
  });
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
  $("ksDirty").hidden = true;
  $("ksDiscard").hidden = false;
  $("ksStatus").innerHTML = statusText();
  const errs = allErrors();
  showFeedback(errs.length ? "warning" : "success",
    errs.length ? `Draft tersimpan. Masih ada ${errs.length} hal yang perlu diperbaiki sebelum bisa diterbitkan:` : "Draft tersimpan dan siap diterbitkan.",
    errs.map((e) => e.message));
  loadTests();
  return true;
}
async function publish() {
  if (!current) return;
  const errs = allErrors();
  if (errs.length) {
    showFeedback("error", "Perbaiki dulu sebelum diterbitkan:", errs.map((e) => e.message));
    return;
  }
  if (current.dirty || current.source !== "draft") {
    if (!(await saveDraft())) return;
  }
  if (!window.confirm(`Terbitkan ${current.questions.length} soal? Siswa langsung mendapat versi ini untuk tes berikutnya.`)) return;
  const button = $("ksPublish");
  button.disabled = true;
  const { data, error } = await supa.rpc("editor_publish", { p_kind: current.kind, p_ref: current.ref, p_base_updated_at: current.base });
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
  await reloadCurrent("soal");
  showFeedback("success", "Berhasil diterbitkan. Versi sebelumnya tersimpan di tab Riwayat versi.");
}
async function discardDraft() {
  if (!current || !window.confirm("Buang draft ini dan kembali ke isi yang sedang terbit?")) return;
  const { error } = await supa.rpc("editor_discard_draft", { p_kind: current.kind, p_ref: current.ref });
  if (error) {
    showFeedback("error", `Gagal membuang draft: ${errorMessage(error)}`);
    return;
  }
  current.dirty = false;
  await reloadCurrent("soal");
  showFeedback("success", "Draft dibuang.");
}
async function reloadCurrent(tab) {
  const { kind, ref } = current;
  current = null;
  await loadTests();
  await openTest(kind, ref);
  if (current && tab && current.tab !== tab) {
    current.tab = tab;
    renderEditor();
  }
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
      current.dirty = false; // jangan memicu peringatan "tinggalkan halaman"
    }
  });
}

loadTests();
}
window.initPage = initPage;
