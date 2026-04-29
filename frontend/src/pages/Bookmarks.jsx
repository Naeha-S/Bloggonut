import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PostCard } from '../components/post/PostCard';
import { Bookmark, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

export function Bookmarks() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedPosts');
    if (saved) {
      try { setBookmarkedPosts(JSON.parse(saved)); } catch {}
    }
  }, []);

  return (
    <div>
      {/* Masthead */}
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        style={{ marginBottom: '2.75rem' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 500, color: 'var(--color-gold)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            // Saved stories
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
          Your bookmarks
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-muted)', lineHeight: 1.65, maxWidth: '420px' }}>
          {bookmarkedPosts.length > 0
            ? `${bookmarkedPosts.length} stories saved for later reading.`
            : 'Stories you save will appear here.'}
        </p>
      </motion.header>

      {/* Empty state */}
      {bookmarkedPosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', paddingTop: '5rem', paddingBottom: '5rem' }}
        >
          <Bookmark style={{ width: 48, height: 48, color: 'var(--color-border)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem' }}>No bookmarks yet — start saving stories.</p>
          <Link to="/" className="btn-primary" style={{ fontSize: '0.8rem', gap: '0.375rem' }}>
            Browse stories <ArrowRight style={{ width: 13, height: 13 }} />
          </Link>
        </motion.div>
      )}

      {/* Grid */}
      {bookmarkedPosts.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}
        >
          {bookmarkedPosts.map((post, i) => (
            <motion.div key={post.id} variants={item}>
              <PostCard post={post} index={i} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
