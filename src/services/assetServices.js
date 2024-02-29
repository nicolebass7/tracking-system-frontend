import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/asset");
  },
  get(id) {
    return apiClient.get(`/asset/${id}`);
  },
  create(data) {
    return apiClient.post("/asset", data);
  },
  update(id, data) {
    return apiClient.put(`/asset/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/asset/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/asset`);
  },
  
};
