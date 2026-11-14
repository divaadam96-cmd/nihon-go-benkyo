/* Halaman Prestasi (pages/prestasi.html): papan peringkat dari
   prestasi_papan() (supabase/add-prestasi.sql). Siswa melihat 10 besar
   (nama depan saja) + posisinya sendiri + rincian poinnya; Sensei/Operator
   melihat semua peserta dengan nama lengkap (nama membuka Pantau Siswa).
   Teks dari database selalu di-escape. Dijalankan auth.js setelah login. */
function initPage() {
  const esc = (t) => window.escapeHtml(String(t ?? ""));
  const angka = (n) => Number(n || 0).toLocaleString("id-ID");
  const $ = (id) => document.getElementById(id);
  const MEDALI = { 1: "🥇", 2: "🥈", 3: "🥉" };
  const KET = {
    "poin:minggu": "Poin yang diperoleh sejak Senin minggu ini.",
    "poin:semua": "Total poin prestasi sejak awal belajar.",
    "naik:minggu": "Berapa posisi naik di papan poin sepanjang waktu sejak awal minggu ini.",
    "streak:semua": "Hari berturut-turut belajar (Hafalan, materi, kanji) sampai hari ini atau kemarin.",
  };
  const SATUAN = { poin: "poin", naik: "posisi", streak: "hari" };
  let pilihan = { jenis: "poin", periode: "minggu" };

  function nilaiTeks(jenis, b) {
    if (jenis === "naik") return `naik ${b.nilai} <small>(#${b.dari} → #${b.ke})</small>`;
    return `${angka(b.nilai)} <small>${SATUAN[jenis]}</small>`;
  }
  function renderSaya(r) {
    const el = $("prSaya");
    if (!r) return;
    const bagian = [
      ["Nilai tugas", r.tugas],
      [`Pelajaran tuntas (${r.jumlah_tuntas})`, r.tuntas],
      ["Ujian ulang", r.ujian],
      ["Pola materi dipahami", r.materi],
      [`Tes Kemampuan (${r.jumlah_tes ?? 0})`, r.tes ?? 0],
    ];
    el.innerHTML = `<div class="pr-saya-total"><small>Poin prestasi saya</small><b>${angka(r.total)}</b><span>+${angka(Math.max(0, r.minggu))} minggu ini · streak ${angka(r.streak)} hari</span></div>
      <ul class="pr-saya-rincian">${bagian.map(([k, v]) => `<li><span>${esc(k)}</span><b>${angka(v)}</b></li>`).join("")}</ul>`;
    el.hidden = false;
  }
  async function muat() {
    const daftar = $("prDaftar");
    const posisi = $("prPosisi");
    daftar.innerHTML = '<li class="muted">Memuat…</li>';
    posisi.hidden = true;
    $("prKet").textContent = KET[`${pilihan.jenis}:${pilihan.periode}`];
    const { data, error } = await window.supabaseClient.rpc("prestasi_papan", { p_jenis: pilihan.jenis, p_periode: pilihan.periode });
    if (error) {
      daftar.innerHTML = `<li class="login-error">Gagal memuat papan: ${esc(error.message)}. Operator perlu menjalankan supabase/add-prestasi.sql.</li>`;
      return;
    }
    renderSaya(data.rincian);
    const jenis = data.jenis;
    if (!data.baris.length) {
      daftar.innerHTML = `<li class="muted">${jenis === "poin" && data.periode === "minggu" ? "Belum ada yang mendapat poin minggu ini. Kerjakan tugas untuk jadi yang pertama!" : "Belum ada data untuk papan ini."}</li>`;
    } else {
      daftar.innerHTML = data.baris.map((b) => {
        const nama = data.staf && b.id ? `<a href="pantau.html?siswa=${encodeURIComponent(b.id)}">${esc(b.nama)}</a>` : esc(b.nama);
        return `<li class="${b.saya ? "saya" : ""}${b.posisi <= 3 ? " juara" : ""}"><span class="pr-posisi-no">${MEDALI[b.posisi] || `#${b.posisi}`}</span><span class="pr-nama">${nama}${b.saya ? " <em>(saya)</em>" : ""}</span><span class="pr-nilai">${nilaiTeks(jenis, b)}</span></li>`;
      }).join("");
    }
    // Siswa di luar 10 besar: tampilkan posisinya sendiri di bawah daftar.
    if (!data.staf && data.rincian) {
      const terlihat = data.baris.some((b) => b.saya);
      if (data.saya && !terlihat) {
        posisi.innerHTML = `Posisi saya: <b>#${data.saya.posisi}</b> dari ${data.peserta} · ${nilaiTeks(jenis, data.saya)}`;
        posisi.hidden = false;
      } else if (!data.saya) {
        posisi.textContent = jenis === "naik" ? "Posisi saya belum naik minggu ini." : jenis === "streak" ? "Belajar hari ini untuk memulai streak." : "Saya belum punya poin di papan ini.";
        posisi.hidden = false;
      }
    }
  }
  $("prJenis").addEventListener("click", (event) => {
    const tombol = event.target.closest("button[data-jenis]");
    if (!tombol) return;
    pilihan = { jenis: tombol.dataset.jenis, periode: tombol.dataset.periode };
    $("prJenis").querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === tombol));
    muat();
  });
  muat();
}
window.initPage = initPage;
