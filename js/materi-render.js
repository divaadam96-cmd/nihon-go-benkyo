/* Render HTML satu pelajaran "Keterangan Tata Bahasa" dari data
   (data/materi-grammar-data.js, atau isi suntingan Operator lewat
   js/konten-bab.js). Dipakai halaman Materi dan pratinjau Kelola Materi.

   Teks berisi HTML terbatas (br, u, sub, i, span class=...). Isi bawaan
   ditulis di repo; isi suntingan sudah divalidasi server dengan allowlist
   is_safe_question_html dan disaring ulang di browser (konten-bab.js).

   Setiap pola diberi data-pola = nomor urut ASLI-nya (0, 1, 2, ...). Progres
   siswa disimpan per nomor itu (materi:book{N}:{pelajaran}:{pola}), jadi pola
   yang disembunyikan Operator (hidden) tidak dirender tetapi nomor pola
   sesudahnya tetap sama. */
function escapeAttr(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
const MATERI_FIGURE_SRC = /^assets\/images\/materi\/[A-Za-z0-9_-]+\.(webp|png|jpe?g)$/;

function buildGrammarPointHtml(item, i, { imageRoot = "../" } = {}) {
  const renderExample = ([contoh, arti]) =>
    `<div class="grammar-example"><span class="grammar-jp">${contoh}</span><span class="grammar-meaning">${arti}</span></div>`;
  const renderTable = (table) =>
    `<table class="grammar-table"><thead><tr><th></th>${table.headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${table.rows.map((row) => `<tr>${row.map((cell, k) => `<${k === 0 ? "th" : "td"}>${cell}</${k === 0 ? "th" : "td"}>`).join("")}</tr>`).join("")}</tbody></table>`;
  const renderFigure = (figure) =>
    MATERI_FIGURE_SRC.test(figure.src || "")
      ? `<figure class="grammar-figure"><img src="${imageRoot}${figure.src}" alt="${escapeAttr(figure.alt || "")}" loading="lazy"></figure>`
      : "";
  const renderBlock = (b) =>
    `<div class="grammar-block">${b.label ? `<p class="grammar-subhead">${b.label}</p>` : ""}${b.text ? `<p>${b.text}</p>` : ""}${b.figure ? renderFigure(b.figure) : ""}${b.table ? renderTable(b.table) : ""}${(b.examples || []).map(renderExample).join("")}${b.note ? `<p class="grammar-important-note">${b.note}</p>` : ""}</div>`;
  const heading = `<h3><span class="grammar-pola-number">${i + 1}. </span><span class="${item.noBox ? "grammar-pola-plain" : "grammar-pola-box"}">${item.title}</span>${item.suffix ? `<span class="grammar-pola-suffix"> ${item.suffix}</span>` : ""}</h3>`;
  return `<div class="grammar-point" data-pola="${i}">${heading}${item.blocks.map(renderBlock).join("")}</div>`;
}

function buildLessonHtml(number, title, items) {
  /* Bentuk item pola: lihat komentar di atas data/materi-grammar-data.js. */
  const points = items.map((item, i) => (item.hidden ? "" : buildGrammarPointHtml(item, i))).join("");
  return `<details class="html-lesson"><summary><span class="lesson-number">${number}</span>Pelajaran ${number}: ${escapeAttr(title)}</summary><div class="html-content" data-bab="${number}">${points}</div></details>`;
}

/* Nomor pola (data-pola) yang tampil di sebuah elemen pelajaran - dipakai
   untuk status "sudah paham" per pelajaran (srsLessonStatus). */
function grammarPatternIndexes(container) {
  return container
    ? Array.from(container.querySelectorAll(".grammar-point"), (point, i) => Number(point.dataset.pola ?? i))
    : [];
}
