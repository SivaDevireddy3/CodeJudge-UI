// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // navigateFn is set by AppInner so context can redirect on 401
  const [navigateFn, setNavigateFn] = useState(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('cj_token');
    const saved = localStorage.getItem('cj_user');
    if (token && saved) {
      try {
        const parsed = JSON.parse(saved);
        // Basic expiry check via JWT payload (no library needed)
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload.exp && payload.exp * 1000 > Date.now()) {
            setUser(parsed);
          } else {
            // Token expired — clear storage
            localStorage.removeItem('cj_token');
            localStorage.removeItem('cj_user');
          }
        } else {
          setUser(parsed);
        }
      } catch {
        localStorage.removeItem('cj_token');
        localStorage.removeItem('cj_user');
      }
    }
    setLoading(false);
  }, []);

  // Listen for 401 events from api.js interceptor
  useEffect(() => {
    const handler = () => {
      setUser(null);
      if (navigateFn) navigateFn('login');
    };
    window.addEventListener('cj:unauthorized', handler);
    return () => window.removeEventListener('cj:unauthorized', handler);
  }, [navigateFn]);

  const login = useCallback((token, userData) => {
    localStorage.setItem('cj_token', token);
    localStorage.setItem('cj_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cj_token');
    localStorage.removeItem('cj_user');
    setUser(null);
    if (navigateFn) navigateFn('home');
  }, [navigateFn]);

  const registerNavigate = useCallback((fn) => {
    // Wrap in function so useState doesn't call fn as an initializer
    setNavigateFn(() => fn);
  }, []);

  const isAdmin = user?.role === 'ADMIN';
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isLoggedIn, registerNavigate }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}