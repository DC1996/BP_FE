import http from "../../axios.config";

class TaskDataService {
  getAll() {
    return http.get("/tasks");
  }

  get(id) {
    return http.get(`/tasks/${id}`);
  }

  findAllMatching(data) {
    return http.post("/tasks/findAllMatching", data);
  }

  create(data) {
    return http.post("/tasks", data);
  }

  addCategory(data) {
    return http.post("/tasks/add_category", data);
  }

  removeCategory(data) {
    return http.post("/tasks/remove_category", data);
  }

  update(id, data) {
    return http.put(`/tasks/${id}`, data);
  }

  delete(id) {
    return http.delete(`/tasks/${id}`);
  }

  deleteAll() {
    return http.delete(`/tasks`);
  }
}

export default new TaskDataService();
