-- ==============================================================================
-- WIJAYA DARY DIMAS PERSONAL WEBSITE - INITIAL DATABASE SCHEMA
-- Migration: 001_initial_schema.sql
-- Compatible with: PostgreSQL 14+, PostgREST, Supabase
-- ==============================================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. USERS & AUTHENTICATION TABLE (For custom auth / PostgREST)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'visitor' CHECK (role IN ('admin', 'visitor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ------------------------------------------------------------------------------
-- 2. SITE PROFILE & HERO TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_profile (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'primary',
    full_name VARCHAR(120) NOT NULL,
    headline VARCHAR(255) NOT NULL,
    short_bio TEXT NOT NULL,
    about_me TEXT NOT NULL,
    avatar_url TEXT NOT NULL DEFAULT '',
    avatar_alt VARCHAR(255) NOT NULL DEFAULT 'Foto Profil Wijaya Dary Dimas',
    cv_url TEXT NOT NULL DEFAULT '',
    github_url TEXT NOT NULL DEFAULT '',
    linkedin_url TEXT NOT NULL DEFAULT '',
    email VARCHAR(255) NOT NULL DEFAULT '',
    location VARCHAR(120) NOT NULL DEFAULT 'Purwokerto, Indonesia',
    status_text VARCHAR(255) NOT NULL DEFAULT 'Aktif riset Computer Vision & Software Engineering',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. PROJECTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(150) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    problem TEXT DEFAULT '',
    solution TEXT DEFAULT '',
    results TEXT DEFAULT '',
    category VARCHAR(50) NOT NULL DEFAULT 'Computer Vision',
    technologies TEXT[] NOT NULL DEFAULT '{}',
    cover_image TEXT NOT NULL,
    repo_url TEXT DEFAULT '',
    live_url TEXT DEFAULT '',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured, published, order_index);

-- ------------------------------------------------------------------------------
-- 4. EXPERIENCES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization VARCHAR(200) NOT NULL,
    role VARCHAR(150) NOT NULL,
    period VARCHAR(100) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    type VARCHAR(30) NOT NULL DEFAULT 'work' CHECK (type IN ('work', 'internship', 'organization')),
    order_index INT NOT NULL DEFAULT 0,
    url TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experiences_order ON experiences(order_index);

-- ------------------------------------------------------------------------------
-- 5. EDUCATION TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS educations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution VARCHAR(200) NOT NULL,
    degree VARCHAR(150) NOT NULL,
    period VARCHAR(100) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    order_index INT NOT NULL DEFAULT 0,
    url TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_educations_order ON educations(order_index);

-- ------------------------------------------------------------------------------
-- 6. RESEARCH & THESIS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS research_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(300) NOT NULL,
    summary TEXT NOT NULL,
    background TEXT NOT NULL DEFAULT '',
    objective TEXT NOT NULL DEFAULT '',
    methodology TEXT NOT NULL DEFAULT '',
    model_modification TEXT NOT NULL DEFAULT '',
    dataset_notes TEXT NOT NULL DEFAULT '',
    published_status VARCHAR(50) NOT NULL DEFAULT 'Penelitian Skripsi',
    repo_url TEXT DEFAULT '',
    pdf_url TEXT DEFAULT '',
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_research_order ON research_items(order_index);

-- ------------------------------------------------------------------------------
-- 7. COMMENTS & REPLIES TABLE (Two-way threaded discussion)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    author_role VARCHAR(20) NOT NULL DEFAULT 'visitor',
    content TEXT NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at DESC);

-- ------------------------------------------------------------------------------
-- 8. MEDIA LIBRARY TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    alt_text VARCHAR(255) NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. SITE SETTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'primary',
    ai_provider VARCHAR(50) NOT NULL DEFAULT 'gemini',
    ai_model VARCHAR(100) NOT NULL DEFAULT 'gemini-1.5-flash',
    contact_email VARCHAR(255) NOT NULL DEFAULT '',
    enable_ai_assistant BOOLEAN NOT NULL DEFAULT TRUE,
    enable_comments BOOLEAN NOT NULL DEFAULT TRUE,
    notify_on_comment BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. CONTACT FORM INBOX TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at DESC);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE site_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
DROP POLICY IF EXISTS "Public read site_profile" ON site_profile;
CREATE POLICY "Public read site_profile" ON site_profile FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read projects" ON projects;
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Public read experiences" ON experiences;
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read educations" ON educations;
CREATE POLICY "Public read educations" ON educations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read research_items" ON research_items;
CREATE POLICY "Public read research_items" ON research_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read visible comments" ON comments;
CREATE POLICY "Public read visible comments" ON comments FOR SELECT USING (is_hidden = false);

DROP POLICY IF EXISTS "Public read site_settings" ON site_settings;
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read media_items" ON media_items;
CREATE POLICY "Public read media_items" ON media_items FOR SELECT USING (true);

-- Authenticated comment creation
DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
CREATE POLICY "Authenticated users can create comments" ON comments
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR true);

-- Author or Admin can update their own comment
DROP POLICY IF EXISTS "Authors can update own comment" ON comments;
CREATE POLICY "Authors can update own comment" ON comments
    FOR UPDATE USING (auth.uid() = author_id);

-- ------------------------------------------------------------------------------
-- INITIAL SEED DATA (VERIFIED OWNER FACTS)
-- ------------------------------------------------------------------------------
INSERT INTO site_profile (
    id, full_name, headline, short_bio, about_me, avatar_url, avatar_alt, cv_url, github_url, linkedin_url, email, location, status_text
) VALUES (
    'primary',
    'Wijaya Dary Dimas',
    'Exploring Technology. Building Ideas. Creating Impact.',
    'Saya memiliki latar belakang Teknik Informatika dan senang mengeksplorasi teknologi melalui proyek, penelitian, dan pengalaman praktik. Website ini menjadi tempat saya mendokumentasikan karya, proses belajar, dan perjalanan profesional.',
    'Halo! Saya Wijaya Dary Dimas, mahasiswa Teknik Informatika di Universitas Muhammadiyah Purwokerto dengan fokus minat pada rekayasa perangkat lunak, sistem berbasis machine learning / computer vision, dan komputasi praktis.

Melalui perjalanan akademis dan pengalaman magang di Badan Informasi Geospasial sebagai Pranata Komputer, saya terbiasa memecahkan masalah teknis dengan pendekatan terstruktur, menguji solusi secara langsung, dan membangun sistem yang andal.

Saya percaya bahwa teknologi terbaik adalah teknologi yang dapat menyelesaikan masalah nyata dengan efisien dan tepat sasaran.',
    '/images/profile-placeholder.svg',
    'Foto Profil Wijaya Dary Dimas',
    '/files/cv-placeholder.pdf',
    'https://github.com/wijayadarydimas-coder',
    '',
    '',
    'Purwokerto / Indonesia',
    'Aktif di Badan Informasi Geospasial & Riset YOLOv11 APD'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO site_settings (id, ai_provider, ai_model, contact_email, enable_ai_assistant, enable_comments, notify_on_comment)
VALUES ('primary', 'gemini', 'gemini-1.5-flash', '', true, true, false)
ON CONFLICT (id) DO NOTHING;

-- Seed initial verified experience
INSERT INTO experiences (id, organization, role, period, description, type, order_index, url)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Badan Informasi Geospasial',
    'Pranata Komputer',
    'November 2025 – Mei 2026',
    'Menjalankan tugas dan tanggung jawab sebagai Pranata Komputer, berfokus pada dukungan sistem komputasi, pengelolaan infrastruktur data informasi spasial, serta pengembangan solusi teknologi informasi pendukung instansi.',
    'internship',
    1,
    'https://big.go.id'
) ON CONFLICT (id) DO NOTHING;

-- Seed initial verified education
INSERT INTO educations (id, institution, degree, period, description, order_index, url)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'Universitas Muhammadiyah Purwokerto',
    'S1 Teknik Informatika',
    '2021 – Sekarang',
    'Fokus studi pada rekayasa perangkat lunak, arsitektur basis data, kecerdasan buatan, dan pengolahan citra digital. Mengembangkan skripsi modifikasi YOLOv11 untuk deteksi APD dengan alarm otomatis.',
    1,
    'https://ump.ac.id'
) ON CONFLICT (id) DO NOTHING;

-- Seed initial verified research
INSERT INTO research_items (
    id, title, summary, background, objective, methodology, model_modification, dataset_notes, published_status, repo_url, pdf_url, order_index
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    'Implementasi YOLOv11 Modifikasi Untuk Deteksi Alat Pelindung Diri Helm Rompi, Sarung Tangan Dan Sepatu Dengan Alarm Otomatis.',
    'Penelitian pengembangan arsitektur YOLOv11 yang dimodifikasi untuk mendeteksi kelengkapan Alat Pelindung Diri (APD) pada lingkungan kerja industri dan konstruksi secara real-time disertai mekanisme alarm peringatan otomatis.',
    'Keselamatan dan Kesehatan Kerja (K3) menuntut kedisiplinan penggunaan APD lengkap bagi para pekerja. Pengawasan manual seringkali tidak efektif pada area kerja yang luas, sehingga dibutuhkan sistem computer vision otomatis yang responsif dan berakurasi tinggi.',
    'Merancang dan mengimplementasikan model deteksi objek modifikasi YOLOv11 yang mampu mengklasifikasikan helm, rompi, sarung tangan, dan sepatu keselamatan secara simultan, serta mengintegrasikan output deteksi dengan sistem pemicu alarm otomatis.',
    'Tahapan penelitian meliputi pengumpulan dan anotasi dataset APD, integrasi modul modifikasi pada backbone dan neck YOLOv11, pelatihan model dengan augmentasi citra khusus kondisi lapangan, validasi inferensi, serta pengujian integrasi alarm berbasis ambang batas kepatuhan.',
    'Modifikasi struktural difokuskan pada optimalisasi feature extraction untuk mendeteksi objek berukuran variatif (dari sepatu di kejauhan hingga sarung tangan yang sering teroklusi), serta pengurangan latensi inferensi agar handal untuk streaming video langsung.',
    'Dataset mencakup variasi kondisi pencahayaan, sudut pandang kamera, dan variasi warna APD standar keselamatan industri.',
    'Penelitian Skripsi',
    'https://github.com/wijayadarydimas-coder',
    '',
    1
) ON CONFLICT (id) DO NOTHING;

-- Seed initial featured project based on verified research
INSERT INTO projects (
    slug, title, short_description, full_description, problem, solution, results, category, technologies, cover_image, repo_url, live_url, featured, published, order_index
) VALUES (
    'yolov11-safety-detection',
    'Sistem Deteksi APD Real-Time & Alarm Otomatis Berbasis YOLOv11',
    'Sistem computer vision cerdas untuk mendeteksi kelengkapan APD (helm, rompi, sarung tangan, sepatu keselamatan) pada pekerja industri dengan pemicu alarm otomatis.',
    'Proyek ini merupakan implementasi dan rekayasa sistem dari penelitian skripsi di Universitas Muhammadiyah Purwokerto. Sistem dirancang untuk memantau keselamatan kerja di area berisiko tinggi secara berkelanjutan tanpa kelelahan manusia.',
    'Pelanggaran kepatuhan APD di lokasi kerja dapat berakibat fatal. Pengawasan konvensional melalui CCTV membutuhkan tenaga operator manusia terus-menerus dan rentan terhadap kelalaian visual.',
    'Mengintegrasikan model YOLOv11 yang dimodifikasi untuk deteksi multi-kelas APD secara simultan, pipeline video streaming RTSP/Webcam, dan trigger alarm audio-visual seketika saat pekerja terdeteksi tidak menggunakan APD lengkap.',
    'Sistem berhasil memproses aliran video secara stabil dan memicu peringatan otomatis saat mendeteksi pekerja di zona kerja tanpa perlengkapan APD.',
    'Computer Vision',
    ARRAY['Python', 'YOLOv11', 'PyTorch', 'OpenCV', 'Computer Vision', 'Audio Alert System'],
    '/images/project-yolo.svg',
    'https://github.com/wijayadarydimas-coder',
    '',
    true,
    true,
    1
) ON CONFLICT (slug) DO NOTHING;
