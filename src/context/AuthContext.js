// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('cj_token');
    const saved = localStorage.getItem('cj_user');
    if (token && saved) {
      try { setUser(JSON.parse(saved)); } catch { }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('cj_token', token);
    localStorage.setItem('cj_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('cj_token');
    localStorage.removeItem('cj_user');
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}