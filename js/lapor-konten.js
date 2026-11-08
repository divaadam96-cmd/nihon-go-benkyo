/* Laporan isi pelajaran dari siswa (supabase/add-laporan-konten.sql).
   LaporKonten.buka({bab, lokasi, rujukan, bagian}) membuka dialog laporan:
     lokasi  = "materi" atau "tugas-<target>" (mis. tugas-kotoba-jp-id)
     rujukan = teks yang dilaporkan (soal + jawaban), maks. 300 karakter
     bagian  = pilihan opsional (mis. daftar pola) - jadi rujukan bila dipilih
   Laporan masuk ke antrian Kelola Materi; tanggapan Operator tampil lagi
   ke siswa lewat LaporKonten.cekTanggapan(). Semua teks dipasang lewat
   textContent/value. Dipakai halaman Materi (materi + tugas). */
(function () {
  const JENIS = [
    ["tidak_sesuai", "Sudah tidak sesuai dengan keadaan di Jepang sekarang"],
    ["salah", "Ada yang salah (tulisan, arti, atau jawaban)"],
    ["kurang_jelas", "Penjelasan kurang jelas"],
    ["lainnya", "Lainnya"],
  ];
  const STATUS = { baru: "Terkirim", diproses: "Sedang diperiksa", selesai: "Sudah diperbaiki", ditolak: "Tidak diubah" };
  const DILIHAT_KEY = "nihonLaporDilihat";
  let dialog = null;
  let konteks = null;

  const el = (tag, props = {}, ...anak) => {
    const node = Object.assign(document.createElement(tag), props);
    node.append(...anak);
    return node;
  };
  const tanggal = (iso) => new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  const pesanError = (error) => (error && error.message) || "Laporan belum terkirim. Periksa koneksi lalu coba lagi.";

  function buatDialog() {
    const jenis = el("select", { className: "lapor-jenis", required: true },
      el("option", { value: "", textContent: "Pilih masalahnya…" }),
      ...JENIS.map(([value, textContent]) => el("option", { value, textContent })));
    const bagian = el("select", { className: "lapor-bagian" });
    const pesan = el("textarea", {
      className: "lapor-teks", rows: 4, maxLength: 1000, required: true,
      placeholder: "Contoh: sekarang banyak konbini memakai kasir mandiri, jadi percakapan ini jarang terjadi.",
    });
    const status = el("p", { className: "lapor-status" });
    status.setAttribute("aria-live", "polite");
    const kirim = el("button", { type: "submit", className: "primary", textContent: "Kirim laporan" });
    const batal = el("button", { type: "button", className: "secondary", textContent: "Batal" });
    const daftar = el("ul", { className: "lapor-daftar" });
    const form = el("form", { className: "lapor-form" },
      el("h3", { id: "laporJudul", textContent: "Laporkan isi pelajaran" }),
      el("p", { className: "lapor-konteks" }),
      el("label", { className: "lapor-bagian-wrap" }, "Bagian", bagian),
      el("label", {}, "Masalahnya", jenis),
      el("label", {}, "Jelaskan singkat", pesan),
      el("p", { className: "lapor-catatan", textContent: "Laporan dibaca Operator. Tanggapannya akan muncul di halaman Materi." }),
      status,
      el("div", { className: "lapor-aksi" }, batal, kirim),
      el("details", { className: "lapor-riwayat" }, el("summary", { textContent: "Laporan saya" }), daftar));
    dialog = el("dialog", { className: "lapor-dialog" }, form);
    dialog.setAttribute("aria-labelledby", "laporJudul");
    document.body.append(dialog);

    batal.onclick = () => dialog.close();
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const client = window.supabaseClient;
      if (!client) return;
      kirim.disabled = true;
      status.className = "lapor-status";
      status.textContent = "Mengirim…";
      const pilihan = bagian.value;
      const { error } = await client.rpc("lapor_konten", {
        p_bab: konteks.bab,
        p_lokasi: konteks.lokasi,
        p_rujukan: (pilihan || konteks.rujukan || "").slice(0, 300),
        p_jenis: jenis.value,
        p_pesan: pesan.value.trim(),
      });
      kirim.disabled = false;
      if (error) {
        status.className = "lapor-status gagal";
        status.textContent = pesanError(error);
        return;
      }
      status.className = "lapor-status berhasil";
      status.textContent = "Terima kasih! Laporan terkirim.";
      pesan.value = "";
      jenis.value = "";
      muatRiwayat();
      setTimeout(() => dialog.open && status.classList.contains("berhasil") && dialog.close(), 1500);
    });
  }

  async function muatRiwayat() {
    const daftar = dialog.querySelector(".lapor-daftar");
    const client = window.supabaseClient;
    if (!client) return;
    const { data, error } = await client
      .from("laporan_konten")
      .select("id, created_at, bab, rujukan, pesan, status, tanggapan")
      .order("created_at", { ascending: false })
      .limit(5);
    if (error || !data || !data.length) {
      daftar.replaceChildren(el("li", { className: "muted", textContent: error ? "Riwayat belum bisa dimuat." : "Belum ada laporan." }));
      return;
    }
    daftar.replaceChildren(...data.map((r) => el("li", {},
      el("b", { textContent: `Pelajaran ${r.bab} · ${tanggal(r.created_at)} · ${STATUS[r.status] || r.status}` }),
      el("span", { textContent: r.pesan }),
      ...(r.tanggapan ? [el("span", { className: "lapor-tanggapan", textContent: `Tanggapan: ${r.tanggapan}` })] : []))));
  }

  function buka({ bab, lokasi, rujukan = "", bagian = [] }) {
    if (!window.supabaseClient || !window.currentProfile) return;
    if (!dialog) buatDialog();
    konteks = { bab, lokasi, rujukan };
    const asal = lokasi === "materi" ? "Materi" : "Soal tugas";
    dialog.querySelector(".lapor-konteks").textContent = `Pelajaran ${bab} · ${asal}${rujukan ? ` · ${rujukan}` : ""}`;
    const pilihBagian = dialog.querySelector(".lapor-bagian");
    pilihBagian.replaceChildren(
      el("option", { value: "", textContent: "Umum / tidak spesifik" }),
      ...bagian.map((teks) => el("option", { value: teks.slice(0, 300), textContent: teks })));
    dialog.querySelector(".lapor-bagian-wrap").hidden = !bagian.length;
    const status = dialog.querySelector(".lapor-status");
    status.className = "lapor-status";
    status.textContent = "";
    dialog.querySelector(".lapor-riwayat").open = false;
    dialog.showModal();
    dialog.querySelector(".lapor-jenis").focus();
    muatRiwayat();
  }

  /* Tampilkan tanggapan Operator atas laporan siswa ini yang belum dilihat
     (selesai/ditolak sejak terakhir ditutup; perangkat baru: 30 hari). */
  async function cekTanggapan(sebelum) {
    const client = window.supabaseClient;
    if (!client || !window.currentProfile || !sebelum) return;
    let dilihat = null;
    try {
      dilihat = localStorage.getItem(DILIHAT_KEY);
    } catch {
      // Tanpa penyimpanan: anggap perangkat baru.
    }
    const batas = dilihat || new Date(Date.now() - 30 * 864e5).toISOString();
    const { data, error } = await client
      .from("laporan_konten")
      .select("id, bab, status, tanggapan, ditangani_at")
      .in("status", ["selesai", "ditolak"])
      .gt("ditangani_at", batas)
      .order("ditangani_at", { ascending: false })
      .limit(5);
    if (error || !data || !data.length) return;
    const tutup = el("button", { type: "button", className: "secondary", textContent: "Tutup" });
    const kotak = el("section", { className: "lapor-tanggapan-box card" },
      el("h3", { textContent: "📮 Laporan Anda sudah ditanggapi" }),
      el("ul", {}, ...data.map((r) => el("li", {},
        el("b", { textContent: `Pelajaran ${r.bab} - ${STATUS[r.status]}` }),
        r.tanggapan ? `: ${r.tanggapan}` : ""))),
      el("p", { className: "muted", textContent: "Terima kasih sudah membantu memperbaiki materi." }),
      tutup);
    tutup.onclick = () => {
      try {
        localStorage.setItem(DILIHAT_KEY, data[0].ditangani_at);
      } catch {
        // Tidak tersimpan - kotak muncul lagi di kunjungan berikutnya.
      }
      kotak.remove();
    };
    sebelum.before(kotak);
  }

  window.LaporKonten = { buka, cekTanggapan };
})();
