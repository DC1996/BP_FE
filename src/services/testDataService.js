import http from "../../http-common";

class TestDataService {
  getAll() {
    return http.get("/tests");
  }

  get(id) {
    return http.get(`/tests/${id}`);
  }

  addTask(data) {
    return http.post("/tests/add_task", data);
  }

  removeTask(data) {
    return http.post("/tests/remove_task", data);
  }

  addTasks(data) {
    return http.post("/tests/add_tasks", data);
  }

  create(data) {
    return http.post("/tests", data);
  }

  update(id, data) {
    return http.put(`/tests/${id}`, data);
  }

  // Remove tasks for convenient insertion
  deteleTasks(id) {
    return http.delete(`/tests/${id}`);
  }

  delete(id) {
    return http.delete(`/tests/${id}`);
  }

  deleteAll() {
    return http.delete(`/tests`);
  }
}

export default new TestDataService();
