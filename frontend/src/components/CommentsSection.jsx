import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Trash2 } from 'lucide-react';

export function CommentsSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('bms_token');
  const user = JSON.parse(localStorage.getItem('bms_user') || 'null');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (event) => {
    event.preventDefault();
    if (!newComment.trim()) return;

    try {
      setError('');
      const response = await fetch(`http://localhost:5000/api/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post comment');
      }

      setNewComment('');
      fetchComments();
    } catch (postError) {
      setError(postError.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete comment');
      fetchComments();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <section className="mt-12 border border-[#111111] bg-[#F9F9F7]">
      <div className="border-b border-[#111111] px-5 py-4">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#737373]">Letters to the editor</p>
        <h3 className="mt-3 font-display text-3xl text-[#111111]">Comments ({comments.length})</h3>
      </div>

      <div className="p-5">
        {token ? (
          <form onSubmit={handlePostComment} className="border border-[#111111]">
            <textarea
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
              placeholder="Add your response to the story"
              className="input-base min-h-[120px] resize-y border-0 border-b-2 border-[#111111] px-4 py-4"
            />
            <div className="flex justify-end p-3">
              <button type="submit" className="btn-primary" disabled={!newComment.trim()}>
                <Send className="h-4 w-4" strokeWidth={1.5} />
                Submit
              </button>
            </div>
          </form>
        ) : (
          <div className="border border-[#111111] px-4 py-4">
            <p className="font-serif text-sm leading-relaxed text-[#525252]">Please sign in to add a comment.</p>
          </div>
        )}

        {error ? <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-[#CC0000]">{error}</p> : null}

        <div className="mt-6 space-y-4">
          {loading ? (
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#737373]">Loading comments</p>
          ) : comments.length === 0 ? (
            <p className="font-serif text-sm leading-relaxed text-[#525252]">No comments yet. Be the first to respond.</p>
          ) : (
            comments.map((comment, index) => (
              <motion.article
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="border border-[#111111] bg-[#F9F9F7]"
              >
                <div className="flex items-start justify-between gap-4 border-b border-[#111111] px-4 py-3">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#111111]">{comment.author}</p>
                    <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[#737373]">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {user && user.id === comment.user_id ? (
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="inline-flex h-10 w-10 items-center justify-center border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F9F9F7]"
                      title="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  ) : null}
                </div>
                <div className="px-4 py-4">
                  <p className="font-serif text-sm leading-relaxed text-[#404040]">{comment.content}</p>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
