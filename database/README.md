# Panduan Database & Migrasi — Wijaya Dary Dimas Personal Digital Hub

Dokumen ini menjelaskan arsitektur basis data, riwayat migrasi berurutan (001–005), konfigurasi provider (PostgreSQL / Supabase / Local Adaptive Store), skema JSONB tautan platform eksternal, dan prosedur inisialisasi sistem.

---

## 1. Arsitektur Database

Website ini menggunakan basis data relasional PostgreSQL dengan dukungan penuh untuk:
- **Supabase PostgreSQL** (Direct connection port `5432` atau Transaction Pooler port `6543` via `DATABASE_URL`)
- **PostgreSQL 14+** Mandiri / Cloud (AWS RDS, Neon, Railway, Render)
- **Local Adaptive Store Fallback** (`.data/db.json`) untuk pengembangan instan tanpa konfigurasi server database

### Daftar Tabel Sistem:

| Nama Tabel | Deskripsi | Status Migrasi |
| :--- | :--- | :--- |
| `users` | Akun pengguna untuk otentikasi komunitas & peran admin (password terenkripsi bcrypt). | Migrasi 001, 002 |
| `site_profile` | Identitas pemilik, bio, avatar, kontak sosial, status, dan **`about_title`** (judul seksi tentang dinamis). | Migrasi 001, 004 |
| `projects` | Portofolio proyek, studi kasus, teknologi, cover, repo/demo, dan **`external_links`** (JSONB). | Migrasi 001, 004 |
| `experiences` | Riwayat karier & profesional (Pranata Komputer di Badan Informasi Geospasial / BIG). | Migrasi 001 |
| `educations` | Riwayat pendidikan formal (S1 Teknik Informatika Universitas Muhammadiyah Purwokerto). | Migrasi 001 |
| `research_items` | Rincian skripsi (YOLOv11 APD), metodologi, dataset, **`external_links`** (JSONB), dan **`sections`** modul dinamis (JSONB). | Migrasi 001, 004, 005 |
| `comments` | Diskusi berulir (*threaded replies*) pengunjung dengan dukungan *soft delete*. | Migrasi 001, 002 |
| `ai_chat_memories` | Riwayat sesi dan pesan interaksi dengan Asisten Virtual Google Gemini. | Migrasi 003 |
| `media_items` | Metadata berkas aset dan gambar yang diunggah melalui Media Library. | Migrasi 001 |
| `site_settings` | Konfigurasi runtime asisten AI (provider, model, status modul komunitas). | Migrasi 001 |
| `contact_messages` | Kotak masuk pesan langsung dari form kontak publik. | Migrasi 001 |

---

## 2. Riwayat Migrasi SQL (`database/migrations/`)

Seluruh skrip migrasi berada pada direktori `database/migrations/` dan dirancang bersifat *idempotent* (aman dijalankan berulang kali tanpa merusak data yang sudah ada):

### `001_initial_schema.sql`
- Membuat skema dasar: ekstensi `uuid-ossp`, enum `user_role`, dan tabel-tabel utama (`users`, `site_profile`, `projects`, `experiences`, `educations`, `research_items`, `comments`, `media_items`, `site_settings`, `contact_messages`).
- Menyediakan indeks pencarian teks dan data benih awal (*initial seed data*).

### `002_community_auth.sql`
- Mengoptimalkan otentikasi komunitas: hashing password bcrypt, kolom `email_verified`, `avatar_url`, dan status moderasi komentar `is_deleted` serta `is_flagged`.

### `003_ai_chat_memories.sql`
- Menambahkan tabel `ai_chat_memories` untuk menyimpan memori percakapan pengguna dengan asisten AI Gemini, mendukung sesi multi-turn conversation.

### `004_about_title_and_external_links.sql`
- Menambahkan kolom `about_title VARCHAR(200)` pada tabel `site_profile` agar judul seksi About (*"Profil, Prinsip Belajar & Fokus Teknis"*) dapat disesuaikan lewat admin.
- Menambahkan kolom `external_links JSONB DEFAULT '[]'::jsonb` pada tabel `projects` dan `research_items` untuk mendukung ekosistem 37 provider platform eksternal.

### `005_research_sections_and_metadata.sql`
- Menambahkan kolom metadata akademik `institution VARCHAR(255)`, `study_program VARCHAR(255)`, dan `technologies JSONB DEFAULT '[]'::jsonb` pada tabel `research_items`.
- Menambahkan kolom `sections JSONB DEFAULT '[]'::jsonb` untuk struktur modul dinamis Hybrid Research Editor (pengurutan, template, visibilitas, dan asisten AI).
- Mempertahankan backward compatibility 100% untuk kolom warisan (`background`, `objective`, `model_modification`, `methodology`, `dataset_notes`).


---

## 3. Skema JSONB: Tautan Platform Eksternal (`external_links`)

Kolom `external_links` pada tabel `projects` dan `research_items` bertipe `JSONB` yang menyimpan array objek tautan dengan struktur sebagai berikut:

```json
[
  {
    "provider": "roboflow",
    "url": "https://universe.roboflow.com/project/apd-detection",
    "label": "Roboflow Universe"
  },
  {
    "provider": "huggingface",
    "url": "https://huggingface.co/wijayadarydimas/yolov11-apd",
    "label": "Hugging Face Model"
  },
  {
    "provider": "kaggle",
    "url": "https://www.kaggle.com/datasets/...",
    "label": "Kaggle Dataset"
  }
]
```

### 37 Provider yang Didukung:
1. **Code & Repositories**: `github`, `gitlab`, `bitbucket`, `codeberg`, `sourcehut`, `gitea`, `forgejo`, `launchpad`
2. **Models & Datasets**: `huggingface`, `roboflow`, `civitai`, `kaggle`, `replicate`, `ollama`, `papers with code`, `lm studio`, `openxlab`, `modelscope`
3. **Computer Vision & Labeling**: `cvat`, `label studio`, `supervisely`, `v7 darwin`, `encord`, `scale ai`
4. **Compute & MLOps**: `modal`, `runpod`, `vast.ai`, `weights & biases`, `bentoml`, `langchain`, `llamaindex`
5. **Cloud & Deployment**: `vercel`, `supabase`, `render`, `netlify`, `railway`, `fly.io`

---

## 4. Cara Menjalankan Migrasi Database

### Opsi A: Runner Otomatis (Sangat Disarankan)

Pastikan konfigurasi `DATABASE_URL` sudah terisi di `.env.local`:
```env
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"
```

Jalankan skrip migrasi berurutan:
```bash
node scripts/db-setup.mjs
```

**Mekanisme Kerja Runner:**
1. Membaca variabel koneksi dari `DATABASE_URL` atau konfigurasi individual (`host`, `port`, `database`, `user`, `password`).
2. Melakukan tes koneksi ke server PostgreSQL.
3. Memindai seluruh berkas SQL di dalam `database/migrations/` secara berurutan (`001`, `002`, `003`, `004`).
4. Menjalankan setiap perintah SQL dengan aman (`IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`).
5. Memverifikasi seluruh tabel dan kolom baru.

### Opsi B: Supabase Dashboard SQL Editor

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) ➡️ Pilih Proyek Anda.
2. Buka menu **SQL Editor**.
3. Buka berkas SQL di `database/migrations/` (misal `004_about_title_and_external_links.sql`), salin seluruh isinya, dan tempelkan ke editor.
4. Klik tombol **Run**.

### Opsi C: PostgreSQL CLI (`psql`)

```bash
psql "postgresql://user:pass@host:5432/postgres" -f database/migrations/004_about_title_and_external_links.sql
```

---

## 5. Inisialisasi Akun Administrator

Akun administrator diperlukan untuk mengakses `/admin` dan mengelola seluruh konten website.

### Cara 1: Otomatis via `.env.local` (Paling Cepat)
Tambahkan ke file `.env.local`:
```env
ADMIN_EMAIL="wijayadarydimas@gmail.com"
ADMIN_PASSWORD="@Skidrow999110761"
ADMIN_NAME="Wijaya Dary Dimas"
```
Aplikasi secara otomatis memverifikasi kredensial ini saat login di `/admin/login`.

### Cara 2: Inisialisasi ke Database via CLI
```bash
node scripts/create-admin.mjs
```
Script akan membaca kredensial dari `.env.local`, mengenkripsi password dengan bcrypt (12 rounds salt), dan menyimpannya ke tabel `users` dengan peran `admin`.

---

## 6. Kebijakan Keamanan & RLS (Row Level Security)

- **Akses Publik (Read-Only)**: Profil situs, portofolio proyek terpublikasi, artikel riset skripsi, riwayat pengalaman, dan komentar publik dapat diakses siapa saja secara cepat melalui Server-Side Rendering (SSR).
- **Akses Komunitas**: Pengunjung terdaftar hanya berhak membuat komentar baru serta memperbarui atau menghapus komentar milik sendiri.
- **Akses Administrator**: Seluruh operasi CRUD untuk profil, proyek, provider eksternal, riset, media, dan moderasi komentar dilindungi oleh otentikasi token JWT HttpOnly dengan tanda tangan `AUTH_SECRET`.
