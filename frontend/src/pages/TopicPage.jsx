import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PostCard } from '../components/post/PostCard';
import { TOPICS, getTopic, topicSlug } from '../data/topics';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

export function TopicPage() {
  const { topic: topicParam } = useParams();
  const topic = getTopic(topicParam);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then((r) => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = useMemo(() => {
    if (!topic) return [];
    return posts.filter((p) => topicSlug(p.category) === topic.slug);
  }, [posts, topic]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] gap-4">
        <div className="editor-loader" />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-subtle)', letterSpacing: '0.08em' }}>
          loading stories…
        </p>
      </div>
    );
  }

  /* Unknown topic */
  if (!topic) {
    return (
      <div>
        <Link to="/explore" className="flex items-center gap-1.5" style={{ color: 'var(--color-subtle)', textDecoration: 'none', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '2rem', display: 'inline-flex' }}>
          <ArrowLeft style={{ width: 13, height: 13 }} />
          back to explore
        </Link>
        <div style={{ background: 'var(--color-warm-white)', borderRadius: '1.25rem', padding: '2.5rem', boxShadow: 'var(--shadow-soft)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, color: 'var(--color-charcoal)', marginBottom: '1rem' }}>
            Topic not found.
          </h1>
          <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem' }}>Browse one of the supported topics:</p>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <Link key={t.slug} to={`/topics/${t.slug}`} className="tag-chip" style={{ fontSize: '0.7rem' }}>{t.label}</Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const [hero, ...rest] = filteredPosts;

  return (
    <div>
      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: '2rem' }}>
        <Link to="/explore" className="flex items-center gap-1.5" style={{ color: 'var(--color-subtle)', textDecoration: 'none', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', display: 'inline-flex' }}>
          <ArrowLeft style={{ width: 13, height: 13 }} />
          back to explore
        </Link>
      </motion.div>

      {/* Topic hero with cover image */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          position: 'relative',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          height: '240px',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-medium)',
        }}
      >
        <img src={topic.image} alt={topic.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(28,25,23,0.8) 0%, rgba(28,25,23,0.3) 70%, transparent 100%)',
        }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2rem 2.5rem' }}>
          <span className="category-pill" style={{ marginBottom: '0.75rem', width: 'fit-content' }}>{topic.label}</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', fontWeight: 400, color: '#FDFAF5', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '0.5rem' }}>
            {topic.label} stories
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(253,250,245,0.7)', maxWidth: '400px', lineHeight: 1.55 }}>
            {topic.description}
          </p>
          <p style={{ marginTop: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(253,250,245,0.5)', letterSpacing: '0.08em' }}>
            {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'} found
          </p>
        </div>
      </motion.div>

      {/* Other topics switcher */}
      <div className="flex flex-wrap gap-1.5" style={{ marginBottom: '2.5rem' }}>
        {TOPICS.map((t) => (
          <Link
            key={t.slug}
            to={`/topics/${t.slug}`}
            className={`tag-chip ${t.slug === topic.slug ? 'active' : ''}`}
            style={{ fontSize: '0.65rem' }}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '2rem', background: 'var(--color-warm-white)', borderRadius: '1rem', color: 'var(--color-muted)' }}>
          {error}
        </div>
      )}

      {/* Empty */}
      {!error && filteredPosts.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <p style={{ color: 'var(--color-muted)' }}>No stories in this topic yet.</p>
        </motion.div>
      )}

      {/* Cards */}
      {!error && filteredPosts.length > 0 && (
        <motion.div variants={container} initial="hidden" animate="visible">
          {hero && (
            <motion.div variants={item} style={{ marginBottom: '1.5rem' }}>
              <PostCard post={hero} index={0} featured />
            </motion.div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
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
