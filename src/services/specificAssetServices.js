import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get(`/specificAsset/`);
  },
  get(id) {
    return apiClient.get(`/specificAsset/${id}`);
  },
  create(data) {
    return apiClient.post("/specificAsset/", data);
  },
  update(id, data) {
    return apiClient.put(`/specificAsset/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/specificAsset/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/specificAsset`);
  },

 
};
