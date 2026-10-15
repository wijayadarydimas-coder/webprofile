# Wijaya Dary Dimas — Personal Digital Hub & Portfolio

> **"Exploring Technology. Building Ideas. Creating Impact."**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_Interactive-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![Database](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![AI Assistant](https://img.shields.io/badge/AI_Assistant-Google_Gemini-4285F4?style=flat-square&logo=google)](https://aistudio.google.com/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

Website personal _production-ready_ untuk **Wijaya Dary Dimas**, dirancang dengan identitas visual _dark modern_ yang elegan, profesional, alami, dan berkepribadian manusia.

Website ini bukan sekadar portofolio statis, melainkan **Personal Digital Hub** interaktif yang mencakup personal branding, portofolio proyek terverifikasi, studi kasus mendalam, riwayat pengalaman di Badan Informasi Geospasial (BIG), rekam jejak pendidikan di Universitas Muhammadiyah Purwokerto (UMP), skripsi modifikasi YOLOv11 deteksi APD, asisten AI terintegrasi, forum diskusi komunitas 2-arah, dan panel admin lengkap untuk mengelola seluruh konten secara dinamis.

---

## 📑 Daftar Isi

1. [Fitur Utama](#-fitur-utama)
2. [Stack Teknologi](#-stack-teknologi)
3. [Panduan Instalasi Cepat](#-panduan-instalasi-cepat)
4. [Penjelasan Lengkap Environment Variables (.env)](#-penjelasan-lengkap-environment-variables-env)
5. [Panduan Menghubungkan Database Supabase](#-panduan-menghubungkan-database-supabase)
6. [Panduan Menghubungkan Google Gemini AI](#-panduan-menghubungkan-google-gemini-ai)
7. [Panduan Deployment ke Vercel](#-panduan-deployment-ke-vercel)
8. [Mengakses Admin Dashboard](#-mengakses-admin-dashboard)
9. [Struktur Direktori Proyek](#-struktur-direktori-proyek)
10. [Lisensi](#-lisensi--hak-cipta)

---

## ✨ Fitur Utama

1. **Personal Branding & Hero 3D Interaktif**
   - Tagline resmi: _"Exploring Technology. Building Ideas. Creating Impact."_
   - Elemen 3D abstrak berbasis **Three.js** dengan pencahayaan halus, rotasi teredam interaktif (_pointer-reactive_), dan fallback visual otomatis untuk perangkat ringan atau preferensi `prefers-reduced-motion`.
   - Foto profil resmi yang dapat diperbarui secara dinamis langsung dari dashboard admin.
2. **Portofolio Proyek & Studi Kasus Mendalam (`/projects`)**
   - Direktori proyek dengan filter kategori (_Computer Vision_, _Geospatial_, _Full-Stack_, _System Architecture_) dan pencarian kata kunci langsung.
   - Halaman detail studi kasus (`/projects/[slug]`) dengan struktur arsitektur: Masalah (_Problem_), Solusi Teknis (_Solution_), dan Hasil Evaluasi Nyata (_Results_).
3. **Rekam Jejak Profesional & Pendidikan Terverifikasi (`/#experience`)**
   - **Pranata Komputer** di **Badan Informasi Geospasial (BIG)** (Periode: November 2025 – Mei 2026), berfokus pada infrastruktur data spasial dan sistem komputasi.
   - **S1 Teknik Informatika** di **Universitas Muhammadiyah Purwokerto (UMP)**.
4. **Penelitian & Skripsi Khusus (`/research`)**
   - _"Implementasi YOLOv11 Modifikasi Untuk Deteksi Alat Pelindung Diri Helm Rompi, Sarung Tangan Dan Sepatu Dengan Alarm Otomatis."_
   - Arsitektur ekstraksi multi-skala, deteksi 4 kelas APD industri (_Safety Helmet_, _Safety Vest_, _Gloves_, _Safety Boots_), dataset industri, dan integrasi pemicu alarm audio-visual otomatis.
5. **Asisten AI Terintegrasi (`/api/ai/chat`)**
   - Didukung oleh model **Google Gemini** (misal `gemini-3.5-flash-lite`, `gemini-1.5-flash`, `gemini-2.0-flash`).
   - Server-side only: API key aman dan tidak pernah terekspos ke sisi klien.
   - _Grounded Knowledge_: Jawaban AI didasarkan pada basis fakta resmi pemilik website seputar skripsi, riwayat magang, proyek, dan kontak.
   - Fitur proteksi: pembatasan frekuensi (_rate limiting_), validasi skema Zod, sanitasi XSS, serta _grounded fallback preview_ otomatis jika API key belum dipasang.
6. **Forum Komunitas & Komentar Dua Arah (`/community`)**
   - Sistem diskusi _threaded_ (balasan bersarang berjenjang).
   - Sistem autentikasi mandiri bagi pengunjung untuk membuat akun, menulis, mengedit, dan menghapus komentar sendiri.
   - Fitur _soft-delete_ otomatis agar struktur hierarki pohon diskusi tidak rusak saat sebuah komentar dihapus.
   - Panel moderasi admin untuk mengontrol visibilitas komentar atau menyaring spam.
7. **Admin Dashboard Lengkap (`/admin`)**
   - Dilindungi autentikasi sesi JWT HttpOnly berbasis peran administrator.
   - Modul: Profil & Hero, Portofolio Proyek (CRUD & cover upload), Pengalaman Kerja & Pendidikan, Riset Skripsi, Media Library, Moderasi Komentar, dan Konfigurasi AI.
8. **Media Library & Upload Berkas (`/admin/media`)**
   - Upload file aman dengan verifikasi tipe MIME (JPEG, PNG, WebP, SVG, PDF), batas ukuran 10MB, dan sanitasi berkas SVG.
9. **Koneksi Database Dual-Mode (Zero-Config Development)**
   - Mendukung PostgreSQL langsung (`DATABASE_URL`), Supabase / PostgREST, serta **Local Adaptive Store** bawaan di `.data/db.json` sehingga aplikasi dapat langsung dijalankan oleh siapa saja tanpa perlu konfigurasi database di awal.

---

## 🛠️ Stack Teknologi

| Kategori                   | Teknologi                                                        |
| :------------------------- | :--------------------------------------------------------------- |
| **Framework**              | Next.js 16.4+ (App Router, Server Components, Turbopack)         |
| **Bahasa Pemrograman**     | TypeScript (Strict Mode)                                         |
| **Styling & Desain**       | Tailwind CSS v4, HSL Color Palette, Custom CSS Variables         |
| **Visual 3D**              | Three.js (dengan _resource disposal_ & _low-power fallback_)     |
| **Basis Data**             | PostgreSQL / Supabase / PostgREST (fallback Local Store)         |
| **Keamanan & Autentikasi** | Jose (JWT HttpOnly Cookies), Bcryptjs (Password Hashing)         |
| **Validasi & Sanitasi**    | Zod, DOMPurify Sanitization                                      |
| **Asisten AI**             | Google Gemini API (`gemini-3.5-flash-lite` / `gemini-1.5-flash`) |
| **Ikon Antarmuka**         | Lucide React                                                     |

---

## ⚡ Panduan Instalasi Cepat

### 1. Kloning Repositori

```bash
git clone https://github.com/wijayadarydimas-coder/webprofile.git
cd webprofile
```

### 2. Install Dependensi

```bash
npm install
```

### 3. Buat File Konfigurasi `.env.local`

Salin template `.env.example`:

- **Windows (PowerShell)**:
  ```powershell
  Copy-Item .env.example .env.local
  ```
- **Linux / macOS**:
  ```bash
  cp .env.example .env.local
  ```

### 4. Jalankan Server Pengembangan

```bash
npm run dev
```

Buka browser di: [http://localhost:3000](http://localhost:3000)

> [!NOTE]
> **Aplikasi langsung berfungsi seketika!** Jika Anda belum mengatur Supabase atau Gemini AI, aplikasi otomatis berjalan dalam mode **Local Adaptive Store** dengan data awal terverifikasi.

---

## 🔑 Penjelasan Lengkap Environment Variables (.env)

Berikut adalah panduan lengkap setiap variabel yang ada di `.env.example` dan `.env.local`:

| Nama Variabel                   |  Wajib?  | Contoh Isi                                                                   | Penjelasan & Fungsi                                                                                                            |
| :------------------------------ | :------: | :--------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          |  **Ya**  | `http://localhost:3000` (lokal)<br>`https://proyek-anda.vercel.app` (Vercel) | URL publik situs Anda. Digunakan oleh mesin pencari (SEO), tautan kanonikal, Open Graph preview media sosial, dan sitemap XML. |
| `AUTH_SECRET`                   |  **Ya**  | `min-32-karakter-acak-dan-sangat-rahasia`                                    | Kunci enkripsi untuk menandatangani _JWT session cookie_ HttpOnly pada login Admin dan autentikasi Komentar Komunitas.         |
| `ADMIN_EMAIL`                   | Opsional | `admin@wijayadarydimas.dev`                                                  | Email akun administrator awal untuk masuk pertama kali ke `/admin/login`.                                                      |
| `ADMIN_PASSWORD`                | Opsional | `PasswordSuperAman2026!`                                                     | Password akun administrator awal.                                                                                              |
| `DATABASE_URL`                  |  Opsi A  | `postgresql://postgres:pass@host:6543/postgres`                              | URI koneksi PostgreSQL lengkap (didapat dari Supabase Dashboard).                                                              |
| `host` / `HOST`                 |  Opsi B  | `aws-0-ap-southeast-1.pooler.supabase.com`                                   | Host database jika menggunakan format parameter terpisah dari Supabase.                                                        |
| `port` / `PORT`                 |  Opsi B  | `6543` (Pooling) atau `5432` (Direct)                                        | Port database PostgreSQL Supabase.                                                                                             |
| `database` / `DATABASE`         |  Opsi B  | `postgres`                                                                   | Nama database Supabase.                                                                                                        |
| `user` / `USER`                 |  Opsi B  | `postgres.xxxxxx`                                                            | Username database PostgreSQL Supabase.                                                                                         |
| `password` / `PASSWORD`         |  Opsi B  | `password_anda`                                                              | Password database yang Anda tentukan saat membuat proyek Supabase.                                                             |
| `SUPABASE_URL`                  | Opsional | `https://xxxxxx.supabase.co`                                                 | URL proyek Supabase untuk REST API dan Storage client.                                                                         |
| `SUPABASE_PUBLISHABLE_KEY`      | Opsional | `eyJhbGciOi...`                                                              | Kunci anon/publishable publik Supabase.                                                                                        |
| `SUPABASE_JWKS_URL`             | Opsional | `https://xxxxxx.supabase.co/auth/v1/.well-known/jwks.json`                   | URL verifikasi JSON Web Key Set Supabase Auth.                                                                                 |
| `AI_PROVIDER`                   | Opsional | `gemini`                                                                     | Penyedia AI: pilih `gemini` (disarankan) atau `openai`.                                                                        |
| `GEMINI_API_KEY` / `AI_API_KEY` | Opsional | `AIzaSy...`                                                                  | Secret API Key Google Gemini (Gratis di [Google AI Studio](https://aistudio.google.com/)).                                     |
| `GEMINI_MODEL` / `AI_MODEL`     | Opsional | `gemini-3.5-flash-lite`                                                      | Model Gemini yang dipilih (`gemini-3.5-flash-lite`, `gemini-1.5-flash`, atau `gemini-2.0-flash`).                              |

> [!TIP]
> **Cara Cepat Membuat AUTH_SECRET yang Aman:**
> Jalankan perintah berikut di terminal Anda untuk menghasilkan string acak 32-byte:
>
> ```bash
> openssl rand -base64 32
> ```

---

## 🗄️ Panduan Menghubungkan Database Supabase

Untuk menghubungkan database Supabase dan memigrasikan tabel:

### 1. Buat Proyek di Supabase

1. Masuk ke [Supabase Dashboard](https://supabase.com/dashboard) dan klik **New Project**.
2. Beri nama proyek (misal `webprofile-wijaya`) dan buat **Database Password** yang kuat (simpan password ini!).

### 2. Dapatkan Kredensial Koneksi

Buka menu **Project Settings ➡️ Database**:

- **Format URI (Disarankan)**: Scroll ke bagian **Connection string**, pilih tab **URI**, salin string tersebut dan tempelkan ke `DATABASE_URL` di `.env.local`:
  ```env
  DATABASE_URL="postgresql://postgres:[PASSWORD_ANDA]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
  ```
  _(Ganti `[PASSWORD_ANDA]` dengan password database Anda)._
- **Format Parameter Terpisah**: Jika Anda menyalin nilai terpisah dari dashboard Supabase:
  ```env
  host="aws-0-ap-southeast-1.pooler.supabase.com"
  port="6543"
  database="postgres"
  user="postgres.xxxxxx"
  password="password_database_anda"
  ```

### 3. Jalankan Migrasi Tabel Otomatis

Jalankan script migrasi yang telah disediakan:

```bash
node scripts/db-setup.mjs
```

_Script ini akan memverifikasi koneksi database, membuat 10 tabel sistem (`site_profile`, `projects`, `experience`, `research_items`, `comments`, dll), mengatur indeks performa, dan memasukkan data awal terverifikasi._

### 4. Buat Akun Administrator di Database

Jalankan script inisialisasi admin:

```bash
# Opsi 1: Otomatis membaca ADMIN_EMAIL, ADMIN_PASSWORD, dan ADMIN_NAME dari .env.local:
node scripts/create-admin.mjs

# Opsi 2: Atau tentukan langsung melalui argumen terminal:
node scripts/create-admin.mjs admin@wijayadarydimas.dev "PasswordSuperAman2026!" "Wijaya Dary Dimas"
```

Dokumentasi skema SQL selengkapnya dapat dibaca di [`database/README.md`](file:///c:/Users/daryd/ITSME/Programming/webprofile/database/README.md).

---

## 🤖 Panduan Menghubungkan Google Gemini AI

Asisten AI pada website ini dirancang untuk menjawab pertanyaan pengunjung seputar rekam jejak, skripsi YOLOv11, proyek, dan kontak Wijaya Dary Dimas.

1. Buka [Google AI Studio](https://aistudio.google.com/) dan login dengan akun Google.
2. Klik tombol **Get API key** lalu **Create API key**.
3. Buka file `.env.local` dan masukkan kunci Anda:
   ```env
   AI_PROVIDER="gemini"
   GEMINI_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX"
   GEMINI_MODEL="gemini-3.5-flash-lite"
   ```
4. Restart dev server (`npm run dev`).
5. Klik tombol asisten AI di pojok kanan bawah website untuk mulai berinteraksi!

> [!NOTE]
> Jika API Key belum diisi, sistem secara otomatis memberikan **Grounded Fallback Response** yang tetap informatif mengenai profil, riset skripsi di UMP, dan magang di Badan Informasi Geospasial tanpa menyebabkan error.

---

## 🚀 Panduan Deployment ke Vercel

### 1. Push Kode ke GitHub

Pastikan semua perubahan telah ter-commit ke repositori GitHub Anda:

```bash
git add .
git commit -m "feat: complete production-ready personal digital hub"
git push origin main
```

### 2. Hubungkan Proyek ke Vercel

1. Buka [Dashboard Vercel](https://vercel.com/dashboard) dan klik **Add New... ➡️ Project**.
2. Pilih repositori `webprofile` dan klik **Import**.

### 3. Masukkan Environment Variables di Vercel

Pada langkah konfigurasi proyek Vercel, buka menu **Environment Variables** dan tambahkan variabel berikut:

| Key                             | Value Contoh                           | Keterangan                    |
| :------------------------------ | :------------------------------------- | :---------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | `https://nama-project-anda.vercel.app` | URL domain Vercel Anda        |
| `AUTH_SECRET`                   | `string-acak-minimal-32-karakter`      | Kunci enkripsi sesi JWT       |
| `DATABASE_URL`                  | `postgresql://postgres:...`            | Koneksi database Supabase     |
| `ADMIN_EMAIL`                   | `admin@wijayadarydimas.dev`            | Email admin                   |
| `ADMIN_PASSWORD`                | `PasswordSuperAman2026!`               | Password admin                |
| `AI_PROVIDER`                   | `gemini`                               | Provider AI                   |
| `GEMINI_API_KEY`                | `AIzaSy...`                            | API Key dari Google AI Studio |
| `GEMINI_MODEL`                  | `gemini-3.5-flash-lite`                | Model Gemini                  |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://xxxxxx.supabase.co`           | (Opsional) Supabase REST URL  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...`                        | (Opsional) Supabase Anon Key  |

### 4. Deploy!

Klik tombol **Deploy**. Vercel akan otomatis melakukan proses _building_ dan meluncurkan website personal Anda secara publik dengan sertifikat SSL gratis, CDN global berkecepatan tinggi, dan optimasi aset otomatis.

---

## 🔐 Mengakses Admin Dashboard

1. Akses halaman `/admin/login` (atau klik **Admin Portal** di footer website).
2. Masukkan email dan password administrator Anda.
3. Fitur yang tersedia di Admin Dashboard:
   - **Profil & Hero**: Mengubah nama, tagline, headline, bio pengantar, dan mengunggah foto profil resmi.
   - **CV Resume**: Mengunggah berkas CV terbaru (PDF).
   - **Proyek & Studi Kasus**: Tambah, edit, unggah cover gambar, dan atur tautan GitHub / demo.
   - **Pengalaman Kerja & Pendidikan**: Kelola riwayat karier (BIG) dan pendidikan (UMP).
   - **Skripsi & Riset**: Pembaruan komprehensif metrik dan deskripsi modifikasi YOLOv11.
   - **Media Library**: Kelola seluruh aset gambar dan dokumen yang telah diunggah.
   - **Moderasi Komunitas**: Pantau, tampilkan, sembunyikan, atau hapus komentar pengunjung.
   - **Konfigurasi AI**: Atur model dan persona asisten virtual.

---

## 📂 Struktur Direktori Proyek

```text
webprofile/
├── .data/                      # Local Adaptive Store fallback (db.json)
├── database/
│   ├── migrations/             # Skrip SQL skema tabel PostgreSQL Supabase
│   └── README.md               # Dokumentasi arsitektur database & RLS
├── public/
│   └── uploads/                # Direktori penyimpanan berkas & media lokal
├── scripts/
│   ├── db-setup.mjs            # Runner migrasi tabel & seed database
│   └── create-admin.mjs        # Utilitas inisialisasi akun admin baru
├── src/
│   ├── app/                    # Next.js App Router (Pages, Layouts, API Routes)
│   │   ├── admin/              # Dashboard manajemen konten & login admin
│   │   ├── api/                # API Routes (auth, ai/chat, upload, comments)
│   │   ├── community/          # Halaman forum diskusi publik dua arah
│   │   ├── projects/           # Direktori & halaman detail studi kasus
│   │   ├── research/           # Halaman khusus penelitian skripsi YOLOv11
│   │   └── page.tsx            # Homepage utama (Hero 3D, About, Timeline)
│   ├── components/             # Komponen UI modular
│   │   ├── ai/                 # Modal & dialog Asisten AI
│   │   ├── community/          # Komponen threaded comments & auth modal
│   │   ├── hero/               # Canvas Three.js 3D & fallback visual
│   │   ├── layout/             # Navbar kaca (glassmorphism) & Footer
│   │   └── ui/                 # Tombol, card, badge, dan ikon SVG kustom
│   └── lib/                    # Logika bisnis inti
│       ├── ai/                 # Adapter Gemini / OpenAI & knowledge base
│       ├── auth/               # Autentikasi sesi JWT HttpOnly & hashing
│       ├── db/                 # Adapter database (PostgreSQL & Local Store)
│       └── security/           # Sanitasi input & pencegahan serangan XSS
├── .env.example                # Template lengkap environment variables
└── README.md                   # Dokumentasi resmi proyek
```

---

## 🧪 Validasi Build & Linting

Untuk memastikan kode siap produksi tanpa error:

```bash
# Type check & build produksi Next.js (Turbopack)
npm run build

# Menjalankan build produksi di mesin lokal
npm run start
```

---

## 📄 Lisensi & Hak Cipta

&copy; 2026 **Wijaya Dary Dimas**. Seluruh hak cipta dilindungi undang-undang.  
Didesain dan dikembangkan sebagai _Personal Digital Hub & Professional Engineering Showcase_.
