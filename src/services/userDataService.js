import http from "../../axios.config";

class UserDataService {
  getAll() {
    return http.get("/users");
  }

  get(id) {
    return http.get(`/users/${id}`);
  }

  authorize(data, headerOptions) {
    return http.post("/users/authorize", data, headerOptions);
  }

  create(data) {
    return http.post("/users", data);
  }

  getStudentAssignments(id) {
    return http.get(`/users/${id}/assignments`);
  }

  getStudentsByGrade(data) {
    return http.post("users/studentsByGrade", data);
  }

  login(data) {
    return http.post("/users/login", data);
  }

  update(id, data) {
    return http.put(`/users/${id}`, data);
  }

  delete(id) {
    return http.delete(`/users/${id}`);
  }

  deleteAll() {
    return http.delete(`/users`);
  }
}

export default new UserDataService();
