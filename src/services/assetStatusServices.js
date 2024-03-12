import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/assetStatus");
  },
  get(id) {
    return apiClient.get(`/assetStatus/${id}`);
  },
  create(data) {
    return apiClient.post("/assetStatus", data);
  },
  update(id, data) {
    return apiClient.put(`/assetStatus/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/assetStatus/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/assetStatus`);
  },
  getForAsset(id) {
    return apiClient.get(`/assetStatus/asset/${id}`);
  },
  getForPerson(id) {
    return apiClient.get(`/assetStatus/person/${id}`);
  },
  
};
