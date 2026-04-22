import React from 'react';
import { Search, Menu, Edit, Feather } from 'lucide-react';
import { Link } from 'react-router-dom';
import brandLogo from '../../assets/hero.png';

export function Navbar({ toggleSidebar }) {
  return (
    <nav className="navbar-soft border-b border-border sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:py-5">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2.5 -ml-2 rounded-2xl hover:bg-surface-secondary text-text-muted hover:text-text-main transition-all duration-200 hover:scale-105"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="group flex items-center gap-3 font-display font-semibold text-xl tracking-tight text-text-main hover:text-accent transition-all">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-secondary border border-border shadow-soft overflow-hidden">
            <img src={brandLogo} alt="Bloggonut logo" className="h-full w-full object-contain p-1" />
          </span>
          <span>Bloggonut</span>
        </Link>
      </div>
      
      <div className="flex-1 max-w-lg px-8 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Search stories..." 
            className="input-base w-full py-2.5 pl-11 pr-4 text-sm font-light"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/write" className="hidden sm:flex items-center gap-2 text-sm font-medium text-text-muted hover:text-accent transition-all duration-200 hover:gap-3">
          <Edit className="w-4 h-4" />
          Write
        </Link>
        <Link 
          to="/auth"
          className="btn-primary text-sm py-2.5 px-5 font-medium"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
}
