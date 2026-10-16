-- Migration: 004_about_title_and_external_links.sql
-- 1. Add editable about_title to site_profile
-- 2. Add external_links JSONB to projects
-- 3. Add external_links JSONB to research_items

ALTER TABLE site_profile 
ADD COLUMN IF NOT EXISTS about_title VARCHAR(255) NOT NULL DEFAULT 'Profil, Prinsip Belajar & Fokus Teknis';

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS external_links JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE research_items 
ADD COLUMN IF NOT EXISTS external_links JSONB NOT NULL DEFAULT '[]'::jsonb;
