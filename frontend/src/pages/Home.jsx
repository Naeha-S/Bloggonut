import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bookmark, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PostCard } from '../components/post/PostCard';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function EditorLoader() {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4">
      <div className="editor-loader" />
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#737373]">Setting the front page</p>
    </div>
  );
}

export function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <EditorLoader />;

  const [featured, ...rest] = posts;
  const compact = rest.slice(0, 4);
  const feedPosts = rest.slice(4, 10);

  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="newsprint-header"
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="news-kicker">Morning Edition</span>
          <div className="accent-line flex-1" />
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#737373]">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <h1 className="newsprint-title">All the stories that earn the front page.</h1>
        <p className="newsprint-dek">
          Editorially framed writing on technology, design, development, startups, and AI. Structured like a newspaper,
          not a feed.
        </p>
      </motion.header>

      {error ? (
        <div className="border border-[#111111] px-5 py-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#CC0000]">Wire issue</p>
          <p className="mt-3 font-serif text-sm text-[#525252]">{error}</p>
        </div>
      ) : null}

      {!error && posts.length === 0 ? (
        <div className="border border-[#111111] px-5 py-12 text-center">
          <Bookmark className="mx-auto h-10 w-10 text-[#111111]" strokeWidth={1.5} />
          <p className="mt-4 font-serif text-base text-[#525252]">No stories are on the record yet.</p>
        </div>
      ) : null}

      {!error && posts.length > 0 ? (
        <>
          <motion.section variants={container} initial="hidden" animate="visible">
            {featured ? (
              <motion.div variants={item}>
                <PostCard post={featured} index={0} featured />
              </motion.div>
            ) : null}
          </motion.section>

          {compact.length > 0 ? (
            <section className="mt-6 border border-[#111111]">
              <div className="border-b border-[#111111] px-4 py-3">
                <div className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4 text-[#111111]" strokeWidth={1.5} />
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#737373]">Also on page one</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                {compact.map((post, index) => (
                  <div
                    key={post.id}
                    className={`${index % 2 === 0 ? 'md:border-r md:border-[#111111]' : ''} border-b border-[#111111] last:border-b-0`}
                  >
                    <PostCard post={post} index={index} compact />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {feedPosts.length > 0 ? (
            <>
              <div className="divider-playful" />
              <section>
                <div className="newsprint-header">
                  <p className="news-kicker">City Desk</p>
                  <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight text-[#111111]">More from the edition</h2>
                </div>
                <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {feedPosts.map((post, index) => (
                    <motion.div key={post.id} variants={item}>
                      <PostCard post={post} index={index + 1} />
                    </motion.div>
                  ))}
                </motion.div>

                {posts.length > 10 ? (
                  <div className="mt-8 text-center">
                    <Link to="/explore" className="btn-secondary">
                      View archive
                      <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                    </Link>
                  </div>
                ) : null}
              </section>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
