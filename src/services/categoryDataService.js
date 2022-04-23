import http from "../../axios.config";

class CategoryDataService {
  getAll() {
    return http.get("/categories");
  }

  get(id) {
    return http.get(`/categories/${id}`);
  }

  find(data) {
    return http.post("/categories/findByName", data);
  }

  create(data) {
    return http.post("/categories", data);
  }

  update(id, data) {
    return http.put(`/categories/${id}`, data);
  }

  delete(id) {
    return http.delete(`/categories/${id}`);
  }

  deleteAll() {
    return http.delete(`/categories`);
  }
}

export default new CategoryDataService();
