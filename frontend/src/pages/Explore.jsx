import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PostCard } from '../components/post/PostCard';
import { Compass, ArrowRight } from 'lucide-react';
import { TOPICS } from '../data/topics';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

function EditorLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] gap-4">
      <div className="editor-loader" />
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-subtle)', letterSpacing: '0.08em' }}>
        loading stories…
      </p>
    </div>
  );
}

export function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then((r) => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <EditorLoader />;

  const filteredPosts = activeFilter === 'all'
    ? posts
    : posts.filter((p) => p.category?.toLowerCase() === activeFilter);

  const [hero, ...rest] = filteredPosts;

  return (
    <div>
      {/* ── Masthead ── */}
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        style={{ marginBottom: '2.75rem' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 500, color: 'var(--color-gold)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            // Explore
          </span>
          <div className="accent-line" style={{ flex: 1 }} />
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
            fontWeight: 400,
            color: 'var(--color-charcoal)',
            letterSpacing: '-0.035em',
            lineHeight: 1.1,
            marginBottom: '1rem',
          }}
        >
          Browse the full archive
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-muted)', lineHeight: 1.65, maxWidth: '480px' }}>
          {posts.length} stories across {TOPICS.length} topics. Filter by category or scroll the complete wall.
        </p>
      </motion.header>

      {/* ── Topic filter chips ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-2"
        style={{ marginBottom: '2.5rem' }}
      >
        <button
          onClick={() => setActiveFilter('all')}
          className={`tag-chip ${activeFilter === 'all' ? 'active' : ''}`}
          style={{ fontSize: '0.65rem' }}
        >
          All ({posts.length})
        </button>
        {TOPICS.map((topic) => {
          const count = posts.filter((p) => p.category?.toLowerCase() === topic.slug).length;
          return (
            <button
              key={topic.slug}
              onClick={() => setActiveFilter(topic.slug)}
              className={`tag-chip ${activeFilter === topic.slug ? 'active' : ''}`}
              style={{ fontSize: '0.65rem' }}
            >
              {topic.label} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </motion.div>

      {/* ── Error ── */}
      {error && (
        <div style={{ padding: '2rem', background: 'var(--color-warm-white)', borderRadius: '1rem', color: 'var(--color-muted)', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* ── Empty ── */}
      {!error && filteredPosts.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', paddingTop: '5rem' }}>
          <Compass style={{ width: 48, height: 48, color: 'var(--color-border)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--color-muted)' }}>No stories in this topic yet.</p>
        </motion.div>
      )}

      {!error && filteredPosts.length > 0 && (
        <motion.div variants={container} initial="hidden" animate="visible">
          {/* Hero — first post spans full width */}
          {hero && (
            <motion.div variants={item} style={{ marginBottom: '1.5rem' }}>
              <PostCard post={hero} index={0} featured />
            </motion.div>
          )}

          {/* Two-column + variable grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {rest.map((post, i) => (
              <motion.div key={post.id} variants={item}>
                <PostCard post={post} index={i + 1} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
