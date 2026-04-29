import React, { useState, useEffect, useRef } from 'react';
import { Search, Edit3, Feather, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import brandLogo from '../../assets/hero.png';

const NAV_LINKS = [
  { label: 'Discover', path: '/explore' },
  { label: 'Trending', path: '/trending' },
  { label: 'Saved', path: '/bookmarks' },
];

export function Navbar({ toggleSidebar }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="navbar-soft flex items-center justify-between gap-4 px-5 md:px-8"
      style={{
        height: scrolled ? '52px' : '60px',
        transition: 'height 0.3s ease',
      }}
    >
      {/* Brand */}
      <Link
        to="/"
        className="group flex items-center gap-2.5 shrink-0"
        style={{ textDecoration: 'none' }}
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden"
          style={{
            background: 'var(--color-parchment)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <img src={brandLogo} alt="Bloggonut" className="h-full w-full object-contain p-0.5" />
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            fontWeight: 400,
            color: 'var(--color-charcoal)',
            letterSpacing: '-0.02em',
            transition: 'color 0.2s ease',
          }}
          className="group-hover:text-[color:var(--color-gold)] transition-colors"
        >
          Bloggonut
        </span>
      </Link>

      {/* Nav Links — hidden mobile */}
      <div className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="nav-link"
            style={{
              color: location.pathname === link.path
                ? 'var(--color-charcoal)'
                : undefined,
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xs hidden md:block">
        <div className="search-wrap">
          <div className="search-glow" />
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{
                width: 14, height: 14,
                color: searchFocused ? 'var(--color-gold)' : 'var(--color-subtle)',
                transition: 'color 0.2s ease',
              }}
            />
            <input
              type="text"
              placeholder="Search stories…"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="input-base pl-9 pr-8 py-2"
              style={{ fontSize: '0.825rem' }}
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-subtle)' }}
              >
                <X style={{ width: 12, height: 12 }} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <Link
          to="/write"
          className="hidden sm:flex items-center gap-1.5 nav-link"
          style={{ color: 'var(--color-muted)', fontSize: '0.825rem' }}
        >
          <Edit3 style={{ width: 13, height: 13 }} />
          Write
        </Link>
        <Link
          to="/auth"
          className="btn-primary"
          style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
        >
          Sign in
        </Link>
      </div>
    </nav>
  );
}
