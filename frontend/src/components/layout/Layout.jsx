import React, { useCallback, useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [ripples, setRipples] = useState([]);

  const handleClick = useCallback((event) => {
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x: event.clientX, y: event.clientY }]);
    setTimeout(() => setRipples((prev) => prev.filter((ripple) => ripple.id !== id)), 500);
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-main" onClick={handleClick}>
      {ripples.map((ripple) => (
        <span key={ripple.id} className="cursor-ripple" style={{ left: ripple.x, top: ripple.y }} />
      ))}

      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen((open) => !open)} />

        <div className="flex min-w-0 flex-1 flex-col border-l border-[#111111] bg-[#F9F9F7] lg:border-l-0">
          <Navbar toggleSidebar={() => setSidebarOpen((open) => !open)} />
          <main
            id="main-scroll-container"
            className="flex-1 overflow-y-auto"
          >
            <div className="mx-auto w-full max-w-screen-xl px-0 md:px-4">
              <div className="newsprint-shell min-h-[calc(100vh-65px)] px-4 py-6 md:px-6 md:py-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
