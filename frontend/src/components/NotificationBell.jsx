import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, Check, CheckCheck, X } from 'lucide-react';
import { useAuth } from '../lib/useAuth';

const API = 'http://localhost:5000';

const TYPE_ICON = {
  comment_removed: '⚠',
  mention: '@',
  default: '●',
};

export function NotificationBell() {
  const { token, isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setNotifications(await res.json());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Poll every 30 s while logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [isLoggedIn, fetchNotifications]);

  // Close panel on outside click
  useEffect(() => {
    const onClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        !btnRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const markRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    await fetch(`${API}/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await fetch(`${API}/api/notifications/read-all`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  if (!isLoggedIn) return null;

  return (
    <div className="notif-bell-wrap">
      {/* Bell button */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => { setOpen((v) => !v); if (!open) fetchNotifications(); }}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        className="notif-bell-btn"
      >
        <Bell className="h-4 w-4" strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span className="notif-badge" aria-hidden="true">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div ref={panelRef} className="notif-panel" role="region" aria-label="Notifications">
          {/* Panel header */}
          <div className="notif-panel-header">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#111111]">
              Notifications
            </p>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="notif-mark-all-btn"
                  title="Mark all read"
                >
                  <CheckCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em]">
                    All read
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="notif-close-btn"
                aria-label="Close notifications"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="notif-list">
            {loading ? (
              <div className="notif-empty">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[#737373]">
                  Loading…
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notif-empty">
                <Bell className="h-6 w-6 text-[#A3A3A3]" strokeWidth={1} />
                <p className="mt-2 font-serif text-sm text-[#737373]">
                  No notifications yet.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notif-item ${notif.is_read ? 'notif-item--read' : 'notif-item--unread'}`}
                >
                  <div className="notif-item-icon">
                    {TYPE_ICON[notif.type] || TYPE_ICON.default}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-[0.82rem] leading-snug text-[#404040]">
                      {notif.message}
                    </p>
                    <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[#A3A3A3]">
                      {new Date(notif.created_at).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric',
                      })}
                    </p>
                  </div>
                  {!notif.is_read && (
                    <button
                      type="button"
                      onClick={() => markRead(notif.id)}
                      className="notif-read-btn"
                      title="Mark as read"
                      aria-label="Mark as read"
                    >
                      <Check className="h-3 w-3" strokeWidth={2} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
