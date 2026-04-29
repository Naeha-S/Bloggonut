import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, Eye, ArrowUpRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { topicSlug } from '../../data/topics';

const MotionLink = motion(Link);

/* ── helpers ── */
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function AuthorAvatar({ author, size = 28 }) {
  return (
    <img
      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${author}&backgroundColor=transparent`}
      alt={author}
      style={{
        width: size, height: size,
        borderRadius: '50%',
        border: '1.5px solid var(--color-border)',
        background: 'var(--color-parchment)',
        flexShrink: 0,
      }}
    />
  );
}

/* ── Featured card ── Large editorial hero ── */
function FeaturedCard({ post, index }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const navigate = useNavigate();

  return (
    <MotionLink
      to={`/post/${post.id}`}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className="group block relative"
      style={{ textDecoration: 'none' }}
    >
      <div
        className="card-panel ripple-container overflow-hidden"
        style={{ borderRadius: '1.5rem' }}
      >
        {/* Image */}
        {post.image && (
          <div
            className="img-zoom-wrap relative"
            style={{ height: '380px', background: 'var(--color-parchment)' }}
          >
            <img
              src={post.image}
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Gradient overlay */}
            <div
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(28,25,23,0.75) 0%, rgba(28,25,23,0.1) 55%, transparent 100%)',
              }}
            />
            {/* Category pill — overlaid on image */}
            <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem' }}>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/topics/${topicSlug(post.category)}`); }}
                className="category-pill"
              >
                {post.category}
              </button>
            </div>
            {/* Featured badge */}
            <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
              <span className="signature-badge">Featured</span>
            </div>
            {/* Title overlaid on image bottom */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 1.75rem' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
                  fontWeight: 400,
                  color: '#FDFAF5',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.15,
                  textShadow: '0 1px 8px rgba(0,0,0,0.25)',
                }}
              >
                {post.title}
              </h2>
            </div>
          </div>
        )}

        {/* Card body */}
        <div style={{ padding: '1.25rem 1.75rem 1.5rem' }}>
          <p
            style={{
              fontSize: '0.925rem',
              color: 'var(--color-muted)',
              lineHeight: 1.7,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: '1.25rem',
            }}
          >
            {post.description}
          </p>

          {/* Footer row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AuthorAvatar author={post.author} size={30} />
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-charcoal)', lineHeight: 1.2 }}>
                  {post.author}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}>
                  {formatDate(post.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={(e) => { e.preventDefault(); setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1); }}
                className="flex items-center gap-1.5 meta-reveal"
                style={{ color: liked ? 'var(--color-rust)' : 'var(--color-subtle)', fontSize: '0.78rem', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Heart style={{ width: 14, height: 14, fill: liked ? 'currentColor' : 'none' }} />
                <span>{likes}</span>
              </button>
              <span
                className="flex items-center gap-1.5 meta-reveal"
                style={{ color: 'var(--color-subtle)', fontSize: '0.78rem' }}
              >
                <MessageCircle style={{ width: 14, height: 14 }} />
                {post.comments || 0}
              </span>
              <ArrowUpRight
                className="meta-reveal"
                style={{ width: 16, height: 16, color: 'var(--color-gold)', transition: 'transform 0.25s ease' }}
              />
            </div>
          </div>
        </div>
      </div>
    </MotionLink>
  );
}

/* ── Medium card ── Standard editorial card ── */
function MediumCard({ post, index }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const navigate = useNavigate();

  return (
    <MotionLink
      to={`/post/${post.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.4, 0, 0.2, 1] }}
      className="group block h-full"
      style={{ textDecoration: 'none' }}
    >
      <div className="card-panel overflow-hidden h-full flex flex-col">
        {post.image && (
          <div className="img-zoom-wrap relative" style={{ height: '200px', background: 'var(--color-parchment)' }}>
            <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', bottom: '0.875rem', left: '0.875rem' }}>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/topics/${topicSlug(post.category)}`); }}
                className="category-pill"
              >
                {post.category}
              </button>
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col" style={{ padding: '1.125rem 1.25rem 1.25rem' }}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              fontWeight: 400,
              color: 'var(--color-charcoal)',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              marginBottom: '0.625rem',
              transition: 'color 0.2s ease',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
            className="group-hover:text-[color:var(--color-gold)]"
          >
            {post.title}
          </h3>
          <p
            style={{
              fontSize: '0.825rem',
              color: 'var(--color-muted)',
              lineHeight: 1.65,
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: '1rem',
            }}
          >
            {post.description}
          </p>

          <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '0.875rem' }} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AuthorAvatar author={post.author} size={24} />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 400 }}>{post.author}</span>
              <span style={{ color: 'var(--color-border)', fontSize: '0.75rem' }}>·</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}>{formatDate(post.date)}</span>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1); }}
              className="flex items-center gap-1 meta-reveal"
              style={{ color: liked ? 'var(--color-rust)' : 'var(--color-subtle)', fontSize: '0.72rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <Heart style={{ width: 12, height: 12, fill: liked ? 'currentColor' : 'none' }} />
              {likes}
            </button>
          </div>
        </div>
      </div>
    </MotionLink>
  );
}

/* ── Compact card ── Horizontal strip ── */
function CompactCard({ post, index, rank }) {
  const navigate = useNavigate();

  return (
    <MotionLink
      to={`/post/${post.id}`}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group flex items-start gap-3 py-3"
      style={{
        textDecoration: 'none',
        borderBottom: '1px solid var(--color-border-light)',
      }}
    >
      {/* Rank */}
      {rank !== undefined && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            fontWeight: 500,
            color: 'var(--color-gold)',
            minWidth: '1.25rem',
            paddingTop: '2px',
          }}
        >
          {String(rank + 1).padStart(2, '0')}
        </span>
      )}

      {/* Thumbnail */}
      {post.image && (
        <div
          className="img-zoom-wrap flex-shrink-0"
          style={{ width: '64px', height: '64px', borderRadius: '0.5rem', overflow: 'hidden', background: 'var(--color-parchment)' }}
        >
          <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Text */}
      <div className="flex-1 min-w-0">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/topics/${topicSlug(post.category)}`); }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            fontWeight: 500,
            color: 'var(--color-gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.25rem',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          {post.category}
        </button>
        <p
          className="group-hover:text-[color:var(--color-gold)] transition-colors"
          style={{
            fontSize: '0.825rem',
            fontWeight: 500,
            color: 'var(--color-charcoal)',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.title}
        </p>
        <p style={{ fontSize: '0.68rem', color: 'var(--color-subtle)', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
          {post.author} · {formatDate(post.date)}
        </p>
      </div>
    </MotionLink>
  );
}

/* ── Main export — pick variant by prop ── */
export function PostCard({ post, index = 0, featured = false, compact = false }) {
  if (featured) return <FeaturedCard post={post} index={index} />;
  if (compact)  return <CompactCard  post={post} index={index} rank={index} />;
  return <MediumCard post={post} index={index} />;
}
