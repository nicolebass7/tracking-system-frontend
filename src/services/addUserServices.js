//import authServices from "./authServices.js";
import apiClient from "./services.js";

export default {
  getAll() {
    return apiClient.get("user");
  },
  getAllForUser(userId) {
    return apiClient.get("user/user/" + userId);
  },
  get(id) {
    return apiClient.get(`user/${id}`);
  },
 
  create(data) {
    return apiClient.post("user",data);
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
  findByTitle(title) {
    return apiClient.get(`addNewUser?title=${title}`);
  },
};
