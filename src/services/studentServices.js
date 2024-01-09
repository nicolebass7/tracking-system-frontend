import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("students");
  },
  getAllForUser(userId) {
    return apiClient.get("students/user/" + userId);
  },
  get(id) {
    return apiClient.get(`students/${id}`);
  },
  create(data) {
    return apiClient.post("students", data);
  },
  update(id, data) {
    return apiClient.put(`students/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`students/${id}`);
  },
  deleteAll() {
    return apiClient.delete(`students`);
  },
  getUserId(userId) {
    return apiClient.get("students/userId/"+ userId);
  },
  findByTitle(title) {
    return apiClient.get(`students?title=${title}`);
  },
};
