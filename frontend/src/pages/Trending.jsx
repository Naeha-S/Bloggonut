import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PostCard } from '../components/post/PostCard';
import { TextFlippingBoard } from '../components/ui/text-flipping-board';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Trending() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [boardIndex, setBoardIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      })
      .then((data) => setPosts([...data].sort((left, right) => (right.likes || 0) - (left.likes || 0))))
      .catch((fetchError) => setError(fetchError.message))
      .finally(() => setLoading(false));
  }, []);

  const [hero, ...rest] = posts;
  const topThree = posts.slice(0, 3);
  const boardMessages = useMemo(() => {
    const totalLikes = posts.reduce((sum, post) => sum + Number(post.likes || 0), 0);
    return [
      'TRENDING DESK\nRANKED BY LIKES',
      `${posts.length} STORIES TRACKED\n${totalLikes} TOTAL LIKES`,
      'THE TOP READS\nARE MOVING FAST',
    ];
  }, [posts]);

  useEffect(() => {
    if (boardMessages.length <= 1) return undefined;
    const id = setInterval(() => {
      setBoardIndex((index) => (index + 1) % boardMessages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [boardMessages]);

  return (
    <div>
      <header className="newsprint-header">
        <div className="mb-4 flex items-center gap-3">
          <span className="news-kicker">Trending desk</span>
          <div className="accent-line flex-1" />
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#737373]">ranked by likes</span>
        </div>
        <h1 className="newsprint-title">What readers are pulling to the top.</h1>
        <p className="newsprint-dek">The stories with the strongest engagement across the edition right now.</p>
      </header>

      {!loading && !error && posts.length > 0 ? (
        <section className="mb-8 border border-[#111111] bg-[#F9F9F7]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="border-b border-[#111111] px-5 py-6 lg:col-span-4 lg:border-b-0 lg:border-r lg:border-[#111111]">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#737373]">Signal board</p>
              <h2 className="mt-4 font-display text-5xl leading-[0.92] tracking-tight text-[#111111]">
                The board now lives where momentum matters.
              </h2>
              <p className="mt-4 font-serif text-sm leading-relaxed text-[#525252]">
                Trending is the right surface for a live mechanical board and a quick navigation dock. It reads like a newsroom control strip instead of a landing-page gimmick.
              </p>
            </div>
            <div className="border-b border-[#111111] px-3 py-5 lg:col-span-8 lg:border-b-0 md:px-5">
              <TextFlippingBoard
                text={boardMessages[boardIndex]}
                theme="newsprint"
                className="max-w-none border-0 bg-transparent p-0 shadow-none"
                duration={1.25}
              />
            </div>
          </div>
        </section>
      ) : null}

      {topThree.length > 0 ? (
        <section className="mb-8 border border-[#111111]">
          <div className="border-b border-[#111111] px-4 py-3">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-[#CC0000]" strokeWidth={1.5} />
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#737373]">Top right now</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {topThree.map((post, index) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className={`border-b border-[#111111] px-4 py-5 no-underline hover:bg-[#F5F5F5] md:border-b-0 ${index < topThree.length - 1 ? 'md:border-r md:border-[#111111]' : ''}`}
              >
                <p className="font-mono text-sm uppercase tracking-[0.18em] text-[#CC0000]">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 font-display text-3xl leading-tight text-[#111111]">{post.title}</h3>
                <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#737373]">
                  {post.likes || 0} likes
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {loading ? (
        <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4">
          <div className="editor-loader" />
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#737373]">Ranking stories</p>
        </div>
      ) : null}

      {error ? (
        <div className="border border-[#111111] px-5 py-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#CC0000]">Wire issue</p>
          <p className="mt-3 font-serif text-sm text-[#525252]">{error}</p>
        </div>
      ) : null}

      {!loading && !error && posts.length === 0 ? (
        <div className="border border-[#111111] px-5 py-12 text-center">
          <Flame className="mx-auto h-10 w-10 text-[#111111]" strokeWidth={1.5} />
          <p className="mt-4 font-serif text-base text-[#525252]">No trending stories yet.</p>
        </div>
      ) : null}

      {!loading && !error && posts.length > 0 ? (
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
