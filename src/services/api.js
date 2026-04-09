// src/services/api.js
import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: BASE });

// ── Request interceptor: attach JWT ──────────────────────────
api.interceptors.request.use((cfg) => {
    const token = localStorage.getItem('cj_token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

// ── Response interceptor: handle 401 via custom event ────────
// We dispatch a custom event instead of hard-redirecting (SPA-safe)
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('cj_token');
            localStorage.removeItem('cj_user');
            window.dispatchEvent(new CustomEvent('cj:unauthorized'));
        }
        return Promise.reject(err);
    }
);

// ── Helper: extract readable error message ───────────────────
export function getErrorMessage(err) {
    return (
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'An unexpected error occurred'
    );
}

// ── Auth ─────────────────────────────────────────────────────
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    me: () => api.get('/auth/me'),
};

// ── Problems ─────────────────────────────────────────────────
// GET /api/problems → Page<ProblemSummaryResponse>
// GET /api/problems/:id → ProblemDetailResponse
// POST /api/problems (ADMIN) → ProblemDetailResponse
// DELETE /api/problems/:id (ADMIN)
export const problemAPI = {
    getAll: (params) => api.get('/problems', { params }),
    getById: (id) => api.get(`/problems/${id}`),
    create: (data) => api.post('/problems', data),
    update: (id, data) => api.put(`/problems/${id}`, data),
    delete: (id) => api.delete(`/problems/${id}`),
};

// ── Submissions ──────────────────────────────────────────────
// POST /api/submissions → SubmissionResponse
// GET /api/submissions/mine → Page<SubmissionResponse>
// GET /api/submissions/:id → SubmissionResponse
export const submissionAPI = {
    submit: (data) => api.post('/submissions', data),
    getMine: (page = 0, size = 50) => api.get('/submissions/mine', { params: { page, size } }),
    getById: (id) => api.get(`/submissions/${id}`),
};

// ── Leaderboard ──────────────────────────────────────────────
// GET /api/leaderboard → List<LeaderboardEntry>
export const leaderboardAPI = {
    getGlobal: () => api.get('/leaderboard'),
};

export default api;