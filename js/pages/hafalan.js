/* Halaman Hafalan (pages/hafalan.html): flashcard kosakata/kanji per Bab +
   materi lengkap Hiragana/Katakana. Dibungkus initPage(), dijalankan auth.js
   setelah login. Dipecah dari app.js lama - state flashcard (state/category/
   index) dan seluruh isi #memorization dulu tercampur dengan kode Kanji versi
   lama yang sudah tidak pernah tampil (ditimpa iframe sejak lama) - bagian
   itu TIDAK dibawa ke sini karena terbukti tidak tercapai lagi. */
function initPage() {
  let state = JSON.parse(
    localStorage.getItem("nihonBenkyoProgress") || '{"mastered":0}',
  );
  // Kategori terakhir diingat per-tab (sessionStorage) supaya pindah ke
  // Dashboard sebentar lalu balik ke sini tidak mengulang dari Bab 1 -
  // sebelumnya (saat Hafalan masih section SPA, bukan halaman sendiri)
  // pindah antar menu tidak memuat ulang dokumen sama sekali.
  let category = sessionStorage.getItem("hafalanCategory") || "noun";
  let index = 0;
  function save() {
    localStorage.setItem("nihonBenkyoProgress", JSON.stringify(state));
  }
  function syncShell() {
    if (typeof window.refreshShellXp === "function") window.refreshShellXp();
  }

  const flash = document.getElementById("flashcard");
  let renderCard = () => {};
  let updateMaster = () => {};

  flash.onclick = () => flash.classList.toggle("flipped");
  flash.onkeydown = (e) => {
    if (e.key === "Enter" || e.key === " ") flash.click();
  };

  function nextCard(master) {
    const word = deck[category]?.[index]?.[0];
    if (word) srsReview(`hafalan:${category}:${word}`, master ? "good" : "again");
    if (master) {
      state.mastered++;
      save();
      syncShell();
    }
    index = (index + 1) % (deck[category]?.length || 1);
    renderCard();
    updateMaster();
  }
  document.getElementById("again").onclick = () => nextCard(false);
  document.getElementById("known").onclick = () => nextCard(true);

  const hafalanStyle = document.createElement("style");
  hafalanStyle.textContent = `
      .study-section-label{width:100%;font-size:10px;font-weight:700;letter-spacing:1.3px;color:#a37d42;text-transform:uppercase;margin:4px 0 -2px}
      .memory-routes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:0 0 18px}.memory-route{border:1px solid #dfd7cb;background:#fffdf9e8;border-radius:10px;padding:18px;text-align:left;color:var(--ink);cursor:pointer;transition:transform .18s,border-color .18s,box-shadow .18s}.memory-route:hover{transform:translateY(-2px);border-color:#b99152;box-shadow:0 9px 20px #4d351510}.memory-route b{display:block;color:var(--navy);font-size:16px;margin:4px 0 6px}.memory-route small{color:var(--muted);line-height:1.55}.route-icon{font:600 23px "Zen Kaku Gothic New";color:#a27637}@media(max-width:780px){.memory-routes{grid-template-columns:1fr}}
      .kana-curriculum{margin-top:22px}.kana-curriculum h2{color:var(--navy);margin:0 0 7px}.kana-curriculum>p{color:var(--muted);line-height:1.6;margin:0 0 15px}.kana-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.kana-panel{overflow:hidden}.kana-panel h3{margin:0 0 5px}.kana-panel>p{margin:0 0 13px;color:var(--muted);font-size:12px;line-height:1.5}.kana-table{width:100%;border-collapse:separate;border-spacing:5px}.kana-table td{width:20%;text-align:center;background:#f7f3eb;border:1px solid #e7dfd1;border-radius:6px;padding:7px 3px;color:#687182;font-size:10px}.kana-table td b{display:block;font:600 22px "Zen Kaku Gothic New";color:var(--navy);margin-bottom:2px}.kana-table td.empty{background:transparent;border-color:transparent}.kana-section-title{font-size:10px;font-weight:800;letter-spacing:1.2px;color:#a37d42;margin:18px 0 5px;text-transform:uppercase}.kana-reading{margin-top:14px;padding:14px 15px;background:#f8f2e9;border-left:3px solid #b98546;color:#4b5667;line-height:1.7}.kana-reading b{color:var(--navy)}.kana-reading .jp-read{display:block;font:600 16px "Zen Kaku Gothic New";color:var(--navy);margin:6px 0}.kana-tips{margin-top:14px}.kana-tips li{color:#667184;line-height:1.65;margin:5px 0}@media(max-width:760px){.kana-grid{grid-template-columns:1fr}.kana-table td b{font-size:20px}}
      .kana-cell{cursor:pointer;transition:transform .12s,box-shadow .12s}.kana-cell:hover,.kana-cell:focus-visible{transform:translateY(-2px);box-shadow:0 6px 14px #1d2a3d1c;outline:none;background:#f3ecdb!important}
      .kana-modal-backdrop{position:fixed;inset:0;background:#13243ecc;display:none;align-items:center;justify-content:center;z-index:80;padding:20px}
      .kana-modal-backdrop.open{display:flex}
      .kana-modal-card{background:var(--paper);border-radius:14px;max-width:420px;width:100%;padding:26px;position:relative;box-shadow:0 30px 70px #0b142c40;text-align:center}
      .kana-modal-close{position:absolute;top:12px;right:12px;border:0;background:#f0ebe1;color:#586477;width:30px;height:30px;border-radius:50%;font-size:16px;cursor:pointer;line-height:1}
      .kana-modal-close:hover{background:#e4ddcd}
      .kana-modal-boards{display:flex;align-items:flex-end;justify-content:center;gap:14px;margin:8px 0 18px}
      .kana-board{position:relative;background:linear-gradient(145deg,#fffefb,#f7f1e7);border:1px solid #decdb4;border-radius:10px;box-shadow:inset 0 0 0 6px #ffffff80,0 10px 22px #40210d10;overflow:hidden}
      .kana-board:before,.kana-board:after{content:'';position:absolute;background:#c9bda966}
      .kana-board:before{width:1px;top:0;bottom:0;left:50%}
      .kana-board:after{height:1px;left:0;right:0;top:50%}
      .kana-board-main{width:190px;height:190px}
      .kana-board-small{width:104px;height:104px;margin-bottom:6px}
      .kana-board-char{position:absolute;inset:0;display:grid;place-items:center;font:400 62% "Zen Kaku Gothic New";color:#1b304d;opacity:.13;z-index:1}
      .kana-board-badge{position:absolute;top:6px;right:6px;background:#fffdf9e8;color:#805f2c;border:1px solid #d5c49f;border-radius:999px;padding:3px 7px;font-size:9px;font-weight:700;z-index:3}
      .kana-stroke-svg{position:absolute;inset:0;width:100%;height:100%;z-index:2}
      .kana-stroke-svg path{fill:none;stroke:#9f1c14;stroke-width:7.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;opacity:0;transition:stroke-dashoffset .62s cubic-bezier(.22,.75,.25,1),opacity .16s ease-out;filter:drop-shadow(.25px .45px .15px #65100b55)}
      .kana-stroke-svg path.shown{opacity:1;stroke-dashoffset:0}
      .kana-stroke-svg path.reset{transition:none}
      .kana-modal-romaji{font:700 22px "DM Sans";color:var(--navy);margin-bottom:6px}
      .kana-modal-hint{color:var(--muted);font-size:12px;line-height:1.6;margin:0}
      @media(max-width:480px){.kana-board-main{width:150px;height:150px}.kana-board-small{width:84px;height:84px}}
      .bab-filter-row{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:2px}
      .bab-select{border:1px solid #ded9d0;background:#fffdf9;color:#3a4252;border-radius:20px;padding:8px 13px;font:600 12px "DM Sans";cursor:pointer}
      .bab-note{color:var(--muted);font-size:11px;margin:8px 0 10px}
      .bab-total-info{color:#7a6a3f;background:#f8f2e3;border:1px solid #e7d9b8;border-radius:7px;padding:8px 11px;font-size:11px;line-height:1.5;margin:2px 0 16px}
      .hafalan-hidden{display:none!important}
      .memory-route.active{border-color:#142945;background:#f0ebe1;box-shadow:0 9px 20px #4d351522}
      .hafalan-panel-hint{color:var(--muted);font-size:12px;margin:0 0 18px;text-align:center;padding:14px;border:1px dashed #d8cfba;border-radius:10px}
    `;
  document.head.appendChild(hafalanStyle);

  deck.hiragana = [
    ["あ", "a", "Hiragana a"],
    ["か", "ka", "Hiragana ka"],
    ["さ", "sa", "Hiragana sa"],
    ["た", "ta", "Hiragana ta"],
    ["こんにちは", "halo", "konnichiwa"],
  ];
  deck.katakana = [
    ["ア", "a", "Katakana a"],
    ["カ", "ka", "Katakana ka"],
    ["サ", "sa", "Katakana sa"],
    ["タ", "ta", "Katakana ta"],
    ["コーヒー", "kopi", "koohii"],
  ];

  /* Hafalan per Bab (Minna no Nihongo), lengkap Bab 1-50. Kosakata = SEMUA
     kata di bab itu (baik ada kanji maupun tidak). Kanji = subset kata yang
     ada tulisan kanjinya, ditambahkan juga di sini khusus untuk latihan
     cara baca. */
  const MAX_BAB_LOADED = 50;
  for (let n = 1; n <= MAX_BAB_LOADED; n++) {
    deck["bab" + n + "-kosakata"] = (babKosakataData[n] || []).map((item) => [
      item[0],
      item[1],
      "",
    ]);
    deck["bab" + n + "-kanji"] = (babKanjiData[n] || []).map((item) => [
      item[0],
      item[2],
      item[1],
    ]);
  }

  const memorizationView = document.getElementById("memorization");

  /* Materi lengkap kana (Hiragana/Katakana): tabel, dakuten/handakuten,
     yoon, latihan membaca. */
  function char(code) {
    return code === null ? "" : String.fromCodePoint(code);
  }
  function kanaTable(rows, script) {
    return (
      '<table class="kana-table"><tbody>' +
      rows
        .map(
          (row) =>
            "<tr>" +
            row
              .map((cell) => {
                const symbol =
                  script === "hira"
                    ? char(cell[1])
                    : script === "kata"
                      ? char(cell[2])
                      : cell[script === "hy" ? 1 : 2];
                return symbol
                  ? '<td class="kana-cell" data-kana="' +
                      symbol +
                      '" data-romaji="' +
                      cell[0] +
                      '" tabindex="0" role="button" aria-label="Cara menulis ' +
                      symbol +
                      ", " +
                      cell[0] +
                      '"><b>' +
                      symbol +
                      "</b>" +
                      cell[0] +
                      "</td>"
                  : '<td class="empty"></td>';
              })
              .join("") +
            "</tr>",
        )
        .join("") +
      "</tbody></table>"
    );
  }
  const kanaSection = document.createElement("section");
  kanaSection.className = "kana-curriculum";
  kanaSection.innerHTML =
    '<div class="head"><div><div class="eyebrow">Materi lengkap kana</div><h2>Hiragana dan Katakana</h2><p>Pelajari seluruh huruf dasar, bunyi tambahan, kombinasi bunyi, serta latihan baca.</p></div></div><div class="kana-grid"><article class="card kana-panel"><h3>Hiragana</h3><p>Digunakan untuk kata asli Jepang, partikel, dan akhiran tata bahasa.</p>' +
    kanaTable(kanaRows, "hira") +
    '</article><article class="card kana-panel"><h3>Katakana</h3><p>Digunakan untuk kata serapan, nama asing, bunyi asing, dan penekanan.</p>' +
    kanaTable(kanaRows, "kata") +
    '</article></div><div class="kana-grid" style="margin-top:14px"><article class="card kana-panel"><div class="kana-section-title">Dakuten dan handakuten</div><p>Tambahkan tanda dua garis atau lingkaran kecil untuk mengubah bunyi.</p>' +
    kanaTable(voicedRows, "hira") +
    '</article><article class="card kana-panel"><div class="kana-section-title">Dakuten dan handakuten</div><p>Versi Katakana dari bunyi yang sama.</p>' +
    kanaTable(voicedRows, "kata") +
    '</article></div><div class="kana-grid" style="margin-top:14px"><article class="card kana-panel"><div class="kana-section-title">Kombinasi bunyi - Yoon</div><p>Gabungkan huruf i dengan ya, yu, atau yo kecil.</p>' +
    kanaTable(yoonRows, "hy") +
    '</article><article class="card kana-panel"><div class="kana-section-title">Kombinasi bunyi - Yoon</div><p>Versi Katakana untuk kata serapan dan nama asing.</p>' +
    kanaTable(yoonRows, "ky") +
    '</article></div><div class="kana-grid" style="margin-top:14px"><article class="card kana-panel"><h3>Latihan membaca Hiragana</h3><div class="kana-reading"><b>Kata latihan</b><span class="jp-read">こんにちは　がっこう　にほんご</span>konnichiwa - sekolah - bahasa Jepang<br><br><b>Cerita pendek</b><span class="jp-read">きょうは がっこうへ いきます。ともだちと べんきょうします。</span>Hari ini saya pergi ke sekolah. Saya belajar bersama teman.</div></article><article class="card kana-panel"><h3>Latihan membaca Katakana</h3><div class="kana-reading"><b>Kata latihan</b><span class="jp-read">コーヒー　テレビ　レストラン</span>koohii - televisi - restoran<br><br><b>Aturan penting</b><span class="jp-read">ー　ッ</span>Garis panjang memperpanjang vokal. Tsu kecil menunjukkan konsonan ganda, misalnya: カップ (kappu).</div></article></div><article class="card kana-tips"><h3>Urutan belajar yang disarankan</h3><ul><li>Hafalkan 5 vokal, lalu baris ka sampai wa pada Hiragana.</li><li>Tulis setiap huruf 5 kali sambil mengucapkan bunyinya.</li><li>Ulangi pola yang sama pada Katakana.</li><li>Pelajari dakuten, handakuten, yoon, lalu lanjutkan ke kata dan cerita pendek.</li></ul></article>';
  memorizationView.appendChild(kanaSection);

  /* Modul latihan menulis Hiragana/Katakana: klik satu huruf untuk melihat
     animasi urutan goresannya. */
  const kanaModalBackdrop = document.createElement("div");
  kanaModalBackdrop.className = "kana-modal-backdrop";
  kanaModalBackdrop.id = "kanaModalBackdrop";
  kanaModalBackdrop.setAttribute("aria-hidden", "true");
  kanaModalBackdrop.innerHTML =
    '<div class="kana-modal-card" role="dialog" aria-modal="true"><button class="kana-modal-close" aria-label="Tutup">×</button><div class="kana-modal-boards"></div><div class="kana-modal-romaji"></div><p class="kana-modal-hint">Amati arah dan urutan goresan, lalu tirukan pada kertas atau kotak latihan.</p></div>';
  document.body.appendChild(kanaModalBackdrop);
  let kanaModalToken = 0;
  function animateKanaStrokes(svg, token) {
    const paths = Array.from(svg.querySelectorAll("path"));
    if (!paths.length) return;
    let visible = 0;
    const step = () => {
      if (token !== kanaModalToken) return;
      if (visible < paths.length) {
        paths[visible].classList.add("shown");
        visible++;
        setTimeout(step, 620);
      } else {
        setTimeout(() => {
          if (token !== kanaModalToken) return;
          paths.forEach((p) => {
            p.classList.add("reset");
            p.classList.remove("shown");
          });
          void svg.offsetWidth;
          paths.forEach((p) => p.classList.remove("reset"));
          visible = 0;
          setTimeout(step, 280);
        }, 1400);
      }
    };
    step();
  }
  function openKanaWritingModal(symbol, romaji) {
    kanaModalToken++;
    const token = kanaModalToken;
    const boards = kanaModalBackdrop.querySelector(".kana-modal-boards");
    boards.innerHTML = "";
    const chars = Array.from(symbol);
    chars.forEach((ch, i) => {
      const strokes = kanaStrokePaths[ch] || [];
      const board = document.createElement("div");
      board.className =
        "kana-board " +
        (chars.length > 1 && i > 0 ? "kana-board-small" : "kana-board-main");
      board.innerHTML =
        '<span class="kana-board-char">' +
        ch +
        '</span><span class="kana-board-badge">Goresan 1-' +
        strokes.length +
        '</span><svg class="kana-stroke-svg" viewBox="0 0 109 109" aria-label="Animasi menulis ' +
        ch +
        '">' +
        strokes
          .map((d) => '<path pathLength="1" d="' + d + '"></path>')
          .join("") +
        "</svg>";
      boards.appendChild(board);
      animateKanaStrokes(board.querySelector(".kana-stroke-svg"), token);
    });
    kanaModalBackdrop.querySelector(".kana-modal-romaji").textContent =
      symbol + " — " + romaji;
    kanaModalBackdrop.classList.add("open");
    kanaModalBackdrop.setAttribute("aria-hidden", "false");
  }
  function closeKanaWritingModal() {
    kanaModalToken++;
    kanaModalBackdrop.classList.remove("open");
    kanaModalBackdrop.setAttribute("aria-hidden", "true");
  }
  kanaModalBackdrop.addEventListener("click", (e) => {
    if (e.target === kanaModalBackdrop) closeKanaWritingModal();
  });
  kanaModalBackdrop
    .querySelector(".kana-modal-close")
    .addEventListener("click", closeKanaWritingModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && kanaModalBackdrop.classList.contains("open"))
      closeKanaWritingModal();
  });
  document.addEventListener("click", (e) => {
    const cell = e.target.closest(".kana-cell");
    if (!cell) return;
    openKanaWritingModal(cell.dataset.kana, cell.dataset.romaji);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const cell = e.target.closest && e.target.closest(".kana-cell");
    if (!cell) return;
    e.preventDefault();
    openKanaWritingModal(cell.dataset.kana, cell.dataset.romaji);
  });

  /* Filter bar akhir: pilih Bab + mode Kosakata/Kanji. */
  const filterBox2 = memorizationView.querySelector(".filters");
  let babOptions = "";
  for (let n = 1; n <= MAX_BAB_LOADED; n++)
    babOptions += '<option value="' + n + '">Bab ' + n + "</option>";
  filterBox2.insertAdjacentHTML(
    "afterend",
    '<p class="bab-note">Kosakata dan kanji diambil dari daftar kata Minna no Nihongo, lengkap Bab 1-' +
      MAX_BAB_LOADED +
      ".</p>",
  );
  filterBox2.innerHTML =
    '<span class="study-section-label">Hafalan per Bab (Minna no Nihongo)</span><div class="bab-filter-row"><select id="babSelect" class="bab-select" aria-label="Pilih Bab">' +
    babOptions +
    '</select><button class="filter active" data-mode="kosakata">Kosakata</button><button class="filter" data-mode="kanji">Kanji</button></div><p class="bab-total-info" id="babTotalInfo"></p>';
  const babSelectEl = filterBox2.querySelector("#babSelect");
  const babTotalInfoEl = filterBox2.querySelector("#babTotalInfo");
  const savedBab = sessionStorage.getItem("hafalanBab");
  if (savedBab && babSelectEl.querySelector(`option[value="${savedBab}"]`))
    babSelectEl.value = savedBab;
  let babMode = sessionStorage.getItem("hafalanBabMode") || "kosakata";
  filterBox2
    .querySelectorAll("[data-mode]")
    .forEach((btn) => btn.classList.toggle("active", btn.dataset.mode === babMode));

  function applyBabCategory() {
    category = "bab" + babSelectEl.value + "-" + babMode;
    sessionStorage.setItem("hafalanBab", babSelectEl.value);
    sessionStorage.setItem("hafalanBabMode", babMode);
    sessionStorage.setItem("hafalanCategory", category);
    index = 0;
    state.mastered = 0;
    renderCard();
    updateMaster();
    if (babTotalInfoEl) {
      const n = babSelectEl.value;
      const kCount = (babKosakataData[n] || []).length;
      const jCount = (babKanjiData[n] || []).length;
      babTotalInfoEl.textContent =
        "Bab " +
        n +
        " punya " +
        kCount +
        " kosakata total (semua kata di bab ini, termasuk yang ada kanjinya). " +
        jCount +
        " di antaranya juga tersedia di mode Kanji untuk latihan cara baca.";
    }
  }
  babSelectEl.onchange = applyBabCategory;
  filterBox2.querySelectorAll("[data-mode]").forEach(
    (button) =>
      (button.onclick = () => {
        babMode = button.dataset.mode;
        filterBox2
          .querySelectorAll("[data-mode]")
          .forEach((other) => other.classList.toggle("active", other === button));
        applyBabCategory();
        showHafalanPanel("flash");
      }),
  );

  renderCard = () => {
    const list = deck[category] || [];
    const modeLabel = babMode === "kanji" ? "Kanji" : "Kosakata";
    const label = "Bab " + babSelectEl.value + " · " + modeLabel;
    if (!list.length) {
      document.getElementById("front").textContent = "—";
      document.getElementById("back").textContent =
        "Belum ada data kanji untuk bab ini.";
      document.getElementById("reading").textContent = "";
      document.getElementById("cardCount").textContent = "0 kartu · " + label;
      flash.classList.remove("flipped");
      return;
    }
    const c = list[index];
    document.getElementById("front").textContent = c[0];
    document.getElementById("back").textContent = c[1];
    document.getElementById("reading").textContent = c[2] || "";
    document.getElementById("cardCount").textContent =
      "Kartu " + (index + 1) + " dari " + list.length + " · " + label;
    flash.classList.remove("flipped");
  };
  updateMaster = () => {
    const list = deck[category] || [];
    const total = list.length || 1;
    const p = Math.min(100, Math.round((state.mastered / total) * 100));
    document.getElementById("mastered").textContent = state.mastered + " kata";
    document.getElementById("masterPct").textContent = p + "%";
    document.getElementById("masterBar").style.width = p + "%";
  };

  const flashLayoutEl = memorizationView.querySelector(".flash-layout");
  const kanaCurriculumEl = memorizationView.querySelector(".kana-curriculum");
  const panelHintEl = memorizationView.querySelector("#hafalanPanelHint");
  const routeButtons = Array.from(memorizationView.querySelectorAll(".memory-route"));
  function showHafalanPanel(which) {
    if (flashLayoutEl) flashLayoutEl.classList.toggle("hafalan-hidden", which !== "flash");
    if (kanaCurriculumEl) kanaCurriculumEl.classList.toggle("hafalan-hidden", which !== "kana");
    if (panelHintEl) panelHintEl.classList.toggle("hafalan-hidden", !!which);
    routeButtons.forEach((button) =>
      button.classList.toggle(
        "active",
        (which === "kana" && button.dataset.memory === "hiragana") ||
          (which === "flash" && button.dataset.memory === "noun"),
      ),
    );
    if (which) sessionStorage.setItem("hafalanPanel", which);
  }
  const hiraganaRoute = memorizationView.querySelector('[data-memory="hiragana"]');
  if (hiraganaRoute)
    hiraganaRoute.onclick = () => {
      showHafalanPanel("kana");
      if (kanaCurriculumEl)
        kanaCurriculumEl.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  const nounRoute = memorizationView.querySelector('[data-memory="noun"]');
  if (nounRoute)
    nounRoute.onclick = () => {
      babMode = "kosakata";
      filterBox2
        .querySelectorAll("[data-mode]")
        .forEach((other) => other.classList.toggle("active", other.dataset.mode === "kosakata"));
      applyBabCategory();
      showHafalanPanel("flash");
      if (flashLayoutEl) flashLayoutEl.scrollIntoView({ behavior: "smooth", block: "start" });
    };

  applyBabCategory();
  showHafalanPanel(sessionStorage.getItem("hafalanPanel") || null);
}
window.initPage = initPage;
