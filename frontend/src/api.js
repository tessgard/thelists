import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
