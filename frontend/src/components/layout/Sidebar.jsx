import React from 'react';
import { Home, Compass, Flame, Bookmark, Settings, X, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: Flame, label: 'Trending', path: '/trending' },
  { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
];

const categories = ['Technology', 'Design', 'Development', 'AI', 'Startup', 'Lifestyle'];

export function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-background/80 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-background border-r border-border z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="hidden lg:flex items-center justify-between p-4 border-b border-border">
          <div className="font-bold text-lg tracking-tight text-text-main">Bloggonut</div>
        </div>
        
        <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
          <div className="font-bold text-lg tracking-tight text-text-main">Bloggonut</div>
          <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-surface-hover text-text-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-8">
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-semibold text-text-muted mb-2">MENU</h3>
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-text-main hover:bg-surface-hover transition-colors group"
              >
                <item.icon className="w-4 h-4 text-text-muted group-hover:text-text-main" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-text-muted mb-2">TOPICS</h3>
            <div className="flex flex-col space-y-1 px-1">
              {categories.map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1.5 rounded-md text-sm text-text-main hover:bg-surface-hover cursor-pointer transition-colors"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 mt-auto border-t border-border">
          <Link to="/auth" className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-surface-hover rounded-md text-text-muted transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
