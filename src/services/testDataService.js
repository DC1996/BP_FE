/*****************************************************************
 * File: testDataService.js
 * Description: Implements functions for comunicating with API about Tests
 *
 * Project: Bachelor's Thesis - Web system for Math tests creation
 * Author: xcziro00, David Czirok
 *
 * Last modified: 07-05-2022
 */

import http from "../../axios.config";

class TestDataService {
  /**
   * Return all Tests
   * 
   * @returns 
   */
  getAll() {
    return http.get("/tests");
  }

  /**
   * Return a single Test
   * 
   * @param {*} id 
   * @returns {Promise}
   */
  get(id) {
    return http.get(`/tests/${id}`);
  }

  /**
   * Add a Task to a Test
   * 
   * @param {Object} data 
   * @returns {Promise}
   */
  addTask(data) {
    return http.post("/tests/add_task", data);
  }

  /**
   * Remove given Task from Test
   * 
   * @param {Object} data 
   * @returns {Promise}
   */
  removeTask(data) {
    return http.post("/tests/remove_task", data);
  }

  /**
   * Add multiple Tasks to a Test
   * 
   * @param {Object} data 
   * @returns {Promise}
   */
  addTasks(data) {
    return http.post("/tests/add_tasks", data);
  }

  /**
   * Create a new Test
   * 
   * @param {Object} data 
   * @returns {Promise}
   */
  create(data) {
    return http.post("/tests", data);
  }

  /**
   * Update an existing Test
   * 
   * @param {*} id 
   * @param {Object} data 
   * @returns {Promise}
   */
  update(id, data) {
    return http.put(`/tests/${id}`, data);
  }

  /**
   * Remove tasks for convenient insertion
   * 
   * @param {*} id 
   * @returns {Promise}
   */
  deteleTasks(id) {
    return http.delete(`/tests/${id}`);
  }

  /**
   * Delete given Test
   * 
   * @param {*} id 
   * @returns {Promise}
   */
  delete(id) {
    return http.delete(`/tests/${id}`);
  }
}

export default new TestDataService();
