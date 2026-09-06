/* Efek visual & pembersihan tampilan materi yang mandiri (tidak butuh
   variabel/state lain dari initApp()) - dipanggil dari app.js persis
   di titik yang sama seperti sebelumnya, cuma dipindah ke file
   terpisah supaya app.js tidak makin panjang. */

function initSakuraPetals() {
  const layer = document.createElement("div");
  layer.className = "sakura-layer";
  layer.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 6; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = "🌸";
    const duration = 18 + Math.random() * 12;
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.fontSize = 9 + Math.random() * 7 + "px";
    petal.style.animationDuration = duration + "s";
    petal.style.animationDelay = Math.random() * -duration + "s";
    petal.style.setProperty("--drift", Math.random() * 80 - 40 + "px");
    layer.appendChild(petal);
  }
  document.body.appendChild(layer);
}

/* Hilangkan blok tambahan yang tidak diperlukan dari seluruh materi. */
function simplifyLessonMaterials() {
  const removableLabels = ["fokus pelajaran", "fokus pembelajaran", "latihan mandiri"];
  document
    .querySelectorAll("#materials .html-content, #book2 .html-content")
    .forEach((content) => {
      content.querySelectorAll(".html-note > div").forEach((note) => {
        const label = note.querySelector("b")?.textContent.trim().toLowerCase();
        if (label && removableLabels.some((target) => label.startsWith(target)))
          note.remove();
      });
      content.querySelectorAll(".grammar-point").forEach((section) => {
        const heading = section.querySelector("h3")?.textContent.trim().toLowerCase();
        if (
          heading === "ringkasan praktik" ||
          heading === "ringkasan perubahan bentuk kalimat" ||
          heading === "dialog latihan" ||
          heading === "dialog contoh"
        )
          section.remove();
      });
      content.querySelectorAll(".html-note:empty").forEach((emptyNote) => emptyNote.remove());
    });
}

/* Ucapkan teks lewat Web Speech API - dipakai tombol audio penjelasan
   pola grammar (structureGrammarPoints). Sama seperti speak() di
   prototype-tes-v2.js: browser lama tanpa dukungan speechSynthesis
   cukup diabaikan (tombol tetap ada tapi tidak bersuara), bukan error. */
function speakText(text, lang) {
  if (!("speechSynthesis" in window) || !text) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = lang === "ja-JP" ? 0.82 : 0.95;
  speechSynthesis.speak(utterance);
}

function createAudioButton(getText, lang) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "grammar-audio-button";
  button.setAttribute("aria-label", "Dengarkan penjelasan");
  button.title = "Dengarkan penjelasan";
  button.textContent = "🔊";
  button.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    speakText(getText(), lang);
  };
  return button;
}

/* Susun setiap pola: penjelasan, contoh Jepang, arti, lalu catatan bila
   perlu - dan sisipkan tombol audio di PENJELASAN (bahasa Indonesia,
   bukan contoh kalimat Jepang-nya) supaya siswa bisa mendengarkan arti
   & kegunaan pola itu, bukan cuma membacanya. Teks penjelasan diambil
   SETELAH kalimat penting (kalau ada) dipisah ke catatan tersendiri di
   bawah, supaya audio persis sama dengan yang tampil di layar. */
function structureGrammarPoints() {
  const importantPattern =
    /\b(jangan|tidak boleh|tidak dipakai|tidak digunakan|berbeda|perhatikan|khusus|wajib|umumnya|hindari|harus)\b/i;
  document
    .querySelectorAll(
      "#materials .html-content .grammar-point, #book2 .html-content .grammar-point",
    )
    .forEach((point) => {
      if (point.classList.contains("lesson-quiz")) return;
      const explanation = point.querySelector(":scope > p");
      const example = point.querySelector(":scope > .grammar-example");
      const meaning = example?.querySelector(".grammar-meaning");
      if (explanation) explanation.classList.add("grammar-short-explanation");
      if (example) example.classList.add("grammar-japanese-example");
      if (meaning) meaning.classList.add("grammar-indonesian-meaning");

      if (explanation && !point.querySelector(".grammar-important-note")) {
        const sentences = explanation.textContent
          .trim()
          .split(/(?<=[.!?。])\s+/)
          .filter(Boolean);
        const importantIndex =
          sentences.length >= 2
            ? sentences.findIndex((sentence) => importantPattern.test(sentence))
            : -1;
        if (importantIndex >= 0) {
          const importantSentence = sentences.splice(importantIndex, 1)[0];
          explanation.textContent = sentences.join(" ");
          const note = document.createElement("aside");
          note.className = "grammar-important-note";
          note.textContent = importantSentence;
          if (example) example.insertAdjacentElement("afterend", note);
          else explanation.insertAdjacentElement("afterend", note);
        }
      }

      if (explanation && !explanation.querySelector(".grammar-audio-button")) {
        const explanationText = explanation.textContent.trim();
        explanation.appendChild(createAudioButton(() => explanationText, "id-ID"));
      }
    });
}
