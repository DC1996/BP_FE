/*****************************************************************
 * File: axios.config.js
 * Description: Axios configuration file, sets up API endpoint URL
 *
 * Project: Bachelor's Thesis - Web system for Math tests creation
 * Author: xcziro00, David Czirok
 *
 * Last modified: 07-05-2022
 */
import axios from "axios";

export default axios.create({
  baseURL: "https://xcziro00-bp-server.herokuapp.com/api", // production build
  /* baseURL: "http://localhost:8080/" + "api/", */        // LOCAL TESTING
  headers: {
    "Content-type": "application/json",
  },
});
