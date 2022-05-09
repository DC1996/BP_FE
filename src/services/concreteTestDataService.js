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
  /**
   * Returns all ConcreteTests
   * 
   * @returns 
   */
  getAll() {
    return http.get("/concreteTests");
  }
  /**
   * Returns one conreteTest
   * 
   * @param {*} id 
   * @returns 
   */
  get(id) {
    return http.get(`/concreteTests/${id}`);
  }

  /**
   * Returns results for one concreteTest
   * 
   * @param {*} id 
   * @returns 
   */
  getResults(id) {
    return http.get(`/concreteTests/${id}/results`);
  }

  /**
   * Create new conreteTest
   * 
   * @param {*} data 
   * @returns 
   */
  create(data) {
    return http.post("/concreteTests", data);
  }

  /**
   * Updates conreteTest
   * 
   * @param {*} id 
   * @param {*} data 
   * @returns 
   */
  update(id, data) {
    return http.put(`/concreteTests/${id}`, data);
  }

  /**
   * Delete one conreteTest
   * 
   * @param {*} id 
   * @returns 
   */
  delete(id) {
    return http.delete(`/concreteTests/${id}`);
  }
}

export default new ConcreteTestDataService();
