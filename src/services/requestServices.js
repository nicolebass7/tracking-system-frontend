//import authServices from "./authServices.js";
import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("requests");
  },
  getAllForUser(userId) {
    return apiClient.get("requests/user/" + userId);
  },
  get(id) {
    return apiClient.get(`requests/${id}`);
  },
  create(data) {
    return apiClient.post("requests",data);
  },
  update(id, data) {
    return apiClient.put(`requests/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`requests/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`requests`);
  },
  findByTitle(title) {
    return apiClient.get(`requests?title=${title}`);
  },
};
