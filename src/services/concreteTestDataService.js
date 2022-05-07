/*****************************************************************
 * File: concreteTestDataService.js
 * Description: Implements functions for comunicating with API about ConcreteTest
 *
 * Project: Bachelor's Thesis - Web system for Math tests creation
 * Author: xcziro00, David Czirok
 *
 * Last modified: 07-05-2022
 */

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
