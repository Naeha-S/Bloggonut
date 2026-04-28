import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bookmark, Heart, MessageCircle, Eye, Loader } from 'lucide-react';
import { topicSlug } from '../data/topics';
import { CommentsSection } from '../components/CommentsSection';


export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('bms_user') || 'null');
  const token = localStorage.getItem('bms_token');

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete post');
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <Loader className="w-8 h-8 text-accent" />
        </motion.div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mt-8 md:mt-12">
        <div className="p-12 rounded-3xl bg-surface border border-border text-text-muted shadow-soft">
          <p>{error || 'Post not found.'}</p>
          <Link to="/" className="inline-flex mt-6 btn-secondary">
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 md:mt-10 space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to feed
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8 xl:gap-12"
      >
        <div className="space-y-6">
          <Link to={`/topics/${topicSlug(post.category)}`} className="micro-label inline-flex w-fit hover:text-accent transition-colors">
            {post.category}
          </Link>
          <h1 className="font-display text-4xl md:text-6xl leading-tight text-text-main max-w-3xl">
            {post.title}
          </h1>
          <p className="text-lg text-text-muted leading-relaxed max-w-2xl">
            {post.description}
          </p>

          <div className="flex flex-wrap gap-3">
            {(post.tags || []).map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full bg-surface-secondary text-accent text-xs font-semibold uppercase tracking-wide">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-5 text-text-muted text-sm">
            <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> {post.likes || 0}</span>
            <span className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4" /> {post.comments || 0}</span>
            <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {Math.floor(Math.random() * 1000) + 100}</span>
          </div>

          <div className="card-panel p-6 md:p-8 space-y-4">
            <div className="annotation-handwritten">
              Open the story, then keep scrolling for the full article flow.
            </div>
            <p className="text-text-main leading-8 font-light">
              {post.content}
            </p>
          </div>

          {/* Comments Section */}
          <CommentsSection postId={post.id} />
        </div>


        <div className="space-y-6 xl:sticky xl:top-28 self-start">
          {post.image && (
            <div className="card-panel overflow-hidden depth-layer-3 tilt-pos-1">
              <img src={post.image} alt={post.title} className="w-full h-[420px] object-cover" />
            </div>
          )}

          <div className="card-panel p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${post.author}&backgroundColor=transparent`}
                  alt={post.author}
                  className="w-14 h-14 rounded-full border-2 border-border bg-surface-secondary"
                />
                <div>
                  <p className="text-sm text-text-muted">Written by</p>
                  <p className="font-semibold text-text-main">{post.author}</p>
                  <p className="text-xs text-text-subtle">{new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              
              {user && post.author_id === user.id && (
                <div className="flex flex-col gap-2 text-right">
                  <Link to={`/edit/${id}`} className="text-sm font-medium text-accent hover:underline">Edit</Link>
                  <button onClick={handleDeletePost} className="text-sm font-medium text-red-500 hover:underline">Delete</button>
                </div>
              )}
            </div>

            <Link to="/write" className="btn-primary btn-tactile w-full">
              <Bookmark className="w-4 h-4" />
              Write something similar
            </Link>
          </div>
        </div>
      </motion.article>
    </div>
  );
}