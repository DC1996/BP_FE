/*****************************************************************
 * File: categoryDataService.js
 * Description: Implements functions for comunicating with API about Category
 *
 * Project: Bachelor's Thesis - Web system for Math tests creation
 * Author: xcziro00, David Czirok
 *
 * Last modified: 07-05-2022
 */

import http from "../../axios.config";

class CategoryDataService {
  /**
   * Return all Categories
   * @returns {Promise}
   */
  getAll() {
    return http.get("/categories");
  }

  /**
   * Return single Category
   * 
   * @param {*} id 
   * @returns {Promise}
   */
  get(id) {
    return http.get(`/categories/${id}`);
  }

  /**
   * Find given Category by name
   * 
   * @param {Object} data 
   * @returns {Promise}
   */
  find(data) {
    return http.post("/categories/findByName", data);
  }

  /**
   * Create a new Category
   * 
   * @param {Object} data 
   * @returns {Promise}
   */
  create(data) {
    return http.post("/categories", data);
  }

  /**
   * Update existing Category
   * 
   * @param {*} id 
   * @param {Object} data 
   * @returns {Promise}
   */
  update(id, data) {
    return http.put(`/categories/${id}`, data);
  }

  /**
   * Delete given Category
   * 
   * @param {*} id 
   * @returns {Params}
   */
  delete(id) {
    return http.delete(`/categories/${id}`);
  }
}

export default new CategoryDataService();
