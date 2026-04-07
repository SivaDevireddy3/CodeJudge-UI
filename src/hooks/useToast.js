// src/hooks/useToast.js
import { useState, useCallback } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const dismiss = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);

  const toast = {
    success: msg => addToast(msg, 'success'),
    error: msg => addToast(msg, 'error'),
    warning: msg => addToast(msg, 'warning'),
    info: msg => addToast(msg, 'info'),
  };

  return { toast, toasts, dismiss };
}