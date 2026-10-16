-- ==============================================================================
-- MIGRATION 005: RESEARCH DYNAMIC SECTIONS & ACADEMIC METADATA
-- Menambahkan metadata akademik dan kolom JSONB sections fleksibel
-- ==============================================================================

-- 1. Tambahkan kolom metadata akademik & sections dinamis pada research_items
ALTER TABLE research_items
  ADD COLUMN IF NOT EXISTS institution VARCHAR(255) DEFAULT 'Universitas Muhammadiyah Purwokerto',
  ADD COLUMN IF NOT EXISTS study_program VARCHAR(255) DEFAULT 'S1 Teknik Informatika',
  ADD COLUMN IF NOT EXISTS technologies JSONB DEFAULT '["Python", "PyTorch", "YOLOv11", "OpenCV", "Roboflow"]'::jsonb,
  ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '[]'::jsonb;

-- 2. Tambahkan komentar kolom untuk dokumentasi
COMMENT ON COLUMN research_items.institution IS 'Institusi atau universitas tempat penelitian dilakukan';
COMMENT ON COLUMN research_items.study_program IS 'Program studi atau fakultas terkait';
COMMENT ON COLUMN research_items.technologies IS 'Array JSONB berisi daftar teknologi, framework, dan library utama';
COMMENT ON COLUMN research_items.sections IS 'Array JSONB berisi bagian-bagian konten dinamis terstruktur (Hybrid Research Editor)';
