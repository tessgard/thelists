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
  console.log('CSRF Token:', cookieValue); // Debug log
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

// Handle CSRF errors and retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If we get a 403 and it's a CSRF error, try to get a new token
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Fetch a fresh CSRF token
        await api.get('/csrf/');
        
        // Retry the original request with the new token
        const csrfToken = getCSRFToken();
        if (csrfToken) {
          originalRequest.headers['X-CSRFToken'] = csrfToken;
        }
        
        return api.request(originalRequest);
      } catch (retryError) {
        console.error('Failed to refresh CSRF token:', retryError);
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username) => api.post('/auth/login/', { username }),
  logout: () => api.post('/auth/logout/'),
  getCurrentUser: () => api.get('/auth/user/'),
  getCSRF: () => api.get('/csrf/'), // Get CSRF token
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
