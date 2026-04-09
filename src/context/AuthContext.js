import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navigateFn, setNavigateFn] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('cj_token');
    const saved = localStorage.getItem('cj_user');
    if (token && saved) {
      try {
        const parsed = JSON.parse(saved);
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload.exp && payload.exp * 1000 > Date.now()) {
            setUser(parsed);
          } else {
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