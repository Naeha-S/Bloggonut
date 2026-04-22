import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PostCard } from '../components/post/PostCard';
import { Flame, Loader, ArrowRight, Sparkles, Layers3, ChevronRight } from 'lucide-react';

export function Trending() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        console.log('[Trending] posts received:', Array.isArray(data) ? data.length : 0, data);
        // Sort by likes to show trending posts
        const sorted = [...data].sort((a, b) => (b.likes || 0) - (a.likes || 0));
        console.log('[Trending] sorted preview:', sorted.slice(0, 8).map((post) => ({ id: post.id, title: post.title, likes: post.likes })));
        setPosts(sorted);
      } catch (err) {
        console.error('[Trending] fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const previewPosts = posts.slice(0, 3);

  return (
    <div className="mt-4 md:mt-6 pb-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8 relative"
      >
        <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-6 items-start">
          <motion.div variants={itemVariants} className="card-panel depth-layer-3 p-6 md:p-8 relative overflow-visible">
            <div className="signature-badge top-left">Trending</div>
            <div className="micro-label mb-4">🔥 On Fire</div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-text-main leading-tight max-w-3xl">
              Trending stories with a sharper, tighter stack.
            </h1>
            <p className="mt-4 text-base md:text-lg text-text-muted max-w-2xl leading-relaxed">
              The top stories are sorted by engagement, but the page is laid out to show more than two cards right away.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Chip label={`${posts.length} stories`} icon={<Sparkles className="w-3.5 h-3.5" />} />
              <Chip label="Sorted by likes" icon={<Flame className="w-3.5 h-3.5" />} />
              <Chip label="Stacked feed" icon={<Layers3 className="w-3.5 h-3.5" />} />
            </div>
          </motion.div>

          <motion.aside variants={itemVariants} className="card-panel depth-layer-2 p-5 md:p-6 tilt-pos-1 space-y-4">
            <div className="micro-label mb-1">Momentum rail</div>
            <p className="text-xl font-display font-semibold text-text-main leading-snug">A compact rail gives the page an editorial pulse.</p>
            <div className="space-y-3">
              {previewPosts.map((post, index) => (
                <div key={post.id} className="flex items-center gap-3 rounded-2xl bg-surface-secondary/65 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-accent text-xs font-bold">0{index + 1}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-main line-clamp-1">{post.title}</p>
                    <p className="text-xs text-text-muted">{post.likes || 0} likes</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </motion.div>

      <div className="divider-playful my-8 md:my-10" />

      {error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-12 rounded-3xl bg-surface border border-border text-text-muted text-center shadow-soft"
        >
          <p className="text-base">{error}</p>
        </motion.div>
      ) : (
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="micro-label mb-2">Trending stack</div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-text-main">What people are reading now</h2>
            </div>
            <p className="text-text-muted max-w-xl">The feed is intentionally dense so you can scan several posts without scrolling through empty air.</p>
          </div>

          <div className="space-y-4 cards-overlap">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className={`${i % 2 === 0 ? 'offset-left' : 'offset-right'} relative`}
                style={{ '--z-index': posts.length - i }}
              >
                <div className={`grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-4 items-start ${i % 2 === 0 ? '' : 'xl:[grid-template-columns:1.1fr_0.9fr]'}`}>
                  <div className={i % 2 === 0 ? 'tilt-neg-2' : 'tilt-pos-2'}>
                    <PostCard post={post} index={i} compact />
                  </div>
                  <div className="card-panel depth-layer-1 p-5 md:p-6 space-y-3">
                    <div className="micro-label">Trending note</div>
                    <p className="text-xl font-display font-semibold text-text-main leading-tight">
                      {post.title}
                    </p>
                    <p className="text-text-muted leading-relaxed line-clamp-4">
                      {post.description}
                    </p>
                    <div className="organic-line my-2" />
                    <div className="flex items-center justify-between text-sm text-text-muted">
                      <span>{post.author}</span>
                      <span>{post.likes || 0} likes</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {!error && posts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame className="w-16 h-16 text-text-subtle/30 mx-auto mb-4" />
          </motion.div>
          <p className="text-text-muted text-lg">No trending stories yet.</p>
        </motion.div>
      )}
    </div>
  );
}

function Chip({ label, icon }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-main shadow-soft">
      <span className="text-accent">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
