import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'https://codejudge-service.onrender.com/api';

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((cfg) => {
    const token = localStorage.getItem('cj_token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

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

export function getErrorMessage(err) {
    return (
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'An unexpected error occurred'
    );
}

export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    me: () => api.get('/auth/me'),
};

export const problemAPI = {
    getAll: (params) => api.get('/problems', { params }),
    getById: (id) => api.get(`/problems/${id}`),
    create: (data) => api.post('/problems', data),
    update: (id, data) => api.put(`/problems/${id}`, data),
    delete: (id) => api.delete(`/problems/${id}`),
};

export const submissionAPI = {
    submit: (data) => api.post('/submissions', data),
    getMine: (page = 0, size = 50) => api.get('/submissions/mine', { params: { page, size } }),
    getById: (id) => api.get(`/submissions/${id}`),
};


export const leaderboardAPI = {
    getGlobal: () => api.get('/leaderboard'),
};

export default api;