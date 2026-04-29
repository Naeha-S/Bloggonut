import React, { useState } from 'react';
import { Edit3, Menu, Search, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import brandLogo from '../../assets/hero.png';

const NAV_LINKS = [
  { label: 'Discover', path: '/explore' },
  { label: 'Trending', path: '/trending' },
  { label: 'Saved', path: '/bookmarks' },
];

export function Navbar({ toggleSidebar }) {
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();

  return (
    <nav className="navbar-soft border-b border-[#111111] px-4 py-3 md:px-6">
      <div className="mx-auto flex max-w-screen-xl items-center gap-4">
        <button
          type="button"
          onClick={toggleSidebar}
          className="topic-focus inline-flex h-11 w-11 items-center justify-center border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F9F9F7] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>

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

        <div className="ml-auto flex items-center gap-3">
          <Link to="/write" className="nav-link hidden md:inline-flex">
            <Edit3 className="h-4 w-4" strokeWidth={1.5} />
            Write
          </Link>
          <Link to="/auth" className="btn-primary">
            Sign in
          </Link>
        </div>
      </div>
    </nav>
  );
}
