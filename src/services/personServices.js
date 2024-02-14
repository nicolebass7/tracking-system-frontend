import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/persons");
  },
  get(id) {
    return apiClient.get(`/persons/${id}`);
  },
  create(data) {
    return apiClient.post("/persons", data);
  },
  update(id, data) {
    return apiClient.put(`/persons/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/persons/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/persons`);
  },
  
};
