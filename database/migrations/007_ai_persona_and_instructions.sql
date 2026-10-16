-- Migration: 007_ai_persona_and_instructions.sql
-- Menambahkan kolom kustomisasi persona AI, sapaan pembuka (welcome message), dan instruksi sistem tambahan pada site_settings

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS ai_persona TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS ai_welcome_message TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS ai_system_prompt TEXT NOT NULL DEFAULT '';
