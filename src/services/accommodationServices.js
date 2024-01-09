import apiClient from "./services.js";

export default{
    getAll(){
        return apiClient.get("/accommodations");
    },
    get(id){
        return apiClient.get(`accommodations/${id}`);
    },
    getAllForCategory(category){
        return apiClient.get("/accommodations/" + category)
    },
    create(data){
        return apiClient.post("accommodations", data);
    },
    update(id, data){
        return apiClient.put(`accommodations/${id}`, data);
    },
    delete(id){
        return apiClient.delete(`accommodations/${id}`);
    },
    deleteAll(){
        return apiClient.delete("accommodations");
    },
}