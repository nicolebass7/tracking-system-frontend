import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("/agreement");
  },
  getAllForUser(userId) {
    return apiClient.get("/agreement/user/" + userId);
  },
  get(id) {
    return apiClient.get(`/agreement/${id}`);
  },
  create(data) {
    return apiClient.post("/agreement", data);
  },
  update(id, data) {
    return apiClient.put(`/agreement/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/agreement/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`/agreement`);
  },
//   findByTitle(title) {
//     return apiClient.get(`/agreement?title=${title}`);
//   },
};
