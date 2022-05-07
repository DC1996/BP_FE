/*****************************************************************
 * File: userDataService.js
 * Description: Implements functions for comunicating with API about Users
 *
 * Project: Bachelor's Thesis - Web system for Math tests creation
 * Author: xcziro00, David Czirok
 *
 * Last modified: 07-05-2022
 */

import http from "../../axios.config";

class UserDataService {
  /**
   * Return all Users
   * 
   * @returns 
   */
  getAll() {
    return http.get("/users");
  }

  /**
   * Return a single User
   * 
   * @param {*} id 
   * @returns {Promise}
   */
  get(id) {
    return http.get(`/users/${id}`);
  }

  /**
   * Authorizes the user based on token
   * 
   * @param {*} data 
   * @param {Object} headerOptions 
   * @returns {Promise}
   */
  authorize(data, headerOptions) {
    return http.post("/users/authorize", data, headerOptions);
  }

  /**
   * Create (register) a new User
   * 
   * @param {Object} data 
   * @returns {Promise}
   */
  create(data) {
    return http.post("/users", data);
  }

  /**
   * Get all students assignments based on id
   * 
   * @param {*} id 
   * @returns {Promise}
   */
  getStudentAssignments(id) {
    return http.get(`/users/${id}/assignments`);
  }

  /**
   * Return all students from given grade
   * 
   * @param {Object} data 
   * @returns {Promise}
   */
  getStudentsByGrade(data) {
    return http.post("users/studentsByGrade", data);
  }

  /**
   * Log the User in
   * 
   * @param {Object} data 
   * @returns {Promise}
   */
  login(data) {
    return http.post("/users/login", data);
  }

  /**
   * Update existing user data
   * 
   * @param {*} id 
   * @param {Object} data 
   * @returns {Promise}
   */
  update(id, data) {
    return http.put(`/users/${id}`, data);
  }

  /**
   * Remove selected User
   * 
   * @param {*} id 
   * @returns {Promise}
   */
  delete(id) {
    return http.delete(`/users/${id}`);
  }
}

export default new UserDataService();
