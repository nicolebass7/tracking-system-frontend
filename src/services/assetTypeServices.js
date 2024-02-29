import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/assetType");
  },
  get(id) {
    return apiClient.get(`/assetType/${id}`);
  },
  create(data) {
    return apiClient.post("/assetType", data);
  },
  update(id, data) {
    return apiClient.put(`/assetType/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/assetType/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/assetType`);
  },
  
};
