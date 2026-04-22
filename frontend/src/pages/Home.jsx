import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PostCard } from '../components/post/PostCard';
import { BookMarked, Loader, ArrowRight, Compass, Flame, Bookmark, Sparkles, ChevronRight } from 'lucide-react';

export function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        console.log('[Home] posts received:', Array.isArray(data) ? data.length : 0, data);
        setPosts(data);
      } catch (err) {
        console.error('[Home] fetch error:', err);
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

  const spotlightPosts = posts.slice(0, 4);
  const feedPosts = posts.slice(0, 8);

  return (
    <div className="mt-4 md:mt-6 pb-8">
      {!error && posts.length > 0 && (
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative shape-blob-top"
        >
          <div className="grid grid-cols-1 xl:grid-cols-[1.12fr_0.88fr] gap-8 xl:gap-12 items-start">
            <div className="space-y-6">
              <motion.div variants={itemVariants} className="card-panel depth-layer-3 p-6 md:p-8 tilt-neg-1 relative overflow-visible">
                <div className="signature-badge top-left">Daily Stack</div>
                <div className="micro-label mb-4">A hand-built front page</div>
                <h1 className="font-display text-5xl md:text-6xl font-semibold text-text-main leading-tight max-w-3xl">
                  Stories arranged like a magazine spread, not a form.
                </h1>
                <p className="mt-5 text-lg text-text-muted leading-relaxed max-w-2xl">
                  Scroll through the stacked feed below. The layout stays compact, editorial, and fully populated above the fold.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <LinkChip label="Featured" icon={<Sparkles className="w-3.5 h-3.5" />} />
                  <LinkChip label={`All stories ${posts.length}`} icon={<ChevronRight className="w-3.5 h-3.5" />} />
                  <LinkChip label="Saved notes" icon={<Bookmark className="w-3.5 h-3.5" />} />
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <StatTile label="Fresh posts" value={String(posts.length)} />
                  <StatTile label="Top read" value={posts[0]?.category || 'Design'} />
                  <StatTile label="Vibe" value="Warm + tactile" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="card-panel depth-layer-2 p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="micro-label mb-1">Spotlight</div>
                    <p className="text-xl font-display font-semibold text-text-main">The stack that starts immediately.</p>
                  </div>
                  <div className="signature-badge static">Now</div>
                </div>

                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-4 min-w-max pr-6">
                    {spotlightPosts.map((post, index) => (
                      <div key={post.id} className={`w-[280px] sm:w-[300px] ${index % 2 === 0 ? 'tilt-neg-1' : 'tilt-pos-1'}`}>
                        <PostCard post={post} index={index} compact />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.aside variants={itemVariants} className="space-y-6 xl:sticky xl:top-24 self-start">
              <div className="card-panel depth-layer-2 p-6 md:p-7 tilt-pos-1">
                <div className="micro-label mb-2">Reading rail</div>
                <p className="text-2xl font-display font-semibold text-text-main leading-tight">Use the right side for context, not empty space.</p>
                <p className="mt-4 text-text-muted leading-relaxed">
                  It keeps the page feeling authored. The main feed stays stacked and the supporting details sit beside it instead of pushing everything downward.
                </p>
              </div>

              <div className="card-panel depth-layer-1 p-5 md:p-6">
                <div className="micro-label mb-3">Three quick picks</div>
                <div className="space-y-3">
                  {spotlightPosts.slice(0, 3).map((post, index) => (
                    <div key={post.id} className="flex items-start gap-3 rounded-2xl bg-surface-secondary/65 p-3">
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-surface text-accent text-xs font-bold">
                        0{index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-text-main leading-snug line-clamp-2">{post.title}</p>
                        <p className="text-xs text-text-muted mt-1">{post.category} • {post.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>
        </motion.section>
      )}

      <div className="divider-playful my-10 md:my-12" />

      {!error && feedPosts.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="space-y-5"
        >
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="micro-label mb-2">Stacked feed</div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-text-main">Browse the full story wall</h2>
            </div>
            <p className="text-text-muted max-w-xl">
              A denser stacked layout keeps the page alive and lets each card feel like part of a magazine spread.
            </p>
          </div>

          <div className="space-y-5 cards-overlap">
            {feedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className={`${index % 2 === 0 ? 'offset-left' : 'offset-right'} relative`}
                style={{ '--z-index': feedPosts.length - index }}
              >
                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_0.8fr] gap-5 items-start">
                  <div className={index % 2 === 0 ? 'tilt-neg-1' : 'tilt-pos-1'}>
                    <PostCard post={post} index={index} featured={index === 0} />
                  </div>
                  <div className="card-panel depth-layer-1 p-5 md:p-6 space-y-4">
                    <div className="micro-label">Story note</div>
                    <p className="text-2xl font-display font-semibold text-text-main leading-tight">
                      {index === 0 ? 'Lead with the strongest story.' : 'Let the next card sit beside the main one.'}
                    </p>
                    <p className="text-text-muted leading-relaxed">
                      This secondary panel keeps the rhythm uneven and prevents the page from reading like a default grid.
                    </p>
                    <div className="organic-line my-2" />
                    <div className="flex items-center justify-between text-sm text-text-muted">
                      <span>{post.author}</span>
                      <span>{post.category}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-12 rounded-3xl bg-surface border border-border text-text-muted text-center shadow-soft"
        >
          <p className="text-base">{error}</p>
        </motion.div>
      )}

      {/* Empty State */}
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
            <BookMarked className="w-16 h-16 text-text-subtle/30 mx-auto mb-4" />
          </motion.div>
          <p className="text-text-muted text-lg">No stories yet. Check back soon!</p>
        </motion.div>
      )}
    </div>
  );
}

function LinkChip({ label, icon }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-main shadow-soft">
      <span className="text-accent">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="rounded-2xl bg-surface-secondary/75 border border-border px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.14em] text-text-subtle font-semibold">{label}</div>
      <div className="mt-1 font-display text-lg font-semibold text-text-main">{value}</div>
    </div>
  );
}
