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
    "ujian-ulang": { grup: "ujian", judul: "Ujian ulang", ket: "Soal campuran kotoba, kanji, dan kalimat dari 5 pelajaran terakhir." },
    // Latihan tambahan: tidak dinilai & tidak memengaruhi kunci bab.
    "latihan-partikel": { grup: "latihan", judul: "Isi partikel", ket: "Ketik partikel yang hilang dari kalimat (boleh kana atau romaji, mis. \"wo\" atau \"を\"). Melatih mengingat sendiri, bukan sekadar memilih." },
    "latihan-dengar": { grup: "latihan", judul: "Mendengar", ket: "Dengarkan kata atau kalimat (suara perangkat), lalu pilih artinya. Tulisannya ditampilkan setelah menjawab." },
  };
  const LATIHAN = ["latihan-partikel", "latihan-dengar"];
  const LATIHAN_JUMLAH = 10;
  function isLatihan(target) {
    return LATIHAN.includes(target);
  }
  /* Ujian ulang tiap 5 bab (Bab 5, 10, ..., 50): soal campuran dari 5 bab
     terakhir, lulus kalau skor >= TUGAS_KKM. Wajib untuk membuka bab
     berikutnya - kecuali siswa yang sudah melewati bab itu sebelum ujian
     ini ada (sudah punya hasil di bab sesudahnya): tidak dikunci ulang,
     ujiannya tetap tersedia. */
  const UJIAN = "ujian-ulang";
  const UJIAN_SUSUNAN = { kotoba: 10, kanji: 10 }; // + 1 pilih & 1 susun kalimat per bab
  function adaUjian(bab) {
    return bab % 5 === 0;
  }
  function rentangUjian(bab) {
    return `${bab - 4}–${bab}`;
  }
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
  const cacheNorm = new Map(); // norm() dipanggil ribuan kali per set soal
  function norm(text) {
    let hasil = cacheNorm.get(text);
    if (hasil === undefined) {
      hasil = String(text).toLowerCase().replace(/\s+/g, "");
      cacheNorm.set(text, hasil);
    }
    return hasil;
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
  /* Semua 50 bab punya target yang sama (data kalimat lengkap Bab 1-50),
     jadi daftar ini tidak butuh data soal - Beranda bisa memakainya tanpa
     memuat data/tugas-kalimat-data.js. */
  const SEMUA_TARGET = ["materi", "kotoba-jp-id", "kotoba-id-jp", "kanji-kanji-kana", "kanji-kana-kanji", "kanji-kanji-id", "kanji-id-kanji", "kalimat-susun", "kalimat-pilih"];
  function targetsFor() {
    return SEMUA_TARGET;
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
  function tugasSelesai(bab) {
    const p = progress(bab);
    return p.materi && p.dikerjakan === p.totalTugas && p.rataRata >= TUGAS_KKM;
  }
  function ujianWajib(bab) {
    if (!adaUjian(bab)) return false;
    return !Object.keys(rows).some((key) => Number(key.split(":")[0]) > bab);
  }
  function isComplete(bab) {
    return tugasSelesai(bab) && (!ujianWajib(bab) || isPassed(bab, UJIAN));
  }
  /* Kalimat singkat apa yang masih kurang, untuk pemberitahuan kunci. */
  function kekurangan(bab) {
    const p = progress(bab);
    const kurang = [];
    if (!p.materi) kurang.push("tandai materi sudah paham");
    if (p.dikerjakan < p.totalTugas) kurang.push(`kerjakan ${p.totalTugas - p.dikerjakan} tugas lagi`);
    if (p.rataRata < TUGAS_KKM) kurang.push(`naikkan rata-rata nilai tugas dari ${p.rataRata} ke minimal ${TUGAS_KKM}`);
    if (ujianWajib(bab) && !isPassed(bab, UJIAN)) kurang.push(`lulus Ujian ulang Pelajaran ${rentangUjian(bab)} (nilai minimal ${TUGAS_KKM})`);
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

  /* Langkah belajar berikutnya untuk tombol "Lanjutkan belajar" (Beranda):
     bab terdepan yang belum tuntas, lalu hal pertama yang masih kurang di
     bab itu - materi, tugas yang belum dikerjakan, atau tugas dengan skor
     terbaik terendah kalau rata-rata belum cukup. */
  const GRUP_LABEL = { kotoba: "Kotoba", kanji: "Kanji", kalimat: "Kalimat", ujian: "Ujian" };
  function namaTugas(target) {
    const info = TARGET_INFO[target];
    return `${GRUP_LABEL[info.grup]}: ${info.judul}`;
  }
  function langkahBerikut() {
    const bab = frontierBab();
    const p = progress(bab);
    if (isComplete(bab)) return { bab, jenis: "selesai", ...p };
    if (!p.materi) return { bab, jenis: "materi", ...p };
    const tugas = targetsFor(bab).filter((t) => t !== "materi");
    const belum = tugas.find((t) => !rowFor(bab, t));
    if (belum) return { bab, jenis: "tugas", target: belum, judul: namaTugas(belum), ...p };
    if (p.rataRata >= TUGAS_KKM) return { bab, jenis: "ujian", target: UJIAN, judul: `Ujian ulang Pelajaran ${rentangUjian(bab)}`, skor: rowFor(bab, UJIAN)?.skor_terbaik ?? null, ...p };
    const terendah = tugas.reduce((a, t) => (rowFor(bab, t).skor_terbaik < rowFor(bab, a).skor_terbaik ? t : a));
    return { bab, jenis: "ulang", target: terendah, judul: namaTugas(terendah), skor: rowFor(bab, terendah).skor_terbaik, ...p };
  }

  // === Server ===
  function dariServer(row) {
    return { skor_terbaik: row.skor_terbaik, skor_terakhir: row.skor_terakhir, percobaan: row.percobaan, lulus: row.lulus };
  }
  async function kirimKeServer(bab, target, benar, total) {
    const { data, error } = await window.supabaseClient.rpc("catat_target_bab", {
      p_bab: bab, p_target: target, p_benar: benar, p_total: total,
    });
    if (error) throw error;
    return data;
  }
  function applyServerRow(row) {
    const key = `${row.bab}:${row.target}`;
    const local = rows[key];
    rows[key] = dariServer(row);
    // Hasil lokal yang belum terkirim & lebih baik tetap ditandai pending.
    if (local?.pending && ((local.lulus && !row.lulus) || local.skor_terbaik > row.skor_terbaik)) {
      rows[key] = { ...local };
    }
  }
  async function sendPending() {
    const pending = Object.entries(rows).filter(([, r]) => r.pending);
    for (const [key, r] of pending) {
      const [bab, target] = key.split(/:(.+)/);
      // Skor terbaik dikirim sebagai benar/100 (materi selalu 1/1).
      const materi = target === "materi";
      try {
        applyServerRow(await kirimKeServer(Number(bab), target, materi ? 1 : r.skor_terbaik, materi ? 1 : 100));
      } catch {
        return; // dicoba lagi saat halaman dibuka berikutnya
      }
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
        // Server = sumber kebenaran; hanya hasil lokal yang belum terkirim dipertahankan.
        rows = Object.fromEntries(Object.entries(rows).filter(([, r]) => r.pending));
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
        rows[key] = dariServer(await kirimKeServer(bab, target, benar, total));
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
  /* Soal yang salah dikirim untuk Pantau Siswa (supabase/add-pantau-bab.sql).
     Sekadar statistik: gagal kirim (offline, SQL belum dijalankan) diabaikan. */
  function kirimKesalahan(items) {
    if (!items.length || !window.supabaseClient || !uid() || isStaff()) return;
    window.supabaseClient
      .rpc("catat_kesalahan", { p_items: items.slice(0, 100) })
      .then(({ error }) => error && console.warn("catat_kesalahan gagal:", error.message), () => {});
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
  // Dibentuk sekali per bab lalu disimpan (dipindai berulang saat memilih pengecoh).
  const cacheItems = { kotoba: {}, kanji: {} };
  function kotobaItems(bab) {
    return (cacheItems.kotoba[bab] ||= (babKosakataData[bab] || []).map(([jp, id]) => ({ bab, jp, kana: jp, id })));
  }
  function kanjiItems(bab) {
    return (cacheItems.kanji[bab] ||= (babKanjiData[bab] || []).map(([kanji, kana, id]) => ({ bab, kanji, kana, id })));
  }

  /* Kelompok makna (data/tugas-kategori-data.js), dicari lewat cara baca
     item. Entri "kana@bab" hanya berlaku untuk kata di bab itu (homonim,
     mis. せん@3 = "Seribu", bukan せん "Garis" di Bab 34). */
  let kategoriIndex = null;
  function kategoriOf(item) {
    if (!kategoriIndex) {
      kategoriIndex = {};
      const data = typeof tugasKategoriKata !== "undefined" ? tugasKategoriKata : {};
      Object.entries(data).forEach(([nama, kata]) => kata.forEach((k) => {
        const [kana, bab] = k.split("@");
        kategoriIndex[bab ? `${norm(kana)}@${bab}` : norm(kana)] = nama;
      }));
    }
    const kana = norm(item.kana);
    return kategoriIndex[`${kana}@${item.bab}`] || kategoriIndex[kana] || null;
  }
  /* Pasangan sinonim (artinya sama walau teksnya beda, mis. おてあらい &
     トイレ) - tidak boleh saling jadi pengecoh. */
  let sinonimIndex = null;
  function sinonimOf(kana) {
    if (!sinonimIndex) {
      sinonimIndex = new Map();
      (typeof tugasSinonim !== "undefined" ? tugasSinonim : []).forEach((grup) => grup.forEach((k) => {
        const set = sinonimIndex.get(norm(k)) || new Set();
        grup.forEach((lain) => set.add(norm(lain)));
        sinonimIndex.set(norm(k), set);
      }));
    }
    return sinonimIndex.get(norm(kana)) || null;
  }
  /* Seberapa mirip bentuk dua pilihan - dipakai untuk kata yang belum
     dikelompokkan, supaya pengecoh tidak gampang dicoret (jenis huruf
     sama, sama-sama berawalan/berakhiran ～, panjang mirip, banyak huruf
     yang sama seperti かいしゃ/かいしゃいん). */
  function scriptOf(text) {
    if (/[\u4e00-\u9fff]/.test(text)) return "kanji";
    if (/^[\u30a0-\u30ff～]+$/.test(text)) return "kata";
    if (/[\u3040-\u309f]/.test(text)) return "hira";
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
  const tandaSet = (values) => values.map(norm).sort().join("|");
  function dipakai(value) {
    return pemakaian.kali.get(norm(value)) || 0;
  }
  function catatPemakaian(values) {
    values.forEach((v) => pemakaian.kali.set(norm(v), dipakai(v) + 1));
    pemakaian.set.add(tandaSet(values));
  }
  function distractors(bab, itemsOf, correct, valueOf, conflicts) {
    const answer = valueOf(correct);
    const seen = new Set([norm(answer)]);
    // Pilihan yang di bab MANA PUN juga cocok dengan soal ditolak seluruhnya
    // (mis. こちら = "Disini" di Bab 3 tapi "Sebelah sini" di Bab 46).
    const sinonim = sinonimOf(correct.kana);
    const bentrok = (item) => conflicts(item) || (sinonim && sinonim.has(norm(item.kana)));
    for (let b = 1; b <= MAX_BAB; b++) itemsOf(b).forEach((item) => bentrok(item) && seen.add(norm(valueOf(item))));
    const kandidat = [];
    const kataDipakai = new Set([norm(correct.kana)]); // satu kata = satu pengecoh (walau terjemahannya beda per bab)
    const tambah = (item, kelompok, bobot) => {
      const value = valueOf(item);
      if (seen.has(norm(value)) || kataDipakai.has(norm(item.kana))) return;
      kataDipakai.add(norm(item.kana));
      seen.add(norm(value));
      kandidat.push({ value, kelompok, bobot });
    };
    const babsAt = (d) => (d === 0 ? [bab] : [bab - d, bab + d].filter((b) => b >= 1 && b <= MAX_BAB));
    const kategori = kategoriOf(correct);
    if (kategori) {
      for (let d = 0; d <= MAX_BAB; d++) {
        babsAt(d).forEach((b) => itemsOf(b).forEach((item) => {
          if (kategoriOf(item) === kategori) tambah(item, 0, d * 0.3);
        }));
      }
    }
    // Cadangan "mirip bentuk": bab sama & 3 bab terdekat, lebih jauh hanya bila kurang.
    for (let d = 0; d <= MAX_BAB && (d <= 3 || kandidat.length < 6); d++) {
      babsAt(d).forEach((b) => itemsOf(b).forEach((item) => tambah(item, 1, d * 0.8 - similarity(answer, valueOf(item)))));
    }
    kandidat.forEach((k) => (k.skor = k.kelompok * 1000 + dipakai(k.value) * (k.kelompok ? 3 : 2) + k.bobot + Math.random() * 1.2));
    kandidat.sort((x, y) => x.skor - y.skor);

    const picked = pilihTiga(answer, kandidat.map((k) => k.value));
    catatPemakaian([answer, ...picked]);
    return picked;
  }
  /* Pengecoh "kanji mirip" untuk Hiragana -> Kanji: ganti SATU huruf
     kanji jawaban dengan kanji yang bentuknya mirip (data/kanji-mirip-
     data.js). Posisi huruf yang diganti diusahakan berbeda-beda supaya
     ketiga pengecoh tidak seragam. Kurang dari 3 -> ditambah pengecoh
     biasa oleh pemanggil. */
  function kanjiMirip(bab, item) {
    const mirip = typeof kanjiMiripData !== "undefined" ? kanjiMiripData : {};
    const chars = [...item.kanji];
    const posisi = shuffle(chars.map((ch, i) => i).filter((i) => mirip[chars[i]]));
    // Bentuk lain yang SAMA cara bacanya (kalau ada) tidak boleh jadi pengecoh.
    const sahBaca = new Set(kanjiItems(bab).filter((x) => norm(x.kana) === norm(item.kana)).map((x) => x.kanji));
    const perPosisi = posisi.map((i) => shuffle(mirip[chars[i]]).map((ganti) => {
      const baru = chars.slice();
      baru[i] = ganti;
      return baru.join("");
    }));
    const hasil = [];
    while (perPosisi.some((daftar) => daftar.length)) {
      perPosisi.forEach((daftar) => {
        const calon = daftar.shift();
        if (calon && !hasil.includes(calon) && !sahBaca.has(calon)) hasil.push(calon);
      });
    }
    return hasil;
  }
  /* Pengecoh "cara baca mirip" untuk Kanji -> Hiragana: hanya bacaan
     bagian KANJI yang diubah (kana yang sudah tertulis di soal, mis.
     から…ました pada ～から来ました, dibiarkan), dengan jebakan khas soal
     JLPT: bunyi panjang (せんせい/せんせ), huruf kecil (しゃ/しや), tenten
     (が/か), tsu kecil (っ), dan ゃ/ゅ/ょ tertukar. Satu pengecoh = satu
     perubahan; jenis perubahan diusahakan berbeda-beda. */
  const BACA_TENTEN = Object.fromEntries(
    ["かが", "きぎ", "くぐ", "けげ", "こご", "さざ", "しじ", "すず", "せぜ", "そぞ", "ただ", "ちぢ", "てで", "とど",
      "はば", "ひび", "ふぶ", "へべ", "ほぼ"].flatMap(([a, b]) => [[a, b], [b, a]]),
  );
  Object.assign(BACA_TENTEN, { ぱ: "ば", ぴ: "び", ぷ: "ぶ", ぺ: "べ", ぽ: "ぼ" });
  const BACA_KECIL = { ゃ: "や", ゅ: "ゆ", ょ: "よ" };
  const BACA_YOON = { ゃ: ["ゅ", "ょ"], ゅ: ["ゃ", "ょ"], ょ: ["ゃ", "ゅ"] };
  const BARIS_O = "おこごそぞとどのほぼぽもよろを", BARIS_U = "うくぐすずつづぬふぶぷむゆる", BARIS_E = "えけげせぜてでねへべぺめれ";
  const AWAL_SOKUON = "かきくけこさしすせそたちつてとぱぴぷぺぽ";
  function moraOf(text) {
    const mora = [];
    for (const ch of text) {
      if (/[ゃゅょぁぃぅぇぉ]/.test(ch) && mora.length) mora[mora.length - 1] += ch;
      else mora.push(ch);
    }
    return mora;
  }
  let indeksBacaan = null; // tulisan kanji -> semua bacaannya di data
  const dasarBacaan = (teks) => norm(teks.replace(/（[^）]*）$/, ""));
  function bacaanMirip(bab, item) {
    // Pisahkan kana yang sama di depan/belakang (sudah tertulis di soal).
    // Catatan dalam kurung di akhir bacaan (mis. なおります（が）) tidak diubah.
    const catatan = (item.kana.match(/（[^）]*）$/) || [""])[0];
    const kanji = [...item.kanji.replace(/（[^）]*）$/, "")], kana = [...item.kana.slice(0, item.kana.length - catatan.length)];
    let depan = 0;
    while (depan < kanji.length && depan < kana.length && kanji[depan] === kana[depan]) depan++;
    let belakang = 0;
    while (belakang < kanji.length - depan && belakang < kana.length - depan &&
      kanji[kanji.length - 1 - belakang] === kana[kana.length - 1 - belakang]) belakang++;
    const awal = kana.slice(0, depan).join(""), akhir = kana.slice(kana.length - belakang).join("") + catatan;
    const inti = moraOf(kana.slice(depan, kana.length - belakang).join(""));
    if (!inti.length && !(typeof bacaanKeliruData !== "undefined" && bacaanKeliruData[item.kanji])) return [];

    const calon = []; // { jenis, teks }
    // Bacaan ganda ("～ふん／ぶん", "まんざい。らくご") tidak diubah otomatis -
    // hanya pengecoh manual.
    if (/[／。]/.test(item.kana)) inti.length = 0;
    const tambah = (jenis, mora) => calon.push({ jenis, teks: awal + mora.join("") + akhir });
    // Kana yang tertulis di tengah soal (の pada 子供の服, し pada 催し物)
    // tidak diubah - pengecoh seperti こどものうふく gampang dicoret.
    const kanaTerlihat = new Set(kanji.slice(depan, kanji.length - belakang).filter((ch) => /[\u3040-\u309f]/.test(ch)));
    inti.forEach((m, i) => {
      if (kanaTerlihat.has(m)) return;
      const kepala = m[0], ekor = m.slice(1), next = inti[i + 1];
      if (BACA_TENTEN[kepala]) tambah("tenten", [...inti.slice(0, i), BACA_TENTEN[kepala] + ekor, ...inti.slice(i + 1)]);
      if (BACA_KECIL[ekor]) tambah("kecil", [...inti.slice(0, i), kepala + BACA_KECIL[ekor], ...inti.slice(i + 1)]);
      if (BACA_YOON[ekor]) BACA_YOON[ekor].forEach((y) => tambah("yoon", [...inti.slice(0, i), kepala + y, ...inti.slice(i + 1)]));
      // Tsu kecil: っ -> つ, atau く/き/ち/つ sebelum bunyi k/s/t/p -> っ (がくせい -> がっせい).
      if (m === "っ") tambah("tsu", [...inti.slice(0, i), "つ", ...inti.slice(i + 1)]);
      else if (i > 0 && next && "くきちつ".includes(m) && AWAL_SOKUON.includes(next[0]))
        tambah("tsu", [...inti.slice(0, i), "っ", ...inti.slice(i + 1)]);
      // Bunyi panjang: hapus う/い pemanjang (せんせい -> せんせ), atau tambahkan
      // う setelah baris o / ゅ / ょ dan い setelah baris e (きょし? -> きょうし).
      const pemanjang = /^[うい]$/.test(m) && i > 0;
      const panjangAda = next === "う" || next === "い";
      const panjang = ekor === "ょ" || ekor === "ゅ" || (!ekor && BARIS_O.includes(kepala)) ? "う" : !ekor && BARIS_E.includes(kepala) ? "い" : null;
      if (pemanjang) {
        const sebelum = inti[i - 1];
        const cocok = (m === "う" && (/[ょゅ]$/.test(sebelum) || BARIS_O.includes(sebelum) || BARIS_U.includes(sebelum))) || (m === "い" && BARIS_E.includes(sebelum));
        if (cocok) tambah("panjang", [...inti.slice(0, i), ...inti.slice(i + 1)]);
      } else if (panjang && !panjangAda && next !== "ん" && !kanaTerlihat.has(next)) {
        tambah("panjang", [...inti.slice(0, i + 1), panjang, ...inti.slice(i + 1)]);
      }
    });
    // Bacaan keliru khas yang ditulis manual (data/kanji-mirip-data.js), mis. 来 -> こ/く.
    // Satu kanji bisa dipakai di dua bab dengan bentuk bacaan berbeda (～分:
    // "～ふん／ぶん" di Bab 4, "～ぶん" di Bab 34) - pengecoh bergaris miring
    // hanya untuk bacaan bergaris miring, dan sebaliknya.
    const ganda = item.kana.includes("／");
    const manual = (typeof bacaanKeliruData !== "undefined" ? bacaanKeliruData[item.kanji] || [] : [])
      .filter((teks) => teks.includes("／") === ganda);
    // Catatan dalam kurung (mis. （を）) ditambahkan bila manualnya belum memuat.
    manual.forEach((teks) => calon.push({ jenis: "manual", teks: catatan && !teks.endsWith(catatan) ? teks + catatan : teks }));

    // Bacaan yang sah untuk kanji ini (dari data mana pun) tidak boleh jadi pengecoh.
    if (!indeksBacaan) {
      indeksBacaan = new Map();
      for (let b = 1; b <= MAX_BAB; b++) kanjiItems(b).forEach((x) => {
        if (!indeksBacaan.has(x.kanji)) indeksBacaan.set(x.kanji, new Set());
        indeksBacaan.get(x.kanji).add(dasarBacaan(x.kana));
      });
    }
    // Dibandingkan TANPA catatan kurung: 降ります dibaca ふります (Bab 14) dan
    // おります（を） (Bab 16), jadi ふります（を） juga bacaan sah.
    const sah = new Set([dasarBacaan(item.kana), ...(indeksBacaan.get(item.kanji) || [])]);
    const sahLain = typeof bacaanSahLainData !== "undefined" ? bacaanSahLainData[item.kanji] || [] : [];
    sahLain.forEach((k) => sah.add(dasarBacaan(k)));

    const perJenis = {};
    shuffle(calon).forEach((c) => {
      if (sah.has(dasarBacaan(c.teks))) return;
      (perJenis[c.jenis] = perJenis[c.jenis] || []).push(c.teks);
    });
    // Urutan: jenis perubahan bergiliran supaya ketiga pengecoh berbeda jenis.
    const hasil = [];
    const daftar = shuffle(Object.values(perJenis));
    while (daftar.some((d) => d.length)) {
      daftar.forEach((d) => {
        const t = d.shift();
        if (t && !hasil.includes(t)) hasil.push(t);
      });
    }
    return hasil;
  }
  /* Ambil 3 pengecoh pertama dari daftar berurutan; kalau set pilihannya
     kembar dengan soal sebelumnya, ganti pengecoh terakhir dengan calon
     berikutnya. */
  function pilihTiga(answer, daftar) {
    let picked = daftar.slice(0, 3);
    for (let i = 3; picked.length === 3 && pemakaian.set.has(tandaSet([answer, ...picked])) && i < daftar.length; i++) {
      picked = [picked[0], picked[1], daftar[i]];
    }
    return picked;
  }

  /* Pengecoh khusus (bacaan/kanji mirip) dulu; kalau kurang dari 3,
     ditambah pengecoh biasa sekelompok makna. */
  function pengecohKhusus(bab, item, answer, khusus, valueOf, conflicts) {
    const wrong = pilihTiga(answer, khusus);
    if (wrong.length < 3) {
      const biasa = distractors(bab, kanjiItems, item, valueOf, (x) => conflicts(x) || wrong.includes(valueOf(x)));
      wrong.push(...biasa.slice(0, 3 - wrong.length));
    } else {
      catatPemakaian([answer, ...wrong]);
    }
    return wrong;
  }
  function mcQuestion(prompt, promptJp, answer, wrong, instruction) {
    return { type: "pilih", prompt, promptJp, answer, choices: shuffle([answer, ...wrong]), instruction };
  }
  /* Id kartu Hafalan (js/srs.js, format diperiksa srs_review() di server):
     kata/kanji yang salah dijawab di tugas masuk ke "Ulangan hari ini" di
     halaman Hafalan. Kalimat tidak punya kartu Hafalan, jadi tidak ikut. */
  function denganKartu(question, srsId) {
    question.srsId = srsId;
    return question;
  }
  function buildQuestions(bab, target) {
    pemakaian = { kali: new Map(), set: new Set() };
    if (target === UJIAN) return buildUjian(bab);
    if (target === "latihan-partikel") return buildPartikel(bab);
    if (target === "latihan-dengar") return buildDengar(bab);
    if (target.startsWith("kotoba-")) {
      const items = kotobaItems(bab);
      return shuffle(items).map((item) => denganKartu(kotobaQuestion(bab, target, item), `hafalan:bab${bab}-kosakata:${item.jp}`));
    }
    if (target.startsWith("kanji-")) {
      const items = kanjiItems(bab);
      return shuffle(items).map((item) => denganKartu(kanjiQuestion(bab, target, item), `hafalan:bab${bab}-kanji:${item.kanji}`));
    }
    return kalimatQuestions(bab, target);
  }
  const KANJI_ARAH = ["kanji-kanji-kana", "kanji-kana-kanji", "kanji-kanji-id", "kanji-id-kanji"];
  function acak(list) {
    return list[Math.floor(Math.random() * list.length)];
  }
  function buildUjian(bab) {
    const babs = [bab - 4, bab - 3, bab - 2, bab - 1, bab];
    const dariBab = (question, b) => Object.assign(question, { bab: b });
    const kotoba = shuffle(babs.flatMap((b) => kotobaItems(b))).slice(0, UJIAN_SUSUNAN.kotoba).map((item) =>
      dariBab(denganKartu(kotobaQuestion(item.bab, acak(["kotoba-jp-id", "kotoba-id-jp"]), item), `hafalan:bab${item.bab}-kosakata:${item.jp}`), item.bab));
    const kanji = shuffle(babs.flatMap((b) => kanjiItems(b))).slice(0, UJIAN_SUSUNAN.kanji).map((item) =>
      dariBab(denganKartu(kanjiQuestion(item.bab, acak(KANJI_ARAH), item), `hafalan:bab${item.bab}-kanji:${item.kanji}`), item.bab));
    const kalimat = babs.flatMap((b) => [
      dariBab(kalimatQuestions(b, "kalimat-pilih")[0], b),
      dariBab(kalimatQuestions(b, "kalimat-susun")[0], b),
    ]);
    return shuffle([...kotoba, ...kanji, ...kalimat]);
  }
  /* Isi partikel: satu partikel di kalimat susun dikosongkan. Partikel
     kasus didahulukan (は paling akhir karena sering bisa diganti が);
     partikel di akhir kalimat (か, ね, よ) tidak dipakai. */
  const PARTIKEL = ["を", "に", "で", "へ", "と", "から", "まで", "の", "も", "が", "や", "より", "か", "は"];
  const GERAK = /(いきます|きます|かえります|もどります|いって|きて|かえって|行|来|帰)/;
  function soalPartikel(item) {
    const kandidat = item.potongan
      .map((p, i) => ({ p, i }))
      .filter(({ p, i }) => PARTIKEL.includes(p) && i < item.potongan.length - 1)
      .sort((a, b) => PARTIKEL.indexOf(a.p) - PARTIKEL.indexOf(b.p));
    if (!kandidat.length) return null;
    // Acak di antara partikel dengan prioritas terbaik supaya tidak selalu sama.
    const terbaik = kandidat.filter((k) => PARTIKEL.indexOf(k.p) === PARTIKEL.indexOf(kandidat[0].p));
    const { p, i } = acak(terbaik);
    const kalimat = item.potongan.join("");
    const sah = [p];
    if ((p === "に" || p === "へ") && GERAK.test(kalimat)) sah.push(p === "に" ? "へ" : "に");
    return {
      type: "isi",
      prompt: item.arti,
      sebelum: item.potongan.slice(0, i).join(""),
      sesudah: item.potongan.slice(i + 1).join(""),
      answer: p,
      sah,
      sentence: kalimat + "。",
    };
  }
  function buildPartikel(bab) {
    return shuffle(tugasKalimatData[bab].susun).map(soalPartikel).filter(Boolean).slice(0, LATIHAN_JUMLAH);
  }
  /* Mendengar: 6 kata + 4 kalimat, dibacakan suara bahasa Jepang perangkat
     (speechSynthesis). Pilihan jawaban = arti bahasa Indonesia. */
  function teksSuara(teks) {
    return String(teks).replace(/（[^）]*）/g, "").replace(/[～〜]/g, "").split("／")[0].trim();
  }
  function buildDengar(bab) {
    const kata = shuffle(kotobaItems(bab)).filter((item) => teksSuara(item.jp)).slice(0, 6).map((item) =>
      Object.assign(denganKartu(kotobaQuestion(bab, "kotoba-jp-id", item), `hafalan:bab${bab}-kosakata:${item.jp}`), {
        audio: teksSuara(item.jp), instruction: "Dengarkan, lalu pilih artinya.",
      }));
    const semua = tugasKalimatData[bab].pilih;
    const kalimat = shuffle(semua).slice(0, LATIHAN_JUMLAH - kata.length).map((item) => {
      const lain = shuffle(semua.filter((x) => x !== item && norm(x.arti) !== norm(item.arti))).slice(0, 3).map((x) => x.arti);
      return Object.assign(mcQuestion(item.arti, false, item.arti, lain, "Dengarkan kalimatnya, lalu pilih artinya."), { audio: item.benar, prompt: item.benar });
    });
    return shuffle([...kata, ...kalimat]);
  }
  let suaraJepang = null;
  function cariSuara() {
    if (!("speechSynthesis" in window)) return null;
    suaraJepang = speechSynthesis.getVoices().find((v) => /^ja\b|ja-JP/i.test(v.lang)) || suaraJepang;
    return suaraJepang;
  }
  if ("speechSynthesis" in window) speechSynthesis.addEventListener?.("voiceschanged", cariSuara);
  function putar(teks) {
    if (!("speechSynthesis" in window)) return false;
    const u = new SpeechSynthesisUtterance(teks);
    u.lang = "ja-JP";
    u.rate = 0.85;
    const suara = cariSuara();
    if (suara) u.voice = suara;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    return true;
  }
  function kotobaQuestion(bab, target, item) {
    return Object.assign(kotobaSoal(bab, target, item), { jenis: target, kunci: item.jp, asal: bab });
  }
  function kanjiQuestion(bab, target, item) {
    return Object.assign(kanjiSoal(bab, target, item), { jenis: target, kunci: item.kanji, asal: bab });
  }
  function kotobaSoal(bab, target, item) {
    if (target === "kotoba-jp-id") {
      const wrong = distractors(bab, kotobaItems, item, (x) => x.id, (x) => norm(x.jp) === norm(item.jp));
      return mcQuestion(item.jp, true, item.id, wrong, "Apa arti kata ini dalam bahasa Indonesia?");
    }
    const wrong = distractors(bab, kotobaItems, item, (x) => x.jp, (x) => norm(x.id) === norm(item.id));
    return mcQuestion(item.id, false, item.jp, wrong, "Apa bahasa Jepangnya?");
  }
  function kanjiSoal(bab, target, item) {
    switch (target) {
      case "kanji-kanji-kana":
        return mcQuestion(item.kanji, true, item.kana,
          pengecohKhusus(bab, item, item.kana, bacaanMirip(bab, item), (x) => x.kana, (x) => x.kanji === item.kanji),
          "Bagaimana cara baca yang benar?");
      case "kanji-kana-kanji":
        return mcQuestion(item.kana, true, item.kanji,
          pengecohKhusus(bab, item, item.kanji, kanjiMirip(bab, item), (x) => x.kanji, (x) => norm(x.kana) === norm(item.kana)),
          "Mana tulisan kanji yang benar?");
      case "kanji-kanji-id":
        return mcQuestion(item.kanji, true, item.id,
          distractors(bab, kanjiItems, item, (x) => x.id, (x) => x.kanji === item.kanji), "Apa arti kanji ini?");
      default:
        return mcQuestion(item.id, false, item.kanji,
          distractors(bab, kanjiItems, item, (x) => x.kanji, (x) => norm(x.id) === norm(item.id)), "Mana kanjinya?");
    }
  }
  function kalimatQuestions(bab, target) {
    const data = tugasKalimatData[bab];
    if (target === "kalimat-susun") {
      return shuffle(data.susun).slice(0, TUGAS_KALIMAT_JUMLAH).map((item) => {
        const indexes = item.potongan.map((_, i) => i);
        const kalimat = item.potongan.join("");
        // Susunan lain yang juga benar (data `alt`, mis. A と B ditukar).
        const kalimatSah = [kalimat, ...(item.alt || []).map((a) => a.replace(/\s+/g, ""))];
        let order = shuffle(indexes);
        // Jangan tampilkan potongan yang kebetulan sudah tersusun benar.
        while (order.length > 1 && kalimatSah.includes(order.map((i) => item.potongan[i]).join(""))) order = shuffle(indexes);
        // order[k] = potongan ke-berapa yang tampil sebagai nomor k+1
        const answer = indexes.map((i) => order.indexOf(i) + 1);
        return {
          type: "susun",
          jenis: "kalimat-susun",
          kunci: item.arti,
          asal: bab,
          prompt: item.arti,
          pieces: order.map((i) => item.potongan[i]),
          answer,
          kalimatSah,
          sentence: kalimat + "。",
        };
      });
    }
    return shuffle(data.pilih).slice(0, TUGAS_KALIMAT_JUMLAH).map((item) =>
      Object.assign(mcQuestion(item.arti, false, item.benar, item.salah, "Pilih kalimat bahasa Jepang yang benar."), { jenis: "kalimat-pilih", kunci: item.arti, asal: bab }));
  }
  function questionCount(bab, target) {
    if (target === "latihan-partikel") return buildPartikel(bab).length;
    if (target === "latihan-dengar") return LATIHAN_JUMLAH;
    if (target === UJIAN) return UJIAN_SUSUNAN.kotoba + UJIAN_SUSUNAN.kanji + 10;
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

  // === Penjelasan singkat saat salah ===
  /* Dibuat otomatis dari data (tanpa teks penjelasan per soal): arti dari
     pilihan yang salah, jenis kekeliruan cara baca (bunyi panjang, tenten,
     っ/ゃ kecil), atau bagian kalimat yang berbeda. */
  let indeksKata = null;
  function indeks() {
    if (indeksKata) return indeksKata;
    indeksKata = { jp: new Map(), arti: new Map(), kanji: new Map(), kana: new Map(), artiKanji: new Map() };
    const tambah = (map, key, val) => {
      if (!map.has(key)) map.set(key, val);
    };
    for (let bab = 1; bab <= MAX_BAB; bab++) {
      kotobaItems(bab).forEach((x) => {
        tambah(indeksKata.jp, x.jp, x);
        tambah(indeksKata.arti, norm(x.id), x);
      });
      kanjiItems(bab).forEach((x) => {
        tambah(indeksKata.kanji, x.kanji, x);
        tambah(indeksKata.kana, dasarBacaan(x.kana), x);
        tambah(indeksKata.artiKanji, norm(x.id), x);
      });
    }
    return indeksKata;
  }
  const TANPA_TENTEN = Object.fromEntries(
    [..."がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ"].map((c, i) => [c, "かきくけこさしすせそたちつてとはひふへほはひふへほ"[i]]),
  );
  const KECIL_BESAR = { ゃ: "や", ゅ: "ゆ", ょ: "よ", ぁ: "あ", ぃ: "い", ぅ: "う", ぇ: "え", ぉ: "お" };
  function hapusPanjang(t) {
    return t.replace(/ー/g, "").replace(/([おこそとのほもよろごぞどぼぽょ])[うお]/g, "$1").replace(/([えけせてねへめれげぜでべぺ])い/g, "$1").replace(/(.)\1/g, "$1")
      .replace(/([あかさたなはまやらわがざだばぱゃ])あ/g, "$1").replace(/([いきしちにひみりぎじびぴ])い/g, "$1").replace(/([うくすつぬふむゆるぐずぶぷゅ])う/g, "$1");
  }
  function sebabBacaan(dipilih, benar) {
    const a = dasarBacaan(dipilih), b = dasarBacaan(benar);
    if (a === b) return "";
    const sama = (f) => f(a) === f(b);
    if (sama((t) => t.replace(/っ/g, ""))) return "Perhatikan <b>っ kecil</b> (bunyi ganda/berhenti sejenak).";
    if (sama((t) => [...t].map((c) => KECIL_BESAR[c] || c).join(""))) return "Perhatikan <b>ゃ・ゅ・ょ kecil</b>: dibaca menyatu dengan huruf sebelumnya.";
    if (sama((t) => [...t].map((c) => TANPA_TENTEN[c] || c).join(""))) return "Perhatikan <b>tenten/maru (゛゜)</b>: bunyinya berubah (k→g, s→z, t→d, h→b/p).";
    if (sama(hapusPanjang)) return "Perhatikan <b>bunyi panjang</b> (おう・えい・ー, dsb.).";
    const lain = indeks().kana.get(a);
    if (lain) return `<span lang="ja">${esc(dipilih)}</span> adalah cara baca <span lang="ja">${esc(lain.kanji)}</span> (${esc(lain.id)}).`;
    return "";
  }
  function bedaKalimat(dipilih, benar) {
    const a = [...dipilih], b = [...benar];
    let awal = 0;
    while (awal < a.length && awal < b.length && a[awal] === b[awal]) awal++;
    let akhir = 0;
    while (akhir < a.length - awal && akhir < b.length - awal && a[a.length - 1 - akhir] === b[b.length - 1 - akhir]) akhir++;
    const bagianA = a.slice(awal, a.length - akhir).join("");
    const bagianB = b.slice(awal, b.length - akhir).join("");
    const tandai = (arr, bagian) => esc(arr.slice(0, awal).join("")) + `<mark>${esc(bagian) || "…"}</mark>` + esc(arr.slice(arr.length - akhir).join(""));
    const partikel = /^(は|が|を|に|で|へ|と|も|の|から|まで|か|や|より)$/.test(bagianB) && /^(は|が|を|に|で|へ|と|も|の|から|まで|か|や|より)?$/.test(bagianA);
    return `${partikel ? "Bedanya di <b>partikel</b>. " : "Bedanya di bagian yang ditandai. "}Pilihanmu: <span lang="ja">${tandai(a, bagianA)}</span> · Benar: <span lang="ja">${tandai(b, bagianB)}</span>`;
  }
  function jelaskan(q, dipilih) {
    const ix = indeks();
    switch (q.jenis) {
      case "kotoba-jp-id": {
        const x = ix.arti.get(norm(dipilih));
        return x ? `"${esc(dipilih)}" adalah arti <span lang="ja">${esc(x.jp)}</span>.` : "";
      }
      case "kotoba-id-jp": {
        const x = ix.jp.get(dipilih);
        return x ? `<span lang="ja">${esc(dipilih)}</span> artinya "${esc(x.id)}".` : "";
      }
      case "kanji-kanji-id": {
        const x = ix.artiKanji.get(norm(dipilih));
        return x ? `"${esc(dipilih)}" adalah arti <span lang="ja">${esc(x.kanji)}</span> (${esc(x.kana)}).` : "";
      }
      case "kanji-id-kanji":
      case "kanji-kana-kanji": {
        const x = ix.kanji.get(dipilih);
        if (x) return `<span lang="ja">${esc(dipilih)}</span> dibaca <span lang="ja">${esc(x.kana)}</span>, artinya "${esc(x.id)}".`;
        return `<span lang="ja">${esc(dipilih)}</span> bentuknya mirip <span lang="ja">${esc(q.answer)}</span> - perhatikan bagian yang berbeda.`;
      }
      case "kanji-kanji-kana":
        return sebabBacaan(dipilih, q.answer);
      case "kalimat-pilih":
        return bedaKalimat(dipilih, q.answer);
      case "kalimat-susun":
        return dipilih ? `Kalimatmu: <span lang="ja">${esc(dipilih)}</span> - perhatikan urutan: keterangan → partikel → predikat di akhir.` : "";
      default:
        return "";
    }
  }

  // === Tampilan panel tugas ===
  function statusText(bab, target) {
    const row = rowFor(bab, target);
    if (!row) return { cls: "baru", text: "Belum dikerjakan" };
    if (target === UJIAN) {
      if (row.lulus) return { cls: "lulus", text: `✓ Lulus · skor terbaik ${row.skor_terbaik}` };
      return { cls: "ulang", text: `Skor terbaik ${row.skor_terbaik} · perlu ${TUGAS_KKM} untuk lulus` };
    }
    if (row.skor_terbaik >= TUGAS_KKM) return { cls: "lulus", text: `✓ Skor terbaik ${row.skor_terbaik}` };
    return { cls: "ulang", text: `Skor terbaik ${row.skor_terbaik} · ulangi untuk menaikkan rata-rata` };
  }

  /* hooks: { onMateri(): tandai materi dipahami, onBukaMateri(): ke tahap 1,
     mulai: target yang langsung dikerjakan (tautan "Lanjutkan belajar") } */
  let renderToken = 0;
  async function renderPanel(container, bab, { mulai, ...hooks } = {}) {
    const token = ++renderToken;
    container.dataset.tugasBab = String(bab);
    // Disimpan di container: panel bisa dirender ulang (mis. setelah sinkron
    // server) sebelum data selesai dimuat, dan hanya render terakhir yang dipakai.
    if (mulai) container.dataset.tugasMulaiNanti = `${bab}:${mulai}`;
    container.innerHTML = `<p class="tugas-loading">Memuat tugas Pelajaran ${bab}…</p>`;
    try {
      await ensureBabData();
    } catch (error) {
      container.innerHTML = `<p class="tugas-error">${esc(error.message)} Periksa koneksi lalu buka tab ini lagi.</p>`;
      return;
    }
    if (token !== renderToken || container.dataset.tugasBab !== String(bab)) return; // sudah dirender ulang / pindah bab
    renderList(container, bab, hooks);
    const [babNanti, nanti] = (container.dataset.tugasMulaiNanti || "").split(/:(.+)/);
    delete container.dataset.tugasMulaiNanti;
    const tombol = nanti && babNanti === String(bab) && container.querySelector(`[data-tugas-mulai="${CSS.escape(nanti)}"]`);
    if (tombol && !tombol.disabled) tombol.click();
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
    }${adaUjian(bab) ? ` Setelah itu, ${ujianWajib(bab) ? "lulus" : "kerjakan"} <b>Ujian ulang Pelajaran ${rentangUjian(bab)}</b> (nilai minimal ${TUGAS_KKM}).` : ""}</p><p class="tugas-ringkas">${p.dikerjakan}/${p.totalTugas} tugas dikerjakan · materi ${p.materi ? "✓" : "belum ditandai"}</p></div><div class="tugas-meter${p.rataRata >= TUGAS_KKM ? " cukup" : ""}" style="--tugas-progress:${pct}%"><b>${p.rataRata}</b><span>rata-rata</span></div></div>`;
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
    if (adaUjian(bab)) {
      const st = statusText(bab, UJIAN);
      const row = rowFor(bab, UJIAN);
      const terbuka = staff || tugasSelesai(bab) || !!row;
      const ket = `Ulangi Pelajaran ${rentangUjian(bab)} sekaligus: ${UJIAN_SUSUNAN.kotoba} soal kotoba, ${UJIAN_SUSUNAN.kanji} soal kanji, dan 2 soal kalimat dari tiap pelajaran. Kata & kanji yang salah masuk Ulangan Hafalan.`;
      html += `<section class="tugas-group tugas-ujian"><h4>Ujian ulang · Pelajaran ${rentangUjian(bab)}</h4><div class="tugas-card ${st.cls}"><div><b>Ujian ulang Pelajaran ${rentangUjian(bab)}</b><p>${ket}</p><small class="tugas-count">${questionCount(bab, UJIAN)} soal · lulus dengan nilai minimal ${TUGAS_KKM}${ujianWajib(bab) ? "" : " · tidak wajib untuk akun ini (sudah melewati bab ini)"}</small><span class="tugas-status ${st.cls}">${st.text}</span></div><div class="tugas-card-actions"><button type="button" class="${row ? "secondary" : "primary"}" data-tugas-mulai="${UJIAN}"${terbuka ? "" : " disabled"}>${row ? "Kerjakan lagi" : "Mulai ujian"}</button></div></div>${terbuka ? "" : `<p class="tugas-hint">🔒 Ujian terbuka setelah semua tugas Pelajaran ${bab} selesai dengan rata-rata minimal ${TUGAS_KKM}.</p>`}</section>`;
    }
    html += `<section class="tugas-group tugas-latihan"><h4>Latihan tambahan · tidak dinilai</h4><div class="tugas-cards">${LATIHAN.map((target) => {
      const info = TARGET_INFO[target];
      return `<div class="tugas-card"><div><b>${info.judul}</b><p>${info.ket}</p><small class="tugas-count">${questionCount(bab, target)} soal · boleh diulang sesukanya</small></div><div class="tugas-card-actions"><button type="button" class="secondary" data-tugas-mulai="${target}"${tugasTerbuka ? "" : " disabled"}>Latihan</button></div></div>`;
    }).join("")}</div></section>`;
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
    const keHafalan = new Set();
    const salahServer = new Map(); // untuk Pantau Siswa per bab (catat_kesalahan)

    function backToList() {
      renderList(container, bab, hooks);
      container.scrollIntoView({ block: "start" });
    }

    function renderQuestion() {
      const q = questions[index];
      const pct = Math.round((index / questions.length) * 100);
      let body = `<div class="tugas-quiz-top"><button type="button" class="tugas-quiz-exit">✕ Keluar</button><span>${esc(info.judul)} · Soal ${index + 1} dari ${questions.length}</span><span class="tugas-quiz-score">Benar ${correct}</span></div><div class="track tugas-quiz-track"><div class="fill" style="width:${pct}%"></div></div>`;
      if (q.type === "isi") {
        body += `<p class="tugas-quiz-instruction">Ketik partikel yang hilang (kana atau romaji). Artinya:</p><div class="tugas-quiz-prompt">${esc(q.prompt)}</div><p class="tugas-isi-kalimat" lang="ja">${esc(q.sebelum)}<span class="tugas-isi-kosong">？</span>${esc(q.sesudah)}。</p><form class="tugas-susun-form"><label>Partikel <input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" lang="ja" placeholder="contoh: wo / を" required></label><button type="submit" class="primary">Periksa</button></form>`;
      } else if (q.type === "pilih") {
        const promptHtml = q.audio
          ? `<div class="tugas-quiz-prompt tugas-audio"><button type="button" class="primary tugas-putar">🔊 Putar lagi</button><span class="tugas-audio-teks" lang="ja" hidden>${esc(q.audio)}</span>${"speechSynthesis" in window ? "" : `<small>Perangkat ini tidak bisa membacakan suara - tulisannya ditampilkan.</small>`}</div>`
          : `<div class="tugas-quiz-prompt${q.promptJp ? " is-jp" : ""}" lang="${q.promptJp ? "ja" : "id"}">${esc(q.prompt)}</div>`;
        body += `<p class="tugas-quiz-instruction">${q.bab ? `<span class="tugas-quiz-bab">Pelajaran ${q.bab}</span> ` : ""}${esc(q.instruction)}</p>${promptHtml}<div class="tugas-quiz-choices">${q.choices
          .map((c, i) => `<button type="button" class="tugas-choice" data-choice="${i}"${/[぀-ヿ一-鿿]/.test(c) ? ' lang="ja"' : ""}><span class="tugas-choice-key">${"ABCD"[i]}</span>${esc(c)}</button>`)
          .join("")}</div>`;
      } else {
        body += `<p class="tugas-quiz-instruction">${q.bab ? `<span class="tugas-quiz-bab">Pelajaran ${q.bab}</span> ` : ""}Susun menjadi kalimat yang artinya:</p><div class="tugas-quiz-prompt">${esc(q.prompt)}</div><ol class="tugas-pieces" lang="ja">${q.pieces.map((p) => `<li>${esc(p)}</li>`).join("")}</ol><form class="tugas-susun-form"><label>Urutan nomor yang benar <input type="text" inputmode="numeric" autocomplete="off" placeholder="contoh: ${q.pieces.map((_, i) => i + 1).reverse().join(" ")}" required></label><button type="submit" class="primary">Periksa</button></form>`;
      }
      body += `<div class="tugas-feedback" aria-live="polite"></div>`;
      container.innerHTML = `<div class="tugas-quiz">${body}</div>`;
      container.querySelector(".tugas-quiz-exit").onclick = backToList;

      if (q.audio) {
        const teksEl = container.querySelector(".tugas-audio-teks");
        const main = () => {
          if (!putar(q.audio)) teksEl.hidden = false;
        };
        container.querySelector(".tugas-putar").onclick = main;
        main();
      }
      if (q.type === "isi") {
        const form = container.querySelector(".tugas-susun-form");
        const input = form.querySelector("input");
        input.focus({ preventScroll: true });
        form.onsubmit = (event) => {
          event.preventDefault();
          if (!input.value.trim()) return;
          const ok = q.sah.some((p) => KanaKetik.cocokKetik(input.value, p));
          input.disabled = true;
          form.querySelector("button").disabled = true;
          container.querySelector(".tugas-isi-kosong").textContent = q.answer;
          answered(ok, KanaKetik.normalKetik(input.value), `${q.sah.join(" / ")} → ${q.sentence}`);
        };
      } else if (q.type === "pilih") {
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
            const teksEl = container.querySelector(".tugas-audio-teks");
            if (teksEl) teksEl.hidden = false;
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
          const ok = q.kalimatSah.includes(given.map((n) => q.pieces[n - 1]).join(""));
          input.disabled = true;
          form.querySelector("button").disabled = true;
          answered(ok, given.join(" "), `${q.answer.join(" ")} → ${q.sentence}`, given.map((n) => q.pieces[n - 1]).join("") + "。");
        };
      }
    }

    function answered(ok, given, answerText, pembanding = given) {
      const q = questions[index];
      let sebab = "";
      if (ok) correct++;
      else {
        try {
          sebab = jelaskan(q, pembanding);
        } catch (error) {
          console.warn(error); // penjelasan hanya tambahan - jangan sampai menghentikan kuis
        }
        mistakes.push({ prompt: q.prompt, given, answer: answerText, sebab });
        if (q.kunci && q.jenis && !isLatihan(target)) {
          const row = { bab: q.asal, target: q.jenis, item: String(q.kunci).slice(0, 200) };
          salahServer.set(JSON.stringify(row), row);
        }
        // "again" = jatuh tempo besok (lihat srsReview), lalu makin jarang kalau sudah hafal.
        if (q.srsId && typeof srsReview === "function" && !keHafalan.has(q.srsId)) {
          keHafalan.add(q.srsId);
          srsReview(q.srsId, "again");
        }
      }
      const feedback = container.querySelector(".tugas-feedback");
      const last = index === questions.length - 1;
      feedback.innerHTML = `<p class="${ok ? "tugas-feedback-benar" : "tugas-feedback-salah"}">${ok ? "Benar!" : `Belum tepat. Jawaban benar: <span lang="ja">${esc(answerText)}</span>`}</p>${sebab ? `<p class="tugas-sebab">💡 ${sebab}</p>` : ""}<button type="button" class="primary tugas-next">${last ? "Lihat hasil" : "Lanjut →"}</button>`;
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
      if (isLatihan(target)) {
        finishLatihan(skor);
        return;
      }
      const { saved } = await record(bab, target, correct, total);
      kirimKesalahan([...salahServer.values()]);
      const babSelesai = isComplete(bab);
      let html = `<div class="tugas-result ${lulus ? "lulus" : "ulang"}"><div class="eyebrow">${esc(info.judul)} · Pelajaran ${bab}</div><div class="tugas-result-score"><b>${skor}</b><span>${correct} benar dari ${total} soal</span></div><h3>${lulus ? (target === UJIAN ? "Lulus ujian ulang! 🎉" : "Bagus! 🎉") : target === UJIAN ? `Belum lulus - perlu nilai minimal ${TUGAS_KKM}. Ulangi kata yang salah di Hafalan, lalu coba lagi.` : `Skor di bawah ${TUGAS_KKM} - boleh diulang untuk menaikkan rata-rata.`}</h3>`;
      const p = progress(bab);
      if (target !== UJIAN) html += `<p class="tugas-rata">Rata-rata nilai tugas Pelajaran ${bab}: <b>${p.rataRata}</b> (${p.dikerjakan}/${p.totalTugas} tugas dikerjakan, minimal ${TUGAS_KKM} untuk membuka pelajaran berikutnya).</p>`;
      if (babSelesai && bab < MAX_BAB) html += `<p class="tugas-unlock">🔓 Semua target Pelajaran ${bab} selesai - Pelajaran ${bab + 1} sekarang terbuka.</p>`;
      else if (bab < MAX_BAB && !isStaff()) html += `<p class="tugas-masih">Untuk membuka Pelajaran ${bab + 1}: ${esc(kekurangan(bab).join("; "))}.</p>`;
      if (!saved) html += `<p class="tugas-warning">Hasil belum tersimpan di server - disimpan di perangkat ini dan dikirim ulang otomatis nanti.</p>`;
      if (mistakes.length) {
        html += `<details class="tugas-mistakes"${lulus ? "" : " open"}><summary>Soal yang salah (${mistakes.length})</summary><ul>${mistakes
          .map((m) => `<li><b lang="ja">${esc(m.prompt)}</b><span>Jawabanmu: ${esc(m.given)}</span><span>Benar: <span lang="ja">${esc(m.answer)}</span></span>${m.sebab ? `<span class="tugas-sebab">💡 ${m.sebab}</span>` : ""}</li>`)
          .join("")}</ul></details>`;
      }
      if (keHafalan.size) {
        const jenis = target.startsWith("kanji-") ? "kanji" : target === UJIAN ? "kata/kanji" : "kata";
        html += `<p class="tugas-hafalan-note">📌 ${keHafalan.size} ${jenis} yang salah masuk ke <b>Ulangan</b> di Hafalan dan muncul lagi besok. <a href="hafalan.html?ulangan=1">Buka Hafalan</a></p>`;
      }
      html += `<div class="tugas-result-actions"><button type="button" class="secondary" data-tugas-ulang>Kerjakan lagi (soal diacak)</button><button type="button" class="primary" data-tugas-kembali>Kembali ke daftar tugas</button></div></div>`;
      container.innerHTML = html;
      container.querySelector("[data-tugas-ulang]").onclick = () => runQuiz(container, bab, target, hooks);
      container.querySelector("[data-tugas-kembali]").onclick = backToList;
    }

    function finishLatihan(skor) {
      let html = `<div class="tugas-result ${skor >= TUGAS_KKM ? "lulus" : "ulang"}"><div class="eyebrow">Latihan ${esc(info.judul)} · Pelajaran ${bab}</div><div class="tugas-result-score"><b>${skor}</b><span>${correct} benar dari ${questions.length} soal</span></div><h3>${skor >= TUGAS_KKM ? "Bagus! 🎉" : "Terus berlatih!"}</h3><p class="tugas-rata">Latihan tambahan tidak dinilai dan tidak memengaruhi kunci pelajaran.</p>`;
      if (mistakes.length) {
        html += `<details class="tugas-mistakes" open><summary>Soal yang salah (${mistakes.length})</summary><ul>${mistakes
          .map((m) => `<li><b lang="ja">${esc(m.prompt)}</b><span>Jawabanmu: ${esc(m.given)}</span><span>Benar: <span lang="ja">${esc(m.answer)}</span></span>${m.sebab ? `<span class="tugas-sebab">💡 ${m.sebab}</span>` : ""}</li>`)
          .join("")}</ul></details>`;
      }
      if (keHafalan.size) html += `<p class="tugas-hafalan-note">📌 ${keHafalan.size} kata yang salah masuk ke <b>Ulangan</b> di Hafalan dan muncul lagi besok. <a href="hafalan.html?ulangan=1">Buka Hafalan</a></p>`;
      html += `<div class="tugas-result-actions"><button type="button" class="secondary" data-tugas-ulang>Latihan lagi (soal diacak)</button><button type="button" class="primary" data-tugas-kembali>Kembali ke daftar tugas</button></div></div>`;
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
    progress,
    isComplete,
    kekurangan,
    isLocked,
    frontierBab,
    langkahBerikut,
    recordMateri,
    renderPanel,
  };
})();
