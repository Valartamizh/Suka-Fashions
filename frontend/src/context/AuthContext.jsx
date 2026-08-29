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

  const login = (phone, name = 'Pooja', email = '') => {
    const userData = {
      phone,
      name: name || 'Pooja',
      email: email || `${(name || 'pooja').toLowerCase().replace(/\s+/g, '')}@example.com`,
    };
    setUser(userData);
    try {
      localStorage.setItem('suka_user', JSON.stringify(userData));
    } catch (e) {
      console.error('Error saving user', e);
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prevUser) => {
      const current = prevUser || {
        phone: '+91 98765 43210',
        name: 'Pooja',
        email: 'pooja@example.com',
      };
      const newUserData = { ...current, ...updatedFields };
      try {
        localStorage.setItem('suka_user', JSON.stringify(newUserData));
      } catch (e) {
        console.error('Error updating user', e);
      }
      return newUserData;
    });
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
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, updateUser }}>
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
