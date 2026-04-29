import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AtSign, LogIn, Send, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';
import { DeleteCommentModal } from './DeleteCommentModal';

const API = 'http://localhost:5000';

// ── Mention renderer ──────────────────────────────────────────────────────────
// Wraps @username tokens with a styled span
function CommentText({ content }) {
  const parts = content.split(/(@[a-zA-Z0-9_]+)/g);
  return (
    <p className="font-serif text-sm leading-relaxed text-[#404040]">
      {parts.map((part, i) =>
        /^@[a-zA-Z0-9_]+$/.test(part) ? (
          <span key={i} className="mention-chip">{part}</span>
        ) : (
          part
        )
      )}
    </p>
  );
}

// ── Role badge ────────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  if (!role) return null;
  const isAuthor = role === 'author';
  return (
    <span
      className="role-badge"
      style={{
        background: isAuthor ? '#111111' : '#F5F5F2',
        color: isAuthor ? '#F9F9F7' : '#525252',
        border: '1px solid #111111',
      }}
    >
      {isAuthor ? '✒ Author' : '◎ Admirer'}
    </span>
  );
}

// ── Single comment card ───────────────────────────────────────────────────────
function CommentCard({ comment, canDelete, onDeleteClick, index }) {
  if (comment.is_deleted) {
    return (
      <motion.article
        key={comment.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
        className="border border-[#E5E5E0] bg-[#F5F5F2] opacity-70"
      >
        <div className="px-4 py-4">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#A3A3A3] italic">
            ✕ This comment was removed by the author
            {comment.delete_reason ? ` · ${comment.delete_reason}` : ''}
          </p>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      key={comment.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border border-[#111111] bg-[#F9F9F7]"
    >
      <div className="flex items-start justify-between gap-4 border-b border-[#111111] px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#111111]">
            {comment.author}
          </p>
          <RoleBadge role={comment.role} />
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[#737373]">
            {new Date(comment.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        {canDelete && (
          <button
            type="button"
            onClick={() => onDeleteClick(comment)}
            className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center border border-[#111111] text-[#737373] transition-all hover:border-[#CC0000] hover:bg-[#CC0000] hover:text-white"
            title="Remove comment"
            aria-label={`Remove comment by ${comment.author}`}
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        )}
      </div>

      <div className="px-4 py-4">
        <CommentText content={comment.content} />
      </div>
    </motion.article>
  );
}

// ── Main CommentsSection ──────────────────────────────────────────────────────
/**
 * Props:
 *   postId      string   — UUID of the post
 *   postAuthorId string  — UUID of the post author (to gate delete permissions)
 */
export function CommentsSection({ postId, postAuthorId }) {
  const { user, token, isLoggedIn, role } = useAuth();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null); // comment object
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Is the current user the post author?
  const isPostAuthor = isLoggedIn && user?.id === postAuthorId;

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/comments/${postId}`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      setComments(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // ── Post comment ────────────────────────────────────────────────────────────
  const handlePostComment = async (event) => {
    event.preventDefault();
    if (!isLoggedIn) { navigate('/auth'); return; }
    if (!newComment.trim()) return;

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post comment');
      setNewComment('');
      fetchComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Open delete modal ───────────────────────────────────────────────────────
  const handleDeleteClick = (comment) => {
    if (!isLoggedIn) { navigate('/auth'); return; }
    setDeleteTarget(comment);
  };

  // ── Confirm deletion (called by modal) ──────────────────────────────────────
  const handleDeleteConfirm = async (reason, message) => {
    if (!deleteTarget) return;
    setDeleteSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/comments/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete comment');
      setDeleteTarget(null);
      fetchComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const activeComments = comments.filter((c) => !c.is_deleted).length;

  return (
    <>
      <section className="mt-12 border border-[#111111] bg-[#F9F9F7]">
        {/* Header */}
        <div className="border-b border-[#111111] px-5 py-4">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#737373]">
            Letters to the editor
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <h3 className="font-display text-3xl text-[#111111]">
              Comments ({activeComments})
            </h3>
            {isLoggedIn && (
              <div className="flex items-center gap-2">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#737373]">
                  Signed in as
                </span>
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#111111]">
                  {user?.display_name || user?.email?.split('@')[0]}
                </span>
                <RoleBadge role={role} />
              </div>
            )}
          </div>
        </div>

        <div className="p-5">
          {/* Comment input or login prompt */}
          {isLoggedIn ? (
            <form onSubmit={handlePostComment} className="border border-[#111111]">
              {role === 'admirer' && (
                <div className="border-b border-[#E5E5E0] px-4 pt-3 pb-2">
                  <p className="inline-flex items-center gap-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[#737373]">
                    <AtSign className="h-3 w-3" strokeWidth={1.5} />
                    Tip: mention authors with @username
                  </p>
                </div>
              )}
              <textarea
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
                placeholder="Add your response to the story…"
                className="input-base min-h-[120px] resize-y border-0 border-b-2 border-[#111111] px-4 py-4"
                maxLength={2000}
                disabled={submitting}
              />
              <div className="flex items-center justify-between p-3">
                <span className="font-mono text-[0.62rem] text-[#A3A3A3]">
                  {newComment.length}/2000
                </span>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!newComment.trim() || submitting}
                >
                  {submitting ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Send className="h-4 w-4" strokeWidth={1.5} />
                  )}
                  {submitting ? 'Submitting…' : 'Submit'}
                </button>
              </div>
            </form>
          ) : (
            <div className="border border-[#111111] bg-[#F5F5F2] px-5 py-5">
              <p className="font-serif text-sm leading-relaxed text-[#525252]">
                Join the conversation — sign in to share your perspective.
              </p>
              <Link
                to="/auth"
                className="btn-primary mt-4 inline-flex"
              >
                <LogIn className="h-4 w-4" strokeWidth={1.5} />
                Login to comment
              </Link>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-[#CC0000]">
              ✕ {error}
            </p>
          )}

          {/* Comments list */}
          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#737373]">
                Loading comments…
              </p>
            ) : comments.length === 0 ? (
              <p className="font-serif text-sm leading-relaxed text-[#525252]">
                No comments yet. Be the first to respond.
              </p>
            ) : (
              <AnimatePresence>
                {comments.map((comment, index) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    index={index}
                    canDelete={isPostAuthor}
                    onDeleteClick={handleDeleteClick}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>

      {/* Delete confirmation modal */}
      <DeleteCommentModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => !deleteSubmitting && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isSubmitting={deleteSubmitting}
      />
    </>
  );
}
