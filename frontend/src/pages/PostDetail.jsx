import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bookmark, Heart, MessageCircle, Eye, Clock, Tag } from 'lucide-react';
import { topicSlug } from '../data/topics';
import { CommentsSection } from '../components/CommentsSection';

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = document.getElementById('main-scroll-container');
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const pct = Math.min(100, (scrollTop / (scrollHeight - clientHeight)) * 100);
      setProgress(pct);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="reading-progress" style={{ width: `${progress}%` }} />
  );
}

export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const user = JSON.parse(localStorage.getItem('bms_user') || 'null');
  const token = localStorage.getItem('bms_token');

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      const r = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error('Failed to delete');
      navigate('/');
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/posts/${id}`)
      .then((r) => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
      .then((data) => { setPost(data); setLikes(data.likes || 0); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  /* — estimated reading time — */
  const readingTime = post ? Math.max(1, Math.ceil((post.content || '').split(' ').length / 200)) : null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] gap-4">
        <div className="editor-loader" />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-subtle)', letterSpacing: '0.08em' }}>
          opening story…
        </p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ marginTop: '3rem' }}>
        <div style={{ padding: '2.5rem', background: 'var(--color-warm-white)', borderRadius: '1rem', color: 'var(--color-muted)', boxShadow: 'var(--shadow-soft)' }}>
          <p>{error || 'Post not found.'}</p>
          <Link to="/" className="btn-secondary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
            ← Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ReadingProgress />

      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '2.5rem' }}
        >
          <Link
            to="/"
            className="flex items-center gap-1.5"
            style={{
              color: 'var(--color-subtle)',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.04em',
              transition: 'color 0.2s',
            }}
          >
            <ArrowLeft style={{ width: 13, height: 13 }} />
            back to feed
          </Link>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Category */}
          <Link
            to={`/topics/${topicSlug(post.category)}`}
            className="category-pill"
            style={{ marginBottom: '1.5rem', display: 'inline-flex', textDecoration: 'none' }}
          >
            {post.category}
          </Link>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 400,
              color: 'var(--color-charcoal)',
              letterSpacing: '-0.04em',
              lineHeight: 1.08,
              marginBottom: '1.25rem',
            }}
          >
            {post.title}
          </h1>

          {/* Deck / subtitle */}
          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--color-muted)',
              lineHeight: 1.65,
              marginBottom: '2rem',
              fontWeight: 300,
            }}
          >
            {post.description}
          </p>

          {/* Metadata row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap',
              paddingBottom: '1.5rem',
              marginBottom: '2rem',
              borderBottom: '1px solid var(--color-border-light)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <img
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${post.author}&backgroundColor=transparent`}
                alt={post.author}
                style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--color-border)', background: 'var(--color-parchment)' }}
              />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-charcoal)', lineHeight: 1.2 }}>{post.author}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}>
                  {new Date(post.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div style={{ height: '24px', width: '1px', background: 'var(--color-border)' }} />

            <div className="flex items-center gap-1.5" style={{ color: 'var(--color-subtle)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
              <Clock style={{ width: 12, height: 12 }} />
              {readingTime} min read
            </div>

            <div className="flex items-center gap-4" style={{ marginLeft: 'auto' }}>
              <button
                onClick={() => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1); }}
                className="flex items-center gap-1.5 btn-tactile"
                style={{ color: liked ? 'var(--color-rust)' : 'var(--color-subtle)', fontSize: '0.78rem', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Heart style={{ width: 14, height: 14, fill: liked ? 'currentColor' : 'none' }} />
                {likes}
              </button>
              <span className="flex items-center gap-1.5" style={{ color: 'var(--color-subtle)', fontSize: '0.78rem' }}>
                <MessageCircle style={{ width: 14, height: 14 }} />
                {post.comments || 0}
              </span>
              <span className="flex items-center gap-1.5" style={{ color: 'var(--color-subtle)', fontSize: '0.78rem' }}>
                <Eye style={{ width: 14, height: 14 }} />
                {Math.floor(Math.random() * 900) + 100}
              </span>
            </div>

            {/* Author controls */}
            {user && post.author_id === user.id && (
              <div className="flex items-center gap-3" style={{ marginLeft: '0.5rem' }}>
                <Link to={`/edit/${id}`} style={{ fontSize: '0.78rem', color: 'var(--color-gold)', fontWeight: 500, textDecoration: 'none' }}>Edit</Link>
                <button onClick={handleDelete} style={{ fontSize: '0.78rem', color: '#C45C2C', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
              </div>
            )}
          </div>

          {/* Hero image */}
          {post.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              style={{ borderRadius: '1.25rem', overflow: 'hidden', marginBottom: '2.5rem', boxShadow: 'var(--shadow-medium)' }}
            >
              <img
                src={post.image}
                alt={post.title}
                style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', display: 'block' }}
              />
            </motion.div>
          )}

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2" style={{ marginBottom: '2rem' }}>
              {post.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  <Tag style={{ width: 9, height: 9 }} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Body */}
          <div
            className="prose-premium article-typography"
            style={{
              background: 'var(--color-warm-white)',
              borderRadius: '1.25rem',
              padding: '2.5rem 2rem',
              boxShadow: 'var(--shadow-xs)',
              marginBottom: '2.5rem',
            }}
          >
            <p className="text-xl leading-relaxed" style={{ whiteSpace: 'pre-wrap', color: 'var(--color-ink)' }}>
              {post.content}
            </p>
          </div>

          {/* Write CTA */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              background: 'var(--color-warm-white)',
              borderRadius: '1rem',
              boxShadow: 'var(--shadow-xs)',
              marginBottom: '3rem',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-charcoal)', marginBottom: '0.2rem' }}>
                Something on your mind?
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                Share your own perspective with the community.
              </p>
            </div>
            <Link to="/write" className="btn-primary" style={{ fontSize: '0.8rem', flexShrink: 0 }}>
              <Bookmark style={{ width: 13, height: 13 }} />
              Write a story
            </Link>
          </div>

          {/* Comments */}
          <CommentsSection postId={post.id} />
        </motion.article>
      </div>
    </>
  );
}