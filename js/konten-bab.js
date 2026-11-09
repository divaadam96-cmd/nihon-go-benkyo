/* Isi pelajaran hasil suntingan Operator (Kelola Materi,
   supabase/add-editor-konten.sql) menimpa isi bawaan dari berkas data:
     kosakata -> babKosakataData[bab]   (data/bab-data.js)
     kanji    -> babKanjiData[bab]      (data/bab-data.js)
     kalimat  -> tugasKalimatData[bab]  (data/tugas-kalimat-data.js)
     materi   -> MATERI_BOOK1_LESSONS / MATERI_BOOK2_LESSONS
                 (data/materi-grammar-data.js; HTML-nya disaring ulang di
                 sini dengan sanitizeQuestionHtml, js/soal-html.js)
     pengecoh -> tugasKategoriKata, tugasSinonim (data/tugas-kategori-
                 data.js) & kanjiMiripData (data/kanji-mirip-data.js) -
                 data ini lintas pelajaran, jadi pengecoh SEMUA pelajaran
                 digabung sekaligus ke salinan isi bawaannya (gabungPengecoh)
   Dipakai Hafalan, Tugas (js/tugas-bab.js) & Materi. Jalankan SETELAH berkas data
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
  /* Tiap jenis: data() = wadah global (null kalau berkasnya belum dimuat),
     get/set isi satu bab di wadah itu. */
  const perBab = (ambil) => ({
    data: ambil,
    get: (data, bab) => data[bab],
    set: (data, bab, isi) => {
      if (isi === undefined) delete data[bab];
      else data[bab] = isi;
    },
  });
  const sumber = {
    kosakata: perBab(() => (typeof babKosakataData !== "undefined" ? babKosakataData : null)),
    kanji: perBab(() => (typeof babKanjiData !== "undefined" ? babKanjiData : null)),
    kalimat: perBab(() => (typeof tugasKalimatData !== "undefined" ? tugasKalimatData : null)),
    materi: {
      data: () => (typeof MATERI_BOOK1_LESSONS !== "undefined" && typeof MATERI_BOOK2_LESSONS !== "undefined"
        ? [MATERI_BOOK1_LESSONS, MATERI_BOOK2_LESSONS] : null),
      get: ([b1, b2], bab) => (bab <= 25 ? b1[bab - 1] : b2[bab - 26]),
      set: ([b1, b2], bab, isi) => {
        if (isi === undefined) return; // pelajaran 1-50 selalu ada
        if (bab <= 25) b1[bab - 1] = isi;
        else b2[bab - 26] = isi;
      },
      saring: saringMateri,
    },
  };
  const bawaan = { kosakata: {}, kanji: {}, kalimat: {}, materi: {} }; // isi asli bab yang pernah ditimpa

  /* Gabungkan bagian "pengecoh" dari baris-baris [{bab, isi}] ke SALINAN
     data pengecoh bawaan `asli` = {kategori, sinonim, mirip}:
       kelompok   {kata: "acuan@babAcuan"} -> kata@bab masuk kelompok makna
                  kata acuan (kalau acuan belum berkelompok, keduanya jadi
                  kelompok baru "operator:acuan@babAcuan")
       sinonim    {kata: [kata lain]}      -> pasangan tugasSinonim
       kanjiMirip {kanji: [kanji mirip]}   -> ditambahkan ke kanjiMiripData
     Dipakai juga pratinjau "Contoh soal" di Kelola Materi. */
  function gabungPengecoh(asli, rows) {
    const kategori = JSON.parse(JSON.stringify(asli.kategori));
    const sinonim = JSON.parse(JSON.stringify(asli.sinonim));
    const mirip = JSON.parse(JSON.stringify(asli.mirip));
    // Kelompok kata acuan: entri khusus bab ("kata@bab") didahulukan.
    const grupDari = (entri) => {
      const kata = entri.split("@")[0];
      const daftar = Object.entries(kategori);
      return (daftar.find(([, isi]) => isi.includes(entri)) || daftar.find(([, isi]) => isi.includes(kata)) || [null])[0];
    };
    rows.forEach(({ bab, isi }) => {
      const p = isi && isi.pengecoh;
      if (!p || typeof p !== "object") return;
      Object.entries(p.kelompok || {}).forEach(([kata, acuan]) => {
        if (typeof acuan !== "string" || !acuan.includes("@")) return;
        let nama = grupDari(acuan);
        if (!nama) {
          nama = `operator:${acuan}`;
          kategori[nama] ||= [acuan];
        }
        // Keluarkan dulu dari kelompok lain di bab ini (kalau pernah dimasukkan).
        Object.values(kategori).forEach((isiGrup) => {
          const i = isiGrup.indexOf(`${kata}@${bab}`);
          if (i >= 0) isiGrup.splice(i, 1);
        });
        kategori[nama].push(`${kata}@${bab}`);
      });
      Object.entries(p.sinonim || {}).forEach(([kata, lain]) => {
        if (Array.isArray(lain)) lain.forEach((l) => typeof l === "string" && sinonim.push([kata, l]));
      });
      Object.entries(p.kanjiMirip || {}).forEach(([kanji, daftar]) => {
        if (Array.isArray(daftar)) mirip[kanji] = [...new Set([...(mirip[kanji] || []), ...daftar.filter((k) => typeof k === "string" && k !== kanji)])];
      });
    });
    return { kategori, sinonim, mirip };
  }
  /* Data pengecoh dideklarasikan `const` di berkas data, jadi isinya
     diganti di tempat (objek/array yang sama), dari salinan aslinya. */
  let pengecohAsli = null;
  function pasangPengecoh(rows) {
    if (typeof tugasKategoriKata === "undefined" || typeof tugasSinonim === "undefined" || typeof kanjiMiripData === "undefined") return false;
    pengecohAsli ||= JSON.parse(JSON.stringify({ kategori: tugasKategoriKata, sinonim: tugasSinonim, mirip: kanjiMiripData }));
    const baru = gabungPengecoh(pengecohAsli, rows);
    const ganti = (wadah, isi) => {
      Object.keys(wadah).forEach((k) => delete wadah[k]);
      Object.assign(wadah, isi);
    };
    ganti(tugasKategoriKata, baru.kategori);
    ganti(kanjiMiripData, baru.mirip);
    tugasSinonim.length = 0;
    tugasSinonim.push(...baru.sinonim);
    return true;
  }

  /* Lapisan kedua (server sudah memvalidasi dengan allowlist yang sama):
     semua teks materi disaring sebelum dirender sebagai HTML. */
  function saringMateri(isi) {
    const saring = typeof window.sanitizeQuestionHtml === "function" ? window.sanitizeQuestionHtml : null;
    if (!saring) return null; // tanpa penyaring, isi suntingan tidak dipakai
    const h = (v) => (typeof v === "string" ? saring(v) : v);
    return {
      title: String(isi.title || ""),
      items: (isi.items || []).map((it) => ({
        ...it,
        title: h(it.title),
        suffix: h(it.suffix),
        blocks: (it.blocks || []).map((b) => ({
          ...b,
          label: h(b.label),
          text: h(b.text),
          note: h(b.note),
          table: b.table ? { headers: b.table.headers.map(h), rows: b.table.rows.map((r) => r.map(h)) } : undefined,
          examples: b.examples ? b.examples.map((e) => e.map(h)) : undefined,
        })),
      })),
    };
  }
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
    const adaPengecoh = typeof tugasKategoriKata !== "undefined" && typeof tugasSinonim !== "undefined" && typeof kanjiMiripData !== "undefined";
    const tanda = JSON.stringify([baris, Object.keys(sumber).map((jenis) => !!sumber[jenis].data()), adaPengecoh]);
    if (tanda === diterapkan) return false;
    Object.entries(sumber).forEach(([jenis, s]) => {
      const data = s.data();
      if (!data) return;
      Object.entries(bawaan[jenis]).forEach(([bab, asli]) => s.set(data, Number(bab), asli));
      bawaan[jenis] = {};
      baris.forEach(({ bab, isi }) => {
        if (!isi || isi[jenis] === undefined) return;
        const baru = s.saring ? s.saring(isi[jenis]) : isi[jenis];
        if (baru == null) return;
        bawaan[jenis][bab] = s.get(data, bab);
        s.set(data, bab, baru);
      });
    });
    pasangPengecoh(baris);
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
    gabungPengecoh,
    get versi() {
      return versi;
    },
  };
})();
