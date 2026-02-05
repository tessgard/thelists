import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get CSRF token from cookies
const getCSRFToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

// Add CSRF token to requests
api.interceptors.request.use((config) => {
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (username) => api.post('/auth/login/', { username }),
  logout: () => api.post('/auth/logout/'),
  getCurrentUser: () => api.get('/auth/user/'),
};

// Lists API
export const listsAPI = {
  getLists: () => api.get('/lists/'),
  getList: (id) => api.get(`/lists/${id}/`),
  createList: (data) => api.post('/lists/', data),
  updateList: (id, data) => api.patch(`/lists/${id}/`, data),
  deleteList: (id) => api.delete(`/lists/${id}/`),
};

// List Items API
export const itemsAPI = {
  getItems: () => api.get('/items/'),
  createItem: (data) => api.post('/items/', data),
  updateItem: (id, data) => api.patch(`/items/${id}/`, data),
  deleteItem: (id) => api.delete(`/items/${id}/`),
  toggleCheck: (id) => api.patch(`/items/${id}/toggle_check/`),
};

export default api;
