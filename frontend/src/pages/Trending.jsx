import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PostCard } from '../components/post/PostCard';
import { Flame, TrendingUp, ArrowRight } from 'lucide-react';
import { TOPICS } from '../data/topics';
import { Link } from 'react-router-dom';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
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

export function Trending() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then((r) => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
      .then((data) => setPosts([...data].sort((a, b) => (b.likes || 0) - (a.likes || 0))))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <EditorLoader />;

  const [hero, ...rest] = posts;
  const topThree = posts.slice(0, 3);

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
            // Trending now
          </span>
          <div className="accent-line" style={{ flex: 1 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--color-subtle)' }}>
            sorted by engagement
          </span>
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
          What people are<br />
          <em style={{ fontStyle: 'italic', opacity: 0.65 }}>reading right now.</em>
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-muted)', lineHeight: 1.65, maxWidth: '440px' }}>
          Ranked by likes and engagement. The pieces resonating most with readers today.
        </p>
      </motion.header>

      {/* ── Podium — top 3 ── */}
      {!error && topThree.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'var(--color-warm-white)',
            borderRadius: '1.25rem',
            padding: '1.25rem 1.5rem',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-soft)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '0.5rem', flexShrink: 0 }}>
            <TrendingUp style={{ width: 14, height: 14, color: 'var(--color-gold)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Top right now
            </span>
          </div>

          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '0',
              borderLeft: '1px solid var(--color-border-light)',
              paddingLeft: '1rem',
            }}
          >
            {topThree.map((post, i) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="flex items-center gap-3 py-2 group"
                style={{
                  textDecoration: 'none',
                  borderRight: i < topThree.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                  paddingRight: '1rem',
                  paddingLeft: i > 0 ? '1rem' : 0,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    color: i === 0 ? 'var(--color-gold)' : 'var(--color-border)',
                    lineHeight: 1,
                    minWidth: '2rem',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <p
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      color: 'var(--color-charcoal)',
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      transition: 'color 0.2s',
                    }}
                    className="group-hover:text-[color:var(--color-gold)]"
                  >
                    {post.title}
                  </p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                    {post.likes || 0} likes
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Error ── */}
      {error && (
        <div style={{ padding: '2rem', background: 'var(--color-warm-white)', borderRadius: '1rem', color: 'var(--color-muted)', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* ── Empty ── */}
      {!error && posts.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', paddingTop: '5rem' }}>
          <Flame style={{ width: 48, height: 48, color: 'var(--color-border)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--color-muted)' }}>No trending stories yet.</p>
        </motion.div>
      )}

      {/* ── Cards ── */}
      {!error && posts.length > 0 && (
        <motion.div variants={container} initial="hidden" animate="visible">
          {hero && (
            <motion.div variants={item} style={{ marginBottom: '1.5rem' }}>
              <PostCard post={hero} index={0} featured />
            </motion.div>
          )}
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
