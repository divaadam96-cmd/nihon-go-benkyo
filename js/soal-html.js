/* Aturan HTML soal Tes Kemampuan - dipakai halaman Tes Kemampuan (render
   soal untuk siswa) dan Kelola Soal (pratinjau & cek sebelum disimpan).
   Server memakai aturan yang SAMA di is_safe_question_html()
   (supabase/add-editor-soal.sql) dan menolak menerbitkan HTML di luar
   aturan ini; penyaring di browser adalah lapisan kedua. */
(function () {
  const ALLOWED_TAGS = [
    "b", "strong", "i", "em", "u", "br", "small", "span", "div", "p", "ruby", "rt", "rp",
    "sub", "sup", "blockquote", "table", "caption", "thead", "tbody", "tr", "th", "td", "ul", "ol", "li",
  ];
  const SAFE_TAGS = new Set(ALLOWED_TAGS.map((tag) => tag.toUpperCase()));
  const DROP_TAGS = new Set([
    "SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "TEMPLATE", "NOSCRIPT", "SVG", "MATH", "LINK", "META", "BASE", "FORM",
  ]);
  const TAG_PATTERN = new RegExp(`^</?(${ALLOWED_TAGS.join("|")})(\\s+class="[A-Za-z0-9 _-]*")?\\s*/?>$`, "i");

  /* Saring HTML sebelum masuk innerHTML: tag di luar daftar dibuang
     (isinya dipertahankan, kecuali tag berbahaya yang dibuang seluruhnya),
     atribut selain class dihapus. */
  function sanitizeQuestionHtml(html) {
    const template = document.createElement("template");
    template.innerHTML = html == null ? "" : String(html);
    const clean = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.COMMENT_NODE) {
          child.remove();
          return;
        }
        if (child.nodeType !== Node.ELEMENT_NODE) return;
        if (DROP_TAGS.has(child.tagName)) {
          child.remove();
          return;
        }
        clean(child);
        if (!SAFE_TAGS.has(child.tagName)) {
          child.replaceWith(...child.childNodes);
          return;
        }
        Array.from(child.attributes).forEach((attr) => {
          if (attr.name !== "class") child.removeAttribute(attr.name);
        });
      });
    };
    clean(template.content);
    return template.innerHTML;
  }

  /* Cek ketat yang sama dengan server: setiap tag harus di daftar, atribut
     hanya class, dan setiap "<" harus awal tag yang sah (teks "<" = &lt;). */
  function isSafeQuestionHtml(html) {
    if (!html) return true;
    const tags = html.match(/<[^<>]*>/g) || [];
    const lessThan = (html.match(/</g) || []).length;
    return tags.every((tag) => TAG_PATTERN.test(tag)) && tags.length === lessThan;
  }

  window.sanitizeQuestionHtml = sanitizeQuestionHtml;
  window.isSafeQuestionHtml = isSafeQuestionHtml;
  window.QUESTION_HTML_TAGS = ALLOWED_TAGS;
})();
