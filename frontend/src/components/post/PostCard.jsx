import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Heart, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { topicSlug } from '../../data/topics';

const MotionLink = motion(Link);

function formatDate(dateStr, fallbackStr) {
  const d = dateStr || fallbackStr;
  if (!d) return 'Undated';
  try {
    const date = new Date(d);
    if (isNaN(date.getTime())) return 'Undated';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return 'Undated';
  }
}

function AuthorMeta({ post }) {
  return (
    <div className="grid grid-cols-2 border-t border-[#111111]">
      <div className="border-r border-[#111111] px-4 py-3">
        <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-[#737373]">Byline</p>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-[#111111]">{post.author || 'Staff Writer'}</p>
      </div>
      <div className="px-4 py-3">
        <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-[#737373]">Filed</p>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-[#111111]">{formatDate(post.date, post.created_at)}</p>
      </div>
    </div>
  );
}

function FeaturedCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const navigate = useNavigate();

  return (
    <MotionLink
      to={`/post/${post.id}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="group block h-full no-underline"
    >
      <div className="card-panel h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="relative border-b border-[#111111] bg-[#E5E5E5] lg:col-span-7 lg:border-b-0 lg:border-r lg:border-[#111111]">
            {post.image ? (
              <div className="img-zoom-wrap h-72 md:h-[26rem]">
                <img src={post.image} alt={post.title} className="h-full w-full object-cover grayscale" />
              </div>
            ) : (
              <div className="h-72 bg-[radial-gradient(#000_1px,transparent_1px)] opacity-10 [background-size:16px_16px] md:h-[26rem]" />
            )}
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                navigate(`/topics/${topicSlug(post.category)}`);
              }}
              className="category-pill absolute left-4 top-4"
            >
              {post.category}
            </button>
            <span className="signature-badge absolute right-4 top-4">Front Page</span>
          </div>

          <div className="flex flex-col lg:col-span-5">
            <div className="border-b border-[#111111] p-5 md:p-6">
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-[#CC0000]">Lead story</p>
              <h2 className="mt-4 font-display text-4xl leading-[0.92] tracking-tight text-[#111111] md:text-5xl">
                {post.title}
              </h2>
              <p className="mt-5 font-serif text-base leading-relaxed text-[#525252] first-letter:float-left first-letter:pr-2 first-letter:pt-1 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-[#CC0000]">
                {post.description}
              </p>
            </div>

            <AuthorMeta post={post} />

            <div className="mt-auto grid grid-cols-3 border-t border-[#111111]">
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  setLiked((value) => !value);
                  setLikes((value) => value + (liked ? -1 : 1));
                }}
                className="flex items-center gap-2 border-r border-[#111111] px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#111111] hover:bg-[#111111] hover:text-[#F9F9F7]"
              >
                <Heart className="h-4 w-4" fill={liked ? 'currentColor' : 'none'} strokeWidth={1.5} />
                {likes}
              </button>
              <div className="flex items-center gap-2 border-r border-[#111111] px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#111111]">
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                {post.comments || 0}
              </div>
              <div className="flex items-center justify-between px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#111111]">
                Read
                <ArrowUpRight className="h-4 w-4 text-[#CC0000]" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionLink>
  );
}

function MediumCard({ post, index }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const navigate = useNavigate();

  return (
    <MotionLink
      to={`/post/${post.id}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group block h-full no-underline"
    >
      <div className="card-panel flex h-full flex-col">
        <div className="relative border-b border-[#111111] bg-[#E5E5E5]">
          {post.image ? (
            <div className="img-zoom-wrap h-52">
              <img src={post.image} alt={post.title} className="h-full w-full object-cover grayscale" />
            </div>
          ) : (
            <div className="h-52 bg-[radial-gradient(#000_1px,transparent_1px)] opacity-10 [background-size:16px_16px]" />
          )}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              navigate(`/topics/${topicSlug(post.category)}`);
            }}
            className="category-pill absolute left-3 top-3"
          >
            {post.category}
          </button>
        </div>

        <div className="flex-1 border-b border-[#111111] p-4">
          <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-[#737373]">Story {String(index + 1).padStart(2, '0')}</p>
          <h3 className="mt-3 font-display text-3xl leading-tight text-[#111111]">{post.title}</h3>
          <p className="mt-3 font-serif text-sm leading-relaxed text-[#525252]">{post.description}</p>
        </div>

        <AuthorMeta post={post} />

        <div className="grid grid-cols-2 border-t border-[#111111]">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              setLiked((value) => !value);
              setLikes((value) => value + (liked ? -1 : 1));
            }}
            className="flex items-center gap-2 border-r border-[#111111] px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#111111] hover:bg-[#111111] hover:text-[#F9F9F7]"
          >
            <Heart className="h-4 w-4" fill={liked ? 'currentColor' : 'none'} strokeWidth={1.5} />
            {likes}
          </button>
          <div className="flex items-center justify-between px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#111111]">
            <span>{post.comments || 0} comments</span>
            <ArrowUpRight className="h-4 w-4 text-[#CC0000]" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </MotionLink>
  );
}

function CompactCard({ post, index, rank }) {
  const navigate = useNavigate();

  return (
    <MotionLink
      to={`/post/${post.id}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group grid grid-cols-[auto_1fr] gap-3 border-b border-[#111111] px-4 py-4 no-underline last:border-b-0 hover:bg-[#F5F5F5]"
    >
      <div className="font-mono text-sm uppercase tracking-[0.18em] text-[#CC0000]">
        {String((rank ?? index) + 1).padStart(2, '0')}
      </div>
      <div>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            navigate(`/topics/${topicSlug(post.category)}`);
          }}
          className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-[#737373] hover:text-[#CC0000]"
        >
          {post.category}
        </button>
        <p className="mt-2 font-display text-xl leading-tight text-[#111111]">{post.title}</p>
        <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#737373]">
          {post.author || 'Staff Writer'} | {formatDate(post.date, post.created_at)}
        </p>
      </div>
    </MotionLink>
  );
}

export function PostCard({ post, index = 0, featured = false, compact = false }) {
  if (featured) return <FeaturedCard post={post} index={index} />;
  if (compact) return <CompactCard post={post} index={index} rank={index} />;
  return <MediumCard post={post} index={index} />;
}
