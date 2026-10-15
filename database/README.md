# Panduan Database & Migrasi — Wijaya Dary Dimas Personal Hub

Dokumen ini menjelaskan struktur basis data, konfigurasi provider (PostgreSQL langsung, PostgREST, atau Supabase), serta prosedur inisialisasi awal.

---

## 1. Arsitektur Database

Website ini menggunakan skema relasional yang kompatibel dengan:
- **PostgreSQL 14+** (Koneksi langsung via `DATABASE_URL`)
- **Supabase** (PostgreSQL + PostgREST + Auth + Storage via `NEXT_PUBLIC_SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY`)
- **Standalone PostgREST** (REST API layer di atas PostgreSQL)
- **Local Fallback Mode** (Berjalan otomatis tanpa database eksternal untuk development instan)

### Tabel Utama:
1. `users` — Data akun untuk autentikasi komunitas & admin (password di-hash dengan bcrypt).
2. `site_profile` — Konfigurasi profil pemilik (nama, bio, foto profil, link sosial, status).
3. `projects` — Daftar portofolio proyek, studi kasus, repository, dan demo.
4. `experiences` — Riwayat pengalaman kerja, magang (misal di Badan Informasi Geospasial), dan organisasi.
5. `educations` — Riwayat pendidikan (Universitas Muhammadiyah Purwokerto).
6. `research_items` — Informasi skripsi & penelitian (modifikasi YOLOv11 deteksi APD).
7. `comments` — Sistem komentar dan balasan dua arah berulir (threaded replies) dengan dukungan soft delete.
8. `media_items` — Metadata file media dan aset yang diunggah.
9. `site_settings` — Konfigurasi runtime AI assistant dan fitur website.
10. `contact_messages` — Kotak masuk pesan dari form kontak.

---

## 2. Cara Menjalankan Migrasi

### Opsi A: Menggunakan Script Otomatis `scripts/db-setup.mjs`
Pastikan variabel `DATABASE_URL` telah diatur di file `.env.local`:
```bash
# Contoh isi .env.local
DATABASE_URL="postgres://postgres:password@localhost:5432/webprofile"
```
Jalankan script setup:
```bash
node scripts/db-setup.mjs
```

Script ini akan:
1. Memvalidasi konektivitas ke server PostgreSQL.
2. Mengeksekusi file `database/migrations/001_initial_schema.sql`.
3. Memastikan semua tabel, indeks, dan data awal terbuat.
4. Tidak menjalankan operasi destruktif (`DROP DATABASE` dihindari).

### Opsi B: Menggunakan Supabase Dashboard (SQL Editor)
1. Buka dashboard proyek Supabase Anda: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Buka menu **SQL Editor**.
3. Buka file `database/migrations/001_initial_schema.sql`, salin seluruh isinya, dan tempelkan ke SQL Editor.
4. Klik **Run**.

### Opsi C: Menggunakan PostgreSQL CLI (`psql`)
```bash
psql -h localhost -U postgres -d webprofile -f database/migrations/001_initial_schema.sql
```

---

## 3. Inisialisasi Akun Admin Pertama Kali

Untuk masuk ke dashboard `/admin`, Anda dapat membuat akun admin melalui salah satu cara berikut:

### Melalui Environment Variable (Paling Mudah)
Tambahkan ke `.env.local`:
```env
ADMIN_EMAIL="admin@wijayadarydimas.dev"
ADMIN_PASSWORD="GantiDenganPasswordKuat2026!"
```
Website akan secara otomatis mengenali kredensial ini dan mengizinkan Anda masuk ke `/admin/login`.

### Melalui Script CLI
```bash
node scripts/create-admin.mjs admin@wijayadarydimas.dev "PasswordSuperAman123!" "Wijaya Dary Dimas"
```

---

## 4. Keamanan & Row Level Security (RLS)
- Semua data publik (profil, proyek terpublikasi, artikel penelitian) dapat dibaca publik.
- Operasi tulis ke proyek, pengalaman, profil, dan moderasi komentar dilindungi oleh otorisasi role `admin`.
- Pengunjung yang mendaftar hanya memiliki hak untuk membuat komentar serta mengedit atau menghapus komentar milik mereka sendiri.
