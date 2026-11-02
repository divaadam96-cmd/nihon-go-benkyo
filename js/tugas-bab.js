/* Target & tugas per Bab + kunci bab berurutan (dipakai halaman Materi).

   Setiap Bab punya target:
     1. materi          - siswa menekan "Sudah paham" setelah membaca materi
     2. kotoba (2)      - pilihan ganda Jepang->Indonesia & Indonesia->Jepang,
                          semua kosakata bab itu (data/bab-data.js, sama
                          dengan fitur Hafalan)
     3. kanji (4)       - kanji->hiragana, hiragana->kanji, kanji->Indonesia,
                          Indonesia->kanji (babKanjiData, Hafalan Kanji)
     4. kalimat (2)     - susun kalimat (tulis urutan nomor) & pilih kalimat
                          Jepang yang benar (data/tugas-kalimat-data.js;
                          bab tanpa data kalimat tidak mewajibkannya)
   Bab N+1 terbuka untuk SISWA kalau materi Bab N sudah ditandai paham,
   SEMUA tugas Bab N sudah dikerjakan, dan RATA-RATA skor terbaik semua
   tugasnya >= TUGAS_KKM (satu tugas boleh di bawah KKM asal rata-ratanya
   cukup). Sensei/Operator tidak pernah dikunci.
   Hasil disimpan di server (tabel bab_targets lewat RPC catat_target_bab,
   supabase/add-target-bab.sql) + cache localStorage per akun. Kalau
   server gagal, hasil tetap dipakai dari cache dan dikirim ulang saat
   halaman dibuka lagi. Setiap kali tugas dikerjakan ulang, urutan soal &
   pilihan diacak ulang. */
(function () {
  const TUGAS_KKM = 80; // samakan dengan target_bab_kkm() di SQL
  const TUGAS_KALIMAT_JUMLAH = 10;
  const MAX_BAB = 50;

  const TARGET_INFO = {
    materi: { grup: "materi", judul: "Baca & pahami materi" },
    "kotoba-jp-id": { grup: "kotoba", judul: "Jepang → Indonesia", ket: "Soal menampilkan kotoba bahasa Jepang, pilih arti bahasa Indonesia yang benar." },
    "kotoba-id-jp": { grup: "kotoba", judul: "Indonesia → Jepang", ket: "Soal menampilkan arti bahasa Indonesia, pilih kotoba bahasa Jepang yang benar." },
    "kanji-kanji-kana": { grup: "kanji", judul: "Kanji → Hiragana", ket: "Pilih cara baca (hiragana) yang benar untuk kanji." },
    "kanji-kana-kanji": { grup: "kanji", judul: "Hiragana → Kanji", ket: "Pilih tulisan kanji yang benar untuk hiragana." },
    "kanji-kanji-id": { grup: "kanji", judul: "Kanji → Indonesia", ket: "Pilih arti bahasa Indonesia yang benar untuk kanji." },
    "kanji-id-kanji": { grup: "kanji", judul: "Indonesia → Kanji", ket: "Pilih kanji yang benar untuk arti bahasa Indonesia." },
    "kalimat-susun": { grup: "kalimat", judul: "Susun kalimat", ket: "Kata-kata diberi nomor - tuliskan urutan nomor yang membentuk kalimat yang benar." },
    "kalimat-pilih": { grup: "kalimat", judul: "Pilih kalimat Jepang", ket: "Soal menampilkan kalimat bahasa Indonesia, pilih kalimat bahasa Jepang yang benar." },
  };
  const GRUP = [
    { key: "kotoba", judul: "Tugas 1 · Hafalan kotoba" },
    { key: "kanji", judul: "Tugas 2 · Hafalan kanji" },
    { key: "kalimat", judul: "Tugas 3 · Menyusun kalimat" },
  ];

  const babDataUrl = new URL("../data/bab-data.js", document.currentScript.src).href;
  let rows = {}; // "bab:target" -> { skor_terbaik, skor_terakhir, percobaan, lulus, pending? }
  let serverOk = null; // null = belum dicoba, false = gagal (pakai cache)
  const listeners = [];

  // === Utilitas ===
  function esc(text) {
    return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }
  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  function norm(text) {
    return String(text).toLowerCase().replace(/\s+/g, "");
  }
  function uid() {
    return window.currentProfile?.id || "";
  }
  function isStaff() {
    const role = window.currentProfile?.role;
    return role === "sensei" || role === "operator";
  }
  function cacheKey() {
    return `nihonBenkyoTargetBabV1:${uid()}`;
  }
  function saveCache() {
    try {
      localStorage.setItem(cacheKey(), JSON.stringify(rows));
    } catch {
      // Penyimpanan tidak tersedia - status tetap ada selama halaman terbuka.
    }
  }
  function loadCache() {
    try {
      rows = JSON.parse(localStorage.getItem(cacheKey()) || "{}") || {};
    } catch {
      rows = {};
    }
  }
  function notify() {
    listeners.forEach((fn) => {
      try {
        fn();
      } catch (error) {
        console.error(error);
      }
    });
  }

  // === Status target & kunci ===
  function targetsFor(bab) {
    const list = ["materi", "kotoba-jp-id", "kotoba-id-jp", "kanji-kanji-kana", "kanji-kana-kanji", "kanji-kanji-id", "kanji-id-kanji"];
    if (tugasLengkap(bab)) list.push("kalimat-susun", "kalimat-pilih");
    return list;
  }
  /* Bab dengan tugas lengkap (termasuk soal kalimat) - tahap latihan lama
     di Materi disembunyikan untuk bab ini. */
  function tugasLengkap(bab) {
    return typeof tugasKalimatData !== "undefined" && !!tugasKalimatData[bab];
  }
  function rowFor(bab, target) {
    return rows[`${bab}:${target}`] || null;
  }
  function isPassed(bab, target) {
    return !!rowFor(bab, target)?.lulus;
  }
  /* materi: sudah ditandai paham; tugas: jumlah tugas yang sudah
     dikerjakan (minimal sekali) dari totalTugas; rataRata: rata-rata skor
     terbaik SEMUA tugas (tugas yang belum dikerjakan dihitung 0). */
  function progress(bab) {
    const tugas = targetsFor(bab).filter((t) => t !== "materi");
    const skor = tugas.map((t) => rowFor(bab, t)?.skor_terbaik ?? null);
    const dikerjakan = skor.filter((v) => v !== null).length;
    const rataRata = Math.floor(skor.reduce((sum, v) => sum + (v || 0), 0) / tugas.length);
    return { materi: isPassed(bab, "materi"), dikerjakan, totalTugas: tugas.length, rataRata };
  }
  function isComplete(bab) {
    const p = progress(bab);
    return p.materi && p.dikerjakan === p.totalTugas && p.rataRata >= TUGAS_KKM;
  }
  /* Kalimat singkat apa yang masih kurang, untuk pemberitahuan kunci. */
  function kekurangan(bab) {
    const p = progress(bab);
    const kurang = [];
    if (!p.materi) kurang.push("tandai materi sudah paham");
    if (p.dikerjakan < p.totalTugas) kurang.push(`kerjakan ${p.totalTugas - p.dikerjakan} tugas lagi`);
    if (p.rataRata < TUGAS_KKM) kurang.push(`naikkan rata-rata nilai tugas dari ${p.rataRata} ke minimal ${TUGAS_KKM}`);
    return kurang;
  }
  function isLocked(bab) {
    if (isStaff() || bab <= 1) return false;
    return !isComplete(bab - 1);
  }
  /* Bab paling awal yang belum tuntas (titik belajar siswa saat ini). */
  function frontierBab() {
    for (let bab = 1; bab <= MAX_BAB; bab++) if (!isComplete(bab)) return bab;
    return MAX_BAB;
  }

  // === Server ===
  function applyServerRow(row) {
    const key = `${row.bab}:${row.target}`;
    const local = rows[key];
    rows[key] = {
      skor_terbaik: row.skor_terbaik,
      skor_terakhir: row.skor_terakhir,
      percobaan: row.percobaan,
      lulus: row.lulus,
    };
    // Hasil lokal yang belum terkirim & lebih baik tetap ditandai pending.
    if (local?.pending && ((local.lulus && !row.lulus) || local.skor_terbaik > row.skor_terbaik)) {
      rows[key] = { ...local };
    }
  }
  async function sendPending() {
    const pending = Object.entries(rows).filter(([, r]) => r.pending);
    for (const [key, r] of pending) {
      const [bab, target] = key.split(/:(.+)/);
      const total = target === "materi" ? 1 : 100;
      const benar = target === "materi" ? 1 : r.skor_terbaik;
      const { data, error } = await window.supabaseClient.rpc("catat_target_bab", {
        p_bab: Number(bab), p_target: target, p_benar: benar, p_total: total,
      });
      if (error) return;
      applyServerRow(data);
    }
  }
  let initPromise = null;
  function init() {
    if (initPromise) return initPromise;
    loadCache();
    initPromise = (async () => {
      if (!window.supabaseClient || !uid()) return;
      try {
        const { data, error } = await window.supabaseClient
          .from("bab_targets")
          .select("bab, target, skor_terbaik, skor_terakhir, percobaan, lulus")
          .eq("siswa_id", uid());
        if (error) throw error;
        const pendingRows = Object.fromEntries(Object.entries(rows).filter(([, r]) => r.pending));
        rows = pendingRows;
        data.forEach(applyServerRow);
        serverOk = true;
        await sendPending();
      } catch (error) {
        console.warn("Target bab: server tidak tersedia, memakai data lokal.", error);
        serverOk = false;
      }
      saveCache();
      notify();
    })();
    return initPromise;
  }

  async function record(bab, target, benar, total) {
    const skor = Math.floor((100 * benar) / total);
    const key = `${bab}:${target}`;
    const prev = rows[key] || { skor_terbaik: 0, percobaan: 0, lulus: false };
    rows[key] = {
      skor_terbaik: Math.max(prev.skor_terbaik, skor),
      skor_terakhir: skor,
      percobaan: prev.percobaan + 1,
      lulus: prev.lulus || skor >= TUGAS_KKM,
      pending: true,
    };
    saveCache();
    notify();
    let saved = false;
    if (window.supabaseClient && uid()) {
      try {
        const { data, error } = await window.supabaseClient.rpc("catat_target_bab", {
          p_bab: bab, p_target: target, p_benar: benar, p_total: total,
        });
        if (error) throw error;
        rows[key] = {
          skor_terbaik: data.skor_terbaik,
          skor_terakhir: data.skor_terakhir,
          percobaan: data.percobaan,
          lulus: data.lulus,
        };
        saved = true;
        serverOk = true;
      } catch (error) {
        console.warn("Target bab: gagal menyimpan ke server, disimpan lokal dulu.", error);
        serverOk = false;
      }
    }
    saveCache();
    notify();
    return { skor, saved };
  }
  function recordMateri(bab) {
    if (isPassed(bab, "materi")) return Promise.resolve({ skor: 100, saved: true });
    return record(bab, "materi", 1, 1);
  }

  // === Bahan soal ===
  let babDataPromise = null;
  function ensureBabData() {
    if (typeof babKosakataData !== "undefined" && typeof babKanjiData !== "undefined") return Promise.resolve();
    if (babDataPromise) return babDataPromise;
    babDataPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = babDataUrl;
      script.onload = () => resolve();
      script.onerror = () => {
        babDataPromise = null;
        reject(new Error("Gagal memuat data kosakata."));
      };
      document.head.appendChild(script);
    });
    return babDataPromise;
  }
  function kotobaItems(bab) {
    return (babKosakataData[bab] || []).map(([jp, id]) => ({ jp, kana: jp, id }));
  }
  function kanjiItems(bab) {
    return (babKanjiData[bab] || []).map(([kanji, kana, id]) => ({ kanji, kana, id }));
  }

  /* Kelompok makna (data/tugas-kategori-data.js), dicari lewat cara baca. */
  let kategoriIndex = null;
  function kategoriOf(kana) {
    if (!kategoriIndex) {
      kategoriIndex = {};
      const data = typeof tugasKategoriKata !== "undefined" ? tugasKategoriKata : {};
      Object.entries(data).forEach(([nama, kata]) => kata.forEach((k) => (kategoriIndex[norm(k)] = nama)));
    }
    return kategoriIndex[norm(kana)] || null;
  }
  /* Seberapa mirip bentuk dua pilihan - dipakai untuk kata yang belum
     dikelompokkan, supaya pengecoh tidak gampang dicoret (jenis huruf
     sama, sama-sama berawalan/berakhiran ～, panjang mirip, banyak huruf
     yang sama seperti かいしゃ/かいしゃいん). */
  function scriptOf(text) {
    if (/[一-鿿]/.test(text)) return "kanji";
    if (/^[゠-ヿ～]+$/.test(text)) return "kata";
    if (/[぀-ゟ]/.test(text)) return "hira";
    return "latin";
  }
  function similarity(a, b) {
    const script = scriptOf(a);
    let score = script === scriptOf(b) ? 3 : 0;
    score += /^～|～$/.test(a) === /^～|～$/.test(b) ? 2 : -4;
    score += /[?？]/.test(a) === /[?？]/.test(b) ? 1 : -1;
    score -= Math.abs([...a].length - [...b].length) * (script === "latin" ? 0.15 : 0.6);
    const charsA = new Set(a);
    let shared = 0;
    new Set(b).forEach((ch) => {
      if (charsA.has(ch) && !/[\s,.()～…]/.test(ch)) shared++;
    });
    return score + Math.min(shared, 4) * (script === "latin" ? 0.25 : 1);
  }
  /* Pemilihan pengecoh. Kandidat dikumpulkan dari:
     1. kelompok makna yang sama (bab sama dulu, lalu bab terdekat)
     2. kata yang bentuknya paling mirip (cadangan untuk kata yang belum
        dikelompokkan / kelompoknya kurang)
     Dalam satu set soal, pilihan yang SUDAH sering muncul (sebagai
     pengecoh maupun jawaban soal lain) dinomorbelakangkan, dan dua soal
     tidak boleh punya set 4 pilihan yang persis sama - supaya pilihan
     tidak itu-itu saja. `pemakaian` direset setiap buildQuestions(). */
  let pemakaian = { kali: new Map(), set: new Set() };
  function dipakai(value) {
    return pemakaian.kali.get(norm(value)) || 0;
  }
  function catatPemakaian(values) {
    values.forEach((v) => pemakaian.kali.set(norm(v), dipakai(v) + 1));
    pemakaian.set.add(values.map(norm).sort().join("|"));
  }
  function distractors(bab, itemsOf, correct, valueOf, conflicts) {
    const answer = valueOf(correct);
    const seen = new Set([norm(answer)]);
    const kandidat = [];
    const tambah = (item, kelompok, bobot) => {
      const value = valueOf(item);
      if (seen.has(norm(value)) || conflicts(item)) return;
      seen.add(norm(value));
      kandidat.push({ value, kelompok, bobot });
    };
    const babsAt = (d) => (d === 0 ? [bab] : [bab - d, bab + d].filter((b) => b >= 1 && b <= MAX_BAB));
    const kategori = kategoriOf(correct.kana);
    if (kategori) {
      for (let d = 0; d <= MAX_BAB; d++) {
        babsAt(d).forEach((b) => itemsOf(b).forEach((item) => {
          if (kategoriOf(item.kana) === kategori) tambah(item, 0, d * 0.3);
        }));
      }
    }
    // Cadangan "mirip bentuk": bab sama & 3 bab terdekat, lebih jauh hanya bila kurang.
    for (let d = 0; d <= MAX_BAB && (d <= 3 || kandidat.length < 6); d++) {
      babsAt(d).forEach((b) => itemsOf(b).forEach((item) => tambah(item, 1, d * 0.8 - similarity(answer, valueOf(item)))));
    }
    kandidat.forEach((k) => (k.skor = k.kelompok * 1000 + dipakai(k.value) * (k.kelompok ? 3 : 2) + k.bobot + Math.random() * 1.2));
    kandidat.sort((x, y) => x.skor - y.skor);

    let picked = kandidat.slice(0, 3).map((k) => k.value);
    const tanda = (values) => values.map(norm).sort().join("|");
    // Set pilihan kembar dengan soal sebelumnya -> ganti pengecoh terakhir.
    for (let i = 3; pemakaian.set.has(tanda([answer, ...picked])) && i < kandidat.length; i++) {
      picked = [picked[0], picked[1], kandidat[i].value];
    }
    catatPemakaian([answer, ...picked]);
    return picked;
  }
  function mcQuestion(prompt, promptJp, answer, wrong, instruction) {
    return { type: "pilih", prompt, promptJp, answer, choices: shuffle([answer, ...wrong]), instruction };
  }
  function buildQuestions(bab, target) {
    pemakaian = { kali: new Map(), set: new Set() };
    if (target.startsWith("kotoba-")) {
      const items = kotobaItems(bab);
      return shuffle(items).map((item) => {
        if (target === "kotoba-jp-id") {
          const wrong = distractors(bab, kotobaItems, item, (x) => x.id, (x) => norm(x.jp) === norm(item.jp));
          return mcQuestion(item.jp, true, item.id, wrong, "Apa arti kata ini dalam bahasa Indonesia?");
        }
        const wrong = distractors(bab, kotobaItems, item, (x) => x.jp, (x) => norm(x.id) === norm(item.id));
        return mcQuestion(item.id, false, item.jp, wrong, "Apa bahasa Jepangnya?");
      });
    }
    if (target.startsWith("kanji-")) {
      const items = kanjiItems(bab);
      return shuffle(items).map((item) => {
        switch (target) {
          case "kanji-kanji-kana":
            return mcQuestion(item.kanji, true, item.kana,
              distractors(bab, kanjiItems, item, (x) => x.kana, (x) => x.kanji === item.kanji), "Bagaimana cara baca kanji ini?");
          case "kanji-kana-kanji":
            return mcQuestion(item.kana, true, item.kanji,
              distractors(bab, kanjiItems, item, (x) => x.kanji, (x) => norm(x.kana) === norm(item.kana)), "Mana tulisan kanjinya?");
          case "kanji-kanji-id":
            return mcQuestion(item.kanji, true, item.id,
              distractors(bab, kanjiItems, item, (x) => x.id, (x) => x.kanji === item.kanji), "Apa arti kanji ini?");
          default:
            return mcQuestion(item.id, false, item.kanji,
              distractors(bab, kanjiItems, item, (x) => x.kanji, (x) => norm(x.id) === norm(item.id)), "Mana kanjinya?");
        }
      });
    }
    const data = tugasKalimatData[bab];
    if (target === "kalimat-susun") {
      return shuffle(data.susun).slice(0, TUGAS_KALIMAT_JUMLAH).map((item) => {
        const indexes = item.potongan.map((_, i) => i);
        const kalimat = item.potongan.join("");
        let order = shuffle(indexes);
        // Jangan tampilkan potongan yang kebetulan sudah tersusun benar.
        while (order.length > 1 && order.map((i) => item.potongan[i]).join("") === kalimat) order = shuffle(indexes);
        // order[k] = potongan ke-berapa yang tampil sebagai nomor k+1
        const answer = indexes.map((i) => order.indexOf(i) + 1);
        return {
          type: "susun",
          prompt: item.arti,
          pieces: order.map((i) => item.potongan[i]),
          answer,
          kalimat,
          sentence: kalimat + "。",
        };
      });
    }
    return shuffle(data.pilih).slice(0, TUGAS_KALIMAT_JUMLAH).map((item) =>
      mcQuestion(item.arti, false, item.benar, item.salah, "Pilih kalimat bahasa Jepang yang benar."));
  }
  function questionCount(bab, target) {
    if (target === "materi") return 0;
    if (target.startsWith("kotoba-")) return (babKosakataData[bab] || []).length;
    if (target.startsWith("kanji-")) return (babKanjiData[bab] || []).length;
    const data = tugasKalimatData[bab];
    return Math.min(TUGAS_KALIMAT_JUMLAH, (target === "kalimat-susun" ? data.susun : data.pilih).length);
  }
  /* "3 1 2", "3-1-2", "3,1,2" atau "312" (kalau <= 9 potongan). */
  function parseOrder(text, count) {
    const trimmed = String(text).trim();
    if (!trimmed) return [];
    const parts = /[^0-9]/.test(trimmed) ? trimmed.split(/[^0-9]+/).filter(Boolean) : count <= 9 ? trimmed.split("") : [trimmed];
    return parts.map(Number);
  }

  // === Tampilan panel tugas ===
  function statusText(bab, target) {
    const row = rowFor(bab, target);
    if (!row) return { cls: "baru", text: "Belum dikerjakan" };
    if (row.skor_terbaik >= TUGAS_KKM) return { cls: "lulus", text: `✓ Skor terbaik ${row.skor_terbaik}` };
    return { cls: "ulang", text: `Skor terbaik ${row.skor_terbaik} · ulangi untuk menaikkan rata-rata` };
  }

  /* hooks: { onMateri(): tandai materi dipahami, onBukaMateri(): ke tahap 1 } */
  async function renderPanel(container, bab, hooks = {}) {
    container.dataset.tugasBab = String(bab);
    container.innerHTML = `<p class="tugas-loading">Memuat tugas Pelajaran ${bab}…</p>`;
    try {
      await ensureBabData();
    } catch (error) {
      container.innerHTML = `<p class="tugas-error">${esc(error.message)} Periksa koneksi lalu buka tab ini lagi.</p>`;
      return;
    }
    if (container.dataset.tugasBab !== String(bab)) return; // sudah pindah bab
    renderList(container, bab, hooks);
  }

  function renderList(container, bab, hooks) {
    const p = progress(bab);
    const materiDone = isPassed(bab, "materi");
    const staff = isStaff();
    const tugasTerbuka = materiDone || staff;
    const complete = isComplete(bab);
    const next = bab < MAX_BAB ? bab + 1 : null;
    const pct = Math.min(100, Math.round((p.rataRata / TUGAS_KKM) * 100));

    let html = `<div class="tugas-head"><div><div class="eyebrow">Target Pelajaran ${bab}</div><h3>${complete ? "Semua target selesai 🎉" : "Selesaikan semua target bab ini"}</h3><p>${
      next
        ? complete
          ? `Pelajaran ${next} sudah terbuka. Bab ini tetap bisa dipelajari dan dikerjakan ulang kapan saja.`
          : `Pelajaran ${next} terbuka setelah materi ditandai paham, semua ${p.totalTugas} tugas dikerjakan, dan rata-rata nilainya minimal ${TUGAS_KKM}. Tugas boleh diulang untuk menaikkan nilai.`
        : `Ini pelajaran terakhir. Kerjakan semua tugas dengan rata-rata nilai minimal ${TUGAS_KKM}.`
    }</p><p class="tugas-ringkas">${p.dikerjakan}/${p.totalTugas} tugas dikerjakan · materi ${p.materi ? "✓" : "belum ditandai"}</p></div><div class="tugas-meter${p.rataRata >= TUGAS_KKM ? " cukup" : ""}" style="--tugas-progress:${pct}%"><b>${p.rataRata}</b><span>rata-rata</span></div></div>`;
    if (staff) html += `<p class="tugas-staff-note">Anda masuk sebagai ${window.currentProfile?.role === "operator" ? "Operator" : "Sensei"}: semua bab dan tugas terbuka tanpa syarat. Kunci hanya berlaku untuk akun siswa.</p>`;
    if (serverOk === false) html += `<p class="tugas-warning">Server sedang tidak terjangkau - hasil disimpan di perangkat ini dulu dan dikirim otomatis saat halaman dibuka lagi.</p>`;

    const materiStatus = materiDone ? `<span class="tugas-status lulus">✓ Sudah dipahami</span>` : `<span class="tugas-status baru">Belum ditandai</span>`;
    html += `<section class="tugas-group"><h4>Langkah 1 · Baca materi</h4><div class="tugas-card${materiDone ? " lulus" : ""}"><div><b>Baca & pahami semua pola</b><p>Pelajari tahap-tahap sebelumnya, lalu tekan <b>Sudah paham ✓</b> di bawah materi. Tugas terbuka setelah langkah ini.</p>${materiStatus}</div><div class="tugas-card-actions"><button type="button" class="secondary" data-tugas-materi-buka>Buka materi</button>${materiDone ? "" : `<button type="button" class="primary" data-tugas-materi-paham>Sudah paham ✓</button>`}</div></div></section>`;

    GRUP.forEach((grup) => {
      const targets = targetsFor(bab).filter((t) => TARGET_INFO[t].grup === grup.key);
      if (!targets.length) return;
      html += `<section class="tugas-group"><h4>${grup.judul}</h4><div class="tugas-cards">`;
      targets.forEach((target) => {
        const info = TARGET_INFO[target];
        const st = statusText(bab, target);
        const row = rowFor(bab, target);
        html += `<div class="tugas-card ${st.cls}"><div><b>${info.judul}</b><p>${info.ket}</p><small class="tugas-count">${questionCount(bab, target)} soal · pilihan ${target === "kalimat-susun" ? "tulis urutan nomor" : "ganda (4 pilihan)"}</small><span class="tugas-status ${st.cls}">${st.text}</span></div><div class="tugas-card-actions"><button type="button" class="${row ? "secondary" : "primary"}" data-tugas-mulai="${target}"${tugasTerbuka ? "" : " disabled"}>${row ? "Kerjakan lagi" : "Kerjakan"}</button></div></div>`;
      });
      html += `</div></section>`;
    });
    if (!tugasTerbuka) html += `<p class="tugas-hint">🔒 Tugas terbuka setelah materi ditandai <b>Sudah paham</b>.</p>`;
    container.innerHTML = html;

    container.querySelector("[data-tugas-materi-buka]").onclick = () => hooks.onBukaMateri?.();
    const paham = container.querySelector("[data-tugas-materi-paham]");
    if (paham) paham.onclick = () => hooks.onMateri?.();
    container.querySelectorAll("[data-tugas-mulai]").forEach((button) => {
      button.onclick = () => runQuiz(container, bab, button.dataset.tugasMulai, hooks);
    });
  }

  // === Mengerjakan tugas ===
  function runQuiz(container, bab, target, hooks) {
    const info = TARGET_INFO[target];
    const questions = buildQuestions(bab, target);
    let index = 0;
    let correct = 0;
    const mistakes = [];

    function backToList() {
      renderList(container, bab, hooks);
      container.scrollIntoView({ block: "start" });
    }

    function renderQuestion() {
      const q = questions[index];
      const pct = Math.round((index / questions.length) * 100);
      let body = `<div class="tugas-quiz-top"><button type="button" class="tugas-quiz-exit">✕ Keluar</button><span>${esc(info.judul)} · Soal ${index + 1} dari ${questions.length}</span><span class="tugas-quiz-score">Benar ${correct}</span></div><div class="track tugas-quiz-track"><div class="fill" style="width:${pct}%"></div></div>`;
      if (q.type === "pilih") {
        body += `<p class="tugas-quiz-instruction">${esc(q.instruction)}</p><div class="tugas-quiz-prompt${q.promptJp ? " is-jp" : ""}" lang="${q.promptJp ? "ja" : "id"}">${esc(q.prompt)}</div><div class="tugas-quiz-choices">${q.choices
          .map((c, i) => `<button type="button" class="tugas-choice" data-choice="${i}"${/[぀-ヿ一-鿿]/.test(c) ? ' lang="ja"' : ""}><span class="tugas-choice-key">${"ABCD"[i]}</span>${esc(c)}</button>`)
          .join("")}</div>`;
      } else {
        body += `<p class="tugas-quiz-instruction">Susun menjadi kalimat yang artinya:</p><div class="tugas-quiz-prompt">${esc(q.prompt)}</div><ol class="tugas-pieces" lang="ja">${q.pieces.map((p) => `<li>${esc(p)}</li>`).join("")}</ol><form class="tugas-susun-form"><label>Urutan nomor yang benar <input type="text" inputmode="numeric" autocomplete="off" placeholder="contoh: ${q.pieces.map((_, i) => i + 1).reverse().join(" ")}" required></label><button type="submit" class="primary">Periksa</button></form>`;
      }
      body += `<div class="tugas-feedback" aria-live="polite"></div>`;
      container.innerHTML = `<div class="tugas-quiz">${body}</div>`;
      container.querySelector(".tugas-quiz-exit").onclick = backToList;

      if (q.type === "pilih") {
        container.querySelectorAll(".tugas-choice").forEach((button) => {
          button.onclick = () => {
            const chosen = q.choices[Number(button.dataset.choice)];
            const ok = chosen === q.answer;
            container.querySelectorAll(".tugas-choice").forEach((b) => {
              b.disabled = true;
              const value = q.choices[Number(b.dataset.choice)];
              if (value === q.answer) b.classList.add("benar");
              else if (b === button) b.classList.add("salah");
            });
            answered(ok, chosen, q.answer);
          };
        });
      } else {
        const form = container.querySelector(".tugas-susun-form");
        const input = form.querySelector("input");
        input.focus({ preventScroll: true });
        form.onsubmit = (event) => {
          event.preventDefault();
          const given = parseOrder(input.value, q.pieces.length);
          if (given.length !== q.pieces.length) {
            container.querySelector(".tugas-feedback").innerHTML = `<p class="tugas-feedback-info">Tuliskan ${q.pieces.length} nomor, misalnya "${q.pieces.map((_, i) => i + 1).join(" ")}".</p>`;
            return;
          }
          const valid = given.every((n) => n >= 1 && n <= q.pieces.length) && new Set(given).size === given.length;
          if (!valid) {
            container.querySelector(".tugas-feedback").innerHTML = `<p class="tugas-feedback-info">Pakai setiap nomor 1-${q.pieces.length} tepat satu kali.</p>`;
            return;
          }
          // Dinilai dari kalimat yang tersusun (urutan nomor lain yang hasilnya sama tetap benar).
          const ok = given.map((n) => q.pieces[n - 1]).join("") === q.kalimat;
          input.disabled = true;
          form.querySelector("button").disabled = true;
          answered(ok, given.join(" "), `${q.answer.join(" ")} → ${q.sentence}`);
        };
      }
    }

    function answered(ok, given, answerText) {
      const q = questions[index];
      if (ok) correct++;
      else mistakes.push({ prompt: q.prompt, given, answer: answerText });
      const feedback = container.querySelector(".tugas-feedback");
      const last = index === questions.length - 1;
      feedback.innerHTML = `<p class="${ok ? "tugas-feedback-benar" : "tugas-feedback-salah"}">${ok ? "Benar!" : `Belum tepat. Jawaban benar: <span lang="ja">${esc(answerText)}</span>`}</p><button type="button" class="primary tugas-next">${last ? "Lihat hasil" : "Lanjut →"}</button>`;
      const nextButton = feedback.querySelector(".tugas-next");
      nextButton.focus({ preventScroll: true });
      nextButton.onclick = () => {
        index++;
        if (index < questions.length) renderQuestion();
        else finish();
      };
    }

    async function finish() {
      const total = questions.length;
      const skor = Math.floor((100 * correct) / total);
      const lulus = skor >= TUGAS_KKM; // skor tugas ini sendiri (penanda warna)
      container.innerHTML = `<div class="tugas-result"><p class="tugas-loading">Menyimpan hasil…</p></div>`;
      const { saved } = await record(bab, target, correct, total);
      const babSelesai = isComplete(bab);
      let html = `<div class="tugas-result ${lulus ? "lulus" : "ulang"}"><div class="eyebrow">${esc(info.judul)} · Pelajaran ${bab}</div><div class="tugas-result-score"><b>${skor}</b><span>${correct} benar dari ${total} soal</span></div><h3>${lulus ? "Bagus! 🎉" : `Skor di bawah ${TUGAS_KKM} - boleh diulang untuk menaikkan rata-rata.`}</h3>`;
      const p = progress(bab);
      html += `<p class="tugas-rata">Rata-rata nilai tugas Pelajaran ${bab}: <b>${p.rataRata}</b> (${p.dikerjakan}/${p.totalTugas} tugas dikerjakan, minimal ${TUGAS_KKM} untuk membuka pelajaran berikutnya).</p>`;
      if (babSelesai && bab < MAX_BAB) html += `<p class="tugas-unlock">🔓 Semua target Pelajaran ${bab} selesai - Pelajaran ${bab + 1} sekarang terbuka.</p>`;
      else if (bab < MAX_BAB && !isStaff()) html += `<p class="tugas-masih">Untuk membuka Pelajaran ${bab + 1}: ${esc(kekurangan(bab).join("; "))}.</p>`;
      if (!saved) html += `<p class="tugas-warning">Hasil belum tersimpan di server - disimpan di perangkat ini dan dikirim ulang otomatis nanti.</p>`;
      if (mistakes.length) {
        html += `<details class="tugas-mistakes"${lulus ? "" : " open"}><summary>Soal yang salah (${mistakes.length})</summary><ul>${mistakes
          .map((m) => `<li><b lang="ja">${esc(m.prompt)}</b><span>Jawabanmu: ${esc(m.given)}</span><span>Benar: <span lang="ja">${esc(m.answer)}</span></span></li>`)
          .join("")}</ul></details>`;
      }
      html += `<div class="tugas-result-actions"><button type="button" class="secondary" data-tugas-ulang>Kerjakan lagi (soal diacak)</button><button type="button" class="primary" data-tugas-kembali>Kembali ke daftar tugas</button></div></div>`;
      container.innerHTML = html;
      container.querySelector("[data-tugas-ulang]").onclick = () => runQuiz(container, bab, target, hooks);
      container.querySelector("[data-tugas-kembali]").onclick = backToList;
    }

    renderQuestion();
    container.scrollIntoView({ block: "start" });
  }

  window.TugasBab = {
    KKM: TUGAS_KKM,
    init,
    onChange: (fn) => listeners.push(fn),
    targetsFor,
    progress,
    isComplete,
    kekurangan,
    tugasLengkap,
    isLocked,
    frontierBab,
    recordMateri,
    renderPanel,
    // untuk pengujian
    _buildQuestions: buildQuestions,
    _record: record,
    _parseOrder: parseOrder,
    _ensureBabData: ensureBabData,
  };
})();
