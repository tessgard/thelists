import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get CSRF token from cookies
const getCSRFToken = () => {
  const name = "csrftoken";
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  console.log("CSRF Token:", cookieValue); // Debug log
  console.log("All cookies:", document.cookie); // Debug log
  return cookieValue;
};

// Initialize CSRF token
let csrfInitialized = false;
const initializeCSRF = async () => {
  if (!csrfInitialized) {
    try {
      await api.get('/csrf/');
      csrfInitialized = true;
      console.log('CSRF token initialized');
    } catch (error) {
      console.error('Failed to initialize CSRF token:', error);
    }
  }
};

// Add CSRF token to requests
api.interceptors.request.use(async (config) => {
  // Skip CSRF for GET requests to csrf endpoint to prevent infinite loop
  if (config.url === '/csrf/') {
    return config;
  }
  
  let csrfToken = getCSRFToken();
  
  // If no CSRF token and this is a POST/PUT/PATCH/DELETE request, get one first
  if (!csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
    await initializeCSRF();
    csrfToken = getCSRFToken();
  }
  
  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
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
        await api.get("/csrf/");

        // Retry the original request with the new token
        const csrfToken = getCSRFToken();
        if (csrfToken) {
          originalRequest.headers["X-CSRFToken"] = csrfToken;
        }

        return api.request(originalRequest);
      } catch (retryError) {
        console.error("Failed to refresh CSRF token:", retryError);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  login: async (username) => {
    await initializeCSRF(); // Ensure CSRF token before login
    return api.post("/auth/login/", { username });
  },
  logout: () => api.post("/auth/logout/"),
  getCurrentUser: () => api.get("/auth/user/"),
  getCSRF: () => api.get("/csrf/"), // Get CSRF token
  initializeCSRF, // Export for manual initialization
};

// Lists API
export const listsAPI = {
  getLists: () => api.get("/lists/"),
  getList: (id) => api.get(`/lists/${id}/`),
  createList: (data) => api.post("/lists/", data),
  updateList: (id, data) => api.patch(`/lists/${id}/`, data),
  deleteList: (id) => api.delete(`/lists/${id}/`),
};

// List Items API
export const itemsAPI = {
  getItems: () => api.get("/items/"),
  createItem: (data) => api.post("/items/", data),
  updateItem: (id, data) => api.patch(`/items/${id}/`, data),
  deleteItem: (id) => api.delete(`/items/${id}/`),
  toggleCheck: (id) => api.patch(`/items/${id}/toggle_check/`),
};

export default api;
