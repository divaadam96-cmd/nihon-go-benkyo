const fallbackBookOne = [
  "Kalimat nominal dasar", "Kata tunjuk", "Tempat dan arah", "Waktu dan kegiatan", "Perjalanan",
  "Memberi dan menerima", "Alat dan bahasa", "Kata sifat", "Kesukaan dan kemampuan", "Keberadaan",
  "Jumlah dan durasi", "Perbandingan", "Keinginan dan tujuan", "Permintaan", "Izin dan larangan",
  "Urutan kegiatan", "Bentuk negatif", "Kemampuan", "Pengalaman", "Bentuk biasa", "Pendapat",
  "Keterangan benda", "Waktu bersyarat", "Memberi bantuan", "Bentuk lampau",
];

const fallbackBookTwo = Array.from(
  { length: 25 },
  (_, index) => `Materi menengah Pelajaran ${index + 26}`,
);

const lessonGrid = document.getElementById("lessonGrid");
const sourceFrame = document.getElementById("sourceApp");
let sourceReady = false;
let currentBook = 1;
let currentLessonIndex = 0;
let currentPatterns = [];
let currentPatternIndex = 0;

function sourceRoot(book = currentBook) {
  return sourceFrame.contentDocument?.querySelector(book === 1 ? "#materials" : "#book2");
}

function cleanLessonTitle(text, number) {
  return text
    .replace(new RegExp(`^Pelajaran\\s+${number}\\s*[:·-]?\\s*`, "i"), "")
    .trim();
}

function sourceLessonNames(book) {
  if (!sourceReady) return book === 1 ? fallbackBookOne : fallbackBookTwo;
  const start = book === 1 ? 1 : 26;
  const labels = Array.from(
    sourceRoot(book)?.querySelectorAll(".material-choice-label") || [],
  ).map((element, index) => cleanLessonTitle(element.textContent, start + index));
  return labels.length === 25 ? labels : book === 1 ? fallbackBookOne : fallbackBookTwo;
}

function lessonStatus(index) {
  if (index <= 9 || index === 11) return "done";
  if (index === 10 || index === 13) return "repeat";
  return "new";
}

function renderLessonGrid(selectedIndex = currentLessonIndex) {
  const names = sourceLessonNames(currentBook);
  const start = currentBook === 1 ? 1 : 26;
  lessonGrid.replaceChildren();
  names.forEach((name, index) => {
    const number = start + index;
    const status = lessonStatus(index);
    const button = document.createElement("button");
    button.className = `lesson ${status}${index === selectedIndex ? " active" : ""}`;
    button.innerHTML = `<span>${String(number).padStart(2, "0")}</span><i></i><b></b><small>${status === "done" ? "Dikuasai" : status === "repeat" ? "Perlu diulang" : "Belum dimulai"}</small>`;
    button.querySelector("b").textContent = name;
    button.onclick = () => selectLesson(index, name, button);
    lessonGrid.appendChild(button);
  });
}

function plainTextWithoutReadings(element) {
  if (!element) return "";
  const clone = element.cloneNode(true);
  clone.querySelectorAll("rt").forEach((reading) => reading.remove());
  return clone.textContent.trim();
}

function cloneContentWithout(element, selector) {
  if (!element) return "";
  const clone = element.cloneNode(true);
  if (selector) clone.querySelectorAll(selector).forEach((item) => item.remove());
  return clone.innerHTML.trim();
}

function extractPatterns(index) {
  if (!sourceReady) return [];
  const root = sourceRoot();
  const sourceButtons = root?.querySelectorAll(".material-choice");
  sourceButtons?.[index]?.click();
  const content = root?.querySelector(".material-reader-body > .html-content");
  return Array.from(content?.querySelectorAll(":scope > .grammar-point") || [])
    .map((point) => {
      const example = point.querySelector(".grammar-example");
      const meaning = example?.querySelector(".grammar-meaning");
      if (!example || !meaning) return null;
      return {
        titleHtml: cloneContentWithout(point.querySelector("h3")),
        titleText: plainTextWithoutReadings(point.querySelector("h3")),
        explanationHtml: cloneContentWithout(point.querySelector(":scope > p")),
        japaneseHtml: cloneContentWithout(example, ".grammar-meaning"),
        meaning: plainTextWithoutReadings(meaning),
        noteHtml: cloneContentWithout(point.querySelector(".grammar-important-note")),
      };
    })
    .filter(Boolean);
}

function renderPattern() {
  const pattern = currentPatterns[currentPatternIndex];
  const total = currentPatterns.length;
  document.getElementById("patternCounter").textContent = total
    ? `POLA ${String(currentPatternIndex + 1).padStart(2, "0")} DARI ${String(total).padStart(2, "0")}`
    : "POLA BELUM TERSEDIA";
  document.getElementById("grammarIndex").textContent = total
    ? String(currentPatternIndex + 1).padStart(2, "0")
    : "—";
  document.getElementById("grammarTitle").innerHTML = pattern?.titleHtml || "Materi sedang dimuat";
  document.getElementById("grammarExplanation").innerHTML = pattern?.explanationHtml || "Pola bab ini akan tampil setelah sumber materi selesai dimuat.";
  document.getElementById("grammarJapanese").innerHTML = pattern?.japaneseHtml || "—";
  document.getElementById("grammarMeaning").textContent = pattern?.meaning || "—";
  const note = document.getElementById("grammarNote");
  note.hidden = !pattern?.noteHtml;
  document.getElementById("grammarNoteText").innerHTML = pattern?.noteHtml || "";
  document.getElementById("patternPrevious").disabled = currentPatternIndex === 0;
  document.getElementById("patternNext").disabled = !total || currentPatternIndex === total - 1;
  const action = document.getElementById("nextPatternAction");
  action.disabled = !total || currentPatternIndex === total - 1;
  action.textContent = currentPatternIndex === total - 1 ? "Semua pola selesai ✓" : "Pola berikutnya →";
}

function renderExamples() {
  const container = document.getElementById("dynamicExampleCards");
  container.replaceChildren();
  currentPatterns.forEach((pattern, index) => {
    const card = document.createElement("article");
    card.innerHTML = `<span>CONTOH ${String(index + 1).padStart(2, "0")}</span><h4></h4><p class="jp"></p><p class="example-meaning"></p>`;
    card.querySelector("h4").innerHTML = pattern.titleHtml;
    card.querySelector(".jp").innerHTML = pattern.japaneseHtml;
    card.querySelector(".example-meaning").textContent = pattern.meaning;
    container.appendChild(card);
  });
  if (!currentPatterns.length) {
    container.innerHTML = "<article><p>Contoh bab ini sedang dimuat.</p></article>";
  }
}

function updateLessonContent(index) {
  currentPatterns = extractPatterns(index);
  currentPatternIndex = 0;
  renderPattern();
  renderExamples();
}

function selectLesson(index, name, button, shouldScroll = true) {
  currentLessonIndex = index;
  const number = (currentBook === 1 ? 1 : 26) + index;
  document.querySelectorAll(".lesson").forEach((item) => item.classList.remove("active"));
  button?.classList.add("active");
  document.getElementById("lessonPosition").textContent = number;
  document.getElementById("lessonBadge").textContent = String(number).padStart(2, "0");
  document.getElementById("readerTitle").textContent = name;
  document.querySelector(".reader-title .eyebrow").textContent = `BUKU ${currentBook} · ${currentBook === 1 ? "DASAR" : "MENENGAH"}`;
  updateLessonContent(index);
  if (shouldScroll)
    document.getElementById("reader").scrollIntoView({ behavior: "smooth", block: "start" });
}

function changeBook(book) {
  currentBook = book;
  currentLessonIndex = 0;
  document.querySelectorAll(".book").forEach((button) =>
    button.classList.toggle("active", Number(button.dataset.book) === book),
  );
  document.querySelector(".workspace h2").textContent = book === 1
    ? "Dasar · Pelajaran 1–25"
    : "Menengah · Pelajaran 26–50";
  renderLessonGrid(0);
  const firstButton = lessonGrid.querySelector(".lesson");
  selectLesson(0, sourceLessonNames(book)[0], firstButton, false);
}

renderLessonGrid();

sourceFrame.addEventListener("load", () => {
  const waitForSource = () => {
    if (sourceFrame.contentDocument?.querySelector("#materials .material-choice")) {
      sourceReady = true;
      changeBook(currentBook);
      return;
    }
    setTimeout(waitForSource, 120);
  };
  waitForSource();
});

document.querySelectorAll(".book").forEach((button) => {
  button.onclick = () => changeBook(Number(button.dataset.book));
});

document.getElementById("continueButton").onclick = () => {
  const target = Math.min(12, lessonGrid.children.length - 1);
  lessonGrid.children[target]?.click();
};

function movePattern(amount) {
  const next = currentPatternIndex + amount;
  if (next < 0 || next >= currentPatterns.length) return;
  currentPatternIndex = next;
  renderPattern();
}

document.getElementById("patternPrevious").onclick = () => movePattern(-1);
document.getElementById("patternNext").onclick = () => movePattern(1);
document.getElementById("nextPatternAction").onclick = () => movePattern(1);

document.querySelectorAll(".study-steps button").forEach((button) => {
  button.onclick = () => {
    document.querySelectorAll(".study-steps button").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".study-panel").forEach((panel) => panel.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(`[data-panel="${button.dataset.step}"]`).classList.add("active");
  };
});

document.getElementById("furiganaMode").onchange = (event) => {
  document.body.dataset.furigana = event.target.value;
};

document.getElementById("focusButton").onclick = (event) => {
  document.body.classList.toggle("focus-mode");
  event.currentTarget.textContent = document.body.classList.contains("focus-mode")
    ? "× Keluar fokus"
    : "⛶ Mode fokus";
};

document.querySelector(".sidebar-collapse").onclick = () =>
  document.body.classList.toggle("sidebar-small");
document.getElementById("backToGrid").onclick = () =>
  document.querySelector(".workspace").scrollIntoView({ behavior: "smooth" });

document.querySelectorAll(".answers button").forEach((button) => {
  button.onclick = () => {
    document.querySelectorAll(".answers button").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
  };
});
