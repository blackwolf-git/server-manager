import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (userData) => api.put('/user/profile', userData);

export const getServices = () => api.get('/services');
export const createContactRequest = (requestData) => api.post('/contact', requestData);
export const scheduleMeeting = (meetingData) => api.post('/meetings', meetingData);
export const submitBrief = (briefData) => api.post('/briefs', briefData);

export const getDashboardStats = () => api.get('/dashboard/stats');
export const getRecentActivity = () => api.get('/dashboard/activity');

export default api;
