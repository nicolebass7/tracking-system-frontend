import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/department");
  },
  get(id) {
    return apiClient.get(`/department/${id}`);
  },
  create(data) {
    return apiClient.post("/department", data);
  },
  update(id, data) {
    return apiClient.put(`/department/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/department/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/department`);
  },
  
};
