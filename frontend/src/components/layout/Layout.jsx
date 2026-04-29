import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [ripples, setRipples] = useState([]);

  /* Cursor ripple on click */
  const handleClick = useCallback((e) => {
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
  }, []);

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--color-cream)', color: 'var(--color-charcoal)' }}
      onClick={handleClick}
    >
      {/* Cursor ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="cursor-ripple"
          style={{ left: r.x, top: r.y }}
        />
      ))}

      {/* Left sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

      {/* Main content column */}
      <div
        className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto"
        id="main-scroll-container"
      >
        <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <main
          className="flex-1 w-full"
          style={{
            maxWidth: '100%',
            padding: '2rem 2rem 5rem',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
