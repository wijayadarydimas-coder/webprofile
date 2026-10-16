# Wijaya Dary Dimas — Personal Digital Hub & Interactive Portfolio

> **"Exploring Technology. Building Ideas. Creating Impact."**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-Dark_Matter_3D-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![Database](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![AI Assistant](https://img.shields.io/badge/AI_Assistant-Google_Gemini-4285F4?style=flat-square&logo=google)](https://aistudio.google.com/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

Website personal _production-ready_ untuk **Wijaya Dary Dimas**, dirancang dengan konsep visual **Dark Matter — Interactive Portfolio** yang menggabungkan estetika antarmuka modern yang futuristik, atmosfer partikel interaktif, pencahayaan sinematik, dan pengalaman interaksi yang responsif.

Website ini berfungsi sebagai **Personal Digital Hub** interaktif yang mencakup personal branding, portofolio proyek rekayasa, studi kasus arsitektural, riwayat karier, rekam jejak akademik, dokumentasi riset skripsi, asisten AI terintegrasi dengan memori percakapan, forum diskusi komunitas dua arah, dan panel admin lengkap untuk mengelola seluruh konten secara dinamis.

---

## 📑 Daftar Isi

1. [Fitur Utama](#-fitur-utama)
2. [Ekosistem 37 Provider Platform Eksternal](#-ekosistem-37-provider-platform-eksternal)
3. [Stack Teknologi](#-stack-teknologi)
4. [Panduan Instalasi Cepat](#-panduan-instalasi-cepat)
5. [Penjelasan Lengkap Environment Variables (.env)](#-penjelasan-lengkap-environment-variables-env)
6. [Panduan Menghubungkan Database Supabase & Migrasi](#-panduan-menghubungkan-database-supabase--migrasi)
7. [Panduan Menghubungkan Google Gemini AI](#-panduan-menghubungkan-google-gemini-ai)
8. [Panduan Deployment ke Vercel](#-panduan-deployment-ke-vercel)
9. [Mengakses Admin Dashboard](#-mengakses-admin-dashboard)
10. [Struktur Direktori Proyek](#-struktur-direktori-proyek)
11. [Lisensi](#-lisensi--hak-cipta)

---

## ✨ Fitur Utama

### 1. Desain Visual Dark Matter & Hero 3D Sinematik

- **Three.js Interactive Abstract Geometry**: Geometri 3D dinamis dengan respons kursor halus (_pointer-reactive damping_), pencahayaan _point-light_ bergradasi, dan fallback visual otomatis untuk mode hemat daya atau preferensi `prefers-reduced-motion`.
- **Lusion Particle Atmosphere**: Lapisan partikel debu kosmis yang melayang lembut menciptakan kedalaman visual (_visual depth_) yang imersif.
- **Glassmorphism & Micro-Interactions**: Navigasi kaca tembus pandang dengan aksen neon indigo/violet yang halus.

### 2. Seksi Tentang Dinamis (About Section)

- **Judul Seksi Dapat Diedit**: Judul utama seksi About (_"Profil, Prinsip Belajar & Fokus Teknis"_) dapat dikustomisasi langsung melalui Admin Profile (`/admin/profile`).
- **Data Riil Terintegrasi**: Menampilkan ringkasan data Pendidikan, Pengalaman, dan Penelitian secara langsung dari database tanpa data statis hardcoded.
- **Tampilan Bersih**: Kartu ringkasan About difokuskan sebagai narasi profil esensial tanpa tautan berulang.

### 3. Ekosistem Multi-Provider Proyek & Riset (37 Platform)

- Terhubung langsung dengan repositori kode, platform model AI, dataset anotasi, compute MLOps, dan live cloud deployment melalui tombol **`+ Tambah Provider`** di panel admin.
- Komponen badge responsif (`ProviderBadge`) yang menampilkan ikon, warna khas platform, indikator status, serta custom label di kartu proyek, halaman detail studi kasus, dan penampil riset skripsi.

### 4. Portofolio Proyek & Studi Kasus Mendalam (`/projects`)

- Direktori proyek dengan filter kategori (_Computer Vision_,_Full-Stack_, _System Architecture_) dan pencarian real-time.
- Halaman detail studi kasus (`/projects/[slug]`) dengan struktur arsitektur: Masalah (_Problem_), Solusi (_Solution_), dan Hasil Evaluasi (_Results_).
- Kompresi gambar otomatis ke format WebP saat mengunggah cover proyek.

### 5. Dokumentasi Riset & Hybrid Research Editor (`/research` & `/admin/research`)

- **Technical Documentation Layout**: Desain dokumentasi teknis dua kolom dengan Table of Contents (TOC) sticky desktop, pelacak scroll aktif (_scrollspy_), dan dropdown navigasi mobile.
- **Executive Header**: Menampilkan kategori publikasi, institusi, program studi, ringkasan eksekutif, tag teknologi/model, repositori GitHub, dokumen PDF, dan badge ekosistem provider.
- **Hybrid Research Editor**: Panel admin riset yang memadukan field metadata terstruktur dengan pengelola modul fleksibel (tambah, hapus dengan konfirmasi, duplikasi, sembunyikan, dan susun urutan modul).
- **Template Penulisan Riset**: Template kerangka profesional siap pakai untuk Latar Belakang Masalah, Tujuan & Sasaran, Metodologi Eksperimen, Modifikasi Arsitektur Model, Dataset & Anotasi, Hasil & Metrik Evaluasi, Integrasi Alarm Otomatis, dan Referensi Ilmiah.
- **Asisten Penulisan AI**: Terintegrasi dengan endpoint server-side `/api/ai/research-assistant` (Google Gemini) yang mendukung 8 aksi penulisan akademik dengan modal pembanding draf (*side-by-side comparison*) sebelum diterapkan.
- **Live Markdown Renderer & Device Preview**: Toolbar Markdown cepat (bold, italic, heading, code block, tabel, callout alert) dengan pratinjau langsung desktop & mobile.
- **Kompatibilitas Penuh**: Migrasi non-destruktif (005) pada Supabase PostgreSQL yang mempertahankan seluruh data kolom warisan.

### 6. Asisten AI Terintegrasi dengan Memori Percakapan (`/api/ai/chat`)

- Ditenagai oleh model **Google Gemini** (misal `gemini-2.0-flash`, `gemini-1.5-flash`, atau `gemini-3.5-flash-lite`).
- **Persistent Chat Memories**: Sesi percakapan disimpan ke tabel database `ai_chat_memories` untuk interaksi multi-turn yang kontekstual.
- **Grounded Knowledge Base**: Jawaban AI berpedoman pada basis data resmi pemilik website.
- **Grounded Fallback Mode**: Tetap merespons dengan cerdas meski API Key belum dipasang.

### 7. Forum Diskusi Komunitas Dua Arah (`/community`)

- Sistem diskusi berulir bertingkat (_threaded nested replies_).
- Autentikasi mandiri pengunjung dengan enkripsi bcrypt dan sesi JWT HttpOnly.
- Fitur _soft delete_ untuk menjaga keutuhan struktur hierarki pohon percakapan.

### 8. Panel Admin Terpadu (`/admin`)

- Pengelolaan Profil, Tagline, dan Judul Seksi Tentang.
- CRUD Proyek dengan Editor Provider Eksternal interaktif.
- CRUD Riset / Skripsi dengan Editor Provider Eksternal.
- Pengelolaan Pengalaman Kerja & Riwayat Pendidikan.
- Media Library dengan upload berkas aman (JPEG, PNG, WebP, SVG, PDF).
- Moderasi Diskusi Komunitas dan Konfigurasi AI Persona.

---

## 🌐 Ekosistem 37 Provider Platform Eksternal

Admin dan tampilan website mendukung integrasi langsung ke 37 platform eksternal berikut:

| Kategori                       | Platform / Provider yang Didukung                                                                             |
| :----------------------------- | :------------------------------------------------------------------------------------------------------------ |
| **Code & Repositories**        | GitHub, GitLab, Bitbucket, Codeberg, SourceHut, Gitea, Forgejo, Launchpad                                     |
| **Models & Datasets**          | Hugging Face, Roboflow, Civitai, Kaggle, Replicate, Ollama, Papers with Code, LM Studio, OpenXLab, ModelScope |
| **Computer Vision & Labeling** | CVAT, Label Studio, Supervisely, V7 Darwin, Encord, Scale AI                                                  |
| **Compute & MLOps**            | Modal, RunPod, Vast.ai, Weights & Biases, BentoML, LangChain, LlamaIndex                                      |
| **Cloud & Deployment**         | Vercel, Supabase, Render, Netlify, Railway, Fly.io                                                            |

---

## 🛠️ Stack Teknologi

| Kategori               | Teknologi             | Keterangan                                                  |
| :--------------------- | :-------------------- | :---------------------------------------------------------- |
| **Framework**          | Next.js 16.4+         | App Router, Server Components, Turbopack                    |
| **Bahasa Pemrograman** | TypeScript 5.x        | Strict Mode, Type Safety penuh                              |
| **Styling & Desain**   | Tailwind CSS v4       | Dark Matter Design System, HSL Tokens, Glassmorphism        |
| **Grafika 3D & Efek**  | Three.js              | Geometri 3D interaktif, particle system, low-power fallback |
| **Basis Data**         | PostgreSQL / Supabase | Relational Database, JSONB, Local Fallback Store            |
| **Keamanan & Sesi**    | Jose & Bcryptjs       | JWT HttpOnly Cookies, 12 rounds bcrypt salt                 |
| **Validasi Skema**     | Zod                   | Runtime type validation untuk API & form                    |
| **Asisten AI**         | Google Gemini API     | `gemini-2.0-flash` / `gemini-1.5-flash` dengan grounding    |
| **Ikon Antarmuka**     | Lucide React          | Ikon modern dan konsisten                                   |

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
> Aplikasi siap digunakan seketika! Jika database belum dikonfigurasi, sistem otomatis menggunakan **Local Adaptive Store** (`.data/db.json`).

---

## 🔑 Penjelasan Lengkap Environment Variables (.env)

| Nama Variabel                                  |  Wajib?  | Contoh Isi                                                    | Penjelasan & Fungsi                                                            |
| :--------------------------------------------- | :------: | :------------------------------------------------------------ | :----------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                         |  **Ya**  | `http://localhost:3000`<br>`https://webprofile-mu.vercel.app` | URL publik situs untuk canonical URL, Open Graph preview, dan sitemap XML.     |
| `AUTH_SECRET`                                  |  **Ya**  | `string-acak-minimal-32-karakter`                             | Kunci enkripsi untuk menandatangani JWT session cookie HttpOnly.               |
| `ADMIN_EMAIL`                                  | Opsional | `wijayadarydimas@gmail.com`                                   | Email login administrator awal untuk `/admin/login`.                           |
| `ADMIN_PASSWORD`                               | Opsional | `@Skidrow999110761`                                           | Password administrator awal.                                                   |
| `DATABASE_URL`                                 |  Opsi A  | `postgresql://postgres.[ref]:[pass]@[host]:6543/postgres`     | URI PostgreSQL Supabase (Direct atau Transaction Pooler).                      |
| `host`, `port`, `database`, `user`, `password` |  Opsi B  | Parameter terpisah dari dashboard Supabase                    | Digunakan otomatis oleh script setup jika format URI tidak digunakan.          |
| `AI_PROVIDER`                                  | Opsional | `gemini`                                                      | Penyedia AI (`gemini` disarankan).                                             |
| `GEMINI_API_KEY`                               | Opsional | `AIzaSy...`                                                   | Kunci API Google Gemini dari [Google AI Studio](https://aistudio.google.com/). |
| `GEMINI_MODEL`                                 | Opsional | `gemini-1.5-flash` / `gemini-2.0-flash`                       | Model Gemini yang digunakan.                                                   |

---

## 🗄️ Panduan Menghubungkan Database Supabase & Migrasi

### 1. Buat Proyek di Supabase

1. Masuk ke [Supabase Dashboard](https://supabase.com/dashboard) dan klik **New Project**.
2. Simpan Database Password yang Anda tentukan.

### 2. Pasang `DATABASE_URL` di `.env.local`

Buka **Project Settings ➡️ Database ➡️ Connection string ➡️ Tab URI**:

```env
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"
```

### 3. Eksekusi Seluruh Migrasi Otomatis

Jalankan satu perintah berikut di terminal:

```bash
node scripts/db-setup.mjs
```

Script ini akan secara berurutan mengeksekusi semua migrasi di folder `database/migrations/`:

- `001_initial_schema.sql` — Skema tabel dasar & data awal.
- `002_community_auth.sql` — Autentikasi komunitas & moderasi komentar.
- `003_ai_chat_memories.sql` — Tabel riwayat percakapan asisten AI.
- `004_about_title_and_external_links.sql` — Judul dinamis About & kolom JSONB 37 provider.

### 4. Inisialisasi Akun Admin

```bash
node scripts/create-admin.mjs
```

---

## 🤖 Panduan Menghubungkan Google Gemini AI

1. Buka [Google AI Studio](https://aistudio.google.com/) dan buat API Key.
2. Tambahkan ke file `.env.local`:
   ```env
   AI_PROVIDER="gemini"
   GEMINI_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX"
   GEMINI_MODEL="gemini-1.5-flash"
   ```
3. Restart server dev (`npm run dev`).
4. Klik tombol Asisten AI di pojok kanan bawah website untuk mulai berinteraksi.

---

## 🚀 Panduan Deployment ke Vercel

1. Commit dan push seluruh kode ke repositori GitHub:
   ```bash
   git add .
   git commit -m "feat: complete dark matter interactive portfolio"
   git push origin main
   ```
2. Buka [Dashboard Vercel](https://vercel.com/dashboard) ➡️ **Add New Project** ➡️ Import repositori `webprofile`.
3. Masukkan Environment Variables (`NEXT_PUBLIC_SITE_URL`, `AUTH_SECRET`, `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `GEMINI_API_KEY`).
4. Klik **Deploy**.

---

## 🔐 Mengakses Admin Dashboard

1. Kunjungi `/admin/login` (atau klik **Admin Portal** di footer website).
2. Masukkan email dan password admin Anda.
3. Modul yang tersedia:
   - **Profil & Identitas**: Mengubah nama, headline, bio, dan **Judul Seksi Tentang**.
   - **Proyek & Portofolio**: Tambah/edit studi kasus dan pasang tautan ke 37 provider (Roboflow, Hugging Face, Kaggle, dll.).
   - **Riset & Skripsi**: Kelola dokumentasi penelitian APD YOLOv11 dan tautan model/dataset eksternal.
   - **Pengalaman & Pendidikan**: Kelola riwayat kerja (BIG) dan pendidikan formal (UMP).
   - **Media Library**: Upload dan kelola berkas aset (dengan kompresi WebP otomatis).
   - **Moderasi Komunitas**: Kelola komentar pengunjung forum.
   - **Konfigurasi AI**: Atur model dan kepribadian asisten virtual.

---

## 📂 Struktur Direktori Proyek

```text
webprofile/
├── .data/                                  # Local Adaptive Store fallback (db.json)
├── database/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql          # Skema dasar dan tabel utama
│   │   ├── 002_community_auth.sql          # Fitur otentikasi komunitas
│   │   ├── 003_ai_chat_memories.sql        # Memori obrolan asisten AI
│   │   └── 004_about_title_and_external_links.sql # Judul about & JSONB 37 provider
│   └── README.md                           # Dokumentasi mendalam arsitektur database & RLS
├── public/
│   ├── images/                             # Gambar visual dan diagram arsitektur
│   └── uploads/                            # Berkas media yang diunggah dari admin
├── scripts/
│   ├── db-setup.mjs                        # Runner migrasi SQL berurutan otomatis
│   └── create-admin.mjs                    # Generator akun administrator di database
├── src/
│   ├── app/
│   │   ├── admin/                          # Dashboard CMS & autentikasi admin
│   │   │   ├── profile/                    # Edit profil & judul seksi about
│   │   │   ├── projects/                   # Manajemen proyek & picker provider eksternal
│   │   │   └── research/                   # Manajemen riset & picker provider eksternal
│   │   ├── api/                            # API endpoints (admin, ai, auth, comments, upload)
│   │   ├── community/                      # Forum diskusi interaktif komunitas
│   │   ├── projects/                       # Portofolio proyek & detail [slug]
│   │   ├── research/                       # Halaman riset skripsi YOLOv11
│   │   └── page.tsx                        # Beranda Dark Matter (Hero, About, Timeline)
│   ├── components/
│   │   ├── admin/
│   │   │   └── ExternalLinksEditor.tsx     # Komponen pemilih 37 platform eksternal
│   │   ├── hero/
│   │   │   ├── AbstractGeometry.tsx        # Geometri 3D Three.js interaktif
│   │   │   └── LusionParticleAtmosphere.tsx # Partikel atmosfer kosmis ambient
│   │   ├── home/
│   │   │   └── AboutSection.tsx            # Seksi About dinamis tanpa tautan berulang
│   │   ├── projects/
│   │   │   └── ProjectCard.tsx             # Kartu proyek dengan badge provider eksternal
│   │   └── ui/
│   │       └── ProviderBadge.tsx           # Badge styling platform eksternal
│   ├── lib/
│   │   ├── constants/
│   │   │   └── providers.ts                # Kamus 37 platform eksternal & metadata
│   │   ├── db/                             # Lapisan database (Postgres & Local Store)
│   │   └── validation/
│   │       └── schemas.ts                  # Skema validasi Zod
│   └── types/                              # Definisi tipe data TypeScript
├── .env.example                            # Template variabel lingkungan
└── README.md                               # Dokumentasi utama proyek
```

---

## 🧪 Validasi Build Produksi

Untuk memastikan kode siap produksi tanpa peringatan atau kesalahan kompilasi:

```bash
# Validasi TypeScript dan Build Produksi Turbopack
npm run build

# Menjalankan server hasil build
npm run start
```

---

## 📄 Lisensi & Hak Cipta

&copy; 2026 **Wijaya Dary Dimas**. Seluruh hak cipta dilindungi undang-undang.  
Didesain dan dikembangkan sebagai _Personal Digital Hub & Interactive Portfolio_.
