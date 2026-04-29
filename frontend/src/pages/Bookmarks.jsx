import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PostCard } from '../components/post/PostCard';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Bookmarks() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedPosts');
    if (!saved) return;

    try {
      setBookmarkedPosts(JSON.parse(saved));
    } catch {
      setBookmarkedPosts([]);
    }
  }, []);

  return (
    <div>
      <header className="newsprint-header">
        <div className="mb-4 flex items-center gap-3">
          <span className="news-kicker">Saved desk</span>
          <div className="accent-line flex-1" />
        </div>
        <h1 className="newsprint-title">Your bookmarked stories.</h1>
        <p className="newsprint-dek">
          {bookmarkedPosts.length > 0
            ? `${bookmarkedPosts.length} pieces saved for later reading.`
            : 'Stories you archive for later will appear here.'}
        </p>
      </header>

      {bookmarkedPosts.length === 0 ? (
        <div className="border border-[#111111] px-5 py-12 text-center">
          <Bookmark className="mx-auto h-10 w-10 text-[#111111]" strokeWidth={1.5} />
          <p className="mt-4 font-serif text-base text-[#525252]">No bookmarks yet.</p>
          <Link to="/" className="btn-primary mt-6">
            Browse stories
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {bookmarkedPosts.map((post, index) => (
            <motion.div key={post.id} variants={item}>
              <PostCard post={post} index={index} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
