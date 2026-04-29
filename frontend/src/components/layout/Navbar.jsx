import React, { useState } from 'react';
import { Edit3, LogOut, Menu, Search, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import brandLogo from '../../assets/hero.png';
import { useAuth } from '../../lib/useAuth';
import { NotificationBell } from '../NotificationBell';

const NAV_LINKS = [
  { label: 'Discover', path: '/explore' },
  { label: 'Trending', path: '/trending' },
  { label: 'Saved', path: '/bookmarks' },
];

function RolePill({ role }) {
  if (!role) return null;
  const isAuthor = role === 'author';
  return (
    <span
      className="hidden md:inline-flex items-center gap-1 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em]"
      style={{
        border: '1px solid #111111',
        background: isAuthor ? '#111111' : '#F5F5F2',
        color: isAuthor ? '#F9F9F7' : '#525252',
      }}
    >
      {isAuthor ? '✒' : '◎'} {isAuthor ? 'Author' : 'Admirer'}
    </span>
  );
}

export function Navbar({ toggleSidebar }) {
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();
  const { user, isLoggedIn, role, logout } = useAuth();

  const displayName =
    user?.display_name || user?.email?.split('@')[0] || '';

  return (
    <nav className="navbar-soft border-b border-[#111111] px-4 py-3 md:px-6">
      <div className="mx-auto flex max-w-screen-xl items-center gap-4">
        {/* Hamburger (mobile) */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="topic-focus inline-flex h-11 w-11 items-center justify-center border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F9F9F7] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>

        {/* Brand */}
        <Link to="/" className="group flex items-center gap-3 no-underline">
          <span className="flex h-11 w-11 items-center justify-center border border-[#111111] bg-[#F5F5F2]">
            <img src={brandLogo} alt="Bloggonut" className="h-full w-full object-contain p-1 grayscale" />
          </span>
          <div>
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.22em] text-[#737373]">Vol. 1</p>
            <p className="font-display text-2xl font-black uppercase tracking-tight text-[#111111] group-hover:text-[#CC0000]">
              Bloggonut
            </p>
          </div>
        </Link>

        {/* Center nav links */}
        <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <div className="hidden max-w-sm flex-1 md:block">
          <div className="search-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search the archive"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                className="input-base pl-10 pr-9"
              />
              {searchValue ? (
                <button
                  type="button"
                  onClick={() => setSearchValue('')}
                  className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center text-[#737373] hover:text-[#111111]"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          <Link to="/write" className="nav-link hidden md:inline-flex">
            <Edit3 className="h-4 w-4" strokeWidth={1.5} />
            Write
          </Link>

          {isLoggedIn ? (
            <>
              {/* Role pill */}
              <RolePill role={role} />

              {/* Notification bell */}
              <NotificationBell />

              {/* User chip + logout */}
              <div className="hidden md:flex items-center gap-2">
                <span
                  className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#525252] max-w-[120px] truncate"
                  title={displayName}
                >
                  {displayName}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-9 w-9 items-center justify-center border border-[#111111] text-[#111111] transition-all hover:bg-[#CC0000] hover:border-[#CC0000] hover:text-white"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-primary">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
