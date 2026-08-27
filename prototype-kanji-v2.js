const kanjiEmbedMode = new URLSearchParams(location.search).get("embed") === "1";
document.body.classList.toggle("embed-mode", kanjiEmbedMode);

const grid = document.getElementById("kanjiGrid");
const search = document.getElementById("kanjiSearch");
const mnemonicStories = {
  山: "Tiga puncak yang berdiri berdampingan membentuk sebuah gunung.",
  川: "Tiga garis mengalir sejajar seperti aliran sungai.",
  人: "Dua kaki yang melangkah menggambarkan seorang manusia.",
  日: "Bingkai matahari dengan cahaya di bagian tengahnya.",
  月: "Bentuk bulan sabit yang disederhanakan menjadi empat goresan.",
  木: "Garis tengah adalah batang, garis mendatar cabang, dan sapuan bawah adalah akar.",
  休: "Orang 亻 bersandar pada pohon 木 untuk beristirahat.",
  林: "Dua pohon 木 berdampingan membentuk sebuah hutan kecil.",
  森: "Tiga pohon 木 berkumpul menjadi hutan yang lebat.",
  明: "Matahari 日 dan bulan 月 bersama-sama menghasilkan cahaya terang.",
};
const similarKanji = {
  土: ["士", "Bawah lebih panjang"], 士: ["土", "Atas lebih panjang"],
  人: ["入", "Terbuka ke bawah"], 入: ["人", "Sapuan masuk ke dalam"],
  未: ["末", "Garis bawah lebih panjang"], 末: ["未", "Garis atas lebih panjang"],
  日: ["目", "Satu garis dalam"], 目: ["日", "Dua garis dalam"],
  木: ["本", "Tanpa tanda di akar"], 本: ["木", "Ada tanda pada akar"],
  右: ["左", "Mulai sapuan mendatar"], 左: ["右", "Mulai sapuan miring"],
};

let levelFilter = "all";
let statusFilter = "all";
let activeIndex = 0;
let visibleItems = kanjiLessons;
let shownStrokes = 0;
let strokeAnimationFrame = 0;
let strokeAnimationToken = 0;
let strokeRenderVersion = 0;
let brushModeEnabled = true;
const brushCanvas = document.getElementById("brushCanvas");
const brushContext = brushCanvas.getContext("2d");
brushContext.imageSmoothingEnabled = true;
brushContext.imageSmoothingQuality = "high";
let quizIndex = 0;

function kanjiSrsId(item) {
  return `kanji:${item.char}`;
}

function statusFor(item) {
  return srsStatusLabel(kanjiSrsId(item));
}

/* outcome: "again" (Sulit), "hard" (Masih belajar), "good" (Sudah kuat) */
function setStatus(item, outcome) {
  srsReview(kanjiSrsId(item), outcome);
  applyFilters();
  updateHeroStats();
  renderSrsHint(item);
}

function updateHeroStats() {
  document.getElementById("masteredCount").textContent = srsMasteredCount("kanji:");
  document.getElementById("reviewCount").textContent = srsDueCount("kanji:");
}

function renderSrsHint(item) {
  const hint = document.getElementById("srsHint");
  if (!hint) return;
  const record = srsGet(kanjiSrsId(item));
  if (!record.reviews) {
    hint.textContent = "Belum pernah diulas. Nilai untuk mulai penjadwalan.";
    return;
  }
  const dueDate = new Date(record.due + "T00:00:00");
  const daysLeft = Math.ceil((dueDate - new Date(srsToday() + "T00:00:00")) / 86400000);
  hint.textContent =
    daysLeft <= 0
      ? "Terjadwal ulang hari ini."
      : `Terjadwal ulang lagi dalam ${daysLeft} hari.`;
}

function updateCounts() {
  document.getElementById("allCount").textContent = kanjiLessons.length;
  document.getElementById("browserAllCount").textContent = kanjiLessons.length;
  ["N5", "N4", "N3"].forEach((level) => {
    const id = level.toLowerCase() + "Count";
    const count = kanjiLessons.filter((item) => item.level === level).length;
    document.getElementById(id).textContent = count;
    document.getElementById(`browser${level}Count`).textContent = count;
  });
}

function applyFilters() {
  const query = search.value.trim().toLowerCase();
  visibleItems = kanjiLessons.filter((item, index) => {
    const matchesLevel = levelFilter === "all" || item.level === levelFilter;
    const matchesStatus = statusFilter === "all" || statusFor(item, index) === statusFilter;
    const haystack = [item.char, item.meaning, item.on, item.kun, ...item.words.flat()].join(" ").toLowerCase();
    return matchesLevel && matchesStatus && haystack.includes(query);
  });
  document.getElementById("resultCount").textContent = `${visibleItems.length} kanji ditemukan`;
  renderGrid();
}

function renderGrid() {
  grid.replaceChildren();
  let renderedLevel = "";
  visibleItems.forEach((item) => {
    if (levelFilter === "all" && item.level !== renderedLevel) {
      renderedLevel = item.level;
      const heading = document.createElement("div");
      const groupCount = visibleItems.filter((candidate) => candidate.level === item.level).length;
      heading.className = `kanji-level-heading level-${item.level.toLowerCase()}`;
      heading.innerHTML = `<b>JLPT ${item.level}</b><small>${item.level === "N5" ? "Dasar" : item.level === "N4" ? "Dasar lanjut" : "Menengah"}</small><span>${groupCount} kanji</span>`;
      grid.appendChild(heading);
    }
    const sourceIndex = kanjiLessons.indexOf(item);
    const status = statusFor(item, sourceIndex);
    const button = document.createElement("button");
    button.className = `kanji-item ${status}${sourceIndex === activeIndex ? " active" : ""}`;
    button.innerHTML = `<i></i><span>${item.char}</span><small></small>`;
    button.querySelector("small").textContent = item.meaning;
    button.onclick = () => selectKanji(sourceIndex, true);
    grid.appendChild(button);
  });
}

function parseWord(info) {
  const parts = info.split(/\s+-\s+/);
  return { reading: parts[0] || "", meaning: parts.slice(1).join(" - ") || "" };
}

const romajiKanaMap = {
  kya: "きゃ", kyu: "きゅ", kyo: "きょ", gya: "ぎゃ", gyu: "ぎゅ", gyo: "ぎょ",
  sha: "しゃ", shu: "しゅ", sho: "しょ", ja: "じゃ", ju: "じゅ", jo: "じょ",
  cha: "ちゃ", chu: "ちゅ", cho: "ちょ", nya: "にゃ", nyu: "にゅ", nyo: "にょ",
  hya: "ひゃ", hyu: "ひゅ", hyo: "ひょ", bya: "びゃ", byu: "びゅ", byo: "びょ",
  pya: "ぴゃ", pyu: "ぴゅ", pyo: "ぴょ", mya: "みゃ", myu: "みゅ", myo: "みょ",
  rya: "りゃ", ryu: "りゅ", ryo: "りょ", shi: "し", chi: "ち", tsu: "つ",
  fu: "ふ", ji: "じ", ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご", sa: "さ", su: "す", se: "せ", so: "そ",
  za: "ざ", zu: "ず", ze: "ぜ", zo: "ぞ", ta: "た", te: "て", to: "と",
  da: "だ", de: "で", do: "ど", na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
  ha: "は", hi: "ひ", he: "へ", ho: "ほ", ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ",
  pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ", ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
  ya: "や", yu: "ゆ", yo: "よ", ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
  wa: "わ", wo: "を", a: "あ", i: "い", u: "う", e: "え", o: "お",
};

function romajiToHiragana(value) {
  const source = value
    .toLowerCase()
    .replaceAll("ā", "aa").replaceAll("ī", "ii").replaceAll("ū", "uu")
    .replaceAll("ē", "ee").replaceAll("ō", "ou").replace(/[^a-z']/g, "");
  let result = "";
  let index = 0;
  while (index < source.length) {
    if (
      index + 1 < source.length &&
      source[index] === source[index + 1] &&
      /[bcdfghjklmpqrstvwxyz]/.test(source[index]) &&
      source[index] !== "n"
    ) {
      result += "っ";
      index++;
      continue;
    }
    if (source[index] === "n" && (index === source.length - 1 || source[index + 1] === "'" || !/[aeiouy]/.test(source[index + 1]))) {
      result += "ん";
      index += source[index + 1] === "'" ? 2 : 1;
      continue;
    }
    const chunk = [3, 2, 1]
      .map((length) => source.slice(index, index + length))
      .find((candidate) => romajiKanaMap[candidate]);
    if (chunk) {
      result += romajiKanaMap[chunk];
      index += chunk.length;
    } else {
      result += source[index++];
    }
  }
  return result;
}

function japaneseVoice() {
  return speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith("ja"));
}

function speakJapanese(text, cancelQueue = true) {
  if (!text || !("speechSynthesis" in window)) return;
  if (cancelQueue) speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.78;
  utterance.pitch = 1;
  const voice = japaneseVoice();
  if (voice) utterance.voice = voice;
  speechSynthesis.speak(utterance);
}

function readingText(value) {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => `${romajiToHiragana(part)} (${part})`)
    .join("・");
}

function renderWords(item) {
  const list = document.getElementById("wordList");
  list.replaceChildren();
  item.words.forEach(([word, info]) => {
    const parsed = parseWord(info);
    const card = document.createElement("div");
    card.className = "word";
    card.innerHTML = `<b></b><span></span><button type="button" aria-label="Dengarkan kosakata">▶</button>`;
    card.querySelector("b").textContent = word;
    card.querySelector("span").textContent = `${parsed.reading} · ${parsed.meaning}`;
    card.querySelector("button").onclick = () => speakJapanese(word);
    list.appendChild(card);
  });
}

function renderSimilar(item) {
  const list = document.getElementById("similarList");
  list.replaceChildren();
  const configured = similarKanji[item.char];
  const candidates = configured
    ? [configured]
    : kanjiLessons.filter((candidate) => candidate !== item).slice(activeIndex % Math.max(1, kanjiLessons.length - 2), activeIndex % Math.max(1, kanjiLessons.length - 2) + 2).map((candidate) => [candidate.char, candidate.meaning]);
  candidates.forEach(([character, note]) => {
    const button = document.createElement("button");
    button.innerHTML = `<b>${character}</b><small></small>`;
    button.querySelector("small").textContent = note;
    const target = kanjiLessons.findIndex((candidate) => candidate.char === character);
    if (target >= 0) button.onclick = () => selectKanji(target, true);
    list.appendChild(button);
  });
}

function populateStrokeBoard(item, paths, viewBox = "0 0 220 220") {
  cancelAnimationFrame(strokeAnimationFrame);
  strokeAnimationToken++;
  shownStrokes = 0;
  brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
  const svg = document.getElementById("strokeSvg");
  svg.replaceChildren();
  svg.setAttribute("viewBox", viewBox);
  svg.dataset.natural = viewBox.includes("109") ? "true" : "false";
  const namespace = "http://www.w3.org/2000/svg";
  const definitions = document.createElementNS(namespace, "defs");
  definitions.innerHTML =
    '<filter id="brushInkFilter" x="-12%" y="-12%" width="124%" height="124%"><feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="2" seed="7" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="0.7" xChannelSelector="R" yChannelSelector="G"/></filter>';
  svg.appendChild(definitions);
  paths.forEach((pathData, index) => {
    const guidePath = document.createElementNS(namespace, "path");
    guidePath.setAttribute("d", pathData);
    guidePath.classList.add("stroke-guide-path");
    svg.appendChild(guidePath);
    const path = document.createElementNS(namespace, "path");
    path.setAttribute("d", pathData);
    path.setAttribute("pathLength", "1");
    path.setAttribute("filter", "url(#brushInkFilter)");
    path.classList.add("stroke-line");
    svg.appendChild(path);
    const match = pathData.match(/M\s*([\d.]+)\s+([\d.]+)/);
    if (match) {
      const label = document.createElementNS(namespace, "text");
      label.setAttribute("x", Number(match[1]) - 7);
      label.setAttribute("y", Number(match[2]) - 7);
      label.classList.add("stroke-number");
      label.textContent = index + 1;
      svg.appendChild(label);
    }
  });
  if (paths.length) {
    const brush = document.createElementNS(namespace, "g");
    brush.classList.add("brush-nib");
    const outer = document.createElementNS(namespace, "ellipse");
    outer.classList.add("brush-nib-outer");
    const inner = document.createElementNS(namespace, "ellipse");
    inner.classList.add("brush-nib-inner");
    const natural = viewBox.includes("109");
    outer.setAttribute("rx", natural ? "3.3" : "6.6");
    outer.setAttribute("ry", natural ? "5.4" : "10.8");
    inner.setAttribute("rx", natural ? "1.35" : "2.7");
    inner.setAttribute("ry", natural ? "3.1" : "6.2");
    brush.append(outer, inner);
    svg.appendChild(brush);
  }
  document.querySelector(".stroke-board").classList.toggle(
    "standard-ink",
    !brushModeEnabled,
  );
  document.getElementById("guideCharacter").classList.toggle(
    "path-guide-active",
    paths.length > 0,
  );
  document.getElementById("strokeCount").textContent = paths.length ? `${paths.length} goresan` : "Panduan bentuk";
  document.getElementById("strokeBadge").textContent = paths.length
    ? `Goresan 1–${paths.length}`
    : "Panduan bentuk";
  document.getElementById("strokeStep").textContent = paths.length
    ? "Animasi goresan diputar otomatis dan berulang."
    : "Data animasi belum tersedia untuk karakter ini; gunakan contoh transparan sebagai panduan.";
  if (paths.length) requestAnimationFrame(startStrokeAnimation);
}

function kanjiVGFile(character) {
  return character.codePointAt(0).toString(16).padStart(5, "0");
}

// Goresan asli KanjiVG diambil dari raw.githubusercontent.com, yang bisa
// makan waktu 1.5-2.5 detik per kanji dan diminta ulang setiap kanji dibuka.
// Simpan hasilnya di localStorage supaya kanji yang sama hanya lambat sekali
// per perangkat, lalu instan sesudahnya.
function strokeCacheKey(character) {
  return `kanjiStrokeCacheV1:${character}`;
}

function getCachedStrokePaths(character) {
  try {
    const raw = localStorage.getItem(strokeCacheKey(character));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCachedStrokePaths(character, paths) {
  try {
    localStorage.setItem(strokeCacheKey(character), JSON.stringify(paths));
  } catch {
    // Penyimpanan penuh atau diblokir; lanjut tanpa cache, tidak fatal.
  }
}

async function loadNaturalStrokePaths(item, version) {
  const cached = getCachedStrokePaths(item.char);
  if (cached && cached.length) {
    if (version !== strokeRenderVersion) return;
    populateStrokeBoard(item, cached, "0 0 109 109");
    return;
  }
  const source = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${kanjiVGFile(item.char)}.svg`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const response = await fetch(source, { signal: controller.signal });
    if (!response.ok) throw new Error("KanjiVG tidak tersedia");
    const sourceText = await response.text();
    const sourceSvg = new DOMParser().parseFromString(sourceText, "image/svg+xml");
    const paths = Array.from(sourceSvg.querySelectorAll("path"))
      .map((path) => path.getAttribute("d"))
      .filter(Boolean);
    if (!paths.length) throw new Error("Goresan tidak ditemukan");
    setCachedStrokePaths(item.char, paths);
    if (version !== strokeRenderVersion) return;
    populateStrokeBoard(item, paths, "0 0 109 109");
  } catch {
    if (version !== strokeRenderVersion) return;
    const fallback = kanjiStrokePaths[item.char] || [];
    populateStrokeBoard(item, fallback);
  } finally {
    clearTimeout(timeout);
  }
}

function renderStrokeBoard(item) {
  const version = ++strokeRenderVersion;
  const fallback = kanjiStrokePaths[item.char] || [];
  populateStrokeBoard(item, fallback);
  if (!fallback.length) {
    document.getElementById("strokeBadge").textContent = "Menyiapkan goresan…";
    document.getElementById("strokeStep").textContent = "Mengambil urutan goresan standar KanjiVG.";
  }
  loadNaturalStrokePaths(item, version);
}

function showNextStroke() {
  cancelAnimationFrame(strokeAnimationFrame);
  strokeAnimationToken++;
  const paths = Array.from(document.querySelectorAll("#strokeSvg .stroke-line"));
  const brush = document.querySelector("#strokeSvg .brush-nib");
  if (brush) brush.style.opacity = "0";
  paths.forEach((path, index) => {
    path.style.strokeDasharray = "1";
    path.style.strokeDashoffset = index < shownStrokes ? "0" : "1";
    path.style.opacity = index < shownStrokes ? "1" : "0";
  });
  if (shownStrokes >= paths.length) return false;
  paths[shownStrokes].style.strokeDashoffset = "0";
  paths[shownStrokes].style.opacity = "1";
  shownStrokes++;
  if (brushModeEnabled) paintBrushSteps(paths, shownStrokes);
  const item = kanjiLessons[activeIndex];
  const steps = item.steps.split(/\s{2,}/).filter(Boolean);
  document.getElementById("strokeStep").textContent = steps[shownStrokes - 1] || `Goresan ${shownStrokes} dari ${paths.length}`;
  return true;
}

function easeStroke(value) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function brushScale() {
  const viewBox = document
    .getElementById("strokeSvg")
    .getAttribute("viewBox")
    .split(/\s+/)
    .map(Number);
  return {
    x: brushCanvas.width / (viewBox[2] || 220),
    y: brushCanvas.height / (viewBox[3] || 220),
    natural: (viewBox[2] || 220) <= 120,
  };
}

function pressureAt(position, visibleEnd) {
  const smoothStep = (value) => {
    const clamped = Math.max(0, Math.min(1, value));
    return clamped * clamped * (3 - 2 * clamped);
  };
  const startPressure = 0.62 + smoothStep(position / 0.16) * 0.38;
  const fullEndTaper = position > 0.7
    ? 0.14 + smoothStep((1 - position) / 0.3) * 0.86
    : 1;
  const movingTip = 0.18 + smoothStep(
    (visibleEnd - position) / Math.max(0.045, visibleEnd * 0.1),
  ) * 0.82;
  const naturalPulse = 0.975 + Math.sin(position * Math.PI * 2.1) * 0.025;
  return startPressure * fullEndTaper * movingTip * naturalPulse;
}

function paintBrushPath(path, length, visibleEnd, pathIndex, scale) {
  if (visibleEnd <= 0 || !length) return;
  const sampleCount = Math.max(
    28,
    Math.ceil(length * visibleEnd * (scale.natural ? 2.4 : 1.25)),
  );
  const baseRadius = (scale.natural ? 4.7 : 9.4) * scale.x;
  for (let sample = 0; sample <= sampleCount; sample++) {
    const position = (sample / sampleCount) * visibleEnd;
    const point = path.getPointAtLength(length * position);
    const next = path.getPointAtLength(
      Math.min(length, length * position + Math.max(0.12, length * 0.008)),
    );
    const angle = Math.atan2(next.y - point.y, next.x - point.x) + Math.PI / 5;
    const pressure = pressureAt(position, visibleEnd);
    const grain = Math.sin((sample + 3) * (pathIndex + 5) * 12.9898) * 0.5 + 0.5;
    const radius = baseRadius * pressure * (0.985 + grain * 0.03);
    const x = point.x * scale.x;
    const y = point.y * scale.y;
    brushContext.save();
    brushContext.translate(x, y);
    brushContext.rotate(angle);
    brushContext.fillStyle = `rgba(27, 15, 11, ${0.89 + grain * 0.055})`;
    brushContext.beginPath();
    brushContext.ellipse(0, 0, Math.max(0.8, radius * 0.54), Math.max(1.1, radius), 0, 0, Math.PI * 2);
    brushContext.fill();
    brushContext.fillStyle = "rgba(80, 47, 31, .085)";
    [-1, 1].forEach((side) => {
      brushContext.beginPath();
      brushContext.ellipse(
        side * radius * (0.31 + grain * 0.025),
        0,
        Math.max(0.3, radius * 0.075),
        Math.max(0.7, radius * 0.68),
        0,
        0,
        Math.PI * 2,
      );
      brushContext.fill();
    });
    brushContext.restore();
  }
}

function paintBrushFrame(paths, lengths, active, progress, finished) {
  brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
  const scale = brushScale();
  paths.forEach((path, index) => {
    const visibleEnd = finished || index < active
      ? 1
      : index === active
        ? Math.max(0.002, easeStroke(progress))
        : 0;
    paintBrushPath(path, lengths[index], visibleEnd, index, scale);
  });
}

function paintBrushSteps(paths, count) {
  const lengths = paths.map((path) => path.getTotalLength());
  paintBrushFrame(paths, lengths, Math.max(0, count - 1), 1, count >= paths.length);
  if (count < paths.length) {
    brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
    const scale = brushScale();
    paths.slice(0, count).forEach((path, index) =>
      paintBrushPath(path, lengths[index], 1, index, scale),
    );
  }
}

function startStrokeAnimation() {
  cancelAnimationFrame(strokeAnimationFrame);
  const token = ++strokeAnimationToken;
  const paths = Array.from(document.querySelectorAll("#strokeSvg .stroke-line"));
  if (!paths.length) return;
  const svg = document.getElementById("strokeSvg");
  const brush = svg.querySelector(".brush-nib");
  const pathLengths = paths.map((path) => path.getTotalLength());
  const baseWidth = svg.dataset.natural === "true"
    ? brushModeEnabled ? 5.2 : 4.5
    : brushModeEnabled ? 10.4 : 9;
  const stepDuration = Number(document.getElementById("strokeSpeed").value);
  const holdDuration = 1500;
  const totalDuration = paths.length * stepDuration + holdDuration;
  const startedAt = performance.now();
  const item = kanjiLessons[activeIndex];
  const steps = item.steps.split(/\s{2,}/).filter(Boolean);

  function drawFrame(now) {
    if (token !== strokeAnimationToken) return;
    const elapsed = (now - startedAt) % totalDuration;
    const drawingFinished = elapsed >= paths.length * stepDuration;
    const active = drawingFinished
      ? paths.length - 1
      : Math.min(paths.length - 1, Math.floor(elapsed / stepDuration));
    const progress = drawingFinished
      ? 1
      : Math.min(1, (elapsed - active * stepDuration) / stepDuration);
    paths.forEach((path, index) => {
      path.style.strokeDasharray = "1";
      if (drawingFinished || index < active) {
        path.style.strokeDashoffset = "0";
        path.style.opacity = "1";
        path.style.strokeWidth = String(baseWidth);
      } else if (index === active) {
        path.style.strokeDashoffset = String(1 - easeStroke(progress));
        path.style.opacity = "1";
        const pressure = brushModeEnabled
          ? 0.78 + Math.sin(Math.PI * progress) * 0.34
          : 1;
        path.style.strokeWidth = String(baseWidth * pressure);
      } else {
        path.style.strokeDashoffset = "1";
        path.style.opacity = "0";
        path.style.strokeWidth = String(baseWidth * 0.75);
      }
    });
    if (brushModeEnabled) {
      paintBrushFrame(paths, pathLengths, active, progress, drawingFinished);
    } else {
      brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
    }
    if (brush) {
      if (drawingFinished || !brushModeEnabled) {
        brush.style.opacity = "0";
      } else {
        const activePath = paths[active];
        const length = pathLengths[active];
        if (!activePath || !Number.isFinite(length)) {
          brush.style.opacity = "0";
        } else {
          const eased = easeStroke(progress);
          const point = activePath.getPointAtLength(length * eased);
          const nextPoint = activePath.getPointAtLength(
            Math.min(length, length * eased + Math.max(0.2, length * 0.012)),
          );
          const angle = (Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180) / Math.PI + 90;
          const pressure = 0.82 + Math.sin(Math.PI * progress) * 0.22;
          brush.setAttribute(
            "transform",
            `translate(${point.x} ${point.y}) rotate(${angle}) scale(${pressure} ${0.88 + pressure * 0.08})`,
          );
          brush.style.opacity = progress < 0.03
            ? String(progress / 0.03)
            : progress > 0.97
              ? String((1 - progress) / 0.03)
              : "1";
        }
      }
    }
    shownStrokes = drawingFinished ? paths.length : active;
    document.getElementById("strokeStep").textContent = drawingFinished
      ? "Bentuk selesai. Animasi akan dimulai kembali."
      : steps[active] || `Menggambar goresan ${active + 1} dari ${paths.length}.`;
    strokeAnimationFrame = requestAnimationFrame(drawFrame);
  }
  strokeAnimationFrame = requestAnimationFrame(drawFrame);
}

function resetStrokes() {
  cancelAnimationFrame(strokeAnimationFrame);
  strokeAnimationToken++;
  shownStrokes = 0;
  document.querySelectorAll("#strokeSvg .stroke-line").forEach((path) => {
    path.style.strokeDasharray = "1";
    path.style.strokeDashoffset = "1";
    path.style.opacity = "0";
  });
  const brush = document.querySelector("#strokeSvg .brush-nib");
  if (brush) brush.style.opacity = "0";
  brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
  document.getElementById("strokeStep").textContent = "Animasi goresan diputar otomatis dan berulang.";
  requestAnimationFrame(startStrokeAnimation);
}

function selectKanji(index, shouldScroll = false) {
  activeIndex = index;
  const item = kanjiLessons[index];
  document.getElementById("levelBadge").textContent = `JLPT ${item.level}`;
  document.getElementById("guideCharacter").textContent = item.char;
  document.getElementById("writingGuide").textContent = item.char;
  document.getElementById("detailCharacter").textContent = item.char;
  document.getElementById("detailMeaning").textContent = item.meaning;
  document.getElementById("onReading").textContent = readingText(item.on);
  document.getElementById("kunReading").textContent = readingText(item.kun);
  document.getElementById("memoryStory").textContent = mnemonicStories[item.char] || `Hubungkan bentuk ${item.char} dengan arti “${item.meaning}”. Perhatikan bagian yang paling menonjol, lalu bayangkan bentuk itu dalam satu adegan sederhana.`;
  const contextWord = item.words[0]?.[0] || item.char;
  document.getElementById("contextSentenceJapanese").textContent = `「${contextWord}」という言葉を練習します。`;
  document.getElementById("contextSentenceMeaning").textContent = `Mari berlatih menggunakan kosakata ${contextWord}.`;
  renderStrokeBoard(item);
  renderWords(item);
  renderSimilar(item);
  renderSrsHint(item);
  quizIndex = 0;
  renderQuiz();
  renderGrid();
  if (shouldScroll) document.getElementById("studyArea").scrollIntoView({ behavior: "smooth", block: "start" });
}

function shuffledChoices(correct, pool, offset) {
  const values = [correct, ...pool.filter((value) => value !== correct)].filter((value, index, array) => value && array.indexOf(value) === index).slice(0, 4);
  while (values.length < 4) values.push("—");
  const shift = offset % values.length;
  return values.slice(shift).concat(values.slice(0, shift));
}

function compoundWordFor(item) {
  // Beberapa kanji punya entri "words" yang persis sama dengan karakternya
  // sendiri (mis. 川 punya entri "川"). Kalau entri itu terpilih, soal
  // kosakata jadi janggal (menampilkan kanji itu sendiri sebagai "kosakata")
  // atau kosong total setelah bagian yang ditanya dihapus. Cari entri yang
  // benar-benar berupa kata majemuk (bukan cuma karakter itu sendiri).
  return (
    item.words.find((entry) => entry[0] !== item.char) ||
    item.words[0] || [item.char]
  );
}

function quizData() {
  const item = kanjiLessons[activeIndex];
  const others = kanjiLessons.filter((candidate) => candidate !== item);
  if (quizIndex === 0) return { type: "PILIH ARTI YANG BENAR", display: item.char, question: "Apa arti kanji tersebut?", correct: item.meaning, choices: shuffledChoices(item.meaning, others.map((x) => x.meaning), activeIndex + 1) };
  if (quizIndex === 1) return { type: "PILIH CARA BACA", display: item.char, question: "Pilih kunyomi yang benar.", correct: item.kun, choices: shuffledChoices(item.kun, others.map((x) => x.kun), activeIndex + 2) };
  if (quizIndex === 2) {
    const word = compoundWordFor(item)[0];
    return { type: "PILIH KANJI DALAM KOSAKATA", display: word, question: `Kanji utama manakah yang terdapat pada kosakata tersebut?`, correct: item.char, choices: shuffledChoices(item.char, others.map((x) => x.char), activeIndex + 3) };
  }
  const word = compoundWordFor(item)[0];
  return { type: "LENGKAPI KOSAKATA", display: word.replace(item.char, "（　）"), question: `Pilih kanji yang melengkapi kosakata dengan arti “${item.meaning}”.`, correct: item.char, choices: shuffledChoices(item.char, others.map((x) => x.char), activeIndex) };
}

function renderQuiz() {
  const data = quizData();
  document.getElementById("quizProgress").textContent = `${quizIndex + 1} / 4`;
  document.getElementById("quizType").textContent = data.type;
  document.getElementById("quizCharacter").textContent = data.display;
  document.getElementById("quizQuestion").textContent = data.question;
  document.querySelectorAll(".quiz-types span").forEach((tab, index) => tab.classList.toggle("active", index === quizIndex));
  const options = document.getElementById("quizOptions");
  options.replaceChildren();
  document.getElementById("quizFeedback").textContent = "";
  document.getElementById("nextQuiz").hidden = true;
  data.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.innerHTML = `<b>${index + 1}</b><span></span>`;
    button.querySelector("span").textContent = choice;
    button.onclick = () => {
      const correct = choice === data.correct;
      options.querySelectorAll("button").forEach((option) => {
        option.disabled = true;
        if (option.querySelector("span").textContent === data.correct) option.classList.add("correct");
      });
      if (!correct) button.classList.add("wrong");
      document.getElementById("quizFeedback").textContent = correct ? "Benar. Lanjutkan ke tipe latihan berikutnya." : `Belum tepat. Jawaban yang benar: ${data.correct}`;
      document.getElementById("nextQuiz").hidden = false;
    };
    options.appendChild(button);
  });
}

document.querySelectorAll("button[data-level]").forEach((button) => {
  button.onclick = () => {
    levelFilter = button.dataset.level;
    document.querySelectorAll("button[data-level]").forEach((item) => item.classList.toggle("active", item.dataset.level === levelFilter));
    document.getElementById("listTitle").textContent = levelFilter === "all" ? "Semua kanji" : `Jalur JLPT ${levelFilter}`;
    applyFilters();
  };
});
document.querySelectorAll(".filter-row button").forEach((button) => {
  button.onclick = () => {
    statusFilter = button.dataset.status;
    document.querySelectorAll(".filter-row button").forEach((item) => item.classList.toggle("active", item === button));
    applyFilters();
  };
});
document.querySelectorAll(".srs-actions button").forEach((button) => button.onclick = () => setStatus(kanjiLessons[activeIndex], button.dataset.srs));
search.oninput = applyFilters;
document.getElementById("playStroke").onclick = resetStrokes;
document.getElementById("stepStroke").onclick = showNextStroke;
document.getElementById("resetStroke").onclick = resetStrokes;
document.getElementById("strokeSpeed").onchange = resetStrokes;
document.getElementById("brushMode").onclick = (event) => {
  brushModeEnabled = !brushModeEnabled;
  document.querySelector(".stroke-board").classList.toggle(
    "standard-ink",
    !brushModeEnabled,
  );
  event.currentTarget.classList.toggle("active", brushModeEnabled);
  event.currentTarget.textContent = brushModeEnabled
    ? "筆 Kuas halus"
    : "線 Mode standar";
  resetStrokes();
};
document.getElementById("nextQuiz").onclick = () => { quizIndex = (quizIndex + 1) % 4; renderQuiz(); };
document.querySelectorAll(".quiz-types span").forEach((tab, index) => {
  tab.onclick = () => {
    quizIndex = index;
    renderQuiz();
  };
});
document.querySelector(".sound").onclick = () =>
  speakJapanese(kanjiLessons[activeIndex].char);
document.querySelectorAll("[data-reading-audio]").forEach((button) => {
  button.onclick = () => {
    const item = kanjiLessons[activeIndex];
    const source = button.dataset.readingAudio === "on" ? item.on : item.kun;
    const reading = source
      .split(",")
      .map((part) => romajiToHiragana(part.trim()))
      .filter(Boolean)
      .join("、");
    speakJapanese(reading);
  };
});
document.getElementById("playAllWords").onclick = () => {
  speechSynthesis.cancel();
  kanjiLessons[activeIndex].words.forEach(([word]) =>
    speakJapanese(word, false),
  );
};
document.getElementById("playContextSentence").onclick = () =>
  speakJapanese(document.getElementById("contextSentenceJapanese").textContent);

const kanjiStage = document.querySelector(".kanji-stage");
const fullscreenButton = document.getElementById("fullscreenCalligraphy");
fullscreenButton.onclick = async () => {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
  } else if (kanjiStage.requestFullscreen) {
    await kanjiStage.requestFullscreen();
  } else {
    kanjiStage.classList.toggle("calligraphy-expanded");
  }
};
document.addEventListener("fullscreenchange", () => {
  const isFullscreen = document.fullscreenElement === kanjiStage;
  fullscreenButton.textContent = isFullscreen ? "× Keluar layar penuh" : "⛶ Layar penuh";
  if (isFullscreen) resetStrokes();
});

const canvas = document.getElementById("writingCanvas");
const context = canvas.getContext("2d");
let drawing = false;
function canvasPoint(event) {
  const box = canvas.getBoundingClientRect();
  const point = event.touches?.[0] || event;
  return { x: (point.clientX - box.left) * (canvas.width / box.width), y: (point.clientY - box.top) * (canvas.height / box.height) };
}
function startDrawing(event) { drawing = true; const point = canvasPoint(event); context.beginPath(); context.moveTo(point.x, point.y); event.preventDefault(); }
function draw(event) { if (!drawing) return; const point = canvasPoint(event); context.lineWidth = 12; context.lineCap = "round"; context.strokeStyle = "#172f4c"; context.lineTo(point.x, point.y); context.stroke(); event.preventDefault(); }
function stopDrawing() { drawing = false; }
canvas.addEventListener("pointerdown", startDrawing); canvas.addEventListener("pointermove", draw); window.addEventListener("pointerup", stopDrawing);
document.getElementById("clearCanvas").onclick = () => context.clearRect(0, 0, canvas.width, canvas.height);
document.getElementById("traceToggle").onclick = () => document.querySelector(".writing-board").classList.toggle("hide-guide");

document.querySelectorAll(".topbar nav button").forEach((button, index) => {
  button.onclick = () => {
    const destinations = ["dashboard", "materials", "kanji-study", "memorization", "test"];
    location.href = `index.html?build=28#${destinations[index]}`;
  };
});

updateCounts();
applyFilters();
updateHeroStats();
selectKanji(0);
