import React from 'react';
import { Home, Compass, Flame, Bookmark, Settings, X, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import brandLogo from '../../assets/hero.png';
import { TOPICS } from '../../data/topics';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: Flame, label: 'Trending', path: '/trending' },
  { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
];

export function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-background/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-background border-r border-border z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static overflow-x-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="hidden lg:flex items-center gap-3 p-5 border-b border-border">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-secondary border border-border shadow-soft overflow-hidden">
            <img src={brandLogo} alt="Bloggonut logo" className="h-full w-full object-contain p-1" />
          </span>
          <div className="font-display font-semibold text-lg tracking-tight text-text-main">Bloggonut</div>
        </div>
        
        <div className="flex items-center justify-between p-5 border-b border-border lg:hidden">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-secondary border border-border shadow-soft overflow-hidden">
              <img src={brandLogo} alt="Bloggonut logo" className="h-full w-full object-contain p-1" />
            </span>
            <div className="font-display font-semibold text-lg tracking-tight text-text-main">Bloggonut</div>
          </div>
          <button onClick={toggleSidebar} className="p-2 rounded-2xl hover:bg-surface-hover text-text-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-8">
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-bold text-text-subtle uppercase tracking-widest mb-3">Menu</h3>
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm text-text-main hover:bg-surface-secondary hover:text-accent transition-all group font-light"
              >
                <item.icon className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                <span className="font-medium group-hover:font-semibold">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="px-3 text-xs font-bold text-text-subtle uppercase tracking-widest mb-3">Topics</h3>
            <div className="flex flex-col space-y-1 px-1">
              {TOPICS.map((topic) => (
                <Link
                  key={topic.slug}
                  to={`/topics/${topic.slug}`}
                  onClick={toggleSidebar}
                  className="px-3.5 py-2 rounded-2xl text-sm text-text-main hover:bg-surface-secondary hover:text-accent cursor-pointer transition-all font-light"
                >
                  {topic.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 mt-auto border-t border-border">
          <Link to="/auth" className="flex items-center gap-3 px-3.5 py-2.5 cursor-pointer hover:bg-surface-secondary rounded-2xl text-text-muted hover:text-accent transition-all font-light">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium group-hover:font-semibold">Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
