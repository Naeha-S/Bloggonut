import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, FileText, MessageCircle, Newspaper, ScanLine } from 'lucide-react';
import { TOPICS, getTopic, topicSlug } from '../data/topics';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

function formatShortDate(dateStr) {
  if (!dateStr) return 'Undated';
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatLongDate(dateStr) {
  if (!dateStr) return 'Unknown date';
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getLeadCount(posts) {
  return posts.reduce((sum, post) => sum + Number(post.likes || 0) + Number(post.comments || 0), 0);
}

function NewsprintStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@400;600;700;900&family=Lora:wght@400;600;700&display=block');

      .topic-newsprint {
        --news-bg: #F9F9F7;
        --news-fg: #111111;
        --news-muted: #E5E5E0;
        --news-accent: #CC0000;
        --news-meta: #737373;
        --news-body: #525252;
        --news-line: rgba(17, 17, 17, 0.08);
        color: var(--news-fg);
        font-family: 'Inter', 'Helvetica Neue', sans-serif;
      }

      .topic-newsprint,
      .topic-newsprint * {
        border-radius: 0 !important;
      }

      .topic-newsprint a,
      .topic-newsprint button {
        transition: all 200ms ease-out;
      }

      .topic-newsprint-shell {
        position: relative;
        max-width: 1280px;
        margin: 0 auto;
        background:
          linear-gradient(0deg, transparent 98%, rgba(0, 0, 0, 0.02) 100%),
          linear-gradient(90deg, transparent 98%, rgba(0, 0, 0, 0.02) 100%);
        background-size: 3px 3px;
      }

      .topic-newsprint-shell::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23111111' fill-opacity='0.04' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'/%3E%3C/svg%3E");
        pointer-events: none;
        opacity: 0.75;
      }

      .topic-newsprint-shell > * {
        position: relative;
        z-index: 1;
      }

      .topic-paper {
        background: var(--news-bg);
        border: 1px solid var(--news-fg);
      }

      .topic-hard-hover {
        will-change: transform;
      }

      .topic-hard-hover:hover {
        box-shadow: 4px 4px 0 0 var(--news-fg);
        transform: translate(-2px, -2px);
      }

      .topic-rule {
        border-color: var(--news-fg);
      }

      .topic-label {
        font-family: 'JetBrains Mono', 'Courier New', monospace;
        font-size: 0.68rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .topic-body {
        font-family: 'Lora', Georgia, serif;
        color: var(--news-body);
      }

      .topic-display {
        font-family: 'Playfair Display', 'Times New Roman', serif;
      }

      .topic-first-letter::first-letter {
        float: left;
        font-family: 'Playfair Display', 'Times New Roman', serif;
        font-size: 4.5rem;
        line-height: 0.82;
        padding-right: 0.45rem;
        padding-top: 0.2rem;
        color: var(--news-accent);
      }

      .topic-grayscale {
        filter: grayscale(1);
      }

      .topic-card:hover .topic-grayscale {
        filter: grayscale(1) sepia(0.5);
      }

      .topic-justify {
        text-align: justify;
      }

      .topic-focus:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px var(--news-fg);
      }

      .topic-breakout {
        background: var(--news-fg);
        color: var(--news-bg);
      }

      .topic-breakout .topic-meta-light {
        color: #A3A3A3;
      }

      @media (max-width: 767px) {
        .topic-border-r-mobile-none {
          border-right: none !important;
        }
      }
    `}</style>
  );
}

function EditorialCard({ post, rank, featured = false }) {
  const imageHeight = featured ? 'h-64 md:h-[22rem]' : 'h-52';

  return (
    <motion.article variants={item} className="h-full">
      <Link
        to={`/post/${post.id}`}
        className={`topic-card topic-focus topic-paper topic-hard-hover block h-full overflow-hidden no-underline hover:bg-[#F5F5F5] ${
          featured ? '' : ''
        }`}
      >
        <div className={`relative ${imageHeight} overflow-hidden border-b border-[#111111] bg-[#E5E5E5]`}>
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="topic-grayscale h-full w-full object-cover transition-transform duration-200 ease-out hover:scale-[1.05]"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
          )}
          <div className="absolute left-4 top-4 border border-[#111111] bg-[#F9F9F7] px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#111111]">
            {post.category}
          </div>
          {rank !== undefined && (
            <div className="absolute right-4 top-4 border border-[#111111] bg-[#111111] px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#F9F9F7]">
              Lead {String(rank + 1).padStart(2, '0')}
            </div>
          )}
          <div className="absolute bottom-3 left-4 border border-[#111111] bg-[#F9F9F7] px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#737373]">
            Fig. 1.{rank !== undefined ? rank + 1 : 1}
          </div>
        </div>

        <div className="grid grid-cols-1 border-b border-[#111111] md:grid-cols-12">
          <div className="border-b border-[#111111] p-4 md:col-span-3 md:border-b-0 md:border-r md:border-[#111111]">
            <p className="topic-label text-[#737373]">Byline</p>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-[#111111]">{post.author || 'Staff Writer'}</p>
            <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#737373]">{formatShortDate(post.date)}</p>
          </div>
          <div className="p-4 md:col-span-9">
            <h2 className={`topic-display text-[#111111] ${featured ? 'text-3xl md:text-5xl leading-[0.92] tracking-tight' : 'text-2xl leading-tight'}`}>
              {post.title}
            </h2>
            <p className={`topic-body topic-justify mt-4 text-sm leading-relaxed ${featured ? 'topic-first-letter md:text-lg' : ''}`}>
              {post.description || 'Read the full report for the complete editorial and supporting analysis.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3">
          <div className="border-r border-[#111111] px-4 py-3">
            <p className="topic-label text-[#737373]">Reaction</p>
            <p className="mt-2 font-mono text-sm uppercase tracking-[0.12em] text-[#111111]">{post.likes || 0} likes</p>
          </div>
          <div className="border-r border-[#111111] px-4 py-3">
            <p className="topic-label text-[#737373]">Letters</p>
            <p className="mt-2 font-mono text-sm uppercase tracking-[0.12em] text-[#111111]">{post.comments || 0} comments</p>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="topic-label text-[#737373]">Read</p>
              <p className="mt-2 font-mono text-sm uppercase tracking-[0.12em] text-[#111111]">Full story</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-[#CC0000]" strokeWidth={1.5} />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function BriefRow({ post, index }) {
  return (
    <motion.article variants={item}>
      <Link
        to={`/post/${post.id}`}
        className="topic-focus topic-hard-hover grid grid-cols-1 border-b border-[#111111] bg-[#F9F9F7] no-underline hover:bg-[#F5F5F5] md:grid-cols-12"
      >
        <div className="border-b border-[#111111] px-4 py-4 md:col-span-2 md:border-b-0 md:border-r md:border-[#111111]">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#CC0000]">Brief {String(index + 1).padStart(2, '0')}</p>
          <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#737373]">{formatShortDate(post.date)}</p>
        </div>
        <div className="border-b border-[#111111] px-4 py-4 md:col-span-7 md:border-b-0 md:border-r md:border-[#111111]">
          <p className="topic-label text-[#737373]">{post.category}</p>
          <h3 className="topic-display mt-2 text-2xl leading-tight text-[#111111]">{post.title}</h3>
          <p className="topic-body topic-justify mt-3 text-sm leading-relaxed">{post.description}</p>
        </div>
        <div className="flex items-center justify-between px-4 py-4 md:col-span-3">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#111111]">{post.author || 'Staff Writer'}</p>
            <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#737373]">
              {post.likes || 0} likes / {post.comments || 0} comments
            </p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-[#111111]" strokeWidth={1.5} />
        </div>
      </Link>
    </motion.article>
  );
}

export function TopicPage() {
  const { topic: topicParam } = useParams();
  const topic = getTopic(topicParam);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      })
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch((fetchError) => setError(fetchError.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = useMemo(() => {
    if (!topic) return [];
    return posts.filter((post) => topicSlug(post.category) === topic.slug);
  }, [posts, topic]);

  const [leadStory, secondStory, thirdStory, ...briefs] = filteredPosts;
  const issueDate = formatLongDate(new Date().toISOString());
  const totalEngagement = getLeadCount(filteredPosts);

  if (loading) {
    return (
      <div className="topic-newsprint px-4 py-12">
        <NewsprintStyles />
        <div className="topic-newsprint-shell topic-paper flex min-h-[55vh] flex-col items-center justify-center gap-5 px-6 text-center">
          <div className="h-10 w-10 animate-spin border border-[#111111] border-t-transparent" />
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#737373]">Setting the morning edition</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="topic-newsprint px-4 py-8">
        <NewsprintStyles />
        <div className="topic-newsprint-shell topic-paper overflow-hidden">
          <div className="border-b border-[#111111] px-4 py-4 md:px-6">
            <Link
              to="/explore"
              className="topic-focus inline-flex min-h-[44px] items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#111111] no-underline hover:text-[#CC0000]"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              Return to explore
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="border-b border-[#111111] px-6 py-8 md:col-span-8 md:border-b-0 md:border-r md:border-[#111111]">
              <p className="topic-label text-[#CC0000]">Correction</p>
              <h1 className="topic-display mt-4 text-5xl leading-[0.92] tracking-tight text-[#111111] md:text-7xl">
                Topic not found.
              </h1>
              <p className="topic-body topic-first-letter topic-justify mt-5 max-w-2xl text-base leading-relaxed">
                The requested desk does not appear in today&apos;s edition. Choose from the available sections to continue reading.
              </p>
            </div>
            <div className="px-6 py-8 md:col-span-4">
              <p className="topic-label text-[#737373]">Available desks</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {TOPICS.map((entry) => (
                  <Link
                    key={entry.slug}
                    to={`/topics/${entry.slug}`}
                    className="topic-focus min-h-[44px] border border-[#111111] px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[#111111] no-underline hover:bg-[#111111] hover:text-[#F9F9F7]"
                  >
                    {entry.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="topic-newsprint px-4 py-6 md:py-8">
      <NewsprintStyles />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="topic-newsprint-shell topic-paper overflow-hidden"
      >
        <header className="border-b border-[#111111] px-4 py-4 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link
              to="/explore"
              className="topic-focus inline-flex min-h-[44px] items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#111111] no-underline hover:text-[#CC0000]"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              Back to explore
            </Link>
            <div className="text-center">
              <p className="topic-display text-3xl font-black uppercase tracking-tight text-[#111111] md:text-5xl">The Bloggonut Ledger</p>
              <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[#737373]">
                Vol. 1 | {issueDate} | Global Edition
              </p>
            </div>
            <div className="flex justify-start md:justify-end">
              <span className="inline-flex min-h-[44px] items-center border border-[#111111] bg-[#111111] px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] text-[#F9F9F7]">
                Topic Desk
              </span>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 border-b border-[#111111] lg:grid-cols-12">
          <div className="border-b border-[#111111] px-4 py-5 lg:col-span-8 lg:border-b-0 lg:border-r lg:border-[#111111] lg:px-6 lg:py-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="border border-[#111111] bg-[#CC0000] px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#F9F9F7]">
                Breaking desk
              </span>
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#737373]">
                {filteredPosts.length} published {filteredPosts.length === 1 ? 'story' : 'stories'}
              </span>
            </div>
            <h1 className="topic-display mt-5 text-5xl leading-[0.9] tracking-tighter text-[#111111] md:text-6xl lg:text-[8rem]">
              {topic.label}
            </h1>
            <p className="topic-body topic-first-letter topic-justify mt-6 max-w-3xl text-base leading-relaxed md:text-lg">
              {topic.description} This desk collects the strongest reporting, analysis, and commentary from the section in a print-first editorial frame.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:col-span-4">
            <div className="border-b border-[#111111] px-4 py-5 lg:border-[#111111] lg:px-6">
              <p className="topic-label text-[#737373]">Edition data</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="border border-[#111111] px-3 py-3">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#737373]">Lead count</p>
                  <p className="mt-2 font-mono text-xl uppercase tracking-[0.12em] text-[#111111]">{filteredPosts.length}</p>
                </div>
                <div className="border border-[#111111] px-3 py-3">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#737373]">Engagement</p>
                  <p className="mt-2 font-mono text-xl uppercase tracking-[0.12em] text-[#111111]">{totalEngagement}</p>
                </div>
              </div>
            </div>

            <div className="border-b border-[#111111] px-4 py-5 lg:border-[#111111] lg:px-6">
              <p className="topic-label text-[#737373]">Section marker</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border border-[#111111]">
                  <Newspaper className="h-5 w-5 text-[#111111]" strokeWidth={1.5} />
                </div>
                <p className="topic-body text-sm leading-relaxed">
                  Structured columns, strict hierarchy, and high-contrast typography define this edition.
                </p>
              </div>
            </div>

            <div className="px-4 py-5 lg:px-6">
              <p className="topic-label text-[#737373]">Cross desk</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {TOPICS.map((entry) => (
                  <Link
                    key={entry.slug}
                    to={`/topics/${entry.slug}`}
                    className={`topic-focus min-h-[44px] border px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] no-underline ${
                      entry.slug === topic.slug
                        ? 'border-[#111111] bg-[#111111] text-[#F9F9F7]'
                        : 'border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F9F9F7]'
                    }`}
                  >
                    {entry.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {error && (
          <section className="border-b border-[#111111] bg-[#111111] px-4 py-5 text-[#F9F9F7] md:px-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#A3A3A3]">Wire issue</p>
            <p className="mt-2 text-sm text-[#F9F9F7]">{error}</p>
          </section>
        )}

        {!error && filteredPosts.length === 0 && (
          <section className="border-b border-[#111111] px-4 py-12 text-center md:px-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#CC0000]">No dispatches</p>
            <h2 className="topic-display mt-4 text-4xl text-[#111111]">No stories in this desk yet.</h2>
            <p className="topic-body mx-auto mt-4 max-w-xl text-sm leading-relaxed">
              This edition is still being composed. Check another desk or return when fresh reporting arrives.
            </p>
          </section>
        )}

        {!error && filteredPosts.length > 0 && (
          <motion.main variants={container} initial="hidden" animate="visible">
            <section className="grid grid-cols-1 border-b border-[#111111] lg:grid-cols-12">
              <div className="border-b border-[#111111] lg:col-span-8 lg:border-b-0 lg:border-r lg:border-[#111111]">
                {leadStory && <EditorialCard post={leadStory} rank={0} featured />}
              </div>

              <aside className="topic-breakout lg:col-span-4">
                <div className="border-b border-[#F9F9F7] px-4 py-5 md:px-6">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#A3A3A3]">Inside the section</p>
                  <h2 className="topic-display mt-3 text-4xl leading-tight text-[#F9F9F7]">Editorial rail</h2>
                </div>
                <div className="grid grid-cols-1">
                  {[
                    { icon: FileText, label: 'Filed pieces', value: filteredPosts.length },
                    { icon: MessageCircle, label: 'Reader letters', value: filteredPosts.reduce((sum, post) => sum + Number(post.comments || 0), 0) },
                    { icon: ScanLine, label: 'Desk reach', value: filteredPosts.reduce((sum, post) => sum + Number(post.likes || 0), 0) },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="border-b border-[#F9F9F7] px-4 py-5 last:border-b-0 md:px-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center border border-[#F9F9F7]">
                          <Icon className="h-5 w-5 text-[#F9F9F7]" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#A3A3A3]">{label}</p>
                          <p className="mt-2 font-mono text-2xl uppercase tracking-[0.12em] text-[#F9F9F7]">{value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-6 md:px-6">
                  <p className="topic-body topic-justify text-sm leading-relaxed text-[#F9F9F7]">
                    The rail flips the page into black ink and compressed data, echoing the contrast of a financial paper’s side column.
                  </p>
                </div>
              </aside>
            </section>

            <section className="grid grid-cols-1 border-b border-[#111111] lg:grid-cols-12">
              <div className="border-b border-[#111111] lg:col-span-7 lg:border-b-0 lg:border-r lg:border-[#111111]">
                {secondStory ? (
                  <EditorialCard post={secondStory} rank={1} />
                ) : (
                  <div className="h-full px-4 py-10 md:px-6">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#737373]">Awaiting dispatch</p>
                  </div>
                )}
              </div>
              <div className="lg:col-span-5">
                {thirdStory ? (
                  <EditorialCard post={thirdStory} rank={2} />
                ) : (
                  <div className="h-full px-4 py-10 md:px-6">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#737373]">Awaiting dispatch</p>
                  </div>
                )}
              </div>
            </section>

            <section className="border-b border-[#111111] px-4 py-6 text-center md:px-6">
              <div className="topic-display text-2xl tracking-[0.35em] text-[#A3A3A3]">✧ ✧ ✧</div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-12">
              <div className="border-b border-[#111111] px-4 py-6 lg:col-span-3 lg:border-b-0 lg:border-r lg:border-[#111111] md:px-6">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#CC0000]">Late edition</p>
                <h2 className="topic-display mt-4 text-4xl leading-tight text-[#111111]">More from the desk</h2>
                <p className="topic-body topic-justify mt-4 text-sm leading-relaxed">
                  Shorter pieces continue below in a denser newspaper rail, with crisp metadata and deliberate grid lines.
                </p>
              </div>
              <div className="lg:col-span-9">
                {briefs.length > 0 ? (
                  briefs.map((post, index) => <BriefRow key={post.id} post={post} index={index} />)
                ) : (
                  <div className="px-4 py-10 md:px-6">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#737373]">This edition ends on page one</p>
                  </div>
                )}
              </div>
            </section>

            <footer className="border-t border-[#111111] px-4 py-4 md:px-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#737373]">
                  Edition: Vol 1.0 | Printed in Bloggonut
                </p>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#737373]">
                  Desk code: {topic.slug} | Updated {issueDate}
                </p>
              </div>
            </footer>
          </motion.main>
        )}
      </motion.div>
    </div>
  );
}
