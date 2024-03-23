import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/assetData");
  },
  get(id) {
    return apiClient.get(`/assetData/${id}`);
  },
  create(data) {
    return apiClient.post("/assetData", data);
  },
  update(id, data) {
    return apiClient.put(`/assetData/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/assetData/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/assetData`);
  },
  getForType(id) {
    return apiClient.get(`/assetData/assetType/${id}`);
  },
 
};  