/*****************************************************************
 * File: generatorService.js
 * Description: Implements functions for comunicating with API about ConcreteTest
 *
 * Project: Bachelor's Thesis - Web system for Math tests creation
 * Author: xcziro00, David Czirok
 *
 * Last modified: 07-05-2022
 */

import http from "../../axios.config";

// Communicate with generator API
class GeneratorService {
  /**
   * Return generated task
   * 
   * @param {Object} data 
   * @returns {Promise}
   */
  generate(data) {
    return http.post("/generate", data);
  }

  /**
   * Return multiple generated tasks
   * 
   * @param {Object} data 
   * @returns {Promise}
   */
  generateMultiple(data) {
    return http.post("/generate/multiple", data);
  }
}

export default new GeneratorService();
