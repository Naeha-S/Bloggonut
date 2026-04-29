import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { PostCard } from '../components/post/PostCard';
import { TOPICS } from '../data/topics';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      })
      .then(setPosts)
      .catch((fetchError) => setError(fetchError.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = activeFilter === 'all'
    ? posts
    : posts.filter((post) => post.category?.toLowerCase() === activeFilter);

  const [hero, ...rest] = filteredPosts;

  return (
    <div>
      <header className="newsprint-header">
        <div className="mb-4 flex items-center gap-3">
          <span className="news-kicker">Archive</span>
          <div className="accent-line flex-1" />
        </div>
        <h1 className="newsprint-title">Browse the full archive.</h1>
        <p className="newsprint-dek">
          {posts.length} stories across {TOPICS.length} desks. Filter the archive by topic and read the edition in a stricter editorial layout.
        </p>
      </header>

      <div className="mb-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`tag-chip ${activeFilter === 'all' ? 'active' : ''}`}
        >
          All ({posts.length})
        </button>
        {TOPICS.map((topic) => {
          const count = posts.filter((post) => post.category?.toLowerCase() === topic.slug).length;
          return (
            <button
              type="button"
              key={topic.slug}
              onClick={() => setActiveFilter(topic.slug)}
              className={`tag-chip ${activeFilter === topic.slug ? 'active' : ''}`}
            >
              {topic.label} {count ? `(${count})` : ''}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4">
          <div className="editor-loader" />
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#737373]">Opening archive</p>
        </div>
      ) : null}

      {error ? (
        <div className="border border-[#111111] px-5 py-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#CC0000]">Wire issue</p>
          <p className="mt-3 font-serif text-sm text-[#525252]">{error}</p>
        </div>
      ) : null}

      {!loading && !error && filteredPosts.length === 0 ? (
        <div className="border border-[#111111] px-5 py-12 text-center">
          <Compass className="mx-auto h-10 w-10 text-[#111111]" strokeWidth={1.5} />
          <p className="mt-4 font-serif text-base text-[#525252]">No stories match this desk yet.</p>
        </div>
      ) : null}

      {!loading && !error && filteredPosts.length > 0 ? (
        <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
          {hero ? (
            <motion.div variants={item}>
              <PostCard post={hero} index={0} featured />
            </motion.div>
          ) : null}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {rest.map((post, index) => (
              <motion.div key={post.id} variants={item}>
                <PostCard post={post} index={index + 1} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
