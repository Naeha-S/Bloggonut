import { useCallback, useEffect, useState } from 'react';

/**
 * useAuth — single source of truth for authentication state across the app.
 *
 * Reads from localStorage keys:
 *   bms_token  → JWT access token
 *   bms_user   → serialized user object { id, email, role, display_name }
 *
 * Provides:
 *   user        → parsed user object or null
 *   token       → string or null
 *   isLoggedIn  → boolean
 *   role        → 'author' | 'admirer' | null
 *   logout()    → clears storage and reloads
 *   refresh()   → re-reads storage (call after login)
 */
export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bms_user') || 'null');
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('bms_token') || null);

  // Re-sync when storage changes in other tabs or same tab via custom event
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === 'bms_user' || event.key === 'bms_token') {
        refresh(false); // don't dispatch event to avoid infinite loops
      }
    };
    const onAuthChange = () => refresh(false);

    window.addEventListener('storage', onStorage);
    window.addEventListener('auth-change', onAuthChange);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth-change', onAuthChange);
    };
  }, []);

  const refresh = useCallback((dispatchEvent = true) => {
    try {
      setUser(JSON.parse(localStorage.getItem('bms_user') || 'null'));
    } catch {
      setUser(null);
    }
    setToken(localStorage.getItem('bms_token') || null);
    if (dispatchEvent) {
      window.dispatchEvent(new Event('auth-change'));
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('bms_token');
    localStorage.removeItem('bms_user');
    setUser(null);
    setToken(null);
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/';
  }, []);

  return {
    user,
    token,
    isLoggedIn: Boolean(token && user),
    role: user?.role || null,
    logout,
    refresh,
  };
}
