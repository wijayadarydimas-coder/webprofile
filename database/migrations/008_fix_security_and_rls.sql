-- ==============================================================================
-- 008: Security hardening — RLS & PostgREST grants (SEC-02, SEC-05)
-- ==============================================================================
-- Context:
--   * The Next.js backend connects via `pg` as role `postgres` (BYPASSRLS),
--     so these changes do NOT affect the application's own queries.
--   * The app does not use Supabase Auth nor PostgREST for table access;
--     `@supabase/supabase-js` is only used for Storage.
--   * This migration only closes direct access through the public
--     anon/authenticated keys (PostgREST `/rest/v1/...`).
--
-- Idempotent: safe to re-run (e.g. via `node scripts/db-setup.mjs`, which runs
-- 001 first — 008 then re-applies the corrected comments policy).
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- SEC-02: users & contact_messages — enable RLS, no policies, revoke all access
-- ------------------------------------------------------------------------------
-- RLS enabled with zero policies = deny-all for non-bypass roles.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE users FROM anon, authenticated;
REVOKE ALL ON TABLE contact_messages FROM anon, authenticated;

-- ------------------------------------------------------------------------------
-- SEC-05: comments — remove `OR true` from INSERT policy
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
CREATE POLICY "Authenticated users can create comments" ON comments
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = author_id);

-- Anonymous visitors may only read visible comments (existing SELECT policy).
REVOKE INSERT, UPDATE, DELETE ON TABLE comments FROM anon;

COMMIT;

-- ==============================================================================
-- VERIFICATION (read-only, run manually after applying):
--
--   SELECT tablename, rowsecurity FROM pg_tables
--   WHERE schemaname = 'public' AND tablename IN ('users','contact_messages','comments');
--   -- expect rowsecurity = true for all three
--
--   SELECT grantee, table_name, privilege_type FROM information_schema.table_privileges
--   WHERE table_schema = 'public' AND grantee IN ('anon','authenticated')
--     AND table_name IN ('users','contact_messages');
--   -- expect 0 rows
--
--   SELECT policyname, cmd, with_check FROM pg_policies
--   WHERE schemaname = 'public' AND tablename = 'comments';
--   -- INSERT with_check must NOT contain "OR true"
-- ==============================================================================
