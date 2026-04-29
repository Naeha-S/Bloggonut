import React, { useMemo, useState } from 'react';
import { Activity, BookOpen, Bookmark, Compass, Flame, Home, Settings, User, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import brandLogo from '../../assets/hero.png';
import { TOPICS } from '../../data/topics';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', path: '/', desc: 'Front page' },
  { icon: Compass, label: 'Explore', path: '/explore', desc: 'All stories' },
  { icon: Flame, label: 'Trending', path: '/trending', desc: 'Most read' },
  { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks', desc: 'Saved reads' },
];

const ACTIVITY_FEED = [
  { label: 'Fresh post in Technology', time: '2m ago', live: true },
  { label: 'Topic desk update in AI', time: '8m ago', live: false },
  { label: 'Readers active across sections', time: 'live', live: true },
];

export function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const [readingTime] = useState(Math.floor(Math.random() * 8) + 4);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('bms_user') || 'null');
    } catch {
      return null;
    }
  }, []);

  const accountName =
    currentUser?.display_name ||
    currentUser?.name ||
    currentUser?.email?.split('@')[0] ||
    'Guest Reader';

  const accountDetail = currentUser?.email || 'Not signed in';

  return (
    <>
      {isOpen ? (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-black/25 lg:hidden"
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex w-[272px] flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: '#F9F9F7',
          borderRight: '1px solid #111111',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #E5E5E0' }}>
          <Link to="/" className="flex items-center gap-2.5 no-underline" onClick={() => isOpen && toggleSidebar()}>
            <span
              className="flex h-8 w-8 items-center justify-center overflow-hidden"
              style={{ background: '#F5F5F2', border: '1px solid #111111' }}
            >
              <img src={brandLogo} alt="Bloggonut" className="h-full w-full object-contain p-0.5 grayscale" />
            </span>
            <div>
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[#737373]">Morning Edition</p>
              <p className="font-display text-[1.05rem] leading-none tracking-tight text-[#111111]">Bloggonut</p>
            </div>
          </Link>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 transition-colors"
            style={{ color: '#737373', border: '1px solid #111111' }}
            aria-label="Close navigation"
          >
            <X style={{ width: 15, height: 15 }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#111111 transparent' }}>
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
                    className="flex items-center gap-3 px-3 py-2.5 group no-underline transition-all"
                    style={{
                      background: active ? '#111111' : 'transparent',
                      color: active ? '#F9F9F7' : '#525252',
                      border: '1px solid #111111',
                    }}
                  >
                    <item.icon
                      style={{
                        width: 15,
                        height: 15,
                        color: active ? '#F9F9F7' : '#111111',
                        transition: 'color 0.2s',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 500,
                          lineHeight: 1.2,
                          fontFamily: 'var(--font-mono)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.14em',
                        }}
                      >
                        {item.label}
                      </p>
                      <p
                        style={{
                          fontSize: '0.66rem',
                          color: active ? '#E5E5E0' : '#737373',
                          marginTop: '0.2rem',
                          fontFamily: 'var(--font-serif)',
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div style={{ height: '1px', background: '#E5E5E0', margin: '0.75rem 1.25rem' }} />

          <div className="px-5 py-3">
            <p className="micro-label mb-3" style={{ fontSize: '0.58rem' }}>Estimated Read</p>
            <p style={{ fontSize: '0.82rem', color: '#111111', fontWeight: 500, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              ~{readingTime} min on this page
            </p>
          </div>

          <div style={{ height: '1px', background: '#E5E5E0', margin: '0.25rem 1.25rem 0.75rem' }} />

          <div className="px-5 py-2">
            <div className="flex items-center gap-2 mb-3">
              <Activity style={{ width: 11, height: 11, color: '#111111' }} />
              <span className="micro-label" style={{ fontSize: '0.58rem' }}>Live Activity</span>
            </div>
            <div className="space-y-2.5">
              {ACTIVITY_FEED.map((item, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <div
                    className={`activity-dot mt-1.5 ${item.live ? 'live' : ''}`}
                    style={{ background: item.live ? '#CC0000' : '#A3A3A3' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: '0.75rem', color: '#404040', lineHeight: 1.4, fontFamily: 'var(--font-serif)' }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: '0.65rem', color: '#737373', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: '1px', background: '#E5E5E0', margin: '0.75rem 1.25rem' }} />

          <div className="px-3 py-2 pb-4">
            <div className="flex items-center gap-2 px-2 mb-3">
              <BookOpen style={{ width: 11, height: 11, color: '#111111' }} />
              <span className="micro-label" style={{ fontSize: '0.58rem' }}>Topics</span>
            </div>
            <div className="space-y-0.5">
              {TOPICS.map((topic) => (
                <Link
                  key={topic.slug}
                  to={`/topics/${topic.slug}`}
                  onClick={() => isOpen && toggleSidebar()}
                  className="flex items-center gap-2 px-3 py-2 transition-colors no-underline"
                  style={{ color: '#525252', border: '1px solid transparent' }}
                >
                  <span
                    style={{
                      fontSize: '0.76rem',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'inherit',
                    }}
                  >
                    {topic.label}
                  </span>
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#737373',
                      marginLeft: 'auto',
                    }}
                  >
                    DESK
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-4" style={{ borderTop: '1px solid #111111' }}>
          <div
            className="mb-3 px-3 py-3"
            style={{ border: '1px solid #111111', background: currentUser ? '#F5F5F2' : '#111111', color: currentUser ? '#111111' : '#F9F9F7' }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="flex h-9 w-9 items-center justify-center"
                style={{ border: `1px solid ${currentUser ? '#111111' : '#F9F9F7'}` }}
              >
                <User style={{ width: 15, height: 15 }} />
              </div>
              <div className="min-w-0">
                <p style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                  {accountName}
                </p>
                <p
                  style={{
                    fontSize: '0.66rem',
                    fontFamily: 'var(--font-serif)',
                    color: currentUser ? '#525252' : '#E5E5E0',
                    lineHeight: 1.4,
                    marginTop: '0.15rem',
                    wordBreak: 'break-word',
                  }}
                >
                  {accountDetail}
                </p>
              </div>
            </div>
            <p
              style={{
                fontSize: '0.62rem',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: currentUser ? '#737373' : '#E5E5E0',
              }}
            >
              {currentUser ? 'Signed in' : 'Guest mode'}
            </p>
          </div>

          <Link
            to="/auth"
            onClick={() => isOpen && toggleSidebar()}
            className="flex items-center gap-2.5 px-3 py-2.5 no-underline transition-colors"
            style={{ color: '#525252', border: '1px solid #111111' }}
          >
            <Settings style={{ width: 14, height: 14, color: '#111111' }} />
            <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              {currentUser ? 'Account Settings' : 'Sign In'}
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
