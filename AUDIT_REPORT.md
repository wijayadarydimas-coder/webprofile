# LAPORAN AUDIT ARSITEKTUR & KEAMANAN SISTEM (READ-ONLY)

> **Status Audit:** SELESAI (READ-ONLY).  
> **Tanggal Audit:** 2026-10-24  
> **Kondisi Repository:** Bersih (`working tree clean`). Tidak ada file, konfigurasi production, atau data database yang diubah, dibuat, dihapus, atau dimigrasi.

---

## 1. Ringkasan Arsitektur

### 1.1 Technology Stack & Cara Menjalankan

- **Framework & Runtime:** Next.js `16.4.1` (App Router, Turbopack), React `19.3.0`, TypeScript `5`, Node.js runtime.
- **Styling:** Tailwind CSS `v4` (`@tailwindcss/turbopack`), vanilla CSS kustom di `src/app/globals.css`.
- **Grafis & Interaktivitas:** Three.js `0.186.1` untuk particle canvas dan 3D geometry di hero section, Lucide React `1.57.0`.
- **Validasi Data:** Zod `4.6.7`.
- **Database & Penyimpanan:**
  - _Primary Database:_ PostgreSQL (`pg` `8.23.1`) terhubung ke Supabase Connection Pooler (`port 6543`).
  - _Secondary Client:_ `@supabase/supabase-js` `2.117.3` (digunakan pada Storage adapter).
  - _Local Fallback:_ LocalStore file-based JSON di `.data/db.json`.
  - _Media Storage:_ Supabase Storage bucket (`media`) dengan fallback lokal `public/uploads/` dan data URI base64.
- **Autentikasi & Kriptografi:** `jose` `6.2.12` (JWT session), `bcryptjs` `3.0.3` (password hashing).
- **Perintah Operasional:**
  - Dev server: `npm run dev` (berjalan di port `3000` via Turbopack).
  - Production build: `npm run build` dilanjutkan `npm run start`.
  - Typecheck/Linter: `npm run lint`.
  - Migrasi database manual: `node scripts/db-setup.mjs`.
  - Inisialisasi admin manual: `node scripts/create-admin.mjs <email> <password> [name]`.

### 1.2 Struktur Direktori & Entry Points

- **Root Config:** `package.json`, `next.config.ts`, `tsconfig.json`.
- **Entry Points:**
  - Root Layout: `src/app/layout.tsx`.
  - Public Home: `src/app/page.tsx`.
  - Admin Root: `src/app/admin/layout.tsx` & `src/app/admin/page.tsx`.
- **Database & Migrasi:** `database/migrations/` (7 file SQL: `001` s.d. `007`).
- **Script CLI:** `scripts/db-setup.mjs`, `scripts/create-admin.mjs`.

### 1.3 Arsitektur Autentikasi, API, DB Adapter, & Fallback

- **Autentikasi:** Menggunakan token JWT mandiri (`wdd_session_token`) yang disimpan di HttpOnly Cookie (`SameSite: lax`, `Max-Age: 7 hari`). Sistem **tidak menggunakan Supabase Auth** (`auth.users`), melainkan tabel kustom `public.users`.
- **Proteksi Admin:** Dilakukan di `src/app/admin/layout.tsx` (merender form login jika role bukan admin) dan di dalam handler `src/app/api/admin/content/route.ts`. **Tidak ada `middleware.ts`** di tingkat root/src.
- **Repository Pattern:** `src/lib/db/index.ts` mengevaluasi env `DATABASE_URL` / `POSTGRES_URL` / `host`. Jika tersedia, menginstansiasi `PostgresRepository` (`src/lib/db/postgres.ts`). Jika gagal atau kosong, otomatis fallback ke `LocalStoreRepository` (`src/lib/db/store.ts`).
- **Kontrak Data:** Didefinisikan di `src/types/index.ts` dan divalidasi via Zod di `src/lib/validation/schemas.ts`.

---

## 2. Daftar Route Publik dan Admin Panel

### 2.1 Route Publik

| Route              | Tipe           | Komponen / File                    | Deskripsi                                                                                   |
| ------------------ | -------------- | ---------------------------------- | ------------------------------------------------------------------------------------------- |
| `/`                | SSR / Dynamic  | `src/app/page.tsx`                 | Landing page utama (Hero 3D, About, Featured Projects, Timeline, Research, Diskusi, Kontak) |
| `/projects`        | SSR            | `src/app/projects/page.tsx`        | Katalog lengkap proyek dengan filter kategori                                               |
| `/projects/[slug]` | SSR / Dynamic  | `src/app/projects/[slug]/page.tsx` | Halaman detail proyek, studi kasus K3, dan tautan eksternal                                 |
| `/research`        | SSR            | `src/app/research/page.tsx`        | Halaman riset skripsi YOLOv11 & pembaca dokumen akademik                                    |
| `/community`       | SSR / Dynamic  | `src/app/community/page.tsx`       | Forum diskusi dua arah berulir (threaded comments)                                          |
| `/contact`         | SSR            | `src/app/contact/page.tsx`         | Formulir kontak langsung ke database inbox                                                  |
| `/robots.txt`      | Metadata Route | `src/app/robots.ts`                | Aturan crawling mesin pencari                                                               |
| `/sitemap.xml`     | Metadata Route | `src/app/sitemap.ts`               | Peta situs XML dinamis                                                                      |

### 2.2 Route Admin Panel

| Route               | Guard           | File                                | Deskripsi                                                         |
| ------------------- | --------------- | ----------------------------------- | ----------------------------------------------------------------- |
| `/admin`            | Server Layout   | `src/app/admin/page.tsx`            | Dashboard metrik utama, ringkasan inbox, dan status sistem        |
| `/admin/login`      | Server Redirect | `src/app/admin/login/page.tsx`      | Halaman login admin                                               |
| `/admin/profile`    | Server Layout   | `src/app/admin/profile/page.tsx`    | Pengaturan profil, branding, bio, avatar, CV, dan kartu sorotan   |
| `/admin/projects`   | Server Layout   | `src/app/admin/projects/page.tsx`   | Manajemen CRUD portofolio proyek dan badge eksternal              |
| `/admin/experience` | Server Layout   | `src/app/admin/experience/page.tsx` | Manajemen riwayat kerja/magang BIG dan pendidikan UMP             |
| `/admin/research`   | Server Layout   | `src/app/admin/research/page.tsx`   | Hybrid Research Editor (metadata & bagian dokumen skripsi)        |
| `/admin/comments`   | Server Layout   | `src/app/admin/comments/page.tsx`   | Moderasi diskusi komunitas (sembunyikan/hapus/balas)              |
| `/admin/media`      | Server Layout   | `src/app/admin/media/page.tsx`      | Media library, unggah berkas, dan konversi WebP                   |
| `/admin/settings`   | Server Layout   | `src/app/admin/settings/page.tsx`   | Konfigurasi AI Persona, model Gemini/OpenAI, dan email notifikasi |

### 2.3 Route API Backend

| Endpoint                     | Method                           | File                                         | Akses                                                       |
| ---------------------------- | -------------------------------- | -------------------------------------------- | ----------------------------------------------------------- |
| `/api/auth/login`            | `POST`                           | `src/app/api/auth/login/route.ts`            | Publik (Rate limited)                                       |
| `/api/auth/register`         | `POST`                           | `src/app/api/auth/register/route.ts`         | Publik (Rate limited, role visitor)                         |
| `/api/auth/logout`           | `POST`                           | `src/app/api/auth/logout/route.ts`           | Publik                                                      |
| `/api/auth/me`               | `GET`                            | `src/app/api/auth/me/route.ts`               | Publik (Membaca sesi cookie)                                |
| `/api/admin/content`         | `GET`, `POST`                    | `src/app/api/admin/content/route.ts`         | Admin Only (`role === 'admin'`)                             |
| `/api/comments`              | `GET`, `POST`, `PATCH`, `DELETE` | `src/app/api/comments/route.ts`              | GET: Publik; POST: Authenticated; PATCH/DELETE: Owner/Admin |
| `/api/contact`               | `POST`                           | `src/app/api/contact/route.ts`               | Publik (Rate limited + honeypot)                            |
| `/api/upload`                | `POST`                           | `src/app/api/upload/route.ts`                | Admin Only                                                  |
| `/api/profile/cv`            | `GET`                            | `src/app/api/profile/cv/route.ts`            | Publik (Binary PDF streamer/redirect)                       |
| `/api/research/[id]/pdf`     | `GET`                            | `src/app/api/research/[id]/pdf/route.ts`     | Publik (Binary PDF streamer/redirect)                       |
| `/api/ai` & `/api/ai/chat`   | `POST`                           | `src/app/api/ai/chat/route.ts`               | Publik (Rate limited, auto-save memory jika login)          |
| `/api/ai/history`            | `GET`, `DELETE`                  | `src/app/api/ai/history/route.ts`            | Authenticated User                                          |
| `/api/ai/research-assistant` | `POST`                           | `src/app/api/ai/research-assistant/route.ts` | Admin Only                                                  |
| `/api/site-info`             | `GET`                            | `src/app/api/site-info/route.ts`             | Publik                                                      |

---

## 3. Temuan Keamanan Berbasis Kode & Metadata

| ID         | Bukti File & Baris                                                                                                                                                                                                                                                               | Dampak                                                                                                                                                                                                                                                                                                                            | Risiko       | Status        | Rekomendasi                                                                                                                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SEC-01** | `src/lib/auth/session.ts` (baris 6-8):<br>`const DEFAULT_SECRET = "wdd-secret-key-change-in-production-2026-secure-token";`<br>`const SECRET_KEY = new TextEncoder().encode(process.env.AUTH_SECRET \|\| DEFAULT_SECRET);`                                                       | Jika `AUTH_SECRET` tidak disetel di environment, siapa pun dapat membuat JWT palsu dengan payload `{ role: "admin" }` menggunakan fallback secret yang terekspos di source code, membobol seluruh Admin Panel.                                                                                                                    | **CRITICAL** | **CONFIRMED** | Hapus fallback default string. Tambahkan validasi eksplisit saat boot: lempar exception jika `process.env.AUTH_SECRET` tidak ada atau kurang dari 32 karakter.                                    |
| **SEC-02** | `database/migrations/001_initial_schema.sql` (baris 14-22, 180-201):<br>Metadata Live DB:<br>`users: rowsecurity = false`<br>`contact_messages: rowsecurity = false`<br>`grantee 'anon': SELECT, INSERT, UPDATE, DELETE`                                                         | Tabel `users` dan `contact_messages` **tidak mengaktifkan RLS**, dan role Supabase `anon` memiliki grant CRUD penuh. Siapa pun dengan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dapat langsung mengakses PostgREST endpoint (`/rest/v1/users`) untuk mengunduh seluruh hash password admin & pengunjung, atau membaca pesan kontak rahasia. | **CRITICAL** | **CONFIRMED** | Aktifkan RLS pada tabel `users` dan `contact_messages`. Cabut seluruh hak akses `anon` dan `authenticated` melalui PostgREST (`REVOKE ALL ON users, contact_messages FROM anon, authenticated;`). |
| **SEC-03** | `src/app/api/profile/cv/route.ts` (baris 47-53)<br>`src/app/api/research/[id]/pdf/route.ts` (baris 50-56):<br>`const cleanPath = cvUrl.replace(/^\/+/, "");`<br>`const filePath = path.join(process.cwd(), "public", cleanPath);`<br>`fs.readFileSync(filePath)`                 | **Path Traversal / Arbitrary File Read**. Fungsi `replace(/^\/+/, "")` tidak membersihkan `../`. Jika URL di database diarahkan ke `../../.env.local` atau file sistem lain, endpoint akan membaca dan menyajikan file rahasia server ke publik.                                                                                  | **HIGH**     | **CONFIRMED** | Validasi path hasil `path.resolve`: pastikan diawali dengan path absolut direktori yang diizinkan (`process.cwd()/public/uploads/` atau `/files/`). Tolak string yang mengandung `..`.            |
| **SEC-04** | `src/app/api/auth/login/route.ts` (baris 37-43):<br>`const envAdminEmail = process.env.ADMIN_EMAIL \|\| "admin@wijayadarydimas.dev";`<br>`const envAdminPassword = process.env.ADMIN_PASSWORD \|\| "AdminWDD2026!";`<br>`const isPasswordMatch = password === envAdminPassword;` | Kredensial fallback admin hardcoded. Jika admin belum mengisi `.env.local`, akun admin dapat ditembus dengan password default. Komparasi string `===` juga rentan timing attack.                                                                                                                                                  | **HIGH**     | **CONFIRMED** | Hapus kredensial default fallback. Wajibkan autentikasi admin murni melalui database hash atau validasi environment ketat dengan `crypto.timingSafeEqual`.                                        |
| **SEC-05** | `database/migrations/001_initial_schema.sql` (baris 229-231):<br>Metadata Live DB:<br>`comments with_check: ((auth.uid() IS NOT NULL) OR true)`                                                                                                                                  | Policy RLS untuk `INSERT` pada tabel `comments` mengandung `OR true`, sehingga pengguna anonim tanpa login dapat menyisipkan komentar langsung via Supabase REST API dengan anon key.                                                                                                                                             | **MEDIUM**   | **CONFIRMED** | Perbaiki policy di PostgreSQL menjadi `WITH CHECK (auth.uid() IS NOT NULL)` atau cabut direct grant `INSERT` dari `anon`.                                                                         |
| **SEC-06** | `src/lib/db/postgres.ts` (baris 58-60)<br>`scripts/db-setup.mjs` (baris 59-61):<br>`ssl: ... ? false : { rejectUnauthorized: false }`                                                                                                                                            | Menonaktifkan verifikasi sertifikat TLS pada koneksi PostgreSQL pooler membuka celah Man-in-the-Middle (MITM) pada lalu lintas jaringan antara backend dan database Supabase.                                                                                                                                                     | **MEDIUM**   | **CONFIRMED** | Aktifkan validasi sertifikat CA Supabase secara ketat (`rejectUnauthorized: true`) dengan menyematkan root CA certificate jika diperlukan.                                                        |
| **SEC-07** | `src/lib/security/ratelimit.ts` (baris 5-17):<br>`const store = new Map<string, RateLimitRecord>();`                                                                                                                                                                             | Rate limiting berbasis memory `Map` di dalam serverless Next.js (Vercel) bersifat efemeral dan terisolasi per container instance. Penyerang dapat melakukan brute-force password / spamming karena memory tidak terdistribusi antar request.                                                                                      | **MEDIUM**   | **CONFIRMED** | Migrasikan rate limiting ke penyimpanan terdistribusi (Upstash Redis atau tabel database dengan TTL) untuk deployment serverless production.                                                      |
| **SEC-08** | `src/lib/storage/storage.ts` (baris 27-44)<br>`src/lib/security/sanitize.ts` (baris 33-42):                                                                                                                                                                                      | Sanitasi file SVG hanya memeriksa tag `<script>` dan `javascript:`. Event handler SVG lain seperti `<svg onload=...>`, `<animate onbegin=...>` lolos sanitasi, memicu Stored XSS jika SVG diakses langsung di browser. Deteksi tipe file juga hanya bergantung pada header `file.type` tanpa memeriksa magic bytes.               | **MEDIUM**   | **CONFIRMED** | Gunakan DOMPurify untuk membersihkan payload SVG sebelum disimpan, validasi magic bytes berkas biner, dan sajikan upload media dengan header `Content-Security-Policy: default-src 'none'`.       |
| **SEC-09** | `next.config.ts` (baris 1-16):                                                                                                                                                                                                                                                   | Tidak ada HTTP Security Headers yang dikonfigurasi (`Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Strict-Transport-Security`). Rentan terhadap Clickjacking dan MIME confusion.                                                                                      | **LOW**      | **CONFIRMED** | Tambahkan konfigurasi `headers()` di `next.config.ts` untuk menginjeksikan header keamanan standar industri.                                                                                      |
| **SEC-10** | `src/lib/storage/storage.ts` (baris 87-99)<br>`src/lib/db/store.ts` (baris 230-264):                                                                                                                                                                                             | Penggunaan operasi tulis filesystem lokal (`fs.writeFileSync`) pada direktori `public/uploads` dan `.data/db.json` akan gagal atau datanya hilang saat dijalankan di lingkungan serverless read-only seperti Vercel.                                                                                                              | **MEDIUM**   | **CONFIRMED** | Pastikan produksi selalu menggunakan Supabase Storage dan PostgreSQL; berikan peringatan konfigurasi eksplisit jika storage eksternal belum terpasang.                                            |

---

## 4. Status RLS (Row Level Security) & Metadata Database

Status diverifikasi langsung secara **READ-ONLY** terhadap PostgreSQL Supabase yang aktif via system catalog `pg_tables`, `pg_policies`, dan `information_schema.table_privileges`:

```
=== STATUS ROW LEVEL SECURITY (RLS) PER TABEL ===
┌────────────────────┬─────────────┬───────────────────────────────────────────┐
│ Nama Tabel         │ Status RLS  │ Kondisi Hak Akses Publik / Anon           │
├────────────────────┼─────────────┼───────────────────────────────────────────┤
│ users              │ NONAKTIF    │ BAHAYA: Anon memiliki akses SELECT & DUMP │
│ contact_messages   │ NONAKTIF    │ BAHAYA: Anon memiliki akses SELECT inbox  │
│ comments           │ AKTIF       │ CACAT: INSERT lolos karena 'OR true'      │
│ ai_chat_memories   │ AKTIF       │ AMAN: qual/with_check auth.uid()=user_id  │
│ projects           │ AKTIF       │ AMAN: SELECT publik hanya published=true  │
│ site_profile       │ AKTIF       │ AMAN: SELECT publik bernilai true         │
│ site_settings      │ AKTIF       │ AMAN: SELECT publik bernilai true         │
│ experiences        │ AKTIF       │ AMAN: SELECT publik bernilai true         │
│ educations         │ AKTIF       │ AMAN: SELECT publik bernilai true         │
│ research_items     │ AKTIF       │ AMAN: SELECT publik bernilai true         │
│ media_items        │ AKTIF       │ AMAN: SELECT publik bernilai true         │
└────────────────────┴─────────────┴───────────────────────────────────────────┘
```

### Bukti Kebijakan (Policies) di Live DB:

1. `ai_chat_memories`:
   - `DELETE`: `(auth.uid() = user_id)`
   - `INSERT`: `(auth.uid() = user_id)`
   - `SELECT`: `(auth.uid() = user_id)`
2. `comments`:
   - `SELECT`: `(is_hidden = false)`
   - `UPDATE`: `(auth.uid() = author_id)`
   - `INSERT`: `((auth.uid() IS NOT NULL) OR true)` _(Perlu diperbaiki)_
3. `projects`: `SELECT (published = true)`
4. `site_profile`, `site_settings`, `experiences`, `educations`, `research_items`, `media_items`: `SELECT true`.
5. **Koneksi Server Next.js:** Aplikasi Next.js menghubungkan koneksi pool direct `pg` dengan user `postgres`. Role `postgres` di PostgreSQL secara default memiliki atribut `BYPASSRLS = true`, sehingga backend server internal tidak terhalang oleh RLS. Kerentanan timbul jika port PostgREST/Supabase Anon Key terekspos ke publik untuk tabel yang belum ber-RLS (`users` dan `contact_messages`).

---

## 5. Peta Komponen & Rencana Redesign

### 5.1 Komponen Eksisting yang Dapat Digunakan Ulang

- **Komponen Publik:**
  - `src/components/layout/Navbar.tsx`: Navigasi responsif dengan status sesi.
  - `src/components/layout/Footer.tsx`: Branding, hak cipta, dan social links.
  - `src/components/hero/Hero3DCanvas.tsx` & `Hero3DFallback.tsx`: Canvas Three.js interaktif berlatar gelap.
  - `src/components/projects/ProjectCard.tsx`: Kartu proyek serbaguna.
  - `src/components/research/ResearchDocViewer.tsx`: Visualizer naskah akademik terstruktur.
  - `src/components/community/CommentThread.tsx`: Threading diskusi berjenjang.
  - `src/components/ai/AIAssistantModal.tsx`: Chat dialog interaktif dengan persona terkonfigurasi.
- **Komponen Admin:**
  - `src/components/layout/AdminSidebar.tsx`: Sidebar admin panel.
  - `src/components/admin/ExternalLinksEditor.tsx`: Pengelola link platform dinamis (Roboflow, Kaggle, HuggingFace, dll.).
  - `src/components/admin/ResearchHybridEditor.tsx`: Editor naskah riset modular.

### 5.2 Evaluasi UI/UX & Kebutuhan Redesign

1. **Desain Website Publik:**
   - Kondisi saat ini: Menggunakan palet gelap monokrom `#0B0D12` dengan aksen `#7790FF`. Struktur cukup rapi namun hierarki tipografi dan kontras mikro masih datar.
   - Target Redesign: Tingkatkan estetika visual dengan glassmorphism modern, ambient glowing gradients di sekeliling kartu fitur, tata letak hero bento-grid yang lebih proporsional, serta micro-interactions saat hovering.
2. **Desain Admin Panel:**
   - Kondisi saat ini: Tampilan fungsional sederhana dengan form memanjang ke bawah dan sidebar statis. Kurang optimal di layar ponsel/tablet.
   - Target Redesign: Antarmuka dashboard modern bergaya command center gelap premium. Tambahkan feedback visual (skeletons saat loading data), status badge real-time, drawer dialog mobile yang responsif, dan tabs kontekstual pada halaman profile dan settings.
3. **Localization (ID / EN):**
   - Saat ini string teks bahasa Indonesia tercampur dengan istilah teknis bahasa Inggris secara hardcoded di dalam komponen.
   - Perlu dibuat kamus lokalisasi terstruktur (`id` dan `en`) agar website dapat beralih bahasa secara mulus tanpa risiko regresi data.

---

## 6. Daftar Tugas Implementasi Berurutan (Aman & Bertahap)

```
[Tahap 1: Keamanan Kritis Backend]
  ├── Task 1.1: Pengamanan Secret & JWT Fallback (SEC-01, SEC-04)
  ├── Task 1.2: Penutupan Path Traversal PDF/CV (SEC-03)
  └── Task 1.3: Penguatan Skrip Migrasi RLS untuk Live Database (SEC-02, SEC-05)

[Tahap 2: Keamanan Transport, Input, & Storage]
  ├── Task 2.1: Enforce Strict TLS & Environment Validation (SEC-06, SEC-10)
  ├── Task 2.2: Sanitasi Berkas SVG & Validasi Upload (SEC-08)
  └── Task 2.3: Security Headers di next.config.ts (SEC-09)

[Tahap 3: Restrukturisasi UI Design System & Localization]
  ├── Task 3.1: Token Warna Premium & Glassmorphism Design Tokens di CSS
  └── Task 3.2: Kamus Lokalisasi (ID/EN) & Language Switcher

[Tahap 4: Redesign Website Publik]
  ├── Task 4.1: Redesign Hero Section & Bento Showcase
  ├── Task 4.2: Redesign Katalog Proyek & Halaman Detail Studi Kasus
  └── Task 4.3: Redesign Halaman Riset & Diskusi Komunitas

[Tahap 5: Redesign Admin Panel]
  ├── Task 5.1: Redesign Layout Admin, Sidebar, & Overview Dashboard
  └── Task 5.2: Redesign Editor Konten (Profile, Projects, Research, Settings)
```

### Rincian Spesifikasi Tugas:

#### Task 1.1: Pengamanan Secret & JWT Fallback

- **Scope:** Menghilangkan semua fallback hardcoded secret dan password default.
- **File Terkait:** `src/lib/auth/session.ts`, `src/app/api/auth/login/route.ts`.
- **Kriteria Selesai:** Server menolak membuat atau memverifikasi token jika `AUTH_SECRET` tidak terset; login route tidak menerima password default jika `ADMIN_PASSWORD` tidak disetel.
- **Tes Diperlukan:** Coba buat request login tanpa `AUTH_SECRET` (harus throw 500 aman), coba login dengan default password lama (harus ditolak 401).

#### Task 1.2: Penutupan Path Traversal PDF/CV

- **Scope:** Membatasi akses file hanya pada subdirektori publik yang diizinkan dan menolak traversal `..`.
- **File Terkait:** `src/app/api/profile/cv/route.ts`, `src/app/api/research/[id]/pdf/route.ts`.
- **Kriteria Selesai:** Path file divalidasi dengan `path.resolve` dan dipastikan berada di dalam `public/uploads` atau `public/files`.
- **Tes Diperlukan:** Kirim request dengan URL manipulatif `../../.env.local` (harus menghasilkan 404 / 400, tidak boleh membaca isi file server).

#### Task 1.3: Migrasi RLS Live Database

- **Scope:** Pembuatan skrip SQL migrasi `008_fix_security_and_rls.sql` untuk mengaktifkan RLS pada tabel `users` & `contact_messages`, memperbaiki policy `comments`, serta mencabut grant CRUD `anon`.
- **File Terkait:** `database/migrations/008_fix_security_and_rls.sql`.
- **Kriteria Selesai:** Query `pg_tables` membuktikan `users` dan `contact_messages` memiliki `rowsecurity = true`; pengujian via PostgREST anon key menghasilkan 401/403.
- **Tes Diperlukan:** Akses curl langsung ke endpoint Supabase PostgREST `https://<supabase-id>.supabase.co/rest/v1/users` dengan anon key (harus ditolak `permission denied`).

#### Task 2.1: Enforce Strict TLS & Validasi Upload

- **Scope:** Menghilangkan `rejectUnauthorized: false` dan memperkuat sanitasi berkas upload SVG / validasi magic bytes.
- **File Terkait:** `src/lib/db/postgres.ts`, `src/lib/storage/storage.ts`, `src/lib/security/sanitize.ts`.
- **Kriteria Selesai:** Koneksi DB memvalidasi sertifikat; SVG yang diunggah dibersihkan dari atribut berbahaya (event handlers & inline script) sebelum disimpan.
- **Tes Diperlukan:** Unggah file SVG uji coba berisi payload XSS `<svg onload=...>` (harus ditolak atau tag dibersihkan).

#### Task 2.2: HTTP Security Headers

- **Scope:** Mendaftarkan header keamanan standar di Next.js.
- **File Terkait:** `next.config.ts`.
- **Kriteria Selesai:** Header `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, dan CSP dasar terinjeksi di setiap respons HTTP.
- **Tes Diperlukan:** Inspect response headers via `curl -I http://localhost:3000`.

#### Task 3.1 & 3.2: Design Tokens & Localization System

- **Scope:** Menyusun variabel desain CSS baru (glass surface, border sheen, elevation glow) dan modul dictionary ID/EN tanpa merusak data kontrak.
- **File Terkait:** `src/app/globals.css`, `src/lib/i18n/`.
- **Kriteria Selesai:** Token CSS tersedia untuk komponen; fungsi translate helper mengembalikan string sesuai locale aktif.
- **Tes Diperlukan:** Render halaman dengan kedua locale bergantian, pastikan tidak ada teks yang hilang.

#### Task 4.1 - 4.3: Redesign Website Publik

- **Scope:** Mempercantik landing page, katalog portofolio, detail riset, dan diskusi dengan estetika mutakhir (bento-grid, ambient glows, micro-interactions) tanpa mengubah schema database.
- **File Terkait:** `src/components/hero/`, `src/components/projects/`, `src/components/research/`, `src/components/community/`.
- **Kriteria Selesai:** Tampilan responsif di mobile & desktop, transisi halus, zero regression pada interaksi chat AI dan komentar.
- **Tes Diperlukan:** Pengujian fungsionalitas kirim komentar, chat AI, dan navigasi detail proyek.

#### Task 5.1 - 5.2: Redesign Admin Panel

- **Scope:** Transformasi tampilan Admin Panel menjadi dashboard elegan, responsif, dilengkapi visual indicators, breadcrumbs modern, dan dialog konfirmasi interaktif.
- **File Terkait:** `src/app/admin/`, `src/components/layout/AdminSidebar.tsx`, `src/components/admin/`.
- **Kriteria Selesai:** Admin panel nyaman digunakan di mobile/tablet, seluruh alur CRUD profil, proyek, riset, dan media berjalan lancar.
- **Tes Diperlukan:** Uji alur edit profil, tambah proyek, edit riset, dan hapus komentar melalui dashboard baru.

---

## 7. Risiko yang Memerlukan Keputusan Pemilik Project

1. **Penerapan RLS & Revoke Grant pada Supabase Production:**
   - _Risiko:_ Jika ada script pihak ketiga, cron job, atau dashboard luar yang mengandalkan Supabase PostgREST Anon Key untuk mengakses `users` atau `contact_messages`, akses tersebut akan terblokir setelah RLS diaktifkan dan grant dicabut.
   - _Pilihan Pemilik:_ Menyetujui migrasi pengetatan RLS agar seluruh manipulasi data wajib melalui Next.js server route handler

2. **Penyimpanan Berkas Media (Supabase Storage vs Local Disk):**
   - _Risiko:_ Saat ini kode memiliki fallback penyimpanan lokal di `public/uploads/`. Pada deployment Vercel serverless, filesystem lokal bersifat read-only dan stateless (berkas yang diunggah akan hilang setelah fungsi serverless restart).
   - _Pilihan Pemilik:_ Memastikan kredensial `SUPABASE_SERVICE_ROLE_KEY` dan bucket `media` di Supabase Storage aktif dan terkonfigurasi untuk seluruh lingkungan (Preview & Production).

3. **Rate Limiting di Serverless (In-Memory vs Redis):**
   - _Risiko:_ Rate limiting in-memory saat ini tidak persisten di Vercel.
   - _Pilihan Pemilik:_ Apakah ingin mengintegrasikan Upstash Redis (gratis) untuk proteksi anti-bruteforce yang persisten

4. **Kredensial Sesi & Penggantian Secret:**
   - _Risiko:_ Memperbaiki `AUTH_SECRET` dan menghapus fallback secret akan otomatis membatalkan (logout) semua sesi login yang sedang aktif saat ini.
   - _Pilihan Pemilik:_ Pemilik perlu menyiapkan nilai string acak minimal 32 karakter untuk `AUTH_SECRET` dan password admin baru di `.env.local` / Vercel Environment Variables.
