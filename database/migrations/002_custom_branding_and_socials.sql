-- Migration: 002_custom_branding_and_socials.sql
-- Add editable role_title, brand_name, logo_url, instagram_url, tiktok_url to site_profile
-- Add editable ai_assistant_name to site_settings

ALTER TABLE site_profile ADD COLUMN IF NOT EXISTS role_title VARCHAR(120) NOT NULL DEFAULT 'Informatics & CV Engineer';
ALTER TABLE site_profile ADD COLUMN IF NOT EXISTS brand_name VARCHAR(120) NOT NULL DEFAULT 'Wijaya Dary Dimas';
ALTER TABLE site_profile ADD COLUMN IF NOT EXISTS logo_url TEXT NOT NULL DEFAULT '';
ALTER TABLE site_profile ADD COLUMN IF NOT EXISTS instagram_url TEXT NOT NULL DEFAULT '';
ALTER TABLE site_profile ADD COLUMN IF NOT EXISTS tiktok_url TEXT NOT NULL DEFAULT '';

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS ai_assistant_name VARCHAR(120) NOT NULL DEFAULT 'Asisten AI — Wijaya Dary Dimas';
