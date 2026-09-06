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

/* Ucapkan teks bahasa Jepang lewat Web Speech API - dipakai tombol audio
   di setiap pola grammar (structureGrammarPoints) dan di kartu "Pelajari
   contoh" (buildExampleStudy, app.js). Sama seperti speak() di
   prototype-tes-v2.js: browser lama tanpa dukungan speechSynthesis
   cukup diabaikan (tombol tetap ada tapi tidak bersuara), bukan error. */
function speakJapaneseText(text) {
  if (!("speechSynthesis" in window) || !text) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.82;
  speechSynthesis.speak(utterance);
}

/* Ambil teks Jepang bersih dari sebuah elemen contoh (buang arti
   Indonesia yang menempel di dalamnya, tombol audio itu sendiri, dan
   furigana <rt> supaya tidak terbaca dua kali). */
function extractJapaneseText(element) {
  const clone = element.cloneNode(true);
  clone.querySelectorAll(".grammar-meaning, .grammar-audio-button, rt").forEach((el) => el.remove());
  return clone.textContent.trim();
}

function createAudioButton(getText) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "grammar-audio-button";
  button.setAttribute("aria-label", "Dengarkan pengucapan");
  button.title = "Dengarkan pengucapan";
  button.textContent = "🔊";
  button.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    speakJapaneseText(getText());
  };
  return button;
}

/* Susun setiap pola: penjelasan, contoh Jepang, arti, lalu catatan bila perlu. */
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
      if (example && !example.querySelector(".grammar-audio-button")) {
        const audioButton = createAudioButton(() => extractJapaneseText(example));
        if (meaning) example.insertBefore(audioButton, meaning);
        else example.appendChild(audioButton);
      }

      if (!explanation || point.querySelector(".grammar-important-note")) return;
      const sentences = explanation.textContent
        .trim()
        .split(/(?<=[.!?。])\s+/)
        .filter(Boolean);
      if (sentences.length < 2) return;
      const importantIndex = sentences.findIndex((sentence) =>
        importantPattern.test(sentence),
      );
      if (importantIndex < 0) return;

      const importantSentence = sentences.splice(importantIndex, 1)[0];
      explanation.textContent = sentences.join(" ");
      const note = document.createElement("aside");
      note.className = "grammar-important-note";
      note.textContent = importantSentence;
      if (example) example.insertAdjacentElement("afterend", note);
      else explanation.insertAdjacentElement("afterend", note);
    });
}
