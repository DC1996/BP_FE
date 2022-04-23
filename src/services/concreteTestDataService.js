import http from "../../axios.config";

class ConcreteTestDataService {
  getAll() {
    return http.get("/concreteTests");
  }

  get(id) {
    return http.get(`/concreteTests/${id}`);
  }

  getResults(id) {
    return http.get(`/concreteTests/${id}/results`);
  }

  create(data) {
    return http.post("/concreteTests", data);
  }

  update(id, data) {
    return http.put(`/concreteTests/${id}`, data);
  }

  delete(id) {
    return http.delete(`/concreteTests/${id}`);
  }

  deleteAll() {
    return http.delete(`/concreteTests`);
  }
}

export default new ConcreteTestDataService();
