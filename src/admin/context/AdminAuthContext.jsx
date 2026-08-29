// Admin auth context — manages admin session state
import React, { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext(null);

// Mock admin user for demo
const MOCK_ADMIN = {
  id: 'USR001',
  name: 'Aditi Sharma',
  email: 'aditi@sukafashions.com',
  role: 'SUPER_ADMIN',
  avatar: 'AS',
};

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    // Check localStorage for persisted session
    try {
      const saved = localStorage.getItem('suka_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (email, password, remember) => {
    // In production this will call Spring Boot /api/admin/auth/login
    // For now, accept any non-empty credentials
    if (email && password) {
      const session = { ...MOCK_ADMIN, email };
      setAdmin(session);
      if (remember) {
        localStorage.setItem('suka_admin_session', JSON.stringify(session));
      } else {
        sessionStorage.setItem('suka_admin_session', JSON.stringify(session));
      }
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('suka_admin_session');
    sessionStorage.removeItem('suka_admin_session');
  };

  const hasPermission = (section, level = 'view') => {
    if (!admin) return false;
    // SUPER_ADMIN has all permissions
    if (admin.role === 'SUPER_ADMIN') return true;
    // For others, check permission matrix (would come from backend in production)
    return true; // simplified for demo
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, hasPermission, isAuthenticated: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
