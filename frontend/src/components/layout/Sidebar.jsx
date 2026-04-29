import React, { useState } from 'react';
import { Activity, BookOpen, Bookmark, Compass, Flame, Home, Settings, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import brandLogo from '../../assets/hero.png';
import { TOPICS } from '../../data/topics';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: Flame, label: 'Trending', path: '/trending' },
  { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
];

const ACTIVITY_FEED = [
  { label: 'Fresh post in Technology', time: '2m ago' },
  { label: 'Topic desk update in AI', time: '8m ago' },
  { label: 'Readers active across sections', time: 'live' },
];

export function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const [readingTime] = useState(Math.floor(Math.random() * 8) + 4);

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-black/25 lg:hidden"
          aria-label="Close navigation overlay"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[#111111] bg-[#F9F9F7] transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#111111] px-5 py-4">
          <Link to="/" className="flex items-center gap-3 no-underline" onClick={() => isOpen && toggleSidebar()}>
            <span className="flex h-10 w-10 items-center justify-center border border-[#111111] bg-[#F5F5F2]">
              <img src={brandLogo} alt="Bloggonut" className="h-full w-full object-contain p-1 grayscale" />
            </span>
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[#737373]">City Edition</p>
              <p className="font-display text-2xl font-black uppercase tracking-tight text-[#111111]">Bloggonut</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={toggleSidebar}
            className="inline-flex h-11 w-11 items-center justify-center border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F9F9F7] lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <section className="border-b border-[#111111] pb-5">
            <p className="micro-label">Navigation</p>
            <nav className="mt-4 space-y-2">
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => isOpen && toggleSidebar()}
                    className={`flex items-center gap-3 border px-3 py-3 no-underline transition-all duration-200 ${
                      active
                        ? 'border-[#111111] bg-[#111111] text-[#F9F9F7]'
                        : 'border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F9F9F7]'
                    }`}
                  >
                    <item.icon className="h-4 w-4" strokeWidth={1.5} />
                    <span className="font-mono text-[0.72rem] uppercase tracking-[0.18em]">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </section>

          <section className="border-b border-[#111111] py-5">
            <p className="micro-label">Estimated read</p>
            <p className="mt-3 font-mono text-sm uppercase tracking-[0.16em] text-[#111111]">{readingTime} min on this page</p>
          </section>

          <section className="border-b border-[#111111] py-5">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#111111]" strokeWidth={1.5} />
              <p className="micro-label">Live activity</p>
            </div>
            <div className="space-y-3">
              {ACTIVITY_FEED.map((item) => (
                <div key={item.label} className="rail-item">
                  <div className={`activity-dot ${item.time === 'live' ? 'live' : ''}`} />
                  <div>
                    <p className="font-serif text-sm leading-relaxed text-[#404040]">{item.label}</p>
                    <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[#737373]">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="py-5">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#111111]" strokeWidth={1.5} />
              <p className="micro-label">Topic desks</p>
            </div>
            <div className="space-y-2">
              {TOPICS.map((topic) => (
                <Link
                  key={topic.slug}
                  to={`/topics/${topic.slug}`}
                  onClick={() => isOpen && toggleSidebar()}
                  className="flex items-center justify-between border border-[#111111] px-3 py-3 text-[#111111] no-underline hover:bg-[#111111] hover:text-[#F9F9F7]"
                >
                  <span className="font-mono text-[0.72rem] uppercase tracking-[0.18em]">{topic.label}</span>
                  <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em]">Desk</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="border-t border-[#111111] p-4">
          <Link
            to="/auth"
            onClick={() => isOpen && toggleSidebar()}
            className="flex items-center gap-3 border border-[#111111] px-3 py-3 text-[#111111] no-underline hover:bg-[#111111] hover:text-[#F9F9F7]"
          >
            <Settings className="h-4 w-4" strokeWidth={1.5} />
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.18em]">Account</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
