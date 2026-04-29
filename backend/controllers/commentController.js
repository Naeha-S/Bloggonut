import { supabase } from '../config/supabase.js';
import { z } from 'zod';

// ─── Validation Schemas ───────────────────────────────────────────────────────

const CommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(2000, 'Comment too long'),
  post_id: z.string().uuid('Invalid post ID'),
});

const DeleteReasonSchema = z.object({
  reason: z.enum(
    ['Spam', 'Abuse / Violence', 'Irrelevant', 'Harassment', 'Other'],
    { required_error: 'A deletion reason is required', invalid_type_error: 'Invalid reason selected' }
  ),
  message: z.string().max(500, 'Message too long').optional(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isUuid = (value = '') =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

/**
 * Parse @username mentions from comment content.
 * Returns an array of lowercase usernames found.
 */
const parseMentions = (text) => {
  const matches = text.match(/@([a-zA-Z0-9_]+)/g) || [];
  return [...new Set(matches.map((m) => m.slice(1).toLowerCase()))];
};

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * GET /api/comments/:postId
 * Public — returns all non-hard-deleted comments (including soft-deleted stubs).
 */
export const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId || !isUuid(postId)) {
      return res.status(200).json([]);
    }

    const { data, error } = await supabase
      .from('comments')
      .select('id, created_at, post_id, user_id, author, content, is_deleted, deleted_at, delete_reason, role')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      if (error.code === '22P02' || error.code === '42P01') return res.status(200).json([]);
      throw error;
    }

    // Mask soft-deleted content — keep stub visible in thread
    const safeComments = (data || []).map((c) => {
      if (c.is_deleted) {
        return {
          id: c.id,
          created_at: c.created_at,
          post_id: c.post_id,
          user_id: c.user_id,
          author: c.author,
          is_deleted: true,
          deleted_at: c.deleted_at,
          delete_reason: c.delete_reason,
          content: null,
          role: c.role,
        };
      }
      return c;
    });

    res.status(200).json(safeComments);
  } catch (err) {
    console.error('[comments:getCommentsForPost]', err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/comments/:postId  (auth required)
 * Creates a new comment. Handles @mention notifications.
 */
export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!isUuid(postId)) {
      return res.status(400).json({ error: 'Comments are only available for saved posts.' });
    }

    const validatedData = CommentSchema.parse({ ...req.body, post_id: postId });
    const user = req.user;

    // Fetch user profile role (author / admirer)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role, display_name')
      .eq('user_id', user.id)
      .single();

    const role = profile?.role || 'admirer';
    const authorName = profile?.display_name || user.email.split('@')[0];

    const { data: inserted, error } = await supabase
      .from('comments')
      .insert([
        {
          content: validatedData.content,
          post_id: postId,
          user_id: user.id,
          author: authorName,
          role,
          is_deleted: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // ── Mention notifications (for admirers mentioning @authors) ──
    const mentions = parseMentions(validatedData.content);
    if (mentions.length > 0) {
      // Resolve usernames to user IDs via user_profiles display_name
      const { data: mentionedProfiles } = await supabase
        .from('user_profiles')
        .select('user_id, display_name')
        .in('display_name', mentions);

      const notifications = (mentionedProfiles || []).map((p) => ({
        recipient_id: p.user_id,
        sender_id: user.id,
        type: 'mention',
        message: `@${authorName} mentioned you in a comment.`,
        post_id: postId,
        comment_id: inserted.id,
        is_read: false,
      }));

      if (notifications.length > 0) {
        await supabase.from('notifications').insert(notifications);
      }
    }

    res.status(201).json({ message: 'Comment added', data: inserted });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error('[comments:createComment]', err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /api/comments/:id  (auth required)
 *
 * Rules:
 *   - The post AUTHOR can delete ANY comment on their post (soft delete + reason required).
 *   - Regular users can only delete their OWN comment (soft delete, no reason required).
 */
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!isUuid(id)) {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }

    // Fetch comment + its post's author_id in one query
    const { data: comment, error: fetchError } = await supabase
      .from('comments')
      .select('id, user_id, post_id, author, content, posts(author_id)')
      .eq('id', id)
      .single();

    if (fetchError || !comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const isOwnComment = comment.user_id === user.id;
    const isPostAuthor = comment.posts?.author_id === user.id;

    if (!isOwnComment && !isPostAuthor) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    // If the post author is deleting someone else's comment, reason is required
    if (isPostAuthor && !isOwnComment) {
      const validation = DeleteReasonSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors[0].message });
      }

      const { reason, message: deleteMessage } = validation.data;

      // Soft delete
      const { error: deleteError } = await supabase
        .from('comments')
        .update({
          is_deleted: true,
          deleted_by: user.id,
          delete_reason: reason,
          delete_message: deleteMessage || null,
          deleted_at: new Date().toISOString(),
          content: null,
        })
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Notify the comment owner
      await supabase.from('notifications').insert([
        {
          recipient_id: comment.user_id,
          sender_id: user.id,
          type: 'comment_removed',
          message: `Your comment was removed by the post author. Reason: ${reason}${deleteMessage ? ` — "${deleteMessage}"` : ''}`,
          post_id: comment.post_id,
          comment_id: id,
          is_read: false,
        },
      ]);

      return res.status(200).json({ message: 'Comment removed and owner notified' });
    }

    // Own comment — simple soft delete (no reason required)
    const { error: selfDeleteError } = await supabase
      .from('comments')
      .update({
        is_deleted: true,
        deleted_by: user.id,
        deleted_at: new Date().toISOString(),
        content: null,
      })
      .eq('id', id);

    if (selfDeleteError) throw selfDeleteError;

    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    console.error('[comments:deleteComment]', err.message);
    res.status(500).json({ error: err.message });
  }
};
