import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PostCard } from '../components/post/PostCard';
import { BookMarked, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ── animation variants ── */
const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } },
};

/* ── Loader ── */
function EditorLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] gap-4">
      <div className="editor-loader" />
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--color-subtle)',
          letterSpacing: '0.08em',
        }}
      >
        loading stories…
      </p>
    </div>
  );
}

/* ── Section label ── */
function SectionLabel({ index, label, sub }) {
  return (
    <div className="flex items-end gap-4 mb-6">
      <div>
        <p className="section-number mb-1">§ {String(index).padStart(2, '0')}</p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)',
            fontWeight: 400,
            color: 'var(--color-charcoal)',
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
          }}
        >
          {label}
        </h2>
      </div>
      {sub && (
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-muted)',
            lineHeight: 1.5,
            maxWidth: '380px',
            paddingBottom: '2px',
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then((r) => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <EditorLoader />;

  /* — slice posts for layout — */
  const [featured, ...rest] = posts;
  const medium   = rest.slice(0, 2);
  const compact  = rest.slice(2, 5);
  const feedPosts = posts.slice(5, 13);

  return (
    <div>
      {/* ── Hero masthead ── */}
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{ marginBottom: '3rem' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              fontWeight: 500,
              color: 'var(--color-gold)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            // The Daily Stack
          </span>
          <div className="accent-line" style={{ flex: 1 }} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: 'var(--color-subtle)',
              letterSpacing: '0.08em',
            }}
          >
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <h1
          className="text-gradient-warm"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            fontWeight: 400,
            letterSpacing: '-0.04em',
            lineHeight: 1.0,
            maxWidth: '820px',
            marginBottom: '1.25rem',
          }}
        >
          Stories arranged<br />
          <em style={{ fontStyle: 'italic', opacity: 0.75 }}>like a magazine spread.</em>
        </h1>

        <div className="flex items-center gap-4 flex-wrap">
          <p style={{ fontSize: '1rem', color: 'var(--color-muted)', lineHeight: 1.6, maxWidth: '520px' }}>
            Curated writing on technology, design & culture — intentionally laid out, not algorithm-sorted.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.3rem 0.75rem',
                background: 'var(--color-parchment)',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--color-muted)',
                letterSpacing: '0.05em',
              }}
            >
              <Sparkles style={{ width: 10, height: 10, color: 'var(--color-gold)' }} />
              {posts.length} stories
            </span>
            <Link to="/write" className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
              Write <ArrowRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ── Error state ── */}
      {error && (
        <div
          style={{
            padding: '2.5rem',
            borderRadius: '1rem',
            background: 'var(--color-warm-white)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-muted)',
            textAlign: 'center',
            fontSize: '0.9rem',
          }}
        >
          {error}
        </div>
      )}

      {/* ── Empty state ── */}
      {!error && posts.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', paddingTop: '6rem' }}>
          <BookMarked style={{ width: 48, height: 48, color: 'var(--color-border)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--color-muted)', fontSize: '1rem' }}>No stories yet — check back soon.</p>
        </motion.div>
      )}

      {!error && posts.length > 0 && (
        <>
          {/* ── § 01 — Magazine spread ── */}
          <motion.section variants={container} initial="hidden" animate="visible" style={{ marginBottom: '4rem' }}>
            <SectionLabel index={1} label="This week's cover" sub="The most significant read right now." />

            {/* Magazine grid: 1 large + 2 medium */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridTemplateRows: 'auto',
                gap: '1.25rem',
              }}
              className="magazine-spread"
            >
              {/* Featured — spans 2 cols */}
              {featured && (
                <motion.div variants={item} style={{ gridColumn: '1 / 3' }}>
                  <PostCard post={featured} index={0} featured />
                </motion.div>
              )}

              {/* Right column — 2 medium stacked */}
              <motion.div variants={item} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {medium.map((post, i) => (
                  <div key={post.id} style={{ flex: 1 }}>
                    <PostCard post={post} index={i + 1} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Compact horizontal strip ── */}
            {compact.length > 0 && (
              <motion.div
                variants={item}
                style={{
                  marginTop: '1.5rem',
                  background: 'var(--color-warm-white)',
                  borderRadius: '1rem',
                  padding: '0.5rem 1.5rem',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                <div className="flex items-center gap-2 pt-2 pb-1" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  <TrendingUp style={{ width: 11, height: 11, color: 'var(--color-gold)' }} />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      fontWeight: 500,
                      color: 'var(--color-gold)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    // Also reading
                  </span>
                </div>
                {compact.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} compact />
                ))}
              </motion.div>
            )}
          </motion.section>

          {/* ── Divider ── */}
          <div className="divider-playful" />

          {/* ── § 02 — Full feed ── */}
          {feedPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ marginTop: '0.5rem' }}
            >
              <SectionLabel index={2} label="The full story wall" sub="Scroll through — each piece earns its place." />

              {/* 3-column responsive grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {feedPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.1 + i * 0.06 }}
                  >
                    <PostCard post={post} index={i} />
                  </motion.div>
                ))}
              </div>

              {posts.length > 13 && (
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <Link to="/explore" className="btn-secondary" style={{ gap: '0.5rem' }}>
                    View all stories <ArrowRight style={{ width: 14, height: 14 }} />
                  </Link>
                </div>
              )}
            </motion.section>
          )}
        </>
      )}
    </div>
  );
}
