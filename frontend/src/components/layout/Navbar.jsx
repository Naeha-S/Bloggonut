import React from 'react';
import { Search, Menu, User, Bell, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar({ toggleSidebar }) {
  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50 flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text-main transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="font-bold text-lg tracking-tight text-text-main">
          Bloggonut
        </Link>
      </div>
      
      <div className="flex-1 max-w-lg px-8 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted transition-colors" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="input-base w-full py-1.5 pl-9 pr-4 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/write" className="hidden sm:flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors">
          <Edit className="w-4 h-4" />
          Write
        </Link>
        <button className="p-1 rounded hover:bg-surface-hover text-text-muted hover:text-text-main transition-colors hidden sm:block">
          <Bell className="w-5 h-5" />
        </button>
        <Link 
          to="/auth"
          className="btn-primary text-sm py-1.5 px-3"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
}
