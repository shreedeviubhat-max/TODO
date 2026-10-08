import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token into all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('first_step_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to catch 401 unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and we had a token, wipe it
      if (localStorage.getItem('first_step_token')) {
        localStorage.removeItem('first_step_token');
        localStorage.removeItem('first_step_user');
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth Endpoints ---
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateAvatar: (data) => api.put('/auth/avatar', data),
};

// --- Daily Logs (Calendar Work Journal) Endpoints ---
export const logsAPI = {
  getMonthLogs: (month) => api.get(`/logs?month=${month}`),
  getLogByDate: (date) => api.get(`/logs/${date}`),
  saveLog: (date, data) => api.put(`/logs/${date}`, data),
  deleteLog: (date) => api.delete(`/logs/${date}`),
};

// --- Reminders Endpoints ---
export const remindersAPI = {
  getReminders: (params) => api.get('/reminders', { params }),
  createReminder: (data) => api.post('/reminders', data),
  updateReminder: (id, data) => api.put(`/reminders/${id}`, data),
  toggleReminder: (id) => api.patch(`/reminders/${id}/toggle`),
  deleteReminder: (id) => api.delete(`/reminders/${id}`),
};

// --- Cozy Quotes Endpoint ---
export const quoteAPI = {
  getQuote: () => api.get('/quote'),
};

export default api;
