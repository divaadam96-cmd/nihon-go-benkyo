/* Isi pelajaran hasil suntingan Operator (Kelola Materi,
   supabase/add-editor-konten.sql) menimpa isi bawaan dari berkas data:
     kosakata -> babKosakataData[bab]   (data/bab-data.js)
     kanji    -> babKanjiData[bab]      (data/bab-data.js)
     kalimat  -> tugasKalimatData[bab]  (data/tugas-kalimat-data.js)
   Dipakai Hafalan & Tugas (js/tugas-bab.js). Jalankan SETELAH berkas data
   yang bersangkutan dimuat; berkas yang belum dimuat dilewati dan diterapkan
   saat terapkan() dipanggil lagi.

   Isi terbit diambil dari server sekali per halaman lalu disimpan di
   localStorage, jadi tetap terpakai saat offline (asal pernah dibuka online).
   `versi` naik setiap kali isi yang diterapkan berubah - pemakai yang
   menyimpan hasil olahan data (cache soal, kartu Hafalan) membandingkannya
   untuk tahu kapan harus membangun ulang. */
(function () {
  const CACHE_KEY = "nihonKontenBabV1";
  const BATAS_TUNGGU_MS = 5000;
  const sumber = {
    kosakata: () => (typeof babKosakataData !== "undefined" ? babKosakataData : null),
    kanji: () => (typeof babKanjiData !== "undefined" ? babKanjiData : null),
    kalimat: () => (typeof tugasKalimatData !== "undefined" ? tugasKalimatData : null),
  };
  const bawaan = { kosakata: {}, kanji: {}, kalimat: {} }; // isi asli bab yang pernah ditimpa
  let baris = []; // [{bab, isi}] isi terbit terakhir yang diketahui
  let diterapkan = ""; // tanda isi yang sedang terpasang di data global
  let versi = 0;
  let muatan = null;

  function bacaCache() {
    try {
      const data = JSON.parse(localStorage.getItem(CACHE_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }
  function simpanCache(rows) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(rows));
    } catch {
      // Penyimpanan penuh/tidak tersedia - isi tetap dipakai selama halaman terbuka.
    }
  }

  /* Pasang `baris` ke data global: kembalikan dulu semua bab yang pernah
     ditimpa ke isi aslinya, lalu timpa dengan isi terbit. */
  function terapkan() {
    const tanda = JSON.stringify([baris, Object.keys(sumber).map((jenis) => !!sumber[jenis]())]);
    if (tanda === diterapkan) return false;
    Object.keys(sumber).forEach((jenis) => {
      const data = sumber[jenis]();
      if (!data) return;
      Object.entries(bawaan[jenis]).forEach(([bab, asli]) => {
        if (asli === undefined) delete data[bab];
        else data[bab] = asli;
      });
      bawaan[jenis] = {};
      baris.forEach(({ bab, isi }) => {
        if (!isi || isi[jenis] === undefined) return;
        bawaan[jenis][bab] = data[bab];
        data[bab] = isi[jenis];
      });
    });
    diterapkan = tanda;
    versi++;
    return true;
  }

  function pasang(rows) {
    baris = (rows || []).filter((r) => r && Number.isInteger(r.bab) && r.isi && typeof r.isi === "object");
    return terapkan();
  }

  /* Ambil isi terbit dari server (sekali per halaman). Selalu selesai tanpa
     error: gagal/offline/lambat -> tetap memakai isi dari cache. */
  function muat() {
    if (muatan) return muatan.then(terapkan).then(() => versi);
    if (!diterapkan) pasang(bacaCache());
    const client = window.supabaseClient;
    if (!client || !window.currentProfile) return Promise.resolve(versi);
    const ambil = client
      .from("konten_bab")
      .select("bab, isi")
      .then(({ data, error }) => {
        if (error) throw error;
        simpanCache(data || []);
        pasang(data || []);
      });
    const batas = new Promise((resolve) => setTimeout(resolve, BATAS_TUNGGU_MS));
    muatan = Promise.race([ambil, batas]).catch((error) => {
      console.warn("Isi pelajaran terbaru belum bisa dimuat, memakai salinan tersimpan.", error);
    });
    // Kalau server baru menjawab setelah batas waktu, isinya tetap dipasang
    // untuk pemakaian berikutnya (versi naik).
    ambil.catch(() => {});
    return muatan.then(terapkan).then(() => versi);
  }

  window.KontenBab = {
    muat,
    terapkan,
    get versi() {
      return versi;
    },
  };
})();
