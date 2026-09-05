// Admin auth context — manages persistent admin session with extended 30-day lifetime
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminAuthContext = createContext(null);

const STORAGE_KEY = 'suka_admin_session';
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 Days Long Extended Session

// Default Mock Admin User
const MOCK_ADMIN = {
  id: 'USR001',
  name: 'Aditi Sharma',
  email: 'aditi@sukafashions.com',
  role: 'SUPER_ADMIN',
  avatar: 'AS',
};

// Helper to retrieve and validate persisted session from localStorage or sessionStorage
function getPersistedAdminSession() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = sessionStorage.getItem(STORAGE_KEY);
    }
    if (!raw) return null;

    const session = JSON.parse(raw);
    if (!session || !session.email) return null;

    // Check expiration if present
    if (session.expiresAt && Date.now() > Number(session.expiresAt)) {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    // Refresh expiry on successful load to keep session alive
    const refreshed = {
      ...session,
      lastActive: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshed));
    } catch (_) {}

    return refreshed;
  } catch (err) {
    console.warn('Error restoring admin session:', err);
    return null;
  }
}

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(getPersistedAdminSession);

  // Extend session expiration on user activity
  const refreshSession = useCallback(() => {
    setAdmin((current) => {
      if (!current) return null;
      const updated = {
        ...current,
        lastActive: Date.now(),
        expiresAt: Date.now() + SESSION_DURATION_MS,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  }, []);

  // Listen to window focus or user interactions to keep session fresh
  useEffect(() => {
    if (!admin) return;

    const handleActivity = () => {
      // Throttle refresh to at most once per 5 minutes
      if (admin.lastActive && Date.now() - admin.lastActive > 5 * 60 * 1000) {
        refreshSession();
      }
    };

    window.addEventListener('focus', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('focus', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [admin, refreshSession]);

  const login = (email, password, remember = true) => {
    if (email && password) {
      const now = Date.now();
      const session = {
        ...MOCK_ADMIN,
        email,
        loginTime: now,
        lastActive: now,
        expiresAt: now + SESSION_DURATION_MS,
      };

      setAdmin(session);

      // Always persist in localStorage to survive browser/tab refresh
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } catch (err) {
        console.error('Failed to save admin session:', err);
      }

      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setAdmin(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  };

  const hasPermission = (section, level = 'view') => {
    if (!admin) return false;
    if (admin.role === 'SUPER_ADMIN') return true;
    return true;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        login,
        logout,
        refreshSession,
        hasPermission,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
