import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getMe: () => api.get('/api/auth/me'),
  logout: () => api.post('/api/auth/logout'),
};

// User APIs
export const userAPI = {
  getUsers: () => api.get('/api/users'),
  getUser: (userId) => api.get(`/api/users/${userId}`),
  updateUser: (userId, data) => api.put(`/api/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/api/users/${userId}`),
  updateShift: (userId, shiftData) => api.put(`/api/users/${userId}/shift`, shiftData),
};

// Work Session APIs
export const sessionAPI = {
  startSession: () => api.post('/api/work-sessions/start'),
  endSession: (sessionId) => api.post(`/api/work-sessions/end/${sessionId}`),
  getActiveSession: () => api.get('/api/work-sessions/active'),
  getMonitoringStatus: () => api.get('/api/work-sessions/status'),
  getSessionHistory: (days = 7) => api.get(`/api/work-sessions/history?days=${days}`),
  getSession: (sessionId) => api.get(`/api/work-sessions/${sessionId}`),
};

// Face Recognition APIs
export const faceAPI = {
  registerFace: (formData) => api.post('/api/face/register-face', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  detectFace: (formData) => api.post('/api/face/detect', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  verifyFace: (formData) => api.post('/api/face/verify', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  processFrame: (formData) => api.post('/api/face/process-frame', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  checkRegistration: () => api.get('/api/face/check-registration'),
};

// Manager APIs
export const managerAPI = {
  getEmployees: () => api.get('/api/managers/employees'),
  createEmployee: (employeeData) => api.post('/api/managers/employees', employeeData),
  getManagerWorkHours: (date) => api.get(`/api/managers/work-hours${date ? `?date=${date}` : ''}`),
  getEmployeeWorkHours: (employeeId, date) => 
    api.get(`/api/managers/employees/${employeeId}/work-hours${date ? `?date=${date}` : ''}`),
};

// Admin APIs
export const adminAPI = {
  getAllUsers: (role) => api.get(`/api/admin/users${role ? `?role=${role}` : ''}`),
  getAllWorkHours: (date, userId) => {
    let url = '/api/admin/work-hours';
    const params = [];
    if (date) params.push(`date=${date}`);
    if (userId) params.push(`user_id=${userId}`);
    if (params.length) url += `?${params.join('&')}`;
    return api.get(url);
  },
  getCalendarData: (startDate, endDate, userId) => {
    let url = `/api/admin/calendar?start_date=${startDate}&end_date=${endDate}`;
    if (userId) url += `&user_id=${userId}`;
    return api.get(url);
  },
  getStatistics: () => api.get('/api/admin/statistics'),
};

export default api;
