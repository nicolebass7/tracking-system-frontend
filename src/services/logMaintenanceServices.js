import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/logMain/");
  },
  get(id) {
    return apiClient.get(`/logMain/${id}`);
  },
  create(data) {
    return apiClient.post("/logMain", data);
  },
  update(id, data) {
    return apiClient.put(`/logMain/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/logMain/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/logMain`);
  },
  
};