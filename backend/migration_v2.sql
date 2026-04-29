-- ============================================================
-- Migration: Advanced Comment Permissions & Notifications
-- Run this in your Supabase SQL editor
-- ============================================================


-- ── 1. ADD role COLUMN TO user_profiles ─────────────────────
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'admirer'
    CHECK (role IN ('author', 'admirer'));


-- ── 2. ADD soft-delete + reason COLUMNS TO comments ─────────
ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS is_deleted    boolean   NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS deleted_at    timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_by    uuid       REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS delete_reason text,
  ADD COLUMN IF NOT EXISTS delete_message text,
  ADD COLUMN IF NOT EXISTS role          text       DEFAULT 'admirer';


-- ── 3. INDEX for faster soft-delete filtering ────────────────
CREATE INDEX IF NOT EXISTS comments_post_id_deleted_idx
  ON public.comments (post_id, is_deleted);


-- ── 4. CREATE notifications TABLE ───────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at   timestamptz DEFAULT timezone('utc', now()) NOT NULL,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  type         text NOT NULL,          -- 'comment_removed' | 'mention'
  message      text NOT NULL,
  post_id      uuid REFERENCES public.posts(id) ON DELETE SET NULL,
  comment_id   uuid,                   -- soft reference — no FK so deleted comment rows survive
  is_read      boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS notifications_recipient_read_idx
  ON public.notifications (recipient_id, is_read);


-- ── 5. ROW LEVEL SECURITY FOR notifications ──────────────────
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Recipients can read their own notifications
CREATE POLICY "Own notifications are readable."
  ON public.notifications FOR SELECT
  USING (auth.uid() = recipient_id);

-- Backend service role inserts (bypasses RLS automatically with service key)
-- No INSERT policy needed when using service_role key on the backend.

-- Recipients can mark their own notifications as read
CREATE POLICY "Recipients can update their own notifications."
  ON public.notifications FOR UPDATE
  USING (auth.uid() = recipient_id);


-- ── 6. RLS POLICIES FOR comments ────────────────────────────
-- Allow authors to update (soft-delete) any comment on their own posts
CREATE POLICY "Post authors can soft-delete comments."
  ON public.comments FOR UPDATE
  USING (
    -- The commenting user is doing it themselves, OR
    auth.uid() = user_id
    OR
    -- The current user is the post author
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = comments.post_id
        AND posts.author_id = auth.uid()
    )
  );

-- Anyone can INSERT a comment (will be combined with authMiddleware guard)
CREATE POLICY "Authenticated users can insert comments."
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
