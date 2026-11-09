/* Ringkasan kelas untuk Sensei/Operator di halaman Ringkasan (index.html,
   section#ringkasanKelas). Data dari ringkasan_kelas()
   (supabase/add-ringkasan-kelas.sql): posisi pelajaran, tuntas, nilai
   tugas, materi dipahami, keaktifan, dan alasan "perlu perhatian" tiap
   siswa. Nama siswa membuka detailnya di Pantau Siswa. Teks dari database
   selalu di-escape. Dipanggil dari initPage() di js/pages/dashboard.js. */
window.RingkasanKelas = (function () {
  const esc = (t) => window.escapeHtml(String(t ?? ""));
  const RENTANG = [[1, 5], [6, 10], [11, 15], [16, 20], [21, 25], [26, 30], [31, 35], [36, 40], [41, 45], [46, 50]];
  const URUT = {
    nama: (a, b) => a.nama.localeCompare(b.nama, "id"),
    pelajaran: (a, b) => b.pelajaran - a.pelajaran || b.tuntas - a.tuntas,
    tertinggal: (a, b) => a.pelajaran - b.pelajaran || a.tuntas - b.tuntas,
    nilai: (a, b) => (a.rata_tugas ?? 101) - (b.rata_tugas ?? 101),
    aktif: (a, b) => (a.terakhir || "").localeCompare(b.terakhir || ""),
  };
  let data = null;

  const tanggal = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("id-ID", { day: "numeric", month: "short", timeZone: "UTC" });
  function terakhirTeks(iso) {
    if (!iso) return "Belum pernah";
    const hari = Math.round((new Date(`${data.hari_ini}T00:00:00Z`) - new Date(`${iso}T00:00:00Z`)) / 864e5);
    if (hari <= 0) return "Hari ini";
    if (hari === 1) return "Kemarin";
    if (hari < 7) return `${hari} hari lalu`;
    return tanggal(iso);
  }
  const tautan = (s) => `<a href="pages/pantau.html?siswa=${encodeURIComponent(s.id)}">${esc(s.nama)}</a>`;

  function renderAngka() {
    const perhatian = data.siswa.filter((s) => s.perhatian.length).length;
    const kartu = [
      ["Siswa aktif 7 hari terakhir", `${data.aktif_7} / ${data.total_siswa}`, `${data.aktif_hari_ini} siswa belajar hari ini`],
      ["Rata-rata pelajaran tuntas", data.rata_tuntas ?? 0, "per siswa, dari 50 pelajaran"],
      ["Rata-rata nilai tugas", data.rata_tugas ?? "–", `KKM ${data.kkm}`],
      ["Perlu perhatian", `${perhatian} siswa`, perhatian ? "lihat daftar di bawah" : "semua siswa aman"],
    ];
    document.getElementById("rkAngka").innerHTML = kartu
      .map(([judul, angka, ket]) => `<article class="card metric"><small>${esc(judul)}</small><b>${esc(angka)}</b><p>${esc(ket)}</p></article>`)
      .join("");
  }
  function renderPerhatian() {
    const daftar = data.siswa.filter((s) => s.perhatian.length).sort(URUT.tertinggal);
    document.getElementById("rkPerhatian").innerHTML = daftar.length
      ? `<ul class="rk-perhatian">${daftar.map((s) => `<li>${tautan(s)}<span>Pelajaran ${s.pelajaran}</span><small>${s.perhatian.map(esc).join(" · ")}</small></li>`).join("")}</ul>`
      : '<p class="muted">Tidak ada siswa yang perlu perhatian khusus saat ini. 👍</p>';
  }
  function renderSebaran() {
    const jumlah = RENTANG.map(([a, b]) => data.siswa.filter((s) => s.pelajaran >= a && s.pelajaran <= b).length);
    const maks = Math.max(1, ...jumlah);
    document.getElementById("rkSebaran").innerHTML = `<p class="muted rk-ket">Jumlah siswa menurut pelajaran yang sedang dikerjakan.</p><div class="rk-sebaran">${RENTANG.map(([a, b], i) =>
      `<div class="rk-bar"><span>Pel. ${a}–${b}</span><div class="track"><div class="fill" style="width:${Math.round((jumlah[i] / maks) * 100)}%"></div></div><b>${jumlah[i]}</b></div>`).join("")}</div>`;
  }
  function renderTersulit() {
    document.getElementById("rkTersulit").innerHTML = data.tersulit.length
      ? `<ol class="rk-tersulit">${data.tersulit.map((t) => `<li><b>Pelajaran ${t.bab}</b><span>rata-rata ${t.rata}</span><small>${t.siswa} siswa mengerjakan</small></li>`).join("")}</ol><a class="ks-link" href="pages/pantau.html">Lihat soal yang paling sering salah di Pantau Siswa →</a>`
      : '<p class="muted">Belum ada nilai tugas.</p>';
  }
  function renderTabel() {
    const cari = document.getElementById("rkCari").value.trim().toLowerCase();
    const urut = URUT[document.getElementById("rkUrut").value] || URUT.nama;
    const baris = data.siswa.filter((s) => s.nama.toLowerCase().includes(cari)).sort(urut);
    document.getElementById("rkBaris").innerHTML = baris.length
      ? baris.map((s) => `<tr class="${s.perhatian.length ? "rk-perlu" : ""}"><th scope="row">${tautan(s)}</th><td>${s.pelajaran}</td><td>${s.tuntas}</td><td>${s.materi_paham}</td><td>${s.rata_tugas ?? "–"}</td><td>${s.streak} hari</td><td>${esc(terakhirTeks(s.terakhir))}</td></tr>`).join("")
      : '<tr><td colspan="7" class="muted">Tidak ada siswa yang cocok.</td></tr>';
  }

  async function muat() {
    const section = document.getElementById("ringkasanKelas");
    if (!section) return;
    section.hidden = false;
    section.classList.add("active");
    const { data: hasil, error } = await window.supabaseClient.rpc("ringkasan_kelas");
    if (error) {
      document.getElementById("rkAngka").innerHTML = "";
      document.getElementById("rkPerhatian").innerHTML = `<p class="login-error">Gagal memuat ringkasan: ${esc(error.message)}. Operator perlu menjalankan supabase/add-ringkasan-kelas.sql.</p>`;
      return;
    }
    data = hasil;
    if (!data.total_siswa) {
      document.getElementById("rkPerhatian").innerHTML = '<p class="muted">Belum ada siswa terdaftar.</p>';
      return;
    }
    renderAngka();
    renderPerhatian();
    renderSebaran();
    renderTersulit();
    renderTabel();
    document.getElementById("rkCari").oninput = renderTabel;
    document.getElementById("rkUrut").onchange = renderTabel;
  }
  return { muat };
})();
