import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Send } from 'lucide-react';

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
      const res = await fetch(`http://localhost:5000/api/comments/${postId}`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setError('');
      const res = await fetch(`http://localhost:5000/api/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to post comment');
      }

      setNewComment('');
      fetchComments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete comment');
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-12 space-y-6">
      <h3 className="font-display text-2xl text-text-main">Comments ({comments.length})</h3>

      {token ? (
        <form onSubmit={handlePostComment} className="flex gap-4 items-start">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="input-field flex-1 min-h-[80px] resize-y"
          />
          <button type="submit" className="btn-primary mt-1" disabled={!newComment.trim()}>
            <Send className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <p className="text-sm text-text-muted bg-surface-secondary p-4 rounded-xl border border-border">
          Please log in to add a comment.
        </p>
      )}
      
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="space-y-4 mt-6">
        {loading ? (
          <p className="text-text-muted text-sm animate-pulse">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-text-muted text-sm">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={comment.id} 
              className="card-panel p-4 flex flex-col space-y-2"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${comment.author}&backgroundColor=transparent`}
                    alt={comment.author}
                    className="w-8 h-8 rounded-full border border-border bg-surface-secondary"
                  />
                  <div>
                    <span className="font-semibold text-text-main text-sm">{comment.author}</span>
                    <span className="text-xs text-text-subtle ml-2">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {user && user.id === comment.user_id && (
                  <button 
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-text-muted hover:text-red-500 transition-colors p-1"
                    title="Delete Comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-text-main text-sm pl-10">{comment.content}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
