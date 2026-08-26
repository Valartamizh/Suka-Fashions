import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('suka_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Error loading saved user', e);
    }
  }, []);

  const login = (phone) => {
    const userData = {
      phone,
      name: 'Aditi Sharma',
      email: 'aditi.sharma@example.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=80&auto=format&fit=crop&crop=face',
    };
    setUser(userData);
    try {
      localStorage.setItem('suka_user', JSON.stringify(userData));
    } catch (e) {
      console.error('Error saving user', e);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('suka_user');
    } catch (e) {
      console.error('Error clearing user', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
