import React, { useState, useEffect } from 'react';
import { Home, Compass, Flame, Bookmark, Settings, X, Clock, TrendingUp, Activity, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import brandLogo from '../../assets/hero.png';
import { TOPICS } from '../../data/topics';

const NAV_ITEMS = [
  { icon: Home,     label: 'Home',      path: '/',           desc: 'Front page' },
  { icon: Compass,  label: 'Explore',   path: '/explore',    desc: 'All stories' },
  { icon: Flame,    label: 'Trending',  path: '/trending',   desc: 'Most read' },
  { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks',  desc: 'Saved' },
];

const TRENDING_TAGS = ['AI', 'Design', 'React', 'Startup', 'TypeScript', 'UX', 'Web3', 'Career'];

const ACTIVITY_FEED = [
  { label: 'New post in Technology',   time: '2m ago',  live: true },
  { label: 'Trending: The design shift', time: '8m ago', live: false },
  { label: 'New post in AI',           time: '15m ago', live: false },
  { label: '12 readers active now',    time: 'live',    live: true },
];

export function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const [readingTime] = useState(Math.floor(Math.random() * 8) + 4);

  return (
    <>
      {/* Overlay — mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(28, 25, 23, 0.35)', backdropFilter: 'blur(4px)' }}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          width: '240px',
          background: 'var(--color-warm-white)',
          borderRight: '1px solid var(--color-border-light)',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        {/* Logo header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--color-border-light)' }}
        >
          <Link to="/" className="flex items-center gap-2.5" onClick={() => isOpen && toggleSidebar()}>
            <span
              className="flex h-7 w-7 items-center justify-center rounded-md overflow-hidden"
              style={{ background: 'var(--color-parchment)', border: '1px solid var(--color-border)' }}
            >
              <img src={brandLogo} alt="Bloggonut" className="h-full w-full object-contain p-0.5" />
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 400,
                color: 'var(--color-charcoal)',
                letterSpacing: '-0.02em',
              }}
            >
              Bloggonut
            </span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--color-subtle)' }}
          >
            <X style={{ width: 15, height: 15 }} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--color-border) transparent' }}>
          {/* Navigation */}
          <div className="px-3 pt-4 pb-2">
            <p className="micro-label px-2 mb-3" style={{ fontSize: '0.58rem' }}>Navigation</p>
            <nav className="space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => isOpen && toggleSidebar()}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all"
                    style={{
                      background: active ? 'var(--color-parchment)' : 'transparent',
                      color: active ? 'var(--color-charcoal)' : 'var(--color-muted)',
                    }}
                  >
                    <item.icon
                      style={{
                        width: 15, height: 15,
                        color: active ? 'var(--color-gold)' : 'var(--color-subtle)',
                        transition: 'color 0.2s',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        style={{
                          fontSize: '0.825rem',
                          fontWeight: active ? 500 : 400,
                          color: active ? 'var(--color-charcoal)' : 'inherit',
                          lineHeight: 1.2,
                        }}
                      >
                        {item.label}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div style={{ height: '1px', background: 'var(--color-border-light)', margin: '0.75rem 1.25rem' }} />

          {/* Reading time indicator */}
          <div className="px-5 py-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock style={{ width: 11, height: 11, color: 'var(--color-gold)' }} />
              <span className="micro-label" style={{ fontSize: '0.58rem' }}>Est. read</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-charcoal)', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>
              ~{readingTime} min on this page
            </p>
            <div
              className="mt-2 rounded-full overflow-hidden"
              style={{ height: '3px', background: 'var(--color-border)' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(readingTime / 12) * 100}%`,
                  background: 'linear-gradient(90deg, var(--color-gold), var(--color-rust))',
                }}
              />
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--color-border-light)', margin: '0.25rem 1.25rem 0.75rem' }} />

          {/* Trending tags */}
          <div className="px-5 py-2">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp style={{ width: 11, height: 11, color: 'var(--color-gold)' }} />
              <span className="micro-label" style={{ fontSize: '0.58rem' }}>Trending tags</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TRENDING_TAGS.map((tag) => (
                <Link
                  key={tag}
                  to={`/topics/${tag.toLowerCase()}`}
                  onClick={() => isOpen && toggleSidebar()}
                  className="tag-chip"
                  style={{ fontSize: '0.58rem' }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--color-border-light)', margin: '0.75rem 1.25rem' }} />

          {/* Activity feed */}
          <div className="px-5 py-2">
            <div className="flex items-center gap-2 mb-3">
              <Activity style={{ width: 11, height: 11, color: 'var(--color-gold)' }} />
              <span className="micro-label" style={{ fontSize: '0.58rem' }}>Live activity</span>
            </div>
            <div className="space-y-2.5">
              {ACTIVITY_FEED.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className={`activity-dot mt-1.5 ${item.live ? 'live' : ''}`}
                    style={{ background: item.live ? 'var(--color-gold)' : 'var(--color-border)' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-ink)', lineHeight: 1.4 }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--color-subtle)', fontFamily: 'var(--font-mono)' }}>
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--color-border-light)', margin: '0.75rem 1.25rem' }} />

          {/* Topics */}
          <div className="px-3 py-2 pb-4">
            <div className="flex items-center gap-2 px-2 mb-3">
              <BookOpen style={{ width: 11, height: 11, color: 'var(--color-gold)' }} />
              <span className="micro-label" style={{ fontSize: '0.58rem' }}>Topics</span>
            </div>
            <div className="space-y-0.5">
              {TOPICS.map((topic) => (
                <Link
                  key={topic.slug}
                  to={`/topics/${topic.slug}`}
                  onClick={() => isOpen && toggleSidebar()}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors group"
                  style={{ color: 'var(--color-muted)' }}
                >
                  <span
                    className="transition-colors"
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 400,
                      color: 'inherit',
                    }}
                  >
                    {topic.label}
                  </span>
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--color-subtle)',
                      marginLeft: 'auto',
                    }}
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-4 py-3"
          style={{ borderTop: '1px solid var(--color-border-light)' }}
        >
          <Link
            to="/auth"
            onClick={() => isOpen && toggleSidebar()}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors"
            style={{ color: 'var(--color-subtle)', fontSize: '0.8rem' }}
          >
            <Settings style={{ width: 14, height: 14 }} />
            Settings
          </Link>
        </div>
      </aside>
    </>
  );
}
