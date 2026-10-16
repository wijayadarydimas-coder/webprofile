-- Migration: 003_ai_chat_memories.sql
-- Table to store AI chat memory/history for registered users and admin

CREATE TABLE IF NOT EXISTS ai_chat_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_memories_user ON ai_chat_memories(user_id, created_at ASC);

-- Enable RLS for ai_chat_memories
ALTER TABLE ai_chat_memories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own ai memories" ON ai_chat_memories;
CREATE POLICY "Users can read own ai memories"
    ON ai_chat_memories FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own ai memories" ON ai_chat_memories;
CREATE POLICY "Users can insert own ai memories"
    ON ai_chat_memories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own ai memories" ON ai_chat_memories;
CREATE POLICY "Users can delete own ai memories"
    ON ai_chat_memories FOR DELETE
    USING (auth.uid() = user_id);
