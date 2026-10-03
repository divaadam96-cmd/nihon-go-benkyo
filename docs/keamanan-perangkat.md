# Keamanan Perangkat & Akun Pengembang

Laptop pengembang memegang akses penuh ke aplikasi: **database production**
(Supabase CLI), **deploy** (Vercel CLI), dan **repo** (GitHub CLI) - dan sejak
Vercel terhubung ke GitHub, **siapa pun yang bisa push ke `main` bisa
mengubah website production**. Kalau laptop hilang, dicuri, atau terkena
malware, semuanya ikut terbuka. Dokumen ini adalah daftar periksa untuk itu.

Hasil pemeriksaan terakhir: **3 Oktober 2026** (laptop pengembang utama).

## 1. Laptop

| Pemeriksaan | Hasil | Tindakan |
|---|---|---|
| Enkripsi disk (BitLocker C:) | ✅ aktif | Pastikan **kunci pemulihan** tersimpan di akun Microsoft (<https://aka.ms/myrecoverykey>) atau dicetak & disimpan aman - **bukan** di laptop itu sendiri. |
| Antivirus (Microsoft Defender) | ✅ aktif, real-time, signature terbaru | - |
| Layar mati / tidur otomatis | ❌ **tidak pernah** (layar tidak pernah mati, baik dicolok maupun baterai) | Lihat langkah di bawah. |
| Minta login setelah screensaver | ❌ tidak diatur | Lihat langkah di bawah. |

**Mengunci laptop otomatis (Windows 10):**

1. **Settings → System → Power & sleep**
   - *Screen*: mati setelah **5 menit** (baterai) / **10 menit** (dicolok).
   - *Sleep*: tidur setelah **15 menit** (baterai) / **30 menit** (dicolok).
2. **Settings → Accounts → Sign-in options** → *Require sign-in*: **When PC
   wakes up from sleep**.
3. (Tambahan) **Settings → Personalization → Lock screen → Screen saver
   settings**: tunggu **5 menit**, centang **On resume, display logon screen**.
4. Kebiasaan: tekan **`Win + L`** setiap meninggalkan laptop.

## 2. Akun online (verifikasi dua langkah)

Akun-akun ini lebih penting daripada laptop: siapa pun yang menguasainya bisa
mengubah website atau database tanpa laptop sama sekali. Aktifkan **2FA dengan
aplikasi authenticator** (bukan SMS) dan simpan **kode pemulihan** di tempat
aman di luar laptop.

| Akun | Kenapa penting | Tempat mengaktifkan 2FA |
|---|---|---|
| **GitHub** (`divaadam96-cmd`) | Push ke `main` = deploy production | Settings → Password and authentication → Two-factor authentication |
| **Vercel** | Deploy, domain, variabel lingkungan | Account Settings → Authentication |
| **Supabase** (pemilik proyek) | Seluruh database, SQL Editor, reset MFA Operator | Account → Security → Multi-factor authentication |
| **Email `divaadam96@gmail.com`** | Reset password semua akun di atas | Google Account → Security → 2-Step Verification |
| Akun **Operator** di website | Kelola soal, akun, data siswa | Sudah wajib MFA sejak perbaikan keamanan #1 |

Status 2FA GitHub tidak bisa dibaca dari token CLI yang ada (izinnya tidak
mencakup itu) - periksa langsung di halaman GitHub di atas.

## 3. Kredensial CLI di laptop

| Alat | Tersimpan di | Izin |
|---|---|---|
| GitHub CLI (`gh`) | Windows Credential Manager (`gh:github.com:…`) | `repo`, `gist`, `read:org` |
| Supabase CLI | Windows Credential Manager (`Supabase CLI:supabase`) | akses penuh proyek (termasuk SQL ke database production) |
| Vercel CLI | file `%APPDATA%\com.vercel.cli\Data\auth.json` | deploy & pengaturan proyek |

- **Saat tidak dipakai lama** (mis. laptop dibawa bepergian): `supabase logout`,
  `vercel logout`, `gh auth logout`. Login lagi kapan perlu (`supabase login`,
  `vercel login`, `gh auth login`).
- **Kalau laptop hilang/dicuri, cabut dari perangkat lain secepatnya:**
  - GitHub: Settings → Applications → *Authorized OAuth Apps* → **GitHub CLI** → Revoke
  - Supabase: Dashboard → Account → **Access Tokens** → hapus token CLI
  - Vercel: Account Settings → **Tokens** → hapus token CLI
  - Lalu ganti password ketiganya dan password akun Operator.

## 4. Repo

| Pemeriksaan | Hasil |
|---|---|
| Rahasia (service role key, private key, token) di repo & seluruh riwayat git | ✅ tidak ada (kunci di `js/auth.js` adalah anon key yang memang publik) |
| `.env.local` diabaikan git & Vercel | ✅ ya (`.gitignore`, `.vercelignore`) |
| Branch `main` dilindungi | ✅ sejak 3 Oktober 2026 - ruleset **"Lindungi main (production)"**: wajib lewat Pull Request, force push & hapus branch dilarang (diuji: push langsung ditolak GitHub) |

**Perlindungan `main`** diatur di GitHub → repo → Settings → Rules →
Rulesets → *Lindungi main (production)*. Akibatnya semua perubahan harus
lewat branch + Pull Request lalu di-merge (`gh pr merge <nomor> --merge`);
`git push origin main` langsung akan ditolak. Jumlah approval 0 karena
pengembang tunggal - tujuannya mencegah push tidak sengaja ke production.
