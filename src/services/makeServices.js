import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/make");
  },
  get(id) {
    return apiClient.get(`/make/${id}`);
  },
  create(data) {
    return apiClient.post("/make", data);
  },
  update(id, data) {
    return apiClient.put(`/make/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/make/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/make`);
  },
  
};
