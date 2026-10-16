-- Migration: 006_about_highlight_selection.sql
-- Menambahkan kolom konfigurasi pilihan kartu sorotan (Pendidikan, Pengalaman, dan Riset) pada seksi Tentang Saya

ALTER TABLE site_profile
ADD COLUMN IF NOT EXISTS about_education_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS about_experience_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS about_research_id VARCHAR(100);
