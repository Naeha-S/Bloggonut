import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PostCard } from '../components/post/PostCard';
import { Compass, Loader, Sparkles, Layers3, ChevronRight } from 'lucide-react';
import { TOPICS } from '../data/topics';

export function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        console.log('[Explore] posts received:', Array.isArray(data) ? data.length : 0, data);
        setPosts(data);
      } catch (err) {
        console.error('[Explore] fetch error:', err);
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
    <div className="mt-4 md:mt-6 pb-8 space-y-8">
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-6 items-start"
      >
        <motion.div variants={itemVariants} className="card-panel depth-layer-3 p-6 md:p-8 relative overflow-visible">
          <div className="signature-badge top-left">All Posts</div>
          <div className="micro-label mb-4">🔍 Discover</div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-text-main leading-tight max-w-3xl">
            Explore stories without the blank page drama.
          </h1>
          <p className="mt-4 text-base md:text-lg text-text-muted max-w-2xl leading-relaxed">
            The browse view now starts with content immediately, then opens into a full card grid instead of a tall empty stack.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Chip label={`${posts.length} stories`} icon={<Sparkles className="w-3.5 h-3.5" />} />
            <Chip label="Card grid" icon={<Layers3 className="w-3.5 h-3.5" />} />
            <Chip label="Topic filters" icon={<ChevronRight className="w-3.5 h-3.5" />} />
          </div>
        </motion.div>

        <motion.aside variants={itemVariants} className="card-panel depth-layer-2 p-5 md:p-6 space-y-4">
          <div className="micro-label mb-1">Quick filters</div>
          <p className="text-xl font-display font-semibold text-text-main leading-snug">Jump to one topic or sample a few recent posts.</p>

          <div className="grid grid-cols-2 gap-2">
            {TOPICS.map((topic) => (
              <Link
                key={topic.slug}
                to={`/topics/${topic.slug}`}
                className="rounded-2xl border border-border bg-surface-secondary/70 px-3 py-3 text-sm font-semibold text-text-main hover:text-accent hover:border-accent/40 transition-colors"
              >
                <span className="block uppercase tracking-[0.14em] text-[11px] text-text-subtle mb-1">{topic.label}</span>
                <span className="line-clamp-2 text-xs font-normal text-text-muted">{topic.description}</span>
              </Link>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            {previewPosts.map((post, index) => (
              <div key={post.id} className="flex items-center gap-3 rounded-2xl bg-surface-secondary/65 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-accent text-xs font-bold">0{index + 1}</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-main line-clamp-1">{post.title}</p>
                  <p className="text-xs text-text-muted">{post.category}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.aside>
      </motion.section>

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
              <div className="micro-label mb-2">All stories</div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-text-main">A denser card wall, no empty lead-in</h2>
            </div>
            <p className="text-text-muted max-w-xl">The feed starts immediately and uses a responsive grid so 25 posts feel intentional instead of stacked oddly.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className={i === 0 ? 'md:col-span-2 xl:col-span-2' : ''}
              >
                <PostCard post={post} index={i} featured={i === 0} />
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
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Compass className="w-16 h-16 text-text-subtle/30 mx-auto mb-4" />
          </motion.div>
          <p className="text-text-muted text-lg">No stories available yet.</p>
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
