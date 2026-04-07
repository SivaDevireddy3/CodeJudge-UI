// src/services/api.js
import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: BASE });

// Attach JWT token to every request
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('cj_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Redirect to login on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cj_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

// ── Problems ─────────────────────────────────────────
export const problemAPI = {
  getAll: (params) => api.get('/problems', { params }),
  getById: (id) => api.get(`/problems/${id}`),
  create: (data) => api.post('/problems', data),
  update: (id, data) => api.put(`/problems/${id}`, data),
  delete: (id) => api.delete(`/problems/${id}`),
};

// ── Submissions ──────────────────────────────────────
export const submissionAPI = {
  submit: (data) => api.post('/submissions', data),
  getAll: (params) => api.get('/submissions', { params }),
  getById: (id) => api.get(`/submissions/${id}`),
  getMine: () => api.get('/submissions/mine'),
};

// ── Leaderboard ──────────────────────────────────────
export const leaderboardAPI = {
  getGlobal: () => api.get('/leaderboard'),
};

export default api;