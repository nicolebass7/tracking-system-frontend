import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/person");
  },
  get(id) {
    return apiClient.get(`/person/${id}`);
  },
  create(data) {
    return apiClient.post("/person", data);
  },
  update(id, data) {
    return apiClient.put(`/person/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/person/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/person`);
  },
  
};
