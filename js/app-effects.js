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
   js/pages/latihan.js: browser lama tanpa dukungan speechSynthesis
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

/* Warnai border kiri .grammar-point sesuai status SRS pola itu - bahasa
   visual yang sama dengan .status-dot/.material-choice done|repeat di
   picker pelajaran (hijau #2e8068 / amber #b56c38), supaya siswa lihat
   sekilas pola mana yang sudah kuat & mana yang masih perlu diulang. */
function refreshPatternStatus(point, patternId) {
  const item = srsGet(patternId);
  const due = item.reviews > 0 && srsIsDue(patternId);
  point.classList.toggle("grammar-point-done", item.reviews > 0 && !due);
  point.classList.toggle("grammar-point-repeat", due);
}

/* Dua tombol rating kecil per pola ("✓ Paham" / "↻ Ulangi") - beda dari
   tombol bar bawah reader yang menandai SATU PELAJARAN sekaligus, ini
   menyimpan status per-pola (materi:book{N}:{lessonIndex}:{patternIndex})
   supaya penguasaan tidak lagi all-or-nothing per pelajaran. */
function createRatingControls(patternId, point, book) {
  const wrap = document.createElement("span");
  wrap.className = "grammar-rating";
  const repeatButton = document.createElement("button");
  repeatButton.type = "button";
  repeatButton.className = "grammar-rating-btn grammar-rating-repeat";
  repeatButton.title = "Tandai perlu diulang";
  repeatButton.setAttribute("aria-label", "Tandai pola ini perlu diulang");
  repeatButton.textContent = "↻";
  const goodButton = document.createElement("button");
  goodButton.type = "button";
  goodButton.className = "grammar-rating-btn grammar-rating-good";
  goodButton.title = "Tandai sudah paham";
  goodButton.setAttribute("aria-label", "Tandai pola ini sudah paham");
  goodButton.textContent = "✓";
  const rate = (outcome) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    srsReview(patternId, outcome);
    refreshPatternStatus(point, patternId);
    window.materialProgressRefreshers?.[book]?.();
    if (typeof syncCurriculumDashboard === "function") syncCurriculumDashboard();
  };
  repeatButton.onclick = rate("again");
  goodButton.onclick = rate("good");
  wrap.append(repeatButton, goodButton);
  return wrap;
}

/* Susun setiap pola: penjelasan, contoh Jepang, arti, lalu catatan bila
   ada - dan sisipkan tombol audio + rating di PENJELASAN (bahasa
   Indonesia, bukan contoh kalimat Jepang-nya) supaya siswa bisa
   mendengarkan arti & kegunaan pola itu, dan menilai penguasaannya
   satu per satu (bukan lagi satu status untuk seluruh pelajaran).
   Catatan "[Perhatian]" TIDAK LAGI ditebak otomatis dari kata kunci di
   penjelasan (pernah begitu, tapi heuristiknya bisa salah mencabut
   kalimat yang justru bagian dari penjelasan asli buku sumber - mis.
   "...tidak dipakai untuk marga atau nama si pembicara sendiri" di
   Pelajaran 1 pola 6 ikut ke-splice padahal itu bukan catatan
   [Perhatian] di buku). Sekarang catatan HANYA muncul kalau memang
   ditulis eksplisit di data (field `note`, lihat materi-grammar-data.js)
   - persis meniru buku sumber, bukan dugaan mesin.
   Diiterasi PER PELAJARAN (bukan flat semua .grammar-point) supaya tiap
   pola tahu book/lessonIndex/patternIndex-nya untuk id SRS. */
function structureGrammarPoints() {
  [
    { selector: "#materials .html-course > .html-lesson", book: 1 },
    { selector: "#book2 .html-course > .html-lesson", book: 2 },
  ].forEach(({ selector, book }) => {
    document.querySelectorAll(selector).forEach((lesson, lessonIndex) => {
      const points = Array.from(lesson.querySelectorAll(".grammar-point")).filter(
        (point) => !point.classList.contains("lesson-quiz"),
      );
      points.forEach((point, patternIndex) => {
        /* Satu pola bisa punya beberapa .grammar-block (sub-penjelasan 1)/2)/3)
           dari buku sumber, mis. Pelajaran 1) - proses SETIAP blok, bukan cuma
           yang pertama, supaya tiap sub-penjelasan dapat tombol audionya
           sendiri dan setiap contoh kalimat (bukan cuma yang pertama) dapat
           furigana lewat class grammar-japanese-example. */
        point.querySelectorAll(":scope > .grammar-block").forEach((block) => {
          const explanation = block.querySelector(":scope > p:not(.grammar-subhead)");
          const examples = Array.from(block.querySelectorAll(":scope > .grammar-example"));
          explanation?.classList.add("grammar-short-explanation");
          examples.forEach((example) => {
            example.classList.add("grammar-japanese-example");
            example.querySelector(".grammar-meaning")?.classList.add("grammar-indonesian-meaning");
          });

          if (explanation && !explanation.querySelector(".grammar-audio-button")) {
            const explanationText = explanation.textContent.trim();
            explanation.appendChild(createAudioButton(() => explanationText, "id-ID"));
          }
        });

        const patternId = `materi:book${book}:${lessonIndex}:${patternIndex}`;
        if (!point.querySelector(".grammar-rating")) {
          point.appendChild(createRatingControls(patternId, point, book));
        }
        refreshPatternStatus(point, patternId);
      });
    });
  });
}
