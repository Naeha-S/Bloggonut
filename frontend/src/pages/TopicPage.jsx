import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, ArrowLeft, Sparkles } from 'lucide-react';
import { PostCard } from '../components/post/PostCard';
import { TOPICS, getTopic, topicSlug } from '../data/topics';

export function TopicPage() {
  const { topic: topicParam } = useParams();
  const topic = getTopic(topicParam);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (!topic) {
      return [];
    }

    return posts.filter((post) => topicSlug(post.category) === topic.slug);
  }, [posts, topic]);

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

  if (!topic) {
    return (
      <div className="mt-6 md:mt-10 space-y-6">
        <Link to="/explore" className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to explore
        </Link>

        <div className="card-panel p-8 md:p-10 shadow-soft border border-border">
          <div className="signature-badge top-left">Topics</div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-text-main">That topic does not exist.</h1>
          <p className="mt-4 text-text-muted max-w-2xl">
            Pick one of the six supported topic areas below to open only the related stories.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {TOPICS.map((item) => (
              <Link
                key={item.slug}
                to={`/topics/${item.slug}`}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-main hover:text-accent hover:border-accent/40 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 md:mt-6 pb-8 space-y-8">
      <Link to="/explore" className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to explore
      </Link>

      <section className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-6 items-start">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-panel depth-layer-3 p-6 md:p-8 relative overflow-hidden"
        >
          <div className="signature-badge top-left">Topic feed</div>
          <div className="micro-label mb-4">Filtered stories</div>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-text-main leading-tight max-w-3xl">
            {topic.label} stories, no extra noise.
          </h1>
          <p className="mt-4 text-base md:text-lg text-text-muted max-w-2xl leading-relaxed">
            Only the posts tagged with {topic.label} appear here, and every card keeps the same topic image so the page reads as one lane.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Chip label={`${filteredPosts.length} stories`} />
            <Chip label={topic.description} />
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-panel depth-layer-2 overflow-hidden"
        >
          <div className="relative h-64 sm:h-72">
            <img src={topic.image} alt={topic.label} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-text-main/70 via-text-main/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <div className="micro-label text-white/80">Related topic</div>
              <p className="mt-2 text-2xl font-display font-semibold leading-tight">{topic.label}</p>
            </div>
          </div>
          <div className="p-5 md:p-6 space-y-3">
            <p className="text-text-muted leading-relaxed">Explore the rest of the {topic.label.toLowerCase()} lane using the chips or jump back to the full browse view.</p>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((item) => (
                <Link
                  key={item.slug}
                  to={`/topics/${item.slug}`}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${item.slug === topic.slug ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-surface text-text-muted hover:text-accent hover:border-accent/40'}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.aside>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="micro-label mb-2">Topic stories</div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-text-main">Related posts only</h2>
          </div>
          <p className="text-text-muted max-w-xl">This page stays focused on one topic so it behaves like a small editorial shelf instead of a generic feed.</p>
        </div>

        {error ? (
          <div className="card-panel p-8 text-text-muted">{error}</div>
        ) : filteredPosts.length === 0 ? (
          <div className="card-panel p-8 text-text-muted">No stories found for this topic yet.</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <div key={post.id} className={index === 0 ? 'md:col-span-2 xl:col-span-2' : ''}>
                <PostCard post={post} index={index} featured={index === 0} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Chip({ label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-main shadow-soft">
      <Sparkles className="w-3.5 h-3.5 text-accent" />
      <span>{label}</span>
    </div>
  );
}
