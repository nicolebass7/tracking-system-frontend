import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("user");
  },
  get(id) {
    return apiClient.get(`user/${id}`);
  },
  create(data) {
    return apiClient.post("user", data);
  },
  update(id, data) {
    return apiClient.put(`user/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`user/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`user`);
  },
  findByRole(roleType) {
    return apiClient.get(`user?roleType=${roleType}`);
  },
 
};
