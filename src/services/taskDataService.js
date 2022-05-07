/*****************************************************************
 * File: taskDataService.js
 * Description: Implements functions for comunicating with API about Tasks
 *
 * Project: Bachelor's Thesis - Web system for Math tests creation
 * Author: xcziro00, David Czirok
 *
 * Last modified: 07-05-2022
 */

import http from "../../axios.config";

class TaskDataService {
  /**
   * Return all Tasks
   * 
   * @returns {Promise} 
   */
  getAll() {
    return http.get("/tasks");
  }

  /**
   * Return single Task based on id
   * 
   * @param {*} id 
   * @returns 
   */
  get(id) {
    return http.get(`/tasks/${id}`);
  }

  /**
   * Return all Tasks matching certain criteria
   * 
   * @param {*} data 
   * @returns {Promise}
   */
  findAllMatching(data) {
    return http.post("/tasks/findAllMatching", data);
  }

  /**
   * Create a new Task
   * 
   * @param {Object} data 
   * @returns {Promise}
   */
  create(data) {
    return http.post("/tasks", data);
  }

  /**
   * Add Category to Task
   * 
   * @param {Object} data 
   * @returns {Promise}
   */
  addCategory(data) {
    return http.post("/tasks/add_category", data);
  }

  /**
   * Remove Category from Task
   * 
   * @param {Object} data 
   * @returns {Promise}
   */
  removeCategory(data) {
    return http.post("/tasks/remove_category", data);
  }

  /**
   * Update existing Task
   * 
   * @param {*} id 
   * @param {Object} data 
   * @returns {Promise} 
   */
  update(id, data) {
    return http.put(`/tasks/${id}`, data);
  }

  /**
   * Remove existing Task
   * 
   * @param {*} id 
   * @returns {Promise}
   */
  delete(id) {
    return http.delete(`/tasks/${id}`);
  }
}

export default new TaskDataService();
