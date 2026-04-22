import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PostCard } from '../components/post/PostCard';
import { Bookmark, ArrowRight } from 'lucide-react';

export function Bookmarks() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    // Get bookmarks from localStorage (in a real app, this would be from a database)
    const saved = localStorage.getItem('bookmarkedPosts');
    if (saved) {
      try {
        setBookmarkedPosts(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading bookmarks:', e);
      }
    }
  }, []);

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

  return (
    <div className="mt-8 md:mt-12">
      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-16 md:mb-20 relative shape-blob-top"
      >
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.8fr] gap-8 xl:gap-12 items-end">
          <motion.div variants={itemVariants} className="max-w-2xl">
            <div className="micro-label mb-4">📌 Saved</div>
            
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-text-main leading-tight mb-6">
              Your <span className="text-gradient-warm">Bookmarks</span>
            </h1>
            
            <p className="text-lg md:text-xl text-text-muted max-w-2xl leading-relaxed font-light">
              Your collection of saved stories. Come back to these whenever you want.
            </p>
          </motion.div>

          <motion.aside variants={itemVariants} className="card-panel depth-layer-2 p-6 md:p-8 tilt-neg-1">
            <div className="signature-badge top-left static">Saved</div>
            <div className="micro-label mb-3">Quiet stack</div>
            <p className="text-xl font-display font-semibold text-text-main leading-snug mb-3">A place for the pieces you actually want to return to.</p>
            <p className="text-text-muted leading-relaxed mb-5">Bookmarks gets the same editorial treatment so it feels like part of the system, not an empty dead-end.</p>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
              Keep collecting <ArrowRight className="w-4 h-4" />
            </div>
          </motion.aside>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="divider-playful my-16" />

      {/* Bookmarked Posts */}
      {bookmarkedPosts.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {bookmarkedPosts.map((post, i) => (
            <motion.div 
              key={post.id} 
              variants={itemVariants}
              className={i % 2 === 0 ? 'tilt-neg-1' : 'tilt-pos-1'}
            >
              <PostCard post={post} index={i} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Bookmark className="w-16 h-16 text-text-subtle/30 mx-auto mb-4" />
          </motion.div>
          <p className="text-text-muted text-lg">No bookmarks yet. Start saving stories!</p>
        </motion.div>
      )}
    </div>
  );
}
